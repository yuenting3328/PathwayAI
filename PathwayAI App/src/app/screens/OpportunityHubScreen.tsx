import { Calendar, Users, ExternalLink, DollarSign, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { programmes as programmesApi, type GraduateProgramme } from '../lib/api';

export default function OpportunityHubScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [programmeList, setProgrammeList] = useState<GraduateProgramme[]>([]);

  useEffect(() => {
    programmesApi.list().then(setProgrammeList).catch(console.error);
  }, []);

  const featuredOpportunities = [
    {
      id: '1',
      type: 'programme',
      company: 'HSBC',
      title: 'HSBC Graduate Programme 2026',
      logo: '🏦',
      endorsed: true,
      deadline: '2026-06-30',
      salary: 'HK$35K-45K',
      applicants: 18,
    },
    {
      id: '2',
      type: 'employer',
      company: 'Deloitte',
      title: 'Audit & Assurance Graduate',
      logo: '💼',
      endorsed: true,
      deadline: '2026-07-15',
      salary: 'HK$30K-40K',
      applicants: 24,
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'HSBC Career Talk: Future of Banking',
      date: '2026-05-20',
      time: '14:00 - 16:00',
      location: 'Main Campus',
      seats: 45,
    },
    {
      id: '2',
      title: 'Tech Career Fair',
      date: '2026-05-25',
      time: '10:00 - 17:00',
      location: 'Online',
      seats: 200,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
      {/* Featured Opportunities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h3 className="text-white text-lg font-semibold">{t('Featured for You', '為你精選')}</h3>
        </div>
        <div className="space-y-4">
          {featuredOpportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all shadow-lg cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-xl flex items-center justify-center text-3xl border border-indigo-500/30 shadow-lg flex-shrink-0">
                  {opp.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {opp.endorsed && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full mb-2">
                          <Star className="w-3 h-3 fill-indigo-400" />
                          {t('University Endorsed', '大學推薦')}
                        </span>
                      )}
                      <h4 className="text-white font-semibold text-lg">{opp.title}</h4>
                      <p className="text-slate-400 text-sm mt-0.5">{opp.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-xs">
                        {t('Deadline:', '截止日期：')} {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="text-amber-400 text-xs font-medium">{opp.salary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">
                      {t(
                        `${opp.applicants} students from your uni joined last year`,
                        `上年度有 ${opp.applicants} 位你學校學生加入`
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>{t('Apply Now', '立即申請')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/coach')}
                      className="flex-1 bg-slate-800/60 backdrop-blur-sm text-slate-300 py-2.5 rounded-xl text-sm font-medium border border-slate-700/50"
                    >
                      {t('Ask Coach', '問教練')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* University-Endorsed Programmes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">
            {t('University-Endorsed Programmes', '大學認可計劃')}
          </h3>
          <button className="text-indigo-400 text-sm">{t('View all', '查看全部')}</button>
        </div>
        <div className="grid gap-3">
          {programmeList.map((programme, idx) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-lg flex items-center justify-center text-2xl border border-indigo-500/30">
                  {programme.logo ?? '🏢'}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{programme.name}</h4>
                  <p className="text-slate-400 text-sm">{programme.employer.name}</p>
                  {programme.salaryMin && programme.salaryMax && (
                    <p className="text-amber-400 text-sm">HK${programme.salaryMin / 1000}K–{programme.salaryMax / 1000}K</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{programme.deadline ? new Date(programme.deadline).toLocaleDateString() : 'Open'}</span>
                <span>•</span>
                <span className="text-emerald-400">{programme.successRate}% {t('success rate', '成功率')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h3 className="text-white text-lg font-semibold">{t('Events & Workshops', '活動與工作坊')}</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-gradient-to-br from-sky-500/10 to-blue-500/5 backdrop-blur-sm rounded-xl p-4 border border-sky-500/30 cursor-pointer"
            >
              <h4 className="text-white font-medium mb-2">{event.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xs text-sky-400 px-2 py-1 bg-sky-500/20 rounded-full">
                  {event.seats} {t('seats available', '個名額')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-4"></div>
    </div>
  );
}
