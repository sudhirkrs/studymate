#!/usr/bin/env node
// Model comparison: runs the same legal questions and drafts through several
// Claude models, then produces a BLIND grading sheet for advocates plus a
// cost/latency summary. After grading, `--score` joins the grades with the
// hidden key and tells you which model gives the best quality per rupee.
//
//   npm run compare -- --models claude-opus-5,claude-sonnet-5 --limit 10
//   npm run compare -- --models claude-opus-5,claude-sonnet-5,claude-haiku-4-5 --yes
//   npm run compare -- --score eval/results/2026-10-01T10-00
//
// Every live run costs real money: the script prints an estimate and stops
// unless you pass --yes. Without ANTHROPIC_API_KEY it runs in demo mode.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config } from '../server/config.js';
import { runStream } from '../server/ai/client.js';
import { DRAFTING, RESEARCH_MEMO, RESEARCH_QUICK } from '../server/ai/prompts.js';
import { verifyCitations } from '../server/ai/citations.js';
import { templateById } from '../server/data/templates.js';
import { buildBrief } from '../server/routes/drafts.js';
import { MODEL_PRICES, USD_INR, estimateCost } from '../server/data/models.js';

const here = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const a = { models: [config.model, config.modelStandard], questions: path.join(here, 'questions.json'), limit: 0, yes: false, memo: false, concurrency: 2, out: null, score: null, area: null };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === '--models') a.models = v().split(',').map((s) => s.trim()).filter(Boolean);
    else if (k === '--questions') a.questions = v();
    else if (k === '--limit') a.limit = Number(v());
    else if (k === '--area') a.area = v().toLowerCase();
    else if (k === '--concurrency') a.concurrency = Math.max(1, Number(v()));
    else if (k === '--out') a.out = v();
    else if (k === '--score') a.score = v();
    else if (k === '--memo') a.memo = true;
    else if (k === '--yes') a.yes = true;
    else if (k === '--help' || k === '-h') a.help = true;
    else throw new Error(`Unknown option ${k}`);
  }
  return a;
}

// ── CSV helpers ────────────────────────────────────────────────────────────
const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ''));
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rupees = (n) => `₹${n.toFixed(2)}`;

// Typical token use per item, for the pre-run estimate only.
const TYPICAL = {
  research: { input_tokens: 25000, output_tokens: 5500, server_tool_use: { web_search_requests: 3 } },
  memo: { input_tokens: 80000, output_tokens: 12000, server_tool_use: { web_search_requests: 10 } },
  draft: { input_tokens: 4000, output_tokens: 9000 },
};

function requestFor(item, memo) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  if (item.type === 'draft') {
    const t = templateById(item.templateId);
    if (!t) throw new Error(`${item.id}: unknown template ${item.templateId}`);
    return { kind: 'draft', system: DRAFTING, messages: [{ role: 'user', content: buildBrief(t, item.inputs || {}, item.extra || '', '', { name: 'Test Advocate' }) }], effort: 'high', maxTokens: 64000 };
  }
  return {
    kind: 'research',
    system: memo ? RESEARCH_MEMO : RESEARCH_QUICK,
    messages: [{ role: 'user', content: `Today's date: ${today}.\n\n${item.question}` }],
    webSearch: true,
    maxSearches: memo ? 12 : 5,
    effort: memo ? 'xhigh' : 'high',
    maxTokens: memo ? 64000 : 32000,
  };
}

async function pool(tasks, n, fn) {
  const results = new Array(tasks.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, async () => {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await fn(tasks[i], i);
    }
  }));
  return results;
}

// Deterministic per-question shuffle so each item gets its own blind labels.
function labelsFor(qid, models, salt) {
  const order = models
    .map((m) => ({ m, h: crypto.createHash('sha256').update(`${salt}:${qid}:${m}`).digest('hex') }))
    .sort((a, b) => a.h.localeCompare(b.h))
    .map((x) => x.m);
  return Object.fromEntries(order.map((m, i) => [m, String.fromCharCode(65 + i)]));
}

export async function runComparison(args, log = console.log) {
  let items = JSON.parse(fs.readFileSync(args.questions, 'utf8'));
  if (args.area) items = items.filter((q) => q.area.toLowerCase().includes(args.area));
  if (args.limit) items = items.slice(0, args.limit);
  if (!items.length) throw new Error('No questions selected.');
  for (const m of args.models) if (!MODEL_PRICES[m]) log(`Note: no price on file for ${m}; costs will show as unknown.`);

  // Estimate first — a live run spends real money.
  let est = 0;
  for (const m of args.models) {
    for (const it of items) est += estimateCost(m, TYPICAL[it.type === 'draft' ? 'draft' : args.memo ? 'memo' : 'research'])?.inr || 0;
  }
  log(`${items.length} item(s) × ${args.models.length} model(s) = ${items.length * args.models.length} runs. Estimated cost ≈ ${rupees(est)} (USD ≈ ${(est / USD_INR).toFixed(2)}).`);
  if (config.demoMode) log('Demo mode (no ANTHROPIC_API_KEY): answers are sample outputs and cost nothing.');
  else if (!args.yes) {
    log('Re-run with --yes to spend this. Use --limit or --area to run a smaller slice first.');
    return null;
  }

  const stamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
  const out = args.out || path.join(here, 'results', stamp);
  fs.mkdirSync(out, { recursive: true });
  const salt = crypto.randomBytes(8).toString('hex');

  const tasks = items.flatMap((it) => args.models.map((model) => ({ it, model })));
  let done = 0;
  const results = await pool(tasks, args.concurrency, async ({ it, model }) => {
    const t0 = Date.now();
    let r;
    try {
      const res = await runStream({ ...requestFor(it, args.memo), model });
      const cites = res.text ? verifyCitations(res.text, res.sources) : [];
      const count = (s) => cites.filter((c) => c.status === s).length;
      r = {
        id: it.id, area: it.area, type: it.type, model, answer: res.text, stopReason: res.stopReason,
        seconds: (Date.now() - t0) / 1000, usage: res.usage, costInr: config.demoMode ? 0 : estimateCost(model, res.usage)?.inr ?? null,
        verified: count('verified'), landmark: count('landmark'), unverified: count('unverified'), sources: res.sources.length,
      };
    } catch (e) {
      r = { id: it.id, area: it.area, type: it.type, model, answer: '', error: e.message, seconds: (Date.now() - t0) / 1000 };
    }
    done++;
    log(`[${done}/${tasks.length}] ${it.id} · ${model} · ${r.error ? `ERROR ${r.error}` : `${r.seconds.toFixed(1)}s${r.costInr ? ` · ${rupees(r.costInr)}` : ''}`}`);
    return r;
  });

  // Blind labels per item.
  const labelMap = Object.fromEntries(items.map((it) => [it.id, labelsFor(it.id, args.models, salt)]));
  for (const r of results) r.label = labelMap[r.id][r.model];
  const byItem = items.map((it) => ({ it, rows: results.filter((r) => r.id === it.id).sort((a, b) => a.label.localeCompare(b.label)) }));

  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ createdAt: new Date().toISOString(), models: args.models, memo: args.memo, demo: config.demoMode, results }, null, 2));

  // Grading sheet: no model names, no costs — graders see only the work.
  const sheet = [['id', 'area', 'type', 'question_or_template', 'label', 'answer', 'score_1_to_5', 'usable_without_major_edits_Y_N', 'wrong_or_invented_law_Y_N', 'notes']];
  for (const { it, rows } of byItem) {
    for (const r of rows) sheet.push([it.id, it.area, it.type, it.question || `${it.templateId}: ${JSON.stringify(it.inputs)}`, r.label, r.error ? `[ERROR: ${r.error}]` : r.answer, '', '', '', '']);
  }
  fs.writeFileSync(path.join(out, 'grading-sheet.csv'), '﻿' + toCsv(sheet));

  // The key stays with you, not the graders.
  const key = [['id', 'label', 'model', 'cost_inr', 'seconds', 'citations_verified', 'citations_landmark', 'citations_unverified', 'stop_reason', 'error']];
  for (const r of results) key.push([r.id, r.label, r.model, r.costInr?.toFixed(2) ?? '', r.seconds.toFixed(1), r.verified ?? '', r.landmark ?? '', r.unverified ?? '', r.stopReason ?? '', r.error ?? '']);
  fs.writeFileSync(path.join(out, 'key.csv'), toCsv(key));

  // Side-by-side blind report for reading in a browser or printing.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blind model comparison</title>
<style>body{font:15px/1.6 system-ui,sans-serif;margin:0;padding:24px;background:#f7f6f2;color:#13213a}h1{font-family:Georgia,serif}section{background:#fff;border:1px solid #e3e6ec;border-radius:10px;padding:18px;margin:0 0 22px}
.grid{display:grid;grid-template-columns:repeat(${args.models.length},minmax(0,1fr));gap:14px}.ans{border:1px solid #e3e6ec;border-radius:8px;padding:12px;white-space:pre-wrap;font-size:14px;max-height:620px;overflow:auto}
.lbl{font-weight:700;background:#1b3a6b;color:#fff;border-radius:6px;padding:2px 9px;display:inline-block;margin-bottom:8px}.meta{color:#647089;font-size:13px}@media(max-width:800px){.grid{grid-template-columns:1fr}}
@media print{section{break-inside:avoid-page}.ans{max-height:none}}</style></head><body>
<h1>Blind model comparison</h1><p class="meta">${items.length} items · ${args.models.length} answers each · labels are shuffled per item. Grade in grading-sheet.csv; do not open key.csv until grading is finished.</p>
${byItem.map(({ it, rows }) => `<section><div class="meta">${esc(it.id)} · ${esc(it.area)} · ${esc(it.type)}</div><h2 style="font-size:17px">${esc(it.question || `Draft: ${templateById(it.templateId)?.name}`)}</h2>
<div class="grid">${rows.map((r) => `<div><span class="lbl">${r.label}</span><div class="ans">${esc(r.error ? `[ERROR: ${r.error}]` : r.answer)}</div></div>`).join('')}</div></section>`).join('\n')}
</body></html>`;
  fs.writeFileSync(path.join(out, 'report.html'), html);

  // Automatic metrics (no human grades yet).
  const summary = summarise(results, args.models, null);
  fs.writeFileSync(path.join(out, 'summary.md'), summary);
  log(`\n${summary}\nWrote ${out}/ — share report.html and grading-sheet.csv with your graders; keep key.csv to yourself.`);
  return out;
}

function summarise(results, models, grades) {
  const lines = ['| Model | Runs | Errors | Avg cost | Cost per 100 | Avg time | Unverified citations / answer' + (grades ? ' | Avg score (1–5) | Usable | Wrong law flagged | Score per ₹10' : '') + ' |',
    '|---|---|---|---|---|---|---' + (grades ? '|---|---|---|---' : '') + '|'];
  for (const m of models) {
    const rs = results.filter((r) => r.model === m);
    const ok = rs.filter((r) => !r.error);
    const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    const cost = avg(ok.map((r) => r.costInr || 0));
    const row = [m, rs.length, rs.length - ok.length, rupees(cost), rupees(cost * 100), `${avg(ok.map((r) => r.seconds)).toFixed(1)}s`, avg(ok.filter((r) => r.type === 'research').map((r) => r.unverified || 0)).toFixed(2)];
    if (grades) {
      const g = grades.filter((x) => x.model === m);
      const sc = g.filter((x) => x.score > 0).map((x) => x.score);
      const pct = (f) => (g.length ? `${Math.round((g.filter(f).length / g.length) * 100)}%` : '—');
      const avgScore = avg(sc);
      row.push(sc.length ? avgScore.toFixed(2) : '—', pct((x) => x.usable), pct((x) => x.wrongLaw), cost > 0 && sc.length ? (avgScore / (cost / 10)).toFixed(2) : '—');
    }
    lines.push(`| ${row.join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export function scoreResults(dir, log = console.log) {
  const { results, models } = JSON.parse(fs.readFileSync(path.join(dir, 'results.json'), 'utf8'));
  const sheet = parseCsv(fs.readFileSync(path.join(dir, 'grading-sheet.csv'), 'utf8').replace(/^﻿/, ''));
  const head = sheet[0];
  const col = (name) => head.indexOf(name);
  const yes = (v) => /^y/i.test(String(v).trim());
  const grades = [];
  for (const row of sheet.slice(1)) {
    const r = results.find((x) => x.id === row[col('id')] && x.label === row[col('label')]);
    if (!r) continue;
    grades.push({ model: r.model, score: Number(row[col('score_1_to_5')]) || 0, usable: yes(row[col('usable_without_major_edits_Y_N')]), wrongLaw: yes(row[col('wrong_or_invented_law_Y_N')]) });
  }
  const graded = grades.filter((g) => g.score > 0).length;
  const summary = summarise(results, models, grades);
  const text = `${graded} of ${grades.length} answers graded.\n\n${summary}\n"Score per ₹10" = average score ÷ (average cost ÷ 10): higher is better value. Choose the cheapest model whose average score and "usable" rate your advocates would accept for that plan, and never one with more "wrong law" flags.\n`;
  fs.writeFileSync(path.join(dir, 'scored-summary.md'), text);
  log(text);
  return { graded, grades };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    } else if (args.score) scoreResults(args.score);
    else await runComparison(args);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
