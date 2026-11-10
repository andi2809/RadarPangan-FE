"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Layers, ExternalLink, ShieldCheck, ChevronDown, MapPin } from "lucide-react";
import { getAllRegions } from "@/utils/geo-loader";

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
  selectedRegionId = "all_jabar",
  onSelectRegion,
  showGisLink = false,
}: GISMapToolbarProps) {
  const regions = useMemo(() => getAllRegions(), []);

  return (
    <section className="flex flex-col gap-3">
      {/* Top Filter Row: Wilayah, Komoditas, Periode Analisis */}
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${showGisLink ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {/* 1. Wilayah Jawa Barat Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="select-region" className="flex items-center gap-1 text-xs font-bold text-[#706B62]">
              <MapPin size={13} className="text-[#67151D]" />
              <span>Wilayah</span>
            </label>
            <span className="text-[10px] font-mono text-[#898277]">
              {selectedRegionId === "all_jabar" || !selectedRegionId ? "Provinsi" : "Kab/Kota"}
            </span>
          </div>

          <div className="relative">
            <select
              id="select-region"
              value={selectedRegionId || "all_jabar"}
              onChange={(e) => onSelectRegion?.(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D] shadow-sm cursor-pointer"
            >
              <option value="all_jabar">Semua Jawa Barat (Umum)</option>
              <optgroup label="Kabupaten / Kota di Jawa Barat">
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
            />
          </div>
        </div>

        {/* 2. Komoditas Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="select-commodity" className="block text-xs font-bold text-[#706B62]">
              Komoditas
            </label>
            <span className="text-[10px] font-mono text-[#898277]">
              {commodity === 'minyakita' || commodity === 'beras_sphp' ? 'Acuan HET' : 'Harga Acuan HAP'}
            </span>
          </div>
          <div className="relative">
            <select
              id="select-commodity"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D] shadow-sm cursor-pointer"
            >
              <option value="cabai_rawit_merah">Cabai Rawit Merah</option>
              <option value="bawang_merah">Bawang Merah</option>
              <option value="beras_medium">Beras Medium</option>
              <option value="telur_ayam_ras">Telur Ayam Ras</option>
              <option value="minyak_goreng_curah">Minyak Goreng Curah</option>
              <option value="minyakita">Minyakita</option>
              <option value="beras_sphp">Beras SPHP</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
            />
          </div>
        </div>

        {/* 3. Periode Analisis */}
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
