import React from "react";
import type { PriceStatus } from "../../../types/domain";

export interface CommodityPriceRow {
  name: string;
  unit: string;
  currentPriceRp: number | null;
  forecastPriceRp: number | null;
  changePct: number | null;
  status: PriceStatus;
}

const statusLabel: Record<PriceStatus, string> = {
  aman: "Aman",
  waspada: "Waspada",
  kritis: "Kritis",
  turun: "Turun",
  tidak_ada_data: "Tanpa data",
};

const statusClass: Record<PriceStatus, string> = {
  aman: "text-[#287653]",
  waspada: "text-[#96620A]",
  kritis: "text-[#B52D26]",
  turun: "text-[#0369A1]",
  tidak_ada_data: "text-[#706B62]",
};

function formatRupiah(value: number | null) {
  if (value === null) return "—";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function CommodityPriceTable({
  items = [],
}: {
  items?: CommodityPriceRow[];
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#24231F]">
        Harga Komoditas Utama
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DED8CD] text-[10px] text-[#898277]">
              <th className="pb-1.5 font-semibold">Komoditas</th>
              <th className="pb-1.5 font-semibold">Harga</th>
              <th className="pb-1.5 font-semibold">Prediksi H+7</th>
              <th className="pb-1.5 text-right font-semibold">Perubahan</th>
              <th className="pb-1.5 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE4] text-[11px] font-medium">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-[#706B62]">
                  Data belum tersedia untuk wilayah ini.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const isUp = (row.changePct ?? 0) > 0;
                return (
                  <tr key={row.name}>
                    <td className="py-2.5 font-bold text-[#24231F]">
                      {row.name}
                      <span className="ml-1 text-[10px] font-normal text-[#898277]">
                        /{row.unit}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono tabular-nums">
                      {formatRupiah(row.currentPriceRp)}
                    </td>
                    <td className={`py-2.5 font-mono tabular-nums ${statusClass[row.status]}`}>
                      {formatRupiah(row.forecastPriceRp)}
                    </td>
                    <td
                      className={`py-2.5 text-right font-mono font-bold tabular-nums ${statusClass[row.status]}`}
                    >
                      {row.changePct === null
                        ? "—"
                        : `${isUp ? "↑ +" : "↓ "}${row.changePct.toFixed(1)}%`}
                    </td>
                    <td className={`py-2.5 text-right font-semibold ${statusClass[row.status]}`}>
                      {statusLabel[row.status]}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
