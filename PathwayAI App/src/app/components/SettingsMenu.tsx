import { Eye, Globe, Shield, Bell, Info, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { t, language, setLanguage } = useLanguage();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: Eye,
      label: t('Let employers find you', '允許僱主主動發現你'),
      type: 'toggle' as const,
    },
    {
      icon: Globe,
      label: t('Language settings', '語言設定'),
      type: 'language' as const,
    },
    {
      icon: Shield,
      label: t('Privacy Policy and Conditions', '私隱政策及條款'),
      type: 'link' as const,
    },
    {
      icon: Bell,
      label: t('Notifications', '通知'),
      type: 'link' as const,
    },
    {
      icon: Info,
      label: t('About Us', '關於我們'),
      type: 'link' as const,
    },
    {
      icon: LogOut,
      label: t('Sign Out', '登出'),
      type: 'action' as const,
      danger: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-l border-slate-800/50 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white text-xl font-semibold">{t('Settings', '設定')}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </motion.button>
            </div>

            {/* Menu Items */}
            <div className="px-6 py-6 space-y-2">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {item.type === 'toggle' && (
                      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-slate-400" />
                            <span className="text-white text-sm">{item.label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    {item.type === 'language' && (
                      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <span className="text-white text-sm">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLanguage('en')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              language === 'en'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => setLanguage('zh')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              language === 'zh'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            繁體中文
                          </button>
                        </div>
                      </div>
                    )}

                    {item.type === 'link' && (
                      <motion.button
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all flex items-center gap-3"
                      >
                        <Icon className="w-5 h-5 text-slate-400" />
                        <span className="text-white text-sm">{item.label}</span>
                      </motion.button>
                    )}

                    {item.type === 'action' && item.danger && (
                      <motion.button
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { logout(); onClose(); }}
                        className="w-full bg-rose-500/10 backdrop-blur-sm rounded-xl p-4 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center gap-3"
                      >
                        <Icon className="w-5 h-5 text-rose-400" />
                        <span className="text-rose-400 text-sm font-medium">{item.label}</span>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
