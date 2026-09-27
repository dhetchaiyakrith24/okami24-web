# Image round ("รอบรูป") — audit record, 2026-09-28 (computer round)

Written because the fix round that follows may run in the cloud or be planned by Javis, and `_incoming/` is not in
git (`.claude/TEAM_RULES.md` 13.3 · owner's rules table item 12). Instruction: `docs/rounds/รอบรูป-ตรวจทั้งร้าน.txt`.
Owner report (private Artifact, phone-readable): https://claude.ai/artifact/Ar8nigdAmyi7svhFSKvuRp
The site was not changed in this round (`node scripts/self-merge-check.js --base origin/main` → PASS).

## How it was measured

`npx tsx scripts/image-quality-audit.ts <out-dir>` — every image the site uses (legacy card / gallery / colour /
flavour / lineup + published ProductMaster card / variant / fallback), hidden products included. Numbers per image:
product long side (not canvas), `detailPhone` (how much real detail survives a 50 % down-up round trip, measured at the
size a phone draws the product, ~1050 px long), transparency, outline numbers, plus contact sheets per brand.
`edgeDetail`, `hardEdgePct` and `fringePct` did not separate good from bad cut-outs on labelled samples — outline
quality was judged by eye on phone-size zooms (flags listed below).

## Standard proposed (from the Caliburn G5 set on the site: product 701–1128 px, detailPhone 0.09–0.24)

| check | pass | low | fail |
|---|---|---|---|
| product long side | ≥ 650 px | 500–649 | < 500 |
| detailPhone | ≥ 0.07 | 0.045–0.07 | < 0.045 |
| background (card / colour / flavour) | transparent | — | opaque box or poster |
| outline, right model/colour/flavour | eye check | — | eye flag |
| new files | WebP q82, card ≤ 150 KB (IMAGE_SPEC) | | |

Lineups: ≥ 1000 px long and transparent. Gallery ("detail") images not judged.

## Result (28/09, main `093b07a`)

63 products (53 shown, 10 hidden) · 335 images judged: pass 107 · low 83 · fail 145 · colour+flavour options 446,
197 without their own photo. Per brand (pass / low / fail · options without photo): SALTHUB 12/3/18 · 72 of 95 ·
UWELL 38/16/48 · 2 of 78 · VOOPOO 52/24/25 · 3 of 71 · JOIWAY 0/26/22 · 0 of 46 · RELX 0/11/0 · Unbranded 4/0/24 ·
62 of 83 · IQOS 0/2/5.

Eye flags: Caliburn G3 Pro KOKO (all 9) and G3 Pro (glass pod outline broken/speckled) · Argus G3 Mini (jagged) ·
UWELL coil-74 (broken render) · cards that show one flavour (m-switch-pod Grape Aloe, m-bar-pod Cola, zero-cartridge
Strawberry, joiway-f3 Aloe Grape) · joiway-f3 two sleeve designs among its flavours · caliburn-g4 card = two-device
shot · coil-94 retailer collage with typed text.

## Manufacturer lists vs ours (researchers + Friday, 28/09)

- Match: every UWELL device list except G4 Pro KOKO; VOOPOO Argus G4 / G4 Mini / P3 / G3 Mini, Drag S3, Vinci S,
  Vmate i3; M Bar 10K 12/12; M Bar 9K 22/22.
- VOOPOO Drag 6: manufacturer 8 colours, ours lacks **Gold** [ตรวจแล้ว via voopoo.com search index + vapesourcing].
- Drag X3: 3 newer colours at retailers (Carbon Fiber Black, Lake Green, Cherry Pink) [เชื่อว่า].
- Caliburn G4 Pro KOKO: every source 8 colours; our **"Golden Carbon"** found nowhere [เชื่อว่า]; Coral Pink image exists.
- M Switch Kit / Pod: **"Cool Mint"** not on salthub.com [ตรวจแล้ว on the maker's pages]; Kyoho Grape real.
- Reswa Sportcan 12K (shops: 5 flavours vs our 3) · Muro Freebase (shops: 6 vs our 3) [เชื่อว่า].
- Zero Pro: maker shows 8 renders without colour names — names unmapped.
- Not in our catalog at all, and no Shipnity stock row: M Bar 18K · Caliburn G3 (plain, legacy model) · Drag X (plain,
  legacy model). The 10 hidden products and what each lacks: the owner report, section 5.

## Sources found for the gaps

- UWELL official renders: `files.myuwell.com/uwell/product/<model>/pc/<n>.webp` — Caliburn G4 = `2…9.webp`, 579×1418,
  transparent, two views of one colour per file, faint colour caption below. Front device cropped → ~1330 px tall vs
  397 px on the site today (sample in the report). Other models: same page pattern, check per model.
- SALTHUB: M Switch Kit `wp-content/uploads/2025/08/m_switch_kit_flavor_01…16.webp` (1100×1479, **transparent**,
  box + device) · M Bar 10K `2026/02/mbar10k_<flavour>.webp` and M Switch Pod per-flavour files (800×800, **poster**:
  fruit, background, text) · M Bar 10K lineup `img.salthub.com/mbar10k/MBar10K_06.webp` (1920×1053 poster) ·
  M Bar 9K only 5-up strips `2025/08/m_bar_9k_02…06.webp` (~180 px per flavour — too small).
- Retailer 800 px sets (tier 3, white background + caption): `image.vapesourcing.com/imagecache/800/images/<yyyymm>/`
  for UWELL G4 / G4 Classic / G4 Pro KOKO / G3 Pro KOKO and VOOPOO Drag 6 (incl. Gold) / Argus lines; vaping.com
  Argus P3 1280×1280. White-background cut-outs of glass pods are how today's broken outlines happened.
- Parts diagrams: UWELL Caliburn G5 manual (thebestvape.com/wp-content/uploads/2026/04/Uwell-Caliburn-G5-User-Manual.pdf)
  has a vector exploded drawing, 8 numbered parts. SALTHUB has no parts drawing for any product. VOOPOO manual PDFs:
  `cdn.voopoo.com/download/<MODEL>_USER_MANUAL_EN.pdf` pattern (not opened this round).
- INFY 20K card candidate: akvapes.com/wp-content/uploads/2026/06/infy20k-700x700.png (flavours 18/18 match) — not
  looked at by eye yet.

## Open for the owner (report section 9)

1. Marbo poster images: use as-is / cut out box + device / not yet. 2. Parts section: official photo + numbers /
manual line drawing / Higgsfield. 3. Retailer copies of maker renders when the maker has none. 4. Cool Mint · Golden
Carbon real stock? Drag 6 Gold after 05/10? 5. Start with batch 1 (Marbo)?

Seven-page SEO baseline (drag-6 · drag-s3 · caliburn-g5-lite-se · m-bar-15k · caliburn-g5 · caliburn-g5-lite ·
argus-g4): no image change before 05/10.
