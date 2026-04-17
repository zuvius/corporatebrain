---
description: Workflow for updating memory bank after any interaction
---

# Memory Update Workflow

## When to Run
- After EVERY file edit (create/modify/delete)
- After EVERY file read/analysis
- After EVERY analysis/brainstorm session
- After EVERY commit/push
- Before starting a new task
- After completing a task

## Steps

### 1. Gather Context
Manually review recent changes in:
- Git status
- Recently modified files
- Current session activity

Collects:
- All files touched in current session
- Git status and recent commits
- Current active context

### 2. Update Active Context
- Edit `.windsurf/memory/active-context.md`
- Record current focus and blockers
- Update file tracking lists

### 3. Update Progress Log
- Edit `.windsurf/memory/progress.md`
- Mark completed tasks
- Add new discovered tasks

### 4. Update Daily Changelog

Edit `context/changelog/changelog-YYYY-MM-DD.md`:

**A. Append chronological entries** (top of file):
```markdown
### [HH:MM:SS] [ACTION_TYPE]: [FILE_PATH]
**Lines**: [start]-[end]
**Type**: [create|modify|delete|read|analyze]
**Reason**: [Why this action was taken]
**Outcome**: [What was achieved or expected]
```

**B. Update "Files Modified Summary"** (bottom of file, after all entries):

Always include this section at the **end** of the changelog:

```markdown
---

## Files Modified Summary (Deduplicated)

| File | Action | Line Ranges | Status |
|------|--------|-------------|--------|
| `@c:\Users\seoho\Documents\Corporate Brain\src\app\page.tsx` | modify | 10-25, 40-55 | ✅ completed |
| `@c:\Users\seoho\Documents\Corporate Brain\lib\utils.ts` | create | 0-50 | ✅ completed |
| `@c:\Users\seoho\Documents\Corporate Brain\components\Button.tsx` | modify | 15-30 | ⏳ in_progress |
```

**Rules for summary table:**
- List each file **only once** (deduplicated)
- Combine all line ranges for same file (e.g., `10-25, 40-55`)
- Sort alphabetically by file path
- Use latest status if file touched multiple times
- Update existing table - don't create duplicate tables

### 5. Update Implementation Log
- Edit `context/implementation/implementation-YYYY-MM-DD.md`
- Document technical decisions
- Record optimization choices

### 6. Verify Updates
Verify all memory files are updated and consistent.

## File Path Format

All file references must use absolute paths:

```
CORRECT:   @c:\Users\seoho\Documents\Corporate Brain\src\app\page.tsx:10-25
INCORRECT: @src/app/page.tsx:10-25
INCORRECT: page.tsx:10-25
```

## Change Entry Format

```markdown
### [HH:MM:SS] [ACTION_TYPE]: [FILE_PATH]

**Lines**: [start]-[end]
**Type**: [create|modify|delete|read|analyze]
**Reason**: [Why this action was taken]
**Outcome**: [What was achieved or expected]
**Status**: [completed|in_progress|pending]
```

## Quick Commands

Type in chat to trigger workflows:
- `/memory-update` - Full memory update
- `/code-edit` - Code editing workflow
- `/analysis-doc` - Analysis documentation
