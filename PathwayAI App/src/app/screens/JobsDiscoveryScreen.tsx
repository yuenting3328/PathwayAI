import { Star, ChevronRight, Sparkles, MapPin, DollarSign, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { jobs as jobsApi, type Job } from '../lib/api';
import OpportunityHubScreen from './OpportunityHubScreen';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';

export default function JobsDiscoveryScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [jobList, setJobList] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'opportunities'>('jobs');
  const [showFilters, setShowFilters] = useState(false);
  const [datePosted, setDatePosted] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [workingMode, setWorkingMode] = useState('');

  useEffect(() => {
    jobsApi.list().then(res => {
      setJobList(res.data);
      setSavedJobs(res.data.filter(j => j.saved).map(j => j.id));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleOpenFilters = () => setShowFilters(true);
    window.addEventListener('openJobFilters', handleOpenFilters);
    return () => window.removeEventListener('openJobFilters', handleOpenFilters);
  }, []);

  const toggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400';
    if (score >= 65) return 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400';
    return 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Enhanced Filter Bar */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 space-y-4 z-10 shadow-xl">
        {/* Segmented Control */}
        <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {t('Jobs', '職位')}
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'opportunities'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {t('Opportunities', '機會')}
          </button>
        </div>

      </div>

      {/* Content */}
      {activeTab === 'opportunities' ? (
        <OpportunityHubScreen />
      ) : (
      <div className="px-6 py-6 space-y-8">
        {/* Enhanced Suggested Roles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white text-lg font-semibold">{t('Top Matches for You', '為你精選配對')}</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {jobList.filter(j => j.matchScore > 80).slice(0, 2).map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/30 shadow-xl shadow-indigo-500/10 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-1">{job.title}</h4>
                      <p className="text-slate-300 text-sm flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`px-3 py-1.5 bg-gradient-to-r ${getMatchColor(job.matchScore)} backdrop-blur-sm rounded-full font-bold text-sm shadow-lg`}
                    >
                      {job.matchScore}%
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.district}
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2 font-medium">
                      <DollarSign className="w-4 h-4" />
                      HK${job.salaryMin / 1000}K-{job.salaryMax / 1000}K
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Job List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">{t('All Opportunities', '所有機會')}</h3>
            <p className="text-slate-400 text-sm">{jobList.length} {t('roles', '職位')}</p>
          </div>
          <motion.div className="space-y-4">
            <AnimatePresence>
              {jobList.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-xl flex items-center justify-center text-2xl border border-indigo-500/30 shadow-lg flex-shrink-0">
                      {job.company[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-1 group-hover:text-indigo-300 transition-colors">
                            {job.title}
                          </h4>
                          <p className="text-slate-400 text-sm">{job.company}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSave(job.id, e)}
                          className="p-2"
                        >
                          <Star
                            className={`w-5 h-5 transition-all ${
                              savedJobs.includes(job.id)
                                ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                                : 'text-slate-500 hover:text-slate-400'
                            }`}
                          />
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-3 mb-3 text-sm">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.district}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-400 flex items-center gap-1 font-medium">
                          <DollarSign className="w-4 h-4" />
                          ${job.salaryMin / 1000}K-{job.salaryMax / 1000}K
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 bg-gradient-to-r ${getMatchColor(job.matchScore)} backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg`}>
                            {t('Match:', '配對：')} {job.matchScore}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/jobs/${job.id}`);
                            }}
                            className="text-indigo-400 text-xs hover:text-indigo-300 font-medium"
                          >
                            {t('Why this job?', '點解適合你？')}
                          </button>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Enhanced Saved Jobs */}
        {savedJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-white text-lg font-semibold">{t('Saved Roles', '已儲存職位')}</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {jobList
                .filter(job => savedJobs.includes(job.id))
                .map(job => (
                  <motion.button
                    key={job.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="flex-shrink-0 w-56 bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30 text-left shadow-lg hover:shadow-amber-500/20 transition-all"
                  >
                    <p className="text-white font-medium mb-1">{job.title}</p>
                    <p className="text-slate-400 text-sm">{job.company}</p>
                  </motion.button>
                ))}
            </div>
          </div>
        )}

        <div className="h-4"></div>
      </div>
      )}

      {/* Filter Bottom Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="bg-slate-900 border-slate-800">
          <SheetHeader>
            <SheetTitle className="text-white">{t('Filter Jobs', '篩選職位')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Date Posted */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {t('Date posted', '發佈日期')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Past 24 hours', 'Past week', 'Past month'].map(option => (
                  <button
                    key={option}
                    onClick={() => setDatePosted(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      datePosted === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    {t(option, option)}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {t('Experience level', '經驗要求')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Entry Level', 'Mid Level', 'Senior Level'].map(option => (
                  <button
                    key={option}
                    onClick={() => setExperienceLevel(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      experienceLevel === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    {t(option, option)}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {t('Salary range', '薪酬範圍')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['<30K', '30K-50K', '50K-70K', '>70K'].map(option => (
                  <button
                    key={option}
                    onClick={() => setSalaryRange(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      salaryRange === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    HK${option}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {t('Location', '地區')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Central', 'Kowloon', 'New Territories', 'Other'].map(option => (
                  <button
                    key={option}
                    onClick={() => setLocation(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      location === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    {t(option, option)}
                  </button>
                ))}
              </div>
            </div>

            {/* Working Mode */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {t('Working mode', '工作模式')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Remote', 'Hybrid', 'On-site'].map(option => (
                  <button
                    key={option}
                    onClick={() => setWorkingMode(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      workingMode === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    {t(option, option)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setDatePosted('');
                  setExperienceLevel('');
                  setSalaryRange('');
                  setLocation('');
                  setWorkingMode('');
                }}
                className="flex-1 py-3 bg-slate-800/60 text-slate-300 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                {t('Clear', '清除')}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
              >
                {t('Apply', '應用')}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
