import type { ChargeLine, Estimate, EstimateInput, PricingRules } from '$lib/types/pricing'

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function calculateEstimate(input: EstimateInput, rules: PricingRules): Estimate {
  const overageSeats = Math.max(0, input.seats - rules.includedSeats)
  const billableUsage = Math.max(0, input.usage - rules.includedUsage)
  const lines: ChargeLine[] = [
    {
      id: 'platform',
      label: 'Platform',
      detail: `${rules.includedSeats} seats + ${formatCompact(rules.includedUsage)} calls included`,
      amount: rules.baseFee,
    },
    {
      id: 'seats',
      label: 'Additional seats',
      detail: overageSeats ? `${overageSeats} × ${formatCurrency(rules.seatUnitPrice)}` : 'Covered by platform',
      amount: overageSeats * rules.seatUnitPrice,
    },
  ]

  let tierStart = rules.includedUsage
  let remaining = billableUsage

  rules.usageTiers.forEach((tier, index) => {
    const tierCapacity = tier.upTo === null ? remaining : Math.max(0, tier.upTo - tierStart)
    const units = Math.min(remaining, tierCapacity)

    if (units > 0) {
      lines.push({
        id: `usage-${index}`,
        label: tier.label,
        detail: `${formatCompact(units)} × ${formatCurrency(tier.unitPrice, 5)}`,
        amount: roundCurrency(units * tier.unitPrice),
      })
    }

    remaining -= units
    if (tier.upTo !== null) tierStart = tier.upTo
  })

  const total = roundCurrency(lines.reduce((sum, line) => sum + line.amount, 0))

  return { lines, total, overageSeats, billableUsage }
}

export function formatCurrency(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
