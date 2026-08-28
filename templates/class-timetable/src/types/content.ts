export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteContent {
  name: string;
  tagline: string;
  city: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  bookingUrl: string;
  intro: string;
  scheduleNote: string;
  studioNotes: string[];
  navigation: NavigationItem[];
  socials: SocialLink[];
  faqs: Faq[];
}

export type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ClassLevel = 'Gentle' | 'All levels' | 'Strong';

export const CLASS_LEVEL_ORDER: ClassLevel[] = ['Gentle', 'All levels', 'Strong'];

export interface ClassEntry {
  id: string;
  name: string;
  weekday: Weekday;
  /** 24-hour studio-local start time, e.g. "07:00" or "18:30". */
  startTime: string;
  durationMinutes: number;
  level: ClassLevel;
  instructor?: string;
  focus: string;
}
