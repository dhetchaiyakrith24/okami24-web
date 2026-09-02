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
  "Coil-72": { brandId: "voopoo", familyId: "vmate", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Vmate" (VOOPOO VMATE family) + Shipnity "Coil-" prefix' },
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
  "Coil-89": { brandId: "rincoe", categoryId: "coils-accessories", systemType: "coil", evidence: 'name "Coil Jellybox V" + children "0.8Ω"/"1.0Ω" match RINCOE\'s official Jellybox V replacement pod/coil options (0.8Ω and 1.0Ω mesh) exactly' },

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

  // Full-catalog mission — Nexbar resolved to WOTOFO (an established international hardware
  // brand with a real official site), settling the earlier "collision risk with Wotofo's own
  // nexBAR" deferral in its favor rather than against it: wotofo.com/collections/nexbar-series
  // and wotofo.com/products/wotofo-nexbar-18k directly confirm a real "nexBAR 18K" product
  // (750mAh, USB-C, up to 18,000 puffs, dual nexMESH coils 1.2Ω, 20 flavor options) — an exact
  // puff-count and price-tier match to this Shipnity parent. The Shipnity name's "Clear" qualifier
  // could not be independently confirmed against a distinctly-named official edition (Wotofo's own
  // site shows "Standard"/"Vivid Edition" naming, no edition explicitly called "Clear"/
  // "Transparent") — carried forward as-is from the source, not asserted as verified.
  // Catalog-intelligence mission (2026-09-02) — attempted to close the media gap this session.
  // Downloaded and visually inspected wotofo.com's own two official nexBAR 18K product renders
  // (Shopify CDN, cdn.shopify.com/.../wotofo-nexbar-18k-{1,26}.jpg — both tier-1, first-party).
  // REJECTED both: the retail-box shot legibly prints "DOUBLE APPLE" and the device-only shot
  // prints "LEMON LIME" directly on the unit — neither flavor is in this record's active
  // 10-flavor Thai lineup, and Wotofo's variant data has no image_id per flavor to select from
  // (every official shot is a fixed flavor, not swappable). Using either would show a customer a
  // real Wotofo product printed with a flavor OKami24 doesn't stock. STILL UNPUBLISHED (media) —
  // no clean alternative found; a retailer's per-flavor set exists but is a heavy marketing
  // composite with no watermark-free crop (see also the Thai-flavor-lineup mismatch flag below).
  // ALSO FLAGGED: this record's own 10-flavor lineup matches NO single official or retailer
  // source found (Wotofo's own list, and two different Thai retailers' stock, are each a
  // different 10) — the flavors here are plausibly a genuine Thai-market lineup but that has not
  // been independently corroborated; publish, if ever, as retailer-supplied and uncorroborated.
  "Pod-180": { brandId: "wotofo", categoryId: "disposables", systemType: "disposable", evidence: 'name "Nexbar Clear 18k" — wotofo.com\'s own official nexBAR 18K product/collection pages confirm a real, matching product (18,000 puffs, 750mAh, dual nexMESH coils, 20 flavors); the "Clear" edition-name qualifier itself is carried from the Shipnity label, not independently confirmed against an official edition name' },

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
  "IQOSHEET-15": { brandId: "iqos", categoryId: "heated-tobacco-consumables", evidence: 'name "IQOS TEREA" states the brand and product line explicitly; official iqos.com regional shop pages confirm TEREA as PMI\'s real heated-tobacco stick line, with at least 5 of this parent\'s 16 active flavor children (Green, Blue, Sienna, Bronze, Oasis Pearl) exact-matching real official flavor names' },
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
  // "Pod-149" copy removed alongside its brand-claim withdrawal above — see TAXONOMY_MATCHES's
  // comment. Copy that names "แบรนด์ SKE" would misattribute the product; MINIMUM_COPY never
  // fabricates a brand name that isn't independently supportable.
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
  // Heated-tobacco wave — factual, identity-level copy only, no health/reduced-harm claims
  // (heat-not-burn is not risk-free; this project makes no such claim anywhere).
  "IQOSHEET-14": {
    tagline: "อุปกรณ์ให้ความร้อนยาสูบ LAMBDA i8 (ไม่ใช่ผลิตภัณฑ์ IQOS/PMI)",
    shortDescription: "อุปกรณ์ heat-not-burn รุ่น i8 จากแบรนด์ LAMBDA ใช้ร่วมกับแท่งยาสูบ TEREA/SENTIA Smartcore",
  },
  "IQOSHEET-15": {
    tagline: "แท่งยาสูบให้ความร้อน IQOS TEREA",
    shortDescription: "แท่งยาสูบสำหรับอุปกรณ์ IQOS ILUMA จากแบรนด์ IQOS (Philip Morris International) ให้ความร้อนโดยไม่เผาไหม้",
  },
  "IQOSHEET-16": {
    tagline: "อุปกรณ์ให้ความร้อนยาสูบ IQOS ILUMA i PRIME",
    shortDescription: "อุปกรณ์รุ่น ILUMA i PRIME จากแบรนด์ IQOS ใช้ร่วมกับแท่งยาสูบ TEREA เท่านั้น",
  },
  "IQOSHEET-18": {
    tagline: "อุปกรณ์ให้ความร้อนยาสูบ IQOS ILUMA i",
    shortDescription: "อุปกรณ์รุ่น ILUMA i (รุ่นกลาง) จากแบรนด์ IQOS ใช้ร่วมกับแท่งยาสูบ TEREA เท่านั้น",
  },
  "IQOSHEET-17": {
    tagline: "อุปกรณ์ให้ความร้อนยาสูบ IQOS ILUMA ONE",
    shortDescription: "อุปกรณ์รุ่น ILUMA ONE จากแบรนด์ IQOS — ข้อมูล Shipnity ปัจจุบันมี 2 รุ่นย่อยปนกัน (ตัวถังเดิมสีเทา และรุ่น i สีฟ้า) ยังไม่แยกชัดเจน",
  },
  "Pod-180": {
    tagline: "พอตใช้แล้วทิ้ง Nexbar 18K จากแบรนด์ WOTOFO",
    shortDescription: "พอตใช้แล้วทิ้งรุ่น nexBAR 18K จากแบรนด์ WOTOFO",
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
// - Pod-149 (SKE Crystal B20K), Disposable-34 (Insta Bar PX 15000), coil-62 (Feelin C1 "Matcha
//   Clear" cartridge): quick official-site checks found real product lines at skevape.com/
//   instabar.net/nevoks.com but no exact model/puff-count/color match in the results returned
//   (SKE's real lineup tops out at "15K" not "20K"; Instabar's real models are "DC"/"WT" not "PX";
//   Nevoks' Feelin C1 product page did not expose a "Matcha" variant or per-color image mapping).
//   Not pursued further this session — each would need a dedicated, deeper site crawl to resolve
//   the naming gap, which is disproportionate effort for one item in a long low-leverage queue.
// ===================================================================================

const VERIFIED_MEDIA: Record<string, ProductAsset[]> = {
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
      src: "/assets/products/coil-70/card.webp",
      alt: "dotmod dotCoil 0.7Ω replacement coils, 5-pack retail box with five blister-packed brass coil heads",
      angle: "Front, plain white-background product photography, whitespace-trimmed only (no recolor, relabel or composite). VARIANT PROOF: the retail box in frame is legibly printed \"0.7Ω (14-20w)\" alongside \"Copyright 2021 DOTMOD\", \"Made In China\", barcode 850010 57398 and www.dotmod.com — an exact match to this record's single active child (0.7Ω). PHYSICAL-TYPE PROOF: five individually blister-packed brass coil heads with no tank or pod body are visible, confirming this is a genuine BARE COIL (unlike Coil-21/55/56/68/74/83/87/94, where the same naming pattern resolved to pods). Sourced from Element Vape's own variant-to-image mapping for the 0.7Ω option (SKU DM036-07), so the resistance-to-photo pairing is the retailer's, not this project's inference. NOTE ON TIER: dotmod.com's current dotCoils lineup is 0.15Ω/0.3Ω/0.6Ω only — 0.7Ω is legacy stock with no tier-1 image still published, which is why a tier-2 source is used here rather than preferred.",
      transparentBackground: false,
      sourceName: "Element Vape (US vape retailer; product photography — NOT dotmod's own site)",
      sourceUrl: "https://www.elementvape.com/dotmod-dotaio-v2-dotcoils",
    },
  ],
  "Coil-83": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-83/card.webp",
      alt: "VOOPOO ARGUS POD Empty Cartridge, 2.0mL, 2-piece retail box with two empty transparent pods",
      angle: "Front, plain white-background product photography, whitespace-trimmed only. IDENTITY + PACK-COUNT PROOF: the VOOPOO-branded box in frame reads \"ARGUS POD\" / \"Empty Cartridge\" / \"2pcs\" / \"2.0mL\" — the \"2pcs\" matches this record's only active child (\"1 กล่อง2 หัว\", 1 box of 2 heads) exactly. PHYSICAL-TYPE PROOF: the two pods shown are transparent with a visibly EMPTY coil socket, confirming an empty refillable pod sold without a coil (VOOPOO ITO M-series coils are bought separately) rather than a bare coil head. Deliberate care point: Coil-21 (Argus Pod Cartridge, integrated coil, 3pcs) is a near-identical-looking pod in near-identical packaging — the two card images must never be swapped; this one is identifiable by \"Empty Cartridge / 2pcs\", Coil-21's by a resistance badge and \"3PCS\".",
      transparentBackground: false,
      sourceName: "HealthCabin (vape wholesaler; product photography — NOT VOOPOO's own site)",
      sourceUrl: "https://www.healthcabin.net/voopoo-argus-pod-argus-p1-argus-z-argus-g-argus-a-empty-cartridge-p/28679.html",
    },
  ],
  "Coil-87": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-87/card.webp",
      alt: "VOOPOO TPP Pod in Black, 5.5mL, retail box with two pods, one showing the ADAPT TPP COILS base engraving",
      angle: "Front, plain white-background product photography, whitespace-trimmed only. VARIANT PROOF (this is what resolved the record's long-standing Black-vs-Gunmetal question): the VOOPOO box in frame carries a printed rounded \"BLACK\" badge under the pod render, above \"TPP POD\" / \"COMPATIBLE WITH ALL TPP COIL\" — manufacturer packaging artwork, so the colour name is VOOPOO's own. Independently corroborated by the retailer's variant-to-SKU mapping (Black = VPO097-BLA, Gunmetal = VPO097-GUN). TWO DISCLOSED IMPERFECTIONS, both deliberate: (1) this is the US-market box, so a printed FDA nicotine-warning panel occupies part of the frame — it is genuine retail packaging, not a decorative marketing overlay, and a pods-only crop that excluded it was rejected for falling under product-image.ts's 400px card floor; (2) the box shows a 2-pack while this record's child is \"Black / 1 หัว\" (one head) — the Thai retailer splits the box, so product copy must never claim a 2-pack.",
      transparentBackground: false,
      sourceName: "Element Vape (US vape retailer; product photography — NOT VOOPOO's own site)",
      sourceUrl: "https://www.elementvape.com/voopoo-tpp-pods",
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
      src: "/assets/products/coil-68/card.webp",
      alt: "VOOPOO ITO-X Pod Cartridge, Black, isolated product shot",
      angle: "Front, isolated (alpha background from source). The pod body itself is printed \"ITO-X\", and the retailer's own variant-specific product photo/title/alt text are all labeled \"Black\" — matching this record's single active child exactly.",
      transparentBackground: true,
      sourceName: "Black Note (US vape retailer; product photography)",
      sourceUrl: "https://www.blacknote.com/e-juice/voopoo-ito-x-coils/",
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
      src: "/assets/products/coil-1/card.webp",
      alt: "VOOPOO PnP-TW15 (0.15Ω), PnP-DW60 (0.6Ω), and PnP-TR1 (1.2Ω) replacement coil retail packaging, side by side",
      angle: "Plain composite (white canvas, no recoloring/relabeling) of 3 real, individually-verified retailer box photos, each printed with its own exact resistance/product code (\"PNP-TW I5 0.15Ω\", \"PNP-DW60 0.6Ω\", \"PnP-TR1 1.2Ω\") — covers all 4 of this record's active children. VARIANT-MODELING NOTE (audited explicitly, not hand-waved): Coil-1-11 (\"1.2Ω ยางขาว\"/white rubber) and Coil-1-12 (\"1.2Ω ยางฟ้า\"/blue rubber) render in the storefront as two separately-selectable buttons because classify.ts's generic keyword-based axis inference has no logic to treat a rubber-grommet color as a sub-attribute of a shared resistance value — it keeps the full raw string as each variant's label. Real market research found ZERO retailers selling or photographing \"white rubber\" vs \"blue rubber\" PnP-TR1 1.2Ω as separate SKUs; every source treats PnP-TR1 1.2Ω as one undifferentiated product. This strongly suggests the two Shipnity child records reflect an internal warehouse/batch-tracking distinction, not a real customer-facing choice — but this is a genuine, disclosed LIMITATION of the shared classification pipeline (out of scope to special-case for one product), not a media-sourcing shortcut. The single real 1.2Ω photo used here correctly matches BOTH entries on every fact that market evidence can confirm (brand, model, resistance, box art) — the only unconfirmed element is a cosmetic rubber-ring color that no market source treats as meaningfully distinct. Same one-static-card-image-per-product rationale as the existing Coil-38 composite for the resistance axis itself.",
      transparentBackground: false,
      sourceName: "Black Note and Turn It Up Vape (US vape retailers; VOOPOO product photography)",
      sourceUrl: "https://www.blacknote.com/e-juice/voopoo-pnp-coils/",
    },
  ],
  "Coil-72": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-72/card.webp",
      alt: "VOOPOO VMATE Infinity Edition Cartridge retail packaging — 0.7Ω, 1.2Ω, 0.4Ω Top Fill, and 0.7Ω Top Fill, one box per variant",
      angle: "Plain 2x2 composite of 4 real, individually-verified retailer box photos, one per active child, each box printed with its own exact capacity/resistance (\"3mL | 0.7Ω\", \"3mL | 1.2Ω\", \"3mL | 0.4Ω\" Top Fill, \"3mL | 0.7Ω\" Top Fill) — an exact match to all 4 active variants. Each source photo carried a retailer watermark baked into the bottom-right corner of the frame; cropped locally to the watermark-free upper portion of the same real photo (box + variant label, nothing altered/added) rather than used as-is or discarded.",
      transparentBackground: false,
      sourceName: "Huff and Puffers (US vape retailer; VOOPOO product photography, watermark cropped)",
      sourceUrl: "https://www.huffandpuffers.com/products/voopoo-vmate-infinity-edition-cartridge",
    },
  ],
  "Coil-94": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-94/card.webp",
      alt: "UWELL CALIBURN G3 Refillable Pod retail packaging — 0.4Ω, 0.6Ω, 0.9Ω, and 1.2Ω meshed, one box per resistance",
      angle: "Plain 2x2 composite of 4 real, individually-verified retailer photos, one per active resistance, each box printed with its own exact resistance (\"0.4Ω\", \"0.6Ω\", \"0.9Ω\", \"1.2Ω\", all \"Meshed\") — resolves the earlier blocker (a single shared \"0.4Ω\"-box photo previously found at a different retailer, which would have misrepresented the other 3 active variants).",
      transparentBackground: false,
      sourceName: "Black Note (US vape retailer; UWELL product photography)",
      sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-g3-pods/",
    },
  ],
  "Pod-159": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/pod-159/card.webp",
      alt: "ESKO BAR SWITCH reusable pod device, Purple and Yellow colorways, isolated product shot",
      angle: "Front, isolated (alpha background from source), official manufacturer render. Note: this Shipnity parent's active children (\"Cool Mint\", \"Cola\") are the brand's own bundled-pod-flavor labels for this device kit, confirmed directly against eskobarvape.com's own product page — not device colorways (the device itself ships in Purple/Yellow/Black) — so this image honestly shows the real reusable hardware being sold rather than implying the flavor names are device colors.",
      transparentBackground: true,
      sourceName: "ESKO BAR (official brand site)",
      sourceUrl: "https://eskobarvape.com/product/pod-system/",
    },
  ],
  "coil-54": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/coil-54/card.webp",
      alt: "NEVOKS Feelin Mini refillable pod cartridge, box of 2, isolated product shot",
      angle: "Plain crop of a real retailer product photo showing the retail box plus exactly 2 cartridges — matching this record's single active child (\"ขายยกกล่อง 1 กล่อง 2 หัว\", sold as 1 box of 2) exactly.",
      transparentBackground: false,
      sourceName: "Aromes et Liquides (French authorized NEVOKS retailer)",
      sourceUrl: "https://www.aromes-et-liquides.fr/nevoks-feelin-mini-cartouche-x2",
    },
  ],
  // Heated-tobacco wave — official first-party media throughout (found via each specific
  // color/flavor product page's own `og:image` meta tag, which points at the brand's real CDN
  // asset for that exact page, not a generic/shared image).
  "IQOSHEET-14": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-14/card.webp",
      alt: "LAMBDA i8 heat-not-burn device, full 6-color official lineup (Gold, Green, Black, Gray, Red, White)",
      angle: "Official manufacturer lineup render (lambdasmoke.com's own product page), trimmed only — not a single-color crop, because this parent's 2 active children (Red, Gold) are both real official colors and a lineup shot honestly shows both without guessing which single unit to isolate.",
      transparentBackground: false,
      sourceName: "LAMBDA (official brand site, lambdasmoke.com)",
      sourceUrl: "https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html",
    },
  ],
  "IQOSHEET-15": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-15/card.webp",
      alt: "IQOS TEREA tobacco sticks, 5 official flavor packs (Green, Blue, Sienna, Bronze, Oasis Pearl)",
      angle: "Composite of 5 real official pack photos (media.iqos.com's own per-flavor CDN assets), each cropped to the branded face only (removing the region-specific graphic health-warning panel — packaging text, not product identity). Represents 5 of this parent's 16 active flavor children with an exact official-name match; the other 11 were not individually re-verified this session, so this is disclosed as a partial, not complete, flavor range.",
      transparentBackground: false,
      sourceName: "IQOS (official brand CDN, media.iqos.com)",
      sourceUrl: "https://www.iqos.com/ph/en/shop.html",
    },
  ],
  "IQOSHEET-16": [
    {
      kind: "official-photo",
      role: "card",
      src: "/assets/products/iqosheet-16/card.webp",
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
      src: "/assets/products/iqosheet-18/card.webp",
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
      src: "/assets/products/iqosheet-17/card.webp",
      alt: "IQOS ILUMA ONE, Pebble Grey, isolated official product render (original, non-\"i\" generation)",
      angle: "Official manufacturer render, sourced directly from iqos.com/ph's own dedicated \"ILUMA ONE Pebble Grey\" product page. IMPORTANT: this photo shows ONLY the Pebble Grey (original ILUMA ONE, SKU G0000592) child accurately — the other active child, Breeze Blue, is a DIFFERENT real device (the newer ILUMA i ONE, SKU G0002077) with a visibly different chassis and different real specs (touch screen, Autostart, Pause Mode), not shown here. A second official Breeze Blue/ILUMA i ONE render was independently sourced and verified in the catalog-intelligence mission (2026-09-02) but is deliberately NOT added as a local asset here — this record is not close to publishable (see the owner-decision note in publication-approvals.ts), and adding product-specific asset files for an identity that may end up split across two different slugs would be premature; its citation is kept here for whoever resolves this: https://www.iqos.com/ph/en/shop/iluma-i-one-breeze-blue-kit.html . Present for DEV-review/documentation completeness only — see publication-approvals.ts for why this record is NOT published despite having real media, real price, and real brand/category evidence.",
      transparentBackground: true,
      sourceName: "IQOS (official brand site)",
      sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-one-kit-pebble-grey.html",
    },
  ],
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
  // ---------------------------------------------------------------------------------
  // Catalog-intelligence mission (2026-09-02). Discrete, individually-sourced manufacturer
  // facts only — no marketing paragraphs, and anything a source did not actually state is
  // simply absent rather than guessed.
  // ---------------------------------------------------------------------------------
  "Coil-70": {
    specifications: [
      { key: "resistance", label: "ความต้านทาน", value: "0.7Ω", sourceStatus: "verified" },
      { key: "wattage", label: "กำลังไฟที่แนะนำ", value: "14-20W", sourceStatus: "verified" },
      { key: "pack-size", label: "จำนวนต่อกล่อง", value: "5 หัว (บรรจุแยกซองละหัว)", sourceStatus: "verified" },
      { key: "construction", label: "โครงสร้าง", value: "ตัวเรือนทองเหลือง คอยล์เมชเดี่ยว", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "dotAIO V2, dotAIO V2 Lite, dotStick Revo, dotPod Max, dotTank 25mm", sourceStatus: "verified" },
    ],
    // Wattage/resistance are read directly off the retail box in this record's own card photo;
    // pack size, brass construction and the device list are from dotmod's own dotCoils page.
    sourceUrls: ["https://dotmod.com/products/dotcoils", "https://www.elementvape.com/dotmod-dotaio-v2-dotcoils"],
  },
  "Coil-83": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2.0 ml", sourceStatus: "verified" },
      { key: "pack-size", label: "จำนวนต่อกล่อง", value: "2 หัว", sourceStatus: "verified" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "ไม่มี (เป็นหัวเปล่า ต้องซื้อคอยล์ ITO แยก)", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Argus Pod, Argus P1, Argus Z, Argus G, Argus A", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.healthcabin.net/voopoo-argus-pod-argus-p1-argus-z-argus-g-argus-a-empty-cartridge-p/28679.html"],
  },
  "Coil-87": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "5.5 ml", sourceStatus: "verified" },
      { key: "coil-included", label: "คอยล์ในกล่อง", value: "ไม่มี (เป็นหัวเปล่า ใช้ร่วมกับคอยล์ TPP)", sourceStatus: "verified" },
      { key: "coil-fit", label: "การติดตั้งคอยล์", value: "แบบกดล็อก (press-fit) รองรับคอยล์ตระกูล TPP", sourceStatus: "verified" },
      { key: "connection", label: "การเชื่อมต่อ", value: "แม่เหล็ก", sourceStatus: "verified" },
    ],
    // Capacity is also legible on the retail box in this record's own card photo ("5.5ml").
    sourceUrls: ["https://www.elementvape.com/voopoo-tpp-pods"],
  },
  "Pod-169": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "2.5 ml", sourceStatus: "verified" },
      { key: "prefilled", label: "ชนิดหัวพอต", value: "หัวพอตแบบเติมน้ำยามาแล้ว พร้อมคอยล์ในตัว (ระบบปิด เติมน้ำยาเองไม่ได้)", sourceStatus: "verified" },
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
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "VINCI Pod, VINCI X Pod, DRAG Baby Trio", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.alivape.com/products/voopoo-vinci-replacement-pnp-coil", "https://www.blacknote.com/e-juice/voopoo-pnp-coils/"],
  },
  "Coil-38": {
    specifications: [
      { key: "wattage-02", label: "กำลังไฟที่แนะนำ (TPP-DM2, 0.2Ω)", value: "40-60W", sourceStatus: "verified" },
      { key: "wattage-03", label: "กำลังไฟที่แนะนำ (TPP-DM4, 0.3Ω)", value: "32-40W", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "TPP Pod, DRAG 3 Kit, DRAG X Plus Kit", sourceStatus: "verified" },
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
      { key: "resistance", label: "ความต้านทาน", value: "1.0Ω", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Caliburn G, Caliburn G2", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.myuwell.com/caliburn/caliburn-g2", "https://giantvapes.com/products/uwell-caliburn-g-replacement-coils"],
  },
  "Coil-89": {
    specifications: [
      { key: "capacity", label: "ความจุ", value: "3.0mL, เติมด้านข้าง", sourceStatus: "verified" },
      { key: "wattage", label: "กำลังไฟที่แนะนำ", value: "10-16W (ปรับอัตโนมัติตามความต้านทาน)", sourceStatus: "verified" },
      { key: "compatible-devices", label: "ใช้ได้กับ", value: "Jellybox V1, V2, V3", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://thevapetown.com/products/rincoe-jellybox-v-pod-cartridge-0-8-ohm-1pc", "https://www.alivape.com/products/rincoe-jellybox-v-replacement-pods"],
  },
  "Coil-94": {
    specifications: [
      { key: "resistance-range", label: "ความต้านทาน", value: "0.4Ω / 0.6Ω / 0.9Ω / 1.2Ω (Meshed)", sourceStatus: "verified" },
      { key: "capacity", label: "ความจุ", value: "2mL", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://giantvapes.com/products/uwell-caliburn-g3-replacement-pods"],
  },
  "Pod-180": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "750mAh, ชาร์จ USB-C", sourceStatus: "verified" },
      { key: "coil", label: "คอยล์", value: "Dual nexMESH coil 1.2Ω (ในตัว)", sourceStatus: "verified" },
      { key: "capacity", label: "ความจุน้ำยา", value: "~18 mL", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.wotofo.com/products/wotofo-nexbar-18k"],
  },
  "IQOSHEET-14": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "3200mAh", sourceStatus: "verified" },
      { key: "temperature", label: "อุณหภูมิ", value: "ปรับได้ 200-300°C", sourceStatus: "verified" },
      { key: "compatible-sticks", label: "ใช้ได้กับแท่งยาสูบ", value: "TEREA, SENTIA Smartcore Sticks", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.lambdasmoke.com/LAMBDA-i8--Smart-Induction-Heat-Not-Burn-Device-Compatible-With-TEREA-SENTIA-Smartcore-Sticks-p5610276.html"],
  },
  "IQOSHEET-15": {
    specifications: [{ key: "compatible-devices", label: "ใช้ได้กับอุปกรณ์", value: "IQOS ILUMA (ทุกรุ่น)", sourceStatus: "verified" }],
    sourceUrls: ["https://www.iqos.com/ph/en/shop.html"],
  },
  "IQOSHEET-16": {
    specifications: [
      { key: "battery", label: "แบตเตอรี่", value: "2380mAh", sourceStatus: "verified" },
      { key: "charging", label: "การชาร์จ", value: "USB-C, ชาร์จเต็มประมาณ 135 นาที", sourceStatus: "verified" },
      { key: "sessions", label: "จำนวนแท่งต่อการชาร์จ 1 ครั้ง", value: "สูงสุด 20 แท่ง", sourceStatus: "verified" },
      { key: "compatible-sticks", label: "ใช้ได้กับแท่งยาสูบ", value: "TEREA เท่านั้น", sourceStatus: "verified" },
    ],
    sourceUrls: ["https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html"],
  },
  "IQOSHEET-18": {
    specifications: [{ key: "compatible-sticks", label: "ใช้ได้กับแท่งยาสูบ", value: "TEREA เท่านั้น", sourceStatus: "verified" }],
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
  "Coil-1": {
    "Coil-1-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variants/Coil-1-1.webp", alt: "VOOPOO PnP-TW15 coil, 0.15Ω, retail box", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/voopoo-pnp-coils/" },
    "Coil-1-14": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variants/Coil-1-14.webp", alt: "VOOPOO PnP-DW60 coil, 0.6Ω, retail box", transparentBackground: false, sourceName: "Turn It Up Vape (US vape retailer)", sourceUrl: "https://www.turnitupvape.com/product-page/voopoo-pnp-dw60-coils-0-6-ohm-5-per-pack" },
    "Coil-1-11": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variants/Coil-1-11.webp", alt: "VOOPOO PnP-TR1 coil, 1.2Ω, retail box (rubber-grommet color not distinguished by any market source — see identity note)", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/voopoo-pnp-coils/" },
    "Coil-1-12": { kind: "official-photo", role: "detail", src: "/assets/products/coil-1/variants/Coil-1-12.webp", alt: "VOOPOO PnP-TR1 coil, 1.2Ω, retail box (rubber-grommet color not distinguished by any market source — see identity note)", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/voopoo-pnp-coils/" },
  },
  "Coil-72": {
    "Coil-72-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variants/Coil-72-1.webp", alt: "VOOPOO VMATE Cartridge V2, 0.7Ω side-fill, retail box", transparentBackground: false, sourceName: "Huff and Puffers (US vape retailer, watermark cropped)", sourceUrl: "https://www.huffandpuffers.com/products/voopoo-vmate-infinity-edition-cartridge" },
    "Coil-72-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variants/Coil-72-2.webp", alt: "VOOPOO VMATE Cartridge V2, 1.2Ω side-fill, retail box", transparentBackground: false, sourceName: "Huff and Puffers (US vape retailer, watermark cropped)", sourceUrl: "https://www.huffandpuffers.com/products/voopoo-vmate-infinity-edition-cartridge" },
    "Coil-72-3": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variants/Coil-72-3.webp", alt: "VOOPOO VMATE Top Fill Cartridge, 0.4Ω, retail box", transparentBackground: false, sourceName: "Huff and Puffers (US vape retailer, watermark cropped)", sourceUrl: "https://www.huffandpuffers.com/products/voopoo-vmate-infinity-edition-cartridge" },
    "Coil-72-4": { kind: "official-photo", role: "detail", src: "/assets/products/coil-72/variants/Coil-72-4.webp", alt: "VOOPOO VMATE Top Fill Cartridge, 0.7Ω, retail box", transparentBackground: false, sourceName: "Huff and Puffers (US vape retailer, watermark cropped)", sourceUrl: "https://www.huffandpuffers.com/products/voopoo-vmate-infinity-edition-cartridge" },
  },
  "Coil-94": {
    "Coil-94-1": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variants/Coil-94-1.webp", alt: "UWELL CALIBURN G3 pod, 0.4Ω meshed", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-g3-pods/" },
    "Coil-94-2": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variants/Coil-94-2.webp", alt: "UWELL CALIBURN G3 pod, 0.6Ω meshed, retail box", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-g3-pods/" },
    "Coil-94-3": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variants/Coil-94-3.webp", alt: "UWELL CALIBURN G3 pod, 0.9Ω meshed, retail box", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-g3-pods/" },
    "Coil-94-4": { kind: "official-photo", role: "detail", src: "/assets/products/coil-94/variants/Coil-94-4.webp", alt: "UWELL CALIBURN G3 pod, 1.2Ω meshed, retail box", transparentBackground: false, sourceName: "Black Note (US vape retailer)", sourceUrl: "https://www.blacknote.com/e-juice/uwell-caliburn-g3-pods/" },
  },
  // IQOSHEET-15 — 6 of 12 selectable flavors have a real, exact-name official photo (Green, Blue,
  // Sienna, Purple Wave, Bronze, Oasis Pearl). The other 6 selectable flavors (Black Green, Bright
  // Wave, Emerald Edition, Golden Edition, Sun Pearl, Black Ruby) fall back to the product-level
  // composite — genuinely no matching official asset found for those specific names this session,
  // not a shortcut. This is a real improvement over the prior all-composite state, not a claim of
  // full 16-flavor coverage.
  "IQOSHEET-15": {
    "IQOSHEET-15-2": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-2.webp", alt: "IQOS TEREA Green pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
    "IQOSHEET-15-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-3.webp", alt: "IQOS TEREA Blue pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
    "IQOSHEET-15-4": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-4.webp", alt: "IQOS TEREA Sienna pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
    "IQOSHEET-15-5": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-5.webp", alt: "IQOS TEREA Purple Wave pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
    "IQOSHEET-15-6": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-6.webp", alt: "IQOS TEREA Bronze pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
    "IQOSHEET-15-15": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-15/variants/IQOSHEET-15-15.webp", alt: "IQOS TEREA Oasis Pearl pack", transparentBackground: false, sourceName: "IQOS (official brand CDN)", sourceUrl: "https://www.iqos.com/ph/en/shop.html" },
  },
  "IQOSHEET-16": {
    "IQOSHEET-16-1": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-1.webp", alt: "IQOS ILUMA i PRIME, Midnight Black", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-midnight-black.html" },
    "IQOSHEET-16-2": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-2.webp", alt: "IQOS ILUMA i PRIME, Breeze Blue", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-breeze-blue.html" },
    "IQOSHEET-16-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-3.webp", alt: "IQOS ILUMA i PRIME, Aspen Green", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-aspen-green.html" },
  },
  "IQOSHEET-18": {
    "IQOSHEET-18-1": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/IQOSHEET-18-1.webp", alt: "IQOS ILUMA i, Midnight Black", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-midnight-black.html" },
    "IQOSHEET-18-3": { kind: "official-photo", role: "detail", src: "/assets/products/iqosheet-18/variants/IQOSHEET-18-3.webp", alt: "IQOS ILUMA i, Breeze Blue", transparentBackground: true, sourceName: "IQOS (official brand site)", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-breeze-blue.html" },
  },
  // IQOSHEET-14 (Lambda i8) deliberately NOT split into per-variant crops: the only source is a
  // 1000×1000 6-device lineup photo, and cropping a single ~155px-wide device out of it would
  // fall below production-quality resolution. The lineup shot already truthfully shows both real
  // active colors (Red, Gold) together with no risk of one being mistaken for the other — a
  // genuine case where the product-level image alone already satisfies the truthfulness bar, not
  // an oversight.
};

// ===================================================================================
// Neutral variant-fallback media — third delta pass. Separate from `VERIFIED_MEDIA` (the
// product-level card/OG image) on purpose: IQOSHEET-15's product-level card is a real 6-flavor
// composite, genuinely correct as a CATALOG THUMBNAIL ("here is a representative set of real
// TEREA packs") — that framing is only misleading in the ONE specific place a customer has
// already selected a DIFFERENT, unmapped flavor on the Product Detail page, where showing 5 named
// boxes reads as "this is what you picked." This table exists to break that association: a
// product listed here gets a truthful, flavor-NEUTRAL image shown ONLY when the selected variant
// has no dedicated photo of its own — never touching the product-level card/grid/OG image, which
// keeps using VERIFIED_MEDIA exactly as before for every other purpose.
const NEUTRAL_VARIANT_FALLBACK: Record<string, ProductAsset> = {
  "IQOSHEET-15": {
    kind: "official-photo",
    role: "detail",
    src: "/assets/products/iqosheet-15/variant-fallback.webp",
    alt: "IQOS TEREA tobacco stick construction — a neutral, non-flavor-specific view",
    angle: "Official manufacturer product-anatomy diagram (iqos.com/ph's own \"TEREA-components\" asset, found on the same official TEREA-variants listing page as the per-flavor pack photos). Shows the real physical stick construction with zero flavor name/color visible anywhere — deliberately chosen so it cannot be mistaken for representing any specific one of the 10 flavors that don't have their own verified photo.",
    transparentBackground: false,
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

/** Attaches a verified per-variant image where one exists in VERIFIED_VARIANT_MEDIA, leaving
 *  every other variant's `image` unset so it falls back to the product-level card asset — see
 *  that table's own header comment. Never mutates a variant that already has no matching entry. */
function attachVariantMedia(shipnityProductId: string, variants: ProductMasterInput["variants"]): ProductMasterInput["variants"] {
  const media = VERIFIED_VARIANT_MEDIA[shipnityProductId];
  if (!media) return variants;
  return variants.map((v) => (media[v.id] ? { ...v, image: media[v.id] } : v));
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
