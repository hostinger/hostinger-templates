import type { SiteContent } from '../types/content';

export interface BookingAction {
  href: string;
  label: string;
  shortLabel: string;
  external: boolean;
}

export interface BookingActions {
  primary: BookingAction;
  secondary: BookingAction | null;
}

/**
 * Resolves the booking handoff from `site.json`.
 * With a `bookingUrl`, every booking CTA opens the owner's scheduling link;
 * when it is empty the CTAs fall back to `tel:`, then `mailto:`, built from
 * the same contact details shown on the page.
 */
export function getBookingActions(site: SiteContent): BookingActions {
  const bookingUrl = site.bookingUrl.trim();
  const phone: BookingAction | null = site.phoneHref.trim()
    ? {
        href: site.phoneHref,
        label: `Call ${site.phoneDisplay}`,
        shortLabel: 'Call',
        external: false,
      }
    : null;
  const email: BookingAction = {
    href: `mailto:${site.email}`,
    label: 'Email the studio',
    shortLabel: 'Email',
    external: false,
  };

  if (bookingUrl) {
    return {
      primary: { href: bookingUrl, label: 'Book a mat', shortLabel: 'Book', external: true },
      secondary: phone ?? email,
    };
  }
  if (phone) {
    return { primary: phone, secondary: email };
  }
  return { primary: email, secondary: null };
}
