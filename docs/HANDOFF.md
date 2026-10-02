# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 02/10 chat merged #183 `81c5dc0` (rules: temporary rulings carry an
  end date, TEAM_RULES 13.6 + round-close step 6; checker PASS · SMALL) and #184 `1107f0d` Caliburn G5: all 7 colours = UWELL's
  own per-colour renders tilted 12°, card-v2.webp (Mystic Forest tilted, 4:5), lineup-v2.webp (owner pick 3) (checker PASS 5/5 ·
  GitHub checks green · self-merge-check BIG) [ตรวจแล้ว]; deploy 36935743985, live [ตรวจแล้ว — curl: 9/9 new files 200, page
  serves them]. Then #186 `629f612` (the 7-baseline-page hold lifted — TEAM_RULES 13.5/13.7/13.8 + §18; checker PASS after 1
  fix round · BIG) [ตรวจแล้ว].
  Then #187 `37deacf` (owner "การ์ดเอาแบบตรงเหมือนเดิมดีกว่า": G5 card-v3 = the upright UWELL render + `openOnCardPhoto`; set 1
  lineup-v2 for G4 / G5 Lite / G5 Lite SE in the G5 layout) (checker PASS 4/4 · gallery-probe both modes 45/61, 0 FLASH/STUCK ·
  BIG) [ตรวจแล้ว]; deploy 36942605379, live [ตรวจแล้ว — curl: card-v3 + 3 lineups 200, pages serve them].
  Overnight 02/10 (checker PASS each · checks green · BIG · live curl 200) [ตรวจแล้ว]: #190 G4 mini + G4 Classic lineups · #191
  G3 Pro KOKO + G4 Pro KOKO ("cluster") · #192 VOOPOO ARGUS G3 mini + G4 mini (RELX) + P3 (cluster) + P3 card-v2. Then the CLOUD
  article-round chat merged #196 `dcef02b` (the two held comparison guides released — owner 02/10, ruling D3 lifted). Checkpoint
  tag deleted; ALL temporary rulings of the night are CANCELLED (owner 02/10 morning) — normal rules again.
  OWNER 02/10 morning [ตรวจแล้ว — chat]: (1) 7 lineups pass; KOKO ×2 + ARGUS G3 mini / G4 mini look too small → fix · (2) EVEREST LAB
  badge "ไม่ต้องแก้" → publish Drag S3 / X3 / VINCI S night renders · (3) fix the deploy downtime BEFORE other work · (4) G3 Pro
  two "ทั้งหมด" pills → do it. Order Friday told the owner: 3 → 4 → 2 → 1.
  (3) DEPLOY DOWNTIME [ตรวจแล้ว — render.com/docs/deploys + /disks]: a persistent disk disables zero-downtime deploys; Render stops the
  old instance before the new one (docs "a few seconds"; measured 2–3 min of Cloudflare 502). Options given to the owner, answer
  PENDING [รอเจ้าของ]: A deploy once a night at 04:00 (deploy.yml schedule; manual for urgent) — Friday's pick · B move SQLite to
  Render Postgres, drop the disk (cost unchecked, 1–2 rounds, DB = 13.3) · C Cloudflare stale-if-error (free; s-maxage on HTML
  blocks it; stale HTML can point at deleted JS) — not recommended. Owner also asked downsides (data · SEO · trust) — answered.
  Owner: the gap looks like seconds; SEO is his only worry; Friday advised 04:00 + 12:00 windows. OWNER ANSWER 02/10 [ตรวจแล้ว — chat]: "ยังก่อน ทำรูปแบบเดิมไปก่อน" — keep deploy-on-merge; the owner will
  time the next deploy himself. Deploys ~10/day (4–16, `_incoming/deploy-days.txt`).
2 OPEN PR #195 `feat-g3p-two-lineups` (head dc3a478 = main merged in): `Product.lineupImage2` + ColorVariantRail pills "ทั้งหมด 1/2"
  (shared ProductHero → full-sitemap proof) + G3 Pro lineup-v2 / lineup2-v2 (G5 layout, 8 + 8). Proof `_incoming/image-sitewide/
  set1/proofe/`: first full-sitemap visible-text diff (107 pages × 3 × 2) = 12 changes, all the two pills on caliburn-g3-pro
  [ตรวจแล้ว]; shots `shots/cmp-390.png` / `cmp-1440.png`; a re-scan after merging main was RUNNING at the move (`vt-after2`,
  `vt-before2`, diff → `vt-diff2`). STILL TO DO: head-check, gallery-probe both modes, checker (brief like `set1/checker-brief-d.md`),
  then merge (deploy-on-merge stays — owner 02/10). Test server 3412 may be UP (`node scripts/test-server.js status` / `stop`).
3 OPEN: round "รอบรูป-ทั้งเว็บ" — THE STANDARD IS CALIBURN G5 (owner 02/10; file renamed from "…แบบMBar10K…", owner 02/10)
  (`docs/rounds/รอบรูป-ทั้งเว็บ-มาตรฐานG5-30-09.txt`, working files
  `_incoming/image-sitewide/`; this batch `b-edge/` (README = `b-edge/sources.md` + `jobs.tsv`); UWELL scripts `b-uwell/`,
  VOOPOO `b-voopoo/`, coils `b-coils/`).
  OWNER 01/10 evening [ตรวจแล้ว — chat]: all-options image for pod systems = `docs/IMAGE_SPEC.md` §0 item 5 · "finish the image
  work". OWNER 02/10: the 7 SEO baseline pages are no longer held (§18) — the round file's 05/10 line is void.
  ALL-COLOURS LAYOUT (owner 01/10 — rule in IMAGE_SPEC §0 item 5 "การจัดวาง"): few colours = UWELL float/tilt/layers · many =
  OKami's own poster layouts, every device whole, gaps, one hero. Composer `b-edge/d6-poster.js` (VMATE · V THRU · RELX · VEUZ fan;
  canvas from bounds). Rejected: stagger/arc/fan, tilt-cascade of 7, depth cascade / V-wings (ช7), G3 Pro fan + two rows of 16.
  OWNER 01/10 late [ตรวจแล้ว — chat]: RELX Phantom layout OK, but vary the layout per brand ("หลายหลายแบบในแต่ละแบรน") ·
  G3 Pro = two groups of 8 → two "ทั้งหมด" ("ทำเป็นหัวข้อ ทั้งหมด 2 ชิ้น", or a better idea).
  Drag 6 light: AI relight test `b-edge/relx/d6-B1.png` (4 credits) looks photographic but changed badge/screen/"VOOPOO" text →
  not publishable; proposal = HYBRID (true devices + only B's soft light and floor) [รอเจ้าของ (37)].
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
  + lineup + home card), Caliburn G3 Pro (16 colours + card), Caliburn G5 (7 colours + card + lineup, #184).
  OWNER 02/10: image standard = IMAGE_SPEC §0 item 8 · Drag 6 = B's light + the true devices (hybrid), shown on the test server first.
  OWNER 02/10: Caliburn G5 = the template for the site; the "รายละเอียดเพิ่มเติม" story + article text = the ARTICLE round (cloud).
  G5 TEMPLATE (owner 02/10) [ตรวจแล้ว — chat]: card = the maker's own render UPRIGHT, 4:5 ("การ์ดเอาแบบตรงเหมือนเดิม") · colour
  images = the maker's render tilted 12° ("เอียงทุกสี") — new work only; approved upright images stay ("เอาไว้ก่อน") ·
  all-colours image = pick 3 "group": the hero big in front on the left, the other six in two upright tiers behind, soft
  contact shadow + faint reflection as semi-transparent pixels (`_incoming/image-sitewide/g5/` poster.js · tilt-all.js). 0 credits.
  G5 story ("รายละเอียดเพิ่มเติม") = batch 1 of the ARTICLE round, which runs NOW in a CLOUD chat beside this round (owner 02/10:
  two chats). Its file = branch `inbox` `rounds/รอบบทความ-รายละเอียดเพิ่มเติม.txt` version 3 — section 【แบ่งงานกับรอบรูป】: this
  round owns card/colour/flavour images, `lineupImage`, `scripts/process-images.map.json`; the article round owns `storyDetails`,
  `storyCover`, `features[]`, product-copy-th, dictionaries, guides, `public/assets/products/<slug>/story-*.webp`. Fetch main
  before every merge. UWELL G5 posters are on this computer only (`g5/src/`, 58 files) — the cloud chat downloads its own.
  OWNER 02/10 (credits + agents) [ตรวจแล้ว — chat]: quota reset, agents as the work needs (rule merged #183); the owner will top up
  Higgsfield — a way that gets a clearly better result may use credits, say the estimate first.
3b NEXT — ORDER = the site-wide plan (owner 02/10 "งั้น…" = two chats accepted; draft `_incoming/image-sitewide/g5/rollout-plan.md`
  — set 2 is now lineups only, no re-tilt): (0) Caliburn G5 done (card upright PR). NEXT = set 1 UWELL: G5 Lite (8) · G5 Lite SE
  (8) · G4 Pro (8) · G4 (8) · G4 mini (12) from UWELL's own per-colour files (`g5/maker-renders.md`) — card upright, colours
  tilted, lineup poster (a layout per brand); then sets 2–6. The old list below = the items those sets absorb.
  Lineups DONE: UWELL G5 · G4 · G5 Lite · G5 Lite SE · G4 mini · G4 Classic · G3 Pro KOKO · G4 Pro KOKO; VOOPOO ARGUS G3 mini · G4
  mini · P3. Layouts: UWELL slim = G5 "group" (`set1/poster.js`) · box = "cluster" (`set1/boxy.js`) · VOOPOO slim = RELX
  (`b-edge/relx-studio.js`). NEXT after (3)+(4): (2) Drag S3 / X3 / VINCI S = the night renders `night/out/colour-*.png`; flatcut
  cuts ready (`set1/s3cut/`, `set1/cut-drag-x3/`, `set1/cut-vinci-s/`); `set1/holes.js` + magenta strips show flatcut ate the pale
  body of VINCI S silver (20 %) / pink (7 %) and X3 champagne-golden (9 %) → Higgsfield remover + `b-edge/choke.js` (~3 credits —
  tell the owner first); presize + map + data like presize-g3p.js. (1) small lineups (KOKO ×2, ARGUS G3 mini / G4 mini): the
  square frame holds 7–9 devices side by side — try fewer per image (two groups, like G3 Pro) or a tighter layout; draft first.
  LEFT: G4 Pro (overlapping front+back pairs), Drag 6 (RELX + photographic light), argus-g4, Esko last.
  (2) edge defects left (`edge-audit/visual-audit.md`): vmate-i3 · zero-pro · m-bar-15k · muro-3ml · zero-cartridge · mood-monster-14k ·
    coils 1/38/53/54/56/74/89/94 + white boxes 55/70/72/83/87. Remake from the maker's photos (lesson 22).
  (4) coils — `b-coils/README.txt` (references found for the first 8, nothing generated).
  (5) argus-g4 + Argus Multi-Ohm + M Bar 15K duplicate record (= M Switch Kit).
  (6) BATCH 5 rest of the site (planner first; joiway-f4 · relx-creator · relx-smash-go-12k …; TFIT M Power after a researcher) ·
  (7) Esko pod-159 LAST (stock/cart = 13.7 big (2), full set, own PR, + BSOT §21).
  Higgsfield: 178.6 credits after the B test 01/10 late [ตรวจแล้ว — balance 182.6 before − 4; 0 used 02/10 — เชื่อว่า, not re-read]; 4K = 4, nano 2K = 2, remover = 1 · use
  without asking, report the spend (owner 02/10, IMAGE_SPEC §0 item 7).
  Round close: `npx tsx scripts/asset-refs.ts` for unreferenced photos (list in item 5).
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
  - SEO round (owner 02/10: the baseline hold is lifted, the final SEO round polishes + asks for re-indexing): re-read GSC against
    `docs/SEO_BASELINE.md` · delete `galleryNoteHeld` + `heldNote` + `TITLE_PRICE_HOLD_UNTIL_2026_10_05` · M Bar 10K airflow row.
  - `lineupFirst` has no product left — the mechanism can go in a cleanup.
  - `dict.product.anatomyTitle` en/zh "from the outside in" (pre-existing).
  - `_incoming/` folders moved out 01/10 to `C:\Users\dhetc\OKami24-เก็บ\incoming-01-10\` (not deleted).
  - Known lock limits (checker accepted): a ban hidden inside `bash -c '…'` / `python -c` is not seen by the hook.
  - visible-text.js: "font fingerprint differs" on live-vs-local pairs (01/10 vt-d6, 02/10 vt-g5; same Chrome 154 both sides) —
    repeated, so it is the live/local font serving, not two machines [เชื่อว่า]; diffs were 0 changes both times.
  - Carried ideas: card sweep on 4:5 · ARTICLE round · category-structure round.
  - Unreferenced old photos (G3 Pro/KOKO, G4 Pro KOKO, G4 Classic, ARGUS, Zero Nano, Drag 6, G5 old variants + lineup.webp …):
    sweep at the round close with `npx tsx scripts/asset-refs.ts` (card.png of G5 / G4 Pro KOKO stay — home cinematic scenes).
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Latest light set [ตรวจแล้ว — run 02/10]: PR #184 — tsc 0 · eslint uwell.ts 0 · verify:catalog 29/29 · gallery-probe `--sitemap`
  45/61 pages PASS both modes, 0 FLASH/STUCK · visible-text 0 changes (6 pages × 3 locales × 2 widths, `g5/proof/vt-diff/`) ·
  head-check 7/7 head/H1/JSON-LD same, non-image HTML identical with build hashes normalised (`g5/proof/html/`).
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + `docs/rounds/รอบรูป-ทั้งเว็บ-มาตรฐานG5-30-09.txt`
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

**SEO baseline hold (owner 02/10):** the 05/10 wait is cancelled — "รอไปก็ต้องกลับมาแก้ ไว้ไปขัดเกลารอบ Seo สุดท้ายขอดัชนีใหม่" —
the 7 baseline pages are worked on like any other page; the final SEO round polishes them and asks Google to re-index
(the code-level title-price hold `TITLE_PRICE_HOLD_UNTIL_2026_10_05` is a title change = that round).

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
