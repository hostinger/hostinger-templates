import type { CollectionEntry } from 'astro:content';

import type { Tag } from './filter';

export type ChangelogEntry = CollectionEntry<'changelog'>;

/** Returns the entries ordered newest first. */
export function sortByDateDesc(entries: ChangelogEntry[]): ChangelogEntry[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Route for a single release page. */
export function releasePath(entry: ChangelogEntry): string {
  return `/releases/${entry.id}/`;
}

/** How many entries carry the given tag. */
export function countByTag(entries: ChangelogEntry[], tag: Tag): number {
  return entries.filter((entry) => entry.data.tags.includes(tag)).length;
}
