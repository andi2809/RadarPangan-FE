import { Region } from '../../types/domain';

export interface AffordabilityResult {
  monthlyBasketTotalRp: number;
  umkMonthlyRp: number;
  umkBasketRatioPercent: number; // % of UMK consumed by 5 basic staples
  garisKemiskinanRp: number;
  povertyBasketRatioPercent: number;
  kategoriDayaBeli: 'TERJANGKAU' | 'RENTAN' | 'DARURAT';
  rentanIndeks: number; // 0 - 100
  uraianBeban: string;
}

// Monthly standard household consumption weight for 5 commodities (family of 4 in Jabar)
export const MONTHLY_HOUSEHOLD_BASKET_WEIGHT = {
  beras_medium: 36, // kg per household / month (approx 9kg/capita)
  cabai_rawit_merah: 2.4, // kg
  bawang_merah: 3.2, // kg
  telur_ayam_ras: 5.0, // kg
  minyakita: 6.0 // liter
};

export function calculateAffordability(
  region: Region,
  currentPrices: Record<string, number>
): AffordabilityResult {
  let basketTotal = 0;

  for (const [commodityId, weight] of Object.entries(MONTHLY_HOUSEHOLD_BASKET_WEIGHT)) {
    const price = currentPrices[commodityId] || 15000;
    basketTotal += price * weight;
  }

  const umkMonthlyRp = region.umk2026;
  const umkBasketRatioPercent = Number(((basketTotal / umkMonthlyRp) * 100).toFixed(1));

  // Per capita food expenditure vs Garis Kemiskinan
  const perCapitaBasketRp = basketTotal / 4;
  const povertyBasketRatioPercent = Number(
    ((perCapitaBasketRp / region.garisKemiskinan) * 100).toFixed(1)
  );

  let kategoriDayaBeli: 'TERJANGKAU' | 'RENTAN' | 'DARURAT' = 'TERJANGKAU';
  let rentanIndeks = 20;

  if (umkBasketRatioPercent > 32 || povertyBasketRatioPercent > 55) {
    kategoriDayaBeli = 'DARURAT';
    rentanIndeks = 85;
  } else if (umkBasketRatioPercent > 22 || povertyBasketRatioPercent > 40) {
    kategoriDayaBeli = 'RENTAN';
    rentanIndeks = 55;
  }

  const uraianBeban =
    kategoriDayaBeli === 'DARURAT'
      ? `Beban pangan pokok menyerap ${umkBasketRatioPercent}% UMK lokal. Memerlukan intervensi bantuan pangan beras dan pasar murah sesegera mungkin.`
      : kategoriDayaBeli === 'RENTAN'
      ? `Beban pangan menyerap ${umkBasketRatioPercent}% UMK lokal. Tekanan inflasi cabai/bawang mulai menggerus daya beli desil 1-4.`
      : `Beban pangan ${umkBasketRatioPercent}% UMK lokal masih dalam batas ketahanan aman (<22%).`;

  return {
    monthlyBasketTotalRp: Math.round(basketTotal),
    umkMonthlyRp,
    umkBasketRatioPercent,
    garisKemiskinanRp: region.garisKemiskinan,
    povertyBasketRatioPercent,
    kategoriDayaBeli,
    rentanIndeks,
    uraianBeban
  };
}
