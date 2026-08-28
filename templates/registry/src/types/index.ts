export interface Gift {
  id: string;
  title: string;
  note: string;
  priceLabel: string;
  category: string;
  shopUrl?: string;
  seedClaimed?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  coupleNames: string;
  eventLine: string;
  eyebrow: string;
  intro: string;
  deviceNote: string;
  summaryHeading: string;
  faqHeading: string;
  faqIntro: string;
  faq: FaqItem[];
  footerSignoff: string;
  footerNote: string;
}
