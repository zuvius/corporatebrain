import { auth } from "@/lib/auth/auth";
import { createKnowledgeSource } from "@/lib/db/queries";
import { chunkText } from "@/lib/ingestion";
import { generateEmbeddings } from "@/lib/ai/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const ingestSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["text", "url", "slack", "drive", "notion"]),
  source: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ingestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { title, content, type, source, metadata } = parsed.data;
    const tenantId = session.user.tenantId;

    // Chunk the content
    const chunks = chunkText(content);

    // Process each chunk
    const knowledgeSources = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Generate embeddings
      const embedding = await generateEmbeddings(chunk);

      // Create knowledge source
      const source_record = await createKnowledgeSource({
        tenantId,
        type,
        source,
        title:
          chunks.length > 1
            ? `${title} (Part ${i + 1}/${chunks.length})`
            : title,
        content: chunk,
        metadata: metadata || {},
        status: "processed",
        chunkIndex: i,
        totalChunks: chunks.length,
        tokenCount: chunk.length / 4, // Rough estimate
        embedding,
        processedAt: new Date(),
      });

      knowledgeSources.push(source_record);
    }

    return NextResponse.json({
      success: true,
      data: {
        sources: knowledgeSources,
        chunks: chunks.length,
      },
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Failed to ingest content" },
      { status: 500 },
    );
  }
}
