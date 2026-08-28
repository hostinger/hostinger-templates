/** Shapes for the committed JSON content in `src/data/`. */

export interface SiteNavLink {
  label: string;
  href: string;
}

export interface SiteFaq {
  question: string;
  answer: string;
}

export interface ClubNight {
  day: string;
  time: string;
  detail: string;
}

export interface MeetPoint {
  name: string;
  detail: string;
}

export interface RouteLibrarian {
  name: string;
  role: string;
  email: string;
}

export interface SiteContent {
  clubName: string;
  area: string;
  tagline: string;
  heading: string;
  intro: string;
  about: string;
  founded: string;
  meetPoint: MeetPoint;
  clubNights: ClubNight[];
  librarian: RouteLibrarian;
  disclaimer: string;
  navigation: SiteNavLink[];
  faqs: SiteFaq[];
}

/** One sampled point of an elevation profile. */
export interface ProfilePoint {
  /** Distance from the start, in kilometres. */
  km: number;
  /** Elevation above sea level, in metres. */
  m: number;
}

export type RouteDifficulty = 'Easy' | 'Moderate' | 'Hard';

export interface RouteRecord {
  name: string;
  slug: string;
  distanceKm: number;
  elevationGainM: number;
  surface: string;
  difficulty: RouteDifficulty;
  startPoint: string;
  description: string;
  /**
   * Elevation profile from start to finish. The first point sits at km 0,
   * the last point at `distanceKm`, and the summed uphill differences
   * should match `elevationGainM`.
   */
  profile: ProfilePoint[];
}
