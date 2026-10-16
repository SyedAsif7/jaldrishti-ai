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
        return <Wheat className="w-4 h-4 text-emerald-400" />;
      case 'drinking water':
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'tanker contingency':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'groundwater':
        return <Layers className="w-4 h-4 text-orange-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'severe':
        return 'border-red-500/50 bg-red-950/20 text-red-300';
      case 'high':
        return 'border-orange-500/50 bg-orange-950/20 text-orange-300';
      case 'medium':
        return 'border-amber-500/50 bg-amber-950/20 text-amber-300';
      default:
        return 'border-teal-500/50 bg-teal-950/20 text-teal-300';
    }
  };

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Advisory Distinction & Transparency Notice */}
      <div className="p-4 rounded-xl bg-navy-900 border border-teal-500/30 flex items-start gap-3 shadow-md">
        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-teal-300 tracking-wide uppercase">
            Guidance Classification & Legal Demarcation Notice
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            All advisories on this page represent <strong>General Technical Guidance</strong> algorithmically generated from simulated rainfall deficits, groundwater depletion thresholds, and reservoir scarcity indices. They do <strong>NOT</strong> constitute official Government Gazettes, statutory orders under the Disaster Management Act, or sanctioned district administrative notifications.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t.nav.alerts}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'कृषी, पिण्याचे पाणी, टँकर नियोजन आणि भूजल संरक्षणासाठी जिल्हास्तरीय मार्गदर्शक सूचना.'
              : 'Actionable multi-sectoral advisories filtered by domain and drought risk severity.'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-700 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-navy-900">All Sectors</option>
              <option value="Agriculture" className="bg-navy-900">Agriculture</option>
              <option value="Drinking Water" className="bg-navy-900">Drinking Water</option>
              <option value="Tanker Contingency" className="bg-navy-900">Tanker Contingency</option>
              <option value="Groundwater" className="bg-navy-900">Groundwater</option>
              <option value="Emergency" className="bg-navy-900">Emergency</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-700 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-navy-900">All Severities</option>
              <option value="Severe" className="bg-navy-900">Severe Priority</option>
              <option value="High" className="bg-navy-900">High Priority</option>
              <option value="Medium" className="bg-navy-900">Medium Priority</option>
              <option value="Low" className="bg-navy-900">Low Priority</option>
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
              className="p-5 rounded-2xl border bg-navy-900/90 shadow-lg backdrop-blur flex flex-col justify-between transition-all hover:border-slate-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-navy-950 border border-navy-800">
                      {getDomainIcon(item.domain)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white">
                        {language === 'mr' ? item.districtNameMr : item.districtName}
                      </span>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                        {item.domain}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${style}`}>
                    {item.severity} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed mt-2 font-normal">
                  {item.text}
                </p>

                <div className="mt-2.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-navy-950 border border-navy-800">
                    Source: Technical Guidance Model · Not Official Gazette
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>District Status: <strong className="text-white">{item.districtRisk} Risk</strong></span>
                <button
                  onClick={() => onSelectDistrict(item.districtId)}
                  className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Select District →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAdvisories.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-navy-900 border border-navy-800 text-slate-400">
          No advisories match the current filter selection.
        </div>
      )}

      {/* Government Contingency Standard Protocols Box */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-xl space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Operational Contingency Checklist for Revenue & Water Administration</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <strong className="text-teal-400 block mb-1">1. Drinking Water Reservation</strong>
            Review municipal allocation quotas from major dams; earmark minimum 250 days consumption reserve.
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <strong className="text-amber-400 block mb-1">2. Tanker Route Optimization</strong>
            Map telemetry-equipped tankers and GPS-tagged source wells in habitations experiencing water pressure drops.
          </div>
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <strong className="text-orange-400 block mb-1">3. Agricultural Advisories</strong>
            Promote drip and sprinkler subsidy disbursements under PoCRA (Nanaji Deshmukh Krishi Sanjivani Prakalp).
          </div>
        </div>
      </div>
    </div>
  );
};
