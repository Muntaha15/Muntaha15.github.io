import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublicWriting, urlFor, withBase } from '../lib/content';

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('A site URL is required to generate the feed.');
  return rss({
    title: 'Muntaha Kamal — Writing',
    description: 'Articles on AI engineering, retrieval systems, and learning by building.',
    site: new URL(withBase('/'), context.site),
    items: (await getPublicWriting()).map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: new URL(urlFor(entry), context.site).href,
      categories: entry.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
