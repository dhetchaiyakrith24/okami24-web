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
  // Same pricing rule, fourth wave: real tier-2 media closed the gap (see
  // VERIFIED_MEDIA["Coil-55"] — the retail box explicitly reads "CALIBURN G2 Empty Cartridge" /
  // "2 PCS", matching this record's real identity and child count exactly). Single unambiguous
  // operationalSellingPrice.
  "Coil-55": { sellingPrice: 299, lastPriceReview: "2026-09-01" },
  // Same pricing rule, fifth wave: real tier-2 media closed the gap AND resolved the resistance-
  // identity conflict in the same source (see VERIFIED_MEDIA["Coil-53"] / TAXONOMY_MATCHES["Coil-53"]
  // — the retail box explicitly reads "1 Ω", and myuwell.com's own Caliburn G2 page confirms 1.0Ω
  // as a real, G2-compatible UWELL coil resistance). Single unambiguous operationalSellingPrice.
  "Coil-53": { sellingPrice: 550, lastPriceReview: "2026-09-01" },
  // Full-catalog mission (2026-09-02): second media wave closed the gap for 7 more taxonomy-
  // resolved candidates (see VERIFIED_MEDIA entries in active-catalog-to-product-master.ts).
  // Same pricing rule throughout: single, unambiguous operationalSellingPrice, no conflicting
  // price found anywhere else in the project.
  "Coil-68": { sellingPrice: 300, lastPriceReview: "2026-09-02" },
  "Coil-63": { sellingPrice: 350, lastPriceReview: "2026-09-02" },
  "Coil-1": { sellingPrice: 130, lastPriceReview: "2026-09-02" },
  "Coil-72": { sellingPrice: 350, lastPriceReview: "2026-09-02" },
  "Coil-94": { sellingPrice: 450, lastPriceReview: "2026-09-02" },
  "Pod-159": { sellingPrice: 549, lastPriceReview: "2026-09-02" },
  "coil-54": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  // Heated-tobacco wave — same pricing rule, same full readiness (identity/brand/category/media/
  // price all real and cited — see TAXONOMY_MATCHES/VERIFIED_MEDIA/VERIFIED_SPECIFICATIONS
  // entries). IQOSHEET-17 ("Iqos iluma one") is DELIBERATELY EXCLUDED from this table — not a
  // business-scope hesitation (that question is settled), but a genuine, specific data conflict:
  // its 2 active children (Pebble Grey / Breeze Blue) are two different real hardware generations
  // with different real specs, incorrectly conflated under one Shipnity parent. Publishing it would
  // mean shipping one card image/spec sheet that is factually wrong for whichever child a customer
  // didn't get — the same "never misrepresent a variant" rule this whole file already enforces
  // everywhere else. Needs either a Shipnity-side split into two real parents, or owner
  // clarification on which generation is actually stocked, before this can honestly publish.
  //
  // Catalog-intelligence mission (2026-09-02) re-confirmed the block with much stronger evidence
  // (see TAXONOMY_MATCHES["IQOSHEET-17"]'s comment: distinct PMI SKU codes, negative-control 404s
  // across 5 markets, visibly different chassis) and ALSO found the PRICING RULE ITSELF cannot
  // responsibly apply here, independent of the identity conflict: this file's rule auto-approves
  // "a normal, unambiguous current price" — but a single ฿2900 covering what real-world evidence
  // shows are TWO DIFFERENTLY-PRICED products (ILUMA i ONE retails above the original ILUMA ONE at
  // every market checked) is not an unambiguous price for either one specifically; approving ฿2900
  // for whichever generation turns out to be correct would be a guess dressed as a citation. This
  // is exactly the "ambiguous ... price" carve-out in this file's own header comment, not an
  // oversight. Splitting this into two real ProductMaster records would also require the
  // projection pipeline (`active-catalog-to-product-master.ts`) to support one Shipnity parent
  // producing more than one candidate, which it deliberately does not today (see that file's
  // 1-parent-to-1-candidate `projectParent`) — building that capability for one blocked SKU would
  // be disproportionate engineering for a record that is blocked on genuine business/physical-
  // stock facts anyway, not on missing code.
  //
  // OWNER DECISION NEEDED, precisely: (1) confirm which physical generation is actually in stock
  // for "Pebble Grey" and "Breeze Blue" — note "Pebble Grey" itself is ambiguous between the
  // original ILUMA ONE (SKU G0000592) and a later "ILUMA ONE Refreshed" (SKU G0001811), both sold
  // in that color; (2) provide the real, separate selling price for whichever generation(s) are
  // actually stocked — Shipnity's single ฿2900 cannot be trusted to apply to either specifically.
  // No official IQOS Thailand storefront exists to resolve this independently (th.iqos.com does
  // not resolve; iqos.com/th/* 404s) — this is not resolvable by further web research.
  // Catalog-intelligence mission (2026-09-02) — fourth media wave. Same pricing rule throughout:
  // a single, unambiguous `operationalSellingPrice` in active-catalog-source.ts with no conflicting
  // price anywhere else in the project. What changed for each of these is MEDIA plus, in three
  // cases, a real identity/taxonomy correction — see the TAXONOMY_MATCHES / VERIFIED_MEDIA /
  // VERIFIED_SPECIFICATIONS comments for the citation trail:
  //   Coil-70  — dotmod dotCoil 0.7Ω; confirmed a genuine BARE COIL (5 blister-packed brass heads
  //              visible), resistance + wattage printed on the box in frame.
  //   Coil-83  — reclassified coil -> EMPTY POD CARTRIDGE; box reads "ARGUS POD / Empty Cartridge /
  //              2pcs / 2.0mL", an exact match to the "1 box of 2 heads" child.
  //   Coil-87  — the long-standing Black-vs-Gunmetal ambiguity resolved: both are real VOOPOO
  //              colorways, and "BLACK" is printed on VOOPOO's own box in the sourced photo.
  //   Pod-169  — INFY Plus 2.5ml; first-party brand media and a first-party capacity spec, closing
  //              a blocker that two earlier sessions had recorded as a dead end.
  "Coil-70": { sellingPrice: 390, lastPriceReview: "2026-09-02" },
  "Coil-83": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  "Coil-87": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  "Pod-169": { sellingPrice: 129, lastPriceReview: "2026-09-02" },
  "IQOSHEET-14": { sellingPrice: 2390, lastPriceReview: "2026-09-02" },
  // IQOSHEET-15 (IQOS TEREA) — WITHDRAWN from publication (owner quality review, 2026-09-03,
  // Sections 6/7). Was approved above at ฿220 as of 2026-09-02; the owner's screenshot-based
  // review does not approve the current TEREA presentation and asked for it to come down "for
  // now, until a future review approves it again." Re-evaluating against the new visual/truth
  // standard (Section 7) confirms real coherence gaps behind that call: only 11 of this parent's
  // 16 real active flavor children have an exact official photo (the other 5 fall back to a
  // neutral placeholder), so the published flavor family is not yet uniformly backed by real
  // per-flavor media — an inconsistent set, not a complete one, even though every flavor name
  // itself is a verified real TEREA flavor. Removing this entry (rather than deleting any TEREA
  // data) is the actual, literal unpublish action per this file's own contract — every other
  // TEREA data/media/copy asset is left in place so a future pass can re-approve without
  // rebuilding. See docs/BUSINESS_SOURCE_OF_TRUTH.md if this withdrawal should also be reflected
  // there.
  "IQOSHEET-16": { sellingPrice: 4900, lastPriceReview: "2026-09-02" },
  "IQOSHEET-18": { sellingPrice: 3900, lastPriceReview: "2026-09-02" },
  // Tier-1 disposable growth mission (2026-09-03): Pod-180 (Nexbar Clear 18k, WOTOFO) was the last
  // media-blocked candidate from a real Shipnity price+flavor set — see VERIFIED_MEDIA["Pod-180"]
  // for the sourcing. Same pricing rule as every entry above: single, unambiguous
  // operationalSellingPrice, no conflicting price found anywhere else in the project.
  "Pod-180": { sellingPrice: 359, lastPriceReview: "2026-09-03" },
};

export function getPublicationApproval(shipnityProductId: string): PublicationApproval | undefined {
  return OWNER_APPROVED_PUBLICATION[shipnityProductId];
}
