export interface CitizenReportItem {
  id: string;
  hargaRp: number;
  isOutlier: boolean;
  reason?: string;
  reporterId: string;
  timestamp: string;
}

export interface ConsensusEvaluationResult {
  clusterId: string;
  totalSubmissions: number;
  validReportsCount: number;
  outlierReportsCount: number;
  medianHargaRp: number;
  madValue: number;
  isConsensusReached: boolean; // >= 10 valid reports & deviation within tolerance
  clusterStatus: 'VERIFIED_SPIKE' | 'VERIFIED_NORMAL' | 'SUSPECT_ANOMALY' | 'INSUFFICIENT_DATA';
  outlierList: CitizenReportItem[];
  deviationFromOfficialPercent: number;
  keterangan: string;
}

export function evaluateCrowdsourceConsensus(
  reports: CitizenReportItem[],
  officialAcuanRp: number,
  clusterId: string
): ConsensusEvaluationResult {
  if (reports.length === 0) {
    return {
      clusterId,
      totalSubmissions: 0,
      validReportsCount: 0,
      outlierReportsCount: 0,
      medianHargaRp: 0,
      madValue: 0,
      isConsensusReached: false,
      clusterStatus: 'INSUFFICIENT_DATA',
      outlierList: [],
      deviationFromOfficialPercent: 0,
      keterangan: 'Belum ada laporan warga pada klaster ini.'
    };
  }

  // 1. Satu perangkat = satu suara per komoditas per jendela waktu
  const uniqueReports = Array.from(
    new Map(reports.map((report) => [report.reporterId, report])).values()
  );

  // 2. Calculate raw median from independent reports
  const prices = uniqueReports.map((r) => r.hargaRp).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const rawMedian = prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

  // 3. Compute Median Absolute Deviation (MAD)
  const absoluteDeviations = prices.map((p) => Math.abs(p - rawMedian)).sort((a, b) => a - b);
  const mad =
    absoluteDeviations.length % 2 !== 0
      ? absoluteDeviations[mid]
      : (absoluteDeviations[mid - 1] + absoluteDeviations[mid]) / 2;

  // Avoid division by zero
  const safeMad = Math.max(100, mad);

  // 4. Buang outlier: modified z-score > 3,5 atau deviasi > 10% dari median klaster
  const processedReports = uniqueReports.map((r) => {
    const modZ = (0.6745 * Math.abs(r.hargaRp - rawMedian)) / safeMad;
    const deviationRatio = Math.abs(r.hargaRp - rawMedian) / rawMedian;
    const isOutlier = modZ > 3.5 || deviationRatio > 0.1;
    return {
      ...r,
      isOutlier,
      reason: isOutlier
        ? `Deviasi ${(deviationRatio * 100).toFixed(1)}% / Z-Score ${modZ.toFixed(1)} melewati batas konsensus`
        : undefined
    };
  });

  const validReports = processedReports.filter((r) => !r.isOutlier);
  const outliers = processedReports.filter((r) => r.isOutlier);

  // Recalculate robust median from valid reports only
  const validPrices = validReports.map((r) => r.hargaRp).sort((a, b) => a - b);
  const validMid = Math.floor(validPrices.length / 2);
  const finalMedian =
    validPrices.length === 0
      ? rawMedian
      : validPrices.length % 2 !== 0
      ? validPrices[validMid]
      : (validPrices[validMid - 1] + validPrices[validMid]) / 2;

  // Deviation from official acuan
  const devPercent = Number((((finalMedian - officialAcuanRp) / officialAcuanRp) * 100).toFixed(1));

  // Anti-speculator rule:
  // Consensus requires >= 10 valid independent reports within cluster
  const isConsensusReached = validReports.length >= 10;

  let clusterStatus: 'VERIFIED_SPIKE' | 'VERIFIED_NORMAL' | 'SUSPECT_ANOMALY' | 'INSUFFICIENT_DATA' =
    'INSUFFICIENT_DATA';

  let keterangan = '';

  if (!isConsensusReached) {
    clusterStatus = 'INSUFFICIENT_DATA';
    keterangan = `Menunggu kuorum konsensus. Terkumpul ${validReports.length}/10 laporan terverifikasi (radius 3 km).`;
  } else if (outliers.length >= 3 && validReports.length < 10) {
    clusterStatus = 'SUSPECT_ANOMALY';
    keterangan = 'Terdeteksi pola koordinasi spekulasi harga abnormal. Diisolasi dari indeks agregat.';
  } else if (devPercent > 5) {
    clusterStatus = 'VERIFIED_SPIKE';
    keterangan = `Konsensus Warga Terverifikasi (${validReports.length} laporan independen). Lonjakan harga terkonfirmasi +${devPercent}% di atas HET.`;
  } else {
    clusterStatus = 'VERIFIED_NORMAL';
    keterangan = `Konsensus Warga Terverifikasi (${validReports.length} laporan). Harga riil pasar terpantau stabil pada Rp ${finalMedian.toLocaleString(
      'id-ID'
    )}.`;
  }

  return {
    clusterId,
    totalSubmissions: reports.length,
    validReportsCount: validReports.length,
    outlierReportsCount: outliers.length,
    medianHargaRp: Math.round(finalMedian),
    madValue: Math.round(safeMad),
    isConsensusReached,
    clusterStatus,
    outlierList: outliers,
    deviationFromOfficialPercent: devPercent,
    keterangan
  };
}
