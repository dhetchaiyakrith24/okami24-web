# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 03/10 chat merged [ตรวจแล้ว — checker · GitHub green · deploy · live curl 200]:
  #215 `8f9cefc` G5 owner review fixes (cover word, chip-bar margin, close-ups v3, reveal faster, article airier, phone gaps) + brand
    logo in the hero (UWELL, INFY) — checker 11/11 · visible-text whole sitemap 654 files, 66 changes = the brand chip only.
  #220 `20c061d` logos VOOPOO · SaltHub · JOIWAY (scale per logo, row fixed at chip height; 5 other found files pulled — no page to
    see them at size, candidates `_incoming/g5-template/logos/`) — designer owner-eye pass → 3 fixes · checker 7/7.
  #221 `6fe16a7` G5: one fact at most twice (article 5 → 2 sections, no lede, story bodies/points/exploded labels de-duplicated) ·
    cover v4 (no negative margin — the wings sat over the lede on #215, lesson พ13; top rows faded, UWELL's banner crops the
    wing) · close-ups v4 (port, airflow) · MTL/DTL guide = the airflow block's link — designer pass → every ✗ fixed · checker 2 rounds
    PASS (round 1 FAIL on the twice-rule count → owner question, item 4) · GitHub `next build` failed once on Google Fonts, rerun green.
  Docs: #217 #222 (§16 owner items D/E, owner eye = no draft) · #223 `40ca987` `docs/PRODUCT_PAGE_TEMPLATE.md` (batch 6 template).
  Rules from the owner this chat (PR #216 #218 #219, not Friday's): "Owner eye" list in `.claude/agents/designer.md` — Friday and
  the checker look with it, no drafts, every flaw fixed before going live, an owner rejection after live = fix + LESSONS line.
2 ahead of main: nothing open [ตรวจแล้ว — git]. Leftover local branches g5-template-fix / g5-logos-trim / brand-logos-8 / g5-trim
  are merged or superseded (g5-logos-trim = the split-up first try). Worktrees `_incoming/wt-pr` `wt-tpl` `wt-s16` can be removed
  (`git worktree remove`). Test server 3412 UP at g5-trim be64774 (`node scripts/test-server.js stop`).
3 OPEN: round "G5 template" (`docs/rounds/รอบG5-แม่แบบ-02-10.txt`): batches 1–5 merged (#212 #213 #215 #221) · batch 6 = template
  doc merged (#223) + next round file drafted (OneDrive `Run prompt\New prompt WEB\2-ยังไม่ทำ\รอบไล่ทั้งเว็บ-ตามแม่แบบG5-ทีละแบรนด์-03-10.txt`,
  line added to `00-สารบัญ.txt`) + the owner's "ล็อก" on the live G5 page [รอเจ้าของ]. Working files `_incoming/g5-template/`
  (owner-eye files `owner-eye-logos.md` · `owner-eye-g5-trim.md` · shots `oe/` · final before/after `oe/final-*.png`).
  NEXT: owner says "ล็อก" (or lists fixes) → round-close: tag g5-template-done · `npx tsx scripts/asset-refs.ts` sweep (unreferenced
  now: story-cover-v2, story-battery-v3, story-colours, anatomy zoom v2, part/assembled v1 if any) · §16 rewrite · the template doc's
  status line → "locked 0x/10". Ideas seen, not done: product FAQ answers absent from server HTML (SEO round) · zh spec/FAQ English
  site-wide · article H3 font (font-display reads narrow; designer note, pre-existing).
3a PAUSED until the G5 template round closes: round "รอบรูป-ทั้งเว็บ" — THE STANDARD IS CALIBURN G5 (owner 02/10; file renamed from "…แบบMBar10K…", owner 02/10)
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
  Drag 6 light: AI relight test `b-edge/relx/d6-B1.png` changed badge/screen text → not publishable. OWNER 02/10: HYBRID (true
  devices + B's light) shown on the test server FIRST. Live lineup = the owner-picked VMATE MAX layout — do not replace it before that.
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
  OWNER 02/10: image standard = IMAGE_SPEC §0 item 8 · Drag 6 = B's light + the true devices (hybrid), shown on the test server first.
  OWNER 02/10: Caliburn G5 = the template for the site; the "รายละเอียดเพิ่มเติม" story + article text now belong to THIS round (below).
  G5 TEMPLATE (owner 02/10) [ตรวจแล้ว — chat]: card = the maker's own render UPRIGHT, 4:5 ("การ์ดเอาแบบตรงเหมือนเดิม") · colour
  images = the maker's render tilted 12° ("เอียงทุกสี") — new work only; approved upright images stay ("เอาไว้ก่อน") ·
  all-colours image = pick 3 "group": the hero big in front on the left, the other six in two upright tiers behind, soft
  contact shadow + faint reflection as semi-transparent pixels (`_incoming/image-sitewide/g5/` poster.js · tilt-all.js). 0 credits.
  ARTICLE ROUND STOPPED (owner 02/10 night) [ตรวจแล้ว]: "ก้อน 3 ยกเลิก … ย้ายงานไปฝั่งรูป Friday ทำคนเดียว" = story + article
  work now lives in THIS chat; the article round file's 【แบ่งงานกับรอบรูป】 split is void. Done: #196 `dcef02b` two held comparison
  guides released · #194 `38a9be3` G5 `storyLayout: "stage"` (UWELL-style, per product; M Bar pages stay "split") + 6 UWELL posters
  `story-*.webp` (+`-mo`, cut-outs float: `StoryImage.transparent`) + article `src/data/product-articles.ts` (th/en/zh, format A)
  + 5 spec rows from UWELL's sheet + pod row/FAQ/compat fixed (INT kit = side refill) · checker ×3 · live · #208 lesson ช8.
  Keyword plan (55 pages × 1 query, brand-page clashes) + source-table pattern: `docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md`.
  NOT done (only when the owner asks): articles for the other 54 pages · no story mechanism on the 18 ProductMaster pages · G5
  drawn anatomy stays until the owner's exploded view (then `ANATOMY_SHEETS["caliburn-g5"]`).
  OWNER 02/10 (credits + agents) [ตรวจแล้ว — chat]: agents as the work needs · Higgsfield credits WITHOUT asking, also when the maker's
  or other sites' photos fall short of the standard (IMAGE_SPEC §0 item 7) — report the spend.
3b NEXT (owner's 02/10 morning list (1)-(4) done except Drag 6):
  (a) Drag 6 = HYBRID light + RELX two groups (drafts without the light: `dsx/relx/drag-6-a|b.png`), test server first, owner looks.
  (b) set 1 UWELL colour images + cards (G5 Lite 8 · G5 Lite SE 8 · G4 8 · G4 mini 12) are still the old upright files — the rollout
    plan says "colours tilted, card upright" but the G5 ruling says approved upright images stay ("เอาไว้ก่อน") → owner (4) (40).
  (c) G4 Pro (UWELL files = overlapping front+back pairs — AI separation or a pair poster).
  Lineup layouts: UWELL slim = G5 "group" (`set1/poster.js`) · box = "cluster" (`set1/boxy.js`, `dsx/koko-two.js`) · VOOPOO =
  RELX (`dsx/vp-relx2.js`) · 7+ devices = two groups ("ทั้งหมด 1 / 2").
  (2) edge defects left (`edge-audit/visual-audit.md`): vmate-i3 · zero-pro · m-bar-15k · muro-3ml · zero-cartridge · mood-monster-14k ·
    coils 1/38/53/54/56/74/89/94 + white boxes 55/70/72/83/87. Remake from the maker's photos (lesson 22).
  (4) coils — `b-coils/README.txt` (references found for the first 8, nothing generated).
  (5) argus-g4 + Argus Multi-Ohm + M Bar 15K duplicate record (= M Switch Kit).
  (6) BATCH 5 rest of the site (planner first; joiway-f4 · relx-creator · relx-smash-go-12k …; TFIT M Power after a researcher) ·
  (7) Esko pod-159 LAST (stock/cart = 13.7 big (2), full set, own PR, + BSOT §21).
  Higgsfield: credits without asking (IMAGE_SPEC §0 item 7) — check `balance` first, report the spend.
  Round close: `npx tsx scripts/asset-refs.ts` for unreferenced photos (list in item 5).
4 waiting on owner:
  (41) G5 lock: look at the live G5 page (after #221) and say "ล็อก" — or list what to change. Before/after: `_incoming/g5-template/oe/final-*.png`.
  (42) G5 repeats Friday left (owner-approved text 13.3 #5 + hero/meta = SEO round): triple tap ×8 · 1600mAh ×5 · 0.85" ×3 · theme ×3 —
       A keep (recommended: hero + approved bodies) · B cut the triple-tap tail of the display body + hero tagline in the SEO round.
  (43) next round file (OneDrive 2-ยังไม่ทำ, 03/10): approve + its 3 questions (merge round 3a into it · brand order · re-tilt set 1).
  (44) logos: Kardinal file says "Kardinal", the site names the brand "KS" — which? · DOTMOD only serves an emblem — keep the chip?
  (39) look at today's new images on the live site: Drag S3 / X3 / VINCI S colours + cards (#204) and the two-group lineups of 8
       products (#205-#207) — Friday's own calls, reversible by revert.
  (40) set 1 UWELL (3b (b)): re-tilt the old upright colour images to the G5 standard, or keep them? Friday: keep until a set is redone.
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
  - Carried ideas: card sweep on 4:5 · articles for the other product pages · category-structure round.
  - Article-round leftovers: shared GPP note "Shared top-fill…" still on 8 UWELL pages (UWELL: side + top refill fit) ·
    8 brand titles naming a model (cloud-results §2) — final SEO round.
  - Language of reports (owner 02/10: chat = Thai for the parts he reads): 4 proposals queued for the next housekeeping round —
    OneDrive `Run prompt\New prompt WEB\2-ยังไม่ทำ\รอบเก็บบ้าน-ครั้งถัดไป-ของที่รอ.txt` (owner: "เขียนไว้ใน Run prompt รอบเก็บบ้าน").
    OWNER 03/10 [ตรวจแล้ว — chat], also for the next housekeeping round: (D) a lower chat-move threshold in image rounds ·
    (E) lighter rules overall · owner eye: ไม่มีส่งร่าง ขั้นตอนเท่าเดิม (PR #218 #219).
  - Unreferenced old photos (G3 Pro/KOKO, G4 Pro KOKO, G4 Classic, ARGUS, Zero Nano, Drag 6, G5 old variants + lineup.webp; 02/10:
    S3 / X3 / VINCI S variants/*.webp + lineup.webp, KOKO + ARGUS G3/G4 mini lineup-v2, ARGUS G4 lineup.webp …):
    sweep at the round close with `npx tsx scripts/asset-refs.ts` (card.png of G5 / G4 Pro KOKO stay — home cinematic scenes).
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + `docs/rounds/รอบG5-แม่แบบ-02-10.txt`
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
