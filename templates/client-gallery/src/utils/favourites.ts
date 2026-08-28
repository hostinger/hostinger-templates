const STORAGE_PREFIX = 'client-gallery:favourites:';

export function favouritesStorageKey(albumId: string): string {
  return `${STORAGE_PREFIX}${albumId}`;
}

/**
 * Read the favourites saved on this device for the given album.
 * Entries that no longer exist in the album are dropped so a re-edited
 * album never resurrects stale filenames.
 */
export function loadFavourites(albumId: string, validFilenames: string[]): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(favouritesStorageKey(albumId));
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const valid = new Set(validFilenames);
    return parsed.filter(
      (entry): entry is string => typeof entry === 'string' && valid.has(entry),
    );
  } catch {
    return [];
  }
}

export function saveFavourites(albumId: string, filenames: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      favouritesStorageKey(albumId),
      JSON.stringify(filenames),
    );
  } catch {
    // Storage can be unavailable (private browsing, full quota) — favourites
    // simply stop persisting across reloads in that case.
  }
}

export function toggleFavourite(favourites: string[], filename: string): string[] {
  if (favourites.includes(filename)) {
    return favourites.filter((entry) => entry !== filename);
  }

  return [...favourites, filename];
}
