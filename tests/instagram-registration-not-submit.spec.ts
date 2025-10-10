import { test, expect } from '@playwright/test';
import { InstagramRegistrationPage } from './pages/instagram-registration.page';
import { TestDataGenerator } from './data/test-data';

test.describe('Instagram Registration', () => {
    let registrationPage: InstagramRegistrationPage;

    test.beforeEach(async ({ page }) => {
        
        registrationPage = new InstagramRegistrationPage(page);
        await registrationPage.navigate();
    });

    test('should fill registration form and verify validations without submitting', {
        tag: ['@registration', '@ui', '@form-validation', '@smoke'],
        annotation: [
            { type: 'feature', description: 'Instagram Registration Form' },
            { type: 'severity', description: 'high' },
            { type: 'story', description: 'User should be able to fill registration form and see validation feedback' }
        ]
    }, async () => {
        const testData = TestDataGenerator.generateUniqueUserData();

        await test.step('Fill registration form with valid data', async () => {
            await registrationPage.fillEmail(testData.email);
            await registrationPage.fillFullName(testData.fullName);
            await registrationPage.fillUsername(testData.username);
            await registrationPage.fillPassword(testData.password);
        });

        await test.step('Verify form fields are filled correctly', async () => {
            await expect(registrationPage.emailInput).toHaveValue(testData.email);
            await expect(registrationPage.fullNameInput).toHaveValue(testData.fullName);
            await expect(registrationPage.usernameInput).toHaveValue(testData.username);
            await expect(registrationPage.passwordInput).toHaveValue(testData.password);
        });

        await test.step('Verify sign up button is enabled', async () => {
            await expect(registrationPage.signUpButton).toBeEnabled();
        });

        await test.step('Test field validations with invalid data', async () => {
            const invalidEmailData = TestDataGenerator.getInvalidEmailTestData();
            const weakPasswordData = TestDataGenerator.getWeakPasswordTestData();
            
            await registrationPage.fillEmail(invalidEmailData.email!);
            await registrationPage.verifyEmailValidation();

            await registrationPage.fillPassword(weakPasswordData.password!);
            await registrationPage.verifyPasswordValidation();
        });

        await test.step('Verify form can be reset/cleared', async () => {
            const emptyData = TestDataGenerator.getEmptyFormData();
            
            await registrationPage.clearForm();
            await expect(registrationPage.emailInput).toHaveValue(emptyData.email);
            await expect(registrationPage.fullNameInput).toHaveValue(emptyData.fullName);
            await expect(registrationPage.usernameInput).toHaveValue(emptyData.username);
            await expect(registrationPage.passwordInput).toHaveValue(emptyData.password);
        });
    });
});