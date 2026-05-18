import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', gradient = false, hover = false, onClick }: GlassCardProps) {
  const baseClasses = 'rounded-2xl backdrop-blur-sm border transition-all duration-300';
  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer' : '';
  const gradientClasses = gradient
    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
    : 'bg-slate-800/40 border-slate-700/30';

  return (
    <div
      className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
