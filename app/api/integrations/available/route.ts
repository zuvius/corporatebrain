import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const AVAILABLE_INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    description: "Sync messages and channels",
    icon: "💬",
    popular: true,
    category: "communication",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    description: "Index documents and files",
    icon: "📁",
    popular: true,
    category: "storage",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Connect pages and databases",
    icon: "📝",
    popular: true,
    category: "knowledge",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Sync team conversations",
    icon: "👥",
    popular: false,
    category: "communication",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link repositories and docs",
    icon: "💻",
    popular: false,
    category: "development",
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Import wiki pages",
    icon: "📄",
    popular: false,
    category: "knowledge",
  },
];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; tenantId: string };

    // Get connected integrations for this tenant
    const connectedIntegrations = await db.query.integrations.findMany({
      where: eq(integrations.tenantId, user.tenantId),
      columns: {
        provider: true,
        status: true,
      },
    });

    const connectedMap = new Map(
      connectedIntegrations.map((i) => [i.provider, i.status]),
    );

    // Merge available with connection status
    const integrationsWithStatus = AVAILABLE_INTEGRATIONS.map(
      (integration) => ({
        ...integration,
        status: connectedMap.get(integration.id) || "disconnected",
      }),
    );

    return NextResponse.json({
      integrations: integrationsWithStatus,
    });
  } catch (error) {
    console.error("[Integrations Available] Error:", error);
    return NextResponse.json(
      { error: "Failed to get available integrations" },
      { status: 500 },
    );
  }
}
