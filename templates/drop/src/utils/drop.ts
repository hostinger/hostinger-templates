export type DropStatus = "upcoming" | "live";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** "upcoming" until the configured drop datetime passes, then "live". */
export function getDropStatus(dropIso: string, now: Date): DropStatus {
  return now.getTime() < new Date(dropIso).getTime() ? "upcoming" : "live";
}

/** Time left until the drop, clamped to zero once it has passed. */
export function getCountdownParts(dropIso: string, now: Date): CountdownParts {
  const totalMs = Math.max(0, new Date(dropIso).getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Two-digit display value for a countdown cell, e.g. 7 -> "07". */
export function padUnit(value: number): string {
  return String(value).padStart(2, "0");
}

/** Long date in the drop's own time zone, e.g. "Friday, September 25". */
export function formatDropDate(dropIso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(new Date(dropIso));
}

/** Short date in the drop's own time zone, e.g. "Fri Sep 25". */
export function formatDropDateShort(dropIso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(new Date(dropIso));
}

/** Clock time in the drop's own time zone, e.g. "7:00 PM". */
export function formatDropTime(dropIso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(dropIso));
}

/** Whole-dollar price label, e.g. 340 -> "$340". */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
