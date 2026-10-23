import { test, expect } from './fixtures';

const FORMINIT = /forminit\.com\/f\//;

test('the contact form validates before sending', async ({ page }) => {
  let sent = 0;
  await page.route(FORMINIT, route => { sent++; return route.fulfill({ json: { success: true } }); });
  await page.goto('/#contact');
  await page.locator('#contact .submit').click();
  await expect(page.locator('#contact .error')).toHaveCount(3);
  await page.fill('#contact-email', 'not-an-email');
  await expect(page.locator('#contact-email-error')).toBeVisible();
  expect(sent).toBe(0);
});

test('the contact form sends Forminit fields and shows success', async ({ page }) => {
  let body = '';
  await page.route(FORMINIT, route => {
    body = route.request().postData() ?? '';
    return route.fulfill({ json: { success: true } });
  });
  await page.goto('/#contact');
  await page.fill('#contact-name', 'Test Person');
  await page.fill('#contact-email', 'test@example.com');
  await page.fill('#contact-message', 'Hello, this is an automated test.');
  await page.locator('#contact .submit').click();
  await expect(page.locator('#contact .success-title')).toBeVisible();
  for (const field of ['fi-sender-fullName', 'fi-sender-email', 'fi-text-message', '_gotcha'])
    expect(body).toContain(`name="${field}"`);
});

test('the contact form explains the rate limit', async ({ page }) => {
  await page.route(FORMINIT, route => route.fulfill({ status: 429, json: { success: false } }));
  await page.goto('/#contact');
  await page.fill('#contact-name', 'Test Person');
  await page.fill('#contact-email', 'test@example.com');
  await page.fill('#contact-message', 'Hello, this is an automated test.');
  await page.locator('#contact .submit').click();
  await expect(page.locator('#contact .failure')).toContainText('once every few seconds');
});
