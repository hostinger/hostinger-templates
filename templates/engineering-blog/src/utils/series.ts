export type SeriesPost = {
  path: string;
  title: string;
  series: string | null;
  part: number | null;
};

export type SeriesLink = {
  path: string;
  title: string;
  part: number;
};

export type SeriesNavigation = {
  series: string;
  part: number;
  totalParts: number;
  previous: SeriesLink | null;
  next: SeriesLink | null;
};

/** All posts belonging to a series, ordered by part number. */
export function seriesMembers(
  posts: SeriesPost[],
  series: string,
): SeriesPost[] {
  return posts
    .filter((post) => post.series === series && post.part !== null)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
}

/** Previous/next links within the current post's series, or null when the post is not part of one. */
export function resolveSeriesNav(
  posts: SeriesPost[],
  currentPath: string,
): SeriesNavigation | null {
  const current = posts.find((post) => post.path === currentPath);
  if (!current?.series || current.part === null) return null;

  const members = seriesMembers(posts, current.series);
  const index = members.findIndex((post) => post.path === currentPath);
  if (index === -1) return null;

  return {
    series: current.series,
    part: current.part,
    totalParts: members.length,
    previous: toSeriesLink(members[index - 1]),
    next: toSeriesLink(members[index + 1]),
  };
}

export function seriesPartLabel(part: number, totalParts: number): string {
  return `Part ${part} of ${totalParts}`;
}

/** Number of parts per series name, for part labels in post lists. */
export function countSeriesParts(posts: SeriesPost[]): Map<string, number> {
  const totals = new Map<string, number>();
  posts.forEach((post) => {
    if (!post.series || post.part === null) return;
    totals.set(post.series, (totals.get(post.series) ?? 0) + 1);
  });
  return totals;
}

function toSeriesLink(post: SeriesPost | undefined): SeriesLink | null {
  if (!post || post.part === null) return null;
  return { path: post.path, title: post.title, part: post.part };
}
