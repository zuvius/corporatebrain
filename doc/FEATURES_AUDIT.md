# Features Audit — What's Built, What's Not, What's Next

> **Document Type:** Feature Inventory + Gap Analysis + Roadmap  
> **Prepared:** April 2026  
> **Method:** Full codebase audit (every API route, component, lib module, schema)  
> **Sections:** (A) Current feature reality, (B) Advanced features to build, (C) Low-effort high-impact features

---

## Table of Contents

1. [What the Marketing Site Claims](#1-what-the-marketing-site-claims)
2. [Feature Reality Audit — What's Actually Built](#2-feature-reality-audit--whats-actually-built)
3. [Advanced Features (Section A)](#3-advanced-features-section-a)
4. [Low-Effort High-Impact Features (Section B)](#4-low-effort-high-impact-features-section-b)
5. [Feature Priority Matrix](#5-feature-priority-matrix)

---

## 1. What the Marketing Site Claims

The features page (`app/(marketing)/features/page.tsx`) advertises **13 features**:

| # | Claimed Feature | Reality Check |
|---|---|---|
| 1 | Hybrid RAG AI | ✅ Built — vector search via pgvector + LLM grounding |
| 2 | Universal Knowledge Base | ✅ Built — PDF, DOCX, XLSX, PPTX, TXT, MD, CSV, images |
| 3 | Source Citations | ⚠️ Partial — citations returned in API, sidebar UI exists but not wired to real citation IDs |
| 4 | 50+ Integrations | ❌ Overstated — 4 OAuth connectors built (Slack, Drive, Notion, Teams) + Gmail skeleton |
| 5 | Smart Model Routing | ✅ Built — 4-tier router across OpenAI/Anthropic/Google |
| 6 | Enterprise Security (SOC 2, GDPR, SSO/SAML) | ❌ Not built — audit logs schema exists, no SOC 2 cert, no SSO/SAML |
| 7 | Cost Analytics | ✅ Built — per-tenant usage logs, cost breakdown by model/provider |
| 8 | ROI Dashboard | ✅ Built — hours saved calculator, productivity gain metrics |
| 9 | Real-time Sync | ⚠️ Partial — sync engine exists, no webhooks, manual trigger only |
| 10 | Multi-hop Reasoning | ❌ Not built — single-hop RAG only (top-5 chunks → LLM) |
| 11 | Selective sync by channel/folder | ❌ Not built — connector syncs all accessible data |
| 12 | Real-time webhook updates | ❌ Not built — sync is polling/manual only |
| 13 | 99.9% Uptime SLA | ❌ Not built — no SLA infrastructure, monitoring, or guarantees |

**Legend:** ✅ Built | ⚠️ Partial | ❌ Not built / Overstated

---

## 2. Feature Reality Audit — What's Actually Built

A complete, honest audit of every feature across the codebase.

---

### 2.1 ✅ BUILT — Core AI / Chat

#### Hybrid RAG Chat (`app/api/chat/route.ts`)
- User sends message → query embedded via OpenAI `text-embedding-ada-002`
- pgvector cosine similarity search: `embedding <-> ${queryEmbedding} < 0.3` threshold
- Top 5 relevant knowledge chunks retrieved
- Context injected into system prompt → LLM generates grounded response
- **Gap:** Distance threshold `0.3` is hardcoded and not tunable per tenant
- **Gap:** Only top 5 chunks used — no re-ranking, no BM25 hybrid, no score-based filtering

#### Model Router (`lib/ai/router/index.ts`)
- 4 tiers: `fast`, `balanced`, `deep`, `creative`
- 6 models: `gpt-4o-mini`, `gpt-4o`, `claude-3-5-sonnet`, `claude-3-opus`, `gemini-1.5-flash`, `gemini-1.5-pro`
- Auto-tier selection based on query keywords (coding → deep, analysis → balanced, short → fast)
- Per-query cost tracking
- **Gap:** No streaming responses (currently returns full response at once)
- **Gap:** No fallback if a provider is down

#### Conversation Management
- Create, store, retrieve conversations per user+tenant
- Last 10 messages of history included in context
- Cost tracked per message (tokens + dollar cost)
- **Gap:** No conversation search/filter
- **Gap:** No conversation export
- **Gap:** No conversation sharing or permalinks

#### Omnibox / ⌘K (`components/chat/omnibox.tsx`)
- Keyboard shortcut ⌘K / Ctrl+K opens command palette
- Arrow key navigation, Escape to close
- **Gap:** Only 4 static suggestions hardcoded — not dynamic/recent/personalized
- **Gap:** Does not actually execute non-search suggestions (upload, connect, analytics are dead actions)

---

### 2.2 ✅ BUILT — Document Ingestion

#### File Upload (`app/api/upload/route.ts`)
- Supported: PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, MD, CSV, HTML, JPEG, PNG, TIFF, BMP, JSON, XML
- 100MB file size limit
- SHA-256 content hash for duplicate detection (checked before processing)
- Files stored in `/uploads/{id-prefix}/{id}-{filename}`
- **Gap:** No cloud storage (S3/GCS) — files stored on local filesystem only

#### Document Parsing (`lib/ingestion/parsers/`)
- **Unstructured.io**: PDF, Word, Excel, PowerPoint, images — extracts tables, images, structured content
- **pdf2json**: Fallback for simple PDFs when no Unstructured key
- **Direct text**: .txt, .md, .csv, .html, .json, .xml
- Chunking: `by_title` strategy, 1000 char chunks, 200 char overlap
- **Gap:** No OCR for scanned image-only PDFs without Unstructured key
- **Gap:** Chunking strategy not configurable per tenant

#### URL Crawler (`app/api/crawl/route.ts` + `lib/ingestion/crawler.ts`)
- Accepts any HTTP/HTTPS URL
- Fetches content, strips HTML tags, extracts plain text
- **Gap:** No JavaScript rendering (cannot crawl SPAs)
- **Gap:** No recursive crawling / sitemap discovery
- **Gap:** No rate limiting or robots.txt respect

---

### 2.3 ✅ BUILT — Integrations

#### OAuth Framework (`lib/integrations/oauth-framework.ts`)
- Generic OAuth 2.0 implementation with token exchange, refresh, revoke
- Providers: Slack, Google Drive, Gmail, Notion, Microsoft Teams
- Tokens stored encrypted in `integrations` table
- **Gap:** Token encryption is basic (stored as plain text in DB — needs AES-256 encryption at rest)

#### Sync Engine (`lib/integrations/sync-engine.ts`)
- Pulls content from connected integrations
- Feeds into same document processing pipeline
- **Gap:** Manual trigger only — no scheduled cron jobs
- **Gap:** No incremental sync (re-syncs everything each time)
- **Gap:** No webhook listeners for real-time updates

#### Connectors Built
| Connector | Status | Gaps |
|---|---|---|
| Slack | ✅ OAuth + sync | No thread context, no DM indexing, channel allowlist not implemented |
| Google Drive | ✅ OAuth + sync | No shared drives, no Google Docs native format (exports only) |
| Notion | ✅ OAuth + sync | No database property extraction, no linked pages recursion |
| Microsoft Teams | ✅ OAuth + sync | No SharePoint, no attachments, no meeting recordings |
| Gmail | ⚠️ OAuth skeleton | Sync not implemented |

---

### 2.4 ✅ BUILT — Admin & Analytics

#### Admin Dashboard (`app/(app)/admin/page.tsx` + `app/api/admin/dashboard/route.ts`)
- Total cost, tokens, queries
- Integration count (total / active)
- Knowledge source count (total / indexed)
- Conversation stats (total / this week)
- Daily usage chart data
- Model breakdown (cost, tokens, queries per model)

#### ROI Calculator (`app/api/admin/roi/route.ts`)
- Calculates hours saved: 14 min saved per query × query count
- Productivity gain %
- Dollar value saved (at $50/hr assumption)
- ROI ratio vs. subscription cost
- **Gap:** Assumptions are hardcoded ($50/hr, 14 min/query) — not configurable per tenant

#### Cost Command Center (`app/api/admin/costs/route.ts`)
- Breakdown by provider (OpenAI / Anthropic / Google)
- Breakdown by model
- Daily cost trends
- Optimization recommendations (text)

---

### 2.5 ✅ BUILT — Knowledge Graph (`app/api/knowledge-graph/route.ts`)
- API returns nodes (knowledge sources) + connections (co-citation relationships)
- Connection strength based on how often two sources are cited together
- Normalized strength score 0.1–1.0
- **Gap:** `context-map.tsx` uses **mock random nodes** — not connected to this real API
- **Gap:** D3.js visualization not implemented — Canvas animation with fake data only

---

### 2.6 ✅ BUILT — Multi-Tenancy
- Full tenant isolation at database level (all tables have `tenant_id` FK)
- HNSW index scoped to tenant: `eq(knowledgeSources.tenantId, effectiveTenantId)`
- Per-tenant plan tracking, cost tracking, onboarding state
- 4-stage onboarding flow (Welcome → Workspace → Connect → Complete)
- **Gap:** No tenant-to-tenant data isolation enforcement at API middleware level (relies on correct `tenantId` in session)

---

### 2.7 ✅ BUILT — Authentication
- Email + password login
- Magic link / email verification
- Google OAuth
- Teaser mode for unverified users (1 free query limit)
- Role system: `owner`, `admin`, `member`
- **Gap:** No SSO/SAML (enterprise requirement)
- **Gap:** No SCIM provisioning
- **Gap:** No MFA (Multi-Factor Authentication)

---

### 2.8 ❌ NOT BUILT — Claimed But Missing

| Claimed Feature | Reality |
|---|---|
| 50+ integrations | 4 connectors (Slack, Drive, Notion, Teams) + Gmail skeleton |
| SOC 2 Type II certification | Not started |
| GDPR compliance documentation | Not started |
| SSO / SAML support | Not built |
| Real-time sync via webhooks | Not built |
| Selective sync by channel/folder | Not built |
| Multi-hop reasoning | Not built (single-hop only) |
| 99.9% uptime SLA | Not built |
| Context Map with real data | Fake — random mock nodes |
| Streaming chat responses | Not built (full response only) |
| Billing / Stripe integration | Not built |

---

## 3. Advanced Features (Section A)

These are high-complexity, high-value features that would meaningfully differentiate Corporate Brain from Glean and Moveworks. Ordered by strategic impact.

---

### A1. Streaming Chat Responses
**What it is:** Real-time token-by-token response streaming (like ChatGPT)  
**Why it matters:** Current UX shows a loading spinner then dumps full response. This feels slow and dated. Streaming makes the AI feel alive and responsive.  
**How to build:** Use Vercel AI SDK `streamText()` or OpenAI streaming API. Replace `routeAndGenerate()` with a streaming variant. Send `text/event-stream` from the API route.  
**Effort:** Medium (2–3 days)  
**Impact:** Very High — fundamental UX improvement, removes the biggest friction point

---

### A2. True Hybrid RAG (BM25 + Vector + Re-ranking)
**What it is:** Combine keyword search (BM25) with semantic vector search, then re-rank results before sending to LLM  
**Why it matters:** Current RAG uses vector-only similarity with a hardcoded `0.3` threshold. This misses exact keyword matches (e.g., searching for a specific product name or person) and has no quality filtering on retrieved chunks.  
**How to build:**
1. Add `pg_trgm` extension to PostgreSQL for keyword search
2. Run both vector search and trigram search in parallel
3. Merge results with Reciprocal Rank Fusion (RRF)
4. Add cross-encoder re-ranking via `cross-encoder/ms-marco-MiniLM-L-6-v2` (Hugging Face)  
**Effort:** High (1–2 weeks)  
**Impact:** Very High — directly improves answer quality and citation accuracy

---

### A3. Multi-hop / Agentic RAG
**What it is:** For complex questions, the AI can issue multiple sub-queries, synthesize intermediate results, and chain reasoning across documents  
**Why it matters:** Current RAG is single-hop: one query → top 5 chunks → one answer. This fails for questions like "Compare our Q3 strategy to what we decided in the post-mortem from January" which require finding and connecting multiple documents.  
**How to build:**
1. Query complexity classifier (simple → direct RAG, complex → agentic)
2. LLM decomposes complex query into sub-queries
3. Each sub-query runs its own RAG pipeline
4. Final LLM call synthesizes all intermediate results  
**Effort:** High (2–3 weeks)  
**Impact:** High — unlocks "analyst-grade" use cases that Hebbia targets at $50–150/user

---

### A4. Real-time Webhook Sync
**What it is:** Instead of manual/scheduled sync, receive push notifications from Slack/Drive/Notion when content changes  
**Why it matters:** Currently "real-time sync" is false advertising — it's a manual button. True real-time sync means new Slack messages are searchable within seconds.  
**How to build:**
1. Slack Events API — register `/api/webhooks/slack` endpoint, handle `message` events
2. Google Drive Push Notifications — register webhook channel, handle file change events
3. Notion webhooks (beta API)
4. Queue incoming webhook payloads in Redis, process asynchronously  
**Effort:** High (1–2 weeks per connector)  
**Impact:** High — makes the "real-time" marketing claim true

---

### A5. Selective Sync (Channel / Folder / Label Filtering)
**What it is:** Let users choose which Slack channels, Drive folders, or Notion workspaces to index — not everything  
**Why it matters:** Currently the connector syncs everything the OAuth token can access. Users immediately hit privacy concerns ("I don't want HR channels indexed") and performance issues (indexing 10k Drive files when they only want 200).  
**How to build:**
1. Integration settings UI with channel/folder picker
2. Store allowed list in `integrations.settings` JSONB field (schema already supports this)
3. Sync engine filters content against allowlist before ingesting  
**Effort:** Medium (1 week)  
**Impact:** High — removes the #1 enterprise objection to connecting integrations

---

### A6. Document Q&A with Table/Chart Understanding
**What it is:** When a PDF/Excel/PPTX contains tables or charts, the AI can reason about structured data, not just text  
**Why it matters:** Most enterprise documents are data-heavy (financial models, reports, dashboards). Current RAG treats tables as flat text and loses the structure.  
**How to build:**
1. Unstructured.io already extracts `Table` elements with `text_as_html`
2. Pass HTML table representation to LLM with structured prompt
3. For Excel: parse to JSON with column headers preserved
4. Add "table reasoning" system prompt template  
**Effort:** Medium (3–5 days)  
**Impact:** High — unlocks finance, ops, and analyst use cases

---

### A7. Local LLM Support (Ollama)
**What it is:** Run AI inference entirely on-premise using open-source models via Ollama  
**Why it matters:** As covered in `SOVEREIGNTY_REALITY_CHECK.md`, this is the only path to true air-gap sovereignty for defense and regulated industries. Also reduces AI API costs to $0 for self-hosted customers.  
**How to build:**
1. Add `ollama` provider to `lib/ai/router/index.ts`
2. Use Ollama's OpenAI-compatible API (`http://localhost:11434/v1/`)
3. Add local embedding model support (`nomic-embed-text`)
4. Add deployment guide for self-hosted Ollama setup  
**Effort:** Medium (1 week)  
**Impact:** Very High — unlocks defense, government, and air-gapped enterprise market

---

### A8. MCP (Model Context Protocol) Server
**What it is:** Expose Corporate Brain as an MCP server so any MCP-compatible AI tool (Claude Desktop, Cursor, etc.) can query your company knowledge base  
**Why it matters:** MCP is becoming the standard protocol for AI tool integration. Guru already supports it. It means your company's knowledge becomes accessible from Claude Desktop, Zed, Cursor, VS Code Copilot — with zero additional UI.  
**How to build:**
1. Implement MCP server spec at `/api/mcp` endpoint
2. Expose tools: `search_knowledge`, `get_document`, `list_sources`
3. Handle MCP authentication via API keys
4. Publish to MCP directory  
**Effort:** Medium (1 week)  
**Impact:** Very High — huge developer community distribution, differentiator over Glean/Moveworks

---

### A9. Audit Trail + Compliance Logging
**What it is:** Full immutable log of who queried what, when, which documents were cited, and what the AI responded  
**Why it matters:** The `audit_logs` table already exists in the schema but is barely populated. For finance, legal, and healthcare use cases, this is non-negotiable. Hebbia's entire value prop to banks is built on this.  
**How to build:**
1. Populate `audit_logs` on every: login, query, document upload, integration connect, settings change
2. Admin UI to view/filter/export audit trail
3. Log immutability (append-only, no delete API)
4. Exportable to SIEM systems (JSON/CSV download)  
**Effort:** Medium (1 week)  
**Impact:** High — required for enterprise sales in regulated industries

---

### A10. SSO / SAML 2.0 Integration
**What it is:** Enterprise single sign-on via SAML 2.0 or OIDC (Okta, Azure AD, Google Workspace)  
**Why it matters:** Any company with 500+ employees uses SSO. Without it, Corporate Brain cannot be approved by IT/security teams. This is a hard blocker for enterprise sales, not just a nice-to-have.  
**How to build:**
1. Add `passport-saml` or `next-auth` SAML provider
2. IdP metadata configuration per tenant
3. SCIM user provisioning/deprovisioning
4. Just-in-time user creation on SSO login  
**Effort:** High (2–3 weeks)  
**Impact:** Very High — hard requirement for any company > 200 employees

---

### A11. Knowledge Source Versioning
**What it is:** When a document is re-uploaded or re-synced, keep a version history. Show users when knowledge was last updated.  
**Why it matters:** Companies update their policies, SOPs, and strategies constantly. Without versioning, users can't know if the AI is answering based on a 2-year-old policy or today's version.  
**How to build:**
1. Add `version` column and `parent_id` FK to `knowledge_sources`
2. On re-ingest: create new record, mark old as `superseded`
3. Version history viewer in knowledge sidebar
4. "Knowledge freshness" indicator in citations  
**Effort:** Medium (1 week)  
**Impact:** Medium-High — important for trust and accuracy in compliance contexts

---

### A12. Multi-language Support
**What it is:** Index and query documents in languages other than English  
**Why it matters:** European enterprises, APAC companies, and any global organization have multilingual knowledge bases. Unstructured.io already passes `languages` metadata.  
**How to build:**
1. Use multilingual embedding model (`text-embedding-3-large` with `dimensions=3072` handles multi-language well)
2. Detect document language on ingest, store in metadata
3. System prompt instructs LLM to respond in the user's detected language  
**Effort:** Low-Medium (3–5 days)  
**Impact:** Medium-High — opens entire non-English market

---

## 4. Low-Effort High-Impact Features (Section B)

These are features that can be built in **1–3 days each**, require minimal architecture changes, but would meaningfully improve user experience, retention, or conversion.

---

### B1. 🔥 Suggested Questions (Query Starters)
**What it is:** When a user opens the chat with an empty state, show 4–6 dynamically generated suggested questions based on their indexed knowledge  
**How:** Call a lightweight LLM prompt: *"Given these document titles, generate 5 questions a user would likely ask"* → cache per tenant  
**Effort:** 1 day  
**Impact:** Very High — dramatically reduces time-to-first-value; eliminates blank-state anxiety

---

### B2. 🔥 Copy Answer + Share Answer
**What it is:** One-click copy of AI response to clipboard. Optional: shareable link for an answer.  
**How:** Add copy button to `chat-message.tsx`. For sharing: generate a read-only URL `/share/{conversationId}/{messageId}` with no auth required.  
**Effort:** Half a day  
**Impact:** High — viral distribution, useful in enterprise ("share this answer with your manager")

---

### B3. 🔥 Document Quick Preview
**What it is:** Hover/click on a citation in the sidebar → see the exact chunk of text highlighted in context, not just the document title  
**How:** Citation sidebar (`citation-sidebar.tsx`) already exists. Populate `excerpt` field from `citations` table (schema already has it). Show the excerpt in a tooltip or expanded panel.  
**Effort:** 1 day  
**Impact:** High — builds trust in AI answers; currently citations show just a title with no preview

---

### B4. 🔥 Connect Real Data to Context Map
**What it is:** The `context-map.tsx` currently shows 20 random animated nodes. Replace with real knowledge graph data from `/api/knowledge-graph`.  
**How:** Fetch from `/api/knowledge-graph`, render nodes using D3.js force simulation. Click a node → open that knowledge source.  
**Effort:** 1–2 days  
**Impact:** High — currently the most visually prominent "wow" feature is entirely fake; this would be a genuine showpiece

---

### B5. 🔥 "Recently Asked" / Answer History
**What it is:** Show the user's last 10–20 queries in a sidebar panel, with one-click to resume the conversation  
**How:** `GET /api/chat` already returns conversation list. Render in left sidebar. Click → restore conversation.  
**Effort:** 1 day  
**Impact:** High — critical for retention; users return to continue previous threads

---

### B6. 🔥 Knowledge Source Status Indicators
**What it is:** In the knowledge sidebar, show each document's processing status with visual indicator: Indexing → Indexed → Failed, plus "last synced" timestamp for integrations  
**How:** `knowledge_sources.status` already has `pending`, `indexed`, `failed` states. Add status badges to the sidebar list items.  
**Effort:** Half a day  
**Impact:** Medium-High — reduces support confusion ("why isn't my PDF searchable?")

---

### B7. 🔥 Onebox Search (Non-chat)
**What it is:** A pure search mode — type a query, get a ranked list of matching documents with excerpts — no AI generation, no LLM call, instant results  
**How:** Use the existing vector search + return ranked knowledge sources directly, without routing to an LLM. Pure pgvector query.  
**Effort:** 1 day  
**Impact:** Medium-High — useful for users who want to browse rather than chat; $0 API cost; works offline

---

### B8. 🔥 Thumb Up / Thumb Down Feedback
**What it is:** After each AI response, show 👍 / 👎 buttons. Log feedback to DB.  
**How:** Add `feedback` column to `messages` table. One-click rating. Later use for answer quality monitoring.  
**Effort:** Half a day  
**Impact:** Medium — enables quality monitoring; users feel heard; data for future fine-tuning

---

### B9. Slack Bot Integration (Answer Questions in Slack)
**What it is:** A Slack bot that users can @mention or message to get answers from the knowledge base, without leaving Slack  
**How:** Register a Slack App with `app_mentions:read` scope. On mention → call `/api/chat` → post response in thread. Reuse all existing RAG infrastructure.  
**Effort:** 2–3 days  
**Impact:** Very High — this is where 80% of enterprise communication happens; removes the "switch apps" friction entirely

---

### B10. Email Digest (Weekly Knowledge Summary)
**What it is:** Weekly email to workspace admins showing: top queries asked, new documents indexed, AI cost summary, ROI metrics  
**How:** `lib/email/send.ts` already exists. Add a weekly cron job (Vercel Cron or Upstash QStash). Pull data from admin dashboard API. Send HTML email.  
**Effort:** 1–2 days  
**Impact:** Medium-High — re-engagement for inactive users; proves value passively; reduces churn

---

### B11. Dark/Light Mode Polish
**What it is:** The app dashboard (`/app`) uses an inconsistent mix of light gray (`bg-gray-50`) and dark styles — inherited from an older design system. The marketing site is beautiful dark (`#0a0a0f`). The app feels like a different product.  
**How:** Audit all `app/(app)/` components. Apply consistent dark theme matching the marketing site (`bg-[#0a0a0f]`, `bg-[#0d0d14]`, violet/fuchsia accents).  
**Effort:** 2–3 days  
**Impact:** Medium — critical for brand consistency and first impression after signup

---

### B12. Omnibox Action Wiring
**What it is:** The ⌘K omnibox currently has 4 suggestions (Upload, Connect, Analytics, Search) but only Search actually works — the others do nothing.  
**How:** Wire each suggestion to its respective action: Upload → open upload modal, Connect → navigate to integrations, Analytics → navigate to admin.  
**Effort:** Half a day  
**Impact:** Medium — removes a broken/confusing experience for power users

---

### B13. Token/Cost Per Query Indicator
**What it is:** Below each AI response, show a small indicator: "GPT-4o-mini · 0.8s · $0.0003"  
**How:** Chat API already returns `model`, `cost`, `tokens` fields in the response. Display them in `chat-message.tsx` in a subtle footer.  
**Effort:** Half a day  
**Impact:** Medium — builds trust; power users love transparency; reinforces the "cost-efficient" brand message

---

## 5. Feature Priority Matrix

### Must Build (Blockers for Enterprise Sales)

| Feature | Effort | Revenue Impact | Section |
|---|---|---|---|
| SSO / SAML 2.0 | High | Critical — blocks all enterprise deals | A10 |
| Streaming responses | Medium | Very High — UX blocker | A1 |
| Selective sync (channel/folder) | Medium | High — #1 enterprise objection | A5 |
| Audit trail completion | Medium | High — required for regulated industries | A9 |
| Real-time webhook sync | High | High — marketing claim must become true | A4 |

### Build Next (High ROI, Medium Effort)

| Feature | Effort | Impact | Section |
|---|---|---|---|
| Suggested questions | Low | Very High — time-to-value | B1 |
| Context Map with real data | Low | High — flagship visual | B4 |
| Slack bot | Medium | Very High — distribution | B9 |
| Document quick preview | Low | High — trust/citations | B3 |
| MCP server | Medium | Very High — developer ecosystem | A8 |
| Ollama / local LLM | Medium | Very High — sovereignty claim | A7 |

### Quick Wins (Days of Work, Noticeable Polish)

| Feature | Effort | Impact | Section |
|---|---|---|---|
| Copy / share answer | 0.5 days | High — virality | B2 |
| Answer history sidebar | 1 day | High — retention | B5 |
| Feedback thumbs | 0.5 days | Medium — data collection | B8 |
| Omnibox wiring | 0.5 days | Medium — broken UX fix | B12 |
| App dark theme polish | 2–3 days | Medium — brand consistency | B11 |
| Cost per query indicator | 0.5 days | Medium — transparency | B13 |

### Advanced (Competitive Differentiation, Higher Effort)

| Feature | Effort | Impact | Section |
|---|---|---|---|
| True Hybrid RAG (BM25 + re-ranking) | High | Very High — answer quality | A2 |
| Multi-hop agentic RAG | High | High — analyst use cases | A3 |
| Table/chart understanding | Medium | High — finance/ops | A6 |
| Knowledge versioning | Medium | Medium-High — compliance | A11 |
| Multi-language support | Low-Med | Medium-High — global market | A12 |

---

## Summary

**Total features claimed on marketing site:** 13  
**Fully built:** 7  
**Partially built:** 3  
**Not built / overstated:** 6  

**Advanced features identified:** 12 (Section A)  
**Low-effort high-impact features:** 13 (Section B)  

**Highest priority right now (by effort-to-impact ratio):**
1. Suggested questions (B1) — 1 day, eliminates blank-state drop-off
2. Streaming responses (A1) — 2–3 days, fundamental UX
3. Copy/share answer (B2) — half a day, viral distribution
4. Context Map real data (B4) — 1–2 days, turns fake showpiece real
5. Slack bot (B9) — 2–3 days, meets users where they are

---

*Document prepared: April 2026*  
*Related: `doc/CORPORATE_BRAIN_STRATEGIC_ANALYSIS.md`, `doc/SOVEREIGNTY_REALITY_CHECK.md`*
