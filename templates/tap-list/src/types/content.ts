export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface OpeningHours {
  days: string;
  time: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteContent {
  name: string;
  city: string;
  tagline: string;
  intro: string;
  boardStatus: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  hours: OpeningHours[];
  navigation: NavigationItem[];
  socials: SocialLink[];
  faqs: Faq[];
}

export type TapFamily = 'hoppy' | 'crisp' | 'dark' | 'wild';

export interface Tap {
  number: number;
  name: string;
  brewery: string;
  style: string;
  family: TapFamily;
  abv: number;
  price: number;
  pour: string;
  fillPercent: number;
  note: string;
}

export type TapStatus = 'fresh' | 'pouring' | 'low' | 'blown';

export const LOW_FILL_THRESHOLD = 20;
export const FRESH_FILL_THRESHOLD = 90;

export function getTapStatus(fillPercent: number): TapStatus {
  if (fillPercent <= 0) return 'blown';
  if (fillPercent <= LOW_FILL_THRESHOLD) return 'low';
  if (fillPercent >= FRESH_FILL_THRESHOLD) return 'fresh';
  return 'pouring';
}
