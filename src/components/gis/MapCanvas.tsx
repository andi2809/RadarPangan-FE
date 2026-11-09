'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { UnifiedRegionTelemetry, SupplyRoute, PriceStatus } from '../../types/domain';
import { MapTooltip, NonJabarInfo } from './MapTooltip';
import { Navigation, MapPin, RotateCcw } from 'lucide-react';

if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}

// Bounding box for 27 Kab/Kota Jawa Barat
const JABAR_BOUNDS: [[number, number], [number, number]] = [
  [106.35, -7.82], // Southwest [lng, lat]
  [108.85, -5.92], // Northeast [lng, lat]
];

interface MapCanvasProps {
  geoJson: GeoJSON.FeatureCollection | null;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  activeHorizon: 'aktual' | 'h7';
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  commodityAcuanType?: string;
  commodityAcuanRp?: number;
  activeSupplyRoutes?: SupplyRoute[]; // Kept for backwards compatibility, not rendered
  simulatedStatusMap?: Record<string, PriceStatus>;
  mode?: 'full' | 'preview';
  className?: string;
  viewScope?: 'jabar' | 'indonesia';
  onViewScopeChange?: (scope: 'jabar' | 'indonesia') => void;
  onOpenCommandCenter?: (regionId?: string) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  geoJson,
  allTelemetry,
  activeHorizon,
  selectedRegionId,
  onSelectRegion,
  commodityAcuanType = 'HAP',
  commodityAcuanRp = 45000,
  mode = 'full',
  className,
  viewScope = 'jabar',
  onViewScopeChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const allTelemetryRef = useRef(allTelemetry);
  const onSelectRegionRef = useRef(onSelectRegion);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    allTelemetryRef.current = allTelemetry;
  }, [allTelemetry]);

  useEffect(() => {
    onSelectRegionRef.current = onSelectRegion;
  }, [onSelectRegion]);

  const [activeViewScope, setActiveViewScope] = useState<'jabar' | 'indonesia' | 'user'>(viewScope);
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

  // Color mapping based on exact user specification:
  // Normal: #729B82, Warning: #D6B45F, High pressure: #B85C52, No data: #D5D5D0
  const getColorForStatus = useCallback((status?: string) => {
    switch (status) {
      case 'kritis':
        return '#B85C52';
      case 'waspada':
        return '#D6B45F';
      case 'turun':
      case 'aman':
        return '#729B82';
      case 'tidak_ada_data':
      default:
        return '#D5D5D0';
    }
  }, []);

  const getNationalStatus = useCallback((): PriceStatus => 'tidak_ada_data', []);

  // Initialize MapLibre with light neutral canvas
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (typeof maplibregl.setWorkerUrl === 'function') {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    const esriTileUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'esri-tiles': {
            type: 'raster',
            tiles: [esriTileUrl],
            tileSize: 256,
            attribution: '&copy; Esri &copy; OpenStreetMap',
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#EAE8E1', // Map background from guidelines
            },
          },
          {
            id: 'esri-base',
            type: 'raster',
            source: 'esri-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-opacity': 0.75,
            },
          },
        ],
      },
      center: [107.6191, -6.9175], // Jawa Barat default
      zoom: mode === 'preview' ? 7.6 : 8.1,
      minZoom: 3.5,
      maxZoom: 14,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'bottom-right'
    );

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);

      // Fit bounds to Jabar on initial load with proper padding
      const rightPadding = mode === 'full' ? 380 : 30;
      const bottomPadding = mode === 'full' ? 190 : 30;
      map.fitBounds(JABAR_BOUNDS, {
        padding: { top: 70, bottom: bottomPadding, left: 30, right: rightPadding },
        duration: 800,
        maxZoom: 9.0,
      });
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
    onViewScopeChange?.('indonesia');
    mapRef.current.flyTo({
      center: [118.0149, -2.5489],
      zoom: mode === 'preview' ? 4.4 : 4.8,
      pitch: 0,
      duration: 1000,
      essential: true,
    });
  }, [mode, onViewScopeChange]);

  // View switch: Fly to Jawa Barat (Fit Bounds)
  const handleFlyToJabar = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('jabar');
    onViewScopeChange?.('jabar');
    const rightPadding = mode === 'full' ? 380 : 30;
    const bottomPadding = mode === 'full' ? 190 : 30;
    mapRef.current.fitBounds(JABAR_BOUNDS, {
      padding: { top: 70, bottom: bottomPadding, left: 30, right: rightPadding },
      duration: 800,
      maxZoom: 9.0,
    });
  }, [mode, onViewScopeChange]);

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
            duration: 1000,
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

  // Sinkronkan pilihan scope dari prop
  useEffect(() => {
    if (viewScope === 'indonesia') handleFlyToIndonesia();
    else handleFlyToJabar();
  }, [viewScope, handleFlyToIndonesia, handleFlyToJabar]);

  // Center camera when selectedRegionId changes
  useEffect(() => {
    if (!mapRef.current || !selectedRegionId || !internalGeoJson) return;
    const targetFeature = internalGeoJson.features.find((f) => f.properties?.id === selectedRegionId);
    const centroid = targetFeature?.properties?.centroid;
    if (centroid && typeof centroid.lng === 'number' && typeof centroid.lat === 'number') {
      mapRef.current.flyTo({
        center: [centroid.lng, centroid.lat],
        zoom: mode === 'preview' ? 8.4 : 9.0,
        duration: 600,
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
        effectiveStatus = (baseStatus || 'tidak_ada_data') as PriceStatus;
      } else {
        effectiveStatus = getNationalStatus();
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

    const source = map.getSource('indonesia-kabkota') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(enrichedGeoJson);
    } else {
      map.addSource('indonesia-kabkota', {
        type: 'geojson',
        data: enrichedGeoJson,
      });

      // 1. Polygon Fill Layer
      map.addLayer({
        id: 'indonesia-fill',
        type: 'fill',
        source: 'indonesia-kabkota',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            0.92,
            0.82,
          ],
        },
      });

      // 2. Polygon Border Outline Layer
      // Selected region: Burgundy #791D2A (3.4px)
      // Unselected regions: Crisp white (#FFFFFF, 1.2px)
      map.addLayer({
        id: 'indonesia-outline',
        type: 'line',
        source: 'indonesia-kabkota',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            '#791D2A', // Burgundy accent
            '#FFFFFF', // Clean boundary
          ],
          'line-width': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            3.4,
            1.2,
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
              6, 9,
              8, 11,
              11, 13,
            ],
            'text-anchor': 'center',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': '#292824',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2,
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
        const telem = allTelemetryRef.current[regId];

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
          onSelectRegionRef.current(regId);
        }
      });
    }
  }, [
    internalGeoJson,
    mapLoaded,
    activeHorizon,
    selectedRegionId,
    allTelemetry,
    getColorForStatus,
    getNationalStatus,
    onSelectRegion,
  ]);

  const containerClasses =
    className ||
    (mode === 'preview'
      ? 'relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-b-xl overflow-hidden bg-[#EAE8E1]'
      : 'relative w-full h-screen overflow-hidden bg-[#EAE8E1]');

  return (
    <div className={containerClasses}>
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Scope Controls (Top-Left) */}
      <div className="absolute top-20 left-4 z-20 flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-[#E5E2DA] shadow-sm text-xs font-sans select-none">
        <button
          type="button"
          onClick={handleFlyToJabar}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
            activeViewScope === 'jabar'
              ? 'bg-[#791D2A] text-white'
              : 'text-[#292824] hover:bg-[#F5F3ED]'
          }`}
          title="Fokus 27 Kab/Kota Jawa Barat"
        >
          <MapPin size={13} />
          <span>Jawa Barat</span>
        </button>

        <button
          type="button"
          onClick={handleFlyToIndonesia}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
            activeViewScope === 'indonesia'
              ? 'bg-[#791D2A] text-white'
              : 'text-[#292824] hover:bg-[#F5F3ED]'
          }`}
          title="Lihat Peta Nasional"
        >
          <Navigation size={13} />
          <span>Nusantara</span>
        </button>

        <button
          type="button"
          onClick={handleGeolocate}
          className={`p-1.5 rounded-lg transition-colors text-[#77746C] hover:bg-[#F5F3ED] hover:text-[#292824] ${
            isGeolocating ? 'animate-pulse text-[#791D2A]' : ''
          }`}
          title="Lokasi Saat Ini"
        >
          <Navigation size={13} />
        </button>

        <button
          type="button"
          onClick={handleFlyToJabar}
          className="p-1.5 rounded-lg transition-colors text-[#77746C] hover:bg-[#F5F3ED] hover:text-[#292824]"
          title="Reset View Jawa Barat"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Simplified Editorial Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 border border-[#E5E2DA] rounded-xl p-3 shadow-md text-xs select-none max-w-xs">
        <div className="text-[11px] font-bold text-[#292824] mb-2 uppercase tracking-wide">
          Status Deviasi Acuan ({commodityAcuanType})
        </div>
        <div className="space-y-1.5 text-[11px] text-[#292824]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#729B82]" />
              <span>Normal</span>
            </div>
            <span className="text-[#77746C] font-mono text-[10px]">&le; +5%</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#D6B45F]" />
              <span>Perlu Perhatian</span>
            </div>
            <span className="text-[#77746C] font-mono text-[10px]">+5% s/d +10%</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#B85C52]" />
              <span>Tekanan Tinggi</span>
            </div>
            <span className="text-[#77746C] font-mono text-[10px]">&gt; +10%</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#D5D5D0]" />
              <span>Tidak Ada Data</span>
            </div>
            <span className="text-[#77746C] font-mono text-[10px]">—</span>
          </div>
        </div>
      </div>

      {/* Map Tooltip */}
      <MapTooltip
        telemetry={tooltipData.telemetry}
        nonJabarInfo={tooltipData.nonJabarInfo}
        x={tooltipData.x}
        y={tooltipData.y}
        visible={tooltipData.visible}
        activeHorizon={activeHorizon}
        commodityAcuanType={commodityAcuanType}
        commodityAcuanRp={commodityAcuanRp}
      />
    </div>
  );
};
