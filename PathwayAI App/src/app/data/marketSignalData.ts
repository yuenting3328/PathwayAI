export type SalaryTier = { range: string; pct: number; label: string };

export type MarketSignalCard = {
  id: string;
  tab: 'sector' | 'role' | 'district';
  badge: string;
  badgeVariant: 'hot' | 'growing' | 'emerging' | 'stable' | 'rising' | 'balanced' | 'high-demand';
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  accentVariant: 'rose' | 'emerald' | 'purple' | 'sky' | 'indigo' | 'amber';
  iconName: 'Zap' | 'TrendingUp' | 'Sparkles' | 'Star' | 'Target' | 'Flame' | 'Building2';
  chartColor: string;
  trendData: Array<{ month: string; value: number }>;
  salary: { low: SalaryTier; mid: SalaryTier; high: SalaryTier };
  details: {
    openings: number;
    competition: 'Low' | 'Moderate' | 'Competitive' | 'Very Competitive';
    highlight: string;
    topCompanies: string[];
    keySkills: string[];
    insight: string;
  };
};

export const allMarketSignals: MarketSignalCard[] = [
  // ── By District ──────────────────────────────────────────────────────────
  {
    id: 'd1',
    tab: 'district',
    badge: 'HOT NOW 🔥',
    badgeVariant: 'hot',
    title: 'Cybersecurity Roles in Central & Western',
    metric: '+18% vs avg',
    metricLabel: 'Salary premium',
    description: 'Highest-paying district for security roles — finance cluster drives demand.',
    accentVariant: 'rose',
    iconName: 'Flame',
    chartColor: '#F43F5E',
    trendData: [
      { month: 'Nov', value: 42 }, { month: 'Dec', value: 48 },
      { month: 'Jan', value: 55 }, { month: 'Feb', value: 62 },
      { month: 'Mar', value: 70 }, { month: 'Apr', value: 79 },
    ],
    salary: {
      low:  { range: 'HKD 35K–45K', pct: 18, label: 'Entry' },
      mid:  { range: 'HKD 45K–65K', pct: 54, label: 'Mid-level' },
      high: { range: 'HKD 65K–90K', pct: 28, label: 'Senior' },
    },
    details: {
      openings: 64, competition: 'Low',
      highlight: 'Premium pay — 18% above HK avg',
      topCompanies: ['HSBC', 'Bank of China', 'AIA', 'Standard Chartered'],
      keySkills: ['Network Security', 'SIEM', 'Incident Response', 'ISO 27001'],
      insight: 'Central & Western hosts the highest concentration of international financial institutions in HK, creating sustained demand for security professionals who can protect high-value banking infrastructure.',
    },
  },
  {
    id: 'd2',
    tab: 'district',
    badge: 'RISING ⚡',
    badgeVariant: 'rising',
    title: 'Tech Roles in Quarry Bay',
    metric: '+10% vs avg',
    metricLabel: 'Pay vs HK median',
    description: 'IT company cluster makes Quarry Bay a growing tech employer hub.',
    accentVariant: 'amber',
    iconName: 'Building2',
    chartColor: '#FBBF24',
    trendData: [
      { month: 'Nov', value: 30 }, { month: 'Dec', value: 34 },
      { month: 'Jan', value: 40 }, { month: 'Feb', value: 46 },
      { month: 'Mar', value: 52 }, { month: 'Apr', value: 58 },
    ],
    salary: {
      low:  { range: 'HKD 25K–35K', pct: 28, label: 'Entry' },
      mid:  { range: 'HKD 35K–52K', pct: 52, label: 'Mid-level' },
      high: { range: 'HKD 52K–75K', pct: 20, label: 'Senior' },
    },
    details: {
      openings: 78, competition: 'Moderate',
      highlight: 'Rising tech employer district',
      topCompanies: ['DBS', 'CLP', 'HKT', 'Hutchison'],
      keySkills: ['Cloud Computing', 'DevOps', 'Python', 'Agile'],
      insight: 'Quarry Bay is emerging as the east island tech corridor, with legacy telcos and utilities rapidly building digital teams alongside newer tech firms.',
    },
  },
  {
    id: 'd3',
    tab: 'district',
    badge: 'BALANCED ✅',
    badgeVariant: 'balanced',
    title: 'Data Roles in Kowloon East',
    metric: 'HKD 30K–50K',
    metricLabel: 'Typical salary range',
    description: 'Good balance of pay and opportunity — lower competition than Central.',
    accentVariant: 'emerald',
    iconName: 'Target',
    chartColor: '#34D399',
    trendData: [
      { month: 'Nov', value: 40 }, { month: 'Dec', value: 44 },
      { month: 'Jan', value: 48 }, { month: 'Feb', value: 52 },
      { month: 'Mar', value: 55 }, { month: 'Apr', value: 60 },
    ],
    salary: {
      low:  { range: 'HKD 22K–30K', pct: 30, label: 'Entry' },
      mid:  { range: 'HKD 30K–50K', pct: 52, label: 'Mid-level' },
      high: { range: 'HKD 50K–70K', pct: 18, label: 'Senior' },
    },
    details: {
      openings: 105, competition: 'Moderate',
      highlight: 'Best pay-to-competition ratio',
      topCompanies: ['Manulife', 'Sun Life', 'PCCW', 'Towngas'],
      keySkills: ['SQL', 'Tableau', 'Python', 'Excel', 'Statistics'],
      insight: 'Kowloon East (KCBD) is the government-backed CBD2 project drawing insurance, telecoms, and professional services firms — creating steady entry-level to mid-senior data roles.',
    },
  },
  {
    id: 'd4',
    tab: 'district',
    badge: 'GROWING 📈',
    badgeVariant: 'growing',
    title: 'Startup Roles in Wan Chai',
    metric: '+15% YoY',
    metricLabel: 'Role growth rate',
    description: 'Startup-friendly district with flexible roles and equity upside.',
    accentVariant: 'sky',
    iconName: 'TrendingUp',
    chartColor: '#0EA5E9',
    trendData: [
      { month: 'Nov', value: 28 }, { month: 'Dec', value: 32 },
      { month: 'Jan', value: 36 }, { month: 'Feb', value: 42 },
      { month: 'Mar', value: 48 }, { month: 'Apr', value: 55 },
    ],
    salary: {
      low:  { range: 'HKD 20K–28K', pct: 33, label: 'Entry' },
      mid:  { range: 'HKD 28K–45K', pct: 50, label: 'Mid-level' },
      high: { range: 'HKD 45K–75K', pct: 17, label: 'Senior' },
    },
    details: {
      openings: 55, competition: 'Low',
      highlight: '15% more roles vs last year',
      topCompanies: ['Airwallex', 'WeLab', 'Bowtie', 'ZA Bank'],
      keySkills: ['Product Thinking', 'React', 'Growth Marketing', 'Data Analysis'],
      insight: 'Wan Chai\'s creative-tech scene is attracting Series B+ startups who value proximity to Central while offering slightly lower overheads — great for early-career candidates who want fast progression.',
    },
  },

  // ── By Role ──────────────────────────────────────────────────────────────
  {
    id: 'r1',
    tab: 'role',
    badge: 'HOT NOW 🔥',
    badgeVariant: 'hot',
    title: 'Cybersecurity Analyst',
    metric: 'HKD 35K–55K',
    metricLabel: 'Market salary range',
    description: 'Demand far outpacing supply — fewer qualified CS grads applying.',
    accentVariant: 'rose',
    iconName: 'Zap',
    chartColor: '#F43F5E',
    trendData: [
      { month: 'Nov', value: 34 }, { month: 'Dec', value: 40 },
      { month: 'Jan', value: 48 }, { month: 'Feb', value: 56 },
      { month: 'Mar', value: 62 }, { month: 'Apr', value: 71 },
    ],
    salary: {
      low:  { range: 'HKD 28K–35K', pct: 20, label: 'Entry' },
      mid:  { range: 'HKD 35K–55K', pct: 58, label: 'Mid-level' },
      high: { range: 'HKD 55K–80K', pct: 22, label: 'Senior' },
    },
    details: {
      openings: 89, competition: 'Low',
      highlight: 'Only 1 qualified candidate per 3 roles',
      topCompanies: ['HSBC', 'Bank of China', 'Standard Chartered', 'Hang Seng'],
      keySkills: ['SIEM', 'Penetration Testing', 'ISO 27001', 'Cloud Security', 'Python'],
      insight: 'Hong Kong\'s financial sector faces mounting regulatory requirements for cybersecurity, pushing demand up while the local talent pool has not kept pace with CS enrolment growth.',
    },
  },
  {
    id: 'r2',
    tab: 'role',
    badge: 'HIGH DEMAND 💼',
    badgeVariant: 'high-demand',
    title: 'Data Analyst',
    metric: '142 openings',
    metricLabel: 'Active HK postings',
    description: 'Consistently the top hire across banking, tech, and consulting.',
    accentVariant: 'indigo',
    iconName: 'Target',
    chartColor: '#6366F1',
    trendData: [
      { month: 'Nov', value: 98 }, { month: 'Dec', value: 108 },
      { month: 'Jan', value: 120 }, { month: 'Feb', value: 128 },
      { month: 'Mar', value: 136 }, { month: 'Apr', value: 142 },
    ],
    salary: {
      low:  { range: 'HKD 22K–30K', pct: 25, label: 'Entry' },
      mid:  { range: 'HKD 30K–48K', pct: 55, label: 'Mid-level' },
      high: { range: 'HKD 48K–70K', pct: 20, label: 'Senior' },
    },
    details: {
      openings: 142, competition: 'Moderate',
      highlight: 'Most posted role in HK tech',
      topCompanies: ['HSBC', 'PwC', 'Manulife', 'Deloitte', 'DBS'],
      keySkills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics', 'Power BI'],
      insight: 'Every major industry vertical in HK — banking, consulting, insurance, retail — is building dedicated data teams, making Data Analyst the most ubiquitous graduate entry point.',
    },
  },
  {
    id: 'r3',
    tab: 'role',
    badge: 'GROWING 📈',
    badgeVariant: 'growing',
    title: 'Software Developer',
    metric: '200+ openings',
    metricLabel: 'Live roles across HK',
    description: 'Full-stack and backend roles leading growth in tech and fintech.',
    accentVariant: 'emerald',
    iconName: 'TrendingUp',
    chartColor: '#34D399',
    trendData: [
      { month: 'Nov', value: 155 }, { month: 'Dec', value: 165 },
      { month: 'Jan', value: 175 }, { month: 'Feb', value: 188 },
      { month: 'Mar', value: 196 }, { month: 'Apr', value: 210 },
    ],
    salary: {
      low:  { range: 'HKD 25K–35K', pct: 20, label: 'Entry' },
      mid:  { range: 'HKD 35K–55K', pct: 58, label: 'Mid-level' },
      high: { range: 'HKD 55K–100K', pct: 22, label: 'Senior' },
    },
    details: {
      openings: 210, competition: 'Competitive',
      highlight: 'Top role in tech startups',
      topCompanies: ['ZA Bank', 'Airwallex', 'AMTD', 'Klook', 'Finnovasia'],
      keySkills: ['React', 'Node.js', 'Python', 'Go', 'AWS', 'Docker'],
      insight: 'HK\'s virtual banking licences and cross-border fintech boom mean software developers remain in short supply despite high graduate output, especially for backend and cloud-native skills.',
    },
  },
  {
    id: 'r4',
    tab: 'role',
    badge: 'RISING ⚡',
    badgeVariant: 'rising',
    title: 'Product Manager',
    metric: '88 openings',
    metricLabel: 'Active HK postings',
    description: 'Growing demand as tech companies mature and expand product teams.',
    accentVariant: 'amber',
    iconName: 'Star',
    chartColor: '#FBBF24',
    trendData: [
      { month: 'Nov', value: 55 }, { month: 'Dec', value: 60 },
      { month: 'Jan', value: 66 }, { month: 'Feb', value: 72 },
      { month: 'Mar', value: 80 }, { month: 'Apr', value: 88 },
    ],
    salary: {
      low:  { range: 'HKD 30K–40K', pct: 22, label: 'Entry' },
      mid:  { range: 'HKD 40K–60K', pct: 56, label: 'Mid-level' },
      high: { range: 'HKD 60K–90K', pct: 22, label: 'Senior' },
    },
    details: {
      openings: 88, competition: 'Very Competitive',
      highlight: '+60% growth from last year',
      topCompanies: ['Klook', 'GoGoX', 'ZA Bank', 'Bowtie', 'WeLab'],
      keySkills: ['Product Strategy', 'Agile', 'User Research', 'SQL', 'Roadmapping'],
      insight: 'As HK\'s startup ecosystem matures past the MVP phase, companies are hiring their first formal PMs — creating a bottleneck since few local graduates have the hybrid tech-business profile required.',
    },
  },

  // ── By Sector ─────────────────────────────────────────────────────────────
  {
    id: 's1',
    tab: 'sector',
    badge: 'HOT NOW 🔥',
    badgeVariant: 'hot',
    title: 'Cybersecurity in Financial Services',
    metric: 'HKD 45K–65K',
    metricLabel: 'Avg salary range',
    description: 'Critical talent shortage — fewer qualified candidates, premium pay.',
    accentVariant: 'rose',
    iconName: 'Zap',
    chartColor: '#F43F5E',
    trendData: [
      { month: 'Nov', value: 38 }, { month: 'Dec', value: 42 },
      { month: 'Jan', value: 51 }, { month: 'Feb', value: 58 },
      { month: 'Mar', value: 63 }, { month: 'Apr', value: 71 },
    ],
    salary: {
      low:  { range: 'HKD 28K–35K', pct: 22, label: 'Entry' },
      mid:  { range: 'HKD 35K–55K', pct: 55, label: 'Mid-level' },
      high: { range: 'HKD 55K–80K', pct: 23, label: 'Senior' },
    },
    details: {
      openings: 89, competition: 'Low',
      highlight: '+24% YoY demand growth',
      topCompanies: ['HSBC', 'Bank of China', 'AIA', 'Morgan Stanley'],
      keySkills: ['Network Security', 'SIEM', 'Cloud Security', 'ISO 27001', 'Python'],
      insight: 'HKMA\'s Cybersecurity Fortification Initiative 2.0 mandates banks to upgrade defences, creating a regulatory-driven talent surge that shows no sign of slowing.',
    },
  },
  {
    id: 's2',
    tab: 'sector',
    badge: 'GROWING 📈',
    badgeVariant: 'growing',
    title: 'Fintech — Data & Tech Roles',
    metric: '+12% YoY',
    metricLabel: 'Sector job growth',
    description: 'Strong demand for data engineers, analysts, and cloud architects.',
    accentVariant: 'emerald',
    iconName: 'TrendingUp',
    chartColor: '#34D399',
    trendData: [
      { month: 'Nov', value: 52 }, { month: 'Dec', value: 55 },
      { month: 'Jan', value: 60 }, { month: 'Feb', value: 65 },
      { month: 'Mar', value: 70 }, { month: 'Apr', value: 78 },
    ],
    salary: {
      low:  { range: 'HKD 25K–35K', pct: 18, label: 'Entry' },
      mid:  { range: 'HKD 35K–55K', pct: 60, label: 'Mid-level' },
      high: { range: 'HKD 55K–90K', pct: 22, label: 'Senior' },
    },
    details: {
      openings: 142, competition: 'Moderate',
      highlight: '12% more roles vs last year',
      topCompanies: ['Ant Group', 'WeLab', 'ZA Bank', 'Airwallex'],
      keySkills: ['Python', 'Spark', 'AWS', 'SQL', 'Machine Learning'],
      insight: 'Eight virtual banking licences and a thriving insurtech sub-sector are driving consistent data and engineering hiring across all experience levels.',
    },
  },
  {
    id: 's3',
    tab: 'sector',
    badge: 'EMERGING ✨',
    badgeVariant: 'emerging',
    title: 'Healthcare IT & MedTech',
    metric: '+31 new roles',
    metricLabel: 'Q1 2026 postings',
    description: 'Digital health transformation opening tech roles in clinical systems.',
    accentVariant: 'purple',
    iconName: 'Sparkles',
    chartColor: '#a855f7',
    trendData: [
      { month: 'Nov', value: 8 }, { month: 'Dec', value: 12 },
      { month: 'Jan', value: 18 }, { month: 'Feb', value: 22 },
      { month: 'Mar', value: 28 }, { month: 'Apr', value: 35 },
    ],
    salary: {
      low:  { range: 'HKD 22K–30K', pct: 30, label: 'Entry' },
      mid:  { range: 'HKD 30K–45K', pct: 52, label: 'Mid-level' },
      high: { range: 'HKD 45K–70K', pct: 18, label: 'Senior' },
    },
    details: {
      openings: 31, competition: 'Low',
      highlight: 'Fastest growing new sector',
      topCompanies: ['QMH', 'Hospital Authority', 'Prenetics', 'Medopad'],
      keySkills: ['HL7 / FHIR', 'Python', 'Data Privacy', 'Cloud', 'UX Research'],
      insight: 'The government\'s push for electronic health records and remote patient monitoring is pulling engineering, data, and UX talent into healthcare for the first time at scale.',
    },
  },
  {
    id: 's4',
    tab: 'sector',
    badge: 'STABLE 📊',
    badgeVariant: 'stable',
    title: 'E-commerce & Retail Tech',
    metric: '+8% YoY',
    metricLabel: 'Steady sector growth',
    description: 'Consistent demand for logistics tech, UX, and digital marketing.',
    accentVariant: 'sky',
    iconName: 'Star',
    chartColor: '#0EA5E9',
    trendData: [
      { month: 'Nov', value: 44 }, { month: 'Dec', value: 46 },
      { month: 'Jan', value: 48 }, { month: 'Feb', value: 51 },
      { month: 'Mar', value: 53 }, { month: 'Apr', value: 57 },
    ],
    salary: {
      low:  { range: 'HKD 20K–28K', pct: 35, label: 'Entry' },
      mid:  { range: 'HKD 28K–42K', pct: 48, label: 'Mid-level' },
      high: { range: 'HKD 42K–65K', pct: 17, label: 'Senior' },
    },
    details: {
      openings: 96, competition: 'Competitive',
      highlight: 'Steady 8% sector growth',
      topCompanies: ['HKTVmall', 'Lalamove', 'GoGoVan', 'Zeek'],
      keySkills: ['Digital Marketing', 'React', 'Logistics Ops', 'Shopify', 'Analytics'],
      insight: 'Post-pandemic normalisation has steadied e-commerce growth, but last-mile logistics and localisation tech continue to generate consistent junior-to-mid hiring.',
    },
  },
];

export const signalsByTab = {
  district: allMarketSignals.filter(s => s.tab === 'district'),
  role:     allMarketSignals.filter(s => s.tab === 'role'),
  sector:   allMarketSignals.filter(s => s.tab === 'sector'),
};

export function getSignalById(id: string): MarketSignalCard | undefined {
  return allMarketSignals.find(s => s.id === id);
}

export function findCardForApiSignal(signal: {
  district?: string | null;
  role?: string | null;
  sector?: string | null;
  title: string;
}): MarketSignalCard | undefined {
  // District match: "Central & Western" → d1 "Cybersecurity Roles in Central & Western"
  if (signal.district) {
    const card = allMarketSignals.find(
      c => c.tab === 'district' && c.title.toLowerCase().includes(signal.district!.toLowerCase())
    );
    if (card) return card;
  }

  // Role match: "Cybersecurity Analyst" → r1 "Cybersecurity Analyst"
  if (signal.role) {
    const card = allMarketSignals.find(
      c => c.tab === 'role' && c.title.toLowerCase() === signal.role!.toLowerCase()
    );
    if (card) return card;
  }

  // Sector match: "Healthcare" → s3 "Healthcare IT & MedTech"
  if (signal.sector) {
    const card = allMarketSignals.find(
      c => c.tab === 'sector' && c.title.toLowerCase().includes(signal.sector!.toLowerCase())
    );
    if (card) return card;
  }

  // Title keyword fallback — check if any card title word appears in the signal title
  const signalTitleLower = signal.title.toLowerCase();
  return allMarketSignals.find(c => {
    const words = c.title.toLowerCase().split(/[\s,&:—]+/).filter(w => w.length > 5);
    return words.some(w => signalTitleLower.includes(w));
  });
}
