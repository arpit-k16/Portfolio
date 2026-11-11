// Single source of truth for portfolio content.
// Edit this file, then run `npm run seed` to push changes into MongoDB.

export const profile = {
  name: 'Arpit Kumar',
  nameHi: 'अर्पित कुमार',
  role: 'Data Analyst · ML Enthusiast',
  tagline:
    'I turn messy data into decisions with SQL, Python and Power BI, and I build the ML models and apps that sit on top of it.',
  about:
    'B.Tech CSE at Bennett University, class of 2028, based in Ghaziabad. Amazon ML Summer School 2026 mentee. Looking for Data Analyst, Business Analyst and Data Science internships, remote or on-site, anywhere.',
  location: 'Ghaziabad, India',
  email: 'arpitarnav2005@gmail.com',
  links: {
    github: 'https://github.com/arpit-k16',
    linkedin: 'https://www.linkedin.com/in/arpit-kumar-261888315/',
  },
  openTo: ['Data Analyst', 'Business Analyst', 'Data Science'],
};

export const projects = [
  {
    slug: 'amazon-ecommerce',
    title: 'Amazon e-commerce business performance',
    year: 2026,
    category: 'BI',
    featured: true,
    summary:
      'Cleaned and modelled 112,992 orders from 113K customers and 44 products (2015–2020) with Power Query, a one-to-many data model and 20+ DAX measures, then built a 3-page Power BI dashboard with drill-through and a dynamic metric selector. SQL window functions (LAG, 3-month rolling averages) and a weighted customer score surfaced seasonality (January 2020 up 149% month over month), top customers and category growth, with Phones & Tablets at 44% of revenue. Flagged a 27% return rate and a 2.73/5 average rating as the main risks, and presented an 18-slide business review with prioritised actions: a loyalty tier for high-value customers, quality checks on the most-returned products, and February promotions.',
    highlight: '112,992 orders',
    stack: ['SQL', 'Power BI', 'DAX', 'Excel'],
    links: { code: 'https://github.com/arpit-k16/Amazon-E-Commerce-Business-Performance-Analysis' },
  },
  {
    slug: 'aerotwin',
    title: 'AeroTwin: aircraft engine life prediction',
    year: 2026,
    category: 'ML',
    featured: true,
    summary:
      "Predicts the remaining useful life of turbofan engines from NASA's C-MAPSS sensor data with XGBoost, with a Streamlit dashboard for maintenance planners.",
    highlight: 'NASA C-MAPSS',
    stack: ['Python', 'Pandas', 'XGBoost', 'Streamlit'],
    links: { code: 'https://github.com/arpit-k16/aerotwin-engine-rul-prediction' },
  },
  {
    slug: 'airline-loyalty',
    title: 'Airline loyalty and retention',
    year: 2026,
    category: 'ML',
    summary:
      'Customer segmentation and churn prediction with Logistic Regression, Random Forest and XGBoost, identifying 165 high-risk customers and $776K of customer lifetime value at risk. A Power BI dashboard covering 48M+ loyalty points, 31K flights and 12 customer segments surfaces the churn drivers behind a targeted retention strategy.',
    highlight: '$776K lifetime value at risk',
    stack: ['SQL', 'Python', 'Scikit-learn', 'XGBoost', 'Power BI', 'Alteryx'],
    links: { code: 'https://github.com/arpit-k16/Optimizing-Airline-Loyalty-Retention-Using-Customer-Analytics-ML' },
  },
  {
    slug: 'ipl-rcb',
    title: 'IPL auction strategy for RCB',
    year: 2026,
    category: 'Analytics',
    summary:
      'Ball-by-ball IPL data (2008–2016) queried with CTEs and window functions (LAG, RANK) to shape a 2017 auction plan: player value, venue and toss effects, team trends.',
    highlight: '9 IPL seasons',
    stack: ['SQL'],
    links: { code: 'https://github.com/arpit-k16/IPL-Sports-Analytics-Auction-Strategy' },
  },
  {
    slug: 'bheedmitra',
    title: 'BheedMitra: Delhi Metro crowd forecasting',
    year: 2025,
    category: 'ML',
    summary:
      'Predicts crowd levels across a metro network from time, station type, weather and events, using a synthetic dataset modelled on Delhi Metro operations. An interactive dashboard shows where and when congestion builds. Built with Lakshay.',
    highlight: 'Time × station × weather',
    stack: ['Python', 'Pandas', 'XGBoost', 'Streamlit'],
    links: { code: 'https://github.com/arpit-k16' },
  },
  {
    slug: 'british-airways',
    title: 'British Airways: lounge demand and booking prediction',
    year: 2025,
    category: 'ML',
    summary:
      'A lookup table estimating Heathrow T3 lounge eligibility by flight time, route and region, plus a Random Forest model on 50,000 bookings that shows what drives a completed holiday booking.',
    highlight: '50,000 bookings',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Excel'],
    links: {},
  },
  {
    slug: 'inventory-sql',
    title: 'Fixing inventory inefficiencies with SQL',
    year: 2025,
    category: 'Analytics',
    summary:
      'Summer project with the Consulting & Analytics Club, IIT Guwahati: 100K+ inventory records analysed to cut stockouts and overstock, with a KPI dashboard and forecasting logic. Built with Shikhar and Lakshay.',
    highlight: '100K+ records',
    stack: ['SQL', 'Python', 'Power BI', 'Streamlit'],
    links: {
      live: 'https://summer-project-2025-ca-iit-guwahati-cjyzxcfoczvcuhjh.streamlit.app',
      code: 'https://github.com/arpit-k16/Summer-Analytics-Project-2025-CA-IIT-GUWAHATI',
    },
  },
];

export const experience = [
  {
    role: 'Mentee',
    org: 'Amazon ML Summer School',
    logo: 'amazon',
    start: '2026-07',
    end: '2026-08',
    mode: 'Program',
    summary:
      'Selected for Amazon’s intensive ML programme: supervised and unsupervised learning, NLP and transformers, RL and RLHF, causal inference, generative AI, LLMs and agentic AI, taught by Amazon scientists.',
  },
  {
    role: 'Data Resource Intern',
    org: 'Academic Hub',
    start: '2026-02',
    end: '2026-05',
    mode: 'Remote',
    tag: 'University-incubated',
    summary:
      'Set up structured data collection, cleaned and validated datasets across platforms, and turned the results into reports that informed decisions.',
  },
  {
    role: 'Data Analyst Intern',
    org: 'Gago Mobility',
    logo: 'gago',
    start: '2025-09',
    end: '2025-12',
    mode: 'Remote',
    tag: 'University-incubated',
    summary: 'Analysed mobility data to find demand hotspots and reported on them to support vehicle operations.',
  },
  {
    role: 'Data Labelling (freelance)',
    org: 'Uber AI Solutions',
    logo: 'uber',
    start: '2025-04',
    end: null,
    mode: 'Freelance',
    summary: 'Annotating and reviewing text, image and video data used to train and evaluate AI models.',
  },
];

export const extracurriculars = [
  {
    role: 'Project Management, Junior Core',
    org: 'Enactus Bennett University',
    logo: 'enactus',
    start: '2025-01',
    end: '2025-08',
    mode: 'Campus',
    summary: 'Planned and tracked social-enterprise projects with the core team.',
  },
  {
    role: 'Tech Team, Junior Core',
    org: 'Centre for Law, Technology and Innovation',
    logo: 'bennett',
    start: '2025-01',
    end: '2025-07',
    mode: 'Campus',
    summary: 'Supported the centre’s tech work at Bennett University.',
  },
  {
    role: 'Frontend Designer & Marketing',
    org: 'zarva',
    logo: 'zarva',
    start: '2025-01',
    end: '2025-07',
    mode: 'Startup',
    summary: 'Designed web pages and handled marketing.',
  },
  {
    role: 'Open Source Contributor',
    org: 'GirlScript Summer of Code',
    logo: 'gssoc',
    start: '2024-11',
    end: '2024-11',
    mode: 'Open source',
    summary: 'Contributed to open-source projects during GSSoC ’24.',
  },
];

export const certifications = [
  { name: 'Professional Certification in Data Analytics', issuer: 'Newton School', date: '2026', logo: 'newton-school' },
  { name: 'SQL (Intermediate)', issuer: 'HackerRank', date: '2026-09', logo: 'hackerrank' },
  { name: 'SQL (Basic)', issuer: 'HackerRank', date: '2026-09', logo: 'hackerrank' },
  { name: 'Forward Program', issuer: 'McKinsey.org', date: '2026-07', logo: 'mckinsey' },
  { name: 'Data for Decision Makers job simulation', issuer: 'BCG X', date: '2026-06', logo: 'bcg' },
  { name: 'Google Data Analytics Professional', issuer: 'Google', date: '2026-05', logo: 'google' },
  { name: 'Generative AI for Data Analysts', issuer: 'IBM', date: '2026-05', logo: 'ibm' },
  { name: 'Alteryx Mastery: Analytics & Workflow Automation', issuer: 'Coursera', date: '2026-05', logo: 'coursera' },
  { name: 'Python (Basic)', issuer: 'HackerRank', date: '2025-07', logo: 'hackerrank' },
  { name: 'Data Science job simulation', issuer: 'British Airways', date: '2025-07', logo: 'british-airways' },
  { name: 'Project completion certificate', issuer: 'Consulting & Analytics Club, IIT Guwahati', date: '2025-06', logo: 'iitg-ca' },
];

export const publications = [
  {
    title: 'Multi-model Pipeline for Trait-Based Reasoning and Synthetic Memory in Neuro-Symbolic Mind Cloning Systems',
    authors: 'S. Bhandari, D. K. Bharti, A. Kumar, L. Bansal, V. Sharma, S. Shukla, A. Koul',
    venue: 'Proceedings of ICAIN 2025, Lecture Notes in Networks and Systems, vol. 1930, Springer, 2026, pp. 326–339',
    note: 'Presented at the International Conference on Artificial Intelligence and Networks (ICAIN 2025) at BITS Pilani, Dubai.',
    year: 2026,
    url: 'https://doi.org/10.1007/978-3-032-23317-2_26',
    doi: '10.1007/978-3-032-23317-2_26',
    logo: 'springer',
  },
];

export const achievements = [
  { title: 'Finalist, India Innovates 2026', org: 'MCD Delhi', year: 2026, type: 'Hackathon', logo: 'mcd' },
  { title: 'Finalist, Stellar Analytics Hackathon', org: 'Technex, IIT BHU', year: 2026, type: 'Hackathon', logo: 'technex' },
  { title: 'Selected, Amazon ML Summer School 2026', org: 'Amazon', year: 2026, type: 'Program', logo: 'amazon' },
  { title: 'SQL Gold Badge', org: 'HackerRank', year: 2026, type: 'Badge', logo: 'hackerrank' },
];

export const skills = [
  { name: 'SQL', group: 'Query & wrangle' },
  { name: 'Python', group: 'Query & wrangle' },
  { name: 'Pandas', group: 'Query & wrangle' },
  { name: 'Excel', group: 'Query & wrangle' },
  { name: 'Alteryx', group: 'Query & wrangle' },
  { name: 'Scikit-learn', group: 'Model' },
  { name: 'XGBoost', group: 'Model' },
  { name: 'Power BI', group: 'Report' },
  { name: 'DAX', group: 'Report' },
  { name: 'Streamlit', group: 'Report' },
];

// LinkedIn posts shown on the Posts page (seed). Add new ones from /admin on the live site.
export const linkedinPosts = [
  'urn:li:activity:7526139811561259008',
  'urn:li:activity:7513866673100111872',
  'urn:li:activity:7507154017278447616',
  'urn:li:activity:7506399432221978626',
  'urn:li:activity:7504395890959454208',
  'urn:li:activity:7503394620161282048',
  'urn:li:activity:7495521248379084800',
  'urn:li:activity:7490696456832450561',
  'urn:li:activity:7489723469618880512',
  'urn:li:activity:7488545476435177473',
  'urn:li:activity:7487825369572515840',
  'urn:li:activity:7487050054172712960',
  'urn:li:activity:7485001483885780992',
  'urn:li:activity:7484292443509637120',
  'urn:li:activity:7482084010127720449',
  'urn:li:activity:7481759050829824001',
  'urn:li:activity:7479149557746909184',
];
