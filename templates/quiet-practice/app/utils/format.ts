/** All locale-sensitive formatting lives here so it can be changed in one place. */
const FEE_LOCALE = 'en-US'

export function formatFee(amount: number, currency: string): string {
  return new Intl.NumberFormat(FEE_LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
