import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json'};
createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root) || !['.html','.css','.js','.webp','.woff2','.xml','.txt','.json'].includes(path.extname(file)) || pathname.startsWith('/tools/') || pathname.startsWith('/docs/')) {res.writeHead(403);res.end('Forbidden');return;}
    if (!(await stat(file)).isFile()) throw new Error('not found');
    res.writeHead(200, {'Content-Type':types[path.extname(file)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(await readFile(file));
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Dhi’s Clock preview: http://localhost:${port}`));
