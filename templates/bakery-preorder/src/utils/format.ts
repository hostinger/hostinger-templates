export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

/** "Saturday 6 September" style date, for cut-off and collection copy. */
export function formatDayDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function padTwo(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}
