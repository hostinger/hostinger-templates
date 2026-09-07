import type { LoadedPost, PostFrontmatter, PostListEntry } from '../types/content';
import { postPath } from '../utils/paths';
import { readingTimeFromMarkdown } from '../utils/readingTime';
import { resolveSeriesNav, type SeriesPost } from '../utils/series';
import { parseFrontmatterBlock } from './frontmatter';
import { excerptFromMarkdown, renderMarkdown } from './markdown';

const sources = import.meta.glob('../../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(data: Record<string, unknown>): PostFrontmatter {
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return {
    title: typeof data.title === 'string' ? data.title : 'Untitled',
    date:
      typeof data.date === 'string'
        ? data.date
        : data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : '',
    author: typeof data.author === 'string' ? data.author : '',
    tags,
    series: typeof data.series === 'string' ? data.series : null,
    part: typeof data.part === 'number' ? data.part : null,
  };
}

function loadAllPosts(): LoadedPost[] {
  return Object.entries(sources).map(([path, raw]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path;
    const parsed = parseFrontmatterBlock(raw);
    const frontmatter = parseFrontmatter(parsed.data);
    const stats = readingTimeFromMarkdown(parsed.content);

    return {
      id: slug,
      excerpt: excerptFromMarkdown(parsed.content),
      html: renderMarkdown(parsed.content),
      fields: {
        slug,
        readingMinutes: stats.minutes,
        words: stats.words,
      },
      frontmatter,
    };
  });
}

const posts = loadAllPosts();

function toSeriesPost(post: LoadedPost): SeriesPost {
  return {
    path: postPath(post.fields.slug),
    title: post.frontmatter.title,
    series: post.frontmatter.series,
    part: post.frontmatter.part,
  };
}

const seriesPosts = posts.map(toSeriesPost);

export function listPosts(): PostListEntry[] {
  return [...posts].sort((left, right) =>
    right.frontmatter.date.localeCompare(left.frontmatter.date),
  );
}

export function getPost(slug: string): LoadedPost | undefined {
  return posts.find((post) => post.fields.slug === slug);
}

export function seriesNavFor(slug: string) {
  return resolveSeriesNav(seriesPosts, postPath(slug));
}

export function postSlugs(): string[] {
  return posts.map((post) => post.fields.slug);
}
