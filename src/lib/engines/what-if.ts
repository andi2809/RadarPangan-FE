import { PriceStatus, UnifiedRegionTelemetry } from '../../types/domain';

export interface WhatIfSimulationInput {
  baseTelemetry: UnifiedRegionTelemetry;
  transportSubsidyPercent: number; // 0 to 50 %
  marketOperationTonnage: number; // 0 to 500 Ton
  distributionIntervention: boolean;
}

export interface WhatIfSimulationResult {
  simulatedPriceRp: number;
  simulatedSelisihPersen: number;
  simulatedStatus: PriceStatus;
  simulatedEwsScore: number;
  priceReductionRp: number;
  reductionPercentage: number;
  statusShifted: boolean;
  keteranganEfek: string;
}

export function simulateIntervention(input: WhatIfSimulationInput): WhatIfSimulationResult {
  const { baseTelemetry, transportSubsidyPercent, marketOperationTonnage, distributionIntervention } = input;
  const currentPrice = baseTelemetry.currentPrice.hargaAktualRp;
  const hargaAcuan = baseTelemetry.currentPrice.hargaAcuanRp;

  // 1. Freight subsidy effect
  // Freight typically contributes 8-15% of wholesale commodity price in deficit urban centers
  const baseFreightFraction = 0.12;
  const freightSavingsRate = (transportSubsidyPercent / 100) * baseFreightFraction;
  const freightDiscountRp = currentPrice * freightSavingsRate;

  // 2. Market operation (GPM) supply injection effect
  // Elasticity: every 50 ton injection reduces price pressure by ~1.2% in deficit regency
  const localDeficit = Math.max(10, Math.abs(baseTelemetry.supply.surplusDefisitTon));
  const injectionRatio = Math.min(1.0, marketOperationTonnage / localDeficit);
  const gpmDiscountRate = injectionRatio * 0.085; // up to 8.5% price cooling
  const gpmDiscountRp = currentPrice * gpmDiscountRate;

  // 3. Distribution corridor facilitation (FDP)
  const fdpDiscountRp = distributionIntervention ? currentPrice * 0.025 : 0;

  const totalDiscountRp = Math.round(freightDiscountRp + gpmDiscountRp + fdpDiscountRp);
  // Ensure simulated price cannot drop below 80% of HAP (floor price)
  const floorPrice = Math.round(hargaAcuan * 0.82);
  const simulatedPriceRp = Math.max(floorPrice, currentPrice - totalDiscountRp);

  const simulatedSelisihPersen = Number(
    (((simulatedPriceRp - hargaAcuan) / hargaAcuan) * 100).toFixed(2)
  );

  let simulatedStatus: PriceStatus = 'aman';
  if (simulatedSelisihPersen > 10) simulatedStatus = 'kritis';
  else if (simulatedSelisihPersen > 5) simulatedStatus = 'waspada';
  else if (simulatedSelisihPersen < -5) simulatedStatus = 'turun';

  // Recalculate EWS Score
  const scoreDiscount = Math.round((totalDiscountRp / currentPrice) * 120);
  const simulatedEwsScore = Math.max(12, baseTelemetry.predictionH7.ewsScore - scoreDiscount);

  const priceReductionRp = currentPrice - simulatedPriceRp;
  const reductionPercentage = Number(((priceReductionRp / currentPrice) * 100).toFixed(1));
  const statusShifted = simulatedStatus !== baseTelemetry.currentPrice.status;

  let keteranganEfek = 'Belum ada intervensi.';
  if (totalDiscountRp > 0) {
    keteranganEfek = `Intervensi berhasil menekan harga sebesar Rp ${priceReductionRp.toLocaleString(
      'id-ID'
    )} (-${reductionPercentage}%), menurunkan skor EWS dari ${baseTelemetry.predictionH7.ewsScore} ke ${simulatedEwsScore}.`;
    if (statusShifted) {
      keteranganEfek += ` Status wilayah berhasil diturunkan dari [${baseTelemetry.currentPrice.status.toUpperCase()}] menjadi [${simulatedStatus.toUpperCase()}].`;
    }
  }

  return {
    simulatedPriceRp,
    simulatedSelisihPersen,
    simulatedStatus,
    simulatedEwsScore,
    priceReductionRp,
    reductionPercentage,
    statusShifted,
    keteranganEfek
  };
}
