# Sovereignty Reality Check

> **Document Type:** Technical Positioning Audit  
> **Prepared:** April 2026  
> **Purpose:** Honest assessment of what "Sovereign" means in Corporate Brain's current architecture, what it doesn't mean, and the roadmap to make the claim watertight.

---

## The Problem With "Sovereign"

The main strategic analysis positions Corporate Brain as a **"Sovereign Context Fabric"** — a compelling and differentiated claim. However, the current implementation uses third-party AI APIs (OpenAI, Anthropic, Google) for inference. This creates a gap between the marketing claim and the technical reality that must be understood before pitching to regulated industries.

**This document maps that gap precisely and defines the path to close it.**

---

## What the Current Architecture Actually Does

### Step-by-Step Data Flow

```
1. User uploads a PDF
   └── Stored in: /uploads/{id}/{filename}  ← YOUR SERVER ✅

2. Document parsed via Unstructured.io API
   └── Document content sent to: api.unstructured.io  ← THIRD PARTY ⚠️

3. Chunks embedded via OpenAI text-embedding-ada-002
   └── Chunk text sent to: api.openai.com  ← THIRD PARTY ⚠️

4. Vectors stored in pgvector
   └── Stored in: your PostgreSQL database  ← YOUR SERVER ✅

5. User asks a question
   └── Query + top-K retrieved chunks sent to: OpenAI / Anthropic / Google  ← THIRD PARTY ⚠️

6. AI response returned and stored
   └── Stored in: your conversations/messages tables  ← YOUR SERVER ✅
```

### Summary Table

| Data Layer | Where It Lives | Leaves Your Infra? | Sovereign? |
|---|---|---|---|
| Raw uploaded files | Your filesystem (`/uploads/`) | No | ✅ Yes |
| Parsed document text | Your PostgreSQL (`knowledge_sources.content`) | During parsing step | ⚠️ Partial |
| Vector embeddings | Your PostgreSQL (`knowledge_sources.embedding`) | During embedding step | ⚠️ Partial |
| Conversation history | Your PostgreSQL (`messages`, `conversations`) | No | ✅ Yes |
| Query + context chunks | Sent to LLM provider per query | Yes, every query | ❌ No |
| Metadata, audit logs | Your PostgreSQL | No | ✅ Yes |

### The Third-Party Exposure Points

```
lib/ai/router/index.ts — Routes queries to:
  ├── OpenAI    (gpt-4o-mini, gpt-4o)
  ├── Anthropic (claude-3-5-sonnet, claude-3-opus)
  └── Google    (gemini-1.5-flash, gemini-1.5-pro)

lib/ingestion/parsers/document.ts — Calls:
  └── Unstructured.io API (document parsing)

lib/ingestion/parsers/unstructured.ts — Sends:
  └── Raw document content to api.unstructured.io
```

---

## Competitor Honesty Check

To be fair: **every major competitor has the same exposure.**

| Competitor | Storage | Inference |
|---|---|---|
| Glean | Their cloud | OpenAI (primary) |
| Moveworks | Their cloud | OpenAI (primary) |
| Guru | Their cloud | OpenAI |
| Notion AI | Their cloud | OpenAI |
| **Corporate Brain** | **Your infra** | OpenAI / Anthropic / Google |

Corporate Brain's data storage is genuinely more sovereign than all of the above — your documents and vectors never live on a shared vendor cloud. The inference layer has the same exposure, but that is true across the entire industry.

The claim is not false — it is incomplete.

---

## What "Sovereign" Honestly Means Today

### Accurate Current Claim

> *"Your documents, vectors, and conversation history are stored entirely on your own infrastructure. Only the AI inference step — the question + retrieved context — is processed by the AI provider of your choice (OpenAI, Anthropic, or Google). Your raw data never lives on a shared vendor cloud."*

### What This Covers

- ✅ No vendor lock-in on data storage
- ✅ Documents never co-mingled with other companies' data on a shared cloud
- ✅ Vector embeddings are your intellectual property, stored in your database
- ✅ Full data portability — cancel anytime, keep everything
- ✅ Self-deployable on any VPS, private cloud, or on-premise server
- ✅ PostgreSQL + pgvector runs entirely within your infrastructure

### What This Does NOT Cover

- ❌ Inference queries sent to OpenAI/Anthropic/Google include your document content
- ❌ Unstructured.io receives raw document text during parsing
- ❌ OpenAI embeddings API receives chunk text during ingestion
- ❌ No guarantee that AI providers don't log or process your queries (depends on their ToS and your API tier)

---

## The Compliance Reality by Industry

### Healthcare (HIPAA)
**Current status: ❌ Not compliant for PHI**

HIPAA requires a Business Associate Agreement (BAA) with any service that processes Protected Health Information. OpenAI offers a BAA for its API — but only on Enterprise tier. Unstructured.io's BAA status is unclear.

**Minimum to claim HIPAA compliance:**
- Use OpenAI Enterprise API with executed BAA
- Replace Unstructured.io with local document parser (Docling, Marker, etc.)
- Confirm no PHI in query context chunks sent to LLM

---

### Finance (GDPR / FCA / SEC)
**Current status: ⚠️ Yellow — depends on configuration**

GDPR Article 28 requires a Data Processing Agreement (DPA) with any sub-processor. OpenAI, Anthropic, and Google all offer DPAs for their APIs. With DPAs in place, the inference step is legally permissible for most EU/UK financial use cases.

**Data residency:** If a French bank requires data to stay in EU, query chunks sent to US-based OpenAI API may violate Schrems II unless using Azure OpenAI (EU region) or Google Vertex AI (EU region).

**Minimum to claim GDPR-compliant sovereignty:**
- Use Azure OpenAI (EU region) or Google Vertex AI (EU region)
- Execute DPAs with all AI sub-processors
- Document the data flow in a ROPA (Record of Processing Activities)

---

### Defense / Government (Air-gapped)
**Current status: ❌ Not viable without local LLMs**

Classified environments by definition cannot call external APIs. Any inference step touching the public internet is disqualifying.

**Minimum to claim air-gapped sovereignty:**
- Local LLM inference (Ollama + llama-3 or Mistral)
- Local embedding model (e.g., `nomic-embed-text` via Ollama)
- Local document parsing (replace Unstructured.io API with self-hosted instance or Docling)

---

### General Enterprise (Fortune 500)
**Current status: ✅ Viable with standard ToS**

Most Fortune 500 companies already have enterprise agreements with OpenAI, Anthropic, or Google that include data processing agreements and opt-out of training. The current architecture is sufficient for this segment.

---

## The Roadmap to Full Sovereignty

### Tier 1: "Sovereign Storage" (Current State)
> What we have today. Accurate claim: data lives on your infra; inference via chosen AI provider.

**Suitable for:** General enterprise, tech companies, most startups

---

### Tier 2: "Sovereign Inference — Private Cloud" (6–8 weeks)
Add support for:
- **Azure OpenAI Service** — Same OpenAI models, processed within customer's Azure tenant
- **Google Vertex AI** — Same Gemini models, processed within customer's GCP project
- **AWS Bedrock** — Claude + Titan models within customer's AWS account

**Implementation:** Add `azure-openai`, `vertex`, `bedrock` as provider options in `lib/ai/router/index.ts`. The abstraction already exists — it's a configuration change plus SDK swap.

**Suitable for:** GDPR-regulated EU companies, HIPAA with BAA, financial services

---

### Tier 3: "Full Air-Gap Sovereignty" (10–14 weeks)
Add support for:
- **Ollama** local LLM inference (`llama-3.1`, `mistral-nemo`, `qwen2.5`)
- **Local embedding models** (`nomic-embed-text`, `mxbai-embed-large` via Ollama)
- **Self-hosted Unstructured.io** (open-source version, Docker deployable)

**Implementation:**
```typescript
// lib/ai/router/index.ts — add Ollama provider
{
  id: "llama-3.1-70b",
  provider: "ollama",        // new provider type
  endpoint: "http://localhost:11434",
  tier: "balanced",
  contextWindow: 128000,
  costPer1KInput: 0,         // zero — runs locally
  costPer1KOutput: 0,
  strengths: ["chat", "analysis"],
}
```

**Suitable for:** Defense contractors, government agencies, intelligence, highly classified environments

---

## Recommended Positioning Language by Audience

### For General Enterprise / Tech Companies
> "Your documents and knowledge base live entirely on your infrastructure. AI inference uses your choice of OpenAI, Anthropic, or Google — with full data processing agreements available."

### For Regulated Industries (Finance, Healthcare)
> "Sovereign data storage with private-cloud inference options. Deploy on Azure, GCP, or AWS within your own cloud account. Full GDPR DPA and HIPAA BAA support via enterprise AI providers."

### For Defense / Air-Gapped
> "Coming soon: full air-gapped deployment with local LLM inference via Ollama. Zero external API calls. Runs entirely on your hardware."  
> *(Do not claim this for the current version)*

### For Marketing / General Audience
> "Unlike Glean or Moveworks, your knowledge never lives on our servers. Self-host on any cloud or on-premise. You own your brain."  
> *(Technically accurate — storage sovereignty is real and differentiating)*

---

## Action Items

| Priority | Action | Effort | Impact |
|---|---|---|---|
| **Immediate** | Update marketing copy to clarify "sovereign storage" vs. "sovereign inference" | 1 day | Prevents false claims |
| **Short-term** | Add Azure OpenAI + Vertex AI provider options to model router | 1–2 weeks | Unlocks GDPR/HIPAA market |
| **Short-term** | Replace Unstructured.io API call with self-hosted option for enterprise tier | 2–3 weeks | Removes last third-party data processor |
| **Medium-term** | Add Ollama local LLM provider | 3–4 weeks | Unlocks air-gapped/defense market |
| **Medium-term** | Add local embedding model support (nomic-embed-text) | 1–2 weeks | Closes the embedding data exposure |
| **Long-term** | SOC 2 Type II certification | 3–6 months | Required for Enterprise sales |
| **Long-term** | HIPAA BAA documentation package | 4–8 weeks | Required for healthcare sales |

---

## TL;DR

**"Sovereign" is real and defensible for the storage layer — your data never lives on our servers.**

**"Sovereign" is overstated for the inference layer — queries do reach OpenAI/Anthropic/Google.**

**The fix is straightforward:** Adding Azure OpenAI, Vertex AI, and Ollama providers to the existing model router closes the gap completely and makes the "Sovereign" claim watertight for every industry vertical.

The architecture was designed correctly — the model router abstraction makes adding these providers a configuration-level change, not a rewrite.

---

---

## What's Unique That Nobody Has

No individual feature is unique. Vector search, RAG, multi-LLM routing, OAuth integrations — every competitor has these. What is unique is the **intersection of three properties simultaneously**:

| Property | Glean | Guru | Sana | Hebbia | Corporate Brain |
|---|---|---|---|---|---|
| Sovereign / self-hostable | ❌ | ❌ | Enterprise only | ❌ | ✅ |
| True multi-tenant (MSP model) | ❌ | ✅ | ✅ | ❌ | ✅ |
| Transparent flat pricing | ❌ | ✅ | ⚠️ | ❌ | ✅ |

**No competitor holds all three at once. That corner of the market is empty.**

That combination enables something none of them can do: an MSP or system integrator can deploy Corporate Brain, give every client their own isolated tenant, charge for it under their own brand, and the client's data never leaves their infrastructure. Glean cannot do that. Moveworks cannot do that. Hebbia cannot do that.

### Critical Honesty Check

- "Sovereign" is currently **partial** — data stored locally, AI inference still calls OpenAI/Anthropic. Until Ollama/local LLM support is built (Tier 3 roadmap above), the full sovereignty claim has a gap.
- Multi-tenant architecture is built at the DB level but not yet hardened at the API middleware level.
- "50+ integrations" is currently 4 connectors — this claim needs to be corrected before enterprise sales.

**The uniqueness is real. It needs 2–3 more months of engineering to fully deliver on it.**

---

## Does This App Already Exist in the Market?

**Yes, the category exists. No, the exact product combination does not.**

The market is real ($53B projected by 2030). What exists today:

| Competitor | Valuation | Why Not the Same |
|---|---|---|
| **Glean** | $2.2B | Cloud-only, $30–60/user/seat, enterprise sales only, no MSP multi-tenancy |
| **Moveworks** | $2.1B | Heavy ITSM focus, cloud-only, opaque pricing, no multi-tenant |
| **Hebbia** | ~$800M | Narrow finance/legal vertical, $50–150/user, no self-serve |
| **Guru** | ~$300M | Transparent pricing + MCP, but requires manual curation, no sovereign deployment |
| **Sana** | ~$400M | Closest; has free tier, single-tenant enterprise option — but messy product split, not MSP-architected |
| **Microsoft Copilot / Google Gemini** | Ecosystem play | Locked to their own productivity suites, useless for cross-platform knowledge |
| **Dashworks** | Acquired by HubSpot (2025) | No longer independent, absorbed into HubSpot ecosystem |

**The gap confirmed across 11 competitors:** Nobody targets the "regulated industry + MSP channel + transparent pricing" combination. That is genuinely unoccupied territory.

---

## Why Would Enterprise Use This Over Competitors?

There are three distinct enterprise buyer types and Corporate Brain wins differently with each.

### Buyer Type 1: Regulated Industry (Finance, Healthcare, Government, Defense)

**The argument:**
> "Our data cannot leave our network."

Glean's answer: "Trust us — we're SOC 2 compliant."  
Corporate Brain's answer (post-Tier 3): "It runs in your data center. Nothing leaves."

For a bank under FCA audit, a hospital under HIPAA, or a defense contractor with classified data — this is not a preference, it is a hard requirement. Glean **literally cannot be used** in a classified environment. Corporate Brain can be (once Ollama is built).

**Current blocker:** Compute sovereignty (local LLM) isn't built yet. Data sovereignty (local storage) is. See Tier 3 roadmap above.

---

### Buyer Type 2: Cost-Sensitive Mid-Market (100–2,000 employees)

**The math:**

| Team Size | Glean (est. $30/user/mo) | Corporate Brain Enterprise ($7,999 flat) |
|---|---|---|
| 100 users | $3,000/mo | $7,999/mo ❌ |
| 300 users | $9,000/mo | $7,999/mo ✅ |
| 500 users | $15,000/mo | $7,999/mo ✅ |
| 1,000 users | $30,000/mo | $7,999/mo ✅ |
| 2,000 users | $60,000/mo | $7,999/mo ✅ |

**The crossover happens at ~280 users.** Above that, Corporate Brain is cheaper — increasingly so at scale. For a 500-person company the saving is $84,000/year. A CFO signs that in one meeting.

Per-seat models also create an invisible disincentive: companies buy 100 seats and don't roll out to all 500 employees because the cost scales with adoption. Flat pricing removes that friction entirely.

---

### Buyer Type 3: Managed Service Providers / System Integrators

**The argument:** This buyer has no alternative.

MSPs need to give each of their 20–50 clients a completely isolated AI knowledge environment, white-labeled, without building it from scratch. No competitor is architected for this:

- Glean, Moveworks, Hebbia — single-tenant SaaS, cannot be re-deployed as a multi-client platform
- Guru, Sana — have some multi-tenancy but are not designed for the MSP resale model

Corporate Brain's multi-tenant database architecture (every table FK'd to `tenant_id`) plus per-tenant onboarding, cost tracking, and settings was designed for exactly this use case. This is the **strongest monopoly-adjacent position** in the product today.

---

## The Honest Verdict: Is There a Monopoly?

**No monopoly. Not close yet.**

- Glean has $200M raised, 100+ connectors, 14+ Fortune 500 clients, 5-year head start
- Moveworks has $305M and 10% of Fortune 50

**But there is a defensible beachhead.** The sovereign + multi-tenant + transparent-pricing intersection is genuinely unoccupied. The strategic path:

1. **Own the MSP market first** — no competitor can serve them, zero competition
2. **Own regulated industries second** — once local LLM (Tier 3) is built
3. **Use flat pricing to poach mid-market from Glean** — the math wins above 280 users
4. **Then compete on connector depth and agent capabilities**

**The primary risk:** Glean adds sovereign deployment before Corporate Brain establishes itself. They have the engineering resources. The window is approximately **18–24 months** before the market consolidates around 2–3 dominant platforms.

---

*Document prepared: April 2026*  
*Related: `doc/CORPORATE_BRAIN_STRATEGIC_ANALYSIS.md`, `doc/FEATURES_AUDIT.md`, `doc/BRAND_STORYTELLING_PLAYBOOK.md`*
