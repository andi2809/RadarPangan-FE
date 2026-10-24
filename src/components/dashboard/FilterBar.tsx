'use client';

import React from 'react';
import { Commodity } from '../../types/domain';
import { ShieldAlert, Layers } from 'lucide-react';

interface FilterBarProps {
  commodities: Commodity[];
  selectedCommodityId: string;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
  activeTab: 'map' | 'crowdsource';
  onChangeTab: (tab: 'map' | 'crowdsource') => void;
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
  onToggleSandbox,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-40 select-none pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffdf7]/95 border border-[#ded8c8] rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#f4e8e9] border border-[#dfc7b8] text-[#67151d]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1e221f] tracking-tight">
                RADAR PANGAN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f0ebde] text-[#67151d] border border-[#ded8c8] font-semibold">
                JABAR 27 KAB/KOTA
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#5c5b52] font-mono hidden md:block">Komoditas:</label>
          <select
            value={selectedCommodityId}
            onChange={(e) => onSelectCommodity(e.target.value)}
            className="bg-[#f8f4e9] border border-[#ded8c8] text-[#1e221f] text-xs rounded-lg px-3 py-1.5 font-medium cursor-pointer"
          >
            {commodities.map((comm) => (
              <option key={comm.id} value={comm.id}>
                {comm.name} ({comm.jenisAcuan} Rp {comm.hargaAcuanRp.toLocaleString('id-ID')})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-[#f0ebde] p-0.5 rounded-lg border border-[#ded8c8]">
          <button
            onClick={() => onChangeHorizon('aktual')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
              activeHorizon === 'aktual'
                ? 'bg-[#67151d] text-white font-bold shadow-sm'
                : 'text-[#5c5b52] hover:text-[#1e221f]'
            }`}
          >
            Hari Ini (Aktual)
          </button>
          <button
            onClick={() => onChangeHorizon('h7')}
            className={`px-3 py-1 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
              activeHorizon === 'h7'
                ? 'bg-[#67151d] text-white font-bold shadow-sm'
                : 'text-[#5c5b52] hover:text-[#1e221f]'
            }`}
          >
            <span>Proyeksi H+7</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#f0ebde] p-0.5 rounded-lg border border-[#ded8c8]">
            <button
              onClick={() => onChangeTab('map')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
                activeTab === 'map'
                  ? 'bg-[#fffdf7] text-[#1e221f] font-semibold'
                  : 'text-[#5c5b52]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Peta EWS</span>
            </button>
            <button
              onClick={() => onChangeTab('crowdsource')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
                activeTab === 'crowdsource'
                  ? 'bg-[#fffdf7] text-[#67151d] font-semibold'
                  : 'text-[#5c5b52]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Laporan Warga</span>
            </button>
          </div>

          <button
            onClick={onToggleSandbox}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
              isSandboxActive
                ? 'bg-[#67151d] border-[#67151d] text-white'
                : 'bg-[#fffdf7] border-[#ded8c8] text-[#1e221f]'
            }`}
          >
            Simulasi Skenario
          </button>
        </div>
      </div>
    </header>
  );
};
