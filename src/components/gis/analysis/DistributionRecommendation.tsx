import React from "react";
import { Truck, ArrowRight } from "lucide-react";

export interface DistributionRecommendationProps {
  sourceRegion?: string;
  targetRegion?: string;
  commodity?: string;
  tonnage?: number;
  estCostRp?: number;
}

export function DistributionRecommendation({
  sourceRegion = "Kab. Garut (Surplus)",
  targetRegion = "Kota Bekasi (Defisit)",
  commodity = "Cabai Rawit Merah",
  tonnage = 8,
  estCostRp = 14500000,
}: DistributionRecommendationProps) {
  return (
    <div className="rounded-xl border border-[#27815A]/30 bg-[#E3F0E7] p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#27815A]">
        <Truck size={16} />
        <span>Rekomendasi Distribusi Intervensi</span>
      </div>

      <p className="text-xs leading-relaxed text-[#1B5B3F]">
        Mobilisasi cadangan pangan sebesar <strong>{tonnage} Ton {commodity}</strong> dari <strong>{sourceRegion}</strong> menuju <strong>{targetRegion}</strong>.
      </p>

      <div className="flex items-center justify-between border-t border-[#27815A]/20 pt-2 text-xs">
        <span className="text-[#4D6655] text-[11px]">Estimasi Subsidi Logistik:</span>
        <span className="font-mono font-bold text-[#1B5B3F]">
          Rp {estCostRp.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}
