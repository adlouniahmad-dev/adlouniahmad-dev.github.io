import { test, expect } from './fixtures';

test('featured projects are in progress and show no images', async ({ page }) => {
  await page.goto('/#projects');
  const cards = page.locator('.featured adl-product-item');
  await expect(cards).toHaveCount(2);
  await expect(cards.locator('.status')).toHaveCount(2);
  await expect(cards.locator('img')).toHaveCount(0);
});

test('early work expands, filters, and stays open after visiting a project', async ({ page }) => {
  await page.goto('/#projects');
  const early = page.locator('details.early');
  await early.locator('summary').click();
  await expect(page.locator('.early-item')).toHaveCount(9);
  await page.getByRole('button', { name: /Mobile/ }).click();
  await expect(page.locator('.early-item')).toHaveCount(4);
  await page.getByRole('button', { name: /All/ }).click();

  await page.locator('.early-item[href="/projects/ask"]').click();
  await expect(page.locator('h1')).toHaveText('ASK - Agile Share Knowledge');
  await page.goBack();
  await expect(early).toHaveAttribute('open', '');
});

test('a project page shows its details, screenshots and neighbours', async ({ page }) => {
  await page.goto('/projects/ask/');
  await expect(page).toHaveTitle('ASK - Agile Share Knowledge — Ahmad Adlouni');
  await expect(page.locator('.badge', { hasText: 'Early work' })).toBeVisible();
  await expect(page.locator('.lesson')).toContainText('232 commits');

  await page.locator('.shot').first().click();
  const viewer = page.locator('dialog.lightbox');
  await expect(viewer).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(viewer.locator('.counter')).toHaveText('2 / 4');
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();

  await page.locator('.pager-link.next').click();
  await expect(page).toHaveURL(/\/projects\/leb-phones$/);
});

test('old /portfolio URLs redirect and unknown projects show the 404 page', async ({ page }) => {
  await page.goto('/portfolio/ask');
  await expect(page).toHaveURL(/\/projects\/ask$/);
  await page.goto('/projects/does-not-exist');
  await expect(page.locator('._404')).toBeVisible();
});
