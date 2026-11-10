import type { ReactNode } from "react";

type RegionDetailSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function RegionDetailSection({
  children,
}: RegionDetailSectionProps) {
  return (
    <section className="space-y-4 pt-1">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
