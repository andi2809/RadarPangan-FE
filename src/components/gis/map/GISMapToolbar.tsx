"use client";

import React from "react";
import Link from "next/link";
import { Layers, ExternalLink, ShieldCheck } from "lucide-react";

export interface GISMapToolbarProps {
  commodity: string;
  setCommodity: (value: string) => void;
  period: "today" | "forecast";
  setPeriod: (value: "today" | "forecast") => void;
  selectedRegionId?: string;
  onSelectRegion?: (regionId: string) => void;
  viewScope?: "jabar" | "indonesia";
  onSelectViewScope?: (scope: "jabar" | "indonesia") => void;
  showGisLink?: boolean;
  dataSource?: "pihps" | "sp2kp";
  onSelectDataSource?: (source: "pihps" | "sp2kp") => void;
}

export function GISMapToolbar({
  commodity,
  setCommodity,
  period,
  setPeriod,
  showGisLink = false,
}: GISMapToolbarProps) {
  return (
    <section className="flex flex-col gap-3">
      {/* Top Filter Row: Map-First layout without redundant Wilayah box */}
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${showGisLink ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {/* 1. Komoditas Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="select-commodity" className="block text-xs font-bold text-[#706B62]">
              Komoditas
            </label>
            <span className="text-[10px] font-mono text-[#898277]">
              {commodity === 'minyakita' || commodity === 'beras_sphp' ? 'Acuan HET' : 'Harga Acuan HAP'}
            </span>
          </div>
          <select
            id="select-commodity"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs font-bold text-[#24231F] outline-none focus:border-[#67151D] shadow-sm"
          >
            <option value="cabai_rawit_merah">Cabai Rawit Merah</option>
            <option value="bawang_merah">Bawang Merah</option>
            <option value="beras_medium">Beras Medium</option>
            <option value="telur_ayam_ras">Telur Ayam Ras</option>
            <option value="minyak_goreng_curah">Minyak Goreng Curah</option>
            <option value="minyakita">Minyakita</option>
            <option value="beras_sphp">Beras SPHP</option>
          </select>
        </div>

        {/* 2. Periode Analisis */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-[#706B62]">
            Periode Analisis
          </span>

          <div className="flex h-10 rounded-lg border border-[#D8D1C5] bg-white p-1 shadow-sm">
            {[
              { value: "today", label: "Hari Ini (Riil)" },
              { value: "forecast", label: "Prediksi H+7" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value as "today" | "forecast")}
                className={`flex-1 rounded-md px-2 text-xs font-semibold transition ${
                  period === item.value
                    ? "bg-[#67151D] text-white shadow-sm"
                    : "text-[#706B62] hover:bg-[#F2EEE7]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {showGisLink && (
          <div className="flex flex-col justify-end space-y-1.5">
            <Link
              href="/dashboard/gis"
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#67151D] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#4C0D15] group"
              title="Buka menu detail GIS layar penuh (Command Center GIS)"
            >
              <Layers size={15} className="text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Buka Menu Detail GIS (Full Interface)</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* Single Source Data Note (Bapanas) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE5DC] text-[11px] text-[#706B62]">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck size={14} className="text-[#287653]" />
          <span>Sumber Data: <strong>Badan Pangan Nasional (Bapanas)</strong></span>
        </div>
        <div className="font-mono text-[10px] text-[#898277]">
          Cakupan 27 Kabupaten/Kota Jawa Barat
        </div>
      </div>
    </section>
  );
}
