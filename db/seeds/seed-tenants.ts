import { db } from "../../lib/db/client";
import { tenants } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Tenants
 * Creates default tenant for the application
 * Idempotent - checks before insert, skips if exists
 */

export interface SeedTenant {
  name: string;
  slug: string;
  plan: string;
  settings: Record<string, unknown>;
}

export async function seedTenants() {
  console.log("🌱 [seed-tenants] Starting...");

  const tenantData: SeedTenant = {
    name: "Acme Corporation",
    slug: "acme",
    plan: "starter",
    settings: {
      maxUsers: 10,
      maxStorage: 1073741824, // 1GB
      allowedModels: ["gpt-4", "claude-3", "gemini-pro"],
    },
  };

  try {
    // Idempotent check - query by unique slug
    const existing = await db.query.tenants.findFirst({
      where: eq(tenants.slug, tenantData.slug),
    });

    if (existing) {
      console.log(`  ⏭️  Tenant '${tenantData.slug}' already exists, skipping`);
      console.log(`🌱 [seed-tenants] Completed: using existing tenant`);
      return existing;
    }

    // Create new tenant
    const [tenant] = await db.insert(tenants).values({
      name: tenantData.name,
      slug: tenantData.slug,
      plan: tenantData.plan,
      settings: JSON.stringify(tenantData.settings),
    }).returning();

    console.log(`  ✅ Created tenant: ${tenant.name} (${tenant.id})`);
    console.log(`🌱 [seed-tenants] Completed: new tenant created`);
    return tenant;
  } catch (error) {
    console.error(`  ❌ Failed to seed tenant:`, error);
    // Try to find existing tenant to allow continuation
    const fallback = await db.query.tenants.findFirst({
      where: eq(tenants.slug, tenantData.slug),
    });
    if (fallback) {
      console.log(`  ⚠️  Using existing tenant as fallback`);
      return fallback;
    }
    throw error; // Only throw if we can't recover
  }
}

export default seedTenants;
