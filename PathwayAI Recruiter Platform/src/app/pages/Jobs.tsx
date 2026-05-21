import { Plus, MapPin, DollarSign, Calendar, Users, ChevronDown, X, Check, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jobs as jobsApi, type RecruiterJob } from '../lib/api';

const FALLBACK: RecruiterJob[] = [
  { id: '1', title: 'Graduate Analyst – Markets', sector: 'Finance', district: 'Central', salaryMin: 25000, salaryMax: 32000, deadline: '2026-07-01', status: 'OPEN', applicantCount: 47, skills: ['Excel', 'Python', 'Finance'] },
  { id: '2', title: 'Associate Software Engineer', sector: 'Technology', district: 'Kwun Tong', salaryMin: 28000, salaryMax: 38000, deadline: '2026-06-20', status: 'OPEN', applicantCount: 93, skills: ['React', 'TypeScript', 'Node.js'] },
  { id: '3', title: 'Business Analyst Graduate', sector: 'Consulting', district: 'Admiralty', salaryMin: 22000, salaryMax: 30000, deadline: '2026-06-15', status: 'DRAFT', applicantCount: 0, skills: ['SQL', 'PowerBI', 'Communication'] },
  { id: '4', title: 'Operations Trainee', sector: 'Operations', district: 'Tsim Sha Tsui', salaryMin: 18000, salaryMax: 24000, deadline: '2026-05-30', status: 'CLOSED', applicantCount: 122, skills: ['Project Management', 'Excel'] },
];

const EMPTY_JOB: Omit<RecruiterJob, 'id' | 'applicantCount' | 'status'> = {
  title: '', sector: '', district: '', salaryMin: 0, salaryMax: 0,
  deadline: '', skills: [], description: '',
};

export default function Jobs() {
  const [jobList, setJobList] = useState<RecruiterJob[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_JOB, skillInput: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'DRAFT' | 'CLOSED'>('ALL');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    jobsApi.list().then(setJobList).catch(() => {});
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: RecruiterJob['status']) => {
    setOpenDropdown(null);
    setJobList(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    try {
      await jobsApi.update(jobId, { status: newStatus });
    } catch {
      setJobList(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    }
  };

  const handleDelete = async (jobId: string) => {
    setJobList(prev => prev.filter(j => j.id !== jobId));
    try {
      await jobsApi.close(jobId);
    } catch {
      jobsApi.list().then(setJobList).catch(() => {});
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.sector) return;
    setSaving(true);
    try {
      const created = await jobsApi.create({
        title: form.title, sector: form.sector, district: form.district,
        salaryMin: form.salaryMin, salaryMax: form.salaryMax,
        deadline: form.deadline, skills: form.skills, description: form.description,
      });
      setJobList(prev => [created, ...prev]);
    } catch {
      setJobList(prev => [{
        id: Date.now().toString(), title: form.title, sector: form.sector,
        district: form.district, salaryMin: form.salaryMin, salaryMax: form.salaryMax,
        deadline: form.deadline, status: 'DRAFT', applicantCount: 0, skills: form.skills,
      }, ...prev]);
    } finally {
      setSaving(false);
      setShowModal(false);
      setForm({ ...EMPTY_JOB, skillInput: '' });
    }
  };

  const addSkill = () => {
    if (form.skillInput.trim() && !form.skills.includes(form.skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, f.skillInput.trim()], skillInput: '' }));
    }
  };

  const filtered = filter === 'ALL' ? jobList : jobList.filter(j => j.status === filter);

  const statusColor: Record<RecruiterJob['status'], string> = {
    OPEN: 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20',
    DRAFT: 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/20',
    CLOSED: 'text-[#B4B4C8] bg-[#B4B4C8]/10 border-[#B4B4C8]/20',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', 'OPEN', 'DRAFT', 'CLOSED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:bg-accent'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Post Job
        </button>
      </div>

      {/* Overlay to close any open dropdown when clicking outside */}
      {openDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Job cards */}
      <div className="space-y-3">
        {filtered.map(job => (
          <div key={job.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-[16px] font-semibold text-foreground">{job.title}</h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusColor[job.status]}`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[13px] text-muted-foreground mb-3">
                  <span>{job.sector}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.district}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />HK${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}</span>
                  {job.deadline && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(job.deadline).toLocaleDateString()}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center">
                  <div className="text-[22px] font-bold text-foreground flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#0EA5E9]" />{job.applicantCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground">applicants</div>
                </div>
                {/* Manage dropdown */}
                <div className="relative z-20">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === job.id ? null : job.id)}
                    className="h-9 px-3 border border-border rounded-lg text-[13px] text-muted-foreground hover:bg-accent flex items-center gap-1"
                  >
                    Manage <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {openDropdown === job.id && (
                    <div className="absolute right-0 top-10 z-30 bg-card border border-border rounded-xl shadow-xl w-44 py-1 overflow-hidden">
                      <p className="text-[11px] text-muted-foreground px-3 pt-2 pb-1 font-medium uppercase tracking-wide">Set Status</p>
                      {(['DRAFT', 'OPEN', 'CLOSED'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(job.id, s)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[13px] hover:bg-accent transition-colors"
                        >
                          <span className={`font-medium ${s === 'OPEN' ? 'text-[#34D399]' : s === 'DRAFT' ? 'text-[#FBBF24]' : 'text-muted-foreground'}`}>
                            {s}
                          </span>
                          {job.status === s && <Check className="w-3.5 h-3.5 text-[#6366F1]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="h-9 w-9 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-semibold text-foreground">Post New Job</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Job Title">
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Graduate Analyst – Markets"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Sector">
                  <input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
                    placeholder="Finance"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
                <Field label="District">
                  <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    placeholder="Central"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Min Salary (HKD/mo)">
                  <input type="number" value={form.salaryMin || ''} onChange={e => setForm(f => ({ ...f, salaryMin: Number(e.target.value) }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
                <Field label="Max Salary (HKD/mo)">
                  <input type="number" value={form.salaryMax || ''} onChange={e => setForm(f => ({ ...f, salaryMax: Number(e.target.value) }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
                </Field>
              </div>

              <Field label="Application Deadline">
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground focus:outline-none focus:border-[#6366F1]" />
              </Field>

              <Field label="Required Skills">
                <div className="flex gap-2 mb-2">
                  <input value={form.skillInput} onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add skill and press Enter"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1]" />
                  <button onClick={addSkill} className="px-3 bg-accent rounded-lg text-[13px] text-foreground hover:bg-border">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map(s => (
                    <span key={s} className="flex items-center gap-1 text-[12px] px-2 py-0.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-full">
                      {s}
                      <button onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(sk => sk !== s) }))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>

              <Field label="Description (optional)">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Role overview, responsibilities, requirements…"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6366F1] resize-none" />
              </Field>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-border rounded-lg text-[14px] text-muted-foreground hover:bg-accent">Cancel</button>
              <button onClick={handleCreate} disabled={!form.title || !form.sector || saving}
                className="flex-1 h-10 bg-[#6366F1] text-white rounded-lg text-[14px] font-medium hover:opacity-90 disabled:opacity-40">
                {saving ? 'Posting…' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
