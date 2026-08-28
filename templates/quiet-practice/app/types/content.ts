export interface Therapist {
  name: string
  credentials: string
  licence: string
}

export interface HeroCopy {
  eyebrow: string
  heading: string
  lead: string
  primaryCta: string
  secondaryCta: string
}

export interface SectionCopy {
  eyebrow: string
  title: string
  lead: string
}

export interface Step {
  title: string
  body: string
}

export interface StepsCopy {
  eyebrow: string
  title: string
  items: Step[]
}

export interface Faq {
  question: string
  answer: string
}

export interface FaqCopy {
  eyebrow: string
  title: string
  items: Faq[]
}

export interface ContactCopy {
  eyebrow: string
  title: string
  body: string
  emailLabel: string
  emailSubject: string
}

export interface ServicePageCopy {
  backLabel: string
  fitTitle: string
  approachTitle: string
  firstTitle: string
  asideTitle: string
  emailLabel: string
  othersLabel: string
  detailLabels: {
    length: string
    fee: string
    frequency: string
    format: string
  }
}

export interface NavLink {
  label: string
  href: string
}

export interface SiteContent {
  name: string
  descriptor: string
  location: string
  addressLine: string
  formatLine: string
  hours: string
  therapist: Therapist
  phoneDisplay: string
  phoneCountryCode: string
  email: string
  bookingUrl: string
  bookingLabel: string
  responseNote: string
  hero: HeroCopy
  facts: string[]
  servicesSection: SectionCopy
  steps: StepsCopy
  faq: FaqCopy
  contact: ContactCopy
  servicePage: ServicePageCopy
  checkNav: string
  disclaimer: string
  crisisNote: string
  footerNote: string
  navigation: NavLink[]
}

export interface SessionDetails {
  length: string
  feeAmount: number
  feeCurrency: string
  frequency: string
  format: string
}

/**
 * `tone` picks the accent used on service rows, pages, and cross-links.
 * The three shipped tones are defined in `app/assets/css/main.css`:
 * "dusk", "lavender", and "sand". Unknown values fall back to the default
 * accent.
 */
export interface Service {
  slug: string
  name: string
  shortName: string
  tone: string
  forWhen: string
  summary: string
  signals: string[]
  approach: string[]
  session: SessionDetails
  firstSession: string
}

/**
 * Each option adds points to one or more services (keyed by service slug).
 * The service with the highest total wins; ties go to whichever service led
 * earliest in the check. See `app/utils/selfCheck.ts`.
 */
export interface SelfCheckOption {
  label: string
  weights: Partial<Record<string, number>>
}

export interface SelfCheckQuestion {
  id: string
  prompt: string
  options: SelfCheckOption[]
}

export interface SelfCheckContent {
  eyebrow: string
  title: string
  lead: string
  hint: string
  backLabel: string
  routingLabel: string
  disclaimer: string
  fallbackLabel: string
  noscript: string
  questions: SelfCheckQuestion[]
}
