import React from "react";

export type StatusTone = "terkendali" | "waspada" | "kritis" | "neutral";

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

const toneMap: Record<StatusTone, string> = {
  terkendali: "bg-[#E3F0E7] text-[#287653] border-[#27815A]/20",
  waspada: "bg-[#FBF0D7] text-[#96620A] border-[#E9B949]/30",
  kritis: "bg-[#FBE7E4] text-[#B52D26] border-[#DC4840]/30",
  neutral: "bg-[#F0ECE4] text-[#706B62] border-[#DED8CD]",
};

export function StatusBadge({
  label,
  tone = "neutral",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${toneMap[tone]} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      <span>{label}</span>
    </span>
  );
}
