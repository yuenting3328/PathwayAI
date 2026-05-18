import { ArrowLeft, Download, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

type Section = 'summary' | 'experience' | 'education' | 'skills';

interface ExpEntry { id: string; title: string; company: string; description: string; }

export default function CvEditorScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<Section>('summary');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Summary
  const [summary, setSummary] = useState('Recent Computer Science graduate with strong analytical skills and passion for data-driven decision making. Experienced in Python, SQL, and data visualization tools.');

  // Experience
  const [experiences, setExperiences] = useState<ExpEntry[]>([
    { id: '1', title: 'Data Analyst Intern', company: 'ABC Company • Jun 2025 - Aug 2025', description: 'Analyzed customer data to identify trends and patterns. Created interactive dashboards using Tableau. Collaborated with team to improve reporting processes.' },
  ]);

  // Education
  const [degree, setDegree] = useState('Bachelor of Computer Science');
  const [institution, setInstitution] = useState('University of Hong Kong');
  const [year, setYear] = useState('2021 - 2025');
  const [otherEducation, setOtherEducation] = useState<Array<{id: string; degree: string; institution: string; year: string}>>([]);

  // Skills
  const [skills, setSkills] = useState(['Python', 'SQL', 'Data Analysis', 'Tableau', 'Excel', 'Statistics']);
  const [newSkill, setNewSkill] = useState('');

  const SECTION_LABELS: Record<Section, [string, string]> = {
    summary:    ['Summary',    '摘要'],
    experience: ['Experience', '工作經驗'],
    education:  ['Education',  '教育背景'],
    skills:     ['Skills',     '技能'],
  };

  const handleAiGenerate = (target: string) => {
    setIsGenerating(target);
    setTimeout(() => {
      if (target === 'summary') {
        setSummary('Results-driven Computer Science graduate with hands-on experience in data analysis, machine learning, and business intelligence. Proficient in Python, SQL, and Tableau, with a proven ability to derive actionable insights from complex datasets. Passionate about leveraging technology to solve real-world business challenges.');
      } else if (target.startsWith('exp-')) {
        const id = target.replace('exp-', '');
        setExperiences(prev => prev.map(e => e.id === id ? {
          ...e,
          description: '• Analysed 50,000+ customer transactions using Python and SQL, identifying a 12% revenue improvement opportunity\n• Built automated Tableau dashboards reducing manual reporting time by 40%\n• Presented data-driven recommendations to senior management, influencing Q3 product strategy',
        } : e));
      }
      setIsGenerating(null);
    }, 1500);
  };

  const handleDownload = () => {
    const content = `
CURRICULUM VITAE

PROFESSIONAL SUMMARY
${summary}

EXPERIENCE
${experiences.map(e => `${e.title}\n${e.company}\n${e.description}`).join('\n\n')}

EDUCATION
${degree}
${institution}

SKILLS
${skills.join(' • ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartCV.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ic = 'w-full bg-slate-800/50 border border-slate-700/40 focus:border-indigo-500/50 rounded-xl px-4 py-4 text-slate-200 text-sm outline-none placeholder:text-slate-600 transition-colors resize-none min-h-[120px]';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 py-4 flex items-center gap-3 z-10 shadow-lg">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          className="w-10 h-10 bg-transparent border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg">{t('Smart CV', '智能履歷')}</h1>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDownload}
          className="w-10 h-10 flex items-center justify-center bg-transparent border border-slate-700/50 rounded-xl text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors">
          <Download className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Section Tabs */}
      <div className="flex-shrink-0 sticky top-[65px] bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-2 flex gap-1 z-10 overflow-x-auto">
        {(Object.keys(SECTION_LABELS) as Section[]).map(section => (
          <button key={section} onClick={() => setActiveSection(section)}
            className={`px-4 py-3 text-sm whitespace-nowrap font-medium transition-colors ${activeSection === section ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-400'}`}>
            {t(SECTION_LABELS[section][0], SECTION_LABELS[section][1])}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <AnimatePresence mode="wait">
          {/* ── Summary ── */}
          {activeSection === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">{t('Professional Summary', '個人摘要')}</p>
                <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={5} className={ic}
                  placeholder={t('Summarise who you are in 2–3 lines.', '用 2–3 句簡短介紹你自己。')} />
              </div>
              <AiGenerateButton
                label={t('AI Generate', 'AI 生成')}
                loading={isGenerating === 'summary'}
                onClick={() => handleAiGenerate('summary')}
              />
            </motion.div>
          )}

          {/* ── Experience ── */}
          {activeSection === 'experience' && (
            <motion.div key="experience" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{t('Role', '職位')}</p>
                    <button onClick={() => setExperiences(p => p.filter(e => e.id !== exp.id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                  <input value={exp.title} onChange={e => setExperiences(p => p.map(x => x.id === exp.id ? { ...x, title: e.target.value } : x))}
                    placeholder={t('Job title', '職位名稱')}
                    className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                  <input value={exp.company} onChange={e => setExperiences(p => p.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x))}
                    placeholder={t('Company • Dates', '公司 • 日期')}
                    className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-2.5 text-slate-400 text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                  <textarea value={exp.description} onChange={e => setExperiences(p => p.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))}
                    rows={4} placeholder={t('Responsibilities and achievements…', '職責及成就…')}
                    className={ic} />
                  <AiGenerateButton
                    label={t('AI Generate', 'AI 生成')}
                    loading={isGenerating === `exp-${exp.id}`}
                    onClick={() => handleAiGenerate(`exp-${exp.id}`)}
                  />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setExperiences(p => [...p, { id: Date.now().toString(), title: '', company: '', description: '' }])}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-indigo-500/40 rounded-xl text-indigo-400 text-sm font-medium hover:bg-indigo-500/5 transition-colors">
                <Plus className="w-4 h-4" />{t('Add experience', '添加經驗')}
              </motion.button>
            </motion.div>
          )}

          {/* ── Education ── */}
          {activeSection === 'education' && (
            <motion.div key="education" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 space-y-3">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{t('Education', '教育背景')}</p>
                <input value={degree} onChange={e => setDegree(e.target.value)}
                  placeholder={t('Degree', '學位')}
                  className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                <input value={institution} onChange={e => setInstitution(e.target.value)}
                  placeholder={t('Institution', '院校')}
                  className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                <input value={year} onChange={e => setYear(e.target.value)}
                  placeholder={t('Year', '年份')}
                  className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
              </div>
              {otherEducation.map(edu => (
                <div key={edu.id} className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{t('Other Education', '其他教育')}</p>
                    <button onClick={() => setOtherEducation(p => p.filter(e => e.id !== edu.id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                  <input value={edu.degree} onChange={e => setOtherEducation(p => p.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x))}
                    placeholder={t('Degree', '學位')}
                    className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                  <input value={edu.institution} onChange={e => setOtherEducation(p => p.map(x => x.id === edu.id ? { ...x, institution: e.target.value } : x))}
                    placeholder={t('Institution', '院校')}
                    className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                  <input value={edu.year} onChange={e => setOtherEducation(p => p.map(x => x.id === edu.id ? { ...x, year: e.target.value } : x))}
                    placeholder={t('Year', '年份')}
                    className="w-full bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-3.5 text-slate-400 text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => setOtherEducation(p => [...p, { id: Date.now().toString(), degree: '', institution: '', year: '' }])}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-indigo-500/40 rounded-xl text-indigo-400 text-sm font-medium hover:bg-indigo-500/5 transition-colors">
                <Plus className="w-4 h-4" />{t('Add Other Education', '添加其他教育')}
              </motion.button>
            </motion.div>
          )}

          {/* ── Skills ── */}
          {activeSection === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-4 space-y-3">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{t('Skills', '技能')}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <motion.div key={skill} layout className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-full text-sm font-medium">
                      <span>{skill}</span>
                      <button onClick={() => setSkills(p => p.filter(s => s !== skill))} className="text-indigo-400/60 hover:text-rose-400 transition-colors">
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                    placeholder={t('Add skill…', '添加技能…')}
                    className="flex-1 bg-slate-900/50 border border-slate-700/30 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" />
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={() => { if (newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                    className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 mt-2">
          {t('Save changes', '儲存更改')}
        </motion.button>

        <div className="h-6" />
      </div>
    </div>
  );
}

function AiGenerateButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500/15 to-purple-500/10 border border-indigo-500/25 rounded-xl text-indigo-300 text-sm font-medium hover:from-indigo-500/20 hover:to-purple-500/15 transition-all disabled:opacity-60">
      {loading
        ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating…</span></>
        : <><Sparkles className="w-4 h-4" /><span>{label}</span></>
      }
    </motion.button>
  );
}
