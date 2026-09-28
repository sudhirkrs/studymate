# 03 · Go-to-market: the 90-day launch plan

**Goal for day 90 (base case):** 18 paying firms · ₹3 lakh monthly recurring revenue (MRR) · 8 referenceable customers · trial-to-paid conversion ≥ 25%. **Stretch:** 35 firms · ₹6 lakh MRR (the "aggressive" scenario in `10-financial-model.md`).

The arithmetic: 18 firms × 4 seats × ₹5,999 × (1 − 30% founding discount) ≈ ₹3 lakh MRR. At 25% conversion that needs about 75 trials in the quarter — roughly 6 a week — which in turn needs 10–12 demos or self-serve sign-ups a week.

## Phase 0 — Before launch (weeks −4 to 0)

| # | Task | Owner | Done when |
|---|---|---|---|
| 1 | Company, GST, bank, Razorpay live (see `07-legal-compliance-and-company-setup.md`) | Founder | Test subscription paid and invoice generated |
| 2 | Production deployed in an Indian region (AWS Mumbai `ap-south-1` or similar), backups running, domain + HTTPS | Tech | `/api/health` green; restore from backup tested |
| 3 | **Quality benchmark:** 100 real questions across 10 practice areas, answered and graded by two practising advocates | Founder + 2 advisors | ≥ 85% rated "usable with light edits"; zero unflagged fake citations |
| 4 | 5 design-partner firms using it free for 4 weeks | Founder | Each has run ≥ 30 actions and given written feedback |
| 5 | Advisory panel: 2–3 respected senior advocates / retired judges as advisors (equity or honorarium) | Founder | Names and quotes approved for the website |
| 6 | Website live, demo-request form tested, calendar booking link | Founder | Test lead arrives |
| 7 | Demo firm seeded (`npm run seed`) with realistic matters | Sales | Demo runs end-to-end in 20 minutes |
| 8 | Sales collateral: one-pager PDF, 3 short demo videos (research, bail draft, contract review), security FAQ | Marketing | Files in shared drive |

## Phase 1 — Launch (weeks 1–4): founder-led sales in two cities

Pick two cities where you have the strongest network (e.g. Delhi NCR + Mumbai). Depth beats breadth.

- **Warm network first.** List 150 advocates you or your advisors know personally. Send the personal message in `05-outreach-templates.md`. Target: 40 demos from this list alone.
- **Bar association outreach.** Offer a free 45-minute CLE-style session, **"Using AI safely in practice: citations, confidentiality and the new criminal laws"**, at district and High Court bar associations. Teach, don't pitch; offer a trial code at the end.
- **Launch post** on LinkedIn by the founder + advisors (template in `05`), plus a 90-second demo video showing Citation Guard catching a fabricated citation.
- **Founding-firm offer** announced with a hard deadline and a counter ("31 of 50 left").

## Phase 2 — Repeatable pipeline (weeks 5–8)

- **Content engine (weekly):** one practical post each on (a) a recent Supreme Court judgment explained, (b) a BNS/BNSS change and what it means for drafting, (c) a limitation trap. Every post ends with the free tool (converter, limitation calculator) — tools are the top of the funnel.
- **Outbound:** 25 personalised messages a day to chambers of 3–25 advocates (LinkedIn + email). Sequence in `05`.
- **Law school alumni networks** (NLUs and established law colleges): talks for alumni associations; junior associates become internal champions.
- **Referral programme:** one free month for both firms for every referred firm that pays.
- **Webinar #1:** "Drafting under BNSS: 10 mistakes we see in bail applications" with an advisor.

## Phase 3 — Expand (weeks 9–12)

- Add two more cities (e.g. Bengaluru + Hyderabad or Chandigarh).
- Convert design partners and founding firms into **case studies** with hours-saved numbers.
- Start **mid-size firm pilots** (25–150 lawyers): 30-day paid pilot for one practice group, success criteria agreed upfront (see `04-sales-playbook.md`).
- Legal-tech and legal-industry conferences: speak rather than buy a booth.
- Begin in-house legal team outreach via general counsel communities.

## Channels ranked by expected return

| Channel | Cost | Speed | Why |
|---|---|---|---|
| Founder + advisor warm network | Low | Fast | Trust is the product in legal |
| Bar association sessions | Low | Medium | Reaches many advocates at once; positions you as the safe choice |
| Free tools (BNS converter, limitation calculator) | Low | Medium | Daily-use hook; SEO |
| LinkedIn content | Low | Medium | Where Indian lawyers read professional content |
| Referrals | Low | Compounds | Advocates trust peers |
| Paid search ("BNS section converter", "bail application format") | Medium | Fast | Test with ₹50k/month; keep only if CAC < 3 months of revenue |
| Conferences | High | Slow | For mid-size firms and in-house, later |

## Weekly operating rhythm

- **Monday:** pipeline review — every trial older than 7 days gets a call.
- **Wednesday:** content published; outbound batch.
- **Friday:** product review — top 10 bad answers of the week (from user feedback and spot checks) go into prompt/template fixes.
- **Monthly:** founding-firm feedback call; KPI review (see `09-launch-checklist-and-kpis.md`).
