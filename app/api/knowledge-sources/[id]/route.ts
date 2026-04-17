import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteFromStorage } from "@/lib/storage/upload";

// DELETE - Remove a knowledge source
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const tenantId = (session?.user as any)?.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the source belongs to this tenant and get file details
    const [source] = await db
      .select({ 
        id: knowledgeSources.id,
        title: knowledgeSources.title,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.id, id),
          eq(knowledgeSources.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    // Delete file from storage first (if it exists)
    if (source.title) {
      await deleteFromStorage({
        id: source.id,
        filename: source.title,
      });
    }

    // Delete the database record
    await db
      .delete(knowledgeSources)
      .where(eq(knowledgeSources.id, id));

    return NextResponse.json({ 
      success: true,
      message: "Knowledge source and associated file deleted successfully"
    });
  } catch (error) {
    console.error("Delete knowledge source error:", error);
    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 }
    );
  }
}

// GET - Get knowledge source details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const tenantId = (session?.user as any)?.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [source] = await db
      .select({
        id: knowledgeSources.id,
        title: knowledgeSources.title,
        type: knowledgeSources.type,
        source: knowledgeSources.source,
        status: knowledgeSources.status,
        errorMessage: knowledgeSources.errorMessage,
        chunkIndex: knowledgeSources.chunkIndex,
        totalChunks: knowledgeSources.totalChunks,
        tokenCount: knowledgeSources.tokenCount,
        processedAt: knowledgeSources.processedAt,
        createdAt: knowledgeSources.createdAt,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.id, id),
          eq(knowledgeSources.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(source);
  } catch (error) {
    console.error("Get knowledge source error:", error);
    return NextResponse.json(
      { error: "Failed to get source" },
      { status: 500 }
    );
  }
}

// PATCH - Reindex (re-trigger processing)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const tenantId = (session?.user as any)?.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const { action } = body;

    if (action !== "reindex") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Verify the source belongs to this tenant
    const [source] = await db
      .select({ id: knowledgeSources.id, content: knowledgeSources.content })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.id, id),
          eq(knowledgeSources.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    // Reset status to trigger reprocessing
    await db
      .update(knowledgeSources)
      .set({
        status: "pending",
        errorMessage: null,
        processedAt: null,
      })
      .where(eq(knowledgeSources.id, id));

    // TODO: Trigger reprocessing in background
    // For now, just return success

    return NextResponse.json({ 
      success: true, 
      message: "Reindexing queued" 
    });
  } catch (error) {
    console.error("Reindex knowledge source error:", error);
    return NextResponse.json(
      { error: "Failed to reindex source" },
      { status: 500 }
    );
  }
}
