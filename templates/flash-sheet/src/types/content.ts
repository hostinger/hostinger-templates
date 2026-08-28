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
  eyebrow: string;
  headline: string;
  intro: string;
  email: string;
  instagram: string;
  address: string;
  hours: string;
  about: string;
  faqs: Faq[];
};
