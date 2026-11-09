'use client';

import React from 'react';
import type { MultiWindowAnalysis } from '../../../lib/engines/forecasting';

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
  title?: string;
  subtitle?: string;
  regionName?: string;
  periodDays?: number;
  showCardWrapper?: boolean;
}

const WIDTH = 640;
const HEIGHT = 260;
const PAD_LEFT = 56;
const PAD_RIGHT = 24;
const PAD_TOP = 20;
const PAD_BOTTOM = 36;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function formatRupiah(value: number) {
  return `Rp${Math.round(value).toLocaleString('id-ID')}`;
}

function getNiceTicks(min: number, max: number, count = 5): number[] {
  const range = Math.max(100, max - min);
  const rawStep = range / Math.max(1, count - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;

  let niceStep = magnitude;
  if (residual > 5) niceStep = 10 * magnitude;
  else if (residual > 2) niceStep = 5 * magnitude;
  else if (residual > 1) niceStep = 2 * magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let val = niceMin; val <= niceMax + niceStep * 0.1; val += niceStep) {
    ticks.push(val);
  }
  return ticks.length >= 3 ? ticks : [min, (min + max) / 2, max];
}

export function PriceForecastChart({
  history,
  forecast,
  hargaAcuanRp,
  unit = 'Rp/kg',
  multiWindow = null,
  title,
  subtitle,
  regionName,
  periodDays = 30,
  showCardWrapper = true,
}: PriceForecastChartProps) {
  const hasData = history.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl border border-[#DED8CD] bg-white p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#24231F]">
          Riwayat Harga dan Estimasi H+7 - {regionName || 'Jawa Barat'}
        </h4>
        <p className="mt-3 text-xs text-[#706B62]">
          Data historis belum tersedia untuk wilayah atau komoditas ini.
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
  const rawMin = Math.min(...candidates);
  const rawMax = Math.max(...candidates);

  const ticks = getNiceTicks(rawMin, rawMax, 5);
  const minY = ticks[0];
  const maxY = ticks[ticks.length - 1];

  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xAt = (index: number) =>
    PAD_LEFT + (series.length === 1 ? 0 : (index / (series.length - 1)) * innerWidth);
  const yAt = (value: number) =>
    PAD_TOP + ((maxY - value) / Math.max(1, maxY - minY)) * innerHeight;

  const actualPoints = series.filter((point) => !point.isForecast);
  const forecastPoints = series.filter((point) => point.isForecast);
  const forecastStartIndex = Math.max(0, actualPoints.length - 1);

  const actualPath = actualPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(point.value)}`)
    .join(' ');

  const forecastLinePoints = [
    ...(actualPoints.length > 0
      ? [{ value: actualPoints[actualPoints.length - 1].value }]
      : []),
    ...forecastPoints,
  ];
  const forecastPath = forecastLinePoints
    .map((point, index) => {
      const x = xAt(forecastStartIndex + index);
      return `${index === 0 ? 'M' : 'L'} ${x} ${yAt(point.value)}`;
    })
    .join(' ');

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
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + (bandPoints.length ? ' Z' : '');

  // 4 evenly spaced date labels along X-axis
  const labelIndices = [
    0,
    Math.floor((actualPoints.length - 1) / 3),
    Math.floor(((actualPoints.length - 1) * 2) / 3),
    series.length - 1,
  ].filter((value, index, array) => value >= 0 && array.indexOf(value) === index);

  const chartContent = (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-start justify-between border-b border-[#F0ECE4] pb-3">
        <div>
          <h3 className="text-base font-extrabold text-[#24231F]">
            {title || `Riwayat Harga dan Estimasi H+7 - ${regionName || 'Kab. Cirebon'}`}
          </h3>
          <p className="mt-0.5 text-xs text-[#706B62]">
            {subtitle ||
              `Perkembangan harga ${periodDays} hari terakhir dan estimasi 7 hari ke depan.`}
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-[#706B62]">{unit}</span>
      </div>

      {/* SVG Chart */}
      <div className="w-full">
        <svg
          className="w-full h-auto"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          style={{ maxHeight: '280px' }}
        >
          {/* Horizontal Gridlines & Y-Axis Numeric Labels */}
          {ticks.map((tick) => {
            const y = yAt(tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD_LEFT}
                  x2={WIDTH - PAD_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="#F0ECE4"
                  strokeWidth="1"
                />
                <text
                  x={PAD_LEFT - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#706B62"
                  fontFamily="sans-serif"
                >
                  {Math.round(tick).toLocaleString('id-ID')}
                </text>
              </g>
            );
          })}

          {/* Reference Price Horizontal Dashed Line (HET/HAP) */}
          {hargaAcuanRp && (
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yAt(hargaAcuanRp)}
              y2={yAt(hargaAcuanRp)}
              stroke="#287653"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          )}

          {/* Uncertainty Range Shaded Band */}
          {bandPoints.length ? (
            <path d={bandPath} fill="#E85B4F" fillOpacity="0.10" stroke="none" />
          ) : null}

          {/* Actual Observed Price Curve (Solid Burgundy) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#67151D"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecast Line Curve (Dashed Burgundy) */}
          {forecastPoints.length ? (
            <path
              d={forecastPath}
              fill="none"
              stroke="#67151D"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          ) : null}

          {/* X-Axis Date Labels */}
          {labelIndices.map((index) => {
            const point = series[index];
            if (!point) return null;
            return (
              <text
                key={`label-${index}`}
                x={xAt(index)}
                y={HEIGHT - 10}
                textAnchor={
                  index === 0
                    ? 'start'
                    : index === series.length - 1
                    ? 'end'
                    : 'middle'
                }
                fontSize="10"
                fill="#706B62"
                fontFamily="sans-serif"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend Matching Reference Image */}
      <div className="flex flex-wrap items-center gap-5 border-t border-[#F0ECE4] pt-3 text-xs text-[#706B62]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#67151D]" />
          <span>Harga observasi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#67151D]" />
          <span>Estimasi H+7</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#287653]" />
          <span>Batas acuan (HAP/HET)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-4 rounded-sm bg-[#E85B4F]/20" />
          <span>Rentang ketidakpastian</span>
        </div>
      </div>
    </div>
  );

  if (!showCardWrapper) {
    return chartContent;
  }

  return (
    <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm">
      {chartContent}
    </div>
  );
}
