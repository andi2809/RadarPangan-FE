'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { UnifiedRegionTelemetry, SupplyRoute, Region, PriceStatus } from '../../types/domain';
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
  onOpenCommandCenter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeViewScope, setActiveViewScope] = useState<'jabar' | 'indonesia' | 'user'>('jabar');
  const [isGeolocating, setIsGeolocating] = useState(false);

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
    visible: false
  });

  // Color mapping based on status
  const getColorForStatus = useCallback((status?: string) => {
    switch (status) {
      case 'kritis':
        return '#DC2626'; // Crimson
      case 'waspada':
        return '#CA8A04'; // Amber
      case 'turun':
        return '#0369A1'; // Sky
      case 'aman':
        return '#16A34A'; // Emerald
      default:
        return '#475569'; // Neutral Slate
    }
  }, []);

  // Initialize MapLibre with ESRI World Dark Gray Canvas (No API Key Required, Clean Dark Aesthetic)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'esri-dark': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '&copy; Esri &copy; OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#0F172A' // Deep slate fallback
            }
          },
          {
            id: 'esri-tiles',
            type: 'raster',
            source: 'esri-dark',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [107.6191, -6.9175], // Centered on Jawa Barat (Bandung)
      zoom: mode === 'preview' ? 7.4 : 7.8,
      minZoom: 3.5, // Free zoom out across all 38 Indonesian provinces
      maxZoom: 14,
      pitch: mode === 'preview' ? 10 : 20,
      bearing: 0,
      attributionControl: false
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

  // View switch: Fly to Whole Indonesia
  const handleFlyToIndonesia = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('indonesia');
    mapRef.current.flyTo({
      center: [118.0149, -2.5489],
      zoom: mode === 'preview' ? 4.2 : 4.6,
      pitch: 0,
      duration: 1400,
      essential: true
    });
  }, [mode]);

  // View switch: Fly to West Java
  const handleFlyToJabar = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('jabar');
    mapRef.current.flyTo({
      center: [107.6191, -6.9175],
      zoom: mode === 'preview' ? 7.5 : 8.0,
      pitch: mode === 'preview' ? 10 : 20,
      duration: 1200,
      essential: true
    });
  }, [mode]);

  // View switch: Geolocate User Location or Fallback to Indonesia
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
        // Check if inside Indonesia bounds (lng 95..141, lat -11..6)
        if (longitude >= 95 && longitude <= 141 && latitude >= -11 && latitude <= 6) {
          setActiveViewScope('user');
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 8.5,
            duration: 1400,
            essential: true
          });
        } else {
          // Outside Indonesia or overseas IP, fallback to Indonesia
          handleFlyToIndonesia();
        }
      },
      (err) => {
        setIsGeolocating(false);
        console.warn('Geolocation denied or timeout, centering Indonesia:', err);
        handleFlyToIndonesia();
      },
      { timeout: 6000 }
    );
  }, [handleFlyToIndonesia]);

  // Center camera when selectedRegionId changes
  useEffect(() => {
    if (!mapRef.current || !selectedRegionId || !geoJson) return;
    const targetFeature = geoJson.features.find((f) => f.properties?.id === selectedRegionId);
    const centroid = targetFeature?.properties?.centroid;
    if (centroid && typeof centroid.lng === 'number' && typeof centroid.lat === 'number') {
      mapRef.current.flyTo({
        center: [centroid.lng, centroid.lat],
        zoom: mode === 'preview' ? 8.2 : 8.8,
        duration: 900,
        essential: true
      });
    }
  }, [selectedRegionId, geoJson, mode]);

  // Update GeoJSON and Choropleth Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !geoJson) return;

    // Filter valid polygon features and enrich with telemetry status
    const validFeatures = geoJson.features.filter(
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

      if (isJabar) {
        const telem = allTelemetry[regId];
        const isH7 = activeHorizon === 'h7';

        const baseStatus = isH7 ? telem?.predictionH7?.status : telem?.currentPrice?.status;
        const effectiveStatus = simulatedStatusMap[regId] || baseStatus || 'tidak_ada_data';
        const fillColor = getColorForStatus(effectiveStatus);

        return {
          ...feat,
          properties: {
            ...p,
            id: regId,
            name: p.name || p.WADMKK || 'Kabupaten/Kota Jabar',
            provinceName: 'Jawa Barat',
            isJabar: true,
            status: effectiveStatus,
            fillColor: fillColor,
            isSelected: regId === selectedRegionId
          }
        };
      } else {
        // Outside Jawa Barat (Neutral Gray)
        return {
          ...feat,
          properties: {
            ...p,
            id: regId,
            name: p.name || p.WADMKK || 'Wilayah Indonesia',
            provinceName: p.provinceName || p.WADMPR || 'Luar Jawa Barat',
            isJabar: false,
            status: 'tidak_ada_data',
            fillColor: '#334155', // Slate-700 Neutral Gray
            isSelected: false
          }
        };
      }
    });

    const enrichedGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: enrichedFeatures
    };

    // Update or add Source
    const source = map.getSource('indonesia-kabkota') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(enrichedGeoJson);
    } else {
      map.addSource('indonesia-kabkota', {
        type: 'geojson',
        data: enrichedGeoJson
      });

      // 1. Polygon Fill Layer (Indonesia with Jawa Barat highlighted)
      map.addLayer({
        id: 'indonesia-fill',
        type: 'fill',
        source: 'indonesia-kabkota',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isJabar'], false],
            [
              'case',
              ['boolean', ['get', 'isSelected'], false],
              0.95,
              0.82
            ],
            0.55 // Neutral muted gray for outside Jabar
          ]
        }
      });

      // 2. Polygon Border Outline Layer (Garis Wilayah Indonesia)
      map.addLayer({
        id: 'indonesia-outline',
        type: 'line',
        source: 'indonesia-kabkota',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            '#38BDF8', // Highlight Cyan when selected
            [
              'case',
              ['boolean', ['get', 'isJabar'], false],
              '#0F172A', // Dark Slate boundary between Jabar regencies
              '#64748B'  // Clean gray boundary line for Indonesian regencies outside Jabar
            ]
          ],
          'line-width': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            3.2,
            [
              'case',
              ['boolean', ['get', 'isJabar'], false],
              1.6,
              0.8
            ]
          ],
          'line-opacity': [
            'case',
            ['boolean', ['get', 'isJabar'], false],
            1.0,
            0.7
          ]
        }
      });

      // 3. Region Label Centroid Layer (Prioritize Jawa Barat)
      try {
        map.addLayer({
          id: 'indonesia-labels',
          type: 'symbol',
          source: 'indonesia-kabkota',
          layout: {
            'text-field': [
              'case',
              ['boolean', ['get', 'isJabar'], false],
              ['get', 'name'],
              ''
            ],
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 9,
              8, 11,
              11, 13
            ],
            'text-anchor': 'center',
            'text-allow-overlap': false
          },
          paint: {
            'text-color': '#F8FAFC',
            'text-halo-color': '#0F172A',
            'text-halo-width': 1.6
          }
        });
      } catch (err) {
        console.warn('Labels layer skipped:', err);
      }

      // Hover Event Listeners
      map.on('mousemove', 'indonesia-fill', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const isJabar = Boolean(feature.properties?.isJabar);
        const regId = feature.properties?.id;

        if (isJabar) {
          map.getCanvas().style.cursor = 'pointer';
          const telem = allTelemetry[regId];

          setTooltipData({
            telemetry: telem || null,
            nonJabarInfo: null,
            x: e.point.x,
            y: e.point.y,
            visible: true
          });
        } else {
          // Hover on region outside Jawa Barat
          map.getCanvas().style.cursor = 'default';
          setTooltipData({
            telemetry: null,
            nonJabarInfo: {
              name: feature.properties?.name || 'Wilayah Indonesia',
              provinceName: feature.properties?.provinceName || 'Luar Jawa Barat'
            },
            x: e.point.x,
            y: e.point.y,
            visible: true
          });
        }
      });

      map.on('mouseleave', 'indonesia-fill', () => {
        map.getCanvas().style.cursor = '';
        setTooltipData((prev) => ({ ...prev, visible: false }));
      });

      // Click Event to Focus Region
      map.on('click', 'indonesia-fill', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const isJabar = Boolean(feature.properties?.isJabar);
        const regId = feature.properties?.id;

        if (isJabar && regId) {
          onSelectRegion(regId);
        }
      });
    }
  }, [
    geoJson,
    allTelemetry,
    activeHorizon,
    selectedRegionId,
    mapLoaded,
    getColorForStatus,
    simulatedStatusMap,
    onSelectRegion
  ]);

  // Update Supply Route Corridors Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Convert routes to GeoJSON LineStrings
    const routeFeatures: GeoJSON.Feature[] = activeSupplyRoutes.map((route) => ({
      type: 'Feature',
      id: route.id,
      properties: {
        id: route.id,
        source: route.sourceRegionName,
        target: route.targetRegionName,
        jarakKm: route.jarakKm,
        surplusTon: route.surplusAvailableTon
      },
      geometry: {
        type: 'LineString',
        coordinates: route.coordinates
      }
    }));

    const routeGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: routeFeatures
    };

    if (map.getSource('supply-routes')) {
      (map.getSource('supply-routes') as maplibregl.GeoJSONSource).setData(routeGeoJson);
    } else {
      map.addSource('supply-routes', {
        type: 'geojson',
        data: routeGeoJson
      });

      // Glow backing
      map.addLayer({
        id: 'supply-routes-glow',
        type: 'line',
        source: 'supply-routes',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#0284C7',
          'line-width': 6,
          'line-opacity': 0.4,
          'line-blur': 3
        }
      });

      // Animated / Dashed main route line
      map.addLayer({
        id: 'supply-routes-line',
        type: 'line',
        source: 'supply-routes',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#38BDF8',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });
    }
  }, [activeSupplyRoutes, mapLoaded]);

  const containerClasses =
    className ||
    (mode === 'preview'
      ? 'relative w-full h-[360px] md:h-[400px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800'
      : 'relative w-full h-screen overflow-hidden bg-slate-950');

  return (
    <div className={containerClasses}>
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Prominent View & Location Controls */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-xl text-xs font-mono select-none">
        {/* Button 1: Seluruh Indonesia */}
        <button
          type="button"
          onClick={handleFlyToIndonesia}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium ${
            activeViewScope === 'indonesia'
              ? 'bg-sky-600 text-white shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tampilkan Seluruh Peta Wilayah Indonesia (Nusantara)"
        >
          <span>🇮🇩</span>
          <span>Seluruh Indonesia</span>
        </button>

        {/* Button 2: Fokus Jawa Barat */}
        <button
          type="button"
          onClick={handleFlyToJabar}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium ${
            activeViewScope === 'jabar'
              ? 'bg-sky-600 text-white shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Fokus ke 27 Kab/Kota Jawa Barat"
        >
          <span>📍</span>
          <span>Fokus Jawa Barat</span>
        </button>

        {/* Button 3: Lokasi Saat Ini (GPS / Indonesia) */}
        <button
          type="button"
          onClick={handleGeolocate}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 ${
            activeViewScope === 'user' ? 'bg-sky-600 text-white font-bold' : ''
          } ${isGeolocating ? 'animate-pulse text-sky-400' : ''}`}
          title="Kembali ke Lokasi Saat Ini (GPS / Indonesia)"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>
      </div>

      {/* In Preview Mode: Quick Link to Full GIS Command Center */}
      {mode === 'preview' && onOpenCommandCenter && (
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={() => onOpenCommandCenter(selectedRegionId || undefined)}
            className="px-3 py-1.5 rounded-lg bg-sky-600/90 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-sky-400/40"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Konsol Penuh</span>
          </button>
        </div>
      )}

      {/* Scope Indicator HUD */}
      <div className="absolute bottom-3 right-14 z-20 hidden md:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-[10px] font-mono text-slate-300 pointer-events-none select-none">
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span>
          Cakupan:{' '}
          <strong className="text-white">
            {activeViewScope === 'indonesia'
              ? 'Seluruh Indonesia (507 Kab/Kota)'
              : activeViewScope === 'user'
              ? 'Lokasi Terdeteksi'
              : 'Jawa Barat (27 Kab/Kota)'}
          </strong>
        </span>
      </div>

      {/* Legend */}
      <MapLegend activeHorizon={activeHorizon} />

      {/* Tooltip */}
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
