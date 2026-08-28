import type { TimeOfDay, WorkingHours } from '~/types'

const hourFormatters = new Map<string, Intl.DateTimeFormat>()

function getHourFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = hourFormatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: 'numeric',
      hourCycle: 'h23',
    })
    hourFormatters.set(timeZone, formatter)
  }
  return formatter
}

/** The given timezone's local hour (0–23) at a specific instant. */
export function localHourAt(instant: Date, timeZone: string): number {
  return Number(getHourFormatter(timeZone).format(instant))
}

/** Current UTC offset label for a timezone, e.g. "GMT+5:30". */
export function offsetLabel(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(instant)
  return parts.find((part) => part.type === 'timeZoneName')?.value ?? ''
}

/**
 * 24 instants, one at each hour of the viewer's current local day.
 * Uses local-time semantics so DST-shifted days stay aligned to wall clocks.
 */
export function viewerDayInstants(now: Date): Date[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const instant = new Date(now)
    instant.setHours(hour, 0, 0, 0)
    return instant
  })
}

/** Human label for the viewer's reference day, e.g. "Friday 28 Aug". */
export function viewerDayLabel(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(now)
}

/** "14:00" style label for an hour 0–24. */
export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

/** Bucket a local hour into the palette's time-of-day categories. */
export function timeOfDay(hour: number): TimeOfDay {
  if (hour >= 22 || hour <= 4) return 'night'
  if (hour <= 8) return 'early'
  if (hour <= 17) return 'work'
  return 'evening'
}

/** Whether a local hour falls inside a working-hours window. */
export function isWithinWorkingHours(hour: number, window: WorkingHours): boolean {
  return hour >= window.start && hour < window.end
}
