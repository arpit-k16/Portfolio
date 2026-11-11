import { Link, useLocation } from 'react-router-dom';
import { useTitle } from '../lib/content.jsx';

export default function NotFound() {
  useTitle('Page not found');
  const { pathname } = useLocation();
  return (
    <section className="page notfound">
      <pre className="nf-query" aria-hidden="true">{`SELECT * FROM pages WHERE path = '${pathname}';\n-- 0 rows returned`}</pre>
      <h1>There’s no page at this address</h1>
      <p>The link may be out of date. Try the projects list or go back to the home page.</p>
      <div className="ctas">
        <Link className="btn primary" to="/">Go to home</Link>
        <Link className="btn" to="/projects">Browse projects</Link>
      </div>
    </section>
  );
}
