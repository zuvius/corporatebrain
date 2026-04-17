---
description: Workflow for code edits with full context tracking
---

# Code Edit Workflow

## Pre-Edit Phase

### 1. Analysis (REQUIRED)
- Read all relevant files
- Understand current implementation
- Identify dependencies and side effects
- Document in `context/analysis/[timestamp]-[feature].md`

### 2. Planning (REQUIRED)
- Define exact changes needed
- Identify all affected files
- Plan rollback strategy
- Document expected outcomes

### 3. Stability Check (REQUIRED)
- Verify UI will remain stable
- Verify API contracts remain valid
- Verify no runtime regressions
- Document impact assessment

## Edit Phase

### 4. Implementation
- Make ONE focused change at a time
- Use multi_edit for related changes across files
- Follow existing code style exactly
- Add/update documentation inline

### 5. Verification
- Run type checker: `npm run type-check`
- Run linter: `npm run lint`
- Run tests: `npm run test`
- Verify no console errors

### 6. Documentation
- Update JSDoc/TSDoc comments
- Update architecture docs if needed
- Update API documentation if endpoints changed
- Update `context/changelog/changelog-YYYY-MM-DD.md` with:
  - Chronological entries at top
  - **Files Modified Summary table at bottom** (deduplicated, sorted)

## Post-Edit Phase

### 7. Memory Update (MANDATORY)

Run `/memory-update` in chat or manually update:
- active-context.md with new state
- progress.md with completion status
- changelog with file paths and line numbers
- decision-log.md if architectural changes

### 8. Commit (MANDATORY)
Format:
```
[type]: [brief description]

Detailed explanation of what and why.

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\src\app\page.tsx:10-25 - description
- @c:\Users\seoho\Documents\Corporate Brain\components\ui\button.tsx:30-45 - description

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed
- [x] No console errors

Impact: [UI/API/Performance/Security] - [effect]
```

## Regression Prevention Checklist

- [ ] No files modified beyond intended scope
- [ ] All affected dependencies updated
- [ ] No breaking changes to public APIs
- [ ] No visual regressions in UI
- [ ] No new console errors
- [ ] No performance degradation
- [ ] No memory leaks introduced
- [ ] All tests passing
- [ ] Type safety maintained

## Emergency Stop

If ANY of the following occur:
1. Memory/context update fails
2. Tests fail unexpectedly
3. Build breaks
4. Console errors appear
5. UI breaks

**STOP IMMEDIATELY**:
1. Do NOT proceed with more changes
2. Fix the root cause
3. Re-verify ALL checks
4. Only then continue

## Code Quality Gates

### Gate 1: Type Safety
```bash
npm run type-check
```
Must pass with zero errors.

### Gate 2: Lint Compliance
```bash
npm run lint
```
Must pass with zero warnings.

### Gate 3: Test Coverage
```bash
npm run test
```
Must pass with no failures.

### Gate 4: E2E Verification (if applicable)
```bash
npm run test:e2e
```
Must pass for user-facing changes.

## Documentation Standards

Every code edit must update:
1. Inline comments for complex logic
2. Function documentation (JSDoc/TSDoc)
3. Memory bank (active-context.md, progress.md)
4. Changelog (YYYY-MM-DD.md)
5. Architecturchangelog-e docs if patterns changed
