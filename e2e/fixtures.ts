import { test as base, expect } from '@playwright/test';

/** Every test runs without external fonts (keeps runs fast and deterministic) */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
    await use(page);
  },
});

export { expect };
