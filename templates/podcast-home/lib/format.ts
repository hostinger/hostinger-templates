const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-08-18" -> "August 18, 2026" */
export function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00Z`));
}

/** 71 -> "1:11"; 3 -> "0:03" */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** 12 -> "12" padded for display, e.g. "012" is not wanted; keep "12". */
export function formatEpisodeNumber(episodeNumber: number): string {
  return String(episodeNumber).padStart(2, "0");
}
