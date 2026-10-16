# JalDrishti AI – Development Roadmap
## Evolution from Prototype to Production Decision-Support Platform
*Prepared for Seva First Innovation Challenge 2026, Government of Maharashtra*

---

### Phase 1: Prototype Scaffolding & Architecture Verification (Current Milestone)
- [x] Scaffolding React + TypeScript + Vite + Tailwind dashboard with dark navy government theme
- [x] FastAPI analytical backend with Python 3.13, Pandas, NumPy, and Pydantic
- [x] Eight-district seed data model covering meteorological, hydrogeological, and storage parameters
- [x] Interactive Leaflet GIS vector map with 8-district polygon boundary layer
- [x] Explainable Multi-Criteria Decision Analysis (MCDA) composite drought index with visible formula
- [x] Bilingual architecture with English / Marathi (मराठी) localization switch
- [x] Downloadable CSV report and print-ready dossier generator
- [x] Unit test suite verifying mathematical clamping, weight normalization, and API endpoints

---

### Phase 2: Live Government Telemetry & API Integration (Months 2–4)
1. **MahaVedh Automated Weather Station (AWS) API**:
   - Ingest daily gridded rainfall observations from over 2,000 AWS stations across Maharashtra.
   - Calculate real-time 30-day, 60-day, and seasonal departures from IMD 30-year Long Period Average (LPA).
2. **Water Resources Department (WRD) Daily Storage Scraper/API**:
   - Integrate daily reservoir storage bulletins for 11 major dams (Jayakwadi, Majalgaon, Yeldari, etc.) and 75 medium projects.
   - Automated dead storage alerting and evaporation loss modeling.
3. **GSDA / CGWB Observation Well Ingestion**:
   - Quarterly ingestion of digital water level recorder (DWLR) telemetry from ~1,200 telemetry-enabled piezometers in Marathwada.

---

### Phase 3: Advanced Climatological Drought Indices (Months 5–7)
1. **SPI (Standardized Precipitation Index)**:
   - Implement gamma distribution fitting on 30+ years of historical daily IMD precipitation data.
   - Compute SPI-1, SPI-3, SPI-6, and SPI-12 timescales at taluka and circle levels.
2. **SPEI (Standardized Precipitation Evapotranspiration Index)**:
   - Integrate Penman-Monteith potential evapotranspiration (PET) calculations using temperature, solar radiation, humidity, and wind speed.
   - Capture evaporative stress and flash drought phenomena caused by extreme heat anomalies in Marathwada.
3. **Satellite Remote Sensing Integration (Google Earth Engine / Copernicus)**:
   - **NDVI** (Normalized Difference Vegetation Index) for agricultural drought stress tracking.
   - **NDWI** (Normalized Difference Water Index) for surface water body surface area tracking.
   - **SMAP / Sentinel-1** for root-zone soil moisture anomaly detection.

---

### Phase 4: Machine Learning Forecasting & Validation (Months 8–10)
1. **Long Short-Term Memory (LSTM) / Transformer Networks**:
   - Train sequence-to-sequence neural networks on 20 years of rainfall, runoff, and storage time series to predict reservoir levels 60 days into the future.
2. **Extreme Gradient Boosting (XGBoost) for Tanker Demand Forecasting**:
   - Supervised classification trained on historical taluka-level tanker sanction orders to forecast drinking water distress 30 days before acute scarcity emerges.
3. **Rigorous Validation & Backtesting**:
   - Validate against historic drought years in Marathwada (2012, 2015, 2018, 2023).
   - Evaluate model calibration using Brier score, ROC-AUC, and Mean Absolute Error (MAE) before any real-world operational reliance.
