# Context Automation Setup Guide

## What Was Created

### 1. Directory Structure

```
.windsurf/                      # Windsurf IDE context directory
├── rules.md                    # Global AI agent rules
├── README.md                   # This automation system documentation
├── workflows/                  # Standardized workflows
│   ├── memory-update.md        # How to update memory bank
│   ├── code-edit.md            # How to edit code properly
│   └── analysis-doc.md         # How to document analysis
├── memory/                     # Active project context
│   ├── active-context.md       # Current session state
│   ├── progress.md             # Project milestones
│   ├── decision-log.md         # Architecture decisions
│   ├── tech-spec.md            # Technical specifications
│   └── system-patterns.md      # Design patterns
├── context/                    # Historical records
│   ├── changelog/              # Daily changelogs (changelog-YYYY-MM-DD.md)
│   ├── implementation/          # Daily implementation logs (implementation-YYYY-MM-DD.md)
│   └── analysis/               # Analysis documents
└── scripts/                    # Automation scripts
    ├── memory-tracker.js       # Core tracking logic
    ├── verify-context.js       # Integrity verification
    └── install-hooks.js        # Git hook installer

docs/                           # Project documentation
└── ARCHITECTURE.md            # System architecture diagrams

.github/hooks/                  # Git hook templates
├── post-commit                # Unix hook
├── post-commit.cmd            # Windows hook
└── prepare-commit-msg         # Commit message template
```

### 2. Automation Features

#### A. File Tracking (Automatic)
- Every file edit logged with full Windows path
- Every file touch (read/analysis) logged
- Line numbers tracked for all changes
- Git commit hashes auto-recorded

#### B. Memory Bank Updates (Semi-Automatic)
- `active-context.md` updates with `npm run memory:update`
- Git hooks auto-update on commit
- Daily changelogs created automatically
- Verification ensures integrity

#### C. Quality Gates (Enforced)
```bash
npm run context:check    # Runs: verify + type-check + lint
```

#### D. Git Integration (Automatic with Setup)
- Post-commit hook updates memory bank
- Commit message templates with proper format
- Changed files auto-logged with stats

### 3. NPM Scripts Added

```json
{
  "memory:update": "Update active context manually",
  "memory:verify": "Verify memory bank integrity",
  "memory:context": "Gather current session context",
  "hooks:install": "Install git hooks",
  "context:check": "Full verification pipeline"
}
```

## How to Use

### Step 1: Install Git Hooks (ONE TIME)

```bash
npm run hooks:install
```

This enables automatic memory updates on every commit.

### Step 2: Verify Setup

```bash
npm run memory:verify
```

Should show all ✅ checks passing.

### Step 3: Daily Workflow

#### Before Coding
1. Read `.windsurf/memory/active-context.md`
2. Check current focus and blockers

#### While Coding
1. Reference files with full paths:
   ```
   @c:\Users\seoho\Documents\Corporate Brain\app\page.tsx:10-25
   ```
2. Follow `.windsurf/workflows/code-edit.md`

#### After Coding
1. Run quality gates:
   ```bash
   npm run context:check
   ```
2. Commit changes:
   ```bash
   git commit -m "feat: description"
   ```
3. Memory bank auto-updates via git hook

### Step 4: Documentation

#### For Analysis
Create `.windsurf/context/analysis/YYYY-MM-DD-HHMM-topic.md` using template from `workflows/analysis-doc.md`

#### For Decisions
Update `.windsurf/memory/decision-log.md` with new ADR

#### For Daily Log
Update `.windsurf/context/implementation/YYYY-MM-DD.md`

## Key Rules

### 1. File Paths (MANDATORY)
**Format**: `@c:\Users\seoho\Documents\Corporate Brain\path\file.ts:start-end`

✅ CORRECT:
```
@c:\Users\seoho\Documents\Corporate Brain\app\page.tsx:10-25
```

❌ INCORRECT:
```
@app/page.tsx:10-25
page.tsx:10-25
./app/page.tsx:10-25
```

### 2. Change Documentation (MANDATORY)
Every edit must be logged in changelog with:
- Full absolute path
- Line numbers (start-end)
- Change type (create/modify/delete)
- Description
- Reason

### 3. Zero Regression Policy (MANDATORY)
- No breaking changes without approval
- No console errors
- No visual regressions
- No performance degradation
- No memory leaks
- No blind iterations

### 4. Quality Gates (MANDATORY)
All commits must pass:
- `npm run type-check` (zero errors)
- `npm run lint` (zero warnings)
- `npm run test` (all passing)
- `npm run memory:verify` (integrity OK)

## Automation Levels

| Task | Automation | Trigger |
|------|------------|---------|
| Changelog entry on commit | ✅ Full | Git post-commit hook |
| active-context.md update | ✅ Full | Git post-commit hook |
| Daily changelog creation | ⚠️ Semi | First file edit of day |
| Analysis doc creation | ❌ Manual | Developer creates file |
| Implementation log | ❌ Manual | Developer updates |
| File touch tracking | ⚠️ Semi | Git status + manual |
| Integrity verification | ✅ Full | `npm run memory:verify` |

## Troubleshooting

### Hook Not Running
```bash
# Check if hook exists
ls .git/hooks/post-commit*

# Reinstall
npm run hooks:install

# Check Node.js in PATH
node --version
```

### Memory Files Not Updating
```bash
# Manual update
npm run memory:update

# Check for errors
node scripts/memory-tracker.js --update 2>&1

# Verify structure
npm run memory:verify
```

### Path Issues
Ensure all file references use Windows absolute paths:
```
@c:\Users\seoho\Documents\Corporate Brain\...
```

## What Gets Tracked

### Automatically
- Git commits (hash, message, timestamp)
- Changed files in commits (+/- stats)
- Git status (staged, modified, untracked)
- Session timestamps

### Semi-Automatically (via Git + Scripts)
- File edits (when committed)
- File modifications (diff stats)
- Active context updates

### Manually (Developer Responsibility)
- File reads/analysis touches
- Line number specifics
- Detailed descriptions
- Analysis documents
- Technical decisions
- Implementation notes

## Next Steps

1. ✅ Review this guide
2. ✅ Install hooks: `npm run hooks:install`
3. ✅ Verify: `npm run memory:verify`
4. ✅ Read `.windsurf/rules.md`
5. ✅ Review `.windsurf/workflows/code-edit.md`
6. ✅ Try editing a file and committing
7. ✅ Check `.windsurf/context/changelog/` for new entry

## Maintenance

### Daily
- Update `.windsurf/memory/active-context.md` with current focus
- Run `npm run memory:update` if hooks aren't working
- Check changelog is being updated

### Weekly
- Review `.windsurf/memory/progress.md`
- Archive completed analysis documents
- Clean up old temporary notes

### Monthly
- Review `.windsurf/memory/decision-log.md`
- Update `.windsurf/memory/tech-spec.md` if architecture changed
- Document new patterns in `system-patterns.md`

## Compliance Checklist

Before each commit, verify:

- [ ] All edited files use full paths in documentation
- [ ] Line numbers included for all changes
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] No console errors
- [ ] No visual regressions
- [ ] Changelog will auto-update on commit
- [ ] Commit message follows template

## Summary

This system ensures:
1. **Deterministic coding** - Every change tracked
2. **Zero regressions** - Quality gates enforced
3. **Full documentation** - Auto + manual logs
4. **Traceability** - Git + context integration
5. **Stability** - Pre-commit verification

Run `npm run hooks:install` now to activate full automation!
