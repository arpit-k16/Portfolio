import { Suspense, lazy, useMemo } from 'react';
import { Loading, PageHead, SkillMatrix } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';

const SkillBars3D = lazy(() => import('../three/SkillBars3D.jsx'));

export default function SkillsPage() {
  useTitle('Skills');
  const { content } = useContent();
  const groups = useMemo(() => {
    if (!content) return [];
    const g = {};
    for (const s of content.skills) {
      const n = content.projects.filter((p) => p.stack.includes(s.name)).length;
      (g[s.group] ||= []).push({ ...s, n });
    }
    return Object.entries(g);
  }, [content]);
  const bars = useMemo(() => (content ? content.skills
    .map((s) => ({ name: s.name, group: s.group, n: content.projects.filter((p) => p.stack.includes(s.name)).length }))
    .filter((s) => s.n > 0)
    .sort((a, b) => b.n - a.n) : []), [content]);

  return (
    <section className="page">
      <PageHead
        title="Skills, by evidence"
        intro="Every bar is a count of real projects that use the skill. No self-rated progress bars. Drag the chart to rotate it, and see the matrix below for which project uses what."
        query="SELECT name, category, projects FROM skills ORDER BY projects DESC"
      />
      {!content ? <Loading what="skills" /> : (
        <>
          <Suspense fallback={<div className="bars3d-wrap"><div className="bars3d" /></div>}>
            <SkillBars3D data={bars} />
          </Suspense>
          <h2 className="h2 matrix-h">Which project uses what</h2>
          <SkillMatrix skills={content.skills} projects={content.projects} />
          <div className="groups" data-reveal-stagger>
            {groups.map(([name, list]) => (
              <div key={name}>
                <h2>{name}</h2>
                <ul>
                  {list.map((s) => <li key={s.name}>{s.name}<span>{s.n ? `${s.n} ${s.n === 1 ? 'project' : 'projects'}` : 'coursework'}</span></li>)}
                </ul>
              </div>
            ))}
            <div>
              <h2>Certified in</h2>
              <ul>
                <li>SQL<span>HackerRank, Intermediate</span></li>
                <li>Google Data Analytics<span>Professional certificate</span></li>
                <li>Generative AI for analysts<span>IBM</span></li>
                <li>Alteryx<span>Workflow automation</span></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
