import site from "@/content/site.json";

const formatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return formatter.format(value);
}
