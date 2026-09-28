import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractCitations, verifyCitations } from '../server/ai/citations.js';
import { convertSection } from '../server/data/criminal-law-map.js';
import { computeLimitation } from '../server/data/limitation.js';
import { hashPassword, validatePassword, verifyPassword } from '../server/auth.js';
import { TEMPLATES } from '../server/data/templates.js';

test('extracts Indian reporter and neutral citations and case names', () => {
  const text = 'Per *Dashrath Rupsingh Rathod v. State of Maharashtra*, (2014) 9 SCC 129; see also AIR 1973 SC 1461, 2023 SCC OnLine SC 1045, 2024 INSC 55, 1992 Supp (1) SCC 335 and [2019] 3 SCR 1.';
  const found = extractCitations(text).map((c) => c.text);
  for (const c of ['(2014) 9 SCC 129', 'AIR 1973 SC 1461', '2023 SCC OnLine SC 1045', '2024 INSC 55', '1992 Supp (1) SCC 335', '[2019] 3 SCR 1', 'Dashrath Rupsingh Rathod v. State of Maharashtra']) {
    assert.ok(found.includes(c), `missing ${c}: ${found.join(' | ')}`);
  }
});

test('grades citations as verified, landmark or unverified', () => {
  const text = 'Rely on Imaginary Traders v. Fictional Bank, (2031) 99 SCC 999 and K.S. Puttaswamy v. Union of India, (2017) 10 SCC 1 and Gian Singh v. State of Punjab.';
  const sources = [{ url: 'https://indiankanoon.org/doc/1/', title: 'Gian Singh vs State Of Punjab & Anr on 24 September, 2012', snippets: [] }];
  const byText = Object.fromEntries(verifyCitations(text, sources).map((c) => [c.text, c.status]));
  assert.equal(byText['(2031) 99 SCC 999'], 'unverified');
  assert.equal(byText['Imaginary Traders v. Fictional Bank'], 'unverified');
  assert.equal(byText['(2017) 10 SCC 1'], 'landmark');
  assert.equal(byText['Gian Singh v. State of Punjab'], 'verified');
});

test('a citation quoted inside a retrieved source is verified', () => {
  const sources = [{ url: 'https://example.in/j', title: 'Judgment', snippets: ['reported in (2019) 5 SCC 100 the Court held'] }];
  const [c] = verifyCitations('See (2019) 5 SCC 100.', sources);
  assert.equal(c.status, 'verified');
  assert.equal(c.source, 'https://example.in/j');
});

test('IPC → BNS and back', () => {
  assert.equal(convertSection('ipc', '420')[0].new, '318(4)');
  assert.equal(convertSection('ipc', 's.302')[0].new, '103(1)');
  assert.equal(convertSection('ipc', '304B')[0].new, '80');
  assert.equal(convertSection('ipc', '318(4)', 'new-to-old')[0].old, '420');
  assert.ok(convertSection('ipc', '318', 'new-to-old').length >= 3, 'base section lists sub-sections');
  assert.equal(convertSection('crpc', '482')[0].new, '528');
  assert.equal(convertSection('crpc', '438')[0].new, '482');
  assert.equal(convertSection('iea', '65B')[0].new, '63');
  assert.ok(convertSection('ipc', 'cheating').length > 0, 'keyword search');
  assert.equal(convertSection('ipc', '377')[0].changed, true);
});

test('labour Acts → Labour Codes', () => {
  assert.equal(convertSection('labour', '25F')[0].new, '70');
  assert.equal(convertSection('labour', '25F')[0].newAct, 'Industrial Relations Code, 2020');
  assert.equal(convertSection('labour', '25N')[0].changed, true, 'threshold change is flagged');
  assert.equal(convertSection('labour', '70', 'new-to-old')[0].old, '25F');
  const gratuity = convertSection('labour', 'gratuity');
  assert.ok(gratuity.some((r) => r.newAct === 'Code on Social Security, 2020' && r.new === '53'));
  const factories = convertSection('labour', 'Factories Act');
  assert.ok(factories.some((r) => r.newAct === 'OSH Code, 2020'));
});

test('all 29 repealed labour Acts are mapped to exactly the four Codes', async () => {
  const { LABOUR_ROWS } = await import('../server/data/labour.js');
  const acts = LABOUR_ROWS.filter((r) => r.old === '—');
  assert.equal(acts.length, 29);
  assert.equal(new Set(acts.map((r) => r.oldAct)).size, 29);
  const perCode = acts.reduce((m, r) => ((m[r.newAct] = (m[r.newAct] || 0) + 1), m), {});
  assert.deepEqual(perCode, { 'Code on Wages, 2019': 4, 'Industrial Relations Code, 2020': 3, 'Code on Social Security, 2020': 9, 'OSH Code, 2020': 13 });
});

test('limitation: labour entries', () => {
  assert.equal(computeLimitation('id2a', '2024-05-10').lastDate, '2027-05-10');
  assert.equal(computeLimitation('posh9', '2026-01-15').lastDate, '2026-04-15');
  assert.equal(computeLimitation('posh-inquiry', '2026-01-01').lastDate, '2026-04-01');
});

test('limitation: day periods exclude the first day (s.12)', () => {
  const r = computeLimitation('ni138notice', '2026-03-01');
  assert.equal(r.lastDate, '2026-03-31');
});

test('limitation: month periods end on the corresponding date, clamped to month end', () => {
  assert.equal(computeLimitation('ni142', '2026-01-16').lastDate, '2026-02-16');
  assert.equal(computeLimitation('ni142', '2026-01-31').lastDate, '2026-02-28');
  assert.equal(computeLimitation('arb34', '2025-11-30').lastDate, '2026-02-28');
  assert.equal(computeLimitation('art113', '2024-02-29').lastDate, '2027-02-28');
});

test('limitation: excluded days extend the period and weekends are flagged', () => {
  const r = computeLimitation('art116a', '2026-01-01', 10);
  assert.equal(r.lastDate, '2026-04-11');
  assert.ok(r.notes.some((n) => n.includes('Saturday')));
  assert.throws(() => computeLimitation('nope', '2026-01-01'));
  assert.throws(() => computeLimitation('art113', 'not-a-date'));
});

test('password hashing and policy', () => {
  const h = hashPassword('CorrectHorse42');
  assert.ok(verifyPassword('CorrectHorse42', h));
  assert.ok(!verifyPassword('wrong-password1', h));
  assert.ok(!verifyPassword('x', 'garbage'));
  assert.ok(validatePassword('short1'));
  assert.ok(validatePassword('onlyletterslong'));
  assert.equal(validatePassword('letters1234'), null);
});

test('templates are well-formed and unique', () => {
  const ids = new Set();
  for (const t of TEMPLATES) {
    assert.ok(!ids.has(t.id), `duplicate ${t.id}`);
    ids.add(t.id);
    assert.ok(t.name && t.category && t.instructions.length > 80, t.id);
    assert.ok(t.fields.length > 0 && t.fields.every((f) => f.key && f.label), t.id);
  }
  assert.ok(TEMPLATES.length >= 35);
  const labour = TEMPLATES.filter((t) => t.category === 'Labour & Employment').map((t) => t.id);
  for (const id of ['employment', 'chargesheet', 'chargesheet-reply', 'enquiry-report', 'termination', 'id-claim', 'gratuity-claim', 'posh-complaint', 'posh-inquiry-report', 'fnf-settlement', 'manpower-contract', 'epf-esi-reply']) {
    assert.ok(labour.includes(id), `missing labour template ${id}`);
  }
});
