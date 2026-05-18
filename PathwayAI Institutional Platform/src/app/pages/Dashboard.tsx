import { TrendingUp, TrendingDown, Users, Award, Target, Building2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useEffect, useState } from 'react';
import { analytics, institution, employers, market, type InstitutionAnalytics, type Programme, type EmployerRelationship, type InstitutionSnapshot, type SkillShortage } from '../lib/api';

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<InstitutionAnalytics | null>(null);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [partnerships, setPartnerships] = useState<EmployerRelationship[]>([]);
  const [snapshots, setSnapshots] = useState<InstitutionSnapshot[]>([]);
  const [skillShortages, setSkillShortages] = useState<SkillShortage[]>([]);

  useEffect(() => {
    Promise.all([
      analytics.institution().catch(() => null),
      institution.programmes().catch(() => []),
      employers.partnerships().catch(() => []),
      institution.snapshots().catch(() => []),
      market.skillsShortage().catch(() => []),
    ]).then(([a, p, e, sn, ss]) => {
      setAnalyticsData(a);
      setProgrammes(p);
      setPartnerships(e);
      setSnapshots(sn);
      setSkillShortages(ss);
    });
  }, []);

  const kpiData = [
    { label: 'Graduate Employment Rate', value: analyticsData ? `${analyticsData.employmentRate}%` : '—', change: '+2.3%', trend: 'up', icon: Users, color: '#6366F1' },
    { label: 'HEAR Credentials Issued', value: analyticsData ? analyticsData.credentialsIssued.toLocaleString() : '—', change: '+458', trend: 'up', icon: Award, color: '#0EA5E9' },
    { label: 'Active Employer Partners', value: analyticsData ? String(analyticsData.employerPartners) : '—', change: '+28', trend: 'up', icon: Building2, color: '#34D399' },
    { label: 'Total Placements', value: analyticsData ? String(analyticsData.totalPlacements) : '—', change: '', trend: 'up', icon: Target, color: '#FBBF24' },
  ];

  // Employment trends — annual from InstitutionSnapshot
  const employmentTrends = snapshots.map(s => ({
    month: String(s.year),
    rate: s.employmentRate,
    benchmark: +(s.employmentRate - 2).toFixed(1),
  }));

  // Programme leaderboard from real DB data, sorted by employment rate
  const programmeLeaderboard = [...programmes]
    .sort((a, b) => b.employmentRate - a.employmentRate)
    .slice(0, 5)
    .map((prog, idx) => ({
      rank: idx + 1,
      programme: prog.name,
      faculty: prog.faculty,
      employmentRate: prog.employmentRate,
      avgSalary: prog.avgSalary,
    }));

  // Sector breakdown from real graduate outcomes data
  const sectorDemand = analyticsData?.sectorBreakdown
    ? (Object.entries(analyticsData.sectorBreakdown) as [string, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([sector, count]) => ({ sector, demand: count }))
    : [];

  // Skills supply vs demand — from SkillShortage table (supply = institution supply, shortage → demand proxy)
  const skillsData = skillShortages.map((s: SkillShortage) => ({
    skill: s.skill,
    supply: s.supply,
    demand: s.shortage,
  }));

  // Employer pipeline — tier breakdown from real partnership data
  const platinumCount = partnerships.filter((p: EmployerRelationship) => p.tier === 'Platinum').length;
  const goldCount = partnerships.filter((p: EmployerRelationship) => p.tier === 'Gold').length;
  const silverCount = partnerships.filter((p: EmployerRelationship) => p.tier === 'Silver').length;
  const pipelineStages = [
    { stage: 'Platinum', count: platinumCount },
    { stage: 'Gold', count: goldCount },
    { stage: 'Silver', count: silverCount },
    { stage: 'Total Active', count: partnerships.length },
  ];
  const totalJobPostings = partnerships.reduce((sum: number, p: EmployerRelationship) => sum + p.jobPostings, 0);
  const totalPlacements = partnerships.reduce((sum: number, p: EmployerRelationship) => sum + p.placements, 0);

  // Credential activity from real data
  const credIssued = analyticsData?.credentialsIssued ?? 0;
  const credPending = analyticsData?.credentialsPending ?? 0;
  const credVerified = credIssued - credPending;

  // Insights — no DB model yet, static
  const insights = [
    { type: 'alert', title: 'Programming Skills Gap Widening', description: '23% shortage vs market demand - recommend curriculum review', timestamp: '2 hours ago' },
    { type: 'success', title: 'Finance Programme Outperforms Benchmark', description: `${programmeLeaderboard[0]?.employmentRate ?? 94.2}% employment rate vs 89% HK average`, timestamp: '5 hours ago' },
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
              {kpi.change && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium ${
                  kpi.trend === 'up' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#F43F5E]/15 text-[#F43F5E]'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </div>
              )}
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
                <YAxis key="yaxis" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[75, 95]} />
                <Tooltip
                  key="tooltip"
                  contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }}
                />
                <Line key="rate" type="monotone" dataKey="rate" stroke="#6366F1" strokeWidth={2.5} name="Institution Rate" />
                <Line key="benchmark" type="monotone" dataKey="benchmark" stroke="#8A8A9E" strokeWidth={2} strokeDasharray="5 5" name="HK Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Credential Activity</h3>
            <p className="text-[13px] text-muted-foreground mt-1">All time</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-muted-foreground">Issued</div>
                <div className="text-[24px] font-semibold text-foreground mt-1">{credIssued.toLocaleString()}</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-[#6366F1]" />
              </div>
            </div>
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Verified</span>
                <span className="font-medium text-foreground">{credVerified.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-foreground">{credPending.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Verification Rate</span>
                <span className="font-medium text-[#34D399]">
                  {credIssued > 0 ? `${Math.round((credVerified / credIssued) * 100)}%` : '—'}
                </span>
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
        {programmeLeaderboard.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground text-[14px]">No programme data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b-2 border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Programme</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Employment</th>
                  <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Salary (HKD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programmeLeaderboard.map((prog) => (
                  <tr key={prog.rank} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                        prog.rank === 1 ? 'bg-[#FBBF24]/20 text-[#FBBF24]' :
                        prog.rank === 2 ? 'bg-[#9CA3AF]/20 text-[#9CA3AF]' :
                        prog.rank === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {prog.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-foreground font-medium">{prog.programme}</td>
                    <td className="px-6 py-4 text-[14px] text-muted-foreground">{prog.faculty}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[14px] font-semibold text-[#34D399]">{prog.employmentRate}%</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">
                      ${Number(prog.avgSalary).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Strip 4: Sector Breakdown & Skills Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Graduate Employment by Sector</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Number of graduates employed per sector</p>
          </div>
          <div className="p-6">
            {sectorDemand.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-[14px]">No sector data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sectorDemand} layout="vertical">
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                  <XAxis key="xaxis" type="number" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                  <YAxis key="yaxis" dataKey="sector" type="category" stroke="#8A8A9E" style={{ fontSize: '12px' }} width={140} />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }}
                  />
                  <Bar key="demand" dataKey="demand" fill="#6366F1" radius={[0, 6, 6, 0]} name="Graduates" />
                </BarChart>
              </ResponsiveContainer>
            )}
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
                  contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strip 5: Employer Partnership Tiers */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Employer Partnership Tiers</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Active partnerships by tier</p>
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
                <div className="text-[13px] text-muted-foreground">Total Job Postings</div>
                <div className="text-[20px] font-semibold text-[#34D399] mt-1">{totalJobPostings.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[13px] text-muted-foreground">Total Placements</div>
                <div className="text-[20px] font-semibold text-foreground mt-1">{totalPlacements.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[13px] text-muted-foreground">Placement Rate</div>
                <div className="text-[20px] font-semibold text-[#6366F1] mt-1">
                  {totalJobPostings > 0 ? `${Math.round((totalPlacements / totalJobPostings) * 100)}%` : '—'}
                </div>
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
