import json
import io
import pandas as pd
from typing import Dict, Any, List, Optional
from app.config import DISTRICTS_DATA_PATH, GEOJSON_PATH
from app.risk_engine import calculate_composite_risk

class DataLoader:
    def __init__(self):
        self._load_data()

    def _load_data(self):
        with open(DISTRICTS_DATA_PATH, "r", encoding="utf-8") as f:
            self.raw_data = json.load(f)

        with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
            self.geojson_data = json.load(f)

        self.districts_map: Dict[str, Dict[str, Any]] = {
            d["id"]: d for d in self.raw_data.get("districts", [])
        }

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "system_metadata": self.raw_data.get("system_metadata", {}),
            "methodology_and_sources": self.raw_data.get("methodology_and_sources", {})
        }

    def get_regional_summary(self) -> Dict[str, Any]:
        return self.raw_data.get("regional_summary", {})

    def get_all_districts(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("districts", [])

    def get_district(self, district_id: str) -> Optional[Dict[str, Any]]:
        return self.districts_map.get(district_id)

    def get_geojson(self) -> Dict[str, Any]:
        with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    def simulate_all_districts(self, weights: Dict[str, float]) -> List[Dict[str, Any]]:
        results = []
        for d in self.raw_data.get("districts", []):
            risk_calc = calculate_composite_risk(
                deficit_pct=d["rainfall"]["deficit_percentage"],
                gw_stress=d["groundwater"]["stress_index"],
                res_storage_pct=d["reservoirs"]["aggregate_storage_pct"],
                weights=weights
            )
            item = {
                "id": d["id"],
                "name": d["name"],
                "name_mr": d["name_mr"],
                "deficit_percentage": d["rainfall"]["deficit_percentage"],
                "groundwater_stress": d["groundwater"]["stress_index"],
                "reservoir_storage_pct": d["reservoirs"]["aggregate_storage_pct"],
                "composite_score": risk_calc["composite_score"],
                "risk_level": risk_calc["risk_level"],
                "risk_color": risk_calc["risk_color"],
                "rainfall_component": risk_calc["rainfall_component"],
                "groundwater_component": risk_calc["groundwater_component"],
                "reservoir_component": risk_calc["reservoir_component"],
                "formula_expression": risk_calc["formula_expression"]
            }
            results.append(item)
        return results

    def generate_csv_report(self, district_id: Optional[str] = None) -> str:
        records = []
        target_districts = (
            [self.districts_map[district_id]]
            if district_id and district_id in self.districts_map
            else self.raw_data.get("districts", [])
        )

        for d in target_districts:
            records.append({
                "District ID": d["id"],
                "District Name": d["name"],
                "Marathi Name": d["name_mr"],
                "Talukas Count": d["talukas_count"],
                "Area (sq km)": d["area_sq_km"],
                "Population (Approx)": d["population"],
                "Rainfall Annual Normal (mm)": d["rainfall"]["annual_normal_mm"],
                "Monsoon Normal (mm)": d["rainfall"]["monsoon_normal_mm"],
                "Monsoon Actual (mm)": d["rainfall"]["monsoon_actual_mm"],
                "Rainfall Deficit (%)": d["rainfall"]["deficit_percentage"],
                "SPI 3-Month Estimate": d["rainfall"]["spi_3month_estimate"],
                "Max Consecutive Dry Days": d["rainfall"]["dry_spell_days_max"],
                "GW Pre-Monsoon Depth (m bgl)": d["groundwater"]["avg_depth_pre_monsoon_m"],
                "GW Post-Monsoon Depth (m bgl)": d["groundwater"]["avg_depth_post_monsoon_m"],
                "GW Fall vs Normal (m)": d["groundwater"]["water_table_fall_m"],
                "Depleted Wells (%)": d["groundwater"]["depleted_wells_pct"],
                "Groundwater Stress Index (0-100)": d["groundwater"]["stress_index"],
                "Stage of GW Extraction (%)": d["groundwater"]["stage_of_extraction_pct"],
                "Critical Talukas Count": d["groundwater"]["critical_talukas_count"],
                "Reservoir Live Storage (%)": d["reservoirs"]["aggregate_storage_pct"],
                "Drinking Security Days": d["reservoirs"]["drinking_water_security_days"],
                "Composite Drought Risk Score (0-100)": d["risk"]["composite_score"],
                "Risk Severity Level": d["risk"]["risk_level"],
                "Data Status": "DEMO DATA ONLY - Not Official Government Declaration"
            })

        df = pd.DataFrame(records)
        output = io.StringIO()
        df.to_csv(output, index=False)
        return output.getvalue()

data_loader = DataLoader()
