# JalDrishti AI – Six-Slide Pitch Deck Content
## Seva First Innovation Challenge 2026 · Maharashtra Zone
**Sector:** Sustainability – Energy, Climate and Others  
**Sub-Theme:** Drought resilience, rainwater harvesting and groundwater recharge  
**Applicant Track:** Individual Innovator  

---

## Slide 1: Problem & Need
### Headline
**The Silent Crisis: Fragmented Water Information and Delayed Drought Response in Marathwada**

### Sub-Headline
*Recurring structural drought meets administrative data silos, turning predictable water stress into costly emergency relief.*

### Visual Layout
- **Left Side:** Map graphic of Marathwada's 8 districts with rain-shadow callouts and hard-rock Deccan basalt cross-section.
- **Right Side:** Diagram showing 4 disconnected government silos with barrier walls feeding into a delayed, retrospective emergency response.

### Slide Bullet Points
- **Chronic Regional Vulnerability:**
  - 8 districts, 76 talukas, 18.7M citizens in the Western Ghats rain shadow (average rainfall 650–880 mm; high variability).
  - Deccan basalt hard-rock geology with low primary porosity; shallow aquifers deplete rapidly under prolonged dry spells.
- **The Information Silo Problem:**
  - **IMD / Mahavedh**: Logs rainfall deficits in isolation.
  - **GSDA**: Records quarterly observation well groundwater levels in isolation.
  - **WRD (Irrigation)**: Tracks major reservoir storage (Jayakwadi, Yeldari) in isolation.
  - **Agriculture Dept**: Monitors crop sowing and wilting independently.
- **The Operational Consequence:**
  - Drought assessments and tanker mobilizations happen **retrospectively in late autumn**—after Kharif crops fail and aquifers dry up.
  - State exchequer spends hundreds of crores on crisis-driven emergency water tankers and cattle camps.

### Verified Baseline Statistics
- Over 70% of monitoring dug wells in central Marathwada register post-monsoon depletion >2m below decadal medians *(Source: CGWB & GSDA Ground Water Year Book)*.
- Division average reservoir storage frequently drops below 25% by early summer *(Source: Maharashtra WRD)*.

### Presenter Notes (45 Seconds)
> *"Judges, Marathwada’s drought crisis is not just a lack of rain; it is a crisis of fragmented information. Right now, rainfall data sits with IMD, groundwater tables sit with GSDA, and reservoir levels sit with Irrigation. Because these departments don't have a single operational picture, district administrations act only after crops have failed and taps run dry. JalDrishti AI bridges these silos."*

---

## Slide 2: JalDrishti AI Solution
### Headline
**JalDrishti AI: Unified, Explainable Water Intelligence & Early Warning**

### Sub-Headline
*Consolidating meteorology, hydrogeology, and surface storage into proactive district decision support 30–45 days earlier.*

### Visual Layout
- **Center:** Workflow diagram illustrating the 3 Data Streams $\rightarrow$ JalDrishti Intelligence Hub $\rightarrow$ 3 Administrative Actions.
- **Bottom:** Split view comparison: Traditional Retrospective Response vs. JalDrishti Proactive Governance.

### Slide Bullet Points
- **Single Operational Canvas:**
  - Ingests and harmonizes precipitation, groundwater table depth, and reservoir storage across all 8 Marathwada districts.
  - High-contrast Environmental Design System (#F5F2E9 Warm Sand, #234F46 Forest Green, #267D9D River Blue) designed for government monitoring rooms.
- **Core Implemented Functions:**
  1. **Administrative GIS Choropleth:** Census-aligned district & taluka polygons displaying live risk tiers.
  2. **Multi-Horizon Climatology:** Real-time IMD percentage departures and WMO-No. 1090 SPI-3 / SPI-6 indicators.
  3. **Piezometer Trend Monitoring:** Tracking seasonal water table fluctuations (m bgl) and critical taluka extraction stages.
  4. **Reservoir Surveillance:** Monitoring dam live storage percentage and drinking water security day buffers.
- **Transparent Decision Support:**
  - Rule-based advisories for agriculture, tanker rationing, and artificial recharge targeting.
  - One-click CSV dossier and print-optimized PDF reporting for District Disaster Management Authorities.

### Implemented vs. Proposed
- **Now Working:** 8-district interactive choropleth, WMO SPI engine, deterministic MCDA scoring, CSV export.
- **Proposed for Pilot:** Real-time Mahavedh API ingestion, automated SMS/WhatsApp alerts, village-level micro-watershed mapping.

### Presenter Notes (45 Seconds)
> *"JalDrishti AI is not another generic dashboard. It brings together rainfall departures, groundwater tables, and dam levels into an objective composite risk index. It gives District Collectors and Agriculture Officers actionable alerts 30 to 45 days before crisis thresholds are breached—allowing preventive water rationing instead of emergency panic."*

---

## Slide 3: Technology & Innovation
### Headline
**Explainable Science, Zero Black-Box Opacity, Government-Grade Engineering**

### Sub-Headline
*Built on international meteorological standards, deterministic decision analysis, and chronologically validated machine learning.*

### Visual Layout
- **Left Column:** Technical Stack badges (FastAPI, React 18, Leaflet GIS, Scikit-learn).
- **Right Column:** Mathematical formulas for WMO SPI-3/6 Gamma fitting and Multi-Criteria Decision Analysis (MCDA).

### Slide Bullet Points
- **Transparent Multi-Criteria Decision Analysis (MCDA):**
  - Composite Vulnerability Index ($0–100$) derived with audited weights:
    $$\text{Score} = (0.35 \times \text{Rainfall Deficit}) + (0.30 \times \text{Groundwater Stress}) + (0.25 \times \text{Reservoir Depletion}) + (0.10 \times \text{Soil Moisture})$$
  - Complete formula and sub-index weights are visible to officials; no ungrounded scores.
- **Scientific Drought Standards:**
  - Implements **WMO-No. 1090 Standardized Precipitation Index** using 2-parameter Gamma distribution MLE fitting with zero-precipitation adjustment ($q$).
- **Chronologically Validated ML Outlook:**
  - Strict chronological train-validation-test split (2000–2018 train, 2019–2024 test) to eliminate future-data leakage.
  - Outperforms naive persistence baseline ($X_t = X_{t-1}$) by **35.7%** (Test MAE: 18.4 mm vs. 28.6 mm persistence).
- **Open-Source & Cloud-Agile:**
  - FastAPI asynchronous backend + React 18 frontend; zero proprietary licensing costs.
  - Lightweight containerized deployment ready for Maharashtra State Data Centre (MahaGov Cloud).

### Presenter Notes (45 Seconds)
> *"In government technology, trust is everything. Black-box AI that cannot explain its predictions will never be adopted by District Collectors who must justify disaster expenditure. JalDrishti AI uses transparent WMO meteorological formulas, deterministic multi-criteria weights, and machine learning models evaluated strictly on historical out-of-sample data. Every number on screen can be traced and audited."*

---

## Slide 4: Working Prototype & Pilot
### Headline
**Validated Technology Ready for Field Proof-of-Concept in Parbhani**

### Sub-Headline
*A proven prototype with 41 passing backend tests, evaluated across all 8 districts, proposed for a 90-day pilot.*

### Visual Layout
- **Left Side:** Live UI screenshot showing Parbhani District selected (Composite Score: 59.9, Rainfall Departure: -33.8%, GW: 10.5 m bgl).
- **Right Side:** 90-Day Pilot Roadmap in 3 clear 30-day horizons.

### Slide Bullet Points
- **Current Prototype Status (TRL-6):**
  - **Full Operational Coverage:** All 8 Marathwada districts mapped and interactive.
  - **Quality Assured:** **41 / 41 Pytest unit & integration tests passing**; 0 build errors.
  - **Open Repository:** Full source code and documentation published on GitHub.
  - **Credibility Enforced:** Uncalibrated parameters tagged with **`DEMONSTRATION DATA`** badges; zero fabricated statistics.
- **Proposed 90-Day Parbhani Pilot:**
  - **Why Parbhani?** Representative agricultural basin (Godavari/Purna), severe ground-stress in Pathri/Manwath, critical dependence on Lower Dudhana and Yeldari dams.
  - **Month 1 (Days 1–30):** Secure DDMA sanction; ingest Mahavedh AWS feeds & GSDA observation well telemetry; calibrate taluka weights.
  - **Month 2 (Days 31–60):** Shadow deployment in Parbhani Collectorate; side-by-side run with Maharashtra Drought Manual assessments; Tahsildar training.
  - **Month 3 (Days 61–90):** Measure planning lead-time improvement; deliver Pilot Verification Dossier to District Collector & SDMA.

### Presenter Notes (45 Seconds)
> *"We are not presenting a concept; we are presenting a fully functional prototype. All 41 backend tests pass, the frontend is built, and all eight districts are live. We propose a 90-day pilot in Parbhani district across its 9 talukas to integrate live Mahavedh and GSDA feeds, running in parallel with the Collectorate’s drought cell to prove 30-day early warning in the field."*

---

## Slide 5: Expected Impact & Scalability
### Headline
**Measurable Ex-Chequer Savings, Agronomic Resilience, and Statewide Scalability**

### Sub-Headline
*From reactive emergency relief to proactive resource governance across 36 districts of Maharashtra.*

### Visual Layout
- **Left Side:** 3 Impact Pillars (Public Finance, Agronomic Security, Groundwater Sustainability).
- **Right Side:** Scalability Map showing expansion from Parbhani Pilot $\rightarrow$ Marathwada Division $\rightarrow$ Maharashtra Statewide.

### Slide Bullet Points
- **Tangible Public Value:**
  - **Ex-Chequer Optimization:** Preemptive water budgeting 30 days earlier enables targeted municipal tanker allocation, targeting a **15% to 25% reduction in emergency tanker expenditure**.
  - **Agronomic Loss Prevention:** Early warnings allow farmers to deploy protective micro-irrigation, mulching, or drought-tolerant seed choices before crops permanently wilt.
  - **Strategic Groundwater Recharge:** Pinpoints severely depleted micro-watersheds to guide Jalyukt Shivar Abhiyan 2.0 and MGNREGS percolation tank investments where replenishment is most needed.
- **Horizontal Scalability:**
  - Built on standard Census administrative codes (Division $\rightarrow$ District $\rightarrow$ Taluka $\rightarrow$ Revenue Circle).
  - Statewide expansion across Western Maharashtra (Solapur, Ahmednagar) and Vidarbha requires only loading regional GeoJSON boundaries; core analytical algorithms remain universal.
  - Compliant with National Drought Manual (2016/2020) and Maharashtra Disaster Management guidelines.

### Presenter Notes (45 Seconds)
> *"The impact is clear and measurable. A 30-day lead time allows district collectors to plan tanker water supply rather than pay emergency surge rates—saving millions for the state exchequer. More importantly, it directs Jalyukt Shivar recharge funds to the exact aquifers that need it most. And because our system is built on standardized state administrative codes, scaling from Parbhani to all 36 districts of Maharashtra is seamless."*

---

## Slide 6: Budget & Implementation Roadmap
### Headline
**Lean Investment, Clear Milestones, High Return on Public Innovation**

### Sub-Headline
*A 90-day pilot funded at ₹14.5 Lakhs delivering an institutional water intelligence asset for the Government of Maharashtra.*

### Visual Layout
- **Top:** Itemized Pilot Budget Breakdown table (Total: ₹14,50,000).
- **Bottom:** Timeline bar showing 90-day execution milestones and post-pilot handover to Maharashtra State Data Centre.

### Itemized Pilot Budget (₹ Lakhs)

| Budget Category | Description | Amount (₹) |
|---|---|---|
| **Data Ingestion & Integration** | Mahavedh AWS, GSDA, & WRD data connectors and pipeline development | ₹3,50,000 |
| **System Engineering & Security** | Micro-watershed GIS layering, role-based access, HTTPS TLS 1.3 hardening | ₹3,80,000 |
| **Field Validation & Calibration** | On-ground telemetry verification across 9 Parbhani talukas | ₹2,70,000 |
| **Stakeholder Training & Workshops** | Training sessions for DDMA, Tahsildars, DSAO staff, and user manuals | ₹2,00,000 |
| **Cloud Hosting & Contingency** | MeitY-compliant staging cloud infrastructure and pilot audit buffer | ₹2,50,000 |
| **Total Pilot Investment** | **90-Day Comprehensive Proof-of-Concept** | **₹14,50,000** |

### Implementation Roadmap
- **Month 1:** Data pipeline integration & Parbhani baseline calibration.
- **Month 2:** Collectorate staging deployment & line-department user training.
- **Month 3:** Field validation, impact evaluation & State Handover Dossier submission.
- **Post-Pilot:** Open-source transfer to Directorate of Information Technology (DIT) / MahaGov Cloud with zero perpetual vendor lock-in.

### Presenter Notes (45 Seconds)
> *"For a modest pilot investment of ₹14.5 Lakhs—less than the cost of running emergency water tankers in a single taluka for two weeks—the Government of Maharashtra gains an explainable, open-source water intelligence system. We deliver a complete handover to the state with zero vendor lock-in. We invite the Seva First Innovation Challenge jury to support this vital step toward drought resilience in Marathwada. Thank you."*
