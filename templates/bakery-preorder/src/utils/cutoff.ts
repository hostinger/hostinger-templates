import type { OrderCutoff, Weekday } from '../types/content';

const WEEKDAY_INDEX: Record<Weekday, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export interface CutoffStatus {
  /** The next moment orders close, always in the future. */
  nextCutoff: Date;
  /** The bake-day collection date that follows the next cut-off. */
  collectionDate: Date;
  /**
   * True when this week's cut-off has already passed but its collection day
   * is not over yet — visitors are now ordering for the following week.
   */
  reopened: boolean;
  /** The collection date visitors just missed, when `reopened` is true. */
  missedCollectionDate: Date | null;
}

function parseTime(time: string): { hour: number; minute: number } {
  const [hourPart, minutePart] = time.split(':');
  const hour = Number(hourPart);
  const minute = Number(minutePart ?? 0);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 18, minute: 0 };
  }
  return { hour, minute };
}

/** Next occurrence of `day` at `time`, strictly after `from`. */
export function nextOccurrence(day: Weekday, time: string, from: Date): Date {
  const { hour, minute } = parseTime(time);
  const target = new Date(from);
  const dayDiff = (WEEKDAY_INDEX[day] - from.getDay() + 7) % 7;
  target.setDate(from.getDate() + dayDiff);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= from.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

/** First occurrence of `bakeDay` strictly after the given cut-off moment. */
export function collectionDateFor(cutoff: Date, bakeDay: Weekday): Date {
  const date = new Date(cutoff);
  const dayDiff = (WEEKDAY_INDEX[bakeDay] - cutoff.getDay() + 7) % 7 || 7;
  date.setDate(cutoff.getDate() + dayDiff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Everything the page needs to talk honestly about the cut-off, computed
 * from configuration so it never goes stale.
 */
export function getCutoffStatus(
  cutoff: OrderCutoff,
  bakeDay: Weekday,
  now: Date = new Date(),
): CutoffStatus {
  const nextCutoff = nextOccurrence(cutoff.day, cutoff.time, now);
  const collectionDate = collectionDateFor(nextCutoff, bakeDay);

  const previousCutoff = new Date(nextCutoff);
  previousCutoff.setDate(previousCutoff.getDate() - 7);
  const missedCollection = collectionDateFor(previousCutoff, bakeDay);
  const endOfMissedCollection = new Date(missedCollection);
  endOfMissedCollection.setHours(23, 59, 59, 999);

  const reopened = now.getTime() <= endOfMissedCollection.getTime();

  return {
    nextCutoff,
    collectionDate,
    reopened,
    missedCollectionDate: reopened ? missedCollection : null,
  };
}
