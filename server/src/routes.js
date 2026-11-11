import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { parsePost } from './linkedin.js';
import { profile, projects, publications, achievements, extracurriculars } from './data/content.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Only real pages are counted; anything else is logged as a 404 so the stats can't be filled with junk URLs.
const PAGES = new Set(['/', '/projects', '/skills', '/experience', '/analytics', '/contact', '/posts', ...projects.map((p) => `/projects/${p.slug}`)]);

export function apiRouter(store) {
  const r = Router();

  const contactLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many messages from this network. Try again in 15 minutes.' } });
  const eventLimit = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });

  r.get('/health', (_req, res) => res.json({ ok: true, store: store.kind, time: new Date().toISOString() }));

  r.get('/profile', (_req, res) => res.json(profile));

  r.get('/content', async (_req, res, next) => {
    try {
      res.set('Cache-Control', 'public, max-age=60');
      res.json({ profile, publications, achievements, extracurriculars, ...(await store.getContent()) });
    } catch (e) { next(e); }
  });

  for (const key of ['projects', 'experience', 'certifications', 'skills']) {
    r.get(`/${key}`, async (_req, res, next) => {
      try { res.json((await store.getContent())[key]); } catch (e) { next(e); }
    });
  }

  r.post('/contact', contactLimit, async (req, res, next) => {
    try {
      const { name = '', email = '', message = '', website = '' } = req.body || {};
      if (website) return res.status(201).json({ ok: true }); // honeypot: bots fill hidden fields
      const errors = {};
      if (!name.trim() || name.length > 100) errors.name = 'Enter your name (up to 100 characters).';
      if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'Enter a valid email so I can reply.';
      if (message.trim().length < 10 || message.length > 4000) errors.message = 'Write at least 10 characters (up to 4,000).';
      if (Object.keys(errors).length) return res.status(400).json({ error: 'Check the highlighted fields.', fields: errors });
      await store.addMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      res.status(201).json({ ok: true });
    } catch (e) { next(e); }
  });

  r.post('/events', eventLimit, async (req, res, next) => {
    try {
      const { type, path: p, visitorId, referrer } = req.body || {};
      if (!['pageview', 'query'].includes(type)) return res.status(400).json({ error: 'Unknown event type.' });
      let path;
      if (type === 'pageview') {
        const clean = String(p || '/').toLowerCase().replace(/\/+$/, '') || '/';
        path = PAGES.has(clean) ? clean : '/404';
      }
      let ref;
      try { ref = referrer ? new URL(referrer).hostname : undefined; } catch { ref = undefined; }
      await store.addEvent({ type, path, visitorId: String(visitorId || '').slice(0, 64), referrer: ref });
      res.status(204).end();
    } catch (e) { next(e); }
  });

  r.get('/stats', async (_req, res, next) => {
    try {
      res.set('Cache-Control', 'no-store');
      res.json(await store.stats(14));
    } catch (e) { next(e); }
  });

  r.get('/posts', async (_req, res, next) => {
    try {
      res.set('Cache-Control', 'public, max-age=60');
      res.json(await store.listPosts());
    } catch (e) { next(e); }
  });

  // Admin: add or remove LinkedIn posts. Header `Authorization: Bearer <ADMIN_TOKEN>`.
  const isAdmin = (req) => process.env.ADMIN_TOKEN && req.get('authorization') === `Bearer ${process.env.ADMIN_TOKEN}`;

  r.post('/admin/posts', async (req, res, next) => {
    try {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Wrong or missing admin token.' });
      const post = parsePost(req.body?.url);
      if (!post) return res.status(400).json({ error: 'That doesn’t look like a LinkedIn post link. Copy the link from the post’s “…” menu → Copy link to post.' });
      await store.addPost(post);
      res.status(201).json(post);
    } catch (e) { next(e); }
  });

  r.delete('/admin/posts/:urn', async (req, res, next) => {
    try {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Wrong or missing admin token.' });
      const ok = await store.removePost(req.params.urn);
      res.status(ok ? 204 : 404).end();
    } catch (e) { next(e); }
  });

  // Read your contact messages: GET /api/admin/messages with header `Authorization: Bearer <ADMIN_TOKEN>`
  r.get('/admin/messages', async (req, res, next) => {
    try {
      const token = process.env.ADMIN_TOKEN;
      if (!token || req.get('authorization') !== `Bearer ${token}`) return res.status(401).json({ error: 'Unauthorized' });
      res.json(await store.listMessages());
    } catch (e) { next(e); }
  });

  r.use((_req, res) => res.status(404).json({ error: 'No such endpoint.' }));
  return r;
}
