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
    // 2026-09-05: real official card. JOIWAY's Thai site (thai.myjoiway.com) is a JS app whose
    // product data comes from its own API — `POST /api/pro {action:"detail", id:85}` returns this
    // product's main image (storage/images/c3ecdd43fc65be2ed2e3d5c88a9fa439.png, 2059×2263,
    // transparent, "Aloe Grape" unit). Processed to the 1000×1000 spec by scripts/process-images.ts.
    // Provenance chain: _incoming/joiway/SOURCE.md.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/joiway-f3/card.webp",
        alt: "JOIWAY F3 disposable, Aloe Grape unit, official isolated product shot",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "JOIWAY (official Thai site, thai.myjoiway.com)",
        sourceUrl: "https://thai.myjoiway.com/web",
      },
    ],
    // Flavor lineup: the first 16 came from retailer convergence (akvapes.com); on 2026-09-06 every
    // one was matched to JOIWAY's OWN per-flavour photo from the official Thai site API (30 flavours
    // total there), processed to the 1000×1000 spec — no more swatch-only entries on this product.
    flavorVariants: [
      { id: "american-cookies", name: "American Cookies", swatchHex: "#a8703e", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-american-cookies.webp", alt: "JOIWAY F3, American Cookies" } },
      { id: "blueberry-ice", name: "Blueberry Ice", swatchHex: "#3f5fa8", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-blueberry-ice.webp", alt: "JOIWAY F3, Blueberry Ice" } },
      { id: "cola-ice", name: "Cola Ice", swatchHex: "#5e3a20", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-cola-ice.webp", alt: "JOIWAY F3, Cola Ice" } },
      { id: "cola-lemon", name: "Cola Lemon", swatchHex: "#8a6b2a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-cola-lemon.webp", alt: "JOIWAY F3, Cola Lemon" } },
      { id: "cool-mint-ice", name: "Cool Mint Ice", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-cool-mint-ice.webp", alt: "JOIWAY F3, Cool Mint Ice" } },
      { id: "funta-grape", name: "Funta Grape", swatchHex: "#6a4c93", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-funta-grape.webp", alt: "JOIWAY F3, Funta Grape" } },
      { id: "grape-ice", name: "Grape Ice", swatchHex: "#7a5aa0", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-grape-ice.webp", alt: "JOIWAY F3, Grape Ice" } },
      { id: "green-apple-ice", name: "Green Apple Ice", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-green-apple-ice.webp", alt: "JOIWAY F3, Green Apple Ice" } },
      { id: "hokkaido-melon-ice", name: "Hokkaido Melon Ice", swatchHex: "#a8c53e", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-hokkaido-melon-ice.webp", alt: "JOIWAY F3, Hokkaido Melon Ice" } },
      { id: "lemon-tea", name: "Lemon Tea", swatchHex: "#c9a63e", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-lemon-tea.webp", alt: "JOIWAY F3, Lemon Tea" } },
      { id: "lychee-ice", name: "Lychee Ice", swatchHex: "#e0a0b0", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-lychee-ice.webp", alt: "JOIWAY F3, Lychee Ice" } },
      { id: "orange-soda", name: "Orange Soda", swatchHex: "#e07b39", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-orange-soda.webp", alt: "JOIWAY F3, Orange Soda" } },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-passion-fruit.webp", alt: "JOIWAY F3, Passion Fruit" } },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#d1479c", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-rainbow-candy.webp", alt: "JOIWAY F3, Rainbow Candy" } },
      { id: "strawberry-ice", name: "Strawberry Ice", swatchHex: "#c23a4e", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-strawberry-ice.webp", alt: "JOIWAY F3, Strawberry Ice" } },
      { id: "watermelon-ice", name: "Watermelon Ice", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-watermelon-ice.webp", alt: "JOIWAY F3, Watermelon Ice" } },
      // 2026-09-06 — the 14 flavours JOIWAY lists that our catalog lacked, added under the owner
      // rule "show every flavour the maker offers, stock or not". Names/photos straight from the
      // official Thai site API (thai.myjoiway.com, action detail id 85); stock unknown until
      // Shipnity is wired. NOTE: the official file for our existing "Funta Grape" is named
      // "Funta Green" — our name is kept on purpose (owner 2026-09-06); see HANDOFF.
      { id: "aloe-grape", name: "Aloe Grape", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-aloe-grape.webp", alt: "JOIWAY F3, Aloe Grape" } },
      { id: "berries-party", name: "Berries Party", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-berries-party.webp", alt: "JOIWAY F3, Berries Party" } },
      { id: "blueberry-lime", name: "Blueberry Lime", swatchHex: "#4f7fb8", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-blueberry-lime.webp", alt: "JOIWAY F3, Blueberry Lime" } },
      { id: "english-iced-tea", name: "English Iced Tea", swatchHex: "#b07a3a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-english-iced-tea.webp", alt: "JOIWAY F3, English Iced Tea" } },
      { id: "golden-energy", name: "Golden Energy", swatchHex: "#d4a017", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-golden-energy.webp", alt: "JOIWAY F3, Golden Energy" } },
      { id: "green-tangerine-mint", name: "Green Tangerine Mint", swatchHex: "#5fb46a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-green-tangerine-mint.webp", alt: "JOIWAY F3, Green Tangerine Mint" } },
      { id: "hokkaido-ice-cream", name: "Hokkaido Ice Cream", swatchHex: "#e8dcc8", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-hokkaido-ice-cream.webp", alt: "JOIWAY F3, Hokkaido Ice Cream" } },
      { id: "hokkaido-peach", name: "Hokkaido Peach", swatchHex: "#f0a07a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-hokkaido-peach.webp", alt: "JOIWAY F3, Hokkaido Peach" } },
      { id: "japanese-sake", name: "Japanese Sake", swatchHex: "#d9d4c7", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-japanese-sake.webp", alt: "JOIWAY F3, Japanese Sake" } },
      { id: "thai-ovaltine", name: "Thai Ovaltine", swatchHex: "#8a5a3a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-thai-ovaltine.webp", alt: "JOIWAY F3, Thai Ovaltine" } },
      { id: "thai-tea", name: "Thai Tea", swatchHex: "#d9822b", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-thai-tea.webp", alt: "JOIWAY F3, Thai Tea" } },
      { id: "virginia-tobacco", name: "Virginia Tobacco", swatchHex: "#a0703a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-virginia-tobacco.webp", alt: "JOIWAY F3, Virginia Tobacco" } },
      { id: "vodak", name: "Vodak", swatchHex: "#cfd8e8", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-vodak.webp", alt: "JOIWAY F3, Vodak" } },
      { id: "watermelon-orange", name: "Watermelon Orange", swatchHex: "#e8703a", availability: "unknown", image: { src: "/assets/products/joiway-f3/variant-watermelon-orange.webp", alt: "JOIWAY F3, Watermelon Orange" } },
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
    // 2026-09-05: real official card from the same thai.myjoiway.com API (`POST /api/pro
    // {action:"detail", id:94}`, storage/images/e79555e737d9d4dea8d4737e6ac705bb.webp). NOTE: the
    // device in that file is only 741px tall — BELOW the 800px floor in docs/IMAGE_SPEC.md — and was
    // written under an explicit, owner-visible exception (scripts/process-images.map.json
    // `minLong: 741`) because the alternative was no photo at all. Owner to confirm or revert
    // (delete public/assets/products/joiway-f4/card.webp and this entry).
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/joiway-f4/card.webp",
        alt: "JOIWAY F4 dual-flavor disposable, official isolated product shot",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "JOIWAY (official Thai site, thai.myjoiway.com)",
        sourceUrl: "https://thai.myjoiway.com/web",
      },
    ],
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
    // 2026-09-06 — all 16 official dual-flavour combinations (each device carries two flavours;
    // rotate the mouthpiece to switch). Source: thai.myjoiway.com API (action detail id 94) —
    // the API only numbers them 1–16; the pair names were read off the label printed on each
    // official image. Added under the owner rule "show every flavour the maker offers".
    flavorVariants: [
      { id: "grape-ice-and-lychee-ice", name: "Grape Ice + Lychee Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-grape-ice-and-lychee-ice.webp", alt: "JOIWAY F4, Grape Ice + Lychee Ice (pair #1)" } },
      { id: "grape-ice-and-watermelon-ice", name: "Grape Ice + Watermelon Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-grape-ice-and-watermelon-ice.webp", alt: "JOIWAY F4, Grape Ice + Watermelon Ice (pair #2)" } },
      { id: "grape-ice-and-blueberry-ice", name: "Grape Ice + Blueberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-grape-ice-and-blueberry-ice.webp", alt: "JOIWAY F4, Grape Ice + Blueberry Ice (pair #3)" } },
      { id: "blueberry-ice-and-lychee-ice", name: "Blueberry Ice + Lychee Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-blueberry-ice-and-lychee-ice.webp", alt: "JOIWAY F4, Blueberry Ice + Lychee Ice (pair #4)" } },
      { id: "blueberry-ice-and-watermelon-ice", name: "Blueberry Ice + Watermelon Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-blueberry-ice-and-watermelon-ice.webp", alt: "JOIWAY F4, Blueberry Ice + Watermelon Ice (pair #5)" } },
      { id: "watermelon-ice-and-strawberry-ice", name: "Watermelon Ice + Strawberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-watermelon-ice-and-strawberry-ice.webp", alt: "JOIWAY F4, Watermelon Ice + Strawberry Ice (pair #6)" } },
      { id: "watermelon-ice-and-lychee-ice", name: "Watermelon Ice + Lychee Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-watermelon-ice-and-lychee-ice.webp", alt: "JOIWAY F4, Watermelon Ice + Lychee Ice (pair #7)" } },
      { id: "watermelon-ice-and-rainbow-candy", name: "Watermelon Ice + Rainbow Candy", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-watermelon-ice-and-rainbow-candy.webp", alt: "JOIWAY F4, Watermelon Ice + Rainbow Candy (pair #8)" } },
      { id: "cola-ice-and-green-apple-ice", name: "Cola Ice + Green Apple Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-cola-ice-and-green-apple-ice.webp", alt: "JOIWAY F4, Cola Ice + Green Apple Ice (pair #9)" } },
      { id: "cola-ice-and-strawberry-ice", name: "Cola Ice + Strawberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-cola-ice-and-strawberry-ice.webp", alt: "JOIWAY F4, Cola Ice + Strawberry Ice (pair #10)" } },
      { id: "green-apple-ice-and-american-cookies", name: "Green Apple Ice + American Cookies", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-green-apple-ice-and-american-cookies.webp", alt: "JOIWAY F4, Green Apple Ice + American Cookies (pair #11)" } },
      { id: "green-apple-ice-and-strawberry-ice", name: "Green Apple Ice + Strawberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-green-apple-ice-and-strawberry-ice.webp", alt: "JOIWAY F4, Green Apple Ice + Strawberry Ice (pair #12)" } },
      { id: "rainbow-candy-and-cool-mint-ice", name: "Rainbow Candy + Cool Mint Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-rainbow-candy-and-cool-mint-ice.webp", alt: "JOIWAY F4, Rainbow Candy + Cool Mint Ice (pair #13)" } },
      { id: "rainbow-candy-and-strawberry-ice", name: "Rainbow Candy + Strawberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-rainbow-candy-and-strawberry-ice.webp", alt: "JOIWAY F4, Rainbow Candy + Strawberry Ice (pair #14)" } },
      { id: "lychee-ice-and-american-cookies", name: "Lychee Ice + American Cookies", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-lychee-ice-and-american-cookies.webp", alt: "JOIWAY F4, Lychee Ice + American Cookies (pair #15)" } },
      { id: "cool-mint-ice-and-strawberry-ice", name: "Cool Mint Ice + Strawberry Ice", swatchHex: "#7ed321", availability: "unknown", image: { src: "/assets/products/joiway-f4/variant-cool-mint-ice-and-strawberry-ice.webp", alt: "JOIWAY F4, Cool Mint Ice + Strawberry Ice (pair #16)" } },
    ],
    compatibility: [typeC],
    whoIsThisFor: ["Customers who saw OKami24's own Joiway F4 30-day review and want a spec/flavor reference on-site."],
    faqs: [],
    relatedProductSlugs: ["joiway-f3"],
    sourceUrls: ["https://myjoiway.com/"],
  },
];
