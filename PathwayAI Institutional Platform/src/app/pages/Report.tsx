import { FileText, Download, Calendar, CheckCircle2, Clock, FileCheck, AlertCircle, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Report() {
  // Hero KPIs
  const heroKPIs = [
    { label: 'UGC Compliance Status', value: '98.5%', change: 'All requirements met', icon: CheckCircle2, color: '#34D399' },
    { label: 'HKQA Alignment Score', value: '94/100', change: 'Accreditation ready', icon: FileCheck, color: '#6366F1' },
    { label: 'Reports Generated', value: '287', change: '+34 this month', icon: FileText, color: '#0EA5E9' },
    { label: 'Scheduled Reports', value: '42 active', change: '12 upcoming', icon: Clock, color: '#FBBF24' },
  ];

  // Report templates
  const reportTemplates = [
    {
      name: 'Annual Employment Report',
      description: 'Comprehensive graduate employment outcomes for UGC submission',
      regulatory: 'UGC Compliant',
      frequency: 'Annual',
      lastGenerated: '2026-01-15',
      size: '2.4 MB',
    },
    {
      name: 'HKQA Quality Assurance Report',
      description: 'Programme quality metrics and continuous improvement evidence',
      regulatory: 'HKQA Aligned',
      frequency: 'Quarterly',
      lastGenerated: '2026-05-01',
      size: '3.8 MB',
    },
    {
      name: 'Graduate Outcomes Dashboard',
      description: 'Employment rates, salary data, and career progression statistics',
      regulatory: 'Internal Use',
      frequency: 'Monthly',
      lastGenerated: '2026-06-01',
      size: '1.2 MB',
    },
    {
      name: 'Employer Satisfaction Survey Summary',
      description: 'Aggregated employer feedback and partnership performance',
      regulatory: 'Internal Use',
      frequency: 'Quarterly',
      lastGenerated: '2026-04-15',
      size: '890 KB',
    },
    {
      name: 'Skills Gap Analysis Report',
      description: 'Market demand vs curriculum coverage with recommendations',
      regulatory: 'Internal Use',
      frequency: 'Bi-annual',
      lastGenerated: '2026-01-30',
      size: '1.6 MB',
    },
    {
      name: 'Alumni Career Trajectory Study',
      description: 'Longitudinal analysis of graduate career paths (5-10 years)',
      regulatory: 'UGC Compliant',
      frequency: 'Annual',
      lastGenerated: '2025-12-20',
      size: '4.2 MB',
    },
  ];

  // Recent reports
  const recentReports = [
    { name: 'Q2 2026 Employment Report', type: 'Employment', generated: '2026-06-15', generatedBy: 'Admin User', status: 'Completed', downloads: 24 },
    { name: 'May 2026 Credential Activity', type: 'Credentials', generated: '2026-06-05', generatedBy: 'System', status: 'Completed', downloads: 18 },
    { name: 'Spring Employer Survey Results', type: 'Employers', generated: '2026-05-28', generatedBy: 'ERM Team', status: 'Completed', downloads: 32 },
    { name: 'Curriculum Review - Business', type: 'Curriculum', generated: '2026-05-20', generatedBy: "Dean's Office", status: 'Completed', downloads: 15 },
    { name: 'Alumni Network Engagement', type: 'Alumni', generated: '2026-05-15', generatedBy: 'Alumni Office', status: 'Completed', downloads: 9 },
  ];

  // Scheduled reports
  const scheduledReports = [
    { name: 'Weekly Credential Digest', schedule: 'Every Monday', nextRun: '2026-06-17', recipients: 8 },
    { name: 'Monthly Analytics Summary', schedule: '1st of month', nextRun: '2026-07-01', recipients: 12 },
    { name: 'Quarterly Employer Survey', schedule: 'Quarterly', nextRun: '2026-07-01', recipients: 342 },
    { name: 'Annual UGC Submission', schedule: 'Yearly (Jan)', nextRun: '2027-01-15', recipients: 3 },
  ];

  // Report generation statistics
  const generationStats = [
    { month: 'Jan', count: 42, avgTime: 3.2 },
    { month: 'Feb', count: 38, avgTime: 2.9 },
    { month: 'Mar', count: 51, avgTime: 3.4 },
    { month: 'Apr', count: 47, avgTime: 3.1 },
    { month: 'May', count: 54, avgTime: 2.8 },
    { month: 'Jun', count: 55, avgTime: 2.7 },
  ];

  // Compliance checklist
  const complianceItems = [
    { requirement: 'Graduate Employment Rate Data', status: 'Met', lastUpdated: '2026-06-10', source: 'Analytics Module' },
    { requirement: 'Employer Satisfaction Metrics', status: 'Met', lastUpdated: '2026-05-28', source: 'ERM Surveys' },
    { requirement: 'HEAR Credential Compliance', status: 'Met', lastUpdated: '2026-06-12', source: 'Credential System' },
    { requirement: 'Programme Quality Indicators', status: 'Met', lastUpdated: '2026-05-15', source: 'Curriculum Review' },
    { requirement: 'Alumni Longitudinal Data', status: 'Met', lastUpdated: '2026-04-30', source: 'Alumni Tracking' },
    { requirement: 'Skills Alignment Evidence', status: 'In Progress', lastUpdated: '2026-06-01', source: 'Curriculum Module' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Met':
      case 'Completed':
        return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30';
      case 'In Progress':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30';
      case 'Pending':
        return 'bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Reports & Compliance</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Automated reporting, regulatory templates, and compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] hover:bg-accent transition-colors flex items-center gap-2 text-[#6366F1]">
            <Filter className="w-4 h-4" />
            Filter Reports
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" />
            Custom Report
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

      {/* Report Template Library */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Report Template Library</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Pre-configured templates with regulatory alignment</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {reportTemplates.map((template) => (
            <div key={template.name} className="bg-accent/30 border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/50 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#6366F1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-semibold text-foreground">{template.name}</h4>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${
                    template.regulatory.includes('UGC') ? 'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30' :
                    template.regulatory.includes('HKQA') ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {template.regulatory}
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
              <div className="space-y-2 text-[12px] mb-4">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Frequency:</span>
                  <span className="font-medium text-foreground">{template.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Last Generated:</span>
                  <span className="font-medium text-foreground">{template.lastGenerated}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>File Size:</span>
                  <span className="font-medium text-foreground">{template.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 px-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-[13px] font-medium">
                  Generate
                </button>
                <button className="h-9 px-3 border border-[#AAACEF] rounded-lg hover:bg-accent transition-colors text-[#6366F1]">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports & Report Generation Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-foreground">Recent Reports</h3>
              <p className="text-[13px] text-muted-foreground mt-1">Recently generated reports and download activity</p>
            </div>
            <button className="text-[14px] text-primary hover:underline font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b-2 border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Report Name</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">By</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentReports.map((report) => (
                  <tr key={report.name} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-[14px] text-foreground font-medium">{report.name}</td>
                    <td className="px-6 py-4 text-[14px] text-muted-foreground">{report.type}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{report.generated}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{report.generatedBy}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-[12px] font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-[14px] text-foreground">{report.downloads}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors mx-auto">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Generation Stats</h3>
            <p className="text-[13px] text-muted-foreground mt-1">6-month trends</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={generationStats}>
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
                <Bar key="count" dataKey="count" fill="#6366F1" name="Reports Generated" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="text-[13px] text-muted-foreground">Avg Generation Time</div>
              <div className="text-[20px] font-semibold text-foreground mt-1">2.9 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Scheduled Reports</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Automated report generation and distribution</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Next Run</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Recipients</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scheduledReports.map((report) => (
                <tr key={report.name} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{report.name}</td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{report.schedule}</td>
                  <td className="px-6 py-4 text-[14px] text-foreground">{report.nextRun}</td>
                  <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{report.recipients}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UGC/HKQA Compliance Checklist */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Regulatory Compliance Checklist</h3>
          <p className="text-[13px] text-muted-foreground mt-1">UGC & HKQA requirement tracking</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Requirement</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complianceItems.map((item) => (
                <tr key={item.requirement} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{item.requirement}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium border ${getStatusColor(item.status)}`}>
                      {item.status === 'Met' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {item.status === 'In Progress' && <Clock className="w-3 h-3 mr-1" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{item.lastUpdated}</td>
                  <td className="px-6 py-4 text-[14px] text-muted-foreground">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Summary */}
      <div className="bg-accent/50 border border-border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[16px] font-semibold text-foreground mb-2">Audit Trail & Data Provenance</h4>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">
              All report generation activities are logged with full audit trails. Data provenance includes source modules,
              extraction timestamps, and user permissions. Export logs are retained for 7 years per UGC guidelines.
            </p>
            <div className="grid grid-cols-3 gap-4 text-[13px]">
              <div>
                <div className="text-muted-foreground">Total Audit Entries</div>
                <div className="text-foreground font-semibold mt-1">18,247</div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Audit Review</div>
                <div className="text-foreground font-semibold mt-1">2026-05-15</div>
              </div>
              <div>
                <div className="text-muted-foreground">Compliance Rate</div>
                <div className="text-[#34D399] font-semibold mt-1">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
