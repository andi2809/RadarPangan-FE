import Link from "next/link";
import { MapPinned, Clock3, Layers, ArrowRight } from "lucide-react";

export function GISPageHeader() {
  return (
    <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#67151D]">
          <MapPinned size={15} />
          Peta Kerawanan Pangan
        </div>

        <h1 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-[#24231F]">
          Peta Interaktif Harga & Kerawanan Pangan
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#706B62]">
          Pantau harga komoditas, proyeksi kenaikan H+7, dan
          risiko keterjangkauan pangan di setiap wilayah.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link
          href="/dashboard/gis"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#67151D] hover:bg-[#500F16] text-white px-4 py-2.5 text-xs font-bold transition shadow-sm group"
          title="Buka interface full command center website GIS"
        >
          <Layers size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
          <span>Buka Menu Detail GIS (Full Interface)</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs text-[#706B62]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F2EA] border border-[#DED8CD] font-mono text-[11px] text-[#24231F]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Pasar PIHPS: <strong>9/27</strong></span>
            <span className="text-[#898277]">|</span>
            <span>Daerah SP2KP: <strong>27/27</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Clock3 size={14} className="text-[#898277]" />
            <span>Sinkronisasi Otomatis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
