'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { UnifiedRegionTelemetry, SupplyRoute, Region, PriceStatus } from '../../types/domain';
import { MapTooltip } from './MapTooltip';
import { MapLegend } from './MapLegend';

interface MapCanvasProps {
  geoJson: GeoJSON.FeatureCollection | null;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  activeHorizon: 'aktual' | 'h7';
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  activeSupplyRoutes?: SupplyRoute[];
  simulatedStatusMap?: Record<string, PriceStatus>;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  geoJson,
  allTelemetry,
  activeHorizon,
  selectedRegionId,
  onSelectRegion,
  activeSupplyRoutes = [],
  simulatedStatusMap = {}
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<{
    telemetry: UnifiedRegionTelemetry | null;
    x: number;
    y: number;
    visible: boolean;
  }>({
    telemetry: null,
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

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Basemap: Dark aesthetic theme matching #0F172A
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; CartoDB &copy; OpenStreetMap'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [107.6191, -6.9175], // Centered on Jawa Barat (Bandung)
      zoom: 8.2,
      minZoom: 7,
      maxZoom: 14,
      pitch: 25, // Subtle 2.5D perspective
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
  }, []);

  // Update GeoJSON and Choropleth Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !geoJson) return;

    // Enrich GeoJSON properties with latest telemetry status and colors
    const enrichedFeatures = geoJson.features.map((feat) => {
      const regId = (feat.properties?.id || feat.id) as string;
      const telem = allTelemetry[regId];
      const isH7 = activeHorizon === 'h7';

      const baseStatus = isH7 ? telem?.predictionH7?.status : telem?.currentPrice?.status;
      const effectiveStatus = simulatedStatusMap[regId] || baseStatus || 'tidak_ada_data';
      const fillColor = getColorForStatus(effectiveStatus);

      return {
        ...feat,
        properties: {
          ...feat.properties,
          status: effectiveStatus,
          fillColor: fillColor,
          isSelected: regId === selectedRegionId
        }
      };
    });

    const enrichedGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: enrichedFeatures
    };

    // Update or add Source
    if (map.getSource('jabar-kabkota')) {
      (map.getSource('jabar-kabkota') as maplibregl.GeoJSONSource).setData(enrichedGeoJson);
    } else {
      map.addSource('jabar-kabkota', {
        type: 'geojson',
        data: enrichedGeoJson
      });

      // Polygon Fill Layer
      map.addLayer({
        id: 'jabar-fill',
        type: 'fill',
        source: 'jabar-kabkota',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            0.85,
            0.65
          ]
        }
      });

      // Polygon Border Outline Layer
      map.addLayer({
        id: 'jabar-outline',
        type: 'line',
        source: 'jabar-kabkota',
        paint: {
          'line-color': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            '#38BDF8', // Highlight Cyan when selected
            '#1E293B'  // Deep Slate border
          ],
          'line-width': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            2.5,
            1.2
          ]
        }
      });

      // Region Label Centroid Layer
      map.addLayer({
        id: 'jabar-labels',
        type: 'symbol',
        source: 'jabar-kabkota',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 11,
          'text-anchor': 'center',
          'text-allow-overlap': false
        },
        paint: {
          'text-color': '#F8FAFC',
          'text-halo-color': '#0F172A',
          'text-halo-width': 1.5
        }
      });

      // Hover Event Listeners
      map.on('mousemove', 'jabar-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';

        const feature = e.features[0];
        const regId = feature.properties?.id;
        const telem = allTelemetry[regId];

        setTooltipData({
          telemetry: telem || null,
          x: e.point.x,
          y: e.point.y,
          visible: true
        });
      });

      map.on('mouseleave', 'jabar-fill', () => {
        map.getCanvas().style.cursor = '';
        setTooltipData((prev) => ({ ...prev, visible: false }));
      });

      // Click Event to Focus Region
      map.on('click', 'jabar-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const regId = feature.properties?.id;
        if (regId) {
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />
      <MapLegend activeHorizon={activeHorizon} />
      <MapTooltip
        telemetry={tooltipData.telemetry}
        x={tooltipData.x}
        y={tooltipData.y}
        visible={tooltipData.visible}
        activeHorizon={activeHorizon}
      />
    </div>
  );
};
