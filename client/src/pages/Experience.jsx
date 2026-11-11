import { CertTable, Extracurriculars, Loading, OrgLogo, PageHead, Publications, Timeline } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';

export default function ExperiencePage() {
  useTitle('Experience');
  const { content } = useContent();
  return (
    <section className="page">
      <PageHead
        title="Experience"
        intro="Two university-incubated analyst internships, ongoing freelance AI data work, Amazon ML Summer School and a published paper."
        query="SELECT role, org, start, end, mode FROM experience"
      />
      {!content ? <Loading what="experience" /> : (
        <>
          <Timeline experience={content.experience} />
          <div className="subsection">
            <PageHead title="Extracurriculars" intro="Campus teams, a startup and open source, alongside my studies." query="SELECT * FROM extracurriculars" />
            <Extracurriculars items={content.extracurriculars || []} />
          </div>
          <div className="subsection">
            <PageHead title="Publications & achievements" intro="A peer-reviewed paper with a seven-author research team, plus hackathon finals and selections." query="SELECT * FROM achievements ORDER BY year DESC" />
            <Publications publications={content.publications || []} achievements={content.achievements || []} />
          </div>
          <div className="subsection">
            <PageHead title="Certifications" intro="Courses and job simulations, newest first." query="SELECT * FROM certifications ORDER BY date DESC" />
            <CertTable certifications={content.certifications} />
          </div>
          <div className="subsection edu">
            <h2>Education</h2>
            <div className="edu-row">
              <div className="edu-main">
                <OrgLogo name="bennett" label="Bennett University" size={48} />
                <div><b>B.Tech, Computer Science Engineering</b><span>Bennett University, Greater Noida</span></div>
              </div>
              <span className="num">2024 – 2028</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
