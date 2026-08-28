export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  websiteUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  bookingUrl: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
  };
  hours: Array<{ days: string; time: string }>;
  socialProof: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
