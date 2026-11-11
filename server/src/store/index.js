import { createMongoStore } from './mongoStore.js';
import { createMemoryStore } from './memoryStore.js';

// Picks MongoDB when MONGODB_URI is set, otherwise an in-memory store so the
// app runs locally with zero setup (data resets on restart).
export async function createStore(uri) {
  if (uri) {
    const store = await createMongoStore(uri);
    console.log('[store] connected to MongoDB');
    return store;
  }
  console.warn('[store] MONGODB_URI not set: using in-memory store (data resets on restart)');
  return createMemoryStore();
}

