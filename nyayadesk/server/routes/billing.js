// Subscriptions via Razorpay (UPI Autopay, cards, e-mandate) and GST invoices.
// Razorpay plans are created in the Razorpay dashboard with a per-seat amount
// that INCLUDES 18% GST; the subscription quantity is the seat count. Our
// invoice then splits that amount into taxable value and CGST/SGST or IGST.
import crypto from 'node:crypto';
import { Router } from 'express';
import { q, id, audit } from '../db.js';
import { config } from '../config.js';
import { requireAdmin } from '../auth.js';
import { GST_RATE, PLANS } from '../data/plans.js';
import { usageSummary } from '../lib/usage.js';
import { wrap } from '../lib/http.js';

export const billingRouter = Router();

const rupees = (paise) => `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const billingEnabled = () => Boolean(config.razorpayKeyId && config.razorpayKeySecret);

async function razorpay(method, pathname, body) {
  const res = await fetch(`https://api.razorpay.com/v1${pathname}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.description || `Razorpay error ${res.status}`);
  return json;
}

billingRouter.get('/', (req, res) => {
  const f = req.firm;
  res.json({
    enabled: billingEnabled(),
    keyId: config.razorpayKeyId || null,
    current: { plan: f.plan, seats: f.seats, status: f.status, trialEndsAt: f.trial_ends_at },
    usage: usageSummary(f),
    plans: Object.values(PLANS).filter((p) => p.id !== 'trial').map((p) => ({
      id: p.id, name: p.name, pricePerSeat: p.pricePerSeatPaise / 100, minSeats: p.minSeats, maxSeats: p.maxSeats, actionsPerSeat: p.actionsPerSeat, features: p.features, modelTier: p.modelTier,
    })),
    invoices: q.all('SELECT id, number, plan, seats, total_paise, created_at FROM invoices WHERE firm_id = ? ORDER BY created_at DESC', f.id),
  });
});

billingRouter.post('/subscribe', requireAdmin, wrap(async (req, res) => {
  const plan = PLANS[req.body.plan];
  if (!plan || plan.id === 'trial') return res.status(400).json({ error: 'Choose a plan.' });
  const seats = Math.floor(Number(req.body.seats) || plan.minSeats);
  if (seats < plan.minSeats || seats > plan.maxSeats) {
    return res.status(400).json({ error: `${plan.name} is for ${plan.minSeats}–${plan.maxSeats} seats.` });
  }
  if (!billingEnabled() || !config.razorpayPlanIds[plan.id]) {
    return res.status(503).json({ error: `Online payment is not set up yet. Email ${config.company.supportEmail} and we'll activate your plan by invoice.` });
  }
  const sub = await razorpay('POST', '/subscriptions', {
    plan_id: config.razorpayPlanIds[plan.id],
    total_count: 120, // monthly for up to 10 years; cancel any time
    quantity: seats,
    customer_notify: 1,
    notes: { firm_id: req.firm.id, plan: plan.id, seats: String(seats) },
  });
  q.run('UPDATE firms SET razorpay_subscription_id = ? WHERE id = ?', sub.id, req.firm.id);
  audit(req.firm.id, req.user.id, 'billing.checkout_started', `${plan.id} x${seats}`, req.ip);
  res.json({ subscriptionId: sub.id, keyId: config.razorpayKeyId, shortUrl: sub.short_url });
}));

billingRouter.post('/cancel', requireAdmin, wrap(async (req, res) => {
  if (!req.firm.razorpay_subscription_id) return res.status(400).json({ error: 'No active subscription.' });
  if (billingEnabled()) await razorpay('POST', `/subscriptions/${req.firm.razorpay_subscription_id}/cancel`, { cancel_at_cycle_end: 1 });
  audit(req.firm.id, req.user.id, 'billing.cancel_requested', null, req.ip);
  res.json({ ok: true, message: 'Your subscription will end at the close of the current billing cycle.' });
}));

// ── GST invoices ──────────────────────────────────────────────────────────
function financialYear(d = new Date()) {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${String(y).slice(2)}-${String(y + 1).slice(2)}`;
}

export function createInvoice(firm, plan, seats, grossPaise, paymentId, periodStart, periodEnd) {
  const taxable = Math.round(grossPaise / (1 + GST_RATE));
  const gst = grossPaise - taxable;
  const intraState = firm.billing_state && config.company.stateCode && firm.billing_state === config.company.stateCode;
  const cgst = intraState ? Math.floor(gst / 2) : 0;
  const sgst = intraState ? gst - cgst : 0;
  const igst = intraState ? 0 : gst;
  const fy = financialYear();
  const seq = q.get("SELECT COUNT(*) AS n FROM invoices WHERE number LIKE ?", `ND/${fy}/%`).n + 1;
  const number = `ND/${fy}/${String(seq).padStart(5, '0')}`;
  const iid = id('inv');
  q.run(`INSERT INTO invoices (id, firm_id, number, plan, seats, taxable_paise, cgst_paise, sgst_paise, igst_paise, total_paise, razorpay_payment_id, period_start, period_end)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    iid, firm.id, number, plan, seats, taxable, cgst, sgst, igst, grossPaise, paymentId || null, periodStart || null, periodEnd || null);
  return iid;
}

billingRouter.get('/invoices/:id', (req, res) => {
  const inv = q.get('SELECT * FROM invoices WHERE id = ? AND firm_id = ?', req.params.id, req.firm.id);
  if (!inv) return res.status(404).send('Not found');
  const f = req.firm;
  const c = config.company;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><title>Tax Invoice ${esc(inv.number)}</title>
<style>body{font:14px/1.5 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 16px;color:#111}table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f4f4f4}.r{text-align:right}h1{font-size:20px}@media print{.np{display:none}}</style></head><body>
<p class="np" style="color:#666">Press Ctrl+P (⌘P on Mac) to print or save as PDF.</p>
<h1>TAX INVOICE</h1>
<p><strong>${esc(c.name)}</strong><br>${esc(c.address)}<br>GSTIN: ${esc(c.gstin || 'Applied for')}</p>
<p><strong>Invoice no.:</strong> ${esc(inv.number)}<br><strong>Date:</strong> ${esc(inv.created_at.slice(0, 10))}<br><strong>Place of supply:</strong> ${esc(f.billing_state || '—')}</p>
<p><strong>Billed to:</strong> ${esc(f.name)}${f.city ? `, ${esc(f.city)}` : ''}<br>GSTIN: ${esc(f.gstin || 'Unregistered')}</p>
<table><tr><th>Description</th><th>SAC</th><th>Qty</th><th class="r">Taxable value</th></tr>
<tr><td>NyayaDesk ${esc(PLANS[inv.plan]?.name || inv.plan)} subscription${inv.period_start ? ` (${esc(inv.period_start)} to ${esc(inv.period_end)})` : ''}</td><td>998431</td><td>${inv.seats} seat(s)</td><td class="r">${rupees(inv.taxable_paise)}</td></tr>
${inv.cgst_paise ? `<tr><td colspan="3">CGST @ 9%</td><td class="r">${rupees(inv.cgst_paise)}</td></tr><tr><td colspan="3">SGST @ 9%</td><td class="r">${rupees(inv.sgst_paise)}</td></tr>` : `<tr><td colspan="3">IGST @ 18%</td><td class="r">${rupees(inv.igst_paise)}</td></tr>`}
<tr><th colspan="3">Total</th><th class="r">${rupees(inv.total_paise)}</th></tr></table>
<p>Payment reference: ${esc(inv.razorpay_payment_id || '—')}</p>
<p style="color:#666;font-size:12px">This is a computer-generated invoice. Questions: ${esc(c.supportEmail)}</p></body></html>`);
});

// ── Webhook (mounted with a raw body parser in index.js) ──────────────────
export function razorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  if (!config.razorpayWebhookSecret || !signature) return res.status(400).send('Webhook not configured');
  const expected = crypto.createHmac('sha256', config.razorpayWebhookSecret).update(req.body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).send('Bad signature');

  const event = JSON.parse(req.body.toString('utf8'));
  const sub = event.payload?.subscription?.entity;
  const payment = event.payload?.payment?.entity;
  const firmId = sub?.notes?.firm_id;
  const firm = firmId && q.get('SELECT * FROM firms WHERE id = ?', firmId);
  if (!firm) return res.json({ ok: true, ignored: true });

  const plan = PLANS[sub.notes.plan] ? sub.notes.plan : firm.plan;
  const seats = Number(sub.quantity) || Number(sub.notes.seats) || firm.seats;
  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged': {
      const start = sub.current_start ? new Date(sub.current_start * 1000) : new Date();
      const end = sub.current_end ? new Date(sub.current_end * 1000) : null;
      q.run(`UPDATE firms SET plan = ?, seats = ?, status = 'active', period_start = ?, razorpay_subscription_id = ?, razorpay_customer_id = COALESCE(?, razorpay_customer_id) WHERE id = ?`,
        plan, seats, start.toISOString().replace('T', ' ').slice(0, 19), sub.id, sub.customer_id || null, firm.id);
      if (event.event === 'subscription.charged' && payment?.amount) {
        const already = q.get('SELECT 1 FROM invoices WHERE razorpay_payment_id = ?', payment.id);
        if (!already) createInvoice({ ...firm }, plan, seats, payment.amount, payment.id, start.toISOString().slice(0, 10), end?.toISOString().slice(0, 10));
      }
      audit(firm.id, null, `billing.${event.event}`, `${plan} x${seats}`);
      break;
    }
    case 'subscription.pending':
    case 'subscription.halted':
      q.run("UPDATE firms SET status = 'past_due' WHERE id = ?", firm.id);
      audit(firm.id, null, `billing.${event.event}`);
      break;
    case 'subscription.cancelled':
    case 'subscription.completed':
      q.run("UPDATE firms SET status = 'cancelled' WHERE id = ?", firm.id);
      audit(firm.id, null, `billing.${event.event}`);
      break;
    default:
      break;
  }
  res.json({ ok: true });
}
