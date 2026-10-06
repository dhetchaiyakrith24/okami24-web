import type { ProductFamily } from "@/types/catalog";

export const families: ProductFamily[] = [
  {
    id: "caliburn",
    slug: "caliburn",
    brandId: "uwell",
    categoryId: "pod-systems",
    name: "Caliburn",
    tagline: "The open-system pod family that defined the category.",
    description:
      "UWELL's long-running open-system pod line. Each generation (G3 → G4 → G5) keeps the same refillable-pod, swap-the-coil formula while adding onboard displays, adjustable wattage, and gesture/touch controls.",
  },
  {
    id: "argus",
    slug: "argus",
    brandId: "voopoo",
    categoryId: "pod-kits",
    name: "ARGUS",
    tagline: "Multi-resistance pod kits built for everyday carry.",
    description:
      "VOOPOO's mainstream pod-kit series, built around a shared top-fill cartridge platform that accepts multiple coil resistances in one pod — from compact minis to full-screen touch models.",
  },
  {
    id: "drag",
    slug: "drag",
    brandId: "voopoo",
    categoryId: "pod-kits",
    name: "DRAG",
    tagline: "VOOPOO's flagship, chip-driven pod mods.",
    description:
      "The highest-output series in the VOOPOO lineup, running GENE-series chips with large color/touch displays, external or high-capacity built-in batteries, and RBA/TC modes for advanced users.",
  },
  {
    id: "vinci",
    slug: "vinci",
    brandId: "voopoo",
    categoryId: "pod-kits",
    name: "VINCI",
    tagline: "Balanced pod mods for daily flavor-chasing.",
    description:
      "A mid-output pod series positioned between the compact ARGUS line and the high-power DRAG series, with a focus on flavor and topside-fill convenience.",
  },
  {
    id: "vmate",
    slug: "vmate",
    brandId: "voopoo",
    categoryId: "pod-kits",
    name: "VMATE",
    tagline: "Ultra-light pods for pure portability.",
    description:
      "VOOPOO's lightest, most compact pod-kit series, prioritizing slim dimensions and low weight over maximum output.",
  },
  {
    id: "m-bar",
    slug: "m-bar",
    brandId: "salthub",
    categoryId: "disposables",
    name: "M Bar",
    tagline: "High-puff-count, rechargeable disposables.",
    description:
      "SALTHUB's disposable line, differentiated primarily by rated puff count (9K / 10K / 15K), all built around a rechargeable battery, mesh coil, and multi-mode airflow.",
  },
  {
    id: "m-switch",
    slug: "m-switch",
    brandId: "salthub",
    categoryId: "pod-kits",
    name: "M Switch",
    tagline: "A reusable body, swappable pre-filled cartridges.",
    description:
      "A reusable device body paired with prefilled M Switch Pod cartridges, positioned between an open-system pod and a disposable — no e-liquid filling, but a device you keep.",
  },
  {
    id: "zero",
    slug: "zero",
    brandId: "salthub",
    categoryId: "pod-kits",
    name: "Zero",
    tagline: "Compact switch-style devices with adjustable output.",
    description:
      "SALTHUB's second reusable cartridge platform, spanning the multi-mode Zero Pro and the ultra-compact Zero Nano, both paired with Zero Cartridge refills.",
  },
  {
    id: "iluma",
    slug: "iluma",
    brandId: "iqos",
    categoryId: "heated-tobacco-devices",
    name: "ILUMA",
    tagline: "Induction heating, no blade to clean.",
    description:
      "IQOS's current heated-tobacco device generation, spanning ILUMA i PRIME, ILUMA i, ILUMA i ONE, and the original (pre-\"i\") ILUMA ONE — all using SMARTCORE induction heating instead of a heating blade, paired exclusively with TEREA sticks.",
  },
  // Tier-1 disposable growth mission (2026-09-03).
  {
    id: "relx-disposables",
    slug: "relx-disposables",
    brandId: "relx",
    categoryId: "disposables",
    name: "RELX Disposables",
    tagline: "High-puff-count disposables from a global closed-pod brand.",
    description:
      "RELX's standalone disposable line, distinct from the Creator closed pod system.",
  },
  {
    // 2026-09-30 (round "image-sitewide"): the RELX Creator is a device + prefilled pods, not a disposable (owner 30/09).
    id: "relx-creator",
    slug: "relx-creator",
    brandId: "relx",
    categoryId: "pod-kits",
    name: "RELX Creator",
    tagline: "A device you keep, prefilled pods you swap.",
    description:
      "RELX's closed pod system: the Creator Pro device (800mAh, pixel smart screen) takes prefilled pods that are swapped when they run out.",
  },
  {
    id: "joiway-f-series",
    slug: "joiway-f-series",
    brandId: "joiway",
    categoryId: "disposables",
    name: "Joiway F Series",
    tagline: "Joiway's numbered disposable line.",
    description: "Joiway's F-series disposables, a numbered generational line of high-puff-count rechargeable disposables.",
  },
  {
    id: "infy-disposables",
    slug: "infy-disposables",
    brandId: "infy",
    categoryId: "disposables",
    name: "INFY Disposables",
    tagline: "INFY's high-puff disposable line.",
    description: "INFY's disposable line, distinct from the brand's 2.5mL closed-pod cartridge system.",
  },
  {
    id: "tfit-power",
    slug: "tfit-power",
    brandId: "tfit",
    categoryId: "disposables",
    name: "TFIT Power",
    tagline: "TFIT's high-puff disposable line.",
    description: "TFIT's higher-puff-count disposable model line, sold alongside the brand's NOVA series.",
  },
  {
    id: "wotofo-nexbar",
    slug: "wotofo-nexbar",
    brandId: "wotofo",
    categoryId: "disposables",
    name: "WOTOFO nexBAR",
    tagline: "WOTOFO's disposable line.",
    description: "WOTOFO's nexBAR disposable series, sold in several puff-count tiers (10K and 18K among them).",
  },
  {
    id: "moood-monster",
    slug: "moood-monster",
    brandId: "moood",
    categoryId: "disposables",
    name: "MOOOD Monster Series",
    tagline: "MOOOD's 14,000-puff disposable line.",
    // Batch 5f (06/10): the maker's own name for the line ("MONSTER SERIES 14000 PUFFS", mooodvapes.com via the Wayback Machine).
    description: "MOOOD's MONSTER SERIES disposable line.",
  },
];

export function getFamily(id: string): ProductFamily | undefined {
  return families.find((f) => f.id === id || f.slug === id);
}

export function familiesForBrand(brandId: string): ProductFamily[] {
  return families.filter((f) => f.brandId === brandId);
}
