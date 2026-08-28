export type Product = {
  id: string;
  slug: string;
  name: string;
  edition: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  image: string;
  imagePosition?: string;
  dimensions: string;
  material: string;
  finish: string;
  leadTime: string;
  featured?: boolean;
};

export type SiteConfig = {
  studioName: string;
  eyebrow: string;
  headline: string;
  intro: string;
  currency: string;
  locale: string;
  checkoutUrl: string;
  enquiryEmail: string;
  location: string;
  shippingNote: string;
  announcement: string;
  faq: Array<{ question: string; answer: string }>;
};

export type CartLine = {
  productId: string;
  quantity: number;
};
