export interface NavigationItem {
  label: string;
  href: string;
}

export interface SiteContent {
  name: string;
  eyebrow: string;
  headline: string;
  intro: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  hours: string[];
  navigation: NavigationItem[];
  booking: {
    label: string;
    subject: string;
    message: string;
  };
  addOns: Array<{
    name: string;
    price: number;
    mark: string;
  }>;
  services: Array<{
    number: string;
    name: string;
    description: string;
    price: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Breed {
  id: string;
  name: string;
  cut: string;
  price: number;
  duration: string;
  note: string;
  image: string;
  alt: string;
}
