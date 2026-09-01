/**
 * OKami24 — Publication pipeline: the ONLY place a ProductMaster candidate can become
 * genuinely customer-visible in production.
 *
 * This is deliberately the single, small, auditable source of truth for "has the owner approved
 * this specific product for real publication" — a real business decision, never inferred,
 * defaulted, or copied from `priceReference`. An entry here is the owner's own record: the final
 * selling price they approved and when they reviewed it. No entry means "not approved" — the
 * only state this file can express is explicit approval, never a partial/pending one (that's what
 * DEV preview via `PREVIEW_SHIPNITY_IDS` in storefront-preview-read-model.ts already is).
 *
 * `active-catalog-to-product-master.ts` reads this to set `publicationStatus`/`pricing` on the
 * real candidate — never the reverse; nothing here ever mutates the seed data. Downstream,
 * `buildPublishedCatalog()` (storefront-preview-read-model.ts) re-validates every "published"
 * candidate against the full readiness rule set (identity, content, media, price — see
 * `validateProductMasterRegistry`) before it can appear anywhere, so an entry here is necessary
 * but not sufficient on its own: a genuinely incomplete product added here would fail loudly
 * (a thrown error, not a silent leak) rather than publish anyway.
 *
 * Deliberately EMPTY right now — no real ProductMaster product has genuine owner price approval
 * yet (see the production-readiness audit report). Adding a real entry here is the actual,
 * literal act of approving a product for publication; treat it with the same care as editing
 * `docs/BUSINESS_SOURCE_OF_TRUTH.md`.
 */

export interface PublicationApproval {
  /** The owner-approved final selling price — never copied from `priceReference` (the Shipnity/
   *  vapenow reference value). This IS the price a customer would pay. */
  sellingPrice: number;
  /** ISO date the owner reviewed/approved this price. Required alongside the price itself so a
   *  stale approval is at least visible in the data, even though nothing currently expires it. */
  lastPriceReview: string;
}

export const OWNER_APPROVED_PUBLICATION: Record<string, PublicationApproval> = {
  // First real publication approval (2026-09-01). Owner approved Coil-56-1/56-2/56-3 at ฿300
  // each; the current active (have_stock=true) seed has only ONE in-stock child, Coil-56-3
  // (Silver) — see active-catalog-source.ts. Pricing is a product-level field here (variants only
  // carry an OPTIONAL pricingOverride), so this single entry correctly represents the owner's
  // approval regardless of how many of the three named children are currently in stock. Coil-56-1
  // and Coil-56-2 are NOT fabricated as variants — they simply are not in the current evidence;
  // see the publication-pipeline memory / final mission report for the flagged discrepancy.
  "Coil-56": { sellingPrice: 300, lastPriceReview: "2026-09-01" },
};

export function getPublicationApproval(shipnityProductId: string): PublicationApproval | undefined {
  return OWNER_APPROVED_PUBLICATION[shipnityProductId];
}
