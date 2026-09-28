import { Router } from 'express';
import { q, id, audit } from '../db.js';
import { createSession, destroySession, hashPassword, sha256, validatePassword, verifyPassword } from '../auth.js';
import { rateLimit, str, wrap } from '../lib/http.js';
import { PLANS } from '../data/plans.js';
import { usageSummary } from '../lib/usage.js';
import { config } from '../config.js';

export const authRouter = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60e3, max: 20, key: (req) => `auth:${req.ip}` });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

authRouter.post('/signup', authLimiter, wrap(async (req, res) => {
  const name = str(req.body.name, 120);
  const email = str(req.body.email, 200).toLowerCase();
  const firmName = str(req.body.firm, 200);
  const password = String(req.body.password || '');
  if (!name || !firmName) return res.status(400).json({ error: 'Your name and firm name are required.' });
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ error: pwErr });
  if (!req.body.acceptTerms) return res.status(400).json({ error: 'Please accept the Terms of Service and Privacy Policy.' });
  if (q.get('SELECT 1 FROM users WHERE email = ?', email)) return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' });

  const firmId = id('firm');
  const userId = id('usr');
  const now = new Date();
  const trialEnds = new Date(now.getTime() + PLANS.trial.trialDays * 864e5);
  q.run(`INSERT INTO firms (id, name, city, plan, seats, status, trial_ends_at, period_start) VALUES (?, ?, ?, 'trial', 1, 'trialing', ?, ?)`,
    firmId, firmName, str(req.body.city, 100) || null, trialEnds.toISOString(), now.toISOString().replace('T', ' ').slice(0, 19));
  q.run(`INSERT INTO users (id, firm_id, email, name, role, bar_enrolment, password_hash) VALUES (?, ?, ?, ?, 'owner', ?, ?)`,
    userId, firmId, email, name, str(req.body.barEnrolment, 60) || null, hashPassword(password));
  audit(firmId, userId, 'firm.created', firmName, req.ip);
  createSession(res, userId);
  res.status(201).json({ ok: true });
}));

authRouter.post('/login', authLimiter, wrap(async (req, res) => {
  const email = str(req.body.email, 200).toLowerCase();
  const user = q.get('SELECT * FROM users WHERE email = ?', email);
  // Always run a hash comparison so response time doesn't reveal whether the email exists.
  const ok = verifyPassword(String(req.body.password || ''), user?.password_hash || 'scrypt$00$00');
  if (!user || !ok || !user.active) return res.status(401).json({ error: 'Incorrect email or password.' });
  createSession(res, user.id);
  audit(user.firm_id, user.id, 'user.login', null, req.ip);
  res.json({ ok: true });
}));

authRouter.post('/logout', (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});

authRouter.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not signed in.' });
  const f = req.firm;
  res.json({
    user: req.user,
    firm: { id: f.id, name: f.name, city: f.city, gstin: f.gstin, plan: f.plan, planName: PLANS[f.plan]?.name, features: (PLANS[f.plan] || PLANS.trial).features, seats: f.seats, status: f.status, trialEndsAt: f.trial_ends_at },
    usage: usageSummary(f),
    demoMode: config.demoMode,
  });
});

authRouter.get('/invite/:token', (req, res) => {
  const inv = q.get('SELECT i.email, f.name AS firm FROM invites i JOIN firms f ON f.id = i.firm_id WHERE token_hash = ? AND expires_at > ?',
    sha256(req.params.token), new Date().toISOString());
  if (!inv) return res.status(404).json({ error: 'This invitation is invalid or has expired.' });
  res.json(inv);
});

authRouter.post('/invite/:token', authLimiter, wrap(async (req, res) => {
  const inv = q.get('SELECT * FROM invites WHERE token_hash = ? AND expires_at > ?', sha256(req.params.token), new Date().toISOString());
  if (!inv) return res.status(404).json({ error: 'This invitation is invalid or has expired.' });
  const name = str(req.body.name, 120);
  const password = String(req.body.password || '');
  const pwErr = validatePassword(password);
  if (!name) return res.status(400).json({ error: 'Your name is required.' });
  if (pwErr) return res.status(400).json({ error: pwErr });
  if (q.get('SELECT 1 FROM users WHERE email = ?', inv.email)) return res.status(409).json({ error: 'An account with this email already exists.' });
  const firm = q.get('SELECT * FROM firms WHERE id = ?', inv.firm_id);
  const active = q.get('SELECT COUNT(*) AS n FROM users WHERE firm_id = ? AND active = 1', inv.firm_id).n;
  if (active >= firm.seats && firm.plan !== 'trial') return res.status(403).json({ error: 'Your firm has no free seats. Ask your admin to add a seat.' });
  const userId = id('usr');
  q.run(`INSERT INTO users (id, firm_id, email, name, role, bar_enrolment, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    userId, inv.firm_id, inv.email, name, inv.role, str(req.body.barEnrolment, 60) || null, hashPassword(password));
  q.run('DELETE FROM invites WHERE token_hash = ?', inv.token_hash);
  audit(inv.firm_id, userId, 'user.joined', inv.email, req.ip);
  createSession(res, userId);
  res.status(201).json({ ok: true });
}));

authRouter.post('/password', wrap(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Please sign in.' });
  const user = q.get('SELECT * FROM users WHERE id = ?', req.user.id);
  if (!verifyPassword(String(req.body.current || ''), user.password_hash)) return res.status(400).json({ error: 'Current password is incorrect.' });
  const pwErr = validatePassword(String(req.body.password || ''));
  if (pwErr) return res.status(400).json({ error: pwErr });
  q.run('UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(String(req.body.password)), user.id);
  q.run('DELETE FROM sessions WHERE user_id = ?', user.id);
  createSession(res, user.id);
  audit(user.firm_id, user.id, 'user.password_changed', null, req.ip);
  res.json({ ok: true });
}));
