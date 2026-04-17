import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/client";
import { knowledgeSources, citations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // Get all knowledge sources
    const sources = await db
      .select({
        id: knowledgeSources.id,
        title: knowledgeSources.title,
        type: knowledgeSources.type,
        source: knowledgeSources.source,
      })
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.tenantId, tenantId),
          eq(knowledgeSources.status, "indexed")
        )
      );

    // Get citation relationships
    const citationData = await db
      .select({
        sourceId: citations.sourceId,
        messageId: citations.messageId,
      })
      .from(citations)
      .innerJoin(
        knowledgeSources,
        eq(citations.sourceId, knowledgeSources.id)
      )
      .where(eq(knowledgeSources.tenantId, tenantId));

    // Build nodes
    const nodes = sources.map((source) => ({
      id: source.id,
      name: source.title || "Untitled",
      type: getSourceType(source.type, source.source),
      connections: citationData.filter((c) => c.sourceId === source.id).length,
    }));

    // Build connections based on co-citation
    // Two sources are connected if they appear in the same conversation
    const connections: Array<{
      source: string;
      target: string;
      strength: number;
    }> = [];

    // Group citations by message to find co-citations
    const citationsByMessage = citationData.reduce((acc, citation) => {
      if (!acc[citation.messageId]) {
        acc[citation.messageId] = [];
      }
      acc[citation.messageId].push(citation.sourceId);
      return acc;
    }, {} as Record<string, string[]>);

    // Create connections from co-citations
    Object.values(citationsByMessage).forEach((sourceIds) => {
      for (let i = 0; i < sourceIds.length; i++) {
        for (let j = i + 1; j < sourceIds.length; j++) {
          const source1 = sourceIds[i];
          const source2 = sourceIds[j];
          
          // Check if connection already exists
          const existing = connections.find(
            (c) =>
              (c.source === source1 && c.target === source2) ||
              (c.source === source2 && c.target === source1)
          );

          if (existing) {
            existing.strength += 1;
          } else {
            connections.push({
              source: source1,
              target: source2,
              strength: 1,
            });
          }
        }
      }
    });

    // Normalize connection strength (0.1 to 1.0)
    const maxStrength = Math.max(...connections.map((c) => c.strength), 1);
    const normalizedConnections = connections.map((c) => ({
      ...c,
      strength: 0.1 + (c.strength / maxStrength) * 0.9,
    }));

    return NextResponse.json({
      nodes,
      connections: normalizedConnections,
    });
  } catch (error) {
    console.error("Knowledge graph error:", error);
    return NextResponse.json(
      { error: "Failed to generate knowledge graph" },
      { status: 500 }
    );
  }
}

function getSourceType(
  type: string,
  source: string
): "file" | "url" | "slack" | "notion" | "drive" {
  if (type === "integration") {
    if (source.includes("slack")) return "slack";
    if (source.includes("google_drive")) return "drive";
    if (source.includes("notion")) return "notion";
  }
  if (source.includes("http")) return "url";
  return "file";
}
