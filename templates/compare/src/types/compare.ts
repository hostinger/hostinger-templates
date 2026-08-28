export interface Product {
  id: string;
  name: string;
  label: string;
  price: string;
  priceNote: string;
  summary: string;
  recommended?: boolean;
}

export interface Feature {
  name: string;
  category: string;
  note: string;
  values: Record<string, string>;
  winner: string;
  loss?: boolean;
  callout?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CompareContent {
  meta: {
    title: string;
    description: string;
    email: string;
    lastReviewed: string;
  };
  products: Product[];
  features: Feature[];
  faq: FaqItem[];
}
