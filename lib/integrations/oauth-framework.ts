/**
 * OAuth Framework for Corporate Brain Integrations
 * Supports Slack, Google Drive, Notion, Microsoft Teams
 */

import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export type IntegrationProvider =
  | "slack"
  | "google_drive"
  | "gmail"
  | "notion"
  | "microsoft_teams";

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
}

const OAUTH_CONFIGS: Record<IntegrationProvider, OAuthConfig> = {
  slack: {
    clientId: process.env.SLACK_CLIENT_ID || "",
    clientSecret: process.env.SLACK_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback/slack`,
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: ["channels:history", "channels:read", "files:read", "users:read"],
  },
  google_drive: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback/google`,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  },
  gmail: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback/gmail`,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  },
  notion: {
    clientId: process.env.NOTION_CLIENT_ID || "",
    clientSecret: process.env.NOTION_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback/notion`,
    authUrl: "https://api.notion.com/v1/oauth/authorize",
    tokenUrl: "https://api.notion.com/v1/oauth/token",
    scopes: [],
  },
  microsoft_teams: {
    clientId: process.env.MICROSOFT_CLIENT_ID || "",
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback/microsoft`,
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scopes: ["https://graph.microsoft.com/ChannelMessage.Read.All"],
  },
};

export function getOAuthUrl(
  provider: IntegrationProvider,
  state: string,
): string {
  const config = OAUTH_CONFIGS[provider];

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(" "),
    state,
    response_type: "code",
  });

  // Notion uses owner=user parameter
  if (provider === "notion") {
    params.append("owner", "user");
  }

  // Microsoft uses specific parameters
  if (provider === "microsoft_teams") {
    params.append("response_mode", "query");
  }

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  provider: IntegrationProvider,
  code: string,
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}> {
  const config = OAUTH_CONFIGS[provider];

  const body: Record<string, string> = {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(provider === "notion" && {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
      }),
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth token exchange failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : undefined,
    metadata: { ...data, scopes: data.scope },
  };
}

export async function createIntegration({
  tenantId,
  provider,
  accessToken,
  refreshToken,
  expiresAt,
  metadata = {},
}: {
  tenantId: string;
  provider: IntegrationProvider;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}) {
  const [existing] = await db
    .select({ id: integrations.id })
    .from(integrations)
    .where(
      and(
        eq(integrations.tenantId, tenantId),
        eq(integrations.provider, provider),
      ),
    )
    .limit(1);

  if (existing) {
    // Update existing integration
    await db
      .update(integrations)
      .set({
        accessToken,
        refreshToken: refreshToken || null,
        tokenExpiresAt: expiresAt || null,
        status: "active",
        settings: metadata,
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, existing.id));

    return existing.id;
  }

  // Create new integration
  const id = uuidv4();
  await db.insert(integrations).values({
    id,
    tenantId,
    provider,
    accessToken,
    refreshToken: refreshToken || null,
    tokenExpiresAt: expiresAt || null,
    status: "active",
    settings: metadata,
  });

  return id;
}

export async function revokeIntegration(
  tenantId: string,
  provider: IntegrationProvider,
) {
  const [integration] = await db
    .select({ id: integrations.id, accessToken: integrations.accessToken })
    .from(integrations)
    .where(
      and(
        eq(integrations.tenantId, tenantId),
        eq(integrations.provider, provider),
        eq(integrations.status, "active"),
      ),
    )
    .limit(1);

  if (!integration) {
    throw new Error("Integration not found");
  }

  // Revoke token with provider (best effort)
  try {
    if (integration.accessToken) {
      await revokeTokenWithProvider(provider, integration.accessToken);
    }
  } catch (error) {
    console.warn(`Failed to revoke ${provider} token:`, error);
  }

  // Mark as disconnected in database
  await db
    .update(integrations)
    .set({
      status: "disconnected",
      accessToken: "",
      refreshToken: null,
      updatedAt: new Date(),
    })
    .where(eq(integrations.id, integration.id));
}

async function revokeTokenWithProvider(
  provider: IntegrationProvider,
  token: string,
) {
  const revokeUrls: Record<IntegrationProvider, string | null> = {
    slack: "https://slack.com/api/auth.revoke",
    google_drive: "https://oauth2.googleapis.com/revoke",
    gmail: "https://oauth2.googleapis.com/revoke",
    notion: null, // Notion doesn't have a revoke endpoint
    microsoft_teams: `https://login.microsoftonline.com/common/oauth2/v2.0/logout`,
  };

  const url = revokeUrls[provider];
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }).toString(),
  });
}

export async function refreshAccessToken(
  integrationId: string,
): Promise<string> {
  const [integration] = await db
    .select({
      provider: integrations.provider,
      refreshToken: integrations.refreshToken,
    })
    .from(integrations)
    .where(eq(integrations.id, integrationId))
    .limit(1);

  if (!integration || !integration.refreshToken) {
    throw new Error("Integration not found or no refresh token available");
  }

  const config = OAUTH_CONFIGS[integration.provider as IntegrationProvider];

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();

  await db
    .update(integrations)
    .set({
      accessToken: data.access_token,
      tokenExpiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(integrations.id, integrationId));

  return data.access_token;
}
