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
    // Opens the story (designer 30/09: a campaign image, not a coil fact — it no longer sits beside the coil text;
    // cotton mesh stays in the spec sheet).
    storyCover: { src: "/assets/products/m-bar-10k/angle-01.webp", alt: "Official SALTHUB M Bar 10K campaign image, \"Timeless Elegance\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1229 },
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
    ],
    // 2026-09-30: `image` = the maker's own poster for each highlight, told one per block in "more details"
    // (`storyDetails`); mesh-coil has none, so it is not a block there (spec sheet row stays). bottle-shape /
    // ten-k-puffs were added for posters 02 / 05 (writer, verified spec rows only).
    features: [
      {
        id: "bottle-shape",
        title: "E-liquid bottle shape",
        description: "Shaped like a classic e-liquid bottle, with a colour gradient at the base that differs from flavour to flavour.",
        image: { src: "/assets/products/m-bar-10k/angle-02.webp", alt: "Official SALTHUB M Bar 10K poster, \"Understated luxury radiates from within\"", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1085 },
      },
      {
        id: "three-modes",
        title: "Three power modes",
        description: "Eco, Soft, and Boost modes are cycled with a double-click, changing output character without any menu.",
        image: { src: "/assets/products/m-bar-10k/story-04.webp", alt: "Official SALTHUB M Bar 10K poster, \"Your tempo, your call\" — double-click the bottom button to switch Eco / Soft / Boost", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1600, height: 898 },
      },
      {
        id: "rgb-indicator",
        title: "RGB mode indicator",
        description: "A colour-coded LED shows which of the three power modes is currently active at a glance.",
        image: { src: "/assets/products/m-bar-10k/angle-03.webp", alt: "SALTHUB M Bar 10K mini display, 4-LED battery indicator and Eco/Soft/Boost RGB status indicator", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1096 },
      },
      {
        id: "ten-k-puffs",
        title: "Up to 10,000 puffs",
        description: "Rated for up to 10,000 puffs, with a 600mAh battery you recharge over USB-C when it runs low.",
        image: { src: "/assets/products/m-bar-10k/story-05.webp", alt: "Official SALTHUB M Bar 10K poster, \"Built for nonstop performance\" — up to 10,000 puffs", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1600, height: 899 },
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
      // Batch 3e: Black Berry is on SALTHUB's 15K flavour chart (posters 04+05) but has no SALTHUB photo for the 15K → swatch only
      { id: "black-berry", name: "Black Berry", swatchHex: "#5f3ac8", availability: "unknown" },
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
    sourceUrls: ["https://www.salthub.com/", "https://www.salthub.com/m-bar-15k/"],
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
      batteryMah: 380,
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
        // Image-sitewide round 01/10: the old SALTHUB photo (card.webp, 443x567) was below the sharpness standard —
        // card-v2 = the night render in the same 3/4 pose, teal matched to that photo (_incoming/image-sitewide/b-voopoo/zero-nano.js).
        src: "/assets/products/zero-nano/card-v2.webp",
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
