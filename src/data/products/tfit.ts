import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const tfitProducts: Product[] = [
  {
    id: "tfit-m-power-20k",
    slug: "tfit-m-power-20k",
    brandId: "tfit",
    familyId: "tfit-power",
    categoryId: "disposables",
    systemType: "disposable",
    name: "TFIT M Power 20K",
    displayName: "TFIT M POWER 20K",
    // Batch 4g (05/10): identity settled on TFIT's own site (tfitvape.com lists "MPOWER" as its disposable; the device prints
    // "DESIGNED BY TFIT" — _incoming/sitewide-template/4/facts-tfit-m-power-20k.md). The English head copy said the brand was
    // unconfirmed (a wrong fact now — fixed per owner 06/10, HANDOFF §18); it mirrors the Thai line in product-copy-th.ts.
    tagline: "TFIT's disposable that OKami24 reviewed hands-on on YouTube.",
    shortDescription:
      "A high-puff TFIT disposable sold in Thailand. OKami24 reviewed it hands-on on YouTube — ask on LINE @okm24 for the models and flavors in stock.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by youtube.com/@OKM_24 — one
    // of OKami24's own three channels. A genuine 14-day hands-on review.
    reviewVideo: { videoId: "eOlSO97e9r0", title: "หลังใช้งาน 14 วัน TFIT M POWER 20K เล็ก แรง ซิ่ง!", channelName: "OKAMI", publishedAt: "2026-06-10" },
    attributes: {
      batteryMah: 600,
      puffCount: 20000,
      capacityMl: 18,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // Batch 4g (05/10): card = TFIT's own Watermelon product shot (tfitvape.com API smallPic), cut — scripts/process-images.map.json.
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/tfit-m-power-20k/card.webp",
        alt: "TFIT M Power 20K disposable, Watermelon, official isolated product shot",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "TFIT (official site, tfitvape.com)",
        sourceUrl: "https://www.tfitvape.com/",
      },
    ],
    // The 10 flavours = TFIT's own "10 FLAVORS" poster (batch 4g 05/10 — missing 0, extra 0). No per-flavour product photos
    // from TFIT → swatches until the option-photo round.
    flavorVariants: [
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6a4c93", availability: "unknown" },
      { id: "grape-apple", name: "Grape Apple", swatchHex: "#7a5aa0", availability: "unknown" },
      { id: "hami-melon", name: "Hami Melon", swatchHex: "#c5c53e", availability: "unknown" },
      { id: "mix-berry", name: "Mix Berry", swatchHex: "#6b3a5e", availability: "unknown" },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#d1479c", availability: "unknown" },
      { id: "sakura-grape", name: "Sakura Grape", swatchHex: "#d18ab0", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
    ],
    // Site-wide template round batch 4g (05/10): the G5 template — TFIT's own M Power 20K posters, one per block (down-sized only:
    // _incoming/sitewide-template/4/4g/blocks.js); text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/tfit-m-power-20k/story-cover.webp", alt: "TFIT's M Power 20K poster — two devices in front of a race car, \"M power 20K, puff max, taste best\"", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 2604, height: 1289 },
    specifications: [
      // Batch 4g (05/10): rows from TFIT's own spec card + posters 02/03/06 (4/facts-tfit-m-power-20k.md). 17mL (a retailer's) → 18mL (TFIT).
      { key: "puffs", label: "Rated puffs", value: "Up to 20,000", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "charging", label: "Charging", value: "USB-C", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "capacity", label: "E-liquid capacity", value: "18mL prefilled", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "coil", label: "Coil", value: "Dual mesh coils, 0.8Ω", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "nicotine", label: "Nicotine strength", value: "30mg", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "airflow", label: "Airflow", value: "Adjustable", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
      { key: "size", label: "Size and weight", value: "Φ30 × 98 mm, 70g", sourceStatus: "verified", sourceUrl: "https://www.tfitvape.com/" },
    ],
    features: [
      {
        id: "coils",
        title: "Two mesh coils inside",
        description: "So the flavour comes through fuller, and the vapour stays smooth puff after puff.",
        subline: "TFIT: true-to-life flavour, a smoother draw.",
        image: { src: "/assets/products/tfit-m-power-20k/story-coils.webp", alt: "TFIT poster — the M Power 20K mouthpiece with vapour, \"Mesh coils, true-to-life flavor, smoother draw\"", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 792 },
      },
      {
        id: "battery",
        title: "A battery you recharge",
        description: "If the battery runs out before the e-liquid does, charge it and carry on instead of throwing the device away early.",
        subline: "The cable goes into the base.",
        image: { src: "/assets/products/tfit-m-power-20k/story-battery.webp", alt: "TFIT poster — the M Power 20K on its side with a USB-C cable plugged into the base, battery shown at 60%", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 792 },
      },
      {
        id: "airflow",
        title: "Set the airflow yourself",
        description: "Choose a tighter or a looser draw to suit how you vape.",
        subline: "TFIT: from tighter to looser.",
        image: { src: "/assets/products/tfit-m-power-20k/story-airflow.webp", alt: "TFIT poster — the base of the M Power 20K with an arrow and air streams, \"Adjustable airflow, customize your draw, your way\"", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 792 },
      },
      {
        id: "flavours",
        title: "A range of flavours",
        description: "Fruit like Sakura Grape, ice like Blue Ice, candy like Rainbow Candy. The rest are in the flavour picker above.",
        subline: "Watermelon is one of them.",
        image: { src: "/assets/products/tfit-m-power-20k/story-watermelon.webp", alt: "TFIT poster — the M Power 20K Watermelon in a lit tunnel, \"WATERMELON\" above it", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 792 },
      },
      {
        id: "design",
        title: "A black body and a clear tank",
        description: "The tank on top is clear, so you can see from the outside how much is left.",
        subline: "In TFIT's picture it sits beside a race car: Feel the Speed.",
        image: { src: "/assets/products/tfit-m-power-20k/story-speed.webp", alt: "TFIT poster — two M Power 20K devices and a race car, \"Feel the Speed. Unleash the Legend\"", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 501 },
      },
    ],
    compatibility: [typeC],
    whoIsThisFor: [
      "You like fruity or icy flavours and want a few to choose from.",
      "You like to set the draw tighter or looser yourself.",
    ],
    // Batch 4g (05/10): the "brand not confirmed 100%" FAQ is gone — TFIT's own site settles it (facts file above).
    faqs: [],
    relatedProductSlugs: [],
    sourceUrls: ["https://www.tfitvape.com/"],
  },
];
