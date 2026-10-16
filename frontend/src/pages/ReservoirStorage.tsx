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
            <Database className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t.nav.reservoirs}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
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
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-750'
              }`}
            >
              {language === 'mr' ? d.name_mr : d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-navy-900 border border-navy-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Aggregate Live Storage
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                res.aggregate_storage_pct < 25 ? 'text-red-400' : 'text-cyan-300'
              }`}
            >
              {res.aggregate_storage_pct}%
            </span>
            <span className="text-xs font-medium text-slate-400">of live capacity</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Reference normal: 68% (Delta: {res.aggregate_storage_pct - 68}%)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-navy-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Drinking Water Security
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                res.drinking_water_security_days < 90 ? 'text-red-400' : 'text-teal-300'
              }`}
            >
              {res.drinking_water_security_days}
            </span>
            <span className="text-xs font-medium text-slate-400">days buffer</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {res.drinking_water_security_days < 90
              ? 'CRITICAL: Below 90 days reserve buffer'
              : 'Adequate municipal drinking quota secured'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-navy-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Dead Storage Alert Count
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-orange-400">
              {res.dams.filter((d) => d.dead_storage_alert).length}
            </span>
            <span className="text-xs font-medium text-slate-400">of {res.dams.length} projects</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Water level at or below sill level of intake
          </div>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-navy-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Monitored Capacity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {(res.dams.reduce((acc, curr) => acc + curr.capacity_mcft, 0) / 1000).toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-400">Thousand mcft</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Design gross capacity across monitored dams
          </div>
        </div>
      </div>

      {/* Selected District Reservoirs Detailed Cards */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl">
        <h2 className="text-base font-bold text-white tracking-wide mb-1">
          {selectedDistrict.name} · Reservoir Inventory & Capacity Status
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Detailed operational parameters for key storage projects feeding the district.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {res.dams.map((dam, idx) => {
            const isCritical = dam.live_storage_pct < 25;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border bg-navy-950/80 transition-all ${
                  dam.dead_storage_alert
                    ? 'border-red-500/50 shadow-red-950/20'
                    : 'border-navy-800 hover:border-navy-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-white">{dam.name}</h3>
                  {dam.dead_storage_alert ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 shrink-0">
                      DEAD STORAGE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
                      OPERATIONAL
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  River Basin: <strong className="text-slate-300">{dam.river}</strong>
                </div>

                {/* Live Storage Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Live Storage vs 68% Ref Normal</span>
                    <span
                      className={`font-mono font-bold ${
                        isCritical ? 'text-red-400' : 'text-teal-300'
                      }`}
                    >
                      {dam.live_storage_pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-navy-900 rounded-full overflow-hidden border border-navy-800 relative">
                    {/* 10-year reference normal marker */}
                    <div
                      style={{ left: '68%' }}
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                      title="10-Year Reference Normal (68%)"
                    />
                    <div
                      style={{ width: `${dam.live_storage_pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-red-500' : 'bg-teal-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800 flex justify-between text-[11px] text-slate-400">
                  <span>Gross Design:</span>
                  <span className="font-mono text-slate-200">
                    {dam.capacity_mcft.toLocaleString()} mcft
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current vs 10-Year Reference Storage Comparison Chart */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {selectedDistrict.name} · Current vs Reference Normal Storage (%)
            </h2>
            <p className="text-xs text-slate-400">
              Comparison between current live storage percentage and the 10-year post-monsoon normal benchmark (68%).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 bg-cyan-400 rounded-sm" /> Current Live Storage (%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 bg-slate-500 rounded-sm" /> 10-Yr Benchmark (68%)
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={damChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f3e5f" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e1f33',
                  borderColor: '#1f3e5f',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="currentStoragePct" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Current Live Storage (%)" />
              <Bar dataKey="referenceNormalPct" fill="#475569" radius={[4, 4, 0, 0]} name="10-Year Benchmark (68%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Major Reservoirs Status Table */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl overflow-hidden">
        <h2 className="text-base font-bold text-white tracking-wide mb-1">
          Regional Marathwada Major Reservoirs Status Table
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Combined surface storage inventory across all 8 districts with critical dead storage indicators.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 border-b border-navy-800 font-semibold">
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
            <tbody className="divide-y divide-navy-800/60 font-medium text-slate-300">
              {regionalMajorDams.map((dam, idx) => {
                const isDead = dam.dead_storage_alert;
                return (
                  <tr key={idx} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{dam.name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{dam.districtName}</td>
                    <td className="py-2.5 px-3 text-slate-400">{dam.river}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{dam.capacity_mcft.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{dam.live_storage_pct}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">68.0%</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400">
                      {dam.delta > 0 ? `+${dam.delta}%` : `${dam.delta}%`}
                    </td>
                    <td className="py-2.5 px-3">
                      {isDead ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          DEAD STORAGE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
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
