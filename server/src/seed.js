import 'dotenv/config';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import { Project, Experience, Certification, Skill, Post } from './models.js';
import { parsePost } from './linkedin.js';
import { projects, experience, certifications, skills, linkedinPosts } from './data/content.js';

const withOrder = (arr) => arr.map((d, i) => ({ ...d, order: i }));

// Replaces content collections with data/content.js. Never touches messages or analytics.
export async function seed() {
  await Promise.all([Project, Experience, Certification, Skill].map((M) => M.deleteMany({})));
  await Promise.all([
    Project.insertMany(withOrder(projects)),
    Experience.insertMany(withOrder(experience)),
    Certification.insertMany(withOrder(certifications)),
    Skill.insertMany(withOrder(skills)),
  ]);
  // Posts added from /admin are kept; seed ones are only inserted if missing.
  for (const p of linkedinPosts.map(parsePost).filter(Boolean)) {
    await Post.updateOne({ urn: p.urn }, { $setOnInsert: p }, { upsert: true });
  }
  console.log(`[seed] ${projects.length} projects, ${experience.length} roles, ${certifications.length} certifications, ${skills.length} skills`);
}

// `npm run seed`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI in server/.env first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await seed();
  await mongoose.disconnect();
}
