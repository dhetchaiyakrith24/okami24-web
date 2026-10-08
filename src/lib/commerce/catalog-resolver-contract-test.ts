/**
 * Contract tests for the cart/checkout money boundary — resolveProductRef(). Derives its fixtures
 * from the REAL published catalog (buildPublishedCatalog()) rather than hardcoding slugs, same
 * discipline as storefront-bridge-contract-test.ts, so a future publication/unpublication doesn't
 * silently invalidate this file without failing it first.
 */
import { resolveProductRef } from "./catalog-resolver";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { allProducts as legacyProducts } from "@/data/products";
import { LEGACY_APPROVED_PRICING } from "@/data/shipnity-seed/legacy-price-approvals";

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
  // Since 2026-09-05 the legacy catalog is split: products with an entry in
  // legacy-price-approvals.ts are purchasable, the rest stay browse-only. Both branches are
  // derived from the real data so a future approval can't silently invalidate this file.
  const legacyUnpriced = legacyProducts.find((p) => !(p.slug in LEGACY_APPROVED_PRICING));
  const legacySlug = legacyUnpriced?.slug;
  const legacyPriced = legacyProducts.find((p) => p.slug in LEGACY_APPROVED_PRICING && ((p.colorVariants?.length ?? 0) + (p.flavorVariants?.length ?? 0)) > 0);
  const legacySoldOut = legacyProducts
    .filter((p) => p.slug in LEGACY_APPROVED_PRICING)
    .flatMap((p) => [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].filter((v) => v.availability === "out-of-stock").map((v) => ({ product: p, variant: v })))[0];

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

  // Prices round (owner order, 2026-09-21): every legacy product now has an approved price, so
  // the "unpriced legacy product" fixture is expected to be EMPTY from that date on. The branch
  // still exists in resolveProductRef() (a future product added without an approval must stay
  // browse-only) and is exercised below whenever the data offers such a product; when it does
  // not, the origin-blind rejection is asserted with a slug that exists nowhere instead
  // ("not-found" under both origin tags), and the not-purchasable path is covered by the
  // "no approval = no price in the index" check of legacy-price-approvals-contract-test.ts.
  check(
    "test fixture: an unpriced legacy product is either present (browse-only branch exercised below) or, since 2026-09-21, absent because every legacy product is priced (owner order)",
    true,
    legacySlug ? `legacySlug=${legacySlug}` : "none — all legacy products priced (prices round 2026-09-21); falling back to a nonexistent slug"
  );

  if (!legacySlug) {
    const ghost = "no-such-legacy-product";
    const ghostLegacy = resolveProductRef({ origin: "legacy", slug: ghost, variantId: null });
    const ghostMaster = resolveProductRef({ origin: "product-master", slug: ghost, variantId: null });
    check(
      `a slug that exists nowhere ("${ghost}") is rejected as not-found under BOTH origin tags — rejection is driven by the slug's data, not by \`ref.origin\``,
      !ghostLegacy.ok && ghostLegacy.reason === "not-found" && !ghostMaster.ok && ghostMaster.reason === "not-found",
      JSON.stringify({ legacy: ghostLegacy, master: ghostMaster })
    );
  }

  if (legacySlug) {
    // Architecture review (2026-09-02): resolveProductRef() no longer special-cases
    // `origin === "legacy"` — it checks price presence (via getCatalogItem()) origin-blind. This
    // legacy slug is rejected as a CONSEQUENCE of having no price today, not because of a
    // hard-coded origin check — asserted by using the real product-master origin value here too
    // (proving the rejection tracks the slug's actual data, not the `ref.origin` field the caller
    // supplies) alongside the normal "legacy" tag, both should reject identically.
    const legacyResult = resolveProductRef({ origin: "legacy", slug: legacySlug, variantId: null });
    check(
      `an UNPRICED legacy slug ("${legacySlug}") is rejected as not-purchasable because it has no approved price — not because \`ref.origin\` says "legacy" (see src/lib/catalog-index.ts)`,
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

  // Priced legacy products (legacy-price-approvals.ts, 2026-09-05) — the legacy branch of the
  // money boundary: variant required, unknown variant rejected, out-of-stock option rejected,
  // otherwise priced at the approved price regardless of the caller's origin tag.
  check(
    "test fixture sanity: at least one PRICED legacy product with colour/flavour options exists to exercise the legacy purchase branch",
    legacyPriced !== undefined,
    `legacyPriced=${legacyPriced?.slug}`
  );
  if (legacyPriced) {
    const approved = LEGACY_APPROVED_PRICING[legacyPriced.slug].sellingPrice;
    const noVariant = resolveProductRef({ origin: "legacy", slug: legacyPriced.slug, variantId: null });
    check(
      `a priced legacy product with options ("${legacyPriced.slug}") requires a variantId — omitting it is rejected, not defaulted`,
      !noVariant.ok && noVariant.reason === "variant-required",
      JSON.stringify(noVariant)
    );
    const sellable = [...(legacyPriced.colorVariants ?? []), ...(legacyPriced.flavorVariants ?? [])].find((v) => v.availability !== "out-of-stock");
    if (sellable) {
      const ok = resolveProductRef({ origin: "legacy", slug: legacyPriced.slug, variantId: sellable.id });
      check(
        `a priced legacy product ("${legacyPriced.slug}" / "${sellable.id}") resolves with its approved price (฿${approved}) and the option's own name as the variant label`,
        ok.ok && ok.line.unitPrice === approved && ok.line.variantLabel === sellable.name,
        JSON.stringify(ok)
      );
      const mislabeled = resolveProductRef({ origin: "product-master", slug: legacyPriced.slug, variantId: sellable.id });
      check(
        "the SAME priced legacy ref resolves identically when the caller mislabels \`ref.origin\` as \"product-master\" — the index's provenance decides, not the tag",
        mislabeled.ok && mislabeled.line.unitPrice === approved,
        JSON.stringify(mislabeled)
      );
    }
    const fake = resolveProductRef({ origin: "legacy", slug: legacyPriced.slug, variantId: "not-a-real-variant-id" });
    check(
      "an unrecognized colour/flavour id on a priced legacy product is rejected, not silently priced at the product level",
      !fake.ok && fake.reason === "variant-not-found",
      JSON.stringify(fake)
    );
  }
  check(
    "test fixture sanity: at least one priced legacy product carries an option marked out-of-stock (the 2026-09-06 additions) to exercise the legacy sold-out branch",
    legacySoldOut !== undefined,
    legacySoldOut ? `${legacySoldOut.product.slug} / ${legacySoldOut.variant.id}` : "none found"
  );
  if (legacySoldOut) {
    const soldOut = resolveProductRef({ origin: "legacy", slug: legacySoldOut.product.slug, variantId: legacySoldOut.variant.id });
    check(
      `a legacy option marked out-of-stock ("${legacySoldOut.product.slug}" / "${legacySoldOut.variant.id}") is rejected at the money boundary`,
      !soldOut.ok && soldOut.reason === "out-of-stock",
      JSON.stringify(soldOut)
    );
  }
  // A priced product without options and without a warehouse SKU (stock round 2b — Zero Nano on 2026-10-08). Optional
  // fixture: it disappears once every such product gets a SKU; sku-map-contract-test.ts checks the flag is applied.
  const legacyWholeSoldOut = legacyProducts.find(
    (p) => p.slug in LEGACY_APPROVED_PRICING && (p.colorVariants?.length ?? 0) + (p.flavorVariants?.length ?? 0) === 0 && p.availability === "out-of-stock"
  );
  if (legacyWholeSoldOut) {
    const whole = resolveProductRef({ origin: "legacy", slug: legacyWholeSoldOut.slug, variantId: null });
    check(
      `a legacy product without options marked out-of-stock ("${legacyWholeSoldOut.slug}") is rejected at the money boundary`,
      !whole.ok && whole.reason === "out-of-stock",
      JSON.stringify(whole)
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
