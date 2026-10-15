---
name: catalog-research
description: Research a Shipnity/ProductMaster catalog product's real identity, taxonomy, specs, compatibility, and media provenance with OKami24's evidence discipline — duplicate checks against legacy/ProductMaster, evidence tiers, multi-source corroboration, exact-variant media verification, and rejection rules for watermarked/AI-generated/wrong-variant imagery. Use when asked to research, identify, verify, or source media for a Shipnity product (Coil-/Pod-/Disposable-/Eliquid-/IQOSHEET- id), resolve a brand/taxonomy question, or investigate why a candidate is blocked from publication. Also use to scaffold a well-formed research subagent dispatch for parallel/batch work.
---

# Catalog Research

Operationalizes the identity/media research workflow this project's catalog work runs on. This
is a **procedure**, not a source of business truth — for business rules read
`docs/BUSINESS_SOURCE_OF_TRUTH.md`; for the durable *why* behind each rule below (real examples,
prior mistakes, the exact patterns that motivated them) read
the catalog-method file (path: HANDOFF §17 "src files the skills use" [catalog-method]). Follow that
doc's evidence-tier and rejection rules exactly — this Skill just sequences the steps and gives a
consistent output format so research doesn't have to be re-derived from scratch each time.

## When this applies

- Given a Shipnity id (`Coil-38`, `Pod-159`, `IQOSHEET-16`, etc.) with unclear brand/taxonomy.
- Asked to source production-quality media for a product that's identity-resolved but
  media-blocked.
- Asked why a candidate isn't published, or to re-attempt a previously-deferred one.
- Asked to do a batch/parallel research pass across several products.

## Step 1 — Duplicate check FIRST, before researching identity in depth

Cheapest, highest-value check, always do it before spending research effort:

grep the legacy product files (path: HANDOFF §17 "src files the skills use" [legacy-products]) for
`id: "<likely-slug>` and `<family>-`.

Also check `TAXONOMY_MATCHES` in the taxonomy file (HANDOFF §17 [taxonomy]) for
an existing `exactLegacyMatch` or prior resolution for this exact id. A real product that already
exists under the legacy catalog or an existing `ProductMaster` record is a dedup/merge case, not
new research — don't re-derive identity for something already resolved.

## Step 2 — Identity research, evidence tiers in order

1. Official first-party manufacturer source.
2. Authorized distributor with clearly manufacturer-supplied imagery.
3. Retailer, only when identity/variant evidence is independently strong (exact spec printed on
   packaging, exact quantity/puff-count match, a retailer's own variant→image JSON mapping).
4. Multi-retailer convergence (5-10+ independent sellers) — real evidence the product/brand
   exists, but NOT sufficient alone to fabricate a `Brand` record's tagline/description/
   referenceUrl. Report as "real, brand identity still unresolved," don't force it.

Tiers 3–4 may corroborate identity, variants and image provenance only — they are never the source of a
sentence shown on the site; a product fact on the site comes from the manufacturer (owner ruling 2026-09-26,
round "cloud" — the rule and its named exceptions: `docs/THAI_STYLE.md` §5 "ขยายเป็นทุกที่บนเว็บ").

Watch for the "หัว(เปล่า) doesn't reliably mean bare coil" pattern ([catalog-method] in HANDOFF §17 — "src files the skills use") —
check what the *children* actually differentiate by (resistance = likely a coil; color/flavor =
likely a pod/cartridge/prefilled product) rather than trusting the Shipnity name or id prefix.

**Never resolve an identity or generation question by assumption.** If two candidates could be
the same product or could be genuinely distinct, or if color/spec data conflicts across sources,
say so explicitly and leave it unresolved rather than picking a side without evidence.

## Step 3 — Specification verification

Only cite discrete, individually-sourced facts (resistance, wattage, capacity, battery,
compatible devices) — never copy manufacturer marketing paragraphs wholesale. Every fact needs
its own `sourceUrl`. If a spec can't be confirmed, leave it absent — "unknown" beats a guess,
every time.

## Getting a maker fact onto the site (a fact a customer will read)

The order below is the one that produced facts that passed the checker in the data rounds. What counts as an
acceptable source for a customer-read fact is NOT decided here: the owner's data-round rulings live in
`docs/HANDOFF.md` §18 (permanent owner rulings — "Product facts (data rounds 24–25/09, 30/09)") and the code gate
is the spec-row gate (files: HANDOFF §17 "src files the skills use" [spec-gate]) (a row is shown only when it is
`sourceStatus: "verified"`). Wording rules for the sentence that carries the fact: skill `thai-check`.

1. **The main agent opens the maker's page in the in-app browser itself** and reads the text (page text / page HTML)
   or the maker's own spec image — the case `.claude/TEAM_RULES.md` 13.2 allows when an agent cannot do the job (the
   researcher and checker have no browser); say so in one line of report item 3. Their job here is to propose URLs
   and to re-read what the main agent quotes. **Computer only** — a cloud chat has no in-app browser and its Chromium
   cannot open HTTPS sites (`docs/CLOUD.md` table 1): there, read the page text with `curl` / WebFetch; unreadable =
   `[ยังไม่มีข้อมูล]`, never a guess.
2. **The researcher proposes links** (maker product page, maker spec image, maker manual) — read-only, in its own
   report format (`.claude/agents/researcher.md`). A retailer or review link is a lead to find the maker's page.
3. **A manual hosted by a third party:** record which model it shows (title, model name/number, picture) next to
   the quote. Whether such a copy may back a customer-read fact is not decided here — HANDOFF §18 rulings /
   `docs/THAI_STYLE.md` §5.
4. **The maker contradicts itself, or several parts carry numbers:**
   - search the whole page HTML for the number and record the hit count (a number the site shows that the maker page
     no longer carries = a "0 hits" finding, which is evidence too);
   - prefer the product's own spec block over a shared/marketing block that repeats another model's text; say so;
   - a product made of parts (charger + holder, kit + pod) → every number names its part; never a bare number that
     reads as the whole device's;
   - no usable maker source, or two answers left → what happens is in the HANDOFF §18 rulings; when to stop and ask
     is `.claude/TEAM_RULES.md` 13.3 — this skill adds neither.
5. **Write the evidence down before touching data:** `_incoming/<round>/sources-verified.md` — per product: the URL,
   the exact quote, where on the page it sits, the negative findings ("no X anywhere on …"), and which row it backs.
   The data change then carries the row's `sourceUrl` and `sourceStatus`, and the contract test must pass.

## Step 4 — Media sourcing and rejection checklist

Source real photos, then reject anything that fails ANY of:

- [ ] Is this someone else's AI-generated image? Check embedded XMP/metadata for AI-generation tags before
      trusting an official-looking CDN image — reject it. (OKami24's own AI remake of a real photo, when no
      usable real photo exists, is a separate route with its own checks: `docs/IMAGE_SPEC.md` §0 item 7, the
      one place for AI images — owner 2026-09-28.)
- [ ] Is this watermarked? If yes: is there a watermark-free region of the SAME real photo to
      crop to (`extractThenTrim()` in `scripts/product-image.ts`)? If not, reject it as a source —
      a remake only through IMAGE_SPEC §0 item 7.
- [ ] Does it show the EXACT variant (resistance/color/flavor) being verified, not a generic
      group shot or a different variant of the same product line?
- [ ] Is it a genuine product photo, not a marketing banner/lifestyle scene with decorative text
      overlays?
- [ ] Is the resolution actually usable? Run it through `checkQuality()` /
      `npx tsx scripts/product-image.ts info <file>` before committing to it — don't eyeball
      dimensions.

Efficient techniques (full writeup = [catalog-method], HANDOFF §17): a variant-specific product page's own
`og:image` meta tag; Shopify/WooCommerce `variants` JSON blobs embedded in raw HTML mapping each
option to its own image URL; `curl` as a fallback when a domain blocks automated content-reading;
CDN size-suffix/query-param variants (`_w1728`, `?wid=800`) for a larger source than the default
thumbnail.

**Provenance wording** (mandatory, not optional): `sourceName` states what the source actually is
— `"X (vape retailer)"`, never `"X (official)"` unless it genuinely is the brand's own site. If a
retailer's page merely *claims* manufacturer-supplied photography, cite that as the retailer's own
unverified claim, don't launder it into a stronger claim than the evidence supports.

## Step 5 — Report findings, don't silently decide

Findings go back to whoever's making the catalog-data change (this session, or the dispatching
session if run as a subagent) in this shape, one entry per product:

```
<Shipnity id> — <resolved identity or "unresolved">
  Taxonomy: brand / category / systemType, with evidence + citation
  Specs: cited facts only, or "none found"
  Media: candidate URL(s), tier, why it does/doesn't pass the rejection checklist
  Flags: anything ambiguous, conflicting, or needing a business/owner decision
```

Never edit `TAXONOMY_MATCHES` / `VERIFIED_MEDIA` / the publication approvals (HANDOFF §17 [approvals]) directly from within
research — that's a data-authoring step for whoever reviews the findings, keeping evidence-
gathering and catalog-authoring as separate, reviewable steps (this is also why the mission that
produced this Skill ran research as read-only subagents, then applied their findings by hand).

## Scaffolding a research subagent (for parallel/batch work)

When researching several products at once, dispatch parallel background `researcher` agents (the
read-only research role in `.claude/TEAM_RULES.md` 13.2 — never `general-purpose`)
rather than doing it serially. Each agent's prompt should be self-contained and include:

1. The exact Shipnity id(s), names, prices, and active children (copy straight from
   the active catalog source (HANDOFF §17 [active-catalog]) — the agent has no other way to see this).
2. "This is RESEARCH ONLY — do not edit files" stated explicitly (the researcher agent has no edit tools anyway).
3. The evidence tiers and rejection checklist from Steps 2 and 4 above, inlined (the agent starts
   with no context and won't have read this Skill).
4. Any prior-session dead ends already known for this product, so the agent tries a genuinely
   different angle instead of repeating a known-failed search.
5. The exact report shape from Step 5.
6. A response length cap (this project's research passes capped individual reports at
   1200-1800 words to keep synthesis practical).
7. "Never open a PDF or a local file through a browser window — if it cannot be read another way,
   write `[ยังไม่มีข้อมูล]` for that item and move on" (owner ruling 2026-09-26, round "cloud": a
   browser-opened PDF once stalled a round for 146 minutes). This binds the main agent too.

