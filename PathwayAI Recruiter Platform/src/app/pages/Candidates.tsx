import { GraduationCap, Star, Award, ChevronRight, X, CheckCircle, XCircle, Trophy, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { candidates as candidatesApi, type CandidateApplication, type CandidateDetail } from '../lib/api';

const FALLBACK: CandidateApplication[] = [
  { id: 'c1', jobId: '1', jobTitle: 'Graduate Analyst – Markets', status: 'APPLIED', appliedDate: '2026-05-10', graduate: { userId: 'u1', name: 'Emily Chan', university: 'CUHK', faculty: 'Business', graduationYear: 2026, matchScore: 87 } },
  { id: 'c2', jobId: '1', jobTitle: 'Graduate Analyst – Markets', status: 'SHORTLISTED', appliedDate: '2026-05-08', graduate: { userId: 'u2', name: 'James Wong', university: 'HKU', faculty: 'Economics', graduationYear: 2026, matchScore: 92 } },
  { id: 'c3', jobId: '2', jobTitle: 'Associate Software Engineer', status: 'INTERVIEWING', appliedDate: '2026-05-05', graduate: { userId: 'u3', name: 'Sarah Lam', university: 'HKUST', faculty: 'Computer Science', graduationYear: 2026, matchScore: 95 } },
  { id: 'c4', jobId: '2', jobTitle: 'Associate Software Engineer', status: 'OFFERED', appliedDate: '2026-04-28', graduate: { userId: 'u4', name: 'Kevin Liu', university: 'PolyU', faculty: 'Computing', graduationYear: 2025, matchScore: 88 } },
  { id: 'c5', jobId: '1', jobTitle: 'Graduate Analyst – Markets', status: 'REJECTED', appliedDate: '2026-05-12', graduate: { userId: 'u5', name: 'Alice Ng', university: 'CUHK', faculty: 'Finance', graduationYear: 2026, matchScore: 61 } },
];

const STAGES: CandidateApplication['status'][] = ['APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED'];

const stageConfig: Record<CandidateApplication['status'], { label: string; color: string; bg: string }> = {
  APPLIED:     { label: 'Applied',     color: '#B4B4C8', bg: '#232330' },
  SHORTLISTED: { label: 'Shortlisted', color: '#0EA5E9', bg: '#0EA5E9/10' },
  INTERVIEWING:{ label: 'Interview',   color: '#FBBF24', bg: '#FBBF24/10' },
  OFFERED:     { label: 'Offered',     color: '#34D399', bg: '#34D399/10' },
  REJECTED:    { label: 'Rejected',    color: '#F43F5E', bg: '#F43F5E/10' },
};

export default function Candidates() {
  const [list, setList] = useState<CandidateApplication[]>([]);
  const [selected, setSelected] = useState<CandidateDetail | null>(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [institutionFilter, setInstitutionFilter] = useState('ALL');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    candidatesApi.list().then(setList).catch(() => {});
  }, []);

  const openDetail = async (id: string) => {
    try {
      const detail = await candidatesApi.get(id);
      setSelected(detail);
    } catch {
      const app = list.find(c => c.id === id);
      if (app) setSelected({ ...app, graduate: { ...app.graduate, skills: [], credentials: [] } });
    }
  };

  const updateStatus = async (id: string, status: CandidateApplication['status']) => {
    setUpdating(true);
    try {
      await candidatesApi.updateStatus(id, status);
      setList(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch {
      setList(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } finally {
      setUpdating(false);
    }
  };

  const roles = ['ALL', ...Array.from(new Set(list.map(c => c.jobTitle)))];
  const institutions = ['ALL', ...Array.from(new Set(list.map(c => c.graduate.university)))];

  const filtered = list.filter(c =>
    (roleFilter === 'ALL' || c.jobTitle === roleFilter) &&
    (institutionFilter === 'ALL' || c.graduate.university === institutionFilter)
  );

  return (
    <div className="space-y-5">
      {/* Role & Institution filters */}
      <div className="flex items-center gap-3">
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-[13px] bg-card border border-border text-foreground focus:outline-none focus:border-primary"
        >
          <option value="ALL">All Roles</option>
          {roles.filter(r => r !== 'ALL').map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={institutionFilter}
          onChange={e => setInstitutionFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-[13px] bg-card border border-border text-foreground focus:outline-none focus:border-primary"
        >
          <option value="ALL">All Institutions</option>
          {institutions.filter(i => i !== 'ALL').map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* Kanban-style grid */}
      <div className="grid grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const stageCandidates = filtered.filter(c => c.status === stage);
          const cfg = stageConfig[stage];
          return (
            <div key={stage} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-[12px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-[11px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded-md">{stageCandidates.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {stageCandidates.map(c => (
                  <button
                    key={c.id}
                    onClick={() => openDetail(c.id)}
                    className="w-full bg-background border border-border rounded-lg p-3 text-left hover:border-[#6366F1]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
                        {c.graduate.name[0]}
                      </div>
                      <div className="text-[11px] font-semibold text-[#34D399]">{c.graduate.matchScore}%</div>
                    </div>
                    <p className="text-[12px] font-medium text-foreground truncate">{c.graduate.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.graduate.university}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{c.jobTitle}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-card w-[440px] h-full overflow-y-auto border-l border-border shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between z-10">
              <h3 className="text-[16px] font-semibold text-foreground">{selected.graduate.name}</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366F1] to-[#0EA5E9] flex items-center justify-center text-white text-[24px] font-bold">
                  {selected.graduate.name[0]}
                </div>
                <div>
                  <p className="text-[18px] font-bold text-foreground">{selected.graduate.name}</p>
                  <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {selected.graduate.university}{selected.graduate.faculty ? ` · ${selected.graduate.faculty}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[12px] font-semibold text-[#34D399]">{selected.graduate.matchScore}% match</span>
                    <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                  </div>
                </div>
              </div>

              {/* Applied for */}
              <div className="bg-accent/50 rounded-xl p-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Applied For</p>
                <p className="text-[14px] font-medium text-foreground">{selected.jobTitle}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Applied {new Date(selected.appliedDate).toLocaleDateString()}</p>
              </div>

              {/* Skills */}
              {selected.graduate.skills.length > 0 && (
                <div>
                  <p className="text-[13px] font-semibold text-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.graduate.skills.map(s => (
                      <span key={s.name} className="text-[12px] px-2.5 py-1 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-full">
                        {s.name} · {s.level}/100
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Credentials */}
              {selected.graduate.credentials.length > 0 && (
                <div>
                  <p className="text-[13px] font-semibold text-foreground mb-2">Verified Credentials</p>
                  <div className="space-y-2">
                    {selected.graduate.credentials.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                        <Award className="w-4 h-4 text-[#6366F1]" />
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.issuer} · {c.type}</p>
                        </div>
                        {c.status === 'VERIFIED' && <CheckCircle className="w-4 h-4 text-[#34D399]" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status actions */}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-3">Move to Stage</p>
                <div className="space-y-2">
                  {/* Forward actions — show only the next logical step */}
                  {selected.status === 'APPLIED' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'SHORTLISTED')}
                      disabled={updating}
                      className="w-full h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
                      style={{ backgroundColor: '#0EA5E9', color: '#fff' }}
                    >
                      <Star className="w-4 h-4" /> Shortlist Candidate
                    </button>
                  )}
                  {selected.status === 'SHORTLISTED' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'INTERVIEWING')}
                      disabled={updating}
                      className="w-full h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
                      style={{ backgroundColor: '#FBBF24', color: '#000' }}
                    >
                      <Video className="w-4 h-4" /> Move to Interview
                    </button>
                  )}
                  {selected.status === 'INTERVIEWING' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'OFFERED')}
                      disabled={updating}
                      className="w-full h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
                      style={{ backgroundColor: '#34D399', color: '#000' }}
                    >
                      <Trophy className="w-4 h-4" /> Make Offer
                    </button>
                  )}
                  {selected.status === 'OFFERED' && (
                    <div className="w-full h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                      <CheckCircle className="w-4 h-4" /> Offer Extended
                    </div>
                  )}
                  {/* Reject — always available unless already rejected/offered */}
                  {!['REJECTED', 'OFFERED'].includes(selected.status) && (
                    <button
                      onClick={() => updateStatus(selected.id, 'REJECTED')}
                      disabled={updating}
                      className="w-full h-9 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 border border-[#F43F5E]/30 text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  {/* Current stage indicator */}
                  <p className="text-[11px] text-muted-foreground text-center pt-1">
                    Current stage: <span className="font-semibold" style={{ color: stageConfig[selected.status].color }}>{stageConfig[selected.status].label}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
