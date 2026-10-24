import React from "react";
import { Users, Banknote } from "lucide-react";

export interface AffordabilityIndicatorProps {
  regionName?: string;
  population?: string;
  umkRp?: number;
  controlledPercentage?: number;
}

export function AffordabilityIndicator({
  regionName = "Kab. Bekasi",
  population = "3,0 juta jiwa",
  umkRp = 5500000,
  controlledPercentage = 68.4,
}: AffordabilityIndicatorProps) {
  return (
    <div className="rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#24231F] uppercase tracking-wider">
          Daya Beli & Keterjangkauan
        </h3>
        <span className="rounded bg-[#DC4840] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
          Kritis
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <span className="text-[#706B62] flex items-center gap-1.5">
            <Users size={14} className="text-[#898277]" />
            Populasi Terdampak
          </span>
          <span className="font-bold text-[#24231F]">{population}</span>
        </div>

        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
          <span className="text-[#706B62] flex items-center gap-1.5">
            <Banknote size={14} className="text-[#898277]" />
            Standar UMK 2026
          </span>
          <span className="font-mono font-bold text-[#24231F]">
            Rp {umkRp.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[#706B62]">Status Wilayah Terkendali</span>
          <span className="font-mono font-bold text-[#27815A]">
            {controlledPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
