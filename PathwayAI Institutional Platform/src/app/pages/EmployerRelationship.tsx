import { Building2, Users, Calendar, TrendingUp, MessageSquare, Star, Briefcase, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { employers, type EmployerRelationship as ER } from '../lib/api';

export default function EmployerRelationship() {
  const [partnerships, setPartnerships] = useState<ER[]>([]);

  useEffect(() => {
    employers.partnerships().then(setPartnerships).catch(console.error);
  }, []);

  const totalJobPostings = partnerships.reduce((sum, p) => sum + p.jobPostings, 0);
  const totalPlacements = partnerships.reduce((sum, p) => sum + p.placements, 0);

  const heroKPIs = [
    { label: 'Active Partnerships', value: partnerships.length ? String(partnerships.length) : '342', change: '+28 this quarter', icon: Building2, color: '#6366F1' },
    { label: 'Engagement Score', value: '8.4/10', change: '+0.3 vs last survey', icon: Star, color: '#34D399' },
    { label: 'Job Postings', value: totalJobPostings ? String(totalJobPostings) : '287', change: `${totalPlacements} placements`, icon: Target, color: '#0EA5E9' },
    { label: 'Events Hosted', value: '67', change: '12 upcoming', icon: Calendar, color: '#FBBF24' },
  ];

  // Partnership pipeline (funnel)
  const pipelineData = [
    { stage: 'Prospecting', count: 48, conversionRate: 67 },
    { stage: 'Initial Contact', count: 32, conversionRate: 75 },
    { stage: 'Engaged', count: 24, conversionRate: 75 },
    { stage: 'Partnership Active', count: 18, conversionRate: 100 },
  ];

  // Employer satisfaction trends
  const satisfactionTrends = [
    { quarter: 'Q1 2025', overall: 8.1, graduates: 7.8, support: 8.3, processes: 7.9 },
    { quarter: 'Q2 2025', overall: 8.2, graduates: 8.0, support: 8.4, processes: 8.1 },
    { quarter: 'Q3 2025', overall: 8.3, graduates: 8.2, support: 8.5, processes: 8.2 },
    { quarter: 'Q4 2025', overall: 8.4, graduates: 8.3, support: 8.6, processes: 8.3 },
  ];

  // Employer portfolio by sector
  const sectorDistribution = [
    { sector: 'Finance', count: 87, color: '#6366F1' },
    { sector: 'Technology', count: 76, color: '#0EA5E9' },
    { sector: 'Professional Services', count: 64, color: '#34D399' },
    { sector: 'Healthcare', count: 43, color: '#FBBF24' },
    { sector: 'Education', count: 38, color: '#A78BFA' },
    { sector: 'Other', count: 34, color: '#8A8A9E' },
  ];

  // Top partnerships
  const topPartnerships = partnerships.length
    ? partnerships.map((p) => ({
        employer: p.employer.name,
        type: p.tier === 'Platinum' ? 'Strategic' : p.tier === 'Gold' ? 'Preferred' : 'Standard',
        students: p.placements,
        events: p.internships,
        satisfaction: 8.5,
        value: p.tier,
      }))
    : [
        { employer: 'HSBC', type: 'Strategic', students: 127, events: 8, satisfaction: 9.2, value: 'Platinum' },
        { employer: 'Alibaba Cloud', type: 'Strategic', students: 98, events: 12, satisfaction: 9.0, value: 'Platinum' },
        { employer: 'Deloitte', type: 'Preferred', students: 87, events: 6, satisfaction: 8.8, value: 'Gold' },
      ];

  // Event engagement
  const eventData = [
    { month: 'Jan', careerFairs: 2, workshops: 4, networking: 3, attendance: 487 },
    { month: 'Feb', careerFairs: 1, workshops: 5, networking: 4, attendance: 534 },
    { month: 'Mar', careerFairs: 3, workshops: 6, networking: 5, attendance: 678 },
    { month: 'Apr', careerFairs: 2, workshops: 4, networking: 3, attendance: 512 },
    { month: 'May', careerFairs: 1, workshops: 7, networking: 6, attendance: 623 },
    { month: 'Jun', careerFairs: 4, workshops: 5, networking: 4, attendance: 789 },
  ];

  // Talent Hub activity
  const talentHubData = [
    { metric: 'Job Postings', value: 287, change: '+34 this month' },
    { metric: 'Internship Offers', value: 142, change: '+18 this month' },
    { metric: 'Student Applications', value: 1876, change: '+234 this month' },
    { metric: 'Placements Made', value: 98, change: '+12 this month' },
  ];

  // Recent activity feed
  const activityFeed = [
    { type: 'new', employer: 'Deloitte HK', action: 'MoU signed for 15 internship placements', timestamp: '2 hours ago' },
    { type: 'event', employer: 'HSBC', action: 'Career workshop scheduled for July 15', timestamp: '5 hours ago' },
    { type: 'feedback', employer: 'Alibaba Cloud', action: 'Submitted employer satisfaction survey (9.0/10)', timestamp: '1 day ago' },
    { type: 'job', employer: 'JP Morgan', action: 'Posted 8 new graduate positions', timestamp: '2 days ago' },
    { type: 'meeting', employer: 'Hospital Authority', action: 'Partnership renewal meeting completed', timestamp: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Employer Relationship Management</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Partnership pipeline, engagement, and talent hub operations</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] text-[#6366F1] hover:bg-accent transition-colors">
            Employer Directory
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Add New Partnership
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
            <div className="text-[13px] text-muted-foreground">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Partnership Pipeline & Satisfaction Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Partnership Development Pipeline</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Conversion funnel and stage progression</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pipelineData.map((stage, idx) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-medium text-foreground">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-semibold text-[#6366F1]">{stage.count}</span>
                      {idx < pipelineData.length - 1 && (
                        <span className="text-[13px] text-[#34D399]">{stage.conversionRate}% →</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-[#6366F1]"
                      style={{ width: `${(stage.count / pipelineData[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border text-center">
              <div className="text-[13px] text-muted-foreground">Overall Conversion Rate</div>
              <div className="text-[24px] font-semibold text-[#34D399] mt-1">37.5%</div>
              <div className="text-[12px] text-muted-foreground mt-1">Prospecting → Active Partnership</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Employer Satisfaction Trends</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Quarterly satisfaction metrics</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={satisfactionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="quarter" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[7.5, 9]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                />
                <Line key="overall" type="monotone" dataKey="overall" stroke="#6366F1" strokeWidth={2.5} name="Overall" />
                <Line key="graduates" type="monotone" dataKey="graduates" stroke="#34D399" strokeWidth={2.5} name="Graduate Quality" />
                <Line key="support" type="monotone" dataKey="support" stroke="#0EA5E9" strokeWidth={2.5} name="Support Services" />
                <Line key="processes" type="monotone" dataKey="processes" stroke="#FBBF24" strokeWidth={2.5} name="Processes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sector Distribution & Top Partnerships */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Partner Portfolio</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Distribution by sector</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {sectorDistribution.map((entry) => (
                    <Cell key={entry.sector} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sectorDistribution.map((sector) => (
                <div key={sector.sector} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                    <span className="text-muted-foreground">{sector.sector}</span>
                  </div>
                  <span className="text-foreground font-medium">{sector.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Top Strategic Partnerships</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Key employer relationships and performance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b-2 border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Employer</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Events</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Satisfaction</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPartnerships.map((partner) => (
                  <tr key={partner.employer} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-[14px] text-foreground font-medium">{partner.employer}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-[12px] font-medium ${
                        partner.type === 'Strategic' ? 'bg-[#6366F1]/15 text-[#6366F1]' :
                        partner.type === 'Preferred' ? 'bg-[#0EA5E9]/15 text-[#0EA5E9]' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {partner.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[14px] font-semibold text-foreground">{partner.students}</td>
                    <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{partner.events}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                        <span className="text-[14px] font-semibold text-foreground">{partner.satisfaction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${
                        partner.value === 'Platinum' ? 'bg-[#E5E7EB] text-[#6B7280]' :
                        partner.value === 'Gold' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' :
                        'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                      }`}>
                        {partner.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Engagement */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Event Engagement Trends</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Career fairs, workshops, and networking events</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis key="left" yAxisId="left" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis key="right" yAxisId="right" orientation="right" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1F28',
                  border: '1px solid #3A3A48',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              />
              <Bar key="careerFairs" yAxisId="left" dataKey="careerFairs" fill="#6366F1" name="Career Fairs" radius={[6, 6, 0, 0]} />
              <Bar key="workshops" yAxisId="left" dataKey="workshops" fill="#0EA5E9" name="Workshops" radius={[6, 6, 0, 0]} />
              <Bar key="networking" yAxisId="left" dataKey="networking" fill="#34D399" name="Networking Events" radius={[6, 6, 0, 0]} />
              <Line key="attendance" yAxisId="right" type="monotone" dataKey="attendance" stroke="#FBBF24" strokeWidth={2.5} name="Total Attendance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Talent Hub Metrics & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Co-Branded Talent Hub</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Platform activity metrics</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {talentHubData.map((item) => (
                <div key={item.metric} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] text-muted-foreground">{item.metric}</div>
                    <div className="text-[24px] font-semibold text-foreground mt-1">{item.value}</div>
                    <div className="text-[12px] text-[#34D399] mt-1">{item.change}</div>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-[#6366F1]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Recent Activity</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Latest partnership interactions</p>
          </div>
          <div className="divide-y divide-border">
            {activityFeed.map((activity, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-accent transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'new' ? 'bg-[#34D399]/15' :
                    activity.type === 'event' ? 'bg-[#0EA5E9]/15' :
                    activity.type === 'feedback' ? 'bg-[#FBBF24]/15' :
                    activity.type === 'job' ? 'bg-[#6366F1]/15' :
                    'bg-muted'
                  }`}>
                    {activity.type === 'new' && <Building2 className="w-4 h-4 text-[#34D399]" />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4 text-[#0EA5E9]" />}
                    {activity.type === 'feedback' && <Star className="w-4 h-4 text-[#FBBF24]" />}
                    {activity.type === 'job' && <Briefcase className="w-4 h-4 text-[#6366F1]" />}
                    {activity.type === 'meeting' && <Users className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-foreground">{activity.employer}</div>
                    <div className="text-[13px] text-muted-foreground mt-1">{activity.action}</div>
                    <div className="text-[12px] text-muted-foreground mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
