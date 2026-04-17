# Corporate Brain - What's Left To Complete
**Date:** April 14, 2026  
**Status:** Production Readiness Phase (Phase 5.5)  
**Estimated Effort:** 8 weeks (1 developer)

---

## Executive Summary

The core product (Phases 1-5) is **complete and functional**. This document outlines the remaining **production readiness** work required before public launch.

| Metric | Status |
|--------|--------|
| Core Product (Phases 1-5) | ✅ 85% Complete |
| Production Readiness (Phase 5.5) | 🔄 Not Started |
| **Overall to Launch** | **~8 weeks** |

---

## The 13 Remaining Work Categories

### 1. Marketing Site UI Consistency (Week 1)
**Goal:** Unify all marketing pages to match homepage theme

| Page | Current State | Required Work |
|------|---------------|---------------|
| `/features` | Basic layout | Overhaul to neural purple theme |
| `/how-it-works` | Basic layout | Consistent animations, gradients |
| `/pricing` | Basic layout | Match card styles, shadows |
| `/about` | Basic layout | Consistent typography, layout |
| `/contact` | Basic form | Premium dropdown, theme alignment |

**Components to Build:**
- [ ] `MarketingHeader` - Shared navigation, auth buttons
- [ ] `MarketingFooter` - Social links, legal links, copyright

**Acceptance Criteria:**
- [ ] All 5 pages use identical CSS custom properties
- [ ] No visual regression between pages
- [ ] Mobile responsive (320px - 1440px)
- [ ] Dark mode works consistently

---

### 2. New Use Case Page (Week 1-2)
**Goal:** Create `/use-case` with 6 use case categories

**Page Structure:**
```
/use-case
├── Hero: "Transform How Your Team Works"
├── Use Case Grid (6 cards)
│   ├── Knowledge Management
│   ├── Customer Support  
│   ├── Sales Enablement
│   ├── Engineering Teams
│   ├── HR & Onboarding
│   └── Executive Strategy
├── Social Proof (logos, quotes)
└── CTA: "Start Your Use Case" → /signup
```

**Each Use Case Card:**
- Icon (Lucide)
- Headline
- 3 bullet benefits
- "Learn More" link

**Acceptance Criteria:**
- [ ] SSR for SEO
- [ ] JSON-LD structured data
- [ ] Open Graph images (1200x630)

---

### 3. Legal Pages (Week 2)
**Goal:** Create admin-managed legal pages

| Page | URL | Content |
|------|-----|---------|
| Terms & Conditions | `/terms` | SaaS T&C, liability, usage limits |
| Privacy Policy | `/privacy` | GDPR compliant, data handling |
| Refund Policy | `/refund` | Subscription refunds, proration |

**Design Requirements:**
- Same header/footer as marketing pages
- Max-width 768px content
- TOC sidebar (sticky)
- Last updated date
- Print-friendly CSS

**Admin Management:** `/admin/cms/legal`
- [ ] Editable via CMS
- [ ] Version history
- [ ] PDF export

---

### 4. Footer Enhancement (Week 2)
**Goal:** Professional footer with social links

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🧠 Corporate Brain        Products    Company     Legal         │
│  [description]             • Features  • About     • Terms      │
│  [Get Started]             • Pricing   • Blog      • Privacy    │
│                            • Use Cases • Careers   • Refund    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [FB] [IG] [LI] [YT] [X] [TK] [GH]          © 2026 Corporate Brain│
└─────────────────────────────────────────────────────────────────┘
```

**Social Platforms (7 icons):**
1. Facebook
2. Instagram
3. LinkedIn
4. YouTube
5. X (Twitter)
6. TikTok
7. GitHub

**Admin Management:** `/admin/settings/social-links`
- [ ] URL input for each platform
- [ ] Show/hide toggle per platform
- [ ] Open in new tab setting

---

### 5. Admin CMS (Week 3)
**Goal:** Admin can manage all marketing content

**New Database Tables:**
```typescript
cms_pages       // Marketing pages
cms_sections    // Page sections (reorderable)
cms_media       // Uploaded images/files
```

**Admin Interfaces:**
| Path | Purpose |
|------|---------|
| `/admin/cms/features` | Edit features page |
| `/admin/cms/how-it-works` | Edit how-it-works page |
| `/admin/cms/pricing` | Edit pricing content (not plans) |
| `/admin/cms/about` | Edit about page |
| `/admin/cms/use-cases` | Edit use case content |
| `/admin/cms/legal` | Edit legal pages |
| `/admin/cms/contact` | Edit contact page |

**CMS Editor Features:**
- [ ] WYSIWYG-style editor
- [ ] Section reordering (drag-drop)
- [ ] Media upload with preview
- [ ] Draft preview before publishing
- [ ] SEO meta per page

---

### 6. Stripe Billing Integration (Week 4)
**Goal:** End-to-end subscription management

**New Database Tables:**
```typescript
subscriptions    // User subscriptions
invoices       // Invoice history
```

**Stripe Setup:**
```
Starter Plan:       $29/mo  | $290/yr (17% off)
Professional Plan:  $99/mo  | $990/yr (17% off)
Enterprise Plan:    $299/mo | $2,990/yr (17% off)
```

**API Routes:**
| Route | Purpose |
|-------|---------|
| `/api/billing/checkout` | Create Stripe Checkout session |
| `/api/billing/portal` | Customer Portal session |
| `/api/billing/webhook` | Handle Stripe events |
| `/api/billing/subscription` | Get current subscription |
| `/api/billing/invoices` | List invoice history |

**Frontend:**
- [ ] `/pricing` - Checkout integration
- [ ] `/app/settings/billing` - Manage subscription
- [ ] Trial flow (14 days)

**Webhook Events:**
- [ ] `checkout.session.completed`
- [ ] `invoice.paid`
- [ ] `invoice.payment_failed`
- [ ] `customer.subscription.deleted`

---

### 7. Dynamic Pricing Management (Week 5)
**Goal:** Admin controls pricing plans

**Admin Interface:** `/admin/pricing`

**Features:**
- [ ] CRUD for pricing plans
- [ ] Monthly/Yearly price configuration
- [ ] Feature list management
- [ ] "Most Popular" badge toggle
- [ ] Stripe price sync
- [ ] Trial days configuration

**New Database Table:**
```typescript
pricingPlans {
  name, slug, description,
  monthlyPrice, yearlyPrice,
  stripeMonthlyPriceId, stripeYearlyPriceId,
  trialDays, features[], limits{},
  isPopular, order, isActive
}
```

**Frontend:** `/pricing`
- [ ] Dynamically rendered from database
- [ ] Monthly/Yearly toggle
- [ ] Discount highlighting

---

### 8. Site Settings (Week 5)
**Goal:** Admin controls branding and configuration

**Admin Interface:** `/admin/settings`

**General Settings:**
- [ ] Site name
- [ ] Tagline
- [ ] Support email
- [ ] Default language
- [ ] Timezone
- [ ] User registration toggle
- [ ] Maintenance mode

**Branding Settings:**
- [ ] Logo upload (SVG/PNG)
- [ ] Favicon upload
- [ ] Primary color
- [ ] Secondary color
- [ ] Accent color
- [ ] Custom CSS (advanced)

**SEO Settings:**
- [ ] Default meta title template
- [ ] Default meta description
- [ ] Default OG image
- [ ] Robots.txt editor
- [ ] Sitemap generation toggle

**New Database Table:**
```typescript
settings {
  category, // 'general', 'branding', 'seo'
  key, value, isEncrypted
}
```

---

### 9. Webmasters & Analytics (Week 6)
**Goal:** Third-party integrations

**Admin Interface:** `/admin/settings/webmasters`

**Google:**
- [ ] Analytics ID (G-XXXXXXXXXX)
- [ ] Tag Manager ID (GTM-XXXXXX)
- [ ] Search Console verification

**Other Analytics:**
- [ ] Plausible URL
- [ ] Fathom site ID

**Implementation:**
- [ ] Analytics script injection in `<head>`
- [ ] Page view tracking
- [ ] Event tracking for key actions

---

### 10. API Integration Status (Week 6)
**Goal:** Monitor all third-party integrations

**Admin Interface:** `/admin/api-status`

**Status Board:**
```
🟢 OpenAI          Status: Operational    Response: 245ms
🟡 Unstructured    Status: Limited        Fallback: pdf2json  
🟢 Anthropic       Status: Operational    
🔴 Stripe          Status: Error          [Configure]
🟢 PostgreSQL      Status: Connected    
🟢 Redis           Status: Connected    
```

**Features:**
- [ ] Real-time health checks
- [ ] Response time monitoring
- [ ] API key rotation UI
- [ ] Error log viewer
- [ ] Test button per integration

**API Route:** `/api/admin/health`
```typescript
{
  timestamp: "2026-04-14T...",
  overall: "healthy" | "degraded",
  services: [
    { name: "openai", status: "ok", responseTime: 245 },
    { name: "stripe", status: "error", message: "..." }
  ]
}
```

---

### 11. Logout Options (Week 6)
**Goal:** Proper logout in both interfaces

**/app Logout:**
- Location: User dropdown in sidebar/app header
- Items: Profile, Settings, Billing, Sign Out

**/admin Logout:**
- Location: Admin header dropdown + sidebar
- Items: View Profile, Settings, Sign Out

**Implementation:**
```typescript
const handleLogout = async () => {
  await signOut({ callbackUrl: '/' });
};
```

---

### 12. Premium Contact Dropdown (Week 2)
**Goal:** Styled "How Can We Help?" selector

**Options:**
- 💰 Sales Inquiry
- 🔧 Technical Support
- 🤝 Partnership Opportunity
- 📊 Custom Enterprise Demo
- 🎓 Training & Onboarding
- 🐛 Report a Bug
- 💡 Feature Request
- 📰 Press & Media

**Visual Spec:**
- Trigger: `rounded-xl`, gradient border on focus
- Dropdown: `rounded-xl`, `shadow-2xl`, `backdrop-blur`
- Items: Hover state with violet-50 background
- Selected: Checkmark icon + violet text

---

### 13. Testing & Launch Prep (Week 7-8)
**Goal:** Production-ready validation

**E2E Testing:**
- [ ] Billing flow (checkout, trial, cancel)
- [ ] CMS publish/unpublish
- [ ] Auth flows (signup, login, logout)
- [ ] File upload and processing

**Legal Review:**
- [ ] Terms & Conditions (attorney review)
- [ ] Privacy Policy (GDPR compliance)
- [ ] Refund Policy (Stripe alignment)

**Stripe Testing:**
- [ ] Test mode full validation
- [ ] Webhook testing
- [ ] Trial conversion testing

**SEO Audit:**
- [ ] Meta tags on all pages
- [ ] Structured data validation
- [ ] Sitemap submission

**Performance:**
- [ ] Lighthouse scores (target: 90+)
- [ ] Load testing
- [ ] Mobile responsive check

**Production Deployment:**
- [ ] Environment variables configured
- [ ] SSL certificate
- [ ] Database migrations
- [ ] CDN assets

---

## Implementation Timeline

| Week | Focus | Key Deliverables |
|------|-------|------------------|
| **1** | Marketing UI | 5 pages overhaul, shared Header/Footer |
| **2** | New Pages & Legal | /use-case, /terms, /privacy, /refund, premium dropdown |
| **3** | Admin CMS | Database schema, CMS interfaces, media library |
| **4** | Stripe Billing | Checkout, webhooks, subscription management |
| **5** | Dynamic Pricing & Settings | Pricing CRUD, general/branding/SEO settings |
| **6** | Webmasters & API Status | Analytics, health dashboard, logout options |
| **7** | Testing | E2E tests, legal review, Stripe test mode |
| **8** | Launch Prep | SEO audit, performance, production deploy |

---

## Database Schema Additions Required

### CMS Tables
```typescript
cms_pages {
  id, tenantId, slug, title, 
  metaDescription, metaKeywords, ogImage,
  content, isPublished, publishedAt
}

cms_sections {
  id, pageId, sectionKey, order,
  title, subtitle, content, settings, isActive
}

cms_media {
  id, tenantId, filename, originalName,
  mimeType, size, url, altText
}
```

### Billing Tables
```typescript
subscriptions {
  id, tenantId, stripeCustomerId,
  stripeSubscriptionId, stripePriceId,
  status, plan, billingInterval,
  trialEndsAt, currentPeriodEnd, cancelAtPeriodEnd
}

invoices {
  id, tenantId, stripeInvoiceId,
  amount, status, pdfUrl
}

pricingPlans {
  id, tenantId, name, slug,
  monthlyPrice, yearlyPrice,
  stripeMonthlyPriceId, stripeYearlyPriceId,
  trialDays, features, limits,
  isPopular, order, isActive
}
```

### Settings Tables
```typescript
site_settings {
  id, tenantId, category, key, value
}

settings {
  id, tenantId, category, key,
  value, isEncrypted, updatedAt, updatedBy
}
```

---

## Dependencies & Prerequisites

### Required Accounts
- [ ] Stripe account (test + live keys)
- [ ] Google Analytics (optional)
- [ ] Google Search Console
- [ ] Social media accounts for footer links

### Legal Requirements
- [ ] Terms & Conditions review (legal counsel)
- [ ] Privacy Policy GDPR compliance review
- [ ] Refund Policy alignment with Stripe

### Technical Prerequisites
- [ ] SSL certificate
- [ ] Production PostgreSQL
- [ ] Redis instance
- [ ] Domain DNS configured

### Critical Blocker
**OPENAI_API_KEY** must be added to `.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```

Without this:
- ❌ Embeddings generation fails
- ❌ Chat API returns errors
- ❌ Document processing stops at chunking

---

## What's Already Complete (Don't Re-implement)

| Category | Status | Evidence |
|----------|--------|----------|
| File Upload (14 formats) | ✅ | `upload-modal.tsx` with all MIME types |
| Duplicate Detection | ✅ | SHA-256 hash, DB index |
| Unstructured.io | ✅ | `unstructured.ts` with 70+ formats |
| Chat Interface | ✅ | Calls real `/api/chat` |
| Knowledge Sidebar | ✅ | List, delete, reindex working |
| Auto File Deletion | ✅ | `deleteFromStorage()` |
| Auth (Credentials + Google) | ✅ | NextAuth v5 |
| Marketing Homepage | ✅ | Fortune 500 design |
| Cost Tracking | ✅ | Per-tenant usage |
| Vector Search | ✅ | pgvector HNSW |

---

## Success Criteria for Launch

### Must Have (P0)
- [ ] All 5 marketing pages visually consistent
- [ ] /use-case page with 6 use cases
- [ ] Legal pages: /terms, /privacy, /refund
- [ ] Footer with social links
- [ ] Stripe billing working
- [ ] Admin can manage pricing
- [ ] Admin can edit marketing content
- [ ] Logout options in /app and /admin

### Should Have (P1)
- [ ] API status dashboard
- [ ] Site settings (branding, SEO)
- [ ] Premium contact dropdown
- [ ] Webmasters integration

### Nice to Have (P2)
- [ ] Context Map visualization
- [ ] Real-time WebSocket updates
- [ ] Mobile responsive optimization
- [ ] Dark mode toggle

---

## Bottom Line

**Current State:** Core product works (85% complete)  
**Remaining Work:** 8 weeks of SaaS polish  
**Biggest Blocker:** OpenAI API key for embeddings  
**Estimated Launch:** 8 weeks with 1 developer

The hard work (AI, embeddings, database, APIs) is done. These 8 weeks add the billing, CMS, legal, and admin tooling required for a production SaaS launch.

---

*Document Status: Requirements Defined*  
*Next Step: Implementation when ready*  
*Reference: See `docs/PENDING_REQUIREMENTS.md` for detailed specifications*
