# Corporate Brain - "All In" Implementation Plan
**Date:** April 12, 2026  
**Goal:** Full Product Build (Not MVP)  
**Timeline:** 8-9 Weeks (1 Developer)  
**Status:** Post-Reality Check - Executing for Real

---

## Executive Summary

**The Problem:** Backend is 70% complete, frontend is 30% complete. The UI uses mock data instead of calling real APIs.

**The Solution:** Wire up the existing backend to a functional frontend. Build the missing UI components.

**The Outcome:** A fully functional Corporate Brain where every feature actually works.

---

## Phase 1: Critical Path (Week 1)
*Goal: Make the product actually function*

### Day 1-2: Fix Chat Interface
**Task:** Replace mock `setTimeout` with real API calls
**File:** `components/app/chat-interface.tsx`
**Changes:**
- Remove hardcoded fake response (lines 60-84)
- Add `fetch('/api/chat', ...)` call
- Handle streaming responses
- Display real citations from API
- Show loading states properly

**Success Criteria:**
- Type a question, get a real AI response from OpenAI/Anthropic
- Response cites actual documents from the database
- Cost is tracked in the backend

### Day 3: Role-Based Routing
**Task:** Different experiences for admin vs member
**Files:** 
- `middleware.ts` - Add role detection
- `app/(app)/layout.tsx` - Role-based navigation
- `app/(app)/admin/page.tsx` - Admin-only guard

**Changes:**
```typescript
// middleware.ts
if (pathname.startsWith('/admin') && session.user.role !== 'admin') {
  return NextResponse.redirect(new URL('/app', request.url));
}
```

**Success Criteria:**
- `admin@acme.com` can access `/admin`
- `member@acme.com` gets redirected to `/app` if they try `/admin`
- Both see appropriate navigation items

### Day 4-5: Admin Dashboard Real Data
**Task:** Connect dashboard to real usage stats
**Files:**
- `app/api/admin/dashboard/route.ts` (create if not exists)
- `app/(app)/admin/page.tsx`

**Changes:**
- Query `conversations`, `messages`, `knowledge_sources` tables
- Calculate real costs from `cost` column
- Show actual query counts per day
- Aggregate by AI model

**Success Criteria:**
- Dashboard shows non-zero values after chat usage
- Cost tracking matches actual API spend
- Stats update in real-time (or on refresh)

---

## Phase 2: Core Product (Weeks 2-3)
*Goal: Enable knowledge ingestion and management*

### Week 2: Document Upload & Management

#### Day 1-2: Upload UI
**Task:** Build drag-and-drop file upload
**File:** `components/app/upload-modal.tsx` (new)

**Features:**
- Drag-and-drop zone
- File type validation (PDF, DOCX, TXT, MD)
- Progress indicator
- Chunking status display
- Success/error toasts

**API:** Use existing `app/api/upload/route.ts`

#### Day 3: Knowledge Sidebar Real Data
**Task:** Show actual documents instead of placeholders
**File:** `components/app/knowledge-sidebar.tsx`

**Changes:**
- Fetch from `GET /api/knowledge-sources`
- Show file names, not "txt, docx, pdf"
- Display processing status (pending, extracting, chunking, indexed, error)
- Add delete button with confirmation
- Show document count

#### Day 4-5: Document Management UI
**Task:** Full CRUD for knowledge sources
**Files:**
- `app/(app)/app/knowledge/page.tsx` (new)
- `components/knowledge/document-list.tsx` (new)
- `components/knowledge/document-actions.tsx` (new)

**Features:**
- List all documents with metadata (pages, chunks, status)
- Reindex button (re-process document)
- Delete with confirmation
- Filter by status, type, date
- Search within document names

### Week 3: Integration Foundation

#### Day 1-2: OAuth Connection UI
**Task:** Build "Connect" buttons for integrations
**File:** `app/(app)/app/integrations/page.tsx` (new or existing)

**Features:**
- Grid of available integrations (Slack, Drive, Notion, Teams, Zoom)
- "Connect" button triggers OAuth flow
- Show connected status with green checkmark
- Display connection health (last sync time, status)
- "Disconnect" option with confirmation

**APIs:** Use existing `lib/integrations/oauth-framework.ts`

#### Day 3-5: Connection Management
**Task:** Manage connected services
**File:** `components/integrations/connection-manager.tsx` (new)

**Features:**
- List connected services with icons
- Show sync frequency (real-time, hourly, daily)
- Manual "Sync Now" button
- Error indicators for failed syncs
- Token refresh status

---

## Phase 3: Integration Sync (Weeks 4-5)
*Goal: Actually pull data from connected services*

### Week 4: Slack Integration

#### Day 1-2: Slack Sync Worker
**Task:** Background job to pull Slack messages
**File:** `lib/integrations/slack-sync.ts` (new)

**Features:**
- OAuth token management
- Fetch channel list
- Sync messages with pagination
- Handle rate limits
- Store in `knowledge_sources` table with `type: 'slack'`

**Database:** Add to knowledge_sources with metadata for channel, timestamp, user

#### Day 3-5: Real-Time Webhooks
**Task:** Live Slack updates
**File:** `app/api/webhooks/slack/route.ts` (new)

**Features:**
- Slack Events API webhook handler
- New messages auto-indexed
- Channel join/leave tracking
- Thread context preservation

### Week 5: Drive & Notion Integration

#### Day 1-3: Google Drive Sync
**Task:** Pull documents from Drive
**File:** `lib/integrations/drive-sync.ts` (new)

**Features:**
- OAuth with Google
- List files with pagination
- Download and process (PDF, DOCX, Sheets)
- Convert to text and chunk
- Store embeddings
- Handle folder structure

#### Day 4-5: Notion Sync
**Task:** Pull Notion pages and databases
**File:** `lib/integrations/notion-sync.ts` (new)

**Features:**
- OAuth with Notion
- Page content extraction
- Database row handling
- Nested page structure
- Rich text to markdown conversion

---

## Phase 4: Chat Experience (Week 6)
*Goal: Full-featured chat with history and citations*

### Day 1-2: Chat History Sidebar
**Task:** Show conversation history
**File:** `components/app/conversation-sidebar.tsx` (modify existing)

**Features:**
- List past conversations with titles
- Group by date (Today, Yesterday, Last Week, Older)
- New chat button
- Rename conversation
- Delete conversation with confirmation
- Pin/star important conversations

**API:** Use `GET /api/chat` (already exists)

### Day 3-4: Citation Display
**Task:** Show which sources AI used
**File:** `components/chat/citation-panel.tsx` (new)

**Features:**
- Collapsible "Sources" section per message
- Show document name, snippet, relevance score
- Click to open full document
- Highlight used text in source
- Export citations list

**API:** Citations already returned from `/api/chat`

### Day 5: Chat Enhancements
**Task:** Polish the chat experience
**Features:**
- Message timestamps (already fixed hydration issue)
- Message editing (click to edit, resubmit)
- Regenerate response
- Copy to clipboard
- Message search within conversation
- Keyboard shortcuts (Ctrl+Enter to send, Esc to cancel)

---

## Phase 5: Admin Features (Week 7)
*Goal: Complete admin dashboard with real functionality*

### Day 1-2: User Management
**Task:** Admin can manage team members
**File:** `app/(app)/admin/users/page.tsx` (new)

**Features:**
- List all users in tenant
- Invite new user (email + role)
- Change user roles
- Deactivate/reactivate users
- View user activity (last login, queries made)
- Export user list

### Day 3-4: Cost Command Center
**Task:** Detailed cost breakdown
**File:** `app/(app)/admin/costs/page.tsx` (modify existing)

**Features:**
- Cost by model (GPT-4 vs Claude vs Gemini)
- Cost by user (who's using the most)
- Cost by source (Slack vs Drive vs Uploads)
- Daily/hourly cost charts
- Budget alerts (notify at 80% of plan limit)
- Cost projection (trend to predict monthly spend)

### Day 5: ROI Dashboard
**Task:** Calculate and display value
**File:** `app/(app)/admin/roi/page.tsx` (new)

**Features:**
- Time saved calculation (queries × 5 min saved per query)
- Efficiency score (queries per employee)
- Knowledge coverage (% of docs indexed)
- AI adoption rate (% of employees using it)
- ROI percentage (value / cost)
- Export ROI report

---

## Phase 6: Advanced Features (Week 8)
*Goal: Context Map and polish*

### Day 1-3: Context Map (D3.js)
**Task:** Visual knowledge graph
**File:** `app/(app)/app/context-map/page.tsx` (new)

**Features:**
- Force-directed graph visualization
- Nodes: Documents, topics, people
- Edges: Citations, references, similarities
- Zoom and pan
- Click to explore connected nodes
- Filter by source type
- Search within graph

### Day 4-5: Final Polish
**Task:** Production readiness

**Checklist:**
- [ ] Dark mode toggle works across all pages
- [ ] Mobile responsive (all pages usable on phone)
- [ ] Error boundaries (graceful failures)
- [ ] Loading states everywhere
- [ ] Empty states (friendly messages when no data)
- [ ] Email notifications setup
- [ ] Export functionality (conversations, analytics)
- [ ] Keyboard shortcuts documented
- [ ] Help tooltips on complex features

---

## Technical Architecture Decisions

### 1. API Integration Pattern
```typescript
// Use React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['conversations'],
  queryFn: fetchConversations,
});

// Mutations for write operations
const mutation = useMutation({
  mutationFn: sendMessage,
  onSuccess: () => {
    queryClient.invalidateQueries(['conversations']);
  },
});
```

### 2. Role-Based Access
```typescript
// Server-side check in page.tsx
const session = await auth();
if (session.user.role !== 'admin') {
  redirect('/app');
}

// Client-side navigation filtering
const navItems = session.user.role === 'admin' 
  ? [...commonItems, ...adminItems] 
  : commonItems;
```

### 3. Real-Time Updates
- **Short-term:** Polling for sync status (every 30s)
- **Long-term:** WebSocket for live chat updates

### 4. Error Handling
```typescript
// Global error boundary
<ErrorBoundary 
  fallback={<ErrorMessage />}
  onError={logToMonitoring}
>
  <App />
</ErrorBoundary>

// API error handling
try {
  const response = await fetch('/api/chat', ...);
  if (!response.ok) throw new APIError(response.status);
  return response.json();
} catch (error) {
  toast.error('Failed to send message. Please try again.');
  throw error;
}
```

---

## Success Metrics

### Functional (All Must Pass)
- [ ] User can upload PDF and ask questions about it
- [ ] AI responses cite the actual uploaded document
- [ ] Admin can see real cost data from AI API calls
- [ ] Member cannot access admin pages
- [ ] Slack messages sync and are searchable
- [ ] Chat history persists across sessions

### Performance
- [ ] Chat response < 5 seconds end-to-end
- [ ] Document upload processes in < 2 minutes (100 pages)
- [ ] Dashboard loads in < 3 seconds
- [ ] Search results return in < 1 second

### Quality
- [ ] Zero console errors
- [ ] All API calls have error handling
- [ ] Mobile responsive on all pages
- [ ] Dark mode works everywhere

---

## Daily Standup Format

**Yesterday:**
- What did you complete?

**Today:**
- What are you working on?

**Blockers:**
- What's stopping you?

**Demo:**
- Show working feature (even if small)

---

## Conclusion

**Week 1:** Product actually works (chat, roles, admin data)  
**Weeks 2-3:** Knowledge ingestion (upload, integrations)  
**Weeks 4-5:** Sync working (Slack, Drive, Notion)  
**Week 6:** Chat fully featured (history, citations)  
**Week 7:** Admin complete (users, costs, ROI)  
**Week 8:** Polish and Context Map  

**Outcome:** A fully functional Corporate Brain that delivers on every promise in the scope document.

---

*Plan Status: Realistic and Executable*  
*Next Step: Start Phase 1, Day 1 - Fix ChatInterface*  
*Last Updated: April 12, 2026*
