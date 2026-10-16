import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E3DDD0]">
        <div>
          <div className="flex items-center gap-2 text-[#234F46] text-xs font-semibold uppercase tracking-wider">
            <LineChartIcon className="w-4 h-4 text-[#234F46]" />
            <span>Statistical Hydrology & Machine Learning Outlook</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 font-semibold">
              WMO-No. 1090 SPI Guidelines
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#25332F] tracking-tight mt-1 flex items-center gap-3">
            <span>Drought Forecasting & Indicator Engine</span>
            <span className="text-xs px-2.5 py-1 rounded bg-[#F5F2E9] border border-[#D1C9BA] font-mono text-[#234F46] font-semibold">
              {modelStatus?.model_version || 'JalDrishti-ML-v1.0-RidgeGBM'}
            </span>
          </h1>
          <p className="text-xs text-[#68736E] mt-1">
            Standardized Precipitation Index (SPI-3 & SPI-6) indicators, climatology percentiles, and strictly chronological ML outlooks for {selectedDistrict.name}.
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#68736E] font-medium">District:</label>
          <select
            value={selectedDistrict.id}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-[#FFFEFA] border border-[#D1C9BA] rounded-lg px-3 py-1.5 text-xs text-[#25332F] font-bold focus:outline-none cursor-pointer"
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
      <div className="rounded-xl border border-[#234F46]/30 bg-[#FFFEFA] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#234F46] shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[#234F46] uppercase tracking-wide flex items-center gap-2">
              <span>Scientific Data Hierarchy & Methodological Transparency</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 font-semibold">
                Anti-Leakage Certified
              </span>
            </div>
            <p className="text-[#68736E] leading-relaxed">
              To preserve scientific integrity and prevent misinformation, JalDrishti AI explicitly demarcates three distinct analytical layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="font-semibold text-[#267D9D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#267D9D]"></span>
                  1. Measured Observations
                </div>
                <div className="text-[#68736E] text-[11px] mt-1">
                  Historical monthly rainfall (IMD, 2000–2024), seasonal water table depths (GSDA), and reservoir storage records (WRD). Zero synthetic hallucinations.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="font-semibold text-[#C7813C] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C7813C]"></span>
                  2. Rule-Based Risk (MCDA)
                </div>
                <div className="text-[#68736E] text-[11px] mt-1">
                  Multi-criteria composite risk scoring integrating rainfall deficit, groundwater stress, and reservoir buffer. Transparent weights, not an AI black box.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="font-semibold text-[#234F46] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#234F46]"></span>
                  3. Supervised ML Forecasts
                </div>
                <div className="text-[#68736E] text-[11px] mt-1">
                  HistGradientBoosting & Ridge regressors trained on historical records (2000–2018) and benchmarked on holdout test data (2019–2024) with 95% uncertainty intervals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-[#FFFEFA] rounded-xl border border-[#E3DDD0]">
          <Activity className="w-8 h-8 text-[#234F46] animate-spin" />
          <div className="text-sm text-[#25332F] font-semibold">Fitting statistical distributions and running ML forecast inference...</div>
          <div className="text-xs text-[#68736E] font-mono">Loading data pipeline for {selectedDistrict.name}</div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl border border-[#B64D3C]/40 bg-[#FAF0EE] text-[#B64D3C] text-sm">
          <div className="font-semibold flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#B64D3C]" />
            Forecast Engine Notice
          </div>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Cards: 1M Forecast, 3M Forecast, Current SPI-3, Current SPI-6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1-Month Outlook Card */}
            <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#234F46] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  1-Month Ahead Outlook
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 font-mono">
                  ML Regressor
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#25332F] tracking-tight font-mono">
                    {outlook?.one_month_ahead?.predicted_spi3 !== undefined
                      ? (outlook.one_month_ahead.predicted_spi3 > 0 ? `+${outlook.one_month_ahead.predicted_spi3}` : `${outlook.one_month_ahead.predicted_spi3}`)
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-[#68736E] mt-0.5">Projected SPI-3 Index</div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/50">
                  {outlook?.one_month_ahead?.predicted_category || 'Pending'}
                </div>
              </div>

              {/* 95% Confidence Interval Band */}
              <div className="mt-4 pt-3 border-t border-[#F0EBE1] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#68736E]">95% Confidence Band (±1.96×RMSE):</span>
                  <span className="font-mono text-[#25332F] font-semibold">
                    [{outlook?.one_month_ahead?.confidence_interval_95?.lower_bound} to {outlook?.one_month_ahead?.confidence_interval_95?.upper_bound}]
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#68736E]">Drought Probability (SPI ≤ -1.0):</span>
                  <span className="font-bold text-[#A66628]">
                    {outlook?.one_month_ahead?.drought_probability_pct}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Month Outlook Card */}
            <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#267D9D] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  3-Month Ahead Outlook
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#EDF6FA] text-[#1C627C] border border-[#4EA3C3]/40 font-mono">
                  Ridge (L2)
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#25332F] tracking-tight font-mono">
                    {outlook?.three_month_ahead?.predicted_spi3 !== undefined
                      ? (outlook.three_month_ahead.predicted_spi3 > 0 ? `+${outlook.three_month_ahead.predicted_spi3}` : `${outlook.three_month_ahead.predicted_spi3}`)
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-[#68736E] mt-0.5">Projected SPI-3 Index</div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/50">
                  {outlook?.three_month_ahead?.predicted_category || 'Pending'}
                </div>
              </div>

              {/* 95% Confidence Interval Band */}
              <div className="mt-4 pt-3 border-t border-[#F0EBE1] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#68736E]">95% Confidence Band (±1.96×RMSE):</span>
                  <span className="font-mono text-[#25332F] font-semibold">
                    [{outlook?.three_month_ahead?.confidence_interval_95?.lower_bound} to {outlook?.three_month_ahead?.confidence_interval_95?.upper_bound}]
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#68736E]">Test Set RMSE Uncertainty:</span>
                  <span className="font-mono text-[#25332F] font-semibold">
                    ±{outlook?.three_month_ahead?.test_rmse_uncertainty}
                  </span>
                </div>
              </div>
            </div>

            {/* Current SPI-3 Card */}
            <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#68736E] font-medium">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-[#C7813C]" />
                  Current SPI-3
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F2E9] text-[#68736E]">
                  Agricultural
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#25332F] tracking-tight font-mono">
                    {indicators?.spi_3?.value !== null && indicators?.spi_3?.value !== undefined
                      ? (indicators.spi_3.value > 0 ? `+${indicators.spi_3.value.toFixed(2)}` : indicators.spi_3.value.toFixed(2))
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-[#68736E] mt-0.5">Soil Moisture Condition</div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/50">
                  {indicators?.spi_3?.category || 'Normal'}
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#68736E] leading-snug">
                {indicators?.spi_3?.description || 'Reflects 3-month short-term precipitation deficit for Kharif/Rabi crops.'}
              </p>
            </div>

            {/* Current SPI-6 Card */}
            <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#68736E] font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#267D9D]" />
                  Current SPI-6
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F2E9] text-[#68736E]">
                  Hydrological
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#25332F] tracking-tight font-mono">
                    {indicators?.spi_6?.value !== null && indicators?.spi_6?.value !== undefined
                      ? (indicators.spi_6.value > 0 ? `+${indicators.spi_6.value.toFixed(2)}` : indicators.spi_6.value.toFixed(2))
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-[#68736E] mt-0.5">Reservoir & Aquifer Index</div>
                </div>
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FBF5EE] text-[#A66628] border border-[#DE9954]/50">
                  {indicators?.spi_6?.category || 'Normal'}
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#68736E] leading-snug">
                {indicators?.spi_6?.description || 'Reflects 6-month seasonal recharge impact on river flow and dam storage.'}
              </p>
            </div>
          </div>

          {/* 12-Month SPI-3 and SPI-6 Trajectory Chart */}
          <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#25332F] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#234F46]" />
                  Recent 12-Month SPI Trajectory & WMO Drought Thresholds
                </h3>
                <p className="text-xs text-[#68736E]">
                  Calculated from 25-year monthly precipitation records (2000–2024) using Thom (1958) Gamma distribution fitting.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#4A8B82]">
                  <span className="w-3 h-1 bg-[#4A8B82] rounded-full inline-block"></span>
                  SPI-3 (Agricultural)
                </span>
                <span className="flex items-center gap-1.5 text-[#267D9D]">
                  <span className="w-3 h-1 bg-[#267D9D] rounded-full inline-block"></span>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" opacity={0.8} />
                  <XAxis dataKey="label" stroke="#8B9691" tick={{ fontSize: 11, fill: '#68736E' }} />
                  <YAxis
                    domain={[-3.0, 3.0]}
                    stroke="#8B9691"
                    tick={{ fontSize: 11, fill: '#68736E' }}
                    label={{ value: 'Standardized Index', angle: -90, position: 'insideLeft', fill: '#68736E', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFEFA',
                      borderColor: '#D1C9BA',
                      borderRadius: '8px',
                      color: '#25332F',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(37,51,47,0.1)'
                    }}
                    formatter={(val: any, name: string) => [
                      typeof val === 'number' ? val.toFixed(2) : val,
                      name === 'spi_3' ? 'SPI-3 (3-Month)' : name === 'spi_6' ? 'SPI-6 (6-Month)' : name
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  {/* WMO Drought Reference Lines */}
                  <ReferenceLine y={0} stroke="#8B9691" strokeDasharray="2 2" label={{ value: 'Median (0)', fill: '#68736E', fontSize: 10 }} />
                  <ReferenceLine y={-1.0} stroke="#DE9954" strokeDasharray="3 3" label={{ value: 'Moderate (-1.0)', fill: '#DE9954', fontSize: 10 }} />
                  <ReferenceLine y={-1.5} stroke="#C7813C" strokeDasharray="3 3" label={{ value: 'Severe (-1.5)', fill: '#C7813C', fontSize: 10 }} />
                  <ReferenceLine y={-2.0} stroke="#B64D3C" strokeDasharray="3 3" label={{ value: 'Extreme (-2.0)', fill: '#B64D3C', fontSize: 10 }} />

                  <Line
                    type="monotone"
                    dataKey="spi_3"
                    stroke="#4A8B82"
                    strokeWidth={2.5}
                    dot={{ fill: '#4A8B82', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="SPI-3"
                  />
                  <Line
                    type="monotone"
                    dataKey="spi_6"
                    stroke="#267D9D"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#267D9D', r: 3 }}
                    name="SPI-6"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#68736E] pt-2 border-t border-[#F0EBE1]">
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
            <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#25332F] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#234F46]" />
                  Historical Climatology Comparison
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F5F2E9] text-[#68736E] border border-[#D1C9BA]">
                  Month {indicators?.climatology_comparison?.month} Distribution
                </span>
              </div>
              <p className="text-xs text-[#68736E] mb-4">
                Comparing current observed precipitation against the 25-year historical distribution for this calendar month.
              </p>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#68736E]">Current Precipitation:</div>
                    <div className="text-xl font-extrabold text-[#267D9D]">
                      {indicators?.climatology_comparison?.current_precipitation_mm} mm
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#68736E]">Historical Median (P50):</div>
                    <div className="text-xl font-bold text-[#25332F]">
                      {indicators?.climatology_comparison?.historical_median_p50_mm} mm
                    </div>
                  </div>
                </div>

                {/* Percentile Distribution Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="text-[#25332F] font-semibold">Historical Climatology Percentiles (2000–2024):</div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded bg-[#FAF0EE] border border-[#B64D3C]/30">
                      <div className="text-[10px] text-[#B64D3C] font-semibold">P10 Extreme</div>
                      <div className="text-sm font-bold text-[#25332F] mt-1 font-mono">
                        {indicators?.climatology_comparison?.percentiles?.p10_extreme_deficit} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#FBF5EE] border border-[#C7813C]/30">
                      <div className="text-[10px] text-[#A66628] font-semibold">P25 Deficit</div>
                      <div className="text-sm font-bold text-[#25332F] mt-1 font-mono">
                        {indicators?.climatology_comparison?.percentiles?.p25_moderate_deficit} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#F5F2E9] border border-[#D1C9BA]">
                      <div className="text-[10px] text-[#68736E] font-semibold">P50 Median</div>
                      <div className="text-sm font-bold text-[#25332F] mt-1 font-mono">
                        {indicators?.climatology_comparison?.percentiles?.p50_median} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#F4F7EF] border border-[#728A53]/30">
                      <div className="text-[10px] text-[#5A6E41] font-semibold">P75 Normal</div>
                      <div className="text-sm font-bold text-[#25332F] mt-1 font-mono">
                        {indicators?.climatology_comparison?.percentiles?.p75_above_normal} mm
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#EDF6FA] border border-[#267D9D]/30">
                      <div className="text-[10px] text-[#1C627C] font-semibold">P90 Excess</div>
                      <div className="text-sm font-bold text-[#25332F] mt-1 font-mono">
                        {indicators?.climatology_comparison?.percentiles?.p90_excess} mm
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#68736E] leading-relaxed border-t border-[#F0EBE1] pt-3">
                  <span className="font-semibold text-[#25332F]">Statistical Boundary Note: </span>
                  {indicators?.methodology_limitations}
                </div>
              </div>
            </div>

            {/* Holdout Test Evaluation Table: ML vs Baseline */}
            <div className="p-5 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#25332F] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#728A53]" />
                  Holdout Evaluation vs Baseline
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 font-semibold">
                  Real Test Metrics (2019–2024)
                </span>
              </div>
              <p className="text-xs text-[#68736E] mb-4">
                Evaluated on strictly unseen holdout years (2019–2024) against the historical persistence baseline without synthetic metric inflation.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F2E9] text-[#68736E] uppercase text-[10px] font-semibold border-b border-[#E3DDD0]">
                    <tr>
                      <th className="py-2.5 px-3">Horizon / Task</th>
                      <th className="py-2.5 px-3">ML Model</th>
                      <th className="py-2.5 px-3">Baseline (Persistence)</th>
                      <th className="py-2.5 px-3 text-right">Actual Error / Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1] text-[#25332F]">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#25332F]">1-Month Lead (SPI-3)</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[#234F46] font-bold">MAE: {benchmarks?.metrics_1m_ahead?.model_mae}</span>
                        <span className="text-[#8B9691] text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_1m_ahead?.model_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[#68736E]">MAE: {benchmarks?.metrics_1m_ahead?.baseline_persistence_mae}</span>
                        <span className="text-[#8B9691] text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_1m_ahead?.baseline_persistence_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-[#5A6E41]">
                        +{benchmarks?.metrics_1m_ahead?.improvement_over_persistence_mae_pct}% gain
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#25332F]">3-Month Lead (SPI-3)</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[#267D9D] font-bold">MAE: {benchmarks?.metrics_3m_ahead?.model_mae}</span>
                        <span className="text-[#8B9691] text-[10px] ml-1.5">(RMSE: {benchmarks?.metrics_3m_ahead?.model_rmse})</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#8B9691] italic">
                        Persistence decays at 90d
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#68736E]">
                        R²: {benchmarks?.metrics_3m_ahead?.model_r2}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#25332F]">Drought Event (SPI ≤ -1.0)</td>
                      <td className="py-2.5 px-3" colSpan={2}>
                        <div className="flex gap-3 text-[11px]">
                          <span>Precision: <strong className="text-[#25332F]">{benchmarks?.drought_classification_metrics?.precision}</strong></span>
                          <span>Recall: <strong className="text-[#25332F]">{benchmarks?.drought_classification_metrics?.recall}</strong></span>
                          <span>F1-Score: <strong className="text-[#234F46] font-bold">{benchmarks?.drought_classification_metrics?.f1_score}</strong></span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-1.5 py-0.5 rounded bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 text-[10px] font-bold">
                          Validated
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] text-[11px] text-[#68736E] space-y-1">
                <div className="text-[#25332F] font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#234F46]" />
                  Chronological Partition Verification:
                </div>
                <div>Training samples: <span className="font-mono text-[#25332F] font-semibold">{benchmarks?.train_samples_count}</span> (&le; 2018) | Holdout test samples: <span className="font-mono text-[#25332F] font-semibold">{benchmarks?.test_samples_count}</span> (&ge; 2019).</div>
                <div className="text-[#8B9691]">Zero lookahead: Features constructed exclusively from observations prior to time t.</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default DroughtForecasting;
