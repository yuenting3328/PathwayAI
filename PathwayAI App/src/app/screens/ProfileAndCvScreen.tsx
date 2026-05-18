import {
  CheckCircle, Circle, Clock, FileText, ChevronRight,
  BarChart3, Award, BookOpen, TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProfileAndCvScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    { status: 'done' as const },
    { status: 'done' as const },
    { status: 'in_progress' as const },
    { status: 'not_started' as const },
    { status: 'not_started' as const },
    { status: 'not_started' as const },
    { status: 'not_started' as const },
  ];

  const requiredCount = 6;
  const completedCount = steps.filter((s, i) => i < requiredCount && s.status === 'done').length;
  const progressPct = Math.round((completedCount / requiredCount) * 100);

  const statusIcon = (status: 'done' | 'in_progress' | 'not_started') => {
    if (status === 'done')        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === 'in_progress') return <Clock className="w-4 h-4 text-amber-400" />;
    return <Circle className="w-4 h-4 text-slate-600" />;
  };

  const moreLinks = [
    { icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/15', label: t('Analytics & Performance', '數據分析與表現'), path: '/analytics' },
    { icon: BookOpen,  color: 'text-rose-400',   bg: 'bg-rose-500/15',   label: t('Skills & Courses', '技能與課程'),           path: '/skills' },
    { icon: Award,     color: 'text-amber-400',  bg: 'bg-amber-500/15',  label: t('Credentials & HEAR', '證書與學習檔案'),     path: '/credentials' },
    { icon: TrendingUp,color: 'text-sky-400',    bg: 'bg-sky-500/15',    label: t('Career paths from your degree', '畢業出路路徑'), path: '/alumni-paths' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
      {/* ── Profile Completion Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden"
      >
        <div className="px-6 pt-6 pb-5">
          <h3 className="text-white font-bold text-xl">
            {t('Profile completion', '個人資料完成度')}
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {t(
              'Fill in the essentials to get stronger matches and better outcomes.',
              '填寫必要資料以獲得更強的配對和更佳的結果。'
            )}
          </p>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">
                {completedCount} / {requiredCount} {t('steps completed', '步驟完成')}
              </span>
              <span className="text-indigo-400 font-bold text-sm">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full shadow-lg shadow-indigo-500/30"
              />
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profile/details')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30"
          >
            {t('Continue where you left off', '繼續你未完成的部分')}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Your CV ── */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          {t('Your CV', '你的履歷')}
        </p>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/cv-editor')}
          className="w-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/40 transition-all text-left shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-slate-600/50">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{t('Smart CV', '智能履歷')}</p>
                <p className="text-slate-400 text-xs mt-0.5">{t('Last updated 2 days ago', '2 天前更新')}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <p className="text-emerald-400 text-xs">{t('Ready to export', '可匯出')}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </motion.button>
      </div>

      {/* ── More ── */}
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          {t('More', '更多')}
        </p>
        <div className="space-y-2">
          {moreLinks.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.path)}
                className="w-full bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/40 hover:border-indigo-500/30 transition-all text-left shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
