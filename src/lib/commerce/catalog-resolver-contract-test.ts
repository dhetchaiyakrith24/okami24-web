/**
 * Contract tests for the cart/checkout money boundary — resolveProductRef(). Derives its fixtures
 * from the REAL published catalog (buildPublishedCatalog()) rather than hardcoding slugs, same
 * discipline as storefront-bridge-contract-test.ts, so a future publication/unpublication doesn't
 * silently invalidate this file without failing it first.
 */
import { resolveProductRef } from "./catalog-resolver";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { allProducts as legacyProducts } from "@/data/products";

export interface ResolverContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runCatalogResolverContractTests(): ResolverContractResult[] {
  const results: ResolverContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const published = buildPublishedCatalog();
  const withVariants = published.find((p) => p.variants.length > 0);
  const withoutVariants = published.find((p) => p.variants.length === 0);
  const legacySlug = legacyProducts[0]?.slug;

  check(
    "test fixture sanity: at least one published product has variants and one has zero (otherwise this file can't exercise both branches)",
    withVariants !== undefined && withoutVariants !== undefined,
    `withVariants=${withVariants?.slug} withoutVariants=${withoutVariants?.slug}`
  );

  if (withVariants) {
    const missingVariant = resolveProductRef({ origin: "product-master", slug: withVariants.slug, variantId: null });
    check(
      `a variant-bearing published product ("${withVariants.slug}") requires variantId — omitting it is rejected, not defaulted to variant 0`,
      !missingVariant.ok && missingVariant.reason === "variant-required",
      JSON.stringify(missingVariant)
    );

    const realVariantId = withVariants.variants[0].id;
    const validVariant = resolveProductRef({ origin: "product-master", slug: withVariants.slug, variantId: realVariantId });
    check(
      `resolving a real variant id ("${realVariantId}") on "${withVariants.slug}" succeeds with the product's owner-approved price`,
      validVariant.ok && validVariant.line.unitPrice === withVariants.sellingPrice,
      JSON.stringify(validVariant)
    );

    const fakeVariant = resolveProductRef({ origin: "product-master", slug: withVariants.slug, variantId: "not-a-real-variant-id" });
    check(
      "an unrecognized variant id on a real product is rejected, not silently priced at the product level",
      !fakeVariant.ok && fakeVariant.reason === "variant-not-found",
      JSON.stringify(fakeVariant)
    );
  }

  if (withoutVariants) {
    const zeroVariantResult = resolveProductRef({ origin: "product-master", slug: withoutVariants.slug, variantId: null });
    check(
      `a zero-variant published product ("${withoutVariants.slug}") resolves fine with variantId: null`,
      zeroVariantResult.ok && zeroVariantResult.line.unitPrice === withoutVariants.sellingPrice,
      JSON.stringify(zeroVariantResult)
    );
  }

  const missing = resolveProductRef({ origin: "product-master", slug: "definitely-not-a-real-slug-xyz", variantId: null });
  check("an unrecognized slug is rejected with reason 'not-found'", !missing.ok && missing.reason === "not-found", JSON.stringify(missing));

  // Oversell-risk fix (owner architecture review): a variant with no confirmed Shipnity signal
  // (VERIFIED_ADDITIONAL_VARIANTS — manufacturer-verified content truth, not operational stock
  // truth) must be rejected at this money boundary exactly like a confirmed-zero variant, never
  // silently treated as purchasable. Derived from the real published catalog, not a fabricated
  // fixture, so this fails loudly if the current data no longer exercises the "unknown" branch.
  const unknownStockPair = published.flatMap((p) => p.variants.filter((v) => v.availabilityStatus === "unknown").map((v) => ({ product: p, variant: v })))[0];
  check(
    "test fixture sanity: at least one published product carries a variant with no confirmed Shipnity stock signal (availabilityStatus \"unknown\") to exercise the oversell-risk rejection branch",
    unknownStockPair !== undefined,
    unknownStockPair ? `${unknownStockPair.product.slug} / ${unknownStockPair.variant.id}` : "none found"
  );
  if (unknownStockPair) {
    const unknownResult = resolveProductRef({
      origin: "product-master",
      slug: unknownStockPair.product.slug,
      variantId: unknownStockPair.variant.id,
    });
    check(
      `a variant with no confirmed Shipnity stock signal ("${unknownStockPair.product.slug}" / "${unknownStockPair.variant.id}") is rejected, not treated as purchasable just because it's catalog-verified`,
      !unknownResult.ok && unknownResult.reason === "out-of-stock",
      JSON.stringify(unknownResult)
    );
  }

  check(
    "test fixture sanity: at least one legacy-catalog product exists to exercise the legacy-rejection branch",
    legacySlug !== undefined,
    `legacySlug=${legacySlug}`
  );

  if (legacySlug) {
    // Architecture review (2026-09-02): resolveProductRef() no longer special-cases
    // `origin === "legacy"` — it checks price presence (via getCatalogItem()) origin-blind. This
    // legacy slug is rejected as a CONSEQUENCE of having no price today, not because of a
    // hard-coded origin check — asserted by using the real product-master origin value here too
    // (proving the rejection tracks the slug's actual data, not the `ref.origin` field the caller
    // supplies) alongside the normal "legacy" tag, both should reject identically.
    const legacyResult = resolveProductRef({ origin: "legacy", slug: legacySlug, variantId: null });
    check(
      `a legacy slug ("${legacySlug}") is rejected as not-purchasable because it has no price — not because \`ref.origin\` says "legacy" (see src/lib/catalog-index.ts)`,
      !legacyResult.ok && legacyResult.reason === "not-purchasable",
      JSON.stringify(legacyResult)
    );

    const mislabeledResult = resolveProductRef({ origin: "product-master", slug: legacySlug, variantId: null });
    check(
      `the SAME legacy slug is rejected identically even when the caller mislabels \`ref.origin\` as "product-master" — proving rejection is driven by price presence, not the origin tag`,
      !mislabeledResult.ok && mislabeledResult.reason === "not-purchasable",
      JSON.stringify(mislabeledResult)
    );
  }

  return results;
}

if (require.main === module) {
  const results = runCatalogResolverContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
