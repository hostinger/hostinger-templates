import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    version: z.string(),
    tags: z.array(z.enum(['feature', 'fix', 'improvement'])).nonempty(),
  }),
});

export const collections = { changelog };
