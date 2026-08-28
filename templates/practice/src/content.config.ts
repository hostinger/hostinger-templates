import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    description: z.string(),
    duration: z.string(),
    bestFor: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    order: z.number(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

export const collections = { services };
