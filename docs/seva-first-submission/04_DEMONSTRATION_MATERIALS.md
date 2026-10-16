# JalDrishti AI – Demonstration Materials & Presentation Guide
## Seva First Innovation Challenge 2026 · Maharashtra Zone
**Document Code:** `SFIC-2026-DEMO-GUIDE-V1`

---

## 1. One-Page Executive Project Summary

**Project Title:** JalDrishti AI – Drought Early Warning & Water Intelligence System for Marathwada  
**Applicant:** Individual Innovator  
**Sector:** Sustainability – Energy, Climate and Others  
**Sub-Theme:** Drought resilience, rainwater harvesting and groundwater recharge  
**Target Geography:** Marathwada Administrative Division (8 Districts), Maharashtra  

### The Challenge
Marathwada faces chronic structural drought driven by rain-shadow climatology and shallow hard-rock basalt aquifers. However, district disaster management remains strictly **reactive**: rainfall (IMD), groundwater (GSDA), and reservoir storage (WRD) data are maintained in disconnected departmental silos. Formal drought declarations and emergency tanker mobilizations typically occur retrospectively in late autumn, long after Kharif crops have withered and aquifers have drained, costing the state hundreds of crores in emergency relief.

### The Innovation
**JalDrishti AI** is a lightweight, web-native decision-support platform designed specifically for Maharashtra's administrative hierarchy. It unifies meteorology, hydrogeology, and surface storage into an explainable, interactive GIS canvas, delivering **30 to 45 days earlier warning** of emerging drought stress.

### Key Capabilities
- **Interactive GIS Choropleth:** Census-aligned district and taluka boundaries mapping real-time vulnerability with an environmental color palette.
- **WMO-No. 1090 SPI Engine:** Automated computation of SPI-3 (agricultural drought) and SPI-6 (hydrological drought) using Gamma distribution fitting.
- **Deterministic Multi-Criteria Decision Analysis (MCDA):** Auditable, policy-weighted composite scoring ($0–100$) combining rainfall departure (35%), groundwater stress (30%), reservoir depletion (25%), and soil moisture (10%).
- **Chronologically Validated ML Outlook:** 1-month predictive forward outlook evaluated with zero future-data leakage (35.7% error reduction over naive persistence).
- **Automated Departmental Advisories & One-Click Dossiers:** Contextual action plans for agriculture, tanker supply, and artificial recharge targeting, exportable as CSV data and printable briefing dossiers.

### Current Status & Proposed Pilot
- **Technology Readiness Level 6 (TRL-6):** Operational full-stack prototype with **41/41 passing unit and integration tests** and 0 build errors.
- **Proposed Pilot:** A 90-day proof-of-concept deployment in Parbhani District across its 9 talukas to integrate live Mahavedh AWS and GSDA feeds, running in parallel with the District Disaster Management Cell.

---

## 2. Three-Minute Timed Live Prototype Demonstration Script

*The demonstration is designed to run seamlessly using the built-in 7-step guided tour on the live web platform.*

### Overview Timeline:
```
[00:00 - 00:30] Step 1: Regional Marathwada Synoptic View
[00:30 - 00:55] Step 2: Parbhani District Selection
[00:55 - 01:25] Step 3: Rainfall Departure & WMO SPI-3/6
[01:25 - 01:55] Step 4: Groundwater Stress & Aquifer Depletion
[01:55 - 02:25] Step 5: Explainable MCDA Drought Scoring
[02:25 - 02:45] Step 6: Water-Conservation & Crop Advisories
[02:45 - 03:00] Step 7: One-Click Reporting & Conclusion
```

---

### Minute 0:00 – 0:30 | Step 1: Regional Marathwada Synoptic View
- **Operator Action:** Open `http://localhost:3000` (or live production URL). Ensure the platform is on the Overview tab showing all 8 districts.
- **Presenter Dialogue:**
  > *"Respected jury members, welcome to JalDrishti AI. On your screen is the synoptic water intelligence overview of all eight districts of Marathwada. Right now, our regional composite risk score stands at 61.6 out of 100—reflecting significant drought stress across the division, with two districts in severe risk and three in high risk. Notice our earthy, environmental interface: built without distracting neon colors, designed specifically for district monitoring rooms."*

---

### Minute 0:30 – 0:55 | Step 2: Parbhani District Selection
- **Operator Action:** Click on **Map View** and select **Parbhani** (or select Parbhani from the top dropdown).
- **Presenter Dialogue:**
  > *"Let us zoom in on our proposed pilot district—Parbhani. Clicking Parbhani instantly re-filters all telemetry and risk models. Parbhani is currently categorized in the High Risk bracket with a composite vulnerability score of 59.9. Instead of waiting for post-monsoon audits, the system immediately flags compounding stress across its nine talukas."*

---

### Minute 0:55 – 1:25 | Step 3: Rainfall Departure & WMO SPI-3/6
- **Operator Action:** Navigate to the **Rainfall Analysis** tab (`/rainfall`).
- **Presenter Dialogue:**
  > *"Here, JalDrishti AI displays Parbhani’s precipitation trajectory. The district has received 512.6 mm against an IMD normal of 774 mm—a departure of -33.8%, officially categorizing it as Deficient. Below, our statistical engine fits historical precipitation to a World Meteorological Organization Standardized Precipitation Index. SPI-3 is at -1.18, confirming moderate agricultural drought, while SPI-6 is at -1.24, signaling onset of hydrological stress."*

---

### Minute 1:25 – 1:55 | Step 4: Groundwater Stress & Aquifer Depletion
- **Operator Action:** Navigate to the **Groundwater Monitoring** tab (`/groundwater`).
- **Presenter Dialogue:**
  > *"Groundwater is Marathwada's lifeline. In Parbhani, the average depth to the water table has plunged to 10.5 meters below ground level—a 1.8-meter deeper drop than decadal seasonal averages. Over 68% of observation wells show water table exhaustion. Our model highlights Pathri and Manwath talukas as critically over-extracted, warning that post-monsoon aquifer recharge will be insufficient for the upcoming winter crop."*

---

### Minute 1:55 – 2:25 | Step 5: Explainable MCDA Drought Scoring
- **Operator Action:** Navigate to the **Risk Analysis** tab (`/analysis`).
- **Presenter Dialogue:**
  > *"This is the core innovation of JalDrishti AI: explainable, deterministic Multi-Criteria Decision Analysis. We avoid black-box opacity. Officials can see exactly how the 59.9 composite score is formed: 35% rainfall deficit, 30% groundwater drop, 25% reservoir storage, and 10% soil moisture. Every weight is auditable, eliminating political guesswork and providing an objective basis for administrative water budgeting."*

---

### Minute 2:25 – 2:45 | Step 6: Water-Conservation & Crop Advisories
- **Operator Action:** Navigate to the **Advisories & Alerts** tab (`/alerts`).
- **Presenter Dialogue:**
  > *"JalDrishti AI translates analytics into concrete governance. The system automatically triggers actionable advisories: directing agriculture officers to advise farmers to shift from flood to drip irrigation in sugarcane belts, recommending restrictive tanker water allocations, and prioritizing 42 percolation tanks along Dudhna sub-basins for desilting under Jalyukt Shivar Abhiyan."*

---

### Minute 2:45 – 3:00 | Step 7: One-Click Reporting & Conclusion
- **Operator Action:** Navigate to the **Reports & Exports** tab (`/reports`), click **Export CSV**, and hover over **Print Report**.
- **Presenter Dialogue:**
  > *"Finally, district officials can export audited CSV dossiers or generate print-ready executive water security briefs for the District Disaster Management Authority with a single click. JalDrishti AI is tested, validated, and ready for a 90-day pilot in Parbhani. Thank you."*

---

## 3. Defense FAQ: Anticipating Jury Questions

### Q1: Is this a working product or just a concept?
> **Answer:** *"JalDrishti AI is an operational Technology Readiness Level 6 (TRL-6) prototype. The complete frontend, analytical backend, GIS choropleth, and test suite with 41 passing automated tests are fully functional and publicly accessible on GitHub. All eight Marathwada districts are modeled."*

### Q2: Why not just use existing remote sensing satellite platforms like Bhuvan or Google Earth Engine?
> **Answer:** *"Satellite platforms provide broad vegetative vegetation indices (NDVI) at 250m resolution, but they do not speak the language of Maharashtra district governance. A District Collector cannot sanction water tankers based solely on a raw satellite NDVI raster. JalDrishti AI bridges that gap by synthesizing satellite and meteorological data directly with GSDA ground observation wells and WRD dam telemetry—delivering actionable administrative indices aligned with state water budgeting protocols."*

### Q3: How do you validate that the AI is not hallucinating or making errors?
> **Answer:** *"First, our composite risk scoring is deterministic—it uses auditable Multi-Criteria Decision Analysis, not unconstrained deep learning. Second, our machine learning forecasting models were validated using strict chronological splits without future-data leakage, proving a 35.7% error reduction over naive persistence baselines. Third, all demonstration parameters are visibly tagged, ensuring zero fabricated telemetry."*

### Q4: How will the system obtain live data once deployed?
> **Answer:** *"Maharashtra already possesses state-of-the-art telemetry: Mahavedh operates automated weather stations across revenue circles, WRD publishes daily dam storage bulletins, and GSDA logs observation wells. What is missing is the integrated ingestion layer. Our proposed 90-day pilot configures secure automated connectors for these existing public and departmental feeds—requiring zero expenditure on new sensors."*
