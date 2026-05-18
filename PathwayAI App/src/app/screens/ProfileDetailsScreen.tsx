import {
  ArrowLeft, User, GraduationCap, Briefcase, Lightbulb, Brain, Eye, Wallet,
  Check, ChevronDown, Search, Plus, Trash2, Edit2, X, Zap, CheckCircle,
  Download, Info, FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const STEPS = [
  { id: 1, label: 'Basic Info',     labelzh: '基本資料',    icon: User },
  { id: 2, label: 'Education',      labelzh: '教育背景',    icon: GraduationCap },
  { id: 3, label: 'Experience',     labelzh: '經驗',        icon: Briefcase },
  { id: 4, label: 'Skills',         labelzh: '技能',        icon: Lightbulb },
  { id: 5, label: 'Goals',          labelzh: '目標',        icon: Brain },
  { id: 6, label: 'CV',             labelzh: '履歷',        icon: Eye },
  { id: 7, label: 'Credentials',    labelzh: '證書',        icon: Wallet },
];

// ── Step 1: Basic Info ──────────────────────────────────────────────────────
function BasicInfoStep({ t }: { t: (en: string, zh: string) => string }) {
  const [form, setForm] = useState({ fullName: 'Alex Chen', preferredName: 'Alex', email: 'alex.chen@connect.hku.hk', phone: '+852 9123 4567', linkedin: 'linkedin.com/in/alexchen' });
  const Field = ({ field, label, lzh, ph, phzh, type = 'text' }: { field: keyof typeof form; label: string; lzh: string; ph: string; phzh: string; type?: string }) => (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t(label, lzh)}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={t(ph, phzh)}
        className="w-full bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 transition-colors" />
    </div>
  );
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm leading-relaxed">{t('Tell us who you are so we can personalise your profile.', '告訴我們你是誰，讓我們個人化你的資料。')}</p>
      <Field field="fullName"      label="Full name"       lzh="全名"     ph="e.g. Alex Chen"          phzh="例如：陳大文" />
      <Field field="preferredName" label="Preferred name"  lzh="慣用名稱" ph="e.g. Alex"               phzh="例如：阿文" />
      <Field field="email"         label="Email"           lzh="電郵"     ph="e.g. alex@hku.hk"        phzh="例如：alex@hku.hk" type="email" />
      <Field field="phone"         label="Phone"           lzh="電話"     ph="+852 9123 4567"          phzh="+852 9123 4567" />
      <Field field="linkedin"      label="LinkedIn (optional)" lzh="LinkedIn（選填）" ph="linkedin.com/in/yourname" phzh="linkedin.com/in/yourname" />
    </div>
  );
}

// ── Step 2: Education ───────────────────────────────────────────────────────
function EducationStep({ t }: { t: (en: string, zh: string) => string }) {
  const [institution, setInstitution] = useState('The University of Hong Kong');
  const [programme, setProgramme] = useState('BEng Computer Science');
  const [degree, setDegree] = useState('Bachelor');
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState('2025');
  const [gpa, setGpa] = useState('');
  const [showDegDD, setShowDegDD] = useState(false);
  const [showGpaDD, setShowGpaDD] = useState(false);
  const degreeLevels = ['Bachelor', 'Master', 'PhD', 'Associate Degree', 'Higher Diploma'];
  const gpaBands = ['4.0+', '3.5–3.9', '3.0–3.4', '2.5–2.9', '2.0–2.4', 'Below 2.0'];
  const ic = 'w-full bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 transition-colors';
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm leading-relaxed">{t('Link your degree so we can benchmark you against outcomes from your programme.', '連結你的學位以進行成果比較。')}</p>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Institution', '院校')}</label>
        <input value={institution} onChange={e => setInstitution(e.target.value)} className={ic} />
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Programme', '課程')}</label>
        <input value={programme} onChange={e => setProgramme(e.target.value)} className={ic} />
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Degree level', '學位等級')}</label>
        <button onClick={() => setShowDegDD(v => !v)} className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm">
          <span>{degree}</span><ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <AnimatePresence>
          {showDegDD && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 relative">
              {degreeLevels.map(d => <button key={d} onClick={() => { setDegree(d); setShowDegDD(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm ${d === degree ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{d}</button>)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Major', '主修')}</label>
        <input value={major} onChange={e => setMajor(e.target.value)} className={ic} />
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Graduation year', '畢業年份')}</label>
        <input value={gradYear} onChange={e => setGradYear(e.target.value)} type="number" className={ic} />
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('GPA (optional)', 'GPA（選填）')}</label>
        <button onClick={() => setShowGpaDD(v => !v)} className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm">
          <span className={gpa ? 'text-white' : 'text-slate-600'}>{gpa || t('Select grade band…', '選擇成績等級…')}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <AnimatePresence>
          {showGpaDD && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 relative">
              {gpaBands.map(g => <button key={g} onClick={() => { setGpa(g); setShowGpaDD(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm ${g === gpa ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{g}</button>)}
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-slate-600 text-xs mt-1.5">{t('Add GPA later to improve match quality.', '可稍後添加 GPA 以提升配對質量。')}</p>
      </div>
    </div>
  );
}

// ── Step 3: Experience & Projects ────────────────────────────────────────────
interface Exp { id: string; role: string; company: string; type: string; start: string; end: string; present: boolean; description: string; }
const expTypes = ['Internship', 'Part-time', 'Full-time', 'Volunteer'];
function ExperienceStep({ t }: { t: (en: string, zh: string) => string }) {
  const [experiences, setExperiences] = useState<Exp[]>([
    { id: '1', role: 'Data Analyst Intern', company: 'HSBC', type: 'Internship', start: 'Jun 2024', end: 'Aug 2024', present: false, description: 'Built dashboards in Python and SQL for retail banking team.' },
  ]);
  const [showSheet, setShowSheet] = useState(false);
  const [editing, setEditing] = useState<Exp | null>(null);
  const [form, setForm] = useState<Omit<Exp, 'id'>>({ role: '', company: '', type: 'Internship', start: '', end: '', present: false, description: '' });
  const [showTypeDD, setShowTypeDD] = useState(false);
  const ic = 'w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600';
  const openAdd = () => { setForm({ role: '', company: '', type: 'Internship', start: '', end: '', present: false, description: '' }); setEditing(null); setShowSheet(true); };
  const openEdit = (e: Exp) => { setForm(e); setEditing(e); setShowSheet(true); };
  const save = () => { editing ? setExperiences(p => p.map(e => e.id === editing.id ? { ...form, id: editing.id } : e)) : setExperiences(p => [...p, { ...form, id: Date.now().toString() }]); setShowSheet(false); };
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm leading-relaxed">{t('Add internships or projects to show what you\'ve done.', '添加實習或項目以展示你的經驗。')}</p>
      {experiences.length === 0 ? (
        <div className="border border-dashed border-slate-700/50 rounded-2xl p-6 text-center">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">{t('No experience yet. Add internships, part-time or volunteering.', '暫無經驗。添加實習、兼職或義工。')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{exp.role}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{exp.company} · {exp.type}</p>
                  <p className="text-slate-500 text-xs">{exp.start} – {exp.present ? t('Present', '至今') : exp.end}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(exp)} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center"><Edit2 className="w-3.5 h-3.5 text-slate-400" /></button>
                  <button onClick={() => setExperiences(p => p.filter(e => e.id !== exp.id))} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-rose-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <motion.button whileTap={{ scale: 0.96 }} onClick={openAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-indigo-500/40 rounded-xl text-indigo-400 text-sm font-medium hover:bg-indigo-500/5 transition-colors">
        <Plus className="w-4 h-4" />{t('Add experience', '添加經驗')}
      </motion.button>
      {/* Sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSheet(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div key="sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-center pt-3"><div className="w-10 h-1 bg-slate-700 rounded-full" /></div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
                <h3 className="text-white font-semibold">{editing ? t('Edit experience', '編輯經驗') : t('Add experience', '添加經驗')}</h3>
                <button onClick={() => setShowSheet(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="px-6 py-5 space-y-4 pb-8">
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder={t('Role title', '職位名稱')} className={ic} />
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder={t('Company', '公司')} className={ic} />
                <button onClick={() => setShowTypeDD(v => !v)} className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm">
                  <span>{form.type}</span><ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <AnimatePresence>
                  {showTypeDD && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden">
                      {expTypes.map(tp => <button key={tp} onClick={() => { setForm(f => ({ ...f, type: tp })); setShowTypeDD(false); }} className={`w-full px-4 py-2.5 text-left text-sm ${tp === form.type ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{tp}</button>)}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-3">
                  <input value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} placeholder="Jun 2024" className={`${ic} flex-1`} />
                  <input value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} disabled={form.present} placeholder="Aug 2024" className={`${ic} flex-1 disabled:opacity-40`} />
                </div>
                <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.present} onChange={e => setForm(f => ({ ...f, present: e.target.checked }))} className="w-4 h-4 accent-indigo-500" />
                  {t('Currently here', '目前在職')}
                </label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t('Responsibilities…', '職責…')} rows={3}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 resize-none" />
                <motion.button whileTap={{ scale: 0.98 }} onClick={save} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm">
                  {t('Save', '儲存')}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 4: Skills & Interests ───────────────────────────────────────────────
const SKILLS = ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'R', 'Machine Learning', 'Data Analysis', 'Statistics', 'JavaScript', 'Communication', 'Teamwork', 'Project Management', 'Critical Thinking', 'Leadership'];
const SECTORS = ['Banking & Finance', 'Technology', 'Consulting', 'Accounting', 'Healthcare', 'Government', 'Education'];
const ROLES = ['Data & Analytics', 'Operations', 'Finance', 'Engineering', 'Marketing', 'Strategy'];
interface SkillEntry { name: string; level: string; }
function SkillsStep({ t }: { t: (en: string, zh: string) => string }) {
  const [selected, setSelected] = useState<SkillEntry[]>([{ name: 'Python', level: 'Intermediate' }, { name: 'SQL', level: 'Basic' }]);
  const [sectors, setSectors] = useState<string[]>(['Technology']);
  const [roles, setRoles] = useState<string[]>(['Data & Analytics']);
  const [levelDD, setLevelDD] = useState<string | null>(null);
  const toggle = (name: string) => selected.find(s => s.name === name) ? setSelected(p => p.filter(s => s.name !== name)) : setSelected(p => [...p, { name, level: 'Basic' }]);
  const setLev = (name: string, level: string) => { setSelected(p => p.map(s => s.name === name ? { ...s, level } : s)); setLevelDD(null); };
  const lc = (l: string) => l === 'Advanced' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : l === 'Intermediate' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-400 bg-slate-700/40 border-slate-600/40';
  return (
    <div className="space-y-5">
      <p className="text-slate-400 text-sm leading-relaxed">{t("Tell us what you're good at to get better matches.", '告訴我們你的強項以獲得更好的配對。')}</p>
      <div>
        <p className="text-white font-semibold text-sm mb-2">{t('Skills', '技能')}</p>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map(s => (
              <div key={s.name} className="relative">
                <button onClick={() => setLevelDD(levelDD === s.name ? null : s.name)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium ${lc(s.level)}`}>
                  <Check className="w-3 h-3" />{s.name} · {s.level}<ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {levelDD === s.name && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 min-w-[110px]">
                      {['Basic', 'Intermediate', 'Advanced'].map(l => <button key={l} onClick={() => setLev(s.name, l)} className={`w-full px-3 py-2 text-left text-xs ${l === s.level ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{l}</button>)}
                      <button onClick={() => toggle(s.name)} className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 border-t border-slate-700/50">{t('Remove', '移除')}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {SKILLS.filter(s => !selected.find(sk => sk.name === s)).map(s => (
            <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => toggle(s)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-400 text-xs hover:border-indigo-500/40 hover:text-indigo-300 transition-colors">
              + {s}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-2">{t('Preferred sectors', '偏好行業')}</p>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map(s => { const sel = sectors.includes(s); return (
            <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setSectors(p => sel ? p.filter(x => x !== s) : [...p, s])}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${sel ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400'}`}>
              {sel && <Check className="w-3 h-3 inline mr-1" />}{s}
            </motion.button>
          ); })}
        </div>
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-2">{t('Preferred role types', '偏好職位類型')}</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(r => { const sel = roles.includes(r); return (
            <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => setRoles(p => sel ? p.filter(x => x !== r) : [...p, r])}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${sel ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400'}`}>
              {sel && <Check className="w-3 h-3 inline mr-1" />}{r}
            </motion.button>
          ); })}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Personality & Goals ──────────────────────────────────────────────
const HORIZONS = ['First job (within 6 months)', '1–2 years', '3–5 years', '5+ years'];
const SALARIES = ['< HK$10,000', 'HK$10,000–15,000', 'HK$15,000–20,000', 'HK$20,000–25,000', 'HK$25,000–30,000', 'HK$30,000+'];
function GoalsStep({ t }: { t: (en: string, zh: string) => string }) {
  const [role, setRole] = useState('Data Analyst');
  const [horizon, setHorizon] = useState('First job (within 6 months)');
  const [salary, setSalary] = useState('HK$15,000–20,000');
  const [showH, setShowH] = useState(false);
  const [showS, setShowS] = useState(false);
  return (
    <div className="space-y-5">
      <p className="text-slate-400 text-sm">{t('Use your personality and goals to guide your long-term path.', '運用你的性格和目標引導你的長期路徑。')}</p>
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">{t('You tend to be analytical and structured.', '你傾向於分析型和有條理。')}</p>
            <ul className="mt-2 space-y-1">
              {['Analytical and data-driven', 'Prefers clear goals', 'Works well independently'].map((tr, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-400 text-xs"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />{t(tr, tr)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Target role', '目標職位')}</label>
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={role} onChange={e => setRole(e.target.value)} className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Time horizon', '時間規劃')}</label>
        <button onClick={() => setShowH(v => !v)} className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm">
          <span>{horizon}</span><ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <AnimatePresence>
          {showH && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 relative">
            {HORIZONS.map(h => <button key={h} onClick={() => { setHorizon(h); setShowH(false); }} className={`w-full px-4 py-2.5 text-left text-sm ${h === horizon ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{h}</button>)}
          </motion.div>}
        </AnimatePresence>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">{t('Expected starting salary', '預期起薪')}<Info className="w-3.5 h-3.5 text-slate-600" /></label>
        <button onClick={() => setShowS(v => !v)} className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm">
          <span>{salary}</span><ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <AnimatePresence>
          {showS && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 relative">
            {SALARIES.map(s => <button key={s} onClick={() => { setSalary(s); setShowS(false); }} className={`w-full px-4 py-2.5 text-left text-sm ${s === salary ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>{s}</button>)}
          </motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Step 6: CV & Visibility ──────────────────────────────────────────────────
function CvStep({ t, navigate }: { t: (en: string, zh: string) => string; navigate: (path: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-[72px] bg-slate-700 rounded-xl flex flex-col items-center justify-center border border-slate-600/50 flex-shrink-0">
            <Eye className="w-6 h-6 text-indigo-400" /><span className="text-slate-500 text-[9px] mt-1">PDF</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{t('Smart CV', '智能履歷')}</p>
            <p className="text-slate-400 text-xs mt-0.5">{t('Updated 2 days ago · 1 page', '2 天前更新 · 1 頁')}</p>
            <div className="flex items-center gap-1.5 mt-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><p className="text-emerald-400 text-xs">{t('Ready to share', '可分享')}</p></div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/cv-editor')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 rounded-xl text-white text-xs font-semibold">
            <Edit2 className="w-3.5 h-3.5" />{t('Edit CV', '編輯履歷')}
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700/60 border border-slate-600/50 rounded-xl text-slate-300 text-xs font-semibold">
            <Download className="w-3.5 h-3.5" />{t('Export PDF', '匯出 PDF')}
          </motion.button>
        </div>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${visible ? 'bg-emerald-500/15' : 'bg-slate-700/40'}`}>
              <Eye className={`w-4 h-4 ${visible ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{t('Let employers find you', '讓僱主找到你')}</p>
              <p className="text-slate-500 text-xs mt-0.5">{visible ? t('Visible to verified employers', '已核實僱主可見') : t('Hidden from employers', '對僱主隱藏')}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setVisible(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${visible ? 'bg-emerald-500' : 'bg-slate-700'}`}>
            <motion.div animate={{ x: visible ? 24 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── Step 7: Credentials ──────────────────────────────────────────────────────
function CredentialsStep({ t, navigate }: { t: (en: string, zh: string) => string; navigate: (path: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">{t('Securely store and share your degree and certificates.', '安全地儲存和分享你的學位及證書。')}</p>
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => navigate('/credentials')}
        className="w-full bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 flex items-center justify-between text-left hover:border-indigo-500/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center"><Wallet className="w-5 h-5 text-amber-400" /></div>
          <div>
            <p className="text-white font-semibold text-sm">{t('Open Credentials Wallet', '開啟證書錢包')}</p>
            <p className="text-slate-400 text-xs mt-0.5">{t('3 verified credentials · 2 documents', '3 個已核實證書 · 2 份文件')}</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 -rotate-90" />
      </motion.button>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-200/70 text-xs leading-relaxed">{t('Credentials are optional but help employers verify your qualifications faster.', '證書是選填的，但可幫助僱主更快速地核實你的資歷。')}</p>
      </div>
    </div>
  );
}

// ── Main ProfileDetailsScreen ────────────────────────────────────────────────
export default function ProfileDetailsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(2); // start at step 3 (first incomplete)

  const goNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); else navigate('/profile'); };
  const goBack = () => { if (currentStep > 0) setCurrentStep(s => s - 1); else navigate('/profile'); };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <BasicInfoStep t={t} />;
      case 1: return <EducationStep t={t} />;
      case 2: return <ExperienceStep t={t} />;
      case 3: return <SkillsStep t={t} />;
      case 4: return <GoalsStep t={t} />;
      case 5: return <CvStep t={t} navigate={navigate} />;
      case 6: return <CredentialsStep t={t} navigate={navigate} />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <motion.button whileTap={{ scale: 0.9 }} onClick={goBack}
          className="w-9 h-9 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 flex-shrink-0">
          <ArrowLeft className="w-4 h-4 text-slate-300" />
        </motion.button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-base truncate">{t(STEPS[currentStep].label, STEPS[currentStep].labelzh)}</p>
          <p className="text-slate-500 text-xs">{t(`Step ${currentStep + 1} of ${STEPS.length}`, `第 ${currentStep + 1} 步，共 ${STEPS.length} 步`)}</p>
        </div>
      </div>

      {/* Stepper bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-800/40 bg-slate-900/60 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div key={step.id} className="flex items-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${isActive ? 'bg-indigo-500/15' : 'hover:bg-slate-800/60'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500/20 border border-emerald-500/40' : isActive ? 'bg-indigo-500/25 border border-indigo-500/50' : 'bg-slate-800/60 border border-slate-700/40'}`}>
                    {isDone
                      ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                      : <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    }
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-indigo-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {t(step.label, step.labelzh)}
                  </span>
                </motion.button>
                {idx < STEPS.length - 1 && (
                  <div className={`w-4 h-px mx-0.5 ${idx < currentStep ? 'bg-emerald-500/40' : 'bg-slate-700/50'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}>
            {renderStep()}
            <div className="h-28" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="flex-shrink-0 px-6 pb-8 pt-4 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex gap-3">
          {currentStep > 0 && (
            null
          )}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={goNext}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30">
            {currentStep < STEPS.length - 1 ? t('Save & continue', '儲存並繼續') : t('Finish', '完成')}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
