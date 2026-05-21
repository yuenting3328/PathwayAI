import { Home, Briefcase, MessageCircle, User, Bell, Search, Filter, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import SettingsMenu from './SettingsMenu';
import pathwayLogo from '../../imports/PathwayAI_logo.png';
import { notifications as notifApi } from '../lib/api';

interface LayoutProps {
  children: React.ReactNode;
  onFilterClick?: () => void;
}

export default function Layout({ children, onFilterClick }: LayoutProps) {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notifApi.list()
      .then(list => setUnreadCount(list.filter(n => !n.read).length))
      .catch(() => {});
  }, [location.pathname]);

  const displayName = user?.profile?.name ?? user?.email?.split('@')[0] ?? 'You';
  const initials = displayName.charAt(0).toUpperCase();

  const navItems = [
    { path: '/', icon: Home, label: t('Home', '主頁') },
    { path: '/jobs', icon: Briefcase, label: t('Jobs', '職位') },
    { path: '/coach', icon: MessageCircle, label: t('Coach', '教練') },
    { path: '/profile', icon: User, label: t('Profile', '個人') },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHomePage = location.pathname === '/';
  // Jobs main list only — detail pages (/jobs/:id) get their own sub-app bar
  const isJobsPage = location.pathname === '/jobs';
  const isCoachPage = location.pathname.startsWith('/coach');
  // Profile header only for the root /profile page — step sub-pages use their own sub-app bar
  const isProfilePage = location.pathname === '/profile';
  const isSubAppBarPage =
    location.pathname.startsWith('/applications') ||
    location.pathname.startsWith('/interviews') ||
    location.pathname.startsWith('/skills') ||
    location.pathname.startsWith('/cv-editor') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/credentials') ||
    location.pathname.startsWith('/outcomes') ||
    location.pathname.startsWith('/market-radar') ||
    location.pathname.startsWith('/programmes') ||
    location.pathname.startsWith('/notifications') ||
    location.pathname.startsWith('/alumni-paths') ||
    // Profile completion step pages
    (location.pathname.startsWith('/profile/')) ||
    // Job detail pages (any /jobs/... path that isn't exactly /jobs)
    (location.pathname.startsWith('/jobs/') && location.pathname !== '/jobs');

  // Only show bottom nav on the 4 main pages
  const showBottomNav = isHomePage || isJobsPage || isCoachPage || isProfilePage;

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return { en: 'Good morning', zh: '早晨' };
    if (currentHour < 18) return { en: 'Good afternoon', zh: '下午好' };
    return { en: 'Good evening', zh: '晚上好' };
  };
  const greeting = getGreeting();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
      {/* Conditional Top Bar */}
      {!isProfilePage && !isSubAppBarPage && (
        <div className="sticky top-0 z-10 flex-shrink-0 px-6 pt-12 pb-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          {/* Home Page Top Bar */}
          {isHomePage && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{t(greeting.en, greeting.zh)}</p>
                <h2 className="text-white text-2xl font-bold mt-1 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  {t(`Welcome back, ${displayName}`, `歡迎回來，${displayName}`)}
                </h2>
              </div>
              <Link to="/notifications">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Bell className="w-6 h-6 text-slate-400 hover:text-slate-300 transition-colors" />
                  {unreadCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"
                    />
                  )}
                </motion.button>
              </Link>
            </div>
          )}

          {/* Jobs Page Top Bar */}
          {isJobsPage && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-700/50 shadow-lg">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('Search roles, companies...', '搜尋職位、公司...')}
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Dispatch custom event to open filters
                    window.dispatchEvent(new Event('openJobFilters'));
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-indigo-500/30 shadow-lg"
                >
                  <Filter className="w-5 h-5 text-indigo-400" />
                </motion.button>
              </div>
              <Link to="/notifications">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Bell className="w-6 h-6 text-slate-400 hover:text-slate-300 transition-colors" />
                  {unreadCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"
                    />
                  )}
                </motion.button>
              </Link>
            </div>
          )}

          {/* Coach Page Top Bar */}
          {isCoachPage && (
            <div className="flex items-center justify-between">
              {/* Left: logo + title */}
              <div className="flex items-center gap-2.5">
                <img
                  src={pathwayLogo}
                  alt="PathwayAI"
                  className="h-9 w-9 object-contain"
                />
                <span className="text-white text-lg font-bold tracking-tight">
                  PathwayAI Assistant
                </span>
              </div>
              {/* Right: bell */}
              <Link to="/notifications">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Bell className="w-6 h-6 text-slate-400 hover:text-slate-300 transition-colors" />
                  {unreadCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"
                    />
                  )}
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Profile Page - User name and Settings Icon */}
      {isProfilePage && (
        <div className="flex-shrink-0 px-6 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-indigo-500/30"
                >
                  {initials}
                </motion.button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-xl font-bold">{displayName}</h2>
                  <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-[10px] font-bold text-slate-900 shadow-lg">
                    Premium
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{t('Computer Science', '電腦科學')}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(true)}
              className="w-11 h-11 bg-slate-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-indigo-500/50 transition-all shadow-lg"
            >
              <Settings className="w-5 h-5 text-slate-400" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Enhanced Bottom Navigation with iPhone safe area */}
      {showBottomNav && (
        <div className="flex-shrink-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90 backdrop-blur-xl border-t border-slate-800/50 px-4 pt-3 pb-6 shadow-2xl">
          <div className="flex items-center justify-around relative">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-1.5 w-full transition-all duration-300 relative ${
                      active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className={`relative ${active ? 'drop-shadow-lg' : ''}`}>
                      <Icon className={`w-6 h-6 ${active ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`} />
                    </div>
                    <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Menu */}
      <SettingsMenu isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
