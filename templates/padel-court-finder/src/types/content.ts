export type Setting = 'indoor' | 'covered' | 'outdoor';

export type AmenityId =
  | 'coaching'
  | 'rental'
  | 'floodlights'
  | 'changing'
  | 'parking'
  | 'cafe'
  | 'accessible';

export type SortKey = 'distance' | 'price' | 'courts' | 'name';

/** Opening and closing time as 24-hour "HH:MM". "00:00" as a closing time means midnight. */
export type OpeningWindow = [open: string, close: string];

export type WeeklyHours = {
  weekdays: OpeningWindow | null;
  saturday: OpeningWindow | null;
  sunday: OpeningWindow | null;
};

/** Position on the city map, where the map is 100 × 70 units and one unit is 100 metres. */
export type MapPoint = {
  x: number;
  y: number;
};

export type Neighbourhood = MapPoint & {
  id: string;
  name: string;
};

export type Club = {
  id: string;
  name: string;
  neighbourhood: string;
  address: string;
  location: MapPoint;
  setting: Setting;
  courts: number;
  courtType: string;
  prices: {
    offPeak: number;
    peak: number;
  };
  hours: WeeklyHours;
  amenities: AmenityId[];
  phone: string;
  email: string;
  summary: string;
  description: string;
  goodFor: string[];
};

export type Option<T extends string> = {
  id: T;
  label: string;
  description: string;
};

export type NavLink = {
  label: string;
  to: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type GuideRule = {
  title: string;
  body: string;
};

export type Level = {
  name: string;
  rating: string;
  description: string;
};

export type SiteContent = {
  brand: string;
  city: string;
  locale: string;
  currency: string;
  contact: {
    email: string;
    phone: string;
  };
  nav: NavLink[];
  hero: {
    eyebrow: string;
    headline: string;
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    nearLabel: string;
    submitLabel: string;
  };
  finder: {
    title: string;
    intro: string;
    filtersTitle: string;
    emptyTitle: string;
    emptyBody: string;
    distanceNote: string;
    hoursNote: string;
  };
  pricing: {
    sessionLength: string;
    playersPerCourt: number;
    peakDefinition: string;
  };
  booking: {
    title: string;
    note: string;
    emailSubject: string;
    emailBody: string;
  };
  guide: {
    eyebrow: string;
    title: string;
    intro: string;
    courtTitle: string;
    courtIntro: string;
    rulesTitle: string;
    rules: GuideRule[];
    kitTitle: string;
    kit: string[];
    levelsTitle: string;
    levels: Level[];
    faqTitle: string;
    faqs: Faq[];
    ctaTitle: string;
    ctaBody: string;
    ctaLabel: string;
  };
  listing: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: string[];
    emailSubject: string;
    note: string;
    successTitle: string;
    successBody: string;
  };
  footer: {
    blurb: string;
    legal: string;
  };
};
