# NPM Scripts Reference Guide

> **Complete reference for all available npm commands in the Corporate Brain project**

**Last Updated:** April 11, 2026  
**Package:** `corporate-brain@1.0.0`

---

## Quick Reference

| Category | Command | Purpose |
|----------|---------|---------|
| 🚀 **Development** | `npm run dev` | Auto-seed database + start dev server |
| 🏗️ **Build** | `npm run build` | Production build with pre-checks |
| 🧪 **Testing** | `npm run test:unit` | Run 31 passing unit tests |
| 🗄️ **Database** | `npm run db:setup` | Migrate + seed fresh database |
| 🐳 **Docker** | `npm run docker:start` | Start PostgreSQL + Redis |
| 🔧 **Setup** | `npm run setup` | Complete project initialization |

---

## Development Commands

### `npm run dev` ⭐ **Primary Development Command**

**What it does:**
1. Runs `predev` hook → `npm run db:seed` (seeds database if needed)
2. Starts Next.js development server on `http://localhost:3004`

**When to use:**
- Starting daily development
- After pulling new changes
- Testing the application locally

**Output:**
```
🌱 Seeding tenants...
  ⏭️  Tenant 'acme' already exists, skipping
🌱 Seeding users...
  ⏭️  User admin@acme.com already exists, skipping
  ⏭️  User member@acme.com already exists, skipping
✅ Seed completed successfully!
  Admin: admin@acme.com / password123
  Member: member@acme.com / password123

> Ready on http://localhost:3004
```

**Features:**
- Idempotent (safe to run multiple times)
- Skips existing data automatically
- Seeds admin + member test users
- Creates sample documents and conversations

---

### `npm run setup` ⭐ **One-Time Project Setup**

**What it does:**
```bash
npm install                    # Install dependencies
&& npm run docker:start        # Start PostgreSQL + Redis
&& npm run db:setup            # Migrate + seed database
&& npm run hooks:install       # Install Git hooks
```

**When to use:**
- First time cloning the repository
- Setting up a new development environment
- After `rm -rf node_modules`

**Prerequisites:**
- Docker Desktop installed and running
- Node.js 18+ and npm 9+

---

## Database Commands

### `npm run db:seed`

**Purpose:** Seed database with test data  
**File:** `db/seeds/index.ts`

**Creates:**
- **Tenant:** "Acme Corporation" (slug: `acme`)
- **Admin User:** `admin@acme.com` / `password123`
- **Member User:** `member@acme.com` / `password123`
- **Documents:** Employee Handbook, Q1 Sales Report, Slack conversation
- **Conversation:** Sample chat with messages
- **Integrations:** Slack, Google Drive, Notion (disconnected)

**When to use:**
- After database reset
- Setting up new developer environment
- Need fresh test data

---

### `npm run db:setup`

**What it does:**
```bash
npm run db:migrate    # Push schema to database
&& npm run db:seed    # Seed with test data
```

**When to use:**
- First time database initialization
- After schema changes
- Creating fresh database instance

---

### `npm run db:migrate`

**Purpose:** Push Drizzle schema to PostgreSQL  
**Command:** `drizzle-kit push:pg`

**When to use:**
- After modifying `lib/db/schema.ts`
- Creating new tables or columns
- Schema synchronization

---

### `npm run db:reset` ⚠️ **Destructive**

**What it does:**
```bash
tsx scripts/db-reset.ts      # Drop all tables
&& npm run db:migrate        # Recreate schema
&& npm run db:seed           # Seed fresh data
```

**⚠️ Warning:** This **DELETES ALL DATA** - use with caution!

**When to use:**
- Corrupted database state
- Schema conflicts
- Starting completely fresh

---

### `npm run db:studio`

**Purpose:** Launch Drizzle Kit Studio (GUI database manager)  
**URL:** `https://local.drizzle.studio`

**Features:**
- Browse tables and records
- Edit data inline
- View relationships
- Export/import data

**When to use:**
- Debugging database issues
- Manual data inspection
- Schema verification

---

### `npm run db:generate`

**Purpose:** Generate Drizzle migration files  
**Command:** `drizzle-kit generate:pg`

**When to use:**
- Before running migrations
- Creating versioned schema changes
- Production deployments

---

## Docker Commands

### `npm run docker:start`

**Purpose:** Start PostgreSQL and Redis containers  
**Command:** `docker-compose up -d`

**Services:**
- **PostgreSQL** (port 5432) - Main database with pgvector extension
- **Redis** (port 6379) - Session cache and job queue

**When to use:**
- Before first `npm run dev`
- After system restart
- When Docker Desktop was stopped

---

### `npm run docker:stop`

**Purpose:** Stop all Docker containers  
**Command:** `docker-compose down`

**When to use:**
- Shutting down development
- Freeing system resources
- Before system restart

---

### `npm run docker:logs`

**Purpose:** View real-time Docker logs  
**Command:** `docker-compose logs -f`

**When to use:**
- Debugging database connection issues
- Monitoring Redis operations
- Troubleshooting container errors

---

## Testing Commands

### `npm run test` ⭐ **Watch Mode**

**Purpose:** Run Vitest in interactive watch mode  
**Features:**
- Auto-runs tests on file changes
- Interactive UI for filtering tests
- Hot reloading for rapid iteration

**When to use:**
- Writing new tests
- Refactoring code
- Continuous test-driven development

---

### `npm run test:run`

**Purpose:** Run all tests once (CI mode)  
**Features:**
- No watch mode
- Exits with code on failure
- Suitable for scripts

**When to use:**
- Pre-commit validation
- CI/CD pipelines
- Quick check before push

---

### `npm run test:unit` ⭐ **Unit Tests Only**

**Purpose:** Run unit tests with verbose output  
**Command:** `vitest run lib/ --reporter=verbose`

**Current Status:**
```
✓ lib/utils.test.ts (22 tests) - PASSING
✓ lib/ai/cost-tracker.test.ts (9 tests) - PASSING
Total: 31 unit tests passing
```

**When to use:**
- Fast feedback on utility functions
- Business logic validation
- Before committing changes to `lib/`

---

### `npm run test:e2e`

**Purpose:** Run Playwright end-to-end tests  
**Browsers:** Chromium, Firefox, WebKit

**Test Files:**
- `tests/e2e/auth.spec.ts` - Authentication flows
- `tests/e2e/chat.spec.ts` - Chat interface
- `tests/e2e/onboarding.spec.ts` - Onboarding flow

**Requirements:**
- Dev server running on `localhost:3004`
- Database seeded with test users

**When to use:**
- Full user journey validation
- Pre-release testing
- CI/CD quality gates

---

### `npm run test:ci`

**Purpose:** Complete CI test suite  
**Command:** `vitest run && playwright test`

**When to use:**
- GitHub Actions workflows
- Pre-deployment validation
- Full quality assurance

---

## Build & Deploy Commands

### `npm run build`

**Purpose:** Production build  
**Pre-build hooks:**
```bash
prebuild: npm run db:generate && npm run db:migrate && npm run type-check
```

**When to use:**
- Production deployment
- Vercel/GitHub Actions builds
- Performance testing

---

### `npm run start`

**Purpose:** Start production server  
**Requires:** `npm run build` first

**When to use:**
- Production environment
- Docker production containers
- Local production testing

---

### `npm run type-check`

**Purpose:** TypeScript validation  
**Command:** `tsc --noEmit`

**When to use:**
- Before builds
- CI/CD pipelines
- Catching type errors early

**Current Status:** 74 pre-existing errors (not from recent changes)

---

### `npm run lint`

**Purpose:** ESLint code quality check  
**Command:** `next lint`

**When to use:**
- Code style enforcement
- Pre-commit hooks
- CI quality gates

---

## Code Quality Commands

### `npm run format`

**Purpose:** Auto-format code with Prettier  
**Command:** `prettier --write .`

**When to use:**
- Before committing
- Bulk formatting
- Consistent code style

---

### `npm run format:check`

**Purpose:** Check formatting without changes  
**Command:** `prettier --check .`

**When to use:**
- CI/CD validation
- Pre-commit checks
- Enforcing formatting standards

---

## Memory Bank Commands

### `npm run memory:verify`

**Purpose:** Verify Windsurf memory bank integrity  
**Checks:**
- Directory structure (`.windsurf/`, `context/`, `memory/`)
- Required files (rules.md, workflows, etc.)
- Changelog entries

**When to use:**
- After file changes
- Before commits
- Troubleshooting context issues

---

### `npm run memory:update`

**Purpose:** Update memory bank after changes  
**Command:** `node .windsurf/scripts/memory-tracker.js --update`

**When to use:**
- After completing features
- End of development session
- Manual context refresh

---

### `npm run memory:context`

**Purpose:** Gather context from recent changes  
**Command:** `node .windsurf/scripts/memory-tracker.js --gather`

**When to use:**
- Preparing for AI assistance
- Summarizing recent work
- Context switching

---

### `npm run context:check`

**Purpose:** Full verification pipeline  
**Command:** `npm run memory:verify && npm run type-check && npm run lint`

**When to use:**
- Pre-commit validation
- Quality gates
- Final checks before push

---

### `npm run hooks:install`

**Purpose:** Install Git hooks for auto-tracking  
**Hooks:**
- `post-commit` - Track changes after commits
- `prepare-commit-msg` - Context-aware commit messages

**When to use:**
- First time project setup
- After cloning repository
- Reinstalling hooks

---

## Lifecycle Hooks

These scripts run automatically as part of other commands:

### `predev`
**Runs before:** `npm run dev`  
**Command:** `npm run db:seed`  
**Purpose:** Ensure database is seeded before starting server

---

### `prebuild`
**Runs before:** `npm run build`  
**Command:** `npm run db:generate && npm run db:migrate && npm run type-check`  
**Purpose:** Validate and prepare before production build

---

### `postinstall`
**Runs after:** `npm install`  
**Command:** `drizzle-kit generate:pg`  
**Purpose:** Generate Drizzle types immediately after install

---

## Common Workflows

### First-Time Setup (New Developer)
```bash
# 1. Clone and enter directory
git clone <repo-url>
cd corporate-brain

# 2. One-command setup (installs deps, starts docker, sets up db, installs hooks)
npm run setup

# 3. Start development (auto-seeds if needed)
npm run dev

# 4. Open browser
curl http://localhost:3004
```

---

### Daily Development
```bash
# Ensure Docker is running
npm run docker:start

# Start development (auto-seeds database)
npm run dev

# In another terminal - run tests
npm run test:unit

# Check code quality
npm run context:check
```

---

### Database Reset (Starting Fresh)
```bash
# ⚠️ Destroys all data!
npm run db:reset

# Or manually:
npm run docker:stop
npm run docker:start
npm run db:setup
```

---

### Testing Workflow
```bash
# 1. Unit tests (fast)
npm run test:unit

# 2. Start server for E2E
npm run dev

# 3. In another terminal, run E2E tests
npm run test:e2e

# 4. Full CI suite
npm run test:ci
```

---

### Pre-Commit Checklist
```bash
# Run full verification
npm run context:check

# Or manually:
npm run memory:verify   # Memory bank OK
npm run type-check      # TypeScript OK
npm run lint            # Code style OK
npm run test:unit       # Tests passing
```

---

## Test User Credentials

After running `npm run dev` or `npm run db:seed`:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@acme.com` | `password123` | `/app` + `/admin/*` |
| **Member** | `member@acme.com` | `password123` | `/app` only |

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Start Docker containers
npm run docker:start

# Verify containers are running
docker ps

# Check logs
npm run docker:logs
```

### "Database not seeded"
```bash
# Manual seed
npm run db:seed

# Or full reset
npm run db:reset
```

### "Type errors in tests"
```bash
# Regenerate Drizzle types
npm run db:generate

# Run type check
npm run type-check
```

### "Memory verification failed"
```bash
# Update memory bank
npm run memory:update

# Verify again
npm run memory:verify
```

---

## Environment Variables Required

These scripts assume `.env.local` or `.env` contains:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corporate_brain

# Redis (for sessions)
REDIS_URL=redis://localhost:6379

# NextAuth
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET=your-secret-here

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## CI/CD Integration

For GitHub Actions or similar:

```yaml
# .github/workflows/ci.yml
- name: Setup
  run: npm run setup

- name: Context Check
  run: npm run context:check

- name: Unit Tests
  run: npm run test:unit

- name: Build
  run: npm run build
```

---

**Document Version:** 1.0  
**Maintained in:** `docs/NPM_SCRIPTS.md`
