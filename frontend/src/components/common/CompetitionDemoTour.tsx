import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  CloudRain,
  Waves,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  FileText,
  Landmark,
  Compass
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
        onSelectDistrict('all');
        break;
      case 2:
        onNavigatePage('map');
        onSelectDistrict('parbhani');
        break;
      case 3:
        onNavigatePage('rainfall');
        onSelectDistrict('parbhani');
        break;
      case 4:
        onNavigatePage('forecast');
        onSelectDistrict('parbhani');
        break;
      case 5:
        onNavigatePage('analysis');
        onSelectDistrict('parbhani');
        break;
      case 6:
        onNavigatePage('reports');
        onSelectDistrict('parbhani');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112823]/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-[#FFFEFA] border border-[#D1C9BA] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#234F46] text-[#FFFEFA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1B3F38] text-[#8FA86E] border border-[#2D6459]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3C4BC]">
                  Evaluator Walkthrough
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#1B3F38] text-[#8FA86E] border border-[#2D6459] rounded">
                  Parbhani Case Study
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#FFFEFA] mt-0.5">
                Seva First Innovation Challenge 2026 · Interactive Demonstration
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A3C4BC] hover:text-white hover:bg-[#1E433B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E8E2D5] h-1.5">
          <div
            className="bg-[#234F46] h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-[#25332F]">
          {/* Step 1: Regional & Innovation Context */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <span>Step 1 of {totalSteps}: Innovation Scope & Problem Statement</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Drought Resilience for 8 Districts of Marathwada, Maharashtra
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Marathwada faces recurring drought, acute rain-shadow deficits, rapid groundwater depletion, and fragile reservoir storage. JalDrishti AI was conceived for the <strong>Seva First Innovation Challenge 2026</strong> as an individual technical innovation project to unify disparate meteorological, hydrogeological, and surface storage data into an explainable, decision-ready intelligence platform.
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#234F46] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#728A53]" />
                  Three-Tier Environmental Intelligence Architecture:
                </div>
                <ul className="space-y-1.5 text-[#68736E] pl-4 list-disc text-[11px]">
                  <li><strong>Tier 1: Measured Observations</strong> — Historical IMD rainfall (2000–2024), GSDA water table depths, and WRD reservoir storage records.</li>
                  <li><strong>Tier 2: Multi-Criteria Decision Analysis (MCDA)</strong> — Rule-based composite risk index with policy-calibrated, transparent weights.</li>
                  <li><strong>Tier 3: Validated Machine Learning</strong> — Supervised HistGradientBoostingRegressor and Ridge models with 95% confidence intervals and holdout benchmarks.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Parbhani Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 2 of {totalSteps}: Parbhani District Focus Case Study</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Focus District: Parbhani (High Drought Risk · 59.9/100)
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                We select <strong>Parbhani</strong> to demonstrate the platform’s localized multi-criteria analysis. Located in the Godavari basin, Parbhani exhibits moderate monsoon rainfall but severe late-monsoon depletion, high well extraction fractions, and critical storage depletion in the Lower Dudhna and Yeldari catchment.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Rainfall Deficit</div>
                  <div className="text-lg font-extrabold text-[#C7813C] font-mono mt-1">
                    -{parbhaniDistrict.rainfall.deficit_percentage}%
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">514mm vs 774mm</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Groundwater Stress</div>
                  <div className="text-lg font-extrabold text-[#C7813C] font-mono mt-1">
                    {parbhaniDistrict.groundwater.stress_index}/100
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">85% extraction stage</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Dam Live Storage</div>
                  <div className="text-lg font-extrabold text-[#267D9D] font-mono mt-1">
                    {parbhaniDistrict.reservoirs.aggregate_storage_pct}%
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">~120 days reserve</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Rainfall Deficit Analysis */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <CloudRain className="w-3.5 h-3.5 text-[#267D9D]" />
                <span>Step 3 of {totalSteps}: Hydrological Rainfall Intelligence</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                IMD Climatology Departure & SPI Index
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Parbhani’s monsoon actual was <strong>514.8 mm</strong> against a 50-year normal of <strong>774.2 mm</strong> (<strong>-33.5% departure</strong>). IMD standard classification: <em>Deficient</em>.
              </p>

              <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#25332F]">Key Hydrological Observations:</div>
                <ul className="space-y-1 text-[#68736E] text-[11px] list-disc pl-4">
                  <li>August saw a <strong>23-day dry spell</strong> during critical kharif pod development.</li>
                  <li>3-Month Standardized Precipitation Index (SPI-3): <strong>-1.42</strong> (<em>Moderately Dry</em>).</li>
                  <li>Cumulative monsoon line diverged from normal climatology beginning week 28.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Machine Learning Forecast */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 4 of {totalSteps}: Statistical SPI & Machine Learning Forecasting</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Strict Chronological Split · Zero Data Leakage
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                JalDrishti AI uses real statistical hydrology and machine learning:
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0]">
                    <span className="text-[#68736E] block text-[10px]">1-Month Outlook (SPI-3)</span>
                    <strong className="text-[#C7813C] text-sm">-1.38 ± 0.35</strong>
                    <span className="text-[#68736E] block text-[9px]">HistGradientBoostingRegressor</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0]">
                    <span className="text-[#68736E] block text-[10px]">3-Month Outlook (SPI-3)</span>
                    <strong className="text-[#DE9954] text-sm">-1.12 ± 0.42</strong>
                    <span className="text-[#68736E] block text-[9px]">Ridge Linear Baseline</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#68736E] pt-1">
                  Validated on 2019–2024 test partition without data leakage. +18.6% error reduction over historical persistence.
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Multi-Criteria Sensitivity */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Compass className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 5 of {totalSteps}: Transparent MCDA Sensitivity Analysis</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Deterministic Formula with Interactive Policy Weights
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Composite Risk Score is not a black-box model. It uses Multi-Criteria Decision Analysis:
              </p>
              <div className="p-3 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0] font-mono text-xs text-[#25332F]">
                Risk = (0.45 × Rainfall Deficit) + (0.35 × Groundwater Stress) + (0.20 × Reservoir Depletion)
              </div>
              <p className="text-xs text-[#68736E]">
                Evaluators and policy makers can interactively test different weight configurations in the <em>District Comparison & Risk Analysis</em> module to simulate drought scenarios under varying policy priorities.
              </p>
            </div>
          )}

          {/* Step 6: Actionable Contingency & Reports */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 6 of {totalSteps}: Actionable Contingency & Dossier Export</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Decision Support & One-Click CSV Export
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                JalDrishti AI translates indicators into domain-specific recommendations for district collectors and water officers:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 text-[10px] font-bold">Agriculture</span>
                  <span className="text-[#25332F] text-[11px]">Enforce micro-irrigation scheduling in Pathri & Jintur blocks for rabi pulses.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#EDF6FA] text-[#1C627C] border border-[#4EA3C3]/40 text-[10px] font-bold">Drinking Water</span>
                  <span className="text-[#25332F] text-[11px]">Reserve Yeldari dam live capacity strictly for rural piped water schemes.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    const url = getCsvDownloadUrl('parbhani');
                    window.open(url, '_blank');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#234F46] hover:bg-[#1E433B] text-[#FFFEFA] font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Parbhani CSV Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#F5F2E9] border-t border-[#E3DDD0] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFEFA] border border-[#D1C9BA] hover:bg-[#ECE6D8] text-[#25332F] disabled:opacity-40 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-[#68736E] font-medium">
            Step {currentStep} of {totalSteps}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#234F46] hover:bg-[#1E433B] text-white text-xs font-bold shadow-xs transition-colors"
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
