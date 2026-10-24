'use client';

import React from "react";

export interface PriceForecastChartProps {
  dates?: string[];
  actualPrices?: number[];
  forecastPrices?: number[];
  unit?: string;
}

export function PriceForecastChart({
  dates = ["10 Okt", "14 Okt", "18 Okt", "22 Okt"],
  actualPrices = [72000, 74500, 78200],
  forecastPrices = [78200, 88600],
  unit = "Rp/kg",
}: PriceForecastChartProps) {
  return (
    <div className="rounded-xl border border-[#DED8CD] bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#24231F] uppercase tracking-wider">
          Proyeksi Tren Harga
        </h4>
        <span className="text-[10px] text-[#898277]">{unit}</span>
      </div>

      <div className="h-28 flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 280 80">
          <line x1="0" y1="20" x2="280" y2="20" stroke="#F0ECE4" strokeWidth="1" />
          <line x1="0" y1="50" x2="280" y2="50" stroke="#F0ECE4" strokeWidth="1" />
          
          {/* Actual Line */}
          <path d="M 20,65 L 100,50 L 180,35" fill="none" stroke="#DC4840" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="65" r="3.5" fill="#DC4840" />
          <circle cx="100" cy="50" r="3.5" fill="#DC4840" />
          <circle cx="180" cy="35" r="3.5" fill="#DC4840" />

          {/* Forecast Line */}
          <path d="M 180,35 L 260,15" fill="none" stroke="#DC4840" strokeWidth="2.5" strokeDasharray="4,4" strokeLinecap="round" />
          <circle cx="260" cy="15" r="3.5" fill="#DC4840" />

          {dates.map((d, i) => (
            <text key={d} x={20 + i * 80} y="78" textAnchor="middle" fontSize="9" fill="#898277">
              {d}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-[#706B62] border-t border-[#F0ECE4] pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#DC4840]" /> Harga Riil
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t border-dashed border-[#DC4840]" /> Proyeksi H+7
        </span>
      </div>
    </div>
  );
}
