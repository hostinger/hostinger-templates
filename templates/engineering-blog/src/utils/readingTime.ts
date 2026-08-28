const PROSE_WORDS_PER_MINUTE = 225;
const CODE_LINES_PER_MINUTE = 40;
const FENCED_CODE_BLOCK = /```[\s\S]*?```/g;

export type ReadingStats = {
  /** Prose words, with fenced code blocks excluded. */
  words: number;
  /** Lines inside fenced code blocks, read slower than prose. */
  codeLines: number;
  /** Estimated reading time, never below one minute. */
  minutes: number;
};

export function readingTimeFromMarkdown(markdown: string): ReadingStats {
  const fences = markdown.match(FENCED_CODE_BLOCK) ?? [];
  const codeLines = fences.reduce(
    (total, fence) => total + Math.max(fence.trimEnd().split('\n').length - 2, 0),
    0,
  );

  const prose = markdown.replace(FENCED_CODE_BLOCK, ' ');
  const words = prose
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;

  const minutes = Math.max(
    1,
    Math.round(words / PROSE_WORDS_PER_MINUTE + codeLines / CODE_LINES_PER_MINUTE),
  );

  return { words, codeLines, minutes };
}

export function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}
