import seedTenants from "./seed-tenants";
import seedUsers from "./seed-users";
import seedKnowledgeSources from "./seed-knowledge-sources";
import seedConversations from "./seed-conversations";
import seedIntegrations from "./seed-integrations";

/**
 * Master Seed Runner
 * 
 * Automatically discovers and runs all seed scripts in order.
 * Each seed is idempotent - safe to run multiple times.
 * 
 * Order matters: Seeds with foreign key dependencies run after their dependencies.
 * 
 * Execution Order:
 * 1. seed-tenants (no dependencies)
 * 2. seed-users (depends on tenant)
 * 3. seed-knowledge-sources (depends on tenant)
 * 4. seed-conversations (depends on tenant and user)
 * 5. seed-integrations (depends on tenant)
 */

interface SeedResult {
  name: string;
  success: boolean;
  error?: string;
}

async function runSeeds() {
  console.log("\n🚀 ===========================================");
  console.log("🚀 DATABASE SEED - Starting");
  console.log("🚀 ===========================================\n");

  const results: SeedResult[] = [];
  let tenantId: string | undefined;
  let userId: string | undefined;

  try {
    // Seed 1: Tenants (always first, no dependencies)
    console.log("📦 Step 1/5: Tenants");
    console.log("--------------------------------------------");
    try {
      const tenant = await seedTenants();
      tenantId = tenant.id;
      results.push({ name: "seed-tenants", success: true });
      console.log("✅ Tenants seeded successfully\n");
    } catch (error) {
      results.push({ 
        name: "seed-tenants", 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      console.error("❌ Failed to seed tenants:", error);
      throw new Error("Cannot continue without tenant - aborting seed");
    }

    if (!tenantId) {
      throw new Error("Tenant ID not available - cannot seed dependent tables");
    }

    // Seed 2: Users (depends on tenant)
    console.log("📦 Step 2/5: Users");
    console.log("--------------------------------------------");
    try {
      const users = await seedUsers(tenantId);
      userId = users[0]?.id; // Use first user for conversations
      results.push({ name: "seed-users", success: true });
      console.log("✅ Users seeded successfully\n");
    } catch (error) {
      results.push({ 
        name: "seed-users", 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      console.error("❌ Failed to seed users:", error);
      // Continue with other seeds - users are not critical for all features
    }

    // Seed 3: Knowledge Sources (depends on tenant)
    console.log("📦 Step 3/5: Knowledge Sources");
    console.log("--------------------------------------------");
    try {
      await seedKnowledgeSources(tenantId);
      results.push({ name: "seed-knowledge-sources", success: true });
      console.log("✅ Knowledge sources seeded successfully\n");
    } catch (error) {
      results.push({ 
        name: "seed-knowledge-sources", 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      console.error("❌ Failed to seed knowledge sources:", error);
      // Continue
    }

    // Seed 4: Conversations (depends on tenant and user)
    if (userId) {
      console.log("📦 Step 4/5: Conversations");
      console.log("--------------------------------------------");
      try {
        await seedConversations(tenantId, userId);
        results.push({ name: "seed-conversations", success: true });
        console.log("✅ Conversations seeded successfully\n");
      } catch (error) {
        results.push({ 
          name: "seed-conversations", 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
        console.error("❌ Failed to seed conversations:", error);
        // Continue
      }
    } else {
      console.log("⏭️  Step 4/5: Conversations - SKIPPED (no user available)\n");
      results.push({ name: "seed-conversations", success: true }); // Not a failure
    }

    // Seed 5: Integrations (depends on tenant)
    console.log("📦 Step 5/5: Integrations");
    console.log("--------------------------------------------");
    try {
      await seedIntegrations(tenantId);
      results.push({ name: "seed-integrations", success: true });
      console.log("✅ Integrations seeded successfully\n");
    } catch (error) {
      results.push({ 
        name: "seed-integrations", 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      console.error("❌ Failed to seed integrations:", error);
      // Continue
    }

    // Summary
    console.log("🚀 ===========================================");
    console.log("🚀 DATABASE SEED - Summary");
    console.log("🚀 ===========================================");
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    results.forEach(result => {
      const icon = result.success ? "✅" : "❌";
      console.log(`${icon} ${result.name}${result.error ? ` - ${result.error}` : ""}`);
    });

    console.log("\n📊 Results:");
    console.log(`  ✅ Successful: ${successful}/${results.length}`);
    console.log(`  ❌ Failed: ${failed}/${results.length}`);
    
    if (failed === 0) {
      console.log("\n✨ All seeds completed successfully!");
      console.log("\n📋 Default credentials:");
      console.log("  Admin: admin@acme.com / password123");
      console.log("  Member: member@acme.com / password123");
      console.log("  Tenant: acme");
    } else if (successful > 0) {
      console.log("\n⚠️  Partial success - some seeds failed but core data is ready");
    } else {
      console.log("\n💥 Critical failure - no seeds completed");
      process.exit(1);
    }

    console.log("\n");

  } catch (error) {
    console.error("\n💥 Seed runner failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log("✅ Seed process complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed process failed:", error);
      process.exit(1);
    });
}

export default runSeeds;
export { runSeeds };
