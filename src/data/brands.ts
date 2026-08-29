import type { Brand } from "@/types/catalog";

export const brands: Brand[] = [
  {
    id: "uwell",
    slug: "uwell",
    name: "UWELL",
    fullName: "Uwell",
    tagline: "Engineering flavor, one pod at a time.",
    description:
      "A device manufacturer best known for the Caliburn open-system pod family — compact, refillable pod devices built around interchangeable coil pods, adjustable airflow, and increasingly capable onboard displays across successive generations.",
    referenceUrl: "https://www.myuwell.com/",
  },
  {
    id: "voopoo",
    slug: "voopoo",
    name: "VOOPOO",
    fullName: "VOOPOO",
    tagline: "Spark your life.",
    description:
      "A device manufacturer spanning four current product series — ARGUS, DRAG, VINCI, and V — ranging from compact beginner pod kits to high-output, chip-driven pod mods with GENE-series firmware and swappable resistance pod platforms.",
    referenceUrl: "https://www.voopoo.com/",
  },
  {
    id: "salthub",
    slug: "salthub",
    name: "SALTHUB",
    fullName: "Salt Hub / M Bar",
    tagline: "The M Bar and M Switch ecosystem.",
    description:
      "A disposable- and switch-pod-focused brand built around the M Bar disposable line and the M Switch / Zero reusable cartridge platforms, emphasizing high puff counts, multi-mode airflow, and cartridge-based refill systems.",
    referenceUrl: "https://www.salthub.com/",
  },
];

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id || b.slug === id);
}
