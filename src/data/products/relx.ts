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
      "A 12,000-puff rechargeable disposable from RELX's own official global lineup — 400mAh battery, a MEGA MESH coil, and a 10-flavor range confirmed directly on relxnow.com.",
    isFlagship: true,
    // Round 30.4 ก8 (owner 2026-09-13): was "Tier-1 priority" — an internal note. The home
    // flagship rail shows this card next to three "รุ่นเรือธง" badges, and the data already says
    // isFlagship, so the label follows. hasEditorialTag stays true → card order unchanged.
    editorialTag: "Flagship",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "0b6Q9DzWrRQ", title: "RELX SMASH GO 12K ง่าย แต่ ดี!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-02" },
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
        angle: "Front, isolated — official RELX product photography (relxnow.com Shopify files, native 1224×1224), background-removed by OKami24. Re-processed 2026-09-06 (LAUNCH_AUDIT 11) through scripts/process-images.ts from the native files: device ≈722px on the 1000px canvas (was 712px with JPEG artefacts). 1224px is the largest original RELX publishes; the owner lifted the 800px floor on 2026-09-06 (largest real original, no upscaling). Sources: _incoming/relx-smash-go-12k/SOURCE.md",
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
      { id: "apple", name: "Apple", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-apple.webp", alt: "RELX Smash Go 12K, Apple" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-cola.webp", alt: "RELX Smash Go 12K, Cola" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint.webp", alt: "RELX Smash Go 12K, Double Mint" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape.webp", alt: "RELX Smash Go 12K, Grape" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-lychee.webp", alt: "RELX Smash Go 12K, Grape Lychee" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "green-mango", name: "Green Mango", swatchHex: "#a8c53e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-green-mango.webp", alt: "RELX Smash Go 12K, Green Mango" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry.webp", alt: "RELX Smash Go 12K, Mixberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-passion-fruit.webp", alt: "RELX Smash Go 12K, Passion Fruit" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-peach-strawberry.webp", alt: "RELX Smash Go 12K, Peach Strawberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon.webp", alt: "RELX Smash Go 12K, Watermelon" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): relxnow.com "Specifications" — Battery 400mAh · Size 20ml · Charging Port
      // Type-C · Puffs 12000 · Nicotine 3% / 5% · "Upgraded Mega MESH". It states no resistance, so "1.0Ω" is dropped;
      // "Size 20ml" now settles the capacity row that was left unverified as 18-vs-20mL.
      { key: "puffs", label: "Rated puffs", value: "Up to 12,000", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "battery", label: "Battery", value: "400mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "coil", label: "Coil", value: "MEGA MESH coil", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "nicotine", label: "Nicotine strength", value: "3% or 5% nicotine salt", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "capacity", label: "E-liquid capacity", value: "20mL", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
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
    // Re-published 2026-09-30 (round "image-sitewide", owner ruling §16 item 4 (20)+(21) and chat answer 30/09): NOT a
    // disposable — the device of a CLOSED pod system, sold alone (Shipnity Pod-138 "Relx Creator (เครื่อง)"); the device
    // with the screen = RELX's own "Creator Pro Device" (relxnow.com), so RELX's official specs apply; it takes RELX
    // Creator 20K pods and Muro Connector pods (owner, from the shop's stock). The owner shows the 2 colours the shop sells
    // (grey with a yellow base, first; black, later) — RELX's global store lists Black / White / Green / Yellow; the
    // grey-and-yellow edition is not on that list (a regional edition — owner's photo).
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "RELX Creator",
    displayName: "RELX CREATOR",
    tagline: "RELX's Creator Pro device — pods sold separately.",
    shortDescription:
      "The RELX Creator Pro device on its own: an 800mAh USB-C battery with a pixel smart screen, 15W / 25W at a double click and adjustable airflow. A closed pod system — fit a prefilled pod, swap the pod when it runs out and keep the device. Takes RELX Creator 20K pods and Muro Connector pods.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "HKwsShRoo78", title: "RELX CREATOR 22K รุ่นใหม่อัพเกรด ใหญ่ จุใจ!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-02" },
    attributes: {
      batteryMah: 800,
      wattageMax: 25,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Photos (2026-09-30): the grey-and-yellow device = a Higgsfield 4K remake of the owner's own photo (3/4 view); black =
    // the same pose with RELX's official black render for the colours (the owner OK'd RELX's photos); the card = the
    // grey-and-yellow one tilted. Source + check per file in scripts/process-images.map.json `aiRender`.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-creator/card.webp",
        alt: "RELX Creator Pro device, grey body with a yellow base and pixel smiley screen, tilted",
        angle: "3/4, tilted",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the owner's photo",
        sourceUrl: "https://relxnow.com/products/relx-creator-pro-device",
      },
    ],
    openOnCardPhoto: true,
    colorVariants: [
      { id: "grey-yellow", name: "Grey Yellow", swatchHex: "#c9c9cb", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-grey-yellow.webp", alt: "RELX Creator Pro device, grey with a yellow base" } },
      { id: "black", name: "Black", swatchHex: "#2b2b2d", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-black.webp", alt: "RELX Creator Pro device, black" }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
    ],
    // RELX's own Creator Pro Device page (relxnow.com, read 2026-09-30): 800mAh, Type-C fast charging, one button — one
    // click = battery, double click = 15W Normal / 25W Boost, a smart screen with 100+ emojis, full-range adjustable
    // airflow. Pods: RELX says "RELX Creator Pods"; the owner (30/09, the shop's own stock) says it takes RELX Creator 20K
    // pods and Muro Connector pods — the owner's word, a named exception to THAI_STYLE §5 "manufacturer only".
    specifications: [
      { key: "format", label: "Format", value: "Device only — prefilled pods sold separately", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "battery", label: "Battery", value: "800mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "modes", label: "Power modes", value: "15W Normal / 25W Boost, double click to switch", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "screen", label: "Display", value: "Pixel smart screen with emoji faces; one click shows the battery", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "compat", label: "Pod platform", value: "RELX Creator 20K pods, Muro Connector pods (shop-confirmed)", sourceStatus: "verified" },
    ],
    features: [],
    // The pod rows are the owner's word (shop stock, 30/09); the spec row and the FAQ say "shop-confirmed".
    compatibility: [
      { type: "pod", label: "RELX Creator 20K pod" },
      { type: "pod", label: "Muro Connector pod" },
      typeC,
    ],
    whoIsThisFor: ["Vapers who want a device they keep, with prefilled pods they swap instead of filling e-liquid."],
    faqs: [
      {
        id: "relx-creator-pods",
        question: "Which pods fit the RELX Creator?",
        answer: "RELX Creator 20K pods and Muro Connector pods — the shop confirmed both from its own stock. For any other pod, ask on LINE @okm24 first.",
      },
    ],
    relatedProductSlugs: ["muro-connector-20k", "relx-smash-go-12k"],
    sourceUrls: ["https://relxnow.com/products/relx-creator-pro-device"],
  },
];
