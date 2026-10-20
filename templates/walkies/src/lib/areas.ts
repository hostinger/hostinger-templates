import { WALK_AREAS } from '../constants/areas';
import { AREA_QUERY_PARAM, ROUTES } from '../constants/routes';
import type { WalkArea } from '../types/content';

export function findAreaById(areaId: string | null): WalkArea | undefined {
  const area = WALK_AREAS.find((candidate) => candidate.id === areaId);

  return area;
}

/** Map pins and cards share a stable 1-based number, so filtering never renumbers them. */
export function getPinNumber(areaId: string): number {
  const pinNumber = WALK_AREAS.findIndex((area) => area.id === areaId) + 1;

  return pinNumber;
}

export function buildBookingPath(areaId: string): string {
  const searchParams = new URLSearchParams({ [AREA_QUERY_PARAM]: areaId });
  const bookingPath = `${ROUTES.booking}?${searchParams.toString()}`;

  return bookingPath;
}
