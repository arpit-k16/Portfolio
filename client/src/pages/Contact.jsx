import { ContactForm } from '../components/Sections.jsx';
import { useContent, useTitle } from '../lib/content.jsx';

export default function ContactPage() {
  useTitle('Contact');
  const { content } = useContent();
  const email = content?.profile.email || 'arpitarnav2005@gmail.com';
  return (
    <section className="page contact">
      <div>
        <h1>Let’s work on your data</h1>
        <p>I’m looking for Data Analyst, Business Analyst and Data Science internships, remote or on-site, anywhere. Tell me about the role or the problem and I’ll get back to you.</p>
        <ul className="direct">
          <li><span>Email</span><a href={`mailto:${email}`}>{email}</a></li>
          <li><span>LinkedIn</span><a href="https://www.linkedin.com/in/arpit-kumar-261888315/" target="_blank" rel="noopener">arpit-kumar-261888315</a></li>
          <li><span>GitHub</span><a href="https://github.com/arpit-k16" target="_blank" rel="noopener">arpit-k16</a></li>
          <li><span>Based in</span>Ghaziabad, India (IST, UTC+5:30)</li>
        </ul>
      </div>
      <ContactForm />
    </section>
  );
}
