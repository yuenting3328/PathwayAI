import { ArrowLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function InterviewSessionSetupScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState('Data Analyst');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [interviewType, setInterviewType] = useState<'screening' | 'behavioural' | 'technical'>('screening');
  const [format, setFormat] = useState<'question' | 'continuous'>('question');
  const [duration, setDuration] = useState(20);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [answerMode, setAnswerMode] = useState<'voice' | 'text'>('text');

  const roleOptions = ['Data Analyst', 'Business Analyst', 'Software Engineer', 'Product Manager', 'Cybersecurity Analyst'];
  const focusOptions = [
    'Tell me about yourself',
    'Strengths & weaknesses',
    'Past projects',
    'Motivation & cultural fit',
    'Data analysis',
    'Stakeholder communication',
  ];

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const getInterviewTypeHint = () => {
    switch (interviewType) {
      case 'screening':
        return t('General questions about background and fit', '關於背景和適合度的一般問題');
      case 'behavioural':
        return t('Situation, Task, Action, Result framework', '情境、任務、行動、結果框架');
      case 'technical':
        return t('Role-specific skills and technical knowledge', '職位特定技能和技術知識');
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
          className="w-10 h-10 bg-transparent border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Start practice session', '開始練習')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('Set up a mock interview for a specific role', '為特定職位設定模擬面試')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Selected Role & Company */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">{t('Interview for', '面試職位')}</label>
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-900/60 text-white rounded-lg px-4 py-3 border border-slate-700/40 outline-none focus:border-indigo-500/50 transition-all mb-3"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <input
              type="text"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              placeholder={t('Company (optional)', '公司（可選）')}
              className="w-full bg-slate-900/60 text-white rounded-lg px-4 py-3 border border-slate-700/40 outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">{t('Interview type', '面試類型')}</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'screening', label: t('Screening', '篩選') },
              { id: 'behavioural', label: t('Behavioural', '行為') },
              { id: 'technical', label: t('Technical', '技術') },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setInterviewType(type.id as any)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  interviewType === type.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-2">{getInterviewTypeHint()}</p>
        </div>

        {/* Format & Duration */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">{t('Format', '格式')}</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setFormat('question')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                format === 'question'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
              }`}
            >
              {t('Question-by-question', '逐題作答')}
            </button>
            <button
              onClick={() => setFormat('continuous')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                format === 'continuous'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
              }`}
            >
              {t('Continuous', '連續對話')}
            </button>
          </div>

          <label className="text-slate-400 text-sm mb-2 block">
            {t('Duration', '時長')}: <span className="text-indigo-400 font-semibold">{duration} min</span>
          </label>
          <div className="flex gap-2">
            {[10, 20, 30].map(mins => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  duration === mins
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">{t('Focus areas', '重點範圍')}</label>
          <div className="flex flex-wrap gap-2">
            {focusOptions.map(area => (
              <button
                key={area}
                onClick={() => toggleFocusArea(area)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  focusAreas.includes(area)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Answer Mode */}
        <div>
          <label className="text-slate-400 text-sm mb-2 block">{t('Answer mode', '回答方式')}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAnswerMode('text')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                answerMode === 'text'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
              }`}
            >
              {t('Text answers', '文字回答')}
            </button>
            <button
              onClick={() => setAnswerMode('voice')}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                answerMode === 'voice'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
              }`}
            >
              {t('Voice answers', '語音回答')}
            </button>
          </div>
          <p className="text-slate-500 text-xs mt-2">
            {t('We record your responses only to generate feedback. They\'re not shared with employers.', '我們僅記錄你的回答以生成反饋，不會與僱主分享。')}
          </p>
        </div>

        {/* Session Preview */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-xl p-5 border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-semibold">{t('Session preview', '練習預覽')}</h3>
          </div>
          <p className="text-slate-300 text-sm">
            {t('You\'ll get ~6-8 questions and instant feedback at the end.', '你將獲得約 6-8 個問題，並在結束時獲得即時反饋。')}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Navigate to practice screen (to be created)
              navigate('/interview/practice');
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
          >
            {t('Begin session', '開始練習')}
          </motion.button>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
