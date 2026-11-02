import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  Truck,
  Users,
  CheckCircle2,
  Clock,
  Calculator,
} from "lucide-react";
import type { SupplyRoute } from "../../../types/domain";
import type { MultiWindowAnalysis } from "../../../lib/engines/forecasting";
import type { ApprovedCitizenReport } from "../../../utils/dual-source-store";

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
};

const riskStyle = {
  TERKENDALI: "bg-[#E3F0E7] text-[#287653] border border-[#287653]/25",
  WASPADA: "bg-[#FBF0D7] text-[#96620A] border border-[#E69B39]/35",
  KRITIS: "bg-[#FBE7E4] text-[#B52D26] border border-[#E85B4F]/35",
};

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
  supplyRoutes = [],
}: Partial<RegionInsightPanelProps>) {
  const isApprovedCitizen = citizenReport?.statusApproval === "approved";
  const citizenDiffPct =
    isApprovedCitizen && citizenReport && currentPrice > 0
      ? (((citizenReport.hargaWargaRp - currentPrice) / currentPrice) * 100).toFixed(1)
      : null;

  const acuanDiffPct =
    hasData && hargaAcuanRp && hargaAcuanRp > 0
      ? (((forecastPrice - hargaAcuanRp) / hargaAcuanRp) * 100).toFixed(1)
      : null;

  const primaryRoute = supplyRoutes[0];

  return (
    <aside className="space-y-4">
      {/* Header Wilayah & Status */}
      <section className="border-b border-[#DED8CD] pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#67151D]">
              <MapPin size={13} />
              Blok 2 · Komparasi Dual-Source
            </div>
            <h2 className="mt-1 text-lg font-extrabold text-[#24231F]">{region}</h2>
            <p className="text-xs text-[#706B62]">
              {commodity} · Acuan {jenisAcuan} {hargaAcuanRp ? `${rupiah(hargaAcuanRp)}/${unit}` : "—"}
            </p>
          </div>

          <span
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${
              hasData ? riskStyle[risk] : "bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            {hasData ? risk : "TANPA DATA"}
          </span>
        </div>

        {/* Sandingan Non-Destructive: Harga Resmi Instansi vs Harga Laporan Warga Terverifikasi */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-[#DED8CD] bg-[#FFFDF7] p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#706B62]">
              Harga Resmi Instansi
            </span>
            <p className="mt-1 font-mono text-base font-extrabold tabular-nums text-[#24231F]">
              {hasData ? `${rupiah(currentPrice)}/${unit}` : "Belum tersedia"}
            </p>
            <span className="mt-0.5 block text-[10px] text-[#898277]">
              Survei Bapanas / PIHPS
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
                  Belum ada kuorum
                </p>
                <span className="mt-0.5 block text-[10px] text-[#898277]">
                  Non-destructive pembanding
                </span>
              </>
            )}
          </div>
        </div>

        {/* Proyeksi H+7 & Selisih terhadap HET/HAP */}
        <div className="mt-2.5 rounded-lg border border-[#67151D]/20 bg-[#F4E8E9]/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#67151D]">
              Proyeksi Harga H+7 (P̂_t+7)
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums text-[#B52D26]">
              <TrendingUp size={13} />
              {hasData ? `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}% vs HET/HAP` : "—"}
            </span>
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <p className="font-mono text-xl font-extrabold tabular-nums text-[#67151D]">
              {hasData ? `${rupiah(forecastPrice)}/${unit}` : "—"}
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

          {multiWindow && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#DED8CD] pt-2 font-mono text-[10px] text-[#625E56]">
              <Calculator size={11} className="text-[#67151D]" />
              <span>
                r={multiWindow.dailyRatePct > 0 ? `+${multiWindow.dailyRatePct}%` : `${multiWindow.dailyRatePct}%`}/hr
              </span>
              <span>·</span>
              <span>M_musim={multiWindow.seasonalMultiplier.toFixed(2)}x</span>
              <span>·</span>
              <span>M_stok={multiWindow.stockMultiplier.toFixed(2)}x</span>
            </div>
          )}
          <p className="mt-1.5 text-[10px] leading-4 text-[#898277]">
            Prediksi H+7 dihitung dari riwayat harga resmi pemerintah. Laporan warga
            hanya menjadi pembanding lapangan, bukan input rumus prediksi.
          </p>
        </div>
      </section>

      {/* Rekomendasi Rute Distribusi Pasokan (Supply Matchmaker) */}
      <section className="rounded-lg border border-[#287653]/30 bg-[#EAF2EA] p-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-xs font-bold text-[#287653]">
            <Truck size={14} />
            Rekomendasi Rute Distribusi
          </h3>
          <span className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#287653]">
            Surplus → Defisit
          </span>
        </div>

        {primaryRoute ? (
          <div className="mt-2 space-y-1.5 text-xs">
            <p className="font-bold text-[#24231F]">
              Tarik pasokan dari <span className="text-[#287653]">{primaryRoute.sourceRegionName}</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 rounded bg-white/80 p-2 font-mono text-[10px] text-[#24231F]">
              <div>
                <span className="block text-[9px] text-[#706B62]">Jarak</span>
                <strong>{primaryRoute.jarakKm} km</strong>
              </div>
              <div>
                <span className="block text-[9px] text-[#706B62]">Waktu</span>
                <strong>~{primaryRoute.estimasiWaktuJam} jam</strong>
              </div>
              <div>
                <span className="block text-[9px] text-[#706B62]">Surplus</span>
                <strong>{primaryRoute.surplusAvailableTon} ton</strong>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#4D6655]">
            Pasokan wilayah terpantau kondusif atau wilayah ini merupakan sentra pemasok surplus bagi daerah sekitar.
          </p>
        )}
      </section>
    </aside>
  );
}
