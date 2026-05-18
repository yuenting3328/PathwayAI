import { Brain, ChevronDown, Search, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

const TIME_HORIZONS = ['First job (within 6 months)', '1–2 years', '3–5 years', '5+ years'];
const SALARY_BANDS = ['< HK$10,000', 'HK$10,000–15,000', 'HK$15,000–20,000', 'HK$20,000–25,000', 'HK$25,000–30,000', 'HK$30,000+'];
const PERSONALITY_TRAITS = [
  'Analytical and data-driven',
  'Prefers clear goals and structured environments',
  'Works well independently and in teams',
];

export default function PersonalityAndGoalsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [hasPersonality] = useState(true);
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [horizon, setHorizon] = useState('First job (within 6 months)');
  const [salary, setSalary] = useState('HK$15,000–20,000');
  const [showHorizonDD, setShowHorizonDD] = useState(false);
  const [showSalaryDD, setShowSalaryDD] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('Personality & career goals', '性格與職業目標')}</p>
          <p className="text-slate-500 text-xs">{t('Step 5 of 6', '第 5 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <p className="text-slate-400 text-sm leading-relaxed">
          {t('Use your personality and goals to guide your long-term path.', '運用你的性格和目標來引導你的長期路徑。')}
        </p>

        {/* Personality summary */}
        <div>
          <p className="text-white font-semibold text-sm mb-3">{t('Personality profile', '性格概況')}</p>
          {hasPersonality ? (
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {t('You tend to be analytical and structured.', '你傾向於分析型和有條理。')}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {PERSONALITY_TRAITS.map((trait, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1 flex-shrink-0" />
                        {t(trait, trait)}
                      </li>
                    ))}
                  </ul>
                  <p className="text-slate-500 text-xs mt-3">{t('Based on your PathwayAI personality check', '基於你的 PathwayAI 性格測試')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/40 border-dashed rounded-2xl p-5 text-center">
              <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">{t('No personality profile yet', '暫無性格概況')}</p>
              <p className="text-slate-600 text-xs mt-1">{t('Takes about 5 minutes', '約需 5 分鐘')}</p>
              <motion.button whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-medium">
                {t('Take quick personality check', '進行性格測試')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Career Goals */}
        <div>
          <p className="text-white font-semibold text-sm mb-3">{t('Career goals', '職業目標')}</p>

          {/* Target role */}
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Target role', '目標職位')}</label>
              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                  placeholder={t('e.g. Data Analyst, Product Manager…', '例如：數據分析師、產品經理…')}
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
              </div>
            </div>

            {/* Time horizon */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Time horizon', '時間規劃')}</label>
              <button onClick={() => setShowHorizonDD(v => !v)}
                className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
                <span className="text-white text-sm">{horizon}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <AnimatePresence>
                {showHorizonDD && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                    {TIME_HORIZONS.map(h => (
                      <button key={h} onClick={() => { setHorizon(h); setShowHorizonDD(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm ${h === horizon ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                        {h}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Salary expectation */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
                {t('Expected starting salary', '預期起薪')}
                <Info className="w-3.5 h-3.5 text-slate-600" />
              </label>
              <button onClick={() => setShowSalaryDD(v => !v)}
                className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
                <span className="text-white text-sm">{salary}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <AnimatePresence>
                {showSalaryDD && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                    {SALARY_BANDS.map(s => (
                      <button key={s} onClick={() => { setSalary(s); setShowSalaryDD(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm ${s === salary ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-slate-600 text-xs mt-1.5">
                {t('This helps us show relevant benchmarks. Not shared with employers.', '這有助我們提供相關基準。不會分享給僱主。')}
              </p>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile/cv-visibility')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Save & Continue', '儲存並繼續')}
        </motion.button>
      </div>
    </div>
  );
}
