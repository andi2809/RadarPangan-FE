import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Info,
  Flame,
  ChevronRight,
} from "lucide-react";
import type { SupplyRoute, PriceStatus } from "../../../types/domain";
import type { MultiWindowAnalysis } from "../../../lib/engines/forecasting";
import type { ApprovedCitizenReport } from "../../../utils/dual-source-store";

export type TopPressureRegionItem = {
  id: string;
  name: string;
  currentPriceRp: number;
  hargaAcuanRp: number;
  deviasiPct: number;
  status?: PriceStatus;
};

export type RegionInsightPanelProps = {
  region: string;
  commodity: string;
  unit?: string;
  currentPrice: number;
  hargaAcuanRp?: number;
  jenisAcuan?: string;
  forecastPrice: number;
  changePercent: number;
  risk: "TERKENDALI" | "WASPADA" | "KRITIS";
  hasData?: boolean;
  citizenReport?: ApprovedCitizenReport | null;
  multiWindow?: MultiWindowAnalysis | null;
  supplyRoutes?: SupplyRoute[];
  topPressureRegions?: TopPressureRegionItem[];
  selectedRegionId?: string;
  onSelectRegion?: (regionId: string) => void;
};

const riskStyle = {
  TERKENDALI: "bg-[#E3F0E7] text-[#287653] border border-[#287653]/25",
  WASPADA: "bg-[#FBF0D7] text-[#96620A] border border-[#E69B39]/35",
  KRITIS: "bg-[#FBE7E4] text-[#B52D26] border border-[#E85B4F]/35",
};

const numberFormat = new Intl.NumberFormat("id-ID");
const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;

export function RegionInsightPanel({
  region = "Kab. Bekasi",
  commodity = "Cabai Rawit Merah",
  unit = "kg",
  currentPrice = 48200,
  hargaAcuanRp = 45000,
  jenisAcuan = "HAP",
  forecastPrice = 50400,
  changePercent = 8.7,
  risk = "TERKENDALI",
  hasData = true,
  citizenReport = null,
  multiWindow = null,
  topPressureRegions = [],
  selectedRegionId = "all_jabar",
  onSelectRegion,
}: Partial<RegionInsightPanelProps>) {
  if (!hasData) {
    return (
      <aside className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
          <Info size={22} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#24231F]">{region}</h3>
          <p className="text-xs text-[#706B62] mt-1 max-w-[240px]">
            Data harga untuk wilayah ini belum tersedia di basis data resmi Bapanas.
          </p>
        </div>
      </aside>
    );
  }

  const isApprovedCitizen = citizenReport?.statusApproval === "approved";
  const citizenDiffPct =
    isApprovedCitizen && citizenReport && currentPrice > 0
      ? (((citizenReport.hargaWargaRp - currentPrice) / currentPrice) * 100).toFixed(1)
      : null;

  const acuanDiffPct =
    hasData && hargaAcuanRp && hargaAcuanRp > 0
      ? (((forecastPrice - hargaAcuanRp) / hargaAcuanRp) * 100).toFixed(1)
      : null;

  return (
    <aside className="space-y-4">
      {/* Header Wilayah & Status */}
      <section className="border-b border-[#DED8CD] pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#67151D]">
              <MapPin size={13} />
              Ringkasan &amp; Validasi Harga
            </div>
            <h2 className="mt-1 text-lg font-extrabold text-[#24231F]">{region}</h2>
            <p className="text-xs text-[#706B62]">
              {commodity} · Acuan {jenisAcuan} {hargaAcuanRp ? `${rupiah(hargaAcuanRp)}/${unit}` : "—"}
            </p>
          </div>

          <span
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${
              riskStyle[risk]
            }`}
          >
            {risk}
          </span>
        </div>

        {/* Sandingan: Harga Resmi Bapanas vs Harga Laporan Warga */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-[#DED8CD] bg-[#FFFDF7] p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#706B62]">
              Harga Resmi Bapanas
            </span>
            <p className="mt-1 font-mono text-base font-extrabold tabular-nums text-[#24231F]">
              {rupiah(currentPrice)}/{unit}
            </p>
            <span className="mt-0.5 block text-[10px] text-[#898277]">
              Panel Harga Bapanas
            </span>
          </div>

          <div
            className={`rounded-lg border p-2.5 ${
              isApprovedCitizen
                ? "border-[#287653]/30 bg-[#E3F0E7]/45"
                : "border-[#DED8CD] bg-[#F8F4E9]"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#24231F]">
                Harga Warga
              </span>
              {isApprovedCitizen ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#287653]">
                  <CheckCircle2 size={10} /> Terverifikasi
                </span>
              ) : citizenReport?.statusApproval === "pending" ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#96620A]">
                  <Clock size={10} /> Menunggu
                </span>
              ) : null}
            </div>

            {isApprovedCitizen && citizenReport ? (
              <>
                <p className="mt-1 font-mono text-base font-extrabold tabular-nums text-[#287653]">
                  {rupiah(citizenReport.hargaWargaRp)}/{unit}
                </p>
                <span className="mt-0.5 block truncate text-[10px] text-[#4D6655]">
                  {citizenReport.namaPasar} ({Number(citizenDiffPct) > 0 ? `+${citizenDiffPct}%` : `${citizenDiffPct}%`})
                </span>
              </>
            ) : citizenReport?.statusApproval === "pending" ? (
              <>
                <p className="mt-1 font-mono text-xs font-bold text-[#96620A]">
                  {rupiah(citizenReport.hargaWargaRp)} (Pending)
                </p>
                <Link
                  href="/dashboard/laporan-warga"
                  className="mt-0.5 inline-block text-[10px] font-bold text-[#67151D] underline"
                >
                  Setujui di Moderasi Warga →
                </Link>
              </>
            ) : (
              <>
                <p className="mt-1 font-mono text-xs font-semibold text-[#898277]">
                  Belum cukup laporan warga
                </p>
                <span className="mt-0.5 block text-[10px] text-[#898277]">
                  Minimal butuh 10 laporan
                </span>
              </>
            )}
          </div>
        </div>

        {/* Proyeksi H+7 Bersih Naratif */}
        <div className="mt-2.5 rounded-lg border border-[#67151D]/20 bg-[#F4E8E9]/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#67151D]">
              Proyeksi Harga H+7
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums text-[#B52D26]">
              <TrendingUp size={13} />
              {changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}% vs HAP
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <p className="font-mono text-xl font-extrabold tabular-nums text-[#67151D]">
              {rupiah(forecastPrice)}/{unit}
            </p>
            {multiWindow ? (
              <span className="font-mono text-[10px] text-[#706B62]">
                Baseline: {rupiah(multiWindow.baselineH7Rp)}
              </span>
            ) : acuanDiffPct ? (
              <span className="font-mono text-[10px] text-[#706B62]">
                Deviasi: {Number(acuanDiffPct) > 0 ? `+${acuanDiffPct}%` : `${acuanDiffPct}%`}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 text-[10px] leading-relaxed text-[#706B62] border-t border-[#DED8CD] pt-1.5">
            Estimasi pergerakan harga 7 hari ke depan dihitung berdasarkan tren historis resmi Bapanas.
          </p>
        </div>
      </section>

      {/* Top 5 Wilayah Tekanan Tertinggi (EWS Quick Shortcut) */}
      <section className="rounded-xl border border-[#DED8CD] bg-[#FFFDF7] p-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#24231F]">
            <Flame size={14} className="text-[#B52D26]" />
            <span>Top 5 Wilayah Tekanan Tertinggi</span>
          </div>
          <span className="text-[10px] font-bold text-[#898277]">
            vs Acuan HAP
          </span>
        </div>

        {topPressureRegions && topPressureRegions.length > 0 ? (
          <div className="mt-1.5 divide-y divide-[#F0ECE4]">
            {topPressureRegions.map((item, index) => {
              const isSelected = item.id === selectedRegionId;
              const isKritis = item.deviasiPct > 10;
              const isWaspada = item.deviasiPct > 5;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectRegion?.(item.id)}
                  className={`group flex w-full items-center justify-between py-2 px-2 text-left transition rounded-lg ${
                    isSelected
                      ? "bg-[#F4E8E9] border-l-3 border-[#67151D]"
                      : "hover:bg-[#F8F4E9]"
                  }`}
                  title={`Klik untuk fokus peta dan analisis ${item.name}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-mono font-bold ${
                        index === 0
                          ? "bg-[#B52D26] text-white"
                          : index === 1
                          ? "bg-[#DC4840] text-white"
                          : index === 2
                          ? "bg-[#E69B39] text-white"
                          : "bg-[#EAE5DC] text-[#625E56]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#24231F] group-hover:text-[#67151D]">
                        {item.name}
                      </p>
                      <p className="font-mono text-[10px] text-[#706B62]">
                        Rp{numberFormat.format(item.currentPriceRp)}/{unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span
                      className={`font-mono text-[11px] font-extrabold ${
                        isKritis
                          ? "text-[#B52D26]"
                          : isWaspada
                          ? "text-[#96620A]"
                          : "text-[#287653]"
                      }`}
                    >
                      {item.deviasiPct > 0 ? `+${item.deviasiPct}%` : `${item.deviasiPct}%`}
                    </span>
                    <ChevronRight
                      size={13}
                      className="text-[#898277] transition group-hover:translate-x-0.5 group-hover:text-[#67151D]"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-5 text-center text-xs text-[#706B62]">
            <p className="font-semibold text-[#24231F]">Tidak ada anomali harga signifikan di seluruh wilayah</p>
            <span className="text-[10px] text-[#898277]">Semua wilayah berada dalam rentang acuan normal</span>
          </div>
        )}
      </section>
    </aside>
  );
}
