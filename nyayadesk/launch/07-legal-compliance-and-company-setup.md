# 07 · Company setup, legal and compliance

> This is an operational checklist, not legal advice. Have a corporate lawyer and a chartered accountant review each item for your facts.

## A. Company and tax

- [ ] **Incorporate a private limited company** (MCA SPICe+). Needed for enterprise customers, investment and Razorpay limits.
- [ ] **PAN, TAN, bank current account.**
- [ ] **GST registration** — mandatory once turnover crosses the threshold for services (₹20 lakh in most states), but register voluntarily from day one: law-firm customers want a GSTIN on the invoice to claim input tax credit. Confirm the SAC code (the app uses 998431) and place-of-supply rules with your CA.
- [ ] **Startup India (DPIIT) recognition** — eligibility for tax and compliance benefits.
- [ ] **Udyam (MSME) registration** — helps with delayed-payment protection under the MSMED Act.
- [ ] **Professional tax and Shops & Establishments registration** in your state once you hire.
- [ ] **TDS:** customers may deduct TDS (e.g. under s.194J for technical services) — issue a Form 16A reconciliation process; your pricing is before TDS.

## B. Brand and IP

- [ ] **Trademark search and filing** for "NyayaDesk" (word and logo) in Class 9 (software), Class 42 (SaaS) and Class 45 (legal services — defensive). Run a clearance search first; if the name is taken, rebrand before launch — change `COMPANY_NAME`, the logo and the site copy.
- [ ] Domain names (.in and .com), social handles.
- [ ] IP assignment and confidentiality agreements with every founder, employee and contractor.

## C. Payments

- [ ] **Razorpay account** (KYC with company documents). Enable Subscriptions, UPI Autopay and e-mandates.
- [ ] Create plans (monthly, per unit) with GST-inclusive amounts: Starter ₹1,178.82 · Solo ₹3,538.82 · Chambers ₹7,078.82 · Firm ₹11,798.82. Put the plan IDs in `.env`.
- [ ] Add webhook `https://<your-domain>/api/billing/webhook` for events: `subscription.activated`, `subscription.charged`, `subscription.pending`, `subscription.halted`, `subscription.cancelled`, `subscription.completed`. Put the secret in `RAZORPAY_WEBHOOK_SECRET`.
- [ ] Run one live ₹1 test subscription end-to-end (plan activates, invoice appears).
- [ ] RBI e-mandate rules: recurring debits above the applicable limit need additional factor authentication — Razorpay handles this; make sure customers expect the mandate approval step.

## D. Data protection — Digital Personal Data Protection Act, 2023 (DPDP Act)

NyayaDesk is a **Data Fiduciary** for account data and a **Data Processor** for the firm's client data. Check which DPDP Rules provisions are in force on your launch date and adjust.

- [ ] Privacy policy published (`public/privacy.html` — fill in the placeholders).
- [ ] **Data Processing Agreement (DPA)** template for customers — see template outline below.
- [ ] Record of processing and sub-processor list (hosting, Anthropic, Razorpay, email provider). Notify customers before adding sub-processors.
- [ ] Cross-border transfer: AI processing may occur outside India; confirm no restricted-country issue under s.16 and disclose it. Offer Enterprise a regional deployment option.
- [ ] Retention: uploads auto-delete (`UPLOAD_RETENTION_DAYS`), account data deleted within 30 days of closure; export available (Settings → Security & data).
- [ ] Breach response plan: who decides, how customers and the Data Protection Board are notified, within what time (per the DPDP Rules), and a log of incidents.
- [ ] **Grievance officer** named on the website with email and address.
- [ ] Reasonable security safeguards: TLS, hashed passwords, least-privilege production access, audit logs, backups encrypted at rest, annual third-party penetration test once revenue allows.

### DPA outline (customer ↔ NyayaDesk)
1. Roles and scope (customer = Data Fiduciary; NyayaDesk = Data Processor).
2. Processing only on documented instructions; no training of AI models on customer data.
3. Confidentiality of personnel.
4. Security measures (annex).
5. Sub-processors: current list, notice of changes, objection right.
6. Assistance with data principal requests and breach notifications.
7. Breach notification to the customer without undue delay.
8. Deletion or return at end of contract.
9. Audit and information rights (questionnaire first; on-site only for Enterprise).
10. Cross-border transfer terms.

## E. Professional-regulation hygiene (Bar Council of India)

NyayaDesk is a software vendor, not a law firm — keep it that way:

- Do not provide legal advice to the public or let non-advocates use the product as a substitute for an advocate. Terms of Service restrict use to legal professionals and supervised staff.
- Do not run any "find a lawyer" or referral feature — advocates are prohibited from soliciting work and paying for referrals (BCI Rules, Part VI, Chapter II, including Rule 36 on advertising and solicitation), and customers will avoid a tool that exposes them.
- Marketing speaks to firms as software buyers; never use customer advocates' names or photos in ads without written consent, and never describe customers' case results.
- Encourage customers to adopt an internal AI-use policy (template below).

### AI-use policy template for customer firms (give this away — it builds trust)
1. Approved tool: NyayaDesk. No client data in unapproved AI tools.
2. Every authority is read in the original before it is cited; "Check" flags are resolved or removed.
3. Every draft is reviewed by the responsible advocate before filing or sending.
4. Upload only what the task needs; anonymise where practical.
5. The responsible advocate remains accountable for all work product.
6. Report errors to the knowledge/IT lead so templates can be improved.

## F. Contracts to have ready

- Terms of Service (`public/terms.html` — fill placeholders; counsel review).
- Privacy Policy.
- DPA.
- Enterprise order form + master subscription agreement.
- Pilot agreement (30-day paid pilot, success criteria, credit toward annual).
- Advisor agreement (equity vesting or honorarium, confidentiality).
- Employee/contractor IP assignment + NDA.

## G. AI provider terms

- Use the Anthropic commercial API under its commercial terms (API inputs and outputs are not used for model training by default under those terms — confirm the current terms and data-retention settings for your account, and state your retention posture accurately in your privacy policy).
- Keep a copy of the provider's usage policies and ensure the product's use complies.
