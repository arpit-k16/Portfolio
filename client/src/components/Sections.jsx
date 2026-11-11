// Building blocks shared by the pages.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import Tilt from './Tilt.jsx';
import CountUp from './CountUp.jsx';
import { useContent } from '../lib/content.jsx';

export function PageHead({ title, intro, query, children }) {
  const navigate = useNavigate();
  return (
    <header className="page-head" data-reveal="up">
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children}
      </div>
      {query && (
        <button className="q-chip" onClick={() => navigate(`/?q=${encodeURIComponent(query)}`)} title="Open this query in the console on the home page">
          <code>{query}</code>
          <span>Run in console</span>
        </button>
      )}
    </header>
  );
}

export function Loading({ what = 'portfolio data' }) {
  const { error } = useContent();
  if (error) return null;
  return <div className="loading" aria-busy="true">Loading {what}…</div>;
}

const initials = (label = '') => label.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Organisation logo; falls back to initials when there's no logo or it fails to load.
export function OrgLogo({ name, label, size = 40 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  if (!name || failed) return <span className="org-logo initials" style={style} aria-hidden="true">{initials(label)}</span>;
  return <img className="org-logo" src={`${import.meta.env.BASE_URL}logos/${name}.webp`} alt="" width={size} height={size} loading="lazy" style={style} onError={() => setFailed(true)} />;
}

export const catClass = (c) => `cat-${c.replace(/\W/g, '').toLowerCase()}`;

export function ProjectCard({ p, wide }) {
  return (
    <Tilt as="article" max={6} data-reveal="rise" className={`proj ${catClass(p.category)} ${wide ? 'feat' : ''}`}>
      <div className="proj-top">
        <span className="cat">{p.category}</span>
        <span className="yr">{p.year}</span>
      </div>
      <h3><Link to={`/projects/${p.slug}`} className="stretch">{p.title}</Link></h3>
      {p.highlight && <p className="hl">{p.highlight}</p>}
      <p className="sum">{p.summary}</p>
      <ul className="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
      <p className="more">Read the case study</p>
    </Tilt>
  );
}

const CATS = ['All', 'ML', 'Analytics', 'BI'];

export function ProjectGrid({ projects }) {
  const [cat, setCat] = useState('All');
  const shown = projects.filter((p) => cat === 'All' || p.category === cat);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {CATS.map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c} <span>{c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="grid" data-reveal-stagger key={cat}>
        {shown.map((p) => <ProjectCard key={p.slug} p={p} wide={cat === 'All' && p.featured} />)}
      </div>
    </>
  );
}

export function SkillMatrix({ skills, projects }) {
  const rows = useMemo(
    () => skills
      .map((s) => ({ ...s, used: projects.map((p) => p.stack.includes(s.name)) }))
      .map((s) => ({ ...s, total: s.used.filter(Boolean).length }))
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total),
    [skills, projects]
  );
  const [hover, setHover] = useState(null);
  return (
    <div className="matrix-wrap" data-reveal="cells">
      <table className="matrix">
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Skill</span></th>
            {projects.map((p, j) => (
              <th key={p.slug} scope="col" className={hover === j ? 'on' : ''}>
                <Link to={`/projects/${p.slug}`} title={p.title}><span>{p.title.split(':')[0]}</span></Link>
              </th>
            ))}
            <th scope="col" className="tot">Projects</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, ri) => (
            <tr key={s.name}>
              <th scope="row">{s.name}<small>{s.group}</small></th>
              {s.used.map((u, j) => (
                <td key={j} onMouseEnter={() => setHover(j)} onMouseLeave={() => setHover(null)}
                  className={`${u ? 'y' : ''} ${hover === j ? 'on' : ''}`}
                  aria-label={u ? `${s.name} used in ${projects[j].title}` : undefined}>
                  {u ? <i style={{ '--c': j + ri }} /> : null}
                </td>
              ))}
              <td className="tot">{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const fmtMonth = (ym) => {
  if (!ym) return 'Present';
  const [y, m] = String(ym).split('-').map(Number);
  if (!m) return String(y);
  return new Date(y, m - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

export function Timeline({ experience }) {
  return (
    <ol className="timeline" data-reveal-stagger>
      {experience.map((e) => (
        <li key={e.role + e.org} data-reveal="up">
          <div className="when">
            {fmtMonth(e.start)}{e.end !== e.start && <> – {fmtMonth(e.end)}</>}
            <span className={`mode ${e.end ? '' : 'live'}`}>{e.end ? e.mode : 'Ongoing'}</span>
            {e.tag && <span className="mode tag">{e.tag}</span>}
          </div>
          <div className="tl-body">
            <OrgLogo name={e.logo} label={e.org} size={44} />
            <div>
              <h3>{e.role}</h3>
              <p className="org">{e.org}</p>
              <p>{e.summary}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Extracurriculars({ items }) {
  return (
    <div className="extra-grid" data-reveal-stagger>
      {items.map((e) => (
        <Tilt as="article" max={6} key={e.role + e.org} className="extra-card" data-reveal="rise">
          <div className="extra-top">
            <OrgLogo name={e.logo} label={e.org} size={44} />
            <span className="mode">{e.mode}</span>
          </div>
          <h3>{e.role}</h3>
          <p className="org">{e.org}</p>
          <p className="extra-sum">{e.summary}</p>
          <p className="extra-when">{fmtMonth(e.start)}{e.end !== e.start && <> – {fmtMonth(e.end)}</>}</p>
        </Tilt>
      ))}
    </div>
  );
}

export function CertTable({ certifications }) {
  return (
    <div className="table-wrap card" data-reveal="up">
      <table className="certs">
        <thead><tr><th>Certification</th><th>Issuer</th><th>Issued</th></tr></thead>
        <tbody>
          {certifications.map((c) => (
            <tr key={c.name + c.issuer}><td>{c.name}</td><td><span className="issuer"><OrgLogo name={c.logo} label={c.issuer} size={26} />{c.issuer}</span></td><td className="num">{fmtMonth(c.date)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Publications({ publications, achievements }) {
  return (
    <div className="pubs" data-reveal="up">
      {publications.map((p) => (
        <article key={p.doi} className="pub">
          <div className="pub-top">
            <p className="pub-meta"><span>Research paper</span> {p.year}</p>
            <OrgLogo name={p.logo} label="Springer" size={44} />
          </div>
          <h3><a href={p.url} target="_blank" rel="noopener">{p.title}</a></h3>
          <p className="pub-authors">{p.authors.split(/(A\. Kumar)/).map((part, i) => part === 'A. Kumar' ? <b key={i}>{part}</b> : part)}</p>
          <p className="pub-venue">{p.venue}</p>
          <p>{p.note}</p>
          <a className="pub-doi" href={p.url} target="_blank" rel="noopener">DOI {p.doi}</a>
        </article>
      ))}
      <ul className="awards" data-reveal-stagger>
        {achievements.map((a) => (
          <li key={a.title} data-reveal="right">
            <OrgLogo name={a.logo} label={a.org} size={40} />
            <div>
              <span className="aw-type">{a.type}</span>
              <b>{a.title}</b>
              <span>{a.org}, {a.year}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PAGE_NAMES = { '/': 'Home', '/projects': 'Projects', '/skills': 'Skills', '/experience': 'Experience', '/analytics': 'Analytics', '/contact': 'Contact', '/posts': 'Posts', '/404': 'Not found' };

export function AnalyticsPanel() {
  const { content } = useContent();
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  const [latency, setLatency] = useState(null);
  const load = async () => {
    const t = performance.now();
    try {
      const d = await api.stats();
      setLatency(Math.round(performance.now() - t));
      setS(d); setErr('');
    } catch {
      setErr('Analytics are unavailable right now. The API may be waking up; try Refresh in a few seconds.');
    }
  };
  useEffect(() => {
    const first = setTimeout(load, 300); // let this page's own view land first
    const id = setInterval(load, 30000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  const pageName = (path) => {
    if (PAGE_NAMES[path]) return PAGE_NAMES[path];
    const slug = path.startsWith('/projects/') && path.slice(10);
    const p = slug && content?.projects.find((x) => x.slug === slug);
    return p ? p.title.split(':')[0] : path;
  };

  const peak = Math.max(0, ...(s?.daily || []).map((d) => d.views));
  const max = Math.max(4, Math.ceil(peak / 4) * 4);
  const pageMax = Math.max(1, ...(s?.pages || []).map((d) => d.count));

  if (err) return <p className="err">{err} <button className="link-btn" onClick={load}>Refresh</button></p>;
  if (!s) return <Loading what="analytics" />;
  return (
    <div className="dash" data-reveal="grow" data-reveal-stagger>
      <div className="kpi"><b><CountUp value={s.totalViews} /></b><span>Page views</span></div>
      <div className="kpi"><b><CountUp value={s.uniqueVisitors} /></b><span>Unique visitors</span></div>
      <div className="kpi"><b><CountUp value={s.queriesRun} /></b><span>SQL queries run here</span></div>
      <div className="kpi"><b>{latency}<small> ms</small></b><span>API round trip, just now</span></div>

      <figure className="chart daily">
        <figcaption>Page views per day, last 14 days</figcaption>
        <svg viewBox="0 0 560 180" role="img" aria-label={`Daily views: ${s.daily.map((d) => `${d.date} ${d.views}`).join(', ')}`}>
          {[0.5, 1].map((f) => (
            <g key={f}>
              <line x1="30" x2="560" y1={150 - f * 130} y2={150 - f * 130} className="grid" />
              <text x="24" y={154 - f * 130} textAnchor="end" className="tick">{Math.round(max * f)}</text>
            </g>
          ))}
          <line x1="30" x2="560" y1="150" y2="150" className="axis" />
          {s.daily.map((d, i) => {
            const w = 530 / s.daily.length;
            const h = (d.views / max) * 130;
            const today = i === s.daily.length - 1;
            return (
              <g key={d.date}>
                <rect style={{ '--i': i }} x={34 + i * w} y={150 - h} width={w - 8} height={Math.max(h, d.views ? 2 : 0)} rx="3" className={today ? 'today' : ''}>
                  <title>{`${d.date}: ${d.views} views`}</title>
                </rect>
                {(i % 2 === 1 || today) && (
                  <text x={34 + i * w + (w - 8) / 2} y="170" textAnchor="middle" className="tick">
                    {today ? 'Today' : d.date.slice(8)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </figure>

      <figure className="chart secs">
        <figcaption>Most-viewed pages</figcaption>
        {s.pages.length === 0 && <p className="meta">No page views yet.</p>}
        <ul>
          {s.pages.map((x, k) => (
            <li key={x.path} style={{ '--i': k }}>
              <span>{pageName(x.path)}</span>
              <i style={{ width: `${(x.count / pageMax) * 100}%` }} />
              <b>{x.count}</b>
            </li>
          ))}
        </ul>
        <button className="link-btn" onClick={load}>Refresh</button>
      </figure>
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [state, setState] = useState({ status: 'idle', error: '', fields: {} });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'sending', error: '', fields: {} });
    try {
      await api.contact(form);
      setState({ status: 'sent', error: '', fields: {} });
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setState({ status: 'idle', error: err.message, fields: err.fields || {} });
    }
  };
  const f = state.fields;
  if (state.status === 'sent') {
    return (
      <div className="sent" role="status">
        <h3>Message sent</h3>
        <p>Thanks. I’ll reply to the email you gave, usually within a day or two.</p>
        <button className="btn" onClick={() => setState({ status: 'idle', error: '', fields: {} })}>Send another message</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate>
      <label>Name<input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!f.name} />{f.name && <small>{f.name}</small>}</label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!f.email} />{f.email && <small>{f.email}</small>}</label>
      <label>Message<textarea rows={6} value={form.message} onChange={set('message')} aria-invalid={!!f.message} placeholder="The role, the team, or the dataset you have in mind" />{f.message && <small>{f.message}</small>}</label>
      <label className="hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
      {state.error && !Object.keys(f).length && <p className="err">{state.error}</p>}
      <button className="btn primary" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
