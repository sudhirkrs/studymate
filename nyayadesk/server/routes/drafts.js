import { Router } from 'express';
import { q, id, audit } from '../db.js';
import { runStream } from '../ai/client.js';
import { DRAFTING, REDRAFT } from '../ai/prompts.js';
import { CATEGORIES, TEMPLATES, templateById } from '../data/templates.js';
import { ACTION_COST, PLANS } from '../data/plans.js';
import { checkAccess, recordUsage } from '../lib/usage.js';
import { sse, str, wrap } from '../lib/http.js';
import { draftToDocx } from '../lib/docx-export.js';
import { matterContext } from './research.js';
import { requireAdmin } from '../auth.js';

export const draftsRouter = Router();

draftsRouter.get('/templates', (req, res) => {
  const firmTemplates = q.all('SELECT id, name, category, instructions, sample FROM firm_templates WHERE firm_id = ? ORDER BY name', req.user.firmId)
    .map((t) => ({ ...t, firm: true, category: t.category || 'Firm templates', fields: [{ key: 'facts', label: 'Facts and instructions', long: true }] }));
  res.json({ categories: [...CATEGORIES, ...(firmTemplates.length ? ['Firm templates'] : [])], templates: [...TEMPLATES, ...firmTemplates] });
});

function resolveTemplate(firmId, templateId) {
  const builtIn = templateById(templateId);
  if (builtIn) return builtIn;
  const ft = q.get('SELECT * FROM firm_templates WHERE id = ? AND firm_id = ?', templateId, firmId);
  if (!ft) return null;
  return { id: ft.id, name: ft.name, instructions: ft.instructions, sample: ft.sample, fields: [{ key: 'facts', label: 'Facts and instructions', long: true }] };
}

function buildBrief(template, inputs, extra, ctx, user) {
  const lines = template.fields.map((f) => `${f.label}: ${str(inputs?.[f.key], 8000) || '[NOT PROVIDED]'}`);
  let brief = `${ctx}Document to draft: ${template.name}\n\nForum and format instructions:\n${template.instructions}\n\nFacts supplied by the advocate:\n${lines.join('\n')}`;
  if (extra) brief += `\n\nAdditional instructions from the advocate:\n${extra}`;
  if (template.sample) brief += `\n\nThe firm's house style — follow this precedent's structure and tone:\n<precedent>\n${template.sample}\n</precedent>`;
  if (user.barEnrolment) brief += `\n\nAdvocate signing: ${user.name}, Enrolment No. ${user.barEnrolment}`;
  return brief;
}

draftsRouter.post('/generate', wrap(async (req, res) => {
  const template = resolveTemplate(req.user.firmId, req.body.templateId);
  if (!template) return res.status(400).json({ error: 'Choose a document type.' });
  const blocked = checkAccess(req.firm, ACTION_COST.draft);
  if (blocked) return res.status(402).json({ error: blocked });

  const { matter, text: ctx } = matterContext(req.user.firmId, req.body.matterId);
  const brief = buildBrief(template, req.body.inputs, str(req.body.extra, 6000), ctx, req.user);
  const stream = sse(res);
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const result = await runStream({
      kind: 'draft',
      system: DRAFTING,
      messages: [{ role: 'user', content: brief }],
      effort: 'high',
      maxTokens: 64000,
      signal: abort.signal,
      onEvent: (e) => e.type === 'text' && stream.send(e),
    });
    const did = id('drf');
    const title = str(req.body.title, 200) || `${template.name}${matter ? ` — ${matter.title}` : ''}`;
    q.run(`INSERT INTO drafts (id, firm_id, user_id, matter_id, template_id, title, inputs_json, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      did, req.user.firmId, req.user.id, matter?.id || null, template.id, title, JSON.stringify(req.body.inputs || {}), result.text);
    recordUsage(req.user.firmId, req.user.id, 'draft', ACTION_COST.draft, result.usage);
    audit(req.user.firmId, req.user.id, 'draft.generated', did, req.ip);
    stream.send({ type: 'done', id: did, title });
  } catch (err) {
    if (!abort.signal.aborted) {
      console.error('draft failed', err);
      stream.send({ type: 'error', message: 'Drafting is temporarily unavailable. Please try again in a minute.' });
    }
  } finally {
    stream.end();
  }
}));

draftsRouter.post('/:id/redraft', wrap(async (req, res) => {
  const d = q.get('SELECT * FROM drafts WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!d) return res.status(404).json({ error: 'Not found' });
  const instruction = str(req.body.instruction, 4000);
  if (!instruction) return res.status(400).json({ error: 'Say what you want changed.' });
  const blocked = checkAccess(req.firm, ACTION_COST.redraft);
  if (blocked) return res.status(402).json({ error: blocked });
  const body = str(req.body.body, 200000) || d.body;
  const selection = str(req.body.selection, 20000);

  const stream = sse(res);
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const content = `<current_draft>\n${body}\n</current_draft>\n\n${selection ? `The advocate has selected this passage to change:\n<selection>\n${selection}\n</selection>\n\n` : ''}Instruction: ${instruction}`;
    const result = await runStream({
      kind: 'redraft', system: REDRAFT, messages: [{ role: 'user', content }], effort: 'high', maxTokens: 64000,
      signal: abort.signal, onEvent: (e) => e.type === 'text' && stream.send(e),
    });
    q.run("UPDATE drafts SET body = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?", result.text, d.id);
    recordUsage(req.user.firmId, req.user.id, 'redraft', ACTION_COST.redraft, result.usage);
    audit(req.user.firmId, req.user.id, 'draft.redrafted', d.id, req.ip);
    stream.send({ type: 'done', id: d.id });
  } catch (err) {
    if (!abort.signal.aborted) {
      console.error('redraft failed', err);
      stream.send({ type: 'error', message: 'Redrafting is temporarily unavailable. Please try again.' });
    }
  } finally {
    stream.end();
  }
}));

draftsRouter.get('/', (req, res) => {
  res.json(q.all(
    `SELECT d.id, d.title, d.template_id, d.version, d.matter_id, d.updated_at, u.name AS author
       FROM drafts d JOIN users u ON u.id = d.user_id
      WHERE d.firm_id = ? AND (? IS NULL OR d.matter_id = ?) ORDER BY d.updated_at DESC LIMIT 200`,
    req.user.firmId, req.query.matter || null, req.query.matter || null));
});

draftsRouter.get('/:id', (req, res) => {
  const d = q.get('SELECT * FROM drafts WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json({ ...d, inputs: JSON.parse(d.inputs_json || '{}') });
});

draftsRouter.put('/:id', (req, res) => {
  const r = q.run("UPDATE drafts SET body = ?, title = COALESCE(NULLIF(?, ''), title), version = version + 1, updated_at = datetime('now') WHERE id = ? AND firm_id = ?",
    str(req.body.body, 400000), str(req.body.title, 200), req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

draftsRouter.delete('/:id', (req, res) => {
  const r = q.run('DELETE FROM drafts WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  audit(req.user.firmId, req.user.id, 'draft.deleted', req.params.id, req.ip);
  res.json({ ok: true });
});

draftsRouter.get('/:id/docx', wrap(async (req, res) => {
  const d = q.get('SELECT * FROM drafts WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!d) return res.status(404).json({ error: 'Not found' });
  const buf = await draftToDocx(d.title, d.body);
  const safe = d.title.replace(/[^\w\- ]+/g, '').trim().slice(0, 80) || 'draft';
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${safe}.docx"`);
  audit(req.user.firmId, req.user.id, 'draft.exported', d.id, req.ip);
  res.send(buf);
}));

// Firm precedent templates (house style)
draftsRouter.post('/firm-templates', requireAdmin, (req, res) => {
  if (!PLANS[req.firm.plan]?.features.includes('firm_templates') && req.firm.plan !== 'trial') {
    return res.status(403).json({ error: 'Firm templates are available on the Chambers and Firm plans.' });
  }
  const name = str(req.body.name, 200);
  const instructions = str(req.body.instructions, 8000);
  if (!name || !instructions) return res.status(400).json({ error: 'Name and instructions are required.' });
  const tid = id('ftp');
  q.run('INSERT INTO firm_templates (id, firm_id, name, category, instructions, sample, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    tid, req.user.firmId, name, str(req.body.category, 80) || 'Firm templates', instructions, str(req.body.sample, 60000) || null, req.user.id);
  audit(req.user.firmId, req.user.id, 'template.created', tid, req.ip);
  res.status(201).json({ id: tid });
});

draftsRouter.delete('/firm-templates/:id', requireAdmin, (req, res) => {
  const r = q.run('DELETE FROM firm_templates WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});
