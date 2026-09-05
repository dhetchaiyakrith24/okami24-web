import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const relxProducts: Product[] = [
  {
    id: "relx-smash-go-12k",
    slug: "relx-smash-go-12k",
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Smash Go 12K",
    displayName: "RELX SMASH GO 12K",
    tagline: "RELX's official high-puff disposable, MEGA MESH coil.",
    shortDescription:
      "A 12,000-puff rechargeable disposable from RELX's own official global lineup — 400mAh battery, a 1.0Ω MEGA MESH coil, and a 10-flavor range confirmed directly on relxnow.com.",
    isFlagship: true,
    editorialTag: "Tier-1 priority",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "0b6Q9DzWrRQ", title: "RELX SMASH GO 12K ง่าย แต่ ดี!", channelName: "POD SYSTEM OKAMI II" },
    attributes: {
      batteryMah: 400,
      puffCount: 12000,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-smash-go-12k/card.webp",
        alt: "RELX Smash Go 12K, Grape colourway, isolated product shot",
        angle: "Front, isolated — official RELX product photography, background-removed by OKami24 (adaptive flood-fill from the source's white studio background, feathered edge, tightly trimmed).",
        transparentBackground: true,
        sourceName: "RELX (official brand site, relxnow.com)",
        sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03). All 10 names AND their
    // own dedicated device photos are directly confirmed on relxnow.com's own Smash Go 12K product
    // page (Shopify `featured_image`/`variants` data, filenames `RELX_SMASH_GO_12K_<Flavor>.jpg`) —
    // genuine Tier-1 official evidence, the strongest of any product added this mission. Every
    // photo passed this catalog's QC standard after background removal (no watermark, no clutter,
    // sharp, correctly identified). `availability: "unknown"` — this product has no Shipnity
    // integration (newly admitted to the catalog this mission, not yet in operational stock data).
    flavorVariants: [
      { id: "apple", name: "Apple", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/apple.webp", alt: "RELX Smash Go 12K, Apple" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/cola.webp", alt: "RELX Smash Go 12K, Cola" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/double-mint.webp", alt: "RELX Smash Go 12K, Double Mint" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/grape.webp", alt: "RELX Smash Go 12K, Grape" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/grape-lychee.webp", alt: "RELX Smash Go 12K, Grape Lychee" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "green-mango", name: "Green Mango", swatchHex: "#a8c53e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/green-mango.webp", alt: "RELX Smash Go 12K, Green Mango" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/mixberry.webp", alt: "RELX Smash Go 12K, Mixberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/passion-fruit.webp", alt: "RELX Smash Go 12K, Passion Fruit" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/peach-strawberry.webp", alt: "RELX Smash Go 12K, Peach Strawberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variants/watermelon.webp", alt: "RELX Smash Go 12K, Watermelon" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 12,000", sourceStatus: "verified" },
      { key: "battery", label: "Battery", value: "400mAh rechargeable, USB-C", sourceStatus: "verified" },
      { key: "coil", label: "Coil", value: "MEGA MESH coil, 1.0Ω", sourceStatus: "verified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% or 5% nicotine salt", sourceStatus: "verified" },
      { key: "capacity", label: "E-liquid capacity", value: "Not independently confirmed (official page text was ambiguous between 18mL and 20mL)", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "official-lineup",
        title: "RELX's own official Smash Go line",
        description: "Unlike several disposables in this category, Smash Go 12K's exact identity, specs, and flavor lineup are confirmed directly on RELX's own global site — not inferred from a retailer.",
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: ["Vapers who want a disposable from a large, internationally-recognized brand with a fully documented official flavor range."],
    faqs: [],
    relatedProductSlugs: ["relx-creator"],
    sourceUrls: ["https://www.relxnow.com/products/relx-smash-go-12k"],
  },
  {
    id: "relx-creator",
    slug: "relx-creator",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4); also which RELX Creator generation is stocked is still unconfirmed" },
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Creator",
    displayName: "RELX CREATOR",
    tagline: "A real RELX generational line — current stock needs an owner check.",
    shortDescription:
      "A real, RELX-manufactured high-puff disposable line sold in the Thai/regional market — genuinely NOT the same thing as RELX's official international \"Creator\" line (a refillable Creator Pro Device + Creator Pod cartridge system, ~5,000 puffs/pod). Deeper research (2026-09-03) found this is a real generational chain — 18K (original) → Clear Pod 18K → Boost 20K → 22K (current, \"รุ่นใหม่อัพเกรด\") — not a naming mix-up; OKami24's own two review videos map to two different real points in that same chain. What's still open: whether OKami24 currently stocks the 18K pod alongside the 22K device, or has moved on to 22K only.",
    isFlagship: false,
    editorialTag: "Confirm current stock",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "HKwsShRoo78", title: "RELX CREATOR 22K รุ่นใหม่อัพเกรด ใหญ่ จุใจ!", channelName: "POD SYSTEM OKAMI II" },
    attributes: {
      batteryMah: 800,
      puffCount: 22000,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // NO card asset yet, deliberately. RELX's OFFICIAL "Creator" product photography (relxnow.com/
    // collections/relx-creator) shows the Creator Pro Device + Pod SYSTEM, a physically different
    // product from the "18000 puffs" single-use disposable sold under this name in Thailand — using
    // that photo here would misrepresent this record's actual hardware. No confidently-matching
    // exact photo of the Thai-market "18000 puffs" unit was found from a source strong enough to
    // pass this catalog's identity-confidence bar. Falls back to the illustrated glyph honestly.
    assets: [],
    // Real generational chain confirmed (2026-09-03, second research pass): 18K (original, Mega
    // Mesh) → "Creator Pod Clear 18K" (dual mesh, clear body, Freshness Lock) → "Creator Boost
    // 20K" (adjustable power modes) → "Creator 22K" (dual mesh, 5 power modes 12-22W, 800mAh,
    // ~17mL) — corroborated across 10+ China-domestic/Thai/SG resellers, tier-4 confidence (no
    // official RELX Thai/SEA site exists to reach tier-1: relxthailand.com is parked, relx.co.th
    // not found). Modeled here as the 22K generation since that is the current top model per
    // OKami24's own "รุ่นใหม่อัพเกรด" (new upgraded model) review video. The 18K generation is
    // NOT a separate catalog entry — owner should confirm whether it's still separately stocked.
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "22,000 (current generation per retailer convergence + OKami24's own \"รุ่นใหม่อัพเกรด\" review)", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "~800mAh rechargeable, USB-C", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "~17mL (retailer figures vary)", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Dual mesh coil, 5 power modes (12-22W)", sourceStatus: "unverified" },
      { key: "modes", label: "Power modes", value: "5 selectable output modes (retailer-stated)", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Existing RELX Creator customers looking for real specs and flavor confirmation while OKami24 finishes verifying this listing."],
    faqs: [
      {
        id: "relx-creator-naming",
        question: "ทำไมข้อมูลรุ่นนี้ยังไม่ยืนยันครบ?",
        answer:
          "\"RELX Creator\" ที่ขายในไทยเป็นคนละรุ่นกับ \"RELX Creator\" บนเว็บทางการนานาชาติของ RELX (ระบบพอตเปลี่ยนหัว ~5,000 พัฟ/หัว) — ค้นเพิ่มพบว่าเป็นสายรุ่นจริง 18K → Clear Pod 18K → Boost 20K → 22K (รุ่นล่าสุด) ไม่ใช่ความสับสนชื่อ คลิปรีวิวของ OKami24 ทั้ง 2 คลิปตรงกับ 2 รุ่นจริงในสายนี้ สิ่งที่ยังต้องยืนยันจากพี่คือร้านยังขายพอต 18K ควบคู่กับเครื่อง 22K อยู่ไหม หรือเปลี่ยนไป 22K อย่างเดียวแล้ว",
      },
    ],
    relatedProductSlugs: ["relx-smash-go-12k"],
    sourceUrls: ["https://www.relxnow.com/collections/relx-creator"],
  },
];
