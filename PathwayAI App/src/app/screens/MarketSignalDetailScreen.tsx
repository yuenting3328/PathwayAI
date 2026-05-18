import {
  ArrowLeft, TrendingUp, DollarSign, Users, Sparkles,
  Zap, Star, Target, Flame, Building2, Briefcase, ChevronRight,
  MapPin, Clock, BarChart3,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { getSignalById, type MarketSignalCard } from '../data/marketSignalData';

// ─── Icon map ────────────────────────────────────────────────────────────────

const iconMap: Record<MarketSignalCard['iconName'], React.ElementType> = {
  Zap, TrendingUp, Sparkles, Star, Target, Flame, Building2,
};

// ─── Accent theme helper ─────────────────────────────────────────────────────

function theme(v: MarketSignalCard['accentVariant']) {
  const t: Record<string, {
    text: string; bg: string; border: string;
    heroFrom: string; heroVia: string;
    chartColor: string; barColor: string;
  }> = {
    rose: {
      text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30',
      heroFrom: 'from-rose-950/80', heroVia: 'via-rose-900/40',
      chartColor: '#F43F5E', barColor: 'bg-rose-500',
    },
    emerald: {
      text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30',
      heroFrom: 'from-emerald-950/80', heroVia: 'via-emerald-900/40',
      chartColor: '#34D399', barColor: 'bg-emerald-500',
    },
    purple: {
      text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30',
      heroFrom: 'from-purple-950/80', heroVia: 'via-purple-900/40',
      chartColor: '#a855f7', barColor: 'bg-purple-500',
    },
    sky: {
      text: 'text-sky-400', bg: 'bg-sky-500/20', border: 'border-sky-500/30',
      heroFrom: 'from-sky-950/80', heroVia: 'via-sky-900/40',
      chartColor: '#0EA5E9', barColor: 'bg-sky-500',
    },
    indigo: {
      text: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30',
      heroFrom: 'from-indigo-950/80', heroVia: 'via-indigo-900/40',
      chartColor: '#6366F1', barColor: 'bg-indigo-500',
    },
    amber: {
      text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30',
      heroFrom: 'from-amber-950/80', heroVia: 'via-amber-900/40',
      chartColor: '#FBBF24', barColor: 'bg-amber-500',
    },
  };
  return t[v] ?? t['indigo'];
}

function badgeCls(v: MarketSignalCard['badgeVariant']) {
  return ({
    'hot':         'bg-rose-500/25 text-rose-300 border-rose-500/40',
    'growing':     'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    'emerging':    'bg-purple-500/25 text-purple-300 border-purple-500/40',
    'stable':      'bg-sky-500/25 text-sky-300 border-sky-500/40',
    'rising':      'bg-amber-500/25 text-amber-300 border-amber-500/40',
    'balanced':    'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    'high-demand': 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40',
  } as Record<string, string>)[v] ?? 'bg-slate-500/25 text-slate-300 border-slate-500/40';
}

function competitionPill(c: string) {
  if (c === 'Low') return { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Low Competition' };
  if (c === 'Very Competitive') return { cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30', label: 'Very Competitive' };
  if (c === 'Competitive') return { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Competitive' };
  return { cls: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', label: 'Moderate' };
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800/95 border border-slate-700 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-sm">
        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
        <p className="text-white font-bold text-sm">{payload[0].value} openings</p>
      </div>
    );
  }
  return null;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MarketSignalDetailScreen() {
  const { signalId } = useParams<{ signalId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const card = getSignalById(signalId ?? '');

  if (!card) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">{t('Signal not found', '找不到訊號')}</p>
      </div>
    );
  }

  const th = theme(card.accentVariant);
  const Icon = iconMap[card.iconName];
  const comp = competitionPill(card.details.competition);

  // Add unique IDs to trend data to prevent duplicate key warnings in recharts
  const trendDataWithIds = card.trendData.map((item, idx) => ({
    ...item,
    id: `trend-${card.id}-${idx}`,
  }));

  const earliest = card.trendData[0].value;
  const latest = card.trendData[card.trendData.length - 1].value;
  const pctChange = Math.round(((latest - earliest) / earliest) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div className={`relative bg-gradient-to-b ${th.heroFrom} ${th.heroVia} to-slate-950 pb-8`}>

        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: th.chartColor }}
        />

        {/* Back button */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-slate-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </motion.button>
          <p className="text-white font-semibold text-base leading-tight line-clamp-1">{card.title}</p>
        </div>

        {/* Hero body */}
        <div className="px-6 pt-4 pb-0 relative z-10 space-y-5">
          {/* Badge row */}
          <div className="flex items-center gap-3">
            <div className={`w-13 h-13 w-12 h-12 ${th.bg} rounded-2xl flex items-center justify-center border ${th.border} shadow-xl`}>
              <Icon className={`w-6 h-6 ${th.text}`} />
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${badgeCls(card.badgeVariant)}`}>
              {card.badge}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight mb-2">
              {card.title}
            </h1>
            <p className="text-slate-300/80 text-sm leading-relaxed">{card.description}</p>
          </div>

          {/* Metric cards row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className={`rounded-2xl p-3.5 ${th.bg} border ${th.border} text-center`}>
              <p className={`font-bold text-base ${th.text}`}>{card.metric}</p>
              <p className="text-slate-400 text-xs mt-0.5 leading-tight">{card.metricLabel}</p>
            </div>
            <div className="rounded-2xl p-3.5 bg-slate-800/60 border border-slate-700/40 text-center">
              <p className="text-white font-bold text-base">{card.details.openings}</p>
              <p className="text-slate-400 text-xs mt-0.5">{t('Openings', '職位數')}</p>
            </div>
            <div className={`rounded-2xl p-3.5 border text-center ${comp.cls}`}>
              <p className="font-bold text-xs leading-tight">{card.details.competition}</p>
              <p className="text-xs opacity-70 mt-0.5">{t('Competition', '競爭度')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="px-6 space-y-7 py-6 pb-10">

        {/* 1 ── Demand Trend Chart */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${th.text}`} />
              {t('Demand Trend', '需求趨勢')}
            </h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${th.bg} ${th.text} border ${th.border}`}>
              {pctChange >= 0 ? '+' : ''}{pctChange}% (6 mo)
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">
            {/* Chart */}
            <div className="p-4 pt-5">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart
                  data={trendDataWithIds}
                  margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                  id={`chart-${card.id}`}
                >
                  <defs>
                    <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={th.chartColor} stopOpacity={0.45} key="stop-0" />
                      <stop offset="100%" stopColor={th.chartColor} stopOpacity={0.02} key="stop-1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                    key={`grid-${card.id}`}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    key={`xaxis-${card.id}`}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    key={`yaxis-${card.id}`}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }}
                    key={`tooltip-${card.id}`}
                  />
                  <Area
                    key={`area-${card.id}`}
                    type="monotone"
                    dataKey="value"
                    stroke={th.chartColor}
                    strokeWidth={2.5}
                    fill={`url(#grad-${card.id})`}
                    dot={false}
                    activeDot={{ fill: th.chartColor, r: 6, strokeWidth: 2.5, stroke: '#0f172a' }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Trend summary strip */}
            <div className="flex items-center px-5 py-4 bg-slate-800/40 border-t border-slate-800/60 gap-3">
              <div className="flex-1 text-center">
                <p className="text-slate-500 text-xs mb-0.5">Nov</p>
                <p className="text-white font-semibold text-sm">{earliest}</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${pctChange >= 0 ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-rose-500/15 border border-rose-500/25'}`}>
                  <TrendingUp className={`w-3 h-3 ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className={`text-xs font-bold ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pctChange >= 0 ? '+' : ''}{pctChange}%
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <p className="text-slate-500 text-xs mb-0.5">Apr</p>
                <p className="text-white font-semibold text-sm">{latest}</p>
              </div>
            </div>
          </div>

          {/* Highlight tag */}
          <div className={`mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl ${th.bg} border ${th.border}`}>
            <BarChart3 className={`w-4 h-4 ${th.text} flex-shrink-0`} />
            <p className={`text-sm font-medium ${th.text}`}>{card.details.highlight}</p>
          </div>
        </section>

        {/* 2 ── Salary Distribution */}
        <section>
          <h2 className="text-white font-bold text-base flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-amber-400" />
            {t('Salary Distribution', '薪金分佈')}
          </h2>

          <div className="bg-slate-900/80 rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">
            {/* Distribution bars */}
            <div className="p-5 space-y-5">
              {[
                { tier: card.salary.low,  barCls: 'bg-amber-500',   trackCls: 'bg-amber-500/15',   textCls: 'text-amber-400',   label: t('Entry Level', '入門級'), dotCls: 'bg-amber-500' },
                { tier: card.salary.mid,  barCls: 'bg-indigo-500',  trackCls: 'bg-indigo-500/15',  textCls: 'text-indigo-400',  label: t('Mid-level', '中級'),     dotCls: 'bg-indigo-500' },
                { tier: card.salary.high, barCls: 'bg-emerald-500', trackCls: 'bg-emerald-500/15', textCls: 'text-emerald-400', label: t('Senior', '高級'),        dotCls: 'bg-emerald-500' },
              ].map(({ tier, barCls, trackCls, textCls, label, dotCls }, idx) => (
                <div key={`salary-tier-${idx}`}>
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotCls} flex-shrink-0`} />
                      <span className="text-slate-200 text-sm font-semibold">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${textCls}`}>{tier.range}</span>
                      <span className="text-slate-500 text-xs w-9 text-right">{tier.pct}%</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className={`w-full h-3.5 ${trackCls} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.pct}%` }}
                      transition={{ duration: 0.85, delay: idx * 0.15, ease: 'easeOut' }}
                      className={`h-full ${barCls} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-5 py-3.5 bg-slate-800/40 border-t border-slate-800/60">
              <p className="text-slate-500 text-xs leading-relaxed">
                {t('Based on live HK postings · percentages reflect proportion of roles at each seniority.', '根據香港最新職位空缺數據 · 百分比反映各資歷級別的職位比例。')}
              </p>
            </div>
          </div>
        </section>

        {/* 3 ── Key Skills */}
        <section>
          <h2 className="text-white font-bold text-base flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {t('Key Skills in Demand', '市場所需技能')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {card.details.keySkills.map((skill, idx) => (
              <motion.span
                key={`skill-${idx}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${th.bg} ${th.text} border ${th.border}`}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </section>

        {/* 4 ── Top Hiring Companies */}
        <section>
          <h2 className="text-white font-bold text-base flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            {t('Top Hiring Companies', '主要招聘公司')}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {card.details.topCompanies.map((company, idx) => (
              <motion.div
                key={`company-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/40"
              >
                <div className={`w-9 h-9 ${th.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${th.border}`}>
                  <span className={`text-xs font-bold ${th.text}`}>{company[0]}</span>
                </div>
                <span className="text-slate-200 text-sm font-medium">{company}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5 ── Location / context details */}
        <section>
          <h2 className="text-white font-bold text-base flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-slate-400" />
            {t('Market Context', '市場背景')}
          </h2>
          <div className={`bg-gradient-to-br ${th.heroFrom} ${th.heroVia} to-slate-900/60 rounded-2xl p-5 border ${th.border} shadow-lg`}>
            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">{t('Data period', '數據期間')}</p>
                  <p className="text-white text-xs font-semibold">Nov 2025 – Apr 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs">{t('Applicants/role', '申請人/職位')}</p>
                  <p className="text-white text-xs font-semibold">
                    {card.details.competition === 'Low' ? '< 5' : card.details.competition === 'Moderate' ? '5–15' : '15+'}
                  </p>
                </div>
              </div>
            </div>
            {/* Insight */}
            <p className="text-slate-300 text-sm leading-relaxed">{card.details.insight}</p>
          </div>
        </section>

        {/* ─── CTAs ─────────────────────────────────────────────────────────── */}
        <section className="space-y-3 pt-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/jobs')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25"
          >
            <Briefcase className="w-5 h-5" />
            {t('View Matching Jobs', '查看匹配職位')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/skills')}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 border border-slate-700/60"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
            {t('Plan Skills for This Segment', '為此市場規劃技能')}
          </motion.button>
        </section>

      </div>
    </div>
  );
}
