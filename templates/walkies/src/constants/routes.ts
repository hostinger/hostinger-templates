export const ROUTES = {
  home: '/',
  areas: '/areas',
  booking: '/book',
} as const;

/** Paths written as real `index.html` copies at build time so they load directly on a static host. */
export const STATIC_ROUTE_PATHS = [ROUTES.areas, ROUTES.booking];

/** Query parameter that preselects a walk area on the booking page, e.g. `/book?area=beacon-heath`. */
export const AREA_QUERY_PARAM = 'area';
