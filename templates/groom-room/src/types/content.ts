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
  booking: NavigationItem;
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
