import type { City } from '~/types'

/**
 * Curated city catalog. Add or remove entries here — each needs a unique
 * kebab-case slug and a valid IANA timezone identifier.
 */
export const CITIES: City[] = [
  { slug: 'london', label: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { slug: 'new-york', label: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { slug: 'tokyo', label: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { slug: 'paris', label: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { slug: 'berlin', label: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin' },
  { slug: 'lisbon', label: 'Lisbon', country: 'Portugal', timeZone: 'Europe/Lisbon' },
  { slug: 'warsaw', label: 'Warsaw', country: 'Poland', timeZone: 'Europe/Warsaw' },
  { slug: 'istanbul', label: 'Istanbul', country: 'Türkiye', timeZone: 'Europe/Istanbul' },
  { slug: 'dubai', label: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { slug: 'mumbai', label: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
  { slug: 'singapore', label: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { slug: 'hong-kong', label: 'Hong Kong', country: 'Hong Kong SAR', timeZone: 'Asia/Hong_Kong' },
  { slug: 'seoul', label: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul' },
  { slug: 'sydney', label: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { slug: 'auckland', label: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland' },
  { slug: 'los-angeles', label: 'Los Angeles', country: 'United States', timeZone: 'America/Los_Angeles' },
  { slug: 'denver', label: 'Denver', country: 'United States', timeZone: 'America/Denver' },
  { slug: 'chicago', label: 'Chicago', country: 'United States', timeZone: 'America/Chicago' },
  { slug: 'toronto', label: 'Toronto', country: 'Canada', timeZone: 'America/Toronto' },
  { slug: 'mexico-city', label: 'Mexico City', country: 'Mexico', timeZone: 'America/Mexico_City' },
  { slug: 'sao-paulo', label: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { slug: 'nairobi', label: 'Nairobi', country: 'Kenya', timeZone: 'Africa/Nairobi' },
]

export const CITY_BY_SLUG: Record<string, City> = Object.fromEntries(
  CITIES.map((city) => [city.slug, city]),
)

/** Cities shown before the visitor customizes anything. */
export const DEFAULT_CITY_SLUGS = ['london', 'new-york', 'tokyo']

/** Default working-hours window (09:00–17:00, end exclusive). */
export const DEFAULT_WORKING_HOURS = { start: 9, end: 17 }
