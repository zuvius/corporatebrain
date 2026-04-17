import { extractTextFromPDF } from "./pdf-parser";
import { extractWithUnstructured, shouldUseUnstructured } from "./unstructured";

interface ExtractedDocument {
  text: string;
  metadata?: {
    pages?: number;
    info?: any;
  };
}

/**
 * Extract text from documents using the best available parser
 * - Unstructured.io: Complex docs (PDF, Word, Excel, images) with tables/layout
 * - Local parsers: Simple text files for speed
 */
export async function extractTextFromDocument(
  buffer: Buffer,
  contentType: string,
  filename?: string,
): Promise<ExtractedDocument> {
  // Use Unstructured for complex document types
  if (
    shouldUseUnstructured(contentType, buffer.length) &&
    process.env.UNSTRUCTURED_API_KEY
  ) {
    try {
      const result = await extractWithUnstructured(
        buffer,
        filename || "document",
        contentType,
      );
      return {
        text: result.text,
        metadata: {
          pages: result.metadata.pages,
          info: {
            filetype: result.metadata.filetype,
            filename: result.metadata.filename,
            languages: result.metadata.languages,
            source: "unstructured.io",
          },
        },
      };
    } catch (error) {
      console.warn(
        "Unstructured.io failed, falling back to local parser:",
        error,
      );
      // Fall through to local parsers
    }
  }

  // Local parsers for supported types
  switch (contentType) {
    case "application/pdf":
      return extractFromPDF(buffer);

    case "text/plain":
    case "text/markdown":
      return { text: buffer.toString("utf-8") };

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      // Word docs require Unstructured or similar - error if we got here
      throw new Error(
        "Word documents require Unstructured.io. " +
          "Please configure UNSTRUCTURED_API_KEY in your .env file.",
      );

    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

async function extractFromPDF(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    // Use pdf2json for reliable PDF text extraction
    const result = await extractTextFromPDF(buffer);
    return {
      text: result.text,
      metadata: {
        pages: result.metadata.pages,
        info: result.metadata.info,
      },
    };
  } catch (error) {
    console.error("PDF parsing failed:", error);
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
