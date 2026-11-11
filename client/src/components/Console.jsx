import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildTables, runSQL } from '../lib/sql.js';
import { track } from '../lib/api.js';

const PRESETS = [
  { label: 'ML projects', q: "SELECT title, year, stack FROM projects WHERE category = 'ML'" },
  { label: 'Uses SQL', q: "SELECT title, highlight FROM projects WHERE stack LIKE '%SQL%'" },
  { label: 'Top skills', q: 'SELECT name, projects FROM skills ORDER BY projects DESC LIMIT 6' },
  { label: 'Experience', q: 'SELECT role, org, start, end FROM experience' },
  { label: 'Help', q: 'HELP' },
];

const FIRST = 'SELECT title, year, highlight FROM projects ORDER BY year DESC LIMIT 5';

export default function Console({ content, pending, initialQuery }) {
  const navigate = useNavigate();
  const tables = useMemo(() => (content ? buildTables(content) : null), [content]);
  const [query, setQuery] = useState(initialQuery || FIRST);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);

  const run = (q = query, log = true) => {
    if (!tables) return;
    try {
      const r = runSQL(q, tables);
      setResult(r);
      setError('');
      if (log) {
        setHistory((h) => [q, ...h.filter((x) => x !== q)].slice(0, 20));
        track('query');
      }
    } catch (e) {
      setResult(null);
      setError(e.message);
    }
    setHIdx(-1);
  };

  useEffect(() => {
    if (!tables) return;
    if (initialQuery) { run(initialQuery); inputRef.current?.focus({ preventScroll: true }); }
    else run(FIRST, false);
  }, [tables, initialQuery]); // eslint-disable-line

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); }
    if (e.key === 'ArrowUp' && history.length && !query.includes('\n')) {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      setHIdx(n); setQuery(history[n]);
    }
    if (e.key === 'ArrowDown' && hIdx >= 0) {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(n); setQuery(n < 0 ? '' : history[n]);
    }
  };

  const openRow = (row) => {
    if (result?.table === 'projects' && row._slug) {
      navigate(`/projects/${row._slug}`);
    }
  };

  return (
    <div className="console" id="console">
      <div className="console-bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="console-title">arpit.db</span>
        <span className="console-status">{pending ? 'connecting…' : 'connected'}</span>
      </div>

      <label className="sr-only" htmlFor="sql">SQL query</label>
      <div className="prompt">
        <span className="caret" aria-hidden="true">›</span>
        <textarea
          id="sql"
          ref={inputRef}
          rows={2}
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type SQL, e.g. SHOW TABLES"
        />
        <button className="run" onClick={() => run()} disabled={!tables}>Run</button>
      </div>

      <div className="presets" role="group" aria-label="Example queries">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => { setQuery(p.q); run(p.q); }}>{p.label}</button>
        ))}
      </div>

      <div className="result" aria-live="polite">
        {error && <p className="err">{error}</p>}
        {!error && result && (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr>{result.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} onClick={() => openRow(r)} className={r._slug ? 'link' : ''}>
                      {result.columns.map((c) => <td key={c}>{String(r[c] ?? '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="meta">
              {result.rows.length} {result.rows.length === 1 ? 'row' : 'rows'} in {result.ms.toFixed(1)} ms
              {result.table === 'projects' && result.rows.length > 0 && '. Select a row to open the project.'}
            </p>
          </>
        )}
        {!tables && !error && <p className="meta">Loading tables…</p>}
      </div>
    </div>
  );
}
