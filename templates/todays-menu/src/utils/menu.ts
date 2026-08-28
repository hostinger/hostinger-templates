import type { Daypart } from '../types/content';

/** Convert an "HH:MM" string from menu.json into minutes since midnight. */
export const parseTimeToMinutes = (value: string): number => {
  const [hours = 0, minutes = 0] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

/** Format an "HH:MM" string as a friendly 12-hour label, e.g. "7 am" or "11:30 am". */
export const formatTimeLabel = (value: string): string => {
  const [hours = 0, minutes = 0] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0 ? `${hour} ${suffix}` : `${hour}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

/** Format a dish price, keeping whole amounts short: 9 -> "$9", 7.5 -> "$7.50". */
export const formatPrice = (price: number, currency: string): string =>
  Number.isInteger(price) ? `${currency}${price}` : `${currency}${price.toFixed(2)}`;

/**
 * Index of the daypart currently being served, or -1 when the kitchen is
 * closed (before the first start or after the last end).
 */
export const resolveDaypartIndex = (dayparts: Daypart[], nowMinutes: number): number =>
  dayparts.findIndex(
    (daypart) =>
      nowMinutes >= parseTimeToMinutes(daypart.start) && nowMinutes < parseTimeToMinutes(daypart.end),
  );

/** Minutes since midnight in the visitor's local time zone. */
export const getLocalMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};
