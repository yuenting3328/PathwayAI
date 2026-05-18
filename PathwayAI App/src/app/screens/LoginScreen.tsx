import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import pathwayLogo from '../../imports/PathwayAI_logo.png';

export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError(t('Invalid email or password', '電郵或密碼錯誤'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-10"
      >
        <img src={pathwayLogo} alt="PathwayAI" className="w-16 h-16 object-contain mb-4" />
        <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
          PathwayAI
        </h1>
        <p className="text-slate-400 text-sm mt-1">{t('Your career, guided by AI', 'AI 引導你的職業路')}</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full space-y-4"
      >
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">
            {t('Email', '電郵')}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="student@cuhk.edu.hk"
            required
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">
            {t('Password', '密碼')}
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        {error && (
          <p className="text-rose-400 text-xs text-center">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? t('Signing in…', '登入中…') : t('Sign In', '登入')}
        </motion.button>
      </motion.form>

      {/* Demo hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 w-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-4"
      >
        <p className="text-slate-400 text-xs text-center mb-2">{t('Demo credentials', '示範帳號')}</p>
        <p className="text-slate-300 text-xs text-center font-mono">student@cuhk.edu.hk</p>
        <p className="text-slate-300 text-xs text-center font-mono">student123</p>
      </motion.div>
    </div>
  );
}
