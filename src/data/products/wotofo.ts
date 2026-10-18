import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

const OFFICIAL_20MG = "https://www.wotofo.com/products/wotofo-nexbar-18k";
const OFFICIAL_50MG = "https://www.wotofo.com/products/wotofo-nexbar-18k-50mg";

/** Photo of one flavour — OKami24's Higgsfield remake of WOTOFO's own gallery photo (map entries in
 *  scripts/process-images.map.json carry the job, the reference and the fidelity sheet). */
const photo = (id: string, name: string) => ({
  src: `/assets/products/wotofo-nexbar-18k/variant-${id}.webp`,
  alt: `WOTOFO nexBAR 18K, ${name}`,
});

// nexPOD 15K Pro Kit (round p63, owner item 68, 18/10) — WOTOFO's own pages (Shopify JSON read 18/10).
const KIT_PAGE = "https://wotofo.com/products/nexpod-15k-pro-kit-20mg";
const DEVICE_PAGE = "https://wotofo.com/products/nexpod-15k-pro-device";
const POD_PAGE = "https://wotofo.com/products/nexpod-15k-prefilled-pod-20mg";
/** One colour = the device cut from WOTOFO's own 2000px kit render of that colour (pure black backdrop keyed out). */
const kit = (id: string, name: string) => ({
  src: `/assets/products/nexpod-15k/variant-${id}.webp`,
  alt: `WOTOFO nexPOD 15K Pro, ${name}, with a prefilled pod fitted`,
});

export const wotofoProducts: Product[] = [
  {
    // Image-fix round (owner 2026-09-29/30): the shop sells nexBar CLEAR 18K (Shipnity Pod-180), not this model —
    // the old Pod-180 page showed this WOTOFO device by mistake. The owner keeps the WOTOFO brand on the site with
    // a real WOTOFO product carrying full official data. The shop has no stock: owner 2026-09-30 — a normal product with
    // a price (legacy-price-approvals.ts) and every flavour on the sold-out list (src/data/stock/sold-out.ts).
    id: "wotofo-nexbar-18k",
    slug: "wotofo-nexbar-18k",
    brandId: "wotofo",
    familyId: "wotofo-nexbar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "WOTOFO nexBAR 18K",
    displayName: "WOTOFO nexBAR 18K",
    tagline: "WOTOFO's 18,000-puff disposable with dual nexMESH coils and a smart LED screen.",
    shortDescription:
      "WOTOFO's own nexBAR 18K: up to 18,000 puffs, 21 mL of e-liquid, a 750 mAh battery charged over Type-C, dual 1.2Ω nexMESH coils, NORM (16 W) and TURBO (19 W) modes and 2-level adjustable airflow — every figure from wotofo.com.",
    isFlagship: false,
    // Moved from the Pod-180 page (image-fix round): the shop's own review of this exact carbon-look device.
    reviewVideo: { videoId: "YhtKKjRwF3Q", title: "WOTOFO NEXBAR 18K ชื่อนี้ไม่ต้องลุ้น!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-20" },
    attributes: {
      batteryMah: 750,
      puffCount: 18000,
      capacityMl: 21,
      screenType: "led-indicator",
      portability: "compact",
      // Not a maker fact — the shop's own beginner filter; no flavour is in stock, so it stays out of that filter.
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/wotofo-nexbar-18k/card.webp",
        alt: "WOTOFO nexBAR 18K, Watermelon Ice, isolated product shot",
        angle:
          "Three-quarter front, isolated — OKami24's Higgsfield remake (image-fix round, owner ruling IMAGE_SPEC §0 item 7) of WOTOFO's own gallery photo wotofo-nexbar-18k-21.jpg (Watermelon Ice); IoU 0.996 against the maker photo.",
        transparentBackground: true,
        sourceName: "WOTOFO (official store, wotofo.com) — remade by OKami24",
        sourceUrl: OFFICIAL_20MG,
      },
    ],
    // Every flavour WOTOFO offers for this model (catalog completeness rule, owner 2026-09-06), merged from three
    // places on wotofo.com (checked 2026-09-29): the "20 Flavors to Choose From" list in the 20mg page copy, the 20mg
    // page's own variant selector, and the 50mg page's variant selector. Photos exist for the 20 flavours in WOTOFO's
    // gallery, all 20 remade. The 11 flavours WOTOFO shows no photo of
    // stay swatch-only — a remake needs the real stripe colours.
    flavorVariants: [
      { id: "blueberry-raspberry", name: "Blueberry Raspberry", swatchHex: "#6d6fb8", availability: "unknown", image: photo("blueberry-raspberry", "Blueberry Raspberry"), sourceUrl: OFFICIAL_20MG },
      { id: "blue-razz-ice", name: "Blue Razz Ice", swatchHex: "#2f63c8", availability: "unknown", image: photo("blue-razz-ice", "Blue Razz Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "grape-ice", name: "Grape Ice", swatchHex: "#7a5aa8", availability: "unknown", image: photo("grape-ice", "Grape Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "watermelon-ice", name: "Watermelon Ice", swatchHex: "#d8383f", availability: "unknown", image: photo("watermelon-ice", "Watermelon Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#d9486a", availability: "unknown", image: photo("watermelon-bubblegum", "Watermelon Bubblegum"), sourceUrl: OFFICIAL_20MG },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#e6a0b8", availability: "unknown", image: photo("strawberry-kiwi", "Strawberry Kiwi"), sourceUrl: OFFICIAL_20MG },
      { id: "pina-colada", name: "Pina Colada", swatchHex: "#e8dca0", availability: "unknown", image: photo("pina-colada", "Pina Colada"), sourceUrl: OFFICIAL_20MG },
      { id: "guava-kiwi-passion-fruit", name: "Guava Kiwi Passion Fruit", swatchHex: "#e2d6a6", availability: "unknown", image: photo("guava-kiwi-passion-fruit", "Guava Kiwi Passion Fruit"), sourceUrl: OFFICIAL_20MG },
      { id: "blackberry-ice", name: "Blackberry Ice", swatchHex: "#5b3a8a", availability: "unknown", image: photo("blackberry-ice", "Blackberry Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "lemon-lime", name: "Lemon Lime", swatchHex: "#b7d23c", availability: "unknown", image: photo("lemon-lime", "Lemon Lime"), sourceUrl: OFFICIAL_20MG },
      { id: "mint", name: "Mint", swatchHex: "#7fc4a4", availability: "unknown", image: photo("mint", "Mint"), sourceUrl: OFFICIAL_20MG },
      { id: "energy-ice", name: "Energy Ice", swatchHex: "#e8d23a", availability: "unknown", image: photo("energy-ice", "Energy Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "double-apple", name: "Double Apple", swatchHex: "#9cc43a", availability: "unknown", image: photo("double-apple", "Double Apple"), sourceUrl: OFFICIAL_20MG },
      { id: "caramel-tobacco", name: "Caramel Tobacco", swatchHex: "#c9892e", availability: "unknown", image: photo("caramel-tobacco", "Caramel Tobacco"), sourceUrl: OFFICIAL_20MG },
      { id: "peach-mango-watermelon", name: "Peach Mango Watermelon", swatchHex: "#e8a6c0", availability: "unknown", image: photo("peach-mango-watermelon", "Peach Mango Watermelon"), sourceUrl: OFFICIAL_20MG },
      { id: "strawberry-banana", name: "Strawberry Banana", swatchHex: "#e8d02e", availability: "unknown", image: photo("strawberry-banana", "Strawberry Banana"), sourceUrl: OFFICIAL_20MG },
      { id: "raspberry-cherry", name: "Raspberry Cherry", swatchHex: "#c8304a", availability: "unknown", image: photo("raspberry-cherry", "Raspberry Cherry"), sourceUrl: OFFICIAL_20MG },
      { id: "mango-ice", name: "Mango Ice", swatchHex: "#e6dcae", availability: "unknown", image: photo("mango-ice", "Mango Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "peach-ice", name: "Peach Ice", swatchHex: "#e8b0c8", availability: "unknown", image: photo("peach-ice", "Peach Ice"), sourceUrl: OFFICIAL_20MG },
      { id: "mixed-berries", name: "Mixed Berries", swatchHex: "#7a3aa8", availability: "unknown", image: photo("mixed-berries", "Mixed Berries"), sourceUrl: OFFICIAL_20MG },
      { id: "cherry-ice", name: "Cherry Ice", swatchHex: "#b8243c", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "forest-berries", name: "Forest Berries", swatchHex: "#5e2e6e", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "hawaiian-shore-ice", name: "Hawaiian Shore Ice", swatchHex: "#3eb8c8", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "melon-kiwi-banana", name: "Melon Kiwi Banana", swatchHex: "#a8d05a", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "pomegranate-ice", name: "Pomegranate Ice", swatchHex: "#a8243e", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#d8384e", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "three-melons", name: "Three Melons", swatchHex: "#8cc85a", availability: "unknown", sourceUrl: OFFICIAL_20MG },
      { id: "cherry-dragon-fruit", name: "Cherry Dragon Fruit", swatchHex: "#d8387a", availability: "unknown", sourceUrl: OFFICIAL_50MG },
      { id: "melon-blast", name: "Melon Blast", swatchHex: "#9ad06a", availability: "unknown", sourceUrl: OFFICIAL_50MG },
      { id: "pineapple-ice", name: "Pineapple Ice", swatchHex: "#e8c83a", availability: "unknown", sourceUrl: OFFICIAL_50MG },
      { id: "watermelon-dragon-fruit", name: "Watermelon Dragon Fruit", swatchHex: "#e0487a", availability: "unknown", sourceUrl: OFFICIAL_50MG },
    ],
    // Site-wide template round batch 5a (06/10): the G5 template — WOTOFO's own pictures, one per block (blocks.js in
    // _incoming/sitewide-template/5/5a/); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. No cover (posters 1980 px).
    storyDetails: true,
    storyLayout: "stage",
    // wotofo.com 20mg page, "SPECIFICATIONS" block + copy (checked 2026-09-29).
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 18,000", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "battery", label: "Battery", value: "750mAh rechargeable, Type-C", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "capacity", label: "E-liquid capacity", value: "21mL", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "coil", label: "Coil", value: "Dual nexMESH coils, 1.2Ω each", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "modes", label: "Output modes", value: "NORM 16W / TURBO 19W", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "airflow", label: "Airflow", value: "2-level adjustable", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "screen", label: "Display", value: "Smart LED screen: battery, e-liquid level, mode", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "nicotine", label: "Nicotine strength", value: "20mg or 50mg", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
      { key: "size", label: "Dimensions", value: "101 × 44 × 26.7 mm", sourceStatus: "verified", sourceUrl: OFFICIAL_20MG },
    ],
    features: [
      {
        id: "screen",
        title: "What the screen tells you",
        description: "When the battery or the e-liquid is getting low, the screen tells you first.",
        subline: "WOTOFO's LED screen shows the battery, the e-liquid left and the mode you're in.",
        image: { src: "/assets/products/wotofo-nexbar-18k/story-screen.webp", alt: "WOTOFO's nexBAR 18K picture — clear display, the LED screen up close", sourceName: "WOTOFO", sourceUrl: "https://www.wotofo.com/products/wotofo-nexbar-18k", width: 1600, height: 1600 },
      },
      {
        id: "mouthpiece",
        title: "Shaped for your lips",
        description: "It feels comfortable on the lips when you vape.",
        subline: "WOTOFO made this model's mouthpiece from silicone.",
        image: { src: "/assets/products/wotofo-nexbar-18k/story-mouthpiece.webp", alt: "WOTOFO's nexBAR 18K picture — ergonomic mouthpiece", sourceName: "WOTOFO", sourceUrl: "https://www.wotofo.com/products/wotofo-nexbar-18k", width: 1600, height: 1600 },
      },
      {
        id: "airflow",
        title: "Set the airflow the way you like",
        description: "Prefer a loose, easy draw, or something a little tighter? Pick whichever feels comfortable.",
        subline: "WOTOFO made the airflow slider large, so it's easy to find and adjust.",
        image: { src: "/assets/products/wotofo-nexbar-18k/story-airflow.webp", alt: "WOTOFO's nexBAR 18K picture — adjustment airflow at the base", sourceName: "WOTOFO", sourceUrl: "https://www.wotofo.com/products/wotofo-nexbar-18k", width: 1600, height: 1600 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: ["Customers who saw OKami24's own WOTOFO nexBAR 18K review and want the maker's full spec and flavour list."],
    faqs: [],
    relatedProductSlugs: [],
    // + WOTOFO's own review (battery percentage, the grooved slider, the button: batch 5a, checker #283 r1).
    sourceUrls: [OFFICIAL_20MG, OFFICIAL_50MG, "https://www.wotofo.com/blogs/disposable-vape/wotofo-nexbar-18k-review"],
  },
  {
    // Round p63 (owner item 68, 16/10): searched "nexBAR Switch 15K" does not exist on wotofo.com; its real pod-swap model is the
    // nexPOD 15K. Page for the Pro Kit (WOTOFO's current kit) — browse-only, no price, every option sold out (sku-map null).
    id: "nexpod-15k",
    slug: "nexpod-15k",
    brandId: "wotofo",
    familyId: "wotofo-nexpod",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "WOTOFO nexPOD 15K Pro Kit",
    displayName: "WOTOFO nexPOD 15K Pro Kit",
    tagline: "A 1200 mAh aluminium device that takes WOTOFO's prefilled 18 mL nexPOD 15K pods.",
    shortDescription:
      "WOTOFO's nexPOD 15K Pro Kit: a reusable 1200 mAh aluminium device and one prefilled pod (18 mL, 0.8Ω nexMESH coil, 15,000 puffs per pod). The device reads which pod is fitted and sets its wattage.",
    isFlagship: false,
    attributes: {
      batteryMah: 1200,
      // No puffCount: WOTOFO rates 15,000 puffs per POD, and the hero stat would read it as the device (spec row "puffs" says per pod).
      capacityMl: 18,
      portability: "compact",
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/nexpod-15k/card.webp",
        alt: "WOTOFO nexPOD 15K Pro, Black, with a prefilled pod fitted",
        angle: "front, isolated — cut from WOTOFO's own 2000px kit render (Black_nexpod_15k_pro_kit.jpg, pure black backdrop keyed out)",
        transparentBackground: true,
        sourceName: "WOTOFO (official store, wotofo.com)",
        sourceUrl: KIT_PAGE,
      },
    ],
    colorVariants: [
      { id: "black", name: "Black", swatchHex: "#1c1c1e", availability: "unknown", image: kit("black", "Black"), sourceUrl: DEVICE_PAGE },
      { id: "silver", name: "Silver", swatchHex: "#c9cbcd", availability: "unknown", image: kit("silver", "Silver"), sourceUrl: DEVICE_PAGE },
      { id: "blue", name: "Blue", swatchHex: "#a9c4d4", availability: "unknown", image: kit("blue", "Blue"), sourceUrl: DEVICE_PAGE },
      { id: "cosmic-orange", name: "Cosmic Orange", swatchHex: "#e2621f", availability: "unknown", image: kit("cosmic-orange", "Cosmic Orange"), sourceUrl: DEVICE_PAGE },
      { id: "red", name: "Red", swatchHex: "#c3343a", availability: "unknown", image: kit("red", "Red"), sourceUrl: DEVICE_PAGE },
      { id: "rose-gold", name: "Rose Gold", swatchHex: "#e2b2a6", availability: "unknown", image: kit("rose-gold", "Rose Gold"), sourceUrl: DEVICE_PAGE },
    ],
    // The kit's own flavour choice (17 on the kit page's selector) + the 3 more its page copy names (Mixed Berries,
    // Strawberry Banana, Strawberry Watermelon Ice) — catalog completeness rule. Flavour photos on wotofo.com carry the box
    // and its text, so the flavours stay swatch-only.
    flavorVariants: [
      { id: "forest-berries", name: "Forest Berries", swatchHex: "#5b3f8a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "blueberry-watermelon", name: "Blueberry Watermelon", swatchHex: "#6a5fb8", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "grape-ice", name: "Grape Ice", swatchHex: "#7a5aa8", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "guava-kiwi-passion-fruit", name: "Guava Kiwi Passion Fruit", swatchHex: "#e2d6a6", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "just-mint", name: "Just Mint", swatchHex: "#7fc4a4", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "love-77", name: "Love 77", swatchHex: "#c9d65a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "mango-ice", name: "Mango Ice", swatchHex: "#f0b52a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "melon-kiwi-banana", name: "Melon Kiwi Banana", swatchHex: "#c8d870", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "mixed-berries", name: "Mixed Berries", swatchHex: "#a0408a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "monster-ice", name: "Monster Ice", swatchHex: "#9cc43a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "peach-ice", name: "Peach Ice", swatchHex: "#f2a07a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "peach-mango-watermelon", name: "Peach Mango Watermelon", swatchHex: "#e8a6c0", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "pineapple-ice", name: "Pineapple Ice", swatchHex: "#f0d23a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "pomegranate-ice", name: "Pomegranate Ice", swatchHex: "#b0283a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "strawberry-banana", name: "Strawberry Banana", swatchHex: "#e8d02e", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#d8384a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#e6a0b8", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "strawberry-watermelon-ice", name: "Strawberry Watermelon Ice", swatchHex: "#e0506a", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "three-melons", name: "Three Melons", swatchHex: "#a8d070", availability: "unknown", sourceUrl: KIT_PAGE },
      { id: "watermelon-ice", name: "Watermelon Ice", swatchHex: "#d8383f", availability: "unknown", sourceUrl: KIT_PAGE },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1200mAh", sourceStatus: "verified", sourceUrl: DEVICE_PAGE },
      { key: "pod", label: "Pod capacity", value: "18mL prefilled", sourceStatus: "verified", sourceUrl: POD_PAGE },
      { key: "resistance", label: "Coil", value: "0.8Ω nexMESH", sourceStatus: "verified", sourceUrl: POD_PAGE },
      { key: "puffs", label: "Puffs", value: "15,000 per pod", sourceStatus: "verified", sourceUrl: POD_PAGE },
      { key: "output", label: "Output", value: "Prefilled pod 16W or 12W · refillable pod 25W or 20W", sourceStatus: "verified", sourceUrl: KIT_PAGE },
      { key: "airflow", label: "Airflow", value: "2-level adjustable", sourceStatus: "verified", sourceUrl: DEVICE_PAGE },
      { key: "display", label: "Display", value: "Battery level and output wattage", sourceStatus: "verified", sourceUrl: DEVICE_PAGE },
      { key: "charging", label: "Charging", value: "Fast charging supported", sourceStatus: "verified", sourceUrl: DEVICE_PAGE },
      { key: "nicotine", label: "Nicotine", value: "20mg", sourceStatus: "verified", sourceUrl: KIT_PAGE },
      { key: "materials", label: "Body", value: "Aluminium", sourceStatus: "verified", sourceUrl: KIT_PAGE },
      { key: "box", label: "In the box", value: "1 × nexPOD 15K Pro Device · 1 × nexPOD 15K Prefilled Pod", sourceStatus: "verified", sourceUrl: KIT_PAGE },
    ],
    features: [
      { id: "recognition", title: "Reads the pod it holds", description: "WOTOFO says the Pro Device recognises which pod is fitted and sets a matching default wattage: 16W for the prefilled pod, 25W for the refillable one." },
      { id: "modes", title: "Two power levels", description: "One click with the screen on switches the prefilled pod from 16W to 12W, or the refillable pod from 25W to 20W." },
      { id: "reuse", title: "Keep the device, swap the pod", description: "When a pod runs dry only the pod is replaced; the 1200mAh aluminium device is built to be used again." },
    ],
    compatibility: [{ type: "pod", label: "nexPOD 15K pods", note: "WOTOFO lists the nexPOD 15K Prefilled Pod and the nexPOD 15K Refillable Pod for this device." }],
    whoIsThisFor: ["You searched for a 15K pod-swap device from WOTOFO and want what WOTOFO itself lists for the nexPOD 15K Pro Kit."],
    faqs: [],
    relatedProductSlugs: ["wotofo-nexbar-18k"],
    sourceUrls: [KIT_PAGE, DEVICE_PAGE, POD_PAGE],
  },
];
