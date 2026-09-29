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
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Customers who saw OKami24's own WOTOFO nexBAR 18K review and want the maker's full spec and flavour list."],
    faqs: [],
    relatedProductSlugs: [],
    sourceUrls: [OFFICIAL_20MG, OFFICIAL_50MG],
  },
];
