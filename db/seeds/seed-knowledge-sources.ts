import { db } from "../../lib/db/client";
import { knowledgeSources } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Seed: Knowledge Sources
 * Creates sample documents for testing
 * Idempotent - checks before insert, skips if exists
 */

export interface SeedDocument {
  type: string;
  source: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  status: string;
  tokenCount: number;
}

export async function seedKnowledgeSources(tenantId: string) {
  console.log("🌱 [seed-knowledge-sources] Starting...");

  const documentsToSeed: SeedDocument[] = [
    {
      type: "pdf",
      source: "upload",
      title: "Employee Handbook 2024",
      content: "Welcome to Acme Corporation. This handbook outlines our policies, benefits, and procedures...",
      metadata: {
        fileName: "handbook.pdf",
        fileSize: 2457600,
        pages: 24,
        author: "HR Department",
      },
      status: "processed",
      tokenCount: 450,
    },
    {
      type: "docx",
      source: "upload",
      title: "Q1 Sales Report",
      content: "Q1 2024 Sales Performance: Revenue increased by 23% compared to Q1 2023...",
      metadata: {
        fileName: "q1-sales.docx",
        fileSize: 1024000,
        author: "Sales Team",
      },
      status: "processed",
      tokenCount: 320,
    },
    {
      type: "txt",
      source: "slack",
      title: "Project Phoenix Discussion",
      content: "John: When is the Project Phoenix deadline?\nSarah: The deadline is March 15th...",
      metadata: {
        channel: "#project-phoenix",
        date: "2024-01-15",
        participants: ["john", "sarah"],
      },
      status: "processed",
      tokenCount: 180,
    },
  ];

  const createdDocs = [];

  for (const docData of documentsToSeed) {
    try {
      // Idempotent check - query by title within tenant
      const existing = await db.query.knowledgeSources.findFirst({
        where: eq(knowledgeSources.title, docData.title),
      });

      if (existing) {
        console.log(`  ⏭️  Document '${docData.title}' already exists, skipping`);
        createdDocs.push(existing);
        continue;
      }

      // Insert document
      const [doc] = await db.insert(knowledgeSources).values({
        tenantId,
        type: docData.type,
        source: docData.source,
        title: docData.title,
        content: docData.content,
        metadata: JSON.stringify(docData.metadata),
        status: docData.status,
        chunkIndex: 0,
        totalChunks: 1,
        tokenCount: docData.tokenCount,
      }).returning();

      console.log(`  ✅ Created document: ${doc.title}`);
      createdDocs.push(doc);
    } catch (error) {
      console.error(`  ❌ Failed to seed document ${docData.title}:`, error);
      // Continue with other documents - never crash
    }
  }

  console.log(`🌱 [seed-knowledge-sources] Completed: ${createdDocs.length} documents ready`);
  return createdDocs;
}

export default seedKnowledgeSources;
