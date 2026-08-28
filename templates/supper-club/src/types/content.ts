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
  monogram: string;
  tagline: string;
  host: string;
  hostRole: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  city: string;
  venuePolicy: string;
  navigation: NavigationItem[];
  socials: SocialLink[];
  faqs: Faq[];
}

export interface Course {
  numeral: string;
  title: string;
  name: string;
  description: string;
  pairing: string;
}

export interface SupperEvent {
  number: string;
  theme: string;
  date: string;
  timezone: string;
  doors: string;
  seated: string;
  venue: string;
  pricePerSeat: number;
  currency: string;
  includes: string[];
  seatCap: number;
  seatsRemaining: number;
  courses: Course[];
}
