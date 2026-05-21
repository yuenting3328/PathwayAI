import { Briefcase, Users, TrendingUp, Clock, Building2, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analytics, type RecruiterAnalytics } from '../lib/api';

const FALLBACK: RecruiterAnalytics = {
  activeJobs: 12,
  totalApplications: 347,
  shortlisted: 58,
  offersMade: 14,
  avgTimeToHire: 23,
  topUniversity: 'CUHK',
  pipelineTrend: [
    { month: 'Jan', applications: 42, shortlisted: 8, offers: 2 },
    { month: 'Feb', applications: 55, shortlisted: 10, offers: 3 },
    { month: 'Mar', applications: 61, shortlisted: 12, offers: 2 },
    { month: 'Apr', applications: 70, shortlisted: 14, offers: 3 },
    { month: 'May', applications: 78, shortlisted: 9, offers: 2 },
    { month: 'Jun', applications: 41, shortlisted: 5, offers: 2 },
  ],
  sectorBreakdown: [
    { sector: 'Finance', count: 98 },
    { sector: 'Technology', count: 87 },
    { sector: 'Consulting', count: 62 },
    { sector: 'Operations', count: 45 },
    { sector: 'Marketing', count: 55 },
  ],
};

export default function Dashboard() {
  const [data, setData] = useState<RecruiterAnalytics>(FALLBACK);

  useEffect(() => {
    analytics.overview().then(setData).catch(() => {});
  }, []);

  const kpis = [
    { label: 'Active Jobs', value: data.activeJobs, icon: Briefcase, color: '#6366F1', change: '+3 this month' },
    { label: 'Total Applications', value: data.totalApplications, icon: Users, color: '#0EA5E9', change: '+41 this week' },
    { label: 'Shortlisted', value: data.shortlisted, icon: TrendingUp, color: '#34D399', change: `${Math.round(data.shortlisted / data.totalApplications * 100)}% rate` },
    { label: 'Avg Time to Hire', value: `${data.avgTimeToHire}d`, icon: Clock, color: '#FBBF24', change: '−2d vs last month' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}18` }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#34D399]" />
            </div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-[28px] font-semibold text-foreground">{kpi.value}</div>
            <div className="text-[12px] text-[#34D399] mt-1">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Pipeline trend + sector breakdown */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Hiring Pipeline Trend</h3>
            <p className="text-[12px] text-muted-foreground">Applications → Shortlisted → Offers</p>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.pipelineTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="applications" stroke="#6366F1" strokeWidth={2} dot={false} name="Applications" />
                <Line type="monotone" dataKey="shortlisted" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Shortlisted" />
                <Line type="monotone" dataKey="offers" stroke="#34D399" strokeWidth={2} dot={false} name="Offers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-[16px] font-semibold text-foreground">Applications by Role Type</h3>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.sectorBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" horizontal={false} />
                <XAxis type="number" stroke="#8A8A9E" style={{ fontSize: '11px' }} />
                <YAxis type="category" dataKey="sector" stroke="#8A8A9E" style={{ fontSize: '11px' }} width={72} />
                <Tooltip contentStyle={{ backgroundColor: '#1F1F28', border: '1px solid #3A3A48', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} name="Applicants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#6366F1]" />
            <h4 className="text-[14px] font-semibold text-foreground">Top University Partner</h4>
          </div>
          <p className="text-[26px] font-bold text-foreground">{data.topUniversity}</p>
          <p className="text-[12px] text-muted-foreground mt-1">Most applications sourced</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <h4 className="text-[14px] font-semibold text-foreground">Offer Conversion Rate</h4>
          </div>
          <p className="text-[26px] font-bold text-[#34D399]">{Math.round(data.offersMade / data.totalApplications * 100)}%</p>
          <p className="text-[12px] text-muted-foreground mt-1">{data.offersMade} offers from {data.totalApplications} applications</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#0EA5E9]" />
            <h4 className="text-[14px] font-semibold text-foreground">Shortlist Rate</h4>
          </div>
          <p className="text-[26px] font-bold text-[#0EA5E9]">{Math.round(data.shortlisted / data.totalApplications * 100)}%</p>
          <p className="text-[12px] text-muted-foreground mt-1">{data.shortlisted} candidates shortlisted</p>
        </div>
      </div>
    </div>
  );
}
