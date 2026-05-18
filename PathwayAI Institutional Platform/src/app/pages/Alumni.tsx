import { Users, TrendingUp, MessageSquare, Award, Building2, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { analytics, employers, institution, type InstitutionAnalytics, type EmployerRelationship, type IssuedCredential, type GraduateOutcome, type AlumniCareerStage, type AlumniSalaryStage, type AlumniEngagement, type CoachingWeekMetric } from '../lib/api';

export default function Alumni() {
  const [analyticsData, setAnalyticsData] = useState<InstitutionAnalytics | null>(null);
  const [partnerships, setPartnerships] = useState<EmployerRelationship[]>([]);
  const [credentials, setCredentials] = useState<IssuedCredential[]>([]);
  const [outcomes, setOutcomes] = useState<GraduateOutcome[]>([]);
  const [careerStages, setCareerStages] = useState<AlumniCareerStage[]>([]);
  const [salaryStages, setSalaryStages] = useState<AlumniSalaryStage[]>([]);
  const [engagements, setEngagements] = useState<AlumniEngagement[]>([]);
  const [fetchedCoachingMetrics, setFetchedCoachingMetrics] = useState<CoachingWeekMetric[]>([]);

  useEffect(() => {
    Promise.all([
      analytics.institution(),
      employers.partnerships(),
      institution.credentials(),
      institution.outcomes(),
      institution.careerStages(),
      institution.salaryStages(),
      institution.engagement(),
      institution.coachingMetrics(),
    ]).then(([a, p, c, o, cs, ss, eng, cm]) => {
      setAnalyticsData(a);
      setPartnerships(p);
      setCredentials(c);
      setOutcomes(o);
      setCareerStages(cs);
      setSalaryStages(ss);
      setEngagements(eng);
      setFetchedCoachingMetrics(cm);
    }).catch(console.error);
  }, []);

  // Hero KPIs
  const heroKPIs = [
    { label: 'Active Alumni Network', value: analyticsData ? analyticsData.alumniCount.toLocaleString() : '—', change: 'Total graduates on platform', icon: Users, color: '#6366F1' },
    { label: 'Career Trajectory Data', value: '84.3%', change: 'Coverage rate', icon: TrendingUp, color: '#34D399' },
    { label: 'AI Coaching Sessions', value: analyticsData ? analyticsData.coachingSessionCount.toLocaleString() : '—', change: 'Total sessions completed', icon: MessageSquare, color: '#0EA5E9' },
    { label: 'Digital Badges Issued', value: analyticsData ? analyticsData.credentialsIssued.toLocaleString() : '—', change: 'Across all programmes', icon: Award, color: '#FBBF24' },
  ];

  // Career trajectory grouped by yearsRange → sector columns
  const careerProgression = (() => {
    const grouped: Record<string, Record<string, number>> = {};
    careerStages.forEach((s: AlumniCareerStage) => {
      if (!grouped[s.yearsRange]) grouped[s.yearsRange] = {};
      const key = s.sector === 'Technology' ? 'tech'
        : s.sector === 'Professional Services' ? 'professional'
        : s.sector.toLowerCase();
      grouped[s.yearsRange][key] = s.count;
    });
    return Object.entries(grouped).map(([years, sectors]) => ({ years, ...sectors }));
  })();

  // Salary progression from DB
  const salaryProgression = salaryStages.map((s: AlumniSalaryStage) => ({
    years: s.yearsRange,
    median: s.medianSalary,
    q1: s.q1Salary,
    q3: s.q3Salary,
  }));

  // AI coaching metrics from DB
  const coachingMetrics = fetchedCoachingMetrics;
  const avgSatisfaction = coachingMetrics.length
    ? (coachingMetrics.reduce((sum: number, m: CoachingWeekMetric) => sum + m.satisfaction, 0) / coachingMetrics.length).toFixed(1)
    : '—';

  // Top employers from partnerships
  const topAlumniEmployers = [...partnerships]
    .sort((a: EmployerRelationship, b: EmployerRelationship) => b.placements - a.placements)
    .slice(0, 5)
    .map((p: EmployerRelationship) => ({
      employer: p.employer.name,
      placements: p.placements,
      sector: p.employer.sector ?? 'N/A',
      tier: p.tier,
    }));

  // Geographic distribution from outcomes
  const geographicData = (() => {
    const counts: Record<string, number> = {};
    outcomes.forEach(o => {
      const geo = o.geography ?? 'Unknown';
      counts[geo] = (counts[geo] ?? 0) + 1;
    });
    const total = outcomes.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([location, count]) => ({
        location,
        count,
        percentage: +((count / total) * 100).toFixed(1),
      }));
  })();

  // Alumni network engagement from DB
  const engagementData = engagements.map((e: AlumniEngagement) => ({
    month: e.month,
    mentorship: e.mentorshipConnections,
    events: e.eventsAttended,
    jobPostings: e.jobPostings,
  }));

  // Digital credentials from API grouped by name
  const credentialActivity = (() => {
    const groups: Record<string, { issued: number; verified: number }> = {};
    credentials.forEach(c => {
      const key = c.name || c.type;
      if (!groups[key]) groups[key] = { issued: 0, verified: 0 };
      groups[key].issued += 1;
      if (c.status === 'VERIFIED') groups[key].verified += 1;
    });
    return Object.entries(groups).map(([type, stats]) => ({ type, ...stats }));
  })();

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
                <div className="text-[16px] font-semibold text-foreground mt-1">
                  {salaryStages[0] ? `$${(salaryStages[0].medianSalary / 1000).toFixed(1)}K` : '—'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Mid-Career</div>
                <div className="text-[16px] font-semibold text-foreground mt-1">
                  {salaryStages[2] ? `$${(salaryStages[2].medianSalary / 1000).toFixed(0)}K` : '—'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Senior</div>
                <div className="text-[16px] font-semibold text-foreground mt-1">
                  {salaryStages[3] ? `$${(salaryStages[3].medianSalary / 1000).toFixed(0)}K` : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Career Coaching Metrics */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">AI Career Coaching Performance</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Session volume and satisfaction scores over the last 4 weeks</p>
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
              <Line key="satisfaction" yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#FBBF24" strokeWidth={2.5} name="Satisfaction" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-[13px] text-muted-foreground">Total Sessions</div>
              <div className="text-[20px] font-semibold text-[#6366F1] mt-1">{analyticsData ? analyticsData.coachingSessionCount.toLocaleString() : '—'}</div>
            </div>
            <div className="text-center">
              <div className="text-[13px] text-muted-foreground">Avg Satisfaction</div>
              <div className="text-[20px] font-semibold text-[#FBBF24] mt-1">{avgSatisfaction}/10</div>
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
                      <div className="text-[16px] font-semibold text-[#6366F1]">{employer.placements} placements</div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span>{employer.sector}</span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-1">Tier: {employer.tier}</div>
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
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Verify Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {credentialActivity.map((cred) => (
                <tr key={cred.type} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{cred.type}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">{cred.issued.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-[14px] font-mono text-foreground">{cred.verified.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-[#34D399]"
                          style={{ width: `${cred.issued > 0 ? (cred.verified / cred.issued) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-semibold text-[#34D399]">
                        {cred.issued > 0 ? Math.round((cred.verified / cred.issued) * 100) : 0}%
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
