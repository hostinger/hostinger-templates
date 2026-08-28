export interface City {
  /** Unique URL-safe identifier, e.g. "new-york". */
  slug: string
  /** Display name, e.g. "New York". */
  label: string
  /** Country or territory shown next to the label. */
  country: string
  /** IANA timezone identifier, e.g. "America/New_York". */
  timeZone: string
}

/** Local time-of-day bucket used for cell colors and the legend. */
export type TimeOfDay = 'night' | 'early' | 'work' | 'evening'

/** Working hours window. `start` is inclusive, `end` is exclusive (1–24). */
export interface WorkingHours {
  start: number
  end: number
}

/** One hour cell in a city strip. */
export interface HourCell {
  /** Column index 0–23, aligned to the viewer's local day. */
  column: number
  /** The city's local hour (0–23) at that instant. */
  localHour: number
  timeOfDay: TimeOfDay
  /** True when the local hour falls inside the working-hours window. */
  isWorking: boolean
}

/** A fully computed strip row for one city. */
export interface StripRow {
  city: City
  /** Current UTC offset label, e.g. "GMT+9". */
  offsetLabel: string
  cells: HourCell[]
}

/** A contiguous range of overlap columns. `end` is exclusive. */
export interface OverlapRange {
  start: number
  end: number
}
