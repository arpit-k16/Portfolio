import { Loading, PageHead, ProjectGrid } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';

export default function ProjectsPage() {
  useTitle('Projects');
  const { content } = useContent();
  return (
    <section className="page">
      <PageHead
        title="Projects"
        intro="Most start with a business question and end with a dashboard or a model someone can use. Open any project for the full write-up."
        query="SELECT * FROM projects ORDER BY year DESC"
      />
      {content ? <ProjectGrid projects={content.projects} /> : <Loading what="projects" />}
    </section>
  );
}
