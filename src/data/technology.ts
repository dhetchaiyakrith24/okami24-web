import type { TechnologyEntry } from "@/types/catalog";

export const technologyEntries: TechnologyEntry[] = [
  {
    id: "mesh-coil-systems",
    slug: "mesh-coil-systems",
    name: "Mesh Coil Systems",
    summary: "A flattened, mesh-style heating element replaces traditional round wire coils across most current pod and disposable devices.",
    body: [
      {
        heading: "Why mesh over round wire",
        paragraphs: [
          "A mesh coil exposes more surface area to the wicking material than a traditional round-wire coil of the same footprint, which is why it's become the default heating element across most current pod, pod-kit, and disposable devices in this catalog.",
          "The tradeoff is less about raw performance and more about consistency — mesh coils are associated with more even heating across the coil's surface, which reduces hot-spotting that can cause a localized burnt taste.",
        ],
      },
    ],
    relatedProductSlugs: ["m-bar-10k", "caliburn-g5", "m-bar-9k"],
  },
  {
    id: "multi-resistance-cartridges",
    slug: "multi-resistance-cartridges",
    name: "Multi-Resistance Cartridge Platforms",
    summary: "One pod shape, several coil resistances — how platforms like ARGUS's top-fill cartridge cover MTL and RDL from a single form factor.",
    body: [
      {
        heading: "One shape, several resistances",
        paragraphs: [
          "Rather than shipping a separate pod shape for each draw style, several current platforms — like VOOPOO's ARGUS top-fill cartridge — keep one physical pod shape and vary only the resistance of the coil built into it, so switching from a tighter MTL draw to a looser RDL draw means swapping in a pod of a different resistance, not changing devices.",
          "This matters most for devices with a wide advertised resistance range (like the ARGUS G4's 0.4–3.0Ω), since it signals the platform is built to support more than one draw style without buying an entirely different device.",
        ],
      },
    ],
    relatedProductSlugs: ["argus-g4", "argus-g3-mini", "vinci-s"],
  },
  {
    id: "onboard-touch-displays",
    slug: "onboard-touch-displays",
    name: "Onboard Touch Displays",
    summary: "Full touchscreen control is moving down from box mods into compact pod devices.",
    body: [
      {
        heading: "From status readout to full menu",
        paragraphs: [
          "Early pod-device screens mostly just showed battery level. Current touchscreen-equipped pods — like the Caliburn G4 Pro's 2.51\" touchscreen or the ARGUS P3's 2.01\" full-touch display — expose full menu navigation for switching modes and adjusting wattage without physical buttons.",
          "The added display and touch digitizer costs some battery efficiency and shell simplicity compared to a screen-free device, which is why simpler siblings in the same family (like the Caliburn G4 Mini) often skip the screen entirely to prioritize battery life and pocketability instead.",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g4-pro", "caliburn-g4-pro-koko", "argus-p3"],
  },
  {
    id: "high-output-chip-platforms",
    slug: "high-output-chip-platforms",
    name: "High-Output Chip Platforms",
    summary: "Dedicated chipsets — like GENE.TT and GENE.AI — govern how a device regulates output, protects the battery, and adapts to different coil resistances.",
    body: [
      {
        heading: "What the chip is actually doing",
        paragraphs: [
          "Beyond the visible wattage number, a device's chipset governs how quickly it can ramp output, how it protects the battery under load, and — on newer chips — whether it can auto-detect and adjust to a given coil's resistance rather than requiring a manual setting.",
          "VOOPOO's GENE.TT 3.0 (used in the high-output DRAG 6) and GENE.AI (used in the beginner-oriented ARGUS G3 mini) sit at opposite ends of that spectrum — one tuned for maximum output ceiling and rebuildable-coil support, the other tuned for automatic, fixed-wattage simplicity.",
        ],
      },
    ],
    relatedProductSlugs: ["drag-6", "argus-g3-mini"],
  },
  {
    id: "gesture-and-triple-tap-control",
    slug: "gesture-and-triple-tap-control",
    name: "Gesture & Triple-Tap Control",
    summary: "Tap-based gesture sensors are starting to replace physical button rows on compact pod devices.",
    body: [
      {
        heading: "Fewer buttons, same control",
        paragraphs: [
          "UWELL's Smart Triple-Tap Control on the Caliburn G5 uses a tap gesture sensor instead of a row of physical buttons to switch between output modes, which keeps the shell simpler and reduces the number of moving parts that can wear out or let in moisture.",
          "The tradeoff is a small learning curve versus a labeled button — gesture control needs the on-device display to confirm what mode you've landed on, which is part of why it's paired with a screen rather than shipped on a fully screen-free device.",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5"],
  },
];

export function getTechnologyEntry(slug: string): TechnologyEntry | undefined {
  return technologyEntries.find((t) => t.slug === slug);
}
