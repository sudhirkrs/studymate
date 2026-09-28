// End-to-end API tests against an in-memory database in demo mode.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
process.env.ANTHROPIC_API_KEY = '';
process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test';
process.env.COMPANY_STATE_CODE = '27';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'nyaya-'));

const { openDb, q } = await import('../server/db.js');
const { createApp } = await import('../server/index.js');

let server;
let base;

before(async () => {
  openDb(':memory:');
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

function client() {
  let cookie = '';
  const call = async (method, p, body, raw = false) => {
    const headers = {};
    if (cookie) headers.cookie = cookie;
    let payload;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) { headers['content-type'] = 'application/json'; payload = JSON.stringify(body); }
    const res = await fetch(base + p, { method, headers, body: payload });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    if (raw) return res;
    const type = res.headers.get('content-type') || '';
    return { status: res.status, body: type.includes('json') ? await res.json() : await res.text() };
  };
  return {
    get: (p, raw) => call('GET', p, undefined, raw),
    post: (p, b, raw) => call('POST', p, b, raw),
    put: (p, b) => call('PUT', p, b),
    del: (p) => call('DELETE', p),
  };
}

function sseEvents(text) {
  return text.split('\n\n').filter((c) => c.startsWith('data: ')).map((c) => JSON.parse(c.slice(6)));
}

async function signup(email, firm = 'Test Chambers') {
  const c = client();
  const r = await c.post('/api/auth/signup', { name: 'Adv. Test', email, firm, password: 'Password1234', acceptTerms: true });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  return c;
}

test('health and security headers', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).demoMode, true);
  assert.match(res.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
});

test('signup validation and duplicate emails', async () => {
  const c = client();
  assert.equal((await c.post('/api/auth/signup', { name: 'A', email: 'bad', firm: 'F', password: 'Password1234', acceptTerms: true })).status, 400);
  assert.equal((await c.post('/api/auth/signup', { name: 'A', email: 'a@b.in', firm: 'F', password: 'short', acceptTerms: true })).status, 400);
  assert.equal((await c.post('/api/auth/signup', { name: 'A', email: 'a@b.in', firm: 'F', password: 'Password1234' })).status, 400);
  await signup('dupe@firm.in');
  assert.equal((await client().post('/api/auth/signup', { name: 'A', email: 'dupe@firm.in', firm: 'F', password: 'Password1234', acceptTerms: true })).status, 409);
});

test('login, me, logout', async () => {
  await signup('login@firm.in');
  const c = client();
  assert.equal((await c.post('/api/auth/login', { email: 'login@firm.in', password: 'wrong-pass-1' })).status, 401);
  assert.equal((await c.post('/api/auth/login', { email: 'login@firm.in', password: 'Password1234' })).status, 200);
  const me = await c.get('/api/auth/me');
  assert.equal(me.body.user.role, 'owner');
  assert.equal(me.body.firm.plan, 'trial');
  assert.equal(me.body.usage.quota, 40);
  await c.post('/api/auth/logout', {});
  assert.equal((await c.get('/api/auth/me')).status, 401);
});

test('protected routes require a session', async () => {
  const c = client();
  for (const p of ['/api/research', '/api/drafts', '/api/matters', '/api/documents', '/api/tools/codes', '/api/billing']) {
    assert.equal((await c.get(p)).status, 401, p);
  }
});

test('cross-origin POSTs are rejected', async () => {
  const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, body: '{}' });
  assert.equal(res.status, 403);
});

test('research streams an answer, checks citations and meters usage', async () => {
  const c = await signup('research@firm.in');
  const res = await c.post('/api/research', { question: 'What is the limitation for a s.138 complaint?', mode: 'quick' }, true);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/event-stream/);
  const events = sseEvents(await res.text());
  assert.ok(events.some((e) => e.type === 'text'));
  assert.ok(events.some((e) => e.type === 'source'));
  const cites = events.find((e) => e.type === 'citations').citations;
  assert.ok(cites.some((x) => x.status === 'verified'));
  const done = events.find((e) => e.type === 'done');
  const saved = await c.get(`/api/research/${done.id}`);
  assert.equal(saved.status, 200);
  assert.ok(saved.body.answer.length > 100);
  const me = await c.get('/api/auth/me');
  assert.equal(me.body.usage.actions, 1);

  const memo = sseEvents(await (await c.post('/api/research', { question: 'Full memo on s.138 limitation please', mode: 'memo' }, true)).text());
  assert.ok(memo.some((e) => e.type === 'done'));
  assert.equal((await c.get('/api/auth/me')).body.usage.actions, 4);
});

test('tenant isolation: one firm cannot read another firm\'s work', async () => {
  const a = await signup('iso-a@firm.in', 'Firm A');
  const b = await signup('iso-b@firm.in', 'Firm B');
  const events = sseEvents(await (await a.post('/api/research', { question: 'Confidential question for firm A', mode: 'quick' }, true)).text());
  const rid = events.find((e) => e.type === 'done').id;
  const m = await a.post('/api/matters', { title: 'Secret matter' });
  assert.equal((await b.get(`/api/research/${rid}`)).status, 404);
  assert.equal((await b.del(`/api/research/${rid}`)).status, 404);
  assert.equal((await b.put(`/api/matters/${m.body.id}`, { title: 'hijack' })).status, 404);
  assert.equal((await b.get('/api/research')).body.length, 0);
  assert.equal((await b.get('/api/matters')).body.length, 0);
});

test('quota and trial expiry block AI calls', async () => {
  const c = await signup('quota@firm.in');
  const firm = q.get("SELECT f.* FROM firms f JOIN users u ON u.firm_id = f.id WHERE u.email = 'quota@firm.in'");
  q.run('INSERT INTO usage_events (firm_id, user_id, kind, actions) VALUES (?, ?, ?, ?)', firm.id, 'x', 'research_quick', 40);
  const r = await c.post('/api/research', { question: 'Will this be blocked by quota?', mode: 'quick' });
  assert.equal(r.status, 402);
  q.run('DELETE FROM usage_events WHERE firm_id = ?', firm.id);
  q.run("UPDATE firms SET trial_ends_at = '2000-01-01T00:00:00Z' WHERE id = ?", firm.id);
  const r2 = await c.post('/api/research', { question: 'Will this be blocked by trial end?', mode: 'quick' });
  assert.equal(r2.status, 402);
  assert.match(r2.body.error, /trial has ended/);
});

test('drafting: templates, generate, edit, docx export', async () => {
  const c = await signup('draft@firm.in');
  const t = await c.get('/api/drafts/templates');
  assert.ok(t.body.templates.length >= 25);
  assert.equal((await c.post('/api/drafts/generate', { templateId: 'nope' })).status, 400);
  const events = sseEvents(await (await c.post('/api/drafts/generate', { templateId: 'bail-regular', inputs: { applicant: 'Ramesh Kumar', court: 'Sessions Court, Pune' } }, true)).text());
  const done = events.find((e) => e.type === 'done');
  assert.ok(done?.id);
  const d = await c.get(`/api/drafts/${done.id}`);
  assert.match(d.body.body, /PRAYER/);
  assert.equal((await c.put(`/api/drafts/${done.id}`, { body: 'IN THE COURT OF SESSIONS\n\nEdited text\n---\nDRAFTING NOTES:\n- note', title: 'Edited' })).status, 200);
  const docx = await c.get(`/api/drafts/${done.id}/docx`, true);
  assert.equal(docx.status, 200);
  const buf = Buffer.from(await docx.arrayBuffer());
  assert.equal(buf.subarray(0, 2).toString(), 'PK', 'docx is a zip');
  const re = sseEvents(await (await c.post(`/api/drafts/${done.id}/redraft`, { instruction: 'Make it shorter' }, true)).text());
  assert.ok(re.some((e) => e.type === 'done'));
  assert.equal((await c.get(`/api/drafts/${done.id}`)).body.version, 3);
});

test('documents: upload, reject bad types, review, delete', async () => {
  const c = await signup('docs@firm.in');
  const fd = new FormData();
  fd.append('file', new Blob(['This Agreement is made at Mumbai between A and B. Clause 1: Term of three years.'], { type: 'text/plain' }), 'msa.txt');
  const up = await c.post('/api/documents', fd);
  assert.equal(up.status, 201);
  const bad = new FormData();
  bad.append('file', new Blob(['MZ...'], { type: 'application/x-msdownload' }), 'evil.exe');
  assert.equal((await c.post('/api/documents', bad)).status, 415);
  const fakePdf = new FormData();
  fakePdf.append('file', new Blob(['not a pdf'], { type: 'application/pdf' }), 'x.pdf');
  assert.equal((await c.post('/api/documents', fakePdf)).status, 415);
  const ev = sseEvents(await (await c.post(`/api/documents/${up.body.id}/review`, { mode: 'contract' }, true)).text());
  assert.ok(ev.some((e) => e.type === 'done'));
  assert.equal((await c.get(`/api/documents/${up.body.id}/reviews`)).body.length, 1);
  assert.equal((await c.del(`/api/documents/${up.body.id}`)).status, 200);
});

test('legal tools endpoints', async () => {
  const c = await signup('tools@firm.in');
  const conv = await c.get('/api/tools/convert?code=crpc&q=439');
  assert.equal(conv.body[0].new, '483');
  const lim = await c.post('/api/tools/limitation', { id: 'cpa69', startDate: '2026-01-10' });
  assert.equal(lim.body.lastDate, '2028-01-10');
  assert.equal((await c.post('/api/tools/limitation', { id: 'cpa69', startDate: 'x' })).status, 400);
});

test('team invites respect roles and seats', async () => {
  const owner = await signup('owner@firm.in', 'Seat Firm');
  const inv = await owner.post('/api/admin/invites', { email: 'member@firm.in' });
  assert.equal(inv.status, 201);
  const token = inv.body.link.split('/join/')[1];
  const member = client();
  assert.equal((await member.get(`/api/auth/invite/${token}`)).body.email, 'member@firm.in');
  assert.equal((await member.post(`/api/auth/invite/${token}`, { name: 'Junior', password: 'Password1234' })).status, 201);
  assert.equal((await member.get('/api/admin/team')).status, 403, 'members cannot administer');
  assert.equal((await member.get('/api/auth/me')).body.firm.name, 'Seat Firm');
  const team = await owner.get('/api/admin/team');
  assert.equal(team.body.users.length, 2);
  const junior = team.body.users.find((u) => u.email === 'member@firm.in');
  await owner.put(`/api/admin/users/${junior.id}`, { active: false });
  assert.equal((await member.get('/api/auth/me')).status, 401, 'deactivated users are signed out');
});

test('razorpay webhook: signature check, activation and GST invoice', async () => {
  const c = await signup('billing@firm.in', 'Billing LLP');
  const firm = q.get("SELECT f.* FROM firms f JOIN users u ON u.firm_id = f.id WHERE u.email = 'billing@firm.in'");
  q.run("UPDATE firms SET billing_state = '27' WHERE id = ?", firm.id);
  const payload = JSON.stringify({
    event: 'subscription.charged',
    payload: {
      subscription: { entity: { id: 'sub_1', quantity: 3, customer_id: 'cust_1', current_start: 1790000000, current_end: 1792600000, notes: { firm_id: firm.id, plan: 'chambers', seats: '3' } } },
      payment: { entity: { id: 'pay_1', amount: 2123646 } },
    },
  });
  const sign = (body) => crypto.createHmac('sha256', 'whsec_test').update(body).digest('hex');
  const bad = await fetch(`${base}/api/billing/webhook`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'deadbeef' }, body: payload });
  assert.equal(bad.status, 400);
  const ok = await fetch(`${base}/api/billing/webhook`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(payload) }, body: payload });
  assert.equal(ok.status, 200);
  // Replay of the same payment must not double-invoice.
  await fetch(`${base}/api/billing/webhook`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(payload) }, body: payload });
  const me = await c.get('/api/auth/me');
  assert.equal(me.body.firm.plan, 'chambers');
  assert.equal(me.body.firm.seats, 3);
  assert.equal(me.body.firm.status, 'active');
  const billing = await c.get('/api/billing');
  assert.equal(billing.body.invoices.length, 1);
  const inv = q.get('SELECT * FROM invoices WHERE firm_id = ?', firm.id);
  assert.equal(inv.taxable_paise + inv.cgst_paise + inv.sgst_paise + inv.igst_paise, inv.total_paise);
  assert.equal(inv.igst_paise, 0, 'intra-state supply uses CGST + SGST');
  assert.equal(inv.taxable_paise, 1799700);
  assert.match(inv.number, /^ND\/\d{2}-\d{2}\/00001$/);
  const html = await c.get(`/api/billing/invoices/${inv.id}`);
  assert.match(html.body, /TAX INVOICE/);
  assert.match(html.body, /998431/);

  const halted = JSON.stringify({ event: 'subscription.halted', payload: { subscription: { entity: { id: 'sub_1', notes: { firm_id: firm.id } } } } });
  await fetch(`${base}/api/billing/webhook`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(halted) }, body: halted });
  assert.equal((await c.post('/api/research', { question: 'Blocked while past due?', mode: 'quick' })).status, 402);
});

test('marketing lead capture', async () => {
  const c = client();
  assert.equal((await c.post('/api/leads', { name: 'Adv. X', email: 'no' })).status, 400);
  assert.equal((await c.post('/api/leads', { name: 'Adv. X', email: 'x@firm.in', firm: 'X & Co', size: '6–15' })).status, 201);
  assert.equal(q.get("SELECT COUNT(*) AS n FROM leads WHERE email = 'x@firm.in'").n, 1);
});

test('static site and app shell are served', async () => {
  for (const p of ['/', '/app/', '/terms', '/privacy', '/assets/logo.svg']) {
    const res = await fetch(base + p);
    assert.equal(res.status, 200, p);
  }
});
