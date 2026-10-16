import React from 'react';
import { RiskSeverity } from '../../types';

interface RiskBadgeProps {
  level: RiskSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showScore?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showScore }) => {
  let bg = 'bg-risk-low/15 text-emerald-300 border-risk-low/30';
  let dotBg = 'bg-emerald-400';

  if (level === 'Severe') {
    bg = 'bg-risk-severe/20 text-red-300 border-risk-severe/40 animate-pulse';
    dotBg = 'bg-red-400';
  } else if (level === 'High') {
    bg = 'bg-risk-high/20 text-orange-300 border-risk-high/40';
    dotBg = 'bg-orange-400';
  } else if (level === 'Moderate') {
    bg = 'bg-risk-moderate/20 text-amber-300 border-risk-moderate/40';
    dotBg = 'bg-amber-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${sizeClasses} ${bg}`}>
      <span className={`h-2 w-2 rounded-full ${dotBg}`} />
      <span>{level.toUpperCase()} RISK</span>
      {showScore !== undefined && (
        <span className="opacity-80 font-mono text-[11px]">({showScore})</span>
      )}
    </span>
  );
};
