// Central configuration. Every value can be overridden from the environment;
// see .env.example for the full list and what each one does.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;

const int = (v, d) => (v === undefined || v === '' ? d : Number.parseInt(v, 10));

export const config = {
  root,
  port: int(env.PORT, 8080),
  env: env.NODE_ENV || 'development',
  publicUrl: env.PUBLIC_URL || 'http://localhost:8080',
  dataDir: path.resolve(root, env.DATA_DIR || 'data'),

  // AI
  anthropicKey: env.ANTHROPIC_API_KEY || '',
  model: env.NYAYA_MODEL || 'claude-opus-5',
  // Server-side refusal fallback (routes a declined request to Anthropic's
  // recommended substitute model). Set NYAYA_FALLBACKS=off to disable.
  fallbacks: (env.NYAYA_FALLBACKS || 'default') !== 'off',
  // Without an API key the product runs in demo mode with canned answers,
  // so sales demos and CI work offline.
  get demoMode() {
    return !this.anthropicKey || env.NYAYA_DEMO === '1';
  },

  // Security
  sessionDays: int(env.SESSION_DAYS, 14),
  cookieSecure: (env.COOKIE_SECURE || (env.NODE_ENV === 'production' ? '1' : '0')) === '1',
  uploadMaxMb: int(env.UPLOAD_MAX_MB, 25),
  // Uploaded client documents are deleted after this many days (DPDP storage limitation).
  uploadRetentionDays: int(env.UPLOAD_RETENTION_DAYS, 30),

  // Billing (Razorpay). Leave blank to run without payments.
  razorpayKeyId: env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: env.RAZORPAY_WEBHOOK_SECRET || '',
  razorpayPlanIds: {
    solo: env.RAZORPAY_PLAN_SOLO || '',
    chambers: env.RAZORPAY_PLAN_CHAMBERS || '',
    firm: env.RAZORPAY_PLAN_FIRM || '',
  },

  // Seller details printed on GST invoices
  company: {
    name: env.COMPANY_NAME || 'NyayaDesk Technologies Pvt. Ltd.',
    gstin: env.COMPANY_GSTIN || '',
    address: env.COMPANY_ADDRESS || '',
    stateCode: env.COMPANY_STATE_CODE || '',
    supportEmail: env.SUPPORT_EMAIL || 'support@nyayadesk.in',
  },
};
