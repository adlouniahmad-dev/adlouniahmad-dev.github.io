import { test, expect } from './fixtures';

test('the Arabic home page is right-to-left and translated', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('h1')).toHaveText('أحمد عدلوني');
  await expect(page).toHaveTitle('أحمد عدلوني - مهندس برمجيات أول');
});

test('the language switch keeps you on the same page', async ({ page }) => {
  await page.goto('/projects/form-studio/');
  await page.locator('.top-bar .control.lang').click();
  await expect(page).toHaveURL(/\/ar\/projects\/form-studio$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('.top-bar .control.lang').click();
  await expect(page).toHaveURL(/\/projects\/form-studio$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('prerendered pages link to their other-language version', async ({ request }) => {
  const html = await (await request.get('/projects/ask/')).text();
  expect(html).toContain('<html lang="en" dir="ltr"');
  expect(html).toContain('hreflang="ar" href="https://adlouniahmad-dev.github.io/ar/projects/ask/"');
  const ar = await (await request.get('/ar/projects/ask/')).text();
  expect(ar).toContain('<html lang="ar" dir="rtl"');
  expect(ar).toContain('<link rel="canonical" href="https://adlouniahmad-dev.github.io/ar/projects/ask/">');
});
