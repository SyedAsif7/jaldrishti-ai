import React from 'react';
import {
  Landmark,
  Target,
  CheckCircle2,
  MapPin,
  TrendingUp,
  AlertCircle,
  Users,
  Compass,
  Award,
  ArrowRight
} from 'lucide-react';
import { Language, PageId } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';

interface ProjectOverviewViewProps {
  language: Language;
  onNavigatePage: (page: PageId) => void;
}

export const ProjectOverviewView: React.FC<ProjectOverviewViewProps> = ({
  language,
  onNavigatePage
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <DemoDisclaimer language={language} compact />

      {/* Header Banner */}
      <div className="bg-[#234F46] p-6 rounded-2xl border border-[#1E433B] text-[#FFFEFA] shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Landmark className="w-5 h-5 text-[#8FA86E]" />
          <span className="text-[11px] font-bold text-[#A3C4BC] tracking-wider uppercase">
            Seva First Innovation Challenge 2026 · Maharashtra Zone
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#FFFEFA] tracking-tight">
          {language === 'mr' ? 'प्रकल्प आढावा व परभणी पायलट प्रस्ताव' : 'Project Overview & Parbhani Pilot Proposal'}
        </h1>
        <p className="text-xs text-[#C2DDD6] mt-1.5 max-w-3xl leading-relaxed">
          {language === 'mr'
            ? 'मराठवाडा दुष्काळ समस्या, अभिप्रेत लाभार्थी, कार्यरत प्रोटोटाइप क्षमता आणि ९०-दिवसीय शासकीय पायलट योजना.'
            : 'Operational context, target beneficiaries, verified TRL-6 prototype capabilities, proposed 90-day Parbhani pilot, and statewide scalability plan.'}
        </p>
      </div>

      {/* Grid: Problem & Beneficiaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. The Water-Management Problem */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#FAF0E6] text-[#C7813C]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">1. The Water Management Problem</h2>
              <span className="text-[11px] text-[#68736E]">Structural Drought & Institutional Silos</span>
            </div>
          </div>
          <div className="text-xs text-[#68736E] leading-relaxed space-y-2">
            <p>
              Marathwada spans 8 districts, 76 talukas, and 18.7M citizens in the Western Ghats rain shadow, averaging only 650–880 mm annual precipitation over Deccan basalt hard-rock formations with low aquifer storage.
            </p>
            <p>
              Right now, disaster management remains strictly <strong className="text-[#25332F]">reactive rather than predictive</strong>. Critical data sits in separate silos: rainfall (IMD), groundwater (GSDA), and reservoir storage (WRD). Official drought declarations occur retrospectively in late autumn—after Kharif crops fail and aquifers dry up—costing hundreds of crores in emergency water tankers and cattle camps.
            </p>
          </div>
        </div>

        {/* 2. Target Beneficiaries */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#EBF7F5] text-[#234F46]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">2. Target Beneficiaries</h2>
              <span className="text-[11px] text-[#68736E]">Government Authorities & Citizens</span>
            </div>
          </div>
          <ul className="text-xs text-[#68736E] leading-relaxed space-y-2">
            <li>
              <strong className="text-[#25332F]">District Collectors & DDMAs:</strong> Unified operational picture for objective water budgeting, Section 144 well reservations, and tanker sanctions.
            </li>
            <li>
              <strong className="text-[#25332F]">District Agriculture Officers (DSAOs):</strong> Timely crop moisture advisories for cotton, soybean, and pulses.
            </li>
            <li>
              <strong className="text-[#25332F]">Irrigation Engineers (WRD):</strong> Coordinated dam canal releases balancing municipal drinking buffers.
            </li>
            <li>
              <strong className="text-[#25332F]">GSDA Geologists:</strong> Targeting artificial recharge shafts and percolation tanks under Jalyukt Shivar Abhiyan.
            </li>
            <li>
              <strong className="text-[#25332F]">Smallholder Farmers & Habitants:</strong> Preservation of agrarian livelihoods and steady drinking water supplies.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Existing Working Prototype Capabilities */}
      <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1] flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F4F7EF] text-[#728A53]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">3. Existing Prototype Capabilities</h2>
              <span className="text-[11px] text-[#68736E]">Technology Readiness Level 6 (TRL-6)</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#F4F7EF] border border-[#728A53]/30 text-[#728A53] font-bold text-[11px]">
            41 / 41 Backend Tests Passing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">8-District GIS Choropleth</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Census-aligned EPSG:4326 boundaries with interactive risk-tiered color coding.
            </p>
          </div>
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">WMO SPI-3/6 Engine</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Automated 2-parameter Gamma MLE fitting for agricultural and hydrological drought.
            </p>
          </div>
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">Deterministic MCDA Risk</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Transparent, audited 4-component index combining rainfall, groundwater, and dams.
            </p>
          </div>
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">Chronological ML Regressor</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Evaluated with zero future-data leakage; 35.7% error reduction over persistence.
            </p>
          </div>
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">Rule-Based Advisories</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Contextual guidance for irrigation rationing, tanker supply, and tank desilting.
            </p>
          </div>
          <div className="p-3 bg-[#F5F2E9] rounded-xl border border-[#E3DDD0]">
            <h3 className="font-bold text-[#25332F]">One-Click CSV / Dossiers</h3>
            <p className="text-[#68736E] text-[11px] mt-1">
              Structured tabular export and printable executive briefs for disaster cells.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Proposed 90-Day Parbhani Pilot & Scalability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parbhani Pilot */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#EBF4F6] text-[#267D9D]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">4. Proposed 90-Day Parbhani Pilot</h2>
              <span className="text-[11px] text-[#68736E]">Proof-of-Concept Field Deployment</span>
            </div>
          </div>
          <div className="text-xs text-[#68736E] leading-relaxed space-y-2">
            <p>
              We propose deploying JalDrishti AI across Parbhani’s 9 talukas (*Parbhani, Gangakhed, Sonpeth, Pathri, Manwath, Palam, Selu, Jintur, Purna*):
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-[#25332F]">Month 1:</strong> Data connectors for Mahavedh AWS, GSDA observation wells, and WRD reservoir storage; baseline calibration.</li>
              <li><strong className="text-[#25332F]">Month 2:</strong> Shadow run alongside official Maharashtra Drought Manual assessments in the Collectorate; Tahsildar training.</li>
              <li><strong className="text-[#25332F]">Month 3:</strong> Lead-time and accuracy verification; delivery of State Handover Dossier.</li>
            </ul>
            <div className="p-2.5 bg-[#F5F2E9] rounded-lg text-[11px] font-semibold text-[#234F46] mt-2">
              Itemized Pilot Investment: ₹14,50,000 (Software, Ingestion & Field Training)
            </div>
          </div>
        </div>

        {/* Scalability Across Maharashtra */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#F4F7EF] text-[#728A53]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">5. Expansion Across Maharashtra</h2>
              <span className="text-[11px] text-[#68736E]">Standardized Statewide Architecture</span>
            </div>
          </div>
          <div className="text-xs text-[#68736E] leading-relaxed space-y-2">
            <p>
              JalDrishti AI is built on standard state administrative codes (Division $\rightarrow$ District $\rightarrow$ Taluka $\rightarrow$ Circle):
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong className="text-[#25332F]">Marathwada Division:</strong> Rapid expansion to all 8 districts following the Parbhani pilot.
              </li>
              <li>
                <strong className="text-[#25332F]">Drought-Prone Western Maharashtra:</strong> Plug-and-play expansion to Solapur, Ahmednagar, and Sangli simply by loading regional GeoJSON layers.
              </li>
              <li>
                <strong className="text-[#25332F]">Zero Vendor Lock-In:</strong> Fully open-source stack (FastAPI, React, Leaflet, Scikit-learn) ready for handover to Maharashtra State Data Centre (MahaGov Cloud).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Legal & Academic Integrity Notice */}
      <div className="p-5 rounded-2xl bg-[#F5F2E9] border border-[#D1C9BA] text-xs text-[#25332F] space-y-1.5">
        <div className="flex items-center gap-2 text-[#234F46] font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Evaluation Notice & Institutional Transparency</span>
        </div>
        <p className="text-[#68736E] leading-relaxed">
          This system is an individual technical innovation challenge entry developed for the <em>Seva First Innovation Challenge 2026, Government of Maharashtra</em>. The Parbhani pilot represents a proposed implementation plan submitted for technical evaluation and does not assert formal government partnership or signed contract prior to official challenge sanction.
        </p>
      </div>
    </div>
  );
};

export default ProjectOverviewView;
