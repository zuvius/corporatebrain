import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Check if a document with the given hash already exists
 * Used for content-based duplicate detection
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash");

    if (!hash) {
      return NextResponse.json({ error: "Hash parameter required" }, { status: 400 });
    }

    const tenantId = (session.user as any).tenantId;

    // Check if a source with this hash exists for this tenant
    const existing = await db.query.knowledgeSources.findFirst({
      where: and(
        eq(knowledgeSources.tenantId, tenantId),
        eq(knowledgeSources.metadata, { contentHash: hash })
      ),
    });

    return NextResponse.json({
      exists: !!existing,
      sourceId: existing?.id,
      sourceName: existing?.title,
    });
  } catch (error) {
    console.error("Error checking document hash:", error);
    return NextResponse.json(
      { error: "Failed to check document" },
      { status: 500 }
    );
  }
}
