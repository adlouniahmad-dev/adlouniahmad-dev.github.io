// Serves the production build the way GitHub Pages does: folder index.html, 404.html (status 404)
// for unknown paths, and gzip for text files. Used by the end-to-end tests.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = 'dist/adlouniahmad-portfolio/browser';
const PORT = Number(process.env.PORT ?? 4317);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
};

createServer((req, res) => {
  let path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(normalize(ROOT))) path = join(ROOT, '404.html');
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  let status = 200;
  if (!existsSync(path)) { path = join(ROOT, '404.html'); status = 404; }

  let body = readFileSync(path);
  const type = TYPES[extname(path)] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type };
  if (/text|javascript|json|xml|svg|manifest/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers).end(body);
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
