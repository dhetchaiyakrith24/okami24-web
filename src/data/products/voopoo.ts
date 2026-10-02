import type { Product } from "@/types/catalog";

const usbC2A = { type: "charging" as const, label: "USB-C", note: "5V/2A charging." };
const usbC1A = { type: "charging" as const, label: "USB-C", note: "Lower-amperage charging on this model." };

export const voopooProducts: Product[] = [
  {
    id: "argus-g4",
    slug: "argus-g4",
    brandId: "voopoo",
    familyId: "argus",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "ARGUS G4",
    displayName: "VOOPOO ARGUS G4",
    tagline: "A 5-day-battery pod kit with a full HD status screen.",
    shortDescription:
      "The current ARGUS mainstream flagship: 1650mAh, 5–35W, a 0.85\" HD screen showing battery, wattage, resistance, lock state and puff count, and a 45-minute USB-C fast charge.",
    isFlagship: true,
    editorialTag: "Flagship",
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): real video, title names
    // "VOOPOO ARGUS G4" exactly (not the G4 mini), owned by youtube.com/@OKM_24 — one of OKami24's
    // own three channels. Owner bound it (Q4, 2026-09-21).
    reviewVideo: { videoId: "eUdbZyvV4Y0", title: "หลังใช้งาน VOOPOO ARGUS G4 เปลี่ยนค่าโอห์มได้ในหัวเดียว!", channelName: "OKAMI", publishedAt: "2026-08-15" },
    attributes: {
      batteryMah: 1650,
      wattageMin: 5,
      wattageMax: 35,
      screenType: "color-display",
      screenSize: "0.85\"",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 5V/2A (~45 min full charge)",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/argus-g4/card.webp",
        alt: "VOOPOO ARGUS G4, Orange colourway, isolated product shot",
        angle: "Re-processed 2026-09-06 (LAUNCH_AUDIT 11): same official shop.voopoo.com gallery fetched at its native 2533×2533 — the standalone device cropped off the box shot is now ≈1441px on the 1000px canvas (was 519px, blurry on the home page). Earlier history: QC recovery pass (2026-09-03) — REPLACES the previous small (147×480) card asset, which the owner flagged as rendering too small on the real storefront. Re-sourced from VOOPOO's own shop (shop.voopoo.com/products/argus-g4 — the www.voopoo.com marketing site is DNS-blocked from this project's network, but the shop subdomain works with a Referer header) at genuinely high resolution (900×900 source), full official box+device gallery covering all 7 real colors. While re-sourcing, found the product's true color range is Brown/Blue/Gray/Orange/Purple/Black/Silver — \"Green\", previously listed here, does not appear anywhere in VOOPOO's own 7-image gallery and has been corrected to Black.",
        transparentBackground: true,
        sourceName: "VOOPOO (official brand shop, shop.voopoo.com)",
        sourceUrl: "https://shop.voopoo.com/products/argus-g4",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/argus-g4/hero.webp",
        alt: "VOOPOO ARGUS G4, gold/lilac colourway, styled studio shot on a satin surface",
        angle: "Hero / styled shot",
        transparentBackground: false,
        sourceName: "VOOPOO",
        sourceUrl: "https://www.voopoo.com/argus-series/argus-g4",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/argus-g4/detail-angle.webp",
        alt: "VOOPOO ARGUS G4, blue-to-pink gradient colourway, angled isolated shot",
        angle: "Alternate colourway, 3/4 angle",
        transparentBackground: false,
        sourceName: "VOOPOO",
        sourceUrl: "https://www.voopoo.com/argus-series/argus-g4",
      },
      {
        kind: "official-photo",
        role: "detail",
        src: "/assets/products/argus-g4/detail-screen.webp",
        alt: "VOOPOO ARGUS G4 screen close-up, showing wattage, battery, resistance and lock status",
        angle: "Screen / interface detail",
        transparentBackground: false,
        sourceName: "VOOPOO",
        sourceUrl: "https://www.voopoo.com/argus-series/argus-g4",
      },
    ],
    // Real VOOPOO color/finish lineup — owner quality review, 2026-09-02 (reputable-vendor
    // photo-confirmed: huffandpuffers.com; a 2026 release, could not be independently re-verified
    // on voopoo.com directly — see the final report's note on that). This product's existing
    // photos above show gradient/duotone finishes that don't cleanly correspond to any single
    // named color below, so no `image` is forced onto any entry — swatch-only, honest about that
    // gap rather than guessing which gradient is which name.
    // Real VOOPOO color lineup — QC recovery pass (2026-09-03). All 7 confirmed directly from
    // VOOPOO's own shop.voopoo.com product gallery (see the card asset's angle note for the
    // sourcing story) — "Green" was corrected to "Black" here, since VOOPOO's own 7-image gallery
    // has no green colorway at all; every name below is now a verified real color with a real
    // official photo, not a partially-guessed list.
    // Colour photos: 2026-09-06 re-sourced from the shop.voopoo.com gallery at its native 2533px (_incoming/argus-g4/SOURCE.md).
    // "ทั้งหมด" (02/10): two groups in the colour order (4+4) — the one-row image of 8 was tiny — RELX Phantom poster layout
    // like the other VOOPOO pods, _incoming/image-sitewide/dsx/vp-relx2.js argus-g4-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/argus-g4/lineup-v2.webp",
      alt: "VOOPOO ARGUS G4, colours 1–4 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/argus-g4/lineup2-v2.webp",
      alt: "VOOPOO ARGUS G4, colours 5–8 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    colorVariants: [
      {
        id: "orange",
        name: "Orange",
        swatchHex: "#d4692a",
        image: { src: "/assets/products/argus-g4/card.webp", alt: "VOOPOO ARGUS G4, Orange" },
      },
      {
        id: "black",
        name: "Black",
        swatchHex: "#1a1a1a",
        image: { src: "/assets/products/argus-g4/variant-black.webp", alt: "VOOPOO ARGUS G4, Black" },
      },
      {
        id: "purple",
        name: "Purple",
        swatchHex: "#6b4a8e",
        image: { src: "/assets/products/argus-g4/variant-purple.webp", alt: "VOOPOO ARGUS G4, Purple" },
      },
      {
        id: "silver",
        name: "Silver",
        swatchHex: "#c8ccd0",
        image: { src: "/assets/products/argus-g4/variant-silver.webp", alt: "VOOPOO ARGUS G4, Silver" },
      },
      {
        id: "blue",
        name: "Blue",
        swatchHex: "#2a6fbd",
        image: { src: "/assets/products/argus-g4/variant-blue.webp", alt: "VOOPOO ARGUS G4, Blue" },
      },
      {
        id: "gray",
        name: "Gray",
        swatchHex: "#5c5f63",
        image: { src: "/assets/products/argus-g4/variant-gray.webp", alt: "VOOPOO ARGUS G4, Gray" },
      },
      {
        id: "brown",
        name: "Brown",
        swatchHex: "#5c4433",
        image: { src: "/assets/products/argus-g4/variant-brown.webp", alt: "VOOPOO ARGUS G4, Brown" },
      },
      {
        // Added 2026-09-06 — VOOPOO's own shop now lists an 8th colourway, Green (variant option +
        // its own gallery photo, Sliver-(9)-(1).jpg). Owner rule 2026-09-06: show every colour the
        // maker offers. swatch = measured from the device's teal side frame in the official photo
        // (designer 2026-09-06: the whole-body mean read as grey-green; the frame is the colour a
        // customer sees). Front panel is a paler mint (#b9d0bb).
        id: "green",
        name: "Green",
        swatchHex: "#5caba5",
        image: { src: "/assets/products/argus-g4/variant-green.webp", alt: "VOOPOO ARGUS G4, Green" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1650mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–35W", sourceStatus: "verified" },
      { key: "voltage", label: "Output voltage", value: "3.2–4.2V", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.4–3.0Ω", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "0.85\" HD screen — battery, wattage, resistance, lock state, puff count", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C, 5V/2A, ~45 minutes to full", sourceStatus: "verified" },
      { key: "materials", label: "Materials", value: "Zinc alloy, leather, aluminum alloy", sourceStatus: "verified" },
      { key: "pod", label: "Pod platform", value: "ARGUS top-fill cartridge platform, multiple resistances", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "hd-screen",
        title: "0.85\" HD status screen",
        description: "Shows battery level, output power, coil resistance, lock/unlock status, and puff count at a glance.",
      },
      {
        id: "fast-charge",
        title: "45-minute fast charge",
        description: "USB-C 5V/2A charging brings the device from empty to full in about 45 minutes.",
      },
      {
        id: "multi-resistance-pod",
        title: "Multi-resistance cartridge platform",
        description: "One top-fill pod shape accepts several coil resistances, so switching draw style doesn't mean switching pods entirely.",
      },
    ],
    compatibility: [
      { type: "pod", label: "ARGUS top-fill cartridge platform", note: "0.4–3.0Ω resistance range." },
      usbC2A,
    ],
    whoIsThisFor: [
      "Vapers who want a status screen with full battery/resistance/puff visibility in a compact pod kit.",
      "Anyone prioritizing fast charging and multi-day battery life over maximum wattage headroom.",
      "Users moving from a screen-free device who want more feedback without a full box mod.",
    ],
    faqs: [
      {
        id: "argus-g4-life",
        question: "How many days does the battery last?",
        answer:
          "VOOPOO states roughly five days under normal use; actual runtime depends heavily on wattage, screen use, and how often it's fired.",
      },
      {
        id: "argus-g4-pods",
        question: "Can I use different resistance pods on the same device?",
        answer:
          "Yes — the ARGUS cartridge platform spans a 0.4–3.0Ω resistance range within the same top-fill pod shape.",
      },
    ],
    relatedProductSlugs: ["argus-g4-mini", "argus-p3", "vinci-s"],
    sourceUrls: ["https://www.voopoo.com/argus-series/argus-g4", "https://shop.voopoo.com/products/argus-g4"],
  },
  {
    id: "argus-g4-mini",
    slug: "argus-g4-mini",
    brandId: "voopoo",
    familyId: "argus",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "ARGUS G4 mini",
    displayName: "VOOPOO ARGUS G4 mini",
    tagline: "The G4's battery, a lower power ceiling, a smaller shell.",
    shortDescription:
      "Shares the ARGUS G4's 1650mAh cell in a smaller shell with a 30W ceiling instead of 35W.",
    isFlagship: false,
    attributes: {
      batteryMah: 1650,
      wattageMin: 5,
      wattageMax: 30,
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
        src: "/assets/products/argus-g4-mini/card-v2.webp",
        alt: "VOOPOO ARGUS G4 mini, Black, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from VOOPOO's own photos of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from VOOPOO's images",
        sourceUrl: "https://shop.voopoo.com/products/argus-g4-mini",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 8 colors sourced directly from
    // shop.voopoo.com's own color→photo JSON binding (tier-1, see drag-6's comment for method). A
    // distinct palette from ARGUS G4 (has Cyan/Tarnish instead of Gray/Brown) — not merged with
    // that list. "Tarnish" confirmed correct against a JSON typo ("Tamish") by the box art itself,
    // which reads "Tarnish." Card switched from the old "lilac" photo (never a confirmed match to
    // any of these 8 real names) to "Black."
    // Image-sitewide round 3b (1) edge defects, 01/10 (owner: white rim on the old 204 px cut-outs): the KOKO method — ONE
    // master (a 4K Silver render from VOOPOO's own 1254 px Silver render) with the body colour moved to VOOPOO's render of
    // each colour, per height band for the Cyan / Green / Orange gradients, so a swipe changes only the colour. Card-v2 =
    // the Black photo tilted in 2D. Swatches = the body colour on VOOPOO's renders. Scripts: _incoming/image-sitewide/b-edge/
    // (recolour-g4m.js, choke.js, presize-edge.js). All-colours images (IMAGE_SPEC §0 item 5): see
    // lineupImage below (two groups, 02/10).
    openOnCardPhoto: true,
    colorVariants: [
      { id: "black", name: "Black", swatchHex: "#333435", image: { src: "/assets/products/argus-g4-mini/variant-black-v2.webp", alt: "VOOPOO ARGUS G4 mini, Black" } },
      { id: "green", name: "Green", swatchHex: "#8cd5c6", image: { src: "/assets/products/argus-g4-mini/variant-green-v2.webp", alt: "VOOPOO ARGUS G4 mini, Green" } },
      { id: "orange", name: "Orange", swatchHex: "#e78b5a", image: { src: "/assets/products/argus-g4-mini/variant-orange-v2.webp", alt: "VOOPOO ARGUS G4 mini, Orange" } },
      { id: "purple", name: "Purple", swatchHex: "#b7b2d6", image: { src: "/assets/products/argus-g4-mini/variant-purple-v2.webp", alt: "VOOPOO ARGUS G4 mini, Purple" } },
      { id: "silver", name: "Silver", swatchHex: "#c4c4c4", image: { src: "/assets/products/argus-g4-mini/variant-silver-v2.webp", alt: "VOOPOO ARGUS G4 mini, Silver" } },
      { id: "tarnish", name: "Tarnish", swatchHex: "#898a8f", image: { src: "/assets/products/argus-g4-mini/variant-tarnish-v2.webp", alt: "VOOPOO ARGUS G4 mini, Tarnish" } },
      { id: "cyan", name: "Cyan", swatchHex: "#37bde4", image: { src: "/assets/products/argus-g4-mini/variant-cyan-v2.webp", alt: "VOOPOO ARGUS G4 mini, Cyan" } },
      { id: "blue", name: "Blue", swatchHex: "#bac9e6", image: { src: "/assets/products/argus-g4-mini/variant-blue-v2.webp", alt: "VOOPOO ARGUS G4 mini, Blue" } },
    ],
    // "ทั้งหมด" (02/10): two groups in maker order — the 7-9-device image was too small (owner 02/10) — RELX Phantom poster
    // layout, _incoming/image-sitewide/dsx/vp-relx2.js argus-g4-mini-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/argus-g4-mini/lineup-v3.webp",
      alt: "VOOPOO ARGUS G4 mini, colours 1–4 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/argus-g4-mini/lineup2-v3.webp",
      alt: "VOOPOO ARGUS G4 mini, colours 5–8 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "1650mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–30W", sourceStatus: "verified" },
      { key: "voltage", label: "Output voltage", value: "3.2–4.2V", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.4–3.0Ω", sourceStatus: "verified" },
      { key: "pod", label: "Pod platform", value: "ARGUS top-fill cartridge platform", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "same-battery-smaller-shell",
        title: "Full-size battery, smaller shell",
        description: "Carries the same 1650mAh cell as the standard G4 into a more compact body with a lower 30W ceiling.",
      },
    ],
    compatibility: [{ type: "pod", label: "ARGUS top-fill cartridge platform", note: "0.4–3.0Ω resistance range." }, usbC2A],
    whoIsThisFor: [
      "ARGUS G4 fans who want a smaller shell and don't need the full 35W ceiling.",
    ],
    faqs: [],
    relatedProductSlugs: ["argus-g4", "argus-g3-mini"],
    sourceUrls: ["https://www.voopoo.com/argus-series/argus-g4-mini"],
  },
  {
    id: "argus-p3",
    slug: "argus-p3",
    brandId: "voopoo",
    familyId: "argus",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "ARGUS P3",
    displayName: "VOOPOO ARGUS P3",
    tagline: "A full-touch 2.01\" HD display on the ARGUS platform.",
    shortDescription:
      "A 1500mAh, 5–30W pod kit built around a 2.01\" full-touch TFT HD display for menu and mode control.",
    isFlagship: false,
    attributes: {
      batteryMah: 1500,
      wattageMin: 5,
      wattageMax: 30,
      screenType: "touchscreen",
      screenSize: "2.01\"",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        // 02/10: card-v2 = the Blue Leather render of this page's colour photos, tilted 12° (map: scripts/process-images.map.json).
        src: "/assets/products/argus-p3/card-v2.webp",
        alt: "VOOPOO ARGUS P3, Blue Leather, tilted product shot",
        angle: "Front, tilted 12°",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from VOOPOO's images",
        sourceUrl: "https://shop.voopoo.com/",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 7 (6 leather + 1 non-leather)
    // colors/identities originally confirmed via shop.voopoo.com's own color→photo JSON binding
    // (tier-1, see drag-6's comment for method) — settling the prior pass's naming ambiguity on
    // the 7th, non-leather finish ("Black Metal," not "Carbon Fiber Black"), and catching a real
    // identity bug (see below). Owner-reported correction (2026-09-04): the OLD card.png used for
    // "Blue Leather" (a plain solid-blue shell with a floral watch-face screen demo) did not match
    // shop.voopoo.com's own "Blue Leather" featured_media_id at all — it's actually a blue
    // graffiti/street-art print finish; card.png retired.
    //
    // SECOND correction, same day: shop.voopoo.com's own 1000×1000 box+device template only
    // yields a ~230px-wide isolated device after cropping out the box — genuinely too small
    // (owner-reported "blurry/broken" at Product Detail's hero size). Re-sourced all 7 images from
    // vaping.com's own BigCommerce product gallery (an authorized US VOOPOO retailer — confirmed
    // real, non-AI, device-only isolated studio photography, no box, no watermark) at native
    // 600×600, yielding a ~300×520 device crop — roughly 2x wider than the shop.voopoo.com source
    // allowed. Every color's real identity was re-verified against this new source before
    // deploying (Blue Leather's graffiti print and Black Metal's gear-panel finish both confirmed
    // to match the shop.voopoo.com-verified identities exactly, not just assumed from filenames).
    // Image-sitewide round 01/10: those ~300x520 photos are still blurry in the hero. Each finish has its own print or
    // texture, so no shared master: one sharp night render per finish (same pose as VOOPOO's photo), cut out; Grey /
    // Brown / Red toned to VOOPOO's photo (_incoming/image-sitewide/b-voopoo/p3tone.js). Swatches = the leather colour on
    // VOOPOO's photos. 02/10 (owner lifted the baseline hold, §18): card-v2 = the Blue Leather photo tilted 12° +
    // openOnCardPhoto · "ทั้งหมด" (IMAGE_SPEC §0 item 5) = the "cluster" layout for box devices — set1/boxy.js.
    openOnCardPhoto: true,
    lineupImage: {
      src: "/assets/products/argus-p3/lineup-v2.webp",
      alt: "VOOPOO ARGUS P3, all 7 colours",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    colorVariants: [
      {
        id: "blue-leather",
        name: "Blue Leather",
        swatchHex: "#2a4fb0",
        image: { src: "/assets/products/argus-p3/variant-blue-leather-v2.webp", alt: "VOOPOO ARGUS P3, Blue Leather" },
      },
      { id: "black-leather", name: "Black Leather", swatchHex: "#323232", image: { src: "/assets/products/argus-p3/variant-black-leather-v2.webp", alt: "VOOPOO ARGUS P3, Black Leather" } },
      { id: "grey-leather", name: "Grey Leather", swatchHex: "#5f6460", image: { src: "/assets/products/argus-p3/variant-grey-leather-v2.webp", alt: "VOOPOO ARGUS P3, Grey Leather" } },
      { id: "brown-leather", name: "Brown Leather", swatchHex: "#93654c", image: { src: "/assets/products/argus-p3/variant-brown-leather-v2.webp", alt: "VOOPOO ARGUS P3, Brown Leather" } },
      { id: "red-leather", name: "Red Leather", swatchHex: "#b94543", image: { src: "/assets/products/argus-p3/variant-red-leather-v2.webp", alt: "VOOPOO ARGUS P3, Red Leather" } },
      { id: "silver-leather", name: "Silver Leather", swatchHex: "#e0e0e0", image: { src: "/assets/products/argus-p3/variant-silver-leather-v2.webp", alt: "VOOPOO ARGUS P3, Silver Leather" } },
      { id: "black-metal", name: "Black Metal", swatchHex: "#2b2b2e", image: { src: "/assets/products/argus-p3/variant-black-metal-v2.webp", alt: "VOOPOO ARGUS P3, Black Metal" } },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1500mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–30W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "2.01\" full-touch TFT HD", sourceStatus: "verified" },
      { key: "pod", label: "Pod platform", value: "ARGUS top-fill cartridge platform", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "full-touch",
        title: "Full-touch TFT HD display",
        description: "A 2.01\" touchscreen used for full menu navigation rather than a simple status readout.",
      },
    ],
    compatibility: [{ type: "pod", label: "ARGUS top-fill cartridge platform" }, usbC2A],
    whoIsThisFor: [
      "Vapers who want full touchscreen menu control in a compact ARGUS-platform device.",
    ],
    faqs: [],
    relatedProductSlugs: ["argus-g4", "argus-g4-mini"],
    sourceUrls: ["https://www.voopoo.com/"],
  },
  {
    id: "argus-g3-mini",
    slug: "argus-g3-mini",
    brandId: "voopoo",
    familyId: "argus",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "ARGUS G3 mini",
    displayName: "VOOPOO ARGUS G3 mini",
    tagline: "GENE.AI-driven simplicity, auto-adjusting wattage.",
    shortDescription:
      "A 1350mAh, up-to-30W beginner-oriented pod kit that auto-adjusts wattage per pod, running VOOPOO's GENE.AI chipset and iCOSM CODE 2.0 anti-leak pods.",
    isFlagship: false,
    attributes: {
      batteryMah: 1350,
      wattageMax: 30,
      capacityMl: 3,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 1A",
      weightG: 41,
      dimensions: "95.3 × 25.8 × 13.7 mm",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/argus-g3-mini/card-v2.webp",
        alt: "VOOPOO ARGUS G3 mini, Sky Blue, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from VOOPOO's own photos of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from VOOPOO's images",
        sourceUrl: "https://shop.voopoo.com/products/argus-g3-mini",
      },
    ],
    // Real VOOPOO colour lineup (9 colours, names from shop.voopoo.com — research pass 2026-09-02).
    // Image-sitewide round 01/10 (owner "เดินงานแก้รูปสินค้าให้เสร็จ"): VOOPOO's own per-colour photos are 250x500, too small
    // for the hero — the KOKO / G4 Classic method: ONE master (the night Sky Blue render, same orientation as VOOPOO's
    // photos) with the body colour moved to each colour of VOOPOO's photo, so a swipe changes only the colour. Card-v2 =
    // the Sky Blue photo tilted in 2D. Swatches = the body colour on VOOPOO's photos.
    // Scripts: _incoming/image-sitewide/b-voopoo/recolour-g3m.js + presize-g3m.js. "ทั้งหมด" (02/10, owner 01/10 evening —
    // IMAGE_SPEC §0 item 5): two groups, see the lineupImage comment below.
    openOnCardPhoto: true,
    // "ทั้งหมด" (02/10): two groups in maker order — the 7-9-device image was too small (owner 02/10) — RELX Phantom poster
    // layout, _incoming/image-sitewide/dsx/vp-relx2.js argus-g3-mini-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/argus-g3-mini/lineup-v3.webp",
      alt: "VOOPOO ARGUS G3 mini, colours 1–5 of 9",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/argus-g3-mini/lineup2-v3.webp",
      alt: "VOOPOO ARGUS G3 mini, colours 6–9 of 9",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    colorVariants: [
      {
        id: "sky-blue",
        name: "Sky Blue",
        swatchHex: "#8cb1d5",
        image: { src: "/assets/products/argus-g3-mini/variant-sky-blue-v2.webp", alt: "VOOPOO ARGUS G3 mini, Sky Blue" },
      },
      {
        id: "grass-green",
        name: "Grass Green",
        swatchHex: "#a7c696",
        image: { src: "/assets/products/argus-g3-mini/variant-grass-green-v2.webp", alt: "VOOPOO ARGUS G3 mini, Grass Green" },
      },
      {
        id: "midnight-black",
        name: "Midnight Black",
        swatchHex: "#353333",
        image: { src: "/assets/products/argus-g3-mini/variant-midnight-black-v2.webp", alt: "VOOPOO ARGUS G3 mini, Midnight Black" },
      },
      {
        id: "space-gray",
        name: "Space Gray",
        swatchHex: "#585a5e",
        image: { src: "/assets/products/argus-g3-mini/variant-space-gray-v2.webp", alt: "VOOPOO ARGUS G3 mini, Space Gray" },
      },
      {
        id: "moonlight-silver",
        name: "Moonlight Silver",
        swatchHex: "#c9c6c7",
        image: { src: "/assets/products/argus-g3-mini/variant-moonlight-silver-v2.webp", alt: "VOOPOO ARGUS G3 mini, Moonlight Silver" },
      },
      {
        id: "scarlet-red",
        name: "Scarlet Red",
        swatchHex: "#be1d21",
        image: { src: "/assets/products/argus-g3-mini/variant-scarlet-red-v2.webp", alt: "VOOPOO ARGUS G3 mini, Scarlet Red" },
      },
      {
        id: "rose-gold",
        name: "Rose Gold",
        swatchHex: "#d6b0a8",
        image: { src: "/assets/products/argus-g3-mini/variant-rose-gold-v2.webp", alt: "VOOPOO ARGUS G3 mini, Rose Gold" },
      },
      {
        id: "lilac-purple",
        name: "Lilac Purple",
        swatchHex: "#b8a1c0",
        image: { src: "/assets/products/argus-g3-mini/variant-lilac-purple-v2.webp", alt: "VOOPOO ARGUS G3 mini, Lilac Purple" },
      },
      {
        id: "hot-pink",
        name: "Hot Pink",
        swatchHex: "#d42e9d",
        image: { src: "/assets/products/argus-g3-mini/variant-hot-pink-v2.webp", alt: "VOOPOO ARGUS G3 mini, Hot Pink" },
      },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "1350mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "30W (auto-adjusts to pod, fixed wattage)", sourceStatus: "verified" },
      { key: "pod", label: "Included pod", value: "ARGUS Top Fill Cartridge V2, 0.7Ω, 3mL (2mL in TPD regions)", sourceStatus: "verified" },
      { key: "chip", label: "Chipset", value: "GENE.AI", sourceStatus: "verified" },
      { key: "anti-leak", label: "Anti-leak system", value: "iCOSM CODE 2.0", sourceStatus: "verified" },
      { key: "dimensions", label: "Dimensions", value: "95.3 × 25.8 × 13.7 mm, 41g", sourceStatus: "verified" },
      { key: "firing", label: "Activation", value: "Auto-draw activated", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "auto-draw",
        title: "Auto-draw activation",
        description: "No fire button — the device activates on inhale, and wattage auto-adjusts to whichever pod resistance is installed.",
      },
      {
        id: "icosm",
        title: "iCOSM CODE 2.0 anti-leak",
        description: "An updated seal design on the V2 cartridge aimed at reducing leaking during transport and refills.",
      },
    ],
    compatibility: [{ type: "pod", label: "ARGUS Top Fill Cartridge V2", note: "0.7Ω included." }, usbC1A],
    whoIsThisFor: [
      "First-time pod users who want draw-activated simplicity with no buttons or menus.",
      "Anyone prioritizing a genuinely pocketable, lightweight shell (41g).",
    ],
    faqs: [],
    relatedProductSlugs: ["argus-g4-mini", "vmate-i3"],
    sourceUrls: ["https://www.voopoo.com/argus-series/argus-g3-mini"],
  },
  {
    id: "drag-6",
    slug: "drag-6",
    brandId: "voopoo",
    familyId: "drag",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "DRAG 6",
    displayName: "VOOPOO DRAG 6",
    tagline: "220W, GENE.TT 3.0, and a precision adjustment wheel.",
    shortDescription:
      "The current DRAG-series flagship: a 4400mAh built-in battery (two 2200mAh cells), 220W max output, a 1.66\" TFT screen, and a capacitive-unlock fire button.",
    isFlagship: false,
    attributes: {
      batteryMah: 4400,
      wattageMax: 220,
      screenType: "color-display",
      screenSize: "1.66\"",
      drawStyle: "DTL",
      portability: "standard",
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/drag-6/card-v2.webp",
        alt: "VOOPOO DRAG 6, Brown, three-quarter view",
        angle: "tilted, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) from VOOPOO's own photos of this model",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from VOOPOO's images",
        sourceUrl: "https://www.voopoo.com/drag-series/drag-6",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 7 colors now sourced directly
    // from shop.voopoo.com's own product page, whose raw HTML embeds a `variant-data` JSON block
    // binding each color option to its own `featured_media_id` — the same official color→photo
    // mapping the live page itself uses to swap images on click, not a guess. Tier-1. Each photo
    // was a real box+device studio pair; cropped to the device half, background removed.
    // Image-sitewide round 3b (1) edge defects, 01/10 (owner: white rim / pixelated 160 px card): every colour = a 4K
    // Higgsfield render of that colour (each has its own side panel — carbon, camo, denim, chevron — so no recolour),
    // cut out and its matte pulled in 5 px (the remover leaves a grey rim); card-v2 = a three-quarter Brown render.
    // Swatches of Blue / Red / Green = the frame colour on VOOPOO's photos (the old deep blue was off: the body is pale
    // blue). Scripts: _incoming/image-sitewide/b-edge/ (choke.js, presize-edge.js).
    openOnCardPhoto: true,
    colorVariants: [
      { id: "silver", name: "Silver", swatchHex: "#c8ccd0", image: { src: "/assets/products/drag-6/variant-silver-v2.webp", alt: "VOOPOO DRAG 6, Silver" } },
      { id: "blue", name: "Blue", swatchHex: "#ccd6dc", image: { src: "/assets/products/drag-6/variant-blue-v2.webp", alt: "VOOPOO DRAG 6, Blue" } },
      { id: "black", name: "Black", swatchHex: "#1a1a1a", image: { src: "/assets/products/drag-6/variant-black-v2.webp", alt: "VOOPOO DRAG 6, Black" } },
      {
        id: "brown",
        name: "Brown",
        swatchHex: "#5c4433",
        image: { src: "/assets/products/drag-6/variant-brown-v2.webp", alt: "VOOPOO DRAG 6, Brown" },
      },
      { id: "red", name: "Red", swatchHex: "#d64a4e", image: { src: "/assets/products/drag-6/variant-red-v2.webp", alt: "VOOPOO DRAG 6, Red" } },
      { id: "green", name: "Green", swatchHex: "#77b190", image: { src: "/assets/products/drag-6/variant-green-v2.webp", alt: "VOOPOO DRAG 6, Green" } },
      { id: "metal-gray", name: "Metal Gray", swatchHex: "#8c8f93", image: { src: "/assets/products/drag-6/variant-metal-gray-v2.webp", alt: "VOOPOO DRAG 6, Metal Gray" } },
    ],
    // All-colours image (IMAGE_SPEC §0 item 5, pod system — new layout, 01/10): the old flat row "จัดวางไม่สวย สินค้ามีขอบเยอะ"
    // (owner). Owner picked layout 1 of four drafted from OKami's own posters ("VMATE MAX": Silver hero centre, the others
    // stepping smaller and higher to both sides, clean gaps). Composed by script from the same 7 choked 4K renders as the
    // colour photos above — no AI, no text (_incoming/image-sitewide/b-edge/d6-poster.js).
    lineupImage: {
      src: "/assets/products/drag-6/lineup-v2.webp",
      alt: "VOOPOO DRAG 6, all 7 colors",
      sourceName: "OKami24 composite (from OKami24's renders of each colour)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "4400mAh built-in (two 2200mAh cells)", sourceStatus: "verified" },
      { key: "output", label: "Max output", value: "220W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "1.66\" TFT — wattage, battery, resistance, puff count, mode", sourceStatus: "verified" },
      { key: "chip", label: "Chipset", value: "GENE.TT 3.0", sourceStatus: "verified" },
      { key: "modes", label: "Output modes", value: "SMART, RBA, TC-TCR", sourceStatus: "verified" },
      { key: "control", label: "Control", value: "Precision adjustment wheel + capacitive unlock sensor on the fire button", sourceStatus: "verified" },
      { key: "pod", label: "Pod platform", value: "DRAG-series coil pod (specific cartridge naming not independently confirmed)", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "adjustment-wheel",
        title: "Precision adjustment wheel",
        description: "A physical wheel for wattage adjustment alongside the touch-capacitive fire button lock.",
      },
      {
        id: "gene-tt-3",
        title: "GENE.TT 3.0 chipset",
        description: "VOOPOO's higher-output chip generation, supporting SMART, RBA (rebuildable), and TC-TCR modes.",
      },
    ],
    compatibility: [{ type: "pod", label: "DRAG-series coil pod", note: "Cartridge naming not independently confirmed." }, usbC2A],
    whoIsThisFor: [
      "Experienced, high-wattage vapers who want a large built-in battery over swappable cells.",
      "Anyone who wants RBA/TC control alongside standard variable-wattage vaping.",
    ],
    faqs: [
      {
        id: "drag6-rebuildable",
        question: "Does the DRAG 6 support rebuildable coils?",
        answer: "It includes an RBA (rebuildable atomizer) mode alongside standard SMART and TC-TCR output modes.",
      },
    ],
    relatedProductSlugs: ["drag-s3", "drag-x3"],
    sourceUrls: ["https://www.voopoo.com/", "https://shop.voopoo.com/products/drag-6"],
  },
  {
    id: "drag-s3",
    slug: "drag-s3",
    brandId: "voopoo",
    familyId: "drag",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "DRAG S3",
    displayName: "VOOPOO DRAG S3",
    tagline: "A 3000mAh built-in cell, up to 60W.",
    shortDescription:
      "A built-in-battery DRAG model: 3000mAh, 5–60W, a 0.96\" TFT screen, and USB-C charging.",
    isFlagship: false,
    attributes: {
      batteryMah: 3000,
      wattageMin: 5,
      wattageMax: 60,
      screenType: "color-display",
      screenSize: "0.96\"",
      drawStyle: "DTL",
      portability: "standard",
      beginnerFriendly: false,
      chargingType: "USB-C, 5V/2A",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/drag-s3/card-v2.webp",
        alt: "VOOPOO DRAG S3, Spray Black, three-quarter view",
        angle: "three-quarter, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of this colour's photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from vapevo.com's photo of this colour",
        sourceUrl: "https://www.vapevo.com/en/products/voopoo-drag-s3-kit-e-cigarette-60w-3000mah-5ml",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 7 colors/identities originally
    // confirmed via shop.voopoo.com's own color→photo JSON binding (tier-1, see drag-6's comment
    // for the exact method); card switched from the old "cream/gold" photo (matched none of the 7
    // real names) to the real "Spray Black" identity.
    //
    // SECOND correction, same day: shop.voopoo.com's 1000×1000 box+device template only yielded a
    // ~185px-wide device crop, genuinely too small (owner-reported "blurry/broken" at Product
    // Detail's hero size). Re-sourced all 7 from vapevo.com's own Shopify product gallery (an
    // authorized EU VOOPOO retailer — real, non-AI, isolated studio photography, no box, device
    // fills most of an 800×800 frame) at ~220×751 after cropping — a ~4x resolution gain. Every
    // color re-verified against this new source before deploying.
    // 02/10 (image-sitewide, G5 standard): every colour = a Higgsfield 4K remake of the photo above (remover cut, 22/22 on
    // the fidelity check), tilted 12°; card-v2 = the Spray Black remake upright; swatches = the median body colour of
    // those photos (several were guessed from the names). Scripts + sheets: _incoming/image-sitewide/dsx/ (map: scripts/process-images.map.json).
    openOnCardPhoto: true,
    colorVariants: [
      { id: "spray-black", name: "Spray Black", swatchHex: "#363636", image: { src: "/assets/products/drag-s3/variant-spray-black-v2.webp", alt: "VOOPOO DRAG S3, Spray Black" } },
      { id: "white", name: "White", swatchHex: "#cdcdcd", image: { src: "/assets/products/drag-s3/variant-white-v2.webp", alt: "VOOPOO DRAG S3, White" } },
      { id: "pink", name: "Pink", swatchHex: "#dccac9", image: { src: "/assets/products/drag-s3/variant-pink-v2.webp", alt: "VOOPOO DRAG S3, Pink" } },
      { id: "blue", name: "Blue", swatchHex: "#435666", image: { src: "/assets/products/drag-s3/variant-blue-v2.webp", alt: "VOOPOO DRAG S3, Blue" } },
      { id: "green", name: "Green", swatchHex: "#6f7c69", image: { src: "/assets/products/drag-s3/variant-green-v2.webp", alt: "VOOPOO DRAG S3, Green" } },
      { id: "brown", name: "Brown", swatchHex: "#7b4929", image: { src: "/assets/products/drag-s3/variant-brown-v2.webp", alt: "VOOPOO DRAG S3, Brown" } },
      { id: "metal-gray", name: "Metal Gray", swatchHex: "#646b6c", image: { src: "/assets/products/drag-s3/variant-metal-gray-v2.webp", alt: "VOOPOO DRAG S3, Metal Gray" } },
    ],
    // "ทั้งหมด" (02/10): two groups in maker order — the 7-9-device image was too small (owner 02/10) — RELX Phantom poster
    // layout, _incoming/image-sitewide/dsx/vp-relx2.js drag-s3-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/drag-s3/lineup-v2.webp",
      alt: "VOOPOO DRAG S3, colours 1–4 of 7",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/drag-s3/lineup2-v2.webp",
      alt: "VOOPOO DRAG S3, colours 5–7 of 7",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "3000mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–60W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "0.96\" TFT screen", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.1–3.0Ω", sourceStatus: "verified" },
      { key: "materials", label: "Materials", value: "Zinc alloy, leather", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C, 5V/2A", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "built-in-3000",
        title: "3000mAh built-in cell",
        description: "No cell swapping — a sealed built-in battery sized for all-day 60W use, charged over USB-C.",
      },
    ],
    compatibility: [{ type: "pod", label: "DRAG-series coil pod", note: "0.1–3.0Ω resistance range." }, usbC2A],
    whoIsThisFor: [
      "Vapers who want DRAG-level output without managing external 18650/21700 cells.",
    ],
    faqs: [],
    relatedProductSlugs: ["drag-x3", "drag-6"],
    sourceUrls: ["https://www.voopoo.com/drag-series/drag-s3"],
  },
  {
    id: "drag-x3",
    slug: "drag-x3",
    brandId: "voopoo",
    familyId: "drag",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "DRAG X3",
    displayName: "VOOPOO DRAG X3",
    tagline: "80W on a swappable 18650/21700 cell.",
    shortDescription:
      "A single-external-battery DRAG model (18650 or 21700, not included) running up to 80W with a 1.66\" touchscreen.",
    isFlagship: false,
    attributes: {
      batteryMah: undefined,
      wattageMin: 5,
      wattageMax: 80,
      screenType: "touchscreen",
      screenSize: "1.66\"",
      drawStyle: "DTL",
      portability: "standard",
      beginnerFriendly: false,
      chargingType: "USB-C, 5V/2A (device); external cell charged separately",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/drag-x3/card-v2.webp",
        alt: "VOOPOO DRAG X3, Spray Black, three-quarter view",
        angle: "three-quarter, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of this colour's photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from vapevo.com's photo of this colour",
        sourceUrl: "https://www.vapevo.com/en/products/voopoo-drag-x3-kit-e-cigarette-80w-5ml",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 7 colors/identities originally
    // confirmed via shop.voopoo.com's own color→photo JSON binding (tier-1, see drag-6's comment
    // for method).
    //
    // SECOND correction, same day: shop.voopoo.com's 1000×1000 box+device template only yielded a
    // ~160px-wide device crop with a torn-edge background-removal defect on 2 colors (owner-
    // reported "blurry/broken" hero images). Re-sourced all 7 from vapevo.com's own Shopify
    // product gallery (authorized EU VOOPOO retailer, isolated studio photography, no box) at
    // ~210×761 after cropping — a ~4x resolution gain that also fixes the torn edges outright
    // (fresh source, not a repair of the old one). Card asset switched from a separate, smaller
    // "card.png" to this same real "Spray Black" identity.
    // 02/10 (image-sitewide, G5 standard): every colour = a Higgsfield 4K remake of the photo above (remover cut, 22/22 on
    // the fidelity check), tilted 12°; card-v2 = the Spray Black remake upright; swatches = the median body colour of
    // those photos (several were guessed from the names). Scripts + sheets: _incoming/image-sitewide/dsx/ (map: scripts/process-images.map.json).
    openOnCardPhoto: true,
    colorVariants: [
      { id: "gray-metal", name: "Gray Metal", swatchHex: "#696964", image: { src: "/assets/products/drag-x3/variant-gray-metal-v2.webp", alt: "VOOPOO DRAG X3, Gray Metal" } },
      {
        id: "spray-black",
        name: "Spray Black",
        swatchHex: "#3a3a3a",
        image: { src: "/assets/products/drag-x3/variant-spray-black-v2.webp", alt: "VOOPOO DRAG X3, Spray Black" },
      },
      { id: "glow-pink", name: "Glow Pink", swatchHex: "#e5cfd0", image: { src: "/assets/products/drag-x3/variant-glow-pink-v2.webp", alt: "VOOPOO DRAG X3, Glow Pink" } },
      { id: "champagne-golden", name: "Champagne Golden", swatchHex: "#e1dfd4", image: { src: "/assets/products/drag-x3/variant-champagne-golden-v2.webp", alt: "VOOPOO DRAG X3, Champagne Golden" } },
      { id: "sky-blue", name: "Sky Blue", swatchHex: "#2b9dd2", image: { src: "/assets/products/drag-x3/variant-sky-blue-v2.webp", alt: "VOOPOO DRAG X3, Sky Blue" } },
      { id: "moss-green", name: "Moss Green", swatchHex: "#1f975d", image: { src: "/assets/products/drag-x3/variant-moss-green-v2.webp", alt: "VOOPOO DRAG X3, Moss Green" } },
      { id: "aurora-purple", name: "Aurora Purple", swatchHex: "#ba4fdd", image: { src: "/assets/products/drag-x3/variant-aurora-purple-v2.webp", alt: "VOOPOO DRAG X3, Aurora Purple" } },
    ],
    // "ทั้งหมด" (02/10): two groups in maker order — the 7-9-device image was too small (owner 02/10) — RELX Phantom poster
    // layout, _incoming/image-sitewide/dsx/vp-relx2.js drag-x3-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/drag-x3/lineup-v2.webp",
      alt: "VOOPOO DRAG X3, colours 1–4 of 7",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/drag-x3/lineup2-v2.webp",
      alt: "VOOPOO DRAG X3, colours 5–7 of 7",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "Single external 18650 or 21700 cell (not included)", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–80W", sourceStatus: "verified" },
      { key: "screen", label: "Display", value: "1.66\" touchscreen", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.1–3.0Ω", sourceStatus: "verified" },
      { key: "materials", label: "Materials", value: "Zinc alloy, leather", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "external-cell",
        title: "Swappable 18650/21700 cell",
        description: "Runs on a single user-supplied external cell instead of a sealed built-in battery, so a spare cell means no downtime charging.",
      },
      {
        id: "touchscreen-166",
        title: "1.66\" touchscreen",
        description: "A 1.66\" touchscreen used for full menu and mode navigation.",
      },
    ],
    compatibility: [{ type: "pod", label: "DRAG-series coil pod", note: "0.1–3.0Ω resistance range." }, usbC2A],
    whoIsThisFor: [
      "Vapers who prefer swappable external cells over sealed built-in batteries.",
      "Anyone who wants an 80W ceiling with full touchscreen control.",
    ],
    faqs: [
      {
        id: "dragx3-battery",
        question: "Does it come with a battery?",
        answer: "No — the DRAG X3 runs on a single 18650 or 21700 cell that's sold separately.",
      },
    ],
    relatedProductSlugs: ["drag-s3", "drag-6"],
    sourceUrls: ["https://www.voopoo.com/drag-series/drag-x3"],
  },
  {
    id: "vinci-s",
    slug: "vinci-s",
    brandId: "voopoo",
    familyId: "vinci",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "VINCI S",
    displayName: "VOOPOO VINCI S",
    tagline: "40W, topside-fill, built for daily flavor-chasing.",
    shortDescription:
      "A 2000mAh, 5–40W pod kit with a 4.5mL (2mL TPD) topside-fill cartridge and a 0.3–3.0Ω resistance range.",
    isFlagship: false,
    attributes: {
      batteryMah: 2000,
      wattageMin: 5,
      wattageMax: 40,
      capacityMl: 4.5,
      screenType: "led-indicator",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 5V/1A",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/vinci-s/card-v2.webp",
        alt: "VOOPOO VINCI S, Black, three-quarter view",
        angle: "three-quarter, isolated — OKami24 Higgsfield remake (IMAGE_SPEC §0 item 7) of this colour's photo",
        transparentBackground: true,
        sourceName: "OKami24 render (Higgsfield) from vapevo.com's photo of this colour",
        sourceUrl: "https://www.vapevo.com/en/products/voopoo-vinci-s-kit-e-cigarette-40w-2000mah-4-5ml",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 8 colors/identities originally
    // confirmed via shop.voopoo.com's own color→photo JSON binding (tier-1, see drag-6's comment
    // for method); card switched from the old duotone photo (matched no single gradient name) to
    // "Black".
    //
    // SECOND correction, same day: shop.voopoo.com's 1000×1000 box+device template only yielded a
    // ~150px-wide device crop with a torn-edge defect on "Pink" (owner-reported "blurry/broken"
    // hero images). Re-sourced all 8 from vapevo.com's own Shopify product gallery (authorized EU
    // VOOPOO retailer, isolated studio photography, no box, device near-full-bleed top to bottom)
    // at ~200×724 after cropping — the strongest resolution gain of the 4 VOOPOO products in this
    // pass, and fixes the torn edge outright (fresh source, not a repair of the old one).
    // 02/10 (image-sitewide, G5 standard): every colour = a Higgsfield 4K remake of the photo above (remover cut, 22/22 on
    // the fidelity check), tilted 12°; card-v2 = the Black remake upright; swatches = the median body colour of
    // those photos (several were guessed from the names). Scripts + sheets: _incoming/image-sitewide/dsx/ (map: scripts/process-images.map.json).
    openOnCardPhoto: true,
    colorVariants: [
      { id: "black", name: "Black", swatchHex: "#292a29", image: { src: "/assets/products/vinci-s/variant-black-v2.webp", alt: "VOOPOO VINCI S, Black" } },
      { id: "silver", name: "Silver", swatchHex: "#b7b7b7", image: { src: "/assets/products/vinci-s/variant-silver-v2.webp", alt: "VOOPOO VINCI S, Silver" } },
      { id: "grey", name: "Grey", swatchHex: "#4f4f4f", image: { src: "/assets/products/vinci-s/variant-grey-v2.webp", alt: "VOOPOO VINCI S, Grey" } },
      { id: "blue-gradient", name: "Blue Gradient", swatchHex: "#1090be", image: { src: "/assets/products/vinci-s/variant-blue-gradient-v2.webp", alt: "VOOPOO VINCI S, Blue Gradient" } },
      { id: "green-gradient", name: "Green Gradient", swatchHex: "#76ab74", image: { src: "/assets/products/vinci-s/variant-green-gradient-v2.webp", alt: "VOOPOO VINCI S, Green Gradient" } },
      { id: "gold-gradient", name: "Gold Gradient", swatchHex: "#be8953", image: { src: "/assets/products/vinci-s/variant-gold-gradient-v2.webp", alt: "VOOPOO VINCI S, Gold Gradient" } },
      { id: "neon", name: "Neon", swatchHex: "#9743c0", image: { src: "/assets/products/vinci-s/variant-neon-v2.webp", alt: "VOOPOO VINCI S, Neon" } },
      { id: "pink", name: "Pink", swatchHex: "#d89cab", image: { src: "/assets/products/vinci-s/variant-pink-v2.webp", alt: "VOOPOO VINCI S, Pink" } },
    ],
    // "ทั้งหมด" (02/10): two groups in maker order — the 7-9-device image was too small (owner 02/10) — RELX Phantom poster
    // layout, _incoming/image-sitewide/dsx/vp-relx2.js vinci-s-a / -b; pills "ทั้งหมด 1" / "ทั้งหมด 2".
    lineupImage: {
      src: "/assets/products/vinci-s/lineup-v2.webp",
      alt: "VOOPOO VINCI S, colours 1–4 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    lineupImage2: {
      src: "/assets/products/vinci-s/lineup2-v2.webp",
      alt: "VOOPOO VINCI S, colours 5–8 of 8",
      sourceName: "OKami24 composite (from this page's colour photos)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "2000mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–40W", sourceStatus: "verified" },
      { key: "pod", label: "Cartridge capacity", value: "4.5mL (2mL in TPD regions)", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.3–3.0Ω", sourceStatus: "verified" },
      { key: "fill", label: "Fill style", value: "Topside filling", sourceStatus: "verified" },
      { key: "materials", label: "Materials", value: "Aluminum alloy + PC", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "topside-fill",
        title: "Topside-fill cartridge",
        description: "Fill from the top of the pod without removing it from the device.",
      },
    ],
    compatibility: [{ type: "pod", label: "VINCI cartridge platform", note: "0.3–3.0Ω resistance range." }, usbC1A],
    whoIsThisFor: [
      "Vapers who want a mid-output (5–40W) pod kit with a 2000mAh built-in battery and a wide 0.3–3.0Ω pod range.",
      "Anyone who wants topside filling without unseating the pod.",
    ],
    faqs: [],
    relatedProductSlugs: ["argus-g4", "vmate-i3"],
    sourceUrls: ["https://www.voopoo.com/vinci-series/vinci-s"],
  },
  {
    id: "vmate-i3",
    slug: "vmate-i3",
    brandId: "voopoo",
    familyId: "vmate",
    categoryId: "pod-kits",
    systemType: "pod-kit",
    name: "VMATE i3",
    displayName: "VOOPOO VMATE i3",
    tagline: "An ultra-light pod kit at 103mm and a few dozen grams.",
    shortDescription:
      "A slim VOOPOO pod kit: a 1500mAh, 5–30W aluminum-alloy device with a 3mL top-fill cartridge.",
    isFlagship: false,
    attributes: {
      batteryMah: 1500,
      wattageMin: 5,
      wattageMax: 30,
      capacityMl: 3,
      screenType: "none",
      drawStyle: "MTL/RDL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C, 2A",
      dimensions: "103 × 28.5 × 15.1 mm",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/vmate-i3/variants/black.webp",
        alt: "VOOPOO VMATE i3, Black, isolated product shot",
        angle: "Front, isolated",
        transparentBackground: true,
        sourceName: "VOOPOO (shop.voopoo.com)",
        sourceUrl: "https://shop.voopoo.com/products/vmate-i3",
      },
    ],
    // Real VOOPOO color/finish lineup — QC pass (2026-09-04): all 7 colors sourced directly from
    // shop.voopoo.com's own color→photo JSON binding (tier-1, see drag-6's comment for method).
    // "Silver Black" is a genuine two-tone finish name, not a duplicate/typo. Card switched from
    // the old "teal gradient" photo (never a confirmed exact match for "Cyan Blue") to "Black".
    colorVariants: [
      { id: "black", name: "Black", swatchHex: "#1a1a1a", image: { src: "/assets/products/vmate-i3/variants/black.webp", alt: "VOOPOO VMATE i3, Black" } },
      { id: "red", name: "Red", swatchHex: "#b83a3a", image: { src: "/assets/products/vmate-i3/variants/red.webp", alt: "VOOPOO VMATE i3, Red" } },
      { id: "purple", name: "Purple", swatchHex: "#6b4a8e", image: { src: "/assets/products/vmate-i3/variants/purple.webp", alt: "VOOPOO VMATE i3, Purple" } },
      { id: "pink", name: "Pink", swatchHex: "#e8899a", image: { src: "/assets/products/vmate-i3/variants/pink.webp", alt: "VOOPOO VMATE i3, Pink" } },
      { id: "cyan-blue", name: "Cyan Blue", swatchHex: "#3ab5c6", image: { src: "/assets/products/vmate-i3/variants/cyan-blue.webp", alt: "VOOPOO VMATE i3, Cyan Blue" } },
      { id: "neon", name: "Neon", swatchHex: "#c6f24a", image: { src: "/assets/products/vmate-i3/variants/neon.webp", alt: "VOOPOO VMATE i3, Neon" } },
      { id: "silver-black", name: "Silver Black", swatchHex: "#7a7d80", image: { src: "/assets/products/vmate-i3/variants/silver-black.webp", alt: "VOOPOO VMATE i3, Silver Black" } },
    ],
    // "All Colors" lineup (owner mandate, 2026-09-04) — OKami24 composite from the 7
    // individually-verified shop.voopoo.com photos above.
    lineupImage: {
      src: "/assets/products/vmate-i3/lineup.webp",
      alt: "VOOPOO VMATE i3, all 7 colors",
      sourceName: "OKami24 composite (from shop.voopoo.com photos)",
    },
    specifications: [
      { key: "battery", label: "Battery", value: "1500mAh built-in", sourceStatus: "verified" },
      { key: "output", label: "Output range", value: "5–30W", sourceStatus: "verified" },
      { key: "pod", label: "Pod capacity", value: "3mL, VMATE Top Fill Cartridge (V2 pod compatible)", sourceStatus: "verified" },
      { key: "dimensions", label: "Dimensions", value: "103 × 28.5 × 15.1 mm", sourceStatus: "verified" },
      { key: "resistance", label: "Resistance range", value: "0.4–3.0Ω", sourceStatus: "verified" },
      { key: "charging", label: "Charging", value: "USB-C, 2A fast charging", sourceStatus: "verified" },
    ],
    features: [
      {
        id: "slim-body",
        title: "Slim aluminum-alloy body",
        description: "A 15.1mm-thick body that sits comfortably in a trouser pocket.",
      },
    ],
    compatibility: [{ type: "pod", label: "VMATE Top Fill Cartridge", note: "V2 pod compatible, 0.4–3.0Ω." }, usbC2A],
    whoIsThisFor: [
      "Vapers who carry a pod all day and want a slim device that slips in and out of a pocket easily.",
    ],
    faqs: [],
    relatedProductSlugs: ["argus-g3-mini", "vinci-s"],
    sourceUrls: ["https://www.voopoo.com/v-series/vmate-i3"],
  },
];
