import { LOCALE } from '../constants/site';
import type { WeekdayIndex } from '../types/content';

const priceFormatter = new Intl.NumberFormat(LOCALE.language, {
  style: 'currency',
  currency: LOCALE.currency,
  maximumFractionDigits: 0,
});

const longDateFormatter = new Intl.DateTimeFormat(LOCALE.language, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const weekdayShortFormatter = new Intl.DateTimeFormat(LOCALE.language, { weekday: 'short' });
const monthShortFormatter = new Intl.DateTimeFormat(LOCALE.language, { month: 'short' });

/** A known Sunday, used to turn weekday indexes into localized names. */
const REFERENCE_SUNDAY = new Date(2026, 0, 4);

const DAYS_PER_WEEK = 7;
const EVERY_DAY_LABEL = 'daily';

export function formatPrice(amount: number): string {
  const formattedPrice = priceFormatter.format(amount);

  return formattedPrice;
}

export function formatLongDate(date: Date): string {
  const formattedDate = longDateFormatter.format(date);

  return formattedDate;
}

export function formatDateChip(date: Date) {
  const chipParts = {
    weekday: weekdayShortFormatter.format(date),
    day: String(date.getDate()),
    month: monthShortFormatter.format(date),
  };

  return chipParts;
}

export function formatWeekdayList(weekdays: WeekdayIndex[]): string {
  const everyDay = weekdays.length === DAYS_PER_WEEK;
  if (everyDay) {
    return EVERY_DAY_LABEL;
  }

  const mondayFirstOrder = (weekday: number) => (weekday + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const mondayFirst = [...weekdays].sort((first, second) => mondayFirstOrder(first) - mondayFirstOrder(second));
  const names = mondayFirst.map((weekday) => {
    const date = new Date(REFERENCE_SUNDAY);
    date.setDate(REFERENCE_SUNDAY.getDate() + weekday);

    return weekdayShortFormatter.format(date);
  });
  const weekdayList = names.join(', ');

  return weekdayList;
}

/** Local calendar date as `YYYY-MM-DD`, so keys do not shift with the UTC offset. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  return dateKey;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date;
}
