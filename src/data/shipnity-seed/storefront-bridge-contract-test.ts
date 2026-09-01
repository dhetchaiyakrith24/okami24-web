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
  // Phase 3.4 added Coil-1/21/72/83 (voopoo) and Coil-94 (uwell) to the pilot batch (voopoo
  // 3->7, uwell 2->3). Phase 3.5 added Coil-38/68 (voopoo, 7->9) plus the first two rincoe/
  // dotmod products — see the brand-count assertions below.
  const voopooPilot = searchPilotProducts("voopoo");
  check(
    'searching "voopoo" (lowercase) returns exactly the 9 voopoo pilot products',
    voopooPilot.length === 9 && voopooPilot.every((p) => p.brandName.toLowerCase() === "voopoo"),
    JSON.stringify(voopooPilot.map((p) => p.slug))
  );

  // --- legacy + pilot mixed result ---
  // Phase 3.4's Coil-94 ("คอยล์ Caliburn G4&G3 Series") also matches "caliburn", growing this
  // from 2 to 3 pilot results.
  const caliburnLegacy = searchProducts("caliburn");
  const caliburnPilot = searchPilotProducts("caliburn");
  check(
    '"caliburn" matches both legacy UWELL Caliburn products and pilot Coil-53/Coil-74/Coil-94 — a real mixed result',
    caliburnLegacy.length > 0 && caliburnPilot.length === 3 && caliburnPilot.every((p) => ["coil-53", "coil-74", "coil-94"].includes(p.slug)),
    `legacy=${caliburnLegacy.length} pilot=${JSON.stringify(caliburnPilot.map((p) => p.slug))}`
  );

  // --- category-name-only match ("cartridge" only appears in the English category name, not
  //     in any pilot tagline, which are in Thai) ---
  // Phase 3.5 grew pods-cartridges from 3 to 8: Coil-68 ("ITO-X"), Pod-150 ("KS Quikpro"),
  // Pod-169 ("infy"), coil-54/coil-62 (both "Feelin", reclassified from coil to cartridge).
  const cartridgeResults = searchPilotProducts("cartridge");
  check(
    '"cartridge" matches the 8 pods-cartridges pilot products via categoryName, not a fabricated field',
    cartridgeResults.length === 8 && cartridgeResults.every((p) => p.categoryId === "pods-cartridges"),
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
  // pods-cartridges grew from 3 to 8 (Coil-68, Pod-150, Pod-169, coil-54, coil-62); coils-
  // accessories stayed at 11; disposables/pod-kits/e-liquid are all new to the pilot this phase.
  check("pods-cartridges category has exactly 8 pilot products", getPilotProductsByCategory("pods-cartridges").length === 8, "n/a");
  check("coils-accessories category has exactly 11 pilot products", getPilotProductsByCategory("coils-accessories").length === 11, "n/a");
  check("disposables category has exactly 2 pilot products", getPilotProductsByCategory("disposables").length === 2, "n/a");
  check("pod-kits category has exactly 1 pilot product", getPilotProductsByCategory("pod-kits").length === 1, "n/a");
  // e-liquid is the pilot's first non-device category (ELIQUID-1, Eliquid-109, eliquid-133), all
  // resolving to the existing salthub brand — its first-ever pilot products.
  check("e-liquid category has exactly 3 pilot products", getPilotProductsByCategory("e-liquid").length === 3, "n/a");
  check("voopoo brand has exactly 9 pilot products", getPilotProductsByBrand("voopoo").length === 9, "n/a");
  check("uwell brand has exactly 3 pilot products", getPilotProductsByBrand("uwell").length === 3, "n/a");
  check("rincoe brand has exactly 2 pilot products", getPilotProductsByBrand("rincoe").length === 2, "n/a");
  check("dotmod brand has exactly 1 pilot product", getPilotProductsByBrand("dotmod").length === 1, "n/a");
  check("esko-bar brand has exactly 1 pilot product", getPilotProductsByBrand("esko-bar").length === 1, "n/a");
  check("ske brand has exactly 1 pilot product", getPilotProductsByBrand("ske").length === 1, "n/a");
  check("kardinal-stick brand has exactly 1 pilot product", getPilotProductsByBrand("kardinal-stick").length === 1, "n/a");
  check("instabar brand has exactly 1 pilot product", getPilotProductsByBrand("instabar").length === 1, "n/a");
  check("salthub brand has exactly 3 pilot products", getPilotProductsByBrand("salthub").length === 3, "n/a");
  check("nevoks brand has exactly 2 pilot products", getPilotProductsByBrand("nevoks").length === 2, "n/a");
  check("infy brand has exactly 1 pilot product", getPilotProductsByBrand("infy").length === 1, "n/a");

  if (coil56) {
    const related = getPilotRelatedProducts(coil56);
    check(
      "coil-56's related pilot products are exactly coil-68, coil-74, coil-87, pod-150, pod-169, coil-54, and coil-62 (same categoryId, self excluded)",
      related.length === 7 && related.every((p) => ["coil-68", "coil-74", "coil-87", "pod-150", "pod-169", "coil-54", "coil-62"].includes(p.slug)),
      JSON.stringify(related.map((p) => p.slug))
    );
  }

  // --- none of the pilot slugs collide with a real legacy product slug ---
  const pilotSlugs = [
    "coil-53", "coil-56", "coil-74", "coil-87", "coil-92",
    "coil-1", "coil-21", "coil-72", "coil-83", "coil-94",
    "coil-38", "coil-63", "coil-68", "coil-70", "coil-89",
    "pod-159", "pod-149", "pod-150", "disposable-34",
    "eliquid-1", "eliquid-109", "eliquid-133",
    "coil-54", "coil-62", "pod-169",
  ];
  check(
    "no pilot slug collides with an existing legacy product slug",
    pilotSlugs.every((s) => getProduct(s) === undefined),
    JSON.stringify(pilotSlugs)
  );

  // --- e-liquid pilot products surface through search, resolving to the existing salthub brand ---
  const salthubEliquid = searchPilotProducts("salthub");
  check(
    'searching "salthub" (lowercase) returns exactly the 3 e-liquid pilot products (brand text match)',
    salthubEliquid.length === 3 && salthubEliquid.every((p) => p.brandId === "salthub" && p.categoryId === "e-liquid"),
    JSON.stringify(salthubEliquid.map((p) => p.slug))
  );

  return results;
}
