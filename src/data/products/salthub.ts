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
      "A rechargeable disposable rated for up to 10,000 puffs, with a cotton mesh coil, three switchable power modes, and an RGB indicator that shows the active mode.",
    isFlagship: true,
    editorialTag: "Flagship",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@OKM_24 — one of OKami24's own three channels.
    reviewVideo: { videoId: "yrVZ-QpHqNs", title: "M BAR 10K กลิ่นสายขนม \"MATCHA LATTE\"", channelName: "OKAMI" },
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
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 10,000", sourceStatus: "verified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified" },
      { key: "nicotine", label: "Nicotine strength", value: "30mg nicotine salt", sourceStatus: "verified" },
      { key: "coil", label: "Coil", value: "Cotton mesh coil", sourceStatus: "verified" },
      { key: "modes", label: "Power modes", value: "Eco / Soft / Boost, switched by double-click", sourceStatus: "verified" },
      { key: "indicator", label: "Status indicator", value: "LED battery level in 25% increments; RGB shows active mode", sourceStatus: "verified" },
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
    tagline: "Adjustable airflow between MTL and DTL, 9,000 puffs.",
    shortDescription:
      "A rechargeable disposable with 14mL of prefilled e-liquid, adjustable airflow spanning tight MTL to airier DTL draws, and a mesh coil rated up to 9,000 puffs.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@OKM_24 — one of OKami24's own three channels.
    reviewVideo: { videoId: "SijUuq9qRpE", title: "M BAR 9K รวมกลิ่นสายขนม มีรสอะไรบ้าง? 2026", channelName: "OKAMI" },
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
    // clipped name text) — per the "no bad crops, fall back to swatch-only" rule, every flavor
    // here is swatch-only rather than shipping an imperfect crop. `availability: "unknown"` for
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
      { key: "puffs", label: "Rated puffs", value: "Up to 9,000", sourceStatus: "verified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C", sourceStatus: "verified" },
      { key: "capacity", label: "E-liquid capacity", value: "14mL prefilled", sourceStatus: "verified" },
      { key: "nicotine", label: "Nicotine strength", value: "3% (30mg) salt nicotine", sourceStatus: "verified" },
      { key: "airflow", label: "Airflow", value: "Adjustable, tight MTL to airier DTL", sourceStatus: "verified" },
      { key: "coil", label: "Coil", value: "Mesh coil", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "adjustable-airflow",
        title: "Adjustable airflow",
        description: "A single device that can be tuned from a tight MTL draw to a more open DTL pull.",
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
      "The newest and highest-capacity M Bar disposable, rated up to 15,000 puffs on a cotton mesh coil with Type-C fast charging; battery and e-liquid capacity were not independently confirmed.",
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
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
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
    reviewVideo: { videoId: "DaJHk4e6_Y8", title: "30 วันกับ M SWITCH 15K เป็นยังไงบ้าง? (หัวรุ่นแรก)", channelName: "POD SYSTEM OKAMI II" },
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
    specifications: [
      { key: "puffs-per-pod", label: "Puffs per pod", value: "Up to 15,000", sourceStatus: "verified" },
      { key: "format", label: "Format", value: "Reusable device body + prefilled swap-in cartridges", sourceStatus: "verified" },
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
    shortDescription: "A 2.2mL prefilled replacement cartridge for the M Switch Kit device body.",
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
        alt: "SALTHUB M Switch Pod, smoke-grey cartridge with Cola flavor band, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: false,
        sourceName: "SALTHUB",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03). All 14 names read
    // directly off salthub.com's own official "M SWITCH Pod #1" retail-box photography (own-
    // product-name evidence — the box explicitly reads "M SWITCH", not a generic/shared asset).
    // Every one of those source photos is a busy marketing composite (real fruit/liquid-splash
    // imagery, a competing visual style to this catalog's clean-isolated-photo standard) — the
    // NAMES are trustworthy (read directly off each flavor's own labeled box), the PHOTOS are not,
    // so this stays swatch-only rather than shipping a cluttered image. `availability: "unknown"`
    // for the same reason as M Bar 9K — no Shipnity/stock integration exists for Legacy SALTHUB
    // products, and this page has no purchase action to gate.
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#7cb342", availability: "unknown" },
      { id: "black-berry", name: "Black Berry", swatchHex: "#3a2340", availability: "unknown" },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "doublemint", name: "Doublemint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6a4c93", availability: "unknown" },
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
      { key: "capacity", label: "Capacity", value: "2.2mL prefilled", sourceStatus: "verified" },
      { key: "compat", label: "Compatible device", value: "M Switch Kit", sourceStatus: "verified" },
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
    shortDescription: "A replacement pod line compatible across SALTHUB's M Bar-compatible reusable devices, offered in 15+ flavors.",
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
      { key: "flavors", label: "Flavor range", value: "15+ flavors", sourceStatus: "verified" },
      { key: "capacity", label: "Capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
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
    colorVariants: [
      { id: "blue-purple", name: "Blue Purple", swatchHex: "#4a4e8e" },
      { id: "golden-fade", name: "Golden Fade", swatchHex: "#c9a24b" },
      { id: "gunmetal", name: "Gunmetal", swatchHex: "#4a4d52" },
      {
        id: "black",
        name: "Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/zero-pro/card.webp", alt: "SALTHUB / Marbo Zero Pro, Black" },
      },
      { id: "pink", name: "Pink", swatchHex: "#e8899a" },
      { id: "teal", name: "Teal", swatchHex: "#2a8a8a" },
      { id: "red", name: "Red", swatchHex: "#b83a3a" },
      { id: "charcoal-red", name: "Charcoal Red", swatchHex: "#6e3535" },
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
    whoIsThisFor: ["Vapers who want mode selection on a reusable switch-style device smaller than the M Switch Kit."],
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
    tagline: "The smallest device in the Zero platform.",
    shortDescription: "A 500mAh, ultra-compact reusable device on the Zero Cartridge platform.",
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
        title: "Smallest Zero-platform device",
        description: "The most compact reusable option on the Zero Cartridge platform.",
      },
    ],
    compatibility: [{ type: "cartridge", label: "Zero Cartridge" }, typeC],
    whoIsThisFor: ["Vapers who want the smallest possible reusable body on the Zero platform."],
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
