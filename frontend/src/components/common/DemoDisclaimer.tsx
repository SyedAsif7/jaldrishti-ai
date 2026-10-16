import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Language } from '../../types';
import { useTranslation } from '../../i18n/translations';

interface DemoDisclaimerProps {
  language: Language;
  compact?: boolean;
}

export const DemoDisclaimer: React.FC<DemoDisclaimerProps> = ({ language, compact = false }) => {
  const t = useTranslation(language);

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FBF5EE] border border-[#DE9954]/50 text-[#A66628] text-xs font-medium shadow-xs">
        <AlertCircle className="w-3.5 h-3.5 text-[#C7813C] shrink-0" />
        <span>{t.demoTag}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#FFFEFA] border border-[#DE9954]/40 p-4 shadow-sm mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#FBF5EE] text-[#C7813C] shrink-0 mt-0.5 border border-[#DE9954]/30">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-[#A66628] tracking-wider uppercase">
              {t.common.disclaimerHeading}
            </h4>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/40 rounded-full">
              {t.challengeTag}
            </span>
          </div>
          <p className="text-xs text-[#25332F] leading-relaxed">
            {t.common.disclaimerBody}
          </p>
          <div className="pt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#68736E] font-mono border-t border-[#F0EBE1] mt-2">
            <span>• Assessment: Multi-Criteria Decision Analysis (MCDA Composite Index)</span>
            <span>• Data Mode: Seed Simulation (No Live Telemetry API Claimed)</span>
            <span>• Target Geography: 8 Marathwada Districts, Maharashtra</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoDisclaimer;
