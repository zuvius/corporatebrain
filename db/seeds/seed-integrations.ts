import { db } from "../../lib/db/client";
import { integrations } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Integrations
 * Creates sample integration configurations
 * Idempotent - checks before insert, skips if exists
 */

export interface SeedIntegration {
  provider: string;
  status: string;
  settings: Record<string, unknown>;
}

export async function seedIntegrations(tenantId: string) {
  console.log("🌱 [seed-integrations] Starting...");

  const integrationsToSeed: SeedIntegration[] = [
    {
      provider: "slack",
      status: "disconnected",
      settings: { channels: ["#general", "#engineering"] },
    },
    {
      provider: "google-drive",
      status: "disconnected",
      settings: { folders: ["Company Docs", "Engineering"] },
    },
    {
      provider: "notion",
      status: "disconnected",
      settings: { pages: ["Wiki", "Projects"] },
    },
  ];

  const createdIntegrations = [];

  for (const integrationData of integrationsToSeed) {
    try {
      // Idempotent check - query by provider within tenant context
      // Note: If provider is not unique per tenant, you may need additional logic
      const existing = await db.query.integrations.findFirst({
        where: eq(integrations.provider, integrationData.provider),
      });

      if (existing) {
        console.log(
          `  ⏭️  Integration '${integrationData.provider}' already exists, skipping`,
        );
        createdIntegrations.push(existing);
        continue;
      }

      const [integration] = await db
        .insert(integrations)
        .values({
          tenantId,
          provider: integrationData.provider,
          status: integrationData.status,
          settings: JSON.stringify(integrationData.settings),
        })
        .returning();

      console.log(`  ✅ Created integration: ${integration.provider}`);
      createdIntegrations.push(integration);
    } catch (error) {
      console.error(
        `  ❌ Failed to seed integration ${integrationData.provider}:`,
        error,
      );
      // Continue with other integrations - never crash
    }
  }

  console.log(
    `🌱 [seed-integrations] Completed: ${createdIntegrations.length} integrations ready`,
  );
  return createdIntegrations;
}

export default seedIntegrations;
