'use client';

import React from 'react';
import { MapCanvas } from '../MapCanvas';
import { UnifiedRegionTelemetry, SupplyRoute, PriceStatus } from '../../../types/domain';

export interface GISMapCanvasProps {
  geoJson: GeoJSON.FeatureCollection | null;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  activeHorizon: 'aktual' | 'h7';
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  activeSupplyRoutes?: SupplyRoute[];
  simulatedStatusMap?: Record<string, PriceStatus>;
  mode?: 'full' | 'preview';
  className?: string;
  viewScope?: 'jabar' | 'indonesia';
  onViewScopeChange?: (scope: 'jabar' | 'indonesia') => void;
  onOpenCommandCenter?: (regionId?: string) => void;
}

export function GISMapCanvas(props: GISMapCanvasProps) {
  return <MapCanvas {...props} />;
}
