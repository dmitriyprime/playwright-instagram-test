export interface UserData {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

export class TestDataGenerator {
  static generateUniqueUserData(): UserData {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    
    return {
      email: 'test@example.com',
      fullName: 'Test User',
      username: `testuser_${timestamp}_${randomSuffix}`,
      password: 'TestPassword123!'
    };
  }

  static getInvalidEmailTestData(): Partial<UserData> {
    return {
      email: 'invalid-email'
    };
  }

  static getWeakPasswordTestData(): Partial<UserData> {
    return {
      password: 'weak'
    };
  }

  static getEmptyFormData(): UserData {
    return {
      email: '',
      fullName: '',
      username: '',
      password: ''
    };
  }
}
