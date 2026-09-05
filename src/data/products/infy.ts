import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const infyProducts: Product[] = [
  {
    id: "infy-20k",
    slug: "infy-20k",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4)" },
    brandId: "infy",
    familyId: "infy-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "INFY 20K",
    displayName: "INFY 20K",
    tagline: "A real INFY disposable, confirmed via retailer convergence.",
    shortDescription:
      "A 20,000-puff rechargeable disposable from INFY (infy.my / This Is Salts) — real, actively-sold (confirmed via a hands-on Thai review and retailer \"new arrival\" posts), but not on INFY's own officially-indexed disposable lineup, which currently tops out at 12K. Specs corroborated across 10+ independent Thai/Cambodian retailers, with minor variance between sources (600mAh/18mL vs 650mAh/20mL) not yet resolved against a physical unit.",
    isFlagship: false,
    editorialTag: "Retailer-confirmed",
    attributes: {
      batteryMah: 600,
      puffCount: 20000,
      capacityMl: 18,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // No card asset — no source at official or single-retailer confidence was found strong
    // enough to pass this catalog's photo standard this pass. Falls back to the illustrated
    // glyph rather than use an unverified image. NOTE: do not confuse with the separate,
    // real "INFY BAR PRO 20000 Puffs" (dual-mesh, bar-shaped, adjustable airflow) — a
    // different product under the same brand and puff count.
    assets: [],
    // Real flavor lineup (Tier-4, converged across 10+ retailers) — genuinely large and
    // converges strongly on ~18-23 names. Kept swatch-only: no clean per-flavor photo found.
    flavorVariants: [
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "grape-apple", name: "Grape Apple", swatchHex: "#7a5aa0", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown" },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#4a2c5e", availability: "unknown" },
      { id: "lychee", name: "Lychee", swatchHex: "#e0a0b0", availability: "unknown" },
      { id: "mint", name: "Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown" },
      { id: "peach", name: "Peach", swatchHex: "#e8a06b", availability: "unknown" },
      { id: "sparkling-lemon", name: "Sparkling Lemon", swatchHex: "#d9c93e", availability: "unknown" },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#d9647a", availability: "unknown" },
      { id: "watermelon-lychee", name: "Watermelon Lychee", swatchHex: "#d97a9e", availability: "unknown" },
      { id: "apple-aloevera", name: "Apple Aloevera", swatchHex: "#7cb342", availability: "unknown" },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3f5fa8", availability: "unknown" },
      { id: "grape-aloevera", name: "Grape Aloevera", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#a8d5d5", availability: "unknown" },
      { id: "strawberry-banana", name: "Strawberry Banana", swatchHex: "#e08a9e", availability: "unknown" },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "yoyo-grape", name: "Yoyo Grape", swatchHex: "#8a6bb0", availability: "unknown" },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 20,000", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C (one retailer states 650mAh — variance unresolved)", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "18mL (one retailer states 20mL — variance unresolved)", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% (30mg) nicotine salt", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Mesh coil", sourceStatus: "unverified" },
      { key: "indicator", label: "Status indicator", value: "LED smart screen + breathing light (retailer-stated)", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Vapers already asking for INFY's higher-puff disposable line by name."],
    faqs: [
      {
        id: "infy-20k-spec-variance",
        question: "ทำไมสเปกแบตเตอรี่/ความจุยังไม่ตรงกัน 100%?",
        answer:
          "ร้านค้าที่ขายจริงให้ตัวเลขต่างกันเล็กน้อย (600mAh/18mL กับ 650mAh/20mL) — ยังไม่ได้ตรวจกับสินค้าจริงในมือ ชื่อรุ่น รสชาติ และการมีอยู่จริงของสินค้ายืนยันแน่นอนแล้วจากร้านค้าอิสระ 10 กว่าราย",
      },
    ],
    relatedProductSlugs: [],
    sourceUrls: ["https://www.infy.my/"],
  },
];
