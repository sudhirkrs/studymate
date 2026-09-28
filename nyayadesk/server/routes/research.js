import { Router } from 'express';
import { q, id, audit } from '../db.js';
import { runStream } from '../ai/client.js';
import { RESEARCH_MEMO, RESEARCH_QUICK } from '../ai/prompts.js';
import { verifyCitations } from '../ai/citations.js';
import { ACTION_COST } from '../data/plans.js';
import { checkAccess, recordUsage } from '../lib/usage.js';
import { sse, str, wrap } from '../lib/http.js';

export const researchRouter = Router();

export function matterContext(firmId, matterId) {
  if (!matterId) return { matter: null, text: '' };
  const m = q.get('SELECT * FROM matters WHERE id = ? AND firm_id = ?', matterId, firmId);
  if (!m) return { matter: null, text: '' };
  const parts = [
    `Matter: ${m.title}`,
    m.client && `Client: ${m.client}`,
    m.court && `Forum: ${m.court}`,
    m.case_number && `Case no.: ${m.case_number}`,
    m.practice_area && `Practice area: ${m.practice_area}`,
    m.notes && `Matter notes: ${m.notes}`,
  ].filter(Boolean);
  return { matter: m, text: `<matter_context>\n${parts.join('\n')}\n</matter_context>\n\n` };
}

researchRouter.post('/', wrap(async (req, res) => {
  const question = str(req.body.question, 12000);
  const mode = req.body.mode === 'memo' ? 'memo' : 'quick';
  if (question.length < 8) return res.status(400).json({ error: 'Please describe your question in a little more detail.' });
  const cost = mode === 'memo' ? ACTION_COST.research_memo : ACTION_COST.research_quick;
  const blocked = checkAccess(req.firm, cost);
  if (blocked) return res.status(402).json({ error: blocked });

  const { matter, text: ctx } = matterContext(req.user.firmId, req.body.matterId);

  // Follow-up questions carry the earlier exchange so the answer builds on it.
  const messages = [];
  if (req.body.followUpOf) {
    const prev = q.get('SELECT question, answer FROM research WHERE id = ? AND firm_id = ?', req.body.followUpOf, req.user.firmId);
    if (prev?.answer) {
      messages.push({ role: 'user', content: prev.question }, { role: 'assistant', content: prev.answer });
    }
  }
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  messages.push({ role: 'user', content: `${ctx}Today's date: ${today}.\n\n${question}` });

  const stream = sse(res);
  const abort = new AbortController();
  res.on('close', () => abort.abort());

  try {
    const result = await runStream({
      kind: 'research',
      system: mode === 'memo' ? RESEARCH_MEMO : RESEARCH_QUICK,
      messages,
      webSearch: true,
      maxSearches: mode === 'memo' ? 12 : 5,
      effort: mode === 'memo' ? 'xhigh' : 'high',
      maxTokens: mode === 'memo' ? 64000 : 32000,
      signal: abort.signal,
      onEvent: (e) => stream.send(e),
    });
    const citations = verifyCitations(result.text, result.sources);
    const rid = id('res');
    q.run(`INSERT INTO research (id, firm_id, user_id, matter_id, mode, question, answer, sources_json, citations_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      rid, req.user.firmId, req.user.id, matter?.id || null, mode, question, result.text,
      JSON.stringify(result.sources.map(({ url, title }) => ({ url, title }))), JSON.stringify(citations));
    recordUsage(req.user.firmId, req.user.id, `research_${mode}`, cost, result.usage);
    audit(req.user.firmId, req.user.id, 'research.run', rid, req.ip);
    stream.send({ type: 'citations', citations });
    stream.send({ type: 'done', id: rid, demo: Boolean(result.demo) });
  } catch (err) {
    if (!abort.signal.aborted) {
      console.error('research failed', err);
      stream.send({ type: 'error', message: 'The research service is temporarily unavailable. Please try again in a minute.' });
    }
  } finally {
    stream.end();
  }
}));

researchRouter.get('/', (req, res) => {
  const rows = q.all(
    `SELECT r.id, r.mode, r.question, r.created_at, r.matter_id, u.name AS author
       FROM research r JOIN users u ON u.id = r.user_id
      WHERE r.firm_id = ? AND (? IS NULL OR r.matter_id = ?)
      ORDER BY r.created_at DESC LIMIT 100`,
    req.user.firmId, req.query.matter || null, req.query.matter || null);
  res.json(rows);
});

researchRouter.get('/:id', (req, res) => {
  const r = q.get('SELECT * FROM research WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json({ ...r, sources: JSON.parse(r.sources_json || '[]'), citations: JSON.parse(r.citations_json || '[]') });
});

researchRouter.delete('/:id', (req, res) => {
  const r = q.run('DELETE FROM research WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  audit(req.user.firmId, req.user.id, 'research.deleted', req.params.id, req.ip);
  res.json({ ok: true });
});
