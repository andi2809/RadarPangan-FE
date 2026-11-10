'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Commodity, UnifiedRegionTelemetry } from '../../../types/domain';
import { FloatingTopBar } from './FloatingTopBar';
import { RightAnalysisDrawer } from './RightAnalysisDrawer';
import { BottomTelemetryDock } from './BottomTelemetryDock';
import { PanelRightOpen } from 'lucide-react';

// Dynamic import for MapCanvas (MapLibre GL disable SSR)
const MapCanvas = dynamic(
  () => import('../../gis/MapCanvas').then((mod) => mod.MapCanvas),
  { ssr: false }
);

interface GisCommandCenterProps {
  geoJson: GeoJSON.FeatureCollection | null;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  commodities: Commodity[];
  selectedCommodity: Commodity;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (h: 'aktual' | 'h7') => void;
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  onBackToOverview: () => void;
}

export const GisCommandCenter: React.FC<GisCommandCenterProps> = ({
  geoJson,
  allTelemetry,
  commodities,
  selectedCommodity,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon,
  selectedRegionId,
  onSelectRegion,
  onBackToOverview,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Responsivitas otomatis: pada layar tablet & mobile (< 1200px), default tutup drawer agar peta lega
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1200) {
      setIsDrawerOpen(false);
    }
  }, []);

  const selectedTelemetry =
    allTelemetry[selectedRegionId] ||
    allTelemetry['32.16'] ||
    Object.values(allTelemetry)[0] ||
    null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F5F3ED] text-[#292824] font-sans">
      {/* 1. Full-Bleed Light GIS Map Canvas */}
      <MapCanvas
        geoJson={geoJson}
        allTelemetry={allTelemetry}
        activeHorizon={activeHorizon}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => {
          onSelectRegion(id);
          setIsDrawerOpen(true);
        }}
        commodityAcuanType={selectedCommodity.jenisAcuan || 'HAP'}
        commodityAcuanRp={selectedCommodity.hargaAcuanRp || 45000}
        mode="full"
      />

      {/* 2. Top Toolbar */}
      <FloatingTopBar
        commodities={commodities}
        selectedCommodity={selectedCommodity}
        onSelectCommodity={onSelectCommodity}
        activeHorizon={activeHorizon}
        onChangeHorizon={onChangeHorizon}
        onBackToOverview={onBackToOverview}
      />

      {/* 3. Right Detail Inspector */}
      <RightAnalysisDrawer
        telemetry={selectedTelemetry}
        selectedCommodity={selectedCommodity}
        activeHorizon={activeHorizon}
        onClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
      />

      {/* Re-open Button if Inspector is closed */}
      {!isDrawerOpen && selectedTelemetry && (
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-20 right-4 z-30 px-3 py-2 rounded-xl bg-white border border-[#E5E2DA] shadow-md text-xs font-semibold text-[#292824] hover:bg-[#F5F3ED] transition-colors flex items-center gap-2 select-none"
          title="Buka Panel Detail Wilayah"
        >
          <PanelRightOpen className="w-4 h-4 text-[#791D2A]" />
          <span>Detail Wilayah: {selectedTelemetry.region.name}</span>
        </button>
      )}

      {/* 4. Bottom Analytics Dock (Unified 3-Kolom: Top 5, Tren H+7, Komoditas Lain) */}
      <BottomTelemetryDock
        allTelemetry={allTelemetry}
        selectedCommodity={selectedCommodity}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => {
          onSelectRegion(id);
          setIsDrawerOpen(true);
        }}
        activeHorizon={activeHorizon}
        onSelectCommodity={onSelectCommodity}
        isDrawerOpen={isDrawerOpen}
      />
    </div>
  );
};
