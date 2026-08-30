/**
 * OKami24 — Phase 2.7: publication-readiness simulation.
 *
 * Real ProductMaster candidates built by `active-catalog-to-product-master.ts` always keep
 * `publicationStatus: "unpublished"` — Phase 2.7 does not flip any real record to "published"
 * (production media, the storefront read model, and browser review are not done yet).
 *
 * `validateProductMasterRegistry`'s readiness check (Phase 2.6) only runs its brandId/
 * categoryId/tagline/shortDescription requirement when `publicationStatus === "published"`, so
 * an unpublished record can never truthfully be said to have "passed" that check — it simply
 * never triggers it. This file answers the real question ("if this were published today, would
 * it pass readiness?") without ever setting that flag on a real record: it takes a SHALLOW CLONE
 * of each candidate, overrides `publicationStatus` to `"published"` on the clone only, and runs
 * the real `productMasterSchema` + `validateProductMasterRegistry` against that clone.
 *
 * Report the result as "publication-ready by simulation" — never as "published". The original
 * candidate object returned by `projectActiveCatalog()` is never mutated (spread creates a new
 * object; `projectActiveCatalog()` itself builds fresh objects on every call).
 */

import { productMasterSchema, validateProductMasterRegistry, type ProductMasterInput } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { projectActiveCatalog } from "./active-catalog-to-product-master";

export interface ReadinessSimulationResult {
  shipnityProductId: string;
  internalId: string;
  /** True iff a CLONE with publicationStatus:"published" would pass schema + registry. The
   *  real record is never mutated and stays unpublished regardless of this result. */
  publicationReadyBySimulation: boolean;
  failureReason: string | null;
}

/** Pass `targetIds` to simulate only specific Shipnity parents (e.g. one enrichment batch);
 *  omit it to simulate every current candidate. */
export function runPublicationReadinessSimulation(targetIds?: string[]): ReadinessSimulationResult[] {
  const results = projectActiveCatalog();
  const candidates = results.filter((r) => r.status === "candidate");
  const targets = targetIds ? candidates.filter((c) => targetIds.includes(c.shipnityProductId)) : candidates;

  const brandIds = brands.map((b) => b.id);
  const familyIds = families.map((f) => f.id);
  const categoryIds = categories.map((c) => c.id);

  return targets.map((c) => {
    if (c.status !== "candidate") throw new Error("unreachable"); // narrows for TS
    const simulated: ProductMasterInput = { ...c.product, publicationStatus: "published" };

    const shapeResult = productMasterSchema.safeParse(simulated);
    if (!shapeResult.success) {
      return {
        shipnityProductId: c.shipnityProductId,
        internalId: c.product.internalId,
        publicationReadyBySimulation: false,
        failureReason: `schema: ${shapeResult.error.issues[0]?.message}`,
      };
    }
    try {
      validateProductMasterRegistry({ products: [shapeResult.data], brandIds, familyIds, categoryIds, faqEntryIds: [] });
      return { shipnityProductId: c.shipnityProductId, internalId: c.product.internalId, publicationReadyBySimulation: true, failureReason: null };
    } catch (e) {
      return {
        shipnityProductId: c.shipnityProductId,
        internalId: c.product.internalId,
        publicationReadyBySimulation: false,
        failureReason: e instanceof Error ? e.message : String(e),
      };
    }
  });
}
