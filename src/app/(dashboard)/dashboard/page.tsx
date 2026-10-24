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
  loadJabarGeoJson,
  getTelemetry,
  getAllRegions,
  getAllCommodities,
} from '@/utils/geo-loader';
import { UnifiedRegionTelemetry, Commodity } from '@/types/domain';

export default function DashboardPage() {
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions(), []);

  // Filter & Navigation State
  const [commodity, setCommodity] = useState<string>('cabai_rawit_merah');
  const [period, setPeriod] = useState<'today' | 'forecast'>('today');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Default: Kab. Bekasi
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON on mount
  useEffect(() => {
    loadJabarGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON in /dashboard:', err));
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

  // Active Selected Region Data
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

  const selectedCommodityObj = useMemo(
    () => commodities.find((c) => c.id === commodity) || commodities[1] || commodities[0],
    [commodities, commodity]
  );

  // Handler for Region Selection from map or cards
  const handleSelectRegion = useCallback((regionId: string) => {
    setSelectedRegionId(regionId);
  }, []);

  return (
    <GISLayout>
      {/* 1. Header Judul Halaman */}
      <GISPageHeader />

      {/* 2. Ringkasan Statistik 4 KPI Teratas */}
      <GISStatsSection />

      {/* 3. Komposisi Peta Interaktif & Panel Ringkasan Wilayah */}
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
            risk={riskStatus}
          />
        }
      />

      {/* 4. Detail Wilayah, Grafik Tren & Keterjangkauan Daya Beli */}
      <RegionDetailSection
        title={`Detail Wilayah & Analisis Keterjangkauan — ${activeRegionName}`}
        description="Telusuri pergerakan harga, proyeksi H+7, daya beli UMK, dan risiko distribusi pangan."
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
