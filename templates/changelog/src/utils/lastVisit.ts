export const LAST_VISIT_STORAGE_KEY = 'changelog:last-visit';

/**
 * Reads the stored last-visit moment as an epoch timestamp.
 * Returns null on a first visit or when storage is unavailable.
 */
export function readLastVisit(storage: Storage): number | null {
  try {
    const raw = storage.getItem(LAST_VISIT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Stores the given moment as the visitor's last visit (ISO string, easy to inspect). */
export function saveLastVisit(storage: Storage, timestamp: number): void {
  try {
    storage.setItem(LAST_VISIT_STORAGE_KEY, new Date(timestamp).toISOString());
  } catch {
    // Storage can be unavailable (e.g. blocked cookies); the marker simply stays off.
  }
}

/** Whether an entry published at `publishedAt` is newer than the last visit. */
export function isNewSince(publishedAt: string, lastVisitTimestamp: number): boolean {
  const publishedTimestamp = Date.parse(publishedAt);
  return Number.isFinite(publishedTimestamp) && publishedTimestamp > lastVisitTimestamp;
}
