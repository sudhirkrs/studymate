// SQLite storage via Node's built-in driver (no native build step).
// Every tenant-owned table carries firm_id and every query filters on it;
// that column is the isolation boundary between customer firms.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';

const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS firms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  gstin TEXT,
  billing_state TEXT,
  plan TEXT NOT NULL DEFAULT 'trial',
  seats INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'trialing',      -- trialing | active | past_due | cancelled
  trial_ends_at TEXT,
  period_start TEXT NOT NULL,
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',           -- owner | admin | member
  bar_enrolment TEXT,
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invites (
  token_hash TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  expires_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matters (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client TEXT,
  court TEXT,
  case_number TEXT,
  practice_area TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS research (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  matter_id TEXT REFERENCES matters(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  sources_json TEXT,
  citations_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  matter_id TEXT REFERENCES matters(id) ON DELETE SET NULL,
  template_id TEXT,
  title TEXT NOT NULL,
  inputs_json TEXT,
  body TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  matter_id TEXT REFERENCES matters(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  storage_path TEXT,
  text_content TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  instructions TEXT,
  result TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS firm_templates (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  instructions TEXT NOT NULL,
  sample TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS usage_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  actions INTEGER NOT NULL,
  model TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cache_read_tokens INTEGER NOT NULL DEFAULT 0,
  web_searches INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS usage_firm_time ON usage_events(firm_id, created_at);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firm_id TEXT NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  target TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS audit_firm_time ON audit_log(firm_id, created_at);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  number TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  seats INTEGER NOT NULL,
  taxable_paise INTEGER NOT NULL,
  cgst_paise INTEGER NOT NULL,
  sgst_paise INTEGER NOT NULL,
  igst_paise INTEGER NOT NULL,
  total_paise INTEGER NOT NULL,
  razorpay_payment_id TEXT,
  period_start TEXT,
  period_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  firm TEXT,
  city TEXT,
  size TEXT,
  practice TEXT,
  message TEXT,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

let db;

export function openDb(file) {
  const target = file || path.join(config.dataDir, 'nyayadesk.db');
  if (target !== ':memory:') fs.mkdirSync(path.dirname(target), { recursive: true });
  db = new DatabaseSync(target);
  db.exec(SCHEMA);
  migrate(db);
  return db;
}

// Additive migrations for databases created by earlier versions.
function migrate(d) {
  const cols = d.prepare('PRAGMA table_info(usage_events)').all().map((c) => c.name);
  if (!cols.includes('model')) d.exec('ALTER TABLE usage_events ADD COLUMN model TEXT');
}

export function getDb() {
  if (!db) openDb();
  return db;
}

export const id = (prefix) => `${prefix}_${crypto.randomBytes(10).toString('hex')}`;

export const q = {
  get: (sql, ...params) => getDb().prepare(sql).get(...params),
  all: (sql, ...params) => getDb().prepare(sql).all(...params),
  run: (sql, ...params) => getDb().prepare(sql).run(...params),
};

export function audit(firmId, userId, action, target = null, ip = null) {
  q.run(
    'INSERT INTO audit_log (firm_id, user_id, action, target, ip) VALUES (?, ?, ?, ?, ?)',
    firmId, userId, action, target, ip,
  );
}
