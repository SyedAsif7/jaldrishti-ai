import React from 'react';
import {
  Download,
  Printer,
  RefreshCw,
  Languages,
  MapPin,
  AlertCircle,
  Menu,
  Compass,
  Calendar,
  Layers
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
    <header className="sticky top-0 z-30 bg-[#FFFEFA] border-b border-[#E3DDD0] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left side: Mobile Menu Toggle + District Selector + Region Label */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-[#F5F2E9] border border-[#D1C9BA] text-[#25332F] hover:bg-[#ECE6D8]"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Region context pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5F2E9] border border-[#E3DDD0] text-[11px] text-[#68736E] font-medium">
          <Compass className="w-3.5 h-3.5 text-[#234F46]" />
          <span>Marathwada Division · Godavari Basin</span>
        </div>

        {/* District Dropdown Selector */}
        <div className="flex items-center gap-2 bg-[#F5F2E9] border border-[#D1C9BA] px-3 py-1.5 rounded-lg shadow-2xs">
          <MapPin className="w-4 h-4 text-[#234F46] shrink-0" />
          <span className="text-xs text-[#68736E] font-semibold hidden sm:inline">
            {t.selectDistrict}:
          </span>
          <select
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="bg-transparent text-[#25332F] font-bold text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="all" className="bg-[#FFFEFA] text-[#25332F]">
              {t.allDistricts} (Overview)
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#FFFEFA] text-[#25332F]">
                {language === 'mr' ? d.name_mr : d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Data Reporting Cycle Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F7EF] border border-[#8FA86E]/40 text-[#5A6E41] text-[11px] font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#728A53] shrink-0" />
          <span>Water Year 2024–25 (Monsoon Cycle)</span>
        </div>

        {/* Guided Walkthrough Tour Button */}
        {onOpenDemoTour && (
          <button
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#234F46] hover:bg-[#1E433B] text-[#FFFEFA] font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            title="Launch 8-Step Guided Tour (Parbhani Case Study)"
          >
            <Layers className="w-3.5 h-3.5 text-[#8FA86E]" />
            <span className="hidden sm:inline">
              {language === 'mr' ? 'डेमो एक्सप्लोर करा (८ टप्पे)' : 'Explore Demo (8 Steps)'}
            </span>
            <span className="sm:hidden">Demo</span>
          </button>
        )}
      </div>

      {/* Right side: Language, Actions, Refresh */}
      <div className="flex items-center gap-2">
        {/* Prominent Demo Flag */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FBF5EE] border border-[#DE9954]/40 text-[#A66628] text-[11px] font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-[#C7813C] shrink-0" />
          <span>{t.demoNoticeShort}</span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#F5F2E9] border border-[#D1C9BA] text-xs font-semibold text-[#25332F] hover:bg-[#ECE6D8] transition-colors"
          title="Switch Language / भाषा बदला"
        >
          <Languages className="w-3.5 h-3.5 text-[#234F46]" />
          <span className="hidden xs:inline">{language === 'en' ? 'मराठी' : 'English'}</span>
        </button>

        {/* Refresh simulation */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-[#F5F2E9] border border-[#D1C9BA] text-[#25332F] hover:bg-[#ECE6D8] transition-colors disabled:opacity-50"
          title={t.refresh}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#234F46]' : ''}`} />
        </button>

        {/* Export CSV button */}
        <button
          onClick={handleExportCsv}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EDF6FA] border border-[#4EA3C3]/50 text-[#1C627C] hover:bg-[#D9EEF7] text-xs font-semibold transition-colors"
          title="Download District Indicators CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV</span>
        </button>

        {/* Print button */}
        <button
          onClick={handlePrint}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F2E9] border border-[#D1C9BA] text-[#68736E] hover:text-[#25332F] hover:bg-[#ECE6D8] text-xs font-medium transition-colors"
          title="Print Executive Dossier"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
