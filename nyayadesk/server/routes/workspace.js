// Matters, deterministic legal tools, and firm administration.
import crypto from 'node:crypto';
import { Router } from 'express';
import { q, id, audit } from '../db.js';
import { requireAdmin, sha256 } from '../auth.js';
import { str } from '../lib/http.js';
import { CODES, convertSection } from '../data/criminal-law-map.js';
import { LIMITATION, computeLimitation } from '../data/limitation.js';
import { LABOUR_HIGHLIGHTS } from '../data/labour.js';
import { PLANS } from '../data/plans.js';
import { usageSummary } from '../lib/usage.js';
import { config } from '../config.js';

// ── Matters ────────────────────────────────────────────────────────────────
export const mattersRouter = Router();

mattersRouter.get('/', (req, res) => {
  res.json(q.all(
    `SELECT m.*,
       (SELECT COUNT(*) FROM research r WHERE r.matter_id = m.id) AS research_count,
       (SELECT COUNT(*) FROM drafts d WHERE d.matter_id = m.id) AS draft_count,
       (SELECT COUNT(*) FROM documents x WHERE x.matter_id = m.id) AS document_count
     FROM matters m WHERE m.firm_id = ? ORDER BY m.status = 'closed', m.updated_at DESC`, req.user.firmId));
});

mattersRouter.post('/', (req, res) => {
  const title = str(req.body.title, 200);
  if (!title) return res.status(400).json({ error: 'Matter title is required.' });
  const mid = id('mat');
  q.run(`INSERT INTO matters (id, firm_id, title, client, court, case_number, practice_area, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    mid, req.user.firmId, title, str(req.body.client, 200) || null, str(req.body.court, 200) || null,
    str(req.body.caseNumber, 100) || null, str(req.body.practiceArea, 100) || null, str(req.body.notes, 8000) || null, req.user.id);
  audit(req.user.firmId, req.user.id, 'matter.created', mid, req.ip);
  res.status(201).json({ id: mid });
});

mattersRouter.put('/:id', (req, res) => {
  const r = q.run(
    `UPDATE matters SET title = COALESCE(NULLIF(?, ''), title), client = ?, court = ?, case_number = ?, practice_area = ?, notes = ?,
       status = CASE WHEN ? IN ('open','closed') THEN ? ELSE status END, updated_at = datetime('now')
     WHERE id = ? AND firm_id = ?`,
    str(req.body.title, 200), str(req.body.client, 200) || null, str(req.body.court, 200) || null, str(req.body.caseNumber, 100) || null,
    str(req.body.practiceArea, 100) || null, str(req.body.notes, 8000) || null, req.body.status || '', req.body.status || '', req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

mattersRouter.delete('/:id', (req, res) => {
  const r = q.run('DELETE FROM matters WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!r.changes) return res.status(404).json({ error: 'Not found' });
  audit(req.user.firmId, req.user.id, 'matter.deleted', req.params.id, req.ip);
  res.json({ ok: true });
});

// ── Deterministic tools (no AI, no quota) ─────────────────────────────────
export const toolsRouter = Router();

toolsRouter.get('/codes', (_req, res) => {
  res.json({
    ...Object.fromEntries(Object.entries(CODES).map(([k, v]) => [k, { from: v.from, to: v.to, rows: v.rows }])),
    labourHighlights: LABOUR_HIGHLIGHTS,
  });
});

toolsRouter.get('/convert', (req, res) => {
  res.json(convertSection(String(req.query.code || 'ipc'), String(req.query.q || ''), req.query.dir === 'new-to-old' ? 'new-to-old' : 'old-to-new'));
});

toolsRouter.get('/limitation', (_req, res) => res.json(LIMITATION));

toolsRouter.post('/limitation', (req, res) => {
  try {
    res.json(computeLimitation(String(req.body.id), String(req.body.startDate), Number(req.body.excludedDays) || 0));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Firm administration ───────────────────────────────────────────────────
export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get('/team', (req, res) => {
  res.json({
    users: q.all('SELECT id, name, email, role, bar_enrolment, active, last_login_at, created_at FROM users WHERE firm_id = ? ORDER BY created_at', req.user.firmId),
    invites: q.all('SELECT email, role, expires_at FROM invites WHERE firm_id = ? AND expires_at > ?', req.user.firmId, new Date().toISOString()),
  });
});

adminRouter.post('/invites', (req, res) => {
  const email = str(req.body.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email.' });
  const role = req.body.role === 'admin' ? 'admin' : 'member';
  if (q.get('SELECT 1 FROM users WHERE email = ?', email)) return res.status(409).json({ error: 'That person already has an account.' });
  const firm = req.firm;
  const seatCap = firm.plan === 'trial' ? PLANS.trial.maxSeats : firm.seats;
  const used = q.get('SELECT COUNT(*) AS n FROM users WHERE firm_id = ? AND active = 1', firm.id).n
    + q.get('SELECT COUNT(*) AS n FROM invites WHERE firm_id = ? AND expires_at > ?', firm.id, new Date().toISOString()).n;
  if (used >= seatCap) return res.status(403).json({ error: `All ${seatCap} seats are in use. Add seats in Billing first.` });
  const token = crypto.randomBytes(24).toString('base64url');
  q.run('INSERT INTO invites (token_hash, firm_id, email, role, expires_at, created_by) VALUES (?, ?, ?, ?, ?, ?)',
    sha256(token), firm.id, email, role, new Date(Date.now() + 7 * 864e5).toISOString(), req.user.id);
  audit(firm.id, req.user.id, 'user.invited', email, req.ip);
  // Email delivery is left to the operator's mail provider; the link is returned so admins can share it directly.
  res.status(201).json({ link: `${config.publicUrl}/app/#/join/${token}` });
});

adminRouter.put('/users/:id', (req, res) => {
  const u = q.get('SELECT * FROM users WHERE id = ? AND firm_id = ?', req.params.id, req.user.firmId);
  if (!u) return res.status(404).json({ error: 'Not found' });
  if (u.role === 'owner') return res.status(400).json({ error: "The firm owner's access cannot be changed here." });
  const role = ['admin', 'member'].includes(req.body.role) ? req.body.role : u.role;
  const active = req.body.active === undefined ? u.active : req.body.active ? 1 : 0;
  q.run('UPDATE users SET role = ?, active = ? WHERE id = ?', role, active, u.id);
  if (!active) q.run('DELETE FROM sessions WHERE user_id = ?', u.id);
  audit(req.user.firmId, req.user.id, active ? 'user.updated' : 'user.deactivated', u.email, req.ip);
  res.json({ ok: true });
});

adminRouter.put('/firm', (req, res) => {
  q.run('UPDATE firms SET name = COALESCE(NULLIF(?, \'\'), name), city = ?, gstin = ?, billing_state = ? WHERE id = ?',
    str(req.body.name, 200), str(req.body.city, 100) || null, str(req.body.gstin, 15).toUpperCase() || null, str(req.body.billingState, 2) || null, req.user.firmId);
  audit(req.user.firmId, req.user.id, 'firm.updated', null, req.ip);
  res.json({ ok: true });
});

adminRouter.get('/usage', (req, res) => {
  const byUser = q.all(
    `SELECT u.name, u.email, COALESCE(SUM(e.actions),0) AS actions, COUNT(e.id) AS calls
       FROM users u LEFT JOIN usage_events e ON e.user_id = u.id AND e.created_at >= ?
      WHERE u.firm_id = ? GROUP BY u.id ORDER BY actions DESC`, usageSummary(req.firm).periodStart, req.user.firmId);
  const byKind = q.all(
    `SELECT kind, SUM(actions) AS actions, COUNT(*) AS calls FROM usage_events
      WHERE firm_id = ? AND created_at >= ? GROUP BY kind ORDER BY actions DESC`, req.user.firmId, usageSummary(req.firm).periodStart);
  const daily = q.all(
    `SELECT substr(created_at, 1, 10) AS day, SUM(actions) AS actions FROM usage_events
      WHERE firm_id = ? AND created_at >= datetime('now', '-30 days') GROUP BY day ORDER BY day`, req.user.firmId);
  res.json({ summary: usageSummary(req.firm), byUser, byKind, daily });
});

adminRouter.get('/audit', (req, res) => {
  res.json(q.all(
    `SELECT a.action, a.target, a.ip, a.created_at, u.name AS user FROM audit_log a LEFT JOIN users u ON u.id = a.user_id
      WHERE a.firm_id = ? ORDER BY a.id DESC LIMIT 500`, req.user.firmId));
});

// DPDP Act: data principal / customer export of everything the firm stored.
adminRouter.get('/export', (req, res) => {
  const f = req.user.firmId;
  audit(f, req.user.id, 'firm.exported', null, req.ip);
  res.setHeader('Content-Disposition', 'attachment; filename="nyayadesk-export.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    firm: q.get('SELECT id, name, city, gstin, plan, seats, created_at FROM firms WHERE id = ?', f),
    users: q.all('SELECT id, name, email, role, bar_enrolment, created_at FROM users WHERE firm_id = ?', f),
    matters: q.all('SELECT * FROM matters WHERE firm_id = ?', f),
    research: q.all('SELECT id, matter_id, mode, question, answer, sources_json, created_at FROM research WHERE firm_id = ?', f),
    drafts: q.all('SELECT id, matter_id, title, body, created_at, updated_at FROM drafts WHERE firm_id = ?', f),
    reviews: q.all('SELECT id, document_id, mode, instructions, result, created_at FROM reviews WHERE firm_id = ?', f),
    documents: q.all('SELECT id, filename, size, created_at FROM documents WHERE firm_id = ?', f),
  });
});
