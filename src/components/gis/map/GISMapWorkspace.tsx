import type { ReactNode } from "react";
import { GISMapSection, GISMapSectionProps } from "./GISMapSection";

export interface GISMapWorkspaceProps extends Partial<GISMapSectionProps> {
  map: ReactNode;
  insight: ReactNode;
  commodity: string;
  setCommodity: (value: string) => void;
  period: "today" | "forecast";
  setPeriod: (value: "today" | "forecast") => void;
}

export function GISMapWorkspace({
  map,
  insight,
  commodity,
  setCommodity,
  period,
  setPeriod,
  selectedRegionId,
  onSelectRegion,
  viewScope,
  onSelectViewScope,
  showGisLink = true,
  dataSource,
  onSelectDataSource,
  activeRegionName,
  activeStatus,
  currentPriceRp,
  forecastPriceRp,
  umkBurdenPercent,
}: GISMapWorkspaceProps) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <GISMapSection
          map={map}
          commodity={commodity}
          setCommodity={setCommodity}
          period={period}
          setPeriod={setPeriod}
          selectedRegionId={selectedRegionId}
          onSelectRegion={onSelectRegion}
          viewScope={viewScope}
          onSelectViewScope={onSelectViewScope}
          showGisLink={showGisLink}
          dataSource={dataSource}
          onSelectDataSource={onSelectDataSource}
          activeRegionName={activeRegionName}
          activeStatus={activeStatus}
          currentPriceRp={currentPriceRp}
          forecastPriceRp={forecastPriceRp}
          umkBurdenPercent={umkBurdenPercent}
        />
      </div>

      <div className="min-w-0 rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm">
        {insight}
      </div>
    </section>
  );
}
