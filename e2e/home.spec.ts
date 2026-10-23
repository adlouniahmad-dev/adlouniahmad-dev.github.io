import { test, expect } from './fixtures';

test('home page renders the hero and every section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Ahmad Adlouni');
  for (const id of ['about', 'experience', 'projects', 'contact'])
    await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page).toHaveTitle('Ahmad Adlouni - Senior Software Engineer');
});

test('the menu highlights the section in view', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#menu a.active')).toHaveAttribute('href', '#about');
  await page.locator('#menu a[href="#experience"]').click();
  await expect(page.locator('#menu a.active')).toHaveAttribute('href', '#experience');
});

test('refreshing at a section lands on it', async ({ page }) => {
  await page.goto('/#experience');
  await page.reload();
  await page.waitForLoadState('load');
  await expect.poll(async () => Math.round(await page.locator('#experience').evaluate(e => e.getBoundingClientRect().top)))
    .toBeLessThan(80);
});

test('on phones a top bar replaces the sidebar menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const bar = page.locator('.mobile-bar');
  await expect(bar).toBeVisible();
  await bar.locator('a[href="#projects"]').click();
  await expect(bar.locator('a.active')).toHaveAttribute('href', '#projects');
  // nothing overflows the bar
  expect(await bar.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
});

test('the theme toggle switches and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.locator('adl-footer .control.theme').click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('the theme is dark by default, even when the system prefers light', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
