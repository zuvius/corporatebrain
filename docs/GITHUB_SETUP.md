# GitHub Setup Guide for Windsurf IDE

Complete guide for setting up GitHub integration, automated syncing, and CI/CD pipeline for the Corporate Brain project.

---

## Table of Contents

1. [Initial GitHub Repository Setup](#1-initial-github-repository-setup)
2. [Windsurf IDE Git Configuration](#2-windsurf-ide-git-configuration)
3. [SSH Authentication Setup](#3-ssh-authentication-setup)
4. [Daily Git Workflow in Windsurf](#4-daily-git-workflow-in-windsurf)
5. [Daily Git Workflow in VS Code](#5-daily-git-workflow-in-vs-code)
6. [Auto Commit Message Generation](#6-auto-commit-message-generation)
7. [CI/CD Pipeline Setup](#7-cicd-pipeline-setup)
8. [Branch Protection Rules](#8-branch-protection-rules)
9. [Automated Deployment](#9-automated-deployment)
10. [Troubleshooting](#troubleshooting)

---

## 1. Initial GitHub Repository Setup

### Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `corporate-brain` (or your preferred name)
3. **Description:** `Sovereign Context Fabric - Enterprise AI Knowledge Platform`
4. **Visibility:** Private (recommended for corporate projects)
5. **Initialize with:**
   - ✅ Add a README (you can replace later)
   - ✅ Add .gitignore (select **Node** template)
   - ✅ Choose a license (e.g., MIT, or proprietary)
6. Click **Create repository**

### Step 2: Connect Local Project to GitHub

**Option A: If you already have local code (most common):**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Corporate Brain setup"

# Connect to GitHub (replace with your actual URL)
git remote add origin git@github.com:your-username/corporate-brain.git

# Push to main branch
git push -u origin main
```

**Option B: If starting fresh from GitHub:**

```bash
# Clone the repository
git clone git@github.com:your-username/corporate-brain.git

cd corporate-brain

# Copy your existing project files here, then:
git add .
git commit -m "Initial project setup"
git push
```

---

## 2. Windsurf IDE Git Configuration

### Built-in Git Integration

Windsurf has **native Git integration** - no extra extensions needed.

### Access Git Panel

1. **Click the Source Control icon** in the left sidebar (branch icon)
2. Or press `Ctrl+Shift+G` (Windows/Linux) / `Cmd+Shift+G` (Mac)

### Configure Git Identity (First-time setup)

```bash
# Set your name and email (used in commits)
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable automatic rebasing on pull (cleaner history)
git config --global pull.rebase true

# Set editor for commit messages (optional)
git config --global core.editor "code --wait"
```

### Windsurf Git Settings

1. Open **Settings** (`Ctrl+,`)
2. Search for "Git"
3. Recommended settings:
   - ✅ **Enable Git**: Checked
   - ✅ **Autofetch**: Checked (fetches remote changes automatically)
   - ✅ **Confirm Sync**: Unchecked (for seamless pushing)
   - ✅ **Confirm Force Push**: Checked (safety)
   - **Default Branch**: `main`

---

## 3. SSH Authentication Setup

SSH keys provide **passwordless, secure authentication** to GitHub.

### Step 1: Check for Existing SSH Keys

```bash
# List SSH keys
ls -la ~/.ssh/

# Look for files like:
# id_rsa (older format)
# id_ed25519 (recommended, modern)
# id_ecdsa
```

### Step 2: Generate New SSH Key (if needed)

```bash
# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "your.email@company.com"

# If your system doesn't support Ed25519, use RSA:
# ssh-keygen -t rsa -b 4096 -C "your.email@company.com"

# When prompted:
# File to save: Press Enter (accept default)
# Passphrase: Enter a secure passphrase (or press Enter for none)
```

### Step 3: Add SSH Key to SSH Agent

**On macOS:**

```bash
# Start ssh-agent
 eval "$(ssh-agent -s)"

# Add key to agent
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

**On Windows (PowerShell as Admin):**

```powershell
# Start ssh-agent
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# Add key
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

**On Linux:**

```bash
# Start ssh-agent
 eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519
```

### Step 4: Add SSH Key to GitHub

1. Copy the public key:

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard

# Linux
 cat ~/.ssh/id_ed25519.pub
# Then copy manually
```

2. Go to GitHub → **Settings** → **SSH and GPG keys**
3. Click **New SSH key**
4. **Title:** `Windsurf IDE - [Your Computer Name]`
5. **Key type:** Authentication Key
6. **Key:** Paste the copied key
7. Click **Add SSH key**

### Step 5: Test Connection

```bash
ssh -T git@github.com

# Expected output:
# Hi username! You've successfully authenticated...
```

---

## 4. Daily Git Workflow in Windsurf

### Typical Development Flow

```
Pull latest → Create branch → Make changes → Commit → Push → Pull Request
```

### Step-by-Step in Windsurf

#### 1. Pull Latest Changes (Start of Day)

**Using UI:**

- Click the **Refresh** icon in Source Control panel
- Or click **Pull** in the bottom status bar

**Using Terminal:**

```bash
git pull origin main
```

#### 2. Create a Feature Branch

**Using UI:**

1. Click branch name in bottom-left status bar
2. Select **Create new branch**
3. Name it: `feature/description` or `fix/bug-description`

**Using Terminal:**

```bash
# Create and switch to new branch
git checkout -b feature/user-authentication
```

**Branch Naming Conventions:**

- `feature/description` - New features
- `fix/bug-description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `hotfix/critical-fix` - Production fixes

#### 3. Make Changes and Commit

**Stage Changes:**

1. Edit files in Windsurf
2. Go to **Source Control** panel (`Ctrl+Shift+G`)
3. See changed files under **Changes**
4. Hover over file → Click **+** to stage (or click **+** next to "Changes" to stage all)

**Write Commit Message:**

1. Type message in the input box above the checkmark icon
2. Use conventional commits format:
   ```
   feat: add user authentication
   fix: resolve database connection timeout
   docs: update deployment guide
   refactor: simplify API handlers
   test: add unit tests for auth
   ```

**Commit:**

- Press `Ctrl+Enter` or click the **✓** checkmark icon

**Using Terminal:**

```bash
# Stage specific files
git add filename.ts

# Stage all changes
git add .

# Commit with message
git commit -m "feat: add user authentication flow"
```

#### 4. Push to GitHub

**Using UI:**

1. Look for **Publish Branch** button in Source Control panel
2. Or click **...** menu → **Push**

**Using Terminal:**

```bash
# First push of new branch
git push -u origin feature/user-authentication

# Subsequent pushes
git push
```

#### 5. Create Pull Request

1. Go to GitHub repository
2. Click **Pull requests** → **New pull request**
3. Select your feature branch → Compare with `main`
4. Fill in:
   - **Title:** Clear summary of changes
   - **Description:** What changed, why, testing done
5. Click **Create pull request**

#### 6. After Merge: Clean Up

```bash
# Switch back to main
git checkout main

# Pull merged changes
git pull origin main

# Delete local branch
git branch -d feature/user-authentication

# Delete remote branch
git push origin --delete feature/user-authentication
```

### Keyboard Shortcuts in Windsurf

| Action              | Windows/Linux                     | macOS                            |
| ------------------- | --------------------------------- | -------------------------------- |
| Open Source Control | `Ctrl+Shift+G`                    | `Cmd+Shift+G`                    |
| Stage file          | `Ctrl+Enter` (on file)            | `Cmd+Enter`                      |
| Commit              | `Ctrl+Enter`                      | `Cmd+Enter`                      |
| Push                | `Ctrl+Shift+P` → type "Git: Push" | `Cmd+Shift+P` → type "Git: Push" |
| Pull                | `Ctrl+Shift+P` → type "Git: Pull" | `Cmd+Shift+P` → type "Git: Pull" |

---

## 5. Daily Git Workflow in VS Code

### Typical Development Flow

```
Pull latest → Create branch → Make changes → Commit → Push → Pull Request
```

### Step-by-Step in VS Code

#### 1. Pull Latest Changes (Start of Day)

**Using UI:**

- Open **Source Control** panel (`Ctrl+Shift+G`)
- Click the **...** (More Actions) menu → **Pull**
- Or use Command Palette: `Ctrl+Shift+P` → type "Git: Pull"

**Using Terminal (VS Code Integrated):**

```bash
# Open terminal: Ctrl+` (backtick)
git pull origin main
```

#### 2. Create a Feature Branch

**Using UI:**

1. Click branch name in **bottom-left status bar**
2. Select **Create new branch...**
3. Name it: `feature/description` or `fix/bug-description`
4. Press Enter

**Using Command Palette:**

1. `Ctrl+Shift+P` → type "Git: Create Branch"
2. Enter branch name
3. Press Enter

**Using Terminal:**

```bash
# Create and switch to new branch
git checkout -b feature/user-authentication
```

**Branch Naming Conventions:**

- `feature/description` - New features
- `fix/bug-description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `hotfix/critical-fix` - Production fixes

#### 3. Make Changes and Commit

**Stage Changes:**

1. Edit files in VS Code
2. Go to **Source Control** panel (`Ctrl+Shift+G`)
3. See changed files under **Changes**
4. Hover over file → Click **+** to stage (or click **+ Changes** to stage all)
5. Or click checkbox next to each file

**Write Commit Message:**

1. Type message in the **Message** input box at the top
2. Use conventional commits format:
   ```
   feat: add user authentication
   fix: resolve database connection timeout
   docs: update deployment guide
   refactor: simplify API handlers
   test: add unit tests for auth
   ```

**Commit:**

- Press `Ctrl+Enter` or click the **✓** checkmark icon
- Or use Command Palette: `Ctrl+Shift+P` → "Git: Commit"

**Using Terminal:**

```bash
# Stage specific files
git add filename.ts

# Stage all changes
git add .

# Commit with message
git commit -m "feat: add user authentication flow"
```

#### 4. Push to GitHub

**Using UI:**

1. Look for **Publish Branch** button in Source Control panel (for new branches)
2. Or click **...** menu → **Push**
3. Or click the **sync icon** (circular arrows) in the status bar

**Using Command Palette:**

- `Ctrl+Shift+P` → type "Git: Push"

**Using Terminal:**

```bash
# First push of new branch
git push -u origin feature/user-authentication

# Subsequent pushes
git push
```

#### 5. Create Pull Request

**Option A: Using VS Code with GitHub Extension**

1. Install **GitHub Pull Requests and Issues** extension
2. Open **GitHub** panel from the sidebar
3. Click **Create Pull Request**
4. Fill in title and description
5. Click **Create**

**Option B: Using Browser**

1. Go to GitHub repository
2. Click **Pull requests** → **New pull request**
3. Select your feature branch → Compare with `main`
4. Fill in:
   - **Title:** Clear summary of changes
   - **Description:** What changed, why, testing done
5. Click **Create pull request**

#### 6. After Merge: Clean Up

**Using VS Code:**

1. Switch to main: Click branch name in status bar → Select **main**
2. Pull latest: **...** menu → **Pull**
3. Delete branch: **...** menu → **Delete Branch**

**Using Terminal:**

```bash
# Switch back to main
git checkout main

# Pull merged changes
git pull origin main

# Delete local branch
git branch -d feature/user-authentication

# Delete remote branch
git push origin --delete feature/user-authentication
```

### VS Code Git Settings

**Open Settings:** `Ctrl+,`

**Recommended Git Settings:**

1. Search "git" and configure:
   - ✅ **Git: Enabled** - Checked
   - ✅ **Git: Autofetch** - Checked (fetches remote changes automatically)
   - ✅ **Git: Confirm Sync** - Unchecked (for seamless pushing)
   - ✅ **Git: Confirm Force Push** - Checked (safety)
   - **Git: Default Branch** - `main`
   - ✅ **Git: Show Commit Input** - Checked
   - ✅ **Git: Smart Commit Changes** - Checked

2. Search "gitlens" (if using GitLens extension):
   - Enable blame annotations
   - Show line history

### Essential VS Code Extensions for Git

**Recommended Extensions:**

1. **GitLens** - Supercharge Git
   - Git blame annotations
   - Commit history
   - Branch comparison

2. **GitHub Pull Requests and Issues**
   - Create PRs from VS Code
   - Review PRs
   - View issues

3. **Git History**
   - Visual git history graph
   - File history

4. **Conventional Commits**
   - Auto-complete for commit types
   - Conventional commit linting

**Install via Command Palette:**

```
Ctrl+Shift+P → Extensions: Install Extensions
```

### Keyboard Shortcuts in VS Code

| Action               | Windows/Linux                         | macOS                                |
| -------------------- | ------------------------------------- | ------------------------------------ |
| Open Source Control  | `Ctrl+Shift+G`                        | `Cmd+Shift+G`                        |
| Open Terminal        | `` Ctrl+` ``                          | `` Cmd+` ``                          |
| Stage file           | Click **+** next to file              | Click **+** next to file             |
| Stage all            | Hover over "Changes" → **+**          | Hover over "Changes" → **+**         |
| Commit               | `Ctrl+Enter`                          | `Cmd+Enter`                          |
| Push                 | `Ctrl+Shift+P` → "Git: Push"          | `Cmd+Shift+P` → "Git: Push"          |
| Pull                 | `Ctrl+Shift+P` → "Git: Pull"          | `Cmd+Shift+P` → "Git: Pull"          |
| Create branch        | `Ctrl+Shift+P` → "Git: Create Branch" | `Cmd+Shift+P` → "Git: Create Branch" |
| Open Command Palette | `Ctrl+Shift+P`                        | `Cmd+Shift+P`                        |

### VS Code Source Control View Breakdown

```
┌─────────────────────────────────────┐
│  Message [Commit Ctrl+Enter]      │  ← Commit message input
├─────────────────────────────────────┤
│  ✓ Changes (2)                     │  ← Unstaged changes
│    + file1.ts                      │
│    + file2.ts                      │
├─────────────────────────────────────┤
│  Staged Changes (1)                │  ← Staged for commit
│    ✓ file3.ts                     │
├─────────────────────────────────────┤
│  ... (More Actions)                │  ← Pull/Push/Branch ops
└─────────────────────────────────────┘
```

### VS Code Integrated Terminal

**Open Terminal:**

- `` Ctrl+` `` (backtick)
- Or menu: **View** → **Terminal**

**Advantages:**

- Same directory as current file
- Split terminal: Click **+** icon
- Multiple terminals: Use dropdown

---

## 6. Auto Commit Message Generation

Several options exist to auto-generate relevant commit messages based on your staged changes.

### Option A: Smart Git Hook (Recommended)

A git hook that analyzes your changes and suggests conventional commit messages.

**Setup:**

1. The hook file is already created at `.git/hooks/prepare-commit-msg`

2. Make it executable (Git Bash/WSL/macOS/Linux):

```bash
chmod +x .git/hooks/prepare-commit-msg
```

**How it works:**

- When you run `git commit` without a message, the hook analyzes staged files
- Detects file types (`.ts`, `.tsx`, `.md`, etc.)
- Identifies scope (`api`, `db`, `ui`, `auth`, `ai`, `app`)
- Suggests commit type (`feat`, `fix`, `docs`, `test`, `ci`, `chore`)
- Pre-fills the commit message editor

**Example workflow:**

```bash
git add .
git commit  # Opens editor with suggested message like: feat(api): add or update API endpoint
# Edit the suggestion, save and close editor
```

### Option B: Using GitHub Copilot in Windsurf

Windsurf supports GitHub Copilot which can suggest commit messages.

1. Install GitHub Copilot extension in Windsurf
2. Stage your changes
3. In the commit message box, type `/` or wait for Copilot suggestion
4. Press `Tab` to accept suggested message

### Option C: Using OpenCommit (CLI Tool)

AI-powered commit message generator using OpenAI/Anthropic.

**Installation:**

```bash
npm install -g opencommit
```

**Setup:**

```bash
# Configure with your AI provider API key
oco config set OCO_OPENAI_API_KEY=your-key
oco config set OCO_MODEL=gpt-4
oco config set OCO_LANGUAGE=en
```

**Usage:**

```bash
git add .
oco  # Generates and commits with AI message
```

### Option D: Using commitlint + commitizen

Standardized commit messages with prompts.

**Installation:**

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli commitizen cz-conventional-changelog
```

**Setup in package.json:**

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

**Usage:**

```bash
git add .
npm run commit  # Interactive prompt for commit type, scope, message
```

### Option E: Custom AI Script (Using Your AI Setup)

Since you have AI providers configured, create a custom script:

**Create `scripts/generate-commit.ts`:**

```typescript
import { execSync } from "child_process";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

async function generateCommitMessage() {
  const diff = execSync("git diff --cached --stat").toString();

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Generate a conventional commit message for these changes:\n${diff}\n\nFormat: type(scope): description`,
  });

  console.log(text);
}

generateCommitMessage();
```

**Usage:**

```bash
git add .
npx tsx scripts/generate-commit.ts
# Copy output and use: git commit -m "generated-message"
```

### Conventional Commits Format

All options follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting, no logic change)
- `refactor` - Code restructuring
- `test` - Adding or updating tests
- `chore` - Build process, dependencies
- `ci` - CI/CD changes

**Scopes for this project:**

- `api` - API endpoints
- `db` - Database schema/queries
- `ui` - Components and styling
- `auth` - Authentication
- `ai` - AI/LLM integration
- `app` - App routes and pages
- `ingest` - Document ingestion
- `config` - Configuration files

---

## 6. CI/CD Pipeline Setup

We'll set up **GitHub Actions** for automated testing and deployment.

### Step 1: Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### Step 2: Create CI Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Lint and Type Check
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Type Check
        run: npm run type-check

      - name: Check formatting
        run: npm run format:check

  # Job 2: Unit Tests
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test

  # Job 3: Build Test
  build:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Step 3: Create Deployment Pipeline (Vercel Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Step 4: Set Up GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name         | Value                        | How to Get                                                                 |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| `NEXTAUTH_SECRET`   | Random 32-char string        | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL`      | Your production URL          | e.g., `https://corporate-brain.vercel.app`                                 |
| `DATABASE_URL`      | PostgreSQL connection string | From Neon, Supabase, etc.                                                  |
| `OPENAI_API_KEY`    | Your OpenAI API key          | From OpenAI dashboard                                                      |
| `VERCEL_TOKEN`      | Vercel API token             | Vercel Settings → Tokens                                                   |
| `VERCEL_ORG_ID`     | Vercel organization ID       | From `.vercel/project.json`                                                |
| `VERCEL_PROJECT_ID` | Vercel project ID            | From `.vercel/project.json`                                                |

### Step 5: Commit and Push

```bash
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows for CI/CD"
git push
```

---

## 7. Branch Protection Rules

Protect your main branch from direct pushes and require reviews.

### Setup Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule** next to "Branch protection rules"
3. **Branch name pattern:** `main`
4. Enable these rules:

   **Require pull request reviews:**
   - ☑️ Require a pull request before merging
   - ☑️ Require approvals (set to 1 or more)
   - ☑️ Dismiss stale PR approvals when new commits are pushed
   - ☑️ Require review from code owners

   **Require status checks:**
   - ☑️ Require status checks to pass
   - Search for and select:
     - `lint-and-typecheck`
     - `unit-tests`
     - `build`

   **Other rules:**
   - ☑️ Require branches to be up to date before merging
   - ☑️ Include administrators (optional)
   - ☑️ Allow force pushes: Unchecked
   - ☑️ Allow deletions: Unchecked

5. Click **Create**

---

## 8. Automated Deployment

### Option A: Vercel (Easiest)

1. Connect GitHub repo to Vercel
2. Vercel automatically deploys on every push to `main`
3. Preview deployments for every pull request

**Setup:**

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel

# Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add DATABASE_URL

# Deploy
vercel --prod
```

### Option B: VPS with GitHub Actions

Create `.github/workflows/deploy-vps.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/corporate-brain
            git pull origin main
            npm ci
            npm run build
            pm2 restart corporate-brain
```

---

## 9. Troubleshooting

### Authentication Issues

**Problem: "Permission denied (publickey)"**

```bash
# Test SSH connection
ssh -T git@github.com

# If fails, restart SSH agent and add key again
 eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Problem: "Repository not found"**

- Check if you have access to the repository
- Verify remote URL: `git remote -v`
- Update remote: `git remote set-url origin git@github.com:username/repo.git`

### Sync Issues

**Problem: "Failed to push some refs"**

```bash
# Pull latest changes first
git pull origin main

# Resolve any conflicts, then push
git push
```

**Problem: Merge conflicts**

```bash
# See conflicting files
git status

# Open files in Windsurf - look for <<<<<<< markers
# Edit to resolve, then:
git add .
git commit -m "resolve merge conflicts"
```

### CI/CD Issues

**Problem: CI tests fail**

- Check Actions tab in GitHub for detailed logs
- Run tests locally first: `npm test`
- Ensure all environment secrets are set

**Problem: Deployment fails**

- Verify all secrets in GitHub Settings
- Check service credentials (Vercel token, VPS SSH key)
- Review deployment logs in Actions

### Windsurf-Specific

**Problem: Git panel not showing**

- Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check Git is installed: `git --version`

**Problem: Changes not detected**

- Refresh: Click refresh icon in Source Control
- Check file is not in `.gitignore`

### VS Code-Specific

**Problem: Git panel shows "There are no changes to commit"**

- Ensure files are saved: `Ctrl+S`
- Check files are not in `.gitignore`
- Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"

**Problem: Git commands fail in terminal**

- Check Git is in PATH: `git --version`
- Use VS Code's integrated terminal instead of external
- Verify terminal shell is configured correctly

**Problem: Cannot push to remote**

- Check remote URL: `git remote -v`
- Verify SSH key is loaded: `ssh-add -l`
- Try HTTPS instead of SSH if behind firewall

**Problem: Extension not working**

- Reload VS Code window
- Update extension to latest version
- Check extension output log: `Ctrl+Shift+P` → "Show Logs" → "Extension Host"

**Problem: Source Control view shows incorrect branch**

- Click branch name in status bar
- Select correct branch from dropdown
- Or use: `Ctrl+Shift+P` → "Git: Checkout to"

**Problem: Merge conflict markers not highlighted**

- Install "Merge Conflict" extension
- Or search settings for "merge conflict"
- Enable "Git: Show Inline Diff"

---

## Quick Reference Cheat Sheet

### Daily Commands

```bash
# Start of day - get latest
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Stage and commit
git add .
git commit -m "feat: description"

# Push branch
git push -u origin feature/my-feature

# After PR merge - cleanup
git checkout main
git pull
git branch -d feature/my-feature
```

### Emergency Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash

# Get stashed changes back
git stash pop

# Force push (use with caution)
git push --force-with-lease
```

---

## Summary Checklist

**Initial Setup:**

- [ ] GitHub repository created
- [ ] SSH key generated and added to GitHub
- [ ] Local project connected to GitHub
- [ ] Git identity configured
- [ ] `.gitignore` configured (Node template)

**Daily Git Workflow in Windsurf:**

- [ ] Git panel visible and working
- [ ] Autofetch enabled
- [ ] Can commit/push from UI

**Daily Git Workflow in VS Code (Alternative):**

- [ ] Source Control panel configured
- [ ] GitLens or GitHub extensions installed
- [ ] Integrated terminal working
- [ ] Can commit/push from UI

**Auto Commit Message Generation (Optional):**

- [ ] Git hook configured for smart commit messages
- [ ] Conventional commits understood

**CI/CD Setup:**

- [ ] `.github/workflows/ci.yml` created
- [ ] `.github/workflows/deploy.yml` created (optional)
- [ ] GitHub Secrets configured
- [ ] Branch protection rules enabled

**Team Workflow:**

- [ ] Feature branch workflow understood
- [ ] Pull request process documented
- [ ] Code review requirements set

---

**Document Version:** 1.0  
**Last Updated:** April 2026
