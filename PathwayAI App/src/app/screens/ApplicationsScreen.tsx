import { ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, Building2, TrendingUp, Star, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { applications as appsApi, type Application, type AppStats } from '../lib/api';

export default function ApplicationsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [appList, setAppList] = useState<Application[]>([]);
  const [stats, setStats] = useState<AppStats>({ total: 0, pending: 0, shortlisted: 0, interviews: 0, offers: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([appsApi.list(), appsApi.stats()])
      .then(([list, s]) => {
        setAppList(list);
        setStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location.key]);

  const getStatusConfig = (status: Application['status'], stage?: string) => {
    if (stage === 'Offer Accepted') {
      return {
        color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
        icon: CheckCircle2,
        iconColor: 'text-emerald-400',
        label: t('Offer Accepted', '已接受邀請'),
      };
    }
    // Shortlisted is tracked via stage (status stays PENDING)
    if (stage === 'Shortlisted') {
      return {
        color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30',
        icon: Star,
        iconColor: 'text-sky-400',
        label: t('Shortlisted', '入圍'),
      };
    }
    switch (status) {
      case 'INTERVIEW':
        return {
          color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          label: t('Interview Scheduled', '已安排面試'),
        };
      case 'PENDING':
        return {
          color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
          icon: Clock,
          iconColor: 'text-amber-400',
          label: t('Under Review', '審核中'),
        };
      case 'OFFERED':
        return {
          color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
          icon: CheckCircle2,
          iconColor: 'text-purple-400',
          label: t('Offer Received', '已收到邀請'),
        };
      case 'REJECTED':
      case 'WITHDRAWN':
        return {
          color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
          icon: XCircle,
          iconColor: 'text-slate-400',
          label: status === 'WITHDRAWN' ? t('Withdrawn', '已撤回') : t('Not Selected', '未獲選'),
        };
      default:
        return {
          color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
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
          <h1 className="text-white text-xl font-bold">{t('My Applications', '我的申請')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{stats.total} {t('total applications', '個申請')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-sky-500/20 to-cyan-500/10 backdrop-blur-sm rounded-xl p-4 border border-sky-500/30 shadow-lg"
          >
            <Star className="w-5 h-5 text-sky-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
            <p className="text-xs text-slate-400">{t('Shortlisted', '入圍')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30 shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.interviews}</p>
            <p className="text-xs text-slate-400">{t('Interview', '面試')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-lg"
          >
            <Trophy className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.offers}</p>
            <p className="text-xs text-slate-400">{t('Offers', '邀請')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-slate-500/20 to-slate-600/10 backdrop-blur-sm rounded-xl p-4 border border-slate-500/30 shadow-lg"
          >
            <XCircle className="w-5 h-5 text-slate-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.rejected}</p>
            <p className="text-xs text-slate-400">{t('Rejected', '未選')}</p>
          </motion.div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-slate-400 text-center py-8">{t('Loading...', '載入中...')}</div>
          ) : appList.length === 0 ? (
            <div className="text-slate-400 text-center py-8">{t('No applications yet', '尚無申請')}</div>
          ) : (
            appList.map((app, idx) => {
              const config = getStatusConfig(app.status, app.stage);
              const StatusIcon = config.icon;
              const company = app.job?.company ?? '';
              const position = app.job?.title ?? '';

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className={`bg-gradient-to-r ${config.color} backdrop-blur-sm rounded-2xl p-5 border shadow-lg cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-slate-700/50 shadow-lg flex-shrink-0">
                      {company[0] ?? '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{position}</h3>
                          <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {company}
                          </p>
                        </div>
                        <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                        {app.interviewDate && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                            {t('Interview:', '面試：')} {new Date(app.interviewDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          app.stage === 'Offer Accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                          app.stage === 'Shortlisted'    ? 'bg-sky-500/20 text-sky-300' :
                          app.status === 'INTERVIEW'     ? 'bg-emerald-500/20 text-emerald-300' :
                          app.status === 'PENDING'       ? 'bg-amber-500/20 text-amber-300' :
                          app.status === 'OFFERED'       ? 'bg-purple-500/20 text-purple-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
