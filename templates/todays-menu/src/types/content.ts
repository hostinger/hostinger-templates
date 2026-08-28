export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface DayHours {
  day: string;
  hours: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteContent {
  name: string;
  eyebrow: string;
  intro: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  addressNote: string;
  hours: DayHours[];
  hoursNote: string;
  navigation: NavigationItem[];
  socials: SocialLink[];
  faqs: Faq[];
}

export interface Daypart {
  id: string;
  label: string;
  start: string;
  end: string;
  tagline: string;
}

export interface TagLegendEntry {
  tag: string;
  label: string;
}

export interface Dish {
  name: string;
  description: string;
  price: number;
  daypart: string;
  tags: string[];
  soldOut: boolean;
}

export interface MenuContent {
  currency: string;
  tagLegend: TagLegendEntry[];
  dayparts: Daypart[];
  dishes: Dish[];
}
