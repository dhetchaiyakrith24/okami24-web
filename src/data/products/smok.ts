import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };
const NORD_5_PAGE = "https://store.smoktech.com/product/details/nord-5-kit";
const RPM_5_PAGE = "https://store.smoktech.com/product/details/rpm-5-kit";

// Round popular models 07/11: SMOK is not in the warehouse, so no price and no cart (BSOT §4). Facts and photos: SMOK's own store and
// smoktech.com, read in the in-app browser 07/11. "smok" 12,100 in the key table is mostly the word "smoke" (same volume, "smoke แปลว่า"
// beside it), so these models follow Thai autocomplete and what Thai shops sell, not that number.
export const smokProducts: Product[] = [
  {
    // SMOK's store text prints the pod as "(5m)"; its product poster prints 5ML. Charging: the poster gives Max 1.2A for the regular
    // series and Max 1.5A for the leather series, which is why store (1.2A) and main site (1.5A) differ.
    id: "smok-nord-5",
    slug: "smok-nord-5",
    brandId: "smok",
    familyId: "smok-nord",
    categoryId: "pod-systems",
    systemType: "pod-kit",
    name: "Nord 5",
    displayName: "SMOK NORD 5",
    searchAliases: ["SMOK Nord", "Nord5", "SMOK Nord5"],
    tagline: "The Nord 5: 2000mAh, 5 to 80W, and a 5mL pod on RPM 3 coils.",
    shortDescription:
      "SMOK's Nord 5 has a built-in 2000mAh battery and runs from 5 to 80W. It holds 5mL in a pod that uses RPM 3 coils, with a slider for the airflow and a 0.69-inch OLED display.",
    isFlagship: false,
    attributes: {
      batteryMah: 2000,
      wattageMin: 5,
      wattageMax: 80,
      capacityMl: 5,
      portability: "compact",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/smok-nord-5/card.webp",
        alt: "SMOK Nord 5, 7-Color Dart, front three-quarter view",
        angle: "front three-quarter, isolated",
        transparentBackground: true,
        sourceName: "SMOK (official store photo)",
        sourceUrl: NORD_5_PAGE,
      },
    ],
    openOnCardPhoto: true,
    // SMOK's 12 colours in its store's order; each photo is the gallery image of that colour.
    colorVariants: [
      { id: "red-grey-dart", name: "Red Grey Dart", swatchHex: "#d65a63", image: { src: "/assets/products/smok-nord-5/variant-red-grey-dart.webp", alt: "SMOK Nord 5, Red Grey Dart" } },
      { id: "7-color-dart", name: "7-Color Dart", swatchHex: "#7a6fd0", image: { src: "/assets/products/smok-nord-5/variant-7-color-dart.webp", alt: "SMOK Nord 5, 7-Color Dart" } },
      { id: "fluid-black-grey", name: "Fluid Black Grey", swatchHex: "#3a3a3d", image: { src: "/assets/products/smok-nord-5/variant-fluid-black-grey.webp", alt: "SMOK Nord 5, Fluid Black Grey" } },
      { id: "blue-grey-dart", name: "Blue Grey Dart", swatchHex: "#7ea6c4", image: { src: "/assets/products/smok-nord-5/variant-blue-grey-dart.webp", alt: "SMOK Nord 5, Blue Grey Dart" } },
      { id: "beige-white", name: "Beige White", swatchHex: "#e6e3dc", image: { src: "/assets/products/smok-nord-5/variant-beige-white.webp", alt: "SMOK Nord 5, Beige White" } },
      { id: "green-blue-dart", name: "Green Blue Dart", swatchHex: "#5cc4c0", image: { src: "/assets/products/smok-nord-5/variant-green-blue-dart.webp", alt: "SMOK Nord 5, Green Blue Dart" } },
      { id: "grey", name: "Grey", swatchHex: "#7c7c7e", image: { src: "/assets/products/smok-nord-5/variant-grey.webp", alt: "SMOK Nord 5, Grey" } },
      { id: "black", name: "Black", swatchHex: "#2c2c2e", image: { src: "/assets/products/smok-nord-5/variant-black.webp", alt: "SMOK Nord 5, Black" } },
      { id: "black-dart", name: "Black Dart", swatchHex: "#3d3d40", image: { src: "/assets/products/smok-nord-5/variant-black-dart.webp", alt: "SMOK Nord 5, Black Dart" } },
      { id: "blue-pink-dart", name: "Blue Pink Dart", swatchHex: "#efb7a6", image: { src: "/assets/products/smok-nord-5/variant-blue-pink-dart.webp", alt: "SMOK Nord 5, Blue Pink Dart" } },
      { id: "brown", name: "Brown", swatchHex: "#a5805a", image: { src: "/assets/products/smok-nord-5/variant-brown.webp", alt: "SMOK Nord 5, Brown" } },
      { id: "white-dart", name: "White Dart", swatchHex: "#e4e4e4", image: { src: "/assets/products/smok-nord-5/variant-white-dart.webp", alt: "SMOK Nord 5, White Dart" } },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "2000mAh built-in", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "output", label: "Output range", value: "5–80W", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "resistance", label: "Resistance range", value: "0.15–2.5Ω", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "pod", label: "Pod capacity", value: "5mL", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "coils", label: "Coil", value: "RPM 3 Meshed · in the box: 0.15Ω (fitted) and 0.23Ω", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "display", label: "Display", value: "0.69-inch OLED", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "charging", label: "Charging", value: "Type-C · max 1.2A, leather series max 1.5A", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
      { key: "size", label: "Dimensions", value: "105 × 32.5 × 23.74mm", sourceStatus: "verified", sourceUrl: NORD_5_PAGE },
    ],
    features: [
      { id: "airflow", title: "Airflow on a slider", description: "Drag the slider to set the air intake. Air comes in from both sides of the device." },
      { id: "power", title: "5 to 80W", description: "Set the power anywhere from 5 to 80W to suit the coil and how you like to vape." },
      { id: "display", title: "0.69-inch OLED display", description: "The display shows your working data, and the LED flashes five times to warn of a short circuit." },
      { id: "lock", title: "A lock on the pod", description: "A lock in the pod holds the coil in place, so e-liquid stays put if the coil head comes out by accident." },
      { id: "in-the-box", title: "What's in the box", description: "The device, a Nord 5 pod with a 0.15Ω RPM 3 Meshed coil fitted, a spare 0.23Ω coil, a Type-C cable and the manual." },
    ],
    compatibility: [{ type: "coil", label: "RPM 3 Meshed coils", note: "0.15Ω and 0.23Ω come in the kit." }, typeC],
    whoIsThisFor: ["You're looking for the SMOK Nord 5 by name and want the full spec and every colour SMOK lists."],
    faqs: [],
    relatedProductSlugs: ["smok-rpm-5"],
    sourceUrls: [NORD_5_PAGE, "https://www.smoktech.com/product/pod/nord-5"],
  },
  {
    // SMOK sells this kit with the 2000mAh device. Its main page also covers the RPM 5 Pro and a version on an external battery;
    // the numbers here are the kit's own, so the Pro stays out of the rows.
    id: "smok-rpm-5",
    slug: "smok-rpm-5",
    brandId: "smok",
    familyId: "smok-rpm",
    categoryId: "pod-systems",
    systemType: "pod-kit",
    name: "RPM 5",
    displayName: "SMOK RPM 5",
    searchAliases: ["SMOK RPM", "RPM5", "SMOK RPM5", "RPM 5 Pro"],
    tagline: "The RPM 5: 2000mAh, up to 80W, and a 6.5mL pod.",
    shortDescription:
      "SMOK's RPM 5 kit has a 2000mAh battery and runs from 5 to 80W. Its pod holds 6.5mL on RPM 3 Meshed coils, and a 0.96-inch TFT display shows your data in a theme colour you can change.",
    isFlagship: false,
    attributes: {
      batteryMah: 2000,
      wattageMin: 5,
      wattageMax: 80,
      capacityMl: 6.5,
      portability: "standard",
      // Not a maker fact: the shop's own beginner filter; nothing is in stock, so it stays out of that filter.
      beginnerFriendly: false,
      chargingType: "USB-C",
    },
    assets: [
      {
        kind: "official-photo",
        role: "card",
        src: "/assets/products/smok-rpm-5/card.webp",
        alt: "SMOK RPM 5, Prism Rainbow, front three-quarter view",
        angle: "front three-quarter, isolated",
        transparentBackground: true,
        sourceName: "SMOK (official store photo)",
        sourceUrl: RPM_5_PAGE,
      },
    ],
    openOnCardPhoto: true,
    // SMOK's 8 colours in its store's order; each photo is the gallery image of that colour.
    colorVariants: [
      { id: "matte-gun-metal", name: "Matte Gun Metal", swatchHex: "#3a3b3e", image: { src: "/assets/products/smok-rpm-5/variant-matte-gun-metal.webp", alt: "SMOK RPM 5, Matte Gun Metal" } },
      { id: "brown-leather", name: "Brown Leather", swatchHex: "#a5805a", image: { src: "/assets/products/smok-rpm-5/variant-brown-leather.webp", alt: "SMOK RPM 5, Brown Leather" } },
      { id: "prism-rainbow", name: "Prism Rainbow", swatchHex: "#5f8fd0", image: { src: "/assets/products/smok-rpm-5/variant-prism-rainbow.webp", alt: "SMOK RPM 5, Prism Rainbow" } },
      { id: "white", name: "White", swatchHex: "#c9c9c7", image: { src: "/assets/products/smok-rpm-5/variant-white.webp", alt: "SMOK RPM 5, White" } },
      { id: "grey-leather", name: "Grey Leather", swatchHex: "#7c7c7e", image: { src: "/assets/products/smok-rpm-5/variant-grey-leather.webp", alt: "SMOK RPM 5, Grey Leather" } },
      { id: "black-leather", name: "Black Leather", swatchHex: "#2c2c2e", image: { src: "/assets/products/smok-rpm-5/variant-black-leather.webp", alt: "SMOK RPM 5, Black Leather" } },
      { id: "beige-white-leather", name: "Beige White Leather", swatchHex: "#e6e3dc", image: { src: "/assets/products/smok-rpm-5/variant-beige-white-leather.webp", alt: "SMOK RPM 5, Beige White Leather" } },
      { id: "black", name: "Black", swatchHex: "#26272a", image: { src: "/assets/products/smok-rpm-5/variant-black.webp", alt: "SMOK RPM 5, Black" } },
    ],
    specifications: [
      { key: "battery", label: "Battery", value: "2000mAh", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "output", label: "Output range", value: "5–80W", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "resistance", label: "Resistance range", value: "0.15–2.0Ω", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "pod", label: "Pod capacity", value: "6.5mL", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "coils", label: "Coil", value: "RPM 3 Meshed · in the box: 0.15Ω (fitted) and 0.23Ω", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "display", label: "Display", value: "0.96-inch TFT", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "charging", label: "Charging", value: "Type-C · max 1.4A", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "size", label: "Dimensions", value: "122.5 × 29.5 × 31.2mm", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
      { key: "weight", label: "Weight", value: "122.7g", sourceStatus: "verified", sourceUrl: RPM_5_PAGE },
    ],
    features: [
      { id: "capacity", title: "A 6.5mL pod", description: "SMOK calls this the biggest step up in capacity across the RPM series." },
      { id: "power", title: "Up to 80W", description: "The kit runs from 5 to 80W on its 2000mAh battery." },
      { id: "display", title: "0.96-inch TFT display", description: "The display shows your data, and you can change its theme colour." },
      { id: "in-the-box", title: "What's in the box", description: "The device, an RPM 5 pod with a 0.15Ω RPM 3 Meshed coil fitted, a spare 0.23Ω coil, a Type-C cable and the manual." },
    ],
    compatibility: [{ type: "coil", label: "RPM 3 Meshed coils", note: "0.15Ω and 0.23Ω come in the kit." }, typeC],
    whoIsThisFor: ["You're looking for the SMOK RPM 5 by name and want the kit's numbers and every colour SMOK lists."],
    faqs: [],
    relatedProductSlugs: ["smok-nord-5"],
    sourceUrls: [RPM_5_PAGE, "https://www.smoktech.com/product/pod_mod/rpm-5-and-rpm-5-pro"],
  },
];
