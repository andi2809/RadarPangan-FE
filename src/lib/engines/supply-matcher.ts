import { Region, SupplyRoute } from '../../types/domain';

export interface MatchmakerCandidate {
  surplusRegion: Region;
  surplusTon: number;
  jarakKm: number;
  estimasiJam: number;
  biayaTransportRp: number;
  scoreEfisiensi: number; // 0 - 100
  routeCoordinates: [number, number][]; // [ [lng1, lat1], [midLng, midLat], [lng2, lat2] ]
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate smooth midpoint curve for aesthetic GIS route lines
function generateArcCoordinates(
  p1: { lng: number; lat: number },
  p2: { lng: number; lat: number }
): [number, number][] {
  const midLng = (p1.lng + p2.lng) / 2;
  const midLat = (p1.lat + p2.lat) / 2;
  
  // Perpendicular arc displacement
  const dx = p2.lng - p1.lng;
  const dy = p2.lat - p1.lat;
  const normalLng = -dy * 0.15;
  const normalLat = dx * 0.15;

  const controlPoint: [number, number] = [midLng + normalLng, midLat + normalLat];

  // 7-point quadratic curve
  const points: [number, number][] = [];
  for (let t = 0; t <= 1; t += 0.166) {
    const lng = (1 - t) * (1 - t) * p1.lng + 2 * (1 - t) * t * controlPoint[0] + t * t * p2.lng;
    const lat = (1 - t) * (1 - t) * p1.lat + 2 * (1 - t) * t * controlPoint[1] + t * t * p2.lat;
    points.push([Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
  }
  return points;
}

export function findOptimalSupplyRoutes(
  targetDeficitRegion: Region,
  defisitNeededTon: number,
  allRegions: Region[],
  allTelemetry: Record<string, any>,
  commodityId: string
): SupplyRoute[] {
  const candidates: MatchmakerCandidate[] = [];

  allRegions.forEach((reg) => {
    if (reg.id === targetDeficitRegion.id) return;

    const telem = allTelemetry[reg.id];
    const supply = telem?.supply;

    // Check if region has surplus or is designated producer
    const isSurplus = supply?.statusNeraca === 'surplus' || (supply?.surplusDefisitTon || 0) > 0;
    const surplusTon = Math.max(0, supply?.surplusDefisitTon || (isSurplus ? 350 : 0));

    if (surplusTon <= 0) return;

    const crowFliesKm = haversineDistanceKm(
      targetDeficitRegion.centroid.lat,
      targetDeficitRegion.centroid.lng,
      reg.centroid.lat,
      reg.centroid.lng
    );

    // Realistic road distance (tortuosity factor ~1.28)
    const roadKm = Math.round(crowFliesKm * 1.28);
    // Average freight speed 42 km/h + 1.5h loading/inspection
    const travelHours = Number(((roadKm / 42) + 1.5).toFixed(1));
    // Base freight tariff: Rp 3.200 per ton per km
    const freightCost = Math.round(roadKm * 3200 * Math.min(surplusTon, defisitNeededTon));

    // Efficiency Score (lower distance & higher surplus capacity = higher score)
    const distancePenalty = Math.min(60, (roadKm / 350) * 60);
    const volumeBonus = Math.min(40, (surplusTon / defisitNeededTon) * 40);
    const score = Math.round(Math.max(10, 100 - distancePenalty + (volumeBonus * 0.5)));

    const arcCoords = generateArcCoordinates(
      { lng: reg.centroid.lng, lat: reg.centroid.lat },
      { lng: targetDeficitRegion.centroid.lng, lat: targetDeficitRegion.centroid.lat }
    );

    candidates.push({
      surplusRegion: reg,
      surplusTon,
      jarakKm: roadKm,
      estimasiJam: travelHours,
      biayaTransportRp: freightCost,
      scoreEfisiensi: score,
      routeCoordinates: arcCoords
    });
  });

  // Rank by highest efficiency score (shortest distance, largest surplus)
  candidates.sort((a, b) => b.scoreEfisiensi - a.scoreEfisiensi);

  // Return top 3 recommended corridors
  return candidates.slice(0, 3).map((c, idx) => ({
    id: `route-${c.surplusRegion.id}-to-${targetDeficitRegion.id}-${idx + 1}`,
    sourceRegionId: c.surplusRegion.id,
    sourceRegionName: c.surplusRegion.name,
    targetRegionId: targetDeficitRegion.id,
    targetRegionName: targetDeficitRegion.name,
    commodityId,
    surplusAvailableTon: c.surplusTon,
    defisitNeededTon,
    jarakKm: c.jarakKm,
    estimasiWaktuJam: c.estimasiJam,
    modeTransport: 'DARAT',
    biayaTransportEstRp: c.biayaTransportRp,
    coordinates: c.routeCoordinates
  }));
}
