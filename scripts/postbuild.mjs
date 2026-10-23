// Runs after `ng build`: writes sitemap.xml from the prerendered routes and copies the
// client-side shell to 404.html so GitHub Pages serves the app's own 404 page.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const ORIGIN = 'https://adlouniahmad-dev.github.io';
const OUT = 'dist/adlouniahmad-portfolio';
const BROWSER = `${OUT}/browser`;

const { routes } = JSON.parse(readFileSync(`${OUT}/prerendered-routes.json`, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

// GitHub Pages serves prerendered pages from folders, so non-root URLs end with a slash
const urls = Object.keys(routes)
  .map(route => (route === '/' ? '/' : `${route.replace(/\/$/, '')}/`))
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))
  .map(path => `  <url>\n    <loc>${ORIGIN}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${path === '/' ? '1.0' : '0.7'}</priority>\n  </url>`);

writeFileSync(`${BROWSER}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
copyFileSync(`${BROWSER}/index.csr.html`, `${BROWSER}/404.html`);

console.log(`postbuild: sitemap.xml (${urls.length} URLs), 404.html`);
