# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — the 02/10 day chat merged (each: checker PASS · GitHub checks green ·
  self-merge-check BIG · deploy on merge, live curl 200 for every new file) [ตรวจแล้ว]:
  #195 `a922c31` `Product.lineupImage2` + ColorVariantRail pills "ทั้งหมด 1 / 2" + Caliburn G3 Pro two lineups — OWNER 02/10: "รูปรวม G3 Pro ผ่าน".
  #204 `f555a9e` Drag S3 / X3 / VINCI S: 22 colours = the night 01/10 Higgsfield renders, cut by the Higgsfield remover (job id passed
    straight in, no upload) + `b-edge/choke.js` + `dsx/despeck.js`; X3 Moss Green / Aurora Purple side panels pulled back to the photo
    (`dsx/recolour-cells.js`, no AI); X3 Spray Black re-rendered (first IoU 0.944) · tilted 12° · card-v2 = default colour upright 4:5 +
    openOnCardPhoto · swatches = median body colour of each photo (`dsx/swatch-check.js`; VINCI S Neon was lime, body is purple→blue) ·
    fidelity 22/22 · sharpness 25/25. Pipeline: `_incoming/image-sitewide/dsx/` assemble.js → build.js → process-images.
  #205 `b226955` VOOPOO all-colours = TWO groups (S3 4+3 · X3 4+3 · VINCI S 4+4 · ARGUS G3 mini 5+4 · G4 mini 4+4), RELX layout
    (`dsx/vp-relx2.js`; 4-5 devices step 1.15 rise 0.42 → devices ~65 % of the square, was ~35-40 %). #206 `e1e60d1` KOKO ×2 the same
    (cluster layout, `dsx/koko-two.js`). #207 `0c3d994` ARGUS G4 the same (RELX). Owner's "too small" item = done.
  Docs #202 #203: §16 · Higgsfield credits without asking (IMAGE_SPEC §0 item 7; two stale "tell the owner first" lines removed).
  Live site answers 502 for ~2-3 min after each deploy (Render disk swap) — owner 02/10 "ยังก่อน ทำรูปแบบเดิมไปก่อน": deploy-on-merge
  stays, the owner times deploys himself. A proof shot taken during that window shows Cloudflare's error page — retake it.
  OWNER 02/10 afternoon [ตรวจแล้ว — chat]: "จัดการได้เลย … ตัดสินใจได้เลย … เสร็จแล้วรันงานอื่นต่อเลย" + "ไม่ต้องแวะถาม" (this chat).
2 ahead of main: `git log --oneline origin/main..<branch>` — nothing open after #207 [ตรวจแล้ว — git]. Test server 3412 may be UP
  (`node scripts/test-server.js stop`).
3 OPEN: round "G5 template" (`docs/rounds/รอบG5-แม่แบบ-02-10.txt` version 2, owner-approved 02/10): Caliburn G5 = the template for
  the whole site, finished in ONE chat (the cloud article chat stopped, #210); touch only the G5 page + shared code it needs.
  Working files `_incoming/g5-template/` (page list for every batch = `scope.txt` from scope-auditor 02/10; section shots =
  `story-shot.sh <dir> <origin>`). Batches: 1 story layout — desktop split like M Bar 10K, phone stage with tighter gaps (B) ·
  2 more text beside each poster, 3 languages, maker facts only + G5 exploded view (ANATOMY_SHEETS) + FAQ g5-battery-life
  vs the "up to 6 days" row + seo-auditor text-length proposal (B) · 3 every clickable-looking image links somewhere
  fitting (B) · 4 reveal-on-scroll, light, CSS only — motion touchable in this batch only (B) · 5 every G5 image to
  IMAGE_SPEC §0 item 8 (B) · 6 owner says "lock" on live + the template written in one doc + next round file drafted (A).
  MERGED [ตรวจแล้ว — checker · GitHub green · deploy success · live curl 200]: #212 `b2c5d90` batch 1 (checker 6/6) · #213 `3e086e3`
  batches 2–5 in one PR (checker 14/14 after one FAIL fixed — white pockets inside the 6 DAYS USE letters; self-merge-check BIG =
  uwell.ts). What shipped: story-copy.ts (th/en/zh text + 2–3 spec points beside each poster) · FAQ battery = the 6-day row ·
  exploded view from UWELL's NATIVE pc_pic11 (anatomy *-v2 — an AI 4K upscale rewrote screen text, lesson พ12) · links: colour
  tiles → `#option-<id>` (ProductHero) · pods poster → /products/coil-94 · triple-tap → /technology/gesture-and-triple-tap-control
  (`_incoming/g5-template/b3-image-links.md`) · reveal-on-scroll CSS `.okami-reveal` (owner 03/10 "ขึ้น web ไปเลย ถ้าไม่เวิร์ค
  พี่จะใช้ของ Hig"; Higgsfield loops = fallback, files on this computer `_incoming/g5-template/b4/`) · cover = hero.webp floating,
  white letter counters cleared · battery v4 + colours v2 re-cut from UWELL files. Proof: visible-text 654 files, 595 changes all on
  G5, 0 elsewhere · scan.js 0/109 · wordbreak NEW 0 · gallery-probe 45/61 PASS · Lighthouse mobile median 77→76, LCP 6.2 s both.
  OWNER 03/10 [ตรวจแล้ว — chat]: batch-2 draft OK · new Thai triple-tap + screen bodies · locked ปุ่มเลื่อนปรับลม + เวอร์ชัน.
  OWNER REVIEW 03/10 on live (8 points) → branch `g5-template-fix` (pushed; NOT checked yet — 39097d8 · 0529834 · 9bb698d ·
  05b07d4 · 287dd01): cover word repainted (silver CALIBURN, brighter G5 — `_incoming/g5-template/b6/wordmark.js`, cover-v3) ·
  cover slides under the heading (stage + transparent cover only, text shadow) · chip bar bottom margin · close-ups v3 (wider
  native crops + unsharp mask, no AI) · reveal faster (cover 35% → 22%, 72 px) · article centred + airier (ProductArticle.tsx,
  only G5 has an article) · phone block gaps py-7 → py-5 · NEW owner ruling: brand logos (see §18) — `src/lib/brand-logos.ts`
  + ProductHero shows the logo linked to /brands/<slug> in place of the brand chip; files so far UWELL + INFY
  (`public/assets/brands/`; researcher list of the other brands = this chat, summary in brand-logos.ts comments).
  NEXT (new chat, round-open continue): rebuild the test server at the branch head · shots 390+1440 of G5 + one UWELL + one INFY
  page (logo) · visible-text WHOLE sitemap (ProductHero is shared) before = live 3e086e3 · scan.js · wordbreak (G5) · gallery-probe
  --sitemap · checker · PR · merge · send the owner before/after. OWNER 03/10 before the move [ตรวจแล้ว — chat]: logo position OK ·
  the other brands' logos = Friday finds them herself (owner has no files; maker sites only, light version) · text length = §18 ·
  G5: trim only repeated facts, the look stays · "the first image still has a black frame" — the file is fully transparent and
  live 390 showed no frame (03/10 shot `_incoming/g5-template/b6/live-cover-390.png`); likely a cached page — re-check with the
  owner's own screenshot. Then batch 6: owner says "ล็อก" · template doc · site-wide
  round file (brand by brand) into OneDrive `Run prompt/New prompt WEB/2-ยังไม่ทำ/` · round-close (tag g5-template-done) +
  asset-refs sweep (story-battery-v3, story-colours, story-cover-v2, anatomy zoom v2 now unreferenced). Ideas seen, not done:
  product FAQ answers absent from server HTML (SEO round) · zh spec/FAQ English site-wide.
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
  Done this round: G4 Pro KOKO, G3 Pro KOKO, G4 Classic, ARGUS G3 mini, ARGUS P3 colours, Zero Nano, ARGUS G4 mini, Drag 6 (colours
  + lineup + home card), Caliburn G3 Pro (16 colours + card), Caliburn G5 (7 colours + card + lineup, #184).
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
  Lineups DONE: UWELL G5 · G4 · G5 Lite · G5 Lite SE · G4 mini · G4 Classic (one image) · G3 Pro · KOKO ×2 (two groups); VOOPOO
  ARGUS G3 mini · G4 mini · G4 · Drag S3 · X3 · VINCI S (two groups) · P3 (cluster). Layouts: UWELL slim = G5 "group"
  (`set1/poster.js`) · box = "cluster" (`set1/boxy.js`, `dsx/koko-two.js`) · VOOPOO = RELX (`dsx/vp-relx2.js`). 7+ devices in one
  square = too small → two groups ("ทั้งหมด 1 / 2"). Rejected 02/10 (Friday): "stage" (two upright rows) — back row half hidden.
  Drag X3: retailers list 3 more colours (Carbon Fiber Black / Lake Green / Cherry Pink) but shop.voopoo.com lists the same 7 as ours
  in every warehouse [ตรวจแล้ว 02/10] — no change.
  (2) edge defects left (`edge-audit/visual-audit.md`): vmate-i3 · zero-pro · m-bar-15k · muro-3ml · zero-cartridge · mood-monster-14k ·
    coils 1/38/53/54/56/74/89/94 + white boxes 55/70/72/83/87. Remake from the maker's photos (lesson 22).
  (4) coils — `b-coils/README.txt` (references found for the first 8, nothing generated).
  (5) argus-g4 + Argus Multi-Ohm + M Bar 15K duplicate record (= M Switch Kit).
  (6) BATCH 5 rest of the site (planner first; joiway-f4 · relx-creator · relx-smash-go-12k …; TFIT M Power after a researcher) ·
  (7) Esko pod-159 LAST (stock/cart = 13.7 big (2), full set, own PR, + BSOT §21).
  Higgsfield: 351.6 credits after #204 (the owner topped up; 27 used 02/10 = 23 remover + 1 4K render) [ตรวจแล้ว — balance];
  4K = 4, remover = 1 · no asking, report the spend.
  Round close: `npx tsx scripts/asset-refs.ts` for unreferenced photos (list in item 5).
4 waiting on owner:
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
  - `_incoming/` folders moved out 01/10 to `C:\Users\dhetc\OKami24-เก็บ\incoming-01-10\` (not deleted).
  - Known lock limits (checker accepted): a ban hidden inside `bash -c '…'` / `python -c` is not seen by the hook.
  - visible-text.js: "font fingerprint differs" on live-vs-local pairs (01/10 vt-d6, 02/10 vt-g5; same Chrome 154 both sides) —
    repeated, so it is the live/local font serving, not two machines [เชื่อว่า]; diffs were 0 changes both times.
  - Carried ideas: card sweep on 4:5 · articles for the other product pages · category-structure round.
  - Article-round leftovers: shared GPP note "Shared top-fill…" still on 8 UWELL pages (UWELL: side + top refill fit) · FAQ
    "g5-battery-life" vs the new "up to 6 days" row · 8 brand titles naming a model (cloud-results §2) — final SEO round.
  - Language of reports (owner 02/10: chat = Thai for the parts he reads): 4 proposals queued for the next housekeeping round —
    OneDrive `Run prompt\New prompt WEB\2-ยังไม่ทำ\รอบเก็บบ้าน-ครั้งถัดไป-ของที่รอ.txt` (owner: "เขียนไว้ใน Run prompt รอบเก็บบ้าน").
    OWNER 03/10 [ตรวจแล้ว — chat], also for the next housekeeping round: (D) a lower chat-move threshold in image rounds ·
    (E) lighter rules overall · owner-eye drafts (13.8, PR #216): the draft does not hold the work for now — if misses
    keep slipping through, switch to "wait for the owner's answer".
  - Unreferenced old photos (G3 Pro/KOKO, G4 Pro KOKO, G4 Classic, ARGUS, Zero Nano, Drag 6, G5 old variants + lineup.webp; 02/10:
    S3 / X3 / VINCI S variants/*.webp + lineup.webp, KOKO + ARGUS G3/G4 mini lineup-v2, ARGUS G4 lineup.webp …):
    sweep at the round close with `npx tsx scripts/asset-refs.ts` (card.png of G5 / G4 Pro KOKO stay — home cinematic scenes).
6 verify baseline at the last full close (clip round; numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Latest light set [ตรวจแล้ว — run 02/10]: PRs #204-#207 — tsc 0 · eslint 0 · verify:catalog 29/29 · gallery-probe `--sitemap` 45/61
  PASS both modes, 0 FLASH/STUCK (each PR) · visible-text: #204 27 changes (opens on the card) · #205 60 · #206 24 · #207 12 (pills only)
  · head-check 7 baseline pages head/H1/JSON-LD same · sharpness gate PASS (25 · 10 · 4 · 2 files). Proof: `dsx/proof{,2,3,4}/`.
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
