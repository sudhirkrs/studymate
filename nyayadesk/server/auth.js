// Password hashing (scrypt), opaque session tokens stored hashed, and
// middleware that attaches { user, firm } to every authenticated request.
import crypto from 'node:crypto';
import { config } from './config.js';
import { q } from './db.js';

const SCRYPT = { N: 16384, r: 8, p: 1 };
const COOKIE = 'nd_session';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, SCRYPT);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length, SCRYPT);
  return crypto.timingSafeEqual(expected, actual);
}

export function validatePassword(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Password must be at least 10 characters.';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password must contain letters and numbers.';
  return null;
}

export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

export function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + config.sessionDays * 864e5);
  q.run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
    sha256(token), userId, expires.toISOString());
  q.run("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", userId);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    expires,
    path: '/',
  });
  return token;
}

export function destroySession(req, res) {
  const token = readToken(req);
  if (token) q.run('DELETE FROM sessions WHERE token_hash = ?', sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
}

function readToken(req) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function loadSession(req, _res, next) {
  const token = readToken(req);
  if (token) {
    const row = q.get(
      `SELECT u.id AS user_id, u.firm_id, u.email, u.name, u.role, u.bar_enrolment, u.active, s.expires_at
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ?`, sha256(token));
    if (row && row.active && new Date(row.expires_at) > new Date()) {
      req.user = { id: row.user_id, firmId: row.firm_id, email: row.email, name: row.name, role: row.role, barEnrolment: row.bar_enrolment };
      req.firm = q.get('SELECT * FROM firms WHERE id = ?', row.firm_id);
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in.' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in.' });
  if (!['owner', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Only firm admins can do this.' });
  next();
}

export function purgeExpiredSessions() {
  q.run("DELETE FROM sessions WHERE expires_at < ?", new Date().toISOString());
  q.run("DELETE FROM invites WHERE expires_at < ?", new Date().toISOString());
}
