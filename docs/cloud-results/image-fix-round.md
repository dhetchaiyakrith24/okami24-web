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
