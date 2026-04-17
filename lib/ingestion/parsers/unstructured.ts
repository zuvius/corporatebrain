import { UnstructuredClient } from "unstructured-client";

const client = new UnstructuredClient({
  security: {
    apiKeyAuth: process.env.UNSTRUCTURED_API_KEY || "",
  },
});

export interface UnstructuredElement {
  type: string;
  element_id: string;
  text: string;
  metadata: {
    page_number?: number;
    filename?: string;
    filetype?: string;
    languages?: string[];
    parent_id?: string;
    category_depth?: number;
    [key: string]: any;
  };
}

export interface UnstructuredResult {
  text: string;
  elements: UnstructuredElement[];
  metadata: {
    pages: number;
    filetype: string;
    filename: string;
    languages: string[];
  };
}

/**
 * Extract text and structure from documents using Unstructured.io
 * Supports 70+ file types including PDF, DOCX, PPTX, XLSX, images
 */
export async function extractWithUnstructured(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<UnstructuredResult> {
  const apiKey = process.env.UNSTRUCTURED_API_KEY;

  if (!apiKey) {
    throw new Error(
      "UNSTRUCTURED_API_KEY not configured. " +
        "Get your API key from https://platform.unstructured.io",
    );
  }

  try {
    // Map content type to Unstructured file type
    const fileExtension = getFileExtension(contentType, filename);

    const response = await client.general.partition({
      partitionParameters: {
        files: {
          content: buffer,
          fileName: filename,
        },
        // Use auto strategy for mixed documents
        // fast: for simple text extraction
        // hi_res: for complex layouts with tables/images
        // ocr_only: for scanned documents
        strategy: "auto" as any,
        // Include chunking for LLM-ready output
        chunkingStrategy: "by_title" as any,
        // Max characters per chunk
        maxCharacters: 1000,
        // Overlap between chunks
        overlap: 200,
        // Extract tables as structured data (set to true to skip, false to include)
        skipInferTableTypes: "false" as any,
        // Detect languages
        languages: ["eng"] as any,
      },
    });

    const responseData = response as unknown as {
      elements?: UnstructuredElement[];
    };
    const elements = (responseData.elements || []) as UnstructuredElement[];

    if (elements.length === 0) {
      throw new Error("No content extracted from document");
    }

    // Combine all text elements
    const fullText = elements
      .map((el) => el.text)
      .filter(Boolean)
      .join("\n\n");

    // Extract metadata from first element
    const firstMeta = elements[0]?.metadata || {};
    const pages = Math.max(
      ...elements.map((el) => el.metadata?.page_number || 1),
      1,
    );

    return {
      text: fullText,
      elements,
      metadata: {
        pages,
        filetype: firstMeta.filetype || fileExtension,
        filename: firstMeta.filename || filename,
        languages: firstMeta.languages || ["eng"],
      },
    };
  } catch (error) {
    console.error("Unstructured.io extraction failed:", error);
    throw new Error(
      `Document extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extract tables as structured data
 */
export function extractTables(elements: UnstructuredElement[]): Array<{
  page: number;
  text: string;
  html?: string;
}> {
  return elements
    .filter((el) => el.type === "Table" || el.type === "table")
    .map((table) => ({
      page: table.metadata?.page_number || 1,
      text: table.text,
      html: table.metadata?.text_as_html,
    }));
}

/**
 * Extract images with captions
 */
export function extractImages(elements: UnstructuredElement[]): Array<{
  page: number;
  caption?: string;
  type: string;
}> {
  return elements
    .filter(
      (el) =>
        el.type === "Image" || el.type === "image" || el.type === "Figure",
    )
    .map((img) => ({
      page: img.metadata?.page_number || 1,
      caption: img.text,
      type: img.type,
    }));
}

/**
 * Get structured chunks suitable for RAG
 */
export function getStructuredChunks(elements: UnstructuredElement[]): Array<{
  text: string;
  type: string;
  page: number;
  elementId: string;
}> {
  return elements
    .filter((el) => el.text && el.text.trim().length > 0)
    .map((el) => ({
      text: el.text,
      type: el.type,
      page: el.metadata?.page_number || 1,
      elementId: el.element_id,
    }));
}

function getFileExtension(contentType: string, filename: string): string {
  const mimeToExt: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      ".pptx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".xlsx",
    "application/vnd.ms-excel": ".xls",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/html": ".html",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/tiff": ".tiff",
    "application/json": ".json",
    "application/xml": ".xml",
  };

  return (
    mimeToExt[contentType] ||
    filename.substring(filename.lastIndexOf(".")) ||
    ".bin"
  );
}

/**
 * Check if Unstructured.io should be used for a file type
 * Falls back to local parsers for simple text files
 */
export function shouldUseUnstructured(
  contentType: string,
  fileSize: number,
): boolean {
  // Always use Unstructured for complex formats
  const complexTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/bmp",
  ];

  if (complexTypes.includes(contentType)) {
    return true;
  }

  // For large files, use Unstructured for better handling
  if (fileSize > 10 * 1024 * 1024) {
    // 10MB
    return true;
  }

  return false;
}
