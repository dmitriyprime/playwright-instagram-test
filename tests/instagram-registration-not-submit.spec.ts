import { test, expect } from './fixtures/instagram.fixture';
import { TestDataGenerator } from './data/test-data';

test.describe('Instagram Registration', () => {

    test('should fill registration form and verify validations without submitting', {
        tag: ['@registration', '@ui', '@form-validation', '@smoke'],
        annotation: [
            { type: 'feature', description: 'Instagram Registration Form' },
            { type: 'severity', description: 'high' },
            { type: 'story', description: 'User should be able to fill registration form and see validation feedback' }
        ]
    }, async ({ instagramPage, testUser }) => {
        // Navigate to registration page (using fixture)
        await instagramPage.navigate();

        await test.step('Fill registration form with valid data', async () => {
            await instagramPage.fillEmail(testUser.email);
            await instagramPage.fillFullName(testUser.fullName);
            await instagramPage.fillUsername(testUser.username);
            await instagramPage.fillPassword(testUser.password);
        });

        await test.step('Verify form fields are filled correctly', async () => {
            await expect(instagramPage.emailInput).toHaveValue(testUser.email);
            await expect(instagramPage.fullNameInput).toHaveValue(testUser.fullName);
            await expect(instagramPage.usernameInput).toHaveValue(testUser.username);
            await expect(instagramPage.passwordInput).toHaveValue(testUser.password);
        });

        await test.step('Verify sign up button is enabled', async () => {
            await expect(instagramPage.signUpButton).toBeEnabled();
        });

        await test.step('Test field validations with invalid data', async () => {
            const invalidEmailData = TestDataGenerator.getInvalidEmailTestData();
            const weakPasswordData = TestDataGenerator.getWeakPasswordTestData();
            
            await instagramPage.fillEmail(invalidEmailData.email!);
            await instagramPage.verifyEmailValidation();

            await instagramPage.fillPassword(weakPasswordData.password!);
            await instagramPage.verifyPasswordValidation();
        });

        await test.step('Verify form can be reset/cleared', async () => {
            const emptyData = TestDataGenerator.getEmptyFormData();
            
            await instagramPage.clearForm();
            await expect(instagramPage.emailInput).toHaveValue(emptyData.email);
            await expect(instagramPage.fullNameInput).toHaveValue(emptyData.fullName);
            await expect(instagramPage.usernameInput).toHaveValue(emptyData.username);
            await expect(instagramPage.passwordInput).toHaveValue(emptyData.password);
        });
    });
});