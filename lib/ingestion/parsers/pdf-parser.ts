import PDFParser from "pdf2json";

export async function extractTextFromPDF(
  buffer: Buffer,
): Promise<{ text: string; metadata: { pages: number; info: any } }> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
      reject(new Error(`PDF parsing error: ${errData.parserError.message}`));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        // Extract text from all pages
        const pages = pdfData.Pages || [];
        const pageTexts: string[] = [];

        for (const page of pages) {
          const texts: string[] = [];
          if (page.Texts) {
            for (const text of page.Texts) {
              if (text.R) {
                for (const r of text.R) {
                  if (r.T) {
                    // Decode URI-encoded text
                    try {
                      texts.push(decodeURIComponent(r.T));
                    } catch {
                      texts.push(r.T);
                    }
                  }
                }
              }
            }
          }
          pageTexts.push(texts.join(" "));
        }

        // Join pages with separators
        const fullText = pageTexts.join("\n\n--- Page Break ---\n\n");

        // Get metadata
        const meta = pdfData.Meta || {};

        resolve({
          text: fullText || "[No text content extracted]",
          metadata: {
            pages: pages.length,
            info: {
              author: meta.Author || null,
              title: meta.Title || null,
              subject: meta.Subject || null,
              keywords: meta.Keywords || null,
              creator: meta.Creator || null,
              producer: meta.Producer || null,
            },
          },
        });
      } catch (error) {
        reject(
          new Error(
            `Failed to process PDF data: ${error instanceof Error ? error.message : "Unknown error"}`,
          ),
        );
      }
    });

    // Parse the buffer
    pdfParser.parseBuffer(buffer);
  });
}
