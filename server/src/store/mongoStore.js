import mongoose from 'mongoose';
import { Project, Experience, Certification, Skill, Message, Event, Post } from '../models.js';
import { seed } from '../seed.js';
import { lastNDays } from './time.js';

const TZ = 'Asia/Kolkata';

export async function createMongoStore(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  // First boot on an empty database: load content.js automatically.
  if ((await Project.estimatedDocumentCount()) === 0) await seed();

  const clean = { _id: 0, __v: 0, order: 0, createdAt: 0, updatedAt: 0 };

  return {
    kind: 'mongo',
    async getContent() {
      const [projects, experience, certifications, skills] = await Promise.all([
        Project.find({}, clean).sort({ order: 1 }).lean(),
        Experience.find({}, clean).sort({ order: 1 }).lean(),
        Certification.find({}, clean).sort({ order: 1 }).lean(),
        Skill.find({}, clean).sort({ order: 1 }).lean(),
      ]);
      return { projects, experience, certifications, skills };
    },
    async addMessage(msg) {
      return Message.create(msg);
    },
    async listPosts() {
      return Post.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ postedAt: -1 }).lean();
    },
    async addPost(p) {
      await Post.updateOne({ urn: p.urn }, { $setOnInsert: p }, { upsert: true });
      return p;
    },
    async removePost(urn) {
      const r = await Post.deleteOne({ urn });
      return r.deletedCount > 0;
    },
    async listMessages() {
      return Message.find({}, { __v: 0 }).sort({ createdAt: -1 }).limit(200).lean();
    },
    async addEvent(evt) {
      await Event.create(evt);
    },
    async stats(days = 14) {
      const since = new Date(Date.now() - days * 86400000);
      const [totalViews, visitors, daily, pages, queriesRun] = await Promise.all([
        Event.countDocuments({ type: 'pageview' }),
        Event.distinct('visitorId', { type: 'pageview' }),
        Event.aggregate([
          { $match: { type: 'pageview', createdAt: { $gte: since } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } }, views: { $sum: 1 } } },
        ]),
        Event.aggregate([
          { $match: { type: 'pageview' } },
          { $group: { _id: { $ifNull: ['$path', '/'] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ]),
        Event.countDocuments({ type: 'query' }),
      ]);
      const map = Object.fromEntries(daily.map((d) => [d._id, d.views]));
      return {
        totalViews,
        uniqueVisitors: visitors.length,
        daily: lastNDays(days, TZ).map((date) => ({ date, views: map[date] || 0 })),
        pages: pages.map((p) => ({ path: p._id, count: p.count })),
        queriesRun,
      };
    },
  };
}
