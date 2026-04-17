import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { requireVerification, canConnectIntegration } from "@/lib/auth/verification";

const connectSchema = z.object({
  provider: z.enum(["slack", "gdrive", "notion", "teams", "github", "confluence"]),
});

// OAuth URLs for each provider (placeholder - would be real OAuth endpoints)
const OAUTH_URLS: Record<string, string> = {
  slack: "https://slack.com/oauth/v2/authorize",
  gdrive: "https://accounts.google.com/o/oauth2/v2/auth",
  notion: "https://api.notion.com/v1/oauth/authorize",
  teams: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  github: "https://github.com/login/oauth/authorize",
  confluence: "https://auth.atlassian.com/authorize",
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; tenantId: string; emailVerified: string | null };
    const isVerified = !!user.emailVerified;
    
    const body = await req.json();
    
    const result = connectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid provider", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { provider } = result.data;
    const tenantId = user.tenantId;

    // Check current integration count for teaser mode
    const existingIntegrations = await db.query.integrations.findMany({
      where: eq(integrations.tenantId, tenantId),
    });

    const canConnect = canConnectIntegration(
      isVerified,
      existingIntegrations.length,
      provider
    );

    if (!canConnect.allowed) {
      return NextResponse.json(
        { 
          error: canConnect.reason,
          code: isVerified ? "LIMIT_REACHED" : "TEASER_LIMIT",
          teaser: !isVerified,
        },
        { status: 403 }
      );
    }

    // Check if already connected
    const existing = await db.query.integrations.findFirst({
      where: and(
        eq(integrations.tenantId, user.tenantId),
        eq(integrations.provider, provider)
      ),
    });

    if (existing?.status === "connected") {
      return NextResponse.json(
        { error: "Integration already connected" },
        { status: 400 }
      );
    }

    // Create or update integration record as "pending"
    if (existing) {
      await db
        .update(integrations)
        .set({
          status: "pending",
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, existing.id));
    } else {
      await db.insert(integrations).values({
        tenantId: user.tenantId,
        provider,
        status: "pending",
        settings: {},
      });
    }

    // Return OAuth URL (in production, this would include client_id, redirect_uri, etc.)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/integrations/callback/${provider}`;
    
    // For now, return a mock OAuth URL (real implementation would construct proper OAuth URL)
    const oauthUrl = `${OAUTH_URLS[provider]}?client_id=PLACEHOLDER&redirect_uri=${encodeURIComponent(redirectUri)}&state=${user.tenantId}`;

    return NextResponse.json({
      success: true,
      provider,
      oauthUrl,
      message: "OAuth flow initiated",
    });
  } catch (error) {
    console.error("[Integrations Connect] Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate integration connection" },
      { status: 500 }
    );
  }
}
