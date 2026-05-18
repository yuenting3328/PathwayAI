import { BookOpen, Target, Award, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

export default function Curriculum() {
  // Hero KPIs
  const heroKPIs = [
    { label: 'Overall Curriculum Alignment', value: '76.3%', change: '+4.1% vs last review', icon: Target, color: '#6366F1' },
    { label: 'Skills Coverage Index', value: '82/100', change: '12 gaps identified', icon: CheckCircle2, color: '#34D399' },
    { label: 'Micro-Credentials Active', value: '47', change: '+8 new programs', icon: Award, color: '#0EA5E9' },
    { label: 'Industry Alignment Score', value: '7.8/10', change: 'Based on 156 employer surveys', icon: BookOpen, color: '#FBBF24' },
  ];

  // Skills-to-curriculum heatmap data
  const skillsMatrix = [
    { skill: 'Data Analysis', business: 85, engineering: 92, science: 88, arts: 45, medicine: 52 },
    { skill: 'Digital Literacy', business: 78, engineering: 95, science: 82, arts: 68, medicine: 71 },
    { skill: 'Communication', business: 88, engineering: 65, science: 72, arts: 92, medicine: 85 },
    { skill: 'Critical Thinking', business: 82, engineering: 88, science: 90, arts: 87, medicine: 91 },
    { skill: 'Programming', business: 42, engineering: 96, science: 85, arts: 28, medicine: 35 },
    { skill: 'Project Management', business: 85, engineering: 78, science: 68, arts: 62, medicine: 72 },
  ];

  // Skill gap analysis
  const skillGaps = [
    { skill: 'AI/Machine Learning', marketDemand: 92, curriculumCoverage: 48, gap: 44, priority: 'Critical', students: 2847 },
    { skill: 'Cloud Computing', marketDemand: 88, curriculumCoverage: 52, gap: 36, priority: 'High', students: 2134 },
    { skill: 'Cybersecurity', marketDemand: 85, curriculumCoverage: 61, gap: 24, priority: 'High', students: 1876 },
    { skill: 'UX/UI Design', marketDemand: 78, curriculumCoverage: 55, gap: 23, priority: 'Medium', students: 1543 },
    { skill: 'Data Visualization', marketDemand: 82, curriculumCoverage: 68, gap: 14, priority: 'Medium', students: 2256 },
    { skill: 'Sustainability', marketDemand: 74, curriculumCoverage: 65, gap: 9, priority: 'Low', students: 1432 },
  ];

  // Micro-credential programs
  const microCredentials = [
    { program: 'Digital Marketing Analytics', enrollments: 342, completions: 287, employmentBoost: 18, sector: 'Marketing' },
    { program: 'Python for Data Science', enrollments: 458, completions: 389, employmentBoost: 22, sector: 'Technology' },
    { program: 'Financial Technology Essentials', enrollments: 276, completions: 241, employmentBoost: 15, sector: 'Finance' },
    { program: 'Healthcare Informatics', enrollments: 198, completions: 167, employmentBoost: 12, sector: 'Healthcare' },
    { program: 'Sustainable Business Practices', enrollments: 234, completions: 203, employmentBoost: 8, sector: 'Sustainability' },
  ];

  // Programme-level alignment
  const programmeAlignment = [
    { programme: 'BBA Finance', overallScore: 84, skills: 88, industry: 82, graduate: 92, recommendation: 'Maintain' },
    { programme: 'BEng Computer Science', overallScore: 91, skills: 95, industry: 89, graduate: 94, recommendation: 'Enhance' },
    { programme: 'BSc Data Science', overallScore: 87, skills: 92, industry: 85, graduate: 89, recommendation: 'Maintain' },
    { programme: 'BA Communication', overallScore: 72, skills: 68, industry: 74, graduate: 78, recommendation: 'Review' },
    { programme: 'BEng Civil Engineering', overallScore: 78, skills: 82, industry: 76, graduate: 81, recommendation: 'Review' },
  ];

  // Capstone project alignment
  const capstoneData = [
    { faculty: 'Business', projects: 87, industrySponsored: 42, employmentRate: 89 },
    { faculty: 'Engineering', projects: 124, industrySponsored: 78, employmentRate: 92 },
    { faculty: 'Science', projects: 96, industrySponsored: 34, employmentRate: 85 },
    { faculty: 'Arts', projects: 68, industrySponsored: 18, employmentRate: 81 },
    { faculty: 'Medicine', projects: 54, industrySponsored: 31, employmentRate: 94 },
  ];

  const getHeatmapColor = (value: number) => {
    if (value >= 85) return 'bg-[#34D399]/80 text-white';
    if (value >= 70) return 'bg-[#6366F1]/60 text-white';
    if (value >= 50) return 'bg-[#FBBF24]/50 text-[#0A0A0F]';
    return 'bg-[#F43F5E]/40 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-semibold text-foreground">Curriculum Alignment</h1>
          <p className="text-[15px] text-muted-foreground mt-1">Skills mapping and programme-market alignment analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 border border-[#AAACEF] rounded-lg text-[14px] text-[#6366F1] hover:bg-accent transition-colors">
            Faculty Comparison
          </button>
          <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Generate Review Report
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

      {/* Skills-to-Curriculum Heatmap Matrix */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Skills-to-Curriculum Mapping Matrix</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Competency coverage across faculties (coverage index 0-100)</p>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Competency
                </th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Business
                </th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Engineering
                </th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Science
                </th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Arts
                </th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider bg-background border border-border">
                  Medicine
                </th>
              </tr>
            </thead>
            <tbody>
              {skillsMatrix.map((row) => (
                <tr key={row.skill}>
                  <td className="px-4 py-3 text-[13px] font-medium text-foreground border border-border bg-background">
                    {row.skill}
                  </td>
                  <td className={`px-4 py-3 text-center text-[14px] font-semibold border border-border ${getHeatmapColor(row.business)}`}>
                    {row.business}
                  </td>
                  <td className={`px-4 py-3 text-center text-[14px] font-semibold border border-border ${getHeatmapColor(row.engineering)}`}>
                    {row.engineering}
                  </td>
                  <td className={`px-4 py-3 text-center text-[14px] font-semibold border border-border ${getHeatmapColor(row.science)}`}>
                    {row.science}
                  </td>
                  <td className={`px-4 py-3 text-center text-[14px] font-semibold border border-border ${getHeatmapColor(row.arts)}`}>
                    {row.arts}
                  </td>
                  <td className={`px-4 py-3 text-center text-[14px] font-semibold border border-border ${getHeatmapColor(row.medicine)}`}>
                    {row.medicine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-6 mt-4 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#34D399]/80"></div>
              <span className="text-muted-foreground">Excellent (85+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#6366F1]/60"></div>
              <span className="text-muted-foreground">Good (70-84)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#FBBF24]/50"></div>
              <span className="text-muted-foreground">Adequate (50-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#F43F5E]/40"></div>
              <span className="text-muted-foreground">Gap (&lt;50)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Critical Skills Gap Analysis</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Market demand vs curriculum coverage - prioritized action items</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b-2 border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Skill Domain</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Market Demand</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Gap</th>
                <th className="px-6 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">Affected Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skillGaps.map((gap) => (
                <tr key={gap.skill} className="hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-[14px] text-foreground font-medium">{gap.skill}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#34D399]">
                      {gap.marketDemand}
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[14px] font-semibold text-foreground">{gap.curriculumCoverage}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 max-w-[80px] h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            gap.gap >= 30 ? 'bg-[#F43F5E]' :
                            gap.gap >= 20 ? 'bg-[#FBBF24]' :
                            'bg-[#34D399]'
                          }`}
                          style={{ width: `${(gap.gap / 50) * 100}%` }}
                        />
                      </div>
                      <span className={`text-[13px] font-semibold ${
                        gap.gap >= 30 ? 'text-[#F43F5E]' :
                        gap.gap >= 20 ? 'text-[#FBBF24]' :
                        'text-[#34D399]'
                      }`}>
                        -{gap.gap}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${
                      gap.priority === 'Critical' ? 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30' :
                      gap.priority === 'High' ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30' :
                      gap.priority === 'Medium' ? 'bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30' :
                      'bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30'
                    }`}>
                      {gap.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[14px] text-muted-foreground">{gap.students.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Micro-Credentials & Programme Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Micro-Credential Performance</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Completion rates and employment impact</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {microCredentials.map((mc) => (
                <div key={mc.program} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-foreground">{mc.program}</div>
                      <div className="text-[12px] text-muted-foreground mt-1">{mc.sector}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[14px] font-semibold text-[#34D399]">
                      +{mc.employmentBoost}%
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[13px] mt-3">
                    <div>
                      <div className="text-muted-foreground">Enrollments</div>
                      <div className="text-foreground font-semibold mt-1">{mc.enrollments}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Completions</div>
                      <div className="text-foreground font-semibold mt-1">
                        {mc.completions} ({Math.round((mc.completions / mc.enrollments) * 100)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[18px] font-semibold text-foreground">Programme Alignment Scorecard</h3>
            <p className="text-[13px] text-muted-foreground mt-1">Multi-factor alignment assessment</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {programmeAlignment.map((prog) => (
                <div key={prog.programme} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[14px] font-medium text-foreground">{prog.programme}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-[#6366F1]">{prog.overallScore}</span>
                      <span className={`text-[12px] px-2 py-1 rounded ${
                        prog.recommendation === 'Enhance' ? 'bg-[#34D399]/15 text-[#34D399]' :
                        prog.recommendation === 'Maintain' ? 'bg-[#0EA5E9]/15 text-[#0EA5E9]' :
                        'bg-[#FBBF24]/15 text-[#FBBF24]'
                      }`}>
                        {prog.recommendation}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[12px]">
                    <div>
                      <div className="text-muted-foreground">Skills</div>
                      <div className="text-foreground font-medium mt-1">{prog.skills}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Industry</div>
                      <div className="text-foreground font-medium mt-1">{prog.industry}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Graduate</div>
                      <div className="text-foreground font-medium mt-1">{prog.graduate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capstone Projects */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-[18px] font-semibold text-foreground">Industry-Sponsored Capstone Projects</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Real-world project engagement and employment correlation</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={capstoneData}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2A2A36" />
              <XAxis key="xaxis" dataKey="faculty" stroke="#8A8A9E" style={{ fontSize: '12px' }} />
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
              <Bar key="projects" dataKey="projects" fill="#6366F1" name="Total Projects" radius={[6, 6, 0, 0]} />
              <Bar key="industrySponsored" dataKey="industrySponsored" fill="#34D399" name="Industry-Sponsored" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="bg-accent/50 border border-border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#6366F1]/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[16px] font-semibold text-foreground mb-3">Priority Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span className="text-[14px] text-muted-foreground">Launch AI/ML micro-credential program to address 44-point gap (2,847 students affected)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span className="text-[14px] text-muted-foreground">Enhance Programming curriculum in Arts faculty (current coverage: 28)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span className="text-[14px] text-muted-foreground">Review BA Communication programme alignment (overall score: 72)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] mt-0.5 flex-shrink-0" />
                <span className="text-[14px] text-muted-foreground">Increase industry-sponsored capstone projects in Arts (currently 26% vs Engineering 63%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
