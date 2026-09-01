/**
 * OKami24 — Phase 2.5/2.6: Active Catalog → ProductMaster projection.
 *
 * Pure, read-only projection from `activeCatalogSeed` (Phase 2.4) toward `ProductMasterInput`
 * (Phase 1/2/2.1/2.3/2.6). Nothing here is imported by any frontend/app code, and nothing here
 * writes to `src/data/products/*` or the legacy catalog. See README.md.
 *
 * === Phase 2.6 revision ===
 * Phase 2.5 found that every one of the 56 active parents was BLOCKED from becoming a
 * ProductMaster record by required `brandId`/`familyId`/`categoryId`/`systemType`/`tagline`/
 * `shortDescription`/`attributes` — fields ProductMaster required unconditionally, with no
 * nullable escape hatch, regardless of lifecycle/publication state. Phase 2.6 made all of those
 * fields nullable at the schema level (admission-time). Only `brandId`/`categoryId`/`tagline`/
 * `shortDescription` are required non-null at PUBLICATION time (see
 * `validateProductMasterRegistry`'s readiness check) — `familyId` is convenience-only,
 * `systemType`/`attributes` are deliberately NOT enforced universally because they are
 * device-specific (a closed enum / an object shaped entirely around screens and charging ports)
 * with no correct value for an e-liquid or IQOS product; see that function's own comment. This
 * file no longer blocks on missing taxonomy/attributes at all. Every parent that isn't an
 * exact-legacy duplicate or a genuine mixed-axis variant problem now becomes a real, schema-
 * valid DRAFT candidate: `lifecycleStatus: "active"` (it genuinely is, per Shipnity's own "have
 * stock" view) and `publicationStatus: "unpublished"` (not customer-visible — evidence is
 * incomplete).
 *
 * Only two block reasons remain, and both are structural, not data-gap:
 * - `identity-matches-existing-legacy-product` — a dedup/merge case, not a new-record case.
 * - `mixed-variant-axis` — the variant children genuinely span more than one optionType.
 */

import type { ProductMasterInput } from "@/data/product-master-schema";
import type { ProductAsset, SystemType } from "@/types/catalog";
import type { OptionType } from "./classify";
import { activeCatalogSeed, type ActiveParentRecord, type ActiveChildRecord } from "./build-active-catalog";
import { getPublicationApproval } from "./publication-approvals";

/** When this seed's evidence was captured/authored — used for every `observedAt`/`capturedAt`/
 *  `lastSyncedAt` stamp below. Reflects the Phase 2.4/2.5 authoring session, not a literal
 *  Shipnity server timestamp (none was visible in the screenshots). */
export const CAPTURE_DATE = "2026-08-31T00:00:00.000Z";

const AXIS_LABEL_TH: Record<Exclude<OptionType, "unresolved">, string> = {
  color: "สี",
  flavor: "รสชาติ",
  resistance: "ความต้านทาน",
  size: "ขนาด",
  strength: "ความเข้มข้น",
};

function slugifyValue(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// ===================================================================================
// Taxonomy identity matches — evidence-driven only. Every entry below is justified by
// EXPLICIT text in the Shipnity product name matching an EXISTING brand/family already
// committed in src/data/brands.ts / families.ts (never the reverse: never picking a brand
// from outside knowledge of what a coil platform "really" is). Substring matches that could
// be a false positive (e.g. "Marbo Zero Pro" containing "Zero" — a SALTHUB family name — but
// clearly Marbo's own product line, not SaltHub's) are deliberately excluded. Parents with no
// entry here are still admitted (Phase 2.6) as a draft with brandId/familyId/categoryId/
// systemType all null — absence of a taxonomy match is no longer an admission blocker.
// ===================================================================================

interface TaxonomyMatch {
  brandId: string;
  /** Absent when the brand is explicit in the text but no matching family/product-line record
   *  exists yet (e.g. "Voopoo PnP-X" — brand=voopoo confirmed, but no "PnP" family is committed). */
  familyId?: string;
  /** Present only when categoryId/systemType can be determined with real evidence too. */
  categoryId?: string;
  systemType?: SystemType;
  /** Present only when this Shipnity parent IS the same physical product as an existing
   *  legacy ProductMaster record — a dedup/merge case, not a new-record case. */
  exactLegacyMatch?: string;
  evidence: string;
}

const TAXONOMY_MATCHES: Record<string, TaxonomyMatch> = {
  "Coil-1": { brandId: "voopoo", familyId: "vinci", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Vinci" (VOOPOO VINCI family) + Shipnity "Coil-" prefix' },
  "Coil-21": { brandId: "voopoo", familyId: "argus", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Argus" (VOOPOO ARGUS family) + Shipnity "Coil-" prefix' },
  // Resolution (this session) — the earlier "0.8Ω/1.2Ω-only" mismatch note (see
  // VERIFIED_SPECIFICATIONS's old comment) was based on an incomplete search snippet. Fetched
  // myuwell.com/caliburn/caliburn-g2 directly: its own text states the Caliburn G2 device is
  // "Compatible with 1.0 Ω coil and 0.8 Ω coil of Caliburn G" — i.e. 1.0Ω is a real, official
  // UWELL coil resistance (from the original Caliburn G coil lineup, explicitly documented as
  // G2-compatible), not a fabricated or mismatched value. Independently confirmed by Giant Vapes,
  // whose "Uwell CALIBURN G Replacement Coils" product lists exactly two variants, "0.8 ohm" and
  // "1.0 ohm" — an exact match to this record's own active variant. Kept as categoryId
  // "coils-accessories"/systemType "coil" (unchanged) — the resolution is about the resistance
  // value's identity, not the product type.
  "Coil-53": { brandId: "uwell", familyId: "caliburn", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Caliburn" (UWELL CALIBURN family) + Shipnity "Coil-" prefix; active variant (1.0Ω) is the real UWELL "Caliburn G" replacement-coil resistance, documented as Caliburn G2-compatible on myuwell.com\'s own G2 page and confirmed by Giant Vapes\' "Caliburn G Replacement Coils" (0.8Ω/1.0Ω) listing' },
  // Correction (this session) — resolves the Phase 3.4 "Coil-55 vs Coil-53" deferral below (kept
  // for history). "หัวแทงค์" (tank-head) is NOT the coil: 10+ independent retailers consistently
  // describe "UWELL Caliburn G2 Empty Replacement Pod" as a real, distinct product — the
  // refillable 2mL POD/TANK itself, sold separately from the coil it houses ("compatible with
  // Caliburn G2 Coils"). This record's own child ("1 กล่อง / มี 2ตัว" — a box of 2) matches the
  // retail "2-pack" pod listing exactly, not a coil pack. Same "หัว(...) doesn't reliably mean
  // coil" pattern already found for Coil-56/68/74/87/coil-54/coil-62 — now resolved for Coil-55
  // specifically, not assumed from the pattern alone.
  "Coil-55": { brandId: "uwell", familyId: "caliburn", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Caliburn" (UWELL CALIBURN family); "หัวแทงค์" + 2-piece box child matches the official Caliburn G2 empty replacement pod (2mL, top-fill, houses the coil), not the coil itself — genuinely distinct from Coil-53' },
  "Coil-72": { brandId: "voopoo", familyId: "vmate", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Vmate" (VOOPOO VMATE family) + Shipnity "Coil-" prefix' },
  // Phase 2.8 correction — official UWELL evidence (myuwell.com/caliburn/caliburn-x) describes
  // the Caliburn X as having a 3 ml REFILLABLE POD with separately replaceable coils. This
  // record's own child ("3ml. / 1 กล่อง 2 หัว" — a 3ml capacity, a pod-level spec, not a coil
  // spec) matches the pod, not a bare coil head, despite the Shipnity name saying "หัวเปล่า"
  // (bare head). categoryId/systemType corrected to the existing "pods-cartridges"/
  // "pod-cartridge" values — no new taxonomy needed, both already exist.
  "Coil-74": { brandId: "uwell", familyId: "caliburn", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Caliburn" (UWELL CALIBURN family); child spec (3ml capacity) matches the official Caliburn X refillable pod, not a coil' },
  "Coil-83": { brandId: "voopoo", familyId: "argus", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Argus" (VOOPOO ARGUS family) + Shipnity "Coil-" prefix' },
  // Correction (this session) — same "หัว(...)/"Coil-" doesn't reliably mean bare coil" pattern
  // as Coil-55/56/68/74/87/54/62. Giant Vapes' real "Uwell CALIBURN G3 Replacement Pods" product
  // lists exactly four resistance options — "0.4 ohm Meshed"/"0.6 ohm Meshed"/"0.9 ohm Meshed"/
  // "1.2 ohm Meshed" — an EXACT match to this record's own four active variants (0.4Ω/0.6Ω/0.9Ω/
  // 1.2Ω), and its own product photo shows a real retail box printed "CALIBURN G3 INTEGRATED COIL
  // CARTRIDGE" / "0.4 Ω" / "2 ml" — a pod with a built-in coil, not a bare replacement coil.
  // categoryId/systemType corrected to "pods-cartridges"/"pod-cartridge".
  "Coil-94": { brandId: "uwell", familyId: "caliburn", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Caliburn G4&G3" (UWELL CALIBURN family); four active resistance variants (0.4Ω/0.6Ω/0.9Ω/1.2Ω) match Giant Vapes\' "Caliburn G3 Replacement Pods" exactly, whose own product photo shows a real retail box reading "CALIBURN G3 INTEGRATED COIL CARTRIDGE" — a pod, not a bare coil' },
  // Phase 2.7 — brand explicit in text ("Voopoo"), but "PnP"/"TPP" are not committed families —
  // familyId genuinely absent, not a fabricated guess.
  //
  // Phase 2.8 correction — official VOOPOO evidence: the "PnP X Cartridge" comes in
  // Black/Grey/Silver, matching THIS record's active variants (Black/Gray/Silver) exactly —
  // this is the cartridge/pod, not a coil (VOOPOO's PnP X *coils* are a separate resistance-
  // variant product). categoryId/systemType corrected to "pods-cartridges"/"pod-cartridge".
  "Coil-56": { brandId: "voopoo", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า Voopoo PnP-X" states "Voopoo" explicitly; active variants (Black/Gray/Silver) match the official PnP X Cartridge color range, not the resistance-variant coil' },
  // Phase 2.8 correction — VOOPOO documents "TPP Pod"/"Pod Tank" as a distinct product from TPP
  // coils; the Shipnity name itself literally says "Pod". categoryId/systemType corrected.
  "Coil-87": { brandId: "voopoo", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "Voopoo TPP Pod" states "Voopoo" explicitly and literally says "Pod" — VOOPOO documents TPP Pod/Pod Tank separately from TPP coils' },
  // Confirmed coil (Phase 2.8 official-evidence pass) — VOOPOO's PnP X coil line (resistance
  // variants) is a real, separate product from the PnP X Cartridge above.
  "Coil-92": { brandId: "voopoo", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "คอยล์ Voopoo PnP X" states "Voopoo" explicitly — official VOOPOO PnP X coils (resistance variants) confirm this is a real coil line, distinct from the PnP X Cartridge' },
  // Phase 3.5 resolution — the Phase 2.7 blocker was "coincidental family-name match, no real
  // brand evidence." Real evidence now exists: this parent's children are FLAVORS (Grape Aloe,
  // Strawberry Watermelon, Apple Aloe), matching a prefilled-cartridge product shape, not a
  // device-body shape — and legacy `m-switch-pod` (SALTHUB M Switch Pod, the prefilled cartridge
  // for the M Switch Kit) is exactly that shape. Legacy `m-switch-kit`'s own copy states the pod
  // is "rated up to 15,000 puffs per pod" — an exact match to this parent's own "15k" name. This
  // is the same real-world item as `m-switch-pod`, not a new record.
  "Pod-147": { brandId: "salthub", familyId: "m-switch", exactLegacyMatch: "m-switch-pod", evidence: 'name "M Switch 15k" + flavor-shaped children (cartridge, not device) + legacy m-switch-kit copy stating its pod is "rated up to 15,000 puffs per pod" — an exact match, not a coincidental family-name substring' },
  "Pod-168": { brandId: "uwell", familyId: "caliburn", exactLegacyMatch: "caliburn-g4-pro", evidence: 'name "Caliburn G4 Pro" is an exact match to legacy product internalId "caliburn-g4-pro" (displayName "UWELL CALIBURN G4 PRO")' },
  "Pod-177": { brandId: "voopoo", familyId: "vmate", exactLegacyMatch: "vmate-i3", evidence: 'name "Vmate i3" is an exact match to legacy product internalId "vmate-i3" (displayName "VOOPOO VMATE i3")' },
  "Pod-179": { brandId: "voopoo", familyId: "argus", exactLegacyMatch: "argus-g4", evidence: 'name "Voopoo Argus G4" is an exact match to legacy product internalId "argus-g4" (displayName "VOOPOO ARGUS G4")' },

  // Resolves the Marbo↔Salthub deferral (previously "genuinely ambiguous relationship" — see the
  // catalog-expansion report). New this session: the OFFICIAL salthub.com site's own backend
  // still carries "Marbo-LOGO" image filenames, and its CURRENT product lineup is exactly "M Bar
  // series (9K / 10K / 15K)" and "ZERO PRO" — i.e. Marbo is the brand's OLD name, not a separate
  // company. Independently corroborated by vapeauras.com's own collection copy: "Explore
  // Salthub—your one-stop vape brand featuring the Marbo Bar 9K disposable vape, the sleek Marbo
  // Zero pod device, and the high-capacity Marbo M Switch device." Two of the three device-Marbo
  // Shipnity records are exact duplicates of already-existing legacy products (see below); only
  // Marbo Bar 9K is a genuinely new SKU (legacy only has the 10K generation).
  "Pod-178": { brandId: "salthub", familyId: "zero", exactLegacyMatch: "zero-pro", evidence: 'name "Marbo Zero Pro" is the pre-rebrand name of legacy "zero-pro" (SALTHUB ZERO PRO) — official salthub.com currently sells this exact device as "ZERO PRO"; color variants (Gunmetal/Copper/Charcoal Red/Blue Purple/Champagne) match a device-body shape, not a cartridge' },
  "Pod-85": { brandId: "salthub", familyId: "zero", exactLegacyMatch: "zero-cartridge", evidence: 'name "หัวพอต Marbo Zero" (Marbo Zero pod head) + flavor-shaped children (Apple Aloe, Fruit Tea) is the pre-rebrand name of legacy "zero-cartridge" (SALTHUB ZERO CARTRIDGE) — both are the same 2.2mL prefilled cartridge for the Zero Pro/Zero Nano device bodies' },
  // Marbo Bar 9K — CORRECTED mid-session: initially treated as a genuinely new SKU (legacy only
  // seemed to have the 10K generation at a glance), but legacy in fact already has `m-bar-9k`
  // (full real data: real photo, specs, everything) — same dedup pattern as Pod-178/Pod-85 above,
  // just missed on the first pass by checking the official site's claim without directly
  // grep-checking every `id: "m-bar-*"` in salthub.ts first. Same evidence chain otherwise.
  "Disposable-25": { brandId: "salthub", familyId: "m-bar", exactLegacyMatch: "m-bar-9k", evidence: 'name "Marbo Bar 9K" is the pre-rebrand name of legacy "m-bar-9k" (SALTHUB M BAR 9K) — official salthub.com currently sells this exact 9,000-puff SKU as part of its "M Bar series (9K / 10K / 15K)"' },

  // ===================================================================================
  // Phase 3.5 — second real-brand batch, verified against official first-party sources (see the
  // Phase 3.5 report for the WebSearch/WebFetch evidence trail). Same rule as every entry above:
  // never a guess, never a name coincidence, always cited.
  // ===================================================================================
  "Coil-38": { brandId: "voopoo", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "Coil TPP" + children "TPP-DM2 (0.2Ω)"/"TPP-DM4 (0.3Ω)" match shop.voopoo.com\'s official TPP Coils listing (0.2Ω/0.3Ω variants, compatible with TPP Pod/DRAG 3/DRAG X Plus) exactly' },
  // "หัวเปล่า" ("bare/empty head") in this seed's naming does not reliably mean coil — same
  // correction as Coil-74/56/87 above. This parent's only child is a COLOR ("Black"), not a
  // resistance value; official VOOPOO/retailer evidence confirms "ITO-X Empty Pod Cartridge" is
  // sold in Black/Silver, and shop.voopoo.com lists "ITO-X Pod (3.5ml)" as a real pod-cartridge
  // product (for the Drag Q Pod Kit) — a color-variant cartridge, not a resistance-variant coil.
  "Coil-68": { brandId: "voopoo", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า ITO-X" + single color child ("Black") matches official VOOPOO "ITO-X Pod Cartridge 3.5mL" (Black/Silver), not the separate ITO resistance-variant coil line' },
  "Coil-70": { brandId: "dotmod", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "คอยล์ Dotmod Aio V2" states the brand explicitly ("Dotmod"); child "0.7Ω" matches dotmod.com\'s official dotCoils lineup for the dotAIO V2 (0.3Ω/0.7Ω/0.9Ω)' },
  "Coil-63": { brandId: "rincoe", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "Coil Jelly Nano" + child "0.5Ω" matches RINCOE\'s official Jellybox Nano replacement coil (0.5Ω RDL / 1.0Ω MTL mesh options)' },
  "Coil-89": { brandId: "rincoe", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "Coil Jellybox V" + children "0.8Ω"/"1.0Ω" match RINCOE\'s official Jellybox V replacement pod/coil options (0.8Ω and 1.0Ω mesh) exactly' },

  // Third Phase 3.5 wave — disposables/cartridges, verified against each brand's official
  // first-party site (WebFetch, not a retailer or reseller). Every one of these has flavor-shaped
  // children (a real prefilled-product signature), consistent with its resolved systemType.
  "Pod-159": { brandId: "esko-bar", categoryId: "pod-kits", systemType: "pod-kit", evidence: 'name "เครื่อง Esko Bar Switch 20k" ("เครื่อง" = device) states the brand explicitly; eskobarvape.com (official) lists "ESKO BAR SWITCH POD" as a real reusable-body product line distinct from its disposable line' },
  "Pod-149": { brandId: "ske", categoryId: "disposables", systemType: "disposable", evidence: 'name "SKE Crystal B20K Puffs" states the brand explicitly; skevape.com (official) confirms SKE\'s Crystal Bar / high-puff-count disposable series as a real product line' },
  "Pod-150": { brandId: "kardinal-stick", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "KS Quikpro 15K หัวพอต" ("หัวพอต" = pod cartridge) states the brand explicitly ("KS"); kardinal.com (official) confirms Quikpro as a real hybrid-cartridge product rated "up to 15,000 puffs" — an exact match to this parent\'s own "15K" name' },
  "Disposable-34": { brandId: "instabar", categoryId: "disposables", systemType: "disposable", evidence: 'Shipnity\'s own "Disposable-" id prefix + name "Insta Bar PX 15000 Puffs" states the brand explicitly; instabar.net (official) confirms Instabar as a real disposable-vape manufacturer with a tiered puff-count product range including a 15,000-puff tier' },

  // ===================================================================================
  // Phase 3.5 (E-liquid wave) — first e-liquid ProductMaster candidates. `categoryId: "e-liquid"`
  // (see categories.ts), `systemType` deliberately omitted (stays null — SystemType is a closed
  // device enum with no correct e-liquid value, an already-supported non-blocking state, see
  // validateProductMasterRegistry's own comment). All three resolve to the EXISTING `salthub`
  // brand — no new Brand record needed. "Salt Hub" appears explicitly in eliquid-133's own
  // Shipnity name; for ELIQUID-1/Eliquid-109 ("Marboro"), multiple independent Thai retailers
  // (thai-vapes.com, vape69th.com, goatvapethai.com) consistently describe the Marboro salt-nic
  // line as produced "by Salt Hub" — convergent tier-2 (distributor/retailer) evidence, not a
  // single source's idiosyncratic categorization. This is evidence about the E-LIQUID line
  // specifically and does NOT resolve the separate, still-unresolved Marbo-device question (see
  // MINIMUM_COPY's Coil-55 comment and the Phase 3.5 report §MARBO) — kept deliberately separate.
  "ELIQUID-1": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "MARBORO SALT NIC 30 ML"; 3 independent Thai retailers (thai-vapes.com "Salt Hub - Marbo Salt Nic", vape69th.com, goatvapethai.com) consistently attribute the Marboro salt-nic line to Salt Hub' },
  "Eliquid-109": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "Marboro Freebase ขวดยาว" — same Marboro/Salt Hub evidence as ELIQUID-1, different nicotine formulation (freebase vs. salt nic) and bottle format' },
  "eliquid-133": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "Yogurt Salt Hub" states the brand explicitly and directly — no inference needed' },

  // Part B (device wave 2) — "Feelin" resolves to NEVOKS (nevoks.com, official): both Feelin Mini
  // and Feelin C1 are confirmed real pod-system products in Nevoks' own FEELIN series. Both
  // parents are reclassified pod-cartridge, not coil — same "หัวเปล่า doesn't reliably mean coil"
  // correction as Coil-56/68/74/87 above, now confirmed a 5th/6th time: coil-54's only child is
  // packaging text ("2 heads per box"), matching a real retailer listing for "Feelin Mini pod
  // cartridge... 2 empty tanks, 2ml capacity" (a refillable cartridge, not a coil); coil-62's only
  // child is "Matcha Clear" — a FLAVOR, not a resistance value, meaning this is a prefilled
  // cartridge for the Feelin C1, not its separate SPL10-branded coil line.
  "coil-54": { brandId: "nevoks", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า Feelin Mini" + sell-unit-only child (no resistance value) matches a real retailer listing for the Feelin Mini refillable pod cartridge (2 empty tanks, 2ml); nevoks.com confirms Feelin Mini as a real Nevoks product, with its actual coils sold separately as "SPL10"' },
  "coil-62": { brandId: "nevoks", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า Feelin C1" + single FLAVOR child ("Matcha Clear", not a resistance value) confirms this is a prefilled cartridge for the Feelin C1, not its separate SPL10-branded coil; nevoks.com confirms Feelin C1 as a real Nevoks product' },
  // "หัว infy 2.5 ml" — brand explicit; INFY's own official site (infy.my) lists "2.5ML Cartridge"
  // as a real current product line — an exact size match, not a coincidence.
  "Pod-169": { brandId: "infy", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัว infy 2.5 ml" states the brand explicitly; infy.my (official) lists "2.5ML Cartridge" as a real INFY product line — an exact size match' },
};

// ===================================================================================
// Minimum-enrichment copy — Phase 2.7. Identity/type/brand level only, verbatim from the
// product's own Shipnity model name. Never a compatibility claim ("for", "สำหรับ" — that
// implies verified fit with a separate device we have not confirmed), never a spec/performance
// claim (puff count, battery, charging derived from a "9K"/"15K"-style model number), never
// manufacturer marketing copy we did not source. Present ONLY for products whose brand already
// has a real, non-fabricated Brand record (see BRAND SCHEMA CHECK in the Phase 2.7 report) —
// currently just the UWELL/VOOPOO-branded coils; Marbo/Muro/Nexbar are deliberately absent here
// because adding them would require a Brand record with fabricated tagline/description/
// referenceUrl, which Phase 2.7 explicitly refused to do.
// ===================================================================================

interface MinimumCopy {
  tagline: string;
  shortDescription: string;
}

const MINIMUM_COPY: Record<string, MinimumCopy> = {
  // Correction (review pass) — "คอยล์ Caliburn G2" (unqualified) would imply UWELL has a
  // separate NATIVE "Caliburn G2 1.0Ω" coil, which the evidence does not support (UWELL's own G2
  // page lists its native coils as 0.8Ω/1.2Ω only). The real evidence is narrower: this IS the
  // UWELL "Caliburn G" 1.0Ω coil, and myuwell.com's G2 page documents it as G2-compatible — see
  // TAXONOMY_MATCHES["Coil-53"]. Worded to state the real product (Caliburn G, 1.0Ω) plus the
  // actual compatibility fact (G2), never a native-G2-coil claim.
  "Coil-53": {
    tagline: "คอยล์ Caliburn G (1.0Ω) จากแบรนด์ UWELL ใช้ได้กับ Caliburn G2",
    shortDescription: "คอยล์ Caliburn G ความต้านทาน 1.0Ω จากแบรนด์ UWELL ใช้ได้กับอุปกรณ์ Caliburn G และ Caliburn G2",
  },
  // New this session — resolves the Phase 3.4 deferral. Worded distinctly from Coil-53 ("คอยล์"
  // = coil vs "พอตเปล่า" = empty pod) on purpose: these are two genuinely different real products
  // that must never read as a duplicate listing. See TAXONOMY_MATCHES["Coil-55"] for the evidence.
  "Coil-55": {
    tagline: "พอตเปล่า Caliburn G2 จากแบรนด์ UWELL",
    shortDescription: "พอตเปล่ารุ่น Caliburn G2 (บรรจุ 2 ชิ้น) เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL แยกชิ้นจากคอยล์",
  },
  // Phase 2.8 correction — was worded as a coil ("คอยล์"); official VOOPOO evidence (matching
  // active variant colors) identifies this as the PnP X cartridge, not a coil. See
  // TAXONOMY_MATCHES["Coil-56"] for the evidence.
  "Coil-56": {
    tagline: "คาร์ทริดจ์ Voopoo PnP-X",
    shortDescription: "คาร์ทริดจ์รุ่น PnP-X จากแบรนด์ VOOPOO",
  },
  // Phase 2.8 correction — was worded as a bare coil head ("หัวคอยล์เปล่า"); official UWELL
  // evidence describes the Caliburn X as a 3ml refillable pod. See
  // TAXONOMY_MATCHES["Coil-74"] for the evidence.
  "Coil-74": {
    tagline: "พอต Caliburn X จากแบรนด์ UWELL",
    shortDescription: "พอตรุ่น Caliburn X เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL",
  },
  // Phase 2.8 correction — was worded as a coil; the Shipnity name itself says "Pod", and
  // VOOPOO documents TPP Pod separately from TPP coils. See TAXONOMY_MATCHES["Coil-87"].
  "Coil-87": {
    tagline: "พอต Voopoo TPP Pod",
    shortDescription: "พอตรุ่น TPP Pod จากแบรนด์ VOOPOO",
  },
  "Coil-92": {
    tagline: "คอยล์ Voopoo PnP X",
    shortDescription: "คอยล์รุ่น PnP X จากแบรนด์ VOOPOO",
  },
  // Phase 3.4 — second enrichment batch. Same rule as above: identity/brand/family level only,
  // assembled from fields already verified in TAXONOMY_MATCHES (brand.name/family.name) plus the
  // Shipnity record's own model text. No spec/performance/compatibility claim added.
  //
  // "Coil-55" ("หัวแทงค์ Caliburn G2") was deferred here through Phase 3.4 pending exactly this
  // resolution — see TAXONOMY_MATCHES["Coil-55"]'s comment for the evidence now resolving it as a
  // genuinely distinct product (empty pod, not the coil). Its own entry now lives below, in the
  // Phase 2.8-style correction block, not this identity-only batch.
  "Coil-1": {
    tagline: "คอยล์ Vinci จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น Vinci เป็นผลิตภัณฑ์ในกลุ่ม VINCI จากแบรนด์ VOOPOO",
  },
  "Coil-21": {
    tagline: "คอยล์ Argus Pod จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น Argus Pod เป็นผลิตภัณฑ์ในกลุ่ม ARGUS จากแบรนด์ VOOPOO",
  },
  "Coil-72": {
    tagline: "คอยล์ Vmate Infinity Edition จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น Vmate Infinity Edition เป็นผลิตภัณฑ์ในกลุ่ม VMATE จากแบรนด์ VOOPOO",
  },
  "Coil-83": {
    tagline: "คอยล์ Argus P1 จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น Argus P1 เป็นผลิตภัณฑ์ในกลุ่ม ARGUS จากแบรนด์ VOOPOO",
  },
  // Correction (this session) — was worded as a bare coil ("คอยล์"); real Giant Vapes evidence
  // (exact 0.4Ω/0.6Ω/0.9Ω/1.2Ω match + retail box reading "INTEGRATED COIL CARTRIDGE") identifies
  // this as the pod, not a bare coil. See TAXONOMY_MATCHES["Coil-94"] for the evidence.
  "Coil-94": {
    tagline: "คาร์ทริดจ์ Caliburn G4&G3 Series จากแบรนด์ UWELL",
    shortDescription: "คาร์ทริดจ์รุ่น Caliburn G4&G3 Series เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL",
  },
  // Phase 3.5 — second batch. No familyId on any of these (TPP/ITO-X/Jelly Nano/Jellybox
  // V/Dotmod Aio V2 are not committed ProductFamily records), so shortDescription omits the
  // "เป็นผลิตภัณฑ์ในกลุ่ม X" clause — same convention as Coil-56/87/92 above.
  "Coil-38": {
    tagline: "คอยล์ TPP จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น TPP จากแบรนด์ VOOPOO",
  },
  "Coil-63": {
    tagline: "คอยล์ Jelly Nano จากแบรนด์ RINCOE",
    shortDescription: "คอยล์รุ่น Jelly Nano จากแบรนด์ RINCOE",
  },
  "Coil-68": {
    tagline: "คาร์ทริดจ์ ITO-X จากแบรนด์ VOOPOO",
    shortDescription: "คาร์ทริดจ์รุ่น ITO-X จากแบรนด์ VOOPOO",
  },
  "Coil-70": {
    tagline: "คอยล์ Dotmod Aio V2 จากแบรนด์ DOTMOD",
    shortDescription: "คอยล์รุ่น Dotmod Aio V2 จากแบรนด์ DOTMOD",
  },
  "Coil-89": {
    tagline: "คอยล์ Jellybox V จากแบรนด์ RINCOE",
    shortDescription: "คอยล์รุ่น Jellybox V จากแบรนด์ RINCOE",
  },
  // Third Phase 3.5 wave — same template, extended with two more real, established Thai vape-
  // retail type-words: "ชุดอุปกรณ์" (device kit, for a pod-kit systemType) and "พอตใช้แล้วทิ้ง"
  // (disposable pod, for a disposable systemType) — factual category words, not marketing copy.
  "Pod-159": {
    tagline: "ชุดอุปกรณ์ Esko Bar Switch 20k จากแบรนด์ ESKO BAR",
    shortDescription: "ชุดอุปกรณ์รุ่น Esko Bar Switch 20k จากแบรนด์ ESKO BAR",
  },
  "Pod-149": {
    tagline: "พอตใช้แล้วทิ้ง SKE Crystal B20K Puffs จากแบรนด์ SKE",
    shortDescription: "พอตใช้แล้วทิ้งรุ่น SKE Crystal B20K Puffs จากแบรนด์ SKE",
  },
  "Pod-150": {
    tagline: "คาร์ทริดจ์ KS Quikpro 15K จากแบรนด์ KS",
    shortDescription: "คาร์ทริดจ์รุ่น KS Quikpro 15K จากแบรนด์ KS",
  },
  "Disposable-34": {
    tagline: "พอตใช้แล้วทิ้ง Insta Bar PX 15000 Puffs จากแบรนด์ INSTABAR",
    shortDescription: "พอตใช้แล้วทิ้งรุ่น Insta Bar PX 15000 Puffs จากแบรนด์ INSTABAR",
  },
  // E-liquid wave — "น้ำยา" (e-liquid/juice), the same plain, factual type word used throughout
  // Thai vape retail (including in this session's own research results), not invented marketing
  // language. No family grouping clause: no ProductFamily record exists for "Marboro" or
  // "Yogurt" — same convention as every brand-explicit-no-family entry above.
  "ELIQUID-1": {
    tagline: "น้ำยา MARBORO SALT NIC 30 ML จากแบรนด์ SALTHUB",
    shortDescription: "น้ำยารุ่น MARBORO SALT NIC 30 ML จากแบรนด์ SALTHUB",
  },
  "Eliquid-109": {
    tagline: "น้ำยา Marboro Freebase ขวดยาว จากแบรนด์ SALTHUB",
    shortDescription: "น้ำยารุ่น Marboro Freebase ขวดยาว จากแบรนด์ SALTHUB",
  },
  "eliquid-133": {
    tagline: "น้ำยา Yogurt Salt Hub จากแบรนด์ SALTHUB",
    shortDescription: "น้ำยารุ่น Yogurt Salt Hub จากแบรนด์ SALTHUB",
  },
  // Part B (device wave 2) — coil-54/coil-62 use "คาร์ทริดจ์" (cartridge), matching their real
  // pod-cartridge reclassification above, not "คอยล์".
  "coil-54": {
    tagline: "คาร์ทริดจ์ Feelin Mini จากแบรนด์ NEVOKS",
    shortDescription: "คาร์ทริดจ์รุ่น Feelin Mini จากแบรนด์ NEVOKS",
  },
  "coil-62": {
    tagline: "คาร์ทริดจ์ Feelin C1 จากแบรนด์ NEVOKS",
    shortDescription: "คาร์ทริดจ์รุ่น Feelin C1 จากแบรนด์ NEVOKS",
  },
  "Pod-169": {
    tagline: "คาร์ทริดจ์ infy 2.5 ml จากแบรนด์ INFY",
    shortDescription: "คาร์ทริดจ์รุ่น infy 2.5 ml จากแบรนด์ INFY",
  },
};

// ===================================================================================
// Verified media — Phase 2.9, extended this session. A product is present here ONLY if a real
// product photo/render was found AND passed identity/variant/authenticity checks — preference
// order per the owner's media policy: (1) official first-party, (2) an authorized distributor/
// retailer relaying what is identifiably manufacturer-supplied artwork, (3) another source only
// when provenance and exact identity are strong enough to justify it. Never AI-generated, never
// the wrong model/variant, never watermarked/misleadingly cropped. VOOPOO's own Shopline CDN
// carries an AI-generated candidate for Coil-92 (embedded XMP `TC260:AIGC` tag with `Label:"1"`
// and a `ProduceID` path containing "aigc_inpaint" — self-flagged by its own metadata), correctly
// excluded — a genuine tier-2 retailer photo was found instead this session (see below).
// Coil-87 still has no verified source of either tier (see its TAXONOMY_MATCHES/report notes)
// and keeps the glyph fallback — investigated again this session (re-checked Giant Vapes,
// Element Vape, Vapesourcing, VaporDNA for a standalone TPP Pod Tank listing) with no new source
// found; the real color-variant risk (Black vs Gunmetal, no confident way to tell which is
// pictured in the only clean multi-item shot ever found) still stands. Coil-94's IDENTITY was
// resolved this session (see TAXONOMY_MATCHES["Coil-94"]) but its media stays blocked too: Giant
// Vapes' matching "Caliburn G3 Replacement Pods" listing uses the SAME shared product photo for
// all four of its resistance options, and that photo's own retail box is explicitly printed
// "0.4 Ω" — using it here would misrepresent this record's other three active variants (0.6Ω/
// 0.9Ω/1.2Ω), the same "one static card image, all variants" risk the Coil-38 correction fixed;
// no distinct per-resistance photo exists at this source to build a true composite from. Coil-68
// (VOOPOO ITO-X Pod, Black) has the identical problem — its retailer's Black and Silver options
// both point to one shared, non-color-specific box photo — so it also keeps the glyph fallback.
// `Coil-74`/`Coil-89`/`Coil-38`/`Coil-92`/`Coil-53` (this session) use tier 2: real retailer product photography, each identity-verified
// before use — Coil-74 by cross-checking the pod's silhouette pixel-for-pixel against the
// OFFICIAL myuwell.com Caliburn X device photo; Coil-89 by using real RINCOE retail packaging
// explicitly resistance-labeled ("Mesh 1.0Ω coil" / "Mesh 0.8Ω coil"); Coil-38 by using a
// side-by-side composite of two real, individually variant-verified retailer photos — one showing
// the TPP-DM2 (0.2Ω) box, one the TPP-DM4 (0.3Ω) box (both of this record's real children,
// confirmed via the retailer page's own variant→image JSON mapping) — after an initial DM2-only
// card was corrected mid-review: the storefront shows one static card image regardless of which
// variant a customer selects, so a single-variant image would misrepresent the product whenever
// the OTHER variant is selected; Coil-92 by using a real retailer photo where the exact resistance/wattage ("0.15Ω" / "60-80W")
// is etched directly onto the physical coil itself, removing all variant-matching ambiguity;
// Coil-55 by using a real retailer photo of retail packaging that reads "CALIBURN G2 Empty
// Cartridge" / "2 PCS" outright — no inference needed, and the "2 PCS" count matches this
// record's own child label exactly; Coil-53 by using a real retailer photo of retail packaging
// that reads "1 Ω" directly on the box, from the retailer's own dedicated "1.0 ohm" variant image
// (confirmed via that page's own variant→image JSON mapping, same technique as Coil-38/92) —
// resolving both the media gap and the resistance-identity question with the same source.
// ===================================================================================

const VERIFIED_MEDIA: Record<string, ProductAsset[]> = {
  "Coil-56": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-56/card.webp",
      alt: "VOOPOO PnP-X Cartridge, silver colorway, isolated product shot",
      angle: "Front, isolated (cropped locally from an official multi-unit retail photo; original plain-white studio background removed locally to match the site's transparent-card convention). Re-checked VOOPOO's storefront for a higher-resolution single-unit shot (Phase 3.2.1) — every available official image is the same small in-frame device size (~110-150px), so no sharper source exists; rendered at a smaller, closer-to-native size (131×205, down from an earlier 284×451 that upscaled the same crop too aggressively) rather than blown up further, per the owner's own guidance to prefer honest scale over a blurry enlargement.",
      transparentBackground: true,
      sourceName: "VOOPOO (official Shopline storefront CDN)",
      sourceUrl: "https://shop.voopoo.com/products/pnp-x-cartridge",
    },
  ],
  "Coil-74": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-74/card.webp",
      alt: "UWELL Caliburn X empty replacement pod, isolated product shot",
      angle: "Front, isolated (cropped locally from a retailer product listing's own dedicated 'empty pod' render; brand wordmark and generous white padding removed locally via a smooth/anti-aliased alpha key, 2x-resampled with a lanczos3 kernel before keying to avoid the jagged edge a hard threshold produces at this source's native resolution, then rendered at 320×427). Tier-2 provenance per the owner's media policy — not fetched directly from UWELL's own site, but identity-verified by cross-checking the pod's silhouette (rounded black cap, clear tank body, matching proportions) against the OFFICIAL myuwell.com Caliburn X device photo, where the same pod is visible mounted on the device.",
      transparentBackground: true,
      sourceName: "vape.com (US vape retailer; product artwork appears manufacturer-supplied)",
      sourceUrl: "https://vape.com/products/uwell-caliburn-x-replacement-pods-2-pack",
    },
  ],
  "Coil-89": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-89/card.webp",
      alt: "RINCOE Jellybox V Pod Cartridge retail packaging, showing both real 1.0Ω and 0.8Ω mesh coil variants",
      angle: "Full retail packaging photo, plain rectangular crop (no alpha-key — same accepted convention as several legacy assets, e.g. m-bar-9k/card.webp). Kept as a real, unaltered photo rather than risking a cropping/keying artifact: an isolated-pod crop attempt from this same source left a visible grey background wash that couldn't be cleanly keyed out, so the honest full-box photo was used instead. No color/variant-matching risk either way — both real boxes are explicitly resistance-labeled ('Mesh 1.0Ω coil' / 'Mesh 0.8Ω coil'), exactly matching this record's two real children.",
      transparentBackground: false,
      sourceName: "The Vape Town (retailer; official RINCOE retail packaging photo)",
      sourceUrl: "https://thevapetown.com/products/rincoe-jellybox-v-pod-cartridge-0-8-ohm-1pc",
    },
  ],
  "Coil-38": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-38/card.webp",
      alt: "VOOPOO TPP-DM2 (0.2Ω) and TPP-DM4 (0.3Ω) replacement coil retail packaging, side by side",
      angle: "MEDIA-CORRECTION (2026-09-01): the original card showed only the TPP-DM2 box — since this site currently displays one static card image regardless of which variant a customer selects (StorefrontVariantView carries no per-variant image, and the product detail component doesn't swap images on variant selection), a DM2-only card would misrepresent the product while a customer has TPP-DM4 selected. Replaced with a plain, unaltered side-by-side composite of two individually real, variant-specific box photos from the SAME retailer's product-photography set — confirmed via the retailer page's own variant→image JSON mapping that each file is genuinely served for its labeled resistance ('0.2 ohm TPP-DM2 Mesh Coils' / '0.3 ohm TPP-DM4 Mesh Coils'), not a shared/generic image. No content was altered, recolored, or relabeled in either half; they are placed next to each other, nothing more. If per-variant image display is ever added to the storefront architecture, this can be split back into two separate variant-level images at that point.",
      transparentBackground: false,
      sourceName: "Giant Vapes (US vape retailer; official VOOPOO product photography)",
      sourceUrl: "https://giantvapes.com/products/voopoo-tpp-coils",
    },
  ],
  "Coil-92": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-92/card.webp",
      alt: "VOOPOO PnP X replacement coil, 0.15Ω, isolated product shot",
      angle: "Front, isolated (cropped locally from the retailer's own variant-specific product photo — confirmed via the page's own variant→image JSON mapping that this exact file is served for the '0.15 ohm' option, not a generic/shared image; alpha-keyed from a clean white studio background). The resistance and wattage ('0.15Ω' / '60-80W') are etched directly onto the physical coil itself and legible in the photo, removing any variant-matching ambiguity — the same official VOOPOO Shopline source considered earlier this project was an AI-generated image (self-flagged XMP metadata) and was correctly rejected; this is a real photograph from an independent retailer instead.",
      transparentBackground: true,
      sourceName: "Giant Vapes (US vape retailer)",
      sourceUrl: "https://giantvapes.com/products/voopoo-pnp-x-replacement-coils",
    },
  ],
  "Coil-55": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-55/card.webp",
      alt: "UWELL Caliburn G2 Empty Cartridge, 2-piece retail box, isolated product shot",
      angle: "Plain rectangular crop/trim of a real retailer product photo. Unambiguous exact match: the box itself reads \"CALIBURN G2 Empty Cartridge\" / \"2 PCS\", and shows exactly 2 empty pod cartridges — matching this record's own child label (\"1 กล่อง / มี 2ตัว\", 1 box of 2) exactly, both in product identity (empty cartridge, not the coil) and quantity.",
      transparentBackground: false,
      sourceName: "Giant Vapes (US vape retailer)",
      sourceUrl: "https://giantvapes.com/products/uwell-caliburn-g2-replacement-pods",
    },
  ],
  "Coil-53": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-53/card.webp",
      alt: "UWELL Caliburn G replacement coil, 1.0Ω, 4-pack retail box, isolated product shot",
      angle: "Plain rectangular crop/trim of a real retailer product photo — the retailer's own dedicated \"1.0 ohm\" variant image, confirmed via that page's own variant→image JSON mapping (same technique used for Coil-38/Coil-92). Unambiguous exact match: the box itself reads \"1 Ω\" directly, resolving both the media gap and the resistance-identity question at once — see TAXONOMY_MATCHES[\"Coil-53\"] for the full identity evidence.",
      transparentBackground: false,
      sourceName: "Giant Vapes (US vape retailer)",
      sourceUrl: "https://giantvapes.com/products/uwell-caliburn-g-replacement-coils",
    },
  ],
};

// ===================================================================================
// Verified specifications — production-readiness audit. Manufacturer facts only, each one
// individually cited (see `sourceUrls` alongside), sourced via WebSearch/WebFetch against the
// brand's own official storefront — never copied marketing paragraphs, only discrete facts
// (resistance/wattage/capacity/compatible-device). A product absent here simply has no
// specifications yet — not a placeholder, not a gap that blocks anything else. Coil-53's earlier
// "0.8Ω/1.2Ω-only, doesn't match 1.0Ω" note was based on an incomplete WebSearch snippet — a
// direct WebFetch of myuwell.com/caliburn/caliburn-g2 (this session) found its own text states
// the device is "Compatible with 1.0 Ω coil and 0.8 Ω coil of Caliburn G", resolving the
// discrepancy with real official evidence rather than a guess — see TAXONOMY_MATCHES["Coil-53"].
// ===================================================================================

interface VerifiedSpecEntry {
  specifications: ProductMasterInput["specifications"];
  sourceUrls: string[];
}

const VERIFIED_SPECIFICATIONS: Record<string, VerifiedSpecEntry> = {
  "Coil-38": {
    specifications: [
      { key: "wattage-02", label: "กำลังไฟที่แนะนำ (TPP-DM2, 0.2Ω)", value: "40-60W", sourceStatus: "verified" },
      { key: "wattage-03", label: "กำลังไฟที่แนะนำ (TPP-DM4, 0.3Ω)", value: "32-40W", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "TPP Pod, DRAG 3 Kit, DRAG X Plus Kit", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://shop.voopoo.com/products/tpp-coils"],
  },
  "Coil-56": {
    specifications: [{ key: "capacity", label: "ความจุ", value: "5mL", sourceStatus: "verified" }],
    sourceUrls: ["https://shop.voopoo.com/products/pnp-x-cartridge"],
  },
  "Coil-74": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "3mL (เติมน้ำยาได้)", sourceStatus: "verified" },
      { key: "coil-replacement", label: "คอยล์", value: "เปลี่ยนคอยล์แยกได้", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.myuwell.com/caliburn/caliburn-x"],
  },
  "Coil-87": {
    // The compatible-device list comes from the TPP coil page (the coil this Pod houses), not a
    // dedicated TPP Pod spec page — real evidence, same source, one step removed.
    specifications: [{ key: "compatible-devices", label: "ใช้ได้กับ", value: "DRAG 3 Kit, DRAG X Plus Kit", sourceStatus: "verified" }],
    sourceUrls: ["https://shop.voopoo.com/products/tpp-coils"],
  },
  "Coil-92": {
    specifications: [{ key: "wattage", label: "กำลังไฟที่แนะนำ (0.15Ω)", value: "60-80W (DTL)", sourceStatus: "verified" }],
    sourceUrls: ["https://shop.voopoo.com/products/pnp-x-coils"],
  },
  "Coil-53": {
    specifications: [
      { key: "resistance", label: "ความต้านทาน", value: "1.0Ω", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Caliburn G, Caliburn G2", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.myuwell.com/caliburn/caliburn-g2", "https://giantvapes.com/products/uwell-caliburn-g-replacement-coils"],
  },
  "Coil-94": {
    specifications: [
      { key: "resistance-range", label: "ความต้านทาน", value: "0.4Ω / 0.6Ω / 0.9Ω / 1.2Ω (Meshed)", sourceStatus: "verified" },
      { key: "capacity", label: "ความจุ", value: "2mL", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://giantvapes.com/products/uwell-caliburn-g3-replacement-pods"],
  },
};

// ===================================================================================
// Variant structure — built ONLY from childRole === "variant" children. Never from
// accessory-component/sell-unit/unresolved. Reports every excluded child instead of
// silently dropping it.
// ===================================================================================

export interface ExcludedChild {
  shipnityVariantId: string;
  rawLabel: string;
  role: ActiveChildRecord["childRole"];
  reason: string;
}

export interface VariantStructureResult {
  optionDefinitions: ProductMasterInput["optionDefinitions"];
  variants: ProductMasterInput["variants"];
  excludedChildren: ExcludedChild[];
  /** Set when the parent's variant-role children span more than one optionType — a real
   *  deviation, never silently collapsed into one axis. */
  mixedAxisError: string | null;
}

export function buildVariantStructure(
  parentInternalId: string,
  children: ActiveChildRecord[]
): VariantStructureResult {
  const excludedChildren: ExcludedChild[] = [];
  const variantChildren = children.filter((c) => {
    if (c.childRole === "variant") return true;
    const reasonByRole: Record<string, string> = {
      "accessory-component": "accessory/component, not a product option — never merged into flavor/color/resistance options",
      "sell-unit": "packaging/unit-of-sale text only, no differentiating option value",
      unresolved: "no confirmed semantic option type — reported, not guessed",
    };
    excludedChildren.push({
      shipnityVariantId: c.shipnityVariantId,
      rawLabel: c.rawLabel,
      role: c.childRole,
      reason: reasonByRole[c.childRole] ?? "excluded",
    });
    return false;
  });

  if (variantChildren.length === 0) {
    return { optionDefinitions: [], variants: [], excludedChildren, mixedAxisError: null };
  }

  const axes = new Set(variantChildren.map((c) => c.optionType));
  if (axes.size > 1) {
    return {
      optionDefinitions: [],
      variants: [],
      excludedChildren,
      mixedAxisError: `variant children span ${axes.size} different optionTypes (${[...axes].join(", ")}) — a single ProductOptionDefinition axis cannot represent this without guessing which is primary`,
    };
  }

  const axis = [...axes][0] as Exclude<OptionType, "unresolved">;
  const valueMap = new Map<string, { code: string; label: string }>();
  for (const c of variantChildren) {
    const label = c.cleanedValue ?? c.rawLabel;
    const code = slugifyValue(label);
    if (!valueMap.has(code)) valueMap.set(code, { code, label });
  }

  const optionDefinitions: ProductMasterInput["optionDefinitions"] = [
    { code: axis, label: AXIS_LABEL_TH[axis], allowedValues: [...valueMap.values()] },
  ];

  const variants: ProductMasterInput["variants"] = variantChildren.map((c) => ({
    id: c.shipnityVariantId,
    parentInternalId,
    optionSelections: [{ optionCode: axis, valueCode: slugifyValue(c.cleanedValue ?? c.rawLabel) }],
    sku: null, // never fabricated — see README
    integrationRef: {
      provider: "shipnity",
      externalId: c.shipnityVariantId,
      lastSyncedAt: CAPTURE_DATE,
      syncStatus: "ok",
    },
    availability: { status: "in-stock", source: "shipnity", observedAt: CAPTURE_DATE },
  }));

  return { optionDefinitions, variants, excludedChildren, mixedAxisError: null };
}

// ===================================================================================
// Full parent projection
// ===================================================================================

export type ProjectionBlockReason =
  | "identity-matches-existing-legacy-product" // dedup — needs a merge into the legacy record, not a new one
  | "mixed-variant-axis"; // variant children span more than one optionType

export interface ProjectionBlocked {
  status: "blocked";
  shipnityProductId: string;
  name: string;
  reason: ProjectionBlockReason;
  detail: string;
  excludedChildren: ExcludedChild[];
}

export interface ProjectionCandidate {
  status: "candidate";
  shipnityProductId: string;
  product: ProductMasterInput;
  /** True when brandId/categoryId/tagline/shortDescription are not all present — i.e. this
   *  candidate would fail publication readiness as-is (Phase 2.6: familyId/systemType/
   *  attributes are NOT part of readiness, see validateProductMasterRegistry). Informational
   *  only; the candidate itself is still a fully schema-valid draft. */
  isDraft: boolean;
  excludedChildren: ExcludedChild[];
}

export type ProjectionResult = ProjectionBlocked | ProjectionCandidate;

/**
 * When the whole PARENT is blocked, none of its children end up in a ProductVariant — including
 * the ones `buildVariantStructure` successfully classified as `variant` role. Those must still
 * be reported, not silently dropped from the accounting, so every one of the 228 active children
 * is traceable to exactly one outcome (built into a candidate, or excluded with a stated reason).
 */
function allChildrenExcluded(parent: ActiveParentRecord, variantStructure: VariantStructureResult, blockReason: string): ExcludedChild[] {
  const alreadyListed = new Set(variantStructure.excludedChildren.map((c) => c.shipnityVariantId));
  const parentBlockedEntries: ExcludedChild[] = parent.children
    .filter((c) => !alreadyListed.has(c.shipnityVariantId))
    .map((c) => ({
      shipnityVariantId: c.shipnityVariantId,
      rawLabel: c.rawLabel,
      role: c.childRole,
      reason: `parent "${parent.shipnityProductId}" blocked (${blockReason}) before this variant-role child could be built`,
    }));
  return [...variantStructure.excludedChildren, ...parentBlockedEntries];
}

function buildDraftCandidate(
  parent: ActiveParentRecord,
  match: TaxonomyMatch | undefined,
  variantStructure: VariantStructureResult
): ProjectionCandidate {
  const internalId = parent.shipnityProductId.toLowerCase();
  const copy = MINIMUM_COPY[parent.shipnityProductId];
  // The ONLY thing that can ever make a real candidate publicationStatus:"published" — see
  // publication-approvals.ts's own doc comment. Everything else in this function stays evidence-
  // based and environment-agnostic; this is the one owner-business-decision seam.
  const approval = getPublicationApproval(parent.shipnityProductId);

  const product: ProductMasterInput = {
    internalId,
    slug: internalId, // Shipnity codes are already ASCII alnum+hyphen — no invented SEO slug
    lifecycleStatus: "active", // genuinely active per Shipnity's own "have stock" view
    publicationStatus: approval ? "published" : "unpublished",
    brandId: match?.brandId ?? null,
    familyId: match?.familyId ?? null,
    categoryId: match?.categoryId ?? null,
    systemType: match?.systemType ?? null,

    name: parent.name,
    displayName: parent.name, // no separate display-name evidence — reuse the one real string
    tagline: copy?.tagline ?? null, // Phase 2.7 minimum copy — see MINIMUM_COPY, never fabricated
    shortDescription: copy?.shortDescription ?? null,
    attributes: null, // no manufacturer spec evidence
    specifications: VERIFIED_SPECIFICATIONS[parent.shipnityProductId]?.specifications ?? [], // production-readiness audit — cited manufacturer facts only, never fabricated
    features: [],
    assets: VERIFIED_MEDIA[parent.shipnityProductId] ?? [], // Phase 2.9 — official-photo only, never fabricated
    sourceUrls: VERIFIED_SPECIFICATIONS[parent.shipnityProductId]?.sourceUrls ?? [],

    commerce: {
      internalSku: null, // never fabricated
      integrationRef: {
        provider: "shipnity",
        externalId: parent.shipnityProductId,
        lastSyncedAt: CAPTURE_DATE,
        syncStatus: "ok",
      },
    },

    pricing: {
      sellingPrice: approval?.sellingPrice ?? null, // never copied from priceReference — see publication-approvals.ts
      priceReference: { source: "shipnity", value: parent.operationalSellingPrice, capturedAt: CAPTURE_DATE },
      lastPriceReview: approval?.lastPriceReview ?? null,
      priceApprovedByOwner: approval !== undefined,
    },

    optionDefinitions: variantStructure.optionDefinitions,
    variants: variantStructure.variants,

    availability: { status: "in-stock", source: "shipnity", observedAt: CAPTURE_DATE },

    editorialContent: {},
    merchantContent: {},
    merchantTags: [],
    compatibility: [],
    relatedProducts: [],
    faqRefs: [],
    seo: {},
    isFlagship: false,
  };

  // Mirrors validateProductMasterRegistry's actual publication-readiness check (Phase 2.6
  // revision) — familyId/systemType/attributes are deliberately excluded, see that function's
  // comment. Kept in sync manually since this is a UI/reporting convenience flag, not itself a
  // validation gate (the registry validator is the single source of truth for readiness).
  const isDraft =
    product.brandId === null ||
    product.categoryId === null ||
    product.tagline === null ||
    product.shortDescription === null;

  return { status: "candidate", shipnityProductId: parent.shipnityProductId, product, isDraft, excludedChildren: variantStructure.excludedChildren };
}

function projectParent(parent: ActiveParentRecord): ProjectionResult {
  const match = TAXONOMY_MATCHES[parent.shipnityProductId];
  const variantStructure = buildVariantStructure(parent.shipnityProductId.toLowerCase(), parent.children);

  // Exact-legacy-match is checked FIRST and independent of variant-structure quality: whether
  // this parent's variant labels classify cleanly is irrelevant when the correct action is a
  // merge into an existing record, not building new variants here at all.
  if (match?.exactLegacyMatch) {
    return {
      status: "blocked",
      shipnityProductId: parent.shipnityProductId,
      name: parent.name,
      reason: "identity-matches-existing-legacy-product",
      detail: `${match.evidence}. This is the SAME product as legacy ProductMaster "${match.exactLegacyMatch}" — projecting it as a new record would duplicate an existing one. Shipnity integration data (commerce.integrationRef, variants, pricing.priceReference) belongs merged into "${match.exactLegacyMatch}" in a future phase, not created fresh here.`,
      excludedChildren: allChildrenExcluded(parent, variantStructure, "identity-matches-existing-legacy-product"),
    };
  }

  if (variantStructure.mixedAxisError) {
    return {
      status: "blocked",
      shipnityProductId: parent.shipnityProductId,
      name: parent.name,
      reason: "mixed-variant-axis",
      detail: variantStructure.mixedAxisError,
      excludedChildren: allChildrenExcluded(parent, variantStructure, "mixed-variant-axis"),
    };
  }

  // Phase 2.6 — no more blocking on missing taxonomy/attributes. Build a draft candidate with
  // whatever real evidence exists (TAXONOMY_MATCHES) and null for whatever doesn't.
  return buildDraftCandidate(parent, match, variantStructure);
}

export function projectActiveCatalog(): ProjectionResult[] {
  return activeCatalogSeed.map(projectParent);
}

export { TAXONOMY_MATCHES };
