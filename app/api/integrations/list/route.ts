import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TEASER_LIMITS, FULL_ACCESS_LIMITS } from "@/lib/auth/verification";

const ALL_PROVIDERS = [
  { id: "slack", name: "Slack", icon: "slack", description: "Connect team conversations", category: "communication" },
  { id: "gdrive", name: "Google Drive", icon: "gdrive", description: "Access documents and files", category: "storage" },
  { id: "notion", name: "Notion", icon: "notion", description: "Sync workspace pages", category: "knowledge" },
  { id: "confluence", name: "Confluence", icon: "confluence", description: "Team documentation", category: "knowledge" },
  { id: "github", name: "GitHub", icon: "github", description: "Code repositories", category: "development" },
  { id: "teams", name: "Microsoft Teams", icon: "teams", description: "Microsoft 365 integration", category: "communication" },
];

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { 
      id: string; 
      tenantId: string; 
      emailVerified: string | null;
    };
    const isVerified = !!user.emailVerified;
    const tenantId = user.tenantId;

    // Get connected integrations for this tenant
    const connected = await db.query.integrations.findMany({
      where: eq(integrations.tenantId, tenantId),
    });

    const connectedMap = new Map(connected.map(i => [i.provider, i]));
    const connectedCount = connected.length;

    // Determine limits based on verification status
    const limits = isVerified ? FULL_ACCESS_LIMITS : TEASER_LIMITS;
    const remainingSlots = Math.max(0, limits.maxIntegrations - connectedCount);

    // Build providers list with availability status
    const providers = ALL_PROVIDERS.map(provider => {
      const existing = connectedMap.get(provider.id);
      const isConnected = existing?.status === "connected";
      
      // Check if this provider is allowed in teaser mode
      const isAllowedInTeaser = limits.allowedProviders.includes(provider.id);
      
      // Determine if this provider can be connected
      let canConnect = true;
      let unavailableReason = null;

      if (!isVerified) {
        if (!isAllowedInTeaser) {
          canConnect = false;
          unavailableReason = "Available after email verification";
        } else if (remainingSlots <= 0 && !isConnected) {
          canConnect = false;
          unavailableReason = `Teaser limit: ${limits.maxIntegrations} integrations max`;
        }
      }

      return {
        ...provider,
        status: isConnected ? "connected" : (existing?.status || "disconnected"),
        isConnected,
        canConnect,
        unavailableReason,
        isTeaserRestricted: !isVerified && !isAllowedInTeaser,
        connectedAt: existing?.connectedAt,
      };
    });

    return NextResponse.json({
      providers,
      connectedCount,
      maxIntegrations: limits.maxIntegrations,
      remainingSlots,
      isVerified,
      teaserMode: !isVerified,
      allowedTeaserProviders: TEASER_LIMITS.allowedProviders,
    });
  } catch (error) {
    console.error("[Integrations List] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}
