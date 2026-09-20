/**
 * Contract tests for legacy-price-approvals.ts — the legacy half of the "is this product
 * purchasable" gate. Same discipline as catalog-resolver-contract-test.ts: derived from the real
 * data, fails loudly if an approval points at a product that no longer exists or carries a price
 * that couldn't be a real THB selling price. Discovered and run by scripts/verify-catalog.ts.
 */
import { LEGACY_APPROVED_PRICING } from "./legacy-price-approvals";
import { allProducts, catalogIncludingHidden } from "@/data/products";
import { getCatalogItem } from "@/lib/catalog-index";

export interface LegacyPricingContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runLegacyPricingContractTests(): LegacyPricingContractResult[] {
  const results: LegacyPricingContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const entries = Object.entries(LEGACY_APPROVED_PRICING);
  // A product hidden from the storefront (`hiddenFromStorefront`, e.g. awaiting a usable photo —
  // owner decision 2026-09-06) is still a real legacy record whose approved price stays valid, so
  // "is this a real product" is checked against the full list; "is the price wired" only against
  // what the storefront actually shows (the catalog index is built from `allProducts`).
  const legacySlugs = new Set(catalogIncludingHidden.map((p) => p.slug));
  const visibleSlugs = new Set(allProducts.map((p) => p.slug));

  const unknownSlugs = entries.filter(([slug]) => !legacySlugs.has(slug)).map(([slug]) => slug);
  check("every approved slug is a real legacy catalog product", unknownSlugs.length === 0, unknownSlugs.length ? `unknown: ${unknownSlugs.join(", ")}` : `${entries.length} entries`);

  const badPrices = entries.filter(([, a]) => !Number.isInteger(a.sellingPrice) || a.sellingPrice <= 0).map(([slug, a]) => `${slug}=${a.sellingPrice}`);
  check("every approved price is a positive integer (THB)", badPrices.length === 0, badPrices.join(", ") || "ok");

  const badDates = entries.filter(([, a]) => !/^\d{4}-\d{2}-\d{2}$/.test(a.lastPriceReview)).map(([slug]) => slug);
  check("every approval carries an ISO review date", badDates.length === 0, badDates.join(", ") || "ok");

  // Prices round 2026-09-21: two bases. A "shipnity" row must name its parent code; an
  // "owner-estimate" row has no parent (null) and its evidence must open with the owner's tag so
  // the placeholder is findable in one grep when the stock API brings the real price.
  const badBasis = entries.filter(([, a]) => a.basis !== "shipnity" && a.basis !== "owner-estimate").map(([slug, a]) => `${slug}=${String(a.basis)}`);
  check('every approval carries a valid basis ("shipnity" | "owner-estimate")', badBasis.length === 0, badBasis.join(", ") || `${entries.filter(([, a]) => a.basis === "shipnity").length} shipnity · ${entries.filter(([, a]) => a.basis === "owner-estimate").length} owner-estimate`);

  const missingEvidence = entries
    .filter(([, a]) => {
      if (a.evidence.trim().length < 20) return true;
      if (a.basis === "shipnity") return !a.shipnityProductId;
      return a.shipnityProductId !== null || !a.evidence.startsWith("owner-estimate 2026-09-21:");
    })
    .map(([slug]) => slug);
  check("every approval cites its Shipnity parent code and a real evidence note (owner-estimate: null parent + tagged evidence)", missingEvidence.length === 0, missingEvidence.join(", ") || "ok");

  const parentCounts = new Map<string, string[]>();
  for (const [slug, a] of entries) {
    if (a.shipnityProductId === null) continue; // owner-estimate rows have no parent to collide on
    parentCounts.set(a.shipnityProductId, [...(parentCounts.get(a.shipnityProductId) ?? []), slug]);
  }
  const dupes = [...parentCounts.entries()].filter(([, slugs]) => slugs.length > 1);
  check(
    "no Shipnity parent group is claimed by two different legacy products (one group = one product)",
    dupes.length === 0,
    dupes.map(([id, slugs]) => `${id}: ${slugs.join(" & ")}`).join("; ") || "ok"
  );

  // The index is the only path the money boundary reads prices through — assert the wiring, not
  // just the table.
  const notWired = entries.filter(([slug, a]) => visibleSlugs.has(slug) && getCatalogItem(slug)?.sellingPrice !== a.sellingPrice).map(([slug]) => slug);
  check("catalog-index exposes exactly the approved price for every visible entry (and nothing else)", notWired.length === 0, notWired.join(", ") || "ok");

  const hiddenButPriced = entries.filter(([slug]) => legacySlugs.has(slug) && !visibleSlugs.has(slug)).map(([slug]) => slug);
  const hiddenLeak = hiddenButPriced.filter((slug) => getCatalogItem(slug) !== undefined);
  check(
    "a hidden legacy product keeps its approval but is absent from the catalog index (not purchasable while hidden)",
    hiddenLeak.length === 0,
    hiddenLeak.length ? `leaked: ${hiddenLeak.join(", ")}` : `${hiddenButPriced.length} hidden-with-approval: ${hiddenButPriced.join(", ") || "none"}`
  );

  const leaked = allProducts.filter((p) => !(p.slug in LEGACY_APPROVED_PRICING) && getCatalogItem(p.slug)?.sellingPrice !== null).map((p) => p.slug);
  check("a legacy product with no approval has no price in the catalog index (browse-only)", leaked.length === 0, leaked.join(", ") || "ok");

  return results;
}

if (require.main === module) {
  const results = runLegacyPricingContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} legacy pricing contract checks passed.`);
}
