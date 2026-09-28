# 02 · Pricing, packaging and unit economics

## Price list (per seat per month, exclusive of 18% GST)

| Plan | Price | Seats | AI actions (pooled) | Who it's for |
|---|---|---|---|---|
| Free trial | ₹0 for 14 days | up to 5 | 40 per seat | Everyone — no card |
| Starter | ₹999 | 1 | 45 | Price-sensitive solo advocates: quick research, drafting, tools — on the standard model (Claude Sonnet 5); no memos or document review |
| Solo | ₹2,999 | 1 | 100 | Independent advocates |
| Chambers | ₹5,999 | 2–15 | 200 per seat | Litigation chambers and boutiques — **the core plan** |
| Firm | ₹9,999 | 10–500 | 350 per seat | Mid-size and large firms |
| Enterprise | Custom (from ₹15 lakh/year) | Any | Custom | SSO, dedicated deployment, custom retention, security review |

- **Annual prepay:** 2 months free (pay for 10). Push annual on every Chambers and Firm deal — it funds growth and cuts churn.
- **Founding-firm offer (launch only):** 30% off for 12 months for the first 50 paying firms, in exchange for a logo on the website, a case study and a monthly feedback call. Hard cap it; end it on a date.
- **Action weights** (set in `server/data/plans.js`): research answer 1 · research memo 3 · draft or revision 1 · document review 2 · legal tools free.

## Where the numbers come from

AI cost per action is the main cost of goods. Illustrative estimates at Claude Opus 5 list prices ($5 per million input tokens, $25 per million output tokens, web search $10 per 1,000 searches) and ₹88/USD. **Re-check against Anthropic's current price list and your own usage logs** (`usage_events` table records tokens per call) before you finalise pricing.

| Action | Input tokens | Output tokens (incl. thinking) | Searches | Est. cost | Actions charged | Cost / action |
|---|---|---|---|---|---|---|
| Quick research | ~25,000 | ~5,500 | ~3 | ~$0.29 ≈ ₹25 | 1 | ₹25 |
| Research memo | ~80,000 | ~12,000 | ~10 | ~$0.80 ≈ ₹70 | 3 | ₹23 |
| Draft | ~4,000 | ~9,000 | 0 | ~$0.25 ≈ ₹22 | 1 | ₹22 |
| Review (30-page PDF) | ~45,000 | ~7,000 | 0 | ~$0.40 ≈ ₹35 | 2 | ₹18 |

**Planning figure: ₹22 per action.**

### Starter plan (₹999) — standard model

Starter runs on `NYAYA_MODEL_STANDARD` (default Claude Sonnet 5, $2 / $10 per million tokens) and excludes memos and document review, the two most expensive features.

| Action on Sonnet 5 | Est. cost |
|---|---|
| Quick research (~25k in, ~5.5k out, ~3 searches) | ~$0.135 ≈ ₹12 |
| Draft (~4k in, ~9k out) | ~$0.10 ≈ ₹9 |

Planning figure **₹11 per action**. Worst case (all 45 actions used): ₹495 → ~50% gross margin. Expected (40% used): ~₹200 → ~80% before hosting and payment fees, ~65% after. Starter is an entry point: its job is to get advocates using the product and upgrade them to Solo when they want memos and document review. **Confirm Sonnet 5's quality is acceptable with the comparison tool (below) before you launch Starter.**

### Choosing models with evidence, not guesses

Run the comparison tool (`npm run compare`, documented in the project README) on the 30-item question set (extend it to 100 with your advisors). It produces a **blind** grading sheet — graders see answers labelled A/B/C, never model names or costs — and, once graded, a table of average score, "usable" rate, wrong-law flags and score per ₹10 for each model. A full three-model run over 30 items costs roughly ₹1,300. Re-run it whenever you change prompts or Anthropic releases a new model.

### Gross margin by plan

| Plan | Revenue / seat | Worst case (100% of allowance used) | Expected (40% used — typical for pooled SaaS allowances) | Expected gross margin |
|---|---|---|---|---|
| Starter (Sonnet 5) | ₹999 | ₹495 | ₹198 | ~80% |
| Solo | ₹2,999 | ₹2,200 | ₹880 | ~70% |
| Chambers | ₹5,999 | ₹4,400 | ₹1,760 | ~70% |
| Firm | ₹9,999 | ₹7,700 | ₹3,080 | ~69% |

Add ~₹150/seat/month for hosting, payments (Razorpay ~2% + GST on fees) and email.

### Levers if margins fall

1. **Prompt caching** is already on (the system prompts are byte-stable). Check `cache_read_tokens` in `usage_events` is non-zero.
2. **Effort tuning:** quick research runs at `high` effort, memos at `xhigh`. Test `medium` for quick answers on a sample of real questions before changing it.
3. **Model choice:** `NYAYA_MODEL` (premium plans) and `NYAYA_MODEL_STANDARD` (Starter) are environment variables. Run `npm run compare` on your question set before switching — never switch on price alone; quality is the product.
4. **Allowances:** raise the price or lower the allowance before you let margin slip — Indian firms accept "fair-use" limits if they are stated upfront.

## Price-anchoring script

> "A second-year associate in a good chambers costs ₹60,000–₹1,00,000 a month. For less than a tenth of that, every advocate in your office gets an associate who researches and drafts in minutes, at 11 pm, on a Sunday. If it saves each advocate two hours a week, it pays for itself many times over."

(Adjust the salary figures to the prospect's city and ask them what they pay — their number is more persuasive than yours.)

## Discount rules (so sales doesn't give away the business)

| Discount | Who can approve |
|---|---|
| Annual prepay (2 months free) | Standard — anyone |
| Founding-firm 30% × 12 months | Standard until the first 50 firms |
| Up to 15% more for 25+ seats or multi-year | Founder |
| Anything else, free extra months, or custom allowances | Founder, in writing, with a reason |

Never discount the monthly plan; discount in exchange for commitment (annual, more seats, case study).

## GST and invoicing notes

- SAC code **998431** (on-line information/database access and retrieval services) is used on invoices — **confirm the SAC and whether OIDAR rules apply with your chartered accountant**.
- Intra-state customers: CGST 9% + SGST 9%. Inter-state: IGST 18%. The app decides this from the firm's GST state code vs `COMPANY_STATE_CODE`.
- Razorpay plan amounts must **include** GST: Starter ₹1,178.82 · Solo ₹3,538.82 · Chambers ₹7,078.82 · Firm ₹11,798.82 per seat.
- Invoice numbers follow `ND/<FY>/<serial>` and restart each financial year (April–March).
