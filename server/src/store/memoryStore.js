import { projects, experience, certifications, skills, linkedinPosts } from '../data/content.js';
import { parsePost } from '../linkedin.js';
import { dayKey, lastNDays } from './time.js';

export function createMemoryStore() {
  const messages = [];
  const events = [];
  let posts = linkedinPosts.map(parsePost).filter(Boolean);

  return {
    kind: 'memory',
    async getContent() {
      return { projects, experience, certifications, skills };
    },
    async addMessage(msg) {
      const doc = { ...msg, _id: String(messages.length + 1), createdAt: new Date() };
      messages.push(doc);
      return doc;
    },
    async listPosts() {
      return [...posts].sort((a, b) => b.postedAt - a.postedAt);
    },
    async addPost(p) {
      if (!posts.some((x) => x.urn === p.urn)) posts.push(p);
      return p;
    },
    async removePost(urn) {
      const before = posts.length;
      posts = posts.filter((x) => x.urn !== urn);
      return posts.length < before;
    },
    async listMessages() {
      return [...messages].reverse();
    },
    async addEvent(evt) {
      events.push({ ...evt, createdAt: new Date() });
    },
    async stats(days = 14) {
      const views = events.filter((e) => e.type === 'pageview');
      const keys = lastNDays(days);
      const byDay = Object.fromEntries(keys.map((k) => [k, 0]));
      for (const e of views) {
        const k = dayKey(e.createdAt);
        if (k in byDay) byDay[k]++;
      }
      const pages = {};
      for (const e of views) pages[e.path || '/'] = (pages[e.path || '/'] || 0) + 1;
      return {
        totalViews: views.length,
        uniqueVisitors: new Set(views.map((e) => e.visitorId)).size,
        daily: keys.map((date) => ({ date, views: byDay[date] })),
        pages: Object.entries(pages)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8),
        queriesRun: events.filter((e) => e.type === 'query').length,
      };
    },
  };
}
