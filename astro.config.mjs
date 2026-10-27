import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://muntaha15.github.io',
  // For a project repository, set PUBLIC_BASE_PATH=/repository-name/ at build time.
  base: process.env.PUBLIC_BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  // Remove a section from this list when its first entry is published.
  integrations: [sitemap({ filter: (page) => !['/404/', '/writing/', '/notes/'].some(route => page.endsWith(route)) })],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
