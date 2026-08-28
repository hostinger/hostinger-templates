import { CURRENCY_CODE, CURRENCY_LOCALE } from '../constants/copy';

const money = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: 'currency',
  currency: CURRENCY_CODE,
});

const percent = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Format whole or fractional pence as currency, e.g. 74161 → "£741.61". */
export function formatPence(pence: number): string {
  return money.format(pence / 100);
}

/** Format a signed pence delta, e.g. 0.4 → "+£0.00", -60.2 → "−£0.60". */
export function formatPenceDelta(pence: number): string {
  const rounded = Math.round(pence) / 100;
  const sign = rounded < 0 ? '\u2212' : '+';
  return `${sign}${money.format(Math.abs(rounded))}`;
}

/** Format a 0–1 fraction as a percentage, e.g. 0.433 → "43.3%". */
export function formatShare(fraction: number): string {
  return percent.format(fraction);
}

/** Format a weight multiplier, e.g. 1.1 → "×1.10". */
export function formatMultiplier(multiplier: number): string {
  return `\u00d7${multiplier.toFixed(2)}`;
}
