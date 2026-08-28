export interface SiteLink {
  label: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteContent {
  name: string;
  legalName: string;
  tagline: string;
  intro: string;
  navigation: SiteLink[];
  socials: SiteLink[];
  faqIntro: string;
  faqs: Faq[];
  footerNote: string;
}
