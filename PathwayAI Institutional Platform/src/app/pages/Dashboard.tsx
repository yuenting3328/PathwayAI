import { TrendingUp, TrendingDown, Users, Award, Briefcase, GraduationCap, Target, Building2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useEffect, useState } from 'react';
import { analytics, type InstitutionAnalytics } from '../lib/api';

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<InstitutionAnalytics | null>(null);

  useEffect(() => {
    analytics.institution().then(setAnalyticsData).catch(console.error);
  }, []);

  const kpiData = [
    { label: 'Graduate Employment Rate', value: analyticsData ? `${analyticsData.employmentRate}%` : '—', change: '+2.3%', trend: 'up', icon: Users, color: '#6366F1' },
    { label: 'HEAR Credentials Issued', value: analyticsData ? analyticsData.credentialsIssued.toLocaleString() : '—', change: '+458', trend: 'up', icon: Award, color: '#0EA5E9' },
    { label: 'Active Employer Partners', value: analyticsData ? String(analyticsData.employerPartners) : '—', change: '+28', trend: 'up', icon: Building2, color: '#34D399' },
    { label: 'Total Placements', value: analyticsData ? String(analyticsData.totalPlacements) : '—', change: '', trend: 'up', icon: Target, color: '#FBBF24' },
  ];

  // Trend data
  const employmentTrends = [
    { month: 'Jan', rate: 82, benchmark: 80 },
    { month: 'Feb', rate: 83, benchmark: 81 },
    { month: 'Mar', rate: 84, benchmark: 81 },
    { month: 'Apr', rate: 85, benchmark: 82 },
    { month: 'May', rate: 86, benchmark: 83 },
    { month: 'Jun', rate: 87.5, benchmark: 84 },
  ];

  // Programme leaderboard
  const programmeLeaderboard = [
    { rank: 1, programme: 'BBA in Finance', faculty: 'Business', employmentRate: 94.2, avgSalary: 24500, credentials: 342 },
    { rank: 2, programme: 'BEng in Computer Science', faculty: 'Engineering', employmentRate: 92.8, avgSalary: 26000, credentials: 298 },
    { rank: 3, programme: 'BSc in Data Science', faculty: 'Science', employmentRate: 91.5, avgSalary: 25500, credentials: 187 },
    { rank: 4, programme: 'BBA in Marketing', faculty: 'Business', employmentRate: 89.7, avgSalary: 22000, credentials: 256 },
    { rank: 5, programme: 'BA in Communication', faculty: 'Arts', employmentRate: 85.3, avgSalary: 19500, credentials: 203 },
  ];

  // Market snapshot
  const sectorDemand = [
    { sector: 'Finance', demand: 85, growth: 12 },
    { sector: 'IT/Tech', demand: 92, growth: 18 },
    { sector: 'Healthcare', demand: 78, growth: 8 },
    { sector: 'Education', demand: 65, growth: 3 },
    { sector: 'Professional Services', demand: 72, growth: 7 },
  ];

  // Skills alignment
  const skillsData = [
    { skill: 'Data Analysis', supply: 78, demand: 92 },
    { skill: 'Digital Marketing', supply: 85, demand: 88 },
    { skill: 'Programming', supply: 72, demand: 95 },
    { skill: 'Financial Modeling', supply: 81, demand: 85 },
    { skill: 'Communication', supply: 88, demand: 82 },
    { skill: 'Project Management', supply: 75, demand: 89 },
  ];

  // Employer pipeline
  const pipelineStages = [
    { stage: 'Prospecting', count: 48 },
    { stage: 'Initial Contact', count: 32 },
    { stage: 'Engaged', count: 24 },
    { stage: 'Partnership Active', count: 18 },
  ];

  // Insight feed
  const insights = [
    { type: 'alert', title: 'Programming Skills Gap Widening', description: '23% shortage vs market demand - recommend curriculum review', timestamp: '2 hours ago' },
    { type: 'success', title: 'Finance Programme Outperforms Benchmark', description: '94.2% employment rate vs 89% HK average', timestamp: '5 hours ago' },
    { type: 'info', title: 'New Employer Partnership: Deloitte HK', description: 'MoU signed for 15 internship placements', timestamp: '1 day ago' },
    { type: 'warning', title: 'Graduate Survey Response Rate Low', description: 'Only 62% completion - target is 80%', timestamp: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Dashboard</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Comprehensive institutional analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] text-[#6366F1] hover:bg-accent transition-colors">
            Customize View
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Generate Report
          </button>
        </div>
      </div>

      {/* Strip 1: Real-time KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${kpi.color}15` }}>
                <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium ${
                kpi.trend === 'up' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#F43F5E]/15 text-[#F43F5E]'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <div className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-[28px] font-semibold text-foreground">{kpi.value}</div>
            <div className="mt-3 text-[11px] text-muted-foreground">vs. previous period</div>
          </div>
        ))}
      </div>

      {/* Strip 2: Trends and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Employment Rate Trends</h3>
            <p className="text-[13px] text-muted-foreground mt-1">6-month trajectory vs HK regional benchmark</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={employmentTrends}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis key="xaxis" dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[75, 90]} />
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
                <Line key="rate" type="monotone" dataKey="rate" stroke="#6366F1" strokeWidth={2.5} name="HKU Rate" />
                <Line key="benchmark" type="monotone" dataKey="benchmark" stroke="#8A8A9E" strokeWidth={2} strokeDasharray="5 5" name="HK Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Credential Activity</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Last 30 days</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-muted-foreground">Issued</div>
                <div className="text-[24px] font-semibold text-foreground mt-1">458</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#6366F1]" />
              </div>
            </div>
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Shared</span>
                <span className="font-medium text-foreground">342</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Verified</span>
                <span className="font-medium text-foreground">289</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Download Rate</span>
                <span className="font-medium text-[#34D399]">74.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strip 3: Programme Leaderboard */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground">Top Performing Programmes</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Ranked by employment outcomes</p>
          </div>
          <button className="text-[14px] text-primary hover:underline font-medium">View All Programmes</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Programme</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Employment</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Salary (HKD)</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Credentials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {programmeLeaderboard.map((prog) => (
                <tr key={prog.rank} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                        prog.rank === 1 ? 'bg-[#FBBF24]/20 text-[#FBBF24]' :
                        prog.rank === 2 ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' :
                        prog.rank === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {prog.rank}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{prog.programme}</td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{prog.faculty}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center text-[14px] font-semibold text-[#34D399]">
                      {prog.employmentRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">
                    ${prog.avgSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{prog.credentials}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strip 4: Market Snapshot & Skills Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Sector Demand Index</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Current hiring demand by sector</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectorDemand} layout="vertical">
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis key="xaxis" type="number" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis key="yaxis" dataKey="sector" type="category" stroke="#8A8A9E" style={{ fontSize: '12px' }} width={120} />
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
                <Bar key="demand" dataKey="demand" fill="#6366F1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Skills Supply vs Demand</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Graduate competency alignment</p>
          </div>
          <div className="p-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={skillsData}>
                <PolarGrid key="grid" stroke="#2A2A36" />
                <PolarAngleAxis key="angleaxis" dataKey="skill" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                <PolarRadiusAxis key="radiusaxis" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                <Radar key="supply" name="Supply" dataKey="supply" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                <Radar key="demand" name="Demand" dataKey="demand" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.3} />
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
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strip 5: Employer Pipeline */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Employer Relationship Pipeline</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Partnership development funnel</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            {pipelineStages.map((stage, idx) => (
              <div key={stage.stage} className="flex-1">
                <div className="bg-accent rounded-lg p-4 text-center">
                  <div className="text-[24px] font-semibold text-foreground">{stage.count}</div>
                  <div className="text-[12px] text-muted-foreground mt-1">{stage.stage}</div>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[13px] text-muted-foreground">Conversion Rate</div>
                <div className="text-[20px] font-semibold text-[#34D399] mt-1">37.5%</div>
              </div>
              <div>
                <div className="text-[13px] text-muted-foreground">Avg Days to Partner</div>
                <div className="text-[20px] font-semibold text-foreground mt-1">67</div>
              </div>
              <div>
                <div className="text-[13px] text-muted-foreground">Partner Satisfaction</div>
                <div className="text-[20px] font-semibold text-[#6366F1] mt-1">8.4/10</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strip 6: Insights Feed */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground">Insights & Alerts</h3>
            <p className="text-[13px] text-muted-foreground mt-1">AI-generated actionable intelligence</p>
          </div>
          <button className="text-[14px] text-primary hover:underline font-medium">View All</button>
        </div>
        <div className="divide-y divide-border">
          {insights.map((insight, idx) => (
            <div key={idx} className="px-6 py-4 hover:bg-accent transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'alert' ? 'bg-[#F43F5E]/15' :
                  insight.type === 'success' ? 'bg-[#34D399]/15' :
                  insight.type === 'warning' ? 'bg-[#FBBF24]/15' :
                  'bg-[#0EA5E9]/15'
                }`}>
                  <AlertCircle className={`w-5 h-5 ${
                    insight.type === 'alert' ? 'text-[#F43F5E]' :
                    insight.type === 'success' ? 'text-[#34D399]' :
                    insight.type === 'warning' ? 'text-[#FBBF24]' :
                    'text-[#0EA5E9]'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-[14px] font-semibold text-foreground">{insight.title}</h4>
                    <span className="text-[12px] text-muted-foreground flex-shrink-0">{insight.timestamp}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
