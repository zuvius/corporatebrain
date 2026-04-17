# Git Commands Reference

> Complete guide to git commands used in this project with memory bank integration

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `git status` | Check current state | Before any operation |
| `git add <file>` | Stage specific file | When ready to commit specific changes |
| `git add .` | Stage all changes | When ready to commit all changes |
| `git commit -m "message"` | Save changes | After staging, before push |
| `git push` | Upload to remote | After successful commit |
| `git pull` | Download updates | Before starting new work |
| `git log --oneline` | View history | Check recent commits |

## Daily Workflow (With Memory Bank)

### Step 1: Check Status

```bash
git status
```

**Output you'll see:**
```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/app/page.tsx
        modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .windsurf/context/changelog/changelog-2026-04-06.md
```

### Step 2: Stage Changes

**Option A: Stage everything**
```bash
git add .
```

**Option B: Stage specific files**
```bash
git add src/app/page.tsx
git add package.json
```

**Option C: Stage by pattern**
```bash
git add *.tsx
git add src/app/
```

### Step 3: Check What's Staged

```bash
git status
```

**Output:**
```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/app/page.tsx
        modified:   package.json
```

### Step 4: Commit (Triggers Auto Memory Update)

**Simple commit:**
```bash
git commit -m "feat: add user authentication"
```

**Detailed commit (recommended):**
```bash
git commit -m "feat: add user authentication

Implemented NextAuth with credentials provider.
Added login/logout buttons and protected routes.

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\src\app\api\auth\[...nextauth]\route.ts:1-50 - auth config
- @c:\Users\seoho\Documents\Corporate Brain\src\components\auth\login-button.tsx:1-30 - UI component

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed

Impact: UI - Added auth flow, API - New endpoints"
```

**What happens automatically after commit:**
```
[main abc1234] feat: add user authentication
📚 Updating memory bank...
✓ Logged commit: abc1234
✓ Updated active-context.md
✅ Memory bank updated
```

### Step 5: Push to Remote

```bash
git push
```

**Or if pushing new branch:**
```bash
git push -u origin feature-name
```

## Before Starting Work

### Pull Latest Changes

```bash
git pull
```

**If you have local changes:**
```bash
git stash          # Save local changes temporarily
git pull           # Get latest
git stash pop      # Re-apply your changes
```

### Check Current Branch

```bash
git branch
```

**Output:**
```
* main
  feature-auth
```

## Branch Management

### Create New Branch

```bash
git checkout -b feature-name
```

**Example:**
```bash
git checkout -b feat/user-authentication
```

### Switch Branches

```bash
git checkout main
git checkout feature-name
```

### List All Branches

```bash
git branch -a
```

### Delete Branch (After Merge)

```bash
git branch -d feature-name    # Safe delete (only if merged)
git branch -D feature-name    # Force delete
```

## Viewing History

### Simple Log

```bash
git log --oneline -10
```

**Output:**
```
abc1234 feat: add user authentication
def5678 fix: button styling
ghi9012 docs: update README
```

### Detailed Log

```bash
git log --stat -3
```

### View Specific Commit

```bash
git show abc1234
```

## Undoing Changes

### Unstage Files (Before Commit)

```bash
git restore --staged src/app/page.tsx
```

**Unstage all:**
```bash
git restore --staged .
```

### Discard Local Changes

```bash
git restore src/app/page.tsx
```

**Discard all changes:**
```bash
git restore .
```

⚠️ **Warning**: This deletes your local changes permanently!

### Amend Last Commit

```bash
git commit --amend -m "new message"
```

**Add forgotten file to last commit:**
```bash
git add forgotten-file.ts
git commit --amend --no-edit
```

## Advanced Commands

### Compare Changes

```bash
# See what changed in working directory
git diff

# See what changed in staged files
git diff --staged

# See what changed in specific file
git diff src/app/page.tsx
```

### Cherry-Pick (Copy commit from another branch)

```bash
git cherry-pick abc1234
```

### Rebase (Clean up commit history)

```bash
git rebase main
```

⚠️ **Warning**: Only rebase branches that haven't been pushed yet!

### Stash (Save changes temporarily)

```bash
git stash push -m "work in progress on auth"
git stash list
git stash pop          # Apply and remove stash
git stash apply        # Apply but keep stash
```

## Branch Management

### Create New Branch

```bash
git checkout -b branch-name
```

**Examples:**
```bash
git checkout -b feat/user-authentication
git checkout -b fix/login-bug
git checkout -b docs/api-update
```

### Switch Between Branches

```bash
# Switch to existing branch
git checkout main
git checkout feat/user-authentication

# Switch and create new branch
git checkout -b feat/new-feature
```

### Check Current Branch

```bash
git branch
```

**Output:**
```
* feat/add-navbar    <-- * shows current branch
  main
  fix/button-style
```

**Quick check:**
```bash
git branch --show-current
# Output: feat/add-navbar
```

### List All Branches

```bash
git branch              # Local branches only
git branch -a           # All branches (local + remote)
git branch -r           # Remote branches only
```

### Delete Branches

```bash
# Safe delete (only if merged)
git branch -d feat/old-feature

# Force delete (even if not merged)
git branch -D feat/abandoned-feature

# Delete remote branch
git push origin --delete feat/old-feature
```

### Rename Branch

```bash
# Rename current branch
git branch -m feat/auth feat/user-authentication
```

### Merge Branch into Main

```bash
git checkout main
git merge feat/user-authentication
```

### Branch Naming Conventions

| Prefix | Use For | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/dark-mode` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `docs/` | Documentation | `docs/readme-update` |
| `refactor/` | Code restructuring | `refactor/api-cleanup` |
| `test/` | Test additions | `test/auth-unit-tests` |
| `chore/` | Maintenance | `chore/update-deps` |

## Git Reset Commands

### Soft Reset (Keep Changes)

**Undo last commit, keep changes staged:**
```bash
git reset --soft HEAD~1
```

**What happens:**
- Commit removed from history
- Changes remain in staging area
- Ready to re-commit

### Mixed Reset (Default - Keep Changes Unstaged)

**Undo last commit, unstage changes:**
```bash
git reset HEAD~1
# or
git reset --mixed HEAD~1
```

**What happens:**
- Commit removed from history
- Changes preserved but unstaged
- Need to `git add` again to re-commit

### Hard Reset (⚠️ DESTROY CHANGES)

**Undo last commit, DELETE all changes:**
```bash
git reset --hard HEAD~1
```

⚠️ **WARNING**: This permanently deletes your changes!

**What happens:**
- Commit removed from history
- All changes permanently deleted
- Files restored to previous commit state
- **Cannot be undone!**

### Reset to Specific Commit

```bash
# Soft reset to commit abc1234
git reset --soft abc1234

# Hard reset to commit abc1234 (DESTRUCTIVE)
git reset --hard abc1234
```

### Unstage Files (Without Resetting)

```bash
# Unstage specific file
git restore --staged src/app/page.tsx

# Unstage all files
git restore --staged .
```

### Discard Local Changes

```bash
# Discard changes in specific file
git restore src/app/page.tsx

# Discard all local changes (DESTRUCTIVE)
git restore .
```

### Reset vs Revert

| Command | Effect | Use When |
|---------|--------|----------|
| `git reset` | Removes commits from history | Local changes not pushed |
| `git revert` | Creates new commit that undoes changes | Changes already pushed to remote |

### Revert (Safe Alternative to Reset)

```bash
# Create new commit that undoes specific commit
git revert abc1234

# Revert without auto-commit
git revert --no-commit abc1234
```

### Emergency Recovery

**If you did a hard reset by mistake:**

```bash
# Check reflog for lost commits
git reflog

# Recover lost commit
git checkout -b recovery-branch abc1234
```

**Example reflog output:**
```
abc1234 HEAD@{0}: reset: moving to HEAD~1
def5678 HEAD@{1}: commit: feat: add authentication
ghi9012 HEAD@{2}: checkout: moving from main to feat/auth
```

### When to Use Each Reset Type

| Scenario | Command |
|----------|---------|
| Fix commit message | `git commit --amend` |
| Undo last commit, re-commit properly | `git reset --soft HEAD~1` |
| Undo last commit, reorganize changes | `git reset HEAD~1` |
| Completely abandon last commit | `git reset --hard HEAD~1` |
| Changes already pushed to remote | `git revert abc1234` |

## Removing/Uninstalling Git (Starting Fresh)

> ⚠️ **DANGER ZONE**: These commands permanently delete Git history. Use with extreme caution.

### Option 1: Nuclear Option - Delete `.git` Entirely

**Removes all history, branches, tags, and remote associations:**

```bash
# Delete the git repository
rm -rf .git

# Reinitialize fresh
git init
git add .
git commit -m "Initial commit"
```

**Effect:**
- All commit history: **GONE**
- All branches: **GONE**
- All tags: **GONE**
- Remote associations: **GONE**
- Files in working directory: **PRESERVED**

---

### Option 2: Reset History But Keep Files (Orphan Branch)

**Keep all files, replace history with single commit:**

```bash
# Create orphan branch (no parent commits)
git checkout --orphan new-main

# Stage everything
git add -A

# Commit
git commit -m "Initial commit"

# Delete old main branch
git branch -D main  # or master

# Rename to main
git branch -m main

# Force push to remote (destroys remote history too)
git push origin main --force
```

**Effect:**
- Files: **PRESERVED**
- History: **REPLACED** with single "Initial commit"
- Remote: **OVERWRITTEN** (collaborators must re-clone)

---

### Option 3: Selective History Rewrite (Remove Specific Files)

**Remove sensitive files from entire history:**

```bash
# Using git-filter-repo (install first: pip install git-filter-repo)
git filter-repo --path secret-file.txt --invert-paths

# Or using filter-branch (older, slower)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch secret-file.txt' \
  HEAD
```

**Effect:**
- Specific files: **PERMANENTLY REMOVED** from all commits
- Other history: **PRESERVED**
- Commit hashes: **CHANGED** (history rewritten)

---

### Aftermath: What Breaks and How to Fix

| What | Status | Fix Required |
|------|--------|--------------|
| **GitHub Repo** | Old history still exists | Delete & recreate repo, or force push |
| **Collaborators** | Their clones invalid | Must delete local repo and re-clone |
| **GitHub Issues/PRs** | Preserved | None (but disconnected from commits) |
| **CI/CD Secrets** | Preserved | Re-verify in GitHub settings |
| **Branch Protection** | Preserved | Re-enable rules after reset |
| **Custom Hooks** | **DELETED** | Re-run `node scripts/install-hooks.js` |
| **Memory Bank** | Git-linked data stale | Run `npm run memory:update` |

---

### Post-Reset Checklist

After starting fresh:

```bash
# 1. Re-add remote (if deleted .git)
git remote add origin https://github.com/username/repo.git

# 2. Push with force (if overwriting existing remote)
git push -u origin main --force

# 3. Reinstall custom hooks
node scripts/install-hooks.js

# 4. Update memory bank
npm run memory:update

# 5. Verify everything works
npm run context:check
```

---

### When to Use Each Approach

| Scenario | Recommended Approach |
|----------|---------------------|
| Commit history is messy, want clean slate | Option 2 (Orphan branch) |
| Committed secrets/passwords | Option 3 (Filter-repo) |
| Repo corrupted, weird git errors | Option 1 (Delete .git) |
| Moving to new Git host | Option 1 or 2 |
| Just want to undo last commit | `git reset --soft HEAD~1` |

---

## Troubleshooting

### Merge Conflicts

When you see:
```
CONFLICT (content): Merge conflict in src/app/page.tsx
Automatic merge failed; fix conflicts and commit the result.
```

**Fix:**
1. Open the conflicted file
2. Look for `<<<<<<< HEAD` markers
3. Edit to keep correct code
4. Remove conflict markers
5. Stage and commit:
```bash
git add src/app/page.tsx
git commit -m "fix: resolve merge conflict"
```

### Push Rejected (Remote has new commits)

**Error:**
```
! [rejected]        main -> main (fetch first)
```

**Fix:**
```bash
git pull --rebase
git push
```

### Forgot to Run Quality Gates

If you committed but didn't run checks:
```bash
npm run context:check    # Run checks
# If errors, fix them
git add .
git commit --amend --no-edit   # Update commit with fixes
```

## Memory Bank Integration

### What Happens Automatically

After every `git commit`:
1. ✅ Commit hash logged in `changelog-YYYY-MM-DD.md`
2. ✅ Files changed logged with stats
3. ✅ `active-context.md` updated
4. ✅ Timestamp recorded

### Manual Memory Update (If Hook Fails)

```bash
npm run memory:update
```

### Verify Memory Bank

```bash
npm run memory:verify
```

## Complete Example Session

```bash
# 1. Start work - pull latest
git pull

# 2. Create feature branch
git checkout -b feat/add-navbar

# 3. Do your work...
# ... edit files ...

# 4. Check what changed
git status
git diff

# 5. Stage changes
git add src/components/navbar.tsx
git add src/styles/navbar.css

# 6. Verify quality gates
npm run context:check

# 7. Commit (triggers memory bank update)
git commit -m "feat: add responsive navbar

Implemented mobile-first navbar with hamburger menu.
Added logo, navigation links, and user menu.

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\src\components\navbar.tsx:1-80
- @c:\Users\seoho\Documents\Corporate Brain\src\styles\navbar.css:1-45

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed
- [x] Mobile responsive tested

Impact: UI - New navigation component"

# 8. Memory bank auto-updates here (via hook)

# 9. Push to remote
git push -u origin feat/add-navbar

# 10. Create PR (on GitHub/GitLab)
```

## Commit Message Format

### Types

| Type | Use For | Example |
|------|---------|---------|
| `feat` | New features | `feat: add dark mode` |
| `fix` | Bug fixes | `fix: button click handler` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor: extract helper functions` |
| `test` | Tests | `test: add unit tests for auth` |
| `chore` | Maintenance | `chore: update dependencies` |

### Structure

```
<type>: <short summary>

<body - what and why>

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\path\file:lines - description

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed

Impact: [UI/API/Performance/Security] - [effect]
```

## Useful Aliases (Optional)

Add to `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --decorate
```

Then use:
```bash
git st      # instead of git status
git co main # instead of git checkout main
git lg      # pretty log graph
```

---

**Remember**: Always run `npm run context:check` before committing!
