import path from 'node:path';
import express from 'express';
import { config } from './config.js';
import { openDb, q } from './db.js';
import { loadSession, requireAuth, purgeExpiredSessions } from './auth.js';
import { rateLimit, securityHeaders, str } from './lib/http.js';
import { authRouter } from './routes/auth.js';
import { researchRouter } from './routes/research.js';
import { draftsRouter } from './routes/drafts.js';
import { documentsRouter, purgeOldUploads } from './routes/documents.js';
import { adminRouter, mattersRouter, toolsRouter } from './routes/workspace.js';
import { billingRouter, razorpayWebhook } from './routes/billing.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(securityHeaders);

  // Razorpay signs the raw body, so this route must see it before JSON parsing.
  app.post('/api/billing/webhook', express.raw({ type: 'application/json', limit: '1mb' }), razorpayWebhook);

  app.use(express.json({ limit: '2mb' }));
  app.use(loadSession);

  // Reject cross-site state-changing requests (defence in depth on top of SameSite=strict).
  app.use('/api', (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Cross-origin request blocked.' });
    next();
  });

  app.get('/api/health', (_req, res) => res.json({ ok: true, demoMode: config.demoMode, model: config.model }));

  // Public: demo-request form on the marketing site.
  app.post('/api/leads', rateLimit({ windowMs: 60 * 60e3, max: 10, key: (r) => `lead:${r.ip}` }), (req, res) => {
    const name = str(req.body.name, 120);
    const email = str(req.body.email, 200);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please give your name and a valid email.' });
    q.run('INSERT INTO leads (name, email, phone, firm, city, size, practice, message, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      name, email, str(req.body.phone, 30), str(req.body.firm, 200), str(req.body.city, 100), str(req.body.size, 40),
      str(req.body.practice, 200), str(req.body.message, 4000), str(req.body.source, 100) || 'website');
    res.status(201).json({ ok: true });
  });

  app.use('/api/auth', authRouter);

  const aiLimiter = rateLimit({ windowMs: 60e3, max: 12 });
  app.use('/api/research', requireAuth, aiLimiter, researchRouter);
  app.use('/api/drafts', requireAuth, aiLimiter, draftsRouter);
  app.use('/api/documents', requireAuth, aiLimiter, documentsRouter);
  app.use('/api/matters', requireAuth, mattersRouter);
  app.use('/api/tools', requireAuth, toolsRouter);
  app.use('/api/admin', requireAuth, adminRouter);
  app.use('/api/billing', requireAuth, billingRouter);

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  const pub = path.join(config.root, 'public');
  app.use(express.static(pub, { extensions: ['html'], maxAge: config.env === 'production' ? '1h' : 0 }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: `Files must be under ${config.uploadMaxMb} MB.` });
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed request.' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  });
  return app;
}

export function startMaintenance() {
  const run = () => {
    try {
      purgeExpiredSessions();
      const n = purgeOldUploads();
      if (n) console.log(`retention: removed ${n} expired upload(s)`);
    } catch (e) {
      console.error('maintenance failed', e);
    }
  };
  run();
  return setInterval(run, 6 * 3600e3).unref();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  openDb();
  startMaintenance();
  createApp().listen(config.port, () => {
    console.log(`NyayaDesk listening on ${config.publicUrl} (port ${config.port})`);
    if (config.demoMode) console.log('Demo mode: set ANTHROPIC_API_KEY for live AI responses.');
  });
}
