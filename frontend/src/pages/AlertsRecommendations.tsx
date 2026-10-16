import React, { useState } from 'react';
import {
  AlertTriangle,
  Filter,
  CheckCircle2,
  Wheat,
  Droplet,
  Truck,
  ShieldAlert,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { District, Language } from '../types';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';

interface AlertsRecommendationsProps {
  districts: District[];
  selectedDistrict: District | null;
  onSelectDistrict: (id: string) => void;
  language: Language;
}

export const AlertsRecommendations: React.FC<AlertsRecommendationsProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  language
}) => {
  const t = useTranslation(language);

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Aggregate advisories
  const activeDistricts = selectedDistrict ? [selectedDistrict] : districts;
  const allAdvisories = activeDistricts.flatMap((d) =>
    d.advisories.map((adv) => ({
      ...adv,
      districtId: d.id,
      districtName: d.name,
      districtNameMr: d.name_mr,
      districtRisk: d.risk.risk_level
    }))
  );

  // Filtered advisories
  const filteredAdvisories = allAdvisories.filter((item) => {
    const matchesDomain =
      selectedDomain === 'all' || item.domain.toLowerCase() === selectedDomain.toLowerCase();
    const matchesSeverity =
      selectedSeverity === 'all' || item.severity.toLowerCase() === selectedSeverity.toLowerCase();
    return matchesDomain && matchesSeverity;
  });

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'agriculture':
        return <Wheat className="w-4 h-4 text-[#728A53]" />;
      case 'drinking water':
        return <Droplet className="w-4 h-4 text-[#267D9D]" />;
      case 'tanker contingency':
        return <Truck className="w-4 h-4 text-[#C7813C]" />;
      case 'groundwater':
        return <Layers className="w-4 h-4 text-[#4A8B82]" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#B64D3C]" />;
    }
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'severe':
        return 'border-[#B64D3C]/40 bg-[#FAF0EE] text-[#B64D3C]';
      case 'high':
        return 'border-[#C7813C]/40 bg-[#FBF5EE] text-[#A66628]';
      case 'medium':
        return 'border-[#DE9954]/40 bg-[#FFF9F2] text-[#B87028]';
      default:
        return 'border-[#728A53]/40 bg-[#F4F7EF] text-[#5A6E41]';
    }
  };

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Advisory Distinction & Transparency Notice */}
      <div className="p-4 rounded-xl bg-[#FFFEFA] border border-[#234F46]/30 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-lg bg-[#F2F7F4] text-[#234F46] shrink-0 mt-0.5 border border-[#234F46]/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#234F46] tracking-wide uppercase">
            Guidance Classification & Legal Demarcation Notice
          </h4>
          <p className="text-xs text-[#68736E] leading-relaxed mt-1">
            All advisories on this page represent <strong>General Technical Guidance</strong> algorithmically generated from simulated rainfall deficits, groundwater depletion thresholds, and reservoir scarcity indices. They do <strong>NOT</strong> constitute official Government Gazettes, statutory orders under the Disaster Management Act, or sanctioned district administrative notifications.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#C7813C]" />
            <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
              {t.nav.alerts}
            </h1>
          </div>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'कृषी, पिण्याचे पाणी, टँकर नियोजन आणि भूजल संरक्षणासाठी जिल्हास्तरीय मार्गदर्शक सूचना.'
              : 'Actionable multi-sectoral advisories filtered by domain and drought risk severity.'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 bg-[#FFFEFA] border border-[#D1C9BA] px-3 py-1.5 rounded-xl text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-[#68736E]" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-transparent text-[#25332F] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Sectors</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Tanker Contingency">Tanker Contingency</option>
              <option value="Groundwater">Groundwater</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-[#FFFEFA] border border-[#D1C9BA] px-3 py-1.5 rounded-xl text-xs shadow-xs">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-[#25332F] font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="Severe">Severe Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advisory Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdvisories.map((item, idx) => {
          const style = getSeverityStyle(item.severity);
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E3DDD0] bg-[#FFFEFA] shadow-sm flex flex-col justify-between transition-all hover:border-[#D1C9BA] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0]">
                      {getDomainIcon(item.domain)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#25332F]">
                        {language === 'mr' ? item.districtNameMr : item.districtName}
                      </span>
                      <span className="text-[10px] text-[#68736E] block uppercase tracking-wider font-semibold">
                        {item.domain}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${style}`}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#25332F] mb-1.5 leading-snug">
                  {language === 'mr' ? item.action_mr : item.action}
                </h3>
                <p className="text-xs text-[#68736E] leading-relaxed mb-4">
                  {language === 'mr' ? item.rationale_mr : item.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#68736E]">
                <span className="font-medium">
                  Lead Agency: <strong className="text-[#25332F]">{item.target_department}</strong>
                </span>
                <button
                  onClick={() => onSelectDistrict(item.districtId)}
                  className="text-xs text-[#234F46] hover:text-[#17362F] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Select {item.districtName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsRecommendations;
