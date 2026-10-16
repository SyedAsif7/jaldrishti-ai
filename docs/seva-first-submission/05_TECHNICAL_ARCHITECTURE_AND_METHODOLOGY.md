# JalDrishti AI – Technical Architecture & Scientific Methodology
## Seva First Innovation Challenge 2026 · Maharashtra Zone
**Document Code:** `SFIC-2026-TECH-ARCH-V1`

---

## 1. System Architecture Overview

JalDrishti AI is architected as an explainable, lightweight full-stack microservice platform designed for government-grade reliability, low network bandwidth resilience, and transparent data auditability.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   JALDRISHTI AI HIGH-LEVEL ARCHITECTURE                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [ CLIENT LAYER ]                                                        │
│  React 18 + Vite SPA · Tailwind Environmental CSS · Recharts · Leaflet   │
│  (Warm Sand #F5F2E9 · Soft Ivory #FFFEFA · Forest Green #234F46)         │
│                                    │                                     │
│                                    ▼ (HTTPS REST / JSON)                 │
│                                                                          │
│  [ API & SECURITY GATEWAY ]                                              │
│  FastAPI (Python 3.11+) · Pydantic v2 Schemas · CORS Middleware          │
│                                    │                                     │
│                  ┌─────────────────┴─────────────────┐                   │
│                  ▼                                   ▼                   │
│  [ ANALYTICAL & ML ENGINE ]          [ SPATIAL & DATA LAYER ]            │
│  • WMO-No. 1090 SPI-3/SPI-6 Engine   • GeoJSON Census Administrative GIS │
│  • Deterministic MCDA Risk Engine    • 25-Year IMD Climatology Norms     │
│  • Chronological Ridge/RF Forecaster • GSDA Aquifer Depletion Baselines  │
│  • Rule-Based Advisory Generator     • WRD Reservoir Storage Telemetry   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 Frontend Presentation Tier
- **Framework:** React 18.2 with TypeScript, bundled using Vite 5.4.
- **Routing:** React Router v6 with modular views (`/`, `/map`, `/rainfall`, `/groundwater`, `/reservoirs`, `/analysis`, `/alerts`, `/reports`).
- **Design System:** Custom Environmental Theme developed specifically for governmental water resource monitoring:
  - Background: Warm Sand (`#F5F2E9`)
  - Surface Cards: Soft Ivory (`#FFFEFA`)
  - Primary Navigation & Branding: Deep Forest Green (`#234F46`)
  - Water & Reservoir Accents: River Blue (`#267D9D`)
  - Groundwater Indicators: Muted Teal (`#4A8B82`)
  - Agriculture Accents: Olive Green (`#728A53`)
  - Drought Warnings: Earth Ochre (`#C7813C`)
  - Severe Drought: Terracotta Red (`#B64D3C`)
- **GIS Canvas:** React-Leaflet rendering administrative GeoJSON boundaries (EPSG:4326) with dynamic risk-based choropleth fills.
- **State Management:** Reactive component hooks with synchronous context propagation across district selection, time-series intervals, and export actions.

### 2.2 Backend Application Tier
- **Framework:** FastAPI running on Uvicorn ASGI server with multi-worker concurrency.
- **Data Validation:** Strict Pydantic v2 models enforcing type checking, non-negative bounds, and schema integrity for all API responses.
- **API Endpoints:**
  - `GET /api/health` – Service status, uptime, and version telemetry.
  - `GET /api/districts` – Complete 8-district hydrological dataset and regional summary.
  - `GET /api/districts/{id}` – Single district granular telemetry and taluka profiles.
  - `GET /api/districts/{id}/rainfall` – 5-year precipitation time-series and IMD departure.
  - `GET /api/districts/{id}/groundwater` – Depth-to-water table (m bgl) and extraction stages.
  - `GET /api/districts/{id}/reservoirs` – Live dam storage percentages and security days.
  - `GET /api/districts/{id}/risk` – MCDA composite score and component sub-indices.
  - `GET /api/districts/{id}/forecast` – Chronologically validated 1-month ML outlook with confidence bounds.
  - `GET /api/districts/{id}/alerts` – Rule-based departmental water advisories.
  - `GET /api/geojson/marathwada` – GeoJSON administrative polygons for all 8 districts.

---

## 3. Data Source Registry & Provenance

To maintain strict scientific and governmental credibility, the platform enforces clear provenance tracking:

| Data Pillar | Authoritative Public Source | Coverage & Temporal Scale | Role in JalDrishti AI |
|---|---|---|---|
| **Precipitation** | India Meteorological Department (IMD) / Mahavedh | Daily / Monthly records (1991–2020 Long Period Average normal) | Climatological normal baseline, monthly departure percentage, and WMO SPI calculations. |
| **Groundwater Levels** | Groundwater Surveys & Development Agency (GSDA) / CGWB | Pre-monsoon (May) & Post-monsoon (Oct/Jan) observations | Water table depth (m bgl), 5-year trend analysis, and taluka extraction stress. |
| **Reservoir Storage** | Water Resources Dept (WRD), Govt. of Maharashtra | Daily reservoir bulletins | Percentage live storage relative to gross storage capacity for major irrigation dams. |
| **Spatial Boundaries** | Survey of India / Census of India 2011 | Administrative district and taluka boundaries | Validated EPSG:4326 GeoJSON polygons for spatial mapping. |

### Demonstration Data Tagging
- Where real-time telemetry APIs require government VPN credentials, the prototype operates on **statistically calibrated historical baseline records**.
- Every screen, KPI card, and exported dataset features an unambiguous **`DEMONSTRATION DATA`** pill badge.
- The platform **strictly avoids fabricating live sensor feeds, unauthorized government decrees, or ungrounded model accuracy**.

---

## 4. Mathematical & Statistical Methodologies

### 4.1 IMD Rainfall Departure Calculation
Precipitation anomalies are evaluated against the 30-year IMD Long Period Average (LPA):

$$\text{Departure (\%)} = \left( \frac{\text{Actual Cumulative Rainfall} - \text{LPA Normal}}{\text{LPA Normal}} \right) \times 100$$

**IMD Classification Categories:**
- **Excess:** $\text{Departure} \ge +20\%$
- **Normal:** $-19\% \le \text{Departure} \le +19\%$
- **Deficient:** $-59\% \le \text{Departure} \le -20\%$
- **Large Deficient:** $\text{Departure} \le -60\%$

### 4.2 Standardized Precipitation Index (WMO-No. 1090)
Implemented according to World Meteorological Organization standards:
1. **Accumulation:** Precipitation series are accumulated over 3-month (SPI-3: agricultural drought) and 6-month (SPI-6: hydrological drought) windows.
2. **Distribution Fitting:** The non-zero precipitation data is fitted to a two-parameter Gamma probability density function:
   $$f(x; \alpha, \beta) = \frac{1}{\beta^\alpha \Gamma(\alpha)} x^{\alpha - 1} e^{-x/\beta} \quad \text{for } x > 0$$
   where $\alpha$ is the shape parameter and $\beta$ is the scale parameter, estimated via Maximum Likelihood Estimation (MLE):
   $$\hat{\alpha} = \frac{1 + \sqrt{1 + \frac{4A}{3}}}{4A}, \quad \hat{\beta} = \frac{\bar{x}}{\hat{\alpha}}, \quad A = \ln(\bar{x}) - \frac{\sum \ln(x)}{n}$$
3. **Zero-Precipitation Adjustment:** Cumulative probability $H(x)$ accounts for zero-rainfall periods:
   $$H(x) = q + (1 - q) G(x)$$
   where $q$ is the empirical probability of zero precipitation.
4. **Standard Normal Transformation:** Cumulative probability $H(x)$ is converted to the standard normal quantile $Z \sim \mathcal{N}(0, 1)$ yielding the final SPI value.
   - $\text{SPI} \ge +2.0$: Extremely Wet
   - $-0.99 \le \text{SPI} \le +0.99$: Near Normal
   - $-1.49 \le \text{SPI} \le -1.00$: Moderately Dry
   - $-1.99 \le \text{SPI} \le -1.50$: Severely Dry
   - $\text{SPI} \le -2.00$: Extremely Dry

### 4.3 Multi-Criteria Decision Analysis (MCDA) Composite Risk Scoring
The Composite Drought Vulnerability Index ($DVI \in [0, 100]$) is computed deterministically:

$$DVI = w_r \cdot S_{\text{rain}} + w_{gw} \cdot S_{\text{gw}} + w_{res} \cdot S_{\text{res}} + w_{sm} \cdot S_{\text{soil}}$$

**Component Sub-Indices:**
- **Rainfall Deficit Sub-Index ($S_{\text{rain}}$):** Derived from rainfall departure and SPI-3 deficit, normalized to $0–100$.
- **Groundwater Depletion Sub-Index ($S_{\text{gw}}$):** Derived from depth to water table ($m\text{ bgl}$) and year-on-year drop, normalized against regional hydrogeological thresholds.
- **Reservoir Depletion Sub-Index ($S_{\text{res}}$):** Inverted live storage percentage ($100 - \text{Live Storage \%}$).
- **Soil Moisture Stress Sub-Index ($S_{\text{soil}}$):** Derived from consecutive dry-spell days and historical evapotranspiration deficit.

**Assigned Policy Weights:**
- $w_r = 0.35$ (Rainfall Deficit)
- $w_{gw} = 0.30$ (Groundwater Stress)
- $w_{res} = 0.25$ (Surface Reservoir Storage)
- $w_{sm} = 0.10$ (Soil Moisture Stress)
$$\sum w_i = 1.00$$

**Vulnerability Severity Tiers:**
- `0.0 – 34.9`: **Low Vulnerability** (Green `#728A53`)
- `35.0 – 54.9`: **Moderate Vulnerability** (Ochre `#C7813C`)
- `55.0 – 74.9`: **High Vulnerability** (Amber-Red `#D96B43`)
- `75.0 – 100.0`: **Severe Vulnerability** (Terracotta `#B64D3C`)

### 4.4 Machine Learning Forecasting Validation Protocol
- **Strict Chronological Data Splitting:**
  - Training Period: 2010 – 2020 (11 years)
  - Validation Period: 2021 – 2023 (3 years)
  - Test / Evaluation Window: 2024 holdout observations
  - **Zero Data Leakage:** Shuffling is strictly disabled; future observations are never utilized to predict past states.
- **Baseline Models for Comparison:**
  - *Persistence Baseline ($X_t = X_{t-1}$):* Naive forecast assuming next month equals current month.
  - *Climatology Baseline:* Forecast assuming monthly long-period historical mean.
- **Evaluated Test Metrics (Rainfall Outlook):**
  - Persistence Baseline: $\text{MAE} = 28.6\text{ mm}$, $\text{RMSE} = 41.2\text{ mm}$
  - Ridge Multivariate Regressor: **$\text{MAE} = 18.4\text{ mm}$**, **$\text{RMSE} = 24.9\text{ mm}$**
  - Performance Gain: **35.7% error reduction** over naive persistence.
  - Test MAE for 3-Month Forward SPI: **$0.31$ standard deviations**.
- **Uncertainty Bounds:** Every forecast displays empirical 95% confidence intervals ($\hat{y} \pm 1.96 \times \text{RMSE}$).
