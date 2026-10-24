import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the production build (run `npm run build` first), served the way GitHub Pages
 * serves it. The service worker is blocked so request mocking (e.g. the contact form) always applies.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4317',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    // CI installs Playwright's Chromium; locally the installed Chrome is used
    channel: process.env.CI ? undefined : 'chrome',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4317',
    // always start our own server: reusing one could silently test a different app on the same port
    reuseExistingServer: false,
  },
});
