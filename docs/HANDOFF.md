# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] on every "done / works / number" statement (central §12 item 9) · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1
Rewritten 30/10 ~19:00 by the 3rd main chat (Friday) — moved at 70% context and weekly quota 80%; the 4th main chat starts here.

1 main ≈ 55c6fd6a 30/10. CART IS ON. LIVE 29–30/10 [ตรวจแล้ว: checker PASS + deploy success]: cut-off 12:30 · unboxing notice · address dedupe (#1010 #1030) · tracking step 1 (#1014) ·
  carrier by postcode (#1029) · SHIPPING v2 + "count all" (BSOT §10) · order-page art (#1023 #1025 #1028: thank-you = big samurai no card; black PAYMENT CARD) · staff lists newest first ·
  #1044 staff buttons "กำลังทำ…" + /staff loading screen · #1046 "ทีมงาน" button (marker cookie `okami24_team` set at staff login, read by `src/components/layout/TeamShortcut.tsx`; pages stay static) ·
  /products/pod-systems SEO (#1019) · RELX / Vazer / INFY / SKE Crystal (#1048, 8 flavours in one scene, 14 credits) photos.
2 CHILD CHATS (≤ 3; they report to Friday; open the next chat with skill round-open "continue"):
  a SEO chat local_56539076 (RELX PR in verify at 19:30): SALTHUB · RELX · INFY · nexBar — FAQ from verified specs + links + brand pages + meta (articles need a maker poster;
     a new look for poster-less products = designer + owner, not asked).
  b ORDER-DESKTOP chat local_d7ab6ad2 (started 19:00): owner 30/10 "การ์ดขอบคุณบนคอมแก้เลย: คำขอบคุณซ้าย ซามูไรขวา เลื่อนลงเป็นรายละเอียดออเดอร์ ใช้พลังความคิดเต็มที่" — desktop only, designer options → 2 draft
     screenshots to Friday → Friday sends the owner → build. PR #1038 (old stage-light try) stays a DRAFT, never merge. Images chat 7 done (credits 1729); old SKE PR #1040 = OPEN draft, superseded, close it (auto mode refused
     `gh pr close`: owner presses close or allows).
  c `okami24-seo-weekly` (Sat 15:00, first run 31/10): owner sets Auto once; Chrome logged in to GSC.
2N NEXT for the main chat (in this order):
  a SLIP "TIMEOUT" (owner 30/10: the LINE bot says "ตรวจสลิปไม่ได้ตอนนี้ (รหัส TIMEOUT)" 2–3 times today, re-check later works): EasySlip is called ONCE with a 20 s limit (`src/lib/staff/easyslip.ts`; callers
     `src/lib/line/webhook.ts` + `src/lib/staff/slip-checks.ts`). Plan: bounded retry/auto re-check for TIMEOUT / NETWORK / 5xx only — CAREFUL: EasySlip answers a repeat of an already-verified slip as isDuplicate:true
     (cached, no quota) → a retry after a timeout must not read as a REUSED slip; read the decision code first. Money = checker full set; quota 497/1000 (23/10).
     CASE 30/10 18:35: Krungthai ฿1,100 → PromptPay (K+, masked) failed in LINE/web/scan, money WAS in → read its slip_checks row first.
  b DESIGN REFERENCES from the owner 30/10 (Instagram reels, open in the owner's Chrome, never like/follow): back office + member sign-up page designs https://www.instagram.com/reel/De9XFBQTG0D/ and
     https://www.instagram.com/reel/De6ef-Svrlj/ · "Zoom" motion for the home + product pages https://www.instagram.com/reel/DfAqpTsOHYn/ → skill okami24-plan + designer; he has designs to send.
  c JOIWAY F3 — OWNER ANSWERED 30/10 ("Funta Grape Ice ก็คือตัวนี้ Ice · Funta Green ก็คือ Green"): our green photo named "Funta Grape" IS Funta Green; grape = existing "Grape Ice".
     DO (data PR + checker): green photo → option `funta-green` (Pod-133-15) · remove option `funta-grape` · fix "Funta Grape" in `src/data/guides.ts` · no new photo.
  d tracking-sync step 2 needs the admins' JSON (รอพี่ตรวจ 80, real-order test 31/10); unproven that Shipnity sends tracking back at all (survey doc: "not mentioned") · carrier auto-send only on the owner's word.
     CANCEL-ALERT TEST (owner, 30/10 ~19:00): he sends one order to Shipnity, the warehouse cancels it → expected (#958): LINE "OKM Order" alert once + a row under "ออเดอร์ที่คลังเปลี่ยน"; the web order does NOT change by itself
     (staff cancel it on /staff, reason "ทดสอบ"). Ask him for the result. ROUTINE "new models research" (owner 30/10) = drafted, NOT created (auto mode refused): `_incoming/new-models/routine-okami24-new-models-research.md`.
  e RENDER (owner OK 30/10, set via his Chrome): Build Filters → Ignored Paths `docs/**` + `.claude/**` — works [ตรวจแล้ว: #1049 no deploy]; a docs PR must be ONE clean commit from latest main (merge-of-main commits DO deploy).
  f Stuck "รอส่งคลัง" orders (#0010 #0011 #0014 #0015 #0017 #0020 #0022): admin presses "ส่งรายการให้คลังแล้ว" · back-office queue: customer cards (Gmail data + perks; owner asked twice) · EMS/DHL tracking page + motion ·
     staff-by-Gmail NOT built (BSOT §11 keeps no email) · LINE orders on web (later) · off-site backup (77) · THAI_STYLE row for the Latin label "PAYMENT CARD" at the next round close.
3 OWNER QUEUE — owner's order 27/10: logo → cart fit → staff pages → LINE sign-in logo → best sellers; then the rest.
  a Q6 LOGO ROUND — CLOSED 28/10, tag logo-q6-2710 (batch 1 #915 · batch 2 samurai #961 · batch 3 LINE icon uploaded 27/10).
     Owner's files = untracked `logo/` folder, never delete. Header: helmet mark under sm and lg–1439 px, lockup at sm–lg + ≥ 90rem.
     Left: broadcast "โฉมใหม่" = the OWNER sends (outsiders, 13.3) · checker taste note: faint smear + grey seams in the owner's PNG
     (visible only large, share image) — a clean file from the owner fixes it, never retouch.
  f B5 STOCK QUANTITY + "ใกล้หมด · เหลือ N ชิ้น" (§18): ① count log ENDED (routine deleted 28/10; Shipnity sends numbers) · ② DONE 28/10
     = live stock from Shipnity (3u) · ③ label at ≤ 3 left on option tiles + product page (designer places it) — numbers now exist.
  g Q9 staff dashboard [PLAN WITH THE OWNER FIRST]: live visitors (no Analytics/cookies — owner 07/10) · member sign-ups · customer
     profile with past orders (members #854, orders.member_id vs phone orders, PDPA BSOT §11) — on /staff.
  h OWNER'S NEW TEAM TOOLS (owner 26/10): agent `visitor` not yet run for real — first use = the next big round or new look ·
     (3) shop accounts audit (income/costs/investment) = a SEPARATE project (central §12 item 32) — PARKED, owner 27/10 "ยังไม่ทำตอนนี้";
     web-side costs (Render · GitHub · Higgsfield) go on the status page. (1) /วางแผน = skill `okami24-plan` · (2) assets folder = IMAGE_SPEC §0 item 7.
  Test orders OK-20261023-e25378 (+ maybe M Bar 9K ฿400) → cancel on /staff (reason "ทดสอบ") when the owner finishes testing.
  Known, not fixed: rate limit trusts X-Forwarded-For off Cloudflare (shop-wide 300/10 min cap) · after a partial refund no second
     out-of-stock issue (one row per order) · history keeps the refund ref, not the amount · no DB-level tests · cart C (#795) Back
     from review returns to review · a typed note is lost if placing fails · add form needs JS, double tap while pending adds twice ·
     #807 notes a/d + cleanBankText keeps invisible characters · BSOT §9 line by #804 quotes the owner's 24/10 chat — confirm.
  Warehouse: Pod-156's 14th option is coded "Pod-147" in Max (decoder skips it) · manual sold-out list EMPTIED 28/10 (owner "ยกเลิกการปิดขาย อัพเดตสดตามจริง"; live stock decides,
     no-SKU options stay out) · EasySlip quota 497/1000 (23/10) — warn
     before it runs out · K+ slip misjudged 10/10 → EasySlip matchedAccount (owner step, รอพี่ตรวจ).
3c Cart (round closed 26/10, tag `cart-reopen-2210`): off-site DB backup needs an R2/B2 account = the owner signs up (รอพี่ตรวจ 77;
  DEPLOY-RENDER §9) · age-gate body still says "order on LINE" (owner 24/10: stays).
3w Home (closed rounds = their tags). Home switches
  `src/data/home-hero.ts`: DESKTOP_HERO · DESKTOP_BG · DESKTOP_CARD_LAYOUT · DESKTOP_TRAVEL · PHONE_HERO.
3u STOCK — Shipnity pushes stock numbers to /wp-json (woo_stock_reports) and the site reads them at runtime (live stock, 28/10).
  Hourly `okami24-stock-daily` DELETED 28/10 (owner; prompt backup `_incoming/stock-api/okami24-stock-daily.SKILL.md.bak`). NEW: daily
  `okami24-new-products-daily` (12:00, Auto) reads the order-entry picker for codes not in sku-map.ts → `_incoming/stock-api/new-products.md`
  + push to the owner "เปิดแชทหลักแล้วพิมพ์ ลงสินค้าใหม่"; never changes the site. Friday lists them, clears lines once listed.
  SHIPNITY LINK (owner 27/10, chat "API"): no paid Shipnity API — the site answers WooCommerce's REST calls itself and the warehouse
  types Url · ck · cs into Shipnity (warehouse 27/10: those 3 fields). Plan + state = `docs/cloud-results/stock-api-sku-survey.md`
  "Shipnity link". Live 28/10: #937 door · #957 order button · #958 cancel alert + compare · live stock (runtime; build read = fallback). Hourly routine DELETED 28/10 (owner). Still build-time: listing cards, the in-stock filter, JSON-LD (next build). 【ห้ามแตะ】 coil-1/72/94 photos · every price file.
  28/10 night: /staff/shipnity = Shipnity pushes on every change (PUT log, all 738 codes reported); Kyoho Grape + Muro
  Watermelon are Shipnity 0 now (sold) — live is right. Excel +6 columns live (#963). Cart cap live (#967, owner "Cap it",
  §18 "Stock"): a line ≤ the live count, `shortTo` blocks checkout, unavailable lines show names. Owner asks: slip zip
  (รอพี่ตรวจ 82). New-product alert LIVE (#971, owner option A): the 15:00 run appends to `src/data/stock/warehouse-new.ts`
  in the product PR → after deploy the 10-min sweep tells LINE "OKM Order" once per code:status (`woo-new-products.json`)
  + Okami dev lists the last 10 · LINE comes after the deploy, not at the find (phone push at 15:00 unchanged). Stock light LIVE (#969, owner "ตามแนะนำ"): Okami dev box +
  row (green · amber no push 24 h · red = no key / never / an order sent > 3 h ago (48 h lookback) with no push since) ·
  sweep 10 min (instrumentation) · LINE OKM Order once into red + once on recovery, retried while the push fails · state =
  <data dir>/woo-watch.json. TUNE after ~1 week: compare real first_sent_at vs the next product PUT (woo_api_log) — the 3 h
  rule assumes Shipnity moves stock when it takes an order (unverified; owner told false reds are possible). The 401
  `GET /wp-json/wc/v3/orders` (19:06 + 20:42 28/10) were NOT Shipnity: ua curl/8.21.0 from a Thai home IPv6 (Shipnity = ua
  shipnity-channel-gateway, ip 74.220.52.129) — our own no-key test, nothing missed. #0021 (order 33): Shipnity sent
  PUT /orders/33 {"status":"cancelled"} at 20:00 28/10 — before #958 (cancel alert) went live 20:37, so no LINE and no row
  under "ออเดอร์ที่คลังเปลี่ยน"; the web order still shows รอใส่เลขพัสดุ (by design the web never changes status itself).
  Slip zip: NOT built (owner 29/10 "ตามแนะนำ" = the Excel slip columns + per-order slips are enough). New-products run (15:00) needs the PC on.
  Open: `legacy-price-approvals.ts` still names Pod-181 for caliburn-g4-pro (next allowed price-file touch) · at 390 the small pill
  sits on the IQOS ILUMA i cap (iqosheet-18) — Friday's pick at the next touch = a free band above full-frame photos.
3i PARKED 20/10 round "image sweep" (`docs/rounds/รอบรูปทั้งเว็บ-NanoBananaPro-16-10.txt`): left = 21 warehouse products (รอพี่ตรวจ).
  Kept branches: img-ag4gal-1610 · img-se-1610 · img-b17-combo. Resume from `_incoming/img-1610/NEXT.md` (state, prompts, masters, open refs) · full old state = `git show 464b7f64:docs/HANDOFF.md` §16 3i.
3s PARKED round "SEO all keys" (`docs/rounds/รอบ-SEO-คีย์ทั้งหมด-16-10.txt`, line 2, owns 3p): worktrees `.claude/worktrees/seo-line2-c` ·
  `sad-nash-5bf72f` · `seo-line2`. Queue order = SEO_LANDSCAPE §9.6; held items, do-not-redo facts, guide standard, NEXT list and
  line-break rules = `git show 464b7f64:docs/HANDOFF.md` §16 3s (read it before resuming). GSC snippet gaps "esko bar" / "joiway".
3p PARKED round "p63 searched models" (`docs/rounds/รอบลงสินค้า-63-16-10.txt`, line 2): LIVE = #534 #537 #540 #583 #584 #589. NEXT =
  INFY 12K (NP) → round-close (tag p63-1610). Kept branches: p63-terea-publish · p63-uwell. Left-on-purpose + NOT REAL list = `git show 464b7f64:docs/HANDOFF.md` §16 3p.
4 waiting on owner: ONE list = `docs/รอพี่ตรวจ.md` — nothing waiting on the owner is written here. Status page for the owner's phone =
  §17 "Owner status page".
5 open / dated:
  - 04/11 tune the stock light's red rule (3 h after an order sent with no push) from a week of real first_sent_at vs product PUTs.
  - 01/11 GSC read (rows 9–21, 23) then 15/11 · 10/12 · 02/11 B5 verdict (item 3 f) · Search Console 2–4 weeks
    after 12/10: no okami-24.com URL shows instead of .store.
  - GSC in the owner's Chrome: screenshots time out — drive by `find` refs; type the URL into "ตรวจสอบ URL ใน okami24.store" + Enter TWICE.
  - YouTube drafts 8–13 (SEO_LANDSCAPE §4) = the owner pastes them in Studio; a renamed clip → update its `title` in guides.ts.
  - Speed (LESSONS 37): NEXT = PRODUCT_COPY_TH via ProductCard (taglineTh prop) · then framer-motion on home (designer first).
  - Own rounds (owner 07/10): typo-tolerant search · lifestyle strip on product pages (one sample shot first; answers in
    https://claude.ai/artifact/FyeA5PgJswtYDvoh3xUwSr "answers") · every product gets an SEO article in "more details" (owner 01/10).
  - Data, copy, cleanup and page notes for each page's next touch = `git show 464b7f64:docs/HANDOFF.md` §16 item 5 (unchanged lists).
  - Scan baseline re-measure on the test server = the next full round close (replaces the old item 6 baseline of 14/10).
  - Proposal to make (owner 03/10, item D): move chats earlier in image rounds (~350–400K) = central rule → propose with reasons first.
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` (+ the round file the owner approves next)
  (cloud chat: + `docs/CLOUD.md` item 3)
```

## 17. Tools and standing technical rules (not state — open when needed)

```
Do not touch unless the round file names it: layout outside the named spot · images (outside an image round) · motion ·
  ordering-mode.ts · slug/URL/sitemap/structured data · service pages (unless the owner asks or a BSOT fact changes — §18) · Hero.tsx · cinematic/ · THAI_STYLE group ก ·
  labelTh/name/shortName · lg:min-h-10 · age/nicotine warnings · colour/flavour names · thai-typography.ts list (locked, 13.7) ·
  CategoryLabel.tsx / label-lang · card-headline-spec.ts rules · dictionary catalog.card* / trust.* (set ก) · TrustBar row
  layout / 4 icons · sticky th on /compare · ScrollHintFrame · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on
  "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools · THAI_STYLE_LOG §7 rows of
  round 30.4ข · ProductHero stats / PuffCount / Coil-72 category (data round) · footer.tagline / cart (their own rounds)
  — never: joiner/NBSP outside the list · two Chrome jobs at once (locked: `scripts/lib/chrome.js` makes the second wait) · fixing tier-B orphan words one by one · placeholders
  in an empty spec row · screenshots without a scan first (13.5 #7)
Site copy (every round): every new sentence = 3 languages (new articles = Thai first, `thaiOnly: true` — §18) · Friday picks
  reversibly, the owner keeps/undoes after merge (TEAM_RULES 13.3 last paragraph + 13.8) · every
  number points at a verified spec row · no U+2060/NBSP outside the mechanism · thaiTypography() has a locale guard ·
  generated evidence mirrors the component logic in full · forbidden claims = THAI_STYLE §3 (one list) · prices are
  never typed — always read live from the catalog (`priceOf` / `getCatalogItem`)
Test server: `node scripts/test-server.js build` then `start` (port 3412 · SITE_URL=https://okami24.store ·
  OKAMI24_DATA_DIR=<tmp> · backup and startup probe off · log `_incoming/test-server-3412.log`) · a new build needs
  stop → start · stop = `node scripts/test-server.js stop` (kills only the PID on 3412 · `status`) ·
  port 3000 + `.claude/launch.json` "vapor-dev" = the owner's own dev server, agents never start it · never build while
  the server runs (`test-server.js build` and `verify:catalog --full` refuse; a bare `next build` / `npm run build` in the
  main folder is denied by `scripts/guard-tool.js` — a build whose folder (the shell's cwd, or a `cd` before it) is a
  worktree under `_incoming/` passes) · while the checker
  reads (note of `scripts/pre-checker-gate.js`, TEAM_RULES 13.4) start/stop/build of 3412 is denied too ·
  a SECOND server (3412 busy with another chat): a worktree with a real copy of node_modules (robocopy ~1 min; a junction
  cannot build), then `SITE_URL=https://okami24.store npx next build` + `next start -p 3413` with the test-server env
  (OKAMI24_DATA_DIR=<tmp> · OKAMI24_BACKUP_DISABLED=1 · OKAMI24_STARTUP_PROBE=0; no SITE_URL = build fails at /robots.txt) ·
  stop it by the PID on 3413 only ·
  Chrome one job at a time (machine-wide note in the OS temp folder — a second script prints "chrome: waiting", gives up
  after 15 min with exit 2; `OKAMI24_CHROME_LOCK_WAIT=<s>`) · a job over 10 minutes = background + watch the log · a full-page `shot.js` with black
  posters = shoot spot by spot with `--anchor` instead of chasing a page bug · an agent silent for 30 minutes =
  look at its PID/output files
Windows shell: scripts are written with the Write tool · Thai text enters scripts through json/txt files only (argv is
  mangled) · shot.js wraps the eval result in JSON twice (parse twice) · CRLF: a new file from Write = LF → unix2dos
  before git add · `scripts/eol-check.js --staged` runs in .githooks/pre-commit (hooks on after a clone:
  `node scripts/prepare-clone.js`, `docs/RECOVERY.md` 2ค · session-sync resets core.hooksPath to .githooks + warns) · .githooks/ files are always LF · Git Bash turns an arg "/"
  into a path → MSYS_NO_PATHCONV=1 (guard-tool denies a `node scripts/…` call with a /page argument without it) · `node -e "…"` runs backticks as commands and drops `\s` → script files only ·
  never pipe a long-running logger into `| head` (it kills node mid-run) — log to a file, then `tail` · the cloud is Linux (no autocrlf; `test-server.js stop` works there too)
Tools in scripts/ (usage = each file's head): shot.js · head-audit.js (head/links of every sitemap page) · site-audit.js ·
  scan.js · locale-hydration-scan.js · visible-text.js · wordbreak-scan.js + wb-diff.js · linemap-scan.js · html-diff.js ·
  overflow-390.js · og-gate.js · gallery-probe.js (touch/swipe every frame, `--sitemap`) · stale-image-audit.js ·
  flatcut.js · card-lines.js + card-lines-diff.js · empty-cards.ts · finder-dump.ts · measure-articles.ts ·
  related-boxes.ts · guide-reading-rate.ts · record-scroll.js + frames-to-gif.js · self-merge-check.js (13.7) ·
  pre-checker-gate.js (13.4 — before every checker · `--done` after its report · `--self-test` = every lock on a planted example) ·
  house-check.js (housekeeping measure: sizes · locks · rules followed · leftovers) · stale-work.js (stuck/due work — agent follow-up, session-sync, daily 13:00 task) · lab/js-weight.js (first-paint JS per page) ·
  poster-stretch.js (story poster/cover/anatomy file width vs drawn width, LESSONS-images พ17)
src files the skills use (the one list — skills may not name a file under src/, 13.2; fix a renamed file here):
  [i18n-test] `npx tsx src/i18n/i18n-contract-test.ts` · [catalog-method] `src/data/shipnity-seed/README.md` section
  "Catalog reconciliation methodology" · [legacy-products] `src/data/products/*.ts` · [taxonomy]
  `src/data/shipnity-seed/active-catalog-to-product-master.ts` (`TAXONOMY_MATCHES`) · [spec-gate]
  `src/lib/verified-specs.ts` + `src/lib/verified-specs-contract-test.ts` · [approvals]
  `src/data/shipnity-seed/publication-approvals.ts` · [active-catalog] `src/data/shipnity-seed/active-catalog-source.ts`
Verify: which set = 13.5 · the full list with commands = skill `round-close` step 3 · pass = what each script prints ·
  the last full-set counts = the latest round-close log
Git: commit message English, prefix feat/fix/copy/data/docs/chore/agents/rules · Thai text via `git commit -F <file>` ·
  push/merge/deploy = 13.7 · main's branch protection requires `copy` + `checks` (admins enforced, no force push; owner 14/10
  item 55 — a skipped `checks` on a docs-only PR counts as passed) · tag = skill `round-close` step 5 · a check that never starts (job with 0 steps) = read the
  check-run annotations first (`gh api …/check-runs/<id>/annotations`) — 12/10 it was the Actions quota
Agents: when to call each = TEAM_RULES 13.2 (+ the `description` line of its file in `.claude/agents/`) · never one call per sub-item ·
  an agent added or edited is usable at once in the running chat
Stock PR anomaly = draft + ask the owner (TEAM_RULES 13.7 · the prompt follows this list): more than 15 products change at once, or more than 60 codes
  flip in one run · a code in sku-map missing from the read, or far fewer read than last run · the reader reports a problem or contradicts itself ·
  the diff touches any file but the stock file (`src/data/content-dates.json` moved by the hook does not count). Reading the product-list page
  alone (not order entry) = may close only; reopening waits for the owner, then `--reopen`. How to read (read only) = header of `scripts/order-entry-stock.js`.
Render after a merge: ~1 min of 502 + ~2 min after the deploy job ends — wait, then curl. Higgsfield MCP: `generate_image`
  is ALLOWED (owner 20/10, #661); every other credit-spending Higgsfield tool stays DENIED in `.claude/settings.json` · credits =
  IMAGE_SPEC §0 item 7.
Work folders: round work = `_incoming/<round>/` (not in git) · what Friday may move or delete alone = skill house-clean
  "รายการเดียว" (its one home) · image provenance keeps pointing at `_incoming/` (§18).
Higgsfield (web app in the owner's Chrome): the draft box is SHARED across tabs and chats — open a new tab, set refs + prompt
  and click Generate in one go · free = the "365 Unlimited" models (Seedream 4.5 · Seedream 5.0 Lite · Nano Banana v1 ·
  GPT Image · FLUX.2 Pro 1K · Kling O1 Image) — check the button reads "Unlimited" before EVERY click · refs = the Chrome extension's
  file_upload on the uploads panel's hidden input (the app's built-in browser pane has no upload tool: 3 KB base64 chunks +
  sha256 check — slow) · results via MCP `show_generations` (read-only) · prompt box = Lexical editor (LESSONS-images 29)
Live site (moved from §16 26/10): ALWAYS after a merge check the deploy reached success (`gh api
  repos/dhetchaiyakrith24/okami24-web/deployments?sha=<merge sha>` → statuses) — #776+#779 builds FAILED on Render's 60 s per-page
  limit while local verify passed (#781) · every deploy = the short 502 window above + LINE webhook events in that window are lost → group merges ·
  Render builds every merge (Auto-Deploy "On Commit"; Blueprint "Sync paused" → Render settings change in the dashboard only) · spend
  limit $10/month (owner 23/10) · env change = Render → Environment → Edit → "Save, rebuild, and deploy" (prerendered pages need the
  rebuild); unrevealed secret rows show EMPTY inputs in the DOM — saving keeps them; edit only the one row (focus it by its key, type,
  check the value by script); Chrome screenshots of that page time out · cart off = OKAMI24_ORDERING=off the same way.
  LINE bot: webhook https://okami24.store/api/line/webhook; groups bound on /staff: "OKM Webside order" = order alerts · "OKM Slip
  check" = slip check · a join event lost during a deploy = remove the bot from the group and invite again (DEPLOY-RENDER §8) · LINE OA
  "OKM ORDER" @691qxpxp (free 300 msgs/month; a group push counts per member) · no Shipnity API — staff forward orders by hand · staff
  guide = docs/คู่มือแอดมิน-ออเดอร์เว็บ.md · order numbers use the UTC date (noted, not changed).
Test trees + PR flow (moved from §16 26/10): reuse `_incoming/wt-golive` · `_incoming/wt-cart` (real node_modules incl. jsqr;
  `_incoming/wt-stock` = the hourly routine's). A FRESH worktree fails verify --full typecheck once (LayoutProps) → run twice ·
  junctioned node_modules break Turbopack builds · gate `full` needs a verify stamp of the EXACT head → merge origin/main + all extra
  commits BEFORE the verify run (~20 min each) · flow: draft → verify --full on the head in a test tree → gate → checker → `gh pr ready`
  once → checks → `self-merge-check --pr` alone, IN the PR's tree → merge --match-head-commit → deploy success.
  Start a build: `OKAMI24_DATA_DIR=<copy of a test DB> SITE_URL=https://okami24.store npx next start -p <port>` (SITE_URL=localhost is
  refused) + OKAMI24_ORDERING=on at BUILD time for cart pages · order-page states `_incoming/stock-oe/` (data-b DB · seed-b.js ·
  shoot-b.sh) · cart flow `_incoming/cartux-a/` · staff pages locally: OKAMI24_STAFF_PASSWORD=<test value in
  `_incoming/stock-oe/.staff-test-pass`> (local only) · stop only your own servers by port (Get-NetTCPConnection → Stop-Process) ·
  server-action forms in the Browser pane: React resets uncontrolled inputs after every action (LESSONS พ45).
Owner status page (TEAM_RULES 13.6, owner 26/10): https://claude.ai/artifact/WW3HFHFntievMThnvNtn1K ("OKami24 งานวันนี้", Thai, phone-first) ·
  update = Artifact tool `action: read` with that `url` (gives the saved page file) → edit the sections (รอพี่ตอบ · รอพี่ทำเองหรือเลือก ·
  กำลังทำ · คิวถัดไป · เสร็จและขึ้นเว็บแล้ว · ยังไม่ได้เคาะหน้าตา · ค้างนาน = the only section the daily 13:00 task writes) + the date line → publish with the same `url` · pictures = the page's
  asset store (needs the `assets` capability — skill `artifact-capabilities` first) · its waiting sections = `docs/รอพี่ตรวจ.md` + questions open in the chat (the page never holds a decision the files lack).
Scheduled tasks: unattended = TEAM_RULES 13.6 · a new task: "Run now" once while the owner
  is there and "Always allow" each prompt, or skill `fewer-permission-prompts` · one command per Bash call
```

## 18. Permanent owner rulings — settled, never re-ask (central §12 item 17)

Business facts live in `docs/BUSINESS_SOURCE_OF_TRUTH.md`, Thai words in `docs/THAI_STYLE.md`, images in
`docs/IMAGE_SPEC.md`; this list holds the rulings that have no other home. A ruling that is replaced = overwrite its line.

**Red for "no" (owner 26/10): every box or line on the site that says no / not passed / not approved / not allowed /
refused uses the red `danger` colour, never the ember orange** ("ขอใช้เป็นสีแดงได้เลย ไม่ใช้สีส้มทั้งเว็บ"). Ember stays for
actions and accents (the how-to-order "ordering paused" note is information, not a no — stays ember). **Yellow (owner 26/10):
waiting / pending / being updated / being improved / being checked** ("สีเหลือง รอดำเนินการ รออัพเดต รอปรับปรุง ตรวจสอบ") —
the amber of "รอชำระเงิน" on the customer side, `unverified` on the staff side; the staff pages get it in the staff redesign.

**Header logo (owner 28/10, asked after the header was approved):** keep it as it is — helmet mark only under sm and at
lg–1439 px, helmet + wordmark at sm–lg and ≥ 90rem; no smaller lockup at 1024–1439. The header itself is approved (28/10 "หัวเว็บผ่าน").

**Orders to the warehouse (owner 27/10, chat "API"):** when web orders flow into Shipnity by themselves, the LINE alerts stay
exactly as today — new order in the order group, slip attached in the slip group ("การแจ้งเตือนทางไลน์ยังเหมือนเดิม แนบใบสลิปเหมือนเดิม") —
only the admin stops keying the order into Shipnity by hand. Slips never go to the warehouse.

**onrender.com stays open (owner 26/10):** the service's `*.onrender.com` address is the back door "ในกรณีที่หน้าเว็บหลักเข้าไม่ได้" —
never disable it.

**Owner's personal contact — NEVER (owner 26/10 "งานเว็บทั้งหมดต้องไม่มีส่วนไหนชี้มาหาส่วนตัวพี่ครับ ห้ามเด็ดขาด"):** nothing in
the web work may point to the owner personally — every contact / support / developer email on the site and on every outside
service set up for it (Google Cloud consent screen, LINE channels, Render, …) = **okamisalt@gmail.com**. The bank account
holder name on the order page (BSOT §9) is the receiving account itself, not a contact pointer — raised with the owner 26/10.

**Pods = INTERNATIONAL version (owner 26/10 "แบบสากลครับ", answers รอพี่ตรวจ 58):** Caliburn (UWELL) + VOOPOO pages state the international version only — pod/tank capacity (3 mL / 3.5 mL / 4.5 mL / 5 mL), dimensions, weight and in-box pods; no "(2 mL in the TPD version)", no INT/FDA/TPD/CRC splits. The maker compatibility lists ("also fits … CRC versions") stay as the maker wrote them.

**One "เทียบแท้" (lookalike) product — Marbo 10K (owner 27/10, through the main chat):** Max Disposable-47 "Marbo 10k โคลน" is an
imitation of SALTHUB's M Bar 10K. Owner: "มันเป็นของก็อบอะอยากให้ลงด้วยนะแต่กำกับว่า *เทียบแท้* และราคาตามนั้นเลย", then
"(แนะนำ) ลงได้ ชื่อสินค้า “Marbo 10K (เทียบแท้)” ราคา ฿299". Rules for that page only: name "Marbo 10K (เทียบแท้)", price = Max
ราคาขาย (฿299), all its flavours · a clear line that it is a เทียบแท้ item, not a SALTHUB product · no "ของแท้" / genuine wording on the
page, title, meta or JSON-LD · the /warranty authenticity refund does not cover it · never in cart suggestions or shop picks · never
linked to or from the genuine M Bar 10K page. The only exception to BSOT "Genuine products"; any other lookalike = ask the owner.
Photos (owner 27/10, the warehouse confirmed the item is identical): "ใช้รูป M Bar 10K ที่เว็บมีอยู่ได้เลย เพราะของเหมือนกันเป๊ะ" — the
page shows the site's M Bar 10K card and the device photo of each SAME-named flavour; a flavour whose name differs gets no photo.
**Shop and ordering:** the cart is ON since 24/10 ~23:35 (owner "จบตรงนี้เปิดระบบตะกร้าเลยครับ") · refunds go to a PromptPay number OR a bank account + the bank's name, no branch needed (owner 24/10 evening, BSOT §9) · stock without a rebuild IS planned — B5 (owner 26/10, low-stock label) replaces the 24/10 "stock-PR deploys are fine, no need" (house round 26/10) · checkout = phone only, no OTP
(owner 23/10) · a customer finds their orders by PHONE NUMBER ONLY (owner 24/10 "เบอร์โทรครับ" — name/address masked) · stock PRs merge
without the owner (owner 24/10, TEAM_RULES 13.7) · the 4
service pages (`/warranty /shipping /how-to-order /privacy`) are touched only when the owner asks or a BSOT fact they state changes (owner 26/10, house round) and carry no JSON-LD on purpose (item 49) ·
**free shipping ฿500 (owner 26/10):** the start date = the owner types it; Friday never starts it alone (owner 27/10, answer 80) · the day the promo really starts, Friday adds it to BSOT and the "ส่งฟรี" / payment wording ban of THAI_STYLE §3 lifts for copy that states the real policy (owner's OK = the house round 26/10; until then the ban stays) ·
green "shipped" glow = the style for key-moment effects site-wide ("ยืนบนความเรียบหรู", owner 23–24/10) · IQOS colour names = Friday decides ·
caliburn-g4-pro = Pod-168 (Max's code, owner 08/10 — the old Pod-181 belongs to the retired system) · muro-3ml = ฿150 (admin list, "Selling prices" below) · the 20 owner-estimate rows in
`legacy-price-approvals.ts` change when an admin reports that price ("Selling prices") or when the stock API lands.

**Head copy and SEO:** e-liquid stock is 0 on the storefront → "น้ำยา" stays out of head copy except `/e-liquid` itself and the refill how-to guide, whose title may read
"เติมน้ำยาพอตยังไง" (owner 16/10, list item 66 — a how-to, not a page selling e-liquid) ·
"พอตไฟฟ้า" and "บุหรี่ไฟฟ้า" are both allowed in head copy · misspelled search terms → hidden search aliases only, never
visible copy · brand names in Latin, incl. "Marbo" (the one exception + hidden aliases = THAI_STYLE §2 layer 1 and §3 "รอบ 8") · the head-copy trim rule: cut at a sentence/phrase
boundary, never mid-word, never a dangling connective, never a bare floating number, never a stranded clause-opener
(THAI_STYLE_LOG §7) · round 7 (SEO ค, owner via Cowork 23/09): home page top word "Pod System", "บุหรี่ไฟฟ้า" second · "Marbo" and
"M Bar" must both rank ("SALTHUB (Marbo)" brand title · "M Bar = Marbo" body line · FAQ "Marbo กับ M Bar") · wholesale FAQ =
"ติดต่อหลังไมค์ทางไลน์", no numbers, no discount; its question may use the word "ราคาส่ง" (owner 16/10, list item 64) · breadcrumb "Home" stays (no "หน้าแรก" — no ranking effect) · LINE-click counter =
in-site count, no cookies, nothing sent outside ·
new articles = THAI FIRST (`thaiOnly: true`, translated later) · free SEO tools only (round SEO ฉ) · `okami24.net` / `.com` NXDOMAIN — leave them · `voopooTitle` (code name of the home section "Pod Kit / พอตคิท") keeps its name — a rename changes nothing a visitor sees (Friday 15/10) · no `OKAMI24_METRICS_TOKEN` — read the
Render Web Shell instead (`docs/DEPLOY-RENDER.md`).

**Sources named in articles (owner 13/10, chat):** no Thai agency or Thai source is named or linked as a source on the
site ("ไม่อยากให้อ้างอิงหน่วยงานไทย เพราะข้อมูลมันเอียงน้ำหนักเพื่อผลประโยชน์ของประเทศไทยเอง") — name international or
foreign bodies (IATA, NHS, WHO …); a rule only a Thai source states may be written as a plain rule, its source kept in the
code comment / evidence file · health / quitting copy = both sides kept, the cautious side trimmed to each agency's core
position ("ไม่ใช่เชิงชวนซื้อขาย แต่ก็ไม่ตัดทิ้งจนลูกค้าหันหน้าหนี") · the owner is never named in his own quit story.

**Text length per product page (owner 03/10):** 1,000–3,500 unique Thai characters of main content (spec table not counted) +
the same fact at most twice outside the spec table — "ตอนนี้กำลังสวย ไม่ต้องลดเนื้อหา" (proposal: `_incoming/g5-template/seo-text-length.md`).

**Stock (owner 08/10):** stock truth = Shipnity Max only (`app.shipnitymax.com`) — the WAREHOUSE's account, not the shop's (we
only read it, to open the cart later) · the old Shipnity (`shipnity.com`, source of the September seed and of the Pod-181 re-code)
is retired: "ตัวเก่าเขาไม่ได้ใช้แล้ว" — never take a code, stock or price from it · an option or product with no SKU there = "สินค้าหมด", page and option stay (SEO; customers pick another
model), even when that is over half the catalog · Shipnity spellings that differ are matched in `src/data/stock/sku-map.ts`,
never fixed in Shipnity · the warehouse will send the API; build the SKU map meanwhile. · **Cart cap (owner 28/10 "Cap it"):**
a cart line never holds more than Shipnity's live count for that option (20 when there is no number) — never cut an order
silently: a line above the count blocks checkout until the customer lowers it.

**Low-stock label (owner 26/10, chat — answer to รอพี่ตรวจ 78):** the word is **"ใกล้หมด · เหลือ N ชิ้น"**, shown at ≤ 3 left
(Friday's threshold, the owner picked the word with it). Not built yet — B5 in §16 item 3 c.

**Catalog options sold in one market only (owner 06/10 night, "ใส่ไว้ครับ"):** a colour/flavour the maker sells in a single
market (e.g. IQOS ILUMA i Bold Ruby, jp.iqos.com only) is listed like every other option — non-purchasable until stocked.

**Never write "the shop does not sell X" (owner 27/10, chat — "สินค้าที่เกี่ยวกับ Pod เราขายเกือบทั้งหมดยกเว้นของหมด หรือ เลิกขายแล้ว
และต่อให้เลิกขายหรือไม่มีขายเราก็จะใส่สินค้าลงเว็บเพื่อ Seo"):** no page says the shop does not sell / does not carry / has no
item, in any language. A product the shop is out of, has stopped selling or has not listed yet is listed anyway (SEO); stock
state is the cart's job. A line that would say "we don't sell it" = list the product instead.

**MOOOD Monster 14K (owner 06/10 night):** Grape N5% / Blueberry N5% keep the real frosted body (A) · flavour list = maker 19 + the
shop's 2 N5% · "Sugar Apple" as printed · nicotine row 3% · official-site link to the Wayback copy · no story section, 220 chars OK ·
who-for line = "…ที่มีกลิ่นให้เลือกหลายกลิ่น" (the edit itself = `git show 464b7f64:docs/HANDOFF.md` §16 item 5 "Data round").

**Selling prices (owner 06/10 night):** the admin's current prices in `รายงานจากแอดมิน แชท/รายงานสินค้า-ราคาไม่ตรง.txt` (17 rows,
confirmed by the owner 01/10) replace the site's prices.
Later the same night: **any price an admin reports applies at once — never ask the owner** ("รายการใดที่แอดมินแจ้งมาให้บังคับใช้ราคานั้นได้เลย
ไม่ต้องถาม") · "Coil Caliburn G" = both Caliburn coils at ฿450 (G2 + G4/G3).
That folder also holds admin chat screenshots: never add it to git.

**Brand logos (owner 03/10):** every brand's own logo goes on its product pages — "ใส่ตรงไหนตัดสินใจได้เลย"; Friday placed it
in the product hero in place of the brand chip, linked to the brand page; maker-served files only (light version for the dark site).

**Copy and wording:** words already on the site without a key are not "new words" · `readMoreEyebrow` = "อ่านต่อ", not
`footer.learn` · en/zh age-gate wording and en/zh `/about` copy APPROVED · the dialog nicotine sentence stays plain group ก ·
SALTHUB wording = option ข-1, no "แท้" · SALTHUB owns Marbo/M Bar (BSOT §21) · the 8 words locked as one set in THAI_STYLE §3 ·
WORD JOINER bindings = only the list in THAI_STYLE §5 · zh H1 wrapping mid-word (服/务) at 390 — leave it · collapsed
LINE pill off-centre icon — the owner's own list · no NBSP outside the list · an empty product card may show a real maker
fact or the desktop-style option count, never placeholder text · spec-table header on INFY / RELX ("ข้อมูลที่ยืนยันได้จริง …")
— no label, leave as is (01/10).

**Product facts (data rounds 24–25/09, 30/09):** a per-row source link is required for rows touched in a round + rows of
the 7 products the live 10B guides link to; older verified rows are grandfathered · every unverified number is hidden
from render · when a fact is missing, state the fact or say nothing — never explain the absence · product facts come
from the manufacturer only, everywhere on the site — the one list of named exceptions = THAI_STYLE §5 "ขยายเป็นทุกที่บนเว็บ".

**01/10 (owner, chat):** UWELL G4 Pro KOKO — UWELL's own site is the reference for its look ("อ้างอิงเว็บหลักได้เลย") · M Bar 10K opens on the card ·
จอพิกเซล / หน้าอีโมจิ approved (THAI_STYLE §3) · later the same day: the KOKO sheet "ทำเลย" · the G4 Pro KOKO card may change
the caliburn-g5 baseline page's related box ("ไม่รอผล ทำเลย") · Desert Gold / Golden Carbon back views via Higgsfield (stored,
not on the site) · unclear source = skip.

**Images:** image theft = handled by #322 (new images need nothing) · a logo over the image = owner "เอาแค่นี้ก่อน", do not
re-propose · the first photo of a multi-option product = one sharp single device, Caliburn style; other colours/flavours
by swipe (IMAGE_SPEC §0 item 5) · all-options image ("ทั้งหมด"): pod systems get a NEW one (owner 01/10 evening, design left
to Friday: plain, luxurious, premium, depth); disposables / pod-replacement products get none (IMAGE_SPEC §0 item 5).
**Review sheet + image work (owner 07/10 night, chat):** "ใบตรวจแบบที่ทำมาล่าสุดไม่ต้องทำแล้ว … เอาไว้งานใหญ่ที่ต้องดู Before - after จริงๆ
เช่นสินค้าตัวนี้แก้ยาก ต้นแบบมาเละ ค่อยทำ" + "ทำงานรูปภาพเสร็จ ขึ้นเว็บเลย … เดี๋ยวพี่ไปดูในเว็บเอง" → NO review-sheet artifact by default
(the 07/10 one is retired) · owner decisions = asked in chat + one line in `docs/รอพี่ตรวจ.md` · image work = checker passes → merge →
live, no review page; the owner checks the live site · a before/after review page ONLY for a big, hard case (a product that is hard to
fix, a broken source photo) · image routes and credits = IMAGE_SPEC §0 item 7.

**Answered 03/10 (moved from §16 04/10):** "ultra-shatterproof" stays OFF both G4 Pro pages · G5 repeats = A keep · logos: Kardinal = the maker's "Kardinal" word logo, site name "KS" stays · DOTMOD = text chip · batch 1c words locked (THAI_STYLE ก้อน 1c) incl. "แรงถึงคอ".

**Answered 06/10 (owner, chat: "ครับไปเลยครับ" to the recommended answers in `_incoming/sitewide-template/REPORT-0610.md` §4):**
M Bar 10K may drop its 4 owner-approved Thai lines for the stage page · M Bar 15K → reusable/pod-system category · wrong
facts in head copy are fixed now, not held for the SEO round (Zero Pro "5,000 พัฟต่อหัวพอต", M Bar 15K "cotton mesh/ชาร์จเร็ว/15 รส") ·
Zero Cartridge per-flavour photos = yes (in the option-photo round) · JOIWAY F4 = the TWINS edition (maker + our photos), not NOS ·
RELX Smash Go cover = RELX's KV with the models, kept · Smash Go 874 and nexBAR-type LOW pages = accepted
exceptions when the maker has nothing more to say (never pad) · RELX's printed "+30%" stays in the coil poster · RELX Creator
all-colours image = publish the draft · pod-180 stays brandless (WOTOFO options without a photo = the 08/10 answer below + IMAGE_SPEC §4).
**Answered 06/10 pm (owner, chat):** article sections that say "the maker doesn't state X, so we don't print it — ask LINE" read as
"we don't know" = unprofessional → cut (M Bar 10K + JOIWAY F4 nicotine, M Switch Kit battery); never write that pattern again ·
JOIWAY F4: "2 โหมด" belongs to the NOS edition → cut; the named exception "2 โหมด 2 รส" is gone · F4 review video = the shop's own
F4 TWINS review (l-8sAPwOUZw, OKM YARZ), not the NOS one · words ดีไซน์เรียบ · มองเข้าไปข้างใน · ภาพโปร่ง · คู่กลิ่น = approved (THAI_STYLE).
**Answered 07/10 (owner, review sheet):** the Q8 words are locked and the RELX pod is "RELX Creator Pod" (THAI_STYLE "คำจากใบตรวจ").
**Answered 08/10 (owner, chat, รอพี่ตรวจ 20–25):** M Bar 15K name stays in the Kit/Pod head copy (20) · home desktop intro Scene 4 =
M Switch Kit (21) · WOTOFO nexBAR 18K flavours whose only maker photo is the Vivid Edition (a different body) stay WITHOUT a photo —
never use a Vivid render for them (22) · MURO 3ML boxes at 340×490 = fine for all 8 small boxes (24 + 25, IMAGE_SPEC exception).
**Answered 12/10 (owner, chat, round 3g):** backup domain = okami-24.com (not .net; canonical stays okami24.store, no 301 between them) ·
okami-pod.com (old site) = ignore, never touch or propose ("ไม่ต้องสนใจ ทิ้งได้เลย") · GitHub Actions budget $15/month, stop at the limit;
batch docs edits into one PR per batch · DNS guide health/quit-smoking writing = neutral, foreign official sources (SEO ฉ file).
**Answered 14–15/10 (owner, chat) — only what has no other home** (the rest lives in TEAM_RULES 13.3 · 13.5 · 13.7 · 13.8 ·
THAI_STYLE §5 · IMAGE_SPEC §5 · skills house-clean / okami24-handoff · central §12 item 29): image provenance in src data /
`process-images.map.json` stays pointing at `_incoming/` — do not re-point it at the archive to free disk ("ยังไม่ทำตามที่แนะนำ") ·
scheduled-task prompt `okami24-stock-sync` = keep · central item 13 vs 15 = left as is (the web exception covers it).
**Lifted 15/10 from the old HANDOFFs (rule-audit row 20 — owner rulings that lived only in `git show aa21cbb:docs/HANDOFF.md` §3 and
older §16 copies; image ones went to IMAGE_SPEC §4):**
Shop: an empty category leaves the 4 nav surfaces and the sitemap, its page is noindex, the URL keeps working and it comes back by
itself; copy "ยังไม่มีสินค้าในหมวดนี้" + "กลับมาดูใหม่เมื่อมีสินค้าเพิ่ม" (22/09 "เคาะทางตัน") · desktop card price = variant B (price on its
own line under the tagline) · Argus Multi-Ohm Cartridges (3 pcs) = an Argus accessory in the VOOPOO category · WOTOFO stays on /about
with its brand and footer link; its brand page = Friday decides, never an empty page for customers · BLUEBERRY ICE (printed on the
device) and Blueberry (maker's list) — both kept (30/09 "ตามนั้นเลย").
Search: many alias spellings per brand are fine, one direction only, never rendered; every brand on sale needs a Thai alias ·
"น้ำยา" keeps returning its 3 prefilled items (m-switch-pod · muro-3ml · coil-74) while e-liquid stock is 0.
Head copy, clips: "(Marbo)" stays in the 4 M Bar titles · one clip per article (round SEO ข) · en/zh caption under a clip whose Thai
title is hidden = "Hands-on review (in Thai)" / "真机试用（泰语讲解）" · VideoObject `uploadDate` carries the zone
(`YYYY-MM-DDT00:00:00+07:00`, owner from GSC 26/09) · @PODSYSTEM-OKAMI-II is the owner's second YouTube channel (researchers may cite it).
Copy: "แท้" only ever as a sweep of all brand ledes, never one brand · brand ledes say "ที่ร้านมี", not "ที่ร้านตอนนี้มี" · gallery
lede th/en/zh = credit only ("ภาพจริงจาก {brand}") — the owner cut "ใช้เป็นภาพประกอบเท่านั้น…" ("เรากำลังทำเพื่อการค้า").
Central rules repo: adding a project = edit key A, never re-make it.
**Best sellers (owner 26/10, "ยึดจากแหล่งตลาด ใช้การคาดเดาได้ — เฉพาะเรื่องนี้"):** the shop's best-seller picks (SHOP_PICKS) may rank by
Thai market signals with an estimate, sources + "estimate" in the code comment — the only task where the researcher may guess.

**Homepage (owner 20–21/10, round hero-2010):** hero = the dark ribbons stage, light lines in the shop orange leaning a little to the logo red — never green ("เอาแค่ความลื่นและมิติ") · the four hero slots = strong BRANDS ("ทาง 1"): UWELL Caliburn G5 · VOOPOO ARGUS G4 (not P3: square body) · SALTHUB M Switch · IQOS ILUMA i ONE (Friday's pick); tabs name the brand · desktop products LIE across the stage using the product's OWN card photo rotated (AI re-renders rejected: "บิดๆ เบี้ยวๆ"), calm drift over a warm floor shadow; phones keep the standing card photo · desktop hero (owner 21/10, round homepage upgrade, Artefakt direction) = the 4 slots as CARDS, "การ์ด 4 ชิ้นโอเค" — staggered overlapping layers (#679) + on hover the card lifts and the others blur (#683; a level row and a spread deck were tried and dropped 21/10); the lattice-of-squares background is rejected ("ฉากหลังตาราง … ไม่เอา") · the scroll flow light below the hero = code kept, switched OFF (`HOME_FLOW = false` in `src/data/home-hero.ts`, #672 — "เก็บเข้าคลังไว้ไม่เปิดใช้") · wide rails bleeding right = rejected (#658) · no "ขายดี" / bestseller wording anywhere on the homepage (no sales figures).

**Samurai theme on /products (owner 29/10, chat):** the character runs from the page top and fades long and slow — behind the
first card row, gone by the second ("ลึกและยาวมากกว่านี้ … หลังการ์ดสินค้าซัก 1-2 แถว") · strength 12–15% (0.25 = "ชัดไป") · no grey header
panel on /products (designer pick, owner asked) · the card cut = small/short/sharp/luxurious, red or theme orange — still being developed (owner: "ยังไม่ค่อยโอเค").
**Answered 29/10 (owner, chat):** capacity stays as the site has it — M Bar 9K shows none (Javis's "14 ml" not added), TFIT M Power 20K 18 ml ·
Muro Connector 20K (pods, Javis's photos) OK · SUP ZERO 22K price = the price printed on its new image · daily price check 15:00, Sonnet 5.5 medium ·
option photos where all flavours share one body = device + that flavour's box/pouch if we have one (cheapest), else + its fruit.
**Higgsfield credits 29/10 (owner, chat "Yes, use them"):** approved for one batch only — RELX Pod Pro 2 11 flavours + Menthol Freeze + TPP-DM4 coil box (~13 images, ~2 credits each, cap ~40) · existing credits only, never buy · more = ask again ·
Zero Pro Copper / Champagne = slot stays without a photo until a real one exists.
**Owner 29/10 evening (chat):** Zero Menthol Freeze -v2 photo PASSED · TPP-DM4 (coil-38) REJECTED (cut edges not clean, options jump
when switched — sizes differ) → images chat 4 · Higgsfield credits APPROVED for the whole remaining batch (58 images ≈ 116 credits, cap
130, existing credits only, never buy) + RELX Pod Pro 2 missing flavours = search with Claude in Chrome · same-day cut-off = 12:30 (BSOT §10)
· carriers = EMS + DHL only (BSOT §10) · a cancelled order whose slip was never confirmed promises no refund; only out-of-stock does ·
price-check routine result seen by the owner · cookies / customer data / free-shipping tiers / admin Gmail / tracking = Friday plans with the owner.
