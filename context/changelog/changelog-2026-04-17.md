# Changelog - April 17, 2026

## Fixed Type Errors (14 → 0)

### Summary
Fixed all TypeScript errors that were preventing type-check from passing.

### Changes Made

1. **types/index.ts:5-13** - Added `email` and `emailVerified: Date | null` to NextAuth Session user type
2. **lib/auth/verification.ts:58-73** - Removed unnecessary type cast, now uses session.user directly
3. **lib/auth/verification.ts:79** - Updated `getVerificationStatus` parameter type to `Date | null`
4. **components/verification-banner.tsx:4** - Removed unused `Mail` import
5. **app/onboarding/page.tsx:404** - Added `popular?: boolean` to integration type
6. **app/onboarding/page.tsx:407-429** - Removed unused `teaserInfo` state
7. **app/(app)/app/layout.tsx:45-52** - Removed `emailVerified` from user object (not in component's User type)
8. **app/api/auth/resend-verification/route.ts:4** - Removed unused `users` import
9. **app/api/chat/route.ts:9** - Removed unused `requireVerification` import
10. **app/api/integrations/connect/route.ts:7** - Removed unused `requireVerification` import
11. **app/api/integrations/list/route.ts:74** - Changed `connectedAt` to `createdAt` to match schema
12. **components/app/app-client-wrapper.tsx:34-44** - Added `isVerified` to `AppClientWrapperProps` interface and function signature

### Result
```
npm run lint      # ✓ 0 errors, 76 warnings
npm run type-check # ✓ 0 errors
```

---

## Fixed GitHub Actions CI Failures

### Problem
GitHub Actions CI was failing on both `Lint & Type Check` and `Unit Tests` jobs with:
```
Error: Dependencies lock file is not found
Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock
```

### Root Cause
1. **`package-lock.json`** - Never generated/committed (npm install wasn't run with lock file creation)
2. **`uploads/` folder** - Not committed because empty folders aren't tracked by Git

### Changes Made

#### 1. Created uploads folder placeholder
- **File**: `c:\Users\seoho\Documents\Corporate Brain\uploads\.gitkeep` (created)
- **Purpose**: Empty placeholder file to ensure uploads folder is tracked by Git

#### 2. Updated .gitignore for uploads
- **File**: `c:\Users\seoho\Documents\Corporate Brain\.gitignore:73-75`
- **Change**: Added exception to allow `.gitkeep` in uploads folder
```gitignore
# uploads - ignore all contents but keep folder structure
/uploads/*
!/uploads/.gitkeep
```

### Next Steps
Run locally to generate `package-lock.json`:
```bash
npm install
```

Then commit both files:
```bash
git add package-lock.json uploads/.gitkeep .gitignore
git commit -m "chore: add lock file and uploads folder for CI"
git push
```

### Files Modified
- `c:\Users\seoho\Documents\Corporate Brain\uploads\.gitkeep` (created)
- `c:\Users\seoho\Documents\Corporate Brain\.gitignore:73-75`

