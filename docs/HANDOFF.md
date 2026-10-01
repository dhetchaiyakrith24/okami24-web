# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 01/10–02/10 chat merged #176 `32324a5` Caliburn G3 Pro 16 UWELL colours
  (was 6) + card-v2, old 6-colour lineup removed (checker 7/7 · GitHub checks green · self-merge-check BIG) [ตรวจแล้ว]; deploy
  36887311640, live [ตรวจแล้ว — curl: 16/16 colour files 200, page serves card-v2, no old lineup] · owner: "ผ่านครับ" (01/10).
  Then #177 `d8bf903` Drag 6 all-colours lineup-v2.webp (owner's pick "VMATE MAX") + home Scene3Voopoo = home-brown-v2.webp
  (owner approved touching cinematic/ for this one swap) (checker 6/6 · checks green · BIG · head-check 7/7 baseline pages
  head/H1/JSON-LD same) [ตรวจแล้ว]; deploy 36895480132, live [ตรวจแล้ว — curl: lineup-v2 200, home-brown-v2 200]. Revert = its merge.
  Owner on the live Drag 6 lineup (01/10 late): "ยังดูเล็กไปหน่อย" + it looks like a graphic, not a studio photo (no studio light,
  no shading on the body, no cast/floor shadow, too much white on the body) → redo (item 3b (1)).
2 ahead of main: `git log --oneline origin/main..<branch>` — only the docs PR of this §16 (#178 = IMAGE_SPEC layout rule + LESSONS ช7 merged
  09c7551) [ตรวจแล้ว — git]. Test server on 3412 may still be up (build of 7de0bd4): `node scripts/test-server.js status` / `stop`.
3 OPEN: round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (`docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`, working files
  `_incoming/image-sitewide/`; this batch `b-edge/` (README = `b-edge/sources.md` + `jobs.tsv`); UWELL scripts `b-uwell/`,
  VOOPOO `b-voopoo/`, coils `b-coils/`).
  OWNER 01/10 evening [ตรวจแล้ว — chat], overriding the round file (its 【ห้ามแตะ】 line on the 7 baseline pages still reads
  "until 05/10" — the file is the owner's, not edited): (a) the 7 SEO baseline pages MAY get image work now; [Friday's
  condition — เชื่อว่า]: images only, title/meta/H1/JSON-LD untouched — prove it with `b-edge/head-check.js` (live vs local
  HTML of the 7 pages) · (b) all-options image for pod systems = `docs/IMAGE_SPEC.md` §0 item 5 · (c) "finish the image work".
  ALL-COLOURS LAYOUT (owner 01/10 — rule in IMAGE_SPEC §0 item 5 "การจัดวาง"): few colours = UWELL float/tilt/layers · many =
  OKami's own poster layouts, every device whole, gaps, one hero. Composer `b-edge/d6-poster.js` (VMATE · V THRU · RELX · VEUZ fan;
  canvas sized from bounds) — copy it per product. Rejected (do not retry): stagger/arc/fan of round 1, UWELL tilt-cascade of 7
  ("แข็งๆ"), depth-cue cascade / V-wings (lesson ช7), G3 Pro fan + two rows of 16 ("ไม่ผ่านเลย").
  OWNER 01/10 late [ตรวจแล้ว — chat]: (a) the RELX Phantom poster layout (one tilt, zigzag high/low, every device whole) is OK
  "แต่ไม่อยากให้แบบตายตัว อยากให้มีการจัดวาง หลายหลายแบบในแต่ละแบรน" = vary the layout per brand (not one layout site-wide);
  (b) G3 Pro = two groups of 8 → TWO "ทั้งหมด" chips/images ("ทำเป็นหัวข้อ ทั้งหมด 2 ชิ้น", or a better idea) — needs a code change
  (`lineupImage` is one image today; ProductHero / ColorVariantRail) = tier B; (c) try B (AI relight) — done, see below.
  RELX composer with studio floor + highlight roll-off: `b-edge/relx-studio.js d6 | g3p-a | g3p-b` → `b-edge/relx/<key>.png`
  (drafts sent: `b-edge/relx/sheet.png`). B test (4 credits, job 55c8aa47, nano_banana_pro 4K, reference = relx/d6-page.png, prompt
  in jobs.tsv row B1 / this chat): `b-edge/relx/d6-B1.png` — light, shading, glossy floor = clearly more photographic, BUT AI changed
  details (EVEREST LAB badge → scribble, screen text garbled, "VOOPOO" on the black tank → "17BECO", gold wheel → flat window —
  `relx/d6-AB-zoom.png`) → NOT publishable as is (IMAGE_SPEC §0 item 7). Friday's proposal [รอเจ้าของ (37)]: HYBRID = keep the
  script image's devices (100% true) and transfer only B's low-frequency light (blur(B)/blur(A) luminance ratio, large sigma) + B's
  floor reflections/shadows below the feet; 0 extra credits; the background stays transparent (IMAGE_SPEC §0 item 6).
  THE METHODS THAT WORK: (a) one model, colours differ only in colour = ONE master + recolour by script — silver master:
  `b-uwell/recolour-g4c.js`; coloured master: `b-voopoo/recolour-g3m.js` (lesson 23); GRADIENT colours = targets per height band:
  `b-edge/recolour-g4m.js` (body) and `b-edge/recolour-g3p.js` (frame round a screen, masks `b-uwell/masks.js`); colour targets
  from the MAKER's own photo/chart; swatch = median of the maker's photo (G3 Pro: the BACK panel; multi-tone = the more
  colourful half — `b-edge/presize-g3p.js`) · (b) each colour its own print/texture = the night render of each colour (Drag 6,
  ARGUS P3 `b-voopoo/p3tone.js`) · (c) single option = night card render · card from a set = tilt one colour 12°
  (`_incoming/image-sitewide/tilt-card.js`). CUT-OUT (lesson พ11): Higgsfield remover → `b-edge/choke.js` · device clearly unlike
  the studio grey → `scripts/flatcut.js` · ALWAYS zoom 4x on dark + magenta (`b-edge/edgezoom.js`) before use. Then presize + map
  entries (`b-edge/presize-g3p.js` pattern) + `npx tsx scripts/process-images.ts --only <slug>` (new file names, lesson พ6). Check
  every render for MIRRORING. Edits to CRLF files = a .js edit script (`b-edge/edit-g3p-data.js` pattern) — sed/Edit strip CR.
  Done this round: G4 Pro KOKO, G3 Pro KOKO, G4 Classic, ARGUS G3 mini, ARGUS P3 colours, Zero Nano, ARGUS G4 mini, Drag 6 (colours
  + lineup + home card), Caliburn G3 Pro (16 colours + card).
  OWNER 02/10 (question cards) [ตรวจแล้ว — chat]: image standard = UWELL's official Caliburn G5 renders (balanced light, no blown
  white, real reflection lines; shadow placement = designer's call) for EVERY image below standard — rule IMAGE_SPEC §0 item 8 ·
  background = transparent + soft shadow/reflection as semi-transparent pixels (no dark box) · wants to SEE one lifestyle sample
  like UWELL's real-shot.webp (owner item 38) · Drag 6: prefers the photographic look of B (`relx/d6-B1.png`) but asked whether it
  fits the site — answer given: B's light + the true devices (hybrid), transparent, shown on the local test server page first.
  OWNER 02/10 later [ตรวจแล้ว — chat]: "หยุดงานรูปทุกอย่างและ Focus Caliburn 5 ทุกสี ทุกรูป รูปรวม ให้เสร็จก่อนจะได้เป็นแบบให้ทั้งเว็บ"
  → nothing else in 3b until Caliburn G5 is done. Owner also wants EVERY product like M Bar 10K's lower page + extra article text
  for SEO. Today only 5 products have the "รายละเอียดเพิ่มเติม" story (`storyDetails: true`: m-bar-10k · m-bar-9k · m-switch-kit ·
  infy-20k · muro-sc-8000; no UWELL product) [ตรวจแล้ว — grep]; it is part of THIS round's goal (round file: maker posters) but was
  pushed back by the edge-defect fixes. Article TEXT for it = the separate round "รอบบทความ-รายละเอียดเพิ่มเติม" (round file
  【ห้ามแตะ】) — instruction file waiting in branch `inbox` `rounds/รอบบทความ-รายละเอียดเพิ่มเติม.txt` (Friday 02/10, 7 batches). Friday's plan [เชื่อว่า — told the owner 02/10]: Caliburn G5 template = every colour + card + all-colours
  image to IMAGE_SPEC §0 item 8 + its "รายละเอียดเพิ่มเติม" story from UWELL's own posters; then roll the template out; the article
  round opens after this round, G5 first (one chat = one round, central §12 item 30).
3b NEXT — ORDER (owner 02/10: Caliburn G5 colours FIRST; owner 01/10: Esko LAST):
  (0) Caliburn G5 — every colour except Mystic Forest (owner: broken edges, patch marks); standard = UWELL's own renders
  (files.myuwell.com/uwell/product/caliburn-g5/…); caliburn-g5 is an SEO baseline page → images only + head-check 7/7.
  (1) Drag 6 lineup redo = RELX layout (`relx-studio.js d6`) + HYBRID light (owner 02/10: the photographic look), bigger in
  the frame; show it on the local page (390 + 1440) to the owner before publishing; publish as lineup-v3.webp (new name, lesson พ6) with the same proof as #177 (head-check 7/7, visible-text, gallery-probe).
  Then Caliburn G3 Pro: two "ทั้งหมด" (g3p-a / g3p-b, 8 each, UWELL order) — code change for two lineups + the two images; a
  DIFFERENT layout from Drag 6 per the owner's "vary per brand" (VOOPOO = RELX zigzag → UWELL e.g. V THRU or VMATE).
  (2) rest of the edge-defect list (`edge-audit/visual-audit.md`, agent's eye): vinci-s · vmate-i3 · drag-x3 · zero-pro ·
  m-bar-15k (options soft) · muro-3ml · coil-1/38/53/54/56/74/94 · borderline argus-p3 card · drag-s3 · coil-89 · zero-cartridge ·
  white boxes coil-55/70/72/83/87 · mood-monster-14k. Night renders that exist: drag-s3 / drag-x3 / vinci-s colours (from retailer
  cut-outs — choke + zoom) · argus-g4 card a/b. Remake from the maker's photos, never from the old cut-out (lesson 22).
  (3) all-colours image (poster layouts) for the other pod systems — G3 mini (9) · G4 Classic (4) · G4 mini (8, old lineup.webp still
  used) · ARGUS P3 · then the rest that have colour variants.
  (4) coils — `b-coils/README.txt` (references found for the first 8, nothing generated).
  (5) argus-g4 + Argus Multi-Ohm + ARGUS P3 card-v2 + openOnCardPhoto for P3 + M Bar 15K duplicate record (= M Switch Kit).
  (6) BATCH 5 rest of the site (planner first; joiway-f4 · relx-creator · relx-smash-go-12k …; TFIT M Power after a researcher) ·
  (7) Esko pod-159 LAST (stock/cart = 13.7 big (2), full set, own PR, + BSOT §21).
  Higgsfield: 178.6 credits after the B test 01/10 late [ตรวจแล้ว — balance 182.6 before − 4]; 4K = 4, nano 2K = 2, remover = 1 · tell the
  owner the credits for a whole set before starting it (IMAGE_SPEC §0 item 7).
  At the round close: `npx tsx scripts/asset-refs.ts` for unreferenced product photos (list in item 5).
4 waiting on owner:
  (38) one lifestyle sample like UWELL's real-shot.webp (scene + props) — the owner wants to see it before deciding where it goes.
  (28) Thai copy flags from thai-copy (not changed): INFY `descriptionTh` says disposable-only brand · shared strings
       "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" / "สินค้าที่คุณอาจสนใจ" stiff · RELX Creator = "เครื่องระบบสวิตช์" or keep "เครื่องใช้ซ้ำ"
  (14) category structure — its own round · (1) image-theft protection · (2) Muro Connector category · (3) SALTHUB per-flavour
       file request
5 open / dated:
  - Drag 6 tank: retailers name it UFORCE-X Tank II, the data has a "gene-tt-3" highlight — data check in a data round [เชื่อว่า].
  - coil-94's Shipnity name "UWELL คอยล์ Caliburn G4&G3 Series" shows in Thai on en/zh pages that link it (locale-hydration-scan
    FAIL on /products/caliburn-g3-pro en+zh — same on live before #176, not from it) [ตรวจแล้ว] — data round.
  - 05/10: re-read GSC against `docs/SEO_BASELINE.md`; after 05/10 the 7 baseline pages use the light set — delete
    `galleryNoteHeld` + `heldNote`; M Bar 10K airflow row; then drop the "ถึง 05/10" clauses of TEAM_RULES 13.5 #3 / 13.7 / 13.8.
  - `lineupFirst` has no product left — the mechanism can go in a cleanup.
  - `dict.product.anatomyTitle` en/zh "from the outside in" (pre-existing).
  - `_incoming/` folders moved out 01/10 to `C:\Users\dhetc\OKami24-เก็บ\incoming-01-10\` (not deleted).
  - Known lock limits (checker accepted): a ban hidden inside `bash -c '…'` / `python -c` is not seen by the hook.
  - visible-text.js: "font fingerprint differs" on the 01/10 vt-d6 pair (vt-g3p was "same machine") — watch if it repeats [เชื่อว่า].
  - Carried ideas: card sweep on 4:5 · ARTICLE round · category-structure round.
  - Unreferenced (sweep at the round close): the six round lineups, G3 Pro KOKO lineup.webp + old variant files, G4 Pro KOKO old
    variant files (card.png stays — home Scene2), G4 Classic card.png / lineup.webp / old variants + variant-alpine-green-v2.webp,
    argus-g3-mini card.webp / lineup.webp / variants/*, argus-p3 lineup.webp + variants/* EXCEPT variants/blue-leather.webp,
    zero-nano card.webp, argus-g4-mini variants/* (lineup.webp still used), drag-6 variants/* + card.png + lineup.webp,
    caliburn-g3-pro card.webp + lineup.webp + variant-{emerald-green,midnight-black,rose-gold,space-gray,stone-gray}.webp
    [เชื่อว่า — grep; asset-refs.ts not run].
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Latest light set [ตรวจแล้ว — run this chat]: PR #176 — tsc 0 · verify:catalog 29/29 · scan.js 0/107 · gallery-probe `--sitemap`
  45/61 pages PASS both modes, 0 FLASH/STUCK · visible-text 27 changes / 21 groups all explained (`b-edge/vt-g3p-diff/`) ·
  PR #177 — tsc 0 · verify:catalog 29/29 · gallery-probe both modes PASS · visible-text 0 changes (`b-edge/vt-d6-diff/`) ·
  head-check 7/7 (`b-edge/html-d6/`).
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + `docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`
```

## 17. Tools and standing technical rules (not state — open when needed)

```
Do not touch unless the round file names it: layout outside the named spot · images (outside an image round) · motion ·
  ordering-mode.ts · slug/URL/sitemap/structured data · service pages · Hero.tsx · cinematic/ · THAI_STYLE group ก ·
  labelTh/name/shortName · lg:min-h-10 · age/nicotine warnings · colour/flavour names · thai-typography.ts list ·
  CategoryLabel.tsx / label-lang · card-headline-spec.ts rules · dictionary catalog.card* / trust.* (set ก) · TrustBar row
  layout / 4 icons · sticky th on /compare · ScrollHintFrame · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on
  "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools · THAI_STYLE_LOG §7 rows of
  round 30.4ข · ProductHero stats / PuffCount / Coil-72/89 category (data round) · footer.tagline / cart (their own rounds)
  — never: joiner/NBSP outside the list · two Chrome jobs at once · fixing tier-B orphan words one by one · placeholders
  in an empty spec row · screenshots without a scan first (13.5 #7)
Site copy (every round): every new sentence = 3 languages and the owner rules the Thai (13.3 "ask as one set") · every
  number points at a verified spec row · no U+2060/NBSP outside the mechanism · thaiTypography() has a locale guard ·
  generated evidence mirrors the component logic in full · forbidden claims = THAI_STYLE §3 (one list) · prices are
  never typed — always read live from the catalog (`priceOf` / `getCatalogItem`)
Test server: `node scripts/test-server.js build` then `start` (port 3412 · SITE_URL=https://okami24.store ·
  OKAMI24_DATA_DIR=<tmp> · backup and startup probe off · log `_incoming/test-server-3412.log`) · a new build needs
  stop → start · stop = `node scripts/test-server.js stop` (kills only the PID on 3412 · `status`) ·
  port 3000 + `.claude/launch.json` "vapor-dev" = the owner's own dev server, agents never start it · never build while
  the server runs (`test-server.js build` and `verify:catalog --full` refuse; a bare `next build` has no gate) ·
  Chrome one job at a time · a job over 10 minutes = background + watch the log
Windows shell: scripts are written with the Write tool · Thai text enters scripts through json/txt files only (argv is
  mangled) · shot.js wraps the eval result in JSON twice (parse twice) · CRLF: a new file from Write = LF → unix2dos
  before git add · `scripts/eol-check.js --staged` runs in .githooks/pre-commit (hooks on after a clone:
  `node scripts/prepare-clone.js`, `docs/RECOVERY.md` 2ค) · .githooks/ files are always LF · Git Bash turns an arg "/"
  into a path → MSYS_NO_PATHCONV=1 · the cloud is Linux (no autocrlf; `test-server.js stop` works there too)
Tools in scripts/ (usage = each file's head): shot.js · head-audit.js (head/links of every sitemap page) · site-audit.js ·
  scan.js · locale-hydration-scan.js · visible-text.js · wordbreak-scan.js + wb-diff.js · linemap-scan.js · html-diff.js ·
  overflow-390.js · og-gate.js · gallery-probe.js (touch/swipe every frame, `--sitemap`) · stale-image-audit.js ·
  flatcut.js · card-lines.js + card-lines-diff.js · empty-cards.ts · finder-dump.ts · measure-articles.ts ·
  related-boxes.ts · guide-reading-rate.ts · record-scroll.js + frames-to-gif.js · self-merge-check.js (13.7)
src files the skills use (the one list — skills may not name a file under src/, 13.2; fix a renamed file here):
  [i18n-test] `npx tsx src/i18n/i18n-contract-test.ts` · [catalog-method] `src/data/shipnity-seed/README.md` section
  "Catalog reconciliation methodology" · [legacy-products] `src/data/products/*.ts` · [taxonomy]
  `src/data/shipnity-seed/active-catalog-to-product-master.ts` (`TAXONOMY_MATCHES`) · [spec-gate]
  `src/lib/verified-specs.ts` + `src/lib/verified-specs-contract-test.ts`
Verify: which set = 13.5 · the full list with commands = skill `round-close` step 3 · pass = what each script prints ·
  the last full-set counts = §16 item 6
Git: commit message English, prefix feat/fix/copy/data/docs/chore/agents/rules · Thai text via `git commit -F <file>` ·
  push/merge/deploy = 13.7 · tag = skill `round-close` step 5
Agents: when to call each = the `description` line of its file in `.claude/agents/` · never one call per sub-item ·
  an agent added or edited is usable at once in the running chat
```

## 18. Permanent owner rulings — settled, never re-ask (central §12 item 17)

Business facts live in `docs/BUSINESS_SOURCE_OF_TRUTH.md`, Thai words in `docs/THAI_STYLE.md`, images in
`docs/IMAGE_SPEC.md`; this list holds the rulings that have no other home. A ruling that is replaced = overwrite its line.

**Shop and ordering:** the cart is closed (LAUNCH_AUDIT item 43) → LINE @okm24 · never propose reopening it · the 4
service pages (`/warranty /shipping /how-to-order /privacy`) are not touched and carry no JSON-LD on purpose (item 49) ·
admin page and OTP are parked · caliburn-g4-pro = Pod-181 · muro-3ml = ฿99 · overwrite the 20 owner-estimate rows in
`legacy-price-approvals.ts` only when the stock API lands.

**Head copy and SEO:** e-liquid stock is 0 on the storefront → "น้ำยา" stays out of head copy except `/e-liquid` itself ·
"พอตไฟฟ้า" and "บุหรี่ไฟฟ้า" are both allowed in head copy · misspelled search terms → hidden search aliases only, never
visible copy · "Marbo" in Latin only in visible copy (aliases hidden) · the head-copy trim rule: cut at a sentence/phrase
boundary, never mid-word, never a dangling connective, never a bare floating number, never a stranded clause-opener
(THAI_STYLE_LOG §7) · round 7 close (SEO ค): home word order · guides "คืออะไร"/"ยี่ห้อไหนดี" · `/e-liquid` "น้ำยา" exception ·
Marbo + M Bar plan · FAQ wholesale phrase · RINCOE/DOTMOD phrase · home index DONE · LINE counter option ก · breadcrumb
NOT done (full wording: `git show aa21cbb:docs/HANDOFF.md` lines 262–275) · `okami24.net` / `.com` NXDOMAIN — leave them · `voopooTitle` rename NOT done · no `OKAMI24_METRICS_TOKEN` — read the
Render Web Shell instead (`docs/DEPLOY-RENDER.md`).

**Copy and wording:** words already on the site without a key are not "new words" · `readMoreEyebrow` = "อ่านต่อ", not
`footer.learn` · en/zh age-gate wording and en/zh `/about` copy APPROVED · the dialog nicotine sentence stays plain group ก ·
SALTHUB wording = option ข-1, no "แท้" · SALTHUB owns Marbo/M Bar (BSOT §21) · the 8 words locked as one set in THAI_STYLE §3 ·
5 typography WORD JOINER bindings allowed (THAI_STYLE §5) · zh H1 wrapping mid-word (服/务) at 390 — leave it · collapsed
LINE pill off-centre icon — the owner's own list · no NBSP outside the list · an empty product card may show a real maker
fact or the desktop-style option count, never placeholder text · spec-table header on INFY / RELX ("ข้อมูลที่ยืนยันได้จริง …")
— no label, leave as is (01/10).

**Product facts (data rounds 24–25/09, 30/09):** a per-row source link is required for rows touched in a round + rows of
the 7 products the live 10B guides link to; older verified rows are grandfathered · every unverified number is hidden
from render · when a fact is missing, state the fact or say nothing — never explain the absence · product facts come
from the manufacturer only, everywhere on the site (THAI_STYLE) — named exceptions only: Joiway F4 "2 โหมด 2 รส" (the
shop's own 30-day YouTube review) · INFY 20K 20 mL + adjustable airflow (owner's ruling as source) · RELX Creator pod fit
Creator 20K + Muro Connector ("ร้านยืนยัน") · Esko Bar Switch 20K shows all 20 of the maker's flavours · "magnetic /
แม่เหล็ก" only where the maker's own page, poster or manual says so (VOOPOO's unreachable site = the one open question).

**01/10 (owner, chat):** Esko pod-159 — show every flavour as available for now, no "หมด" badge ("โชว์ทุกกลิ่นว่ามีของไปก่อน") ·
UWELL G4 Pro KOKO — UWELL's own site is the reference for its look ("อ้างอิงเว็บหลักได้เลย") · M Bar 10K opens on the card ·
จอพิกเซล / หน้าอีโมจิ approved (THAI_STYLE §3) · later the same day: the KOKO sheet "ทำเลย" · the G4 Pro KOKO card may change
the caliburn-g5 baseline page's related box ("ไม่รอผล ทำเลย") · Desert Gold / Golden Carbon back views via Higgsfield (stored,
not on the site) · leftover credits = next in the queue, unclear source = skip.

**Images:** the first photo of a multi-option product = one sharp single device, Caliburn style; other colours/flavours
by swipe (IMAGE_SPEC §0 item 5) · all-options image ("ทั้งหมด"): pod systems get a NEW one (owner 01/10 evening, design left
to Friday: plain, luxurious, premium, depth); disposables / pod-replacement products get none (IMAGE_SPEC §0 item 5) ·
every product gets an SEO article in "more details" = its own later round.
