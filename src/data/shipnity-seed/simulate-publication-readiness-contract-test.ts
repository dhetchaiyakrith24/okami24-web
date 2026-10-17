/**
 * OKami24 — Phase 2.7: publication-readiness simulation, contract tests.
 *
 * Proves (1) a media/identity-blocked coil candidate simulates as NOT ready, for its OWN real,
 * precise reason (pricing + media — no verified source of either provenance tier), never because
 * its brand/category/tagline/shortDescription evidence regressed, (2) it would STILL NOT be ready
 * even with a price added — media remains a real, separate blocker, (3) several coils (each a
 * real tier-2/official photo, identity-verified before use) now simulate as ready with just a
 * price, proving media alone was the blocker for them specifically, (4) products without minimum
 * copy correctly simulate as NOT ready, (5) simulation never mutates a still-unpublished real
 * candidate's publicationStatus or pricing, and (6) a list of coils are now GENUINELY published in
 * real data (not simulated) — see publication-approvals.ts for each entry.
 *
 * STILL_BLOCKED_BATCH fixture (storefront quality-correction pass, 2026-09-02): this was
 * originally "Coil-87" — it genuinely was blocked on both price and media when this test was
 * written, but the catalog-intelligence mission later published it for real (see
 * publication-approvals.ts), which silently broke every assertion below until this file's
 * previously-missing self-executing runner was added and finally surfaced the failures. Swapped
 * to "coil-62" (NEVOKS Feelin C1), which has the same real profile today — brand/category/copy
 * all resolved, media genuinely unavailable (no Matcha Clear photo found anywhere, see that
 * record's own TAXONOMY_MATCHES comment), no price approval. Whoever eventually resolves coil-62's
 * media blocker will need to swap this fixture again — that is an expected, healthy consequence of
 * this test tracking real catalog state rather than a synthetic one, not a flaw to design around.
 */

import { productMasterSchema, validateProductMasterRegistry } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { projectActiveCatalog } from "./active-catalog-to-product-master";
import { runPublicationReadinessSimulation } from "./simulate-publication-readiness";

// See this file's header comment for the fixture history — every other coil named there has
// since graduated to genuinely published (see publication-approvals.ts) and is proven separately
// below, not as part of the "still blocked on media" batch.
const STILL_BLOCKED_BATCH = ["coil-62"];

export interface SimulationContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runSimulationContractTests(): SimulationContractResult[] {
  const results: SimulationContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const simResults = runPublicationReadinessSimulation(STILL_BLOCKED_BATCH);
  for (const id of STILL_BLOCKED_BATCH) {
    const r = simResults.find((s) => s.shipnityProductId === id);
    check(
      `${id} simulates as NOT publication-ready — blocked by missing price AND missing media, never brand/category/copy`,
      r?.publicationReadyBySimulation === false &&
        r.failureReason !== null &&
        r.failureReason.includes("pricing.sellingPrice") &&
        r.failureReason.includes("pricing.priceApprovedByOwner") &&
        r.failureReason.includes("assets") &&
        !r.failureReason.includes("brandId") &&
        !r.failureReason.includes("categoryId") &&
        !r.failureReason.includes("tagline") &&
        !r.failureReason.includes("shortDescription"),
      JSON.stringify(r)
    );
  }

  // Proves the block above is precise, not a regression elsewhere: cloning each of the 4 still-
  // blocked real candidates with an owner-approved price added (same pattern as
  // runPublicationReadinessSimulation itself, but with pricing also overridden) proves they STILL
  // fail — on media alone, not price. This never runs against the real, unpublished candidate
  // objects.
  const realResults = projectActiveCatalog();
  const brandIds = brands.map((b) => b.id);
  const familyIds = families.map((f) => f.id);
  const categoryIds = categories.map((c) => c.id);
  for (const id of STILL_BLOCKED_BATCH) {
    const c = realResults.find((r) => r.shipnityProductId === id);
    if (!c || c.status !== "candidate") continue;
    const withApprovedPrice = {
      ...c.product,
      publicationStatus: "published" as const,
      pricing: { ...c.product.pricing, sellingPrice: c.product.pricing.priceReference?.value ?? 1, priceApprovedByOwner: true, lastPriceReview: "2026-09-01" },
    };
    const shape = productMasterSchema.safeParse(withApprovedPrice);
    let readyWithPrice = shape.success;
    let detail = "n/a";
    if (shape.success) {
      try {
        validateProductMasterRegistry({ products: [shape.data], brandIds, familyIds, categoryIds, faqEntryIds: [] });
      } catch (e) {
        readyWithPrice = false;
        detail = e instanceof Error ? e.message : String(e);
      }
    } else {
      detail = shape.error.issues[0]?.message ?? "schema rejected";
    }
    check(
      `${id} would STILL NOT be publication-ready even with a price — media remains a real, separate blocker`,
      readyWithPrice === false,
      detail
    );
  }

  // Coil-38/Coil-53/Coil-55/Coil-56/Coil-74/Coil-89/Coil-92 are no longer "candidates" awaiting
  // simulation — each is genuinely published in real data (publication-approvals.ts has a real
  // entry for each, and in every case except Coil-56, real tier-2 media was what finally closed
  // the gap). Prove each directly against real data, not a hypothetical clone.
  const checkGenuinelyPublished = (id: string, expectedPrice: number, expectedVariantCount: number) => {
    const real = realResults.find((r) => r.shipnityProductId === id);
    const ok =
      real?.status === "candidate" &&
      real.product.publicationStatus === "published" &&
      real.product.pricing.sellingPrice === expectedPrice &&
      real.product.pricing.priceApprovedByOwner === true &&
      real.product.variants.length === expectedVariantCount;
    check(`${id} is genuinely published in real data with the ฿${expectedPrice} price and ${expectedVariantCount} real variant(s)`, ok, JSON.stringify(real));
  };
  checkGenuinelyPublished("Coil-38", 450, 4); // list19 stage 2 (18/10): Max children DM1 + DM3 added
  checkGenuinelyPublished("Coil-53", 450, 1); // owner override 2026-10-06 (admin list)
  checkGenuinelyPublished("Coil-55", 250, 0); // owner override 2026-10-06 (admin list)
  checkGenuinelyPublished("Coil-56", 300, 1);
  checkGenuinelyPublished("Coil-74", 250, 1);
  checkGenuinelyPublished("Coil-89", 350, 2);
  // Storefront quality-correction pass (2026-09-02) additions.
  checkGenuinelyPublished("Coil-70", 390, 1);
  checkGenuinelyPublished("Coil-83", 250, 0);
  checkGenuinelyPublished("Coil-87", 250, 1);

  // Owner image-quality withdrawal (2026-09-06, LAUNCH_AUDIT item 11): Coil-92, Coil-63, Pod-169
  // and IQOSHEET-14 had their publication-approvals.ts entries removed because their only card
  // image is not fit to sell from. They must still be real candidates (data intact) but NOT
  // published — the withdrawal is the approval entry's absence, nothing else.
  const checkWithdrawn = (id: string) => {
    const real = realResults.find((r) => r.shipnityProductId === id);
    const ok = real?.status === "candidate" && real.product.publicationStatus !== "published";
    check(`${id} is a real candidate but WITHDRAWN from publication (approval entry removed 2026-09-06)`, ok, JSON.stringify(real));
  };
  checkWithdrawn("Coil-92");
  checkWithdrawn("Coil-63");
  checkWithdrawn("Pod-169");
  // IQOSHEET-14 republished round list19 (2026-10-17) with LAMBDA's own per-colour photos: 2 Shipnity children + 4 verified colours.
  checkGenuinelyPublished("IQOSHEET-14", 2390, 6);

  // A product with no minimum copy (e.g. eliquid-62 — no brand/category/copy at all) must
  // correctly simulate as NOT ready, proving the simulation isn't rubber-stamping everything.
  const notReady = runPublicationReadinessSimulation(["eliquid-62"])[0];
  check(
    "a product with no minimum copy correctly simulates as NOT publication-ready",
    notReady?.publicationReadyBySimulation === false && notReady.failureReason !== null,
    JSON.stringify(notReady)
  );

  // The real, still-blocked candidate objects must still be unpublished, and their price must
  // still be unapproved, after every simulation above (including this file's own "WOULD be ready"
  // clone test) runs.
  const finalResults = projectActiveCatalog();
  const stillUntouched = STILL_BLOCKED_BATCH.every((id) => {
    const c = finalResults.find((r) => r.shipnityProductId === id);
    return (
      c?.status === "candidate" &&
      c.product.publicationStatus === "unpublished" &&
      c.product.pricing.sellingPrice === null &&
      c.product.pricing.priceApprovedByOwner === false
    );
  });
  check(
    "simulation never mutates a still-blocked real candidate — publicationStatus stays unpublished and pricing stays unapproved",
    stillUntouched,
    JSON.stringify(STILL_BLOCKED_BATCH.map((id) => finalResults.find((r) => r.shipnityProductId === id)))
  );

  return results;
}

// Storefront quality-correction pass (2026-09-02) — see product-master-contract-test.ts's own
// comment on this same fix: this file had no self-executing runner, so it never actually ran its
// checks when invoked directly (exactly how scripts/verify-catalog.ts invokes it).
if (require.main === module) {
  const results = runSimulationContractTests();
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
