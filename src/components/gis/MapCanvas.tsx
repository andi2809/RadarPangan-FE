'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import * as maplibregl from 'maplibre-gl';
import { UnifiedRegionTelemetry, SupplyRoute, PriceStatus } from '../../types/domain';
import { MapTooltip, NonJabarInfo } from './MapTooltip';
import { Compass, Navigation, MapPin, Truck } from 'lucide-react';

if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
}

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
  activeSupplyRoutes = [],
  simulatedStatusMap = {},
  mode = 'full',
  className,
  viewScope = 'jabar',
  onViewScopeChange,
  onOpenCommandCenter,
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

  // Color mapping based on EWS status (warna kanonik DESIGN_GUIDELINES)
  const getColorForStatus = useCallback((status?: string) => {
    switch (status) {
      case 'kritis':
        return '#E85B4F';
      case 'waspada':
        return '#F0C94D';
      case 'turun':
        return '#0369A1';
      case 'aman':
        return '#4B9D73';
      case 'tidak_ada_data':
      default:
        return '#CBD5E1';
    }
  }, []);

  // Wilayah di luar cakupan data demo tidak boleh diberi status tebakan.
  const getNationalStatus = useCallback((): PriceStatus => 'tidak_ada_data', []);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (typeof maplibregl.setWorkerUrl === 'function') {
      maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    }

    const esriTileUrl =
      mode === 'full'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

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
              'background-color': mode === 'full' ? '#0F172A' : '#F4EFE6', // Clean background
            },
          },
          {
            id: 'esri-base',
            type: 'raster',
            source: 'esri-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-opacity': mode === 'full' ? 0.9 : 0.65,
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
    onViewScopeChange?.('indonesia');
    mapRef.current.flyTo({
      center: [118.0149, -2.5489],
      zoom: mode === 'preview' ? 4.4 : 4.8,
      pitch: 0,
      duration: 1200,
      essential: true,
    });
  }, [mode, onViewScopeChange]);

  // View switch: Fly to Jawa Barat
  const handleFlyToJabar = useCallback(() => {
    if (!mapRef.current) return;
    setActiveViewScope('jabar');
    onViewScopeChange?.('jabar');
    mapRef.current.flyTo({
      center: [107.6191, -6.9175],
      zoom: mode === 'preview' ? 7.8 : 8.2,
      pitch: 0,
      duration: 1000,
      essential: true,
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

  // Sinkronkan pilihan scope dari toolbar dengan kamera peta
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
        effectiveStatus = (simulatedStatusMap[regId] || baseStatus || 'tidak_ada_data') as PriceStatus;
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
            '#67151D', // Selected region highlighted in deep burgundy
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
    simulatedStatusMap,
    allTelemetry,
    getColorForStatus,
    getNationalStatus,
    onSelectRegion,
  ]);

  // Render Supply Matchmaker Distribution Routes (Surplus -> Defisit)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const lineFeatures: GeoJSON.Feature[] = activeSupplyRoutes.map((route, idx) => ({
      type: 'Feature',
      properties: {
        id: route.id,
        rank: idx + 1,
        sourceName: route.sourceRegionName,
        targetName: route.targetRegionName,
        jarakKm: route.jarakKm,
        isPrimary: idx === 0,
      },
      geometry: {
        type: 'LineString',
        coordinates: route.coordinates,
      },
    }));

    const pointFeatures: GeoJSON.Feature[] = [];
    activeSupplyRoutes.forEach((route, idx) => {
      if (route.coordinates.length >= 2) {
        const start = route.coordinates[0];
        const end = route.coordinates[route.coordinates.length - 1];
        pointFeatures.push({
          type: 'Feature',
          properties: {
            role: 'origin',
            label: `Pemasok: ${route.sourceRegionName}`,
            isPrimary: idx === 0,
          },
          geometry: { type: 'Point', coordinates: start },
        });
        if (idx === 0) {
          pointFeatures.push({
            type: 'Feature',
            properties: {
              role: 'destination',
              label: `Tujuan: ${route.targetRegionName}`,
              isPrimary: true,
            },
            geometry: { type: 'Point', coordinates: end },
          });
        }
      }
    });

    const routeGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: lineFeatures,
    };

    const pointGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: pointFeatures,
    };

    const routeSource = map.getSource('supply-routes-source') as maplibregl.GeoJSONSource | undefined;
    if (routeSource) {
      routeSource.setData(routeGeoJson);
    } else {
      map.addSource('supply-routes-source', {
        type: 'geojson',
        data: routeGeoJson,
      });

      map.addLayer({
        id: 'supply-routes-casing',
        type: 'line',
        source: 'supply-routes-source',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#FFFDF7',
          'line-width': ['case', ['boolean', ['get', 'isPrimary'], false], 6, 4],
          'line-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'supply-routes-line',
        type: 'line',
        source: 'supply-routes-source',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['case', ['boolean', ['get', 'isPrimary'], false], '#67151D', '#287653'],
          'line-width': ['case', ['boolean', ['get', 'isPrimary'], false], 3.2, 2.2],
          'line-dasharray': [2, 1.5],
          'line-opacity': 0.95,
        },
      });
    }

    const pointSource = map.getSource('supply-points-source') as maplibregl.GeoJSONSource | undefined;
    if (pointSource) {
      pointSource.setData(pointGeoJson);
    } else {
      map.addSource('supply-points-source', {
        type: 'geojson',
        data: pointGeoJson,
      });

      map.addLayer({
        id: 'supply-points-circle',
        type: 'circle',
        source: 'supply-points-source',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'role'], 'destination'], 7, 6],
          'circle-color': [
            'case',
            ['==', ['get', 'role'], 'destination'],
            '#E85B4F',
            '#287653',
          ],
          'circle-stroke-color': '#FFFDF7',
          'circle-stroke-width': 2,
        },
      });
    }
  }, [activeSupplyRoutes, mapLoaded]);

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
              ? 'bg-[#67151D] text-white shadow-sm'
              : 'text-[#625E56] hover:bg-[#F0ECE4]'
          }`}
          title="Fokus Wilayah Jawa Barat"
        >
          <MapPin size={12} />
          <span>Jawa Barat</span>
        </button>

        <button
          type="button"
          onClick={handleFlyToIndonesia}
          className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] font-bold ${
            activeViewScope === 'indonesia'
              ? 'bg-[#67151D] text-white shadow-sm'
              : 'text-[#625E56] hover:bg-[#F0ECE4]'
          }`}
          title="Seluruh Nusantara (38 Provinsi)"
        >
          <Navigation size={12} />
          <span>Nusantara</span>
        </button>

        <button
          type="button"
          onClick={handleGeolocate}
          className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 text-[11px] text-[#625E56] hover:bg-[#F0ECE4] ${
            isGeolocating ? 'animate-pulse text-[#67151D]' : ''
          }`}
          title="Pusatkan Lokasi Saya"
        >
          <Navigation size={12} />
        </button>
      </div>

      {/* Top-Right: Active Supply Route HUD Badge */}
      {activeSupplyRoutes.length > 0 && (
        <div className="absolute top-3 right-3 z-20 max-w-xs rounded-lg border border-[#DED8CD] bg-[#FFFDF7]/95 px-3 py-2 text-[11px] text-[#24231F] shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-bold text-[#67151D]">
            <Truck size={13} className="text-[#287653]" />
            <span>Rute Rekomendasi Pasokan</span>
          </div>
          <p className="mt-0.5 font-mono text-[10px] text-[#706B62]">
            {activeSupplyRoutes[0].sourceRegionName} → {activeSupplyRoutes[0].targetRegionName} (
            {activeSupplyRoutes[0].jarakKm} km · ~{activeSupplyRoutes[0].estimasiWaktuJam} jam)
          </p>
        </div>
      )}

      {/* Scope Indicator HUD */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#DED8CD] text-[10px] text-[#706B62] pointer-events-none select-none shadow-sm">
        <Compass size={12} className="text-[#67151D]" />
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
