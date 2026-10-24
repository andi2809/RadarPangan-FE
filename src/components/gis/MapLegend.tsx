'use client';

import React from 'react';

interface MapLegendProps {
  activeHorizon: 'aktual' | 'h7';
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeHorizon }) => {
  return (
    <div className="absolute bottom-6 left-6 z-30 select-none">
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs text-slate-200 w-64">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="font-semibold text-slate-200 text-xs tracking-wide">
            STATUS EWS PANGAN
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
            {activeHorizon === 'h7' ? 'Horizon H+7' : 'Harga Aktual'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#16A34A] border border-emerald-400/40" />
              <span>Aman</span>
            </div>
            <span className="text-slate-400 tabular-nums">-5% s/d +5% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#CA8A04] border border-amber-400/40" />
              <span>Waspada</span>
            </div>
            <span className="text-slate-400 tabular-nums">+5% s/d +10% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#DC2626] border border-rose-400/40" />
              <span>Kritis / Defisit</span>
            </div>
            <span className="text-slate-400 tabular-nums">&gt; +10% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#0369A1] border border-sky-400/40" />
              <span>Turun / Surplus</span>
            </div>
            <span className="text-slate-400 tabular-nums">&lt; -5% HAP</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#475569] border border-slate-500/40" />
              <span>Tidak Ada Data</span>
            </div>
            <span className="text-slate-500">Netral</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#334155] border border-slate-600" />
              <span className="text-slate-300">Luar Jawa Barat</span>
            </div>
            <span className="text-slate-400">Tanpa Data Pangan</span>
          </div>
        </div>

        {/* Legend for Supply Matchmaker Routes */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-sky-400 inline-block border-b border-sky-300" />
            <span>Koridor Logistik Pangan</span>
          </div>
          <span className="text-sky-300">Smart Match</span>
        </div>
      </div>
    </div>
  );
};
