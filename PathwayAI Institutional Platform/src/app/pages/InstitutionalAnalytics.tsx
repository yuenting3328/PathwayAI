import { TrendingUp, TrendingDown, Users, DollarSign, Clock, GraduationCap, Download, Mail, Calendar, Filter, Search, ChevronRight, AlertCircle, CheckCircle2, MapPin, Briefcase, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';

export default function InstitutionalAnalytics() {
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
  const [cohortYear, setCohortYear] = useState('2026');
  const [faculty, setFaculty] = useState('All');

  // A. Hero KPIs
  const heroKPIs = [
    { label: 'Overall Employment Rate', value: '87.5%', change: '+2.3%', trend: 'up', period: 'Last 6 months' },
    { label: 'Median Starting Salary', value: 'HKD $18,500', change: '+5.2%', trend: 'up', period: 'vs last cohort' },
    { label: 'Median Time to First Offer', value: '45 days', change: '-8 days', trend: 'up', period: 'vs last cohort' },
    { label: 'Further Studies vs Employment', value: '12.5%', change: '87.5% employed', trend: 'neutral', period: 'Current cohort' },
  ];

  // C. University-wide outcomes - Time series
  const employmentTrends = [
    { year: '2022', employmentRate: 82.1, medianSalary: 16500, timeToOffer: 52 },
    { year: '2023', employmentRate: 84.3, medianSalary: 17200, timeToOffer: 49 },
    { year: '2024', employmentRate: 85.8, medianSalary: 17800, timeToOffer: 47 },
    { year: '2025', employmentRate: 86.9, medianSalary: 18200, timeToOffer: 46 },
    { year: '2026', employmentRate: 87.5, medianSalary: 18500, timeToOffer: 45 },
  ];

  // Outcomes distribution
  const outcomesDistribution = [
    { category: 'Employment', '2024': 1245, '2025': 1387, '2026': 1456 },
    { category: 'Further Study', '2024': 187, '2025': 203, '2026': 218 },
    { category: 'Seeking', '2024': 134, '2025': 98, '2026': 76 },
    { category: 'Other', '2024': 45, '2025': 38, '2026': 32 },
  ];

  // Sector breakdown
  const sectorBreakdown = [
    { sector: 'Finance & Insurance', count: 428, percentage: 29.4, color: '#6366F1' },
    { sector: 'IT & Technology', count: 387, percentage: 26.6, color: '#0EA5E9' },
    { sector: 'Professional Services', count: 298, percentage: 20.5, color: '#34D399' },
    { sector: 'Public Sector', count: 187, percentage: 12.8, color: '#FBBF24' },
    { sector: 'Healthcare', count: 98, percentage: 6.7, color: '#A78BFA' },
    { sector: 'Other', count: 58, percentage: 4.0, color: '#8A8A9E' },
  ];

  // District distribution
  const districtData = [
    { district: 'Central & Western', count: 487, percentage: 33.4 },
    { district: 'Kowloon East', count: 342, percentage: 23.5 },
    { district: 'Tsim Sha Tsui', count: 298, percentage: 20.5 },
    { district: 'New Territories', count: 187, percentage: 12.8 },
    { district: 'Overseas', count: 142, percentage: 9.8 },
  ];

  // D. Programme performance table
  const programmePerformance = [
    { id: 1, programme: 'BBA in Finance', faculty: 'Business', employmentRate: 94.2, medianSalary: 24500, timeToOffer: 38, targetRoles: 91, satisfaction: 8.7 },
    { id: 2, programme: 'BEng in Computer Science', faculty: 'Engineering', employmentRate: 92.8, medianSalary: 26000, timeToOffer: 35, targetRoles: 94, satisfaction: 9.1 },
    { id: 3, programme: 'BSc in Data Science', faculty: 'Science', employmentRate: 91.5, medianSalary: 25500, timeToOffer: 37, targetRoles: 89, satisfaction: 8.9 },
    { id: 4, programme: 'BBA in Marketing', faculty: 'Business', employmentRate: 89.7, medianSalary: 22000, timeToOffer: 42, targetRoles: 86, satisfaction: 8.4 },
    { id: 5, programme: 'BA in Communication', faculty: 'Arts', employmentRate: 85.3, medianSalary: 19500, timeToOffer: 48, targetRoles: 78, satisfaction: 7.9 },
    { id: 6, programme: 'BSc in Nursing', faculty: 'Medicine', employmentRate: 96.1, medianSalary: 21000, timeToOffer: 28, targetRoles: 97, satisfaction: 9.2 },
    { id: 7, programme: 'LLB Law', faculty: 'Law', employmentRate: 88.4, medianSalary: 23500, timeToOffer: 45, targetRoles: 82, satisfaction: 8.3 },
    { id: 8, programme: 'BA in English', faculty: 'Arts', employmentRate: 82.6, medianSalary: 18500, timeToOffer: 52, targetRoles: 71, satisfaction: 7.6 },
  ];

  // Department summary
  const departmentSummary = [
    { faculty: 'Business', avgEmployment: 91.2, avgSalary: 23200, benchmark: 'above', delta: '+3.7%' },
    { faculty: 'Engineering', avgEmployment: 90.8, avgSalary: 24800, benchmark: 'above', delta: '+3.3%' },
    { faculty: 'Medicine', avgEmployment: 94.3, avgSalary: 21500, benchmark: 'above', delta: '+6.8%' },
    { faculty: 'Science', avgEmployment: 88.7, avgSalary: 22100, benchmark: 'above', delta: '+1.2%' },
    { faculty: 'Arts', avgEmployment: 84.1, avgSalary: 19000, benchmark: 'below', delta: '-3.4%' },
    { faculty: 'Law', avgEmployment: 88.4, avgSalary: 23500, benchmark: 'neutral', delta: '+0.9%' },
  ];

  // E. Cohort drilldown data
  const cohortRecords = [
    { id: 'A001', outcomeStatus: 'Employed', roleTitle: 'Financial Analyst', sector: 'Finance', salaryBand: 'HKD 22-26K', location: 'Central & Western' },
    { id: 'A002', outcomeStatus: 'Employed', roleTitle: 'Software Engineer', sector: 'Technology', salaryBand: 'HKD 24-28K', location: 'Kowloon East' },
    { id: 'A003', outcomeStatus: 'Further Study', roleTitle: 'Master Programme', sector: 'Education', salaryBand: 'N/A', location: 'Overseas' },
    { id: 'A004', outcomeStatus: 'Employed', roleTitle: 'Marketing Executive', sector: 'Professional Services', salaryBand: 'HKD 18-22K', location: 'Tsim Sha Tsui' },
    { id: 'A005', outcomeStatus: 'Employed', roleTitle: 'Data Scientist', sector: 'Technology', salaryBand: 'HKD 26-30K', location: 'Central & Western' },
    { id: 'A006', outcomeStatus: 'Seeking', roleTitle: 'Job Seeking', sector: 'N/A', salaryBand: 'N/A', location: 'N/A' },
    { id: 'A007', outcomeStatus: 'Employed', roleTitle: 'Registered Nurse', sector: 'Healthcare', salaryBand: 'HKD 20-24K', location: 'New Territories' },
    { id: 'A008', outcomeStatus: 'Employed', roleTitle: 'Consultant', sector: 'Professional Services', salaryBand: 'HKD 22-26K', location: 'Central & Western' },
  ];

  // F. Insights and alerts
  const insights = [
    { type: 'success', title: 'BSc CS graduates saw a 12% increase in median salary vs last cohort', description: 'From HKD $23,200 to HKD $26,000 - strongest growth across all programmes', timestamp: '2 hours ago' },
    { type: 'alert', title: 'Time-to-offer for Arts graduates rose by 8 days', description: 'Now at 50 days vs 42 days last year - recommend enhanced career support', timestamp: '5 hours ago' },
    { type: 'info', title: 'Finance sector hiring increased 15% this quarter', description: 'Strong demand for BBA Finance and related programmes', timestamp: '1 day ago' },
  ];

  const alerts = [
    { type: 'warning', title: 'BA English employment rate dropped below HK-wide benchmark', description: '82.6% vs 85% benchmark - requires curriculum review', timestamp: '3 days ago' },
    { type: 'warning', title: 'Small cohort detected: MA Psychology (n=12)', description: 'Data aggregated for privacy - detailed analytics unavailable', timestamp: '1 week ago' },
  ];

  // Programme drilldown data
  const selectedProgrammeData = programmePerformance.find(p => p.id.toString() === selectedProgramme);
  const programmeTrends = selectedProgramme ? [
    { year: '2024', employmentRate: 89.2, medianSalary: 22800 },
    { year: '2025', employmentRate: 91.5, medianSalary: 24200 },
    { year: '2026', employmentRate: selectedProgrammeData?.employmentRate || 0, medianSalary: selectedProgrammeData?.medianSalary || 0 },
  ] : [];

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

        {/* Primary CTAs */}
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

        {/* Hero KPIs */}
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

        {/* Time series charts */}
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

        {/* Outcomes distribution and sector breakdown */}
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

        {/* District heatmap */}
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

        {/* Department summary cards */}
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

        {/* Programme performance table */}
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
                  <th className="px-6 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Target Roles</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programmePerformance.map((prog) => (
                  <tr key={prog.id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-[13px] text-foreground font-medium">{prog.programme}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{prog.faculty}</td>
                    <td className="px-6 py-4 text-right text-[13px] font-semibold text-[#34D399]">{prog.employmentRate}%</td>
                    <td className="px-6 py-4 text-right text-[13px] font-mono text-foreground">${prog.medianSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-[13px] text-muted-foreground">{prog.timeToOffer} days</td>
                    <td className="px-6 py-4 text-right text-[13px] text-foreground">{prog.targetRoles}%</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[13px] font-semibold text-foreground">{prog.satisfaction}</span>
                        <span className="text-[11px] text-muted-foreground">/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedProgramme(prog.id.toString())}
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
                <h3 className="text-[18px] font-semibold text-foreground">{selectedProgrammeData.programme}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{selectedProgrammeData.faculty}</p>
              </div>
              <button onClick={() => setSelectedProgramme(null)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* 3-year trend */}
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

            {/* Typical roles */}
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

            {/* Key skills */}
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
          <span>Showing 8 of 1,456 records (filtered for privacy)</span>
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
