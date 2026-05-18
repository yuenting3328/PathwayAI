import { Users, TrendingUp, MessageSquare, Award, Briefcase, Building2, MapPin, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Sankey } from 'recharts';

export default function Alumni() {
  // Hero KPIs
  const heroKPIs = [
    { label: 'Active Alumni Network', value: '18,247', change: '+1,289 this year', icon: Users, color: '#6366F1' },
    { label: 'Career Trajectory Data', value: '84.3%', change: 'Coverage rate', icon: TrendingUp, color: '#34D399' },
    { label: 'AI Coaching Sessions', value: '3,458', change: '+487 this month', icon: MessageSquare, color: '#0EA5E9' },
    { label: 'Digital Badges Issued', value: '2,847', change: 'Across 47 programmes', icon: Award, color: '#FBBF24' },
  ];

  // Career trajectory (Sankey-style data)
  const careerProgression = [
    { years: '0-2 years', finance: 287, tech: 342, professional: 198, other: 156 },
    { years: '3-5 years', finance: 312, tech: 398, professional: 234, other: 142 },
    { years: '6-10 years', finance: 276, tech: 421, professional: 267, other: 128 },
    { years: '10+ years', finance: 234, tech: 389, professional: 298, other: 98 },
  ];

  // Salary progression
  const salaryProgression = [
    { years: '0-2', median: 18500, q1: 15000, q3: 24000 },
    { years: '3-5', median: 28500, q1: 22000, q3: 38000 },
    { years: '6-10', median: 42000, q1: 32000, q3: 58000 },
    { years: '10+', median: 62000, q1: 45000, q3: 85000 },
  ];

  // AI coaching metrics
  const coachingMetrics = [
    { week: 'Week 1', sessions: 387, satisfaction: 8.4, actionsTaken: 312 },
    { week: 'Week 2', sessions: 412, satisfaction: 8.6, actionsTaken: 334 },
    { week: 'Week 3', sessions: 445, satisfaction: 8.7, actionsTaken: 367 },
    { week: 'Week 4', sessions: 487, satisfaction: 8.9, actionsTaken: 398 },
  ];

  // Top employers (alumni)
  const topAlumniEmployers = [
    { employer: 'HSBC', alumni: 1247, sectors: ['Finance', 'Technology'], avgTenure: '4.2 years' },
    { employer: 'Government of HKSAR', alumni: 987, sectors: ['Public Administration', 'Education'], avgTenure: '6.8 years' },
    { employer: 'Alibaba Group', alumni: 856, sectors: ['Technology', 'E-commerce'], avgTenure: '3.1 years' },
    { employer: 'Hospital Authority', alumni: 743, sectors: ['Healthcare', 'Research'], avgTenure: '5.4 years' },
    { employer: 'Deloitte', alumni: 682, sectors: ['Professional Services', 'Consulting'], avgTenure: '3.8 years' },
  ];

  // Geographic distribution
  const geographicData = [
    { location: 'Hong Kong', count: 14287, percentage: 78 },
    { location: 'Mainland China', count: 2189, percentage: 12 },
    { location: 'Singapore', count: 876, percentage: 5 },
    { location: 'UK', count: 547, percentage: 3 },
    { location: 'Others', count: 348, percentage: 2 },
  ];

  // Alumni network engagement
  const engagementData = [
    { month: 'Jan', mentorship: 187, events: 12, jobPostings: 43 },
    { month: 'Feb', mentorship: 203, events: 15, jobPostings: 38 },
    { month: 'Mar', mentorship: 234, events: 18, jobPostings: 52 },
    { month: 'Apr', mentorship: 267, events: 14, jobPostings: 47 },
    { month: 'May', mentorship: 289, events: 21, jobPostings: 61 },
    { month: 'Jun', mentorship: 312, events: 19, jobPostings: 58 },
  ];

  // Digital credentials (alumni)
  const credentialActivity = [
    { type: 'HEAR Credentials', issued: 4247, shared: 2908, verified: 2456 },
    { type: 'Digital Badges', issued: 2847, shared: 1987, verified: 1678 },
    { type: 'Certificates', issued: 1543, shared: 1089, verified: 934 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Alumni Continuity</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Career tracking, AI coaching, and alumni network insights</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] text-[#6366F1] hover:bg-accent transition-colors">
            Alumni Directory
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Export Report
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

      {/* Career Progression & Salary Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Career Trajectory by Sector</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Alumni career progression over time</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={careerProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="years" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar key="finance" dataKey="finance" stackId="a" fill="#6366F1" name="Finance" />
                <Bar key="tech" dataKey="tech" stackId="a" fill="#0EA5E9" name="Technology" />
                <Bar key="professional" dataKey="professional" stackId="a" fill="#34D399" name="Professional Services" />
                <Bar key="other" dataKey="other" stackId="a" fill="#FBBF24" name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Salary Progression Over Time</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Median with quartile ranges</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salaryProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis dataKey="years" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F1F28',
                    border: '1px solid #3A3A48',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#FFFFFF',
                  }}
                  formatter={(value) => `HKD $${value.toLocaleString()}`}
                />
                <Line key="q1" type="monotone" dataKey="q1" stroke="#8A8A9E" strokeDasharray="3 3" strokeWidth={1.5} name="Q1 (25th %ile)" />
                <Line key="median" type="monotone" dataKey="median" stroke="#6366F1" strokeWidth={3} name="Median" />
                <Line key="q3" type="monotone" dataKey="q3" stroke="#8A8A9E" strokeDasharray="3 3" strokeWidth={1.5} name="Q3 (75th %ile)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-[12px]">
              <div>
                <div className="text-muted-foreground">Entry Level</div>
                <div className="text-[16px] font-semibold text-foreground mt-1">$18.5K</div>
              </div>
              <div>
                <div className="text-muted-foreground">Mid-Career</div>
                <div className="text-[16px] font-semibold text-foreground mt-1">$42K</div>
              </div>
              <div>
                <div className="text-muted-foreground">Senior</div>
                <div className="text-[16px] font-semibold text-foreground mt-1">$62K</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Career Coaching Metrics */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">AI Career Coaching Performance</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Session volume, satisfaction scores, and action completion rates</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={coachingMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis dataKey="week" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis key="left" yAxisId="left" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis key="right" yAxisId="right" orientation="right" stroke="#8A8A9E" style={{ fontSize: '12px' }} domain={[8, 9]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1F28',
                  border: '1px solid #3A3A48',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              />
              <Line key="sessions" yAxisId="left" type="monotone" dataKey="sessions" stroke="#6366F1" strokeWidth={2.5} name="Sessions" />
              <Line key="actionsTaken" yAxisId="left" type="monotone" dataKey="actionsTaken" stroke="#34D399" strokeWidth={2.5} name="Actions Taken" />
              <Line key="satisfaction" yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#FBBF24" strokeWidth={2.5} name="Satisfaction" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-[13px] text-muted-foreground">Total Sessions</div>
              <div className="text-[20px] font-semibold text-[#6366F1] mt-1">3,458</div>
            </div>
            <div className="text-center">
              <div className="text-[13px] text-muted-foreground">Avg Satisfaction</div>
              <div className="text-[20px] font-semibold text-[#FBBF24] mt-1">8.7/10</div>
            </div>
            <div className="text-center">
              <div className="text-[13px] text-muted-foreground">Action Rate</div>
              <div className="text-[20px] font-semibold text-[#34D399] mt-1">82.3%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Alumni Employers & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Top Alumni Employers</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Organizations with largest alumni presence</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topAlumniEmployers.map((employer, idx) => (
                <div key={employer.employer} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[14px] font-medium text-foreground">{employer.employer}</div>
                      <div className="text-[16px] font-semibold text-[#6366F1]">{employer.alumni}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span>{employer.sectors.join(' • ')}</span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-1">Avg tenure: {employer.avgTenure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Geographic Distribution</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Alumni location worldwide</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {geographicData.map((geo) => (
                <div key={geo.location}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-[14px] font-medium text-foreground">{geo.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] text-muted-foreground">{geo.count.toLocaleString()}</span>
                      <span className="text-[14px] font-semibold text-foreground">{geo.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#6366F1]"
                      style={{ width: `${geo.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Network Engagement */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Alumni Network Engagement</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Mentorship connections, events, and job postings</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis dataKey="month" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8A8A9E" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F1F28',
                  border: '1px solid #3A3A48',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                }}
              />
              <Bar key="mentorship" dataKey="mentorship" fill="#6366F1" name="Mentorship Connections" radius={[6, 6, 0, 0]} />
              <Bar key="events" dataKey="events" fill="#0EA5E9" name="Events Attended" radius={[6, 6, 0, 0]} />
              <Bar key="jobPostings" dataKey="jobPostings" fill="#34D399" name="Job Postings" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Digital Credentials Activity */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Digital Credentials Activity (Alumni)</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Credential sharing and verification by type</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Credential Type</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Issued</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Shared</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Share Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {credentialActivity.map((cred) => (
                <tr key={cred.type} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{cred.type}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">{cred.issued.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">{cred.shared.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">{cred.verified.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-[#34D399]"
                          style={{ width: `${(cred.shared / cred.issued) * 100}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-semibold text-[#34D399]">
                        {Math.round((cred.shared / cred.issued) * 100)}%
                      </span>
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
