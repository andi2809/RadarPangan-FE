'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  loadJabarGeoJson,
  getTelemetry,
  getAllRegions,
} from '@/utils/geo-loader';
import { UnifiedRegionTelemetry } from '@/types/domain';

export default function GISDashboardPage() {
  const [commodity, setCommodity] = useState<string>('cabai_rawit_merah');
  const [period, setPeriod] = useState<'today' | 'forecast'>('today');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Default: Kab. Bekasi
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON on mount
  useEffect(() => {
    loadJabarGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON in GIS page:', err));
  }, []);

  // Telemetry Mapping
  const allRegions = useMemo(() => getAllRegions(), []);
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
  const activeRegionName = activeRegionTelemetry?.region?.name || 'Kab. Bekasi';

  const currentPriceRp = activeRegionTelemetry?.currentPrice?.hargaAktualRp || 78200;
  const forecastPriceRp = activeRegionTelemetry?.predictionH7?.hargaPrediksiH7Rp || 88600;
  const changePercent = activeRegionTelemetry?.predictionH7?.selisihPersen 
    ?? activeRegionTelemetry?.currentPrice?.selisihPersen 
    ?? 8.7;

  const rawStatus = period === 'today' 
    ? activeRegionTelemetry?.currentPrice?.status 
    : activeRegionTelemetry?.predictionH7?.status;

  const riskStatus: 'TERKENDALI' | 'WASPADA' | 'KRITIS' = 
    rawStatus === 'kritis' 
      ? 'KRITIS' 
      : rawStatus === 'waspada' 
      ? 'WASPADA' 
      : 'TERKENDALI';

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
        map={
          <GISMapCanvas
            geoJson={geoJson}
            allTelemetry={allTelemetry}
            activeHorizon={period === 'today' ? 'aktual' : 'h7'}
            selectedRegionId={selectedRegionId}
            onSelectRegion={(id) => setSelectedRegionId(id)}
            mode="full"
          />
        }
        insight={
          <RegionInsightPanel
            region={activeRegionName}
            commodity={commodity === 'cabai_rawit_merah' ? 'Cabai Rawit Merah' : commodity}
            currentPrice={currentPriceRp}
            forecastPrice={forecastPriceRp}
            changePercent={changePercent}
            risk={riskStatus}
          />
        }
      />

      {/* 4. Deep-dive Region Detail Section */}
      <RegionDetailSection
        title={`Detail Wilayah & Analisis Keterjangkauan (${activeRegionName})`}
        description="Telusuri harga, daya beli, dan risiko distribusi wilayah terpilih."
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
