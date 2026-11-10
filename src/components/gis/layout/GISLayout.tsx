import type { ReactNode } from "react";
import { GISSidebar } from "./GISSidebar";

export function GISLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24231F]">
      <GISSidebar />

      <main className="min-h-screen min-w-0 md:ml-[248px] overflow-x-hidden overflow-y-visible">
        <div className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
