"use client";

type GISMapToolbarProps = {
  commodity: string;
  setCommodity: (value: string) => void;
  period: "today" | "forecast";
  setPeriod: (value: "today" | "forecast") => void;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
};

export function GISMapToolbar({
  commodity,
  setCommodity,
  period,
  setPeriod,
  searchQuery,
  setSearchQuery,
}: GISMapToolbarProps) {
  return (
    <section className="flex flex-col gap-3 border-b border-[#DED8CD] pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-[#706B62]">
            Komoditas
          </span>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#D8D1C5] bg-white px-3 text-sm outline-none focus:border-[#74151C]"
          >
            <option value="bawang-merah">Bawang Merah</option>
            <option value="cabai-rawit">Cabai Rawit Merah</option>
            <option value="beras">Beras Premium</option>
            <option value="minyak-goreng">Minyak Goreng</option>
          </select>
        </label>

        <div>
          <span className="mb-2 block text-xs font-semibold text-[#706B62]">
            Periode Data
          </span>

          <div className="flex h-11 rounded-lg border border-[#D8D1C5] bg-white p-1">
            {[
              { value: "today", label: "Hari Ini" },
              { value: "forecast", label: "Prediksi H+7" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() =>
                  setPeriod(item.value as "today" | "forecast")
                }
                className={`flex-1 rounded-md px-3 text-xs font-semibold transition ${
                  period === item.value
                    ? "bg-[#74151C] text-white"
                    : "text-[#706B62] hover:bg-[#F2EEE7]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
