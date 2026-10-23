'use client';

import React from 'react';
import { Commodity } from '../../types/domain';
import { ShieldAlert, Calendar, Layers, Activity } from 'lucide-react';

interface FilterBarProps {
  commodities: Commodity[];
  selectedCommodityId: string;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
  activeTab: 'map' | 'mbg' | 'crowdsource';
  onChangeTab: (tab: 'map' | 'mbg' | 'crowdsource') => void;
  isSandboxActive: boolean;
  onToggleSandbox: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  commodities,
  selectedCommodityId,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon,
  activeTab,
  onChangeTab,
  isSandboxActive,
  onToggleSandbox
}) => {
  const currentComm = commodities.find((c) => c.id === selectedCommodityId);

  return (
    <header className="absolute top-4 left-4 right-4 z-40 select-none pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md pointer-events-auto">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100 tracking-tight">
                RADAR PANGAN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-semibold">
                JABAR 27 KAB/KOTA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              GIS Early Warning & Decision Support System (EWS & DSS)
            </p>
          </div>
        </div>

        {/* Commodity Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono hidden md:block">Komoditas:</label>
          <div className="relative">
            <select
              value={selectedCommodityId}
              onChange={(e) => onSelectCommodity(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-100 text-xs rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer pr-8"
            >
              {commodities.map((comm) => (
                <option key={comm.id} value={comm.id}>
                  {comm.name} ({comm.jenisAcuan} Rp {comm.hargaAcuanRp.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Horizon Toggle (Aktual vs H+7) */}
        <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-700/80">
          <button
            onClick={() => onChangeHorizon('aktual')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
              activeHorizon === 'aktual'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hari Ini (Aktual)
          </button>
          <button
            onClick={() => onChangeHorizon('h7')}
            className={`px-3 py-1 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
              activeHorizon === 'h7'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Proyeksi H+7</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>
        </div>

        {/* Navigation Mode Tabs & DSS Sandbox Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => onChangeTab('map')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
                activeTab === 'map'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Peta EWS</span>
            </button>
            <button
              onClick={() => onChangeTab('mbg')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
                activeTab === 'mbg'
                  ? 'bg-slate-700 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dapur MBG</span>
            </button>
            <button
              onClick={() => onChangeTab('crowdsource')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
                activeTab === 'crowdsource'
                  ? 'bg-slate-700 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              <span>Audit Warga</span>
            </button>
          </div>

          {/* What-If Crisis Sandbox Button */}
          <button
            onClick={onToggleSandbox}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
              isSandboxActive
                ? 'bg-purple-900/60 border-purple-500 text-purple-200 ring-2 ring-purple-500/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
            }`}
          >
            ⚡ What-If Sandbox
          </button>
        </div>
      </div>
    </header>
  );
};
