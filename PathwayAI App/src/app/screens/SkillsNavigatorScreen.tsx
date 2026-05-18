import { ArrowLeft, Target, Sparkles, Clock, X, TrendingUp, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { skills as skillsApi, type UserSkill } from '../lib/api';

type SkillEntry = {
  id: string;
  name: string;
  level: number;
  gap: string;
  impact: string;
  description?: string;
  actions?: Array<{ type: string; title: string; provider: string }>;
};

const whatIfSkillOptions = [
  { id: 'python', name: 'Python', impact: '+12%', description: 'Programming for data analysis' },
  { id: 'ml', name: 'Machine Learning', impact: '+18%', description: 'AI and predictive modelling' },
  { id: 'sql-wi', name: 'SQL (Advanced)', impact: '+8%', description: 'Advanced database querying' },
  { id: 'excel', name: 'Excel', impact: '+6%', description: 'Spreadsheet & data analysis' },
  { id: 'communication', name: 'Client Communication', impact: '+10%', description: 'Professional communication skills' },
  { id: 'cloud', name: 'Cloud (AWS/Azure)', impact: '+15%', description: 'Cloud infrastructure & services' },
];

const skillActionsMap: Record<string, Array<{ type: string; title: string; provider: string }>> = {
  python: [
    { type: 'course', title: 'Python for Everybody', provider: 'Coursera' },
    { type: 'module', title: 'COMP2119 - Intro to Algorithms', provider: 'Your University' },
  ],
  ml: [
    { type: 'course', title: 'Machine Learning Specialization', provider: 'Coursera' },
    { type: 'internship', title: 'ML Research Intern', provider: 'Various Companies' },
  ],
  'sql-wi': [
    { type: 'module', title: 'COMP3278 - Advanced Database Systems', provider: 'Your University' },
    { type: 'course', title: 'Advanced SQL for Analytics', provider: 'Udemy' },
  ],
  excel: [
    { type: 'course', title: 'Excel for Business Analytics', provider: 'LinkedIn Learning' },
  ],
  communication: [
    { type: 'module', title: 'Professional Communication', provider: 'Your University' },
    { type: 'internship', title: 'Client-facing Role', provider: 'Various Companies' },
  ],
  cloud: [
    { type: 'course', title: 'AWS Cloud Practitioner', provider: 'AWS Training' },
    { type: 'course', title: 'Microsoft Azure Fundamentals', provider: 'Microsoft Learn' },
  ],
};

export default function SkillsNavigatorScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [skillList, setSkillList] = useState<UserSkill[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<'now' | 'term' | 'next' | 'year'>('now');
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [selectedWhatIfSkills, setSelectedWhatIfSkills] = useState<string[]>([]);
  const [addedSkills, setAddedSkills] = useState<SkillEntry[]>([]);
  const [targetRole, setTargetRole] = useState(localStorage.getItem('targetRole') || 'Data Analyst');

  useEffect(() => {
    skillsApi.list().then(setSkillList).catch(console.error);
  }, []);

  const allSkills: SkillEntry[] = [...skillList, ...addedSkills];

  const getGapBadge = (gap: string) => {
    switch (gap.toUpperCase()) {
      case 'HIGH': return 'bg-rose-500/30 text-rose-300 border border-rose-500/20';
      case 'MEDIUM': return 'bg-amber-500/30 text-amber-300 border border-amber-500/20';
      case 'LOW': return 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/20';
      default: return 'bg-slate-500/30 text-slate-300';
    }
  };

  const getGapBarColor = (gap: string) => {
    switch (gap.toUpperCase()) {
      case 'HIGH': return 'from-rose-500 to-pink-500';
      case 'MEDIUM': return 'from-amber-500 to-orange-500';
      case 'LOW': return 'from-emerald-500 to-green-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const getCardBg = (gap: string) => {
    switch (gap.toUpperCase()) {
      case 'HIGH': return 'bg-gradient-to-b from-rose-500/15 to-slate-900/80 border-rose-500/25';
      case 'MEDIUM': return 'bg-gradient-to-b from-amber-500/15 to-slate-900/80 border-amber-500/25';
      case 'LOW': return 'bg-gradient-to-b from-emerald-500/15 to-slate-900/80 border-emerald-500/25';
      default: return 'bg-gradient-to-b from-slate-700/40 to-slate-900/80 border-slate-600/25';
    }
  };

  const timelineOptions = [
    { id: 'now', label: t('Now', '現在'), icon: Target },
    { id: 'term', label: t('This Term', '本學期'), icon: Clock },
    { id: 'next', label: t('Next Term', '下學期'), icon: Clock },
    { id: 'year', label: t('12 Months', '12 個月'), icon: Clock },
  ];

  const toggleWhatIfSkill = (skillId: string) => {
    setSelectedWhatIfSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const addSelectedSkills = () => {
    const existingIds = new Set([...skillList.map(s => s.id), ...addedSkills.map(s => s.id)]);
    const newSkills: SkillEntry[] = selectedWhatIfSkills
      .filter(id => !existingIds.has(id))
      .map(id => {
        const option = whatIfSkillOptions.find(s => s.id === id)!;
        return {
          id,
          name: option.name,
          level: 5,
          gap: 'high' as const,
          impact: 'high',
          description: option.description,
          actions: skillActionsMap[id] || [],
        };
      });
    setAddedSkills(prev => [...prev, ...newSkills]);
    setShowWhatIf(false);
    setSelectedWhatIfSkills([]);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center gap-3 z-10 shadow-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Skill Pathway Planner', '技能發展規劃')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('Target:', '目標：')} {targetRole}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Plan Timeline Link */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              {t('Plan Timeline', '規劃時間線')}
            </h3>
            <button
              onClick={() => navigate('/plan-timeline')}
              className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors"
            >
              {t('Setup plan >', '設定計劃 >')}
            </button>
          </div>
        </div>

        {/* Skill Overview Progress */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-300 text-sm mb-1">{t('Skill Readiness', '技能準備度')}</p>
              <p className="text-white text-4xl font-bold">73%</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#skillGradient)"
                  strokeWidth="8"
                  strokeDasharray="183.3 251"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-emerald-400 text-2xl font-bold">4</p>
              <p className="text-slate-400 text-xs">{t('Strong', '優勢')}</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 text-2xl font-bold">2</p>
              <p className="text-slate-400 text-xs">{t('Developing', '發展中')}</p>
            </div>
            <div className="text-center">
              <p className="text-rose-400 text-2xl font-bold">{1 + addedSkills.length}</p>
              <p className="text-slate-400 text-xs">{t('Priority', '優先')}</p>
            </div>
          </div>
        </motion.div>

        {/* Priority Skills – Horizontal Scroll */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              {t('Priority Skills', '優先技能')}
            </h3>
            <span className="text-slate-400 text-xs">{allSkills.length} {t('skills', '項技能')}</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {allSkills.map((skill, idx) => (
              <motion.button
                key={skill.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/skills/${skill.id}`)}
                className={`flex-shrink-0 w-44 ${getCardBg(skill.gap)} backdrop-blur-sm rounded-2xl p-4 border shadow-lg text-left`}
              >
                {/* Gap Badge */}
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${getGapBadge(skill.gap)}`}>
                  {t(
                    skill.gap.toUpperCase() === 'HIGH' ? 'High Priority' : skill.gap.toUpperCase() === 'MEDIUM' ? 'Medium' : 'On Track',
                    skill.gap.toUpperCase() === 'HIGH' ? '高優先' : skill.gap.toUpperCase() === 'MEDIUM' ? '中等' : '進展良好'
                  )}
                </span>

                {/* Skill Name */}
                <h4 className="text-white font-semibold text-sm leading-tight mb-1">{skill.name}</h4>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">{skill.description}</p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs">{t('Level', '水平')}</span>
                    <span className="text-white text-xs font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-900/60 rounded-full h-1.5">
                    <div
                      className={`bg-gradient-to-r ${getGapBarColor(skill.gap)} h-1.5 rounded-full transition-all`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/coach')}
          className="w-full bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white py-3 rounded-lg shadow-lg shadow-[#6366F1]/20"
        >
          {t('Ask Coach how to prioritise', '問教練如何優先處理')}
        </button>

        <div className="h-4"></div>
      </div>

      {/* What If Bottom Sheet */}
      <AnimatePresence>
        {showWhatIf && (
          <>
            <motion.div
              key="wi-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatIf(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              key="wi-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 flex flex-col"
              style={{ maxHeight: '82vh' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
              </div>

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white text-lg font-semibold">
                    {t('What if you add these skills?', '學多呢啲技能會點？')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowWhatIf(false)}
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                <p className="text-slate-400 text-sm mb-4">
                  {t('Select skills to see their impact and add them to your plan.', '選擇技能查看影響，並加入你的規劃。')}
                </p>

                {whatIfSkillOptions.map((skill) => {
                  const alreadyAdded = addedSkills.some(s => s.id === skill.id) || skillList.some(s => s.id === skill.id);
                  const isSelected = selectedWhatIfSkills.includes(skill.id);
                  return (
                    <motion.button
                      key={skill.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={alreadyAdded}
                      onClick={() => !alreadyAdded && toggleWhatIfSkill(skill.id)}
                      className={`w-full rounded-2xl p-4 border transition-all text-left ${
                        alreadyAdded
                          ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
                          : isSelected
                          ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-emerald-500/40 shadow-lg'
                          : 'bg-slate-800/60 border-slate-700/50 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{skill.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{skill.description}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-bold">{skill.impact}</span>
                          </div>
                          {alreadyAdded ? (
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                              {t('Added', '已加入')}
                            </span>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                            }`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {selectedWhatIfSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-300 text-sm">
                        {t('Adding these skills could increase your job openings by', '增加這些技能可提升職位空缺')} +{selectedWhatIfSkills.length * 12} ({selectedWhatIfSkills.length * 8}%)
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="h-2"></div>
              </div>

              {/* Fixed Bottom Button */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800/60 bg-slate-900">
                <button
                  onClick={addSelectedSkills}
                  disabled={selectedWhatIfSkills.length === 0}
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
                    selectedWhatIfSkills.length > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {selectedWhatIfSkills.length > 0
                    ? t(`Add ${selectedWhatIfSkills.length} skill${selectedWhatIfSkills.length > 1 ? 's' : ''} to my plan`, `加入 ${selectedWhatIfSkills.length} 項技能至規劃`)
                    : t('Select skills to add', '請選擇技能')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
