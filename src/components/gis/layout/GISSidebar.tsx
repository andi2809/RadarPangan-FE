"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wheat,
  Map,
  ChartNoAxesCombined,
  FileText,
  ShieldCheck,
  FlaskConical,
  ChevronRight,
} from "lucide-react";

const menus = [
  {
    label: "Peta & Pemantauan",
    items: [
      { label: "Dashboard GIS & EWS H+7", href: "/dashboard", icon: Map },
      {
        label: "Eksplorasi & Riwayat Wilayah",
        href: "/dashboard/wilayah",
        icon: ChartNoAxesCombined,
      },
      { label: "Template Laporan TPID", href: "/dashboard/laporan", icon: FileText },
    ],
  },
  {
    label: "Validasi & Simulasi",
    items: [
      { label: "Approval Laporan Warga", href: "/dashboard/laporan-warga", icon: ShieldCheck },
      { label: "What-If Sandbox", href: "/dashboard/sandbox", icon: FlaskConical },
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
        className="flex items-center gap-3 border-b border-[#DED8CD] px-5 py-5 transition hover:bg-[#F0ECE4]"
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#67151D] text-white shadow-sm">
          <Wheat size={22} />
        </div>

        <div>
          <p className="text-sm font-extrabold tracking-tight text-[#24231F]">
            RADAR PANGAN
          </p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
            GIS · EWS &amp; DSS JABAR
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
          Bapanas · Bank Indonesia · BPS · BIG
        </p>
      </div>
    </aside>
  );
}
