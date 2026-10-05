import type { ArticleReviewVideo, Guide } from "@/types/catalog";

/**
 * Section clips (owner 05/10: "เรามีคลิป Youtube ถ้ามีใส่คั่นไว้ในแต่ละหัวข้อด้วย"). Only the shop's own three channels
 * (@OKMYARZ · @OKM_24 · @PODSYSTEM-OKAMI-II); each clip sits under the one section whose subject is exactly its model.
 * Title / channel / upload date: the four already on product records were confirmed via YouTube oEmbed when they were
 * added (products/*.ts); G4 Pro KOKO read from YouTube's own player data on 2026-10-05 (videoDetails + microformat).
 * Searched 05/10 for Caliburn G5 / G4 / G4 Mini / G5 Lite / G4 Classic / G3 Pro clips on all three channels: none.
 */
export const SECTION_CLIPS = {
  caliburnG4Pro: { videoId: "Hpifl9weNTc", title: "หลังใช้งาน UWELL CALIBURN G4 PRO ตัวจบพร้อมระบบสัมผัส!", channelName: "OKM YARZ", publishedAt: "2026-08-14" },
  caliburnG4ProKoko: { videoId: "3-CrWMaLbUE", title: "UWELL CALIBURN G4 PRO KOKO พอตสุดล้ำพร้อมจอสัมผัส!", channelName: "OKM YARZ", publishedAt: "2026-03-07" },
  argusG4: { videoId: "eUdbZyvV4Y0", title: "หลังใช้งาน VOOPOO ARGUS G4 เปลี่ยนค่าโอห์มได้ในหัวเดียว!", channelName: "OKAMI", publishedAt: "2026-08-15" },
  mSwitch: { videoId: "DaJHk4e6_Y8", title: "30 วันกับ M SWITCH 15K เป็นยังไงบ้าง? (หัวรุ่นแรก)", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-12" },
  mBar9kSweets: { videoId: "SijUuq9qRpE", title: "M BAR 9K รวมกลิ่นสายขนม มีรสอะไรบ้าง? 2026", channelName: "OKAMI", publishedAt: "2026-08-19" },
} satisfies Record<string, ArticleReviewVideo>;

// Round SEO ข batch 4 (2026-09-21): publishedAt = the commit that first added all seven records
// (f29d7fc, 2026-08-29, read from git log — never invented). The modified date is no longer typed
// here — since round search-price batch 3 (2026-09-22) it is the last git commit touching this
// file / guides-copy.ts, read from src/data/content-dates.json (see src/lib/content-dates.ts).

/**
 * Round 10B (2026-09-24): articles that are written and checked but NOT public yet — the owner's
 * ruling D3 holds the UWELL/VOOPOO comparisons until the SEO_BASELINE read of 2026-10-05, because
 * their control pages are being measured. A held id is filtered out of `guides` below, and every
 * reader goes through `guides` / `getGuide` (the route's generateStaticParams, sitemap.ts, /guides,
 * the home teaser grid, article-relevance.ts' "อ่านต่อ" box), so a held article 404s, is not in the
 * sitemap and is linked from nowhere. To publish one: delete its id from this set — the one switch.
 * Guarded by src/lib/held-guides-contract-test.ts.
 */
// 2026-10-02: the owner released both D3-held comparisons (article round, cloud chat: "ได้ ปล่อยขึ้นเว็บเลย") — the set is
// empty, the switch stays for the next held article.
export const HELD_GUIDE_IDS: ReadonlySet<string> = new Set<string>([]);

const allGuides: Guide[] = [
  {
    id: "choosing-your-first-pod-system",
    slug: "choosing-your-first-pod-system",
    title: "Choosing Your First Pod System",
    dek: "A practical starting point for picking between open-system pods, pod kits, and disposables.",
    category: "getting-started",
    readingTimeMin: 6,
    publishedAt: "2026-08-29",
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
          "The [Caliburn G5](/products/caliburn-g5) is the current Caliburn flagship: a 1600mAh battery, 5–35W output, a 0.85-inch colour screen and a top-fill pod.",
          "There is no row of buttons for switching modes — a Smart Triple-Tap gesture sensor handles mode switching and status readout instead.",
          "How the tap control works, and why it needs a screen alongside it, is in [Gesture & Triple-Tap Control](/technology/gesture-and-triple-tap-control).",
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
          "The [M Bar 9K](/products/m-bar-9k) is a disposable with adjustable airflow — so you don't have to settle your draw style before buying.",
          "It comes prefilled with 30mg nicotine-salt e-liquid, rated up to 9,000 puffs, with a 600mAh battery that recharges over USB-C. No filling, no coil changes.",
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
    publishedAt: "2026-08-29",
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
          "The [M Bar 10K](/products/m-bar-10k) is a disposable that recharges over USB-C: a 600mAh battery, rated up to 10,000 puffs, on a cotton mesh coil. When the battery runs down you charge it rather than discarding it with e-liquid still inside.",
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
          "The [M Switch Kit](/products/m-switch-kit) is a device body you keep and recharge over USB-C; the e-liquid comes in prefilled swap-in cartridges rated up to 15,000 puffs each. No bottled e-liquid, no filling.",
          "The cartridge is the [M Switch Pod](/products/m-switch-pod): prefilled, made for the M Switch Kit. When it runs out you swap in a new pod and the body stays.",
          "Compared with an M Bar 10K, where the whole device is discarded, an M Switch discards only the pod — the same simplicity (no filling, no coil changes) with less waste per swap. Still undecided on the format? Start again from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
        video: SECTION_CLIPS.mSwitch,
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
        answer: "The M Switch Pod, a prefilled cartridge that swaps straight in — no filling.",
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
    publishedAt: "2026-08-29",
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
          "What an onboard touchscreen can do, and what it costs, is in [Onboard Touch Displays](/technology/onboard-touch-displays).",
        ],
        video: SECTION_CLIPS.caliburnG4ProKoko,
      },
      {
        heading: "A real example: a high-output device like the DRAG X3",
        paragraphs: [
          "The [DRAG X3](/products/drag-x3) is a pod kit with a 5–80W output range, a 0.1–3.0Ω resistance range, and a 1.66\" touchscreen. It has no built-in battery — it runs on a single 18650 or 21700 cell, which is not included in the box.",
          "The numbers to look at are the 80W ceiling and the 0.1Ω floor. How to read the rest of a spec table is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
          "The DRAG X3 uses VOOPOO's PnP X coils — VOOPOO's own DRAG X3 page says it takes every one of them.",
          "Know your draw style but not your device yet? Start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "Which coil fits the DRAG X3?",
        answer: "Every PnP X coil, according to VOOPOO's own DRAG X3 page. PnP X coils are not on our site right now — ask on LINE @okm24.",
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
    publishedAt: "2026-08-29",
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
              "What one pod shape in several resistances means is in [Multi-Resistance Cartridges](/technology/multi-resistance-cartridges).",
            ],
          },
        ],
        video: SECTION_CLIPS.argusG4,
      },
      {
        heading: "Rows we mark unverified — how the DRAG 6's coil row moved to verified",
        paragraphs: [
          "When a spec can't be confirmed from the maker's own pages, we mark the row unverified and keep it off the product page.",
          "The [DRAG 6](/products/drag-6) shows how a row can change. Its battery (4400mAh built in, from two 2200mAh cells), 220W maximum output, GENE.TT 3.0 chip, SMART/RBA/TC-TCR modes and 1.66\" TFT screen were confirmed from the start.",
          "What the GENE.TT chip does in a high-output device is in [High-Output Chip Platforms](/technology/high-output-chip-platforms).",
          "For a while the coil row was held back. A retailer's compatibility list named PnP X coils for the DRAG 6, but we only print a spec as official when it comes from the maker.",
          "VOOPOO's own DRAG 6 page now settles it: the UFORCE-X Tank II in the kit takes every PnP X coil, and PnP X 0.15Ω and 0.3Ω coils come in the box. The row is verified and now shows on the product page.",
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
        answer: "Only as a comparison. A higher mAh usually lasts longer at the same wattage, but the hours depend on the wattage you set, screen use and how often you fire.",
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
    publishedAt: "2026-08-29",
    // Round "clip" (2026-09-27): ranks #4 on page 1 for "คอยล์พอต" (docs/SEO_LANDSCAPE.md §4), @OKMYARZ. A general
    // coil-care clip (no model named in its title or description). Title and upload date read from YouTube's own data.
    reviewVideo: { videoId: "f86AJRNHX4U", title: "ทำไมคอยล์พอตถึงพังไว? แล้วทำยังไงให้ใช้ได้นาน", channelName: "OKM YARZ", publishedAt: "2025-03-03" },
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
          "On our site that pod is the [GPP pod](/products/coil-94), in four resistances: 0.4, 0.6, 0.9 and 1.2Ω, mesh coils. The product name on the page reads “UWELL Coil Caliburn G4&G3 Series” (written in Thai there), but it fits the G5 line as well.",
          "How a mesh coil differs from round wire is in [Mesh Coil Systems](/technology/mesh-coil-systems).",
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
        answer: "There is no fixed number of minutes. Let it sit for several minutes after filling so the coil's wicking material saturates fully before the first draw, which avoids a burnt taste.",
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
    publishedAt: "2026-08-29",
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
    publishedAt: "2026-08-29",
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
        answer: "Near the middle of the range your device supports, then adjust. There is no one number for every device, because ranges differ — the Caliburn G3 Pro is 5–35W, the VINCI S 5–40W.",
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
  {
    // Round 10B T03' — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // "NEW" on Zapple + Kyoho Grape: SALTHUB's own M Bar 9K poster https://www.salthub.com/wp-content/uploads/2025/08/m_bar_9k_06.webp
    // (re-checked in a real browser 2026-09-24, owner fix C).
    id: "choosing-a-marbo-flavor",
    slug: "choosing-a-marbo-flavor",
    title: "Marbo กลิ่นไหนดี เลือกกลิ่น M Bar 9K 10K และ M Switch",
    dek: "ไม่มีคำตอบเดียว เริ่มจากสายที่ชอบ เย็น องุ่น ผลไม้ หรือแนวอื่น แล้วดูว่ารุ่นไหนมีกลิ่นนั้น รวมรายชื่อกลิ่น M Bar 9K 10K และ M Switch Pod",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "เลือกสายที่ชอบก่อน แล้วค่อยดูรุ่น",
        paragraphs: [
          "Marbo กลิ่นไหนดี ไม่มีคำตอบเดียว อยู่ที่ว่าชอบแนวไหน เริ่มจากเลือกสายก่อน เย็น องุ่น ผลไม้ หรือแนวอื่น แล้วค่อยดูว่ารุ่นที่ใช้อยู่มีกลิ่นไหนในสายนั้น ที่ร้านเองก็มีหลายกลิ่นที่ลูกค้าชอบ",
          "กลุ่มในบทความนี้แบ่งจากคำในชื่อกลิ่น ชื่อที่มี Ice · Mint · Menthol · Blast หรือ Freeze อยู่สายเย็น ชื่อที่มี Grape อยู่สายองุ่น ชื่อผลไม้อื่น ๆ อยู่สายผลไม้ ที่เหลือเป็นแนวอื่น",
          "Marbo คือชื่อที่หลายร้านในไทยใช้เรียก M Bar กับ M Switch ของ SALTHUB เรื่องชื่อนี้อ่านต่อได้ที่ [Marbo กับ M Bar ต่างกันไหม](/faq) ส่วนบนเว็บเรา [M Bar 9K](/products/m-bar-9k) มี 22 กลิ่น [M Bar 10K](/products/m-bar-10k) มี 12 กลิ่น และหัวพอต [M Switch Pod](/products/m-switch-pod) มี 18 กลิ่น กลิ่นไหนมีของตอนนี้ ทักไลน์ @okm24 ถามได้",
          "ถ้าใช้ M Switch กลิ่นอยู่ที่หัวพอต ส่วนตัวเครื่อง [M Switch Kit](/products/m-switch-kit) ใช้ตัวเดิม อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัว",
        ],
      },
      {
        heading: "สายเย็น: ชื่อที่มี Ice · Mint · Menthol · Blast · Freeze",
        paragraphs: [
          "กลิ่นเย็นเป็นสายที่ลูกค้าที่ร้านถามถึงบ่อย สายนี้รวมทุกชื่อที่มีคำสื่อถึงความเย็น แยกตามรุ่นไว้ข้างล่าง",
          "ชื่อที่มีทั้งผลไม้และคำที่สื่อถึงความเย็น เช่น Watermelon Mint เราจัดไว้สายนี้",
          "M Bar 9K (3 กลิ่น): Blue Ice · Doublemint · Menthol Freeze",
          "M Bar 10K (4 กลิ่น): Blue Ice · Menthol Blast · Watermelon Mint · Yellow Mint",
          "M Switch Pod (2 กลิ่น): Blue Ice · Doublemint",
        ],
      },
      {
        heading: "สายองุ่น: ชื่อที่มี Grape",
        paragraphs: [
          "องุ่นเป็นอีกกลิ่นที่ลูกค้าที่ร้านถามถึงบ่อย ทั้งสามรุ่นมีกลิ่นองุ่นมากกว่าหนึ่งแบบ ชื่อที่มี Grape คู่กับอย่างอื่น เช่น Grape Aloe หรือ Grape Lychee เราจัดไว้สายนี้",
          "M Bar 9K (4 กลิ่น): Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
          "M Bar 10K (2 กลิ่น): Grape · Kyoho Grape",
          "M Switch Pod (4 กลิ่น): Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
        ],
      },
      {
        heading: "สายผลไม้",
        paragraphs: [
          "ชื่อที่เป็นผลไม้ และไม่มีคำที่สื่อถึงความเย็นหรือ Grape อยู่ในกลุ่มนี้ รวมถึงชื่อที่มีผลไม้คู่กับขนมหรือเครื่องดื่ม อย่าง Watermelon Bubblegum กับ Strawberry Milkshake",
          "M Bar 9K (11 กลิ่น): Apple Aloe · Mixberry · Orange Sour · Peach · Peach Strawberry · Pink Berry · Sparkling Lemon · Strawberry · Strawberry Milkshake · Watermelon · Watermelon Bubblegum",
          "M Bar 10K (4 กลิ่น): All Berry · Pink Berry · Strawberry Kiwi · Watermelon",
          "M Switch Pod (10 กลิ่น): Apple Aloe · Black Berry · Mango Passion · Mixberry · Peach Strawberry · Pink Berry · Strawberry · Strawberry Watermelon · Watermelon · Watermelon Bubblegum",
        ],
      },
      {
        heading: "แนวอื่น",
        paragraphs: [
          "ชื่อที่ไม่ได้บอกผลไม้หรือความเย็นตรง ๆ เช่น Cola · Matcha Latte · Rainbow Candy ส่วน Zapple ชื่อไม่ได้บอกว่ารสอะไร เราจึงจัดไว้ตรงนี้",
          "M Bar 9K (4 กลิ่น): Cola · Rainbow Candy · Sour Gummy · Zapple",
          "M Bar 10K (2 กลิ่น): Cola · Matcha Latte",
          "M Switch Pod (1 กลิ่น): Cola",
        ],
        video: SECTION_CLIPS.mBar9kSweets,
      },
      {
        heading: "กลิ่นที่คนค้นหา และกลิ่นใหม่ของ M Bar 9K",
        paragraphs: [
          "เวลาพิมพ์ “marbo กลิ่น” ใน Google คำที่ขึ้นมาให้เลือกมี Zapple · แตงโม (Watermelon) · แอปเปิ้ล (Apple Aloe) · Blue Ice · องุ่น (Grape) และส้ม (Orange Sour) แตงโม Blue Ice และองุ่นมีทั้งสามรุ่น Apple Aloe มีใน M Bar 9K กับ M Switch Pod ส่วน Zapple กับส้มมีเฉพาะ M Bar 9K",
          "Zapple กับ Kyoho Grape เป็นสองกลิ่นที่ SALTHUB ติดป้ายว่าใหม่บนโปสเตอร์ของ M Bar 9K",
          "ยังไม่ได้เลือกว่าจะเอาพอตใช้แล้วทิ้งหรือ M Switch อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) อยากรู้ว่าหนึ่งเครื่องใช้ได้นานแค่ไหน อ่าน [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ส่วนรุ่นอื่นของแบรนด์อยู่ที่ [หน้าแบรนด์ SALTHUB](/brands/salthub)",
        ],
      },
    ],
    relatedProductSlugs: ["m-bar-9k", "m-switch-pod"],
    faq: [
      {
        question: "Marbo กลิ่นไหนเย็น",
        answer: "กลิ่นสายเย็นดูได้จากชื่อที่มีคำสื่อถึงความเย็น M Bar 9K มี Blue Ice · Doublemint · Menthol Freeze ส่วน M Bar 10K มี Blue Ice · Menthol Blast · Watermelon Mint · Yellow Mint และ M Switch Pod มี Blue Ice · Doublemint",
      },
      {
        question: "Marbo กลิ่นองุ่นมีแบบไหนบ้าง",
        answer: "M Bar 9K มี Grape · Grape Aloe · Grape Lychee · Kyoho Grape ส่วน M Bar 10K มี Grape · Kyoho Grape และ M Switch Pod มี Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
      },
      {
        question: "Marbo กลิ่นส้มมีไหม",
        answer: "มี Orange Sour ใน M Bar 9K ส่วน M Bar 10K กับ M Switch Pod ไม่มีกลิ่นที่ชื่อเป็นส้ม",
      },
      {
        question: "หัว M Switch กับ M Bar กลิ่นเหมือนกันไหม",
        answer: "ชื่อซ้ำกันหลายกลิ่น เช่น Blue Ice · Cola · Grape · Kyoho Grape · Watermelon แต่เราเทียบได้แค่ชื่อ ไม่ได้เทียบรส บางกลิ่นมีเฉพาะหัว M Switch เช่น Black Berry · Mango Passion · Strawberry Watermelon",
      },
    ],
    // Round "clip" (2026-09-27, owner: this clip only — it replaces QptFMwIXbJE "M BAR 9K NEW FLAVOR 2" of round 10B):
    // the shop's most-watched clip (54K views, @PODSYSTEM-OKAMI-II), the top 5 M BAR 9K flavors, paired with "marbo
    // กลิ่นไหนดี" (docs/SEO_LANDSCAPE.md §4 item 1). Title and upload date read from YouTube's own video data.
    reviewVideo: { videoId: "-DMIKvoQPw8", title: "TOP 5 กลิ่นยอดนิยม ฮิตที่สุดของ MARBO BAR 9K DISPOSABLE POD", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-01-31" },
  },
  {
    // Round 10B T18 — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md.
    // Owner ruling: no number of days anywhere, in any form. The "puffs not reached" complaint sits with the other two
    // complaints, away from the "brands don't publish how puffs are counted" sentence, so it never reads as a cause.
    // Owner fix C (2026-09-24, real browser): M Bar 10K Eco/Soft/Boost + double click = SALTHUB posters
    // https://img.salthub.com/mbar10k/MBar10K_03.webp and MBar10K_04.webp ("DOUBLE CLICK BOTTOM BUTTON, SWITCH 3 MODES
    // (ECO/SOFT/BOOST)"). M Bar 9K airflow: salthub.com home says only "Adjustable Airflow" — the "MTL to DTL" range had
    // no SALTHUB source (reseller pages only) and was cut.
    id: "how-long-a-disposable-lasts",
    slug: "how-long-a-disposable-lasts",
    title: "พอตใช้แล้วทิ้ง 1 ตัว ใช้ได้กี่วัน",
    dek: "ไม่มีจำนวนวันตายตัว แล้วแต่คน สูบจัดก็หมดไวหน่อย ส่วนตัวเลขบนกล่อง เช่น M Bar 9K (Marbo) สูงสุด 9,000 พัฟ เป็นจำนวนพัฟ แปลงเป็นวันไม่ได้",
    category: "how-it-works",
    readingTimeMin: 5,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "ใช้ได้กี่วัน ไม่มีตัวเลขตายตัว",
        paragraphs: [
          "พอตใช้แล้วทิ้ง 1 ตัวใช้ได้กี่วัน ตอบตรง ๆ คือไม่มีตัวเลขตายตัว แล้วแต่คน สูบจัดก็หมดไวหน่อย รุ่นเดียวกันแต่คนละคนใช้ ก็หมดไม่พร้อมกัน",
          "ถามว่า “Marbo 9K ใช้ได้กี่วัน” ก็คำตอบเดียวกัน [M Bar 9K](/products/m-bar-9k) ที่หลายร้านในไทยเรียกว่า Marbo ระบุไว้สูงสุด 9,000 พัฟ ส่วน [M Bar 10K](/products/m-bar-10k) สูงสุด 10,000 พัฟ ตัวเลขนี้คือจำนวนพัฟ ไม่ใช่จำนวนวัน และเอาไปหารเป็นวันไม่ได้",
        ],
      },
      {
        heading: "ทำไมแต่ละคนหมดไม่เท่ากัน",
        paragraphs: [
          "ตัวแปรหลักคือวิธีสูบของแต่ละคน สูบถี่แค่ไหน และแต่ละพัฟดูดยาวแค่ไหน",
          "อีกเรื่องคือบางรุ่นตั้งค่าได้ M Bar 9K ปรับช่องลมได้ ส่วน M Bar 10K มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ",
          "การตั้งค่าเปลี่ยนความรู้สึกตอนสูบ และแต่ละคนก็ตั้งไม่เหมือนกัน",
        ],
      },
      {
        heading: "ตัวเลขพัฟบนกล่อง อ่านยังไง",
        paragraphs: [
          "ตัวเลขบนกล่องคือจำนวนพัฟที่ผู้ผลิตระบุ อย่าง [RELX Smash Go 12K](/products/relx-smash-go-12k) ระบุไว้สูงสุด 12,000 พัฟ ส่วน [Joiway F3](/products/joiway-f3) ระบุไว้ 12,000 พัฟขึ้นไป จะสูบได้ใกล้ตัวเลขนั้นแค่ไหน ขึ้นกับวิธีสูบของแต่ละคนตามหัวข้อข้างบน",
        ],
      },
      {
        heading: "แบตหมด หรือเริ่มไหม้ ทำยังไงต่อ",
        paragraphs: [
          "M Bar 9K กับ M Bar 10K ชาร์จซ้ำได้ผ่าน USB-C แบตหมดก็ชาร์จต่อ วิธีชาร์จให้ถูกอยู่ที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging)",
          "เรื่องที่ลูกค้าบ่นกับร้านบ่อยมีสามเรื่อง แบต ไหม้ไว และได้จำนวนพัฟไม่ถึงที่กำหนด ถ้าเครื่องเริ่มมีกลิ่นไหม้ ดูดไม่ขึ้น หรือไฟกะพริบ ไล่เช็คได้ที่ [พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง](/guides/fixing-no-draw-and-blinking-light)",
        ],
      },
      {
        heading: "จุดเด่นของพอตใช้แล้วทิ้ง",
        paragraphs: [
          "จากที่ร้านเห็น พอตใช้แล้วทิ้งเด่นที่ใช้ง่าย แกะแล้วใช้ได้เลย ไม่ต้องเติมน้ำยา ไม่ต้องเปลี่ยนคอยล์ ดูรุ่นทั้งหมดได้ที่ [พอตใช้แล้วทิ้ง](/products/disposables)",
          "ถ้าอยากเก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอต อ่านต่อที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
        ],
      },
    ],
    relatedProductSlugs: ["m-bar-9k", "joiway-f3", "relx-smash-go-12k"],
    faq: [
      {
        question: "Marbo 9K สูบได้กี่วัน",
        answer: "ไม่มีจำนวนวันตายตัว แล้วแต่คน สูบจัดก็หมดไวหน่อย M Bar 9K (ที่หลายร้านเรียก Marbo 9K) ระบุไว้สูงสุด 9,000 พัฟ ตัวเลขนี้คือพัฟ ไม่ใช่วัน",
      },
      {
        question: "9,000 พัฟ ใช้ได้กี่วัน",
        answer: "คิดเป็นวันไม่ได้ 9,000 พัฟคือจำนวนสูงสุดที่ผู้ผลิตระบุ ส่วนจะหมดในกี่วัน ขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหน",
      },
      {
        question: "พอตใช้แล้วทิ้งแบตหมด แต่น้ำยายังเหลือ ทำไง",
        answer: "ถ้าเป็นรุ่นที่ชาร์จซ้ำได้อย่าง M Bar 9K กับ M Bar 10K ชาร์จผ่าน USB-C แล้วใช้ต่อได้ ไม่ต้องทิ้งทั้งที่น้ำยายังเหลือ",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKMYARZ.
    reviewVideo: { videoId: "rqT2MGZi8Tw", title: "พอตใช้แล้วทิ้ง 1 ตัวใช้ได้นานแค่ไหน?", channelName: "OKM YARZ", publishedAt: "2025-03-17" },
  },
  {
    // Round 10B T19 — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // Owner fix A (2026-09-24): no M Switch Pod capacity — salthub.com states "E-liquid Capacity: 2.2mL" only under M BAR POD
    // and ZERO CARTRIDGE (_incoming/round10b/salthub-mswitch-check.md). 600mAh: M Bar 9K = salthub.com home "Battery
    // Capacity: 600mAh"; M Bar 10K = SALTHUB poster https://img.salthub.com/mbar10k/MBar10K_01.webp ("600 MAH").
    id: "disposable-vs-switch-pod",
    slug: "disposable-vs-switch-pod",
    title: "พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว เลือกแบบไหนดี",
    dek: "ไม่มีกฎตายตัว แล้วแต่ความชอบ อยากแกะแล้วใช้ได้เลย หมดแล้วทิ้ง หรืออยากเก็บตัวเครื่องไว้ เปลี่ยนแค่หัวพอต เลือกตามวิธีใช้ของคุณ",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว เลือกยังไง",
        paragraphs: [
          "ไม่มีกฎตายตัว แล้วแต่ความชอบ ที่ร้านมีลูกค้าเลือกทั้งสองแบบ ถ้าอยากแกะแล้วใช้ได้เลย หมดแล้วทิ้ง ไปทางพอตใช้แล้วทิ้ง ถ้าอยากเก็บตัวเครื่องไว้ชาร์จใช้ต่อ เปลี่ยนแค่หัวพอต ไปทางพอตเปลี่ยนหัว",
          "พอตเปลี่ยนหัวคือพอตที่เก็บตัวเครื่องไว้ใช้ซ้ำ แล้วเสียบหัวพอตบรรจุสำเร็จ หมดก็ถอดเปลี่ยนหัวใหม่ บนเว็บเราเรียกแบบนี้ว่าเครื่องระบบสวิตช์ ตัวอย่างคือ [M Switch Kit](/products/m-switch-kit) กับหัวพอต [M Switch Pod](/products/m-switch-pod)",
          "สองแบบนี้ไม่ต้องเติมน้ำยาเองทั้งคู่ ถ้ากำลังชั่งระหว่างพอตใช้แล้วทิ้งกับพอตที่เติมน้ำยาเอง อ่าน [พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม](/guides/open-system-vs-disposable)",
        ],
      },
      {
        heading: "“คุ้ม” ขึ้นกับอะไร",
        paragraphs: ["ความคุ้มขึ้นกับวิธีใช้ของแต่ละคน ลองดูสี่เรื่องนี้ว่าตรงกับตัวเองแค่ไหน"],
        subsections: [
          {
            heading: "ใช้ต่อเนื่อง หรือแค่อยากลอง",
            paragraphs: ["แค่อยากลอง พอตใช้แล้วทิ้งไม่ต้องมีอะไรก่อน แกะแล้วใช้ได้เลย หมดแล้วทิ้ง ถ้าจะใช้ต่อเนื่อง พอตเปลี่ยนหัวต้องมีตัวเครื่อง M Switch Kit ก่อน จากนั้นใช้แค่หัว M Switch Pod ไปเรื่อย ๆ ตัวเครื่องใช้ตัวเดิม"],
          },
          {
            heading: "เปลี่ยนกลิ่นบ่อยแค่ไหน",
            paragraphs: ["พอตใช้แล้วทิ้งหนึ่งเครื่องคือหนึ่งกลิ่น พอตเปลี่ยนหัวหนึ่งหัวคือหนึ่งกลิ่น เปลี่ยนหัวก็เปลี่ยนกลิ่น ไม่ต้องเปลี่ยนทั้งเครื่อง กลิ่นของแต่ละรุ่นดูได้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)"],
          },
          {
            heading: "ทิ้งทั้งเครื่อง หรือทิ้งแค่หัว",
            paragraphs: ["พอตใช้แล้วทิ้งอย่าง [M Bar 9K](/products/m-bar-9k) กับ [M Bar 10K](/products/m-bar-10k) พอน้ำยาหมดก็ทิ้งทั้งเครื่อง พอตเปลี่ยนหัวทิ้งแค่หัว ขยะต่อครั้งจึงน้อยกว่า"],
          },
          {
            heading: "แบตหมดไม่ได้แปลว่าต้องทิ้ง",
            paragraphs: ["M Bar 9K กับ M Bar 10K แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C แบตหมดก็ชาร์จต่อ ไม่ต้องทิ้งทั้งที่น้ำยายังเหลือ เรื่องชาร์จเลยไม่ใช่จุดที่ต่าง จุดที่ต่างคือตอนน้ำยาหมด พอตใช้แล้วทิ้งต้องทิ้งทั้งเครื่อง ส่วนพอตเปลี่ยนหัวเก็บตัวเครื่องไว้ใช้ต่อ"],
          },
        ],
      },
      {
        heading: "เรื่องที่ลูกค้าที่ร้านบ่นบ่อย",
        paragraphs: [
          "มีสามเรื่อง แบต ไหม้ไว และจำนวนพัฟไม่ถึงที่กำหนด",
          "เรื่องแบต ดูก่อนว่าเครื่องชาร์จซ้ำได้ไหม M Bar 9K · M Bar 10K และตัวเครื่อง M Switch ชาร์จผ่าน USB-C ได้ทั้งสามตัว วิธีชาร์จให้ถูกอยู่ที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging)",
          "เรื่องไหม้ไว ถ้าเริ่มมีกลิ่นไหม้หรือรสไม่มา ไล่เช็คได้ที่ [พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง](/guides/fixing-no-draw-and-blinking-light) ส่วนเรื่องพัฟ อ่านวิธีดูตัวเลขพัฟบนกล่องได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
      },
      {
        heading: "Marbo M Switch ดีไหม",
        paragraphs: [
          "ดีไหมอยู่ที่ว่าอยากได้อะไรจากพอตเปลี่ยนหัว M Switch เป็นของ SALTHUB ตระกูลเดียวกับ M Bar ที่หลายร้านเรียกรวมกันว่า Marbo ใช้ง่ายเท่าพอตใช้แล้วทิ้ง ไม่ต้องเติมน้ำยา ไม่ต้องเปลี่ยนคอยล์",
          "M Switch Pod หัวละสูงสุด 15,000 พัฟ ส่วน M Bar 10K สูงสุด 10,000 พัฟ และ M Bar 9K สูงสุด 9,000 พัฟต่อเครื่อง",
          "ถ้ากำลังเทียบ M Switch กับเครื่องระบบสวิตช์ยี่ห้ออื่น อ่าน [Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch) ดูพอตใช้แล้วทิ้งรุ่นอื่นบนเว็บได้ที่ [หมวดพอตใช้แล้วทิ้ง](/products/disposables)",
        ],
        video: SECTION_CLIPS.mSwitch,
      },
    ],
    relatedProductSlugs: ["m-bar-10k", "m-switch-kit"],
    faq: [
      {
        question: "พอตเปลี่ยนหัว ต้องเติมน้ำยาเองไหม",
        answer: "ไม่ต้อง หัวพอตอย่าง M Switch Pod บรรจุสำเร็จ หมดก็ถอดเปลี่ยนหัวใหม่ ตัวเครื่องใช้ตัวเดิม",
      },
      {
        question: "หัว M Switch ใช้กับเครื่องไหนได้บ้าง",
        answer: "ใช้กับตัวเครื่อง M Switch Kit ของ SALTHUB",
      },
      {
        question: "พอตใช้แล้วทิ้งชาร์จได้ไหม",
        answer: "แล้วแต่รุ่น M Bar 9K กับ M Bar 10K แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C รุ่นอื่นดูได้ในตารางสเปกของรุ่นนั้น",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKM_24.
    reviewVideo: { videoId: "8_3DPJM4RFA", title: "M BAR 10K & M SWITCH 15K เล็กฟัดใหญ่!", channelName: "OKAMI", publishedAt: "2026-05-09" },
  },
  {
    // Round 10B T21 — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. The
    // UWELL manuals cited are © Shenzhen Uwell, read from copies hosted by retailer thebestvape.com (researcher-B-result.md)
    // — named "คู่มือของ UWELL", never "เว็บทางการ". Caliburn G5 is named without a link: it is an SEO_BASELINE control page
    // until 2026-10-05. "Change it" is the customer replacing the unit/pod — never a claim or warranty (owner, round 10B).
    // Owner fixes B + C (2026-09-24): G4 Mini lights = UWELL manual copy https://manuals.plus/caliburn/kpn025-g4-mini-kit-manual
    // ("During vaping … green … above 60%" / charging: flashing red/blue/green = low/medium/sufficient, green stays on when
    // full). Caliburn G4 Pro icon list cut: its only source was a retailer-hosted PDF, and the manuals.plus manual found is
    // for the G4 Pro KOKO — a separate product on this site, with different screen text.
    // Data round (2026-09-24, real browser — _incoming/round-data/sources-verified.md): G4 facts = manuals.plus
    // /m/50a2d62de82f0d181197e7dbdeac724ade1b398ab848d04aaa7b7cec543ee424 (screen messages, "Over 8s!", 5V/2A) · G5 =
    // /m/5709a095303c89dbb3fe992bd7b3cf31ba928aba1ad3f284fbfdc84d4b5fc06d ("OVER 6S", 5V/2A). Cut: "5V/2A" as a rule for
    // every Caliburn (the G4 Mini manual says 5V/1A) and "8 seconds" for the G4 Mini (its manual copy is garbled there).
    id: "fixing-no-draw-and-blinking-light",
    slug: "fixing-no-draw-and-blinking-light",
    title: "พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง",
    dek: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกหรือยัง แล้วชาร์จแบต เสียบหัวพอตให้เข้าที่ และดูว่าไฟหรือข้อความบนจอแปลว่าอะไร",
    category: "maintenance",
    readingTimeMin: 8,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "เช็คอย่างแรก: แกะพลาสติกที่ก้นพอตหรือยัง",
        paragraphs: [
          "พอตดูดไม่ขึ้น แก้ยังไง ที่ร้านเราให้เช็คอย่างแรกคือแกะพลาสติกที่ก้นพอตออกหรือยัง ถ้ายังไม่ได้แกะ แกะออกแล้วลองสูบใหม่",
          "แกะแล้วยังดูดไม่ขึ้น ไล่ต่อตามหัวข้อถัดไป ข้อไหนมาจากคู่มือผู้ผลิต เราบอกไว้ว่ามาจากคู่มือของใคร",
        ],
      },
      {
        heading: "ไล่เช็คต่ออีก 4 ข้อ",
        paragraphs: [],
        subsections: [
          {
            heading: "ชาร์จแบตก่อน",
            paragraphs: ["พอแบตต่ำ Caliburn จะขึ้นเตือนแล้วหยุดจ่ายไฟ ตามคู่มือของ UWELL ให้ชาร์จด้วยสาย USB-C ส่วน [M Bar 9K](/products/m-bar-9k) · [M Bar 10K](/products/m-bar-10k) และ [M Switch Kit](/products/m-switch-kit) ก็ชาร์จผ่าน USB-C เหมือนกัน"],
          },
          {
            heading: "ถอดหัวพอตแล้วเสียบใหม่ให้เข้าที่",
            paragraphs: ["ตามคู่มือของ UWELL ถ้าเครื่องไม่เจอหัวพอต Caliburn G4 จะขึ้น No Atomizer ส่วน G4 Mini จะกะพริบไฟน้ำเงิน 3 ครั้ง แปลว่าหัวพอตเสียบไม่เข้าที่ ถอดออกแล้วเสียบกลับให้แน่น เครื่องที่ใช้หัวพอต เช่น M Switch ก็ลองแบบเดียวกันได้"],
          },
          {
            heading: "อย่าดูดค้างนาน",
            paragraphs: ["Caliburn ตัดไฟเองถ้าดูดค้างนานเกินไป คู่มือของ UWELL บอกว่า G4 ตัดเมื่อเกิน 8 วินาที ส่วน G5 เมื่อเกิน 6 วินาที หยุดดูดก่อนแล้วค่อยสูบใหม่"],
          },
          {
            heading: "หัวพอตใหม่ ให้น้ำยาซึมก่อนสูบ",
            paragraphs: ["ถ้าเป็นพอตซิสเต็มที่เพิ่งเติมน้ำยาลงหัวพอตใหม่ รีบสูบทันทีอาจได้รสไหม้ วิธีเตรียมหัวพอตใหม่อยู่ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)"],
          },
        ],
      },
      {
        heading: "ไฟกะพริบแบบไหน แปลว่าอะไร (Caliburn)",
        paragraphs: ["ไฟหรือข้อความบนจอของแต่ละรุ่นแปลไม่เหมือนกัน ความหมายของตระกูล Caliburn ข้างล่างนี้มาจากคู่มือของ UWELL ทั้งหมด"],
        subsections: [
          {
            heading: "Caliburn G4 Mini ดูจากสีไฟ",
            paragraphs: [
              "[Caliburn G4 Mini](/products/caliburn-g4-mini) ไม่มีจอ บอกสถานะด้วยสีไฟกับจำนวนครั้งที่กะพริบ ไฟแดงกะพริบ 3 ครั้งตอนสูบ คือหัวพอตช็อต ไฟแดงกะพริบ 10 ครั้ง คือแบตต่ำ ไฟเขียวกะพริบ 5 ครั้ง คือดูดค้างนานเกินไป",
              "ไฟน้ำเงินกะพริบ 3 ครั้ง คือวงจรไม่ครบ หัวพอตเสียบไม่เข้าที่ ไฟน้ำเงินกะพริบ 2 ครั้ง คือหัวพอตถูกถอด",
              "ตอนสูบ สีไฟบอกระดับแบต เขียวคือเกิน 60% น้ำเงินคือ 30–60% แดงคือต่ำกว่า 30% ส่วนตอนชาร์จ ไฟจะกะพริบ แดงคือต่ำ น้ำเงินคือกลาง เขียวคือเพียงพอ ชาร์จเต็มแล้วไฟเขียวจะติดค้าง",
            ],
          },
          {
            heading: "Caliburn G4 และ G5 ดูจากจอ",
            paragraphs: [
              "[Caliburn G4](/products/caliburn-g4) ขึ้นเป็นข้อความบนจอ 4 แบบ Atomizer short! (หัวพอตช็อต) · Battery Low! (แบตเตอรี่ต่ำ) · Over 8s! (ดูดค้างเกิน 8 วินาที) · No Atomizer (เครื่องไม่เจอหัวพอต) ขึ้นข้อความพวกนี้เมื่อไหร่ เครื่องจะหยุดจ่ายไฟ",
              "ส่วน Caliburn G5 ขึ้นข้อความ ATOMIZER SHORT · BATTERY LOW · OVER 6S (ดูดค้างเกิน 6 วินาที) · NO ATOMIZER",
            ],
          },
        ],
      },
      {
        heading: "M Switch · M Bar และรุ่นอื่น ไล่เช็คตามขั้นข้างบน",
        paragraphs: [
          "M Switch ดูดไม่ขึ้น ไฟกะพริบ ให้ไล่แบบเดียวกัน แกะพลาสติกที่ก้นพอต ชาร์จผ่าน USB-C ถอด [M Switch Pod](/products/m-switch-pod) แล้วเสียบกลับให้เข้าที่ และอย่าดูดค้างนาน",
        ],
      },
      {
        heading: "กลิ่นไหม้ รสไม่มา ไม่หอม ถึงเวลาเปลี่ยน",
        paragraphs: [
          "ถ้าดูดขึ้นแล้วแต่มีกลิ่นไหม้ รสไม่มา หรือไม่หอม จากที่ร้านเจอ อาการแบบนี้คือถึงเวลาเปลี่ยนแล้ว พอตใช้แล้วทิ้งก็เปลี่ยนเป็นตัวใหม่ เครื่องที่ใช้หัวพอตก็เปลี่ยนหัวพอตใหม่ วิธีดูแลหัวพอตอ่านต่อที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          "เรื่องที่ลูกค้าบ่นกับร้านบ่อยคือแบต ไหม้ไว และพัฟไม่ถึง เรื่องชาร์จอ่านต่อที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging) ส่วนเรื่องพัฟกับระยะเวลาใช้งานอยู่ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
      },
    ],
    relatedProductSlugs: ["m-switch-pod", "caliburn-g4-mini", "caliburn-g4"],
    faq: [
      {
        question: "M Switch ดูดไม่ขึ้น ไฟกะพริบ ทำไง",
        answer: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกแล้ว จากนั้นชาร์จผ่าน USB-C แล้วถอดหัวพอตเสียบกลับให้เข้าที่ ถ้าดูดขึ้นแต่มีกลิ่นไหม้หรือรสไม่มา ก็ถึงเวลาเปลี่ยนหัวพอตใหม่",
      },
      {
        question: "Caliburn ขึ้น No Atomizer แก้ยังไง",
        answer: "ตามคู่มือของ UWELL แปลว่าเครื่องไม่เจอหัวพอต ถอดหัวพอตออกแล้วเสียบกลับให้เข้าที่",
      },
      {
        question: "Caliburn G4 Mini ไฟแดงกะพริบ แปลว่าอะไร",
        answer: "ตามคู่มือของ UWELL ถ้ากะพริบ 3 ครั้งตอนสูบ คือหัวพอตช็อต ถ้ากะพริบ 10 ครั้ง คือแบตต่ำ ให้ชาร์จก่อน",
      },
      {
        question: "พอตใช้แล้วทิ้งดูดไม่ขึ้น ทำยังไง",
        answer: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกแล้ว ถ้าเป็นรุ่นที่ชาร์จได้อย่าง M Bar 9K กับ M Bar 10K ลองชาร์จผ่าน USB-C ถ้าดูดขึ้นแต่มีกลิ่นไหม้หรือไม่หอมแล้ว ก็ถึงเวลาเปลี่ยนตัวใหม่",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @PODSYSTEM-OKAMI-II.
    reviewVideo: { videoId: "MlQjKTSls-0", title: "รวมปัญหาที่พบบ่อย สำหรับผู้ใช้งานพอต?", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-03-13" },
  },
  {
    // Round 10B T11 — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // M Switch battery (600mAh on salthub.com — /m-switch/ now redirects to the home page) is deliberately NOT stated: the m-switch-kit spec row is still
    // unverified. Owner 06/10 pm (HANDOFF §18): a missing fact is left unsaid — never explain the absence.
    // Owner fix A (2026-09-24): M Switch Pod capacity removed too — SALTHUB does not state it (salthub-mswitch-check.md).
    id: "esko-bar-switch-vs-m-switch",
    slug: "esko-bar-switch-vs-m-switch",
    title: "Esko Bar Switch 20K กับ M Switch (Marbo) ต่างกันยังไง",
    dek: "ทั้งคู่เก็บตัวเครื่องไว้ เปลี่ยนแค่หัวพอต ตามสเปกผู้ผลิต Esko Bar Switch 20K หัวละ 20,000 พัฟ ส่วน M Switch หัวละ 15,000 พัฟ ที่เหลือเทียบทีละข้อ",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "Esko Bar Switch 20K กับ M Switch ต่างกันยังไง",
        paragraphs: [
          "ทั้งสองรุ่นเป็นเครื่องระบบสวิตช์ เก็บตัวเครื่องไว้ชาร์จใช้ต่อ เปลี่ยนแค่หัวพอต ที่ต่างคือตัวเลข ตามเว็บผู้ผลิต Esko Bar Switch 20K หัวละ 20,000 พัฟ แบต 850mAh มีโหมด High กับ Low และปรับช่องลมได้ 3 ระดับ ส่วน M Switch หัวละ 15,000 พัฟ",
          "M Switch เป็นของ SALTHUB ตระกูลเดียวกับที่หลายร้านเรียกว่า Marbo ส่วน Esko Bar เป็นอีกแบรนด์หนึ่ง",
          "ตัวเลขในบทความนี้มาจาก [เว็บ Esko Bar](https://eskobarvape.com/product/pod-system/) กับ [เว็บ SALTHUB](https://www.salthub.com/)",
        ],
      },
      {
        heading: "Esko Bar Switch 20K เปลี่ยนหัวได้ไหม",
        paragraphs: [
          "ได้ ผู้ผลิตเขียนไว้ว่าเป็นหัวพอตแบบถอดเปลี่ยนได้ (Replaceable Pod) ตัวแบตกับถังน้ำยาแยกจากกัน เปลี่ยนกลิ่นได้โดยไม่ต้องเปลี่ยนทั้งเครื่อง",
          "หลักเดียวกับ [M Switch Kit](/products/m-switch-kit) ที่ทิ้งแค่หัวพอต [M Switch Pod](/products/m-switch-pod) ตัวเครื่องเก็บไว้ ส่วนหน้าสินค้าของ Esko อยู่ที่ [Esko Bar Switch 20K](/products/pod-159)",
        ],
      },
      {
        heading: "เทียบสเปกทีละข้อ",
        paragraphs: [],
        subsections: [
          { heading: "จำนวนพัฟต่อหัว", paragraphs: ["Esko Bar Switch 20K หัวละ 20,000 พัฟ ส่วน M Switch หัวละ 15,000 พัฟ"] },
          { heading: "ความจุน้ำยา", paragraphs: ["Esko Bar Switch 20K ระบุความจุน้ำยา 18mL"] },
          { heading: "ความเข้มข้นนิโคติน", paragraphs: ["M Switch ระบุไว้ 30mg แบบ salt nic"] },
          { heading: "แบตและการชาร์จ", paragraphs: ["Esko Bar Switch 20K แบต 850mAh ชาร์จที่ 5V 0.85A ส่วนตัวเครื่อง M Switch มีจอบอกระดับแบต ทั้งคู่ชาร์จผ่าน USB-C"] },
          { heading: "คอยล์", paragraphs: ["Esko เขียนว่าเป็นระบบ Dual Coil (คอยล์สองตัว) ส่วน M Switch ใช้คอยล์ cotton mesh 1.0 โอห์ม"] },
          { heading: "โหมดและช่องลม", paragraphs: ["Esko มีโหมด High กับ Low ปรับช่องลมได้ 3 ระดับ ส่วน M Switch มีปุ่มเลื่อนปรับลม"] },
        ],
      },
      {
        heading: "เลือกตามอะไร",
        paragraphs: [
          "ไม่มีรุ่นไหนชนะขาด ดูว่าอะไรสำคัญกับคุณ อยากได้พัฟต่อหัวที่มากกว่า ตามสเปกผู้ผลิต Esko Bar Switch 20K ตัวเลขสูงกว่า อยากสลับโหมดได้ Esko มีโหมด High กับ Low ส่วนช่องลม ปรับได้ทั้งสองรุ่น",
          "ถ้าใช้ M Bar อยู่แล้ว M Switch ก็เป็นของ SALTHUB เจ้าเดียวกัน",
          "ที่ร้าน ลูกค้าที่ลังเลระหว่างสองรุ่นนี้ สุดท้ายเลือกพอ ๆ กัน แต่เอนไปทาง M Switch เรื่องนี้บอกแค่ว่าคนเลือกอะไร ไม่ได้บอกว่ารุ่นไหนดีกว่า",
          "ยังไม่แน่ใจว่าจะเอาเครื่องระบบสวิตช์หรือพอตใช้แล้วทิ้ง อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) รุ่นอื่นของสองแบรนด์อยู่ที่ [Esko Bar](/brands/esko-bar) กับ [SALTHUB](/brands/salthub)",
        ],
      },
    ],
    relatedProductSlugs: ["pod-159", "m-switch-pod"],
    faq: [
      {
        question: "Esko Bar Switch 20K เปลี่ยนหัวได้ไหม",
        answer: "ได้ ผู้ผลิตระบุว่าเป็นหัวพอตแบบถอดเปลี่ยนได้ ตัวแบตกับถังน้ำยาแยกจากกัน เปลี่ยนกลิ่นได้โดยไม่ต้องเปลี่ยนทั้งเครื่อง",
      },
      {
        question: "Esko Bar กับ Marbo ต่างกันไหม",
        answer: "เป็นคนละแบรนด์ Marbo คือชื่อที่หลายร้านใช้เรียกของ SALTHUB อย่าง M Bar กับ M Switch ถ้าเทียบรุ่นเปลี่ยนหัวด้วยกัน คู่ที่ใกล้กันคือ Esko Bar Switch 20K กับ M Switch",
      },
      {
        question: "Esko Bar Switch 20K ชาร์จยังไง",
        answer: "ชาร์จผ่าน USB-C ผู้ผลิตระบุการชาร์จที่ 5V 0.85A แบตในตัว 850mAh",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKMYARZ — names the
    // Switch model explicitly (the OKAMI comparison clip only says "ESKO BAR 20K", which may be the non-Switch model).
    reviewVideo: { videoId: "iDoW0BuyWog", title: "ESKO BAR SWITCH 20000 มันจะขนาดนั้นเลยหรอเนี้ยย?", channelName: "OKM YARZ", publishedAt: "2025-12-20" },
  },
  {
    // Round 10B T05' — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. Held
    // under owner ruling D3, released 2026-10-02 (owner) — spec-only by the owner's instruction, no shop experience. The
    // pre-release check "G4 fires on a draw" = the G4 spec row `firing` ("Draw or button (auto mode)"), verified on the UWELL
    // manual copy in the data round of 2026-09-24 (uwell.ts).
    id: "comparing-caliburn-models",
    slug: "comparing-caliburn-models",
    title: "Caliburn G5 vs G4 ต่างกันยังไง เทียบ Caliburn 8 รุ่น",
    dek: "G5 แบต 1600mAh สลับโหมดด้วยการแตะ G4 แบต 1300mAh มีปุ่มยิง G4 Pro แบต 1800mAh จอทัช เทียบสเปกทีละคู่",
    category: "buying-guide",
    readingTimeMin: 7,
    publishedAt: "2026-10-02",
    thaiOnly: true,
    body: [
      {
        heading: "สรุปก่อน: ต่างกันตรงไหน",
        paragraphs: [
          "Caliburn G5 กับ G4 ต่างกันยังไง ตอบสั้น ๆ คือ G5 แบตมากกว่า (1600mAh กับ 1300mAh) และสลับโหมดด้วยการแตะ ไม่มีปุ่ม ส่วน G4 มีปุ่มยิง ทั้งคู่ใช้หัวพอต GPP ระบบเดียวกัน",
          "Caliburn 8 รุ่นในบทความนี้ (G5 · G5 Lite · G5 Lite SE · G4 Pro · G4 · G4 Mini · G4 Classic · G3 Pro) ต่างกันอยู่ 4 เรื่อง คือจอกับการควบคุม ขนาดแบต การปรับช่องลม และระบบหัวพอต ส่วนวัตต์สูงสุด ทุกรุ่นอยู่ที่ 35 วัตต์เท่ากัน",
          "ตัวเลขทั้งหมดมาจากตารางสเปกบนหน้าสินค้า ถ้ามาจากคู่มือของ UWELL เราบอกไว้ตรงนั้น",
        ],
      },
      {
        heading: "จัดกลุ่มตามสเปก",
        paragraphs: [],
        subsections: [
          {
            heading: "จอและการควบคุม",
            paragraphs: [
              "[Caliburn G5](/products/caliburn-g5) จอสี 0.85 นิ้ว สลับโหมดด้วยระบบ Smart Triple-Tap Control คือแตะตัวเครื่องสามครั้ง ตามคู่มือของ UWELL ไม่มีปุ่ม ส่วน [Caliburn G4](/products/caliburn-g4) จอสี เลือกโหมดวัตต์บนจอได้ มีปุ่มยิง และตามคู่มือของ UWELL สูบได้เลยโดยไม่ต้องกดปุ่มก็ได้",
              "[Caliburn G4 Pro](/products/caliburn-g4-pro) จอทัช 2.51 นิ้ว · [Caliburn G3 Pro](/products/caliburn-g3-pro) จอ LCD โอบด้านข้างเครื่อง ส่วน [Caliburn G4 Mini](/products/caliburn-g4-mini) ไม่มีจอ ตามคู่มือของ UWELL ใช้ปุ่มกับไฟ LED บอกสถานะ",
              "[Caliburn G4 Classic](/products/caliburn-g4-classic) ก็ไม่มีจอ ใช้ไฟ RGB 14 ดวงบอกระดับแบต และสูบได้ทั้งแบบดูดและกดปุ่ม",
              "[Caliburn G5 Lite](/products/caliburn-g5-lite) กับ G5 Lite SE ตัดจอสีกับระบบแตะของ G5 ออก ใช้ไฟ LED 4 ขีดบอกระดับแบต",
            ],
          },
          {
            heading: "แบต",
            paragraphs: [
              "G4 Pro 1800mAh · G5 · G5 Lite และ G5 Lite SE 1600mAh · G4 Classic 1400mAh · G4 1300mAh · G4 Mini 1100mAh · G3 Pro 1000mAh ใช้ mAh เทียบกันระหว่างรุ่นได้ แต่อย่าแปลงเป็นชั่วโมง วิธีอ่านอยู่ที่ [วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet)",
              // Data round (2026-09-24): the charge-time line ("G4 ~30 min, G4 Mini ~58 min at 2A") is cut — neither figure is
              // on a UWELL page or manual (held article, fixed in the file only; it stays held).
            ],
          },
          {
            heading: "ช่องลม",
            paragraphs: [
              "G4 Pro ปรับช่องลมได้ละเอียดแบบไม่มีขั้น G3 Pro ปรับได้เต็มช่วง G5 ปรับช่องลมด้านข้างแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
              "G5 Lite กับ G5 Lite SE ปรับได้สองทาง คือกลับด้านหัวพอตและปรับแบบไม่มีขั้น G4 Classic ก็ปรับแบบไม่มีขั้นและกลับด้านหัวพอตได้ ส่วน G4 กับ G4 Mini ใช้ปุ่มเลื่อนปรับลมคู่กับการกลับด้านหัวพอต",
            ],
          },
          {
            heading: "ระบบหัวพอต",
            paragraphs: [
              "G5 · G5 Lite · G5 Lite SE · G4 · G4 Mini และ G4 Classic ใช้หัวพอต GPP (G Pod Platform) ของ UWELL ส่วน G4 Pro ใช้ได้ทั้ง GPP และหัวพอต G3 สำหรับ G3 Pro หน้าสินค้าระบุหัวพอต G3 มาในกล่อง 2 หัว คือ 0.4 โอห์ม (3mL) กับ 0.9 โอห์ม (2.5mL)",
              "หัว GPP ที่มากับ G4 และ G4 Mini คือ 0.4 โอห์มกับ 0.9 โอห์ม ส่วน 0.6 โอห์มกับ 1.2 โอห์มซื้อแยก เรื่องดูแลหัวพอตอยู่ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
            ],
          },
        ],
      },
      {
        heading: "Caliburn G5 vs G4",
        paragraphs: [
          "G5 แบต 1600mAh มากกว่า G4 ที่ 1300mAh ทั้งคู่มีจอสี G5 จอ 0.85 นิ้ว สลับโหมดด้วยการแตะ ไม่มีปุ่ม ส่วน G4 มีปุ่มยิง เลือกโหมดวัตต์บนจอ",
          "วัตต์ของ G5 อยู่ที่ 5–35 วัตต์ ส่วน G4 อยู่ที่ 35 วัตต์ น้ำหนักตามคู่มือ G5 65 กรัม ส่วน G4 54.7 กรัม หัวพอตเป็น GPP ทั้งคู่ ใช้หัวเดียวกันได้",
          "ชอบแตะสลับโหมดและอยากได้แบตมากกว่า ดู G5 ชอบเครื่องที่มีปุ่มและเบากว่า ดู G4",
        ],
      },
      {
        heading: "Caliburn G5 vs G5 Lite",
        paragraphs: [
          "แบต 1600mAh กับวัตต์สูงสุด 35 วัตต์เท่ากัน ใช้หัวพอต GPP เหมือนกัน ที่ต่างคือ G5 มีจอสี 0.85 นิ้วกับระบบ Smart Triple-Tap Control ส่วน Lite ตัดสองอย่างนี้ออก ใช้ไฟ LED บอกระดับแบตแทน",
          "[Caliburn G5 Lite SE](/products/caliburn-g5-lite-se) แบตกับวัตต์เท่า Lite และชุดสีทั้ง 8 สีเป็นหนัง",
          "อยากได้จอสีกับการแตะสลับโหมด ดู G5 ไม่ต้องการจอสีแต่อยากได้แบตเท่ากัน ดู G5 Lite ถ้าชอบชุดสีหนัง ดู G5 Lite SE",
        ],
      },
      {
        heading: "Caliburn G4 vs G4 Pro",
        paragraphs: [
          "G4 Pro แบต 1800mAh มากกว่า G4 ที่ 1300mAh จอทัช 2.51 นิ้ว ปรับช่องลมได้แบบไม่มีขั้น และใช้หัวพอตได้ทั้ง GPP กับหัวพอต G3 ส่วน G4 ใช้ GPP",
          "ที่ต้องแลกคือน้ำหนัก ตามคู่มือของ UWELL G4 Pro หนัก 78 กรัม G4 หนัก 54.7 กรัม ส่วนวัตต์สูงสุด 35 วัตต์กับหัวพอต 3mL เท่ากันทั้งคู่",
          "อยากได้จอใหญ่ ปรับช่องลมละเอียด และใช้หัวพอตได้สองแบบ ดู G4 Pro อยากได้เครื่องที่เบากว่า ดู G4",
        ],
        video: SECTION_CLIPS.caliburnG4Pro,
      },
      {
        heading: "Caliburn G4 vs G3 Pro",
        paragraphs: [
          "G4 แบต 1300mAh มากกว่า G3 Pro ที่ 1000mAh ทั้งคู่มีจอ G4 เป็นจอสี ส่วน G3 Pro เป็นจอ LCD โอบด้านข้าง ปรับได้ 5–35 วัตต์ และปรับช่องลมได้เต็มช่วง ทั้งคู่ชาร์จผ่าน USB-C ที่ 2A",
          "ต่างกันชัดที่หัวพอต G4 ใช้ GPP มาในกล่อง 0.4 โอห์มกับ 0.9 โอห์ม ส่วน G3 Pro ใช้หัวพอต G3 มาในกล่อง 2 หัว 0.4 โอห์ม (3mL) กับ 0.9 โอห์ม (2.5mL) จะซื้อหัวพอตเพิ่ม ดูให้ตรงกับระบบของเครื่อง",
          "อยากได้แบตมากกว่า ดู G4 อยากปรับวัตต์และช่องลมเองได้เต็มช่วง ดู G3 Pro ค่าโอห์มกับช่องลมส่งผลกับแนวการสูบยังไง อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) หรือดู Caliburn ทั้งหมดที่ [UWELL](/brands/uwell)",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g4", "caliburn-g4-pro"],
    faq: [
      { question: "หัวพอต Caliburn G4 ใส่ G5 ได้ไหม", answer: "ได้ ทั้งสองรุ่นใช้หัวพอต GPP ของ UWELL ระบบเดียวกัน" },
      { question: "Caliburn G5 กับ G5 Lite แบตเท่ากันไหม", answer: "เท่ากัน 1600mAh วัตต์สูงสุด 35 วัตต์เท่ากัน ต่างกันที่จอสีกับระบบแตะสลับโหมดของ G5" },
      { question: "Caliburn G4 Pro ใช้หัว G3 ได้ไหม", answer: "ได้ สเปกที่ยืนยันแล้วระบุว่า G4 Pro ใช้ได้ทั้งหัวพอต GPP และหัวพอต G3" },
      { question: "Caliburn รุ่นไหนไม่มีจอ", answer: "ในรุ่นที่เทียบในบทความนี้ G4 Mini · G4 Classic · G5 Lite และ G5 Lite SE ไม่มีจอ ใช้ไฟ LED บอกสถานะหรือระดับแบต" },
    ],
  },
  {
    // Round 10B T07' — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. Held
    // under owner ruling D3, released 2026-10-02 (owner). Pair = the only cross-brand model pair with
    // autocomplete evidence ("argus g4 vs caliburn g5", researcher-B-result.md), the one Cowork proposed.
    id: "argus-g4-vs-caliburn-g5",
    slug: "argus-g4-vs-caliburn-g5",
    title: "ARGUS G4 vs Caliburn G5 ต่างกันยังไง",
    dek: "ไม่มีคำตอบที่แน่นอนว่าตัวไหนดีกว่า แบตใกล้กัน วัตต์กับขนาดจอเท่ากัน ที่ต่างชัดคือระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ",
    category: "buying-guide",
    readingTimeMin: 5,
    publishedAt: "2026-10-02",
    thaiOnly: true,
    body: [
      {
        heading: "ตัวไหนดีกว่า: ไม่มีคำตอบที่แน่นอน",
        paragraphs: [
          "ARGUS G4 กับ Caliburn G5 ตัวไหนดีกว่า ไม่มีคำตอบที่แน่นอน ตัวเลขหลักใกล้กันมาก แบต 1650mAh กับ 1600mAh ปรับได้ 5–35 วัตต์เท่ากัน จอ 0.85 นิ้วเท่ากัน ที่ต่างชัดคือระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ",
          "เลยขอเทียบทีละเรื่องแทนการตัดสิน ตัวเลขทั้งหมดมาจากตารางสเปกที่ยืนยันแล้วบนหน้า [ARGUS G4](/products/argus-g4) กับ [Caliburn G5](/products/caliburn-g5) ส่วนที่มาจากคู่มือของ UWELL บอกไว้ตรงนั้น",
        ],
      },
      {
        heading: "จอกับการควบคุม",
        paragraphs: [
          "ARGUS G4 ใช้จอ HD 0.85 นิ้ว โชว์แบต วัตต์ ค่าโอห์ม สถานะล็อก และจำนวนพัฟ ส่วน G5 เป็นจอสี 0.85 นิ้ว",
          "G5 สลับโหมดด้วยระบบ Smart Triple-Tap Control คือแตะตัวเครื่องสามครั้ง ตามคู่มือของ UWELL ไม่มีปุ่ม ส่วน ARGUS G4 มีปุ่มเดียว กดสองครั้งติดกันเพื่อเปลี่ยนค่าโอห์ม กดสามครั้งเพื่อปรับวัตต์ และกดห้าครั้งเพื่อเข้าเมนู",
        ],
      },
      {
        heading: "ระบบหัวพอตและแนวการสูบ",
        paragraphs: [
          "ARGUS G4 ใช้ระบบหัวพอต ARGUS เติมด้านบน มีหลายค่าโอห์ม ตัวเครื่องรับช่วงโอห์ม 0.4–3.0 โอห์ม ส่วน G5 ใช้หัวพอต GPP ของ UWELL ความจุ 3mL เติมด้านบน",
          "หัว GPP มี 0.4 · 0.6 · 0.9 · 1.2 โอห์ม ช่วงที่ ARGUS G4 รับได้กว้างกว่า แต่ช่วงกว้างไม่ได้แปลว่ามีหัวพอตทุกค่าให้ซื้อ อ่านเรื่องนี้ที่ [วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet) ด้านความจุ หัวพอต ARGUS Multi-Ohm ที่มากับ ARGUS G4 จุ 3.5mL ส่วนหัว GPP ของ G5 จุ 3mL ในเวอร์ชัน TPD จุ 2mL ทั้งคู่",
          "ค่าโอห์มของหัวพอตที่ใส่มีผลกับแนวการสูบ ถ้ายังไม่แน่ใจว่าตัวเองสูบแนวไหน อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) ก่อน",
        ],
        video: SECTION_CLIPS.argusG4,
      },
      {
        heading: "แบตกับการชาร์จ",
        paragraphs: [
          "แบต ARGUS G4 1650mAh ส่วน G5 1600mAh ต่างกัน 50mAh ทั้งคู่ชาร์จผ่าน USB-C โดย ARGUS G4 สเปกระบุ 5V/2A ชาร์จเต็มในราว 45 นาที",
          "ชาร์จหนึ่งครั้งใช้ได้นานแค่ไหน ขึ้นกับวัตต์ที่ตั้งและสูบถี่แค่ไหน",
        ],
      },
      {
        heading: "เหมาะกับใคร",
        paragraphs: [
          "อยากเห็นวัตต์ ค่าโอห์ม และจำนวนพัฟบนจอ และอยากได้ตัวเครื่องที่รับช่วงโอห์มกว้าง ดู ARGUS G4",
          "อยากสลับโหมดด้วยการแตะแทนการกดปุ่ม และอยากใช้หัวพอต GPP ที่ใช้ร่วมกับ Caliburn รุ่นปัจจุบันหลายรุ่น ดู Caliburn G5 ถ้าจะเทียบ G5 กับ Caliburn รุ่นอื่นต่อ อ่าน [เทียบ Caliburn ทีละคู่](/guides/comparing-caliburn-models) หรือดูทั้งแบรนด์ที่ [VOOPOO](/brands/voopoo) กับ [UWELL](/brands/uwell)",
        ],
      },
    ],
    relatedProductSlugs: ["argus-g4", "caliburn-g5"],
    faq: [
      { question: "ARGUS G4 กับ Caliburn G5 แบตต่างกันเยอะไหม", answer: "ต่างกัน 50mAh คือ ARGUS G4 1650mAh ส่วน Caliburn G5 1600mAh ปรับได้ 5–35 วัตต์เท่ากัน" },
      { question: "หัวพอต Caliburn ใส่ ARGUS G4 ได้ไหม", answer: "สองรุ่นนี้ใช้คนละระบบหัวพอต ARGUS G4 ใช้ระบบหัวพอต ARGUS ส่วน Caliburn G5 ใช้ GPP ของ UWELL จะซื้อหัวพอตเพิ่ม ดูให้ตรงกับระบบของเครื่อง" },
      { question: "VOOPOO กับ Caliburn ต่างกันยังไง", answer: "VOOPOO เป็นแบรนด์ ส่วน Caliburn เป็นตระกูลของ UWELL ถ้าเทียบรุ่นต่อรุ่น ARGUS G4 กับ Caliburn G5 แบตกับวัตต์ใกล้กัน ต่างกันที่ระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ" },
    ],
  },
];

/** The public articles — everything outside HELD_GUIDE_IDS. */
export const guides: Guide[] = allGuides.filter((g) => !HELD_GUIDE_IDS.has(g.id));

/** Held articles, for the contract test only — never render or link from this list. */
export const heldGuides: Guide[] = allGuides.filter((g) => HELD_GUIDE_IDS.has(g.id));

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
