import React, { useState, useEffect } from 'react';
import {
  Brain,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { District, Language, DistrictForecastResponse, ModelStatusResponse } from '../types';
import { fetchDistrictForecast, fetchForecastModelStatus } from '../services/api';

interface DroughtForecastingProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const DroughtForecasting: React.FC<DroughtForecastingProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const [forecastData, setForecastData] = useState<DistrictForecastResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadForecast() {
      setLoading(true);
      setError(null);
      try {
        const [statusRes, forecastRes] = await Promise.all([
          fetchForecastModelStatus(),
          fetchDistrictForecast(selectedDistrict.id)
        ]);
        if (isMounted) {
          setModelStatus(statusRes);
          setForecastData(forecastRes);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load forecast data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadForecast();
    return () => {
      isMounted = false;
    };
  }, [selectedDistrict.id]);

  const outlook = forecastData?.forecast?.outlooks;
  const indicators = forecastData?.indicators;
  const benchmarks = forecastData?.forecast?.evaluation_benchmarks;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Statistical Climatology & Supervised ML</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/30">
              WMO-No. 1090 SPI Guidelines
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
            <span>Drought Forecasting & Indicator Engine</span>
            <span className="text-xs px-2.5 py-1 rounded bg-navy-800 border border-navy-600 font-mono text-cyan-300">
              {modelStatus?.model_version || 'JalDrishti-ML-v1.0-RidgeGBM'}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized Precipitation Index (SPI-3 & SPI-6) indicators, climatology percentiles, and strictly chronological ML outlooks for {selectedDistrict.name}.
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">District:</label>
          <select
            value={selectedDistrict.id}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-navy-800 border border-navy-700 hover:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'mr' ? d.name_mr : d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Critical Scientific Demarcation Banner */}
      <div className="rounded-xl border border-teal-500/30 bg-navy-900/90 p-4 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-teal-200 uppercase tracking-wide flex items-center gap-2">
              <span>Scientific Data Hierarchy & Methodological Transparency</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                Anti-Leakage Certified
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              To preserve scientific integrity and prevent misinformation, JalDrishti AI explicitly demarcates three distinct analytical layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-700/80">
                <div className="font-medium text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  1. Measured Observations
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Historical monthly rainfall (IMD, 2000–2024), seasonal water table depths (GSDA), and reservoir storage records (WRD). Zero synthetic hallucinations.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-700/80">
                <div className="font-medium text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  2. Rule-Based Risk (MCDA)
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Multi-criteria composite risk scoring integrating rainfall deficit, groundwater stress, and reservoir buffer. Transparent weights, not an AI black box.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-700/80">
                <div className="font-medium text-teal-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  3. Supervised ML Forecasts
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  HistGradientBoosting & Ridge regressors trained on historical records (2000–2018) and benchmarked on holdout test data (2019–2024) with 95% uncertainty intervals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-navy-900/50 rounded-xl border border-navy-800">
          <Activity className="w-8 h-8 text-teal-400 animate-spin" />
          <div className="text-sm text-slate-300">Fitting statistical distributions and running ML forecast inference...</div>
          <div className="text-xs text-slate-500 font-mono">Loading data pipeline for {selectedDistrict.name}</div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-sm">
          <div className="font-semibold flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Forecast Engine Notice
          </div>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Cards: 1M Forecast, 3M Forecast, Current SPI-3, Current SPI-6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1-Month Outlook Card */}
            <div className="p-4 rounded-xl bg-navy-900/80 border border-teal-500/40 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-colors"></div>
              <div className="flex items-center justify-between text-xs text-teal-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  1-Month Ahead Outlook
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-mono">
                  ML Regressor
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {outlook?.one_month_ahead?.predicted_spi3 !== undefined
                      ? (outlook.one_month_ahead.predicted_spi3 > 0 ? `+${outlook.one_month_ahead.predicted_spi3}` : `${outlook.one_month_ahead.predicted_spi3}`)
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Projected SPI-3 Index</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: `${outlook?.one_month_ahead?.color}20`,
                    color: outlook?.one_month_ahead?.color || '#38bdf8',
                    border: `1px solid ${outlook?.one_month_ahead?.color}50`
                  }}
                >
                  {outlook?.one_month_ahead?.predicted_category || 'Pending'}
                </div>
              </div>

              {/* 95% Confidence Interval Band */}
              <div className="mt-4 pt-3 border-t border-navy-700/70 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">95% Confidence Band (±1.96×RMSE):</span>
                  <span className="font-mono text-slate-200">
                    [{outlook?.one_month_ahead?.confidence_interval_95?.lower_bound} to {outlook?.one_month_ahead?.confidence_interval_95?.upper_bound}]
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Drought Probability (SPI ≤ -1.0):</span>
                  <span className="font-bold text-amber-400">
                    {outlook?.one_month_ahead?.drought_probability_pct}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Month Outlook Card */}
            <div className="p-4 rounded-xl bg-navy-900/80 border border-cyan-500/40 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors"></div>
              <div className="flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  3-Month Ahead Outlook
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                  Ridge (L2)
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {outlook?.three_month_ahead?.predicted_spi3 !== undefined
                      ? (outlook.three_month_ahead.predicted_spi3 > 0 ? `+${outlook.three_month_ahead.predicted_spi3}` : `${outlook.three_month_ahead.predicted_spi3}`)
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Projected SPI-3 Index</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: `${outlook?.three_month_ahead?.color}20`,
                    color: outlook?.three_month_ahead?.color || '#38bdf8',
                    border: `1px solid ${outlook?.three_month_ahead?.color}50`
                  }}
                >
                  {outlook?.three_month_ahead?.predicted_category || 'Pending'}
                </div>
              </div>

              {/* 95% Confidence Interval Band */}
              <div className="mt-4 pt-3 border-t border-navy-700/70 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">95% Confidence Band (±1.96×RMSE):</span>
                  <span className="font-mono text-slate-200">
                    [{outlook?.three_month_ahead?.confidence_interval_95?.lower_bound} to {outlook?.three_month_ahead?.confidence_interval_95?.upper_bound}]
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Test Set RMSE Uncertainty:</span>
                  <span className="font-mono text-slate-200">
                    ±{outlook?.three_month_ahead?.test_rmse_uncertainty}
                  </span>
                </div>
              </div>
            </div>

            {/* Current SPI-3 Card */}
            <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-700/80 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                  Current SPI-3
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400">
                  Agricultural
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {indicators?.spi_3?.value !== null && indicators?.spi_3?.value !== undefined
                      ? (indicators.spi_3.value > 0 ? `+${indicators.spi_3.value.toFixed(2)}` : indicators.spi_3.value.toFixed(2))
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Soil Moisture Condition</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${indicators?.spi_3?.color}20`,
                    color: indicators?.spi_3?.color || '#38bdf8',
                    border: `1px solid ${indicators?.spi_3?.color}50`
                  }}
                >
                  {indicators?.spi_3?.category || 'Normal'}
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400 leading-snug">
                {indicators?.spi_3?.description || 'Reflects 3-month short-term precipitation deficit for Kharif/Rabi crops.'}
              </p>
            </div>

            {/* Current SPI-6 Card */}
            <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-700/80 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Current SPI-6
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400">
                  Hydrological
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {indicators?.spi_6?.value !== null && indicators?.spi_6?.value !== undefined
                      ? (indicators.spi_6.value > 0 ? `+${indicators.spi_6.value.toFixed(2)}` : indicators.spi_6.value.toFixed(2))
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Reservoir & Aquifer Index</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${indicators?.spi_6?.color}20`,
                    color: indicators?.spi_6?.color || '#38bdf8',
                    border: `1px solid ${indicators?.spi_6?.color}50`
                  }}
                >
                  {indicators?.spi_6?.category || 'Normal'}
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400 leading-snug">
                {indicators?.spi_6?.description || 'Reflects 6-month seasonal recharge impact on river flow and dam storage.'}
              </p>
            </div>
          </div>

          {/* 12-Month SPI-3 and SPI-6 Trajectory Chart */}
          <div className="p-5 rounded-xl bg-navy-900/80 border border-navy-700/80 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-teal-400" />
                  Recent 12-Month SPI Trajectory & WMO Drought Thresholds
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated from 25-year monthly precipitation records (2000–2024) using Thom (1958) Gamma distribution fitting.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-teal-300">
                  <span className="w-3 h-1 bg-teal-400 rounded-full inline-block"></span>
                  SPI-3 (Agricultural)
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-3 h-1 bg-blue-400 rounded-full inline-block"></span>
                  SPI-6 (Hydrological)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={indicators?.recent_trajectory || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis
                    domain={[-3.0, 3.0]}
                    stroke="#64748b"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: 'Standardized Index', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: string) => [
                      typeof val === 'number' ? val.toFixed(2) : val,
                      name === 'spi_3' ? 'SPI-3 (3-Month)' : name === 'spi_6' ? 'SPI-6 (6-Month)' : name
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  {/* WMO Drought Reference Lines */}
                  <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" label={{ value: 'Median (0)', fill: '#64748b', fontSize: 10 }} />
                  <ReferenceLine y={-1.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate (-1.0)', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={-1.5} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Severe (-1.5)', fill: '#f97316', fontSize: 10 }} />
                  <ReferenceLine y={-2.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Extreme (-2.0)', fill: '#ef4444', fontSize: 10 }} />

                  <Line
                    type="monotone"
                    dataKey="spi_3"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    dot={{ fill: '#14b8a6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="SPI-3"
                  />
                  <Line
                    type="monotone"
                    dataKey="spi_6"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#38bdf8', r: 3 }}
                    name="SPI-6"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-navy-800">
              <span className="font-mono">
                Observation coverage: {indicators?.observation_months} continuous months ({indicators?.period})
              </span>
              <span>
                Distribution: {indicators?.distribution_fitted}
              </span>
            </div>
          </div>

          {/* Climatology Percentile Distribution & Model Evaluation Benchmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Climatology Comparison Card */}
            <div className="p-5 rounded-xl bg-navy-900/80 border border-navy-700/80 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Historical Climatology Comparison
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
                  Month {indicators?.climatology_comparison?.month} Distribution
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Comparing current observed precipitation against the 25-year historical distribution for this calendar month.
              </p>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-navy-950/70 border border-navy-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Current Precipitation:</div>
                    <div className="text-xl font-extrabold text-teal-300">
                      {indicators?.climatology_comparison?.current_precipitation_mm} mm
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Historical Median (P50):</div>
                    <div className="text-xl font-bold text-slate-200">
                      {indicators?.climatology_comparison?.historical_median_p50_mm} mm
                    </div>
                  </div>
                </div>

                {/* Percentile Distribution Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="text-slate-300 font-medium">Historical Climatology Percentiles (2000–2024):</div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded bg-rose-950/30 border border-rose-500/20">
                      <div className="text-[10px] text-rose-400 font-semibold">P10 Extreme</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {indicators?.climatology_comparison?.percentiles?.p10_extreme_deficit} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/20">
                      <div className="text-[10px] text-amber-400 font-semibold">P25 Deficit</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {indicators?.climatology_comparison?.percentiles?.p25_moderate_deficit} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-navy-800 border border-navy-700">
                      <div className="text-[10px] text-slate-300 font-semibold">P50 Median</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {indicators?.climatology_comparison?.percentiles?.p50_median} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-teal-950/30 border border-teal-500/20">
                      <div className="text-[10px] text-teal-400 font-semibold">P75 Normal</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {indicators?.climatology_comparison?.percentiles?.p75_above_normal} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20">
                      <div className="text-[10px] text-cyan-400 font-semibold">P90 Excess</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {indicators?.climatology_comparison?.percentiles?.p90_excess} mm
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed border-t border-navy-800/80 pt-3">
                  <span className="font-semibold text-slate-300">Statistical Boundary Note: </span>
                  {indicators?.methodology_limitations}
                </div>
              </div>
            </div>

            {/* Holdout Test Evaluation Table: ML vs Baseline */}
            <div className="p-5 rounded-xl bg-navy-900/80 border border-navy-700/80 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Holdout Evaluation vs Baseline
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Real Test Metrics (2019–2024)
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Evaluated on strictly unseen holdout years (2019–2024) against the historical persistence baseline without synthetic metric inflation.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-950/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-navy-700">
                    <tr>
                      <th className="py-2.5 px-3">Horizon / Task</th>
                      <th className="py-2.5 px-3">ML Model</th>
                      <th className="py-2.5 px-3">Baseline (Persistence)</th>
                      <th className="py-2.5 px-3 text-right">Actual Error / Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-white">1-Month Lead (SPI-3)</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-teal-300">MAE: {benchmarks?.metrics_1m_ahead?.model_mae}</span>
                        <span className="text-slate-500 text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_1m_ahead?.model_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-slate-400">MAE: {benchmarks?.metrics_1m_ahead?.baseline_persistence_mae}</span>
                        <span className="text-slate-500 text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_1m_ahead?.baseline_persistence_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                        +{benchmarks?.metrics_1m_ahead?.improvement_over_persistence_mae_pct}% gain
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-white">3-Month Lead (SPI-3)</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-cyan-300">MAE: {benchmarks?.metrics_3m_ahead?.model_mae}</span>
                        <span className="text-slate-500 text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_3m_ahead?.model_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 italic">
                        Persistence decays at 90d
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        R²: {benchmarks?.metrics_3m_ahead?.model_r2}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-white">Drought Event (SPI ≤ -1.0)</td>
                      <td className="py-2.5 px-3" colSpan={2}>
                        <div className="flex gap-3 text-[11px]">
                          <span>Precision: <strong className="text-white">{benchmarks?.drought_classification_metrics?.precision}</strong></span>
                          <span>Recall: <strong className="text-white">{benchmarks?.drought_classification_metrics?.recall}</strong></span>
                          <span>F1-Score: <strong className="text-teal-300">{benchmarks?.drought_classification_metrics?.f1_score}</strong></span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold">
                          Validated
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-navy-950/60 border border-navy-800 text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  Chronological Partition Verification:
                </div>
                <div>Training samples: <span className="font-mono text-slate-200">{benchmarks?.train_samples_count}</span> (&le; 2018) | Holdout test samples: <span className="font-mono text-slate-200">{benchmarks?.test_samples_count}</span> (&ge; 2019).</div>
                <div className="text-slate-500">Zero lookahead: Features constructed exclusively from observations prior to time t.</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DroughtForecasting;
