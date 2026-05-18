import { ArrowLeft, Video, MapPin, Calendar, Clock, User, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function InterviewsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const interviews = [
    {
      id: '1',
      company: 'HSBC',
      position: 'Data Analyst Graduate',
      date: '2026-05-20',
      time: '14:00',
      duration: '45 min',
      type: 'video',
      interviewer: 'Sarah Chen',
      interviewerRole: 'Senior HR Manager',
      location: 'Zoom',
      stage: 'Second Round - Technical',
      status: 'upcoming',
      prepStatus: 'in-progress',
    },
    {
      id: '2',
      company: 'Standard Chartered',
      position: 'Business Analyst',
      date: '2026-05-18',
      time: '10:30',
      duration: '60 min',
      type: 'in-person',
      interviewer: 'Michael Wong',
      interviewerRole: 'Department Head',
      location: 'Central Office, 18/F',
      stage: 'First Round - Behavioral',
      status: 'upcoming',
      prepStatus: 'ready',
    },
    {
      id: '3',
      company: 'Deloitte',
      position: 'Audit Associate',
      date: '2026-05-15',
      time: '15:00',
      duration: '30 min',
      type: 'video',
      interviewer: 'Jennifer Lau',
      interviewerRole: 'Recruitment Lead',
      location: 'Microsoft Teams',
      stage: 'HR Screening',
      status: 'completed',
      prepStatus: 'completed',
    },
    {
      id: '4',
      company: 'Google',
      position: 'Associate Product Manager',
      date: '2026-04-28',
      time: '11:00',
      duration: '45 min',
      type: 'video',
      interviewer: 'David Kim',
      interviewerRole: 'Product Manager',
      location: 'Google Meet',
      stage: 'Technical Round',
      status: 'cancelled',
      prepStatus: 'not-started',
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
          icon: Calendar,
          iconColor: 'text-indigo-400',
          label: t('Upcoming', '即將進行'),
        };
      case 'completed':
        return {
          color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          label: t('Completed', '已完成'),
        };
      case 'cancelled':
        return {
          color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
          icon: AlertCircle,
          iconColor: 'text-slate-400',
          label: t('Cancelled', '已取消'),
        };
      default:
        return {
          color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
          icon: Clock,
          iconColor: 'text-slate-400',
          label: t('Scheduled', '已安排'),
        };
    }
  };

  const getPrepStatusConfig = (prepStatus: string) => {
    switch (prepStatus) {
      case 'ready':
        return {
          color: 'bg-emerald-500/20 text-emerald-300',
          label: t('Ready', '已準備'),
        };
      case 'in-progress':
        return {
          color: 'bg-amber-500/20 text-amber-300',
          label: t('In Progress', '準備中'),
        };
      case 'not-started':
        return {
          color: 'bg-rose-500/20 text-rose-300',
          label: t('Not Started', '未開始'),
        };
      case 'completed':
        return {
          color: 'bg-slate-500/20 text-slate-300',
          label: t('Done', '完成'),
        };
      default:
        return {
          color: 'bg-slate-500/20 text-slate-300',
          label: t('Pending', '待定'),
        };
    }
  };

  const stats = {
    total: interviews.length,
    upcoming: interviews.filter(i => i.status === 'upcoming').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
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
          <h1 className="text-white text-xl font-bold">{t('My Interviews', '我的面試')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{interviews.length} {t('total interviews', '個面試')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30 shadow-lg"
          >
            <Calendar className="w-5 h-5 text-indigo-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-slate-400">{t('Total', '總數')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30 shadow-lg"
          >
            <Clock className="w-5 h-5 text-indigo-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.upcoming}</p>
            <p className="text-xs text-slate-400">{t('Upcoming', '即將')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30 shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs text-slate-400">{t('Done', '完成')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-slate-500/20 to-slate-600/10 backdrop-blur-sm rounded-xl p-4 border border-slate-500/30 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-slate-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
            <p className="text-xs text-slate-400">{t('Cancelled', '取消')}</p>
          </motion.div>
        </div>

        {/* AI Interview Prep CTA */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/30 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{t('AI Interview Coach', 'AI 面試教練')}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{t('Prepare with personalized mock interviews', '個人化模擬面試準備')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/interview/setup')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          >
            {t('Start Practice Session', '開始練習')}
          </button>
        </motion.div>

        {/* Interviews List */}
        <div className="space-y-4">
          {interviews.map((interview, idx) => {
            const config = getStatusConfig(interview.status);
            const prepConfig = getPrepStatusConfig(interview.prepStatus);
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`bg-gradient-to-r ${config.color} backdrop-blur-sm rounded-2xl p-5 border shadow-lg cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-slate-700/50 shadow-lg flex-shrink-0">
                    {interview.company[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{interview.position}</h3>
                        <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-2">
                          {interview.company}
                        </p>
                      </div>
                      <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(interview.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.time} ({interview.duration})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          {interview.type === 'video' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {interview.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <User className="w-4 h-4" />
                        <span>{interview.interviewer} • {interview.interviewerRole}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          interview.status === 'upcoming' ? 'bg-indigo-500/20 text-indigo-300' :
                          interview.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {interview.stage}
                        </span>
                        {interview.status === 'upcoming' && (
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${prepConfig.color}`}>
                            <FileText className="w-3 h-3 inline mr-1" />
                            {prepConfig.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
