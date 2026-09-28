# 10 · Year-one financial model

Full month-by-month numbers for all three scenarios are in [`financial-model.csv`](financial-model.csv) (opens in Excel or Google Sheets). The model is deliberately simple so you can change one assumption and see the effect.

## Assumptions

| Assumption | Value | Why |
|---|---|---|
| Average seats per paying firm | 4 | Core ICP is chambers of 3–25 advocates |
| List price per seat | ₹5,999 / month (Chambers) | Core plan |
| Founding-firm discount | 30% for 12 months, first 50 firms | Launch offer |
| Monthly logo churn | 3% | Typical for SMB SaaS in year one |
| AI + hosting cost (COGS) | 30% of revenue + ₹150 per seat | See `02-pricing-and-unit-economics.md` |
| Team & operations | ₹3.5 L/month (months 1–3) → ₹4.5 L → ₹6 L → ₹7.5 L (months 10–12) | Founders + 1 engineer + 1 sales, growing to ~6 people |
| Marketing | ₹0.75 L/month → ₹2.25 L/month | Content, events, paid-search tests |
| New paying firms per month | Conservative 2→13 · Base 4→26 · Aggressive 6→54 | Founder-led sales ramping to a small sales team |

Revenue is shown before GST (GST collected is passed to the government). Annual prepayments would improve cash flow beyond what is shown.

## Summary

| Scenario | Paying firms at month 12 | Exit MRR | Exit ARR | First profitable month | Lowest cash point (funding needed) |
|---|---|---|---|---|---|
| Conservative | 80 | ₹16.3 L | ₹1.95 Cr | 12 | ₹34.1 L |
| **Base** | **160** | **₹35.7 L** | **₹4.28 Cr** | **6** | **₹13.5 L** |
| Aggressive | 337 | ₹78.1 L | ₹9.38 Cr | 4 | ₹6.2 L |

## Base case, month by month

| Month | New firms | Paying firms | Seats | MRR | Net profit / (burn) | Cumulative cash |
|---|---|---|---|---|---|---|
| 1 | 4 | 4 | 16 | ₹0.7 L | −₹3.8 L | −₹3.8 L |
| 2 | 6 | 10 | 40 | ₹1.7 L | −₹3.1 L | −₹7.0 L |
| 3 | 8 | 18 | 70 | ₹3.0 L | −₹2.3 L | −₹9.2 L |
| 4 | 10 | 27 | 108 | ₹4.5 L | −₹2.7 L | −₹12.0 L |
| 5 | 12 | 38 | 153 | ₹6.4 L | −₹1.5 L | −₹13.5 L |
| 6 | 14 | 51 | 204 | ₹8.9 L | ₹0.2 L | −₹13.3 L |
| 7 | 16 | 66 | 262 | ₹12.4 L | ₹0.6 L | −₹12.7 L |
| 8 | 18 | 82 | 326 | ₹16.4 L | ₹3.2 L | −₹9.5 L |
| 9 | 20 | 99 | 397 | ₹20.7 L | ₹6.1 L | −₹3.4 L |
| 10 | 22 | 118 | 473 | ₹25.4 L | ₹7.3 L | ₹3.9 L |
| 11 | 24 | 139 | 555 | ₹30.4 L | ₹10.7 L | ₹14.6 L |
| 12 | 26 | 160 | 642 | ₹35.7 L | ₹14.3 L | ₹28.9 L |

MRR jumps from month 7 onwards because new firms after the first 50 pay full price.

## What this means

- **Funding need:** plan for **₹20–35 lakh** of runway (founder capital, angels, or a pre-seed round) to survive the conservative case with a buffer. The base case needs about ₹13.5 lakh.
- **The two numbers that matter most:** new firms per month (sales capacity) and seats per firm (land-and-expand). One extra seat per firm moves year-end MRR by roughly 25%.
- **The biggest risk to margin** is heavy usage at full allowance. Watch AI cost per action weekly (`09-launch-checklist-and-kpis.md`) and use the levers in `02`.
- **Annual prepay** at 10 months' price turns a year of revenue into cash on day one — push it hard on every Chambers and Firm deal.
