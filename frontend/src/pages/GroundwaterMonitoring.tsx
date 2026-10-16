import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Waves, AlertTriangle, CheckCircle2, AlertOctagon, HelpCircle, Activity, BarChart2 } from 'lucide-react';
import { District, Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface GroundwaterMonitoringProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const GroundwaterMonitoring: React.FC<GroundwaterMonitoringProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const t = useTranslation(language);

  const gw = selectedDistrict.groundwater;

  // Extraction category styling - Environmental Palette
  const getExtractionStatus = (pct: number) => {
    if (pct >= 100) return { label: 'Over-Exploited (>100%)', color: 'text-[#B64D3C] bg-[#FAF0EE] border-[#B64D3C]/40' };
    if (pct >= 90) return { label: 'Critical (90–100%)', color: 'text-[#CE6755] bg-[#FAF0EE] border-[#CE6755]/40' };
    if (pct >= 70) return { label: 'Semi-Critical (70–90%)', color: 'text-[#A66628] bg-[#FBF5EE] border-[#DE9954]/50' };
    return { label: 'Safe (<70%)', color: 'text-[#5A6E41] bg-[#F4F7EF] border-[#8FA86E]/40' };
  };

  const extractionStatus = getExtractionStatus(gw.stage_of_extraction_pct);

  // Cross-District Comparison Dataset
  const districtComparisonData = districts.map((d) => ({
    name: d.name === 'Chhatrapati Sambhajinagar' ? 'CSN' : d.name,
    fullName: d.name,
    preMonsoon: d.groundwater.avg_depth_pre_monsoon_m,
    postMonsoon: d.groundwater.avg_depth_post_monsoon_m,
    stressIndex: d.groundwater.stress_index,
    depletedWells: d.groundwater.depleted_wells_pct,
    id: d.id
  }));

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-6 h-6 text-[#4A8B82]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.groundwater}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'GSDA आणि CGWB विहिरींच्या निरीक्षणावर आधारित भूजल पातळी, उपसा प्रमाण व खोल गेलेल्या विहिरींचे विश्लेषण.'
              : 'Hydrogeological analysis of aquifer water tables, seasonal recharge dynamics, and district comparison.'}
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDistrict(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDistrict.id === d.id
                  ? 'bg-[#234F46] text-[#FFFEFA] font-bold shadow-xs'
                  : 'bg-[#FFFEFA] border border-[#D1C9BA] text-[#68736E] hover:text-[#25332F] hover:bg-[#F5F2E9]'
              }`}
            >
              {language === 'mr' ? d.name_mr : d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Groundwater Stress Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#A66628]">
              {gw.stress_index}
            </span>
            <span className="text-xs font-medium text-[#68736E]">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Composite index of fall & well depletion
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Stage of GW Extraction
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#25332F]">
              {gw.stage_of_extraction_pct}%
            </span>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${extractionStatus.color}`}>
              {extractionStatus.label}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Wells Showing Depletion (&gt;2m)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#A66628]">
              {gw.depleted_wells_pct}%
            </span>
            <span className="text-xs font-medium text-[#68736E]">of network</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Fall vs 5-year average: <strong className="text-[#25332F]">{gw.water_table_fall_m}m</strong>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Critical / Overexploited Talukas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#B64D3C]">
              {gw.critical_talukas_count}
            </span>
            <span className="text-xs font-medium text-[#68736E]">of {selectedDistrict.talukas_count} blocks</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Regulated under Maharashtra Groundwater Act
          </div>
        </div>
      </div>

      {/* Pre-Monsoon vs Post-Monsoon Hydrograph */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#25332F] tracking-wide">
              {selectedDistrict.name} · Monthly Water Table Depth Profile (m bgl)
            </h2>
            <p className="text-xs text-[#68736E]">
              Meters Below Ground Level (m bgl). Note: Deeper values indicate depleted water table.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#4A8B82]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A8B82]" />
              Post-Monsoon (Oct): {gw.avg_depth_post_monsoon_m}m bgl
            </span>
            <span className="flex items-center gap-1.5 text-[#C7813C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" />
              Pre-Monsoon (May): {gw.avg_depth_pre_monsoon_m}m bgl
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gw.monthly_trend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gwDepthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A8B82" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4A8B82" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
              <XAxis dataKey="month" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
              <YAxis
                stroke="#8B9691"
                tick={{ fontSize: 11, fill: '#68736E' }}
                unit="m"
                domain={[0, 'dataMax + 3']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEFA',
                  borderColor: '#D1C9BA',
                  borderRadius: '10px',
                  color: '#25332F',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(37,51,47,0.1)'
                }}
                formatter={(val: any) => [`${val} m bgl`, 'Water Table Depth']}
              />
              <Area
                type="monotone"
                dataKey="depth_m"
                stroke="#4A8B82"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gwDepthGradient)"
                name="Depth (m bgl)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-District Comparison Chart: Pre vs Post Monsoon & Stress Index */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#25332F] tracking-wide flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#234F46]" />
              <span>District-Wise Groundwater Table & Stress Comparison</span>
            </h2>
            <p className="text-xs text-[#68736E]">
              Comparative pre-monsoon vs post-monsoon depth (m bgl) across all 8 districts of Marathwada. Click any bar to inspect that district.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#68736E]">
              <span className="w-3 h-3 bg-[#C7813C] rounded-xs" /> Pre-Monsoon (May)
            </span>
            <span className="flex items-center gap-1.5 text-[#68736E]">
              <span className="w-3 h-3 bg-[#4A8B82] rounded-xs" /> Post-Monsoon (Oct)
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={districtComparisonData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              onClick={(state) => {
                if (state && state.activePayload && state.activePayload[0]) {
                  const targetId = state.activePayload[0].payload.id;
                  if (targetId) onSelectDistrict(targetId);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
              <XAxis dataKey="name" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
              <YAxis stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEFA',
                  borderColor: '#D1C9BA',
                  borderRadius: '10px',
                  color: '#25332F',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(37,51,47,0.1)'
                }}
                formatter={(val: any, name: any) => [`${val} m bgl`, name]}
              />
              <Bar dataKey="preMonsoon" fill="#C7813C" radius={[3, 3, 0, 0]} name="Pre-Monsoon Depth (m bgl)" />
              <Bar dataKey="postMonsoon" fill="#4A8B82" radius={[3, 3, 0, 0]} name="Post-Monsoon Depth (m bgl)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hydrogeological Vulnerability Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <h3 className="font-bold text-sm text-[#25332F] mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#234F46]" />
            <span>Aquifer Characteristics (Deccan Traps Basalt)</span>
          </h3>
          <p className="text-xs text-[#68736E] leading-relaxed mb-4">
            Marathwada is predominantly underlain by Deccan Volcanic Basalt formations characterized by secondary porosity (fractures, joints, and weathered zones). Low storativity (S ≈ 0.01 to 0.03) leads to rapid water table fluctuation between post-monsoon and peak summer.
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex justify-between">
              <span className="text-[#68736E]">Estimated Annual Seasonal Fluctuation</span>
              <strong className="text-[#25332F]">{(gw.avg_depth_pre_monsoon_m - gw.avg_depth_post_monsoon_m).toFixed(1)} meters</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex justify-between">
              <span className="text-[#68736E]">Decadal Mean Fall Flag</span>
              <strong className={gw.water_table_fall_m > 2 ? 'text-[#B64D3C]' : 'text-[#A66628]'}>
                {gw.water_table_fall_m > 2 ? 'Critical (>2m fall)' : 'Moderate (1-2m fall)'}
              </strong>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#25332F] mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#C7813C]" />
              <span>Recommended Groundwater Conservation Protocols</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#68736E]">
              <li className="flex items-start gap-2">
                <span className="text-[#234F46] font-bold">•</span>
                <span>Prohibit deep commercial drilling (&gt;60m / 200ft) in critical blocks under section 9 of Maharashtra Groundwater Act 2009.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#234F46] font-bold">•</span>
                <span>Prioritize artificial recharge shafts and percolation tanks upstream of drinking water wells.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#234F46] font-bold">•</span>
                <span>Mandate micro-irrigation systems for sugarcane and horticultural plantations drawing from borewells.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EBE1] text-[11px] text-[#68736E]">
            Source Agency Reference: GSDA GoM & CGWB (Simulated Demo Model)
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroundwaterMonitoring;
