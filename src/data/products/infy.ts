import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const infyProducts: Product[] = [
  {
    id: "infy-20k",
    slug: "infy-20k",
    // Opened 2026-09-30 (owner, §16 item 4 (19): the baseline hold is lifted for photos, the footer brand list and page
    // body — opening this page adds "INFY" to the footer of every page; titles / meta / H1 / prices of the 7 baseline
    // pages stay as they are until 05/10). Batch 4 had held it hidden for that footer line alone.
    brandId: "infy",
    familyId: "infy-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "INFY 20K",
    displayName: "INFY 20K",
    tagline: "A 20,000-puff rechargeable disposable.",
    shortDescription:
      "A 20,000-puff rechargeable disposable from INFY (This Is Salts), sold on the Thai market. INFY does not list the 20K on its own sites yet; the shop confirms its 20mL capacity and adjustable airflow.",
    isFlagship: false,
    attributes: {
      puffCount: 20000,
      capacityMl: 20,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Round "image-sitewide" batch 4 (2026-09-30, the M Bar 10K treatment). INFY's own sites (infy.my, thisissalts.com)
    // list no 20K, so there is no maker photo; the device art every Thai shop uses (relxth.co, akvapes.com, dood-d.com —
    // the same renders, pouch + device per flavour) is the reference. Every flavour is the same black device; flavours
    // differ only in the outline colour of the white "INFY" letters and the small flavour name under them. One Higgsfield
    // master (Blueberry, from akvapes' clean 800 px device render) → each flavour's outline recoloured by script to the
    // colour read off that flavour's art, and its name printed with a real font (scripts/process-images.map.json
    // `aiRender`; _incoming/image-sitewide/infy/recolour.js). Four art renders show the body grey (screen off); a real
    // photo of Strawberry Banana (dood-d.com) shows the same black body, so every flavour is black here.
    // The card = the same master tilted (a second Higgsfield render). No maker posters exist → no `storyCover` / feature
    // images; the more-details section is the all-flavours grid of the device photos.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/infy-20k/card.webp",
        alt: "INFY 20K disposable, Blueberry, black body, three-quarter view",
        angle: "3/4, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of the device art Thai shops use for this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from retailer art",
        sourceUrl: "https://akvapes.com/",
      },
    ],
    lineupImage: {
      src: "/assets/products/infy-20k/lineup.webp",
      alt: "INFY 20K, five of its 24 flavours side by side, Blueberry in front",
      sourceName: "OKami24 composite",
    },
    // Owner 30/09 (later the same day): the first image is ONE sharp device, like the Caliburn pages — the page opens on
    // the card photo, flavours by swipe or chip; the lineup stays behind the "all" chip (`openOnCardPhoto`, not `lineupFirst`).
    openOnCardPhoto: true,
    storyDetails: true,
    // Flavours: the 18 every rich Thai shop list agrees on (akvapes.com), + Menthol Freeze, Grape Bubblegum, Watermelon
    // Bubblegum (relxth.co, dood-d.com) and Strawberry Ice Cream (dood-d.com) with device art, + Milk Tea Cha and Matcha
    // (vapedumpthailand.store, ihavevape.net — no art anywhere, so no photo and a flavour-tone swatch). INFY publishes no
    // list (catalog completeness rule: every flavour the market shows). The INFY BAR PRO list is a different product.
    // `swatchHex` = the outline colour on the photo (for the two without art: the flavour's tone, FlavorVariant doc).
    flavorVariants: [
      { id: "cola", name: "Cola", swatchHex: "#bc5338", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-cola.webp", alt: "INFY 20K, Cola — device" } },
      { id: "grape-apple", name: "Grape Apple", swatchHex: "#5ebb71", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-grape-apple.webp", alt: "INFY 20K, Grape Apple — device" } },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#97c3b8", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-grape-lychee.webp", alt: "INFY 20K, Grape Lychee — device" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#55438c", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-kyoho-grape.webp", alt: "INFY 20K, Kyoho Grape — device" } },
      { id: "lychee", name: "Lychee", swatchHex: "#dd8db8", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-lychee.webp", alt: "INFY 20K, Lychee — device" } },
      { id: "mint", name: "Mint", swatchHex: "#6dd2dc", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-mint.webp", alt: "INFY 20K, Mint — device" } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#3d539b", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-mixberry.webp", alt: "INFY 20K, Mixberry — device" } },
      { id: "peach", name: "Peach", swatchHex: "#d1cc93", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-peach.webp", alt: "INFY 20K, Peach — device" } },
      { id: "sparkling-lemon", name: "Sparkling Lemon", swatchHex: "#c8b254", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-sparkling-lemon.webp", alt: "INFY 20K, Sparkling Lemon — device" } },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#c43e95", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-strawberry-watermelon.webp", alt: "INFY 20K, Strawberry Watermelon — device" } },
      { id: "watermelon-lychee", name: "Watermelon Lychee", swatchHex: "#bc3743", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-watermelon-lychee.webp", alt: "INFY 20K, Watermelon Lychee — device" } },
      { id: "apple-aloevera", name: "Apple Aloevera", swatchHex: "#8fa450", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-apple-aloevera.webp", alt: "INFY 20K, Apple Aloevera — device" } },
      { id: "blueberry", name: "Blueberry", swatchHex: "#2ae3f9", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-blueberry.webp", alt: "INFY 20K, Blueberry — device" } },
      { id: "grape-aloevera", name: "Grape Aloevera", swatchHex: "#3b3e93", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-grape-aloevera.webp", alt: "INFY 20K, Grape Aloevera — device" } },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#bad0dd", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-mineral-water.webp", alt: "INFY 20K, Mineral Water — device" } },
      { id: "strawberry-banana", name: "Strawberry Banana", swatchHex: "#eccbdd", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-strawberry-banana.webp", alt: "INFY 20K, Strawberry Banana — device" } },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#dced6f", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-strawberry-kiwi.webp", alt: "INFY 20K, Strawberry Kiwi — device" } },
      { id: "yoyo-grape", name: "Yoyo Grape", swatchHex: "#ae4b94", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-yoyo-grape.webp", alt: "INFY 20K, Yoyo Grape — device" } },
      { id: "menthol-freeze", name: "Menthol Freeze", swatchHex: "#6fd1c4", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-menthol-freeze.webp", alt: "INFY 20K, Menthol Freeze — device" } },
      { id: "grape-bubblegum", name: "Grape Bubblegum", swatchHex: "#7b6bba", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-grape-bubblegum.webp", alt: "INFY 20K, Grape Bubblegum — device" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#c96839", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-watermelon-bubblegum.webp", alt: "INFY 20K, Watermelon Bubblegum — device" } },
      { id: "strawberry-ice-cream", name: "Strawberry Ice Cream", swatchHex: "#be6d8e", availability: "unknown", image: { src: "/assets/products/infy-20k/variant-strawberry-ice-cream.webp", alt: "INFY 20K, Strawberry Ice Cream — device" } },
      { id: "milk-tea-cha", name: "Milk Tea Cha", swatchHex: "#c9a27e", availability: "unknown", sourceUrl: "https://www.vapedumpthailand.store/products/infy-20k-disposable-pod-20000-puffs" },
      { id: "matcha", name: "Matcha", swatchHex: "#7ea35a", availability: "unknown", sourceUrl: "https://www.vapedumpthailand.store/products/infy-20k-disposable-pod-20000-puffs" },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 20,000", sourceStatus: "unverified" },
      // Round "image-sitewide" batch 4 (2026-09-30, second research pass, _incoming/image-sitewide/batch4-research.md):
      // INFY lists no 20K; four Thai shops (dood-d.com, hugkwunvape.com, zeedcupvp.com, xn--12cfil8cje7c8brw2evdbz0g4f8a1icd.com) state the same figures
      // for this round-bottle model — 650mAh, 20mL, dual mesh 0.9Ω, adjustable airflow. The 600mAh / 18mL this record had
      // are the bar-shaped INFY BAR PRO 20K's figures (maneevp.com). Owner 30/09: show what several shops agree on,
      // marked unverified. Battery indicator + breathing light + Type-C = printed on the device art every shop uses.
      // Owner 30/09 (§16 item 4 (20)): no battery size — no real source for it (the shops' 650mAh is dropped, the
      // `batteryMah` attribute with it); show the 20mL and the adjustable airflow. USB-C charging stays (compatibility).
      // Those two rows are `verified` with no URL on purpose: the page shows verified rows only, and the owner's ruling
      // is the source — a named exception in THAI_STYLE §5 (manufacturer-only rule). The other rows stay unverified.
      { key: "capacity", label: "E-liquid capacity", value: "20mL prefilled", sourceStatus: "verified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% (30mg) nicotine salt", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Dual mesh coil, 0.9Ω", sourceStatus: "unverified" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified" },
      { key: "indicator", label: "Status indicator", value: "Battery indicator + breathing light", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Vapers already asking for INFY's higher-puff disposable line by name."],
    faqs: [
      {
        id: "infy-20k-spec-variance",
        question: "Where do the specs on this page come from?",
        answer:
          "INFY does not list the 20K on its own sites yet. The 20mL capacity and the adjustable airflow on this page are confirmed by the shop; other figures Thai shops quote are not shown. To check against the real unit, ask on LINE @okm24.",
      },
    ],
    relatedProductSlugs: [],
    sourceUrls: ["https://www.infy.my/"],
  },
];
