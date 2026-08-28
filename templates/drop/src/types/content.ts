export interface SocialLink {
  label: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  text: string;
}

export interface SiteContent {
  shopName: string;
  tagline: string;
  sellerName: string;
  email: string;
  city: string;
  intro: string;
  claimNote: string;
  howItWorks: HowItWorksStep[];
  socials: SocialLink[];
  faqs: Faq[];
  footerNote: string;
}

export interface DropItem {
  id: string;
  name: string;
  era: string;
  size: string;
  condition: string;
  price: number;
  image: string;
  imageAlt: string;
  sold: boolean;
}

export interface DropContent {
  dropName: string;
  dropNumber: number;
  /** ISO 8601 datetime with UTC offset, e.g. "2026-09-25T19:00:00-04:00". */
  dropDatetime: string;
  /** IANA time zone used to render the drop date, e.g. "America/New_York". */
  timezone: string;
  /** Short label shown next to times, e.g. "ET". */
  timezoneLabel: string;
  items: DropItem[];
}
