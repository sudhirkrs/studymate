// Metering: every AI call records tokens and "actions" against the firm, and
// quota checks run before a call is made.
import { q } from '../db.js';
import { PLANS, planQuota } from '../data/plans.js';

export function periodStart(firm) {
  // Billing periods roll monthly from the firm's period_start anniversary.
  const start = new Date(firm.period_start);
  const now = new Date();
  const d = new Date(start);
  while (true) {
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);
    if (next > now) break;
    d.setTime(next.getTime());
  }
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

export function usageSummary(firm) {
  const since = periodStart(firm);
  const row = q.get(
    `SELECT COALESCE(SUM(actions),0) AS actions, COALESCE(SUM(input_tokens),0) AS input_tokens,
            COALESCE(SUM(output_tokens),0) AS output_tokens, COALESCE(SUM(cache_read_tokens),0) AS cache_read_tokens,
            COALESCE(SUM(web_searches),0) AS web_searches, COUNT(*) AS calls
       FROM usage_events WHERE firm_id = ? AND created_at >= ?`, firm.id, since);
  const quota = planQuota(firm.plan, firm.seats);
  return { ...row, quota, remaining: Math.max(0, quota - row.actions), periodStart: since };
}

export function checkAccess(firm, cost) {
  if (firm.status === 'cancelled') return 'Your subscription has been cancelled. Please renew from Settings → Billing.';
  if (firm.status === 'past_due') return 'Your last payment failed. Please update payment from Settings → Billing.';
  if (firm.plan === 'trial' && firm.trial_ends_at && new Date(firm.trial_ends_at) < new Date()) {
    return 'Your 14-day trial has ended. Choose a plan in Settings → Billing to continue.';
  }
  const { remaining } = usageSummary(firm);
  if (remaining < cost) {
    return `Your firm has used this month's ${PLANS[firm.plan]?.name || ''} allowance. Add seats or upgrade in Settings → Billing.`;
  }
  return null;
}

export function recordUsage(firmId, userId, kind, actions, usage = {}) {
  q.run(
    `INSERT INTO usage_events (firm_id, user_id, kind, actions, input_tokens, output_tokens, cache_read_tokens, web_searches)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    firmId, userId, kind, actions,
    usage.input_tokens || 0, usage.output_tokens || 0, usage.cache_read_input_tokens || 0,
    usage.server_tool_use?.web_search_requests || 0,
  );
}
