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
  Brain
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
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  districts,
  summary,
  selectedDistrict,
  language,
  onSelectDistrict,
  onNavigatePage
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

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-800 p-6 rounded-2xl border border-navy-700/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase font-mono">
              Marathwada Division Monitoring
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {selectedDistrict
              ? `${language === 'mr' ? selectedDistrict.name_mr : selectedDistrict.name} · ${t.nav.overview}`
              : language === 'mr'
              ? 'मराठवाडा विभाग दुष्काळ आणि जल सुरक्षा डॅशबोर्ड'
              : 'Marathwada Regional Water & Drought Intelligence'}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            {language === 'mr'
              ? 'मराठवाड्यातील ८ जिल्ह्यांमधील पर्जन्यमान तूट, भूजल पातळी घट आणि धरण साठ्याचे बहु-निकषीय संयुक्त मूल्यांकन.'
              : 'Comprehensive multi-criteria drought intelligence analyzing rainfall deficit, groundwater stress, and reservoir depletion across 8 Marathwada districts.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigatePage('forecast')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-teal-300 border border-teal-500/40 font-semibold text-xs transition-all shadow-md"
          >
            <Brain className="w-4 h-4 text-teal-400" />
            <span>{t.nav.forecast}</span>
          </button>
          <button
            onClick={() => onNavigatePage('map')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-teal-900/40"
          >
            <span>{t.nav.map}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t.metrics.compositeRisk}
          value={selectedDistrict ? selectedDistrict.risk.composite_score : summary.average_risk_score}
          unit="/100"
          subtext={selectedDistrict ? `${selectedDistrict.name} Index` : 'Regional Average Index'}
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
          variant="warning"
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
          variant="warning"
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
              : 'Average across major & medium dams'
          }
          icon={Database}
          variant="cyan"
        />
      </div>

      {/* District Severity Distribution Bar */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {language === 'mr' ? 'जिल्हास्तरीय जोखीम तीव्रता वर्गीकरण' : 'District Risk Severity Breakdown'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'mr'
                ? '८ जिल्ह्यांचे संयुक्त दुष्काळ निर्देशांकावर आधारित वर्गीकरण (Severe, High, Moderate)'
                : 'Distribution of 8 Marathwada districts across mathematical risk tiers'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Severe ({summary.districts_in_severe_risk})
            </span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              High ({summary.districts_in_high_risk})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Moderate ({summary.districts_in_moderate_risk})
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-4 w-full bg-navy-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-navy-800">
          <div
            style={{ width: `${(summary.districts_in_severe_risk / summary.total_districts) * 100}%` }}
            className="bg-red-500 h-full rounded-l-full transition-all duration-500"
            title="Severe Risk Districts: Beed, Dharashiv"
          />
          <div
            style={{ width: `${(summary.districts_in_high_risk / summary.total_districts) * 100}%` }}
            className="bg-orange-500 h-full transition-all duration-500"
            title="High Risk Districts: Jalna, Latur, Parbhani"
          />
          <div
            style={{ width: `${(summary.districts_in_moderate_risk / summary.total_districts) * 100}%` }}
            className="bg-amber-500 h-full rounded-r-full transition-all duration-500"
            title="Moderate Risk Districts: CSN, Hingoli, Nanded"
          />
        </div>
      </div>

      {/* District Comparison & Ranking Table */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-navy-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {language === 'mr' ? 'मराठवाडा जिल्हा तुलना व क्रमवारी' : 'District Water Intelligence Matrix & Ranking'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'mr'
                ? 'उच्च जोखीम ते कमी जोखीम क्रमाने क्रमवारी लावलेले सर्व ८ जिल्हे'
                : 'All 8 districts ranked from highest composite risk to lowest'}
            </p>
          </div>
          <button
            onClick={() => onNavigatePage('analysis')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>{language === 'mr' ? 'फॉर्म्युला व वजन समायोजन' : 'Adjust Formula Weights'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/70 text-slate-400 border-b border-navy-700 font-semibold">
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
            <tbody className="divide-y divide-navy-800 text-slate-300 font-medium">
              {sortedDistricts.map((d, index) => {
                const isSelected = selectedDistrict?.id === d.id;
                return (
                  <tr
                    key={d.id}
                    className={`hover:bg-navy-800/50 transition-colors ${
                      isSelected ? 'bg-teal-500/10 border-l-4 border-l-teal-400' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {language === 'mr' ? d.name_mr : d.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {d.talukas_count} talukas · {d.area_sq_km.toLocaleString()} sq km
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300">
                      -{d.rainfall.deficit_percentage}%
                      <div className="text-[10px] text-slate-400">
                        {d.rainfall.monsoon_actual_mm} / {d.rainfall.monsoon_normal_mm} mm
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-orange-300">
                      {d.groundwater.stress_index}/100
                      <div className="text-[10px] text-slate-400">
                        Pre: {d.groundwater.avg_depth_pre_monsoon_m}m bgl
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300">
                      {d.reservoirs.aggregate_storage_pct}%
                      <div className="text-[10px] text-slate-400">
                        ~{d.reservoirs.drinking_water_security_days} days reserve
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white text-sm">
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
                        className="px-2.5 py-1 rounded bg-navy-800 hover:bg-teal-600/30 text-teal-300 border border-navy-700 hover:border-teal-500/40 text-[11px] font-semibold transition-colors"
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
        <div className="bg-navy-900 border border-red-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2.5 text-red-400 mb-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-sm tracking-wide uppercase">
              {language === 'mr' ? 'तात्काळ दुष्काळ सूचना (गंभीर जिल्हे)' : 'Priority Critical Warnings'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {language === 'mr'
              ? 'बीड आणि धाराशिव जिल्ह्यांमध्ये संयुक्त जोखीम निर्देशांक ७५ पेक्षा जास्त आहे. पिण्याच्या पाण्याचे आरक्षण आणि टँकर नियोजन अग्रक्रमाने राबवावे.'
              : 'Beed (76.5) and Dharashiv (81.4) have crossed the Severe Drought Risk threshold (≥75). Emergency drinking water preservation and tanker mobilization protocols are recommended.'}
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-300">
              <strong className="text-red-400">Dharashiv (Score 81.4):</strong> 51% monsoon rainfall deficit, 104% groundwater extraction stage, Lower Terna storage at 19.2%.
            </div>
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-300">
              <strong className="text-red-400">Beed (Score 76.5):</strong> Majalgaon & Manjara storage down to ~22%, 34-day longest dry spell observed.
            </div>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-teal-400 mb-3">
              <Truck className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm tracking-wide uppercase">
                {language === 'mr' ? 'जलसंधारण व टँकर सज्जता' : 'Water Buffer & Preparedness Status'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Across Marathwada’s 76 talukas, an estimated 28 talukas show vulnerability requiring tanker contingencies by March–May.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <span className="text-slate-400 block text-[11px]">Division Normal Rainfall</span>
                <span className="font-bold font-mono text-white text-base">735 mm</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <span className="text-slate-400 block text-[11px]">Observed Monsoon Rain</span>
                <span className="font-bold font-mono text-teal-400 text-base">477 mm</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-navy-800 mt-4">
            <span className="text-[11px] text-slate-400 font-mono">
              Formula: MCDA Composite (0.45 RF + 0.35 GW + 0.20 Res)
            </span>
            <button
              onClick={() => onNavigatePage('alerts')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>{t.nav.alerts} →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
