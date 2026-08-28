export interface NumericLimit {
  min: number
  max: number
  step: number
}

export interface UsageTier {
  upTo: number | null
  unitPrice: number
  label: string
}

export interface PricingRules {
  baseFee: number
  includedSeats: number
  seatUnitPrice: number
  includedUsage: number
  usageTiers: UsageTier[]
}

export interface EstimateInput {
  seats: number
  usage: number
}

export interface ChargeLine {
  id: string
  label: string
  detail: string
  amount: number
}

export interface Estimate {
  lines: ChargeLine[]
  total: number
  overageSeats: number
  billableUsage: number
}

export interface PricingContent {
  product: {
    name: string
    eyebrow: string
    headline: string
    description: string
    currency: string
    billingPeriod: string
  }
  defaults: EstimateInput
  limits: {
    seats: NumericLimit
    usage: NumericLimit
  }
  pricing: PricingRules
  howTo: Array<{ question: string; answer: string }>
}
