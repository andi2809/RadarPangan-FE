'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { GISPageHeader } from '@/components/gis/overview/GISPageHeader';
import { GISStatsSection } from '@/components/gis/overview/GISStatCard';
import { GISMapWorkspace } from '@/components/gis/map/GISMapWorkspace';
import { GISMapCanvas } from '@/components/gis/map/GISMapCanvas';
import { RegionInsightPanel } from '@/components/gis/analysis/RegionInsightPanel';
import { RegionDetailSection } from '@/components/gis/detail/RegionDetailSection';
import { PriceForecastChart } from '@/components/gis/analysis/PriceForecastChart';
import { CommodityPriceTable } from '@/components/gis/detail/CommodityPriceTable';
import { AffordabilityIndicator } from '@/components/gis/detail/AffordabilityIndicator';
import {
  loadIndonesiaGeoJson,
  getTelemetry,
  getAllRegions,
  getAllCommodities,
} from '@/utils/geo-loader';
import { UnifiedRegionTelemetry, Commodity } from '@/types/domain';

export default function GISDashboardPage() {
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions(), []);

  const [commodity, setCommodity] = useState<string>('cabai_rawit_merah');
  const [period, setPeriod] = useState<'today' | 'forecast'>('today');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Default: Kab. Bekasi
  const [viewScope, setViewScope] = useState<'jabar' | 'indonesia'>('jabar');
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON on mount
  useEffect(() => {
    loadIndonesiaGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON in GIS page:', err));
  }, []);

  // Telemetry Mapping
  const rawTelemetry = useMemo(
    () => getTelemetry(commodity) as Record<string, UnifiedRegionTelemetry>,
    [commodity]
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

  const activeRegionTelemetry = allTelemetry[selectedRegionId];
  const activeRegionName =
    activeRegionTelemetry?.region?.name ||
    (selectedRegionId === '32.16' ? 'Kab. Bekasi' : 'Wilayah Pantauan');

  const currentPriceRp = activeRegionTelemetry?.currentPrice?.hargaAktualRp || 48200;
  const forecastPriceRp = activeRegionTelemetry?.predictionH7?.hargaPrediksiH7Rp || 50400;
  const changePercent =
    activeRegionTelemetry?.predictionH7?.selisihPersen ??
    activeRegionTelemetry?.currentPrice?.selisihPersen ??
    8.7;

  const rawStatus =
    period === 'today'
      ? activeRegionTelemetry?.currentPrice?.status
      : activeRegionTelemetry?.predictionH7?.status;

  const activeStatus: 'terkendali' | 'waspada' | 'kritis' =
    rawStatus === 'kritis'
      ? 'kritis'
      : rawStatus === 'waspada'
      ? 'waspada'
      : 'terkendali';

  const riskStatusLabel: 'KRITIS' | 'WASPADA' | 'TERKENDALI' =
    activeStatus === 'kritis' ? 'KRITIS' : activeStatus === 'waspada' ? 'WASPADA' : 'TERKENDALI';

  const selectedCommodityObj = useMemo(
    () => commodities.find((c) => c.id === commodity) || commodities[1] || commodities[0],
    [commodities, commodity]
  );

  const handleSelectRegion = useCallback((regionId: string) => {
    setSelectedRegionId(regionId);
  }, []);

  return (
    <GISLayout>
      {/* 1. Page Header */}
      <GISPageHeader />

      {/* 2. Top Metric Statistics */}
      <GISStatsSection />

      {/* 3. Main GIS Map & Region Insight Workspace */}
      <GISMapWorkspace
        commodity={commodity}
        setCommodity={setCommodity}
        period={period}
        setPeriod={setPeriod}
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        viewScope={viewScope}
        onSelectViewScope={setViewScope}
        showGisLink={false}
        activeRegionName={activeRegionName}
        activeStatus={activeStatus}
        currentPriceRp={currentPriceRp}
        forecastPriceRp={forecastPriceRp}
        umkBurdenPercent={activeRegionTelemetry?.affordability?.umkRatioBasketPercent || 9.2}
        map={
          <GISMapCanvas
            geoJson={geoJson}
            allTelemetry={allTelemetry}
            activeHorizon={period === 'today' ? 'aktual' : 'h7'}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            mode="full"
          />
        }
        insight={
          <RegionInsightPanel
            region={activeRegionName}
            commodity={selectedCommodityObj?.name || 'Cabai Rawit Merah'}
            currentPrice={currentPriceRp}
            forecastPrice={forecastPriceRp}
            changePercent={changePercent}
            risk={riskStatusLabel}
          />
        }
      />

      {/* 4. Deep-dive Region Detail Section */}
      <RegionDetailSection
        title={`Detail Wilayah & Analisis Keterjangkauan (${activeRegionName})`}
        description="Eksplorasi spasial lengkap, histori pergerakan disparitas harga pasar, dan proyeksi risiko inflasi pangan daerah."
      >
        <PriceForecastChart />
        <CommodityPriceTable />
        <AffordabilityIndicator
          regionName={activeRegionName}
          controlledPercentage={68.4}
        />
      </RegionDetailSection>
    </GISLayout>
  );
}
