# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` — this chat (01/10 evening) merged 3 PRs + this docs PR [ตรวจแล้ว — gh]:
  #169 `d8b9761` G4 Classic Alpine Green darkened to UWELL's forest green (owner chose "เข้มตาม UWELL"; checker 6/6; live
  [ตรวจแล้ว — curl: variant-alpine-green-v3 + swatch #324c42]) · #170 `9a5124b` ARGUS G3 mini 9 colours + card (checker
  6/7 → slot fix → re-check 4/4; live [ตรวจแล้ว — curl: card-v2 + variant-*-v2]) · #171 `97e39b1` ARGUS P3 7 colour
  photos + Zero Nano card (checker 6/6; live [ตรวจแล้ว — curl: argus-p3 7 variant-*-v2 · zero-nano card-v2]).
  Each = revert its merge commit (#171 = also one commit per product: 39ea538 P3 · 0eec50e Zero Nano).
2 ahead of main: nothing (this §16 = docs PR, merged by Friday) [ตรวจแล้ว — git] · test server stopped [ตรวจแล้ว —
  test-server.js status] · smogz-rules: nothing open [เชื่อว่า — not re-checked this chat].
3 OPEN: round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (`docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`, working files
  `_incoming/image-sitewide/`; UWELL scripts `b-uwell/`, VOOPOO/SALTHUB scripts `b-voopoo/`).
  THE METHODS THAT WORK: (a) one model, colours differ only in colour = ONE master + recolour by script so a swipe changes
  only the colour — silver master: `b-uwell/recolour-g4c.js` (G4 Classic; OVERRIDE target per colour when the maker's
  photo disagrees with the shop's) · coloured master: `b-voopoo/recolour-g3m.js` (hue wobble scaled by target chroma,
  dark pixels + rim glow turned to the target hue — lesson 23); (b) each colour its own print/texture (ARGUS P3) = the
  night render of each colour, flat-cut, toned to the maker's photo (`b-voopoo/p3tone.js`); (c) single-option product
  = the night card render in the maker's pose (`b-voopoo/zero-nano.js`). Then presize (840 box / card 940x1175,
  sharpen 0.5) + map entries with aiRender (`b-uwell/presize.js`, `b-voopoo/presize-g3m.js`, `presize-p3.js`) +
  `npx tsx scripts/process-images.ts --only <slug>` (it never overwrites a same-size file: change of a LIVE photo =
  new file name, lesson พ6). Check every night render for MIRRORING against the maker's front photo before using it.
  NIGHT RENDERS 01/10: 222 jobs, `_incoming/image-sitewide/night/jobs.tsv` → `Higgs Okm/` (git-excluded). Many are
  unusable as-is [ตรวจแล้ว — by eye, per product] — use them as a master for the methods above.
  Done this round (below-standard photos, sharp-scan `_incoming/image-sitewide/night/sharp-scan.tsv`): G4 Pro KOKO,
  G3 Pro KOKO, G4 Classic, ARGUS G3 mini, ARGUS P3 colours, Zero Nano [ตรวจแล้ว — merged + checker each]. G3 Pro (plain) kept — sharp (lesson พ9).
3b NEXT — ORDER (owner 01/10: Esko LAST; "เดินงานแก้รูปสินค้าให้เสร็จ"):
  (1) coils — 8 coil/cartridge cards below standard (sharp-scan: coil-54 1.1 · coil-74 2.6 · coil-56 3.2 · coil-55 3.3
  · coil-89 3.6 · coil-68 4.1 · coil-87 5.3 · coil-83 6.2 — cardDetail): retailer photos with the retail box on white,
  274–700 px; NO night renders exist for them → new renders need credits = waiting on owner (item 4 (30)).
  (2) batch 3 on 06/10 (after the baseline freeze): argus-g4 + Argus Multi-Ohm + ARGUS P3 card-v2 + openOnCardPhoto
  (P3's card renders on argus-g4 via relatedProductSlugs, so it stayed `variants/blue-leather.webp`; P3 page now opens
  on the first colour) + M Bar 15K duplicate record (= M Switch Kit).
  (3) BATCH 5 rest of the site (planner first; TFIT M Power after a researcher confirms the model); next in sharp-scan
  order: joiway-f4 (1.9, 16 opts) · relx-creator (2.8) · argus-g4-mini (4.2) · relx-smash-go-12k (4.9).
  (4) Esko pod-159 LAST: the 18 maker flavours show "หมด" (Shipnity status `unknown`; PilotProductDetail /
  ProductMasterVariantPicker / catalog-resolver treat non-"in-stock" as out) — owner §18: show as available —
  stock/cart change = 13.7 big (2), full set, own PR, + BSOT §21 (pod-159 block).
  Higgsfield balance 1.6 credits [ตรวจแล้ว 01/10 afternoon — not used this chat]; 4K = 4, nano 2K = 2,
  gpt_image_2_5 = 0.25, image_background_remover = 1. Back views G4 Pro KOKO Desert Gold / Golden Carbon in
  `Higgs Okm/2026-10-01 G4 Pro KOKO back views/` — NOT on the site (no slot for a second view per colour).
  At the round close: `npx tsx scripts/asset-refs.ts` for unreferenced product photos (list in item 5).
4 waiting on owner:
  (30) coil photos: OK to spend credits? ~2 per coil with nano 2K (8 coils ≈ 16) or ~0.25 per coil with GPT Image
       (lower detail) — balance 1.6. Recommendation: nano 2K for the 4 worst (coil-54/74/56/55) first.
  (29) new photos not yet seen by the owner [ตรวจผ่านตามเกณฑ์ ≠ เจ้าของอนุมัติ]: G4 Classic Alpine Green · ARGUS G3
       mini 9 · ARGUS P3 7 (Blue Leather graffiti = AI redraw: letters "ARG/MS", "P3", "voopoo" sit slightly
       elsewhere than on VOOPOO's print) · Zero Nano card. Before/after: `_incoming/image-sitewide/b-voopoo/shots/`.
  (28) Thai copy flags from thai-copy (not changed): INFY `descriptionTh` says disposable-only brand (its English line says
       pod systems + cartridges too) · shared strings "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" / "สินค้าที่คุณอาจสนใจ" stiff
       site-wide · RELX Creator = "เครื่องระบบสวิตช์" (locked word) or keep "เครื่องใช้ซ้ำ"
  (14) category structure — its own round · (1) image-theft protection · (2) Muro Connector category · (3) SALTHUB
       per-flavour file request
5 open / dated:
  - 05/10: re-read GSC against `docs/SEO_BASELINE.md` (Cowork supplies the numbers); after 05/10 the 7 baseline pages
    use the light set — delete `galleryNoteHeld` + the `heldNote` prop; M Bar 10K airflow row;
    then drop the "ถึง 05/10" clauses of TEAM_RULES 13.5 #3 / 13.7 / 13.8.
  - A product's CARD renders on the baseline pages that list it in relatedProductSlugs (argus-g4 → argus-g4-mini,
    argus-p3, vinci-s; caliburn-g5 → caliburn-g5-lite, caliburn-g4-pro-koko, caliburn-g4-pro) [ตรวจแล้ว — data] — until 05/10 change only colour photos
    there. html-diff strips <script>: argus-g4's RSC payload now names P3's v2 colour files (DOM, head, JSON-LD identical)
    [ตรวจแล้ว — checker PR #171]; Friday judged that "unchanged" (13.5 #3 proof = html-diff) — owner may rule otherwise.
  - `lineupFirst` has no product left (M Bar 10K moved to `openOnCardPhoto`) — the mechanism can go in a cleanup.
  - `dict.product.anatomyTitle` en/zh "from the outside in" (pre-existing, out of scope so far).
  - `_incoming/` folders moved out 01/10 to `C:\Users\dhetc\OKami24-เก็บ\incoming-01-10\` (not deleted).
  - Known lock limits (checker accepted): a ban hidden inside `bash -c '…'` / `python -c` is not seen by the hook.
  - Carried ideas: card sweep on 4:5 · ARTICLE round · category-structure round.
  - The all-options image ("ทั้งหมด") comes back later in a new form — the OWNER reopens it (01/10); until then none is made.
  - Unreferenced since 01/10 [ตรวจแล้ว — checker PR #172 ran asset-refs.ts] (sweep at the round close): the six round lineups, G3 Pro KOKO lineup.webp + old variant files,
    G4 Pro KOKO old variant files (card.png stays — the home Scene2 uses it), G4 Classic card.png / lineup.webp / old variants
    + variant-alpine-green-v2.webp, argus-g3-mini card.webp / lineup.webp / variants/*, argus-p3 lineup.webp + variants/*
    EXCEPT variants/blue-leather.webp (still the P3 card until 06/10), zero-nano card.webp.
6 verify baseline at the last full close (clip round; its logs no longer exist after the 01/10 move — numbers kept as recorded): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Latest light set [ตรวจแล้ว — run this chat]: PR #171 — tsc 0 · verify:catalog 29/29 · gallery-probe `--sitemap` 45/61 pages with a gallery PASS
  in both modes, 0 FLASH/STUCK · html-diff live vs local on the 7 baseline pages identical 7/7
  (`_incoming/image-sitewide/b-voopoo/html/`). PR #170 the same probe (normal mode) 45/61 PASS.
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
by swipe (IMAGE_SPEC §0 item 5) · NO all-options image / "ทั้งหมด" chip on pages that got the new sets — the round's
stage-arc / fan lineups were removed 01/10 ("1 ตอนนี้เอาออกก่อน … จะกลับมาทำใหม่ภายหลัง" — the owner reopens it, not us) ·
every product gets an SEO article in "more details" = its own later round.
