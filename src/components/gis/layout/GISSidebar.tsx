"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  ChartNoAxesCombined,
  ShieldCheck,
  FlaskConical,
  ChevronRight,
} from "lucide-react";
import { RadarPanganLogo } from "@/components/brand/RadarPanganLogo";

const menus = [
  {
    label: "Pemantauan",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Map },
      {
        label: "Riwayat Data",
        href: "/dashboard/wilayah",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    label: "Simulasi & Validasi",
    items: [
      { label: "Laporan Warga", href: "/dashboard/laporan-warga", icon: ShieldCheck },
      { label: "Sandbox", href: "/dashboard/sandbox", icon: FlaskConical },
    ],
  },
];

export function GISSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#DED8CD] bg-[#FBF9F4] md:flex">
      {/* Brand Header */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 border-b border-[#DED8CD] px-5 py-4 transition hover:bg-[#F0ECE4]"
      >
        <div className="flex items-center justify-center text-[#67151D] shrink-0">
          <RadarPanganLogo size={28} />
        </div>

        <div>
          <p className="text-sm font-black tracking-tight text-[#24231F] leading-none">
            RADAR PANGAN
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
            EWS &amp; DSS Jawa Barat
          </p>
        </div>
      </Link>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {menus.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#91897D]">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href === "/dashboard/laporan-warga" && pathname === "/dashboard/audit") ||
                  (item.href === "/dashboard/wilayah" && pathname === "/dashboard/tren");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition ${
                      active
                        ? "border-l-[3px] border-[#67151D] bg-[#F0E5E0] font-bold text-[#67151D]"
                        : "text-[#625E56] font-medium hover:bg-[#F0ECE4] hover:text-[#24231F]"
                    }`}
                  >
                    <Icon size={17} className={active ? "text-[#67151D]" : "text-[#777168]"} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight size={14} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-[#DED8CD] bg-[#F7F5EF]/80 p-4">
        <p className="text-xs font-bold text-[#24231F]">Sumber Data Terbuka</p>
        <p className="mt-1 text-[11px] text-[#777168]">
          Bapanas · JDIH &amp; Galura Jabar · BIG
        </p>
      </div>
    </aside>
  );
}
