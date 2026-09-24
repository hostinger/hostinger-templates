import { site } from '../constants/content';

const wholeFormatter = new Intl.NumberFormat(site.locale, {
  style: 'currency',
  currency: site.currency,
  maximumFractionDigits: 0,
});

const centsFormatter = new Intl.NumberFormat(site.locale, {
  style: 'currency',
  currency: site.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 1 });

export const formatPrice = (amount: number) =>
  (Number.isInteger(amount) ? wholeFormatter : centsFormatter).format(amount);

export const formatPerPlayer = (courtPrice: number) =>
  formatPrice(Math.round((courtPrice / site.pricing.playersPerCourt) * 100) / 100);

export const formatDistance = (km: number) => (km < 1 ? `${Math.round(km * 1000 / 50) * 50} m` : `${numberFormatter.format(km)} km`);

export const pluralise = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export const fillTemplate = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
