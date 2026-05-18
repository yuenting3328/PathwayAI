import {
  ArrowLeft, TrendingUp, Star, Sliders, Zap, Users, DollarSign,
  Target, Sparkles, ChevronDown, AlertCircle, Flame, Building2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { market, type MarketSignal } from '../lib/api';

// ─── Icon map ────────────────────────────────────────────────────────────────
type AccentVariant = 'rose' | 'emerald' | 'purple' | 'sky' | 'indigo' | 'amber';
type IconName = 'Zap' | 'TrendingUp' | 'Sparkles' | 'Star' | 'Target' | 'Flame' | 'Building2';

const iconMap: Record<IconName, React.ElementType> = {
  Zap, TrendingUp, Sparkles, Star, Target, Flame, Building2,
};

// ─── Derive display properties from API MarketSignal ─────────────────────────
function signalAccent(trend: string): AccentVariant {
  return ({ HOT: 'rose', UP: 'emerald', DOWN: 'sky', STABLE: 'indigo' } as Record<string, AccentVariant>)[trend] ?? 'indigo';
}
function signalIcon(trend: string): IconName {
  return ({ HOT: 'Flame', UP: 'TrendingUp', DOWN: 'Target', STABLE: 'Star' } as Record<string, IconName>)[trend] ?? 'Zap';
}
function signalBadge(trend: string): string {
  return { HOT: '🔥 Hot', UP: '📈 Growing', DOWN: '📉 Declining', STABLE: '📊 Stable' }[trend] ?? '📊 Stable';
}
function signalMetric(s: MarketSignal): string {
  if (s.salaryMin && s.salaryMax) return `HK$${Math.round(s.salaryMin / 1000)}K–${Math.round(s.salaryMax / 1000)}K`;
  if (s.salaryMin) return `From HK$${Math.round(s.salaryMin / 1000)}K`;
  return s.role ?? s.sector ?? s.district ?? '';
}

// ─── Accent helpers ───────────────────────────────────────────────────────────
function accentText(v: AccentVariant) {
  return { rose: 'text-rose-400', emerald: 'text-emerald-400', purple: 'text-purple-400', sky: 'text-sky-400', indigo: 'text-indigo-400', amber: 'text-amber-400' }[v];
}
function cardGradient(v: AccentVariant) {
  return {
    rose:    'from-rose-600/18 via-pink-600/8 to-slate-900/50 border-rose-500/25',
    emerald: 'from-emerald-600/18 via-green-600/8 to-slate-900/50 border-emerald-500/25',
    purple:  'from-purple-600/18 via-violet-600/8 to-slate-900/50 border-purple-500/25',
    sky:     'from-sky-600/18 via-blue-600/8 to-slate-900/50 border-sky-500/25',
    indigo:  'from-indigo-600/18 via-blue-600/8 to-slate-900/50 border-indigo-500/25',
    amber:   'from-amber-600/18 via-orange-600/8 to-slate-900/50 border-amber-500/25',
  }[v];
}
function badgeClasses(trend: string) {
  return {
    HOT:    'bg-rose-500/25 text-rose-300 border border-rose-500/30',
    UP:     'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30',
    DOWN:   'bg-sky-500/25 text-sky-300 border border-sky-500/30',
    STABLE: 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30',
  }[trend] ?? 'bg-slate-500/25 text-slate-300 border border-slate-500/30';
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MarketRadarScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navState = location.state as {
    sector?: string;
    role?: string;
    scrollToScenario?: boolean;
  } | null;

  const [signalTab, setSignalTab] = useState<'sector' | 'role' | 'district'>('district');
  const [selectedRole, setSelectedRole] = useState(navState?.role || 'Data Analyst');
  const [selectedSector, setSelectedSector] = useState(navState?.sector || 'Financial Services');
  const [selectedDistrict, setSelectedDistrict] = useState('Central & Western');
  const [minSalary, setMinSalary] = useState(30);
  const [showScenarioSheet, setShowScenarioSheet] = useState(false);
  const [signals, setSignals] = useState<MarketSignal[]>([]);

  useEffect(() => {
    market.signals().then(setSignals).catch(console.error);
  }, []);

  const roleOptions = [...new Set(signals.map(s => s.role).filter(Boolean))] as string[];
  const sectorOptions = [...new Set(signals.map(s => s.sector).filter(Boolean))] as string[];
  const districtOptions = [...new Set(signals.map(s => s.district).filter(Boolean))] as string[];

  const calculateScenario = () => {
    const baseOpenings = 142;
    const baseDifficulty = 68;
    const baseSalary = minSalary * 1000;
    const programmeShare = 12.5;
    const roleMultiplier = selectedRole === 'Cybersecurity Analyst' ? 1.2 : 1.0;
    const openings = Math.floor(baseOpenings * roleMultiplier);
    const difficulty = Math.max(30, baseDifficulty);
    const salaryMin = baseSalary;
    const salaryMax = baseSalary + 15000;
    const demandLevel = openings > 160 ? 'High' : openings < 120 ? 'Low' : 'Medium';
    const difficultyLevel = difficulty > 70 ? 'Very Competitive' : difficulty < 50 ? 'Moderate' : 'Competitive';
    const shareLevel = programmeShare > 18 ? 'High' : programmeShare < 10 ? 'Low' : 'Moderate';
    return { openings, difficulty, salaryMin, salaryMax, programmeShare, demandLevel, difficultyLevel, shareLevel };
  };

  const scenario = calculateScenario();

  const getDemandColor = (level: string) => {
    if (level === 'High') return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (level === 'Low') return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
  };

  const getDifficultyColor = (level: string) => {
    if (level === 'Moderate') return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (level === 'Very Competitive') return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
    return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
  };

  const tabs: Array<{ id: 'sector' | 'role' | 'district'; label: string }> = [
    { id: 'district', label: t('By District', '按地區') },
    { id: 'role',     label: t('By Role', '按職位') },
    { id: 'sector',   label: t('By Sector', '按行業') },
  ];

  useEffect(() => {
    if (navState?.scrollToScenario) {
      setTimeout(() => {
        document.getElementById('scenario-builder')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [navState?.scrollToScenario]);

  const currentCards = signals.filter(s =>
    signalTab === 'district' ? !!s.district :
    signalTab === 'role'     ? !!s.role :
    !!s.sector
  );

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
          <h1 className="text-white text-xl font-bold">{t('HK Market Radar', '香港職場雷達')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {t('Based on recent postings and outcomes', '根據最新職位招聘及畢業生出路數據')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">

        {/* ── Top Market Signals ── */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {t('Top Market Signals', '重點市場訊號')}
          </h3>

          {/* Tab group */}
          <div className="flex bg-slate-800/60 rounded-xl p-1 border border-slate-700/40">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSignalTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  signalTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Horizontally scrollable cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
            {currentCards.length === 0 && (
              <p className="text-slate-400 text-sm py-4">{t('No signals available', '暫無市場訊號')}</p>
            )}
            {currentCards.map((signal) => {
              const accent = signalAccent(signal.trend);
              const Icon = iconMap[signalIcon(signal.trend)];
              return (
                <motion.button
                  key={signal.id}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/market-radar/signal/${signal.id}`)}
                  className={`flex-shrink-0 w-52 text-left bg-gradient-to-br ${cardGradient(accent)} backdrop-blur-sm rounded-2xl p-4 border shadow-lg transition-all hover:shadow-xl`}
                >
                  {/* Badge */}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${badgeClasses(signal.trend)}`}>
                    {signalBadge(signal.trend)}
                  </span>

                  {/* Icon + title */}
                  <div className="flex items-start gap-2 mb-2.5">
                    <div className="w-8 h-8 bg-slate-900/50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${accentText(accent)}`} />
                    </div>
                    <p className="text-white font-semibold text-xs leading-snug">{signal.title}</p>
                  </div>

                  {/* Metric */}
                  <p className={`font-bold text-sm mb-1 ${accentText(accent)}`}>{signalMetric(signal)}</p>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{signal.description}</p>

                  {/* Tap hint */}
                  <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-slate-500 text-xs">{t('Tap for details', '點擊查看詳情')}</span>
                    <span className="text-slate-500 text-xs">›</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Scenario Builder ── */}
        <div id="scenario-builder">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            {t('Test a Scenario', '模擬出路')}
          </h3>
          <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl space-y-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">{t('Target Role', '目標職位')}</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-indigo-500/50 transition-all"
              >
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">{t('Sector', '行業')}</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-indigo-500/50 transition-all"
              >
                {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">{t('District', '地區')}</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-3 border border-white/10 outline-none focus:border-indigo-500/50 transition-all"
              >
                {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">
                {t('Desired salary', '期望薪金')}: <span className="text-amber-400 font-semibold">HK${minSalary}K</span>
              </label>
              <input
                type="range" min="20" max="80" step="5" value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>HK$20K</span><span>HK$80K</span>
              </div>
            </div>
            <button
              onClick={() => setShowScenarioSheet(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {t('Set Outlook', '查看前景')}
            </button>
          </div>
        </div>

        {/* ── Quick Insights ── */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            {t('Quick Insights', '快速見解')}
          </h3>
          <div className="space-y-2">
            {[
              t('Fintech roles cluster in Central with higher pay and competition', '金融科技職位集中中環，薪金及競爭較高'),
              t('Cybersecurity shows strong demand with fewer CS grads', '網絡安全需求強勁，電腦科學畢業生較少'),
              t('Data roles in Kowloon East offer good balance of pay and opportunity', '九龍東數據職位薪金與機會平衡'),
            ].map((text, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <p className="text-slate-300 text-sm">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* ── Scenario Outlook Bottom Sheet ── */}
      <AnimatePresence>
        {showScenarioSheet && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScenarioSheet(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 flex flex-col"
              style={{ maxHeight: '80vh' }}
            >
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white text-lg font-semibold">{t('Scenario Outlook', '情境前景')}</h3>
                </div>
                <button onClick={() => setShowScenarioSheet(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="bg-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-700/50">
                  <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <p className="text-slate-300 text-sm">
                    <span className="text-white font-medium">{selectedRole}</span>
                    {' · '}{selectedSector}{' · '}{selectedDistrict}{' · '}HK${minSalary}K
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-4 border ${getDemandColor(scenario.demandLevel)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <p className="text-xs opacity-80">{t('Demand Level', '需求水平')}</p>
                    </div>
                    <p className="text-lg font-bold">{scenario.demandLevel}</p>
                    <p className="text-xs opacity-70 mt-1">{scenario.openings} {t('openings', '職位空缺')}</p>
                  </div>
                  <div className={`rounded-xl p-4 border ${getDifficultyColor(scenario.difficultyLevel)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      <p className="text-xs opacity-80">{t('Competition', '競爭程度')}</p>
                    </div>
                    <p className="text-sm font-bold">{scenario.difficultyLevel}</p>
                    <p className="text-xs opacity-70 mt-1">{scenario.difficulty}% {t('difficulty', '難度')}</p>
                  </div>
                  <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <p className="text-amber-400 text-xs">{t('Median Salary', '中位薪金')}</p>
                    </div>
                    <p className="text-white text-lg font-bold">
                      ${(scenario.salaryMin / 1000).toFixed(0)}K–${(scenario.salaryMax / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      <p className="text-purple-400 text-xs">{t('CS Grads', 'CS 畢業生')}</p>
                    </div>
                    <p className="text-white text-lg font-bold">{scenario.programmeShare.toFixed(1)}%</p>
                    <p className="text-purple-300 text-xs">{scenario.shareLevel}</p>
                  </div>
                </div>
                <div className="h-2" />
              </div>
              <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800/60 bg-slate-900 space-y-3">
                <button
                  onClick={() => {
                    setShowScenarioSheet(false);
                    localStorage.setItem('targetRole', selectedRole);
                    navigate('/skills');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
                >
                  {t('Set as Target Role', '設定為目標職位')}
                </button>
                <button
                  onClick={() => {
                    setShowScenarioSheet(false);
                    navigate('/jobs', { state: { sector: selectedSector, role: selectedRole, district: selectedDistrict, fromMarketRadar: true } });
                  }}
                  className="w-full bg-transparent border border-slate-700/50 text-slate-300 py-3.5 rounded-xl font-semibold hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
                >
                  {t('View Matching Roles', '查看匹配職位')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
