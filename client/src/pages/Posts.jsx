import { useEffect, useState } from 'react';
import { Loading, PageHead } from '../components/Sections.jsx';
import { api } from '../lib/api.js';
import { useTitle } from '../lib/content.jsx';

const PAGE = 6;
const DEMO = import.meta.env.VITE_DEMO === '1';
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// One embedded LinkedIn post; the iframe loads only when the card is near the screen.
function PostCard({ p }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <article className="post-card" data-reveal="rise">
      <div className="post-frame">
        {!loaded && <div className="post-skeleton" aria-hidden="true"><i /><i /><i /><i /></div>}
        {DEMO ? (
          <div className="post-preview-note">
            <p>LinkedIn posts appear here on the live site.</p>
            <a href={p.url} target="_blank" rel="noopener">Read this post on LinkedIn</a>
          </div>
        ) : (
          <iframe
            src={p.embed}
            title={`LinkedIn post from ${fmt(p.postedAt)}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            allowFullScreen
          />
        )}
      </div>
      <div className="post-actions">
        <span className="post-date">{fmt(p.postedAt)}</span>
        <a className="btn primary small" href={p.url} target="_blank" rel="noopener">Like on LinkedIn</a>
        <a className="btn small" href={p.url} target="_blank" rel="noopener">Comment</a>
      </div>
    </article>
  );
}

export default function PostsPage() {
  useTitle('Posts');
  const [posts, setPosts] = useState(null);
  const [err, setErr] = useState('');
  const [shown, setShown] = useState(PAGE);

  const load = () => {
    setErr('');
    api.posts().then(setPosts).catch(() => setErr("Couldn't load posts. The API may be waking up; try again in a few seconds."));
  };
  useEffect(load, []);

  return (
    <section className="page">
      <PageHead
        title="Posts"
        intro="What I write about on LinkedIn: project write-ups, what I’m learning, and data stories. To like or comment, use the buttons under each post; they open it on LinkedIn so your reaction counts there."
      >
        <a className="btn" href="https://www.linkedin.com/in/arpit-kumar-261888315/recent-activity/all/" target="_blank" rel="noopener" style={{ marginTop: 18 }}>Follow on LinkedIn</a>
      </PageHead>
      {err && <p className="err">{err} <button className="link-btn" onClick={load}>Try again</button></p>}
      {!posts && !err && <Loading what="posts" />}
      {posts && posts.length === 0 && <p className="meta">No posts yet.</p>}
      {posts && posts.length > 0 && (
        <>
          <div className="posts-grid" data-reveal-stagger>
            {posts.slice(0, shown).map((p) => <PostCard key={p.urn} p={p} />)}
          </div>
          {shown < posts.length && (
            <div className="more-row">
              <button className="btn" onClick={() => setShown((n) => n + PAGE)}>
                Show more posts ({posts.length - shown} left)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
