const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, opts = {}) {
  const { token, ...rest } = opts;
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...rest,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.fields = data.fields;
    throw err;
  }
  return data;
}

const DEMO = import.meta.env.VITE_DEMO === '1';
const demo = () => import('./demoApi.js');

export const api = DEMO
  ? {
      content: async () => (await demo()).content(),
      stats: async () => (await demo()).stats(),
      health: async () => ({ ok: true, store: 'browser preview' }),
      contact: async (body) => (await demo()).contact(body),
      event: async (body) => (await demo()).event(body).catch(() => {}),
      posts: async () => (await demo()).posts(),
      addPost: async () => { throw new Error('Posts can only be managed on the live site.'); },
      removePost: async () => { throw new Error('Posts can only be managed on the live site.'); },
      messages: async () => { throw new Error('Messages can only be read on the live site.'); },
    }
  : {
      content: () => request('/content'),
      stats: () => request('/stats'),
      health: () => request('/health'),
      contact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
      event: (body) => request('/events', { method: 'POST', body: JSON.stringify(body), keepalive: true }).catch(() => {}),
      posts: () => request('/posts'),
      addPost: (url, token) => request('/admin/posts', { method: 'POST', body: JSON.stringify({ url }), token }),
      removePost: (urn, token) => request(`/admin/posts/${encodeURIComponent(urn)}`, { method: 'DELETE', token }),
      messages: (token) => request('/admin/messages', { token }),
    };

// Anonymous per-browser id for unique-visitor counts. No cookies, no IP.
export function visitorId() {
  try {
    let id = localStorage.getItem('vid');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
      localStorage.setItem('vid', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

export function track(type, extra = {}) {
  api.event({ type, visitorId: visitorId(), ...extra });
}
