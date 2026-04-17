import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { uploadToStorage } from "@/lib/storage/upload";
import { processDocument } from "@/lib/ingestion/processor";
import { db } from "@/lib/db/client";
import { knowledgeSources } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tenantId = formData.get("tenantId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max 100MB." },
        { status: 400 }
      );
    }

    // Calculate content hash for duplicate detection
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentHash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Check for existing document with same hash
    const existingSource = await db.query.knowledgeSources.findFirst({
      where: and(
        eq(knowledgeSources.tenantId, tenantId || (session.user as any).tenantId),
        eq(knowledgeSources.contentHash, contentHash)
      ),
    });
    
    if (existingSource) {
      return NextResponse.json({
        error: "Duplicate content",
        message: `This file has already been uploaded as "${existingSource.title}"`,
        existingSourceId: existingSource.id,
        existingSourceName: existingSource.title,
      }, { status: 409 });
    }

    // Validate file type
    const allowedTypes = [
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Spreadsheets
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Presentations
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // Text files
      "text/plain",
      "text/markdown",
      "text/csv",
      "text/html",
      // Images (for OCR with Unstructured.io)
      "image/jpeg",
      "image/png",
      "image/tiff",
      "image/bmp",
      // Data formats
      "application/json",
      "application/xml",
      "text/xml",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Generate unique ID
    const sourceId = uuidv4();

    // Upload to storage (local filesystem for dev, S3 for production)
    const storagePath = await uploadToStorage({
      id: sourceId,
      buffer,
      filename: file.name,
      contentType: file.type,
    });

    // Truncate storage path to fit DB limit (100 chars)
    const truncatedSource = storagePath.length > 95 
      ? "..." + storagePath.slice(-92)
      : storagePath;

    // Create knowledge source record with content hash
    await db.insert(knowledgeSources).values({
      id: sourceId,
      tenantId: tenantId || (session.user as any).tenantId,
      title: file.name,
      type: file.type === "application/pdf" ? "pdf" : "document",
      source: truncatedSource,
      status: "processing",
      contentHash,
      metadata: {
        originalName: file.name,
        size: file.size,
        contentType: file.type,
        uploadedBy: session.user.id,
        sourceMethod: "upload",
      },
    });

    // Process document asynchronously
    processDocument(sourceId, buffer, file.type).catch(console.error);

    return NextResponse.json({
      success: true,
      sourceId,
      status: "processing",
      message: "File uploaded and processing started",
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sourceId = searchParams.get("sourceId");

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId required" },
        { status: 400 }
      );
    }

    // Get processing status
    const [source] = await db
      .select({
        id: knowledgeSources.id,
        status: knowledgeSources.status,
        processedAt: knowledgeSources.processedAt,
        errorMessage: knowledgeSources.errorMessage,
      })
      .from(knowledgeSources)
      .where(eq(knowledgeSources.id, sourceId))
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sourceId,
      status: source.status,
      processedAt: source.processedAt,
      error: source.errorMessage,
    });
  } catch (error) {
    console.error("Status check failed:", error);
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}
