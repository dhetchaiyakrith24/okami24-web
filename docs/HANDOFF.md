# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 03/10 cloud chat merged batch 1c [ตรวจแล้ว — checker · GitHub green · live curl]:
  #236 `406cd17` G4 Pro + G4 Pro KOKO on the template: stage story 6/7 blocks (UWELL posters + stills from UWELL's own page films:
    G4 Pro video/theme.mp4 · 4.mp4 · 7.mp4, KOKO pc/Customize.mp4 · pc/7.mp4), cover = UWELL banner, th/en/zh, lede + buyer questions,
    every spec row re-read from UWELL's spec sheets/posters with sourceUrl (G4 Pro 78g · KOKO 93g · 5V/2.5A · in-box pods per version ·
    0.4–1.2Ω pods from UWELL's pod chart), 3 new Thai spec labels (Touch / Screen themes / Settings), fits-with = top or side refill.
    Fixed wrong data: KOKO "Draw modes" → "Output modes" · KOKO who-line tying modes to MTL/RDL · G4 Pro "airflow ring" (not UWELL's).
    Checker round 1 = 3/5 ("Superb hand feel" boast · fits-with said top-fill only) → fixed 0ae68b3, round 2 PASS. Live 16:04 UTC [ตรวจแล้ว].
    UWELL's "Look Closer" close-ups were not used (labels laid over their device, cannot stand alone). No maker parts view → no exploded view.
  Earlier 03/10: 1b #233 #234 (G4 · G4 mini · G4 Classic, owner approved the G4 page in chat) · 1a #228-#230 · G5 close #225 #226.
2 ahead of main: `git log --oneline origin/main..<branch>` — this docs PR only [ตรวจแล้ว — git].
  Kits (never merge these branches): 1c = branch `kit-1c` (prep.js · copy-en.md · copy-base.json · th.json · build.js · edit-th.js ·
  fix-*.js · rescan.sh · shots.sh · facts.json · UWELL's G4 Pro colour pairs mk/g4pro/pc_color-1..8.webp + both spec tables) ·
  1b = branch `kit-1b`. Get one: `git fetch origin kit-1c && git restore --source origin/kit-1c --worktree -- _incoming/sitewide-template/1c`.
  The cloud container restarted 5× on 03/10 (each kills a running build) → run long jobs as one script file, re-run after a restart.
  Test-server limit (session tool, not a site bug): its image resizer runs one job at a time; a hung request blocks every image after it
  → stop/start; full-page shots need `--eval` that scrolls + waits for images (`_incoming/sitewide-template/1c/shots.sh`).
3 OPEN: round "sitewide template, brand by brand" (`docs/rounds/รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt`, owner-approved 03/10
  with Friday's 3 recommendations: round 3a/3b merged in and closed · brand order as written · set-1 UWELL colours re-tilted 12°).
  Template = `docs/PRODUCT_PAGE_TEMPLATE.md` (the one home). Scope (scope-auditor 03/10) = `_incoming/sitewide-template/scope.md`
  + the round file's 【ขอบเขต】 block: 55 product pages; PM pages (coils, IQOS, pod-180) = cards/images only, no story mechanism.
  Batches (all tier B): 1 UWELL — PRs 1a G5 Lite + G5 Lite SE · 1b G4 + G4 mini + G4 Classic · 1c G4 Pro + G4 Pro KOKO · 1d G3 Pro +
  G3 Pro KOKO · 2 VOOPOO (+ Drag 6 hybrid lineup on the test server first, + argus-g4/Multi-Ohm/M Bar 15K data) · 3 SALTHUB (+ zero-*,
  m-switch-pod, m-bar-15k) · 4 RELX/JOIWAY/TFIT · 5 small brands (+ mood-monster, muro-*, pod-180) · 6 IQOS · 7 close (tag
  sitewide-template-done, asset-refs sweep of the 246 candidates, edge defects).
  STOPPED AT: batch 1c text/story merged (#236). NOT done in 1c: G4 Pro colour images + card (UWELL's files are front+back pairs where
  the back device overlaps the front one's button side → isolating the front device needs an edge completion (AI) or a recolour master;
  UWELL's upright fronts pc/3-*, 6-* are cropped at the top = unusable) → the G4 Pro hero still opens on the pair, no openOnCardPhoto.
  KOKO colours (night-render master, 01/10) left as they are.
  NEXT (owner 03/10, on the computer — chat moved there): in this order, each its own PR:
   (a) copy fix, tier A fast path: "ตบคอ" (2 Thai strings in src/i18n/story-copy.ts, G4 Pro custom-mode + KOKO modes) → "แรงถึงคอ"
       (owner: the only word that fails — he did not understand it; THAI_STYLE ก้อน 1c line).
   (b) G4 mini all-colours image too small → make the devices bigger (owner: "ภาพรวมเล็กไป ขยายใหญ่หน่อย"; G4 mini otherwise passed).
   (c) 1c-colours: G4 Pro card upright 4:5 + 8 colours tilted 12° (owner: "ทำได้" — Higgsfield allowed, IMAGE_SPEC §0 item 7).
   (d) then batch 1d G3 Pro + G3 Pro KOKO — vary the stage arrangement a little between pages (owner 03/10, template §1 row 7).
  Method that worked (1b+1c): maker page → .txt (`extract.js`) · images are listed in the page's CSS and its
  `/_nuxt/*.js` chunk (template strings like `pc/3-${item}.webp` — probe 1..10) · ffmpeg stills from the maker's page films (fps=1 sheet,
  then pick) · read spec images flattened on white · copy-en.md → thai-copy → th.json → build.js inserts story-copy + articles ·
  edit scripts as .js files (Thai never through `node -e` or a heredoc — it fails silently) · restore files with `git show <c>:f > f`,
  never `git checkout <c> -- f` (LESSONS พ15) · `npm run verify:catalog` (every Ω/number in copy needs a verified row) · page-text-length
  --facts · wordbreak-scan → reword negations/compounds · checker.
  Tips: a lede tail can split a compound at 1440 · count the template's "รุ่นนี้มี N สี" as one colour-count mention · maker footnotes
  (UWELL LAB) attach to data · the head copy (tagline/shortDescription) counts toward "a fact at most twice" but is off-limits → cut the
  repeat from the article/blocks · "แท่ง" is a locked-out word (use "ทรงเพรียว") · boasts without a number fail in en/zh too.
  Off-limits: caliburn-g5 · vinci-s · Drag 6 colour images · pod-159 · cart/price/stock · service pages · head/title/JSON-LD.
3a THE IMAGE METHODS THAT WORK (from the old image round, kept for this round):
  (a) one model, colours differ only in colour = ONE master + recolour by script — silver master `b-uwell/recolour-g4c.js`; coloured
  master `b-voopoo/recolour-g3m.js` (lesson 23); gradients per height band `b-edge/recolour-g4m.js`, `b-edge/recolour-g3p.js` (masks
  `b-uwell/masks.js`); colour targets + swatch = median of the MAKER's photo · (b) each colour its own print = a night render per colour
  · (c) single option = night card render · card from a set = tilt one colour 12° (`_incoming/image-sitewide/tilt-card.js`).
  CUT-OUT (lesson พ11): Higgsfield remover → `b-edge/choke.js` · unlike the studio grey → `scripts/flatcut.js` · ALWAYS zoom 4x on
  dark + magenta (`b-edge/edgezoom.js`). Then presize + map entries + `npx tsx scripts/process-images.ts --only <slug>` (new file
  names, lesson พ6). Check every render for MIRRORING. CRLF files = a .js edit script. Paths under `_incoming/image-sitewide/`.
  Lineups: UWELL slim = G5 "group" (`set1/poster.js`) · box = "cluster" (`set1/boxy.js`, `dsx/koko-two.js`) · VOOPOO = RELX
  (`dsx/vp-relx2.js`) · 7+ devices = two groups ("ทั้งหมด 1 / 2"). Drag 6: HYBRID (true devices + B's light) on the test server first.
  Left from it: edge defects (`edge-audit/visual-audit.md`: vmate-i3 · zero-pro · m-bar-15k · muro-3ml · zero-cartridge ·
  mood-monster-14k · coils 1/38/53/54/56/74/89/94 + white boxes 55/70/72/83/87) · coils `b-coils/README.txt` · G4 Pro (UWELL files =
  overlapping front+back pairs) · Esko pod-159 LAST (13.7 big (2), own PR, + BSOT §21).
  Higgsfield: credits without asking (IMAGE_SPEC §0 item 7) — check `balance` first, report the spend.
4 waiting on owner:
  (41) G4 Classic / G4 hero line under the name (Thai `shortDescription` + `tagline` in product-copy-th.ts, English in uwell.ts) is wrong
       — Classic "same body as the standard G4 / Classic colourway", G4 "power modes" — and now contradicts the page's own story. It feeds
       meta description + JSON-LD (round off-limits = head) → asked 03/10: 1 fix in the round (Friday's pick; thai-copy draft: tagline
       "Caliburn รุ่นฉลอง 10 ปี ตัวเครื่องอะลูมิเนียม ไฟ RGB แทนจอ" · short "Caliburn G4 Classic แบต 1400mAh สูงสุด 35 วัตต์ ไม่มีจอ ใช้ไฟ RGB
       14 ดวงบอกระดับแบต มีเซ็นเซอร์คู่ และใช้หัวพอต GPP") · 2 wait for the SEO round. Same card line shows on /brands/uwell etc.
  (42)+(43) answered 03/10 → work items NEXT (a)(b)(d) above; G4, G4 Classic approved by the owner, G4 mini = approved except (b);
       batch 1c words locked (THAI_STYLE ก้อน 1c) except "ตบคอ". Still to look at on live: G4 Pro + G4 Pro KOKO pages (1c) as a whole.
  (39) look at the Drag S3 / X3 / VINCI S colours + cards (#204) and the two-group lineups (#205-#207) on live — reversible by revert.
  (38) one lifestyle sample like UWELL's real-shot.webp — the owner wants to see it before deciding where it goes.
  (28) Thai copy flags (not changed): INFY `descriptionTh` says disposable-only brand · shared strings "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" /
       "สินค้าที่คุณอาจสนใจ" stiff · RELX Creator = "เครื่องระบบสวิตช์" or keep "เครื่องใช้ซ้ำ" (batch 4 needs it)
  (14) category structure — its own round · (1) image-theft protection · (2) Muro Connector category · (3) SALTHUB per-flavour files
  Answered 03/10 (do not ask again): "ultra-shatterproof" stays OFF both G4 Pro pages (owner: Friday decides → off; UWELL's posters
  still show it) · G5 repeats = A keep · next round approved · logos: Kardinal = the maker's "Kardinal" word logo,
  site name "KS" stays · DOTMOD = text chip (Friday's call, owner "ตัดสินใจได้เลย").
5 open / dated:
  - `src/data/guides.ts` (the which-Caliburn guide, Thai) still says G4 Classic specs are unconfirmed so it is left out of the comparison —
    now verified (#233); guide pages are outside this round → its own small PR or the data round.
  - G4 `firing` row ("draw or button") is sourced from the manuals.plus copy of UWELL's manual, not a UWELL page (thai-copy flag 03/10).
  - Drag 6 tank: retailers name it UFORCE-X Tank II, the data has a "gene-tt-3" highlight — data check [เชื่อว่า].
  - coil-94's Thai Shipnity name shows on en/zh pages that link it (locale-hydration FAIL on caliburn-g3-pro and caliburn-g5 en+zh,
    same on live; also "UWELL คอยล์ Caliburn G4&G3 Series" in the fits-with box of caliburn-g4-pro / -koko en+zh, before and after 1c)
    [ตรวจแล้ว] — data round.
  - Head copy off-limits this round, wrong since 1c (SEO round): KOKO shortDescription "2 นิ้ว" + "Custom" (UWELL: 2.0-inch, "Customize") ·
    G4 Pro tagline + shortDescription both say 2.51 (the page counts it twice already). `src/data/technology.ts` onboard-touch-displays
    calls the KOKO modes "draw modes" (they set power) and lists "older G3 pods" — technology page, outside this round.
  - Live screenshots from the cloud still impossible (03/10): cause found — Chromium goes out direct, where the cloud's egress gateway
    re-signs with its own CA ("Anthropic Egress Gateway"); `scripts/lib/cloud-ca.js` learns the CA through the proxy, which passes the
    site's real chain (GTS Root R4), so the SPKI flag names the wrong key. Both fixes (trust the gateway CA · `--proxy-server`) were
    refused by the session's auto-permission check → needs the owner's own permission rule, else live shots = computer.
  - SEO round (owner 02/10: baseline hold lifted): GSC vs `docs/SEO_BASELINE.md` · delete `galleryNoteHeld` + `heldNote` +
    `TITLE_PRICE_HOLD_UNTIL_2026_10_05` · M Bar 10K airflow row · G5 hero tagline repeats · product FAQ answers absent from server HTML ·
    8 brand titles naming a model (cloud-results §2) · shared GPP note "Shared top-fill…" on 8 UWELL pages.
  - `lineupFirst` has no product left — cleanup · `dict.product.anatomyTitle` en/zh "from the outside in" · zh spec/FAQ English site-wide ·
    article H3 font reads narrow (designer note).
  - `scripts/process-images.map.json` keeps "replaces" lines naming deleted G5 files (history only; the size guard skips a missing file).
  - Housekeeping queue: OneDrive `Run prompt\New prompt WEB\2-ยังไม่ทำ\รอบเก็บบ้าน-ครั้งถัดไป-ของที่รอ.txt` (+ owner 03/10 (D) lower
    chat-move threshold in image rounds · (E) lighter rules).
  - Known lock limits (checker accepted): a ban hidden inside `bash -c '…'` / `python -c` is not seen by the hook.
  - visible-text "font fingerprint differs" on some live-vs-local pairs = live/local font serving [เชื่อว่า]; 03/10 pair said same.
  - Git Bash turns "/products/x" args into Windows paths unless `MSYS_NO_PATHCONV=1` — wordbreak-scan then scans the whole sitemap.
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Latest light set [ตรวจแล้ว — run 03/10 cloud, #236 at 0ae68b3]: tsc 0 · eslint 0 · verify:catalog 29/29 · scan.js PASS 0/109 ·
  page-text-length G4 Pro 1,844 · KOKO 1,711 (no fact over 2) · visible-text controls G4/G5//brands/uwell 0 changes · wordbreak: new
  text clean (7 single-word + 1 negation = shared/pre-existing strings) · locale-hydration = the known Shipnity coil names only.
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
