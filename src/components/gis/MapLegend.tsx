'use client';

import React from 'react';

interface MapLegendProps {
  activeHorizon: 'aktual' | 'h7';
  acuanType?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeHorizon, acuanType = 'HAP' }) => {
  return (
    <div className="bg-white/95 border border-[#E5E2DA] rounded-xl p-3 shadow-md text-xs text-[#292824] w-72 select-none">
      <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-2 mb-2">
        <span className="font-bold text-[#791D2A] text-xs tracking-wider uppercase">
          Status Deviasi Acuan ({acuanType})
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F3ED] text-[#292824] font-semibold border border-[#E5E2DA]">
          {activeHorizon === 'h7' ? 'Horizon H+7' : 'Harga Aktual'}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#729B82]" />
            <span className="font-medium text-[#292824]">Normal</span>
          </div>
          <span className="text-[#77746C] font-mono text-[10px]">&le; +5% acuan</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#D6B45F]" />
            <span className="font-medium text-[#292824]">Perlu Perhatian</span>
          </div>
          <span className="text-[#77746C] font-mono text-[10px]">+5% s/d +10% acuan</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#B85C52]" />
            <span className="font-medium text-[#292824]">Tekanan Tinggi</span>
          </div>
          <span className="text-[#77746C] font-mono text-[10px]">&gt; +10% acuan</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#D5D5D0]" />
            <span className="font-medium text-[#77746C]">Tidak Ada Data</span>
          </div>
          <span className="text-[#77746C] font-mono text-[10px]">—</span>
        </div>
      </div>
    </div>
  );
};
