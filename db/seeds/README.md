# Database Seed System

> Automated, idempotent database seeding for development and deployment

## Overview

The seed system automatically populates the database with initial data during deployment. Each seed script is **idempotent** - safe to run multiple times without duplicating data.

**⚠️ Important**: Migrations must run BEFORE seeds. Schema must exist before data can be inserted.

## Architecture

```
db/
├── migrations/                 # Drizzle migration files (run FIRST)
│   ├── 0000_init.sql
│   ├── 0001_add_column.sql
│   └── meta/
├── seeds/                      # Seed files (run AFTER migrations)
│   ├── seed-runner.ts         # Master orchestrator
│   ├── seed-tenants.ts
│   ├── seed-users.ts
│   └── ...
```

## Deployment Order

```
Build/Deploy Process:
1. npm run db:generate    → Generate migration files (if schema changed)
2. npm run db:migrate     → Apply migrations (create/update tables)
3. npm run db:seed        → Insert seed data (idempotent)
4. npm run build          → Build Next.js app
```

**Never run seeds before migrations** - seeds will fail if tables don't exist.

## Naming Convention

**Format**: `seed-{plural-noun}.ts`

| Pattern             | Example             | Purpose                    |
| ------------------- | ------------------- | -------------------------- |
| `seed-{entity}.ts`  | `seed-users.ts`     | Seeds a specific entity    |
| `seed-{context}.ts` | `seed-materials.ts` | Seeds domain-specific data |

**New seed files MUST follow this pattern** to be recognized by the system.

## Idempotency Principle

Every seed script **must** check before inserting:

```typescript
// Check if exists (idempotent)
const existing = await db.query.users.findFirst({
  where: eq(users.email, userData.email),
});

if (existing) {
  console.log(`  ⏭️  User ${userData.email} already exists, skipping`);
  return existing; // Return existing for dependencies
}

// Only insert if not exists
const [user] = await db.insert(users).values(userData).returning();
```

**Rules:**

- ✅ Check existence before insert
- ✅ Skip if data exists (don't crash)
- ✅ Return existing data for dependent seeds
- ✅ Never crash on duplicate - log and continue
- ✅ Use unique identifiers for lookup (email, slug, title, etc.)

## Running Seeds

### Manual Run (Development)

```bash
# First ensure migrations are applied
npm run db:migrate

# Then run all seeds
npm run db:seed

# Or run specific seed
npx tsx db/seeds/seed-users.ts
```

### Auto-Run (Deployment)

Seeds run automatically during deployment:

```bash
# Full deployment pipeline:
npm run db:generate   # 1. Generate migrations
npm run db:migrate    # 2. Apply migrations
npm run db:seed       # 3. Seed data
npm run build         # 4. Build app
```

**Package.json scripts:**

```json
{
  "db:generate": "drizzle-kit generate:pg",
  "db:migrate": "drizzle-kit push:pg",
  "db:seed": "tsx db/seeds/seed-runner.ts",
  "prebuild": "npm run db:generate && npm run db:migrate && npm run type-check",
  "db:reset": "tsx scripts/db-reset.ts && npm run db:migrate && npm run db:seed"
}
```

## Creating New Seed Scripts

### Step 1: Create File

```bash
# Create new seed file
touch db/seeds/seed-materials.ts
```

### Step 2: Follow Template

```typescript
import { db } from "../../lib/db/client";
import { materials } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Materials
 * [Brief description of what this seeds]
 * Idempotent - checks before insert, skips if exists
 */

export async function seedMaterials(tenantId: string) {
  console.log("🌱 [seed-materials] Starting...");

  const materialsToSeed = [
    { name: "Steel", type: "metal", quantity: 100 },
    { name: "Wood", type: "organic", quantity: 200 },
  ];

  const createdMaterials = [];

  for (const materialData of materialsToSeed) {
    try {
      // Idempotent check
      const existing = await db.query.materials.findFirst({
        where: eq(materials.name, materialData.name),
      });

      if (existing) {
        console.log(
          `  ⏭️  Material '${materialData.name}' already exists, skipping`,
        );
        createdMaterials.push(existing);
        continue;
      }

      // Insert new
      const [material] = await db
        .insert(materials)
        .values({
          tenantId,
          ...materialData,
        })
        .returning();

      console.log(`  ✅ Created material: ${material.name}`);
      createdMaterials.push(material);
    } catch (error) {
      console.error(
        `  ❌ Failed to seed material ${materialData.name}:`,
        error,
      );
      // Continue with others - never crash
    }
  }

  console.log(
    `🌱 [seed-materials] Completed: ${createdMaterials.length} materials ready`,
  );
  return createdMaterials;
}

export default seedMaterials;
```

### Step 3: Register in Seed Runner

Edit `db/seeds/seed-runner.ts`:

```typescript
// 1. Import new seed
import seedMaterials from "./seed-materials";

// 2. Add to execution order (respect dependencies)
console.log("📦 Step X/X: Materials");
try {
  await seedMaterials(tenantId);
  results.push({ name: "seed-materials", success: true });
} catch (error) {
  results.push({
    name: "seed-materials",
    success: false,
    error: String(error),
  });
  console.error("❌ Failed to seed materials:", error);
}
```

### Step 4: Test

```bash
# First migrate (ensure tables exist)
npm run db:migrate

# Then run seeds
npm run db:seed
```

## Dependency Order

Seeds must run in dependency order (foreign keys):

```
1. seed-tenants        (no dependencies)
2. seed-users          (needs tenantId)
3. seed-knowledge-sources (needs tenantId)
4. seed-conversations  (needs tenantId + userId)
5. seed-integrations   (needs tenantId)
6. seed-YOUR-NEW       (add in correct position)
```

**If your seed needs user data**, wait for `seed-users` to complete and use the returned user ID.

**If your seed needs tenant only**, run after `seed-tenants`.

## Error Handling

**Never crash the seed runner**:

```typescript
try {
  await db.insert(...);
} catch (error) {
  console.error(`  ❌ Failed:`, error);
  // Log error but continue with next item
}
```

**Critical failures** (like no tenant) should abort the entire seed process.

## Deployment Integration

### Vercel

Add to `vercel.json` or use post-deploy hook:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install && npm run db:migrate && npm run db:seed"
}
```

### Docker

```dockerfile
# In Dockerfile or docker-compose
RUN npm run db:migrate && npm run db:seed
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Database Setup
  run: |
    npm run db:generate
    npm run db:migrate
    npm run db:seed
```

## Troubleshooting

### Seed Already Exists Error

**Problem**: Insert fails due to unique constraint

**Solution**: Ensure idempotent check is working:

```typescript
const existing = await db.query.table.findFirst({
  where: eq(table.uniqueField, value),
});
```

### Missing Dependencies

**Problem**: Seed runs before its dependency

**Solution**: Check order in `seed-runner.ts`:

```typescript
// Wrong: users before tenants
await seedUsers(); // ❌ tenantId undefined
await seedTenants();

// Correct: tenants before users
await seedTenants(); // ✅ tenant available
await seedUsers(tenantId);
```

### "Table does not exist" Error

**Problem**: Trying to seed before migrations run

**Solution**: Always run migrations first:

```bash
npm run db:migrate    # Creates tables
npm run db:seed       # Then inserts data
```

### Partial Seed Failure

**Problem**: Some seeds fail, others succeed

**Expected behavior**: Seed runner continues with remaining seeds and prints summary at end.

Check output:

```
📊 Results:
  ✅ Successful: 4/5
  ❌ Failed: 1/5
```

## Environment Variables

Seeds respect environment:

```bash
# Production (minimal seeds)
NODE_ENV=production npm run db:seed

# Development (full seeds with sample data)
NODE_ENV=development npm run db:seed
```

## Best Practices

1. **Always check before insert** - Idempotency is mandatory
2. **Use unique identifiers** - Email, slug, title for lookup
3. **Return created data** - Allow dependent seeds to use IDs
4. **Log everything** - Console output shows progress
5. **Never crash on duplicates** - Skip gracefully
6. **Test twice** - Run seed, run again, verify no duplicates
7. **Keep seeds small** - Seed 10-50 records, not 1000s
8. **Use realistic data** - Sample emails, real-looking content
9. **Document dependencies** - Comment what your seed needs
10. **Clean test data** - Use `db:reset` to wipe and re-seed

## Related Documentation

- **Migrations**: `db/MIGRATIONS.md` - Schema change workflow
- **Architecture**: `docs/ARCHITECTURE.md` - System diagrams
- **Database**: `lib/db/schema.ts` - Schema definitions

## Commands Reference

| Command               | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `npm run db:generate` | Generate migration files                 |
| `npm run db:migrate`  | Apply migrations (required before seeds) |
| `npm run db:seed`     | Run all seeds                            |
| `npm run db:reset`    | Wipe DB, migrate, seed                   |
| `npm run db:studio`   | Open Drizzle Studio                      |

---

**Remember**:

- Migrations FIRST (creates tables)
- Seeds SECOND (inserts data)
- Seeds are idempotent - safe to run on every deployment!

**New seed files MUST follow this pattern** to be recognized by the system.

## Idempotency Principle

Every seed script **must** check before inserting:

```typescript
// Check if exists (idempotent)
const existing = await db.query.users.findFirst({
  where: eq(users.email, userData.email),
});

if (existing) {
  console.log(`  ⏭️  User ${userData.email} already exists, skipping`);
  return existing; // Return existing for dependencies
}

// Only insert if not exists
const [user] = await db.insert(users).values(userData).returning();
```

**Rules:**

- ✅ Check existence before insert
- ✅ Skip if data exists (don't crash)
- ✅ Return existing data for dependent seeds
- ✅ Never crash on duplicate - log and continue
- ✅ Use unique identifiers for lookup (email, slug, title, etc.)

## Running Seeds

### Manual Run (Development)

```bash
# Run all seeds
npm run db:seed

# Run specific seed
npx tsx db/seeds/seed-users.ts
```

### Auto-Run (Deployment)

Seeds run automatically during deployment:

```bash
# Vercel/Production build triggers:
# 1. npm run prebuild (migrations)
# 2. npm run build (Next.js)
# 3. Post-deploy hook runs seeds
```

**Package.json scripts:**

```json
{
  "db:seed": "tsx db/seeds/seed-runner.ts",
  "db:reset": "tsx scripts/db-reset.ts && npm run db:migrate && npm run db:seed"
}
```

## Creating New Seed Scripts

### Step 1: Create File

```bash
# Create new seed file
touch db/seeds/seed-materials.ts
```

### Step 2: Follow Template

```typescript
import { db } from "../../lib/db/client";
import { materials } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Materials
 * [Brief description of what this seeds]
 * Idempotent - checks before insert, skips if exists
 */

export async function seedMaterials(tenantId: string) {
  console.log("🌱 [seed-materials] Starting...");

  const materialsToSeed = [
    { name: "Steel", type: "metal", quantity: 100 },
    { name: "Wood", type: "organic", quantity: 200 },
  ];

  const createdMaterials = [];

  for (const materialData of materialsToSeed) {
    try {
      // Idempotent check
      const existing = await db.query.materials.findFirst({
        where: eq(materials.name, materialData.name),
      });

      if (existing) {
        console.log(
          `  ⏭️  Material '${materialData.name}' already exists, skipping`,
        );
        createdMaterials.push(existing);
        continue;
      }

      // Insert new
      const [material] = await db
        .insert(materials)
        .values({
          tenantId,
          ...materialData,
        })
        .returning();

      console.log(`  ✅ Created material: ${material.name}`);
      createdMaterials.push(material);
    } catch (error) {
      console.error(
        `  ❌ Failed to seed material ${materialData.name}:`,
        error,
      );
      // Continue with others - never crash
    }
  }

  console.log(
    `🌱 [seed-materials] Completed: ${createdMaterials.length} materials ready`,
  );
  return createdMaterials;
}

export default seedMaterials;
```

### Step 3: Register in Seed Runner

Edit `db/seeds/seed-runner.ts`:

```typescript
// 1. Import new seed
import seedMaterials from "./seed-materials";

// 2. Add to execution order (respect dependencies)
console.log("📦 Step X/X: Materials");
try {
  await seedMaterials(tenantId);
  results.push({ name: "seed-materials", success: true });
} catch (error) {
  results.push({
    name: "seed-materials",
    success: false,
    error: String(error),
  });
  console.error("❌ Failed to seed materials:", error);
}
```

### Step 4: Test

```bash
npm run db:seed
```

## Dependency Order

Seeds must run in dependency order (foreign keys):

```
1. seed-tenants        (no dependencies)
2. seed-users          (needs tenantId)
3. seed-knowledge-sources (needs tenantId)
4. seed-conversations  (needs tenantId + userId)
5. seed-integrations   (needs tenantId)
6. seed-YOUR-NEW       (add in correct position)
```

**If your seed needs user data**, wait for `seed-users` to complete and use the returned user ID.

**If your seed needs tenant only**, run after `seed-tenants`.

## Error Handling

**Never crash the seed runner**:

```typescript
try {
  await db.insert(...);
} catch (error) {
  console.error(`  ❌ Failed:`, error);
  // Log error but continue with next item
}
```

**Critical failures** (like no tenant) should abort the entire seed process.

## Deployment Integration

### Vercel

Add to `vercel.json` or use post-deploy hook:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install && npm run db:migrate && npm run db:seed"
}
```

### Docker

```dockerfile
# In Dockerfile or docker-compose
RUN npm run db:migrate && npm run db:seed
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Database Setup
  run: |
    npm run db:migrate
    npm run db:seed
```

## Troubleshooting

### Seed Already Exists Error

**Problem**: Insert fails due to unique constraint

**Solution**: Ensure idempotent check is working:

```typescript
const existing = await db.query.table.findFirst({
  where: eq(table.uniqueField, value),
});
```

### Missing Dependencies

**Problem**: Seed runs before its dependency

**Solution**: Check order in `seed-runner.ts`:

```typescript
// Wrong: users before tenants
await seedUsers(); // ❌ tenantId undefined
await seedTenants();

// Correct: tenants before users
await seedTenants(); // ✅ tenant available
await seedUsers(tenantId);
```

### Partial Seed Failure

**Problem**: Some seeds fail, others succeed

**Expected behavior**: Seed runner continues with remaining seeds and prints summary at end.

Check output:

```
📊 Results:
  ✅ Successful: 4/5
  ❌ Failed: 1/5
```

## Environment Variables

Seeds respect environment:

```bash
# Production (minimal seeds)
NODE_ENV=production npm run db:seed

# Development (full seeds with sample data)
NODE_ENV=development npm run db:seed
```

## Best Practices

1. **Always check before insert** - Idempotency is mandatory
2. **Use unique identifiers** - Email, slug, title for lookup
3. **Return created data** - Allow dependent seeds to use IDs
4. **Log everything** - Console output shows progress
5. **Never crash on duplicates** - Skip gracefully
6. **Test twice** - Run seed, run again, verify no duplicates
7. **Keep seeds small** - Seed 10-50 records, not 1000s
8. **Use realistic data** - Sample emails, real-looking content
9. **Document dependencies** - Comment what your seed needs
10. **Clean test data** - Use `db:reset` to wipe and re-seed

## Commands Reference

| Command                      | Purpose                |
| ---------------------------- | ---------------------- |
| `npm run db:seed`            | Run all seeds          |
| `npm run db:reset`           | Wipe DB, migrate, seed |
| `npx tsx db/seeds/seed-X.ts` | Run single seed        |
| `npm run db:migrate`         | Run migrations only    |
| `npm run db:studio`          | Open Drizzle Studio    |

---

**Remember**: Seeds are idempotent - safe to run on every deployment!
