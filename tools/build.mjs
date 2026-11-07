import { mkdir, rm, stat, readFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const required = ['index.html', 'about.html', '404.html', 'error.html', 'tokens.css', 'base.css', 'styles.css', 'app.js', 'site.webmanifest', 'robots.txt', 'sitemap.xml'];
for (const file of required) {
  try { if (!(await stat(path.join(root, file))).isFile()) throw new Error(); }
  catch { throw new Error(`Required production file is missing: ${file}`); }
}

// Recreate only the project's known build output directory.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of required) await copyFile(path.join(root, file), path.join(out, file));
const sourceAssetRoot = path.resolve(root, 'assets');
const publicAssetExtensions = /\.(?:webp|woff2|svg|ico|jpe?g|png|mp4|json|txt)$/i;
const copiedAssets = new Set();

async function copyReferencedAsset(reference, sourceFile) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|data:)/i.test(reference)) return;
  const decoded = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const sourcePath = decoded.startsWith('/')
    ? path.resolve(root, `.${decoded}`)
    : decoded.startsWith('assets/')
      ? path.resolve(root, decoded)
      : path.resolve(root, path.dirname(sourceFile), decoded);
  if (!sourcePath.startsWith(sourceAssetRoot + path.sep) || !publicAssetExtensions.test(sourcePath)) return;
  const relative = path.relative(root, sourcePath);
  if (copiedAssets.has(relative)) return;
  try { if (!(await stat(sourcePath)).isFile()) return; }
  catch (error) { if (error.code === 'ENOENT') throw new Error(`${sourceFile} references missing asset ${reference}`); throw error; }
  const destination = path.join(out, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(sourcePath, destination);
  copiedAssets.add(relative);
}

for (const file of required.filter((name) => /\.(?:html|css)$/.test(name))) {
  const content = await readFile(path.join(root, file), 'utf8');
  for (const match of content.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/gi)) await copyReferencedAsset(match[1], file);
  if (file.endsWith('.css')) {
    for (const match of content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) await copyReferencedAsset(match[1].trim(), file);
  }
}

const siteManifest = JSON.parse(await readFile(path.join(root, 'site.webmanifest'), 'utf8'));
for (const icon of siteManifest.icons || []) await copyReferencedAsset(icon.src, 'site.webmanifest');
for (const license of ['assets/BodoniModa-LICENSE.txt', 'assets/Manrope-LICENSE.txt']) {
  await copyReferencedAsset(license, 'README.md');
}

const clientManifestPath = 'assets/client/manifest.json';
try {
  const clientManifest = JSON.parse(await readFile(path.join(root, clientManifestPath), 'utf8'));
  for (const entry of clientManifest) {
    for (const key of ['src', 'thumbnail', 'poster']) await copyReferencedAsset(entry[key], clientManifestPath);
  }
  const destination = path.join(out, clientManifestPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(root, clientManifestPath), destination);
  copiedAssets.add(clientManifestPath);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log(`Built ${out}`);
