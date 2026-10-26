import type { TechnologyEntry } from "@/types/catalog";

// Round SEO ข batch 4 (2026-09-21): every page grew from verified spec rows, catalog-relationships.ts
// and the owner's rulings only — per-paragraph source map in _incoming/seo-b/writer-batch4-sources.md.
// publishedAt = the commit that first added all five records (f29d7fc, 2026-08-29, read from git
// log — never invented). The modified date is the last git commit touching this file /
// technology-copy.ts, via src/data/content-dates.json (round search-price batch 3, 2026-09-22).
export const technologyEntries: TechnologyEntry[] = [
  {
    id: "mesh-coil-systems",
    slug: "mesh-coil-systems",
    name: "Mesh Coil Systems",
    summary: "A flattened, mesh-style heating element replaces traditional round wire coils across most current pod and disposable devices.",
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "Why mesh over round wire",
        paragraphs: [
          "What is a mesh coil, and why do most current pods use one? A mesh coil exposes more surface area to the wicking material than a traditional round-wire coil of the same footprint, which is why it's become the default heating element across most current pod, pod-kit, and disposable devices.",
          "The tradeoff is less about raw performance and more about consistency — mesh coils are associated with more even heating across the coil's surface, which reduces hot-spotting that can cause a localized burnt taste.",
          "A burnt taste that appears after some use is a different matter: that is the sign the wicking material is worn out and the pod is due for replacement. The signs to watch for are in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
        ],
      },
      {
        heading: "A real example confirmed by the spec sheet: the mesh coil in the M Bar 10K",
        paragraphs: [
          // Data round (2026-09-24): the M Bar 9K paragraph and the 9K-vs-10K wording note are cut — SALTHUB's own site
          // names no coil type for the 9K (only "Resistance 1.0 Ω"), so its "Mesh coil" row is unverified now. 10K's
          // "30mg" is on none of SALTHUB's 10K posters and is cut too.
          "The [M Bar 10K](/products/m-bar-10k) coil row reads “Cotton mesh coil”. Verified alongside it: rated up to 10,000 puffs, a 600mAh USB-C rechargeable battery, and three power modes — Eco / Soft / Boost — switched by a double-click.",
          "It is a disposable, so the coil is never replaced — when the e-liquid runs out the device is finished. To compare with the side where you change the coil yourself, see [Open-system vs. disposable](/guides/open-system-vs-disposable).",
        ],
      },
    ],
    // caliburn-g5 dropped (batch 1 finding C3): its spec sheet has no coil row, so the body cannot name it.
    relatedProductSlugs: ["m-bar-9k", "m-bar-10k"],
    // The shop's mesh clip (owner 19/10 "1 คลิปหลักต่อหน้า"): it used to be one of five clips in the wattage guide; this
    // page owns "mesh coil คือ" (autocomplete 19/10), so the clip lives here. Title / channel / date as the guide carried it.
    reviewVideo: { videoId: "HX7i9eqk_dg", title: "ทำไมพอตรุ่นใหม่ถึงหนีไปใช้ Mesh Coil กันหมด", channelName: "OKAMI", publishedAt: "2026-08-05" },
  },
  {
    id: "multi-resistance-cartridges",
    slug: "multi-resistance-cartridges",
    name: "Multi-Resistance Cartridge Platforms",
    summary: "One pod shape, several coil resistances — how platforms like ARGUS's top-fill cartridge cover MTL and RDL from a single form factor.",
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "One shape, several resistances",
        paragraphs: [
          "What does “multi-resistance cartridge” mean on a spec sheet? Rather than shipping a separate pod shape for each draw style, several current platforms — like VOOPOO's ARGUS top-fill cartridge — keep one physical pod shape and vary only the resistance of the coil built into it.",
          "So switching from a tighter MTL draw to a looser RDL draw means swapping in a pod of a different resistance, not changing devices.",
          "This matters most for devices with a wide advertised resistance range (like the [ARGUS G4](/products/argus-g4)'s 0.4–3.0Ω), since it signals the platform is built to support more than one draw style without buying an entirely different device.",
          "The ARGUS G4's pod line reads: ARGUS top-fill cartridge platform, multiple resistances. But a wide resistance range is only half the answer — the other half is whether that pod can actually be bought, which is laid out in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
      {
        heading: "Real example: the ARGUS G3 mini ships with one pod resistance in the box (0.7Ω)",
        paragraphs: [
          "The [ARGUS G3 mini](/products/argus-g3-mini) is an auto-draw pod kit with no fire button. Its sheet says wattage auto-adjusts to whichever pod is installed, up to 30W — which means the platform supports more than one resistance.",
          "What is in the box, though, is a single one: the ARGUS Top Fill Cartridge V2 at 0.7Ω, 3mL, with the iCOSM CODE 2.0 anti-leak system, on a 1350mAh battery.",
          "If you want another resistance, we carry [VOOPOO Argus Pod cartridges](/products/coil-21) in 0.4, 0.7 and 1.2Ω. VOOPOO says the whole ARGUS pod family fits the G3 mini; check the resistance and output first.",
          "How the MTL and RDL draws mentioned above actually feel is in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
        ],
      },
    ],
    faq: [
      {
        question: "Can the ARGUS G3 mini take a pod of another resistance?",
        answer: "Yes. VOOPOO says the whole ARGUS pod family fits — check the resistance and output first. The box holds one pod, at 0.7Ω; for other resistances, we carry VOOPOO Argus Pod cartridges.",
      },
      {
        question: "What is a multi-resistance pod?",
        answer: "Pods of one shape that fit the same device, with the built-in coil offered in several resistances. Changing draw style means changing the pod, not the device.",
      },
    ],
    // vinci-s dropped (batch 1 finding C1): its verified row is the VINCI cartridge platform, not ARGUS.
    relatedProductSlugs: ["argus-g4", "argus-g3-mini"],
  },
  {
    id: "onboard-touch-displays",
    slug: "onboard-touch-displays",
    name: "Onboard Touch Displays",
    summary: "Full touchscreen control is moving down from box mods into compact pod devices.",
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "From status readout to full menu",
        paragraphs: [
          "How is a touchscreen pod different from one with an ordinary screen? Early pod-device screens mostly just showed battery level. Current touchscreen-equipped pods — like the Caliburn G4 Pro's 2.51\" touchscreen or the ARGUS P3's 2.01\" full-touch display — expose full menu navigation for switching modes and adjusting wattage without physical buttons.",
          "The added display and touch digitizer costs some battery efficiency and shell simplicity compared to a screen-free device, which is why simpler siblings in the same family (like the Caliburn G4 Mini) often skip the screen entirely for a smaller, more pocketable body instead.",
          "Screen and battery are therefore two lines to read together. The mAh figure compares one model with another; it is not a number of hours. Charging and battery care are in [Battery care](/guides/battery-care-and-charging).",
        ],
      },
      {
        heading: "Real example: the Caliburn G4 Pro's 2.51\" screen next to the G4 Pro KOKO's 2\" screen",
        paragraphs: [
          "The [Caliburn G4 Pro](/products/caliburn-g4-pro): a 2.51\" touchscreen, an 1800mAh built-in battery, 35W maximum, stepless airflow control, and UWELL GPP pods plus the older G3 pods.",
          "The [Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko): a 2\" touchscreen, a 2000mAh built-in battery, 35W maximum, Storm / Waves / Custom (draw modes) chosen on the screen, Pro-FOCS 4.0 flavor tuning, and the same GPP and G3 pods.",
          "Compared on verified rows only: the larger screen is on the G4 Pro (2.51\"), the larger battery on the KOKO (2000mAh), the wattage ceiling is the same, and both take the same pods. What Storm / Waves / Custom actually do is explained in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
        ],
      },
      {
        heading: "Real example: the ARGUS P3's 2.01\" full-touch display",
        paragraphs: [
          "The [ARGUS P3](/products/argus-p3) is a pod kit run from a 2.01\" full-touch TFT HD display for menu and mode control, with a 1500mAh built-in battery and a 5–30W output range.",
          "Its pod line is the ARGUS top-fill cartridge platform. We carry [VOOPOO Argus Pod cartridges](/products/coil-21), and VOOPOO asks you to check resistance and output against the P3 first. Before choosing a device by its screen, read the pod line alongside it — how to is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
    ],
    faq: [
      {
        question: "How do the G4 Pro and G4 Pro KOKO differ?",
        answer: "On verified rows: the G4 Pro has a 2.51\" touchscreen, an 1800mAh battery and stepless airflow; the KOKO has a 2\" touchscreen, a 2000mAh battery, Storm / Waves / Custom modes and Pro-FOCS 4.0. Both top out at 35W and take GPP and G3 pods.",
      },
      {
        question: "Does a touchscreen pod use more battery?",
        answer: "The screen and touch layer draw more than a screen-free device, but the hours you get depend on the wattage you set, screen use and how often you fire. Use mAh to compare models, not as hours.",
      },
    ],
    relatedProductSlugs: ["caliburn-g4-pro", "caliburn-g4-pro-koko", "argus-p3"],
  },
  {
    id: "high-output-chip-platforms",
    slug: "high-output-chip-platforms",
    name: "High-Output Chip Platforms",
    summary: "Dedicated chipsets — like GENE.TT and GENE.AI — govern how a device regulates output, protects the battery, and adapts to different coil resistances.",
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "What the chip is actually doing",
        paragraphs: [
          "How do GENE.TT and GENE.AI differ? First, what a chip does. Beyond the visible wattage number, a device's chipset governs how quickly it can ramp output, how it protects the battery under load, and — on newer chips — whether it can auto-detect and adjust to a given coil's resistance rather than requiring a manual setting.",
          "VOOPOO's GENE.TT 3.0 (used in the high-output DRAG 6) and GENE.AI (used in the beginner-oriented ARGUS G3 mini) sit at opposite ends of that spectrum — one tuned for a high output ceiling and several output modes, the other tuned for automatic, fixed-wattage simplicity.",
        ],
      },
      {
        heading: "Real example: SMART, RBA and TC-TCR modes on the DRAG 6's GENE.TT 3.0",
        paragraphs: [
          "The [DRAG 6](/products/drag-6) runs the GENE.TT 3.0 chip: 220W maximum, a 4400mAh built-in battery (two 2200mAh cells), and SMART, RBA and TC-TCR modes to choose from.",
          "The modes are what put this chip at the opposite end from GENE.AI. Wattage is set with a physical adjustment wheel, the fire button carries a capacitive unlock sensor, and the 1.66\" TFT screen shows wattage, battery, resistance, puff count and mode.",
          "The DRAG 6's coil row is verified from VOOPOO's own page: the UFORCE-X Tank II in the kit takes every PnP X coil. How a row gets verified is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
      {
        heading: "Real example: the fire button disappears — the ARGUS G3 mini and GENE.AI",
        paragraphs: [
          "The [ARGUS G3 mini](/products/argus-g3-mini) runs GENE.AI and is auto-draw: no fire button, the device fires when you inhale, and wattage auto-adjusts to whichever pod is installed, up to 30W, with no menu to set.",
          "A 1350mAh built-in battery in a 95.3 × 25.8 × 13.7 mm, 41 g body. The pod in the box is the ARGUS Top Fill Cartridge V2 at 0.7Ω, with the iCOSM CODE 2.0 anti-leak system.",
          "For another resistance, we carry [VOOPOO Argus Pod cartridges](/products/coil-21); VOOPOO asks you to check resistance and output before use.",
          "These two devices are the two ends of what a chip can do: the DRAG 6 hands the settings to you, the ARGUS G3 mini lets the chip decide. Not sure yet whether you want to set wattage yourself? Read [Choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
        ],
      },
    ],
    faq: [
      {
        question: "How do the DRAG 6 and ARGUS G3 mini differ?",
        answer: "DRAG 6: GENE.TT 3.0 chip, 220W maximum, 4400mAh battery, SMART/RBA/TC-TCR modes, wattage set by wheel. ARGUS G3 mini: GENE.AI chip, 30W maximum, 1350mAh battery, no fire button, wattage auto-adjusted to the pod.",
      },
      {
        question: "What is GENE.AI?",
        answer: "VOOPOO's chip in the ARGUS G3 mini. It reads the pod installed and sets wattage itself, up to 30W, with nothing to configure — no fire button, it fires on inhale.",
      },
    ],
    relatedProductSlugs: ["drag-6", "argus-g3-mini"],
  },
  {
    id: "gesture-and-triple-tap-control",
    slug: "gesture-and-triple-tap-control",
    name: "Gesture & Triple-Tap Control",
    summary: "Tap-based gesture sensors are starting to replace physical button rows on compact pod devices.",
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "Fewer buttons, same control",
        paragraphs: [
          "What is Smart Triple-Tap? UWELL's Smart Triple-Tap Control on the Caliburn G5 uses a tap gesture sensor instead of a row of physical buttons to switch between output modes, which keeps the shell simpler and reduces the number of moving parts that can wear out or let in moisture.",
          "The tradeoff is a small learning curve versus a labeled button — gesture control needs the on-device display to confirm what mode you've landed on, which is part of why it's paired with a screen rather than shipped on a fully screen-free device.",
        ],
      },
      {
        heading: "Real example: the Caliburn G5's actual numbers, with Smart Triple-Tap",
        paragraphs: [
          "The [Caliburn G5](/products/caliburn-g5): a 1600mAh built-in battery, 5–35W output, a 0.85\" colour screen, USB-C charging, and a top-fill pod. Control is Smart Triple-Tap Control — modes are switched by tapping.",
          "The 0.85\" colour screen is what makes tap control usable: after a tap it shows which mode you are in, the wattage, and the battery level.",
          "Not chosen a device yet? The G5 is the main example in [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
        subsections: [
          {
            heading: "Which pod the Caliburn G5 takes",
            paragraphs: [
              "UWELL GPP pods, in four resistances — 0.4 / 0.6 / 0.9 / 1.2Ω — per UWELL's own G Pod Platform page, and a GPP pod ships in the box. Which other Caliburn devices take it, and how to look after it, is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "How does Smart Triple-Tap work?",
        answer: "Tap the device three times in a row to switch output mode — there is no button row. The result shows on the 0.85\" colour screen. It is used on the Caliburn G5.",
      },
    ],
    relatedProductSlugs: ["caliburn-g5"],
  },
];

export function getTechnologyEntry(slug: string): TechnologyEntry | undefined {
  return technologyEntries.find((t) => t.slug === slug);
}
