import {
  Plus, Briefcase, FolderOpen, Edit2, Trash2, X, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Experience {
  id: string;
  role: string;
  company: string;
  type: string;
  start: string;
  end: string;
  present: boolean;
  description: string;
}
interface Project {
  id: string;
  title: string;
  context: string;
  description: string;
  skills: string;
}

const expTypes = ['Internship', 'Part-time', 'Full-time', 'Volunteer'];

export default function ExperienceAndProjectsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: '1', role: 'Data Analyst Intern', company: 'HSBC', type: 'Internship', start: 'Jun 2024', end: 'Aug 2024', present: false, description: 'Built dashboards in Python and SQL for retail banking team.' },
  ]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [showExpSheet, setShowExpSheet] = useState(false);
  const [showProjSheet, setShowProjSheet] = useState(false);
  const [editExp, setEditExp] = useState<Experience | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

  // Experience form state
  const [eForm, setEForm] = useState<Omit<Experience, 'id'>>({ role: '', company: '', type: 'Internship', start: '', end: '', present: false, description: '' });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Project form state
  const [pForm, setPForm] = useState<Omit<Project, 'id'>>({ title: '', context: '', description: '', skills: '' });

  const openAddExp = () => {
    setEForm({ role: '', company: '', type: 'Internship', start: '', end: '', present: false, description: '' });
    setEditExp(null); setShowExpSheet(true);
  };
  const openEditExp = (e: Experience) => { setEForm(e); setEditExp(e); setShowExpSheet(true); };
  const saveExp = () => {
    if (editExp) {
      setExperiences(prev => prev.map(e => e.id === editExp.id ? { ...eForm, id: editExp.id } : e));
    } else {
      setExperiences(prev => [...prev, { ...eForm, id: Date.now().toString() }]);
    }
    setShowExpSheet(false);
  };
  const deleteExp = (id: string) => setExperiences(prev => prev.filter(e => e.id !== id));

  const openAddProj = () => { setPForm({ title: '', context: '', description: '', skills: '' }); setEditProj(null); setShowProjSheet(true); };
  const openEditProj = (p: Project) => { setPForm(p); setEditProj(p); setShowProjSheet(true); };
  const saveProj = () => {
    if (editProj) {
      setProjects(prev => prev.map(p => p.id === editProj.id ? { ...pForm, id: editProj.id } : p));
    } else {
      setProjects(prev => [...prev, { ...pForm, id: Date.now().toString() }]);
    }
    setShowProjSheet(false);
  };
  const deleteProj = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

  const inputClass = 'w-full bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 transition-colors';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('Experience & projects', '經驗與項目')}</p>
          <p className="text-slate-500 text-xs">{t('Step 3 of 6', '第 3 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <p className="text-slate-400 text-sm leading-relaxed">
          {t('Add internships or projects to show what you\'ve done.', '添加實習或項目以展示你的經驗。')}
        </p>

        {/* Experience section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold text-sm">{t('Experience', '工作經驗')}</p>
            <motion.button whileTap={{ scale: 0.9 }} onClick={openAddExp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-400 text-xs font-medium">
              <Plus className="w-3.5 h-3.5" />
              {t('Add', '添加')}
            </motion.button>
          </div>

          {experiences.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/50 rounded-2xl p-6 text-center">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">{t('No experience yet', '暫無工作經驗')}</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                {t('Add internships, part-time work, or volunteering to stand out.', '添加實習、兼職或義工經驗以脫穎而出。')}
              </p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={openAddExp}
                className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-medium">
                {t('Add experience', '添加經驗')}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {experiences.map(exp => (
                <motion.div key={exp.id} layout
                  className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{exp.role}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{exp.company} · {exp.type}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{exp.start} – {exp.present ? t('Present', '至今') : exp.end}</p>
                      {exp.description && <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{exp.description}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => openEditExp(exp)} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button onClick={() => deleteExp(exp.id)} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Projects section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold text-sm">{t('Projects', '項目')}</p>
            <motion.button whileTap={{ scale: 0.9 }} onClick={openAddProj}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-400 text-xs font-medium">
              <Plus className="w-3.5 h-3.5" />
              {t('Add', '添加')}
            </motion.button>
          </div>

          {projects.length === 0 ? (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/50 rounded-2xl p-5 text-center">
              <FolderOpen className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-xs leading-relaxed">
                {t('No projects yet. Add capstone, course, or personal projects.', '暫無項目。添加畢業項目、課程或個人項目。')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(proj => (
                <motion.div key={proj.id} layout
                  className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{proj.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{proj.context}</p>
                      {proj.skills && <p className="text-indigo-400 text-xs mt-1">{proj.skills}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => openEditProj(proj)} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button onClick={() => deleteProj(proj.id)} className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile/skills-interests')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Save & Continue', '儲存並繼續')}
        </motion.button>
      </div>

      {/* Experience Bottom Sheet */}
      <AnimatePresence>
        {showExpSheet && (
          <>
            <motion.div key="exp-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowExpSheet(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div key="exp-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-slate-700 rounded-full" /></div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
                <h3 className="text-white font-semibold text-base">{editExp ? t('Edit experience', '編輯經驗') : t('Add experience', '添加經驗')}</h3>
                <button onClick={() => setShowExpSheet(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4 pb-8">
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Role title', '職位名稱')}</label>
                  <input value={eForm.role} onChange={e => setEForm(f => ({ ...f, role: e.target.value }))}
                    placeholder={t('e.g. Data Analyst Intern', '例如：數據分析師實習生')}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Company', '公司')}</label>
                  <input value={eForm.company} onChange={e => setEForm(f => ({ ...f, company: e.target.value }))}
                    placeholder={t('e.g. HSBC', '例如：滙豐銀行')}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Type', '類型')}</label>
                  <button onClick={() => setShowTypeDropdown(v => !v)}
                    className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm">
                    <span>{eForm.type}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  <AnimatePresence>
                    {showTypeDropdown && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden">
                        {expTypes.map(tp => (
                          <button key={tp} onClick={() => { setEForm(f => ({ ...f, type: tp })); setShowTypeDropdown(false); }}
                            className={`w-full px-4 py-2.5 text-left text-sm ${tp === eForm.type ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                            {tp}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Start', '開始')}</label>
                    <input value={eForm.start} onChange={e => setEForm(f => ({ ...f, start: e.target.value }))}
                      placeholder="Jun 2024" className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('End', '結束')}</label>
                    <input value={eForm.end} onChange={e => setEForm(f => ({ ...f, end: e.target.value }))}
                      disabled={eForm.present} placeholder="Aug 2024" className={`${inputClass} disabled:opacity-40`} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer">
                  <input type="checkbox" checked={eForm.present} onChange={e => setEForm(f => ({ ...f, present: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-500" />
                  {t('Currently working here', '目前在職')}
                </label>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Responsibilities & achievements', '職責及成就')}</label>
                  <textarea value={eForm.description} onChange={e => setEForm(f => ({ ...f, description: e.target.value }))}
                    placeholder={t('Describe what you did and achieved…', '描述你的工作內容及成就…')}
                    rows={3}
                    className="w-full bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 resize-none transition-colors" />
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={saveExp}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm">
                  {t('Save experience', '儲存經驗')}
                </motion.button>
                <button onClick={() => setShowExpSheet(false)} className="w-full text-slate-500 text-sm py-1">
                  {t('Cancel', '取消')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Project Bottom Sheet */}
      <AnimatePresence>
        {showProjSheet && (
          <>
            <motion.div key="proj-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowProjSheet(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div key="proj-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-slate-700 rounded-full" /></div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
                <h3 className="text-white font-semibold text-base">{editProj ? t('Edit project', '編輯項目') : t('Add project', '添加項目')}</h3>
                <button onClick={() => setShowProjSheet(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4 pb-8">
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Project title', '項目名稱')}</label>
                  <input value={pForm.title} onChange={e => setPForm(f => ({ ...f, title: e.target.value }))}
                    placeholder={t('e.g. HK Housing Price Predictor', '例如：香港樓價預測模型')}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Context', '背景')}</label>
                  <input value={pForm.context} onChange={e => setPForm(f => ({ ...f, context: e.target.value }))}
                    placeholder={t('e.g. Final year capstone', '例如：最終年畢業項目')}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Description', '描述')}</label>
                  <textarea value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))}
                    placeholder={t('What did you build and what impact did it have?', '你建立了什麼？有什麼影響？')}
                    rows={3}
                    className="w-full bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-slate-600 resize-none" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Skills used', '使用技能')}</label>
                  <input value={pForm.skills} onChange={e => setPForm(f => ({ ...f, skills: e.target.value }))}
                    placeholder={t('e.g. Python, SQL, Tableau', '例如：Python、SQL、Tableau')}
                    className={inputClass} />
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={saveProj}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm">
                  {t('Save project', '儲存項目')}
                </motion.button>
                <button onClick={() => setShowProjSheet(false)} className="w-full text-slate-500 text-sm py-1">
                  {t('Cancel', '取消')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
