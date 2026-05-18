import { Check, ChevronDown, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

const SUGGESTED_SKILLS = [
  'Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'R', 'Java', 'JavaScript',
  'Machine Learning', 'Data Analysis', 'Statistics', 'Financial Modelling',
  'Project Management', 'Communication', 'Teamwork', 'Problem Solving',
  'Critical Thinking', 'Presentation', 'Leadership', 'Negotiation',
];
const LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const SECTORS = ['Banking & Finance', 'Technology', 'Consulting', 'Accounting', 'Healthcare', 'Government', 'Education', 'Retail', 'Media & Comms'];
const ROLE_FAMILIES = ['Data & Analytics', 'Operations', 'Finance', 'Engineering', 'Marketing', 'Strategy', 'Human Resources', 'Sales'];

interface SkillEntry { name: string; level: string; }

export default function SkillsAndInterestsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [selectedSkills, setSelectedSkills] = useState<SkillEntry[]>([
    { name: 'Python', level: 'Intermediate' },
    { name: 'SQL', level: 'Basic' },
    { name: 'Data Analysis', level: 'Intermediate' },
  ]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Technology', 'Banking & Finance']);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Data & Analytics']);
  const [levelDropdown, setLevelDropdown] = useState<string | null>(null);

  const toggleSkill = (name: string) => {
    if (selectedSkills.find(s => s.name === name)) {
      setSelectedSkills(prev => prev.filter(s => s.name !== name));
    } else {
      setSelectedSkills(prev => [...prev, { name, level: 'Basic' }]);
    }
  };
  const setLevel = (name: string, level: string) => {
    setSelectedSkills(prev => prev.map(s => s.name === name ? { ...s, level } : s));
    setLevelDropdown(null);
  };
  const toggleSector = (s: string) => setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleRole = (r: string) => setSelectedRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const levelColor = (l: string) => l === 'Advanced' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : l === 'Intermediate' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-400 bg-slate-700/40 border-slate-600/40';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('Skills & interests', '技能與興趣')}</p>
          <p className="text-slate-500 text-xs">{t('Step 4 of 6', '第 4 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <p className="text-slate-400 text-sm leading-relaxed">
          {t(
            "Tell us what you're good at and what you're interested in so we can match you better.",
            '告訴我們你的強項和興趣，讓我們更好地為你配對。'
          )}
        </p>

        {/* Skills */}
        <div>
          <p className="text-white font-semibold text-sm mb-1">{t('Skills', '技能')}</p>
          <p className="text-slate-500 text-xs mb-3">
            {t(`${selectedSkills.length} selected — tap to add, set your level`, `已選 ${selectedSkills.length} 個 — 點擊添加，設定熟練度`)}
          </p>

          {/* Selected skills with levels */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map(skill => (
                <div key={skill.name} className="relative">
                  <button onClick={() => setLevelDropdown(levelDropdown === skill.name ? null : skill.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${levelColor(skill.level)}`}>
                    <Check className="w-3 h-3" />
                    {skill.name}
                    <span className="opacity-70">· {skill.level}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {levelDropdown === skill.name && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-10 min-w-[120px]">
                        {LEVELS.map(l => (
                          <button key={l} onClick={() => setLevel(skill.name, l)}
                            className={`w-full px-3 py-2 text-left text-xs ${l === skill.level ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                            {l}
                          </button>
                        ))}
                        <button onClick={() => toggleSkill(skill.name)}
                          className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 border-t border-slate-700/50">
                          {t('Remove', '移除')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter(s => !selectedSkills.find(sk => sk.name === s)).map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => toggleSkill(s)}
                className="px-3 py-1.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-400 text-xs hover:border-indigo-500/40 hover:text-indigo-300 transition-colors">
                + {s}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Run skill check CTA */}
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/skills')}
          className="w-full flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-left">
          <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-indigo-300 text-sm font-semibold">{t('Run skill check', '進行技能評估')}</p>
            <p className="text-slate-500 text-xs mt-0.5">{t('See your gaps vs. target roles', '查看與目標職位的技能差距')}</p>
          </div>
        </motion.button>

        {/* Preferred sectors */}
        <div>
          <p className="text-white font-semibold text-sm mb-1">{t('Preferred sectors', '偏好行業')}</p>
          <p className="text-slate-500 text-xs mb-3">{t('Select all that interest you', '選擇所有感興趣的行業')}</p>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(s => {
              const sel = selectedSectors.includes(s);
              return (
                <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => toggleSector(s)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${sel ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
                  {sel && <Check className="w-3 h-3 inline mr-1" />}
                  {s}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Preferred role families */}
        <div>
          <p className="text-white font-semibold text-sm mb-1">{t('Preferred role types', '偏好職位類型')}</p>
          <p className="text-slate-500 text-xs mb-3">{t('What kind of work excites you?', '什麼類型的工作令你興奮？')}</p>
          <div className="flex flex-wrap gap-2">
            {ROLE_FAMILIES.map(r => {
              const sel = selectedRoles.includes(r);
              return (
                <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => toggleRole(r)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${sel ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
                  {sel && <Check className="w-3 h-3 inline mr-1" />}
                  {r}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile/personality-goals')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Save & Continue', '儲存並繼續')}
        </motion.button>
      </div>
    </div>
  );
}
