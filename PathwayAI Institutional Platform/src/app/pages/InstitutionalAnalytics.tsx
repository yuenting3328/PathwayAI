import { TrendingUp, TrendingDown, Download, Mail, Calendar, Search, ChevronRight, AlertCircle, CheckCircle2, MapPin, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { analytics, institution, type InstitutionAnalytics, type Programme, type GraduateOutcome, type InstitutionSnapshot, type ProgrammeSnapshot, type InstitutionInsight } from '../lib/api';
import { useSSE } from '../lib/useSSE';

export default function InstitutionalAnalytics() {
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
  const [cohortYear, setCohortYear] = useState('2026');
  const [faculty, setFaculty] = useState('All');
  const [analyticsData, setAnalyticsData] = useState<InstitutionAnalytics | null>(null);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [outcomes, setOutcomes] = useState<GraduateOutcome[]>([]);
  const [snapshots, setSnapshots] = useState<InstitutionSnapshot[]>([]);
  const [programmeSnapshots, setProgrammeSnapshots] = useState<ProgrammeSnapshot[]>([]);
  const [institutionInsights, setInstitutionInsights] = useState<InstitutionInsight[]>([]);

  useEffect(() => {
    Promise.all([
      analytics.institution(),
      institution.programmes(),
      institution.outcomes(),
      institution.snapshots(),
      institution.programmeSnapshots(),
      institution.insights(),
    ]).then(([a, p, o, s, ps, ins]) => {
      setAnalyticsData(a);
      setProgrammes(p);
      setOutcomes(o);
      setSnapshots(s);
      setProgrammeSnapshots(ps);
      setInstitutionInsights(ins);
    }).catch(console.error);
  }, []);

  // Real-time: refresh outcomes table when a graduate accepts an offer
  useSSE('/events/stream', (event) => {
    if (event.type === 'OUTCOME_REPORTED') {
      institution.outcomes().then(setOutcomes).catch(() => {});
      analytics.institution().then(setAnalyticsData).catch(() => {});
    }
  });

  // A. Hero KPIs
  const heroKPIs = [
    { label: 'Overall Employment Rate', value: analyticsData ? `${analyticsData.employmentRate.toFixed(1)}%` : '—', change: '+2.3%', trend: 'up', period: 'Last 6 months' },
    { label: 'Median Starting Salary', value: 'HKD $18,500', change: '+5.2%', trend: 'up', period: 'vs last cohort' },
    { label: 'Median Time to First Offer', value: '45 days', change: '-8 days', trend: 'up', period: 'vs last cohort' },
    { label: 'Further Studies vs Employment', value: '12.5%', change: '87.5% employed', trend: 'neutral', period: 'Current cohort' },
  ];

  // C. University-wide outcomes — from InstitutionSnapshot
  const employmentTrends = snapshots.map(s => ({
    year: s.year.toString(),
    employmentRate: s.employmentRate,
    medianSalary: s.medianSalary,
    timeToOffer: s.timeToOfferDays,
  }));

  // Outcomes distribution — pivot snapshots by category
  const outcomesDistribution = (() => {
    const years = snapshots.map(s => s.year.toString());
    return ['Employment', 'Further Study', 'Seeking', 'Other'].map(category => {
      const row: Record<string, string | number> = { category };
      snapshots.forEach(s => {
        row[s.year.toString()] = category === 'Employment' ? s.employedCount
          : category === 'Further Study' ? s.furtherStudyCount
          : category === 'Seeking' ? s.seekingCount
          : s.otherCount;
      });
      return row;
    });
  })();

  // Sector breakdown from analytics
  const SECTOR_COLORS = ['#6366F1', '#0EA5E9', '#34D399', '#FBBF24', '#A78BFA', '#8A8A9E'];
  const sectorBreakdown = (() => {
    if (!analyticsData) return [] as { sector: string; count: number; percentage: number; color: string }[];
    const entries = (Object.entries(analyticsData.sectorBreakdown) as [string, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const total = entries.reduce((s, [, c]) => s + c, 0) || 1;
    return entries.map(([sector, count], i) => ({
      sector,
      count,
      percentage: +((count / total) * 100).toFixed(1),
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
  })();

  // District distribution derived from outcomes
  const districtData = (() => {
    const counts: Record<string, number> = {};
    outcomes.forEach(o => {
      const geo = o.geography ?? 'Unknown';
      counts[geo] = (counts[geo] ?? 0) + 1;
    });
    const total = outcomes.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([district, count]) => ({
        district,
        count,
        percentage: +((count / total) * 100).toFixed(1),
      }));
  })();

  // D. Programme performance from API
  const programmePerformance = programmes;

  // Department summary derived from programmes
  const departmentSummary = (() => {
    if (programmes.length === 0) return [] as { faculty: string; avgEmployment: number; avgSalary: number; benchmark: string; delta: string }[];
    const faculties = [...new Set(programmes.map(p => p.faculty))];
    const uniAvgEmployment = programmes.reduce((s, p) => s + p.employmentRate, 0) / programmes.length;
    return faculties.map(fac => {
      const facProgs = programmes.filter(p => p.faculty === fac);
      const avgEmployment = facProgs.reduce((s, p) => s + p.employmentRate, 0) / facProgs.length;
      const avgSalary = Math.round(facProgs.reduce((s, p) => s + p.avgSalary, 0) / facProgs.length);
      const delta = avgEmployment - uniAvgEmployment;
      return {
        faculty: fac,
        avgEmployment: +avgEmployment.toFixed(1),
        avgSalary,
        benchmark: delta > 1 ? 'above' : delta < -1 ? 'below' : 'neutral',
        delta: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`,
      };
    });
  })();

  // E. Cohort drilldown data from outcomes
  const cohortRecords = outcomes.map(o => ({
    id: o.cohortRef,
    outcomeStatus: o.role ? 'Employed' : o.sector === 'Education' ? 'Further Study' : 'Seeking',
    roleTitle: o.role ?? (o.sector === 'Education' ? 'Further Study' : 'Job Seeking'),
    sector: o.sector ?? 'N/A',
    salaryBand: o.salaryBand ?? 'N/A',
    location: o.geography ?? 'N/A',
  }));

  // Relative timestamp helper
  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // F. Insights and alerts from DB
  const insights = institutionInsights
    .filter(i => ['success', 'alert', 'info'].includes(i.type))
    .map(i => ({ ...i, timestamp: relativeTime(i.createdAt) }));

  const alerts = institutionInsights
    .filter(i => i.type === 'warning')
    .map(i => ({ ...i, timestamp: relativeTime(i.createdAt) }));

  // Programme drilldown
  const selectedProgrammeData = programmes.find(p => p.id === selectedProgramme);
  const programmeTrends = selectedProgramme
    ? programmeSnapshots
        .filter(s => s.programmeId === selectedProgramme)
        .sort((a, b) => a.year - b.year)
        .slice(-3)
        .map(s => ({ year: s.year.toString(), employmentRate: s.employmentRate, medianSalary: s.medianSalary }))
    : [];

  const typicalRoles = selectedProgramme ? [
    { role: 'Financial Analyst', count: 42, percentage: 28 },
    { role: 'Investment Banking Analyst', count: 38, percentage: 25 },
    { role: 'Risk Analyst', count: 32, percentage: 21 },
    { role: 'Corporate Finance Associate', count: 24, percentage: 16 },
    { role: 'Other', count: 15, percentage: 10 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* A. Hero / Summary Band */}
      <div className="space-y-4">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Institutional Analytics</h1>
          <p className="text-[15px] text-muted-foreground mt-1">
            Track real-time graduate employment, salaries, and programme performance across your university
          </p>
        </div>

        <div className="flex gap-3">
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export for Council / UGC Report
          </button>
          <button className="h-10 px-6 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-[#6366F1]">
            <Mail className="w-4 h-4" />
            Schedule Weekly Email Digest
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroKPIs.map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-[12px] text-muted-foreground uppercase tracking-wider">{kpi.label}</div>
                {kpi.trend !== 'neutral' && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium ${
                    kpi.trend === 'up' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#F43F5E]/15 text-[#F43F5E]'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                )}
              </div>
              <div className="text-[32px] font-semibold text-foreground mb-2">{kpi.value}</div>
              <div className="text-[12px] text-muted-foreground">{kpi.period}</div>
            </div>
          ))}
        </div>
      </div>

      {/* B. Global Filters and Context Bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[12px] text-muted-foreground uppercase tracking-wider mb-2 block">Cohort Year</label>
            <select
              value={cohortYear}
              onChange={(e) => setCohortYear(e.target.value)}
              className="w-full h-10 px-3 bg-input border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground uppercase tracking-wider mb-2 block">Faculty / School</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full h-10 px-3 bg-input border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All Faculties</option>
              <option>Business</option>
              <option>Engineering</option>
              <option>Science</option>
              <option>Arts</option>
              <option>Medicine</option>
              <option>Law</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground uppercase tracking-wider mb-2 block">Degree Level</label>
            <select className="w-full h-10 px-3 bg-input border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Levels</option>
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground uppercase tracking-wider mb-2 block">Study Mode</label>
            <select className="w-full h-10 px-3 bg-input border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Modes</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground uppercase tracking-wider mb-2 block">Geography</label>
            <select className="w-full h-10 px-3 bg-input border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Locations</option>
              <option>HK-based</option>
              <option>Overseas</option>
            </select>
          </div>
        </div>
      </div>

      {/* C. University-wide Outcomes Overview */}
      <div className="space-y-6">
        <h2 className="text-[20px] font-semibold text-foreground">University-wide Outcomes Overview</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-semibold text-foreground">Employment Rate Trend</h3>
              <p className="text-[12px] text-muted-foreground mt-1">Last 5 years</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={employmentTrends}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" dataKey="year" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '11px' }} domain={[80, 90]} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                  <Line key="employmentRate" type="monotone" dataKey="employmentRate" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-semibold text-foreground">Median Salary Trend</h3>
              <p className="text-[12px] text-muted-foreground mt-1">HKD, last 5 years</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={employmentTrends}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" dataKey="year" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                  <Line key="medianSalary" type="monotone" dataKey="medianSalary" stroke="#34D399" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-semibold text-foreground">Time to Offer Trend</h3>
              <p className="text-[12px] text-muted-foreground mt-1">Days, last 5 years</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={employmentTrends}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" dataKey="year" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '11px' }} domain={[35, 55]} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                  <Line key="timeToOffer" type="monotone" dataKey="timeToOffer" stroke="#FBBF24" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-semibold text-foreground">Outcomes Distribution</h3>
              <p className="text-[12px] text-muted-foreground mt-1">3-year comparison</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={outcomesDistribution}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" dataKey="category" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                  <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
                  <Bar key="2024" dataKey="2024" fill="#8A8A9E" name="2024" radius={[6, 6, 0, 0]} />
                  <Bar key="2025" dataKey="2025" fill="#6366F1" name="2025" radius={[6, 6, 0, 0]} />
                  <Bar key="2026" dataKey="2026" fill="#0EA5E9" name="2026" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-semibold text-foreground">Employment by Sector</h3>
              <p className="text-[12px] text-muted-foreground mt-1">HK context sectors</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    key="pie"
                    data={sectorBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {sectorBreakdown.map((entry) => (
                      <Cell key={entry.sector} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {sectorBreakdown.map((sector) => (
                  <div key={sector.sector} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                      <span className="text-muted-foreground">{sector.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">{sector.count}</span>
                      <span className="text-muted-foreground">({sector.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Employment by HK District</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Geographic distribution of employed graduates</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {districtData.map((district) => (
                <div key={district.district}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-[14px] font-medium text-foreground">{district.district}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] text-muted-foreground">{district.count} graduates</span>
                      <span className="text-[14px] font-semibold text-foreground">{district.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#6366F1]"
                      style={{ width: `${district.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* D. Programme & Department Performance */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-foreground">Programme & Department Performance</h2>
          <button className="text-[14px] text-primary hover:underline font-medium">Save Current View</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentSummary.map((dept) => (
            <div key={dept.faculty} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-foreground">{dept.faculty}</h4>
                <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                  dept.benchmark === 'above' ? 'bg-[#34D399]/15 text-[#34D399]' :
                  dept.benchmark === 'below' ? 'bg-[#F43F5E]/15 text-[#F43F5E]' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {dept.benchmark === 'above' ? '↑ Above' : dept.benchmark === 'below' ? '↓ Below' : '= At'} Benchmark
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <div className="text-muted-foreground">Employment</div>
                  <div className="text-foreground font-semibold mt-1">{dept.avgEmployment}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg Salary</div>
                  <div className="text-foreground font-semibold mt-1">${dept.avgSalary.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2 text-[12px]">
                <span className={dept.benchmark === 'above' ? 'text-[#34D399]' : dept.benchmark === 'below' ? 'text-[#F43F5E]' : 'text-muted-foreground'}>
                  {dept.delta} vs university average
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-foreground">Programme Performance</h3>
            <div className="flex gap-2">
              <button className="h-8 px-3 text-[12px] border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors text-[#6366F1]">
                Sort by Salary
              </button>
              <button className="h-8 px-3 text-[12px] border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors text-[#6366F1]">
                Sort by Employment Rate
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b-2 border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Programme</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employment</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Median Salary</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Time to Offer</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programmePerformance.map((prog) => (
                  <tr key={prog.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-[13px] text-foreground font-medium">{prog.name}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{prog.faculty}</td>
                    <td className="px-6 py-4 text-right text-[13px] font-semibold text-[#34D399]">{prog.employmentRate}%</td>
                    <td className="px-6 py-4 text-right text-[13px] font-mono text-foreground">${prog.avgSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-[13px] text-muted-foreground">{Math.round(prog.timeToOffer * 30)} days</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[13px] font-semibold text-foreground">{(prog.satisfaction * 2).toFixed(1)}</span>
                        <span className="text-[11px] text-muted-foreground">/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedProgramme(prog.id)}
                        className="h-8 px-3 text-[12px] text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Programme Drilldown Side Panel */}
      {selectedProgramme && selectedProgrammeData && (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-semibold text-foreground">{selectedProgrammeData.name}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{selectedProgrammeData.faculty}</p>
              </div>
              <button onClick={() => setSelectedProgramme(null)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-[14px] font-semibold text-foreground mb-3">3-Year Trend</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={programmeTrends}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" dataKey="year" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <YAxis key="left" yAxisId="left" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <YAxis key="right" yAxisId="right" orientation="right" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF' }} />
                  <Line key="employmentRate" yAxisId="left" type="monotone" dataKey="employmentRate" stroke="#6366F1" strokeWidth={2} name="Employment %" />
                  <Line key="medianSalary" yAxisId="right" type="monotone" dataKey="medianSalary" stroke="#34D399" strokeWidth={2} name="Salary" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h4 className="text-[14px] font-semibold text-foreground mb-3">Typical Roles & Sectors</h4>
              <div className="space-y-2">
                {typicalRoles.map((role) => (
                  <div key={role.role} className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">{role.role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">{role.count}</span>
                      <span className="text-muted-foreground">({role.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-semibold text-foreground mb-3">Key Skill Strengths/Weaknesses</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">Financial Analysis</span>
                  <span className="text-[13px] font-semibold text-[#34D399]">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">Data Visualization</span>
                  <span className="text-[13px] font-semibold text-[#34D399]">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">Python/R Programming</span>
                  <span className="text-[13px] font-semibold text-[#FBBF24]">Moderate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">Machine Learning</span>
                  <span className="text-[13px] font-semibold text-[#F43F5E]">Gap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. Cohort Drilldown & Student-level Explorer */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-foreground">Cohort Drilldown & Student Records</h3>
            <p className="text-[12px] text-muted-foreground mt-1">Anonymised records with privacy aggregation</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-64 h-9 pl-9 pr-4 bg-input border border-border rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="h-9 px-3 text-[12px] border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors text-[#6366F1]">
              Privacy: Aggregated
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Outcome Status</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Role Title</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Salary Band</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cohortRecords.map((record) => (
                <tr key={record.id} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-3 text-[13px] font-mono text-foreground">{record.id}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-[11px] font-medium ${
                      record.outcomeStatus === 'Employed' ? 'bg-[#34D399]/15 text-[#34D399]' :
                      record.outcomeStatus === 'Further Study' ? 'bg-[#6366F1]/15 text-[#6366F1]' :
                      'bg-[#FBBF24]/15 text-[#FBBF24]'
                    }`}>
                      {record.outcomeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[13px] text-foreground">{record.roleTitle}</td>
                  <td className="px-6 py-3 text-[13px] text-muted-foreground">{record.sector}</td>
                  <td className="px-6 py-3 text-[13px] font-mono text-foreground">{record.salaryBand}</td>
                  <td className="px-6 py-3 text-[13px] text-muted-foreground">{record.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-border bg-background/50 text-[12px] text-muted-foreground flex items-center justify-between">
          <span>Showing {cohortRecords.length} records (filtered for privacy)</span>
          <button className="text-primary hover:underline">View More</button>
        </div>
      </div>

      {/* F. Insights & Alert Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Auto-Generated Insights</h3>
          </div>
          <div className="divide-y divide-border">
            {insights.map((insight, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-accent transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.type === 'success' ? 'bg-[#34D399]/15' :
                    insight.type === 'alert' ? 'bg-[#F43F5E]/15' :
                    'bg-[#0EA5E9]/15'
                  }`}>
                    {insight.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#34D399]" /> :
                     insight.type === 'alert' ? <AlertCircle className="w-4 h-4 text-[#F43F5E]" /> :
                     <Target className="w-4 h-4 text-[#0EA5E9]" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-semibold text-foreground">{insight.title}</h4>
                    <p className="text-[12px] text-muted-foreground mt-1">{insight.description}</p>
                    <span className="text-[11px] text-muted-foreground mt-2 block">{insight.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Alert Feed</h3>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((alert, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-accent transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/15 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-semibold text-foreground">{alert.title}</h4>
                    <p className="text-[12px] text-muted-foreground mt-1">{alert.description}</p>
                    <span className="text-[11px] text-muted-foreground mt-2 block">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* G. Actions and Exports */}
      <div className="bg-accent/30 border border-border rounded-xl p-6">
        <h3 className="text-[16px] font-semibold text-foreground mb-4">Export & Automation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 text-[13px] font-medium text-[#6366F1]">
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 text-[13px] font-medium text-[#6366F1]">
            <Download className="w-4 h-4" />
            Export as XLSX
          </button>
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 text-[13px] font-medium text-[#6366F1]">
            <Download className="w-4 h-4" />
            Generate PDF Report
          </button>
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 text-[13px] font-medium text-[#6366F1]">
            <Calendar className="w-4 h-4" />
            Schedule Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
}
