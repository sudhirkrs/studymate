# NyayaDesk

**AI legal research and drafting workspace for Indian law firms.** A complete, sellable SaaS product: marketing site, multi-firm web app, AI research with citation checking, drafting in Indian court formats, document review, legal tools, team management, usage metering, Razorpay subscriptions with GST invoices, and a full go-to-market plan in [`launch/`](launch/README.md).

## What's in the product

| Area | What it does |
|---|---|
| **Research** | Plain-English questions answered by Claude with web search restricted to Indian primary and reputable legal sources (sci.gov.in, High Court sites, India Code, the Gazette, regulators, Indian Kanoon). Quick answer or full research memo; follow-up questions; matter context. |
| **Citation Guard** | Extracts every case name and citation (SCC, SCC OnLine, AIR, INSC, SCR, Cri LJ, neutral citations) from each answer and grades it **Verified** (found in retrieved sources), **Landmark** (settled citation in a built-in index) or **Check** (not verified — flagged red). |
| **Drafting** | 37 Indian templates across notices, criminal (BNSS bail, anticipatory bail, s.528 quashing, discharge, s.138 complaint), civil (plaint, written statement, O.XXXIX injunction, caveat), constitutional (Art. 226 writ, SLP, RTI), commercial (NDA, MSA, board resolution, s.21 arbitration notice), labour & employment (appointment letter, charge-sheet and reply, domestic enquiry report, termination/retrenchment, Labour Court claim, gratuity claim, POSH complaint and IC inquiry report, full-and-final settlement, contract-labour agreement, EPFO/ESIC reply), family and property. Placeholders instead of invented facts; drafting notes; in-browser editing; "revise with AI" on a selection; versioning; Word export in A4 / Times New Roman 14 / 1.5 spacing. |
| **Firm templates** | Firms add their own precedents so drafts follow house style. |
| **Document review** | Upload PDF (including scanned), DOCX or TXT: contract risk table, Labour Codes compliance audit, judgment headnote with paragraph references, list of dates, pleading critique, or a custom question. Uploads auto-delete after the retention period. |
| **Legal tools** (free) | IPC↔BNS, CrPC↔BNSS, Evidence Act↔BSA converter; the 29 repealed labour Acts ↔ the four Labour Codes with key provisions and changes; limitation calculator (Limitation Act articles, NI Act s.138/142, Arbitration s.34, IBC s.61, CPA, GST, income-tax, industrial disputes, POSH, gratuity) with s.12 exclusion and weekend warnings. |
| **Matters** | Organise research, drafts and documents by client matter; matter notes are passed to the AI as context. |
| **Firm admin** | Invitations, roles (owner/admin/member), deactivation, usage by person and feature, audit log, full JSON data export. |
| **Billing** | 14-day trial, Starter (₹999, standard model) / Solo / Chambers / Firm plans with pooled "action" quotas, Razorpay subscriptions (UPI Autopay, cards, e-mandate), signed webhooks, automatic GST tax invoices (CGST+SGST or IGST, FY-wise numbering). |
| **Marketing site** | Landing page with pricing and FAQ, demo-request form feeding a `leads` table, Terms and Privacy templates. |

## Quick start (local)

Requires Node.js 22.5+ (uses the built-in `node:sqlite`; no native build).

```bash
cd nyayadesk
npm install
npm run seed          # demo firm: demo@nyayadesk.in / DemoPass2026
npm start             # http://localhost:8080
```

Without `ANTHROPIC_API_KEY` the app runs in **demo mode** with realistic sample outputs — useful for sales demos and CI. For live AI:

```bash
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Run the tests (33 unit, API and tooling tests):

```bash
npm test
```

## Choosing models: the comparison tool

Before changing a model or launching a cheaper plan, measure quality. `eval/compare.js` runs the same research questions and drafts (`eval/questions.json` — 30 items across 12 practice areas; add your own) through several Claude models and writes, to `eval/results/<timestamp>/`:

| File | For |
|---|---|
| `report.html` | Graders: answers side by side, labelled A/B/C, shuffled per question |
| `grading-sheet.csv` | Graders: score 1–5, usable Y/N, wrong-or-invented-law Y/N, notes — no model names or costs |
| `key.csv` | You only: which label is which model, cost, time, Citation Guard counts |
| `summary.md` | Automatic metrics per model: cost per answer and per 100, time, unverified citations |

```bash
npm run compare -- --models claude-opus-5,claude-sonnet-5 --limit 5          # prints estimate, then stops
npm run compare -- --models claude-opus-5,claude-sonnet-5,claude-haiku-4-5 --yes   # full run (~₹1,300)
npm run compare -- --area labour --yes          # one practice area
npm run compare -- --memo --limit 10 --yes      # research memos instead of quick answers
# after advocates fill in grading-sheet.csv:
npm run compare -- --score eval/results/<timestamp>
```

Live runs cost money, so the tool prints an estimate and does nothing until you add `--yes`. Without an API key it runs in demo mode (free) so you can try the workflow.

## Configuration

All settings are environment variables — see [`.env.example`](.env.example). The important ones:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enables live AI. Blank = demo mode. |
| `NYAYA_MODEL` | Premium model for trial, Solo, Chambers and Firm plans (default `claude-opus-5`). |
| `NYAYA_MODEL_STANDARD` | Model for the ₹999 Starter plan (default `claude-sonnet-5`). |
| `NYAYA_FALLBACKS` | Server-side refusal fallback (`default`) — if the model declines a request, Anthropic re-runs it on its recommended fallback model within the same call. `off` to disable. |
| `PUBLIC_URL` | Used in invitation links. |
| `UPLOAD_RETENTION_DAYS` | Uploaded client documents are deleted after this many days. |
| `RAZORPAY_*` | Keys, webhook secret and plan IDs. Blank = invoice billing only. |
| `COMPANY_*` | Seller name, GSTIN, address and GST state code printed on tax invoices. |

## Deploy to production

A single small VM (2 vCPU / 4 GB) handles hundreds of firms. Use an Indian region (e.g. AWS `ap-south-1` Mumbai) for data-residency comfort.

```bash
git clone <repo> && cd <repo>/nyayadesk
cp .env.example .env        # fill it in
DOMAIN=app.yourdomain.in docker compose up -d --build
docker compose exec app node --disable-warning=ExperimentalWarning server/seed.js   # optional demo firm
```

Caddy obtains and renews HTTPS certificates automatically. Then:

1. In Razorpay, create the three plans (amounts in `.env.example`) and a webhook to `https://<domain>/api/billing/webhook`.
2. Schedule `deploy/backup.sh` nightly and copy backups off the server.
3. Point an uptime monitor at `/api/health`.
4. Set a monthly spend limit in the Anthropic Console.

To scale beyond one server, move the rate limiter to Redis and SQLite to PostgreSQL (the SQL is portable; tables are in `server/db.js`).

## Architecture

```
public/               Static marketing site + single-page app (no build step)
  index.html          Landing page, pricing, demo form
  app/                Web app (vanilla JS, hash router)
server/
  index.js            Express app, security headers, route mounting, maintenance jobs
  config.js           Environment configuration
  db.js               SQLite schema (firm_id on every tenant table)
  auth.js             scrypt passwords, hashed session tokens, role middleware
  ai/
    client.js         Claude streaming, legal-domain web search, pause_turn, refusal fallback
    prompts.js        System prompts (cache-stable) for research, drafting, review
    citations.js      Citation Guard
    demo.js           Offline demo responses
  data/               Templates, criminal-law mapping, limitation table, plans
  routes/             auth, research, drafts, documents, workspace (matters/tools/admin), billing
  lib/                SSE, rate limiting, usage metering, DOCX export, text extraction
test/                 node:test unit + API tests
launch/               Go-to-market system
deploy/               Caddyfile, backup script
```

### Security design

- Tenant isolation: every query on tenant data filters on `firm_id`; covered by an isolation test.
- Sessions: random 256-bit tokens, stored only as SHA-256 hashes; `HttpOnly`, `SameSite=Strict`, `Secure` in production; all sessions revoked on password change or deactivation.
- Passwords: scrypt with per-user salt; constant-time comparison; login rate limiting.
- Cross-origin state-changing requests rejected; strict Content-Security-Policy; no inline scripts.
- Uploads: type and magic-byte checks, size limits, per-firm directories with `0600` permissions, automatic deletion after the retention period.
- Razorpay webhooks verified with HMAC-SHA256 and constant-time comparison; idempotent invoicing.
- Audit log of sign-ins, exports, deletions, invites and billing events.

## Before you launch — verify

- The criminal-law mapping (`server/data/criminal-law-map.js`), the labour-law mapping (`server/data/labour.js`) and limitation table (`server/data/limitation.js`) cover the most-used provisions and were prepared carefully, but **have a practising advocate verify them against the bare acts** before launch.
- Fill all `[PLACEHOLDERS]` in `public/terms.html` and `public/privacy.html` and have them reviewed by counsel.
- Run a trademark search on the name.

See [`launch/README.md`](launch/README.md) for the full launch plan.
