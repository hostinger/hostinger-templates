import type { ClassLevel } from '../types/content';
import { WEEKDAY_BY_JS_DAY, parseStartTime } from './schedule';

const MS_PER_DAY = 86_400_000;

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Formats a wall-clock time as "7:00 AM" / "6:30 PM". */
export function formatClockTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const clockHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${clockHours}:${pad2(minutes)} ${period}`;
}

/** Formats a "HH:MM" timetable string for display; echoes invalid input. */
export function formatStartTime(startTime: string): string {
  const time = parseStartTime(startTime);
  return time ? formatClockTime(time.hours, time.minutes) : startTime;
}

export function formatTimeFromDate(date: Date): string {
  return formatClockTime(date.getHours(), date.getMinutes());
}

export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

export function getCountdownParts(msLeft: number): CountdownParts {
  const total = Math.max(0, msLeft);
  return {
    days: Math.floor(total / MS_PER_DAY),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1_000) % 60,
  };
}

/** Compact countdown for the grid pill, e.g. "1d 6h", "3h 12m", "9m 41s". */
export function formatCountdownShort(msLeft: number): string {
  const { days, hours, minutes, seconds } = getCountdownParts(msLeft);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${pad2(minutes)}m`;
  if (minutes > 0) return `${minutes}m ${pad2(seconds)}s`;
  return `${seconds}s`;
}

/** "today", "tomorrow", or "on Saturday" relative to `now`. */
export function formatRelativeDay(target: Date, now: Date): string {
  const startOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  const dayDiff = Math.round((startOfDay(target) - startOfDay(now)) / MS_PER_DAY);
  if (dayDiff === 0) return 'today';
  if (dayDiff === 1) return 'tomorrow';
  return `on ${WEEKDAY_BY_JS_DAY[target.getDay()] ?? ''}`.trim();
}

/** CSS-friendly slug for a class level, e.g. "All levels" -> "all-levels". */
export function getLevelSlug(level: ClassLevel): string {
  return level.toLowerCase().replace(/\s+/g, '-');
}
