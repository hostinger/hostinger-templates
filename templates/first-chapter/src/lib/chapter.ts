import { marked } from 'marked';
import rawChapter from '../content/book.md?raw';

export interface Chapter {
  /** Text of the first `#` heading in `src/content/book.md`. */
  heading: string;
  /** The whole chapter rendered to HTML at bundle time. */
  html: string;
  wordCount: number;
  /** Estimated reading time in whole minutes. */
  minutes: number;
}

const WORDS_PER_MINUTE = 220;

function countWords(markdown: string): number {
  return markdown
    .replace(/[#>*_`—·]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function extractHeading(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Chapter One';
}

const wordCount = countWords(rawChapter);

export const chapter: Chapter = {
  heading: extractHeading(rawChapter),
  html: marked.parse(rawChapter, { async: false }),
  wordCount,
  minutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
};

/** Fills `{words}` and `{minutes}` placeholders in copy templates from site.json. */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}
