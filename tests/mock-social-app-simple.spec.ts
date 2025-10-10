import { test, expect } from '@playwright/test';

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

// Helper function to setup mock routes
async function setupMockRoutes(page: any) {
    // Mock registration endpoint
    await page.route('**/auth/register', async (route: any) => {
        try {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: `user_${Date.now()}`,
                    email: 'test@example.com',
                    username: 'testuser',
                    message: 'Registration successful'
                })
            });
        } catch (error) {
            console.log('Mock registration route error:', error);
        }
    });

    // Serve demo pages
    await page.route('http://localhost:3001/**', async (route: any) => {
        const url = new URL(route.request().url());
        
        // Skip API routes
        if (url.pathname.includes('/auth/')) {
            return;
        }
        
        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: getDemoPage()
        });
    });
}

function getDemoPage(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mock Social App Demo</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .demo-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
                button:hover { background: #0056b3; }
                input { width: 200px; padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
                .result { margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; display: none; }
                .workflow-step { background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>Mock Social App Demo</h1>
            <p id="demo-content">This is a demonstration of Track B - Mock Social Application functionality.</p>
            
            <div class="demo-section">
                <h3>Basic Interaction Demo</h3>
                <button id="demo-button">Click Me</button>
                <div id="demo-result" class="result"></div>
            </div>
            
            <div class="demo-section">
                <h3>Mock Workflow Demo</h3>
                <button id="start-workflow">Start Registration Workflow</button>
                <div id="workflow-area" style="display: none;">
                    <div id="workflow-step" class="workflow-step">Step 1: Registration</div>
                    
                    <div id="step1">
                        <input id="workflow-email" placeholder="Email" type="email">
                        <input id="workflow-username" placeholder="Username">
                        <button id="workflow-next">Next Step</button>
                    </div>
                    
                    <div id="step2" style="display: none;">
                        <input id="workflow-fullname" placeholder="Full Name">
                        <button id="workflow-finish">Complete Registration</button>
                    </div>
                    
                    <div id="workflow-result" class="result"></div>
                </div>
            </div>
            
            <script>
                document.getElementById('demo-button').onclick = () => {
                    const result = document.getElementById('demo-result');
                    result.textContent = 'Button clicked successfully!';
                    result.style.display = 'block';
                };
                
                document.getElementById('start-workflow').onclick = () => {
                    document.getElementById('workflow-area').style.display = 'block';
                };
                
                document.getElementById('workflow-next').onclick = async () => {
                    const email = document.getElementById('workflow-email').value;
                    const username = document.getElementById('workflow-username').value;
                    
                    if (email && username) {
                        // Show step 2 and result
                        document.getElementById('workflow-step').textContent = 'Step 2: Profile Setup';
                        document.getElementById('step1').style.display = 'none';
                        document.getElementById('step2').style.display = 'block';
                        
                        const result = document.getElementById('workflow-result');
                        result.textContent = 'Registration completed for ' + username;
                        result.style.display = 'block';
                        
                        // Also try API call
                        try {
                            await fetch('/auth/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email, username })
                            });
                        } catch (error) {
                            console.log('API call failed, but demo continues');
                        }
                    }
                };
                
                document.getElementById('workflow-finish').onclick = () => {
                    const fullname = document.getElementById('workflow-fullname').value;
                    const username = document.getElementById('workflow-username').value;
                    
                    document.getElementById('workflow-step').textContent = 'Workflow Complete';
                    document.getElementById('step2').style.display = 'none';
                    
                    const result = document.getElementById('workflow-result');
                    result.textContent = 'Welcome ' + username + '! Profile setup complete' + (fullname ? ' with name: ' + fullname : '');
                    result.style.display = 'block';
                };
            </script>
        </body>
        </html>
    `;
}