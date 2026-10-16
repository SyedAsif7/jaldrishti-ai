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
    risk_color: d.risk.risk_level === 'Severe' ? '#B64D3C' : d.risk.risk_level === 'High' ? '#C7813C' : '#DE9954',
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
            <Sliders className="w-6 h-6 text-[#234F46]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.analysis}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'पारदर्शक बहु-निकषीय दुष्काळ जोखीम फॉर्म्युला आणि वजन संवेदनशीलता सिम्युलेटर.'
              : 'Deterministic Multi-Criteria Decision Analysis (MCDA) framework with live weight sensitivity simulation.'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFEFA] hover:bg-[#F5F2E9] text-[#25332F] border border-[#D1C9BA] text-xs font-semibold transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#234F46]" />
          <span>Reset Default Weights</span>
        </button>
      </div>

      {/* Explainable Formula Card */}
      <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-[#F2F7F4] text-[#234F46] shrink-0 mt-1 border border-[#234F46]/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#25332F] tracking-wide">
                  Mathematical Formulation & Weight Definition
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40">
                  EXPLAINABLE MCDA
                </span>
              </div>
              <p className="text-xs text-[#68736E] mt-1">
                The Composite Drought Risk Index (CRI) combines three normalized stress indicators without hidden neural weights:
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] font-mono text-xs text-[#234F46] font-bold overflow-x-auto">
              CRI = (w_rain × I_rainfall) + (w_gw × I_groundwater) + (w_res × I_reservoir)
            </div>

            {/* Selected District Concrete Expression */}
            <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] text-xs space-y-1.5 font-mono">
              <div className="text-[#68736E]">
                Evaluation for <strong className="text-[#25332F]">{selectedDistrict.name}</strong> with current weights:
              </div>
              <div className="text-[#A66628] font-bold">
                CRI = ({normRf.toFixed(2)} × {rfComp}) + ({normGw.toFixed(2)} × {gwComp}) + ({normRes.toFixed(2)} × {resComp}) = {currentScore} / 100
              </div>
              <div className="text-[#68736E] text-[11px]">
                Classification: <strong className="text-[#25332F]">{currentRiskLevel}</strong> (Thresholds: Severe ≥75, High 55–74, Moderate 30–54, Low &lt;30)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Weight Sensitivity Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-sm text-[#25332F] mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#234F46]" />
              <span>Weight Sensitivity Controls</span>
            </h3>
            <p className="text-xs text-[#68736E]">
              Adjust policy priorities to see real-time recalculations across all 8 districts.
            </p>
          </div>

          {/* Slider 1: Rainfall */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#25332F]">Rainfall Deficit Weight (w₁)</span>
              <span className="font-mono text-[#267D9D] font-bold">
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
              className="w-full h-2 bg-[#ECE6D8] rounded-lg appearance-none cursor-pointer accent-[#267D9D]"
            />
            <span className="text-[10px] text-[#68736E] block">
              Component: min(100, 1.5 × Deficit%)
            </span>
          </div>

          {/* Slider 2: Groundwater */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#25332F]">Groundwater Stress Weight (w₂)</span>
              <span className="font-mono text-[#4A8B82] font-bold">
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
              className="w-full h-2 bg-[#ECE6D8] rounded-lg appearance-none cursor-pointer accent-[#4A8B82]"
            />
            <span className="text-[10px] text-[#68736E] block">
              Component: GSDA observation stress index (0-100)
            </span>
          </div>

          {/* Slider 3: Reservoir Scarcity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#25332F]">Reservoir Scarcity Weight (w₃)</span>
              <span className="font-mono text-[#C7813C] font-bold">
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
              className="w-full h-2 bg-[#ECE6D8] rounded-lg appearance-none cursor-pointer accent-[#C7813C]"
            />
            <span className="text-[10px] text-[#68736E] block">
              Component: 100 - Live Storage Percentage
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0] text-[11px] text-[#68736E]">
            <strong>Scientific Note:</strong> Weights are automatically normalized to sum to 1.0 (w₁ + w₂ + w₃ = 1.0) ensuring mathematical scale invariance.
          </div>
        </div>

        {/* Live District Re-Rankings Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFEFA] border border-[#E3DDD0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#25332F]">
                Simulated District Rankings under Current Weights
              </h3>
              <p className="text-xs text-[#68736E]">
                Sorted by simulated composite score. Click any row to inspect.
              </p>
            </div>
            {isSimulating && (
              <span className="text-xs text-[#234F46] font-mono animate-pulse">
                Recalculating...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F2E9] text-[#68736E] border-b border-[#E3DDD0] font-semibold">
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
              <tbody className="divide-y divide-[#F0EBE1] font-medium text-[#25332F]">
                {sortedDisplay.map((item, idx) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDistrict(item.id)}
                    className={`cursor-pointer hover:bg-[#F7F4EB] transition-colors ${
                      selectedDistrict.id === item.id ? 'bg-[#F2F7F4] border-l-4 border-l-[#234F46]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-[#8B9691]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#25332F]">
                      {language === 'mr' ? item.name_mr : item.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#267D9D]">
                      {item.rainfall_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#4A8B82]">
                      {item.groundwater_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#A66628]">
                      {item.reservoir_component}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#25332F] text-sm">
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

export default DroughtRiskAnalysis;
