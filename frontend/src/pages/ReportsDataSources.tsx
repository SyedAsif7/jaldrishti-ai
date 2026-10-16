import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Database,
  ExternalLink,
  BookOpen,
  Milestone,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { District, RegionalSummary, Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';
import { getCsvDownloadUrl } from '../services/api';

interface ReportsDataSourcesProps {
  districts: District[];
  summary: RegionalSummary;
  selectedDistrict: District | null;
  language: Language;
}

export const ReportsDataSources: React.FC<ReportsDataSourcesProps> = ({
  districts,
  summary,
  selectedDistrict,
  language
}) => {
  const t = useTranslation(language);

  const handleDownloadCsv = (districtId?: string) => {
    const url = getCsvDownloadUrl(districtId);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#234F46]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.reports}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'जिल्हास्तरीय माहितीपत्रक निर्यात, डेटा डिक्शनरी आणि भावी विकास रोडमॅप.'
              : 'Exportable administrative dossiers, source methodology specifications, and production development roadmap.'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadCsv()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#234F46] hover:bg-[#1E433B] text-[#FFFEFA] font-bold text-xs transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download All Districts CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFEFA] hover:bg-[#F5F2E9] text-[#25332F] border border-[#D1C9BA] font-semibold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#68736E]" />
            <span>Print Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Dossier Preview */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EBE1]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#234F46] tracking-wider">
              Executive Dossier Preview
            </span>
            <h2 className="text-lg font-bold text-[#25332F]">
              {selectedDistrict ? `${selectedDistrict.name} District Water Profile` : 'Marathwada Regional Water Dossier'}
            </h2>
          </div>
          {selectedDistrict && (
            <button
              onClick={() => handleDownloadCsv(selectedDistrict.id)}
              className="text-xs text-[#234F46] hover:text-[#17362F] flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedDistrict.name} CSV</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <span className="text-[#68736E] block text-[11px]">Region Scope</span>
            <span className="font-bold text-[#25332F]">8 Districts (Marathwada)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <span className="text-[#68736E] block text-[11px]">Total Area</span>
            <span className="font-bold text-[#25332F]">{summary.total_area_sq_km.toLocaleString()} sq km</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <span className="text-[#68736E] block text-[11px]">Total Population</span>
            <span className="font-bold text-[#25332F]">{summary.total_population.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <span className="text-[#68736E] block text-[11px]">Average Risk Score</span>
            <span className="font-bold text-[#A66628] font-mono text-sm">{summary.average_risk_score} / 100</span>
          </div>
        </div>
      </div>

      {/* Data Sources and Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <div className="flex items-center gap-2 text-[#267D9D] mb-3">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#25332F]">Meteorological Baseline</h3>
          </div>
          <p className="text-xs text-[#68736E] leading-relaxed mb-3">
            Modeled on India Meteorological Department (IMD) 50-year Long Period Average (LPA) standards and Mahavedh automated station datasets.
          </p>
          <ul className="text-[11px] text-[#68736E] space-y-1 font-mono">
            <li>• Standard: 1971–2020 LPA reference</li>
            <li>• Frequency: Monthly & Cumulative</li>
            <li>• Metric: % Departure from Normal</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <div className="flex items-center gap-2 text-[#4A8B82] mb-3">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#25332F]">Groundwater Hydrology</h3>
          </div>
          <p className="text-xs text-[#68736E] leading-relaxed mb-3">
            Modeled after Groundwater Surveys & Development Agency (GSDA) and Central Ground Water Board (CGWB) observation wells in basalt aquifers.
          </p>
          <ul className="text-[11px] text-[#68736E] space-y-1 font-mono">
            <li>• Metric: Meters below ground level (m bgl)</li>
            <li>• Fall vs 5-year decadal mean</li>
            <li>• Well depletion fraction (&gt;2m drop)</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <div className="flex items-center gap-2 text-[#267D9D] mb-3">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#25332F]">Surface Reservoirs</h3>
          </div>
          <p className="text-xs text-[#68736E] leading-relaxed mb-3">
            Modeled on Water Resources Department (WRD), Government of Maharashtra daily reservoir storage bulletins.
          </p>
          <ul className="text-[11px] text-[#68736E] space-y-1 font-mono">
            <li>• Major dams: Jayakwadi, Majalgaon, Yeldari</li>
            <li>• Metric: % Live storage vs gross capacity</li>
            <li>• Dead storage threshold alerts</li>
          </ul>
        </div>
      </div>

      {/* Production Development Roadmap */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-[#234F46]" />
          <h2 className="text-base font-bold text-[#25332F] tracking-wide">
            Development Roadmap from Prototype to Production
          </h2>
        </div>
        <p className="text-xs text-[#68736E]">
          Structured integration pipeline for live telemetry, satellite SPI/SPEI, and machine learning validation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-[#234F46]">Phase 1 & 2: Core Platform</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40">COMPLETED</span>
            </div>
            <ul className="text-xs text-[#68736E] space-y-1.5">
              <li>✓ React + Vite + Tailwind GIS Dashboard</li>
              <li>✓ FastAPI deterministic MCDA risk engine</li>
              <li>✓ Leaflet GIS boundaries with keyless tiles</li>
              <li>✓ Bilingual EN/MR localized interface</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#234F46]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-[#234F46]">Phase 3: Drought Forecasting</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40">OPERATIONAL</span>
            </div>
            <ul className="text-xs text-[#68736E] space-y-1.5">
              <li>✓ WMO-No. 1090 SPI-3 & SPI-6 calculation</li>
              <li>✓ Historical climatology percentile baselines</li>
              <li>✓ Chronological ML models (2000-2018 train, 2019-2024 test)</li>
              <li>✓ 95% Confidence Intervals & persistence benchmark</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-[#267D9D]">Phase 4: Telemetry Ingestion</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDF6FA] text-[#1C627C] border border-[#4EA3C3]/40">FUTURE EXPANSION</span>
            </div>
            <ul className="text-xs text-[#68736E] space-y-1.5">
              <li>• Real-time Mahavedh AWS automated webhook ingestion</li>
              <li>• GSDA DWLR digital sensor API polling</li>
              <li>• Sentinel-2 / Landsat NDVI vegetation stress layers</li>
              <li>• Automated Taluka-level tanker demand alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDataSources;
