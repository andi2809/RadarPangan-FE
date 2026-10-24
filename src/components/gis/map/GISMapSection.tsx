import React from "react";
import { GISMapToolbar } from "./GISMapToolbar";
import { GISMapLegend } from "./GISMapLegend";

type GISMapSectionProps = {
  map: React.ReactNode;
  commodity: string;
  setCommodity: (value: string) => void;
  period: "today" | "forecast";
  setPeriod: (value: "today" | "forecast") => void;
};

export function GISMapSection({
  map,
  commodity,
  setCommodity,
  period,
  setPeriod,
}: GISMapSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white">
      <div className="p-4 sm:p-5">
        <GISMapToolbar
          commodity={commodity}
          setCommodity={setCommodity}
          period={period}
          setPeriod={setPeriod}
        />
      </div>

      <div className="relative h-[420px] bg-[#F0ECE4] sm:h-[520px] lg:h-[640px]">
        {map}
      </div>

      <div className="border-t border-[#DED8CD] px-4 py-4 sm:px-5">
        <GISMapLegend />
      </div>
    </section>
  );
}
