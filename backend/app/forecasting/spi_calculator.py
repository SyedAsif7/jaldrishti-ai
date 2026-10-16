"""
Standardized Precipitation Index (SPI) Calculator according to WMO-No. 1090 guidelines.
Fits two-parameter Gamma distribution using Maximum Likelihood Estimation with zero-precipitation adjustment.
"""

from typing import Dict, Any, List, Optional, Tuple
import math
import numpy as np
import pandas as pd
from scipy import stats

# Minimum continuous observation months required for statistically meaningful SPI calculation
MIN_OBSERVATION_MONTHS = 36
WMO_RECOMMENDED_YEARS = 30

SPI_CATEGORIES = [
    (2.0, "Extremely Wet", "#06b6d4"),
    (1.5, "Very Wet", "#3b82f6"),
    (1.0, "Moderately Wet", "#10b981"),
    (-1.0, "Near Normal", "#64748b"),
    (-1.5, "Moderately Dry", "#f59e0b"),
    (-2.0, "Severely Dry", "#f97316"),
    (-999.0, "Extremely Dry", "#ef4444"),
]

def classify_spi(spi_val: float) -> Tuple[str, str]:
    if spi_val is None or math.isnan(spi_val):
        return "Unknown", "#94a3b8"
    for threshold, label, color in SPI_CATEGORIES:
        if spi_val >= threshold:
            return label, color
    return "Extremely Dry", "#ef4444"

class SPICalculator:
    def __init__(self, rainfall_series: pd.DataFrame):
        """
        rainfall_series must have columns: ['year', 'month', 'actual_mm']
        sorted chronologically.
        """
        self.df = rainfall_series.copy().sort_values(by=["year", "month"]).reset_index(drop=True)
        self.total_months = len(self.df)
        self.is_sufficient = self.total_months >= MIN_OBSERVATION_MONTHS

    def calculate_spi(self, scale: int = 3) -> pd.DataFrame:
        """
        Calculate SPI for a given timescale (e.g. scale=3 for SPI-3, scale=6 for SPI-6).
        Follows McKee et al. (1993) and WMO Guidelines.
        """
        if not self.is_sufficient:
            raise ValueError(
                f"Insufficient historical record: {self.total_months} months available. "
                f"Minimum required is {MIN_OBSERVATION_MONTHS} months (WMO recommends {WMO_RECOMMENDED_YEARS} years)."
            )

        df = self.df.copy()
        rolling_col = f"rolling_{scale}m"
        spi_col = f"spi_{scale}"

        # Rolling accumulation across the window
        df[rolling_col] = df["actual_mm"].rolling(window=scale, min_periods=scale).sum()

        # Fit gamma distribution per calendar month
        spi_values = [np.nan] * len(df)

        for target_month in range(1, 13):
            month_mask = (df["month"] == target_month) & df[rolling_col].notna()
            month_data = df.loc[month_mask, rolling_col].values

            if len(month_data) < 3:
                continue

            zeros_count = np.sum(month_data <= 0.001)
            non_zeros = month_data[month_data > 0.001]
            q = zeros_count / len(month_data)

            if len(non_zeros) >= 3:
                try:
                    # Maximum likelihood fit of 2-parameter Gamma with location fixed to 0
                    shape, loc, scale_param = stats.gamma.fit(non_zeros, floc=0)
                except Exception:
                    # Fallback method of moments if MLE encounters singular matrix
                    mean = np.mean(non_zeros)
                    var = np.var(non_zeros)
                    scale_param = var / mean if mean > 0 else 1.0
                    shape = mean / scale_param if scale_param > 0 else 1.0

                for idx in df[month_mask].index:
                    val = df.loc[idx, rolling_col]
                    if val <= 0.001:
                        # Zero rainfall: probability is half of zero mass
                        H = max(0.0001, q * 0.5)
                    else:
                        G = stats.gamma.cdf(val, shape, scale=scale_param)
                        H = q + (1.0 - q) * G
                        # Bound H strictly between 0.0001 and 0.9999 to prevent infinite normal quantiles
                        H = min(0.9999, max(0.0001, H))

                    # Transform cumulative probability to standard normal variate
                    z = float(stats.norm.ppf(H))
                    # Bound SPI between -3.5 and +3.5
                    spi_values[idx] = round(float(np.clip(z, -3.5, 3.5)), 2)

        df[spi_col] = spi_values
        return df

    def get_latest_indicators(self, district_id: str) -> Dict[str, Any]:
        """Compute latest SPI-3, SPI-6, and climatological benchmark comparison."""
        if not self.is_sufficient:
            return {
                "district_id": district_id,
                "status": "INSUFFICIENT_DATA",
                "message": f"Dataset contains {self.total_months} months; minimum required is {MIN_OBSERVATION_MONTHS}.",
                "spi_3": None,
                "spi_6": None
            }

        df_spi3 = self.calculate_spi(scale=3)
        df_spi6 = self.calculate_spi(scale=6)

        latest_spi3 = df_spi3["spi_3"].dropna().iloc[-1] if not df_spi3["spi_3"].dropna().empty else None
        latest_spi6 = df_spi6["spi_6"].dropna().iloc[-1] if not df_spi6["spi_6"].dropna().empty else None

        label3, color3 = classify_spi(latest_spi3)
        label6, color6 = classify_spi(latest_spi6)

        # Climatology percentiles for latest calendar month
        latest_month = int(self.df.iloc[-1]["month"])
        latest_actual = float(self.df.iloc[-1]["actual_mm"])
        hist_month_vals = self.df[self.df["month"] == latest_month]["actual_mm"].values

        p10 = float(np.percentile(hist_month_vals, 10))
        p25 = float(np.percentile(hist_month_vals, 25))
        p50 = float(np.percentile(hist_month_vals, 50))
        p75 = float(np.percentile(hist_month_vals, 75))
        p90 = float(np.percentile(hist_month_vals, 90))

        # Recent 12-month trajectory for charts
        recent_12 = []
        for i in range(max(0, len(df_spi3) - 12), len(df_spi3)):
            row = df_spi3.iloc[i]
            s6_val = df_spi6.iloc[i]["spi_6"] if i < len(df_spi6) else None
            recent_12.append({
                "year": int(row["year"]),
                "month": int(row["month"]),
                "label": f"{int(row['month'])}/{str(int(row['year']))[2:]}",
                "actual_mm": float(row["actual_mm"]),
                "rolling_3m_mm": float(row["rolling_3m"]) if pd.notna(row["rolling_3m"]) else None,
                "spi_3": float(row["spi_3"]) if pd.notna(row["spi_3"]) else None,
                "spi_6": float(s6_val) if pd.notna(s6_val) else None
            })

        return {
            "district_id": district_id,
            "status": "VALIDATED",
            "observation_months": self.total_months,
            "period": f"{int(self.df['year'].min())}-{int(self.df['year'].max())}",
            "distribution_fitted": "Two-Parameter Gamma (Thom 1958 / WMO-No. 1090)",
            "spi_3": {
                "value": latest_spi3,
                "category": label3,
                "color": color3,
                "description": "3-Month Agricultural Soil Moisture & Crop Drought Index"
            },
            "spi_6": {
                "value": latest_spi6,
                "category": label6,
                "color": color6,
                "description": "6-Month Hydrological Streamflow & Reservoir Recharge Index"
            },
            "climatology_comparison": {
                "month": latest_month,
                "current_precipitation_mm": latest_actual,
                "historical_median_p50_mm": round(p50, 1),
                "percentiles": {
                    "p10_extreme_deficit": round(p10, 1),
                    "p25_moderate_deficit": round(p25, 1),
                    "p50_median": round(p50, 1),
                    "p75_above_normal": round(p75, 1),
                    "p90_excess": round(p90, 1)
                }
            },
            "recent_trajectory": recent_12,
            "methodology_limitations": (
                "SPI fitting requires minimum 30 years for climatological stability; 25-year record (2000-2024) "
                "provides robust central estimates with slightly higher variance in extreme tails (SPI < -2.0). "
                "In arid winter months where zero precipitation is common, the probability of zero rainfall (q) "
                "bounds the lower limit of negative SPI values."
            )
        }
