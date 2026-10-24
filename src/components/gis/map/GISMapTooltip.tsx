'use client';

import React from 'react';
import { MapTooltip, type NonJabarInfo } from '../MapTooltip';
import { UnifiedRegionTelemetry } from '../../../types/domain';

export interface GISMapTooltipProps {
  x: number;
  y: number;
  visible?: boolean;
  telemetry: UnifiedRegionTelemetry | null;
  nonJabarInfo?: NonJabarInfo | null;
  activeHorizon: 'aktual' | 'h7';
  onInspectDetail?: (regionId: string) => void;
  onOpenCommandCenter?: (regionId: string) => void;
}

export function GISMapTooltip({ visible = true, ...props }: GISMapTooltipProps) {
  return <MapTooltip visible={visible} {...props} />;
}

export type { NonJabarInfo };
