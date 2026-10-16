import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  variant?: 'default' | 'danger' | 'warning' | 'teal' | 'cyan';
  badge?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  variant = 'default',
  badge
}) => {
  const borderVariants = {
    default: 'border-navy-700 bg-navy-900/80 hover:border-navy-600',
    danger: 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-navy-900/90 hover:border-red-500/60',
    warning: 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-navy-900/90 hover:border-amber-500/60',
    teal: 'border-teal-500/40 bg-gradient-to-b from-teal-950/20 to-navy-900/90 hover:border-teal-500/60',
    cyan: 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-navy-900/90 hover:border-cyan-500/60',
  }[variant];

  const iconVariants = {
    default: 'text-slate-400 bg-navy-800',
    danger: 'text-red-400 bg-red-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    teal: 'text-teal-400 bg-teal-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  }[variant];

  return (
    <div className={`relative rounded-xl border p-5 backdrop-blur transition-all duration-200 shadow-md ${borderVariants}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconVariants}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{subtext}</span>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
};
