import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const joiwayProducts: Product[] = [
  {
    id: "joiway-f3",
    slug: "joiway-f3",
    brandId: "joiway",
    familyId: "joiway-f-series",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Joiway F3",
    displayName: "JOIWAY F3",
    tagline: "A real Joiway disposable, confirmed via retailer convergence.",
    shortDescription:
      "A 12,000-puff rechargeable disposable from Joiway (myjoiway.com), a real device manufacturer. Specs below are corroborated across 10+ independent Thai/SEA retailers, but Joiway's own official site could not be directly verified this pass (bot-blocked to automated fetch, not evidence against the product) — see the sourcing note. NOTE: OKami24's own YouTube review content covers the newer Joiway F4 (a genuinely different, dual-flavor device), not F3 — see joiway-f4 for that model. F3 and F4 are confirmed real, separate, currently-sold devices, not inconsistent naming of the same one.",
    isFlagship: false,
    editorialTag: "Retailer-confirmed",
    attributes: {
      batteryMah: 650,
      puffCount: 12000,
      capacityMl: 14,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // No card asset — no source strong enough (official or a single confidently-identified
    // retailer render) was found this pass to pass this catalog's photo standard. Falls back to
    // the illustrated glyph rather than use an unverified/generic image.
    assets: [],
    // Real flavor lineup (Tier-2, akvapes.com — the most complete single retailer listing found;
    // NOT independently confirmed against Joiway's own official site, which could not be fetched
    // this pass). Kept swatch-only: no clean per-flavor photo found at any tier.
    flavorVariants: [
      { id: "american-cookies", name: "American Cookies", swatchHex: "#a8703e", availability: "unknown" },
      { id: "blueberry-ice", name: "Blueberry Ice", swatchHex: "#3f5fa8", availability: "unknown" },
      { id: "cola-ice", name: "Cola Ice", swatchHex: "#5e3a20", availability: "unknown" },
      { id: "cola-lemon", name: "Cola Lemon", swatchHex: "#8a6b2a", availability: "unknown" },
      { id: "cool-mint-ice", name: "Cool Mint Ice", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "funta-grape", name: "Funta Grape", swatchHex: "#6a4c93", availability: "unknown" },
      { id: "grape-ice", name: "Grape Ice", swatchHex: "#7a5aa0", availability: "unknown" },
      { id: "green-apple-ice", name: "Green Apple Ice", swatchHex: "#7cb342", availability: "unknown" },
      { id: "hokkaido-melon-ice", name: "Hokkaido Melon Ice", swatchHex: "#a8c53e", availability: "unknown" },
      { id: "lemon-tea", name: "Lemon Tea", swatchHex: "#c9a63e", availability: "unknown" },
      { id: "lychee-ice", name: "Lychee Ice", swatchHex: "#e0a0b0", availability: "unknown" },
      { id: "orange-soda", name: "Orange Soda", swatchHex: "#e07b39", availability: "unknown" },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown" },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#d1479c", availability: "unknown" },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "watermelon-ice", name: "Watermelon Ice", swatchHex: "#d94f6b", availability: "unknown" },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 12,000", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "650mAh rechargeable, USB-C", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "14mL prefilled", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% nicotine salt", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Mesh coil, 1.0Ω", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Vapers already asking for Joiway by name who want a real spec/flavor reference while OKami24 finishes official-source verification."],
    faqs: [],
    relatedProductSlugs: ["joiway-f4"],
    sourceUrls: ["https://myjoiway.com/"],
  },
  {
    id: "joiway-f4",
    slug: "joiway-f4",
    brandId: "joiway",
    familyId: "joiway-f-series",
    categoryId: "disposables",
    systemType: "disposable",
    name: "Joiway F4",
    displayName: "JOIWAY F4",
    tagline: "The newer, dual-flavor Joiway — matches OKami24's own review.",
    shortDescription:
      "A dual-flavor, dual-mode disposable (rotate the mouthpiece to switch flavors) — NOS mode rated ~15,000 puffs, TURBO mode ~30,000 puffs (some retailers flatten this to a single \"20,000\" figure). 650mAh, Type-C, mesh coil, 3% nicotine, 20mL, up to 16 flavor combinations. This is the exact model OKami24's own YouTube channel has a real 30-day hands-on review of (\"ประสบการณ์ 30 วัน JOIWAY F4 NOS\") — confirmed via an independent video with an almost-verbatim matching title, so \"F4 NOS\" refers to this device's NOS mode, not a third, separate model.",
    isFlagship: false,
    editorialTag: "Retailer-confirmed",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by youtube.com/@OKMYARZ — one
    // of OKami24's own three channels. A genuine 30-day hands-on review, the strongest kind of
    // review evidence found this mission.
    reviewVideo: { videoId: "oHR-MAacTz0", title: "ประสบการณ์ 30 วัน JOIWAY F4 NOS นานขนาดนั้นเลยหรือ?", channelName: "OKM YARZ" },
    attributes: {
      batteryMah: 650,
      puffCount: 30000,
      capacityMl: 20,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // No card asset — same tooling limitation as Joiway F3 (myjoiway.com resists automated
    // fetch). Falls back to the illustrated glyph rather than use an unverified image.
    assets: [],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "NOS mode ~15,000 / TURBO mode ~30,000 (some retailers list a single flattened \"20,000\" figure)", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "650mAh rechargeable, USB-C", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "20mL prefilled", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% nicotine salt", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Mesh coil", sourceStatus: "unverified" },
      { key: "flavor-modes", label: "Flavor switching", value: "Dual-flavor, rotate mouthpiece to switch — up to 16 flavor combinations", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "dual-flavor",
        title: "Dual-flavor switching",
        description: "Rotating the mouthpiece switches between two loaded flavors in the same device, rather than committing to one flavor per unit.",
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: ["Customers who saw OKami24's own Joiway F4 30-day review and want a spec/flavor reference on-site."],
    faqs: [],
    relatedProductSlugs: ["joiway-f3"],
    sourceUrls: ["https://myjoiway.com/"],
  },
];
