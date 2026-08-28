/** Key under which voted item ids are persisted in localStorage. */
export const VOTES_STORAGE_KEY = 'roadmap.votes.v1';

/** Parses a raw storage value into a set of voted item ids. Invalid input yields an empty set. */
export function parseVotedIds(raw: string | null): Set<string> {
  if (!raw) {
    return new Set();
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((value): value is string => typeof value === 'string'));
  } catch {
    return new Set();
  }
}

/** Serializes voted item ids for storage. */
export function serializeVotedIds(votedIds: ReadonlySet<string>): string {
  return JSON.stringify([...votedIds]);
}

/** Returns a new set with the vote for `itemId` added, or removed if already present. */
export function toggleVote(votedIds: ReadonlySet<string>, itemId: string): Set<string> {
  const next = new Set(votedIds);
  if (next.has(itemId)) {
    next.delete(itemId);
    return next;
  }
  next.add(itemId);
  return next;
}

/** Count shown on a card: the published baseline plus this device's vote. */
export function displayCount(baseVotes: number, voted: boolean): number {
  return voted ? baseVotes + 1 : baseVotes;
}

/** Returns localStorage when available; null in environments that block it. */
export function safeLocalStorage(): Storage | null {
  try {
    const storage = window.localStorage;
    const probe = '__roadmap_probe__';
    storage.setItem(probe, probe);
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

/** Reads voted ids from storage; an unavailable storage reads as no votes. */
export function readVotedIds(storage: Storage | null): Set<string> {
  if (!storage) {
    return new Set();
  }
  try {
    return parseVotedIds(storage.getItem(VOTES_STORAGE_KEY));
  } catch {
    return new Set();
  }
}

/** Persists voted ids; silently no-ops when storage is unavailable. */
export function writeVotedIds(storage: Storage | null, votedIds: ReadonlySet<string>): void {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(VOTES_STORAGE_KEY, serializeVotedIds(votedIds));
  } catch {
    // Storage may be full or blocked; the vote still applies for this page view.
  }
}
