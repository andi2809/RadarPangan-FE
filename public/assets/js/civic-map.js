/**
 * RADAR PANGAN — CIVIC GIS MAP ENGINE
 * Ringan, Responsif, Berbasis GeoJSON Lokal (38 Provinsi & 27 Kab/Kota Jabar)
 * Menampilkan Disparitas Faktual Terhadap Harga Acuan Penjualan (HAP)
 */

class CivicMapEngine {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = Object.assign({
      defaultScope: 'jabar', // 'jabar' or 'nasional'
      defaultCommodity: 'cabai-rawit',
      onSelectRegion: null
    }, options);

    this.map = null;
    this.geoJsonLayer = null;
    this.currentScope = this.options.defaultScope;
    this.currentCommodity = this.options.defaultCommodity;
    this.geoDataCache = {
      nasional: null,
      jabar: null
    };

    this.selectedFeature = null;
    this.init();
  }

  async init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Initialize Leaflet Map
    this.map = L.map(this.containerId, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true
    });

    // Clean, high-contrast, distraction-free basemap (CartoDB Positron / OpenStreetMap Canvas)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 14,
      minZoom: 4,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Load GeoJSONs
    await this.loadData();
    this.render();
  }

  async loadData() {
    try {
      const [jabarRes, provRes] = await Promise.all([
        fetch('assets/data/jabar-kabupaten.geojson').then(r => r.json()),
        fetch('assets/data/provinsi-38.geojson').then(r => r.json())
      ]);
      this.geoDataCache.jabar = jabarRes;
      this.geoDataCache.nasional = provRes;
    } catch (err) {
      console.error('Failed to load GeoJSON datasets:', err);
    }
  }

  setCommodity(commoditySlug) {
    this.currentCommodity = commoditySlug;
    this.updateLayerStyles();
  }

  setScope(scope) {
    if (this.currentScope === scope) return;
    this.currentScope = scope;
    this.render();
  }

  render() {
    if (!this.map) return;
    if (this.geoJsonLayer) {
      this.map.removeLayer(this.geoJsonLayer);
    }

    const geoData = this.currentScope === 'nasional' 
      ? this.geoDataCache.nasional 
      : this.geoDataCache.jabar;

    if (!geoData) return;

    this.geoJsonLayer = L.geoJSON(geoData, {
      style: (feature) => this.getFeatureStyle(feature),
      onEachFeature: (feature, layer) => this.bindFeatureEvents(feature, layer)
    }).addTo(this.map);

    // Auto-fit bounds
    if (this.currentScope === 'jabar') {
      this.map.fitBounds(this.geoJsonLayer.getBounds(), { padding: [24, 24] });
    } else {
      // Indonesia Bounding
      this.map.fitBounds([[-11.0, 95.0], [6.0, 141.0]], { padding: [16, 16] });
    }
  }

  getRegionCommodityData(feature) {
    const db = window.RADAR_PANGAN_DATA;
    if (!db) return null;

    if (this.currentScope === 'jabar') {
      const kode = String(feature.properties.kode_kab);
      const district = db.jabar_districts[kode];
      if (district && district.commodities[this.currentCommodity]) {
        return {
          regionName: district.nama,
          regionCode: kode,
          isKab: true,
          provinsi: district.provinsi,
          marketsCount: district.pasar_pantau,
          comm: district.commodities[this.currentCommodity]
        };
      }
    } else {
      const kode = String(feature.properties.kode);
      const prov = db.provinces[kode];
      if (prov && prov.commodities[this.currentCommodity]) {
        return {
          regionName: prov.nama,
          regionCode: kode,
          isKab: false,
          provinsi: prov.nama,
          marketsCount: prov.pasar_pantau,
          comm: prov.commodities[this.currentCommodity]
        };
      }
    }
    return null;
  }

  getFeatureStyle(feature) {
    const info = this.getRegionCommodityData(feature);
    let fillColor = '#e2e8f0';
    let fillOpacity = 0.85;

    if (info && info.comm) {
      switch (info.comm.status) {
        case 'bawah':
          fillColor = '#81c784'; // Sage Green
          break;
        case 'sesuai':
          fillColor = '#80cbc4'; // Calm Teal
          break;
        case 'atas':
          fillColor = '#ffd54f'; // Warm Ochre
          break;
        case 'tinggi':
          fillColor = '#e57373'; // Muted Terracotta
          break;
      }
    }

    return {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      color: '#18181b', // Crisp Ink Border
      weight: 1.75,
      dashArray: ''
    };
  }

  updateLayerStyles() {
    if (!this.geoJsonLayer) return;
    this.geoJsonLayer.eachLayer((layer) => {
      layer.setStyle(this.getFeatureStyle(layer.feature));
    });
  }

  bindFeatureEvents(feature, layer) {
    const self = this;

    layer.on({
      mouseover: (e) => {
        const lyr = e.target;
        lyr.setStyle({
          weight: 3,
          color: '#000000',
          fillOpacity: 0.95
        });
        lyr.bringToFront();
      },
      mouseout: (e) => {
        self.geoJsonLayer.resetStyle(e.target);
      },
      click: (e) => {
        const info = self.getRegionCommodityData(feature);
        if (info && self.options.onSelectRegion) {
          self.options.onSelectRegion(info);
        }
      }
    });

    // Custom Tooltip
    const info = this.getRegionCommodityData(feature);
    if (info) {
      const commMeta = window.RADAR_PANGAN_DATA.commodities[this.currentCommodity];
      const statusMeta = window.RadarHelpers.getStatusMeta(info.comm.status);
      const diffSign = info.comm.diff_rp >= 0 ? '+' : '';
      const diffClass = info.comm.diff_rp >= 0 ? 'text-amber-800' : 'text-emerald-800';

      const tooltipContent = `
        <div style="min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <strong style="font-size: 0.9rem; color: #121826;">${info.regionName}</strong>
            <span class="civic-badge civic-badge-sm ${statusMeta.badgeClass}">${statusMeta.label}</span>
          </div>
          <div style="font-size: 0.75rem; color: #475569; margin-bottom: 8px;">
            ${commMeta ? commMeta.name : 'Komoditas'} • ${info.marketsCount} Titik Pantau Pasar
          </div>
          <div style="background-color: #f8f7f4; border: 1.5px solid #18181b; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
            <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Harga Eceran Rata-rata</div>
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span class="tabular-nums" style="font-size: 1.1rem; font-weight: 700; color: #121826;">
                ${window.RadarHelpers.formatRupiah(info.comm.price)}
              </span>
              <span class="tabular-nums ${diffClass}" style="font-size: 0.75rem; font-weight: 700;">
                ${diffSign}${window.RadarHelpers.formatNumber(info.comm.diff_rp)} (${window.RadarHelpers.formatPercent(info.comm.diff_pct)})
              </span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569; margin-bottom: 8px;">
            <span>Acuan HAP: <b class="tabular-nums">${window.RadarHelpers.formatRupiah(commMeta ? commMeta.hap : 0)}</b></span>
            <span>Deviasi: <b class="tabular-nums">${diffSign}${info.comm.hap_pct}%</b></span>
          </div>
          <a href="harga.html?wilayah=${info.regionCode}&komoditas=${self.currentCommodity}" 
             style="display: block; text-align: center; padding: 5px; background: #1b4332; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 0.75rem; border: 1px solid #18181b;">
            Lihat Rincian Pasar & Riwayat →
          </a>
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        className: 'map-civic-tooltip',
        sticky: true,
        direction: 'auto',
        opacity: 1
      });
    }
  }
}

window.CivicMapEngine = CivicMapEngine;
