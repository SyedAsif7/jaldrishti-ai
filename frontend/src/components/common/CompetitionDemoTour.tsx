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

  const totalSteps = 7;
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
        onNavigatePage('groundwater');
        onSelectDistrict('parbhani');
        break;
      case 5:
        onNavigatePage('analysis');
        onSelectDistrict('parbhani');
        break;
      case 6:
        onNavigatePage('alerts');
        onSelectDistrict('parbhani');
        break;
      case 7:
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
                  Competition Evaluation Tour
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
          {/* Step 1: Open the Marathwada Overview */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <span>Step 1 of {totalSteps}: Open the Marathwada Regional Overview</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Regional Water & Drought Intelligence Overview
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Marathwada faces recurring drought, acute rain-shadow deficits, rapid groundwater depletion, and fragile reservoir storage. JalDrishti AI unifies disparate meteorological, hydrogeological, and surface storage data across all 8 districts:
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
                  • Regional Average Risk Score: <strong>58.4 / 100 (High Risk)</strong><br />
                  • 2 Severe Districts (Beed, Dharashiv), 3 High (Jalna, Latur, Parbhani), 3 Moderate.
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Parbhani */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 2 of {totalSteps}: Select Parbhani District on GIS Map</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Focus District: Parbhani (Composite Risk Score: 59.9 / 100)
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                Parbhani has been selected on the GIS Choropleth map. The platform automatically synchronizes the selected district across all GIS polygon layers, indicators, and charts.
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

          {/* Step 3: Explain Rainfall Deviation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <CloudRain className="w-3.5 h-3.5 text-[#267D9D]" />
                <span>Step 3 of {totalSteps}: Explain Rainfall Deviation & SPI</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                IMD Climatology Departure & Dry-Spell Duration
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                In Parbhani, monsoon precipitation was <strong>514.8 mm</strong> compared to the 50-year normal Long Period Average (LPA) of <strong>774.2 mm</strong> (a <strong>-33.5% departure</strong>, classified by IMD as <em>Deficient</em>).
              </p>

              <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] space-y-2 text-xs">
                <div className="font-semibold text-[#25332F]">Hydrological Characteristics:</div>
                <ul className="space-y-1 text-[#68736E] text-[11px] list-disc pl-4">
                  <li><strong>23-day consecutive dry spell</strong> in August during critical kharif crop flowering.</li>
                  <li><strong>Standardized Precipitation Index (SPI-3):</strong> -1.42 (<em>Moderately Dry</em>).</li>
                  <li>Monthly departure shows June was normal (+12%), but July (-38%) and August (-44%) experienced severe monsoon failure.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Review Groundwater Stress */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Waves className="w-3.5 h-3.5 text-[#4A8B82]" />
                <span>Step 4 of {totalSteps}: Review Groundwater Stress & Extraction</span>
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
                    <strong className="text-[#A66628] text-sm">11.4 m bgl</strong>
                    <span className="text-[#8B9691] block text-[9px]">May observation well depth</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0]">
                    <span className="text-[#68736E] block text-[10px]">Post-Monsoon Depth</span>
                    <strong className="text-[#4A8B82] text-sm">7.8 m bgl</strong>
                    <span className="text-[#8B9691] block text-[9px]">Limited recharge rise</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#68736E] pt-1">
                  <strong>3 out of 9 talukas</strong> (Jintur, Pathri, Sailu) show critical stage of groundwater development exceeding 85% extraction.
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Show Drought-Risk Analysis & MCDA */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <Sliders className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 5 of {totalSteps}: Show Drought-Risk Analysis & Sensitivity</span>
              </div>
              <h4 className="text-lg font-bold text-[#25332F]">
                Transparent Multi-Criteria Decision Analysis (MCDA)
              </h4>
              <p className="text-xs text-[#68736E] leading-relaxed">
                The Composite Drought Risk Index (CRI) is completely explainable with normalized mathematical weights:
              </p>
              <div className="p-3 rounded-lg bg-[#FFFEFA] border border-[#E3DDD0] font-mono text-xs text-[#234F46] font-bold">
                CRI = (0.45 × Rainfall Deficit) + (0.35 × Groundwater Stress) + (0.20 × Reservoir Depletion)
              </div>
              <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] text-xs space-y-1 font-mono">
                <div className="text-[#25332F]">
                  Parbhani: (0.45 × 50.3) + (0.35 × 68.0) + (0.20 × 67.0) = <strong className="text-[#A66628]">59.9 / 100 (High Risk)</strong>
                </div>
                <div className="text-[11px] text-[#68736E]">
                  Evaluators can interactively adjust weights using the sliders to test different policy contingencies in real time.
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Display Water-Conservation Recommendations */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C7813C]" />
                <span>Step 6 of {totalSteps}: Water-Conservation Recommendations</span>
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
                    <strong>Rabi Micro-Irrigation Scheduling:</strong> Mandate alternate-furrow or drip irrigation in Jintur and Pathri talukas to save 35% irrigation quota.
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#EDF6FA] text-[#1C627C] border border-[#4EA3C3]/40 text-[10px] font-bold shrink-0">
                    Drinking Water
                  </span>
                  <div className="text-[11px] text-[#25332F]">
                    <strong>Lower Dudhna Live Quota Ring-Fencing:</strong> Reserve 100% of live storage for urban and rural drinking water schemes until next monsoon onset.
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/40 text-[10px] font-bold shrink-0">
                    GSDA Ground
                  </span>
                  <div className="text-[11px] text-[#25332F]">
                    <strong>Deep Borewell Moratorium:</strong> Enforce drilling restrictions under Maharashtra Groundwater Act 2009 in vulnerable watershed zones.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Generate a District Report */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#234F46] uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-[#234F46]" />
                <span>Step 7 of {totalSteps}: Generate District Dossier & Export</span>
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
                  <div>• Primary Dam: Lower Dudhna (33.0%)</div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-[#E3DDD0]">
                  <button
                    onClick={() => {
                      const url = getCsvDownloadUrl('parbhani');
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#234F46] hover:bg-[#1E433B] text-[#FFFEFA] font-bold text-xs shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Parbhani CSV</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFEFA] hover:bg-[#F5F2E9] text-[#25332F] border border-[#D1C9BA] font-semibold text-xs transition-colors"
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
