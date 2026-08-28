export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Splits the time left until `target` into whole days, hours, minutes, and
 * seconds. Never goes negative — once kick-off passes it reports zeros.
 */
export const countdownTo = (target: Date, nowMs: number): CountdownParts => {
  const remaining = Math.max(0, target.getTime() - nowMs);

  return {
    days: Math.floor(remaining / DAY_MS),
    hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
    minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((remaining % MINUTE_MS) / SECOND_MS),
  };
};

/** Zero-pads a countdown unit to two digits for the scoreboard display. */
export const padUnit = (value: number): string => String(value).padStart(2, '0');
