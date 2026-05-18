import { TrendingUp, DollarSign, Target, AlertTriangle, MapPin, Briefcase, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';

export default function MarketIntelligence() {
  // Hero KPIs
  const heroKPIs = [
    { label: 'Overall Job Market Health', value: '78/100', change: '+4 pts this quarter', icon: TrendingUp, color: '#6366F1' },
    { label: 'Median Starting Salary', value: 'HKD $18,500', change: '+5.2% YoY', icon: DollarSign, color: '#34D399' },
    { label: 'Skills in Shortage', value: '12 critical', change: '3 new this month', icon: AlertTriangle, color: '#F43F5E' },
    { label: 'Active Job Postings', value: '2,847', change: '+287 vs last month', icon: Briefcase, color: '#0EA5E9' },
  ];

  // Sector demand index (time-series)
  const sectorTrends = [
    { quarter: 'Q1 2025', finance: 72, tech: 85, healthcare: 68, education: 55, professional: 70 },
    { quarter: 'Q2 2025', finance: 76, tech: 88, healthcare: 70, education: 58, professional: 72 },
    { quarter: 'Q3 2025', finance: 78, tech: 90, healthcare: 72, education: 60, professional: 74 },
    { quarter: 'Q4 2025', finance: 82, tech: 92, healthcare: 75, education: 62, professional: 76 },
    { quarter: 'Q1 2026', finance: 85, tech: 94, healthcare: 78, education: 65, professional: 78 },
  ];

  // Salary benchmarks by district
  const districtSalaries = [
    { district: 'Central & Western', median: 24500, q1: 19000, q3: 32000, jobCount: 487 },
    { district: 'Kowloon City', median: 21000, q1: 17500, q3: 27000, jobCount: 342 },
    { district: 'Tsim Sha Tsui', median: 22500, q1: 18000, q3: 29000, jobCount: 398 },
    { district: 'Kwun Tong', median: 19500, q1: 16000, q3: 24000, jobCount: 276 },
    { district: 'Sha Tin', median: 20000, q1: 16500, q3: 25000, jobCount: 213 },
  ];

  // Skills-in-shortage matrix
  const skillsShortage = [
    { skill: 'Data Science', shortage: 92, demandGrowth: 28, avgSalaryPremium: 18 },
    { skill: 'Cloud Architecture', shortage: 88, demandGrowth: 32, avgSalaryPremium: 22 },
    { skill: 'Cybersecurity', shortage: 85, demandGrowth: 24, avgSalaryPremium: 19 },
    { skill: 'AI/Machine Learning', shortage: 90, demandGrowth: 35, avgSalaryPremium: 25 },
    { skill: 'Digital Marketing', shortage: 65, demandGrowth: 15, avgSalaryPremium: 8 },
    { skill: 'UX Design', shortage: 72, demandGrowth: 18, avgSalaryPremium: 12 },
  ];

  // Employer competency feedback
  const competencyFeedback = [
    { competency: 'Technical Skills', current: 78, desired: 90, gap: -12 },
    { competency: 'Communication', current: 82, desired: 88, gap: -6 },
    { competency: 'Problem Solving', current: 75, desired: 92, gap: -17 },
    { competency: 'Teamwork', current: 85, desired: 90, gap: -5 },
    { competency: 'Adaptability', current: 72, desired: 88, gap: -16 },
    { competency: 'Leadership', current: 68, desired: 85, gap: -17 },
  ];

  // Top hiring employers
  const topEmployers = [
    { rank: 1, employer: 'HSBC', sector: 'Finance', hires: 127, avgSalary: 24500, satisfaction: 8.7 },
    { rank: 2, employer: 'Alibaba Cloud', sector: 'Technology', hires: 98, avgSalary: 26000, satisfaction: 8.9 },
    { rank: 3, employer: 'Hospital Authority', sector: 'Healthcare', hires: 87, avgSalary: 21000, satisfaction: 8.2 },
    { rank: 4, employer: 'Deloitte', sector: 'Professional Services', hires: 76, avgSalary: 23500, satisfaction: 8.5 },
    { rank: 5, employer: 'HK Education Bureau', sector: 'Education', hires: 68, avgSalary: 19500, satisfaction: 7.9 },
  ];

  // Demand forecast
  const demandForecast = [
    { month: 'Jul', actual: 2560, forecast: 2580, historical: 2420 },
    { month: 'Aug', actual: 2650, forecast: 2720, historical: 2510 },
    { month: 'Sep', actual: 2780, forecast: 2850, historical: 2640 },
    { month: 'Oct', actual: null, forecast: 2980, historical: 2750 },
    { month: 'Nov', actual: null, forecast: 3100, historical: 2820 },
    { month: 'Dec', actual: null, forecast: 3050, historical: 2900 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Market Intelligence</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Real-time labor market insights and employer intelligence</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] text-[#6366F1] hover:bg-accent transition-colors">
            Configure Alerts
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Download Market Brief
          </button>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {heroKPIs.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${kpi.color}15` }}>
                <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
              </div>
            </div>
            <div className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-[32px] font-semibold text-foreground mb-2">{kpi.value}</div>
            <div className="text-[13px] text-[#34D399]">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Sector Demand Trends */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Sector Demand Index Trends</h3>
          <p className="text-[13px] text-muted-foreground mt-1">5-quarter demand trajectory by major sectors</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={sectorTrends}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis key="xaxis" dataKey="quarter" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[50, 100]} />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: '#1F1F28',
                  border: '1px solid #3A3A48',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              />
              <Line key="finance" type="monotone" dataKey="finance" stroke="#6366F1" strokeWidth={2.5} name="Finance" />
              <Line key="tech" type="monotone" dataKey="tech" stroke="#0EA5E9" strokeWidth={2.5} name="Tech" />
              <Line key="healthcare" type="monotone" dataKey="healthcare" stroke="#34D399" strokeWidth={2.5} name="Healthcare" />
              <Line key="education" type="monotone" dataKey="education" stroke="#FBBF24" strokeWidth={2.5} name="Education" />
              <Line key="professional" type="monotone" dataKey="professional" stroke="#A78BFA" strokeWidth={2.5} name="Professional Services" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Salary Benchmarks & Demand Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-foreground">District Salary Benchmarks</h3>
              <p className="text-[13px] text-muted-foreground mt-1">Starting salaries by HK district</p>
            </div>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {districtSalaries.map((district) => (
                <div key={district.district} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-medium text-foreground">{district.district}</span>
                    <span className="text-[16px] font-semibold text-[#6366F1]">
                      ${district.median.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
                    <span>Q1: ${district.q1.toLocaleString()}</span>
                    <span>Q3: ${district.q3.toLocaleString()}</span>
                    <span>{district.jobCount} jobs</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute h-2 bg-[#6366F1]/30 rounded-full"
                      style={{
                        left: `${((district.q1 - 15000) / 20000) * 100}%`,
                        width: `${((district.q3 - district.q1) / 20000) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute h-2 w-1 bg-[#6366F1]"
                      style={{ left: `${((district.median - 15000) / 20000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Job Posting Demand Forecast</h3>
            <p className="text-[13px] text-muted-foreground mt-1">AI-predicted demand vs historical</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={demandForecast}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis key="xaxis" dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                />
                <Area key="historical" type="monotone" dataKey="historical" fill="#8A8A9E" fillOpacity={0.2} stroke="#8A8A9E" strokeWidth={1} name="Historical" />
                <Line key="actual" type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={2.5} name="Actual" dot={{ r: 4 }} />
                <Line key="forecast" type="monotone" dataKey="forecast" stroke="#0EA5E9" strokeWidth={2.5} strokeDasharray="5 5" name="Forecast" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skills-in-Shortage Matrix */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Critical Skills Shortage Analysis</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Skills gap, demand growth, and salary premium indicators</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Skill</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Shortage Index</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Demand Growth</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Salary Premium</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skillsShortage.map((skill) => (
                <tr key={skill.skill} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{skill.skill}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            skill.shortage >= 85 ? 'bg-[#F43F5E]' :
                            skill.shortage >= 70 ? 'bg-[#FBBF24]' :
                            'bg-[#34D399]'
                          }`}
                          style={{ width: `${skill.shortage}%` }}
                        />
                      </div>
                      <span className={`text-[13px] font-semibold ${
                        skill.shortage >= 85 ? 'text-[#F43F5E]' :
                        skill.shortage >= 70 ? 'text-[#FBBF24]' :
                        'text-[#34D399]'
                      }`}>
                        {skill.shortage}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[#34D399]" />
                      <span className="text-[14px] font-medium text-[#34D399]">+{skill.demandGrowth}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[14px] font-mono text-foreground">+{skill.avgSalaryPremium}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${
                      skill.shortage >= 85 ? 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30' :
                      skill.shortage >= 70 ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30' :
                      'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30'
                    }`}>
                      {skill.shortage >= 85 ? 'Critical' : skill.shortage >= 70 ? 'High' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employer Competency Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Employer Competency Feedback</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Current graduate performance vs employer expectations</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={competencyFeedback} layout="vertical">
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis key="xaxis" type="number" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <YAxis key="yaxis" dataKey="competency" type="category" stroke="#8A8A9E" style={{ fontSize: '12px' }} width={120} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar key="current" dataKey="current" fill="#6366F1" name="Current Performance" radius={[0, 6, 6, 0]} />
                <Bar key="desired" dataKey="desired" fill="#34D399" name="Employer Expectation" radius={[0, 6, 6, 0]} fillOpacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Competency Gaps</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Areas requiring attention</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {competencyFeedback
                .sort((a, b) => a.gap - b.gap)
                .map((comp) => (
                  <div key={comp.competency} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-muted-foreground">{comp.competency}</span>
                      <span className={`text-[14px] font-semibold ${
                        Math.abs(comp.gap) >= 15 ? 'text-[#F43F5E]' :
                        Math.abs(comp.gap) >= 10 ? 'text-[#FBBF24]' :
                        'text-[#34D399]'
                      }`}>
                        {comp.gap} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium text-foreground">{comp.current}</span>
                      <span className="text-muted-foreground">→ Target:</span>
                      <span className="font-medium text-[#34D399]">{comp.desired}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Hiring Employers */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground">Top Hiring Organizations</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Leading graduate employers by volume and satisfaction</p>
          </div>
          <button className="text-[14px] text-primary hover:underline font-medium">View Employer Directory</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Graduate Hires</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Salary (HKD)</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topEmployers.map((employer) => (
                <tr key={employer.rank} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold ${
                      employer.rank === 1 ? 'bg-[#FBBF24]/20 text-[#FBBF24]' :
                      employer.rank === 2 ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' :
                      employer.rank === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {employer.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{employer.employer}</td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{employer.sector}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-semibold text-foreground">{employer.hires}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">${employer.avgSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[14px] font-semibold text-[#34D399]">{employer.satisfaction}</span>
                      <span className="text-[12px] text-muted-foreground">/10</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
