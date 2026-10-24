import { MapPinned, Clock3 } from "lucide-react";

export function GISPageHeader() {
  return (
    <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#74151C]">
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

      <div className="flex items-center gap-2 text-xs text-[#706B62]">
        <Clock3 size={15} />
        <span>Data diperbarui sesuai sumber resmi</span>
      </div>
    </section>
  );
}
