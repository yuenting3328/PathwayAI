import { TrendingUp, DollarSign, Target, AlertTriangle, MapPin, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import {
  market,
  type SectorTrend,
  type DistrictSalaryBenchmark,
  type SkillShortage,
  type CompetencyFeedback,
  type DemandForecast,
  type TopEmployer,
} from '../lib/api';

export default function MarketIntelligence() {
  const [sectorTrends, setSectorTrends] = useState<SectorTrend[]>([]);
  const [districtSalaries, setDistrictSalaries] = useState<DistrictSalaryBenchmark[]>([]);
  const [skillsShortage, setSkillsShortage] = useState<SkillShortage[]>([]);
  const [competencyFeedback, setCompetencyFeedback] = useState<CompetencyFeedback[]>([]);
  const [demandForecast, setDemandForecast] = useState<DemandForecast[]>([]);
  const [topEmployers, setTopEmployers] = useState<TopEmployer[]>([]);

  useEffect(() => {
    Promise.all([
      market.sectorTrends(),
      market.districtSalaries(),
      market.skillsShortage(),
      market.competencyFeedback(),
      market.demandForecast(),
      market.topEmployers(),
    ]).then(([st, ds, ss, cf, df, te]) => {
      setSectorTrends(st);
      setDistrictSalaries(ds);
      setSkillsShortage(ss);
      setCompetencyFeedback(cf);
      setDemandForecast(df);
      setTopEmployers(te);
    }).catch(console.error);
  }, []);

  const criticalCount = skillsShortage.filter(s => s.shortage >= 85).length;
  const totalJobCount = districtSalaries.reduce((sum, d) => sum + d.jobCount, 0);
  const medianSalary = districtSalaries.length
    ? Math.round(districtSalaries.reduce((sum, d) => sum + d.median, 0) / districtSalaries.length)
    : 0;

  const heroKPIs = [
    { label: 'Overall Job Market Health', value: '78/100', change: '+4 pts this quarter', icon: TrendingUp, color: '#6366F1' },
    { label: 'Median Starting Salary', value: medianSalary ? `HKD $${medianSalary.toLocaleString()}` : '—', change: '+5.2% YoY', icon: DollarSign, color: '#34D399' },
    { label: 'Skills in Shortage', value: skillsShortage.length ? `${criticalCount} critical` : '—', change: `${skillsShortage.length} tracked`, icon: AlertTriangle, color: '#F43F5E' },
    { label: 'Active Job Postings', value: totalJobCount ? totalJobCount.toLocaleString() : '—', change: 'Across all districts', icon: Briefcase, color: '#0EA5E9' },
  ];

  const sortedCompetency = [...competencyFeedback].sort((a, b) => a.gap - b.gap);

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
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis dataKey="quarter" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[50, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
              <Line type="monotone" dataKey="finance" stroke="#6366F1" strokeWidth={2.5} name="Finance" />
              <Line type="monotone" dataKey="tech" stroke="#0EA5E9" strokeWidth={2.5} name="Tech" />
              <Line type="monotone" dataKey="healthcare" stroke="#34D399" strokeWidth={2.5} name="Healthcare" />
              <Line type="monotone" dataKey="education" stroke="#FBBF24" strokeWidth={2.5} name="Education" />
              <Line type="monotone" dataKey="professional" stroke="#A78BFA" strokeWidth={2.5} name="Professional Services" />
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
                    <span className="text-[16px] font-semibold text-[#6366F1]">${district.median.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
                    <span>Q1: ${district.q1Salary.toLocaleString()}</span>
                    <span>Q3: ${district.q3Salary.toLocaleString()}</span>
                    <span>{district.jobCount} jobs</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute h-2 bg-[#6366F1]/30 rounded-full"
                      style={{ left: `${((district.q1Salary - 15000) / 20000) * 100}%`, width: `${((district.q3Salary - district.q1Salary) / 20000) * 100}%` }}
                    />
                    <div className="absolute h-2 w-1 bg-[#6366F1]" style={{ left: `${((district.median - 15000) / 20000) * 100}%` }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
                <Area type="monotone" dataKey="historical" fill="#8A8A9E" fillOpacity={0.2} stroke="#8A8A9E" strokeWidth={1} name="Historical" />
                <Line type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={2.5} name="Actual" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" stroke="#0EA5E9" strokeWidth={2.5} strokeDasharray="5 5" name="Forecast" />
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
              {skillsShortage.map((skill: SkillShortage) => (
                <tr key={skill.skill} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{skill.skill}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${skill.shortage >= 85 ? 'bg-[#F43F5E]' : skill.shortage >= 70 ? 'bg-[#FBBF24]' : 'bg-[#34D399]'}`} style={{ width: `${skill.shortage}%` }} />
                      </div>
                      <span className={`text-[13px] font-semibold ${skill.shortage >= 85 ? 'text-[#F43F5E]' : skill.shortage >= 70 ? 'text-[#FBBF24]' : 'text-[#34D399]'}`}>{skill.shortage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[#34D399]" />
                      <span className="text-[14px] font-medium text-[#34D399]">+{skill.demandGrowth}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[14px] font-mono text-foreground">+{skill.salaryPremium}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${skill.shortage >= 85 ? 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30' : skill.shortage >= 70 ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30' : 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30'}`}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis type="number" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <YAxis dataKey="competency" type="category" stroke="#8A8A9E" style={{ fontSize: '12px' }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
                <Bar dataKey="current" fill="#6366F1" name="Current Performance" radius={[0, 6, 6, 0]} />
                <Bar dataKey="desired" fill="#34D399" name="Employer Expectation" radius={[0, 6, 6, 0]} fillOpacity={0.5} />
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
              {sortedCompetency.map((comp: CompetencyFeedback) => (
                <div key={comp.competency} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">{comp.competency}</span>
                    <span className={`text-[14px] font-semibold ${Math.abs(comp.gap) >= 15 ? 'text-[#F43F5E]' : Math.abs(comp.gap) >= 10 ? 'text-[#FBBF24]' : 'text-[#34D399]'}`}>
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
            <p className="text-[13px] text-muted-foreground mt-1">Leading graduate employers by placement volume</p>
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
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topEmployers.map((employer: TopEmployer) => (
                <tr key={employer.rank} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold ${employer.rank === 1 ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : employer.rank === 2 ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' : employer.rank === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' : 'bg-muted text-muted-foreground'}`}>
                      {employer.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{employer.employer}</td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{employer.sector}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-semibold text-foreground">{employer.hires}</td>
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
