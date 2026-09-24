export const ROUTES = {
  home: '/',
  guide: '/guide',
  listYourClub: '/list-your-club',
} as const;

export const STATIC_ROUTES: string[] = [ROUTES.guide, ROUTES.listYourClub];

export const clubPath = (id: string) => `/clubs/${id}`;
