import { EwsPrediction, PriceStatus, RiskLevel } from '../../types/domain';

export interface ForecastPoint {
  day: number; // 1 to 7
  date: string;
  hargaPrediksiRp: number;
  confidenceLowerRp: number;
  confidenceUpperRp: number;
  selisihPersen: number;
  status: PriceStatus;
}

export function calculateH7Forecast(
  history14d: { date: string; hargaRp: number }[],
  hargaAcuanRp: number,
  commodityId: string
): { points: ForecastPoint[]; finalH7: EwsPrediction } {
  if (history14d.length < 7) {
    throw new Error('Minimal 7 hari data historis dibutuhkan untuk forecasting');
  }

  const n = history14d.length;
  const currentPrice = history14d[n - 1].hargaRp;
  const past7dPrice = history14d[n - 7].hargaRp;
  
  // 7-day linear velocity (delta per hari)
  const slope7d = (currentPrice - past7dPrice) / 7;
  
  // Volatility calculation (standard deviation of daily percentage change)
  let sumSqDiff = 0;
  for (let i = 1; i < n; i++) {
    const dailyReturn = (history14d[i].hargaRp - history14d[i - 1].hargaRp) / history14d[i - 1].hargaRp;
    sumSqDiff += dailyReturn * dailyReturn;
  }
  const dailyVolatility = Math.sqrt(sumSqDiff / (n - 1));

  // Commodity damping / seasonal friction factor
  const volatilityMultiplier = commodityId.includes('cabai') ? 1.4 : (commodityId.includes('bawang') ? 1.2 : 0.8);
  const effectiveVol = Math.max(0.015, dailyVolatility * volatilityMultiplier);

  const points: ForecastPoint[] = [];
  const baseDate = new Date(history14d[n - 1].date);

  for (let day = 1; day <= 7; day++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + day);
    const dateStr = targetDate.toISOString().split('T')[0];

    // Momentum damping (growth moderates over time)
    const momentum = Math.pow(0.92, day);
    const predictedPrice = Math.round(
      (currentPrice + slope7d * day * momentum) / 100
    ) * 100;

    // Conformal confidence interval expanding with sqrt(day)
    const margin = predictedPrice * effectiveVol * Math.sqrt(day) * 1.645;
    const lower = Math.round((predictedPrice - margin) / 100) * 100;
    const upper = Math.round((predictedPrice + margin) / 100) * 100;

    const selisihPersen = Number(
      (((predictedPrice - hargaAcuanRp) / hargaAcuanRp) * 100).toFixed(2)
    );

    let status: PriceStatus = 'aman';
    if (selisihPersen > 10) status = 'kritis';
    else if (selisihPersen > 5) status = 'waspada';
    else if (selisihPersen < -5) status = 'turun';

    points.push({
      day,
      date: dateStr,
      hargaPrediksiRp: predictedPrice,
      confidenceLowerRp: lower,
      confidenceUpperRp: upper,
      selisihPersen,
      status
    });
  }

  const h7Point = points[6];
  
  // EWS Risk metrics
  const deviasiScore = Math.min(100, Math.max(0, (h7Point.selisihPersen + 5) * 4));
  const trendScore = Math.min(100, Math.max(0, (slope7d / 120) * 50 + 40));
  const ewsScore = Math.min(100, Math.max(0, Math.round(deviasiScore * 0.55 + trendScore * 0.45)));

  let riskLevel: RiskLevel = 'LOW';
  if (ewsScore >= 75) riskLevel = 'EXTREME';
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
      dayaBeliUmkScore: 50
    }
  };

  return { points, finalH7 };
}
