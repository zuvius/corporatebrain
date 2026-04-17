import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revokeIntegration, IntegrationProvider } from "@/lib/integrations/oauth-framework";
import { syncAllIntegrations, syncIntegration } from "@/lib/integrations/sync-engine";

// GET /api/integrations - List all integrations for tenant
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;

    const data = await db
      .select({
        id: integrations.id,
        provider: integrations.provider,
        status: integrations.status,
        lastSyncedAt: integrations.lastSyncedAt,
        createdAt: integrations.createdAt,
        updatedAt: integrations.updatedAt,
      })
      .from(integrations)
      .where(eq(integrations.tenantId, tenantId));

    return NextResponse.json({ integrations: data });
  } catch (error) {
    console.error("List integrations error:", error);
    return NextResponse.json(
      { error: "Failed to list integrations" },
      { status: 500 }
    );
  }
}

// POST /api/integrations/sync - Sync all or specific integration
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const body = await req.json();
    const { integrationId, provider } = body;

    if (integrationId && provider) {
      // Sync specific integration
      const result = await syncIntegration(integrationId, provider as IntegrationProvider);
      return NextResponse.json({ result });
    } else {
      // Sync all integrations
      const results = await syncAllIntegrations(tenantId);
      return NextResponse.json({ results });
    }
  } catch (error) {
    console.error("Sync integrations error:", error);
    return NextResponse.json(
      { error: "Failed to sync integrations" },
      { status: 500 }
    );
  }
}

// DELETE /api/integrations - Revoke/disconnect integration
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider") as IntegrationProvider;

    if (!provider) {
      return NextResponse.json(
        { error: "Provider required" },
        { status: 400 }
      );
    }

    await revokeIntegration(tenantId, provider);

    return NextResponse.json({
      success: true,
      message: `${provider} disconnected successfully`,
    });
  } catch (error) {
    console.error("Revoke integration error:", error);
    return NextResponse.json(
      { error: "Failed to revoke integration" },
      { status: 500 }
    );
  }
}
