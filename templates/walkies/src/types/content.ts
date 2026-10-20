export type TerrainId = 'park' | 'woodland' | 'riverside' | 'heath' | 'canal' | 'meadow';

export type LeadPolicy = 'off-lead' | 'on-lead';

/** 0 = Sunday … 6 = Saturday, matching `Date.prototype.getDay()`. */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface MapPosition {
  /** Horizontal position as a percentage of the map width. */
  left: number;
  /** Vertical position as a percentage of the map height. */
  top: number;
}

export interface WalkArea {
  id: string;
  name: string;
  neighbourhood: string;
  terrain: TerrainId;
  leadPolicy: LeadPolicy;
  summary: string;
  durationMinutes: number;
  price: number;
  maxDogs: number;
  walker: string;
  highlights: string[];
  walkDays: WeekdayIndex[];
  slotTimes: string[];
  mapPosition: MapPosition;
}

export interface Terrain {
  label: string;
  colorVariable: string;
}

export interface NavigationLink {
  label: string;
  path: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  dog: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type SlotStatus = 'available' | 'full' | 'yours';

export interface TimeSlot {
  time: string;
  status: SlotStatus;
  spotsLeft: number;
}

export interface BookingDetails {
  ownerName: string;
  email: string;
  dogName: string;
  notes: string;
}

export interface Booking extends BookingDetails {
  reference: string;
  areaId: string;
  dateKey: string;
  time: string;
}

export type BookingFieldErrors = Partial<Record<keyof BookingDetails, string>>;
