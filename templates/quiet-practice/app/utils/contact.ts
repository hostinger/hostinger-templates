import type { SiteContent } from '~/types/content'

/** Builds a dialable tel: href from the phone number shown on screen. */
export function telHref(countryCode: string, phoneDisplay: string): string {
  return `tel:${countryCode}${phoneDisplay.replace(/\D/g, '')}`
}

export function mailtoHref(email: string, subject?: string): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`
}

export interface BookingAction {
  kind: 'booking' | 'call'
  href: string
  label: string
  external: boolean
}

/**
 * The primary booking handoff. When `bookingUrl` is set in
 * `app/data/site.json` it links out to the booking service; otherwise it
 * falls back to a warm click-to-call built from the displayed number.
 */
export function bookingAction(siteContent: SiteContent): BookingAction {
  if (siteContent.bookingUrl) {
    return {
      kind: 'booking',
      href: siteContent.bookingUrl,
      label: siteContent.bookingLabel,
      external: true,
    }
  }
  return {
    kind: 'call',
    href: telHref(siteContent.phoneCountryCode, siteContent.phoneDisplay),
    label: `Call ${siteContent.phoneDisplay}`,
    external: false,
  }
}
