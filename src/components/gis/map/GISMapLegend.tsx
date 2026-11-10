import React from "react";

const legend = [
  {
    color: "#729B82",
    title: "Normal",
    range: "≤ +5% acuan",
  },
  {
    color: "#D6B45F",
    title: "Perlu Perhatian",
    range: "+5% s.d. +10%",
  },
  {
    color: "#B85C52",
    title: "Tekanan Tinggi",
    range: "> +10% acuan",
  },
  {
    color: "#D5D5D0",
    title: "Tidak ada data",
    range: "Belum tersedia",
  },
];

export function GISMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="text-xs font-bold uppercase tracking-wide text-[#77746C]">
        Tingkat Risiko
      </span>

      {legend.map((item) => (
        <div key={item.title} className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />

          <div>
            <p className="text-xs font-semibold text-[#292824]">{item.title}</p>
            <p className="text-[10px] text-[#77746C]">
              {item.range}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
