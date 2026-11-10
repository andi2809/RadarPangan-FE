'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLaporanWargaSekitar } from '@/lib/api';
import {
  DistributionState,
  MarketRef,
  deriveDistributionState,
  filterReportsForMarket,
  jakartaDateKey,
} from '@/lib/citizen-distribution';

/**
 * Radius pencarian awal di sekitar centroid kab/kota. Endpoint `/sekitar` hanya
 * menerima titik + radius; pasar resmi belum memiliki koordinat di direktori,
 * sehingga laporan diambil per wilayah lalu DIFILTER KETAT per pasar + komoditas.
 * Radius ini bukan aturan validasi (validasi 3 km tetap milik backend).
 */
const REGION_FETCH_RADIUS_KM = 75;

interface Params {
  market: MarketRef | null;
  commodityId: string;
  regionCentroid: { lat: number; lng: number } | null;
}

export function useCitizenReportDistribution({ market, commodityId, regionCentroid }: Params) {
  const [state, setState] = useState<DistributionState>({ kind: 'no-market' });
  const [reloadToken, setReloadToken] = useState(0);
  const requestId = useRef(0);

  const lat = regionCentroid?.lat;
  const lng = regionCentroid?.lng;
  const marketKey = market ? `${market.regionId}|${market.id}` : null;

  useEffect(() => {
    if (!market || lat === undefined || lng === undefined) {
      setState({ kind: 'no-market' });
      return;
    }

    const id = ++requestId.current;
    const controller = new AbortController();
    setState({ kind: 'loading' });

    const isManualRetry = reloadToken > 0;

    getLaporanWargaSekitar(
      { lat, lng, radiusKm: REGION_FETCH_RADIUS_KM },
      controller.signal,
      isManualRetry
    )
      .then((res) => {
        if (id !== requestId.current || controller.signal.aborted) return;
        const scoped = filterReportsForMarket(res.data, market, commodityId);
        const todayKey = jakartaDateKey(new Date()) as string;
        setState(deriveDistributionState(scoped, todayKey));
      })
      .catch((err: unknown) => {
        if (id !== requestId.current || controller.signal.aborted) return; // permintaan usang / dibatalkan
        const timedOut = err instanceof DOMException && err.name === 'AbortError';
        setState({
          kind: 'error',
          message: timedOut ? 'Permintaan melebihi batas waktu.' : 'Server laporan warga tidak merespons.',
        });
      });

    return () => {
      controller.abort();
    };
    // marketKey merepresentasikan identitas `market`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketKey, commodityId, lat, lng, reloadToken]);

  const retry = useCallback(() => setReloadToken((t) => t + 1), []);

  return { state, retry };
}
