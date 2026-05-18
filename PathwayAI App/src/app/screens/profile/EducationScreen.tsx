import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

const institutions = ['The University of Hong Kong', 'HKUST', 'CUHK', 'PolyU', 'CityU', 'HKBU', 'Lingnan University'];
const degreeLevels = ['Bachelor', 'Master', 'PhD', 'Associate Degree', 'Higher Diploma'];
const gpaBands = ['4.0+', '3.5–3.9', '3.0–3.4', '2.5–2.9', '2.0–2.4', 'Below 2.0'];

export default function EducationScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [institution, setInstitution] = useState('The University of Hong Kong');
  const [programme, setProgramme] = useState('BEng Computer Science');
  const [degree, setDegree] = useState('Bachelor');
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState('2025');
  const [gpa, setGpa] = useState('');
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const [showGpaDropdown, setShowGpaDropdown] = useState(false);
  const [showInstDropdown, setShowInstDropdown] = useState(false);
  const [instSearch, setInstSearch] = useState('');

  const filteredInst = institutions.filter(i => i.toLowerCase().includes(instSearch.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('Education', '教育背景')}</p>
          <p className="text-slate-500 text-xs">{t('Step 2 of 6', '第 2 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <p className="text-slate-400 text-sm leading-relaxed">
          {t(
            'Link your degree so we can benchmark you against outcomes from your programme.',
            '連結你的學位，讓我們能以你的課程成果作基準比較。'
          )}
        </p>

        {/* Institution */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Institution', '院校')}</label>
          <button onClick={() => setShowInstDropdown(v => !v)}
            className="w-full flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3 text-left">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-white text-sm">{institution || t('Search institution…', '搜尋院校…')}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <AnimatePresence>
            {showInstDropdown && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl z-20 relative">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input autoFocus value={instSearch} onChange={e => setInstSearch(e.target.value)}
                    placeholder={t('Search…', '搜尋…')}
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500" />
                </div>
                {filteredInst.map(i => (
                  <button key={i} onClick={() => { setInstitution(i); setShowInstDropdown(false); setInstSearch(''); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${i === institution ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                    {i}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Programme */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Programme', '課程')}</label>
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3">
            <input value={programme} onChange={e => setProgramme(e.target.value)}
              placeholder={t('Search programme…', '搜尋課程…')}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
          </div>
        </div>

        {/* Degree level */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Degree level', '學位等級')}</label>
          <button onClick={() => setShowDegreeDropdown(v => !v)}
            className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
            <span className="text-white text-sm">{degree}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <AnimatePresence>
            {showDegreeDropdown && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                {degreeLevels.map(d => (
                  <button key={d} onClick={() => { setDegree(d); setShowDegreeDropdown(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm ${d === degree ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                    {d}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Major */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Major / concentration', '主修 / 專修')}</label>
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3">
            <input value={major} onChange={e => setMajor(e.target.value)}
              placeholder={t('e.g. Computer Science', 'e.g. 電腦科學')}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
          </div>
        </div>

        {/* Graduation year */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">{t('Graduation year', '畢業年份')}</label>
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/60 rounded-xl px-4 py-3">
            <input value={gradYear} onChange={e => setGradYear(e.target.value)}
              placeholder="e.g. 2025" type="number"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600" />
          </div>
        </div>

        {/* GPA */}
        <div>
          <label className="text-slate-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
            {t('GPA or grade band', 'GPA 或成績等級')}
            <span className="text-slate-600">{t('(optional)', '（選填）')}</span>
          </label>
          <button onClick={() => setShowGpaDropdown(v => !v)}
            className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
            <span className={`text-sm ${gpa ? 'text-white' : 'text-slate-600'}`}>
              {gpa || t('Select grade band…', '選擇成績等級…')}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <AnimatePresence>
            {showGpaDropdown && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                {gpaBands.map(g => (
                  <button key={g} onClick={() => { setGpa(g); setShowGpaDropdown(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm ${g === gpa ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                    {g}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-slate-600 text-xs mt-1.5">
            {t('You can add GPA later to improve match quality.', '你可以稍後添加 GPA 以提升配對質量。')}
          </p>
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile/experience')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Save & Continue', '儲存並繼續')}
        </motion.button>
      </div>
    </div>
  );
}
