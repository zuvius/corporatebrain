# Changelog - April 13, 2026

## Session Summary
Focus: PDF Processing Pipeline, Duplicate Detection, and Unstructured.io Integration

## Changes Made

### [22:00:00] CREATE: `lib/ingestion/parsers/unstructured.ts`
**Lines**: 1-229
**Type**: create
**Reason**: Implement Unstructured.io client for advanced document parsing (PDF, Word, Excel, images)
**Outcome**: Full Unstructured.io integration with fallback to local parsers
**Status**: completed

### [22:00:00] MODIFY: `lib/ingestion/parsers/document.ts`
**Lines**: 1-82
**Type**: modify
**Reason**: Add Unstructured.io as primary parser with graceful fallback to pdf2json
**Outcome**: Complex documents use Unstructured.io when API key available, simple PDFs use local parser
**Status**: completed

### [22:00:00] MODIFY: `app/api/upload/route.ts`
**Lines**: 1-175
**Type**: modify
**Reason**: Add content hash-based duplicate detection to save API costs
**Outcome**: SHA-256 hash calculated on upload, blocks duplicates before any processing
**Status**: completed

### [22:00:00] CREATE: `app/api/knowledge-sources/check-hash/route.ts`
**Lines**: 1-48
**Type**: create
**Reason**: API endpoint for client-side duplicate checking before upload
**Outcome**: Frontend can check if document exists before uploading
**Status**: completed

### [22:00:00] MODIFY: `lib/db/schema.ts`
**Lines**: 64-89
**Type**: modify
**Reason**: Add contentHash column for duplicate detection
**Outcome**: content_hash varchar(64) column added with index for fast lookups
**Status**: completed

### [22:00:00] MODIFY: `components/app/upload-modal.tsx`
**Lines**: 1-573
**Type**: modify
**Reason**: Add duplicate detection warnings and toast notifications
**Outcome**: Users see warnings for duplicate filenames and content, files blocked before API calls
**Status**: completed

### [22:00:00] MODIFY: `package.json`
**Lines**: 90-102
**Type**: modify
**Reason**: Fix peer dependency conflicts (@vitejs/plugin-react, vite, vitest versions)
**Outcome**: npm install works without --legacy-peer-deps flag
**Status**: completed

## Migration Applied
- **File**: `db/migrations/0001_low_the_fallen.sql`
- **Changes**: Added `content_hash` column to `knowledge_sources` table
- **Index**: Created `ks_hash_idx` on `(tenant_id, content_hash)`

## Environment Variables
Updated `.env` with placeholders:
- `OPENAI_API_KEY` - Required for embeddings
- `UNSTRUCTURED_API_KEY` - Optional, enables advanced document parsing

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| SHA-256 for content hashing | Fast, collision-resistant, standard algorithm |
| Check hash before upload | Saves API costs by blocking duplicates before OpenAI calls |
| Graceful fallback to pdf2json | Unstructured.io is optional, not mandatory |
| Client + Server duplicate checks | Client for UX, Server for security |
| Database index on content_hash | O(1) lookup for duplicate detection |

## Next Steps
1. Add real OpenAI API key for full document processing
2. Test duplicate detection with actual PDF uploads
3. Optionally add Unstructured.io API key for better parsing
