import { createReadStream } from 'node:fs';
import { access, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const distRoot = path.join(projectRoot, 'dist');
let root = projectRoot;
if (process.env.NODE_ENV === 'production') {
  try { await access(distRoot); root = distRoot; }
  catch { console.error('dist/ is missing. Run npm run build first.'); process.exit(1); }
}
const port = Number(process.env.PORT || 4173);
const isProduction = root === distRoot;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};
const allowed = new Set(Object.keys(types));
const publicPages = new Set([
  '/index.html', '/about.html', '/404.html', '/error.html',
  '/tokens.css', '/base.css', '/styles.css', '/app.js',
  '/site.webmanifest', '/robots.txt', '/sitemap.xml', '/llms.txt',
]);
const assetsRoot = path.resolve(root, 'assets');

createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method || '')) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/about') pathname = '/about.html';
    if (pathname.endsWith('/')) pathname += 'index.html';
    const assetRequest = pathname.startsWith('/assets/');
    if (!publicPages.has(pathname) && !assetRequest) throw Object.assign(new Error('Not found'), { status: 404 });
    const file = path.resolve(root, `.${pathname}`);
    const insidePublicRoot = file.startsWith(path.resolve(root) + path.sep);
    const insideAssets = file.startsWith(assetsRoot + path.sep);
    if (!insidePublicRoot || (assetRequest && !insideAssets) || !allowed.has(path.extname(file).toLowerCase())) {
      throw Object.assign(new Error('Not found'), { status: 404 });
    }
    const info = await stat(file);
    if (!info.isFile()) throw Object.assign(new Error('Not found'), { status: 404 });
    if (assetRequest && !(await realpath(file)).startsWith(`${await realpath(assetsRoot)}${path.sep}`)) {
      throw Object.assign(new Error('Not found'), { status: 404 });
    }
    const headers = {
      'Content-Type': types[path.extname(file).toLowerCase()],
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': !isProduction
        ? 'no-store'
        : /\.(?:html|css|js|xml|txt|json)$/.test(file) ? 'no-cache' : 'public, max-age=86400',
      'Accept-Ranges': 'bytes',
    };
    if (req.method === 'HEAD') { res.writeHead(200, headers).end(); return; }
    const range = req.headers.range;
    if (range && path.extname(file).toLowerCase() === '.mp4') {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      let start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
      let end = match[2] && match[1] ? Number(match[2]) : info.size - 1;
      if (start > end || end >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      headers['Content-Length'] = end - start + 1;
      res.writeHead(206, headers);
      createReadStream(file, { start, end }).pipe(res);
      return;
    }
    headers['Content-Length'] = info.size;
    res.writeHead(200, headers);
    createReadStream(file).pipe(res);
  } catch (error) {
    if (res.headersSent) { res.destroy(); return; }
    const code = error.status || (error instanceof URIError ? 400 : 404);
    const errorPath = path.join(root, code === 404 ? '404.html' : 'error.html');
    try {
      const info = await stat(errorPath);
      res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Content-Length': info.size });
      if (req.method === 'HEAD') res.end(); else createReadStream(errorPath).pipe(res);
    } catch {
      res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' }).end(code === 404 ? 'Page not found' : 'Bad request');
    }
  }
}).listen(port, '127.0.0.1', () => console.log(`Dhi’s Clock preview: http://localhost:${port}`));
