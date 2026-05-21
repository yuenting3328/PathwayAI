import { Award, Share2, CheckCircle, Download, TrendingUp, ExternalLink, Calendar, FileCheck, Plus, Search, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEffect, useState } from 'react';
import { institution, graduates, type IssuedCredential, type GraduateSearchResult } from '../lib/api';

export default function CredentialManagement() {
  const [credentials, setCredentials] = useState<IssuedCredential[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraduateSearchResult[]>([]);
  const [searchError, setSearchError] = useState('');
  const [selectedGraduate, setSelectedGraduate] = useState<GraduateSearchResult | null>(null);
  const [issueType, setIssueType] = useState('HEAR');
  const [issueName, setIssueName] = useState('');
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState('');

  useEffect(() => {
    institution.credentials().then(setCredentials).catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); setSearchError(''); return; }
    const timer = setTimeout(() => {
      graduates.search(searchQuery)
        .then(r => { setSearchResults(r); setSearchError(r.length === 0 ? 'No graduates found' : ''); })
        .catch((err: unknown) => {
          setSearchResults([]);
          setSearchError(err instanceof Error ? err.message : 'Search failed — check you are logged in');
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleIssue = async () => {
    if (!selectedGraduate || !issueName) return;
    setIssueError('');
    setIssuing(true);
    try {
      const issued = await institution.issueCredential({
        recipientRef: selectedGraduate.email,
        graduateUserId: selectedGraduate.userId,
        type: issueType,
        name: issueName,
      });
      setCredentials(prev => [issued, ...prev]);
      setShowIssueModal(false);
      setSelectedGraduate(null);
      setSearchQuery('');
      setIssueName('');
    } catch (err: unknown) {
      setIssueError(err instanceof Error ? err.message : 'Failed to issue credential');
    } finally {
      setIssuing(false);
    }
  };

  const issued = credentials.filter((c: IssuedCredential) => c.status === 'VERIFIED').length;
  const pending = credentials.filter((c: IssuedCredential) => c.status === 'PENDING').length;

  const heroKPIs = [
    { label: 'Total HEAR Credentials', value: credentials.length ? String(credentials.length) : '4,247', change: '+458 this month', icon: Award, color: '#6366F1' },
    { label: 'Verified', value: credentials.length ? String(issued) : '—', change: `${pending} pending`, icon: CheckCircle, color: '#34D399' },
    { label: 'Share Rate', value: '68.4%', change: '342 shared this week', icon: Share2, color: '#0EA5E9' },
    { label: 'Pending Verification', value: credentials.length ? String(pending) : '—', change: '', icon: FileCheck, color: '#FBBF24' },
  ];

  // Credential issuance trends
  const issuanceTrends = [
    { month: 'Jan', issued: 520, activated: 389, shared: 312 },
    { month: 'Feb', issued: 485, activated: 364, shared: 298 },
    { month: 'Mar', issued: 612, activated: 458, shared: 385 },
    { month: 'Apr', issued: 698, activated: 523, shared: 447 },
    { month: 'May', issued: 745, activated: 558, shared: 492 },
    { month: 'Jun', issued: 787, activated: 589, shared: 538 },
  ];

  // Credential types breakdown
  const credentialTypes = [
    { type: 'Degree with HEAR', count: 2847, percentage: 67, color: '#6366F1' },
    { type: 'Micro-Credentials', count: 892, percentage: 21, color: '#0EA5E9' },
    { type: 'Digital Badges', count: 508, percentage: 12, color: '#34D399' },
  ];

  // Faculty breakdown
  const facultyBreakdown = [
    { faculty: 'Business', issued: 1245, activated: 932, activationRate: 74.9 },
    { faculty: 'Engineering', issued: 987, activated: 764, activationRate: 77.4 },
    { faculty: 'Science', issued: 832, activated: 615, activationRate: 73.9 },
    { faculty: 'Arts', issued: 698, activated: 489, activationRate: 70.1 },
    { faculty: 'Medicine', issued: 485, activated: 372, activationRate: 76.7 },
  ];

  // Verification activity
  const verificationData = [
    { date: 'Week 1', requests: 187, verified: 174, rejected: 13 },
    { date: 'Week 2', requests: 203, verified: 189, rejected: 14 },
    { date: 'Week 3', requests: 219, verified: 205, rejected: 14 },
    { date: 'Week 4', requests: 242, verified: 228, rejected: 14 },
  ];

  // Top employers verifying
  const topVerifiers = [
    { employer: 'HSBC', verifications: 127, sector: 'Finance' },
    { employer: 'Deloitte', verifications: 98, sector: 'Professional Services' },
    { employer: 'Alibaba Cloud', verifications: 87, sector: 'Technology' },
    { employer: 'JP Morgan', verifications: 76, sector: 'Finance' },
    { employer: 'PwC', verifications: 68, sector: 'Professional Services' },
  ];

  // Sharing platforms
  const sharingPlatforms = [
    { platform: 'LinkedIn', shares: 1432, percentage: 42 },
    { platform: 'Email', shares: 987, percentage: 29 },
    { platform: 'Direct Link', shares: 654, percentage: 19 },
    { platform: 'Other', shares: 340, percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Credential Management & Analytics</h1>
          <p className="text-[15px] text-muted-foreground mt-1">HEAR-compliant digital credentials tracking and verification</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] hover:bg-accent transition-colors flex items-center gap-2 text-[#6366F1]">
            <Calendar className="w-4 h-4" />
            Last 6 Months
          </button>
          <button
            onClick={() => setShowIssueModal(true)}
            className="h-10 px-5 bg-[#6366F1] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Issue Credential
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Hero KPI Section */}
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
            <div className="flex items-center gap-1 text-[13px] text-[#34D399]">
              <TrendingUp className="w-4 h-4" />
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Issuance Trends & Credential Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Credential Lifecycle Trends</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Issued → Activated → Shared progression</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={issuanceTrends}>
                <defs>
                  <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                    <stop key="issued-start" offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop key="issued-end" offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActivated" x1="0" y1="0" x2="0" y2="1">
                    <stop key="activated-start" offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                    <stop key="activated-end" offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorShared" x1="0" y1="0" x2="0" y2="1">
                    <stop key="shared-start" offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                    <stop key="shared-end" offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area key="issued" type="monotone" dataKey="issued" stroke="#6366F1" fillOpacity={1} fill="url(#colorIssued)" name="Issued" />
                <Area key="activated" type="monotone" dataKey="activated" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorActivated)" name="Activated" />
                <Area key="shared" type="monotone" dataKey="shared" stroke="#34D399" fillOpacity={1} fill="url(#colorShared)" name="Shared" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Credential Types</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Distribution by type</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  key="pie"
                  data={credentialTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {credentialTypes.map((entry) => (
                    <Cell key={entry.type} fill={entry.color} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {credentialTypes.map((type) => (
                <div key={type.type} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                    <span className="text-muted-foreground">{type.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground font-medium">{type.count}</span>
                    <span className="text-muted-foreground">({type.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Breakdown Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground">Faculty Performance Breakdown</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Activation rates by academic unit</p>
          </div>
          <button className="text-[14px] text-primary hover:underline font-medium">View Details</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Issued</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Activated</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Activation Rate</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {facultyBreakdown.map((faculty) => (
                <tr key={faculty.faculty} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{faculty.faculty}</td>
                  <td className="px-6 py-4 text-right text-[14px] text-muted-foreground font-mono">{faculty.issued}</td>
                  <td className="px-6 py-4 text-right text-[14px] text-foreground font-mono">{faculty.activated}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[14px] font-semibold ${
                      faculty.activationRate >= 75 ? 'text-[#34D399]' :
                      faculty.activationRate >= 70 ? 'text-[#FBBF24]' :
                      'text-[#F43F5E]'
                    }`}>
                      {faculty.activationRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#6366F1]"
                        style={{ width: `${faculty.activationRate}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Activity & Top Verifiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Verification Activity</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Weekly verification requests and approvals</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={verificationData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
                <XAxis key="xaxis" dataKey="date" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
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
                <Bar key="verified" dataKey="verified" stackId="a" fill="#34D399" name="Verified" radius={[0, 0, 0, 0]} />
                <Bar key="rejected" dataKey="rejected" stackId="a" fill="#F43F5E" name="Rejected" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Top Verifying Employers</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Organizations requesting credential verification</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topVerifiers.map((verifier, idx) => (
                <div key={verifier.employer} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[12px] font-semibold text-foreground">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-foreground">{verifier.employer}</div>
                      <div className="text-[12px] text-muted-foreground">{verifier.sector}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-semibold text-foreground">{verifier.verifications}</span>
                    <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Platforms */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Credential Sharing Channels</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Platforms used by graduates to share credentials</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sharingPlatforms.map((platform) => (
              <div key={platform.platform}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#6366F1]" />
                    <span className="text-[14px] font-medium text-foreground">{platform.platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] text-muted-foreground">{platform.shares} shares</span>
                    <span className="text-[14px] font-semibold text-foreground">{platform.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#6366F1]"
                    style={{ width: `${platform.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Summary (Read-only) */}
      <div className="bg-accent/50 border border-border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/15 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[16px] font-semibold text-foreground mb-2">HEAR Compliance Policy</h4>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              All credentials comply with Higher Education Achievement Report (HEAR) standards as mandated by UGC guidelines.
              Credentials include verified academic achievements, co-curricular activities, and employability competencies.
              Data retention: 10 years post-graduation. Verification requests processed within 3 business days.
            </p>
            <button className="mt-3 text-[14px] text-primary hover:underline font-medium inline-flex items-center gap-1">
              View Full Policy <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Issue Credential Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-semibold text-foreground">Issue New Credential</h3>
              <button onClick={() => setShowIssueModal(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Graduate search */}
            <div className="mb-4">
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Recipient</label>
              {selectedGraduate ? (
                <div className="flex items-center justify-between bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[14px] text-foreground font-medium">{selectedGraduate.name}</p>
                    <p className="text-[12px] text-muted-foreground">{selectedGraduate.email}{selectedGraduate.faculty ? ` · ${selectedGraduate.faculty}` : ''}</p>
                  </div>
                  <button onClick={() => setSelectedGraduate(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      {searchResults.map(g => (
                        <button
                          key={g.userId}
                          onClick={() => { setSelectedGraduate(g); setSearchQuery(''); setSearchResults([]); setSearchError(''); }}
                          className="w-full text-left px-3 py-2.5 hover:bg-accent transition-colors border-b border-border last:border-0"
                        >
                          <p className="text-[14px] text-foreground">{g.name}</p>
                          <p className="text-[12px] text-muted-foreground">{g.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchError && searchQuery.length >= 2 && (
                    <p className="mt-1.5 text-[12px] text-[#F43F5E]">{searchError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Credential type */}
            <div className="mb-4">
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Type</label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]"
              >
                <option value="HEAR">HEAR</option>
                <option value="DEGREE">Degree</option>
                <option value="MICRO_CREDENTIAL">Micro-Credential</option>
                <option value="BADGE">Digital Badge</option>
              </select>
            </div>

            {/* Credential name */}
            <div className="mb-5">
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Credential Name</label>
              <input
                type="text"
                placeholder="e.g. BSc Computer Science 2024"
                value={issueName}
                onChange={e => setIssueName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {issueError && (
              <p className="mb-3 text-[12px] text-[#F43F5E]">{issueError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowIssueModal(false); setIssueError(''); }}
                className="flex-1 h-10 border border-border rounded-lg text-[14px] text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleIssue}
                disabled={!selectedGraduate || !issueName || issuing}
                className="flex-1 h-10 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {issuing ? 'Issuing…' : 'Issue Credential'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
