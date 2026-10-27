import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublicNotes, urlFor, withBase } from '../../lib/content';

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('A site URL is required to generate the feed.');
  return rss({
    title: 'Muntaha Kamal — Notes',
    description: 'Evolving notes on machine learning, papers, and engineering experiments.',
    site: new URL(withBase('/notes/'), context.site),
    items: (await getPublicNotes()).map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: new URL(urlFor(entry), context.site).href,
      categories: entry.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
