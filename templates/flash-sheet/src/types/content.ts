export type FlashDesign = {
  id: string;
  name: string;
  number: string;
  motif: string;
  size: string;
  placement: string;
  price: string;
  availability: string;
  artwork: keyof typeof import('../constants/artwork').artworkByFile;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type SiteContent = {
  studioName: string;
  monogram: string;
  city: string;
  establishedYear: string;
  specialties: string;
  eyebrow: string;
  headline: string;
  intro: string;
  email: string;
  instagram: string;
  instagramHref: string;
  address: string;
  hours: string;
  about: string;
  enquiryIntro: string;
  faqs: Faq[];
};
