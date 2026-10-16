import React from 'react';
import { RiskSeverity } from '../../types';

interface RiskBadgeProps {
  level: RiskSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showScore?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showScore }) => {
  // Environmental Risk Palette
  let bg = 'bg-[#F4F7EF] text-[#5A6E41] border-[#728A53]/40'; // Low: Olive green
  let dotBg = 'bg-[#728A53]';

  if (level === 'Severe') {
    bg = 'bg-[#FAF0EE] text-[#B64D3C] border-[#B64D3C]/40'; // Severe: Terracotta red
    dotBg = 'bg-[#B64D3C]';
  } else if (level === 'High') {
    bg = 'bg-[#FBF5EE] text-[#A66628] border-[#C7813C]/40'; // High: Earth ochre
    dotBg = 'bg-[#C7813C]';
  } else if (level === 'Moderate') {
    bg = 'bg-[#FFF9F2] text-[#B87028] border-[#DE9954]/40'; // Moderate: Warm amber
    dotBg = 'bg-[#DE9954]';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-xs sm:text-sm px-3 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide shadow-xs ${sizeClasses} ${bg}`}>
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotBg}`} />
      <span className="font-semibold">{level.toUpperCase()} RISK</span>
      {showScore !== undefined && (
        <span className="opacity-90 font-mono text-[11px] font-bold">({showScore})</span>
      )}
    </span>
  );
};

export default RiskBadge;
