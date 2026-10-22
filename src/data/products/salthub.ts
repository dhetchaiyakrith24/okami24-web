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
        src: "/assets/products/m-bar-10k/card-v2.webp",
        alt: "SALTHUB M Bar 10K, black-to-blue gradient, isolated product shot",
        angle: "3/4, isolated",
        transparentBackground: true,
        // Image-fix round 2026-09-30: sharp 4K remake of the 463x925 maker card, same view; source + check in the map.
        sourceName: "OKami24 render (Higgsfield) from the SALTHUB card photo",
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
    // template (7 of 12 on 2026-09-29; the last 5 on 2026-09-30 as recolours of the passed Grape render with the maker photo cropped free of props — 12 of 12).
    // `availability: "unknown"` — no live Shipnity stock signal for this Legacy record.
    // 2026-09-30 (owner: device alone for every flavour, one lineup of all of them first, box photos lower down): `image` =
    // the device alone — ONE Higgsfield master render from the passed card, each flavour's base colour moved over by script
    // from its passed box+device render (source + check per file in the map); `boxImage` = that passed box+device photo,
    // in the "more details" flavour grid ("รุ่นนี้มี 12 กลิ่น" — owner 2026-09-30: keep it; only the wide lineup banner was
    // the duplicate). 2026-10-01 (owner, HANDOFF item (25) "ใช่"): like 9K / Kit / Pod the page opens on the card —
    // flavours by swipe or chip (`openOnCardPhoto`).
    // No all-options image behind an "all" chip (owner 01/10: the made-up lineups go — back to the Caliburn way, one device
    // per option by swipe or chip).
    openOnCardPhoto: true,
    storyDetails: true,
    // swatchHex of Pink Berry / Strawberry Kiwi / Watermelon Mint corrected 2026-09-30 to the device base colour on
    // SALTHUB's own flavour photos (violet · magenta · red — the old dots were guessed from the flavour names).
    // Site-wide template round batch 3c (06/10): split → the G5 template's stage (docs/PRODUCT_PAGE_TEMPLATE.md) — SALTHUB's own
    // M Bar 10K posters 01–05, one per block (1920 px, whole: _incoming/sitewide-template/3/3c/blocks.js). No cover: poster 01
    // is 1920 px (poster-stretch ×1.36 as a full-width cover) — it is block 1. Not used: 06 (flavour chart = the flavour grid)
    // and 07 (packaging display).
    storyLayout: "stage",
    flavorVariants: [
      { id: "all-berry", name: "All Berry", swatchHex: "#8e3a6b", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-all-berry-v3.webp", alt: "SALTHUB M Bar 10K, All Berry — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-all-berry-v2.webp", alt: "SALTHUB M Bar 10K, All Berry — box and device" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-blue-ice-v3.webp", alt: "SALTHUB M Bar 10K, Blue Ice — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-blue-ice-v2.webp", alt: "SALTHUB M Bar 10K, Blue Ice — box and device" } },
      { id: "cola", name: "Cola", swatchHex: "#4a2f1f", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-cola-v3.webp", alt: "SALTHUB M Bar 10K, Cola — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-cola-v2.webp", alt: "SALTHUB M Bar 10K, Cola — box and device" } },
      { id: "grape", name: "Grape", swatchHex: "#6b4a8e", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-grape-v2.webp", alt: "SALTHUB M Bar 10K, Grape — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-grape.webp", alt: "SALTHUB M Bar 10K, Grape — box and device" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#5a3570", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-kyoho-grape-v3.webp", alt: "SALTHUB M Bar 10K, Kyoho Grape — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-kyoho-grape-v2.webp", alt: "SALTHUB M Bar 10K, Kyoho Grape — box and device" } },
      { id: "matcha-latte", name: "Matcha Latte", swatchHex: "#7a9a4a", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-matcha-latte-v3.webp", alt: "SALTHUB M Bar 10K, Matcha Latte — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-matcha-latte-v2.webp", alt: "SALTHUB M Bar 10K, Matcha Latte — box and device" } },
      { id: "menthol-blast", name: "Menthol Blast", swatchHex: "#3ab5c6", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-menthol-blast-v3.webp", alt: "SALTHUB M Bar 10K, Menthol Blast — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-menthol-blast-v2.webp", alt: "SALTHUB M Bar 10K, Menthol Blast — box and device" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#6a3fc0", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-pink-berry-v3.webp", alt: "SALTHUB M Bar 10K, Pink Berry — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-pink-berry-v2.webp", alt: "SALTHUB M Bar 10K, Pink Berry — box and device" } },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#b0409a", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-strawberry-kiwi-v4.webp", alt: "SALTHUB M Bar 10K, Strawberry Kiwi — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-strawberry-kiwi-v3.webp", alt: "SALTHUB M Bar 10K, Strawberry Kiwi — box and device" } },
      { id: "watermelon-mint", name: "Watermelon Mint", swatchHex: "#c93a45", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-watermelon-mint-v3.webp", alt: "SALTHUB M Bar 10K, Watermelon Mint — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-watermelon-mint-v2.webp", alt: "SALTHUB M Bar 10K, Watermelon Mint — box and device" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-watermelon-v3.webp", alt: "SALTHUB M Bar 10K, Watermelon — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-watermelon-v2.webp", alt: "SALTHUB M Bar 10K, Watermelon — box and device" } },
      { id: "yellow-mint", name: "Yellow Mint", swatchHex: "#d9d13a", availability: "unknown", image: { src: "/assets/products/m-bar-10k/variant-yellow-mint-v3.webp", alt: "SALTHUB M Bar 10K, Yellow Mint — device" }, boxImage: { src: "/assets/products/m-bar-10k/variant-yellow-mint-v2.webp", alt: "SALTHUB M Bar 10K, Yellow Mint — box and device" } },
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
      // Batch 3c (06/10): "ADJUSTABLE AIRFLOW" is printed on SALTHUB's campaign poster 01 (the control is not named).
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://img.salthub.com/mbar10k/MBar10K_01.webp" },
    ],
    // Batch 3c (06/10): one SALTHUB poster per stage block (posters 01–05); Thai/en/zh text = src/i18n/story-copy.ts.
    features: [
      {
        id: "elegance",
        title: "A simple design",
        description: "Beyond the looks, you can set the draw as tight or as open as you like, to suit the way you vape.",
        subline: "SALTHUB made it \"for those who know elegance\".",
        image: { src: "/assets/products/m-bar-10k/angle-01.webp", alt: "Official SALTHUB M Bar 10K campaign image, \"Timeless Elegance\" — 10000 puffs, adjustable airflow, 3 mode, 600mAh, cotton mesh, Type-C", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1229 },
      },
      {
        id: "bottle",
        title: "An e-liquid bottle shape",
        description: "The colour changes from flavour to flavour; see the flavour list below.",
        subline: "SALTHUB calls it understated luxury.",
        image: { src: "/assets/products/m-bar-10k/angle-02.webp", alt: "Official SALTHUB M Bar 10K poster, \"Understated luxury radiates from within\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1085 },
      },
      {
        id: "display",
        title: "Battery level lights",
        description: "Four LEDs show the battery a quarter at a time, so when only one is lit, you know it is running low.",
        subline: "See how much battery is left at a glance.",
        image: { src: "/assets/products/m-bar-10k/angle-03.webp", alt: "SALTHUB M Bar 10K mini display, 4-LED battery indicator and Eco/Soft/Boost status indicator", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1096 },
      },
      {
        id: "modes",
        title: "Your tempo, your call",
        description: "Switch back and forth as often as you like, so the draw can be gentler or stronger whenever you want.",
        subline: "Double-click the button at the bottom.",
        image: { src: "/assets/products/m-bar-10k/story-modes.webp", alt: "Official SALTHUB M Bar 10K poster, \"Your tempo, your call\" — double-click the bottom button to switch Eco / Soft / Boost", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1078 },
      },
      {
        id: "nonstop",
        title: "Built to keep going",
        description: "The puff count is the maker's figure; how many you actually get depends on how often and how long each person draws.",
        subline: "SALTHUB says it performs the same from the first draw to the last.",
        image: { src: "/assets/products/m-bar-10k/story-nonstop.webp", alt: "Official SALTHUB M Bar 10K poster, \"Built for nonstop performance\" — up to 10,000 puffs", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1079 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "You change flavours often and want a range that runs from cool and fruity all the way to Cola and Matcha Latte.",
    ],
    // Batch 3c: the FAQ "How do I switch power modes?" left — the modes block tells it.
    faqs: [
      {
        id: "m-bar-10k-recharge",
        question: "Is it rechargeable?",
        answer: "Yes — it charges over USB-C rather than being discarded once the internal battery is depleted.",
      },
    ],
    relatedProductSlugs: ["m-bar-9k", "m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/", "https://www.salthub.com/mbar-10k/"],
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
        src: "/assets/products/m-bar-9k/card-v2.webp",
        alt: "SALTHUB M Bar 9K, black body with SALTHUB's orange-to-yellow print, tilted",
        angle: "upright master tilted in 2D — the same render every flavour photo is recoloured from",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from SALTHUB's card",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03). All 22 names verified directly against salthub.com's
    // own M Bar 9K flavour chart (salthub.com/m-bar-9k/, 5 poster rows, every card printed "BAR9K"/"9000 PUFF"). Retailer
    // (Vapeauras) photos went live 2026-09-28 and were withdrawn the same day (600 px, soft) — their file names are not reused.
    // `availability: "unknown"` — Legacy SALTHUB products have no live Shipnity stock signal; catalog truth only.
    // 2026-09-30 (round "image-sitewide", the M Bar 10K treatment): every flavour is the same black device, told apart on
    // SALTHUB's chart only by the colour of its print (Salthub logo, BAR9K, M) — `image` = the device alone from ONE
    // Higgsfield master of SALTHUB's own card, the print recoloured by script to each flavour's chart colours (source +
    // check per file in scripts/process-images.map.json `aiRender`); `swatchHex` = that print colour (the BAR9K lettering;
    // the M logo where the lettering is near white) — the body is black on all 22. `boxImage` = the flavour's own pack cut
    // from SALTHUB's chart at its own size (168x380 — owner 30/09 accepted it for the more-details grid, IMAGE_SPEC §4
    // exceptions). Owner 30/09 (later the same day, §16 item 4 (18) "ใช่"): the first image is ONE sharp device, like
    // the Caliburn pages — the page opens on the card (card-v2 = the flavour photos' own master, tilted; no new render),
    // flavours by swipe or chip (`openOnCardPhoto`, not `lineupFirst`); the chips carry all 22 names and the more-details
    // grid shows every pack.
    // `storyDetails` = the more-details section with only the all-flavours grid: SALTHUB publishes no highlight posters for
    // the 9K (only the flavour chart); a lone logo banner said nothing (designer 30/09), so there is no cover.
    // No all-options image behind an "all" chip (owner 01/10: the made-up lineups go — back to the Caliburn way, one device
    // per option by swipe or chip).
    openOnCardPhoto: true,
    storyDetails: true,
    flavorVariants: [
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#9c5fe3", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-grape-aloe-v2.webp", alt: "SALTHUB M Bar 9K, Grape Aloe — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-grape-aloe.webp", alt: "SALTHUB M Bar 9K, Grape Aloe — pack, from SALTHUB's flavour chart" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#ce3130", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-watermelon-v2.webp", alt: "SALTHUB M Bar 9K, Watermelon — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-watermelon.webp", alt: "SALTHUB M Bar 9K, Watermelon — pack, from SALTHUB's flavour chart" } },
      { id: "doublemint", name: "Doublemint", swatchHex: "#ffffff", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-doublemint-v2.webp", alt: "SALTHUB M Bar 9K, Doublemint — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-doublemint.webp", alt: "SALTHUB M Bar 9K, Doublemint — pack, from SALTHUB's flavour chart" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#3357b5", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-blue-ice-v2.webp", alt: "SALTHUB M Bar 9K, Blue Ice — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-blue-ice.webp", alt: "SALTHUB M Bar 9K, Blue Ice — pack, from SALTHUB's flavour chart" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#e746a9", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-strawberry-v2.webp", alt: "SALTHUB M Bar 9K, Strawberry — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-strawberry.webp", alt: "SALTHUB M Bar 9K, Strawberry — pack, from SALTHUB's flavour chart" } },
      { id: "peach", name: "Peach", swatchHex: "#eb8b53", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-peach-v2.webp", alt: "SALTHUB M Bar 9K, Peach — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-peach.webp", alt: "SALTHUB M Bar 9K, Peach — pack, from SALTHUB's flavour chart" } },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#f9ec5b", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-rainbow-candy-v2.webp", alt: "SALTHUB M Bar 9K, Rainbow Candy — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-rainbow-candy.webp", alt: "SALTHUB M Bar 9K, Rainbow Candy — pack, from SALTHUB's flavour chart" } },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#ac28dc", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-grape-lychee-v2.webp", alt: "SALTHUB M Bar 9K, Grape Lychee — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-grape-lychee.webp", alt: "SALTHUB M Bar 9K, Grape Lychee — pack, from SALTHUB's flavour chart" } },
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#adf28d", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-apple-aloe-v2.webp", alt: "SALTHUB M Bar 9K, Apple Aloe — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-apple-aloe.webp", alt: "SALTHUB M Bar 9K, Apple Aloe — pack, from SALTHUB's flavour chart" } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6a6ced", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-mixberry-v2.webp", alt: "SALTHUB M Bar 9K, Mixberry — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-mixberry.webp", alt: "SALTHUB M Bar 9K, Mixberry — pack, from SALTHUB's flavour chart" } },
      { id: "cola", name: "Cola", swatchHex: "#bc8273", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-cola-v2.webp", alt: "SALTHUB M Bar 9K, Cola — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-cola.webp", alt: "SALTHUB M Bar 9K, Cola — pack, from SALTHUB's flavour chart" } },
      { id: "grape", name: "Grape", swatchHex: "#c479ed", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-grape-v2.webp", alt: "SALTHUB M Bar 9K, Grape — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-grape.webp", alt: "SALTHUB M Bar 9K, Grape — pack, from SALTHUB's flavour chart" } },
      { id: "orange-sour", name: "Orange Sour", swatchHex: "#e68a26", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-orange-sour-v2.webp", alt: "SALTHUB M Bar 9K, Orange Sour — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-orange-sour.webp", alt: "SALTHUB M Bar 9K, Orange Sour — pack, from SALTHUB's flavour chart" } },
      { id: "sparkling-lemon", name: "Sparkling Lemon", swatchHex: "#faf73a", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-sparkling-lemon-v2.webp", alt: "SALTHUB M Bar 9K, Sparkling Lemon — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-sparkling-lemon.webp", alt: "SALTHUB M Bar 9K, Sparkling Lemon — pack, from SALTHUB's flavour chart" } },
      { id: "sour-gummy", name: "Sour Gummy", swatchHex: "#9bf1aa", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-sour-gummy-v2.webp", alt: "SALTHUB M Bar 9K, Sour Gummy — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-sour-gummy.webp", alt: "SALTHUB M Bar 9K, Sour Gummy — pack, from SALTHUB's flavour chart" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#a7e5d3", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-watermelon-bubblegum-v2.webp", alt: "SALTHUB M Bar 9K, Watermelon Bubblegum — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-watermelon-bubblegum.webp", alt: "SALTHUB M Bar 9K, Watermelon Bubblegum — pack, from SALTHUB's flavour chart" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#9c66a7", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-pink-berry-v2.webp", alt: "SALTHUB M Bar 9K, Pink Berry — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-pink-berry.webp", alt: "SALTHUB M Bar 9K, Pink Berry — pack, from SALTHUB's flavour chart" } },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#d16464", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-peach-strawberry-v2.webp", alt: "SALTHUB M Bar 9K, Peach Strawberry — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-peach-strawberry.webp", alt: "SALTHUB M Bar 9K, Peach Strawberry — pack, from SALTHUB's flavour chart" } },
      { id: "strawberry-milkshake", name: "Strawberry Milkshake", swatchHex: "#e5a5c2", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-strawberry-milkshake-v2.webp", alt: "SALTHUB M Bar 9K, Strawberry Milkshake — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-strawberry-milkshake.webp", alt: "SALTHUB M Bar 9K, Strawberry Milkshake — pack, from SALTHUB's flavour chart" } },
      { id: "menthol-freeze", name: "Menthol Freeze", swatchHex: "#7dc7ea", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-menthol-freeze-v2.webp", alt: "SALTHUB M Bar 9K, Menthol Freeze — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-menthol-freeze.webp", alt: "SALTHUB M Bar 9K, Menthol Freeze — pack, from SALTHUB's flavour chart" } },
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#6d649d", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-kyoho-grape-v2.webp", alt: "SALTHUB M Bar 9K, Kyoho Grape — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-kyoho-grape.webp", alt: "SALTHUB M Bar 9K, Kyoho Grape — pack, from SALTHUB's flavour chart" } },
      { id: "zapple", name: "Zapple", swatchHex: "#82b890", availability: "unknown", image: { src: "/assets/products/m-bar-9k/variant-zapple-v2.webp", alt: "SALTHUB M Bar 9K, Zapple — device" }, boxImage: { src: "/assets/products/m-bar-9k/pack-zapple.webp", alt: "SALTHUB M Bar 9K, Zapple — pack, from SALTHUB's flavour chart" } },
      // line 2 max-sync (22/10): 2 more flavours Shipnity Max lists (Disposable-25-23/24) — Max names; no photo yet.
      { id: "blueberry-mint", name: "Blueberry Mint", swatchHex: "#4a6fbd", availability: "unknown" },
      { id: "strawberry-kiwi", name: "Strawberry Kiwi", swatchHex: "#c95a5a", availability: "unknown" },
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
    relatedProductSlugs: ["m-bar-10k", "m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/"],
  },
  {
    id: "m-bar-15k",
    slug: "m-bar-15k",
    // Owner 2026-10-08 (chat): the clear M Bar pod is off the site (BSOT 06/10), so the 15K = the M Switch body + the black
    // pod = the M Switch Kit — the page folds into the Kit's (next.config.ts `redirects` sends /products/m-bar-15k there;
    // the Kit carries the "M Bar 15K" name). Not deleted: record, photos and price stay; delete this line and the redirect
    // to bring it back.
    hiddenFromStorefront: { since: "2026-10-08", reason: "owner 08/10: M Bar 15K folds into the M Switch Kit (black pod only)" },
    brandId: "salthub",
    familyId: "m-bar",
    // Batch 3f (06/10): owner 06/10 (HANDOFF §18) "M Bar 15K → reusable/pod-system category" — SALTHUB sells it as the M Switch
    // body + a clear swap-in M Bar cartridge (poster 08 "Combination device and cartridge"; 3/facts-m-bar-15k.md), the same shape
    // as the M Switch Kit, so it sits in the Kit's category. Head copy: the wrong facts (disposable · cotton mesh · fast) fixed.
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "M Bar 15K",
    displayName: "SALTHUB M BAR 15K",
    tagline: "The highest-rated puff count in the M Bar line.",
    shortDescription:
      "A reusable M Switch body paired with SALTHUB's clear, swap-in M Bar cartridge, rated up to 15,000 puffs.",
    isFlagship: false,
    attributes: {
      puffCount: 15000,
      batteryMah: 600,
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
    // 06/10 (owner, after #303: "ทำเลย" to the recommendation): like the M Switch Kit / 9K / 10K the page opens on the card —
    // the device with a clear cartridge — and the flavours follow by swipe or chip. The OKami24-made 15-flavour lineup behind an
    // "all" chip went with it (owner 01/10: the made-up lineups go; it also missed Black Berry).
    openOnCardPhoto: true,
    // Site-wide template round batch 3f (06/10): the G5 template stage — SALTHUB's own 15K posters 08/07/11/09/10, one per block
    // (1920 px, whole, down-sized only: _incoming/sitewide-template/3/3f/blocks.js); text in src/i18n/story-copy.ts, article in
    // src/data/product-articles.ts. No cover (poster 06 is 1920 px) and no lanyard block (the M Switch Kit page tells it).
    storyDetails: true,
    storyLayout: "stage",
    // Real flavor lineup — tier-1, verified directly against salthub.com's own m-bar-15k/ page
    // (each flavor has its own official product photo with a descriptive alt attribute, e.g.
    // "M Bar 15K grape aloe disposable vape pod"). `availability: "unknown"` throughout, same
    // convention as M Bar 9K: this Legacy record has no live Shipnity stock signal to check
    // against, and Legacy Product Detail has no cart/purchase action to gate anyway.
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#8ab84a", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-apple-aloe.webp", alt: "SALTHUB M Bar 15K, Apple Aloe" } },
      // Black Berry is on SALTHUB's 15K flavour chart (posters 04+05) but has no SALTHUB photo set (round "option photos" 06/10):
      // the real Mixberry pod photo with its bands redrawn by AI after the Black Berry pod on poster 05 (_incoming/option-photos/b2/)
      { id: "black-berry", name: "Black Berry", swatchHex: "#5f3ac8", availability: "unknown", image: { src: "/assets/products/m-bar-15k/variant-black-berry.webp", alt: "SALTHUB M Bar 15K, Black Berry" } },
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
      // Batch 3e (05/10): coil / charging / battery / airflow re-read from SALTHUB's own 15K page + home box
      // (_incoming/sitewide-template/3/facts-m-bar-15k.md) — the old coil + "fast" were the M SWITCH KIT box's words.
      { key: "coil", label: "Coil", value: "Ceramic coil", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/wp-content/uploads/2025/08/m_bar_15k_2.webp" },
      { key: "charging", label: "Charging", value: "USB-C", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/wp-content/uploads/2025/08/m_bar_15k_4.webp" },
      { key: "battery", label: "Battery capacity", value: "600mAh", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "airflow", label: "Airflow", value: "Adjust valve (slider)", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/wp-content/uploads/2025/08/m_bar_15k_5.webp" },
      // Batch 3f (06/10): format (poster 08) + display (poster 11), same labels as the M Switch Kit rows.
      { key: "format", label: "Format", value: "Reusable device body + clear swap-in M Bar cartridge", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/wp-content/uploads/2025/08/m_bar_15k_3.webp" },
      { key: "screen", label: "Display", value: "Digital battery display, charging and full-charge indicator", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/wp-content/uploads/2025/08/m_bar_15k_6.webp" },
      { key: "capacity", label: "E-liquid capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "swap",
        title: "A device with a swap-in cartridge",
        description: "The body is the part you keep; the flavour sits in the clear cartridge on top.",
        subline: "SALTHUB: put your favourite flavour cartridge into the device.",
        image: { src: "/assets/products/m-bar-15k/story-swap.webp", alt: "SALTHUB's M Bar 15K poster — a clear Grape Aloe cartridge going onto the M Switch body, \"Combination device and cartridge\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
      },
      {
        id: "coil",
        title: "A ceramic coil",
        description: "SALTHUB says it gives a smooth, full flavour. Each new cartridge brings a fresh coil with it.",
        subline: "It sits inside the cartridge.",
        image: { src: "/assets/products/m-bar-15k/story-coil.webp", alt: "SALTHUB's M Bar 15K poster — the clear Grape Aloe cartridge with its coil lit, \"Ceramic coil, delivers an incredibly smooth and satisfying taste\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
      },
      {
        id: "screen",
        title: "Battery left, as a number",
        description: "You can see it running low ahead of time and charge it before you head out.",
        subline: "The screen keeps it in view all the time.",
        image: { src: "/assets/products/m-bar-15k/story-screen.webp", alt: "SALTHUB's M Bar 15K poster — the screen showing 100%, with the charging and full-charge indicators explained", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
      },
      {
        id: "charge",
        title: "Charge and carry on",
        description: "A lightning mark appears beside the battery number while it charges, so you can see how far it has got.",
        subline: "The cable goes into the base.",
        image: { src: "/assets/products/m-bar-15k/story-charge.webp", alt: "SALTHUB's M Bar 15K poster — a USB-C cable in the base, the screen at 89%, \"Battery life last longer\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
      },
      {
        id: "airflow",
        title: "Choose your airflow",
        description: "Tighter or looser: SALTHUB says the valve adjusts precisely, so you can slide it to the spot that suits you.",
        subline: "The valve is on the side of the body.",
        image: { src: "/assets/products/m-bar-15k/story-airflow.webp", alt: "SALTHUB's M Bar 15K poster — air streams at the side valve, \"Airflow adjust valve\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "You like the M Switch body but would rather have the M Bar cartridge.",
      "You want the battery level as a number, not a guess.",
    ],
    faqs: [],
    relatedProductSlugs: ["m-switch-kit", "m-bar-10k"],
    sourceUrls: ["https://www.salthub.com/", "https://www.salthub.com/m-bar-15k/"],
  },
  {
    id: "m-switch-kit",
    slug: "m-switch-kit",
    brandId: "salthub",
    familyId: "m-switch",
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "M Switch Kit",
    displayName: "SALTHUB M SWITCH KIT",
    // Owner 2026-10-08: the shop sells this set as "M Bar 15K" (the retired m-bar-15k page redirects here).
    searchAliases: ["M Bar 15K", "MBar 15K", "Marbo 15K"],
    tagline: "A reusable body, prefilled cartridges — no filling required.",
    shortDescription:
      "A reusable device body paired with prefilled M Switch Pod cartridges rated up to 15,000 puffs per pod — a device you keep and recharge, refilled by swapping cartridges rather than bottled e-liquid. We sell this set as the M Bar 15K, or Marbo 15K.",
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
        src: "/assets/products/m-switch-kit/card-v2.webp",
        alt: "SALTHUB M Switch Kit, black body with digital battery display, tilted",
        angle: "upright cut-out tilted in 2D — the same device every kit flavour photo shows",
        transparentBackground: true,
        sourceName: "OKami24 cut-out (GPT Image) of SALTHUB's starter-kit render",
        sourceUrl: "https://www.salthub.com/m-switch-kit/",
      },
    ],
    // Real flavor lineup for the included starter cartridge — tier-1, verified against salthub.com's own m-switch-kit/ page
    // (per-flavour kit renders) and m-switch-pod/ page — 17 since Cool Mint was removed 2026-09-28. `availability: "unknown"` —
    // no live Shipnity stock signal for this Legacy record.
    // 2026-09-30 (round "image-sitewide" batch 2): sold as a starter kit — the device + one pod (owner 30/09; the body is not sold
    // alone). The body is the same for every flavour, so `image` = the device + that flavour's pod beside it (the pod photo
    // of m-switch-pod below; the black glossy-top pod the shop stocks — owner's photo of real stock 30/09); `boxImage` =
    // SALTHUB's own starter-kit render of that flavour (box + device) in the "more details" grid — Kyoho Grape has no kit
    // render on salthub.com, so no tile. `swatchHex` = as on m-switch-pod below; the pod stands upright (v3; v4 = the one-master pods of m-switch-pod below). Source + check per file
    // in scripts/process-images.map.json `aiRender`. Owner 30/09 rule (a) (§16 item 4 (18) "ใช่"): the page opens on the card — card-v2 = that same device, tilted (the
    // navy SALTHUB card went: the shop sells the black body) — `openOnCardPhoto`, not `lineupFirst`.
    // No all-options image behind an "all" chip (owner 01/10: the made-up lineups go — back to the Caliburn way, one device
    // per option by swipe or chip).
    openOnCardPhoto: true,
    storyDetails: true,
    // Site-wide template round batch 3b (05/10): split → the G5 template's stage (docs/PRODUCT_PAGE_TEMPLATE.md) — SALTHUB's own
    // kit posters, one per block (1920 px, whole, down-sized only: _incoming/sitewide-template/3/3b/blocks.js). No cover: the
    // campaign poster is 1920 px (poster-stretch ×1.36 as a full-width cover) and each of its icons has a block. Not used: the
    // "Combination device and cartridge" poster (the head copy already says it twice).
    storyLayout: "stage",
    flavorVariants: [
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#ab8cf0", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-kyoho-grape-v4.webp", alt: "SALTHUB M Switch Kit, Kyoho Grape — device and pod" } },
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#ffffff", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-apple-aloe-v4.webp", alt: "SALTHUB M Switch Kit, Apple Aloe — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-apple-aloe.webp", alt: "SALTHUB M Switch starter kit, Apple Aloe — box and device, SALTHUB render" } },
      { id: "black-berry", name: "Black Berry", swatchHex: "#5f3ac8", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-black-berry-v4.webp", alt: "SALTHUB M Switch Kit, Black Berry — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-black-berry.webp", alt: "SALTHUB M Switch starter kit, Black Berry — box and device, SALTHUB render" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#76eefb", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-blue-ice-v4.webp", alt: "SALTHUB M Switch Kit, Blue Ice — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-blue-ice.webp", alt: "SALTHUB M Switch starter kit, Blue Ice — box and device, SALTHUB render" } },
      { id: "cola", name: "Cola", swatchHex: "#fc3b42", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-cola-v4.webp", alt: "SALTHUB M Switch Kit, Cola — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-cola.webp", alt: "SALTHUB M Switch starter kit, Cola — box and device, SALTHUB render" } },
      { id: "doublemint", name: "Doublemint", swatchHex: "#affafb", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-doublemint-v4.webp", alt: "SALTHUB M Switch Kit, Doublemint — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-doublemint.webp", alt: "SALTHUB M Switch starter kit, Doublemint — box and device, SALTHUB render" } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#906cfb", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-grape-aloe-v4.webp", alt: "SALTHUB M Switch Kit, Grape Aloe — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-grape-aloe.webp", alt: "SALTHUB M Switch starter kit, Grape Aloe — box and device, SALTHUB render" } },
      { id: "grape", name: "Grape", swatchHex: "#6533f6", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-grape-v4.webp", alt: "SALTHUB M Switch Kit, Grape — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-grape.webp", alt: "SALTHUB M Switch starter kit, Grape — box and device, SALTHUB render" } },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#fa5cd0", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-grape-lychee-v4.webp", alt: "SALTHUB M Switch Kit, Grape Lychee — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-grape-lychee.webp", alt: "SALTHUB M Switch starter kit, Grape Lychee — box and device, SALTHUB render" } },
      { id: "mango-passion", name: "Mango Passion", swatchHex: "#fdfa03", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-mango-passion-v4.webp", alt: "SALTHUB M Switch Kit, Mango Passion — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-mango-passion.webp", alt: "SALTHUB M Switch starter kit, Mango Passion — box and device, SALTHUB render" } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#f844bf", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-mixberry-v4.webp", alt: "SALTHUB M Switch Kit, Mixberry — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-mixberry.webp", alt: "SALTHUB M Switch starter kit, Mixberry — box and device, SALTHUB render" } },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#fa76ba", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-peach-strawberry-v4.webp", alt: "SALTHUB M Switch Kit, Peach Strawberry — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-peach-strawberry.webp", alt: "SALTHUB M Switch starter kit, Peach Strawberry — box and device, SALTHUB render" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#e34bef", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-pink-berry-v4.webp", alt: "SALTHUB M Switch Kit, Pink Berry — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-pink-berry.webp", alt: "SALTHUB M Switch starter kit, Pink Berry — box and device, SALTHUB render" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#fb5c83", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-strawberry-v4.webp", alt: "SALTHUB M Switch Kit, Strawberry — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-strawberry.webp", alt: "SALTHUB M Switch starter kit, Strawberry — box and device, SALTHUB render" } },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#81f334", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-strawberry-watermelon-v4.webp", alt: "SALTHUB M Switch Kit, Strawberry Watermelon — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-strawberry-watermelon.webp", alt: "SALTHUB M Switch starter kit, Strawberry Watermelon — box and device, SALTHUB render" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#fb5866", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-watermelon-bubblegum-v4.webp", alt: "SALTHUB M Switch Kit, Watermelon Bubblegum — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-watermelon-bubblegum.webp", alt: "SALTHUB M Switch starter kit, Watermelon Bubblegum — box and device, SALTHUB render" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#fb7a78", availability: "unknown", image: { src: "/assets/products/m-switch-kit/variant-watermelon-v4.webp", alt: "SALTHUB M Switch Kit, Watermelon — device and pod" }, boxImage: { src: "/assets/products/m-switch-kit/pack-watermelon.webp", alt: "SALTHUB M Switch starter kit, Watermelon — box and device, SALTHUB render" } },
    ],
    specifications: [
      // Batch 3b (05/10): SALTHUB's own kit page + posters (_incoming/sitewide-template/3/facts-m-switch-kit.md). SALTHUB lists
      // the 600mAh battery under "M SWITCH POD", not under the kit — the kit's battery row stays unverified (owner's rule).
      { key: "puffs-per-pod", label: "Puffs per pod", value: "Up to 15,000", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "format", label: "Format", value: "Reusable device body + prefilled swap-in cartridges", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
      { key: "coil", label: "Coil", value: "Cotton mesh", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/m-switch-kit/" },
      { key: "airflow", label: "Airflow", value: "Adjust valve (slider)", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/m-switch-kit/" },
      { key: "screen", label: "Display", value: "Digital battery display, charging and full-charge indicator", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/m-switch-kit/" },
      { key: "charging", label: "Charging", value: "USB-C (SALTHUB: fast charging)", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/m-switch-kit/" },
      { key: "battery", label: "Battery capacity", value: "Not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "coil",
        title: "A cotton mesh coil",
        description: "SALTHUB says it gives an incredibly smooth, satisfying taste.",
        subline: "This is the coil on the M Switch.",
        image: { src: "/assets/products/m-switch-kit/story-coil.webp", alt: "SALTHUB's M Switch poster — cotton mesh, for an incredibly smooth and satisfying taste", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
      },
      {
        id: "charge",
        title: "Battery and charging",
        description: "While it charges, a lightning mark flashes on the screen, so you can see it is charging.",
        subline: "SALTHUB says the battery lasts longer.",
        image: { src: "/assets/products/m-switch-kit/story-charge.webp", alt: "SALTHUB's M Switch poster — battery life last longer, Type-C charging port and the battery display", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
      },
      {
        id: "airflow",
        title: "Set the airflow",
        description: "SALTHUB says the slider lets you set the airflow precisely.",
        subline: "Slide the valve to adjust the airflow.",
        image: { src: "/assets/products/m-switch-kit/story-airflow.webp", alt: "SALTHUB's M Switch poster — airflow adjust valve", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
      },
      {
        id: "screen",
        title: "A digital screen",
        description: "At a full charge it shows 100% and switches off a second later.",
        subline: "It always shows what's left.",
        image: { src: "/assets/products/m-switch-kit/story-screen.webp", alt: "SALTHUB's M Switch poster — digital screen: battery level, charging indicator and full charge indicator", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
      },
      {
        id: "lanyard",
        title: "Comes with a lanyard",
        description: "SALTHUB suggests wearing it as an accessory.",
        subline: "Wear it round your neck and it's always to hand.",
        image: { src: "/assets/products/m-switch-kit/story-lanyard.webp", alt: "SALTHUB's M Switch poster — equipped with a lanyard", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
      },
    ],
    compatibility: [{ type: "pod", label: "M Switch Pod cartridge" }, typeC],
    whoIsThisFor: [
      "Anyone on disposables who feels it's a waste to throw the whole device away each time.",
    ],
    // Batch 3b: the FAQ "different from an M Bar disposable?" left — the head copy already says it twice.
    faqs: [],
    relatedProductSlugs: ["m-switch-pod", "zero-pro"],
    sourceUrls: ["https://www.salthub.com/", "https://www.salthub.com/m-switch-kit/"],
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
    // Owner 2026-10-08: the shop's admin list calls this pod "หัว M Bar 15K".
    searchAliases: ["M Bar 15K", "MBar 15K"],
    tagline: "The prefilled cartridge for the M Switch Kit.",
    shortDescription: "A prefilled replacement cartridge for the M Switch Kit device body — we sell the Kit as the M Bar 15K.",
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
        src: "/assets/products/m-switch-pod/card-v2.webp",
        alt: "SALTHUB M Switch Pod, Doublemint, black pod, tilted",
        angle: "upright pod tilted in 2D — the master every flavour photo is built on",
        transparentBackground: true,
        sourceName: "OKami24 cut-out (GPT Image) of SALTHUB's Doublemint pod photo",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03), extended (2026-09-04): re-fetched salthub.com's own
    // m-switch-pod/ page — 17 flavours since the owner removed Cool Mint on 2026-09-28. This record's own real Shipnity children
    // (Pod-147: Grape Aloe, Strawberry Watermelon, Apple Aloe) are a subset of this list. `availability: "unknown"` — no
    // Shipnity/stock integration for Legacy SALTHUB products.
    // 2026-09-30 (round "image-sitewide" batch 2): the owner confirmed the pod the shop sells with a photo of real stock —
    // black, glossy mouthpiece and collar, matte body, the flavour's coloured M + name tag (the 28/09 revert doubted the
    // black poster pod; BSOT §21). `image` = the pod alone, cut out of SALTHUB's own per-flavour photo, re-rendered sharp and
    // stood upright (v3 — owner 30/09: the tilted v2 showed its thick base; source + check per file in
    // scripts/process-images.map.json `aiRender`); `swatchHex` = its M logo colour (Pink Berry / Mixberry: the pink name tag,
    // owner 30/09). v4 (owner 30/09 on v3: "บางตัวปากกว้าง บางตัวเบี้ยว" — each flavour had been its own AI re-pose):
    // ONE master pod (the Doublemint re-pose) for every flavour, each with its own SALTHUB label (M logo + name tag) laid
    // on at the same size and spot — _incoming/image-sitewide/msw/v4.js; the kit photos and both fans are rebuilt from the
    // same pods. Owner rule (a) 30/09: the page opens on one sharp pod (card-v2 = the master, tilted); `openOnCardPhoto`.
    // No all-options image behind an "all" chip (owner 01/10: the made-up lineups go — back to the Caliburn way, one device
    // per option by swipe or chip).
    openOnCardPhoto: true,
    flavorVariants: [
      { id: "kyoho-grape", name: "Kyoho Grape", swatchHex: "#ab8cf0", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-kyoho-grape-v4.webp", alt: "SALTHUB M Switch Pod, Kyoho Grape — pod" } },
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#ffffff", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-apple-aloe-v4.webp", alt: "SALTHUB M Switch Pod, Apple Aloe — pod" } },
      { id: "black-berry", name: "Black Berry", swatchHex: "#5f3ac8", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-black-berry-v4.webp", alt: "SALTHUB M Switch Pod, Black Berry — pod" } },
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#76eefb", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-blue-ice-v4.webp", alt: "SALTHUB M Switch Pod, Blue Ice — pod" } },
      { id: "cola", name: "Cola", swatchHex: "#fc3b42", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-cola-v4.webp", alt: "SALTHUB M Switch Pod, Cola — pod" } },
      { id: "doublemint", name: "Doublemint", swatchHex: "#affafb", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-doublemint-v4.webp", alt: "SALTHUB M Switch Pod, Doublemint — pod" } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#906cfb", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-grape-aloe-v4.webp", alt: "SALTHUB M Switch Pod, Grape Aloe — pod" } },
      { id: "grape", name: "Grape", swatchHex: "#6533f6", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-grape-v4.webp", alt: "SALTHUB M Switch Pod, Grape — pod" } },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#fa5cd0", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-grape-lychee-v4.webp", alt: "SALTHUB M Switch Pod, Grape Lychee — pod" } },
      { id: "mango-passion", name: "Mango Passion", swatchHex: "#fdfa03", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-mango-passion-v4.webp", alt: "SALTHUB M Switch Pod, Mango Passion — pod" } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#f844bf", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-mixberry-v4.webp", alt: "SALTHUB M Switch Pod, Mixberry — pod" } },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#fa76ba", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-peach-strawberry-v4.webp", alt: "SALTHUB M Switch Pod, Peach Strawberry — pod" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#e34bef", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-pink-berry-v4.webp", alt: "SALTHUB M Switch Pod, Pink Berry — pod" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#fb5c83", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-strawberry-v4.webp", alt: "SALTHUB M Switch Pod, Strawberry — pod" } },
      { id: "strawberry-watermelon", name: "Strawberry Watermelon", swatchHex: "#81f334", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-strawberry-watermelon-v4.webp", alt: "SALTHUB M Switch Pod, Strawberry Watermelon — pod" } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#fb7a78", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-watermelon-v4.webp", alt: "SALTHUB M Switch Pod, Watermelon — pod" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#fb5866", availability: "unknown", image: { src: "/assets/products/m-switch-pod/variant-watermelon-bubblegum-v4.webp", alt: "SALTHUB M Switch Pod, Watermelon Bubblegum — pod" } },
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
    // Owner 2026-09-30 (chat, round "image-sitewide"): "หัวใส M bar 15k ลบออกได้เลย ในหน้า หัวพอต" — taken off the
    // storefront (not deleted: the record, photos and price stay; delete this line to bring it back).
    hiddenFromStorefront: { since: "2026-09-30", reason: "owner 30/09: remove the clear M Bar pod from the pods page" },
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
    categoryId: "switch-pods",
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
      batteryMah: 380,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        // Image round img-1610 16/10: the old card was the small shop photo — card-v2 = a studio re-shoot of it (same tilt).
        src: "/assets/products/zero-pro/card-v2.webp",
        alt: "SALTHUB Zero Pro, black-to-red pen-style device with M logo, isolated product shot",
        angle: "3/4, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from the shop photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from SALTHUB's photo",
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
    // Site-wide template round batch 3a (05/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — SALTHUB's own Zero Pro page
    // told one poster per block (full-bleed 1920-px posters, whole, down-sized only: _incoming/sitewide-template/3/3a/blocks.js;
    // the 1920-px banner is block 1, not a full-width cover — poster-stretch ×1.36, no larger SALTHUB file — LESSONS พ17);
    // text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. Not used: the spec card (its "2ML" disagrees with
    // the cartridge's 2.2mL), the colour charts and the package poster. "ทั้งหมด 1 / 2" = the page's own colour cut-outs in
    // SALTHUB's chart order, RELX Phantom layout (3a/lineup.js).
    storyDetails: true,
    storyLayout: "stage",
    storyStartRight: true,
    lineupImage: {
      src: "/assets/products/zero-pro/lineup-a.webp",
      alt: "SALTHUB Zero Pro, colours 1–4 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/zero-pro/lineup-b.webp",
      alt: "SALTHUB Zero Pro, colours 5–8 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    colorVariants: [
      { id: "blue-purple", name: "Blue Purple", swatchHex: "#4a4e8e", image: { src: "/assets/products/zero-pro/variant-blue-purple.webp", alt: "SALTHUB / Marbo Zero Pro, Blue Purple (official: Blue-Purple Gradient)" } },
      { id: "golden-fade", name: "Golden Fade", swatchHex: "#c9a24b", image: { src: "/assets/products/zero-pro/variant-golden-fade.webp", alt: "SALTHUB / Marbo Zero Pro, Golden Fade (official: Yellow and Black Gradient)" } },
      { id: "gunmetal", name: "Gunmetal", swatchHex: "#4a4d52", image: { src: "/assets/products/zero-pro/variant-gunmetal.webp", alt: "SALTHUB / Marbo Zero Pro, Gunmetal (official: Silver-Grey)" } },
      {
        id: "black",
        name: "Black",
        swatchHex: "#1a1a1a",
        // was this product's card photo; now its own cut-out so all 8 colours share one canvas
        image: { src: "/assets/products/zero-pro/variant-black-v3.webp", alt: "SALTHUB / Marbo Zero Pro, Black" },
      },
      { id: "pink", name: "Pink", swatchHex: "#e8899a", image: { src: "/assets/products/zero-pro/variant-pink.webp", alt: "SALTHUB / Marbo Zero Pro, Pink (official: Flesh Pink)" } },
      { id: "teal", name: "Teal", swatchHex: "#2a8a8a", image: { src: "/assets/products/zero-pro/variant-teal.webp", alt: "SALTHUB / Marbo Zero Pro, Teal (official: Light Blue)" } },
      { id: "red", name: "Red", swatchHex: "#b83a3a", image: { src: "/assets/products/zero-pro/variant-red.webp", alt: "SALTHUB / Marbo Zero Pro, Red" } },
      { id: "charcoal-red", name: "Charcoal Red", swatchHex: "#6e3535", image: { src: "/assets/products/zero-pro/variant-charcoal-red.webp", alt: "SALTHUB / Marbo Zero Pro, Charcoal Red (official: Black and Red Gradient)" } },
      // line 2 max-sync (22/10, owner "1 ลง"): Max name, no maker page — no photo yet. Max Pod-178-3 / -6 (salthub.com shows 8 colours without these names).
      { id: "copper", name: "Copper", swatchHex: "#b87333" },
      { id: "champagne", name: "Champagne", swatchHex: "#e8d5a8" },
    ],
    specifications: [
      // Batch 3a (05/10): rows from SALTHUB's own Zero Pro page + posters (_incoming/sitewide-template/3/facts-zero-pro.md). Left
      // out: capacity (poster "2ML" vs the cartridge's 2.2mL) and "POWER 3.2-4.2W" (unit doubtful); the home page's "Benefits —
      // ZERO PRO" box prints M Switch figures (600mAh, 15000 puffs) and is not used.
      // checker #273: SALTHUB prints "5000 Puffs" on the Zero Pro poster/card — not "per cartridge" (the head copy still says per pod; SEO round)
      { key: "puffs", label: "Rated puffs", value: "5,000 (SALTHUB's Zero Pro poster)", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
      { key: "modes", label: "Power modes", value: "3 modes — Low-end · Mid-range · High-end", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
      { key: "battery", label: "Battery capacity", value: "380mAh built-in", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
      { key: "resistance", label: "Resistance range", value: "0.5–2Ω", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
      { key: "airflow", label: "Airflow", value: "Side air intake", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
      { key: "charging", label: "Charging", value: "USB-C (SALTHUB: fast charging)", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/zero-pro/" },
    ],
    features: [
      {
        id: "intro",
        title: "The Zero Pro at a glance",
        description: "The two on SALTHUB's poster are the Silver-Grey and the Blue-Purple Gradient.",
        subline: "SALTHUB calls it compact and elegant.",
        image: { src: "/assets/products/zero-pro/story-intro.webp", alt: "SALTHUB's Zero Pro banner — 5000 puffs, 3 mode for every vaping mood", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/zero-pro/", width: 1920, height: 1024 },
      },
      {
        id: "modes",
        title: "Pick the mode you feel like",
        description: "Change between a softer and a stronger draw on the same device.",
        subline: "SALTHUB calls it intelligent power regulation.",
        image: { src: "/assets/products/zero-pro/story-modes.webp", alt: "SALTHUB's Zero Pro poster — 3 mode for every vaping mood: Low-end, Mid-range and High-end", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/zero-pro/", width: 1600, height: 853 },
      },
      {
        id: "airflow",
        title: "The path the air takes",
        description: "SALTHUB says that helps the liquid vaporise completely.",
        subline: "Air comes in from the side, so it has less far to travel.",
        image: { src: "/assets/products/zero-pro/story-airflow.webp", alt: "SALTHUB's Zero Pro poster — side air intake", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/zero-pro/", width: 1600, height: 853 },
      },
      {
        id: "battery",
        title: "A built-in battery",
        description: "SALTHUB says it charges fast, so a flat battery shouldn't keep you waiting long.",
        subline: "380mAh.",
        image: { src: "/assets/products/zero-pro/story-battery.webp", alt: "SALTHUB's Zero Pro poster — big battery with Type-C fast charging, 380mAh", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/zero-pro/", width: 1600, height: 853 },
      },
    ],
    compatibility: [{ type: "cartridge", label: "Zero Cartridge" }, typeC],
    whoIsThisFor: [
      "Vapers who want to change between a softer and a stronger draw on one small device.",
      "Anyone who likes a slim, pen-shaped device.",
    ],
    faqs: [],
    relatedProductSlugs: ["zero-nano", "zero-cartridge", "m-switch-kit"],
    sourceUrls: ["https://www.salthub.com/", "https://www.salthub.com/zero-pro/"],
  },
  {
    id: "zero-nano",
    slug: "zero-nano",
    brandId: "salthub",
    familyId: "zero",
    categoryId: "switch-pods",
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
        // Image-sitewide round 01/10: the old SALTHUB photo (card.webp, 443x567) was below the sharpness standard —
        // card-v3 (round img-1610 16/10) = a fresh studio render of that photo, teal and smoky pod matched to it (card-v2 left a halo on dark).
        src: "/assets/products/zero-nano/card-v3.webp",
        alt: "SALTHUB Zero Nano, teal compact device, isolated product shot",
        angle: "3/4, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from SALTHUB's own photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from SALTHUB's photo",
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
        src: "/assets/products/zero-cartridge/card-v2.webp",
        alt: "SALTHUB Zero Cartridge, smoke-clear cartridge with Strawberry Zero label, upright front view",
        angle: "upright, isolated — OKami24 Higgsfield studio re-shoot (IMAGE_SPEC §0 item 8, 08/10) of the Strawberry pod photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from SALTHUB's images",
        sourceUrl: "https://www.salthub.com/",
      },
    ],
    // Batch 3d (05/10): every flavour SALTHUB names (catalog completeness rule) — the 21 packs of its home slider "FLAVORS —
    // ZERO PRO" + Strawberry (the home card's pod label); _incoming/sitewide-template/3/facts-zero-cartridge.md. The shop's own
    // Shipnity children (Pod-85) are Apple Aloe + Fruit Tea. Swatch = the mean of the saturated pixels of SALTHUB's pack art (3d/names-and-swatches.js).
    // Round "option photos" 06/10: now that every flavour has a photo the hero would lead with the first flavour — it keeps
    // opening on the card (SALTHUB's own Strawberry pod) as before, like every other SALTHUB page; flavours by swipe or chip.
    openOnCardPhoto: true,
    // Photos (round "option photos" 06/10): each pod cut from SALTHUB's own flavour poster with one outline common to all 21;
    // Strawberry (no poster) = the real Peach Strawberry pod + an AI-drawn Strawberry band after SALTHUB's home-card pod
    // (_incoming/option-photos/b2/). `availability: "unknown"` as every Legacy SALTHUB product.
    // Image-look roll-out J5 (08/10, G5 bar): every pod re-shot in studio light by AI from that cut (four flavours per render,
    // same light on all; Mango + Strawberry one each), upright, own contact shadow kept (ownFloor); the card = the Strawberry
    // render upright. Source + check per file in scripts/process-images.map.json `aiRender`.
    flavorVariants: [
      { id: "apple-aloe", name: "Apple Aloe", swatchHex: "#7ac465", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-apple-aloe-v2.webp", alt: "SALTHUB Zero Cartridge, Apple Aloe", ownFloor: true } },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3b4fa0", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-blueberry-v2.webp", alt: "SALTHUB Zero Cartridge, Blueberry", ownFloor: true } },
      { id: "cigar", name: "Cigar", swatchHex: "#905e36", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-cigar-v2.webp", alt: "SALTHUB Zero Cartridge, Cigar", ownFloor: true } },
      { id: "cola", name: "Cola", swatchHex: "#7e4d2f", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-cola-v2.webp", alt: "SALTHUB Zero Cartridge, Cola", ownFloor: true } },
      { id: "fruit-tea", name: "Fruit Tea", swatchHex: "#b57c28", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-fruit-tea-v3.webp", alt: "SALTHUB Zero Cartridge, Fruit Tea", ownFloor: true } },
      { id: "grape", name: "Grape", swatchHex: "#a064a9", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-grape-v3.webp", alt: "SALTHUB Zero Cartridge, Grape", ownFloor: true } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#6dab74", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-grape-aloe-v3.webp", alt: "SALTHUB Zero Cartridge, Grape Aloe", ownFloor: true } },
      { id: "grapefruit", name: "Grapefruit", swatchHex: "#cd7035", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-grapefruit-v3.webp", alt: "SALTHUB Zero Cartridge, Grapefruit", ownFloor: true } },
      { id: "honey-yuzu", name: "Honey Yuzu", swatchHex: "#cd9d1f", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-honey-yuzu-v2.webp", alt: "SALTHUB Zero Cartridge, Honey Yuzu", ownFloor: true } },
      { id: "ice-sparkling", name: "Ice Sparkling", swatchHex: "#4dc3d6", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-ice-sparkling-v2.webp", alt: "SALTHUB Zero Cartridge, Ice Sparkling", ownFloor: true } },
      { id: "lemonade", name: "Lemonade", swatchHex: "#c9d249", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-lemonade-v2.webp", alt: "SALTHUB Zero Cartridge, Lemonade", ownFloor: true } },
      { id: "lychee", name: "Lychee", swatchHex: "#cb4e61", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-lychee-v2.webp", alt: "SALTHUB Zero Cartridge, Lychee", ownFloor: true } },
      { id: "mango", name: "Mango", swatchHex: "#d68b1c", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-mango-v2.webp", alt: "SALTHUB Zero Cartridge, Mango", ownFloor: true } },
      { id: "mint", name: "Mint", swatchHex: "#67bc7c", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-mint-v2.webp", alt: "SALTHUB Zero Cartridge, Mint", ownFloor: true } },
      { id: "mixberry", name: "Mixberry", swatchHex: "#8b4791", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-mixberry-v2.webp", alt: "SALTHUB Zero Cartridge, Mixberry", ownFloor: true } },
      { id: "oolong-tea", name: "Oolong Tea", swatchHex: "#be9250", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-oolong-tea-v2.webp", alt: "SALTHUB Zero Cartridge, Oolong Tea", ownFloor: true } },
      { id: "peach", name: "Peach", swatchHex: "#d46c79", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-peach-v2.webp", alt: "SALTHUB Zero Cartridge, Peach", ownFloor: true } },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#ba3a34", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-peach-strawberry-v2.webp", alt: "SALTHUB Zero Cartridge, Peach Strawberry", ownFloor: true } },
      { id: "pineapple", name: "Pineapple", swatchHex: "#c3af38", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-pineapple-v2.webp", alt: "SALTHUB Zero Cartridge, Pineapple", ownFloor: true } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c9405f", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-strawberry-v2.webp", alt: "SALTHUB Zero Cartridge, Strawberry", ownFloor: true } },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-watermelon-v2.webp", alt: "SALTHUB Zero Cartridge, Watermelon", ownFloor: true } },
      { id: "yakult", name: "Yakult", swatchHex: "#de6569", availability: "unknown", image: { src: "/assets/products/zero-cartridge/variant-yakult-v2.webp", alt: "SALTHUB Zero Cartridge, Yakult", ownFloor: true } },
      // line 2 max-sync (22/10): the 50mg pods Shipnity Max lists (Pod-85-20..24, 26..31) — Max names; no photo yet.
      { id: "peach-strawberry-50mg", name: "Peach Strawberry 50mg", swatchHex: "#e07a6b", availability: "unknown" },
      { id: "watermelon-50mg", name: "Watermelon 50mg", swatchHex: "#d94f6b", availability: "unknown" },
      { id: "grape-50mg", name: "Grape 50mg", swatchHex: "#6b4a8e", availability: "unknown" },
      { id: "grape-aloe-50mg", name: "Grape Aloe 50mg", swatchHex: "#7a5a9e", availability: "unknown" },
      { id: "apple-aloe-50mg", name: "Apple Aloe 50mg", swatchHex: "#8ab84a", availability: "unknown" },
      { id: "mint-50mg", name: "Mint 50mg", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "mixberry-50mg", name: "Mixberry 50mg", swatchHex: "#8e3a6b", availability: "unknown" },
      { id: "cola-50mg", name: "Cola 50mg", swatchHex: "#4a2f1f", availability: "unknown" },
      { id: "pink-berry-50mg", name: "Pink Berry 50mg", swatchHex: "#d94f8e", availability: "unknown" },
      { id: "banana-strawberry-50mg", name: "Banana Strawberry 50mg", swatchHex: "#e0a05a", availability: "unknown" },
      { id: "menthol-freeze-50mg", name: "Menthol Freeze 50mg", swatchHex: "#7fc8d8", availability: "unknown" },
    ],
    specifications: [
      { key: "capacity", label: "Capacity", value: "2.2mL", sourceStatus: "verified", sourceUrl: "https://www.salthub.com/" },
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
