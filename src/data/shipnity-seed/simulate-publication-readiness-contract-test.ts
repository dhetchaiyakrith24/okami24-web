/**
 * OKami24 — Phase 2.7: publication-readiness simulation, contract tests.
 *
 * Proves (1) the 5 minimum-enriched coil candidates simulate as publication-ready, (2) products
 * without minimum copy correctly simulate as NOT ready (missing tagline/shortDescription), and
 * (3) simulation never mutates the real candidate's publicationStatus.
 */

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
    check(`${id} simulates as publication-ready`, r?.publicationReadyBySimulation === true, JSON.stringify(r));
  }

  // A product with no minimum copy (e.g. eliquid-62 — no brand/category/copy at all) must
  // correctly simulate as NOT ready, proving the simulation isn't rubber-stamping everything.
  const notReady = runPublicationReadinessSimulation(["eliquid-62"])[0];
  check(
    "a product with no minimum copy correctly simulates as NOT publication-ready",
    notReady?.publicationReadyBySimulation === false && notReady.failureReason !== null,
    JSON.stringify(notReady)
  );

  // The real candidate objects must still be unpublished after simulation runs.
  const realResults = projectActiveCatalog();
  const stillUnpublished = PHASE_2_7_BATCH.every((id) => {
    const c = realResults.find((r) => r.shipnityProductId === id);
    return c?.status === "candidate" && c.product.publicationStatus === "unpublished";
  });
  check(
    "simulation never mutates the real candidate — publicationStatus stays unpublished for all 5",
    stillUnpublished,
    JSON.stringify(PHASE_2_7_BATCH.map((id) => realResults.find((r) => r.shipnityProductId === id)))
  );

  return results;
}
