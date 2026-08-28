const ENTRY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const VISIT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/** Formats a release date. Entry dates are calendar days, so they are pinned to UTC. */
export function formatDate(date: Date): string {
  return ENTRY_DATE_FORMATTER.format(date);
}

/** Formats the visitor's last-visit moment in their own timezone. */
export function formatVisitDate(date: Date): string {
  return VISIT_DATE_FORMATTER.format(date);
}

/** Returns the `YYYY-MM-DD` day for `<time datetime>` attributes. */
export function formatIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
