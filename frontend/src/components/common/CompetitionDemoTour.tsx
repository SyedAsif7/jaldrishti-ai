import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  CloudRain,
  Waves,
  Database,
  Brain,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { District, PageId, Language } from '../../types';
import { getCsvDownloadUrl } from '../../services/api';

interface CompetitionDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict: (id: string) => void;
  onNavigatePage: (page: PageId) => void;
  districts: District[];
  language: Language;
}

export const CompetitionDemoTour: React.FC<CompetitionDemoTourProps> = ({
  isOpen,
  onClose,
  onSelectDistrict,
  onNavigatePage,
  districts,
  language
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const totalSteps = 6;
  const parbhaniDistrict = districts.find(d => d.id === 'parbhani') || districts[0];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      applyStepActions(next);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      applyStepActions(prev);
    }
  };

  const applyStepActions = (step: number) => {
    switch (step) {
      case 1:
        onNavigatePage('overview');
        break;
      case 2:
        onSelectDistrict('parbhani');
        onNavigatePage('overview');
        break;
      case 3:
        onSelectDistrict('parbhani');
        onNavigatePage('analysis');
        break;
      case 4:
        onSelectDistrict('parbhani');
        onNavigatePage('map');
        break;
      case 5:
        onSelectDistrict('parbhani');
        onNavigatePage('forecast');
        break;
      case 6:
        onSelectDistrict('parbhani');
        onNavigatePage('reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 border-b border-navy-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Award className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Competition Demo Walkthrough
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DEMO DATA
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                Seva First Innovation Challenge 2026 · Case Study
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-navy-950 h-1.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-400 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          {/* Step 1: Regional & Innovation Context */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <span>Step 1 of {totalSteps}: Innovation Scope & Problem Statement</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Water Resilience for 8 Districts of Marathwada, Maharashtra
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Marathwada faces recurring drought, acute rain-shadow deficits, rapid groundwater depletion, and fragile reservoir storage. JalDrishti AI was conceived for the <strong>Seva First Innovation Challenge 2026</strong> as an individual technical innovation project to unify disparate meteorological, hydrogeological, and surface storage data into an explainable, decision-ready intelligence platform.
              </p>

              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-2 text-xs">
                <div className="font-semibold text-teal-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Three-Tier Data Architecture:
                </div>
                <ul className="space-y-1.5 text-slate-400 pl-4 list-disc text-[11px]">
                  <li><strong>Tier 1: Measured Observations</strong> — Historical IMD rainfall (2000–2024), GSDA water table depths, and WRD reservoir storage bulletins.</li>
                  <li><strong>Tier 2: Multi-Criteria Decision Analysis (MCDA)</strong> — Rule-based composite risk index with policy-calibrated, transparent weights.</li>
                  <li><strong>Tier 3: Validated Machine Learning</strong> — Supervised HistGradientBoostingRegressor and Ridge models with 95% confidence intervals and holdout benchmarks.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Parbhani Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5" />
                <span>Step 2 of {totalSteps}: Parbhani District Focus Case Study</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Focus District: Parbhani (High Drought Risk · 59.9/100)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We select <strong>Parbhani</strong> to demonstrate the platform’s localized multi-criteria analysis. Located in the Godavari basin, Parbhani exhibits moderate monsoon rainfall but severe late-monsoon depletion, high well extraction fractions, and critical storage depletion in the Lower Dudhna and Yeldari catchment.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-[10px] text-slate-400 uppercase">Rainfall Deficit</div>
                  <div className="text-lg font-extrabold text-amber-400 font-mono mt-1">
                    -{parbhaniDistrict.rainfall.deficit_percentage}%
                  </div>
                  <div className="text-[10px] text-slate-500">504mm vs 776mm normal</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-[10px] text-slate-400 uppercase">GW Stress Index</div>
                  <div className="text-lg font-extrabold text-orange-400 font-mono mt-1">
                    {parbhaniDistrict.groundwater.stress_index}/100
                  </div>
                  <div className="text-[10px] text-slate-500">68% wells depleted &gt;2m</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                  <div className="text-[10px] text-slate-400 uppercase">Dam Live Storage</div>
                  <div className="text-lg font-extrabold text-cyan-400 font-mono mt-1">
                    {parbhaniDistrict.reservoirs.aggregate_storage_pct}%
                  </div>
                  <div className="text-[10px] text-slate-500">~120 days reserve</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Multi-Criteria Risk Formula */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <span>Step 3 of {totalSteps}: Explainable MCDA Mathematical Model</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Transparent Multi-Criteria Scoring (No AI Blackbox)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than treating drought risk as an unexplainable neural network blackbox, JalDrishti AI employs a fully transparent, policy-calibrated linear combination:
              </p>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 font-mono text-xs text-teal-300 space-y-1.5">
                <div>Composite Risk Index (CRI) = (w1 × I_rain) + (w2 × I_gw) + (w3 × I_res)</div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-navy-800">
                  Parbhani Calculation: (0.45 × 52.5) + (0.35 × 74.0) + (0.20 × 62.0) = <strong>59.9 / 100 (High Risk)</strong>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                Decision-makers can adjust the policy weights ($w_1, w_2, w_3$) dynamically in the <strong>Drought Risk Analysis</strong> page to stress-test regional contingency plans.
              </div>
            </div>
          )}

          {/* Step 4: GIS Choropleth Mapping */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5" />
                <span>Step 4 of {totalSteps}: Verified Census GIS Mapping</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Administrative Boundaries & Dynamic Layer Switching
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The GIS Map renders high-resolution Census of India administrative boundaries for all 8 Marathwada districts. Notice:
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc">
                <li><strong>No Colliding Markers:</strong> Clean cartographic labels rendered directly inside each district's polygon without bulky overlapping boxes.</li>
                <li><strong>Layer Switcher:</strong> Switch between Composite Risk, Rainfall Deficit, Groundwater Stress, and Reservoir Storage views.</li>
                <li><strong>Basemaps:</strong> Toggle between Esri Dark Canvas, OpenStreetMap, and High-Resolution Satellite imagery.</li>
              </ul>
            </div>
          )}

          {/* Step 5: Validated ML Forecasting */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <Brain className="w-3.5 h-3.5" />
                <span>Step 5 of {totalSteps}: Supervised Machine Learning Outlook</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                1-Month & 3-Month Ahead Forecast with 95% Confidence Intervals
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Phase 3, we built and validated a machine learning forecasting engine for Parbhani:
              </p>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-teal-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-teal-300 font-semibold">
                  <span>Parbhani 1-Month Ahead Outlook:</span>
                  <span className="font-mono bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                    HistGradientBoostingRegressor
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>Predicted SPI-3: <strong className="text-white">-0.2 (Near Normal)</strong></div>
                  <div>95% CI Band: <strong className="font-mono text-cyan-300">[-1.18 to +0.78]</strong></div>
                  <div>Holdout Test MAE: <strong className="text-emerald-400">0.395 (+19.7% vs persistence)</strong></div>
                  <div>Drought Class F1: <strong className="text-teal-300">0.820</strong></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                <strong>Zero Temporal Leakage:</strong> Training strictly on observations $\le 2018$; testing on holdout years $\ge 2019$.
              </div>
            </div>
          )}

          {/* Step 6: Targeted Contingency & Reports */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5" />
                <span>Step 6 of {totalSteps}: Actionable Contingency & Dossier Export</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Decision Support & One-Click CSV Export
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                JalDrishti AI translates indicators into domain-specific recommendations for district collectors and water officers:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">Agriculture</span>
                  <span className="text-slate-300 text-[11px]">Enforce micro-irrigation scheduling in Pathri & Jintur blocks for rabi pulses.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">Drinking Water</span>
                  <span className="text-slate-300 text-[11px]">Reserve Yeldari dam live capacity strictly for rural piped water schemes.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    const url = getCsvDownloadUrl('parbhani');
                    window.open(url, '_blank');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Parbhani CSV Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-navy-950/90 border-t border-navy-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 disabled:opacity-40 disabled:hover:bg-navy-800 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400 font-medium">
            Step {currentStep} of {totalSteps}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition-colors"
          >
            <span>{currentStep === totalSteps ? 'Finish Walkthrough' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompetitionDemoTour;
