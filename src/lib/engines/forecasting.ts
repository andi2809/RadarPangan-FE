import { EwsPrediction, PriceStatus, RiskLevel, SupplyStatus } from '../../types/domain';

export type SeasonalScenario = 'normal' | 'lebaran' | 'cuaca_ekstrem';

export const SEASONAL_MULTIPLIERS: Record<
  SeasonalScenario,
  { multiplier: number; label: string; shortLabel: string }
> = {
  normal: { multiplier: 1.0, label: 'Normal (1,00x)', shortLabel: 'Normal' },
  lebaran: { multiplier: 1.15, label: 'H-7 Lebaran (1,15x)', shortLabel: 'H-7 Lebaran' },
  cuaca_ekstrem: { multiplier: 1.08, label: 'Cuaca Ekstrem (1,08x)', shortLabel: 'Cuaca Ekstrem' },
};

export const STOCK_MULTIPLIERS: Record<SupplyStatus, number> = {
  surplus: 0.95,
  seimbang: 1.0,
  defisit: 1.1,
};

export interface ForecastPoint {
  day: number; // 1 to 7
  date: string;
  hargaPrediksiRp: number;
  confidenceLowerRp: number;
  confidenceUpperRp: number;
  selisihPersen: number;
  status: PriceStatus;
}

export interface MultiWindowAnalysis {
  pt: number;
  ptMinus7: number;
  dailyRateR: number;
  dailyRatePct: number;
  ma7: number;
  ma30: number;
  mean60: number;
  stdDev60: number;
  anomalyThresholdRp: number;
  deviasiMa30Pct: number;
  isAnomalyExtreme: boolean;
  baselineH7Rp: number;
  seasonalScenario: SeasonalScenario;
  seasonalMultiplier: number;
  supplyStatus: SupplyStatus;
  stockMultiplier: number;
  exactCalibratedH7Rp: number;
  calibratedH7Rp: number;
  kenaikanH7Pct: number;
}

export interface ForecastOptions {
  seasonalScenario?: SeasonalScenario;
  supplyStatus?: SupplyStatus;
  overrideMa30?: number;
  overrideMean60?: number;
  overrideStdDev60?: number;
}

export function calculateH7Forecast(
  history: { date: string; hargaRp: number }[],
  hargaAcuanRp: number,
  commodityId: string,
  options: ForecastOptions = {}
): {
  points: ForecastPoint[];
  finalH7: EwsPrediction;
  multiWindow: MultiWindowAnalysis;
} {
  if (history.length < 2) {
    throw new Error('Minimal 2 titik data historis dibutuhkan untuk forecasting');
  }

  const seasonalScenario: SeasonalScenario = options.seasonalScenario ?? 'normal';
  const supplyStatus: SupplyStatus = options.supplyStatus ?? 'seimbang';
  const mMusim = SEASONAL_MULTIPLIERS[seasonalScenario].multiplier;
  const mStok = STOCK_MULTIPLIERS[supplyStatus];

  const n = history.length;
  const pt = history[n - 1].hargaRp;
  const idxMinus7 = Math.max(0, n >= 8 ? n - 8 : 0);
  const ptMinus7 = history[idxMinus7].hargaRp;
  const daysSpan = Math.max(1, n >= 8 ? 7 : n - 1);

  // 1. Laju Kenaikan Harian (r) = (P_t - P_{t-7}) / (7 * P_{t-7})
  const dailyRateR = (pt - ptMinus7) / (daysSpan * ptMinus7);
  const dailyRatePct = Number((dailyRateR * 100).toFixed(2));

  // 2. Proyeksi Dasar (P_baseline) = P_t * (1 + r * 7)
  const baselineH7Exact = pt * (1 + dailyRateR * 7);
  const baselineH7Rp = Math.round(baselineH7Exact);

  // 3. Kalibrasi Musiman & Stok (P_hat_{t+7}) = P_baseline * M_musim * M_stok
  const exactCalibratedH7Rp = Math.round(baselineH7Exact * mMusim * mStok);
  const calibratedH7Rp = Math.round(exactCalibratedH7Rp / 100) * 100;

  // Adaptive Multi-Window (7d, 30d, 60d)
  const slice7 = history.slice(-7);
  const ma7 = Math.round(slice7.reduce((acc, item) => acc + item.hargaRp, 0) / slice7.length);

  const slice30 = history.slice(-30);
  const computedMa30 = Math.round(
    slice30.reduce((acc, item) => acc + item.hargaRp, 0) / slice30.length
  );
  const ma30 =
    options.overrideMa30 ??
    (history.length >= 25 ? computedMa30 : Math.round((computedMa30 * 0.96 + hargaAcuanRp * 1.04) / 2));

  const slice60 = history.slice(-60);
  const rawMean = slice60.reduce((acc, item) => acc + item.hargaRp, 0) / slice60.length;
  const mean60 =
    options.overrideMean60 ??
    (history.length >= 45 ? Math.round(rawMean) : Math.round((rawMean + hargaAcuanRp) / 2));

  const variance =
    slice60.reduce((acc, item) => acc + Math.pow(item.hargaRp - rawMean, 2), 0) /
    Math.max(1, slice60.length - 1);
  const rawStd = Math.sqrt(variance);
  const stdDev60 =
    options.overrideStdDev60 ??
    Math.max(Math.round(hargaAcuanRp * 0.04), Math.round(rawStd));

  const anomalyThresholdRp = mean60 + 2 * stdDev60;
  const deviasiMa30Pct = Number((((pt - ma30) / Math.max(1, ma30)) * 100).toFixed(1));
  const isAnomalyExtreme = pt > anomalyThresholdRp || calibratedH7Rp > anomalyThresholdRp;

  // Volatilitas untuk rentang ketidakpastian
  let sumSqDiff = 0;
  for (let i = 1; i < n; i++) {
    const dailyReturn = (history[i].hargaRp - history[i - 1].hargaRp) / history[i - 1].hargaRp;
    sumSqDiff += dailyReturn * dailyReturn;
  }
  const dailyVolatility = Math.sqrt(sumSqDiff / Math.max(1, n - 1));
  const volatilityMultiplier = commodityId.includes('cabai')
    ? 1.35
    : commodityId.includes('bawang')
    ? 1.2
    : 0.8;
  const effectiveVol = Math.max(0.015, dailyVolatility * volatilityMultiplier);

  const points: ForecastPoint[] = [];
  const baseDate = new Date(history[n - 1].date);

  for (let day = 1; day <= 7; day++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + day);
    const dateStr = targetDate.toISOString().split('T')[0];

    const stepPrice =
      day === 7
        ? calibratedH7Rp
        : Math.round((pt + ((calibratedH7Rp - pt) * day) / 7) / 100) * 100;

    const margin = stepPrice * effectiveVol * Math.sqrt(day) * 1.4;
    const lower = Math.round((stepPrice - margin) / 100) * 100;
    const upper = Math.round((stepPrice + margin) / 100) * 100;

    const selisihPersen = Number(
      (((stepPrice - hargaAcuanRp) / hargaAcuanRp) * 100).toFixed(2)
    );

    let status: PriceStatus = 'aman';
    if (supplyStatus === 'defisit' || selisihPersen > 10 || stepPrice > anomalyThresholdRp) {
      status = 'kritis';
    } else if (selisihPersen > 5) {
      status = 'waspada';
    } else if (selisihPersen < -5) {
      status = 'turun';
    }

    points.push({
      day,
      date: dateStr,
      hargaPrediksiRp: stepPrice,
      confidenceLowerRp: lower,
      confidenceUpperRp: upper,
      selisihPersen,
      status,
    });
  }

  const h7Point = points[6];
  const kenaikanH7Pct = Number((((calibratedH7Rp - pt) / Math.max(1, pt)) * 100).toFixed(2));

  const deviasiScore = Math.min(100, Math.max(0, (h7Point.selisihPersen + 5) * 4));
  const trendScore = Math.min(100, Math.max(0, dailyRatePct * 25 + 35));
  const ewsScore = Math.min(100, Math.max(0, Math.round(deviasiScore * 0.55 + trendScore * 0.45)));

  let riskLevel: RiskLevel = 'LOW';
  if (ewsScore >= 75 || h7Point.status === 'kritis') riskLevel = 'EXTREME';
  else if (ewsScore >= 55) riskLevel = 'HIGH';
  else if (ewsScore >= 35) riskLevel = 'MEDIUM';

  const finalH7: EwsPrediction = {
    regionId: '',
    commodityId,
    targetDate: h7Point.date,
    horizonDay: 7,
    hargaPrediksiH7Rp: h7Point.hargaPrediksiRp,
    selisihPersen: h7Point.selisihPersen,
    status: h7Point.status,
    ewsScore,
    riskLevel,
    confidenceLowerRp: h7Point.confidenceLowerRp,
    confidenceUpperRp: h7Point.confidenceUpperRp,
    drivers: {
      deviasiHapScore: Math.round(deviasiScore),
      trendLajuScore: Math.round(trendScore),
      dayaBeliUmkScore: 50,
    },
  };

  return {
    points,
    finalH7,
    multiWindow: {
      pt,
      ptMinus7,
      dailyRateR,
      dailyRatePct,
      ma7,
      ma30,
      mean60,
      stdDev60,
      anomalyThresholdRp,
      deviasiMa30Pct,
      isAnomalyExtreme,
      baselineH7Rp,
      seasonalScenario,
      seasonalMultiplier: mMusim,
      supplyStatus,
      stockMultiplier: mStok,
      exactCalibratedH7Rp,
      calibratedH7Rp,
      kenaikanH7Pct,
    },
  };
}
