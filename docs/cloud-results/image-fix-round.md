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

### Owner 29/09: every option without a standard photo gets a remake (rule = IMAGE_SPEC §0 item 7)

Friday's first reading (28/09 night) kept Nexbar and 4 Muro 3ml flavours on the no-photo panel; the owner overruled it
29/09: sibling-model / shop / watermarked photos are references, "หาโหลดไม่ได้ = สร้าง". References found:
- Nexbar Clear 18K (Pod-180): body = our card (clear shell); flavour = siam-pod.com NexBar 12000 (Grape Ice, Mixberry,
  Watermelon Ice, Mint, Strawberry Watermelon, White Slush) · sudjudpod.net NexBar 20K (Grape Lychee, Strawberry Kiwi)
  · Watermelon Bubblegum only a generic 16K shot · Strawberry Custard none (name only).
- Muro 3ml: Muro Grape, Honey Lemon, Very Strawberry, Double Shisha — no photo anywhere reachable → body + box design
  from the 6 existing flavour boxes, name from the data; owner told which have no colour reference.
- Muro Connector 20K: shop pages and OKAMI's own clip say it fits the RELX **Creator**; the site still files it as a
  disposable — a data fix for its own round (not this one), flagged to the owner.

## First Higgsfield batch (29/09, branch `image-fix-gen`) — waiting for the owner's look

Friday connected through Higgsfield's own CLI (`npm i -g @higgsfield/cli`, owner signed in; Higgsfield's help page says
Claude Code uses the CLI, the MCP address is for the Claude app). Account: Ultra plan, 37.1 credits at start (shared
with the cartoon project). Nano Banana Pro at 2K = 2 credits per image, background remover = 1.
- M Bar 10K Grape: 2 attempts (the first misspelled the box's mode labels) → IoU 0.995, deltaE max 1.8 vs the maker's
  Grape photo; every box label read by eye. 4 credits.
- Nexbar Clear 18K Grape Ice: body from the shop's own clip thumbnail (i.ytimg.com/vi/YhtKKjRwF3Q — the real 18K: clear
  shell over carbon, flavour name top-left, NEX white / BAR in the flavour colour), name from a NexBar 12000 photo.
  1 attempt + background remover = 3 credits. **Numbers vs our card FAIL (IoU 0.757, deltaE max 62.6) and are not
  usable:** the card is another design ("Lemon Lime" striped wrap — not one of our 10 flavours — 3/4 angle, side
  screen) with a broken cut-out, and the clip frame cannot be cut for an IoU; checked by eye against the clip instead.
- Sharpness gate PASS (Grape 10.83 vs card 10.86; Grape Ice 9.6 vs card 7.6). 7 credits used, 30.1 left.
- The Nexbar page now opens on Grape Ice (existing rule in the product page: open on the first flavour with its own
  photo) and no longer shows the "Lemon Lime" card slide.
- **Owner 29/09: M Bar 10K Grape passes ("สวยเหมือนของแบรนด์จริง"); Nexbar Grape Ice = WRONG PRODUCT, withdrawn before
  merge.** The shop sells the **Nexbar CLEAR 18K** (rounded clear body, clear tank on top, black band at the bottom
  printed "nexBar CLEAR 18K" + flavour; 18 mL · 650 mAh · dual Nex Mesh coil · adjustable airflow · Type-C · 2 modes
  Normal/Turbo · 15 flavours incl. Strawberry Custard — owner's photos in
  `_incoming/image-fix/higgsfield/nexbar-clear-18k-owner/`). The carbon "NEX BAR / WOTOFO" device on our card, in the
  shop's clip and in the render is WOTOFO nexBAR 18K, another product with a similar name. Lesson: check the reference
  is the model the shop SELLS (the name printed on the device = the product name), not just that the render matches the
  reference. The product page itself (brand, spec, flavours, card) is a data fix of its own.

## Third chat (29/09 night) — owner answers relayed by Javis, then Muro Connector + M Bar 10K

Owner answers: (1) PR #104 + the remaining image work — Friday merges after her own gates and reports with the
comparison (written into IMAGE_SPEC §7 / TEAM_RULES 13.7 by PR #105; still asks first for a new kind of image or an
unclear reference model). (2) Nexbar Clear 18K: remove only what came from the WOTOFO model; no brand; "18K" = 18,000
puffs; keep the WOTOFO brand (footer untouched); list 1–2 real WOTOFO products from wotofo.com — which models/flavours the
owner will say. (3) Image-theft protection A+B+C = its own round after this one (A = "OKami24" + okami24.store).
Merged: #104 (Esko, live, curl 20/20) · #105 (rule) · #106 (Muro Connector, live, curl 20/20) · #107 (M Bar 10K).
Higgsfield: 525.1 → 451.1 credits (74 used; 2 of them a stray job Friday started by mistake).
- **Muro Connector 20K (#106), 20/20 flavours.** Device + label from OKAMI's own clip thumbnail
  (i.ytimg.com/vi/Mp0QbGUX3gU — Mineral Water + Banana Strawberry pods, side with the sockets and the print). The
  vapemun.com posters reuse one device per colour (Cola's poster device reads WATERMELON), so they only give the body
  colour per flavour: navy 4 · red 3 · purple 3 · yellow 8 · pink 2 [เชื่อว่า — from the posters; Mineral Water and
  Banana Strawberry confirmed by the clip]. Five NB Pro masters (the first red/yellow/purple tries changed the socket
  layout → re-made with the navy render as reference 1, "change only the colours"), every name typeset in Lato Bold
  (`_incoming/web-product-images/muro-connector-20k/label.js`, ±1 px vs the render). Mix Berries prints the product's
  own name (the poster says MIXBERRY). Card NOT replaced: two 3/4 remakes failed the colour check (ΔE max 8.3, 20.9).
  New `Product.openOnCardPhoto` keeps the card as the first photo when option photos show another view.
  Sharpness 5.4–10.2 vs card 2.34. 22 credits.
- **M Bar 10K (#107), 6 more flavours** on the owner-passed Grape template: All Berry, Cola, Matcha Latte, Pink Berry,
  Watermelon, Watermelon Mint (IoU 0.979–0.98, ΔE max ≤ 3.3). Not done after 3 tries: Blue Ice, Menthol Blast (the mint
  leaf of the maker's photo keeps coming back), Kyoho Grape (a grape keeps peeking behind the box), Strawberry Kiwi
  (product redesigned / colour). Yellow Mint: passed by eye but 8.28 < 90% of the card on the sharpness gate; a 4K retry
  changed the proportions. `openOnCardPhoto` on M Bar 10K too (the round instruction: standard photo first — since #103
  the page had opened on Grape). m-bar-15k (baseline, same data file) HTML identical before/after
  (`_incoming/web-product-images/m-bar-10k/htmlproof/`). 52 credits (incl. the stray 2).
- Next idea for the 5 left: clean the maker's photo first (cut the leaf/grape out of the reference) and give the
  passed Grape render as reference 3 — the extra reference fixed All Berry on try 3.

## Third chat, second part (29/09 night) — owner's second set of answers, M Bar sharpness (PR #109)

Owner answers (via Javis): WOTOFO — Friday picks 1–2 models with full official data (wotofo.com), only so the brand page
is not empty (SEO); Nexbar Clear 18K — Friday finds photos/spec herself (owner photos in
`_incoming/image-fix/higgsfield/nexbar-clear-18k-owner/` win on conflict), remake when not standard; Muro card-1 = use;
new: (A) M Bar flavour photos not sharp on the live site · (B) try three-quarter/angled views (the Muro card is the style
the owner likes) · (C) check every card (not hidden products): official source first, else Higgsfield · (D) out-of-stock
flavours (Esko 18/20) keep their photo and need a "suggestion" (other flavour / LINE).
- **(A) cause, measured:** Cloudflare served the withdrawn 28/09 soft photos (625-px canvas) for the same file names —
  `/_next/image?…variant-pink-berry.webp&w=1080` returned 625×625 in 5 of 9 requests (`_incoming/web-product-images/
  m-bar-10k/sharp/probe.log`; checker reproduced 7/9). Second, smaller cause: stray specks in the cut-outs put the product
  at 697–820 px instead of 840. Fix (#109): `scripts/flatcut.js` despeckles; replaced photos ship as `*-v2.webp`
  (`process-images` `fileName`). Live after deploy: M Bar Pink Berry at real phone pixels 2.9× more edge detail (Laplacian
  404 vs 139). Audit of all 97 product images replaced in 30 days (`scripts/stale-image-audit.js`,
  `_incoming/cache-audit/report.md`): 2 other files differ at their raw /assets URL — caliburn-g3-pro-koko variant-emerald-green and caliburn-g4 variant-glacier-blue — but the /_next/image copies the product page loads match the repo file (thumbnail diff 0.2–0.3, same size), so nothing visible; M Bar 10K could not be in that table (its old names were already gone from the branch) and was proven by probe.log. Cloudflare also flips WebP/JPEG for the same URL
  (it caches without the Accept header) — a Cloudflare setting, owner's dashboard.
- Muro Connector card-v2 live (3/4 view, 840 px). Credits unchanged this part (451.1).
- Not started (next chat): Nexbar + WOTOFO (one PR), (D) out-of-stock suggestion, (B) angled views, (C) card sweep —
  from the live audit Javis listed (cards < 800 px, white-background Coil cards, 7 products with no card).

## Step 3 — Higgsfield trial kit (not run: Friday cannot log in)

`_incoming/image-fix/higgsfield/m-bar-10k/` — `refs/` (the live card as device truth + 12 flavour cut-outs on flat grey),
`prompt.txt` (Grape first), `วิธีทำ-Higgsfield.txt` (owner/Javis steps). Results go to `out/`; Friday checks them with
`scripts/ai-fidelity-sheet.js` and sends the 3x/1440 preview before anything goes live.

## Fourth chat (29/09) — M Bar 10K complete, WebP fix, card standard

Three PRs merged (merge commits; each checker-passed and GitHub checks green; figures below are the main agent's report
[เชื่อว่า], merge hashes `5731113` and `257b6ef` seen in the git log).
- **#111 → `f3aad9f` — M Bar 10K, last 5 flavours (12/12 now):** Blue Ice, Kyoho Grape, Menthol Blast, Strawberry Kiwi,
  Yellow Mint. Method: Higgsfield recolour of the owner-passed Grape render (reference 1 = template) with the maker photo
  cropped to box front + device (reference 2), so the mint leaf / grape props never reach the AI. 5/5 on the first try
  except Kyoho and Menthol, redone once for a too-bright device base (an explicit colour note fixed it). IoU 0.978–0.985,
  colour median ΔE 1.5–2.1; max ΔE over the 6 threshold on 3 files — Blue Ice 21.1 and Menthol Blast 19.3 (the cell
  where the maker photo shows the mint leaf), Strawberry Kiwi 13.3 (device base; magenta checked by eye against the maker
  photo) — so the numbers read FAIL there and the human pass decided (IMAGE_SPEC §7); sharpness gate 5/5. Live-verified (after shots `_incoming/mbar10k-full/after/`, sheets
  `flavours-before-after-390.png` / `-1440.png`). 14 credits. Checker caught a missing `content-dates.json` update
  (fixed, re-check pass).
- **#113 → `5731113` — black-square fix:** `src/proxy.ts` (matcher `/_next/image` only) adds `image/webp` to `Accept`, so
  the optimizer never falls back to JPEG. JPEG has no alpha: transparent photos came out on a BLACK square and Cloudflare
  served that to visitors (evidence `_incoming/mbar10k-full/pb.jpg`, 1000×1000 JPEG, corner pixel 0,0,0). The
  `i18n-contract-test` geo guard used to fail on the mere existence of `src/proxy.ts`; it now pins the proxy's code token
  for token (the checker bypassed a pattern-based version 4 ways). Baseline 7 pages HTML identical to live (html-diff 7/7).
  The first deploy run failed on a flaky "next start on 3411 stopped" step (31/32 passed); the owner pressed Re-run →
  success. Live: `Accept: */*` → image/webp, 3/3. Old JPEG copies may stay in Cloudflare up to 30 days unless the owner
  presses Purge Everything (asked, not confirmed done).
- **#112 → `257b6ef` — shop-wide card standard:** `scripts/process-images.ts` writes role "card" on a 1000×1250 (4:5)
  canvas with the product at 94% — the listing card frame is 4:5, and square cards showed the product at ~67% of the
  frame (e.g. Muro), portrait ones ~99% (e.g. Nexbar). IMAGE_SPEC §1/§3/§8 updated. M Bar 10K `card-v2.webp` = Higgsfield
  nano_banana_pro 4K remake of the 463×925 maker card, same 3/4 tilt, IoU 0.993, ΔE max 3.0. It reaches baseline page
  `/products/m-bar-15k` (related box) — only the image URL changed there (html-diff proves it); owner approved merging now.
  The home page cinematic scene still uses the old `m-bar-10k/card.webp` (`cinematic/` is on the Do-not-touch list) — old
  file kept. 6 credits.
- **Credits:** Higgsfield 361.1 at chat start (not 451.1 — 84 went to Seedance video jobs, not web work), 309.1 now.
- **Verify (light set):** checker #111 5/5 after one fix · #113 pass + guard redone · #112 5/5; tsc 0; `verify:catalog`
  29/29; sharpness gate PASS on each; GitHub `verify:catalog --full` 32/32 on each merged head.

### Nexbar Clear 18K + WOTOFO — planner's plan and trial (not merged; waiting on the owner's photo choice)
- **Two PRs, both BIG (13.7).** PR-A first: add the WOTOFO product(s), so WOTOFO never becomes an empty brand
  (`brandsWithProducts()` would drop it from the footer of every page, incl. the 7 baseline pages). PR-B: Pod-180
  brandless — a new `brandless` flag in the product-master schema (not a pseudo-brand); display name "nexBar CLEAR 18K";
  15 flavours per the owner's poster, 5 of them not in Shipnity → shown via `VERIFIED_ADDITIONAL_VARIANTS`; spec 650 mAh ·
  18 mL · Dual Nex Mesh · 18,000 puffs · Type-C · airflow · Normal/Turbo; price ฿359 untouched; clip YhtKKjRwF3Q + the old
  card move to the WOTOFO product; ~15 files.
- **WOTOFO product:** Wotofo nexBAR 18K (wotofo.com/products/wotofo-nexbar-18k) — 15 variants on the maker's store though
  its copy says "20 flavors"; the gallery shows ~21 flavour names. Our current Pod-180 card = the official Lemon Lime image
  of this exact model.
- **Trial:** official photos are 1080 JPG on pure black, product ~650 px → background removed with Higgsfield
  `image_background_remover` (1 credit each, clean), then `nano_banana_pro` remake on flat grey with an explicit
  instruction for the tiny NORM/TURBO screen labels. Card (4K 4:5) IoU 0.996, ΔE max 6.6. 7 flavour remakes (Strawberry
  Banana, Mango Ice, Peach Ice, Mixed Berries, Peach Mango Watermelon, Strawberry Kiwi, Guava Kiwi Passion Fruit) +
  Watermelon Ice = 8 of 15 with an official reference; 7 have none (Cherry Ice, Forest Berries, Hawaiian Shore Ice, Melon
  Kiwi Banana, Pomegranate Ice, Strawberry Ice, Three Melons). Files `_incoming/wotofo/`. The bytedance upscaler was tried
  and dropped (garbles tiny text, noisy background). WOTOFO trial spend so far: 32 credits.
- **Waiting on owner:** remade photos (recommended) vs the official photos cut out at real size (smaller).
- **Next, in order:** (1) Nexbar + WOTOFO as above · (2) (D) out-of-stock suggestion (Esko) — designer first · (3) (C)/(B)
  card sweep on the new 4:5 standard, Muro card first, best sellers first, not hidden products. Baseline pages untouched
  until 06/10.
