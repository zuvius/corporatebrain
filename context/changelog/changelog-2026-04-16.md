# Changelog - April 16, 2026

## Fixed Component Test Failures in CI

### Problem

GitHub Actions CI was failing with two issues:

1. `Invalid Chai property: toBeInTheDocument` - jest-dom matchers not loaded
2. `scrollIntoView is not a function` - DOM API not mocked in jsdom

### Root Cause

- `vitest.setup.ts` was commented out in `vitest.config.ts` (disabled due to earlier lodash dependency concerns)
- Setup file was missing `scrollIntoView` mock

### Changes Made

1. **vitest.config.ts** - Re-enabled setup file and added inline dependency config:

   ```typescript
   setupFiles: ['./vitest.setup.ts'],
   deps: {
     inline: ['@testing-library/jest-dom'],
   },
   ```

2. **vitest.setup.ts** - Added scrollIntoView mock:

   ```typescript
   Element.prototype.scrollIntoView = vi.fn();
   ```

3. **chat-message.test.tsx** - Fixed locale-dependent timestamp assertion:

   ```typescript
   // Changed from:
   expect(screen.getByText("10:30")).toBeInTheDocument();
   // To:
   expect(screen.getByText(/10:30/i)).toBeInTheDocument();
   ```

4. **Dependencies** - Installed `lodash-es` and `@types/lodash-es` for ESM compatibility

### Test Results

- All 45 tests now passing (4 test files)
- Duration: ~6 seconds

### Files Modified

- `c:\Users\seoho\Documents\Corporate Brain\vitest.config.ts`
- `c:\Users\seoho\Documents\Corporate Brain\vitest.setup.ts`
- `c:\Users\seoho\Documents\Corporate Brain\components\chat\chat-message.test.tsx`

---

## Fixed ESLint/Lint Command in CI

### Problem

GitHub Actions CI was failing with:

```
Invalid project directory provided, no such directory: /home/runner/work/corporate-brain/corporate-brain/lint
```

### Root Cause

- `next lint` command is broken in Next.js 16.2.3 (treats "lint" as a directory argument)
- No ESLint configuration file existed in the project
- ESLint v9 requires the new flat config format (`eslint.config.mjs`)

### Changes Made

1. **package.json** - Changed lint script from `next lint` to direct ESLint:

   ```json
   "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
   ```

2. **eslint.config.mjs** - Created new flat config with:
   - TypeScript ESLint recommended rules
   - React and React Hooks plugins
   - JSX Accessibility plugin
   - Custom rules for unused vars and explicit any
   - Proper ignore patterns for build/output directories

3. **lib/utils.test.ts** - Fixed lint error:

   ```typescript
   // Added eslint-disable comment for intentional test behavior
   // eslint-disable-next-line no-constant-binary-expression
   expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
   ```

4. **Dependencies installed**:
   - `typescript-eslint`
   - `globals`
   - `@typescript-eslint/eslint-plugin`
   - `@typescript-eslint/parser`
   - `eslint-plugin-react`
   - `eslint-plugin-react-hooks`
   - `eslint-plugin-jsx-a11y`

### Lint Results

- **0 errors, 99 warnings** (exit code 0)
- Warnings are primarily `no-explicit-any` in existing codebase
- CI will now pass

### Files Modified

- `c:\Users\seoho\Documents\Corporate Brain\package.json`
- `c:\Users\seoho\Documents\Corporate Brain\eslint.config.mjs` (created)
- `c:\Users\seoho\Documents\Corporate Brain\lib\utils.test.ts`

---

## Major Dependency Version Updates

### Overview

Updated all packages to latest stable versions for improved security, performance, and feature availability.

### Critical Updates

| Package       | Old Version | New Version |
| ------------- | ----------- | ----------- |
| `react`       | ^19.0.0     | 19.2.5      |
| `react-dom`   | ^19.0.0     | 19.2.5      |
| `typescript`  | ^5.3.0      | 6.0.2       |
| `tailwindcss` | ^3.4.0      | 4.2.2       |
| `eslint`      | ^9.0.0      | 10.2.0      |
| `vitest`      | ^1.6.0      | 4.1.4       |
| `vite`        | ^5.4.0      | 8.0.8       |

### Database & ORM

| Package       | Old Version | New Version |
| ------------- | ----------- | ----------- |
| `drizzle-orm` | ^0.32.0     | 0.45.2      |
| `drizzle-kit` | ^0.23.0     | 0.31.10     |
| `pg`          | ^8.11.0     | 8.2.0       |

### AI SDKs

| Package                 | Old Version | New Version |
| ----------------------- | ----------- | ----------- |
| `@anthropic-ai/sdk`     | ^0.39.0     | 0.89.0      |
| `@google/generative-ai` | ^0.21.0     | REMOVED     |
| `@google/genai`         | -           | 1.50.1      |
| `ai`                    | ^4.0.0      | 6.0.164     |
| `openai`                | ^4.28.0     | 6.34.0      |

### State Management & UI

| Package         | Old Version | New Version |
| --------------- | ----------- | ----------- |
| `zustand`       | ^4.5.0      | 5.0.12      |
| `zod`           | ^3.22.0     | 4.3.6       |
| `framer-motion` | ^11.0.0     | 12.38.0     |
| `lucide-react`  | ^0.460.0    | 1.8.0       |

### Testing

| Package                     | Old Version | New Version |
| --------------------------- | ----------- | ----------- |
| `@playwright/test`          | ^1.42.0     | 1.59.1      |
| `@testing-library/react`    | ^16.0.0     | 16.3.2      |
| `@testing-library/jest-dom` | ^6.6.0      | 6.9.1       |
| `@vitest/coverage-v8`       | ^1.6.0      | 4.1.4       |

### Deprecated Packages Removed

- `@types/bcryptjs` (deprecated)
- `@types/uuid` (deprecated)
- `lodash-es` (no longer needed)

### Files Modified

- `c:\Users\seoho\Documents\Corporate Brain\package.json`

---

## Dependency Upgrades & Type Fixes - April 16, 2026 (Evening Session)

### Summary

Resolved all 75 TypeScript errors and completed major dependency upgrades. Build now succeeds with zero errors and zero deprecation warnings.

### Key Changes

#### 1. Added Tailwind CSS v4 Support

- **Added**: `@tailwindcss/postcss` v4.2.2 to devDependencies
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\postcss.config.js` - Updated to use `@tailwindcss/postcss` plugin
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\app\globals.css` - Rewrote with Tailwind v4 `@import "tailwindcss"` and `@theme` syntax

#### 2. Fixed Next.js 16 Route Handler Types

- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\app\api\auth\oauth\[provider]\route.ts` - Changed params to `Promise<{ provider: string }>`
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\app\api\auth\oauth\callback\[provider]\route.ts` - Changed params to `Promise<{ provider: string }>`

#### 3. Fixed React Suspense for useSearchParams

- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\app\(marketing)\auth\signin\page.tsx` - Wrapped `SignInForm` in `Suspense` boundary

#### 4. Migrated Middleware to Proxy (Next.js 16 Convention)

- **Renamed**: `c:\Users\seoho\Documents\Corporate Brain\middleware.ts` → `c:\Users\seoho\Documents\Corporate Brain\proxy.ts`
- **Modified**: Export changed from `middleware()` to `proxy()` function

#### 5. Fixed Deprecated images.domains Config

- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\next.config.js` - Removed deprecated `domains: ["localhost"]` array, added `http://localhost` to `remotePatterns`

#### 6. TypeScript Error Fixes (75 → 0)

- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\tsconfig.json` - Removed deprecated `baseUrl` option
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\types\index.ts` - Added NextAuth module augmentations for `role` and `tenantId`
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\lib\ai\client.ts` - Migrated Google AI SDK from `@google/generative-ai` to `@google/genai`
- **Modified**: `c:\Users\seoho\Documents\Corporate Brain\lib\ai\router\index.ts` - Fixed `generateChatCompletion` call to pass full model config
- **Modified**: 15+ API route files - Fixed unused imports, unused parameters, Zod schema types, added type assertions
- **Modified**: 10+ component files - Fixed React imports, `useRef` calls, D3 type assertions

### Build Status

- **TypeScript**: 0 errors
- **Build**: Successful (43 pages optimized)
- **Deprecation Warnings**: 0 (all resolved)

### Files Modified

- `c:\Users\seoho\Documents\Corporate Brain\package.json`
- `c:\Users\seoho\Documents\Corporate Brain\postcss.config.js`
- `c:\Users\seoho\Documents\Corporate Brain\next.config.js`
- `c:\Users\seoho\Documents\Corporate Brain\tsconfig.json`
- `c:\Users\seoho\Documents\Corporate Brain\proxy.ts` (renamed from middleware.ts)
- `c:\Users\seoho\Documents\Corporate Brain\app\globals.css`
- `c:\Users\seoho\Documents\Corporate Brain\types\index.ts`
- `c:\Users\seoho\Documents\Corporate Brain\lib\ai\client.ts`
- `c:\Users\seoho\Documents\Corporate Brain\lib\ai\router\index.ts`
- `c:\Users\seoho\Documents\Corporate Brain\app\api\auth\oauth\[provider]\route.ts`
- `c:\Users\seoho\Documents\Corporate Brain\app\api\auth\oauth\callback\[provider]\route.ts`
- `c:\Users\seoho\Documents\Corporate Brain\app\(marketing)\auth\signin\page.tsx`
- And 20+ additional files for TypeScript fixes
