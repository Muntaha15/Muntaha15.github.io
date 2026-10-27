import { getCollection, type CollectionEntry } from 'astro:content';

export type PublicEntry = CollectionEntry<'projects' | 'writing' | 'notes'>;

/** Prefix a site-relative path once, including GitHub project-site deployments. */
export function withBase(path: string = '/') {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = `/${path.replace(/^\/+/, '')}`;
  if (base && (normalized === base || normalized.startsWith(`${base}/`))) return normalized;
  return `${base}${normalized}`;
}

export function urlFor(entry: Pick<PublicEntry, 'collection' | 'id'>) {
  const id = entry.id.replace(/\.(md|mdx)$/, '').split('/').map(encodeURIComponent).join('/');
  return withBase(`/${entry.collection}/${id}/`);
}

export async function getPublicProjects() {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getPublicWriting() {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

export async function getPublicNotes() {
  const entries = await getCollection('notes', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

export async function getAllPublicContent(): Promise<PublicEntry[]> {
  return (await Promise.all([getPublicProjects(), getPublicWriting(), getPublicNotes()])).flat();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function readingTime(body: string | undefined) {
  const words = (body ?? '').replace(/```[\s\S]*?```/g, '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function slugifyTag(tag: string) {
  return tag.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
