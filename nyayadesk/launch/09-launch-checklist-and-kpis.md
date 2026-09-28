# 09 · Launch checklist and KPIs

## Go / no-go checklist

### Product and quality
- [ ] `npm test` green in CI.
- [ ] Live mode verified: `ANTHROPIC_API_KEY` set; `/api/health` shows `"demoMode": false`.
- [ ] 100-question quality benchmark passed (≥ 85% usable; zero unflagged fabricated citations) using `npm run compare` and blind grading by two advocates — for both the premium model and the Starter model. Keep the question set (`eval/questions.json`) and re-run it before every prompt or model change.
- [ ] Each of the 37 drafting templates generated once and reviewed by a practising advocate in that area (labour templates by a labour-law practitioner).
- [ ] Criminal-law converter, labour-law mapping and limitation table spot-checked against the bare acts, the Labour Codes and notified rules by advocates in each area (`server/data/criminal-law-map.js`, `server/data/labour.js`, `server/data/limitation.js`).
- [ ] Labour Codes commencement status and central/State rules re-confirmed on the launch date.
- [ ] Word export opened in MS Word and LibreOffice; formatting acceptable for filing.
- [ ] Mobile check: research and tools usable on a phone.

### Infrastructure and security
- [ ] Deployed behind HTTPS (Caddy in `docker-compose.yml` or a managed load balancer); `COOKIE_SECURE=1`.
- [ ] Hosted in an Indian region; backups nightly (`deploy/backup.sh`) and a restore tested.
- [ ] Uptime monitor on `/api/health` with SMS/WhatsApp alerts.
- [ ] Error logging (stdout collected by your host) and a weekly review of 5xx errors.
- [ ] Anthropic API spend limit and alerts configured in the Anthropic Console.
- [ ] Production access limited to named people; SSH keys only; secrets only in `.env`.
- [ ] Dependency audit (`npm audit`) clean.

### Commercial
- [ ] Company, GST, bank, Razorpay live; ₹1 end-to-end subscription test passed.
- [ ] Terms, Privacy Policy and DPA filled in and reviewed by counsel.
- [ ] Grievance officer published.
- [ ] Demo firm seeded; recorded backup demo.
- [ ] CRM pipeline stages set up; calendar booking link on the website.
- [ ] Launch posts scheduled; advisors briefed.

## North-star and KPIs

**North-star metric:** *weekly active advocates* (advocates who ran at least one AI action in the last 7 days). It captures adoption inside firms, which drives both conversion and renewal.

| Area | KPI | Target (by day 90) | Where to get it |
|---|---|---|---|
| Acquisition | Demos booked / week | 10–12 | CRM |
| Acquisition | Website → trial conversion | ≥ 4% | Analytics + `firms` table |
| Activation | Trials with ≥ 10 actions in week 1 | ≥ 60% | `usage_events` |
| Conversion | Trial → paid | ≥ 25% | `firms.status` |
| Revenue | MRR | ₹3 lakh (stretch ₹6 lakh) | Razorpay |
| Revenue | Average seats per firm | ≥ 4 | `firms.seats` |
| Retention | Logo churn (monthly) | ≤ 3% | Razorpay cancellations |
| Retention | Net revenue retention | ≥ 105% | Razorpay |
| Engagement | Weekly active advocates / paid seats | ≥ 60% | `usage_events` |
| Quality | "Check" citations per 100 answers | Falling month on month | `research.citations_json` |
| Unit economics | AI cost per action | ≤ ₹22 | `usage_events` tokens × price |
| Unit economics | Gross margin | ≥ 65% | Finance |
| Sales efficiency | CAC payback | ≤ 4 months | Finance |

### Useful SQL (run against the production database)

```sql
-- Weekly active advocates
SELECT COUNT(DISTINCT user_id) FROM usage_events WHERE created_at >= datetime('now', '-7 days');

-- Trials that activated in their first week
SELECT f.name, SUM(e.actions) AS week1_actions
FROM firms f LEFT JOIN usage_events e ON e.firm_id = f.id AND e.created_at <= datetime(f.created_at, '+7 days')
WHERE f.plan = 'trial' GROUP BY f.id ORDER BY week1_actions DESC;

-- AI tokens this month (multiply by current per-token prices)
SELECT SUM(input_tokens), SUM(output_tokens), SUM(cache_read_tokens), SUM(web_searches)
FROM usage_events WHERE created_at >= date('now', 'start of month');

-- New demo requests
SELECT created_at, name, firm, city, size, practice, email, phone FROM leads ORDER BY id DESC LIMIT 50;
```
