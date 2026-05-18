import { ArrowLeft, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { programmes as programmesApi, type GraduateProgramme } from '../lib/api';

export default function ProgrammesScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [programmeList, setProgrammeList] = useState<GraduateProgramme[]>([]);

  useEffect(() => {
    programmesApi.list().then(setProgrammeList).catch(console.error);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f172a] border-b border-[#334155] px-6 py-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white flex-1">{t('Programmes', '計劃')}</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Header Message */}
        <div className="bg-gradient-to-br from-[#6366F1]/20 to-[#8b5cf6]/10 rounded-xl p-4 border border-[#6366F1]/30">
          <h3 className="text-white mb-1">
            {t('Fast lane opportunities for your degree', '針對你學系嘅快速入行機會')}
          </h3>
          <p className="text-slate-400 text-sm">
            {t('Programmes matched to your profile and cohort', '根據你的個人資料和同屆匹配的計劃')}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button className="px-3 py-1 bg-[#6366F1] text-white text-xs rounded-full whitespace-nowrap">
            {t('All', '全部')}
          </button>
          <button className="px-3 py-1 bg-[#1e293b] text-slate-300 text-xs rounded-full whitespace-nowrap border border-[#334155]">
            {t('Banking', '銀行')}
          </button>
          <button className="px-3 py-1 bg-[#1e293b] text-slate-300 text-xs rounded-full whitespace-nowrap border border-[#334155]">
            {t('Tech', '科技')}
          </button>
          <button className="px-3 py-1 bg-[#1e293b] text-slate-300 text-xs rounded-full whitespace-nowrap border border-[#334155]">
            {t('Consulting', '諮詢')}
          </button>
        </div>

        {/* Programmes List */}
        <div className="space-y-4">
          {programmeList.map(programme => (
            <div
              key={programme.id}
              className="bg-[#1e293b] rounded-xl p-5 border border-[#334155] hover:border-[#6366F1] transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8b5cf6]/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border border-[#6366F1]/30">
                  {programme.logo ?? '🏢'}
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-1">{programme.name}</h3>
                  <p className="text-slate-400 text-xs mb-1">{programme.employer.name}</p>
                  {programme.description && (
                    <p className="text-slate-400 text-sm mb-3">{programme.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-xs">
                        {t('Deadline:', '截止日期：')} {programme.deadline ? new Date(programme.deadline).toLocaleDateString() : 'Open'}
                      </span>
                    </div>
                    {programme.salaryMin && programme.salaryMax && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 text-xs">HK${programme.salaryMin / 1000}K–{programme.salaryMax / 1000}K</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#34D399] text-xs px-2 py-1 bg-[#34D399]/20 rounded">
                      {programme.successRate}% {t('success rate', '成功率')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                      <span>{t('Apply', '申請')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/coach')}
                      className="flex-1 bg-[#334155] text-slate-300 py-2 rounded-lg text-sm"
                    >
                      {t('Prepare with Coach', '與教練準備')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
}
