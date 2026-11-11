import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useTitle } from '../lib/content.jsx';

// Private page (not in the menu): add or remove LinkedIn posts shown on /posts.
// Uses the ADMIN_TOKEN set on the server; the token is kept only for this browser tab.
export default function AdminPage() {
  useTitle('Admin');
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem('adminToken') || ''; } catch { return ''; } });
  const [url, setUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState({ kind: '', text: '' });
  const [busy, setBusy] = useState(false);

  const refresh = () => api.posts().then(setPosts).catch(() => {});
  useEffect(() => { refresh(); }, []);
  const saveToken = (v) => { setToken(v); try { sessionStorage.setItem('adminToken', v); } catch { /* ignore */ } };

  const add = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg({ kind: '', text: '' });
    try {
      await api.addPost(url.trim(), token);
      setUrl('');
      setMsg({ kind: 'ok', text: 'Post added. It now shows at the top of the Posts page.' });
      refresh();
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    }
    setBusy(false);
  };

  const remove = async (urn) => {
    try {
      await api.removePost(urn, token);
      setMsg({ kind: 'ok', text: 'Post removed from the site. It is still on LinkedIn.' });
      refresh();
    } catch (err) {
      setMsg({ kind: 'err', text: err.message });
    }
  };

  return (
    <section className="page admin">
      <header className="page-head"><div>
        <h1>Manage posts</h1>
        <p>After you post on LinkedIn, open the post’s “…” menu, choose “Copy link to post”, and paste it here.</p>
      </div></header>
      <form onSubmit={add} className="admin-form">
        <label>Admin token<input type="password" value={token} onChange={(e) => saveToken(e.target.value)} autoComplete="off" placeholder="ADMIN_TOKEN from your server settings" /></label>
        <label>LinkedIn post link<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.linkedin.com/posts/…" /></label>
        {msg.text && <p className={msg.kind === 'err' ? 'err' : 'ok'}>{msg.text}</p>}
        <button className="btn primary" disabled={busy || !url || !token}>{busy ? 'Adding…' : 'Add post'}</button>
      </form>
      <h2 className="h2" style={{ marginTop: 48 }}>On the site ({posts.length})</h2>
      <ul className="admin-list">
        {posts.map((p) => (
          <li key={p.urn}>
            <span>{new Date(p.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <a href={p.url} target="_blank" rel="noopener">{p.urn.split(':').pop()}</a>
            <button className="link-btn" onClick={() => remove(p.urn)} disabled={!token}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
