import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Brain,
  CloudRain,
  Waves,
  Database,
  Sliders,
  AlertTriangle,
  FileText,
  Droplets,
  ShieldCheck,
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
    { id: 'forecast', label: t.nav.forecast, icon: Brain },
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
    <div className="w-64 bg-navy-900 border-r border-navy-700/80 flex flex-col h-full text-slate-300">
      {/* Brand header */}
      <div className="p-5 border-b border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">
                JalDrishti
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded">
                AI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {language === 'mr' ? 'जल बुद्धिमत्ता प्रणाली' : 'Water Intelligence Platform'}
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 py-2 border-b border-navy-800">
        <div className="px-2 py-1 rounded bg-navy-800/80 border border-navy-700 text-[10px] text-teal-300/90 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="truncate">Seva First Challenge 2026</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          {language === 'mr' ? 'मुख्य विभाग' : 'Intelligence Modules'}
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
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-300 border-l-4 border-teal-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
              <span className="text-left leading-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Division footer */}
      <div className="p-4 border-t border-navy-700/80 bg-navy-950/60 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300">Marathwada Division</div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          CSN · Jalna · Beed · Dharashiv · Latur · Nanded · Parbhani · Hingoli
        </div>
        <div className="mt-2 text-[10px] text-amber-400/80 font-mono">
          Prototype v1.0 · Simulated Data
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
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
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
