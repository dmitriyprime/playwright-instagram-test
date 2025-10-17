import { defineConfig, devices } from '@playwright/test';

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
    ['html'], // Built-in HTML report
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
    ['github'],
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
    // Track A: Instagram Web Tests
    {
      name: 'track-a-instagram',
      testMatch: '**/instagram-*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.instagram.com',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
      retries: process.env.CI ? 0 : 1, // No retries in CI to avoid rate limiting
    },
    // Track B: Mock Social App Tests
    {
      name: 'track-b-mock',
      testMatch: '**/mock-*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // No baseURL - mock tests will use data URIs and mock routes
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
    },
  ],
  globalSetup: require.resolve('./tests/global-setup.ts'),
});
