import type { Guide } from "@/types/catalog";

export const guides: Guide[] = [
  {
    id: "choosing-your-first-pod-system",
    slug: "choosing-your-first-pod-system",
    title: "Choosing Your First Pod System",
    dek: "A practical starting point for picking between open-system pods, pod kits, and disposables.",
    category: "getting-started",
    readingTimeMin: 6,
    body: [
      {
        heading: "Start with format, not features",
        paragraphs: [
          "Before comparing screens, wattage ranges, or battery capacities, decide on format: an open-system pod (pod system) you fill yourself, a higher-output pod kit, or a prefilled disposable. That single decision narrows the catalog more than any spec.",
          "Open-system pods (like the Caliburn line) mean buying e-liquid separately and refilling a small tank yourself, in exchange for lower running cost and more control over resistance and flavor. Disposables and switch-style cartridges trade that control for zero filling and zero coil-swapping.",
          "The two formats are compared in more depth in [Open-system vs. disposable](/guides/open-system-vs-disposable).",
        ],
      },
      {
        heading: "Then narrow by how you actually vape",
        paragraphs: [
          "A tighter, MTL-style draw (closer to a cigarette) generally pairs with a lower-wattage device and a higher-resistance coil. A looser, airier RDL or DTL draw wants more airflow and typically more wattage headroom. How the two actually feel is covered in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          "If you're not sure yet, a device with adjustable airflow and a wide wattage range — rather than a fixed, single-setting device — leaves room to find your preference without buying a second device. Those two numbers are on every spec sheet; see [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
      // Round SEO ข (2026-09-21): the four sections below and the FAQ were added from verified spec
      // rows, catalog-relationships.ts and the owner's rulings only — source map per paragraph in
      // the round folder (_incoming/seo-b/writer-A-sources.md).
      {
        heading: "UWELL, VOOPOO and Salthub: how they differ",
        paragraphs: [
          "Honest answer from the catalog: this article covers three brands — UWELL, VOOPOO and Salthub — and each makes a different kind of device, so none of them is simply “better”. Which one fits depends on the format you picked above.",
          "UWELL at this shop is the Caliburn family: open-system pods you fill yourself. Current models such as the G5 and G4 Pro top out at 35W, and most of them share the same GPP pod, so one pod type covers several devices.",
          "VOOPOO is the pod-kit side. ARGUS, VINCI and VMATE are the compact range — ARGUS G4 at 5–35W, ARGUS G3 mini up to 30W, VINCI S at 5–40W, VMATE i3 at 5–30W.",
          "DRAG is VOOPOO's high-output family: DRAG S3 at 5–60W, DRAG X3 at 5–80W and DRAG 6 up to 220W.",
          "Salthub is the no-filling side: M Bar are disposables, and M Switch is a switch-style device where you keep the body and swap a prefilled cartridge.",
        ],
      },
      {
        heading: "Real example: an open-system pod like the Caliburn G5",
        paragraphs: [
          "The [Caliburn G5](/products/caliburn-g5) is the current Caliburn flagship: a 1600mAh battery, 5–35W output, a 0.85-inch colour screen and a top-fill pod that connects magnetically.",
          "There is no row of buttons for switching modes — a Smart Triple-Tap gesture sensor handles mode switching and status readout instead.",
        ],
        subsections: [
          {
            heading: "Which pods the Caliburn G5 uses",
            paragraphs: [
              "It uses UWELL's GPP pod platform, available in four resistances: 0.4, 0.6, 0.9 and 1.2 ohm. The same GPP pod fits most current Caliburn devices (G5, G4 and G3 series), and each resistance is sold separately. How to look after a pod and when to change it is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
            ],
          },
        ],
      },
      {
        heading: "Real example: an auto-draw pod kit for beginners (ARGUS G3 mini)",
        paragraphs: [
          "The [ARGUS G3 mini](/products/argus-g3-mini) is an auto-draw pod kit: no fire button, the device activates when you inhale, and wattage auto-adjusts to whichever pod is installed, up to 30W, on VOOPOO's GENE.AI chipset.",
          "It carries a 1350mAh battery in a 95.3 × 25.8 × 13.7 mm, 41 g body. The included pod is the ARGUS Top Fill Cartridge V2 at 0.7 ohm, 3mL (2mL in TPD regions), with the iCOSM CODE 2.0 anti-leak system.",
          "One thing to know before you decide: this shop does not yet sell ARGUS pods separately — the pod that ships in the box is what you get here.",
        ],
      },
      {
        heading: "Real example: a disposable with adjustable airflow (M Bar 9K)",
        paragraphs: [
          "The [M Bar 9K](/products/m-bar-9k) is a disposable with adjustable airflow, tunable from a tight MTL draw to a more open DTL pull on one device — so you don't have to settle your draw style before buying.",
          "It comes prefilled with 14mL of 3% (30mg) salt nicotine e-liquid on a mesh coil, rated up to 9,000 puffs, with a 600mAh battery that recharges over USB-C. No filling, no coil changes.",
        ],
      },
      {
        heading: "Use the Finder instead of guessing",
        paragraphs: [
          "Rather than cross-referencing every spec by hand, the Product Finder asks a short set of preference questions and matches them against the device data in the catalog, showing why each result matched. If you still can't answer “which pod system is right for me”, let the [Product Finder](/finder) ask.",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "argus-g3-mini", "m-bar-9k"],
    faq: [
      {
        question: "What pods does the Caliburn G5 use?",
        answer: "UWELL GPP pods, in four resistances: 0.4, 0.6, 0.9 and 1.2 ohm. The same pod fits most current Caliburn devices.",
      },
      {
        question: "What pods does the ARGUS G3 mini use?",
        answer: "It ships with the ARGUS Top Fill Cartridge V2 at 0.7 ohm. This shop does not yet sell ARGUS pods separately.",
      },
      {
        question: "What e-liquid does a pod system use?",
        answer: "An open-system pod such as a Caliburn uses bottled e-liquid you buy separately and fill yourself. Disposables like the M Bar 9K and M Switch Pod cartridges come prefilled, so there is nothing to buy or fill.",
      },
      {
        // Owner's genuine-check ruling (2026-09-21, Q2=ก): exactly three parts, no brand beyond the
        // two with a verified official check page, claim wording = BSOT §12 only.
        question: "How do I check a product is genuine?",
        answer: "Salthub products such as the M Bar 9K and M Switch have a QR code and serial number on the box; check them on Salthub's official site at salthub.com/authenticate. Uwell products such as the Caliburn have a scratch-off strip on the box with a QR code and numeric code underneath; check them at myuwell.com/verify. If a product has a problem, claim within 7 days with an unboxing video; the shop replaces the same item or swaps to a model of the same price, with no cash refund, and replies within 3 business days.",
      },
    ],
  },
  {
    id: "open-system-vs-disposable",
    slug: "open-system-vs-disposable",
    title: "Open-System vs. Disposable: Which Fits How You Vape",
    dek: "Neither format is objectively better — the right one depends on how much control and maintenance you actually want.",
    category: "buying-guide",
    readingTimeMin: 5,
    body: [
      {
        heading: "What you're actually trading off",
        paragraphs: [
          "An open-system pod (open system, or pod kit) asks you to buy e-liquid separately, refill a small tank, and occasionally replace a coil pod. In exchange you generally get a lower cost per mL of e-liquid and more control over nicotine strength and flavor selection. What that coil-pod upkeep involves is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
          "A disposable or switch-style cartridge device removes filling and coil-swapping entirely — you use it until the puff count or e-liquid runs out — at the cost of less control over exactly what you're vaping and, for fully disposable formats, more waste per device.",
          "An open-system example from the catalog: the [Caliburn G5 Lite](/products/caliburn-g5-lite) keeps the G5's 1600mAh battery and 35W ceiling on the same UWELL GPP pods, with a simpler control layout.",
        ],
      },
      // Round SEO ข (2026-09-21): sections and FAQ below from verified rows only — source map in
      // _incoming/seo-b/writer-A-sources.md.
      {
        heading: "Real example: a rechargeable disposable (M Bar 10K)",
        paragraphs: [
          "The [M Bar 10K](/products/m-bar-10k) is a disposable that recharges over USB-C: a 600mAh battery, rated up to 10,000 puffs, 30mg nicotine salt on a cotton mesh coil. When the battery runs down you charge it rather than discarding it with e-liquid still inside.",
          "It has three power modes — Eco, Soft and Boost — cycled with a double-click, and an RGB indicator that changes colour to show which mode is active, plus a battery LED in 25% steps. No menu involved.",
          "The trade-off is the one above: flavor and nicotine strength are whatever came prefilled, and once the e-liquid is gone the whole device is discarded.",
        ],
      },
      {
        heading: "A middle ground: switch-style systems",
        paragraphs: [
          "Switch-style systems like M Switch or Zero keep a reusable, rechargeable device body and only replace a prefilled cartridge — closer to a disposable's simplicity, but without discarding the whole device each time.",
        ],
      },
      {
        heading: "Real example: M Switch Kit with prefilled M Switch Pod cartridges",
        paragraphs: [
          "The [M Switch Kit](/products/m-switch-kit) is a device body you keep and recharge over USB-C; the e-liquid comes in prefilled swap-in cartridges rated up to 15,000 puffs each. No bottled e-liquid, no filling. Its battery capacity is not independently confirmed, so no figure is given here.",
          "The cartridge is the [M Switch Pod](/products/m-switch-pod): 2.2mL prefilled, made for the M Switch Kit. When it runs out you swap in a new pod and the body stays.",
          "Compared with an M Bar 10K, where the whole device is discarded, an M Switch discards only the pod — the same simplicity (no filling, no coil changes) with less waste per swap. Still undecided on the format? Start again from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5-lite", "m-bar-10k", "m-switch-kit"],
    faq: [
      {
        question: "How is the M Bar 10K different from the M Switch?",
        answer: "The M Bar 10K is a whole-device disposable rated up to 10,000 puffs with a 600mAh rechargeable battery. The M Switch Kit keeps its body and only swaps the M Switch Pod cartridge, rated up to 15,000 puffs per pod.",
      },
      {
        question: "What pod does the M Switch Kit use?",
        answer: "The M Switch Pod, a 2.2mL prefilled cartridge that swaps straight in — no filling.",
      },
      {
        question: "How do I check a product is genuine?",
        answer: "Salthub products such as the M Bar and M Switch have a QR code and serial number on the box; check them on Salthub's official site at salthub.com/authenticate. Uwell products such as the Caliburn have a scratch-off strip on the box with a QR code and numeric code underneath; check them at myuwell.com/verify. If a product has a problem, claim within 7 days with an unboxing video; the shop replaces the same item or swaps to a model of the same price, with no cash refund, and replies within 3 business days.",
      },
    ],
  },
  {
    id: "understanding-mtl-vs-dtl",
    slug: "understanding-mtl-vs-dtl",
    title: "MTL vs. DTL: Understanding Draw Style",
    dek: "Mouth-to-lung and direct-to-lung draws feel completely different — here's what actually changes.",
    category: "how-it-works",
    readingTimeMin: 4,
    body: [
      {
        heading: "Mouth-to-lung (MTL)",
        paragraphs: [
          "What is the difference between MTL and DTL? In short: the path the vapor takes. An MTL (mouth-to-lung) draw pulls vapor into the mouth first, then to the lungs — closer to a cigarette's draw. It's typically paired with a tighter airflow restriction, a higher-resistance coil, and lower wattage.",
        ],
      },
      {
        heading: "Direct-to-lung (DTL) and the RDL middle ground",
        paragraphs: [
          "DTL draws pull vapor straight into the lungs, generally wanting a looser airflow, lower resistance, and more wattage. Many current pod devices target a middle ground often labeled RDL (restricted direct-lung) — looser than MTL but more restricted than a full DTL setup.",
          "How far to move wattage and airflow for each draw style is covered in [Choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: Storm / Waves / Custom modes on the Caliburn G4 Pro KOKO",
        paragraphs: [
          "The [Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) is a pod system with Storm / Waves / Custom (draw modes) selected on a 2\" touchscreen, with no physical buttons involved. Its verified spec lines: a 2000mAh built-in battery, 35W maximum output, and Pro-FOCS 4.0 flavor tuning.",
          "The modes are preset draw characters plus a Custom slot, running from a smooth, mild hit to a stronger, more robust one. It takes UWELL GPP pods and the older G3 pods.",
        ],
      },
      {
        heading: "A real example: a high-output device like the DRAG X3",
        paragraphs: [
          "The [DRAG X3](/products/drag-x3) is a pod kit with a 5–80W output range, a 0.1–3.0Ω resistance range, and a 1.66\" touchscreen. It has no built-in battery — it runs on a single 18650 or 21700 cell, which is not included in the box.",
          "The numbers to look at are the 80W ceiling and the 0.1Ω floor. How to read the rest of a spec table is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
          "The coil for the DRAG X3 is the VOOPOO PnP X coil, according to a retailer's compatibility list — not yet confirmed from VOOPOO's own pages.",
          "Know your draw style but not your device yet? Start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "Which coil fits the DRAG X3?",
        answer: "A retailer compatibility list names the VOOPOO PnP X coil for the DRAG X3; this is not yet confirmed from VOOPOO's own pages. The PnP X coil is not on our site right now — ask on LINE @okm24.",
      },
      {
        question: "What is the difference between MTL and RDL?",
        answer: "MTL pulls vapor into the mouth first, then the lungs, with tight airflow, higher resistance and lower wattage. RDL (restricted direct-lung) pulls straight to the lungs but with some restriction — looser than MTL, tighter than a full DTL setup.",
      },
      {
        question: "Which pod does the Caliburn G4 Pro KOKO use?",
        answer: "UWELL GPP pods, which come in four resistances: 0.4, 0.6, 0.9 and 1.2Ω. It also accepts the older Caliburn G3 pods. Source: UWELL's own G Pod Platform page.",
      },
    ],
    relatedProductSlugs: ["caliburn-g4-pro-koko", "drag-x3"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own explainer on
    // exactly this topic, owned by youtube.com/@OKMYARZ. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "_s48AaDCtf4", title: "MTL / RDL / DTL ต่างกันยังไง? แบบไหนเหมาะกับคุณ", channelName: "OKM YARZ", publishedAt: "2026-09-19" },
  },
  {
    id: "reading-a-spec-sheet",
    slug: "reading-a-spec-sheet",
    title: "How to Read a Device Spec Sheet",
    dek: "Battery mAh, wattage range, and resistance range — what each number actually tells you.",
    category: "buying-guide",
    readingTimeMin: 5,
    body: [
      {
        heading: "Battery capacity (mAh)",
        paragraphs: [
          "How do you read a pod spec sheet? Start with the line everyone asks about first: how long does the battery last. A larger mAh figure generally means longer runtime between charges at a given wattage, but actual runtime depends heavily on wattage, screen use, and how often the device fires — treat mAh as a comparison point between devices, not a fixed hours-of-use number.",
        ],
      },
      {
        heading: "Wattage range and resistance range",
        paragraphs: [
          "The wattage range shows how much output control you have; a wider range generally means more flexibility to tune draw strength. Resistance range (in ohms) tells you which coil pods a device supports — a lower resistance typically produces a more open, airier draw at higher wattage, and a higher resistance suits a tighter MTL draw at lower wattage.",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: the ARGUS G4 spec sheet, line by line",
        paragraphs: [
          "Take the spec table of the [ARGUS G4](/products/argus-g4) and read it one line at a time. Every number below is a verified line on its product page.",
        ],
        subsections: [
          {
            heading: "Battery and charging",
            paragraphs: [
              "A 1650mAh built-in battery, charged over USB-C at 5V/2A; the sheet says roughly 45 minutes to full. The mAh figure is for comparing with other devices — how many hours you get depends on the wattage you run and how often you fire. How to charge it properly is in [Battery care](/guides/battery-care-and-charging).",
            ],
          },
          {
            heading: "Wattage, voltage and resistance",
            paragraphs: [
              "A 5–35W output range, 3.2–4.2V output voltage and a 0.4–3.0Ω resistance range (how resistance and wattage shape the draw is in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl)). Where to set the wattage inside that range is in [Choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
            ],
          },
          {
            heading: "Screen and pod",
            paragraphs: [
              "A 0.85\" HD screen showing battery, wattage, resistance, lock state and puff count. The body is zinc alloy, leather and aluminum alloy. The pod line reads: ARGUS top-fill cartridge platform, multiple resistances — and that line is the one to keep reading about in the last section.",
            ],
          },
        ],
      },
      {
        heading: "What this catalog marks as unverified — a live example from the DRAG 6",
        paragraphs: [
          "Where an official spec couldn't be independently confirmed for a specific product page, it's labeled unverified rather than guessed — treat those fields as directional, not exact.",
          "A real case is the [DRAG 6](/products/drag-6) page. Its battery (4400mAh built-in, as two 2200mAh cells), 220W maximum output, GENE.TT 3.0 chip, SMART/RBA/TC-TCR (output modes) and 1.66\" TFT screen are all verified.",
          "The pod-platform line is marked unverified, because the exact name of the pod this device takes could not be confirmed from an official source — so the sheet only says it is a DRAG-series coil pod.",
          "What does exist is a retailer's compatibility list that names PnP X coils for the DRAG 6. That level of evidence is not enough for us to write it into the spec table as official, so the label stays as it is.",
        ],
      },
      {
        heading: "A wide resistance range does not always mean the pod is for sale",
        paragraphs: [
          "Back to the pod line on the ARGUS G4. The 0.4–3.0Ω range is wide, and the device takes ARGUS pods in several resistances — but right now our site has no ARGUS pods for sale. The ARGUS G4, ARGUS G4 mini, ARGUS P3 and ARGUS G3 mini have no compatible pod or coil in the catalog yet.",
          "Compare the Caliburn side, where the [GPP pod](/products/coil-94) is on the site and states exactly which devices it fits. The resistance range on a spec sheet is only half the answer; the other half is whether the pod you would put in it can actually be bought. Read those two lines together before choosing a device — or, if you have not started choosing yet, start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "How long does a pod battery last — can I tell from mAh?",
        answer: "Only as a comparison. A higher mAh usually lasts longer at the same wattage, but the hours depend on the wattage you set, screen use and how often you fire. We do not give a fixed hours figure for any model.",
      },
      {
        question: "Where can I buy ARGUS pods?",
        answer: "Not on our site right now. The ARGUS G4, G4 mini, P3 and G3 mini have no compatible pod in the catalog yet. Ask on LINE @okm24.",
      },
      {
        question: "What does the resistance range tell me?",
        answer: "Which pod or coil resistances the device supports. Lower resistance usually means an airier draw at higher wattage; higher resistance suits a tight MTL draw at lower wattage. A wide range does not mean every resistance is actually sold.",
      },
    ],
    relatedProductSlugs: ["argus-g4", "drag-6"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own clip on reading
    // coil resistance, owned by youtube.com/@OKM_24. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "uN9HRRx0R_s", title: "ค่าโอห์มคอยล์ดูยังไง? เลือกผิดฟีลพอตเปลี่ยนทันที", channelName: "OKAMI", publishedAt: "2026-08-23" },
  },
  {
    id: "coil-and-pod-maintenance",
    slug: "coil-and-pod-maintenance",
    title: "Coil & Pod Maintenance Basics",
    dek: "Simple habits that keep flavor consistent and extend coil life on an open-system pod.",
    category: "maintenance",
    readingTimeMin: 4,
    body: [
      {
        heading: "Priming a new pod",
        paragraphs: [
          "How long should a new pod sit before the first draw? There is no fixed number — let a freshly filled pod sit for several minutes before the first draw. That gives the coil's wicking material time to fully saturate, reducing the chance of a dry, burnt-tasting first few hits.",
        ],
      },
      {
        heading: "Signs a coil pod needs replacing",
        paragraphs: [
          "A harsher or burnt taste, reduced vapor production, or gurgling sounds are common signs a coil pod's wicking material is worn out and due for replacement — coils are a consumable part on any open-system device.",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "Which devices take the GPP pod",
        paragraphs: [
          "UWELL's GPP (G Pod Platform) pod is the top-fill pod shared across the current Caliburn line. According to UWELL's own pages it fits the Caliburn G5, G5 Lite, G5 Lite SE, G4 Pro, G4 Pro KOKO, G4, G4 Mini, G4 Classic, G3 Pro and G3 Pro KOKO.",
          "On our site that pod is the [GPP pod](/products/coil-94), in four resistances: 0.4, 0.6, 0.9 and 1.2Ω, mesh coils. The product name on the page reads “UWELL คอยล์ Caliburn G4&G3 Series”, but it fits the G5 line as well.",
          "One caution: the same Caliburn name does not mean the parts interchange. Caliburn G2-generation pods and GPP pods do not fit each other. If your device is a [Caliburn G5](/products/caliburn-g5), [Caliburn G3 Pro](/products/caliburn-g3-pro) or [Caliburn G4 Pro](/products/caliburn-g4-pro), GPP is the pod on the list above.",
        ],
      },
      {
        heading: "Why pods are something you buy again",
        paragraphs: [
          "Coils are a consumable part on any open-system device. The wicking material wears out with use, and once it does, the pod is replaced — that is the whole reason the pod is a repeat purchase.",
          "The box usually only includes some resistances. The Caliburn G3 Pro ships with two pods, a 0.4Ω and a 0.9Ω; other GPP resistances are sold separately.",
          "From our own counter: Caliburn G4 Pro customers come back for pods often. That is shop experience, not a manufacturer spec, but it reflects the real pattern — once you have picked a device, the next thing you spend on is the pod. Before buying a device, check that its pod can actually be bought.",
          "If you would rather have no pod to look after at all, compare the disposable side in [Open-system vs. disposable](/guides/open-system-vs-disposable) — or, with no device yet, start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "How long should a new pod sit before vaping?",
        answer: "We do not give a fixed number of minutes. Let it sit for several minutes after filling so the coil's wicking material saturates fully before the first draw, which avoids a burnt taste.",
      },
      {
        question: "When should I replace the coil?",
        answer: "When the taste turns harsh or burnt, vapor drops, or you hear gurgling on the draw. Those three are the usual signs the wicking material is worn out.",
      },
      {
        question: "Which pods come in the Caliburn G3 Pro box?",
        answer: "Two pods: a 0.4Ω pod and a 0.9Ω pod, per the verified spec.",
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g3-pro", "caliburn-g4-pro"],
  },
  {
    id: "battery-care-and-charging",
    slug: "battery-care-and-charging",
    title: "Battery Care & Charging Basics",
    dek: "General care habits for built-in and external vape batteries.",
    category: "maintenance",
    readingTimeMin: 4,
    body: [
      {
        heading: "Built-in batteries",
        paragraphs: [
          "How should you charge a pod device? Start by knowing what you have: most current pod devices use a sealed, built-in battery charged over USB-C. Using the charging cable and rate the manufacturer specifies, and avoiding leaving a device on charge unattended for extended periods, are standard good-practice habits for any lithium-battery device.",
        ],
      },
      // Round SEO ข (2026-09-21): section + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: a full charge in about 45 minutes on the ARGUS G4",
        paragraphs: [
          "For the [ARGUS G4](/products/argus-g4), “the rate the manufacturer specifies” means USB-C at 5V/2A. Its verified spec says the 1650mAh built-in battery charges to full in about 45 minutes.",
          "That 45 minutes is the spec-sheet figure, not something we timed ourselves. How long a charge lasts afterwards depends on the wattage you set, screen use and how often you fire. How to compare mAh figures between models is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
      {
        heading: "External cells (18650 / 21700)",
        paragraphs: [
          "Devices that take a swappable external cell, like the [DRAG X3](/products/drag-x3), should be charged with a dedicated external charger when possible, and cells should be inspected for wrapper damage before use.",
          "The DRAG X3's verified spec: no built-in battery, a single 18650 or 21700 cell, and the cell is not included in the box — it is bought separately. The upside is that with a spare cell you swap and keep going while the other one charges.",
        ],
      },
    ],
    faq: [
      {
        question: "How long does a pod battery last?",
        answer: "There is no fixed number. A higher mAh usually lasts longer at the same wattage, but real runtime depends on the wattage you set, screen use and how often you fire. Use mAh to compare models, not as hours.",
      },
      {
        question: "Does the DRAG X3 come with an 18650 cell?",
        answer: "No. The DRAG X3 runs on a single 18650 or 21700 cell that is sold separately.",
      },
    ],
    relatedProductSlugs: ["drag-x3", "argus-g4"],
  },
  {
    id: "choosing-wattage-and-airflow",
    slug: "choosing-wattage-and-airflow",
    title: "Choosing Wattage & Airflow",
    dek: "How wattage and airflow interact to shape draw, flavor, and vapor volume.",
    category: "how-it-works",
    readingTimeMin: 5,
    body: [
      {
        heading: "They're not independent settings",
        paragraphs: [
          "What wattage should I set, and how far should the airflow be open? Those two questions get answered together. Opening the airflow on a device without raising wattage typically produces a cooler, thinner-feeling draw, while raising wattage without adjusting airflow can push a coil past its comfortable range. The two settings are usually tuned together, not in isolation.",
        ],
      },
      {
        heading: "A reasonable starting point",
        paragraphs: [
          "Starting near the middle of a device's wattage range with airflow mostly closed for MTL (or mostly open for DTL) gives a reasonable baseline to adjust from, rather than starting at either extreme. Not sure which draw style is yours? Read [MTL vs DTL](/guides/understanding-mtl-vs-dtl) first.",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: the Caliburn G3 Pro ships with two pod resistances",
        paragraphs: [
          "The [Caliburn G3 Pro](/products/caliburn-g3-pro) is a clear example of having both variables to work with: a 5–35W range, fully adjustable airflow, and two pods in the box — a 0.4Ω and a 0.9Ω.",
          "Following the section above: with the higher-resistance 0.9Ω pod, start mid-range with airflow nearly closed; with the lower-resistance 0.4Ω pod, start mid-range too but with the airflow further open, then move in small steps.",
          "The wraparound LCD shows the wattage the whole time, so you always know where you are.",
        ],
      },
      {
        heading: "A real example: the wide wattage range of the VINCI S",
        paragraphs: [
          "The [VINCI S](/products/vinci-s) is a pod kit with a wider 5–40W range, a 0.3–3.0Ω resistance range, a 4.5mL pod (2mL in TPD regions) filled from the top without removing it, and a 2000mAh built-in battery.",
          "A wide range gives you more room to adjust, but it also means the middle of this device's range is a different point from the middle of the Caliburn G3 Pro's. The starting point is the middle of the device in your hand, and before setting it, look at the wattage range and the resistance of the pod you have fitted together. How to read those two lines is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
    ],
    faq: [
      {
        question: "What wattage should I start at?",
        answer: "Near the middle of the range your device supports, then adjust. We do not give one fixed number because ranges differ — the Caliburn G3 Pro is 5–35W, the VINCI S 5–40W.",
      },
      {
        question: "Low resistance vs high resistance — what changes?",
        answer: "Lower resistance usually means an airier draw at higher wattage; higher resistance suits a tight MTL draw at lower wattage. The Caliburn G3 Pro ships with a 0.4Ω and a 0.9Ω pod in the box.",
      },
    ],
    relatedProductSlugs: ["caliburn-g3-pro", "vinci-s"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own clip on how
    // resistance changes the draw, owned by youtube.com/@OKMYARZ. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "cPYybXJ4zzA", title: "ค่าโอห์มต่างกัน ฟีลต่างกันยังไง?", channelName: "OKM YARZ", publishedAt: "2026-08-17" },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
