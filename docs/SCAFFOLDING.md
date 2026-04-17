# Corporate Brain - Project Scaffolding Guide

A comprehensive implementation guide for scaffolding the Corporate Brain application based on SCOPE_OF_WORK.md specifications.

## Important Notes

- **Excluded:** All features marked as "(Future)" in SCOPE_OF_WORK.md
- **Scope:** Initial 20-week launch (Phases 1-5 only)
- **Goal:** Production-ready application with core features

---

## Quick Start

```bash
# 1. Clone and setup
git clone <repository-url>
cd corporate-brain
npm install

# 2. Start infrastructure (Docker)
docker-compose up -d

# 3. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Start development
npm run dev
```

---

## Project Structure

```
corporate-brain/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Public routes
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── about/
│   │       └── page.tsx
│   ├── (app)/                   # Protected routes
│   │   ├── app/
│   │   │   ├── page.tsx         # Main app dashboard
│   │   │   ├── layout.tsx
│   │   │   └── chat/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Admin dashboard
│   │   │   └── layout.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── ingest/
│   │   │   ├── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── query/
│   │   │   └── route.ts
│   │   ├── crawl/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   └── layout.tsx
├── components/                  # React components
│   ├── ui/                     # Base UI (shadcn)
│   ├── app/                    # App components
│   ├── dashboard/              # Admin components
│   └── marketing/              # Marketing components
├── lib/                        # Core logic
│   ├── ai/                     # AI orchestration
│   │   ├── router.ts
│   │   ├── models.ts
│   │   └── client.ts
│   ├── db/                     # Database
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── integrations/           # MCP integrations
│   │   ├── slack.ts
│   │   ├── notion.ts
│   │   ├── google-drive.ts
│   │   └── mcp-server.ts
│   ├── search/                 # Vector search
│   │   ├── vector.ts
│   │   └── hybrid.ts
│   ├── ingestion/              # Document processing
│   │   ├── chunker.ts
│   │   └── parser.ts
│   └── utils/
│       ├── crypto.ts
│       └── pii.ts
├── hooks/                      # React hooks
│   ├── use-tenant.ts
│   └── use-conversation.ts
├── types/                      # TypeScript types
│   └── index.ts
├── db/                         # Database migrations/seeds
│   ├── migrations/
│   └── seeds/
│       ├── 001-tenants.ts
│       ├── 002-users.ts
│       ├── 003-knowledge-sources.ts
│       └── index.ts
├── tests/                      # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                     # Static assets
├── scripts/                    # Build scripts
│   └── prebuild.ts
├── docker-compose.yml
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

#### Week 1: Project Setup

**Files to Create:**

1. `package.json` - All dependencies and scripts
2. `tsconfig.json` - Strict TypeScript config
3. `tailwind.config.ts` - Custom theme colors
4. `next.config.js` - Next.js configuration
5. `.env.example` - Environment template
6. `docker-compose.yml` - PostgreSQL + Redis

**Key Decisions:**

- Use Next.js 15 with App Router
- PostgreSQL 15 + pgvector
- Drizzle ORM for type-safe queries
- Tailwind CSS for styling

#### Week 2: Database & Auth

**Files to Create:**

1. `lib/db/schema.ts` - Core database schema
2. `lib/db/client.ts` - Database connection
3. `app/api/auth/[...nextauth]/route.ts` - Auth.js setup
4. `middleware.ts` - Multi-tenancy middleware

**Schema Tables (Non-Future):**

- `tenants` - Multi-tenancy
- `users` - User accounts
- `knowledge_sources` - Documents/chunks
- `conversations` - Chat history
- `messages` - Individual messages
- `verification_tokens` - Email verification

**Excluded (Future):**

- notifications
- webhooks
- document_versions
- comments
- saved_searches
- api_keys
- scheduled_tasks
- workflows

#### Week 3: File Ingestion

**Files to Create:**

1. `app/api/ingest/upload/route.ts` - File upload handler
2. `lib/ingestion/chunker.ts` - Text chunking logic
3. `lib/ingestion/parser.ts` - Document parsing (Unstructured.io)
4. `lib/utils/embeddings.ts` - OpenAI embeddings

**Features:**

- PDF, DOCX, TXT upload
- Chunking: 1000 chars, 200 overlap
- Vector storage: 1536 dimensions
- Processing status tracking

#### Week 4: URL Crawling

**Files to Create:**

1. `app/api/crawl/route.ts` - Crawl endpoint
2. `lib/integrations/firecrawl.ts` - Firecrawl client
3. Components for crawl progress UI

---

### Phase 2: AI Core (Weeks 5-8)

#### Week 5: Model Router

**Files to Create:**

1. `lib/ai/router.ts` - Model selection logic
2. `lib/ai/models.ts` - Model configurations
3. `lib/ai/client.ts` - API clients

**Routing Rules:**

- Context > 100k chars → Gemini 3 Pro
- Complexity > 0.8 → GPT-5.4
- Complexity > 0.5 → Claude 4.6 Opus
- Default → Gemini 2.5 Flash

**Excluded:**

- GPT-5 Nano (Future)
- Advanced caching strategies (Future)

#### Week 6: Chat Interface

**Files to Create:**

1. `app/(app)/app/chat/page.tsx` - Chat page
2. `components/app/chat-interface.tsx` - Chat UI
3. `app/api/query/route.ts` - Chat API
4. `lib/db/queries.ts` - Conversation queries

#### Week 7: Hybrid RAG

**Files to Create:**

1. `lib/search/vector.ts` - Vector similarity search
2. `lib/search/hybrid.ts` - Combined search
3. Citation tracking in responses

#### Week 8: UI Polish

**Files to Create:**

1. Theme configuration (dark/light)
2. Responsive layouts
3. Animation components

---

### Phase 3: Integrations (Weeks 9-12)

**Integrations to Implement:**

1. Slack (OAuth + Events API)
2. Google Drive (OAuth + file sync)
3. Notion (OAuth + page crawl)
4. Microsoft Teams (OAuth + messages)
5. Zoom (OAuth + transcripts)
6. Gmail (OAuth + email threads)
7. GitHub (OAuth + repos)
8. Salesforce (OAuth + CRM data)

**Files to Create:**

1. `lib/integrations/slack.ts`
2. `lib/integrations/google-drive.ts`
3. `lib/integrations/notion.ts`
4. `lib/integrations/teams.ts`
5. `lib/integrations/zoom.ts`
6. `lib/integrations/gmail.ts`
7. `lib/integrations/github.ts`
8. `lib/integrations/salesforce.ts`

**OAuth Handlers:**

1. `app/api/auth/[provider]/route.ts` for each

---

### Phase 4: Scale & Admin (Weeks 13-16)

**Files to Create:**

1. `app/(app)/dashboard/page.tsx` - Admin dashboard
2. `components/dashboard/tenant-grid.tsx`
3. `components/dashboard/cost-chart.tsx`
4. `components/dashboard/audit-log.tsx`
5. `components/app/context-map.tsx` - D3.js visualization
6. `app/(app)/app/settings/page.tsx` - Settings

**Features:**

- Tenant management
- Cost tracking
- ROI calculator
- Security logs
- Knowledge map

---

### Phase 5: Launch (Weeks 17-20)

**Files to Create:**

1. `app/(marketing)/page.tsx` - Landing page
2. `app/(marketing)/pricing/page.tsx`
3. Onboarding flow components
4. `app/(app)/app/onboarding/page.tsx`

**Features:**

- Public marketing site
- 4-stage onboarding
- Progress tracking
- Brain visualization

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",

    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seeds/index.ts",
    "db:reset": "tsx scripts/db-reset.ts && npm run db:migrate && npm run db:seed",

    "test": "vitest",
    "test:e2e": "playwright test",
    "test:ci": "vitest run && playwright test",

    "format": "prettier --write .",
    "format:check": "prettier --check .",

    "prebuild": "npm run db:migrate && npm run type-check"
  }
}
```

---

## Idempotent Seed Strategy

All seed files follow this pattern:

```typescript
// Check if data exists before inserting
const existing = await db.query.table.findFirst({
  where: eq(table.identifier, value),
});

if (existing) {
  console.log(`Skipping: ${identifier} already exists`);
  return;
}

// Insert only if not exists
await db.insert(table).values(data);
```

**Seed Order:**

1. `001-tenants.ts` - Core tenants
2. `002-users.ts` - Users with auth
3. `003-knowledge-sources.ts` - Sample documents

---

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/corporate_brain"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# At least one AI provider
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# Optional
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
UNSTRUCTURED_API_KEY=""
FIRECRAWL_API_KEY=""

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
SLACK_CLIENT_ID=""
SLACK_CLIENT_SECRET=""
NOTION_CLIENT_ID=""
NOTION_CLIENT_SECRET=""
```

---

## Build Pipeline

1. **Pre-build:** Type check + Database migrations
2. **Build:** Next.js static + server generation
3. **Post-build:** Nothing (deployment ready)

```bash
npm run build  # Runs: type-check → db:migrate → next build
```

---

## Testing Strategy

- **Unit:** Vitest for utilities, hooks
- **Integration:** API route testing
- **E2E:** Playwright for critical flows

**Critical Test Paths:**

1. Signup → Onboarding → First query
2. File upload → Processing → Search
3. OAuth connection → Data sync → Query

---

## Deployment Readiness Checklist

- [ ] All migrations apply cleanly
- [ ] Seeds run idempotently
- [ ] Environment variables configured
- [ ] TypeScript strict mode passes
- [ ] Core flows tested
- [ ] No "Future" features in code
- [ ] Production build successful

---

**Version:** 1.0  
**Last Updated:** April 2026
