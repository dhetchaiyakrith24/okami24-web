/**
 * OKami24 — Publication pipeline: the ONLY place a ProductMaster candidate can become
 * genuinely customer-visible in production.
 *
 * This is deliberately the single, small, auditable source of truth for "has this specific
 * product's final selling price been approved for real publication." An entry here is the real,
 * approved price and when it was set. No entry means "not approved" — the only state this file
 * can express is explicit approval, never a partial/pending one (that's what DEV preview via
 * `PREVIEW_SHIPNITY_IDS` in storefront-preview-read-model.ts already is).
 *
 * PRICING RULE (updated 2026-09-01): a normal, unambiguous current price already present in
 * authoritative project/Shipnity data (`operationalSellingPrice` in active-catalog-source.ts) IS
 * a valid final selling price and does not require a separate manual sign-off round — copied here
 * deliberately, with the evidence cited in each entry's comment, not silently defaulted. Price
 * approval is still withheld (left as a genuine blocker, not auto-filled) whenever the data
 * conflicts internally, multiple authoritative prices disagree, the price is missing/ambiguous, or
 * the owner explicitly overrides it — see each entry's comment for which case applies.
 *
 * `active-catalog-to-product-master.ts` reads this to set `publicationStatus`/`pricing` on the
 * real candidate — never the reverse; nothing here ever mutates the seed data. Downstream,
 * `buildPublishedCatalog()` (storefront-preview-read-model.ts) re-validates every "published"
 * candidate against the full readiness rule set (identity, content, media, price — see
 * `validateProductMasterRegistry`) before it can appear anywhere, so an entry here is necessary
 * but not sufficient on its own: a genuinely incomplete product added here would fail loudly
 * (a thrown error, not a silent leak) rather than publish anyway.
 *
 * Adding a real entry here is the actual, literal act of approving a product for publication;
 * treat it with the same care as editing `docs/BUSINESS_SOURCE_OF_TRUTH.md`.
 */

export interface PublicationApproval {
  /** The approved final selling price — either an explicit owner override, or (per the pricing
   *  rule above) copied from a normal, unambiguous `priceReference` when there's no conflict.
   *  This IS the price a customer would pay. */
  sellingPrice: number;
  /** ISO date this price was reviewed/approved. Required alongside the price itself so a stale
   *  approval is at least visible in the data, even though nothing currently expires it. */
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
  // Published under the updated pricing rule (2026-09-01): a single, unambiguous
  // operationalSellingPrice in active-catalog-source.ts, no conflicting price found anywhere else
  // in the project. Media/spec/identity/content readiness already verified — see the
  // publication-pipeline memory and TAXONOMY_MATCHES/VERIFIED_MEDIA/VERIFIED_SPECIFICATIONS
  // entries in active-catalog-to-product-master.ts.
  "Coil-74": { sellingPrice: 250, lastPriceReview: "2026-09-01" },
  "Coil-89": { sellingPrice: 350, lastPriceReview: "2026-09-01" },
  // Same pricing rule, same-session second wave: real tier-2 media closed the last gap (see
  // VERIFIED_MEDIA["Coil-38"]). Single unambiguous operationalSellingPrice, applies uniformly to
  // both real children (DM2 0.2Ω, DM4 0.3Ω) — Shipnity gives one price per parent, not per
  // variant, same as every other published product here.
  "Coil-38": { sellingPrice: 450, lastPriceReview: "2026-09-01" },
  // Same pricing rule, third wave: real tier-2 media closed the gap (see VERIFIED_MEDIA["Coil-92"]
  // — the resistance/wattage is etched directly on the photographed coil, no variant ambiguity).
  // Single unambiguous operationalSellingPrice.
  "Coil-92": { sellingPrice: 130, lastPriceReview: "2026-09-01" },
};

export function getPublicationApproval(shipnityProductId: string): PublicationApproval | undefined {
  return OWNER_APPROVED_PUBLICATION[shipnityProductId];
}
