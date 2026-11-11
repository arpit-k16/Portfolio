import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loading, ProjectCard, catClass } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';
import NotFound from './NotFound.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const list = content?.projects || [];
  const i = list.findIndex((p) => p.slug === slug);
  const p = list[i];
  useTitle(p?.title.split(':')[0] || 'Project');

  if (!content) return <section className="page"><Loading what="project" /></section>;
  if (!p) return <NotFound />;

  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  const related = list
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, shared: x.stack.filter((s) => p.stack.includes(s)).length }))
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map((r) => r.x);
  const sql = `SELECT * FROM projects WHERE title = '${p.title.replace(/'/g, "''")}'`;

  return (
    <article className={`page detail ${catClass(p.category)}`}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/projects">Projects</Link> <span aria-hidden="true">/</span> <span>{p.title.split(':')[0]}</span></nav>
      <header className="detail-head">
        <p className="detail-meta"><span className="cat">{p.category}</span> {p.year}</p>
        <h1>{p.title}</h1>
        {p.highlight && <p className="detail-hl">{p.highlight}</p>}
      </header>

      <div className="detail-body" data-reveal="up">
        <div className="detail-main">
          <h2>Overview</h2>
          <p>{p.summary}</p>
          <div className="ctas">
            {p.links?.live && <a className="btn primary" href={p.links.live} target="_blank" rel="noopener">Open live app</a>}
            {p.links?.code && <a className={`btn ${p.links?.live ? '' : 'primary'}`} href={p.links.code} target="_blank" rel="noopener">View code on GitHub</a>}
            <button className="btn" onClick={() => navigate(`/?q=${encodeURIComponent(sql)}`)}>Query in console</button>
          </div>
        </div>
        <aside className="detail-side" aria-label="Project facts">
          <dl>
            <dt>Category</dt><dd>{p.category}</dd>
            <dt>Year</dt><dd>{p.year}</dd>
            <dt>Stack</dt><dd><ul className="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></dd>
            {p.links?.live && <><dt>Live</dt><dd><a href={p.links.live} target="_blank" rel="noopener">{new URL(p.links.live).hostname}</a></dd></>}
          </dl>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="rel-h">
          <h2 id="rel-h">Projects with a similar stack</h2>
          <div className="grid" data-reveal-stagger>{related.map((r) => <ProjectCard key={r.slug} p={r} />)}</div>
        </section>
      )}

      <nav className="pager" aria-label="More projects">
        <Link to={`/projects/${prev.slug}`}><small>Previous project</small>{prev.title}</Link>
        <Link to={`/projects/${next.slug}`} className="next"><small>Next project</small>{next.title}</Link>
      </nav>
    </article>
  );
}
