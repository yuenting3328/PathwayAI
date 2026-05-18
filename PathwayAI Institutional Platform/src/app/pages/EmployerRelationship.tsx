import { Building2, Users, Calendar, Star, Briefcase, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import {
  employers,
  type EmployerRelationship as ER,
  type PartnershipPipeline,
  type EmployerSatisfactionTrend,
  type EmployerEvent,
  type PartnershipActivity,
  type SectorCount,
  type TalentHubMetric,
} from '../lib/api';

const SECTOR_COLORS: Record<string, string> = {
  Finance: '#6366F1',
  Technology: '#0EA5E9',
  'Professional Services': '#34D399',
  Healthcare: '#FBBF24',
  Education: '#A78BFA',
  Other: '#8A8A9E',
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export default function EmployerRelationship() {
  const [partnerships, setPartnerships] = useState<ER[]>([]);
  const [pipeline, setPipeline] = useState<PartnershipPipeline[]>([]);
  const [satisfactionTrends, setSatisfactionTrends] = useState<EmployerSatisfactionTrend[]>([]);
  const [eventData, setEventData] = useState<EmployerEvent[]>([]);
  const [activityFeed, setActivityFeed] = useState<PartnershipActivity[]>([]);
  const [sectorDist, setSectorDist] = useState<SectorCount[]>([]);
  const [talentHub, setTalentHub] = useState<TalentHubMetric[]>([]);

  useEffect(() => {
    Promise.all([
      employers.partnerships(),
      employers.pipeline(),
      employers.satisfactionTrends(),
      employers.events(),
      employers.activity(),
      employers.sectorDistribution(),
      employers.talentHub(),
    ]).then(([p, pl, st, ev, act, sd, th]) => {
      setPartnerships(p);
      setPipeline(pl);
      setSatisfactionTrends(st);
      setEventData(ev);
      setActivityFeed(act);
      setSectorDist(sd);
      setTalentHub(th);
    }).catch(console.error);
  }, []);

  const totalJobPostings = partnerships.reduce((sum, p) => sum + p.jobPostings, 0);
  const totalPlacements = partnerships.reduce((sum, p) => sum + p.placements, 0);

  const heroKPIs = [
    { label: 'Active Partnerships', value: partnerships.length ? String(partnerships.length) : '—', change: 'Across all tiers', icon: Building2, color: '#6366F1' },
    { label: 'Engagement Score', value: satisfactionTrends.length ? `${satisfactionTrends[satisfactionTrends.length - 1].overall}/10` : '—', change: 'Latest quarter', icon: Star, color: '#34D399' },
    { label: 'Job Postings', value: totalJobPostings ? String(totalJobPostings) : '—', change: `${totalPlacements} placements`, icon: Target, color: '#0EA5E9' },
    { label: 'Events Hosted', value: eventData.length ? String(eventData.reduce((s, e) => s + e.careerFairs + e.workshops + e.networking, 0)) : '—', change: 'This period', icon: Calendar, color: '#FBBF24' },
  ];

  const topPartnerships = [...partnerships]
    .sort((a, b) => b.placements - a.placements)
    .map((p) => ({
      employer: p.employer.name,
      type: p.tier === 'Platinum' ? 'Strategic' : p.tier === 'Gold' ? 'Preferred' : 'Standard',
      students: p.placements,
      events: p.internships,
      satisfaction: 8.5,
      value: p.tier,
    }));

  const sectorDistWithColors = sectorDist.map(s => ({
    ...s,
    color: SECTOR_COLORS[s.sector] ?? '#8A8A9E',
  }));

  const overallConversion = pipeline.length >= 2
    ? +((pipeline[pipeline.length - 1].count / pipeline[0].count) * 100).toFixed(1)
    : 0;

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
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15` }}>
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
              {pipeline.map((stage, idx) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-medium text-foreground">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-semibold text-[#6366F1]">{stage.count}</span>
                      {idx < pipeline.length - 1 && (
                        <span className="text-[13px] text-[#34D399]">{stage.conversionRate}% →</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-[#6366F1]"
                      style={{ width: `${pipeline[0]?.count ? (stage.count / pipeline[0].count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border text-center">
              <div className="text-[13px] text-muted-foreground">Overall Conversion Rate</div>
              <div className="text-[24px] font-semibold text-[#34D399] mt-1">{overallConversion}%</div>
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
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
                <Line type="monotone" dataKey="overall" stroke="#6366F1" strokeWidth={2.5} name="Overall" />
                <Line type="monotone" dataKey="graduates" stroke="#34D399" strokeWidth={2.5} name="Graduate Quality" />
                <Line type="monotone" dataKey="support" stroke="#0EA5E9" strokeWidth={2.5} name="Support Services" />
                <Line type="monotone" dataKey="processes" stroke="#FBBF24" strokeWidth={2.5} name="Processes" />
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
                <Pie data={sectorDistWithColors} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="count">
                  {sectorDistWithColors.map((entry) => (
                    <Cell key={entry.sector} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sectorDistWithColors.map((sector) => (
                <div key={sector.sector} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
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
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPartnerships.map((partner) => (
                  <tr key={partner.employer} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-[14px] text-foreground font-medium">{partner.employer}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-[12px] font-medium ${partner.type === 'Strategic' ? 'bg-[#6366F1]/15 text-[#6366F1]' : partner.type === 'Preferred' ? 'bg-[#0EA5E9]/15 text-[#0EA5E9]' : 'bg-muted text-muted-foreground'}`}>
                        {partner.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[14px] font-semibold text-foreground">{partner.students}</td>
                    <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{partner.events}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${partner.value === 'Platinum' ? 'bg-[#E5E7EB] text-[#6B7280]' : partner.value === 'Gold' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : 'bg-[#9CA3AF]/20 text-[#9CA3AF]'}`}>
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
              <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF' }} />
              <Bar yAxisId="left" dataKey="careerFairs" fill="#6366F1" name="Career Fairs" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="left" dataKey="workshops" fill="#0EA5E9" name="Workshops" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="left" dataKey="networking" fill="#34D399" name="Networking Events" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#FBBF24" strokeWidth={2.5} name="Total Attendance" />
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
              {talentHub.map((item: TalentHubMetric) => (
                <div key={item.metric} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] text-muted-foreground">{item.metric}</div>
                    <div className="text-[24px] font-semibold text-foreground mt-1">{item.value.toLocaleString()}</div>
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
            {activityFeed.map((activity: PartnershipActivity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-accent transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'new' ? 'bg-[#34D399]/15' : activity.type === 'event' ? 'bg-[#0EA5E9]/15' : activity.type === 'feedback' ? 'bg-[#FBBF24]/15' : activity.type === 'job' ? 'bg-[#6366F1]/15' : 'bg-muted'}`}>
                    {activity.type === 'new' && <Building2 className="w-4 h-4 text-[#34D399]" />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4 text-[#0EA5E9]" />}
                    {activity.type === 'feedback' && <Star className="w-4 h-4 text-[#FBBF24]" />}
                    {activity.type === 'job' && <Briefcase className="w-4 h-4 text-[#6366F1]" />}
                    {activity.type === 'meeting' && <Users className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-foreground">{activity.employer}</div>
                    <div className="text-[13px] text-muted-foreground mt-1">{activity.action}</div>
                    <div className="text-[12px] text-muted-foreground mt-1">{relativeTime(activity.createdAt)}</div>
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
