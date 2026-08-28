import type { EventDetails, TicketTier } from '$lib/types/event'

export const getTicketHref = (tier: TicketTier, event: EventDetails): string => {
  if (tier.ticketUrl) return tier.ticketUrl

  const subject = `Ticket enquiry: ${event.name} — ${tier.name}`
  const body = [
    `Hello ${event.organizer},`,
    '',
    `I would like to book a ${tier.name} ticket for ${event.name}.`,
    'Please confirm current availability and next steps.',
    '',
    'Thank you.',
  ].join('\n')

  return `mailto:${event.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const formatPrice = (tier: TicketTier): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: tier.currency,
    maximumFractionDigits: 0,
  }).format(tier.price)
