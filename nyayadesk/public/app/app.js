// NyayaDesk web app — dependency-free single-page client.
'use strict';

// ── Utilities ───────────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = () => $('#view');
const fmtDate = (s) => (s ? new Date(s.replace(' ', 'T') + (s.includes('Z') ? '' : 'Z')).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const fmtDay = (s) => (s ? new Date(s.replace(' ', 'T') + (s.includes('Z') ? '' : 'Z')).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

function toast(msg, ms = 3200) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), ms);
}

async function api(path, opts = {}) {
  const init = { method: opts.method || 'GET', headers: {}, credentials: 'same-origin' };
  if (opts.body instanceof FormData) init.body = opts.body;
  else if (opts.body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(opts.body);
  }
  const res = await fetch(`/api${path}`, init);
  if (res.status === 401 && !path.startsWith('/auth/')) {
    state.me = null;
    location.hash = '#/login';
    throw new Error('Please sign in.');
  }
  const type = res.headers.get('content-type') || '';
  const data = type.includes('json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

// POST that returns a server-sent event stream.
async function streamPost(path, body, onEvent) {
  const res = await fetch(`/api${path}`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      for (const line of chunk.split('\n')) if (line.startsWith('data: ')) onEvent(JSON.parse(line.slice(6)));
    }
  }
}

// Minimal, safe Markdown renderer (escape first, then format).
function md(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  const out = [];
  let list = null;
  let para = [];
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || '')) {
      flushPara(); closeList();
      const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line);
      i += 1;
      const rows = [];
      while (i + 1 < lines.length && /^\s*\|.*\|\s*$/.test(lines[i + 1])) rows.push(cells(lines[++i]));
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flushPara(); closeList(); const n = Math.min(3, m[1].length + 1); out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { flushPara(); closeList(); out.push('<hr>'); continue; }
    if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) { flushPara(); if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) { flushPara(); if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); closeList(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if (!line.trim()) { flushPara(); closeList(); continue; }
    para.push(line.trim());
  }
  flushPara(); closeList();
  return out.join('\n');
}

const ICONS = {
  research: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  draft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M9 14l2 2 4-4"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M5 7h14M7 7l-3 7h6zM17 7l-3 7h6z"/></svg>',
  matters: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
};

// ── State & shell ──────────────────────────────────────────────────────────
const state = { me: null, matters: [], templates: null };

async function loadMe() {
  try {
    state.me = await api('/auth/me');
  } catch {
    state.me = null;
  }
  return state.me;
}

function shell(active) {
  const me = state.me;
  const u = me.usage;
  const pct = Math.min(100, Math.round((u.actions / Math.max(1, u.quota)) * 100));
  const nav = [
    ['research', 'Research'], ['draft', 'Drafting'], ['review', 'Document review'], ['tools', 'Legal tools'], ['matters', 'Matters'], ['settings', 'Settings'],
  ].map(([k, label]) => `<a class="nav ${active === k ? 'on' : ''}" href="#/${k}">${ICONS[k]}${label}</a>`).join('');
  document.body.innerHTML = `
  <div class="shell">
    <aside class="side" id="side">
      <a class="logo" href="#/research"><img src="/assets/logo.svg" alt="" width="28" height="28">NyayaDesk</a>
      ${nav}
      <div class="grow"></div>
      <div class="meter"><div class="row"><span>${esc(me.firm.planName)}</span><span class="spacer"></span><span>${u.actions}/${u.quota}</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>AI actions this month</div>
      <div class="who"><span>${esc(me.user.name)}</span><button class="btn small ghost" id="logout">Sign out</button></div>
    </aside>
    <div class="main">
      <div class="top"><button class="btn small" id="menu" aria-label="Menu">☰</button><span class="logo" style="font-size:17px">NyayaDesk</span></div>
      <div id="view"></div>
    </div>
  </div>`;
  $('#logout').onclick = async () => { await api('/auth/logout', { method: 'POST' }); state.me = null; location.hash = '#/login'; };
  $('#menu').onclick = () => $('#side').classList.toggle('open');
  $$('.side a.nav').forEach((a) => a.addEventListener('click', () => $('#side').classList.remove('open')));
}

function banners() {
  const me = state.me;
  const out = [];
  if (me.demoMode) out.push('Demo mode: responses are sample outputs. Add an Anthropic API key on the server for live research.');
  if (me.firm.status === 'trialing' && me.firm.trialEndsAt) {
    const days = Math.ceil((new Date(me.firm.trialEndsAt) - Date.now()) / 864e5);
    out.push(days > 0 ? `Free trial: ${days} day${days === 1 ? '' : 's'} left. <a href="#/settings/billing">Choose a plan</a>.` : 'Your trial has ended. <a href="#/settings/billing">Choose a plan</a> to continue.');
  }
  if (me.firm.status === 'past_due') out.push('Your last payment failed. <a href="#/settings/billing">Update payment</a>.');
  return out.map((b) => `<div class="banner">${b}</div>`).join('');
}

async function refreshUsage() {
  if (!(await loadMe())) return;
  const u = state.me.usage;
  const meter = $('.side .meter');
  if (meter) {
    meter.querySelector('.row span:last-child').textContent = `${u.actions}/${u.quota}`;
    meter.querySelector('.bar i').style.width = `${Math.min(100, Math.round((u.actions / Math.max(1, u.quota)) * 100))}%`;
  }
}

async function mattersOptions(selected = '') {
  try { state.matters = await api('/matters'); } catch { state.matters = []; }
  return `<option value="">No matter</option>${state.matters.filter((m) => m.status !== 'closed').map((m) => `<option value="${esc(m.id)}" ${m.id === selected ? 'selected' : ''}>${esc(m.title)}</option>`).join('')}`;
}

// ── Auth views ─────────────────────────────────────────────────────────────
function authPage(inner) {
  document.body.innerHTML = `<div class="auth"><div class="card"><a class="logo" href="/"><img src="/assets/logo.svg" alt="" width="28" height="28">NyayaDesk</a>${inner}</div></div>`;
}

function viewLogin() {
  authPage(`
    <h1>Sign in</h1><p class="muted small">Welcome back to your firm's workspace.</p>
    <form id="f" class="stack">
      <div><label class="f" for="email">Email</label><input class="input" id="email" type="email" autocomplete="email" required></div>
      <div><label class="f" for="pw">Password</label><input class="input" id="pw" type="password" autocomplete="current-password" required></div>
      <div class="err" id="err"></div>
      <button class="btn primary" style="width:100%">Sign in</button>
      <p class="small muted">New to NyayaDesk? <a href="#/signup">Start a 14-day free trial</a></p>
    </form>`);
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/login', { method: 'POST', body: { email: $('#email').value, password: $('#pw').value } });
      await loadMe();
      location.hash = '#/research';
    } catch (err) { $('#err').textContent = err.message; }
  };
}

function viewSignup() {
  authPage(`
    <h1>Start your free trial</h1><p class="muted small">14 days, full features, no card required.</p>
    <form id="f" class="stack">
      <div><label class="f" for="name">Your name</label><input class="input" id="name" autocomplete="name" required></div>
      <div><label class="f" for="firm">Firm / chamber name</label><input class="input" id="firm" required></div>
      <div class="grid2"><div><label class="f" for="city">City</label><input class="input" id="city"></div>
      <div><label class="f" for="bar">Bar enrolment no. <span class="muted">(optional)</span></label><input class="input" id="bar" placeholder="e.g. D/1234/2016"></div></div>
      <div><label class="f" for="email">Work email</label><input class="input" id="email" type="email" autocomplete="email" required></div>
      <div><label class="f" for="pw">Password</label><input class="input" id="pw" type="password" autocomplete="new-password" minlength="10" required><div class="small muted">At least 10 characters, with letters and numbers.</div></div>
      <label class="small row" style="align-items:flex-start;gap:8px"><input type="checkbox" id="terms" required> <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</span></label>
      <div class="err" id="err"></div>
      <button class="btn primary" style="width:100%">Create workspace</button>
      <p class="small muted">Already have an account? <a href="#/login">Sign in</a></p>
    </form>`);
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/signup', { method: 'POST', body: { name: $('#name').value, firm: $('#firm').value, city: $('#city').value, barEnrolment: $('#bar').value, email: $('#email').value, password: $('#pw').value, acceptTerms: $('#terms').checked } });
      await loadMe();
      location.hash = '#/research';
    } catch (err) { $('#err').textContent = err.message; }
  };
}

async function viewJoin(token) {
  let inv;
  try { inv = await api(`/auth/invite/${encodeURIComponent(token)}`); } catch (e) { authPage(`<h1>Invitation</h1><p class="err">${esc(e.message)}</p>`); return; }
  authPage(`
    <h1>Join ${esc(inv.firm)}</h1><p class="muted small">Invited as ${esc(inv.email)}</p>
    <form id="f" class="stack">
      <div><label class="f" for="name">Your name</label><input class="input" id="name" required></div>
      <div><label class="f" for="bar">Bar enrolment no. <span class="muted">(optional)</span></label><input class="input" id="bar"></div>
      <div><label class="f" for="pw">Choose a password</label><input class="input" id="pw" type="password" minlength="10" required></div>
      <div class="err" id="err"></div>
      <button class="btn primary" style="width:100%">Join workspace</button>
    </form>`);
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api(`/auth/invite/${encodeURIComponent(token)}`, { method: 'POST', body: { name: $('#name').value, barEnrolment: $('#bar').value, password: $('#pw').value } });
      await loadMe();
      location.hash = '#/research';
    } catch (err) { $('#err').textContent = err.message; }
  };
}

// ── Research ───────────────────────────────────────────────────────────────
const SAMPLE_QUESTIONS = [
  'What is the limitation for filing a complaint under s.138 NI Act, and from when does it run if the notice was returned "unclaimed"?',
  'Is a non-compete clause in an employment agreement enforceable after termination in India?',
  'When can a High Court quash an FIR under s.528 BNSS on the basis of a settlement in a non-compoundable offence?',
  'Can an arbitral award be set aside for patent illegality in an international commercial arbitration seated in India?',
  'What must a landlord prove to evict a tenant for bona fide personal need under the Delhi Rent Control Act?',
];

async function viewResearch(id) {
  shell('research');
  const matterOpts = await mattersOptions();
  view().innerHTML = `
  <div class="page wide">
    ${banners()}
    <h1>Legal research</h1>
    <p class="sub">Ask in plain English. Answers are researched from Indian primary sources, with every citation checked by Citation Guard.</p>
    <div class="ask card" style="padding:0">
      <textarea class="input" id="q" style="border:0;border-radius:var(--radius)" placeholder="e.g. Can the Magistrate direct registration of an FIR under s.175(3) BNSS without an affidavit from the complainant?"></textarea>
      <div class="bar">
        <div class="seg" role="group" aria-label="Depth"><button data-m="quick" class="on">Quick answer</button><button data-m="memo">Research memo</button></div>
        <select class="input" id="matter" style="width:auto;max-width:240px">${matterOpts}</select>
        <span class="spacer"></span>
        <button class="btn primary" id="go">Research</button>
      </div>
    </div>
    <div class="chips" id="chips">${SAMPLE_QUESTIONS.map((q) => `<button class="chip">${esc(q.length > 80 ? q.slice(0, 78) + '…' : q)}</button>`).join('')}</div>
    <div id="result"></div>
    <div id="history" style="margin-top:34px"></div>
  </div>`;
  let mode = 'quick';
  let followUpOf = null;
  $$('.seg button').forEach((b) => (b.onclick = () => { mode = b.dataset.m; $$('.seg button').forEach((x) => x.classList.toggle('on', x === b)); }));
  $$('#chips .chip').forEach((c, i) => (c.onclick = () => { $('#q').value = SAMPLE_QUESTIONS[i]; $('#q').focus(); }));
  $('#q').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) $('#go').click(); });
  $('#go').onclick = async () => {
    const question = $('#q').value.trim();
    if (question.length < 8) return toast('Please type your question.');
    $('#go').disabled = true;
    $('#chips').hidden = true;
    await runResearch({ question, mode, matterId: $('#matter').value || undefined, followUpOf });
    $('#go').disabled = false;
    $('#q').value = '';
    $('#q').placeholder = 'Ask a follow-up question on this answer…';
    followUpOf = $('#result').dataset.id || null;
    loadHistory();
  };
  async function loadHistory() {
    const rows = await api('/research');
    $('#history').innerHTML = rows.length ? `<h3 style="font-family:var(--sans);font-size:14px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Recent research</h3>
      <table class="list"><tbody>${rows.slice(0, 15).map((r) => `<tr class="click" data-id="${esc(r.id)}"><td>${esc(r.question.slice(0, 140))}</td><td class="small muted hide-m">${r.mode === 'memo' ? 'Memo' : 'Quick'}</td><td class="small muted hide-m">${esc(r.author)}</td><td class="small muted">${fmtDay(r.created_at)}</td></tr>`).join('')}</tbody></table>` : '';
    $$('#history tr.click').forEach((tr) => (tr.onclick = () => (location.hash = `#/research/${tr.dataset.id}`)));
  }
  loadHistory();
  if (id) {
    const r = await api(`/research/${encodeURIComponent(id)}`);
    $('#chips').hidden = true;
    renderAnswer(r.question, r.answer, r.sources, r.citations, r.id);
    followUpOf = r.id;
    $('#q').placeholder = 'Ask a follow-up question on this answer…';
  }
}

function answerLayout(question) {
  $('#result').innerHTML = `
  <div class="answer-wrap">
    <article class="card answer">
      <h2 class="q">${esc(question)}</h2>
      <div class="status" id="status"><span class="dot"></span><span id="statusText">Thinking…</span></div>
      <div class="md" id="ans"></div>
      <div class="row no-print" id="actions" hidden style="margin-top:16px;border-top:1px solid var(--line);padding-top:12px">
        <button class="btn small" id="copy">Copy</button><button class="btn small" id="print">Print / PDF</button><button class="btn small" id="toDraft">Use in a draft</button>
      </div>
    </article>
    <aside class="stack">
      <div class="card panel guard"><h3>Citation Guard</h3><div id="cites" class="small muted">Citations will be checked when the answer is complete.</div></div>
      <div class="card panel"><h3>Sources consulted</h3><div id="srcs" class="small muted">—</div></div>
    </aside>
  </div>`;
}

function renderSources(sources) {
  $('#srcs').innerHTML = sources.length
    ? sources.map((s) => `<a class="src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}<small>${esc(new URL(s.url).hostname)}</small></a>`).join('')
    : '<span class="muted">No web sources were needed for this answer.</span>';
}

function renderCitations(cites) {
  if (!cites.length) { $('#cites').innerHTML = '<span class="muted">No case citations in this answer.</span>'; return; }
  const counts = cites.reduce((a, c) => ((a[c.status] = (a[c.status] || 0) + 1), a), {});
  const label = { verified: 'Verified', landmark: 'Landmark', unverified: 'Check' };
  $('#cites').innerHTML = `<p class="small" style="margin:0 0 8px">${counts.verified || 0} verified in sources · ${counts.landmark || 0} landmark · <strong style="color:var(--bad)">${counts.unverified || 0} to check</strong></p>` +
    cites.map((c) => `<div class="cite"><span class="badge ${c.status}">${label[c.status]}</span><span>${c.source ? `<a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">${esc(c.text)}</a>` : esc(c.text)}</span></div>`).join('') +
    '<p class="small muted" style="margin:10px 0 0">"Check" means the authority was not found in the sources retrieved for this answer. Verify it on SCC Online, Manupatra or the court website before citing it.</p>';
}

function bindAnswerActions(text) {
  $('#actions').hidden = false;
  $('#copy').onclick = async () => { await navigator.clipboard.writeText(text); toast('Copied'); };
  $('#print').onclick = () => window.print();
  $('#toDraft').onclick = () => { sessionStorage.setItem('nd_draft_context', text); location.hash = '#/draft'; };
}

function renderAnswer(question, text, sources, cites, id) {
  answerLayout(question);
  $('#result').dataset.id = id || '';
  $('#status').hidden = true;
  $('#ans').innerHTML = md(text);
  renderSources(sources || []);
  renderCitations(cites || []);
  bindAnswerActions(text);
}

async function runResearch(body) {
  answerLayout(body.question);
  let text = '';
  const sources = [];
  let raf = 0;
  const paint = () => { raf = 0; $('#ans').innerHTML = md(text); };
  try {
    await streamPost('/research', body, (e) => {
      if (e.type === 'status') $('#statusText').textContent = e.message;
      else if (e.type === 'source') { sources.push(e); renderSources(sources); }
      else if (e.type === 'text') { text += e.text; $('#statusText').textContent = 'Writing…'; if (!raf) raf = requestAnimationFrame(paint); }
      else if (e.type === 'citations') renderCitations(e.citations);
      else if (e.type === 'done') { $('#result').dataset.id = e.id; history.replaceState(null, '', `#/research/${e.id}`); }
      else if (e.type === 'error') throw new Error(e.message);
    });
    paint();
    $('#status').hidden = true;
    bindAnswerActions(text);
    refreshUsage();
  } catch (err) {
    $('#status').innerHTML = `<span class="err">${esc(err.message)}</span>`;
  }
}

// ── Drafting ───────────────────────────────────────────────────────────────
async function viewDraftHome() {
  shell('draft');
  if (!state.templates) state.templates = await api('/drafts/templates');
  const { categories, templates } = state.templates;
  const drafts = await api('/drafts');
  view().innerHTML = `
  <div class="page">
    ${banners()}
    <div class="row"><div><h1>Drafting</h1><p class="sub">Court-ready first drafts in Indian formats — BNS/BNSS-aware, with placeholders instead of invented facts.</p></div></div>
    <input class="input" id="filter" placeholder="Search document types — bail, writ, 138 notice, NDA…" style="max-width:420px">
    <div id="tpls">${categories.map((c) => `<div class="cat" data-cat="${esc(c)}">${esc(c)}</div><div class="tpl-list">${templates.filter((t) => t.category === c).map((t) => `<button class="tpl" data-id="${esc(t.id)}"><b>${esc(t.name)}</b><span>${t.firm ? 'Firm precedent' : `${t.fields.length} inputs`}</span></button>`).join('')}</div>`).join('')}</div>
    <div class="cat">Your recent drafts</div>
    ${drafts.length ? `<table class="list"><tbody>${drafts.slice(0, 30).map((d) => `<tr class="click" data-id="${esc(d.id)}"><td>${esc(d.title)}</td><td class="small muted hide-m">v${d.version}</td><td class="small muted hide-m">${esc(d.author)}</td><td class="small muted">${fmtDay(d.updated_at)}</td></tr>`).join('')}</tbody></table>` : '<div class="empty card">No drafts yet. Pick a document type above.</div>'}
  </div>`;
  $$('.tpl').forEach((b) => (b.onclick = () => (location.hash = `#/draft/new/${b.dataset.id}`)));
  $$('tr.click').forEach((tr) => (tr.onclick = () => (location.hash = `#/draft/${tr.dataset.id}`)));
  $('#filter').oninput = (e) => {
    const q = e.target.value.toLowerCase();
    $$('.tpl').forEach((t) => (t.hidden = q && !t.textContent.toLowerCase().includes(q)));
    $$('.cat[data-cat]').forEach((c) => { const list = c.nextElementSibling; c.hidden = list.hidden = !$$('.tpl', list).some((t) => !t.hidden); });
  };
}

async function viewDraftNew(templateId) {
  shell('draft');
  if (!state.templates) state.templates = await api('/drafts/templates');
  const t = state.templates.templates.find((x) => x.id === templateId);
  if (!t) { location.hash = '#/draft'; return; }
  const ctx = sessionStorage.getItem('nd_draft_context');
  view().innerHTML = `
  <div class="page">
    ${banners()}
    <a href="#/draft" class="small">← All document types</a>
    <h1 style="margin-top:8px">${esc(t.name)}</h1>
    <p class="sub">Fill in what you know. Anything left blank becomes a [PLACEHOLDER] in the draft — nothing is invented.</p>
    <form id="f" class="card stack">
      <div class="grid2"><div><label class="f" for="matter">Matter</label><select class="input" id="matter">${await mattersOptions()}</select></div>
      <div><label class="f" for="title">Draft title <span class="muted">(optional)</span></label><input class="input" id="title"></div></div>
      ${t.fields.map((f) => `<div><label class="f" for="f_${esc(f.key)}">${esc(f.label)}</label>${f.long ? `<textarea class="input" id="f_${esc(f.key)}" placeholder="${esc(f.placeholder || '')}"></textarea>` : `<input class="input" id="f_${esc(f.key)}" placeholder="${esc(f.placeholder || '')}">`}</div>`).join('')}
      <div><label class="f" for="extra">Special instructions <span class="muted">(optional)</span></label><textarea class="input" id="extra" placeholder="e.g. Emphasise parity with co-accused already on bail; keep grounds concise; draft in the Delhi High Court format.">${ctx ? `Use this research:\n${esc(ctx.slice(0, 5000))}` : ''}</textarea></div>
      <div class="row"><span class="spacer"></span><button class="btn primary" id="go">Generate draft</button></div>
    </form>
  </div>`;
  sessionStorage.removeItem('nd_draft_context');
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    const inputs = Object.fromEntries(t.fields.map((f) => [f.key, $(`#f_${f.key}`).value]));
    const body = { templateId: t.id, inputs, extra: $('#extra').value, matterId: $('#matter').value || undefined, title: $('#title').value };
    editorLayout({ title: body.title || t.name, body: '' }, true);
    let text = '';
    try {
      await streamPost('/drafts/generate', body, (ev) => {
        if (ev.type === 'text') { text += ev.text; setEditorText(text); }
        else if (ev.type === 'done') { history.replaceState(null, '', `#/draft/${ev.id}`); bindEditor({ id: ev.id, title: ev.title, body: text }); }
        else if (ev.type === 'error') throw new Error(ev.message);
      });
      refreshUsage();
    } catch (err) {
      $('#dstatus').innerHTML = `<span class="err">${esc(err.message)}</span>`;
    }
  };
}

function splitNotes(text) {
  const i = text.search(/\n-{3,}\s*\n/);
  return i < 0 ? [text, ''] : [text.slice(0, i), text.slice(i).replace(/^\n-{3,}\s*\n/, '')];
}

function setEditorText(text) {
  const [doc, notes] = splitNotes(text);
  $('#paper').textContent = doc;
  $('#notes').textContent = notes || 'Drafting notes will appear here.';
}

function editorLayout(d, generating) {
  view().innerHTML = `
  <div class="page wide">
    <div class="row no-print"><a href="#/draft" class="small">← Drafting</a><span class="spacer"></span><span class="status" id="dstatus">${generating ? '<span class="dot"></span>Drafting…' : ''}</span></div>
    <div class="row no-print" style="margin:10px 0 16px"><input class="input" id="dtitle" value="${esc(d.title)}" style="font-family:var(--serif);font-size:20px;font-weight:600;max-width:640px;border-color:transparent;background:transparent;padding-left:0"></div>
    <div class="editor-wrap">
      <div class="paper" id="paper" contenteditable="${generating ? 'false' : 'true'}" spellcheck="true"></div>
      <aside class="stack no-print">
        <div class="card stack"><div class="row"><button class="btn primary small" id="save" disabled>Save</button><button class="btn small" id="docx" disabled>Download .docx</button><button class="btn small" id="printD">Print</button></div>
          <div class="small muted" id="ver"></div></div>
        <div class="card stack"><h3 style="font-family:var(--sans);font-size:13px;margin:0">Revise with AI</h3>
          <p class="small muted" style="margin:0">Select a passage in the draft to revise just that part, or give an instruction for the whole document.</p>
          <textarea class="input" id="instr" placeholder="e.g. Add a ground on delay in lodging the FIR; make the prayer for interim protection more specific." style="min-height:80px"></textarea>
          <button class="btn small" id="redraft" disabled>Revise</button></div>
        <div class="card"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 8px">Drafting notes</h3><div class="notes" id="notes">Drafting notes will appear here.</div></div>
      </aside>
    </div>
  </div>`;
  setEditorText(d.body || '');
}

function bindEditor(d) {
  $('#dstatus').textContent = '';
  $('#paper').contentEditable = 'true';
  ['save', 'docx', 'redraft'].forEach((k) => ($(`#${k}`).disabled = false));
  $('#ver').textContent = d.version ? `Version ${d.version} · saved ${fmtDate(d.updated_at)}` : 'Saved';
  const current = () => { const notes = $('#notes').textContent; return $('#paper').innerText + (notes && !notes.startsWith('Drafting notes will') ? `\n---\n${notes}` : ''); };
  $('#save').onclick = async () => { await api(`/drafts/${d.id}`, { method: 'PUT', body: { body: current(), title: $('#dtitle').value } }); toast('Draft saved'); $('#ver').textContent = `Saved ${new Date().toLocaleTimeString('en-IN')}`; };
  $('#docx').onclick = async () => { await api(`/drafts/${d.id}`, { method: 'PUT', body: { body: current(), title: $('#dtitle').value } }); location.href = `/api/drafts/${d.id}/docx`; };
  $('#printD').onclick = () => window.print();
  let selection = '';
  document.addEventListener('selectionchange', () => {
    const s = window.getSelection();
    if (s && $('#paper') && $('#paper').contains(s.anchorNode) && String(s).trim()) selection = String(s);
  });
  $('#redraft').onclick = async () => {
    const instruction = $('#instr').value.trim();
    if (!instruction) return toast('Type what you want changed.');
    const body = current();
    $('#redraft').disabled = true;
    $('#paper').contentEditable = 'false';
    $('#dstatus').innerHTML = '<span class="dot"></span>Revising…';
    let text = '';
    try {
      await streamPost(`/drafts/${d.id}/redraft`, { instruction, body, selection }, (ev) => {
        if (ev.type === 'text') { text += ev.text; setEditorText(text); }
        else if (ev.type === 'error') throw new Error(ev.message);
      });
      $('#instr').value = '';
      selection = '';
      toast('Revised draft saved as a new version');
      refreshUsage();
    } catch (err) { toast(err.message); setEditorText(body); }
    $('#dstatus').textContent = '';
    $('#redraft').disabled = false;
    $('#paper').contentEditable = 'true';
  };
}

async function viewDraft(id) {
  shell('draft');
  const d = await api(`/drafts/${encodeURIComponent(id)}`);
  editorLayout(d, false);
  bindEditor(d);
}

// ── Document review ────────────────────────────────────────────────────────
const REVIEW_MODES = [
  ['contract', 'Contract review', 'Risk table, missing protections, Indian law compliance, negotiation priorities'],
  ['judgment', 'Judgment summary', 'Headnote: facts, issues, held, ratio, with paragraph references'],
  ['chronology', 'List of dates', 'Chronology table for petitions and written submissions'],
  ['pleading', 'Pleading critique', 'Maintainability, limitation, weaknesses and suggested amendments'],
  ['custom', 'Ask a question', 'Any specific question about the document'],
];

async function viewReview() {
  shell('review');
  const docs = await api('/documents');
  view().innerHTML = `
  <div class="page wide">
    ${banners()}
    <h1>Document review</h1>
    <p class="sub">Upload a contract, judgment, pleading or chargesheet (PDF, DOCX or TXT — scanned PDFs work too). Files are deleted automatically after the retention period.</p>
    <div class="grid2">
      <div class="stack">
        <label class="drop" id="drop" for="file"><input type="file" id="file" accept=".pdf,.docx,.txt" hidden><strong>Drop a file here</strong> or click to choose<br><span class="small">Up to 25 MB</span></label>
        <div class="card"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 8px">Your documents</h3>
          ${docs.length ? `<table class="list"><tbody>${docs.map((d) => `<tr class="click" data-id="${esc(d.id)}" data-name="${esc(d.filename)}"><td>${esc(d.filename)}</td><td class="small muted">${fmtDay(d.created_at)}</td><td><button class="btn small ghost del" data-id="${esc(d.id)}" aria-label="Delete">✕</button></td></tr>`).join('')}</tbody></table>` : '<p class="muted small">No documents yet.</p>'}
        </div>
      </div>
      <div class="card stack" id="runner">
        <p class="muted">Choose or upload a document to review.</p>
      </div>
    </div>
    <div id="out" style="margin-top:20px"></div>
  </div>`;
  const drop = $('#drop');
  const upload = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    drop.innerHTML = 'Uploading…';
    try {
      const d = await api('/documents', { method: 'POST', body: fd });
      await viewReview();
      pick(d.id, d.filename);
    } catch (e) { toast(e.message); viewReview(); }
  };
  $('#file').onchange = (e) => upload(e.target.files[0]);
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('over')));
  drop.addEventListener('drop', (e) => { e.preventDefault(); upload(e.dataTransfer.files[0]); });
  $$('tr.click').forEach((tr) => (tr.onclick = (e) => { if (!e.target.closest('.del')) pick(tr.dataset.id, tr.dataset.name); }));
  $$('.del').forEach((b) => (b.onclick = async () => { if (confirm('Delete this document and its reviews?')) { await api(`/documents/${b.dataset.id}`, { method: 'DELETE' }); viewReview(); } }));

  async function pick(id, name) {
    $('#runner').innerHTML = `
      <div><div class="small muted">Selected</div><strong>${esc(name)}</strong></div>
      <div class="stack">${REVIEW_MODES.map(([k, label, desc], i) => `<label class="row small" style="align-items:flex-start;gap:8px;cursor:pointer"><input type="radio" name="mode" value="${k}" ${i === 0 ? 'checked' : ''}><span><strong>${label}</strong><br><span class="muted">${desc}</span></span></label>`).join('')}</div>
      <div><label class="f" for="instr">Instructions <span class="muted">(e.g. "We act for the vendor")</span></label><textarea class="input" id="instr" style="min-height:70px"></textarea></div>
      <button class="btn primary" id="run">Run review</button>`;
    const prev = await api(`/documents/${id}/reviews`);
    if (prev.length) $('#out').innerHTML = `<div class="card md">${md(prev[0].result)}</div>`;
    else $('#out').innerHTML = '';
    $('#run').onclick = async () => {
      const mode = $('input[name=mode]:checked').value;
      $('#run').disabled = true;
      $('#out').innerHTML = '<div class="card"><div class="status"><span class="dot"></span>Reading the document…</div><div class="md" id="rv"></div></div>';
      let text = '';
      let raf = 0;
      try {
        await streamPost(`/documents/${id}/review`, { mode, instructions: $('#instr').value }, (ev) => {
          if (ev.type === 'text') { text += ev.text; if (!raf) raf = requestAnimationFrame(() => { raf = 0; $('#rv').innerHTML = md(text); }); }
          else if (ev.type === 'error') throw new Error(ev.message);
        });
        $('#rv').innerHTML = md(text);
        $('.status', $('#out'))?.remove();
        refreshUsage();
      } catch (e) { $('#out').innerHTML = `<div class="card err">${esc(e.message)}</div>`; }
      $('#run').disabled = false;
    };
  }
}

// ── Legal tools ────────────────────────────────────────────────────────────
async function viewTools() {
  shell('tools');
  const lim = await api('/tools/limitation');
  const groups = [...new Set(lim.map((l) => l.group))];
  view().innerHTML = `
  <div class="page">
    <h1>Legal tools</h1>
    <p class="sub">Instant, deterministic references — no AI actions used.</p>
    <div class="card stack">
      <h2 style="margin:0;font-size:20px">New criminal laws converter</h2>
      <p class="small muted" style="margin:0">IPC → BNS, CrPC → BNSS, Evidence Act → BSA (and back). In force from 1 July 2024.</p>
      <div class="row">
        <select class="input" id="code" style="width:auto"><option value="ipc">IPC ↔ BNS</option><option value="crpc">CrPC ↔ BNSS</option><option value="iea">Evidence Act ↔ BSA</option></select>
        <div class="seg"><button class="on" data-d="old-to-new">Old → New</button><button data-d="new-to-old">New → Old</button></div>
        <input class="input" id="sec" placeholder="Section no. or keyword, e.g. 420 or bail" style="flex:1;min-width:180px">
      </div>
      <div id="conv"></div>
    </div>
    <div class="card stack" style="margin-top:18px">
      <h2 style="margin:0;font-size:20px">Limitation calculator</h2>
      <p class="small muted" style="margin:0">Limitation Act, 1963 and special statutes. Excludes the first day (s.12); flags weekends (s.4).</p>
      <div><label class="f" for="lim">Proceeding</label><select class="input" id="lim">${groups.map((g) => `<optgroup label="${esc(g)}">${lim.filter((l) => l.group === g).map((l) => `<option value="${esc(l.id)}">${esc(l.label)}</option>`).join('')}</optgroup>`).join('')}</select></div>
      <div class="grid2"><div><label class="f" for="start">Starting date — <span id="from" class="muted" style="font-weight:400"></span></label><input class="input" type="date" id="start"></div>
      <div><label class="f" for="excl">Days to exclude <span class="muted">(e.g. certified copy, s.12)</span></label><input class="input" type="number" min="0" id="excl" value="0"></div></div>
      <div id="limOut"></div>
    </div>
  </div>`;
  let dir = 'old-to-new';
  const conv = async () => {
    const q = $('#sec').value.trim();
    if (!q) { $('#conv').innerHTML = ''; return; }
    const rows = await api(`/tools/convert?code=${$('#code').value}&q=${encodeURIComponent(q)}&dir=${dir}`);
    const names = { ipc: ['IPC', 'BNS'], crpc: ['CrPC', 'BNSS'], iea: ['IEA', 'BSA'] }[$('#code').value];
    $('#conv').innerHTML = rows.length ? `<table class="list"><thead><tr><th>${names[0]}</th><th>${names[1]}</th><th>Subject</th></tr></thead><tbody>${rows.map((r) => `<tr><td><strong>${esc(r.old)}</strong></td><td><strong>${esc(r.new)}</strong></td><td>${esc(r.title)}${r.changed ? ' <span class="badge unverified">Changed</span>' : ''}</td></tr>`).join('')}</tbody></table><p class="small muted">Confirm against the bare act before filing. "Changed" marks provisions altered in substance.</p>`
      : '<p class="muted small">No match in the quick-reference table. Try a keyword, or check the MHA comparative table.</p>';
  };
  $('#sec').oninput = conv;
  $('#code').onchange = conv;
  $$('.seg button').forEach((b) => (b.onclick = () => { dir = b.dataset.d; $$('.seg button').forEach((x) => x.classList.toggle('on', x === b)); conv(); }));
  const setFrom = () => ($('#from').textContent = lim.find((l) => l.id === $('#lim').value)?.from || '');
  const calc = async () => {
    setFrom();
    if (!$('#start').value) { $('#limOut').innerHTML = ''; return; }
    try {
      const r = await api('/tools/limitation', { method: 'POST', body: { id: $('#lim').value, startDate: $('#start').value, excludedDays: $('#excl').value } });
      const d = new Date(`${r.lastDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const tone = r.daysLeft < 0 ? 'var(--bad)' : r.daysLeft <= 7 ? 'var(--warn)' : 'var(--ok)';
      $('#limOut').innerHTML = `<div class="card" style="background:var(--surface-2)"><div class="small muted">Last date</div><div class="stat">${esc(d)} <span class="small muted">(${esc(r.weekday)})</span></div>
        <div style="color:${tone};font-weight:600">${r.daysLeft < 0 ? `Expired ${-r.daysLeft} day(s) ago — consider condonation of delay` : r.daysLeft === 0 ? 'Today is the last day' : `${r.daysLeft} day(s) left`}</div>
        <ul class="small">${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>`;
    } catch (e) { $('#limOut').innerHTML = `<p class="err">${esc(e.message)}</p>`; }
  };
  ['lim', 'start', 'excl'].forEach((k) => ($(`#${k}`).oninput = calc));
  setFrom();
}

// ── Matters ────────────────────────────────────────────────────────────────
async function viewMatters() {
  shell('matters');
  const rows = await api('/matters');
  view().innerHTML = `
  <div class="page">
    ${banners()}
    <div class="row"><div><h1>Matters</h1><p class="sub">Keep research, drafts and documents together by client matter.</p></div><span class="spacer"></span><button class="btn primary" id="new">New matter</button></div>
    ${rows.length ? `<div class="card" style="padding:0"><table class="list"><thead><tr><th>Matter</th><th class="hide-m">Client</th><th class="hide-m">Forum</th><th>Work</th><th class="hide-m">Status</th></tr></thead><tbody>
      ${rows.map((m) => `<tr class="click" data-id="${esc(m.id)}"><td><strong>${esc(m.title)}</strong>${m.case_number ? `<div class="small muted">${esc(m.case_number)}</div>` : ''}</td><td class="hide-m">${esc(m.client || '')}</td><td class="hide-m small">${esc(m.court || '')}</td><td class="small muted">${m.research_count} research · ${m.draft_count} drafts · ${m.document_count} docs</td><td class="hide-m small">${esc(m.status)}</td></tr>`).join('')}
      </tbody></table></div>` : '<div class="card empty">No matters yet. Create one to organise your work by client and case.</div>'}
  </div>
  <dialog id="dlg"><form method="dialog" id="mf" class="stack">
    <h2 style="margin:0;font-size:20px" id="dlgTitle">New matter</h2>
    <div><label class="f" for="mt">Title</label><input class="input" id="mt" required placeholder="e.g. Sharma Traders v. Apex Retail — cheque dishonour"></div>
    <div class="grid2"><div><label class="f" for="mc">Client</label><input class="input" id="mc"></div><div><label class="f" for="mp">Practice area</label><input class="input" id="mp"></div></div>
    <div class="grid2"><div><label class="f" for="mco">Court / forum</label><input class="input" id="mco"></div><div><label class="f" for="mn">Case number</label><input class="input" id="mn"></div></div>
    <div><label class="f" for="mno">Notes (shared with the AI as matter context)</label><textarea class="input" id="mno"></textarea></div>
    <div class="row"><button class="btn danger small" id="mdel" type="button" hidden>Delete</button><label class="small row" id="mclosedWrap" hidden><input type="checkbox" id="mclosed"> Closed</label><span class="spacer"></span><button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" id="msave" value="ok">Save</button></div>
  </form></dialog>`;
  const dlg = $('#dlg');
  let editing = null;
  const open = (m) => {
    editing = m;
    $('#dlgTitle').textContent = m ? 'Edit matter' : 'New matter';
    $('#mt').value = m?.title || ''; $('#mc').value = m?.client || ''; $('#mp').value = m?.practice_area || '';
    $('#mco').value = m?.court || ''; $('#mn').value = m?.case_number || ''; $('#mno').value = m?.notes || '';
    $('#mdel').hidden = $('#mclosedWrap').hidden = !m;
    $('#mclosed').checked = m?.status === 'closed';
    dlg.showModal();
  };
  $('#new').onclick = () => open(null);
  $$('tr.click').forEach((tr) => (tr.onclick = () => (location.hash = `#/matters/${tr.dataset.id}`)));
  $('#mdel').onclick = async () => { if (confirm('Delete this matter? Research and drafts are kept but unlinked.')) { await api(`/matters/${editing.id}`, { method: 'DELETE' }); dlg.close(); location.hash = '#/matters'; viewMatters(); } };
  $('#mf').onsubmit = async (e) => {
    if (e.submitter?.value !== 'ok') return;
    e.preventDefault();
    const body = { title: $('#mt').value, client: $('#mc').value, practiceArea: $('#mp').value, court: $('#mco').value, caseNumber: $('#mn').value, notes: $('#mno').value, status: $('#mclosed').checked ? 'closed' : 'open' };
    try {
      if (editing) await api(`/matters/${editing.id}`, { method: 'PUT', body });
      else await api('/matters', { method: 'POST', body });
      dlg.close();
      editing ? viewMatter(editing.id) : viewMatters();
    } catch (err) { toast(err.message); }
  };
  return { open };
}

async function viewMatter(id) {
  const { open } = await viewMatters();
  const m = state.matters.find((x) => x.id === id) || (await api('/matters')).find((x) => x.id === id);
  if (!m) { location.hash = '#/matters'; return; }
  const [research, drafts] = await Promise.all([api(`/research?matter=${encodeURIComponent(id)}`), api(`/drafts?matter=${encodeURIComponent(id)}`)]);
  view().querySelector('.page').innerHTML = `
    <a href="#/matters" class="small">← Matters</a>
    <div class="row" style="margin-top:8px"><div><h1>${esc(m.title)}</h1><p class="sub">${[m.client, m.court, m.case_number, m.practice_area].filter(Boolean).map(esc).join(' · ') || '&nbsp;'}</p></div><span class="spacer"></span><button class="btn" id="edit">Edit</button></div>
    ${m.notes ? `<div class="card small" style="white-space:pre-wrap;margin-bottom:16px">${esc(m.notes)}</div>` : ''}
    <div class="grid2">
      <div class="card"><div class="row"><h3 style="margin:0;font-size:16px">Research</h3><span class="spacer"></span><a class="btn small" href="#/research">New</a></div>
        ${research.length ? `<table class="list"><tbody>${research.map((r) => `<tr class="click" data-h="#/research/${esc(r.id)}"><td>${esc(r.question.slice(0, 100))}</td><td class="small muted">${fmtDay(r.created_at)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted small">No research yet — pick this matter in the Research box.</p>'}</div>
      <div class="card"><div class="row"><h3 style="margin:0;font-size:16px">Drafts</h3><span class="spacer"></span><a class="btn small" href="#/draft">New</a></div>
        ${drafts.length ? `<table class="list"><tbody>${drafts.map((d) => `<tr class="click" data-h="#/draft/${esc(d.id)}"><td>${esc(d.title)}</td><td class="small muted">${fmtDay(d.updated_at)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted small">No drafts yet.</p>'}</div>
    </div>`;
  $('#edit').onclick = () => open(m);
  $$('tr.click[data-h]').forEach((tr) => (tr.onclick = () => (location.hash = tr.dataset.h)));
}

// ── Settings ───────────────────────────────────────────────────────────────
async function viewSettings(tab = 'firm') {
  shell('settings');
  const me = state.me;
  const isAdmin = ['owner', 'admin'].includes(me.user.role);
  const tabs = [['firm', 'Firm'], ['team', 'Team'], ['usage', 'Usage'], ['billing', 'Billing'], ['templates', 'Firm templates'], ['security', 'Security & data'], ['account', 'My account']]
    .filter(([k]) => isAdmin || ['account', 'billing'].includes(k));
  if (!tabs.some(([k]) => k === tab)) tab = tabs[0][0];
  view().innerHTML = `<div class="page">${banners()}<h1>Settings</h1><p class="sub">${esc(me.firm.name)}</p>
    <nav class="tabs">${tabs.map(([k, l]) => `<a href="#/settings/${k}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</nav><div id="tab"></div></div>`;
  const el = $('#tab');
  const renderers = { firm: tabFirm, team: tabTeam, usage: tabUsage, billing: tabBilling, templates: tabTemplates, security: tabSecurity, account: tabAccount };
  await renderers[tab](el, me);
}

async function tabFirm(el, me) {
  el.innerHTML = `<form class="card stack" id="f" style="max-width:560px">
    <div><label class="f" for="n">Firm name</label><input class="input" id="n" value="${esc(me.firm.name)}"></div>
    <div><label class="f" for="c">City</label><input class="input" id="c" value="${esc(me.firm.city || '')}"></div>
    <div class="grid2"><div><label class="f" for="g">GSTIN <span class="muted">(for input tax credit)</span></label><input class="input" id="g" maxlength="15" value="${esc(me.firm.gstin || '')}"></div>
    <div><label class="f" for="s">State code <span class="muted">(e.g. 27 for Maharashtra)</span></label><input class="input" id="s" maxlength="2"></div></div>
    <div class="row"><span class="spacer"></span><button class="btn primary">Save</button></div></form>`;
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    const g = $('#g').value.trim();
    await api('/admin/firm', { method: 'PUT', body: { name: $('#n').value, city: $('#c').value, gstin: g, billingState: $('#s').value || g.slice(0, 2) } });
    await loadMe();
    toast('Saved');
  };
}

async function tabTeam(el, me) {
  const t = await api('/admin/team');
  el.innerHTML = `<div class="card" style="padding:0"><table class="list"><thead><tr><th>Name</th><th class="hide-m">Email</th><th>Role</th><th class="hide-m">Last sign-in</th><th></th></tr></thead><tbody>
    ${t.users.map((u) => `<tr><td>${esc(u.name)}${u.bar_enrolment ? `<div class="small muted">${esc(u.bar_enrolment)}</div>` : ''}</td><td class="hide-m small">${esc(u.email)}</td>
      <td>${u.role === 'owner' ? 'Owner' : `<select class="input role" data-id="${esc(u.id)}" style="width:auto;padding:4px 8px"><option value="member" ${u.role === 'member' ? 'selected' : ''}>Member</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option></select>`}</td>
      <td class="hide-m small muted">${u.last_login_at ? fmtDate(u.last_login_at) : 'Never'}</td>
      <td>${u.role === 'owner' ? '' : `<button class="btn small toggle" data-id="${esc(u.id)}" data-active="${u.active}">${u.active ? 'Deactivate' : 'Reactivate'}</button>`}</td></tr>`).join('')}
    ${t.invites.map((i) => `<tr><td class="muted">Invited</td><td class="hide-m small">${esc(i.email)}</td><td>${esc(i.role)}</td><td class="hide-m small muted">expires ${fmtDay(i.expires_at)}</td><td></td></tr>`).join('')}
  </tbody></table></div>
  <form class="card row" id="inv" style="margin-top:16px"><input class="input" id="ie" type="email" placeholder="colleague@firm.in" required style="flex:1;min-width:200px"><select class="input" id="ir" style="width:auto"><option value="member">Member</option><option value="admin">Admin</option></select><button class="btn primary">Invite</button></form>
  <div id="link" class="small" style="margin-top:10px"></div>`;
  $$('.role').forEach((s) => (s.onchange = async () => { await api(`/admin/users/${s.dataset.id}`, { method: 'PUT', body: { role: s.value } }); toast('Role updated'); }));
  $$('.toggle').forEach((b) => (b.onclick = async () => { await api(`/admin/users/${b.dataset.id}`, { method: 'PUT', body: { active: b.dataset.active !== '1' } }); tabTeam(el, me); }));
  $('#inv').onsubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await api('/admin/invites', { method: 'POST', body: { email: $('#ie').value, role: $('#ir').value } });
      $('#link').innerHTML = `Invitation link (valid 7 days) — send it to your colleague:<br><input class="input" id="invLink" readonly value="${esc(r.link)}">`;
      $('#invLink').onfocus = (ev) => ev.target.select();
      $('#ie').value = '';
    } catch (err) { toast(err.message); }
  };
}

async function tabUsage(el) {
  const u = await api('/admin/usage');
  const s = u.summary;
  const max = Math.max(1, ...u.daily.map((d) => d.actions));
  el.innerHTML = `<div class="grid3">
      <div class="card"><div class="small muted">Actions used</div><div class="stat">${s.actions} <span class="small muted">/ ${s.quota}</span></div></div>
      <div class="card"><div class="small muted">Remaining this cycle</div><div class="stat">${s.remaining}</div></div>
      <div class="card"><div class="small muted">Web searches run</div><div class="stat">${s.web_searches}</div></div></div>
    <div class="card" style="margin-top:16px"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 12px">Last 30 days</h3>
      ${u.daily.length ? `<svg viewBox="0 0 ${u.daily.length * 22} 110" role="img" aria-label="Daily AI actions" style="width:100%;height:120px">${u.daily.map((d, i) => { const h = Math.max(2, (d.actions / max) * 90); return `<rect x="${i * 22 + 3}" y="${100 - h}" width="16" height="${h}" rx="3" fill="var(--brand)"><title>${esc(d.day)}: ${d.actions}</title></rect>`; }).join('')}</svg>` : '<p class="muted small">No activity yet.</p>'}</div>
    <div class="grid2" style="margin-top:16px">
      <div class="card"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 8px">By person</h3><table class="list"><tbody>${u.byUser.map((r) => `<tr><td>${esc(r.name)}</td><td class="small muted">${r.actions} actions</td></tr>`).join('')}</tbody></table></div>
      <div class="card"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 8px">By feature</h3><table class="list"><tbody>${u.byKind.map((r) => `<tr><td>${esc(r.kind.replace(/_/g, ' '))}</td><td class="small muted">${r.actions} actions · ${r.calls} runs</td></tr>`).join('') || '<tr><td class="muted small">—</td></tr>'}</tbody></table></div></div>
    <p class="small muted">Research answer = 1 action · Research memo = 3 · Draft or revision = 1 · Document review = 2. Legal tools are free.</p>`;
}

async function tabBilling(el, me) {
  const b = await api('/billing');
  const isAdmin = ['owner', 'admin'].includes(me.user.role);
  el.innerHTML = `
    <div class="card" style="margin-bottom:16px"><div class="row"><div><div class="small muted">Current plan</div><div class="stat">${esc(me.firm.planName)} <span class="small muted">· ${b.current.seats} seat(s) · ${esc(b.current.status)}</span></div></div></div></div>
    <div class="grid3">${b.plans.map((p) => `<div class="card plan ${p.id === b.current.plan ? 'current' : ''}">
      <strong>${esc(p.name)}</strong><div class="price">${inr(p.pricePerSeat)}<span class="small muted"> /seat/month + GST</span></div>
      <div class="small muted">${p.minSeats === p.maxSeats ? '1 advocate' : `${p.minSeats}–${p.maxSeats} seats`} · ${p.actionsPerSeat} actions per seat, pooled</div>
      ${isAdmin ? `<div class="row"><input class="input seats" data-plan="${esc(p.id)}" type="number" min="${p.minSeats}" max="${p.maxSeats}" value="${Math.max(p.minSeats, Math.min(p.maxSeats, b.current.seats))}" style="width:80px" ${p.minSeats === p.maxSeats ? 'hidden' : ''}><button class="btn ${p.id === 'chambers' ? 'primary' : ''} sub" data-plan="${esc(p.id)}">${p.id === b.current.plan && b.current.status === 'active' ? 'Change seats' : 'Subscribe'}</button></div>` : ''}
    </div>`).join('')}</div>
    <p class="small muted">Pay by UPI Autopay, card or e-mandate via Razorpay. GST invoices are issued automatically; add your GSTIN under Firm to claim input tax credit. Annual billing (2 months free) and Enterprise plans: <a href="mailto:sales@nyayadesk.in">sales@nyayadesk.in</a>.</p>
    ${isAdmin && b.current.status === 'active' ? '<button class="btn small" id="cancel">Cancel subscription</button>' : ''}
    <div class="card" style="margin-top:18px"><h3 style="font-family:var(--sans);font-size:13px;margin:0 0 8px">Invoices</h3>
      ${b.invoices.length ? `<table class="list"><tbody>${b.invoices.map((i) => `<tr><td>${esc(i.number)}</td><td class="small muted">${fmtDay(i.created_at)}</td><td>${inr(i.total_paise / 100)}</td><td><a href="/api/billing/invoices/${esc(i.id)}" target="_blank">View</a></td></tr>`).join('')}</tbody></table>` : '<p class="muted small">No invoices yet.</p>'}</div>`;
  $$('.sub').forEach((btn) => (btn.onclick = async () => {
    const plan = btn.dataset.plan;
    const seats = $(`.seats[data-plan="${plan}"]`)?.value || 1;
    try {
      const r = await api('/billing/subscribe', { method: 'POST', body: { plan, seats } });
      if (window.Razorpay) {
        new window.Razorpay({ key: r.keyId, subscription_id: r.subscriptionId, name: 'NyayaDesk', description: `${plan} plan`, theme: { color: '#1b3a6b' },
          handler: () => { toast('Payment received — activating your plan…'); setTimeout(() => location.reload(), 4000); } }).open();
      } else if (r.shortUrl) location.href = r.shortUrl;
    } catch (e) { toast(e.message, 6000); }
  }));
  $('#cancel') && ($('#cancel').onclick = async () => { if (confirm('Cancel at the end of the current billing cycle?')) { const r = await api('/billing/cancel', { method: 'POST' }); toast(r.message); } });
  if (b.enabled && !document.querySelector('script[src*="razorpay"]')) {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.head.append(s);
  }
}

async function tabTemplates(el) {
  const { templates } = await api('/drafts/templates');
  const mine = templates.filter((t) => t.firm);
  el.innerHTML = `<p class="muted">Teach NyayaDesk your house style. Paste a precedent your firm uses; new drafts of that type will follow its structure and tone.</p>
    ${mine.length ? `<div class="card" style="padding:0;margin-bottom:16px"><table class="list"><tbody>${mine.map((t) => `<tr><td><strong>${esc(t.name)}</strong><div class="small muted">${esc(t.instructions.slice(0, 140))}</div></td><td><button class="btn small del" data-id="${esc(t.id)}">Delete</button></td></tr>`).join('')}</tbody></table></div>` : ''}
    <form class="card stack" id="f">
      <div class="grid2"><div><label class="f" for="n">Template name</label><input class="input" id="n" required placeholder="e.g. Recovery suit — Bombay HC (Commercial Division)"></div><div><label class="f" for="c">Category</label><input class="input" id="c" placeholder="Firm templates"></div></div>
      <div><label class="f" for="i">Drafting instructions</label><textarea class="input" id="i" required placeholder="What this document is for, forum, mandatory sections, tone."></textarea></div>
      <div><label class="f" for="s">Precedent text <span class="muted">(anonymise client details)</span></label><textarea class="input" id="s" style="min-height:160px"></textarea></div>
      <div class="row"><span class="spacer"></span><button class="btn primary">Add template</button></div></form>`;
  $$('.del').forEach((b) => (b.onclick = async () => { await api(`/drafts/firm-templates/${b.dataset.id}`, { method: 'DELETE' }); state.templates = null; tabTemplates(el); }));
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/drafts/firm-templates', { method: 'POST', body: { name: $('#n').value, category: $('#c').value, instructions: $('#i').value, sample: $('#s').value } });
      state.templates = null;
      toast('Template added');
      tabTemplates(el);
    } catch (err) { toast(err.message); }
  };
}

async function tabSecurity(el) {
  const log = await api('/admin/audit');
  el.innerHTML = `<div class="grid2">
    <div class="card stack small"><h3 style="margin:0;font-size:16px">How your data is handled</h3>
      <ul><li>Each firm's data is isolated; colleagues outside your firm can never see it.</li>
      <li>Client documents are encrypted in transit and deleted automatically after the retention period.</li>
      <li>Your prompts and documents are <strong>not used to train AI models</strong>.</li>
      <li>Every sign-in, export and deletion is recorded in the audit log below.</li></ul>
      <a class="btn small" href="/api/admin/export">Export all firm data (JSON)</a></div>
    <div class="card small"><h3 style="margin:0 0 8px;font-size:16px">Professional responsibility</h3>
      <p>NyayaDesk assists advocates; it does not give legal advice to clients. Verify every authority flagged "Check" by Citation Guard, and review every draft before filing or sending.</p></div></div>
    <div class="card" style="margin-top:16px;padding:0"><table class="list"><thead><tr><th>When</th><th>Who</th><th>Action</th><th class="hide-m">IP</th></tr></thead><tbody>
      ${log.map((a) => `<tr><td class="small">${fmtDate(a.created_at)}</td><td class="small">${esc(a.user || 'System')}</td><td class="small">${esc(a.action)}${a.target ? ` <span class="muted">${esc(a.target)}</span>` : ''}</td><td class="small muted hide-m">${esc(a.ip || '')}</td></tr>`).join('')}</tbody></table></div>`;
}

async function tabAccount(el, me) {
  el.innerHTML = `<form class="card stack" id="f" style="max-width:460px"><div><strong>${esc(me.user.name)}</strong><div class="small muted">${esc(me.user.email)} · ${esc(me.user.role)}</div></div>
    <div><label class="f" for="cur">Current password</label><input class="input" type="password" id="cur" autocomplete="current-password" required></div>
    <div><label class="f" for="pw">New password</label><input class="input" type="password" id="pw" autocomplete="new-password" minlength="10" required></div>
    <div class="row"><span class="spacer"></span><button class="btn primary">Change password</button></div></form>`;
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    try { await api('/auth/password', { method: 'POST', body: { current: $('#cur').value, password: $('#pw').value } }); toast('Password changed'); e.target.reset(); } catch (err) { toast(err.message); }
  };
}

// ── Router ─────────────────────────────────────────────────────────────────
async function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'research').split('/');
  const [page, a, b] = parts;
  if (page === 'join' && a) return viewJoin(a);
  if (page === 'signup') return viewSignup();
  if (page === 'login') return viewLogin();
  if (!state.me && !(await loadMe())) return viewLogin();
  try {
    switch (page) {
      case 'research': return await viewResearch(a);
      case 'draft': return a === 'new' ? await viewDraftNew(b) : a ? await viewDraft(a) : await viewDraftHome();
      case 'review': return await viewReview();
      case 'tools': return await viewTools();
      case 'matters': return a ? await viewMatter(a) : await viewMatters();
      case 'settings': return await viewSettings(a);
      default: location.hash = '#/research';
    }
  } catch (err) {
    if (view()) view().innerHTML = `<div class="page"><div class="card err">${esc(err.message)}</div></div>`;
  }
}

window.addEventListener('hashchange', route);
route();
