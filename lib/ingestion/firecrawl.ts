/**
 * Firecrawl Integration for Web Scraping
 * Converts websites into LLM-ready markdown
 * API Docs: https://docs.firecrawl.dev/api-reference/introduction
 */

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: {
      title?: string;
      description?: string;
      sourceURL?: string;
      [key: string]: any;
    };
    links?: string[];
  };
  error?: string;
}

interface ScrapeOptions {
  url: string;
  formats?: ("markdown" | "html")[];
  onlyMainContent?: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  headers?: Record<string, string>;
  waitFor?: number;
  timeout?: number;
}

interface CrawlOptions {
  url: string;
  excludePaths?: string[];
  includePaths?: string[];
  maxDepth?: number;
  limit?: number;
  scrapeOptions?: Omit<ScrapeOptions, "url">;
}

const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1";

function getApiKey(): string {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY environment variable is required");
  }
  return apiKey;
}

/**
 * Scrape a single URL and return markdown content
 */
export async function scrapeUrl(
  options: ScrapeOptions,
): Promise<FirecrawlResponse> {
  const apiKey = getApiKey();

  const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: options.url,
      formats: options.formats || ["markdown"],
      onlyMainContent: options.onlyMainContent ?? true,
      includeTags: options.includeTags,
      excludeTags: options.excludeTags,
      headers: options.headers,
      waitFor: options.waitFor,
      timeout: options.timeout || 30000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl scrape failed: ${error}`);
  }

  return response.json();
}

/**
 * Crawl a website and return multiple pages
 */
export async function crawlWebsite(
  options: CrawlOptions,
): Promise<FirecrawlResponse> {
  const apiKey = getApiKey();

  const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: options.url,
      excludePaths: options.excludePaths,
      includePaths: options.includePaths,
      maxDepth: options.maxDepth || 2,
      limit: options.limit || 10,
      scrapeOptions: options.scrapeOptions,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl crawl failed: ${error}`);
  }

  return response.json();
}

/**
 * Extract structured data from a URL using LLM
 */
export async function extractData(
  url: string,
  prompt: string,
  schema?: Record<string, any>,
): Promise<FirecrawlResponse> {
  const apiKey = getApiKey();

  const response = await fetch(`${FIRECRAWL_API_URL}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      prompt,
      schema,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl extract failed: ${error}`);
  }

  return response.json();
}

/**
 * Search and scrape results from the web
 */
export async function searchAndScrape(
  query: string,
  limit: number = 5,
): Promise<FirecrawlResponse> {
  const apiKey = getApiKey();

  const response = await fetch(`${FIRECRAWL_API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      limit,
      scrapeOptions: {
        formats: ["markdown"],
        onlyMainContent: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl search failed: ${error}`);
  }

  return response.json();
}

/**
 * Process URL content for ingestion into Corporate Brain
 */
export async function processUrlForIngestion(
  url: string,
  options?: Partial<ScrapeOptions>,
): Promise<{
  title: string;
  content: string;
  metadata: Record<string, any>;
}> {
  try {
    const result = await scrapeUrl({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      ...options,
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to scrape URL");
    }

    const { markdown, metadata } = result.data;

    return {
      title: metadata?.title || url,
      content: markdown || "",
      metadata: {
        sourceURL: metadata?.sourceURL || url,
        description: metadata?.description,
        ...metadata,
      },
    };
  } catch (error) {
    console.error("Firecrawl processing error:", error);
    throw error;
  }
}

/**
 * Check if Firecrawl is properly configured
 */
export function isFirecrawlConfigured(): boolean {
  return !!process.env.FIRECRAWL_API_KEY;
}
