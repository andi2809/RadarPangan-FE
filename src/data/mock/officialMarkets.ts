export interface OfficialMarket {
  id: string;
  name: string;
  kecamatan: string;
  pengelola: string;
}

export interface RegionMarketDirectory {
  regionId: string;
  regionName: string;
  instansiPengelola: string;
  markets: OfficialMarket[];
}

/**
 * Direktori Pasar Rakyat Resmi (Pasar Tradisional Permanen / Pasar Pantau TPID, SP2KP & Bapanas)
 * di 27 Kabupaten/Kota Provinsi Jawa Barat.
 * Hanya mencakup pasar resmi yang terdata di bawah Perumda Pasar atau UPTD Pasar Dinas Perdagangan setempat
 * (Tidak termasuk pasar kaget / pasar tumpah).
 */
export const OFFICIAL_MARKETS_BY_REGION: Record<string, RegionMarketDirectory> = {
  '32.01': {
    regionId: '32.01',
    regionName: 'Kab. Bogor',
    instansiPengelola: 'Perumda Pasar Tohaga Kab. Bogor',
    markets: [
      { id: 'psr-bgrkab-01', name: 'Pasar Cibinong', kecamatan: 'Cibinong', pengelola: 'Perumda Pasar Tohaga' },
      { id: 'psr-bgrkab-02', name: 'Pasar Cileungsi', kecamatan: 'Cileungsi', pengelola: 'Perumda Pasar Tohaga' },
      { id: 'psr-bgrkab-03', name: 'Pasar Cisarua', kecamatan: 'Cisarua', pengelola: 'Perumda Pasar Tohaga' },
      { id: 'psr-bgrkab-04', name: 'Pasar Parung', kecamatan: 'Parung', pengelola: 'Perumda Pasar Tohaga' },
      { id: 'psr-bgrkab-05', name: 'Pasar Citeureup', kecamatan: 'Citeureup', pengelola: 'Perumda Pasar Tohaga' },
      { id: 'psr-bgrkab-06', name: 'Pasar Leuwiliang', kecamatan: 'Leuwiliang', pengelola: 'Perumda Pasar Tohaga' },
    ],
  },
  '32.02': {
    regionId: '32.02',
    regionName: 'Kab. Sukabumi',
    instansiPengelola: 'UPTD Pasar Disdagin Kab. Sukabumi',
    markets: [
      { id: 'psr-smikab-01', name: 'Pasar Cisaat', kecamatan: 'Cisaat', pengelola: 'UPTD Pasar Cisaat' },
      { id: 'psr-smikab-02', name: 'Pasar Semi Modern Cibadak', kecamatan: 'Cibadak', pengelola: 'UPTD Pasar Cibadak' },
      { id: 'psr-smikab-03', name: 'Pasar Semi Modern Cicurug', kecamatan: 'Cicurug', pengelola: 'UPTD Pasar Cicurug' },
      { id: 'psr-smikab-04', name: 'Pasar Palabuhanratu', kecamatan: 'Palabuhanratu', pengelola: 'UPTD Pasar Palabuhanratu' },
      { id: 'psr-smikab-05', name: 'Pasar Parungkuda', kecamatan: 'Parungkuda', pengelola: 'UPTD Pasar Parungkuda' },
      { id: 'psr-smikab-06', name: 'Pasar Sukaraja', kecamatan: 'Sukaraja', pengelola: 'UPTD Pasar Sukaraja' },
    ],
  },
  '32.03': {
    regionId: '32.03',
    regionName: 'Kab. Cianjur',
    instansiPengelola: 'UPTD Pasar Diskuperdagin Kab. Cianjur',
    markets: [
      { id: 'psr-cianjur-01', name: 'Pasar Induk Pasirhayam', kecamatan: 'Cilaku', pengelola: 'UPTD Pasar Induk Pasirhayam' },
      { id: 'psr-cjr-02', name: 'Pasar Muka Cianjur', kecamatan: 'Cianjur', pengelola: 'UPTD Pasar Muka' },
      { id: 'psr-cjr-03', name: 'Pasar Cipanas', kecamatan: 'Cipanas', pengelola: 'UPTD Pasar Cipanas' },
      { id: 'psr-cjr-04', name: 'Pasar Ciranjang', kecamatan: 'Ciranjang', pengelola: 'UPTD Pasar Ciranjang' },
      { id: 'psr-cjr-05', name: 'Pasar Warungkondang', kecamatan: 'Warungkondang', pengelola: 'UPTD Pasar Warungkondang' },
    ],
  },
  '32.04': {
    regionId: '32.04',
    regionName: 'Kab. Bandung',
    instansiPengelola: 'UPTD Pasar Disperdagin Kab. Bandung',
    markets: [
      { id: 'psr-bdgkab-01', name: 'Pasar Sehat Soreang', kecamatan: 'Soreang', pengelola: 'UPTD Pasar Soreang' },
      { id: 'psr-bdgkab-02', name: 'Pasar Sehat Cileunyi', kecamatan: 'Cileunyi', pengelola: 'UPTD Pasar Cileunyi' },
      { id: 'psr-bdgkab-03', name: 'Pasar Baleendah', kecamatan: 'Baleendah', pengelola: 'UPTD Pasar Baleendah' },
      { id: 'psr-bdgkab-04', name: 'Pasar Majalaya', kecamatan: 'Majalaya', pengelola: 'UPTD Pasar Majalaya' },
      { id: 'psr-bdgkab-05', name: 'Pasar Banjaran', kecamatan: 'Banjaran', pengelola: 'UPTD Pasar Banjaran' },
      { id: 'psr-bdgkab-06', name: 'Pasar Ciwidey', kecamatan: 'Ciwidey', pengelola: 'UPTD Pasar Ciwidey' },
    ],
  },
  '32.05': {
    regionId: '32.05',
    regionName: 'Kab. Garut',
    instansiPengelola: 'UPT Pasar Disperindag Kab. Garut',
    markets: [
      { id: 'psr-garutkab-01', name: 'Pasar Induk Guntur Ciawitali', kecamatan: 'Tarogong Kidul', pengelola: 'UPT Pasar Wilayah I' },
      { id: 'psr-grt-02', name: 'Pasar Kadungora', kecamatan: 'Kadungora', pengelola: 'UPT Pasar Wilayah II' },
      { id: 'psr-grt-03', name: 'Pasar Wanaraja', kecamatan: 'Wanaraja', pengelola: 'UPT Pasar Wilayah III' },
      { id: 'psr-grt-04', name: 'Pasar Samarang', kecamatan: 'Samarang', pengelola: 'UPT Pasar Wilayah IV' },
      { id: 'psr-grt-05', name: 'Pasar Cikajang', kecamatan: 'Cikajang', pengelola: 'UPT Pasar Wilayah V' },
      { id: 'psr-grt-06', name: 'Pasar Limbangan', kecamatan: 'Blubur Limbangan', pengelola: 'UPT Pasar Limbangan' },
    ],
  },
  '32.06': {
    regionId: '32.06',
    regionName: 'Kab. Tasikmalaya',
    instansiPengelola: 'UPTD Pasar Diskopukmindag Kab. Tasikmalaya',
    markets: [
      { id: 'psr-tsm-01', name: 'Pasar Singaparna', kecamatan: 'Singaparna', pengelola: 'UPTD Pasar Singaparna' },
      { id: 'psr-tsmkab-02', name: 'Pasar Ciawi Tasikmalaya', kecamatan: 'Ciawi', pengelola: 'UPTD Pasar Ciawi' },
      { id: 'psr-tsmkab-03', name: 'Pasar Manonjaya', kecamatan: 'Manonjaya', pengelola: 'UPTD Pasar Manonjaya' },
      { id: 'psr-tsmkab-04', name: 'Pasar Rajapolah', kecamatan: 'Rajapolah', pengelola: 'UPTD Pasar Rajapolah' },
      { id: 'psr-tsmkab-05', name: 'Pasar Taraju', kecamatan: 'Taraju', pengelola: 'UPTD Pasar Taraju' },
    ],
  },
  '32.07': {
    regionId: '32.07',
    regionName: 'Kab. Ciamis',
    instansiPengelola: 'UPTD Pasar DKUKMPP Kab. Ciamis',
    markets: [
      { id: 'psr-cms-01', name: 'Pasar Manis Ciamis', kecamatan: 'Ciamis', pengelola: 'UPTD Pasar Wilayah Ciamis' },
      { id: 'psr-cms-02', name: 'Pasar Galuh Kawali', kecamatan: 'Kawali', pengelola: 'UPTD Pasar Wilayah Kawali' },
      { id: 'psr-cms-03', name: 'Pasar Banjarsari', kecamatan: 'Banjarsari', pengelola: 'UPTD Pasar Wilayah Banjarsari' },
      { id: 'psr-cms-04', name: 'Pasar Sindangkasih', kecamatan: 'Sindangkasih', pengelola: 'UPTD Pasar Wilayah Sindangkasih' },
    ],
  },
  '32.08': {
    regionId: '32.08',
    regionName: 'Kab. Kuningan',
    instansiPengelola: 'UPTD Pasar Diskopdagperin Kab. Kuningan',
    markets: [
      { id: 'psr-kng-01', name: 'Pasar Baru Kuningan', kecamatan: 'Kuningan', pengelola: 'UPTD Pasar Wilayah Kuningan' },
      { id: 'psr-kng-02', name: 'Pasar Rakyat Kepuh', kecamatan: 'Kuningan', pengelola: 'UPTD Pasar Wilayah Kuningan' },
      { id: 'psr-kng-03', name: 'Pasar Cilimus', kecamatan: 'Cilimus', pengelola: 'UPTD Pasar Cilimus' },
      { id: 'psr-kng-04', name: 'Pasar Ciawigebang', kecamatan: 'Ciawigebang', pengelola: 'UPTD Pasar Ciawigebang' },
    ],
  },
  '32.09': {
    regionId: '32.09',
    regionName: 'Kab. Cirebon',
    instansiPengelola: 'Bidang Pasar Disperdagin Kab. Cirebon',
    markets: [
      { id: 'psr-crbnhkb-01', name: 'Pasar Sumber', kecamatan: 'Sumber', pengelola: 'UPT Pasar Sumber' },
      { id: 'psr-crbkab-02', name: 'Pasar Pasalaran Plered', kecamatan: 'Weru', pengelola: 'UPT Pasar Pasalaran' },
      { id: 'psr-crbkab-03', name: 'Pasar Palimanan', kecamatan: 'Palimanan', pengelola: 'UPT Pasar Palimanan' },
      { id: 'psr-crbkab-04', name: 'Pasar Jamblang', kecamatan: 'Jamblang', pengelola: 'UPT Pasar Jamblang' },
      { id: 'psr-crbkab-05', name: 'Pasar Arjawinangun', kecamatan: 'Arjawinangun', pengelola: 'UPT Pasar Arjawinangun' },
      { id: 'psr-crbkab-06', name: 'Pasar Ciledug', kecamatan: 'Ciledug', pengelola: 'UPT Pasar Ciledug' },
    ],
  },
  '32.10': {
    regionId: '32.10',
    regionName: 'Kab. Majalengka',
    instansiPengelola: 'UPTD Pasar Disperdagin Kab. Majalengka',
    markets: [
      { id: 'psr-mjl-01', name: 'Pasar Kadipaten', kecamatan: 'Kadipaten', pengelola: 'UPTD Pasar Kadipaten' },
      { id: 'psr-mjl-02', name: 'Pasar Sindangkasih Cigasong', kecamatan: 'Cigasong', pengelola: 'UPTD Pasar Cigasong' },
      { id: 'psr-mjl-03', name: 'Pasar Maja', kecamatan: 'Maja', pengelola: 'UPTD Pasar Maja' },
      { id: 'psr-mjl-04', name: 'Pasar Jatitujuh', kecamatan: 'Jatitujuh', pengelola: 'UPTD Pasar Jatitujuh' },
      { id: 'psr-mjl-05', name: 'Pasar Talaga', kecamatan: 'Talaga', pengelola: 'UPTD Pasar Talaga' },
    ],
  },
  '32.11': {
    regionId: '32.11',
    regionName: 'Kab. Sumedang',
    instansiPengelola: 'UPTD Pasar Diskopukmpp Kab. Sumedang',
    markets: [
      { id: 'psr-smd-01', name: 'Pasar Inpres Sumedang', kecamatan: 'Sumedang Utara', pengelola: 'UPTD Pasar Wilayah Sumedang Kota' },
      { id: 'psr-smd-02', name: 'Pasar Tanjungsari', kecamatan: 'Tanjungsari', pengelola: 'UPTD Pasar Tanjungsari' },
      { id: 'psr-smd-03', name: 'Pasar Jatinangor', kecamatan: 'Jatinangor', pengelola: 'UPTD Pasar Jatinangor' },
      { id: 'psr-smd-04', name: 'Pasar Cimalaka', kecamatan: 'Cimalaka', pengelola: 'UPTD Pasar Cimalaka' },
      { id: 'psr-smd-05', name: 'Pasar Conggeang', kecamatan: 'Conggeang', pengelola: 'UPTD Pasar Conggeang' },
    ],
  },
  '32.12': {
    regionId: '32.12',
    regionName: 'Kab. Indramayu',
    instansiPengelola: 'UPTD Pasar Diskopdagin Kab. Indramayu',
    markets: [
      { id: 'psr-idm-01', name: 'Pasar Baru Indramayu', kecamatan: 'Indramayu', pengelola: 'UPTD Pasar Indramayu' },
      { id: 'psr-idm-02', name: 'Pasar Daerah Jatibarang', kecamatan: 'Jatibarang', pengelola: 'UPTD Pasar Jatibarang' },
      { id: 'psr-indramayu-01', name: 'Pasar Karangampel', kecamatan: 'Karangampel', pengelola: 'UPTD Pasar Karangampel' },
      { id: 'psr-idm-04', name: 'Pasar Daerah Haurgeulis', kecamatan: 'Haurgeulis', pengelola: 'UPTD Pasar Haurgeulis' },
      { id: 'psr-idm-05', name: 'Pasar Patrol', kecamatan: 'Patrol', pengelola: 'UPTD Pasar Patrol' },
    ],
  },
  '32.13': {
    regionId: '32.13',
    regionName: 'Kab. Subang',
    instansiPengelola: 'UPTD Pasar DKUPP Kab. Subang',
    markets: [
      { id: 'psr-sbgkab-01', name: 'Pasar Pujasera Subang', kecamatan: 'Subang', pengelola: 'UPTD Pasar Subang' },
      { id: 'psr-sbg-02', name: 'Pasar Baru Subang', kecamatan: 'Subang', pengelola: 'UPTD Pasar Subang' },
      { id: 'psr-sbg-03', name: 'Pasar Inpres Pamanukan', kecamatan: 'Pamanukan', pengelola: 'UPTD Pasar Pamanukan' },
      { id: 'psr-sbg-04', name: 'Pasar Sukamandi Ciasem', kecamatan: 'Ciasem', pengelola: 'UPTD Pasar Ciasem' },
      { id: 'psr-sbg-05', name: 'Pasar Pagaden', kecamatan: 'Pagaden', pengelola: 'UPTD Pasar Pagaden' },
    ],
  },
  '32.14': {
    regionId: '32.14',
    regionName: 'Kab. Purwakarta',
    instansiPengelola: 'UPTD Pasar DKUPP Kab. Purwakarta',
    markets: [
      { id: 'psr-pwk-01', name: 'Pasar Induk Cikopo', kecamatan: 'Bungursari', pengelola: 'UPTD Pasar Cikopo' },
      { id: 'psr-pwkkab-01', name: 'Pasar Rebo Purwakarta', kecamatan: 'Purwakarta', pengelola: 'UPTD Pasar Rebo' },
      { id: 'psr-pwk-03', name: 'Pasar Leuwi Panjang', kecamatan: 'Purwakarta', pengelola: 'UPTD Pasar Purwakarta' },
      { id: 'psr-pwk-04', name: 'Pasar Plered Purwakarta', kecamatan: 'Plered', pengelola: 'UPTD Pasar Plered' },
    ],
  },
  '32.15': {
    regionId: '32.15',
    regionName: 'Kab. Karawang',
    instansiPengelola: 'UPTD Pasar Disperindag Kab. Karawang',
    markets: [
      { id: 'psr-krwkab-01', name: 'Pasar Induk Johar Karawang', kecamatan: 'Karawang Timur', pengelola: 'UPTD Pasar Wilayah I' },
      { id: 'psr-krw-02', name: 'Pasar Baru Karawang', kecamatan: 'Karawang Barat', pengelola: 'UPTD Pasar Wilayah I' },
      { id: 'psr-krw-03', name: 'Pasar Cikampek', kecamatan: 'Cikampek', pengelola: 'UPTD Pasar Wilayah II' },
      { id: 'psr-krw-04', name: 'Pasar Rengasdengklok', kecamatan: 'Rengasdengklok', pengelola: 'UPTD Pasar Wilayah III' },
      { id: 'psr-krw-05', name: 'Pasar Cilamaya', kecamatan: 'Cilamaya Wetan', pengelola: 'UPTD Pasar Cilamaya' },
    ],
  },
  '32.16': {
    regionId: '32.16',
    regionName: 'Kab. Bekasi',
    instansiPengelola: 'UPTD Pengelolaan Pasar Dinas Perdagangan Kab. Bekasi',
    markets: [
      { id: 'psr-bekasikab-01', name: 'Pasar Baru Cikarang', kecamatan: 'Cikarang Utara', pengelola: 'UPTD Pasar Cikarang' },
      { id: 'psr-bkskab-01', name: 'Pasar Induk Cibitung', kecamatan: 'Cibitung', pengelola: 'UPTD Pasar Cibitung' },
      { id: 'psr-bkskab-03', name: 'Pasar Tambun', kecamatan: 'Tambun Selatan', pengelola: 'UPTD Pasar Tambun' },
      { id: 'psr-bkskab-04', name: 'Pasar Setu', kecamatan: 'Setu', pengelola: 'UPTD Pasar Setu' },
      { id: 'psr-bkskab-05', name: 'Pasar Babelan', kecamatan: 'Babelan', pengelola: 'UPTD Pasar Babelan' },
    ],
  },
  '32.17': {
    regionId: '32.17',
    regionName: 'Kab. Bandung Barat',
    instansiPengelola: 'UPTD Pasar Disperindag Kab. Bandung Barat',
    markets: [
      { id: 'psr-kbb-01', name: 'Pasar Panorama Lembang', kecamatan: 'Lembang', pengelola: 'UPTD Pasar Lembang' },
      { id: 'psr-kbb-02', name: 'Pasar Tagog Padalarang', kecamatan: 'Padalarang', pengelola: 'UPTD Pasar Padalarang' },
      { id: 'psr-kbb-03', name: 'Pasar Curug Agung', kecamatan: 'Padalarang', pengelola: 'UPTD Pasar Padalarang' },
      { id: 'psr-kbb-04', name: 'Pasar Batujajar', kecamatan: 'Batujajar', pengelola: 'UPTD Pasar Batujajar' },
      { id: 'psr-kbb-05', name: 'Pasar Rajamandala', kecamatan: 'Cipatat', pengelola: 'UPTD Pasar Cipatat' },
    ],
  },
  '32.18': {
    regionId: '32.18',
    regionName: 'Kab. Pangandaran',
    instansiPengelola: 'UPTD Pasar Disdagkop & UMKM Kab. Pangandaran',
    markets: [
      { id: 'psr-pnd-01', name: 'Pasar Pananjung Pangandaran', kecamatan: 'Pangandaran', pengelola: 'UPTD Pasar Pangandaran' },
      { id: 'psr-pnd-02', name: 'Pasar Parigi', kecamatan: 'Parigi', pengelola: 'UPTD Pasar Parigi' },
      { id: 'psr-pnd-03', name: 'Pasar Padaherang', kecamatan: 'Padaherang', pengelola: 'UPTD Pasar Padaherang' },
      { id: 'psr-pgd-01', name: 'Pasar Kalipucang', kecamatan: 'Kalipucang', pengelola: 'UPTD Pasar Kalipucang' },
    ],
  },
  '32.71': {
    regionId: '32.71',
    regionName: 'Kota Bogor',
    instansiPengelola: 'Perumda Pasar Pakuan Jaya Kota Bogor',
    markets: [
      { id: 'psr-bogorkot-01', name: 'Pasar Anyar Bogor (Kebon Kembang)', kecamatan: 'Bogor Tengah', pengelola: 'Perumda Pasar Pakuan Jaya' },
      { id: 'psr-bgrkota-02', name: 'Pasar Baru Bogor', kecamatan: 'Bogor Tengah', pengelola: 'Perumda Pasar Pakuan Jaya' },
      { id: 'psr-bgrkota-03', name: 'Pasar Jambu Dua', kecamatan: 'Bogor Utara', pengelola: 'Perumda Pasar Pakuan Jaya' },
      { id: 'psr-bgrkota-04', name: 'Pasar Sukasari', kecamatan: 'Bogor Timur', pengelola: 'Perumda Pasar Pakuan Jaya' },
      { id: 'psr-bgrkota-05', name: 'Pasar Gunung Batu', kecamatan: 'Bogor Barat', pengelola: 'Perumda Pasar Pakuan Jaya' },
    ],
  },
  '32.72': {
    regionId: '32.72',
    regionName: 'Kota Sukabumi',
    instansiPengelola: 'UPT Pasar Diskumindag Kota Sukabumi',
    markets: [
      { id: 'psr-smikot-01', name: 'Pasar Pelita Sukabumi', kecamatan: 'Cikole', pengelola: 'UPT Pasar Diskumindag' },
      { id: 'psr-smikota-02', name: 'Pasar Tipar Gede (Pasar Gudang)', kecamatan: 'Citamiang', pengelola: 'UPT Pasar Diskumindag' },
      { id: 'psr-smikota-03', name: 'Pasar Lembursitu', kecamatan: 'Lembursitu', pengelola: 'UPT Pasar Diskumindag' },
      { id: 'psr-smikota-04', name: 'Pasar Degung', kecamatan: 'Gunungpuyuh', pengelola: 'UPT Pasar Diskumindag' },
    ],
  },
  '32.73': {
    regionId: '32.73',
    regionName: 'Kota Bandung',
    instansiPengelola: 'Perumda Pasar Juara Kota Bandung',
    markets: [
      { id: 'psr-bdgkot-01', name: 'Pasar Induk Caringin', kecamatan: 'Babakan Ciparay', pengelola: 'Pasar Induk Kota Bandung' },
      { id: 'psr-bdgkota-02', name: 'Pasar Kosambi', kecamatan: 'Sumur Bandung', pengelola: 'Perumda Pasar Juara' },
      { id: 'psr-bdgkota-03', name: 'Pasar Baru Trade Center', kecamatan: 'Andir', pengelola: 'Perumda Pasar Juara' },
      { id: 'psr-bdgkota-04', name: 'Pasar Sederhana', kecamatan: 'Sukajadi', pengelola: 'Perumda Pasar Juara' },
      { id: 'psr-bdgkota-05', name: 'Pasar Kiara Condong', kecamatan: 'Kiaracondong', pengelola: 'Perumda Pasar Juara' },
      { id: 'psr-bdgkota-06', name: 'Pasar Ciroyom', kecamatan: 'Andir', pengelola: 'Perumda Pasar Juara' },
      { id: 'psr-bdgkota-07', name: 'Pasar Andir', kecamatan: 'Andir', pengelola: 'Perumda Pasar Juara' },
    ],
  },
  '32.74': {
    regionId: '32.74',
    regionName: 'Kota Cirebon',
    instansiPengelola: 'Perumda Pasar Berintan Kota Cirebon',
    markets: [
      { id: 'psr-crbkot-01', name: 'Pasar Kanoman', kecamatan: 'Lemahwungkuk', pengelola: 'Perumda Pasar Berintan' },
      { id: 'psr-crbkota-02', name: 'Pasar Pagi Cirebon', kecamatan: 'Kejaksan', pengelola: 'Perumda Pasar Berintan' },
      { id: 'psr-crbkota-03', name: 'Pasar Induk Jagasatru', kecamatan: 'Pekalipan', pengelola: 'Perumda Pasar Berintan' },
      { id: 'psr-crbkota-04', name: 'Pasar Harjamukti', kecamatan: 'Harjamukti', pengelola: 'Perumda Pasar Berintan' },
      { id: 'psr-crbkota-05', name: 'Pasar Gunungsari', kecamatan: 'Kesambi', pengelola: 'Perumda Pasar Berintan' },
    ],
  },
  '32.75': {
    regionId: '32.75',
    regionName: 'Kota Bekasi',
    instansiPengelola: 'UPTD Pasar Disdagperin Kota Bekasi',
    markets: [
      { id: 'psr-bekasikot-01', name: 'Pasar Baru Bekasi', kecamatan: 'Bekasi Timur', pengelola: 'UPTD Pasar Baru Bekasi' },
      { id: 'psr-bkskota-02', name: 'Pasar Kranji Baru', kecamatan: 'Bekasi Barat', pengelola: 'UPTD Pasar Kranji' },
      { id: 'psr-bkskota-03', name: 'Pasar Pondok Gede', kecamatan: 'Pondokgede', pengelola: 'UPTD Pasar Pondok Gede' },
      { id: 'psr-bkskota-04', name: 'Pasar Kranggan', kecamatan: 'Jatisampurna', pengelola: 'UPTD Pasar Kranggan' },
      { id: 'psr-bkskota-05', name: 'Pasar Wisma Asri', kecamatan: 'Bekasi Utara', pengelola: 'UPTD Pasar Wisma Asri' },
    ],
  },
  '32.76': {
    regionId: '32.76',
    regionName: 'Kota Depok',
    instansiPengelola: 'UPTD Pasar Disdagin Kota Depok',
    markets: [
      { id: 'psr-dpk-01', name: 'Pasar Agung Depok', kecamatan: 'Sukmajaya', pengelola: 'UPTD Pasar Agung' },
      { id: 'psr-dpk-02', name: 'Pasar Cisalak', kecamatan: 'Cimanggis', pengelola: 'UPTD Pasar Cisalak' },
      { id: 'psr-depokkot-01', name: 'Pasar Kemiri Muka', kecamatan: 'Beji', pengelola: 'UPTD Pasar Kemiri Muka' },
      { id: 'psr-dpk-04', name: 'Pasar Tugu Depok', kecamatan: 'Cimanggis', pengelola: 'UPTD Pasar Tugu' },
      { id: 'psr-dpk-05', name: 'Pasar Sukatani Depok', kecamatan: 'Tapos', pengelola: 'UPTD Pasar Sukatani' },
    ],
  },
  '32.77': {
    regionId: '32.77',
    regionName: 'Kota Cimahi',
    instansiPengelola: 'UPT Pasar Disdagkoperin Kota Cimahi',
    markets: [
      { id: 'psr-cmhkot-01', name: 'Pasar Atas Baru Cimahi', kecamatan: 'Cimahi Tengah', pengelola: 'UPT Pasar Kota Cimahi' },
      { id: 'psr-cmh-02', name: 'Pasar Antri Baru', kecamatan: 'Cimahi Tengah', pengelola: 'UPT Pasar Kota Cimahi' },
      { id: 'psr-cmh-03', name: 'Pasar Cimindi', kecamatan: 'Cimahi Selatan', pengelola: 'UPT Pasar Kota Cimahi' },
      { id: 'psr-cmh-04', name: 'Pasar Melong', kecamatan: 'Cimahi Selatan', pengelola: 'UPT Pasar Kota Cimahi' },
    ],
  },
  '32.78': {
    regionId: '32.78',
    regionName: 'Kota Tasikmalaya',
    instansiPengelola: 'Perumda Pasar Resik Kota Tasikmalaya',
    markets: [
      { id: 'psr-tasikkt-01', name: 'Pasar Induk Cikurubuk', kecamatan: 'Mangkubumi', pengelola: 'Perumda Pasar Resik' },
      { id: 'psr-tsmkota-02', name: 'Pasar Pancasila', kecamatan: 'Tawang', pengelola: 'Perumda Pasar Resik' },
      { id: 'psr-tsmkota-03', name: 'Pasar Padayungan', kecamatan: 'Cihideung', pengelola: 'Perumda Pasar Resik' },
      { id: 'psr-tsmkota-04', name: 'Pasar Indihiang', kecamatan: 'Indihiang', pengelola: 'Perumda Pasar Resik' },
    ],
  },
  '32.79': {
    regionId: '32.79',
    regionName: 'Kota Banjar',
    instansiPengelola: 'UPTD Pasar Dinas KUKMP Kota Banjar',
    markets: [
      { id: 'psr-bjr-01', name: 'Pasar Kota Banjar (Muktisari)', kecamatan: 'Banjar', pengelola: 'UPTD Pasar Banjar' },
      { id: 'psr-bjr-02', name: 'Pasar Langensari', kecamatan: 'Langensari', pengelola: 'UPTD Pasar Langensari' },
      { id: 'psr-bjr-03', name: 'Pasar Bojongkantong', kecamatan: 'Langensari', pengelola: 'UPTD Pasar Langensari' },
    ],
  },
};
