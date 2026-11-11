import { createMongoStore } from './mongoStore.js';
import { createMemoryStore } from './memoryStore.js';

// Picks MongoDB when MONGODB_URI is set, otherwise an in-memory store so the
// app runs locally with zero setup (data resets on restart).
export async function createStore(uri) {
  if (uri) {
    try {
      const store = await createMongoStore(uri);
      console.log('[store] connected to MongoDB');
      return store;
    } catch (err) {
      // Keep the site up even if the database is unreachable (e.g. Atlas IP access list).
      console.error(`[store] could not connect to MongoDB (${err.name}: ${err.message.split('\n')[0]}). ` +
        'Check Atlas Network Access allows this server, then redeploy. Falling back to in-memory store.');
    }
  }
  if (!uri) console.warn('[store] MONGODB_URI not set: using in-memory store (data resets on restart)');
  return createMemoryStore();
}

