import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { chunkDocument } from "./chunker";
import { generateEmbeddings } from "@/lib/ai/client";

interface CrawlOptions {
  maxPages?: number;
  includePaths?: string[];
  excludePaths?: string[];
}

export async function crawlUrl(
  sourceId: string,
  url: string,
  options: CrawlOptions = {},
) {
  const { maxPages = 10 } = options;

  try {
    // Use Firecrawl API (or similar web scraping service)
    const crawlResult = await firecrawlScrape(url, { maxPages });

    await db
      .update(knowledgeSources)
      .set({
        status: "extracting",
        content: crawlResult.markdown,
        metadata: {
          pagesCrawled: crawlResult.pages.length,
          title: crawlResult.title,
        },
      })
      .where(eq(knowledgeSources.id, sourceId));

    // Chunk and embed
    const chunks = chunkDocument(crawlResult.markdown, {
      chunkSize: 1000,
      overlap: 200,
    });

    await db
      .update(knowledgeSources)
      .set({
        status: "indexing",
        totalChunks: chunks.length,
      })
      .where(eq(knowledgeSources.id, sourceId));

    // Generate embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbeddings(chunk.text);

      await db
        .update(knowledgeSources)
        .set({
          chunkIndex: i + 1,
          embedding: embedding as any,
        })
        .where(eq(knowledgeSources.id, sourceId));
    }

    // Mark complete
    await db
      .update(knowledgeSources)
      .set({
        status: "indexed",
        processedAt: new Date(),
      })
      .where(eq(knowledgeSources.id, sourceId));

    console.log(`✓ URL ${sourceId} crawled: ${chunks.length} chunks indexed`);
  } catch (error) {
    console.error(`✗ URL ${sourceId} crawl failed:`, error);

    await db
      .update(knowledgeSources)
      .set({
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
      .where(eq(knowledgeSources.id, sourceId));
  }
}

interface FirecrawlResult {
  markdown: string;
  title: string;
  pages: string[];
}

async function firecrawlScrape(
  url: string,
  options: { maxPages: number },
): Promise<FirecrawlResult> {
  // For development, simulate crawling
  // In production, integrate with Firecrawl API

  console.log(`[Firecrawl] Scraping ${url} (max ${options.maxPages} pages)`);

  // Mock response for development
  return {
    markdown: `# Content from ${url}\n\nThis is simulated crawled content. In production, this would be the actual scraped content from the website.`,
    title: "Mock Crawled Page",
    pages: [url],
  };
}
