/**
 * Contract tests for legacy-price-approvals.ts — the legacy half of the "is this product
 * purchasable" gate. Same discipline as catalog-resolver-contract-test.ts: derived from the real
 * data, fails loudly if an approval points at a product that no longer exists or carries a price
 * that couldn't be a real THB selling price. Discovered and run by scripts/verify-catalog.ts.
 */
import { LEGACY_APPROVED_PRICING } from "./legacy-price-approvals";
import { allProducts } from "@/data/products";
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
  const legacySlugs = new Set(allProducts.map((p) => p.slug));

  const unknownSlugs = entries.filter(([slug]) => !legacySlugs.has(slug)).map(([slug]) => slug);
  check("every approved slug is a real legacy catalog product", unknownSlugs.length === 0, unknownSlugs.length ? `unknown: ${unknownSlugs.join(", ")}` : `${entries.length} entries`);

  const badPrices = entries.filter(([, a]) => !Number.isInteger(a.sellingPrice) || a.sellingPrice <= 0).map(([slug, a]) => `${slug}=${a.sellingPrice}`);
  check("every approved price is a positive integer (THB)", badPrices.length === 0, badPrices.join(", ") || "ok");

  const badDates = entries.filter(([, a]) => !/^\d{4}-\d{2}-\d{2}$/.test(a.lastPriceReview)).map(([slug]) => slug);
  check("every approval carries an ISO review date", badDates.length === 0, badDates.join(", ") || "ok");

  const missingEvidence = entries.filter(([, a]) => !a.shipnityProductId || a.evidence.trim().length < 20).map(([slug]) => slug);
  check("every approval cites its Shipnity parent code and a real evidence note", missingEvidence.length === 0, missingEvidence.join(", ") || "ok");

  const parentCounts = new Map<string, string[]>();
  for (const [slug, a] of entries) parentCounts.set(a.shipnityProductId, [...(parentCounts.get(a.shipnityProductId) ?? []), slug]);
  const dupes = [...parentCounts.entries()].filter(([, slugs]) => slugs.length > 1);
  check(
    "no Shipnity parent group is claimed by two different legacy products (one group = one product)",
    dupes.length === 0,
    dupes.map(([id, slugs]) => `${id}: ${slugs.join(" & ")}`).join("; ") || "ok"
  );

  // The index is the only path the money boundary reads prices through — assert the wiring, not
  // just the table.
  const notWired = entries.filter(([slug, a]) => getCatalogItem(slug)?.sellingPrice !== a.sellingPrice).map(([slug]) => slug);
  check("catalog-index exposes exactly the approved price for every entry (and nothing else)", notWired.length === 0, notWired.join(", ") || "ok");

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
