import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useContent } from './lib/content.jsx';
import { track } from './lib/api.js';
import { useReveal } from './lib/reveal.js';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import SkillsPage from './pages/Skills.jsx';
import ExperiencePage from './pages/Experience.jsx';
import AnalyticsPage from './pages/Analytics.jsx';
import ContactPage from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import PostsPage from './pages/Posts.jsx';
import AdminPage from './pages/Admin.jsx';

const LINKS = [
  ['/projects', 'Projects'],
  ['/skills', 'Skills'],
  ['/experience', 'Experience'],
  ['/posts', 'Posts'],
  ['/analytics', 'Analytics'],
];

export default function App() {
  const { pathname } = useLocation();
  const { error, reload } = useContent();
  const [menu, setMenu] = useState(false);
  useReveal([pathname]);

  // One pageview per route, then back to the top of the new page.
  useEffect(() => {
    if (pathname !== '/admin') track('pageview', { path: pathname, referrer: document.referrer || undefined });
    window.scrollTo(0, 0);
    setMenu(false);
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <header className="nav-wrap">
        <nav className="nav" aria-label="Main">
          <Link to="/" className="logo" aria-label="Arpit Kumar, home">
            <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="15" width="5" height="10" rx="1.5" /><rect x="11.5" y="9" width="5" height="16" rx="1.5" /><rect x="20" y="3" width="5" height="22" rx="1.5" /></svg>
            Arpit Kumar
          </Link>
          <button className="menu-btn" aria-expanded={menu} aria-controls="nav-links" onClick={() => setMenu((m) => !m)}>
            {menu ? 'Close' : 'Menu'}
          </button>
          <div id="nav-links" className={`nav-links ${menu ? 'open' : ''}`}>
            {LINKS.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
            <NavLink to="/contact" className="nav-cta">Contact</NavLink>
          </div>
        </nav>
      </header>

      <main id="main">
        {error && (
          <div className="banner" role="alert">
            {error} <button className="link-btn" onClick={reload}>Try again</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="foot">
        <div>
          <Link to="/" className="logo small">Arpit Kumar</Link>
          <p>Data Analyst and ML enthusiast, Ghaziabad, India.</p>
        </div>
        <nav aria-label="Footer">
          {LINKS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="foot-ext">
          <a href="https://github.com/arpit-k16" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/arpit-kumar-261888315/" target="_blank" rel="noopener">LinkedIn</a>
          <span>© {new Date().getFullYear()} Arpit Kumar</span>
        </div>
      </footer>
    </>
  );
}
