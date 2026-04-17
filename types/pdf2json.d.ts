declare module "pdf2json" {
  export interface PDFParserData {
    Pages: Array<{
      Texts: Array<{
        R: Array<{
          T: string;
        }>;
      }>;
    }>;
    Meta?: {
      Author?: string;
      Title?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
    };
  }

  export interface PDFParserError {
    parserError: Error;
  }

  export default class PDFParser {
    constructor();
    on(
      event: "pdfParser_dataReady",
      callback: (data: PDFParserData) => void,
    ): void;
    on(
      event: "pdfParser_dataError",
      callback: (error: PDFParserError) => void,
    ): void;
    parseBuffer(buffer: Buffer): void;
  }
}
