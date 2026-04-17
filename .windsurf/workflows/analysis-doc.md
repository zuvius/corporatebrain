---
description: Workflow for documenting analysis and research sessions
---

# Analysis Documentation Workflow

## When to Create Analysis Document

Create a new analysis document when:

- Investigating a bug or issue
- Researching a new feature or approach
- Brainstorming architecture decisions
- Analyzing performance problems
- Evaluating third-party libraries
- Planning refactors

## Document Creation Steps

### 1. Create File

Path format:

```
context/analysis/YYYY-MM-DD-HHMM-[topic].md
```

Example:

```
context/analysis/2024-04-06-1513-performance-optimization.md
```

### 2. Document Template

```markdown
# Analysis: [Topic]

**Date**: YYYY-MM-DD  
**Time**: HH:MM  
**Analyst**: [AI Agent / User]  
**Status**: [in_progress | completed | archived]

## Context

What triggered this analysis? What problem needs solving?

## Current State

Describe the current implementation, relevant files, and existing behavior.

**Relevant Files**:

- @c:\Users\seoho\Documents\Corporate Brain\src\app\file1.ts:10-50 - description
- @c:\Users\seoho\Documents\Corporate Brain\lib\utils\file2.ts:100-150 - description

## Analysis

### Findings

Document discoveries, patterns observed, constraints identified.

### Options Considered

| Option   | Pros | Cons | Decision            |
| -------- | ---- | ---- | ------------------- |
| Option A | ...  | ...  | [selected/rejected] |
| Option B | ...  | ...  | [selected/rejected] |

### Technical Deep Dive

Detailed technical analysis, including:

- Code snippets examined
- Performance metrics
- Security implications
- Scalability concerns

## Recommendation

Clear recommendation with justification.

## Implementation Plan

If analysis leads to implementation:

1. Step 1
2. Step 2
3. Step 3

## References

- Links to relevant docs
- StackOverflow discussions
- GitHub issues
- Internal documentation
```

### 3. Update Changelog

After creating analysis doc, append to `context/changelog/changelog-YYYY-MM-DD.md`:

**A. Chronological entry at top:**

```markdown
### [HH:MM:SS] ANALYZE: context/analysis/YYYY-MM-DD-HHMM-[topic].md

**Topic**: [brief description]
**Files Analyzed**:

- @c:\Users\seoho\Documents\Corporate Brain\src\app\file1.ts:10-50
- @c:\Users\seoho\Documents\Corporate Brain\lib\utils\file2.ts:100-150
```

**B. Update "Files Modified Summary" at bottom:**
Add analysis file to the summary table (if not already present):

```markdown
| `@c:\Users\seoho\Documents\Corporate Brain\context\analysis\...` | create | 0-100 | ✅ completed |
```

### 4. Cross-Reference

If analysis leads to code changes:

- Reference analysis doc in commit message
- Update progress.md with analysis findings
- Link implementation to analysis conclusions

## Analysis Categories

### Bug Analysis

- Root cause identification
- Impact assessment
- Fix options
- Regression prevention

### Feature Analysis

- Requirements clarification
- Technical feasibility
- Integration points
- Scope definition

### Performance Analysis

- Bottleneck identification
- Metrics before/after
- Optimization options
- Trade-off evaluation

### Architecture Analysis

- Design pattern evaluation
- Scalability assessment
- Coupling/cohesion review
- Technical debt identification

## Quick Command

Type `/analysis-doc` in chat to trigger the analysis workflow.

## Archiving

When analysis is complete and no longer active:

1. Change status to `archived`
2. Move to `context/analysis/archived/`
3. Update any references in active-context.md
