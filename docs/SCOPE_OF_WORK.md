# Corporate Brain - Sovereign Context Fabric

## Scope of Work Document

**Version:** 1.1  
**Date:** April 2026  
**Status:** ⚠️ PHASE 5 COMPLETE + PENDING PRODUCTION REQUIREMENTS  
**Last Updated:** April 14, 2026

> **📋 Production Readiness:** See `docs/PENDING_REQUIREMENTS.md` for comprehensive pre-launch checklist (13 major categories, 6-8 weeks effort)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Technical Architecture](#technical-architecture)
5. [AI/ML Strategy & Model Orchestration](#aiml-strategy--model-orchestration)
6. [Data Architecture & Vector Engine](#data-architecture--vector-engine)
7. [UI/UX Design System & Requirements](#uiux-design-system--requirements)
8. [Integration Ecosystem (MCP)](#integration-ecosystem-mcp)
9. [Security & Compliance Framework](#security--compliance-framework)
10. [Implementation Phases](#implementation-phases)
11. [Deliverables](#deliverables)
12. [Success Metrics & KPIs](#success-metrics--kpis)
13. [Risk Assessment & Mitigation](#risk-assessment--mitigation)
14. [Pending Production Requirements](#pending-production-requirements)
15. [Appendix](#appendix)

---

## Executive Summary

### Project Vision

The **Corporate Brain** is a **Sovereign Context Fabric**—a headless, multi-tenant SaaS platform that transforms company data into a "Live Vector Memory." Unlike traditional AI tools that lease intelligence from external providers, the Corporate Brain creates a persistent, private, and executable knowledge layer that remains the company's permanent intellectual property.

### Core Value Proposition

- **Sovereignty**: Complete data ownership with zero-training guarantees
- **Permanence**: Every interaction, document, and conversation becomes institutional memory
- **Actionability**: Not just storage—an executable brain that agents can plug into
- **Viral Growth**: "Drop your company's URL + 100 PDFs, get instant private AI"

### Key Differentiators

| Feature              | Traditional AI Tools | Corporate Brain         |
| -------------------- | -------------------- | ----------------------- |
| Data Ownership       | Leased/Processed     | Sovereign/Retained      |
| Context Persistence  | Ephemeral            | Permanent Memory        |
| Multi-Model Strategy | Single Provider      | Orchestrated Ensemble   |
| Integration Depth    | Surface-level        | Native MCP Connectivity |
| Cost Optimization    | Fixed Pricing        | Model-Routed Efficiency |

---

## Problem Statement

### The Current State: Fragmented Intelligence

#### 1. The Leased Intelligence Problem

Modern companies operate on a "leasing" model for AI:

- **Per-query amnesia**: Each ChatGPT conversation starts from zero
- **Data silos**: Slack conversations, meeting transcripts, and documents exist in disconnected systems
- **Knowledge leakage**: When employees leave, institutional knowledge evaporates
- **No central nervous system**: No unified repository of company intelligence

#### 2. The Context Gap

| Data Source              | Current State                    | Lost Value                           |
| ------------------------ | -------------------------------- | ------------------------------------ |
| Slack Messages           | Ephemeral, 90-day retention      | Tribal knowledge, decision rationale |
| Meeting Transcripts      | Scattered, unsearchable          | Action items, strategic decisions    |
| Documents (PDFs, Sheets) | Static storage, manual retrieval | Cross-referenced insights            |
| External Market Data     | Manual research                  | Competitive intelligence             |
| Code Repositories        | Isolated from business context   | Technical debt reasoning             |

#### 3. The Cost Inefficiency

- Companies burn $0.50-$2.00 per complex query using premium models for simple tasks
- No intelligent routing between fast/cheap vs. deep/reasoning models
- Redundant data processing across multiple AI tools

### Target Impact

| Metric                   | Current State         | Target State          |
| ------------------------ | --------------------- | --------------------- |
| Knowledge Retrieval Time | Hours (manual search) | Seconds (AI-assisted) |
| Employee Onboarding      | 3-6 months            | 1-2 weeks             |
| Decision Documentation   | 30% captured          | 95% captured          |
| Cross-functional Context | Siloed                | Unified               |

---

## Solution Overview

### The Sovereign Context Fabric

The Corporate Brain operates as a **headless, multi-tenant context layer** that sits between company data and AI agents. It doesn't replace existing tools—it elevates them by providing unified, permanent memory.

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CORPORATE BRAIN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   USERS     │    │   AGENTS    │    │   APPS      │                  │
│  │ (Employees) │    │ (Internal/  │    │ (Third-     │                  │
│  │             │    │  External)  │    │  Party)     │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            │                                            │
│         ┌──────────────────┴──────────────────┐                         │
│         │    SOVEREIGN CONTEXT API LAYER      │                         │
│         │         (Next.js App Router)        │                         │
│         └──────────────────┬──────────────────┘                         │
│                            │                                            │
│    ┌───────────────────────┼───────────────────────┐                   │
│    │                       │                       │                   │
│ ┌──┴───┐  ┌──────────┐  ┌─┴────┐  ┌──────────┐  ┌─┴───┐               │
│ │Chat  │  │ Context  │  │Action│  │  Admin   │  │ROI  │               │
│ │UI    │  │  Layer   │  │Engine│  │Dashboard │  │Dash │               │
│ └──┬───┘  └────┬─────┘  └──┬───┘  └────┬─────┘  └──┬──┘               │
│    │           │          │           │           │                   │
│    └───────────┴──────────┴───────────┴───────────┘                   │
│                         │                                              │
│    ┌────────────────────┴────────────────────┐                        │
│    │      MODEL ORCHESTRATION LAYER         │                        │
│    │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │                        │
│    │  │ Gemini  │ │  GPT-5  │ │ Claude  │  │                        │
│    │  │ 3 Pro   │ │  5.4    │ │ 4.6 Opus│  │                        │
│    │  └─────────┘ └─────────┘ └─────────┘  │                        │
│    │  ┌─────────┐ ┌─────────┐              │                        │
│    │  │Gemini   │ │ GPT-5   │              │                        │
│    │  │2.5 Flash│ │ Nano    │              │                        │
│    │  └─────────┘ └─────────┘              │                        │
│    └─────────────────────────────────────────┘                        │
│                         │                                              │
│    ┌────────────────────┴────────────────────┐                        │
│    │      HYBRID RAG & CONTEXT LAYER        │                        │
│    │  ┌─────────────┐    ┌────────────────┐  │                        │
│    │  │ pgvector    │    │ Long Context   │  │                        │
│    │  │ (PostgreSQL)│    │ (Gemini 3 Pro) │  │                        │
│    │  │ Cold Storage│    │ Hot Context    │  │                        │
│    │  └─────────────┘    └────────────────┘  │                        │
│    └─────────────────────────────────────────┘                        │
│                         │                                              │
│    ┌────────────────────┴────────────────────┐                        │
│    │         DATA INGESTION ENGINE          │                        │
│    │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │                        │
│    │  │Unstruct-│ │Firecrawl│ │ MCP     │  │                        │
│    │  │ured.io  │ │ Scraper │ │Connect. │  │                        │
│    │  └─────────┘ └─────────┘ └─────────┘  │                        │
│    └─────────────────────────────────────────┘                        │
│                         │                                              │
│    ┌────────────────────┴────────────────────┐                        │
│    │           DATA SOURCES                   │                        │
│    │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │                        │
│    │  │  PDFs   │ │  Slack  │ │  Drive  │  │                        │
│    │  │  URLs   │ │  Teams  │ │  Notion │  │                        │
│    │  │  Excel  │ │  Zoom   │ │  Docs   │  │                        │
│    │  └─────────┘ └─────────┘ └─────────┘  │                        │
│    └─────────────────────────────────────────┘                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Core Stack Specification

| Layer                 | Technology           | Version                    | Purpose                                                 |
| --------------------- | -------------------- | -------------------------- | ------------------------------------------------------- |
| **Framework**         | Next.js App Router   | Latest Stable              | Full-stack React framework with server components       |
| **Language**          | TypeScript           | Latest Stable, Strict Mode | Type-safe development                                   |
| **Styling**           | Tailwind CSS         | Latest Stable              | Utility-first CSS                                       |
| **Database**          | PostgreSQL           | 15+                        | Relational data + vector storage                        |
| **Vector Engine**     | pgvector             | Latest                     | Embedding storage & similarity search                   |
| **ORM**               | Drizzle ORM          | Latest                     | Type-safe database operations                           |
| **Authentication**    | Auth.js (NextAuth)   | Latest Stable              | Multi-tenant auth with OAuth                            |
| **AI Integration**    | Direct API Clients   | Native                     | Direct OpenAI, Anthropic, Google API integration        |
| **AI SDK (Optional)** | Vercel AI SDK        | Latest                     | Optional unified interface (alternative to direct APIs) |
| **Orchestration**     | LangChain.js         | Latest                     | Agent workflows & chains                                |
| **Task Queue**        | Upstash Redis        | Latest                     | Background job processing                               |
| **File Parsing**      | Unstructured.io      | API                        | Complex document extraction                             |
| **Web Scraping**      | Firecrawl            | API                        | Clean markdown extraction                               |
| **Deployment**        | Vercel + VPS + Local | Multi-target               | Edge + self-hosted options                              |

### Infrastructure Requirements

#### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Web App   │  │    API      │  │   Edge      │       │
│  │   (Next.js) │  │   Routes    │  │   Config    │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │               │
│         └────────────────┴────────────────┘               │
│                          │                               │
├──────────────────────────┼───────────────────────────────┤
│                          ▼                               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              RENDER / AWS / GCP VPS                  │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │ │
│  │  │ PostgreSQL  │  │   Redis     │  │  Worker   │   │ │
│  │  │  + pgvector │  │  (Upstash)  │  │  Nodes    │   │ │
│  │  └─────────────┘  └─────────────┘  └───────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Local Development Environment

```bash
# Docker Compose Stack
docker-compose up -d
  - postgres:15 (with pgvector extension)
  - redis:7-alpine
  - nextjs:3000 (dev server)
```

### Rendering Strategy & SEO Architecture

The Corporate Brain implements a **hybrid rendering approach** optimized for both search engine discoverability and rich client-side interactivity.

#### Route-Based Rendering Matrix

| Route Group           | Rendering Mode                  | Rationale                                                           | SEO Priority     |
| --------------------- | ------------------------------- | ------------------------------------------------------------------- | ---------------- |
| **/(marketing)/**     | **SSR (Server-Side Rendering)** | Public content must be visible to search engines and in view-source | Critical         |
| **/(app)/app/**       | **CSR (Client-Side Rendering)** | Authenticated subscriber dashboard with real-time features          | None (protected) |
| **/(app)/dashboard/** | **CSR (Client-Side Rendering)** | Admin owner dashboard with data visualization & management          | None (protected) |
| **/api/**             | **Server Functions**            | API routes always server-side                                       | N/A              |

#### Public Frontend (Marketing Site) - SSR Requirements

**SEO-First Architecture:**

- All marketing pages render complete HTML on the server
- Content visible in `view-source:` without JavaScript execution
- Meta tags, Open Graph, structured data (JSON-LD) populated at request time
- Dynamic sitemap.xml and robots.txt generation

**Implementation via Next.js App Router:**

```typescript
// app/(marketing)/page.tsx - Server Component by default
export default async function HomePage() {
  // Data fetching happens on server
  // Full HTML returned to browser/search crawler
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <FeatureGrid />
      <PricingCalculator />
    </main>
  );
}

// SEO metadata generated server-side
export async function generateMetadata() {
  return {
    title: 'Corporate Brain - Sovereign AI Context Fabric',
    description: 'Transform company data into a private, permanent AI brain...',
    openGraph: {
      images: ['/og-image.jpg'],
    },
  };
}
```

**Key SSR Pages:**
| Page | URL | Content Requirements |
|------|-----|---------------------|
| Homepage | `/` | Full content in view-source, hero with URL input, animated neural network (CSS-based for SSR) |
| Pricing | `/pricing` | Interactive slider SSR shell, hydration for calculator |
| Trust Center | `/trust` | Compliance badges, SOC 2, GDPR, Zero-Training guarantee |
| Blog/Content | `/blog/*` | Article content fully SSR'd for indexing |
| Docs | `/docs/*` | Documentation content server-rendered |

#### Protected Application Routes - CSR Architecture

**`/app` - Subscriber Management Dashboard:**

```typescript
// app/(app)/app/page.tsx
'use client'; // CSR boundary

import { useSession } from 'next-auth/react';
import { ChatInterface } from '@/components/app/chat-interface';
import { ContextSidebar } from '@/components/app/context-sidebar';

export default function AppDashboard() {
  // Client-side authentication check
  const { data: session, status } = useSession();

  if (status === 'loading') return <AppSkeleton />;
  if (!session) return redirect('/login');

  return (
    <DashboardLayout>
      <ContextSidebar />      {/* Client-side data fetching */}
      <ChatInterface />       {/* Real-time streaming */}
      <CitationPanel />       {/* Dynamic source viewer */}
    </DashboardLayout>
  );
}
```

**CSR Features:**

- Real-time chat streaming via WebSocket/SSE
- Interactive D3.js knowledge graph
- Drag-and-drop file upload with progress
- OAuth connection flows (popup-based)
- Command-K omnibox (client-side fuzzy search)

**`/dashboard` - Admin Owner Dashboard:**

```typescript
// app/(app)/dashboard/page.tsx
"use client";

import { useTenantStats } from "@/hooks/use-tenant-stats";
import { CostCommandCenter } from "@/components/admin/cost-center";
import { TenantOverview } from "@/components/admin/tenant-overview";

export default function AdminDashboard() {
  // Admin role verification (client-side)
  // Rich data visualization (Recharts/D3)
  // Real-time token burn rate charts
  // Export functionality
}
```

#### Technical Implementation Guidelines

**Server Component Default (App Router):**

- All pages default to Server Components (SSR)
- Use `'use client'` directive only when needed for:
  - Browser APIs (localStorage, clipboard)
  - React hooks (useState, useEffect)
  - Event handlers (onClick, onSubmit)
  - Third-party libraries requiring DOM

**Streaming Architecture:**

```typescript
// app/(marketing)/page.tsx with Suspense boundaries
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main>
      {/* Critical above-fold content - SSR immediate */}
      <HeroSection />

      {/* Below-fold can stream */}
      <Suspense fallback={<FeaturesSkeleton />}>
        <FeatureGrid />
      </Suspense>

      <Suspense fallback={<PricingSkeleton />}>
        <PricingCalculator />
      </Suspense>
    </main>
  );
}
```

**Route Group Structure:**

```
app/
├── (marketing)/           # SSR Group
│   ├── layout.tsx         # Root layout with SEO defaults
│   ├── page.tsx           # Homepage (SSR)
│   ├── pricing/
│   │   └── page.tsx       # Pricing page (SSR)
│   ├── trust/
│   │   └── page.tsx       # Trust center (SSR)
│   └── layout.tsx         # Marketing layout
│
├── (app)/                 # CSR Group (authenticated)
│   ├── layout.tsx         # App shell with auth check
│   ├── app/
│   │   └── page.tsx       # Subscriber dashboard (CSR)
│   ├── dashboard/
│   │   └── page.tsx       # Admin dashboard (CSR)
│   └── onboarding/
│       └── page.tsx       # Ingestion hub (CSR)
│
└── api/                   # Server-only routes
    └── ...
```

### Public Pages, Tools & Programmatic SEO (Future)

The following pages are planned for future releases to enhance marketing reach and user engagement:

#### Marketing Pages (SSR - Future)

| Page                      | URL             | Purpose                       | SEO Target                 |
| ------------------------- | --------------- | ----------------------------- | -------------------------- |
| **Features Deep-Dive**    | `/features`     | Detailed feature explanations | "enterprise AI features"   |
| **Integration Directory** | `/integrations` | All supported integrations    | "Slack AI integration"     |
| **About / Company**       | `/about`        | Team, mission, story          | Brand + careers            |
| **Blog / Content Hub**    | `/blog/*`       | Content marketing             | Long-tail keywords         |
| **Changelog**             | `/changelog`    | Product updates               | Feature announcements      |
| **Status Page**           | `/status`       | System health                 | "corporate brain status"   |
| **Security Center**       | `/security`     | Detailed security info        | "secure AI knowledge base" |
| **Help Center**           | `/help`         | FAQs, guides                  | Support content            |

#### Programmatic SEO Pages (Future)

| Template               | Example URL                    | Target Keywords            |
| ---------------------- | ------------------------------ | -------------------------- |
| **Integration Guides** | `/integrations/slack/setup`    | "Slack AI assistant setup" |
| **Use Case Pages**     | `/use-cases/legal-compliance`  | "AI for legal teams"       |
| **Industry Solutions** | `/solutions/healthcare`        | "HIPAA compliant AI"       |
| **Comparison Pages**   | `/vs/guru-alternative`         | "corporate brain vs guru"  |
| **ROI Calculator**     | `/tools/roi-calculator`        | "knowledge management ROI" |
| **Customer Stories**   | `/customers/acme-corp`         | Brand + social proof       |
| **API Documentation**  | `/developers/api`              | "REST API documentation"   |
| **Templates**          | `/templates/employee-handbook` | Document templates         |
| **Glossary**           | `/glossary/vector-search`      | "what is vector search"    |

#### Free Tools (Future)

| Tool                    | URL                        | Purpose                    |
| ----------------------- | -------------------------- | -------------------------- |
| **URL Scraper Preview** | `/tools/scraper-preview`   | Test Firecrawl extraction  |
| **Document Analyzer**   | `/tools/document-analyzer` | Preview PDF extraction     |
| **ROI Calculator**      | `/tools/roi-calculator`    | Interactive savings calc   |
| **Security Scanner**    | `/tools/security-check`    | Public security assessment |
| **API Playground**      | `/developers/playground`   | Try endpoints without auth |
| **Prompt Optimizer**    | `/tools/prompt-optimizer`  | AI prompt improvement      |
| **Text Summarizer**     | `/tools/summarizer`        | Free text summarization    |

---

## Core Web Vitals & Performance Architecture

The Corporate Brain is engineered for **100/100 Lighthouse scores** on both Desktop and Mobile, delivering a premium, instant-feeling experience with zero visual instability.

### Performance Targets

| Metric                              | Target  | Lighthouse Weight | Implementation                                         |
| ----------------------------------- | ------- | ----------------- | ------------------------------------------------------ |
| **Performance Score**               | 100/100 | Overall           | All optimizations below                                |
| **LCP (Largest Contentful Paint)**  | < 1.2s  | 25%               | `next/image`, priority loading, font optimization      |
| **INP (Interaction to Next Paint)** | < 100ms | 30%               | Event handler optimization, main thread liberation     |
| **CLS (Cumulative Layout Shift)**   | 0       | 25%               | Fixed dimensions, reserved spaces, no injected content |
| **TTFB (Time to First Byte)**       | < 200ms | -                 | Edge rendering, streaming, caching                     |
| **FCP (First Contentful Paint)**    | < 800ms | 10%               | `next/font`, critical CSS inline                       |
| **TBT (Total Blocking Time)**       | < 100ms | -                 | Code splitting, lazy evaluation                        |
| **SI (Speed Index)**                | < 2s    | 10%               | Progressive rendering, above-fold priority             |

### Zero-CLS Guarantee

**Strict Layout Stability Requirements:**

- All images must have explicit `width` and `height` attributes (or `fill` with defined container)
- No content injection above existing content (no banners, modals, or notifications that push content down)
- Font display strategy: `font-display: swap` with fallback font metrics matching final font
- Skeleton screens must match final layout dimensions exactly (no "pop-in" effect)
- Reserved space for all dynamic content (ads, charts, lazy-loaded sections)

**Implementation via Next.js:**

```typescript
// app/layout.tsx - Font optimization (zero layout shift)
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // Prevent FOIT (Flash of Invisible Text)
  variable: '--font-inter',
  // Preload critical weights only
  weight: ['400', '500', '600', '700'],
});

// Image optimization (zero CLS)
import Image from 'next/image';

// ALWAYS provide dimensions or use fill with defined container
<Image
  src="/hero.png"
  alt="Corporate Brain Hero"
  width={1200}      // Required for CLS prevention
  height={600}      // Required for CLS prevention
  priority          // Above-fold image
  placeholder="blur" // Blur-up loading (optional)
/>
```

### No-Flash Loading Strategy

**Prohibited Patterns:**

- ❌ Skeleton screens that visibly flash on every refresh
- ❌ "Loading..." spinners for content that should be SSR'd
- ❌ Layout "pops" or content jumps during hydration
- ❌ White screens during route transitions

**Required Patterns:**

- ✅ Instant rendering of SSR shell (no perceived load time for static content)
- ✅ Skeletons only for truly dynamic data (with exact-size placeholders)
- ✅ CSS-based loading states (no JavaScript-driven flashing)
- ✅ Graceful degradation: if JS fails, SSR content remains visible

```typescript
// Bad: Flashing skeleton on every refresh
function Dashboard() {
  const { data, isLoading } = useQuery(...);
  if (isLoading) return <Skeleton />;  // ❌ Flash!
  return <Content data={data} />;
}

// Good: SSR shell with progressive enhancement
function Dashboard() {
  // Server provides initial data
  // Hydration adds interactivity, not content
  const { data } = useQuery(..., {
    initialData: serverData,  // No loading state!
  });
  return <Content data={data} />;
}

// Acceptable: Skeleton for streaming dynamic content
function AnalyticsWidget() {
  return (
    <Suspense fallback={
      <div className="h-[300px] bg-muted animate-pulse" />  // Exact size match
    }>
      <ChartContent />
    </Suspense>
  );
}
```

### Deferred & Lazy Loading

**Heavy Component Loading Strategy:**

```typescript
// Defer charts until viewport intersection
import { lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

const HeavyChart = lazy(() => import('./heavy-chart'));

function DeferredChart() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px', // Start loading 100px before viewport
  });

  return (
    <div ref={ref} className="h-[400px]">
      {inView ? (
        <Suspense fallback={<ChartSkeleton className="h-[400px]" />}>
          <HeavyChart />
        </Suspense>
      ) : (
        <ChartSkeleton className="h-[400px]" />
      )}
    </div>
  );
}
```

**Deferred Libraries:**

- D3.js charts (load only when scrolled into view)
- Heavy data tables (virtualized + windowed loading)
- PDF viewers (dynamic import on document selection)
- Code syntax highlighters (load on demand)

### Animation & Micro-Interactions

**Smooth Page Transitions:**

```typescript
// app/layout.tsx - View transitions for SPA feel
export const viewport = {
  themeColor: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Enable view transitions API
  colorScheme: 'dark light',
};

// CSS for page transitions
/* globals.css */
@layer utilities {
  .page-transition-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease, transform 300ms ease;
  }
}
```

**Micro-Interactions:**
| Element | Trigger | Animation |
|---------|---------|-----------|
| Buttons | Hover | Scale 1.02, shadow lift, 150ms ease-out |
| Cards | Hover | translateY(-4px), shadow increase, 200ms cubic-bezier(0.4, 0, 0.2, 1) |
| Links | Hover | Underline slide from left, 200ms |
| Icons | Hover | Rotate 5deg or scale 1.1, 150ms |
| Input focus | Focus | Border color transition, shadow glow, 150ms |
| Dropdown | Open | Scale from 0.95, opacity 0→1, 150ms ease-out |
| Modal | Open | Backdrop fade, content scale from 0.95, 200ms |

**Data Counter Animations:**

```typescript
// Animated counter that "ticks" up to final value
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeOutExpo for satisfying "tick" effect
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Usage in ROI dashboard
<p className="text-4xl font-bold">
  <AnimatedCounter target={450} /> questions answered
</p>
```

### Performance Monitoring

**Lighthouse CI Integration:**

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://preview-url/
      https://preview-url/pricing
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

**lighthouse-budget.json:**

```json
{
  "performance": {
    "warning": 0.95,
    "error": 0.9
  },
  "resourceCounts": {
    "total": { "warning": 50, "error": 80 }
  },
  "resourceSizes": {
    "javascript": { "warning": 300000, "error": 500000 },
    "image": { "warning": 1000000, "error": 2000000 }
  }
}
```

### Resource Loading Priorities

**Critical Path (Load First):**

1. HTML document (streaming)
2. Critical CSS (inlined)
3. Fonts (`next/font` preloaded)
4. Above-fold images (`priority` prop)
5. Core JavaScript (hydration)

**Deferred (Load Later):**

- Analytics scripts (after `requestIdleCallback`)
- Chat widgets (after user interaction)
- Heavy charts (intersection observer)
- Non-critical CSS (lazy loaded)

---

## AI/ML Strategy & Model Orchestration

### The Multi-Model "Brain" Architecture

The Corporate Brain implements a **Model Router** that intelligently selects the optimal LLM based on task characteristics, context requirements, and cost constraints.

#### Model Assignment Matrix

| Engine        | Model            | Context Window | Use Case                                           | Cost Tier |
| ------------- | ---------------- | -------------- | -------------------------------------------------- | --------- |
| **Ingestion** | Gemini 3 Pro     | 2M tokens      | Bulk document processing, initial index            | Medium    |
| **Reasoning** | GPT-5.4          | 128K tokens    | Complex cross-referencing, policy analysis         | High      |
| **Action**    | Claude 4.6 Opus  | 200K tokens    | Code generation, task execution, agentic workflows | High      |
| **Speed**     | Gemini 2.5 Flash | 1M tokens      | Simple Q&A, Slack log queries                      | Low       |
| **Micro**     | GPT-5 Nano       | 128K tokens    | Classification, routing, simple extraction         | Very Low  |

### Routing Logic Implementation

```typescript
// Model Router Configuration
interface ModelRouter {
  // Task-based routing
  ingestion: "gemini-3-pro"; // Bulk processing
  reasoning: "gpt-5.4"; // Complex analysis
  action: "claude-4.6-opus"; // Task execution
  speed: "gemini-2.5-flash"; // Quick queries

  // Context-window routing
  hotContext: "gemini-3-pro"; // Recent data (last 3 months)
  coldContext: "pgvector-rag"; // Historical search

  // User override
  userPreference: "auto" | "fast" | "deep" | "creative";
}
```

#### Decision Flow

```
User Query/Request
       │
       ▼
┌───────────────┐
│ Query Analysis│
│ - Complexity  │
│ - Context need│
│ - Latency req │
└───────┬───────┘
        │
        ▼
┌───────────────────────────────────┐
│           ROUTING DECISION          │
├───────────────────────────────────┤
│ IF bulk_ingestion → Gemini 3 Pro   │
│ IF complex_reasoning → GPT-5.4     │
│ IF code_action → Claude 4.6 Opus   │
│ IF simple_qa → Gemini 2.5 Flash    │
│ IF hot_context → Gemini 3 Pro      │
│ IF cold_retrieval → pgvector + any  │
└───────────────────────────────────┘
        │
        ▼
┌───────────────┐
│ Model Execution│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Response      │
│  + Citations   │
└───────────────┘
```

### Context Strategy: Hybrid RAG

#### Hot Context (Long Context Window)

- **Engine**: Gemini 3 Pro (2M tokens)
- **Use Case**: Recent data, ongoing conversations, this week's Slack
- **Advantage**: No retrieval latency, perfect recall of recent context
- **Implementation**: Feed last 3 months of relevant data directly into prompt

#### Cold Context (Vector Search)

- **Engine**: PostgreSQL + pgvector
- **Use Case**: Historical documents, archived conversations
- **Implementation**:
  - 1536-dimensional embeddings (OpenAI text-embedding-3-large)
  - HNSW indexing for approximate nearest neighbor search
  - Hybrid search (vector + full-text via PostgreSQL tsvector)

---

## Data Architecture & Vector Engine

### Database Schema Design

#### Core Tables

```sql
-- Tenants (Multi-tenancy foundation)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Tenant-scoped)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Knowledge Sources (Documents, URLs, Integrations)
CREATE TABLE knowledge_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'pdf', 'url', 'slack', 'notion', etc.
    source_id VARCHAR(255), -- External ID (e.g., Slack message ID)
    title VARCHAR(500),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    url TEXT,
    file_path TEXT,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    checksum VARCHAR(64), -- For deduplication
    embedding VECTOR(1536), -- pgvector
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, indexed, error
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for fast similarity search
CREATE INDEX idx_knowledge_embedding ON knowledge_sources
USING hnsw (embedding vector_cosine_ops);

-- Conversations (Chat history)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    model_used VARCHAR(100),
    context_window_size INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Individual chat messages)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    model VARCHAR(100),
    tokens_used INTEGER,
    citations JSONB DEFAULT '[]', -- Source references
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations (MCP connections)
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- 'slack', 'notion', 'gdrive', etc.
    status VARCHAR(50) DEFAULT 'pending',
    credentials_encrypted TEXT, -- Encrypted OAuth tokens
    settings JSONB DEFAULT '{}',
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (Security & compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Tracking (ROI & billing)
CREATE TABLE usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    model VARCHAR(100) NOT NULL,
    tokens_input BIGINT DEFAULT 0,
    tokens_output BIGINT DEFAULT 0,
    requests_count INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,4) DEFAULT 0,
    UNIQUE(tenant_id, date, model)
);
```

### Vector Search Implementation

#### Similarity Search Query

```typescript
// Cosine similarity search with metadata filtering
const similarDocuments = await db.query.knowledgeSources.findMany({
  where: and(
    eq(knowledgeSources.tenantId, tenantId),
    sql`embedding <-> ${queryEmbedding} < 0.3`,
    eq(knowledgeSources.status, "indexed"),
  ),
  orderBy: sql`embedding <-> ${queryEmbedding}`,
  limit: 10,
});
```

#### Hybrid Search (Vector + Full-Text)

```sql
-- Combined vector and text search with ranking
SELECT
    ks.*,
    (0.7 * (1 - (ks.embedding <=> query_embedding))) +
    (0.3 * ts_rank(ks.search_vector, query_tsquery)) as score
FROM knowledge_sources ks
WHERE ks.tenant_id = $1
    AND (ks.embedding <=> query_embedding < 0.3
         OR ks.search_vector @@ query_tsquery)
ORDER BY score DESC
LIMIT 20;
```

### Future Database Schema Additions (Future)

The following tables are planned for future releases to support advanced features:

```sql
-- Notifications (Future)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'mention', 'system', 'alert'
    title VARCHAR(255),
    content TEXT,
    read_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks (Future)
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    events VARCHAR(50)[] NOT NULL, -- ['document.created', 'query.made']
    secret VARCHAR(255), -- HMAC signature
    active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Versions (Future)
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT,
    checksum VARCHAR(64),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments & Annotations (Future)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- threaded replies
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Searches (Future)
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    filters JSONB,
    alert_enabled BOOLEAN DEFAULT false,
    last_alert_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys (Future)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255),
    key_hash VARCHAR(64) NOT NULL, -- SHA-256 of key
    permissions VARCHAR(50)[], -- ['read', 'write', 'admin']
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Tasks / Cron Jobs (Future)
CREATE TABLE scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    task_type VARCHAR(50) NOT NULL, -- 'sync', 'report', 'cleanup'
    schedule VARCHAR(100) NOT NULL, -- Cron expression
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Automations (Future)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger VARCHAR(100) NOT NULL, -- 'document.created', 'query.made'
    conditions JSONB, -- Filter conditions
    actions JSONB NOT NULL, -- Actions to execute
    active BOOLEAN DEFAULT true,
    run_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## UI/UX Design System & Requirements

### Brand Positioning: Premium Sovereign SaaS

**Visual Identity**: Fortune 500 enterprise-grade with Silicon Valley innovation

#### Color Palette

```css
/* Primary Colors */
--color-sovereign-white: #fafafa; /* Clean, premium background */
--color-deep-void: #0a0a0a; /* Dark mode foundation */
--color-graphite: #1a1a2e; /* Secondary dark */

/* Accent Colors */
--color-neural-purple: #6366f1; /* Primary action - intelligence */
--color-electric-cyan: #06b6d4; /* Secondary - tech forward */
--color-sovereign-gold: #f59e0b; /* Premium highlights */

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;

/* Gradients */
--gradient-intelligence: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
--gradient-sovereign: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
```

### Typography

```css
/* Font Stack */
--font-display: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;

/* Scale */
--text-hero: 4rem; /* 64px - Homepage headlines */
--text-h1: 2.5rem; /* 40px - Page titles */
--text-h2: 1.875rem; /* 30px - Section headers */
--text-h3: 1.5rem; /* 24px - Card titles */
--text-body: 1rem; /* 16px - Primary content */
--text-small: 0.875rem; /* 14px - Secondary text */
--text-xs: 0.75rem; /* 12px - Captions */
```

### Component Library

#### 1. Public Frontend (Marketing Site)

**Homepage Sections:**

| Section      | Purpose               | Key Elements                                                |
| ------------ | --------------------- | ----------------------------------------------------------- |
| Hero         | Viral trigger         | Terminal-like URL input, animated neural network background |
| Trust        | Sovereignty messaging | Zero-training badge, security certifications, PII shield    |
| Features     | Value proposition     | 3-column grid: Ingest, Reason, Action                       |
| Integration  | Ecosystem             | Animated connector lines to Slack, Notion, Drive            |
| Pricing      | ROI calculator        | Interactive slider: PDFs → Hours saved                      |
| Social Proof | Credibility           | Logo carousel, testimonial cards                            |

**Hero Component Spec:**

```typescript
interface HeroSection {
  // "Drop your URL or point to a Google Drive folder"
  primaryInput: {
    placeholder: string;
    type: "url" | "gdrive-picker";
    validation: (input: string) => boolean;
    onSubmit: (input: string) => Promise<IngestionResult>;
  };

  // Live Vector visual
  backgroundAnimation: {
    type: "neural-network";
    nodeCount: 50;
    connectionDistance: 150;
    color: "neural-purple";
    pulseSpeed: "slow";
  };

  // Trust indicators
  badges: ["SOC-2", "GDPR", "Zero-Training", "Enterprise-Grade"];
}
```

#### 2. End-User Dashboard (/app)

**Layout Architecture:**

```
┌────────────────────────────────────────────────────────────────┐
│  Logo    Search Omnibox (Cmd+K)    Model Switcher   Profile  │ ← Header
├──────────┬─────────────────────────────────────────────────────┤
│          │                                                     │
│          │    ┌─────────────────────────────────────────────┐   │
│          │    │                                             │   │
│ Context  │    │          CONVERSATION VIEW                  │   │
│  Sidebar │    │                                             │   │
│          │    │    ┌──────────┐         ┌──────────┐       │   │
│ - Today  │    │    │  User    │         │  AI      │       │   │
│ - Week   │    │    │  Query   │   →     │  Response│       │   │
│ - Month  │    │    └──────────┘         └────┬─────┘       │   │
│          │    │                              │             │   │
│ Sources  │    │    ┌─────────────────────────┴──────────┐  │   │
│  Panel   │    │    │  CITATIONS SIDEBAR                  │  │   │
│          │    │    │  - PDF Page 42                      │  │   │
│ - PDFs   │    │    │  - Slack Thread #general            │  │   │
│ - URLs   │    │    │  - Notion Page "Q4 Strategy"       │  │   │
│ - Slack  │    │    └─────────────────────────────────────┘  │   │
│          │    │                                             │   │
│          │    │    ┌────────────────────────────────────────┐ │   │
│          │    │    │ Input Bar + Action Buttons           │ │   │
│          │    │    │ [Draft Email] [Create Notion Page]   │ │   │
│          │    │    └────────────────────────────────────────┘ │   │
│          │    │                                             │   │
│          │    └─────────────────────────────────────────────┘   │
│          │                                                     │
│          │    ┌─────────────────────────────────────────────┐   │
│          │    │         CONTEXT MAP (Toggle View)           │   │
│          │    │    [2D/3D Zoomable Knowledge Graph]         │   │
│          │    └─────────────────────────────────────────────┘   │
└──────────┴───────────────────────────────────────────────────────┘
```

**Key UI Components:**

| Component            | Function              | Spec                                                           |
| -------------------- | --------------------- | -------------------------------------------------------------- |
| **Omnibox**          | Command-K search      | `⌘+K` trigger, natural language input, suggestion dropdown     |
| **Model Switcher**   | User model preference | Toggle: "Fast & Cheap (Flash)" / "Maximum Intelligence (Opus)" |
| **Citation Sidebar** | Source transparency   | Collapsible panel, PDF thumbnails, direct links                |
| **Context Map**      | Visual knowledge      | D3.js force-directed graph, zoomable, clickable clusters       |
| **Action Buttons**   | Task execution        | Contextual actions: "Draft Email", "Create Doc", "Schedule"    |

#### 3. Ingestion Hub (Onboarding)

**4-Stage Workflow:**

```
Stage 1: URL Drop (The Hook)
┌─────────────────────────────────────────┐
│  🌐 Enter your company URL              │
│  ┌─────────────────────────────────┐    │
│  │ https://example.com             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Crawl Progress Card]                  │
│  ┌─────────────────────────────────┐    │
│  │ Indexing Public Voice...        │    │
│  │ ████████░░░░ 42 pages found     │    │
│  │                                 │    │
│  │ • /about - 3 paragraphs         │
│  │ • /services - 8 sections          │
│  │ • /blog - 31 articles             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

Stage 2: Document Upload (The Depth)
┌─────────────────────────────────────────┐
│  📄 Drop your 100 PDFs                  │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │    📂 DRAG & DROP ZONE          │    │
│  │         OR CLICK TO BROWSE      │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Upload Queue:                          │
│  ┌─────────────────────────────────┐    │
│  │ 🟡 handbook.pdf - Processing... │    │
│  │ 🟢 q4-report.pdf - Indexed ✓    │    │
│  │ 🔴 old-data.xlsx - Error ⚠      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

Stage 3: OAuth Connections
┌─────────────────────────────────────────┐
│  🔗 Connect your tools                  │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │  Slack   │  │  Drive   │            │
│  │  [Auth]  │  │  [Auth]  │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │  Notion  │  │  Teams   │            │
│  │  [Auth]  │  │  [Auth]  │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘

Stage 4: Brain Visualization
┌─────────────────────────────────────────┐
│  🧠 Your Brain is forming...            │
│                                         │
│    [Interactive D3 Knowledge Graph]    │
│                                         │
│  Nodes: 1,247    Connections: 8,392       │
│                                         │
│  Clusters identified:                   │
│  • Legal (234 docs)                     │
│  • Engineering (512 docs)               │
│  • Sales (89 docs)                      │
│  • HR (412 docs)                        │
└─────────────────────────────────────────┘
```

#### 4. Admin Dashboard (/dashboard)

**Owner Panel Sections:**

| Section                 | Metrics                                              | Function                                     |
| ----------------------- | ---------------------------------------------------- | -------------------------------------------- |
| **Tenant Overview**     | Active tenants, health status, API limits            | "City view" grid of all company brains       |
| **Cost Command Center** | Token burn rate, revenue per tenant, margin analysis | Model performance toggles, cost optimization |
| **Security Logs**       | PII masking hits, audit trails, export events        | Compliance dashboard                         |
| **Usage Analytics**     | Hottest contexts, query patterns, knowledge gaps     | Insights for pre-built brain templates       |

**ROI Dashboard (Tenant Admin View):**

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 YOUR BRAIN'S IMPACT                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⏱️ TIME RECLAIMED                    🧠 KNOWLEDGE GAPS       │
│  ┌─────────────────────────┐          ┌─────────────────────┐ │
│  │  This Month:            │          │  Missing Topics:      │ │
│  │                         │          │                       │ │
│  │  450 questions answered │          │  • Security policies  │ │
│  │  22 hours saved         │          │    (asked 47x)        │ │
│  │                         │          │  • API documentation  │ │
│  │  💵 $4,200 value        │          │    (asked 31x)        │ │
│  └─────────────────────────┘          │                       │ │
│                                       │  [Create Guide]       │ │
│                                       └─────────────────────┘ │
│                                                                 │
│  📈 USAGE TRENDS                                                │
│  [Line chart: Daily queries over 30 days]                       │
│                                                                 │
│  🎯 TOP QUERIES                     🔥 TRENDING CONTEXTS      │
│  1. "What's our refund policy?"       • Q4 Planning             │
│  2. "How do I reset 2FA?"            • New Hire Onboarding      │
│  3. "Who owns the API gateway?"      • Security Review          │
└─────────────────────────────────────────────────────────────────┘
```

### Additional UI Components (Future)

The following components are planned for future releases to enhance user experience:

#### App Dashboard Components (Future)

| Component                         | Purpose                                                   | Status |
| --------------------------------- | --------------------------------------------------------- | ------ |
| **Activity Feed**                 | Real-time stream of team actions, mentions, new documents | Future |
| **Notification Bell**             | Badge count, dropdown panel for alerts and mentions       | Future |
| **Quick Actions Menu**            | Floating action button for common tasks                   | Future |
| **Advanced Search Filters**       | Date range, source type, author, tag filtering            | Future |
| **Bulk Operations Bar**           | Multi-select documents, batch actions                     | Future |
| **Bookmark/Star System**          | Save frequent queries or documents                        | Future |
| **Keyboard Shortcuts Modal**      | `?` key help overlay with all shortcuts                   | Future |
| **Onboarding Tour Tooltips**      | New feature walkthroughs                                  | Future |
| **Real-time Presence Indicators** | Show active users, who's viewing what                     | Future |
| **Document Preview Drawer**       | Slide-out panel for quick document preview                | Future |
| **Compare Documents**             | Side-by-side diff viewer for versions                     | Future |
| **Collaborative Cursors**         | See other users' cursor positions                         | Future |

#### Admin Dashboard Components (Future)

| Component                     | Purpose                                         | Status |
| ----------------------------- | ----------------------------------------------- | ------ |
| **System Health Monitor**     | Green/yellow/red status indicators for services | Future |
| **Live Activity Stream**      | Real-time user sessions, active queries         | Future |
| **Cost Burn Rate Gauge**      | Speedometer-style cost meter with alerts        | Future |
| **Tenant Lifecycle Funnel**   | Signup → Active → Paying → Churn visualization  | Future |
| **Alert Configuration Panel** | Set thresholds for notifications                | Future |
| **Usage Heatmap Calendar**    | Daily activity patterns over time               | Future |
| **Model Performance Matrix**  | Accuracy vs. cost trade-off analysis            | Future |
| **Geographic Usage Map**      | Global tenant distribution                      | Future |
| **Anomaly Detection Log**     | Auto-detected unusual patterns                  | Future |
| **Churn Risk Indicator**      | ML-based tenant health scores                   | Future |

### Data Visualizations, Charts & Insights (Future)

The following advanced visualizations and analytics are planned for future releases:

#### Admin Dashboard Charts (Future)

| Visualization                  | Data                             | Chart Type             | Status |
| ------------------------------ | -------------------------------- | ---------------------- | ------ |
| **Cost Burn Trend**            | Daily cost over 30 days          | Line chart (area fill) | Future |
| **Query Volume Heatmap**       | Hourly usage patterns            | Calendar heatmap       | Future |
| **Model Distribution**         | GPT vs Gemini vs Claude usage    | Pie/donut chart        | Future |
| **Tenant Growth Funnel**       | Signup → Active → Paying → Churn | Sankey/funnel chart    | Future |
| **Response Time Distribution** | p50/p95/p99 latency              | Box plot/histogram     | Future |
| **Token Efficiency**           | Input vs output tokens           | Stacked bar chart      | Future |
| **Revenue by Plan**            | MRR breakdown                    | Stacked area chart     | Future |
| **Geographic Usage Map**       | Global tenant distribution       | Choropleth map         | Future |
| **System Health Status**       | Real-time service health         | Status grid/indicators | Future |

#### Tenant Dashboard Charts (Future)

| Visualization             | Data                           | Chart Type                  | Status |
| ------------------------- | ------------------------------ | --------------------------- | ------ |
| **Brain Growth Timeline** | Documents indexed over time    | Line chart with annotations | Future |
| **Knowledge Coverage**    | % of documents categorized     | Gauge/progress ring         | Future |
| **Top Sources Chart**     | Most referenced documents      | Horizontal bar chart        | Future |
| **User Engagement**       | Active users, queries per user | Dual-axis line chart        | Future |
| **Search Term Cloud**     | Most common query terms        | Word cloud                  | Future |
| **Context Clusters**      | Knowledge graph visualization  | D3.js force-directed        | Future |

#### Advanced Insights & Anomalies (Future)

| Insight Type                     | Detection Method               | Alert Channel          | Status |
| -------------------------------- | ------------------------------ | ---------------------- | ------ |
| **Spike Detection**              | 3σ deviation in query volume   | Email/Slack            | Future |
| **Knowledge Gap Alert**          | Frequent unanswered queries    | Weekly digest          | Future |
| **Duplicate Content**            | Similarity score > 0.95        | Cleanup suggestion     | Future |
| **Orphaned Documents**           | Not queried in 90 days         | Archive recommendation | Future |
| **Hot Topics**                   | Sudden query cluster emergence | Trending notification  | Future |
| **Cost Anomaly**                 | Unusual token consumption      | Budget alert           | Future |
| **Churn Risk Score**             | ML-based engagement analysis   | Admin dashboard        | Future |
| **Optimal Model Recommendation** | Query type + cost budget       | In-app suggestion      | Future |

---

## Integration Ecosystem (MCP)

### Model Context Protocol (MCP) Architecture

The Corporate Brain acts as an **MCP Server** that any AI agent can connect to, while also serving as an **MCP Client** connecting to external data sources.

#### Supported Integrations

| Category      | Provider        | Data Types                  | Sync Mode              | Auth Method |
| ------------- | --------------- | --------------------------- | ---------------------- | ----------- |
| **Chat**      | Slack           | Messages, Threads, Channels | Real-time + Historical | OAuth 2.0   |
| **Chat**      | Microsoft Teams | Chats, Meetings, Files      | Real-time + Historical | OAuth 2.0   |
| **Documents** | Google Drive    | Docs, Sheets, PDFs, Slides  | On-demand + Scheduled  | OAuth 2.0   |
| **Documents** | Notion          | Pages, Databases, Wikis     | Webhook + Scheduled    | OAuth 2.0   |
| **Meetings**  | Zoom            | Transcripts, Recordings     | Webhook                | OAuth 2.0   |
| **Email**     | Gmail           | Threads, Attachments        | Scheduled              | OAuth 2.0   |
| **CRM**       | Salesforce      | Accounts, Opportunities     | Scheduled              | OAuth 2.0   |
| **Code**      | GitHub          | Issues, PRs, Wiki           | Webhook                | OAuth 2.0   |

### MCP Server Capabilities

```typescript
// Corporate Brain as MCP Server
interface MCPServerCapabilities {
  // Tools exposed to external agents
  tools: {
    "brain.query": {
      description: "Query the company knowledge base";
      parameters: {
        query: string;
        context_window?: "hot" | "cold" | "hybrid";
        max_sources?: number;
      };
    };
    "brain.ingest": {
      description: "Add new content to the brain";
      parameters: {
        content: string;
        source_type: "url" | "file" | "text";
        metadata?: Record<string, any>;
      };
    };
    "brain.execute": {
      description: "Execute an action using brain context";
      parameters: {
        task: string;
        model_preference?: "fast" | "deep";
      };
    };
  };

  // Resources exposed to external agents
  resources: {
    "brain.conversations": "List of recent conversations";
    "brain.sources": "Available knowledge sources";
    "brain.stats": "Usage statistics and ROI metrics";
  };
}
```

### Sync Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SYNC ENGINE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Real-time (WebSocket/SSE)                                   │
│  ├── Slack Events API ──────┐                                │
│  ├── Teams Activity Feed ───┼──┐                             │
│  └── Zoom Webhooks ─────────┼──┼──┐                         │
│                             │  │  │                         │
│  Scheduled (Cron/Queue)       │  │  │                         │
│  ├── Drive sync ────────────┼──┼──┼──┐                      │
│  ├── Notion crawler ────────┼──┼──┼──┼──┐                  │
│  └── Email fetch ───────────┼──┼──┼──┼──┼──┐              │
│                             ▼  ▼  ▼  ▼  ▼  ▼                │
│  ┌───────────────────────────────────────────┐               │
│  │         UPSTASH TASK QUEUE                │               │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │               │
│  │  │ Worker  │ │ Worker  │ │ Worker  │     │               │
│  │  │  Pool   │ │  Pool   │ │  Pool   │     │               │
│  │  └────┬────┘ └────┬────┘ └────┬────┘     │               │
│  └───────┼──────────┼──────────┼───────────┘               │
│          │          │          │                            │
│          ▼          ▼          ▼                            │
│  ┌─────────────────────────────────────────┐                 │
│  │      INGESTION PIPELINE                │                 │
│  │  • Normalize → Chunk → Embed → Store  │                 │
│  └─────────────────────────────────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance Framework

### Zero-Training Guarantee

| Aspect             | Implementation                                   | Evidence                   |
| ------------------ | ------------------------------------------------ | -------------------------- |
| **Data Isolation** | Tenant-scoped embeddings with row-level security | PostgreSQL RLS policies    |
| **API Calls**      | Zero-retention flags on all LLM requests         | Provider API headers       |
| **Processing**     | In-memory processing, no training data logging   | Architecture documentation |
| **Audit**          | Complete audit trail of data access              | `audit_logs` table         |

### PII Detection & Masking

```typescript
// PII Shield Configuration
interface PIIShield {
  // Pre-processing (before LLM)
  detection: {
    patterns: {
      ssn: "\b\d{3}-\d{2}-\d{4}\b";
      email: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}";
      phone: "\b\d{3}[-.]?\d{3}[-.]?\d{4}\b";
      credit_card: "\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b";
    };
    nlp: "presidio" | "aws-comprehend" | "azure-pii";
  };

  masking: {
    strategy: "redact" | "hash" | "tokenize";
    preserve_structure: true; // Keep format for LLM context
    audit_hits: true; // Log to security dashboard
  };
}
```

### Compliance Standards

| Standard      | Status          | Implementation             |
| ------------- | --------------- | -------------------------- |
| SOC 2 Type II | Target: Q3 2026 | Controls in audit_logs     |
| GDPR          | Implemented     | Data export, deletion APIs |
| CCPA          | Implemented     | Privacy dashboard          |
| HIPAA         | Future          | BAA support for healthcare |
| ISO 27001     | Future          | Security management system |

### Token-Based Authentication & Verification

The Corporate Brain implements a **secure token/code verification system** for all sensitive authentication flows. No magic links—only cryptographically secure, time-limited codes.

#### Supported Token Flows

| Flow                   | Token Type           | Delivery          | Expiry     | Use Case                                   |
| ---------------------- | -------------------- | ----------------- | ---------- | ------------------------------------------ |
| **Email Verification** | 6-digit numeric code | Email             | 15 minutes | New account signup confirmation            |
| **Password Reset**     | 6-digit numeric code | Email             | 15 minutes | Forgot password recovery                   |
| **Password Change**    | 6-digit numeric code | Email             | 15 minutes | Confirm password change for logged-in user |
| **Email Change**       | 6-digit numeric code | New email address | 15 minutes | Verify ownership of new email              |
| **2FA Setup**          | TOTP QR code         | In-app display    | N/A        | Authenticator app enrollment               |
| **2FA Verify**         | 6-digit TOTP         | Authenticator app | 30 seconds | Login/Action verification                  |
| **API Key Rotation**   | Secure random string | Dashboard display | Immediate  | Developer API access                       |

#### Token Architecture

```typescript
// Database Schema for Token Storage
interface VerificationToken {
  id: string; // UUID
  identifier: string; // Email address (hashed for lookup)
  token: string; // SHA-256 hash of the actual code
  type:
    | "email_verification"
    | "password_reset"
    | "password_change"
    | "email_change";
  expires: Date; // 15 minutes from creation
  attempts: number; // Rate limiting (max 3 attempts)
  createdAt: Date;
}

// Token Generation (Cryptographically Secure)
function generateVerificationCode(): string {
  // 6-digit numeric code (000000 - 999999)
  // Uses crypto.randomInt for uniform distribution
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

// Token Verification Flow
async function verifyToken(
  identifier: string, // Email
  code: string, // User input
  type: TokenType,
): Promise<VerificationResult> {
  // 1. Hash the identifier for lookup
  const hashedIdentifier = hashEmail(identifier);

  // 2. Fetch token from database
  const tokenRecord = await db.tokens.findFirst({
    where: { identifier: hashedIdentifier, type },
    orderBy: { createdAt: "desc" },
  });

  // 3. Check existence and expiry
  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return { success: false, error: "TOKEN_EXPIRED" };
  }

  // 4. Check attempt limits
  if (tokenRecord.attempts >= 3) {
    await db.tokens.delete({ where: { id: tokenRecord.id } });
    return { success: false, error: "MAX_ATTEMPTS_EXCEEDED" };
  }

  // 5. Constant-time comparison (prevent timing attacks)
  const hashedCode = hashCode(code);
  const isValid = timingSafeEqual(
    Buffer.from(tokenRecord.token),
    Buffer.from(hashedCode),
  );

  // 6. Increment attempts regardless of success
  await db.tokens.update({
    where: { id: tokenRecord.id },
    data: { attempts: { increment: 1 } },
  });

  if (!isValid) {
    return { success: false, error: "INVALID_CODE" };
  }

  // 7. Delete token (single-use)
  await db.tokens.delete({ where: { id: tokenRecord.id } });

  return { success: true };
}
```

#### Security Measures

| Measure                   | Implementation                        | Purpose                     |
| ------------------------- | ------------------------------------- | --------------------------- |
| **Rate Limiting**         | Max 3 attempts per token              | Prevent brute-force attacks |
| **Single-Use Tokens**     | Deleted after successful verification | Prevent replay attacks      |
| **Time-Limited**          | 15-minute expiry                      | Limit attack window         |
| **Constant-Time Compare** | `crypto.timingSafeEqual()`            | Prevent timing side-channel |
| **Hashed Storage**        | SHA-256 of token                      | Protect database leak       |
| **Identifier Hashing**    | HMAC of email for lookup              | Protect user privacy        |
| **Attempt Tracking**      | Per-token attempt counter             | Progressive rate limiting   |

#### Email Templates

**Verification Email:**

```
Subject: Your Corporate Brain verification code: 847291

Hello [Name],

Your verification code is:

┌─────────────┐
│   847291    │
└─────────────┘

This code will expire in 15 minutes.
If you didn't request this, please ignore this email.

- The Corporate Brain Security Team
```

**Password Reset Email:**

```
Subject: Password reset code: 392847

Hello [Name],

We received a request to reset your password.

Your reset code is:

┌─────────────┐
│   392847    │
└─────────────┘

This code will expire in 15 minutes.
If you didn't request this, your account is safe—no action needed.

- The Corporate Brain Security Team
```

#### UI/UX Flows

**Email Verification Flow:**

```
1. User signs up with email/password
2. System sends 6-digit code to email
3. User enters code in verification screen
4. ✅ Account verified → Redirect to onboarding
5. ❌ Wrong code → Show attempts remaining (2 more tries)
6. ❌ Max attempts → "Resend code" button (rate limited to 1 per minute)
```

**Password Change Flow (Authenticated):**

```
1. User navigates to Settings → Security
2. Enters current password + new password
3. System sends 6-digit confirmation code to email
4. User enters code to confirm change
5. ✅ Password updated, all sessions invalidated except current
6. User stays logged in (no re-authentication needed)
```

**Password Reset Flow:**

```
1. User clicks "Forgot password" on login
2. Enters email address
3. System sends 6-digit code (if email exists)
4. User enters code + new password
5. ✅ Password reset, all sessions invalidated
6. Redirect to login with success message
```

#### Token Database Schema (Drizzle ORM)

```typescript
// db/schema.ts
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: varchar("identifier", { length: 255 }).notNull(), // Hashed email
    token: varchar("token", { length: 64 }).notNull(), // SHA-256 hash
    type: varchar("type", { length: 50 }).notNull(), // Token type enum
    expires: timestamp("expires", { withTimezone: true }).notNull(),
    attempts: integer("attempts").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Index for fast lookup by hashed identifier
    identifierIdx: index("token_identifier_idx").on(table.identifier),
    // Automatically delete expired tokens
    // Handled by application logic or PostgreSQL cron job
  }),
);

// Enum for token types
export const TokenType = {
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
  PASSWORD_CHANGE: "password_change",
  EMAIL_CHANGE: "email_change",
} as const;
```

### Future Features & Enhancements (Future)

The following features are planned for future releases beyond the initial launch:

#### Real-time & Communication (Future)

| Feature                    | Description                                                         | Priority |
| -------------------------- | ------------------------------------------------------------------- | -------- |
| **Activity Feed**          | Real-time stream of team actions: new documents, mentions, comments | High     |
| **Notification System**    | In-app bell + email digests for mentions, updates, alerts           | High     |
| **WebSocket Architecture** | Real-time chat sync, presence indicators, live collaboration        | Medium   |
| **Webhook Management**     | Incoming webhooks for integrations + outgoing webhooks for events   | High     |
| **Comments & Annotations** | Threaded discussions on documents with @mentions                    | Medium   |

#### Enterprise Features (Future)

| Feature                          | Description                                                     | Priority |
| -------------------------------- | --------------------------------------------------------------- | -------- |
| **SSO/SAML**                     | Enterprise authentication with IdP integration (Okta, Azure AD) | High     |
| **SCIM User Provisioning**       | Automated user management via SCIM 2.0 protocol                 | Medium   |
| **Custom Roles & Permissions**   | Granular RBAC beyond admin/member (viewer, editor, manager)     | Medium   |
| **Audit Log Retention Policies** | Auto-archive old logs, configurable retention periods           | Medium   |
| **Data Retention Policies**      | Auto-delete documents after X days per compliance rules         | Medium   |
| **White-Label Options**          | Custom branding: logo, colors, domain                           | Low      |
| **API Keys & Developer Portal**  | External API access with rate-limited keys                      | Medium   |

#### Advanced Search & Discovery (Future)

| Feature                      | Description                                              | Priority |
| ---------------------------- | -------------------------------------------------------- | -------- |
| **Full-Text Search**         | PostgreSQL tsvector-based fuzzy text search with filters | Medium   |
| **Semantic Search Boosting** | Combine vector + keyword scores for better relevance     | Medium   |
| **Saved Searches**           | Bookmark frequent queries with alerts for new matches    | Low      |
| **Search Suggestions**       | AI-powered query autocomplete based on indexed content   | Medium   |

#### Document Management (Future)

| Feature                    | Description                                             | Priority |
| -------------------------- | ------------------------------------------------------- | -------- |
| **Document Versioning**    | Track changes, restore previous versions, diff viewer   | Medium   |
| **Document Relationships** | Link related docs: "See also", parent/child hierarchies | Medium   |
| **Bulk Operations**        | Multi-select documents for batch delete, tag, export    | Medium   |
| **Export Functionality**   | Download as PDF, Markdown, CSV with custom formatting   | Medium   |
| **Duplicate Detection**    | Identify similar documents with similarity scoring      | Low      |

#### Workflow Automation (Future)

| Feature                    | Description                                                 | Priority |
| -------------------------- | ----------------------------------------------------------- | -------- |
| **Scheduled Tasks / Cron** | Automated reports, periodic syncs, maintenance jobs         | Medium   |
| **Workflow Builder**       | IFTTT-style triggers: "If new Slack message → Add to brain" | Medium   |
| **Smart Alerts**           | Notify when knowledge gaps detected, costs spike, etc.      | Medium   |
| **Auto-Tagging**           | AI-powered document categorization and tagging              | Low      |

#### Billing & Monetization (Future)

| Feature                     | Description                                            | Priority |
| --------------------------- | ------------------------------------------------------ | -------- |
| **Stripe Integration**      | Subscription management, usage-based billing, invoices | High     |
| **Usage Quotas**            | Per-tenant limits with grace periods and overages      | Medium   |
| **Reseller/Partner Portal** | Multi-tier billing for agencies and integrators        | Low      |

---

## Implementation Phases

> **Project Status**: Phases 1-5 ✅ COMPLETED (2026-04-11)  
> **Testing Infrastructure**: ✅ COMPLETE (31 unit tests passing)  
> **Current Focus**: Production deployment preparation

### Phase 1: Foundation ✅ COMPLETED (2026-04-06)

**Goal**: Core infrastructure and basic ingestion

| Week | Deliverable         | Key Tasks                                                                   | Status      |
| ---- | ------------------- | --------------------------------------------------------------------------- | ----------- |
| 1    | Project scaffolding | Next.js setup, TypeScript config, Tailwind theme, Drizzle ORM               | ✅ Complete |
| 2    | Database & Auth     | PostgreSQL + pgvector schema, Auth.js integration, multi-tenancy middleware | ✅ Complete |
| 3    | Basic ingestion     | File upload API, Unstructured.io integration, vector storage                | ✅ Complete |
| 4    | URL crawling        | Firecrawl integration, crawl progress UI, basic indexing                    | ✅ Complete |

**Delivered**: Magic link auth, file upload API, document processing pipeline, web crawler

### Phase 2: AI Core ✅ COMPLETED (2026-04-10)

**Goal**: Multi-model orchestration and chat interface

| Week | Deliverable    | Key Tasks                                                    | Status      |
| ---- | -------------- | ------------------------------------------------------------ | ----------- |
| 5    | Model router   | Vercel AI SDK setup, routing logic, cost tracking            | ✅ Complete |
| 6    | Chat interface | Context-aware chatbot, message storage, conversation history | ✅ Complete |
| 7    | Hybrid RAG     | pgvector search, long-context integration, citation system   | ✅ Complete |
| 8    | UI polish      | Premium styling, dark mode, responsive design                | ✅ Complete |

**Delivered**: AI Model Router, cost tracking system, chat API with Hybrid RAG, Chat UI with citations

### Phase 3: Integrations ✅ COMPLETED (2026-04-10)

**Goal**: MCP connectivity and data sync

| Week | Deliverable     | Key Tasks                                               | Status      |
| ---- | --------------- | ------------------------------------------------------- | ----------- |
| 9    | OAuth framework | Connection manager, token encryption, status monitoring | ✅ Complete |
| 10   | Slack + Drive   | Real-time sync, message ingestion, file processing      | ✅ Complete |
| 11   | Notion + Teams  | Database sync, page indexing, meeting transcripts       | ✅ Complete |
| 12   | Zoom + Email    | Transcript processing, email thread analysis            | ✅ Complete |

**Delivered**: OAuth framework, MCP connectors for Slack, Drive, Notion, Teams

### Phase 4: Scale & Admin ✅ COMPLETED (2026-04-10)

**Goal**: Admin dashboards and production readiness

| Week | Deliverable       | Key Tasks                                                         | Status      |
| ---- | ----------------- | ----------------------------------------------------------------- | ----------- |
| 13   | Admin dashboard   | Tenant overview, cost command center, security logs               | ✅ Complete |
| 14   | ROI features      | Usage analytics, time saved calculations, knowledge gap detection | ✅ Complete |
| 15   | Context Map       | D3.js visualization, knowledge graph, interactive clusters        | ✅ Complete |
| 16   | Production polish | Performance optimization, error handling, monitoring              | ✅ Complete |

**Delivered**: Admin dashboards, ROI analytics, Cost Command Center, tenant management

### Phase 5: Launch ✅ COMPLETED (2026-04-11)

**Goal**: Public launch and viral features

| Week | Deliverable     | Key Tasks                                                     | Status      |
| ---- | --------------- | ------------------------------------------------------------- | ----------- |
| 17   | Public site     | Landing page, viral trigger UI, pricing page                  | ✅ Complete |
| 18   | Onboarding flow | 4-stage ingestion hub, progress tracking, brain visualization | ✅ Complete |
| 19   | Testing & QA    | E2E tests, load testing, security audit                       | ✅ Complete |
| 20   | Launch          | Production deployment, monitoring, support docs               | 🔄 Pending  |

**Delivered**: Marketing site with neural network hero, pricing page, 4-stage onboarding flow, comprehensive testing infrastructure (Vitest + Playwright, 31 unit tests)

### Phase 6: Scale & Enterprise (Planned) (Weeks 21-24)

**Goal**: Enterprise features and advanced analytics  
**Status**: 🔄 Not Started - Planned for post-launch

| Week | Deliverable        | Key Tasks                                               |
| ---- | ------------------ | ------------------------------------------------------- |
| 21   | Real-time features | Activity feeds, notifications, WebSocket architecture   |
| 22   | Webhook system     | Outgoing webhooks, API key management, developer portal |
| 23   | Enterprise auth    | SSO/SAML integration, SCIM provisioning, custom roles   |
| 24   | Advanced analytics | Anomaly detection, predictive insights, churn risk      |

### Phase 7: Optimization & Ecosystem (Planned) (Weeks 25-28)

**Goal**: Performance optimization and ecosystem expansion  
**Status**: 🔄 Not Started - Planned for post-launch

| Week | Deliverable         | Key Tasks                                           |
| ---- | ------------------- | --------------------------------------------------- |
| 25   | Search enhancement  | Full-text search, semantic boosting, saved searches |
| 26   | Document management | Versioning, relationships, bulk operations, exports |
| 27   | Workflow automation | Scheduled tasks, workflow builder, smart alerts     |
| 28   | Performance polish  | Edge caching, query optimization, load testing      |

---

## Deliverables

### Code Deliverables

| Item                 | Location             | Description                          |
| -------------------- | -------------------- | ------------------------------------ |
| **Application Code** | `/app`               | Next.js App Router application       |
| **Database Schema**  | `/db/schema.ts`      | Drizzle ORM schema definitions       |
| **Migrations**       | `/db/migrations/`    | Version-controlled migrations        |
| **Components**       | `/components/`       | React components organized by domain |
| **API Routes**       | `/app/api/`          | REST and tRPC endpoints              |
| **AI Logic**         | `/lib/ai/`           | Model router, prompt engineering     |
| **Integrations**     | `/lib/integrations/` | MCP clients for external services    |
| **Utils**            | `/lib/utils/`        | Helper functions, hooks              |
| **Types**            | `/types/`            | Shared TypeScript definitions        |
| **Tests**            | `/tests/`            | Unit, integration, E2E tests         |

### Documentation Deliverables

| Item                    | Format          | Purpose                              |
| ----------------------- | --------------- | ------------------------------------ |
| **README**              | Markdown        | Project setup, architecture overview |
| **API Documentation**   | OpenAPI/Swagger | API reference for integrations       |
| **MCP Spec**            | Markdown        | Model Context Protocol specification |
| **Deployment Guide**    | Markdown        | Vercel + VPS deployment instructions |
| **Security Whitepaper** | PDF             | Compliance and security details      |
| **User Manual**         | Web/MD          | End-user and admin documentation     |

### Infrastructure Deliverables

| Item               | Specification                            |
| ------------------ | ---------------------------------------- |
| **Vercel Config**  | `vercel.json` with edge functions        |
| **Docker Compose** | `docker-compose.yml` for local dev       |
| **Terraform**      | `infra/` folder for AWS/GCP provisioning |
| **GitHub Actions** | `.github/workflows/` CI/CD pipelines     |

---

## Success Metrics & KPIs

### Product Metrics

| Metric                  | Target            | Measurement                           |
| ----------------------- | ----------------- | ------------------------------------- |
| **Time to First Value** | < 5 minutes       | From signup to first indexed document |
| **Query Latency (p95)** | < 2 seconds       | End-to-end response time              |
| **Answer Accuracy**     | > 90%             | User feedback + citation relevance    |
| **Daily Active Users**  | 70% of seats      | Engagement per tenant                 |
| **Documents Indexed**   | > 1000 per tenant | Successful ingestion rate             |

### Business Metrics

| Metric                     | Target  | Measurement                  |
| -------------------------- | ------- | ---------------------------- |
| **Viral Coefficient**      | > 0.7   | Invites per new user         |
| **Net Revenue Retention**  | > 120%  | Expansion - Churn            |
| **Gross Margin**           | > 75%   | (Revenue - COGS) / Revenue   |
| **Cost per Query**         | < $0.05 | Token costs + infrastructure |
| **Enterprise Conversions** | > 20%   | Free → Paid → Enterprise     |

### Technical Metrics

| Metric                    | Target          | Measurement                |
| ------------------------- | --------------- | -------------------------- |
| **Uptime**                | 99.9%           | Vercel + VPS monitoring    |
| **API Response (p99)**    | < 500ms         | Edge function performance  |
| **Vector Search Latency** | < 100ms         | pgvector query time        |
| **Ingestion Throughput**  | > 100 docs/hour | Background worker capacity |
| **Error Rate**            | < 0.1%          | Sentry tracking            |

---

## Risk Assessment & Mitigation

| Risk                      | Likelihood | Impact   | Mitigation                                             |
| ------------------------- | ---------- | -------- | ------------------------------------------------------ |
| **LLM API Costs**         | High       | High     | Model router, caching, rate limiting                   |
| **Data Privacy Concerns** | Medium     | Critical | Zero-training guarantee, SOC 2 audit                   |
| **Integration Failures**  | Medium     | Medium   | Retry logic, circuit breakers, fallbacks               |
| **Scaling Challenges**    | Medium     | High     | Horizontal scaling, read replicas, edge caching        |
| **Competitor Response**   | High       | Medium   | Network effects, data gravity, rapid feature iteration |
| **Technical Debt**        | Medium     | Medium   | Strict TypeScript, comprehensive tests, code reviews   |

---

## Pending Production Requirements

> **📄 Full Details:** See `docs/PENDING_REQUIREMENTS.md` for comprehensive specification

### Overview

Following the completion of Phases 1-5 (Core Product), the following production readiness requirements must be implemented before public launch. These items represent the "last mile" of a production SaaS product.

### Summary by Category

| Category                     | Items                | Effort  | Priority |
| ---------------------------- | -------------------- | ------- | -------- |
| **Marketing UI Consistency** | 5 pages overhaul     | 1 week  | P0       |
| **New Use Case Page**        | 1 new page           | 2 days  | P1       |
| **Contact Page Premium**     | Dropdown redesign    | 1 day   | P1       |
| **Admin CMS**                | Content management   | 2 weeks | P0       |
| **Legal Pages**              | 3 pages + admin      | 1 week  | P0       |
| **Footer Enhancement**       | Social links         | 2 days  | P1       |
| **Stripe Billing**           | Full integration     | 2 weeks | P0       |
| **Dynamic Pricing**          | Admin-managed plans  | 1 week  | P1       |
| **Settings & SEO**           | Branding, webmasters | 1 week  | P1       |
| **API Status Dashboard**     | Health monitoring    | 2 days  | P2       |
| **Logout Options**           | /app + /admin        | 1 day   | P0       |

### Critical Path for Launch

**Week 1-2: Marketing Consistency & CMS**

- UI overhaul all marketing pages to match homepage theme
- Extract shared Header/Footer components
- Create admin CMS interface for content management
- Implement legal pages with admin editing

**Week 3-4: Billing Integration**

- Stripe account setup and configuration
- Subscription management UI
- Checkout flow with trial support
- Customer portal integration
- Webhook handling for events

**Week 5-6: Dynamic Features**

- Pricing plan CRUD in admin
- Monthly/Yearly toggle with discount display
- Social links management in footer
- General/Branding/SEO settings

**Week 7-8: Polish & Launch Prep**

- API integration status dashboard
- End-to-end testing
- Legal content final review
- Production deployment

### Database Additions Required

```typescript
// CMS Tables
(cms_pages, cms_sections, cms_media);

// Billing Tables
(subscriptions, invoices, pricing_plans);

// Settings Tables
(site_settings, settings);

// Additional Indexes
// (See PENDING_REQUIREMENTS.md Section 4.3 for full schema)
```

### Dependencies

**Required Accounts:**

- Stripe account (test + live keys)
- Google Analytics (optional)
- Google Search Console
- Social media accounts for footer links

**Legal Review:**

- Terms & Conditions (legal counsel)
- Privacy Policy (GDPR compliance)
- Refund Policy (alignment with Stripe)

**Technical:**

- SSL certificate
- Production PostgreSQL
- Redis instance
- Domain DNS configured

---

## Appendix

### A. Environment Variables Template

```bash
# .env.local (Development)

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/corporate_brain"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI Providers
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""

# Vector & Cache
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# External Services
UNSTRUCTURED_API_KEY=""
FIRECRAWL_API_KEY=""

# Integration OAuth (per provider)
SLACK_CLIENT_ID=""
SLACK_CLIENT_SECRET=""
NOTION_CLIENT_ID=""
NOTION_CLIENT_SECRET=""
```

### B. File Naming Conventions

```
/components/
  /ui/           # shadcn/ui base components
  /app/          # Application-specific components
  /marketing/    # Public site components
  /dashboard/    # Admin dashboard components

/app/
  /(marketing)/  # Public routes (group)
    /page.tsx
    /layout.tsx
    /pricing/
      /page.tsx
  /(app)/        # Protected app routes
    /app/
      /page.tsx
      /layout.tsx
      /chat/
        /page.tsx
    /dashboard/
      /page.tsx
    /settings/
      /page.tsx
  /api/          # API routes
    /auth/
      /[...nextauth]/
        /route.ts
    /ingest/
      /route.ts
    /query/
      /route.ts

/lib/
  /ai/           # AI orchestration
    /router.ts
    /models.ts
    /prompts.ts
  /db/           # Database
    /schema.ts
    /queries.ts
    /migrations/
  /integrations/ # MCP clients
    /slack.ts
    /notion.ts
    /google-drive.ts
    /mcp-server.ts
  /utils/        # Helpers
    /pii.ts
    /embeddings.ts
    /crypto.ts
  /search/       # Vector search
    /vector.ts
    /hybrid.ts
  /ingestion/    # Document processing
    /chunker.ts
    /parser.ts

/hooks/          # Custom React hooks
  /use-tenant.ts
  /use-conversation.ts

/types/          # Shared TypeScript definitions
  /index.ts
  /api.ts
  /models.ts

/tests/          # Test suites
  /unit/
  /integration/
  /e2e/

/public/         # Static assets
  /images/
  /fonts/
```

### C. API Response Format

```typescript
// Standard API response structure
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
```

---

**Document Control**

| Version | Date       | Author       | Changes              |
| ------- | ---------- | ------------ | -------------------- |
| 1.0     | April 2026 | Project Team | Initial SOW document |

---

_This Scope of Work document serves as the comprehensive blueprint for the Corporate Brain project. All development activities, technical decisions, and design implementations should reference and align with the specifications outlined herein._
