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
      "A disposable vape from the Muro \"Space\" line, rated for up to 15,000 puffs, currently stocked in 5 flavors.",
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
    id: "muro-3ml",
    slug: "muro-3ml",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "pods-cartridges",
    systemType: "pod-cartridge",
    name: "Muro 3ML",
    displayName: "Muro 3ML",
    tagline: "A 3mL prefilled pod cartridge.",
    shortDescription: "A 3mL prefilled replacement pod cartridge from the Muro line, available in 14 flavors.",
    isFlagship: false,
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
        src: "/assets/products/muro-3ml/variants/grape-hd.webp",
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
        image: { src: "/assets/products/muro-3ml/variants/grape-hd.webp", alt: "Muro 3ML, Grape flavor box" },
      },
      {
        id: "watermelon",
        name: "Watermelon",
        swatchHex: "#d94f6b",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/watermelon-hd.webp", alt: "Muro 3ML, Watermelon flavor box" },
      },
      {
        id: "smooth-mint",
        name: "Smooth Mint",
        swatchHex: "#4ec9a0",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/smooth-mint-hd.webp", alt: "Muro 3ML, Smooth Mint flavor box" },
      },
      {
        id: "green-slush",
        name: "Green Slush",
        swatchHex: "#5ec95e",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/green-slush-hd.webp", alt: "Muro 3ML, Green Slush flavor box" },
      },
      {
        id: "mix-berries",
        name: "Mix Berries",
        swatchHex: "#8e3a6b",
        availability: "unknown",
        image: { src: "/assets/products/muro-3ml/variants/mix-berries-hd.webp", alt: "Muro 3ML, Mix Berries flavor box" },
      },
      {
        id: "blueberry-bubblegum",
        name: "Blueberry Bubblegum",
        swatchHex: "#8a5ac9",
        availability: "unknown",
        image: {
          src: "/assets/products/muro-3ml/variants/blueberry-bubblegum-hd.webp",
          alt: "Muro 3ML, Blueberry Bubblegum flavor box",
        },
      },
      { id: "muro-grape", name: "Muro Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/muro-grape-hd.webp", alt: "Muro 3ML, Muro Grape flavor box" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d9b23a", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/honey-lemon-hd.webp", alt: "Muro 3ML, Honey Lemon flavor box" } },
      { id: "very-strawberry", name: "Very Strawberry", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/very-strawberry-hd.webp", alt: "Muro 3ML, Very Strawberry flavor box" } },
      { id: "double-shisha", name: "Double Shisha", swatchHex: "#7a5a2f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/double-shisha-hd.webp", alt: "Muro 3ML, Double Shisha flavor box" } },
      { id: "apple-juice", name: "Apple Juice", swatchHex: "#9e1b32", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/apple-juice-hd.webp", alt: "Muro 3ML, Apple Juice flavor box" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#2a8fd6", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/mineral-water-hd.webp", alt: "Muro 3ML, Mineral Water flavor box" } },
      { id: "strawberry-peach", name: "Strawberry Peach", swatchHex: "#d23a5a", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/strawberry-peach-hd.webp", alt: "Muro 3ML, Strawberry Peach flavor box" } },
      { id: "cola", name: "Cola", swatchHex: "#a3201f", availability: "unknown", image: { src: "/assets/products/muro-3ml/variants/cola-hd.webp", alt: "Muro 3ML, Cola flavor box" } },
    ],
    specifications: [{ key: "capacity", label: "Capacity", value: "3mL", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Owners of a compatible pod device restocking flavor cartridges."],
    faqs: [],
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
      "A rechargeable disposable from the Muro \"SC\" line, with a 600mAh battery and USB-C charging, rated for up to 8,000 puffs and currently stocked in 12 flavors.",
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
        src: "/assets/products/muro-sc-8000/card-v2.webp",
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
      { id: "extreme-menthol", name: "Extreme Menthol", swatchHex: "#0d0e22", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-extreme-menthol.webp", alt: "Muro SC 8000 Puffs, Extreme Menthol — device with its pouch" } },
      { id: "cola", name: "Cola", swatchHex: "#6b1c0f", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-cola.webp", alt: "Muro SC 8000 Puffs, Cola — device with its pouch" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#a9201e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-strawberry.webp", alt: "Muro SC 8000 Puffs, Strawberry — device with its pouch" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d0bf1e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-honey-lemon.webp", alt: "Muro SC 8000 Puffs, Honey Lemon — device with its pouch" } },
      { id: "apple-shisha", name: "Apple Shisha", swatchHex: "#6f0e18", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-apple-shisha.webp", alt: "Muro SC 8000 Puffs, Apple Shisha — device with its pouch" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#96b8bf", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-mineral-water.webp", alt: "Muro SC 8000 Puffs, Mineral Water — device with its pouch" } },
      { id: "yakult", name: "Yakult", swatchHex: "#d3bea8", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-yakult.webp", alt: "Muro SC 8000 Puffs, Yakult — device with its pouch" } },
      { id: "banana-strawberry", name: "Banana Strawberry", swatchHex: "#c48592", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-banana-strawberry.webp", alt: "Muro SC 8000 Puffs, Banana Strawberry — device with its pouch" } },
      { id: "grape", name: "Grape", swatchHex: "#5a1a6b", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-grape.webp", alt: "Muro SC 8000 Puffs, Grape — device with its pouch" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e60435", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-watermelon.webp", alt: "Muro SC 8000 Puffs, Watermelon — device with its pouch" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#56a4ad", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-double-mint.webp", alt: "Muro SC 8000 Puffs, Double Mint — device with its pouch" } },
      { id: "mix-berries", name: "Mix Berries", swatchHex: "#6b0f2e", availability: "unknown", image: { src: "/assets/products/muro-sc-8000/variant-mix-berries.webp", alt: "Muro SC 8000 Puffs, Mix Berries — device with its pouch" } },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 8,000", sourceStatus: "verified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [{ type: "charging", label: "USB-C", note: "Rechargeable via USB-C." }],
    whoIsThisFor: ["Vapers who want a rechargeable disposable rather than a single-charge unit."],
    faqs: [],
    relatedProductSlugs: ["muro-space-15k", "muro-3ml", "muro-connector-20k", "muro-freebase", "muro-salt-nic"],
    // Exact confirmed product path (this session's research fetched this page directly).
    sourceUrls: ["https://vapemun.com/product/muro-sc-8k/", "https://pod789.com/product/muro-sc-8k/"],
  },
  {
    id: "muro-connector-20k",
    slug: "muro-connector-20k",
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Muro Connector 20K",
    displayName: "Muro Connector 20K",
    tagline: "A high-puff-count disposable rated for up to 20,000 puffs.",
    shortDescription:
      "A disposable vape from the Muro \"Connector\" line, rated for up to 20,000 puffs, currently stocked in 20 flavors.",
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
      chargingType: "Not independently confirmed",
    },
    // Real, watermark-free retailer photo (vapemun.com's own listing, filename "muro-lego-20k" —
    // a retailer nickname for the honeycomb-pattern shell, not a claim of a different official
    // product name). Device is printed "MURO" with a "Mineral Water" flavor label, matching one of
    // this record's own 20 real flavors exactly — strong identity confidence despite the nickname.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/muro-connector-20k/card-v3.webp",
        alt: "Muro Connector 20K, Mineral Water, three-quarter view",
        angle: "Three-quarter, isolated",
        transparentBackground: true,
        // Image-fix round 2026-09-29: sharp remake of the 179-px retailer card (owner OK); source + check in the map.
        // Round "image-sitewide" 2026-09-30 (owner: "ไม่สวย ไม่คม ขนาดดูไม่สมมาตร"): card-v3 = a 4K remake, tilted, on the
        // 4:5 card standard (card-v2 was on the old square canvas); new name, lesson พ6.
        sourceName: "OKami24 render (Higgsfield) from the vapemun.com retailer photo + OKAMI's own clip",
        sourceUrl: "https://vapemun.com/product/muro-connector-20k/",
      },
    ],
    // Flavour photos show the printed-label side only; the card (front, honeycomb face) stays the first photo.
    openOnCardPhoto: true,
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-grape-v2.webp", alt: "Muro Connector 20K, Grape" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-watermelon-v2.webp", alt: "Muro Connector 20K, Watermelon" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-double-mint-v2.webp", alt: "Muro Connector 20K, Double Mint" } },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-cola-v2.webp", alt: "Muro Connector 20K, Cola" } },
      { id: "mix-berries", name: "Mix Berries", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-mix-berries-v2.webp", alt: "Muro Connector 20K, Mix Berries" } },
      { id: "pineapple", name: "Pineapple", swatchHex: "#e0c93a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-pineapple-v2.webp", alt: "Muro Connector 20K, Pineapple" } },
      { id: "honey-lemon", name: "Honey Lemon", swatchHex: "#d9b23a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-honey-lemon-v2.webp", alt: "Muro Connector 20K, Honey Lemon" } },
      { id: "apple-baraku", name: "Apple Baraku", swatchHex: "#7ab84a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-apple-baraku-v2.webp", alt: "Muro Connector 20K, Apple Baraku" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#cfe8ee", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-mineral-water-v2.webp", alt: "Muro Connector 20K, Mineral Water" } },
      { id: "yakult", name: "Yakult", swatchHex: "#f0e4c0", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-yakult-v2.webp", alt: "Muro Connector 20K, Yakult" } },
      { id: "banana-strawberry", name: "Banana Strawberry", swatchHex: "#e0a05a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-banana-strawberry-v2.webp", alt: "Muro Connector 20K, Banana Strawberry" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-kyoho-grape-v2.webp", alt: "Muro Connector 20K, Kyoho Grape" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-pink-berry-v2.webp", alt: "Muro Connector 20K, Pink Berry" } },
      { id: "lemon-jeez", name: "Lemon Jeez", swatchHex: "#d9d13a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-lemon-jeez-v2.webp", alt: "Muro Connector 20K, Lemon Jeez" } },
      { id: "cool-mint", name: "Cool Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-cool-mint-v2.webp", alt: "Muro Connector 20K, Cool Mint" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-blue-ice-v2.webp", alt: "Muro Connector 20K, Blue Ice" } },
      { id: "green-tea", name: "Green Tea", swatchHex: "#7a8a4a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-green-tea-v2.webp", alt: "Muro Connector 20K, Green Tea" } },
      { id: "strawberry-peach", name: "Strawberry Peach", swatchHex: "#e08a7a", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-strawberry-peach-v2.webp", alt: "Muro Connector 20K, Strawberry Peach" } },
      { id: "vanilla-ice-cream", name: "Vanilla Ice Cream", swatchHex: "#e8d9b8", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-vanilla-ice-cream-v2.webp", alt: "Muro Connector 20K, Vanilla Ice Cream" } },
      { id: "taro-ice-cream", name: "Taro Ice Cream", swatchHex: "#9a7ab8", availability: "unknown", image: { src: "/assets/products/muro-connector-20k/variant-taro-ice-cream-v2.webp", alt: "Muro Connector 20K, Taro Ice Cream" } },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "Up to 20,000", sourceStatus: "verified" }],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers looking for a high-puff-count disposable with an extensive flavor lineup."],
    faqs: [],
    relatedProductSlugs: ["muro-space-15k", "muro-3ml", "muro-sc-8000", "muro-freebase", "muro-salt-nic"],
    sourceUrls: ["https://vapemun.com/"],
  },
  {
    id: "foli-bar-15k",
    slug: "foli-bar-15k",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4); no source photo matches this exact 9-flavour SKU" },
    brandId: "Unbranded",
    familyId: "Foli Bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Foli Bar 15K",
    displayName: "Foli Bar 15K",
    tagline: "A disposable vape rated for up to 15,000 puffs.",
    shortDescription: "A disposable vape from the Foli \"Bar\" line, rated for up to 15,000 puffs, currently stocked in 9 flavors.",
    isFlagship: false,
    attributes: {
      puffCount: 15000,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "Not independently confirmed",
    },
    assets: [],
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown" },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3a4a8e", availability: "unknown" },
      { id: "cola-ice", name: "Cola Ice", swatchHex: "#3a2a30", availability: "unknown" },
      { id: "lychee-ice", name: "Lychee Ice", swatchHex: "#f0c0d0", availability: "unknown" },
      { id: "mix-berry", name: "Mix Berry", swatchHex: "#8e3a6b", availability: "unknown" },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#e0708a", availability: "unknown" },
      { id: "red-bull-ice", name: "Red Bull Ice", swatchHex: "#4a90c9", availability: "unknown" },
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
    hiddenFromStorefront: { since: "2026-09-06", reason: "owner decision (LAUNCH_AUDIT item 11): card image shows another website's URL in large text — hidden until a clean photo exists" },
    brandId: "Unbranded",
    familyId: "Vazer",
    categoryId: "pods-cartridges",
    systemType: "pod-cartridge",
    name: "Vazer One",
    displayName: "Vazer One",
    tagline: "A prefilled replacement pod.",
    shortDescription: "A prefilled replacement pod from the Vazer line, currently stocked in 3 flavors.",
    isFlagship: false,
    attributes: {
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    // Real retail-box photography — vazerpod.com's own product photos (redistributed via a Thai
    // retailer's Shopify CDN, pod999th.myshopify.com), found this pass (2026-09-04) now that
    // Google/general-web sourcing is approved for this cluster. Shows the full retail box (the
    // pod itself is visible through the box's own window) rather than a bare isolated pod — no
    // isolated-pod-only photo was found — but this is real, first-party packaging (the box prints
    // "WWW.VAZERPOD.COM" directly on it), same "real packaging is acceptable media" convention
    // already used elsewhere in this catalog (e.g. Coil-89's RINCOE box).
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/vazer-one-pod/variants/cola.webp",
        alt: "Vazer One, Cola flavor, retail box photo",
        angle: "Front, isolated (retail packaging)",
        transparentBackground: true,
        sourceName: "Vazer (redistributed via a Thai retailer's Shopify store)",
        sourceUrl: "https://vazerpod.com/",
      },
    ],
    flavorVariants: [
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variants/cola.webp", alt: "Vazer One, Cola" } },
      { id: "cola-lemon", name: "Cola Lemon", swatchHex: "#6a5a1f", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variants/cola-lemon.webp", alt: "Vazer One, Cola Lemon" } },
      { id: "mango", name: "Mango", swatchHex: "#e08a3a", availability: "unknown", image: { src: "/assets/products/vazer-one-pod/variants/mango.webp", alt: "Vazer One, Mango" } },
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
    shortDescription: "A disposable vape from the Reswa \"Sportcan\" line, rated for up to 12,000 puffs, currently stocked in 3 flavors.",
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
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4); only source is a Facebook album" },
    brandId: "Unbranded",
    familyId: "Next",
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "Next Pro 2 Beyond",
    displayName: "Next Pro 2 Beyond",
    tagline: "A RELX-Infinity-style pod kit with 3 power levels.",
    shortDescription:
      "A pod kit built around a RELX-Infinity-style universal pod connector, with 3 switchable power levels (Soft/Standard/Boost) and a 440mAh battery, currently stocked in 6 colors.",
    isFlagship: false,
    attributes: {
      batteryMah: 440,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [],
    // Real color lineup — all 6 names are genuine Shipnity operational data. Specs (440mAh,
    // USB-C, 3 power levels/LED colors) come from this session's multi-retailer research
    // convergence (10+ independent listings), not a first-party source — kept as verified-enough
    // to state as fact (near-universal agreement across unrelated sellers), same bar already used
    // elsewhere in this catalog for tier-2/3 evidence.
    colorVariants: [
      { id: "razer-black", name: "Razer Black", swatchHex: "#1a1a1a" },
      { id: "supreme-red", name: "Supreme Red", swatchHex: "#b83a3a" },
      { id: "white-lava", name: "White Lava", swatchHex: "#e8e4de" },
      { id: "aurora", name: "Aurora", swatchHex: "#6b8ec9" },
      { id: "lemon-mint", name: "Lemon Mint", swatchHex: "#c9d94b" },
      { id: "twilight-sky", name: "Twilight Sky", swatchHex: "#4a5a9e" },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "440mAh built-in, USB-C", sourceStatus: "unverified" },
      { key: "modes", label: "Power levels", value: "3 (Soft / Standard / Boost)", sourceStatus: "unverified" },
      { key: "pod", label: "Pod connector", value: "RELX-Infinity-style universal pod", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [{ type: "charging", label: "USB-C", note: "Rechargeable via USB-C." }],
    whoIsThisFor: ["Owners of a RELX-Infinity-compatible pod ecosystem wanting an alternative device."],
    faqs: [],
    relatedProductSlugs: [],
    // Only source located this pass is a Facebook photo album (owner-supplied, 2026-09-04) — real
    // and citable, but not a manufacturer or retailer storefront.
    sourceUrls: ["https://www.facebook.com/nonamexxe/photos"],
  },
  {
    id: "muro-freebase",
    slug: "muro-freebase",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4)" },
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "e-liquid",
    systemType: "e-liquid",
    name: "Muro Freebase",
    displayName: "Muro Freebase",
    tagline: "60mL freebase e-liquid.",
    shortDescription: "A freebase e-liquid from the Muro line, currently stocked in 3 flavors.",
    isFlagship: false,
    attributes: {
      capacityMl: 60,
      liquidBase: "freebase",
      beginnerFriendly: false,
    },
    assets: [],
    flavorVariants: [
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown" },
      { id: "big-cola", name: "Big Cola", swatchHex: "#4a2f1f", availability: "unknown" },
    ],
    specifications: [
      { key: "type", label: "Nicotine type", value: "Freebase", sourceStatus: "verified" },
      { key: "capacity", label: "Bottle size", value: "60mL (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "~4mg (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers who prefer freebase e-liquid in an open-system device."],
    faqs: [],
    relatedProductSlugs: ["muro-salt-nic", "muro-space-15k", "muro-3ml", "muro-sc-8000", "muro-connector-20k"],
    sourceUrls: ["https://vapemun.com/"],
  },
  {
    id: "muro-salt-nic",
    slug: "muro-salt-nic",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4)" },
    brandId: "Unbranded",
    familyId: "Muro",
    categoryId: "e-liquid",
    systemType: "e-liquid",
    name: "Muro Salt Nic",
    displayName: "Muro Salt Nic",
    tagline: "30mL salt nicotine e-liquid.",
    shortDescription: "A salt nicotine e-liquid from the Muro line, currently stocked in 6 flavors.",
    isFlagship: false,
    attributes: {
      capacityMl: 30,
      liquidBase: "salt-nic",
      beginnerFriendly: false,
    },
    assets: [],
    flavorVariants: [
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
      { id: "click-mint", name: "Click Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "strawberry-twist", name: "Strawberry Twist", swatchHex: "#c9405f", availability: "unknown" },
      { id: "big-cola", name: "Big Cola", swatchHex: "#4a2f1f", availability: "unknown" },
      { id: "peach", name: "Peach", swatchHex: "#e8a08a", availability: "unknown" },
    ],
    specifications: [
      { key: "type", label: "Nicotine type", value: "Salt nicotine", sourceStatus: "verified" },
      { key: "capacity", label: "Bottle size", value: "30mL (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "~28mg (per retailer research, not independently confirmed)", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers who prefer salt nicotine e-liquid in a pod device."],
    faqs: [],
    relatedProductSlugs: ["muro-freebase", "muro-space-15k", "muro-3ml", "muro-sc-8000", "muro-connector-20k"],
    sourceUrls: ["https://vapemun.com/"],
  },
];
