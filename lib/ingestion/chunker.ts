/**
 * Text chunking utilities for document processing
 */

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
  separator?: string;
}

export function chunkText(
  text: string,
  options: ChunkOptions = {}
): string[] {
  const { chunkSize = 1000, overlap = 200, separator = "\n" } = options;

  // Handle empty or invalid text
  if (!text || text.length === 0) {
    return [];
  }

  if (text.length <= chunkSize) {
    return [text];
  }

  // Ensure overlap is smaller than chunkSize to prevent infinite loops
  const safeOverlap = Math.min(overlap, chunkSize - 1);

  const chunks: string[] = [];
  let start = 0;
  const maxChunks = 10000; // Safety limit

  while (start < text.length && chunks.length < maxChunks) {
    let end = Math.min(start + chunkSize, text.length);

    // Try to find a natural break point
    if (end < text.length) {
      const nextBreak = text.lastIndexOf(separator, end);
      if (nextBreak > start) {
        end = nextBreak + separator.length;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move forward, accounting for overlap
    const nextStart = end - safeOverlap;
    // Prevent infinite loop if we're not making progress
    if (nextStart <= start) {
      start = end; // Force progress
    } else {
      start = nextStart;
    }
  }

  return chunks;
}

export function chunkByParagraphs(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  return paragraphs;
}

export function chunkBySentences(text: string, maxSentences = 5): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];

  for (let i = 0; i < sentences.length; i += maxSentences) {
    chunks.push(sentences.slice(i, i + maxSentences).join(" ").trim());
  }

  return chunks;
}

export function estimateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English
  return Math.ceil(text.length / 4);
}

export interface ChunkedDocument {
  text: string;
  index: number;
  total: number;
}

export function chunkDocument(
  text: string,
  options: ChunkOptions = {}
): ChunkedDocument[] {
  const { chunkSize = 1000, overlap = 200 } = options;
  
  const chunks = chunkText(text, { chunkSize, overlap });
  
  return chunks.map((text, index) => ({
    text,
    index,
    total: chunks.length,
  }));
}

export function truncateToMaxTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) {
    return text;
  }

  // Try to truncate at a sentence boundary
  const truncated = text.slice(0, maxChars);
  const lastSentence = truncated.lastIndexOf(".");

  if (lastSentence > maxChars * 0.8) {
    return truncated.slice(0, lastSentence + 1);
  }

  return truncated;
}
