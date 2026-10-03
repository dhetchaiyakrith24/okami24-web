import type { Product } from "@/types/catalog";

const gppCompatibility = {
  type: "pod" as const,
  label: "UWELL GPP cartridge platform",
  note: "Shared top-fill pod platform used across most current Caliburn devices; resistance options sold separately.",
};

// Article round 02/10: UWELL's G5 page — "All cartridges in G Pod Platform (GPP) are compatible", side and top refill.
// G5 only for now; the shared note above ("top-fill") is re-checked per product in the UWELL batch.
const gppSideTopCompatibility = {
  type: "pod" as const,
  label: "UWELL GPP cartridge platform",
  note: "Every GPP cartridge fits, side-refill or top-refill (UWELL); resistance options sold separately.",
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
        // Image-sitewide round 3b (0), owner 02/10: UWELL's own upright Mystic Forest render, full size on the 4:5 card
        // ("การ์ดเอาแบบตรงเหมือนเดิมดีกว่า" after the tilted card-v2 went live). card.png stays for the home Scene2Uwell.
        src: "/assets/products/caliburn-g5/card-v3.webp",
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
    // Image-sitewide round 3b (0), 02/10 (owner: "Focus Caliburn 5 ทุกสี ทุกรูป รูปรวม"): all seven colours now use
    // UWELL's own per-colour renders from the G5 page ("Pick Your Vibe",
    // files.myuwell.com/uwell/product/caliburn-g5/pc/pic9-<n>-product.webp) — the gascityvapes cut-outs above had broken
    // pod edges and patch marks — each turned 12° (owner: "เอียงทุกสีเลย"; the card went back upright, owner 02/10). Mapping in
    // scripts/process-images.map.json (*-v2.webp, lesson พ6). The all-colours image is the owner's pick 3 of 02/10:
    // Mystic Forest big in front on the left, the other six behind in two upright tiers, a soft contact shadow and a
    // faint reflection kept as semi-transparent pixels (IMAGE_SPEC §0 item 8) — _incoming/image-sitewide/g5/poster.js.
    lineupImage: {
      src: "/assets/products/caliburn-g5/lineup-v2.webp",
      alt: "UWELL Caliburn G5, all 7 colours",
      sourceName: "OKami24 composite (from UWELL's own per-colour renders)",
    },
    // Owner 02/10 ("การ์ดเอาแบบตรงเหมือนเดิมดีกว่า"): the page opens on the upright card again, the tilted colours follow on swipe.
    openOnCardPhoto: true,
    // Article round batch 1 (02/10, owner: every product like M Bar 10K's lower page + an article): the "more details"
    // story (src/data/product-articles.ts holds the article). Cover = UWELL's own G5 campaign image already on the page.
    storyDetails: true,
    // Owner 02/10 "ทำแบบ Uwell": the UWELL-style stage layout (designer option A); colours right after the screen block.
    storyLayout: "stage",
    storyColoursAfter: "display-x-ui",
    // G5 template round batch 5 (owner 03/10: "กรอบดำ" + white bits in the CALIBURN word): hero.webp is already cut out —
    // the black box was the poster card, the white bits = studio white left inside the A/B/R counters of the word row;
    // story-cover-v3 = hero.webp with those holes cleared (_incoming/g5-template/b5/eat-white.js) and the word repainted for the
    // dark site (owner 03/10: the word was dim — b6/wordmark.js: silver CALIBURN, brighter G5), floating (`transparent`); v4 = v3 with its top rows faded out — UWELL's own banner crops the left
    // wing at the top edge, a straight line once the cover stopped sliding under the text (designer 03/10, b6/cover-fade.js)
    storyCover: { src: "/assets/products/caliburn-g5/story-cover-v4.webp", alt: "Official UWELL Caliburn G5 campaign image, \"Simple Tap. Supreme Taste.\"", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 3081, height: 1480, transparent: true },
    colorVariants: [
      {
        id: "mystic-forest",
        name: "Mystic Forest",
        swatchHex: "#2d5240",
        image: { src: "/assets/products/caliburn-g5/variant-mystic-forest-v2.webp", alt: "UWELL Caliburn G5, Mystic Forest" },
      },
      {
        id: "black-carbon",
        name: "Black Carbon",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/caliburn-g5/variant-black-carbon-v2.webp", alt: "UWELL Caliburn G5, Black Carbon" },
      },
      {
        id: "navy-ripples",
        name: "Navy Ripples",
        swatchHex: "#1b2a4a",
        image: { src: "/assets/products/caliburn-g5/variant-navy-ripples-v2.webp", alt: "UWELL Caliburn G5, Navy Ripples" },
      },
      {
        id: "orange-feathers",
        name: "Orange Feathers",
        swatchHex: "#d4692a",
        image: { src: "/assets/products/caliburn-g5/variant-orange-feathers-v2.webp", alt: "UWELL Caliburn G5, Orange Feathers" },
      },
      {
        id: "black-gold",
        name: "Black Gold",
        swatchHex: "#3d3320",
        image: { src: "/assets/products/caliburn-g5/variant-black-gold-v2.webp", alt: "UWELL Caliburn G5, Black Gold" },
      },
      {
        id: "aurora-feathers",
        name: "Aurora Feathers",
        swatchHex: "#7a5c9e",
        image: { src: "/assets/products/caliburn-g5/variant-aurora-feathers-v2.webp", alt: "UWELL Caliburn G5, Aurora Feathers" },
      },
      {
        id: "silver-marble",
        name: "Silver Marble",
        swatchHex: "#b8bcc0",
        image: { src: "/assets/products/caliburn-g5/variant-silver-marble-v2.webp", alt: "UWELL Caliburn G5, Silver Marble" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1600mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–35W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "0.85\" colour screen", sourceStatus: "verified" },
      // Data round (2026-09-24, batch 5): the G5 manual (manuals.plus copy) states "Capacity 3.0ml / 2.0ml" (by market
      // version) and the product page "Top Refill"; "magnetic connection" is not in either → dropped.
      // Article round 02/10: UWELL's own spec sheet lists the in-box pods per market version — INT = side-refill GPP pods,
      // FDA/TPD/CRC = top-refill — so "top refill" alone was true only for some versions; 2mL = TPD & CRC.
      { key: "pod", label: "Pod capacity", value: "3mL (2mL in TPD & CRC versions); side- or top-refill pods by market version", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g5/pc/specifi.webp" },
      { key: "included-pod", label: "Included pod", value: "3 pods per kit, one of them a 0.6Ω GPP Alpha cartridge (types by market version)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g5/pc/specifi.webp" },
      { key: "battery-life", label: "Battery life", value: "Up to 6 days of typical use (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5" },
      { key: "airflow", label: "Airflow", value: "Stepless side airflow control, MTL to RDL", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5" },
      { key: "materials", label: "Materials", value: "PCTG, aluminium alloy with a matte finish", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g5/pc/specifi.webp" },
      { key: "weight", label: "Weight", value: "65g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g5/pc/specifi.webp" },
      { key: "control", label: "Control system", value: "Smart Triple-Tap Control (gesture-based mode switching)", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C", sourceStatus: "verified" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP cartridge platform", sourceStatus: "verified" },
    ],
    // Article round batch 1 (02/10): each highlight = one of UWELL's own G5 posters (story-*.webp, from
    // files.myuwell.com/uwell/product/caliburn-g5/pc/; story-colours-v2 = the left part of UWELL's real-shot.webp strip with its
    // transparent gutters kept (designer 03/10: the first crop was flattened onto black),
    // story-battery-v4 = pic10-1 cut again at full size, studio white between the letters cleared (owner 03/10: v3 tore at the cable,
    // patchy rim, white in the letters) (no box behind the devices; the
    // aluminium poster pic11 is a cut-out already — both float, `transparent`)), told one per block in "more details" (`storyDetails`). Text from
    // UWELL's G5 page. "top-fill-gpp" went: UWELL's spec sheet ships side-refill pods in the international kit.
    features: [
      {
        id: "three-pods",
        title: "Three pods in the kit",
        description: "Every G5 kit comes with three pods, one of them UWELL's new GPP Alpha cartridge, so you start with spares in the box.",
        subline: "One of them is the new GPP Alpha.",
        imageMobile: { src: "/assets/products/caliburn-g5/story-three-pods-mo.webp", alt: "Official UWELL Caliburn G5 poster — the device, its box and three pods (phone version)", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 1301, height: 1001 },
        image: { src: "/assets/products/caliburn-g5/story-three-pods.webp", alt: "Official UWELL Caliburn G5 poster — the device, its box and three pods", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 2400, height: 1029 },
      },
      {
        id: "gpp-alpha",
        title: "GPP Alpha cartridge",
        description: "UWELL's new Alpha pod is built for a longer coil life and steady flavour from the first puff to the last, with a leak-resistant design and a soft-touch TPU mouthpiece.",
        subline: "A longer-lasting coil, no flavour drop.",
        imageMobile: { src: "/assets/products/caliburn-g5/story-alpha-pod-mo.webp", alt: "Official UWELL poster of the GPP Alpha cartridge (phone version)", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 1500, height: 2600 },
        image: { src: "/assets/products/caliburn-g5/story-alpha-pod.webp", alt: "Official UWELL poster of the GPP Alpha cartridge", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 2400, height: 1412 },
      },
      {
        id: "triple-tap",
        title: "Smart Triple-Tap Control",
        description: "A tap-based gesture sensor replaces a row of buttons for switching between output modes and reading device status, keeping the shell free of extra hardware.",
        subline: "Your shortcut to everything — a triple tap anywhere on the body.",
        captions: ["In the dark", "Under bright sunlight", "On the go", "In the moment"],
        imageMobile: { src: "/assets/products/caliburn-g5/story-triple-tap-mo.webp", alt: "Official UWELL poster — switching the Caliburn G5 with a triple tap (phone version)", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 760, height: 651 },
        image: { src: "/assets/products/caliburn-g5/story-triple-tap.webp", alt: "Official UWELL poster — switching the Caliburn G5 with a triple tap", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 1050, height: 613 },
      },
      {
        id: "display-x-ui",
        title: "Immersive Design × UI",
        description: "The 0.85\" colour display renders a themed UI that matches the device finish, showing battery, wattage, and mode at a glance.",
        subline: "Pick a colour, and the screen theme comes with it.",
        image: { src: "/assets/products/caliburn-g5/story-colours-v2.webp", alt: "Official UWELL photos — the Caliburn G5 in several colours, each screen in its own theme", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 2400, height: 1409, transparent: true },
      },
      {
        id: "long-run-battery",
        title: "1600mAh battery",
        description: "UWELL rates the built-in 1600mAh battery at up to 6 days of typical use per charge; it charges over USB-C.",
        subline: "Up to 6 days of typical use per charge (UWELL).",
        image: { src: "/assets/products/caliburn-g5/story-battery-v4.webp", alt: "Official UWELL poster — 1600mAh battery, up to 6 days of use", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 2413, height: 1131, transparent: true },
      },
      {
        id: "aluminium-airflow",
        title: "Aluminium body, stepless airflow",
        description: "A matte aluminium-alloy body that resists fingerprints, and a side airflow control that adjusts steplessly from a tighter MTL draw to a looser RDL.",
        subline: "Premium in hand, smooth on the draw.",
        image: { src: "/assets/products/caliburn-g5/story-aluminium.webp", alt: "Official UWELL poster — the Caliburn G5 aluminium body and side airflow control", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 1438, height: 1611, transparent: true },
      },
    ],
    compatibility: [gppSideTopCompatibility, usbCNoNote],
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
          "It uses UWELL's GPP cartridge platform — every GPP cartridge fits, side-refill or top-refill, in several coil resistances.",
      },
      {
        id: "g5-battery-life",
        question: "How many days does the Caliburn G5 last on a charge?",
        answer:
          "UWELL rates the built-in 1600mAh battery at up to 6 days of typical use per charge. How long yours lasts depends on how often you vape, the wattage, the airflow and how often the screen is on.",
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
      // Image-sitewide round, set 1 (02/10): the G5 layout the owner picked (the card colour big in front, the other
      // 7 behind in two upright tiers, soft shadow + faint reflection) from UWELL's own fronts — _incoming/image-sitewide/set1/.
      src: "/assets/products/caliburn-g5-lite/lineup-v2.webp",
      alt: "UWELL Caliburn G5 Lite, all 8 colours",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    // Site-wide template round, batch 1a (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own G5 Lite page
    // (https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Cover = UWELL's campaign image theme-poster.webp (full scene, not a cut-out). Posters: _incoming/sitewide-template/1a/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g5-lite/story-cover.webp", alt: "Official UWELL campaign image — Caliburn G5 Lite and G5 Lite SE", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1920, height: 1080 },
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
      { key: "battery-life", label: "Battery life", value: "Up to 6 days per charge (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "pod-resistance", label: "Resistance", value: "0.4Ω pod", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "airflow", label: "Airflow", value: "Dual adjustable: reversible pod airflow + stepless control, MTL to RDL", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "screen", label: "Status indicator", value: "4-bar gradient LED battery indicator, colour by battery level", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
    ],
    features: [
      {
        id: "long-run-battery",
        title: "1600mAh battery",
        description: "How long yours lasts depends on how often you vape and how open the airflow is.",
        subline: "Up to 6 days on a single charge (UWELL's figure).",
        image: { src: "/assets/products/caliburn-g5-lite/story-battery.webp", alt: "Official UWELL poster — 1600mAh, the Caliburn G5 Lite and G5 Lite SE", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2215, height: 1613, transparent: true },
      },
      {
        id: "dual-layer",
        title: "Two-layer shell",
        description: "Light and shaped to sit well in the hand — pick the colour that suits you.",
        subline: "An inner core under a translucent shell.",
        image: { src: "/assets/products/caliburn-g5-lite/story-dual-layer.webp", alt: "Official UWELL render — the Caliburn G5 Lite in Coral Orange", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1611, height: 1782, transparent: true },
      },
      {
        id: "power-35w",
        title: "35W, full flavour",
        description: "Pro-FOCS 4.0 keeps every puff balanced (UWELL LAB tests).",
        subline: "Rich and layered.",
        image: { src: "/assets/products/caliburn-g5-lite/story-35w.webp", alt: "UWELL's 35W type from the Caliburn G5 Lite page", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2400, height: 788, transparent: true },
      },
      {
        id: "airflow",
        title: "Airflow, two ways",
        description: "Like it tight or a little more open? Set the airflow to match.",
        subline: "From MTL to RDL, always smooth.",
        imageMobile: { src: "/assets/products/caliburn-g5-lite/story-airflow-mo.webp", alt: "Official UWELL poster — reversible cartridge and stepless airflow control (phone version)", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1500, height: 2103 },
        image: { src: "/assets/products/caliburn-g5-lite/story-airflow.webp", alt: "Official UWELL poster — reversible cartridge airflow control and stepless airflow control", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2400, height: 1250 },
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
      // Image-sitewide round, set 1 (02/10): the G5 layout the owner picked (the card colour big in front, the other
      // 7 behind in two upright tiers, soft shadow + faint reflection) from UWELL's own fronts — _incoming/image-sitewide/set1/.
      src: "/assets/products/caliburn-g5-lite-se/lineup-v2.webp",
      alt: "UWELL Caliburn G5 Lite SE, all 8 colours",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    // Site-wide template round, batch 1a (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own G5 Lite page
    // (https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Cover = UWELL's campaign image theme-poster.webp (full scene, not a cut-out). Posters: _incoming/sitewide-template/1a/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g5-lite/story-cover.webp", alt: "Official UWELL campaign image — Caliburn G5 Lite and G5 Lite SE", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1920, height: 1080 },
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
      { key: "battery-life", label: "Battery life", value: "Up to 6 days per charge (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "pod-resistance", label: "Resistance", value: "0.4Ω pod", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "airflow", label: "Airflow", value: "Dual adjustable: reversible pod airflow + stepless control, MTL to RDL", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "screen", label: "Status indicator", value: "4-bar gradient LED battery indicator, colour by battery level", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
      { key: "variant", label: "Variant", value: "Dual-tone finish: leather with a striped texture", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se" },
    ],
    features: [
      {
        id: "long-run-battery",
        title: "1600mAh battery",
        description: "How long yours lasts depends on how often you vape and how open the airflow is.",
        subline: "Up to 6 days on a single charge (UWELL's figure).",
        image: { src: "/assets/products/caliburn-g5-lite/story-battery.webp", alt: "Official UWELL poster — 1600mAh, the Caliburn G5 Lite and G5 Lite SE", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2215, height: 1613, transparent: true },
      },
      {
        id: "dual-tone",
        title: "Dual-tone finish",
        description: "Light and shaped to sit well in the hand — pick the leather colour that suits you.",
        subline: "Leather paired with a striped texture.",
        image: { src: "/assets/products/caliburn-g5-lite-se/story-dual-tone.webp", alt: "Official UWELL render — the Caliburn G5 Lite SE in Purple Leather", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1967, height: 2121, transparent: true },
      },
      {
        id: "power-35w",
        title: "35W, full flavour",
        description: "Pro-FOCS 4.0 keeps every puff balanced (UWELL LAB tests).",
        subline: "Rich and layered.",
        image: { src: "/assets/products/caliburn-g5-lite/story-35w.webp", alt: "UWELL's 35W type from the Caliburn G5 Lite page", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2400, height: 788, transparent: true },
      },
      {
        id: "airflow",
        title: "Airflow, two ways",
        description: "Like it tight or a little more open? Set the airflow to match.",
        subline: "From MTL to RDL, always smooth.",
        imageMobile: { src: "/assets/products/caliburn-g5-lite/story-airflow-mo.webp", alt: "Official UWELL poster — reversible cartridge and stepless airflow control (phone version)", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1500, height: 2103 },
        image: { src: "/assets/products/caliburn-g5-lite/story-airflow.webp", alt: "Official UWELL poster — reversible cartridge airflow control and stepless airflow control", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2400, height: 1250 },
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
    // (The morning-01/10 "no all-colours view" was replaced the same evening — see lineupImage below.)
    openOnCardPhoto: true,
    // UWELL makes 9 colours (myuwell.com colour banners, read 2026-09-05 and again 01/10). Photos: image-sitewide round 3b
    // (b) above. Swatches = the frame colour on those banners where the old value was off (Cosmic Gray is champagne-gray,
    // Glass Blue a deep blue, Coral Pink a salmon pink); Golden Carbon keeps a darker gold than Desert Gold (same frame,
    // carbon back). Golden Carbon has no stock — src/data/stock/sold-out.ts (the owner's single stock list).
    // All-colours images (IMAGE_SPEC §0 item 5), 02/10: two groups in the colour order below — the one-image cluster of 9
    // boxes "looked too small" (owner 02/10) — "cluster" layout (Cosmic Gray big in front in group 1), pills "ทั้งหมด 1" / "ทั้งหมด 2";
    // _incoming/image-sitewide/dsx/koko-two.js.
    lineupImage: {
      src: "/assets/products/caliburn-g4-pro-koko/lineup-v3.webp",
      alt: "UWELL Caliburn G4 Pro KOKO, colours 1–5 of 9",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/caliburn-g4-pro-koko/lineup2-v3.webp",
      alt: "UWELL Caliburn G4 Pro KOKO, colours 6–9 of 9",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
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
      // Image-sitewide round, set 1 (02/10): the G5 layout the owner picked (the card colour big in front, the other
      // 7 behind in two upright tiers, soft shadow + faint reflection) from UWELL's own fronts — _incoming/image-sitewide/set1/.
      src: "/assets/products/caliburn-g4/lineup-v2.webp",
      alt: "UWELL Caliburn G4, all 8 colours",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
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
    // (scripts/build-lineup-grid.js --cols 6). Image-sitewide round, set 1 (02/10): lineup-v2 = the G5 layout the owner
    // picked (Slate Grey big in front, the other 11 in two upright tiers) from the same 12 UWELL fronts — _incoming/image-sitewide/set1/.
    lineupImage: {
      src: "/assets/products/caliburn-g4-mini/lineup-v2.webp",
      alt: "UWELL Caliburn G4 Mini, all 12 colours",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
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
    // the silver photo tilted in 2D. Swatches of Abyss Blue / Alpine Green = the body colour on these photos (the old
    // navy / dark green were off). Scripts: _incoming/image-sitewide/b-uwell/recolour-g4c.js. "ทั้งหมด" image (owner 01/10
    // evening: pod systems get a new all-colours image): the G5 layout, Classic Silver big in front — set1/poster.js (02/10).
    openOnCardPhoto: true,
    lineupImage: {
      src: "/assets/products/caliburn-g4-classic/lineup-v2.webp",
      alt: "UWELL Caliburn G4 Classic, all 4 colours",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
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
        src: "/assets/products/caliburn-g3-pro/card-v2.webp",
        alt: "UWELL Caliburn G3 Pro, Pacific Blue, three-quarter view",
        angle: "tilted 12° in 2D, isolated — the Pacific Blue front of the OKami24 16-colour set (IMAGE_SPEC §0 item 7), no new render",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from UWELL's images",
        sourceUrl: "https://www.myuwell.com/",
      },
    ],
    // UWELL makes 16 colours (UWELL's own chart, files.myuwell.com/uwell/product/caliburnG3Pro/pack1-4.webp, in its order);
    // the site showed the 6 a retailer listed — catalog-completeness rule (owner 2026-09-06): every maker colour shows.
    // Image-sitewide round 3b (1), 01/10: every colour = the front of ONE 4K Higgsfield master (UWELL's Stone Gray front)
    // with the frame round the screen moved to UWELL's chart colour (_incoming/image-sitewide/b-edge/recolour-g3p.js,
    // flatcut — no rim). Front only (owner 01/10, item 32): Black Carbon / Black Leather / Green Camo / Midnight Black /
    // Space Gray differ on the BACK, so their swatches = the median colour of UWELL's back panel for that colour
    // (multi-tone finishes: the more colourful half — presize-g3p.js). The 6-colour lineup was removed: it said "all"
    // over 6 of 16. 02/10: two all-colours images (owner 01/10 "ทั้งหมด 2 ชิ้น" → pills "ทั้งหมด 1" / "ทั้งหมด 2"), UWELL's
    // order in two groups of 8, the G5 layout — _incoming/image-sitewide/set1/poster.js g3p-a / g3p-b.
    openOnCardPhoto: true,
    lineupImage: {
      src: "/assets/products/caliburn-g3-pro/lineup-v2.webp",
      alt: "UWELL Caliburn G3 Pro, colours 1–8 of 16",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/caliburn-g3-pro/lineup2-v2.webp",
      alt: "UWELL Caliburn G3 Pro, colours 9–16 of 16",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    colorVariants: [
      { id: "pink-green", name: "Pink Green", swatchHex: "#986371", image: { src: "/assets/products/caliburn-g3-pro/variant-pink-green-v2.webp", alt: "UWELL Caliburn G3 Pro, Pink Green" } },
      { id: "frozen-aurora", name: "Frozen Aurora", swatchHex: "#c098a6", image: { src: "/assets/products/caliburn-g3-pro/variant-frozen-aurora-v2.webp", alt: "UWELL Caliburn G3 Pro, Frozen Aurora" } },
      { id: "frozen-green", name: "Frozen Green", swatchHex: "#7eb9a7", image: { src: "/assets/products/caliburn-g3-pro/variant-frozen-green-v2.webp", alt: "UWELL Caliburn G3 Pro, Frozen Green" } },
      { id: "golden-purple", name: "Golden Purple", swatchHex: "#736ca3", image: { src: "/assets/products/caliburn-g3-pro/variant-golden-purple-v2.webp", alt: "UWELL Caliburn G3 Pro, Golden Purple" } },
      { id: "golden-leopard", name: "Golden Leopard", swatchHex: "#948f84", image: { src: "/assets/products/caliburn-g3-pro/variant-golden-leopard-v2.webp", alt: "UWELL Caliburn G3 Pro, Golden Leopard" } },
      { id: "green-camo", name: "Green Camo", swatchHex: "#4e504c", image: { src: "/assets/products/caliburn-g3-pro/variant-green-camo-v2.webp", alt: "UWELL Caliburn G3 Pro, Green Camo" } },
      { id: "black-carbon", name: "Black Carbon", swatchHex: "#2b2a2f", image: { src: "/assets/products/caliburn-g3-pro/variant-black-carbon-v2.webp", alt: "UWELL Caliburn G3 Pro, Black Carbon" } },
      { id: "brown-wood", name: "Brown Wood", swatchHex: "#6f5850", image: { src: "/assets/products/caliburn-g3-pro/variant-brown-wood-v2.webp", alt: "UWELL Caliburn G3 Pro, Brown Wood" } },
      { id: "black-leather", name: "Black Leather", swatchHex: "#212026", image: { src: "/assets/products/caliburn-g3-pro/variant-black-leather-v2.webp", alt: "UWELL Caliburn G3 Pro, Black Leather" } },
      { id: "brown-leather", name: "Brown Leather", swatchHex: "#7d483e", image: { src: "/assets/products/caliburn-g3-pro/variant-brown-leather-v2.webp", alt: "UWELL Caliburn G3 Pro, Brown Leather" } },
      { id: "midnight-black", name: "Midnight Black", swatchHex: "#2e2e36", image: { src: "/assets/products/caliburn-g3-pro/variant-midnight-black-v2.webp", alt: "UWELL Caliburn G3 Pro, Midnight Black" } },
      { id: "space-gray", name: "Space Gray", swatchHex: "#767581", image: { src: "/assets/products/caliburn-g3-pro/variant-space-gray-v2.webp", alt: "UWELL Caliburn G3 Pro, Space Gray" } },
      { id: "stone-gray", name: "Stone Gray", swatchHex: "#9e9c9c", image: { src: "/assets/products/caliburn-g3-pro/variant-stone-gray-v2.webp", alt: "UWELL Caliburn G3 Pro, Stone Gray" } },
      { id: "pacific-blue", name: "Pacific Blue", swatchHex: "#46a7cd", image: { src: "/assets/products/caliburn-g3-pro/variant-pacific-blue-v2.webp", alt: "UWELL Caliburn G3 Pro, Pacific Blue" } },
      { id: "rose-gold", name: "Rose Gold", swatchHex: "#d4beba", image: { src: "/assets/products/caliburn-g3-pro/variant-rose-gold-v2.webp", alt: "UWELL Caliburn G3 Pro, Rose Gold" } },
      { id: "emerald-green", name: "Emerald Green", swatchHex: "#9dcdaf", image: { src: "/assets/products/caliburn-g3-pro/variant-emerald-green-v2.webp", alt: "UWELL Caliburn G3 Pro, Emerald Green" } },
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
    // (The morning-01/10 "no all-colours view" was replaced the same evening — see lineupImage below.)
    openOnCardPhoto: true,
    // Real UWELL color/finish lineup — "KOKO" is UWELL's touchscreen-edition naming convention
    // (see caliburn-g4-pro-koko's own comment) — same G3 Pro pod platform, not a separate system.
    // All-colours images (IMAGE_SPEC §0 item 5), 02/10: two groups in the colour order below — the one-image cluster of 8
    // boxes "looked too small" (owner 02/10) — "cluster" layout (Emerald Green big in front in group 1), pills "ทั้งหมด 1" / "ทั้งหมด 2";
    // _incoming/image-sitewide/dsx/koko-two.js.
    lineupImage: {
      src: "/assets/products/caliburn-g3-pro-koko/lineup-v3.webp",
      alt: "UWELL Caliburn G3 Pro KOKO, colours 1–4 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/caliburn-g3-pro-koko/lineup2-v3.webp",
      alt: "UWELL Caliburn G3 Pro KOKO, colours 5–8 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
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
