'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GisCommandCenter } from '@/components/dashboard/hud/GisCommandCenter';
import {
  loadIndonesiaGeoJson,
  getTelemetry,
  getAllRegions,
  getAllCommodities,
} from '@/utils/geo-loader';
import { UnifiedRegionTelemetry, Commodity } from '@/types/domain';

export default function FullGISCommandCenterPage() {
  const router = useRouter();
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions(), []);

  // Filter & State
  const [commodityId, setCommodityId] = useState<string>('cabai_rawit_merah');
  const [activeHorizon, setActiveHorizon] = useState<'aktual' | 'h7'>('aktual');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Default: Kab. Bekasi
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON on mount
  useEffect(() => {
    loadIndonesiaGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON in GIS Command Center:', err));
  }, []);

  // Selected Commodity Object
  const selectedCommodity = useMemo(
    () => commodities.find((c) => c.id === commodityId) || commodities[0],
    [commodities, commodityId]
  );

  // Telemetry Mapping
  const rawTelemetry = useMemo(
    () => getTelemetry(commodityId) as Record<string, UnifiedRegionTelemetry>,
    [commodityId]
  );

  const allTelemetry = useMemo(() => {
    const result: Record<string, UnifiedRegionTelemetry> = {};
    allRegions.forEach((reg) => {
      const telem = rawTelemetry[reg.id];
      if (telem) {
        result[reg.id] = {
          ...telem,
          region: reg,
        };
      }
    });
    return result;
  }, [allRegions, rawTelemetry]);

  const handleBackToOverview = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#F5F3ED]">
      <GisCommandCenter
        geoJson={geoJson}
        allTelemetry={allTelemetry}
        commodities={commodities}
        selectedCommodity={selectedCommodity}
        onSelectCommodity={setCommodityId}
        activeHorizon={activeHorizon}
        onChangeHorizon={setActiveHorizon}
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
        onBackToOverview={handleBackToOverview}
      />
    </main>
  );
}
