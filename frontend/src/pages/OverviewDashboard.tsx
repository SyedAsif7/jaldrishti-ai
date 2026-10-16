import React from 'react';
import {
  CloudRain,
  Waves,
  Database,
  Flame,
  Truck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
  LineChart,
  Compass,
  MapPin,
  Layers
} from 'lucide-react';
import { District, RegionalSummary, Language, PageId } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface OverviewDashboardProps {
  districts: District[];
  summary: RegionalSummary;
  selectedDistrict: District | null;
  language: Language;
  onSelectDistrict: (id: string) => void;
  onNavigatePage: (page: PageId) => void;
  onOpenDemoTour?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  districts,
  summary,
  selectedDistrict,
  language,
  onSelectDistrict,
  onNavigatePage,
  onOpenDemoTour
}) => {
  const t = useTranslation(language);

  // Sort districts by composite risk score descending
  const sortedDistricts = [...districts].sort(
    (a, b) => b.risk.composite_score - a.risk.composite_score
  );

  return (
    <div className="space-y-6">
      {/* Transparency Disclaimer */}
      <DemoDisclaimer language={language} />

      {/* Professional Home Screen Introduction Banner */}
      <div className="bg-[#234F46] p-6 sm:p-8 rounded-2xl border border-[#1E433B] text-[#FFFEFA] shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1B3F38] text-[#8FA86E] text-[11px] font-bold border border-[#2D6459] uppercase tracking-wider">
              {language === 'mr' ? 'सेवा फर्स्ट इनोव्हेशन चॅलेंज २०२६' : 'Seva First Innovation Challenge 2026'}
            </span>
            <span className="text-[11px] font-bold text-[#A3C4BC] tracking-wider uppercase">
              · Marathwada Hydrological Observatory
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFEFA] tracking-tight">
                JalDrishti AI
              </h1>
              <span className="text-base sm:text-lg font-medium text-[#C2DDD6]">
                Drought Prediction & Water Intelligence System
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-[#8FA86E] mt-1 tracking-wide">
              Supporting Smarter Water Decisions Across Marathwada
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#D2E4DF] leading-relaxed max-w-3xl">
            An integrated drought and water-intelligence platform designed to support district-level rainfall analysis, groundwater monitoring, reservoir assessment and evidence-based water planning.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Functional Action 1: Explore Dashboard */}
            <button
              onClick={() => {
                const el = document.getElementById('kpi-metrics-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFFEFA] text-[#234F46] font-bold text-xs hover:bg-[#F5F2E9] transition-colors shadow-sm cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#234F46]" />
              <span>Explore Dashboard</span>
            </button>

            {/* Functional Action 2: View Drought Risk Map */}
            <button
              onClick={() => onNavigatePage('map')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#267D9D] hover:bg-[#1C627C] text-[#FFFEFA] font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>View Drought Risk Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Explore Demo Tour Action */}
            {onOpenDemoTour && (
              <button
                onClick={onOpenDemoTour}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3F38] hover:bg-[#16332C] text-[#8FA86E] border border-[#2D6459] font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Demo (8 Steps)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div id="kpi-metrics-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t.metrics.compositeRisk}
          value={selectedDistrict ? selectedDistrict.risk.composite_score : summary.average_risk_score}
          unit="/100"
          subtext={selectedDistrict ? `${selectedDistrict.name} Composite` : 'Regional Average'}
          icon={Flame}
          variant="danger"
          badge={
            <RiskBadge
              level={selectedDistrict ? selectedDistrict.risk.risk_level : summary.overall_risk_level}
              size="sm"
            />
          }
        />

        <KpiCard
          title={t.metrics.rainfallDeficit}
          value={
            selectedDistrict
              ? selectedDistrict.rainfall.deficit_percentage
              : summary.average_rainfall_deficit_pct
          }
          unit="%"
          subtext={
            selectedDistrict
              ? `Actual: ${selectedDistrict.rainfall.monsoon_actual_mm}mm vs Normal: ${selectedDistrict.rainfall.monsoon_normal_mm}mm`
              : 'Departure from 50-year IMD LPA'
          }
          icon={CloudRain}
          variant="cyan"
        />

        <KpiCard
          title={t.metrics.groundwaterStress}
          value={
            selectedDistrict
              ? selectedDistrict.groundwater.stress_index
              : summary.average_groundwater_stress
          }
          unit="/100"
          subtext={
            selectedDistrict
              ? `${selectedDistrict.groundwater.critical_talukas_count} of ${selectedDistrict.talukas_count} critical blocks`
              : `${summary.active_tanker_demand_talukas} tanker-stressed blocks`
          }
          icon={Waves}
          variant="teal"
        />

        <KpiCard
          title={t.metrics.reservoirStorage}
          value={
            selectedDistrict
              ? selectedDistrict.reservoirs.aggregate_storage_pct
              : summary.average_reservoir_storage_pct
          }
          unit="%"
          subtext={
            selectedDistrict
              ? `Est. ${selectedDistrict.reservoirs.drinking_water_security_days} days buffer`
              : 'Average across major dams'
          }
          icon={Database}
          variant="cyan"
        />
      </div>

      {/* District Severity Distribution Bar */}
      <div className="bg-[#FFFEFA] border border-[#E3DDD0] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#25332F] tracking-wide">
              {language === 'mr' ? 'जिल्हास्तरीय जोखीम तीव्रता वर्गीकरण' : 'District Risk Severity Breakdown'}
            </h2>
            <p className="text-xs text-[#68736E] mt-0.5">
              {language === 'mr'
                ? '८ जिल्ह्यांचे संयुक्त दुष्काळ निर्देशांकावर आधारित वर्गीकरण (Severe, High, Moderate)'
                : 'Distribution of 8 Marathwada districts across mathematical risk tiers'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#B64D3C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B64D3C]" />
              Severe ({summary.districts_in_severe_risk})
            </span>
            <span className="flex items-center gap-1.5 text-[#C7813C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" />
              High ({summary.districts_in_high_risk})
            </span>
            <span className="flex items-center gap-1.5 text-[#728A53]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#728A53]" />
              Moderate ({summary.districts_in_moderate_risk})
            </span>
          </div>
        </div>

        {/* Visual Progress Bar - Earthy Categorical Colors */}
        <div className="h-3.5 w-full bg-[#F5F2E9] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-[#E3DDD0]">
          <div
            style={{ width: `${(summary.districts_in_severe_risk / summary.total_districts) * 100}%` }}
            className="bg-[#B64D3C] h-full rounded-l-full transition-all duration-500"
            title="Severe Risk Districts: Beed, Dharashiv"
          />
          <div
            style={{ width: `${(summary.districts_in_high_risk / summary.total_districts) * 100}%` }}
            className="bg-[#C7813C] h-full transition-all duration-500"
            title="High Risk Districts: Jalna, Latur, Parbhani"
          />
          <div
            style={{ width: `${(summary.districts_in_moderate_risk / summary.total_districts) * 100}%` }}
            className="bg-[#728A53] h-full rounded-r-full transition-all duration-500"
            title="Moderate Risk Districts: CSN, Hingoli, Nanded"
          />
        </div>
      </div>

      {/* District Comparison & Ranking Table */}
      <div className="bg-[#FFFEFA] border border-[#E3DDD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E3DDD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#25332F] tracking-wide">
              {language === 'mr' ? 'मराठवाडा जिल्हा तुलना व क्रमवारी' : 'District Water Intelligence Matrix & Ranking'}
            </h2>
            <p className="text-xs text-[#68736E] mt-0.5">
              {language === 'mr'
                ? 'उच्च जोखीम ते कमी जोखीम क्रमाने क्रमवारी लावलेले सर्व ८ जिल्हे'
                : 'All 8 districts ranked from highest composite risk to lowest'}
            </p>
          </div>
          <button
            onClick={() => onNavigatePage('analysis')}
            className="text-xs text-[#234F46] hover:text-[#17362F] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>{language === 'mr' ? 'फॉर्म्युला व वजन समायोजन' : 'Adjust Formula Weights'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F2E9] text-[#68736E] border-b border-[#E3DDD0] font-semibold">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{t.selectDistrict}</th>
                <th className="py-3 px-4">{t.metrics.rainfallDeficit}</th>
                <th className="py-3 px-4">{t.metrics.groundwaterStress}</th>
                <th className="py-3 px-4">{t.metrics.reservoirStorage}</th>
                <th className="py-3 px-4">{t.metrics.compositeRisk}</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1] text-[#25332F] font-medium">
              {sortedDistricts.map((d, index) => {
                const isSelected = selectedDistrict?.id === d.id;
                return (
                  <tr
                    key={d.id}
                    className={`hover:bg-[#F7F4EB] transition-colors ${
                      isSelected ? 'bg-[#EFF7F5] border-l-4 border-l-[#234F46]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[#8B9691]">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#25332F]">
                        {language === 'mr' ? d.name_mr : d.name}
                      </div>
                      <div className="text-[11px] text-[#68736E]">
                        {d.talukas_count} talukas · {d.area_sq_km.toLocaleString()} sq km
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A66628] font-bold">
                      -{d.rainfall.deficit_percentage}%
                      <div className="text-[10px] text-[#68736E] font-normal">
                        {d.rainfall.monsoon_actual_mm} / {d.rainfall.monsoon_normal_mm} mm
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#4A8B82] font-bold">
                      {d.groundwater.stress_index}/100
                      <div className="text-[10px] text-[#68736E] font-normal">
                        Pre: {d.groundwater.avg_depth_pre_monsoon_m}m bgl
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#267D9D] font-bold">
                      {d.reservoirs.aggregate_storage_pct}%
                      <div className="text-[10px] text-[#68736E] font-normal">
                        ~{d.reservoirs.drinking_water_security_days} days buffer
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#25332F] text-sm">
                      {d.risk.composite_score}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={d.risk.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectDistrict(d.id);
                          onNavigatePage('rainfall');
                        }}
                        className="px-2.5 py-1 rounded bg-[#F5F2E9] hover:bg-[#ECE6D8] text-[#234F46] border border-[#D1C9BA] text-[11px] font-semibold transition-colors"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Action & Key Advisory Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFEFA] border border-[#B64D3C]/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#B64D3C] mb-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-xs tracking-wider uppercase">
              {language === 'mr' ? 'तात्काळ दुष्काळ सूचना (गंभीर जिल्हे)' : 'Priority Critical Warnings'}
            </h3>
          </div>
          <p className="text-xs text-[#25332F] leading-relaxed mb-4">
            {language === 'mr'
              ? 'बीड आणि धाराशिव जिल्ह्यांमध्ये संयुक्त जोखीम निर्देशांक ७५ पेक्षा जास्त आहे. पिण्याच्या पाण्याचे आरक्षण आणि टँकर नियोजन अग्रक्रमाने राबवावे.'
              : 'Beed (76.5) and Dharashiv (81.4) have crossed the Severe Drought Risk threshold (≥75). Emergency drinking water preservation and tanker mobilization protocols are recommended.'}
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#FAF0EE] border border-[#B64D3C]/20 text-xs text-[#25332F]">
              <strong className="text-[#B64D3C]">Dharashiv (Score 81.4):</strong> 51% monsoon rainfall deficit, 104% groundwater extraction stage, Lower Terna storage at 19.2%.
            </div>
            <div className="p-3 rounded-xl bg-[#FAF0EE] border border-[#B64D3C]/20 text-xs text-[#25332F]">
              <strong className="text-[#B64D3C]">Beed (Score 76.5):</strong> Majalgaon & Manjara storage down to ~22%, 34-day longest dry spell observed.
            </div>
          </div>
        </div>

        <div className="bg-[#FFFEFA] border border-[#E3DDD0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-[#234F46] mb-3">
              <Truck className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-xs tracking-wider uppercase">
                {language === 'mr' ? 'जलसंधारण व टँकर सज्जता' : 'Water Buffer & Preparedness Status'}
              </h3>
            </div>
            <p className="text-xs text-[#68736E] leading-relaxed mb-3">
              Across Marathwada’s 76 talukas, an estimated 28 talukas show vulnerability requiring tanker contingencies by March–May.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <span className="text-[#68736E] block text-[11px]">Division Normal Rainfall</span>
                <span className="font-bold font-mono text-[#25332F] text-base">735 mm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <span className="text-[#68736E] block text-[11px]">Observed Monsoon Rain</span>
                <span className="font-bold font-mono text-[#267D9D] text-base">477 mm</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#F0EBE1] mt-4">
            <span className="text-[11px] text-[#68736E] font-mono">
              Formula: MCDA Composite (0.45 RF + 0.35 GW + 0.20 Res)
            </span>
            <button
              onClick={() => onNavigatePage('alerts')}
              className="text-xs font-semibold text-[#234F46] hover:text-[#17362F] flex items-center gap-1"
            >
              <span>{t.nav.alerts} →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
