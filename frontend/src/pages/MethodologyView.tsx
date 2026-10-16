import React from 'react';
import {
  BookOpen,
  Calculator,
  Database,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle2,
  Scale,
  Calendar,
  Compass,
  LineChart,
  Waves,
  CloudRain
} from 'lucide-react';
import { Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface MethodologyViewProps {
  language: Language;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ language }) => {
  const t = useTranslation(language);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <DemoDisclaimer language={language} compact />

      {/* Header Banner */}
      <div className="bg-[#234F46] p-6 rounded-2xl border border-[#1E433B] text-[#FFFEFA] shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#8FA86E]" />
          <span className="text-[11px] font-bold text-[#A3C4BC] tracking-wider uppercase">
            Scientific Foundation & Technical Documentation
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#FFFEFA] tracking-tight">
          {language === 'mr' ? 'कार्यपद्धती, संदर्भ स्रोत व मर्यादा' : 'Scientific Methodology, Data Sources & Limitations'}
        </h1>
        <p className="text-xs text-[#C2DDD6] mt-1.5 max-w-3xl leading-relaxed">
          {language === 'mr'
            ? 'पर्जन्यमान तूट, डब्ल्यूएमओ एसपीआय, बहु-निकषीय निर्णय विश्लेषण (MCDA) आणि मॉडेल मर्यादांचे सविस्तर स्पष्टीकरण.'
            : 'Detailed explanation of rainfall deficit formulas, WMO SPI distribution fitting, multi-criteria composite risk scoring, data provenance, and operational limitations.'}
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Rainfall Deficit & WMO SPI Calculation */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#EBF4F6] text-[#267D9D]">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">
                1. Rainfall Deficit & WMO SPI-3/6
              </h2>
              <span className="text-[11px] text-[#68736E]">Meteorological & Agricultural Drought</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#25332F] leading-relaxed">
            <p>
              <strong>Percentage Departure Formula:</strong> Rainfall anomalies are evaluated against India Meteorological Department (IMD) 30-year Long Period Averages (1991–2020 normal):
            </p>
            <div className="p-3 bg-[#F5F2E9] rounded-xl font-mono text-[11px] text-[#234F46] border border-[#E3DDD0]">
              Departure (%) = ((Actual Cumulative Rainfall - LPA Normal) / LPA Normal) × 100
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[#68736E]">
              <li><strong className="text-[#25332F]">Excess:</strong> Departure ≥ +20%</li>
              <li><strong className="text-[#25332F]">Normal:</strong> -19% to +19%</li>
              <li><strong className="text-[#25332F]">Deficient:</strong> -20% to -59%</li>
              <li><strong className="text-[#25332F]">Large Deficient:</strong> Departure ≤ -60%</li>
            </ul>

            <div className="pt-2 border-t border-[#F0EBE1]">
              <p>
                <strong>WMO-No. 1090 Standardized Precipitation Index:</strong> Computed by fitting 3-month (SPI-3) and 6-month (SPI-6) accumulated precipitation to a two-parameter Gamma distribution with Maximum Likelihood Estimation (MLE) and transforming to standard normal quantiles.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Groundwater & Reservoir Risk Contribution */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#EBF7F5] text-[#4A8B82]">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">
                2. Groundwater & Reservoir Indicators
              </h2>
              <span className="text-[11px] text-[#68736E]">Hydrological Storage & Aquifer Stress</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#25332F] leading-relaxed">
            <p>
              <strong>Groundwater Depletion Sub-Index:</strong> Derived from Groundwater Surveys & Development Agency (GSDA) observation dug-well records:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[#68736E]">
              <li><strong className="text-[#25332F]">Depth to Water Table:</strong> Measured in meters below ground level (m bgl).</li>
              <li><strong className="text-[#25332F]">Year-on-Year Water Table Fall:</strong> Comparison against 5-year decadal pre/post-monsoon medians.</li>
              <li><strong className="text-[#25332F]">Stage of Groundwater Extraction:</strong> Ratio of annual extraction to net availability (talukas exceeding 70% flagged as semi-critical/critical).</li>
            </ul>

            <div className="pt-2 border-t border-[#F0EBE1]">
              <p>
                <strong>Reservoir Storage Sub-Index:</strong> Daily live storage percentage from the Water Resources Department (WRD) across major regional projects (Jayakwadi, Lower Dudhana, Yeldari, Majalgaon, Sina, Manjara). Converted to drinking water security days buffer.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Deterministic MCDA vs Machine Learning */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#FAF0E6] text-[#C7813C]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">
                3. Deterministic MCDA vs. Model-Driven AI
              </h2>
              <span className="text-[11px] text-[#68736E]">Zero Black-Box Opacity for Government Trust</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#25332F] leading-relaxed">
            <p>
              <strong>Why Deterministic Risk Scoring?</strong> In public administration, disaster funds cannot be allocated on unexplained neural network outputs. JalDrishti AI uses an auditable Multi-Criteria Decision Analysis (MCDA) composite index:
            </p>
            <div className="p-3 bg-[#F5F2E9] rounded-xl font-mono text-[11px] text-[#234F46] border border-[#E3DDD0]">
              Score = (0.35 × Rainfall) + (0.30 × Groundwater) + (0.25 × Reservoir) + (0.10 × Soil Moisture)
            </div>
            <p>
              <strong>Where Machine Learning is Applied:</strong> Supervised multivariate regression (Ridge & Random Forest) is used strictly for the 1-month forward rainfall and SPI outlook, trained and validated with strict chronological splits (2010–2020 train, 2021–2023 val, 2024 test) to prevent future-data leakage.
            </p>
          </div>
        </div>

        {/* 4. Data Provenance & Reporting Cycle */}
        <div className="bg-[#FFFEFA] p-6 rounded-2xl border border-[#E3DDD0] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE1]">
            <div className="p-2 rounded-lg bg-[#F4F7EF] text-[#728A53]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25332F]">
                4. Data Sources & Reporting Periods
              </h2>
              <span className="text-[11px] text-[#68736E]">Authoritative Government Baselines</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#25332F] leading-relaxed">
            <ul className="space-y-2 text-[#68736E]">
              <li>
                <strong className="text-[#25332F]">Precipitation:</strong> India Meteorological Department (IMD) & Mahavedh AWS 30-year normal climatology (1991–2020).
              </li>
              <li>
                <strong className="text-[#25332F]">Groundwater:</strong> GSDA Maharashtra & Central Ground Water Board (CGWB) Dynamic Groundwater Assessment.
              </li>
              <li>
                <strong className="text-[#25332F]">Reservoirs:</strong> Maharashtra Water Resources Department (WRD) dam bulletins.
              </li>
              <li>
                <strong className="text-[#25332F]">Spatial GIS:</strong> Survey of India / Census of India 2011 administrative boundaries (EPSG:4326).
              </li>
              <li>
                <strong className="text-[#25332F]">Current Reporting Cycle:</strong> Water Year 2024–25 (Monsoon and Post-Monsoon).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Explicit Limitations & Simulated Data Statement */}
      <div className="p-6 rounded-2xl bg-[#FFF9F2] border border-[#DE9954]/50 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#A66628] font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-[#C7813C]" />
          <span>Operational Limitations & Demonstration Data Statement</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#25332F] leading-relaxed">
          <div>
            <h3 className="font-bold text-[#A66628] mb-1">Demonstration Data Notice</h3>
            <p className="text-[#68736E]">
              Because real-time government telemetry APIs require internal VPN credentials, this prototype operates on statistically calibrated historical baseline observations. All simulated values are visibly labeled with the <span className="font-mono text-[#A66628] font-bold">DEMONSTRATION DATA</span> pill badge. The platform strictly avoids fabricating live sensor feeds or unofficial emergency alerts.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#A66628] mb-1">Geological & Forecast Boundaries</h3>
            <p className="text-[#68736E]">
              The Deccan Volcanic Basalt geology features non-continuous hard-rock aquifers where water tables can vary over 500 meters; the system provides regional stress indices rather than localized point-well guarantees. Forward predictive horizons are explicitly restricted to 1-month and 3-month outlooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologyView;
