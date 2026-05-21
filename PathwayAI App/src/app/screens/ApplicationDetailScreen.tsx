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
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { applications as appsApi, outcomes, type ApplicationDetail } from '../lib/api';

export default function ApplicationDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!id) return;
    appsApi
      .get(id)
      .then(setApp)
      .catch(() => setError(t('Application not found', '找不到申請記錄')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAcceptOffer = async () => {
    if (!app || !id) return;
    setAccepting(true);
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
      setAccepted(true);
    } catch {
      // non-critical — outcome sync failure shouldn't block the user
    } finally {
      setAccepting(false);
    }
  };

  const getStatusConfig = (status: ApplicationDetail['status']) => {
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
          const config = getStatusConfig(app.status);
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

              {/* Accept Offer */}
              {app.status === 'OFFERED' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 }}
                  className="bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-5"
                >
                  {accepted ? (
                    <div className="flex items-center gap-3 text-purple-300">
                      <PartyPopper className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        {t('Offer accepted — outcome reported to your institution.', '已接受邀請，結果已同步至大學。')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-300 text-sm mb-3">
                        {t('Accepting this offer will report your placement outcome to your institution so they can track graduate employment.', '接受此邀請後，你的就業結果將同步至大學，用於畢業生就業追蹤。')}
                      </p>
                      <button
                        onClick={handleAcceptOffer}
                        disabled={accepting}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <PartyPopper className="w-4 h-4" />
                        {accepting
                          ? t('Reporting…', '同步中…')
                          : t('Accept Offer & Report Outcome', '接受邀請並上報結果')}
                      </button>
                    </>
                  )}
                </motion.div>
              )}

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
                  value={app.stage}
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

              <div className="h-4" />
            </>
          );
        })()}
      </div>
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
