import type { ClassEntry, Weekday } from '../types/content';

/** Display order for the timetable grid. */
export const WEEK_ORDER: Weekday[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/** Weekday names indexed by JavaScript's `Date#getDay()` (0 = Sunday). */
export const WEEKDAY_BY_JS_DAY: Weekday[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MS_PER_MINUTE = 60_000;

export interface TimeOfDay {
  hours: number;
  minutes: number;
}

export interface UpcomingClass {
  entry: ClassEntry;
  startsAt: Date;
}

export interface LiveClass {
  entry: ClassEntry;
  startedAt: Date;
  endsAt: Date;
}

/** Parses a "HH:MM" 24-hour string; returns null for anything malformed. */
export function parseStartTime(startTime: string): TimeOfDay | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(startTime.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

/** Maps a weekday name to `Date#getDay()` numbering; null when unrecognized. */
export function getWeekdayIndex(weekday: string): number | null {
  const index = WEEKDAY_BY_JS_DAY.indexOf(weekday as Weekday);
  return index === -1 ? null : index;
}

/**
 * Next time this recurring class begins, strictly after `now`.
 * Rolls past classes earlier today and looks ahead across the week,
 * so it is correct at any moment without hardcoded dates.
 */
export function getNextOccurrence(entry: ClassEntry, now: Date): Date | null {
  const dayIndex = getWeekdayIndex(entry.weekday);
  const time = parseStartTime(entry.startTime);
  if (dayIndex === null || !time) return null;

  const occurrence = new Date(now);
  occurrence.setHours(time.hours, time.minutes, 0, 0);

  let daysAhead = (dayIndex - now.getDay() + 7) % 7;
  if (daysAhead === 0 && occurrence.getTime() <= now.getTime()) {
    daysAhead = 7;
  }
  occurrence.setDate(occurrence.getDate() + daysAhead);
  return occurrence;
}

/** Most recent time this recurring class began, at or before `now`. */
export function getPreviousOccurrence(entry: ClassEntry, now: Date): Date | null {
  const next = getNextOccurrence(entry, now);
  if (!next) return null;
  const previous = new Date(next);
  previous.setDate(previous.getDate() - 7);
  return previous;
}

/** The soonest upcoming class across the whole weekly timetable. */
export function findNextClass(entries: ClassEntry[], now: Date): UpcomingClass | null {
  let best: UpcomingClass | null = null;
  for (const entry of entries) {
    const startsAt = getNextOccurrence(entry, now);
    if (!startsAt) continue;
    if (!best || startsAt.getTime() < best.startsAt.getTime()) {
      best = { entry, startsAt };
    }
  }
  return best;
}

/** The class currently in session, if one is running right now. */
export function findLiveClass(entries: ClassEntry[], now: Date): LiveClass | null {
  let best: LiveClass | null = null;
  for (const entry of entries) {
    const startedAt = getPreviousOccurrence(entry, now);
    if (!startedAt) continue;
    const endsAt = new Date(startedAt.getTime() + entry.durationMinutes * MS_PER_MINUTE);
    if (now.getTime() < startedAt.getTime() || now.getTime() >= endsAt.getTime()) continue;
    if (!best || startedAt.getTime() > best.startedAt.getTime()) {
      best = { entry, startedAt, endsAt };
    }
  }
  return best;
}

function startMinutes(entry: ClassEntry): number {
  const time = parseStartTime(entry.startTime);
  return time ? time.hours * 60 + time.minutes : Number.MAX_SAFE_INTEGER;
}

/** Classes for one weekday, sorted by start time, for rendering the grid. */
export function getClassesForWeekday(entries: ClassEntry[], weekday: Weekday): ClassEntry[] {
  return entries
    .filter((entry) => entry.weekday === weekday)
    .sort((a, b) => startMinutes(a) - startMinutes(b));
}
