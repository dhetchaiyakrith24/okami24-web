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
  getPublishedProduct,
  getPublishedProducts,
  getPublishedProductsByCategory,
  getPublishedProductsByBrand,
  getPublishedRelatedProducts,
  searchPublishedProducts,
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
  // Coil-56 graduated from pilot to genuinely published (see publication-approvals.ts) — it is
  // excluded from every getPilotProducts()-derived result below by design (storefront-bridge.ts),
  // so "PnP" now matches only coil-92 within the pilot pool.
  const pnpResults = searchPilotProducts("PnP");
  check(
    'searching "PnP" returns only the one remaining PnP-named pilot product (coil-92) — coil-56 is now published, not pilot',
    pnpResults.length === 1 && pnpResults[0]?.slug === "coil-92",
    JSON.stringify(pnpResults.map((p) => p.slug))
  );

  // --- pilot query by brand ---
  // Phase 3.4 added Coil-1/21/72/83 (voopoo) and Coil-94 (uwell) to the pilot batch (voopoo
  // 3->7, uwell 2->3). Phase 3.5 added Coil-38/68 (voopoo, 7->9) plus the first two rincoe/
  // dotmod products. Coil-56 (voopoo) then graduated to published, dropping this to 8.
  const voopooPilot = searchPilotProducts("voopoo");
  check(
    'searching "voopoo" (lowercase) returns exactly the 8 remaining voopoo pilot products (coil-56 now published, not pilot)',
    voopooPilot.length === 8 && voopooPilot.every((p) => p.brandName.toLowerCase() === "voopoo"),
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
  // Coil-56 (also pods-cartridges) then graduated to published, dropping this pilot count to 7.
  const cartridgeResults = searchPilotProducts("cartridge");
  check(
    '"cartridge" matches the 7 remaining pods-cartridges pilot products via categoryName (coil-56 now published, not pilot)',
    cartridgeResults.length === 7 && cartridgeResults.every((p) => p.categoryId === "pods-cartridges"),
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
  // Coil-56 is now genuinely published, not pilot — getPilotProduct("coil-56") correctly returns
  // undefined (storefront-bridge.ts excludes anything published from the pilot pool); its real
  // identity is proven through getPublishedProduct instead, in the published-bridge section below.
  check("coil-56 is no longer reachable through getPilotProduct — it graduated to published", getPilotProduct("coil-56") === undefined, "n/a");

  // --- category/brand/related bridge helpers stay consistent (Phase 3.0 behavior, re-asserted) ---
  // pods-cartridges grew from 3 to 8 (Coil-68, Pod-150, Pod-169, coil-54, coil-62), then dropped
  // to 7 once Coil-56 graduated to published; coils-accessories stayed at 11; disposables/pod-
  // kits/e-liquid are all new to the pilot this phase.
  check("pods-cartridges category has exactly 7 pilot products (coil-56 now published, not pilot)", getPilotProductsByCategory("pods-cartridges").length === 7, "n/a");
  check("coils-accessories category has exactly 11 pilot products", getPilotProductsByCategory("coils-accessories").length === 11, "n/a");
  check("disposables category has exactly 2 pilot products", getPilotProductsByCategory("disposables").length === 2, "n/a");
  check("pod-kits category has exactly 1 pilot product", getPilotProductsByCategory("pod-kits").length === 1, "n/a");
  // e-liquid is the pilot's first non-device category (ELIQUID-1, Eliquid-109, eliquid-133), all
  // resolving to the existing salthub brand — its first-ever pilot products.
  check("e-liquid category has exactly 3 pilot products", getPilotProductsByCategory("e-liquid").length === 3, "n/a");
  check("voopoo brand has exactly 8 pilot products (coil-56 now published, not pilot)", getPilotProductsByBrand("voopoo").length === 8, "n/a");
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

  // getPilotRelatedProducts still proven with a still-pilot pods-cartridges product (coil-74) —
  // its pilot category-mates are the remaining 6 pods-cartridges pilot products, correctly
  // excluding coil-56 (no longer pilot) and itself.
  const coil74Pilot = getPilotProduct("coil-74");
  if (coil74Pilot) {
    const related = getPilotRelatedProducts(coil74Pilot);
    check(
      "coil-74's related pilot products are exactly coil-68, coil-87, pod-150, pod-169, coil-54, and coil-62 (same categoryId, self + published coil-56 excluded)",
      related.length === 6 && related.every((p) => ["coil-68", "coil-87", "pod-150", "pod-169", "coil-54", "coil-62"].includes(p.slug)),
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

  // ===================================================================================
  // Published bridge — publication-pipeline audit. OWNER_APPROVED_PUBLICATION now has exactly
  // one real entry (Coil-56, ฿300 — see publication-approvals.ts and the mission report), so
  // every published-* function must return EXACTLY that one product and nothing else against
  // REAL data — this proves both "the real approval genuinely surfaces" and "nothing beyond it
  // leaks." Unlike the pilot functions, these are NEVER environment-gated, so this must hold
  // regardless of NODE_ENV.
  // ===================================================================================

  const allPublished = getPublishedProducts();
  check(
    "getPublishedProducts() returns exactly the one genuinely approved product (coil-56)",
    allPublished.length === 1 && allPublished[0]?.slug === "coil-56",
    JSON.stringify(allPublished.map((p) => p.slug))
  );

  const publishedCoil56 = getPublishedProduct("coil-56");
  check(
    "getPublishedProduct('coil-56') returns the real published product with the owner-approved ฿300 price and its one real variant",
    publishedCoil56?.slug === "coil-56" && publishedCoil56?.sellingPrice === 300 && publishedCoil56?.variants.length === 1 && publishedCoil56?.variants[0]?.id === "Coil-56-3",
    JSON.stringify(publishedCoil56)
  );

  check("getPublishedProductsByCategory('coils-accessories') is empty — coil-56 is pods-cartridges, not coils-accessories", getPublishedProductsByCategory("coils-accessories").length === 0, "n/a");
  check(
    "getPublishedProductsByCategory('pods-cartridges') returns exactly coil-56",
    getPublishedProductsByCategory("pods-cartridges").length === 1 && getPublishedProductsByCategory("pods-cartridges")[0]?.slug === "coil-56",
    "n/a"
  );
  check(
    "getPublishedProductsByBrand('voopoo') returns exactly coil-56",
    getPublishedProductsByBrand("voopoo").length === 1 && getPublishedProductsByBrand("voopoo")[0]?.slug === "coil-56",
    "n/a"
  );
  check(
    "searchPublishedProducts('voopoo') returns exactly coil-56",
    searchPublishedProducts("voopoo").length === 1 && searchPublishedProducts("voopoo")[0]?.slug === "coil-56",
    "n/a"
  );
  check("searchPublishedProducts('xyznonexistentquery123') returns nothing", searchPublishedProducts("xyznonexistentquery123").length === 0, "n/a");

  // getPublishedRelatedProducts(coil-56) must be empty — coil-56 is currently the ONLY published
  // product, so there is no other published product to relate it to (self is always excluded).
  if (publishedCoil56) {
    check(
      "getPublishedRelatedProducts(coil-56) returns nothing — it is currently the only published product",
      getPublishedRelatedProducts(publishedCoil56).length === 0,
      "n/a"
    );
  }

  // A still-pilot, different-category product must see zero published relations (no cross-
  // category leakage into the published pool).
  const coil53Pilot = getPilotProduct("coil-53");
  if (coil53Pilot) {
    check(
      "getPublishedRelatedProducts(coil-53, coils-accessories) returns nothing — coil-56 is pods-cartridges, no cross-category leak",
      getPublishedRelatedProducts(coil53Pilot).length === 0,
      "n/a"
    );
  }

  return results;
}
