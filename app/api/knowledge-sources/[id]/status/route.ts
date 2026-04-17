import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Get knowledge source status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const tenantId = (session?.user as any)?.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the source with status info
    const [source] = await db
      .select({
        id: knowledgeSources.id,
        status: knowledgeSources.status,
        title: knowledgeSources.title,
        type: knowledgeSources.type,
        createdAt: knowledgeSources.createdAt,
        updatedAt: knowledgeSources.updatedAt,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.id, id),
          eq(knowledgeSources.tenantId, tenantId),
        ),
      )
      .limit(1);

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: source.id,
      status: source.status,
      title: source.title,
      type: source.type,
      createdAt: source.createdAt,
      updatedAt: source.updatedAt,
    });
  } catch (error) {
    console.error("Get knowledge source status error:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 },
    );
  }
}
