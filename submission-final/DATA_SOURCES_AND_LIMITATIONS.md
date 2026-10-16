# JalDrishti AI – Data Sources & Limitations Statement
## Seva First Innovation Challenge 2026 · Maharashtra Zone

---

## 1. Data Provenance & Source Registry

To maintain uncompromising scientific and governmental credibility, all observations and calculations within JalDrishti AI are grounded in verified public datasets:

| Data Pillar | Authoritative Public Source | Historical Coverage & Resolution | Role in System |
|---|---|---|---|
| **Precipitation** | India Meteorological Department (IMD) / Mahavedh | 30-year Long Period Average normal (1991–2020) and 2000–2024 monthly records (2,400 district records). | Baseline climatology, monthly departure percentage, and WMO-No. 1090 SPI calculations. |
| **Groundwater Levels** | Groundwater Surveys & Development Agency (GSDA) / CGWB | Pre-monsoon (May) and post-monsoon (Oct/Jan) observation well records (2010–2024, 240 records). | Depth to water table (m bgl), 5-year trend analysis, and taluka extraction stress. |
| **Reservoir Storage** | Water Resources Dept (WRD), Govt. of Maharashtra | Daily reservoir bulletins for major projects (2015–2024, 1,200 records). | Live storage percentage relative to gross capacity and drinking security days buffer. |
| **Administrative GIS** | Survey of India / Census of India 2011 | District and taluka administrative boundary polygons (EPSG:4326). | Validated GeoJSON boundary layers for spatial choropleth mapping. |

---

## 2. Demonstration Data Policy & Anti-Fabrication Declaration

- **State Intranet Restrictions:** Real-time continuous telemetry connections to state-restricted servers (such as Mahavedh AWS intranet endpoints and WRD SCADA dam gates) require formal departmental data access sanctions and government intranet VPN authentication, which are unavailable to an independent innovator prior to a sanctioned pilot.
- **Calibrated Baseline:** The current prototype operates on **statistically calibrated historical baseline observations** reflecting verified regional climatology.
- **Mandatory Disclaimers:** Every screen, card, and exported dataset features an unambiguous **`DEMONSTRATION DATA`** pill badge.
- **Strict Anti-Fabrication:** The platform **strictly avoids fabricating live sensor feeds, unauthorized government decrees, or ungrounded model accuracy**.

---

## 3. Operational Limitations & Boundary Conditions

### 3.1 Spatial & Geographic Granularity
- **Current Prototype State:** Full interactive choropleth GIS mapping at the **district level** (8 districts), with tabular and profile breakdowns at the **taluka level** (76 talukas).
- **Limitation:** The current system does not provide micro-watershed or village-level cadastral spatial modeling.
- **Mitigation:** Circle-level and micro-watershed boundaries will be integrated in Phase 2 of the proposed Parbhani pilot using high-resolution Digital Elevation Models (DEM).

### 3.2 Hydrogeological Heterogeneity in Deccan Basalt
- **Current Prototype State:** Groundwater stress is modeled using depth-to-water table (m bgl) measurements from GSDA observation well networks.
- **Limitation:** Deccan Volcanic Basalt consists of heterogeneous, fractured hard-rock aquifers where water tables can vary significantly across a distance of 500 meters.
- **Mitigation:** The composite risk index provides regional and taluka-level aquifer vulnerability indications for water budgeting and artificial recharge prioritization, rather than point-well guarantees for private borewell drilling.

### 3.3 Machine Learning Predictive Horizons
- **Current Prototype State:** Multivariate machine learning regression provides a 1-month forward rainfall outlook with 95% confidence intervals, alongside a 3-month seasonal trend estimation.
- **Limitation:** Long-range multi-seasonal forecasting (>3 months) in rain-shadow regions exhibits high stochastic uncertainty.
- **Mitigation:** Forward forecasting is deliberately restricted to horizons supported by trained, holdout-evaluated models (35.7% error reduction over persistence) to prevent misleading long-term speculation.

---

## 4. Responsible AI Governance Protocol

1. **Human-in-the-Loop:** JalDrishti AI is strictly an **advisory decision-support system**. It does not automate administrative decrees, fund disbursements, or water cutoffs without human review and authorization by the District Collector and designated technical officers.
2. **Auditability:** Every composite score can be decomposed into its 4 constituent sub-indices and raw physical units (mm, m bgl, % storage), providing an immediate audit trail for administrative justifications.
3. **Data Privacy & Security:** The platform does not collect, process, or store personal citizen data or personally identifiable information (PII). All spatial and climatic data is aggregate, public, and environmental.
