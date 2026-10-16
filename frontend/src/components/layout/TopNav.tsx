import React from 'react';
import {
  Download,
  Printer,
  RefreshCw,
  Languages,
  MapPin,
  AlertCircle,
  Menu,
  Award,
  Sparkles
} from 'lucide-react';
import { District, Language } from '../../types';
import { useTranslation } from '../../i18n/translations';
import { getCsvDownloadUrl } from '../../services/api';

interface TopNavProps {
  districts: District[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenDemoTour?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  language,
  onToggleLanguage,
  onRefresh,
  isRefreshing,
  onOpenDemoTour,
  onToggleMobileMenu
}) => {
  const t = useTranslation(language);

  const handleExportCsv = () => {
    const url = getCsvDownloadUrl(selectedDistrictId === 'all' ? undefined : selectedDistrictId);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur border-b border-navy-700/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      {/* Left side: Mobile Menu Toggle + District Selector */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:text-white"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* District Dropdown Selector */}
        <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 px-3 py-1.5 rounded-lg shadow-sm">
          <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {t.selectDistrict}:
          </span>
          <select
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-navy-900 text-slate-200">
              {t.allDistricts} (Overview)
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id} className="bg-navy-900 text-slate-200">
                {language === 'mr' ? d.name_mr : d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Competition Demo Walkthrough Button */}
        {onOpenDemoTour && (
          <button
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-teal-900/50 transition-all transform hover:scale-[1.02]"
            title="Launch Competition Guided Walkthrough (Parbhani Case Study)"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'mr' ? 'मार्गदर्शित प्रात्यक्षिक (परभणी)' : 'Guided Demo (Parbhani)'}
            </span>
            <span className="sm:hidden">Demo</span>
          </button>
        )}

        {/* Prominent Demo Flag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{t.demoNoticeShort}</span>
        </div>
      </div>

      {/* Right side: Language, Actions, Refresh */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-xs font-semibold text-slate-200 hover:border-teal-500/50 hover:text-teal-300 transition-colors"
          title="Switch Language / भाषा बदला"
        >
          <Languages className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden xs:inline">{language === 'en' ? 'मराठी' : 'English'}</span>
        </button>

        {/* Refresh simulation */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:text-teal-300 hover:border-teal-500/50 transition-colors disabled:opacity-50"
          title={t.refresh}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
        </button>

        {/* Export CSV button */}
        <button
          onClick={handleExportCsv}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600/20 border border-teal-500/40 text-teal-300 hover:bg-teal-600/30 text-xs font-semibold transition-colors"
          title="Download District Indicators CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV</span>
        </button>

        {/* Print button */}
        <button
          onClick={handlePrint}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:border-navy-600 text-xs font-medium transition-colors"
          title="Print Executive Dossier"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Print</span>
        </button>
      </div>
    </header>
  );
};
export default TopNav;
