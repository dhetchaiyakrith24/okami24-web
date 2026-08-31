/**
 * OKami24 — Phase 3.1: storefront-bridge (search/discovery) contract tests.
 *
 * Covers `searchPilotProducts` plus the category/brand/related bridge helpers already exercised
 * manually in Phase 3.0 — proving them with an assertion suite instead of only a browser check.
 */

import { searchProducts, getProduct } from "@/data/products";
import {
  getPilotProduct,
  getPilotProducts,
  getPilotProductsByCategory,
  getPilotProductsByBrand,
  getPilotRelatedProducts,
  searchPilotProducts,
} from "./storefront-bridge";

export interface BridgeContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runStorefrontBridgeContractTests(): BridgeContractResult[] {
  const results: BridgeContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // --- pilot query by model/name ---
  const pnpResults = searchPilotProducts("PnP");
  check(
    'searching "PnP" returns the two real PnP-named pilot products (coil-56, coil-92) and nothing else',
    pnpResults.length === 2 && pnpResults.every((p) => ["coil-56", "coil-92"].includes(p.slug)),
    JSON.stringify(pnpResults.map((p) => p.slug))
  );

  // --- pilot query by brand ---
  const voopooPilot = searchPilotProducts("voopoo");
  check(
    'searching "voopoo" (lowercase) returns exactly the 3 voopoo pilot products',
    voopooPilot.length === 3 && voopooPilot.every((p) => p.brandName.toLowerCase() === "voopoo"),
    JSON.stringify(voopooPilot.map((p) => p.slug))
  );

  // --- legacy + pilot mixed result ---
  const caliburnLegacy = searchProducts("caliburn");
  const caliburnPilot = searchPilotProducts("caliburn");
  check(
    '"caliburn" matches both legacy UWELL Caliburn products and pilot Coil-53/Coil-74 — a real mixed result',
    caliburnLegacy.length > 0 && caliburnPilot.length === 2 && caliburnPilot.every((p) => ["coil-53", "coil-74"].includes(p.slug)),
    `legacy=${caliburnLegacy.length} pilot=${JSON.stringify(caliburnPilot.map((p) => p.slug))}`
  );

  // --- category-name-only match ("cartridge" only appears in the English category name, not
  //     in any pilot tagline, which are in Thai) ---
  const cartridgeResults = searchPilotProducts("cartridge");
  check(
    '"cartridge" matches the 3 pods-cartridges pilot products via categoryName, not a fabricated field',
    cartridgeResults.length === 3 && cartridgeResults.every((p) => p.categoryId === "pods-cartridges"),
    JSON.stringify(cartridgeResults.map((p) => p.slug))
  );

  // --- no false result for unrelated query ---
  const nonsense = searchPilotProducts("xyznonexistentquery123");
  check('a nonsense query returns zero pilot results', nonsense.length === 0, JSON.stringify(nonsense));

  // --- empty query returns nothing (matches legacy searchProducts("") behavior) ---
  check('an empty query returns zero pilot results, same as legacy searchProducts', searchPilotProducts("").length === 0, "n/a");

  // --- production gate returns zero pilot results ---
  const originalEnv = process.env.NODE_ENV;
  // @ts-expect-error -- test-only override of a normally-readonly env var
  process.env.NODE_ENV = "production";
  const prodSearch = searchPilotProducts("voopoo");
  const prodList = getPilotProducts();
  const prodOne = getPilotProduct("coil-56");
  // @ts-expect-error -- restore
  process.env.NODE_ENV = originalEnv;
  check(
    "search + list + single-lookup all return nothing under NODE_ENV=production",
    prodSearch.length === 0 && prodList.length === 0 && prodOne === undefined,
    `search=${prodSearch.length} list=${prodList.length} one=${prodOne}`
  );

  // --- result identity links to the correct /products/<slug> ---
  const coil56 = getPilotProduct("coil-56");
  check(
    "coil-56's slug is exactly the one used by the real /products/[slug] route (no separate preview-only slug)",
    coil56?.slug === "coil-56",
    JSON.stringify(coil56?.slug)
  );

  // --- category/brand/related bridge helpers stay consistent (Phase 3.0 behavior, re-asserted) ---
  check("pods-cartridges category has exactly 3 pilot products", getPilotProductsByCategory("pods-cartridges").length === 3, "n/a");
  check("coils-accessories category has exactly 2 pilot products", getPilotProductsByCategory("coils-accessories").length === 2, "n/a");
  check("voopoo brand has exactly 3 pilot products", getPilotProductsByBrand("voopoo").length === 3, "n/a");
  check("uwell brand has exactly 2 pilot products", getPilotProductsByBrand("uwell").length === 2, "n/a");

  if (coil56) {
    const related = getPilotRelatedProducts(coil56);
    check(
      "coil-56's related pilot products are exactly coil-74 and coil-87 (same categoryId, self excluded)",
      related.length === 2 && related.every((p) => ["coil-74", "coil-87"].includes(p.slug)),
      JSON.stringify(related.map((p) => p.slug))
    );
  }

  // --- none of the 5 pilot slugs collide with a real legacy product slug ---
  const pilotSlugs = ["coil-53", "coil-56", "coil-74", "coil-87", "coil-92"];
  check(
    "no pilot slug collides with an existing legacy product slug",
    pilotSlugs.every((s) => getProduct(s) === undefined),
    JSON.stringify(pilotSlugs)
  );

  return results;
}
