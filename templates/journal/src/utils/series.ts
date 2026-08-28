import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export const getSeriesNeighbors = (current: Post, posts: Post[]) => {
  if (!current.data.series || !current.data.seriesOrder) {
    return { previous: undefined, next: undefined };
  }

  const seriesPosts = posts
    .filter((post) => post.data.series === current.data.series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
  const index = seriesPosts.findIndex((post) => post.id === current.id);

  return {
    previous: seriesPosts[index - 1],
    next: seriesPosts[index + 1],
  };
};
