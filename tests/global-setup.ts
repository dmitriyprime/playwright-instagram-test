import { FullConfig } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function globalSetup(config: FullConfig) {
  console.log('Setting up tests...');
  
  // Check if Instagram credentials are available
  if (!process.env.INSTAGRAM_USERNAME || !process.env.INSTAGRAM_PASSWORD) {
    console.log('Warning: Instagram credentials not found. Track A tests will be skipped.');
    console.log('Please set INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD environment variables for Track A tests.');
  }
  
  // Create test-results directory
  const testResultsDir = join(process.cwd(), 'test-results');
  if (!existsSync(testResultsDir)) {
    mkdirSync(testResultsDir, { recursive: true });
  }
}

export default globalSetup;