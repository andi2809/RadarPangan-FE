/**
 * RADAR PANGAN — CROWDSOURCING & TRACKING CODE ENGINE (P03)
 * Menangani formulir pelaporan harga pasar warga (mobile-first),
 * integrasi GPS, penerbitan Kode Unik Pelaporan (#RP-XXXX-YYYYMMDD-ZZZ),
 * serta simulasi pelacakan status konsensus kuorum anti-spekulan.
 */

class LaporEngine {
  constructor() {
    this.storageKey = 'radar_pangan_citizen_reports';
    this.initDemoData();
  }

  // Pre-seed some demo reports for immediate tracking test
  initDemoData() {
    const existing = this.getAllReports();
    if (existing.length === 0) {
      const sampleReports = [
        {
          ticketId: '#RP-3273-20261024-042',
          commoditySlug: 'cabai-rawit',
          commodityName: 'Cabai Rawit Merah',
          price: 54000,
          unit: 'kg',
          marketName: 'Pasar Ciroyom, Kota Bandung',
          timestamp: '2026-10-24 07:45 WIB',
          lat: -6.9147,
          lng: 107.5912,
          radiusDistanceKm: 0.4,
          statusStage: 3, // 1: Radius, 2: Konsensus, 3: Masuk Basis Data
          consensusCount: 14,
          deviationPct: 1.2,
          notes: 'Beli cabai rawit merah 1 kg kondisi segar dari lapak Bu Siti Blok B'
        },
        {
          ticketId: '#RP-3275-20261024-089',
          commoditySlug: 'beras-medium',
          commodityName: 'Beras Medium',
          price: 13700,
          unit: 'kg',
          marketName: 'Pasar Kranji Baru, Kota Bekasi',
          timestamp: '2026-10-24 08:15 WIB',
          lat: -6.2289,
          lng: 106.9781,
          radiusDistanceKm: 0.8,
          statusStage: 2, // Terverifikasi Konsensus
          consensusCount: 8,
          deviationPct: 0.7,
          notes: 'Beras medium karung 5kg di toko sembako'
        },
        {
          ticketId: '#RP-3204-20261024-112',
          commoditySlug: 'minyakita',
          commodityName: 'Minyakita (Kemasan Rakyat)',
          price: 15700,
          unit: 'liter',
          marketName: 'Pasar Soreang, Kab. Bandung',
          timestamp: '2026-10-24 09:10 WIB',
          lat: -7.0289,
          lng: 107.5181,
          radiusDistanceKm: 1.2,
          statusStage: 1, // Menunggu Verifikasi Radius
          consensusCount: 3,
          deviationPct: 0.0,
          notes: 'Minyakita botol 1L sesuai HET'
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(sampleReports));
    }
  }

  getAllReports() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  generateTicketId(regionCode = '3273') {
    const cleanCode = regionCode.replace('.', '');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const randomSeq = String(Math.floor(100 + Math.random() * 900));
    return `#RP-${cleanCode}-${yyyy}${mm}${dd}-${randomSeq}`;
  }

  submitReport(formData) {
    const ticketId = this.generateTicketId(formData.regionCode || '3273');
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} WIB`;

    const report = {
      ticketId: ticketId,
      commoditySlug: formData.commoditySlug,
      commodityName: formData.commodityName,
      price: Number(formData.price),
      unit: formData.unit || 'kg',
      marketName: formData.marketName,
      timestamp: timestamp,
      lat: formData.lat || -6.9175,
      lng: formData.lng || 107.6191,
      radiusDistanceKm: formData.radiusDistanceKm || 0.5,
      statusStage: 1, // Start at stage 1
      consensusCount: 1,
      deviationPct: 0.4,
      notes: formData.notes || '',
      hasReceipt: !!formData.hasReceipt
    };

    const reports = this.getAllReports();
    reports.unshift(report);
    localStorage.setItem(this.storageKey, JSON.stringify(reports));

    return report;
  }

  findReport(ticketQuery) {
    if (!ticketQuery) return null;
    const cleanQuery = ticketQuery.trim().toUpperCase();
    const reports = this.getAllReports();
    return reports.find(r => r.ticketId.toUpperCase() === cleanQuery || r.ticketId.replace('#', '').toUpperCase() === cleanQuery.replace('#', '')) || null;
  }
}

window.LaporEngine = new LaporEngine();
