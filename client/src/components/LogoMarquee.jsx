const ORGS = [
  ['amazon', 'Amazon ML Summer School'],
  ['uber', 'Uber AI Solutions'],
  ['google', 'Google'],
  ['ibm', 'IBM'],
  ['bcg', 'BCG X'],
  ['mckinsey', 'McKinsey.org'],
  ['british-airways', 'British Airways'],
  ['springer', 'Springer Nature'],
  ['gago', 'Gago Mobility'],
  ['hackerrank', 'HackerRank'],
  ['iitg-ca', 'IIT Guwahati'],
  ['technex', 'Technex, IIT BHU'],
  ['bennett', 'Bennett University'],
  ['coursera', 'Coursera'],
];

// Infinite strip of organisations: two copies side by side, the second hidden from screen readers.
export default function LogoMarquee() {
  const row = (hidden) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {ORGS.map(([logo, name]) => (
        <li key={logo}>
          <img src={`${import.meta.env.BASE_URL}logos/${logo}.webp`} alt="" width="36" height="36" loading="lazy" />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section data-reveal="fade" className="marquee" aria-label="Organisations I've worked, learned or competed with">
      <p className="marquee-title">Worked, learned and competed with</p>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
