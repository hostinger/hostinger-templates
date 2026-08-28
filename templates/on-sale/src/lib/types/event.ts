export interface TicketTier {
  id: string
  name: string
  price: number
  currency: string
  remaining: number
  description: string
  perks: string[]
  ticketUrl: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export interface EventDetails {
  name: string
  eyebrow: string
  description: string
  startDate: string
  endDate: string
  earlyBirdEndsAt: string
  venue: {
    name: string
    address: string
    city: string
  }
  contactEmail: string
  organizer: string
  ticketDisclaimer: string
  ticketTiers: TicketTier[]
  faq: FaqItem[]
}
