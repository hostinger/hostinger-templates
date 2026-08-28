import type { BookingDates } from '~/types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const todayIso = () => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)

  return local.toISOString().slice(0, 10)
}

export const isValidIsoDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false

  const date = new Date(`${value}T12:00:00`)

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

export const validateDates = ({ arrival, departure }: BookingDates) => {
  if (!arrival || !departure) return 'Choose both an arrival and departure date.'
  if (!isValidIsoDate(arrival) || !isValidIsoDate(departure)) {
    return 'Enter valid dates.'
  }
  if (arrival < todayIso()) return 'Arrival cannot be in the past.'
  if (departure <= arrival) return 'Departure must be after arrival.'

  return ''
}

export const createBookingLink = (
  bookingUrl: string,
  email: string,
  roomName: string,
  dates: BookingDates,
) => {
  if (bookingUrl) {
    const url = new URL(bookingUrl)
    url.searchParams.set('arrival', dates.arrival)
    url.searchParams.set('departure', dates.departure)
    if (roomName) url.searchParams.set('room', roomName)

    return url.toString()
  }

  const subject = `Stay enquiry${roomName ? ` — ${roomName}` : ''}`
  const body = `Hello,\n\nI would like to enquire about a stay from ${dates.arrival} to ${dates.departure}${roomName ? ` in ${roomName}` : ''}.\n\nThank you.`

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
