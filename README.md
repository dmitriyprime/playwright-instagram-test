# Playwright + Postman + CI

A comprehensive test automation solution demonstrating professional QA practices with both UI automation (Playwright) and API automation (Postman), featuring CI/CD integration and modern testing methodologies.

## Project Overview

This project implements a complete testing framework covering:

- **Track A**: Instagram Web UI Testing (Non-invasive)
- **Track B**: Mock Social App with complete user workflows
- **API Testing**: Postman collection with Newman automation
- **CI/CD**: GitHub Actions with comprehensive reporting

## 📊 Live Reports

- **🎭 Allure Report**: [View Latest Test Results](https://dmitriyprime.github.io/playwright-instagram-test/)
- **🔄 GitHub Actions**: [View CI/CD Pipeline](https://github.com/dmitriyprime/playwright-instagram-test/actions)

> **Note**: Allure reports are automatically generated and deployed after each test run. The report includes detailed test execution history, trends, and comprehensive test coverage analysis.

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

## Running Tests

**Playwright Tests:**
```bash
# Run all tests
npm test

# View Allure report locally
npm run test:allure
```

**Postman API Tests:**
1. Import `postman/Social-Media-API.postman_collection.json`
2. Import `postman/Social-Media-API.postman_environment.json`
3. Set `base_url` environment variable
4. Run collection in Postman or with Newman

