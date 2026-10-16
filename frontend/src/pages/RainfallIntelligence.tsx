import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { CloudRain, AlertCircle, Info, Calendar, Compass, ShieldAlert, TrendingDown, Sun } from 'lucide-react';
import { District, Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface RainfallIntelligenceProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const RainfallIntelligence: React.FC<RainfallIntelligenceProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const t = useTranslation(language);

  // Compute cumulative series for monthly comparison
  let cumNormal = 0;
  let cumActual = 0;
  const chartData = selectedDistrict.rainfall.monthly_comparison.map((item) => {
    cumNormal += item.normal_mm;
    cumActual += item.actual_mm;
    return {
      month: item.month,
      Normal: item.normal_mm,
      Actual: item.actual_mm,
      DeficitPct: item.deficit_pct,
      CumNormal: Math.round(cumNormal),
      CumActual: Math.round(cumActual)
    };
  });

  // Calculate seasonal groupings (IMD Standard definitions)
  const monthly = selectedDistrict.rainfall.monthly_comparison;
  
  // SW Monsoon: Jun(5), Jul(6), Aug(7), Sep(8)
  const swMonths = [monthly[5], monthly[6], monthly[7], monthly[8]].filter(Boolean);
  const swNormal = swMonths.reduce((sum, m) => sum + m.normal_mm, 0);
  const swActual = swMonths.reduce((sum, m) => sum + m.actual_mm, 0);
  const swDepPct = swNormal > 0 ? ((swActual - swNormal) / swNormal) * 100 : 0;

  // Post-Monsoon: Oct(9), Nov(10), Dec(11)
  const postMonths = [monthly[9], monthly[10], monthly[11]].filter(Boolean);
  const postNormal = postMonths.reduce((sum, m) => sum + m.normal_mm, 0);
  const postActual = postMonths.reduce((sum, m) => sum + m.actual_mm, 0);
  const postDepPct = postNormal > 0 ? ((postActual - postNormal) / postNormal) * 100 : 0;

  // Pre-Monsoon & Winter: Jan(0), Feb(1), Mar(2), Apr(3), May(4)
  const preMonths = [monthly[0], monthly[1], monthly[2], monthly[3], monthly[4]].filter(Boolean);
  const preNormal = preMonths.reduce((sum, m) => sum + m.normal_mm, 0);
  const preActual = preMonths.reduce((sum, m) => sum + m.actual_mm, 0);
  const preDepPct = preNormal > 0 ? ((preActual - preNormal) / preNormal) * 100 : 0;

  const getImdClassification = (depPct: number) => {
    if (depPct >= 60) return { label: 'Large Excess (≥+60%)', color: 'text-[#1C627C] bg-[#EDF6FA] border-[#4EA3C3]/50' };
    if (depPct >= 20) return { label: 'Excess (+20% to +59%)', color: 'text-[#267D9D] bg-[#EDF6FA] border-[#267D9D]/40' };
    if (depPct >= -19) return { label: 'Normal (-19% to +19%)', color: 'text-[#5A6E41] bg-[#F4F7EF] border-[#8FA86E]/40' };
    if (depPct >= -59) return { label: 'Deficient (-20% to -59%)', color: 'text-[#A66628] bg-[#FBF5EE] border-[#DE9954]/50' };
    return { label: 'Large Deficient (≤-60%)', color: 'text-[#B64D3C] bg-[#FAF0EE] border-[#B64D3C]/40' };
  };

  const swImd = getImdClassification(swDepPct);

  const getSpiClassification = (spi: number) => {
    if (spi <= -2.0) return { label: 'Extremely Dry', color: 'text-[#B64D3C] bg-[#FAF0EE] border-[#B64D3C]/40' };
    if (spi <= -1.5) return { label: 'Severely Dry', color: 'text-[#CE6755] bg-[#FAF0EE] border-[#CE6755]/40' };
    if (spi <= -1.0) return { label: 'Moderately Dry', color: 'text-[#A66628] bg-[#FBF5EE] border-[#DE9954]/50' };
    return { label: 'Near Normal', color: 'text-[#5A6E41] bg-[#F4F7EF] border-[#8FA86E]/40' };
  };

  const spiInfo = getSpiClassification(selectedDistrict.rainfall.spi_3month_estimate);

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-[#267D9D]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.rainfall}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? '५० वर्षांची IMD सरासरी विरुद्ध नोंदवलेले पर्जन्यमान, तूट टक्केवारी व SPI निर्देशांक.'
              : 'Precipitation departure tracking against 50-year IMD Long Period Average (LPA) with seasonal breakdown.'}
          </p>
        </div>

        {/* District Switcher Tabs */}
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

      {/* Top Indicators Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Monsoon Rainfall Deficit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#A66628]">
              -{selectedDistrict.rainfall.deficit_percentage}%
            </span>
            <span className="text-xs font-medium text-[#68736E]">vs Normal</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Observed: <strong className="text-[#25332F]">{selectedDistrict.rainfall.monsoon_actual_mm} mm</strong> / Normal: {selectedDistrict.rainfall.monsoon_normal_mm} mm
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            IMD Monsoon Category
          </span>
          <div className="mt-1">
            <span className={`px-2.5 py-1 rounded text-xs font-bold border inline-block ${swImd.color}`}>
              {swImd.label}
            </span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Departure: <strong className="text-[#25332F]">{swDepPct.toFixed(1)}%</strong> from LPA
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            SPI-3 Estimate (3-Month)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#25332F]">
              {selectedDistrict.rainfall.spi_3month_estimate.toFixed(2)}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${spiInfo.color}`}>
              {spiInfo.label}
            </span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Standardized Precipitation Index (WMO-No. 1090)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Max Consecutive Dry Spell
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#B64D3C]">
              {selectedDistrict.rainfall.dry_spell_days_max}
            </span>
            <span className="text-xs font-medium text-[#68736E]">days</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            {selectedDistrict.rainfall.dry_spell_days_max > 21 ? 'Exceeds 21-day critical stress threshold' : 'Normal dry-spell window'}
          </div>
        </div>
      </div>

      {/* Seasonal Rainfall Trends Summary Box */}
      <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <h2 className="text-xs font-bold text-[#25332F] tracking-wider uppercase mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#234F46]" />
          <span>Seasonal Rainfall Breakdown (Historical Normal vs Observed)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <div className="font-bold text-[#25332F] mb-1 flex items-center justify-between">
              <span>Southwest Monsoon (Jun–Sep)</span>
              <span className="text-[#A66628] font-mono font-bold">{swDepPct.toFixed(1)}%</span>
            </div>
            <div className="text-[#68736E] space-y-0.5">
              <div>Observed: <strong className="text-[#267D9D] font-mono">{swActual.toFixed(1)} mm</strong></div>
              <div>Normal LPA: <strong className="text-[#25332F] font-mono">{swNormal.toFixed(1)} mm</strong></div>
              <div className="text-[11px] text-[#8B9691] pt-1">Primary cropping window (Kharif)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <div className="font-bold text-[#25332F] mb-1 flex items-center justify-between">
              <span>Post-Monsoon (Oct–Dec)</span>
              <span className="text-[#A66628] font-mono font-bold">{postDepPct.toFixed(1)}%</span>
            </div>
            <div className="text-[#68736E] space-y-0.5">
              <div>Observed: <strong className="text-[#267D9D] font-mono">{postActual.toFixed(1)} mm</strong></div>
              <div>Normal LPA: <strong className="text-[#25332F] font-mono">{postNormal.toFixed(1)} mm</strong></div>
              <div className="text-[11px] text-[#8B9691] pt-1">Rabi soil-moisture recharge window</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
            <div className="font-bold text-[#25332F] mb-1 flex items-center justify-between">
              <span>Winter & Summer (Jan–May)</span>
              <span className="text-[#A66628] font-mono font-bold">{preDepPct.toFixed(1)}%</span>
            </div>
            <div className="text-[#68736E] space-y-0.5">
              <div>Observed: <strong className="text-[#267D9D] font-mono">{preActual.toFixed(1)} mm</strong></div>
              <div>Normal LPA: <strong className="text-[#25332F] font-mono">{preNormal.toFixed(1)} mm</strong></div>
              <div className="text-[11px] text-[#8B9691] pt-1">Thundershowers and pre-sowing showers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Actual vs Normal Bar Chart */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#25332F] tracking-wide">
              {selectedDistrict.name} · Monthly Rainfall Departure Analysis (mm)
            </h2>
            <p className="text-xs text-[#68736E]">
              Comparison between normal LPA baseline and demo observed monthly rainfall.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#68736E]">
              <span className="w-3 h-3 bg-[#A8B6B0] rounded-xs" /> Normal (LPA)
            </span>
            <span className="flex items-center gap-1.5 text-[#267D9D]">
              <span className="w-3 h-3 bg-[#267D9D] rounded-xs" /> Observed
            </span>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
              <XAxis dataKey="month" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
              <YAxis stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEFA',
                  borderColor: '#D1C9BA',
                  borderRadius: '10px',
                  color: '#25332F',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(37,51,47,0.1)'
                }}
              />
              <Bar dataKey="Normal" fill="#A8B6B0" radius={[3, 3, 0, 0]} name="Normal LPA (mm)" />
              <Bar dataKey="Actual" fill="#267D9D" radius={[3, 3, 0, 0]} name="Observed Rain (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Monsoon Progression Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <h2 className="text-base font-bold text-[#25332F] tracking-wide mb-1">
            Cumulative Rainfall Curve (mm)
          </h2>
          <p className="text-xs text-[#68736E] mb-4">
            Cumulative precipitation accumulation showing divergence from normal recharge trajectory.
          </p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
                <XAxis dataKey="month" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
                <YAxis stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} unit=" mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#D1C9BA',
                    borderRadius: '10px',
                    color: '#25332F',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(37,51,47,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="CumNormal"
                  stroke="#8B9691"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Normal Cumulative (mm)"
                />
                <Line
                  type="monotone"
                  dataKey="CumActual"
                  stroke="#267D9D"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Observed Cumulative (mm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drought Threshold Classification Guide */}
        <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#25332F] tracking-wide mb-1">
              Meteorological Classification Framework
            </h2>
            <p className="text-xs text-[#68736E] mb-4">
              Standard IMD drought and deficit classification criteria used in this module:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between">
                <span className="font-semibold text-[#5A6E41]">Normal Rainfall</span>
                <span className="font-mono text-[#25332F]">-19% to +19% departure</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between">
                <span className="font-semibold text-[#A66628]">Deficient</span>
                <span className="font-mono text-[#25332F]">-20% to -59% departure</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between">
                <span className="font-semibold text-[#CE6755]">Large Deficient</span>
                <span className="font-mono text-[#25332F]">-60% to -99% departure</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between">
                <span className="font-semibold text-[#B64D3C]">Severe Drought Spell</span>
                <span className="font-mono text-[#25332F]">&gt;28 continuous dry days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#F0EBE1] flex items-center gap-2 text-[11px] text-[#68736E]">
            <Info className="w-4 h-4 text-[#234F46] shrink-0" />
            <span>
              All rainfall figures represent demonstration seed data modeled after Marathwada historical agro-climatic zones.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainfallIntelligence;
