'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import commoditiesData from '../../data/mock/commodities.json';
import regionsData from '../../data/mock/regions.json';
import telemetryData from '../../data/mock/telemetry.json';

interface GeoFeature {
  type: 'Feature';
  properties: {
    id: string;
    codeBps?: string;
    name: string;
    rawName?: string;
    type?: string;
    provinceId?: string;
    provinceName?: string;
    isJabar?: boolean;
    hasData?: boolean;
    centroid?: { lng: number; lat: number } | null;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any[];
  };
}

interface GeoCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

function formatDateID(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || 'Oktober'} ${parts[0]}`;
}

function formatShortDateID(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || 'Okt'}`;
}

function computeFeatureBounds(features: GeoFeature[]): [number, number, number, number] {
  let minLng = 180;
  let minLat = 90;
  let maxLng = -180;
  let maxLat = -90;

  for (const f of features) {
    const geom = f.geometry;
    if (!geom || !geom.coordinates) continue;
    const rings =
      geom.type === 'Polygon'
        ? geom.coordinates
        : geom.type === 'MultiPolygon'
        ? geom.coordinates.flat(1)
        : [];
    for (const ring of rings) {
      for (const pt of ring) {
        const lng = pt[0];
        const lat = pt[1];
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }

  if (minLng > maxLng) return [106.3, -7.85, 108.85, -5.9];
  return [minLng, minLat, maxLng, maxLat];
}

export const GisMapSection: React.FC = () => {
  // Filter States
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('cabai_rawit_merah');
  const [selectedProvince, setSelectedProvince] = useState<string>('Jawa Barat');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');

  // GeoJSON States
  const [jabarGeo, setJabarGeo] = useState<GeoCollection | null>(null);
  const [indoGeo, setIndoGeo] = useState<GeoCollection | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(true);

  // Interactive Map Hover State
  const [hoveredFeature, setHoveredFeature] = useState<{
    feature: GeoFeature;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // Interactive Chart Hover State
  const [hoveredChartIdx, setHoveredChartIdx] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/geo/jabar-27-kabkota.geojson').then((r) => (r.ok ? r.json() : null)),
      fetch('/geo/indonesia-kabkota.geojson').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([jabarData, indoData]) => {
        if (!mounted) return;
        if (jabarData) setJabarGeo(jabarData);
        if (indoData) setIndoGeo(indoData);
        setGeoLoading(false);
      })
      .catch(() => {
        if (mounted) setGeoLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeCommodity = useMemo(() => {
    return commoditiesData.find((c) => c.id === selectedCommodityId) || commoditiesData[1];
  }, [selectedCommodityId]);

  const commodityTelemetryMap = useMemo(() => {
    return (telemetryData as Record<string, Record<string, any>>)[activeCommodity.id] || {};
  }, [activeCommodity.id]);

  // Extract sorted list of all 38 provinces from Indonesia GeoJSON
  const provinceList = useMemo(() => {
    if (!indoGeo?.features) return ['Jawa Barat'];
    const set = new Set<string>();
    indoGeo.features.forEach((f) => {
      if (f.properties?.provinceName) set.add(f.properties.provinceName);
    });
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
    // Put Jawa Barat at top of province list for convenience
    return ['Jawa Barat', ...arr.filter((p) => p !== 'Jawa Barat')];
  }, [indoGeo]);

  // Available Kabupaten/Kota options for the currently selected province
  const availableRegencies = useMemo(() => {
    if (selectedProvince === 'Jawa Barat' || selectedProvince === 'ALL') {
      return [...regionsData].sort((a, b) => a.name.localeCompare(b.name, 'id'));
    }
    if (!indoGeo?.features) return [];
    return indoGeo.features
      .filter((f) => f.properties?.provinceName === selectedProvince)
      .map((f) => ({
        id: f.properties.id,
        name: f.properties.name,
        provinceName: f.properties.provinceName || selectedProvince,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }, [selectedProvince, indoGeo]);

  // Handle Province filter change
  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedRegionId('ALL');
  };

  // Handle Regency filter change
  const handleRegionChange = (regId: string) => {
    setSelectedRegionId(regId);
    if (regId !== 'ALL' && regId.startsWith('32.') && selectedProvince === 'ALL') {
      setSelectedProvince('Jawa Barat');
    }
  };

  // Reset to full Indonesia view
  const handleResetToIndonesia = () => {
    setSelectedProvince('ALL');
    setSelectedRegionId('ALL');
  };

  // Focus on Jawa Barat (27 Kab/Kota with active telemetry)
  const handleFocusJabar = () => {
    setSelectedProvince('Jawa Barat');
    setSelectedRegionId('ALL');
  };

  // Determine which features to render & projection bounds
  const projectedMap = useMemo(() => {
    const svgWidth = 860;
    const svgHeight = 440;
    const padX = 28;
    const padY = 24;

    let featuresToRender: GeoFeature[] = [];
    let boundsFeatures: GeoFeature[] = [];

    if (selectedProvince === 'Jawa Barat') {
      // Render surrounding Java context from indoGeo + high-detail 27 Jabar features
      const contextFeatures =
        indoGeo?.features.filter(
          (f) =>
            f.properties?.provinceName &&
            ['Banten', 'DKI Jakarta', 'Jawa Tengah'].includes(f.properties.provinceName)
        ) || [];
      const coreJabar = jabarGeo?.features || [];
      featuresToRender = [...contextFeatures, ...coreJabar];
      boundsFeatures = coreJabar.length > 0 ? coreJabar : featuresToRender;
    } else if (selectedProvince === 'ALL') {
      featuresToRender = indoGeo?.features || jabarGeo?.features || [];
      boundsFeatures = featuresToRender;
    } else {
      const provFeatures =
        indoGeo?.features.filter((f) => f.properties?.provinceName === selectedProvince) || [];
      featuresToRender = provFeatures;
      boundsFeatures = provFeatures;
    }

    if (featuresToRender.length === 0) {
      return { paths: [], svgWidth, svgHeight };
    }

    const [minLng, minLat, maxLng, maxLat] = computeFeatureBounds(boundsFeatures);
    // Add slight breathing room around bounds
    const lngSpan = Math.max(maxLng - minLng, 0.25);
    const latSpan = Math.max(maxLat - minLat, 0.25);
    const bMinLng = minLng - lngSpan * 0.06;
    const bMaxLng = maxLng + lngSpan * 0.06;
    const bMinLat = minLat - latSpan * 0.06;
    const bMaxLat = maxLat + latSpan * 0.06;

    const dLng = bMaxLng - bMinLng;
    const dLat = bMaxLat - bMinLat;
    const availW = svgWidth - padX * 2;
    const availH = svgHeight - padY * 2;
    const scale = Math.min(availW / dLng, availH / dLat);
    const offsetX = padX + (availW - dLng * scale) / 2;
    const offsetY = padY + (availH - dLat * scale) / 2;

    const projectPt = (lng: number, lat: number): [number, number] => {
      const x = offsetX + (lng - bMinLng) * scale;
      const y = offsetY + (bMaxLat - lat) * scale;
      return [x, y];
    };

    const paths = featuresToRender.map((feat, idx) => {
      const geom = feat.geometry;
      const rings: any[][] =
        geom.type === 'Polygon'
          ? geom.coordinates
          : geom.type === 'MultiPolygon'
          ? geom.coordinates.flat(1)
          : [];

      let d = '';
      let sumX = 0;
      let sumY = 0;
      let countPts = 0;

      for (const ring of rings) {
        if (!ring || ring.length === 0) continue;
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = projectPt(ring[i][0], ring[i][1]);
          d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          sumX += x;
          sumY += y;
          countPts++;
        }
        d += 'Z ';
      }

      const cx = countPts > 0 ? sumX / countPts : svgWidth / 2;
      const cy = countPts > 0 ? sumY / countPts : svgHeight / 2;

      return {
        key: `${feat.properties.id || idx}-${idx}`,
        feature: feat,
        d: d.trim(),
        cx,
        cy,
      };
    });

    return { paths, svgWidth, svgHeight };
  }, [jabarGeo, indoGeo, selectedProvince]);

  // Semantic fill color for each feature
  const getFeatureStyle = (feat: GeoFeature) => {
    const regId = feat.properties?.id;
    const telem = regId ? commodityTelemetryMap[regId] : undefined;
    const isSelected = selectedRegionId !== 'ALL' && selectedRegionId === regId;
    const isDimmedBySelection = selectedRegionId !== 'ALL' && !isSelected;

    // Region WITHOUT telemetry data
    if (!telem || !telem.currentPrice) {
      return {
        fill: isSelected ? '#bfb7a6' : '#ddd6c7',
        stroke: isSelected ? '#1e221f' : '#b8b0a0',
        strokeWidth: isSelected ? 2.2 : 0.8,
        opacity: isDimmedBySelection ? 0.55 : 0.9,
        hasTelemetry: false,
      };
    }

    const status = telem.currentPrice.status;
    let baseFill = '#4b9d73'; // Aman / Sesuai Acuan
    if (status === 'kritis') {
      baseFill = '#e85b4f'; // Di Atas Acuan (> +10%)
    } else if (status === 'waspada') {
      baseFill = '#e69b39'; // Fluktuasi Sedang (+5% s.d. +10%)
    } else if (status === 'turun') {
      baseFill = '#2d7a9c'; // Di Bawah Acuan (< -5%)
    }

    return {
      fill: baseFill,
      stroke: isSelected ? '#1e221f' : '#fffdf7',
      strokeWidth: isSelected ? 2.8 : selectedProvince === 'ALL' ? 0.6 : 1.25,
      opacity: isDimmedBySelection ? 0.42 : 1,
      hasTelemetry: true,
    };
  };

  // Dynamic Summary Metrics (Computed from real telemetry)
  const dynamicSummary = useMemo(() => {
    const allJabarEntries = Object.values(commodityTelemetryMap);
    const totalJabarCount = allJabarEntries.length || 27;

    // Case 1: A specific Kabupaten/Kota in Jawa Barat is selected
    if (selectedRegionId !== 'ALL' && commodityTelemetryMap[selectedRegionId]) {
      const regMeta = regionsData.find((r) => r.id === selectedRegionId);
      const t = commodityTelemetryMap[selectedRegionId];
      const cur = t.currentPrice;
      const hist: { date: string; hargaRp: number }[] = t.history14d || [];
      const firstPrice = hist.length > 0 ? hist[0].hargaRp : cur.hargaAktualRp;
      const change14dPct =
        firstPrice > 0 ? (((cur.hargaAktualRp - firstPrice) / firstPrice) * 100).toFixed(1) : '0.0';

      return {
        mode: 'single_region' as const,
        title: `Ringkasan: ${regMeta?.name || selectedRegionId}`,
        subtitle: `Provinsi Jawa Barat • Observasi ${formatDateID(cur.date)}`,
        primaryLabel: `Harga Rata-Rata ${activeCommodity.name}`,
        primaryValue: `Rp ${cur.hargaAktualRp.toLocaleString('id-ID')}/${activeCommodity.satuan}`,
        primarySub: `Acuan ${activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'}: Rp ${cur.hargaAcuanRp.toLocaleString('id-ID')} (${
          cur.selisihPersen > 0 ? `+${cur.selisihPersen}%` : `${cur.selisihPersen}%`
        })`,
        secondaryLabel: 'Perubahan Harga 14 Hari Terakhir',
        secondaryValue: `${Number(change14dPct) > 0 ? '+' : ''}${change14dPct}%`,
        secondarySub: `Dari Rp ${firstPrice.toLocaleString('id-ID')} (9 Okt) ke Rp ${cur.hargaAktualRp.toLocaleString('id-ID')} (23 Okt)`,
        tertiaryLabel: 'Perbandingan Daya Beli (UMK Daerah)',
        tertiaryValue: regMeta
          ? `Rp ${(regMeta.umk2026 / 1000000).toFixed(2)} Juta/bln`
          : '-',
        tertiarySub: `Estimasi rasio beban komoditas thd. UMK: ${t.affordability?.umkRatioBasketPercent ?? '-'}%`,
        ctaRegionId: selectedRegionId,
        hasData: true,
      };
    }

    // Case 2: Another Province outside Jawa Barat is selected (No telemetry dataset yet)
    if (selectedProvince !== 'Jawa Barat' && selectedProvince !== 'ALL') {
      const selectedRegName =
        selectedRegionId !== 'ALL'
          ? availableRegencies.find((r) => r.id === selectedRegionId)?.name
          : null;
      return {
        mode: 'no_data_province' as const,
        title: selectedRegName
          ? `Ringkasan: ${selectedRegName}`
          : `Ringkasan: Provinsi ${selectedProvince}`,
        subtitle: 'Status Cakupan Dataset Wilayah',
        primaryLabel: 'Ketersediaan Data Telemetri Harian',
        primaryValue: 'Belum Tersedia',
        primarySub: `Geometri batas administrasi ${selectedProvince} telah terintegrasi (${availableRegencies.length} Kab/Kota).`,
        secondaryLabel: 'Wilayah dengan Data Telemetri Aktif',
        secondaryValue: '27 Kab/Kota (Jawa Barat)',
        secondarySub:
          'Pilih Provinsi Jawa Barat untuk meninjau data observasi harian lengkap beserta perbandingan HAP/HET.',
        tertiaryLabel: `Acuan Nasional ${activeCommodity.name}`,
        tertiaryValue: `Rp ${activeCommodity.hargaAcuanRp.toLocaleString('id-ID')}/${activeCommodity.satuan}`,
        tertiarySub: activeCommodity.deskripsi,
        ctaRegionId: '32.73',
        hasData: false,
      };
    }

    // Case 3: Aggregate Summary across all 27 Kab/Kota in Jawa Barat (or National overview)
    let sumPrice = 0;
    let controlledCount = 0;
    let sumChange14d = 0;
    let minEntry: { name: string; price: number } | null = null;
    let maxEntry: { name: string; price: number } | null = null;

    allJabarEntries.forEach((t: any) => {
      const price = t.currentPrice.hargaAktualRp;
      sumPrice += price;
      if (t.currentPrice.status === 'aman' || t.currentPrice.status === 'turun') {
        controlledCount++;
      }
      const hist = t.history14d || [];
      if (hist.length > 0 && hist[0].hargaRp > 0) {
        sumChange14d += ((price - hist[0].hargaRp) / hist[0].hargaRp) * 100;
      }
      const rName = regionsData.find((r) => r.id === t.regionId)?.name || t.regionId;
      if (!minEntry || price < minEntry.price) minEntry = { name: rName, price };
      if (!maxEntry || price > maxEntry.price) maxEntry = { name: rName, price };
    });

    const avgPrice = Math.round(sumPrice / Math.max(1, totalJabarCount));
    const avgDiffPct = (
      ((avgPrice - activeCommodity.hargaAcuanRp) / activeCommodity.hargaAcuanRp) *
      100
    ).toFixed(1);
    const controlledPct = ((controlledCount / Math.max(1, totalJabarCount)) * 100).toFixed(1);
    const avgChange14d = (sumChange14d / Math.max(1, totalJabarCount)).toFixed(1);

    return {
      mode: 'aggregate_jabar' as const,
      title:
        selectedProvince === 'ALL'
          ? 'Ringkasan Data Nasional (Sampel Jawa Barat)'
          : 'Ringkasan Provinsi Jawa Barat',
      subtitle: `27 Kabupaten/Kota • Observasi 23 Oktober 2026`,
      primaryLabel: `Rata-Rata Harga ${activeCommodity.name}`,
      primaryValue: `Rp ${avgPrice.toLocaleString('id-ID')}/${activeCommodity.satuan}`,
      primarySub: `Acuan ${activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'}: Rp ${activeCommodity.hargaAcuanRp.toLocaleString('id-ID')} (${
        Number(avgDiffPct) > 0 ? `+${avgDiffPct}%` : `${avgDiffPct}%`
      })`,
      secondaryLabel: 'Wilayah Sesuai / Di Bawah Acuan (≤ +5%)',
      secondaryValue: `${controlledCount} dari ${totalJabarCount} Wilayah (${controlledPct}%)`,
      secondarySub: `Rata-rata perubahan 14 hari terakhir: ${
        Number(avgChange14d) > 0 ? `+${avgChange14d}%` : `${avgChange14d}%`
      }`,
      tertiaryLabel: 'Rentang Harga Antarwilayah',
      tertiaryValue:
        minEntry && maxEntry
          ? `Rp ${(minEntry as { name: string; price: number }).price.toLocaleString('id-ID')} – Rp ${(maxEntry as { name: string; price: number }).price.toLocaleString('id-ID')}`
          : '-',
      tertiarySub:
        minEntry && maxEntry
          ? `Terendah: ${(minEntry as { name: string; price: number }).name} • Tertinggi: ${(maxEntry as { name: string; price: number }).name}`
          : '',
      ctaRegionId: '32.75',
      hasData: true,
    };
  }, [
    commodityTelemetryMap,
    selectedRegionId,
    selectedProvince,
    activeCommodity,
    availableRegencies,
  ]);

  // Historical + Projected H+7 Chart Series for Selected Location & Commodity
  const chartData = useMemo(() => {
    const allEntries = Object.values(commodityTelemetryMap);
    const isSpecificJabar =
      selectedRegionId !== 'ALL' && Boolean(commodityTelemetryMap[selectedRegionId]);

    const targetTelemetry = isSpecificJabar
      ? commodityTelemetryMap[selectedRegionId]
      : null;

    const locationLabel = isSpecificJabar
      ? regionsData.find((r) => r.id === selectedRegionId)?.name || selectedRegionId
      : 'Rata-Rata 27 Kab/Kota Jawa Barat';

    // Build 15-day historical series
    let histSeries: { date: string; label: string; price: number; isProjection: boolean }[] = [];

    if (targetTelemetry?.history14d) {
      histSeries = targetTelemetry.history14d.map((h: any) => ({
        date: h.date,
        label: formatShortDateID(h.date),
        price: h.hargaRp,
        isProjection: false,
      }));
    } else if (allEntries.length > 0) {
      const templateHist = (allEntries[0] as any).history14d || [];
      histSeries = templateHist.map((h: any, idx: number) => {
        const avg = Math.round(
          allEntries.reduce(
            (acc: number, item: any) => acc + (item.history14d?.[idx]?.hargaRp || 0),
            0
          ) / allEntries.length
        );
        return {
          date: h.date,
          label: formatShortDateID(h.date),
          price: avg,
          isProjection: false,
        };
      });
    }

    // Build H+7 projection endpoint
    let projPrice = activeCommodity.hargaAcuanRp;
    let projLower = activeCommodity.hargaAcuanRp;
    let projUpper = activeCommodity.hargaAcuanRp;
    let projDate = '2026-10-30';

    if (targetTelemetry?.predictionH7) {
      projPrice = targetTelemetry.predictionH7.hargaPrediksiH7Rp;
      projLower = targetTelemetry.predictionH7.confidenceLowerRp;
      projUpper = targetTelemetry.predictionH7.confidenceUpperRp;
      projDate = targetTelemetry.predictionH7.targetDate;
    } else if (allEntries.length > 0) {
      projPrice = Math.round(
        allEntries.reduce(
          (acc: number, item: any) => acc + (item.predictionH7?.hargaPrediksiH7Rp || 0),
          0
        ) / allEntries.length
      );
      projLower = Math.round(projPrice * 0.95);
      projUpper = Math.round(projPrice * 1.05);
    }

    const lastHist = histSeries[histSeries.length - 1];
    const midProjPrice = lastHist ? Math.round((lastHist.price + projPrice) / 2) : projPrice;

    const fullSeries = [
      ...histSeries,
      {
        date: '2026-10-27',
        label: '27 Okt (Est)',
        price: midProjPrice,
        isProjection: true,
      },
      {
        date: projDate,
        label: '30 Okt (H+7)',
        price: projPrice,
        isProjection: true,
      },
    ];

    // SVG Geometry
    const refRp = activeCommodity.hargaAcuanRp;
    const allPrices = fullSeries.map((d) => d.price).concat([refRp, projLower, projUpper]);
    const rawMin = Math.min(...allPrices);
    const rawMax = Math.max(...allPrices);
    const pad = Math.max((rawMax - rawMin) * 0.22, refRp * 0.05);
    const minVal = Math.max(0, Math.floor((rawMin - pad) / 500) * 500);
    const maxVal = Math.ceil((rawMax + pad) / 500) * 500;
    const range = Math.max(maxVal - minVal, 1000);

    const svgW = 860;
    const svgH = 250;
    const leftX = 68;
    const rightX = 830;
    const topY = 26;
    const bottomY = 205;
    const chartW = rightX - leftX;
    const chartH = bottomY - topY;

    const toY = (v: number) => bottomY - ((v - minVal) / range) * chartH;

    const plotted = fullSeries.map((item, idx) => {
      const x = leftX + (idx / Math.max(1, fullSeries.length - 1)) * chartW;
      const y = toY(item.price);
      const diffPct = (((item.price - refRp) / refRp) * 100).toFixed(1);
      return { ...item, x, y, diffPct };
    });

    const histPts = plotted.filter((p) => !p.isProjection);
    const projPts = plotted.length >= 3 ? plotted.slice(histPts.length - 1) : [];

    const histLine = histPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const histArea =
      histPts.length > 0
        ? `${histLine} L${histPts[histPts.length - 1].x.toFixed(1)},${bottomY} L${histPts[0].x.toFixed(1)},${bottomY} Z`
        : '';

    const projLine = projPts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');

    const confBand =
      projPts.length >= 2
        ? `M${projPts[0].x.toFixed(1)},${projPts[0].y.toFixed(1)} L${projPts[projPts.length - 1].x.toFixed(1)},${toY(projUpper).toFixed(1)} L${projPts[projPts.length - 1].x.toFixed(1)},${toY(projLower).toFixed(1)} Z`
        : '';

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
      const val = Math.round(minVal + (1 - t) * range);
      const y = topY + t * chartH;
      return { val, y };
    });

    return {
      locationLabel,
      plotted,
      histLine,
      histArea,
      projLine,
      confBand,
      hapY: toY(refRp),
      yTicks,
      svgW,
      svgH,
      leftX,
      rightX,
      bottomY,
    };
  }, [commodityTelemetryMap, selectedRegionId, activeCommodity]);

  // Tooltip data for hovered polygon on map
  const hoveredTooltipInfo = useMemo(() => {
    if (!hoveredFeature) return null;
    const props = hoveredFeature.feature.properties;
    const regId = props?.id;
    const telem = regId ? commodityTelemetryMap[regId] : undefined;

    if (!telem || !telem.currentPrice) {
      return {
        name: props?.name || 'Wilayah',
        province: props?.provinceName || 'Indonesia',
        hasData: false,
      };
    }

    const cur = telem.currentPrice;
    const hist = telem.history14d || [];
    const prevPrice = hist.length >= 2 ? hist[hist.length - 2].hargaRp : cur.movingAvg7d;
    const dailyChangePct =
      prevPrice > 0 ? (((cur.hargaAktualRp - prevPrice) / prevPrice) * 100).toFixed(1) : '0.0';

    return {
      name: props?.name || regId,
      province: props?.provinceName || 'Jawa Barat',
      hasData: true,
      priceRp: cur.hargaAktualRp,
      dateLabel: formatDateID(cur.date),
      dailyChangePct,
      hapRp: cur.hargaAcuanRp,
      hapDiffPct: cur.selisihPersen,
      status: cur.status,
    };
  }, [hoveredFeature, commodityTelemetryMap]);

  const activeChartPoint =
    hoveredChartIdx !== null ? chartData.plotted[hoveredChartIdx] : null;

  return (
    <section className="py-16 md:py-24 bg-[#f8f4e9] border-b border-[#ded8c8]" id="peta">
      <div className="public-container space-y-8">
        {/* 1. Section Header (No badge, new title & accurate description) */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Persebaran Harga Pangan Nasional
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
            Jelajahi harga komoditas pokok menurut wilayah, bandingkan harga pasar terhadap acuan yang relevan (HAP/HET), dan amati perubahan harga berdasarkan periode observasi data yang tersedia.
          </p>
        </div>

        {/* 2. High-Contrast Filter Controls Bar */}
        <div className="bg-[#fffdf7] border border-[#cfc8b8] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Commodity Selector (4 Cols) */}
            <div className="lg:col-span-4 space-y-1.5">
              <label
                htmlFor="mapCommoditySelect"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]"
              >
                1. Pilih Komoditas Pangan
              </label>
              <div className="relative">
                <select
                  id="mapCommoditySelect"
                  value={selectedCommodityId}
                  onChange={(e) => setSelectedCommodityId(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#67151d]/40 focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                >
                  {commoditiesData.map((comm) => (
                    <option key={comm.id} value={comm.id}>
                      {comm.name} ({comm.jenisAcuan === 'HET' ? 'HET' : 'HAP'} Rp{' '}
                      {comm.hargaAcuanRp.toLocaleString('id-ID')}/{comm.satuan})
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-[#67151d] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Province Selector (3 Cols) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="mapProvinceSelect"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]"
              >
                2. Pilih Provinsi
              </label>
              <div className="relative">
                <select
                  id="mapProvinceSelect"
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                >
                  <option value="ALL">Seluruh Indonesia (38 Provinsi)</option>
                  {provinceList.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov === 'Jawa Barat' ? 'Jawa Barat (Data Lengkap)' : prov}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-[#1e221f] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Regency / City Selector (3 Cols) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label
                htmlFor="mapRegionSelect"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]"
              >
                3. Pilih Kabupaten/Kota
              </label>
              <div className="relative">
                <select
                  id="mapRegionSelect"
                  value={selectedRegionId}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                >
                  <option value="ALL">
                    Semua Kabupaten/Kota ({availableRegencies.length})
                  </option>
                  {availableRegencies.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-[#1e221f] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Quick View Scope Buttons (2 Cols) */}
            <div className="sm:col-span-2 lg:col-span-2 flex gap-2">
              <button
                type="button"
                onClick={
                  selectedProvince === 'ALL' ? handleFocusJabar : handleResetToIndonesia
                }
                className="w-full py-3 px-3.5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors text-center"
              >
                {selectedProvince === 'ALL'
                  ? 'Fokus Jawa Barat'
                  : 'Seluruh Indonesia'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Map & Dynamic Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Real Geographic Map Panel (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#fffdf7] border border-[#cfc8b8] rounded-2xl overflow-hidden shadow-sm">
            {/* Map Top Status Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#f0ebde] border-b border-[#d6cebe] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-semibold text-[#1e221f]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#67151d]" />
                <span>
                  Peta Geografis:{' '}
                  <strong>
                    {selectedProvince === 'ALL'
                      ? 'Kepulauan Indonesia (38 Provinsi)'
                      : `Provinsi ${selectedProvince}`}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedRegionId !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedRegionId('ALL')}
                    className="px-2.5 py-1 rounded-lg bg-[#fffdf7] hover:bg-[#e5decb] text-[#67151d] border border-[#bfb7a6] font-bold text-xs transition-colors"
                  >
                    Reset Fokus Wilayah &times;
                  </button>
                )}
                <span className="font-mono text-xs text-[#5c5b52]">
                  Periode Data: 23 Okt 2026
                </span>
              </div>
            </div>

            {/* Geographic Map Canvas */}
            <div className="relative bg-[#eef2f3] flex-1 min-h-[340px] sm:min-h-[420px] flex items-center justify-center overflow-hidden p-2 sm:p-4">
              {geoLoading ? (
                <div className="text-sm font-mono text-[#5c5b52] animate-pulse">
                  Memuat geometri batas administrasi wilayah...
                </div>
              ) : (
                <svg
                  viewBox={`0 0 ${projectedMap.svgWidth} ${projectedMap.svgHeight}`}
                  className="w-full h-full max-h-[430px] select-none"
                  role="img"
                  aria-label={`Peta geospasial harga ${activeCommodity.name}`}
                >
                  {/* Subtle Sea Grid Pattern */}
                  <defs>
                    <pattern
                      id="geoGridPattern"
                      width="32"
                      height="32"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="0.8" fill="#cbd5e1" />
                    </pattern>
                  </defs>
                  <rect
                    width={projectedMap.svgWidth}
                    height={projectedMap.svgHeight}
                    fill="url(#geoGridPattern)"
                  />

                  {/* Administrative Polygons */}
                  <g>
                    {projectedMap.paths.map((item) => {
                      const style = getFeatureStyle(item.feature);
                      const regId = item.feature.properties?.id;
                      const isHovered =
                        hoveredFeature?.feature.properties?.id === regId;

                      return (
                        <path
                          key={item.key}
                          d={item.d}
                          fill={style.fill}
                          stroke={isHovered ? '#1e221f' : style.stroke}
                          strokeWidth={isHovered ? 2.2 : style.strokeWidth}
                          fillOpacity={style.opacity}
                          className="cursor-pointer transition-opacity duration-150"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                            const relX = rect ? e.clientX - rect.left : 160;
                            const relY = rect ? e.clientY - rect.top : 100;
                            setHoveredFeature({
                              feature: item.feature,
                              mouseX: relX,
                              mouseY: relY,
                            });
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                            if (!rect) return;
                            setHoveredFeature({
                              feature: item.feature,
                              mouseX: e.clientX - rect.left,
                              mouseY: e.clientY - rect.top,
                            });
                          }}
                          onMouseLeave={() => setHoveredFeature(null)}
                          onClick={() => {
                            if (regId) {
                              handleRegionChange(
                                selectedRegionId === regId ? 'ALL' : regId
                              );
                            }
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* Labels for Key Regencies when viewing Jawa Barat */}
                  {selectedProvince === 'Jawa Barat' &&
                    projectedMap.paths
                      .filter((item) => item.feature.properties?.provinceId === '32')
                      .filter(
                        (item) =>
                          selectedRegionId === item.feature.properties?.id ||
                          [
                            '32.01',
                            '32.04',
                            '32.05',
                            '32.12',
                            '32.15',
                            '32.16',
                            '32.73',
                            '32.75',
                          ].includes(item.feature.properties?.id || '')
                      )
                      .map((item) => (
                        <text
                          key={`lbl-${item.key}`}
                          x={item.cx}
                          y={item.cy}
                          textAnchor="middle"
                          fill="#1e221f"
                          stroke="#fffdf7"
                          strokeWidth="3"
                          paintOrder="stroke"
                          fontSize="10.5"
                          fontWeight="800"
                          className="pointer-events-none font-sans"
                        >
                          {item.feature.properties.rawName || item.feature.properties.name}
                        </text>
                      ))}
                </svg>
              )}

              {/* Interactive Hover Tooltip Overlay */}
              {hoveredTooltipInfo && hoveredFeature && (
                <div
                  className="pointer-events-none absolute z-20 bg-[#fffdf7]/98 border-2 border-[#67151d] rounded-xl p-3.5 shadow-xl text-xs sm:text-sm text-[#1e221f] w-64 sm:w-72"
                  style={{
                    left: Math.min(Math.max(hoveredFeature.mouseX + 14, 12), 420),
                    top: Math.max(hoveredFeature.mouseY - 20, 12),
                  }}
                >
                  <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-[#e5dfd0]">
                    <div>
                      <strong className="font-extrabold text-sm block text-[#1e221f]">
                        {hoveredTooltipInfo.name}
                      </strong>
                      <span className="text-xs text-[#5c5b52]">
                        Provinsi {hoveredTooltipInfo.province}
                      </span>
                    </div>
                    {hoveredTooltipInfo.hasData ? (
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                          hoveredTooltipInfo.status === 'kritis'
                            ? 'bg-[#f8ded8] text-[#991b1b]'
                            : hoveredTooltipInfo.status === 'waspada'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : 'bg-[#dcfce7] text-[#166534]'
                        }`}
                      >
                        {hoveredTooltipInfo.status === 'kritis'
                          ? 'Di Atas Acuan'
                          : hoveredTooltipInfo.status === 'waspada'
                          ? 'Waspada'
                          : 'Sesuai Acuan'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#e5dfd0] text-[#4a4b44] font-mono text-[11px] font-bold">
                        Tanpa Data
                      </span>
                    )}
                  </div>

                  {hoveredTooltipInfo.hasData ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#5c5b52]">{activeCommodity.name}:</span>
                        <strong className="font-mono tabular-nums text-sm font-black text-[#67151d]">
                          Rp {hoveredTooltipInfo.priceRp?.toLocaleString('id-ID')}/
                          {activeCommodity.satuan}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c5b52]">Tanggal Observasi:</span>
                        <strong className="font-mono">{hoveredTooltipInfo.dateLabel}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c5b52]">Perubahan Harian:</span>
                        <strong className="font-mono tabular-nums">
                          {Number(hoveredTooltipInfo.dailyChangePct) > 0 ? '+' : ''}
                          {hoveredTooltipInfo.dailyChangePct}%
                        </strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-[#e5dfd0]">
                        <span className="text-[#5c5b52]">
                          Perbandingan {activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'}:
                        </span>
                        <strong
                          className={`font-mono tabular-nums ${
                            (hoveredTooltipInfo.hapDiffPct || 0) > 5
                              ? 'text-[#991b1b]'
                              : 'text-[#166534]'
                          }`}
                        >
                          {(hoveredTooltipInfo.hapDiffPct || 0) > 0
                            ? `+${hoveredTooltipInfo.hapDiffPct}%`
                            : `${hoveredTooltipInfo.hapDiffPct}%`}{' '}
                          (Rp {hoveredTooltipInfo.hapRp?.toLocaleString('id-ID')})
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#4a4b44] leading-relaxed">
                      Data observasi harga harian belum tersedia untuk wilayah ini. Saat ini cakupan telemetri lengkap mencakup 27 Kabupaten/Kota di Jawa Barat.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Map Semantic Legend */}
            <div
              className="px-4 sm:px-6 py-4 bg-[#fffdf7] border-t border-[#d6cebe] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs sm:text-sm text-[#1e221f]"
              aria-label="Legenda indikator harga wilayah"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-[#4b9d73] border border-[#2d6a4f] flex-shrink-0" />
                <div>
                  <strong className="block font-bold leading-tight">Sesuai / Di Bawah Acuan</strong>
                  <span className="text-xs text-[#5c5b52]">Deviasi &le; +5% thd. HAP/HET</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-[#e69b39] border border-[#b45309] flex-shrink-0" />
                <div>
                  <strong className="block font-bold leading-tight">Fluktuasi Sedang</strong>
                  <span className="text-xs text-[#5c5b52]">+5% s.d. +10% di atas acuan</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-[#e85b4f] border border-[#991b1b] flex-shrink-0" />
                <div>
                  <strong className="block font-bold leading-tight">Di Atas Acuan</strong>
                  <span className="text-xs text-[#5c5b52]">&gt; +10% di atas HAP/HET</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded bg-[#ddd6c7] border border-[#9c9484] flex-shrink-0" />
                <div>
                  <strong className="block font-bold leading-tight">Belum Tersedia Data</strong>
                  <span className="text-xs text-[#5c5b52]">Di luar cakupan sampel aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Location Summary Panel (4 Cols) */}
          <aside className="lg:col-span-4 bg-[#67151d] text-[#fffdf7] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="pb-4 border-b border-[#87232d]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#f2d6d3] block mb-1">
                  {dynamicSummary.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {dynamicSummary.title}
                </h3>
              </div>

              {/* Metric 1 */}
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#f2d6d3]">
                  {dynamicSummary.primaryLabel}
                </div>
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-black text-white">
                  {dynamicSummary.primaryValue}
                </div>
                <p className="text-xs sm:text-sm text-[#f2d6d3] leading-relaxed">
                  {dynamicSummary.primarySub}
                </p>
              </div>

              <div className="h-[1px] bg-[#87232d]" />

              {/* Metric 2 */}
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#f2d6d3]">
                  {dynamicSummary.secondaryLabel}
                </div>
                <div className="font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-[#f0c94d]">
                  {dynamicSummary.secondaryValue}
                </div>
                <p className="text-xs sm:text-sm text-[#f2d6d3] leading-relaxed">
                  {dynamicSummary.secondarySub}
                </p>
              </div>

              <div className="h-[1px] bg-[#87232d]" />

              {/* Metric 3 */}
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#f2d6d3]">
                  {dynamicSummary.tertiaryLabel}
                </div>
                <div className="font-mono tabular-nums text-lg font-bold text-white">
                  {dynamicSummary.tertiaryValue}
                </div>
                <p className="text-xs sm:text-sm text-[#f2d6d3] leading-relaxed">
                  {dynamicSummary.tertiarySub}
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              {!dynamicSummary.hasData && (
                <button
                  type="button"
                  onClick={handleFocusJabar}
                  className="w-full py-3 px-4 rounded-xl bg-[#f0c94d] hover:bg-[#e6b82e] text-[#1e221f] font-extrabold text-sm transition-colors text-center"
                >
                  Kembali ke Data Lengkap Jawa Barat
                </button>
              )}
              <Link
                href={`/harga?region=${dynamicSummary.ctaRegionId}&commodity=${activeCommodity.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#fffdf7] hover:bg-[#f0ebde] text-[#67151d] font-extrabold text-sm shadow-sm transition-colors text-center"
              >
                <span>Buka Detail Wilayah &amp; Pasar</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              </Link>
            </div>
          </aside>
        </div>

        {/* 4. Responsive Price Trend Chart (Historical 14d vs Projected H+7) */}
        <div className="bg-[#fffdf7] border border-[#cfc8b8] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5dfd0]">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d] block mb-1">
                Grafik Perkembangan Harga &amp; Proyeksi Statistik
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                Tren Harga {activeCommodity.name} — {chartData.locationLabel}
              </h3>
              <p className="text-sm text-[#5c5b52] mt-0.5">
                Menampilkan riwayat harga observasi harian (9–23 Oktober 2026), perbandingan terhadap acuan pemerintah, serta estimasi proyeksi 7 hari ke depan (H+7).
              </p>
            </div>

            {/* Active Point Readout Pill */}
            <div className="bg-[#f8f4e9] border border-[#d6cebe] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono flex-shrink-0">
              {activeChartPoint ? (
                <div className="space-y-0.5">
                  <div className="text-[#5c5b52]">
                    {activeChartPoint.label} 2026 &bull;{' '}
                    <strong className="text-[#67151d]">
                      {activeChartPoint.isProjection ? 'Proyeksi H+7 (Estimasi)' : 'Data Historis'}
                    </strong>
                  </div>
                  <div className="text-base font-black text-[#1e221f]">
                    Rp {activeChartPoint.price.toLocaleString('id-ID')}/{activeCommodity.satuan}{' '}
                    <span className="text-xs font-bold text-[#67151d]">
                      ({Number(activeChartPoint.diffPct) > 0 ? `+${activeChartPoint.diffPct}%` : `${activeChartPoint.diffPct}%`} thd. Acuan)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[#5c5b52]">
                  Arahkan kursor pada titik grafik untuk melihat detail tanggal, harga, dan selisih acuan.
                </div>
              )}
            </div>
          </div>

          {/* Chart SVG Container */}
          <div className="bg-[#f8f4e9]/70 border border-[#e5dfd0] rounded-xl p-3 sm:p-5 overflow-hidden">
            <svg
              viewBox={`0 0 ${chartData.svgW} ${chartData.svgH}`}
              className="w-full h-auto block"
              role="img"
              aria-label={`Grafik deret waktu harga ${activeCommodity.name} di ${chartData.locationLabel}`}
            >
              <defs>
                <linearGradient id="mapHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67151d" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#67151d" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Gridlines & Price Ticks */}
              {chartData.yTicks.map((tick, idx) => (
                <g key={idx}>
                  <line
                    x1={chartData.leftX}
                    y1={tick.y}
                    x2={chartData.rightX}
                    y2={tick.y}
                    stroke="#e2dcd0"
                    strokeWidth="1"
                  />
                  <text
                    x={chartData.leftX - 10}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="#5c5b52"
                    fontSize="11.5"
                    fontFamily="monospace"
                  >
                    Rp {(tick.val / 1000).toFixed(1).replace('.0', '')}rb
                  </text>
                </g>
              ))}

              {/* Reference HAP / HET Line */}
              <line
                x1={chartData.leftX}
                y1={chartData.hapY}
                x2={chartData.rightX}
                y2={chartData.hapY}
                stroke="#347b56"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <rect
                x={chartData.leftX + 8}
                y={Math.max(8, chartData.hapY - 22)}
                width="210"
                height="19"
                rx="4"
                fill="#e0f0e2"
              />
              <text
                x={chartData.leftX + 14}
                y={Math.max(21, chartData.hapY - 9)}
                fill="#166534"
                fontSize="10.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Acuan {activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'}: Rp{' '}
                {activeCommodity.hargaAcuanRp.toLocaleString('id-ID')}/{activeCommodity.satuan}
              </text>

              {/* Projection Confidence Band */}
              {chartData.confBand && (
                <path d={chartData.confBand} fill="#e69b39" opacity="0.22" />
              )}

              {/* Historical Area & Solid Line */}
              {chartData.histArea && (
                <path d={chartData.histArea} fill="url(#mapHistGrad)" />
              )}
              {chartData.histLine && (
                <path
                  d={chartData.histLine}
                  fill="none"
                  stroke="#67151d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Projected Dashed Line */}
              {chartData.projLine && (
                <path
                  d={chartData.projLine}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Data Points */}
              {chartData.plotted.map((pt, idx) => (
                <g
                  key={pt.date}
                  onMouseEnter={() => setHoveredChartIdx(idx)}
                  onMouseLeave={() => setHoveredChartIdx(null)}
                  className="cursor-pointer"
                >
                  <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredChartIdx === idx ? 6 : pt.isProjection ? 4.5 : 3.5}
                    fill={pt.isProjection ? '#d97706' : '#67151d'}
                    stroke="#fffdf7"
                    strokeWidth="2"
                  />
                  {/* X-Axis Date Labels (Evenly spaced historical + final H+7 projection) */}
                  {((!pt.isProjection && idx % 3 === 0) || idx === chartData.plotted.length - 1) && (
                    <text
                      x={pt.x}
                      y={chartData.bottomY + 22}
                      textAnchor={idx === chartData.plotted.length - 1 ? 'end' : idx === 0 ? 'start' : 'middle'}
                      fill={pt.isProjection ? '#92400e' : '#4a4b44'}
                      fontWeight={pt.isProjection ? '700' : '500'}
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Chart Legend & Methodology Footnote */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-[#4a4b44]">
            <div className="flex flex-wrap items-center gap-6 font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-0.5 bg-[#67151d] inline-block" />
                <span>Data Historis Observasi (9–23 Okt 2026)</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-0 border-b-2 border-dashed border-[#d97706] inline-block" />
                <span>Proyeksi Statistik H+7 (Estimasi s.d. 30 Okt 2026)</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-0 border-b-2 border-dashed border-[#347b56] inline-block" />
                <span>Standar Acuan Pemerintah ({activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'})</span>
              </span>
            </div>
            <span className="text-xs text-[#5c5b52] font-mono">
              Satuan: Rupiah per {activeCommodity.satuan}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
