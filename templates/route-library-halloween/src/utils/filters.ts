import type { RouteRecord } from '../types/content.js';

export type DistanceFilterId = 'all' | 'short' | 'medium' | 'long';
export type ClimbFilterId = 'all' | 'gentle' | 'rolling' | 'steep';

export interface FilterOption<Id extends string> {
  id: Id;
  label: string;
  matches: (route: RouteRecord) => boolean;
}

/** Distance buckets shown in the filter bar. Tweak thresholds here. */
export const DISTANCE_FILTERS: ReadonlyArray<FilterOption<DistanceFilterId>> = [
  { id: 'all', label: 'All distances', matches: () => true },
  { id: 'short', label: 'Under 10 km', matches: (route) => route.distanceKm < 10 },
  {
    id: 'medium',
    label: '10–25 km',
    matches: (route) => route.distanceKm >= 10 && route.distanceKm <= 25,
  },
  { id: 'long', label: 'Over 25 km', matches: (route) => route.distanceKm > 25 },
];

/** Climb buckets shown in the filter bar. Tweak thresholds here. */
export const CLIMB_FILTERS: ReadonlyArray<FilterOption<ClimbFilterId>> = [
  { id: 'all', label: 'Any climb', matches: () => true },
  {
    id: 'gentle',
    label: 'Under 300 m',
    matches: (route) => route.elevationGainM < 300,
  },
  {
    id: 'rolling',
    label: '300–700 m',
    matches: (route) => route.elevationGainM >= 300 && route.elevationGainM <= 700,
  },
  {
    id: 'steep',
    label: 'Over 700 m',
    matches: (route) => route.elevationGainM > 700,
  },
];

function parseFilter<Id extends string>(
  options: ReadonlyArray<FilterOption<Id>>,
  value: unknown,
  fallback: Id,
): Id {
  if (typeof value !== 'string') {
    return fallback;
  }
  const match = options.find((option) => option.id === value);
  return match ? match.id : fallback;
}

/** Maps a `?distance=` query value to a known filter id, defaulting to `all`. */
export function parseDistanceFilter(value: unknown): DistanceFilterId {
  return parseFilter(DISTANCE_FILTERS, value, 'all');
}

/** Maps a `?climb=` query value to a known filter id, defaulting to `all`. */
export function parseClimbFilter(value: unknown): ClimbFilterId {
  return parseFilter(CLIMB_FILTERS, value, 'all');
}

export function filterRoutes(
  routes: RouteRecord[],
  distance: DistanceFilterId,
  climb: ClimbFilterId,
): RouteRecord[] {
  const distanceOption = DISTANCE_FILTERS.find((option) => option.id === distance);
  const climbOption = CLIMB_FILTERS.find((option) => option.id === climb);
  return routes.filter(
    (route) =>
      (distanceOption?.matches(route) ?? true) &&
      (climbOption?.matches(route) ?? true),
  );
}

/** Builds the shareable URL for a filter combination, omitting defaults. */
export function buildFilterHref(
  distance: DistanceFilterId,
  climb: ClimbFilterId,
): string {
  const params = new URLSearchParams();
  if (distance !== 'all') {
    params.set('distance', distance);
  }
  if (climb !== 'all') {
    params.set('climb', climb);
  }
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

/** The single non-`all` distance bucket a route belongs to. */
export function distanceBucket(route: RouteRecord): DistanceFilterId {
  const match = DISTANCE_FILTERS.find(
    (option) => option.id !== 'all' && option.matches(route),
  );
  return match ? match.id : 'all';
}

/** The single non-`all` climb bucket a route belongs to. */
export function climbBucket(route: RouteRecord): ClimbFilterId {
  const match = CLIMB_FILTERS.find(
    (option) => option.id !== 'all' && option.matches(route),
  );
  return match ? match.id : 'all';
}
