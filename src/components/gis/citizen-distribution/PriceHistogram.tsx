'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildHistogram, formatRp } from '@/lib/citizen-distribution';

interface PriceHistogramProps {
  prices: number[];
  median: number;
  unit: string;
  provisional?: boolean;
  height?: number;
}

const PAD = { top: 32, right: 16, bottom: 32, left: 36 };

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

const shortRp = (v: number) =>
  v >= 1000 ? `${(v / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}00` : `${v}`;

/** Histogram SVG: interval harga (X) vs jumlah laporan (Y) sesuai acuan desain. */
export function PriceHistogram({
  prices,
  median,
  unit,
  provisional = false,
  height = 140,
}: PriceHistogramProps) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const bins = useMemo(() => buildHistogram(prices, median), [prices, median]);

  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = height - PAD.top - PAD.bottom;
  const maxCount = Math.max(4, ...bins.map((b) => b.count));

  // Domain X
  const single = bins.length === 1;
  const domainFrom = single ? bins[0].from - 500 : bins[0]?.from ?? 0;
  const domainTo = single ? bins[0].to + 500 : bins[bins.length - 1]?.to ?? 1;
  const x = (v: number) =>
    PAD.left + ((v - domainFrom) / Math.max(1, domainTo - domainFrom)) * innerW;
  const y = (c: number) => PAD.top + innerH - (c / maxCount) * innerH;

  const yTicks = [0, 1, 2, 3, 4];
  const edges = single ? [bins[0].from] : [...bins.map((b) => b.from), bins[bins.length - 1].to];

  const medianX = x(median);
  const hovered = hover !== null ? bins[hover] : null;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Histogram ${prices.length} laporan, median ${formatRp(median)}`}
        >
          {/* Gridline tipis & Y-axis ticks */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="#F0EEE8"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y(t) + 3}
                textAnchor="end"
                fontSize={9}
                fill="#77746C"
                className="font-mono"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Batang Histogram */}
          {bins.map((b, i) => {
            const bx = single
              ? x(b.from) - Math.min(30, innerW / 4) / 2
              : x(b.from) + 1;
            const bw = single
              ? Math.min(30, innerW / 4)
              : Math.max(2, x(b.to) - x(b.from) - 2);
            const fill = b.containsMedian
              ? '#791D2A'
              : provisional
              ? '#D5D5D0'
              : '#E2B1B6';

            return (
              <rect
                key={i}
                x={bx}
                y={y(b.count)}
                width={bw}
                height={Math.max(0, PAD.top + innerH - y(b.count))}
                fill={fill}
                rx={1}
                opacity={hover === null || hover === i ? 1 : 0.65}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <title>{`${formatRp(b.from)}–${formatRp(b.to)} · ${b.count} laporan`}</title>
              </rect>
            );
          })}

          {/* Sumbu X horizontal */}
          <line
            x1={PAD.left}
            x2={width - PAD.right}
            y1={PAD.top + innerH}
            y2={PAD.top + innerH}
            stroke="#E5E2DA"
            strokeWidth={1}
          />
          {edges.map((e) => (
            <text
              key={e}
              x={x(e)}
              y={PAD.top + innerH + 11}
              textAnchor="middle"
              fontSize={8.5}
              fill="#77746C"
              className="font-mono"
            >
              {shortRp(e)}
            </text>
          ))}

          {/* Sumbu X label */}
          <text
            x={PAD.left + innerW / 2}
            y={height - 2}
            textAnchor="middle"
            fontSize={9}
            fill="#77746C"
          >
            Harga (Rp/{unit})
          </text>

          {/* Sumbu Y label */}
          <text
            transform={`translate(10, ${PAD.top + innerH / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={8.5}
            fill="#77746C"
          >
            Jumlah Laporan
          </text>

          {/* Penanda & Tag Median di atas batang */}
          <line
            x1={medianX}
            x2={medianX}
            y1={PAD.top - 2}
            y2={PAD.top + innerH}
            stroke="#791D2A"
            strokeWidth={1.2}
            strokeDasharray="2,2"
          />

          <g
            transform={`translate(${Math.min(
              Math.max(medianX - 25, PAD.left),
              width - PAD.right - 50
            )}, ${PAD.top - 24})`}
          >
            <rect
              width="50"
              height="20"
              rx="4"
              fill="#FDE8E8"
              stroke="#F8B4B4"
              strokeWidth="0.8"
            />
            <text
              x="25"
              y="9"
              fill="#791D2A"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
            >
              {provisional ? 'Median Sem.' : 'Median'}
            </text>
            <text
              x="25"
              y="16"
              fill="#791D2A"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {formatRp(median)}
            </text>
          </g>
        </svg>
      )}

      {hovered && (
        <div className="pointer-events-none absolute right-2 top-0 rounded border border-[#E5E2DA] bg-white px-2 py-0.5 text-[10px] text-[#292824] shadow-sm">
          <span className="font-mono">
            {formatRp(hovered.from)}–{formatRp(hovered.to)}
          </span>{' '}
          · {hovered.count} laporan
        </div>
      )}
    </div>
  );
}
