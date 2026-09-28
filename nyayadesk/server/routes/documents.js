import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { q, id, audit } from '../db.js';
import { config } from '../config.js';
import { runStream } from '../ai/client.js';
import { REVIEW } from '../ai/prompts.js';
import { ACTION_COST } from '../data/plans.js';
import { checkAccess, recordUsage } from '../lib/usage.js';
import { sse, str, wrap } from '../lib/http.js';
import { extractText, isPdfBuffer, kindFor } from '../lib/extract.js';
import { matterContext } from './research.js';

export const documentsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.uploadMaxMb * 1024 * 1024, files: 1 } });

const uploadDir = (firmId) => path.join(config.dataDir, 'uploads', firmId);

documentsRouter.post('/', upload.single('file'), wrap(async (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: 'Attach a PDF, DOCX or TXT file.' });
  const kind = kindFor(f.mimetype, f.originalname);
  if (!kind) return res.status(415).json({ error: 'Only PDF, DOCX and TXT files are supported.' });
  if (kind === 'pdf' && !isPdfBuffer(f.buffer)) return res.status(415).json({ error: 'That file is not a valid PDF.' });

  let text = null;
  try {
    text = await extractText(f.buffer, kind);
  } catch {
    return res.status(422).json({ error: 'Could not read that document. Is it password-protected or corrupted?' });
  }
  const did = id('doc');
  const dir = uploadDir(req.user.firmId);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const storagePath = path.join(dir, `${did}.${kind}`);
  fs.writeFileSync(storagePath, f.buffer, { mode: 0o600 });
  const matterId = req.body.matterId && q.get('SELECT id FROM matters WHERE id = ? AND firm_id = ?', req.body.matterId, req.user.firmId)?.id;
  q.run('INSERT INTO documents (id, firm_id, user_id, matter_id, filename, mime, size, storage_path, text_content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    did, req.user.firmId, req.user.id, matterId || null, f.originalname.slice(0, 200), kind === 'pdf' ? 'application/pdf' : f.mimetype, f.size, storagePath, text);
  audit(req.user.firmId, req.user.id, 'document.uploaded', did, req.ip);
  res.status(201).json({ id: did, filename: f.originalname, size: f.size, kind });
}));

documentsRouter.get('/', (req, res) => {
  res.json(q.all(
    `SELECT d.id, d.filename, d.size, d.mime, d.matter_id, d.created_at, u.name AS author
       FROM documents d JOIN users u ON u.id = d.user_id WHERE d.firm_id = ? ORDER BY d.created_at DESC LIMIT 200`, req.user.firmId));
});

documentsRouter.delete('/:id', (req, res) => {
  const d = q.get('SELECT * FROM documents WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!d) return res.status(404).json({ error: 'Not found' });
  if (d.storage_path) fs.rmSync(d.storage_path, { force: true });
  q.run('DELETE FROM documents WHERE id = ?', d.id);
  audit(req.user.firmId, req.user.id, 'document.deleted', d.id, req.ip);
  res.json({ ok: true });
});

documentsRouter.post('/:id/review', wrap(async (req, res) => {
  const d = q.get('SELECT * FROM documents WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!d) return res.status(404).json({ error: 'Document not found.' });
  const mode = Object.hasOwn(REVIEW, req.body.mode) ? req.body.mode : 'custom';
  const instructions = str(req.body.instructions, 4000);
  if (mode === 'custom' && !instructions) return res.status(400).json({ error: 'Type your question about the document.' });
  const blocked = checkAccess(req.firm, ACTION_COST.review);
  if (blocked) return res.status(402).json({ error: blocked });

  let docBlock;
  if (d.mime === 'application/pdf') {
    if (!d.storage_path || !fs.existsSync(d.storage_path)) return res.status(410).json({ error: 'This file was removed under the retention policy. Upload it again.' });
    docBlock = { type: 'document', title: d.filename, source: { type: 'base64', media_type: 'application/pdf', data: fs.readFileSync(d.storage_path).toString('base64') } };
  } else {
    docBlock = { type: 'document', title: d.filename, source: { type: 'text', media_type: 'text/plain', data: d.text_content || '' } };
  }
  const { text: ctx } = matterContext(req.user.firmId, req.body.matterId || d.matter_id);
  const ask = `${ctx}${instructions ? `Advocate's instructions: ${instructions}` : 'Proceed with the review.'}`;

  const stream = sse(res);
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const result = await runStream({
      kind: 'review',
      system: REVIEW[mode],
      messages: [{ role: 'user', content: [docBlock, { type: 'text', text: ask }] }],
      effort: 'high',
      maxTokens: 64000,
      signal: abort.signal,
      onEvent: (e) => e.type === 'text' && stream.send(e),
    });
    const rid = id('rev');
    q.run('INSERT INTO reviews (id, firm_id, user_id, document_id, mode, instructions, result) VALUES (?, ?, ?, ?, ?, ?, ?)',
      rid, req.user.firmId, req.user.id, d.id, mode, instructions || null, result.text);
    recordUsage(req.user.firmId, req.user.id, `review_${mode}`, ACTION_COST.review, result.usage);
    audit(req.user.firmId, req.user.id, 'document.reviewed', d.id, req.ip);
    stream.send({ type: 'done', id: rid });
  } catch (err) {
    if (!abort.signal.aborted) {
      console.error('review failed', err);
      stream.send({ type: 'error', message: 'Document review is temporarily unavailable. Please try again.' });
    }
  } finally {
    stream.end();
  }
}));

documentsRouter.get('/:id/reviews', (req, res) => {
  res.json(q.all('SELECT id, mode, instructions, result, created_at FROM reviews WHERE document_id = ? AND firm_id = ? ORDER BY created_at DESC',
    req.params.id, req.user.firmId));
});

// Storage limitation: delete uploaded client files after the retention window.
export function purgeOldUploads() {
  const cutoff = new Date(Date.now() - config.uploadRetentionDays * 864e5).toISOString().replace('T', ' ').slice(0, 19);
  const old = q.all('SELECT id, storage_path FROM documents WHERE created_at < ? AND storage_path IS NOT NULL', cutoff);
  for (const d of old) {
    fs.rmSync(d.storage_path, { force: true });
    q.run('UPDATE documents SET storage_path = NULL, text_content = NULL WHERE id = ?', d.id);
  }
  return old.length;
}
