import { Page, Locator, expect } from '@playwright/test';

export interface MockUserData {
    email: string;
    username: string;
    fullName: string;
    password: string;
}

export class MockSocialAppPage {
    readonly page: Page;
    
    // Registration page locators
    readonly emailInput: Locator;
    readonly usernameInput: Locator;
    readonly fullNameInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    
    // Login page locators
    readonly loginUsernameInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly createAccountButton: Locator;
    
    // Feed page locators
    readonly feedTitle: Locator;
    readonly profileButton: Locator;
    readonly logoutButton: Locator;
    readonly posts: Locator;
    
    // Profile page locators
    readonly profileTitle: Locator;
    readonly usernameDisplay: Locator;
    readonly statsDisplay: Locator;
    readonly editProfileButton: Locator;
    readonly backToFeedButton: Locator;
    readonly profileLogoutButton: Locator;
    
    // Profile editing locators
    readonly profileForm: Locator;
    readonly editFullNameInput: Locator;
    readonly saveProfileButton: Locator;
    readonly cancelEditButton: Locator;
    readonly updateSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Registration page locators
        this.emailInput = page.locator('#email');
        this.usernameInput = page.locator('#username');
        this.fullNameInput = page.locator('#fullName');
        this.passwordInput = page.locator('#password');
        this.registerButton = page.locator('#register-btn');
        this.successMessage = page.locator('#success-message');
        this.errorMessage = page.locator('#error-message');
        
        // Login page locators
        this.loginUsernameInput = page.locator('#username');
        this.loginPasswordInput = page.locator('#password');
        this.loginButton = page.locator('#login-btn');
        this.createAccountButton = page.locator('button').filter({ hasText: 'Create Account' });
        
        // Feed page locators
        this.feedTitle = page.locator('h1').filter({ hasText: 'Feed' });
        this.profileButton = page.locator('#profile-btn');
        this.logoutButton = page.locator('#logout-btn');
        this.posts = page.locator('.post');
        
        // Profile page locators
        this.profileTitle = page.locator('h1').filter({ hasText: 'Profile' });
        this.usernameDisplay = page.locator('#username-display');
        this.statsDisplay = page.locator('#stats');
        this.editProfileButton = page.locator('#edit-profile');
        this.backToFeedButton = page.locator('#back-to-feed');
        this.profileLogoutButton = page.locator('#logout-btn-profile');
        
        // Profile editing locators
        this.profileForm = page.locator('#profile-form');
        this.editFullNameInput = page.locator('#edit-fullName');
        this.saveProfileButton = page.locator('#save-profile');
        this.cancelEditButton = page.locator('#cancel-edit');
        this.updateSuccessMessage = page.locator('#update-success');
    }

    async navigateToRegister(baseUrl: string = 'http://localhost:3001') {
        await this.page.goto(`${baseUrl}/register`);
        await expect(this.page.locator('h1')).toContainText('Create Account');
    }

    async navigateToLogin(baseUrl: string = 'http://localhost:3001') {
        await this.page.goto(`${baseUrl}/login`);
        await expect(this.page.locator('#login-page h1')).toContainText('Login');
    }

    async fillRegistrationForm(userData: MockUserData) {
        await this.emailInput.fill(userData.email);
        await this.usernameInput.fill(userData.username);
        await this.fullNameInput.fill(userData.fullName);
        await this.passwordInput.fill(userData.password);
    }

    async submitRegistration() {
        await this.registerButton.click();
    }

    async verifyRegistrationSuccess() {
        await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.successMessage).toContainText('Registration successful');
    }

    async performLogin(username: string, password: string) {
        await this.loginUsernameInput.fill(username);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginSuccess() {
        await expect(this.feedTitle).toBeVisible();
    }

    async verifyFeedContent() {
        await expect(this.posts).toHaveCount(2);
        await expect(this.posts.first()).toContainText('testuser: This is a mock post');
    }

    async navigateToProfile() {
        await this.profileButton.click();
        await expect(this.profileTitle).toBeVisible();
    }

    async verifyProfileInfo(expectedUsername: string) {
        await expect(this.usernameDisplay).toContainText(expectedUsername);
        await expect(this.statsDisplay).toContainText('Posts: 5');
        await expect(this.statsDisplay).toContainText('Followers: 150');
        await expect(this.statsDisplay).toContainText('Following: 200');
    }

    async editProfile(newFullName: string) {
        await this.editProfileButton.click();
        await expect(this.profileForm).toBeVisible();
        
        await this.editFullNameInput.fill(newFullName);
        await this.saveProfileButton.click();
    }

    async verifyProfileUpdateSuccess() {
        await expect(this.updateSuccessMessage).toBeVisible();
        await expect(this.updateSuccessMessage).toContainText('Profile updated successfully');
    }

    async logout() {
        if (await this.logoutButton.isVisible()) {
            await this.logoutButton.click();
        } else if (await this.profileLogoutButton.isVisible()) {
            await this.profileLogoutButton.click();
        }
        
        await expect(this.page.locator('h1')).toContainText('Login');
    }

    async verifyLogoutSuccess() {
        await expect(this.page.locator('h1')).toContainText('Login');
        await expect(this.loginUsernameInput).toBeEmpty();
    }

    // Utility method to generate unique test data
    static generateTestData(): MockUserData {
        const timestamp = Date.now();
        return {
            email: `user${timestamp}@example.com`,
            username: `user${timestamp}`,
            fullName: `Test User ${timestamp}`,
            password: 'SecurePassword123!'
        };
    }

    // Method to clear form fields
    async clearRegistrationForm() {
        await this.emailInput.clear();
        await this.usernameInput.clear();
        await this.fullNameInput.clear();
        await this.passwordInput.clear();
    }

    // Method to verify navigation elements are visible
    async verifyNavigationElements() {
        await expect(this.profileButton).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
    }

    // Method to verify all profile editing elements
    async verifyProfileEditingElements() {
        await expect(this.editProfileButton).toBeVisible();
        await expect(this.editProfileButton).toBeEnabled();
    }
}