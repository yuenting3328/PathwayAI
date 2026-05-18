import { ArrowLeft, ArrowRight, Users, Calendar, Target, MessageCircle, Sparkles, Clock, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { programmes, type AlumniPath, type AlumniEvent } from '../lib/api';

interface DisplayPath {
  id: string;
  name: string;
  label: string;
  sequence: string[];
  totalYears: string;
  description?: string;
  sector?: string;
  color: string;
  iconColor: string;
  iconBg: string;
}

const PATH_COLORS = [
  { color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/20' },
  { color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
  { color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20' },
  { color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30', iconColor: 'text-rose-400', iconBg: 'bg-rose-500/20' },
  { color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30', iconColor: 'text-sky-400', iconBg: 'bg-sky-500/20' },
];

function mapToDisplayPath(path: AlumniPath, idx: number): DisplayPath {
  return {
    id: path.id,
    name: `Path ${String.fromCharCode(65 + idx)}`,
    label: path.name,
    sequence: path.typicalRoles,
    totalYears: path.timeToTransition,
    description: path.description,
    sector: path.sector,
    ...PATH_COLORS[idx % PATH_COLORS.length],
  };
}

export default function AlumniPathsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const state = location.state as { currentProgramme?: string; cohort?: string; targetRole?: string } | null;

  const [currentRole, setCurrentRole] = useState('');
  const [currentSector, setCurrentSector] = useState('');
  const [targetRole, setTargetRole] = useState(state?.targetRole || 'Data Analyst');
  const [targetSector, setTargetSector] = useState('Financial Services');
  const [targetSalary, setTargetSalary] = useState('40K-55K');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [showPathDetail, setShowPathDetail] = useState(false);
  const [pathArchetypes, setPathArchetypes] = useState<DisplayPath[]>([]);
  const [alumniEvents, setAlumniEvents] = useState<AlumniEvent[]>([]);

  const programme = state?.currentProgramme || 'Computer Science';
  const cohort = state?.cohort || 'Class of 2026';

  useEffect(() => {
    Promise.all([
      programmes.alumniPaths(),
      programmes.alumniEvents(),
    ]).then(([paths, events]) => {
      setPathArchetypes(paths.map(mapToDisplayPath));
      setAlumniEvents(events);
    }).catch(console.error);
  }, []);

  const selectedPath = pathArchetypes.find(p => p.id === selectedPathId);
  const relevantEvents = selectedPathId
    ? alumniEvents.filter(e => e.relevantPathIds.includes(selectedPathId))
    : [];

  const handleSetTargetPath = () => {
    // Store targetPathId in user profile (would be API call in real app)
    setShowPathDetail(false);
    // Show success message or toast
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
          <h1 className="text-white text-xl font-bold">{t('Alumni Paths', '校友職涯路線')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {t('See how graduates with a background like yours progressed', '看看同你背景相近嘅校友點樣發展')}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 pb-32">
        {/* Programme + Cohort Pill */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
            <p className="text-indigo-300 text-sm font-medium">{programme} · {cohort}</p>
          </div>
        </div>

        {/* Current & Target Selector Block */}
        <div className="space-y-3">
          {/* Current Position Card */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              {t('I am now...', '現在位置')}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">{t('Programme', '課程')}</label>
                <input
                  type="text"
                  value={programme}
                  disabled
                  className="w-full bg-slate-900/60 text-slate-400 rounded-xl px-4 py-2.5 border border-slate-700/30 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">{t('Current Role (optional)', '現職 (選填)')}</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder={t('e.g., Junior Analyst', '例如：初級分析師')}
                  className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-2.5 border border-slate-700/50 outline-none focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">{t('Sector (optional)', '行業 (選填)')}</label>
                <input
                  type="text"
                  value={currentSector}
                  onChange={(e) => setCurrentSector(e.target.value)}
                  placeholder={t('e.g., Financial Services', '例如：金融服務')}
                  className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-2.5 border border-slate-700/50 outline-none focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Target Position Card */}
          <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/30">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              {t('I want to be...', '想成為')}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block">{t('Target Role', '目標職位')}</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-2.5 border border-white/10 outline-none focus:border-indigo-400 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block">{t('Target Sector', '目標行業')}</label>
                <select
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-2.5 border border-white/10 outline-none focus:border-indigo-400 transition-all text-sm"
                >
                  <option>Financial Services</option>
                  <option>Technology</option>
                  <option>Consulting</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block">{t('Target Salary Band', '目標薪金範圍')}</label>
                <select
                  value={targetSalary}
                  onChange={(e) => setTargetSalary(e.target.value)}
                  className="w-full bg-slate-900/60 text-white rounded-xl px-4 py-2.5 border border-white/10 outline-none focus:border-indigo-400 transition-all text-sm"
                >
                  <option>25K-35K</option>
                  <option>35K-45K</option>
                  <option>40K-55K</option>
                  <option>50K-70K</option>
                  <option>60K-80K+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Path Archetype List */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {t('Common paths from your degree', '常見出路路線')}
          </h3>
          <div className="space-y-3">
            {pathArchetypes.map((path, idx) => (
              <motion.button
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => {
                  setSelectedPathId(path.id);
                  setShowPathDetail(true);
                }}
                className={`w-full bg-gradient-to-r ${path.color} backdrop-blur-sm rounded-2xl p-5 border shadow-lg text-left transition-all overflow-hidden`}
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  <div className={`w-12 h-12 ${path.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className={`text-sm font-bold ${path.iconColor}`}>{path.name}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-0.5 truncate">{path.label}</h4>
                    {path.sector && (
                      <p className="text-slate-400 text-xs mb-2">{path.sector}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {path.sequence.map((role, roleIdx) => (
                        <div key={roleIdx} className="flex items-center min-w-0">
                          <span className="text-xs px-2 py-1 bg-slate-900/60 text-slate-300 rounded-lg whitespace-nowrap">
                            {role}
                          </span>
                          {roleIdx < path.sequence.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-500 mx-1 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {path.totalYears}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Alumni Events Section */}
        {relevantEvents.length > 0 && (
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              {t('Alumni events for this path', '相關校友活動')}
            </h3>
            <div className="space-y-3">
              {relevantEvents.map((event, idx) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => navigate('/jobs', { state: { tab: 'opportunities' } })}
                  className="w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-all shadow-lg text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{event.title}</h4>
                      <p className="text-slate-400 text-xs mb-2">{event.host}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-400">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.time}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                          {event.mode}
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/jobs', { state: { tab: 'opportunities' } });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      {t('Register', '報名')}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Path Detail Sheet */}
      <AnimatePresence>
        {showPathDetail && selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end max-w-[393px] mx-auto"
            onClick={() => setShowPathDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              {/* Sheet Header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-white text-xl font-bold">{selectedPath.name}: {selectedPath.label}</h2>
                  {selectedPath.sector && (
                    <p className="text-slate-400 text-xs mt-1">{selectedPath.sector}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowPathDetail(false)}
                  className="w-10 h-10 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Steps derived from typicalRoles */}
              <div className="px-6 py-6 space-y-5">
                {selectedPath.description && (
                  <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedPath.description}</p>
                    {selectedPath.sector && (
                      <span className="inline-block mt-3 text-xs px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                        {selectedPath.sector}
                      </span>
                    )}
                  </div>
                )}
                {selectedPath.sequence.map((role, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-400 font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-xs mb-1">{t('Step', '步驟')} {idx + 1}</p>
                        <h4 className="text-white font-semibold text-lg">{role}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Summary Block */}
                <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-300 text-sm font-semibold">{selectedPath.totalYears}</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {t(
                      `This path typically takes ${selectedPath.totalYears} for graduates moving towards ${targetRole}.`,
                      `此路線通常需要 ${selectedPath.totalYears}，適合目標成為 ${targetRole} 的畢業生。`
                    )}
                  </p>
                </div>

                {/* Set Target Path CTA */}
                <button
                  onClick={handleSetTargetPath}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold shadow-2xl shadow-indigo-500/30"
                >
                  {t('Set this as my target path', '設為目標路線')}
                </button>

                <div className="h-4"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Transition Coach Panel - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-gradient-to-t from-slate-900 via-slate-900/98 to-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 px-6 py-4 z-20">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const contextMessage = selectedPath
              ? `I'm currently ${currentRole || 'a graduate'} from ${programme}. I want to follow ${selectedPath.name} (${selectedPath.label}) towards ${targetRole}. Help me design a 12-month plan.`
              : `I'm a ${programme} graduate. I want to become ${targetRole} in ${targetSector}. Help me design a 12-month plan.`;

            navigate('/coach', { state: { context: contextMessage } });
          }}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 text-left shadow-2xl shadow-indigo-500/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-base">
                {t('Ask Transition Coach', '問轉職教練')}
              </p>
              <p className="text-indigo-200 text-xs mt-0.5">
                {t('Get a plan for the first 12-18 months', '獲取首 12-18 個月計劃')}
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-white flex-shrink-0" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
