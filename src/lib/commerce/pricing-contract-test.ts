/**
 * Pure-function contract tests for the money math — no DB, no Next.js runtime, safe to run under
 * plain `tsx`. See docs/BUSINESS_SOURCE_OF_TRUTH.md §10 for the shipping rule this encodes — the tiers themselves
 * (800, the members' once-a-month 300) are held by shipping-rules-contract-test.ts; this file checks totals for a guest.
 */
import { computeOrderTotals, priceLine, FLAT_SHIPPING_FEE_THB, type PricedLine } from "./pricing";
import { REDUCED_THRESHOLD_THB } from "./shipping-rules";
import type { ResolvedLine } from "./catalog-resolver";

export interface PricingContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

function line(unitPrice: number, quantity: number): PricedLine {
  const resolved: ResolvedLine = {
    ref: { origin: "product-master", slug: "test-slug", variantId: null },
    productSlug: "test-slug",
    variantId: null,
    displayName: "Test product",
    variantLabel: null,
    unitPrice,
  };
  return priceLine(resolved, quantity);
}

export function runPricingContractTests(): PricingContractResult[] {
  const results: PricingContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  check(
    "REDUCED_THRESHOLD_THB and FLAT_SHIPPING_FEE_THB match docs/BUSINESS_SOURCE_OF_TRUTH.md §10 exactly",
    REDUCED_THRESHOLD_THB === 500 && FLAT_SHIPPING_FEE_THB === 50,
    `threshold=${REDUCED_THRESHOLD_THB} fee=${FLAT_SHIPPING_FEE_THB}`
  );

  const belowThreshold = computeOrderTotals([line(200, 1)]);
  check(
    "a 200 THB subtotal (below the 500 THB threshold) charges the flat 50 THB fee",
    belowThreshold.subtotal === 200 && belowThreshold.shippingFee === 50 && belowThreshold.total === 250,
    JSON.stringify(belowThreshold)
  );

  const exactlyAtThreshold = computeOrderTotals([line(500, 1)]);
  check(
    "a guest at exactly 500 THB pays the 35 THB rate (>=, not >)",
    exactlyAtThreshold.subtotal === 500 && exactlyAtThreshold.shippingFee === 35 && exactlyAtThreshold.total === 535,
    JSON.stringify(exactlyAtThreshold)
  );

  const aboveThreshold = computeOrderTotals([line(300, 1), line(250, 1)]);
  check(
    "multiple lines summing above the threshold (300+250=550) pay 35",
    aboveThreshold.subtotal === 550 && aboveThreshold.shippingFee === 35 && aboveThreshold.total === 585,
    JSON.stringify(aboveThreshold)
  );

  const multiQuantity = line(120, 3);
  check("priceLine multiplies unit price by quantity correctly (120 x 3 = 360)", multiQuantity.lineTotal === 360, JSON.stringify(multiQuantity));

  let threwOnZero = false;
  try {
    line(100, 0);
  } catch {
    threwOnZero = true;
  }
  check("priceLine rejects a zero quantity rather than silently pricing an empty line", threwOnZero, "n/a");

  let threwOnNegative = false;
  try {
    line(100, -1);
  } catch {
    threwOnNegative = true;
  }
  check("priceLine rejects a negative quantity", threwOnNegative, "n/a");

  const empty = computeOrderTotals([]);
  check(
    "computeOrderTotals on an empty line list returns a zero subtotal and the flat (non-waived) shipping fee — callers must reject an empty cart before checkout, this function does not special-case it",
    empty.subtotal === 0 && empty.shippingFee === FLAT_SHIPPING_FEE_THB,
    JSON.stringify(empty)
  );

  return results;
}

if (require.main === module) {
  const results = runPricingContractTests();
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
