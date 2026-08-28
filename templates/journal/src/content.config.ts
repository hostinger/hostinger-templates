import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    number: z.number().int().positive(),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    marginalia: z.string(),
  }),
});

export const collections = { posts };
