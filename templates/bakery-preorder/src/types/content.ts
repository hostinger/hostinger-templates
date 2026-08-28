export type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface OrderCutoff {
  day: Weekday;
  time: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteContent {
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  about: string;
  aboutSignature: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  collectionAddress: string;
  collectionNote: string;
  orderCutoff: OrderCutoff;
  bakeDay: Weekday;
  navigation: NavigationItem[];
  faqs: Faq[];
}

export interface Bake {
  id: string;
  name: string;
  unit: string;
  description: string;
  price: number;
  image: string;
  alt: string;
}

export interface CollectionSlot {
  id: string;
  timeRange: string;
  capacity: number;
  reserved: number;
}

export interface BakersContent {
  bakes: Bake[];
  slots: CollectionSlot[];
}
