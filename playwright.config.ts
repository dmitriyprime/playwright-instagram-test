import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Load environment variables
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false, // Changed to false for Instagram tests to avoid rate limiting
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1, // Single worker to avoid rate limiting
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://www.instagram.com',
    /* Collect trace when retaining on failure. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    /* Take screenshot only on failure */
    screenshot: 'only-on-failure',
    /* Record video only on failure */
    video: 'retain-on-failure',
    /* Run tests in headed mode locally, headless on CI */
    headless: process.env.CI ? true : false,
    /* Browser viewport */
    viewport: { width: 1280, height: 720 },
    /* Increase timeouts for Instagram's slow loading */
    actionTimeout: 30000,
    navigationTimeout: 60000,
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },
  timeout: 120000, // Increased timeout for Instagram's slow loading
  expect: {
    timeout: 10000,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Standard Chrome configuration
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
    },
  ],
  globalSetup: require.resolve('./tests/global-setup.ts'),
});
