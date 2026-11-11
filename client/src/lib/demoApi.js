// Preview mode (VITE_DEMO=1): the whole site runs in the browser with no server.
// Content comes from the same content.js the API seeds MongoDB from; analytics
// events are kept in this browser's localStorage.
import { profile, projects, experience, certifications, skills, publications, achievements, extracurriculars, linkedinPosts } from '../../../server/src/data/content.js';

const KEY = 'portfolio-demo-events';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (ev) => { try { localStorage.setItem(KEY, JSON.stringify(ev.slice(-2000))); } catch { /* storage unavailable */ } };
const PAGES = new Set(['/', '/projects', '/skills', '/experience', '/analytics', '/contact', '/posts', ...projects.map((p) => `/projects/${p.slug}`)]);

const dayKey = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

export async function content() {
  return { profile, projects, experience, certifications, skills, publications, achievements, extracurriculars };
}

export async function event({ type, path, visitorId }) {
  const ev = load();
  const clean = type === 'pageview' ? (PAGES.has(path) ? path : '/404') : undefined;
  ev.push({ type, path: clean, visitorId, t: Date.now() });
  save(ev);
}

export async function stats() {
  const ev = load();
  const views = ev.filter((e) => e.type === 'pageview');
  const days = [];
  for (let i = 13; i >= 0; i--) days.push(dayKey(new Date(Date.now() - i * 86400000)));
  const byDay = Object.fromEntries(days.map((d) => [d, 0]));
  for (const e of views) { const k = dayKey(new Date(e.t)); if (k in byDay) byDay[k]++; }
  const pages = {};
  for (const e of views) pages[e.path] = (pages[e.path] || 0) + 1;
  return {
    totalViews: views.length,
    uniqueVisitors: new Set(views.map((e) => e.visitorId)).size,
    daily: days.map((date) => ({ date, views: byDay[date] })),
    pages: Object.entries(pages).map(([p, count]) => ({ path: p, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    queriesRun: ev.filter((e) => e.type === 'query').length,
  };
}

export async function posts() {
  return linkedinPosts.map((urn) => {
    const id = urn.split(':').pop();
    return { urn, url: `https://www.linkedin.com/feed/update/${urn}/`, embed: `https://www.linkedin.com/embed/feed/update/${urn}`, postedAt: new Date(Number(BigInt(id) >> 22n)).toISOString() };
  }).sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
}

export async function contact() {
  const err = new Error(`This is a preview, so messages can't be sent from here. Email ${profile.email} instead.`);
  throw err;
}
