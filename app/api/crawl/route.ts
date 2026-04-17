import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { crawlUrl } from "@/lib/ingestion/crawler";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const crawlSchema = z.object({
  url: z.string().url(),
  tenantId: z.string().optional(),
  maxPages: z.number().min(1).max(100).default(10),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, tenantId, maxPages } = crawlSchema.parse(body);

    const sourceId = uuidv4();

    // Create knowledge source record
    await db.insert(knowledgeSources).values({
      id: sourceId,
      tenantId: tenantId || (session.user as any).tenantId,
      title: url,
      type: "url",
      source: url,
      status: "crawling",
      metadata: {
        maxPages,
        crawledBy: session.user.id,
      },
    });

    // Start crawling asynchronously
    crawlUrl(sourceId, url, { maxPages }).catch(console.error);

    return NextResponse.json({
      success: true,
      sourceId,
      status: "crawling",
      message: "Crawl started",
    });
  } catch (error) {
    console.error("Crawl initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to start crawl" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sourceId = searchParams.get("sourceId");

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId required" },
        { status: 400 }
      );
    }

    const [source] = await db
      .select({
        id: knowledgeSources.id,
        status: knowledgeSources.status,
        content: knowledgeSources.content,
        processedAt: knowledgeSources.processedAt,
        errorMessage: knowledgeSources.errorMessage,
        metadata: knowledgeSources.metadata,
        sourceUrl: knowledgeSources.source,
      })
      .from(knowledgeSources)
      .where(eq(knowledgeSources.id, sourceId))
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    const metadata = source.metadata as { pagesCrawled?: number } | null;

    return NextResponse.json({
      sourceId,
      status: source.status,
      url: source.sourceUrl,
      pagesCrawled: metadata?.pagesCrawled || 0,
      processedAt: source.processedAt,
      error: source.errorMessage,
    });
  } catch (error) {
    console.error("Status check failed:", error);
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}

import { eq } from "drizzle-orm";
