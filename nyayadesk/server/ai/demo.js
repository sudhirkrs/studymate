// Demo mode: realistic canned output streamed word by word, used when no
// ANTHROPIC_API_KEY is configured (offline sales demos, CI, local dev).

const RESEARCH = `**Short answer**
A complaint for dishonour of cheque lies under s.138 of the Negotiable Instruments Act, 1881 only if the statutory sequence is followed: presentation within the cheque's validity (three months), a written demand notice within 30 days of receiving the bank's return memo, and failure to pay within 15 days of the drawer receiving that notice. The complaint must then be filed within one month of the cause of action arising (s.142(1)(b)), before the court where the payee's bank branch is situated (s.142(2), inserted by the 2015 amendment).

**Law**
- s.138 NI Act — offence; punishment up to two years or fine up to twice the cheque amount, or both.
- s.139 — presumption that the cheque was issued for discharge of a debt or liability (rebuttable).
- s.141 — liability of company officers who were in charge of and responsible for the conduct of business.
- s.142 — cognizance only on a written complaint by the payee; limitation; territorial jurisdiction.
- s.143A — interim compensation up to 20% of the cheque amount.

**Key authorities**
- *Dashrath Rupsingh Rathod v. State of Maharashtra*, (2014) 9 SCC 129 — territorial jurisdiction (legislatively overtaken by the 2015 amendment to s.142).
- *Rangappa v. Sri Mohan*, (2010) 11 SCC 441 — the s.139 presumption extends to the existence of a legally enforceable debt.

**Analysis**
On your facts the notice was sent on day 24 after receipt of the return memo, so it is within time. Compute the 15-day payment window from the date of *service* of notice (deemed service applies where the notice is returned "unclaimed"), and the one-month limitation from the day after that window expires.

**Next steps**
1. Collect the original cheque, return memo, notice, postal receipts and tracking report.
2. File the complaint with the pre-summoning affidavit of evidence.
3. Apply for interim compensation under s.143A at the first hearing.

_Demo mode: connect an Anthropic API key to get live answers researched from Indian primary sources._`;

const REVIEW = `**Summary**
Master services agreement between the client (service provider) and the customer for three years; fees payable monthly; governed by Indian law; disputes to arbitration seated in Mumbai.

| Clause | Issue | Risk | Recommended change |
|---|---|---|---|
| 9.2 | Uncapped indemnity for "any loss" | High | Cap at 12 months' fees; carve out only IP infringement and data breach |
| 11.1 | Customer may terminate for convenience on 7 days' notice | Medium | 60 days' notice and payment for work done |
| 14 | No data-protection clause | High | Add DPDP Act, 2023 processor obligations and breach notification |
| 18 | Arbitration clause names a seat but no institution | Low | Name MCIA or a sole arbitrator appointment process |

**Negotiation priorities**
1. Cap on liability. 2. Data protection. 3. Termination notice. 4. IP ownership of deliverables. 5. Payment terms and interest on delay.

_Demo mode: connect an Anthropic API key to review your actual document._`;

function demoDraft(o) {
  const user = o.messages?.[o.messages.length - 1]?.content;
  const brief = typeof user === 'string' ? user : '';
  const facts = brief.includes('Facts supplied by the advocate:') ? brief.split('Facts supplied by the advocate:')[1].split('\n\n')[0].trim() : brief.slice(0, 1200);
  return `IN THE COURT OF [COURT NAME]
AT [PLACE]

[CASE TYPE] NO. ______ OF [YEAR]

IN THE MATTER OF:

[PARTY 1 NAME]
[ADDRESS]                                                    ... PETITIONER / COMPLAINANT

VERSUS

[PARTY 2 NAME]
[ADDRESS]                                                    ... RESPONDENT / ACCUSED

This is a demonstration draft generated without a live AI connection. With an API key configured, NyayaDesk drafts the complete document from these instructions:

${facts}

PRAYER

It is therefore most respectfully prayed that this Hon'ble Court may be pleased to:
(a) [RELIEF 1];
(b) [RELIEF 2];
(c) pass such other order(s) as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case.

PLACE: [PLACE]
DATE: [DATE]
                                                             [ADVOCATE NAME]
                                                             Advocate for the Petitioner
                                                             Enrolment No. [ENROLMENT NO.]

VERIFICATION

Verified at [PLACE] on this [DATE] that the contents of paragraphs 1 to [N] are true to my knowledge and belief and nothing material has been concealed therefrom.

                                                             DEPONENT
---
DRAFTING NOTES:
- Demo mode is on: set ANTHROPIC_API_KEY to generate full drafts.
- Fill every bracketed placeholder before filing.`;
}

export async function demoStream(o, onEvent) {
  let text;
  if (o.kind === 'draft' || o.kind === 'redraft') text = demoDraft(o);
  else if (o.kind === 'review') text = REVIEW;
  else text = RESEARCH;

  const sources = [];
  if (o.webSearch) {
    onEvent({ type: 'status', message: 'Searching Indian legal sources…' });
    for (const s of [
      { url: 'https://www.indiacode.nic.in/', title: 'The Negotiable Instruments Act, 1881 — India Code' },
      { url: 'https://indiankanoon.org/search/?formInput=Dashrath%20Rupsingh%20Rathod', title: 'Dashrath Rupsingh Rathod v. State of Maharashtra, (2014) 9 SCC 129' },
    ]) {
      sources.push({ ...s, snippets: [s.title] });
      onEvent({ type: 'source', url: s.url, title: s.title });
    }
  }
  const words = text.split(/(\s+)/);
  const fast = process.env.NODE_ENV === 'test';
  for (let i = 0; i < words.length; i += 6) {
    onEvent({ type: 'text', text: words.slice(i, i + 6).join('') });
    if (!fast) await new Promise((r) => setTimeout(r, 12));
  }
  return { text, sources, usage: { input_tokens: 0, output_tokens: 0 }, stopReason: 'end_turn', demo: true, model: o.model || 'demo' };
}
