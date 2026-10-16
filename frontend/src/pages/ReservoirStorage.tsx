import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Database, AlertTriangle, ShieldCheck, ShieldAlert, Waves, Droplet, ArrowDownRight } from 'lucide-react';
import { District, Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface ReservoirStorageProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const ReservoirStorage: React.FC<ReservoirStorageProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const t = useTranslation(language);

  const res = selectedDistrict.reservoirs;

  // 10-year reference baseline for typical post-monsoon storage is ~65%
  const damChartData = res.dams.map((dam) => {
    const referenceNormalPct = 68.0; // 10-year historical mean benchmark
    const storageDelta = Math.round((dam.live_storage_pct - referenceNormalPct) * 10) / 10;
    return {
      name: dam.name.split(' ')[0] + ' Dam',
      fullName: dam.name,
      capacity: dam.capacity_mcft,
      currentStoragePct: dam.live_storage_pct,
      referenceNormalPct: referenceNormalPct,
      storageDeltaPct: storageDelta,
      deadAlert: dam.dead_storage_alert
    };
  });

  // Regional major dams overview
  const regionalMajorDams = districts.flatMap((d) =>
    d.reservoirs.dams.map((dam) => ({
      ...dam,
      districtName: d.name,
      districtNameMr: d.name_mr,
      districtId: d.id,
      referenceNormalPct: 68.0,
      delta: Math.round((dam.live_storage_pct - 68.0) * 10) / 10
    }))
  );

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-[#267D9D]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.reservoirs}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'मराठवाड्यातील प्रमुख व मध्यम धरणांचा उपयुक्त जलसाठा, मृत साठा इशारे व पिण्याच्या पाण्याचे दिवस.'
              : 'Surface water reservoir live capacity tracking, 10-year reference comparisons, and dead storage alerts.'}
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

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Aggregate Live Storage
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                res.aggregate_storage_pct < 25 ? 'text-[#B64D3C]' : 'text-[#267D9D]'
              }`}
            >
              {res.aggregate_storage_pct}%
            </span>
            <span className="text-xs font-medium text-[#68736E]">of live capacity</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Reference normal: 68% (Delta: {res.aggregate_storage_pct - 68}%)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Drinking Water Security
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                res.drinking_water_security_days < 90 ? 'text-[#B64D3C]' : 'text-[#234F46]'
              }`}
            >
              {res.drinking_water_security_days}
            </span>
            <span className="text-xs font-medium text-[#68736E]">days buffer</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            {res.drinking_water_security_days < 90
              ? 'CRITICAL: Below 90 days reserve buffer'
              : 'Adequate municipal drinking quota secured'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Dead Storage Alert Count
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#A66628]">
              {res.dams.filter((d) => d.dead_storage_alert).length}
            </span>
            <span className="text-xs font-medium text-[#68736E]">of {res.dams.length} projects</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Water level at or below sill level of intake
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <span className="text-[11px] font-bold text-[#68736E] uppercase tracking-wider block mb-1">
            Total Monitored Capacity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#25332F]">
              {(res.dams.reduce((acc, curr) => acc + curr.capacity_mcft, 0) / 1000).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-[#68736E]">Thousand mcft</span>
          </div>
          <div className="mt-2 text-xs text-[#68736E]">
            Design gross capacity across monitored dams
          </div>
        </div>
      </div>

      {/* Selected District Reservoirs Detailed Cards */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <h2 className="text-base font-bold text-[#25332F] tracking-wide mb-1">
          {selectedDistrict.name} · Reservoir Inventory & Capacity Status
        </h2>
        <p className="text-xs text-[#68736E] mb-6">
          Detailed operational parameters for key storage projects feeding the district.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {res.dams.map((dam, idx) => {
            const isCritical = dam.live_storage_pct < 25;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border bg-[#FFFEFA] transition-all shadow-xs ${
                  dam.dead_storage_alert
                    ? 'border-[#B64D3C]/50'
                    : 'border-[#E3DDD0] hover:border-[#D1C9BA]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-[#25332F]">{dam.name}</h3>
                  {dam.dead_storage_alert ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0EE] text-[#B64D3C] border border-[#B64D3C]/40 shrink-0">
                      DEAD STORAGE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 shrink-0">
                      OPERATIONAL
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#68736E] mb-3">
                  River Basin: <strong className="text-[#25332F]">{dam.river}</strong>
                </div>

                {/* Live Storage Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#68736E]">Live Storage vs 68% Ref Normal</span>
                    <span
                      className={`font-mono font-bold ${
                        isCritical ? 'text-[#B64D3C]' : 'text-[#267D9D]'
                      }`}
                    >
                      {dam.live_storage_pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[#F5F2E9] rounded-full overflow-hidden border border-[#E3DDD0] relative">
                    {/* 10-year reference normal marker */}
                    <div
                      style={{ left: '68%' }}
                      className="absolute top-0 bottom-0 w-0.5 bg-[#68736E] z-10"
                      title="10-Year Reference Normal (68%)"
                    />
                    <div
                      style={{ width: `${dam.live_storage_pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-[#B64D3C]' : 'bg-[#267D9D]'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0EBE1] flex justify-between text-[11px] text-[#68736E]">
                  <span>Gross Design:</span>
                  <span className="font-mono text-[#25332F] font-semibold">
                    {dam.capacity_mcft.toLocaleString()} mcft
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current vs 10-Year Reference Storage Comparison Chart */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#25332F] tracking-wide">
              {selectedDistrict.name} · Current vs Reference Normal Storage (%)
            </h2>
            <p className="text-xs text-[#68736E]">
              Comparison between current live storage percentage and the 10-year post-monsoon normal benchmark (68%).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#267D9D]">
              <span className="w-3 h-3 bg-[#267D9D] rounded-xs" /> Current Live Storage (%)
            </span>
            <span className="flex items-center gap-1.5 text-[#68736E]">
              <span className="w-3 h-3 bg-[#A8B6B0] rounded-xs" /> 10-Yr Benchmark (68%)
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={damChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
              <XAxis dataKey="name" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
              <YAxis stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} unit="%" domain={[0, 100]} />
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
              <Bar dataKey="currentStoragePct" fill="#267D9D" radius={[3, 3, 0, 0]} name="Current Live Storage (%)" />
              <Bar dataKey="referenceNormalPct" fill="#A8B6B0" radius={[3, 3, 0, 0]} name="10-Year Benchmark (68%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Major Reservoirs Status Table */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm overflow-hidden">
        <h2 className="text-base font-bold text-[#25332F] tracking-wide mb-1">
          Regional Marathwada Major Reservoirs Status Table
        </h2>
        <p className="text-xs text-[#68736E] mb-4">
          Combined surface storage inventory across all 8 districts with critical dead storage indicators.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F2E9] text-[#68736E] border-b border-[#E3DDD0] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Dam Name</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">River</th>
                <th className="py-2.5 px-3">Gross Cap (mcft)</th>
                <th className="py-2.5 px-3">Current Storage</th>
                <th className="py-2.5 px-3">Reference (68%)</th>
                <th className="py-2.5 px-3">Departure</th>
                <th className="py-2.5 px-3">Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1] font-medium text-[#25332F]">
              {regionalMajorDams.map((dam, idx) => {
                const isDead = dam.dead_storage_alert;
                return (
                  <tr key={idx} className="hover:bg-[#F7F4EB] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#25332F]">{dam.name}</td>
                    <td className="py-2.5 px-3 text-[#25332F]">{dam.districtName}</td>
                    <td className="py-2.5 px-3 text-[#68736E]">{dam.river}</td>
                    <td className="py-2.5 px-3 font-mono text-[#25332F]">{dam.capacity_mcft.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#267D9D]">{dam.live_storage_pct}%</td>
                    <td className="py-2.5 px-3 font-mono text-[#8B9691]">68.0%</td>
                    <td className="py-2.5 px-3 font-mono text-[#A66628]">
                      {dam.delta > 0 ? `+${dam.delta}%` : `${dam.delta}%`}
                    </td>
                    <td className="py-2.5 px-3">
                      {isDead ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0EE] text-[#B64D3C] border border-[#B64D3C]/40">
                          DEAD STORAGE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40">
                          SAFE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservoirStorage;
