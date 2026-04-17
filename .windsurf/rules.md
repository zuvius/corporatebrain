---
description: Global rules for AI agent context and memory management
---

# AI Agent Context & Memory Rules

## Core Principles

1. **Deterministic Execution**: All code changes must be deterministic, traceable, and regression-free
2. **Zero Guesswork**: Never implement blind iterations or bandage patches
3. **Documentation First**: Every change must be documented before implementation
4. **Context Preservation**: Full file paths and change history must be maintained

## File Tracking Requirements

### Edited Files (MUST)

- Full absolute file path
- Line numbers of changes (start-end)
- Type of change (create/modify/delete)
- Reason for change
- Expected outcome

### Touched Files (MUST)

- Full absolute file path
- Why file was accessed (read/analysis/reference)
- Determination: edited vs. read-only

### Untracked Files (MUST NOT)

- Never leave files untracked
- All file interactions logged

## Change Documentation Format

```
@/absolute/path/to/file.ts:10-25
[CHANGE_TYPE]: [DESCRIPTION]
[REASON]: [WHY]
[EXPECTED]: [OUTCOME]
[STATUS]: [pending/in_progress/completed]
```

## Memory Bank Structure

```
.windsurf/
├── memory/
│   ├── active-context.md      # Current session context
│   ├── progress.md            # Overall project progress
│   ├── decision-log.md        # Architecture decisions
│   ├── tech-spec.md           # Technical specifications
│   └── system-patterns.md     # Design patterns used
├── context/
│   ├── changelog/
│   │   └── changelog-YYYY-MM-DD.md      # Daily changelogs
│   └── implementation/
│       └── implementation-YYYY-MM-DD.md      # Daily implementation logs
└── workflows/
    ├── memory-update.md       # Memory update workflow
    ├── code-edit.md           # Code editing workflow
    └── analysis-doc.md        # Analysis documentation workflow
```

## Automatic Triggers

### On Code Edit

1. Record file path and line numbers
2. Update active-context.md
3. Append to today's changelog
4. Document expected outcome

### On Analysis/Brainstorm

1. Create context-file-name.md in context/
2. Add to changelog under "Analysis" section
3. Cross-reference related files

### On Commit/Push

1. Extract commit hash and timestamp
2. Update decision-log.md if architectural
3. Update progress.md with completion status

## Stability Guarantees

### UI Stability

- Visual regressions: PROHIBITED
- Layout shifts: PROHIBITED
- Style changes: Must be intentional and documented

### API Stability

- Endpoint changes: Documented in decision-log.md
- Response format: Backward compatible or versioned
- Breaking changes: Explicit approval required

### Runtime Behavior

- No console errors post-change
- No performance regressions
- No memory leaks

## Commit Message Format

```
[type]: [brief description]

[Detailed explanation of changes]

Files modified:
- @/path/to/file.ts:10-25 - description
- @/path/to/file2.ts:30-45 - description

Impact:
- [UI/API/Performance/Security] - [effect]

Closes: [issue/ticket if applicable]
```

Types: feat, fix, docs, refactor, test, chore, perf, security

## Daily Maintenance

### Changelog (YYYY-MM-DD.md)

- Date and session ID
- All files touched (full paths)
- All files edited (full paths with line numbers)
- Analysis/brainstorm documents created
- Commits made (hash + message summary)

### Implementation Log (YYYY-MM-DD.md)

- Technical decisions made
- Blockers encountered and resolved
- Performance optimizations
- Code patterns implemented

## Code Quality Standards

1. **No Bandage Code**: Every fix addresses root cause
2. **Enterprise Grade**: Production-ready, reviewed quality
3. **Optimized**: No unnecessary computations, efficient algorithms
4. **Well-Documented**: JSDoc/TSDoc for all functions, inline comments for complex logic
5. **Type-Safe**: Full TypeScript coverage, no `any` types

## Documentation Requirements

### For Every Component

- Purpose and responsibility
- Props/Inputs with types
- Side effects
- Dependencies

### For Every Function

- Description
- Parameters with types
- Return type
- Example usage

### Architecture Diagrams

- System overview (Mermaid)
- Data flow diagrams
- Component hierarchies
- API sequence diagrams

## Prohibited Practices

1. Blind iterations without analysis
2. Undocumented code changes
3. File interactions without logging
4. Incomplete or missing file paths
5. Breaking changes without approval
6. Performance regressions
7. Memory leaks
8. Console errors in production
9. Bandage/patch code
10. Complacency in documentation

## Emergency Protocols

If context/memory update fails:

1. Halt all operations
2. Diagnose root cause
3. Fix update mechanism before proceeding
4. Never proceed with broken context tracking
