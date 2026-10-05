import type { Product } from "@/types/catalog";

// Site-wide template round batch 5f (06/10, owner: MOOOD off "Unbranded" = its own brand). MOOOD's own site
// (mooodvapes.com) is offline (DNS); its pages and uploads survive on the Wayback Machine — facts and sources in
// _incoming/sitewide-template/5/facts-mood-monster-14k.md. The maker's two key posters are near-identical web banners
// (a printed "READ MORE" button), not a story, so the page is card + flavours (round rule "no poster = no part").
// Spec rows name the maker's domain (verified-specs contract); links a visitor can click go to the Wayback copy.
const MAKER = "https://mooodvapes.com/";
const MAKER_ARCHIVE = "https://web.archive.org/web/20241008232414/https://mooodvapes.com/";

// One device body for every flavour (LESSONS 20 — the Grape render, chrome mouthpiece as in the maker's photos) with each
// flavour's own label from the maker's flavour photo; the two 5% labels keep the frosted body their only photo shows.
// Renders, sources and the fidelity sheet: scripts/process-images.map.json (slug mood-monster-14k).
const flavour = (id: string, name: string, swatchHex: string) => ({
  id,
  name,
  swatchHex,
  availability: "unknown" as const,
  image: { src: `/assets/products/mood-monster-14k/variant-${id}.webp`, alt: `MOOOD Monster 14K, ${name} — device` },
});

export const mooodProducts: Product[] = [
  {
    id: "mood-monster-14k",
    slug: "mood-monster-14k",
    brandId: "moood",
    familyId: "moood-monster",
    categoryId: "disposables",
    systemType: "disposable",
    name: "MOOOD Monster 14K Puffs",
    displayName: "MOOOD Monster 14K Puffs",
    tagline: "A high-puff-count disposable rated for up to 14,000 puffs.",
    // Batch 5f: "currently stocked in 10 flavors" became wrong (21 flavours) — the only change to this head line.
    shortDescription:
      "A disposable vape from the MOOOD \"Monster\" series, rated for up to 14,000 puffs and available in a wide range of flavors.",
    isFlagship: false,
    attributes: {
      puffCount: 14000,
      // The maker's poster 01 shows a digit screen ("188", a % sign) beside a drop-shaped e-liquid gauge — the same
      // kind of screen INFY 20K is filed under.
      screenType: "led-indicator",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      // Battery 600 (search summary of the maker's page) vs 650 / 500 (retailers) — no maker file seen, no row.
      chargingType: "Not independently confirmed",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/mood-monster-14k/card.webp",
        alt: "MOOOD Monster 14K disposable, Berry Garden — device",
        angle: "Front, upright",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from MOOOD's own Berry Garden photo",
        sourceUrl: MAKER_ARCHIVE,
      },
    ],
    // Open on the card, flavours by swipe or chip (IMAGE_SPEC §0 item 5).
    openOnCardPhoto: true,
    // Every flavour the maker's template shows (its own 15 files + Fanta, Kyoho Grape, Mango Peach and Sugar Apple from
    // the same template re-hosted by shops) + the shop's two 5% stock lines. "Sugar Apple" is what the label prints; the
    // shop's stock list (Shipnity) calls it "Sugus Apple", so the id keeps that name.
    flavorVariants: [
      flavour("banana-ice", "Banana Ice", "#c4a734"),
      flavour("berry-garden", "Berry Garden", "#4b487e"),
      flavour("blueberry", "Blueberry", "#3a4a8e"),
      flavour("cola", "Cola", "#8a3a26"),
      flavour("fanta", "Fanta", "#e07a1f"),
      flavour("grape", "Grape", "#6b4a8e"),
      flavour("grape-lychee", "Grape Lychee", "#b0457a"),
      flavour("ice-sparkling", "Ice Sparkling", "#4f8fa8"),
      flavour("kyoho-grape", "Kyoho Grape", "#5a3570"),
      flavour("lemon-tea", "Lemon Tea", "#c9b23a"),
      flavour("lychee", "Lychee", "#ce3a5e"),
      flavour("mango-peach", "Mango Peach", "#e08a3a"),
      flavour("mint", "Mint", "#6fae6a"),
      flavour("peach-orange", "Peach Orange", "#d87039"),
      flavour("pineapple", "Pineapple", "#e3bd1c"),
      flavour("strawberry", "Strawberry", "#cc3a67"),
      flavour("sugus-apple", "Sugar Apple", "#7ab84a"),
      flavour("watermelon", "Watermelon", "#d94f6b"),
      flavour("watermelon-strawberry", "Watermelon Strawberry", "#c94a4a"),
      flavour("grape-n5", "Grape N5%", "#6b4a8e"),
      flavour("blueberry-n5", "Blueberry N5%", "#3a4a8e"),
    ],
    // Rows from the maker's own files (Wayback copies, facts file above): posters 01/02/20 + every flavour photo print
    // "14000 Puffs", "DUO MESH", "16 ml", "3% Nicotine". The N5% flavours' 5% is seen only on a retailer photo of the
    // device label (checker #308) — not a maker source, so it is not in the verified row.
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "Up to 14,000", sourceStatus: "verified", sourceUrl: MAKER },
      { key: "coil", label: "Coil", value: "DUO MESH", sourceStatus: "verified", sourceUrl: MAKER },
      { key: "capacity", label: "E-liquid capacity", value: "16mL prefilled", sourceStatus: "verified", sourceUrl: MAKER },
      { key: "nicotine", label: "Nicotine strength", value: "3%", sourceStatus: "verified", sourceUrl: MAKER },
    ],
    features: [],
    compatibility: [],
    whoIsThisFor: ["Vapers looking for a high-puff-count disposable with a wide flavor lineup."],
    faqs: [],
    relatedProductSlugs: [],
    sourceUrls: [MAKER_ARCHIVE],
  },
];
