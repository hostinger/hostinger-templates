import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

import rawSite from '../data/site.json';
import type { SiteContent } from '../types/content';
import { releasePath, sortByDateDesc } from '../utils/changelog';
import { TAG_LABELS } from '../utils/filter';

const site = rawSite as SiteContent;

export async function GET(context: APIContext) {
  const entries = sortByDateDesc(await getCollection('changelog'));

  return rss({
    title: `${site.name} changelog`,
    description: site.tagline,
    site: context.site ?? 'https://example.com',
    items: entries.map((entry) => ({
      title: `${site.name} v${entry.data.version} — ${entry.data.title}`,
      pubDate: entry.data.date,
      link: releasePath(entry),
      description: entry.data.tags.map((tag) => TAG_LABELS[tag]).join(' · '),
    })),
  });
}
