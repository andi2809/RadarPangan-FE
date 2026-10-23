import { PriceStatus, RiskLevel } from '../../types/domain';

export interface EwsScoreResult {
  score: number; // 0 - 100
  status: PriceStatus;
  riskLevel: RiskLevel;
  drivers: {
    deviasiHapScore: number;
    trendLajuScore: number;
    dayaBeliUmkScore: number;
  };
  rekomendasiTindakan: string;
}

export function computeEwsScore(
  hargaAktualRp: number,
  hargaAcuanRp: number,
  slope7d: number,
  umk2026: number,
  commodityId: string
): EwsScoreResult {
  const selisihRp = hargaAktualRp - hargaAcuanRp;
  const selisihPersen = (selisihRp / hargaAcuanRp) * 100;

  // 1. Component Deviasi HAP (0-100)
  // -5% -> 0 score, 0% -> 20 score, +5% -> 40 score, +10% -> 60 score, +20% -> 100 score
  const deviasiHapScore = Math.min(100, Math.max(0, (selisihPersen + 5) * 4));

  // 2. Component Trend Laju Kenaikan (0-100)
  // slope7d: laju kenaikan rupiah per hari
  const normalSlope = commodityId.includes('cabai') ? 300 : (commodityId.includes('beras') ? 50 : 150);
  const trendLajuScore = Math.min(100, Math.max(0, (slope7d / normalSlope) * 50 + 30));

  // 3. Component Daya Beli UMK (0-100)
  const monthlyWeightKg = commodityId.includes('beras') ? 10 : 2;
  const monthlyCommodityCost = hargaAktualRp * monthlyWeightKg;
  // Rasio terhadap 10% UMK
  const umkBudget = (umk2026 * 0.10);
  const dayaBeliUmkScore = Math.min(100, Math.max(0, (monthlyCommodityCost / umkBudget) * 100));

  // Weighted formula: 45% HAP + 35% Velocity + 20% UMK
  const rawScore = (deviasiHapScore * 0.45) + (trendLajuScore * 0.35) + (dayaBeliUmkScore * 0.20);
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Semantic Status mapping (sesuai kesepakatan Handoff & Design Guidelines)
  let status: PriceStatus = 'aman';
  if (selisihPersen > 10) status = 'kritis';
  else if (selisihPersen > 5) status = 'waspada';
  else if (selisihPersen < -5) status = 'turun';

  // Risk Level
  let riskLevel: RiskLevel = 'LOW';
  let rekomendasiTindakan = 'Pasokan stabil. Pertahankan pemantauan rutin.';

  if (score >= 75 || status === 'kritis') {
    riskLevel = 'EXTREME';
    rekomendasiTindakan = 'Operasi Pasar Murah (GPM) darurat dan aktivasi Fasilitasi Distribusi Pangan (FDP) dari sentra surplus terdekat.';
  } else if (score >= 55) {
    riskLevel = 'HIGH';
    rekomendasiTindakan = 'Peringatan dini lonjakan harga. Koordinasikan pelepasan Cadangan Pangan Pemerintah Daerah (CPPD).';
  } else if (score >= 35) {
    riskLevel = 'MEDIUM';
    rekomendasiTindakan = 'Inspeksi pasar berkala dan pengetatan pengawasan distribusi anti-penimbunan.';
  }

  return {
    score,
    status,
    riskLevel,
    drivers: {
      deviasiHapScore: Math.round(deviasiHapScore),
      trendLajuScore: Math.round(trendLajuScore),
      dayaBeliUmkScore: Math.round(dayaBeliUmkScore)
    },
    rekomendasiTindakan
  };
}
