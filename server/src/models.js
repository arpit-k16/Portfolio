import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const Project = model(
  'Project',
  new Schema({
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    year: Number,
    category: String,
    featured: { type: Boolean, default: false },
    summary: String,
    highlight: String,
    stack: [String],
    links: { live: String, code: String },
    order: Number,
  })
);

export const Experience = model(
  'Experience',
  new Schema({ role: String, org: String, logo: String, start: String, end: String, mode: String, tag: String, summary: String, order: Number })
);

export const Certification = model(
  'Certification',
  new Schema({ name: String, issuer: String, logo: String, date: String, order: Number })
);

export const Skill = model('Skill', new Schema({ name: String, group: String, order: Number }));

export const Post = model(
  'Post',
  new Schema({ urn: { type: String, unique: true, required: true }, url: String, embed: String, postedAt: Date }, { timestamps: true })
);

export const Message = model(
  'Message',
  new Schema(
    {
      name: { type: String, required: true, maxlength: 100 },
      email: { type: String, required: true, maxlength: 200 },
      message: { type: String, required: true, maxlength: 4000 },
    },
    { timestamps: true }
  )
);

// Anonymous analytics: a random per-browser id, never an IP address.
const eventSchema = new Schema(
  {
    type: { type: String, enum: ['pageview', 'query'], required: true },
    path: String,
    visitorId: String,
    referrer: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
eventSchema.index({ type: 1, createdAt: -1 });
// Keep one year of events.
eventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });
export const Event = model('Event', eventSchema);
