import { Suspense, lazy, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Console from '../components/Console.jsx';
import LogoMarquee from '../components/LogoMarquee.jsx';
import NameCycle from '../components/NameCycle.jsx';
import Tilt from '../components/Tilt.jsx';

const DataTerrain = lazy(() => import('../three/DataTerrain.jsx'));
import { OrgLogo, catClass, fmtMonth } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';

// AeroTwin plus the projects on the resume.
const SELECTED = ['aerotwin', 'amazon-ecommerce', 'airline-loyalty'];

export default function Home() {
  useTitle('');
  const { content, error } = useContent();
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const selected = useMemo(
    () => (content ? SELECTED.map((s) => content.projects.find((p) => p.slug === s)).filter(Boolean) : []),
    [content]
  );
  const topSkills = useMemo(() => {
    if (!content) return [];
    return content.skills
      .map((s) => ({ ...s, n: content.projects.filter((p) => p.stack.includes(s.name)).length }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 6);
  }, [content]);
  const recent = content?.experience.slice(0, 3) || [];

  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero-bg" aria-hidden="true">
          <Suspense fallback={null}><DataTerrain /></Suspense>
        </div>
        <div className="intro">
          <p className="avail"><i aria-hidden="true" />Open to internships</p>
          <h1>Arpit<br />Kumar</h1>
          <NameCycle />
          <p className="lede">I turn messy data into decisions with SQL, Python and Power BI, and I build the ML models that sit on top of it.</p>
          <p className="sub">B.Tech CSE at Bennett University, class of 2028. Amazon ML Summer School 2026 mentee. Based in Ghaziabad, India.</p>
          <div className="ctas">
            <Link className="btn primary" to="/projects">See my projects</Link>
            <Link className="btn" to="/contact">Get in touch</Link>
          </div>
        </div>
        <div className="console-col">
          <p className="console-hint">This portfolio is a database. Query it.</p>
          <Console content={content} pending={!content && !error} initialQuery={q} />
        </div>
      </section>

      <LogoMarquee />

      <section className="about" aria-labelledby="about-h">
        <div className="about-photo" data-reveal="left">
          <div className="photo-wrap">
            <Tilt className="photo-card" max={10}>
              <img src={`${import.meta.env.BASE_URL}arpit.webp`} alt="Arpit Kumar" width="264" height="330" loading="lazy" />
            </Tilt>
            <ul className="photo-tags" aria-label="Highlights">
              <li className="photo-tag tag-a">Amazon MLSS ’26</li>
              <li className="photo-tag tag-b">Springer co-author</li>
              <li className="photo-tag tag-c">Ghaziabad, IN</li>
            </ul>
          </div>
        </div>
        <div className="about-text" data-reveal="right">
          <h2 id="about-h">Hi, I’m Arpit.</h2>
          <p>I’m a third-year Computer Science student at Bennett University who likes turning raw data into decisions someone can act on. Most of my work starts with SQL and Python and ends as a Power BI dashboard, a business-review deck, or a model with a clear story behind it.</p>
          <p>I’ve done two university-incubated analyst internships, learned from Amazon scientists at the ML Summer School, and co-authored a Springer paper presented at BITS Pilani, Dubai. Right now I’m looking for Data Analyst, Business Analyst and Data Science internships.</p>
          <dl className="facts" data-reveal-stagger>
            <div data-reveal="up"><dt>Studying</dt><dd>B.Tech CSE, Bennett University, 2024–2028</dd></div>
            <div data-reveal="up"><dt>Interned at</dt><dd>Gago Mobility, Academic Hub (university-incubated)</dd></div>
            <div data-reveal="up"><dt>Core tools</dt><dd>SQL, Python, Power BI, Excel</dd></div>
            <div data-reveal="up"><dt>Languages</dt><dd>English, Hindi</dd></div>
          </dl>
        </div>
      </section>

      {content && (
        <>
          <section className="home-block" aria-labelledby="sel-h">
            <div className="block-head" data-reveal="up">
              <h2 id="sel-h">Selected work</h2>
              <Link to="/projects" className="arrow-link">All {content.projects.length} projects</Link>
            </div>
            <div className="selected" data-reveal-stagger>
              {selected.map((p, i) => (
                <Tilt key={p.slug} data-reveal="rise" className={`sel-card ${catClass(p.category)} ${i === 0 ? 'lead' : ''}`}>
                  <Link to={`/projects/${p.slug}`} className="stretch">
                    <span className="sel-meta"><span className="cat">{p.category}</span> {p.year}</span>
                    <span className="sel-title">{p.title}</span>
                  </Link>
                  <span className="sel-hl">{p.highlight}</span>
                  <p className="sel-sum">{p.summary}</p>
                  <span className="sel-stack">{p.stack.join(' · ')}</span>
                </Tilt>
              ))}
            </div>
          </section>

          <section className="home-split">
            <div className="home-block" aria-labelledby="now-h" data-reveal="left">
              <div className="block-head">
                <h2 id="now-h">Recent experience</h2>
                <Link to="/experience" className="arrow-link">Full timeline</Link>
              </div>
              <ul className="mini-tl" data-reveal-stagger>
                {recent.map((e) => (
                  <li key={e.role + e.org} data-reveal="left">
                    <OrgLogo name={e.logo} label={e.org} size={40} />
                    <b>{e.role}</b>
                    <span>{e.org}{e.tag ? ` · ${e.tag}` : ''}</span>
                    <small>{fmtMonth(e.start)} – {fmtMonth(e.end)}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div className="home-block" aria-labelledby="sk-h" data-reveal="right">
              <div className="block-head">
                <h2 id="sk-h">Most-used tools</h2>
                <Link to="/skills" className="arrow-link">Skill matrix</Link>
              </div>
              <ul className="bars" data-reveal="grow" data-reveal-stagger>
                {topSkills.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <i style={{ width: `${(s.n / topSkills[0].n) * 100}%` }} />
                    <b>{s.n} {s.n === 1 ? 'project' : 'projects'}</b>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cta-band" aria-labelledby="cta-h" data-reveal="scale">
            <h2 id="cta-h">Hiring a data analyst intern?</h2>
            <p>I’m available for Data Analyst, Business Analyst and Data Science internships, remote or on-site, anywhere.</p>
            <div className="ctas">
              <Link className="btn primary" to="/contact">Send me a message</Link>
              <a className="btn" href="https://www.linkedin.com/in/arpit-kumar-261888315/" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </section>
        </>
      )}
    </>
  );
}
