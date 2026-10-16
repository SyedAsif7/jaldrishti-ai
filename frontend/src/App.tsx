import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { DroughtRiskMap } from './pages/DroughtRiskMap';
import { DroughtForecasting } from './pages/DroughtForecasting';
import { RainfallIntelligence } from './pages/RainfallIntelligence';
import { GroundwaterMonitoring } from './pages/GroundwaterMonitoring';
import { ReservoirStorage } from './pages/ReservoirStorage';
import { DroughtRiskAnalysis } from './pages/DroughtRiskAnalysis';
import { AlertsRecommendations } from './pages/AlertsRecommendations';
import { ReportsDataSources } from './pages/ReportsDataSources';

import { District, RegionalSummary, PageId, Language } from './types';
import { CompetitionDemoTour } from './components/common/CompetitionDemoTour';
import {
  fetchDistricts,
  fetchRegionalSummary,
  fetchGeoJSON
} from './services/api';
import {
  fallbackDistricts,
  fallbackRegionalSummary,
  districtShapesGeoJSON
} from './services/mockData';

export const App: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>(fallbackDistricts);
  const [summary, setSummary] = useState<RegionalSummary>(fallbackRegionalSummary);
  const [geoJsonData, setGeoJsonData] = useState<any>(districtShapesGeoJSON);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [language, setLanguage] = useState<Language>('en');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [districtsData, summaryData, geoData] = await Promise.all([
        fetchDistricts(),
        fetchRegionalSummary(),
        fetchGeoJSON()
      ]);
      setDistricts(districtsData);
      setSummary(summaryData);
      setGeoJsonData(geoData);
    } catch (err) {
      console.warn('Using embedded dataset:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'mr' : 'en'));
  };

  const selectedDistrict =
    selectedDistrictId === 'all'
      ? null
      : districts.find(d => d.id === selectedDistrictId) || null;

  // For pages that require a selected district (e.g. Rainfall, Groundwater, Reservoirs), default to Beed or the first district if "all" is active
  const activeFocusDistrict = selectedDistrict || districts[0] || fallbackDistricts[0];

  return (
    <div className="flex min-h-screen bg-[#F5F2E9] text-[#25332F] font-sans selection:bg-[#234F46]/20 selection:text-[#234F46]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        language={language}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Status Bar */}
        <TopNav
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Page Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {currentPage === 'overview' && (
            <OverviewDashboard
              districts={districts}
              summary={summary}
              selectedDistrict={selectedDistrict}
              language={language}
              onSelectDistrict={setSelectedDistrictId}
              onNavigatePage={setCurrentPage}
            />
          )}

          {currentPage === 'map' && (
            <DroughtRiskMap
              districts={districts}
              geoJsonData={geoJsonData}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrictId}
              onNavigatePage={setCurrentPage}
              language={language}
            />
          )}

          {currentPage === 'forecast' && (
            <DroughtForecasting
              districts={districts}
              selectedDistrict={activeFocusDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'rainfall' && (
            <RainfallIntelligence
              districts={districts}
              selectedDistrict={activeFocusDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'groundwater' && (
            <GroundwaterMonitoring
              districts={districts}
              selectedDistrict={activeFocusDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'reservoirs' && (
            <ReservoirStorage
              districts={districts}
              selectedDistrict={activeFocusDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'analysis' && (
            <DroughtRiskAnalysis
              districts={districts}
              selectedDistrict={activeFocusDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsRecommendations
              districts={districts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrictId}
              language={language}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsDataSources
              districts={districts}
              summary={summary}
              selectedDistrict={selectedDistrict}
              language={language}
            />
          )}

          {/* Interactive Competition Demo Walkthrough Modal */}
          <CompetitionDemoTour
            isOpen={isDemoTourOpen}
            onClose={() => setIsDemoTourOpen(false)}
            onSelectDistrict={setSelectedDistrictId}
            onNavigatePage={setCurrentPage}
            districts={districts}
            language={language}
          />
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-[#E3DDD0] bg-[#FFFEFA] text-center text-xs text-[#68736E]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              JalDrishti AI · Individual Innovation Project for Seva First Innovation Challenge 2026, Government of Maharashtra
            </span>
            <span className="font-mono text-[11px] text-[#A66628] font-medium">
              ● DEMONSTRATION SIMULATION DATA · NOT LIVE / OFFICIAL
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
