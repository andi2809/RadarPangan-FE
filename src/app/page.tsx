'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ActiveScreen,
  ActiveNavTab,
  MbgSourcingRecommendation
} from '../types/domain';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { ExecutiveOverview } from '../components/dashboard/overview/ExecutiveOverview';
import { GisCommandCenter } from '../components/dashboard/hud/GisCommandCenter';
import { CrowdsourceAuditPanel } from '../components/dashboard/CrowdsourceAuditPanel';
import { MbgSourcingPanel } from '../components/dashboard/MbgSourcingPanel';

export default function DashboardMaster() {
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions() as Region[], []);
  const mbgRecommendations = useMemo(() => getMbgSourcingRecommendations() as MbgSourcingRecommendation[], []);
  const crowdsourceClusters = useMemo(() => getCrowdsourceClusters(), []);

  // Screen & Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('overview');
  const [activeNavTab, setActiveNavTab] = useState<ActiveNavTab>('gis');

  // Filter State (Default Cabai Rawit Merah & Kab. Bekasi matching visual mockups)
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('cabai_rawit_merah');
  const [activeHorizon, setActiveHorizon] = useState<'aktual' | 'h7'>('aktual');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Default Kab. Bekasi
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [routeActiveInCommand, setRouteActiveInCommand] = useState<boolean>(false);

  // GeoJSON state
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  // Load GeoJSON on client mount
  useEffect(() => {
    loadJabarGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON:', err));
  }, []);

  // Selected Commodity Object
  const currentCommodity = useMemo(
    () => commodities.find((c) => c.id === selectedCommodityId) || commodities[1] || commodities[0],
    [commodities, selectedCommodityId]
  );

  // Raw telemetry data for selected commodity
  const rawTelemetry = useMemo(
    () => getTelemetry(selectedCommodityId) as Record<string, UnifiedRegionTelemetry>,
    [selectedCommodityId]
  );

  // Enriched telemetry map
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

  // Selected Region Object & Name
  const selectedRegion = useMemo(
    () => allRegions.find((r) => r.id === selectedRegionId),
    [allRegions, selectedRegionId]
  );

  // Handler: Transition from Screen 1 to Screen 2 (Command Center)
  const handleOpenCommandCenter = useCallback((regionId?: string) => {
    if (regionId) setSelectedRegionId(regionId);
    setRouteActiveInCommand(false);
    setActiveScreen('command-center');
  }, []);

  // Handler: Transition from Screen 1 to Screen 2 with Supply Route active
  const handleOpenSupplyRoute = useCallback(() => {
    setSelectedRegionId('32.16'); // Kab. Bekasi
    setRouteActiveInCommand(true);
    setActiveScreen('command-center');
  }, []);

  // Handler: Return to Screen 1
  const handleBackToOverview = useCallback(() => {
    setActiveScreen('overview');
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* If Command Center is active, render Full-Bleed Screen 2 */}
      {activeScreen === 'command-center' ? (
        <GisCommandCenter
          geoJson={geoJson}
          allTelemetry={allTelemetry}
          commodities={commodities}
          selectedCommodity={currentCommodity}
          onSelectCommodity={(id) => setSelectedCommodityId(id)}
          activeHorizon={activeHorizon}
          onChangeHorizon={(h) => setActiveHorizon(h)}
          selectedRegionId={selectedRegionId}
          onSelectRegion={(id) => setSelectedRegionId(id)}
          onBackToOverview={handleBackToOverview}
          initialRouteActive={routeActiveInCommand}
        />
      ) : (
        /* Screen 1: Executive Overview with Unified Permanent Sidebar & Header */
        <div className="flex w-full h-full overflow-hidden bg-[#F8FAFC]">
          {/* Permanent Single Sidebar */}
          <Sidebar
            activeTab={activeNavTab}
            onSelectTab={(tab) => setActiveNavTab(tab)}
            activeScreen={activeScreen}
            onToggleScreen={(screen) => setActiveScreen(screen)}
            commodities={commodities}
            selectedCommodityId={selectedCommodityId}
            onSelectCommodity={(id) => setSelectedCommodityId(id)}
            activeHorizon={activeHorizon}
            onChangeHorizon={(h) => setActiveHorizon(h)}
          />

          {/* Main Work Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Topbar Header */}
            <Header
              activeScreen={activeScreen}
              onToggleScreen={(screen) => setActiveScreen(screen)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              selectedRegionName={selectedRegion?.name}
            />

            {/* View Switcher based on Active Nav Tab */}
            {activeNavTab === 'gis' && (
              <ExecutiveOverview
                commodities={commodities}
                selectedCommodity={currentCommodity}
                onSelectCommodity={(id) => setSelectedCommodityId(id)}
                activeHorizon={activeHorizon}
                onChangeHorizon={(h) => setActiveHorizon(h)}
                allTelemetry={allTelemetry}
                selectedRegionId={selectedRegionId}
                onSelectRegion={(id) => setSelectedRegionId(id)}
                onOpenCommandCenter={handleOpenCommandCenter}
                onOpenSupplyRoute={handleOpenSupplyRoute}
              />
            )}

            {activeNavTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      Analisis Rantai Pasok & Sinergi MBG (Badan Gizi Nasional)
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Pemetaan kebutuhan bahan baku SPPG Jawa Barat langsung dari sentra surplus lokal.
                    </p>
                    <MbgSourcingPanel
                      recommendations={mbgRecommendations}
                      onFocusMbgRoute={(rec) => {
                        setSelectedRegionId(rec.targetRegionId);
                        setActiveScreen('command-center');
                      }}
                      onClose={() => setActiveNavTab('gis')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeNavTab === 'crowdsource' && (
              <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      Audit Konsensus Laporan Warga & Filter Spekulan
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Verifikasi kuorum $\ge 10$ laporan independen dalam radius 3 km dan deteksi anomali MAD.
                    </p>
                    <CrowdsourceAuditPanel
                      initialClusters={crowdsourceClusters}
                      onClose={() => setActiveNavTab('gis')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeNavTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">Pengaturan Parameter Sistem & Ambang EWS</h2>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span>Ambang Aman (Terkendali):</span>
                      <span className="font-bold text-emerald-600">&plusmn;5% HAP</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span>Ambang Waspada (Fluktuasi):</span>
                      <span className="font-bold text-amber-600">+5% s/d +10% HAP</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span>Ambang Kritis (Defisit Pasokan):</span>
                      <span className="font-bold text-rose-600">&gt; +10% HAP</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span>Radius Konsensus Warga:</span>
                      <span className="font-bold text-sky-600">3.0 km</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
