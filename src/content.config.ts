import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One markdown file per project in src/content/work/. The home page lists them by `order`.
// A file with text below its frontmatter also gets a case-study page at /work/<file name>/.
// Text fields may use **bold**; nothing else is converted.
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    status: z.string(),
    period: z.string(),
    periodNote: z.string().optional(),
    numbers: z.string(),
    khmer: z.boolean().default(false),
    summary: z.string(),
    highlights: z.array(z.object({ lead: z.string(), text: z.string() })),
    hardest: z.string().optional(),
    tech: z.array(z.string()),
    // Optional, for the case-study page only. The home page always shows `tech`.
    caseTech: z.array(z.string()).optional(),
  }),
});

export const collections = { work };
