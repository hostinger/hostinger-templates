import { BOOKING_WINDOW_DAYS, FIRST_BOOKABLE_DAY_OFFSET } from '../constants/booking';
import type { Booking, TimeSlot, WalkArea, WeekdayIndex } from '../types/content';
import { toDateKey } from './format';
import { hashText } from './hash';

export interface BookableDate {
  date: Date;
  dateKey: string;
}

export function getBookableDates(today: Date): BookableDate[] {
  const bookableDates = Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + FIRST_BOOKABLE_DAY_OFFSET + index);

    return { date, dateKey: toDateKey(date) };
  });

  return bookableDates;
}

export function isAreaRunningOn(area: WalkArea, date: Date): boolean {
  const weekday = date.getDay() as WeekdayIndex;
  const isRunning = area.walkDays.includes(weekday);

  return isRunning;
}

/**
 * Sample occupancy for the demo: a stable pseudo-random number of dogs already booked per slot,
 * so the same area, day, and time always show the same spaces. Replace with a real diary lookup.
 */
function getSampleBookedDogs(area: WalkArea, dateKey: string, time: string): number {
  const seed = hashText(`${area.id}|${dateKey}|${time}`);
  const bookedDogs = Math.min(seed % (area.maxDogs + 2), area.maxDogs);

  return bookedDogs;
}

export function getTimeSlots(area: WalkArea, bookableDate: BookableDate, bookings: Booking[]): TimeSlot[] {
  if (!isAreaRunningOn(area, bookableDate.date)) {
    return [];
  }

  const timeSlots = area.slotTimes.map((time): TimeSlot => {
    const isBookedByVisitor = bookings.some(
      (booking) => booking.areaId === area.id && booking.dateKey === bookableDate.dateKey && booking.time === time,
    );
    const sampleBookedDogs = getSampleBookedDogs(area, bookableDate.dateKey, time);
    const spotsLeft = Math.max(area.maxDogs - sampleBookedDogs - (isBookedByVisitor ? 1 : 0), 0);

    if (isBookedByVisitor) {
      return { time, status: 'yours', spotsLeft };
    }

    const status = spotsLeft === 0 ? 'full' : 'available';

    return { time, status, spotsLeft };
  });

  return timeSlots;
}
