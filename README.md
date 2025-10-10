# Playwright + Postman + CI

A comprehensive test automation solution demonstrating professional QA practices with both UI automation (Playwright) and API automation (Postman), featuring CI/CD integration and modern testing methodologies.

## Project Overview

This project implements a complete testing framework covering:

- **Track A**: Instagram Web UI Testing (Non-invasive)
- **Track B**: Mock Social Application Testing  
- **API Automation**: Postman collection
- **CI/CD Pipeline**: GitHub Actions integration

## Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd playwright-instagram-test

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

**Playwright Tests:**
```bash
# Run all tests
npm test

# Run specific track
npm run test:track-a    # Instagram tests
npm run test:track-b    # Mock app tests

# Run with UI mode
npx playwright test --ui

# Generate report
npx playwright show-report
```

**Postman API Tests:**
1. Import `postman/Social-Media-API.postman_collection.json`
2. Import `postman/Social-Media-API.postman_environment.json`
3. Set `base_url` environment variable
4. Run collection in Postman or with Newman

