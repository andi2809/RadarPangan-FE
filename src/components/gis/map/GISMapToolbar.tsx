"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Layers, ExternalLink, Database, ShieldCheck } from "lucide-react";

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

export const jabarRegions = [
  { id: "all_jabar", name: "Semua Jawa Barat (Agregat)" },
  { id: "32.16", name: "Kab. Bekasi (Prioritas EWS)" },
  { id: "32.01", name: "Kab. Bogor" },
  { id: "32.02", name: "Kab. Sukabumi" },
  { id: "32.03", name: "Kab. Cianjur" },
  { id: "32.04", name: "Kab. Bandung" },
  { id: "32.05", name: "Kab. Garut (Sentra Surplus)" },
  { id: "32.06", name: "Kab. Tasikmalaya" },
  { id: "32.07", name: "Kab. Ciamis" },
  { id: "32.08", name: "Kab. Kuningan" },
  { id: "32.09", name: "Kab. Cirebon" },
  { id: "32.10", name: "Kab. Majalengka" },
  { id: "32.11", name: "Kab. Sumedang" },
  { id: "32.12", name: "Kab. Indramayu (Lumbung Padi)" },
  { id: "32.13", name: "Kab. Subang" },
  { id: "32.14", name: "Kab. Purwakarta" },
  { id: "32.15", name: "Kab. Karawang" },
  { id: "32.17", name: "Kab. Bandung Barat" },
  { id: "32.18", name: "Kab. Pangandaran" },
  { id: "32.71", name: "Kota Bogor" },
  { id: "32.72", name: "Kota Sukabumi" },
  { id: "32.73", name: "Kota Bandung" },
  { id: "32.74", name: "Kota Cirebon" },
  { id: "32.75", name: "Kota Bekasi" },
  { id: "32.76", name: "Kota Depok" },
  { id: "32.77", name: "Kota Cimahi" },
  { id: "32.78", name: "Kota Tasikmalaya" },
  { id: "32.79", name: "Kota Banjar" },
];

export const indonesiaProvinces = [
  { id: "all_indo", name: "Seluruh Nusantara (38 Provinsi)" },
  { id: "31", name: "DKI Jakarta" },
  { id: "32", name: "Jawa Barat" },
  { id: "33", name: "Jawa Tengah" },
  { id: "34", name: "DI Yogyakarta" },
  { id: "35", name: "Jawa Timur" },
  { id: "36", name: "Banten" },
  { id: "12", name: "Sumatera Utara" },
  { id: "13", name: "Sumatera Barat" },
  { id: "51", name: "Bali" },
  { id: "73", name: "Sulawesi Selatan" },
];

export function GISMapToolbar({
  commodity,
  setCommodity,
  period,
  setPeriod,
  selectedRegionId = "32.16",
  onSelectRegion,
  viewScope = "jabar",
  onSelectViewScope,
  showGisLink = true,
  dataSource = "pihps",
  onSelectDataSource,
}: GISMapToolbarProps) {
  return (
    <section className="flex flex-col gap-3 border-b border-[#DED8CD] pb-4">
      {/* Top Filter Row */}
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${showGisLink ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {/* 1. Filter Wilayah (Scope Switcher & Region Dropdown) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#706B62] flex items-center gap-1">
              <MapPin size={13} className="text-[#67151D]" />
              Wilayah Pantauan
            </span>
            {onSelectViewScope && (
              <div className="flex text-[10px] rounded border border-[#D8D1C5] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => onSelectViewScope("jabar")}
                  className={`px-1.5 py-0.5 font-semibold transition ${
                    viewScope === "jabar"
                      ? "bg-[#67151D] text-white"
                      : "text-[#706B62] hover:bg-[#F2EEE7]"
                  }`}
                >
                  Jabar
                </button>
                <button
                  type="button"
                  onClick={() => onSelectViewScope("indonesia")}
                  className={`px-1.5 py-0.5 font-semibold transition ${
                    viewScope === "indonesia"
                      ? "bg-[#67151D] text-white"
                      : "text-[#706B62] hover:bg-[#F2EEE7]"
                  }`}
                >
                  Nasional
                </button>
              </div>
            )}
          </div>

          <select
            value={selectedRegionId}
            onChange={(e) => onSelectRegion && onSelectRegion(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D8D1C5] bg-white px-2.5 text-xs font-bold text-[#24231F] outline-none focus:border-[#67151D] shadow-sm"
          >
            <optgroup label="Jawa Barat (Fokus Daerah)">
              {jabarRegions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Cakupan Nasional / Provinsi">
              {indonesiaProvinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 2. Komoditas Dropdown (Mapped to exact backend keys + Sub-komoditas Beras & Minyakita) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="block text-xs font-bold text-[#706B62]">
              Komoditas Strategis
            </span>
            <span className="text-[10px] font-mono text-[#898277]">
              {commodity === 'minyakita' || commodity === 'beras_sphp' ? 'Acuan HET' : 'Harga Pasar'}
            </span>
          </div>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D8D1C5] bg-white px-2.5 text-xs font-bold text-[#24231F] outline-none focus:border-[#67151D] shadow-sm"
          >
            <optgroup label="Komoditas Utama (Harga Pasar PIHPS)">
              <option value="cabai_rawit_merah">Cabai Rawit Merah [Pasar]</option>
              <option value="bawang_merah">Bawang Merah [Pasar]</option>
              <option value="beras_medium">Beras Medium [Pasar Bebas]</option>
              <option value="telur_ayam_ras">Telur Ayam Ras [Pasar]</option>
              <option value="minyak_goreng_curah">Minyak Goreng Curah [Pasar]</option>
            </optgroup>
            <optgroup label="Intervensi & Acuan (SP2KP Kemendag)">
              <option value="beras_sphp">Beras SPHP Bulog [Acuan HET]</option>
              <option value="minyakita">Minyakita Kemasan [Acuan HET]</option>
            </optgroup>
          </select>
        </div>

        {/* 3. Periode Data */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-[#706B62]">
            Horizon Analisis
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

      {/* Layer Sumber Data (D1 & D5: PIHPS Default 9 Pasar vs SP2KP 27 Pemantauan Daerah) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE5DC]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#706B62] flex items-center gap-1">
            <Database size={13} className="text-[#67151D]" />
            Lapisan Sumber Data:
          </span>
          <div className="inline-flex rounded-lg border border-[#D8D1C5] bg-white p-0.5 shadow-sm text-xs">
            <button
              type="button"
              onClick={() => onSelectDataSource && onSelectDataSource("pihps")}
              className={`px-2.5 py-1 rounded font-semibold transition flex items-center gap-1.5 ${
                dataSource === "pihps"
                  ? "bg-[#67151D] text-white shadow-sm"
                  : "text-[#706B62] hover:bg-[#F2EEE7]"
              }`}
            >
              <span>PIHPS (Harga Pasar)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${dataSource === 'pihps' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>9 Titik</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectDataSource && onSelectDataSource("sp2kp")}
              className={`px-2.5 py-1 rounded font-semibold transition flex items-center gap-1.5 ${
                dataSource === "sp2kp"
                  ? "bg-[#67151D] text-white shadow-sm"
                  : "text-[#706B62] hover:bg-[#F2EEE7]"
              }`}
            >
              <span>SP2KP (Pemantauan Daerah)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${dataSource === 'sp2kp' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>27 Kab/Kota</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#706B62] font-mono">
          <ShieldCheck size={14} className="text-emerald-700" />
          <span>Integritas: <strong>PIHPS</strong> (Anomali Pasar) • <strong>SP2KP</strong> (Cakupan Daerah & Minyakita)</span>
        </div>
      </div>
    </section>
  );
}
