/**
 * Integration Sync Engine
 * Fetches data from connected integrations and ingests into Corporate Brain
 */

import { db } from "@/lib/db/client";
import { integrations, knowledgeSources } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { refreshAccessToken, IntegrationProvider } from "./oauth-framework";
import { processDocument } from "@/lib/ingestion/processor";

export interface SyncResult {
  integrationId: string;
  provider: IntegrationProvider;
  itemsSynced: number;
  errors: string[];
}

export async function syncAllIntegrations(tenantId: string): Promise<SyncResult[]> {
  const activeIntegrations = await db
    .select({
      id: integrations.id,
      provider: integrations.provider,
    })
    .from(integrations)
    .where(
      and(
        eq(integrations.tenantId, tenantId),
        eq(integrations.status, "active")
      )
    );

  const results: SyncResult[] = [];

  for (const integration of activeIntegrations) {
    try {
      const result = await syncIntegration(integration.id, integration.provider as IntegrationProvider);
      results.push(result);
    } catch (error) {
      results.push({
        integrationId: integration.id,
        provider: integration.provider as IntegrationProvider,
        itemsSynced: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    }
  }

  return results;
}

export async function syncIntegration(
  integrationId: string,
  provider: IntegrationProvider
): Promise<SyncResult> {
  const result: SyncResult = {
    integrationId,
    provider,
    itemsSynced: 0,
    errors: [],
  };

  try {
    // Ensure access token is fresh
    const accessToken = await refreshAccessToken(integrationId);

    switch (provider) {
      case "slack":
        await syncSlack(integrationId, accessToken, result);
        break;
      case "google_drive":
        await syncGoogleDrive(integrationId, accessToken, result);
        break;
      case "gmail":
        await syncGmail(integrationId, accessToken, result);
        break;
      case "notion":
        await syncNotion(integrationId, accessToken, result);
        break;
      case "microsoft_teams":
        await syncMicrosoftTeams(integrationId, accessToken, result);
        break;
    }

    // Update last synced timestamp
    await db
      .update(integrations)
      .set({ lastSyncedAt: new Date() })
      .where(eq(integrations.id, integrationId));
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : "Sync failed");
  }

  return result;
}

async function syncSlack(
  integrationId: string,
  accessToken: string,
  result: SyncResult
) {
  // Fetch channels
  const channelsRes = await fetch("https://slack.com/api/conversations.list", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const channelsData = await channelsRes.json();

  if (!channelsData.ok) {
    throw new Error(`Slack API error: ${channelsData.error}`);
  }

  // Fetch messages from each channel (last 7 days)
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

  for (const channel of channelsData.channels.slice(0, 5)) { // Limit to 5 channels for now
    try {
      const messagesRes = await fetch(
        `https://slack.com/api/conversations.history?channel=${channel.id}&oldest=${sevenDaysAgo}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const messagesData = await messagesRes.json();

      if (messagesData.messages && messagesData.messages.length > 0) {
        const content = formatSlackMessages(channel.name, messagesData.messages);
        await ingestIntegrationContent(integrationId, "slack", channel.name, content, {
          channelId: channel.id,
          messageCount: messagesData.messages.length,
        });
        result.itemsSynced++;
      }
    } catch (error) {
      result.errors.push(`Channel ${channel.name}: ${error}`);
    }
  }
}

async function syncGoogleDrive(
  integrationId: string,
  accessToken: string,
  result: SyncResult
) {
  // Search for supported files (docs, pdfs, txt)
  const query = "mimeType='application/pdf' or mimeType='application/vnd.google-apps.document' or mimeType='text/plain'";
  
  const filesRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  const filesData = await filesRes.json();

  for (const file of filesData.files || []) {
    try {
      let content = "";

      if (file.mimeType === "application/vnd.google-apps.document") {
        // Export Google Doc as plain text
        const exportRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        content = await exportRes.text();
      } else {
        // Download file content
        const downloadRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        content = await downloadRes.text();
      }

      await ingestIntegrationContent(integrationId, "google_drive", file.name, content, {
        fileId: file.id,
        mimeType: file.mimeType,
      });
      result.itemsSynced++;
    } catch (error) {
      result.errors.push(`File ${file.name}: ${error}`);
    }
  }
}

async function syncNotion(
  integrationId: string,
  accessToken: string,
  result: SyncResult
) {
  // Search for pages
  const searchRes = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 50 }),
  });
  
  const searchData = await searchRes.json();

  for (const page of searchData.results || []) {
    try {
      // Get page content
      const blocksRes = await fetch(
        `https://api.notion.com/v1/blocks/${page.id}/children`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Notion-Version": "2022-06-28",
          },
        }
      );
      const blocksData = await blocksRes.json();

      const content = formatNotionBlocks(blocksData.results);
      
      await ingestIntegrationContent(
        integrationId,
        "notion",
        page.properties?.title?.title?.[0]?.plain_text || "Untitled",
        content,
        { pageId: page.id }
      );
      result.itemsSynced++;
    } catch (error) {
      result.errors.push(`Page ${page.id}: ${error}`);
    }
  }
}

async function syncMicrosoftTeams(
  integrationId: string,
  accessToken: string,
  result: SyncResult
) {
  // Get teams
  const teamsRes = await fetch("https://graph.microsoft.com/v1.0/me/joinedTeams", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const teamsData = await teamsRes.json();

  for (const team of teamsData.value || []) {
    try {
      // Get channels
      const channelsRes = await fetch(
        `https://graph.microsoft.com/v1.0/teams/${team.id}/channels`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const channelsData = await channelsRes.json();

      for (const channel of channelsData.value || []) {
        // Get messages (last 7 days)
        const messagesRes = await fetch(
          `https://graph.microsoft.com/v1.0/teams/${team.id}/channels/${channel.id}/messages?$filter=createdDateTime gt ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const messagesData = await messagesRes.json();

        if (messagesData.value && messagesData.value.length > 0) {
          const content = formatTeamsMessages(team.displayName, channel.displayName, messagesData.value);
          await ingestIntegrationContent(
            integrationId,
            "microsoft_teams",
            `${team.displayName} - ${channel.displayName}`,
            content,
            { teamId: team.id, channelId: channel.id }
          );
          result.itemsSynced++;
        }
      }
    } catch (error) {
      result.errors.push(`Team ${team.displayName}: ${error}`);
    }
  }
}

async function ingestIntegrationContent(
  integrationId: string,
  source: string,
  title: string,
  content: string,
  metadata: Record<string, any>
) {
  // Get integration details for tenantId
  const [integration] = await db
    .select({ tenantId: integrations.tenantId })
    .from(integrations)
    .where(eq(integrations.id, integrationId))
    .limit(1);

  if (!integration) throw new Error("Integration not found");

  const sourceId = uuidv4();
  
  // Create knowledge source
  await db.insert(knowledgeSources).values({
    id: sourceId,
    tenantId: integration.tenantId,
    type: "integration",
    source: `${source}:${integrationId}`,
    title,
    content,
    status: "processing",
    metadata: {
      ...metadata,
      integrationId,
      source,
    },
  });

  // Process for chunking and embedding
  const buffer = Buffer.from(content, "utf-8");
  processDocument(sourceId, buffer, "text/plain").catch(console.error);
}

function formatSlackMessages(channelName: string, messages: any[]): string {
  const header = `# Slack Channel: ${channelName}\n\n`;
  const formatted = messages
    .filter((m) => m.type === "message" && !m.subtype)
    .map((m) => `**${m.user}**: ${m.text}`)
    .join("\n\n");
  return header + formatted;
}

function formatNotionBlocks(blocks: any[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.paragraph.rich_text.map((t: any) => t.plain_text).join("");
        case "heading_1":
          return `# ${block.heading_1.rich_text.map((t: any) => t.plain_text).join("")}`;
        case "heading_2":
          return `## ${block.heading_2.rich_text.map((t: any) => t.plain_text).join("")}`;
        case "bulleted_list_item":
          return `- ${block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join("")}`;
        default:
          return "";
      }
    })
    .join("\n\n");
}

function formatTeamsMessages(teamName: string, channelName: string, messages: any[]): string {
  const header = `# Microsoft Teams: ${teamName} - ${channelName}\n\n`;
  const formatted = messages
    .map((m) => `**${m.from?.user?.displayName || "Unknown"}**: ${m.body?.content || ""}`)
    .join("\n\n");
  return header + formatted;
}

async function syncGmail(
  integrationId: string,
  accessToken: string,
  result: SyncResult
) {
  // Fetch recent emails (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Search for emails after date
  const searchQuery = `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)}`;

  const messagesRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const messagesData = await messagesRes.json();

  if (!messagesData.messages || messagesData.messages.length === 0) {
    return;
  }

  // Fetch details for each message
  for (const messageRef of messagesData.messages.slice(0, 20)) { // Limit to 20 emails
    try {
      const emailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const email = await emailRes.json();
      const { subject, from, date, body } = extractEmailData(email);

      if (body) {
        const content = formatGmailEmail(subject, from, date, body);
        await ingestIntegrationContent(integrationId, "gmail", subject, content, {
          messageId: messageRef.id,
          from,
          date,
          threadId: email.threadId,
        });
        result.itemsSynced++;
      }

      // Fetch attachments if any
      if (email.payload?.parts) {
        for (const part of email.payload.parts) {
          if (part.filename && part.body?.attachmentId) {
            try {
              const attachmentRes = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}/attachments/${part.body.attachmentId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );
              const attachmentData = await attachmentRes.json();

              if (attachmentData.data) {
                const buffer = Buffer.from(attachmentData.data, "base64url");
                // Process attachment as document
                const attachmentSourceId = uuidv4();
                const [integration] = await db
                  .select({ tenantId: integrations.tenantId })
                  .from(integrations)
                  .where(eq(integrations.id, integrationId))
                  .limit(1);

                if (integration) {
                  await db.insert(knowledgeSources).values({
                    id: attachmentSourceId,
                    tenantId: integration.tenantId,
                    type: "document",
                    source: `gmail-attachment:${part.filename}`,
                    title: `${subject} - ${part.filename}`,
                    content: `[Attachment from email: ${subject}]`,
                    status: "processing",
                    metadata: {
                      integrationId,
                      emailSubject: subject,
                      filename: part.filename,
                      messageId: messageRef.id,
                    },
                  });

                  // Process document for extraction
                  processDocument(attachmentSourceId, buffer, part.mimeType || "application/octet-stream")
                    .catch(console.error);
                }
              }
            } catch (attachmentError) {
              result.errors.push(`Attachment ${part.filename}: ${attachmentError}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Email ${messageRef.id}: ${error}`);
    }
  }
}

function extractEmailData(email: any): { subject: string; from: string; date: string; body: string } {
  const headers = email.payload?.headers || [];
  const subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";
  const from = headers.find((h: any) => h.name === "From")?.value || "Unknown";
  const date = headers.find((h: any) => h.name === "Date")?.value || "";

  // Extract body from parts
  let body = "";
  if (email.payload?.parts) {
    const textPart = email.payload.parts.find((p: any) => p.mimeType === "text/plain");
    if (textPart?.body?.data) {
      body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
    }
  } else if (email.payload?.body?.data) {
    body = Buffer.from(email.payload.body.data, "base64").toString("utf-8");
  }

  return { subject, from, date, body };
}

function formatGmailEmail(subject: string, from: string, date: string, body: string): string {
  return `# Email: ${subject}\n\n**From:** ${from}\n**Date:** ${date}\n\n${body}`;
}
