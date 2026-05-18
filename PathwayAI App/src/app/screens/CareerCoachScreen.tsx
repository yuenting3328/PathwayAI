import {
  Send, FileText, Sparkles, Loader2, Bot,
  User as UserIcon, Plus, X, File, Camera, Trash2, Download,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';
import { coaching, BASE_URL, getToken, type CoachHealth, type ChatMessage as ApiChatMessage } from '../lib/api';

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  attachment?: { filename: string; url: string };
}

const WELCOME: Message = {
  id: 'welcome',
  type: 'coach',
  content: "Hello! I'm your PathwayAI Coach — an AI agent here to help you navigate Hong Kong's graduate job market. I can answer questions, build plans, and take action on your behalf.\n\nWhat's on your mind today?",
  timestamp: new Date(),
};

export default function CareerCoachScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [health, setHealth] = useState<CoachHealth>({ model: 'claude-opus-4-5-20251101', apiKeyConfigured: false, mode: 'mock' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { en: 'Review my CV and suggest improvements', zh: '檢視我嘅履歷並提供改進建議', icon: FileText },
    { en: 'Help me prepare for data analyst interviews', zh: '幫我準備數據分析師面試', icon: UserIcon },
    { en: 'What skills should I focus on learning next?', zh: '我應該優先學習咩技能？', icon: Sparkles },
  ];

  const addOptions = [
    {
      icon: File,
      label: t('Import Document', '匯入文件'),
      description: t('PDF, Word, or text files', 'PDF、Word 或文字檔'),
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/20',
      border: 'border-indigo-500/30',
    },
    {
      icon: Camera,
      label: t('Add Image', '添加圖片'),
      description: t('JPG, PNG, or screenshot', 'JPG、PNG 或截圖'),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
    },
  ];

  // Load health status + conversation history on mount
  useEffect(() => {
    coaching.health().then(setHealth).catch(() => {});

    coaching.messages().then((history: ApiChatMessage[]) => {
      if (history.length > 0) {
        setMessages(history.map(m => ({
          id: m.id,
          type: m.role === 'user' ? 'user' : 'coach',
          content: m.content,
          timestamp: new Date(m.createdAt),
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isStreaming]);

  const handleSend = async (messageOverride?: string) => {
    const text = messageOverride ?? input;
    if (!text.trim() || isTyping || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!messageOverride) setInput('');
    setIsTyping(true);

    const coachMsgId = `coach-${Date.now()}`;

    try {
      const token = getToken();
      const history = updatedMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        }));

      const response = await fetch(`${BASE_URL}/coach/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      // Add empty coach bubble and switch to streaming mode
      setMessages(prev => [...prev, { id: coachMsgId, type: 'coach', content: '', timestamp: new Date() }]);
      setIsTyping(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.done) {
              if (parsed.attachment) {
                setMessages(prev =>
                  prev.map(m => m.id === coachMsgId ? { ...m, attachment: parsed.attachment } : m)
                );
              }
              break;
            }
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.token) {
              accumulated += parsed.token;
              setMessages(prev =>
                prev.map(m => m.id === coachMsgId ? { ...m, content: accumulated } : m)
              );
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => {
        const withoutEmpty = prev.filter(m => !(m.id === coachMsgId && m.content === ''));
        return [...withoutEmpty, {
          id: coachMsgId,
          type: 'coach',
          content: t('Sorry, I had trouble connecting. Please try again.', '抱歉，連線出現問題，請再試一次。'),
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleClear = async () => {
    await coaching.clearMessages().catch(() => {});
    setMessages([WELCOME]);
  };

  const handlePromptClick = (prompt: { en: string; zh: string }) => {
    handleSend(t(prompt.en, prompt.zh));
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50 min-h-0">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* Agent Model Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center gap-3 pt-2 pb-4"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg"
            />
          </div>

          {/* Name & model badge */}
          <div>
            <h3 className="text-white text-lg font-bold">{t('PathwayAI Coach', 'PathwayAI 職業教練')}</h3>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium">Claude Opus</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                health.mode === 'live'
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-slate-400 bg-slate-700/40 border border-slate-700/50'
              }`}>
                {health.mode === 'live' ? '● Live' : '○ Demo'}
              </span>
            </div>
          </div>

          {/* Capability chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { en: 'CV Review', zh: '履歷審閱' },
              { en: 'Interview Prep', zh: '面試準備' },
              { en: 'Skill Gaps', zh: '技能分析' },
              { en: 'Action Plans', zh: '行動計劃' },
              { en: 'HK Market', zh: '香港市場' },
            ].map(chip => (
              <span key={chip.en} className="px-2.5 py-1 bg-slate-800/70 border border-slate-700/50 rounded-full text-slate-400 text-xs">
                {t(chip.en, chip.zh)}
              </span>
            ))}
          </div>

          {/* Clear history button */}
          {messages.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-400 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t('Clear conversation', '清除對話')}
            </motion.button>
          )}
        </motion.div>

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'coach' && (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl rounded-tr-md shadow-xl shadow-indigo-500/20'
                    : 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm text-slate-200 border border-slate-700/50 rounded-3xl rounded-tl-md shadow-xl'
                } px-5 py-4`}
              >
                {message.type === 'coach' ? (
                  // Phase 5 — Markdown rendering
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
                      ul: ({ children }) => <ul className="text-sm list-disc pl-4 space-y-1 mb-2 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="text-sm list-decimal pl-4 space-y-1 mb-2 last:mb-0">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed text-slate-200">{children}</li>,
                      h1: ({ children }) => <h1 className="text-white font-bold text-base mb-2 mt-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-white font-semibold text-sm mb-1.5 mt-3 first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-white font-semibold text-sm mb-1 mt-2 first:mt-0">{children}</h3>,
                      code: ({ children }) => <code className="bg-slate-700/60 rounded px-1 py-0.5 text-xs font-mono text-indigo-300">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-500/50 pl-3 text-slate-400 italic my-2">{children}</blockquote>,
                      table: ({ children }) => <div className="overflow-x-auto my-2"><table className="text-xs border-collapse w-full">{children}</table></div>,
                      th: ({ children }) => <th className="border border-slate-600/60 px-2 py-1.5 text-left text-slate-300 font-semibold bg-slate-700/30">{children}</th>,
                      td: ({ children }) => <td className="border border-slate-600/60 px-2 py-1.5 text-slate-400">{children}</td>,
                      hr: () => <hr className="border-slate-700/50 my-3" />,
                    }}
                  >
                    {message.content || ' '}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
                {message.attachment && (
                  <a
                    href={message.attachment.url}
                    download={message.attachment.filename}
                    className="mt-3 flex items-center gap-2.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-indigo-300 text-sm font-medium transition-all group"
                  >
                    <Download className="w-4 h-4 flex-shrink-0 group-hover:text-indigo-200 transition-colors" />
                    <span className="truncate group-hover:text-indigo-200 transition-colors">{message.attachment.filename}</span>
                  </a>
                )}
                <p className="text-xs mt-2 opacity-50">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.type === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0 font-semibold text-white text-sm">
                  Y
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator (before stream starts) */}
        <AnimatePresence>
          {isTyping && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl rounded-tl-md px-6 py-4 shadow-xl">
                <div className="flex gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay }}
                      className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-400' : i === 1 ? 'bg-purple-400' : 'bg-pink-400'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Prompts */}
        {messages.length === 1 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mt-8"
          >
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('Suggested questions:', '建議問題：')}
            </p>
            <div className="grid gap-3">
              {suggestedPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm text-slate-300 text-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all p-4 text-left shadow-lg hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span className="font-medium">{t(prompt.en, prompt.zh)}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-slate-800/50 px-4 py-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90 backdrop-blur-xl shadow-2xl">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl focus-within:border-indigo-500/50 transition-all shadow-lg overflow-hidden">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t(
                'Ask about jobs, CV, skills, or career advice...',
                '問我關於工作、履歷、技能或職涯建議...'
              )}
              rows={1}
              className="w-full bg-transparent text-white text-sm outline-none px-4 pt-3 pb-1 placeholder:text-slate-500 resize-none max-h-32"
            />
            <div className="flex items-center px-2 pb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddSheet(true)}
                className="w-8 h-8 bg-slate-700/60 rounded-xl flex items-center justify-center border border-slate-600/50 hover:border-indigo-500/60 hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isStreaming}
            className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 transition-all flex-shrink-0"
          >
            {(isTyping || isStreaming) ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Add Options Bottom Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              key="add-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSheet(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              key="add-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
                <h3 className="text-white font-semibold text-base">
                  {t('Add to conversation', '添加至對話')}
                </h3>
                <button
                  onClick={() => setShowAddSheet(false)}
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-3 pb-8">
                {addOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddSheet(false)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border ${opt.border} hover:bg-slate-800 transition-all text-left`}
                    >
                      <div className={`w-12 h-12 ${opt.bg} rounded-2xl flex items-center justify-center flex-shrink-0 border ${opt.border}`}>
                        <Icon className={`w-6 h-6 ${opt.color}`} />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{opt.label}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{opt.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
