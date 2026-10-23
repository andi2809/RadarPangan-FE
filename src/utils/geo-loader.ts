import { Region } from '../types/domain';
import regionsData from '../data/mock/regions.json';
import commoditiesData from '../data/mock/commodities.json';
import telemetryData from '../data/mock/telemetry.json';
import mbgData from '../data/mock/mbg-sourcing.json';
import crowdsourceData from '../data/mock/crowdsource.json';

let cachedGeoJson: GeoJSON.FeatureCollection | null = null;

export async function loadJabarGeoJson(): Promise<GeoJSON.FeatureCollection> {
  if (cachedGeoJson) return cachedGeoJson;
  try {
    const res = await fetch('/geo/jabar-27-kabkota.geojson');
    if (!res.ok) throw new Error(`HTTP error loading GeoJSON: ${res.status}`);
    const data = await res.json();
    cachedGeoJson = data;
    return data;
  } catch (err) {
    console.error('Failed to fetch GeoJSON from /geo/, attempting fallback', err);
    throw err;
  }
}

export function getAllRegions(): Region[] {
  return regionsData as Region[];
}

export function getRegionById(id: string): Region | undefined {
  return (regionsData as Region[]).find((r) => r.id === id);
}

export function getAllCommodities() {
  return commoditiesData;
}

export function getCommodityById(id: string) {
  return commoditiesData.find((c) => c.id === id);
}

export function getTelemetry(commodityId: string, regionId?: string) {
  const commData = (telemetryData as Record<string, Record<string, any>>)[commodityId] || {};
  if (regionId) {
    return commData[regionId];
  }
  return commData;
}

export function getMbgSourcingRecommendations() {
  return mbgData;
}

export function getCrowdsourceClusters() {
  return crowdsourceData;
}
