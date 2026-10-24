import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

export interface EarlyWarningScoreProps {
  score?: number;
  level?: "AMAN" | "WASPADA" | "KRITIS";
  deviationPercent?: number;
  umkBurdenPercent?: number;
}

export function EarlyWarningScore({
  score = 84.5,
  level = "KRITIS",
  deviationPercent = 14.8,
  umkBurdenPercent = 9.2,
}: EarlyWarningScoreProps) {
  return (
    <div className="rounded-xl border border-[#DED8CD] bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#24231F] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={15} className="text-[#DC4840]" />
          Indeks Peringatan Dini
        </span>
        <span className="rounded bg-[#FBE7E4] px-2 py-0.5 text-[10px] font-bold text-[#DC4840]">
          {level}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-extrabold text-[#DC4840]">
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-[#898277]">/ 100 skor risiko</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#F0ECE4] pt-2">
        <div>
          <p className="text-[10px] text-[#706B62]">Deviasi Acuan HAP</p>
          <p className="font-bold text-[#DC4840]">+{deviationPercent.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-[10px] text-[#706B62]">Beban Pengeluaran UMK</p>
          <p className="font-bold text-amber-600">{umkBurdenPercent.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
