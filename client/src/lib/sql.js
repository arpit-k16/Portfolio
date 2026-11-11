// A tiny SQL engine over the portfolio data. Supports:
//   SELECT cols|* FROM table [WHERE cond [AND|OR cond]...] [ORDER BY col [ASC|DESC]] [LIMIT n]
//   SELECT COUNT(*) FROM table [WHERE ...]
//   SHOW TABLES;  DESCRIBE table;  HELP
// Conditions: col = 'v' | col != 'v' | col > n | col < n | col >= n | col <= n | col LIKE '%v%'

export function buildTables(c) {
  return {
    projects: c.projects.map((p) => ({
      title: p.title,
      year: p.year,
      category: p.category,
      stack: (p.stack || []).join(', '),
      highlight: p.highlight || '',
      live: p.links?.live ? 'yes' : 'no',
      _slug: p.slug,
    })),
    experience: c.experience.map((e) => ({
      role: e.role,
      org: e.org,
      start: e.start,
      end: e.end || 'present',
      mode: e.mode,
    })),
    certifications: c.certifications.map((x) => ({ name: x.name, issuer: x.issuer, date: x.date })),
    extracurriculars: (c.extracurriculars || []).map((e) => ({ role: e.role, org: e.org, start: e.start, end: e.end || 'present', type: e.mode })),
    achievements: [
      ...(c.publications || []).map((p) => ({ title: p.title, org: 'Springer (ICAIN 2025)', year: p.year, type: 'Publication' })),
      ...(c.achievements || []).map((a) => ({ title: a.title, org: a.org, year: a.year, type: a.type })),
    ],
    skills: c.skills.map((s) => ({
      name: s.name,
      category: s.group,
      projects: c.projects.filter((p) => (p.stack || []).includes(s.name)).length,
    })),
  };
}

const HELP = [
  { example: 'SHOW TABLES', does: 'list the tables you can query' },
  { example: 'DESCRIBE projects', does: 'see the columns of a table' },
  { example: "SELECT title, year FROM projects WHERE stack LIKE '%SQL%'", does: 'filter by text' },
  { example: 'SELECT * FROM skills ORDER BY projects DESC LIMIT 5', does: 'sort and limit' },
  { example: "SELECT COUNT(*) FROM certifications WHERE date >= '2026'", does: 'count rows' },
];

function tokenize(src) {
  const re = /\s*(>=|<=|!=|<>|=|>|<|,|\(|\)|\*|;|'(?:[^']|'')*'|"(?:[^"])*"|[A-Za-z_][A-Za-z0-9_.]*|-?\d+(?:\.\d+)?)\s*/gy;
  const out = [];
  let m;
  let last = 0;
  while ((m = re.exec(src))) {
    out.push(m[1]);
    last = re.lastIndex;
    if (last >= src.length) break;
  }
  if (src.slice(last).trim()) throw new Error(`Can't read the query near "${src.slice(last).trim().slice(0, 20)}".`);
  return out.filter((t) => t !== ';');
}

const isStr = (t) => /^['"]/.test(t);
const unq = (t) => t.slice(1, -1).replace(/''/g, "'");
const up = (t) => (t || '').toUpperCase();

function literal(t) {
  if (t === undefined) throw new Error('A condition is missing its value.');
  if (isStr(t)) return unq(t);
  if (/^-?\d/.test(t)) return Number(t);
  throw new Error(`Put text values in quotes, like '${t}'.`);
}

function compare(a, op, b) {
  if (op === 'LIKE') {
    const rx = new RegExp('^' + String(b).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
    return rx.test(String(a));
  }
  const num = typeof a === 'number' && typeof b === 'number';
  const x = num ? a : String(a).toLowerCase();
  const y = num ? b : String(b).toLowerCase();
  switch (op) {
    case '=': return x === y;
    case '!=': case '<>': return x !== y;
    case '>': return x > y;
    case '<': return x < y;
    case '>=': return x >= y;
    case '<=': return x <= y;
    default: throw new Error(`Unknown operator ${op}.`);
  }
}

export function runSQL(src, tables) {
  const t0 = performance.now();
  const toks = tokenize(src.trim());
  if (!toks.length) throw new Error('Type a query, or try HELP.');
  let i = 0;
  const peek = () => toks[i];
  const next = () => toks[i++];
  const expect = (kw) => {
    if (up(peek()) !== kw) throw new Error(`Expected ${kw}${peek() ? ` but found "${peek()}"` : ''}.`);
    i++;
  };
  const done = (columns, rows, extra = {}) => ({ columns, rows, ms: performance.now() - t0, ...extra });

  const head = up(next());
  if (head === 'HELP') return done(['example', 'does'], HELP);
  if (head === 'SHOW') {
    expect('TABLES');
    return done(['table', 'rows'], Object.entries(tables).map(([table, r]) => ({ table, rows: r.length })));
  }
  if (head === 'DESCRIBE' || head === 'DESC') {
    const name = (next() || '').toLowerCase();
    const tbl = tables[name];
    if (!tbl) throw new Error(`No table called "${name}". Run SHOW TABLES.`);
    return done(['column', 'type'], Object.keys(tbl[0]).filter((k) => !k.startsWith('_'))
      .map((k) => ({ column: k, type: typeof tbl[0][k] === 'number' ? 'number' : 'text' })));
  }
  if (head !== 'SELECT') throw new Error('Queries start with SELECT, SHOW TABLES, DESCRIBE or HELP.');

  // columns
  let count = false;
  let cols = [];
  if (up(peek()) === 'COUNT') {
    next(); expect('('); expect('*'); expect(')');
    count = true;
  } else if (peek() === '*') {
    next(); cols = ['*'];
  } else {
    do { cols.push(next().toLowerCase()); } while (peek() === ',' && next());
  }

  expect('FROM');
  const name = (next() || '').toLowerCase();
  const tbl = tables[name];
  if (!tbl) throw new Error(`No table called "${name}". Run SHOW TABLES.`);
  const known = Object.keys(tbl[0]);
  const check = (c) => { if (!known.includes(c)) throw new Error(`"${name}" has no column "${c}". Try DESCRIBE ${name}.`); };
  if (cols[0] !== '*') cols.forEach(check);

  let rows = tbl;
  if (up(peek()) === 'WHERE') {
    next();
    const groups = [[]]; // OR of ANDs
    while (true) {
      const col = (next() || '').toLowerCase();
      check(col);
      let op = up(next());
      if (op === 'NOT' && up(peek()) === 'LIKE') { next(); op = 'NOT LIKE'; }
      const val = literal(next());
      groups[groups.length - 1].push({ col, op, val });
      const j = up(peek());
      if (j === 'AND') { next(); continue; }
      if (j === 'OR') { next(); groups.push([]); continue; }
      break;
    }
    rows = rows.filter((r) => groups.some((g) => g.every(({ col, op, val }) =>
      op === 'NOT LIKE' ? !compare(r[col], 'LIKE', val) : compare(r[col], op, val))));
  }

  if (up(peek()) === 'ORDER') {
    next(); expect('BY');
    const col = (next() || '').toLowerCase();
    check(col);
    const dir = ['ASC', 'DESC'].includes(up(peek())) ? up(next()) : 'ASC';
    rows = [...rows].sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'DESC' ? -1 : 1));
  }

  if (up(peek()) === 'LIMIT') {
    next();
    const n = Number(next());
    if (!Number.isInteger(n) || n < 0) throw new Error('LIMIT needs a whole number.');
    rows = rows.slice(0, n);
  }
  if (i < toks.length) throw new Error(`Didn't expect "${toks[i]}" there.`);

  if (count) return done(['count'], [{ count: rows.length }]);
  const columns = cols[0] === '*' ? known.filter((k) => !k.startsWith('_')) : cols;
  return done(columns, rows, { table: name });
}
