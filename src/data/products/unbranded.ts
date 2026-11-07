import type { Product } from "@/types/catalog";

// ===================================================================================
// "Unbranded" catalog tier — owner decision, 2026-09-04.
//
// These SKUs are real, currently-stocked Shipnity parents (they exist in the actual Excel/
// Shipnity export this store operates from) whose FLAVOR/PUFF-COUNT data is genuine Shipnity
// operational fact, but whose MANUFACTURER identity could not be confirmed after two separate
// exhaustive research passes (multiple background agents, bilingual Thai/English search across
// official-site, Facebook, Instagram, LINE OA, and Shopee/Lazada channels — see this session's
// research notes for "Muro cluster", "isolated no-brand pod products", and "MOOOD and Foli Bar").
// Every one of these product/line names (MOOOD, Muro, Vazer, Reswa, Foli Bar) is real and sold by
// multiple independent Thai retailers — they are not invented — but no first-party manufacturer
// website, official social page, or verified official store was found for any of them, meaning
// this catalog's normal evidence bar for a `Brand` record (see src/data/brands.ts — every entry
// there has a real `referenceUrl`) cannot honestly be met.
//
// Rather than either (a) fabricating a Brand record with an invented tagline/description/site, or
// (b) leaving these Excel items completely absent from the catalog, the owner explicitly chose:
// list them under a literal `brandId: "Unbranded"` (no matching Brand record — getBrand() already
// falls back to displaying the raw brandId string everywhere it's read, so this renders as an
// honest "Unbranded" badge rather than a broken link or a fabricated maker name; the same
// null-safe-fallback trick is used for `familyId`, giving each item its own real product-line name
// as a display chip without inventing a ProductFamily record under a brand that doesn't exist).
//
// `assets: []` (no product photo yet) is a DELIBERATE, honest placeholder for all 8 — ProductMedia
// falls back to DeviceGlyph (a parametric, non-photographic illustration, see that component's own
// doc comment), never a broken image or fabricated stock photo. This session's browser/fetch tools
// were unavailable when this batch was written, so no candidate photo could be independently
// verified against this catalog's "no third-party watermark, no background clutter" standard. Real
// photography is a follow-up pass (owner's own stated priority order: get every current Excel item
// listed FIRST, then colors, then image-quality), not a blocker for listing the item at all.
//
// sourceUrls below are real, independently-verified retailer/OEM/social sites found during
// research — NOT manufacturer-official sites (none exist), stated as such. One Shipnity parent
// sharing this same "no first-party brand" problem is deliberately LEFT OUT of this batch because
// no independently verifiable public source could be found at all: Pod-154 "Pop Up 10K หัวเติม" —
// its flavor list is real Shipnity data but is not represented here pending a citable source.
// Pod-149 "SKE Crystal B20K Puffs" is excluded from this file entirely (not even considered for
// "Unbranded"): SKE's own real lineup tops out at 15K, making this listing a likely counterfeit/
// non-existent SKE tier — an owner-only legal decision, not a brand-identity gap.
//
// UPDATE (2026-09-04): the e-liquid schema gap is now fixed — `SystemType` gained an "e-liquid"
// value and the device-only `attributes` fields (screenType/drawStyle/portability/chargingType)
// are now optional, so Eliquid-169 "Muro Freebase" and eliquid-62 "Muro Salt Nic" are published
// below alongside the rest of the Muro cluster. Nicotine strength/PG-VG ratio for both come from
// this session's retailer research (not an independently confirmed first-party source), so those
// specific spec lines are marked `unverified`; the salt-nic-vs-freebase distinction itself is
// `verified` since it's literally what Shipnity's own product name states.
// ===================================================================================

export const unbrandedProducts: Product[] = [
  {
    id: "muro-space-15k",
    slug: "muro-space-15k",
    hiddenFromStorefront: { since: "2026-09-06", reason: "owner decision (LAUNCH_AUDIT item 11): card image has the device cut off at the bottom edge with leftover template text — hidden until a clean photo exists" },
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Muro Space 15K",
    displayName: "Muro Space 15K",
    tagline: "A disposable vape rated for up to 15,000 puffs.",
    shortDescription:
      "A disposable vape from the Muro \"Space\" line, rated for up to 15,000 puffs.",
    isFlagship: false,
    attributes: {
      puffCount: 15000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "Not independently confirmed",
    },
    // Real per-flavor photos, cropped from two sources this pass (2026-09-04): 4 of 5 flavors
    // (Extreme Menthol, Double Mint, Milk Cream, Watermelon) come from a Thai retailer's own
    // "SPACE 15K" marketing template (f.btwcdn.com) — a plain rectangular crop that keeps the
    // device 100% intact, accepting minor decorative background bleed (leaf/milk-carton/chemical
    // watermark graphics, a small corner nicotine badge) at the frame edges as an honest framing
    // limit, not a pixel alteration. Very Strawberry uses a second retailer's template (same
    // crop standard) since the first source's own "Very Strawberry" URL 403'd on refetch and no
    // working replacement in that exact template was found — cropped tightly around the device,
    // accepting a strawberry-leaf sliver at the extreme left edge for the same reason.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-space-15k/variants/double-mint.webp",
        alt: "Muro Space 15K, Double Mint flavor",
        angle: "Front, angled",
        transparentBackground: false,
        sourceName: "Retailer photo — not a manufacturer-official site, see file header",
        sourceUrl: "https://vapemun.com/",
      },
    ],
    flavorVariants: [
      {
        id: "extreme-menthol",
        name: "Extreme Menthol",
        swatchHex: "#3ab5c6",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-space-15k/variants/extreme-menthol.webp",
          alt: "Muro Space 15K, Extreme Menthol flavor",
        },
      },
      {
        id: "double-mint",
        name: "Double Mint",
        swatchHex: "#3ea88a",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-space-15k/variants/double-mint.webp",
          alt: "Muro Space 15K, Double Mint flavor",
        },
      },
      {
        id: "watermelon",
        name: "Watermelon",
        swatchHex: "#d94f6b",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-space-15k/variants/watermelon.webp",
          alt: "Muro Space 15K, Watermelon flavor",
        },
      },
      {
        id: "very-strawberry",
        name: "Very Strawberry",
        swatchHex: "#c9405f",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-space-15k/variants/very-strawberry.webp",
          alt: "Muro Space 15K, Very Strawberry flavor",
        },
      },
      {
        id: "milk-cream",
        name: "Milk Cream",
        swatchHex: "#e8d9b8",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-space-15k/variants/milk-cream.webp",
          alt: "Muro Space 15K, Milk Cream flavor",
        },
      },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "Up to 15,000", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers looking for a high-puff-count disposable with a wide flavor lineup."],
    faqs: [],
    relatedProductSlugs: ["muro-3ml", "muro-sc-8000", "muro-connector-20k", "muro-freebase", "muro-salt-nic"],
    // Retailer reference (vapemun.com), not a manufacturer-official site — see file header. This
    // domain was independently confirmed live and carrying real Muro-line product listings during
    // this session's research (exact confirmed path for a sibling SKU: /product/muro-sc-8k/).
    sourceUrls: ["https://vapemun.com/"],
  },
  {
    // Round popular models 07/11: searched (nexas booster 16k 880 a month), not in the warehouse, no price, no cart, no maker site found, so
    // Unbranded like the rest of this file. Owner 07/11: a fact only where 3 independent shops agree, in the copy, never a spec row. Read 07/11 in
    // the browser: goatvapethai · maneevp · yaivapestore: 16,000 puffs, 800mAh, 20mL, USB-C, 3-step airflow, these 18 flavours (the first
    // two list them, yaivapestore names them all; vbth3 lacks Yoyo Grape). Not agreed, so not written: which flavours come at 5%, coil ohms, the count of lights (two shops).
    id: "nexas-booster-16k",
    slug: "nexas-booster-16k",
    brandId: "Unbranded",
    familyId: "Nexas",
    categoryId: "disposables",
    systemType: "disposable",
    name: "NEXAS Booster 16K",
    displayName: "NEXAS BOOSTER 16K",
    searchAliases: ["Nexas","Nexas Booster","Nexas 16000","Nexas 16K"],
    tagline: "A disposable with battery lights and three airflow steps.",
    shortDescription:
      "A disposable with battery lights on the body and airflow you can set in three steps. Pick from the flavours below.",
    isFlagship: false,
    attributes: {
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/nexas-booster-16k/card-wm5.webp",
        alt: "NEXAS Booster 16K, white body with an orange tank, front view",
        angle: "front, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/nexas-booster-16k",
      },
    ],
    flavorVariants: [
      { id: "cola-ice", name: "Cola Ice", swatchHex: "#6b4423", availability: "unknown" },
      { id: "cola-lemon", name: "Cola Lemon", swatchHex: "#8a6a2a", availability: "unknown" },
      { id: "grape-ice", name: "Grape Ice", swatchHex: "#8a6bb0", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#b08ac4", availability: "unknown" },
      { id: "green-apple", name: "Green Apple", swatchHex: "#8cc63f", availability: "unknown" },
      { id: "green-soda", name: "Green Soda", swatchHex: "#5fbf6a", availability: "unknown" },
      { id: "lychee-ice", name: "Lychee Ice", swatchHex: "#f2b5c4", availability: "unknown" },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#9fd3e8", availability: "unknown" },
      { id: "mint-extra", name: "Mint Extra", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "mixberry", name: "Mix Berries", swatchHex: "#a24a7e", availability: "unknown" },
      { id: "oolong-tea", name: "Oolong Tea", swatchHex: "#b5853f", availability: "unknown" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#f2a093", availability: "unknown" },
      { id: "red-soda", name: "Red Soda", swatchHex: "#d9394e", availability: "unknown" },
      { id: "strawberry-banana", name: "Strawberry Banana", swatchHex: "#f2c06b", availability: "unknown" },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#e4476a", availability: "unknown" },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#e4576a", availability: "unknown" },
      { id: "watermelon-ice", name: "Watermelon Ice", swatchHex: "#e4576a", availability: "unknown" },
      { id: "yoyo-grape", name: "Yoyo Grape", swatchHex: "#7a5fb0", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "16,000", sourceStatus: "unverified" }],
    features: [
      { id: "lights", title: "Battery lights and airflow", description: "Lights on the body show the battery, and the airflow sets in three steps." },
      { id: "figures", title: "The figures shops agree on", description: "The maker has no site we could find, so these come from shops that sell it and agree: 16,000 puffs, 20mL, an 800mAh battery and USB-C charging." },
    ],
    compatibility: [],
    whoIsThisFor: ["You came looking for the NEXAS Booster by name, or you want a high-puff disposable you can adjust."],
    faqs: [],
    relatedProductSlugs: [],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/nexas-booster-16k"],
  },
  {
    id: "muro-3ml",
    slug: "muro-3ml",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "switch-pods",
    systemType: "pod-cartridge",
    name: "Muro 3ML",
    displayName: "Muro 3ML",
    tagline: "A 3mL prefilled pod cartridge.",
    shortDescription: "A 3mL prefilled replacement pod cartridge from the Muro line, available in 14 flavors.",
    isFlagship: false,
    // Round "queue 0211" articles (02/11): the more-details section (all-flavours grid + the article in product-articles.ts)
    // — a legacy page shows its article only inside it (as muro-sc-8000).
    storyDetails: true,
    attributes: {
      capacityMl: 3,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    // Box photos, all 14 flavours (08/10, owner asked for the boxes to be cut out like every other product): ihavevape.net's
    // 600 px flavour posters (2024-07, https://ihavevape.net/product/close-system-muro-3-ml/) all use ONE box template at
    // one position, so one measured hexagon (the box silhouette: spine top, top back-right, front top-right, front
    // bottom-right, front bottom-left, spine bottom) cuts every box out of its splash backdrop — box pixels untouched,
    // everything outside the box removed (_incoming/option-photos/muro-cut/cut.js). Owner 08/10 "ขนาดสินค้าตัวนี้ยังดูเล็กๆ":
    // the 340x490 files rendered at intrinsic size in the hero (src/lib/media-quality.ts), so each box was re-rendered 2x
    // (Higgsfield Nano Banana Pro through Chrome, "same image, high resolution", every word checked against the cut) and
    // fitted back onto the measured outline at 694x1000 (-hd files; _incoming/muro-big/align.js + edge.js — the alpha is
    // the cut's own, never the AI's). ihavevape.net lists the 14 flavours and vapeclubth.org/muro-pod-juice.html carries
    // the same 14. Muro Grape's box prints "VERY STRAWBERRY" on its side panel: that is the maker's artwork, kept as is.
    // Not stocked yet = availability "unknown".
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-3ml/variants/grape-hd-wm5.webp",
        alt: "Muro 3ML, Grape flavor box",
        angle: "Front, angled",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from ihavevape.net's flavour poster (box cut out, re-rendered 2x) — not a manufacturer-official site",
        sourceUrl: "https://ihavevape.net/product/close-system-muro-3-ml/",
      },
    ],
    flavorVariants: [
      {
        id: "grape",
        name: "Grape",
        swatchHex: "#6b4a8e",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/grape-hd-wm5.webp", alt: "Muro 3ML, Grape flavor box" },
      },
      {
        id: "watermelon",
        name: "Watermelon",
        swatchHex: "#d94f6b",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/watermelon-hd-wm5.webp", alt: "Muro 3ML, Watermelon flavor box" },
      },
      {
        id: "smooth-mint",
        name: "Smooth Mint",
        swatchHex: "#4ec9a0",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/smooth-mint-hd-wm5.webp", alt: "Muro 3ML, Smooth Mint flavor box" },
      },
      {
        id: "green-slush",
        name: "Green Slush",
        swatchHex: "#5ec95e",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/green-slush-hd-wm5.webp", alt: "Muro 3ML, Green Slush flavor box" },
      },
      {
        id: "mix-berries",
        name: "Mix Berries",
        swatchHex: "#8e3a6b",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/mix-berries-hd-wm5.webp", alt: "Muro 3ML, Mix Berries flavor box" },
      },
      {
        id: "blueberry-bubblegum",
        name: "Blueberry Bubblegum",
        swatchHex: "#8a5ac9",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-3ml/variants/blueberry-bubblegum-hd-wm5.webp",
          alt: "Muro 3ML, Blueberry Bubblegum flavor box",
        },
      },
      { id: "muro-grape", name: "Muro Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/muro-grape-hd-wm5.webp", alt: "Muro 3ML, Muro Grape flavor box" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d9b23a", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/honey-lemon-hd-wm5.webp", alt: "Muro 3ML, Honey Lemon flavor box" } },
      { id: "very-strawberry", name: "Very Strawberry", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/very-strawberry-hd-wm5.webp", alt: "Muro 3ML, Very Strawberry flavor box" } },
      { id: "double-shisha", name: "Double Shisha", swatchHex: "#7a5a2f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/double-shisha-hd-wm5.webp", alt: "Muro 3ML, Double Shisha flavor box" } },
      { id: "apple-juice", name: "Apple Juice", swatchHex: "#9e1b32", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/apple-juice-hd-wm5.webp", alt: "Muro 3ML, Apple Juice flavor box" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#2a8fd6", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/mineral-water-hd-wm5.webp", alt: "Muro 3ML, Mineral Water flavor box" } },
      { id: "strawberry-peach", name: "Strawberry Peach", swatchHex: "#d23a5a", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/strawberry-peach-hd-wm5.webp", alt: "Muro 3ML, Strawberry Peach flavor box" } },
      { id: "cola", name: "Cola", swatchHex: "#a3201f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/cola-hd-wm5.webp", alt: "Muro 3ML, Cola flavor box" } },
    ],
    specifications: [{ key: "capacity", label: "Capacity", value: "3mL", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Owners of a compatible pod device restocking flavor cartridges."],
    faqs: [
      {
        id: "muro-3ml-what",
        question: "Is the Muro 3ML a device or a pod?",
        answer: "It's a pod. Each Muro 3ML comes prefilled with 3mL of e-liquid in a single flavor, and the device is a separate product.",
      },
      {
        id: "muro-3ml-flavors",
        question: "What flavors does the Muro 3ML come in?",
        answer: "There are 14. The cool one is Smooth Mint, the grapes are Grape and Muro Grape, and the fruit side includes Watermelon, Very Strawberry and Mix Berries. Others include Cola and Mineral Water, and the full list is in the options on this page.",
      },
      {
        id: "muro-3ml-grape",
        question: "Are Muro Grape and Grape the same flavor?",
        answer: "No, they're two separate options in the grape group, each with its own box. Check the name on the box before you choose.",
      },
    ],
    relatedProductSlugs: ["muro-space-15k", "muro-sc-8000", "muro-connector-20k", "muro-freebase", "muro-salt-nic"],
    sourceUrls: ["https://vapemun.com/", "https://ecigelm.com/", "https://ihavevape.net/product/close-system-muro-3-ml/", "https://vapeclubth.org/muro-pod-juice.html"],
  },
  {
    id: "muro-sc-8000",
    slug: "muro-sc-8000",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Muro SC 8000 Puffs",
    displayName: "Muro SC 8000 Puffs",
    tagline: "A rechargeable disposable rated for up to 8,000 puffs.",
    shortDescription:
      "A rechargeable disposable from the Muro \"SC\" line, with a 600mAh battery and USB-C charging, rated for up to 8,000 puffs.",
    isFlagship: false,
    attributes: {
      batteryMah: 600,
      puffCount: 8000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Round "image-sitewide" batch 4 (2026-09-30, the M Bar 10K treatment; owner 30/09: the flavour photo = the device +
    // that flavour's pouch). No maker site exists (the device reads "MURO — AWAKE YOUR NOSE."), so the reference is the
    // retailer art (vapemun.com — per-flavour posters, device + pouch). Every flavour is the same grey device in the same
    // black pouch; only the pouch's label bar (colour + name) differs. Card = a Higgsfield remake of the device from
    // vapemun's clean two-device shot, tilted; flavour photos = one Higgsfield pouch master + one upright device master,
    // the label bar recoloured to each flavour's label colour read off its poster and the name printed with a real font
    // (_incoming/image-sitewide/muro/compose.js · label-colours.js · labels.json; `aiRender` in scripts/process-images.map.json).
    // Watermelon: both retailers' Watermelon art (vapemun, pod789) reuse the Apple Shisha pouch, so there is no label
    // source; its label colour = pod789's own Watermelon caption bar [unverified]. `swatchHex` = the label colour.
    // card-v2: card.webp was the retailer shot, already live (Cloudflare keeps /assets 30 days, lesson พ6).
    // No maker posters → no story blocks; the more-details section is the all-flavours grid (device + pouch photos).
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-sc-8000/card-v2-wm5.webp",
        alt: "Muro SC 8000 Puffs, grey device, three-quarter view",
        angle: "3/4, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of the retailer's device shot",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from retailer art",
        sourceUrl: "https://vapemun.com/product/muro-sc-8k/",
      },
    ],
    // No all-options image behind an "all" chip (owner 01/10: the made-up lineups go — back to the Caliburn way, one device
    // per option by swipe or chip).
    // Owner 30/09 (later the same day): the first image is ONE sharp device, like the Caliburn pages — the page opens on
    // the card photo, flavours by swipe or chip (`openOnCardPhoto`).
    openOnCardPhoto: true,
    storyDetails: true,
    // 12 flavours = the retailer lists (pod789.com and vapemun.com list the same 12; the 8 first stocked + Grape, Watermelon,
    // Double Mint, Mix Berries — the name printed on the pouch). Catalog completeness rule (owner 2026-09-06 / 30/09).
    flavorVariants: [
      { id: "extreme-menthol", name: "Extreme Menthol", swatchHex: "#0d0e22", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-extreme-menthol-wm5.webp", alt: "Muro SC 8000 Puffs, Extreme Menthol — device with its pouch" } },
      { id: "cola", name: "Cola", swatchHex: "#6b1c0f", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-cola-wm5.webp", alt: "Muro SC 8000 Puffs, Cola — device with its pouch" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#a9201e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-strawberry-wm5.webp", alt: "Muro SC 8000 Puffs, Strawberry — device with its pouch" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d0bf1e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-honey-lemon-wm5.webp", alt: "Muro SC 8000 Puffs, Honey Lemon — device with its pouch" } },
      { id: "apple-shisha", name: "Apple Shisha", swatchHex: "#6f0e18", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-apple-shisha-wm5.webp", alt: "Muro SC 8000 Puffs, Apple Shisha — device with its pouch" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#96b8bf", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-mineral-water-wm5.webp", alt: "Muro SC 8000 Puffs, Mineral Water — device with its pouch" } },
      { id: "yakult", name: "Yakult", swatchHex: "#d3bea8", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-yakult-wm5.webp", alt: "Muro SC 8000 Puffs, Yakult — device with its pouch" } },
      { id: "banana-strawberry", name: "Banana Strawberry", swatchHex: "#c48592", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-banana-strawberry-wm5.webp", alt: "Muro SC 8000 Puffs, Banana Strawberry — device with its pouch" } },
      { id: "grape", name: "Grape", swatchHex: "#5a1a6b", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-grape-wm5.webp", alt: "Muro SC 8000 Puffs, Grape — device with its pouch" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e60435", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-watermelon-wm5.webp", alt: "Muro SC 8000 Puffs, Watermelon — device with its pouch" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#56a4ad", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-double-mint-wm5.webp", alt: "Muro SC 8000 Puffs, Double Mint — device with its pouch" } },
      { id: "mix-berries", name: "Mix Berries", swatchHex: "#6b0f2e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-mix-berries-wm5.webp", alt: "Muro SC 8000 Puffs, Mix Berries — device with its pouch" } },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 8,000", sourceStatus: "verified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified" },
      // The maker's pouch, the owner's own photo 03/11 (PARAMETERS block).
      { key: "nicotine", label: "Nicotine strength", value: "30mg", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance", value: "0.9Ω", sourceStatus: "verified" },
      { key: "size", label: "Dimensions", value: "105 × 28 mm", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [{ type: "charging", label: "USB-C", note: "Rechargeable via USB-C." }],
    whoIsThisFor: ["Vapers who want a rechargeable disposable rather than a single-charge unit."],
    faqs: [],
    // SEO 04/11: the shop's own clip of exactly this model — title, channel and upload date read from YouTube's watch page (04/11).
    reviewVideo: { videoId: "QMzrz5_E4Ps", title: "MURO SC 8K ใช้แล้วทิ้งอร่อยแบบง่ายๆ", channelName: "OKM YARZ", publishedAt: "2026-02-11" },
    relatedProductSlugs: ["muro-space-15k", "muro-3ml", "muro-connector-20k", "muro-freebase", "muro-salt-nic"],
    // Exact confirmed product path (this session's research fetched this page directly).
    sourceUrls: ["https://vapemun.com/product/muro-sc-8k/", "https://pod789.com/product/muro-sc-8k/"],
  },
  {
    id: "muro-connector-20k",
    slug: "muro-connector-20k",
    brandId: "Unbranded",
    familyId: "Muro",
    // 29/10 (owner via Javis): a CONNECTOR POD, not a disposable — the maker poster prints "CONNECTOR POD" + "USE WITH MURO
    // CREATOR DEVICE" and the battery device is sold apart; RELX Creator fit = the shop's own stock (relx-creator FAQ).
    categoryId: "switch-pods",
    systemType: "pod-cartridge",
    name: "Muro Connector 20K",
    displayName: "Muro Connector 20K",
    tagline: "A prefilled connector pod rated for up to 20,000 puffs.",
    shortDescription:
      "A prefilled pod from the Muro \"Connector\" line, rated for up to 20,000 puffs. It is made for the Muro Creator device, and the shop has confirmed it also fits the RELX Creator.",
    isFlagship: false,
    // Round "clip" (2026-09-27): the "RELX Creator pod" clip of docs/SEO_LANDSCAPE.md §4 item 6, from @OKM_24 (the main
    // channel of the two that cover this pod). "LEGO" in its title is the same honeycomb-shell nickname as this record's
    // photo file ("muro-lego-20k"). Title and upload date read from YouTube's own video data (_incoming/clip-round/clips.md).
    reviewVideo: { videoId: "Mp0QbGUX3gU", title: "MURO CONNECTOR 20000 หัวใช้แล้วทิ้ง LEGO สำหรับ RELX CREATOR!", channelName: "OKAMI", publishedAt: "2026-05-27" },
    attributes: {
      puffCount: 20000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — pod only, the battery is in the device",
    },
    // 29/10: Javis's pods (Higgsfield, from the maker's posters) replace the earlier remakes, which printed
    // "AMAZE YOUR NOSE" (the real print is "AWAKE YOUR NOSE.") and showed 3 pod colours instead of the maker's 6.
    // Sources and checks per file: scripts/process-images.map.json.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-connector-20k/card-v4-wm5.webp",
        alt: "Muro Connector 20K pod, Grape, three-quarter view",
        angle: "Three-quarter, isolated, floor reflection",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from Muro's own flavour posters",
        sourceUrl: "https://ihavevape.net/product/muro-connector-20k/",
      },
    ],
    // Every flavour photo is the same pod pose (honeycomb face + printed label side); the card opens the gallery.
    openOnCardPhoto: true,
    // Round "queue 0211" articles (02/11): the more-details section (all-flavours grid + the article in product-articles.ts)
    // — a legacy page shows its article only inside it (as muro-sc-8000).
    storyDetails: true,
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-grape-wm5.webp", alt: "Muro Connector 20K pod, Grape" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-watermelon-wm5.webp", alt: "Muro Connector 20K pod, Watermelon" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-double-mint-wm5.webp", alt: "Muro Connector 20K pod, Double Mint" } },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-cola-wm5.webp", alt: "Muro Connector 20K pod, Cola" } },
      { id: "mix-berries", name: "Mix Berries", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-mix-berries-wm5.webp", alt: "Muro Connector 20K pod, Mix Berries" } },
      { id: "pineapple", name: "Pineapple", swatchHex: "#e0c93a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-pineapple-wm5.webp", alt: "Muro Connector 20K pod, Pineapple" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d9b23a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-honey-lemon-wm5.webp", alt: "Muro Connector 20K pod, Honey Lemon" } },
      { id: "apple-baraku", name: "Apple Baraku", swatchHex: "#7ab84a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-apple-baraku-wm5.webp", alt: "Muro Connector 20K pod, Apple Baraku" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#cfe8ee", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-mineral-water-wm5.webp", alt: "Muro Connector 20K pod, Mineral Water" } },
      { id: "yakult", name: "Yakult", swatchHex: "#f0e4c0", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-yakult-wm5.webp", alt: "Muro Connector 20K pod, Yakult" } },
      { id: "banana-strawberry", name: "Banana Strawberry", swatchHex: "#e0a05a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-banana-strawberry-wm5.webp", alt: "Muro Connector 20K pod, Banana Strawberry" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-kyoho-grape-wm5.webp", alt: "Muro Connector 20K pod, Kyoho Grape" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-pink-berry-wm5.webp", alt: "Muro Connector 20K pod, Pink Berry" } },
      { id: "lemon-jeez", name: "Lemon Jeez", swatchHex: "#d9d13a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-lemon-jeez-wm5.webp", alt: "Muro Connector 20K pod, Lemon Jeez" } },
      { id: "cool-mint", name: "Cool Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-cool-mint-wm5.webp", alt: "Muro Connector 20K pod, Cool Mint" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-blue-ice-wm5.webp", alt: "Muro Connector 20K pod, Blue Ice" } },
      { id: "green-tea", name: "Green Tea", swatchHex: "#7a8a4a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-green-tea-wm5.webp", alt: "Muro Connector 20K pod, Green Tea" } },
      { id: "strawberry-peach", name: "Strawberry Peach", swatchHex: "#e08a7a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-strawberry-peach-wm5.webp", alt: "Muro Connector 20K pod, Strawberry Peach" } },
      { id: "vanilla-ice-cream", name: "Vanilla Ice Cream", swatchHex: "#e8d9b8", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-vanilla-ice-cream-wm5.webp", alt: "Muro Connector 20K pod, Vanilla Ice Cream" } },
      { id: "taro-ice-cream", name: "Taro Ice Cream", swatchHex: "#9a7ab8", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-taro-ice-cream-wm5.webp", alt: "Muro Connector 20K pod, Taro Ice Cream" } },
      // line 2 max-sync (22/10): 13 more flavours in Shipnity Max (Pod-171-21..33) — Max names. The 50MG posters all show the
      // black pod, so the 50MG photos are the black pod with that flavour's own printed name (map: _incoming/muro-conn-2910/make50.js).
      { id: "green-slush", name: "Green Slush", swatchHex: "#7ac943", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-green-slush-wm5.webp", alt: "Muro Connector 20K pod, Green Slush" } },
      { id: "spear-mint", name: "Spear Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-spear-mint-wm5.webp", alt: "Muro Connector 20K pod, Spear Mint" } },
      { id: "yakult-orange", name: "Yakult Orange", swatchHex: "#f0a040", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-yakult-orange-wm5.webp", alt: "Muro Connector 20K pod, Yakult Orange" } },
      { id: "peach-tea", name: "Peach Tea", swatchHex: "#e8a07a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-peach-tea-wm5.webp", alt: "Muro Connector 20K pod, Peach Tea" } },
      { id: "fruit-punch", name: "Fruit Punch", swatchHex: "#d9405a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-fruit-punch-wm5.webp", alt: "Muro Connector 20K pod, Fruit Punch" } },
      { id: "strawberry-ice-cream", name: "Strawberry Ice Cream", swatchHex: "#f0a0b8", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-strawberry-ice-cream-wm5.webp", alt: "Muro Connector 20K pod, Strawberry Ice Cream" } },
      { id: "butterscotch", name: "Butterscotch", swatchHex: "#c9893a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-butterscotch-wm5.webp", alt: "Muro Connector 20K pod, Butterscotch" } },
      { id: "chocolate-dubai", name: "Chocolate Dubai", swatchHex: "#6b4a2f", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-chocolate-dubai-wm5.webp", alt: "Muro Connector 20K pod, Chocolate Dubai" } },
      { id: "grape-50mg", name: "Grape 50MG", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-grape-50mg-wm5.webp", alt: "Muro Connector 20K pod, Grape 50MG" } },
      { id: "watermelon-50mg", name: "Watermelon 50MG", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-watermelon-50mg-wm5.webp", alt: "Muro Connector 20K pod, Watermelon 50MG" } },
      { id: "double-mint-50mg", name: "Double Mint 50MG", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-double-mint-50mg-wm5.webp", alt: "Muro Connector 20K pod, Double Mint 50MG" } },
      { id: "mix-berries-50mg", name: "Mix Berries 50MG", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-mix-berries-50mg-wm5.webp", alt: "Muro Connector 20K pod, Mix Berries 50MG" } },
      { id: "yakult-50mg", name: "Yakult 50MG", swatchHex: "#f0e4c0", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/pod-yakult-50mg-wm5.webp", alt: "Muro Connector 20K pod, Yakult 50MG" } },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 20,000", sourceStatus: "verified" },
      // The maker's box, the owner's own photo 03/11 (3% NICOTINE · DUAL MESH COIL).
      { key: "nicotine", label: "Nicotine strength", value: "3%", sourceStatus: "verified" },
      { key: "coil", label: "Coil", value: "Dual Mesh", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Muro Creator or RELX Creator owners who want a high-puff pod with a wide flavour lineup."],
    faqs: [
      {
        id: "muro-connector-20k-device",
        question: "Which devices does the Muro Connector 20K fit?",
        answer: "It's made for the Muro Creator device, and we've confirmed from our own stock that it also fits the RELX Creator.",
      },
      {
        id: "muro-connector-20k-puffs",
        question: "How many puffs does the Muro Connector 20K give?",
        answer: "It's rated for up to 20,000 puffs, and the number you actually get varies with how you vape.",
      },
      {
        id: "muro-connector-20k-coil",
        question: "What coil does the Muro Connector 20K use?",
        answer: "A Dual Mesh coil. The pod comes prefilled, so when the e-liquid runs out you simply fit a new one.",
      },
      {
        id: "muro-connector-20k-flavors",
        question: "How many flavours does the Muro Connector 20K have?",
        answer: "33. If you like a cool flavour, Double Mint, Cool Mint, Spear Mint and Blue Ice are a good place to start.",
      },
    ],
    relatedProductSlugs: ["relx-creator", "muro-3ml", "muro-space-15k", "muro-sc-8000", "muro-freebase", "muro-salt-nic"],
    sourceUrls: ["https://ihavevape.net/product/muro-connector-20k/", "https://vapemun.com/"],
  },
  {
    id: "foli-bar-15k",
    slug: "foli-bar-15k",
    brandId: "Unbranded",
    familyId: "Foli Cool Bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Foli Cool Bar 15K",
    displayName: "Foli Cool Bar 15K",
    tagline: "A disposable vape rated for up to 15,000 puffs.",
    shortDescription: "A disposable vape from the Foli \"Cool Bar\" line, rated for up to 15,000 puffs, in 12 flavors.",
    isFlagship: false,
    attributes: {
      puffCount: 15000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "Not independently confirmed",
    },
    // maxlist 21/10: Max Disposable-42 "Foli Bar 15k" ฿349, 12 flavours — the 12 names match the FOLI Cool Bar 15K line on ihavevape.net 12 of 12 (the other "FOLI Bar 15000"
    // line matches 9 and prints different names). Card = Apple Aloe (in stock, every flavour is); every flavour = an OKami24 studio re-shoot (Higgsfield) of its photo there.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/foli-bar-15k/card-wm5.webp",
        alt: "Foli Cool Bar 15K disposable, Apple Aloe, studio photo",
        angle: "Front, studio re-shoot (maxlist 21/10, IMAGE_SPEC §0 item 7) of the shop's flavour photo.",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the shop's FOLI Cool Bar 15K flavour photo",
        sourceUrl: "https://ihavevape.net/product/foli-cool-bar-15000-puffs/",
      },
    ],
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-apple-aloe-wm5.webp", alt: "Foli Cool Bar 15K disposable, Apple Aloe, studio photo" } },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-grape-wm5.webp", alt: "Foli Cool Bar 15K disposable, Grape, studio photo" } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-grape-aloe-wm5.webp", alt: "Foli Cool Bar 15K disposable, Grape Aloe, studio photo" } },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3a4a8e", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-blueberry-wm5.webp", alt: "Foli Cool Bar 15K disposable, Blueberry, studio photo" } },
      { id: "cola-ice", name: "Cola Ice", swatchHex: "#3a2a30", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-cola-ice-wm5.webp", alt: "Foli Cool Bar 15K disposable, Cola Ice, studio photo" } },
      { id: "lychee-ice", name: "Lychee Ice", swatchHex: "#f0c0d0", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-lychee-ice-wm5.webp", alt: "Foli Cool Bar 15K disposable, Lychee Ice, studio photo" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-double-mint-wm5.webp", alt: "Foli Cool Bar 15K disposable, Double Mint, studio photo" } },
      { id: "mix-berry", name: "Mix Berry", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-mix-berry-wm5.webp", alt: "Foli Cool Bar 15K disposable, Mix Berry, studio photo" } },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#e0708a", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-strawberry-ice-wm5.webp", alt: "Foli Cool Bar 15K disposable, Strawberry Ice, studio photo" } },
      { id: "red-bull-ice", name: "Red Bull Ice", swatchHex: "#4a90c9", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-red-bull-ice-wm5.webp", alt: "Foli Cool Bar 15K disposable, Red Bull Ice, studio photo" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-watermelon-wm5.webp", alt: "Foli Cool Bar 15K disposable, Watermelon, studio photo" } },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown", image: { src: "/assets/products/foli-bar-15k/variant-peach-wm5.webp", alt: "Foli Cool Bar 15K disposable, Peach, studio photo" } },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "Up to 15,000", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers looking for a high-puff-count disposable with a wide flavor lineup."],
    faqs: [],
    relatedProductSlugs: [],
    // xmcvape.com — a real Chinese vape OEM/ODM manufacturer site independently confirmed to
    // reference "Foli" products (not Foli's own site — no such site exists, see file header).
    sourceUrls: ["https://xmcvape.com/"],
  },
  {
    id: "vazer-one-pod",
    slug: "vazer-one-pod",
    brandId: "Unbranded",
    familyId: "Vazer",
    categoryId: "switch-pods",
    systemType: "pod-cartridge",
    name: "Vazer One",
    displayName: "Vazer One",
    // maxlist 21/10: Max Pod-115 "หัวพอต Vazer One" ฿59, 5 flavours; the maker sells 21 (the rest show sold out).
    tagline: "Vazer One prefilled pod.",
    shortDescription: "The Vazer One prefilled replacement pod, in 21 flavors.",
    isFlagship: false,
    attributes: {
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    // maxlist 21/10: card = Mango (in stock). images-all 30/10: 20 of the 21 flavours = OKami24 studio re-shoots (Higgsfield) of the flavour boxes on the
    // maker's own posters as sold by maneevp.com (IMAGE_SPEC §0 item 7), each an edit of the one Mango scene and cut with one shared matte, so switching
    // flavours never moves the box — source, prompt and check per file in scripts/process-images.map.json `aiRender`. Blueberry (only a thumbnail on the
    // line-up poster) shows the no-photo panel.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/vazer-one-pod/card-wm5.webp",
        alt: "Vazer One pod box, Mango, studio photo",
        angle: "Three-quarter, studio re-shoot (maxlist 21/10, IMAGE_SPEC §0 item 7) of the maker's Mango flavour poster.",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the Vazer One Mango poster",
        sourceUrl: "https://maneevp.com/product/vazer-one-2-2ml/",
      },
    ],
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-grape-v2-wm5.webp", alt: "Vazer One pod box, Grape, studio photo" } },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-cola-v2-wm5.webp", alt: "Vazer One pod box, Cola, studio photo" } },
      { id: "cola-lemon", name: "Cola Lemon", swatchHex: "#6a5a1f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-cola-lemon-v2-wm5.webp", alt: "Vazer One pod box, Cola Lemon, studio photo" } },
      { id: "mix-berries", name: "Mix Berries", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-mix-berries-v2-v3-wm5.webp", alt: "Vazer One pod box, Mix Berries, studio photo" } },
      { id: "mango", name: "Mango", swatchHex: "#e08a3a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-mango-v2-wm5.webp", alt: "Vazer One pod box, Mango, studio photo" } },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3a4a8e", availability: "unknown" },
      { id: "grapefruit", name: "Grapefruit", swatchHex: "#e8805a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-grapefruit-wm5.webp", alt: "Vazer One pod box, Grapefruit, studio photo" } },
      { id: "gummy-bear", name: "Gummy Bear", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-gummy-bear-wm5.webp", alt: "Vazer One pod box, Gummy Bear, studio photo" } },
      { id: "lemon-soda", name: "Lemon Soda", swatchHex: "#c9d94b", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-lemon-soda-v3-wm5.webp", alt: "Vazer One pod box, Lemon Soda, studio photo" } },
      { id: "lychee", name: "Lychee", swatchHex: "#f0c0d0", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-lychee-wm5.webp", alt: "Vazer One pod box, Lychee, studio photo" } },
      { id: "melon", name: "Melon", swatchHex: "#b8d98a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-melon-wm5.webp", alt: "Vazer One pod box, Melon, studio photo" } },
      { id: "milk-honey", name: "Milk Honey", swatchHex: "#d9a84a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-milk-honey-wm5.webp", alt: "Vazer One pod box, Milk Honey, studio photo" } },
      { id: "mint", name: "Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-mint-wm5.webp", alt: "Vazer One pod box, Mint, studio photo" } },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-peach-wm5.webp", alt: "Vazer One pod box, Peach, studio photo" } },
      { id: "pineapple", name: "Pineapple", swatchHex: "#e8c43a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-pineapple-wm5.webp", alt: "Vazer One pod box, Pineapple, studio photo" } },
      { id: "raspberry", name: "Raspberry", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-raspberry-v3-wm5.webp", alt: "Vazer One pod box, Raspberry, studio photo" } },
      { id: "rootbeer", name: "Rootbeer", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-rootbeer-wm5.webp", alt: "Vazer One pod box, Rootbeer, studio photo" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-strawberry-v3-wm5.webp", alt: "Vazer One pod box, Strawberry, studio photo" } },
      { id: "strawberry-ice-cream", name: "Strawberry Ice-Cream", swatchHex: "#f0a0b8", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-strawberry-ice-cream-wm5.webp", alt: "Vazer One pod box, Strawberry Ice-Cream, studio photo" } },
      { id: "vanilla-custard", name: "Vanilla Custard", swatchHex: "#f0e0a0", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-vanilla-custard-v3-wm5.webp", alt: "Vazer One pod box, Vanilla Custard, studio photo" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variant-watermelon-wm5.webp", alt: "Vazer One pod box, Watermelon, studio photo" } },
    ],
    specifications: [{ key: "format", label: "Format", value: "Prefilled replacement pod", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Owners of a compatible pod device restocking flavor pods."],
    faqs: [],
    relatedProductSlugs: [],
    sourceUrls: ["https://dealervape.net/", "https://vazerpod.com/"],
  },
  {
    id: "reswa-sportcan-12k",
    slug: "reswa-sportcan-12k",
    hiddenFromStorefront: { since: "2026-09-06", reason: "owner decision (LAUNCH_AUDIT item 11): card image is a banner crop with the can cut off and another product visible — hidden until a clean photo exists" },
    brandId: "Unbranded",
    familyId: "Reswa",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Reswa Sportcan 12K",
    displayName: "Reswa Sportcan 12K",
    tagline: "A disposable vape rated for up to 12,000 puffs.",
    shortDescription: "A disposable vape from the Reswa \"Sportcan\" line, rated for up to 12,000 puffs.",
    isFlagship: false,
    attributes: {
      puffCount: 12000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "Not independently confirmed",
    },
    // Real retailer photography (vapeclubth.org) — found this pass (2026-09-04). Each source photo
    // has a "VAPE CLUB THAILAND" title banner (top ~25%) and a tiled logo strip (bottom ~8%), plus
    // decorative props (a Coca-Cola can, ice cubes, tea leaves) flanking the device. Cropped to a
    // plain rectangle containing the device — the device itself is 100% intact/unedited in every
    // crop; a small sliver of a neighboring prop or the tiny "SS" corner logo may bleed in at the
    // extreme edge, which is an honest framing limit, not an alteration of real product pixels.
    // `transparentBackground: false` (plain photo crop, not alpha-isolated).
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/reswa-sportcan-12k/variants/ice-cola.webp",
        alt: "Reswa Sportcan 12K, Ice Cola flavor, retailer photo",
        angle: "Front, cropped from retailer marketing photography",
        transparentBackground: false,
        sourceName: "Retailer photo (vapeclubth.org) — not a manufacturer-official site",
        sourceUrl: "https://vapeclubth.org/",
      },
    ],
    flavorVariants: [
      { id: "green-tea", name: "Green Tea", swatchHex: "#7a8a4a", availability: "unknown", image: { src: "/assets/products/reswa-sportcan-12k/variants/green-tea.webp", alt: "Reswa Sportcan 12K, Green Tea" } },
      { id: "oolong-tea", name: "Oolong Tea", swatchHex: "#8a6a3a", availability: "unknown", image: { src: "/assets/products/reswa-sportcan-12k/variants/oolong-tea.webp", alt: "Reswa Sportcan 12K, Oolong Tea" } },
      { id: "ice-cola", name: "Ice Cola", swatchHex: "#3a2a30", availability: "unknown", image: { src: "/assets/products/reswa-sportcan-12k/variants/ice-cola.webp", alt: "Reswa Sportcan 12K, Ice Cola" } },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "Up to 12,000", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers looking for a high-puff-count disposable."],
    faqs: [],
    relatedProductSlugs: [],
    sourceUrls: ["https://vapeclubth.net/", "https://vapeclubth.org/"],
  },
  {
    id: "next-pro-2-beyond",
    slug: "next-pro-2-beyond",
    brandId: "Unbranded",
    familyId: "Next",
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "Next Pro 2 Beyond",
    displayName: "Next Pro 2 Beyond",
    // Image sweep (19/10): published with a studio card; the copy says only warehouse facts (the retailer-sourced specs stay
    // unverified rows, which the page does not show).
    tagline: "Next Pro 2 Beyond pod device.",
    shortDescription: "The Next Pro 2 Beyond pod device, in 6 colors.",
    isFlagship: false,
    attributes: {
      batteryMah: 440,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Image sweep (19/10): card = Twilight Sky (in stock); every colour = an OKami24 studio re-shoot (Higgsfield) of that colour on the
    // retailer's 6-colour line-up photo (IMAGE_SPEC §0 item 7) — source, prompt and check per file in scripts/process-images.map.json `aiRender`.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/next-pro-2-beyond/card-wm5.webp",
        alt: "Next Pro 2 Beyond pod device, Twilight Sky, studio photo",
        angle: "Front, studio re-shoot (image sweep 19/10, IMAGE_SPEC §0 item 7) of the retailer's line-up photo.",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the retailer's Next Pro 2 Beyond line-up photo",
        sourceUrl: "https://maneevp.com/wp-content/uploads/2024/01/NEXT-Pro-2-Beyond-Close-System-Pod-01.jpg",
      },
    ],
    // Real color lineup — all 6 names are genuine Shipnity operational data. Specs (440mAh,
    // USB-C, 3 power levels/LED colors) come from this session's multi-retailer research
    // convergence (10+ independent listings), not a first-party source — kept as verified-enough
    // to state as fact (near-universal agreement across unrelated sellers), same bar already used
    // elsewhere in this catalog for tier-2/3 evidence.
    colorVariants: [
      { id: "razer-black", name: "Razer Black", swatchHex: "#1a1a1a", image: { src: "/assets/products/next-pro-2-beyond/variant-razer-black-wm5.webp", alt: "Next Pro 2 Beyond, Razer Black — device" } },
      { id: "supreme-red", name: "Supreme Red", swatchHex: "#b83a3a", image: { src: "/assets/products/next-pro-2-beyond/variant-supreme-red-wm5.webp", alt: "Next Pro 2 Beyond, Supreme Red — device" } },
      { id: "white-lava", name: "White Lava", swatchHex: "#e8e4de", image: { src: "/assets/products/next-pro-2-beyond/variant-white-lava-wm5.webp", alt: "Next Pro 2 Beyond, White Lava — device" } },
      { id: "aurora", name: "Aurora", swatchHex: "#6b8ec9", image: { src: "/assets/products/next-pro-2-beyond/variant-aurora-wm5.webp", alt: "Next Pro 2 Beyond, Aurora — device" } },
      { id: "lemon-mint", name: "Lemon Mint", swatchHex: "#c9d94b", image: { src: "/assets/products/next-pro-2-beyond/variant-lemon-mint-wm5.webp", alt: "Next Pro 2 Beyond, Lemon Mint — device" } },
      { id: "twilight-sky", name: "Twilight Sky", swatchHex: "#4a5a9e", image: { src: "/assets/products/next-pro-2-beyond/variant-twilight-sky-wm5.webp", alt: "Next Pro 2 Beyond, Twilight Sky — device" } },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "440mAh built-in, USB-C", sourceStatus: "unverified" },
      { key: "modes", label: "Power levels", value: "3 (Soft / Standard / Boost)", sourceStatus: "unverified" },
      { key: "pod", label: "Pod connector", value: "RELX-Infinity-style universal pod", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Anyone choosing the Next Pro 2 Beyond device in one of its 6 colors."],
    faqs: [
      {
        id: "next-pro-2-beyond-type",
        question: "What kind of pod is the Next Pro 2 Beyond?",
        answer: "It's a pod device we list under Switch Pods. With this type, you change only the prefilled pod when the e-liquid runs out and keep using the same device.",
      },
      {
        id: "next-pro-2-beyond-colors",
        question: "What colours does the Next Pro 2 Beyond come in?",
        answer: "Six: Razer Black, Supreme Red, White Lava, Aurora, Lemon Mint and Twilight Sky.",
      },
    ],
    relatedProductSlugs: [],
    // Only source located this pass is a Facebook photo album (owner-supplied, 2026-09-04) — real
    // and citable, but not a manufacturer or retailer storefront.
    sourceUrls: ["https://www.facebook.com/nonamexxe/photos"],
  },
  {
    id: "muro-freebase",
    slug: "muro-freebase",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "e-liquid",
    systemType: "e-liquid",
    name: "Muro Freebase",
    displayName: "Muro Freebase",
    // Max read 17/10: Eliquid-169 "Muro Freebase" ฿220, 6 flavours (site price ฿250 owner-confirmed 22/10 — legacy-price-approvals). Copy says warehouse facts only (bottle size / nicotine rows stay unverified).
    tagline: "Muro freebase e-liquid.",
    shortDescription: "Muro freebase e-liquid in 6 flavors.",
    isFlagship: false,
    // Round "queue 0211" articles (02/11): the more-details section (all-flavours grid + the article in product-articles.ts)
    // — a legacy page shows its article only inside it (as muro-sc-8000).
    storyDetails: true,
    attributes: {
      capacityMl: 60,
      liquidBase: "freebase",
      beginnerFriendly: false,
    },
    // Image sweep 21/10: card = Watermelon; every flavour = an OKami24 studio re-shoot (Higgsfield) of that bottle on the flavour's
    // retailer poster (600 px, below IMAGE_SPEC; IMAGE_SPEC §0 item 7) — source, prompt and check per file in scripts/process-images.map.json.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-freebase/card-wm5.webp",
        alt: "Muro Freebase e-liquid bottle, Watermelon, studio photo",
        angle: "Front, studio re-shoot (image sweep 21/10, IMAGE_SPEC §0 item 7) of the retailer's Muro Freebase poster.",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a retailer's Muro Freebase poster",
        sourceUrl: "https://ihavevape.net/product/muro-freebase/",
      },
    ],
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-grape-wm5.webp", alt: "Muro Freebase e-liquid bottle, Grape, studio photo" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-watermelon-wm5.webp", alt: "Muro Freebase e-liquid bottle, Watermelon, studio photo" } },
      { id: "click-mint", name: "Click Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-click-mint-wm5.webp", alt: "Muro Freebase e-liquid bottle, Click Mint, studio photo" } },
      { id: "strawberry-twist", name: "Strawberry Twist", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-strawberry-twist-wm5.webp", alt: "Muro Freebase e-liquid bottle, Strawberry Twist, studio photo" } },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-peach-wm5.webp", alt: "Muro Freebase e-liquid bottle, Peach, studio photo" } },
      { id: "big-cola", name: "Big Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/muro-freebase/variant-big-cola-wm5.webp", alt: "Muro Freebase e-liquid bottle, Big Cola, studio photo" } },
    ],
    specifications: [
      { key: "type", label: "Nicotine type", value: "Freebase", sourceStatus: "verified" },
      { key: "capacity", label: "Bottle size", value: "60mL (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
      // 06/11: printed on the maker's poster ("NICOTINE 4 MG · MADE BY VAPE MAKER"), read from a copy on a shop page, so the row names no URL (row URLs are maker domains only).
      { key: "nicotine", label: "Nicotine strength", value: "4mg", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers who prefer freebase e-liquid in an open-system device."],
    faqs: [],
    relatedProductSlugs: ["muro-salt-nic", "muro-space-15k", "muro-3ml", "muro-sc-8000", "muro-connector-20k"],
    sourceUrls: ["https://vapemun.com/", "https://ihavevape.net/product/muro-freebase/"],
  },
  {
    id: "muro-salt-nic",
    slug: "muro-salt-nic",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "e-liquid",
    systemType: "e-liquid",
    name: "Muro Salt Nic",
    displayName: "Muro Salt Nic",
    // Max read 20/10: ELQ-4 "Muro Salt Nic" ฿250, 6 flavours. Copy says warehouse facts only (bottle size / nicotine rows stay unverified).
    tagline: "Muro salt nic e-liquid.",
    shortDescription: "Muro salt nic e-liquid in 6 flavors.",
    isFlagship: false,
    // Round "queue 0211" articles (02/11): the more-details section (all-flavours grid + the article in product-articles.ts)
    // — a legacy page shows its article only inside it (as muro-sc-8000).
    storyDetails: true,
    attributes: {
      capacityMl: 30,
      liquidBase: "salt-nic",
      beginnerFriendly: false,
    },
    // maxlist 20/10: card = Grape; every flavour = an OKami24 studio re-shoot (Higgsfield) of that bottle on the shop's six-bottle poster
    // (IMAGE_SPEC §0 item 7) — source, prompt and check per file in scripts/process-images.map.json `aiRender`.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-salt-nic/card-wm5.webp",
        alt: "Muro Salt Nic e-liquid bottle, Grape, studio photo",
        angle: "Front, studio re-shoot (maxlist 20/10, IMAGE_SPEC §0 item 7) of the shop's six-bottle poster.",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the shop's Muro Saltnic poster",
        sourceUrl: "https://pod789.com/product/muro-saltnic/",
      },
    ],
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-grape-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Grape, studio photo" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-watermelon-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Watermelon, studio photo" } },
      { id: "click-mint", name: "Click Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-click-mint-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Click Mint, studio photo" } },
      { id: "strawberry-twist", name: "Strawberry Twist", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-strawberry-twist-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Strawberry Twist, studio photo" } },
      { id: "big-cola", name: "Big Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-big-cola-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Big Cola, studio photo" } },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown", image: { src: "/assets/products/muro-salt-nic/variant-peach-wm5.webp", alt: "Muro Salt Nic e-liquid bottle, Peach, studio photo" } },
    ],
    specifications: [
      { key: "type", label: "Nicotine type", value: "Salt nicotine", sourceStatus: "verified" },
      { key: "capacity", label: "Bottle size", value: "30mL (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
      // 06/11: printed on the maker's poster ("NICOTINE 28 MG · SALT · MADE BY VAPE MAKER"), read from a copy on a shop page, so the row names no URL (row URLs are maker domains only).
      { key: "nicotine", label: "Nicotine strength", value: "28mg", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers who prefer salt nicotine e-liquid in a pod device."],
    faqs: [],
    relatedProductSlugs: ["muro-freebase", "muro-space-15k", "muro-3ml", "muro-sc-8000", "muro-connector-20k"],
    sourceUrls: ["https://vapemun.com/"],
  },
  {
    // Round popular models 07/11: searched (vazer reload 15k 590 a month), not in the warehouse, no price, no cart, no maker site found. Owner 07/11: a fact only where
    // 3 independent shops agree, in the copy, never a spec row. Raw pages read 07/11: goatvapethai · maneevp + yaivapestore (shared wording, 1 shop) · ezy-pods + vppods (shared
    // template, 1 shop) · 7pods: 15,000 puffs, 600mAh, 18mL, 3%, USB-C, a pre-filled head that swaps. The 15 flavours = the brand's own chart on 7pods and maneevp.
    // Not agreed, so not written: "cannot be refilled" (2 shops), weight.
    id: "vazer-reload-15k",
    slug: "vazer-reload-15k",
    brandId: "Unbranded",
    familyId: "Vazer",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Vazer Reload 15K",
    displayName: "VAZER RELOAD 15K",
    searchAliases: ["Vazer Reload","Vazer 15K","Vazer 15000","Vazer Reload 15000"],
    tagline: "A device with a pre-filled head you can swap for another flavour.",
    shortDescription:
      "A pre-filled head sits on the device, so you change the head when you want another flavour. Pick from the flavours below.",
    isFlagship: false,
    attributes: {
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/vazer-reload-15k/card-wm5.webp",
        alt: "Vazer Reload 15K, black body with a red Watermelon Slushie head, front view",
        angle: "front, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/vazer-reload-15k",
      },
    ],
    flavorVariants: [
      { id: "apple-fuji", name: "Apple Fuji", swatchHex: "#d9394e", availability: "unknown" },
      { id: "blueberry", name: "Blueberry", swatchHex: "#2a56b0", availability: "unknown" },
      { id: "cool-mint", name: "Cool Mint", swatchHex: "#8fd6e8", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#b0359e", availability: "unknown" },
      { id: "grape-osaka", name: "Grape Osaka", swatchHex: "#5b3a9e", availability: "unknown" },
      { id: "ice-grape", name: "Ice Grape", swatchHex: "#5b3a9e", availability: "unknown" },
      { id: "lemon-soda", name: "Lemon Soda", swatchHex: "#f2d04a", availability: "unknown" },
      { id: "lychee", name: "Lychee", swatchHex: "#e0407f", availability: "unknown" },
      { id: "malibu", name: "Malibu", swatchHex: "#f2d04a", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#d4a7d4", availability: "unknown" },
      { id: "original-cola", name: "Original Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "peach-paradise", name: "Peach Paradise", swatchHex: "#ef6a5a", availability: "unknown" },
      { id: "root-beer", name: "Root Beer", swatchHex: "#7a4a24", availability: "unknown" },
      { id: "strawberry-candy", name: "Strawberry Candy", swatchHex: "#f2a7bb", availability: "unknown" },
      { id: "watermelon-slushie", name: "Watermelon Slushie", swatchHex: "#e4305a", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "15,000", sourceStatus: "unverified" }],
    features: [
      { id: "swap", title: "Change the head, keep the body", description: "The liquid sits in a pre-filled head, so a new flavour only takes a new head." },
      { id: "air", title: "Airflow and charging", description: "The brand's chart lists airflow control, a mesh coil, USB-C charging and a lanyard in the box." },
      { id: "figures", title: "The figures shops agree on", description: "The maker has no site we could find, so these come from shops that sell it and agree: 15,000 puffs, 18mL, a 600mAh battery, 3% nicotine and USB-C charging." },
    ],
    compatibility: [],
    whoIsThisFor: ["You came looking for the Vazer Reload by name, or you want to change flavour without changing the device."],
    faqs: [],
    relatedProductSlugs: [],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/vazer-reload-15k"],
  },
  {
    // Round popular models 07/11: searched (86 bar 20k 480 a month), not in the warehouse, no price, no cart, no maker site found. Owner 07/11: a fact only where 3 independent
    // shops agree, in the copy, never a spec row. Raw pages read 07/11: maneevp · ezy-pods + vppods (shared template, 1 shop) · 7pods: 20,000 puffs, 600mAh, 3%, USB-C, these 13
    // flavours. Not agreed, so not written: liquid (1 shop), the six flavours and the 5% versions only ezy-pods + vppods list.
    id: "86-bar-20k",
    slug: "86-bar-20k",
    brandId: "Unbranded",
    familyId: "86 Bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "86 Bar 20K",
    displayName: "86 BAR 20K",
    searchAliases: ["86 Bar","86bar","86 Bar 20000"],
    tagline: "A disposable with a display and adjustable airflow.",
    shortDescription:
      "A disposable with a mesh coil, a display and airflow you can set. Pick from the flavours below.",
    isFlagship: false,
    attributes: {
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/86-bar-20k/card-wm5.webp",
        alt: "86 Bar 20K, slim black body with a neon 86 face, front view",
        angle: "front, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/86-bar-20k",
      },
    ],
    flavorVariants: [
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#4a7fd9", availability: "unknown" },
      { id: "coco-pine", name: "Coco Pine", swatchHex: "#e6c65a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#7a3fb0", availability: "unknown" },
      { id: "lemon-cola", name: "Lemon Cola", swatchHex: "#c9a227", availability: "unknown" },
      { id: "lychee", name: "Lychee", swatchHex: "#e0407f", availability: "unknown" },
      { id: "magic-mango", name: "Magic Mango", swatchHex: "#f2a93b", availability: "unknown" },
      { id: "mint-freeze", name: "Mint Freeze", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#d4a7d4", availability: "unknown" },
      { id: "oishi-green-tea", name: "Oishi Green Tea", swatchHex: "#6fa84a", availability: "unknown" },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#e4476a", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e4305a", availability: "unknown" },
      { id: "watermelon-mint", name: "Watermelon Mint", swatchHex: "#e0506a", availability: "unknown" },
      { id: "watermelon-strawberry", name: "Watermelon Strawberry", swatchHex: "#e4576a", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "20,000", sourceStatus: "unverified" }],
    features: [
      { id: "setup", title: "Mesh coil, display, airflow", description: "Shops that sell it list a mesh coil, a display and airflow you can adjust." },
      { id: "figures", title: "The figures shops agree on", description: "The maker has no site we could find, so these come from shops that sell it and agree: 20,000 puffs, a 600mAh battery, 3% nicotine and USB-C charging." },
    ],
    compatibility: [],
    whoIsThisFor: ["You came looking for the 86 Bar by name, or you want a high-puff disposable you can adjust."],
    faqs: [],
    relatedProductSlugs: [],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/86-bar-20k"],
  },
];
