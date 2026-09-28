# NyayaDesk launch system

Everything needed to take NyayaDesk from code to paying law firms. Work through the files in order.

| # | File | Use it to |
|---|---|---|
| 01 | [Positioning, ICP and competition](01-positioning-and-icp.md) | Decide who to sell to and what to say |
| 02 | [Pricing and unit economics](02-pricing-and-unit-economics.md) | Set prices, protect margin, handle discounts and GST |
| 03 | [90-day go-to-market plan](03-go-to-market-90-day-plan.md) | Run launch week by week |
| 04 | [Sales playbook](04-sales-playbook.md) | Discovery, demo script, objections, pilots, proposals |
| 05 | [Outreach templates](05-outreach-templates.md) | Emails, LinkedIn, WhatsApp, launch post, referrals |
| 06 | [Pitch deck](06-pitch-deck.md) | Build the 12-slide customer deck |
| 07 | [Company setup, legal and compliance](07-legal-compliance-and-company-setup.md) | Incorporation, GST, Razorpay, DPDP Act, Bar Council hygiene, contracts |
| 08 | [Customer onboarding and success](08-customer-onboarding-and-success.md) | Activate trials, prevent churn, expand accounts |
| 09 | [Launch checklist and KPIs](09-launch-checklist-and-kpis.md) | Go/no-go list and the metrics to track (with SQL) |
| 10 | [Year-one financial model](10-financial-model.md) · [CSV](financial-model.csv) | Plan runway and targets |

## Launch in one page

1. **Weeks −4 to 0:** incorporate, GST, Razorpay; deploy to an Indian region; run the 100-question quality benchmark with two practising advocates; sign up 5 design-partner firms and 2–3 advisors.
2. **Weeks 1–4:** founder-led sales in two cities through warm networks and bar association sessions; founding-firm offer (30% off, first 50 firms).
3. **Weeks 5–8:** weekly content, 25 outbound messages a day, referral programme, first webinar.
4. **Weeks 9–12:** two more cities, case studies, paid pilots with mid-size firms.
5. **Day-90 base target:** 18 paying firms, ₹3 lakh MRR, trial-to-paid ≥ 25%.

## Things only you can decide or do

- Confirm the **brand name** after a trademark search (the code uses "NyayaDesk" throughout).
- Fill every `[PLACEHOLDER]` in `public/terms.html` and `public/privacy.html` and have counsel review them.
- Have a practising advocate verify the criminal-law mapping and limitation tables before launch.
- Check current Anthropic API prices and your INR exchange rate, then re-run the unit economics.
