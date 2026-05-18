import { ArrowLeft, Bell, Briefcase, MessageCircle, Award, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const notifications = [
    {
      id: '1',
      type: 'interview',
      title: t('Interview Reminder', '面試提醒'),
      message: t('HSBC interview tomorrow at 2:00 PM', 'HSBC 明天下午 2:00 面試'),
      time: '2 hours ago',
      read: false,
      icon: Calendar,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/20',
    },
    {
      id: '2',
      type: 'application',
      title: t('Application Viewed', '申請已查看'),
      message: t('Standard Chartered viewed your application', 'Standard Chartered 已查看你的申請'),
      time: '5 hours ago',
      read: false,
      icon: Briefcase,
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
    },
    {
      id: '3',
      type: 'match',
      title: t('New Job Match', '新職位配對'),
      message: t('3 new roles match your profile - 92% fit', '3 個新職位與你的個人資料配對 - 92% 吻合'),
      time: '1 day ago',
      read: false,
      icon: TrendingUp,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
    },
    {
      id: '4',
      type: 'coach',
      title: t('Coach Message', '教練訊息'),
      message: t('Your coach shared interview prep tips', '你的教練分享了面試準備貼士'),
      time: '1 day ago',
      read: true,
      icon: MessageCircle,
      color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-500/20',
    },
    {
      id: '5',
      type: 'credential',
      title: t('Credential Verified', '證書已驗證'),
      message: t('Your degree certificate has been verified', '你的學位證書已驗證'),
      time: '2 days ago',
      read: true,
      icon: Award,
      color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-500/20',
    },
    {
      id: '6',
      type: 'application',
      title: t('Application Status Update', '申請狀態更新'),
      message: t('Deloitte moved you to the next round', 'Deloitte 將你晉升至下一輪'),
      time: '3 days ago',
      read: true,
      icon: CheckCircle,
      color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30',
      iconColor: 'text-slate-400',
      iconBg: 'bg-slate-500/20',
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <h1 className="text-white text-xl font-bold">{t('Notifications', '通知')}</h1>
          {unreadCount > 0 && (
            <p className="text-slate-400 text-xs mt-0.5">
              {unreadCount} {t('unread', '未讀')}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            {t('Mark all read', '全部標記為已讀')}
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-3">
        {notifications.map((notification, idx) => {
          const Icon = notification.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className={`bg-gradient-to-r ${notification.color} backdrop-blur-sm rounded-2xl p-5 border shadow-lg cursor-pointer ${
                !notification.read ? 'ring-1 ring-indigo-500/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${notification.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${notification.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{notification.message}</p>
                  <p className="text-slate-500 text-xs">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-800/60 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-center">
              {t('No notifications yet', '暫無通知')}
            </p>
          </div>
        )}

        <div className="h-4"></div>
      </div>
    </div>
  );
}
