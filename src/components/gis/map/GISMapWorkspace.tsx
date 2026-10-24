import type { ReactNode } from "react";
import { GISMapSection } from "./GISMapSection";

type GISMapWorkspaceProps = {
  map: ReactNode;
  insight: ReactNode;
  commodity: string;
  setCommodity: (value: string) => void;
  period: "today" | "forecast";
  setPeriod: (value: "today" | "forecast") => void;
};

export function GISMapWorkspace({
  map,
  insight,
  commodity,
  setCommodity,
  period,
  setPeriod,
}: GISMapWorkspaceProps) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <GISMapSection
          map={map}
          commodity={commodity}
          setCommodity={setCommodity}
          period={period}
          setPeriod={setPeriod}
        />
      </div>

      <div className="min-w-0 rounded-xl border border-[#DED8CD] bg-white p-5">
        {insight}
      </div>
    </section>
  );
}
