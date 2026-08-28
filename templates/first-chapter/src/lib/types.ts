export interface NavLink {
  label: string;
  href: string;
}

export interface BookMeta {
  title: string;
  author: string;
  coverSubtitle: string;
  tagline: string;
  genre: string;
  length: string;
  imprint: string;
  year: string;
}

export interface HeroContent {
  eyebrow: string;
  readLabel: string;
  continueLabel: string;
  readHint: string;
  progressChipSaved: string;
  progressChipDone: string;
}

export interface BlurbContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
}

export interface PraiseQuote {
  quote: string;
  source: string;
}

export interface PraiseContent {
  eyebrow: string;
  heading: string;
  quotes: PraiseQuote[];
}

export interface AuthorContent {
  eyebrow: string;
  heading: string;
  initials: string;
  bio: string[];
  email: string;
  emailLabel: string;
  emailNote: string;
}

export interface BuyContent {
  url: string;
  label: string;
  note: string;
  endHeading: string;
  endMessage: string;
}

export interface ReaderContent {
  backLabel: string;
  chapterLabel: string;
  smallerLabel: string;
  largerLabel: string;
  textSizeLabel: string;
  progressLabel: string;
  metaTemplate: string;
  minutesLeftTemplate: string;
  finishedLabel: string;
  positionNote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}

export interface FooterContent {
  line: string;
  smallPrint: string;
}

export interface SiteContent {
  book: BookMeta;
  nav: NavLink[];
  hero: HeroContent;
  blurb: BlurbContent;
  praise: PraiseContent;
  author: AuthorContent;
  buy: BuyContent;
  reader: ReaderContent;
  faq: FaqContent;
  footer: FooterContent;
}
