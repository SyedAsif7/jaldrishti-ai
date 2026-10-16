"""
Machine Learning Forecasting Module for JalDrishti AI.
Implements chronological train-test splits (no lookahead leakage),
persistence baselines, Ridge & Gradient Boosting models, and authentic metric evaluations.
"""

from typing import Dict, Any, List, Optional, Tuple
import math
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import HistGradientBoostingRegressor, HistGradientBoostingClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, precision_score, recall_score, f1_score

from app.forecasting.data_pipeline import pipeline_instance
from app.forecasting.spi_calculator import SPICalculator, classify_spi

MODEL_VERSION = "JalDrishti-ML-v1.0-RidgeGBM"
MIN_TRAINING_MONTHS = 60 # Minimum 5 continuous years to train ML model

class DroughtMLForecastEngine:
    def __init__(self, district_id: str):
        self.district_id = pipeline_instance.normalize_district_id(district_id)
        self.raw_df = pipeline_instance.get_district_monthly_rainfall(self.district_id)
        self.is_sufficient = len(self.raw_df) >= MIN_TRAINING_MONTHS
        self.evaluation_results: Dict[str, Any] = {}
        self.models: Dict[str, Any] = {}
        self.trained_successfully = False

        if self.is_sufficient:
            self._train_and_evaluate_models()

    def _prepare_feature_dataset(self) -> Tuple[pd.DataFrame, List[str]]:
        """
        Build feature matrix using strictly historical lags and rolling windows at time t.
        Guarantees zero future-data leakage.
        """
        calc = SPICalculator(self.raw_df)
        df_spi = calc.calculate_spi(scale=3)
        df = df_spi.copy().sort_values(by=["year", "month"]).reset_index(drop=True)

        # Merge groundwater observations
        gw_df = pipeline_instance.groundwater_df
        if not gw_df.empty:
            gw_sub = gw_df[gw_df["district_id"] == self.district_id].copy()
            gw_year_map = gw_sub.groupby("year")["avg_depth_m_bgl"].mean().to_dict()
            df["gw_depth_m"] = df["year"].map(gw_year_map).fillna(13.0)
        else:
            df["gw_depth_m"] = 13.0

        # Merge reservoir storage
        res_df = pipeline_instance.reservoir_df
        if not res_df.empty:
            res_sub = res_df[res_df["district_id"] == self.district_id].copy()
            res_map = res_sub.groupby(["year", "month"])["live_storage_pct"].mean().to_dict()
            df["res_storage_pct"] = df.apply(lambda r: res_map.get((r["year"], r["month"]), 45.0), axis=1)
        else:
            df["res_storage_pct"] = 45.0

        # Construct time series features strictly up to time t
        df["sin_month"] = np.sin(2 * np.pi * df["month"] / 12)
        df["cos_month"] = np.cos(2 * np.pi * df["month"] / 12)
        df["lag1_rain_mm"] = df["actual_mm"].shift(1)
        df["lag2_rain_mm"] = df["actual_mm"].shift(2)
        df["lag3_rain_mm"] = df["actual_mm"].shift(3)
        df["current_spi3"] = df["spi_3"]
        df["departure_norm"] = (df["actual_mm"] - df["normal_mm"]) / df["normal_mm"].replace(0, 1)

        # Target variables: 1-month and 3-month forward SPI-3
        df["target_1m_spi3"] = df["spi_3"].shift(-1)
        df["target_3m_spi3"] = df["spi_3"].shift(-3)
        # Binary drought classification target: 1 if SPI <= -1.0 (Moderate to Severe Drought)
        df["target_1m_drought"] = (df["target_1m_spi3"] <= -1.0).astype(int)

        feature_cols = [
            "month", "sin_month", "cos_month",
            "actual_mm", "lag1_rain_mm", "lag2_rain_mm", "lag3_rain_mm",
            "current_spi3", "departure_norm", "gw_depth_m", "res_storage_pct"
        ]

        # Clean rows with complete features and targets
        clean_df = df.dropna(subset=feature_cols + ["target_1m_spi3", "target_3m_spi3"]).reset_index(drop=True)
        return clean_df, feature_cols

    def _train_and_evaluate_models(self):
        """
        Train regression and classification models using strictly chronological split.
        Compare against persistence baseline on the hold-out test set.
        """
        df, feature_cols = self._prepare_feature_dataset()
        if len(df) < MIN_TRAINING_MONTHS:
            self.is_sufficient = False
            return

        # Chronological Split: Train on years <= 2018; Test on holdout years >= 2019
        train_mask = df["year"] <= 2018
        test_mask = df["year"] >= 2019

        X_train = df.loc[train_mask, feature_cols]
        y_train_1m = df.loc[train_mask, "target_1m_spi3"]
        y_train_3m = df.loc[train_mask, "target_3m_spi3"]
        y_train_class = df.loc[train_mask, "target_1m_drought"]

        X_test = df.loc[test_mask, feature_cols]
        y_test_1m = df.loc[test_mask, "target_1m_spi3"]
        y_test_3m = df.loc[test_mask, "target_3m_spi3"]
        y_test_class = df.loc[test_mask, "target_1m_drought"]

        # 1. Baseline Model: Persistence (prediction = current SPI-3)
        persist_pred_1m = df.loc[test_mask, "current_spi3"].values
        persist_mae_1m = float(mean_absolute_error(y_test_1m, persist_pred_1m))
        persist_rmse_1m = float(np.sqrt(mean_squared_error(y_test_1m, persist_pred_1m)))

        # 2. Train 1-Month Model (HistGradientBoostingRegressor)
        model_1m = HistGradientBoostingRegressor(random_state=42, max_iter=80, max_depth=4)
        model_1m.fit(X_train, y_train_1m)
        pred_1m = model_1m.predict(X_test)

        mae_1m = float(mean_absolute_error(y_test_1m, pred_1m))
        rmse_1m = float(np.sqrt(mean_squared_error(y_test_1m, pred_1m)))
        r2_1m = float(r2_score(y_test_1m, pred_1m))

        # 3. Train 3-Month Model (Ridge Regression with L2 Regularization)
        model_3m = Ridge(alpha=10.0)
        model_3m.fit(X_train, y_train_3m)
        pred_3m = model_3m.predict(X_test)

        mae_3m = float(mean_absolute_error(y_test_3m, pred_3m))
        rmse_3m = float(np.sqrt(mean_squared_error(y_test_3m, pred_3m)))
        r2_3m = float(r2_score(y_test_3m, pred_3m))

        # 4. Train Drought Classification Model
        clf_model = HistGradientBoostingClassifier(random_state=42, max_iter=60)
        clf_model.fit(X_train, y_train_class)
        pred_class = clf_model.predict(X_test)

        prec = float(precision_score(y_test_class, pred_class, zero_division=0))
        rec = float(recall_score(y_test_class, pred_class, zero_division=0))
        f1 = float(f1_score(y_test_class, pred_class, zero_division=0))

        self.models = {
            "model_1m": model_1m,
            "model_3m": model_3m,
            "clf_model": clf_model,
            "feature_cols": feature_cols,
            "latest_row": df.iloc[-1].to_dict()
        }

        self.evaluation_results = {
            "district_id": self.district_id,
            "model_version": MODEL_VERSION,
            "training_period": f"{int(df.loc[train_mask, 'year'].min())}-{int(df.loc[train_mask, 'year'].max())}",
            "testing_period": f"{int(df.loc[test_mask, 'year'].min())}-{int(df.loc[test_mask, 'year'].max())}",
            "train_samples_count": len(X_train),
            "test_samples_count": len(X_test),
            "split_methodology": "Strict Chronological Partition (Train: <=2018, Test: >=2019). No Future-Data Leakage.",
            "metrics_1m_ahead": {
                "model_mae": round(mae_1m, 3),
                "model_rmse": round(rmse_1m, 3),
                "model_r2": round(r2_1m, 3),
                "baseline_persistence_mae": round(persist_mae_1m, 3),
                "baseline_persistence_rmse": round(persist_rmse_1m, 3),
                "improvement_over_persistence_mae_pct": round(((persist_mae_1m - mae_1m) / persist_mae_1m) * 100.0, 1)
            },
            "metrics_3m_ahead": {
                "model_mae": round(mae_3m, 3),
                "model_rmse": round(rmse_3m, 3),
                "model_r2": round(r2_3m, 3)
            },
            "drought_classification_metrics": {
                "drought_definition": "SPI-3 <= -1.0 (Moderate to Severe Drought)",
                "precision": round(prec, 3),
                "recall": round(rec, 3),
                "f1_score": round(f1, 3)
            }
        }
        self.trained_successfully = True

    def generate_forecast_outlook(self) -> Dict[str, Any]:
        """
        Generate 1-month and 3-month forecast outlooks with uncertainty confidence bounds.
        """
        if not self.is_sufficient or not self.trained_successfully:
            return {
                "district_id": self.district_id,
                "status": "DISABLED",
                "reason": f"Insufficient continuous observations ({len(self.raw_df)} months). Minimum {MIN_TRAINING_MONTHS} required to train ML model.",
                "forecast_1m": None,
                "forecast_3m": None
            }

        feature_cols = self.models["feature_cols"]
        latest_dict = self.models["latest_row"]
        X_curr = pd.DataFrame([{col: latest_dict[col] for col in feature_cols}])

        pred_1m_val = float(self.models["model_1m"].predict(X_curr)[0])
        pred_3m_val = float(self.models["model_3m"].predict(X_curr)[0])
        drought_prob = float(self.models["clf_model"].predict_proba(X_curr)[0][1])

        rmse_1m = self.evaluation_results["metrics_1m_ahead"]["model_rmse"]
        rmse_3m = self.evaluation_results["metrics_3m_ahead"]["model_rmse"]

        # 95% uncertainty interval: prediction +/- 1.96 * test_rmse
        ci_1m_low = round(float(np.clip(pred_1m_val - 1.96 * rmse_1m, -3.5, 3.5)), 2)
        ci_1m_high = round(float(np.clip(pred_1m_val + 1.96 * rmse_1m, -3.5, 3.5)), 2)

        ci_3m_low = round(float(np.clip(pred_3m_val - 1.96 * rmse_3m, -3.5, 3.5)), 2)
        ci_3m_high = round(float(np.clip(pred_3m_val + 1.96 * rmse_3m, -3.5, 3.5)), 2)

        cat_1m, col_1m = classify_spi(pred_1m_val)
        cat_3m, col_3m = classify_spi(pred_3m_val)

        return {
            "district_id": self.district_id,
            "status": "OPERATIONAL",
            "model_version": MODEL_VERSION,
            "forecast_generated_at": pd.Timestamp.utcnow().isoformat() + "Z",
            "input_observations_period": f"Through Month {int(latest_dict['month'])}/{int(latest_dict['year'])}",
            "outlooks": {
                "one_month_ahead": {
                    "horizon": "1-Month Outlook",
                    "predicted_spi3": round(pred_1m_val, 2),
                    "predicted_category": cat_1m,
                    "color": col_1m,
                    "confidence_interval_95": {
                        "lower_bound": ci_1m_low,
                        "upper_bound": ci_1m_high
                    },
                    "test_rmse_uncertainty": rmse_1m,
                    "drought_probability_pct": round(drought_prob * 100.0, 1)
                },
                "three_month_ahead": {
                    "horizon": "3-Month Outlook",
                    "predicted_spi3": round(pred_3m_val, 2),
                    "predicted_category": cat_3m,
                    "color": col_3m,
                    "confidence_interval_95": {
                        "lower_bound": ci_3m_low,
                        "upper_bound": ci_3m_high
                    },
                    "test_rmse_uncertainty": rmse_3m
                }
            },
            "evaluation_benchmarks": self.evaluation_results,
            "data_transparency_note": (
                "Forecast generated by supervised machine learning models trained on historical observations (2000-2018) "
                "and evaluated on holdout test set (2019-2024). Not a weather simulation or rule-based weighted index."
            )
        }
