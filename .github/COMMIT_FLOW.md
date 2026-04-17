# GitHub Commit Flow Guide

> Complete workflow from local development to GitHub merge

## Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Local Branch   │────→│  Push to GitHub │────→│  Pull Request   │
│   (Your Work)   │     │  (Remote Branch)│     │   (Review)      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  Merge to Main  │
                                                  │   (Production)  │
                                                  └─────────────────┘
```

## The Complete Flow (Step-by-Step)

### Phase 1: Local Development

#### Step 1: Check Current Branch

```bash
git branch
```

**Output:**

```
* main              <-- You're on main
```

#### Step 2: Create Feature Branch (NEVER work on main directly)

```bash
git checkout -b feat/your-feature-name
```

**Example:**

```bash
git checkout -b feat/user-authentication
```

**Output:**

```
Switched to a new branch 'feat/user-authentication'
```

#### Step 3: Verify Branch Switch

```bash
git branch
```

**Output:**

```
  main
* feat/user-authentication    <-- * shows current branch
```

#### Step 4: Do Your Work

Edit files, write code, make changes...

#### Step 5: Check Changes

```bash
git status
```

**Example Output:**

```
On branch feat/user-authentication
Changes not staged for commit:
        modified:   src/app/page.tsx
        modified:   src/components/login.tsx
        modified:   package.json

Untracked files:
        src/components/auth/
```

#### Step 6: Stage Changes

**Stage everything:**

```bash
git add .
```

**Or stage specific files:**

```bash
git add src/app/page.tsx
git add src/components/
```

#### Step 7: Commit (This runs on your local branch)

```bash
git commit -m "feat: add user authentication

Implemented login with NextAuth credentials provider.
Added login page, logout button, and session handling.

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\src\app\api\auth\[...nextauth]\route.ts:1-50
- @c:\Users\seoho\Documents\Corporate Brain\src\components\login.tsx:1-30
- @c:\Users\seoho\Documents\Corporate Brain\src\components\logout.tsx:1-20

Verification:
- [x] Type check passed
- [x] Lint passed
- [x] Tests passed

Impact: UI - New auth flow, API - New endpoints"
```

**What happens:**

- Commit saved locally on `feat/user-authentication` branch
- Memory bank auto-updates (via git hook)
- NOT on GitHub yet!

---

### Phase 2: Push to GitHub

#### Step 8: Push Local Branch to GitHub

```bash
git push -u origin feat/user-authentication
```

**What this does:**

- `-u` = Set upstream tracking (link local branch to remote)
- Creates `feat/user-authentication` branch on GitHub
- Uploads your commits to GitHub

**Output:**

```
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 8 threads
Compressing objects: 100% (8/8), done.
Writing objects: 100% (9/9), 1.45 KiB/s, done.
Total 9 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
remote:
remote: Create a pull request for 'feat/user-authentication' on GitHub by visiting:
remote:      https://github.com/username/repo/pull/new/feat/user-authentication
remote:
To https://github.com/username/repo.git
 * [new branch]      feat/user-authentication -> feat/user-authentication
branch 'feat/user-authentication' set up to track 'origin/feat/user-authentication'.
```

#### Step 9: Verify on GitHub

Go to: `https://github.com/username/repo/branches`

You should see:

```
Branches
├── main (default) ✓
├── feat/user-authentication ← Your new branch!
└── other-branches...
```

---

### Phase 3: Pull Request (Code Review)

#### Step 10: Create Pull Request

**Option A: Click the link from push output**

The push output shows:

```
https://github.com/username/repo/pull/new/feat/user-authentication
```

Click this link → Opens GitHub PR creation page

**Option B: Manual on GitHub**

1. Go to: `https://github.com/username/repo`
2. Click **"Pull requests"** tab
3. Click **"New pull request"** button
4. Select:
   - **base:** `main` (where changes go)
   - **compare:** `feat/user-authentication` (your changes)
5. Click **"Create pull request"**

#### Step 11: Fill PR Details

```markdown
Title: feat: Add user authentication

Description:
This PR implements user authentication using NextAuth.

Changes:

- Login page with credentials provider
- Logout functionality
- Session management
- Protected routes middleware

Testing:

- [x] Manual testing complete
- [x] Unit tests added
- [x] E2E tests passing

Screenshots:
[Attach screenshots]

Closes #123 (if applicable)
```

#### Step 12: Automated Checks Run

GitHub Actions (if configured) will:

```
✓ Build passing
✓ Tests passing
✓ Lint passing
✓ Type check passing
```

#### Step 13: Code Review

- Team members review the PR
- They comment on code
- You make requested changes:
  ```bash
  # Make fixes on same branch
  git checkout feat/user-authentication
  # ... edit files ...
  git add .
  git commit -m "fix: address review comments"
  git push    # Automatically updates the PR
  ```

---

### Phase 4: Merge to Main

#### Step 14: Merge Pull Request

On GitHub PR page, click:

- **"Merge pull request"** (keeps all commits)
- OR **"Squash and merge"** (combines into 1 commit)

**What happens:**

- Your `feat/user-authentication` changes → merged into `main`
- PR marked as "Merged"
- Branch can be deleted

#### Step 15: Delete Feature Branch (Cleanup)

**On GitHub:**

```
After merge, click "Delete branch" button
```

**Locally:**

```bash
# Switch to main
git checkout main

# Delete local feature branch
git branch -d feat/user-authentication

# Update local main with merged changes
git pull origin main
```

---

## Visual Summary: Complete Flow

```
LOCAL MACHINE                          GITHUB REMOTE

┌─────────────────┐                   ┌─────────────────┐
│  main (frozen)  │                   │  main (default) │
│  Don't touch!   │                   │  Production     │
└────────┬────────┘                   └─────────────────┘
         │                                    ▲
         │ checkout -b                        │
         ▼                                    │
┌─────────────────┐                           │
│ feat/auth       │                           │
│ (your work)     │◄────── work work ────────►│
│                 │                           │
│ • edit files    │                           │
│ • git add       │                           │
│ • git commit    │                           │
│ • memory update │                           │
└────────┬────────┘                           │
         │                                     │
         │ git push -u                         │
         │ origin feat/auth                    │
         ▼                                     │
         ┌─────────────────┐                   │
         │  GitHub creates   │                 │
         │  feat/auth branch │                 │
         └────────┬────────┘                 │
                  │                          │
                  ▼                          │
         ┌─────────────────┐                  │
         │  Pull Request   │────── review ────┤
         │  feat/auth → main │                │
         └────────┬────────┘                 │
                  │ merge                     │
                  ▼                          │
         ┌─────────────────┐                  │
         │  MERGED! 🎉     │──────────────────┘
         │  Changes in main│
         └─────────────────┘
```

---

## Different Scenarios

### Scenario 1: New Repository (First Push)

**You just created repo locally, now connecting to GitHub:**

```bash
# 1. Create repo on GitHub (leave empty, no README)

# 2. Connect local to remote
git remote add origin https://github.com/username/new-repo.git

# 3. Push main branch
git push -u origin main

# 4. Now follow normal flow:
#    create feature branch → work → push → PR → merge
```

### Scenario 2: Existing Repository (Joining Project)

**Project exists on GitHub, you're joining:**

```bash
# 1. Clone repository
git clone https://github.com/username/existing-repo.git
cd existing-repo

# 2. Check you're on main
git branch
# Output: * main

# 3. Get latest changes
git pull

# 4. Create your feature branch
git checkout -b feat/your-first-feature

# 5. Work and follow normal flow...
```

### Scenario 3: Quick Fix (Emergency)

**Urgent bug fix, can commit to main (solo project only):**

```bash
# ⚠️ Only if you're sole developer and no CI/CD auto-deploy!
git checkout main
git pull

# Make quick fix
git add .
git commit -m "fix: urgent bug"
git push
```

⚠️ **Risk**: No code review, no backup, breaks golden rule.

---

## Common Mistakes & Fixes

### Mistake 1: Committed to Main by Accident

```bash
# Oops, committed to main instead of feature branch
git branch
# Output: * main  (should be feat/xyz)

# Fix: Move commit to new branch
git checkout -b feat/xyz          # Create branch (includes commit)
git checkout main                 # Go back to main
git reset --hard HEAD~1          # Remove commit from main
git checkout feat/xyz             # Back to your branch
```

### Mistake 2: Pushed to Wrong Remote Branch

```bash
# Pushed feat/auth but meant to push feat/login

# Rename local branch
git branch -m feat/login

# Delete wrong remote branch
git push origin --delete feat/auth

# Push with correct name
git push -u origin feat/login
```

### Mistake 3: Forgot to Create Branch, Committed to Main

```bash
# You committed directly to main locally (not pushed)

# Create branch with your commit
git checkout -b feat/your-feature

# Reset main to before your commit
git checkout main
git reset --hard HEAD~1

# Now your commit is safely on feat branch
git checkout feat/your-feature
```

---

## Command Summary Table

| Phase       | Command                     | What It Does                  |
| ----------- | --------------------------- | ----------------------------- |
| **Start**   | `git branch`                | Check current branch          |
| **Start**   | `git checkout -b feat/x`    | Create and switch to branch   |
| **Work**    | `git add .`                 | Stage changes                 |
| **Work**    | `git commit -m "msg"`       | Save to local branch          |
| **Work**    | `git status`                | See what's happening          |
| **Push**    | `git push -u origin feat/x` | Upload to GitHub              |
| **Update**  | `git push`                  | Update existing remote branch |
| **Sync**    | `git pull`                  | Get latest changes            |
| **Cleanup** | `git checkout main`         | Switch to main                |
| **Cleanup** | `git pull`                  | Get merged changes            |
| **Cleanup** | `git branch -d feat/x`      | Delete local branch           |

---

## Quick Decision Tree

```
Starting work?
    │
    ├── Is this a new feature?
    │   └── YES → git checkout -b feat/name
    │       └── Work → commit → push → PR → merge
    │
    ├── Is this a bug fix?
    │   └── YES → git checkout -b fix/name
    │       └── Work → commit → push → PR → merge
    │
    ├── Is this documentation?
    │   └── YES → git checkout -b docs/name
    │       └── Work → commit → push → PR → merge
    │
    └── Are you alone and no auto-deploy?
        └── YES → Can commit to main (not recommended)
```

---

## Memory Bank Integration

After every commit (local), the memory bank auto-updates:

```bash
git commit -m "feat: add auth"

# Automatic output:
📚 Updating memory bank...
✓ Logged commit: abc1234 in changelog-YYYY-MM-DD.md
✓ Updated active-context.md
✓ Memory bank updated
```

This happens **before** pushing to GitHub.

---

## Remember the Golden Rule

> **Never commit directly to `main`. Always use feature branches.**

```
❌ WRONG:
main → edit → commit → push → (risky!)

✅ RIGHT:
main → checkout -b feat/x → edit → commit → push → PR → merge
```

---

**Next Steps:**

1. Run `npm run hooks:install` (one-time)
2. Run `git checkout -b feat/test-feature`
3. Make a small change
4. Run `git add . && git commit -m "test: verify flow"`
5. Run `git push -u origin feat/test-feature`
6. Check GitHub for the new branch!
