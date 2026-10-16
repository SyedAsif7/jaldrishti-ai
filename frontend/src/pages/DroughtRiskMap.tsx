import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { District, Language, PageId } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoDisclaimer } from '../components/common/DemoDisclaimer';
import { useTranslation } from '../i18n/translations';
import {
  CloudRain,
  Waves,
  Database,
  ArrowRight,
  Layers,
  Info,
  Compass,
  Map as MapIcon,
  Tag,
  Brain,
  CheckCircle2
} from 'lucide-react';

interface DroughtRiskMapProps {
  districts: District[];
  geoJsonData: any;
  selectedDistrict: District | null;
  onSelectDistrict: (id: string) => void;
  onNavigatePage: (page: PageId) => void;
  language: Language;
}

type MapMode = 'composite' | 'rainfall' | 'groundwater' | 'reservoir';
type BasemapType = 'esri-dark' | 'osm' | 'satellite';

const basemapConfigs: Record<BasemapType, { name: string; url: string; attribution: string }> = {
  'esri-dark': {
    name: 'Dark Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  },
  'osm': {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  'satellite': {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
  }
};

// Center and smoothly zoom when selected district changes
const MapController: React.FC<{ selectedDistrict: District | null }> = ({ selectedDistrict }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedDistrict) {
      map.flyTo([selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng], 9, {
        duration: 1.0
      });
    } else {
      map.flyTo([19.25, 76.45], 8, { duration: 1.0 });
    }
  }, [selectedDistrict, map]);

  return null;
};

export const DroughtRiskMap: React.FC<DroughtRiskMapProps> = ({
  districts,
  geoJsonData,
  selectedDistrict,
  onSelectDistrict,
  onNavigatePage,
  language
}) => {
  const t = useTranslation(language);
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('composite');
  const [basemap, setBasemap] = useState<BasemapType>('esri-dark');
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Marathwada geographic centroid coordinates
  const mapCenter: [number, number] = [19.25, 76.45];
  const defaultZoom = 8;

  const getDistrictFillColor = (districtId: string): string => {
    const d = districts.find((item) => item.id === districtId);
    if (!d) return '#38bdf8';

    if (mapMode === 'composite') {
      if (d.risk.risk_level === 'Severe') return '#ef4444';
      if (d.risk.risk_level === 'High') return '#f97316';
      if (d.risk.risk_level === 'Moderate') return '#eab308';
      return '#10b981';
    }

    if (mapMode === 'rainfall') {
      const def = d.rainfall.deficit_percentage;
      if (def >= 45) return '#dc2626';
      if (def >= 35) return '#ea580c';
      if (def >= 25) return '#f59e0b';
      return '#14b8a6';
    }

    if (mapMode === 'groundwater') {
      const gw = d.groundwater.stress_index;
      if (gw >= 80) return '#b91c1c';
      if (gw >= 70) return '#c2410c';
      if (gw >= 55) return '#d97706';
      return '#059669';
    }

    if (mapMode === 'reservoir') {
      const res = d.reservoirs.aggregate_storage_pct;
      if (res < 25) return '#ef4444';
      if (res < 35) return '#f97316';
      if (res < 50) return '#0284c7';
      return '#06b6d4';
    }

    return '#38bdf8';
  };

  const getMetricBadgeText = (d: District): string => {
    if (mapMode === 'composite') return `${d.risk.composite_score}`;
    if (mapMode === 'rainfall') return `-${d.rainfall.deficit_percentage}%`;
    if (mapMode === 'groundwater') return `GW ${d.groundwater.stress_index}`;
    return `Dam ${d.reservoirs.aggregate_storage_pct}%`;
  };

  // Sleek polygon style generator
  const getGeoJsonStyle = (feature: any) => {
    const districtId = feature?.properties?.id;
    const isSelected = selectedDistrict?.id === districtId;
    const fillColor = getDistrictFillColor(districtId);

    return {
      fillColor: fillColor,
      weight: isSelected ? 3.5 : 1.8,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#0f172a',
      dashArray: isSelected ? '' : '',
      fillOpacity: isSelected ? 0.88 : 0.72
    };
  };

  // Configure interactions on each polygon feature
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const districtId = feature?.properties?.id;
    const district = districts.find((d) => d.id === districtId);

    if (district) {
      layer.on({
        mouseover: (e: any) => {
          const l = e.target;
          l.setStyle({
            weight: 3.5,
            color: '#38bdf8',
            fillOpacity: 0.90
          });
          l.bringToFront();
          setHoveredDistrict(district);
        },
        mouseout: (e: any) => {
          const l = e.target;
          l.setStyle(getGeoJsonStyle(feature));
          setHoveredDistrict(null);
        },
        click: () => {
          onSelectDistrict(district.id);
        }
      });

      // Cartographic label directly on the polygon
      if (showLabels) {
        const labelHtml = `
          <div class="district-label-content">
            <span class="district-label-name">${language === 'mr' ? district.name_mr : district.name}</span>
            <span class="district-label-badge" style="color: ${getDistrictFillColor(district.id)}">
              ${getMetricBadgeText(district)}
            </span>
          </div>
        `;

        (layer as any).bindTooltip(labelHtml, {
          permanent: true,
          direction: 'center',
          className: 'district-carto-label'
        });
      }
    }
  };

  // Sleek beacon pin icon for ONLY the currently selected district
  const createSelectedBeaconIcon = () => {
    return L.divIcon({
      className: 'selected-district-beacon-icon',
      html: `
        <div class="selected-district-beacon">
          <div class="beacon-ping"></div>
          <div class="beacon-dot"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const activeInspectDistrict = hoveredDistrict || selectedDistrict || districts[0];

  return (
    <div className="space-y-6">
      <DemoDisclaimer language={language} compact />

      {/* Geospatial Boundary Disclosure Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300 shadow">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong>Verified Census Boundaries:</strong> High-resolution administrative GIS polygons for Marathwada division, Maharashtra. Interlocking boundaries with real-time multi-criteria choropleth rendering.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded">
            Census of India 2011 / OGD
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-800 border border-navy-700 rounded">
            EPSG:4326
          </span>
        </div>
      </div>

      {/* Header & Map Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-teal-400" />
            <span>{t.nav.map}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr'
              ? 'मराठवाड्यातील ८ जिल्ह्यांचे अधिकृत सीमांकन व दुष्काळ जोखीम विश्लेषण नकाशा.'
              : 'Interactive GIS choropleth visualization of Marathwada division showing verified multi-criteria drought risk tiers.'}
          </p>
        </div>

        {/* Controls Bar: Basemap + Choropleth Layer + Label Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Basemap Switcher */}
          <div className="flex items-center gap-1 bg-navy-900 border border-navy-700/80 p-1 rounded-xl text-xs font-semibold shadow">
            <MapIcon className="w-3.5 h-3.5 text-slate-400 ml-2" />
            {(['esri-dark', 'osm', 'satellite'] as BasemapType[]).map((bm) => (
              <button
                key={bm}
                onClick={() => setBasemap(bm)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  basemap === bm
                    ? 'bg-navy-750 text-teal-300 border border-navy-600 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {basemapConfigs[bm].name}
              </button>
            ))}
          </div>

          {/* Choropleth Layer Selector */}
          <div className="flex items-center gap-1 bg-navy-900 border border-navy-700/80 p-1 rounded-xl text-xs font-semibold shadow">
            <button
              onClick={() => setMapMode('composite')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'composite'
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Composite Risk
            </button>
            <button
              onClick={() => setMapMode('rainfall')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'rainfall'
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rain Deficit
            </button>
            <button
              onClick={() => setMapMode('groundwater')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'groundwater'
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Groundwater
            </button>
            <button
              onClick={() => setMapMode('reservoir')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'reservoir'
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reservoir
            </button>
          </div>

          {/* Label Display Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow ${
              showLabels
                ? 'bg-navy-800 text-teal-300 border-teal-500/40'
                : 'bg-navy-900 text-slate-400 border-navy-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Labels {showLabels ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Map + Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Area */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-navy-700/80 shadow-2xl relative h-[580px] bg-navy-950">
          <MapContainer
            center={mapCenter}
            zoom={defaultZoom}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <MapController selectedDistrict={selectedDistrict} />

            {/* Base Map Tiles */}
            <TileLayer
              key={basemap}
              attribution={basemapConfigs[basemap].attribution}
              url={basemapConfigs[basemap].url}
              maxZoom={16}
            />

            {/* Verified Census GeoJSON Boundary Layer */}
            {geoJsonData && (
              <GeoJSON
                key={`${basemap}-${mapMode}-${showLabels}-${language}-${JSON.stringify(districts.map((d) => d.risk.composite_score))}`}
                data={geoJsonData}
                style={getGeoJsonStyle}
                onEachFeature={onEachFeature}
              />
            )}

            {/* Selected District Beacon Pin */}
            {selectedDistrict && (
              <Marker
                position={[selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng]}
                icon={createSelectedBeaconIcon()}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-bold text-sm text-white mb-0.5">
                      {language === 'mr' ? selectedDistrict.name_mr : selectedDistrict.name}
                    </div>
                    <div className="text-xs text-teal-300 font-semibold mb-1">
                      Risk Score: {selectedDistrict.risk.composite_score}/100 ({selectedDistrict.risk.risk_level})
                    </div>
                    <div className="text-[11px] text-slate-300 border-t border-navy-700 pt-1 space-y-0.5">
                      <div>Rainfall Deficit: -{selectedDistrict.rainfall.deficit_percentage}%</div>
                      <div>Groundwater Stress: {selectedDistrict.groundwater.stress_index}/100</div>
                      <div>Dam Live Storage: {selectedDistrict.reservoirs.aggregate_storage_pct}%</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Interactive Floating Hover Tag */}
          {hoveredDistrict && (
            <div className="absolute top-3 left-3 z-[1000] bg-navy-950/95 backdrop-blur border border-teal-500/40 text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getDistrictFillColor(hoveredDistrict.id) }}></span>
              <span className="font-bold text-white">{hoveredDistrict.name}:</span>
              <span className="font-mono text-teal-300 font-bold">{getMetricBadgeText(hoveredDistrict)}</span>
              <span className="text-slate-400 text-[10px]">({hoveredDistrict.risk.risk_level})</span>
            </div>
          )}

          {/* Map Overlay Bottom Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-navy-950/90 backdrop-blur border border-navy-800 text-[11px] text-slate-300 px-3.5 py-2 rounded-xl flex items-center gap-3 shadow-lg pointer-events-none flex-wrap">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              {mapMode.toUpperCase()} SCALE:
            </span>
            {mapMode === 'composite' && (
              <>
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Severe (≥75)
                </span>
                <span className="flex items-center gap-1 text-orange-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (55–74)
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate (30–54)
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (&lt;30)
                </span>
              </>
            )}
            {mapMode === 'rainfall' && (
              <>
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> &gt;45% Deficit
                </span>
                <span className="flex items-center gap-1 text-orange-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 35–45%
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 25–35%
                </span>
                <span className="flex items-center gap-1 text-teal-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> &lt;25% Normal
                </span>
              </>
            )}
            {mapMode === 'groundwater' && (
              <>
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-700" /> &gt;80 Critical Stress
                </span>
                <span className="flex items-center gap-1 text-orange-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> 70–80 High
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> 55–70 Moderate
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> &lt;55 Safe
                </span>
              </>
            )}
            {mapMode === 'reservoir' && (
              <>
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> &lt;25% Critical
                </span>
                <span className="flex items-center gap-1 text-orange-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 25–35% Low
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> 35–50% Moderate
                </span>
                <span className="flex items-center gap-1 text-teal-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> &gt;50% Good
                </span>
              </>
            )}
          </div>
        </div>

        {/* Selected / Hovered District Inspection Dossier */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  District Hydro-Intelligence Dossier
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {language === 'mr' ? activeInspectDistrict.name_mr : activeInspectDistrict.name}
                </h3>
              </div>
              <RiskBadge
                level={activeInspectDistrict.risk.risk_level}
                showScore={activeInspectDistrict.risk.composite_score}
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-teal-400" />
                  <span>Rain Deficit</span>
                </div>
                <div className="text-lg font-bold font-mono text-amber-300">
                  -{activeInspectDistrict.rainfall.deficit_percentage}%
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeInspectDistrict.rainfall.monsoon_actual_mm}mm observed
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Waves className="w-3.5 h-3.5 text-orange-400" />
                  <span>GW Stress</span>
                </div>
                <div className="text-lg font-bold font-mono text-orange-300">
                  {activeInspectDistrict.groundwater.stress_index}/100
                </div>
                <div className="text-[10px] text-slate-400">
                  Pre-monsoon: {activeInspectDistrict.groundwater.avg_depth_pre_monsoon_m}m
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dam Live Storage</span>
                </div>
                <div className="text-lg font-bold font-mono text-cyan-300">
                  {activeInspectDistrict.reservoirs.aggregate_storage_pct}%
                </div>
                <div className="text-[10px] text-slate-400">
                  ~{activeInspectDistrict.reservoirs.drinking_water_security_days} days reserve
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Critical Talukas</span>
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  {activeInspectDistrict.groundwater.critical_talukas_count} / {activeInspectDistrict.talukas_count}
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeInspectDistrict.groundwater.depleted_wells_pct}% depleted wells
                </div>
              </div>
            </div>

            {/* Key Reservoirs Summary */}
            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Major Surface Reservoirs:
              </span>
              {activeInspectDistrict.reservoirs.dams.map((dam, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{dam.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {dam.river} River · {dam.capacity_mcft.toLocaleString()} mcft
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        dam.live_storage_pct < 25 ? 'text-red-400' : 'text-teal-300'
                      }`}
                    >
                      {dam.live_storage_pct}%
                    </span>
                    {dam.dead_storage_alert && (
                      <span className="block text-[9px] text-red-400 uppercase font-bold">
                        Dead Storage Alert
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep-Dive Links */}
          <div className="pt-4 border-t border-navy-800 mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectDistrict(activeInspectDistrict.id);
                  onNavigatePage('rainfall');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Rainfall</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onSelectDistrict(activeInspectDistrict.id);
                  onNavigatePage('groundwater');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Groundwater</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => {
                onSelectDistrict(activeInspectDistrict.id);
                onNavigatePage('forecast');
              }}
              className="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drought Forecasting & ML Outlook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroughtRiskMap;
