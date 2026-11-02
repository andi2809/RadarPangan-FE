'use client';

import React from "react";
import type { MultiWindowAnalysis } from "../../../lib/engines/forecasting";

export interface PriceHistoryPoint {
  date: string;
  hargaRp: number;
}

export interface PriceForecastPoint {
  date: string;
  hargaPrediksiRp: number;
  confidenceLowerRp: number;
  confidenceUpperRp: number;
}

export interface PriceForecastChartProps {
  history: PriceHistoryPoint[];
  forecast: PriceForecastPoint[];
  hargaAcuanRp?: number;
  unit?: string;
  multiWindow?: MultiWindowAnalysis | null;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD_X = 28;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function formatRupiah(value: number) {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
}

export function PriceForecastChart({
  history,
  forecast,
  hargaAcuanRp,
  unit = "Rp/kg",
  multiWindow = null,
}: PriceForecastChartProps) {
  const hasData = history.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl border border-[#DED8CD] bg-white p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#24231F]">
          Blok 4 · Proyeksi Tren Harga Multi-Window
        </h4>
        <p className="mt-3 text-xs text-[#706B62]">
          Data historis belum tersedia untuk wilayah/komoditas ini.
        </p>
      </div>
    );
  }

  const series = [
    ...history.map((point) => ({
      date: point.date,
      value: point.hargaRp,
      lower: point.hargaRp,
      upper: point.hargaRp,
      isForecast: false,
    })),
    ...forecast.map((point) => ({
      date: point.date,
      value: point.hargaPrediksiRp,
      lower: point.confidenceLowerRp,
      upper: point.confidenceUpperRp,
      isForecast: true,
    })),
  ];

  const anomalyThresholdRp = multiWindow?.anomalyThresholdRp;

  const candidates = [
    ...series.map((point) => point.value),
    ...series.map((point) => point.lower),
    ...series.map((point) => point.upper),
    ...(hargaAcuanRp ? [hargaAcuanRp] : []),
    ...(anomalyThresholdRp ? [anomalyThresholdRp] : []),
  ];
  const minValue = Math.min(...candidates);
  const maxValue = Math.max(...candidates);
  const span = Math.max(1, maxValue - minValue);
  const minY = minValue - span * 0.08;
  const maxY = maxValue + span * 0.08;

  const innerWidth = WIDTH - PAD_X * 2;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xAt = (index: number) =>
    PAD_X + (series.length === 1 ? 0 : (index / (series.length - 1)) * innerWidth);
  const yAt = (value: number) =>
    PAD_TOP + ((maxY - value) / (maxY - minY)) * innerHeight;

  const actualPoints = series.filter((point) => !point.isForecast);
  const forecastPoints = series.filter((point) => point.isForecast);
  const forecastStartIndex = Math.max(0, actualPoints.length - 1);

  const actualPath = actualPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`)
    .join(" ");

  const forecastLinePoints = [
    ...(actualPoints.length > 0
      ? [{ value: actualPoints[actualPoints.length - 1].value }]
      : []),
    ...forecastPoints,
  ];
  const forecastPath = forecastLinePoints
    .map((point, index) => {
      const x = xAt(forecastStartIndex + index);
      return `${index === 0 ? "M" : "L"} ${x} ${yAt(point.value)}`;
    })
    .join(" ");

  const bandPoints = forecastPoints.length
    ? [
        ...forecastPoints.map((point, index) => ({
          x: xAt(forecastStartIndex + index + 1),
          y: yAt(point.upper),
        })),
        ...forecastPoints
          .slice()
          .reverse()
          .map((point, index) => ({
            x: xAt(forecastStartIndex + (forecastPoints.length - index)),
            y: yAt(point.lower),
          })),
      ]
    : [];
  const bandPath =
    bandPoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + (bandPoints.length ? " Z" : "");

  const labelIndices = [
    0,
    Math.floor((actualPoints.length - 1) / 2),
    Math.max(0, actualPoints.length - 1),
    series.length - 1,
  ].filter((value, index, array) => value >= 0 && array.indexOf(value) === index);

  return (
    <div className="space-y-3 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
            Blok 4 · Adaptive Multi-Window
          </span>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
            Riwayat H-14/30 &amp; Proyeksi H+7
          </h4>
        </div>
        <span className="font-mono text-[10px] font-semibold text-[#898277]">{unit}</span>
      </div>

      <div className="h-48 w-full">
        <svg className="h-full w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={PAD_TOP + innerHeight * ratio}
              y2={PAD_TOP + innerHeight * ratio}
              stroke="#F0ECE4"
              strokeWidth="1"
            />
          ))}

          {hargaAcuanRp ? (
            <>
              <line
                x1={PAD_X}
                x2={WIDTH - PAD_X}
                y1={yAt(hargaAcuanRp)}
                y2={yAt(hargaAcuanRp)}
                stroke="#287653"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <text
                x={PAD_X + 4}
                y={yAt(hargaAcuanRp) - 4}
                fontSize="9"
                fill="#287653"
                fontWeight="bold"
              >
                HET/HAP {formatRupiah(hargaAcuanRp)}
              </text>
            </>
          ) : null}

          {anomalyThresholdRp ? (
            <>
              <line
                x1={PAD_X}
                x2={WIDTH - PAD_X}
                y1={yAt(anomalyThresholdRp)}
                y2={yAt(anomalyThresholdRp)}
                stroke="#E85B4F"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text
                x={WIDTH - PAD_X - 4}
                y={yAt(anomalyThresholdRp) - 4}
                textAnchor="end"
                fontSize="9"
                fill="#B52D26"
              >
                Batas Anomali (μ+2σ): {formatRupiah(anomalyThresholdRp)}
              </text>
            </>
          ) : null}

          {bandPoints.length ? (
            <path d={bandPath} fill="#E85B4F" fillOpacity="0.12" stroke="none" />
          ) : null}

          <path
            d={actualPath}
            fill="none"
            stroke="#67151D"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {forecastPoints.length ? (
            <path
              d={forecastPath}
              fill="none"
              stroke="#67151D"
              strokeWidth="2.4"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
          ) : null}

          {actualPoints.map((point, index) => (
            <circle
              key={`actual-${point.date}`}
              cx={xAt(index)}
              cy={yAt(point.value)}
              r="2.6"
              fill="#67151D"
            />
          ))}

          {forecastPoints.map((point, index) => (
            <circle
              key={`forecast-${point.date}`}
              cx={xAt(forecastStartIndex + index + 1)}
              cy={yAt(point.value)}
              r="2.6"
              fill="#FFFDF7"
              stroke="#67151D"
              strokeWidth="1.6"
            />
          ))}

          {labelIndices.map((index) => {
            const point = series[index];
            return (
              <text
                key={`label-${index}`}
                x={xAt(index)}
                y={HEIGHT - 8}
                textAnchor={index === 0 ? "start" : index === series.length - 1 ? "end" : "middle"}
                fontSize="9"
                fill="#898277"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>
      </div>

      {multiWindow && (
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-2.5 font-mono text-[10px]">
          <div>
            <span className="block font-sans text-[9px] font-bold uppercase text-[#706B62]">
              Jendela 7H (MA_7)
            </span>
            <strong className="text-[#24231F]">{formatRupiah(multiWindow.ma7)}</strong>
            <span className="block text-[9px] text-[#67151D]">
              r = {multiWindow.dailyRatePct > 0 ? `+${multiWindow.dailyRatePct}%` : `${multiWindow.dailyRatePct}%`}/hr
            </span>
          </div>
          <div className="border-x border-[#DED8CD] px-2">
            <span className="block font-sans text-[9px] font-bold uppercase text-[#706B62]">
              Jendela 30H (MA_30)
            </span>
            <strong className="text-[#24231F]">{formatRupiah(multiWindow.ma30)}</strong>
            <span className="block text-[9px] text-[#706B62]">
              Dev: {multiWindow.deviasiMa30Pct > 0 ? `+${multiWindow.deviasiMa30Pct}%` : `${multiWindow.deviasiMa30Pct}%`}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[9px] font-bold uppercase text-[#706B62]">
              Jendela 60H (μ+2σ)
            </span>
            <strong className={multiWindow.isAnomalyExtreme ? "text-[#B52D26]" : "text-[#24231F]"}>
              {formatRupiah(multiWindow.anomalyThresholdRp)}
            </strong>
            <span className="block text-[9px] text-[#706B62]">
              μ={formatRupiah(multiWindow.mean60)} · σ={formatRupiah(multiWindow.stdDev60)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-[#F0ECE4] pt-2 text-[10px] text-[#706B62]">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3.5 bg-[#67151D]" /> Riwayat Aktual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3.5 border-t border-dashed border-[#67151D]" /> Proyeksi H+7
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3.5 border-t border-dashed border-[#287653]" /> Batas HET/HAP
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-3.5 rounded-sm bg-[#E85B4F]/15" /> Rentang Ketidakpastian
        </span>
      </div>
    </div>
  );
}
