# AGENTS.md - Project-Wide AI Instructions

> This file provides directory-scoped instructions that Cascade automatically applies to ALL interactions in this project.

## Required: Context Reading Protocol

### Before EVERY Response, You MUST:

1. **Read active-context.md** - Check current focus and blockers
   ```
   .windsurf/memory/active-context.md
   ```

2. **Read progress.md** - Understand project status
   ```
   .windsurf/memory/progress.md
   ```

3. **Read today's changelog** - Know recent changes
   ```
   context/changelog/changelog-YYYY-MM-DD.md
   ```

4. **Read today's implementation log** - Know technical decisions
   ```
   context/implementation/implementation-YYYY-MM-DD.md
   ```

5. **Read today's analysis** - Know research/brainstorming
   ```
   Check context/analysis/ for today's analysis files
   ```

### After EVERY Action, You MUST:

1. **Update active-context.md** - Record new state
2. **Append to changelog** - Log the change with full paths

## Core Rules (Non-Negotiable)

### 1. File Path Format (MANDATORY)
**ALWAYS** use Windows absolute paths with `@` prefix and line numbers:
```
CORRECT:   @c:\Users\seoho\Documents\Corporate Brain\src\app\page.tsx:10-25
INCORRECT: @src/app/page.tsx:10-25
INCORRECT: page.tsx:10-25
INCORRECT: c:/Users/seoho/... (forward slashes)
```

### 2. Change Documentation (MANDATORY)
Every file interaction must be documented:
- Full path with line numbers
- Type: create/modify/delete/read/analyze
- Description and reason
- Expected outcome

### 3. Zero Regression Policy (MANDATORY)
- No breaking changes
- No console errors
- No visual regressions
- No performance degradation
- No memory leaks
- No blind iterations
- No guessworks
- No runtime behaviors changes

### 4. Quality Gates (MANDATORY)

All commits must pass:
```bash
npm run type-check  # Zero errors
npm run lint        # Zero warnings
npm run test        # All pass
```

### 5. Testing Requirements (MANDATORY)
Every new feature must include:
- **Unit tests** for business logic (`lib/**/*.test.ts`)
- **Component tests** for UI components (`components/**/*.test.tsx`)
- **E2E tests** for critical user flows (`tests/e2e/*.spec.ts`)

Minimum coverage thresholds:
- Statements: 70%
- Branches: 65%
- Functions: 70%
- Lines: 70%

See `c:\Users\seoho\Documents\Corporate Brain\docs\TESTING.md` for complete testing guide.

## Memory Bank Quick Reference

| File | Purpose | When to Read | When to Update |
|------|---------|--------------|----------------|
| `memory/active-context.md` | Current session | Every response | After every action |
| `memory/progress.md` | Milestones | Planning | Milestone complete |
| `memory/decision-log.md` | ADRs | Architecture decisions | New decisions |
| `memory/tech-spec.md` | Technical details | Implementation | Spec changes |
| `memory/system-patterns.md` | Patterns | Coding | New patterns |
| `context/changelog/changelog-YYYY-MM-DD.md` | Daily changes | Context | After every edit |
| `context/implementation/implementation-YYYY-MM-DD.md` | Technical notes | Deep dives | Manual updates |

## Workflow Triggers

Type in chat to invoke:
- `/memory-update` - Run memory update workflow
- `/code-edit` - Run code editing workflow  
- `/analysis-doc` - Run analysis documentation workflow

## Emergency Stop

If ANY of these occur:
- Context update fails
- Type check fails
- Tests fail unexpectedly
- Memory verification fails

**STOP IMMEDIATELY** - Fix root cause before proceeding.

## Documentation Requirements

Every code change must update:
1. Inline comments for complex logic
2. Function documentation (JSDoc/TSDoc)
3. Memory bank (active-context.md, changelog)
4. Architecture docs if patterns changed
