const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** Human-readable date, e.g. "November 18, 2025". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** Machine-readable date for <time dateTime>, e.g. "2025-11-18". */
export function machineDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}
