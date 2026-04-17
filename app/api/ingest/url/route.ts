import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { processUrlForIngestion, isFirecrawlConfigured } from "@/lib/ingestion/firecrawl";
import { processDocument } from "@/lib/ingestion/processor";

/**
 * POST /api/ingest/url
 * Ingest a URL into Corporate Brain using Firecrawl
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const tenantId = (session.user as any).tenantId as string;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    // Check if Firecrawl is configured
    if (!isFirecrawlConfigured()) {
      return NextResponse.json(
        { error: "Firecrawl is not configured. Please set FIRECRAWL_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { url, options } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(url);
      if (!["http:", "https:"].includes(validatedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Must be a valid http or https URL." },
        { status: 400 }
      );
    }

    // Create knowledge source entry
    const sourceId = uuidv4();
    await db.insert(knowledgeSources).values({
      id: sourceId,
      tenantId,
      type: "url",
      source: validatedUrl.toString(),
      title: validatedUrl.hostname,
      content: "",
      status: "processing",
      metadata: {
        userId,
        originalUrl: url,
        hostname: validatedUrl.hostname,
        pathname: validatedUrl.pathname,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Start async processing
    processUrlAsync(sourceId, validatedUrl.toString(), options).catch(console.error);

    return NextResponse.json({
      success: true,
      sourceId,
      message: "URL ingestion started",
      url: validatedUrl.toString(),
    });
  } catch (error) {
    console.error("URL ingestion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to ingest URL" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ingest/url?url=https://example.com
 * Check URL status or test scraping
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId as string;
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      // List all URL sources for tenant
      const sources = await db
        .select({
          id: knowledgeSources.id,
          source: knowledgeSources.source,
          title: knowledgeSources.title,
          status: knowledgeSources.status,
          createdAt: knowledgeSources.createdAt,
          metadata: knowledgeSources.metadata,
        })
        .from(knowledgeSources)
        .where(and(eq(knowledgeSources.tenantId, tenantId), eq(knowledgeSources.type, "url")));

      return NextResponse.json({ sources });
    }

    // Get specific URL source
    const [source] = await db
      .select({
        id: knowledgeSources.id,
        source: knowledgeSources.source,
        title: knowledgeSources.title,
        status: knowledgeSources.status,
        content: knowledgeSources.content,
        metadata: knowledgeSources.metadata,
        createdAt: knowledgeSources.createdAt,
        updatedAt: knowledgeSources.updatedAt,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.tenantId, tenantId),
          eq(knowledgeSources.type, "url"),
          eq(knowledgeSources.source, url)
        )
      )
      .limit(1);

    if (!source) {
      return NextResponse.json({ error: "URL source not found" }, { status: 404 });
    }

    return NextResponse.json({ source });
  } catch (error) {
    console.error("Get URL status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get URL status" },
      { status: 500 }
    );
  }
}

/**
 * Async URL processing function
 */
async function processUrlAsync(
  sourceId: string,
  url: string,
  options?: Record<string, any>
) {
  try {
    // Scrape URL using Firecrawl
    const scraped = await processUrlForIngestion(url, options);

    // Update with scraped content
    await db
      .update(knowledgeSources)
      .set({
        title: scraped.title,
        content: scraped.content,
        status: "extracting",
        metadata: {
          ...scraped.metadata,
        },
        updatedAt: new Date(),
      })
      .where(eq(knowledgeSources.id, sourceId));

    // Process for chunking and embedding
    const buffer = Buffer.from(scraped.content, "utf-8");
    await processDocument(sourceId, buffer, "text/plain");
  } catch (error) {
    console.error("Async URL processing error:", error);
    await db
      .update(knowledgeSources)
      .set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Processing failed",
        updatedAt: new Date(),
      })
      .where(eq(knowledgeSources.id, sourceId));
  }
}
