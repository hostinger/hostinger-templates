/**
 * Reader preferences and reading-position persistence.
 * Everything is stored in `localStorage` on the reader's own device;
 * nothing leaves the browser.
 */

export const TEXT_SIZES = [17, 19, 21, 23] as const;
export const DEFAULT_TEXT_SIZE_INDEX = 1;

const POSITION_KEY = 'first-chapter.position';
const TEXT_SIZE_KEY = 'first-chapter.textSize';

export interface ReadingPosition {
  /** Index of the chapter block (paragraph, heading, rule) the reader was on. */
  block: number;
  /** Share of the chapter scrolled past, from 0 to 1. */
  progress: number;
}

function readValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); reading still works without it.
  }
}

export function clampTextSizeIndex(index: number): number {
  return Math.min(Math.max(index, 0), TEXT_SIZES.length - 1);
}

export function loadTextSizeIndex(): number {
  const raw = readValue(TEXT_SIZE_KEY);
  const parsed = raw === null ? Number.NaN : Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? DEFAULT_TEXT_SIZE_INDEX : clampTextSizeIndex(parsed);
}

export function saveTextSizeIndex(index: number): void {
  writeValue(TEXT_SIZE_KEY, String(clampTextSizeIndex(index)));
}

export function loadPosition(): ReadingPosition | null {
  const raw = readValue(POSITION_KEY);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { block, progress } = parsed as Partial<ReadingPosition>;
    if (typeof block !== 'number' || typeof progress !== 'number') return null;
    return {
      block: Math.max(0, Math.floor(block)),
      progress: Math.min(Math.max(progress, 0), 1),
    };
  } catch {
    return null;
  }
}

export function savePosition(position: ReadingPosition): void {
  writeValue(POSITION_KEY, JSON.stringify(position));
}

export function minutesLeft(totalMinutes: number, progress: number): number {
  return Math.max(0, Math.ceil(totalMinutes * (1 - Math.min(Math.max(progress, 0), 1))));
}
