import type { MapPoint } from '../types/content';

const KM_PER_MAP_UNIT = 0.1;

export const distanceKm = (from: MapPoint, to: MapPoint) =>
  Math.hypot(to.x - from.x, to.y - from.y) * KM_PER_MAP_UNIT;
