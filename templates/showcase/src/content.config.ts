import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      discipline: z.string(),
      year: z.number(),
      number: z.string(),
      excerpt: z.string(),
      cover: image(),
      coverAlt: z.string(),
      featured: z.boolean().default(false),
      orientation: z.enum(['landscape', 'portrait', 'square']),
      client: z.string(),
    }),
});

export const collections = { projects };
