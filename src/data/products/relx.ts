import type { Product } from "@/types/catalog";

const INFINITY_PAGE = "https://relxnow.com/products/relx-infinity-2-plus-device";
const infinityPhoto = (id: string, name: string) => ({ src: `/assets/products/relx-infinity-2-plus/variant-${id}-v2-wm5.webp`, alt: `RELX Infinity 2 Plus, ${name}` });
const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const relxProducts: Product[] = [
  {
    // Round popular models 07/11: searched (relx novo 590 a month), not in the warehouse, no price, no cart, no maker page (relxnow.com does not
    // list it). Owner 07/11: a fact only where 3 independent shops agree, in the copy, never a spec row. Read 07/11 in the browser: maneevp ·
    // yaivapestore · vapedeliverybkk: 14,000 puffs, 500mAh, a display, these 14 flavours. Not agreed, so
    // not written: liquid (12 or 20mL), Cola and adjustable airflow (two shops each).
    id: "relx-novo-14k",
    slug: "relx-novo-14k",
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Novo 14K",
    displayName: "RELX NOVO 14K",
    searchAliases: ["RELX Novo","Novo 14K","Novo 14000"],
    tagline: "A disposable in brushed grey with a dot display down one side.",
    shortDescription:
      "A rounded disposable with a brushed grey body and a black panel that lights up in dots. Pick from the flavours below.",
    isFlagship: false,
    attributes: {
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-novo-14k/card-wm5.webp",
        alt: "RELX Novo 14K, brushed grey body with a dot display, three-quarter view",
        angle: "three-quarter, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/relx-novo-14k",
      },
    ],
    flavorVariants: [
      { id: "apple", name: "Apple", swatchHex: "#8cc63f", availability: "unknown" },
      { id: "blueberry", name: "Blueberry", swatchHex: "#4a5fb0", availability: "unknown" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown" },
      { id: "grape-apple", name: "Grape Apple", swatchHex: "#9a8bc4", availability: "unknown" },
      { id: "longjing-ice-tea", name: "LongJing Ice Tea", swatchHex: "#a8b56a", availability: "unknown" },
      { id: "mix-berry", name: "Mix Berry", swatchHex: "#a24a7e", availability: "unknown" },
      { id: "orange-soda", name: "Orange Soda", swatchHex: "#f28a2e", availability: "unknown" },
      { id: "sea-salt-lemon", name: "Sea Salt Lemon", swatchHex: "#e6d44f", availability: "unknown" },
      { id: "sour-berry", name: "Sour Berry", swatchHex: "#c9456f", availability: "unknown" },
      { id: "sour-bubblegum", name: "Sour Bubblegum", swatchHex: "#e86fb0", availability: "unknown" },
      { id: "sour-lime-ice", name: "Sour Lime Ice", swatchHex: "#a6d66b", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#e4476a", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e4576a", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "14,000", sourceStatus: "unverified" }],
    features: [
      { id: "panel", title: "A lit panel on the side", description: "The black panel lights up in dots and shows a number, so the state of the device is easy to read." },
      { id: "figures", title: "The figures shops agree on", description: "RELX has no page for this model, so these come from shops that sell it and agree: 14,000 puffs and a 500mAh battery." },
    ],
    compatibility: [],
    whoIsThisFor: ["You came looking for the Novo by name, or you like a rounded disposable with a lit panel."],
    faqs: [],
    relatedProductSlugs: ["relx-smash-go-12k"],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/relx-novo-14k"],
  },
  {
    // Round popular models 07/11: the most searched model we lack (relx sparta 20k 2,400 a month). Not in the warehouse, no price, no cart; no
    // maker page anywhere (relxnow.com does not list it). Owner 07/11: list it anyway, our own words, a fact only where 3 independent shops
    // agree, written in the copy, never as a spec row. Read 07/11 in the browser: goatvapethai · maneevp (with zeedcupvp and yaivapestore,
    // same wording) · relxth.co (with sudjudpod, same flavour order). All three: 20,000 puffs, 750mAh, Type-C, a display, airflow and power
    // you can adjust, these 16 flavours. Not agreed, so not written: liquid (18 or 20mL), nicotine, and the 5 flavours in two groups only
    // (Grape Aloe, Watermelon Bubblegum, Polar Mint, Pink Berry, Lychee).
    id: "relx-sparta-20k",
    slug: "relx-sparta-20k",
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Sparta 20K",
    displayName: "RELX SPARTA 20K",
    searchAliases: ["RELX Sparta", "Sparta 20K", "Sparta 20000"],
    tagline: "A disposable with a scaled black body and a small display.",
    shortDescription:
      "A disposable in a black body with a scaled pattern and a round display near the base. Airflow and power both adjust. Pick from the flavours below.",
    isFlagship: false,
    attributes: {
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-sparta-20k/card-wm5.webp",
        alt: "RELX Sparta 20K, black scaled body, front view",
        angle: "front, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/relx-sparta-20k",
      },
    ],
    flavorVariants: [
      { id: "apple", name: "Apple", swatchHex: "#8cc63f", availability: "unknown" },
      { id: "blueberry", name: "Blueberry", swatchHex: "#4a5fb0", availability: "unknown" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#b08ac4", availability: "unknown" },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#9fd3e8", availability: "unknown" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#a24a7e", availability: "unknown" },
      { id: "oolong-ice-tea", name: "Oolong Ice Tea", swatchHex: "#b5853f", availability: "unknown" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#f2a093", availability: "unknown" },
      { id: "pineapple", name: "Pineapple", swatchHex: "#f2c53b", availability: "unknown" },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#e86fb0", availability: "unknown" },
      { id: "raspberry-mint", name: "Raspberry Mint", swatchHex: "#c9456f", availability: "unknown" },
      { id: "sour-gummy", name: "Sour Gummy", swatchHex: "#c8d94a", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#e4476a", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e4576a", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "20,000", sourceStatus: "unverified" }],
    features: [
      { id: "display", title: "A display near the base", description: "The round display shows the liquid and the battery left, so you are not guessing." },
      { id: "adjust", title: "Airflow and power", description: "You can set the airflow and step the power up or down, rather than taking one fixed draw." },
      { id: "figures", title: "The figures shops agree on", description: "RELX has no page for this model, so these come from shops that sell it and agree: 20,000 puffs, a 750mAh battery and USB-C charging." },
    ],
    compatibility: [],
    whoIsThisFor: ["You came looking for the Sparta by name, or you want a high-puff disposable with a display."],
    faqs: [],
    relatedProductSlugs: ["relx-smash-go-12k"],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/relx-sparta-20k"],
  },
  {
    // Round popular models 07/11: searched, not in the warehouse, no maker page anywhere (relxnow.com does not list it), so no
    // price and no cart. Owner 07/11: list it anyway, our own words, a fact only where 3 independent shops agree. Shops that agree:
    // goatvapethai, maneevp and zeedcupvp (counted as one, same spec text), vapedumpthailand.store: the 30K in the name and the flavour list.
    // No spec row: the row gate takes a maker source only. Flavour pictures: none yet (IMAGE_SPEC §4).
    id: "relx-diva-30k",
    slug: "relx-diva-30k",
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Diva 30K",
    displayName: "RELX DIVA 30K",
    tagline: "A pebble-shaped disposable with a two-tone body and a small display.",
    shortDescription:
      "A rounded, two-tone disposable with a teardrop display on the front. Pick from the flavours below; each one shows whether it comes in the stronger version.",
    isFlagship: false,
    attributes: {
      portability: "compact",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-diva-30k/card-wm5.webp",
        alt: "RELX Diva 30K, lilac top and pink-blue body, front view",
        angle: "front, isolated: studio remake",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from a vape retailer's poster",
        sourceUrl: "https://okami24.store/products/relx-diva-30k",
      },
    ],
    flavorVariants: [
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "fresh-melon", name: "Fresh Melon", swatchHex: "#a6d66b", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown" },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#9a8bc4", availability: "unknown" },
      { id: "mango-passion-fruit", name: "Mango Passion Fruit", swatchHex: "#f2a93b", availability: "unknown" },
      { id: "mineral-water", name: "Mineral Water", swatchHex: "#9fd3e8", availability: "unknown" },
      { id: "mix-berry", name: "Mixed Berry", swatchHex: "#a24a7e", availability: "unknown" },
      { id: "orange-splash", name: "Orange Splash", swatchHex: "#f28a2e", availability: "unknown" },
      { id: "spearmint", name: "Spearmint", swatchHex: "#5fbf9a", availability: "unknown" },
      { id: "strawberry-ice-cream", name: "Strawberry Ice Cream", swatchHex: "#f2a2b5", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#e4576a", availability: "unknown" },
      { id: "cola-5", name: "Cola 5%", swatchHex: "#6b4423", availability: "unknown" },
      { id: "copico-coffee-5", name: "Copico Coffee 5%", swatchHex: "#7a5238", availability: "unknown" },
      { id: "double-mint-5", name: "Double Mint 5%", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape-5", name: "Grape 5%", swatchHex: "#8a6bb0", availability: "unknown" },
      { id: "watermelon-5", name: "Watermelon 5%", swatchHex: "#e4576a", availability: "unknown" },
    ],
    specifications: [{ key: "puffs", label: "Rated puffs", value: "30,000", sourceStatus: "unverified" }],
    features: [
      { id: "shape", title: "A body that sits in the hand", description: "It is short and rounded, like a pebble, so it stays small in the palm or a pocket." },
      { id: "display", title: "A teardrop display", description: "The black teardrop on the front is what you check, rather than guessing how much is left." },
    ],
    compatibility: [],
    whoIsThisFor: [
      "You came looking for the DIVA by name, or you like a rounded disposable you can pick by flavour.",
    ],
    faqs: [],
    relatedProductSlugs: ["relx-smash-go-12k"],
    // Our own page: no maker page exists, and SourceNote drops our own address, so a shop is never linked.
    sourceUrls: ["https://okami24.store/products/relx-diva-30k"],
  },
  {
    id: "relx-smash-go-12k",
    slug: "relx-smash-go-12k",
    brandId: "relx",
    familyId: "relx-disposables",
    categoryId: "disposables",
    systemType: "disposable",
    name: "RELX Smash Go 12K",
    displayName: "RELX SMASH GO 12K",
    tagline: "RELX's official high-puff disposable, MEGA MESH coil.",
    shortDescription:
      "A 12,000-puff rechargeable disposable from RELX's own official global lineup — 400mAh battery and a MEGA MESH coil, in 27 flavors including 5% nicotine versions.",
    isFlagship: true,
    // Round 30.4 ก8 (owner 2026-09-13): was "Tier-1 priority" — an internal note. The home
    // flagship rail shows this card next to three "รุ่นเรือธง" badges, and the data already says
    // isFlagship, so the label follows. hasEditorialTag stays true → card order unchanged.
    editorialTag: "Flagship",
    // Confirmed via YouTube oEmbed (2026-09-03): real video, correct title, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "0b6Q9DzWrRQ", title: "RELX SMASH GO 12K ง่าย แต่ ดี!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-02" },
    attributes: {
      batteryMah: 400,
      puffCount: 12000,
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
        src: "/assets/products/relx-smash-go-12k/card-v2-wm5.webp",
        alt: "RELX Smash Go 12K, Grape colourway, isolated product shot",
        angle: "Front, isolated — official RELX product photography (relxnow.com Shopify files, native 1224×1224), background-removed by OKami24. Re-processed 2026-09-06 (LAUNCH_AUDIT 11) through scripts/process-images.ts from the native files: device ≈722px on the 1000px canvas (was 712px with JPEG artefacts). 1224px is the largest original RELX publishes; the owner lifted the 800px floor on 2026-09-06 (largest real original, no upscaling). Sources: _incoming/relx-smash-go-12k/SOURCE.md",
        transparentBackground: true,
        sourceName: "RELX (official brand site, relxnow.com)",
        sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k",
      },
    ],
    // Real flavor lineup — Tier-1 disposable growth mission (2026-09-03). All 10 names AND their
    // own dedicated device photos are directly confirmed on relxnow.com's own Smash Go 12K product
    // page (Shopify `featured_image`/`variants` data, filenames `RELX_SMASH_GO_12K_<Flavor>.jpg`) —
    // genuine Tier-1 official evidence, the strongest of any product added this mission. Every
    // photo passed this catalog's QC standard after background removal (no watermark, no clutter,
    // sharp, correctly identified). `availability: "unknown"` — this product has no Shipnity
    // integration (newly admitted to the catalog this mission, not yet in operational stock data).
    flavorVariants: [
      { id: "apple", name: "Apple", swatchHex: "#7cb342", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-apple-v2-wm5.webp", alt: "RELX Smash Go 12K, Apple" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "cola", name: "Cola", swatchHex: "#6b4423", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-cola-v2-wm5.webp", alt: "RELX Smash Go 12K, Cola" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2-wm5.webp", alt: "RELX Smash Go 12K, Double Mint" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape", name: "Grape", swatchHex: "#8a6bb0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-v2-wm5.webp", alt: "RELX Smash Go 12K, Grape" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "grape-lychee", name: "Grape Lychee", swatchHex: "#9b5fa8", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-lychee-v2-wm5.webp", alt: "RELX Smash Go 12K, Grape Lychee" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "green-mango", name: "Green Mango", swatchHex: "#a8c53e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-green-mango-v2-wm5.webp", alt: "RELX Smash Go 12K, Green Mango" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "mixberry", name: "Mixberry", swatchHex: "#6b3a5e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry-v2-wm5.webp", alt: "RELX Smash Go 12K, Mixberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "passion-fruit", name: "Passion Fruit", swatchHex: "#e0a83e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-passion-fruit-v2-wm5.webp", alt: "RELX Smash Go 12K, Passion Fruit" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "peach-strawberry", name: "Peach Strawberry", swatchHex: "#e07a6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-peach-strawberry-v2-wm5.webp", alt: "RELX Smash Go 12K, Peach Strawberry" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Watermelon" }, sourceUrl: "https://www.relxnow.com/products/relx-smash-go-12k" },
      // line 2 max-sync (22/10): 17 more options in Shipnity Max (Disposable-39-11..27) — not on relxnow.com's global page (the 5% ones
      // are its 5% strength); Max names, "<Flavour> 5%" written one way.
      // Photos (line 1, 22/10): the device differs by flavour only in its stripe colour, and the live 10 are 5 colour groups
      // of one studio master (process-images.map.json, img-1610 b7). Each new option points at the live file of the
      // colour its stripe has on that flavour's retailer poster (pod789.com/product/relx-smash-go-12k, _incoming/smash/src) — pink berry + grape aloe lavender,
      // lychee + watermelon bubblegum + pink guava + strawberry red, oolong tea + cool mint + spearmint green, blueberry +
      // classic tobacco blue, pineapple yellow; a 5% option = its 3% flavour's photo (strength is not visible on the device).
      { id: "grape-5", name: "Grape 5%", swatchHex: "#8a6bb0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-v2-wm5.webp", alt: "RELX Smash Go 12K, Grape 5%" } },
      { id: "watermelon-5", name: "Watermelon 5%", swatchHex: "#d94f6b", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Watermelon 5%" } },
      { id: "cola-5", name: "Cola 5%", swatchHex: "#6b4423", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-cola-v2-wm5.webp", alt: "RELX Smash Go 12K, Cola 5%" } },
      { id: "double-mint-5", name: "Double Mint 5%", swatchHex: "#3ea88a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2-wm5.webp", alt: "RELX Smash Go 12K, Double Mint 5%" } },
      { id: "cool-mint-5", name: "Cool Mint 5%", swatchHex: "#5ec4b0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2-wm5.webp", alt: "RELX Smash Go 12K, Cool Mint 5%" } },
      { id: "spearmint-5", name: "Spearmint 5%", swatchHex: "#4fb07a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2-wm5.webp", alt: "RELX Smash Go 12K, Spearmint 5%" } },
      { id: "mixberry-5", name: "Mixberry 5%", swatchHex: "#6b3a5e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry-v2-wm5.webp", alt: "RELX Smash Go 12K, Mixberry 5%" } },
      { id: "classic-tobacco-5", name: "Classic Tobacco 5%", swatchHex: "#8a6a45", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry-v2-wm5.webp", alt: "RELX Smash Go 12K, Classic Tobacco 5%" } },
      { id: "pink-berry", name: "Pink Berry", swatchHex: "#d94f8e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-v2-wm5.webp", alt: "RELX Smash Go 12K, Pink Berry" } },
      { id: "lychee", name: "Lychee", swatchHex: "#f0c0d0", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Lychee" } },
      { id: "watermelon-bubblegum", name: "Watermelon Bubblegum", swatchHex: "#e86a8a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Watermelon Bubblegum" } },
      { id: "grape-aloe", name: "Grape Aloe", swatchHex: "#7a5a9e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-grape-v2-wm5.webp", alt: "RELX Smash Go 12K, Grape Aloe" } },
      { id: "oolong-tea", name: "Oolong Tea", swatchHex: "#a07a3a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-double-mint-v2-wm5.webp", alt: "RELX Smash Go 12K, Oolong Tea" } },
      { id: "pink-guava", name: "Pink Guava", swatchHex: "#e8808a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Pink Guava" } },
      { id: "blueberry", name: "Blueberry", swatchHex: "#3a4a8e", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-mixberry-v2-wm5.webp", alt: "RELX Smash Go 12K, Blueberry" } },
      { id: "strawberry", name: "Strawberry", swatchHex: "#d9405a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-watermelon-v2-wm5.webp", alt: "RELX Smash Go 12K, Strawberry" } },
      { id: "pineapple", name: "Pineapple", swatchHex: "#e0c93a", availability: "unknown", image: { src: "/assets/products/relx-smash-go-12k/variant-passion-fruit-v2-wm5.webp", alt: "RELX Smash Go 12K, Pineapple" } },
    ],
    // Site-wide template round batch 4c (06/10): the G5 template — RELX's own pictures, one per block (blocks.js in
    // _incoming/sitewide-template/4/4c/); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. Cover = RELX's KV.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/relx-smash-go-12k/story-cover.webp", alt: "RELX's Smash Go 12K key visual — supreme taste, five pens", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 2512, height: 1134 },
    specifications: [
      // Data round (2026-09-24, real browser): relxnow.com "Specifications" — Battery 400mAh · Size 20ml · Charging Port
      // Type-C · Puffs 12000 · Nicotine 3% / 5% · "Upgraded Mega MESH". It states no resistance, so "1.0Ω" is dropped;
      // Details 02/11: the same page's description says "a generous 18ml e-liquid capacity" while the table says "Size 20ml" —
      // RELX contradicts itself, so the capacity row is dropped until a pack or RELX settles it.
      { key: "puffs", label: "Rated puffs", value: "Up to 12,000", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "battery", label: "Battery", value: "400mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "coil", label: "Coil", value: "MEGA MESH coil", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
      { key: "nicotine", label: "Nicotine strength", value: "3% or 5% nicotine salt", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k" },
    ],
    features: [
      {
        id: "inside",
        title: "What's inside",
        description: "Up to 12,000 puffs, on a 400mAh battery you can recharge.",
        subline: "RELX shows its coil up close.",
        image: { src: "/assets/products/relx-smash-go-12k/story-inside.webp", alt: "RELX's Smash Go 12K picture — the coil, up close", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 1224, height: 1224 },
      },
      {
        id: "pocket",
        title: "Comfortable to vape, easy to carry",
        description: "It's pocket-sized, so it comes along wherever you go.",
        subline: "RELX designed the mouthpiece to be comfortable on the lips.",
        image: { src: "/assets/products/relx-smash-go-12k/story-pocket.webp", alt: "RELX's Smash Go 12K picture — comfortable mouthpiece design, pocket size", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 1224, height: 1224 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "You want a disposable that's easy to carry and slips into a pocket for the whole day.",
    ],
    faqs: [
      {
        id: "relx-smash-go-12k-what",
        question: "What kind of device is the RELX Smash Go 12K?",
        answer: "It's a rechargeable disposable from RELX, rated at up to 12,000 puffs, with a MEGA MESH coil and a pocket-sized body.",
      },
      {
        id: "relx-smash-go-12k-charge",
        question: "Can you recharge the RELX 12K?",
        answer: "Yes. The 400mAh battery charges over USB-C, so when it runs out you can plug it in and carry on.",
      },
      {
        id: "relx-smash-go-12k-days",
        question: "How many days do 12,000 puffs last on the RELX Smash Go?",
        answer: "There's no fixed number of days. It varies from person to person, and heavier use finishes it sooner. 12,000 puffs is the most RELX states, so the days depend on how often you vape and how long each draw is.",
      },
      {
        id: "relx-smash-go-12k-strength",
        question: "What nicotine strength is the RELX Smash Go 12K?",
        answer: "It comes in 3% and 5% nicotine salt. The 5% flavours have 5% at the end of the name, so check the name before you choose.",
      },
      {
        id: "relx-smash-go-12k-review",
        question: "Is there a review of the RELX Smash Go 12K?",
        answer: "Yes. OKami24 made a review clip on YouTube, and you can watch it on this page.",
      },
    ],
    relatedProductSlugs: ["relx-creator"],
    sourceUrls: ["https://www.relxnow.com/products/relx-smash-go-12k"],
  },
  {
    // Round p63 (owner 16/10, list item 63 — BSOT §4): customers search "relx infinity". RELX's global store (relxnow.com)
    // sells only the Infinity 2 Plus Device now (no page for the first Infinity or the Infinity 2). The warehouse lists it
    // (Shipnity Max Pod-105, every colour "ไม่มีของ" on 08/10) — sku-map maps the codes; price = warehouse ฿990 (owner item 69, 16/10 — legacy-price-approvals), shown with the sold-out state.
    id: "relx-infinity-2-plus",
    slug: "relx-infinity-2-plus",
    brandId: "relx",
    familyId: "relx-infinity",
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "RELX Infinity 2 Plus",
    displayName: "RELX INFINITY 2 PLUS",
    searchAliases: ["RELX Infinity", "Infinity 2 Plus"],
    tagline: "RELX's current Infinity, with three power modes from 6.5W to 10W.",
    shortDescription:
      "A closed pod system from RELX with Eco, Smooth and Boost modes at 6.5W, 8W and 10W. Its 440mAh battery charges over USB-C, reaching 80% in 15 minutes by RELX's figure, and a 4-stage indicator shows what's left. It takes RELX Pod, RELX Pod Pro and RELX Pod Pro 2.",
    isFlagship: false,
    attributes: {
      batteryMah: 440,
      wattageMin: 6.5,
      wattageMax: 10,
      screenType: "led-indicator",
      portability: "compact",
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        // Image round img-1610 16/10: card-v3 = studio re-shoot with the real cap (grey disc + V groove; checker #540 r2 taste note on card-v2).
        src: "/assets/products/relx-infinity-2-plus/card-v3-wm5.webp",
        alt: "RELX Infinity 2 Plus, Black Sapphire, front view",
        angle: "front, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from RELX's own Black Sapphire front render",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from RELX's store image (relxnow.com)",
        sourceUrl: INFINITY_PAGE,
      },
    ],
    openOnCardPhoto: true,
    // RELX's six colours in its store's order. -v2 (image run 23/10): studio photos made from the card-v3 studio render, each colour an edit
    // of it with RELX's own store image of that colour, all cut with the card's outline (same size and place for every option).
    colorVariants: [
      { id: "misty-leaf", name: "Misty Leaf", swatchHex: "#d9e3cd", image: infinityPhoto("misty-leaf", "Misty Leaf") },
      { id: "blue-bay", name: "Blue Bay", swatchHex: "#b4cddb", image: infinityPhoto("blue-bay", "Blue Bay") },
      { id: "black-sapphire", name: "Black Sapphire", swatchHex: "#3d424c", image: infinityPhoto("black-sapphire", "Black Sapphire") },
      { id: "rose-gold", name: "Rose Gold", swatchHex: "#f9d3d2", image: infinityPhoto("rose-gold", "Rose Gold") },
      { id: "meteor-flash", name: "Meteor Flash", swatchHex: "#c5c5c7", image: infinityPhoto("meteor-flash", "Meteor Flash") },
      { id: "bronze-dusk", name: "Bronze Dusk", swatchHex: "#b39280", image: infinityPhoto("bronze-dusk", "Bronze Dusk") },
      // Max Pod-105-2. Not on relxnow.com (it lists the other 6) but a real RELX colour: the Malaysian dealer vapehaus.com.my sells
      // "Dark Asteroid" with RELX's store render of it (dark gunmetal grey body, black cap), kissyvape.com names it 深灰 (dark grey).
      // Photo = the same studio edit as the six above, from that render (image line 1, 23/10).
      { id: "dark-asteroid", name: "Dark Asteroid", swatchHex: "#7d7e81", image: infinityPhoto("dark-asteroid", "Dark Asteroid") },
    ],
    // relxnow.com spec block + description + the "What's Special" tab (rendered by script — read in a browser 16/10):
    // "Eco Mode … operates at 6.5W" · "Smooth Mode … is set at 8W" · "Boost Mode … reaches an impressive 10W" ·
    // "4-Stage Battery Indicator". Quotes: _incoming/p63/research.md (checker #540 r1 read only the static HTML).
    specifications: [
      { key: "power", label: "Power modes", value: "Eco 6.5W · Smooth 8W · Boost 10W", sourceStatus: "verified", sourceUrl: INFINITY_PAGE },
      { key: "battery", label: "Battery", value: "440mAh built-in", sourceStatus: "verified", sourceUrl: INFINITY_PAGE },
      { key: "charging", label: "Charging", value: "USB-C · 80% in 15 minutes (RELX's figure)", sourceStatus: "verified", sourceUrl: INFINITY_PAGE },
      { key: "indicator", label: "Display", value: "4-stage battery indicator", sourceStatus: "verified", sourceUrl: INFINITY_PAGE },
      { key: "pods", label: "Pod platform", value: "RELX Pod · RELX Pod Pro · RELX Pod Pro 2 — 1.9mL, up to 600 puffs (RELX's figures)", sourceStatus: "verified", sourceUrl: INFINITY_PAGE },
    ],
    features: [
      { id: "modes", title: "Eco, Smooth and Boost", description: "Switch between Eco at 6.5W, Smooth at 8W and Boost at 10W. RELX says Boost gives up to 15% more vapor than Smooth." },
      { id: "charging", title: "80% in 15 minutes", description: "The 440mAh battery charges over USB-C, and RELX quotes 15 minutes to reach 80%." },
      { id: "indicator", title: "4-stage battery indicator", description: "Four steps of light show how much charge is left, so you know when to plug in." },
    ],
    compatibility: [{ type: "pod", label: "RELX Pod · Pod Pro · Pod Pro 2", note: "RELX prefilled pods, 1.9mL each." }, typeC],
    whoIsThisFor: ["You already use RELX Pod or Pod Pro pods and want the current Infinity body they fit."],
    faqs: [],
    // SEO 04/11: the shop's own clip of exactly this model — title, channel and upload date read from YouTube's watch page (04/11).
    reviewVideo: { videoId: "hyJ4CkvKMec", title: "หลังใช้งาน 30 วัน RELX INFINITY 2 PLUS อัพเกรดใหม่ปรับได้แล้วทุกหัว!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2024-12-02" },
    relatedProductSlugs: ["relx-creator"],
    sourceUrls: [INFINITY_PAGE],
  },
  {
    id: "relx-creator",
    slug: "relx-creator",
    // Re-published 2026-09-30 (round "image-sitewide", owner ruling §16 item 4 (20)+(21) and chat answer 30/09): NOT a
    // disposable — the device of a CLOSED pod system, sold alone (Shipnity Pod-138 "Relx Creator (เครื่อง)"); the device
    // with the screen = RELX's own "Creator Pro Device" (relxnow.com), so RELX's official specs apply; it takes RELX
    // Creator 20K pods and Muro Connector pods (owner, from the shop's stock). The owner shows the 2 colours the shop sells
    // (grey with a yellow base, first; black, later) — RELX's global store lists Black / White / Green / Yellow; the
    // grey-and-yellow edition is not on that list (a regional edition — owner's photo).
    brandId: "relx",
    familyId: "relx-creator",
    categoryId: "switch-pods",
    systemType: "pod-kit",
    name: "RELX Creator",
    displayName: "RELX CREATOR",
    tagline: "RELX's Creator Pro device — pods sold separately.",
    shortDescription:
      "The RELX Creator Pro device on its own: an 800mAh USB-C battery with a pixel smart screen, 15W / 25W at a double click and adjustable airflow. A closed pod system — fit a prefilled pod, swap the pod when it runs out and keep the device. Takes RELX Creator Pods and Muro Connector pods.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by
    // youtube.com/@PODSYSTEM-OKAMI-II — one of OKami24's own three channels.
    reviewVideo: { videoId: "HKwsShRoo78", title: "RELX CREATOR 22K รุ่นใหม่อัพเกรด ใหญ่ จุใจ!", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-02" },
    attributes: {
      batteryMah: 800,
      wattageMax: 25,
      screenType: "led-indicator",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Photos — image-look roll-out J4 (07/10, G5 bar): Grey Yellow = a studio re-shoot (Higgsfield, IMAGE_SPEC §0 item 8) of
    // the owner's own 3/4 photo; the other four = that render re-made in RELX's own colour renders (same pose, light, logo,
    // smiley); body colours pulled back to RELX's renders by script where the render drifted; own contact shadow kept
    // (ownFloor); card = the Grey Yellow render upright. Source + check per file in scripts/process-images.map.json `aiRender`.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/relx-creator/card-v4-wm5.webp",
        alt: "RELX Creator Pro device, grey body with a yellow base and pixel smiley screen, upright three-quarter view",
        angle: "3/4, upright — OKami24 Higgsfield studio re-shoot (IMAGE_SPEC §0 item 8, 07/10)",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from the owner's photo",
        sourceUrl: "https://relxnow.com/products/relx-creator-pro-device",
      },
    ],
    // Batch 4f (06/10, owner "publish the draft"): the all-colours image behind the "ทั้งหมด" chip — this page's own 5 colour
    // photos; v4 (07/10 night) = the five colours as one zig-zag group (1/3/5 in front, 2/4 behind) — the one-row v3 left
    // the square half empty at 390 (look-batch/lineup-zig.js --zig --pick).
    lineupImage: {
      src: "/assets/products/relx-creator/lineup-v5-wm5.webp",
      alt: "RELX Creator Pro device, all 5 colours — black, white, grey yellow, green, yellow",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    openOnCardPhoto: true,
    colorVariants: [
      { id: "grey-yellow", name: "Grey Yellow", swatchHex: "#c9c9cb", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-grey-yellow-v5-wm5.webp", alt: "RELX Creator Pro device, grey with a yellow base", ownFloor: true } },
      { id: "black", name: "Black", swatchHex: "#2b2b2d", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-black-v5-wm5.webp", alt: "RELX Creator Pro device, black", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      // Batch 4d-2 (06/10): RELX's other three colours (relxnow.com lists Black / White / Green / Yellow) — catalog completeness;
      // photos = see the "Photos" comment above. The shop's stock is unknown.
      { id: "white", name: "White", swatchHex: "#dcdcdf", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-white-v5-wm5.webp", alt: "RELX Creator Pro device, white", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { id: "green", name: "Green", swatchHex: "#cfd796", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-green-v5-wm5.webp", alt: "RELX Creator Pro device, green", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { id: "yellow", name: "Yellow", swatchHex: "#e6d19e", availability: "unknown", image: { src: "/assets/products/relx-creator/variant-yellow-v5-wm5.webp", alt: "RELX Creator Pro device, yellow", ownFloor: true }, sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
    ],
    // RELX's own Creator Pro Device page (relxnow.com, read 2026-09-30): 800mAh, Type-C fast charging, one button — one
    // click = battery, double click = 15W Normal / 25W Boost, a smart screen with 100+ emojis, full-range adjustable
    // airflow. Pods: RELX says "RELX Creator Pods"; the owner (30/09, the shop's own stock) says it takes RELX Creator 20K
    // pods and Muro Connector pods — the owner's word, a named exception to THAI_STYLE §5 "manufacturer only".
    // Site-wide template round batch 4d (06/10): the G5 template — RELX's own pictures, one per block (blocks.js in
    // _incoming/sitewide-template/4/4d/); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts. Cover = RELX's UK one-pager.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/relx-creator/story-cover.webp", alt: "RELX's Creator Pro one-pager — ice in every block, the device with a Creator pod, spec strip", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 2604, height: 977 },
    // Phones: RELX's A4 portrait version of the same one-pager — the wide one's tile text is unreadable at 390 (checker #281).
    storyCoverMobile: { src: "/assets/products/relx-creator/story-cover-mobile.webp", alt: "RELX's Creator Pro one-pager, portrait — ice in every block, the device with a Creator pod, spec strip", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1600, height: 2263 },
    specifications: [
      { key: "format", label: "Format", value: "Device only — prefilled pods sold separately", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "battery", label: "Battery", value: "800mAh rechargeable, USB-C", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "modes", label: "Power modes", value: "15W Normal / 25W Boost, double click to switch", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "screen", label: "Display", value: "Pixel smart screen with emoji faces; one click shows the battery", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device" },
      // No URL on purpose: the owner's word from the shop's stock (30/09) — the named exception in THAI_STYLE §5.
      { key: "compat", label: "Pod platform", value: "RELX Creator Pods, Muro Connector pods (shop-confirmed)", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "button",
        title: "Check the battery any time",
        description: "Check before you head out and you'll know whether there's plenty left or it's nearly flat, without guessing.",
        subline: "RELX set it up so one click shows the battery level on the screen.",
        image: { src: "/assets/products/relx-creator/story-button.webp", alt: "RELX's Creator Pro picture — one click checks the battery on the pixel screen", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
      {
        id: "modes",
        title: "Normal or Boost, your choice",
        description: "Each mode puts a different picture on the screen, so a quick glance tells you which one is on.",
        subline: "RELX set it up so a double click on the button switches between the two.",
        image: { src: "/assets/products/relx-creator/story-modes.webp", alt: "RELX's Creator Pro picture — a double click adjusts power, Normal mode and Boost mode", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
      {
        id: "airflow",
        title: "Set your airflow",
        description: "Open it up for a light, easy draw, or narrow it for a tighter one, and leave it where it feels right.",
        subline: "RELX lets you set the airflow anywhere from fully open to its tightest.",
        image: { src: "/assets/products/relx-creator/story-airflow.webp", alt: "RELX's Creator Pro picture — engineering and airflow, full-range adjustable airflow at the base", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-creator-pro-device", width: 1596, height: 1605 },
      },
    ],
    // The pod rows are the owner's word (shop stock, 30/09); the spec row and the FAQ say "shop-confirmed".
    compatibility: [
      { type: "pod", label: "RELX Creator Pod" },
      { type: "pod", label: "Muro Connector pod" },
      typeC,
    ],
    whoIsThisFor: ["Vapers who want a device they keep, with prefilled pods they swap instead of filling e-liquid."],
    faqs: [
      {
        id: "relx-creator-what",
        question: "What is the RELX Creator?",
        answer: "The RELX Creator, often called the RELX LEGO, is a reusable RELX device that takes prefilled pods. It's the device RELX lists on its own site as the Creator Pro Device.",
      },
      {
        id: "relx-creator-pods",
        question: "Which pods fit the RELX Creator?",
        answer: "RELX Creator Pods and Muro Connector pods — the shop confirmed both from its own stock. For any other pod, ask on LINE @okm24 first.",
      },
      {
        id: "relx-creator-price",
        question: "How much is the RELX Creator?",
        answer: "The price is shown in the price box near the top of this page. It's for the device alone; pods are sold separately.",
      },
      {
        id: "relx-creator-no-draw",
        question: "The RELX Creator won't draw. What should I do?",
        answer: "We'd start with one click on the button to check the battery. If it's flat, charge it over USB-C. If there's charge left, take the pod out, seat it firmly again and wipe the contacts with a dry cotton swab or tissue. If it still won't draw, ask us on LINE @okm24.",
      },
    ],
    relatedProductSlugs: ["muro-connector-20k", "relx-smash-go-12k"],
    sourceUrls: ["https://relxnow.com/products/relx-creator-pro-device"],
  },
];
