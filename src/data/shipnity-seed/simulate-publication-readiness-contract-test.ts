/**
 * OKami24 — Phase 2.7: publication-readiness simulation, contract tests.
 *
 * Proves (1) the 5 minimum-enriched coil candidates simulate as NOT ready — SPECIFICALLY and
 * ONLY because of the pricing-readiness rule added in the production-readiness audit
 * (sellingPrice/priceApprovedByOwner), not because their brand/category/tagline/shortDescription
 * evidence regressed, (2) the same 5 WOULD simulate as ready if given an owner-approved price,
 * proving the fix is precisely scoped, (3) products without minimum copy correctly simulate as
 * NOT ready (missing tagline/shortDescription), and (4) simulation never mutates the real
 * candidate's publicationStatus or pricing.
 */

import { productMasterSchema, validateProductMasterRegistry } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { projectActiveCatalog } from "./active-catalog-to-product-master";
import { runPublicationReadinessSimulation } from "./simulate-publication-readiness";

const PHASE_2_7_BATCH = ["Coil-53", "Coil-56", "Coil-74", "Coil-87", "Coil-92"];

export interface SimulationContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runSimulationContractTests(): SimulationContractResult[] {
  const results: SimulationContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const simResults = runPublicationReadinessSimulation(PHASE_2_7_BATCH);
  for (const id of PHASE_2_7_BATCH) {
    const r = simResults.find((s) => s.shipnityProductId === id);
    check(
      `${id} simulates as NOT publication-ready — blocked ONLY by missing owner-approved price, not brand/category/copy`,
      r?.publicationReadyBySimulation === false &&
        r.failureReason !== null &&
        r.failureReason.includes("pricing.sellingPrice") &&
        r.failureReason.includes("pricing.priceApprovedByOwner") &&
        !r.failureReason.includes("brandId") &&
        !r.failureReason.includes("categoryId") &&
        !r.failureReason.includes("tagline") &&
        !r.failureReason.includes("shortDescription"),
      JSON.stringify(r)
    );
  }

  // Proves the block above is precisely the pricing rule, not a regression elsewhere: cloning the
  // same 5 real candidates with an owner-approved price added (same pattern as
  // runPublicationReadinessSimulation itself, but with pricing also overridden) makes every one
  // of them pass. This never runs against the real, unpublished candidate objects.
  const realResults = projectActiveCatalog();
  const brandIds = brands.map((b) => b.id);
  const familyIds = families.map((f) => f.id);
  const categoryIds = categories.map((c) => c.id);
  for (const id of PHASE_2_7_BATCH) {
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
    check(`${id} WOULD be publication-ready if given an owner-approved sellingPrice`, readyWithPrice, detail);
  }

  // A product with no minimum copy (e.g. eliquid-62 — no brand/category/copy at all) must
  // correctly simulate as NOT ready, proving the simulation isn't rubber-stamping everything.
  const notReady = runPublicationReadinessSimulation(["eliquid-62"])[0];
  check(
    "a product with no minimum copy correctly simulates as NOT publication-ready",
    notReady?.publicationReadyBySimulation === false && notReady.failureReason !== null,
    JSON.stringify(notReady)
  );

  // The real candidate objects must still be unpublished, and their price must still be
  // unapproved, after every simulation above (including this file's own "WOULD be ready" clone
  // test) runs.
  const finalResults = projectActiveCatalog();
  const stillUntouched = PHASE_2_7_BATCH.every((id) => {
    const c = finalResults.find((r) => r.shipnityProductId === id);
    return (
      c?.status === "candidate" &&
      c.product.publicationStatus === "unpublished" &&
      c.product.pricing.sellingPrice === null &&
      c.product.pricing.priceApprovedByOwner === false
    );
  });
  check(
    "simulation never mutates the real candidate — publicationStatus stays unpublished and pricing stays unapproved for all 5",
    stillUntouched,
    JSON.stringify(PHASE_2_7_BATCH.map((id) => finalResults.find((r) => r.shipnityProductId === id)))
  );

  return results;
}
