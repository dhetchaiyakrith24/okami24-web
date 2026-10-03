# Checker brief — batch 1c (round "sitewide template, brand by brand"), branch b1c-g4pro

Round file: docs/rounds/รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt (batch 1 UWELL, PR 1c = G4 Pro + G4 Pro KOKO). Template = docs/PRODUCT_PAGE_TEMPLATE.md.
Base = origin/main bb5ddb7. Tier B. Cloud machine (cloud-linux-chromium) for both before and after.

## What the batch meant to change
1. /products/caliburn-g4-pro and /products/caliburn-g4-pro-koko moved to the G5 template "stage" story: storyDetails + storyLayout "stage" +
   storyCover (UWELL banner) + one block per UWELL poster/film still (G4 Pro 6 blocks · KOKO 7 blocks), text th/en/zh in src/i18n/story-copy.ts,
   lede + buyer-question article in src/data/product-articles.ts.
2. Spec rows of both re-read from UWELL's spec sheets and posters, each with sourceUrl (src/data/products/uwell.ts) + Thai values
   (src/i18n/product-copy-th.ts) + 3 new Thai chip labels (src/i18n/spec-labels-th.ts: Touch / Screen themes / Settings).
   KOKO "Draw modes" row was wrong (modes set power, not draw) → "Output modes". KOKO whoIsThisFor[1] (MTL/RDL via modes) was wrong → rewritten.
3. Old `features` (no images) and their Thai replaced by the story features. Head copy (tagline / shortDescription / title / meta / JSON-LD) NOT touched (round off-limits).
4. 15 new poster files public/assets/products/caliburn-g4-pro{,-koko}/story-*.webp — UWELL's own files or frames of UWELL's own page films
   (_incoming/sitewide-template/1c/prep.js says which). No AI.
5. Colour images / card / lineup NOT changed in this PR (G4 Pro colours = a later PR).

## Sources (UWELL only)
_incoming/sitewide-template/1c/copy-en.md (every line's source) · page texts caliburn-g4-pro*.txt · posters in 1c/mk/g4pro + 1c/mk/koko ·
spec tables readable on white: 1c/mk/g4pro-spec-table.png, 1c/mk/koko-spec-table.png.
Note: "ultra-shatterproof" is printed on UWELL's posters (pc/nch.webp, pc/spe6-params.png) — kept OFF the G4 Pro (owner dropped it 2026-09-14; asked again
in the report), kept on KOKO (new, poster-printed: block title + spec row).

## Proof already run (re-measure what you need)
- tsc 0 · eslint 0 on the 5 files · npm run verify:catalog (verified-specs gate: 1.2Ω needed a row → pod-compat rows now state 0.4Ω–1.2Ω from UWELL's pod chart)
- visible-text before (vt-before, commit 7a20158 = main + docs only) vs after (vt-after2): changes only on the 2 pages; controls caliburn-g4, caliburn-g5, /brands/uwell = 0
- scan.js PASS 0/109 · thai-raw-chars 0 · forbidden-word grep of the diff 0 (แท่ง fixed)
- locale-hydration on the 2 pages: 4 FAIL = "UWELL คอยล์ Caliburn G4&G3 Series" in the fits-with box — present in vt-before too (pre-existing Shipnity coil name, data round)
- page-text-length + facts.json · wordbreak-scan after (wb-after2.md)
- shots before/after 390 + 1440 full page: 1c/shots/*-before.png / *-after.png

## Report shape: the five fields of 13.4 (agent file).
