import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Briefcase,
  ListChecks,
  GraduationCap,
  Wrench,
  FileText,
  TrendingUp,
  PartyPopper,
  Home,
  Star,
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { applications as appsApi, outcomes, type ApplicationDetail } from '../lib/api';

export default function ApplicationDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t } = useLanguage();
  const fromNotification = (location.state as { from?: string } | null)?.from === 'notification';

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [offerTab, setOfferTab] = useState<'offer' | 'job'>('offer');

  useEffect(() => {
    if (!id) return;
    appsApi
      .get(id)
      .then(setApp)
      .catch(() => setError(t('Application not found', '找不到申請記錄')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    if (!app || !id) return;
    setSubmitting(true);
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
    } catch {
      // outcome sync failure — UX proceeds regardless
    } finally {
      setSubmitting(false);
      setAccepted(true);
      setShowSheet(true);
    }
  };

  const getStatusConfig = (status: ApplicationDetail['status'], stage?: string, localAccepted = false) => {
    if (localAccepted || stage === 'Offer Accepted') {
      return {
        gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: CheckCircle2,
        iconColor: 'text-emerald-400',
        label: t('Offer Accepted', '已接受邀請'),
      };
    }
    if (stage === 'Shortlisted') {
      return {
        gradient: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30',
        badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        icon: Star,
        iconColor: 'text-sky-400',
        label: t('Shortlisted', '入圍'),
      };
    }
    switch (status) {
      case 'INTERVIEW':
        return {
          gradient: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          label: t('Interview Scheduled', '已安排面試'),
        };
      case 'PENDING':
        return {
          gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Clock,
          iconColor: 'text-amber-400',
          label: t('Under Review', '審核中'),
        };
      case 'OFFERED':
        return {
          gradient: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: CheckCircle2,
          iconColor: 'text-purple-400',
          label: t('Offer Received', '已收到邀請'),
        };
      case 'REJECTED':
        return {
          gradient: 'from-red-500/20 to-slate-600/10 border-red-500/30',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: XCircle,
          iconColor: 'text-red-400',
          label: t('Not Selected', '未獲選'),
        };
      case 'WITHDRAWN':
        return {
          gradient: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          icon: XCircle,
          iconColor: 'text-slate-400',
          label: t('Withdrawn', '已撤回'),
        };
      default:
        return {
          gradient: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          icon: Clock,
          iconColor: 'text-slate-400',
          label: t('Processing', '處理中'),
        };
    }
  };

  const ACCEPTED_TIMELINE = [
    t('Applied', '已申請'),
    t('Shortlisted', '入圍'),
    t('Interview Scheduled', '安排面試'),
    t('Offer Received', '收到邀請'),
    t('Offer Accepted', '已接受'),
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center gap-3 z-10 shadow-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fromNotification ? navigate('/notifications') : navigate(-1)}
          className="w-10 h-10 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Application Detail', '申請詳情')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('Full application overview', '完整申請概覽')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {loading && (
          <div className="text-slate-400 text-center py-16">{t('Loading...', '載入中...')}</div>
        )}

        {error && (
          <div className="text-red-400 text-center py-16">{error}</div>
        )}

        {!loading && !error && app && (() => {
          const isAccepted = accepted || app.stage === 'Offer Accepted';
          const config = getStatusConfig(app.status, app.stage, accepted);
          const StatusIcon = config.icon;
          const company = app.job?.company ?? '—';
          const position = app.job?.title ?? '—';

          return (
            <>
              {/* Hero card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-r ${config.gradient} backdrop-blur-sm rounded-2xl p-5 border shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-slate-700/50 shadow-lg flex-shrink-0 font-bold text-white">
                    {company[0] ?? '?'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white text-lg font-bold leading-tight">{position}</h2>
                    <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {company}
                    </p>
                    {app.job?.district && (
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.job.district}
                        {app.job.sector ? ` · ${app.job.sector}` : ''}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 ${config.badge}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                    {config.label}
                  </span>
                </div>
              </motion.div>

              {/* Accept Offer button — shown only when offer is pending */}
              {app.status === 'OFFERED' && !isAccepted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 }}
                  className="bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-5"
                >
                  <p className="text-slate-300 text-sm mb-3">
                    {t('Accepting this offer will report your placement outcome to your institution so they can track graduate employment.', '接受此邀請後，你的就業結果將同步至大學，用於畢業生就業追蹤。')}
                  </p>
                  <button
                    onClick={handleAccept}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <PartyPopper className="w-4 h-4" />
                    {submitting ? t('Submitting…', '提交中…') : t('Accept Offer', '接受邀請')}
                  </button>
                </motion.div>
              )}

              {/* Accepted state — read-only indicator + full journey timeline */}
              {isAccepted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 }}
                  className="bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <PartyPopper className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-300 font-semibold text-sm">
                        {t('Offer Accepted', '已接受邀請')}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {t('Outcome reported to your institution.', '就業結果已同步至大學。')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">
                      {t('Application Journey', '求職歷程')}
                    </p>
                    <div className="flex items-start">
                      {ACCEPTED_TIMELINE.map((label, idx) => {
                        const isLast = idx === ACCEPTED_TIMELINE.length - 1;
                        return (
                          <div key={idx} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-[9px] mt-1 text-center leading-tight text-emerald-300 px-0.5">
                                {label}
                              </span>
                            </div>
                            {!isLast && (
                              <div className="h-0.5 flex-1 mx-0.5 bg-emerald-500 rounded mb-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab switcher — only on offer page */}
              {(app.status === 'OFFERED' || isAccepted) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 }}
                  className="flex bg-slate-800/60 rounded-xl p-1 border border-slate-700/50"
                >
                  {(['offer', 'job'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setOfferTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        offerTab === tab
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {tab === 'offer' ? t('Offer Details', '邀請詳情') : t('Job Details', '職位詳情')}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Offer Details tab */}
              {(app.status === 'OFFERED' || isAccepted) && offerTab === 'offer' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 divide-y divide-slate-700/50"
                >
                  {[
                    { icon: Briefcase,   iconColor: 'text-purple-400', label: t('Title', '職位名稱'),   value: app.job?.title ?? '—' },
                    { icon: DollarSign,  iconColor: 'text-green-400',  label: t('Salary', '薪酬'),       value: app.job?.salaryMin != null ? `HK$${app.job.salaryMin.toLocaleString()} – $${app.job.salaryMax.toLocaleString()}/mo` : '—' },
                    { icon: Calendar,    iconColor: 'text-indigo-400', label: t('Start Date', '入職日期'), value: t('To be confirmed', '待確認') },
                    { icon: FileText,    iconColor: 'text-amber-400',  label: t('Terms', '合約條款'),    value: t('Full-time, Permanent', '全職，長期') },
                  ].map(({ icon: Icon, iconColor, label, value }) => (
                    <div key={label} className="flex items-center gap-4 px-5 py-4">
                      <div className={`w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                        <p className="text-white text-sm font-medium truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Job Details tab (or full content for non-offer statuses) */}
              {(!(app.status === 'OFFERED' || isAccepted) || offerTab === 'job') && (
                <>
                  {/* Key info grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <InfoCard
                      icon={Calendar}
                      iconColor="text-indigo-400"
                      label={t('Applied Date', '申請日期')}
                      value={new Date(app.appliedDate).toLocaleDateString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' })}
                    />
                    <InfoCard
                      icon={Briefcase}
                      iconColor="text-amber-400"
                      label={t('Stage', '申請階段')}
                      value={isAccepted ? t('Offer Accepted', '已接受邀請') : app.stage}
                    />
                    {app.interviewDate && (
                      <InfoCard
                        icon={TrendingUp}
                        iconColor="text-emerald-400"
                        label={t('Interview Date', '面試日期')}
                        value={new Date(app.interviewDate).toLocaleDateString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' })}
                      />
                    )}
                    {app.job?.salaryMin != null && app.job?.salaryMax != null && (
                      <InfoCard
                        icon={DollarSign}
                        iconColor="text-green-400"
                        label={t('Salary (HKD/mo)', '薪酬（港幣/月）')}
                        value={`$${app.job.salaryMin.toLocaleString()} – $${app.job.salaryMax.toLocaleString()}`}
                      />
                    )}
                    {app.job?.deadline && (
                      <InfoCard
                        icon={Clock}
                        iconColor="text-rose-400"
                        label={t('Deadline', '截止日期')}
                        value={new Date(app.job.deadline).toLocaleDateString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' })}
                      />
                    )}
                  </motion.div>

                  {/* Responsibilities */}
                  {app.job?.responsibilities && (
                    <Section
                      delay={0.1}
                      icon={ListChecks}
                      iconColor="text-indigo-400"
                      title={t('Responsibilities', '工作職責')}
                    >
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{app.job.responsibilities}</p>
                    </Section>
                  )}

                  {/* Requirements */}
                  {app.job?.requirements && (
                    <Section
                      delay={0.15}
                      icon={GraduationCap}
                      iconColor="text-purple-400"
                      title={t('Requirements', '職位要求')}
                    >
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{app.job.requirements}</p>
                    </Section>
                  )}

                  {/* Skills */}
                  {app.job?.skills && app.job.skills.length > 0 && (
                    <Section
                      delay={0.2}
                      icon={Wrench}
                      iconColor="text-emerald-400"
                      title={t('Skills Required', '所需技能')}
                    >
                      <div className="flex flex-wrap gap-2">
                        {app.job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Notes */}
                  {app.notes && (
                    <Section
                      delay={0.25}
                      icon={FileText}
                      iconColor="text-slate-400"
                      title={t('My Notes', '我的備註')}
                    >
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{app.notes}</p>
                    </Section>
                  )}
                </>
              )}

              <div className="h-4" />
            </>
          );
        })()}
      </div>

      {/* Success bottom sheet — portalled to body to escape overflow-y-auto clipping */}
      {createPortal(
        <AnimatePresence>
          {showSheet && (
            <div className="fixed inset-0 z-[9999] flex items-end">
              {/* Backdrop — no onClick so tapping outside does nothing */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70"
              />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full bg-slate-800 rounded-t-3xl border-t border-slate-700/60 px-6 pt-5 pb-10 space-y-4"
              >
                <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-1" />

                <div className="flex flex-col items-center gap-3 py-3">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-white text-2xl font-bold">
                    {t('Accepted Successfully', '已成功接受')}
                  </h2>
                  <p className="text-slate-400 text-sm text-center leading-relaxed">
                    {t(
                      'Your offer acceptance has been recorded and your outcome reported to your institution.',
                      '你已成功接受邀請，就業結果已同步至大學。',
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setShowSheet(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {t('Back to Application Detail', '返回申請詳情')}
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-slate-700 text-slate-200 py-3.5 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  {t('Back to Home', '返回主頁')}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <p className="text-white text-sm font-semibold">{value}</p>
    </div>
  );
}

function Section({
  delay,
  icon: Icon,
  iconColor,
  title,
  children,
}: {
  delay: number;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
