# Testing Guide - Corporate Brain

> Comprehensive testing documentation for the Enterprise AI Knowledge Platform

**Last Updated**: April 11, 2026  
**Test Framework**: Vitest (Unit) + Playwright (E2E)  
**Coverage Tool**: @vitest/coverage-v8

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Commands](#test-commands)
3. [What Tests Provide](#what-tests-provide)
4. [Watch Mode Features](#watch-mode-features)
5. [Test File Structure](#test-file-structure)
6. [Unit Tests](#unit-tests)
7. [Component Tests](#component-tests)
8. [E2E Tests](#e2e-tests)
9. [Coverage Reports](#coverage-reports)
10. [CI/CD Integration](#cicd-integration)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run tests (watch mode)
npm run test

# Run tests once (CI mode)
npm run test:ci

# Run E2E tests only
npm run test:e2e

# Build test
npm run build

# Dev server
npm run dev
```

---

## Test Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run test` | Runs Vitest in watch mode | Development, TDD |
| `npm run test:ci` | Runs Vitest + Playwright once | CI/CD pipelines |
| `npm run test:e2e` | Runs Playwright E2E tests | Full integration testing |
| `npm run type-check` | TypeScript type validation | Pre-commit validation |
| `npm run lint` | ESLint code quality check | Code style enforcement |

---

## What Tests Provide

### 1. Console Output (Terminal)

```
$ npm run test

 DEV  v1.3.0 c:/Users/seoho/Documents/Corporate Brain

 ✓ lib/utils.test.ts (3 tests) 2ms
   ✓ formatDate returns correct string
   ✓ truncateText cuts at limit
   ✓ calculateCost rounds to 4 decimals

 ✓ components/chat/chat-message.test.tsx (2 tests) 15ms
   ✓ renders user message correctly
   ✓ renders ai message with citations

Test Files  2 passed (2)
     Tests  5 passed (5)
  Duration  245ms
```

### 2. Failure Reports

```
 ✕ lib/ai/cost-tracker.test.ts (1 test) 5ms
   ✕ calculateCost > handles invalid model name
     → Expected: "Error: Model not found"
     → Received: "Error: Invalid model"
     
     at cost-tracker.test.ts:15:20
```

### 3. Watch Mode

```
$ npm run test

 DEV  v1.3.0 c:/Users/seoho/Documents/Corporate Brain

 ✓ No test files found

Test Files  0 passed (0)
     Tests  0 passed (0)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Watch Mode: press `h` for help

  h - show help
  r - rerun all tests
  f - rerun only failed tests
  p - filter by filename
  t - filter by test name
  q - quit
```

---

## Watch Mode Features

| Key | Action | Description |
|-----|--------|-------------|
| `h` | Show help | Display all available commands |
| `r` | Rerun all | Execute all test files again |
| `f` | Rerun failed | Only run tests that failed |
| `p` | Filter by file | Pattern match test filenames |
| `t` | Filter by test | Pattern match test names |
| `a` | Run all | Switch back to running all tests |
| `q` | Quit | Exit watch mode |

---

## Test File Structure

```
c:\Users\seoho\Documents\Corporate Brain\
├── lib/
│   ├── utils.test.ts              # Unit tests for utilities
│   ├── ai/
│   │   └── cost-tracker.test.ts   # AI cost tracking tests
│   └── db/
│       └── queries.test.ts        # Database query tests
├── components/
│   ├── chat/
│   │   ├── chat-message.test.tsx  # Chat message component tests
│   │   └── chat-interface.test.tsx # Chat interface tests
│   └── auth/
│       └── signin-form.test.tsx   # Signin form tests
├── tests/
│   └── e2e/
│       ├── auth.spec.ts           # Authentication E2E tests
│       ├── chat.spec.ts           # Chat functionality E2E
│       └── onboarding.spec.ts     # Onboarding flow E2E
├── vitest.config.ts               # Vitest configuration
└── playwright.config.ts           # Playwright configuration
```

---

## Unit Tests

### Test File Naming Convention

- `*.test.ts` - Unit tests for utilities, helpers, business logic
- `*.spec.ts` - Alternative naming (also supported)

### Example Unit Test

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, truncateText } from './utils';

describe('formatDate', () => {
  it('returns correct string for valid date', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  it('handles invalid date gracefully', () => {
    expect(formatDate(null)).toBe('Invalid date');
  });
});

describe('truncateText', () => {
  it('cuts at limit', () => {
    const text = 'This is a very long text';
    expect(truncateText(text, 10)).toBe('This is...');
  });

  it('does not truncate short text', () => {
    const text = 'Short';
    expect(truncateText(text, 10)).toBe('Short');
  });
});
```

---

## Component Tests

### Test File Naming Convention

- `*.test.tsx` - React component tests

### Required Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
```

### Example Component Test

```typescript
// components/chat/chat-message.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './chat-message';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    render(
      <ChatMessage
        role="user"
        content="Hello AI"
        timestamp={new Date()}
      />
    );
    
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('renders ai message with citations', () => {
    render(
      <ChatMessage
        role="assistant"
        content="Based on the document..."
        citations={[
          { id: '1', title: 'Q4 Report', source: 'Drive' }
        ]}
        timestamp={new Date()}
      />
    );
    
    expect(screen.getByText('Based on the document...')).toBeInTheDocument();
    expect(screen.getByText('Q4 Report')).toBeInTheDocument();
  });
});
```

---

## E2E Tests

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3004',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3004',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example E2E Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign in with magic link', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText('Check your email')).toBeVisible();
  });

  test('user can sign in with Google OAuth', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.click('button:has-text("Sign in with Google")');
    
    // Note: Actual OAuth flow requires test credentials
    await expect(page).toHaveURL(/accounts.google.com/);
  });
});

test.describe('Chat', () => {
  test('user can send a message', async ({ page }) => {
    await page.goto('/app');
    await page.fill('textarea[placeholder="Ask anything..."]', 'What is AI?');
    await page.keyboard.press('Enter');
    
    await expect(page.getByText('What is AI?')).toBeVisible();
    await expect(page.getByTestId('ai-response')).toBeVisible({ timeout: 10000 });
  });
});
```

---

## Coverage Reports

### Install Coverage Tool

```bash
npm install -D @vitest/coverage-v8
```

### Update package.json

```json
{
  "scripts": {
    "test": "vitest --coverage",
    "test:coverage": "vitest --coverage --reporter=verbose"
  }
}
```

### Coverage Output

```
$ npm run test:coverage

 Coverage report generated in coverage/
 - HTML: coverage/index.html (open in browser)
 - Text: Summary in terminal
 - LCOV: For external tools

=============================== Coverage summary ===============================
Statements   : 85.23% ( 423/496 )
Branches     : 78.45% ( 189/241 )
Functions    : 88.12% ( 134/152 )
Lines        : 84.98% ( 412/485 )
================================================================================
```

### Coverage Configuration (vitest.config.ts)

```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    reportsDirectory: './coverage',
    exclude: [
      'node_modules/',
      'tests/',
      '**/*.d.ts',
      '**/*.config.*',
    ],
    thresholds: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `No test files found` | No `*.test.ts` files exist | Create test files following naming convention |
| `Cannot find module` | Missing imports or aliases | Update `vitest.config.ts` path aliases |
| `JSX element type error` | React types not loaded | Ensure `@types/react` is installed |
| `Test timeout` | Async test too slow | Increase timeout: `it('test', { timeout: 10000 }, () => {})` |
| `Mock not working` | Hoisting issue | Use `vi.mock()` at top of file |

### Debug Mode

```bash
# Run with verbose output
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- lib/utils.test.ts

# Run with debugger
npm run test -- --inspect-brk
```

### Test Database Setup

```typescript
// tests/setup/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

const testClient = new Client({
  connectionString: process.env.TEST_DATABASE_URL,
});

export async function setupTestDb() {
  await testClient.connect();
  const db = drizzle(testClient);
  await migrate(db, { migrationsFolder: './drizzle' });
  return db;
}

export async function teardownTestDb() {
  await testClient.end();
}
```

---

## Testing Checklist

### Before Every Commit

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] New tests added for new features
- [ ] Existing tests still pass

### Before Every Release

- [ ] `npm run test:ci` passes (includes E2E)
- [ ] Coverage meets thresholds (80%+)
- [ ] E2E tests pass in all browsers
- [ ] Performance tests complete

---

## Related Documentation

- `c:\Users\seoho\Documents\Corporate Brain\docs\ARCHITECTURE.md` - System architecture
- `c:\Users\seoho\Documents\Corporate Brain\docs\DEPLOYMENT.md` - Deployment guide
- `c:\Users\seoho\Documents\Corporate Brain\AGENTS.md` - AI agent rules (includes Quality Gates)
