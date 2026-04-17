# Context & Memory Automation - Quick Start

## TL;DR - Activate Now

```bash
# 1. Install git hooks (one-time)
npm run hooks:install

# 2. Verify everything works
npm run memory:verify

# 3. Done! Memory bank auto-updates on every commit
```

## Your Requirements → Implementation Mapping

| Your Requirement | Implementation | File/Location |
|------------------|----------------|---------------|
| (a) Full paths for edited files | ✅ `memory-tracker.js` logs all with `path.resolve()` | `.windsurf/context/changelog/changelog-YYYY-MM-DD.md` |
| (b) Full paths for touched files | ✅ `--log-touch` command + changelog sections | `.windsurf/context/changelog/changelog-YYYY-MM-DD.md` |
| (c) Detailed what's done/changed | ✅ Changelog entries with descriptions + implementation logs | `.windsurf/context/implementation/implementation-YYYY-MM-DD.md` |
| (d) Auto-analysis docs | ✅ Template + manual creation workflow | `.windsurf/workflows/analysis-doc.md` |
| (e) Commit hashes with timestamps | ✅ `post-commit` hook extracts from `git log` | Auto-logged in changelog |
| (f) Deterministic, no regressions | ✅ Quality gates: type-check + lint + test | `npm run context:check` |
| (g) Stable UI/API/runtime | ✅ Enforced via rules.md + commit verification | `.windsurf/rules.md` |
| (i) Proper commit messages | ✅ `prepare-commit-msg` hook with template | `.github/hooks/prepare-commit-msg` |
| (j) Zero complacency | ✅ Mandatory checks before commit | Pre-commit workflow |
| (k) Daily changelog | ✅ Auto-created + git hook updates | `.windsurf/context/changelog/changelog-YYYY-MM-DD.md` |
| (l) Daily implementation log | ✅ Template ready for manual use | `.windsurf/context/implementation/implementation-YYYY-MM-DD.md` |
| (m) Optimized code | ✅ Rules enforce enterprise quality | `.windsurf/rules.md` |
| (n) No bandage code | ✅ Root cause analysis required | `.windsurf/workflows/code-edit.md` |
| (o) Well documented | ✅ JSDoc/TSDoc + inline comments required | `.windsurf/rules.md` |
| (p) Brief tech/arch docs | ✅ `tech-spec.md` + `system-patterns.md` | `.windsurf/memory/` |
| (q) Diagrams/flow charts | ✅ Mermaid diagrams in ARCHITECTURE.md | `docs/ARCHITECTURE.md` |

## File Structure Overview

```
.windsurf/
├── rules.md                 ← Global AI agent rules (read first!)
├── README.md                ← Full automation documentation
├── workflows/
│   ├── memory-update.md     ← How to update memory
│   ├── code-edit.md         ← How to edit code (MUST READ)
│   └── analysis-doc.md      ← How to document analysis
├── scripts/
│   ├── memory-tracker.js    ← Core automation logic
│   ├── verify-context.js    ← Integrity checker
│   └── install-hooks.js     ← Hook installer
docs/
├── ARCHITECTURE.md          ← System diagrams (Mermaid)
└── CONTEXT_SETUP.md         ← Setup guide
```

## Daily Commands

```bash
# Check current context
cat .windsurf/memory/active-context.md

# Full verification before committing
npm run context:check

# Manual context update (if hooks fail)
npm run memory:update

# Verify integrity
npm run memory:verify
```

## Critical Rules

1. **Always use FULL PATHS**: `@c:\Users\seoho\Documents\Corporate Brain\file.ts:10-25`
2. **Always pass quality gates**: `npm run context:check` before commit
3. **Always update context**: Auto via hooks or manual with `npm run memory:update`
4. **Never skip documentation**: Every change must be recorded
5. **Zero regressions**: Breaking changes = STOP and fix properly

## Automation Flow

```
You edit file → Git tracks changes → You commit → 
post-commit hook fires → memory-tracker.js runs → 
Changelog updated with hash + files + timestamps → 
active-context.md refreshed
```

## Next Actions

1. ✅ Review this quickstart
2. ✅ Run `npm run hooks:install`
3. ✅ Run `npm run memory:verify`
4. ✅ Read `.windsurf/rules.md`
5. ✅ Read `.windsurf/workflows/code-edit.md`
6. ✅ Make a test edit and commit
7. ✅ Check `.windsurf/context/changelog/changelog-YYYY-MM-DD.md` for new entry

## Emergency Commands

```bash
# If something breaks
npm run memory:verify        # Check what's wrong
npm run hooks:install        # Reinstall hooks
npm run memory:update        # Force manual update

# If all else fails
node .windsurf/scripts/memory-tracker.js --update
```

## Success Criteria

✅ After commit, changelog shows:
- Commit hash (e.g., `abc1234`)
- Timestamp (e.g., `2026-04-06T15:13:00`)
- File paths with full absolute Windows paths
- Line numbers for all changes

✅ Quality gates pass:
- `npm run type-check` → 0 errors
- `npm run lint` → 0 warnings
- `npm run test` → all pass
- `npm run memory:verify` → all ✅

---

**Ready? Run `npm run hooks:install` now!**
