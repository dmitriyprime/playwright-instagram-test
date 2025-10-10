import { test, expect } from '@playwright/test';
import { MockSocialAppPage, MockUserData } from './pages/mock-social-app.page';

test.describe('Mock Social App - Track B', {
    tag: ['@mock', '@track-b', '@social-app']
}, () => {
    let mockApp: MockSocialAppPage;

    test.beforeEach(async ({ page }) => {
        // Setup mock server responses for all API endpoints
        await setupMockRoutes(page);
        
        // Initialize page object
        mockApp = new MockSocialAppPage(page);
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

    test('Mock API interaction test', {
        tag: ['@api', '@mock'],
        annotation: [
            { type: 'feature', description: 'Mock API Endpoints' },
            { type: 'severity', description: 'high' },
            { type: 'story', description: 'Verify mock API responses work correctly' }
        ]
    }, async ({ page }) => {
        await test.step('Navigate to API demo page', async () => {
            await page.goto('http://localhost:3001/api-demo');
            await expect(page.locator('h1')).toContainText('API Demo');
        });

        await test.step('Test mock user registration API', async () => {
            await page.fill('#test-email', 'test@example.com');
            await page.fill('#test-username', 'testuser');
            await page.click('#test-register');
            
            await expect(page.locator('#api-result')).toContainText('Registration successful');
            await expect(page.locator('#api-result')).toContainText('testuser');
        });

        await test.step('Test mock login API', async () => {
            await page.click('#test-login');
            await expect(page.locator('#api-result')).toContainText('Login successful');
            await expect(page.locator('#api-result')).toContainText('mock_jwt_token');
        });
    });

    test('End-to-end mock workflow', {
        tag: ['@e2e', '@workflow'],
        annotation: [
            { type: 'feature', description: 'Complete Mock Workflow' },
            { type: 'severity', description: 'critical' },
            { type: 'story', description: 'User can complete full mock social app workflow' }
        ]
    }, async ({ page }) => {
        const userData = {
            email: `user${Date.now()}@example.com`,
            username: `user${Date.now()}`,
            fullName: `Test User ${Date.now()}`,
            password: 'SecurePassword123!'
        };

        await test.step('Start at demo page', async () => {
            await page.goto('http://localhost:3001/demo');
            await expect(page.locator('h1')).toContainText('Mock Social App Demo');
        });

        await test.step('Navigate to registration workflow', async () => {
            await page.click('#start-workflow');
            await expect(page.locator('#workflow-step')).toContainText('Step 1: Registration');
        });

        await test.step('Complete mock registration', async () => {
            await page.fill('#workflow-email', userData.email);
            await page.fill('#workflow-username', userData.username);
            await page.click('#workflow-next');
            
            await expect(page.locator('#workflow-step')).toContainText('Step 2: Profile Setup');
            await expect(page.locator('#workflow-result')).toContainText('Registration completed');
        });

        await test.step('Complete profile setup', async () => {
            await page.fill('#workflow-fullname', userData.fullName);
            await page.click('#workflow-finish');
            
            await expect(page.locator('#workflow-step')).toContainText('Workflow Complete');
            await expect(page.locator('#workflow-result')).toContainText('Welcome ' + userData.username);
        });
    });
});

// Helper function to setup mock routes for simpler demo
async function setupMockRoutes(page: any) {
    // Mock registration endpoint - need to intercept before page routes
    await page.route('**/auth/register', async (route: any) => {
        const request = route.request();
        try {
            const postData = request.postDataJSON();
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: `user_${Date.now()}`,
                    email: postData.email,
                    username: postData.username,
                    message: 'Registration successful'
                })
            });
        } catch (error) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: `user_${Date.now()}`,
                    email: 'test@example.com',
                    username: 'testuser',
                    message: 'Registration successful'
                })
            });
        }
    });

    // Mock login endpoint
    await page.route('**/auth/login', async (route: any) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                token: 'mock_jwt_token_' + Date.now(),
                user: {
                    id: 'user_123',
                    username: 'testuser',
                    email: 'test@example.com'
                }
            })
        });
    });

    // Serve demo pages - use lower priority route
    await page.route('http://localhost:3001/**', async (route: any) => {
        const url = new URL(route.request().url());
        
        // Skip API routes
        if (url.pathname.includes('/auth/')) {
            return;
        }
        
        if (url.pathname === '/demo') {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: getDemoPage()
            });
        } else if (url.pathname === '/api-demo') {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: getApiDemoPage()
            });
        } else {
            // Default to demo page
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: getDemoPage()
            });
        }
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
                        // Mock API call
                        try {
                            const response = await fetch('/auth/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email, username })
                            });
                            
                            if (response.ok) {
                                document.getElementById('workflow-step').textContent = 'Step 2: Profile Setup';
                                document.getElementById('step1').style.display = 'none';
                                document.getElementById('step2').style.display = 'block';
                                
                                const result = document.getElementById('workflow-result');
                                result.textContent = 'Registration completed for ' + username;
                                result.style.display = 'block';
                            }
                        } catch (error) {
                            console.error('Registration error:', error);
                        }
                    }
                };
                
                document.getElementById('workflow-finish').onclick = () => {
                    const fullname = document.getElementById('workflow-fullname').value;
                    const username = document.getElementById('workflow-username').value;
                    
                    if (fullname) {
                        document.getElementById('workflow-step').textContent = 'Workflow Complete';
                        document.getElementById('step2').style.display = 'none';
                        
                        const result = document.getElementById('workflow-result');
                        result.textContent = 'Welcome ' + username + '! Profile setup complete with name: ' + fullname;
                        result.style.display = 'block';
                    }
                };
            </script>
        </body>
        </html>
    `;
}

function getApiDemoPage(): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>API Demo</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .api-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
                button:hover { background: #1e7e34; }
                input { width: 200px; padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
                .result { margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; min-height: 50px; }
            </style>
        </head>
        <body>
            <h1>API Demo</h1>
            <p>Test mock API endpoints for Track B demonstration.</p>
            
            <div class="api-section">
                <h3>User Registration API Test</h3>
                <input id="test-email" placeholder="Email" type="email" value="test@example.com">
                <input id="test-username" placeholder="Username" value="testuser">
                <button id="test-register">Test Registration API</button>
            </div>
            
            <div class="api-section">
                <h3>User Login API Test</h3>
                <button id="test-login">Test Login API</button>
            </div>
            
            <div class="api-section">
                <h3>API Response</h3>
                <div id="api-result" class="result">Click a button above to test API endpoints...</div>
            </div>
            
            <script>
                document.getElementById('test-register').onclick = async () => {
                    const email = document.getElementById('test-email').value;
                    const username = document.getElementById('test-username').value;
                    const result = document.getElementById('api-result');
                    
                    try {
                        const response = await fetch('/auth/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, username, fullName: 'Test User' })
                        });
                        
                        const data = await response.json();
                        result.innerHTML = '<strong>Registration successful!</strong><br>' + 
                                         'User ID: ' + data.id + '<br>' +
                                         'Username: ' + data.username + '<br>' +
                                         'Email: ' + data.email + '<br>' +
                                         'Message: ' + data.message;
                    } catch (error) {
                        result.innerHTML = '<strong>Error:</strong> ' + error.message;
                    }
                };
                
                document.getElementById('test-login').onclick = async () => {
                    const result = document.getElementById('api-result');
                    
                    try {
                        const response = await fetch('/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: 'testuser', password: 'password123' })
                        });
                        
                        const data = await response.json();
                        result.innerHTML = '<strong>Login successful!</strong><br>' + 
                                         'Token: ' + data.token + '<br>' +
                                         'User ID: ' + data.user.id + '<br>' +
                                         'Username: ' + data.user.username + '<br>' +
                                         'Email: ' + data.user.email;
                    } catch (error) {
                        result.innerHTML = '<strong>Error:</strong> ' + error.message;
                    }
                };
            </script>
        </body>
        </html>
    `;
}