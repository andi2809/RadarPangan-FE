import Link from "next/link";
import { MapPinned, Layers, ArrowRight } from "lucide-react";

export function GISPageHeader() {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#67151D]">
          <MapPinned size={15} />
          Peta Kerawanan Pangan
        </div>

        <h1 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
          Peta Interaktif Harga & Kerawanan Pangan
        </h1>

        <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#706B62]">
          Pantau harga komoditas, proyeksi kenaikan H+7, dan risiko keterjangkauan pangan di setiap wilayah.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/gis"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#67151D] hover:bg-[#500F16] text-white px-4 py-2.5 text-xs font-bold transition shadow-sm group"
          title="Buka interface full command center website GIS"
        >
          <Layers size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
          <span>Buka Menu Detail GIS (Full Interface)</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
