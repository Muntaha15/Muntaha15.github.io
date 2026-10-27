import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { load } from 'cheerio';

// Check the real deployment artifact, not a development server. No network requests.
const root = path.resolve(process.argv[2] || 'dist');
const failures = new Set();
const documents = new Map();
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  }))).flat();
}
async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}
function fail(message) { failures.add(message); }
const required = ['index.html', 'projects/index.html', 'writing/index.html', 'notes/index.html', 'about/index.html', 'search/index.html', 'tags/index.html', '404.html', 'feed.xml', 'notes/feed.xml', 'sitemap-index.xml', 'Muntaha_Kamal_Resume.pdf', 'resume.pdf', 'pagefind/pagefind.js'];
for (const file of required) if (!(await exists(path.join(root, file)))) fail(`Missing required output: ${file}`);
if (!(await exists(path.join(root, 'index.html')))) {
  console.error('Run npm run build before npm run verify.');
  process.exit(1);
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) documents.set(file, load(await readFile(file, 'utf8')));
const home = documents.get(path.join(root, 'index.html'));
const canonical = home('link[rel="canonical"]').attr('href');
let site;
try {
  site = new URL(canonical);
  if (!['http:', 'https:'].includes(site.protocol)) throw new Error('Unsupported protocol');
} catch {
  fail('Homepage needs an absolute HTTP(S) canonical URL.');
  site = new URL('https://muntaha15.github.io/');
}
const base = site.pathname.replace(/\/$/, '');
function publicUrl(file) {
  const relative = path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, '');
  return new URL(`${base}/${relative}`, site.origin);
}
async function checkLink(raw, source, checkAnchor = true) {
  if (!raw || /^(mailto:|tel:|data:|blob:)/i.test(raw)) return;
  let target;
  try { target = new URL(raw, publicUrl(source)); } catch { fail(`Malformed URL in ${path.relative(root, source)}: ${raw}`); return; }
  if (!['http:', 'https:'].includes(target.protocol)) {
    fail(`Unexpected link protocol in ${path.relative(root, source)}: ${raw}`); return;
  }
  if (target.origin !== site.origin) return;
  let pathname;
  try { pathname = decodeURIComponent(target.pathname); } catch { fail(`Bad URL encoding: ${raw}`); return; }
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) {
    fail(`Internal link escapes site base in ${path.relative(root, source)}: ${raw}`); return;
  }
  const local = pathname.slice(base.length).replace(/^\//, '');
  const candidate = path.resolve(root, local);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) { fail(`Link escapes output directory: ${raw}`); return; }
  const possibilities = [candidate, path.join(candidate, 'index.html')];
  if (!path.extname(candidate)) possibilities.push(`${candidate}.html`);
  let resolved;
  for (const possibility of possibilities) if (await exists(possibility)) { resolved = possibility; break; }
  if (!resolved) { fail(`Broken local link in ${path.relative(root, source)}: ${raw}`); return; }
  if (checkAnchor && target.hash && documents.has(resolved)) {
    let anchor;
    try { anchor = decodeURIComponent(target.hash.slice(1)); } catch { fail(`Bad anchor encoding: ${raw}`); return; }
    if (!anchor || anchor.startsWith(':~:text=')) return;
    const document = documents.get(resolved);
    const found = document('[id], a[name]').toArray().some((el) => document(el).attr('id') === anchor || document(el).attr('name') === anchor);
    if (!found) fail(`Missing anchor in ${path.relative(root, source)}: ${raw}`);
  }
}
let checkedLinks = 0;
for (const [file, document] of documents) {
  const links = [];
  document('[href], [src], video[poster]').each((_, element) => {
    for (const attribute of ['href', 'src', 'poster']) {
      const value = document(element).attr(attribute);
      if (value) links.push(value);
    }
  });
  for (const link of links) { await checkLink(link, file); checkedLinks++; }
  if (!document('html').attr('lang')) fail(`Missing document language: ${path.relative(root, file)}`);
  if (document('h1').length !== 1) fail(`Expected one h1: ${path.relative(root, file)}`);
  if (!document('title').text().trim()) fail(`Missing title: ${path.relative(root, file)}`);
  document('img').each((_, element) => { if (document(element).attr('alt') === undefined) fail(`Image missing alt: ${path.relative(root, file)}`); });
  document('.tag-list').each((_, element) => {
    if (document(element).children().toArray().some((tag) => tag.tagName !== 'a')) fail(`Topic chips must link to their topic: ${path.relative(root, file)}`);
  });
  document('[data-copy-email]').each((_, element) => {
    const email = document(element).attr('data-copy-email');
    if (!document(element).parent().find('noscript').text().includes(email)) fail(`Missing readable email fallback: ${path.relative(root, file)}`);
  });
}
const sitemapUrls = new Set();
for (const file of files.filter((file) => file.endsWith('.xml'))) {
  const xml = load(await readFile(file, 'utf8'), { xmlMode: true });
  if (path.basename(file).startsWith('sitemap')) xml('loc').each((_, element) => sitemapUrls.add(xml(element).text()));
  const links = xml('loc, item > link, channel > link').toArray().map((element) => xml(element).text());
  for (const link of links) await checkLink(link, file);
}
for (const [section, feed] of [['writing', '/feed.xml'], ['notes', '/notes/feed.xml']]) {
  const indexFile = path.join(root, section, 'index.html');
  const index = documents.get(indexFile);
  const hasEntries = [...documents.keys()].some((file) => file.startsWith(`${path.join(root, section)}${path.sep}`) && file !== indexFile);
  if (!hasEntries) {
    if (index?.('meta[name="robots"]').attr('content') !== 'noindex') fail(`Empty ${section} index must be noindex.`);
    if (sitemapUrls.has(publicUrl(indexFile).href)) fail(`Empty ${section} index must be absent from the sitemap.`);
    for (const [file, document] of documents) {
      if (document(`a[href="${base}/${section}/"], [href="${base}${feed}"]`).length) fail(`Empty ${section} section is advertised in ${path.relative(root, file)}.`);
    }
  } else if (!sitemapUrls.has(publicUrl(indexFile).href)) fail(`Published ${section} index is missing from sitemap; remove its exclusion in astro.config.mjs.`);
}
const search = documents.get(path.join(root, 'search/index.html'));
if (!search?.(`#search-recovery a[href="${base}/tags/"]`).length) fail('Search failure must offer a topic link.');

// Source templates remain private to the build: detect their URLs and sentinel text
// across HTML, feeds, sitemap, assets and decompressed Pagefind fragments/metadata.
const forbidden = new Set(['DRAFT_ONLY_DO_NOT_PUBLISH']);
const sourceRoot = path.resolve('src/content');
for (const file of (await walk(sourceRoot)).filter((file) => /\.mdx?$/.test(file))) {
  const source = await readFile(file, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter || !/^draft:\s*true\s*(?:#.*)?$/m.test(frontmatter[1])) continue;
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/').replace(/\.mdx?$/, '');
  forbidden.add(`/${relative}/`);
  for (const marker of source.matchAll(/\bDRAFT_[A-Z0-9_]+\b/g)) forbidden.add(marker[0]);
  const output = path.join(root, relative, 'index.html');
  if (await exists(output)) fail(`Draft route was generated: ${relative}`);
}
for (const file of files) {
  let buffer = await readFile(file);
  if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
    try { buffer = gunzipSync(buffer); } catch { fail(`Invalid compressed output: ${path.relative(root, file)}`); }
  }
  const text = buffer.toString('utf8');
  for (const marker of forbidden) if (text.includes(marker)) fail(`Draft marker ${marker} leaked into ${path.relative(root, file)}`);
}
const resumePath = path.join(root, 'Muntaha_Kamal_Resume.pdf');
if (await exists(resumePath)) {
  const resume = await readFile(resumePath);
  if (resume.subarray(0, 5).toString() !== '%PDF-') fail('Muntaha_Kamal_Resume.pdf is not a PDF.');
  const legacyPath = path.join(root, 'resume.pdf');
  if (await exists(legacyPath) && !(await readFile(legacyPath)).equals(resume)) fail('resume.pdf must match Muntaha_Kamal_Resume.pdf so existing links stay current.');
}
if (failures.size) {
  console.error(`Build verification failed (${failures.size}):\n${[...failures].map((message) => `- ${message}`).join('\n')}`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML pages, internal targets among ${checkedLinks} URL references, feeds, sitemap, resume, search assets, and draft markers. External URLs were not fetched.`);
