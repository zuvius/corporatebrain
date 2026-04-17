# Database Migration Workflow

> Automated schema migrations with Drizzle Kit

## Overview

Migrations are **automatically generated** from schema changes and **automatically applied** during deployment. This ensures your database schema always matches your code.

## Migration Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Schema Change  │────→│  Generate SQL   │────→│  Auto-Apply on  │
│  (schema.ts)    │     │  (drizzle-kit)  │     │  Build/Deploy   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## When Migrations Run

### 1. Development (Manual)

```bash
# After changing schema files
npm run db:generate    # Generate migration SQL
npm run db:migrate     # Apply to local database
npm run db:studio      # Verify in Drizzle Studio
```

### 2. Build/Deployment (Automatic)

```bash
npm run build
# └─→ prebuild runs automatically:
#     1. npm run db:generate  (ensure migrations exist)
#     2. npm run db:migrate   (apply pending migrations)
#     3. npm run type-check   (verify types)
#     4. next build           (build app)
```

### 3. Post-Install (Automatic)

```bash
npm install
# └─→ postinstall runs:
#     drizzle-kit generate:pg  (ensure migrations exist)
```

## Creating New Migrations

### Step 1: Modify Schema

Edit `@c:\Users\seoho\Documents\Corporate Brain\lib\db\schema.ts`:

```typescript
// Before
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
});

// After - Added 'role' column
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("member").notNull(), // NEW
});
```

### Step 2: Generate Migration

```bash
npm run db:generate
```

**What happens:**

- Drizzle Kit compares current schema with database
- Generates SQL migration file in `db/migrations/` folder
- File named: `0001_add_user_role.sql`

**Generated SQL example:**

```sql
-- db/migrations/0001_add_user_role.sql
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'member' NOT NULL;
```

### Step 3: Review Migration

```bash
# Check generated files
ls db/migrations/
# Output:
# 0000_init.sql
# 0001_add_user_role.sql   <-- New migration
# meta/
#   0000_snapshot.json
#   0001_snapshot.json
```

**Review the SQL:**

```bash
cat db/migrations/0001_add_user_role.sql
```

### Step 4: Apply Migration

```bash
npm run db:migrate
```

**Output:**

```
Applying migration: 0001_add_user_role.sql
✓ Migration applied successfully
```

### Step 5: Verify

```bash
npm run db:studio
```

Open Drizzle Studio to verify schema changes.

## Migration File Naming

Drizzle Kit auto-generates names:

```
db/migrations/
├── 0000_init.sql              # Initial schema
├── 0001_add_user_role.sql     # Added role column
├── 0002_create_materials.sql  # New materials table
├── 0003_update_indexes.sql    # Performance indexes
└── meta/
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    ├── 0002_snapshot.json
    └── 0003_snapshot.json
```

**Do NOT rename migration files** - Drizzle tracks them by name.

## Best Practices

### 1. One Change Per Migration

❌ **Bad**: Multiple unrelated changes in one migration

```typescript
// Don't do this - combine many changes
// - Add user role
// - Create materials table
// - Add indexes
// - Update constraints
```

✅ **Good**: Separate commits/migrations for each change

```typescript
// Commit 1: Add user role
// Commit 2: Create materials table
// Commit 3: Add indexes
```

### 2. Never Edit Generated SQL

❌ **Bad**: Manually editing `0001_xxx.sql`

✅ **Good**: If migration is wrong:

1. Revert schema change
2. Delete migration file
3. Regenerate with `npm run db:generate`

### 3. Test Migrations Locally First

```bash
# Full reset to test clean migration
npm run db:reset

# Or apply just the new migration
npm run db:migrate
```

### 4. Commit Migration Files

**Always commit generated migration files:**

```bash
git add db/migrations/
git commit -m "migration: add user role column

Changes:
- @c:\Users\seoho\Documents\Corporate Brain\lib\db\schema.ts:25-30
- db/migrations/0001_add_user_role.sql:1-3

Migration adds 'role' column to users table with
default value 'member' for existing records."
```

### 5. Handle Breaking Changes Carefully

**Renaming column:**

```typescript
// Instead of renaming (breaking change):
// name → fullName

// Add new, migrate data, remove old:
export const users = pgTable("users", {
  name: varchar("name", { length: 255 }), // Keep temporarily
  fullName: varchar("full_name", { length: 255 }), // New
});
```

**Then in migration or seed:**

```sql
-- Copy data from old to new
UPDATE "users" SET "full_name" = "name";
```

## Troubleshooting

### Migration Failed: "Column already exists"

**Cause**: Migration trying to add column that already exists

**Fix**:

```bash
# Check current database state
npm run db:studio

# If column exists but shouldn't:
# 1. Manually drop column (if safe)
# 2. Or mark migration as applied:
drizzle-kit push:pg --skip-generate
```

### Migration Failed: "Table already exists"

**Cause**: Migration conflicts with existing table

**Fix**:

```bash
# Reset database (DELETES ALL DATA)
npm run db:reset

# Or manually sync:
drizzle-kit push:pg --skip-generate
```

### Generated Wrong Migration

**Cause**: Schema and database out of sync

**Fix**:

```bash
# 1. Delete incorrect migration
rm db/migrations/000X_wrong.sql
rm db/migrations/meta/000X_snapshot.json

# 2. Sync database to match current schema
npm run db:migrate

# 3. Make schema changes
# 4. Regenerate
npm run db:generate
```

### Migration Conflicts in Team

**Scenario**: Two developers create migrations

**Developer A:**

```bash
# Created 0002_add_indexes.sql
git add db/migrations/
git commit -m "migration: add indexes"
git push
```

**Developer B:**

```bash
# Created 0002_create_materials.sql (same number!)
git pull origin main
# └─→ CONFLICT: both have 0002_*

# Fix: Rename B's migration
git mv db/migrations/0002_create_materials.sql db/migrations/0003_create_materials.sql
# Also rename snapshot files
npm run db:generate  # Regenerate to fix meta/
```

## Deployment Integration

### Vercel

`vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

Migrations run automatically via `prebuild`.

### Docker

`Dockerfile`:

```dockerfile
# Build stage
RUN npm run db:generate
RUN npm run db:migrate
RUN npm run build

# Runtime
CMD ["npm", "start"]
```

### CI/CD Pipeline

`.github/workflows/deploy.yml`:

```yaml
- name: Database Migration
  run: |
    npm run db:generate
    npm run db:migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}

- name: Build
  run: npm run build
```

## Commands Reference

| Command       | Purpose                              | When to Run                 |
| ------------- | ------------------------------------ | --------------------------- |
| `db:generate` | Create migration from schema changes | After editing schema.ts     |
| `db:migrate`  | Apply pending migrations             | During deploy, or locally   |
| `db:studio`   | Open Drizzle Studio                  | Verify schema changes       |
| `db:reset`    | Wipe DB + migrate + seed             | Development only            |
| `prebuild`    | Generate + migrate + type-check      | Auto-runs before build      |
| `postinstall` | Generate migrations                  | Auto-runs after npm install |

## Migration Safety Rules

1. **Never skip migrations in production** - Always run `db:migrate`
2. **Always test locally first** - Run `db:reset` to verify
3. **Commit migration files** - Include in git, not .gitignore
4. **Never edit generated SQL** - Fix schema, regenerate
5. **One logical change per migration** - Easier to rollback
6. **Add rollbacks for risky changes** - Plan for mistakes
7. **Backup before major migrations** - Database dumps

## Environment Variables

Migrations require:

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
```

For deployment:

```bash
# Vercel/Production
DATABASE_URL="postgresql://..."
```

---

**Remember**: Schema changes → Generate → Commit → Deploy (auto-applies)
