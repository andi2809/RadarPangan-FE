import React from "react";

export interface CommodityPriceRow {
  name: string;
  currentPriceRp: number;
  forecastPriceRp: number;
  changePct: number;
  status: "surplus" | "waspada" | "kritis";
}

const defaultRows: CommodityPriceRow[] = [
  {
    name: "Cabai Rawit Merah",
    currentPriceRp: 78200,
    forecastPriceRp: 88600,
    changePct: 8.7,
    status: "kritis",
  },
  {
    name: "Bawang Merah",
    currentPriceRp: 32000,
    forecastPriceRp: 31500,
    changePct: -1.6,
    status: "surplus",
  },
  {
    name: "Beras Premium",
    currentPriceRp: 14800,
    forecastPriceRp: 15200,
    changePct: 2.7,
    status: "waspada",
  },
];

export function CommodityPriceTable({
  items = defaultRows,
}: {
  items?: CommodityPriceRow[];
}) {
  return (
    <div className="rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-xs font-bold text-[#24231F] uppercase tracking-wider">
        Harga Komoditas Utama
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DED8CD] text-[10px] text-[#898277]">
              <th className="pb-1.5 font-semibold">Komoditas</th>
              <th className="pb-1.5 font-semibold">Harga</th>
              <th className="pb-1.5 font-semibold">Prediksi H+7</th>
              <th className="pb-1.5 font-semibold text-right">Perubahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0ECE4] text-[11px] font-medium">
            {items.map((row) => {
              const isUp = row.changePct > 0;
              const color =
                row.status === "kritis"
                  ? "text-[#DC4840]"
                  : row.status === "surplus"
                  ? "text-[#27815A]"
                  : "text-[#E9B949]";

              return (
                <tr key={row.name}>
                  <td className="py-2.5 font-bold text-[#24231F]">{row.name}</td>
                  <td className="py-2.5 font-mono">
                    Rp {row.currentPriceRp.toLocaleString("id-ID")}
                  </td>
                  <td className={`py-2.5 font-mono ${color}`}>
                    Rp {row.forecastPriceRp.toLocaleString("id-ID")}
                  </td>
                  <td className={`py-2.5 font-mono text-right font-bold ${color}`}>
                    {isUp ? "↑ +" : "↓ "}
                    {row.changePct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
