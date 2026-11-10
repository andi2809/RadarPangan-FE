import React from "react";
import { Users, Banknote, Scale, AlertCircle } from "lucide-react";
import type { CommodityUmkBurdenResult } from "../../../lib/engines/affordability";

export interface AffordabilityIndicatorProps {
  regionName?: string;
  commodityName?: string;
  unit?: string;
  population?: string;
  umkRp?: number;
  umkRatioBasketPercent?: number;
  povertyBasketRatioPercent?: number;
  kategoriDayaBeli?: "TERJANGKAU" | "RENTAN" | "DARURAT" | "TIDAK_ADA_DATA";
  commodityBurden?: CommodityUmkBurdenResult | null;
  hasData?: boolean;
}

const statusStyle: Record<
  "Terjangkau" | "Membebani" | "Kritis bagi Warga Lokal" | "Tanpa data",
  { label: string; className: string }
> = {
  Terjangkau: { label: "Terjangkau", className: "bg-[#4B9D73] text-white" },
  Membebani: { label: "Membebani", className: "bg-[#E69B39] text-white" },
  "Kritis bagi Warga Lokal": {
    label: "Kritis bagi Warga Lokal",
    className: "bg-[#E85B4F] text-white",
  },
  "Tanpa data": { label: "Tanpa data", className: "bg-[#CBD5E1] text-[#475569]" },
};

export function AffordabilityIndicator({
  regionName = "Wilayah",
  commodityName = "Komoditas",
  unit = "kg",
  population = "—",
  umkRp = 0,
  umkRatioBasketPercent = 0,
  povertyBasketRatioPercent = 0,
  kategoriDayaBeli = "TIDAK_ADA_DATA",
  commodityBurden = null,
  hasData = false,
}: AffordabilityIndicatorProps) {
  const effectiveLabel = !hasData
    ? "Tanpa data"
    : commodityBurden?.statusKeterjangkauan ??
      (kategoriDayaBeli === "DARURAT"
        ? "Kritis bagi Warga Lokal"
        : kategoriDayaBeli === "RENTAN"
        ? "Membebani"
        : "Terjangkau");

  const badge = statusStyle[effectiveLabel];

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-[#DED8CD] bg-white shadow-sm text-center">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
          Daya Beli &amp; Rasio Beban UMK
        </h3>
        <p className="mt-2 text-xs text-[#706B62]">
          Data indikator daya beli belum tersedia untuk wilayah ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-[#F0ECE4] pb-2.5">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
            Daya Beli &amp; Rasio Beban UMK
          </h3>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <span className="flex items-center gap-1.5 text-[#706B62]">
            <Banknote size={14} className="text-[#67151D]" />
            UMK {regionName}
          </span>
          <span className="font-mono font-bold tabular-nums text-[#24231F]">
            {hasData ? `Rp ${umkRp.toLocaleString("id-ID")}` : "—"}
          </span>
        </div>

        {commodityBurden && hasData && (
          <>
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
              <span className="text-[#706B62]">
                Rasio Beban {commodityName} ({commodityBurden.kebutuhanAcuanKg} {unit}/bln)
              </span>
              <span className="font-mono font-bold tabular-nums text-[#67151D]">
                {commodityBurden.rasioBebanUmkPct.toFixed(2)}% UMK
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
              <span className="flex items-center gap-1 text-[#706B62]">
                <Scale size={13} className="text-[#898277]" />
                Skor Tekanan Daya Beli
              </span>
              <span className="font-mono font-bold tabular-nums text-[#B52D26]">
                {commodityBurden.skorTekananDayaBeli.toFixed(2)} ({commodityBurden.penggandaUmk}x UMK Jabar)
              </span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <span className="text-[#706B62]">Beban Keranjang 5 Pokok / UMK</span>
          <span className="font-mono font-bold tabular-nums text-[#24231F]">
            {hasData ? `${umkRatioBasketPercent.toFixed(1)}%` : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <span className="text-[#706B62]">Beban Keranjang / Garis Kemiskinan</span>
          <span className="font-mono font-bold tabular-nums text-[#24231F]">
            {hasData ? `${povertyBasketRatioPercent.toFixed(1)}%` : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="flex items-center gap-1.5 text-[#706B62]">
            <Users size={14} className="text-[#898277]" />
            Populasi Terdampak
          </span>
          <span className="font-bold text-[#24231F]">{population}</span>
        </div>
      </div>

      {commodityBurden && hasData && (
        <div className="rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-2.5 text-[10px] leading-relaxed text-[#706B62]">
          <div className="flex items-center gap-1 font-bold text-[#24231F]">
            <AlertCircle size={12} className="text-[#67151D]" />
            <span>Kebutuhan Konsumsi Pangan Bulanan</span>
          </div>
          <p className="mt-0.5 font-mono">
            Estimasi alokasi {commodityBurden.kebutuhanAcuanKg} {unit}/bulan: Rp{" "}
            {commodityBurden.biayaKomoditasBulananRp.toLocaleString("id-ID")}. Rasio keterjangkauan diselaraskan dengan standar UMK setempat.
          </p>
        </div>
      )}
    </div>
  );
}
