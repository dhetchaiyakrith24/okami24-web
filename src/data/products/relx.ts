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
        src: "/assets/products/relx-smash-go-12k/card-v2.webp",
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
      { id: "apple", name: "Apple", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-apple-v2.webp", alt: "RELX Smash Go 12K, Apple" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-cola-v2.webp", alt: "RELX Smash Go 12K, Cola" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2.webp", alt: "RELX Smash Go 12K, Double Mint" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-v2.webp", alt: "RELX Smash Go 12K, Grape" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-lychee-v2.webp", alt: "RELX Smash Go 12K, Grape Lychee" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "green-mango", name: "Green Mango", swatchHex: "#a8c53e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-green-mango-v2.webp", alt: "RELX Smash Go 12K, Green Mango" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry-v2.webp", alt: "RELX Smash Go 12K, Mixberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-passion-fruit-v2.webp", alt: "RELX Smash Go 12K, Passion Fruit" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-peach-strawberry-v2.webp", alt: "RELX Smash Go 12K, Peach Strawberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2.webp", alt: "RELX Smash Go 12K, Watermelon" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
    ],
    // Site-wide template round batch 4c (06/10): the G5 template — RELX's own pictures, one per block (blocks.js in
    // _incoming/sitewide-template/4/4c/); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. Cover = RELX's KV.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/relx-smash-go-12k/story-cover.webp", alt: "RELX's Smash Go 12K key visual — supreme taste, five pens", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 2512, height: 1134 },
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
        id: "inside",
        title: "What's inside",
        description: "Up to 12,000 puffs, on a 400mAh battery you can recharge.",
        subline: "RELX shows its coil up close.",
        image: { src: "/assets/products/relx-smash-go-12k/story-inside.webp", alt: "RELX's Smash Go 12K picture — the coil, up close", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 1224, height: 1224 },
      },
      {
        id: "pocket",
        title: "Comfortable to vape, easy to carry",
        description: "It's pocket-sized, so it comes along wherever you go.",
        subline: "RELX designed the mouthpiece to be comfortable on the lips.",
        image: { src: "/assets/products/relx-smash-go-12k/story-pocket.webp", alt: "RELX's Smash Go 12K picture — comfortable mouthpiece design, pocket size", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 1224, height: 1224 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "You want a disposable that's easy to carry and slips into a pocket for the whole day.",
    ],
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
    familyId: "relx-creator",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "RELX Creator",
    displayName: "RELX CREATOR",
    tagline: "RELX's Creator Pro device — pods sold separately.",
    shortDescription:
      "The RELX Creator Pro device on its own: an 800mAh USB-C battery with a pixel smart screen, 15W / 25W at a double click and adjustable airflow. A closed pod system — fit a prefilled pod, swap the pod when it runs out and keep the device. Takes RELX Creator Pods and Muro Connector pods.",
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
    // Photos — image-look roll-out J4 (07/10, G5 bar): Grey Yellow = a studio re-shoot (Higgsfield, IMAGE_SPEC §0 item 8) of
    // the owner's own 3/4 photo; the other four = that render re-made in RELX's own colour renders (same pose, light, logo,
    // smiley); body colours pulled back to RELX's renders by script where the render drifted; own contact shadow kept
    // (ownFloor); card = the Grey Yellow render upright. Source + check per file in scripts/process-images.map.json `aiRender`.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-creator/card-v3.webp",
        alt: "RELX Creator Pro device, grey body with a yellow base and pixel smiley screen, upright three-quarter view",
        angle: "3/4, upright — OKami24 Higgsfield studio re-shoot (IMAGE_SPEC §0 item 8, 07/10)",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the owner's photo",
        sourceUrl: "https://relxnow.com/products/relx-creator-pro-device",
      },
    ],
    // Batch 4f (06/10, owner "publish the draft"): the all-colours image behind the "ทั้งหมด" chip — this page's own 5 colour
    // photos; v4 (07/10 night) = the five colours as one zig-zag group (1/3/5 in front, 2/4 behind) — the one-row v3 left
    // the square half empty at 390 (look-batch/lineup-zig.js --zig --pick).
    lineupImage: {
      src: "/assets/products/relx-creator/lineup-v4.webp",
      alt: "RELX Creator Pro device, all 5 colours — black, white, grey yellow, green, yellow",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    openOnCardPhoto: true,
    colorVariants: [
      { id: "grey-yellow", name: "Grey Yellow", swatchHex: "#c9c9cb", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-grey-yellow-v4.webp", alt: "RELX Creator Pro device, grey with a yellow base", ownFloor: true } },
      { id: "black", name: "Black", swatchHex: "#2b2b2d", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-black-v4.webp", alt: "RELX Creator Pro device, black", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      // Batch 4d-2 (06/10): RELX's other three colours (relxnow.com lists Black / White / Green / Yellow) — catalog completeness;
      // photos = see the "Photos" comment above. The shop's stock is unknown.
      { id: "white", name: "White", swatchHex: "#dcdcdf", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-white-v4.webp", alt: "RELX Creator Pro device, white", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { id: "green", name: "Green", swatchHex: "#cfd796", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-green-v4.webp", alt: "RELX Creator Pro device, green", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { id: "yellow", name: "Yellow", swatchHex: "#e6d19e", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-yellow-v4.webp", alt: "RELX Creator Pro device, yellow", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
    ],
    // RELX's own Creator Pro Device page (relxnow.com, read 2026-09-30): 800mAh, Type-C fast charging, one button — one
    // click = battery, double click = 15W Normal / 25W Boost, a smart screen with 100+ emojis, full-range adjustable
    // airflow. Pods: RELX says "RELX Creator Pods"; the owner (30/09, the shop's own stock) says it takes RELX Creator 20K
    // pods and Muro Connector pods — the owner's word, a named exception to THAI_STYLE §5 "manufacturer only".
    // Site-wide template round batch 4d (06/10): the G5 template — RELX's own pictures, one per block (blocks.js in
    // _incoming/sitewide-template/4/4d/); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. Cover = RELX's UK one-pager.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/relx-creator/story-cover.webp", alt: "RELX's Creator Pro one-pager — ice in every block, the device with a Creator pod, spec strip", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 2604, height: 977 },
    // Phones: RELX's A4 portrait version of the same one-pager — the wide one's tile text is unreadable at 390 (checker #281).
    storyCoverMobile: { src: "/assets/products/relx-creator/story-cover-mobile.webp", alt: "RELX's Creator Pro one-pager, portrait — ice in every block, the device with a Creator pod, spec strip", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1600, height: 2263 },
    specifications: [
      { key: "format", label: "Format", value: "Device only — prefilled pods sold separately", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "battery", label: "Battery", value: "800mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "modes", label: "Power modes", value: "15W Normal / 25W Boost, double click to switch", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "screen", label: "Display", value: "Pixel smart screen with emoji faces; one click shows the battery", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      // No URL on purpose: the owner's word from the shop's stock (30/09) — the named exception in THAI_STYLE §5.
      { key: "compat", label: "Pod platform", value: "RELX Creator Pods, Muro Connector pods (shop-confirmed)", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "button",
        title: "Check the battery any time",
        description: "Check before you head out and you'll know whether there's plenty left or it's nearly flat, without guessing.",
        subline: "RELX set it up so one click shows the battery level on the screen.",
        image: { src: "/assets/products/relx-creator/story-button.webp", alt: "RELX's Creator Pro picture — one click checks the battery on the pixel screen", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
      {
        id: "modes",
        title: "Normal or Boost, your choice",
        description: "Each mode puts a different picture on the screen, so a quick glance tells you which one is on.",
        subline: "RELX set it up so a double click on the button switches between the two.",
        image: { src: "/assets/products/relx-creator/story-modes.webp", alt: "RELX's Creator Pro picture — a double click adjusts power, Normal mode and Boost mode", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
      {
        id: "airflow",
        title: "Set your airflow",
        description: "Open it up for a light, easy draw, or narrow it for a tighter one, and leave it where it feels right.",
        subline: "RELX lets you set the airflow anywhere from fully open to its tightest.",
        image: { src: "/assets/products/relx-creator/story-airflow.webp", alt: "RELX's Creator Pro picture — engineering and airflow, full-range adjustable airflow at the base", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
    ],
    // The pod rows are the owner's word (shop stock, 30/09); the spec row and the FAQ say "shop-confirmed".
    compatibility: [
      { type: "pod", label: "RELX Creator Pod" },
      { type: "pod", label: "Muro Connector pod" },
      typeC,
    ],
    whoIsThisFor: ["Vapers who want a device they keep, with prefilled pods they swap instead of filling e-liquid."],
    faqs: [
      {
        id: "relx-creator-pods",
        question: "Which pods fit the RELX Creator?",
        answer: "RELX Creator Pods and Muro Connector pods — the shop confirmed both from its own stock. For any other pod, ask on LINE @okm24 first.",
      },
    ],
    relatedProductSlugs: ["muro-connector-20k", "relx-smash-go-12k"],
    sourceUrls: ["https://relxnow.com/products/relx-creator-pro-device"],
  },
];
