import clubsJson from '../data/clubs.json';
import filtersJson from '../data/filters.json';
import neighbourhoodsJson from '../data/neighbourhoods.json';
import siteJson from '../data/site.json';
import type { AmenityId, Club, Neighbourhood, Option, Setting, SiteContent, SortKey } from '../types/content';

export const site = siteJson as SiteContent;
export const clubs = clubsJson as Club[];
export const neighbourhoods = neighbourhoodsJson as Neighbourhood[];

export const settingOptions = filtersJson.settings as Option<Setting>[];
export const amenityOptions = filtersJson.amenities as Option<AmenityId>[];
export const sortOptions = filtersJson.sorts as Option<SortKey>[];
export const priceSteps: number[] = filtersJson.priceSteps;

export const DEFAULT_NEIGHBOURHOOD = 'alameda';

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((item) => [item.id, item]));

export const clubsById = byId(clubs);
export const neighbourhoodsById = byId(neighbourhoods);
export const settingsById = byId(settingOptions);
export const amenitiesById = byId(amenityOptions);
