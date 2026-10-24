import React from "react";
import { GISMapToolbar, GISMapToolbarProps } from "./GISMapToolbar";
import { GISMapLegend } from "./GISMapLegend";
import { AlertCircle, ShieldAlert, CheckCircle2, TrendingUp, Info } from "lucide-react";

export interface GISMapSectionProps extends GISMapToolbarProps {
  map: React.ReactNode;
  activeRegionName?: string;
  activeStatus?: "terkendali" | "waspada" | "kritis";
  currentPriceRp?: number;
  forecastPriceRp?: number;
  umkBurdenPercent?: number;
  statusKeterangan?: string;
}

export function GISMapSection({
  map,
  commodity,
  setCommodity,
  period,
  setPeriod,
  selectedRegionId,
  onSelectRegion,
  viewScope,
  onSelectViewScope,
  showGisLink = true,
  activeRegionName = "Kab. Bekasi",
  activeStatus = "kritis",
  currentPriceRp = 48200,
  forecastPriceRp = 50400,
  umkBurdenPercent = 9.2,
}: GISMapSectionProps) {
  const isKritis = activeStatus === "kritis";
  const isWaspada = activeStatus === "waspada";

  const statusConfig = isKritis
    ? {
        label: "KRITIS — EWS LEVEL 3",
        badgeClass: "bg-[#FBE7E4] text-[#DC4840] border-[#DC4840]/30",
        icon: ShieldAlert,
        summary: "Terdeteksi potensi defisit akut & lonjakan harga signifikan di atas HAP.",
      }
    : isWaspada
    ? {
        label: "WASPADA — EWS LEVEL 2",
        badgeClass: "bg-[#FBF0D7] text-[#96620A] border-[#E9B949]/40",
        icon: AlertCircle,
        summary: "Fluktuasi harga mendekati ambang batas batas toleransi stabilitas pangan.",
      }
    : {
        label: "TERKENDALI — SURPLUS",
        badgeClass: "bg-[#E3F0E7] text-[#287653] border-[#27815A]/30",
        icon: CheckCircle2,
        summary: "Pasokan stabil, harga berada dalam rentang acuan penjualan pemerintah.",
      };

  const StatusIcon = statusConfig.icon;

  return (
    <section className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
      {/* 1. Toolbar Kontrol Peta & Filter Wilayah */}
      <div className="p-4 sm:p-5 bg-[#FBF9F4]">
        <GISMapToolbar
          commodity={commodity}
          setCommodity={setCommodity}
          period={period}
          setPeriod={setPeriod}
          selectedRegionId={selectedRegionId}
          onSelectRegion={onSelectRegion}
          viewScope={viewScope}
          onSelectViewScope={onSelectViewScope}
          showGisLink={showGisLink}
        />
      </div>

      {/* 2. STATUS EWS PANGAN DI LUAR PETA INTERAKTIF (Point 5) */}
      <div className="border-y border-[#DED8CD] bg-[#FFFDF7] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Label & Wilayah */}
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wide ${statusConfig.badgeClass}`}
            >
              <StatusIcon size={14} />
              <span>{statusConfig.label}</span>
            </span>

            <span className="text-sm font-extrabold text-[#24231F]">
              {activeRegionName}
            </span>
          </div>

          {/* Key Metrics Outside Map (Never Hidden on Map Zoom/Pan) */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#898277] text-[10px] block">Harga Riil:</span>
              <strong className="text-[#24231F]">
                Rp {currentPriceRp.toLocaleString("id-ID")}/kg
              </strong>
            </div>

            <div className="border-l border-[#DED8CD] pl-3">
              <span className="text-[#898277] text-[10px] block">Proyeksi H+7:</span>
              <strong className={isKritis ? "text-[#DC4840]" : "text-[#24231F]"}>
                Rp {forecastPriceRp.toLocaleString("id-ID")}/kg
              </strong>
            </div>

            <div className="border-l border-[#DED8CD] pl-3">
              <span className="text-[#898277] text-[10px] block">Beban UMK:</span>
              <strong className="text-amber-700">{umkBurdenPercent.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAP CANVAS CONTAINER */}
      <div className="relative h-[420px] bg-[#F0ECE4] sm:h-[500px] lg:h-[560px]">
        {map}
      </div>

      {/* 4. FOOTER DENGAN LEGENDA RESMI */}
      <div className="border-t border-[#DED8CD] px-4 py-3 sm:px-5 bg-[#FBF9F4]">
        <GISMapLegend />
      </div>
    </section>
  );
}
