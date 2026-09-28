import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const salthubProducts: Product[] = [
  {
    id: "m-bar-10k",
    slug: "m-bar-10k",
    brandId: "salthub",
    familyId: "m-bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "M Bar 10K",
    displayName: "SALTHUB M BAR 10K",
    tagline: "Three power modes, an RGB status ring, 10,000 puffs rated.",
    shortDescription:
      "A rechargeable disposable rated for up to 10,000 puffs, with a cotton mesh coil, three switchable power modes, and an RGB indicator that shows the active mode. Many Thai shops list the M Bar line under the name Marbo — the same line.",
    isFlagship: true,
    editorialTag: "Flagship",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@OKM_24 — one of OKami24's own three channels.
    reviewVideo: { videoId: "yrVZ-QpHqNs", title: "M BAR 10K กลิ่นสายขนม \"MATCHA LATTE\"", channelName: "OKAMI", publishedAt: "2026-08-29" },
    attributes: {
      batteryMah: 600,
      puffCount: 10000,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-bar-10k/card.webp",
        alt: "SALTHUB M Bar 10K, black-to-blue gradient, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/mbar-10k/",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/m-bar-10k/angle-01.webp",
        alt: "Official SALTHUB M Bar 10K campaign image, \"Timeless Elegance\"",
        angle: "Campaign hero",
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/m-bar-10k/angle-02.webp",
        alt: "SALTHUB M Bar 10K device against a night-sky backdrop",
        angle: "Studio shot",
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/mbar-10k/",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/m-bar-10k/angle-03.webp",
        alt: "SALTHUB M Bar 10K mini display, 4-LED battery indicator and Eco/Soft/Boost RGB status indicator",
        angle: "Feature detail",
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/mbar-10k/",
      },
    ],
    // Real flavor lineup — verified directly against salthub.com's own mbar-10k/ page (11 named
    // per-flavor photos, e.g. alt="MBar 10K fresh flavor kyoho grape"). Those photos are posters. Image-fix round 2026-09-28: box + device cut from them went
    // live and were withdrawn the same day — even at real size (no stretch) the 800-px poster stays soft on a phone;
    // swatches until SALTHUB's own per-flavour originals arrive (list sent to the owner). 2026-09-29: flavours get an
    // OKami24 Higgsfield remake of the maker's own flavour photo (docs/IMAGE_SPEC.md §0 item 7; source + fidelity check
    // per file in scripts/process-images.map.json `aiRender`) — Grape passed by the owner, then the rest on the same
    // template (7 of 12 on 2026-09-29; Blue Ice, Kyoho Grape, Menthol Blast, Strawberry Kiwi failed 3 tries, Yellow Mint the sharpness gate — swatches).
    // `availability: "unknown"` — no live Shipnity stock signal for this Legacy record.
    // The flavour photos are box + device; the card (device alone) stays the first photo (owner 29/09).
    openOnCardPhoto: true,
    flavorVariants: [
      { id: "all-berry", name: "All Berry", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-all-berry-v2.webp", alt: "SALTHUB M Bar 10K, All Berry — box and device" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-cola-v2.webp", alt: "SALTHUB M Bar 10K, Cola — box and device" } },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-grape.webp", alt: "SALTHUB M Bar 10K, Grape — box and device" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown" },
      { id: "matcha-latte", name: "Matcha Latte", swatchHex: "#7a9a4a", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-matcha-latte-v2.webp", alt: "SALTHUB M Bar 10K, Matcha Latte — box and device" } },
      { id: "menthol-blast", name: "Menthol Blast", swatchHex: "#3ab5c6", availability: "unknown" },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-pink-berry-v2.webp", alt: "SALTHUB M Bar 10K, Pink Berry — box and device" } },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#c9405f", availability: "unknown" },
      { id: "watermelon-mint", name: "Watermelon Mint", swatchHex: "#4ec9a0", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-watermelon-mint-v2.webp", alt: "SALTHUB M Bar 10K, Watermelon Mint — box and device" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-watermelon-v2.webp", alt: "SALTHUB M Bar 10K, Watermelon — box and device" } },
      { id: "yellow-mint", name: "Yellow Mint", swatchHex: "#d9d13a", availability: "unknown" },
    ],
    specifications: [
      // Data round (2026-09-24): every row re-checked on SALTHUB's own M Bar 10K posters in a real browser. 30mg is on
      // none of them (MBar10K_01–07) → unverified, not shown.
      { key: "puffs", label: "Rated puffs", value: "Up to 10,000", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_05.webp" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_01.webp" },
      { key: "nicotine", label: "Nicotine strength", value: "30mg nicotine salt", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Cotton mesh coil", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_01.webp" },
      { key: "modes", label: "Power modes", value: "Eco / Soft / Boost, switched by double-click", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_04.webp" },
      { key: "indicator", label: "Status indicator", value: "LED battery level in 25% increments; RGB shows active mode", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_03.webp" },
    ],
    features: [
      {
        id: "three-modes",
        title: "Three power modes",
        description: "Eco, Soft, and Boost modes are cycled with a double-click, changing output character without any menu.",
      },
      {
        id: "rgb-indicator",
        title: "RGB mode indicator",
        description: "A colour-coded LED shows which of the three power modes is currently active at a glance.",
      },
      {
        id: "mesh-coil",
        title: "Cotton mesh coil",
        description: "A mesh coil design intended to keep flavor consistent across the device's rated puff count.",
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "Vapers who want mode flexibility (Eco/Soft/Boost) without an open-system pod device.",
      "Anyone who wants a rechargeable disposable rather than a single-charge unit.",
    ],
    faqs: [
      {
        id: "m-bar-10k-modes",
        question: "How do I switch power modes?",
        answer: "Double-click to cycle between Eco, Soft, and Boost — the RGB indicator changes colour to show which mode is active.",
      },
      {
        id: "m-bar-10k-recharge",
        question: "Is it rechargeable?",
        answer: "Yes — it charges over USB-C rather than being discarded once the internal battery is depleted.",
      },
    ],
    relatedProductSlugs: ["m-bar-9k", "m-bar-15k", "m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-bar-9k",
    slug: "m-bar-9k",
    brandId: "salthub",
    familyId: "m-bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "M Bar 9K",
    displayName: "SALTHUB M BAR 9K",
    tagline: "Adjustable airflow, 9,000 puffs.",
    shortDescription:
      "A rechargeable disposable with adjustable airflow, rated up to 9,000 puffs. Many Thai shops list the M Bar line under the name Marbo — the same line.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@OKM_24 — one of OKami24's own three channels.
    reviewVideo: { videoId: "SijUuq9qRpE", title: "M BAR 9K รวมกลิ่นสายขนม มีรสอะไรบ้าง? 2026", channelName: "OKAMI", publishedAt: "2026-08-19" },
    attributes: {
      batteryMah: 600,
      puffCount: 9000,
      capacityMl: 14,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-bar-9k/card.webp",
        alt: "SALTHUB M Bar 9K, black colourway, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03). All 22 names verified
    // directly against salthub.com's own official M Bar 9K flavor-card gallery (5 grid images,
    // each device card explicitly printed "BAR9K"/"9000 PUFF" — genuine own-product evidence, not
    // inferred from a generic site listing). Media note: the official cards themselves are clean,
    // unwatermarked brand artwork, but cropping one flavor out of each 5-up grid image could not
    // be done precisely enough to pass this catalog's photo standard (neighboring-card bleed,
    // clipped name text) — so no crop of those. Image-fix round 2026-09-28: 18 retailer (Vapeauras) device files went live and were
    // withdrawn the same day — the source is soft (600 px) and the phone hero drew it 1.85x enlarged; the owner
    // chose swatches until SALTHUB's own per-flavour originals arrive. `availability: "unknown"` for
    // all of them, honestly: Legacy SALTHUB products are not Shipnity-integrated (no live
    // per-flavor stock signal exists to check against), and Legacy Product Detail has no
    // cart/purchase action to gate in the first place — this is catalog truth only.
    flavorVariants: [
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
      { id: "doublemint", name: "Doublemint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "peach", name: "Peach", swatchHex: "#e8a06b", availability: "unknown" },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#d1479c", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown" },
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#7cb342", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6a4c93", availability: "unknown" },
      { id: "orange-sour", name: "Orange Sour", swatchHex: "#e07b39", availability: "unknown" },
      { id: "sparkling-lemon", name: "Sparkling Lemon", swatchHex: "#d9c93e", availability: "unknown" },
      { id: "sour-gummy", name: "Sour Gummy", swatchHex: "#9ccc4f", availability: "unknown" },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#e0669a", availability: "unknown" },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d9527a", availability: "unknown" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown" },
      { id: "strawberry-milkshake", name: "Strawberry Milkshake", swatchHex: "#eb9fb0", availability: "unknown" },
      { id: "menthol-freeze", name: "Menthol Freeze", swatchHex: "#7fd4e0", availability: "unknown" },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#4a2c5e", availability: "unknown" },
      { id: "zapple", name: "Zapple", swatchHex: "#8bc34a", availability: "unknown" },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): salthub.com states for M BAR 9K "9000 puffs · Battery Capacity: 600mAh ·
      // Adjustable Airflow" (product box) and "Nicotine Salt 30mg · Resistance 1.0 Ω · Type-C" (THE BENEFITS block).
      // 14mL, "mesh", "3%" and the MTL-to-DTL range appear nowhere on salthub.com → unverified, not shown.
      { key: "puffs", label: "Rated puffs", value: "Up to 9,000", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "capacity", label: "E-liquid capacity", value: "14mL prefilled", sourceStatus: "unverified" },
      { key: "nicotine", label: "Nicotine strength", value: "30mg nicotine salt", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "resistance", label: "Resistance", value: "1.0Ω", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "coil", label: "Coil", value: "Mesh coil", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "adjustable-airflow",
        title: "Adjustable airflow",
        description: "The airflow can be adjusted on the device itself.",
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "Vapers who want to adjust draw tightness on a disposable rather than committing to one airflow.",
    ],
    faqs: [],
    relatedProductSlugs: ["m-bar-10k", "m-bar-15k"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-bar-15k",
    slug: "m-bar-15k",
    brandId: "salthub",
    familyId: "m-bar",
    categoryId: "disposables",
    systemType: "disposable",
    name: "M Bar 15K",
    displayName: "SALTHUB M BAR 15K",
    tagline: "The highest-rated puff count in the M Bar line.",
    shortDescription:
      "An M Bar disposable rated up to 15,000 puffs on a cotton mesh coil with USB-C fast charging.",
    isFlagship: false,
    attributes: {
      puffCount: 15000,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C, fast charging",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-bar-15k/card.webp",
        alt: "SALTHUB M Bar 15K, smoke-to-black gradient with Cola flavor window, isolated product shot",
        angle: "3/4, isolated",
        // Corrected 2026-09-06: the file has had a real alpha channel all along (measured: 56%
        // transparent pixels), the flag just never caught up. Metadata only — nothing renders off it.
        transparentBackground: true,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Composed 2026-09-06 from the 15 processed flavour files by scripts/build-lineup-grid.js
    // (5×3 on a square 1600 canvas — designer direction: the hero frame is square, so the shop's
    // older single-row strips waste ~74% of it and render each device ~32px wide on a phone).
    // Reached through the "All" button, not the first image: the owner chose on 2026-09-06 to keep
    // a single clear flavour as the opening shot, because at 15 flavours the lineup shrinks each
    // pod to ~43px on a phone — good for "there are many", bad for "I want that one".
    lineupImage: {
      src: "/assets/products/m-bar-15k/lineup.webp",
      alt: "SALTHUB M Bar 15K, all 15 flavours",
      sourceName: "OKami24 composite (from official Marbo per-flavour photos)",
    },
    // Real flavor lineup — tier-1, verified directly against salthub.com's own m-bar-15k/ page
    // (each flavor has its own official product photo with a descriptive alt attribute, e.g.
    // "M Bar 15K grape aloe disposable vape pod"). `availability: "unknown"` throughout, same
    // convention as M Bar 9K: this Legacy record has no live Shipnity stock signal to check
    // against, and Legacy Product Detail has no cart/purchase action to gate anyway.
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-apple-aloe.webp", alt: "SALTHUB M Bar 15K, Apple Aloe" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-blue-ice.webp", alt: "SALTHUB M Bar 15K, Blue Ice" } },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-cola.webp", alt: "SALTHUB M Bar 15K, Cola" } },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-double-mint.webp", alt: "SALTHUB M Bar 15K, Double Mint" } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-grape-aloe.webp", alt: "SALTHUB M Bar 15K, Grape Aloe" } },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-grape.webp", alt: "SALTHUB M Bar 15K, Grape" } },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9a6ab0", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-grape-lychee.webp", alt: "SALTHUB M Bar 15K, Grape Lychee" } },
      { id: "mango-passion", name: "Mango Passion", swatchHex: "#e0a03a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-mango-passion.webp", alt: "SALTHUB M Bar 15K, Mango Passion" } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-mixberry.webp", alt: "SALTHUB M Bar 15K, Mixberry" } },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e08a7a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-peach-strawberry.webp", alt: "SALTHUB M Bar 15K, Peach Strawberry" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-pink-berry.webp", alt: "SALTHUB M Bar 15K, Pink Berry" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-strawberry.webp", alt: "SALTHUB M Bar 15K, Strawberry" } },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#d9607a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-strawberry-watermelon.webp", alt: "SALTHUB M Bar 15K, Strawberry Watermelon" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#e0709a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-watermelon-bubblegum.webp", alt: "SALTHUB M Bar 15K, Watermelon Bubblegum" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-watermelon.webp", alt: "SALTHUB M Bar 15K, Watermelon" } },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 15,000", sourceStatus: "verified" },
      { key: "coil", label: "Coil", value: "Cotton mesh coil", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C fast charging", sourceStatus: "verified" },
      { key: "battery", label: "Battery capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "highest-puff",
        title: "Highest puff rating in the line",
        description: "Positioned above the 9K and 10K as SALTHUB's longest-rated M Bar disposable.",
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "Vapers prioritizing the longest rated run-time in the M Bar disposable line.",
    ],
    faqs: [],
    relatedProductSlugs: ["m-bar-10k", "m-bar-9k"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-switch-kit",
    slug: "m-switch-kit",
    brandId: "salthub",
    familyId: "m-switch",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "M Switch Kit",
    displayName: "SALTHUB M SWITCH KIT",
    tagline: "A reusable body, prefilled cartridges — no filling required.",
    shortDescription:
      "A reusable device body paired with prefilled M Switch Pod cartridges rated up to 15,000 puffs per pod — a device you keep and recharge, refilled by swapping cartridges rather than bottled e-liquid.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels. A dedicated 30-day
    // usage review, the strongest kind of review evidence found this mission.
    reviewVideo: { videoId: "DaJHk4e6_Y8", title: "30 วันกับ M SWITCH 15K เป็นยังไงบ้าง? (หัวรุ่นแรก)", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-12" },
    attributes: {
      puffCount: 15000,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-switch-kit/card.webp",
        alt: "SALTHUB M Switch Kit, navy body with digital battery display, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup for the included starter cartridge — tier-1, verified against
    // salthub.com's own m-switch-kit/ page (per-flavor official product photos, same list as
    // the standalone M Switch Pod cartridge below — 17 since Cool Mint was removed 2026-09-28). `availability: "unknown"` — no live Shipnity
    // stock signal for this Legacy record. Image-fix round 2026-09-28: the maker's kit renders
    // (m_switch_kit_flavor_01…16) went live and were withdrawn the same day — they show the newer black COTTON MESH
    // pod, while the shop's own M SWITCH 15K clips show clear pods on the device; not proven to match stock.
    flavorVariants: [
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown" },
      // Cool Mint removed 2026-09-28: the owner confirms it does not exist (reverses the 2026-09-06 "keep it" ruling, BSOT §21).
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown" },
      { id: "black-berry", name: "Black Berry", swatchHex: "#3a2a4e", availability: "unknown" },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown" },
      { id: "doublemint", name: "Doublemint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9a6ab0", availability: "unknown" },
      { id: "mango-passion", name: "Mango Passion", swatchHex: "#e0a03a", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#8e3a6b", availability: "unknown" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e08a7a", availability: "unknown" },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c9405f", availability: "unknown" },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#d9607a", availability: "unknown" },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#e0709a", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): salthub.com product box "M SWITCH KIT · 15000 Puffs · Cotton Mesh Coil ·
      // Type-C Fast Charging"; the M SWITCH POD box "Compatible with Switch Cartridge". SALTHUB lists the 600mAh battery
      // under the heading "M SWITCH POD", not under the kit — so the kit's battery row stays unverified (owner's rule:
      // the number goes only on the product the manufacturer names).
      { key: "puffs-per-pod", label: "Puffs per pod", value: "Up to 15,000", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "format", label: "Format", value: "Reusable device body + prefilled swap-in cartridges", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "battery", label: "Battery capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "keep-the-body",
        title: "Keep the device, swap the pod",
        description: "Unlike a fully disposable device, only the M Switch Pod cartridge is replaced — the device body is recharged and reused.",
      },
    ],
    compatibility: [{ type: "pod", label: "M Switch Pod cartridge" }, typeC],
    whoIsThisFor: [
      "Disposable users who want to stop throwing away a full device every time and keep a reusable body instead.",
    ],
    faqs: [
      {
        id: "m-switch-vs-disposable",
        question: "How is this different from an M Bar disposable?",
        answer:
          "The M Switch Kit's device body is reusable and rechargeable — only the prefilled M Switch Pod cartridge is replaced, rather than discarding the whole unit.",
      },
    ],
    relatedProductSlugs: ["m-switch-pod", "zero-pro"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-switch-pod",
    slug: "m-switch-pod",
    brandId: "salthub",
    familyId: "m-switch",
    categoryId: "pods-cartridges",
    systemType: "pod-cartridge",
    name: "M Switch Pod",
    displayName: "SALTHUB M SWITCH POD",
    tagline: "The prefilled cartridge for the M Switch Kit.",
    shortDescription: "A prefilled replacement cartridge for the M Switch Kit device body.",
    isFlagship: false,
    attributes: {
      capacityMl: 2.2,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-switch-pod/card.webp",
        alt: "SALTHUB M Switch Pod, Grape Aloe flavor, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03), extended (2026-09-04):
    // re-fetched salthub.com's own m-switch-pod/ page directly and found more official per-flavor
    // photos beyond the original 14 (Kyoho Grape, Grape Aloe, Grape Lychee — 17 in all since the
    // owner removed Cool Mint on 2026-09-28) — same "M SWITCH Pod #1" retail-box photography, same evidence tier. This
    // record's own real Shipnity children (Pod-147: Grape Aloe, Strawberry Watermelon, Apple
    // Aloe) are a subset of this full list, confirming the list is accurate, not just plausible.
    // Every source photo is a busy marketing composite (real fruit/liquid-splash imagery, a
    // competing visual style to this catalog's clean-isolated-photo standard) — the NAMES are
    // trustworthy (read directly off each flavor's own labeled box), the PHOTOS are not, so this
    // stays swatch-only. Image-fix round 2026-09-28: 12 photos cut from these posters went live (PR #97) and were
    // reverted the same day — the shop's own "M SWITCH 15K" review clip shows clear first-generation pods, so the
    // black poster pod could not be proven to be what a customer receives (BSOT §21, 2026-09-06 ruling stands). `availability: "unknown"` for the
    // same reason as M Bar 9K — no Shipnity/stock integration exists for Legacy SALTHUB products,
    // and this page has no purchase action to gate.
    flavorVariants: [
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown" },
      // Cool Mint removed 2026-09-28: the owner confirms it does not exist (reverses the 2026-09-06 "keep it" ruling, BSOT §21).
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#7cb342", availability: "unknown" },
      { id: "black-berry", name: "Black Berry", swatchHex: "#3a2340", availability: "unknown" },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "doublemint", name: "Doublemint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6a4c93", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9a6ab0", availability: "unknown" },
      { id: "mango-passion", name: "Mango Passion", swatchHex: "#e0a83e", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown" },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d9527a", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#d9647a", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#e0669a", availability: "unknown" },
    ],
    specifications: [
      // Data round (owner 2026-09-24, 10B fix A): salthub.com states "E-liquid Capacity: 2.2mL" only under M BAR POD and
      // ZERO CARTRIDGE, never under M SWITCH POD → unverified, not shown. The battery row is SALTHUB's own "THE BENEFITS —
      // M SWITCH POD" block (Battery 600mAh), placed on the product SALTHUB names (owner rule 2026-09-24).
      { key: "capacity", label: "Capacity", value: "2.2mL prefilled", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "600mAh", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "compat", label: "Compatible device", value: "M Switch Kit", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      // Data round chat 2 (real browser, 2026-09-24): the same "THE BENEFITS — M SWITCH POD" block states "Resistance 1.0 Ω".
      { key: "resistance", label: "Resistance", value: "1.0Ω", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
    ],
    features: [],
    compatibility: [{ type: "cartridge", label: "M Switch Kit device body" }],
    whoIsThisFor: ["M Switch Kit owners restocking flavor cartridges."],
    faqs: [],
    relatedProductSlugs: ["m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-bar-pod",
    slug: "m-bar-pod",
    brandId: "salthub",
    familyId: "m-bar",
    categoryId: "pods-cartridges",
    systemType: "pod-cartridge",
    name: "M Bar Pod",
    displayName: "SALTHUB M BAR POD",
    tagline: "15+ flavors, one compatible cartridge line.",
    shortDescription: "A replacement pod line compatible across SALTHUB's M Bar-compatible reusable devices, offered in 15+ flavors. Many Thai shops list the M Bar family under the name Marbo — the same line.",
    isFlagship: false,
    attributes: {
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/m-bar-pod/card.webp",
        alt: "SALTHUB M Bar Pod, matte black cartridge with Grape Aloe flavor label, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    specifications: [
      // Data round chat 2 (real browser, 2026-09-24): salthub.com's product box "M BAR POD — Compatible for Switch Series ·
      // E-liquid Capacity: 2.2mL · 15+ Flavors". The capacity was held back before only because nobody had read it there.
      { key: "flavors", label: "Flavor range", value: "15+ flavors", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "capacity", label: "Capacity", value: "2.2mL", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
    ],
    features: [],
    compatibility: [{ type: "cartridge", label: "M Bar-compatible reusable devices" }],
    whoIsThisFor: ["Owners of M Bar-compatible reusable devices restocking cartridges."],
    faqs: [],
    relatedProductSlugs: ["m-bar-10k", "m-switch-pod"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "zero-pro",
    slug: "zero-pro",
    brandId: "salthub",
    familyId: "zero",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "Zero Pro",
    displayName: "SALTHUB ZERO PRO",
    tagline: "Three modes, one reusable switch-style body.",
    shortDescription: "A reusable, 3-mode switch-style device rated up to 5,000 puffs per Zero Cartridge.",
    isFlagship: false,
    attributes: {
      puffCount: 5000,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/zero-pro/card.webp",
        alt: "SALTHUB Zero Pro, black pen-style device with M logo, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real color lineup — owner quality review, 2026-09-02, re-verified during the UWELL/VOOPOO
    // QC recovery pass (2026-09-03). Color names/count confirmed real via relxc9.net's own
    // "Marbo Zero Pro" listing (found at relxc9.net/product/marbo-zero-pro/), which does have a
    // dedicated image per color — but every one is a branded marketing tile (a third-party
    // "RELX CS.COM" watermark, a colored smoke-cloud background, two devices per tile, overlaid
    // spec-bullet text), not an isolated product photo, so none pass this catalog's photo
    // standard (no third-party watermarks, no background clutter). Per the same rule already
    // applied to Caliburn G4 Pro's Light Green and Caliburn G3 Pro KOKO (real color confirmed,
    // no clean photo available → swatch-only rather than a forced/defective image), these 7
    // stay swatch-only. NOTE: this research also found "Salthub" functions as a retail/
    // authorized-distributor brand name, while the product itself is manufactured and marketed
    // as "Marbo" (Marbo Bar / Marbo Zero / Marbo M Switch) across the wider vape retail
    // ecosystem, and salthub.com's own footer displays the Marbo logo — flagged here for a
    // future brand-taxonomy decision, NOT silently changed (brandId stays "salthub" until the
    // owner confirms this). "Black" reuses this product's own existing card photo, an exact
    // match sourced independently of relxc9.net.
    //
    // UPDATE 2026-09-05: all 8 colours now have a real per-colour photo. Source: salthub.com's OWN
    // product page (https://www.salthub.com/zero-pro/ → m_zero_pro_pod_kits_d_3.webp / _d_4.webp,
    // two official 4-colour composites, 1920px). Each device was cut out pixel-for-pixel (no resize,
    // no colour change; background disc + faint watermark removed) and re-canvased to the 1000×1000
    // spec by scripts/process-images.ts — see _incoming/salthub/SOURCE.md for the full chain and
    // the owner's confirmed name mapping (official name → our id): Flesh Pink→pink, Red→red,
    // Black and Red Gradient→charcoal-red, Blue-Purple Gradient→blue-purple, Black→black,
    // Silver-Grey→gunmetal, Light Blue→teal, Yellow and Black Gradient→golden-fade. Our ids/names
    // are deliberately unchanged. Source device height is 796–800px (owner accepted, 2026-09-04).
    colorVariants: [
      { id: "blue-purple", name: "Blue Purple", swatchHex: "#4a4e8e", image: { src: "/assets/products/zero-pro/variant-blue-purple.webp", alt: "SALTHUB / Marbo Zero Pro, Blue Purple (official: Blue-Purple Gradient)" } },
      { id: "golden-fade", name: "Golden Fade", swatchHex: "#c9a24b", image: { src: "/assets/products/zero-pro/variant-golden-fade.webp", alt: "SALTHUB / Marbo Zero Pro, Golden Fade (official: Yellow and Black Gradient)" } },
      { id: "gunmetal", name: "Gunmetal", swatchHex: "#4a4d52", image: { src: "/assets/products/zero-pro/variant-gunmetal.webp", alt: "SALTHUB / Marbo Zero Pro, Gunmetal (official: Silver-Grey)" } },
      {
        id: "black",
        name: "Black",
        swatchHex: "#1a1a1a",
        // was this product's card photo; now its own cut-out so all 8 colours share one canvas
        image: { src: "/assets/products/zero-pro/variant-black.webp", alt: "SALTHUB / Marbo Zero Pro, Black" },
      },
      { id: "pink", name: "Pink", swatchHex: "#e8899a", image: { src: "/assets/products/zero-pro/variant-pink.webp", alt: "SALTHUB / Marbo Zero Pro, Pink (official: Flesh Pink)" } },
      { id: "teal", name: "Teal", swatchHex: "#2a8a8a", image: { src: "/assets/products/zero-pro/variant-teal.webp", alt: "SALTHUB / Marbo Zero Pro, Teal (official: Light Blue)" } },
      { id: "red", name: "Red", swatchHex: "#b83a3a", image: { src: "/assets/products/zero-pro/variant-red.webp", alt: "SALTHUB / Marbo Zero Pro, Red" } },
      { id: "charcoal-red", name: "Charcoal Red", swatchHex: "#6e3535", image: { src: "/assets/products/zero-pro/variant-charcoal-red.webp", alt: "SALTHUB / Marbo Zero Pro, Charcoal Red (official: Black and Red Gradient)" } },
    ],
    specifications: [
      { key: "puffs-per-pod", label: "Puffs per cartridge", value: "Up to 5,000", sourceStatus: "verified" },
      { key: "modes", label: "Power modes", value: "3 modes", sourceStatus: "verified" },
      { key: "battery", label: "Battery capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "3-mode",
        title: "3 power modes",
        description: "A reusable switch-style body with three selectable output modes.",
      },
    ],
    compatibility: [{ type: "cartridge", label: "Zero Cartridge" }, typeC],
    whoIsThisFor: ["Vapers who want a switch-style reusable device with selectable wattage modes rather than a single fixed output."],
    faqs: [],
    relatedProductSlugs: ["zero-nano", "zero-cartridge", "m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "zero-nano",
    slug: "zero-nano",
    brandId: "salthub",
    familyId: "zero",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "Zero Nano",
    displayName: "SALTHUB ZERO NANO",
    tagline: "A compact device in the Zero line.",
    shortDescription: "A 500mAh compact reusable device on the Zero Cartridge platform.",
    isFlagship: false,
    attributes: {
      batteryMah: 500,
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
        src: "/assets/products/zero-nano/card.webp",
        alt: "SALTHUB Zero Nano, teal compact device, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "500mAh", sourceStatus: "verified" },
      { key: "format", label: "Format", value: "Ultra-compact reusable body, Zero Cartridge compatible", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "smallest-zero",
        title: "Compact Zero device",
        description: "A compact reusable body with a 500mAh battery, using the same Zero Cartridge as the Zero Pro.",
      },
    ],
    compatibility: [{ type: "cartridge", label: "Zero Cartridge" }, typeC],
    whoIsThisFor: ["Vapers who want a small Zero-platform switch-style device to carry around."],
    faqs: [],
    relatedProductSlugs: ["zero-pro", "zero-cartridge"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "zero-cartridge",
    slug: "zero-cartridge",
    brandId: "salthub",
    familyId: "zero",
    categoryId: "pods-cartridges",
    systemType: "pod-cartridge",
    name: "Zero Cartridge",
    displayName: "SALTHUB ZERO CARTRIDGE",
    tagline: "The changeable cartridge for Zero Pro and Zero Nano.",
    shortDescription: "A 2.2mL changeable cartridge compatible with both Zero Pro and Zero Nano device bodies.",
    isFlagship: false,
    attributes: {
      capacityMl: 2.2,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "N/A — cartridge only",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/zero-cartridge/card.webp",
        alt: "SALTHUB Zero Cartridge, smoke-clear cartridge with Strawberry Zero label, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — the 2 currently-active Shipnity children for this exact cartridge
    // (Pod-85 "หัวพอต Marbo Zero", the pre-rebrand name for this same product — see
    // active-catalog-to-product-master.ts's own exactLegacyMatch note). Only 2 confirmed;
    // salthub.com's own site has no dedicated flavor-gallery page for this cartridge to expand
    // the list further (unlike M Bar/M Switch) — `availability: "unknown"`, same convention as
    // every other Legacy SALTHUB product.
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown" },
      { id: "fruit-tea", name: "Fruit Tea", swatchHex: "#c9a24b", availability: "unknown" },
    ],
    specifications: [
      { key: "capacity", label: "Capacity", value: "2.2mL", sourceStatus: "verified" },
      { key: "compat", label: "Compatible devices", value: "Zero Pro, Zero Nano", sourceStatus: "verified" },
    ],
    features: [],
    compatibility: [{ type: "cartridge", label: "Zero Pro / Zero Nano" }],
    whoIsThisFor: ["Zero Pro and Zero Nano owners restocking flavor cartridges."],
    faqs: [],
    relatedProductSlugs: ["zero-pro", "zero-nano"],
    sourceUrls: ["https://www.salthub.com/"],
  },
];
