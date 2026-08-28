export type Tag = 'feature' | 'fix' | 'improvement';

export type TagFilter = 'all' | 'feature' | 'fix';

export const TAG_LABELS: Record<Tag, string> = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
};

export const FILTER_LABELS: Record<TagFilter, string> = {
  all: 'All releases',
  feature: 'Features',
  fix: 'Fixes',
};

export const FILTER_ORDER: TagFilter[] = ['all', 'feature', 'fix'];

/** Narrows an arbitrary attribute value to a known filter. */
export function parseTagFilter(value: string | undefined): TagFilter | null {
  return value === 'all' || value === 'feature' || value === 'fix' ? value : null;
}

/** Parses a comma-separated `data-tags` attribute into known tags. */
export function parseTagList(value: string | undefined): Tag[] {
  return (value ?? '')
    .split(',')
    .filter((item): item is Tag => item === 'feature' || item === 'fix' || item === 'improvement');
}

/** Whether an entry with the given tags stays visible under a filter. */
export function matchesFilter(tags: readonly string[], filter: TagFilter): boolean {
  return filter === 'all' || tags.includes(filter);
}

/** Status line shown next to the filter chips. */
export function describeFilterResult(filter: TagFilter, visible: number, total: number): string {
  if (filter === 'all') {
    return `Showing all ${total} releases`;
  }
  const noun = visible === 1 ? 'release' : 'releases';
  return `Showing ${visible} ${noun} of ${total} · ${FILTER_LABELS[filter]}`;
}
