# First Admin Setup Guide

> **How to create the initial admin user in production**

## 🎯 The Problem

Database seeding is **blocked in production** for security reasons (creates hardcoded test credentials), but this means **no users exist** when you first deploy.

**Solutions** (pick based on your preference):

---

## ✅ Option 1: First-Run Setup Wizard (Recommended)

A web-based wizard that only appears when no users exist.

### How it works:

1. Deploy app with empty database
2. Visit `/setup` in browser
3. Fill in company name, admin email, password
4. Wizard creates first admin + tenant automatically
5. Redirects to login page
6. `/setup` becomes inaccessible (redirects to home)

### Security features:

- Only works when **zero users** exist in database
- After first admin created, route redirects to `/`
- Password hashed with bcrypt
- Creates proper tenant with starter plan

### Usage:

```bash
# After production deployment
# Open browser to: https://yourdomain.com/setup
# Fill form → Admin created → Login
```

**File:** `app/setup/page.tsx`

---

## ✅ Option 2: Drizzle Studio (Manual)

For quick manual setup via database GUI.

### Steps:

```bash
# SSH into production server or run locally with production DB
npm run db:studio

# Opens https://local.drizzle.studio
# 1. Go to 'users' table
# 2. Click 'Insert'
# 3. Fill fields:
#    - id: (auto-generated)
#    - tenantId: (create tenant first in 'tenants' table)
#    - email: "admin@yourcompany.com"
#    - name: "Admin User"
#    - password: "$2a$10$..." (bcrypt hash of password)
#    - role: "admin"
#    - emailVerified: current timestamp
```

### Generate bcrypt hash locally:

```bash
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
```

---

## ✅ Option 3: Environment Variable (Automated)

Create first admin via env vars on first deploy.

### Add to `.env`:

```bash
# Initial admin credentials (only used on first run)
INITIAL_ADMIN_EMAIL=admin@yourcompany.com
INITIAL_ADMIN_PASSWORD=securepassword123
INITIAL_ADMIN_NAME=Admin User
INITIAL_COMPANY_NAME=Your Company
```

### Implementation:

Create `scripts/create-initial-admin.ts`:

```typescript
import { db } from "../lib/db/client";
import { users, tenants } from "../lib/db/schema";
import bcrypt from "bcryptjs";

async function createInitialAdmin() {
  // Check if users exist
  const existingUsers = await db.query.users.findFirst();
  if (existingUsers) {
    console.log("Users already exist, skipping initial admin creation");
    return;
  }

  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME;
  const company = process.env.INITIAL_COMPANY_NAME;

  if (!email || !password || !name || !company) {
    console.log("INITIAL_ADMIN_* env vars not set, skipping");
    return;
  }

  // Create tenant
  const [tenant] = await db
    .insert(tenants)
    .values({
      name: company,
      slug: company.toLowerCase().replace(/\s+/g, "-"),
      plan: "starter",
      settings: JSON.stringify({
        maxUsers: 10,
        maxStorage: 1073741824,
        allowedModels: ["gpt-4", "claude-3", "gemini-pro"],
      }),
    })
    .returning();

  // Create admin
  await db.insert(users).values({
    tenantId: tenant.id,
    email,
    name,
    password: await bcrypt.hash(password, 10),
    role: "admin",
    emailVerified: new Date(),
  });

  console.log(`✅ Initial admin created: ${email}`);
  console.log("⚠️  Remove INITIAL_ADMIN_* env vars after first deploy");
}

createInitialAdmin().catch(console.error);
```

### Usage:

```bash
# Add to package.json
"db:init-admin": "tsx scripts/create-initial-admin.ts"

# Run once after migrations
npm run db:migrate
npm run db:init-admin
```

---

## 📊 Comparison

| Method             | Effort | Security | Best For               |
| ------------------ | ------ | -------- | ---------------------- |
| **Setup Wizard**   | Low    | High     | Most deployments       |
| **Drizzle Studio** | Medium | Medium   | Quick fixes, debugging |
| **Env Vars**       | Low    | Medium\* | Automated CI/CD        |

\*Remove env vars after first run

---

## 🚀 Recommended Production Flow

### With Setup Wizard:

```bash
# 1. Deploy application
vercel --prod

# 2. Run migrations
npm run db:migrate

# 3. Open setup page in browser
# https://yourdomain.com/setup
# → Fill form → Admin created

# 4. Login and start using app
```

### With Environment Variables:

```bash
# 1. Set env vars (Vercel dashboard or CLI)
vercel env add INITIAL_ADMIN_EMAIL
vercel env add INITIAL_ADMIN_PASSWORD
vercel env add INITIAL_ADMIN_NAME
vercel env add INITIAL_COMPANY_NAME

# 2. Deploy
vercel --prod

# 3. Run init script
npm run db:init-admin

# 4. Remove env vars (security)
vercel env rm INITIAL_ADMIN_PASSWORD
```

---

## ⚠️ Security Checklist

After creating first admin:

- [ ] Remove any `INITIAL_ADMIN_*` environment variables
- [ ] Delete `scripts/create-initial-admin.ts` if using env method
- [ ] Change default password after first login
- [ ] Enable 2FA if available
- [ ] Verify `/setup` route redirects to home (no longer accessible)

---

## 🔧 Troubleshooting

### "Setup page redirects to home"

- **Cause:** Users already exist in database
- **Fix:** Check if you have existing data, or run `npm run db:reset` (⚠️ deletes all data)

### "Cannot access /setup"

- **Cause:** Middleware blocking or route not found
- **Fix:** Ensure `app/setup/page.tsx` exists and middleware doesn't block `/setup`

### "Database connection failed"

- **Cause:** `DATABASE_URL` not set or invalid
- **Fix:** Check environment variables and database is running

---

**File:** `docs/FIRST_ADMIN_SETUP.md`
