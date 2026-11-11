import { AnalyticsPanel, PageHead } from '../components/Sections.jsx';
import { useTitle } from '../lib/content.jsx';

const STEPS = [
  ['Your browser', 'Each page you open sends a small event with the page path and a random browser id.'],
  ['Express API', 'POST /api/events validates it and rate-limits noisy clients.'],
  ['MongoDB', 'Events are stored with a timestamp and expire after a year.'],
  ['Aggregation', 'GET /api/stats groups them by day and page with MongoDB pipelines.'],
];

export default function AnalyticsPage() {
  useTitle('Analytics');
  return (
    <section className="page">
      <PageHead
        title="This site, analysed"
        intro="A live dashboard of this portfolio’s own traffic. Your visit to this page is already in it. No IP addresses or cookies are stored."
      />
      <AnalyticsPanel />
      <div className="subsection">
        <h2 className="h2">How the numbers get here</h2>
        <ol className="pipeline" data-reveal-stagger>
          {STEPS.map(([t, d]) => <li key={t} data-reveal="rise"><b>{t}</b><p>{d}</p></li>)}
        </ol>
      </div>
    </section>
  );
}
