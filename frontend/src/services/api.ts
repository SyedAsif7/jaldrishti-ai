import { District, RegionalSummary, WeightConfig, RiskSimResult, DistrictForecastResponse, ModelStatusResponse, DistrictIndicators } from '../types';
import { fallbackDistricts, fallbackRegionalSummary, districtShapesGeoJSON } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchDistricts(): Promise<District[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/districts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API unavailable, falling back to local dataset:', err);
    return fallbackDistricts;
  }
}

export async function fetchDistrictById(id: string): Promise<District> {
  try {
    const res = await fetch(`${BASE_URL}/api/districts/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API unavailable for district ${id}, using fallback:`, err);
    const d = fallbackDistricts.find(item => item.id === id);
    if (!d) throw new Error(`District ${id} not found`);
    return d;
  }
}

export async function fetchRegionalSummary(): Promise<RegionalSummary> {
  try {
    const res = await fetch(`${BASE_URL}/api/districts/summary`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API unavailable for summary, using fallback:', err);
    return fallbackRegionalSummary;
  }
}

export async function fetchGeoJSON(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/api/geojson`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API unavailable for geojson, using fallback:', err);
    return districtShapesGeoJSON;
  }
}

export async function simulateRisk(weights: WeightConfig): Promise<RiskSimResult[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/risk/simulate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API simulate-all unavailable, performing client-side simulation:', err);
    // Client-side simulation fallback
    const totalW = weights.rainfall_deficit + weights.groundwater_stress + weights.reservoir_scarcity || 1;
    const wRf = weights.rainfall_deficit / totalW;
    const wGw = weights.groundwater_stress / totalW;
    const wRes = weights.reservoir_scarcity / totalW;

    return fallbackDistricts.map(d => {
      const rfComp = Math.min(100, Math.max(0, d.rainfall.deficit_percentage * 1.5));
      const gwComp = Math.min(100, Math.max(0, d.groundwater.stress_index));
      const resComp = Math.min(100, Math.max(0, 100 - d.reservoirs.aggregate_storage_pct));
      const score = Math.round((wRf * rfComp + wGw * gwComp + wRes * resComp) * 10) / 10;
      
      const level = score >= 75 ? 'Severe' : score >= 55 ? 'High' : score >= 30 ? 'Moderate' : 'Low';
      const color = score >= 75 ? '#ef4444' : score >= 55 ? '#f97316' : score >= 30 ? '#eab308' : '#10b981';

      return {
        id: d.id,
        name: d.name,
        name_mr: d.name_mr,
        deficit_percentage: d.rainfall.deficit_percentage,
        groundwater_stress: d.groundwater.stress_index,
        reservoir_storage_pct: d.reservoirs.aggregate_storage_pct,
        composite_score: score,
        risk_level: level,
        risk_color: color,
        rainfall_component: rfComp,
        groundwater_component: gwComp,
        reservoir_component: resComp,
        formula_expression: `CRI = (${wRf.toFixed(2)} × ${rfComp}) + (${wGw.toFixed(2)} × ${gwComp}) + (${wRes.toFixed(2)} × ${resComp}) = ${score}`
      };
    });
  }
}

export function getCsvDownloadUrl(districtId?: string): string {
  const query = districtId ? `?district_id=${encodeURIComponent(districtId)}` : '';
  return `${BASE_URL}/api/reports/csv${query}`;
}

export async function fetchForecastModelStatus(): Promise<ModelStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/forecasts/model-status`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchDistrictForecast(districtId: string): Promise<DistrictForecastResponse> {
  const res = await fetch(`${BASE_URL}/api/forecasts/${encodeURIComponent(districtId)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchAllDistrictIndicators(): Promise<DistrictIndicators[]> {
  const res = await fetch(`${BASE_URL}/api/forecasts/indicators`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchForecastEvaluation(): Promise<{ model_version: string; evaluation_summary: any[] }> {
  const res = await fetch(`${BASE_URL}/api/forecasts/evaluation`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

