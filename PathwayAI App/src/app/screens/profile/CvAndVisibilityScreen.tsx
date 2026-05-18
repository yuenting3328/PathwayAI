import { FileText, Eye, EyeOff, Download, Edit, X, Info, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CvAndVisibilityScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [hasCv] = useState(true);
  const [visibilityOn, setVisibilityOn] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('CV & visibility', '履歷及可見度')}</p>
          <p className="text-slate-500 text-xs">{t('Step 6 of 6', '第 6 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* CV block */}
        <div>
          <p className="text-white font-semibold text-sm mb-3">{t('Your CV', '你的履歷')}</p>

          {hasCv ? (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                {/* CV thumbnail */}
                <div className="w-14 h-[72px] bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-600/50 flex-shrink-0 shadow-inner">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <span className="text-slate-500 text-[9px] mt-1">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{t('Smart CV', '智能履歷')}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t('Updated 2 days ago · 1 page', '2 天前更新 · 1 頁')}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-emerald-400 text-xs">{t('Ready to share', '可分享')}</p>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/cv-editor')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 rounded-xl text-white text-xs font-semibold">
                  <Edit className="w-3.5 h-3.5" />
                  {t('Edit CV', '編輯履歷')}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700/60 border border-slate-600/50 rounded-xl text-slate-300 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  {t('View CV', '查看履歷')}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center bg-slate-700/60 border border-slate-600/50 rounded-xl text-slate-400">
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/50 rounded-2xl p-6 text-center">
              <FileText className="w-9 h-9 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">{t("You don't have a CV yet", '你還沒有履歷')}</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                {t('Generate one from your profile in under 2 minutes.', '從你的個人資料中在 2 分鐘內生成一份。')}
              </p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/cv-editor')}
                className="mt-4 px-5 py-2.5 bg-indigo-600 rounded-xl text-white text-sm font-semibold">
                {t('Generate CV', '生成履歷')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Visibility block */}
        <div>
          <p className="text-white font-semibold text-sm mb-3">{t('Recruiter visibility', '招聘者可見度')}</p>
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${visibilityOn ? 'bg-emerald-500/15' : 'bg-slate-700/40'}`}>
                  {visibilityOn
                    ? <Eye className="w-4 h-4 text-emerald-400" />
                    : <EyeOff className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t('Let employers find you', '讓僱主找到你')}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {visibilityOn
                      ? t('Your profile is visible to verified employers', '你的個人資料對已核實的僱主可見')
                      : t('Your profile is hidden from employers', '你的個人資料對僱主隱藏')}
                  </p>
                </div>
              </div>
              {/* Toggle */}
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setVisibilityOn(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${visibilityOn ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                <motion.div animate={{ x: visibilityOn ? 24 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
              </motion.button>
            </div>

            <button onClick={() => setShowInfoSheet(true)}
              className="mt-3 flex items-center gap-1.5 text-slate-500 text-xs hover:text-slate-400 transition-colors">
              <Info className="w-3.5 h-3.5" />
              {t('What is shared and how to opt out', '什麼會被分享及如何退出')}
            </button>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Finish', '完成')}
        </motion.button>
      </div>

      {/* Visibility info bottom sheet */}
      <AnimatePresence>
        {showInfoSheet && (
          <>
            <motion.div key="vis-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInfoSheet(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div key="vis-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-slate-900 rounded-t-3xl z-50">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-slate-700 rounded-full" /></div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
                <h3 className="text-white font-semibold text-base">{t('Recruiter visibility', '招聘者可見度')}</h3>
                <button onClick={() => setShowInfoSheet(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-6 py-5 pb-8 space-y-4">
                {[
                  { title: t('What is shared', '分享什麼'), body: t('Your name, degree, graduation year, target role, and skill summary are shown to verified employers on PathwayAI.', '你的姓名、學位、畢業年份、目標職位和技能摘要將顯示給 PathwayAI 上的已核實僱主。') },
                  { title: t('What is never shared', '從不分享什麼'), body: t('Your contact details, GPA, salary expectations, and full CV are never shared without your explicit permission.', '你的聯絡方式、GPA、薪酬期望和完整履歷在未經你明確許可的情況下絕不會被分享。') },
                  { title: t('How to opt out', '如何退出'), body: t('Toggle off "Let employers find you" at any time. Changes take effect immediately.', '隨時關閉「讓僱主找到你」。更改立即生效。') },
                ].map(item => (
                  <div key={item.title}>
                    <p className="text-white text-sm font-semibold">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
