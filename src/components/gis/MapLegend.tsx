'use client';

import React from 'react';

interface MapLegendProps {
  activeHorizon: 'aktual' | 'h7';
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeHorizon }) => {
  return (
    <div className="absolute bottom-6 left-6 z-30 select-none">
      <div className="bg-[#fffdf7]/95 border border-[#ded8cd] rounded-xl p-3.5 shadow-xl backdrop-blur-md text-xs text-[#24231f] w-72">
        <div className="flex items-center justify-between border-b border-[#ded8cd] pb-2 mb-2.5">
          <span className="font-bold text-[#67151d] text-xs tracking-wider">
            STATUS EWS PANGAN
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f0ebde] text-[#67151d] font-semibold border border-[#ded8cd]">
            {activeHorizon === 'h7' ? 'Horizon H+7' : 'Harga Aktual'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4B9D73] border border-emerald-600/30" />
              <span className="font-medium text-[#24231f]">Aman</span>
            </div>
            <span className="text-[#79796e] font-mono tabular-nums text-[10px]">-5% s/d +5% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F0C94D] border border-amber-600/30" />
              <span className="font-medium text-[#24231f]">Waspada</span>
            </div>
            <span className="text-[#79796e] font-mono tabular-nums text-[10px]">+5% s/d +10% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E85B4F] border border-rose-600/30" />
              <span className="font-medium text-[#24231f]">Kritis / Defisit</span>
            </div>
            <span className="text-[#79796e] font-mono tabular-nums text-[10px]">&gt; +10% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0369A1] border border-sky-600/30" />
              <span className="font-medium text-[#24231f]">Turun / Surplus</span>
            </div>
            <span className="text-[#79796e] font-mono tabular-nums text-[10px]">&lt; -5% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#cbd5e1] border border-slate-400/40" />
              <span className="font-medium text-[#79796e]">Tidak Ada Data</span>
            </div>
            <span className="text-[#a09e95] text-[10px]">Netral</span>
          </div>

        </div>

        {/* Legend for Supply Matchmaker Routes */}
        <div className="mt-2.5 pt-2 border-t border-[#ded8cd] flex items-center justify-between text-[10px] text-[#79796e]">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#67151d] inline-block" />
            <span className="font-medium">Koridor Rantai Pasok</span>
          </div>
          <span className="text-[#67151d] font-bold">Smart Match</span>
        </div>
      </div>
    </div>
  );
};
