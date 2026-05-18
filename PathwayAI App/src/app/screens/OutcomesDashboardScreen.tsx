import { ArrowLeft, TrendingUp, Users, Clock, GraduationCap, Target, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function OutcomesDashboardScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const outcomeMetrics = {
    employmentRate: 92.5,
    medianSalary: 28500,
    timeToOffer: 45,
    furtherStudy: 12.3,
  };

  const typicalRoles = [
    { title: 'Data Analyst', percentage: 28, salary: '25K-35K' },
    { title: 'Business Analyst', percentage: 22, salary: '28K-38K' },
    { title: 'Software Developer', percentage: 18, salary: '30K-45K' },
  ];

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
          <h1 className="text-white text-xl font-bold">{t('Outcomes & Benchmarks', '成果與基準')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {t('Computer Science • 2025 Cohort', '電腦科學 • 2025 屆')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Top KPI Cards */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            {t('Your Programme Outcomes', '你的課程成果')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-sm rounded-2xl p-5 border border-emerald-500/30 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <span className="text-xs text-emerald-400 px-2 py-1 bg-emerald-500/20 rounded-full">
                  {t('Above avg', '高於平均')}
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{outcomeMetrics.employmentRate}%</p>
              <p className="text-slate-300 text-sm">{t('Employment Rate', '就業率')}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-sm rounded-2xl p-5 border border-amber-500/30 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-400 mb-1">HK${outcomeMetrics.medianSalary.toLocaleString()}</p>
              <p className="text-slate-300 text-sm">{t('Median Salary', '中位薪金')}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-sky-500/20 to-blue-500/10 backdrop-blur-sm rounded-2xl p-5 border border-sky-500/30 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6 text-sky-400" />
              </div>
              <p className="text-3xl font-bold text-sky-400 mb-1">{outcomeMetrics.timeToOffer} {t('days', '天')}</p>
              <p className="text-slate-300 text-sm">{t('Avg. Time to Offer', '平均獲聘時間')}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <GraduationCap className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-1">{outcomeMetrics.furtherStudy}%</p>
              <p className="text-slate-300 text-sm">{t('Further Study', '繼續進修')}</p>
            </motion.div>
          </div>
        </div>

        {/* People Like You */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            {t('Where People Like You Work', '與你相似的人的工作')}
          </h3>
          <div className="space-y-3">
            {typicalRoles.map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all shadow-lg cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{role.title}</h4>
                    <p className="text-amber-400 text-sm mt-1">HK${role.salary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 text-2xl font-bold">{role.percentage}%</p>
                    <p className="text-slate-400 text-xs">{t('of cohort', '同屆學生')}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${role.percentage * 3}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore Career Paths CTA */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/alumni-paths', {
              state: {
                currentProgramme: 'Computer Science',
                cohort: 'Class of 2026',
                targetRole: 'Data Analyst'
              }
            })}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 text-left shadow-2xl shadow-indigo-500/30 relative overflow-hidden group mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {t('Where people like you end up', '與你相似的人的結果')}
                </p>
                <p className="text-indigo-200 text-sm">{t('Explore alumni career pathways', '探索校友職業路徑')}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Competitiveness Snapshot */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {t('Your Competitiveness', '你的競爭力')}
          </h3>
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-indigo-300 text-sm mb-1">{t('Readiness Index', '就業準備指數')}</p>
                <p className="text-white text-4xl font-bold">78%</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray="195.6 251"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">
                    {t('Strong: 4 of 6 key skills for data analyst roles', '優勢：6 項數據分析師關鍵技能中已掌握 4 項')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">
                    {t('Gap: SQL experience and advanced Excel', '差距：SQL 經驗和進階 Excel')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/skills')}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg"
              >
                {t('Improve my chances', '提升我的機會')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/coach')}
                className="flex-1 bg-slate-800/60 backdrop-blur-sm text-slate-300 py-3 rounded-xl font-medium border border-slate-700/50"
              >
                {t('Ask Coach', '問教練')}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
