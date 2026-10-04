# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 04/10 chat (4th) merged #262 = df2a99c (batch 2e, BIG by
  voopoo.ts; checker r1 FAIL → 2b8f7df → r2 PASS 4/4; GitHub green): ARGUS G4 mini + G3 mini on the template. Deploy run
  37217601575 success; live 04/10 ~23:55: both pages serve every story-*.webp (200) [ตรวจแล้ว — gh + curl].
2 ahead of main [ตรวจแล้ว — git]: nothing but this docs PR. 2e material (not in git): `_incoming/sitewide-template/2/2e/`
  (facts-*.md · blocks.js · composite.js + up/ (the Higgsfield upscale) · copy-base.json · th.json · brief-2e.md · build.js ·
  apply.js · fix-*.js · gates.sh · vt-* scans · shots/ before/after 390+1440). Kits (never merge these branches):
  1b = branch `kit-1b` (also holds `_incoming/sitewide-template/scope.md`, the round scope) · 1c = branch `kit-1c`. Get one:
  `git fetch origin kit-1b && git restore --source origin/kit-1b --worktree -- _incoming/sitewide-template` · 1d + 2x material is
  local only (`_incoming/sitewide-template/1d/` facts-uwell.md = every UWELL fact with its file) — push a kit branch before a cloud
  chat needs it (`kit-1c` shows how).
3 OPEN: round "sitewide template, brand by brand" (`docs/rounds/รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt`, owner-approved 03/10).
  Template = `docs/PRODUCT_PAGE_TEMPLATE.md` (the one home). Scope = `_incoming/sitewide-template/scope.md` + the round file's
  【ขอบเขต】 block: 55 product pages; PM pages (coils, IQOS, pod-180) = cards/images only, no story mechanism.
  Batches (all tier B): 1 UWELL — DONE (1a G5 Lite + SE · 1b G4 + mini + Classic · 1c G4 Pro + KOKO · 1d G3 Pro + KOKO) ·
  2 VOOPOO (DONE: DRAG 6 #248 #251 #253 · DRAG S3 + X3 #255; + argus-g4/Multi-Ohm/M Bar 15K data) · 3 SALTHUB (+ zero-*, m-switch-pod,
  m-bar-15k) · 4 RELX/JOIWAY/TFIT · 5 small brands (+ mood-monster, muro-*, pod-180) · 6 IQOS · 7 close (tag sitewide-template-done,
  asset-refs sweep of the 246 candidates, edge defects).
  BATCH 2 VOOPOO — 04/10: 2a #248 · 2b #251 · 2c #253 = DRAG 6 · 2d #255 = DRAG S3 + DRAG X3 · 2d-fix #259 ·
  2e #262 = ARGUS G4 mini + G3 mini.
  Still to do on the template: ARGUS P3 · VMATE i3 · ARGUS G4 (VINCI S off-limits). Pairs: 2f ARGUS P3 + VMATE i3 ·
  2g ARGUS G4 (+ Multi-Ohm, M Bar 15K data). One PR per pair = data + page (one build). NEXT = 2f, first step: `researcher`
  reads P3 / VMATE i3 file by file into `_incoming/sitewide-template/2/2f/facts-*.md` (the 2e brief shape: posters/story ·
  facts with line/file · contradictions). Both = one 1024-px "onepage" strip each → cut with 2d/cut-onepage.js first.
  2e = the pattern to copy (`2/2e/`): blocks.js (panel cuts via probe.js · portrait hero = block 1, no cover) · composite.js
  (2k upscale of a landscape strip block, VOOPOO's pixels back over every device) · brief-2e.md (fact budget) → thai-copy.
  2e tips: a fact left out of the text must be out of the posters too (LESSONS พ18) · weight goes in the dimensions row
  (a "…g" row before a Thai row starting with a digit breaks search — verify:catalog catches it).
  Older worked examples: DRAG 6 `2/2c/` (exploded view from a maker 4K multi-view sheet: anat-crop.js + anat-build.js) · S3/X3
  `2/2d/` (pale page background trimmed, light gap between tile pairs filled — checker #255, Owner eye #1). VOOPOO pages
  contradict themselves → leave those facts out, say so in a code comment. A maker parts view with English labels baked in is
  not an exploded sheet. Full-page shots: 2e/shots.js (eager images, --max-height 16000 --dpr 1).
  Material (not in git) `_incoming/sitewide-template/2/`: pages/*.html = the 7 shop pages (curl + `Referer: https://shop.voopoo.com/`;
  www.voopoo.com does not resolve here — researcher reads it through r.jina.ai) · posters/<slug>/ = every maker image (sheet.js
  <slug> = contact sheet) · research-voopoo.md = UNRELIABLE web summary → read maker files one by one · ARGUS G4 = `_incoming/argus-g4/`.
  VOICE for VOOPOO story copy (owner 04/10 on sample (49): "ผสมกัน"): Friday's reading = A's short calm titles + B's warmer everyday
  bodies — used on #253 + #255; owner saw DRAG 6 live, raised only the all-colours image (item 5) [เชื่อว่า voice accepted].
  Speed (owner 04/10): one build per batch (≈ 8 min) · whole-sitemap scan (≈ 20 min) only if a shared part changes.
  Gates per batch: `npm run verify:catalog` (fresh worktree: `npx next typegen` first) · page-text-length --facts · wordbreak-scan → reword
  · checker · scripts as .js files (Thai/backslash/backticks never through `node -e` or a heredoc).
  Off-limits: caliburn-g5 · vinci-s · Drag 6 colour images · pod-159 · cart/price/stock · service pages · head/title/JSON-LD.
3a THE IMAGE METHODS THAT WORK (kept for this round):
  (a) one model, colours differ only in colour = ONE master + recolour by script — silver master `b-uwell/recolour-g4c.js`; coloured
  master `b-voopoo/recolour-g3m.js` (lesson 23); gradients per height band `b-edge/recolour-g4m.js`, `b-edge/recolour-g3p.js` (masks
  `b-uwell/masks.js`); colour targets + swatch = median of the MAKER's photo · (b) each colour its own print = a night render per colour
  · (c) single option = night card render · card from a set = tilt one colour 12° (`_incoming/image-sitewide/tilt-card.js`) ·
  (d) maker pair files with an alpha gap = cut both devices whole by connected components (`_incoming/sitewide-template/1c-colours/
  split.js`, publish2.js: rotate ONCE to the final tilt, unsharp 0.65 — the sharpness gate fails a double rotation on light colours).
  (e) maker poster too small, no larger maker file (poster-stretch FAIL) = AI upscale + VOOPOO's pixels back over every letter AND
  every product-surface pattern (LESSONS 25 · `_incoming/sitewide-template/2/2dfix/`: upload.js → upscale "2k" → cmp.js letter gate
  → composite.js boxes → publish.js; cut-outs: zoom.js keeps the original alpha + edge band).
  CUT-OUT (lesson พ11): Higgsfield remover → `b-edge/choke.js` · unlike the studio grey → `scripts/flatcut.js` · ALWAYS zoom 4x on
  dark + magenta (`b-edge/edgezoom.js`). Then presize + map entries + `npx tsx scripts/process-images.ts --only <slug>` (new file
  names, lesson พ6). Check every render for MIRRORING. Run `npx tsx scripts/image-sharpness-gate.ts --base origin/main` before the
  checker. Paths under `_incoming/image-sitewide/`. Poster `transparent` only when ≥ 30 % of the file is transparent (LESSONS พ16).
  Lineups: UWELL slim = G5 "group" (`set1/poster.js`) · box = "cluster" (`set1/boxy.js`, `dsx/koko-two.js`) · VOOPOO = RELX
  (`dsx/vp-relx2.js`) · 7+ devices = two groups ("ทั้งหมด 1 / 2") · AI light only = HYBRID (`b-edge/d6-hybrid.js`, Drag 6 #248).
  Left from it: edge defects (`edge-audit/visual-audit.md`: vmate-i3 · zero-pro · m-bar-15k · muro-3ml · zero-cartridge ·
  mood-monster-14k · coils 1/38/53/54/56/74/89/94 + white boxes 55/70/72/83/87) · coils `b-coils/README.txt` · Esko pod-159 LAST
  (13.7 big (2), own PR, + BSOT §21).
  Higgsfield: credits without asking (IMAGE_SPEC §0 item 7) — `balance` first, report the spend (2k = 2 each · 2e: 1 job; balance
  279.1 before, 6,257.1 after = a top-up in between, so 2 = the price [เชื่อว่า]).
4 waiting on owner:
  Still to look at on live: G4 Pro + G4 Pro KOKO (1c) as a whole · G4 Pro new colours (c) · G4 mini two all-colours images (b) ·
  ARGUS G4 mini + G3 mini pages (2e #262; before/after shots `_incoming/sitewide-template/2/2e/shots/`).
  (2e) Thai words not in THAI_STYLE yet (thai-copy 04/10, used on the 2e pages): "ลายหมุด" (Clous de Paris) · "ความหนาแน่นสูง"
       (high-density) · "กำไว้ในมือได้มิด" · "MTL แบบลมโล่ง" (loose MTL) · TPD = "ในเวอร์ชัน TPD" (DRAG + 2e) vs "ตามมาตรฐาน TPD"
       (3 older places, THAI_STYLE §6) — Friday's pick: keep all, "ในเวอร์ชัน TPD" everywhere.
  (39) look at the Drag S3 / X3 / VINCI S colours + cards (#204) and the two-group lineups (#205-#207) on live — reversible by revert.
  (38) one lifestyle sample like UWELL's real-shot.webp — the owner wants to see it before deciding where it goes.
  (28) Thai copy flags (not changed): INFY `descriptionTh` says disposable-only brand · shared strings "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" /
       "สินค้าที่คุณอาจสนใจ" stiff · RELX Creator = "เครื่องระบบสวิตช์" or keep "เครื่องใช้ซ้ำ" (batch 4 needs it)
  (14) category structure — its own round · (1) image-theft protection · (2) Muro Connector category · (3) SALTHUB per-flavour files
5 open / dated:
  - DEFERRED by the owner 04/10 ("ข้ามไปตัวอื่นก่อน ไว้ค่อยกลับมาแก้" — no date; Friday's plan: after the VOOPOO pages): DRAG S3 + X3 colour
    photos + two-group line-ups (owner on live #255: "ภาพสินค้า-รูปรวมยังดูเป็นกราฟฟิกเหมือนเดิม ทดไว้มาแก้รอบหลัง จดเอาไว้คู่กับ Drag 6") and the
    DRAG 6 all-colours image lineup-v3 — "รูปรวมยังเล็กไป สินค้ายังดู
    เป็นกราฟฟิก … ไว้ค่อยกลับมาแก้เรื่องภาพเหมือนกราฟฟิก" (same eye as LESSONS ช9: AI-made light reads as graphic; 7 devices too small).
    Also not fixed (checker #253 taste): text inside the 3 wide DRAG 6 posters ~6–7 px at 390 · "มีโหมด SMART RBA และ TC-TCR" reads as 2.
  - 7 highlight chips wrap 6 + 1 at 1440 on caliburn-g4-pro-koko and caliburn-g3-pro-koko (chip bar is lg:grid-cols-6) — shared
    component, its own small PR + whole-sitemap visible-text (checker #242: not a defect of 1d).
  - ARGUS G3 mini chip: VOOPOO names it "GENE AI 2.0" and "GENE TT 3.0" on the same voopoo.com page (researcher 04/10) → spec row
    dropped in 2e. Still says "GENE.AI": the G3 mini head tagline + shortDescription (SEO round; the tagline also splits «ให้เอง» at
    390) · `src/data/technology.ts` + technology-copy (the chips page uses the G3 mini as its GENE.AI example) · guides.ts +
    guides-copy (beginner guide "auto-draw … GENE.AI") — outside the round; fix together when a round owns them.
  - 2e taste notes (checker #262): "Clous | de Paris" splits at 390 · "tiny" poster captions ~7 px at 390 · G4 mini "pod" poster
    shows the pod seat, under a cartridge title.
  - G3 Pro KOKO data comment "color-N.webp 404" is outdated (UWELL has colors/0..7.webp; front/back overlap, so not cut) — fix next touch.
  - story-copy.ts G4 / G4 mini say the U-shaped channel "ช่วยให้ลมเดินดีขึ้น"; UWELL's KOKO poster says it stores condensate — check the
    G4 posters before changing (thai-copy flag 04/10).
  - `src/data/guides.ts` (which-Caliburn guide) still says G4 Classic specs are unconfirmed — verified in #233; guides = outside round.
  - G4 `firing` row ("draw or button") is sourced from the manuals.plus copy of UWELL's manual, not a UWELL page (thai-copy flag 03/10).
  - DRAG 6 head copy (off-limits → SEO round): shortDescription en "The current DRAG-series flagship" / th "รุ่นเรือธงล่าสุดของสาย
    DRAG" is not VOOPOO's wording, and th "(ถ่าน 2200mAh สองก้อน)" uses the locked word for removable cells + a layer-4 bracket.
  - DRAG 6 tank spec row splits "UFORCE-X | Tank II" at 390 (checker accepted ×3) · /guides/reading-a-spec-sheet still cites a
    retailer list for the DRAG X3 coil (guides.ts ~214 + guides-copy th/zh) — maker-only rule, fix when X3 is read (batch 2) ·
    compat-copy-th "DRAG-series coil pod" → "หัวพอตสาย DRAG (เปลี่ยนคอยล์ได้)" has a bracket and "สาย" (locked for flavour lines).
  - coil-94's Thai Shipnity name "UWELL คอยล์ Caliburn G4&G3 Series" shows on en/zh pages that link it (locale-hydration FAIL on
    caliburn-g3-pro(-koko), -g4-pro(-koko), -g5 en+zh, same on live) [ตรวจแล้ว] — data round.
  - Head copy off-limits this round, wrong since 1c (SEO round): KOKO (G4 Pro) shortDescription "2 นิ้ว" + "Custom" · G4 Pro tagline +
    shortDescription both say 2.51. `src/data/technology.ts` onboard-touch-displays calls the KOKO modes "draw modes" — outside round.
  - wordbreak on G4 Pro / KOKO: "…เติมน้ำยาได้โดยไม่ | ต้องถอดหัวออก" (1440) and "โดยไม่ | ต้องไปถึงพอตคิท" (KOKO 390) — negation at a
    line end in 1c text, found 03/10 after merge; reword with thai-copy in the next G4 Pro touch.
  - SEO round (owner 02/10: baseline hold lifted): GSC vs `docs/SEO_BASELINE.md` · delete `galleryNoteHeld` + `heldNote` +
    `TITLE_PRICE_HOLD_UNTIL_2026_10_05` · M Bar 10K airflow row · G5 hero tagline repeats · product FAQ answers absent from server HTML ·
    8 brand titles naming a model (cloud-results §2) · shared GPP note "Shared top-fill…" on 8 UWELL pages · (04/10, language
    part — timing = Friday's reading [เชื่อว่า]) remove the term brackets site-wide (THAI_STYLE layer 4; list = `node scripts/paren-terms.js`; keep device-screen ones) ·
    re-word the G3 Pro / G3 Pro KOKO / G4 Classic head lines with the reset `thai-copy` (#245 lines read curt).
  - `lineupFirst` has no product left — cleanup · `dict.product.anatomyTitle` en/zh "from the outside in" · zh spec/FAQ English site-wide ·
    article H3 font reads narrow (designer note).
  - Housekeeping queue: OneDrive `Run prompt\New prompt WEB\2-ยังไม่ทำ\รอบเก็บบ้าน-ครั้งถัดไป-ของที่รอ.txt` (+ owner 03/10 (D) lower
    chat-move threshold in image rounds · (E) lighter rules) · stale empty folder `_incoming/wt-d` (Windows lock, delete later).
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + `docs/rounds/รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt`
  (cloud chat: + `docs/CLOUD.md` item 3)
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
  related-boxes.ts · guide-reading-rate.ts · record-scroll.js + frames-to-gif.js · self-merge-check.js (13.7) ·
  poster-stretch.js (story poster/cover/anatomy file width vs drawn width, LESSONS พ17)
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

**SEO baseline hold (owner 02/10):** the 05/10 wait is cancelled — "รอไปก็ต้องกลับมาแก้ ไว้ไปขัดเกลารอบ Seo สุดท้ายขอดัชนีใหม่" —
the 7 baseline pages are worked on like any other page; the final SEO round polishes them and asks Google to re-index
(the code-level title-price hold `TITLE_PRICE_HOLD_UNTIL_2026_10_05` is a title change = that round).

**Text length per product page (owner 03/10):** 1,000–3,500 unique Thai characters of main content (spec table not counted) +
the same fact at most twice outside the spec table — "ตอนนี้กำลังสวย ไม่ต้องลดเนื้อหา" (proposal: `_incoming/g5-template/seo-text-length.md`).

**Brand logos (owner 03/10):** every brand's own logo goes on its product pages — "ใส่ตรงไหนตัดสินใจได้เลย"; Friday placed it
in the product hero in place of the brand chip, linked to the brand page; maker-served files only (light version for the dark site).

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

**Answered 03/10 (moved from §16 04/10):** "ultra-shatterproof" stays OFF both G4 Pro pages · G5 repeats = A keep · logos: Kardinal = the maker's "Kardinal" word logo, site name "KS" stays · DOTMOD = text chip · batch 1c words locked (THAI_STYLE ก้อน 1c) incl. "แรงถึงคอ".
