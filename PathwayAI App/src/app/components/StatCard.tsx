import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  color: 'indigo' | 'amber' | 'emerald' | 'rose' | 'sky';
  trend?: 'up' | 'down';
  trendValue?: string;
  onClick?: () => void;
}

const colorClasses = {
  indigo: {
    bg: 'from-indigo-500/20 to-purple-600/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    icon: 'bg-indigo-500/20 text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  amber: {
    bg: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: 'bg-amber-500/20 text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  emerald: {
    bg: 'from-emerald-500/20 to-green-600/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'bg-emerald-500/20 text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  rose: {
    bg: 'from-rose-500/20 to-pink-600/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: 'bg-rose-500/20 text-rose-400',
    glow: 'shadow-rose-500/20',
  },
  sky: {
    bg: 'from-sky-500/20 to-blue-600/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    icon: 'bg-sky-500/20 text-sky-400',
    glow: 'shadow-sky-500/20',
  },
};

export default function StatCard({ value, label, sublabel, icon: Icon, color, trend, trendValue, onClick }: StatCardProps) {
  const classes = colorClasses[color];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${classes.bg} backdrop-blur-sm rounded-2xl p-5 border ${classes.border} text-left shadow-lg ${classes.glow} transition-all duration-300 hover:shadow-2xl w-full`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl ${classes.icon} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && trendValue && (
          <span className={`text-xs px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className={`text-3xl font-bold ${classes.text} mb-1`}>{value}</p>
        <p className="text-slate-300 text-sm font-medium">{label}</p>
        {sublabel && <p className="text-slate-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
    </motion.button>
  );
}
