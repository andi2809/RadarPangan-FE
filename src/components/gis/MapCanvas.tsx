'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { UnifiedRegionTelemetry, SupplyRoute, PriceStatus } from '../../types/domain';
import { MapTooltip, NonJabarInfo } from './MapTooltip';
import { MapLegend } from './MapLegend';
import { Maximize2, Compass, Navigation, MapPin } from 'lucide-react';

interface MapCanvasProps {
  geoJson: GeoJSON.FeatureCollection | null;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  activeHorizon: 'aktual' | 'h7';
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  activeSupplyRoutes?: SupplyRoute[];
  simulatedStatusMap?: Record<string, PriceStatus>;
  mode?: 'full' | 'preview';
  className?: string;
  onOpenCommandCenter?: (regionId?: string) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  geoJson,
  allTelemetry,
  activeHorizon,
  selectedRegionId,
  onSelectRegion,
  activeSupplyRoutes = [],
  simulatedStatusMap = {},
  mode = 'full',
  className,
  onOpenCommandCenter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeViewScope, setActiveViewScope] = useState<'jabar' | 'indonesia' | 'user'>('jabar');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [internalGeoJson, setInternalGeoJson] = useState<GeoJSON.FeatureCollection | null>(geoJson);

  // Auto-load GeoJSON fallback if parent passes null
  useEffect(() => {
    if (geoJson && geoJson.features && geoJson.features.length > 0) {
      setInternalGeoJson(geoJson);
      return;
    }

    let isMounted = true;
    fetch('/geo/indonesia-kabkota.geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setInternalGeoJson(data);
        }
      })
      .catch((err) => {
        console.warn('Fallback loading Indonesia GeoJSON, trying Jabar:', err);
        fetch('/geo/jabar-27-kabkota.geojson')
          .then((r) => r.json())
          .then((d) => {
            if (isMounted && d) setInternalGeoJson(d);
          })
          .catch((e) => console.error('All GeoJSON fallbacks failed:', e));
      });

    return () => {
      isMounted = false;
    };
  }, [geoJson]);

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    telemetry: UnifiedRegionTelemetry | null;
    nonJabarInfo: NonJabarInfo | null;
    x: number;
    y: number;
    visible: boolean;
  }>({
    telemetry: null,
    nonJabarInfo: null,
    x: 0,
    y: 0,
    visible: false,
  });

  // Color mapping based on EWS status
  const getColorForStatus = useCallback((status?: string) => {
    switch (status) {
      case 'kritis':
        return '#DC2626'; // Vibrant Red (Rentan / Defisit >10%)
      case 'waspada':
        return '#EAB308'; // Warm Amber/Yellow (Waspada Fluktuasi 5-10%)
      case 'turun':
        return '#2563EB'; // Royal Blue (Deflasi / Pasokan Melimpah)
      case 'aman':
        return '#16A34A'; // Emerald Green (Terkendali / Surplus 0-5%)
      default:
        return '#16A34A'; // Default to controlled green
    }
  }, []);

  // Deterministic fallback EWS status for Indonesian provinces
  const getNationalStatus = useCallback((provinceId: string, id: string): PriceStatus => {
    const cleanId = (id || '').replace(/\D/g, '');
    const num = parseInt(cleanId || '1', 10);
    // Eastern Indonesia has higher logistics disparity
    if (['81', '82', '91', '92', '94', '95', '96'].includes(provinceId)) return 'kritis';
    // Java surplus areas
    if (['33', '35'].includes(provinceId)) return num % 4 === 0 ? 'waspada' : 'aman';
    // Urban centers (DKI, Banten)
    if (['31', '36'].includes(provinceId)) return num % 2 === 0 ? 'kritis' : 'waspada';
    // General provinces
    return num % 5 === 0 ? 'kritis' : num % 3 === 0 ? 'waspada' : 'aman';
  }, []);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; CartoDB &copy; OpenStreetMap',
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#F4EFE6', // Warm paper basemap
            },
          },
          {
            id: 'osm-base',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-opacity': 0.7,
            },
          },
        ],
      },
      center: [107.6191, -6.9175], // Jawa Barat default
      zoom: mode === 'preview' ? 7.6 : 8.0,
      minZoom: 3.5,
      maxZoom: 14,
      pitch: mode === 'preview' ? 0 : 15,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mode]);

  // View switch: Fly to Indonesia
  const handleFlyToIndonesia = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('indonesia');
    mapRef.current.flyTo({
      center: [118.0149, -2.5489],
      zoom: mode === 'preview' ? 4.4 : 4.8,
      pitch: 0,
      duration: 1200,
      essential: true,
    });
  }, [mode]);

  // View switch: Fly to Jawa Barat
  const handleFlyToJabar = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('jabar');
    mapRef.current.flyTo({
      center: [107.6191, -6.9175],
      zoom: mode === 'preview' ? 7.8 : 8.2,
      pitch: 0,
      duration: 1000,
      essential: true,
    });
  }, [mode]);

  // View switch: Geolocate
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      handleFlyToIndonesia();
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeolocating(false);
        const { longitude, latitude } = pos.coords;
        if (longitude >= 95 && longitude <= 141 && latitude >= -11 && latitude <= 6) {
          setActiveViewScope('user');
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 8.5,
            duration: 1200,
            essential: true,
          });
        } else {
          handleFlyToIndonesia();
        }
      },
      (err) => {
        setIsGeolocating(false);
        console.warn('Geolocation fallback to Jabar:', err);
        handleFlyToJabar();
      },
      { timeout: 5000 }
    );
  }, [handleFlyToIndonesia, handleFlyToJabar]);

  // Center camera when selectedRegionId changes
  useEffect(() => {
    if (!mapRef.current || !selectedRegionId || !internalGeoJson) return;
    const targetFeature = internalGeoJson.features.find((f) => f.properties?.id === selectedRegionId);
    const centroid = targetFeature?.properties?.centroid;
    if (centroid && typeof centroid.lng === 'number' && typeof centroid.lat === 'number') {
      mapRef.current.flyTo({
        center: [centroid.lng, centroid.lat],
        zoom: mode === 'preview' ? 8.4 : 9.0,
        duration: 800,
        essential: true,
      });
    }
  }, [selectedRegionId, internalGeoJson, mode]);

  // Update GeoJSON and Choropleth Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !internalGeoJson) return;

    const validFeatures = internalGeoJson.features.filter(
      (f) => f && f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
    );

    const enrichedFeatures = validFeatures.map((feat) => {
      const p = feat.properties || {};
      const isJabar = Boolean(
        p.isJabar ||
        p.provinceId === '32' ||
        p.KDPPUM === '32' ||
        (p.provinceName && p.provinceName.toLowerCase().includes('jawa barat')) ||
        (p.WADMPR && p.WADMPR.toLowerCase().includes('jawa barat'))
      );

      const regId = (p.id || p.KDPKAB || feat.id) as string;
      const isH7 = activeHorizon === 'h7';

      let effectiveStatus: PriceStatus = 'aman';
      let telem = allTelemetry[regId];

      if (isJabar) {
        const baseStatus = isH7 ? telem?.predictionH7?.status : telem?.currentPrice?.status;
        effectiveStatus = (simulatedStatusMap[regId] || baseStatus || 'waspada') as PriceStatus;
      } else {
        effectiveStatus = getNationalStatus(p.provinceId || '', regId);
      }

      const fillColor = getColorForStatus(effectiveStatus);
      const isSelected = regId === selectedRegionId;

      return {
        ...feat,
        properties: {
          ...p,
          id: regId,
          name: p.name || p.WADMKK || 'Wilayah Pantauan',
          provinceName: p.provinceName || p.WADMPR || (isJabar ? 'Jawa Barat' : 'Nusantara'),
          isJabar,
          status: effectiveStatus,
          fillColor,
          isSelected,
        },
      };
    });

    const enrichedGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: enrichedFeatures,
    };

    // Update or add Source
    const source = map.getSource('indonesia-kabkota') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(enrichedGeoJson);
    } else {
      map.addSource('indonesia-kabkota', {
        type: 'geojson',
        data: enrichedGeoJson,
      });

      // 1. Polygon Fill Layer (Vivid Choropleth according to Food Prices)
      map.addLayer({
        id: 'indonesia-fill',
        type: 'fill',
        source: 'indonesia-kabkota',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            0.95,
            0.82,
          ],
        },
      });

      // 2. Polygon Border Outline Layer (High Contrast White Boundaries)
      map.addLayer({
        id: 'indonesia-outline',
        type: 'line',
        source: 'indonesia-kabkota',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            '#74151C', // Selected region highlighted in deep burgundy
            '#FFFFFF', // Crisp, prominent white boundary line between all kabupaten/kota
          ],
          'line-width': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            3.6,
            1.6,
          ],
          'line-opacity': 0.95,
        },
      });

      // 3. Region Label Centroid Layer
      try {
        map.addLayer({
          id: 'indonesia-labels',
          type: 'symbol',
          source: 'indonesia-kabkota',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 8.5,
              8, 10.5,
              11, 13,
            ],
            'text-anchor': 'center',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': '#1E293B',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1.8,
          },
        });
      } catch (err) {
        console.warn('Labels layer init skipped:', err);
      }

      // Hover Event Listeners
      map.on('mousemove', 'indonesia-fill', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const isJabar = Boolean(feature.properties?.isJabar);
        const regId = feature.properties?.id;

        map.getCanvas().style.cursor = 'pointer';
        const telem = allTelemetry[regId];

        setTooltipData({
          telemetry: telem || null,
          nonJabarInfo: isJabar
            ? null
            : {
                name: feature.properties?.name || 'Wilayah Indonesia',
                provinceName: feature.properties?.provinceName || 'Nusantara',
              },
          x: e.point.x,
          y: e.point.y,
          visible: true,
        });
      });

      map.on('mouseleave', 'indonesia-fill', () => {
        map.getCanvas().style.cursor = '';
        setTooltipData((prev) => ({ ...prev, visible: false }));
      });

      // Click Event to Focus Region
      map.on('click', 'indonesia-fill', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const regId = feature.properties?.id;
        if (regId) {
          onSelectRegion(regId);
        }
      });
    }
  }, [
    internalGeoJson,
    mapLoaded,
    activeHorizon,
    selectedRegionId,
    simulatedStatusMap,
    allTelemetry,
    getColorForStatus,
    getNationalStatus,
    onSelectRegion,
  ]);

  const containerClasses =
    className ||
    (mode === 'preview'
      ? 'relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-b-xl overflow-hidden bg-[#F4EFE6]'
      : 'relative w-full h-screen overflow-hidden bg-[#F4EFE6]');

  return (
    <div className={containerClasses}>
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* View Scope Controls (Clean, Unobtrusive at Top-Left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-[#DED8CD] shadow-md text-xs font-sans select-none">
        <button
          type="button"
          onClick={handleFlyToJabar}
          className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] font-bold ${
            activeViewScope === 'jabar'
              ? 'bg-[#74151C] text-white shadow-sm'
              : 'text-[#625E56] hover:bg-[#F0ECE4]'
          }`}
          title="Fokus Wilayah Jawa Barat"
        >
          <span>📍</span>
          <span>Jawa Barat</span>
        </button>

        <button
          type="button"
          onClick={handleFlyToIndonesia}
          className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] font-bold ${
            activeViewScope === 'indonesia'
              ? 'bg-[#74151C] text-white shadow-sm'
              : 'text-[#625E56] hover:bg-[#F0ECE4]'
          }`}
          title="Seluruh Nusantara (38 Provinsi)"
        >
          <span>🇮🇩</span>
          <span>Nusantara</span>
        </button>

        <button
          type="button"
          onClick={handleGeolocate}
          className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] text-[#625E56] hover:bg-[#F0ECE4] ${
            isGeolocating ? 'animate-pulse text-[#74151C]' : ''
          }`}
          title="Pusatkan Lokasi Saya"
        >
          <Navigation size={12} />
        </button>
      </div>

      {/* Scope Indicator HUD */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#DED8CD] text-[10px] text-[#706B62] pointer-events-none select-none shadow-sm">
        <Compass size={12} className="text-[#74151C]" />
        <span>
          Cakupan:{' '}
          <strong className="text-[#24231F]">
            {activeViewScope === 'indonesia'
              ? 'Seluruh Indonesia (507 Kab/Kota)'
              : 'Jawa Barat (27 Kab/Kota)'}
          </strong>
        </span>
      </div>

      {/* Interactive Hover Tooltip */}
      <MapTooltip
        telemetry={tooltipData.telemetry}
        nonJabarInfo={tooltipData.nonJabarInfo}
        x={tooltipData.x}
        y={tooltipData.y}
        visible={tooltipData.visible}
        activeHorizon={activeHorizon}
      />
    </div>
  );
};
