import type { ReactNode } from "react";

type RegionDetailSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function RegionDetailSection({
  title,
  description,
  children,
}: RegionDetailSectionProps) {
  return (
    <section className="space-y-5 border-t border-[#DED8CD] pt-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#67151D]">
          Eksplorasi Wilayah
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl text-[#24231F]">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777168]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
