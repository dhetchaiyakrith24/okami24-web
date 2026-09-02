/**
 * OKami24 — catalog-relationships.ts contract tests.
 *
 * Same lightweight convention as the other `*-contract-test.ts` scripts (no test framework;
 * `runCatalogRelationshipsContractTests()` returns a plain result array, run via throwaway
 * `npx tsx`, auto-discovered by `scripts/verify-catalog.ts`).
 *
 * `catalog-relationships.ts` already throws at module load for four structural defects (unknown
 * slug, self-referential edge, duplicate edge pair) — those are exercised here by loading real
 * modified copies of the source through dynamic constructors would be excessive; instead this
 * file (a) confirms the REAL authored table currently satisfies its own invariants by importing
 * it directly (a bad edit would fail this whole process at import time, which is itself a test),
 * and (b) exercises the two visibility/query guarantees that the module-load throws cannot check:
 * that an edge to a not-yet-published ProductMaster slug stays genuinely invisible, and that the
 * derived reverse direction never drifts from the authored forward direction.
 */

import {
  DEVICE_CONSUMABLE_EDGES,
  getCompatibleConsumables,
  getCompatibleDevices,
  resolveVisibleRef,
  relationshipCoverageReport,
} from "./catalog-relationships";
import { allProducts } from "@/data/products";
import { projectActiveCatalog } from "@/data/shipnity-seed/active-catalog-to-product-master";

export interface CatalogRelationshipsContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runCatalogRelationshipsContractTests(): CatalogRelationshipsContractResult[] {
  const results: CatalogRelationshipsContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }

  // ---- 1. The table imported without throwing (module-load admission validation passed) ----
  check(
    "DEVICE_CONSUMABLE_EDGES loaded without throwing (unknown-slug / self-reference / duplicate-edge admission checks all passed)",
    Array.isArray(DEVICE_CONSUMABLE_EDGES) && DEVICE_CONSUMABLE_EDGES.length > 0,
    `edge count: ${DEVICE_CONSUMABLE_EDGES.length}`
  );

  // ---- 2. Every edge endpoint resolves to a KNOWN identity (legacy or any projected candidate,
  //         published or not) — re-derives the same admission set the module itself checks, as an
  //         independent confirmation rather than trusting the absence of a thrown error alone ----
  const legacySlugs = new Set(allProducts.map((p) => p.slug));
  const productMasterSlugs = new Set(
    projectActiveCatalog()
      .filter((r) => r.status === "candidate")
      .map((r) => r.product.slug)
  );
  const knownSlugs = new Set([...legacySlugs, ...productMasterSlugs]);
  const unknownEndpoints = DEVICE_CONSUMABLE_EDGES.filter(
    (e) => !knownSlugs.has(e.device) || !knownSlugs.has(e.consumable)
  );
  check(
    "every edge endpoint (device and consumable) resolves to a known legacy or ProductMaster identity",
    unknownEndpoints.length === 0,
    JSON.stringify(unknownEndpoints)
  );

  // ---- 3. No self-referential edge ----
  const selfEdges = DEVICE_CONSUMABLE_EDGES.filter((e) => e.device === e.consumable);
  check("no edge has the same slug on both sides", selfEdges.length === 0, JSON.stringify(selfEdges));

  // ---- 4. No duplicate (device, consumable) pair ----
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const e of DEVICE_CONSUMABLE_EDGES) {
    const key = `${e.device}${e.consumable}`;
    if (seen.has(key)) dupes.push(key);
    seen.add(key);
  }
  check("no duplicate (device, consumable) edge pair", dupes.length === 0, JSON.stringify(dupes));

  // ---- 5. Every edge carries a real citation — never an empty evidence/sourceUrl string ----
  const uncited = DEVICE_CONSUMABLE_EDGES.filter((e) => !e.evidence.trim() || !e.sourceUrl.trim());
  check(
    "every edge has non-empty evidence and sourceUrl",
    uncited.length === 0,
    JSON.stringify(uncited.map((e) => `${e.device}->${e.consumable}`))
  );

  // ---- 6. Reverse direction is DERIVED, never independently authored — for every authored edge,
  //         the consumable's getCompatibleDevices() must contain the device, whenever the device
  //         side is currently visible (this is the "cannot drift apart" guarantee) ----
  let reverseMismatch: string | null = null;
  for (const e of DEVICE_CONSUMABLE_EDGES) {
    if (!resolveVisibleRef(e.device) || !resolveVisibleRef(e.consumable)) continue; // visibility-gated, checked separately below
    const reverse = getCompatibleDevices(e.consumable);
    if (!reverse.some((r) => r.ref.slug === e.device)) {
      reverseMismatch = `${e.device} -> ${e.consumable} (forward visible, but reverse lookup missed it)`;
      break;
    }
    const forward = getCompatibleConsumables(e.device);
    if (!forward.some((f) => f.ref.slug === e.consumable)) {
      reverseMismatch = `${e.device} -> ${e.consumable} (forward lookup missed its own authored edge)`;
      break;
    }
  }
  check("forward and reverse lookups agree for every currently-visible edge", reverseMismatch === null, reverseMismatch ?? "");

  // ---- 7. VISIBILITY GATE: an edge naming a real but NOT YET PUBLISHED ProductMaster consumable
  //         must resolve to nothing customer-facing — this is the two-layer safety the whole file
  //         is built around, so it gets an explicit test rather than relying on the code reading
  //         correctly. coil-56 is real (ProductMaster candidate) and currently unpublished; if it
  //         is ever mistakenly added to DEVICE_CONSUMABLE_EDGES before being published, this test
  //         catches the leak immediately. Absent from the real table today (see its "TRUTHFUL
  //         NO-LINKS" note) — this checks the GATE mechanism itself using a synthetic probe. ----
  const unpublishedCandidates = projectActiveCatalog().filter(
    (r): r is Extract<typeof r, { status: "candidate" }> => r.status === "candidate" && r.product.publicationStatus !== "published"
  );
  const unpublishedProbe = unpublishedCandidates[0];
  check(
    "a real but unpublished ProductMaster slug resolves to undefined through resolveVisibleRef (visibility gate holds)",
    unpublishedProbe !== undefined && resolveVisibleRef(unpublishedProbe.product.slug) === undefined,
    unpublishedProbe ? `probed unpublished slug: ${unpublishedProbe.product.slug}` : "no unpublished candidate found to probe with"
  );

  // ---- 8. Neither getCompatibleConsumables nor getCompatibleDevices ever returns the product
  //         itself or a duplicate slug — checked across every known slug, not just a sample,
  //         since both are cheap pure lookups over a small authored table ----
  function findSelfOrDupe(label: string, forSlug: string, refs: { ref: { slug: string } }[]): string | null {
    if (refs.some((r) => r.ref.slug === forSlug)) return `${label}(${forSlug}): self-reference in its own result`;
    const slugs = refs.map((r) => r.ref.slug);
    if (new Set(slugs).size !== slugs.length) return `${label}(${forSlug}): duplicate slug in result`;
    return null;
  }
  let selfOrDupeFound: string | null = null;
  for (const slug of knownSlugs) {
    selfOrDupeFound =
      findSelfOrDupe("getCompatibleConsumables", slug, getCompatibleConsumables(slug)) ??
      findSelfOrDupe("getCompatibleDevices", slug, getCompatibleDevices(slug));
    if (selfOrDupeFound) break;
  }
  check("getCompatibleConsumables/getCompatibleDevices never self-reference or duplicate a slug (checked for every known identity)", selfOrDupeFound === null, selfOrDupeFound ?? "");

  // ---- 9. Coverage report shape sanity (used by the catalog verifier / future reporting) ----
  const coverage = relationshipCoverageReport();
  check(
    "relationshipCoverageReport returns a well-formed summary",
    typeof coverage.deviceConsumableEdges === "number" &&
      typeof coverage.liveDeviceConsumableEdges === "number" &&
      coverage.liveDeviceConsumableEdges <= coverage.deviceConsumableEdges &&
      Array.isArray(coverage.darkEndpoints),
    JSON.stringify(coverage)
  );

  return results;
}

if (require.main === module) {
  const results = runCatalogRelationshipsContractTests();
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
