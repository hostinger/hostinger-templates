import {
  DEFAULT_NEIGHBOURHOOD,
  amenitiesById,
  neighbourhoodsById,
  priceSteps,
  settingsById,
  sortOptions,
} from '../constants/content';
import type { AmenityId, Club, Setting, SortKey } from '../types/content';
import { distanceKm } from './distance';
import { getOpenStatus, type OpenStatus } from './hours';

export type FinderState = {
  query: string;
  near: string;
  settings: Setting[];
  amenities: AmenityId[];
  maxPrice: number | null;
  openNow: boolean;
  sort: SortKey;
};

export type ClubResult = {
  club: Club;
  distance: number;
  status: OpenStatus;
};

export const DEFAULT_STATE: FinderState = {
  query: '',
  near: DEFAULT_NEIGHBOURHOOD,
  settings: [],
  amenities: [],
  maxPrice: null,
  openNow: false,
  sort: 'distance',
};

const MAX_QUERY_LENGTH = 60;
const sortIds = new Set(sortOptions.map(({ id }) => id));

const listParam = <T extends string>(value: string | null, known: Map<string, unknown>) =>
  [...new Set((value ?? '').split(',').filter((item) => known.has(item)))] as T[];

export const parseFinderState = (params: URLSearchParams): FinderState => {
  const near = params.get('near') ?? '';
  const sort = params.get('sort') ?? '';
  const max = Number(params.get('max'));

  return {
    query: (params.get('q') ?? '').slice(0, MAX_QUERY_LENGTH),
    near: neighbourhoodsById.has(near) ? near : DEFAULT_STATE.near,
    settings: listParam<Setting>(params.get('setting'), settingsById),
    amenities: listParam<AmenityId>(params.get('amenities'), amenitiesById),
    maxPrice: priceSteps.includes(max) ? max : null,
    openNow: params.get('open') === '1',
    sort: sortIds.has(sort as SortKey) ? (sort as SortKey) : DEFAULT_STATE.sort,
  };
};

export const serializeFinderState = (state: FinderState) => {
  const params = new URLSearchParams();
  const query = state.query.trim().slice(0, MAX_QUERY_LENGTH);
  if (query) params.set('q', query);
  if (state.near !== DEFAULT_STATE.near) params.set('near', state.near);
  if (state.settings.length) params.set('setting', state.settings.join(','));
  if (state.amenities.length) params.set('amenities', state.amenities.join(','));
  if (state.maxPrice !== null) params.set('max', String(state.maxPrice));
  if (state.openNow) params.set('open', '1');
  if (state.sort !== DEFAULT_STATE.sort) params.set('sort', state.sort);
  return params;
};

export const countActiveFilters = (state: FinderState) =>
  state.settings.length + state.amenities.length + (state.maxPrice !== null ? 1 : 0) + (state.openNow ? 1 : 0);

const normalise = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const matchesQuery = (club: Club, query: string) => {
  const needle = normalise(query.trim());
  if (!needle) return true;
  const area = neighbourhoodsById.get(club.neighbourhood)?.name ?? '';
  return [club.name, area, club.address].some((field) => normalise(field).includes(needle));
};

const comparators: Record<SortKey, (a: ClubResult, b: ClubResult) => number> = {
  distance: (a, b) => a.distance - b.distance,
  price: (a, b) => a.club.prices.offPeak - b.club.prices.offPeak || a.distance - b.distance,
  courts: (a, b) => b.club.courts - a.club.courts || a.distance - b.distance,
  name: (a, b) => a.club.name.localeCompare(b.club.name),
};

export const withDistances = (clubs: Club[], nearId: string, now: Date): ClubResult[] => {
  const origin = neighbourhoodsById.get(nearId) ?? neighbourhoodsById.get(DEFAULT_NEIGHBOURHOOD)!;
  return clubs.map((club) => ({
    club,
    distance: distanceKm(origin, club.location),
    status: getOpenStatus(club.hours, now),
  }));
};

export const findClubs = (clubs: Club[], state: FinderState, now: Date) =>
  withDistances(clubs, state.near, now)
    .filter(({ club, status }) => {
      if (!matchesQuery(club, state.query)) return false;
      if (state.settings.length && !state.settings.includes(club.setting)) return false;
      if (state.amenities.some((amenity) => !club.amenities.includes(amenity))) return false;
      if (state.maxPrice !== null && club.prices.offPeak > state.maxPrice) return false;
      if (state.openNow && !status.open) return false;
      return true;
    })
    .sort(comparators[state.sort]);
