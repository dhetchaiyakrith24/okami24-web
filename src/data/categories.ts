import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "pod-systems",
    slug: "pod-systems",
    name: "Open-System Pod Devices",
    shortName: "Pod Systems",
    description:
      "Refillable pod devices built around interchangeable coil pods — fill your own e-liquid, swap resistances, and control airflow by hand.",
    systemTypes: ["open-pod"],
  },
  {
    id: "pod-kits",
    slug: "pod-kits",
    name: "Pod Kits & Pod Mods",
    shortName: "Pod Kits",
    description:
      "Higher-output pod devices with chip-driven firmware, adjustable wattage, and swappable resistance pod platforms — the step up from a simple open pod.",
    systemTypes: ["pod-kit"],
  },
  {
    id: "disposables",
    slug: "disposables",
    name: "Disposable / Prefilled",
    shortName: "Disposables",
    description:
      "Prefilled, rechargeable, single-use-cartridge devices designed to run until the e-liquid is gone — no coils to swap, no e-liquid to fill.",
    systemTypes: ["disposable"],
  },
  {
    id: "pods-cartridges",
    slug: "pods-cartridges",
    name: "Pods & Cartridges",
    shortName: "Pods",
    description:
      "Replacement pods and cartridges for open-system and switch-style devices — the consumable side of the ecosystem.",
    systemTypes: ["pod-cartridge"],
  },
  {
    id: "coils-accessories",
    slug: "coils-accessories",
    name: "Coils & Accessories",
    shortName: "Coils & Accessories",
    description:
      "Replacement coil heads and the accessories that keep a device running — chargers, cases, drip tips, and cleaning kits.",
    systemTypes: ["coil", "accessory"],
  },
  // Phase 3.5 (E-liquid) — deliberately `systemTypes: []`, not a guess at a device value. `SystemType`
  // is a closed enum designed for vape hardware (open-pod/pod-kit/disposable/pod-cartridge/coil/
  // accessory); no value describes a bottled e-liquid correctly, so every e-liquid ProductMaster
  // record keeps `systemType: null` (already a fully supported, non-blocking state — see
  // `validateProductMasterRegistry`'s own comment on why systemType/attributes are excluded from
  // publication readiness). `systemTypes` on `Category` itself is declared but never actually read
  // anywhere in the app (verified by search before adding this) — an empty array is safe.
  {
    id: "e-liquid",
    slug: "e-liquid",
    name: "E-Liquid",
    shortName: "E-Liquid",
    description: "Bottled e-liquid for refillable devices — flavor, nicotine formulation, and bottle size, sourced from real operational stock.",
    systemTypes: [],
  },
  // Full-catalog mission — heated tobacco is a physically different product category from vapor
  // hardware (heats tobacco leaf without combustion, not vaporized e-liquid), so it gets its own
  // two categories rather than being forced into an existing vape-shaped one — same reasoning as
  // the e-liquid category above: `systemTypes: []` deliberately, since `SystemType` has no correct
  // heated-tobacco value.
  {
    id: "heated-tobacco-devices",
    slug: "heated-tobacco-devices",
    name: "Heated Tobacco Devices",
    shortName: "HNB Devices",
    description: "Heat-not-burn devices that heat tobacco sticks without combustion — official IQOS ILUMA devices and compatible third-party heaters.",
    systemTypes: [],
  },
  {
    id: "heated-tobacco-consumables",
    slug: "heated-tobacco-consumables",
    name: "Heated Tobacco Sticks",
    shortName: "HNB Sticks",
    description: "Tobacco sticks for heat-not-burn devices — the consumable side of the heated-tobacco ecosystem.",
    systemTypes: [],
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}
