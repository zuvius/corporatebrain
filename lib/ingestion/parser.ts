import { generateEmbeddings } from "@/lib/ai";

export async function processDocument(
  content: string,
  metadata: Record<string, any>
): Promise<Array<{ content: string; embedding: number[]; metadata: Record<string, any> }>> {
  // Chunk the content
  const chunks = chunkText(content);

  // Process each chunk
  const processedChunks = await Promise.all(
    chunks.map(async (chunk, index) => {
      const embedding = await generateEmbeddings(chunk);

      return {
        content: chunk,
        embedding,
        metadata: {
          ...metadata,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      };
    })
  );

  return processedChunks;
}

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Try to find a natural break point
    if (end < text.length) {
      const nextBreak = text.lastIndexOf("\n", end);
      if (nextBreak > start) {
        end = nextBreak + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 0);
}
