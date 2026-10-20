import type { CSSProperties } from 'react';
import { TERRAINS } from '../constants/areas';
import type { TerrainId } from '../types/content';

interface TerrainBadgeProps {
  terrain: TerrainId;
}

export function TerrainBadge({ terrain }: TerrainBadgeProps) {
  const { label, colorVariable } = TERRAINS[terrain];
  const badgeStyle = { '--badge-color': colorVariable } as CSSProperties;

  return (
    <span className="terrain-badge" style={badgeStyle}>
      {label}
    </span>
  );
}
