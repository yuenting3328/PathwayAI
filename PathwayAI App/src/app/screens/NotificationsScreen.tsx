import { ArrowLeft, Bell, Briefcase, Award, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { notifications as notifApi, type Notification, BASE_URL, getToken } from '../lib/api';

function iconForType(type: string) {
  switch (type) {
    case 'STAGE_CHANGE': return Calendar;
    case 'CREDENTIAL_ISSUED': return Award;
    case 'JOB_MATCH': return TrendingUp;
    default: return Briefcase;
  }
}

function colorForType(type: string) {
  switch (type) {
    case 'STAGE_CHANGE':
      return { card: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30', icon: 'text-indigo-400', iconBg: 'bg-indigo-500/20' };
    case 'CREDENTIAL_ISSUED':
      return { card: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/20' };
    default:
      return { card: 'from-slate-500/20 to-slate-600/10 border-slate-500/30', icon: 'text-slate-400', iconBg: 'bg-slate-500/20' };
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    notifApi.list().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to SSE for real-time push notifications
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const sseUrl = `${BASE_URL}/events/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(sseUrl);

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'STAGE_CHANGE') {
          // Refresh the full list to get the persisted notification with its id/applicationId
          notifApi.list().then(setList).catch(console.error);
        }
      } catch {}
    };

    return () => es.close();
  }, []);

  const unreadCount = list.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    await notifApi.markAllRead().catch(console.error);
    setList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleTap = (n: Notification) => {
    if (n.applicationId) {
      navigate(`/applications/${n.applicationId}`, { state: { from: 'notification' } });
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
          <h1 className="text-white text-xl font-bold">{t('Notifications', '通知')}</h1>
          {unreadCount > 0 && (
            <p className="text-slate-400 text-xs mt-0.5">
              {unreadCount} {t('unread', '未讀')}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
          >
            {t('Mark all read', '全部標記為已讀')}
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-3">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && list.map((n, idx) => {
          const Icon = iconForType(n.type);
          const c = colorForType(n.type);
          const tappable = !!n.applicationId;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              onClick={() => handleTap(n)}
              className={`bg-gradient-to-r ${c.card} backdrop-blur-sm rounded-2xl p-5 border shadow-lg ${tappable ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'} ${!n.read ? 'ring-1 ring-indigo-500/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${c.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${c.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5 ml-2" />
                    )}
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{n.message}</p>
                  <p className="text-slate-500 text-xs">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {!loading && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-800/60 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-center">
              {t('No notifications yet', '暫無通知')}
            </p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
