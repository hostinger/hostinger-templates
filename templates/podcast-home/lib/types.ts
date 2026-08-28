export interface Chapter {
  title: string;
  /** Start position in whole seconds from the beginning of the audio. */
  start: number;
}

export interface TranscriptSegment {
  /** Speaker display name; empty string for narration lines. */
  speaker: string;
  text: string;
}

export interface Episode {
  slug: string;
  title: string;
  number: number;
  /** ISO date string, e.g. "2026-08-18". */
  date: string;
  /** Length of the audio in whole seconds. */
  duration: number;
  /** Public path to the audio file, e.g. "/audio/the-bell-foundry.m4a". */
  audio: string;
  guest: string;
  description: string;
  chapters: Chapter[];
  transcript: TranscriptSegment[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SiteConfig {
  showName: string;
  tagline: string;
  about: string[];
  host: {
    name: string;
    bio: string;
  };
  email: string;
  socials: SocialLink[];
  faqs: Faq[];
}
