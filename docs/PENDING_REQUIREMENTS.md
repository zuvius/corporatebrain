# Corporate Brain - Pending Requirements Document
**Date:** April 14, 2026  
**Status:** Requirements Definition (Not Yet Implemented)  
**Priority:** High (Pre-Production Checklist)

---

## Executive Summary

This document consolidates all remaining requirements for production readiness across marketing site consistency, admin CMS capabilities, billing integration, and legal compliance.

**Total Items:** 13 major categories  
**Estimated Effort:** 6-8 weeks  
**Dependencies:** Stripe account, legal content review, design system finalization

---

## 1. Marketing Site UI Consistency Overhaul

### 1.1 Scope
All marketing pages must follow the exact visual theme established on the homepage (`/`).

### 1.2 Pages Requiring Overhaul

| Page | Current URL | Theme Consistency | Priority |
|------|-------------|-------------------|----------|
| Features | `/features` | Must match homepage neural purple/cyan/gold theme | P0 |
| How It Works | `/how-it-works` | Must match homepage animations, gradients | P0 |
| Pricing | `/pricing` | Must match homepage cards, shadows, spacing | P0 |
| About | `/about` | Must match homepage typography, layout | P0 |
| Contact | `/contact` | Must match homepage forms, buttons | P0 |

### 1.3 Design System Requirements

**Color Palette (Strict Adherence):**
```
Primary:      Neural Purple (#6B46C1) → violet-600
Secondary:    Electric Cyan (#06B6D4) → cyan-500
Accent:       Sovereign Gold (#F59E0B) → amber-500
Background:   Slate Gradient (slate-50 to slate-100)
Text:         Slate-900 (headings), Slate-600 (body)
```

**Typography:**
- Headings: Inter, font-weight 700-800
- Body: Inter, font-weight 400-500
- Code: JetBrains Mono

**Component Patterns:**
- Cards: `rounded-2xl`, `shadow-lg`, `border border-slate-200`
- Buttons: `rounded-xl`, gradient backgrounds, hover scale 1.02
- Forms: `rounded-lg`, focus ring in violet-500
- Icons: Lucide, 24px default, gradient fills where appropriate

**Animations:**
- Hero: Neural network pulse (CSS keyframes)
- Scroll: Fade-in-up with Intersection Observer
- Hover: Subtle lift (translateY -2px) + shadow increase

### 1.4 Acceptance Criteria
- [ ] All 5 pages use identical CSS custom properties for colors
- [ ] Header component is shared across all marketing pages
- [ ] Footer component is shared across all marketing pages
- [ ] No visual regression when navigating between pages
- [ ] Mobile responsive (320px - 1440px)
- [ ] Dark mode toggle works consistently

---

## 2. New Use Cases Page (/use-case)

### 2.1 Page Structure

```
/use-case
├── Hero Section
│   ├── Headline: "Transform How Your Team Works"
   ├── Subhead: Contextual use case discovery
│   └── CTA: "See Your Use Case" (scrolls to grid)
├── Use Case Grid (6 categories)
│   ├── Knowledge Management
│   ├── Customer Support
│   ├── Sales Enablement
│   ├── Engineering Teams
│   ├── HR & Onboarding
│   └── Executive Strategy
├── Feature Highlights per Use Case
│   ├── Icon + Title
│   ├── 3 bullet benefits
│   └── "Learn More" → detailed modal/page
├── Social Proof
│   ├── Customer logos
│   ├── Quote carousel
│   └── ROI statistics
├── Final CTA
│   └── "Start Your Use Case" → /signup
└── SEO Meta
    ├── Title: "AI Use Cases for Business | Corporate Brain"
    └── Description: Industry-specific AI knowledge management
```

### 2.2 Content Requirements

**Use Case 1: Knowledge Management**
- Icon: `Library` (Lucide)
- Headline: "Centralize Company Knowledge"
- Benefits:
  - Search across all documents instantly
  - Preserve institutional knowledge
  - Onboard employees 10x faster

**Use Case 2: Customer Support**
- Icon: `Headphones` (Lucide)
- Headline: "AI-Powered Support Teams"
- Benefits:
  - Instant answers from documentation
  - Reduce ticket resolution time
  - Consistent responses across team

**Use Case 3: Sales Enablement**
- Icon: `TrendingUp` (Lucide)
- Headline: "Close Deals with Perfect Information"
- Benefits:
  - Battle cards at your fingertips
  - Competitive analysis on demand
  - Proposal generation assistance

**Use Case 4: Engineering Teams**
- Icon: `Code2` (Lucide)
- Headline: "Documentation That Actually Helps"
- Benefits:
  - Code context + business context
  - Technical decision rationale
  - Architecture history preserved

**Use Case 5: HR & Onboarding**
- Icon: `Users` (Lucide)
- Headline: "Onboard in Days, Not Months"
- Benefits:
  - Policy answers instantly
  - Historical context for decisions
  - Training material synthesis

**Use Case 6: Executive Strategy**
- Icon: `Target` (Lucide)
- Headline: "Decisions Backed by Data"
- Benefits:
  - Meeting decision tracking
  - Strategic initiative alignment
  - Competitive intelligence

### 2.3 Technical Requirements
- SSR for SEO
- JSON-LD structured data for each use case
- Open Graph images (1200x630) per use case
- Anchor links for direct use case sharing

---

## 3. Contact Page Premium Dropdown

### 3.1 Current State
Basic contact form with standard HTML select dropdown.

### 3.2 Required Enhancement

**"How Can We Help?" Dropdown:**
- Premium styled (matches marketing theme)
- Animated open/close
- Icon + text for each option
- Search/filter capability (if > 6 options)
- Multi-select capability (optional)

**Dropdown Options:**
```
┌─────────────────────────────────────┐
│ 🔍 How Can We Help?              ▼  │
├─────────────────────────────────────┤
│ 💰  Sales Inquiry                   │
│ 🔧  Technical Support               │
│ 🤝  Partnership Opportunity         │
│ 📊  Custom Enterprise Demo          │
│ 🎓  Training & Onboarding           │
│ 🐛  Report a Bug                    │
│ 💡  Feature Request                 │
│ 📰  Press & Media                   │
└─────────────────────────────────────┘
```

**Visual Spec:**
- Trigger: `rounded-xl`, gradient border on focus
- Dropdown: `rounded-xl`, `shadow-2xl`, `backdrop-blur`
- Items: Hover state with violet-50 background
- Selected: Checkmark icon + violet text

---

## 4. Admin CMS for Marketing Content

### 4.1 Overview
Admin owner can manage all marketing site content via `/admin/cms` interface.

### 4.2 Content Types & CRUD Operations

| Content Type | Admin Path | CRUD | Fields |
|--------------|------------|------|--------|
| **Features Page** | `/admin/cms/features` | Full CRUD | Sections, icons, descriptions, order |
| **How It Works** | `/admin/cms/how-it-works` | Full CRUD | Steps, animations, explanations |
| **Pricing Plans** | `/admin/cms/pricing` | Full CRUD | See Section 8 |
| **About Content** | `/admin/cms/about` | Full CRUD | Team, mission, history, values |
| **Contact Settings** | `/admin/cms/contact` | Full CRUD | Form fields, recipients, auto-responses |
| **Use Cases** | `/admin/cms/use-cases` | Full CRUD | 6 use cases, content per case |

### 4.3 Database Schema (New Tables)

```typescript
// lib/db/schema.ts - CMS Tables

export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(), // 'features', 'pricing', etc.
  title: varchar("title", { length: 255 }).notNull(),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogImage: varchar("og_image", { length: 500 }),
  content: jsonb("content").notNull(), // Flexible content structure
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id),
}, (table) => ({
  slugIdx: index("cms_slug_idx").on(table.tenantId, table.slug),
}));

export const cmsSections = pgTable("cms_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id").references(() => cmsPages.id).notNull(),
  sectionKey: varchar("section_key", { length: 100 }).notNull(),
  order: integer("order").default(0),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  content: jsonb("content").notNull(), // Section-specific data
  settings: jsonb("settings").default('{}'), // Layout, colors, etc.
  isActive: boolean("is_active").default(true),
});

export const cmsMedia = pgTable("cms_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});
```

### 4.4 Admin UI Components

**CMS Editor Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  CMS / Features                              [Preview] [Save] │
├──────────────┬──────────────────────────────────────────────┤
│  📝 Pages     │  Section: Hero                               │
│  ──────────── │  ┌────────────────────────────────────────┐  │
│  • Features   │  │ Headline: [Transform Your...      ]   │  │
│  • How It Works│  │ Subhead:  [AI-powered knowledge... ]   │  │
│  • Pricing    │  │                                        │  │
│  • About      │  │ CTA Text: [Get Started Free]            │  │
│  • Contact    │  │ CTA Link: [/signup]                     │  │
│  • Use Cases  │  │                                        │  │
│  • Legal      │  │ Background: [Gradient/Image/Solid ▼]  │  │
│               │  │ Image: [Upload 📷]                      │  │
│               │  └────────────────────────────────────────┘  │
│               │                                              │
│               │  Section: Feature Grid (3 items)              │
│               │  ┌────────────────────────────────────────┐  │
│               │  │ Item 1                                   │  │
│               │  │ Icon: [🔍] Title: [Smart Search]        │  │
│               │  │ Desc: [Find anything...]                │  │
│               │  │ [+ Add Item] [Reorder ▲▼]               │  │
│               │  └────────────────────────────────────────┘  │
│               │                                              │
│               │  SEO Settings                                │
│               │  Title: [Features | Corporate Brain]        │
│               │  Description: [AI knowledge...]             │
└───────────────┴──────────────────────────────────────────────┘
```

---

## 5. Legal Pages

### 5.1 Required Pages

| Page | URL | Content Requirements |
|------|-----|---------------------|
| Terms & Conditions | `/terms` | Standard SaaS T&C, liability, usage limits |
| Privacy Policy | `/privacy` | GDPR compliant, data handling, retention |
| Refund Policy | `/refund` | Subscription refunds, proration, timeframe |

### 5.2 Design Requirements
- Same header/footer as marketing pages
- Clean, readable typography (max-width 768px content)
- Table of contents sidebar (sticky)
- Last updated date display
- Print-friendly CSS
- Section anchor links for sharing

### 5.3 Content Structure (Terms Example)
```
/terms
├── Last Updated: April 14, 2026
├── Table of Contents (sticky sidebar)
│   ├── 1. Agreement to Terms
│   ├── 2. Description of Service
│   ├── 3. User Accounts
│   ├── 4. Payment & Billing
│   ├── 5. Data & Privacy
│   ├── 6. Acceptable Use
│   ├── 7. Termination
│   ├── 8. Limitation of Liability
│   ├── 9. Changes to Terms
│   └── 10. Contact Information
└── Full text sections
```

### 5.4 Admin Management
- Legal pages editable via `/admin/cms/legal`
- Version history tracking
- PDF export capability
- Multi-language support (future)

---

## 6. Footer Enhancements

### 6.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🧠 Corporate Brain                    Products    Company     Legal        │
│  Transform your company's              • Features  • About     • Terms      │
│  knowledge into AI-powered           • Pricing    • Blog      • Privacy    │
│  institutional memory.                 • Use Cases • Careers   • Refund     │
│  [Get Started]                         • Integrations • Contact             │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  [FB] [IG] [LI] [YT] [X] [TK] [GH]                    © 2026 Corporate Brain │
│  Social Links (managed in admin)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Social Media Links (Admin Managed)

**Platforms (7 icons):**
1. Facebook
2. Instagram
3. LinkedIn
4. YouTube
5. X (Twitter)
6. TikTok
7. GitHub

**Admin Interface:** `/admin/settings/social-links`
```
Social Links Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━
Facebook:  [https://facebook.com/corporatebrain ]
Instagram: [https://instagram.com/corporatebrain]
LinkedIn:  [https://linkedin.com/company/corporatebrain]
YouTube:   [https://youtube.com/@corporatebrain]
X:         [https://x.com/corporatebrain]
TikTok:    [https://tiktok.com/@corporatebrain]
GitHub:    [https://github.com/corporatebrain]

[Save Changes] [Reset to Default]
```

**Database:**
```typescript
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'social', 'branding', 'seo'
  key: varchar("key", { length: 100 }).notNull(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id),
});
```

---

## 7. Stripe Billing Integration

### 7.1 Overview
Complete Stripe integration for subscription management with trial support.

### 7.2 Required Stripe Setup

**Products & Prices (Created in Stripe Dashboard):**
```
Product: Starter Plan
├── Price: Monthly - $29/month
└── Price: Yearly - $290/year (17% discount)

Product: Professional Plan
├── Price: Monthly - $99/month
└── Price: Yearly - $990/year (17% discount)

Product: Enterprise Plan
├── Price: Monthly - $299/month
└── Price: Yearly - $2,990/year (17% discount)
```

### 7.3 Database Schema (Billing)

```typescript
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default('trialing'), // trialing, active, past_due, canceled
  plan: varchar("plan", { length: 50 }).notNull(), // starter, professional, enterprise
  billingInterval: varchar("billing_interval", { length: 20 }), // monthly, yearly
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),
  amount: integer("amount"), // cents
  status: varchar("status", { length: 50 }), // draft, open, paid, void, uncollectible
  pdfUrl: varchar("pdf_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 7.4 API Routes

```
/app/api/billing/
├── checkout/route.ts           # Create Stripe Checkout session
├── portal/route.ts             # Create Customer Portal session
├── webhook/route.ts            # Handle Stripe webhooks
├── subscription/route.ts       # Get current subscription
└── invoices/route.ts           # List invoice history
```

### 7.5 Frontend Integration

**Pricing Page:**
- Monthly/Yearly toggle with discount highlighting
- "Start Free Trial" → Stripe Checkout
- Plan comparison table (from admin CMS)
- FAQ accordion

**Billing Management:**
- `/app/settings/billing` - Manage subscription
- Update payment method
- View/download invoices
- Cancel/upgrade subscription
- Usage vs plan limits

### 7.6 Trial Flow
```
1. User clicks "Start Free Trial" on pricing
2. Stripe Checkout with $0 trial (14 days)
3. Requires credit card (for verification)
4. Webhook: `checkout.session.completed`
5. Create tenant with `status: 'trialing'`
6. Email reminder 3 days before trial ends
7. Auto-convert to paid or cancel
```

---

## 8. Dynamic Pricing Management

### 8.1 Admin Interface: `/admin/pricing`

**Pricing Plans CRUD:**
```
Pricing Management                    [+ New Plan]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│ Starter Plan                                    [Edit] [❌] │
│ $29/month | $290/year (17% off)                             │
│ • 1,000 queries/month                                       │
│ • 10GB storage                                              │
│ • 3 team members                                            │
│ • Basic support                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Professional Plan                               [Edit] [❌] │
│ $99/month | $990/year (17% off)                             │
│ • 10,000 queries/month                                      │
│ • 100GB storage                                             │
│ • 25 team members                                           │
│ • Priority support                                          │
│ • API access                                                │
└─────────────────────────────────────────────────────────────┘

[Sync to Stripe] [Preview Changes]
```

**Plan Editor Modal:**
```
Edit Plan: Professional
━━━━━━━━━━━━━━━━━━━━━━━

Plan Name:     [Professional                    ]
Display Order: [2               ]
Popular Badge: [✓] Highlight as "Most Popular"

Monthly Price: [$ 99            ] Stripe Price ID: [price_xxx]
Yearly Price:  [$ 990           ] Stripe Price ID: [price_yyy]
Trial Days:    [14              ]

Features:
[✓] [10,000 queries/month                    ] [Delete]
[✓] [100GB storage                           ] [Delete]
[✓] [25 team members                         ] [Delete]
[✓] [Priority support                        ] [Delete]
[ ] [API access                              ] [Delete]
[+ Add Feature]

Limits:
Queries/Month: [10000           ]
Storage GB:    [100             ]
Team Members:  [25              ]

[Save Changes] [Cancel]
```

### 8.2 Database Schema

```typescript
export const pricingPlans = pgTable("pricing_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull(),
  description: text("description"),
  monthlyPrice: integer("monthly_price"), // cents
  yearlyPrice: integer("yearly_price"), // cents
  stripeMonthlyPriceId: varchar("stripe_monthly_price_id", { length: 255 }),
  stripeYearlyPriceId: varchar("stripe_yearly_price_id", { length: 255 }),
  trialDays: integer("trial_days").default(14),
  features: jsonb("features").notNull(), // Array of feature strings
  limits: jsonb("limits").notNull(), // { queries: number, storage: number, members: number }
  isPopular: boolean("is_popular").default(false),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 8.3 Pricing Page Frontend

**Dynamic Rendering:**
```typescript
// app/(marketing)/pricing/page.tsx
export default async function PricingPage() {
  const plans = await db.query.pricingPlans.findMany({
    where: eq(pricingPlans.isActive, true),
    orderBy: pricingPlans.order,
  });
  
  return (
    <PricingClient 
      plans={plans}
      defaultInterval="monthly"
    />
  );
}
```

**Toggle Component:**
```
┌─────────────────────────────────────┐
│  Monthly    |●|    Yearly [-17%]    │
│  (Monthly)      (Save 2 months)    │
└─────────────────────────────────────┘
```

---

## 9. General + Branding + SEO + Webmasters Settings

### 9.1 Admin Interface: `/admin/settings`

**Tab Navigation:**
```
[General] [Branding] [SEO] [Webmasters] [API] [Integrations]
```

### 9.2 General Settings

```
General Settings
━━━━━━━━━━━━━━━━━

Site Name:        [Corporate Brain               ]
Tagline:          [Sovereign AI Context Fabric   ]
Support Email:    [support@corporatebrain.io     ]
Default Language: [English ▼                     ]
Timezone:         [UTC ▼                       ]
Date Format:      [MM/DD/YYYY ▼                ]

Features:
[✓] Enable user registration
[✓] Enable Google OAuth
[✓] Enable magic links
[ ] Require email verification
[✓] Enable public roadmap
[ ] Maintenance mode

[Save Changes]
```

### 9.3 Branding Settings

```
Branding
━━━━━━━━━

Logo:
[Upload Logo (SVG/PNG)]     [Preview]
Recommended: 200x40px, transparent background

Favicon:
[Upload Favicon (ICO/PNG)]  [Preview]
Recommended: 32x32px

Colors:
Primary:    [🎨 #6B46C1] [Reset to Default]
Secondary:  [🎨 #06B6D4] [Reset to Default]
Accent:     [🎨 #F59E0B] [Reset to Default]

Custom CSS: (Advanced)
┌─────────────────────────────────────────────┐
│ /* Add custom styles here */                │
│                                             │
└─────────────────────────────────────────────┘

[Save Changes] [Preview]
```

### 9.4 SEO Settings

```
SEO & Metadata
━━━━━━━━━━━━━

Default Meta Title:       [Corporate Brain - {page}]
Default Meta Description:   [Transform your company's knowledge into AI-powered institutional memory.]
Default OG Image:         [Upload / Current: og-default.jpg]

Robots.txt:
┌─────────────────────────────────────────────┐
│ User-agent: *                               │
│ Allow: /                                    │
│ Disallow: /app/                             │
│ Disallow: /admin/                           │
│ Sitemap: https://yoursite.com/sitemap.xml   │
└─────────────────────────────────────────────┘

Structured Data (JSON-LD):
[✓] Organization schema
[✓] Website schema
[✓] Breadcrumb schema
[ ] Product schema on pricing

Sitemap:
[✓] Auto-generate sitemap.xml
[✓] Include last modified dates
[✓] Include priority scores

[Regenerate Sitemap] [Save Changes]
```

### 9.5 Webmasters Settings

```
Webmasters & Analytics
━━━━━━━━━━━━━━━━━━━━━━━

Google:
Analytics ID:   [G-XXXXXXXXXX                    ]
Tag Manager ID: [GTM-XXXXXX                      ]
Search Console: [Verify ownership                 ]

Other Analytics:
Plausible:      [https://plausible.io/js/script.js]
Fathom:         [XXXXXXXX                        ]

[Save Changes]
```

### 9.6 Database Schema

```typescript
export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  key: varchar("key", { length: 100 }).notNull(),
  value: text("value"),
  isEncrypted: boolean("is_encrypted").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id),
}, (table) => ({
  categoryKeyIdx: index("settings_cat_key_idx").on(table.tenantId, table.category, table.key),
}));
```

---

## 10. API Integration Status Dashboard

### 10.1 Admin Interface: `/admin/api-status`

**Status Board:**
```
API Integration Status                    [Refresh All]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│ 🟢 OpenAI                              Status: Operational  │
│    API Key: ***************key                              │
│    Last Check: 2 minutes ago                                │
│    Response Time: 245ms                                     │
│    [Test] [Rotate Key] [View Logs]                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🟡 Unstructured.io                     Status: Limited      │
│    API Key: Not configured (fallback active)                │
│    Fallback: pdf2json                                       │
│    [Configure] [Test]                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🟢 Anthropic                           Status: Operational  │
│    API Key: ***************key                              │
│    Last Check: 5 minutes ago                                │
│    [Test] [Rotate Key]                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🔴 Stripe                              Status: Error        │
│    Error: Invalid API key format                           │
│    [Configure] [View Error]                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🟢 PostgreSQL                          Status: Connected    │
│    Host: localhost:5432                                     │
│    Version: 15.2                                            │
│    [View Metrics]                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 🟢 Redis                               Status: Connected    │
│    Host: localhost:6379                                       │
│    Memory Usage: 45MB / 100MB                               │
│    [View Metrics] [Flush Cache]                            │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Health Check API

```typescript
// app/api/admin/health/route.ts
export async function GET() {
  const checks = await Promise.all([
    checkOpenAI(),
    checkUnstructured(),
    checkAnthropic(),
    checkStripe(),
    checkDatabase(),
    checkRedis(),
  ]);
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    overall: checks.every(c => c.status === 'ok') ? 'healthy' : 'degraded',
    services: checks,
  });
}
```

---

## 11. Logout Options

### 11.1 /app Logout

**Location:** User dropdown in sidebar/app header
```
┌─────────────────────┐
│ 👤 John Doe         │
│ john@acme.com       │
│ ─────────────────── │
│ Profile             │
│ Settings            │
│ Billing             │
│ ─────────────────── │
│ 🚪 Sign Out         │
└─────────────────────┘
```

**Implementation:**
```typescript
// components/app/user-menu.tsx
const handleLogout = async () => {
  await signOut({ callbackUrl: '/' });
};
```

### 11.2 /admin Logout

**Location:** Admin header + sidebar
```
Admin Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Logo] Corporate Brain Admin              [🔔] [👤 Admin ▼] [🚪 Logout]

┌──────────────┬──────────────────────────────────────────────────────┐
│  Dashboard   │                                      User Actions    │
│  ───────────  │                                      ┌─────────────┐ │
│  Analytics   │                                      │ View Profile│ │
│  Users       │                                      │ Settings    │ │
│  Billing     │                                      │ ─────────── │ │
│  CMS         │                                      │ 🚪 Sign Out │ │
│  Settings    │                                      └─────────────┘ │
│  ─────────── │                                                      │
│  🚪 Logout   │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 12. Implementation Timeline

### Phase 1: Marketing Consistency (Week 1)
- [ ] UI overhaul: /features, /how-it-works, /pricing, /about, /contact
- [ ] Header/Footer component extraction
- [ ] Theme consistency verification

### Phase 2: New Pages (Week 2)
- [ ] Create /use-case page
- [ ] Premium contact dropdown
- [ ] Legal pages: /terms, /privacy, /refund
- [ ] Footer with social links

### Phase 3: Admin CMS Foundation (Week 3-4)
- [ ] Database schema for CMS tables
- [ ] Admin UI for content management
- [ ] Marketing content CRUD
- [ ] Social links management
- [ ] Media library

### Phase 4: Billing Integration (Week 5-6)
- [ ] Stripe setup and configuration
- [ ] Database schema for subscriptions
- [ ] Checkout flow
- [ ] Customer portal
- [ ] Webhook handling
- [ ] Trial management

### Phase 5: Dynamic Pricing (Week 6)
- [ ] Pricing management admin UI
- [ ] Monthly/Yearly toggle
- [ ] Plan feature management
- [ ] Stripe sync

### Phase 6: Settings & Polish (Week 7)
- [ ] General settings
- [ ] Branding settings
- [ ] SEO settings
- [ ] Webmasters integration
- [ ] API status dashboard
- [ ] Logout implementation

### Phase 7: Testing & Launch (Week 8)
- [ ] End-to-end testing
- [ ] Stripe test mode verification
- [ ] Legal content review
- [ ] SEO audit
- [ ] Performance optimization
- [ ] Production deployment

---

## 13. Dependencies & Prerequisites

### Required Accounts
- [ ] Stripe account (with test + live keys)
- [ ] Google Analytics account (optional)
- [ ] Google Search Console access
- [ ] Social media accounts (for footer links)

### Legal Requirements
- [ ] Terms & Conditions review by legal counsel
- [ ] Privacy Policy GDPR compliance review
- [ ] Refund Policy alignment with Stripe terms

### Technical Prerequisites
- [ ] SSL certificate (for Stripe webhooks)
- [ ] Production PostgreSQL database
- [ ] Redis instance
- [ ] Domain DNS configuration

---

## 14. Summary Checklist

### Marketing Site
- [ ] /features - UI overhaul complete
- [ ] /how-it-works - UI overhaul complete
- [ ] /pricing - UI overhaul + dynamic plans
- [ ] /about - UI overhaul complete
- [ ] /contact - UI overhaul + premium dropdown
- [ ] /use-case - New page created
- [ ] Header - Consistent across all pages
- [ ] Footer - Consistent with social links
- [ ] Legal links in footer (/terms, /privacy, /refund)

### Admin Dashboard
- [ ] CMS management interface
- [ ] Pricing plan CRUD
- [ ] Social links management
- [ ] General settings
- [ ] Branding settings
- [ ] SEO settings
- [ ] Webmasters settings
- [ ] API integration status

### Billing
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Trial handling
- [ ] Invoice management
- [ ] Checkout flow
- [ ] Customer portal

### Legal
- [ ] /terms page
- [ ] /privacy page
- [ ] /refund page
- [ ] Admin editable content

### Auth
- [ ] /app logout
- [ ] /admin logout
- [ ] User menu dropdown

---

*Document Status: Requirements Definition Complete*  
*Next Step: Implementation Planning & Execution*  
*Estimated Effort: 6-8 weeks (1 developer)*
