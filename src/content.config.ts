import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({ ...common, featured: z.boolean().default(false), order: z.number().default(99), repo: z.url(), release: z.url().optional(), demo: z.url().optional(), kind: z.string() }),
});
const articleSchema = z.object({ ...common, maturity: z.enum(['Working note', 'Reviewed', 'Article']).default('Working note'), relatedProjects: z.array(z.string()).default([]) });
const writing = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/writing' }), schema: articleSchema });
const notes = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/notes' }), schema: articleSchema });
export const collections = { projects, writing, notes };
