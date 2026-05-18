import { ArrowLeft, BookOpen, Briefcase, Calendar, Laptop, Plus, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

type ActionType = 'module' | 'course' | 'task' | 'event';
type ActionStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';
type TimeBucket = 'now' | 'term' | 'next' | 'year';

interface Action {
  id: string;
  title: string;
  type: ActionType;
  timeBucket: TimeBucket;
  period: string;
  duration: string;
  skills: string[];
  status: ActionStatus;
  description?: string;
}

export default function PlanTimelineScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState<TimeBucket | 'all'>('all');
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<ActionType[]>([]);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<ActionStatus[]>([]);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showAddAction, setShowAddAction] = useState(false);

  const actions: Action[] = [
    { id: '1', title: 'Corporate Finance I (Module)', type: 'module', timeBucket: 'now', period: 'Week 3–4', duration: '6 hours', skills: ['Excel modelling', 'Valuation basics'], status: 'in_progress', description: 'Core finance module covering fundamental concepts' },
    { id: '2', title: 'Excel for Finance (Online course)', type: 'course', timeBucket: 'now', period: 'Week 1–6', duration: '8 hours', skills: ['Excel modelling'], status: 'planned', description: 'Advanced Excel techniques for financial modelling' },
    { id: '3', title: 'Build 2-page cash flow model', type: 'task', timeBucket: 'term', period: 'Term 2', duration: '4 hours', skills: ['Excel modelling', 'Financial analysis'], status: 'planned', description: 'Practice task for building financial models' },
    { id: '4', title: 'Banking networking night', type: 'event', timeBucket: 'term', period: 'Term 2, Week 5', duration: '1 evening', skills: ['Networking', 'Communication'], status: 'planned', description: 'Network with banking professionals' },
    { id: '5', title: 'Investment Analysis (Module)', type: 'module', timeBucket: 'next', period: 'Term 3', duration: '12 hours', skills: ['Valuation', 'Investment strategy'], status: 'planned', description: 'Advanced investment analysis techniques' },
    { id: '6', title: 'Python for Financial Analysis', type: 'course', timeBucket: 'year', period: 'Q4', duration: '10 hours', skills: ['Python', 'Data analysis'], status: 'planned', description: 'Apply Python to financial data analysis' },
  ];

  const filteredActions = actions.filter(action => {
    if (selectedRange !== 'all' && action.timeBucket !== selectedRange) return false;
    if (selectedTypeFilters.length > 0 && !selectedTypeFilters.includes(action.type)) return false;
    if (selectedStatusFilters.length > 0 && !selectedStatusFilters.includes(action.status)) return false;
    return true;
  });

  const groupedActions = {
    now: filteredActions.filter(a => a.timeBucket === 'now'),
    term: filteredActions.filter(a => a.timeBucket === 'term'),
    next: filteredActions.filter(a => a.timeBucket === 'next'),
    year: filteredActions.filter(a => a.timeBucket === 'year'),
  };

  const getTypeIcon = (type: ActionType) => {
    switch (type) {
      case 'module': return BookOpen;
      case 'course': return Laptop;
      case 'task': return Calendar;
      case 'event': return Calendar;
    }
  };

  const getTypeColor = (type: ActionType) => {
    switch (type) {
      case 'module': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'course': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'task': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'event': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    }
  };

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'planned': return 'bg-slate-500/20 text-slate-300';
      case 'in_progress': return 'bg-amber-500/20 text-amber-300';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300';
      case 'skipped': return 'bg-rose-500/20 text-rose-300';
    }
  };

  const toggleTypeFilter = (type: ActionType) => {
    setSelectedTypeFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStatusFilter = (status: ActionStatus) => {
    setSelectedStatusFilters(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const plannedCount = actions.filter(a => a.status === 'planned').length;
  const completedCount = actions.filter(a => a.status === 'completed').length;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center gap-3 z-10 shadow-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-transparent border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Skill plan timeline', '技能規劃時間線')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('See and manage all your planned actions', '查看及管理所有規劃行動')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Role & Period Context */}
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1">{t('Target role', '目標職位')}</p>
          <p className="text-white font-semibold">Investment Banking Analyst</p>
          <p className="text-slate-400 text-xs mt-2">{t('Time horizon', '時間範圍')}: Now → 12 months</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: t('All', '全部') },
            { id: 'now', label: t('Now', '現在') },
            { id: 'term', label: t('This term', '本學期') },
            { id: 'next', label: t('Next term', '下學期') },
            { id: 'year', label: t('12 months', '12 個月') },
          ].map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedRange === range.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="space-y-3">
          <div>
            <p className="text-slate-400 text-xs mb-2">{t('Type', '類型')}</p>
            <div className="flex flex-wrap gap-2">
              {(['module', 'course', 'task', 'event'] as ActionType[]).map(type => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedTypeFilters.includes(type)
                      ? getTypeColor(type) + ' border'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {t(type.charAt(0).toUpperCase() + type.slice(1), type)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-2">{t('Status', '狀態')}</p>
            <div className="flex flex-wrap gap-2">
              {(['planned', 'in_progress', 'completed'] as ActionStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedStatusFilters.includes(status)
                      ? getStatusColor(status)
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {t(status.replace('_', ' '), status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-6">
          {/* Now (0-4 weeks) */}
          {groupedActions.now.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t('Now (0–4 weeks)', '現在（0–4 週）')}</h3>
              <div className="space-y-3">
                {groupedActions.now.map(action => (
                  <ActionCard key={action.id} action={action} onClick={() => setSelectedAction(action)} />
                ))}
              </div>
            </div>
          )}

          {/* This term */}
          {groupedActions.term.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t('This term', '本學期')}</h3>
              <div className="space-y-3">
                {groupedActions.term.map(action => (
                  <ActionCard key={action.id} action={action} onClick={() => setSelectedAction(action)} />
                ))}
              </div>
            </div>
          )}

          {/* Next term */}
          {groupedActions.next.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t('Next term', '下學期')}</h3>
              <div className="space-y-3">
                {groupedActions.next.map(action => (
                  <ActionCard key={action.id} action={action} onClick={() => setSelectedAction(action)} />
                ))}
              </div>
            </div>
          )}

          {/* Within 12 months */}
          {groupedActions.year.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">{t('Within 12 months', '12 個月內')}</h3>
              <div className="space-y-3">
                {groupedActions.year.map(action => (
                  <ActionCard key={action.id} action={action} onClick={() => setSelectedAction(action)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress & Reminders */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl p-5 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold">
                {t('Planned actions:', '計劃行動：')} {plannedCount} · {t('Completed:', '已完成：')} {completedCount}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">{t('Enable reminders for this plan', '為此計劃啟用提醒')}</p>
              <p className="text-slate-400 text-xs mt-0.5">{t('We\'ll remind you about upcoming modules, courses and tasks', '我們會提醒你即將到來的模組、課程和任務')}</p>
            </div>
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`w-12 h-7 rounded-full transition-colors ${remindersEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${remindersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Add Custom Action */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowAddAction(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5" />
          {t('Add custom action', '添加自訂行動')}
        </motion.button>

        <div className="h-4"></div>
      </div>

      {/* Action Detail Sheet */}
      <AnimatePresence>
        {selectedAction && (
          <>
            <motion.div
              key="action-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAction(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              key="action-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 flex flex-col"
              style={{ maxHeight: '82vh' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
              </div>

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getTypeIcon(selectedAction.type);
                    return <Icon className="w-5 h-5 text-indigo-400" />;
                  })()}
                  <h3 className="text-white text-lg font-semibold">{selectedAction.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAction.status)}`}>
                    {t(selectedAction.status.replace('_', ' '), selectedAction.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedAction.type)}`}>
                    {t(selectedAction.type, selectedAction.type)}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">{t('Description', '描述')}</p>
                  <p className="text-slate-300 text-sm">{selectedAction.description}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">{t('Time', '時間')}</p>
                  <p className="text-white text-sm">{selectedAction.period} · {selectedAction.duration}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">{t('Skills targeted', '目標技能')}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAction.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-2"></div>
              </div>

              {/* Fixed Bottom Buttons */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800/60 bg-slate-900">
                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl">
                    {t('Mark as completed', '標記為完成')}
                  </button>
                  <button className="flex-1 py-4 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/50 font-semibold text-base">
                    {t('Reschedule', '重新安排')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionCard({ action, onClick }: { action: Action; onClick: () => void }) {
  const { t } = useLanguage();
  const Icon = action.type === 'module' ? BookOpen : action.type === 'course' ? Laptop : action.type === 'task' ? Calendar : Calendar;

  const getTypeColor = (type: ActionType) => {
    switch (type) {
      case 'module': return 'bg-indigo-500/20 text-indigo-400';
      case 'course': return 'bg-amber-500/20 text-amber-400';
      case 'task': return 'bg-emerald-500/20 text-emerald-400';
      case 'event': return 'bg-sky-500/20 text-sky-400';
    }
  };

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'planned': return 'bg-slate-500/20 text-slate-300';
      case 'in_progress': return 'bg-amber-500/20 text-amber-300';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300';
      case 'skipped': return 'bg-rose-500/20 text-rose-300';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={onClick}
      className="w-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all shadow-lg text-left"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${getTypeColor(action.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium mb-1">{action.title}</p>
          <p className="text-slate-400 text-xs mb-2">{action.period} · {action.duration}</p>
          <div className="flex flex-wrap gap-1.5">
            {action.skills.slice(0, 2).map(skill => (
              <span key={skill} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                {skill}
              </span>
            ))}
            {action.skills.length > 2 && (
              <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">
                +{action.skills.length - 2}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
            {t(action.status.replace('_', ' '), action.status)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </motion.button>
  );
}
