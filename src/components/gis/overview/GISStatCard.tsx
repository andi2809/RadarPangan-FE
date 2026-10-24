import type { LucideIcon } from "lucide-react";
import { Map, Wheat, AlertTriangle, ShieldCheck } from "lucide-react";

type GISStatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "success";
};

const tones = {
  default: "text-[#74151C] bg-[#F0E5E0]",
  warning: "text-[#A96B08] bg-[#FBF0D7]",
  success: "text-[#287653] bg-[#E3F0E7]",
};

export function GISStatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "default",
}: GISStatCardProps) {
  return (
    <article className="min-w-0 border-l-2 border-[#DED8CD] pl-4 py-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className={tones[tone].split(" ")[0]} />
        <p className="text-xs font-medium text-[#706B62]">
          {label}
        </p>
      </div>

      <p className="mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-[#24231F]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#898277]">
        {description}
      </p>
    </article>
  );
}

export type StatItem = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "success";
};

const defaultStats: StatItem[] = [
  {
    label: "Total Wilayah",
    value: "514",
    description: "Kabupaten / kota",
    icon: Map,
  },
  {
    label: "Komoditas",
    value: "12",
    description: "Bahan pokok",
    icon: Wheat,
  },
  {
    label: "Risiko Tinggi",
    value: "48",
    description: "Wilayah terpantau",
    icon: AlertTriangle,
    tone: "warning" as const,
  },
  {
    label: "Wilayah Surplus",
    value: "97",
    description: "Wilayah terpantau",
    icon: ShieldCheck,
    tone: "success" as const,
  },
];

export function GISStatsSection({ stats = defaultStats }: { stats?: StatItem[] }) {
  return (
    <section className="grid grid-cols-2 gap-y-5 border-y border-[#DED8CD] py-5 md:grid-cols-4 md:gap-0">
      {stats.map((stat) => (
        <GISStatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
