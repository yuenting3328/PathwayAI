import { X, HelpCircle, ChevronRight, Mic, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const mockQuestions = [
  {
    id: 1,
    text: 'Tell me about yourself and why you\'re interested in this role.',
    hint: 'Start with your current situation, then relevant experience, and end with why this role excites you.',
  },
  {
    id: 2,
    text: 'Describe a time when you had to analyze complex data to make a decision.',
    hint: 'Use the STAR method: Situation, Task, Action, Result.',
  },
  {
    id: 3,
    text: 'How do you handle conflicting priorities when working on multiple projects?',
    hint: 'Show your time management and communication skills.',
  },
  {
    id: 4,
    text: 'Tell me about a time you worked with stakeholders who had different requirements.',
    hint: 'Focus on communication, negotiation, and finding common ground.',
  },
  {
    id: 5,
    text: 'What\'s your approach to learning new technical skills?',
    hint: 'Give specific examples of skills you\'ve learned recently.',
  },
  {
    id: 6,
    text: 'Describe a project where you had to present your findings to senior management.',
    hint: 'Highlight your presentation and communication abilities.',
  },
];

export default function InterviewPracticeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showEndSheet, setShowEndSheet] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleNext = () => {
    if (answer.trim()) {
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    }

    if (isLastQuestion) {
      // Navigate to summary screen
      navigate('/interview/summary');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setElapsedTime(0);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      navigate('/interview/summary');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setElapsedTime(0);
    }
  };

  const handleClose = () => {
    setShowEndSheet(true);
  };

  const handleEndSession = () => {
    navigate('/interview/summary');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Sticky Header */}
      <div className="flex-shrink-0 sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">
              {t('Question', '問題')} {currentQuestionIndex + 1} {t('of', '/')} {totalQuestions}
            </p>
          </div>
          <div className="text-slate-400 text-sm font-mono">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Context Strip */}
      <div className="flex-shrink-0 bg-slate-800/40 border-b border-slate-800/50 px-6 py-3">
        <p className="text-slate-400 text-xs">
          <span className="text-white font-medium">Data Analyst</span>
          {' · Behavioural · 20 min'}
        </p>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl"
        >
          <p className="text-white text-lg leading-relaxed">{currentQuestion.text}</p>
        </motion.div>

        {/* Answer Input */}
        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t('Type your answer here…', '在此輸入你的回答…')}
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-4 text-slate-200 text-sm outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:text-slate-600 min-h-[200px]"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{answer.length} {t('characters', '字符')}</span>
            <span>{formatTime(elapsedTime)} {t('elapsed', '已用')}</span>
          </div>
        </div>

        {/* Live Feedback */}
        {answer.length > 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30"
          >
            <p className="text-emerald-300 text-sm">
              {t('Good start! Try to include specific examples and results.', '開始不錯！試著加入具體例子和結果。')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 px-6 py-4 space-y-3">
        <div className="flex gap-3">
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-slate-700/50 text-slate-300 rounded-xl text-sm hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {t('Hint', '提示')}
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-slate-700/50 text-slate-300 rounded-xl text-sm hover:border-slate-600 transition-colors"
          >
            {t('Skip', '跳過')}
          </button>
          <button
            onClick={handleNext}
            disabled={!answer.trim()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              answer.trim()
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? t('Finish', '完成') : t('Next', '下一題')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hint Sheet */}
      <AnimatePresence>
        {showHint && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHint(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 p-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {t('How to answer this question', '如何回答這個問題')}
              </h3>
              <div className="space-y-3">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {currentQuestion.hint}
                </p>
                <button
                  onClick={() => setShowHint(false)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium"
                >
                  {t('Got it', '明白了')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* End Session Sheet */}
      <AnimatePresence>
        {showEndSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEndSheet(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50 p-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                {t('End practice session?', '結束練習？')}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {t('You\'ve answered', '你已回答')} {answeredQuestions.length} {t('of', '/')} {totalQuestions} {t('questions.', '個問題。')}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleEndSession}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg"
                >
                  {t('End and view feedback', '結束並查看反饋')}
                </button>
                <button
                  onClick={() => setShowEndSheet(false)}
                  className="w-full bg-transparent border border-slate-700/50 text-slate-300 py-3 rounded-xl font-medium"
                >
                  {t('Continue session', '繼續練習')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
