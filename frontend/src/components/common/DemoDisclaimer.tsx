import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{t.demoTag}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-navy-900/90 border border-amber-500/30 p-4 shadow-lg backdrop-blur mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-amber-300 tracking-wide uppercase">
              {t.common.disclaimerHeading}
            </h4>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
              {t.challengeTag}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.common.disclaimerBody}
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
            <span>• Method: Multi-Criteria Composite Index (Not Trained ML Model)</span>
            <span>• Data Mode: Seed Simulation (No Live Telemetry API Claimed)</span>
            <span>• Status: Pre-Deployment Research Prototype</span>
          </div>
        </div>
      </div>
    </div>
  );
};
