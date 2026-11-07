import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const root = process.argv.includes('--dist') ? path.join(projectRoot, 'dist') : projectRoot;
const pages = ['index.html', 'about.html'];
const htmlPages = [...pages, '404.html', 'error.html'];
const fail = [];
const read = async (file) => readFile(path.join(root, file), 'utf8');
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];

for (const page of htmlPages) {
  let html;
  try { html = await read(page); } catch { fail.push(`${page} is missing`); continue; }
  if (pages.includes(page)) {
    const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
    if (!canonical || attr(canonical, 'href') !== `https://www.dhisclock.com/${page === 'index.html' ? '' : page}`) fail.push(`${page}: incorrect or missing canonical URL`);
    for (const name of ['description', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:card']) {
      if (!new RegExp(`<meta\\b[^>]*\\b(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(html)) fail.push(`${page}: missing ${name} metadata`);
    }
    if (!/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i.test(html)) fail.push(`${page}: missing JSON-LD structured data`);
  }
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    if (attr(tag, 'alt') === undefined) fail.push(`${page}: img missing alt text (${attr(tag, 'src') || 'unknown source'})`);
  }
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
  const refs = [...html.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(ref)) {
      if (ref.startsWith('#') && ref.length > 1 && !ids.has(decodeURIComponent(ref.slice(1)))) fail.push(`${page}: missing fragment target ${ref}`);
      continue;
    }
    const [pathPart, fragment] = ref.split('#', 2);
    if (!pathPart) { if (fragment && !ids.has(decodeURIComponent(fragment))) fail.push(`${page}: missing fragment target #${fragment}`); continue; }
    const decodedPath = decodeURIComponent(pathPart.split('?')[0]);
    const normalizedPath = decodedPath === '/' ? '/index.html' : decodedPath.endsWith('/') ? `${decodedPath}index.html` : decodedPath;
    const target = path.resolve(root, normalizedPath.startsWith('/') ? `.${normalizedPath}` : path.join(path.dirname(page), normalizedPath));
    if (!target.startsWith(path.resolve(root) + path.sep)) { fail.push(`${page}: unsafe local URL ${ref}`); continue; }
    try { await access(target); } catch { fail.push(`${page}: missing local target ${ref}`); }
    if (fragment && path.basename(target).endsWith('.html')) {
      try {
        const targetHtml = target === path.join(root, page) ? html : await readFile(target, 'utf8');
        const targetIds = new Set([...targetHtml.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
        if (!targetIds.has(decodeURIComponent(fragment))) fail.push(`${page}: missing fragment target ${ref}`);
      } catch { /* Missing file reported above. */ }
    }
  }
  if (pages.includes(page)) {
    for (const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(block[1]); } catch { fail.push(`${page}: malformed JSON-LD`); }
    }
  }
}

let sitemap = '';
try { sitemap = await read('sitemap.xml'); } catch { fail.push('sitemap.xml is missing'); }
for (const url of ['https://www.dhisclock.com/', 'https://www.dhisclock.com/about.html']) if (!sitemap.includes(`<loc>${url}</loc>`)) fail.push(`sitemap.xml is missing ${url}`);
try {
  const manifest = JSON.parse(await read('site.webmanifest'));
  if (!manifest.name || !Array.isArray(manifest.icons)) fail.push('site.webmanifest needs a name and icons array');
  for (const icon of manifest.icons || []) {
    if (!icon.src || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(icon.src)) continue;
    const iconPath = decodeURIComponent(icon.src.split(/[?#]/, 1)[0]);
    const target = path.resolve(root, iconPath.startsWith('/') ? `.${iconPath}` : iconPath);
    if (!target.startsWith(path.resolve(root) + path.sep)) fail.push(`site.webmanifest: unsafe icon path ${icon.src}`);
    else try { await access(target); } catch { fail.push(`site.webmanifest: missing icon ${icon.src}`); }
  }
} catch { fail.push('site.webmanifest is missing or invalid JSON'); }

if (fail.length) {
  console.error(`Site check failed (${fail.length} issue${fail.length === 1 ? '' : 's'}):\n- ${fail.join('\n- ')}`);
  process.exitCode = 1;
} else console.log('Site check passed: pages, metadata, structured data, local links, image alt text, sitemap, and manifest.');
