import React from "react";
import {
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Truck,
} from "lucide-react";

export type RegionInsightPanelProps = {
  region: string;
  commodity: string;
  currentPrice: number;
  forecastPrice: number;
  changePercent: number;
  risk: "TERKENDALI" | "WASPADA" | "KRITIS";
};

const riskStyle = {
  TERKENDALI: "bg-[#E3F0E7] text-[#287653]",
  WASPADA: "bg-[#FBF0D7] text-[#96620A]",
  KRITIS: "bg-[#FBE7E4] text-[#B52D26]",
};

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function RegionInsightPanel({
  region = "Kab. Bekasi",
  commodity = "Cabai Rawit Merah",
  currentPrice = 78200,
  forecastPrice = 88600,
  changePercent = 8.7,
  risk = "KRITIS",
}: Partial<RegionInsightPanelProps>) {
  return (
    <aside className="space-y-5">
      <section className="border-b border-[#DED8CD] pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#777168]">
              <MapPin size={14} />
              Wilayah Terpilih
            </div>

            <h2 className="mt-2 text-lg font-bold text-[#24231F]">{region}</h2>
            <p className="mt-1 text-xs text-[#777168]">
              {commodity}
            </p>
          </div>

          <span
            className={`rounded-md px-2 py-1 text-[10px] font-bold ${riskStyle[risk]}`}
          >
            {risk}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#777168]">Harga saat ini</p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-[#24231F]">
              {rupiah(currentPrice)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#777168]">Prediksi H+7</p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums text-[#B52D26]">
              {rupiah(forecastPrice)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#B52D26]">
          <TrendingUp size={16} />
          <span>{changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%</span>
          <span className="text-xs font-normal text-[#898277]">
            proyeksi perubahan
          </span>
        </div>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#24231F]">
          <ArrowUpRight size={16} />
          Implikasi Harga
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#706B62]">
          Bandingkan tren historis, proyeksi, dan kondisi daya beli
          sebelum menentukan tindak lanjut.
        </p>
      </section>

      <section className="border-l-2 border-[#287653] bg-[#EAF2EA] p-4 rounded-r">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#287653]">
          <Truck size={16} />
          Arah Distribusi
        </h3>
        <p className="mt-2 text-xs leading-5 text-[#4D6655]">
          Periksa ketersediaan pasokan dari wilayah surplus dan
          kelayakan rute sebelum menetapkan rekomendasi distribusi.
        </p>
      </section>
    </aside>
  );
}
