import { test as base, expect } from '@playwright/test';
import { InstagramRegistrationPage } from '../pages/instagram-registration.page';
import { TestDataGenerator, UserData } from '../data/test-data';

/**
 * Instagram Page Fixture
 * 
 * Usage:
 *   import { test, expect } from './fixtures/instagram.fixture';
 *   
 *   test('my test', async ({ instagramPage, testUser }) => {
 *     await instagramPage.navigate();
 *     await instagramPage.fillEmail(testUser.email);
 *   });
 */

type InstagramFixtures = {
  // Auto-initialized Instagram page object
  instagramPage: InstagramRegistrationPage;
  
  // Test user data - auto-generated with unique values
  testUser: UserData;
};

export const test = base.extend<InstagramFixtures>({
  /**
   * Instagram Registration Page
   * Automatically initialized and ready to use
   */
  instagramPage: async ({ page }, use) => {
    const instagramPage = new InstagramRegistrationPage(page);
    await use(instagramPage);
  },

  /**
   * Test User Data
   * Generates unique user data for each test
   * 
   * Returns:
   *   - email: 'test@example.com'
   *   - fullName: 'Test User'
   *   - username: 'testuser_<timestamp>_<random>'
   *   - password: 'TestPassword123!'
   */
  testUser: async ({}, use) => {
    const userData = TestDataGenerator.generateUniqueUserData();
    await use(userData);
  },
});

export { expect };
