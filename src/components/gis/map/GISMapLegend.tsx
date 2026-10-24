import React from "react";

const legend = [
  {
    color: "#27815A",
    title: "Terkendali / Surplus",
    range: "0–5%",
  },
  {
    color: "#E9B949",
    title: "Waspada",
    range: "5–10%",
  },
  {
    color: "#DC4840",
    title: "Rentan / Defisit",
    range: ">10%",
  },
  {
    color: "#A8A29E",
    title: "Tidak ada data",
    range: "N/A",
  },
];

export function GISMapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="text-xs font-bold uppercase tracking-wide text-[#706B62]">
        Tingkat Risiko
      </span>

      {legend.map((item) => (
        <div key={item.title} className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />

          <div>
            <p className="text-xs font-semibold text-[#24231F]">{item.title}</p>
            <p className="text-[10px] text-[#898277]">
              {item.range}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
