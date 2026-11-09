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
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#DED8CD] bg-[#F0EBDE] px-3 py-2 text-[10px] text-[#706B62]">
            <span className="rounded-full bg-[#FFFDF7] px-2 py-0.5 font-bold uppercase tracking-wide text-[#67151D]">
              Data demo
            </span>
            <span>Angka bersifat ilustratif untuk demonstrasi. Sumber data acuan: Panel Harga Bapanas, JDIH &amp; Galura Jabarprov.</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
