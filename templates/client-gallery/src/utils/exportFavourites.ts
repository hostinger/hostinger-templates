import type { AlbumContent } from '../types/content';

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function exportFileName(albumId: string): string {
  return `${albumId}-favourites.csv`;
}

/**
 * Build the CSV the client sends back: one row per favourited photograph,
 * kept in album order so the photographer can scan it top to bottom.
 */
export function buildFavouritesCsv(album: AlbumContent, favourites: string[]): string {
  const favouriteSet = new Set(favourites);
  const header = ['photo', 'filename', 'caption'];

  const rows = album.photos
    .map((photo, index) => ({ photo, number: String(index + 1).padStart(2, '0') }))
    .filter(({ photo }) => favouriteSet.has(photo.filename))
    .map(({ photo, number }) => [number, photo.filename, photo.caption ?? photo.alt]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\r\n')
    .concat('\r\n');
}

/** Client-side download via a Blob object URL — no server involved. */
export function downloadFavouritesList(album: AlbumContent, favourites: string[]): void {
  if (typeof document === 'undefined' || favourites.length === 0) return;

  const csv = buildFavouritesCsv(album, favourites);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = exportFileName(album.id);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
