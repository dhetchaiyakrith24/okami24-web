/**
 * OKami24 — Phase 2.7: publication-readiness simulation, contract tests.
 *
 * Proves (1) the 3 remaining media-blocked coil candidates simulate as NOT ready, each for its
 * OWN real, precise reason (pricing for all 3; ALSO media for all 3 — Coil-53/87/92 have no
 * verified source of either provenance tier — see the publication-pipeline audit), never because
 * their brand/category/tagline/shortDescription evidence regressed, (2) those same 3 would STILL
 * NOT be ready even with a price added — media remains a real, separate blocker, (3) Coil-74 and
 * Coil-89 (this session — each a tier-2 retailer photo, identity-verified before use) now
 * simulate as ready with just a price, proving media alone was the blocker for them specifically,
 * (4) products without minimum copy correctly simulate as NOT ready, (5) simulation never mutates
 * a still-unpublished real candidate's publicationStatus or pricing, and (6) Coil-56 — the one
 * candidate that had both media and price — is now GENUINELY published in real data (not
 * simulated), with its real owner-approved ฿300 price and its one real active variant (Coil-56-3,
 * Silver). See publication-approvals.ts for the approval entry and the mission report for why
 * Coil-56-1/56-2 (named in the owner's approval) are not fabricated as variants — they simply
 * aren't in the current active (have_stock=true) seed.
 */

import { productMasterSchema, validateProductMasterRegistry } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { projectActiveCatalog } from "./active-catalog-to-product-master";
import { runPublicationReadinessSimulation } from "./simulate-publication-readiness";

// Coil-56 graduated from "candidate" to genuinely published (see publication-approvals.ts) —
// proven separately below. Coil-74 graduated from "media-blocked" to "price is the only
// blocker" this session (a real, verified tier-2 photo) — also proven separately below, not as
// part of the "still blocked on media" batch.
const STILL_BLOCKED_BATCH = ["Coil-53", "Coil-87", "Coil-92"];

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

  // Coil-74/Coil-89 (this session): verified tier-2 media added to each, so both should now
  // simulate as ready with JUST a price — proving media, not identity/content/copy, was the
  // remaining blocker for them specifically. Same clone-and-add-price pattern as the loop above,
  // but asserting the opposite result.
  const checkNowPriceOnlyBlocked = (id: string) => {
    const real = realResults.find((r) => r.shipnityProductId === id);
    if (!real || real.status !== "candidate") return;
    const withApprovedPrice = {
      ...real.product,
      publicationStatus: "published" as const,
      pricing: { ...real.product.pricing, sellingPrice: real.product.pricing.priceReference?.value ?? 1, priceApprovedByOwner: true, lastPriceReview: "2026-09-01" },
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
    check(`${id} WOULD be publication-ready if given just an owner-approved sellingPrice — verified tier-2 media closed the gap this session`, readyWithPrice === true, detail);
  };
  checkNowPriceOnlyBlocked("Coil-74");
  checkNowPriceOnlyBlocked("Coil-89");

  // Coil-56 is no longer a "candidate" awaiting simulation — it is genuinely published in real
  // data (publication-approvals.ts has a real owner-approved entry). Prove that directly.
  const realCoil56 = realResults.find((r) => r.shipnityProductId === "Coil-56");
  check(
    "Coil-56 is genuinely published in real data with the owner-approved ฿300 price and its one real active variant (Coil-56-3, Silver)",
    realCoil56?.status === "candidate" &&
      realCoil56.product.publicationStatus === "published" &&
      realCoil56.product.pricing.sellingPrice === 300 &&
      realCoil56.product.pricing.priceApprovedByOwner === true &&
      realCoil56.product.variants.length === 1 &&
      realCoil56.product.variants[0]?.id === "Coil-56-3",
    JSON.stringify(realCoil56)
  );

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
