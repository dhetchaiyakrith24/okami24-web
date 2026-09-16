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
    // Round 30.4ข batch 3 (owner, 2026-09-17): the "switching from cigarettes" audience line was swept
    // with the "ไม่เผาไหม้" set — it reads as a cessation claim the site cannot back. Same cut in
    // flavor-copy.ts (th/zh); the family keeps two character notes in every language.
    description:
      "Tobacco-inspired profiles for vapers who prefer a tobacco-adjacent base note over fruit or dessert flavoring.",
    characterNotes: ["Tobacco-adjacent base note", "Ranges from plain to blended with caramel or menthol accents"],
  },
];

export function getFlavorFamily(slug: string): FlavorFamily | undefined {
  return flavorFamilies.find((f) => f.slug === slug);
}
