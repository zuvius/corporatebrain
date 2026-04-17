# Context & Memory Automation System

## Overview

This project implements a comprehensive context and memory automation system for deterministic AI coding. It ensures every file interaction, code change, and analysis is tracked with full paths, line numbers, and detailed documentation.

## Quick Start

### 1. Install Git Hooks (One-time Setup)

```bash
npm run hooks:install
```

This copies the automation hooks from `.github/hooks/` to `.git/hooks/`, enabling automatic memory updates on every commit.

### 2. Verify Setup

```bash
npm run memory:verify
```

Checks that all required files and directories exist.

### 3. Manual Context Update

```bash
npm run memory:update
```

Updates `active-context.md` with current session information.

## Architecture

### Directory Structure

```
.windsurf/
├── rules.md                    # Global AI agent rules
├── README.md                   # This automation system documentation
├── QUICKSTART.md               # Quick reference guide
├── workflows/                  # Standardized workflows
│   ├── memory-update.md        # How to update memory
│   ├── code-edit.md            # How to edit code
│   └── analysis-doc.md         # How to document analysis
├── memory/                     # Active context
│   ├── active-context.md       # Current session state
│   ├── progress.md             # Project milestones
│   ├── decision-log.md         # ADRs
│   ├── tech-spec.md            # Technical specs
│   └── system-patterns.md      # Design patterns
├── context/                    # Historical records
│   ├── changelog/              # Daily changelogs
│   │   └── changelog-YYYY-MM-DD.md
│   ├── implementation/         # Daily implementation logs
│   │   └── implementation-YYYY-MM-DD.md
│   └── analysis/               # Analysis documents
│       └── YYYY-MM-DD-HHMM-topic.md
└── scripts/                    # Automation scripts
    ├── memory-tracker.js       # Core tracking logic
    ├── verify-context.js       # Integrity verification
    └── install-hooks.js        # Git hook installer
```

### Automation Scripts

| Script            | Command                                    | Purpose                   |
| ----------------- | ------------------------------------------ | ------------------------- |
| memory-tracker.js | `node .windsurf/scripts/memory-tracker.js` | Core tracking logic       |
| verify-context.js | `node .windsurf/scripts/verify-context.js` | Integrity verification    |
| install-hooks.js  | `node .windsurf/scripts/install-hooks.js`  | Git hook installation     |
| db-reset.ts       | `npm run db:reset`                         | Database reset with seeds |

### NPM Scripts

```bash
# Memory & Context
npm run memory:update      # Update active context
npm run memory:verify      # Verify integrity
npm run memory:context     # Gather session context
npm run hooks:install      # Install git hooks

# Quality Gates
npm run context:check      # Full verification + type check + lint
npm run type-check         # TypeScript check
npm run lint               # ESLint check
npm run test               # Unit tests
npm run test:e2e           # E2E tests
```

## Workflows

### Code Edit Workflow

Before editing code:

1. **Read relevant files** - Understand current state
2. **Check `.windsurf/workflows/code-edit.md`** - Follow the workflow
3. **Edit with full paths** - Use format: `@c:\Users\seoho\Documents\Corporate Brain\path\file.ts:10-25`
4. **Update memory bank** - Run `npm run memory:update`
5. **Commit with proper message** - Include file paths in commit

### Analysis Documentation

When doing analysis or research:

1. **Create analysis doc**:
   ```bash
   # Manual: .windsurf/context/analysis/YYYY-MM-DD-HHMM-topic.md
   ```
2. **Use template from** `.windsurf/workflows/analysis-doc.md`
3. **Log to changelog**: Update `.windsurf/context/changelog/changelog-YYYY-MM-DD.md`

### Memory Update Workflow

On every interaction:

1. **Check current context**: Read `.windsurf/memory/active-context.md`
2. **After file edits**: Memory auto-updates via git hooks
3. **Manual update**: `npm run memory:update`
4. **Verify**: `npm run memory:verify`

## Git Hooks

### post-commit

Automatically runs after every commit:

- Updates changelog with commit hash
- Updates active-context.md
- Logs changed files with stats

### prepare-commit-msg

Provides commit message template:

```
[type]: [brief description]

[Detailed explanation]

Changes:
- @/path/to/file.ts:10-25 - description

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed

Impact: [UI/API/Performance/Security] - [effect]
```

## File Path Standards

**Format**: `@c:\Users\seoho\Documents\Corporate Brain\path\to\file.ts:start-end`

**Examples**:

```
@c:\Users\seoho\Documents\Corporate Brain\app\page.tsx:10-25
@c:\Users\seoho\Documents\Corporate Brain\lib\utils.ts:1-50
@c:\Users\seoho\Documents\Corporate Brain\components\ui\button.tsx:100-150
```

## Quality Gates

All code changes must pass:

1. **Type Check**: `npm run type-check` - Zero errors
2. **Lint**: `npm run lint` - Zero warnings
3. **Tests**: `npm run test` - All passing
4. **Context Update**: Auto-updates on commit
5. **Verification**: `npm run memory:verify`

## Regressions: ZERO TOLERANCE

### Prohibited

- Breaking changes without documentation
- Console errors
- Visual regressions
- Performance degradation
- Memory leaks
- Blind iterations/guesswork
- Bandage patches

### Required

- Root cause fixes
- Full test coverage
- Type safety
- Documentation updates
- Changelog entries

## Daily Maintenance

### Changelog (`changelog-YYYY-MM-DD.md`)

Updated automatically with:

- All files edited (full paths, line numbers)
- All files touched (read/analysis)
- Commits (hash, message, stats)
- Analysis documents created
- Technical decisions

### Implementation Log (`implementation-YYYY-MM-DD.md`)

Document manually:

- Technical decisions
- Blockers encountered
- Optimizations applied
- References consulted

## Emergency Protocols

### Context Update Failure

If memory/context update fails:

1. **STOP all operations**
2. Run `npm run memory:verify`
3. Fix the root cause
4. Run `npm run memory:update`
5. Verify with `npm run memory:verify`
6. Only then continue

### Git Hook Failure

If hooks fail:

1. Check hook exists: `.git/hooks/post-commit`
2. Reinstall: `npm run hooks:install`
3. Check Node.js is in PATH
4. Verify scripts are executable

## Troubleshooting

### Scripts Not Running

```bash
# Check Node.js version
node --version  # Should be >= 18

# Check scripts exist
ls .windsurf/scripts/

# Make scripts executable (Unix)
chmod +x .windsurf/scripts/*.js
```

### Git Hooks Not Firing

```bash
# Check hooks are installed
ls .git/hooks/

# Reinstall
npm run hooks:install

# Check hook content
cat .git/hooks/post-commit
```

### Memory Files Not Updating

```bash
# Check permissions
ls -la .windsurf/

# Verify manually
npm run memory:update

# Check for errors
node .windsurf/scripts/memory-tracker.js --update 2>&1
```

## Integration with IDE

This system is designed for **Windsurf IDE**:

- `.windsurf/` directory recognized by Windsurf
- Workflows accessible via slash commands
- Rules applied automatically to AI agent
- Context tracked across sessions

## Documentation

### Core Documents

| Document             | Purpose           | Update Frequency          |
| -------------------- | ----------------- | ------------------------- |
| `rules.md`           | Global rules      | Rarely                    |
| `active-context.md`  | Current session   | Every interaction         |
| `progress.md`        | Milestones        | When milestones complete  |
| `decision-log.md`    | ADRs              | When decisions made       |
| `tech-spec.md`       | Technical details | When architecture changes |
| `system-patterns.md` | Design patterns   | When patterns added       |

### Daily Documents

| Document                                      | Purpose           | Created            |
| --------------------------------------------- | ----------------- | ------------------ |
| `changelog/changelog-YYYY-MM-DD.md`           | Daily changes     | Auto on first edit |
| `implementation/implementation-YYYY-MM-DD.md` | Technical details | Manual             |
| `analysis/YYYY-MM-DD-HHMM-*.md`               | Analysis sessions | Manual             |

## Best Practices

1. **Always use full paths** - No relative paths, no shortcuts
2. **Always include line numbers** - Precise change tracking
3. **Always update context** - After every significant action
4. **Always verify** - Run checks before committing
5. **Always document** - Analysis, decisions, patterns
6. **Never skip quality gates** - Type check, lint, test
7. **Never introduce regressions** - Zero tolerance policy
8. **Never guess** - Research, analyze, then implement

## Commands Reference

```bash
# Setup
npm run hooks:install

# Daily Workflow
npm run memory:context      # Check current state
# ... do work ...
npm run memory:update       # Update context
npm run context:check       # Full verification
git commit -m "type: message"
# Memory auto-updates via hook

# Verification
npm run memory:verify       # Check integrity
npm run type-check          # TypeScript
npm run lint                # Linting
npm run test                # Tests
```

## Support

For issues or questions:

1. Check this documentation
2. Run `npm run memory:verify`
3. Review `.windsurf/workflows/` for specific guidance
4. Check `docs/ARCHITECTURE.md` for system overview
