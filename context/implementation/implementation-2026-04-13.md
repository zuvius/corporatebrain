# Implementation Log - April 13, 2026

## Session Focus
PDF Processing Pipeline Fixes, Duplicate Detection System, and Unstructured.io Integration

## Problem Statement
User reported issues with PDF uploads:
1. Processing stuck/timeout errors
2. Duplicate files appearing in sidebar
3. No cancellation for ongoing uploads
4. Missing API key configuration
5. Unclear role of Unstructured.io vs OpenAI

## Solutions Implemented

### 1. Unstructured.io Integration
**File**: `lib/ingestion/parsers/unstructured.ts`

Created full-featured Unstructured.io client:
- Partition API integration for 70+ file types
- Chunking strategy: "by_title" for LLM-ready output
- Metadata extraction (pages, languages, filetype)
- Helper functions for tables, images, structured chunks
- Graceful error handling with fallback

**Usage**:
```typescript
// When UNSTRUCTURED_API_KEY is set
const result = await extractWithUnstructured(buffer, filename, contentType);
// Returns: text, elements, metadata with page numbers
```

### 2. Smart Parser Selection
**File**: `lib/ingestion/parsers/document.ts`

Implemented tiered parsing strategy:
```
IF UNSTRUCTURED_API_KEY exists AND complex file type:
  → Use Unstructured.io (best quality, handles tables/layouts)
ELSE IF simple PDF:
  → Use pdf2json (fast, local, no API calls)
ELSE IF text/markdown:
  → Direct string conversion
ELSE IF Word/Excel without key:
  → Error: "Requires Unstructured.io"
```

### 3. Content-Based Duplicate Detection
**Files**: 
- `app/api/upload/route.ts`
- `app/api/knowledge-sources/check-hash/route.ts`
- `components/app/upload-modal.tsx`
- `lib/db/schema.ts`

**Architecture**:
```
Client Upload
    ↓
Calculate SHA-256 hash (crypto.subtle in browser)
    ↓
Check against server (GET /api/knowledge-sources/check-hash?hash=xxx)
    ↓
IF exists: Return 409 Conflict with existing filename
    ↓
Upload file
    ↓
Server calculates hash again (Node crypto)
    ↓
Check database (content_hash column with index)
    ↓
IF duplicate: Return 409, no processing
    ↓
Store with contentHash
    ↓
Process document
```

**Benefits**:
- Saves API costs (OpenAI embeddings not called for duplicates)
- Fast rejection (hash check is O(1) with index)
- Works across filename changes (content-based, not name-based)
- Tenant-scoped (same content in different tenants = different documents)

### 4. Peer Dependency Fix
**File**: `package.json`

**Problem**: `npm install` required `--legacy-peer-deps` due to Vite version conflict

**Root Cause**:
```
@vitejs/plugin-react@4.0.0 requires vite@^4.2.0
But project had conflicting versions
```

**Fix**:
```json
"@vitejs/plugin-react": "^4.0.0" → "^4.3.0"
"vitest": "^1.3.0" → "^1.6.0"
"vite": "^5.4.0"  // Added explicit dependency
```

### 5. Toast Notification System
**File**: `components/app/upload-modal.tsx`

Added user feedback for duplicates:
- Client-side: Toast warning for same filename in batch
- Server-side: Toast warning for content hash duplicate
- Visual feedback: File marked as "error" with duplicate message

## Database Changes

### Migration: Add content_hash column
```sql
ALTER TABLE "knowledge_sources" ADD COLUMN "content_hash" varchar(64);
CREATE INDEX IF NOT EXISTS "ks_hash_idx" ON "knowledge_sources" 
  USING btree ("tenant_id", "content_hash");
```

### Schema Update
```typescript
// lib/db/schema.ts
contentHash: varchar("content_hash", { length: 64 }),
```

## API Changes

### POST /api/upload
- Calculates SHA-256 hash from file buffer
- Checks for existing document with same hash
- Returns 409 Conflict if duplicate found
- Stores hash in contentHash column

### GET /api/knowledge-sources/check-hash
- Query param: `hash` (SHA-256)
- Returns: `{ exists: boolean, sourceId?: string, sourceName?: string }`
- Used by frontend for pre-upload check

## Key Insights

### Why Unstructured.io is Optional
The system is designed with graceful degradation:
- **With API key**: Advanced parsing (tables, forms, images, OCR)
- **Without key**: Basic parsing (pdf2json for simple PDFs)

This makes setup easier for users who don't need complex document features.

### Why Duplicate Detection Matters
Processing a document involves:
1. Text extraction (local or API)
2. Chunking (local)
3. **Embeddings generation (OpenAI API - $$$)**
4. Vector storage (local)

By blocking duplicates at step 1, we save API costs and processing time.

### Hash Algorithm Choice
**SHA-256** selected because:
- Fast calculation (even for large files in browser)
- Virtually zero collision probability
- Standard algorithm with wide support
- 64 chars fit efficiently in database

## Testing Notes

### Manual Test Plan
1. Upload PDF without OpenAI key → Should fail at embeddings step
2. Upload same PDF again → Should show "Duplicate file detected" immediately
3. Rename PDF, upload → Should show "already exists" warning
4. Upload different PDF → Should proceed to processing (then fail at OpenAI)

### API Key Required for Full Testing
Add to `.env`:
```env
OPENAI_API_KEY=sk-your-real-key-here
# Optional:
UNSTRUCTURED_API_KEY=your-key-here
```

## Open Questions

1. Should we cache file hashes in Redis for faster lookups?
2. Should we show a "Use existing" button when duplicate detected?
3. Should we support "force upload" to bypass duplicate check?
