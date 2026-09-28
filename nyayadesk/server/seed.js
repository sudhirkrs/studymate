// Creates a demo firm for sales demos: demo@nyayadesk.in / DemoPass2026
import { openDb, q, id } from './db.js';
import { hashPassword } from './auth.js';

openDb();
const email = process.env.SEED_EMAIL || 'demo@nyayadesk.in';
if (q.get('SELECT 1 FROM users WHERE email = ?', email)) {
  console.log(`${email} already exists`);
  process.exit(0);
}
const firmId = id('firm');
const now = new Date();
q.run(`INSERT INTO firms (id, name, city, plan, seats, status, trial_ends_at, period_start) VALUES (?, 'Mehta & Rao Associates', 'Mumbai', 'chambers', 5, 'active', NULL, ?)`,
  firmId, now.toISOString().replace('T', ' ').slice(0, 19));
q.run(`INSERT INTO users (id, firm_id, email, name, role, bar_enrolment, password_hash) VALUES (?, ?, ?, 'Adv. Demo User', 'owner', 'MAH/1234/2015', ?)`,
  id('usr'), firmId, email, hashPassword(process.env.SEED_PASSWORD || 'DemoPass2026'));
const userId = q.get('SELECT id FROM users WHERE email = ?', email).id;
for (const [title, client, court, area] of [
  ['Sharma Traders v. Apex Retail — cheque dishonour', 'Sharma Traders', 'Metropolitan Magistrate, Andheri', 'Criminal — NI Act'],
  ['Kapoor anticipatory bail', 'Rohit Kapoor', 'Court of Sessions, Greater Mumbai', 'Criminal'],
  ['Zenith Infra MSA review', 'Zenith Infra Pvt Ltd', null, 'Commercial contracts'],
]) {
  q.run('INSERT INTO matters (id, firm_id, title, client, court, practice_area, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)', id('mat'), firmId, title, client, court, area, userId);
}
console.log(`Seeded demo firm. Sign in with ${email}`);
