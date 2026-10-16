# JalDrishti AI – Limitations & Scientific Ethics Statement
## Seva First Innovation Challenge 2026 · Maharashtra Zone
**Document Code:** `SFIC-2026-ETHICS-LIMITATIONS-V1`

---

## 1. Ethical Commitments & Grounding Principles

The JalDrishti AI initiative is developed under an uncompromising commitment to scientific rigor, technical transparency, and government integrity:

1. **Zero Fabrication of Historical Observations:**
   All meteorological normals, groundwater depths, and reservoir capacities are grounded in published datasets from the India Meteorological Department (IMD), the Central Ground Water Board (CGWB), the Groundwater Surveys and Development Agency (GSDA), and the Water Resources Department (WRD), Government of Maharashtra.
2. **Zero Fictitious Government Endorsements:**
   The project does not claim or imply existing formal partnerships, commercial contracts, or official endorsements from any government department. All proposed workflows and pilot schedules represent structured proposals submitted for evaluation under the *Seva First Innovation Challenge 2026*.
3. **No Black-Box Opacity:**
   In public governance, decision-makers must explain and defend emergency expenditures to audit bodies and the public. JalDrishti AI uses deterministic Multi-Criteria Decision Analysis (MCDA) and standardized World Meteorological Organization (WMO-No. 1090) formulas. All weighting coefficients, mathematical bounds, and confidence intervals are explicitly documented and visible to users.
4. **Honest Reporting of Machine Learning Metrics:**
   Model evaluations are reported strictly from holdout test sets using chronologically split historical time-series data. The platform explicitly refuses to invent artificial "99% accuracy" claims. Where machine learning models lack sufficient continuous training observations, forward predictions are disabled and labeled accordingly.

---

## 2. Prototype Limitations & Boundary Conditions

To ensure appropriate interpretation by evaluation committees and government stakeholders, the operational limitations of the current prototype (TRL-6) are documented below:

### 2.1 Spatial Resolution
- **Current State:** The operational unit of the prototype is at the **district level** (8 districts of Marathwada), with tabular profiles down to the **taluka level** (76 talukas).
- **Limitation:** The current system does not provide micro-watershed or village-level cadastral spatial modeling. Such granularity requires localized high-resolution digital elevation models (DEM) and circle-level rain-gauge telemetry planned for Phase 2 of the proposed Parbhani pilot.

### 2.2 Telemetry Connectivity & Demonstration Data
- **Current State:** Real-time continuous telemetry connections to state-restricted servers (e.g., Mahavedh intranet API feeds, real-time SCADA gates) are unavailable to an independent innovator without formal departmental authorization.
- **Limitation:** The current prototype operates on **statistically calibrated historical baseline observations** reflecting verified regional climatology.
- **Safeguard:** Prominent **`DEMONSTRATION DATA`** indicator badges are active across all dashboard pages, cards, and export files to ensure no evaluator or user mistakes demonstration metrics for live sensor feeds.

### 2.3 Hydrogeological Heterogeneity in Deccan Basalt
- **Current State:** Groundwater stress is modeled using depth-to-water table (m bgl) measurements from GSDA observation well networks.
- **Limitation:** The Deccan Volcanic Basalt formation is characterized by non-continuous, fractured hard-rock aquifers where water tables can vary significantly across short spatial distances (within 500 meters). The system provides broad regional aquifer stress indices rather than localized point-well guarantees.

### 2.4 Lead-Time Horizon
- **Current State:** Predictive outlooks are bounded strictly to **1-month forward projections** (with 3-month seasonal trend estimations).
- **Limitation:** Long-range multi-seasonal forecasting (>3 months) in rain-shadow regions exhibits high stochastic uncertainty. The platform explicitly restricts forecasting horizons to maintain actionable reliability.

---

## 3. Responsible AI Governance Protocol

| Principle | JalDrishti AI Implementation |
|---|---|
| **Human-in-the-Loop** | JalDrishti AI is strictly an **advisory decision-support system**. It does not automate administrative decrees, fund disbursements, or water cutoffs without human review and authorization by the District Collector and designated technical officers. |
| **Auditability** | Every composite score can be decomposed into its 4 constituent sub-indices and raw physical units (mm, m bgl, % storage), providing an immediate audit trail for administrative justifications. |
| **Data Privacy & Security** | The platform does not collect, process, or store personal citizen data or personally identifiable information (PII). All spatial and climatic data is aggregate, public, and environmental. |
| **Open Standards Compliance** | Adheres to Ministry of Electronics and Information Technology (MeitY) open data guidelines and WMO scientific standards. |
