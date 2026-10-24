"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wheat,
  Map,
  ChartNoAxesCombined,
  Database,
  FileText,
  Utensils,
  ShieldCheck,
  FlaskConical,
  ChevronRight,
} from "lucide-react";

const menus = [
  {
    label: "Peta Kerawanan",
    items: [
      { label: "Peta Interaktif", href: "/dashboard", icon: Map },
      { label: "Data Wilayah", href: "/dashboard/wilayah", icon: Database },
      { label: "Riwayat & Tren", href: "/dashboard/tren", icon: ChartNoAxesCombined },
      { label: "Laporan", href: "/dashboard/laporan", icon: FileText },
    ],
  },
  {
    label: "Analisis Strategis",
    items: [
      { label: "Dapur MBG", href: "/dashboard/mbg", icon: Utensils },
      { label: "Audit Warga", href: "/dashboard/audit", icon: ShieldCheck },
      { label: "What-If Sandbox", href: "/dashboard/sandbox", icon: FlaskConical },
    ],
  },
];

export function GISSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#DED8CD] bg-[#FBF9F4] md:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 border-b border-[#DED8CD] px-5 py-6"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#74151C] text-white">
          <Wheat size={22} />
        </div>

        <div>
          <p className="text-sm font-extrabold tracking-tight text-[#24231F]">
            RADAR PANGAN
          </p>
          <p className="mt-1 text-[10px] text-[#777168]">
            GIS · EWS & DSS
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {menus.map((group) => (
          <div key={group.label}>
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#91897D]">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href === "/dashboard" && pathname === "/dashboard/gis") ||
                  (item.href === "/dashboard/gis" && pathname === "/dashboard");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                      active
                        ? "border-l-[3px] border-[#74151C] bg-[#F0E5E0] font-semibold text-[#74151C]"
                        : "text-[#625E56] hover:bg-[#F0ECE4]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight size={15} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#DED8CD] p-4">
        <p className="text-xs font-semibold text-[#24231F]">Sumber Data Terbuka</p>
        <p className="mt-1 text-xs text-[#777168]">
          Bapanas · BI · BPS · BIG
        </p>
      </div>
    </aside>
  );
}
