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
import { getBrand } from "@/data/brands";

/** When this seed's evidence was captured/authored — used for every `observedAt`/`capturedAt`/
 *  `lastSyncedAt` stamp below. Reflects the Phase 2.4/2.5 authoring session, not a literal
 *  Shipnity server timestamp (none was visible in the screenshots). */
export const CAPTURE_DATE = "2026-08-31T00:00:00.000Z";

const AXIS_LABEL_TH: Record<Exclude<OptionType, "unresolved">, string> = {
  color: "สี",
  flavor: "รสชาติ",
  resistance: "ค่าโอห์ม",
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
  /** null only together with `brandless: true` (owner ruling: the product carries no brand on the site). */
  brandId: string | null;
  brandless?: true;
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
  // Catalog-intelligence mission correction — the "หัว / Coil- prefix does not reliably mean bare
  // coil" pattern again, this time resolved from VOOPOO's OWN product page. shop.voopoo.com's
  // "Argus Pod Cartridge" documents an "Integrated 0.7ohm Or 1.2ohm Coil", 2ml PCTG capacity, side
  // filling, magnetic connection, 3 pieces per pack — a replacement POD with a built-in coil, not a
  // bare coil head. The Thai "คอยล์" in the Shipnity name is retailer shorthand. Same correction
  // class as Coil-55/56/68/74/87/94/coil-54/coil-62. STILL UNPUBLISHED: the single active child
  // "Argus mix (coil เวอร์ชั่นใหม่)" names no resistance, and 0.7Ω and 1.2Ω have DIFFERENT official
  // photos, so no card image can be chosen without misrepresenting one of them. "Argus mix" is also
  // not a VOOPOO product name — most plausibly the Thai retailer's own "คละ" (assorted) box, but
  // that reading is an inference, not evidence, so it is not recorded as fact.
  "Coil-21": { brandId: "voopoo", familyId: "argus", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Argus" (VOOPOO ARGUS family); shop.voopoo.com own "Argus Pod Cartridge" page documents an integrated-coil 2ml replacement pod (3pcs/pack), not a bare coil' },
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
  // Data round (2026-09-24, batch 5): Coil-72 and Coil-89 are pods with a built-in coil (their own copy says "หัวพอต …
  // คอยล์ในตัว"; VOOPOO's shop page calls the VMATE Cartridge V2 a cartridge with a built-in coil) — moved to
  // pods-cartridges like Coil-94/74/56/68/83 before them. Slug/URL unchanged (the slug is the product id).
  "Coil-72": { brandId: "voopoo", familyId: "vmate", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Vmate" (VOOPOO VMATE family) + Shipnity "Coil-" prefix' },
  // Phase 2.8 correction — official UWELL evidence (myuwell.com/caliburn/caliburn-x) describes
  // the Caliburn X as having a 3 ml REFILLABLE POD with separately replaceable coils. This
  // record's own child ("3ml. / 1 กล่อง 2 หัว" — a 3ml capacity, a pod-level spec, not a coil
  // spec) matches the pod, not a bare coil head, despite the Shipnity name saying "หัวเปล่า"
  // (bare head). categoryId/systemType corrected to the existing "pods-cartridges"/
  // "pod-cartridge" values — no new taxonomy needed, both already exist.
  "Coil-74": { brandId: "uwell", familyId: "caliburn", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Caliburn" (UWELL CALIBURN family); child spec (3ml capacity) matches the official Caliburn X refillable pod, not a coil' },
  // Catalog-intelligence mission correction. A THIRD distinct resolution of the "หัวเปล่า" pattern:
  // here the Thai label ("bare head") is literally accurate — but as EMPTY POD, not bare coil. The
  // retail box photographed for VERIFIED_MEDIA reads "ARGUS POD / Empty Cartridge / 2pcs / 2.0mL",
  // and the two pods in frame have a visibly empty coil socket — the coil (VOOPOO ITO M-series) is
  // sold separately. The box count matches this record's child exactly: "1 กล่อง2 หัว" (1 box,
  // 2 heads) = "2pcs". categoryId/systemType corrected to "pods-cartridges"/"pod-cartridge".
  "Coil-83": { brandId: "voopoo", familyId: "argus", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name contains "Argus" (VOOPOO ARGUS family); the retail box in this record own verified media reads "ARGUS POD / Empty Cartridge / 2pcs / 2.0mL" with a visibly empty coil socket — an empty refillable pod that takes ITO coils separately, not a coil' },
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
  // Catalog-intelligence mission — the long-standing "Black vs Gunmetal" ambiguity is RESOLVED,
  // and it was a false dichotomy: both are real VOOPOO colorways. Element Vape's raw HTML carries a
  // variant-to-image mapping (variant "Black" = SKU VPO097-BLA, "Gunmetal" = VPO097-GUN, plus a
  // third "Silver"), and the Black-variant photo itself shows the retail box printed with a rounded
  // "BLACK" badge — manufacturer packaging artwork, so the color name is VOOPOO's own, not a
  // retailer's invention. This record's single active child is "Black".
  "Coil-87": { brandId: "voopoo", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "Voopoo TPP Pod" states "Voopoo" explicitly and literally says "Pod" — VOOPOO documents TPP Pod/Pod Tank separately from TPP coils; the "Black" colorway is confirmed by VOOPOO retail-box artwork (a printed "BLACK" badge, visible in this record verified media) and by the retailer variant-to-SKU mapping VPO097-BLA' },
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
  "Coil-89": { brandId: "rincoe", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "Coil Jellybox V" + children "0.8Ω"/"1.0Ω" match RINCOE\'s official Jellybox V replacement pod/coil options (0.8Ω and 1.0Ω mesh) exactly' },

  // Third Phase 3.5 wave — disposables/cartridges, verified against each brand's official
  // first-party site (WebFetch, not a retailer or reseller). Every one of these has flavor-shaped
  // children (a real prefilled-product signature), consistent with its resolved systemType.
  "Pod-159": { brandId: "esko-bar", categoryId: "pod-kits", systemType: "pod-kit", evidence: 'name "เครื่อง Esko Bar Switch 20k" ("เครื่อง" = device) states the brand explicitly; eskobarvape.com (official) lists "ESKO BAR SWITCH POD" as a real reusable-body product line distinct from its disposable line' },
  // Catalog-intelligence mission (2026-09-02) — BRAND CLAIM WITHDRAWN (this entry previously
  // asserted brandId:"ske"/categoryId:"disposables"). Re-checked directly against skevape.com's
  // OWN sitemap and full product-page enumeration rather than search snippets: SKE's real
  // catalogue is Crystal Bar, Crystal Original, Crystal Plus, Crystal 4in1, CL2000, CL6000,
  // B12000, BOX Bi15000, SKE Bar 15K, CL-15000, MG 25000, Crystal Vision 30000, Fresa 40k — there
  // is NO "B20000" model. It does not appear on any reachable UK/EU retailer either; every
  // "SKE Crystal B20000" listing found is a Thai grey-market page. SKE's own site additionally
  // runs multiple authenticity-verification pages (a "how to verify a genuine Crystal Bar"
  // article and a scratch-code checker at skevape.com/product_verify) — the signature of a
  // heavily-counterfeited brand. This is either a genuine Thailand/SEA-exclusive SKU SKE never
  // published globally, or a counterfeit trading on the Crystal name, and there is no way to tell
  // which from public evidence — the SKE brand record itself stays (real, first-party), but
  // attributing THIS specific product to it is not supportable. Removing the entry leaves
  // brandId/categoryId null, correctly keeping this record unpublishable. RECOMMENDATION: do not
  // publish this product at all unless the owner can verify authenticity directly against SKE's
  // own scratch-code checker on physical stock — a wrong call here is a counterfeit-goods risk,
  // not just a data-accuracy one.
  //   (was: "Pod-149": { brandId: "ske", categoryId: "disposables", systemType: "disposable", ... })
  // OWNER RULING round list19 (18/10, through Friday): "list it, using warehouse data only" — the record is listed under the name the
  // warehouse sells it by (Shipnity MAX "SKE Crystal B20000 Puffs"), with no maker spec, no maker photo and no "official" wording;
  // skevape.com (read 18/10) lists Crystal Bar 600 / SKE Bar 6K / 15K / Fresa 40K and no B20000 — the authenticity risk above is the owner's.
  "Pod-149": { brandId: "ske", categoryId: "disposables", systemType: "disposable", evidence: 'owner ruling 18/10: list on warehouse data only — Shipnity MAX parent "Product 1141360" "SKE Crystal B20000 Puffs" with 8 flavour children Pod-149-1..8; no SKE page for this model (skevape.com 18/10)' },
  // Catalog-intelligence mission (2026-09-02) — re-checked against kardinal.com's OWN Quikpro
  // page directly (official first-party — note the brand's real domain is kardinal.com/
  // kardinalstick.com; there is NO Thailand-market edition, so any "Kardinal Stick Official"-
  // branded Thai site is a reseller, not first-party). Confirmed cited facts: 15ml cartridge, up
  // to 15,000 puffs, hybrid ceraKoil ceramic-mesh coil, official flavor list of 15 names. FLAG:
  // this record's "Watermelon" child is NOT in Kardinal's official 15-flavor list (which has
  // Grape and Lychee instead) — either a Thailand-exclusive SKU, a retailer rename, or a
  // non-genuine cartridge; needs an owner decision before publishing that specific child. STILL
  // UNPUBLISHED (media): every reachable official Quikpro cartridge asset is a dimension diagram
  // or a 64px flavor icon, both failing the card-image resolution floor; every available
  // photograph is of the reusable BATTERY DEVICE, not this cartridge — using one would misrepresent
  // the product being sold.
  // Round list19 (18/10): Max-only record (Max "Product 780" "KS Quik Pro 15000 คำ") = the Kardinal Quikpro device sold with one
  // cartridge; its Max options are the cartridge flavour of the bundle (kardinal.com/products/quikpro).
  "KS-QUIKPRO-KIT": { brandId: "kardinal-stick", categoryId: "pod-kits", systemType: "pod-kit", evidence: 'Shipnity MAX "KS Quik Pro 15000 คำ" with options "เครื่อง + หัว <flavour>" (device + one cartridge) = Kardinal Quikpro, kardinal.com/products/quikpro (official): device + 15ml cartridge, up to 15,000 puffs' },
  // Round list19 (18/10, owner "ทำเลยครับทั้งหมด"): Pop Up 10K refill pod — no maker site found (Thai-market line), sold without a brand on
  // the site (same as Pod-180); every fact = the warehouse (Shipnity MAX name "Pop Up 10K หัวเติม", its 18 flavour rows + battery base row).
  "Pod-154": { brandId: null, brandless: true, categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'Shipnity MAX "Pop Up 10K หัวเติม" (refill pod) with 18 flavour children + a "ฐานแบตเตอรี่" (battery base) child; no maker site found 16-18/10 — listed on warehouse facts only, without a brand' },
  "Pod-150": { brandId: "kardinal-stick", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "KS Quikpro 15K หัวพอต" ("หัวพอต" = pod cartridge) states the brand explicitly ("KS"); kardinal.com (official) confirms Quikpro as a real hybrid-cartridge product rated "up to 15,000 puffs" — an exact match to this parent\'s own "15K" name; official 15-flavor list confirmed, though this record\'s "Watermelon" child is not among them (flagged for owner review)' },
  // Catalog-intelligence mission — BRAND CLAIM WITHDRAWN (this entry previously asserted
  // brandId:"instabar"). Re-checked against instabar.net's OWN /products.json catalogue rather
  // than search snippets: the full Instabar lineup is Glow 100K, Max S 50K, Mega 120K, Zerofog
  // Twin 50k, DC 15000, Pro Max 70K, instapod Prime/Prime Lite/Prime Pro/Mate, Hi5 series, GO,
  // EVA 30000, Switch Plus, BE 40000, OC 12000, WT 15000, Ultra 12000, Air 600, Jar, Max 7500 —
  // there is NO PX model. The old evidence string ("a 15,000-puff tier") is true only of DC 15000
  // and WT 15000, which are different products. Meanwhile a real "Hyper Bar PX 15000" exists with
  // matching specs (20ml, 5% salt nic, 15,000 puffs) and the SAME "Yummy Bear" flavor on what
  // appears to be an identical chassis, and Chinese wholesalers already sell the item as "Insta
  // Hyperbar Px 15000". The product is real and widely stocked in Thailand (8+ independent Thai
  // retailers, ฿329-349), but attributing it to INSTABAR is not supportable from Instabar's own
  // catalogue. Removing the entry rather than keeping a weaker one leaves brandId/categoryId
  // null, which correctly keeps this record unpublishable until the owner can read the physical
  // branding off actual stock. The `instabar` Brand record itself stays — it is a real brand,
  // just not evidenced as this product's brand.

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
  // Catalog-intelligence mission (2026-09-02) — TRADEMARK RISK FLAG, owner review required before
  // ANY of these three publish, independent of their data-completeness state.
  //
  // "Marbo"/"มาโบโร่" (ELIQUID-1, Eliquid-109) is confirmed as a genuine Salt Hub product line
  // (salthub.com's own favicon is literally "Marbo-M" branded, and the physical label prints "A
  // product by: Salt hub" — this is real, not a naming coincidence). However, the bottle artwork
  // itself reproduces Marlboro's red roof/chevron device, and the Red/Gold/Silver/Blue color tier
  // naming echoes Marlboro's own pack-color tiers — the Red variant is explicitly tobacco-flavored,
  // which strengthens the visual association. Marlboro trade dress is aggressively enforced by its
  // owner. eliquid-133 ("Yogurt Salt Hub") is sold by at least one retailer AS A VARIANT of this
  // same Marbo line (though its own bottle label reads only "Yogurt probiotics — The Original,"
  // with no visible Marbo/tobacco branding — brand attribution here is retailer-asserted, not
  // label-printed) and separately carries a real, uncorroborated nicotine-strength conflict across
  // sources (30mg vs 35mg).
  //
  // This is a business/legal-risk decision, not a data-completeness one — publishing packaging
  // that imitates a real, aggressively-protected trademark is a materially different kind of risk
  // than an incomplete spec sheet, and not something to resolve by web research or by this
  // pipeline's ordinary evidence tiers. All three stay UNPUBLISHED and are deliberately NOT run
  // through the rest of the readiness pipeline (no VERIFIED_MEDIA/VERIFIED_SPECIFICATIONS entries
  // added this session, even though real tier-3 media and specs were independently sourced and
  // verified for 4 of ELIQUID-1's 5 colors, all of Eliquid-109, and eliquid-133) until the owner
  // has explicitly decided whether to sell this line at all under this packaging. Taxonomy
  // (brandId/categoryId) is left resolved below since Salt Hub genuinely is the real brand — only
  // publication is held.
  "ELIQUID-1": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "MARBORO SALT NIC 30 ML"; 3 independent Thai retailers (thai-vapes.com "Salt Hub - Marbo Salt Nic", vape69th.com, goatvapethai.com) consistently attribute the Marboro salt-nic line to Salt Hub; salthub.com\'s own favicon and the physical bottle label ("A product by: Salt hub") independently confirm this. See the trademark-risk flag above — NOT cleared for publication regardless of data completeness.' },
  "Eliquid-109": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "Marboro Freebase ขวดยาว" — same Marboro/Salt Hub evidence as ELIQUID-1, different nicotine formulation (freebase vs. salt nic) and bottle format. See the trademark-risk flag above — NOT cleared for publication regardless of data completeness.' },
  "eliquid-133": { brandId: "salthub", categoryId: "e-liquid", evidence: 'name "Yogurt Salt Hub" states the brand explicitly and directly — no inference needed, though the actual bottle label reads only "Yogurt probiotics — The Original" with no visible Salt Hub/Marbo branding (retailer-asserted attribution). See the trademark-risk flag above — held alongside ELIQUID-1/Eliquid-109 pending owner review, plus an unresolved 30mg/35mg nicotine-strength conflict across sources.' },

  // Catalog-intelligence mission (2026-09-02) — Eliquid-64 ("Double Mint Salt Nic") deliberately
  // has NO entry here, and none should be added without an explicit owner decision. Research
  // confirmed "Double Mint" is the product LINE name, not the flavor (its real variant list is
  // Apple, Grape, Lychee, Mint, Peach, Watermelon — this record's Watermelon/Peach children match
  // exactly, "Mint" is a sibling flavor). The line's actual bottle label reads "RIGLEY'S
  // DOUBLEMINT CHEWING GUM" rendered in Wrigley's own green-arrow trade dress, with the brand name
  // deliberately misspelled by one letter — a direct counterfeit of a real, actively-owned Mars/
  // Wrigley trademark, not a genre convention (unlike the milder Marbo/Marlboro case above; this
  // one is unambiguous). There is no legitimate brand to resolve "Double Mint" to. This is
  // recorded here specifically so a future session does not re-research and admit it as if it
  // were an ordinary "brand identity unresolved" case — it is not unresolved, it is a confirmed
  // counterfeit, and the correct default is to never carry it into the catalog under this
  // packaging, pending an explicit owner decision to the contrary.

  // Part B (device wave 2) — "Feelin" resolves to NEVOKS (nevoks.com, official): both Feelin Mini
  // and Feelin C1 are confirmed real pod-system products in Nevoks' own FEELIN series. Both
  // parents are reclassified pod-cartridge, not coil — same "หัวเปล่า doesn't reliably mean coil"
  // correction as Coil-56/68/74/87 above, now confirmed a 5th/6th time: coil-54's only child is
  // packaging text ("2 heads per box"), matching a real retailer listing for "Feelin Mini pod
  // cartridge... 2 empty tanks, 2ml capacity" (a refillable cartridge, not a coil); coil-62's only
  // child is "Matcha Clear" — a FLAVOR, not a resistance value, meaning this is a prefilled
  // cartridge for the Feelin C1, not its separate SPL10-branded coil line.
  "coil-54": { brandId: "nevoks", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า Feelin Mini" + sell-unit-only child (no resistance value) matches a real retailer listing for the Feelin Mini refillable pod cartridge (2 empty tanks, 2ml); nevoks.com confirms Feelin Mini as a real Nevoks product, with its actual coils sold separately as "SPL10"' },
  // Catalog-intelligence mission (2026-09-02) correction — the earlier evidence string called this
  // a "prefilled cartridge," which was wrong. Direct evidence: NEVOKS' own C1 kit page describes a
  // 2.8ml PCTG clear pod, and a retailer teardown states it is "delivered empty, without coil" —
  // the coil (NEVOKS SPL-10, 0.6Ω/1.0Ω) is a SEPARATE purchase that drops into this empty tank.
  // "หัวเปล่า" (bare head) is therefore literally accurate here, as EMPTY POD, not as a coil itself
  // (the coil-62 id prefix is again a Shipnity operational artifact, not physical evidence) —
  // categoryId/systemType are unchanged (still correctly "pods-cartridges"/"pod-cartridge"), only
  // the "prefilled" characterization is corrected. STILL UNPUBLISHED: no photo of the "Matcha
  // Clear" colorway exists anywhere reachable — NEVOKS' own product feed sells only the C1 kit
  // (no separate cartridge SKU/color list), and no NEVOKS-authorized retailer stocks a Matcha
  // variant (only Black/Red/Frost/Light Blue/Smoke/Amber found) — "Matcha" appears to be an
  // Asia-market-exclusive color with no located product photography.
  "coil-62": { brandId: "nevoks", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัวเปล่า Feelin C1" + single color child ("Matcha Clear", axis owner-confirmed) — NEVOKS\' own C1 kit page and an independent retailer teardown confirm this is an empty, coil-less 2.8ml PCTG replacement pod (the SPL-10 coil is sold separately), not the coil itself; nevoks.com confirms Feelin C1 as a real Nevoks product' },
  // "หัว infy 2.5 ml" — brand explicit; INFY's own official site (infy.my) lists "2.5ML Cartridge"
  // as a real current product line — an exact size match, not a coincidence.
  "Pod-169": { brandId: "infy", categoryId: "pods-cartridges", systemType: "pod-cartridge", evidence: 'name "หัว infy 2.5 ml" states the brand explicitly; infy.my (official) lists "2.5ML Cartridge" as a real INFY product line — an exact size match' },

  // Nexbar history (WOTOFO match 2026-09-02/03, media hunt) superseded by the owner ruling below — see git history.
  // Image-fix round (owner 2026-09-29): the shop sells nexBar CLEAR 18K (clear body, "nexBar CLEAR 18K" printed on the
  // device — owner's photos), NOT WOTOFO's carbon-look nexBAR 18K the earlier match assumed from the name. Owner ruling:
  // no brand on the site. WOTOFO keeps its own real product (src/data/products/wotofo.ts).
  "Pod-180": { brandId: null, brandless: true, categoryId: "disposables", systemType: "disposable", evidence: 'owner ruling 2026-09-29 (image-fix round): Shipnity "Nexbar Clear 18k" = nexBar CLEAR 18K, sold without a brand on the site; the earlier WOTOFO match was a name look-alike (WOTOFO nexBAR 18K is a different device)' },

  // ===================================================================================
  // Heated-tobacco wave — owner has settled the business/legal-scope question for this category;
  // processed with the same evidence discipline as every other entry above, no health/safety
  // claims anywhere in this batch's copy. "systemType" stays null throughout (same reasoning as
  // e-liquid — SystemType is a closed vape-device enum with no correct heated-tobacco value).
  // ===================================================================================
  // "Lambda i8" is explicitly NOT an IQOS/PMI product despite the Shipnity "IQOSHEET-" id prefix —
  // lambdasmoke.com (official, Shenzhen Original Technology) confirms it as a third-party
  // heat-not-burn device merely marketed as compatible with TEREA/SENTIA sticks. Real color match:
  // official lineup is Gold/Green/Black/Gray/Red/White; Shipnity's active children (Red, Gold) are
  // an exact 2-of-6 subset.
  "IQOSHEET-14": { brandId: "lambda", categoryId: "heated-tobacco-devices", evidence: 'name "Lambda i8" states the brand explicitly; lambdasmoke.com (official) confirms the i8 as a real LAMBDA heat-not-burn device, NOT an IQOS/PMI product despite the Shipnity id prefix; active children (Red, Gold) are an exact subset of the official 6-color lineup (Gold/Green/Black/Gray/Red/White)' },
  // "IQOS TEREA" — official PMI heated-tobacco CONSUMABLE (a stick, not a device), confirmed via
  // official iqos.com regional shop pages (media.iqos.com's own TEREA-FK-<FLAVOR> asset naming).
  // 5 of the 16 active flavor children have an exact official name match (Green/Blue/Sienna/
  // Bronze/Oasis Pearl); the other 11 were not individually re-verified this session.
  "IQOSHEET-15": { brandId: "iqos", categoryId: "heated-tobacco-consumables", evidence: 'name "IQOS TEREA" states the brand and product line explicitly; FULL REBUILD (owner quality review, 2026-09-02) re-verified ALL 16 of this parent\'s raw active flavor children directly against iqos.com/id\'s live shop grid and official flavor-guide article — every one corresponds to a real official TEREA flavor (Black Green, Green, Blue, Sienna, Purple Wave, Bronze, Bright Wave, Dimensions Apricity, Dimensions Yugen, Emerald Edition, Golden Edition, Berrine Edition, Mulint Edition, Oasis Pearl, Sun Pearl, Black Ruby), not merely 5. Also confirmed: TEREA sticks require an IQOS ILUMA-series device specifically (bladeless induction core) and are not usable with pre-ILUMA IQOS generations — https://www.iqos.com/gb/en/blog/difference-between-iqos-iluma-and-iqos-3-duo.html.' },
  // "IQOS iluma Prime" — official PMI device, confirmed via iqos.com/ph's own "iluma-i-prime-kit-
  // aspen-green" product page. Active children (Midnight Black, Breeze Blue, Aspen Green) are an
  // exact 3-of-4 subset of the official ILUMA i PRIME color range (+ Garnet Red, not stocked).
  "IQOSHEET-16": { brandId: "iqos", familyId: "iluma", categoryId: "heated-tobacco-devices", evidence: 'name "IQOS iluma Prime" states the brand/model explicitly; iqos.com/ph\'s own dedicated "ILUMA i PRIME Aspen Green" product page confirms this exact color as real, official PMI hardware; Midnight Black and Breeze Blue are also real official ILUMA i PRIME colors' },
  // "Iqos iluma Standard" — RESOLVED as a real identity correction, not a guess: Shipnity's own
  // "Standard" label is a naming approximation, not the literal original "IQOS ILUMA" device. Both
  // active children (Midnight Black, Breeze Blue) are official colors of the mid-tier "IQOS ILUMA
  // i" device specifically (confirmed via iqos.com/ph's own "iluma-i-kit-breeze-blue" product
  // page, whose own on-page copy states "IQOS ILUMA i is designed to be used with TEREA tobacco
  // sticks") — NEITHER color appears in the original (non-"i") ILUMA's official 5-color list
  // (Azure Blue/Moss Green/Pebble Beige/Pebble Gray/Sunset Red), so this is confidently the newer
  // "ILUMA i" mid-tier device, not the original "Standard"/"ILUMA" model.
  "IQOSHEET-18": { brandId: "iqos", familyId: "iluma", categoryId: "heated-tobacco-devices", evidence: 'name "Iqos iluma Standard" — both active children (Midnight Black, Breeze Blue) exact-match the official "IQOS ILUMA i" (mid-tier) color range and do NOT appear in the original ILUMA\'s 5-color list, resolving this as the ILUMA i device, not the original/Standard generation; confirmed via iqos.com/ph\'s own "ILUMA i Breeze Blue" product page' },
  // "Iqos iluma one" — DELIBERATELY NOT resolved to one generation, and NOT published (see
  // publication-approvals.ts comment): this is a genuine data conflict, not a research gap.
  //
  // Catalog-intelligence mission (2026-09-02) re-checked this from scratch across FIVE first-party
  // iqos.com/jp.iqos.com markets (MY, ID, PH, GB, JP) specifically to see if the earlier finding
  // was stale. It is not — it is now confirmed with much stronger evidence than before:
  //   - "Pebble Grey" (SKU G0000592) cross-links on iqos.com/my and /id ONLY to the ORIGINAL
  //     ILUMA ONE's 5-color lineup (Azure Blue, Moss Green, Pebble Beige, Pebble Grey, Sunset
  //     Red) — "Breeze Blue" does not exist in that lineup (negative-control 404s confirmed on
  //     /my, /ph, /gb).
  //   - "Breeze Blue" (SKU G0002077) cross-links on iqos.com/ph and /my ONLY to the ILUMA i ONE's
  //     6-color lineup (Breeze Blue, Digital Violet, Electric Purple, Midnight Black, Spring
  //     Green, Vivid Terracotta) — "Pebble Grey" does not exist in that lineup (negative-control
  //     404s confirmed on /ph, /my).
  //   - Independently corroborated by DIFFERENT PMI device SKU codes (G0000592 vs G0002077) and
  //     by directly inspecting both official renders: physically different chassis (two-tone body
  //     with a round button and thin line-LED, vs. single-tone i-generation body with a recessed
  //     oval button and segmented LED window) — not a recolor of one device.
  //   - The two generations have materially different real specs that a shared sheet would get
  //     wrong for whichever child a customer didn't order: ILUMA i ONE adds a touch screen,
  //     Autostart, and a first-3-minutes Pause Mode that the original ILUMA ONE has none of
  //     (iqos.com/my "iluma-one-kit-pebble-grey" vs "iluma-i-one-breeze-blue-kit";
  //     jp.iqos.com/products/iluma/iluma-i-one).
  //   - A THIRD complication, not previously documented: "Pebble Grey" alone is ALSO ambiguous —
  //     it names TWO distinct hardware SKUs, the original ILUMA ONE (G0000592) and a later "ILUMA
  //     ONE Refreshed" (G0001811), both sold in Pebble Grey on iqos.com/my. Which one is
  //     physically in stock cannot be determined from Shipnity's text alone.
  //   - No official IQOS Thailand storefront exists to check against directly: th.iqos.com does
  //     not resolve and iqos.com/th/{th,en}/ both 404 — PMI does not operate a TH site. Thai
  //     market stock is commonly JP-imported per retailer chatter, which matters because
  //     jp.iqos.com/products/iluma/iluma-one now REDIRECTS to /iluma-i-one — Japan has retired
  //     the non-i ILUMA ONE entirely, raising a real question about what generation "Pebble Grey"
  //     stock in Thailand actually is.
  // See publication-approvals.ts's own comment for the pricing angle this evidence also affects.
  // RESOLVED round list19 (17/10, Friday's ruling for the warehouse-listing task): this record IS the IQOS ILUMA i ONE —
  // the warehouse's in-stock child "Breeze Blue" (Shipnity Max IQOSHEET-17-3) — under IQOS's real model name. The
  // original-ILUMA-ONE children (Pebble Grey -1 · Azure Blue -2, both out of stock in Shipnity Max) are a different model:
  // OTHER_MODEL_CHILDREN keeps them off this record; their own page is a later item (one Shipnity parent → one record).
  "IQOSHEET-17": { brandId: "iqos", familyId: "iluma", categoryId: "heated-tobacco-devices", evidence: 'name "Iqos iluma one" — child "Pebble Grey" (SKU G0000592) exact-matches ONLY the ORIGINAL ILUMA ONE\'s official 5-color lineup on iqos.com/my+/id (with confirmed negative-control 404s for Breeze Blue on that lineup); child "Breeze Blue" (SKU G0002077) exact-matches ONLY the NEWER ILUMA i ONE\'s official 6-color lineup on iqos.com/ph+/my (with confirmed negative-control 404s for Pebble Grey on that lineup) — independently corroborated by distinct PMI SKU codes and visibly different chassis renders. A genuine two-generation conflict within one Shipnity parent, not a single resolvable identity' },
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
    tagline: "คอยล์ Caliburn G 1.0 โอห์ม จากแบรนด์ UWELL ใช้ได้กับ Caliburn G2",
    shortDescription: "คอยล์ Caliburn G 1.0 โอห์ม จากแบรนด์ UWELL ใช้ได้กับ Caliburn G และ Caliburn G2",
  },
  // New this session — resolves the Phase 3.4 deferral. Worded distinctly from Coil-53 ("คอยล์"
  // = coil vs "พอตเปล่า" = empty pod) on purpose: these are two genuinely different real products
  // that must never read as a duplicate listing. See TAXONOMY_MATCHES["Coil-55"] for the evidence.
  "Coil-55": {
    tagline: "หัวพอตเปล่า Caliburn G2 จากแบรนด์ UWELL",
    shortDescription: "หัวพอตเปล่ารุ่น Caliburn G2 (บรรจุ 2 ชิ้น) เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL แยกชิ้นจากคอยล์",
  },
  // Phase 2.8 correction — was worded as a coil ("คอยล์"); official VOOPOO evidence (matching
  // active variant colors) identifies this as the PnP X cartridge, not a coil. See
  // TAXONOMY_MATCHES["Coil-56"] for the evidence.
  "Coil-56": {
    tagline: "หัวพอต Voopoo PnP-X",
    shortDescription: "หัวพอตรุ่น PnP-X จากแบรนด์ VOOPOO",
  },
  // Phase 2.8 correction — was worded as a bare coil head ("หัวคอยล์เปล่า"); official UWELL
  // evidence describes the Caliburn X as a 3ml refillable pod. See
  // TAXONOMY_MATCHES["Coil-74"] for the evidence.
  "Coil-74": {
    tagline: "หัวพอตเปล่า Caliburn X จากแบรนด์ UWELL",
    shortDescription: "หัวพอตเปล่ารุ่น Caliburn X เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL",
  },
  // Phase 2.8 correction — was worded as a coil; the Shipnity name itself says "Pod", and
  // VOOPOO documents TPP Pod separately from TPP coils. See TAXONOMY_MATCHES["Coil-87"].
  "Coil-87": {
    tagline: "หัวพอตเปล่า Voopoo TPP Pod",
    shortDescription: "หัวพอตเปล่ารุ่น TPP Pod จากแบรนด์ VOOPOO",
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
    tagline: "หัวพอต Argus Pod จากแบรนด์ VOOPOO",
    shortDescription: "คอยล์รุ่น Argus Pod เป็นผลิตภัณฑ์ในกลุ่ม ARGUS จากแบรนด์ VOOPOO",
  },
  "Coil-72": {
    tagline: "หัวพอต Vmate Infinity Edition จากแบรนด์ VOOPOO",
    shortDescription: "หัวพอตรุ่น Vmate Infinity Edition จากแบรนด์ VOOPOO สำหรับเครื่อง VMATE คอยล์ในตัว มี 4 แบบ เติมข้าง 0.7 กับ 1.2 โอห์ม และเติมบน (Top Fill) 0.4 กับ 0.7 โอห์ม",
  },
  "Coil-83": {
    tagline: "หัวพอตเปล่า Argus P1 จากแบรนด์ VOOPOO",
    shortDescription: "หัวพอตเปล่ารุ่น Argus P1 จากแบรนด์ VOOPOO ไม่มีคอยล์ในกล่อง ต้องใช้คู่กับคอยล์ ITO ใช้ได้กับ Argus Pod, Argus P1, Argus Z, Argus G และ Argus A",
  },
  // Correction (this session) — was worded as a bare coil ("คอยล์"); real Giant Vapes evidence
  // (exact 0.4Ω/0.6Ω/0.9Ω/1.2Ω match + retail box reading "INTEGRATED COIL CARTRIDGE") identifies
  // this as the pod, not a bare coil. See TAXONOMY_MATCHES["Coil-94"] for the evidence.
  "Coil-94": {
    tagline: "หัวพอต Caliburn G4&G3 Series จากแบรนด์ UWELL",
    shortDescription: "หัวพอตรุ่น Caliburn G4&G3 Series เป็นผลิตภัณฑ์ในกลุ่ม Caliburn จากแบรนด์ UWELL",
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
    tagline: "หัวพอต ITO-X จากแบรนด์ VOOPOO",
    shortDescription: "หัวพอตรุ่น ITO-X จากแบรนด์ VOOPOO",
  },
  "Coil-70": {
    tagline: "คอยล์ Dotmod Aio V2 จากแบรนด์ DOTMOD",
    shortDescription: "คอยล์รุ่น Dotmod Aio V2 จากแบรนด์ DOTMOD",
  },
  "Coil-89": {
    tagline: "หัวพอต Jellybox V จากแบรนด์ RINCOE",
    shortDescription: "หัวพอตรุ่น Jellybox V จากแบรนด์ RINCOE คอยล์ในตัว มีให้เลือก 0.8 และ 1.0 โอห์ม ใช้ได้กับ Jellybox V1, V2 และ V3",
  },
  // Third Phase 3.5 wave — same template, extended with two more real, established Thai vape-
  // retail type-words: "ชุดอุปกรณ์" (device kit, for a pod-kit systemType) and "พอตใช้แล้วทิ้ง"
  // (disposable pod, for a disposable systemType) — factual category words, not marketing copy.
  "Pod-159": {
    tagline: "เครื่องระบบสวิตช์ Esko Bar Switch 20K จากแบรนด์ ESKO BAR",
    shortDescription: "เครื่องระบบสวิตช์รุ่น Esko Bar Switch 20K จากแบรนด์ ESKO BAR",
  },
  // "Pod-149" copy removed alongside its brand-claim withdrawal above — see TAXONOMY_MATCHES's
  // comment. Copy that names "แบรนด์ SKE" would misattribute the product; MINIMUM_COPY never
  // fabricates a brand name that isn't independently supportable.
  "Pod-149": {
    // Round list19 (18/10): warehouse facts only (owner ruling) — the Max name "SKE Crystal B20000 Puffs" and its 8 flavours.
    tagline: "พอตใช้แล้วทิ้ง SKE Crystal B20000",
    shortDescription: "พอตใช้แล้วทิ้ง SKE Crystal B20000 ชื่อรุ่นระบุ 20,000 พัฟ ร้านมีให้เลือก 8 กลิ่น",
  },
  "Pod-154": {
    // Round list19 (18/10): warehouse facts only — the name says 10K, the pod print says 10000 PUFFS, Max lists the battery base.
    tagline: "หัวพอต Pop Up 10K",
    shortDescription: "หัวพอต Pop Up 10K หัวละสูงสุด 10,000 พัฟ ใช้กับฐานแบตเตอรี่ของ Pop Up ร้านมีให้เลือก 18 กลิ่น",
  },
  "KS-QUIKPRO-KIT": {
    // Round list19 (18/10): every fact = kardinal.com/products/quikpro (spec list, FAQ). Max sells it as device + one cartridge.
    tagline: "ชุดเครื่อง Quikpro พร้อมหัวพอต 1 หัว",
    shortDescription: "ชุดเครื่อง Quikpro จากแบรนด์ KS (Kardinal) ได้ตัวเครื่องพร้อมหัวพอตน้ำยา 15ml 1 หัว เลือกกลิ่นของหัวได้ แบต 600mAh ชาร์จผ่าน USB-C ราว 30 นาที หัวละสูงสุด 15,000 พัฟ",
  },
  "Pod-150": {
    // Round list19 (18/10): every fact = kardinal.com/products/quikpro (spec list, FAQ, cartridge diagram).
    tagline: "หัวพอต Quikpro น้ำยา 15ml",
    shortDescription: "หัวพอตของเครื่อง Quikpro จากแบรนด์ KS (Kardinal) บรรจุน้ำยา 15ml หัวละสูงสุด 15,000 พัฟ (แล้วแต่การใช้งาน) ใช้จนหมดแล้วเปลี่ยนหัวใหม่",
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
  // Part B (device wave 2) — coil-54/coil-62 use "หัวพอต" (pod/cartridge head — THAI_STYLE §3
  // word 8, round 30.3; was the Thai loan-word for cartridge), matching their real pod-cartridge reclassification
  // above, not "คอยล์".
  "coil-54": {
    tagline: "หัวพอตเปล่า Feelin Mini จากแบรนด์ NEVOKS",
    shortDescription: "หัวพอตเปล่ารุ่น Feelin Mini จากแบรนด์ NEVOKS",
  },
  "coil-62": {
    tagline: "หัวพอตเปล่า Feelin C1 จากแบรนด์ NEVOKS",
    shortDescription: "หัวพอตเปล่ารุ่น Feelin C1 จากแบรนด์ NEVOKS",
  },
  "Pod-169": {
    tagline: "หัวพอต infy 2.5 ml จากแบรนด์ INFY",
    shortDescription: "หัวพอตรุ่น infy 2.5 ml จากแบรนด์ INFY",
  },
  // Heated-tobacco wave — factual, identity-level copy only, no health/reduced-harm claims
  // (heat-not-burn is not risk-free; this project makes no such claim anywhere).
  "IQOSHEET-14": {
    // Round list19 (17/10): every number = a verified spec row (LAMBDA's own i8 page). The name is the card title already.
    tagline: "เครื่องอุ่นยาสูบระบบเหนี่ยวนำ ปรับอุณหภูมิได้",
    shortDescription: "เครื่องอุ่นยาสูบของแบรนด์ LAMBDA ไม่ใช่ IQOS แบต 3200mAh ชาร์จเต็มใช้ได้ 35–40 ก้าน ปรับอุณหภูมิได้ 200–300°C และปรับเวลาต่อก้านได้ 3–6 นาที LAMBDA ระบุว่าใช้กับก้าน TEREA และ SENTIA ได้",
  },
  "IQOSHEET-15": {
    tagline: "ก้าน TEREA สำหรับ IQOS ILUMA",
    shortDescription: "ก้าน TEREA สำหรับอุปกรณ์ IQOS ILUMA จากแบรนด์ IQOS (Philip Morris International)",
  },
  "IQOSHEET-16": {
    tagline: "เครื่องอุ่นยาสูบ IQOS ILUMA i PRIME",
    shortDescription: "อุปกรณ์รุ่น ILUMA i PRIME จากแบรนด์ IQOS ใช้ร่วมกับก้าน TEREA เท่านั้น",
  },
  "IQOSHEET-18": {
    tagline: "เครื่องอุ่นยาสูบ IQOS ILUMA i",
    shortDescription: "อุปกรณ์รุ่น ILUMA i (รุ่นกลาง) จากแบรนด์ IQOS ใช้ร่วมกับก้าน TEREA เท่านั้น",
  },
  "IQOSHEET-17": {
    // Round list19 (17/10): the record is the ILUMA i ONE (TAXONOMY_MATCHES comment). Every fact = iqos.com/ph ILUMA i ONE pages.
    // The name is the card title already; a tagline that repeats it broke "ILUMA i | ONE" on the 1440 card (wordbreak scan).
    tagline: "เครื่องอุ่นยาสูบตัวเดียวจบ พกใส่กระเป๋าได้",
    shortDescription: "ILUMA i ONE ตัวสูบกับที่ชาร์จรวมเป็นชิ้นเดียว ชาร์จเต็มใช้ได้ 20 ก้านติดกัน มีระบบ Autostart และ FlexPuff ใช้กับก้าน TEREA เท่านั้น",
  },
  // Image-fix round 2026-09-30: nexBar CLEAR 18K, no brand (owner ruling) — writer draft A, owner "ตามแนะนำ".
  "Pod-180": {
    tagline: "พอตใช้แล้วทิ้งตัวใส 18,000 พัฟ คอยล์ mesh สองตัว มี 2 โหมด Normal กับ Turbo",
    shortDescription: "พอตใช้แล้วทิ้งสูงสุด 18,000 พัฟ น้ำยา 18mL ในถังใส เห็นว่าเหลือเท่าไหร่ แบตเตอรี่ 650mAh ชาร์จผ่าน USB-C คอยล์ mesh สองตัว ปรับลมได้ มี 2 โหมด Normal สูบนุ่ม น้ำยาหมดช้าลง กับ Turbo รสเต็ม ไอหนา ผู้ผลิตทำมา 15 กลิ่น",
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
// Continuation session (2026-09-02) — media research on the remaining ProductMaster candidates,
// all still blocked, none added here:
// - Pod-169 (infy 2.5ml cartridge): brand confirmed (Shipnity's own name literally says "infy");
//   found and verified a real, non-AI, correctly-sized (1000x1000) official product photo for the
//   "Strawberry" flavor at infy.my (og:image technique) — but the other 8 active flavors (Grape
//   Jelly/Gummies/Bubblegum/Apple, Strawberry Grape, Tropical Mix Fruit, Blueberry, Lychee
//   Raspberry) do not match any product page found on infy.my; the site's only "Grape" listings
//   are "Yoyo Grape"/"Kyoho Grape", neither of which is one of this parent's real children, and the
//   site's product-category listing page 404s (can't be crawled for a full flavor index). No
//   flavor-neutral pack shot exists either — every real infy.my product photo is flavor-branded
//   (checked the "Single"/"10-in-1"/"Carton Box" generic-looking template images; all three are
//   printed "MINT", not neutral). One confirmed flavor photo is not enough to build an honest
//   product-level card or a meaningfully-populated variant media table — stays on the glyph
//   fallback. Do not re-attempt this exact path (slug-guessing individual flavor URLs) without a
//   better index of infy.my's current flavor lineup.
// - Pod-150 (KS Quikpro 15K cartridge): brand/model confirmed at the official kardinal.com product
//   page, which explicitly states "up to 15,000 puffs" for the cartridge — an exact match. The only
//   cartridge-specific image on that page is a grey technical dimension diagram (line-art, no
//   color/material), not a product photograph — rejected as not representative. Stays blocked.
//   RESOLVED round list19 (18/10): card = OKami24 re-shoot of the pod (VERIFIED_MEDIA["Pod-150"]).
// - Pod-149 (SKE Crystal B20K), Disposable-34 (Insta Bar PX 15000), coil-62 (Feelin C1 "Matcha
//   Clear" cartridge): quick official-site checks found real product lines at skevape.com/
//   instabar.net/nevoks.com but no exact model/puff-count/color match in the results returned
//   (SKE's real lineup tops out at "15K" not "20K"; Instabar's real models are "DC"/"WT" not "PX";
//   Nevoks' Feelin C1 product page did not expose a "Matcha" variant or per-color image mapping).
//   Not pursued further this session — each would need a dedicated, deeper site crawl to resolve
//   the naming gap, which is disproportionate effort for one item in a long low-leverage queue.
// ===================================================================================

const VERIFIED_MEDIA: Record<string, ProductAsset[]> = {
  // Round list19 (18/10): SKE Crystal B20000 — OKami24 re-shoot (batch 7) of the shop's Thai Milk Green Tea poster (the in-stock flavour).
  "Pod-149": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-149/card.webp",
      alt: "SKE Crystal B20000 disposable, Thai Milk Green Tea, studio photo",
      angle: "Front three-quarter, studio re-shoot (round list19, IMAGE_SPEC §0 item 7) of the shop's poster. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from the shop's SKE Crystal B20000 poster",
      sourceUrl: "https://pod789.com/product/ske-crystal-20000-puffs/",
    },
  ],
  // Round list19 (18/10): Pop Up 10K — OKami24 re-shoots (batch 7) of the shop's flavour posters; card = the Coke pod (in stock).
  "Pod-154": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-154/card.webp",
      alt: "Pop Up 10K pod on its battery base, Coke, studio photo",
      angle: "Front, studio re-shoot (round list19, IMAGE_SPEC §0 item 7) of the shop's Pop Up 10K flavour poster. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster",
      sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/",
    },
  ],
  // Round list19 (18/10): Kardinal's own Quikpro render (Black, transparent PNG) from kardinal.com/products/quikpro.
  "KS-QUIKPRO-KIT": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/ks-quikpro-kit/card.webp",
      alt: "KS Quikpro device with cartridge, Black, official product render",
      angle: "Front, upright — Kardinal's official Quikpro render (Black_Individual, 2674x3342 transparent PNG) from kardinal.com/products/quikpro.",
      transparentBackground: true,
      sourceName: "Kardinal (official brand site)",
      sourceUrl: "https://www.kardinal.com/products/quikpro",
    },
  ],
  // Round list19 (18/10): the maker's only cartridge image is a line-art diagram, so the card is an OKami24 re-shoot of the pod
  // (batch 7 master, aiRender in scripts/process-images.map.json). Same black pod for every flavour; the flavour shows only on the box.
  "Pod-150": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-150/card.webp",
      alt: "KS Quikpro replacement cartridge, black translucent pod, studio photo",
      angle: "Front, studio re-shoot (round list19, IMAGE_SPEC §0 item 7) of the pod on the shop's flavour-box poster; shape checked against Kardinal's Quikpro device render and cartridge diagram. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from the KS Quikpro flavour-box poster",
      sourceUrl: "https://www.kardinal.com/products/quikpro",
    },
  ],
  // ---------------------------------------------------------------------------------
  // Catalog-intelligence mission (2026-09-02) — media wave. Every asset below was
  // downloaded, decoded, checked through `checkQuality()` at role "card", AND looked at
  // directly before being committed (the README's "automated checks are a guardrail, not
  // the final judge" rule). Provenance tier is stated truthfully per entry.
  // ---------------------------------------------------------------------------------
  "Coil-70": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-70/card-v3.webp",
      alt: "dotmod dotCoil 0.7Ω (14-20w) coil box with five brass coils, studio photo",
      angle: "Box back, studio re-shoot 10/10 — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) from Element Vape's photo of the 0.7Ω box back and its blister of 5 (dotmod no longer lists 0.7Ω, so no maker photo exists); box art, every printed mark and the coil shape checked by eye against that photo. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Element Vape's product photo",
      sourceUrl: "https://www.elementvape.com/dotmod-dotcoils",
    },
  ],
  "Coil-83": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-83/card-v2.webp",
      alt: "VOOPOO ARGUS POD empty refillable pod cartridge, 2 mL, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Vapormo's photo of the ARGUS POD empty cartridge (800 px, SKU VAPC20221025); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Vapormo's product photo",
      sourceUrl: "https://cdn.shopify.com/s/files/1/0404/9154/8827/products/VAPC20221025.jpg",
    },
  ],
  "Coil-87": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-87/card-v2.webp",
      alt: "VOOPOO TPP Pod, black, 5.5 mL empty pod cartridge, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of 3FVape's photo of the black TPP Pod 2-pack (one pod shown — the shop sells it per pod); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from 3FVape's product photo",
      sourceUrl: "https://www.3fvape.com/new-arrivals/48028-authentic-voopoo-tpp-empty-pod-cartridge-for-tpp-tank-atomizer-drag-3-kit-drag-x-plus-kit-black-55ml-2-pcs.html",
    },
  ],
  "Pod-169": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-169/card.webp",
      alt: "INFY PLUS 2.5ML prefilled pod cartridge retail boxes, seven flavours from the INFY \"This Is Salts\" series",
      angle: "First-party INFY brand product render, cropped to the product cluster to remove a large decorative backdrop (composition only — nothing about the product was removed, recoloured or relabelled). PRODUCT-LEVEL LINEUP SHOT, flagged as exactly that per the README's multi-variant rule, not a per-flavour image. IDENTITY PROOF: every box reads \"INFY PLUS\" / \"2.5 ML CAPACITY\" / \"THIS IS SALTS · MALAYSIA SERIES\", matching this record's name (\"หัว infy 2.5 ml\") and infy.my's own 2.5ML Cartridge product page. DISCLOSED LIMITATION: of the seven flavours pictured, only \"Tropical Mix Fruit\" is one of this record's nine active children — INFY's own published media covers the brand's wider (largely Malaysian) flavour range, and no first-party photo exists for the other eight Thai-market flavours. The frame is therefore truthful about WHAT the product is and is not a claim about which flavours are stocked; the variant picker remains the authority on that.",
      transparentBackground: false,
      sourceName: "INFY / This Is Salts (infy.my — the brand's own site, first-party)",
      sourceUrl: "https://www.infy.my/infy-2-5ml-cartridge/",
    },
  ],
  // Full-catalog mission — second media wave. All tier-2 (real retailer product photography of
  // official manufacturer packaging, never AI-generated, never watermarked — checked and, where a
  // source carried a retailer watermark baked into the frame, cropped to the watermark-free
  // portion of the same real photo rather than used as-is).
  "Coil-68": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-68/card-v2.webp",
      alt: "VOOPOO ITO-X pod cartridge, black, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of VOOPOO's own product photo of the black ITO-X (1000 px, VOOPOO's Shopline store); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product photo",
      sourceUrl: "https://img-va.myshopline.com/image/store/1747294110724/Black1000.jpg",
    },
  ],
  "Coil-63": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-63/card.webp",
      alt: "RINCOE Jellybox Nano replacement coil, 0.5Ω mesh, 3-pack, isolated product shot",
      angle: "Front, plain crop, not alpha-keyed. Provenance: this is a retailer (3FVape) product photo, tier-2 — the retailer's own listing carries a \"Picture is Provided by the Manufacturer\" caption, but that is the retailer's own unverified claim, not an independent confirmation, so this is documented as retailer/tier-2 sourcing, not upgraded to official/first-party. Each coil in the photo is legibly printed \"Mesh 0.5Ω 20-28W\" — an exact resistance match to this record's single active child, and the listing itself is a dedicated 0.5Ω-only product (not a shared 0.5/1.0Ω selector image).",
      transparentBackground: false,
      sourceName: "3FVape (vape retailer; not RINCOE's own site — tier-2 sourcing)",
      sourceUrl: "https://www.3fvape.com/coil/51745-authentic-rincoe-jellybox-nano-pod-system-pod-cartridge-replacement-mesh-coil-05ohm-rdl--freebase--3-pcs.html",
    },
  ],
  "Coil-1": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-1/card-v2.webp",
      alt: "VOOPOO PnP coils PnP-TW15 0.15Ω, PnP-DW60 0.6Ω and PnP-TR1 1.2Ω side by side, studio photo",
      angle: "Front, studio re-shoot (round \"3 coil photos\", 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of VOOPOO's own box + coil images (shop.voopoo.com gallery, the panels of the previous card) with Vapevo's upright coil photos for TW15 / DW60 (1080 px); shape checked against that photo (scripts/ai-fidelity-sheet.js outline overlay) and every printed mark by eye; card = the coils of the three option renders lined up by row.js (no AI). Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product images",
      sourceUrl: "https://shop.voopoo.com/products/pnp-coils",
    },
  ],
  "Coil-72": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-72/card-v2.webp",
      alt: "VOOPOO VMATE Cartridge V2 (side fill) and VMATE Top Fill Cartridge, studio photo",
      angle: "Front, studio re-shoot (round \"3 coil photos\", 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Vapormo's photo of the two VMATE Cartridge V2 pods, 0.7Ω and 1.2Ω on the tab (800 px), and Vapesourcing's photo of the VMATE Top Fill pod (800 px; the 0.4Ω and 0.7Ω pods look the same); shape checked against that photo (scripts/ai-fidelity-sheet.js outline overlay) and every printed mark by eye; card = the V2 0.7Ω and Top Fill renders staggered by stagger.js (no AI). Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Vapormo's and Vapesourcing's product photos",
      sourceUrl: "https://www.vapormo.com/products/voopoo-vmate-v2-pod-cartridge-for-vmate-vmate-e-kit-2pcs-pack",
    },
  ],
  "Coil-94": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-94/card-gpp.webp",
      alt: "UWELL CALIBURN GPP Integrated Coil Cartridge, box and 3 pods, studio photo",
      angle: "Front, studio re-shoot 16/10 (round img-1610: the shop now sells the new GPP 3-pack, admin 16/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of the shop's own stock photo of each resistance: the box upright with its 3 pods standing in front; every printed word and the ring colour checked by eye against that photo; card = the 0.4Ω pack. Was the CALIBURN G3 Refillable Pod (4 pods). Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from the shop's own stock photo of the GPP 3-pack",
      sourceUrl: "https://www.myuwell.com/g-pod-platform",
    },
  ],
  "Pod-159": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-159/card-v2.webp",
      alt: "ESKO BAR SWITCH reusable pod device, Purple and Yellow colorways, isolated product shot",
      angle: "Front, isolated — OKami24 Higgsfield re-shoot (IMAGE_SPEC §0 item 7, round img-1610) of the official manufacturer render, same composition. Note: this Shipnity parent's active children (\"Cool Mint\", \"Cola\") are the brand's own bundled-pod-flavor labels for this device kit, confirmed directly against eskobarvape.com's own product page — not device colorways (the device itself ships in Purple/Yellow/Black) — so this image honestly shows the real reusable hardware being sold rather than implying the flavor names are device colors.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from ESKO BAR's official render",
      sourceUrl: "https://eskobarvape.com/product/pod-system/",
    },
  ],
  "coil-54": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-54/card-v2.webp",
      alt: "NEVOKS Feelin Mini empty refillable pod cartridges, pair, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of evolutionvaping.co.uk's photo of the 2-pack (600 px, the largest clean pod-only photo found 08/10); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Evolution Vaping's product photo",
      sourceUrl: "https://evolutionvaping.co.uk/products/feelin-mini-replacement-pods-2-pack-by-nevoks",
    },
  ],
  // Heated-tobacco wave — official first-party media throughout (found via each specific
  // color/flavor product page's own `og:image` meta tag, which points at the brand's real CDN
  // asset for that exact page, not a generic/shared image).
  // Round list19 (17/10): the 09-03 crop (blurry, withdrawn 09-06) is replaced by LAMBDA's own per-colour store photo.
  "IQOSHEET-14": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-14/card-v2.webp",
      alt: "LAMBDA i8 heat-not-burn device, Red, official product photo",
      angle: "Front, upright, screen on — LAMBDA's own store gallery photo of the Red i8 (lambdasmoke.com, 1000x1000 on white; white cut off by scripts/process-images.ts). Red = one of the two colours the warehouse holds (Shipnity Max IQOSHEET-14-4).",
      transparentBackground: true,
      sourceName: "LAMBDA (official brand site, lambdasmoke.com)",
      sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html",
    },
  ],
  "IQOSHEET-15": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-15/card.webp",
      alt: "IQOS TEREA tobacco sticks, 4 official flavor packs (Green, Blue, Sienna, Purple Wave)",
      angle: "FULL REBUILD (owner quality review, 2026-09-02) — REPLACES the previous composite entirely, not a patch. The prior composite used PMI's OLDER pack-box-front photography; direct re-fetch of media.iqos.com this pass found PMI has since shipped a redesigned \"NEW LOOK SAME TASTE\" pack graphic (a fanned 5-stick render, not a box front) across every flavor checked — the old asset was stale, not merely improvable. Rebuilt as a 2×2 grid of 4 real official per-flavor photos (Green, Blue, Sienna, Purple Wave), each the SAME new-design CDN asset now used for that flavor's own per-variant image below, cropped to the stick-fan region only (excluding the temporary \"NEW LOOK\" campaign ribbon and the flavor-name badge, which read as clutter at composite/thumbnail scale). Chosen to read as one coherent current family, matching every per-variant asset below rather than being a separate, disconnected representation.",
      transparentBackground: true, // background cut 2026-09-05 by scripts/process-images.ts --fix-opaque (flat white/dark bg → alpha); pixels of the product untouched,
      sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia market, iqos.com/id)",
      sourceUrl: "https://media.iqos.com/is/image/pmintl/product/1000px/TEREA+GREEN+PACK-pmi_G0000699_00_id-1782351563000.png",
    },
  ],
  "IQOSHEET-16": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-16/card-v2.webp",
      alt: "IQOS ILUMA i PRIME, Aspen Green, isolated official product render",
      angle: "Official manufacturer render, sourced directly from iqos.com/ph's own dedicated \"ILUMA i PRIME Aspen Green\" product page (via that page's own og:image meta tag, confirmed page-specific, not a generic/shared image). Aspen Green is one of this parent's 3 real active colors (also Midnight Black, Breeze Blue) — shown as the representative shot per the same one-static-card-image convention used elsewhere; not claimed to show all 3.",
      transparentBackground: true,
      sourceName: "IQOS (official brand site)",
      sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html",
    },
  ],
  "IQOSHEET-18": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-18/card-v2.webp",
      alt: "IQOS ILUMA i, Breeze Blue, isolated official product render",
      angle: "Official manufacturer render, sourced directly from iqos.com/ph's own dedicated \"ILUMA i Breeze Blue\" product page (via that page's own og:image meta tag). That same page's own on-page copy states \"IQOS ILUMA i is designed to be used with TEREA tobacco sticks\" — independent confirmation this is genuinely the ILUMA i device, not the original/Standard generation (see TAXONOMY_MATCHES[\"IQOSHEET-18\"]).",
      transparentBackground: true,
      sourceName: "IQOS (official brand site)",
      sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html",
    },
  ],
  "IQOSHEET-17": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-17/card-v2.webp",
      alt: "IQOS ILUMA i ONE, Breeze Blue, official product render",
      angle: "Official manufacturer render (round list19, 17/10): iqos.com/ph's ILUMA i ONE Breeze Blue kit page og:image pmi_G0002077_00, fetched as a 2048 px transparent PNG; the IQOS caption line printed under the device is cropped off (scripts/process-images.map.json). Breeze Blue = the warehouse's in-stock colour.",
      transparentBackground: true,
      sourceName: "IQOS (official brand site)",
      sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-breeze-blue.html",
    },
  ],
  "Coil-56": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-56/card-v2.webp",
      alt: "VOOPOO PnP X Cartridge MTL, silver, 5 mL, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Vapesourcing's photo of the silver PnP X Cartridge MTL (800 px); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Vapesourcing's product photo",
      sourceUrl: "https://image.vapesourcing.com/images/202509/silver-voopoo-pnp-x-tank-empty-mtl.jpg",
    },
  ],
  "Coil-74": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-74/card-v3.webp",
      alt: "UWELL CALIBURN X 3 mL empty pod cartridge box with two pods, studio photo",
      angle: "Box front with its two pods, studio re-shoot 11/10 — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) from a retailer's 1652 px photo of the CALIBURN X 3 ml box (2 PCS) and its pods (myuwell.com no longer lists the CALIBURN X); box art, every printed word and number and the pod shape checked by eye against that photo. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from a retailer's box photo",
      sourceUrl: "https://cdn.shoplightspeed.com/shops/608288/files/56151148/1652x1652x2/uwell-caliburn-x-3ml-replacement-pod-box-of-2.jpg",
    },
  ],
  "Coil-89": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-89/card-v2.webp",
      alt: "RINCOE Jellybox V pod cartridges, Mesh 0.8Ω (red stripes) and Mesh 1.0Ω, studio photo",
      angle: "Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Vapormo's photo of both Jellybox V pods side by side (800 px; 0.8Ω with three red stripes, 1.0Ω without); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Vapormo's product photo",
      sourceUrl: "https://www.vapormo.com/products/rincoe-jellybox-v-pod-cartridge-3ml-3pcs-pack",
    },
  ],
  "Coil-38": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-38/card-v3.webp",
      alt: "VOOPOO TPP-DM2 0.2Ω coil box with three coils, studio photo",
      angle: "Front, studio re-shoot 09/10 (coil-94 box-shot direction, owner passed 09/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Giant Vapes' TPP-DM2 box photo: the box upright with its three coils out of the blister lying in front; every printed mark checked by eye against that photo. Card = the DM2 option shot. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Giant Vapes' product photos",
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
      src: "/assets/products/coil-55/card-v3.webp",
      alt: "UWELL CALIBURN G2 empty refillable pod cartridge, studio photo",
      angle: "Front, studio re-shoot 16/10 (round img-1610: re-shot large in frame from a larger Vapesourcing photo — render, prompt and check in scripts/process-images.map.json `aiRender`). Before: Front, studio re-shoot (round \"option photos\" batch 4, 08/10) — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) of Vapesourcing's photo of the CALIBURN G2 pod (800 px); shape checked against that photo (scripts/ai-fidelity-sheet.js, outline + IoU) and every printed mark by eye. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Vapesourcing's product photo",
      sourceUrl: "https://image.vapesourcing.com/images/202111/uwell-caliburn-g2-pod3_(1).jpg",
    },
  ],
  "Coil-53": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-53/card-v4.webp",
      alt: "UWELL CALIBURN G 1.0Ω coil box with four coils, studio photo",
      angle: "Card re-centred on its visual weight 16/10 (round img-1610, process-images `balance`). Front, studio re-shoot 09/10 — OKami24 render (Higgsfield, IMAGE_SPEC §0 items 7–8) from Element Vape's photos of the 1 Ω box and its blister of 4 (round cotton holes of the 1 Ω coil); the render's three coils + one copied coil = the 4 of the box; box art, every printed mark and the coil shape checked by eye against those photos. Source, prompt and check per file in scripts/process-images.map.json `aiRender`.",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from Element Vape's product photos",
      sourceUrl: "https://www.elementvape.com/uwell-caliburn-g-coils",
    },
  ],
  // Tier-1 disposable growth mission (2026-09-03) — closes the last blocker on Pod-180. Real price
  // (฿359, unambiguous) and 10 real, currently-stocked flavors were already present in
  // active-catalog-source.ts; only media was missing. wotofo.com's own Shopify `variants` JSON
  // shows every one of ITS flavors sharing this same image as the default/featured product photo
  // (not a per-flavor render), so it is genuinely the brand's own general product-identity shot —
  // used here the same way, as a device-identity card, not a claim about any specific flavor.
  // IMPORTANT DISCLOSED LIMITATION: this device's international (wotofo.com) flavor lineup
  // (Cherry Ice, Forest Berries, Mango Ice, etc.) does NOT overlap with the flavors actually
  // stocked for the Thai market (see this record's real `variants` in the ProductMaster candidate
  // below) — a common real pattern for a global brand's region-specific flavor releases. The card
  // photo is the same physical hardware in both markets; the flavor list is Thailand's own.
  // Image-fix round 2026-09-30: the old card was WOTOFO's nexBAR 18K (another device — it moved to src/data/products/wotofo.ts).
  // New card = OKami24 Higgsfield remake of the device on the maker's own poster (owner-supplied); scripts/process-images.map.json.
  "Pod-180": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/nexbar-clear-18k/card-v2.webp",
      alt: "nexBar CLEAR 18K disposable, clear body, front view",
      angle: "Front, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of the device on the maker's own poster (owner-supplied, also on https://ihavevape.net/product/nexbar-clear-18k-puffs/).",
      transparentBackground: true,
      sourceName: "OKami24 render (Higgsfield) from the maker's poster",
      sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/",
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
  // Round list19 (18/10): warehouse facts only — the model name "B20000 Puffs" (Max) and the device print "B20000".
  "Pod-149": {
    specifications: [
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "สูงสุด 20,000", sourceStatus: "verified" },
    ],
    sourceUrls: [],
  },
  // Round list19 (18/10): warehouse facts only (no maker page) — the name "10K" and the pod's own print "10000 PUFFS".
  "Pod-154": {
    specifications: [
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "หัวละสูงสุด 10,000", sourceStatus: "verified" },
    ],
    sourceUrls: [],
  },
  // Round list19 (18/10): kardinal.com/products/quikpro spec list "Finish Black Blue Grey Red · Liquid Capacity 15ml · Capacity 600mAh ·
  // Charging Time 30 minutes · In the Box … USB-C Charge Cable", FAQ "up to 15,000 puffs, depending on personal usage".
  "KS-QUIKPRO-KIT": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "600mAh", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "charging", label: "การชาร์จ", value: "USB-C ราว 30 นาที", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "capacity", label: "ความจุหัวพอต", value: "15ml", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "หัวละสูงสุด 15,000", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "colors", label: "สีตัวเครื่อง", value: "Black · Blue · Grey · Red", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
    ],
    sourceUrls: ["https://www.kardinal.com/products/quikpro"],
  },
  // Round list19 (18/10): kardinal.com/products/quikpro — spec list "Liquid Capacity 15ml", FAQ "Each 15ml cartridge can provide up to
  // 15,000 puffs, depending on personal usage" / "the e-liquid cartridge is replaceable, it is not refillable", cartridge diagram
  // "Height 76.7 mm · Depth 24.4 mm · Weight 29.4 g".
  "Pod-150": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "15ml", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "หัวละสูงสุด 15,000", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "refill", label: "การใช้งาน", value: "ใช้จนหมดแล้วเปลี่ยนหัวใหม่", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "dimensions", label: "ขนาดหัว", value: "สูง 76.7 mm · หนา 24.4 mm", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "weight", label: "น้ำหนักหัว", value: "29.4 g", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "เครื่อง KS Quikpro", sourceStatus: "verified", sourceUrl: "https://www.kardinal.com/products/quikpro" },
    ],
    sourceUrls: ["https://www.kardinal.com/products/quikpro"],
  },
  // ---------------------------------------------------------------------------------
  // Catalog-intelligence mission (2026-09-02). Discrete, individually-sourced manufacturer
  // facts only — no marketing paragraphs, and anything a source did not actually state is
  // simply absent rather than guessed.
  // ---------------------------------------------------------------------------------
  "Coil-70": {
    specifications: [
      { key: "resistance", label: "ค่าโอห์ม", value: "0.7Ω", sourceStatus: "verified" },
      { key: "wattage", label: "กำลังไฟที่แนะนำ", value: "14-20W", sourceStatus: "verified" },
      { key: "pack-size", label: "จำนวนต่อกล่อง", value: "5 หัว (บรรจุแยกซองละหัว)", sourceStatus: "verified" },
      { key: "construction", label: "โครงสร้าง", value: "ตัวเรือนทองเหลือง คอยล์ mesh เดี่ยว", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "dotAIO V2 / dotAIO V2 Lite / dotStick Revo / dotPod Max / dotTank 25mm", sourceStatus: "verified" },
    ],
    // Wattage/resistance are read directly off the retail box in this record's own card photo;
    // pack size, brass construction and the device list are from dotmod's own dotCoils page.
    sourceUrls: ["https://dotmod.com/products/dotcoils", "https://www.elementvape.com/dotmod-dotaio-v2-dotcoils"],
  },
  "Coil-83": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2.0 ml", sourceStatus: "verified" },
      { key: "pack-size", label: "จำนวนต่อกล่อง", value: "2 หัว", sourceStatus: "verified" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "หัวพอตเปล่า ต้องซื้อคอยล์ ITO แยก", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Argus Pod / Argus P1 / Argus Z / Argus G / Argus A", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.healthcabin.net/voopoo-argus-pod-argus-p1-argus-z-argus-g-argus-a-empty-cartridge-p/28679.html"],
  },
  "Coil-87": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "5.5 ml", sourceStatus: "verified" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "หัวพอตเปล่า ใช้กับคอยล์ TPP", sourceStatus: "verified" },
      { key: "coil-fit", label: "การติดตั้งคอยล์", value: "แบบกดล็อก (press-fit) รองรับคอยล์ตระกูล TPP", sourceStatus: "verified" },
      // Round data 2 (owner 2026-09-25, Q1): the "connection: magnetic" row is cut — no VOOPOO page could be reached to
      // back it (voopoo.com does not resolve; shop.voopoo.com lists no TPP Pod), and a magnetic claim stands only with a
      // maker source.
      // Storefront quality-correction pass — this pod HOUSES the TPP coils (see coil-38, the
      // same platform), so it needs the same host devices as those coils. No structured link is
      // added (neither DRAG 3 nor DRAG X Plus exists in this catalog — see catalog-relationships
      // .ts's TRUTHFUL NO-LINKS note), but the free-text fact is genuinely useful and shares the
      // same VOOPOO citation already used for coil-38's own compatible-devices spec.
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "DRAG 3 Kit, DRAG X Plus Kit (ใช้ร่วมกับคอยล์ตระกูล TPP)", sourceStatus: "verified" },
    ],
    // Capacity is also legible on the retail box in this record's own card photo ("5.5ml").
    sourceUrls: ["https://www.elementvape.com/voopoo-tpp-pods", "https://shop.voopoo.com/products/tpp-coils"],
  },
  "Pod-169": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2.5 ml", sourceStatus: "verified" },
      { key: "prefilled", label: "ชนิดหัวพอต", value: "หัวพอตบรรจุสำเร็จ คอยล์ในตัว (ระบบปิด ใช้หมดแล้วเปลี่ยนหัวใหม่)", sourceStatus: "verified" },
    ],
    // Capacity from infy.my's own 2.5ML Cartridge page (first-party) — it explicitly notes the
    // upgrade from the earlier 2ml cartridge. The prefilled/closed-system fact comes from a
    // retailer reproducing the manufacturer blurb verbatim; battery/puff-count/nicotine figures
    // circulating on Thai listings are NOT first-party and are deliberately not recorded here.
    sourceUrls: ["https://www.infy.my/infy-2-5ml-cartridge/", "https://www.infy.my/thailand/"],
  },
  // Full-catalog mission — VOOPOO's official VINCI replacement-coil line runs on the PnP coil
  // platform (confirmed by both sources below); this parent's 3 active resistances (0.15Ω/0.6Ω/
  // 1.2Ω, one 0.6Ω/1.2Ω pair differing only by rubber-grommet color) map to real official
  // PnP-platform coil codes and wattage ranges.
  "Coil-1": {
    specifications: [
      { key: "wattage-015", label: "กำลังไฟที่แนะนำ (0.15Ω, DTL)", value: "60-80W", sourceStatus: "verified" },
      { key: "wattage-06", label: "กำลังไฟที่แนะนำ (0.6Ω, PnP-M2)", value: "20-28W", sourceStatus: "verified" },
      { key: "wattage-12", label: "กำลังไฟที่แนะนำ (1.2Ω, PnP-C1, MTL)", value: "10-15W", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "VINCI Pod / VINCI X Pod / DRAG Baby Trio", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.alivape.com/products/voopoo-vinci-replacement-pnp-coil", "https://www.blacknote.com/e-juice/voopoo-pnp-coils/"],
  },
  "Coil-38": {
    specifications: [
      { key: "wattage-02", label: "กำลังไฟที่แนะนำ (TPP-DM2, 0.2Ω)", value: "40-60W", sourceStatus: "verified" },
      { key: "wattage-03", label: "กำลังไฟที่แนะนำ (TPP-DM4, 0.3Ω)", value: "32-40W", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "TPP Pod / DRAG 3 Kit / DRAG X Plus Kit", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://shop.voopoo.com/products/tpp-coils"],
  },
  "Coil-63": {
    specifications: [{ key: "wattage", label: "กำลังไฟที่แนะนำ (0.5Ω, RDL)", value: "20-28W", sourceStatus: "verified" }],
    sourceUrls: ["https://www.fogbuddies.com/products/rincoe-jellybox-nano-coil"],
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
  // (The earlier, single-fact "Coil-87" entry that lived here has been MERGED into the fuller
  //  entry at the top of this table — a duplicate object key would have silently discarded one of
  //  them. Its one fact, the compatible-device list, was deliberately NOT carried over: it was
  //  derived from the TPP *coil* page rather than a TPP Pod page, and this mission's compatibility
  //  research established that none of the devices it names — DRAG 3, DRAG X Plus — exists in this
  //  catalog, so the claim had no linkable endpoint and no independent confirmation. See
  //  src/data/catalog-relationships.ts for how device compatibility is now recorded instead.)
  "Coil-92": {
    specifications: [{ key: "wattage", label: "กำลังไฟที่แนะนำ (0.15Ω)", value: "60-80W (DTL)", sourceStatus: "verified" }],
    sourceUrls: ["https://shop.voopoo.com/products/pnp-x-coils"],
  },
  "Coil-53": {
    specifications: [
      { key: "resistance", label: "ค่าโอห์ม", value: "1.0Ω", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Caliburn G / Caliburn G2", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.myuwell.com/caliburn/caliburn-g2", "https://giantvapes.com/products/uwell-caliburn-g-replacement-coils"],
  },
  "Coil-89": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "3.0mL เติมด้านข้าง", sourceStatus: "verified" },
      { key: "wattage", label: "กำลังไฟที่แนะนำ", value: "10-16W (เครื่องปรับให้เองตามโอห์ม)", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Jellybox V1 / V2 / V3", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://thevapetown.com/products/rincoe-jellybox-v-pod-cartridge-0-8-ohm-1pc", "https://www.alivape.com/products/rincoe-jellybox-v-replacement-pods"],
  },
  "Coil-94": {
    specifications: [
      // Data round (2026-09-24, batch 5, real browser): UWELL's own GPP page lists these four resistances and a capacity
      // that depends on the cartridge type — side refill 3.0mL (MTL 0.6–1.2Ω: 2.5mL), top refill RDL 3.0mL / MTL 2.0mL.
      // The old flat "2mL" came from a shop page (giantvapes.com) and read as if it contradicted the G5's 3mL.
      { key: "resistance-range", label: "ค่าโอห์ม", value: "0.4Ω / 0.6Ω / 0.9Ω / 1.2Ω (mesh)", sourceStatus: "verified" },
      { key: "capacity-by-type", label: "ความจุ", value: "2.0–3.0 mL แล้วแต่ชนิดหัว GPP (เติมข้าง/เติมบน · RDL/MTL)", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.myuwell.com/g-pod-platform"],
  },
  // Round data 2 (2026-09-25, real browser) — the three empty pods whose card line was blank. Each row is read on the
  // maker's own page; nothing else is claimed.
  //   Coil-55: myuwell.com Caliburn G2 "SPECIFICATIONS … E-liquid Capacity： 2 ml" (the G2 pod is what this empty cartridge is).
  //   Coil-68: shop.voopoo.com ITO-X Pod "Capacity: 3.5ml (standard version) · Filling Type: Top filling", "compatible with Drag
  //            Q Pod Kit and ITO coils", "Package: 1* ITO-X Pod 3.5ml 1* Drip Tip" (no coil in the box).
  //   coil-54: nevoks.com Feelin Mini — its spec image "Cartridge Parameters · Capacity 2ml" + packing list "Feelin Mini Empty
  //            Cartridge(2ml)", and the page text "Compatible with the SPL10 series of coil".
  "Coil-55": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2mL", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g2" },
    ],
    sourceUrls: ["https://www.myuwell.com/caliburn/caliburn-g2"],
  },
  "Coil-68": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "3.5mL (รุ่นมาตรฐาน) เติมด้านบน", sourceStatus: "verified", sourceUrl: "https://shop.voopoo.com/products/ito-x-pod-cartridge" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "หัวพอตเปล่า ใช้กับคอยล์ ITO", sourceStatus: "verified", sourceUrl: "https://shop.voopoo.com/products/ito-x-pod-cartridge" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "DRAG Q Pod Kit", sourceStatus: "verified", sourceUrl: "https://shop.voopoo.com/products/ito-x-pod-cartridge" },
    ],
    sourceUrls: ["https://shop.voopoo.com/products/ito-x-pod-cartridge"],
  },
  "coil-54": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2mL", sourceStatus: "verified", sourceUrl: "https://nevoks.com/products/nevoks-feelin-mini-pod-kit" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "หัวพอตเปล่า ใช้กับคอยล์ SPL10", sourceStatus: "verified", sourceUrl: "https://nevoks.com/products/nevoks-feelin-mini-pod-kit" },
    ],
    sourceUrls: ["https://nevoks.com/products/nevoks-feelin-mini-pod-kit"],
  },
  // Data round (2026-09-24, chat 2, real browser): ESKO's own SWITCH page — "Specifications" block (18ml CARTRIDGE
  // CAPACITY · 850MAH BATTERY CAPACITY · 5V 0.85A CHARGING CURRENT) and the feature text ("20,000 puffs", "three distinct
  // airflow settings", "High (H) mode … Low (L) mode", "simultaneous dual-coil heating"). Nothing else is claimed.
  "Pod-159": {
    specifications: [
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "สูงสุด 20,000", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "battery", label: "แบตเตอรี่", value: "850mAh", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "capacity", label: "ความจุหัวพอต", value: "18mL", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "charging", label: "การชาร์จ", value: "5V 0.85A", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "airflow", label: "ช่องลม", value: "ปรับได้ 3 ระดับ หมุนที่ก้นพอต", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "modes", label: "โหมดการทำงาน", value: "High กับ Low กดปุ่มเดียวสลับได้", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
      { key: "coil", label: "คอยล์", value: "คอยล์คู่ ทำงานพร้อมกัน", sourceStatus: "verified", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    ],
    sourceUrls: ["https://eskobarvape.com/product/pod-system/"],
  },
  // Image-fix round 2026-09-30: nexBar CLEAR 18K. No maker site exists (researcher 29-30/09); the facts are the maker's
  // own poster, which the owner supplied and which https://ihavevape.net/product/nexbar-clear-18k-puffs/ and https://pod789.com/product/nexbar-18k-2/ carry verbatim.
  // Rows name no sourceUrl: a row URL must be a maker domain (verified-specs test), and none exists for this device.
  "Pod-180": {
    specifications: [
      { key: "puffs", label: "จำนวนพัฟที่ระบุ", value: "สูงสุด 18,000", sourceStatus: "verified" },
      { key: "battery", label: "แบตเตอรี่", value: "650mAh", sourceStatus: "verified" },
      { key: "charging", label: "การชาร์จ", value: "ชาร์จซ้ำได้ผ่าน USB-C", sourceStatus: "verified" },
      { key: "capacity", label: "ความจุน้ำยา", value: "18mL", sourceStatus: "verified" },
      { key: "coil", label: "คอยล์", value: "Dual Nex Mesh (mesh สองตัว)", sourceStatus: "verified" },
      { key: "airflow", label: "ช่องลม", value: "ปรับได้", sourceStatus: "verified" },
      { key: "modes", label: "โหมดการทำงาน", value: "Normal สูบนุ่ม ใช้ได้นานขึ้น / Turbo รสเต็ม ไอหนา", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://ihavevape.net/product/nexbar-clear-18k-puffs/", "https://pod789.com/product/nexbar-18k-2/"],
  },
  // Round list19 (17/10, in-app browser): every row = the "Description" block of LAMBDA's own i8 store page.
  "IQOSHEET-14": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "3200mAh", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "sessions", label: "จำนวนก้านต่อการชาร์จ 1 ครั้ง", value: "35–40 ก้าน", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "charge-time", label: "การชาร์จ", value: "5V / 2A ชาร์จเต็มประมาณ 2.5 ชั่วโมง", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "temperature", label: "อุณหภูมิ", value: "ปรับได้ 200–300°C", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "session-time", label: "เวลาต่อก้าน", value: "ปรับได้ 3–6 นาที", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "heating", label: "ระบบอุ่น", value: "Smart Induction · จอ LED", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "compatible-sticks", label: "ใช้ได้กับก้าน", value: "TEREA / SENTIA", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "materials", label: "วัสดุ", value: "อะลูมิเนียมอัลลอย + PPSU + PEEK", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "dimensions", label: "ขนาด", value: "102.8 × 28.9 × 20.8 mm", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
      { key: "weight", label: "น้ำหนัก", value: "83 กรัม", sourceStatus: "verified", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    ],
    sourceUrls: ["https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html"],
  },
  "IQOSHEET-15": {
    specifications: [{ key: "compatible-devices", label: "ใช้ได้กับอุปกรณ์", value: "IQOS ILUMA (ทุกรุ่น) เท่านั้น — ใช้กับรุ่นก่อนหน้า ILUMA ไม่ได้", sourceStatus: "verified" }],
    sourceUrls: [
      "https://www.iqos.com/id/en/news/information/find-the-terea-tobacco-stick-flavor-variant-that-suits-for-you.html",
      "https://www.iqos.com/gb/en/blog/difference-between-iqos-iluma-and-iqos-3-duo.html",
    ],
  },
  // Round data 2 (2026-09-25, real browser): the single "2380mAh" row is gone — iqos.com/ph no longer prints 2380 anywhere
  // on the PRIME page (HTML searched), and that page's own spec text names two batteries: "Pocket Charger: 2,700 mAh; 2 hours
  // 15 minutes to fully charge · Holder: 300 mAh; Approx. 12 minutes to fully charge". Its "Compare the models" table gives
  // ILUMA i and ILUMA i PRIME the same "300 mAh Holder / 2700 mAh Charger", so iqosheet-16 and iqosheet-18 carry the same two
  // rows. Keys are "battery-charger" / "battery-holder", never "battery": the card line (card-headline-spec.ts) shows a lone
  // "2700mAh" for a "battery" row, which a buyer reads as the device's one battery — the part name must travel with the number.
  "IQOSHEET-16": {
    specifications: [
      { key: "battery-charger", label: "แบตเตอรี่กล่องชาร์จ (Pocket Charger)", value: "2700mAh ชาร์จเต็มประมาณ 135 นาที", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
      { key: "battery-holder", label: "แบตเตอรี่ตัวสูบ (Holder)", value: "300mAh", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
      { key: "charging", label: "การชาร์จ", value: "ผ่านสาย USB-C (มีในกล่อง)", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
      { key: "sessions", label: "จำนวนก้านต่อการชาร์จ 1 ครั้ง", value: "สูงสุด 20 ก้าน", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
      { key: "compatible-sticks", label: "ใช้ได้กับก้าน", value: "TEREA เท่านั้น", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
    ],
    sourceUrls: ["https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html"],
  },
  // Round list19 (17/10, in-app browser): the ILUMA i ONE page's own text — "pocket-sized integrated design and smooth,
  // aluminum finishing", FAQ "20 consecutive uses without recharge · 4 extra puffs with FlexPuff · Autostart / Autostop",
  // "Compare the models" row "20 uses per full charge · FlexPuff · Used with TEREA · 1728 mAh Holder battery capacity".
  // One-piece device = one battery, so the plain "battery" key is right here (unlike the two-part i / i PRIME above).
  "IQOSHEET-17": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "1728mAh", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html" },
      { key: "sessions", label: "จำนวนก้านต่อการชาร์จ 1 ครั้ง", value: "สูงสุด 20 ก้านติดกัน", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html" },
      { key: "design", label: "ตัวเครื่อง", value: "ชิ้นเดียว พกใส่กระเป๋าได้ ผิวอะลูมิเนียม", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html" },
      { key: "features", label: "ฟีเจอร์", value: "Autostart / Autostop · FlexPuff (ได้พัฟเพิ่มสูงสุด 4 ครั้งเมื่อก้านยังไม่หมด)", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html" },
      { key: "compatible-sticks", label: "ใช้ได้กับก้าน", value: "TEREA เท่านั้น", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html" },
    ],
    sourceUrls: ["https://www.iqos.com/ph/en/shop/iluma-i-one-holder-breeze-blue.html", "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-breeze-blue.html"],
  },
  "IQOSHEET-18": {
    specifications: [
      { key: "battery-charger", label: "แบตเตอรี่กล่องชาร์จ (Pocket Charger)", value: "2700mAh ชาร์จเต็มประมาณ 135 นาที", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
      { key: "battery-holder", label: "แบตเตอรี่ตัวสูบ (Holder)", value: "300mAh", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
      { key: "compatible-sticks", label: "ใช้ได้กับก้าน", value: "TEREA เท่านั้น", sourceStatus: "verified", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
    ],
    sourceUrls: ["https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html"],
  },
};

// ===================================================================================
// Verified VARIANT-specific media — full-catalog mission, second delta pass. Keyed by
// shipnityProductId → shipnityVariantId → ProductAsset. Wires through the previously-unused
// `ProductVariant.image` schema field (present since Phase 2/2.1, never populated until now)
// so a customer selecting a specific color/resistance/flavor sees the exact verified photo for
// THAT selection, not a generic composite. A product/variant absent here simply has no
// variant-specific image yet — `toView()` falls back to the product-level `assets` card, which
// stays the honest choice for every product not listed below (nothing here ever weakens or
// replaces the product-level fallback, it only adds a more specific option when real per-variant
// evidence exists). Every entry is a real, individually-verified photo — same sourcing standard
// as VERIFIED_MEDIA, same rule against watermarks/AI-generated/wrong-variant images. Where two
// variant ids share the exact same file, that reflects a real, disclosed identity finding (see
// TAXONOMY_MATCHES["Coil-1"]'s comment for the 1.2Ω dual-color case), not a placeholder.
// ===================================================================================

const VERIFIED_VARIANT_MEDIA: Record<string, Record<string, ProductAsset>> = {
  // Round list19 (18/10): SKE Crystal B20000 — the shop has a poster for Thai Milk Green Tea only; the other 7 show the no-photo panel.
  "Pod-149": {
    "Pod-149-6": { kind: "official-photo", role: "detail", src: "/assets/products/pod-149/variant-pod-149-6.webp", alt: "SKE Crystal B20000 disposable, Thai Milk Green Tea, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's SKE Crystal B20000 poster", sourceUrl: "https://pod789.com/product/ske-crystal-20000-puffs/" },
  },
  // Round list19 (18/10): Pop Up 10K — one re-shoot per flavour poster the shop has (14 of 18; Strawberry · Mixberry · Lime Soda ·
  // Guava Kiwi have no poster, they show the no-photo panel).
  "Pod-154": {
    "Pod-154-1": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-1.webp", alt: "Pop Up 10K pod on its battery base, Grape, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-2": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-2.webp", alt: "Pop Up 10K pod on its battery base, Watermelon, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-3": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-3.webp", alt: "Pop Up 10K pod on its battery base, Coke, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-4": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-4.webp", alt: "Pop Up 10K pod on its battery base, Mint Extra, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-5": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-5.webp", alt: "Pop Up 10K pod on its battery base, Hales Blue Boy, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-8": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-8.webp", alt: "Pop Up 10K pod on its battery base, Mangosteen, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-9": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-9.webp", alt: "Pop Up 10K pod on its battery base, Malee, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-10": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-10.webp", alt: "Pop Up 10K pod on its battery base, Peach, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-11": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-11.webp", alt: "Pop Up 10K pod on its battery base, Sugus Pineapple, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-12": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-12.webp", alt: "Pop Up 10K pod on its battery base, Sugus Raspberry, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-13": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-13.webp", alt: "Pop Up 10K pod on its battery base, Orange Soda, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-14": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-14.webp", alt: "Pop Up 10K pod on its battery base, Blueberry, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-17": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-17.webp", alt: "Pop Up 10K pod on its battery base, Jele Lychee, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
    "Pod-154-18": { kind: "official-photo", role: "detail", src: "/assets/products/pod-154/variant-pod-154-18.webp", alt: "Pop Up 10K pod on its battery base, Jelly Bear, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's Pop Up 10K poster", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
  },
  // Image-fix round 2026-09-30: nexBar CLEAR 18K — every flavour is the same clear device; our passed front card is the
  // template and each maker flavour poster (https://pod789.com/product/nexbar-18k-2/) gives the e-liquid colour and the printed flavour label.
  "Pod-180": {
    "Pod-180-1": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-grape-ice.webp", alt: "nexBar CLEAR 18K, Grape Ice", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-2": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-grape-lychee.webp", alt: "nexBar CLEAR 18K, Grape Lychee", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-3": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-mint.webp", alt: "nexBar CLEAR 18K, Mint", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-4": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-watermelon-ice.webp", alt: "nexBar CLEAR 18K, Watermelon Ice", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-5": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-mixberry.webp", alt: "nexBar CLEAR 18K, Mixberry", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-7": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-strawberry-watermelon.webp", alt: "nexBar CLEAR 18K, Strawberry Watermelon", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-8": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-strawberry-custard.webp", alt: "nexBar CLEAR 18K, Strawberry Custard", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-11": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-watermelon-bubblegum.webp", alt: "nexBar CLEAR 18K, Watermelon Bubblegum", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-12": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-white-slush.webp", alt: "nexBar CLEAR 18K, White Slush", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "Pod-180-13": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-strawberry-kiwi.webp", alt: "nexBar CLEAR 18K, Strawberry Kiwi", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    // The maker contradicts itself: its 15-flavour list (owner poster, both shops) says "Blueberry", its own Blueberry
    // poster shows the device printed "BLUEBERRY ICE". The name follows the list, the photo shows the real print.
    "pod-180-verified-blueberry": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-blueberry.webp", alt: "nexBar CLEAR 18K, Blueberry (the device prints BLUEBERRY ICE; the maker's 15-flavour list says Blueberry)", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "pod-180-verified-lychee": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-lychee.webp", alt: "nexBar CLEAR 18K, Lychee", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "pod-180-verified-honeydew-melon": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-honeydew-melon.webp", alt: "nexBar CLEAR 18K, Honeydew Melon", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "pod-180-verified-strawberry-banana": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-strawberry-banana.webp", alt: "nexBar CLEAR 18K, Strawberry Banana", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
    "pod-180-verified-peach-strawberry": { kind: "official-photo", role: "detail", src: "/assets/products/nexbar-clear-18k/variant-peach-strawberry.webp", alt: "nexBar CLEAR 18K, Peach Strawberry", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the maker's flavour poster", sourceUrl: "https://pod789.com/product/nexbar-18k-2/" },
  },
  // Image-fix round 2026-09-29 (owner rulings, docs/IMAGE_SPEC.md §0 item 7): every ESKO BAR SWITCH pod is the same
  // black pod — only the printed flavour differs — so ONE Higgsfield master of the maker's own pod photo was made and each
  // flavour's name (and Extra Menthol's 5% strength line) re-typeset exactly as on the maker's pod (no AI redraw).
  // Sources per file in scripts/process-images.map.json `aiRender`.
  "Pod-159": {
    "pod-159-verified-apple-aloe": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-apple-aloe.webp", alt: "ESKO BAR SWITCH prefilled pod, Apple Aloe", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-blueberry-jam": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-blueberry-jam.webp", alt: "ESKO BAR SWITCH prefilled pod, Blueberry Jam", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-blueberry": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-blueberry.webp", alt: "ESKO BAR SWITCH prefilled pod, Blueberry", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-chocolate-mint": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-chocolate-mint.webp", alt: "ESKO BAR SWITCH prefilled pod, Chocolate Mint", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-coconut": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-coconut.webp", alt: "ESKO BAR SWITCH prefilled pod, Coconut", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "Pod-159-4": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-cola.webp", alt: "ESKO BAR SWITCH prefilled pod, Cola", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "Pod-159-2": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-cool-mint.webp", alt: "ESKO BAR SWITCH prefilled pod, Cool Mint", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-extra-menthol": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-extra-menthol.webp", alt: "ESKO BAR SWITCH prefilled pod, Extra Menthol", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-grape": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-grape.webp", alt: "ESKO BAR SWITCH prefilled pod, Grape", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-honeydew": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-honeydew.webp", alt: "ESKO BAR SWITCH prefilled pod, Honeydew", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-lychee": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-lychee.webp", alt: "ESKO BAR SWITCH prefilled pod, Lychee", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-mango": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-mango.webp", alt: "ESKO BAR SWITCH prefilled pod, Mango", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-mix-berry": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-mix-berry.webp", alt: "ESKO BAR SWITCH prefilled pod, Mix Berry", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-pineapple": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-pineapple.webp", alt: "ESKO BAR SWITCH prefilled pod, Pineapple", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-pink-guava": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-pink-guava.webp", alt: "ESKO BAR SWITCH prefilled pod, Pink Guava", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-strawberry-banana": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-strawberry-banana.webp", alt: "ESKO BAR SWITCH prefilled pod, Strawberry Banana", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-strawberry": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-strawberry.webp", alt: "ESKO BAR SWITCH prefilled pod, Strawberry", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-watermelon-ice": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-watermelon-ice.webp", alt: "ESKO BAR SWITCH prefilled pod, Watermelon Ice", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-watermelon-lime": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-watermelon-lime.webp", alt: "ESKO BAR SWITCH prefilled pod, Watermelon Lime", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    "pod-159-verified-yogurt": { kind: "official-photo", role: "detail", src: "/assets/products/pod-159/variant-yogurt.webp", alt: "ESKO BAR SWITCH prefilled pod, Yogurt", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from ESKO BAR's own pod photo", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
  },
  "Coil-1": {
    "Coil-1-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variant-coil-1-1.webp", alt: "VOOPOO PnP-TW15 coil 0.15Ω with its box, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product images", sourceUrl: "https://shop.voopoo.com/products/pnp-coils" },
    "Coil-1-14": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variant-coil-1-14.webp", alt: "VOOPOO PnP-DW60 coil 0.6Ω with its box, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product images", sourceUrl: "https://shop.voopoo.com/products/pnp-coils" },
    "Coil-1-11": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variant-coil-1-11.webp", alt: "VOOPOO PnP-TR1 coil 1.2Ω with its box, studio photo (every source shows one o-ring colour for TR1; the white / blue rubber options share this photo)", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product images", sourceUrl: "https://shop.voopoo.com/products/pnp-coils" },
    "Coil-1-12": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variant-coil-1-12.webp", alt: "VOOPOO PnP-TR1 coil 1.2Ω with its box, studio photo (every source shows one o-ring colour for TR1; the white / blue rubber options share this photo)", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product images", sourceUrl: "https://shop.voopoo.com/products/pnp-coils" },
  },
  "Coil-72": {
    "Coil-72-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variant-coil-72-1.webp", alt: "VOOPOO VMATE Cartridge V2 0.7Ω side-fill pod, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's and Vapesourcing's product photos", sourceUrl: "https://www.vapormo.com/products/voopoo-vmate-v2-pod-cartridge-for-vmate-vmate-e-kit-2pcs-pack" },
    "Coil-72-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variant-coil-72-2.webp", alt: "VOOPOO VMATE Cartridge V2 1.2Ω side-fill pod, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's and Vapesourcing's product photos", sourceUrl: "https://www.vapormo.com/products/voopoo-vmate-v2-pod-cartridge-for-vmate-vmate-e-kit-2pcs-pack" },
    "Coil-72-3": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variant-coil-72-3.webp", alt: "VOOPOO VMATE Top Fill Cartridge pod, studio photo (the 0.4Ω and 0.7Ω pods look the same; the resistance is printed on the box only)", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's and Vapesourcing's product photos", sourceUrl: "https://www.vapormo.com/products/voopoo-vmate-v2-pod-cartridge-for-vmate-vmate-e-kit-2pcs-pack" },
    "Coil-72-4": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variant-coil-72-4.webp", alt: "VOOPOO VMATE Top Fill Cartridge pod, studio photo (the 0.4Ω and 0.7Ω pods look the same; the resistance is printed on the box only)", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's and Vapesourcing's product photos", sourceUrl: "https://www.vapormo.com/products/voopoo-vmate-v2-pod-cartridge-for-vmate-vmate-e-kit-2pcs-pack" },
  },
  "Coil-94": {
    "Coil-94-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variant-coil-94-1-gpp.webp", alt: "UWELL CALIBURN GPP Integrated Coil Cartridge 0.4Ω, box and 3 pods (red ring), studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's own stock photo of the GPP 3-pack", sourceUrl: "https://www.myuwell.com/g-pod-platform" },
    "Coil-94-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variant-coil-94-2-gpp.webp", alt: "UWELL CALIBURN GPP Integrated Coil Cartridge 0.6Ω, box and 3 pods (orange ring), studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's own stock photo of the GPP 3-pack", sourceUrl: "https://www.myuwell.com/g-pod-platform" },
    "Coil-94-3": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variant-coil-94-3-gpp.webp", alt: "UWELL CALIBURN GPP Integrated Coil Cartridge 0.9Ω, box and 3 pods (yellow ring), studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's own stock photo of the GPP 3-pack", sourceUrl: "https://www.myuwell.com/g-pod-platform" },
    "Coil-94-4": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variant-coil-94-4-gpp.webp", alt: "UWELL CALIBURN GPP Integrated Coil Cartridge 1.2Ω, box and 3 pods (green ring), studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from the shop's own stock photo of the GPP 3-pack", sourceUrl: "https://www.myuwell.com/g-pod-platform" },
  },
  "Coil-70": {
    "Coil-70-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-70/variant-coil-70-2-v2.webp", alt: "dotmod dotCoil 0.7Ω (14-20w) coil box with five brass coils, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Element Vape's product photo", sourceUrl: "https://www.elementvape.com/dotmod-dotcoils" },
  },
  "Coil-89": {
    "Coil-89-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-89/variant-coil-89-1.webp", alt: "RINCOE Jellybox V pod cartridge, Mesh 0.8Ω, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's product photo", sourceUrl: "https://www.vapormo.com/products/rincoe-jellybox-v-pod-cartridge-3ml-3pcs-pack" },
    "Coil-89-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-89/variant-coil-89-2.webp", alt: "RINCOE Jellybox V pod cartridge, Mesh 1.0Ω, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapormo's product photo", sourceUrl: "https://www.vapormo.com/products/rincoe-jellybox-v-pod-cartridge-3ml-3pcs-pack" },
  },
  "Coil-53": {
    "Coil-53-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-53/variant-coil-53-2-v2.webp", alt: "UWELL CALIBURN G 1.0Ω coil box with four coils, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Element Vape's product photos", sourceUrl: "https://www.elementvape.com/uwell-caliburn-g-coils" },
  },
  "Coil-74": {
    "Coil-74-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-74/variant-coil-74-1-v2.webp", alt: "UWELL CALIBURN X 3 mL empty pod cartridge box with two pods, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from a retailer's box photo", sourceUrl: "https://cdn.shoplightspeed.com/shops/608288/files/56151148/1652x1652x2/uwell-caliburn-x-3ml-replacement-pod-box-of-2.jpg" },
  },
  "Coil-38": {
    "Coil-38-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-38/variant-coil-38-2-v2.webp", alt: "VOOPOO TPP-DM2 0.2Ω coil box with three coils, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Giant Vapes' product photos", sourceUrl: "https://giantvapes.com/products/voopoo-tpp-coils" },
    "Coil-38-4": { kind: "official-photo", role: "detail", src: "/assets/products/coil-38/variant-coil-38-4-v2.webp", alt: "VOOPOO TPP-DM4 0.3Ω coil box with three coils, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Giant Vapes' product photos", sourceUrl: "https://giantvapes.com/products/voopoo-tpp-coils" },
  },
  "Coil-87": {
    "Coil-87-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-87/variant-coil-87-1.webp", alt: "VOOPOO TPP Pod, black, 5.5 mL empty pod cartridge, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from 3FVape's product photo", sourceUrl: "https://www.3fvape.com/new-arrivals/48028-authentic-voopoo-tpp-empty-pod-cartridge-for-tpp-tank-atomizer-drag-3-kit-drag-x-plus-kit-black-55ml-2-pcs.html" },
  },
  "Coil-68": {
    "Coil-68-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-68/variant-coil-68-1.webp", alt: "VOOPOO ITO-X pod cartridge, black, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from VOOPOO's own product photo", sourceUrl: "https://img-va.myshopline.com/image/store/1747294110724/Black1000.jpg" },
  },
  "Coil-56": {
    "Coil-56-3": { kind: "official-photo", role: "detail", src: "/assets/products/coil-56/variant-coil-56-3.webp", alt: "VOOPOO PnP X Cartridge MTL, silver, 5 mL, studio photo", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from Vapesourcing's product photo", sourceUrl: "https://image.vapesourcing.com/images/202509/silver-voopoo-pnp-x-tank-empty-mtl.jpg" },
  },
  // IQOSHEET-15 — FULL REBUILD (owner quality review, 2026-09-02). 11 of this parent's 12
  // selectable flavors now have a real, current, exact-name official photo — up from 6, and every
  // one of those original 6 has ALSO been replaced (not just the 5 new additions), because direct
  // re-verification against media.iqos.com found PMI has shipped a redesigned "NEW LOOK SAME
  // TASTE" pack graphic since those 6 were first sourced; the old box-front photos were stale.
  // Confirmed via iqos.com/id's own live flavor grid AND iqos.com/id's official flavor-guide
  // article (https://www.iqos.com/id/en/news/information/find-the-terea-tobacco-stick-flavor-variant-that-suits-for-you.html)
  // that ALL 16 raw Shipnity flavor names correspond to real official TEREA flavors — none were
  // fabricated matches; "Dimension Apricity"/"Dimension Yugen" are one word short of the real
  // official names ("Dimensions Apricity"/"Dimensions Yugen" — plural), a near-exact Shipnity
  // transcription quirk left uncorrected here deliberately: active-catalog-source.ts's own
  // contract is a verbatim transcription of what Shipnity showed, never silently mutated, and a
  // one-word difference does not rise to "misleading" — noted here instead of a code change.
  // Only "IQOSHEET-15-10" (Emerald Edition) has no verified photo: it is confirmed to be a real,
  // officially-announced TEREA flavor, but absent from iqos.com/id's live shop grid as of this
  // research (likely rotated out / limited release) — no substitute image was invented for it.
  // Round p63 batch 6 (16/10): all 21 flavours iqos.com/id sells get their own pack image — the 15 Shipnity children that
  // iqos.com/id still lists + the 6 VERIFIED_ADDITIONAL_VARIANTS below. Every file = the maker's 2000px pack render cropped
  // to the five sticks (scripts/process-images.map.json), so every flavour shows the sticks at the same size; the 11 older
  // 1000px files (with the flavour pills, 700px) were replaced by the same crop. Emerald Edition (IQOSHEET-15-10) is
  // still on no maker page → NEUTRAL_VARIANT_FALLBACK.
  "IQOSHEET-15": {
    "IQOSHEET-15-1": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-1.webp", alt: "IQOS TEREA Black Green, five sticks — official flavor note: Frosty Pear", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BLACK+GREEN+PACK-pmi_G0000693_00_id-1783303624000.png" },
    "IQOSHEET-15-2": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-2.webp", alt: "IQOS TEREA Green, five sticks", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+GREEN+PACK-pmi_G0000699_00_id-1782351563000.png" },
    "IQOSHEET-15-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-3.webp", alt: "IQOS TEREA Blue, five sticks", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BLUE+PACK-pmi_G0000694_00_id-1783303624000.png" },
    "IQOSHEET-15-4": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-4.webp", alt: "IQOS TEREA Sienna, five sticks", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+SIENNA+PACK-pmi_G0000705_00_id-1783303661000.png" },
    "IQOSHEET-15-5": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-5.webp", alt: "IQOS TEREA Purple Wave, five sticks — official flavor note: Blueberry", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+PURPLE+WAVE+PACK-pmi_G0000703_00_id-1783303712071.png" },
    "IQOSHEET-15-6": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-6.webp", alt: "IQOS TEREA Bronze, five sticks", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BRONZE+PACK-pmi_G0000697_00_id-1783303652000.png" },
    "IQOSHEET-15-7": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-7.webp", alt: "IQOS TEREA Bright Wave, five sticks — official flavor note: Pear", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BRIGHT+WAVE+PACK-pmi_G0000696_00_id-1782354880000.png" },
    "IQOSHEET-15-8": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-8.webp", alt: "IQOS TEREA Dimensions Apricity, five sticks — official flavor note: Caramel with Apricot", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+DIMENSIONS+APRICITY+PACK-pmi_G0000768_00_id-1782351565000.png" },
    "IQOSHEET-15-9": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-9.webp", alt: "IQOS TEREA Dimensions Yugen, five sticks — official flavor note: Floral with Pear", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+DIMENSIONS+YUGEN+PACK-pmi_G0000716_00_id-1783303653000.png" },
    "IQOSHEET-15-11": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-11.webp", alt: "IQOS TEREA Golden Edition, five sticks — official flavor note: Plum, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+GOLDEN+EDITION+PACK-pmi_G0001478_00_id-1783303679000.png" },
    "IQOSHEET-15-13": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-13.webp", alt: "IQOS TEREA Berrine Edition, five sticks — official flavor note: Floral with Pear, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BERRINE+EDITION+PACK-pmi_G0001650_00_id-1782351567000.png" },
    "IQOSHEET-15-14": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-14.webp", alt: "IQOS TEREA Mulint Edition, five sticks — official flavor note: Mulberry, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+MULINT+EDITION+PACK-pmi_G0001648_00_id-1783303679000.png" },
    "IQOSHEET-15-15": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-15.webp", alt: "IQOS TEREA Oasis Pearl, five sticks — official flavor note: Passion Fruit with Menthol, capsule filter", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+OASIS+PEARL+PACK-pmi_G0000948_00_id-1782351566000.png" },
    "IQOSHEET-15-16": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-16.webp", alt: "IQOS TEREA Sun Pearl, five sticks — official flavor note: Watermelon with Menthol, capsule filter", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+SUN+PEARL+PACK-pmi_G0000949_00_id-1783303650000.png" },
    "IQOSHEET-15-17": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-17.webp", alt: "IQOS TEREA Black Ruby, five sticks — official flavor note: Red Berry", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BLACK+RUBY+PACK-pmi_G0002278_00_id-1783303712099.png" },
    "iqosheet-15-verified-passion-fruit-pearl": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-passion-fruit-pearl.webp", alt: "IQOS TEREA Passion Fruit Pearl, five sticks — official flavor note: Passion Fruit with Menthol, capsule filter, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+PASSION+FRUIT+PEARL+PACK-pmi_G0003227_00_id-1789638278000.png" },
    "iqosheet-15-verified-strawberry-pearl": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-strawberry-pearl.webp", alt: "IQOS TEREA Strawberry Pearl, five sticks — official flavor note: Strawberry & Basil with Menthol, capsule filter, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+STRAWBERRY+PEARL+PACK-pmi_G0003228_00_id-1789638279000.png" },
    "iqosheet-15-verified-auburn-edition": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-auburn-edition.webp", alt: "IQOS TEREA Auburn Edition, five sticks — official flavor note: Vanilla and Apricot, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+AUBURN+EDITION+PACK-pmi_G0001652_00_id-1783303679000.png" },
    "iqosheet-15-verified-perint-pearl-edition": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-perint-pearl-edition.webp", alt: "IQOS TEREA Perint Pearl Edition, five sticks — official flavor note: Pear with Menthol, capsule filter, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+PERINT+PEARL+EDITION+PACK-pmi_G0002500_00_id-1783303683000.png" },
    "iqosheet-15-verified-bermin-pearl-edition": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-bermin-pearl-edition.webp", alt: "IQOS TEREA Bermin Pearl Edition, five sticks — official flavor note: Blueberry with Menthol, capsule filter, Clove", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+BERMIN+PEARL+EDITION+PACK-pmi_G0002498_00_id-1783303682000.png" },
    "iqosheet-15-verified-riviera-pearl": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variant-iqosheet-15-verified-riviera-pearl.webp", alt: "IQOS TEREA Riviera Pearl, five sticks — official flavor note: Raspberry and Rose with Menthol, capsule filter", transparentBackground: true, sourceName: "IQOS (official brand CDN, media.iqos.com — Indonesia)", sourceUrl: "https://media.iqos.com/is/image/pmintl/product/2000px/TEREA+RIVIERA+PEARL+PACK-pmi_G0002220_00_id-1782705843615.png" },
  },
  "IQOSHEET-16": {
    "IQOSHEET-16-1": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-1-v2.webp", alt: "IQOS ILUMA i PRIME, Midnight Black", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-midnight-black.html" },
    "IQOSHEET-16-2": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-2-v2.webp", alt: "IQOS ILUMA i PRIME, Breeze Blue", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-breeze-blue.html" },
    "IQOSHEET-16-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-3-v2.webp", alt: "IQOS ILUMA i PRIME, Aspen Green", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
    // Round "option photos + IQOS colours" 2026-10-06: the colours IQOS sells that Shipnity does not stock
    // (VERIFIED_ADDITIONAL_VARIANTS below), same angle and framing as the three above
    // (_incoming/option-photos/iqos/make.js). iqos.com has no angled photo of PRIME Electric Purple, only an
    // upright one: our render keeps the shape of the Garnet Red photo and the colour of the Electric Purple one.
    "iqosheet-16-verified-garnet-red": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/garnet-red.webp", alt: "IQOS ILUMA i PRIME, Garnet Red", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-garnet-red.html" },
    "iqosheet-16-verified-electric-purple": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/electric-purple.webp", alt: "IQOS ILUMA i PRIME, Electric Purple", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from IQOS's own Electric Purple photo", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-electric-purple.html" },
  },
  "IQOSHEET-18": {
    "IQOSHEET-18-1": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/IQOSHEET-18-1-v2.webp", alt: "IQOS ILUMA i, Midnight Black", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-midnight-black.html" },
    "IQOSHEET-18-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/IQOSHEET-18-3-v2.webp", alt: "IQOS ILUMA i, Breeze Blue", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
    // Same round: Leaf Green (iqos.com shows it upright only) and Bold Ruby (jp.iqos.com, 416 px upright only) are
    // renders that keep the shape of the Digital Violet photo and the colour of IQOS's own photo of that colour.
    "iqosheet-18-verified-digital-violet": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/digital-violet.webp", alt: "IQOS ILUMA i, Digital Violet", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-digital-violet.html" },
    "iqosheet-18-verified-vivid-terracotta": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/vivid-terracotta.webp", alt: "IQOS ILUMA i, Vivid Terracotta", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-vivid-terracotta.html" },
    "iqosheet-18-verified-electric-purple": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/electric-purple.webp", alt: "IQOS ILUMA i, Electric Purple", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-electric-purple.html" },
    "iqosheet-18-verified-leaf-green": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/leaf-green.webp", alt: "IQOS ILUMA i, Leaf Green", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from IQOS's own Leaf Green photo", sourceUrl: "https://www.iqos.com/my/en/shop/iluma-i-leaf-green-kit.html" },
    "iqosheet-18-verified-bold-ruby": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/bold-ruby.webp", alt: "IQOS ILUMA i, Bold Ruby", transparentBackground: true, sourceName: "OKami24 render (Higgsfield) from IQOS Japan's own Bold Ruby photo", sourceUrl: "https://jp.iqos.com/iqos-iluma-i-bold-ruby" },
  },
  // Round list19 (17/10): ILUMA i ONE — each colour = that colour's own iqos.com/ph kit page og:image (2048 px transparent PNG).
  "IQOSHEET-17": {
    "IQOSHEET-17-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-breeze-blue.webp", alt: "IQOS ILUMA i ONE, Breeze Blue", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-breeze-blue.html" },
    "iqosheet-17-verified-digital-violet": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-digital-violet.webp", alt: "IQOS ILUMA i ONE, Digital Violet", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-digital-violet.html" },
    "iqosheet-17-verified-vivid-terracotta": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-vivid-terracotta.webp", alt: "IQOS ILUMA i ONE, Vivid Terracotta", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-vivid-terracotta.html" },
    "iqosheet-17-verified-midnight-black": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-midnight-black.webp", alt: "IQOS ILUMA i ONE, Midnight Black", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-midnight-black.html" },
    "iqosheet-17-verified-spring-green": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-spring-green.webp", alt: "IQOS ILUMA i ONE, Spring Green", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-spring-green.html" },
    "iqosheet-17-verified-electric-purple": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-17/variant-electric-purple.webp", alt: "IQOS ILUMA i ONE, Electric Purple", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-electric-purple.html" },
  },
  // IQOSHEET-14 (Lambda i8) — owner quality-review pass (2026-09-03) found a cleaner 1000×1000
  // per-color studio source on the same lambdasmoke.com page (see VERIFIED_MEDIA's angle note
  // above), superseding the earlier note here that claimed a usable crop wasn't available.
  // Round list19 (17/10): one LAMBDA store photo per colour (the 6 colours LAMBDA lists).
  "IQOSHEET-14": {
    "IQOSHEET-14-4": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-red.webp", alt: "LAMBDA i8 heat-not-burn device, Red", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    "IQOSHEET-14-6": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-gold.webp", alt: "LAMBDA i8 heat-not-burn device, Gold", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    "iqosheet-14-verified-black": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-black.webp", alt: "LAMBDA i8 heat-not-burn device, Black", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    "iqosheet-14-verified-green": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-green.webp", alt: "LAMBDA i8 heat-not-burn device, Green", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    "iqosheet-14-verified-gray": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-gray.webp", alt: "LAMBDA i8 heat-not-burn device, Gray", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    "iqosheet-14-verified-white": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-14/variant-white.webp", alt: "LAMBDA i8 heat-not-burn device, White", transparentBackground: true, sourceName: "LAMBDA (official brand site, lambdasmoke.com)", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
  },
};

// ===================================================================================
// Neutral variant-fallback media — third delta pass, numbers updated after the 2026-09-02 TEREA
// rebuild. Separate from `VERIFIED_MEDIA` (the product-level card/OG image) on purpose:
// IQOSHEET-15's product-level card is a real 4-flavor composite, genuinely correct as a CATALOG
// THUMBNAIL ("here is a representative set of real TEREA packs") — that framing is only
// misleading in the ONE specific place a customer has already selected a DIFFERENT, unmapped
// flavor on the Product Detail page, where showing named packs reads as "this is what you
// picked." This table exists to break that association: a product listed here gets a truthful,
// flavor-NEUTRAL image shown ONLY when the selected variant has no dedicated photo of its own —
// never touching the product-level card/grid/OG image, which keeps using VERIFIED_MEDIA exactly
// as before for every other purpose. After the rebuild this now applies to exactly ONE selectable
// IQOSHEET-15 flavor (Emerald Edition — see VERIFIED_MEDIA's comment above for why), down from 6.
const NEUTRAL_VARIANT_FALLBACK: Record<string, ProductAsset> = {
  "IQOSHEET-15": {
    kind: "official-photo",
    role: "detail",
    src: "/assets/products/iqosheet-15/variant-fallback.webp",
    alt: "IQOS TEREA tobacco stick construction — a neutral, non-flavor-specific view",
    angle: "Official manufacturer product-anatomy diagram (iqos.com/ph's own \"TEREA-components\" asset, found on the same official TEREA-variants listing page as the per-flavor pack photos). Shows the real physical stick construction with zero flavor name/color visible anywhere — deliberately chosen so it cannot be mistaken for representing any specific one of the 10 flavors that don't have their own verified photo.",
    transparentBackground: true, // background cut 2026-09-05 by scripts/process-images.ts --fix-opaque (flat white/dark bg → alpha); pixels of the product untouched,
    sourceName: "IQOS (official brand CDN)",
    sourceUrl: "https://www.iqos.com/ph/en/iqos-heated-tobacco/terea-variants.html",
  },
};

export function getNeutralVariantFallback(shipnityProductId: string): ProductAsset | undefined {
  return NEUTRAL_VARIANT_FALLBACK[shipnityProductId];
}

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

/**
 * A real, manufacturer-verified option value that is NOT currently in Shipnity's active
 * ("have_stock=true") export — the owner's explicit rule (2026-09-03): "manufacturer catalog
 * truth and operational stock truth are separate. If a manufacturer genuinely produces 15
 * flavors, the storefront may represent all 15. If only 5 are currently in Excel/Shipnity, the
 * other verified flavors remain visible as unavailable, and must not be purchasable." Every entry
 * here MUST cite `sourceUrl` — this is catalog truth, not an invented completion. Rendered with
 * `availability: {status: "unknown", source: "manual"}`, never `"in-stock"` (that status is
 * reserved for a real, current Shipnity signal) and never `"out-of-stock"` (we have no live signal
 * either way, only manufacturer evidence that it's real) — see `AvailabilityStatus`'s own doc
 * comment in `product-master.ts`. `ProductMasterVariantPicker`/`PilotProductDetail` already treat
 * non-"in-stock" availability as non-purchasable (see the out-of-stock branch there), so this
 * cannot become an accidentally-buyable phantom SKU.
 */
export interface VerifiedAdditionalOptionValue {
  code: string;
  label: string;
  sourceUrl: string;
}

export const VERIFIED_ADDITIONAL_VARIANTS: Record<string, VerifiedAdditionalOptionValue[]> = {
  // Round list19 (18/10): kardinal.com/products/quikpro "Flavours" lists 15; Grape Berry is the one the warehouse (Pod-150) does not carry.
  // (The warehouse's "Cola Lemon" = Kardinal's "Lemon Cola"; its "Watermelon" is not on Kardinal's list — kept, it is the warehouse's real child.)
  "Pod-150": [
    { code: "grape-berry", label: "Grape Berry", sourceUrl: "https://www.kardinal.com/products/quikpro" },
  ],
  // Image-fix round 2026-09-30: nexBar CLEAR 18K — the maker's poster lists 15 flavours; these 5 are not in Shipnity.
  "Pod-180": [
    { code: "blueberry", label: "Blueberry", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
    { code: "lychee", label: "Lychee", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
    { code: "honeydew-melon", label: "Honeydew Melon", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
    { code: "strawberry-banana", label: "Strawberry Banana", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
    { code: "peach-strawberry", label: "Peach Strawberry", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
  ],
  // Tier-1 disposable growth mission (2026-09-03). Pod-159's active (have_stock=true) children are
  // only the 2 flavors currently bundled in stock (Cool Mint, Cola) — but eskobarvape.com's own
  // official SWITCH product page (https://eskobarvape.com/product/pod-system/) shows a real,
  // photographed flavor range for this exact device. Adding the others as catalog truth,
  // explicitly non-purchasable (availability "unknown", never "in-stock") until Shipnity actually
  // stocks them — never silently omitted, never fabricated as available.
  // Owner ruling 2026-09-24 (data round, replaces the 2026-09-06 cut of LAUNCH_AUDIT item 6): the
  // list follows the manufacturer page, which names 20 flavors (re-read in a real browser the same
  // day) — 2 active + these 18. Blueberry Jam, Chocolate Mint, Coconut, Extra Menthol and Mango are
  // back with the same non-purchasable status as the other flavors the shop does not stock.
  // All 20 have a per-flavour pod photo since 2026-09-29 (VERIFIED_VARIANT_MEDIA["Pod-159"]).
  "Pod-159": [
    { code: "apple-aloe", label: "Apple Aloe", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "blueberry", label: "Blueberry", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "blueberry-jam", label: "Blueberry Jam", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "chocolate-mint", label: "Chocolate Mint", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "coconut", label: "Coconut", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "extra-menthol", label: "Extra Menthol", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "grape", label: "Grape", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "honeydew", label: "Honeydew", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "lychee", label: "Lychee", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "mango", label: "Mango", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "mix-berry", label: "Mix Berry", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "pineapple", label: "Pineapple", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "pink-guava", label: "Pink Guava", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "strawberry-banana", label: "Strawberry Banana", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "strawberry", label: "Strawberry", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "watermelon-ice", label: "Watermelon Ice", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "watermelon-lime", label: "Watermelon Lime", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
    { code: "yogurt", label: "Yogurt", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
  ],
  // Round "option photos + IQOS colours" 2026-10-06 (owner: every colour IQOS sells for the models the shop has).
  // Standard colours only, read from iqos.com's own shop pages (union of markets); limited editions are not
  // listed. Aspen Green (PRIME, a Shipnity child) is gone from some markets but still sold in others — kept.
  // Round p63 batch 6 (16/10): iqos.com/id sells 21 TEREA flavours; these 6 are not among Shipnity's active children (Auburn
  // Edition = warehouse IQOSHEET-15-12, out of stock). Each URL = that flavour's own iqos.com/id shop page (title checked 16/10).
  "IQOSHEET-15": [
    { code: "passion-fruit-pearl", label: "Passion Fruit Pearl", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-passion-fruit-pearl.html" },
    { code: "strawberry-pearl", label: "Strawberry Pearl", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-strawberry-pearl.html" },
    { code: "auburn-edition", label: "Auburn Edition", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-auburn-edition.html" },
    { code: "perint-pearl-edition", label: "Perint Pearl Edition", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-perint-pearl-edition.html" },
    { code: "bermin-pearl-edition", label: "Bermin Pearl Edition", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-bermin-pearl-edition.html" },
    { code: "riviera-pearl", label: "Riviera Pearl", sourceUrl: "https://www.iqos.com/id/id/shop/iqos-terea-riviera-pearl.html" },
  ],
  "IQOSHEET-16": [
    { code: "garnet-red", label: "Garnet Red", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-garnet-red.html" },
    { code: "electric-purple", label: "Electric Purple", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-electric-purple.html" },
  ],
  "IQOSHEET-18": [
    { code: "digital-violet", label: "Digital Violet", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-digital-violet.html" },
    { code: "vivid-terracotta", label: "Vivid Terracotta", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-vivid-terracotta.html" },
    { code: "electric-purple", label: "Electric Purple", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-electric-purple.html" },
    { code: "leaf-green", label: "Leaf Green", sourceUrl: "https://www.iqos.com/my/en/shop/iluma-i-leaf-green-kit.html" },
    // Japan only (jp.iqos.com, on sale from 2026-09-16).
    { code: "bold-ruby", label: "Bold Ruby", sourceUrl: "https://jp.iqos.com/iqos-iluma-i-bold-ruby" },
  ],
  // Round list19 (17/10): ILUMA i ONE — iqos.com/ph FAQ "Available in 5 colors: Breeze Blue, Digital Violet, Vivid Terracotta,
  // Midnight Black, Spring Green" + its own Electric Purple kit page. Breeze Blue is the Shipnity child (IQOSHEET-17-3).
  // Round list19 (17/10): LAMBDA lists "Color: Black, Gray, Red, Green, Gold, White" on its i8 page; Red and Gold are Shipnity children.
  "IQOSHEET-14": [
    { code: "black", label: "Black", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    { code: "green", label: "Green", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    { code: "gray", label: "Gray", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
    { code: "white", label: "White", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
  ],
  "IQOSHEET-17": [
    { code: "digital-violet", label: "Digital Violet", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-digital-violet.html" },
    { code: "vivid-terracotta", label: "Vivid Terracotta", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-vivid-terracotta.html" },
    { code: "midnight-black", label: "Midnight Black", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-midnight-black.html" },
    { code: "spring-green", label: "Spring Green", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-spring-green.html" },
    { code: "electric-purple", label: "Electric Purple", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-electric-purple.html" },
  ],
};

/**
 * A Shipnity child that is a DIFFERENT real model from the record its parent projects to (round list19, 17/10). It is kept
 * off that record — reported in `excludedChildren`, never shown as one of its options — because one Shipnity parent
 * projects to one record (`projectParent`). Key = Shipnity variant id; value = why.
 */
const OTHER_MODEL_CHILDREN: Record<string, string> = {
  "IQOSHEET-17-1": "Pebble Grey is a colour of the original IQOS ILUMA ONE (SKU G0000592), not of the ILUMA i ONE this record is — its own page is a later item",
};

// Tier-1 disposable growth mission (2026-09-03) — real OKami24-channel review videos, each
// confirmed via YouTube's own oEmbed endpoint (title + `author_url` match one of OKami24's three
// channels) before being added here, not just found in a search result.
export const VERIFIED_REVIEW_VIDEOS: Record<string, { videoId: string; title: string; channelName: string; publishedAt: string }> = {
  // publishedAt = the clip's YouTube upload date (round "clip" 2026-09-27, read from YouTube's own video data).
  "Pod-159": { videoId: "kJd5rnEtg_Y", title: "ESKO BAR 20K และ ESKO BAR SWITCH 20K เล็กเจอใหญ่", channelName: "OKM YARZ", publishedAt: "2026-01-27" },
};

export function buildVariantStructure(
  parentInternalId: string,
  children: ActiveChildRecord[],
  extraVerifiedValues: VerifiedAdditionalOptionValue[] = []
): VariantStructureResult {
  const excludedChildren: ExcludedChild[] = [];
  const variantChildren = children.filter((c) => {
    const otherModel = OTHER_MODEL_CHILDREN[c.shipnityVariantId];
    if (otherModel) {
      excludedChildren.push({ shipnityVariantId: c.shipnityVariantId, rawLabel: c.rawLabel, role: c.childRole, reason: otherModel });
      return false;
    }
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
  // Manufacturer-verified values beyond current Shipnity stock (see
  // `VerifiedAdditionalOptionValue`'s doc comment) — merged onto the SAME axis only, never used to
  // invent a second axis. A code already present from real Shipnity data is never overwritten.
  for (const extra of extraVerifiedValues) {
    if (!valueMap.has(extra.code)) valueMap.set(extra.code, { code: extra.code, label: extra.label });
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

  const realCodes = new Set(variantChildren.map((c) => slugifyValue(c.cleanedValue ?? c.rawLabel)));
  for (const extra of extraVerifiedValues) {
    if (realCodes.has(extra.code)) continue; // a real Shipnity child already covers this value
    variants.push({
      id: `${parentInternalId}-verified-${extra.code}`,
      parentInternalId,
      optionSelections: [{ optionCode: axis, valueCode: extra.code }],
      sku: null,
      // No `integrationRef` — this was never a Shipnity child, so there is nothing Shipnity-side
      // to reference. Catalog truth only; see `VerifiedAdditionalOptionValue`'s doc comment.
      availability: { status: "unknown", source: "manual", observedAt: null },
    });
  }

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

/** Attaches a verified per-variant image where one exists in VERIFIED_VARIANT_MEDIA, leaving
 *  every other variant's `image` unset so it falls back to the product-level card asset — see
 *  that table's own header comment. Never mutates a variant that already has no matching entry. */
function attachVariantMedia(shipnityProductId: string, variants: ProductMasterInput["variants"]): ProductMasterInput["variants"] {
  const media = VERIFIED_VARIANT_MEDIA[shipnityProductId];
  if (!media) return variants;
  return variants.map((v) => (media[v.id] ? { ...v, image: media[v.id] } : v));
}

/**
 * Storefront quality-correction pass (2026-09-02) — a customer should not have to infer the
 * manufacturer from the product photo. Several real names (e.g. "Coil TPP", "Coil Caliburn G2")
 * name only the operational Shipnity string, with no brand word anywhere in it, unlike most of
 * this catalog's other names which already do ("Voopoo TPP Pod", "IQOS TEREA").
 *
 * This is a single, reusable naming rule rather than a per-product rename: when a real brand
 * match exists AND the raw Shipnity name doesn't already mention it (case-insensitively — many
 * names already embed the brand word, e.g. "คอยล์ Dotmod Aio V2"), prepend the brand's real,
 * already-committed `Brand.name` (never invented). The raw `name` field (the literal Shipnity
 * operational string) and `internalId`/`slug` are never touched — only the customer-facing
 * `displayName` changes, so H1/cards/metadata/structured-data/search — everything that reads
 * `displayName` from this one place — pick up the fix automatically and stay consistent with each
 * other, and internal SKU identity is untouched.
 *
 * Data round (owner instruction 2026-09-24, batch 3): three raw Shipnity names are not the manufacturer's model name —
 * a Thai operational string ("เครื่อง Esko Bar Switch 20k", which also showed on English/Chinese cards) and two IQOS
 * names whose casing/generation differ from the photos and copy on the same page. The manufacturer's own name wins,
 * here, once — so <title>, Product.name and H1 keep reading the same string, as the HANDOFF note asked ("a data-round
 * fix, not a head hack"). Sources: the product pages the card photos were taken from.
 */
const MANUFACTURER_DISPLAY_NAMES: Record<string, { name: string; sourceUrl: string }> = {
  "Pod-159": { name: "ESKO BAR SWITCH 20K", sourceUrl: "https://eskobarvape.com/product/pod-system/" },
  "Pod-180": { name: "nexBar CLEAR 18K", sourceUrl: "https://ihavevape.net/product/nexbar-clear-18k-puffs/" },
  "IQOSHEET-16": { name: "IQOS ILUMA i PRIME", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
  "IQOSHEET-18": { name: "IQOS ILUMA i", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
  "IQOSHEET-14": { name: "LAMBDA i8", sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html" },
  "IQOSHEET-17": { name: "IQOS ILUMA i ONE", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-breeze-blue.html" },
  "Pod-150": { name: "KS Quikpro 15K Cartridge", sourceUrl: "https://www.kardinal.com/products/quikpro" },
  "KS-QUIKPRO-KIT": { name: "KS Quikpro 15K Kit", sourceUrl: "https://www.kardinal.com/products/quikpro" },
  "Pod-154": { name: "Pop Up 10K Pod", sourceUrl: "https://ihavevape.net/product/pop-up-10000-puffs/" },
};

function deriveDisplayName(rawName: string, brandId: string | null, shipnityId?: string): string {
  const override = shipnityId ? MANUFACTURER_DISPLAY_NAMES[shipnityId] : undefined;
  if (override) return override.name;
  if (!brandId) return rawName;
  const brand = getBrand(brandId);
  if (!brand) return rawName;
  if (rawName.toUpperCase().includes(brand.name.toUpperCase())) return rawName;
  return `${brand.name} ${rawName}`;
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
    ...(match?.brandless ? { brandless: true as const } : {}),
    familyId: match?.familyId ?? null,
    categoryId: match?.categoryId ?? null,
    // ProductMaster's own SystemType is device-only by design (see product-master-schema.ts's own
    // doc comment) — no TAXONOMY_MATCHES entry actually uses "e-liquid" today, this narrowing just
    // keeps the type-level door open for `Product`'s SystemType (now wider, for the Legacy
    // catalog's own e-liquid support) without silently widening ProductMaster's.
    systemType: match?.systemType === "e-liquid" ? null : match?.systemType ?? null,

    name: parent.name,
    displayName: deriveDisplayName(parent.name, match?.brandId ?? null, parent.shipnityProductId), // see deriveDisplayName's own comment
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
    variants: attachVariantMedia(parent.shipnityProductId, variantStructure.variants),

    availability: { status: "in-stock", source: "shipnity", observedAt: CAPTURE_DATE },

    editorialContent: {},
    merchantContent: {},
    merchantTags: [],
    compatibility: [],
    relatedProducts: [],
    faqRefs: [],
    seo: {},
    isFlagship: false,
    reviewVideo: VERIFIED_REVIEW_VIDEOS[parent.shipnityProductId],
  };

  // Mirrors validateProductMasterRegistry's actual publication-readiness check (Phase 2.6
  // revision) — familyId/systemType/attributes are deliberately excluded, see that function's
  // comment. Kept in sync manually since this is a UI/reporting convenience flag, not itself a
  // validation gate (the registry validator is the single source of truth for readiness).
  const isDraft =
    (product.brandId === null && product.brandless !== true) ||
    product.categoryId === null ||
    product.tagline === null ||
    product.shortDescription === null;

  return { status: "candidate", shipnityProductId: parent.shipnityProductId, product, isDraft, excludedChildren: variantStructure.excludedChildren };
}

function projectParent(parent: ActiveParentRecord): ProjectionResult {
  const match = TAXONOMY_MATCHES[parent.shipnityProductId];
  const variantStructure = buildVariantStructure(
    parent.shipnityProductId.toLowerCase(),
    parent.children,
    VERIFIED_ADDITIONAL_VARIANTS[parent.shipnityProductId] ?? []
  );

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
