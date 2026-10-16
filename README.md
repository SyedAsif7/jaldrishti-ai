# JalDrishti AI – Drought Prediction & Water Intelligence System for Marathwada
### Seva First Innovation Challenge 2026 · Government of Maharashtra
*Individual Innovation Project targeting drought resilience, groundwater conservation, and surface storage intelligence across the 8 districts of Marathwada.*

---

## 💧 Executive Summary
**JalDrishti AI** is a decision-support and water intelligence platform designed specifically for the drought-vulnerable Marathwada division of Maharashtra, comprising eight districts:
1. **Chhatrapati Sambhajinagar**
2. **Jalna**
3. **Beed**
4. **Dharashiv (Osmanabad)**
5. **Latur**
6. **Nanded**
7. **Parbhani**
8. **Hingoli**

The platform integrates meteorological precipitation deficits, hydrogeological groundwater depletion, and surface reservoir storage levels into an **explainable, deterministic Multi-Criteria Decision Analysis (MCDA)** composite risk index.

---

## 🏛️ Scientific Transparency & Demo Notice
> [!IMPORTANT]
> **DEMONSTRATION SIMULATION DATA**:
> All district hydrological metrics, weather observations, and reservoir capacities in this prototype are synthetic demo parameters modeled after Marathwada's historical baseline data.
> - **Not an AI Blackbox**: The risk score is an explainable weighted linear combination, not a trained neural network prediction.
> - **Pre-Deployment**: This prototype is developed for the *Seva First Innovation Challenge 2026* and is not an official disaster declaration platform.
> - **Telemetry Roadmap**: Real-time integration with Mahavedh AWS, GSDA DWLRs, and WRD telemetry is outlined in [`ROADMAP.md`](file:///c:/Users/as/Desktop/jaldrishti-prototype/ROADMAP.md).

---

## 🛠️ Tech Stack
- **Frontend**:
  - React 18 + TypeScript + Vite
  - Tailwind CSS (Government dark navy SaaS aesthetic: `#060d17`, `#0a1626`, `#14b8a6`, `#06b6d4`)
  - Recharts (Rainfall departures, cumulative curves, hydrographs, storage bars)
  - Leaflet + React-Leaflet + OpenStreetMap (Interactive GIS choropleth map with verified district polygons)
  - Lucide React (Accessible semantic iconography)
  - Bilingual Localization (English and Marathi मराठी toggle)
- **Backend**:
  - Python 3.13 + FastAPI
  - Pandas & NumPy (Data transformation, clamping, weight normalization, and analytical matrices)
  - Pydantic v2 (Strict request/response schema validation)
  - Pytest + HTTPX (Comprehensive test suite)
- **Data & GIS**:
  - Structured GeoJSON for 8 Marathwada district boundaries
  - Local JSON seed datasets with full indicators dictionary

---

## 📑 Core Modules & Pages
1. **Overview Dashboard**: Regional composite risk gauge, district ranking matrix, priority warnings for severe-tier districts (Beed & Dharashiv), and administrative contingency status.
2. **Marathwada Drought Risk Map**: Interactive Leaflet vector choropleth map with dynamic risk coloring, polygon hover effects, click-to-select district inspection, coordinate pins, and basemap switcher (Esri Dark Gray, OSM, Esri Satellite).
3. **Drought Forecasting & ML Outlook**: Operational 1-Month and 3-Month ahead outlooks ($\pm 1.96 \times \text{RMSE}$ 95% confidence intervals), WMO-No. 1090 SPI-3 and SPI-6 indicators, historical climatology percentile comparison (P10 to P90), and real test set benchmark table against persistence baselines.
4. **Rainfall Intelligence**: Actual vs Normal rainfall departures against 50-year IMD LPA, cumulative precipitation accumulation curves, SPI-3 estimates, and dry spell risk flags.
5. **Groundwater Monitoring**: Pre- vs Post-monsoon water table depth (m bgl) hydrographs, % observation wells with >2m drop, and groundwater extraction development stages (over-exploited vs critical).
6. **Reservoir & Storage**: Live storage tracking for major dams (Jayakwadi, Majalgaon, Yeldari, Manjara, Lower Terna, Sina Kolegaon, Vishnupuri), dead storage alerts, and municipal drinking water buffer countdowns.
7. **Drought Risk Analysis**: Transparent explainable formula interface with interactive sensitivity sliders ($w_1, w_2, w_3$) enabling live regional recalculation without blackbox ML.
8. **Alerts & Recommendations**: Actionable guidance categorized across Agriculture, Drinking Water, Tanker Contingency, and Groundwater Regulation with severity filters.
9. **Reports & Sources**: One-click downloadable CSV district dossiers, print-ready executive summary, data dictionary, and multi-phase roadmap.

---

## 📐 Mathematical Formulation of Composite Drought Risk

$$\text{Composite Risk Index (CRI)} = w_1 \cdot I_{\text{rainfall}} + w_2 \cdot I_{\text{groundwater}} + w_3 \cdot I_{\text{reservoir}}$$

Where weights are normalized ($\sum w_i = 1.0$), with default policy calibration:
- $w_1 = 0.45$ for Normalized Rainfall Deficit: $I_{\text{rainfall}} = \max\left(0, \min\left(100, 1.5 \times \text{Deficit}\%\right)\right)$
- $w_2 = 0.35$ for Groundwater Stress Index: $I_{\text{groundwater}} \in [0, 100]$
- $w_3 = 0.20$ for Reservoir Scarcity: $I_{\text{reservoir}} = \max\left(0, \min\left(100, 100 - \text{Live Storage}\%\right)\right)$

**Risk Classification Tiers:**
- **Severe**: $\ge 75$ (Red `#ef4444`)
- **High**: $55 \le \text{Score} < 75$ (Orange `#f97316`)
- **Moderate**: $30 \le \text{Score} < 55$ (Amber `#eab308`)
- **Low**: $< 30$ (Emerald `#10b981`)

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (Tested on Python 3.13)

### Option 1: One-Click Startup (Windows)
Run the automated launcher script from the project root:
```powershell
.\run_app.bat
```
*(Starts both FastAPI backend on port 8000 and Vite frontend on port 3000)*

---

### Option 2: Manual Step-by-Step

#### 1. Start the FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
Backend API will be active at: `http://127.0.0.1:8000`
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`
- Run Backend Tests:
  ```bash
  python -m pytest backend/tests
  ```

#### 2. Start the React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend application will be accessible at: `http://localhost:3000`

---

## 📂 Project Structure
```
jaldrishti-prototype/
├── backend/
│   ├── app/
│   │   ├── config.py                 # Settings, paths, and CORS configuration
│   │   ├── models.py                 # Pydantic schemas for API validation
│   │   ├── risk_engine.py            # Explainable MCDA mathematical risk engine
│   │   ├── data_loader.py            # JSON & GeoJSON data access and CSV generator
│   │   ├── main.py                   # FastAPI app entry point and routers mount
│   │   ├── forecasting/              # Phase 3: Statistical & ML Forecasting Package
│   │   │   ├── data_pipeline.py      # Schema validation, missing value imputation & metadata
│   │   │   ├── spi_calculator.py     # WMO-No. 1090 SPI-3 & SPI-6 Gamma fitting & climatology
│   │   │   └── drought_ml.py         # Chronological ML regressors, classifiers & uncertainty
│   │   ├── data/
│   │   │   ├── districts_data.json   # 8-district comprehensive seed dataset
│   │   │   ├── marathwada_districts.geojson # District boundary polygons
│   │   │   └── historical/           # 2000-2024 historical observation series
│   │   └── routers/
│   │       ├── districts.py          # /api/districts endpoints
│   │       ├── forecasts.py          # /api/forecasts ML status, indicators & outlooks
│   │       ├── risk.py               # /api/risk/calculate and /api/risk/simulate-all
│   │       ├── geo.py                # /api/geojson endpoint
│   │       └── reports.py            # /api/reports/csv and metadata endpoints
│   ├── tests/
│   │   ├── test_risk_engine.py       # Unit tests for mathematical model & bounds
│   │   ├── test_api.py               # Integration tests for core FastAPI endpoints
│   │   └── test_forecast_ml.py       # ML chronological splits, SPI edge cases & endpoints
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # KpiCard, RiskBadge, DemoDisclaimer
│   │   │   └── layout/               # Sidebar, TopNav
│   │   ├── pages/                    # 9 Dedicated module pages
│   │   │   ├── DroughtForecasting.tsx # Phase 3 ML outlooks, CI bands & benchmarks
│   │   │   └── ...
│   │   ├── services/                 # API client & offline fallback mock data
│   │   ├── types/                    # TypeScript interface definitions
│   │   ├── i18n/                     # English / Marathi bilingual dictionary
│   │   ├── App.tsx                   # Root router and state controller
│   │   └── index.css                 # Tailwind CSS & Leaflet styling
│   ├── package.json
│   ├── vite.config.ts                # Vite config with backend API proxy
│   └── tailwind.config.js            # Theme color tokens
├── DATA_DICTIONARY.md                # Detailed hydrological, SPI & ML data dictionary
├── ROADMAP.md                        # Production telemetry integration roadmap
├── README.md                         # Complete project documentation
├── .env.example                      # Environment variables template
└── run_app.bat                       # Windows automated launcher
```

---

## 🧪 Verification & Testing
The system includes comprehensive automated unit and integration tests:
```bash
python -m pytest backend/tests
```
- **41/41 Tests Passed (100% Pass Rate)**:
  - **MCDA Risk Engine (18 tests)**: Clamping and boundary checks, weight normalization and sum invariance, risk level severity brackets, sensitivity responses.
  - **Core FastAPI API (11 tests)**: Endpoints for all 8 districts, regional summary, GeoJSON polygons, custom risk calculator, and CSV dossier streaming.
  - **Forecasting & ML Engine (12 tests)**:
    - Normalization of district aliases (`aurangabad` $\rightarrow$ `chhatrapati-sambhajinagar`, `osmanabad` $\rightarrow$ `dharashiv`).
    - Two-parameter Gamma distribution fitting and zero-rainfall probability adjustments ($q$).
    - Zero temporal leakage guarantee: strictly chronological split (Train $\le 2018$, Test $\ge 2019$).
    - Mathematical ordering of 95% confidence intervals ($\text{lower} \le \hat{y} \le \text{upper}$).
    - Authentic metric evaluations (MAE, RMSE, $R^2$, F1) without synthetic inflation.
    - Full coverage of `/api/forecasts/model-status`, `/api/forecasts/indicators`, `/api/forecasts/evaluation`, and `/api/forecasts/{district_id}`.

---

## 📜 Innovation Challenge Attribution
- **Author**: Individual Innovation Project
- **Competition**: Seva First Innovation Challenge 2026
- **Sponsor / Authority**: Government of Maharashtra
- **Division**: Marathwada (Chhatrapati Sambhajinagar Division)
