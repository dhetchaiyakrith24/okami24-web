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
  // Coil-56 and Coil-92 both graduated from pilot to genuinely published (see
  // publication-approvals.ts) — both excluded from every getPilotProducts()-derived result below
  // by design (storefront-bridge.ts), so "PnP" no longer matches anything within the pilot pool.
  const pnpResults = searchPilotProducts("PnP");
  check(
    'searching "PnP" returns nothing within the pilot pool — coil-56 and coil-92 are both now published, not pilot',
    pnpResults.length === 0,
    JSON.stringify(pnpResults.map((p) => p.slug))
  );

  // --- pilot query by brand ---
  // Phase 3.4 added Coil-1/21/72/83 (voopoo) and Coil-94 (uwell) to the pilot batch (voopoo
  // 3->7, uwell 2->3). Phase 3.5 added Coil-38/68 (voopoo, 7->9) plus the first two rincoe/
  // dotmod products. Coil-56, Coil-38, then Coil-92 (all voopoo) graduated to published, dropping
  // this to 6.
  const voopooPilot = searchPilotProducts("voopoo");
  check(
    'searching "voopoo" (lowercase) returns exactly the 6 remaining voopoo pilot products (coil-56, coil-38, and coil-92 now published, not pilot)',
    voopooPilot.length === 6 && voopooPilot.every((p) => p.brandName.toLowerCase() === "voopoo"),
    JSON.stringify(voopooPilot.map((p) => p.slug))
  );

  // --- legacy + pilot mixed result ---
  // Phase 3.4's Coil-94 ("คอยล์ Caliburn G4&G3 Series") also matches "caliburn". Coil-55, Coil-74,
  // and now Coil-53 all graduated to published, netting down to 1 (Coil-94 alone).
  const caliburnLegacy = searchProducts("caliburn");
  const caliburnPilot = searchPilotProducts("caliburn");
  check(
    '"caliburn" matches both legacy UWELL Caliburn products and pilot Coil-94 — a real mixed result (coil-53/coil-55/coil-74 all now published, not pilot)',
    caliburnLegacy.length > 0 && caliburnPilot.length === 1 && caliburnPilot[0]?.slug === "coil-94",
    `legacy=${caliburnLegacy.length} pilot=${JSON.stringify(caliburnPilot.map((p) => p.slug))}`
  );

  // --- category-name-only match ("cartridge" only appears in the English category name, not
  //     in any pilot tagline, which are in Thai) ---
  // Phase 3.5 grew pods-cartridges from 3 to 8: Coil-68 ("ITO-X"), Pod-150 ("KS Quikpro"),
  // Pod-169 ("infy"), coil-54/coil-62 (both "Feelin", reclassified from coil to cartridge).
  // Coil-56 graduated to published (8->7); Coil-55 resolution added one back (7->8); Coil-74
  // graduated to published (8->7); Coil-55 itself then also graduated to published (7->6).
  const cartridgeResults = searchPilotProducts("cartridge");
  check(
    '"cartridge" matches the 7 remaining pods-cartridges pilot products via categoryName (coil-56/coil-74/coil-55 published, not pilot; coil-94 reclassified in from coils-accessories)',
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
  // pods-cartridges: grew to 8 (Coil-68/Pod-150/Pod-169/coil-54/coil-62 + original 3), Coil-56
  // published (8->7), Coil-55 resolution (7->8), Coil-74 published (8->7). coils-accessories:
  // stayed at 11 until Coil-89 published this session (11->10). disposables/pod-kits/e-liquid are
  // all new to the pilot this phase.
  check(
    "pods-cartridges category has exactly 7 pilot products (coil-56/coil-74/coil-55 published, not pilot; coil-94 reclassified in from coils-accessories)",
    getPilotProductsByCategory("pods-cartridges").length === 7,
    "n/a"
  );
  check(
    "coils-accessories category has exactly 6 pilot products (coil-89/coil-38/coil-92/coil-53 published, not pilot; coil-94 reclassified out to pods-cartridges)",
    getPilotProductsByCategory("coils-accessories").length === 6,
    "n/a"
  );
  check("disposables category has exactly 2 pilot products", getPilotProductsByCategory("disposables").length === 2, "n/a");
  check("pod-kits category has exactly 1 pilot product", getPilotProductsByCategory("pod-kits").length === 1, "n/a");
  // e-liquid is the pilot's first non-device category (ELIQUID-1, Eliquid-109, eliquid-133), all
  // resolving to the existing salthub brand — its first-ever pilot products.
  check("e-liquid category has exactly 3 pilot products", getPilotProductsByCategory("e-liquid").length === 3, "n/a");
  check("voopoo brand has exactly 6 pilot products (coil-56, coil-38, and coil-92 all now published, not pilot)", getPilotProductsByBrand("voopoo").length === 6, "n/a");
  check("uwell brand has exactly 1 pilot product, coil-94 (coil-53/coil-55/coil-74 all now published, not pilot)", getPilotProductsByBrand("uwell").length === 1, "n/a");
  check("rincoe brand has exactly 1 pilot product (coil-89 now published, not pilot)", getPilotProductsByBrand("rincoe").length === 1, "n/a");
  check("dotmod brand has exactly 1 pilot product", getPilotProductsByBrand("dotmod").length === 1, "n/a");
  check("esko-bar brand has exactly 1 pilot product", getPilotProductsByBrand("esko-bar").length === 1, "n/a");
  check("ske brand has exactly 1 pilot product", getPilotProductsByBrand("ske").length === 1, "n/a");
  check("kardinal-stick brand has exactly 1 pilot product", getPilotProductsByBrand("kardinal-stick").length === 1, "n/a");
  check("instabar brand has exactly 1 pilot product", getPilotProductsByBrand("instabar").length === 1, "n/a");
  check("salthub brand has exactly 3 pilot products", getPilotProductsByBrand("salthub").length === 3, "n/a");
  check("nevoks brand has exactly 2 pilot products", getPilotProductsByBrand("nevoks").length === 2, "n/a");
  check("infy brand has exactly 1 pilot product", getPilotProductsByBrand("infy").length === 1, "n/a");

  // getPilotRelatedProducts still proven with a still-pilot pods-cartridges product — coil-74 and
  // then coil-55 both graduated to published, so coil-68 takes over as the test subject
  // (coil-94 also joined the pilot pool here this session, reclassified in from
  // coils-accessories). Its pilot category-mates are the remaining 6 pods-cartridges pilot
  // products, correctly excluding itself and all three published pods-cartridges products
  // (coil-55, coil-56, coil-74).
  const coil68Pilot = getPilotProduct("coil-68");
  if (coil68Pilot) {
    const related = getPilotRelatedProducts(coil68Pilot);
    check(
      "coil-68's related pilot products are exactly coil-87, coil-94, pod-150, pod-169, coil-54, and coil-62 (same categoryId, self + all three published pods-cartridges products excluded)",
      related.length === 6 && related.every((p) => ["coil-87", "coil-94", "pod-150", "pod-169", "coil-54", "coil-62"].includes(p.slug)),
      JSON.stringify(related.map((p) => p.slug))
    );
  }

  // --- none of the pilot slugs collide with a real legacy product slug ---
  const pilotSlugs = [
    "coil-53", "coil-55", "coil-56", "coil-74", "coil-87", "coil-92",
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
  // Published bridge — publication-pipeline audit. OWNER_APPROVED_PUBLICATION now has seven real
  // entries (Coil-38 ฿450, Coil-53 ฿550, Coil-55 ฿299, Coil-56 ฿300, Coil-74 ฿250, Coil-89 ฿350,
  // Coil-92 ฿130 — see publication-approvals.ts and the mission reports), so every published-*
  // function must return EXACTLY those seven products and nothing else against REAL data — this
  // proves both "the real approvals genuinely surface" and "nothing beyond them leaks." Unlike
  // the pilot functions, these are NEVER environment-gated, so this must hold regardless of
  // NODE_ENV.
  // ===================================================================================

  const allPublished = getPublishedProducts();
  check(
    "getPublishedProducts() returns exactly the seven genuinely approved products (coil-38, coil-53, coil-55, coil-56, coil-74, coil-89, coil-92)",
    allPublished.length === 7 &&
      ["coil-38", "coil-53", "coil-55", "coil-56", "coil-74", "coil-89", "coil-92"].every((s) => allPublished.some((p) => p.slug === s)),
    JSON.stringify(allPublished.map((p) => p.slug))
  );

  const publishedCoil53 = getPublishedProduct("coil-53");
  check(
    "getPublishedProduct('coil-53') returns the real published product with the ฿550 price and its one real variant",
    publishedCoil53?.slug === "coil-53" && publishedCoil53?.sellingPrice === 550 && publishedCoil53?.variants.length === 1 && publishedCoil53?.variants[0]?.id === "Coil-53-2",
    JSON.stringify(publishedCoil53)
  );

  const publishedCoil55 = getPublishedProduct("coil-55");
  check(
    "getPublishedProduct('coil-55') returns the real published product with the ฿299 price and its zero real variants (packaging-only child correctly excluded)",
    publishedCoil55?.slug === "coil-55" && publishedCoil55?.sellingPrice === 299 && publishedCoil55?.variants.length === 0,
    JSON.stringify(publishedCoil55)
  );

  const publishedCoil38 = getPublishedProduct("coil-38");
  check(
    "getPublishedProduct('coil-38') returns the real published product with the ฿450 price and both real variants",
    publishedCoil38?.slug === "coil-38" &&
      publishedCoil38?.sellingPrice === 450 &&
      publishedCoil38?.variants.length === 2 &&
      publishedCoil38?.variants.every((v) => ["Coil-38-2", "Coil-38-4"].includes(v.id)),
    JSON.stringify(publishedCoil38)
  );

  const publishedCoil56 = getPublishedProduct("coil-56");
  check(
    "getPublishedProduct('coil-56') returns the real published product with the owner-approved ฿300 price and its one real variant",
    publishedCoil56?.slug === "coil-56" && publishedCoil56?.sellingPrice === 300 && publishedCoil56?.variants.length === 1 && publishedCoil56?.variants[0]?.id === "Coil-56-3",
    JSON.stringify(publishedCoil56)
  );

  const publishedCoil74 = getPublishedProduct("coil-74");
  check(
    "getPublishedProduct('coil-74') returns the real published product with the ฿250 price and its one real variant",
    publishedCoil74?.slug === "coil-74" && publishedCoil74?.sellingPrice === 250 && publishedCoil74?.variants.length === 1 && publishedCoil74?.variants[0]?.id === "Coil-74-1",
    JSON.stringify(publishedCoil74)
  );

  const publishedCoil89 = getPublishedProduct("coil-89");
  check(
    "getPublishedProduct('coil-89') returns the real published product with the ฿350 price and both real variants",
    publishedCoil89?.slug === "coil-89" &&
      publishedCoil89?.sellingPrice === 350 &&
      publishedCoil89?.variants.length === 2 &&
      publishedCoil89?.variants.every((v) => ["Coil-89-1", "Coil-89-2"].includes(v.id)),
    JSON.stringify(publishedCoil89)
  );

  const publishedCoil92 = getPublishedProduct("coil-92");
  check(
    "getPublishedProduct('coil-92') returns the real published product with the ฿130 price and its one real variant",
    publishedCoil92?.slug === "coil-92" && publishedCoil92?.sellingPrice === 130 && publishedCoil92?.variants.length === 1 && publishedCoil92?.variants[0]?.id === "Coil-92-1",
    JSON.stringify(publishedCoil92)
  );

  const publishedCoilsAccessories = getPublishedProductsByCategory("coils-accessories");
  check(
    "getPublishedProductsByCategory('coils-accessories') returns exactly coil-38, coil-53, coil-89, and coil-92",
    publishedCoilsAccessories.length === 4 && ["coil-38", "coil-53", "coil-89", "coil-92"].every((s) => publishedCoilsAccessories.some((p) => p.slug === s)),
    JSON.stringify(publishedCoilsAccessories.map((p) => p.slug))
  );
  const publishedPodsCartridges = getPublishedProductsByCategory("pods-cartridges");
  check(
    "getPublishedProductsByCategory('pods-cartridges') returns exactly coil-55, coil-56, and coil-74",
    publishedPodsCartridges.length === 3 && ["coil-55", "coil-56", "coil-74"].every((s) => publishedPodsCartridges.some((p) => p.slug === s)),
    JSON.stringify(publishedPodsCartridges.map((p) => p.slug))
  );
  const publishedVoopoo = getPublishedProductsByBrand("voopoo");
  check(
    "getPublishedProductsByBrand('voopoo') returns exactly coil-38, coil-56, and coil-92",
    publishedVoopoo.length === 3 && ["coil-38", "coil-56", "coil-92"].every((s) => publishedVoopoo.some((p) => p.slug === s)),
    JSON.stringify(publishedVoopoo.map((p) => p.slug))
  );
  const publishedUwell = getPublishedProductsByBrand("uwell");
  check(
    "getPublishedProductsByBrand('uwell') returns exactly coil-53, coil-55, and coil-74",
    publishedUwell.length === 3 && ["coil-53", "coil-55", "coil-74"].every((s) => publishedUwell.some((p) => p.slug === s)),
    JSON.stringify(publishedUwell.map((p) => p.slug))
  );
  check(
    "getPublishedProductsByBrand('rincoe') returns exactly coil-89",
    getPublishedProductsByBrand("rincoe").length === 1 && getPublishedProductsByBrand("rincoe")[0]?.slug === "coil-89",
    "n/a"
  );
  const searchVoopooPublished = searchPublishedProducts("voopoo");
  check(
    "searchPublishedProducts('voopoo') returns exactly coil-38, coil-56, and coil-92",
    searchVoopooPublished.length === 3 && ["coil-38", "coil-56", "coil-92"].every((s) => searchVoopooPublished.some((p) => p.slug === s)),
    JSON.stringify(searchVoopooPublished.map((p) => p.slug))
  );
  check("searchPublishedProducts('xyznonexistentquery123') returns nothing", searchPublishedProducts("xyznonexistentquery123").length === 0, "n/a");

  // getPublishedRelatedProducts(coil-56) must return exactly coil-55 and coil-74 — all three are
  // pods-cartridges, coil-38/coil-89/coil-92 are a different category (coils-accessories) so must
  // NOT leak in.
  if (publishedCoil56) {
    const related56 = getPublishedRelatedProducts(publishedCoil56);
    check(
      "getPublishedRelatedProducts(coil-56) returns exactly coil-55 and coil-74 (same category), never coil-38/coil-89/coil-92 (different category) or itself",
      related56.length === 2 && ["coil-55", "coil-74"].every((s) => related56.some((p) => p.slug === s)),
      JSON.stringify(related56.map((p) => p.slug))
    );
  }

  // getPublishedRelatedProducts(coil-89) must return exactly coil-38, coil-53, and coil-92 — all
  // four are now coils-accessories, coil-55/coil-56/coil-74 are a different category
  // (pods-cartridges).
  if (publishedCoil89) {
    const related89 = getPublishedRelatedProducts(publishedCoil89);
    check(
      "getPublishedRelatedProducts(coil-89) returns exactly coil-38, coil-53, and coil-92 (same category), never coil-55/coil-56/coil-74 (different category) or itself",
      related89.length === 3 && ["coil-38", "coil-53", "coil-92"].every((s) => related89.some((p) => p.slug === s)),
      JSON.stringify(related89.map((p) => p.slug))
    );
  }

  // getPublishedRelatedProducts(coil-53) must return exactly coil-38, coil-89, and coil-92 — the
  // same coils-accessories category-mates, symmetric to the coil-89 check above.
  if (publishedCoil53) {
    const related53 = getPublishedRelatedProducts(publishedCoil53);
    check(
      "getPublishedRelatedProducts(coil-53) returns exactly coil-38, coil-89, and coil-92 (same category), never coil-55/coil-56/coil-74 (different category) or itself",
      related53.length === 3 && ["coil-38", "coil-89", "coil-92"].every((s) => related53.some((p) => p.slug === s)),
      JSON.stringify(related53.map((p) => p.slug))
    );
  }

  // A still-pilot product from a category with NO published representation at all (disposables —
  // coil-56/coil-74 are pods-cartridges, coil-89 is coils-accessories) must see zero published
  // relations — real proof of no cross-category leakage into the published pool. (coil-53 is no
  // longer a valid probe for this: it shares coils-accessories with the now-published coil-89, so
  // a non-zero result there would be correct same-category behavior, not a leak.)
  const disposable34Pilot = getPilotProduct("disposable-34");
  if (disposable34Pilot) {
    check(
      "getPublishedRelatedProducts(disposable-34, disposables) returns nothing — no published product is in the disposables category",
      getPublishedRelatedProducts(disposable34Pilot).length === 0,
      "n/a"
    );
  }

  return results;
}
