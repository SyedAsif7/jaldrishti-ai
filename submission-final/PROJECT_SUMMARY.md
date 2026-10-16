# JalDrishti AI – Executive Project Summary
## Seva First Innovation Challenge 2026 · Government of Maharashtra

**Project Title:** JalDrishti AI – Drought Prediction & Water Intelligence System for Marathwada  
**Applicant Track:** Individual Innovator  
**Sector:** Sustainability – Energy, Climate and Others  
**Sub-Theme:** Drought resilience, rainwater harvesting and groundwater recharge  
**Target Geography:** Marathwada Administrative Division (8 Districts: *Chhatrapati Sambhajinagar, Jalna, Beed, Dharashiv, Latur, Parbhani, Nanded, Hingoli*), Maharashtra  
**Code Repository:** [https://github.com/SyedAsif7/jaldrishti-ai](https://github.com/SyedAsif7/jaldrishti-ai)  
**Prototype Status:** Technology Readiness Level 6 (TRL-6: Tested & Demonstrated in Relevant Environment)

---

## 1. The Regional Water Crisis in Marathwada

Maharashtra's Marathwada administrative division encompasses 8 districts, 76 talukas, ~64,813 km² geographic area, and over 18.7 million citizens. Situated in the rain-shadow of the Western Ghats, the region averages only 650 mm to 880 mm of annual rainfall with an exceptionally high inter-annual coefficient of variation (~28%). The underlying geology consists predominantly of Deccan Volcanic Basalt—a dense, hard-rock formation characterized by poor primary porosity and localized, shallow aquifers that deplete rapidly under prolonged dry spells.

Despite recurring drought cycles, water crisis management remains structurally **reactive rather than predictive**. Decisions to declare drought, mobilize emergency water tankers, establish cattle fodder camps, and sanction crop compensation occur retrospectively in late autumn—months after rainfall deficits have already devastated Kharif crops and depleted aquifer reserves.

The root cause of this operational delay is **institutional data fragmentation**:
1. **Precipitation records** are logged across India Meteorological Department (IMD) gridded networks and Mahavedh Automatic Weather Stations (AWS).
2. **Groundwater table depth** is monitored quarterly through observation wells by the Groundwater Surveys and Development Agency (GSDA).
3. **Surface water storage** is tracked daily across major irrigation dams (Jayakwadi, Yeldari, Lower Dudhana, Majalgaon) by the Water Resources Department (WRD).
4. **Crop sowing and moisture stress** are tracked independently by the Commissionerate of Agriculture.

Because these critical streams operate in disconnected departmental silos, district collectors and disaster management authorities lack an integrated operational picture, forcing the state exchequer to spend hundreds of crores on crisis-driven emergency relief.

---

## 2. The Proposed Solution: JalDrishti AI

**JalDrishti AI** is an explainable water intelligence and drought early-warning platform purpose-built for the administrative workflows of Maharashtra’s district collectors, disaster management cells, and technical line departments. It unifies meteorology, hydrogeology, and surface storage into an integrated decision-support canvas, providing **30 to 45 days earlier warning** of emerging water stress.

### Core Functional Capabilities:
- **Administrative GIS Choropleth:** Visualizes all 8 Marathwada districts and 76 talukas using Census of India administrative boundaries (EPSG:4326), mapping live vulnerability through an authentic environmental color palette.
- **WMO-No. 1090 SPI Engine:** Automatically fits 3-month (SPI-3: agricultural stress) and 6-month (SPI-6: hydrological stress) accumulated precipitation to two-parameter Gamma distributions using Maximum Likelihood Estimation (MLE).
- **Piezometric Groundwater Trend Monitoring:** Evaluates depth to water table (m bgl) from GSDA observation well networks, highlighting seasonal fall rates and talukas with extraction stages exceeding 80%.
- **Surface Reservoir Surveillance:** Tracks live storage percentages against dead-storage thresholds across major regional dams, translating storage into estimated drinking water security days.
- **Deterministic Multi-Criteria Decision Analysis (MCDA):** Combines rainfall deficit (35%), groundwater stress (30%), reservoir depletion (25%), and soil moisture stress (10%) into an objective 0–100 Composite Drought Vulnerability Index.
- **Chronologically Validated ML Outlook:** Generates a 1-month forward rainfall and SPI outlook using multivariate regression trained strictly on historical observations with chronological splits (zero lookahead leakage), delivering a 35.7% error reduction over naive persistence.
- **Departmental Advisories & One-Click Dossiers:** Automatically produces contextual intervention guidelines for agriculture, tanker rationing, and artificial recharge targeting, exportable as structured CSV files and printable briefing dossiers.

---

## 3. Technology Stack & Architecture

- **Frontend Application:** React 18 with TypeScript, Vite 5.4, Tailwind CSS, Leaflet GIS, and Recharts. Designed with an earthy Environmental Theme (#F5F2E9 Warm Sand, #FFFEFA Soft Ivory, #234F46 Forest Green, #267D9D River Blue, #C7813C Ochre, #B64D3C Terracotta).
- **Backend Application:** Python 3.11+ with FastAPI, Uvicorn ASGI server, and Pydantic v2 data validation schemas.
- **Analytical & ML Libraries:** NumPy, Pandas, SciPy (Thom 1958 Gamma distribution fitting), and Scikit-Learn (`HistGradientBoostingRegressor` and `Ridge`).
- **Open-Source Footprint:** 100% open-source, vendor-neutral architecture ready for containerized deployment in the Maharashtra State Data Centre (MahaGov Cloud).

---

## 4. Current Prototype Verification (TRL-6)

- **Test Suite Status:** **41 / 41 Pytest backend tests passing** across API routes, mathematical models, and machine learning pipelines.
- **Production Build:** `npm run build` succeeds in **6.25 seconds with 0 errors**.
- **Demonstration Tour:** Built-in, dismissible 8-step evaluator tour featuring the Parbhani pilot case study.
- **Data Credibility:** Baseline climatology grounded in 25-year IMD/GSDA/WRD records; uncalibrated parameters visibly tagged with `DEMONSTRATION DATA` badges.

---

## 5. Proposed 90-Day Parbhani Pilot & Scalability

We propose a structured, 90-day proof-of-concept pilot deployment in **Parbhani District** (all 9 talukas: *Parbhani, Gangakhed, Sonpeth, Pathri, Manwath, Palam, Selu, Jintur, Purna*):
- **Phase 1 (Days 1–30):** Secure DDMA sanction; establish automated connectors for daily Mahavedh AWS, GSDA observation well, and WRD reservoir storage feeds.
- **Phase 2 (Days 31–60):** Shadow deployment in the Parbhani Collectorate alongside the official *Maharashtra Drought Manual* procedures; user training for Tahsildars and Taluka Agriculture Officers.
- **Phase 3 (Days 61–90):** Measure planning lead-time gains; compile final Verification Report for District Collector and State Disaster Management Authority (SDMA).
- **Itemized Pilot Budget:** **₹14,50,000** (Software customization, data pipeline development, field validation, and stakeholder workshops).
- **Statewide Scalability:** Standardized state administrative codes (Division $\rightarrow$ District $\rightarrow$ Taluka $\rightarrow$ Circle) allow seamless expansion across all 36 districts of Maharashtra.
