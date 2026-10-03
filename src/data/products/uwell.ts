import type { Product } from "@/types/catalog";

const gppCompatibility = {
  type: "pod" as const,
  label: "UWELL GPP cartridge platform",
  note: "Shared top-fill pod platform used across most current Caliburn devices; resistance options sold separately.",
};

// Article round 02/10: UWELL's G5 page — "All cartridges in G Pod Platform (GPP) are compatible", side and top refill.
// G5, G4 Pro, G4 Pro KOKO (batch 1c — UWELL's pod chart shows top and side refill); the shared note above ("top-fill") is re-checked per product in the UWELL batch.
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
        src: "/assets/products/caliburn-g5-lite/card-v2.webp",
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
    // Site-wide template round batch 1a (owner 03/10: set-1 UWELL colours re-tilted): every colour image = UWELL's own render cut
    // from the maker's colour strip (pc/spe3-lite*.webp — the largest UWELL serves), turned 12° in 2D, no AI; the page opens on the
    // card, the colour upright on 4:5 (_incoming/sitewide-template/1a/tilt.js).
    openOnCardPhoto: true,
    // Real UWELL color/finish lineup — ALL 8 now have a real, OFFICIAL photo (owner quality
    // review, 2026-09-03, THIRD pass — see the card asset's angle note for the sourcing story).
    // Every one of these 8 comes from the exact same official myuwell.com strip, cropped per-color.
    colorVariants: [
      {
        id: "candy-pink",
        name: "Candy Pink",
        swatchHex: "#f3adbb",
        image: { src: "/assets/products/caliburn-g5-lite/variant-candy-pink-v2.webp", alt: "UWELL Caliburn G5 Lite, Candy Pink" },
      },
      {
        id: "coral-orange",
        name: "Coral Orange",
        swatchHex: "#f2794f",
        image: { src: "/assets/products/caliburn-g5-lite/variant-coral-orange-v2.webp", alt: "UWELL Caliburn G5 Lite, Coral Orange" },
      },
      {
        id: "creamy-celadon",
        name: "Creamy Celadon",
        swatchHex: "#d4d3d4",
        image: { src: "/assets/products/caliburn-g5-lite/variant-creamy-celadon-v2.webp", alt: "UWELL Caliburn G5 Lite, Creamy Celadon" },
      },
      {
        id: "knight-black",
        name: "Knight Black",
        swatchHex: "#5e5e5e",
        image: { src: "/assets/products/caliburn-g5-lite/variant-knight-black-v2.webp", alt: "UWELL Caliburn G5 Lite, Knight Black" },
      },
      {
        id: "lemon-green",
        name: "Lemon Green",
        swatchHex: "#c4d94a",
        image: { src: "/assets/products/caliburn-g5-lite/variant-lemon-green-v2.webp", alt: "UWELL Caliburn G5 Lite, Lemon Green" },
      },
      {
        id: "mint-green",
        name: "Mint Green",
        swatchHex: "#cde4bd",
        image: { src: "/assets/products/caliburn-g5-lite/variant-mint-green-v2.webp", alt: "UWELL Caliburn G5 Lite, Mint Green" },
      },
      {
        id: "ocean-blue",
        name: "Ocean Blue",
        swatchHex: "#a1bff7",
        image: { src: "/assets/products/caliburn-g5-lite/variant-ocean-blue-v2.webp", alt: "UWELL Caliburn G5 Lite, Ocean Blue" },
      },
      {
        id: "starry-gray",
        name: "Starry Gray",
        swatchHex: "#c4c3c9",
        image: { src: "/assets/products/caliburn-g5-lite/variant-starry-gray-v2.webp", alt: "UWELL Caliburn G5 Lite, Starry Gray" },
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
        description: "No need to charge every day; how long yours lasts depends on how you use it.",
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
        description: "UWELL says Pro-FOCS 4.0 keeps every puff balanced.",
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
        src: "/assets/products/caliburn-g5-lite-se/card-v2.webp",
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
    // Site-wide template round batch 1a (owner 03/10: set-1 UWELL colours re-tilted): every colour image = UWELL's own render cut
    // from the maker's colour strip (pc/spe3-lite*.webp — the largest UWELL serves), turned 12° in 2D, no AI; the page opens on the
    // card, the colour upright on 4:5 (_incoming/sitewide-template/1a/tilt.js).
    openOnCardPhoto: true,
    // Real UWELL color/finish lineup — ALL 8 now have a real, OFFICIAL photo (owner quality
    // review, 2026-09-03, THIRD pass — see the card asset's angle note). All 8 finishes are
    // dual-tone leather per official copy; every one comes from the same official myuwell.com
    // strip, cropped per-color.
    colorVariants: [
      {
        id: "black-leather",
        name: "Black Leather",
        swatchHex: "#454545",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-black-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Black Leather" },
      },
      {
        id: "blue-leather",
        name: "Blue Leather",
        swatchHex: "#3fb6b5",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-blue-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Blue Leather" },
      },
      {
        id: "brown-leather",
        name: "Brown Leather",
        swatchHex: "#9d664e",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-brown-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Brown Leather" },
      },
      {
        id: "gray-leather",
        name: "Gray Leather",
        swatchHex: "#9ca7a9",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-gray-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Gray Leather" },
      },
      {
        id: "orange-leather",
        name: "Orange Leather",
        swatchHex: "#e67831",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-orange-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Orange Leather" },
      },
      {
        id: "pink-leather",
        name: "Pink Leather",
        swatchHex: "#eec7c8",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-pink-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Pink Leather" },
      },
      {
        id: "purple-leather",
        name: "Purple Leather",
        swatchHex: "#ceafde",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-purple-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, Purple Leather" },
      },
      {
        id: "white-leather",
        name: "White Leather",
        swatchHex: "#e8e0d5",
        image: { src: "/assets/products/caliburn-g5-lite-se/variant-white-leather-v2.webp", alt: "UWELL Caliburn G5 Lite SE, White Leather" },
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
        description: "No need to charge every day; how long yours lasts depends on how you use it.",
        subline: "Up to 6 days on a single charge (UWELL's figure).",
        image: { src: "/assets/products/caliburn-g5-lite/story-battery.webp", alt: "Official UWELL poster — 1600mAh, the Caliburn G5 Lite and G5 Lite SE", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 2215, height: 1613, transparent: true },
      },
      {
        id: "dual-tone",
        title: "Dual-tone finish",
        description: "Light and shaped to sit well in the hand — pick the colour that suits you.",
        subline: "Leather paired with a striped texture.",
        image: { src: "/assets/products/caliburn-g5-lite-se/story-dual-tone.webp", alt: "Official UWELL render — the Caliburn G5 Lite SE in Purple Leather", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5-lite-g5-lite-se", width: 1967, height: 2121, transparent: true },
      },
      {
        id: "power-35w",
        title: "35W, full flavour",
        description: "UWELL says Pro-FOCS 4.0 keeps every puff balanced.",
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
    // Site-wide template round, batch 1c (03/10): the G5 template — UWELL's own KOKO page
    // (https://www.myuwell.com/caliburn/caliburn-g4-pro-koko) told one poster per block; text in src/i18n/story-copy.ts, article in
    // src/data/product-articles.ts. Cover = UWELL's banner pc/banner.webp; naming / modes = stills from UWELL's own page films
    // (pc/Customize.mp4 · pc/7.mp4). No maker parts view → no exploded view. Posters: _incoming/sitewide-template/1c/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g4-pro-koko/story-cover.webp", alt: "Official UWELL banner — two people holding the Caliburn G4 Pro KOKO", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1920, height: 1080 },
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
      // Site-wide template round batch 1c (03/10): every row re-read from UWELL's own KOKO page, its spec sheet (pc/specifi.webp)
      // and the figures printed in its posters (_incoming/sitewide-template/1c/copy-en.md lists each). "Draw modes" was wrong: the
      // three modes set the power, not the draw — the row is "Output modes" now, in UWELL's own spelling "Customize".
      { key: "battery", label: "Battery", value: "2000mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "battery-life", label: "Battery life", value: "Up to 10 days of vaping (UWELL lab tests)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/mo/2000mah.jpg" },
      { key: "charge-time", label: "Charging", value: "USB-C, 5V/2.5A", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "screen", label: "Display", value: "2.0\" touchscreen", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe6-params.png" },
      { key: "touch", label: "Touch", value: "Touch accuracy above 99.99%, response under 0.2s (UWELL LAB)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe6-params.png" },
      { key: "modes", label: "Output modes", value: "Storm / Waves / Customize (power set at the start, middle and end of a puff)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko" },
      { key: "themes", label: "Screen themes", value: "5 blind-draw UI themes", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko" },
      { key: "settings", label: "Settings", value: "8 languages (no Thai) · rename with Clean UI · brightness, screen timeout, animation, battery saver, system reset", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko" },
      { key: "airflow", label: "Airflow", value: "Stepless airflow control", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe8-params.png" },
      { key: "flavor-tech", label: "Flavor system", value: "PRO-FOCS 4.0", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe8-params.png" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT & FDA) / 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "included-pod", label: "Included pod", value: "FeCrAl meshed, by market version: INT & FDA 0.4Ω + 0.6Ω (side refill); TPD 0.4Ω + 0.9Ω, CRC 0.4Ω + 0.6Ω (top refill)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (G3 pods included), 0.4Ω–1.2Ω, top or side refill, previous and upgraded; refill without removing the pod", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe10-yandan.png" },
      { key: "anti-leak", label: "Anti-leak system", value: "U² anti-leak", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko" },
      { key: "materials", label: "Materials", value: "Aluminium, ABS, IML, PCTG", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "dimensions", label: "Dimensions", value: "85.8 × 50 × 23 mm (INT & FDA) / 82.7 mm long (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/specifi.webp" },
      { key: "weight", label: "Weight", value: "Approx. 93g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/spe6-params.png" },
    ],
    features: [
      {
        id: "blind-draw",
        title: "Blind-draw themes",
        description: "The themes come from UWELL's blind-draw card game — collecting them is fun of its own.",
        subline: "You don't know which one you get until it opens.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-blind-draw.webp", alt: "Official UWELL poster — 5 blind-draw UI themes on the Caliburn G4 Pro KOKO", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1360, height: 733, transparent: true },
      },
      {
        id: "one-tap",
        title: "Core features in one tap",
        description: "UWELL built this screen for vapers: uncluttered and intuitive.",
        subline: "The first KOKO with a touchscreen.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-one-tap.webp", alt: "Official UWELL poster — core features in one tap on the KOKO touchscreen", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1584, height: 1391, transparent: true },
      },
      {
        id: "screen",
        title: "2.0-inch touchscreen",
        description: "Minimal bezels and an ergonomic curve that sits snugly in the hand.",
        subline: "Comfortable in the hand.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-screen.webp", alt: "Official UWELL poster — the KOKO's screen, \"Ultra-Shatterproof Screen\" printed by UWELL", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1040, height: 747, transparent: true },
      },
      {
        id: "battery",
        title: "Long battery life",
        description: "One full charge lasts up to 10 days (UWELL lab tests).",
        subline: "2000mAh.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-battery.webp", alt: "Official UWELL poster — 2000mAh mega battery", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1121, height: 500, transparent: true },
      },
      {
        id: "naming",
        title: "Name your device",
        description: "Switch on Clean UI and type the name on the screen; the other settings sit in the same menu.",
        subline: "From inside jokes to iconic names.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-naming.webp", alt: "Still from UWELL's KOKO film — renaming the device on the on-screen keyboard", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1920, height: 1097 },
      },
      {
        id: "modes",
        title: "Three modes",
        description: "Storm for an instant throat hit, Waves for a smooth, steady taste, Customize set the way you like.",
        subline: "Storm, Waves and Customize.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-modes.webp", alt: "Still from UWELL's KOKO film — Customize mode, power set at the start, middle and end of a puff", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1200, height: 1013 },
      },
      {
        id: "pods",
        title: "Takes every GPP pod",
        description: "The upgraded pods fit the G3 series too, and you refill without taking the pod out.",
        subline: "Previous and upgraded.",
        image: { src: "/assets/products/caliburn-g4-pro-koko/story-pods.webp", alt: "Official UWELL chart — GPP pods, top and side refill, 0.4Ω to 1.2Ω", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1800, height: 1200, transparent: true },
      },
    ],
    compatibility: [gppSideTopCompatibility, g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want a Caliburn with a touchscreen and selectable output modes, without stepping up to a pod kit.",
      "Anyone who likes a box shape they can make their own — collectable themes and a name of their choosing.",
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
        src: "/assets/products/caliburn-g4-pro/card-v2.webp",
        alt: "UWELL Caliburn G4 Pro, Pearl Silver, screen side, isolated product shot",
        angle: "Screen side, upright on 4:5 — cut whole from UWELL's own colour render (batch 1c colours, 03/10)",
        transparentBackground: true,
        sourceName: "UWELL",
        sourceUrl: "https://www.myuwell.com/products/caliburn",
      },
    ],
    // Site-wide template round, batch 1c (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g4-pro) told one poster per block; text in src/i18n/story-copy.ts, article in
    // src/data/product-articles.ts. Cover = UWELL's banner pc/banner.webp; one-tap / themes / settings / custom-mode / battery = stills
    // from UWELL's own page films (video/theme.mp4 · 7.mp4 · 4.mp4). UWELL's "Look Closer" close-ups are labels laid over their device
    // and cannot stand alone — not used. No maker parts view → no exploded view. Posters: _incoming/sitewide-template/1c/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g4-pro/story-cover.webp", alt: "Official UWELL banner — the Caliburn G4 Pro in the hand", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1920, height: 1080 },
    // Real UWELL color/finish lineup — QC RECOVERY PASS (2026-09-03, THIRD pass). "Pearl Silver"
    // was never part of this batch — it keeps this product's own original, pre-existing card
    // photo, already good. The other 7 previously came from vapesourcing.com and had the same
    // confirmed jagged-edge defect found across this whole batch; replaced from elementvape.com's
    // own studio photography instead. 6 of those 7 are genuinely clean, no watermark. One (Light
    // Green) had a retailer watermark sitting directly on the device's own base — wide enough
    // that neither a crop nor a small local patch could remove it without visibly cutting the
    // device or risking another seam — reverted to swatch-only until a clean source is found.
    // Site-wide template round batch 1c colours (owner 03/10): every colour image = the screen side + the back side cut whole from
    // UWELL's own per-colour render (a clean gap between the two devices — no AI), upright, then tilted 12° together (the finish
    // pattern is on the back only); the page opens on the card, Pearl Silver upright on 4:5 (_incoming/sitewide-template/1c-colours/).
    openOnCardPhoto: true,
    colorVariants: [
      {
        id: "desert-gold",
        name: "Desert Gold",
        swatchHex: "#c9a24b",
        image: { src: "/assets/products/caliburn-g4-pro/variant-desert-gold-v2.webp", alt: "UWELL Caliburn G4 Pro, Desert Gold" },
      },
      {
        id: "fantasy-pink",
        name: "Fantasy Pink",
        swatchHex: "#e6a3c0",
        image: { src: "/assets/products/caliburn-g4-pro/variant-fantasy-pink-v2.webp", alt: "UWELL Caliburn G4 Pro, Fantasy Pink" },
      },
      {
        id: "frost-white",
        name: "Frost White",
        swatchHex: "#e8ecec",
        image: { src: "/assets/products/caliburn-g4-pro/variant-frost-white-v2.webp", alt: "UWELL Caliburn G4 Pro, Frost White" },
      },
      {
        id: "ink-blue",
        name: "Ink Blue",
        swatchHex: "#1e3a5c",
        image: { src: "/assets/products/caliburn-g4-pro/variant-ink-blue-v2.webp", alt: "UWELL Caliburn G4 Pro, Ink Blue" },
      },
      {
        id: "iron-gray",
        name: "Iron Gray",
        swatchHex: "#5c5f63",
        image: { src: "/assets/products/caliburn-g4-pro/variant-iron-gray-v2.webp", alt: "UWELL Caliburn G4 Pro, Iron Gray" },
      },
      {
        id: "light-green",
        name: "Light Green",
        swatchHex: "#a8d5ba",
        // 2026-09-05: official myuwell.com color-7.webp (owner-supplied link; the numbered file the
        // owner named, color-8, turned out to be Fantasy Pink — each file's printed label was read)
        image: { src: "/assets/products/caliburn-g4-pro/variant-light-green-v2.webp", alt: "UWELL Caliburn G4 Pro, Light Green" },
      },
      {
        id: "pearl-silver",
        name: "Pearl Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-pro/variant-pearl-silver-v2.webp", alt: "UWELL Caliburn G4 Pro, Pearl Silver" },
      },
      {
        id: "stripe-black",
        name: "Stripe Black",
        swatchHex: "#1c1c1c",
        image: { src: "/assets/products/caliburn-g4-pro/variant-stripe-black-v2.webp", alt: "UWELL Caliburn G4 Pro, Stripe Black" },
      },
    ],
    specifications: [
      // Site-wide template round batch 1c (03/10): every row re-read from UWELL's own G4 Pro page, its spec sheet
      // (pc/specifi.webp) and the figures printed in its posters and films (_incoming/sitewide-template/1c/copy-en.md lists each).
      { key: "battery", label: "Battery", value: "1800mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "battery-life", label: "Battery life", value: "Up to 7 days of use (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/video/4.mp4" },
      { key: "charge-time", label: "Charging", value: "USB-C, 5V/2.5A", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      // Owner 2026-09-14 dropped "shatterproof" because the page text did not say it (researcher 2026-09-12). Batch 1c (03/10):
      // UWELL's own poster on that page prints "2.51-Inch Ultra-shatterproof screen" (pc/nch.webp) — asked the owner before it comes back.
      { key: "screen", label: "Display", value: "2.51\" touchscreen", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/nch.webp" },
      { key: "touch", label: "Touch", value: "Touch accuracy above 99.99%, response under 0.2s (UWELL LAB)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/nch.webp" },
      { key: "modes", label: "Output modes", value: "Storm / Waves / Custom (power set at the start, middle and end of a puff)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro" },
      { key: "themes", label: "Screen themes", value: "6 UI themes: 3 ready, 3 unlocked at 5,000 / 10,000 / 20,000 puffs", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/video/theme.mp4" },
      { key: "settings", label: "Settings", value: "8 languages (no Thai) · rename with Clean UI · brightness, screen timeout, animation, battery saver", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro" },
      { key: "airflow", label: "Airflow", value: "Stepless airflow control", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/7-text.webp" },
      { key: "flavor-tech", label: "Flavor system", value: "PRO-FOCS 4.0", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/7-text.webp" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT & FDA) / 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "included-pod", label: "Included pod", value: "FeCrAl meshed, by market version: INT & FDA 0.4Ω + 0.6Ω (side refill); TPD 0.4Ω + 0.9Ω, CRC 0.4Ω + 0.6Ω (top refill)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (G3 pods included), 0.4Ω–1.2Ω, top or side refill, previous and upgraded; refill without removing the pod", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/yandan.webp" },
      { key: "anti-leak", label: "Anti-leak system", value: "U² anti-leak", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro" },
      { key: "materials", label: "Materials", value: "Aluminium, ABS, IML, PCTG", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "dimensions", label: "Dimensions", value: "30 × 18.5 × 120.7 mm (INT & FDA) / 117.5 mm long (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/specifi.webp" },
      { key: "weight", label: "Weight", value: "Approx. 78g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-pro/pc/4.webp" },
    ],
    features: [
      {
        id: "one-tap",
        title: "One tap does it",
        description: "The core functions sit on the screen itself, so there are no instructions to memorise.",
        subline: "UWELL's first smart touchscreen.",
        image: { src: "/assets/products/caliburn-g4-pro/story-one-tap.webp", alt: "Still from UWELL's Caliburn G4 Pro film — switching output modes on the touchscreen", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1600, height: 900 },
      },
      {
        id: "themes",
        title: "Six screen themes",
        description: "UWELL wants vaping to feel like levelling up: keep using it and the screen has something new to open.",
        subline: "Half ready to use, half to unlock.",
        image: { src: "/assets/products/caliburn-g4-pro/story-themes.webp", alt: "Still from UWELL's Caliburn G4 Pro film — three hidden screen themes, locked until set puff counts", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1600, height: 900 },
      },
      {
        id: "settings",
        title: "Settings menu",
        description: "UWELL keeps the rest of the settings in this one menu.",
        subline: "Swipe down the screen.",
        image: { src: "/assets/products/caliburn-g4-pro/story-settings.webp", alt: "Still from UWELL's Caliburn G4 Pro film — the settings menu screens", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1600, height: 900 },
      },
      {
        id: "custom-mode",
        title: "Custom mode",
        description: "Storm gives an instant throat hit, Waves a smooth flavour. This one you tune yourself.",
        subline: "Storm and Waves are still there.",
        image: { src: "/assets/products/caliburn-g4-pro/story-custom-mode.webp", alt: "Still from UWELL's Caliburn G4 Pro film — power set at the start, middle and end of a puff", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1200, height: 1013 },
      },
      {
        id: "battery",
        title: "Charge less often",
        description: "How long yours lasts depends on how often you vape and the wattage you set.",
        subline: "A bigger battery than the standard G4.",
        image: { src: "/assets/products/caliburn-g4-pro/story-battery.webp", alt: "Still from UWELL's Caliburn G4 Pro film — 1800mAh, up to 7 days of use", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1800, height: 1333 },
      },
      {
        id: "pods",
        title: "Takes every GPP pod",
        description: "The upgraded pods fit the G3 series too, and you refill without taking the pod out.",
        subline: "Previous and upgraded.",
        image: { src: "/assets/products/caliburn-g4-pro/story-pods.webp", alt: "Official UWELL chart — GPP pods, top and side refill, 0.4Ω to 1.2Ω", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1800, height: 1201, transparent: true },
      },
    ],
    compatibility: [gppSideTopCompatibility, g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who want a big touchscreen they can read and adjust at a glance.",
      "Anyone who wants to fine-tune the draw with stepless airflow.",
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
        src: "/assets/products/caliburn-g4/card-v2.webp",
        alt: "UWELL Caliburn G4, Seashell White, front, isolated product shot",
        angle: "Front, upright on 4:5 — the front device of UWELL's own render (batch 1b, 03/10)",
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
    // Site-wide template round, batch 1b (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g4) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Cover = UWELL's banner pc/banner.webp. "taste" and "airflow" = stills from UWELL's own airflow films (air2 / air1.mp4). Posters: _incoming/sitewide-template/1b/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g4/story-cover.webp", alt: "Official UWELL banner — the Caliburn G4", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 1920, height: 1080 },
    // Site-wide template round batch 1b (owner 03/10: set-1 UWELL colours re-tilted): every colour image = the front device of UWELL's
    // own per-colour render, turned 12° in 2D, no AI; the page opens on the card, the card colour upright on 4:5
    // (_incoming/sitewide-template/1b/tilt.js). Swatches = the body colour of the same renders (1b/swatch.js).
    openOnCardPhoto: true,
    colorVariants: [
      {
        id: "flamingo-red",
        name: "Flamingo Red",
        swatchHex: "#ed888e",
        image: { src: "/assets/products/caliburn-g4/variant-flamingo-red-v2.webp", alt: "UWELL Caliburn G4, Flamingo Red" },
      },
      {
        id: "glacier-blue",
        name: "Glacier Blue",
        swatchHex: "#b4dade",
        image: { src: "/assets/products/caliburn-g4/variant-glacier-blue-v2.webp", alt: "UWELL Caliburn G4, Glacier Blue" },
      },
      {
        id: "gunmetal-grey",
        name: "Gunmetal Grey",
        swatchHex: "#716f6d",
        image: { src: "/assets/products/caliburn-g4/variant-gunmetal-grey-v2.webp", alt: "UWELL Caliburn G4, Gunmetal Grey" },
      },
      {
        id: "karst-grey",
        name: "Karst Grey",
        swatchHex: "#b9bfc4",
        image: { src: "/assets/products/caliburn-g4/variant-karst-grey-v2.webp", alt: "UWELL Caliburn G4, Karst Grey" },
      },
      {
        id: "polar-black",
        name: "Polar Black",
        swatchHex: "#58585b",
        image: { src: "/assets/products/caliburn-g4/variant-polar-black-v2.webp", alt: "UWELL Caliburn G4, Polar Black" },
      },
      {
        id: "sahara-gold",
        name: "Sahara Gold",
        swatchHex: "#e5dba7",
        image: { src: "/assets/products/caliburn-g4/variant-sahara-gold-v2.webp", alt: "UWELL Caliburn G4, Sahara Gold" },
      },
      {
        id: "seashell-white",
        name: "Seashell White",
        swatchHex: "#ede7de",
        image: { src: "/assets/products/caliburn-g4/variant-seashell-white-v2.webp", alt: "UWELL Caliburn G4, Seashell White" },
      },
      {
        id: "twilight-silver",
        name: "Twilight Silver",
        swatchHex: "#a8adb3",
        image: { src: "/assets/products/caliburn-g4/variant-twilight-silver-v2.webp", alt: "UWELL Caliburn G4, Twilight Silver" },
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
      // Batch 1b (03/10): the in-box pods differ by market version (UWELL's spec sheet) — "0.4Ω and 0.9Ω" was the INT kit only.
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods, previous and upgraded; refill without removing the pod", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "included-pod", label: "Included pod", value: "FeCrAl meshed, by market version: INT 0.4Ω + 0.9Ω, FDA 0.6Ω + 0.9Ω (side refill); TPD & CRC 0.4Ω + 0.6Ω (top refill)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0 with upgraded GPP pods: up to 35% longer cartridge life and 35% more flavour satisfaction (UWELL lab tests)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "airflow", label: "Airflow", value: "Airflow slider + reversible pod, usable together", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "control", label: "Control system", value: "One multi-function button: 1 click screen on · 2 lock/unlock button firing · 3 adjust wattage · 4 menu · 5 on/off", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/significant-l.webp" },
      { key: "anti-leak", label: "Anti-leak system", value: "U²: ultrasonic welding + U-shaped channel", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT & FDA) / 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "materials", label: "Materials", value: "PCTG, ABS, aluminium alloy ADC12", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "dimensions", label: "Dimensions", value: "26 × 15.65 × 114.98 mm (INT & FDA) / 111.98 mm long (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "weight", label: "Weight", value: "Approx. 54.7g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
    ],
    features: [
      {
        id: "taste",
        title: "Taste above everything",
        description: "UWELL built the G4 around flavour: the upgraded pods and its flavour tech work together.",
        subline: "Upgraded GPP pods on PRO-FOCS 4.0.",
        image: { src: "/assets/products/caliburn-g4/story-taste.webp", alt: "Still from UWELL's Caliburn G4 film — vapour rising from the pod", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 900, height: 1200 },
      },
      {
        id: "modes",
        title: "Storm or Waves",
        description: "Storm hits fast, like a roller coaster. Waves stays smooth and steady, like the London Eye.",
        subline: "Two modes, picked on a 0.85-inch colour screen.",
        image: { src: "/assets/products/caliburn-g4/story-modes.webp", alt: "Official UWELL render — three Caliburn G4s with different screen themes", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 908, height: 1210, transparent: true },
      },
      {
        id: "button",
        title: "One button for everything",
        description: "Wake the screen, lock the button, set the wattage, open the menu or switch off — without a second button.",
        subline: "Count the clicks.",
        image: { src: "/assets/products/caliburn-g4/story-button.webp", alt: "Official UWELL poster — the Caliburn G4 multi-functional control button", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 1803, height: 1200 },
      },
      {
        id: "airflow",
        title: "Airflow your way",
        description: "Slide the airflow valve, load the pod the other way round, or combine the two.",
        subline: "Three ways to set the draw.",
        image: { src: "/assets/products/caliburn-g4/story-airflow.webp", alt: "Still from UWELL's Caliburn G4 airflow film — the airflow slider", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 900, height: 1200 },
      },
      {
        id: "pods",
        title: "Takes every GPP pod",
        description: "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.",
        subline: "Old GPP pods and the upgraded ones.",
        image: { src: "/assets/products/caliburn-g4/story-pods.webp", alt: "Official UWELL chart — GPP pods, top and side refill", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 1800, height: 1200 },
      },
      {
        id: "anti-leak",
        title: "Every drop stays put",
        description: "Ultrasonic welding seals the pod against leaks, and a U-shaped channel improves the airflow.",
        subline: "UWELL's U² technique.",
        image: { src: "/assets/products/caliburn-g4/story-anti-leak.webp", alt: "Official UWELL renders — ultrasonic welding and the U-shaped channel inside a GPP pod", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 2693, height: 955 },
      },
    ],
    compatibility: [gppCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who want a screen and a daily choice between a hard hit and a smooth one.",
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
        src: "/assets/products/caliburn-g4-mini/card-v2.webp",
        alt: "UWELL Caliburn G4 Mini, Slate Grey, front, isolated product shot",
        angle: "Front, upright on 4:5 — the front device of UWELL's own render (batch 1b, 03/10)",
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
    // Template round 03/10 (owner: "ภาพรวมเล็กไป ขยายใหญ่หน่อย"): two groups of 6 like G3 Pro — solid colours (hero Slate Grey) /
    // gradient finishes (hero Peafowl Emerald), set1/poster.js g4m-a / g4m-b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/caliburn-g4-mini/lineup-v3.webp",
      alt: "UWELL Caliburn G4 Mini, the 6 solid colours",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    lineupImage2: {
      src: "/assets/products/caliburn-g4-mini/lineup2-v3.webp",
      alt: "UWELL Caliburn G4 Mini, the 6 gradient finishes",
      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    // Site-wide template round, batch 1b (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g4-mini) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Cover = UWELL's banner pc/banner.webp (white studio, in its card). "airflow" = a still from UWELL's own airflow film (pc/air1.mp4). Posters: _incoming/sitewide-template/1b/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g4-mini/story-cover.webp", alt: "Official UWELL banner — the Caliburn G4 mini", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 1920, height: 1040 },
    // Site-wide template round batch 1b (owner 03/10: set-1 UWELL colours re-tilted): every colour image = the front device of UWELL's
    // own per-colour render, turned 12° in 2D, no AI; the page opens on the card, the card colour upright on 4:5
    // (_incoming/sitewide-template/1b/tilt.js). Swatches = the body colour of the same renders (1b/swatch.js).
    openOnCardPhoto: true,
    colorVariants: [
      {
        id: "bright-pink",
        name: "Bright Pink",
        swatchHex: "#dcc6c9",
        image: { src: "/assets/products/caliburn-g4-mini/variant-bright-pink-v2.webp", alt: "UWELL Caliburn G4 Mini, Bright Pink" },
      },
      {
        id: "champagne-gold",
        name: "Champagne Gold",
        swatchHex: "#b2a480",
        image: { src: "/assets/products/caliburn-g4-mini/variant-champagne-gold-v2.webp", alt: "UWELL Caliburn G4 Mini, Champagne Gold" },
      },
      {
        id: "coast-gold",
        name: "Coast Gold",
        swatchHex: "#cbc7b2",
        image: { src: "/assets/products/caliburn-g4-mini/variant-coast-gold-v2.webp", alt: "UWELL Caliburn G4 Mini, Coast Gold" },
      },
      {
        id: "dusty-indigo",
        name: "Dusty Indigo",
        swatchHex: "#556f8e",
        image: { src: "/assets/products/caliburn-g4-mini/variant-dusty-indigo-v2.webp", alt: "UWELL Caliburn G4 Mini, Dusty Indigo" },
      },
      {
        id: "grass-green",
        name: "Grass Green",
        swatchHex: "#7cb342",
        image: { src: "/assets/products/caliburn-g4-mini/variant-grass-green-v2.webp", alt: "UWELL Caliburn G4 Mini, Grass Green" },
      },
      {
        id: "lake-blue",
        name: "Lake Blue",
        swatchHex: "#3d7ea6",
        image: { src: "/assets/products/caliburn-g4-mini/variant-lake-blue-v2.webp", alt: "UWELL Caliburn G4 Mini, Lake Blue" },
      },
      {
        id: "light-silver",
        name: "Light Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/caliburn-g4-mini/variant-light-silver-v2.webp", alt: "UWELL Caliburn G4 Mini, Light Silver" },
      },
      {
        id: "night-black",
        name: "Night Black",
        swatchHex: "#525154",
        image: { src: "/assets/products/caliburn-g4-mini/variant-night-black-v2.webp", alt: "UWELL Caliburn G4 Mini, Night Black" },
      },
      {
        id: "paddy-green",
        name: "Paddy Green",
        swatchHex: "#348248",
        image: { src: "/assets/products/caliburn-g4-mini/variant-paddy-green-v2.webp", alt: "UWELL Caliburn G4 Mini, Paddy Green" },
      },
      {
        id: "peafowl-emerald",
        name: "Peafowl Emerald",
        swatchHex: "#70b4a6",
        image: { src: "/assets/products/caliburn-g4-mini/variant-peafowl-emerald-v2.webp", alt: "UWELL Caliburn G4 Mini, Peafowl Emerald" },
      },
      {
        id: "phoenix-purple",
        name: "Phoenix Purple",
        swatchHex: "#7b4a8e",
        image: { src: "/assets/products/caliburn-g4-mini/variant-phoenix-purple-v2.webp", alt: "UWELL Caliburn G4 Mini, Phoenix Purple" },
      },
      {
        id: "slate-grey",
        name: "Slate Grey",
        swatchHex: "#8d919c",
        image: { src: "/assets/products/caliburn-g4-mini/variant-slate-grey-v2.webp", alt: "UWELL Caliburn G4 Mini, Slate Grey" },
      },
    ],
    specifications: [
      // Data round (2026-09-24, real browser): UWELL's G4 Mini spec image says the box holds ONE FeCrAl meshed 0.6Ω
      // cartridge — the old row ("0.4Ω / 0.9Ω included") was wrong. "~58 minutes" is on no UWELL page → unverified.
      // "No screen": the manual's product overview lists an LED light and no display.
      { key: "battery", label: "Battery", value: "1100mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "charge-time", label: "Charge time", value: "~58 minutes at 2A", sourceStatus: "unverified" },
      { key: "screen", label: "Display", value: "None — no onboard screen", sourceStatus: "verified", sourceUrl: "https://manuals.plus/caliburn/kpn025-g4-mini-kit-manual" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods, previous and upgraded (FeCrAl meshed 0.6Ω in the box); refill without removing the pod", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "firing", label: "Firing", value: "Auto draw", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0 with upgraded GPP pods: up to 35% more flavour satisfaction and 35% longer cartridge life (UWELL lab tests)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini" },
      { key: "airflow", label: "Airflow", value: "Airflow slider + reversible pod, usable together", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini" },
      { key: "anti-leak", label: "Anti-leak system", value: "U²: ultrasonic welding + U-shaped channel", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT/FDA) / 2mL (TPD/CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "materials", label: "Materials", value: "PCTG, PC", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "dimensions", label: "Dimensions", value: "24.1 × 14 × 112.7 mm (INT/FDA) / 109.7 mm long (TPD/CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
      { key: "weight", label: "Weight", value: "Approx. 46g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
    ],
    features: [
      {
        id: "minimal",
        title: "Minimal design",
        description: "A slim, simple body that sits easily in the hand and the pocket.",
        subline: "Grab it. Own it.",
        image: { src: "/assets/products/caliburn-g4-mini/story-minimal.webp", alt: "Official UWELL photo — a hand holding the Caliburn G4 mini", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 1400, height: 1400 },
      },
      {
        id: "taste",
        title: "Awesome taste",
        description: "PRO-FOCS 4.0 keeps the true taste of your e-liquid.",
        subline: "Savour every puff.",
        image: { src: "/assets/products/caliburn-g4-mini/story-taste.webp", alt: "Official UWELL illustration from the Caliburn G4 mini page — a long exhale", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 1296, height: 1220 },
      },
      {
        id: "airflow",
        title: "Airflow your way",
        description: "Slide the airflow valve, load the pod the other way round, or combine the two.",
        subline: "Three ways to set the draw.",
        image: { src: "/assets/products/caliburn-g4-mini/story-airflow.webp", alt: "Still from UWELL's Caliburn G4 mini airflow film — the airflow slider", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 900, height: 1200 },
      },
      {
        id: "pods",
        title: "Takes every GPP pod",
        description: "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.",
        subline: "Old GPP pods and the upgraded ones.",
        image: { src: "/assets/products/caliburn-g4-mini/story-pods.webp", alt: "Official UWELL render — refilling the Caliburn G4 mini without taking the pod out", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 920, height: 1201 },
      },
      {
        id: "anti-leak",
        title: "Every drop stays put",
        description: "Ultrasonic welding seals the pod against leaks, and a U-shaped channel improves the airflow.",
        subline: "UWELL's U² technique.",
        image: { src: "/assets/products/caliburn-g4-mini/story-anti-leak.webp", alt: "Official UWELL renders — ultrasonic welding and the U-shaped channel inside a GPP pod", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-mini", width: 2397, height: 850 },
      },
    ],
    compatibility: [gppCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who like a small device with no screen to watch: pick it up and vape.",
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
      batteryMah: 1400,
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
    // Site-wide template round, batch 1b (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g4-classic) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Cover = UWELL's banner pc/banner.webp. "craft" = the photo half of UWELL's spec image (pc/spe10); "rgb-light" / "dual-control" = two panels of UWELL's photo strip (pc/spe9). Posters: _incoming/sitewide-template/1b/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g4-classic/story-cover.webp", alt: "Official UWELL banner — the Caliburn G4 Classic and its light", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 1920, height: 1080 },
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
      // Batch 1b (03/10): every row from UWELL's G4 Classic page and spec sheet — it is its own body (aluminium, no screen, 1400 mAh),
      // not a finish of the G4; the two old unverified rows ("same as G4 1300mAh", "classic-finish edition") are gone.
      { key: "battery", label: "Battery", value: "1400mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "screen", label: "Status indicator", value: "14 RGB LEDs, no screen; battery shown green (high) · blue (medium) · red (low)", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "firing", label: "Firing", value: "Twin sensors (draw) or button (approx. 255gf); UWELL LAB: 300%+ auto-draw lifespan, 99.999%+ trigger accuracy", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "control", label: "Control system", value: "5 clicks on/off · 2 clicks lock/unlock button firing · 1 click fire / show battery", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "airflow", label: "Airflow", value: "Stepless damping airflow control + reversible pod", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 4.0", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "anti-leak", label: "Anti-leak system", value: "U² anti-leak", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods; refill without removing the pod; clear e-liquid window", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT & FDA) / 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "included-pod", label: "Included pod", value: "FeCrAl meshed, by market version: INT & FDA 0.4Ω + 0.6Ω (side refill); TPD 0.4Ω + 0.9Ω, CRC 0.4Ω + 0.6Ω (top refill)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "materials", label: "Materials", value: "PC, aluminium alloy, PCTG", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "dimensions", label: "Dimensions", value: "29 × 16.6 × 115.9 mm (INT & FDA) / 112.8 mm long (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
      { key: "charging", label: "Charging", value: "USB-C, 5V/2A", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-classic/pc/spe10.webp" },
    ],
    features: [
      {
        id: "craft",
        title: "Crafted the classic way",
        description: "Countless micro CNC passes leave a zirconia-smooth finish, and the one-piece winged shape sits smoothly in the hand.",
        subline: "A decade of UWELL craftsmanship.",
        image: { src: "/assets/products/caliburn-g4-classic/story-craft.webp", alt: "Official UWELL photo — the Caliburn G4 Classic in its four colours", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 1470, height: 1059 },
      },
      {
        id: "twin-sensor",
        title: "Twin sensors",
        description: "Two sensors work together, so every puff is caught.",
        subline: "A main sensor and a backup, in sync.",
        image: { src: "/assets/products/caliburn-g4-classic/story-twin-sensor.webp", alt: "Official UWELL render — the Caliburn G4 Classic in green with a puff of vapour", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 2400, height: 1350 },
      },
      {
        id: "rgb-light",
        title: "Light that breathes",
        description: "The base glows in shifting colours as you puff — the glow of classic e-cigarettes, with a modern twist.",
        subline: "14 mini RGB LEDs.",
        image: { src: "/assets/products/caliburn-g4-classic/story-rgb-light.webp", alt: "Official UWELL photo — the light at the base of the Caliburn G4 Classic", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 1720, height: 746 },
      },
      {
        id: "dual-control",
        title: "Two ways for air, two ways to fire",
        description: "Turn the airflow without steps or flip the pod; fire with a light press of the button or simply draw.",
        subline: "Set it the way you vape.",
        image: { src: "/assets/products/caliburn-g4-classic/story-dual-control.webp", alt: "Official UWELL photo — the airflow window of the Caliburn G4 Classic", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 850, height: 746 },
      },
      {
        id: "pods",
        title: "Takes GPP pods",
        description: "A clear window shows how much e-liquid is left.",
        subline: "Refill without taking the pod out.",
        image: { src: "/assets/products/caliburn-g4-classic/story-pods.webp", alt: "Official UWELL render — refilling the Caliburn G4 Classic without taking the pod out", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 1162, height: 834 },
      },
      {
        id: "pro-focs",
        title: "PRO-FOCS 4.0",
        description: "Paired with U² anti-leak, so the taste stays clean and the e-liquid stays in the pod.",
        subline: "UWELL's flavour technology.",
        image: { src: "/assets/products/caliburn-g4-classic/story-pro-focs.webp", alt: "Official UWELL artwork — PRO-FOCS", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 896, height: 689 },
      },
    ],
    compatibility: [gppCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who like reading the battery from a light and want a finely made aluminium body.",
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
    // Site-wide template round batch 1d (04/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g3-pro) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Facts: _incoming/sitewide-template/1d/facts-uwell.md (UWELL page, posters, UWELL's user manual). Posters: 1d/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyStartRight: true,
    storyCover: { src: "/assets/products/caliburn-g3-pro/story-cover.webp", alt: "Official UWELL banner — the Caliburn G3 Pro", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 800 },
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
      // Site-wide template round batch 1d (04/10): every row re-read from UWELL (page, posters, spec sheet, user manual).
      { key: "battery", label: "Battery", value: "1000mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/ow-product-material/User%20Manual-20240709173855406.zip" },
      { key: "charge-time", label: "Charging", value: "USB-C, 2A", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro" },
      { key: "output", label: "Output range", value: "5–35W (0.4Ω pod); 5–25W (0.6Ω); 5–15W (0.9Ω)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/ow-product-material/User%20Manual-20240709173855406.zip" },
      { key: "screen", label: "Display", value: "Full-screen LCD: wattage, battery in 4 bars, puff count up to 999", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/ow-product-material/User%20Manual-20240709173855406.zip" },
      { key: "firing", label: "Firing", value: "Draw or button; press twice to lock the button (draw only) · press 3 times: wattage · press 5 times: on/off", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/ow-product-material/User%20Manual-20240709173855406.zip" },
      { key: "airflow", label: "Airflow", value: "Fine-tuning airflow adjustment valve", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro" },
      { key: "pod", label: "Pod capacity", value: "3mL (0.4Ω) / 2.5mL (INT & FDA); 2mL (CRC & TPD)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburnG3Pro/pc/window/windowValue.webp" },
      { key: "included-pod", label: "Included pod", value: "FeCrAl meshed 0.4Ω + 0.9Ω, side refill", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/ow-product-material/User%20Manual-20240709173855406.zip" },
      { key: "pod-compat", label: "Pod platform", value: "Every Caliburn G3 (GPP) pod, 0.4Ω–1.2Ω, top or side refill", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburnG3Pro/pc/gppMid.webp" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro" },
      { key: "materials", label: "Materials", value: "PCTG, zinc alloy", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburnG3Pro/pc/window/windowValue.webp" },
      { key: "dimensions", label: "Dimensions", value: "123.5 × 27.8 × 16.8 mm", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburnG3Pro/pc/window/windowValue.webp" },
      { key: "weight", label: "Weight", value: "Approx. 92g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburnG3Pro/pc/window/windowValue.webp" },
    ],
    features: [
      {
        id: "full-screen",
        title: "The whole front is a screen",
        description: "Wattage, battery and your puff count are there at a glance, no window to squint at.",
        subline: "UWELL calls it the first full-screen pod.",
        image: { src: "/assets/products/caliburn-g3-pro/story-full-screen.webp", alt: "UWELL's Caliburn G3 Pro poster — the full-screen display close up", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 800, transparent: true },
      },
      {
        id: "power",
        title: "Power to suit the pod",
        description: "Press the button three times, then pick the wattage.",
        subline: "Each pod has its own range.",
        image: { src: "/assets/products/caliburn-g3-pro/story-power.webp", alt: "UWELL's Caliburn G3 Pro poster — 35 W", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 800 },
      },
      {
        id: "airflow",
        title: "Fine-tune the airflow",
        description: "Turn the valve a little at a time until the draw feels right to you.",
        subline: "A first for the Caliburn line.",
        image: { src: "/assets/products/caliburn-g3-pro/story-airflow.webp", alt: "Frame from UWELL's Caliburn G3 Pro animation — air drawn in through the side airflow valve", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 920 },
      },
      {
        id: "modes",
        title: "Draw or press",
        description: "Out of the box it fires when you draw or when you press. Lock the button and it fires on the draw only.",
        subline: "Two ways to fire.",
        image: { src: "/assets/products/caliburn-g3-pro/story-modes.webp", alt: "Frame from UWELL's Caliburn G3 Pro animation — the side button lit", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 920 },
      },
      {
        id: "pods",
        title: "Takes every G3 pod",
        description: "Any Caliburn G3 pod fits, for freebase or nic salt, in top-refill or side-refill versions.",
        subline: "From 0.4Ω to 1.2Ω.",
        image: { src: "/assets/products/caliburn-g3-pro/story-pods.webp", alt: "UWELL's Caliburn G3 pod chart — 0.4Ω to 1.2Ω, side refill and top refill", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 882, height: 517, transparent: true },
      },
      {
        id: "body",
        title: "Zinc alloy body",
        description: "A glance at the window tells you how much e-liquid is left and when to refill.",
        subline: "With a clear e-liquid window.",
        image: { src: "/assets/products/caliburn-g3-pro/story-body.webp", alt: "UWELL's Caliburn G3 Pro poster — two devices, front and back", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro", width: 1920, height: 800 },
      },
    ],
    compatibility: [g3PodCompatibility, usbC],
    whoIsThisFor: [
      "Vapers who want everything on one screen in a slim pod, and an airflow valve to fine-tune the draw.",
      "Anyone not sure yet between MTL and RDL: a 0.4Ω and a 0.9Ω pod come in the box.",
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
      batteryMah: 1250,
      wattageMin: 5,
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
    // Site-wide template round batch 1d (04/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (https://www.myuwell.com/caliburn/caliburn-g3-pro-koko) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // Facts: _incoming/sitewide-template/1d/facts-uwell.md (UWELL page, posters, spec sheet spe14-text.webp). Posters: 1d/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: { src: "/assets/products/caliburn-g3-pro-koko/story-cover.webp", alt: "Official UWELL banner — the Caliburn G3 Pro KOKO in the hand", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1920, height: 800 },
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
      // Site-wide template round batch 1d (04/10): every row re-read from UWELL (page, posters, spec sheet).
      { key: "battery", label: "Battery", value: "1250mAh built-in", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
      { key: "battery-life", label: "Battery life", value: "Up to 4 days per charge (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/datas.webp" },
      { key: "charge-time", label: "Charging", value: "USB-C; 80% in 20 minutes at 5V/2A (UWELL's figure)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/datas.webp" },
      { key: "output", label: "Output range", value: "5–35W", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko" },
      { key: "screen", label: "Display", value: "1.8\" TFT colour screen", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
      { key: "themes", label: "Screen themes", value: "Dynamic themes (e.g. Planet, Twilight, KOKO) · DAY / NIGHT brightness modes", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko" },
      { key: "firing", label: "Firing", value: "Press twice: lock the button · 3 times: wattage · 4 times: brightness & theme menu · 5 times: on/off", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko" },
      { key: "airflow", label: "Airflow", value: "Adjustable airflow valve", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko" },
      { key: "pod", label: "Pod capacity", value: "3mL (INT & FDA) / 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
      { key: "included-pod", label: "Included pod", value: "0.4Ω (3mL) + 0.9Ω (2.5mL), side refill (INT & FDA); top refill, 2mL (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe15-1-new.webp" },
      { key: "pod-compat", label: "Pod platform", value: "Every Caliburn G3 (GPP) pod, 0.4Ω–1.2Ω, top or side refill", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe8-1.webp" },
      { key: "anti-leak", label: "Anti-leak system", value: "U² anti-leak (ultrasonic welding + U-shaped channel)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe6-2.webp" },
      { key: "flavor-tech", label: "Flavor system", value: "Pro-FOCS 3.0", sourceStatus: "verified", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko" },
      { key: "materials", label: "Materials", value: "PCTG, zinc alloy", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
      { key: "dimensions", label: "Dimensions", value: "85.15 × 49.5 × 19.5 mm (INT & FDA) / 79.15 mm tall (TPD & CRC)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
      { key: "weight", label: "Weight", value: "Approx. 91g", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g3-pro-koko/spe14-text.webp" },
    ],
    features: [
      {
        id: "screen",
        title: "A full colour screen",
        description: "Every vaping detail is on the screen, with animations while you vape.",
        subline: "UWELL's first full-screen KOKO.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-screen.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — three devices with the screen on", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1327, height: 756, transparent: true },
      },
      {
        id: "themes",
        title: "Screen themes",
        description: "Press the button four times to open the menu, then change the theme there.",
        subline: "Pick the look you like.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-themes.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — screen themes", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1029, height: 625, transparent: true },
      },
      {
        id: "day-night",
        title: "Day and night",
        description: "DAY mode keeps the screen vivid; NIGHT mode dims the glow. Both are in the same menu.",
        subline: "Bright by day, softer at night.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-day-night.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — night mode", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1920, height: 800 },
      },
      {
        id: "battery",
        title: "Charge less often",
        description: "How long yours lasts depends on how often you vape and the wattage you set.",
        subline: "A bigger battery than the G3 Pro.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-battery.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — 1250 mAh", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1024, height: 625, transparent: true },
      },
      {
        id: "power",
        title: "Wattage and airflow, yours to set",
        description: "Press three times to set the wattage, and slide the airflow from smooth to strong.",
        subline: "Up to 35W.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-power.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — 35 W", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1809, height: 756, transparent: true },
      },
      {
        id: "anti-leak",
        title: "Built not to leak",
        description: "The pod is sealed by ultrasonic welding, and a U-shaped channel holds the condensate.",
        subline: "UWELL's U² anti-leak.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-anti-leak.webp", alt: "UWELL's Caliburn G3 Pro KOKO poster — U² anti-leak, ultrasonic welding and the U-shaped channel", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1920, height: 800 },
      },
      {
        id: "pods",
        title: "Takes every G3 pod",
        description: "Any Caliburn G3 pod fits, for freebase or nic salt, in top-refill or side-refill versions.",
        subline: "From 0.4Ω to 1.2Ω.",
        image: { src: "/assets/products/caliburn-g3-pro-koko/story-pods.webp", alt: "UWELL's Caliburn G3 pod chart — 0.4Ω to 1.2Ω, side refill and top refill", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g3-pro-koko", width: 1762, height: 1034, transparent: true },
      },
    ],
    compatibility: [g3PodCompatibility, usbCNoNote],
    whoIsThisFor: [
      "Vapers who like a box-shaped pod with a colour screen and themes to pick from.",
      "Anyone who wants the G3 Pro's pods and 35W with a bigger battery.",
    ],
    faqs: [],
    relatedProductSlugs: ["caliburn-g3-pro"],
    sourceUrls: ["https://www.myuwell.com/"],
  },
];
