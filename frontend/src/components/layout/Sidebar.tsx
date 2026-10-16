import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  LineChart,
  CloudRain,
  Waves,
  Database,
  Sliders,
  AlertTriangle,
  FileText,
  Droplets,
  Landmark,
  X
} from 'lucide-react';
import { PageId, Language } from '../../types';
import { useTranslation } from '../../i18n/translations';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  language: Language;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  language,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const t = useTranslation(language);

  const navItems: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: t.nav.overview, icon: LayoutDashboard },
    { id: 'map', label: t.nav.map, icon: MapIcon },
    { id: 'forecast', label: t.nav.forecast, icon: LineChart },
    { id: 'rainfall', label: t.nav.rainfall, icon: CloudRain },
    { id: 'groundwater', label: t.nav.groundwater, icon: Waves },
    { id: 'reservoirs', label: t.nav.reservoirs, icon: Database },
    { id: 'analysis', label: t.nav.analysis, icon: Sliders },
    { id: 'alerts', label: t.nav.alerts, icon: AlertTriangle },
    { id: 'reports', label: t.nav.reports, icon: FileText },
  ];

  const handleItemClick = (pageId: PageId) => {
    onSelectPage(pageId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="w-64 bg-[#234F46] border-r border-[#1B3F38] flex flex-col h-full text-[#E5EFEA]">
      {/* Brand header */}
      <div className="p-5 border-b border-[#1E433B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1B3F38] text-[#FFFEFA] border border-[#2D6459] shadow-xs">
            <Droplets className="w-5 h-5 text-[#8FA86E]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#FFFEFA]">
                JalDrishti
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#1B3F38] text-[#8FA86E] border border-[#2D6459] rounded uppercase tracking-wider">
                GIS
              </span>
            </div>
            <div className="text-[11px] text-[#A3C4BC] font-medium leading-tight">
              {language === 'mr' ? 'जल बुद्धिमत्ता व दुष्काळ प्रणाली' : 'Water Intelligence System'}
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#A3C4BC] hover:text-white hover:bg-[#1E433B]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Program tag / official context */}
      <div className="px-4 py-2.5 border-b border-[#1E433B] bg-[#1E433B]/50">
        <div className="px-2.5 py-1 rounded bg-[#1B3F38] border border-[#2D6459]/60 text-[10px] text-[#C2DDD6] font-medium flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 text-[#8FA86E] shrink-0" />
          <span className="truncate">Seva First Challenge 2026</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-[#85AAA0] uppercase">
          {language === 'mr' ? 'मुख्य विभाग' : 'Monitoring Modules'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#FFFEFA] text-[#234F46] shadow-sm font-bold'
                  : 'text-[#D2E4DF] hover:text-white hover:bg-[#1E433B]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#234F46]' : 'text-[#85AAA0]'
                }`}
              />
              <span className="text-left leading-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Division footer */}
      <div className="p-4 border-t border-[#1E433B] bg-[#1B3F38] text-[11px] text-[#A3C4BC]">
        <div className="font-semibold text-[#FFFEFA] flex items-center gap-1.5">
          <span>Marathwada Division</span>
          <span className="text-[10px] px-1 py-0.2 bg-[#234F46] border border-[#2D6459] rounded text-[#8FA86E]">
            MH
          </span>
        </div>
        <div className="text-[10px] text-[#85AAA0] mt-1 leading-relaxed">
          8 Districts · 76 Talukas · Godavari Basin
        </div>
        <div className="mt-2 text-[10px] text-[#DE9954] font-mono">
          Prototype v1.0 · Simulated Baseline
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#112823]/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative z-10 shadow-2xl flex-1 max-w-xs">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
