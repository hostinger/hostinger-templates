import type { SeriesNavigation } from '../utils/series';

export type NavLink = {
  label: string;
  href: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Author = {
  name: string;
  role: string;
};

export type SiteContent = {
  name: string;
  wordmark: { lead: string; tail: string };
  siteUrl: string;
  description: string;
  masthead: {
    eyebrow: string;
    headline: string;
    dek: string;
    meta: string[];
  };
  nav: NavLink[];
  writing: { heading: string; lede: string };
  about: { heading: string; paragraphs: string[]; authorsHeading: string };
  authors: Author[];
  faq: { heading: string; lede: string; items: Faq[] };
  footer: { note: string; links: NavLink[]; colophon: string };
};

export type PostFields = {
  slug: string;
  readingMinutes: number;
  words: number;
};

export type PostFrontmatter = {
  title: string;
  date: string;
  author: string;
  tags: string[];
  series: string | null;
  part: number | null;
};

export type PostListEntry = {
  id: string;
  excerpt: string;
  fields: PostFields;
  frontmatter: PostFrontmatter;
};

export type LoadedPost = PostListEntry & {
  html: string;
};

export type PostPageContext = {
  id: string;
  seriesNav: SeriesNavigation | null;
};
