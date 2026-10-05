# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` = d8f8e97 (#290) [ตรวจแล้ว — git]. Chat 06/10 (afternoon) merged, checker PASS +
  deploy OK + live checked with curl [ตรวจแล้ว — gh + curl]: #288 M Bar 10K stage · #289 JOIWAY F4 = TWINS (Render serves ~2.5 min after
  the deploy run) · #290 RELX Creator "ทั้งหมด" image.
2 ahead of main [ตรวจแล้ว — git]: only this docs PR (§16 + LESSONS พ21 rewritten, พ24 new). No open PR. Material not in git:
  `_incoming/sitewide-template/` (3/3c · 4/4e · 4/4f = scripts, facts, shots, logs per batch). Kits (never merge): `kit-1b` · `kit-1c`
  — later batches are local only; push a kit before a cloud chat.
3 OPEN: round "sitewide template, brand by brand" (`docs/rounds/รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt`, owner-approved 03/10).
  Template = `docs/PRODUCT_PAGE_TEMPLATE.md`. Scope = the round file's 【ขอบเขต】 block; PM pages (coils, IQOS, pod-180) = images only.
  DONE: 1 UWELL · 2 VOOPOO (#248–#271) · 3 SALTHUB #273 #274 #275 #277 #288 · 4 #278 #280 #281 #282 #289 #290 · 5a #283 · 6 #284 ·
  7 part 1 #286. Product × part table: `_incoming/sitewide-template/7/table.md` (`npx tsx _incoming/sitewide-template/7/table.ts`).
  NEXT (owner answers 06/10 in §18; tier B each, one PR each):
    (d) 4b TFIT M Power 20K: unhide (`hiddenFromStorefront` in tfit.ts) — facts `_incoming/sitewide-template/4/facts-tfit-m-power-20k.md`
        (TFIT's own product; 18mL not 17mL). Needs: a card photo cut from TFIT's
        `posters/tfit-m-power-20k/10-smallpic.jpg` (white background — LESSONS พ23), TFIT's logo `4/logos/tfit-logo.webp`, stage from
        posters 01 cover + 03/04/06 (+05 or 09), head copy + FAQ doubt talk removed (wrong-fact fix allowed 06/10), spec rows. Flavour
        photos: none from TFIT → the option-photo round. Unhiding adds TFIT to the footer brand list on EVERY page (LESSONS พ7) =
        visible-text over the whole sitemap, before = build of main (13.5 #5, LESSONS พ20). Expect BIG (data).
    (e) M Bar 15K → reusable/pod-system category per SALTHUB (own PR, BIG) + story · wrong head-copy facts fixed now (§18 06/10:
        "cotton mesh / ชาร์จเร็ว / 15 รส"). Facts `_incoming/sitewide-template/3/facts-m-bar-15k.md`.
    (f) MOOOD Monster 14K: open mooodvapes.com/14000puffs/ in a real browser (DNS failed for the researcher); brand site → fix data
        (screenType, flavours, battery) + move it off "Unbranded" (BIG).
    Skipped by the owner: INFY 20K + Muro ×3 (no maker material) · pod-180 stays brandless.
  Then close the round (skill `round-close`, tag sitewide-template-done). Not this round: Q16 IQOS colour completeness and Q18 "every
  option gets a photo" (flavour photos Smash Go 10 · F3 30 · F4 16 (swatches are all the placeholder #7ed321) · Zero Cartridge 22 ·
  WOTOFO 11 · M Bar / M Switch / INFY / Muro / TFIT 10 + the 19 white-box coils) = write a new round file for the owner.
  Batch pattern (copy the last one): `3/3c` (split → stage) · `4/4e` (data fix + stage + cover) · `4/4f` (lineup image only):
  facts → copy-base.json → thai-copy → th.json → blocks.js → apply.js → gates.sh → shots → PR → checker. Line reading: `4/4e/lines.js <url>` (every wrapped Thai line) + `4/4e/try.js <url> <json>` (try wordings on the real text
  node) — LESSONS พ21. Long page shots drop posters on this machine → `4/4e/spots.js` per spot (LESSONS พ24).
  Traps LESSONS 24 + พ18 + พ20–พ24 · gates: verify:catalog · page-text-length --facts · wordbreak-scan + every new Thai line read
  at 390/1440 · checker (tree/3412 untouched meanwhile — พ22; Friday slipped once on 06/10, the checker re-verified its commit).
  Off-limits: caliburn-g5 · vinci-s · Drag 6 colour images · pod-159 · cart/price/stock · service pages · head/title/JSON-LD
  (except the owner-allowed wrong-fact fixes).
3a IMAGE METHODS (the full list — recolour masters, pair splits, AI upscale + maker pixels, lineup scripts — = `git show d3bc8e2:docs/HANDOFF.md`
  §16 item 3a; LESSONS 23 · 25): CUT-OUT (lesson พ11): Higgsfield remover → `b-edge/choke.js` · unlike the studio grey → `scripts/flatcut.js`
  (white/light products: render on dark grey first — พ23) · ALWAYS zoom 4x on dark + magenta (`b-edge/edgezoom.js`), tops included. Then
  presize + map entries + `npx tsx scripts/process-images.ts --only <slug>` (new file names, lesson พ6) · check every render for
  MIRRORING · `npx tsx scripts/image-sharpness-gate.ts --base origin/main` before the checker · poster `transparent` only when ≥ 30 % of
  the file is transparent (พ16) · Higgsfield: credits without asking (IMAGE_SPEC §0 item 7) — `balance` first, report the spend.
  Left for the option-photo round: edge defects (`edge-audit/visual-audit.md`) + coils (`b-coils/README.txt`) · Esko pod-159 LAST
  (13.7 big (2), own PR, + BSOT §21).
4 waiting on owner:
  (06/10 pm) look on live: M Bar 10K stage page · JOIWAY F4 TWINS page · RELX Creator "ทั้งหมด" image — reversible by revert.
  (06/10 pm) the article section "nicotine — the maker's posters don't state it, so we don't print a number, ask LINE" (M Bar 10K,
       JOIWAY F4, and the same pattern on earlier batches) vs §18 "never explain the absence" — Friday's recommendation: keep only the
       LINE pointer, drop the explanation (one small PR over all such pages).
  (06/10 pm) JOIWAY F4: the owner exception "2 โหมด 2 รส" is on no TWINS poster (it came from the shop's NOS review) — keep or drop
       "2 โหมด" from the head copy? Recommendation: drop. The review video on the page is titled "F4 NOS" — keep (shop's own channel).
  (06/10 pm) new Thai words (not locked): ดีไซน์เรียบ (block title, already used elsewhere) · มองเข้าไปข้างใน · ภาพโปร่ง · คู่กลิ่น.
  Still to look at on live: G4 Pro + G4 Pro KOKO (1c) as a whole · G4 Pro new colours (c) · G4 mini two all-colours images (b) ·
  ARGUS G4 mini page (2e) · ARGUS P3 + VMATE i3 story pages (2f #264) · ARGUS G4 page (2g #271: battery block names VOOPOO's two
  figures — poster 10% vs ARGUS G3, page 22% vs previous gen; safety poster not used; 7 blocks → chip bar 6+1 at 1440).
  (2f) five facts the owner should know on those pages (P3 maker typo, VMATE 0.4Ω wattage, P3 no size row, i3 card colour, i3
       textures) = `git show d3bc8e2:docs/HANDOFF.md` §16 item 4 (2f).
  "Mini BOX" stays English (Friday's pick, the owner did not rule on it 05/10).
  (39) look at the Drag S3 / X3 / VINCI S colours + cards (#204) and the two-group lineups (#205-#207) on live — reversible by revert.
  (38) one lifestyle sample like UWELL's real-shot.webp — the owner wants to see it before deciding where it goes.
  (28) Thai copy flags (not changed): INFY `descriptionTh` says disposable-only brand · shared strings "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" /
       "สินค้าที่คุณอาจสนใจ" stiff · RELX Creator = "เครื่องระบบสวิตช์" or keep "เครื่องใช้ซ้ำ" (batch 4 needs it)
  (06/10) new Thai words from batch 3 (เซรามิก · หน้าจอดิจิทัล · สายคล้องคอ · ช่องลมเข้า · เรียบหรู — `_incoming/sitewide-template/3/STATE.md`) ·
       RELX Creator: article "RELX Creator Pod" (RELX) vs fits-with "RELX Creator 20K pod" (shop) — link the names?
  (14) category structure — its own round · (1) image-theft protection · (2) Muro Connector category · (3) SALTHUB per-flavour files
5 open / dated:
  - M Bar 10K (#288): facts still over 2 from the untouched head copy + anatomy sheet + fits-with card (all down from live) —
    10,000 ×3 · ชาร์จ ×4 · RGB ×3 · 3 โหมด ×4 (checker #288 agreed) → SEO round (head) / an anatomy-sheet touch.
  - JOIWAY F4 (#289, checker notes): "สองถัง" said 6+ times · article "สูบได้กี่พัฟ" restates poster 01 — next F4 touch.
  - wordbreak 05/10: «ไฟจะ» on /guides/fixing-no-draw-and-blinking-light@390 (guides = later round) · `vmate-i3/variants/*` +
    `argus-p3/lineup-v2.webp` unused but kept by the #286 sweep (their names appear in src/ — check by hand).
  - [ตรวจแล้ว — files, checker #272] ARGUS G4 after #271, outside the round: guide argus-g4-vs-caliburn-g5 still says G4 firing + pod capacity "unconfirmed" (now
    3.5mL; VOOPOO still names no draw/button activation) · technology multi-resistance-cartridges quotes the old pod row "ARGUS
    top-fill cartridge platform, multiple resistances" · G4 head copy: 0.85 twice (tagline + shortDescription) + the anatomy
    diagram = 3 (SEO round; checker #271 accepted) · English names wrap at a space in the spec table (accepted).
  - DEFERRED by the owner 04/10 + 05/10 (no date; "ไว้ค่อยกลับมาแก้"): images that "still look like graphics" (LESSONS ช9) — DRAG S3 +
    X3 colour photos + two-group line-ups (#255) · DRAG 6 lineup-v3 (also too small) · ARGUS G4 mini images. Not fixed either (checker
    #253 taste): text in the 3 wide DRAG 6 posters ~6–7 px at 390 · "มีโหมด SMART RBA และ TC-TCR" reads as 2.
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
    caliburn-g3-pro(-koko), -g4-pro(-koko), -g5 en+zh, same on live) [ตรวจแล้ว] — data round. Same for coil-72 "VOOPOO คอยล์ Vmate
    Infinity Edition" on vmate-i3 en/zh (live before and after #264) [ตรวจแล้ว], and its fits-with card there still shows the
    retailer evidence sentence from catalog-relationships.ts (maker-only rule) — data round.
  - Beginner guide (guides.ts + guides-copy) still gives the G3 mini as 95.3 mm / 41 g (VOOPOO: 97.9 mm with 3mL / 40.85 g, #262).
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

**Answered 06/10 (owner, chat: "ครับไปเลยครับ" to the recommended answers in `_incoming/sitewide-template/REPORT-0610.md` §4):**
M Bar 10K may drop its 4 owner-approved Thai lines for the stage page · M Bar 15K → reusable/pod-system category (own PR) · wrong
facts in head copy are fixed now, not held for the SEO round (Zero Pro "5,000 พัฟต่อหัวพอต", M Bar 15K "cotton mesh/ชาร์จเร็ว/15 รส") ·
Zero Cartridge per-flavour photos = yes (in the option-photo round) · JOIWAY F4 = the TWINS edition (maker + our photos), not NOS ·
RELX Smash Go cover = RELX's KV with the models, kept · TFIT M Power = unhide (own PR) · Smash Go 874 and nexBAR-type LOW pages = accepted
exceptions when the maker has nothing more to say (never pad) · RELX's printed "+30%" stays in the coil poster · RELX Creator
all-colours image = publish the draft · pod-180 stays brandless · MOOOD = check its site in a real browser, then fix data / brand ·
INFY 20K + Muro ×3 (no maker material) = skipped this round · IQOS colour completeness = its own round · WOTOFO's 11 flavours without
photos + every other option without a photo + white-box coils = a new "option photos" round (Higgsfield, first set to the owner).
Not answered (no recommendation was given): the new words in Q8 · Q11 "RELX Creator Pod" vs "RELX Creator 20K" naming.
