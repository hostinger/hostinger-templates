export interface NavigationItem {
  label: string;
  href: string;
}

export interface ProofItem {
  value: string;
  label: string;
}

export interface SiteContent {
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  serviceArea: string;
  responseTime: string;
  navigation: NavigationItem[];
  included: string[];
  proof: ProofItem[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Frequency {
  id: 'weekly' | 'biweekly' | 'once';
  label: string;
  shortLabel: string;
  discountPercent: number;
  note: string;
}

export interface Pricing {
  currency: string;
  symbol: string;
  basePrice: number;
  bedroomIncrement: number;
  bathroomIncrement: number;
  includedBedrooms: number;
  includedBathrooms: number;
  minimumBedrooms: number;
  maximumBedrooms: number;
  minimumBathrooms: number;
  maximumBathrooms: number;
  frequencies: Frequency[];
}
