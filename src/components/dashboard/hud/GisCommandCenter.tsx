'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Commodity,
  Region,
  UnifiedRegionTelemetry,
  SupplyRoute,
  CrisisScenario,
  PriceStatus
} from '../../../types/domain';
import { DEFAULT_SUPPLY_CORRIDOR } from '../../../data/mock/dashboardData';
import { FloatingTopBar } from './FloatingTopBar';
import { RightAnalysisDrawer } from './RightAnalysisDrawer';
import { BottomTelemetryDock } from './BottomTelemetryDock';

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
  initialRouteActive?: boolean;
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
  initialRouteActive = false
}) => {
  const [isRouteActive, setIsRouteActive] = useState<boolean>(initialRouteActive);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedStatusMap, setSimulatedStatusMap] = useState<Record<string, PriceStatus>>({});

  const selectedTelemetry = allTelemetry[selectedRegionId] || allTelemetry['32.16'] || Object.values(allTelemetry)[0];

  const activeSupplyRoutes = useMemo(() => {
    if (!isRouteActive) return [];
    return [DEFAULT_SUPPLY_CORRIDOR];
  }, [isRouteActive]);

  const handleToggleRoute = () => {
    setIsRouteActive((prev) => !prev);
  };

  const handleRunSimulation = (scenario: CrisisScenario) => {
    setIsSimulating(true);
    // Apply simulated impact on deficit regions like Bekasi
    const simulated: Record<string, PriceStatus> = {};
    Object.keys(allTelemetry).forEach((regId) => {
      if (regId === '32.16' || regId === '32.13') {
        simulated[regId] = 'waspada'; // cooled down by intervention
      }
    });
    setSimulatedStatusMap(simulated);

    setTimeout(() => {
      setIsSimulating(false);
    }, 2500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. Full-Bleed Map Canvas (Dark Tactical Slate Background #0F172A) */}
      <MapCanvas
        geoJson={geoJson}
        allTelemetry={allTelemetry}
        activeHorizon={activeHorizon}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => {
          onSelectRegion(id);
          setIsDrawerOpen(true);
        }}
        activeSupplyRoutes={activeSupplyRoutes}
        simulatedStatusMap={simulatedStatusMap}
      />

      {/* 2. Floating Top Bar */}
      <FloatingTopBar
        commodities={commodities}
        selectedCommodity={selectedCommodity}
        onSelectCommodity={onSelectCommodity}
        activeHorizon={activeHorizon}
        onChangeHorizon={onChangeHorizon}
        onBackToOverview={onBackToOverview}
      />

      {/* 3. Floating Right Analysis Drawer */}
      {isDrawerOpen && (
        <RightAnalysisDrawer
          telemetry={selectedTelemetry}
          selectedCommodity={selectedCommodity}
          activeHorizon={activeHorizon}
          onClose={() => setIsDrawerOpen(false)}
          onActivateRoute={handleToggleRoute}
          isRouteActive={isRouteActive}
        />
      )}

      {/* 4. Bottom Telemetry Dock (5 Columns) */}
      <BottomTelemetryDock
        onSelectRegion={onSelectRegion}
        selectedRegionId={selectedRegionId}
        onActivateRoute={handleToggleRoute}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
      />
    </div>
  );
};
