import { db } from "../lib/db/client";
import { sql } from "drizzle-orm";

/**
 * Database reset script
 * WARNING: This will delete all data!
 */

async function main() {
  console.log("⚠️  Resetting database...\n");

  try {
    // Drop tables in reverse dependency order
    await db.execute(sql`DROP TABLE IF EXISTS citations CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS messages CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS conversations CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS audit_logs CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS integrations CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS knowledge_sources CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS verification_tokens CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS tenants CASCADE`);

    console.log("✅ All tables dropped");
    console.log("✅ Ready for fresh migrations\n");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
