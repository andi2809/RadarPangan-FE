'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  getAllCommodities,
  getAllRegions,
  getTelemetry,
  getMbgSourcingRecommendations,
  getCrowdsourceClusters,
  loadJabarGeoJson
} from '../utils/geo-loader';
import {
  Commodity,
  Region,
  UnifiedRegionTelemetry,
  WhatIfParameters,
  SupplyRoute,
  MbgSourcingRecommendation,
  PriceStatus
} from '../types/domain';
import { FilterBar } from '../components/dashboard/FilterBar';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { RegionDetailDrawer } from '../components/dashboard/RegionDetailDrawer';
import { WhatIfSandbox } from '../components/dashboard/WhatIfSandbox';
import { MbgSourcingPanel } from '../components/dashboard/MbgSourcingPanel';
import { CrowdsourceAuditPanel } from '../components/dashboard/CrowdsourceAuditPanel';
import { findOptimalSupplyRoutes } from '../lib/engines/supply-matcher';
import { simulateIntervention } from '../lib/engines/what-if';

// Dynamic import for MapCanvas to disable SSR for MapLibre
const MapCanvas = dynamic(
  () => import('../components/gis/MapCanvas').then((mod) => mod.MapCanvas),
  { ssr: false }
);

export default function DashboardPage() {
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions() as Region[], []);
  const mbgRecommendations = useMemo(() => getMbgSourcingRecommendations() as MbgSourcingRecommendation[], []);
  const crowdsourceClusters = useMemo(() => getCrowdsourceClusters(), []);

  // Primary State
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('beras_medium');
  const [activeHorizon, setActiveHorizon] = useState<'aktual' | 'h7'>('aktual');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>('32.73'); // Default focus Kota Bandung
  const [activeTab, setActiveTab] = useState<'map' | 'mbg' | 'crowdsource'>('map');
  const [isSandboxActive, setIsSandboxActive] = useState<boolean>(false);

  // GeoJSON state
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // What-If Simulation Parameters
  const [whatIfParams, setWhatIfParams] = useState<WhatIfParameters>({
    transportSubsidyPercent: 0,
    marketOperationTonnage: 0,
    distributionIntervention: false
  });

  // Active Supply Routes on Map
  const [activeSupplyRoutes, setActiveSupplyRoutes] = useState<SupplyRoute[]>([]);

  // Load GeoJSON on client mount
  useEffect(() => {
    loadJabarGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON:', err));
  }, []);

  // Current Commodity Object
  const currentCommodity = useMemo(
    () => commodities.find((c) => c.id === selectedCommodityId) || commodities[0],
    [commodities, selectedCommodityId]
  );

  // Telemetry map for selected commodity
  const rawTelemetry = useMemo(
    () => getTelemetry(selectedCommodityId) as Record<string, UnifiedRegionTelemetry>,
    [selectedCommodityId]
  );

  // Enrich telemetry with real region objects
  const allTelemetry = useMemo(() => {
    const result: Record<string, UnifiedRegionTelemetry> = {};
    allRegions.forEach((reg) => {
      const telem = rawTelemetry[reg.id];
      if (telem) {
        result[reg.id] = {
          ...telem,
          region: reg
        };
      }
    });
    return result;
  }, [allRegions, rawTelemetry]);

  // Selected Region Telemetry
  const selectedTelemetry = useMemo(() => {
    if (!selectedRegionId) return null;
    return allTelemetry[selectedRegionId] || null;
  }, [allTelemetry, selectedRegionId]);

  // Compute Simulated Status Map when What-If sliders are adjusted
  const simulatedStatusMap = useMemo(() => {
    const map: Record<string, PriceStatus> = {};
    if (
      whatIfParams.transportSubsidyPercent === 0 &&
      whatIfParams.marketOperationTonnage === 0 &&
      !whatIfParams.distributionIntervention
    ) {
      return map;
    }

    // Apply simulation to targeted region or deficit regions
    Object.keys(allTelemetry).forEach((regId) => {
      const telem = allTelemetry[regId];
      if (!telem) return;

      const shouldApply =
        regId === selectedRegionId ||
        (whatIfParams.transportSubsidyPercent > 0 && telem.currentPrice.status === 'kritis');

      if (shouldApply) {
        const sim = simulateIntervention({
          baseTelemetry: telem,
          transportSubsidyPercent: whatIfParams.transportSubsidyPercent,
          marketOperationTonnage:
            regId === selectedRegionId ? whatIfParams.marketOperationTonnage : 0,
          distributionIntervention: whatIfParams.distributionIntervention
        });
        map[regId] = sim.simulatedStatus;
      }
    });

    return map;
  }, [allTelemetry, selectedRegionId, whatIfParams]);

  // Handler: Find Supply Routes from surplus to current region
  const handleFindSupplyRoutes = useCallback(() => {
    if (!selectedTelemetry) return;
    const routes = findOptimalSupplyRoutes(
      selectedTelemetry.region,
      180, // Target allocation 180 ton
      allRegions,
      allTelemetry,
      selectedCommodityId
    );
    setActiveSupplyRoutes(routes);
  }, [selectedTelemetry, allRegions, allTelemetry, selectedCommodityId]);

  // Handler: Focus MBG route
  const handleFocusMbgRoute = useCallback(
    (rec: MbgSourcingRecommendation) => {
      setSelectedRegionId(rec.targetRegionId);
      const sourceRegion = allRegions.find((r) => r.id === rec.recommendedSourceRegionId);
      const targetRegion = allRegions.find((r) => r.id === rec.targetRegionId);

      if (sourceRegion && targetRegion) {
        const routes = findOptimalSupplyRoutes(
          targetRegion,
          rec.kebutuhanTonPerBulan,
          allRegions,
          allTelemetry,
          rec.commodityId
        );
        setActiveSupplyRoutes(routes);
        setActiveTab('map');
      }
    },
    [allRegions, allTelemetry]
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. Full-Bleed Map Canvas */}
      <MapCanvas
        geoJson={geoJson}
        allTelemetry={allTelemetry}
        activeHorizon={activeHorizon}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => setSelectedRegionId(id)}
        activeSupplyRoutes={activeSupplyRoutes}
        simulatedStatusMap={simulatedStatusMap}
      />

      {/* 2. Top Floating Filter & Horizon Bar */}
      <FilterBar
        commodities={commodities}
        selectedCommodityId={selectedCommodityId}
        onSelectCommodity={(id) => {
          setSelectedCommodityId(id);
          setActiveSupplyRoutes([]);
        }}
        activeHorizon={activeHorizon}
        onChangeHorizon={(h) => setActiveHorizon(h)}
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t)}
        isSandboxActive={isSandboxActive}
        onToggleSandbox={() => setIsSandboxActive(!isSandboxActive)}
      />

      {/* 3. Top-Right Provincial Summary Card */}
      {activeTab === 'map' && (
        <SummaryCards
          commodity={currentCommodity}
          allTelemetry={allTelemetry}
          activeHorizon={activeHorizon}
        />
      )}

      {/* 4. Sliding Right Telemetry & DSS Drawer (Region Detail) */}
      {selectedRegionId && activeTab === 'map' && (
        <RegionDetailDrawer
          telemetry={selectedTelemetry}
          onClose={() => {
            setSelectedRegionId(null);
            setActiveSupplyRoutes([]);
          }}
          activeHorizon={activeHorizon}
          onFindSupplyRoutes={handleFindSupplyRoutes}
          activeSupplyRoutes={activeSupplyRoutes}
        />
      )}

      {/* 5. What-If Crisis Sandbox Panel (Bottom Left) */}
      <WhatIfSandbox
        isOpen={isSandboxActive}
        onClose={() => setIsSandboxActive(false)}
        selectedTelemetry={selectedTelemetry}
        params={whatIfParams}
        onParamsChange={(p) => setWhatIfParams(p)}
        onResetParams={() =>
          setWhatIfParams({
            transportSubsidyPercent: 0,
            marketOperationTonnage: 0,
            distributionIntervention: false
          })
        }
      />

      {/* 6. MBG Sourcing Panel */}
      {activeTab === 'mbg' && (
        <MbgSourcingPanel
          recommendations={mbgRecommendations}
          onFocusMbgRoute={handleFocusMbgRoute}
          onClose={() => setActiveTab('map')}
        />
      )}

      {/* 7. Crowdsource Citizen Consensus Audit Panel */}
      {activeTab === 'crowdsource' && (
        <CrowdsourceAuditPanel
          initialClusters={crowdsourceClusters}
          onClose={() => setActiveTab('map')}
        />
      )}
    </main>
  );
}
