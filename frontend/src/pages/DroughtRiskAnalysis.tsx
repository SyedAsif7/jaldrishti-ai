import React, { useState } from 'react';
import { Sliders, RotateCcw, Info, CheckCircle, Calculator, HelpCircle } from 'lucide-react';
import { District, Language, WeightConfig, RiskSimResult } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';
import { simulateRisk } from '../services/api';

interface DroughtRiskAnalysisProps {
  districts: District[];
  selectedDistrict: District;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const DroughtRiskAnalysis: React.FC<DroughtRiskAnalysisProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const t = useTranslation(language);

  // Weights state
  const [weights, setWeights] = useState<WeightConfig>({
    rainfall_deficit: 0.45,
    groundwater_stress: 0.35,
    reservoir_scarcity: 0.20
  });

  const [simResults, setSimResults] = useState<RiskSimResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Normalized weights
  const totalWeight =
    weights.rainfall_deficit + weights.groundwater_stress + weights.reservoir_scarcity || 1;
  const normRf = weights.rainfall_deficit / totalWeight;
  const normGw = weights.groundwater_stress / totalWeight;
  const normRes = weights.reservoir_scarcity / totalWeight;

  const handleSliderChange = (key: keyof WeightConfig, val: number) => {
    const updated = { ...weights, [key]: val };
    setWeights(updated);
    // Trigger simulation
    runSimulation(updated);
  };

  const handleReset = () => {
    const defaultW: WeightConfig = {
      rainfall_deficit: 0.45,
      groundwater_stress: 0.35,
      reservoir_scarcity: 0.20
    };
    setWeights(defaultW);
    runSimulation(defaultW);
  };

  const runSimulation = async (w: WeightConfig) => {
    setIsSimulating(true);
    try {
      const results = await simulateRisk(w);
      setSimResults(results);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Selected district components
  const rfComp = Math.min(100, Math.max(0, selectedDistrict.rainfall.deficit_percentage * 1.5));
  const gwComp = Math.min(100, Math.max(0, selectedDistrict.groundwater.stress_index));
  const resComp = Math.min(100, Math.max(0, 100 - selectedDistrict.reservoirs.aggregate_storage_pct));

  const currentScore =
    Math.round((normRf * rfComp + normGw * gwComp + normRes * resComp) * 10) / 10;
  const currentRiskLevel =
    currentScore >= 75 ? 'Severe' : currentScore >= 55 ? 'High' : currentScore >= 30 ? 'Moderate' : 'Low';

  // Display districts based on simulation or default
  const displayDistricts = simResults || districts.map(d => ({
    id: d.id,
    name: d.name,
    name_mr: d.name_mr,
    deficit_percentage: d.rainfall.deficit_percentage,
    groundwater_stress: d.groundwater.stress_index,
    reservoir_storage_pct: d.reservoirs.aggregate_storage_pct,
    composite_score: d.risk.composite_score,
    risk_level: d.risk.risk_level,
    risk_color: d.risk.risk_level === 'Severe' ? '#ef4444' : d.risk.risk_level === 'High' ? '#f97316' : '#eab308',
    rainfall_component: d.risk.rainfall_component,
    groundwater_component: d.risk.groundwater_component,
    reservoir_component: d.risk.reservoir_component,
    formula_expression: `CRI = (0.45 × ${d.risk.rainfall_component}) + (0.35 × ${d.risk.groundwater_component}) + (0.20 × ${d.risk.reservoir_component}) = ${d.risk.composite_score}`
  }));

  const sortedDisplay = [...displayDistricts].sort(
    (a, b) => b.composite_score - a.composite_score
  );

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t.nav.analysis}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'पारदर्शक बहु-निकषीय दुष्काळ जोखीम फॉर्म्युला आणि वजन संवेदनशीलता सिम्युलेटर.'
              : 'Deterministic Multi-Criteria Decision Analysis (MCDA) framework with live weight sensitivity simulation.'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
          <span>Reset Default Weights</span>
        </button>
      </div>

      {/* Explainable Formula Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-teal-500/30 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0 mt-1">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Mathematical Formulation & Weight Definition
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  EXPLAINABLE MCDA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                The Composite Drought Risk Index (CRI) combines three normalized stress indicators without hidden neural weights:
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 font-mono text-xs text-teal-300 overflow-x-auto">
              CRI = (w_rain × I_rainfall) + (w_gw × I_groundwater) + (w_res × I_reservoir)
            </div>

            {/* Selected District Concrete Expression */}
            <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 text-xs space-y-1.5 font-mono">
              <div className="text-slate-400">
                Evaluation for <strong className="text-white">{selectedDistrict.name}</strong> with current weights:
              </div>
              <div className="text-amber-300 font-bold">
                CRI = ({normRf.toFixed(2)} × {rfComp}) + ({normGw.toFixed(2)} × {gwComp}) + ({normRes.toFixed(2)} × {resComp}) = {currentScore} / 100
              </div>
              <div className="text-slate-400 text-[11px]">
                Classification: <strong className="text-white">{currentRiskLevel}</strong> (Thresholds: Severe ≥75, High 55–74, Moderate 30–54, Low &lt;30)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Weight Sensitivity Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl space-y-6">
          <div>
            <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Weight Sensitivity Controls</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust policy priorities to see real-time recalculations across all 8 districts.
            </p>
          </div>

          {/* Slider 1: Rainfall */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Rainfall Deficit Weight (w₁)</span>
              <span className="font-mono text-teal-300 font-bold">
                {(normRf * 100).toFixed(0)}% (w: {weights.rainfall_deficit.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={weights.rainfall_deficit}
              onChange={(e) => handleSliderChange('rainfall_deficit', parseFloat(e.target.value))}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="text-[10px] text-slate-400 block">
              Component: min(100, 1.5 × Deficit%)
            </span>
          </div>

          {/* Slider 2: Groundwater */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Groundwater Stress Weight (w₂)</span>
              <span className="font-mono text-orange-300 font-bold">
                {(normGw * 100).toFixed(0)}% (w: {weights.groundwater_stress.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={weights.groundwater_stress}
              onChange={(e) => handleSliderChange('groundwater_stress', parseFloat(e.target.value))}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
            <span className="text-[10px] text-slate-400 block">
              Component: GSDA observation stress index (0-100)
            </span>
          </div>

          {/* Slider 3: Reservoir Scarcity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Reservoir Scarcity Weight (w₃)</span>
              <span className="font-mono text-cyan-300 font-bold">
                {(normRes * 100).toFixed(0)}% (w: {weights.reservoir_scarcity.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={weights.reservoir_scarcity}
              onChange={(e) => handleSliderChange('reservoir_scarcity', parseFloat(e.target.value))}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400 block">
              Component: 100 - Live Storage Percentage
            </span>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-400">
            <strong>Scientific Note:</strong> Weights are automatically normalized to sum to 1.0 (w₁ + w₂ + w₃ = 1.0) ensuring mathematical scale invariance.
          </div>
        </div>

        {/* Live District Re-Rankings Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">
                Simulated District Rankings under Current Weights
              </h3>
              <p className="text-xs text-slate-400">
                Sorted by simulated composite score.
              </p>
            </div>
            {isSimulating && (
              <span className="text-xs text-teal-400 font-mono animate-pulse">
                Recalculating...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 border-b border-navy-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Rain Comp</th>
                  <th className="py-2.5 px-3">GW Comp</th>
                  <th className="py-2.5 px-3">Res Comp</th>
                  <th className="py-2.5 px-3">Sim Score</th>
                  <th className="py-2.5 px-3">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-medium text-slate-300">
                {sortedDisplay.map((item, idx) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDistrict(item.id)}
                    className={`cursor-pointer hover:bg-navy-800/40 transition-colors ${
                      selectedDistrict.id === item.id ? 'bg-teal-500/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {language === 'mr' ? item.name_mr : item.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-teal-300">
                      {item.rainfall_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-orange-300">
                      {item.groundwater_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">
                      {item.reservoir_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white text-sm">
                      {item.composite_score}
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
