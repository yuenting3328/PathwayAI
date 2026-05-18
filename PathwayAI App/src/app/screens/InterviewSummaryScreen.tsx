import { ArrowLeft, CheckCircle2, TrendingUp, MessageCircle, Calendar, ChevronDown, Award } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuestionFeedback {
  id: number;
  question: string;
  status: 'answered' | 'skipped';
  comment: string;
}

export default function InterviewSummaryScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const overallScore = 78;
  const dimensions = [
    { name: t('Communication clarity', '溝通清晰度'), score: 82, color: 'text-emerald-400' },
    { name: t('Structure (STAR)', '結構 (STAR)'), score: 75, color: 'text-indigo-400' },
    { name: t('Relevance to role', '與職位相關性'), score: 80, color: 'text-sky-400' },
    { name: t('Confidence & tone', '自信與語氣'), score: 76, color: 'text-amber-400' },
  ];

  const questionFeedback: QuestionFeedback[] = [
    {
      id: 1,
      question: 'Tell me about yourself and why you\'re interested in this role.',
      status: 'answered',
      comment: 'Good introduction, but could be more concise. Try to keep it under 90 seconds.',
    },
    {
      id: 2,
      question: 'Describe a time when you had to analyze complex data to make a decision.',
      status: 'answered',
      comment: 'Strong example with clear results. Consider quantifying the impact more specifically.',
    },
    {
      id: 3,
      question: 'How do you handle conflicting priorities when working on multiple projects?',
      status: 'answered',
      comment: 'Good structure, but the result could be more detailed.',
    },
    {
      id: 4,
      question: 'Tell me about a time you worked with stakeholders who had different requirements.',
      status: 'skipped',
      comment: 'Question skipped.',
    },
    {
      id: 5,
      question: 'What\'s your approach to learning new technical skills?',
      status: 'answered',
      comment: 'Excellent specific examples. Well articulated.',
    },
  ];

  const improvements = [
    t('Shorten your introductions to ~60 seconds', '將你的自我介紹縮短至約 60 秒'),
    t('Use more specific metrics when describing results', '描述結果時使用更具體的指標'),
    t('Practice questions about conflict with stakeholders', '練習有關與持份者衝突的問題'),
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-green-500/10 border-emerald-500/30';
    if (score >= 70) return 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30';
    if (score >= 60) return 'from-amber-500/20 to-orange-500/10 border-amber-500/30';
    return 'from-rose-500/20 to-pink-500/10 border-rose-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('Excellent', '優秀');
    if (score >= 70) return t('Good', '良好');
    if (score >= 60) return t('Fair', '一般');
    return t('Needs improvement', '需要改進');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center gap-3 z-10 shadow-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/interviews')}
          className="w-10 h-10 bg-transparent border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Session summary', '練習總結')}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{t('Here\'s how you did in this practice interview', '以下是你在這次模擬面試中的表現')}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30">
            {t('Completed', '已完成')}
          </span>
          <span className="text-slate-400 text-xs">
            {questionFeedback.filter(q => q.status === 'answered').length} {t('of', '/')} {questionFeedback.length} {t('questions answered', '個問題已回答')}
          </span>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-gradient-to-br ${getScoreColor(overallScore)} backdrop-blur-sm rounded-2xl p-6 border shadow-xl`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">{overallScore}</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-xl font-bold mb-1">{getScoreLabel(overallScore)}</p>
              <p className="text-slate-400 text-sm">{t('Overall performance', '整體表現')}</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm">
            {t('Good structure, can improve on concise answers.', '結構良好，可以在簡潔回答方面改進。')}
          </p>
        </motion.div>

        {/* Dimension Breakdown */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            {t('Dimension breakdown', '各維度分析')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((dim, idx) => (
              <motion.div
                key={dim.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-300 text-xs">{dim.name}</p>
                  <span className={`${dim.color} text-lg font-bold`}>{dim.score}</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            {t('Question-by-question review', '逐題回顧')}
          </h3>
          <div className="space-y-3">
            {questionFeedback.map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: feedback.id * 0.05 }}
                className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === feedback.id ? null : feedback.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {feedback.status === 'answered' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">
                        {t('Question', '問題')} {feedback.id}
                      </p>
                      <p className="text-slate-400 text-xs line-clamp-2">{feedback.question}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedQuestion === feedback.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    </motion.div>
                  </div>
                </button>
                {expandedQuestion === feedback.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 border-t border-slate-700/50"
                  >
                    <div className="pt-3">
                      <p className="text-slate-400 text-xs mb-2">{t('Full question', '完整問題')}</p>
                      <p className="text-slate-300 text-sm mb-3">{feedback.question}</p>
                      <p className="text-slate-400 text-xs mb-1">{t('Feedback', '反饋')}</p>
                      <p className="text-slate-300 text-sm">{feedback.comment}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Improvement Suggestions */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            {t('Next 3 things to practice', '接下來要練習的 3 件事')}
          </h3>
          <div className="space-y-2">
            {improvements.map((improvement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 text-sm flex-1">{improvement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Follow-up CTAs */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate('/skills')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
          >
            {t('Add to skill plan', '加入技能計劃')}
          </button>
          <button
            onClick={() => navigate('/coach', { state: { context: 'interview-feedback' } })}
            className="w-full bg-transparent border border-slate-700/50 text-slate-300 py-3.5 rounded-xl font-medium hover:border-indigo-500/50 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {t('Ask AI Coach for a follow-up plan', '向 AI 教練尋求後續計劃')}
          </button>
          <button
            onClick={() => navigate('/interview/setup')}
            className="w-full bg-transparent border border-slate-700/50 text-slate-300 py-3 rounded-xl font-medium hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t('Start another session', '開始另一次練習')}
          </button>
        </div>

        {/* Session Meta */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-2">{t('Session details', '練習詳情')}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-500">{t('Role:', '職位：')}</span> Data Analyst
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">{t('Type:', '類型：')}</span> Behavioural (STAR)
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">{t('Date:', '日期：')}</span> {new Date().toLocaleDateString()}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">{t('Duration:', '時長：')}</span> 18 min
            </p>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
