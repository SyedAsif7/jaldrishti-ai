# Pilot Project Proposal: JalDrishti AI Deployment in Parbhani District
## Integrated Water Intelligence & Proactive Drought Decision-Support
### Seva First Innovation Challenge 2026 · Government of Maharashtra

---

## 1. Project Overview & Institutional Alignment

| Parameter | Specification |
| :--- | :--- |
| **Project Name** | JalDrishti AI – Water Intelligence & Drought Early-Warning System |
| **Proposed Pilot Geography** | Parbhani District (All 9 Administrative Talukas), Marathwada Division |
| **Applicant Type** | Individual Innovator / Technical Innovation Challenge Entry |
| **Competition Track** | Sustainability – Energy, Climate and Others |
| **Sub-Theme** | Drought Resilience, Rainwater Harvesting & Groundwater Recharge |
| **Proposed Duration** | 90 Days (Proof-of-Concept Pilot) |
| **Target Host Departments** | District Collectorate (DDMA), Department of Agriculture, Water Resources Department (WRD), Groundwater Surveys & Development Agency (GSDA) |
| **Project Nature** | Explainable, non-blackbox hydro-climatic intelligence platform |

> [!NOTE]
> **Regulatory & Institutional Clarification**:  
> This proposal represents a structured pilot plan developed as an entry for the *Seva First Innovation Challenge 2026, Government of Maharashtra*. It does not imply that any state department or district collectorate has already formally signed or entered into a binding contractual partnership. The implementation timeline and resource allocations outlined herein are intended for technical evaluation and subsequent pilot sanctioning as a government work order.

---

## 2. Problem Statement & Target Beneficiaries

### 2.1 The Operational Problem
District administrations in the Marathwada division currently respond to drought through **retrospective disaster mitigation** rather than **anticipatory water governance**. The primary bottleneck is not an absence of data, but severe **institutional fragmentation**:

1. **Information Silos**: Precipitation records from Mahavedh Automatic Weather Stations (AWS) are housed separately from GSDA groundwater monitoring well levels and WRD surface reservoir telemetry.
2. **Delayed Intervention Triggers**: Official drought assessments and crop damage declarations typically occur in late October or November—long after soil moisture deficits have permanently devastated Kharif crops and depleted aquifer reserves.
3. **Escalating Relief Costs**: In late-stage emergencies, district collectors are compelled to sanction extensive drinking water tanker deliveries and fodder camps at substantial cost to the state exchequer, much of which could be mitigated through early demand-side rationing.

### 2.2 Target Beneficiaries
- **Primary Institutional Users**:
  - *District Collector & District Magistrate (Parbhani)*: Unified dashboard for emergency water budgeting, section 144 well reservations, and tanker sanctions.
  - *District Superintending Agriculture Officer (DSAO)*: Crop-specific moisture advisories for cotton, soybean, and pulses.
  - *Executive Engineer (WRD, Purna & Dudhna Projects)*: Coordinated dam release scheduling balancing irrigation canals with municipal drinking reserves.
  - *Senior Geologist (GSDA Parbhani)*: Early identification of critical aquifer depletion zones for artificial recharge interventions.
  - *Sub-Divisional Officers (SDOs) & Tahsildars (9 Talukas)*: Block-level water stress surveillance.
- **Ultimate Community Beneficiaries**:
  - Smallholder farmers across Parbhani's ~4,50,000 hectares of net cultivated area.
  - Rural households in tanker-vulnerable habitations.

---

## 3. Pilot Geography: Parbhani District Profile

Parbhani district has been selected as the representative pilot territory due to its strategic hydro-climatic characteristics:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PARBHANI DISTRICT PILOT PROFILE                   │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Total Geographic Area    │ 6,511 sq. km                                │
│ Administrative Talukas   │ 9 (Parbhani, Gangakhed, Sonpeth, Pathri,    │
│                          │    Manwath, Palam, Selu, Jintur, Purna)     │
│ Rural / Urban Population │ ~18,36,086 (2011 Census / Projected ~2.1M)  │
│ Major River Basin        │ Godavari Basin (Purna & Dudhna Sub-basins)  │
│ Annual Normal Rainfall   │ 776.0 mm (Monsoon Period: June–September)   │
│ Major Surface Reservoirs │ Yeldari Dam (Hydro/Irrigation, Purna River) │
│                          │ Lower Dudhna Dam (Selu Taluka)              │
│ Groundwater Setting      │ Deccan Volcanic Basalt (Fractured/Vesicular)│
│ Critical Aquifer Zones   │ Pathri, Manwath, and Purna alluvium fringes │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 4. Technical Scope of the 90-Day Pilot

During the 90-day pilot, the existing tested prototype will be upgraded and deployed in a staging environment configured with authentic Parbhani administrative feeds:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       JALDRISHTI AI TECHNICAL STACK                          │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ Frontend Web Interface               │ React 18, TypeScript, Vite, Tailwind  │
│ GIS & Spatial Mapping                │ Leaflet, Census 2011 Boundaries, GeoJSON
│ Analytical Backend & REST API        │ Python 3.11+, FastAPI, Pandas, NumPy  │
│ Statistical Climatology              │ Scipy (Thom 1958 Gamma Fitting)       │
│ Machine Learning Forecasting         │ Scikit-Learn (HistGradientBoosting)   │
│ Security & Encryption                │ TLS 1.3 HTTPS, Role-Based JWT, MeitY  │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

### Core Modules Deployed in Pilot:
1. **Administrative GIS Choropleth**: District and taluka-level boundary layers showing Composite Risk Index (CRI) tiers with basemap switching (Dark Canvas, OpenStreetMap, Satellite).
2. **Rainfall Climatology & Departure Engine**: Automatic computation of rainfall deviations against 50-year IMD Long Period Averages (LPA) and dry-spell duration tracking.
3. **WMO-No. 1090 SPI Engine**: Ongoing computation of SPI-3 (agricultural drought) and SPI-6 (hydrological drought) using two-parameter Gamma distribution fitting with zero-rainfall adjustments ($q$).
4. **Machine Learning Outlook (30-Day Lead)**: Supervised gradient boosting regression predicting 1-month forward SPI-3 with empirical 95% confidence intervals ($\hat{y} \pm 1.96 \times \text{RMSE}$).
5. **Deterministic MCDA Risk Modeler**: Multi-criteria weighted index with sensitivity sliders allowing officials to model contingency scenarios.
6. **Executive Dossier & Export Service**: One-click downloadable CSV reports and print-optimized PDF water security dossiers.

---

## 5. Required Datasets & Inter-Departmental Exchange Matrix

The pilot requires zero hardware capital expenditure; it functions by synthesizing existing, public and intra-departmental data streams:

| Department / Agency | Dataset Name | Update Cadence | Format / Protocol | Institutional Role |
| :--- | :--- | :---: | :---: | :--- |
| **Mahavedh (GoM) / IMD** | Revenue circle daily precipitation & temperature | Daily | API / CSV Export | Rainfall deficit & dry-spell calculation |
| **GSDA Parbhani** | Observation well water table depths & DWLR telemetry | Monthly / Post-monsoon | Excel / API feed | Groundwater stress & depletion fraction |
| **WRD (Irrigation)** | Yeldari & Lower Dudhna live storage, inflows & canal draft | Daily | Daily Bulletin / Web scrape | Surface storage buffer & dead storage alert |
| **DSAO (Agriculture)** | Crop sowing progress & moisture stress observations | Weekly | Weekly Crop Weather Watch Report | Agronomic advisory targeting |
| **Collectorate (Revenue)**| Official tanker sanctions & drinking water distress requisitions | Weekly | DDMA Portal / Excel | Verification & ground-truthing baseline |

---

## 6. Implementation Timeline (90 Days)

The pilot will execute in three distinct 30-day phases:

```mermaid
flowchart LR
    A["Month 1 (Days 1–30)<br/>Ingestion & Staging Setup"] --> B["Month 2 (Days 31–60)<br/>Shadow Operational Testing"]
    B --> C["Month 3 (Days 61–90)<br/>Evaluation & Scaling Handover"]
```

### Phase 1: Ingestion, Localization & Staging Setup (Days 1–30)
- **Day 1–10**: Formal orientation meeting with Parbhani District Collectorate; establish Single Points of Contact (SPOCs) across DSAO, WRD, and GSDA.
- **Day 11–20**: Configure automated data connectors for Mahavedh AWS feeds and WRD daily bulletins; ingest 10-year historical taluka-level series.
- **Day 21–30**: Deploy localized staging server on a MeitY-empaneled cloud environment; calibrate baseline policy weights to Parbhani's specific hydrogeology; conduct user acceptance testing (UAT).

### Phase 2: Shadow Operational Testing & Departmental Co-Design (Days 31–60)
- **Day 31–45**: Conduct 2 bilingual (English/Marathi) hands-on workshops for DSAO field staff, Tahsildars, and WRD section officers.
- **Day 46–60**: Run parallel "shadow operations" during active seasonal transitions. Generate weekly executive water security dossiers and compare system warnings against actual field reports. Incorporate departmental user feedback.

### Phase 3: Impact Audit, Field Ground-Truthing & Scaling Handover (Days 61–90)
- **Day 61–75**: Conduct independent ground-truthing in 10 sample villages across Pathri, Jintur, and Gangakhed talukas to verify water table fall and tanker demand correlation.
- **Day 76–85**: Audit ML forecast accuracy on live data; document lead-time advantages achieved over traditional retrospective surveys.
- **Day 86–90**: Deliver the **Final Pilot Evaluation Report** and executive briefing to the District Collector and the Seva First Innovation Committee with a blueprint for scaling across all 8 Marathwada districts.

---

## 7. Stakeholder Roles & Responsibilities (RACI Matrix)

```
R = Responsible (Executes)    A = Accountable (Approves)
C = Consulted (Provides Data) I = Informed (Receives Reports)
```

| Project Activity | Innovator (Lead) | District Collectorate | DSAO (Agri) | WRD (Irrigation) | GSDA (GW) | Zilla Parishad |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Platform Deployment & Maintenance | **R / A** | I | I | I | I | I |
| Data Stream Provisioning & Access | C | A | **R** | **R** | **R** | C |
| Weight Calibration & Policy Thresholds | R | **A** | C | C | C | I |
| Field Staff Training Participation | R | I | **C** | **C** | **C** | C |
| Weekly Decision-Support Utilization | C | **A** | R | R | R | R |
| Ground-Truthing & Evaluation Audit | **R** | A | C | C | C | C |
| Final Acceptance & Scaling Review | R | **A** | I | I | I | I |

---

## 8. Itemized Pilot Budget & Financial Structure

The proposed budget is structured as an **assumption-based, milestone-linked technical work order**:

| Head | Item Description | Cost (INR) | Payment Milestone |
| :--- | :--- | :---: | :--- |
| **1.0 Engineering & Connectors** | Custom API pipeline for Mahavedh AWS, GSDA DWLR parsing, and sub-district GIS boundary integration | ₹4,20,000 | Milestone 1 (Day 30): Staging Go-Live |
| **2.0 Capacity Building & Training** | 4 bilingual workshops for district officers, administrative user manuals in Marathi, on-site onboarding | ₹2,80,000 | Milestone 2 (Day 60): Mid-Term Review |
| **3.0 Cloud & Cyber Security** | 12-month hosting on MeitY-empaneled cloud, SSL/TLS, automated daily backups, ISO/IEC 27001 compliant storage | ₹1,50,000 | Milestone 1 (Day 30): Staging Go-Live |
| **4.0 Ground-Truthing & Impact Audit** | Field verification in 10 sample villages, statistical audit of forecast accuracy vs manual tanker logs | ₹2,50,000 | Milestone 3 (Day 90): Final Acceptance |
| **5.0 Technical Support & Tuning** | Dedicated full-stack software & data support engineer stationed for 90 days of continuous operation | ₹2,30,000 | Milestone 2 & 3 (Monthly split) |
| **6.0 Contingency & Operations** | Field transit across 9 talukas, administrative documentation, and unforeseen technical edge cases (~8%) | ₹1,20,000 | Milestone 3 (Day 90): Final Acceptance |
| **TOTAL PILOT ESTIMATE** | | **₹14,50,000** | *(Fourteen Lakhs Fifty Thousand Only)* |

---

## 9. Risk Assessment & Mitigation Strategy

| Risk Category | Identified Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **Data Ingestion** | Delay or gaps in obtaining official Mahavedh/GSDA API feeds | High | Medium | Implement robust fallback pipelines utilizing automated web scrapers for public WRD bulletins and IMD gridded datasets; flag imputed values transparently (`qc_flag="I"`). |
| **Institutional** | Administrative bandwidth constraints among busy taluka revenue staff | Medium | Medium | Keep training sessions concise (<90 minutes), deliver automated 1-page Marathi PDF executive summaries directly to mobile phones/email, require zero manual data entry from officials. |
| **Technical** | Server downtime or cloud latency during critical weather events | High | Low | Deploy redundant architecture on MeitY-empaneled cloud with automated health-check monitoring, offline-first client caching, and static CSV fallback datasets. |
| **Climatic Variance** | Atypical extreme rainfall during the 90-day window masking drought stress | Medium | Low | The platform evaluates cumulative hydrological deficit and historical climatology percentiles (P10 to P90), ensuring meaningful validation across both excess and deficit cycles. |

---

## 10. Measurable Success Criteria (Exit Milestones)

At the conclusion of the 90-day pilot, the project will be formally evaluated against 5 objective criteria:

1. **System Reliability**: Minimum **99.5% operational uptime** of the web application and API over 90 days with zero data loss.
2. **Forecast Accuracy Verification**: ML 1-month ahead SPI-3 predictions maintaining holdout test Mean Absolute Error (MAE) $\le 0.42$ against observed rain-gauge readings across Parbhani's monitoring stations.
3. **Anticipatory Warning Advance**: Demonstrable advance warning of water stress generated at least **30 calendar days** prior to formal retrospective disaster declarations.
4. **Administrative Efficiency**: Generation time for district water security profiles reduced from 4 working days of manual inter-departmental compilation to **under 15 seconds** via one-click export.
5. **Departmental Satisfaction**: Documented positive operational feedback from at least 3 participating line departments (Agriculture, Irrigation, Collectorate) regarding clarity, speed, and explainability.

---

## 11. Scientific Integrity & Data Governance Commitment

1. **Open Source & Government Ownership**: All code, documentation, and mathematical models developed under this challenge pilot will be made available to the Government of Maharashtra under open, non-proprietary terms.
2. **Zero Hallucination Guarantee**: Synthetic data will remain visibly demarcated in development environments; no unverified live feeds will ever be presented as verified telemetry.
3. **Data Privacy**: No personally identifiable citizen data (PII) is captured, stored, or processed. All analytics operate exclusively at administrative village, taluka, and district aggregates.
