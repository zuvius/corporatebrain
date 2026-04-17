import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { extractTextFromDocument } from "./parsers/document";
import { chunkDocument } from "./chunker";
import { generateEmbeddings } from "@/lib/ai/client";

export async function processDocument(
  sourceId: string,
  buffer: Buffer,
  contentType: string,
) {
  try {
    // Step 1: Extract text using Unstructured.io or native parsers
    const extracted = await extractTextFromDocument(buffer, contentType);

    // Update status
    await db
      .update(knowledgeSources)
      .set({
        status: "extracting",
        content: extracted.text,
        metadata: {
          pages: extracted.metadata?.pages,
          words: extracted.text.split(/\s+/).length,
        },
      })
      .where(eq(knowledgeSources.id, sourceId));

    // Step 2: Chunk the document
    const chunks = chunkDocument(extracted.text, {
      chunkSize: 1000,
      overlap: 200,
    });

    await db
      .update(knowledgeSources)
      .set({
        status: "chunking",
        totalChunks: chunks.length,
      })
      .where(eq(knowledgeSources.id, sourceId));

    // Step 3: Generate embeddings for each chunk
    const totalTokens = Math.ceil(extracted.text.length / 4);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbeddings(chunk.text);

      // Store chunk with embedding (simplified - in production, store in separate table)
      await db
        .update(knowledgeSources)
        .set({
          status: "indexing",
          chunkIndex: i + 1,
          embedding: embedding as any,
          tokenCount: totalTokens,
        })
        .where(eq(knowledgeSources.id, sourceId));
    }

    // Step 4: Mark as complete
    await db
      .update(knowledgeSources)
      .set({
        status: "indexed",
        processedAt: new Date(),
      })
      .where(eq(knowledgeSources.id, sourceId));

    console.log(
      `✓ Document ${sourceId} processed: ${chunks.length} chunks indexed`,
    );
  } catch (error) {
    console.error(`✗ Document ${sourceId} processing failed:`, error);

    await db
      .update(knowledgeSources)
      .set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
      .where(eq(knowledgeSources.id, sourceId));
  }
}
