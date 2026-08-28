export interface Room {
  slug: string
  key: string
  name: string
  deck: string
  description: string
  longDescription: string
  sleeps: number
  bed: string
  size: string
  outlook: string
  image: string
  imageAlt: string
  details: string[]
  goodToKnow: string
}

export interface SeasonalRate {
  season: string
  months: string
  note: string
  nightly: Record<string, number>
}

export interface Faq {
  question: string
  answer: string
}

export interface BookingDates {
  arrival: string
  departure: string
}
