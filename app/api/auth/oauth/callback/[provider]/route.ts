import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForTokens,
  createIntegration,
  IntegrationProvider,
} from "@/lib/integrations/oauth-framework";

const VALID_PROVIDERS: IntegrationProvider[] = [
  "slack",
  "google_drive",
  "gmail",
  "notion",
  "microsoft_teams",
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider: providerParam } = await params;
    const provider = providerParam as IntegrationProvider;
    
    if (!VALID_PROVIDERS.includes(provider)) {
      return NextResponse.redirect(
        `/app/integrations?error=invalid_provider`
      );
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth error
    if (error) {
      console.error(`OAuth error from ${provider}:`, error);
      return NextResponse.redirect(
        `/app/integrations?error=${encodeURIComponent(error)}`
      );
    }

    // Validate state parameter (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value;
    const tenantId = cookieStore.get("oauth_tenant")?.value;

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        `/app/integrations?error=invalid_state`
      );
    }

    if (!tenantId) {
      return NextResponse.redirect(
        `/app/integrations?error=session_expired`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `/app/integrations?error=no_code`
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(provider, code);

    // Create or update integration
    await createIntegration({
      tenantId,
      provider,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      metadata: tokens.metadata,
    });

    // Clear OAuth cookies
    cookieStore.set("oauth_state", "", { maxAge: 0 });
    cookieStore.set("oauth_tenant", "", { maxAge: 0 });

    // Redirect to integrations page with success
    return NextResponse.redirect(
      `/app/integrations?success=${provider}_connected`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      `/app/integrations?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Unknown error"
      )}`
    );
  }
}
