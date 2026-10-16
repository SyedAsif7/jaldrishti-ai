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
  Sliders,
  Layers,
  ArrowRight,
  FileText,
  Landmark,
  Compass,
  Printer
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

  const totalSteps = 8;
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

  const jumpToStep = (step: number) => {
    setCurrentStep(step);
    applyStepActions(step);
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
        onNavigatePage('groundwater');
        onSelectDistrict('parbhani');
        break;
      case 5:
        onNavigatePage('reservoirs');
        onSelectDistrict('parbhani');
        break;
      case 6:
        onNavigatePage('analysis');
        onSelectDistrict('parbhani');
        break;
      case 7:
        onNavigatePage('alerts');
        onSelectDistrict('parbhani');
        break;
      case 8:
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
                  Explore Demo · 8-Step Evaluator Walkthrough
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#1B3F38] text-[#8FA86E] border border-[#2D6459] rounded">
                  Parbhani District
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#FFFEFA] mt-0.5">
                JalDrishti AI · Guided Demonstration Tour
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A3C4BC] hover:text-white hover:bg-[#1E433B] transition-colors cursor-pointer"
            title="Close Demo Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Badges */}
        <div className="px-6 py-2 bg-[#F5F2E9] border-b border-[#E3DDD0] flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <button
                key={stepNum}
                onClick={() => jumpToStep(stepNum)}
                className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#234F46] text-[#FFFEFA]'
                    : isCompleted
                    ? 'bg-[#E3DDD0] text-[#25332F]'
                    : 'text-[#85AAA0] hover:bg-[#EAE4D7]'
                }`}
              >
                {stepNum}
              </button>
            );
          })}
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
          {/* Step 1: Marathwada drought overview */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <span>Step 1 of {totalSteps}: Marathwada Drought Overview</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Regional Water & Drought Intelligence Overview
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Marathwada faces recurring structural drought, rain-shadow precipitation deficits, rapid groundwater table depletion, and depleted reservoir storages. JalDrishti AI unifies disparate meteorological, hydrogeological, and surface storage data across all 8 districts:
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#234F46] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#728A53]" />
                  Eight Monitored Districts of Marathwada:
                </div>
                <div className="text-[11px] text-[#68736E] leading-relaxed">
                  Chhatrapati Sambhajinagar · Jalna · Beed · Dharashiv · Latur · Nanded · Parbhani · Hingoli (76 talukas, Godavari basin).
                </div>
                <div className="pt-1 text-[11px] text-[#68736E] border-t border-[#E3DDD0]">
                  • Regional Average Risk Score: <strong>61.6 / 100 (High Risk)</strong><br />
                  • 2 Severe Districts (Beed, Dharashiv), 3 High (Jalna, Latur, Parbhani), 3 Moderate.
                </div>
              </div>
            </div>
          )}

          {/* Step 2: District selection – Parbhani */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 2 of {totalSteps}: District Selection – Parbhani</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Focus District: Parbhani (Composite Risk Score: 59.9 / 100)
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Parbhani is our proposed pilot district. Selecting Parbhani immediately re-filters all GIS polygon layers, indicators, and charts synchronously across the platform.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Rainfall Deficit</div>
                  <div className="text-lg font-extrabold text-[#C7813C] font-mono mt-1">
                    -{parbhaniDistrict.rainfall.deficit_percentage}%
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">512.6mm vs 774mm</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Groundwater Stress</div>
                  <div className="text-lg font-extrabold text-[#C7813C] font-mono mt-1">
                    {parbhaniDistrict.groundwater.stress_index}/100
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">10.5 m bgl depth</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                  <div className="text-[10px] text-[#68736E] uppercase">Dam Storage</div>
                  <div className="text-lg font-extrabold text-[#267D9D] font-mono mt-1">
                    {parbhaniDistrict.reservoirs.aggregate_storage_pct}%
                  </div>
                  <div className="text-[10px] text-[#68736E] mt-0.5">~145 days security</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Rainfall deficit and historical comparison */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <CloudRain className="w-3.5 h-3.5 text-[#267D9D]" />
                <span>Step 3 of {totalSteps}: Rainfall Deficit & Historical Comparison</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                IMD Climatology Departure & WMO SPI-3/6
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                In Parbhani, monsoon precipitation was <strong>512.6 mm</strong> compared to the IMD 30-year Long Period Average normal of <strong>774.0 mm</strong> (a <strong>-33.8% departure</strong>, classified by IMD as <em>Deficient</em>).
              </p>

              <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#25332F]">Hydrological Indicators:</div>
                <ul className="space-y-1 text-[#68736E] text-[11px] list-disc pl-4">
                  <li><strong>Standardized Precipitation Index (SPI-3):</strong> -1.18 (<em>Moderately Dry / Agricultural Stress</em>).</li>
                  <li><strong>21-day dry spell</strong> in August during critical kharif crop flowering.</li>
                  <li>Historical comparison shows 3 consecutive sub-normal monsoon cycles across 2021–2024.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Groundwater stress indicators */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Waves className="w-3.5 h-3.5 text-[#4A8B82]" />
                <span>Step 4 of {totalSteps}: Groundwater Stress Indicators</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Aquifer Depletion & Critical Talukas
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Parbhani’s basalt aquifer exhibits high extraction pressure and limited storativity. The water table fluctuates significantly between post-monsoon and summer:
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0]">
                    <span className="text-[#68736E] block text-[10px]">Pre-Monsoon Depth</span>
                    <strong className="text-[#A66628] text-sm">13.4 m bgl</strong>
                    <span className="text-[#8B9691] block text-[9px]">May observation well depth</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0]">
                    <span className="text-[#68736E] block text-[10px]">Post-Monsoon Depth</span>
                    <strong className="text-[#4A8B82] text-sm">9.2 m bgl</strong>
                    <span className="text-[#8B9691] block text-[9px]">Limited recharge rise</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#68736E] pt-1">
                  <strong>3 out of 9 talukas</strong> (Pathri, Manwath, Purna) show critical stage of extraction exceeding 84%.
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Reservoir water-storage information */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Database className="w-3.5 h-3.5 text-[#267D9D]" />
                <span>Step 5 of {totalSteps}: Reservoir Water-Storage Information</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Major Irrigation Project Storage & Drinking Buffers
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Surface water reserves across major regional irrigation projects are tracked daily from Water Resources Department (WRD) bulletins:
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#234F46] flex items-center justify-between">
                  <span>Lower Dudhana Project (Selu):</span>
                  <span className="font-mono text-[#A66628] font-bold">36.8% Live Storage</span>
                </div>
                <p className="text-[#68736E] text-[11px]">
                  Gross capacity of 7,950 Mcft with 36.8% live storage. Combined with Karpara Medium Dam (41.0%), aggregate district storage stands at 38.0%, providing an estimated 145 drinking water security days.
                </p>
                <div className="pt-1.5 border-t border-[#E3DDD0] text-[11px] text-[#68736E]">
                  Preemptive canal water budgeting prevents premature summer dead-storage depletion.
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Explainable drought-risk assessment */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Sliders className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 6 of {totalSteps}: Explainable Drought-Risk Assessment</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Transparent Multi-Criteria Decision Analysis (MCDA)
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                The Composite Drought Risk Index (0–100) is completely deterministic and explainable with normalized mathematical weights:
              </p>
              <div className="p-3 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0] font-mono text-xs text-[#234F46] font-bold">
                Score = (0.35 × Rainfall) + (0.30 × Groundwater) + (0.25 × Reservoir) + (0.10 × Soil Moisture)
              </div>
              <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] text-xs space-y-1 font-mono">
                <div className="text-[#25332F]">
                  Parbhani: (0.35 × 49.5) + (0.30 × 72.0) + (0.25 × 62.0) + (0.10 × 45.0) = <strong className="text-[#A66628]">59.9 / 100 (High Risk)</strong>
                </div>
                <div className="text-[11px] text-[#68736E]">
                  Evaluators can interactively adjust weights using the sensitivity sliders to test different policy contingencies in real time.
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Recommended water-management actions */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C7813C]" />
                <span>Step 7 of {totalSteps}: Recommended Water-Management Actions</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Targeted Inter-Departmental Guidance for Parbhani
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Actionable recommendations mapped to specific district departments:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 text-[10px] font-bold shrink-0">
                    Agriculture
                  </span>
                  <div className="text-[11px] text-[#25332F]">
                    <strong>Rabi Micro-Irrigation Scheduling:</strong> Mandate alternate-furrow or drip irrigation in Selu and Pathri talukas to conserve winter irrigation quota.
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#EDF6FA] text-[#1C627C] border border-[#4EA3C3]/40 text-[10px] font-bold shrink-0">
                    Drinking Water
                  </span>
                  <div className="text-[11px] text-[#25332F]">
                    <strong>Lower Dudhana Quota Ring-Fencing:</strong> Prioritize 100% of live storage for urban and rural drinking water schemes until monsoon onset.
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/40 text-[10px] font-bold shrink-0">
                    GSDA Ground
                  </span>
                  <div className="text-[11px] text-[#25332F]">
                    <strong>Artificial Recharge Shafts:</strong> Construct 42 priority percolation tanks along Dudhna sub-basins under Jalyukt Shivar Abhiyan.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: District report generation */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 8 of {totalSteps}: District Report Generation & Export</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Decision Support Dossier & Real-Time CSV Export
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                JalDrishti AI provides one-click exportable dossiers for district collectors, planning committees, and state disaster authorities:
              </p>

              <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-3 text-xs">
                <div className="text-[#25332F] font-semibold">Parbhani Hydro-Intelligence Summary Dossier:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>• Monitored Talukas: 9</div>
                  <div>• Total Area: 6,511 sq km</div>
                  <div>• Population: 18.36 Lakhs</div>
                  <div>• Primary Dam: Lower Dudhana (36.8%)</div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-[#E3DDD0]">
                  <button
                    onClick={() => {
                      const url = getCsvDownloadUrl('parbhani');
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#234F46] hover:bg-[#1E433B] text-[#FFFEFA] font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Parbhani CSV</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFEFA] hover:bg-[#F5F2E9] text-[#25332F] border border-[#D1C9BA] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#68736E]" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#F5F2E9] border-t border-[#E3DDD0] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFEFA] border border-[#D1C9BA] hover:bg-[#ECE6D8] text-[#25332F] disabled:opacity-40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-[#68736E] font-medium">
            Step {currentStep} of {totalSteps}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#234F46] hover:bg-[#1E433B] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
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
