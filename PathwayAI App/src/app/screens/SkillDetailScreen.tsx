import { ArrowLeft, BookOpen, GraduationCap, Briefcase, Clock, CheckCircle2, Target, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { skills as skillsApi, type UserSkill } from '../lib/api';

type SkillWithActions = UserSkill & {
  description?: string;
  actions?: Array<{ type: string; title: string; provider: string }>;
};

export default function SkillDetailScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { skillId } = useParams();
  const [skill, setSkill] = useState<SkillWithActions | null>(null);

  useEffect(() => {
    skillsApi.list().then(list => {
      const found = list.find(s => s.id === skillId || s.skillId === skillId);
      if (found) setSkill(found as SkillWithActions);
    }).catch(console.error);
  }, [skillId]);

  if (!skill) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">{t('Loading...', '載入中...')}</p>
      </div>
    );
  }

  const getGapColor = (gap: string) => {
    switch (gap.toUpperCase()) {
      case 'HIGH':
        return 'from-rose-500/20 to-pink-500/10 border-rose-500/30';
      case 'MEDIUM':
        return 'from-amber-500/20 to-orange-500/10 border-amber-500/30';
      case 'LOW':
        return 'from-emerald-500/20 to-green-500/10 border-emerald-500/30';
      default:
        return 'from-slate-500/20 to-slate-600/10 border-slate-500/30';
    }
  };

  const daysRemaining = skill.gap.toUpperCase() === 'HIGH' ? 90 : skill.gap.toUpperCase() === 'MEDIUM' ? 60 : 30;
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysRemaining);

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
          <h1 className="text-white text-xl font-bold">{skill.name}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t(skill.description, skill.description)}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Current Progress & Learning Path - Combined */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            {t('Current Progress & Learning Path', '當前進度與學習路徑')}
          </h3>
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className={`bg-gradient-to-r ${getGapColor(skill.gap)} backdrop-blur-sm rounded-2xl p-6 border shadow-xl space-y-6`}
          >
            {/* Progress Summary */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    skill.gap.toUpperCase() === 'HIGH' ? 'bg-rose-500/30 text-rose-300' :
                    skill.gap.toUpperCase() === 'MEDIUM' ? 'bg-amber-500/30 text-amber-300' :
                    'bg-emerald-500/30 text-emerald-300'
                  }`}>
                    {t(skill.gap.toUpperCase() === 'HIGH' ? 'High Priority' : skill.gap.toUpperCase() === 'MEDIUM' ? 'Medium Priority' : 'On Track',
                       skill.gap.toUpperCase() === 'HIGH' ? '高優先' : skill.gap.toUpperCase() === 'MEDIUM' ? '中等優先' : '進展良好')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white text-3xl font-bold">{skill.level}%</p>
                  <p className="text-slate-400 text-xs">{t('Complete', '完成度')}</p>
                </div>
              </div>
              <div className="flex-1 bg-slate-900/40 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all shadow-lg"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{daysRemaining} {t('days', '天')}</p>
                    <p className="text-slate-400 text-xs">{t('Est. remaining', '預計剩餘')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{estimatedCompletionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-slate-400 text-xs">{t('Target date', '目標日期')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Learning Path */}
            {skill.actions && skill.actions.length > 0 && (
            <div className="border-t border-slate-700/50 pt-6">

              {skill.actions.slice(0, 1).map((action, idx) => (
                <div key={idx} className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {action.type === 'module' && (
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-indigo-400" />
                      </div>
                    )}
                    {action.type === 'course' && (
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                      </div>
                    )}
                    {action.type === 'internship' && (
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white font-semibold">{action.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{action.provider}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">{t('Active', '進行中')}</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
            )}
          </motion.div>
        </div>

        {/* Recommended Learning Path */}
        {skill.actions && skill.actions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {t('Recommended Path', '建議路徑')}
            </h3>
            <span className="text-xs text-indigo-400 px-3 py-1 bg-indigo-500/20 rounded-full font-medium">
              {t('Faster by 2 weeks', '快 2 週')}
            </span>
          </div>
          <div className="space-y-3">
            {skill.actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  {action.type === 'module' && (
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                    </div>
                  )}
                  {action.type === 'course' && (
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  {action.type === 'internship' && (
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{action.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{action.provider}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Switch Path CTA */}

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 text-left shadow-2xl shadow-indigo-500/30 relative overflow-hidden group mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {t('Switch to recommended path', '切換到建議路徑')}
                </p>
                <p className="text-indigo-200 text-sm">{t('Complete 2 weeks faster with better outcomes', '快 2 週完成，效果更好')}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.button>
        </div>
        )}

        {/* Ask Coach */}
        <div>
          <button
            onClick={() => navigate('/coach')}
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white py-4 rounded-xl shadow-lg shadow-[#6366F1]/20 font-semibold"
          >
            {t('Ask Coach about this skill', '問教練關於這項技能')}
          </button>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
