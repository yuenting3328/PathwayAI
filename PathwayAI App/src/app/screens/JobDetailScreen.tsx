import { ArrowLeft, ExternalLink, Star, MessageCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { jobs as jobsApi, type Job } from '../lib/api';

export default function JobDetailScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education' | 'personality'>('skills');
  const [saved, setSaved] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobId) jobsApi.get(jobId).then(data => { setJob(data); setSaved(data.saved); }).catch(console.error);
  }, [jobId]);

  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">{t('Loading...', '載入中...')}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f172a] border-b border-[#334155] px-6 py-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate('/jobs')} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white flex-1 truncate">{job.title}</h1>
        <button onClick={() => setSaved(!saved)} className="text-slate-400 hover:text-white">
          <Star className={`w-6 h-6 ${saved ? 'fill-[#FBBF24] text-[#FBBF24]' : ''}`} />
        </button>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 p-6 space-y-3 z-50">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 font-semibold">
          <span>{t('Apply', '申請職位')}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/coach', { state: { context: `job: ${job.title}` } })}
          className="w-full bg-transparent border border-slate-700/50 text-slate-300 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('Ask Coach about this role', '向教練查詢此職位')}</span>
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Role Header */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
          <h2 className="text-white text-xl mb-1">{job.title}</h2>
          <p className="text-slate-300 mb-3">{job.company}</p>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{job.district}</span>
            <span>•</span>
            <span>HK${job.salaryMin / 1000}K - {job.salaryMax / 1000}K</span>
          </div>
        </div>

        {/* Match Score */}
        <div className="bg-gradient-to-br from-[#34D399]/20 to-[#34D399]/5 rounded-xl p-6 border border-[#34D399]/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#34D399]/20 rounded-full flex items-center justify-center">
              <span className="text-[#34D399] text-xl">{job.matchScore}%</span>
            </div>
            <div>
              <p className="text-white">{t('Strong Match', '非常匹配')}</p>
              <p className="text-slate-400 text-sm">{t('Match Score', '配對度')}</p>
            </div>
          </div>

          {/* Why This Job */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#34D399] flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm">
                {t(
                  `Strong fit: You already have ${job.skillsMatch.have} of ${job.skillsMatch.total} key skills.`,
                  `非常匹配：你已經擁有 ${job.skillsMatch.total} 項關鍵技能入面嘅 ${job.skillsMatch.have} 項。`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex items-center gap-2 border-b border-[#334155] mb-4">
            {(['skills', 'experience', 'education', 'personality'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm capitalize ${
                  activeTab === tab
                    ? 'text-[#6366F1] border-b-2 border-[#6366F1]'
                    : 'text-slate-400'
                }`}
              >
                {t(tab, tab)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'skills' && (
            <div className="space-y-2">
              {job.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#1e293b] rounded-lg p-3 border border-[#334155]"
                >
                  <span className="text-slate-300 text-sm">{skill}</span>
                  <CheckCircle className="w-4 h-4 text-[#34D399]" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
              <p className="text-slate-300 text-sm">{job.requirements}</p>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
              <p className="text-slate-300 text-sm">
                {t('Bachelor degree or equivalent required', '需要學士學位或同等學歷')}
              </p>
            </div>
          )}

          {activeTab === 'personality' && (
            <div className="bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
              <p className="text-slate-300 text-sm">
                {t('Analytical, detail-oriented, team player', '善於分析、注重細節、團隊合作')}
              </p>
            </div>
          )}
        </div>

        {/* Responsibilities */}
        <div>
          <h3 className="text-white mb-3">{t('Responsibilities', '職責')}</h3>
          <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]">
            <p className="text-slate-300 text-sm">{job.responsibilities}</p>
          </div>
        </div>

        <div className="h-32"></div>
      </div>
    </div>
  );
}
