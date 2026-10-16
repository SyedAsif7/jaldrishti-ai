# JalDrishti AI – Known Prototype Limitations & Boundary Conditions
## Seva First Innovation Challenge 2026 · Maharashtra Zone

To ensure transparent and objective evaluation, this document outlines the operational boundaries, data conditions, and technical limitations of the JalDrishti AI prototype as demonstrated for the *Seva First Innovation Challenge 2026*.

---

## 1. Data Feed Architecture & Demonstration Data

### Observation: Absence of Unrestricted Real-Time Departmental APIs
- **Current Prototype State:** Operating on statistically calibrated historical baseline observations reflecting verified IMD, GSDA, and WRD records.
- **Why It Exists:** Official state telemetry feeds (such as Mahavedh AWS intranet endpoints, CGWB National Water Informatics Centre restricted APIs, and WRD SCADA dam gates) require formal departmental data access sanctions and government intranet VPN authentication, which are not available to an independent innovator prior to a sanctioned pilot.
- **Operational Mitigation:**
  - All simulated or demonstration values are visibly labeled with the **`DEMONSTRATION DATA`** indicator badge.
  - The system architecture includes pre-configured REST API connectors ready to ingest live government JSON/CSV feeds during Phase 1 of the proposed Parbhani pilot.
  - Zero fabricated live telemetry alerts or unofficial emergency decrees are generated.

---

## 2. Spatial & Geographic Resolution

### Observation: District-Level Modeling with Taluka Tabular Breakdown
- **Current Prototype State:** Full interactive choropleth GIS mapping at the **district level** (8 districts), with tabular and profile breakdowns at the **taluka level** (76 talukas).
- **Limitation:** The current prototype does not feature micro-watershed or village-level cadastral spatial polygons.
- **Operational Mitigation:**
  - The planned 90-day Parbhani pilot proposal incorporates Circle-level and micro-watershed boundary layers in Phase 2 using high-resolution Digital Elevation Models (DEM) and local revenue circle maps.

---

## 3. Hydrogeological Constraints in Deccan Basalt

### Observation: High Spatial Variability of Hard-Rock Aquifers
- **Current Prototype State:** Evaluates groundwater stress from GSDA observation well networks across talukas.
- **Limitation:** Deccan Volcanic Basalt consists of heterogeneous, non-continuous, fractured and vesicular rock formations. Ground water tables and yield can vary significantly across a distance of 500 meters.
- **Operational Mitigation:**
  - The composite risk index provides regional and taluka-level aquifer vulnerability indications for water budgeting and artificial recharge prioritization, rather than point-well guarantees for private borewell drilling.

---

## 4. Machine Learning Predictive Horizons

### Observation: Forecast Horizon Bounded to 1-Month Outlook
- **Current Prototype State:** Multivariate machine learning regression provides a 1-month forward rainfall outlook with 95% confidence intervals, alongside a 3-month seasonal trend estimation.
- **Limitation:** Multi-season long-range forecasting (>3 months) in tropical rain-shadow zones carries high stochastic volatility and lower statistical confidence.
- **Operational Mitigation:**
  - Forward forecasting is deliberately restricted to horizons supported by trained, holdout-evaluated models (35.7% error reduction over persistence) to prevent misleading long-term speculation.

---

## 5. Institutional & Administrative Role

### Observation: Strictly Advisory Decision-Support
- **Current Prototype State:** The system generates rule-based advisories and water security indicators.
- **Limitation:** JalDrishti AI is not an autonomous administrative decision-maker. It does not enforce statutory water reservations or disburse relief funds.
- **Operational Mitigation:**
  - Designed as an explainable decision-support tool where all composite scores can be decomposed into raw physical units (mm, m bgl, % storage), preserving the final decision authority of the District Collector and designated technical officers.
