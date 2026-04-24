# UI/UX Audit — Does It Look Like a Billion-Dollar Silicon Valley SaaS?

> **Document Type:** Full UI/UX Audit + Design System Specification  
> **Prepared:** April 2026  
> **Method:** Line-by-line code audit of every page, component, and layout  
> **Verdict first:** The marketing site is 7/10. The app is 3/10. Together they do not look like a billion-dollar product — yet.

---

## Table of Contents

1. [The Verdict — Honest Score](#1-the-verdict--honest-score)
2. [The Core Problem: Two Products, Two Identities](#2-the-core-problem-two-products-two-identities)
3. [Marketing Site Audit](#3-marketing-site-audit)
4. [App (Post-Login) Audit](#4-app-post-login-audit)
5. [Design System Gaps](#5-design-system-gaps)
6. [What $1B SaaS UI Actually Looks Like](#6-what-1b-saas-ui-actually-looks-like)
7. [The Fix: Priority-Ordered Redesign Spec](#7-the-fix-priority-ordered-redesign-spec)
8. [Component-Level Specifications](#8-component-level-specifications)

---

## 1. The Verdict — Honest Score

| Surface | Score | Why |
|---|---|---|
| **Marketing homepage** | 7/10 | Dark theme, good animations, violet gradient — feels premium. Several trust-killers undermine it. |
| **Features page** | 6/10 | Clean but generic. FeatureBlocks are just big icons. No product screenshots. |
| **Pricing page** | 7/10 | Honest table, clean design. Missing annual toggle, no social proof per tier. |
| **App sidebar** | 3/10 | Gray `bg-gray-50`, `bg-white`, `border-gray-200` — looks like a 2018 admin panel |
| **Chat interface** | 3/10 | Gray `bg-gray-50`, blue send button, emoji source icons — looks like a hackathon demo |
| **Chat message bubbles** | 3/10 | `bg-blue-600` user bubble, white/gray AI bubble — generic ChatGPT clone aesthetic |
| **Empty state** | 2/10 | "Welcome to Corporate Brain / Ask anything about your company knowledge" — plain text, no visual |
| **Loading state** | 2/10 | Three gray bouncing dots — every chatbot in 2019 had this |
| **Admin dashboard** | 4/10 | Functional data but `bg-gray-50` / `bg-gray-900` — no brand identity |

**Overall:** The marketing site is trying to be Linear or Vercel. The app looks like it was built with a different team who never saw the marketing site. The first impression after signup is a trust-collapsing downgrade.

---

## 2. The Core Problem: Two Products, Two Identities

This is the single most damaging UI issue. Documented with exact code evidence:

### Marketing site color system
```
bg-[#0a0a0f]           — almost black
bg-[#0f0f16]           — slightly lighter near-black  
bg-[#0d0d14]           — problem section dark
from-violet-600 to-fuchsia-600   — gradient accents
text-white/50          — subdued secondary text
border-white/10        — subtle borders
```

### App (post-login) color system
```
bg-gray-50             — light gray (knowledge-sidebar.tsx:95)
bg-white               — pure white (knowledge-sidebar.tsx:97)
border-gray-200        — medium gray border (knowledge-sidebar.tsx:95)
bg-gray-50 dark:bg-gray-900    — chat-interface.tsx:99
bg-white dark:bg-gray-800      — chat-interface.tsx:101
bg-blue-600            — send button (chat-interface.tsx:221)
bg-blue-50 dark:bg-blue-900/20 — active item (chat-interface.tsx:111)
```

The marketing site is a dark, atmospheric, violet-branded product. The app is a light-gray, blue-accented CRUD interface. A user who signs up expecting the former gets the latter. This is the #1 conversion-to-retention killer.

**Reference brands that did this right:** Linear's app is as beautiful as their marketing site. Vercel's dashboard IS the product. Notion's app IS the brand.

---

## 3. Marketing Site Audit

### 3.1 What's Working

**Hero section** — Strong. Dark background, violet glow orbs, gradient headline, floating notification cards. The browser mockup on the right shows an actual product conversation with data. This looks like a real product.

**Problem statement section** — The 3-node flow diagram (Data Silos → Knowledge Gaps → AI Hallucinations) with animated particle lines is the best visual on the site. It communicates the problem without text. Keep and improve.

**Product showcase section** — Vibrant violet-to-fuchsia-to-orange gradient background with the full chat mockup. Shows cited answer, source breakdown ($180K / $150K / $120K), connected sources chips. Excellent. This is what Vercel-tier design looks like.

**CTA sections** — Full-bleed violet gradient, white CTA button. Clean.

**Footer** — Consistent dark theme, proper 4-column layout. Professional.

---

### 3.2 What's Breaking the Illusion

#### Issue 1: The Logo is a Lucide `Sparkles` Icon
```
// app/(marketing)/page.tsx:30-31
<div className="flex h-10 w-10 items-center justify-center rounded-xl 
  bg-gradient-to-br from-violet-600 to-fuchsia-600">
  <Sparkles className="h-5 w-5 text-white" />
</div>
```
`Sparkles` is the most overused AI icon in history. Every GPT wrapper, every AI writing tool, every AI startup from 2023 uses it. It signals "I used a template." Linear has a custom mark. Vercel has a custom mark. Notion has a custom mark. This needs a custom SVG brain/cortex logo.

#### Issue 2: Fake Social Proof — The Most Dangerous Trust-Killer
```
// app/(marketing)/page.tsx:554-568
{["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Airbnb"].map((company) => (
  <span className="text-lg font-semibold text-black/40">
    {company}
  </span>
))}
```
These are rendered as plain text names — no logos, no "customer" qualifier — but the section header reads *"Trusted by forward-thinking teams at"*. This is an implied false claim. Any journalist, investor, or enterprise buyer who checks will know these are not customers. This damages credibility more than having no social proof at all.

```
// app/(marketing)/page.tsx:153-157
<p className="text-sm text-white/40">
  Trusted by 10,000+ teams
</p>
```
Also unverifiable. These are placeholder numbers. Real SaaS companies earn the right to display this. Showing it before you have it trains users to distrust every other claim on the page.

**Fix:** Remove both. Replace with: "Be among the first 100 teams to build their company brain." Scarcity + exclusivity is stronger than fake scale.

#### Issue 3: The Features Section Breaks the Dark Theme
```
// app/(marketing)/page.tsx:734-786
<section className="py-24 lg:py-32 bg-gradient-to-r from-neutral-50 to-cyan-50">
```
The entire homepage is `#0a0a0f` dark — except this one section which is `neutral-50` to `cyan-50` (light beige to light cyan). The feature cards are white with gray text. It's a jarring theme break that feels like a separate page was copy-pasted in. This section needs to match the dark design language.

#### Issue 4: "Now with enterprise SSO" Announcement Badge
```
// app/(marketing)/page.tsx:96-99
<span className="text-sm font-medium text-violet-300">
  Now with enterprise SSO
</span>
```
Enterprise SSO is not built. This is a false product announcement in the most prominent position on the hero. It must be removed immediately — it will be the first thing an enterprise buyer tests after signup, and they will not find it.

#### Issue 5: Stats Are All Fake
```
// app/(marketing)/page.tsx:925-946
<StatCard value="10x"   label="Faster Answers"    description="vs traditional search" />
<StatCard value="50+"   label="Integrations"       description="Native connections" />
<StatCard value="99.9%" label="Uptime"             description="Enterprise SLA" />
<StatCard value="2M+"   label="Queries"            description="Served monthly" />
```
4 connectors (not 50+). No SLA. No evidence of 2M queries or 10x benchmark. On the features page: "10M+ Documents Processed" and "10,000+ Active Teams" — also unverifiable placeholders.

**Fix:** Either earn these stats or replace them with honest early-stage metrics ("Built for teams of 5 to 5,000" or the actual engineering benchmarks you can prove: "Sub-4 second response time · pgvector similarity search · 6 AI models").

---

### 3.3 What's Missing (That $1B Sites Have)

| Missing Element | Why It Matters | Reference |
|---|---|---|
| **Customer logos (real)** | Social proof is the highest-converting element on a B2B homepage | Notion, Linear, Vercel |
| **Product screenshot / video** | Buyers need to see the real UI before trial — currently all mockups | Loom, ClickUp, Figma |
| **Founder/team section** | B2B buyers buy from people. "Corporate Brain Team" is not a person. | Superhuman, Retool |
| **Changelog / "What's new"** | Shows momentum — buyers want to see a living product | Linear, Vercel |
| **Customer testimonials** | Specific quotes with name + title + company are 10x more trusted than stats | Guru, Glean |
| **"How it works" visual** | Step 1 → Step 2 → Step 3 with actual UI screenshots, not icons | Intercom, Amplitude |
| **Blog / content** | SEO and thought leadership. Zero blog content = zero organic traffic | Every funded SaaS |
| **Security page** | Enterprise buyers look for /security before /pricing | Vercel, Stripe |

---

## 4. App (Post-Login) Audit

This is the critical section. **The marketing site gets people to sign up. The app is what makes them stay or leave.**

### 4.1 The Sidebar (`components/app/knowledge-sidebar.tsx`)

**What it looks like today:**
```
bg-gray-50              // sidebar background
bg-white                // header and footer sections
border-gray-200         // all borders
text-gray-900           // primary text
text-gray-600           // secondary text
bg-violet-100 text-violet-700  // active nav item
```

**The result:** A standard light-gray sidebar that looks identical to every Tailwind UI admin template. Slack, Linear, Notion all have dark sidebars. Every developer tool that feels premium has a dark sidebar. The sidebar is the first thing users see after login — it establishes the tone of the entire app.

**Specific problems:**
- Logo area shows `CB` text in a gradient box — not the actual Sparkles logo used in marketing, so they don't even match each other
- User avatar is `bg-violet-100` with an initial — no image support, no name truncation style
- Two tab buttons ("Sources" / "Chat History") are redundant UI — these should be sections in one unified sidebar, not tabs
- "Add your first source" empty state is a gray box with a `Database` icon — not inviting
- The "New Chat" button is at the bottom in a white footer box — lowest hierarchy position for the highest-frequency action
- "Admin" section sits in a `bg-gray-100` box — looks like a filing cabinet, not a premium tool
- Emoji icons (`📄`, `🌐`, `💬`) used as source type indicators in `chat-message.tsx` — this is 2015 UI

---

### 4.2 The Chat Interface (`components/chat/chat-interface.tsx`)

**What it looks like today:**
- Background: `bg-gray-50 dark:bg-gray-900` — neither dark nor light, just gray
- Left sub-sidebar: `bg-white dark:bg-gray-800` with `border-gray-200` — another panel
- Header: `bg-white dark:bg-gray-800 border-b border-gray-200` — white bar with plain "Corporate Brain" text
- Input: `border border-gray-300 bg-white` with `focus:ring-2 focus:ring-blue-500` — generic form input
- Send button: `bg-blue-600 hover:bg-blue-700` — completely off-brand (everything else is violet)
- Loading state: Three `bg-gray-400` bouncing dots

**Specific critical problems:**

**The header says "Corporate Brain" in plain `text-xl font-bold`** — no logo, no icon, no brand identity. This is text inside a white bar.

**The left sub-sidebar inside the chat is a different sidebar from the main sidebar** — so the user sees: main sidebar (gray-50) → inner chat sidebar (white) → chat area (gray-50). Three layered panels with three different background colors. Visually noisy and spatially confusing.

**The input box uses `border-gray-300 focus:ring-blue-500`** — there is no violet anywhere in the chat's functional area. The one brand color (blue) is wrong. The send button should be the violet gradient from the marketing site.

**Empty state:**
```
// chat-interface.tsx:167-172
<div className="flex flex-col items-center justify-center h-full text-gray-500">
  <p className="text-lg mb-2">Welcome to Corporate Brain</p>
  <p className="text-sm">Ask anything about your company knowledge</p>
</div>
```
Plain text on a gray background. No logo. No suggested questions. No visual. Superhuman shows keyboard shortcuts. Notion shows recent pages. Linear shows recent issues. This shows a paragraph.

---

### 4.3 Chat Messages (`components/chat/chat-message.tsx`)

**User message:** `bg-blue-600 text-white` rounded bubble — a WhatsApp bubble. Not on-brand (should be violet gradient, not blue), not differentiated from 1,000 other AI chat tools.

**AI message:** `bg-white dark:bg-gray-800 border border-gray-200` — a white box. No AI identity, no brand color, no personality.

**Citations:** Inline `bg-gray-100` chips with emoji icons — functional but cheap-looking. Glean renders citations as rich cards with source title, type icon, and excerpt. Perplexity renders citations as numbered footnotes. Both feel like products. Gray emoji chips feel like a rough draft.

**Model badge:** Just `text-xs text-gray-500 "Model: gpt-4o-mini"` — raw model name exposed in plain text. Should be designed as a pill: `[⚡ Fast · GPT-4o mini · 0.6s · $0.0002]`

---

### 4.4 The Add Source Menu (`components/app/app-client-wrapper.tsx`)

```
// app-client-wrapper.tsx:114
className="absolute top-20 left-4 w-56 bg-white dark:bg-gray-800 
  rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2"
```

This dropdown appears from the "+" button in the sidebar. It's a white modal with standard gray borders. The Upload option has a `bg-blue-100` icon, the URL option has a `bg-violet-100` icon — again, mixed blue and violet, no coherent color system.

---

### 4.5 The Context Map (`components/chat/context-map.tsx`)

As documented in `FEATURES_AUDIT.md`, this is 20 random animated nodes with no real data. But the visual is also mediocre — a plain `bg-gray-50 dark:bg-gray-900` canvas with gray lines and randomly colored circles. No labels visible at scale. No interaction. No brand identity.

---

## 5. Design System Gaps

### 5.1 Color System — The Root Problem

There is no unified design token system. Colors are hardcoded strings in each file, causing the inconsistency:

| Color Used | Where | Should Be |
|---|---|---|
| `bg-blue-600` | Chat send button | `bg-violet-600` |
| `focus:ring-blue-500` | All form inputs | `focus:ring-violet-500` |
| `bg-blue-50` | Active sidebar item | `bg-violet-50` |
| `bg-gray-50` | App sidebar, chat bg | `bg-[#0a0a0f]` or `bg-[#0d0d14]` |
| `bg-white` | All app panels | `bg-[#0f0f16]` |
| `border-gray-200` | All app borders | `border-white/10` |
| `text-gray-900` | All app text | `text-white` |
| `text-gray-500` | All secondary text | `text-white/50` |

**A design token file is needed** — a single `tailwind.config.ts` extension that maps these to named tokens:

```typescript
// tailwind.config.ts
colors: {
  surface: {
    base: '#0a0a0f',
    raised: '#0f0f16',
    overlay: '#141420',
    border: 'rgba(255,255,255,0.08)',
  },
  brand: {
    primary: '#7c3aed',   // violet-600
    secondary: '#a855f7', // violet-500  
    accent: '#d946ef',    // fuchsia-500
  },
  text: {
    primary: 'rgba(255,255,255,0.95)',
    secondary: 'rgba(255,255,255,0.50)',
    muted: 'rgba(255,255,255,0.25)',
  }
}
```

### 5.2 Typography

No custom font configuration found. The app uses default browser fonts. The marketing site appears to use Inter (system default on most machines) but it's not explicitly declared.

**Reference:** Linear uses Inter. Vercel uses Geist (their own font). Notion uses their custom stack. All premium SaaS products have a deliberate, named typeface.

**Recommendation:** Geist by Vercel is free, modern, and purpose-built for product interfaces. Already excellent for dark UIs. Add via `next/font/google` or the Geist package.

```typescript
// app/layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

### 5.3 Spacing & Density

Marketing site uses comfortable 24px–48px padding. App uses inconsistent `p-2`, `p-4`, `px-3 py-2` mix. No systematic spacing scale applied.

### 5.4 Border Radius

Marketing site: `rounded-2xl` (16px), `rounded-xl` (12px), `rounded-full` for pills.
App: `rounded-lg` (8px), `rounded` (4px). Feels smaller and cheaper.

### 5.5 Icon System

Marketing site: Lucide icons at 20–24px with colored backgrounds.
App sidebar nav: Lucide icons at 16px without colored backgrounds — bare gray icons.
Chat messages: Emoji string icons (`📄`, `🌐`, `💬`).

Three different icon systems in one product. The emoji strings in `chat-message.tsx:89-97` must be replaced with Lucide icons or custom SVGs.

---

## 6. What $1B SaaS UI Actually Looks Like

Studying Linear ($4B), Vercel ($3.25B), Notion ($10B), Superhuman ($825M at last raise), Loom (acquired for $975M):

### The 7 Consistent Patterns

**1. Dark-first, always**
Every tool at this valuation tier chose dark as primary. Light mode is a setting, not the default. Dark conveys precision, focus, and premium.

**2. One accent color, used sparingly**
Linear: blue. Vercel: white/black. Notion: none (relies on pure type). Superhuman: orange accents only on key CTAs. When everything is colored, nothing is important. Corporate Brain's violet should appear on: active items, CTAs, hover states, loading indicators. Not on backgrounds, not mixed with blue.

**3. The sidebar is a command center, not a file tree**
Linear's sidebar shows projects, teams, cycles, views — with counts, status indicators, and active state. Notion's sidebar shows pages with indent, icons, and quick actions. Both feel like navigating a living system. Corporate Brain's sidebar shows a flat list of filenames with two tabs. It feels like Finder.

**4. Empty states are invitations, not apologies**
Linear's empty board: "You have no issues. Create your first issue to get started." + keyboard shortcut. Notion's empty page: cursor immediately in an editable title. Figma's empty file: drag to start designing. Corporate Brain: "Welcome to Corporate Brain / Ask anything about your company knowledge." — text in a gray void.

**5. Every input feels intentional**
Vercel's search: full-width, monospaced, instant results. Linear's command palette: full search with categories. Figma's toolbar: contextual, changes with selection. Corporate Brain's chat input: `<input type="text" className="border border-gray-300 bg-white focus:ring-blue-500">` — a form field from a contact page.

**6. Data is visual, not tabular**
Amplitude and Mixpanel don't show raw numbers — they show sparklines, trend indicators, color-coded changes. Corporate Brain's admin dashboard returns JSON numbers rendered in a minimal table. The ROI metrics (hours saved, cost saved) deserve a visual dashboard.

**7. Transitions signal that the product is alive**
Every Linear state change has a 150–300ms ease-out transition. Every Notion page loads with a subtle fade. Every Vercel deployment shows animated progress. Corporate Brain's transitions: instant jumps between states.

---

## 7. The Fix: Priority-Ordered Redesign Spec

### Priority 1: Emergency Fixes (Remove Actively Harmful Elements)

These must be fixed before any new user sees the product:

| Fix | File | Change |
|---|---|---|
| Remove fake company logos (Google, Microsoft, etc.) | `app/(marketing)/page.tsx:554-568` | Replace with "Join the waitlist" or real customers when available |
| Remove "Trusted by 10,000+ teams" | `app/(marketing)/page.tsx:153-157` | Remove entirely or replace with honest early metric |
| Remove "Now with enterprise SSO" badge | `app/(marketing)/page.tsx:96-99` | Remove — SSO is not built |
| Fix stats section fake numbers | `app/(marketing)/page.tsx:925-946` | Replace with provable benchmarks |
| Remove features page fake stats | `app/(marketing)/features/page.tsx:175-179` | Same |
| Fix FAQ lie ("SOC 2 Type II certified") | `app/(marketing)/pricing/page.tsx:203` | Change to "Enterprise-grade encryption — SOC 2 in progress" |

### Priority 2: App Dark Theme (The Biggest ROI Fix)

Full dark theme migration for the post-login app. Specific changes:

**`components/app/knowledge-sidebar.tsx`**
```
REPLACE:  aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col"
WITH:     aside className="w-72 border-r border-white/[0.06] bg-[#0a0a0f] flex flex-col"

REPLACE:  div className="p-4 border-b border-gray-200 bg-white"
WITH:     div className="p-4 border-b border-white/[0.06] bg-[#0a0a0f]"

REPLACE:  p className="text-sm text-gray-700 truncate"
WITH:     p className="text-sm text-white/70 truncate"

REPLACE:  hover:bg-gray-100
WITH:     hover:bg-white/[0.06]

REPLACE:  bg-violet-100 text-violet-700 (active nav)
WITH:     bg-violet-500/15 text-violet-300 border-l-2 border-violet-400
```

**`components/chat/chat-interface.tsx`**
```
REPLACE:  div className="flex h-screen bg-gray-50 dark:bg-gray-900"
WITH:     div className="flex h-screen bg-[#0a0a0f]"

REPLACE:  bg-white dark:bg-gray-800 (inner sidebar)
WITH:     bg-[#0d0d14]

REPLACE:  border-gray-200 dark:border-gray-700 (all borders)
WITH:     border-white/[0.06]

REPLACE:  bg-blue-600 (send button)
WITH:     bg-gradient-to-r from-violet-600 to-fuchsia-600

REPLACE:  focus:ring-blue-500 (input focus)
WITH:     focus:ring-violet-500/50
```

**`components/chat/chat-message.tsx`**
```
REPLACE:  bg-blue-600 text-white (user bubble)
WITH:     bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 border border-violet-500/30

REPLACE:  bg-white dark:bg-gray-800 border-gray-200 (AI bubble)
WITH:     bg-white/[0.04] border border-white/[0.08]

REPLACE:  emoji icon strings ('📄', '🌐', '💬', '📝')
WITH:     Lucide icons: FileText, Globe, MessageSquare, FileText with type-colored backgrounds
```

### Priority 3: Chat Empty State

Replace the plain text empty state with a designed welcome panel:

**What it should look like:**
- Centered layout with the brand logo mark (once custom mark exists, for now the gradient Sparkles)
- 3–4 suggested question cards in a 2-column grid, dynamically generated from indexed documents
- A keyboard shortcut hint: `⌘K for commands`
- Subtle violet glow behind the logo (`bg-violet-600/10 blur-3xl`)

**Suggested copy for cards:**
- "What should I know about our Q3 strategy?"
- "Summarize the last product roadmap discussion"
- "What decisions did we make about [topic]?"
- "Who owns [responsibility] on the team?"

### Priority 4: Input Bar Redesign

Replace `<input type="text" className="border border-gray-300">` with:

```
<div className="flex items-center gap-3 rounded-2xl border border-white/10 
  bg-white/[0.04] px-4 py-3.5 focus-within:border-violet-500/50 
  focus-within:bg-white/[0.06] transition-all">
  <Search className="h-4 w-4 text-white/30 flex-shrink-0" />
  <input
    placeholder="Ask anything about your company..."
    className="flex-1 bg-transparent text-white placeholder:text-white/30 
      focus:outline-none text-sm"
  />
  <div className="flex items-center gap-2">
    <kbd className="hidden sm:flex text-[10px] text-white/20 border border-white/10 
      px-1.5 py-0.5 rounded">⌘K</kbd>
    <button className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 
      transition-colors">
      <ArrowUp className="h-3.5 w-3.5 text-white" />
    </button>
  </div>
</div>
```

### Priority 5: Sidebar Architecture Simplification

The current sidebar has a structural problem: two tabs (Sources / Chat History) that force users to switch between views to see either their documents or their conversations. This creates an artificial choice.

**Recommended structure (single scrollable sidebar):**

```
┌─────────────────────────┐
│  ⬡ Corporate Brain      │  ← brand
│  [workspace name]       │
├─────────────────────────┤
│  + New Chat             │  ← primary action, top
├─────────────────────────┤
│  Recent                 │  ← conversations, collapsed group
│    · Chat 1             │
│    · Chat 2             │
├─────────────────────────┤
│  Knowledge (5)          │  ← sources, collapsed group  
│    📄 Strategy.pdf      │
│    🌐 notion.so/...     │
├─────────────────────────┤
│  ─── ─── ─── ─── ───   │
│  ⚡ Integrations        │  ← nav
│  🗺 Context Map         │
│  ⚙ Settings            │
│  ❓ Help                │
├─────────────────────────┤
│  [avatar] Name · role   │  ← user, bottom-pinned
└─────────────────────────┘
```

**Key changes:**
- New Chat at the top, not the bottom
- Conversations and sources as collapsible sections, not tabs
- User profile pinned to absolute bottom (like Linear, Slack, VS Code)

### Priority 6: Model Pill Component

Replace the plain model text badge with a functional pill:

```tsx
// Becomes this in chat-message.tsx
<div className="flex items-center gap-1.5 mt-2">
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full 
    bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/40">
    <Zap className="h-2.5 w-2.5 text-violet-400" />
    <span>{message.model}</span>
    <span className="text-white/20">·</span>
    <span>${message.cost?.toFixed(4) || '—'}</span>
  </div>
  <button className="p-1 rounded hover:bg-white/[0.06] transition-colors">
    <ThumbsUp className="h-3 w-3 text-white/20 hover:text-emerald-400" />
  </button>
  <button className="p-1 rounded hover:bg-white/[0.06] transition-colors">
    <ThumbsDown className="h-3 w-3 text-white/20 hover:text-red-400" />
  </button>
  <button className="p-1 rounded hover:bg-white/[0.06] transition-colors">
    <Copy className="h-3 w-3 text-white/20 hover:text-white/60" />
  </button>
</div>
```

### Priority 7: Marketing Site Feature Section Dark Theme

```
// app/(marketing)/page.tsx:735
REPLACE:  section className="py-24 lg:py-32 bg-gradient-to-r from-neutral-50 to-cyan-50"
WITH:     section className="py-24 lg:py-32 bg-[#0d0d14] border-y border-white/[0.04]"

// And for the feature cards:
REPLACE:  div className="group relative rounded-2xl bg-white border border-gray-200 shadow-sm"
WITH:     div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] 
            hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300"

REPLACE:  h3 className="text-lg font-semibold text-gray-900"
WITH:     h3 className="text-lg font-semibold text-white"

REPLACE:  p className="text-sm text-gray-600"
WITH:     p className="text-sm text-white/50"
```

---

## 8. Component-Level Specifications

### 8.1 The Ideal Chat Message Component

```
AI Message:
┌─────────────────────────────────────────────────────────┐
│ ⬡ [avatar]                                              │
│                                                         │
│  Your Q3 marketing budget is $450,000, approved by      │
│  Sarah Chen on June 15th.                               │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  $180K  │  │  $150K  │  │  $120K  │                 │
│  │ Paid Ads│  │  Events │  │ Content │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                         │
│  Sources:                                               │
│  [📄 Budget Q3 2026.docx · page 4]                      │
│  [💬 Slack #finance · Jun 15]                           │
│                                                         │
│  ⚡ gpt-4o-mini · 0.6s · $0.0002  👍 👎 📋             │
└─────────────────────────────────────────────────────────┘

User Message:
                        ┌─────────────────────────────────┐
                        │ What's our Q3 marketing budget? │
                        └─────────────────────────────────┘
                                              [avatar] You
```

### 8.2 The Ideal Sidebar Width and Behavior

- **Width:** 256px (not 320px — too wide for a secondary panel)
- **Collapsed state:** 52px icon-only rail (like VS Code)
- **Keyboard shortcut:** `⌘B` to toggle (standard across Linear, VS Code, Notion)
- **Background:** `#0a0a0f` with `border-r border-white/[0.06]`
- **Active item:** `border-l-2 border-violet-400 bg-violet-500/10 text-violet-300`

### 8.3 The Ideal Loading State

Replace three gray bouncing dots with:

```
[⬡ avatar pulsing violet] 
"Searching 47 sources..."     ← real number from knowledge base count
                              ← progress bar filling 0→100% over ~2s
```

Or for streaming (once built): tokens appear one by one, no loading state needed.

### 8.4 The Ideal Citation Card

```
Source citation (in message):
┌────────────────────────────────────────────┐
│ 📄  Budget Planning Q3 2026.docx            │
│     "The Q3 marketing budget was approved   │
│      at $450,000 by the finance committee   │
│      on June 15th, 2026..."                 │
│                                page 4  ↗   │
└────────────────────────────────────────────┘
```

Not a gray emoji chip. A card with excerpt, page number, and click-to-open.

---

## Summary

**Does it look like a billion-dollar Silicon Valley SaaS?**

**Marketing site:** Close, but undermined by fake social proof, a broken light-theme section, the SSO badge lie, and a generic Sparkles logo. Fix the trust-killers and it would pass.

**The app:** No. It looks like a well-coded hackathon project — gray, light-themed, blue-accented, emoji icons, plain text states. After a beautiful signup flow, users arrive here and feel cheated.

**The gap between marketing and app** is the single most important UI/UX problem in this entire product. Every other design improvement is secondary.

**The fix is not a full redesign.** It's a systematic dark theme migration across 4 files (`knowledge-sidebar.tsx`, `chat-interface.tsx`, `chat-message.tsx`, `app-client-wrapper.tsx`) and the removal of 6 false claims from the marketing site. That work — approximately 3–5 days — would make this look like a product that deserves the pricing it's charging.

**The 4 design references to study before touching any component:**
- **Linear** (linear.app) — dark sidebar, keyboard-first, micro-animation quality
- **Vercel** (vercel.com/dashboard) — dark app, clean data density, typography
- **Perplexity** (perplexity.ai) — dark chat UI with source citations done right
- **Superhuman** (superhuman.com) — keyboard shortcuts, dark theme, empty states

---

*Document prepared: April 2026*  
*Related: `doc/BRAND_STORYTELLING_PLAYBOOK.md` (micro-interactions spec), `doc/FEATURES_AUDIT.md` (B11 dark theme polish)*
