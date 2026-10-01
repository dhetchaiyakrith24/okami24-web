import type { Product } from "@/types/catalog";

const gppCompatibility = {
  type: "pod" as const,
  label: "UWELL GPP cartridge platform",
  note: "Shared top-fill pod platform used across most current Caliburn devices; resistance options sold separately.",
};

const g3PodCompatibility = {
  type: "pod" as const,
  label: "Caliburn G3 pod",
  note: "Legacy G3-series pod, still supported on select current-generation devices.",
};

const usbC = { type: "charging" as const, label: "USB-C", note: "5V/2A charging on current-generation devices." };
// Round 30.4ค batch 3 (owner 2026-09-15): the 5V/2A note stays only on the three devices whose spec
// sheet carries a 2A charging figure (G4 · G4 Mini · G3 Pro). The other seven Caliburn devices have
// no charging figure in their specifications, so the note — unverifiable for them — is dropped in
// every language (same rule as the G4 Pro "shatterproof" cut: what cannot be confirmed is not said).
const usbCNoNote = { type: "charging" as const, label: "USB-C" };

export const uwellProducts: Product[] = [
  {
    id: "caliburn-g5",
    slug: "caliburn-g5",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G5",
    displayName: "UWELL CALIBURN G5",
    tagline: "Smart Triple-Tap Control, tuned for every draw.",
    shortDescription:
      "The current-generation Caliburn flagship: a 1600mAh open-system pod with a 0.85\" colour display and a triple-tap gesture control for switching modes without buttons.",
    isFlagship: true,
    editorialTag: "Flagship",
    attributes: {
      batteryMah: 1600,
      wattageMin: 5,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "color-display",
      screenSize: "0.85\"",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      // Round 30.4ค batch 6 (owner 2026-09-15): the G5 spec sheet carries no charging figure, so the
      // 5V/2A claim is dropped here too (same ruling as the compatibility note in batch 3).
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g5/card.png",
        alt: "UWELL Caliburn G5, Mystic Forest colourway, isolated product shot",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/products/caliburn",
      },
      {
        kind: "official-photo",
        role: "detail",
        // 2026-09-05: white background cut by scripts/process-images.ts --fix-opaque and re-saved as
        // WebP (hero.jpg left on disk untouched — delete only on owner's say-so)
        src: "/assets/products/caliburn-g5/hero.webp",
        alt: "Official UWELL Caliburn G5 campaign image, \"Simple Tap. Supreme Taste.\"",
        angle: "Campaign hero",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/caliburn-g5/detail-01.webp",
        alt: "UWELL Caliburn G5 GPP pod cartridge, detail view",
        angle: "Pod detail",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5",
      },
    ],
    // Real UWELL color/finish lineup — ALL 7 now genuinely pass (QC recovery pass, 2026-09-03,
    // FOURTH pass). Could not find myuwell.com's own per-color lineup strip for this specific
    // product despite extensive URL-pattern guessing against its file server (unlike
    // caliburn-g5-lite/-lite-se, where that strip exists and was used directly) — exhausted before
    // falling back, per the owner's own sourcing order. The Element Vape source used in the THIRD
    // pass had confirmed, real defects under zoom (a floor-reflection blob, and a visible
    // clone-repair seam on directional patterns) and was replaced rather than patched again.
    // Reputable-source search (WebSearch, avoiding vapesourcing/elementvape which had already
    // failed QC) found gascityvapes.com — a genuinely clean, watermark-free, no-reflection studio
    // set for all 6 non-default colors, extracted from its Shopify product page's own asset
    // filenames (found directly in the page's static HTML, not JS-loaded). No repair of any kind
    // was needed — these are the source photos as-is, just trimmed to a transparent background.
    // "All Colors" lineup (owner mandate, 2026-09-03 — global rollout pass). No official
    // myuwell.com lineup strip exists for this specific product (confirmed by extensive URL-
    // pattern attempts during the QC recovery pass) — built as an OKami24 composite instead, from
    // these same 7 individually-verified real photos (Mystic Forest re-trimmed for scale
    // consistency; the other 6 were already tightly trimmed). Real photos only, nothing invented.
    lineupImage: {
      src: "/assets/products/caliburn-g5/lineup.webp",
      alt: "UWELL Caliburn G5, all 7 colors",
      sourceName: "OKami24 composite (from individually-verified official/retailer photos)",
    },
    colorVariants: [
      {
        id: "mystic-forest",
        name: "Mystic Forest",
        swatchHex: "#2d5240",
        image: { src: "/assets/products/caliburn-g5/card.png", alt: "UWELL Caliburn G5, Mystic Forest" },
      },
      {
        id: "black-carbon",
        name: "Black Carbon",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g5/variant-black-carbon.webp", alt: "UWELL Caliburn G5, Black Carbon" },
      },
      {
        id: "navy-ripples",
        name: "Navy Ripples",
        swatchHex: "#1b2a4a",
        image: { src: "/assets/products/caliburn-g5/variant-navy-ripples.webp", alt: "UWELL Caliburn G5, Navy Ripples" },
      },
      {
        id: "orange-feathers",
        name: "Orange Feathers",
        swatchHex: "#d4692a",
        image: { src: "/assets/products/caliburn-g5/variant-orange-feathers.webp", alt: "UWELL Caliburn G5, Orange Feathers" },
      },
      {
        id: "black-gold",
        name: "Black Gold",
        swatchHex: "#3d3320",
        image: { src: "/assets/products/caliburn-g5/variant-black-gold.webp", alt: "UWELL Caliburn G5, Black Gold" },
      },
      {
        id: "aurora-feathers",
        name: "Aurora Feathers",
        swatchHex: "#7a5c9e",
        image: { src: "/assets/products/caliburn-g5/variant-aurora-feathers.webp", alt: "UWELL Caliburn G5, Aurora Feathers" },
      },
      {
        id: "silver-marble",
        name: "Silver Marble",
        swatchHex: "#b8bcc0",
        image: { src: "/assets/products/caliburn-g5/variant-silver-marble.webp", alt: "UWELL Caliburn G5, Silver Marble" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1600mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–35W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "0.85\" colour screen", sourceStatus: "verified" },
      // Data round (2026-09-24, batch 5): the G5 manual (manuals.plus copy) states "Capacity 3.0ml / 2.0ml" (by market
      // version) and the product page "Top Refill"; "magnetic connection" is not in either → dropped.
      { key: "pod", label: "Pod capacity", value: "3.0mL (2.0mL in TPD markets), top refill", sourceStatus: "verified", sourceUrl: "https://manuals.plus/m/5709a095303c89dbb3fe992bd7b3cf31ba928aba1ad3f284fbfdc84d4b5fc06d" },
      { key: "control", label: "Control system", value: "Smart Triple-Tap Control (gesture-based mode switching)", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C", sourceStatus: "verified" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP cartridge platform", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "triple-tap",
        title: "Smart Triple-Tap Control",
        description:
          "A tap-based gesture sensor replaces a row of buttons for switching between output modes and reading device status, keeping the shell free of extra hardware.",
      },
      {
        id: "display-x-ui",
        title: "Immersive Design × UI",
        description:
          "The 0.85\" colour display renders a themed UI that matches the device finish, showing battery, wattage, and mode at a glance.",
      },
      {
        id: "top-fill-gpp",
        title: "Top-fill GPP pods",
        description:
          "Pods fill from the top without removing them from the device.",
      },
    ],
    compatibility: [gppCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want the current Caliburn platform without stepping up to a higher-output pod mod.",
      "Anyone switching from a button-only pod device who wants an onboard screen without added bulk.",
      "MTL-leaning vapers who occasionally want a more open, airy draw via pod/airflow choice.",
    ],
    faqs: [
      {
        id: "g5-pods",
        question: "What pods does the Caliburn G5 use?",
        answer:
          "It uses UWELL's GPP cartridge platform — the same top-fill pod family used across most current Caliburn devices, available in multiple coil resistances.",
      },
      {
        id: "g5-battery-life",
        question: "How long does the battery last?",
        answer:
          "Runtime depends on wattage, airflow, and how often the display is active; the 1600mAh cell is UWELL's stated capacity, but day-to-day runtime is a usage-dependent estimate rather than a fixed number.",
      },
    ],
    relatedProductSlugs: ["caliburn-g5-lite", "caliburn-g4-pro-koko", "caliburn-g4-pro"],
    sourceUrls: ["https://www.myuwell.com/", "https://www.myuwell.com/caliburn/caliburn-g5-koko"],
  },
  {
    id: "caliburn-g5-lite",
    slug: "caliburn-g5-lite",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G5 Lite",
    displayName: "UWELL CALIBURN G5 Lite",
    tagline: "The G5 platform, simplified for long-run everyday carry.",
    shortDescription:
      "A pared-back sibling to the G5, keeping the same 1600mAh cell and 35W ceiling with a simpler control layout.",
    isFlagship: false,
    attributes: {
      batteryMah: 1600,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "led-indicator",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g5-lite/card.webp",
        alt: "UWELL Caliburn G5 Lite, Coral Orange colourway, isolated product shot",
        angle: "THIRD pass (2026-09-03, QC recovery) — REPLACES the vapesourcing.com-sourced set entirely. That set had real, confirmed defects (a floor-reflection blob that survived background removal, visible clone-repair seams on directional patterns) — not isolated bad files but a pipeline problem, per the owner's direct review. Root fix was sourcing, not patching: the owner found this product's official myuwell.com page renders its full 8-color lineup as ONE image (`caliburn-g5-lite/pc/spe3-lite.webp`) — genuinely official UWELL renders, already alpha-transparent (no background-removal step needed at all), no reflection, no watermark, screen-on. Each color was cropped from that single official strip by detecting each device's real alpha bounding box (not a guessed fixed slot), so nothing here is manufactured.",
        transparentBackground: true,
        sourceName: "UWELL (official brand site, myuwell.com — full color-lineup render)",
        sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se",
      },
    ],
    // "All Colors" lineup (owner mandate, 2026-09-03) — the exact same official myuwell.com strip
    // every per-color crop below came from, used here whole/uncropped as the genuine official
    // lineup shot. Real, alpha-transparent, high-resolution source — no OKami24 compositing
    // needed for this product.
    lineupImage: {
      src: "/assets/products/caliburn-g5-lite/lineup.webp",
      alt: "UWELL Caliburn G5 Lite, full official 8-color lineup",
      sourceName: "UWELL (official brand site, myuwell.com)",
    },
    // Real UWELL color/finish lineup — ALL 8 now have a real, OFFICIAL photo (owner quality
    // review, 2026-09-03, THIRD pass — see the card asset's angle note for the sourcing story).
    // Every one of these 8 comes from the exact same official myuwell.com strip, cropped per-color.
    colorVariants: [
      {
        id: "candy-pink",
        name: "Candy Pink",
        swatchHex: "#f28ab2",
        image: { src: "/assets/products/caliburn-g5-lite/variant-candy-pink.webp", alt: "UWELL Caliburn G5 Lite, Candy Pink" },
      },
      {
        id: "coral-orange",
        name: "Coral Orange",
        swatchHex: "#f2794f",
        image: { src: "/assets/products/caliburn-g5-lite/card.webp", alt: "UWELL Caliburn G5 Lite, Coral Orange" },
      },
      {
        id: "creamy-celadon",
        name: "Creamy Celadon",
        swatchHex: "#a8c9a8",
        image: { src: "/assets/products/caliburn-g5-lite/variant-creamy-celadon.webp", alt: "UWELL Caliburn G5 Lite, Creamy Celadon" },
      },
      {
        id: "knight-black",
        name: "Knight Black",
        swatchHex: "#1c1c1c",
        image: { src: "/assets/products/caliburn-g5-lite/variant-knight-black.webp", alt: "UWELL Caliburn G5 Lite, Knight Black" },
      },
      {
        id: "lemon-green",
        name: "Lemon Green",
        swatchHex: "#c4d94a",
        image: { src: "/assets/products/caliburn-g5-lite/variant-lemon-green.webp", alt: "UWELL Caliburn G5 Lite, Lemon Green" },
      },
      {
        id: "mint-green",
        name: "Mint Green",
        swatchHex: "#8fd9c4",
        image: { src: "/assets/products/caliburn-g5-lite/variant-mint-green.webp", alt: "UWELL Caliburn G5 Lite, Mint Green" },
      },
      {
        id: "ocean-blue",
        name: "Ocean Blue",
        swatchHex: "#3a7ca8",
        image: { src: "/assets/products/caliburn-g5-lite/variant-ocean-blue.webp", alt: "UWELL Caliburn G5 Lite, Ocean Blue" },
      },
      {
        id: "starry-gray",
        name: "Starry Gray",
        swatchHex: "#6b7280",
        image: { src: "/assets/products/caliburn-g5-lite/variant-starry-gray.webp", alt: "UWELL Caliburn G5 Lite, Starry Gray" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1600mAh, long-run", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP cartridge platform", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "LED status indicator (no colour screen)", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "long-run-battery",
        title: "Long-run 1600mAh cell",
        description: "Carries the G5's full-size battery into a simpler, screen-light shell for longer stretches between charges.",
      },
    ],
    compatibility: [gppCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want G5-level battery life without paying for the display and gesture control.",
      "First pod-system users who prefer a simpler, fewer-controls device.",
    ],
    faqs: [
      {
        id: "g5-lite-diff",
        question: "What's different from the standard G5?",
        answer:
          "The Lite keeps the same battery capacity and output ceiling but drops the colour display and triple-tap gesture control for a simpler interface.",
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g5-lite-se"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g5-lite-se",
    slug: "caliburn-g5-lite-se",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G5 Lite SE",
    displayName: "UWELL CALIBURN G5 Lite SE",
    tagline: "A special-edition finish on the G5 Lite platform.",
    shortDescription:
      "Shares the G5 Lite's 1600mAh battery and 35W ceiling in a special-edition colourway/finish run.",
    isFlagship: false,
    attributes: {
      batteryMah: 1600,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "led-indicator",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g5-lite-se/card.webp",
        alt: "UWELL Caliburn G5 Lite SE, Purple Leather colourway, isolated product shot",
        angle: "THIRD pass (2026-09-03, QC recovery) — REPLACES the vapesourcing.com/Element Vape set entirely, same reason and same fix as caliburn-g5-lite's card (see its angle note): the owner found myuwell.com renders this product's full 8-color lineup as one official, already-transparent strip (`caliburn-g5-lite/pc/spe3-lite-se.webp`), cropped per-color by real alpha bounds rather than sourced from watermarked retailer photos needing repair.",
        transparentBackground: true,
        sourceName: "UWELL (official brand site, myuwell.com — full color-lineup render)",
        sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se",
      },
    ],
    // "All Colors" lineup (owner mandate, 2026-09-03) — the exact same official myuwell.com strip
    // every per-color crop below came from, used here whole/uncropped.
    lineupImage: {
      src: "/assets/products/caliburn-g5-lite-se/lineup.webp",
      alt: "UWELL Caliburn G5 Lite SE, full official 8-color lineup",
      sourceName: "UWELL (official brand site, myuwell.com)",
    },
    // Real UWELL color/finish lineup — ALL 8 now have a real, OFFICIAL photo (owner quality
    // review, 2026-09-03, THIRD pass — see the card asset's angle note). All 8 finishes are
    // dual-tone leather per official copy; every one comes from the same official myuwell.com
    // strip, cropped per-color.
    colorVariants: [
      {
        id: "black-leather",
        name: "Black Leather",
        swatchHex: "#2a2320",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-black-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Black Leather" },
      },
      {
        id: "blue-leather",
        name: "Blue Leather",
        swatchHex: "#33475b",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-blue-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Blue Leather" },
      },
      {
        id: "brown-leather",
        name: "Brown Leather",
        swatchHex: "#5c4433",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-brown-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Brown Leather" },
      },
      {
        id: "gray-leather",
        name: "Gray Leather",
        swatchHex: "#5a5a55",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-gray-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Gray Leather" },
      },
      {
        id: "orange-leather",
        name: "Orange Leather",
        swatchHex: "#b85c2e",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-orange-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Orange Leather" },
      },
      {
        id: "pink-leather",
        name: "Pink Leather",
        swatchHex: "#c97b8f",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-pink-leather.webp", alt: "UWELL Caliburn G5 Lite SE, Pink Leather" },
      },
      {
        id: "purple-leather",
        name: "Purple Leather",
        swatchHex: "#5c4a6e",
        image: { src: "/assets/products/caliburn-g5-lite-se/card.webp", alt: "UWELL Caliburn G5 Lite SE, Purple Leather" },
      },
      {
        id: "white-leather",
        name: "White Leather",
        swatchHex: "#e8e0d5",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-white-leather.webp", alt: "UWELL Caliburn G5 Lite SE, White Leather" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1600mAh, long-run", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified" },
      { key: "variant", label: "Variant", value: "Special-edition finish of the G5 Lite; finish-specific deltas beyond core hardware not independently confirmed", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "se-finish",
        title: "Special-edition finish",
        description: "Positioned as a finish/colourway edition of the G5 Lite rather than a hardware revision.",
      },
    ],
    compatibility: [gppCompatibility, usbCNoNote],
    whoIsThisFor: [
      "G5 Lite buyers who want a distinct special-edition look on the same platform.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g5-lite", "caliburn-g5"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g4-pro-koko",
    slug: "caliburn-g4-pro-koko",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G4 Pro KOKO",
    displayName: "UWELL CALIBURN G4 PRO KOKO",
    tagline: "The first touchscreen in the KOKO line.",
    shortDescription:
      "A 2000mAh, 35W pod device with a 2\" smart touchscreen and Pro-FOCS 4.0 flavor tuning, switching between Storm, Waves, and Custom draw modes.",
    isFlagship: false,
    attributes: {
      batteryMah: 2000,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "touchscreen",
      screenSize: "2\"",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        // Also shows in the caliburn-g5 page's related box (an SEO baseline page until 05/10) — owner 01/10: put it up now
        // anyway, no wait.
        src: "/assets/products/caliburn-g4-pro-koko/card-v2.webp",
        alt: "UWELL Caliburn G4 Pro KOKO, Cosmic Gray, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from UWELL's own images of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from UWELL's images",
        sourceUrl: "https://www.myuwell.com/products/caliburn",
      },
    ],
    // Image-sitewide round 3b (b), 01/10 (owner "ทำเลย" on the first sheet): every colour = ONE master device so only the
    // frame colour changes on a swipe. The night render it comes from was a MIRROR image of the real device (G4 logo
    // top-right; UWELL's own front photo has it top-left) — flopped, screen UI and the engraved logo mirrored back so
    // they read, then the frame colour moved to each colour of UWELL's own colour banners
    // (files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/color-1..9.webp); scripts and sheet:
    // _incoming/image-sitewide/b-uwell/ (recolour-g4k.js, owner-sheet-1.png). Card-v2 = the Cosmic Gray photo tilted in 2D.
    // From the front Desert Gold and Golden Carbon look the same — true to the device: they differ on the back panel.
    // No all-colours image behind an "all" chip (owner 01/10: one device per colour, swipe — no all-colours view).
    openOnCardPhoto: true,
    // UWELL makes 9 colours (myuwell.com colour banners, read 2026-09-05 and again 01/10). Photos: image-sitewide round 3b
    // (b) above. Swatches = the frame colour on those banners where the old value was off (Cosmic Gray is champagne-gray,
    // Glass Blue a deep blue, Coral Pink a salmon pink); Golden Carbon keeps a darker gold than Desert Gold (same frame,
    // carbon back). Golden Carbon has no stock — src/data/stock/sold-out.ts (the owner's single stock list).
    colorVariants: [
      {
        id: "desert-gold",
        name: "Desert Gold",
        swatchHex: "#c9a24b",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-desert-gold-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Desert Gold" },
      },
      {
        id: "waves-black",
        name: "Waves Black",
        swatchHex: "#1c1c1c",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-waves-black-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Waves Black" },
      },
      {
        id: "cosmic-gray",
        name: "Cosmic Gray",
        swatchHex: "#afa796",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-cosmic-gray-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Cosmic Gray" },
      },
      {
        id: "mirror-silver",
        name: "Mirror Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-mirror-silver-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Mirror Silver" },
      },
      {
        id: "crystal-white",
        name: "Crystal White",
        swatchHex: "#eef0f2",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-crystal-white-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Crystal White" },
      },
      {
        id: "light-green",
        name: "Light Green",
        swatchHex: "#a8d5ba",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-light-green-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Light Green" },
      },
      {
        id: "glass-blue",
        name: "Glass Blue",
        swatchHex: "#259acf",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-glass-blue-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Glass Blue" },
      },
      {
        id: "coral-pink",
        name: "Coral Pink",
        swatchHex: "#fca693",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-coral-pink-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Coral Pink" },
      },
      {
        id: "golden-carbon",
        name: "Golden Carbon",
        swatchHex: "#b8923a",
        image: { src: "/assets/products/caliburn-g4-pro-koko/variant-golden-carbon-v2.webp", alt: "UWELL Caliburn G4 Pro KOKO, Golden Carbon" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "2000mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "2\" smart touchscreen", sourceStatus: "verified" },
      { key: "pod", label: "Pod capacity", value: "3mL", sourceStatus: "verified" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0", sourceStatus: "verified" },
      { key: "modes", label: "Draw modes", value: "Storm / Waves / Custom", sourceStatus: "verified" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP and G3 pods", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "touchscreen",
        title: "2\" smart touchscreen",
        description: "The first touchscreen fitted to the KOKO line, used for switching modes and adjusting wattage without physical buttons.",
      },
      {
        id: "pro-focs",
        title: "Pro-FOCS 4.0",
        description: "UWELL's current-generation flavor/vapor delivery tuning applied to the GPP pod platform.",
      },
      {
        id: "modes",
        title: "Storm, Waves, Custom modes",
        description: "Three preset draw characters plus a custom slot, tuning output from smooth and mild to a stronger, more robust hit.",
      },
    ],
    compatibility: [gppCompatibility, g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want a Caliburn with a touchscreen and selectable draw modes, without stepping up to a pod kit.",
      "Anyone who splits time between MTL and more open RDL draws and wants presets for both.",
    ],
    faqs: [
      {
        id: "g4-pro-koko-pods",
        question: "Is it compatible with older Caliburn pods?",
        answer: "Yes — it accepts both the current GPP cartridge platform and legacy G3-series pods.",
      },
    ],
    relatedProductSlugs: ["caliburn-g4-pro", "caliburn-g5"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g4-pro",
    slug: "caliburn-g4-pro",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G4 Pro",
    displayName: "UWELL CALIBURN G4 PRO",
    tagline: "A 2.51\" touchscreen on the G4 platform.",
    shortDescription:
      "An 1800mAh, 35W pod device with a large touchscreen and stepless airflow control.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): real video, title names
    // "UWELL CALIBURN G4 PRO" exactly (not the KOKO), owned by youtube.com/@OKMYARZ — one of
    // OKami24's own three channels. Owner bound it (Q4, 2026-09-21).
    reviewVideo: { videoId: "Hpifl9weNTc", title: "หลังใช้งาน UWELL CALIBURN G4 PRO ตัวจบพร้อมระบบสัมผัส!", channelName: "OKM YARZ", publishedAt: "2026-08-14" },
    attributes: {
      batteryMah: 1800,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "touchscreen",
      screenSize: "2.51\"",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        // 2026-09-05: replaced by UWELL's own official Pearl Silver render (myuwell.com
        // files.myuwell.com/uwell/product/caliburn-g4-pro/pc/color-4.webp, 1539×1671, two devices
        // front+back, printed colour name erased) processed to the 1000×1000 spec by
        // scripts/process-images.ts. The whole G4 Pro set (card + 8 colours) was redone from the
        // same official series so every colour shares one canvas. card.png left on disk untouched.
        src: "/assets/products/caliburn-g4-pro/card.webp",
        alt: "UWELL Caliburn G4 Pro, pearl-silver colourway, official render (front and back)",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/products/caliburn",
      },
    ],
    // Real UWELL color/finish lineup — QC RECOVERY PASS (2026-09-03, THIRD pass). "Pearl Silver"
    // was never part of this batch — it keeps this product's own original, pre-existing card
    // photo, already good. The other 7 previously came from vapesourcing.com and had the same
    // confirmed jagged-edge defect found across this whole batch; replaced from elementvape.com's
    // own studio photography instead. 6 of those 7 are genuinely clean, no watermark. One (Light
    // Green) had a retailer watermark sitting directly on the device's own base — wide enough
    // that neither a crop nor a small local patch could remove it without visibly cutting the
    // device or risking another seam — reverted to swatch-only until a clean source is found.
    colorVariants: [
      {
        id: "desert-gold",
        name: "Desert Gold",
        swatchHex: "#c9a24b",
        image: { src: "/assets/products/caliburn-g4-pro/variant-desert-gold.webp", alt: "UWELL Caliburn G4 Pro, Desert Gold" },
      },
      {
        id: "fantasy-pink",
        name: "Fantasy Pink",
        swatchHex: "#e6a3c0",
        image: { src: "/assets/products/caliburn-g4-pro/variant-fantasy-pink.webp", alt: "UWELL Caliburn G4 Pro, Fantasy Pink" },
      },
      {
        id: "frost-white",
        name: "Frost White",
        swatchHex: "#e8ecec",
        image: { src: "/assets/products/caliburn-g4-pro/variant-frost-white.webp", alt: "UWELL Caliburn G4 Pro, Frost White" },
      },
      {
        id: "ink-blue",
        name: "Ink Blue",
        swatchHex: "#1e3a5c",
        image: { src: "/assets/products/caliburn-g4-pro/variant-ink-blue.webp", alt: "UWELL Caliburn G4 Pro, Ink Blue" },
      },
      {
        id: "iron-gray",
        name: "Iron Gray",
        swatchHex: "#5c5f63",
        image: { src: "/assets/products/caliburn-g4-pro/variant-iron-gray.webp", alt: "UWELL Caliburn G4 Pro, Iron Gray" },
      },
      {
        id: "light-green",
        name: "Light Green",
        swatchHex: "#a8d5ba",
        // 2026-09-05: official myuwell.com color-7.webp (owner-supplied link; the numbered file the
        // owner named, color-8, turned out to be Fantasy Pink — each file's printed label was read)
        image: { src: "/assets/products/caliburn-g4-pro/variant-light-green.webp", alt: "UWELL Caliburn G4 Pro, Light Green" },
      },
      {
        id: "pearl-silver",
        name: "Pearl Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-pro/variant-pearl-silver.webp", alt: "UWELL Caliburn G4 Pro, Pearl Silver" },
      },
      {
        id: "stripe-black",
        name: "Stripe Black",
        swatchHex: "#1c1c1c",
        image: { src: "/assets/products/caliburn-g4-pro/variant-stripe-black.webp", alt: "UWELL Caliburn G4 Pro, Stripe Black" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1800mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified" },
      // Owner 2026-09-14: was "2.51\" shatterproof touchscreen" marked verified, but UWELL's official
      // page does not say shatterproof (researcher 2026-09-12); the adjective is gone. Owner
      // 2026-09-15 (round 30.4ค batch 7): the official page's meta description does say
      // "2.51-inch touchscreen" (myuwell.com/caliburn/caliburn-g4-pro), so the size is verified again.
      { key: "screen", label: "Display", value: "2.51\" touchscreen", sourceStatus: "verified" },
      // Data round (2026-09-24, chat 2): "magnet" is on neither myuwell.com/caliburn/caliburn-g4-pro nor the GPP page
      // (page text searched in a real browser) → "magnetic connection" dropped; the capacity stays as it was.
      { key: "pod", label: "Pod capacity", value: "3mL", sourceStatus: "verified" },
      { key: "airflow", label: "Airflow", value: "Stepless airflow control", sourceStatus: "verified" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP and G3 pods", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "shatterproof",
        title: "2.51\" touchscreen",
        description: "A 2.51\" touchscreen for menus and stats.",
      },
      {
        id: "stepless-airflow",
        title: "Stepless airflow control",
        description: "A continuously adjustable airflow ring rather than fixed notches, for fine-tuning draw resistance.",
      },
    ],
    compatibility: [gppCompatibility, g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want a big touchscreen they can read and adjust at a glance.",
      "Anyone who wants precise, continuously-adjustable airflow rather than fixed steps.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g4-pro-koko", "caliburn-g4"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g4",
    slug: "caliburn-g4",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G4",
    displayName: "UWELL CALIBURN G4",
    tagline: "A colour screen and button firing on the core G4 shell.",
    shortDescription:
      "The standard G4: a 1300mAh device with a colour screen, selectable power modes, and button-fired hits — the middle point between the screen-free Mini and the touchscreen Pro models.",
    isFlagship: false,
    attributes: {
      batteryMah: 1300,
      screenType: "color-display",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 2A",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g4/card.webp",
        alt: "UWELL Caliburn G4, Seashell White colourway, front and back isolated product shot",
        angle: "Front + back, isolated",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4",
      },
    ],
    // Real UWELL color/finish lineup — owner quality review, 2026-09-02 (reputable-vendor
    // photo-confirmed: vapesourcing.com + elementvape.com). Image-fix round 2026-09-28: every colour photo is now
    // UWELL's own render (myuwell.com caliburn-g4 pc/2–9, the maker's caption names each colour), front device only —
    // map entries in scripts/process-images.map.json. The lineup is rebuilt from those 8 files
    // (scripts/build-lineup-grid.js --cols 4) — no image content invented.
    lineupImage: {
      src: "/assets/products/caliburn-g4/lineup.webp",
      alt: "UWELL Caliburn G4, all 8 colors",
      sourceName: "OKami24 composite (from UWELL's official colour renders)",
    },
    colorVariants: [
      {
        id: "flamingo-red",
        name: "Flamingo Red",
        swatchHex: "#e0524a",
        image: { src: "/assets/products/caliburn-g4/variant-flamingo-red.webp", alt: "UWELL Caliburn G4, Flamingo Red" },
      },
      {
        id: "glacier-blue",
        name: "Glacier Blue",
        swatchHex: "#89c2d9",
        image: { src: "/assets/products/caliburn-g4/variant-glacier-blue.webp", alt: "UWELL Caliburn G4, Glacier Blue" },
      },
      {
        id: "gunmetal-grey",
        name: "Gunmetal Grey",
        swatchHex: "#4a4d52",
        image: { src: "/assets/products/caliburn-g4/variant-gunmetal-grey.webp", alt: "UWELL Caliburn G4, Gunmetal Grey" },
      },
      {
        id: "karst-grey",
        name: "Karst Grey",
        swatchHex: "#8c8f93",
        image: { src: "/assets/products/caliburn-g4/variant-karst-grey.webp", alt: "UWELL Caliburn G4, Karst Grey" },
      },
      {
        id: "polar-black",
        name: "Polar Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g4/variant-polar-black.webp", alt: "UWELL Caliburn G4, Polar Black" },
      },
      {
        id: "sahara-gold",
        name: "Sahara Gold",
        swatchHex: "#c9a24b",
        image: { src: "/assets/products/caliburn-g4/variant-sahara-gold.webp", alt: "UWELL Caliburn G4, Sahara Gold" },
      },
      {
        id: "seashell-white",
        name: "Seashell White",
        swatchHex: "#ede7de",
        image: { src: "/assets/products/caliburn-g4/variant-seashell-white.webp", alt: "UWELL Caliburn G4, Seashell White" },
      },
      {
        id: "twilight-silver",
        name: "Twilight Silver",
        swatchHex: "#a8adb3",
        image: { src: "/assets/products/caliburn-g4/variant-twilight-silver.webp", alt: "UWELL Caliburn G4, Twilight Silver" },
      },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): UWELL's G4 spec image + product page + the G4 manual copy on manuals.plus.
      // "~30 minutes" is on none of them (the page says "5V/2A fast charging"); the manual says the device fires on a draw
      // OR the button (auto mode), not "button-fired"; "0.6Ω / 1.2Ω sold separately" is not UWELL's wording.
      { key: "battery", label: "Battery", value: "1300mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "charge-time", label: "Charging", value: "USB-C, 5V/2A fast charging", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "screen", label: "Display", value: "0.85\" colour screen, Storm and Waves modes", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "firing", label: "Firing", value: "Draw or button (auto mode)", sourceStatus: "verified", sourceUrl: "https://manuals.plus/m/50a2d62de82f0d181197e7dbdeac724ade1b398ab848d04aaa7b7cec543ee424" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (FeCrAl meshed 0.4Ω and 0.9Ω in the box)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
    ],
    features: [
      {
        id: "power-modes",
        title: "Selectable power modes",
        description: "A colour screen exposes multiple output presets, adding control the screen-free Mini doesn't offer.",
      },
    ],
    compatibility: [gppCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who want a screen and mode selection without stepping up to a touchscreen model.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g4-mini", "caliburn-g4-classic", "caliburn-g4-pro"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g4-mini",
    slug: "caliburn-g4-mini",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G4 Mini",
    displayName: "UWELL CALIBURN G4 MINI",
    tagline: "The stripped-down, pocketable G4.",
    shortDescription:
      "A smaller, lighter, screen-free version of the G4 focused purely on pocketable simplicity — same GPP pod compatibility, smaller 1100mAh cell.",
    isFlagship: false,
    attributes: {
      batteryMah: 1100,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 2A",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g4-mini/card.webp",
        alt: "UWELL Caliburn G4 Mini, gunmetal gray colourway, front and back isolated product shot",
        angle: "Front + back, isolated",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini",
      },
    ],
    // Real UWELL color/finish lineup — owner quality review, 2026-09-02 (reputable-vendor
    // photo-confirmed: vapesourcing.com + elementvape.com, 12 finishes, all now with real photos).
    // Image-fix round 2026-09-28: every colour photo is now UWELL's own render (myuwell.com caliburn-g4-mini
    // pc/1–12, front device only), each matched to the retailer-named photo it replaces — the maker's files carry no
    // colour names (order + hex in scripts/process-images.map.json). Lineup rebuilt from those 12 files
    // (scripts/build-lineup-grid.js --cols 6).
    lineupImage: {
      src: "/assets/products/caliburn-g4-mini/lineup.webp",
      alt: "UWELL Caliburn G4 Mini, all 12 colors",
      sourceName: "OKami24 composite (from UWELL's official colour renders)",
    },
    colorVariants: [
      {
        id: "bright-pink",
        name: "Bright Pink",
        swatchHex: "#e8558a",
        image: { src: "/assets/products/caliburn-g4-mini/variant-bright-pink.webp", alt: "UWELL Caliburn G4 Mini, Bright Pink" },
      },
      {
        id: "champagne-gold",
        name: "Champagne Gold",
        swatchHex: "#d4b483",
        image: { src: "/assets/products/caliburn-g4-mini/variant-champagne-gold.webp", alt: "UWELL Caliburn G4 Mini, Champagne Gold" },
      },
      {
        id: "coast-gold",
        name: "Coast Gold",
        swatchHex: "#c9a24b",
        image: { src: "/assets/products/caliburn-g4-mini/variant-coast-gold.webp", alt: "UWELL Caliburn G4 Mini, Coast Gold" },
      },
      {
        id: "dusty-indigo",
        name: "Dusty Indigo",
        swatchHex: "#4a4e6e",
        image: { src: "/assets/products/caliburn-g4-mini/variant-dusty-indigo.webp", alt: "UWELL Caliburn G4 Mini, Dusty Indigo" },
      },
      {
        id: "grass-green",
        name: "Grass Green",
        swatchHex: "#7cb342",
        image: { src: "/assets/products/caliburn-g4-mini/variant-grass-green.webp", alt: "UWELL Caliburn G4 Mini, Grass Green" },
      },
      {
        id: "lake-blue",
        name: "Lake Blue",
        swatchHex: "#3d7ea6",
        image: { src: "/assets/products/caliburn-g4-mini/variant-lake-blue.webp", alt: "UWELL Caliburn G4 Mini, Lake Blue" },
      },
      {
        id: "light-silver",
        name: "Light Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-mini/variant-light-silver.webp", alt: "UWELL Caliburn G4 Mini, Light Silver" },
      },
      {
        id: "night-black",
        name: "Night Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g4-mini/variant-night-black.webp", alt: "UWELL Caliburn G4 Mini, Night Black" },
      },
      {
        id: "paddy-green",
        name: "Paddy Green",
        swatchHex: "#8fae4a",
        image: { src: "/assets/products/caliburn-g4-mini/variant-paddy-green.webp", alt: "UWELL Caliburn G4 Mini, Paddy Green" },
      },
      {
        id: "peafowl-emerald",
        name: "Peafowl Emerald",
        swatchHex: "#0f8a6e",
        image: { src: "/assets/products/caliburn-g4-mini/variant-peafowl-emerald.webp", alt: "UWELL Caliburn G4 Mini, Peafowl Emerald" },
      },
      {
        id: "phoenix-purple",
        name: "Phoenix Purple",
        swatchHex: "#7b4a8e",
        image: { src: "/assets/products/caliburn-g4-mini/variant-phoenix-purple.webp", alt: "UWELL Caliburn G4 Mini, Phoenix Purple" },
      },
      {
        id: "slate-grey",
        name: "Slate Grey",
        swatchHex: "#5c5f63",
        image: { src: "/assets/products/caliburn-g4-mini/variant-slate-grey.webp", alt: "UWELL Caliburn G4 Mini, Slate Grey" },
      },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): UWELL's G4 Mini spec image says the box holds ONE FeCrAl meshed 0.6Ω
      // cartridge — the old row ("0.4Ω / 0.9Ω included") was wrong. "~58 minutes" is on no UWELL page → unverified.
      // "No screen": the manual's product overview lists an LED light and no display.
      { key: "battery", label: "Battery", value: "1100mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "charge-time", label: "Charge time", value: "~58 minutes at 2A", sourceStatus: "unverified" },
      { key: "screen", label: "Display", value: "None — no onboard screen", sourceStatus: "verified", sourceUrl: "https://manuals.plus/caliburn/kpn025-g4-mini-kit-manual" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (FeCrAl meshed 0.6Ω in the box)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
    ],
    features: [
      {
        id: "pocketable",
        title: "Built for pocketable simplicity",
        description: "Drops the screen and advanced features from the standard G4 for a smaller, lighter shell.",
      },
    ],
    compatibility: [gppCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who want a small, simple device whose GPP pods still fit the G4 and G5.",
      "Anyone who doesn't want a screen or mode menu to think about.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g4", "caliburn-g5-lite"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g4-classic",
    slug: "caliburn-g4-classic",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G4 Classic",
    displayName: "UWELL CALIBURN G4 CLASSIC",
    tagline: "A classic-finish edition on the core G4 hardware.",
    shortDescription:
      "Positioned as a finish/edition variant on the standard G4 platform; core hardware is treated as equivalent to the G4 pending independent confirmation of any spec deltas.",
    isFlagship: false,
    attributes: {
      batteryMah: 1300,
      screenType: "color-display",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g4-classic/card-v2.webp",
        alt: "UWELL Caliburn G4 Classic, Classic Silver, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from UWELL's own front photo of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from UWELL's images",
        sourceUrl: "https://www.myuwell.com/products/caliburn",
      },
    ],
    // Real UWELL color/finish lineup — owner quality review, 2026-09-02 (reputable-vendor
    // photo-confirmed: vapesourcing.com + elementvape.com). "Classic Silver" reuses this
    // product's own existing card photo, an exact match.
    // Image-sitewide round 01/10 (owner "เดินงานแก้รูปสินค้าให้เสร็จ"): the KOKO method — ONE master (the night Classic Silver
    // render, same orientation as UWELL's front photo, cut out by Higgsfield) with the body colour moved to each colour of
    // the shop's old per-colour photos (182x404, too small; their colour matches UWELL's collage mo/spe9.webp). The night
    // renders of the other colours were not used (Abyss Blue came out light blue; Alpine Green grew a "G" logo). Card-v2 =
    // the silver photo tilted in 2D. No "ทั้งหมด" image (owner 01/10). Swatches of Abyss Blue / Alpine Green = the body
    // colour on these photos (the old navy / dark green were off). Scripts: _incoming/image-sitewide/b-uwell/recolour-g4c.js.
    openOnCardPhoto: true,
    colorVariants: [
      {
        id: "abyss-blue",
        name: "Abyss Blue",
        swatchHex: "#4d636d",
        image: { src: "/assets/products/caliburn-g4-classic/variant-abyss-blue-v2.webp", alt: "UWELL Caliburn G4 Classic, Abyss Blue" },
      },
      {
        id: "alpine-green",
        name: "Alpine Green",
        swatchHex: "#324c42",
        image: { src: "/assets/products/caliburn-g4-classic/variant-alpine-green-v3.webp", alt: "UWELL Caliburn G4 Classic, Alpine Green" },
      },
      {
        id: "classic-black",
        name: "Classic Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g4-classic/variant-classic-black-v2.webp", alt: "UWELL Caliburn G4 Classic, Classic Black" },
      },
      {
        id: "classic-silver",
        name: "Classic Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-classic/variant-classic-silver-v2.webp", alt: "UWELL Caliburn G4 Classic, Classic Silver" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "Treated as equivalent to the standard G4 (1300mAh) — not independently confirmed for this specific edition", sourceStatus: "unverified" },
      { key: "variant", label: "Variant", value: "Classic-finish edition of the Caliburn G4", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "classic-finish",
        title: "Classic finish",
        description: "A distinct finish/colourway on the G4 shell rather than a separate hardware platform.",
      },
    ],
    compatibility: [gppCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want the G4's control layout in a classic-styled finish.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g4"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g3-pro",
    slug: "caliburn-g3-pro",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G3 Pro",
    displayName: "UWELL CALIBURN G3 PRO",
    tagline: "The Caliburn line's first full-wraparound screen.",
    shortDescription:
      "A 1000mAh, up-to-35W pod device with an LCD screen that wraps around the side of the shell, fully adjustable airflow, and two included pod resistances.",
    isFlagship: false,
    attributes: {
      batteryMah: 1000,
      wattageMin: 5,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "color-display",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 2A",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g3-pro/card.webp",
        alt: "UWELL Caliburn G3 Pro, Pacific Blue colourway, screen-on isolated studio product shot",
        angle: "THIRD owner quality-review correction pass (2026-09-03) — REPLACES the Element Vape source entirely, not another patch. That source was rejected twice (a stale \"watermark-free\" claim, then a real watermark genuinely overlapping the device bezel that needed clone-patch repair) and the owner explicitly ruled out tweaking the same weak asset again. Watermark reconstruction is a repair-of-last-resort, not a workflow to keep leaning on — the right fix was a cleaner source, not a better patch. Vapesourcing's own per-color product photography (found at vapesourcing.com/uwell-caliburn-g3-pro-kit.html) has NO watermark at all on this exact color, full device top to bottom, screen powered on showing the real full-screen UI (this device's headline feature, per myuwell.com: \"first ever full-screen vape pod\") — genuinely stronger presentation than the previous source ever offered, not merely watermark-free by luck. FOURTH pass (2026-09-03, same day) — the owner's screenshot review flagged this narrow, tall device as still reading as a \"white box\" against the dark theme: the source photo's white background was already trimmed as tight as possible, but a plain rectangular white canvas around a narrow object still shows a lot of dead white space on both sides no matter how tight the crop. Fixed at the pixel level, not by cropping further — converted to a real alpha-transparent background (distance-from-white per pixel, feathered near the edge) so the dark card background shows through directly instead of white. Checked for a white edge-fringe around the glass tank's highlights specifically (the hardest case, since glossy glass reads close to white) — none found at both zoom and real display size.",
        transparentBackground: true,
        sourceName: "Vapesourcing (vape retailer; own product photography — NOT UWELL's own site)",
        sourceUrl: "https://vapesourcing.com/uwell-caliburn-g3-pro-kit.html",
      },
    ],
    // Real UWELL color/finish lineup — owner quality review, 2026-09-02 (reputable-vendor
    // photo-confirmed: vapesourcing.com + elementvape.com, both agreeing on this 6-color list).
    // OWNER REVIEW (2026-09-03): all 6 colors now have a real, clean, watermark-free photo from
    // vapesourcing.com's own per-color product photography (screen powered on, showing this
    // device's real full-screen UI) — genuine 6/6 coverage, not just the one flagship example.
    // "All Colors" lineup (owner mandate, 2026-09-03 — global rollout pass) — an OKami24
    // composite from these same 6 individually-verified photos.
    lineupImage: {
      src: "/assets/products/caliburn-g3-pro/lineup.webp",
      alt: "UWELL Caliburn G3 Pro, all 6 colors",
      sourceName: "OKami24 composite (from individually-verified retailer photos)",
    },
    colorVariants: [
      {
        id: "emerald-green",
        name: "Emerald Green",
        swatchHex: "#1f7a5c",
        image: { src: "/assets/products/caliburn-g3-pro/variant-emerald-green.webp", alt: "UWELL Caliburn G3 Pro, Emerald Green" },
      },
      {
        id: "midnight-black",
        name: "Midnight Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g3-pro/variant-midnight-black.webp", alt: "UWELL Caliburn G3 Pro, Midnight Black" },
      },
      {
        id: "pacific-blue",
        name: "Pacific Blue",
        swatchHex: "#2a6fbd",
        image: { src: "/assets/products/caliburn-g3-pro/card.webp", alt: "UWELL Caliburn G3 Pro, Pacific Blue" },
      },
      {
        id: "rose-gold",
        name: "Rose Gold",
        swatchHex: "#d9a1a0",
        image: { src: "/assets/products/caliburn-g3-pro/variant-rose-gold.webp", alt: "UWELL Caliburn G3 Pro, Rose Gold" },
      },
      {
        id: "space-gray",
        name: "Space Gray",
        swatchHex: "#54565a",
        image: { src: "/assets/products/caliburn-g3-pro/variant-space-gray.webp", alt: "UWELL Caliburn G3 Pro, Space Gray" },
      },
      {
        id: "stone-gray",
        name: "Stone Gray",
        swatchHex: "#8c8f93",
        image: { src: "/assets/products/caliburn-g3-pro/variant-stone-gray.webp", alt: "UWELL Caliburn G3 Pro, Stone Gray" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1000mAh, USB-C 2A charging", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–35W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "Wraparound LCD screen", sourceStatus: "verified" },
      { key: "pod", label: "Pod capacity", value: "3mL (0.4Ω pod) / 2.5mL (0.9Ω pod), both included", sourceStatus: "verified" },
      { key: "airflow", label: "Airflow", value: "Fully adjustable", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "wraparound-screen",
        title: "Wraparound LCD",
        description: "The Caliburn line's first screen to wrap around an entire side of the device rather than sitting in a small window.",
      },
      {
        id: "dual-pod",
        title: "Two pod resistances in the box",
        description: "Ships with both a 0.4Ω and a 0.9Ω pod, covering a more open RDL draw and a tighter MTL draw out of the box.",
      },
    ],
    compatibility: [g3PodCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who want full wattage/battery visibility in a compact open-system pod.",
      "Anyone who wants to try both MTL and RDL pods without buying extras first.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g3-pro-koko", "caliburn-g4"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
  {
    id: "caliburn-g3-pro-koko",
    slug: "caliburn-g3-pro-koko",
    brandId: "uwell",
    familyId: "caliburn",
    categoryId: "pod-systems",
    systemType: "open-pod",
    name: "Caliburn G3 Pro KOKO",
    displayName: "UWELL CALIBURN G3 PRO KOKO",
    tagline: "A KOKO-edition finish on the G3 Pro platform.",
    shortDescription:
      "Positioned as a KOKO-branded edition of the G3 Pro; core hardware is treated as equivalent to the G3 Pro pending independent confirmation of any spec deltas.",
    isFlagship: false,
    attributes: {
      batteryMah: 1000,
      wattageMax: 35,
      capacityMl: 3,
      screenType: "color-display",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/caliburn-g3-pro-koko/card-v2.webp",
        alt: "UWELL Caliburn G3 Pro KOKO, Emerald Green, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from UWELL's images of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from UWELL's images",
        sourceUrl: "https://vapesourcing.com/uwell-caliburn-g3-pro-koko.html",
      },
    ],
    // Image-sitewide round 3b (b), 01/10 (owner "ทำเลย" on the first sheet): the old photos were 274x438 retailer
    // cut-outs with a white rim. Every colour = ONE master device (the night 01/10 Higgsfield front render made from UWELL's
    // images) with the metal colour moved to each colour of the shop's own per-colour photos (vapesourcing redistribution
    // of UWELL's render; gold and black were clipped there and come from UWELL's own colour) — only the frame colour changes
    // on a swipe; scripts and sheet: _incoming/image-sitewide/b-uwell/ (recolour-g3k.js). Card = Emerald Green tilted in
    // 2D. Swatches = the frame colour on these photos. UWELL has no per-colour files for this model (color-N.webp 404).
    // No all-colours image behind an "all" chip (owner 01/10: one device per colour, swipe — no all-colours view).
    openOnCardPhoto: true,
    // Real UWELL color/finish lineup — "KOKO" is UWELL's touchscreen-edition naming convention
    // (see caliburn-g4-pro-koko's own comment) — same G3 Pro pod platform, not a separate system.
    colorVariants: [
      {
        id: "emerald-green",
        name: "Emerald Green",
        swatchHex: "#82f490",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-emerald-green-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Emerald Green" },
      },
      {
        id: "light-silver",
        name: "Light Silver",
        swatchHex: "#e5e5e5",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-light-silver-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Light Silver" },
      },
      {
        id: "lilac-purple",
        name: "Lilac Purple",
        swatchHex: "#aba6cd",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-lilac-purple-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Lilac Purple" },
      },
      {
        id: "luxury-gold",
        name: "Luxury Gold",
        swatchHex: "#e7c490",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-luxury-gold-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Luxury Gold" },
      },
      {
        id: "midnight-black",
        name: "Midnight Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-midnight-black-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Midnight Black" },
      },
      {
        id: "rose-pink",
        name: "Rose Pink",
        swatchHex: "#f6acb7",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-rose-pink-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Rose Pink" },
      },
      {
        id: "sky-blue",
        name: "Sky Blue",
        swatchHex: "#4dd1f4",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-sky-blue-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Sky Blue" },
      },
      {
        id: "space-gray",
        name: "Space Gray",
        swatchHex: "#a2a2a2",
        image: { src: "/assets/products/caliburn-g3-pro-koko/variant-space-gray-v2.webp", alt: "UWELL Caliburn G3 Pro KOKO, Space Gray" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "Treated as equivalent to the G3 Pro (1000mAh) — not independently confirmed for this specific edition", sourceStatus: "unverified" },
      { key: "variant", label: "Variant", value: "KOKO edition of the Caliburn G3 Pro", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "koko-finish",
        title: "KOKO edition finish",
        description: "A distinct KOKO-branded finish on the G3 Pro shell rather than a separate hardware platform.",
      },
    ],
    compatibility: [g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "G3 Pro fans who want the KOKO-edition styling.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g3-pro"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
];
