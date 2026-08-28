const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats an ISO `YYYY-MM-DD` date from the content files as "3 August 2026". */
export function formatDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      `"${isoDate}" is not a valid ISO date. Use the YYYY-MM-DD form in the data files.`,
    );
  }
  return DATE_FORMATTER.format(parsed);
}

const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
});

/** Formats a moment in time as "28 August 2026, 14:05 UTC" for the report text. */
export function formatTimestamp(date: Date): string {
  return TIMESTAMP_FORMATTER.format(date);
}
