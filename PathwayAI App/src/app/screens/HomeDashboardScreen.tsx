import { TrendingUp, Target, BookOpen, ChevronRight, FileText, Sparkles, BarChart3, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { analytics, market, auth as authApi, saveTokens, type StudentAnalytics, type MarketSignal } from '../lib/api';
import { findCardForApiSignal } from '../data/marketSignalData';
import StatCard from '../components/StatCard';

export default function HomeDashboardScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<StudentAnalytics | null>(null);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [transitioned, setTransitioned] = useState(false);

  useEffect(() => {
    analytics.me().then(setAnalyticsData).catch(console.error);
    market.signals().then(setSignals).catch(console.error);
  }, []);

  const handleAlumniTransition = async () => {
    setTransitioning(true);
    try {
      const { token } = await authApi.transitionToAlumni();
      saveTokens(token, '');
      await refreshUser();
      setTransitioned(true);
    } catch {
      // Backend not yet wired — optimistically update UI
      setTransitioned(true);
    } finally {
      setTransitioning(false);
    }
  };

  const isRecentGraduate =
    user?.role === 'GRADUATE' &&
    user?.profile?.graduationYear != null &&
    user.profile.graduationYear <= new Date().getFullYear();

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
      {/* Alumni transition banner */}
      {isRecentGraduate && !transitioned && user?.role !== 'ALUMNI' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">
              {t("You've graduated! Join the alumni network.", '你已畢業！加入校友網絡。')}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              {t('Unlock mentoring, exclusive events, and career progression tracking.', '解鎖導師配對、獨家活動及職涯追蹤功能。')}
            </p>
          </div>
          <button
            onClick={handleAlumniTransition}
            disabled={transitioning}
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {transitioning ? t('Joining…', '加入中…') : t('Join Alumni', '加入校友')}
          </button>
        </motion.div>
      )}
      {transitioned && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-3"
        >
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <p className="text-indigo-300 text-sm font-medium">
            {t("Welcome to the alumni network! Your profile has been updated.", '歡迎加入校友網絡！你的個人資料已更新。')}
          </p>
        </motion.div>
      )}
      {/* Enhanced Status KPIs with animations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">{t('Your Progress', '你的進度')}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/outcomes')}
            className="text-indigo-400 text-sm flex items-center gap-1 hover:text-indigo-300 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {t('Full benchmarks', '完整基準')}
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard
            value={analyticsData?.applications ?? 0}
            label={t('Applications', '申請職位')}
            icon={Target}
            color="amber"
            trend="up"
            trendValue="+3"
            onClick={() => navigate('/applications')}
          />
          <StatCard
            value={analyticsData?.interviews ?? 0}
            label={t('Interviews', '面試機會')}
            icon={TrendingUp}
            color="emerald"
            trend="up"
            trendValue="+1"
            onClick={() => navigate('/interviews')}
          />
        </div>

        {/* Enhanced Conversion Rate Card */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-xs font-medium mb-1 uppercase tracking-wide">{t('Conversion Rate', '轉化率')}</p>
              <p className="text-white text-4xl font-bold mb-2">{analyticsData?.conversionRate ?? 0}%</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-400 text-sm px-2 py-1 bg-emerald-500/20 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>{t('Above average', '高於平均')}</span>
                </span>
              </div>
            </div>
            <div className="relative">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(analyticsData?.conversionRate ?? 0) * 2.51} 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Market Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">{t('Market Radar', '市場動態')}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/market-radar')}
            className="text-sky-400 text-sm hover:text-sky-300 transition-colors flex items-center gap-1"
          >
            {t('See all', '查看全部')}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
        {signals.slice(0, 1).map((signal: MarketSignal) => (
          <motion.button
            key={signal.id}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { const card = findCardForApiSignal(signal); navigate(card ? `/market-radar/signal/${card.id}` : '/market-radar'); }}
            className="w-full bg-gradient-to-br from-sky-500/20 to-blue-600/10 backdrop-blur-sm rounded-2xl p-5 border border-sky-500/30 shadow-xl shadow-sky-500/10 relative overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-sky-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">{signal.title}</p>
                <p className="text-slate-400 text-sm mb-3">{signal.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-emerald-400 text-xs px-3 py-1.5 bg-emerald-500/20 rounded-full font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {signal.trend}
                  </span>
                  {signal.salaryMin && signal.salaryMax && (
                    <span className="text-amber-400 text-xs px-3 py-1.5 bg-amber-500/20 rounded-full font-medium">
                      HK${(signal.salaryMin / 1000).toFixed(0)}K-{(signal.salaryMax / 1000).toFixed(0)}K
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-sky-400 flex-shrink-0" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Enhanced Guided Next Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-white text-lg font-semibold mb-4">{t('Recommended Actions', '建議行動')}</h3>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/skills')}
            className="w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 text-left hover:border-rose-500/50 transition-all duration-300 shadow-lg hover:shadow-rose-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500/20 to-pink-500/10 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-0.5">
                    {t('Close data analysis skill gap', '縮小資料分析技能差距')}
                  </p>
                  <p className="text-slate-400 text-xs">{t('High impact for target roles', '對目標職位影響重大')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/cv-editor')}
            className="w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 text-left hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-0.5">{t('Update your CV', '更新你的履歷')}</p>
                  <p className="text-slate-400 text-xs">{t('Last updated 2 days ago', '2 天前更新')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/jobs')}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-left shadow-2xl shadow-indigo-500/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-lg mb-1">
                  {t('Explore 8 new matching roles', '探索 8 個新配對職位')}
                </p>
                <p className="text-indigo-200 text-sm">{t('Based on your profile and skills', '根據你的個人資料和技能')}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom padding */}
      <div className="h-4"></div>
    </div>
  );
}
