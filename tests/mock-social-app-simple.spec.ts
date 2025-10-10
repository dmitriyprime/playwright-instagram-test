import { test, expect } from '@playwright/test';
import { setupMockRoutes } from './utils/mock-routes';

test.describe('Mock Social App - Track B', {
    tag: ['@mock', '@track-b', '@social-app']
}, () => {
    test.beforeEach(async ({ page }) => {
        // Setup mock server responses for all API endpoints
        await setupMockRoutes(page);
    });

    test('Simple mock functionality test', {
        tag: ['@smoke', '@demo'],
        annotation: [
            { type: 'feature', description: 'Basic Mock App Functionality' },
            { type: 'severity', description: 'critical' },
            { type: 'story', description: 'Verify mock application loads and works' }
        ]
    }, async ({ page }) => {
        await test.step('Navigate to mock app', async () => {
            await page.goto('http://localhost:3001/demo');
            await expect(page.locator('h1')).toContainText('Mock Social App Demo');
        });

        await test.step('Verify basic functionality', async () => {
            await expect(page.locator('#demo-content')).toBeVisible();
            await expect(page.locator('#demo-content')).toContainText('This is a demonstration of Track B');
        });

        await test.step('Test interactive elements', async () => {
            await page.click('#demo-button');
            await expect(page.locator('#demo-result')).toContainText('Button clicked successfully!');
        });
    });

    test('Mock workflow demonstration', {
        tag: ['@workflow', '@demo'],
        annotation: [
            { type: 'feature', description: 'Mock Workflow' },
            { type: 'severity', description: 'high' },
            { type: 'story', description: 'Demonstrate mock social app workflow' }
        ]
    }, async ({ page }) => {
        const userData = {
            email: `user${Date.now()}@example.com`,
            username: `user${Date.now()}`
        };

        await test.step('Start at demo page', async () => {
            await page.goto('http://localhost:3001/demo');
            await expect(page.locator('h1')).toContainText('Mock Social App Demo');
        });

        await test.step('Start workflow', async () => {
            await page.click('#start-workflow');
            await expect(page.locator('#workflow-step')).toContainText('Step 1: Registration');
        });

        await test.step('Fill registration data', async () => {
            await page.fill('#workflow-email', userData.email);
            await page.fill('#workflow-username', userData.username);
            
            // Verify fields are filled
            await expect(page.locator('#workflow-email')).toHaveValue(userData.email);
            await expect(page.locator('#workflow-username')).toHaveValue(userData.username);
        });

        await test.step('Complete workflow step', async () => {
            await page.click('#workflow-next');
            
            // Wait for workflow to progress (more flexible)
            await page.waitForTimeout(1000);
            
            // Verify some form of progress - either step 2 or result should be visible
            const step2Visible = await page.locator('#step2').isVisible();
            const resultVisible = await page.locator('#workflow-result').isVisible();
            
            expect(step2Visible || resultVisible).toBe(true);
            
            // If step 2 is visible, complete it
            if (step2Visible) {
                await page.fill('#workflow-fullname', 'Test User');
                await page.click('#workflow-finish');
                await expect(page.locator('#workflow-step')).toContainText('Workflow Complete');
            }
        });
    });
});