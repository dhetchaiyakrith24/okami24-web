import type { FlavorFamily } from "@/types/catalog";

export const flavorFamilies: FlavorFamily[] = [
  {
    id: "fruit",
    slug: "fruit",
    name: "Fruit",
    description:
      "The largest and most varied flavor family — single-note fruits, blended fruit combinations, and fruit-forward profiles built for an open-system pod or disposable's everyday draw.",
    characterNotes: ["Bright, high-top-note profiles", "Often blended across two or more fruits", "Widest flavor count of any family"],
  },
  {
    id: "menthol-cooling",
    slug: "menthol-cooling",
    name: "Menthol & Cooling",
    description:
      "Straight menthol and cooling-agent-forward blends, from a clean single-note menthol to fruit-and-ice combinations that pair a cooling finish with a fruit top note.",
    characterNotes: ["Cooling sensation on the exhale", "Ranges from straight menthol to fruit-ice blends", "Often preferred for a cleaner finish"],
  },
  {
    id: "dessert",
    slug: "dessert",
    name: "Dessert",
    description:
      "Bakery, custard, and confection-style profiles — richer, sweeter flavor builds that trade brightness for depth.",
    characterNotes: ["Richer, heavier flavor build", "Bakery, custard, and confection notes", "Typically vaped at lower wattage for a smoother throat hit"],
  },
  {
    id: "beverage",
    slug: "beverage",
    name: "Beverage",
    description: "Soda, iced-tea, coffee, and other drink-inspired profiles, usually built around a distinct beverage note rather than a fruit or bakery base.",
    characterNotes: ["Drink-inspired top notes (soda, tea, coffee)", "Often layered with a fruit or cooling accent", "Distinct from straight fruit or dessert profiles"],
  },
  {
    id: "tobacco-style",
    slug: "tobacco-style",
    name: "Tobacco-Style",
    description:
      "Tobacco-inspired profiles for vapers transitioning away from combustible cigarettes or who simply prefer a tobacco-adjacent base note over fruit or dessert flavoring.",
    characterNotes: ["Tobacco-adjacent base note", "Often chosen by vapers switching from cigarettes", "Ranges from plain to blended with caramel or menthol accents"],
  },
];

export function getFlavorFamily(slug: string): FlavorFamily | undefined {
  return flavorFamilies.find((f) => f.slug === slug);
}
