/**
 * OKami24 — verified catalog relationships (device ↔ consumable, and family siblings).
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Both halves of the catalog already had a compatibility concept, and neither could actually
 * link two real products:
 *
 * - Legacy (`src/types/catalog.ts` → `Compatibility`) is pure free text: `{ type, label }`.
 *   "UWELL GPP cartridge platform" names a *platform*, not a catalog record, so a customer
 *   reading it on the Caliburn G4 page has no way to reach the cartridge that actually fits.
 * - ProductMaster (`CompatibilityLink`) has the right shape — `targetInternalId` — but the
 *   legacy→ProductMaster adapter deliberately leaves it `undefined` for every entry, because
 *   inventing a target from free text would fabricate a relationship (see
 *   `product-master-adapter.ts`'s own comment). It has therefore never been populated.
 *
 * So the storefront's only real relation rule was "same categoryId," which never crosses the
 * Legacy ↔ ProductMaster boundary at all (see `getPublishedRelatedProducts`). A customer looking
 * at the Caliburn G4 could not discover the G4/G3-series cartridge that fits it, even though both
 * are published, real, customer-facing catalog products.
 *
 * WHAT THIS IS (AND DELIBERATELY IS NOT)
 * --------------------------------------
 * This is an explicitly authored, evidence-backed edge table — NOT a recommendation engine and
 * NOT fuzzy matching. Every edge names two real catalog identities and carries its own citation.
 * There is no scoring, no similarity heuristic, and no "customers also viewed": a relationship
 * either has a source that states it, or it does not exist here. A compatibility claim is a
 * functional claim — a wrong one means a customer buys a part that does not fit their device —
 * so the bar is the same evidence discipline the rest of the catalog runs on (see
 * `src/data/shipnity-seed/README.md` §"Identity evidence tiers").
 *
 * IDENTITY SPACE
 * --------------
 * Endpoints are catalog SLUGS, because Legacy and ProductMaster already share one route
 * namespace (`/products/[slug]`) and the two slug spaces are disjoint (legacy slugs are
 * name-derived, `caliburn-g4`; ProductMaster slugs are lowercased Shipnity codes, `coil-94`).
 * That means one edge table can span both halves without a synthetic join key, and the
 * customer-facing result never exposes which half a product came from — which is the point.
 *
 * TWO-LAYER SAFETY
 * ----------------
 * 1. ADMISSION (module load, throws): every endpoint must resolve to a KNOWN identity — a legacy
 *    product, or any projected ProductMaster candidate (published or not). A typo'd or dangling
 *    slug fails the build instead of silently rendering nothing.
 * 2. VISIBILITY (render time, filters): an edge is only ever returned when the endpoint on the
 *    other side is CURRENTLY customer-visible — legacy always, ProductMaster only once genuinely
 *    published. Relationships may therefore be authored ahead of publication: they stay dark, and
 *    light up by themselves the moment `publication-approvals.ts` publishes the other endpoint.
 *    No code change, and no risk of an unpublished product leaking through a relationship link.
 */

import { catalogIncludingHidden } from "@/data/products";
import { getCatalogItem, toCatalogRef, type CatalogRef } from "@/lib/catalog-index";
import { projectActiveCatalog } from "@/data/shipnity-seed/active-catalog-to-product-master";

export type { CatalogRef };

// ===================================================================================
// Types
// ===================================================================================

/** How strong the evidence behind an edge is. Mirrors the tiers in shipnity-seed/README.md —
 *  never upgrade a retailer to "official" because the retailer claims manufacturer sourcing. */
export type RelationshipTier = "official" | "distributor" | "retailer" | "convergence";

/** What the consumable IS in the device's terms. Drives the section wording, so it must describe
 *  the real part, not the Shipnity id prefix (a `Coil-` id is repeatedly a pod — see README). */
export type ConsumableRole = "coil" | "pod" | "cartridge" | "stick" | "accessory";

/**
 * One authored, cited device→consumable edge. Authored in ONE direction only; the reverse
 * ("which devices does this coil fit") is derived, so a pair can never disagree with itself.
 */
export interface DeviceConsumableEdge {
  /** Catalog slug of the device / host side. */
  device: string;
  /** Catalog slug of the consumable / part side. */
  consumable: string;
  role: ConsumableRole;
  /** What the source actually states. Written as a fact, never as marketing copy. */
  evidence: string;
  sourceUrl: string;
  tier: RelationshipTier;
}

/**
 * WHY THERE IS NO "FAMILY / GENERATION SIBLING" EDGE TYPE
 * ------------------------------------------------------
 * One was designed and then deliberately dropped. Every candidate pair examined fell into one of
 * three buckets, none of which justified a second edge type:
 *  - already covered by a device↔consumable edge below (e.g. the Caliburn G2 coil and the pods
 *    that house it);
 *  - already covered by the existing same-category related-products rule (e.g. ILUMA PRIME and
 *    ILUMA standard are both `heated-tobacco-devices`, so they already surface together);
 *  - actively DANGEROUS to assert, because "same family" reads to a customer as "interchangeable"
 *    when it often is not. UWELL's G2-generation pods and the GPP-platform cartridge are the
 *    clearest case: same Caliburn family, explicitly NOT compatible. VOOPOO's PnP and PnP X are
 *    the same trap — a PnP coil does not fit a PnP X pod in either direction.
 * Adding a relation type whose main effect would be to imply false interchangeability is exactly
 * the "fabricated relationship" this file exists to avoid.
 */

// ===================================================================================
// Authored edges — every entry cites a real source. See this file's header for the rules.
// ===================================================================================

export const DEVICE_CONSUMABLE_EDGES: DeviceConsumableEdge[] = [
  // =================================================================================
  // UWELL — CALIBURN G Pod Platform (GPP). TIER 1, the strongest set in the table.
  // myuwell.com's own G Pod Platform page states GPP cartridges are compatible with the
  // CALIBURN G5, G4 and G3 series and enumerates the devices; the resistances it lists
  // (0.4/0.6/0.9/1.2Ω) are an exact match to coil-94's four active variants. Each device's
  // own official page corroborates it independently.
  //
  // NOTE: coil-94's Shipnity name ("คอยล์ Caliburn G4&G3 Series") UNDERSTATES its real reach —
  // the platform covers the G5 line too. The name is left as the real operational string; the
  // edges below carry the accurate compatibility.
  // =================================================================================
  ...(
    [
      ["caliburn-g5", "its own official page states all G Pod Platform cartridges are compatible with CALIBURN GPP series devices, and the GPP cartridge ships in the kit"],
      ["caliburn-g5-lite", "UWELL states all GPP cartridges are compatible with CALIBURN G5, G4 and G3 series devices"],
      ["caliburn-g5-lite-se", "UWELL states all GPP cartridges are compatible with CALIBURN G5, G4 and G3 series devices"],
      ["caliburn-g4-pro", "its own official page states the device is fully compatible with both the previous and upgraded CALIBURN GPP cartridges"],
      ["caliburn-g4-pro-koko", "listed by name in UWELL's own G Pod Platform device enumeration"],
      ["caliburn-g4", "its own official page states the device is fully compatible with both the previous and upgraded CALIBURN GPP cartridges"],
      ["caliburn-g4-mini", "its own official page states the device is fully compatible with both the previous and upgraded CALIBURN GPP cartridges"],
      ["caliburn-g4-classic", "listed by name in UWELL's own G Pod Platform device enumeration"],
      ["caliburn-g3-pro", "listed by name in UWELL's own G Pod Platform device enumeration; UWELL states the upgraded cartridges are also compatible with the CALIBURN G3 series"],
      ["caliburn-g3-pro-koko", "listed by name in UWELL's own G Pod Platform device enumeration"],
    ] as const
  ).map(([device, evidence]): DeviceConsumableEdge => ({
    device,
    consumable: "coil-94",
    role: "cartridge",
    evidence: `UWELL: ${evidence}. The cartridge's four resistances (0.4/0.6/0.9/1.2Ω meshed) match this record's active options exactly.`,
    sourceUrl: "https://www.myuwell.com/g-pod-platform",
    tier: "official",
  })),

  // =================================================================================
  // IQOS — TEREA sticks ↔ ILUMA devices. TIER 1 in both directions.
  // =================================================================================
  {
    device: "iqosheet-16",
    consumable: "iqosheet-15",
    role: "stick",
    evidence: "IQOS states TEREA sticks are designed exclusively for IQOS ILUMA devices, and that ILUMA is designed to be used only with TEREA sticks — the SMARTCORE induction system heats the stick from within, so earlier IQOS generations cannot use them.",
    sourceUrl: "https://www.iqos.com/gb/en/discover-heated-tobacco/buy-terea.html",
    tier: "official",
  },
  {
    device: "iqosheet-18",
    consumable: "iqosheet-15",
    role: "stick",
    evidence: "IQOS states TEREA sticks are designed exclusively for IQOS ILUMA devices, and that ILUMA is designed to be used only with TEREA sticks — the SMARTCORE induction system heats the stick from within, so earlier IQOS generations cannot use them.",
    sourceUrl: "https://www.iqos.com/gb/en/discover-heated-tobacco/buy-terea.html",
    tier: "official",
  },
  {
    device: "iqosheet-14",
    consumable: "iqosheet-15",
    role: "stick",
    // Provenance care: this is LAMBDA's own claim about its own third-party device. IQOS/PMI has
    // never endorsed third-party hardware — its wording ("designed exclusively for IQOS ILUMA
    // devices") is about its own products. The evidence text below therefore attributes the claim
    // to LAMBDA explicitly rather than presenting it as manufacturer-neutral fact.
    evidence: "LAMBDA's own product page markets the i8 as compatible with TEREA and SENTIA SMARTCORE sticks. This is LAMBDA's manufacturer claim about its own device — IQOS does not endorse third-party hardware and states TEREA is designed for IQOS ILUMA devices.",
    sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html",
    tier: "official",
  },

  // =================================================================================
  // VOOPOO — PnP X coil platform. DRAG 6 = TIER 1 since PR #251 (shop.voopoo.com resolves
  // now; www.voopoo.com still does not from this ISP). DRAG S3 / X3 stay TIER 2 until their
  // own shop.voopoo.com pages are read (sitewide-template batch 2).
  //
  // Deliberately NOT linked: coil-1 (original PnP coils) to vinci-s, despite coil-1's name
  // being "Coil Vinci" and both records carrying familyId "vinci". PnP and PnP X are
  // physically non-interchangeable in BOTH directions, and the VINCI S is a PnP X-era
  // device. Linking on the family-name match would be precisely the brand-similarity
  // inference this file forbids — and it would be a genuine mis-sell.
  // =================================================================================
  {
    device: "drag-6",
    consumable: "coil-92",
    role: "coil",
    evidence: "VOOPOO's own DRAG 6 page states the kit's UFORCE-X Tank II takes every PnP X coil, and the kit ships with PnP X 0.15Ω and 0.3Ω coils.",
    sourceUrl: "https://shop.voopoo.com/products/drag-6",
    tier: "official",
  },
  {
    device: "drag-s3",
    consumable: "coil-92",
    role: "coil",
    evidence: "Retailer compatibility list for the VOOPOO PnP X replacement coils names the DRAG S3.",
    sourceUrl: "https://www.alivape.com/products/voopoo-pnp-x-replacement-coils",
    tier: "retailer",
  },
  {
    device: "drag-x3",
    consumable: "coil-92",
    role: "coil",
    evidence: "Retailer compatibility list for the VOOPOO PnP X replacement coils names the DRAG X3.",
    sourceUrl: "https://www.alivape.com/products/voopoo-pnp-x-replacement-coils",
    tier: "retailer",
  },

  // =================================================================================
  // VOOPOO — VMATE cartridges. The strongest VOOPOO link in the set: all four of
  // coil-72's active options (Cartridge V2 0.7Ω/1.2Ω, Top Fill 0.4Ω/0.7Ω) fall inside the
  // VMATE i3's stated compatibility, and the i3 kit ships with a Top Fill 0.7Ω.
  // =================================================================================
  {
    device: "vmate-i3",
    consumable: "coil-72",
    role: "cartridge",
    evidence: "Retailer listings state the VMATE i3 takes both the VMATE Top Fill cartridge (0.4/0.7/1.0Ω, 3ml) and the VMATE Cartridge V2, and the kit ships with a Top Fill 0.7Ω. An EU retailer states the Vmate V3 Top Fill 3ml is compatible with all kits in the Vmate and V.THRU range.",
    sourceUrl: "https://www.calumette.com/en/5146-voopoo-vmate-v3-top-fill-cartridge-2-pack.php",
    tier: "retailer",
  },

  // =================================================================================
  // SALTHUB — M Switch. First-party but a weak evidentiary SURFACE: salthub.com puts all
  // of its specs inside marketing images, so there is no quotable prose compatibility
  // sentence. What does exist is the brand's own product-image alt text on the M Switch
  // Kit page ("M Switch Kit compatible cartridge") plus an exact 16-flavour set match
  // between the Kit page and the Pod page. Recorded as "distributor" tier rather than
  // "official" to reflect that gap honestly.
  // =================================================================================
  {
    device: "m-switch-kit",
    consumable: "m-switch-pod",
    role: "cartridge",
    evidence: "SALTHUB's own M Switch Kit page presents the M Switch Pod as its cartridge (product-image alt text: \"M Switch Kit compatible cartridge\"), and the two pages list an identical 16-flavour set.",
    sourceUrl: "https://www.salthub.com/m-switch-kit/",
    tier: "distributor",
  },

  // =================================================================================
  // UWELL — G/G2-generation pods and the coil they house. These are consumable↔consumable
  // pairs: the HOST here is a pod, not a battery device, because the Caliburn G2 and
  // Caliburn X devices are not in this catalog. The pair is genuinely useful anyway — a
  // customer buying the empty pod needs to know which coil goes in it, and today both
  // halves are published and were previously unreachable from one another.
  // =================================================================================
  {
    device: "coil-55",
    consumable: "coil-53",
    role: "coil",
    evidence: "The Caliburn G2 replacement pod is designed for UWELL's Caliburn G and G2 coils, which is the line this 1.0Ω coil belongs to. Note this generation is NOT interchangeable with the later GPP platform used by the G3/G4/G5 devices.",
    sourceUrl: "https://vapeuk.co.uk/uwell-caliburn-g2-replacement-pods",
    tier: "retailer",
  },
  {
    device: "coil-74",
    consumable: "coil-53",
    role: "coil",
    evidence: "The Caliburn X pod is stated to take Caliburn G or G2 coils (0.8/1.0/1.2Ω), which is the line this 1.0Ω coil belongs to. It is explicitly not for the A or original Caliburn series.",
    sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-x-empty-pods/",
    tier: "retailer",
  },

  // =================================================================================
  // TRUTHFUL NO-LINKS — recorded here so their absence reads as a finding, not an
  // oversight. Each was researched and has no citable in-catalog endpoint:
  //   coil-1  (original PnP coils) — its devices (Vinci/Vinci R/X/Air, Drag X, Drag S,
  //           Navi, Argus GT/Pro, Doric 60) are none of the nine VOOPOO devices here, and
  //           PnP does not interchange with PnP X. See the warning above.
  //   coil-38 (TPP coils) — a 32-80W sub-ohm tank platform; its devices (Drag 3, Drag X
  //           Plus, Argus MT/XT/GT II, MAAT Tank) are all absent. A genuine orphan.
  //   coil-56 (PnP X pod) — at least three distinct "PnP X" cartridges exist (PnP X 5ml,
  //           Argus PnP X 4.5ml, Vinci PnP X); this record carries only colour options, so
  //           which one it is cannot be established. Not safe to link.
  //   coil-68 (ITO-X pod) — fits the Drag Q and Doric E, neither in catalog. The ARGUS
  //           devices share the ITO *coil* but not the ITO-X *pod* — coil sharing is not
  //           pod sharing, and treating it as such would be a real mis-sell.
  //   coil-63 / coil-89 (RINCOE), coil-54 (NEVOKS), coil-70 (dotmod), pod-169 (INFY) —
  //           structural: the catalog contains zero Rincoe, zero Nevoks, zero dotmod, and
  //           zero INFY DEVICES (each brand's only catalog presence is this one consumable),
  //           so no endpoint can exist for any of them regardless of further research.
  //   coil-87 (VOOPOO TPP Pod) — same TPP platform as coil-38 above, same conclusion: its
  //           devices (Drag 3, Drag X Plus) are absent from the catalog.
  //   coil-83 (VOOPOO Argus P1 Empty Cartridge) — the empty-cartridge counterpart to
  //           Coil-21's integrated-coil cartridge, for the SAME reason: no source found
  //           confirms which of the catalog's four ARGUS devices (G4/G4 mini/P3/G3 mini) —
  //           if any — the "P1" cartridge specifically fits. Falls under the same ARGUS gap
  //           noted below rather than a confirmed link to a wrong device.
  //   zero-cartridge → zero-pro / zero-nano — NOT established. salthub.com currently 404s
  //           /zero-cartridge/, /zero-nano/ and /m-bar-pod/, so the legacy catalog's own
  //           free-text claim could not be confirmed at source. The free text is left
  //           untouched (it is plausible brand-internal knowledge from the demo era); it
  //           simply is not promoted to a verified structured link.
  //   m-bar-pod → anything — no SALTHUB page exists and the M Bar 9K is documented as
  //           non-refillable, so which device this cartridge serves is genuinely unclear.
  //           Worth an owner/supplier question rather than more web research.
  // The single biggest attach-rate gap found: argus-g4, argus-g4-mini, argus-p3 and
  // argus-g3-mini have NO compatible consumable in the catalog at all. They need the ARGUS
  // Multi-Ohm Cartridge, the ARGUS Top Fill cartridge, or ITO M-series coils — none stocked.
  // =================================================================================
];

// ===================================================================================
// Identity resolution
// ===================================================================================

/** Every identity this table is allowed to reference: the 28 legacy products plus every
 *  projected ProductMaster candidate, published or not (see "TWO-LAYER SAFETY" #1). Built once
 *  at module load. */
function knownIdentitySlugs(): Set<string> {
  // identity/dedup must see hidden products too — a hidden legacy record is still the same
  // real product, and a Shipnity candidate must not be mistaken for "new" just because it's hidden
  const slugs = new Set(catalogIncludingHidden.map((p) => p.slug));
  for (const result of projectActiveCatalog()) {
    if (result.status === "candidate") slugs.add(result.product.slug);
  }
  return slugs;
}

/**
 * Resolves a slug to a CURRENTLY CUSTOMER-VISIBLE catalog product, or `undefined`.
 *
 * This is the visibility gate from "TWO-LAYER SAFETY" #2, delegated to `catalog-index.ts` — the
 * single place that decides what a customer can reach. A ProductMaster slug that exists as a
 * candidate but is not published resolves to `undefined` here, so no caller can render a link to
 * it — while `knownIdentitySlugs()` below still accepts it at admission time, keeping
 * pre-authored relationships legal.
 */
export function resolveVisibleRef(slug: string): CatalogRef | undefined {
  const item = getCatalogItem(slug);
  return item ? toCatalogRef(item) : undefined;
}

// ===================================================================================
// Admission validation — runs once at module load, same discipline as products/index.ts
// ===================================================================================

const known = knownIdentitySlugs();

for (const edge of DEVICE_CONSUMABLE_EDGES) {
  if (!known.has(edge.device)) {
    throw new Error(`catalog-relationships: unknown device slug "${edge.device}" (consumable "${edge.consumable}")`);
  }
  if (!known.has(edge.consumable)) {
    throw new Error(`catalog-relationships: unknown consumable slug "${edge.consumable}" (device "${edge.device}")`);
  }
  if (edge.device === edge.consumable) {
    throw new Error(`catalog-relationships: self-referential edge on "${edge.device}"`);
  }
}

{
  // A duplicated pair would render the same product twice in one section. Cheap to catch here,
  // invisible if it ever shipped.
  const seen = new Set<string>();
  for (const e of DEVICE_CONSUMABLE_EDGES) {
    const key = `${e.device} ${e.consumable}`;
    if (seen.has(key)) throw new Error(`catalog-relationships: duplicate edge ${e.device} -> ${e.consumable}`);
    seen.add(key);
  }
}

// ===================================================================================
// Public query API — every function returns ONLY currently-visible products
// ===================================================================================

export interface RelatedConsumable {
  ref: CatalogRef;
  role: ConsumableRole;
  evidence: string;
  sourceUrl: string;
  tier: RelationshipTier;
}

export interface RelatedDevice {
  ref: CatalogRef;
  role: ConsumableRole;
  evidence: string;
  sourceUrl: string;
  tier: RelationshipTier;
}

/** "What fits this device" — coils/pods/cartridges/sticks verified to work with `deviceSlug`. */
export function getCompatibleConsumables(deviceSlug: string): RelatedConsumable[] {
  return DEVICE_CONSUMABLE_EDGES.filter((e) => e.device === deviceSlug)
    .map((e) => {
      const ref = resolveVisibleRef(e.consumable);
      return ref ? { ref, role: e.role, evidence: e.evidence, sourceUrl: e.sourceUrl, tier: e.tier } : null;
    })
    .filter((x): x is RelatedConsumable => x !== null);
}

/** "What this part fits" — the derived reverse direction. Never authored separately, so the two
 *  directions cannot drift apart. */
export function getCompatibleDevices(consumableSlug: string): RelatedDevice[] {
  return DEVICE_CONSUMABLE_EDGES.filter((e) => e.consumable === consumableSlug)
    .map((e) => {
      const ref = resolveVisibleRef(e.device);
      return ref ? { ref, role: e.role, evidence: e.evidence, sourceUrl: e.sourceUrl, tier: e.tier } : null;
    })
    .filter((x): x is RelatedDevice => x !== null);
}

/** Reporting/verification helper — how much of the authored table is currently live. Used by the
 *  relationship contract test and the catalog verifier, not by any UI. */
export function relationshipCoverageReport() {
  const dark: string[] = [];
  for (const e of DEVICE_CONSUMABLE_EDGES) {
    if (!resolveVisibleRef(e.device)) dark.push(`${e.device} (device, not yet visible)`);
    if (!resolveVisibleRef(e.consumable)) dark.push(`${e.consumable} (consumable, not yet visible)`);
  }
  return {
    deviceConsumableEdges: DEVICE_CONSUMABLE_EDGES.length,
    liveDeviceConsumableEdges: DEVICE_CONSUMABLE_EDGES.filter(
      (e) => resolveVisibleRef(e.device) && resolveVisibleRef(e.consumable)
    ).length,
    darkEndpoints: [...new Set(dark)],
  };
}
