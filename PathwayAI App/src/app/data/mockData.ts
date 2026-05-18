export const mockJobs = [
  {
    id: '1',
    title: 'Data Analyst',
    company: 'HSBC',
    district: 'Central',
    salaryMin: 35000,
    salaryMax: 50000,
    matchScore: 82,
    saved: false,
    responsibilities: 'Analyze customer data, create reports, support business decisions',
    requirements: 'Bachelor degree, SQL, Python, 1-2 years experience',
    skills: ['SQL', 'Python', 'Data Visualization', 'Excel', 'Tableau', 'Statistics'],
    skillsMatch: { have: 4, total: 6 },
    experienceGap: 'Most hires have 1-2 years of SQL experience',
  },
  {
    id: '2',
    title: 'Business Analyst',
    company: 'Standard Chartered',
    district: 'Wan Chai',
    salaryMin: 40000,
    salaryMax: 55000,
    matchScore: 75,
    saved: true,
    responsibilities: 'Gather requirements, document processes, work with stakeholders',
    requirements: 'Bachelor degree, Business analysis, Communication skills',
    skills: ['Requirements Analysis', 'Documentation', 'Stakeholder Management', 'SQL'],
    skillsMatch: { have: 3, total: 4 },
    experienceGap: null,
  },
  {
    id: '3',
    title: 'Cybersecurity Analyst',
    company: 'Bank of China',
    district: 'Central & Western',
    salaryMin: 45000,
    salaryMax: 65000,
    matchScore: 68,
    saved: false,
    responsibilities: 'Monitor security systems, respond to incidents, conduct assessments',
    requirements: 'IT degree, Security certifications preferred, 2+ years experience',
    skills: ['Network Security', 'SIEM', 'Incident Response', 'Firewalls', 'Linux'],
    skillsMatch: { have: 2, total: 5 },
    experienceGap: 'Most hires have security certifications',
  },
];

export const mockSkills = [
  {
    id: '1',
    name: 'Data Analysis',
    level: 60,
    gap: 'high',
    impact: 'high',
    description: 'High impact gap for your target roles',
    actions: [
      { type: 'module', title: 'COMP3270 - Data Analytics', provider: 'Your University' },
      { type: 'course', title: 'Data Analysis with Python', provider: 'Coursera' },
      { type: 'internship', title: 'Data Analyst Intern', provider: 'Various Companies' },
    ],
  },
  {
    id: '2',
    name: 'SQL',
    level: 75,
    gap: 'medium',
    impact: 'high',
    description: 'Important for database roles',
    actions: [
      { type: 'module', title: 'COMP3278 - Database Systems', provider: 'Your University' },
      { type: 'course', title: 'SQL for Data Science', provider: 'Udemy' },
    ],
  },
  {
    id: '3',
    name: 'Communication',
    level: 85,
    gap: 'low',
    impact: 'medium',
    description: 'Strong foundation already',
    actions: [],
  },
];

export const mockProgrammes = [
  {
    id: '1',
    name: 'HSBC Graduate Programme',
    logo: '🏦',
    deadline: '2026-06-30',
    salary: 'HK$35K-45K',
    successRate: 85,
    sector: 'Banking',
    location: 'Hong Kong',
    studentsJoined: 18,
    description: 'Structured rotational programme across different banking divisions',
  },
  {
    id: '2',
    name: 'PwC Audit Associate',
    logo: '📊',
    deadline: '2026-07-15',
    salary: 'HK$30K-40K',
    successRate: 78,
    sector: 'Professional Services',
    location: 'Hong Kong',
    studentsJoined: 24,
    description: 'Fast-track to professional qualification and career growth',
  },
];

export const mockAlumniPaths = [
  {
    id: '1',
    name: 'Audit to Strategy',
    typicalRoles: ['Audit Associate', 'Senior Auditor', 'Strategy Consultant'],
    timeToTransition: '2-3 years',
    description: 'Most alumni take 2-3 years to move into this role',
  },
  {
    id: '2',
    name: 'Tech Analyst to Product Manager',
    typicalRoles: ['Business Analyst', 'Senior Analyst', 'Product Manager'],
    timeToTransition: '3-4 years',
    description: 'Common path for technical graduates',
  },
];

export const mockCredentials = [
  {
    id: '1',
    category: 'Degree & Transcript',
    name: 'Bachelor of Computer Science',
    issuer: 'Your University',
    status: 'verified',
    date: '2025-06-01',
  },
  {
    id: '2',
    category: 'HEAR',
    name: 'Higher Education Achievement Report',
    issuer: 'Your University',
    status: 'pending',
    date: null,
  },
  {
    id: '3',
    category: 'Certificates',
    name: 'Python for Data Science',
    issuer: 'Coursera',
    status: 'verified',
    date: '2025-03-15',
  },
];

export const mockAnalytics = {
  applications: 14,
  interviews: 3,
  offers: 0,
  conversionRate: 21.4,
  cohortComparison: 'above',
  matchScoreTrend: [65, 68, 72, 75, 78, 82],
};

export const mockMarketSignals = [
  {
    id: '1',
    title: 'FinTech hiring up 12%',
    description: 'Growing demand in financial technology sector',
    trend: 'up',
  },
  {
    id: '2',
    title: 'Hot now: Cybersecurity roles in Central & Western',
    description: 'High demand for security professionals',
    trend: 'hot',
    salaryRange: 'HK$45K-65K',
  },
];
