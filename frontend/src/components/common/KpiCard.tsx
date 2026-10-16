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
  variant?: 'default' | 'danger' | 'warning' | 'teal' | 'cyan' | 'agri';
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
  // Environmental Card Surface Styling
  const variantStyles = {
    default: {
      card: 'border-[#E3DDD0] bg-[#FFFEFA] hover:border-[#D1C9BA]',
      iconWrap: 'bg-[#F2F7F4] text-[#234F46]',
      accentBar: 'bg-[#234F46]'
    },
    danger: {
      card: 'border-[#F5DAD5] bg-[#FFFEFA] hover:border-[#CE6755]/50',
      iconWrap: 'bg-[#FAF0EE] text-[#B64D3C]',
      accentBar: 'bg-[#B64D3C]'
    },
    warning: {
      card: 'border-[#F6E6D5] bg-[#FFFEFA] hover:border-[#DE9954]/50',
      iconWrap: 'bg-[#FBF5EE] text-[#C7813C]',
      accentBar: 'bg-[#C7813C]'
    },
    teal: {
      card: 'border-[#D8EDE8] bg-[#FFFEFA] hover:border-[#6BA79F]/50',
      iconWrap: 'bg-[#EFF7F5] text-[#4A8B82]',
      accentBar: 'bg-[#4A8B82]'
    },
    cyan: {
      card: 'border-[#D9EEF7] bg-[#FFFEFA] hover:border-[#4EA3C3]/50',
      iconWrap: 'bg-[#EDF6FA] text-[#267D9D]',
      accentBar: 'bg-[#267D9D]'
    },
    agri: {
      card: 'border-[#E5EDD9] bg-[#FFFEFA] hover:border-[#8FA86E]/50',
      iconWrap: 'bg-[#F4F7EF] text-[#728A53]',
      accentBar: 'bg-[#728A53]'
    }
  }[variant];

  return (
    <div className={`relative rounded-xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md ${variantStyles.card}`}>
      {/* Top Subtle Color Accent Bar */}
      <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full ${variantStyles.accentBar} opacity-60`} />

      <div className="flex items-start justify-between gap-3 mb-2 pt-1">
        <span className="text-[11px] font-bold text-[#68736E] tracking-wider uppercase font-sans">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${variantStyles.iconWrap} transition-colors`}>
          <Icon className="w-4 h-4 shrink-0" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1.5">
        <span className="text-3xl font-extrabold text-[#25332F] tracking-tight font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-[#68736E]">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-[#68736E] pt-2 border-t border-[#F0EBE1]">
        <span className="truncate pr-2">{subtext}</span>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
    </div>
  );
};

export default KpiCard;
