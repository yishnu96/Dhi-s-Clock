import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://127.0.0.1:4174';
for (const route of ['/', '/about.html', '/robots.txt', '/sitemap.xml', '/site.webmanifest']) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  if (route.endsWith('webmanifest')) assert.match(response.headers.get('content-type'), /application\/manifest\+json/);
  console.log(`200 ${route}`);
}
for (const route of ['/missing-page', '/tools/render-pages.mjs', '/package.json', '/clients-images/private.jpg']) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 404, route);
  assert.match(await response.text(), /Time took a turn/);
  console.log(`404 ${route}`);
}
const range = await fetch(origin + '/assets/client/campaign-film.mp4', {headers:{Range:'bytes=0-1023'}});
assert.equal(range.status,206);
assert.equal((await range.arrayBuffer()).byteLength,1024);
assert.match(range.headers.get('content-range'), /^bytes 0-1023\//);
const manifest = await (await fetch(origin + '/site.webmanifest')).json();
for (const icon of manifest.icons) assert.equal((await fetch(origin+icon.src)).status,200);
console.log('Video range and manifest icon checks passed.');
