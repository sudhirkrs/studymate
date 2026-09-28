// The model comparison tool, end to end in demo mode (no API spend).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
process.env.ANTHROPIC_API_KEY = '';
const { runComparison, scoreResults, parseCsv } = await import('../eval/compare.js');
const { config } = await import('../server/config.js');

test('csv parser handles quotes, commas and newlines', () => {
  assert.deepEqual(parseCsv('a,b\r\n"x, ""y""","line1\nline2"\r\n'), [['a', 'b'], ['x, "y"', 'line1\nline2']]);
});

test('comparison writes a blind sheet, a key and a report, then scores grades', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cmp-'));
  const models = ['claude-opus-5', 'claude-sonnet-5'];
  const logs = [];
  await runComparison({ models, questions: new URL('../eval/questions.json', import.meta.url).pathname, limit: 0, area: 'labour', yes: false, memo: false, concurrency: 3, out }, (m) => logs.push(m));

  const results = JSON.parse(fs.readFileSync(path.join(out, 'results.json'), 'utf8')).results;
  const items = new Set(results.map((r) => r.id));
  assert.ok(items.size >= 5, 'all labour items ran');
  assert.equal(results.length, items.size * 2);
  assert.ok(results.every((r) => !r.error && r.answer.length > 50));

  const sheetText = fs.readFileSync(path.join(out, 'grading-sheet.csv'), 'utf8');
  for (const m of models) assert.ok(!sheetText.includes(m), 'grading sheet must not reveal model names');
  const sheet = parseCsv(sheetText.replace(/^﻿/, ''));
  assert.equal(sheet.length - 1, results.length);
  // Each item has labels A and B exactly once.
  for (const id of items) {
    assert.deepEqual(sheet.filter((r) => r[0] === id).map((r) => r[4]).sort(), ['A', 'B']);
  }
  assert.ok(fs.readFileSync(path.join(out, 'key.csv'), 'utf8').includes('claude-sonnet-5'));
  assert.match(fs.readFileSync(path.join(out, 'report.html'), 'utf8'), /Blind model comparison/);

  // Simulate graders: give every "A" answer 5 and every "B" answer 3.
  const head = sheet[0];
  const graded = [head, ...sheet.slice(1).map((r) => {
    const row = [...r];
    row[head.indexOf('score_1_to_5')] = row[4] === 'A' ? '5' : '3';
    row[head.indexOf('usable_without_major_edits_Y_N')] = row[4] === 'A' ? 'Y' : 'N';
    return row;
  })];
  const csv = graded.map((r) => r.map((c) => (/[",\n\r]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\r\n');
  fs.writeFileSync(path.join(out, 'grading-sheet.csv'), csv);
  const { graded: n, grades } = scoreResults(out, () => {});
  assert.equal(n, results.length);
  assert.equal(grades.filter((g) => g.score === 5).length, items.size);
  assert.match(fs.readFileSync(path.join(out, 'scored-summary.md'), 'utf8'), /claude-opus-5/);
});

test('live runs stop for confirmation before spending', async () => {
  config.anthropicKey = 'sk-test-not-used';
  const logs = [];
  const r = await runComparison({ models: ['claude-sonnet-5'], questions: new URL('../eval/questions.json', import.meta.url).pathname, limit: 2, yes: false, concurrency: 1 }, (m) => logs.push(m));
  config.anthropicKey = '';
  assert.equal(r, null);
  assert.ok(logs.some((l) => l.includes('--yes')));
  assert.ok(logs.some((l) => /Estimated cost ≈ ₹\d/.test(l)));
});
