export type RiskSeverity = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface MonthlyRainfall {
  month: string;
  normal_mm: number;
  actual_mm: number;
  deficit_pct: number;
}

export interface RainfallDetails {
  annual_normal_mm: number;
  monsoon_normal_mm: number;
  monsoon_actual_mm: number;
  deficit_percentage: number;
  spi_3month_estimate: number;
  dry_spell_days_max: number;
  monthly_comparison: MonthlyRainfall[];
}

export interface MonthlyGroundwater {
  month: string;
  depth_m: number;
}

export interface GroundwaterDetails {
  avg_depth_pre_monsoon_m: number;
  avg_depth_post_monsoon_m: number;
  water_table_fall_m: number;
  depleted_wells_pct: number;
  stress_index: number;
  stage_of_extraction_pct: number;
  critical_talukas_count: number;
  monthly_trend: MonthlyGroundwater[];
}

export interface DamDetail {
  name: string;
  river: string;
  capacity_mcft: number;
  live_storage_pct: number;
  dead_storage_alert: boolean;
  status: string;
}

export interface ReservoirDetails {
  aggregate_storage_pct: number;
  drinking_water_security_days: number;
  dams: DamDetail[];
}

export interface AdvisoryItem {
  domain: string;
  severity: string;
  text: string;
}

export interface DistrictRisk {
  rainfall_component: number;
  groundwater_component: number;
  reservoir_component: number;
  composite_score: number;
  risk_level: RiskSeverity;
}

export interface DistrictCoordinates {
  lat: number;
  lng: number;
}

export interface District {
  id: string;
  name: string;
  name_mr: string;
  talukas_count: number;
  talukas: string[];
  area_sq_km: number;
  population: number;
  coordinates: DistrictCoordinates;
  rainfall: RainfallDetails;
  groundwater: GroundwaterDetails;
  reservoirs: ReservoirDetails;
  risk: DistrictRisk;
  advisories: AdvisoryItem[];
}

export interface RegionalSummary {
  total_districts: number;
  total_area_sq_km: number;
  total_population: number;
  overall_risk_level: RiskSeverity;
  average_risk_score: number;
  average_rainfall_deficit_pct: number;
  average_groundwater_stress: number;
  average_reservoir_storage_pct: number;
  districts_in_severe_risk: number;
  districts_in_high_risk: number;
  districts_in_moderate_risk: number;
  districts_in_low_risk: number;
  active_tanker_demand_talukas: number;
  total_talukas: number;
}

export interface WeightConfig {
  rainfall_deficit: number;
  groundwater_stress: number;
  reservoir_scarcity: number;
}

export interface RiskSimResult {
  id: string;
  name: string;
  name_mr: string;
  deficit_percentage: number;
  groundwater_stress: number;
  reservoir_storage_pct: number;
  composite_score: number;
  risk_level: RiskSeverity;
  risk_color: string;
  rainfall_component: number;
  groundwater_component: number;
  reservoir_component: number;
  formula_expression: string;
}

export type PageId =
  | 'overview'
  | 'map'
  | 'forecast'
  | 'rainfall'
  | 'groundwater'
  | 'reservoirs'
  | 'analysis'
  | 'alerts'
  | 'reports';

export type Language = 'en' | 'mr';

export interface ConfidenceInterval95 {
  lower_bound: number;
  upper_bound: number;
}

export interface OutlookDetail {
  horizon: string;
  predicted_spi3: number;
  predicted_category: string;
  color: string;
  confidence_interval_95: ConfidenceInterval95;
  test_rmse_uncertainty: number;
  drought_probability_pct?: number;
}

export interface RegressionMetrics {
  model_mae: number;
  model_rmse: number;
  model_r2: number;
  baseline_persistence_mae?: number;
  baseline_persistence_rmse?: number;
  improvement_over_persistence_mae_pct?: number;
}

export interface ClassificationMetrics {
  drought_definition: string;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface ModelEvaluationResults {
  district_id: string;
  model_version: string;
  training_period: string;
  testing_period: string;
  train_samples_count: number;
  test_samples_count: number;
  split_methodology: string;
  metrics_1m_ahead: RegressionMetrics;
  metrics_3m_ahead: RegressionMetrics;
  drought_classification_metrics: ClassificationMetrics;
}

export interface SPILatestItem {
  value: number | null;
  category: string;
  color: string;
  description: string;
}

export interface ClimatologyComparison {
  month: number;
  current_precipitation_mm: number;
  historical_median_p50_mm: number;
  percentiles: {
    p10_extreme_deficit: number;
    p25_moderate_deficit: number;
    p50_median: number;
    p75_above_normal: number;
    p90_excess: number;
  };
}

export interface SPITrajectoryPoint {
  year: number;
  month: number;
  label: string;
  actual_mm: number;
  rolling_3m_mm: number | null;
  spi_3: number | null;
  spi_6: number | null;
}

export interface DistrictIndicators {
  district_id: string;
  district_name?: string;
  district_name_mr?: string;
  status: string;
  observation_months: number;
  period: string;
  distribution_fitted: string;
  spi_3: SPILatestItem;
  spi_6: SPILatestItem;
  climatology_comparison: ClimatologyComparison;
  recent_trajectory: SPITrajectoryPoint[];
  methodology_limitations: string;
}

export interface DistrictForecastResponse {
  district_id: string;
  district_name: string;
  district_name_mr: string;
  forecast: {
    district_id: string;
    status: string;
    model_version: string;
    forecast_generated_at: string;
    input_observations_period: string;
    outlooks: {
      one_month_ahead: OutlookDetail;
      three_month_ahead: OutlookDetail;
    };
    evaluation_benchmarks: ModelEvaluationResults;
    data_transparency_note: string;
  };
  indicators: DistrictIndicators;
}

export interface ModelStatusResponse {
  model_version: string;
  framework: string;
  training_methodology: string;
  pipeline_metadata: Record<string, unknown>;
  is_model_operational: boolean;
  supported_horizons: string[];
  transparency_notice: string;
}

