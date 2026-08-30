# Shipnity Active Catalog Seed (Phase 2.4)

Machine-readable seed dataset transcribed from the Shipnity owner-account "มีของ"
(`have_stock=true`) view — all 8 pages, captured by the owner. This is **not** the
`ProductMaster` runtime, **not** imported by any frontend/app code, and **not** imported by
`product-master.ts` / `product-master-schema.ts` / `product-master-adapter.ts`. It exists purely
as a prepared input for whatever catalog-migration phase is approved later.

## Files

- `active-catalog-source.ts` — raw transcription layer. Every `shipnityProductId` /
  `shipnityVariantId` / `name` / `operationalSellingPrice` / `operationalCost` / `rawLabel` is a
  literal, verbatim reading of the UI. Nothing here is inferred.
- `classify.ts` — pure derivation: splits each raw label into a semantic option value +
  packaging/unit-of-sale note, and tags a candidate `optionType` with a `provenance` level. Never
  mutates the raw layer.
- `build-active-catalog.ts` — joins the two into `activeCatalogSeed: ActiveParentRecord[]`, the
  actual seed artifact.
- `validate-active-catalog.ts` — structural checks (`runActiveCatalogSeedValidation()`). No test
  framework; run via a throwaway `npx tsx` script, same convention as
  `product-master-contract-test.ts`.

## Three distinct facts per child (kept separate, not merged into one score)

1. **`rawLabel`** (source layer) — always a literal UI transcription. Never has its own
   provenance field because it is constant: 100% confirmed-ui by construction.
2. **`optionType` + `optionTypeProvenance`** — WHAT semantic axis this child represents.
   - `confirmed-owner` — the owner confirmed this axis for the **whole parent group** in the
     Phase 2.2/2.4 conversation (`Pod-173`→color, `coil-62`→color, `Eliquid-66`→flavor,
     `coil-78`→resistance — the last has no active child in this snapshot, kept for
     documentation continuity). This is a group-level fact: it applies to every child under that
     parent, and is **never downgraded** just because one child's text also happens to match an
     unrelated keyword (e.g. `Pod-173-5` "Lemon Mint" is `color`/`confirmed-owner`, not
     `flavor`/`inferred`, even though "mint" is in the flavor keyword list).
   - `inferred` — a keyword heuristic detected a semantic marker (color/flavor/resistance/size/
     strength word, Ω symbol, `ml`, `mg`) in the label, with no owner confirmation.
   - `unresolved` — no semantic marker found at all.
3. **`childRole`** — WHETHER this child is a product-variant option in the first place,
   independent of `optionType`. A Shipnity child code does not always mean a `ProductVariant`:
   - `variant` — a real option (whenever `optionType` is resolved, i.e. not `unresolved`).
   - `accessory-component` — a spare part/component, not a product option (e.g. `Pod-154-19`
     "ฐานแบตเตอรี่" — a battery base/stand, not a flavor).
   - `sell-unit` — packaging/unit-of-sale text only, with no differentiating value at all after
     packaging vocabulary is stripped (e.g. `Coil-55-1` "1 กล่อง / มี 2ตัว").
   - `unresolved` — a real, differentiating label survives but its type can't be determined
     (e.g. `IQOSHEET-15-8` "Dimension Apricity / 1 ซอง" — clearly names something distinct, but
     not classifiable as color/flavor/etc. from text alone).

  `childRole` describes how **OKami24 interprets** the Shipnity child — it is not a claim about
  Shipnity's own internal database type.

## Why classification is NOT copied from the Phase 2.2 Excel analysis

Phase 2.2 classified all 98 historical groups from `Data_31-08-2026.xlsx`. That group-level
verdict is **not** reused here, because the active ("มีของ") view frequently shows a *different
subset* of children than the historical Excel export did — e.g. `Coil-21` historically had
resistance-bearing children (`1.2Ω/ยกกล่อง`, `Top Fill 0.4Ω...`), but its only *active* child
today is `"Argus mix (coil เวอร์ชั่นใหม่)"`, which carries no resistance marker at all. Carrying
forward the old group-level confidence would silently launder a historical inference onto data it
was never actually derived from. Every record in this seed is (re)classified from exactly the
labels currently active.

## Cost handling

`operationalCost` is transcribed because it is real, confirmed internal business data (per the
Phase 2.2 owner clarification — the earlier Excel-report cost values were unreliable, but the
Shipnity UI's own cost figures are not). It exists in this seed as **internal evidence only**. It
is intentionally absent from `ProductMaster` (see that schema's file header:
"Supplier cost is intentionally NOT a field here") and must never be surfaced customer-facing.

## Excel cross-check (evidence priority #2)

`Data_31-08-2026.xlsx` was used once, ad hoc, during Phase 2.4 authoring to sanity-check this
seed against the historical export (parent/child codes exist there, and none of the actively-
captured children match a historical `remaining <= 0` row). That check is **not** wired into
`validate-active-catalog.ts` as a standing/automated step — the `xlsx` package was not added as a
project dependency for it, since the Excel snapshot itself goes stale and re-running it
automatically on every check would imply a freshness guarantee this seed doesn't have. Re-run it
manually against a fresh export if/when this seed is revisited.

## Deliberately excluded

Two rows appeared in the "มีของ" view that are not real catalog products:
`Close` / `ยิงปิด` (operational marker) and `test` / `test product` (literal test fixture).
Recorded in `excludedNonProductRows`, not silently dropped, and checked for accidental leakage by
`validate-active-catalog.ts`.

## Non-contiguous child suffixes are expected

The "มีของ" filter hides any child SKU currently out of stock, so a parent's active children are
often non-contiguous (e.g. `Pod-179` shows `-1,-2,-4,-5,-6` — no `-3`). This is not a
transcription gap; no missing suffix was invented to fill it.
