import { test, expect } from './fixtures';

test('robots.txt points to the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap: https://adlouniahmad-dev.github.io/sitemap.xml');
});

test('the sitemap lists every prerendered page in both languages', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  expect(urls).toContain('https://adlouniahmad-dev.github.io/');
  expect(urls).toContain('https://adlouniahmad-dev.github.io/ar/');
  expect(urls).toContain('https://adlouniahmad-dev.github.io/projects/noura-clinic/');
  expect(urls).toContain('https://adlouniahmad-dev.github.io/ar/projects/noura-clinic/');
  expect(urls.length % 2).toBe(0);
});

test('pages share the branded preview image', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('<meta property="og:image" content="https://adlouniahmad-dev.github.io/assets/og-image.png">');
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
});
