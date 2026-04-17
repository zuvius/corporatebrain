import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getOAuthUrl, IntegrationProvider } from "@/lib/integrations/oauth-framework";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const VALID_PROVIDERS: IntegrationProvider[] = [
  "slack",
  "google_drive",
  "gmail",
  "notion",
  "microsoft_teams",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider: providerParam } = await params;
    const provider = providerParam as IntegrationProvider;
    
    if (!VALID_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    // Generate state for CSRF protection
    const state = uuidv4();
    
    // Store state in cookie (short-lived)
    const cookieStore = await cookies();
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    // Store tenant ID in cookie for callback
    cookieStore.set("oauth_tenant", (session.user as any).tenantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
    });

    // Redirect to provider's OAuth page
    const oauthUrl = getOAuthUrl(provider, state);
    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 }
    );
  }
}
