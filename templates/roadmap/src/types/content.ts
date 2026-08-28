export type ColumnId = 'now' | 'next' | 'later';

export interface RoadmapColumn {
  id: ColumnId;
  label: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  baseVotes: number;
  status: ColumnId;
}

export interface RoadmapContent {
  columns: RoadmapColumn[];
  items: RoadmapItem[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SuggestContent {
  buttonLabel: string;
  subject: string;
  body: string;
}

export interface HeroContent {
  kicker: string;
  title: string;
  lede: string;
  noteTitle: string;
  note: string;
}

export interface BoardCopy {
  kicker: string;
  title: string;
  note: string;
  voteLabelTemplate: string;
  unvoteLabelTemplate: string;
  votedFlag: string;
  itemCountTemplate: string;
  noscriptNote: string;
}

export interface HowStep {
  title: string;
  body: string;
}

export interface HowItWorksContent {
  kicker: string;
  title: string;
  steps: HowStep[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  kicker: string;
  title: string;
  items: FaqItem[];
}

export interface FooterContent {
  line: string;
  emailLead: string;
  smallPrint: string;
}

export interface SiteContent {
  name: string;
  tagline: string;
  metaDescription: string;
  skipLabel: string;
  email: string;
  navigation: NavLink[];
  suggest: SuggestContent;
  hero: HeroContent;
  board: BoardCopy;
  howItWorks: HowItWorksContent;
  faq: FaqContent;
  footer: FooterContent;
}
