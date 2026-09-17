# OKami24 — Project Handoff Checkpoint

**Purpose:** this document is a CURRENT-STATE snapshot for starting a new Claude Code
session on this project. It is not a conversation history or a narrative log — treat it as
a status board. If anything here conflicts with the actual repo (code, git history,
`CLAUDE.md`, `docs/BUSINESS_SOURCE_OF_TRUTH.md`), **the repo wins**; update this file rather
than trusting stale prose.

**Snapshot taken at commit:** `9775dd603fd82f4a0f4ea966240d2107029ee361` (see §1).

---

## 1. Current Baseline

- **Project path:** `C:\Users\dhetc\Claude-Web-Lab-v3`
- **Branch:** `main`
- **Latest commit:** `9775dd603fd82f4a0f4ea966240d2107029ee361` — "feat: validate product
  master against legacy catalog"
- **Working tree:** clean at snapshot time (verified via `git status --short`)
- **Approved frontend baseline:** the live site's visual design and UX are approved and
  unchanged since the OKami24 brand migration (`e7dc0cc`). The site still runs on Next.js 16
  + TypeScript + Tailwind v4, reading product data from the **legacy `Product` type**
  (`src/types/catalog.ts`, 28 hand-authored records under `src/data/products/`) — this is
  still the actual runtime source of truth for every page (see §3).

## 2. Completed Milestones

| Milestone | Commit(s) | Status |
|---|---|---|
| Full NOVA VAPOR demo build (catalog, Finder, Compare, Search, Favorites, Guides, Technology, FAQ, About) | `f29d7fc` … `363ee98` | Approved — visual baseline checkpoint |
| Real-first product imagery (28/28 products, manufacturer photos + `DeviceGlyph` fallback) | `28bb22d` … `c47a9ea` | Complete |
| Production baseline checkpoint | `e8a8514` (empty checkpoint commit) | Approved |
| OKami24 Business Source of Truth authored | `844164e` | Living document, see `docs/BUSINESS_SOURCE_OF_TRUTH.md` |
| **OKami24 Brand Migration** (NOVA VAPOR → OKami24: red logo, `--accent-red` token, global LINE contact widget, copy/metadata) | `e7dc0cc` | Approved — production frontend baseline |
| **Product Master Phase 1** (TypeScript types + Zod schema, additive, not wired to frontend) | `b1f4728` | Approved & committed |
| **Product Master Phase 2 + 2.1** (legacy→ProductMaster adapter, 28/28 reality-test pass; schema calibration — tri-state compatibility verification, `bestFor: string[]`, optional related-product reason/source; contract tests) | `9775dd6` | Approved & committed |
| **Shipnity public research** (read-only, no code) | n/a — findings delivered in-conversation, restated in §4 below | Complete for the public-research scope; account-level check still pending |

## 3. Current Product Master State

**What the schema supports today** (`src/types/product-master.ts` +
`src/data/product-master-schema.ts`, both committed, both additive/unused by frontend):
- Full `ProductMaster` shape: identity (`internalId`/`slug` split), lifecycle vs.
  publication vs. availability as separate concerns, structured
  `ProductOptionDefinition`/`ProductVariant` (not raw `Record<string,string>`), commerce
  identity (`internalSku`, nullable — never fabricated), pricing (independent of
  publication status), 3-tier content provenance (manufacturer facts → editorial → merchant
  knowledge), global `FAQEntry` pool, `CompatibilityLink` with **tri-state**
  `verificationStatus: "verified"|"unverified"|"unknown"` (not a boolean), `RelatedProductLink`
  with **optional** `reason`/`source` (not required — migration must not fabricate
  classification).
- `deriveAvailabilityStatus()` + an enforced invariant in `validateProductMasterRegistry()`:
  if a product has variants, product-level `availability.status` must equal the value
  derived from `variants[].availability` — this is checked, not just documented.
- Known, deliberately-recorded limitation: all 28 legacy products map to `lifecycleStatus:
  "active"` only — `draft`/`coming-soon`/`discontinued`/`archived` are defined but
  unexercised by real data.

**Validation results (last confirmed run, Phase 2.1):**
- **Adapter reality test: 28/28 legacy products pass** Zod + registry validation
  (`registryError: null`).
- **Contract tests: 6/6 pass** (synthetic fixtures covering: valid product with variants;
  invalid `optionCode`; invalid `valueCode`; product/variant availability mismatch;
  dangling `relatedProducts.targetInternalId`; dangling `faqRefs` entry).

**Current authoritative implementation files** (all committed, all under `src/`, none
imported by any frontend file):
- `src/types/product-master.ts` — type definitions
- `src/data/product-master-schema.ts` — Zod schema + `validateProductMasterRegistry()` +
  `deriveAvailabilityStatus()`
- `src/data/product-master-adapter.ts` — pure `mapLegacyProductToMaster()` adapter +
  `runAdapterRealityTest()` (diagnostic only, not run at import time)
- `src/data/product-master-contract-test.ts` — synthetic fixture tests + `runContractTests()`

**Explicitly**: legacy `Product`/`src/data/products/*.ts` remains the only data the live
frontend actually reads. `ProductMaster`, the adapter, and the contract tests exist
side-by-side with zero effect on any rendered page. No frontend file imports anything from
`product-master-*.ts`.

## 4. Shipnity Research — Current Facts

Findings from the read-only public research slice. **Do not summarize this as "Shipnity has
no API."** The correct wording is: **no public documentation has been found yet that
confirms a general-purpose API for a custom Next.js website** — absence of found evidence,
not confirmed absence of capability.

**CONFIRMED (public):**
- Shipnity connects built-in marketplace/chat channels (Shopee, Lazada, TikTok Shop, LINE
  Shopping, Facebook/Instagram, livestream) with real-time, bidirectional stock/order sync
  — this is a built-in feature of those specific integrations, not a general API.
- Shipnity connects to **WordPress/WooCommerce** via WooCommerce's own REST API v2 webhook
  mechanism: WooCommerce pushes orders to a Shipnity delivery URL (`Topic: Order Created`,
  authenticated with WooCommerce's own Consumer Key/Secret); Shipnity pushes stock back to
  WooCommerce, **requiring exact product-code matching between the two systems**.
- Shopify is mentioned as a connectable channel (no technical detail found).
- `developer-docs.shipnity.com` exists and documents a **Vue.js component library**
  (`<snt-app>`, `<snt-all-products>`, `<snt-cart>`, `<snt-orders>`, etc.) for building a
  storefront **hosted by/through Shipnity itself** — this is a website-builder surface, not
  a data API for an externally-hosted Next.js site.
- Shipnity has a built-in multi-user/role-based permission system (owner adds staff,
  assigns role-based access, can scope access per warehouse).

**UNKNOWN:**
- Whether Shipnity exposes a general-purpose REST API/webhook usable by a custom
  (non-WordPress/Shopify) website like this one.
- No Zapier/Make.com/n8n connector was found in public search, which is weak negative
  evidence, not confirmation.
- Tracking/shipment-status sync mechanism (no dedicated public documentation found).
- Whether API access is gated behind a specific pricing tier.

**REQUIRES OWNER ACCOUNT:**
- Whether an API Key / Developer settings menu exists inside the logged-in Shipnity
  dashboard.
- The real product-code/SKU structure Shipnity actually uses (needed to design the
  `ProductMaster.commerce.internalSku` ↔ Shipnity mapping correctly).
- Actual webhook/export/import capabilities available on the account's current plan.
- Rate limits, auth model, and payload shape if an API does exist.

## 5. Next Objective — Shipnity Owner Account Capability Check

The next planned step (not started, not authorized to start in this session) is for the
**owner** to log into their own Shipnity account and check:
- API / Developer settings availability
- Webhook capability (creation, direction, payload format)
- Existing integrations already configured
- Import/export capability (formats, scope)
- Product code / SKU structure actually in use
- Stock sync behavior in practice
- Order creation/integration options
- Tracking integration options
- Any plan-tier limitations that affect the above

**Constraint:** the owner performs this login themselves. Claude must never request, handle,
or store Shipnity credentials.

## 6. Decisions That Must Wait

The following must **not** be decided until the Shipnity Owner Account Capability Check
(§5) is complete:
- Final `ProductMaster` ↔ Shipnity field mapping
- Backend architecture
- Admin architecture
- Persistent storage choice
- Stock synchronization mechanism
- Order automation mechanism

## 7. Deferred Backlog

Recorded, not scheduled, no target session:
- Product Detail depth upgrade (richer `editorialContent`/`merchantContent` surfaced on the
  product page)
- OKami24 logo redesign exploration
- Media Asset Governance implementation (see §8 — currently a recorded constraint only)
- Compare logic extraction (`classificationRows`/`verifiedSpecRows` out of `CompareTool.tsx`
  into `src/lib/compare.ts`) — identified as low-risk/independent during Phase 3 planning,
  explicitly deferred rather than run in parallel with Shipnity research
- `ProductPicker`/`searchProducts()` search consolidation (confirmed duplicate/divergent
  search implementations — fixing this changes matching behavior, so it needs its own
  separately-approved slice, not bundled into a refactor)
- Frontend `ProductMaster`/read-model migration — Phase 3 planning concluded that most
  current consumers (Catalog/ProductCard, Product Detail, Finder, Favorites, SEO/JSON-LD,
  Related/Compatibility) should **stay on legacy `Product` as-is** for now; building
  selectors against `ProductMaster`'s still-placeholder data was judged premature
  (see the Phase 3 section of the plan file referenced in git history / prior session, or
  re-derive from current code — this file does not restate that analysis in full)

## 8. Media Governance Constraint

The owner cannot provide self-shot product photography. Sourcing priority for any future
real-catalog product imagery:
1. Official manufacturer assets, where usage rights support it
2. Authorized distributor/supplier assets
3. A clearly non-photoreal branded fallback (the existing `DeviceGlyph` pattern is the
   established example) — **not** a fabricated exact product photo

**Unknown-rights retailer/web imagery must never become production product imagery by
default.** Before any real-catalog publication, asset governance needs to track source,
provenance, and rights basis per asset — not just the existing `role`/`kind` fields on
`ProductAsset`. Not implemented yet; recorded as a future requirement only.

## 9. Do Not Change Without New Approval

- The approved OKami24 visual baseline (design, layout, brand tokens)
- The legacy 28 product records (`src/data/products/*.ts`, `src/types/catalog.ts`)
- The `ProductMaster` schema (`src/types/product-master.ts`,
  `src/data/product-master-schema.ts`)
- The current runtime frontend architecture (legacy `Product` remains the live data source)

## 10. Session Start Procedure

A new Claude Code session picking this project up should, in order:
1. Read the global `CLAUDE.md` (user-level working preferences).
2. Read the project `CLAUDE.md` (this repo's business-context pointer + conflict-resolution
   order).
3. Read `docs/BUSINESS_SOURCE_OF_TRUTH.md` (authoritative brand/business rules).
4. Read this file, `docs/PROJECT_HANDOFF.md`.
5. Inspect actual current state: `git status`, `git log`, and the current code — **treat
   the repository (code + git history) as ground truth over any stale conversational
   history**, including anything summarized in this handoff document if it turns out to
   disagree with what the repo actually shows.
