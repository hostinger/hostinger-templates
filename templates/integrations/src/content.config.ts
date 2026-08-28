import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const integrations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/integrations' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['Finance', 'Communication', 'Forms', 'Storage', 'CRM', 'Analytics', 'Support', 'Marketing']),
    icon: z.string(),
    accent: z.enum(['purple', 'mint', 'tangerine']),
    summary: z.string(),
    trigger: z.string(),
    action: z.string(),
    useCases: z.array(z.string()).min(2),
    setup: z.array(z.string()).min(3),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).min(2),
  }),
});

export const collections = { integrations };
