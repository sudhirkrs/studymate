# 02 · Pricing, packaging and unit economics

## Price list (per seat per month, exclusive of 18% GST)

| Plan | Price | Seats | AI actions (pooled) | Who it's for |
|---|---|---|---|---|
| Free trial | ₹0 for 14 days | up to 5 | 40 per seat | Everyone — no card |
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

### Gross margin by plan

| Plan | Revenue / seat | Worst case (100% of allowance used) | Expected (40% used — typical for pooled SaaS allowances) | Expected gross margin |
|---|---|---|---|---|
| Solo | ₹2,999 | ₹2,200 | ₹880 | ~70% |
| Chambers | ₹5,999 | ₹4,400 | ₹1,760 | ~70% |
| Firm | ₹9,999 | ₹7,700 | ₹3,080 | ~69% |

Add ~₹150/seat/month for hosting, payments (Razorpay ~2% + GST on fees) and email.

### Levers if margins fall

1. **Prompt caching** is already on (the system prompts are byte-stable). Check `cache_read_tokens` in `usage_events` is non-zero.
2. **Effort tuning:** quick research runs at `high` effort, memos at `xhigh`. Test `medium` for quick answers on a sample of real questions before changing it.
3. **Model choice:** `NYAYA_MODEL` is an environment variable. Evaluate newer or lower-priced Claude models on your own question set before switching — never switch on price alone; quality is the product.
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
- Razorpay plan amounts must **include** GST: Solo ₹3,538.82 · Chambers ₹7,078.82 · Firm ₹11,798.82 per seat.
- Invoice numbers follow `ND/<FY>/<serial>` and restart each financial year (April–March).
