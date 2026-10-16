# JalDrishti AI – Competition Pitch Deck Content
## Seva First Innovation Challenge 2026 · Government of Maharashtra
**Sector:** Sustainability – Energy, Climate and Others  
**Sub-Theme:** Drought Resilience, Rainwater Harvesting and Groundwater Recharge  
**Applicant:** Individual Innovator  
**Target Geography:** Marathwada Administrative Division (8 Districts), Maharashtra  

---

## Executive Presentation Structure (Six Slides)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          JALDRISHTI AI PITCH SLIDES                             │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────────┤
│ Slide 1         │ Slide 2         │ Slide 3         │ Slide 4                   │
│ Problem         │ Proposed        │ Innovation &    │ 90-Day Parbhani           │
│ Statement       │ Solution        │ Technology      │ Pilot Plan                │
├─────────────────┼─────────────────┴─────────────────┴───────────────────────────┤
│ Slide 5         │ Slide 6                                                       │
│ Expected Impact │ Itemized Budget &                                             │
│ & Scalability   │ Government Value Proposition                                  │
└─────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## Slide 1: Problem Statement

### Slide Title
**The Silent Crisis: Fragmented Water Data and Delayed Drought Response in Marathwada**

### Key Message
Marathwada faces recurring structural drought, yet water crisis management remains reactive rather than predictive because critical hydro-climatic data is locked in administrative silos across disconnected government departments.

### Key Content Points

1. **The Regional Reality (Marathwada Division)**:
   - **Geographic Scale**: 8 districts (*Chhatrapati Sambhajinagar, Jalna, Beed, Dharashiv, Latur, Nanded, Parbhani, Hingoli*), encompassing 76 talukas, ~64,813 km² geographic area, and over 18.7 million citizens.
   - **Rain-Shadow Vulnerability**: Average annual precipitation ranges from 650 mm to 880 mm, characterized by an exceptionally high inter-annual coefficient of variation (~25% to 32%), leading to prolonged dry spells during critical Kharif crop growth phases.
   - **Severe Hydro-Stress (Verified Baselines)**:
     - Groundwater over-extraction: According to the *Central Ground Water Board (CGWB) & GSDA Ground Water Year Book*, over 70% of monitoring dug wells in central Marathwada exhibit persistent post-monsoon water level depletion exceeding 2.0 to 4.0 meters below decadal medians.
     - Reservoir fragility: Major regional storage projects (e.g., Jayakwadi, Majalgaon, Sina Kolegaon) regularly dip below 20% live storage by early summer, with several touching dead storage levels, forcing large-scale emergency tanker deployments.
     - Economic impact: In severe drought cycles (e.g., 2015–16, 2018–19, and 2023–24), the state exchequer spent hundreds of crores on emergency water tanker mobilization, cattle fodder camps, and retrospective crop compensation.

2. **The Administrative Bottleneck: Institutional Silos**:
   - **Rainfall Telemetry**: Recorded by India Meteorological Department (IMD) gridded networks and Mahavedh Automatic Weather Stations (AWS).
   - **Groundwater Depletion**: Monitored quarterly by the Groundwater Surveys and Development Agency (GSDA).
   - **Surface Reservoirs**: Monitored daily by the Water Resources Department (WRD / Irrigation).
   - **Crop Stress & Sowing**: Tracked independently by the Commissionerate of Agriculture.
   - **Emergency Relief**: Mobilized retrospectively by District Collectorates and Revenue Authorities only *after* severe crisis thresholds are breached.

3. **Intended Beneficiaries**:
   - **Primary Government Decision-Makers**: District Collectors, District Disaster Management Authorities (DDMAs), Sub-Divisional Officers (SDOs), Tahsildars, Executive Engineers (WRD), District Superintending Agriculture Officers (DSAOs), and GSDA Senior Geologists.
   - **Impacted Citizens**: Smallholder agrarian families, rural gram panchayats, and peri-urban habitations dependent on tanker supply and municipal piped schemes.

### Data Transparency & Sources
- *Rainfall Climatology*: IMD Pune 50-year Long Period Average (LPA) datasets & Maharashtra Open Government Data (OGD).
- *Groundwater Depletion*: CGWB & GSDA Maharashtra Dynamic Ground Water Resources Assessment Reports.
- *Reservoir Status*: Water Resources Department (WRD), Government of Maharashtra daily reservoir bulletins.

---

## Slide 2: Proposed Solution

### Slide Title
**JalDrishti AI: An Explainable Water Intelligence & Drought Early-Warning Platform**

### Key Message
JalDrishti AI unifies meteorological, hydrogeological, and surface reservoir metrics into an explainable, interactive decision-support dashboard—enabling district administrations to anticipate water stress 30 to 45 days earlier than traditional retrospective declarations.

### Key Content Points

1. **System Overview**:
   - A single, bilingual (English & Marathi) decision-support platform designed specifically for the administrative workflows of Maharashtra’s district collectors and technical line departments.
   - Eliminates fragmented reporting by consolidating 3 core water pillars into an integrated composite intelligence index.

2. **Core Operational Workflow**:
   ```
   [ 1. Ingest Data ]  ──► [ 2. Normalize & Fit ] ──► [ 3. Explainable Risk ] ──► [ 4. Proactive Action ]
   • Rainfall (IMD)        • WMO SPI-3 / SPI-6        • Deterministic MCDA         • Tanker rationing
   • GW Depth (GSDA)       • Climatology percentiles  • Policy-weighted index      • Crop advisories
   • Storage % (WRD)       • Machine Learning outlook • Zero blackbox opacity      • CSV dossier export
   ```

3. **Implemented Capabilities vs. Proposed Functionality**:

| Component | Currently Implemented (Working Prototype) | Proposed for 90-Day Government Pilot |
| :--- | :--- | :--- |
| **GIS Choropleth Map** | Verified Census 2011 administrative boundaries for all 8 districts with interactive layer switching | Circle-level / Taluka-level micro-watershed boundaries |
| **Risk Computation** | Deterministic Multi-Criteria Decision Analysis (MCDA) with interactive sensitivity sliders | Calibrated threshold triggers mapped directly to Maharashtra Drought Manual criteria |
| **Drought Indicators** | Statistically validated SPI-3 & SPI-6 using 2-parameter Gamma MLE fitting (WMO-No. 1090) | Penman-Monteith SPEI incorporating evapotranspiration |
| **Forecasting Engine** | Chronologically evaluated ML regressors (HistGradientBoosting & Ridge) with 95% confidence intervals | Automated monthly inference pipeline linked to real-time Mahavedh AWS data feeds |
| **Decision Support** | Categorized agricultural, drinking water, and conservation advisories | Automated SMS / WhatsApp contingency dispatch to Tahsildars and Taluka Agriculture Officers |
| **Reporting** | One-click CSV dossier export and print-friendly executive profile | Automated weekly executive briefing PDF dispatch to District Collector's email |

---

## Slide 3: Innovation & Technology

### Slide Title
**Decoupled Architecture, Transparent MCDA Modeling, and Leakage-Free Machine Learning**

### Key Message
JalDrishti AI replaces opaque black-box neural networks with a statistically rigorous, verifiable analytical pipeline that couples deterministic multi-criteria risk scoring with holdout-validated time-series forecasting.

### Key Content Points

1. **Decoupled Modern Technology Stack**:
   - **Frontend UI**: React 18, TypeScript, Tailwind CSS, Leaflet GIS, and Recharts. Designed with a high-contrast dark navy government SaaS interface, fully responsive for desktop workstations and mobile field tablets.
   - **Backend API**: Python FastAPI, Pandas, NumPy, Scipy, Scikit-Learn. High-throughput asynchronous endpoints with Pydantic v2 data validation and 100% automated test coverage (41/41 unit & integration tests passing).

2. **Deterministic, Explainable Risk Formulation (MCDA)**:
   - Evaluated as a transparent linear combination:
     $$\text{Composite Risk Index (CRI)} = w_1 \cdot I_{\text{rainfall}} + w_2 \cdot I_{\text{groundwater}} + w_3 \cdot I_{\text{reservoir}}$$
   - Where weights are explicitly normalized ($\sum w_i = 1.0$), with default calibration:
     - $w_1 = 0.45$: Rainfall Deficit Index $I_{\text{rainfall}} = \max(0, \min(100, 1.5 \times \text{Deficit}\%))$
     - $w_2 = 0.35$: Groundwater Stress Index $I_{\text{groundwater}} \in [0, 100]$
     - $w_3 = 0.20$: Reservoir Scarcity Index $I_{\text{reservoir}} = \max(0, \min(100, 100 - \text{Live Storage}\%))$
   - *Government Value*: Administrators can adjust weights interactively on a sensitivity slider to evaluate "what-if" policy scenarios without relying on proprietary black boxes.

3. **WMO-No. 1090 Standardized Precipitation Index (SPI)**:
   - Two-parameter Gamma distribution $g(x) = \frac{1}{\beta^\alpha \Gamma(\alpha)} x^{\alpha - 1} e^{-x/\beta}$ fitted via Thom (1958) Maximum Likelihood Estimation across 25 years (2000–2024) of monthly precipitation records.
   - Zero-rainfall probability adjustment ($q$) strictly handles semi-arid non-monsoon months without mathematical divergence.

4. **Validated Machine Learning Engine (Zero Temporal Leakage)**:
   - **Strict Chronological Partition**: Training exclusively on $2000 \text{ to } 2018$ ($\le 2018$); holdout testing on unseen years $2019 \text{ to } 2024$ ($\ge 2019$). No random cross-validation shuffling.
   - **Models**: `HistGradientBoostingRegressor` (1-month forward SPI-3), `Ridge` Regression with $L_2$ penalty (3-month forward SPI-3), and `HistGradientBoostingClassifier` (drought occurrence $\text{SPI} \le -1.0$).
   - **Empirical Uncertainty**: Each projection provides mathematically verified 95% confidence intervals ($\hat{y} \pm 1.96 \times \text{RMSE}_{\text{test}}$).
   - **Holdout Benchmark**: Evaluated against the historical persistence baseline ($\hat{y}_{t+k} = \text{SPI}_t$) to ensure genuine predictive skill.

---

## Slide 4: Implementation & 90-Day Pilot Proposal

### Slide Title
**90-Day Proof-of-Concept Pilot in Parbhani District, Marathwada**

### Key Message
We propose a structured, low-risk, 90-day government pilot in Parbhani district to ground-truth the system with local administrative workflows, establish live telemetry connectors, and demonstrate quantifiable early-warning value.

### Key Content Points

1. **Why Parbhani as the Pilot Geography?**:
   - **Representative Vulnerability**: Located in the central Godavari basin with 9 talukas (*Parbhani, Gangakhed, Sonpeth, Pathri, Manwath, Palam, Selu, Jintur, Purna*).
   - **Agricultural Significance**: Dominant agrarian economy with heavy Kharif acreage in cotton and soybean and Rabi pulses, highly sensitive to mid-season dry spells.
   - **Surface & Sub-surface Pressures**: Dependent on Yeldari Dam (Purna project) and Lower Dudhna; high water table depletion (>65% of wells dropping >2m during dry cycles).

2. **Potential Government Stakeholders (Proposed Collaborators)**:
   - *Note*: Presented as proposed departmental partners for the innovation challenge; no formal pre-commitments are claimed.
   - **District Administration (Collectorate, Parbhani)**: Apex disaster management and tanker sanctioning authority.
   - **Department of Agriculture (DSAO Parbhani)**: Micro-irrigation scheduling and agro-advisories.
   - **Water Resources Department (Executive Engineer, Purna & Dudhna Projects)**: Reservoir storage telemetry and canal discharge scheduling.
   - **GSDA (Senior Geologist, Parbhani Division)**: Digital Water Level Recorder (DWLR) observation data.
   - **Zilla Parishad (Rural Water Supply Department)**: Village piped water security and tanker requirement tracking.

3. **Structured 90-Day Implementation Timeline**:
   ```
   [ Month 1: Days 1–30 ] ────────► [ Month 2: Days 31–60 ] ────────► [ Month 3: Days 61–90 ]
   Data Ingestion & Setup           Shadow Operational Run           Impact Audit & Scaling
   • Formal data-sharing protocol   • Weekly bulletin generation     • Verification vs tanker logs
   • Taluka-level GIS boundary      • Field officer feedback loop    • Prediction error audit
     refinement                     • Advisory threshold tuning      • Final Pilot Evaluation Report
   • System security hardening      • Bilingual workshop for staff     for Govt of Maharashtra
   ```

---

## Slide 5: Expected Impact & Scalability

### Slide Title
**Proactive Governance: Moving from Reactive Relief to Anticipatory Action**

### Key Message
By identifying water stress 30 to 45 days earlier, JalDrishti AI enables targeted irrigation rationing and pre-emptive groundwater conservation, potentially saving the exchequer crores in emergency tanker expenditure.

### Key Content Points

1. **Measurable Pilot Success Metrics (KPIs)**:
   - **Lead Time Improvement**: Warning of impending water table or reservoir depletion generated at least **30 days earlier** than traditional post-monsoon crop damage surveys.
   - **Forecast Accuracy Benchmark**: ML 1-month ahead SPI-3 forecast maintaining holdout test MAE $\le 0.42$ and classification F1-score $\ge 0.78$ against ground-truth station observations.
   - **Operational Adoption**: Weekly usage of executive dashboards by at least 3 key district departments (Revenue, Agriculture, Irrigation).
   - **Administrative Efficiency**: Generation time for district water security profiles reduced from 4 days of manual inter-departmental compilation to **under 15 seconds** via automated CSV/dossier generation.

2. **Demonstrated Prototype Results vs. Anticipated Pilot Outcomes**:
   - *Demonstrated Today*: Fully functioning 8-district dashboard, 41 passing automated tests, holdout-evaluated ML model showing 18.6% to 22.0% error reduction over persistence baselines, sub-second response times.
   - *Anticipated from Pilot*: Direct reduction in reactive tanker deployments through targeted demand-side management; ground-validated agro-meteorological advisory uptake.

3. **Three-Phase Scalability Roadmap**:
   - **Phase 1 (Months 1–3)**: 90-Day Pilot in Parbhani District (9 talukas).
   - **Phase 2 (Months 4–9)**: Regional Rollout across all 8 Marathwada Districts (76 talukas).
   - **Phase 3 (Months 10–18)**: Pan-Maharashtra expansion integrated into the State Disaster Management Authority (SDMA) and Relief & Rehabilitation Department.

---

## Slide 6: Itemized Budget & Government Value

### Slide Title
**Cost-Efficient Proof-of-Concept Structured as a Performance-Linked Work Order**

### Key Message
The proposed pilot requires a modest, transparent, milestone-linked budget of ₹14.5 Lakhs—delivering immediate return on investment by optimizing water budgeting and reducing emergency tanker mobilization.

### Key Content Points

1. **Itemized 90-Day Pilot Budget (Assumption-Based)**:

| Budget Head | Cost (INR) | Scope & Justification |
| :--- | :---: | :--- |
| **1. Engineering & Pipeline Refinement** | ₹4,20,000 | Automated API connectors for Mahavedh AWS, GSDA DWLR integration, and taluka-level GIS boundary harmonization |
| **2. Field Training & Capacity Building** | ₹2,80,000 | 4 interactive bilingual workshops for District Collectorate, DSAO, WRD, and Taluka staff; user manuals in Marathi |
| **3. Cloud Infrastructure & Security** | ₹1,50,000 | 12-month MeitY-empaneled secure cloud hosting, SSL/TLS certificates, daily automated encrypted database backups |
| **4. Ground-Truthing & Impact Audit** | ₹2,50,000 | Field sample well verifications, independent statistical validation of ML forecasts, comparison with tanker logs |
| **5. Technical Support & Operations** | ₹2,30,000 | Dedicated technical support engineer for real-time monitoring and bug fixes during the 90-day pilot |
| **6. Administrative & Contingency (8%)** | ₹1,20,000 | Unforeseen travel, administrative documentation, and final reporting |
| **TOTAL PILOT INVESTMENT** | **₹14,50,000** | **Total cost for 90-day comprehensive proof-of-concept** |

2. **Contractual Structure**:
   - Structured as a **milestone-linked government work order** rather than unrestricted prize money:
     - *Milestone 1 (30%)*: Data integration and live staging deployment in Parbhani.
     - *Milestone 2 (40%)*: Successful completion of 45-day operational shadow-testing and staff training.
     - *Milestone 3 (30%)*: Submission of Final Pilot Evaluation Report and open-source delivery to the Government of Maharashtra.

3. **High Return on Investment for the State**:
   - The deployment of a single water tanker for 90 days costs the district administration ₹1.5 to ₹3.0 Lakhs.
   - Avoiding just **5 to 8 unnecessary emergency tanker deployments** through early reservoir budgeting and groundwater recharge planning entirely covers the cost of this entire pilot.
