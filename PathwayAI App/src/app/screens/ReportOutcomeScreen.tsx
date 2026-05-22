import { ArrowLeft, CheckCircle2, PartyPopper, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { applications as appsApi, outcomes, type ApplicationDetail } from '../lib/api';

const TIMELINE_STEPS = [
  { key: 'applied',     label: 'Applied',             labelZh: '已申請' },
  { key: 'shortlisted', label: 'Shortlisted',          labelZh: '入圍' },
  { key: 'interview',   label: 'Interview Scheduled',  labelZh: '安排面試' },
  { key: 'offered',     label: 'Offer Received',       labelZh: '收到邀請' },
  { key: 'accepted',    label: 'Offer Accepted',        labelZh: '已接受' },
];

export default function ReportOutcomeScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    appsApi.get(id).then(setApp).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    if (!app || !id) return;
    setSubmitting(true);
    setError(null);
    try {
      await outcomes.report({
        applicationId: id,
        company: app.job?.company ?? '',
        role: app.job?.title ?? '',
        sector: app.job?.sector,
        salaryBand: app.job?.salaryMin != null
          ? `${app.job.salaryMin}-${app.job.salaryMax}`
          : undefined,
        geography: app.job?.district,
      });
      setShowSheet(true);
    } catch {
      setError(t('Failed to submit. Please try again.', '提交失敗，請重試。'));
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-white text-xl font-bold">{t('Accept Offer', '接受邀請')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('Report your placement outcome', '上報就業結果')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {loading && (
          <div className="text-slate-400 text-center py-16">{t('Loading...', '載入中...')}</div>
        )}

        {!loading && app && (
          <>
            {/* Company header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900/60 rounded-xl flex items-center justify-center text-3xl border border-slate-700/50 font-bold text-white flex-shrink-0">
                  {(app.job?.company ?? '?')[0]}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{app.job?.title ?? '—'}</h2>
                  <p className="text-slate-300 text-sm mt-0.5">{app.job?.company ?? '—'}</p>
                </div>
              </div>
            </motion.div>

            {/* Journey timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
            >
              <h3 className="text-white font-semibold text-sm mb-4">{t('Your Journey', '你的求職歷程')}</h3>
              <div className="flex items-start gap-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 bg-purple-600 border-purple-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[9px] mt-1.5 text-center leading-tight text-purple-300 px-0.5">
                          {t(step.label, step.labelZh)}
                        </span>
                      </div>
                      {!isLast && (
                        <div className="h-0.5 flex-1 mx-0.5 rounded bg-purple-600 mb-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Confirm */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
            >
              <p className="text-slate-300 text-sm mb-4">
                {t(
                  'By confirming, your placement outcome will be shared with your institution to support graduate employment tracking. Your details remain anonymised in institutional reports.',
                  '確認後，你的就業結果將以匿名方式提交至大學，用於畢業生就業數據追蹤。',
                )}
              </p>
              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <PartyPopper className="w-4 h-4" />
                {submitting
                  ? t('Submitting…', '提交中…')
                  : t('Confirm & Accept Offer', '確認並接受邀請')}
              </button>
            </motion.div>
          </>
        )}

        <div className="h-4" />
      </div>

      {/* Success Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
          <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop — intentionally no onClick so tapping it does nothing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full bg-slate-800 rounded-t-3xl border-t border-slate-700/60 px-6 pt-6 pb-10 space-y-5"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-2" />

              {/* Success indicator */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-white text-2xl font-bold">
                  {t('Accepted Successfully', '已成功接受')}
                </h2>
                <p className="text-slate-400 text-sm text-center leading-relaxed">
                  {t(
                    'Your offer acceptance has been recorded and your placement outcome reported to your institution.',
                    '你已成功接受邀請，就業結果已同步至大學。',
                  )}
                </p>
              </div>

              {/* Primary button */}
              <button
                onClick={() => navigate(`/applications/${id}`, { replace: true })}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t('Back to Application Detail', '返回申請詳情')}
              </button>

              {/* Secondary button */}
              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full bg-slate-700 text-slate-200 py-3.5 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t('Back to Home', '返回主頁')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
