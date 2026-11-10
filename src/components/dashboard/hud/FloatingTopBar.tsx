'use client';

import React from 'react';
import { Commodity } from '../../../types/domain';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { RadarPanganLogo } from '@/components/brand/RadarPanganLogo';

interface FloatingTopBarProps {
  commodities: Commodity[];
  selectedCommodity: Commodity;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
  onBackToOverview: () => void;
  lastUpdatedDate?: string;
}

export const FloatingTopBar: React.FC<FloatingTopBarProps> = ({
  commodities,
  selectedCommodity,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon,
  onBackToOverview,
  lastUpdatedDate = '24 Okt 2026, 09:27 WIB',
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-16 bg-[#F5F3ED]/95 border-b border-[#E5E2DA] px-4 md:px-6 shadow-sm backdrop-blur-sm select-none">
      <div className="h-full max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        {/* Kiri: RADAR PANGAN | GIS Command Center 27 Kab/Kota Jawa Barat */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              onBackToOverview();
            }}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <RadarPanganLogo size={20} color="#791D2A" />
            <span className="font-black text-sm tracking-wider text-[#791D2A]">
              RADAR PANGAN
            </span>
          </Link>

          <span className="w-px h-5 bg-[#E5E2DA]" />

          <div className="flex items-baseline gap-2">
            <h1 className="font-bold text-sm text-[#292824] tracking-tight">
              GIS Command Center
            </h1>
            <span className="text-xs text-[#77746C] hidden md:inline">
              27 Kab/Kota Jawa Barat
            </span>
          </div>
        </div>

        {/* Tengah: Dropdown komoditas & Horizon Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Dropdown Pemilihan Komoditas */}
          <div className="relative">
            <select
              value={selectedCommodity.id}
              onChange={(e) => onSelectCommodity(e.target.value)}
              className="appearance-none bg-white border border-[#E5E2DA] text-[#292824] text-xs font-medium rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#791D2A] shadow-2xs max-w-[210px] sm:max-w-xs truncate"
            >
              {commodities.map((c) => {
                const acuanLabel = c.jenisAcuan || 'HAP';
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({acuanLabel} Rp {c.hargaAcuanRp.toLocaleString('id-ID')})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none text-[#77746C]" />
          </div>

          {/* Horizon Selector (Hari Ini / H+7) */}
          <div className="flex bg-[#EAE8E1] p-0.5 rounded-lg border border-[#E5E2DA]">
            <button
              type="button"
              onClick={() => onChangeHorizon('aktual')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                activeHorizon === 'aktual'
                  ? 'bg-[#791D2A] text-white font-bold shadow-2xs'
                  : 'text-[#77746C] hover:text-[#292824]'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => onChangeHorizon('h7')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeHorizon === 'h7'
                  ? 'bg-[#791D2A] text-white font-bold shadow-2xs'
                  : 'text-[#77746C] hover:text-[#292824]'
              }`}
            >
              <span>H+7</span>
            </button>
          </div>
        </div>

        {/* Kanan: Pembaruan Bapanas (Tanpa badge SP2KP) */}
        <div className="hidden lg:flex items-center text-xs text-[#77746C]">
          <span>
            Pembaruan Bapanas:{' '}
            <strong className="text-[#292824] font-medium font-mono">{lastUpdatedDate}</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
