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
  LineChart,
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
type BasemapType = 'esri-canvas' | 'osm' | 'esri-topo';

const basemapConfigs: Record<BasemapType, { name: string; url: string; attribution: string }> = {
  'esri-canvas': {
    name: 'Clean Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  },
  'osm': {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  'esri-topo': {
    name: 'Topographic',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USGS, NOAA'
  }
};

// Center and smoothly zoom when selected district changes
const MapController: React.FC<{ selectedDistrict: District | null }> = ({ selectedDistrict }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedDistrict) {
      map.flyTo([selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng], 9, {
        duration: 0.8
      });
    } else {
      map.flyTo([19.25, 76.45], 8, { duration: 0.8 });
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
  const [basemap, setBasemap] = useState<BasemapType>('esri-canvas');
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Marathwada geographic centroid coordinates
  const mapCenter: [number, number] = [19.25, 76.45];
  const defaultZoom = 8;

  // Environmental Palette Color Calculator
  const getDistrictFillColor = (districtId: string): string => {
    const d = districts.find((item) => item.id === districtId);
    if (!d) return '#267D9D';

    if (mapMode === 'composite') {
      if (d.risk.risk_level === 'Severe') return '#B64D3C'; // Terracotta red
      if (d.risk.risk_level === 'High') return '#C7813C';   // Earth ochre
      if (d.risk.risk_level === 'Moderate') return '#DE9954'; // Warm amber
      return '#728A53'; // Olive green
    }

    if (mapMode === 'rainfall') {
      const def = d.rainfall.deficit_percentage;
      if (def >= 45) return '#B64D3C'; // Severe deficit: Terracotta red
      if (def >= 35) return '#C7813C'; // High deficit: Earth ochre
      if (def >= 25) return '#DE9954'; // Moderate deficit: Warm amber
      return '#267D9D'; // Normal/Safe: River blue
    }

    if (mapMode === 'groundwater') {
      const gw = d.groundwater.stress_index;
      if (gw >= 80) return '#B64D3C'; // Critical stress: Terracotta red
      if (gw >= 70) return '#C7813C'; // High stress: Earth ochre
      if (gw >= 55) return '#4A8B82'; // Moderate stress: Muted teal
      return '#728A53'; // Safe: Olive green
    }

    if (mapMode === 'reservoir') {
      const res = d.reservoirs.aggregate_storage_pct;
      if (res < 25) return '#B64D3C'; // Critical storage: Terracotta red
      if (res < 35) return '#C7813C'; // Low storage: Earth ochre
      if (res < 50) return '#4A8B82'; // Moderate: Muted teal
      return '#267D9D'; // Good storage: River blue
    }

    return '#267D9D';
  };

  const getMetricBadgeText = (d: District): string => {
    if (mapMode === 'composite') return `${d.risk.composite_score}`;
    if (mapMode === 'rainfall') return `-${d.rainfall.deficit_percentage}%`;
    if (mapMode === 'groundwater') return `GW ${d.groundwater.stress_index}`;
    return `Dam ${d.reservoirs.aggregate_storage_pct}%`;
  };

  // Geographic polygon style generator
  const getGeoJsonStyle = (feature: any) => {
    const districtId = feature?.properties?.id;
    const isSelected = selectedDistrict?.id === districtId;
    const fillColor = getDistrictFillColor(districtId);

    return {
      fillColor: fillColor,
      weight: isSelected ? 3.0 : 1.5,
      opacity: 1,
      color: isSelected ? '#16332C' : '#FFFEFA',
      dashArray: '',
      fillOpacity: isSelected ? 0.85 : 0.70
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
            weight: 3.0,
            color: '#234F46',
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
      <div className="px-4 py-2.5 rounded-xl bg-[#FFFEFA] border border-[#E3DDD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#25332F] shadow-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#234F46] shrink-0" />
          <span>
            <strong>Verified Census Administrative Boundaries:</strong> Official GIS district boundaries for Marathwada division, Maharashtra (Godavari Basin).
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F4F7EF] text-[#5A6E41] border border-[#8FA86E]/40 rounded">
            Census of India 2011 / OGD
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono text-[#68736E] bg-[#F5F2E9] border border-[#D1C9BA] rounded">
            EPSG:4326
          </span>
        </div>
      </div>

      {/* Header & Map Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#234F46]" />
            <span>{t.nav.map}</span>
          </h1>
          <p className="text-xs text-[#68736E] mt-1">
            {language === 'mr'
              ? 'मराठवाड्यातील ८ जिल्ह्यांचे अधिकृत सीमांकन व दुष्काळ जोखीम विश्लेषण नकाशा.'
              : 'Interactive GIS choropleth visualization of Marathwada division showing verified multi-criteria drought risk tiers.'}
          </p>
        </div>

        {/* Controls Bar: Basemap + Choropleth Layer + Label Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Basemap Switcher */}
          <div className="flex items-center gap-1 bg-[#FFFEFA] border border-[#D1C9BA] p-1 rounded-xl text-xs font-semibold shadow-xs">
            <MapIcon className="w-3.5 h-3.5 text-[#68736E] ml-2" />
            {(['esri-canvas', 'osm', 'esri-topo'] as BasemapType[]).map((bm) => (
              <button
                key={bm}
                onClick={() => setBasemap(bm)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  basemap === bm
                    ? 'bg-[#234F46] text-[#FFFEFA] font-bold shadow-xs'
                    : 'text-[#68736E] hover:text-[#25332F]'
                }`}
              >
                {basemapConfigs[bm].name}
              </button>
            ))}
          </div>

          {/* Choropleth Layer Selector */}
          <div className="flex items-center gap-1 bg-[#FFFEFA] border border-[#D1C9BA] p-1 rounded-xl text-xs font-semibold shadow-xs">
            <button
              onClick={() => setMapMode('composite')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'composite'
                  ? 'bg-[#234F46] text-white font-bold shadow-xs'
                  : 'text-[#68736E] hover:text-[#25332F]'
              }`}
            >
              Composite Risk
            </button>
            <button
              onClick={() => setMapMode('rainfall')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'rainfall'
                  ? 'bg-[#267D9D] text-white font-bold shadow-xs'
                  : 'text-[#68736E] hover:text-[#25332F]'
              }`}
            >
              Rain Deficit
            </button>
            <button
              onClick={() => setMapMode('groundwater')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'groundwater'
                  ? 'bg-[#4A8B82] text-white font-bold shadow-xs'
                  : 'text-[#68736E] hover:text-[#25332F]'
              }`}
            >
              Groundwater
            </button>
            <button
              onClick={() => setMapMode('reservoir')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                mapMode === 'reservoir'
                  ? 'bg-[#267D9D] text-white font-bold shadow-xs'
                  : 'text-[#68736E] hover:text-[#25332F]'
              }`}
            >
              Reservoirs
            </button>
          </div>

          {/* Label Display Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors shadow-xs ${
              showLabels
                ? 'bg-[#F2F7F4] text-[#234F46] border-[#234F46]/40 font-semibold'
                : 'bg-[#FFFEFA] text-[#68736E] border-[#D1C9BA]'
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
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#D1C9BA] shadow-md relative h-[580px] bg-[#E8E2D5]">
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
                    <div className="font-bold text-sm text-[#25332F] mb-0.5">
                      {language === 'mr' ? selectedDistrict.name_mr : selectedDistrict.name}
                    </div>
                    <div className="text-xs text-[#234F46] font-semibold mb-1">
                      Risk Score: {selectedDistrict.risk.composite_score}/100 ({selectedDistrict.risk.risk_level})
                    </div>
                    <div className="text-[11px] text-[#68736E] border-t border-[#E3DDD0] pt-1 space-y-0.5">
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
            <div className="absolute top-3 left-3 z-[1000] bg-[#FFFEFA]/95 backdrop-blur-xs border border-[#D1C9BA] text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getDistrictFillColor(hoveredDistrict.id) }}></span>
              <span className="font-bold text-[#25332F]">{hoveredDistrict.name}:</span>
              <span className="font-mono text-[#234F46] font-bold">{getMetricBadgeText(hoveredDistrict)}</span>
              <span className="text-[#68736E] text-[10px]">({hoveredDistrict.risk.risk_level})</span>
            </div>
          )}

          {/* Map Overlay Bottom Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-[#FFFEFA]/95 backdrop-blur-xs border border-[#D1C9BA] text-[11px] text-[#25332F] px-3.5 py-2 rounded-xl flex items-center gap-3 shadow-md pointer-events-none flex-wrap">
            <span className="font-bold text-[#68736E] uppercase text-[10px]">
              {mapMode.toUpperCase()} SCALE:
            </span>
            {mapMode === 'composite' && (
              <>
                <span className="flex items-center gap-1 text-[#B64D3C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B64D3C]" /> Severe (≥75)
                </span>
                <span className="flex items-center gap-1 text-[#C7813C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" /> High (55–74)
                </span>
                <span className="flex items-center gap-1 text-[#DE9954] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DE9954]" /> Moderate (30–54)
                </span>
                <span className="flex items-center gap-1 text-[#728A53] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#728A53]" /> Low (&lt;30)
                </span>
              </>
            )}
            {mapMode === 'rainfall' && (
              <>
                <span className="flex items-center gap-1 text-[#B64D3C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B64D3C]" /> &gt;45% Deficit
                </span>
                <span className="flex items-center gap-1 text-[#C7813C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" /> 35–45%
                </span>
                <span className="flex items-center gap-1 text-[#DE9954] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DE9954]" /> 25–35%
                </span>
                <span className="flex items-center gap-1 text-[#267D9D] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#267D9D]" /> &lt;25% Normal
                </span>
              </>
            )}
            {mapMode === 'groundwater' && (
              <>
                <span className="flex items-center gap-1 text-[#B64D3C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B64D3C]" /> &gt;80 Critical Stress
                </span>
                <span className="flex items-center gap-1 text-[#C7813C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" /> 70–80 High
                </span>
                <span className="flex items-center gap-1 text-[#4A8B82] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A8B82]" /> 55–70 Moderate
                </span>
                <span className="flex items-center gap-1 text-[#728A53] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#728A53]" /> &lt;55 Safe
                </span>
              </>
            )}
            {mapMode === 'reservoir' && (
              <>
                <span className="flex items-center gap-1 text-[#B64D3C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B64D3C]" /> &lt;25% Critical
                </span>
                <span className="flex items-center gap-1 text-[#C7813C] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C7813C]" /> 25–35% Low
                </span>
                <span className="flex items-center gap-1 text-[#4A8B82] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A8B82]" /> 35–50% Moderate
                </span>
                <span className="flex items-center gap-1 text-[#267D9D] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#267D9D]" /> &gt;50% Good
                </span>
              </>
            )}
          </div>
        </div>

        {/* Selected / Hovered District Inspection Dossier */}
        <div className="bg-[#FFFEFA] border border-[#E3DDD0] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#234F46] tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#728A53]" />
                  District Hydro-Intelligence Dossier
                </span>
                <h3 className="text-xl font-extrabold text-[#25332F] mt-0.5">
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
              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="flex items-center gap-1.5 text-xs text-[#68736E] mb-1">
                  <CloudRain className="w-3.5 h-3.5 text-[#267D9D]" />
                  <span>Rain Deficit</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#A66628]">
                  -{activeInspectDistrict.rainfall.deficit_percentage}%
                </div>
                <div className="text-[10px] text-[#68736E]">
                  {activeInspectDistrict.rainfall.monsoon_actual_mm}mm observed
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="flex items-center gap-1.5 text-xs text-[#68736E] mb-1">
                  <Waves className="w-3.5 h-3.5 text-[#4A8B82]" />
                  <span>GW Stress</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#4A8B82]">
                  {activeInspectDistrict.groundwater.stress_index}/100
                </div>
                <div className="text-[10px] text-[#68736E]">
                  Pre-monsoon: {activeInspectDistrict.groundwater.avg_depth_pre_monsoon_m}m
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="flex items-center gap-1.5 text-xs text-[#68736E] mb-1">
                  <Database className="w-3.5 h-3.5 text-[#267D9D]" />
                  <span>Dam Live Storage</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#267D9D]">
                  {activeInspectDistrict.reservoirs.aggregate_storage_pct}%
                </div>
                <div className="text-[10px] text-[#68736E]">
                  ~{activeInspectDistrict.reservoirs.drinking_water_security_days} days reserve
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F2E9] border border-[#E3DDD0]">
                <div className="flex items-center gap-1.5 text-xs text-[#68736E] mb-1">
                  <Info className="w-3.5 h-3.5 text-[#68736E]" />
                  <span>Critical Talukas</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#25332F]">
                  {activeInspectDistrict.groundwater.critical_talukas_count} / {activeInspectDistrict.talukas_count}
                </div>
                <div className="text-[10px] text-[#68736E]">
                  {activeInspectDistrict.groundwater.depleted_wells_pct}% depleted wells
                </div>
              </div>
            </div>

            {/* Key Reservoirs Summary */}
            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold text-[#68736E] uppercase tracking-wider text-[10px]">
                Major Surface Reservoirs:
              </span>
              {activeInspectDistrict.reservoirs.dams.map((dam, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#F5F2E9] border border-[#E3DDD0] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#25332F]">{dam.name}</div>
                    <div className="text-[10px] text-[#68736E]">
                      {dam.river} River · {dam.capacity_mcft.toLocaleString()} mcft
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        dam.live_storage_pct < 25 ? 'text-[#B64D3C]' : 'text-[#267D9D]'
                      }`}
                    >
                      {dam.live_storage_pct}%
                    </span>
                    {dam.dead_storage_alert && (
                      <span className="block text-[9px] text-[#B64D3C] uppercase font-bold">
                        Dead Storage Alert
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep-Dive Links */}
          <div className="pt-4 border-t border-[#F0EBE1] mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectDistrict(activeInspectDistrict.id);
                  onNavigatePage('rainfall');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#EDF6FA] hover:bg-[#D9EEF7] text-[#1C627C] border border-[#4EA3C3]/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Rainfall</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onSelectDistrict(activeInspectDistrict.id);
                  onNavigatePage('groundwater');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#F5F2E9] hover:bg-[#ECE6D8] text-[#25332F] border border-[#D1C9BA] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
              className="w-full py-2 px-3 rounded-xl bg-[#234F46] hover:bg-[#1E433B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <LineChart className="w-3.5 h-3.5 text-[#8FA86E]" />
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
