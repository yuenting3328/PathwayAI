import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { analytics, type StudentAnalytics } from '../lib/api';

export default function AnalyticsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<StudentAnalytics | null>(null);

  useEffect(() => {
    analytics.me().then(setData).catch(console.error);
  }, []);

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
          <h1 className="text-white text-xl font-bold">{t('Analytics & Performance', '數據分析與表現')}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Headline Metrics */}
        <div>
          <h3 className="text-white mb-3">{t('Your Performance', '你的表現')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <p className="text-slate-400 text-xs mb-1">{t('Applications', '申請職位')}</p>
              <p className="text-white text-2xl">{data?.applications ?? 0}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <p className="text-slate-400 text-xs mb-1">{t('Interviews', '面試機會')}</p>
              <p className="text-white text-2xl">{data?.interviews ?? 0}</p>
            </div>
            <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
              <p className="text-slate-400 text-xs mb-1">{t('Offers', '錄取')}</p>
              <p className="text-white text-2xl">{data?.offers ?? 0}</p>
            </div>
            <div className="bg-gradient-to-br from-[#6366F1]/20 to-[#8b5cf6]/10 rounded-xl p-4 border border-[#6366F1]/30">
              <p className="text-[#a5b4fc] text-xs mb-1">{t('Conversion', '轉化率')}</p>
              <p className="text-white text-2xl">{data?.conversionRate ?? 0}%</p>
            </div>
          </div>
        </div>

        {/* Performance vs Cohort */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
          <h3 className="text-white mb-4">{t('vs. Your Cohort', '與同屆比較')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{t('Application Success', '申請成功率')}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#34D399]" />
                <span className="text-[#34D399] text-sm">+8%</span>
              </div>
            </div>
            <div className="w-full bg-[#334155] rounded-full h-2">
              <div className="bg-gradient-to-r from-[#34D399] to-[#10b981] h-2 rounded-full w-[65%]"></div>
            </div>
            <p className="text-slate-400 text-xs">
              {t(
                "You've applied to 14 roles. 3 led to interviews. That's slightly above your cohort.",
                '你已申請 14 個職位，3 個得到面試，比同屆平均略高。'
              )}
            </p>
          </div>
        </div>

        {/* Match Score Trend */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
          <h3 className="text-white mb-4">{t('Match Score Trend', '配對度趨勢')}</h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {data?.matchScoreTrend ?? [60, 63, 67, 70, 74, 78].map((score, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-[#6366F1] to-[#8b5cf6] rounded-t"
                  style={{ height: `${(score / 100) * 160}px` }}
                ></div>
                <span className="text-slate-400 text-xs">{score}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <span className="text-slate-300 text-sm">
              {t('Improving over time', '持續改善中')}
            </span>
          </div>
        </div>

        {/* Funnel by Role Type */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
          <h3 className="text-white mb-4">{t('Performance by Role Type', '按職位類別表現')}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">{t('Data Analyst', '數據分析師')}</span>
                <span className="text-slate-400 text-sm">8 {t('applications', '申請')}</span>
              </div>
              <div className="w-full bg-[#334155] rounded-full h-2">
                <div className="bg-[#6366F1] h-2 rounded-full w-[80%]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">{t('Business Analyst', '業務分析師')}</span>
                <span className="text-slate-400 text-sm">4 {t('applications', '申請')}</span>
              </div>
              <div className="w-full bg-[#334155] rounded-full h-2">
                <div className="bg-[#FBBF24] h-2 rounded-full w-[40%]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">{t('Cybersecurity', '網絡安全')}</span>
                <span className="text-slate-400 text-sm">2 {t('applications', '申請')}</span>
              </div>
              <div className="w-full bg-[#334155] rounded-full h-2">
                <div className="bg-[#F43F5E] h-2 rounded-full w-[20%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
