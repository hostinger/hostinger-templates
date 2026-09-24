import type { OpeningWindow, WeeklyHours } from '../types/content';

export type DayKey = keyof WeeklyHours;

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string | null; opensDay: 'today' | 'tomorrow' | null };

export const WEEK_ROWS: { key: DayKey; label: string }[] = [
  { key: 'weekdays', label: 'Monday – Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export const dayKeyFor = (date: Date): DayKey => {
  const day = date.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekdays';
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const closingMinutes = (window: OpeningWindow) => {
  const close = toMinutes(window[1]);
  return close <= toMinutes(window[0]) ? close + 24 * 60 : close;
};

export const formatWindow = (window: OpeningWindow | null) =>
  window ? `${window[0]} – ${window[1] === '00:00' ? 'midnight' : window[1]}` : 'Closed';

export const getOpenStatus = (hours: WeeklyHours, now: Date): OpenStatus => {
  const today = hours[dayKeyFor(now)];
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = hours[dayKeyFor(yesterdayDate)];
  if (yesterday && minutesNow + 24 * 60 < closingMinutes(yesterday)) {
    return { open: true, closesAt: yesterday[1] };
  }

  if (today && minutesNow >= toMinutes(today[0]) && minutesNow < closingMinutes(today)) {
    return { open: true, closesAt: today[1] === '00:00' ? 'midnight' : today[1] };
  }

  if (today && minutesNow < toMinutes(today[0])) {
    return { open: false, opensAt: today[0], opensDay: 'today' };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const next = hours[dayKeyFor(tomorrow)];
  return next ? { open: false, opensAt: next[0], opensDay: 'tomorrow' } : { open: false, opensAt: null, opensDay: null };
};

export const describeStatus = (status: OpenStatus) => {
  if (status.open) return `Open until ${status.closesAt}`;
  if (!status.opensAt) return 'Closed today and tomorrow';
  return status.opensDay === 'today' ? `Opens at ${status.opensAt}` : `Opens tomorrow at ${status.opensAt}`;
};
