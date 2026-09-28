# Image-fix round ("รอบรูป-แก้") — record, 2026-09-28 (computer round, mid-round)

Written at the mid-round chat move so the next chat / Javis can see what `_incoming/image-fix/` holds (not in git).
Instructions: `docs/rounds/รอบรูป-แก้ก้อน1-2.txt` (original) · `docs/rounds/รอบรูป-แก้-คำตัดสิน-28-09.txt` (latest owner ruling).

## What is live now (main 464a0b6)

| product | option photos live | source | note |
|---|---|---|---|
| Caliburn G4 | 8 colours + lineup | UWELL official renders (myuwell.com caliburn-g4 pc/2–9) | sharper than before (phone sharpness 10.9–16.3 vs 3–7) |
| Caliburn G4 Mini | 12 colours + lineup | UWELL official renders (pc/1–12), matched by hex/order | sharper than before |
| M Bar 10K | 9 flavours | box + device cut from SALTHUB 800-px posters | owner: not good → withdrawn in PR #101 (open) |
| M Bar 9K | 18 flavours | Vapeauras retail 600-px PNG | owner: not good → withdrawn in PR #101 (open) |
| Caliburn G3 Pro KOKO | 8 colours + card + lineup | UWELL promo pack, product 524 px, 625 canvas | owner: not good → restore pre-#98 files (next step 1) |
| M Switch Kit / Pod | none (withdrawn #99/#100) | SALTHUB black-pod renders/posters | shop clips show CLEAR pods — not proven to match stock |

Also live: Cool Mint removed (owner: does not exist) · no-photo panel instead of another option's photo (#100).

## Why the photos looked soft (measured, `scripts/image-quality-audit.ts` + `scripts/image-sharpness-gate.ts`)

- Small / soft sources: M Bar 10K posters (product 523 px), M Bar 9K retailer files (soft already), G3 Pro KOKO pack
  JPGs (device 524 px).
- The 2026-09-06 "shrink the canvas" rule put them on 625/570 canvases; `src/lib/media-quality.ts` fills the hero when
  the stretch is ≤ 1.25x, so a 3x phone drew them 1.7–1.9x enlarged. The old G3 KOKO file (274x438) was below that
  threshold → drawn small but crisp.
- Not the cause: cut-out edges (checked, no halo) · the OOM image-size trim (phones still get the 1080 width).
- Even at real size on the 1000 canvas (option A) the owner judged M Bar 10K and G3 Pro KOKO not as good as before.

## Sources found (for step 2)

- UWELL: official promo packs via `https://www.myuwell.com/u/website/api/ow/product/manager/material/list/byProductLinkUri?productLinkUri=/caliburn/<slug>`
  (G3 Pro KOKO 218 MB zip, G3 Pro 533 MB zip; G4 Classic / G4 Pro KOKO give Google Drive links in a .docx:
  G4 Classic `https://drive.google.com/drive/folders/1vHHKFoQB3gVo1RrQAs7MQMVJiJh8ZEPB` · G4 Pro KOKO
  `https://drive.google.com/drive/folders/1gqjxNqT8CPDOL47U3uHWa24qV9wkv2zo` — not opened yet). Pack "HD Transparent
  Photo" files are 1000x1000 JPG on white, not transparent; "Product Photo" = lifestyle shots.
  Per-model page renders: `files.myuwell.com/uwell/product/<slug>/pc/<n>.webp` (G4, G4 Mini only); G4 Pro uses
  `pc/color-<n>.webp` 1539x1671 transparent (not used yet).
- SALTHUB: per-flavour originals do not exist on salthub.com (posters only) → request list for the supplier
  `_incoming/image-fix/ขอไฟล์รูป-SALTHUB.txt` (owner to forward).
- Retail M Bar 9K set: Vapeauras `ueeshop.ly200-cdn.com/u_file/UPBF/UPBF436/2507/05/products/MarboBar9K<FLAVOUR>-<hash>.png`
  (600 px, soft — rejected).

## Tools added this round

- `scripts/poster-cutout.js` + `.masks.json` — hand-traced mask cut for template posters.
- `scripts/image-sharpness-gate.ts` (in PR #101) — canvas ≥ 1000 + phone-size sharpness ≥ 90% of the replaced file.
- Known bug (pre-existing): `scripts/process-images.ts` without `--only` would rewrite ~69 files (incl. baseline
  argus-g4) because it compares the raw source against the already-scaled file. Always use `--only`.
- `scripts/ai-fidelity-sheet.js` (PR #102) — AI remake vs real reference: silhouette IoU + body colour deltaE + 4-panel sheet.

## Step 1 done on PR #101 (second chat, 28/09 evening)

G3 Pro KOKO back to the pre-#98 files (byte-identical to `e8fa0ef`), Cool Mint removal kept; M Bar 10K / 9K flavour
photos withdrawn (earlier commit) → standard photo first, a picked flavour shows the no-photo panel. Owner kept G4 (8) /
G4 Mini (12). The sharpness gate now passes a byte-identical restore ("restored"). Preview 3x/1440 sent to the owner
(`_incoming/image-fix/restore/ba-*.jpg`). Merge waits for the owner (BIG).

## Step 2 — second source hunt (3 researchers + Friday measured every file, 28/09 evening)

Gaps measured on the current tree (`npx tsx scripts/image-quality-audit.ts _incoming/image-fix/audit-now`): 29 products
list options without their own photo; the ones that matter (best sellers first, BSOT §15):

| product | options without photo | best candidate found | usable as a standard photo? |
|---|---|---|---|
| ESKO BAR Switch 20K (Pod-159) — best seller | 20 flavours | maker `eskobarvape.com/assets/product-pod542-flavor-<slug>.jpg`, 20/20, pod cartridge only, white bg, no watermark | no — 191–200 x 500 px; exact reference for a remake |
| Muro Connector 20K (Pod-171) — "Relx Connector 20K" in BSOT §15 [เชื่อว่า same product: sold as "ใช้กับ Relx Creator ได้"] | 20 | vapemun.com 600 px per flavour | no — shop posters with another shop's logo; reference only |
| M Switch 15K kit + pod (Pod-156 / Pod-147) — best seller | 17 + 17 | goatvapethai.com 800 px posters showing the CLEAR pod + GRAPE label | no — shop watermark; evidence that shops sell the clear pod (open question 4(c)) |
| Nexbar Clear 18K (Pod-180) | 10 | none — wotofo.com has one shared hero, no per-flavour photos; our 10 flavours are a Thai-market list | nothing to remake from |
| M Bar 10K (Pod-172) | 12 | maker posters `mbar10k_<flavour>.webp` 800 px (already rejected as soft); retailer ihavevape 600 px | no — reference for the Higgsfield trial |
| M Bar 9K (Disposable-25) | 22 | goatvapethai 800 px posters (watermarked) · rockyshopp 3 LINE photos · Kyoho Grape none | no |
| Muro SC 8000 · Mood Monster 14K · zero-cartridge | 8 · 6 · 2 | vapemun 600 px · pod2vape 600 px (heavy watermark) · goatvapethai | no |
| Muro 3ml | 4 | none (ecigelm.com unreachable) | — |
| Caliburn G4 Pro KOKO | Coral Pink, Golden Carbon | maker `files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/color-1.webp` / `color-9.webp` 2855x1441 transparent | no as-is — scene banner, device tilted and cut at the frame edge |

Result: **0 options gained a photo that meets the bar** (sharp at 3x, no watermark, whole product). Every gap above has
at least one real reference except Nexbar Clear 18K and Muro 3ml. Hidden products (infy-20k, tfit-m-power-20k,
foli-bar-15k, next-pro-2-beyond, muro-salt-nic, muro-freebase) were not searched this time.

## Step 3 — Higgsfield trial kit (not run: Friday cannot log in)

`_incoming/image-fix/higgsfield/m-bar-10k/` — `refs/` (the live card as device truth + 12 flavour cut-outs on flat grey),
`prompt.txt` (Grape first), `วิธีทำ-Higgsfield.txt` (owner/Javis steps). Results go to `out/`; Friday checks them with
`scripts/ai-fidelity-sheet.js` and sends the 3x/1440 preview before anything goes live.
