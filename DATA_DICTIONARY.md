# JalDrishti AI – Data Dictionary & Source Specification
## Marathwada Water Intelligence & Drought Monitoring
*Project for Seva First Innovation Challenge 2026, Government of Maharashtra*

---

> [!WARNING]
> **DEMONSTRATION SIMULATION DATA**:
> All values provided in this version of the prototype are synthetic baseline parameters modeled after regional hydrological characteristics of Marathwada. They are intended for software architecture verification, mathematical model demonstration, and stakeholder evaluation. No live government telemetry or official disaster declarations are claimed.

---

### 1. Spatial Scope & Geographic Coverage

| Field | Type | Description | Unit / Format | Reference Source |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Unique slug identifier for the district | kebab-case (e.g., `beed`) | Administrative boundaries |
| `name` | String | English administrative district name | Text | Revenue Division, GoM |
| `name_mr` | String | Marathi script representation | UTF-8 Text | Maharashtra Official Gazette |
| `talukas_count` | Integer | Total administrative sub-districts (talukas) | Count | District Collectorate Records |
| `talukas` | Array[String] | List of talukas within the district | List | Revenue Dept, GoM |
| `area_sq_km` | Float | Total geographic area | Square Kilometers ($\text{km}^2$) | Survey of India |
| `population` | Integer | Estimated district population | Persons | Census of India / Projection |
| `coordinates` | Object | Geographic centroid $\{ \text{lat}, \text{lng} \}$ | Decimal Degrees (WGS84) | OpenStreetMap / GIS |

---

### 2. Meteorological & Rainfall Indicators

| Field | Type | Description | Threshold / Normal | Simulated Source Model |
| :--- | :--- | :--- | :--- | :--- |
| `annual_normal_mm` | Float | Long Period Average (LPA) annual precipitation | Millimeters (mm) | IMD Pune 50-year LPA standard |
| `monsoon_normal_mm` | Float | Normal June–September monsoon precipitation | Millimeters (mm) | IMD Regional Meteorological Centre |
| `monsoon_actual_mm` | Float | Simulated observed cumulative rainfall | Millimeters (mm) | Simulated Mahavedh AWS network |
| `deficit_percentage` | Float | Departure from LPA: $\frac{\text{Actual} - \text{Normal}}{\text{Normal}} \times 100$ | Percentage ($\%$) | IMD Deficit Classification Criteria |
| `spi_3month_estimate`| Float | Standardized Precipitation Index (3-month window) | $-2.0$ to $+2.0$ ($<-1.5$: Severe Dry) | McKee et al. (1993) algorithm |
| `dry_spell_days_max` | Integer | Maximum continuous days without rainfall ($<2.5\text{ mm}$) | Days ($>21$: Critical crop stress) | Agrometeorological Advisory Manual |

---

### 3. Groundwater Hydrology Indicators

| Field | Type | Description | Threshold / Unit | Simulated Source Model |
| :--- | :--- | :--- | :--- | :--- |
| `avg_depth_pre_monsoon_m` | Float | Water table depth in May (pre-monsoon) | Meters below ground level (m bgl) | GSDA observation well network |
| `avg_depth_post_monsoon_m`| Float | Water table depth in October (post-monsoon) | Meters below ground level (m bgl) | GSDA observation well network |
| `water_table_fall_m` | Float | Depletion compared to 5-year decadal mean | Meters (m) ($>2\text{ m}$: Critical) | CGWB Ground Water Year Book |
| `depleted_wells_pct` | Float | Percentage of observation wells with water level drop | Percentage ($\%$) | GSDA District Reports |
| `stress_index` | Float | Scaled stress index ($0\text{--}100$) combining fall & well % | Index ($0\text{--}100$) | Internal MCDA Normalization |
| `stage_of_extraction_pct`| Float | Ratio of annual extraction to net recharge | Percentage ($\%$) ($>100\%$: Overexploited)| CGWB National Compilation Report |
| `critical_talukas_count` | Integer | Talukas classified as Over-exploited or Critical | Count | Central Ground Water Board (CGWB) |

---

### 4. Surface Reservoir & Water Storage Indicators

| Field | Type | Description | Threshold / Unit | Simulated Source Model |
| :--- | :--- | :--- | :--- | :--- |
| `aggregate_storage_pct` | Float | Aggregate live storage across major & medium projects | Percentage ($\%$) of gross live capacity | Water Resources Dept (WRD), GoM |
| `drinking_water_security_days`| Integer | Estimated municipal drinking water supply buffer | Days remaining at current draft rate | Municipal Corporation Water Budgets |
| `dams[].name` | String | Major/Medium dam name (e.g. Jayakwadi, Majalgaon) | Text | WRD Project Directory |
| `dams[].capacity_mcft` | Float | Gross storage capacity | Million Cubic Feet (mcft) | WRD Design Records |
| `dams[].live_storage_pct` | Float | Current live water storage percentage | Percentage ($\%$) ($<25\%$: Critical Alert)| WRD Daily Reservoir Status |
| `dams[].dead_storage_alert`| Boolean | True if water level has touched or breached dead storage | Boolean Flag | Irrigation Operations Manual |

---

### 5. Composite Risk Mathematical Formulation

The composite risk score is evaluated deterministically as:

$$\text{Composite Risk Index (CRI)} = w_1 \cdot I_{\text{rainfall}} + w_2 \cdot I_{\text{groundwater}} + w_3 \cdot I_{\text{reservoir}}$$

Where:
- $w_1 = 0.45, w_2 = 0.35, w_3 = 0.20$ (Normalized $\sum w_i = 1.0$)
- $I_{\text{rainfall}} = \max\left(0, \min\left(100, 1.5 \times \text{Deficit}\%\right)\right)$
- $I_{\text{groundwater}} = \text{Groundwater Stress Index } [0, 100]$
- $I_{\text{reservoir}} = \max\left(0, \min\left(100, 100 - \text{Live Storage}\%\right)\right)$

**Risk Severity Brackets:**
- **Severe**: $\ge 75$ (Red `#ef4444`)
- **High**: $55 \le \text{Score} < 75$ (Orange `#f97316`)
- **Moderate**: $30 \le \text{Score} < 55$ (Amber `#eab308`)
- **Low**: $< 30$ (Emerald `#10b981`)

---

### 6. Standardized Precipitation Index (SPI-3 & SPI-6) Methodology

Calculated strictly adhering to **World Meteorological Organization (WMO-No. 1090) Standardized Precipitation Index User Guide**:

#### Probability Density Function
Two-parameter Gamma distribution fitted to cumulative rainfall $x$ across time window $k$ (where $k=3$ months for agricultural drought, $k=6$ months for hydrological drought):

$$g(x) = \frac{1}{\beta^\alpha \Gamma(\alpha)} x^{\alpha - 1} e^{-x/\beta} \quad \text{for } x > 0$$

Where $\alpha$ (shape) and $\beta$ (scale) parameters are estimated via Thom (1958) Maximum Likelihood Estimation:

$$\hat{\alpha} = \frac{1 + \sqrt{1 + \frac{4A}{3}}}{4A}, \quad A = \ln(\bar{x}) - \frac{\sum \ln(x)}{n}, \quad \hat{\beta} = \frac{\bar{x}}{\hat{\alpha}}$$

#### Zero-Precipitation Adjustment
Because arid/semi-arid non-monsoon months frequently record zero precipitation ($x = 0$), the cumulative probability distribution $H(x)$ is adjusted:

$$H(x) = q + (1 - q) G(x)$$

Where $q = \frac{m}{n}$ is the empirical probability of zero precipitation ($m$ is the count of zeros in the observation period of length $n$).

#### Normal Standard Quantile Transformation
The adjusted cumulative probability $H(x)$ is transformed to the standard normal distribution using the inverse cumulative distribution function:

$$\text{SPI} = \Phi^{-1}(H(x))$$

| SPI Range | WMO Classification | Color Code | Sectoral Interpretation |
| :--- | :--- | :--- | :--- |
| $\ge +2.0$ | Extremely Wet | `#06b6d4` | Flooding, high aquifer recharge |
| $+1.5 \text{ to } +1.99$ | Very Wet | `#3b82f6` | Ample soil moisture, surplus streamflow |
| $+1.0 \text{ to } +1.49$ | Moderately Wet | `#10b981` | Favorable crop growth conditions |
| $-0.99 \text{ to } +0.99$ | Near Normal | `#64748b` | Climatological baseline balance |
| $-1.0 \text{ to } -1.49$ | Moderately Dry | `#f59e0b` | Initial soil moisture deficit; crop stress |
| $-1.5 \text{ to } -1.99$ | Severely Dry | `#f97316` | Significant yield loss, reduced reservoir inflow |
| $\le -2.0$ | Extremely Dry | `#ef4444` | Severe hydrological emergency; tanker demand |

---

### 7. Supervised Machine Learning Forecasting Architecture

#### Feature Vector Formulation (Strictly at Time $t$)
To guarantee zero future-data leakage, all features are extracted strictly from observation dates $\le t$:
- `sin_month`, `cos_month`: Trigonometric circular month encodings ($\sin(2\pi m / 12)$, $\cos(2\pi m / 12)$).
- `actual_mm`: Precipitation at time $t$.
- `lag1_rain_mm`, `lag2_rain_mm`, `lag3_rain_mm`: Precipitation lagged by 1, 2, and 3 months.
- `current_spi3`: Current 3-month Standardized Precipitation Index.
- `departure_norm`: Normalized deviation from historical monthly normal: $\frac{\text{actual} - \text{normal}}{\text{normal}}$.
- `gw_depth_m`: Seasonal groundwater water table depth (m bgl) from GSDA observation network.
- `res_storage_pct`: Major surface reservoir live storage percentage at time $t$.

#### Chronological Holdout Partition
- **Training Set**: Chronological years $2000 \text{ to } 2018$ ($\sim 216$ monthly samples per district).
- **Testing Set**: Strictly unseen holdout years $2019 \text{ to } 2024$ ($\sim 66$ monthly samples per district).
- **Zero Temporal Leakage Guarantee**: No random train/test shuffling. Training dates strictly precede all testing dates.

#### Model Implementations
1. **1-Month Lead Regressor**: `HistGradientBoostingRegressor` (max iterations: 80, max depth: 4) predicting forward SPI-3.
2. **3-Month Lead Regressor**: `Ridge` Regression ($L_2$ regularization penalty $\alpha = 10.0$) preventing overfitting on extended lead times.
3. **Drought Classification Model**: `HistGradientBoostingClassifier` predicting binary drought occurrence ($\text{SPI-3} \le -1.0$).
4. **95% Confidence Interval**: Evaluated empirically from holdout test RMSE: $\hat{y} \pm 1.96 \times \text{RMSE}_{\text{test}}$.
5. **Persistence Baseline**: $\hat{y}_{t+k} = \text{SPI-3}_t$. The gold standard benchmark against which all ML models must demonstrate verified error reduction.

