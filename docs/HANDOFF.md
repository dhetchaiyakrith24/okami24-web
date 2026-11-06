# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> §1–§15 (history up to 2026-09-22) were removed at the housekeeping round 01/10: `git show aa21cbb:docs/HANDOFF.md`. Numbers 16–18 stay so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every "done / works / number" statement = central §12 item 9.

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1
Updated 06/11 ~23:00 by the house-round chat. Re-read this + TEAM_RULES.
CART IS ON since 06/11 ~22:00 (owner "เปิดตะกร้าเลย"; Render OKAMI24_ORDERING = on, deploy dep-dbmud7jrjlhs73cglpf0). The delay notice (#1248) shows until Mon 9/11 and ends by itself (src/lib/commerce/shipping-delay.ts): remove it after that, its head lists the files.
Open with the warehouse: ฿35 answer (2g), customers pay the same, the shop may be billed ฿50.
MERGE ORDER = one PR at a time: main has moved = merge main in, verify --full (3 min when cached), gate, checker, ready, merge. verify refuses while 3412 is up.
MERGES IN THIS CHAT: the app's Auto check refused `gh pr merge` as [Production Deploy] twice (04/11 22:00 and 22:50) until the owner's word in chat named the work. Never route it through a child or another tool; tell the owner. Children do not merge; the main chat does.

1 main = see git log (06/11: #1237–#1250). Customer walk fixes, pack specs, 2 articles, delay notice and carrier by number are live.
  #1227 ฿35 line: not proven how Shipnity treats fee_lines, read the first real ฿50 order.
  TRACKING: owner's word 06/11: the 18 orders (#0057 #0063 #0067–#0082) moved to shipped with no number 19:06, phone removed from OK-20261029-6712e6 and OK-20261031-820aa2. #1247: S10 ..TH = Thailand Post, 10+ digits = DHL whichever way the order went out, other shapes wait for staff; a real number joins a shipped order with none. Not proven: that Shipnity writes again when the warehouse edits a number; watch the first one. Customer page wording for shipped with no number never seen in a browser (needs a customer's token link, owner list). #0062 keeps its staff number.
2 OPEN WORK, in merge order:
  e Round disposable 05/11 = `docs/rounds/รอบพอตใช้แล้วทิ้ง-05-11.md`: blocks 1–3 live (#1237). Left: request indexing for /products/disposables + changed pages, block 4 reads 09/11 · 15/11 · 10/12, then close with tag disposable-0511.
    Unknown: the 2 results Google removed on "disposable pod" (Lumen sits behind a bot check; not passed).
  g WAREHOUSE BILL 22–31/10 reconciled (`_incoming/sales-0411/`, local): web orders = the "(ว่าง)" rows, 19 orders, 34 pcs, ฿8,285, every one matches ours on quantity and rate + shipping.
    Round 28/10 20:34 → 31/10 13:00 (owner's range A): customers paid ฿11,539, bill ฿8,285, profit ฿3,254. #0036 is NOT billed (its 3 codes are absent; likely the old test order). 9 cancelled orders were never sent.
    Shipping: the warehouse billed ฿50 on 14 orders, ฿35 on 5; owner says ฿35 always → ฿210 over. Cause (code read): order-json.ts sends FLAT_SHIPPING_FEE_THB as shipping_total, with a matching discount on free-shipping orders; the bill column reads it.
    Owner told the warehouse 04/11: asked for ฿35 flat, ฿210 kept as CREDIT (check it on the next bill), web now sends 35 (true once #1227 is live), no web orders until things are normal. Waiting on the warehouse's two answers.
    Rates 22–31/10 vs ours: 38 products, all match after the cost file `ต้นทุนสินค้า/ต้นทุนสินค้า-OKami24-2026-11-04.xlsx` (outside git; TFIT 240, RELX Infinity Pro 2 Pod 100, dude 85). No loss-makers; under 10%: Reswa Sportcan 12K (live at ฿229, own re-shoots; the legacy page stays hidden). 29 products have no rate; 4 with stock are asked in รอพี่ตรวจ.
  h ORDER CHECK PLAN (owner agreed 04/11; nothing built): 1 round Excel Saturday 13:00 → Saturday 13:00 (warehouse order no, code, qty, rate, ship 35), proved against a bill · 2 cost table into the back office ·
    3 daily sales page · 4 paste the warehouse file, list what differs · 5 LINE orders · 6 scheduled run Saturday after 13:00 + morning summary. Owner answers: only the owner sees cost and profit · LINE = daily sales from slips, cost/profit weekly from the bill ·
    accounts on the web back office, no separate app (Google/LINE sign-in + roles: owner all · admin orders, no profit · Friday read-only). Login work = 13.3 #9, write the plan for the owner first. Admin's proof file holds rates: settle what admin may see.
    Warehouse bill columns: "(ว่าง)" = web · "Okami" = LINE keyed by admin (217 orders ฿126,010; 16 of them not ฿35 shipping, unread) · H = rate + shipping.
  SEO findings: Google hid us on general terms since 27/10
    (Google's side; new site + almost no backlinks) · next read 09/11 · articles all pass · YouTube 45 pages + clips 8–13 wait on the owner in Studio.
  Deferred by Friday: stock light's red rule cannot be tuned (woo_stock_reports keeps only the latest time per code) → small push-time log on the data disk, then a week of data ·
    zh spec-row labels show English (older, not checked) · owner's call: fade the backdrop's moon (1440) and lines (390) = 2 CSS numbers.
3o OPEN ROUND house 06/11 = `docs/rounds/รอบเก็บบ้าน-06-11.md`, skill house-clean (ข). Worktree of tools = PR house-0611r; status + slim PRs follow; evidence `_incoming/house-20261106/` (rule-audit.md = 60 rows).
  Queue 02/11 closed 06/11, tag queue-0211 (files: `git show queue-0211:docs/rounds/รอบคิวงานพี่-02-11.md`).
    Owner answers 04/11: phone-lookup hole (86) = "เอาไว้ก่อน" (parked; research in this chat: LINE/Google give no phone number; free
    route = no prefill for guests + saved data only when signed in + bind phone via the order link; SMS OTP ฿0.3–1/msg) · LINE orders use
    the web price (trust line stays, §18) · RELX Essential 2 / Infinity Pro 2 cards keep the spec row (Friday's call, owner "ตามมืออาชีพ").
    PARKED / LATER: LINE Webhook redelivery (owner "เอาไว้ก่อน" 03/11) · unwatermarked originals under public/assets → cleanup after gen 3 ·
      THAI_STYLE group ก หนามแท่ง/โนนหนามแท่ง · coil-56 / coil-83 retailer facts → details pass ·
      ZERO PRO "Copper/Champagne" + INFY "Frost Pink" names not on the makers' sites
      · MURO Space 15K stays hidden (retailer pictures).
    Owner to answer = docs/รอพี่ตรวจ.md.
  b DESIGN REFERENCES from the owner 30/10 (Instagram reels, open in the owner's Chrome, never like/follow): back office + member sign-up page designs https://www.instagram.com/reel/De9XFBQTG0D/ and
     https://www.instagram.com/reel/De6ef-Svrlj/ · "Zoom" motion for the home + product pages https://www.instagram.com/reel/DfAqpTsOHYn/ → skill okami24-plan + designer.
     STAFF LOGIN PLAN (owner 30/10): staff sign in like members → a "ขอสิทธิ์ทีมงาน" list on /staff → owner approves → staff dashboard
     (role on the member row; BSOT §11). Login = 13.3 #9 → plan with the owner first. The #1046 pill stays till then.
     FUTURE ROUND (owner 30/10): desktop thank-you page to use the wide space better — queued.
  d Staff to-do: OK-20261028-ccd46d empty tracking note → staff fill it.
     ROUTINE "new models research" = draft `_incoming/new-models/routine-okami24-new-models-research.md`, not created.
  e RENDER ignores `docs/**` + `.claude/**` (owner set 30/10) — a docs PR must be ONE clean commit from latest main.
  f back-office queue: customer cards (Gmail data + perks; owner asked twice) · EMS/DHL tracking page + motion · staff-by-Gmail NOT built
     (BSOT §11 keeps no email) · LINE orders on web (later) · off-site backup (77) · THAI_STYLE row "PAYMENT CARD" at next round close.
3 OWNER ASKED 04/11 (later, plan first): a back-office button showing web orders per day, sales, profit · owner-pressable switches: cart, API, close the site temporarily ·
  back office the owner runs himself (hide products etc.) · daily income / sales / profit from the slip room covering LINE + web (slip amount − cost − ฿35 warehouse shipping per order).
  OWNER QUEUE — owner's order 27/10: logo → cart fit → staff pages → LINE sign-in logo → best sellers; then the rest.
  a Owner's logo files = untracked `logo/` folder, never delete · left: owner sends the "โฉมใหม่" broadcast.
  g SALES LOG (owner 30/10, owner-only view) · Q9 staff dashboard [PLAN WITH THE OWNER FIRST] — unchanged, see git show 37a1b052:docs/HANDOFF.md §16 3g.
  h shop accounts audit = separate project, PARKED.
  Test orders (OK-20261023-e25378…) → cancel on /staff "ทดสอบ" when the owner is done.
  Known, not fixed: rate limit trusts X-Forwarded-For off Cloudflare · partial refund = no 2nd out-of-stock issue · history keeps the
     refund ref not the amount · no DB tests · cart Back from review loops · typed note lost if placing fails · add form needs JS (double
     tap adds twice) · cleanBankText keeps invisible chars · BSOT §9 #804 line quotes the owner 24/10 — confirm.
  Warehouse: Pod-156's 14th option is coded "Pod-147" in Max (decoder skips it) · EasySlip quota 497/1000 (23/10) — warn before it runs out.
3c Cart (round closed 26/10, tag `cart-reopen-2210`): off-site DB backup needs an R2/B2 account = the owner signs up (รอพี่ตรวจ 77).
3w Home switches `src/data/home-hero.ts`: DESKTOP_HERO · DESKTOP_BG · DESKTOP_CARD_LAYOUT · DESKTOP_TRAVEL · PHONE_HERO.
3u STOCK — Shipnity pushes stock to /wp-json (woo_stock_reports); the site reads it at runtime (live stock, 28/10). Still build-time: JSON-LD and the struck price / −N% (cards went live 04/11, #1202). Plan + state = `docs/cloud-results/stock-api-sku-survey.md`
  "Shipnity link". 【ห้ามแตะ】 coil-1/72/94 photos · every price file. New-products run (15:00) needs the PC on.
  Open: `legacy-price-approvals.ts` still names Pod-181 for caliburn-g4-pro · at 390 the small pill sits on the IQOS ILUMA i cap (iqosheet-18).
3i / 3s / 3p PARKED rounds (image sweep · SEO all keys · p63) = unchanged, see `git show 464b7f64:docs/HANDOFF.md` §16 3i/3s/3p.
4 waiting on owner: ONE list = `docs/รอพี่ตรวจ.md`. Status page for the owner's phone = §17 "Owner status page".
5 open / dated:
  - stock light's red rule: needs the push-time log first, then a week of data with the cart open (not dated until then; owner's status page says so).
  - DHL: watch the first DHL order after #1195 — does Shipnity show the packer note? Remove the note once Shipnity reads the carrier.
  - Daily indexing runs by itself 16:00 (task okami24-google-read-daily, needs the PC + Chrome on).
  - OWNER'S ORDER 06/11 ~20:00, after the notice: 1 house round (`_incoming/house-20261106/todo-next.md`; done so far = worktrees 106→34, 155+2 branches, 154 folders archived) · 2 the big jobs: order check + sales + profit + weekly summary (2h) · SEO state and what to improve · pictures: all there, new ones, flaw fixes · back office switches (item 3) · 3 one list of the small items the owner dropped in mid-work and asked Friday to note: show it to the owner.
  - Watermark: new pictures = gen 4 (no helmet). The 1,003 live gen-3 pictures keep the helmet until the owner says go back ("เดี๋ยวค่อยกลับไปตามแก้").
  - Map `source` lines of 14 Pop Up flavours name the old input (process-images map).
  - 09/11 SERP + rank read incl. disposable terms · 16/11 · 30/11 (SEO_BASELINE) · GSC read 15/11 · 10/12 · then close round SEO 02/11 with tag seo-rank-0211 · Search Console 2–4 weeks after 12/10.
  - OWNER-REQUEST AUDIT 06/11 (report `_incoming/house-20261106/owner-audit-0611.md`). Closed 06/11: picture source audit (1,358 files shown on 182 pages: 1,029 marked, all OKami24 renders by their records, 105 of them traced by folder sample only; 329 unmarked = maker art; no shop picture shown as it is, IMAGE_SPEC 'รูปร้านอื่น') · unmarked orphans · SUP ZERO guide copy.
    Brand completeness closed: ESKO, JOIWAY F3 + F4, TFIT 10 flavours, INFY POD match the maker. No official list exists to check: INFY PLUS 2.5ML, INFY 20K. IQOS read from foreign pages only (no Thai page, 404): Leaf Green vs Spring Green on ILUMA i ONE unproven. JOIWAY lists F4 PLUS (16 pairs), not in our catalog and not in the warehouse list.
    Box photos searched 06/11 in Chrome: Muro Salt 28mg + Freebase 4mg found. Nothing usable for Muro 3ML, Graple, RELX Creator Pod 20K, Nexswitch 16K. Only dealer posters (not pack, not used): Super Cool 30ml nic35, Marbo Freebase 30ml 6mg. RELX Smash Go page still says 20ml in the table and 18ml in the text, row stays out. salthub.com names no Zero Nano colours.
    Left: 5% flavour names on LUMI and SUP ZERO while the nicotine row says 3% (no 5% pouch seen) · 27 product pages without an article (list: articles not in PRODUCT_ARTICLES vs sitemap; most have warehouse facts only).
  - Speed (LESSONS 37): NEXT = PRODUCT_COPY_TH via ProductCard (taglineTh prop) · then framer-motion on home (designer first).
  - The owner's small asks and ideas = one list, `docs/รอพี่ตรวจ.md` "งานเล็กที่พี่ฝากไว้".
  - Data, copy, cleanup and page notes for each page's next touch = `git show 464b7f64:docs/HANDOFF.md` §16 item 5.
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
Site copy (every round): every new sentence = 3 languages (new articles = Thai first, `thaiOnly: true`) · Friday picks
  reversibly = TEAM_RULES 13.3 last paragraph + 13.8 · every
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
  gsc-unread.ts (pages Google has not read since they changed; skill seo-after-publish) ·
  pre-checker-gate.js (13.4 — before every checker · `--done` after its report · the note expires after 3 h: a longer checker = run the gate again · `--self-test` = every lock on a planted example, house-check runs it weekly) ·
  house-check.js (housekeeping measure: sizes · locks · rules followed · leftovers) · stale-work.js (stuck/due work — agent follow-up, session-sync, daily 13:00 task) · lab/js-weight.js (first-paint JS per page) ·
  poster-stretch.js (story poster/cover/anatomy file width vs drawn width, LESSONS-images พ17)
src files the skills use (the one list — skills may not name a file under src/, 13.2; fix a renamed file here):
  [i18n-test] `npx tsx src/i18n/i18n-contract-test.ts` · [catalog-method] `src/data/shipnity-seed/README.md` section
  "Catalog reconciliation methodology" · [legacy-products] `src/data/products/*.ts` · [taxonomy]
  `src/data/shipnity-seed/active-catalog-to-product-master.ts` (`TAXONOMY_MATCHES`) · [spec-gate]
  `src/lib/verified-specs.ts` + `src/lib/verified-specs-contract-test.ts` · [approvals]
  `src/data/shipnity-seed/publication-approvals.ts` · [active-catalog] `src/data/shipnity-seed/active-catalog-source.ts` · [sku-map] `src/data/stock/sku-map.ts` · [warehouse-new] `src/data/stock/warehouse-new.ts`
Verify: which set = 13.5 · the full list with commands = skill `round-close` step 3 · pass = what each script prints ·
  the last full-set counts = the latest round-close log
Git: commit message English, prefix feat/fix/copy/data/docs/chore/agents/rules · Thai text via `git commit -F <file>` ·
  push/merge/deploy = 13.7 · main's branch protection requires `copy` + `checks` (admins enforced, no force push; owner 14/10
  item 55 — a skipped `checks` on a docs-only PR counts as passed) · tag = skill `round-close` step 5 · a check that never starts (job with 0 steps) = read the
  check-run annotations first (`gh api …/check-runs/<id>/annotations`) — 12/10 it was the Actions quota
Agents: when to call each = TEAM_RULES 13.2 (+ the `description` line of its file in `.claude/agents/`) · never one call per sub-item ·
  an agent added or edited is usable at once in the running chat
Stock: the hourly routine ended (owner 06/11, live stock replaced it). `scripts/order-entry-stock.js` + `scripts/stock-sync.js` stay for a manual read; how = their heads.
Render after a merge: ~1 min of 502 + ~2 min after the deploy job ends — wait, then curl. Higgsfield MCP: `generate_image`
  is ALLOWED (owner 20/10, #661); every other credit-spending Higgsfield tool stays DENIED in `.claude/settings.json` · credits =
  IMAGE_SPEC §0 item 7.
Work folders: round work = `_incoming/<round>/` (not in git) · what Friday may move or delete alone = skill house-clean
  "รายการเดียว" (its one home) · image provenance keeps pointing at `_incoming/` (§18).
Higgsfield (web app in the owner's Chrome): the draft box is SHARED across tabs and chats — open a new tab, set refs + prompt
  and click Generate in one go · the free "365 Unlimited" route is CLOSED (read 05/11: switch off, it opens a paid $12/$23 offer, MCP says unlim unavailable; nothing bought), so every picture costs credits (owner's yes first) · refs = the Chrome extension's
  file_upload on the uploads panel's hidden input (the app's built-in browser pane has no upload tool: 3 KB base64 chunks +
  sha256 check — slow) · results via MCP `show_generations` (read-only) · prompt box = Lexical editor (LESSONS-images 29)
Live site: ALWAYS after a merge check the deploy reached success (`gh api
  repos/dhetchaiyakrith24/okami24-web/deployments?sha=<merge sha>` → statuses) — #776+#779 builds FAILED on Render's 60 s per-page
  limit while local verify passed (#781) · every deploy = the short 502 window above + LINE webhook events in that window are lost → group merges ·
  Render builds every merge (Auto-Deploy "On Commit"; Blueprint "Sync paused" → Render settings change in the dashboard only) · spend
  limit $10/month (owner 23/10) · env change = Render → Environment → Edit → "Save, rebuild, and deploy" (prerendered pages need the
  rebuild); unrevealed secret rows show EMPTY inputs in the DOM — saving keeps them; edit only the one row (focus it by its key, type,
  check the value by script); Chrome screenshots of that page time out · cart off = OKAMI24_ORDERING=off the same way.
  LINE bot: webhook https://okami24.store/api/line/webhook; groups bound on /staff: "OKM Webside order" = order alerts · "OKM Slip
  check" = slip check · a join event lost during a deploy = remove the bot from the group and invite again (DEPLOY-RENDER §8) · LINE OA
  "OKM ORDER" @691qxpxp (free 300 msgs/month; a group push counts per member) · staff
  guide = docs/คู่มือแอดมิน-ออเดอร์เว็บ.md · order numbers use the UTC date (noted, not changed).
Test trees + PR flow: reuse `_incoming/wt-golive` · `_incoming/wt-cart` (real node_modules incl. jsqr). A FRESH worktree fails verify --full typecheck once (LayoutProps) → run twice ·
  junctioned node_modules break Turbopack builds · gate `full` needs a verify stamp of the EXACT head → merge origin/main + all extra
  commits BEFORE the verify run (~20 min each) · flow: draft → verify --full on the head in a test tree → gate → checker → `gh pr ready`
  once → checks → `self-merge-check --pr` alone, IN the PR's tree → merge --match-head-commit → deploy success. A deploy skipped while draft = `gh pr ready --undo`, then `gh pr ready`.
  Start a build: `OKAMI24_DATA_DIR=<copy of a test DB> SITE_URL=https://okami24.store npx next start -p <port>` (SITE_URL=localhost is
  refused) + OKAMI24_ORDERING=on at BUILD time for cart pages · order-page states `_incoming/stock-oe/` (data-b DB · seed-b.js ·
  shoot-b.sh) · cart flow `_incoming/cartux-a/` · staff pages locally: OKAMI24_STAFF_PASSWORD=<test value in
  `_incoming/stock-oe/.staff-test-pass`> (local only) · stop only your own servers by port (Get-NetTCPConnection → Stop-Process) ·
  server-action forms in the Browser pane: React resets uncontrolled inputs after every action (LESSONS พ45).
Owner status page (TEAM_RULES 13.6): https://claude.ai/artifact/WW3HFHFntievMThnvNtn1K ("OKami24 งานวันนี้", Thai, phone-first) ·
  update = Artifact tool `action: read` with that `url` (gives the saved page file) → edit the sections (รอพี่ตอบ · รอพี่ทำเองหรือเลือก ·
  กำลังทำ · คิวถัดไป · เสร็จและขึ้นเว็บแล้ว · ยังไม่ได้เคาะหน้าตา · ค้างนาน = the only section the daily 13:00 task writes) + the date line → publish with the same `url` · pictures = the page's
  asset store (needs the `assets` capability — skill `artifact-capabilities` first) · its waiting sections = `docs/รอพี่ตรวจ.md` + questions open in the chat (the page never holds a decision the files lack).
Scheduled tasks: unattended = mode Auto in the app (edit the task → mode) · read-only commands allowed in `.claude/settings.json` · one command per Bash call, no `cd … &&`, or it waits for a click all night · a new task: "Run now" once while the owner
  is there and "Always allow" each prompt, or skill `fewer-permission-prompts`
```

## 18. Permanent owner rulings — settled, never re-ask (central §12 item 17)

Business facts live in `docs/BUSINESS_SOURCE_OF_TRUTH.md`, Thai words in `docs/THAI_STYLE.md`, images in
`docs/IMAGE_SPEC.md`, SEO in `docs/SEO_LANDSCAPE.md`; this list holds the rulings that have no other home. A ruling that is replaced = overwrite its line.

**Main chat moves by compact, not hand-off (owner 02/11, quoted exactly):** "แชทหลักนี้ Friday ไม่ต้อง Hand ใช้ Compact ได้เลยที่ 80-90 % ก่อน Compact
จะสถานะงาน ความคืบหน้าสิ่งทมี่ต้องทำต่อกับแชทลูกให้เรียบร้อย ส่วนแชทลูก Hand ได้" — the rule = TEAM_RULES 13.6 "แชทหลักไม่ย้ายแชท".

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

**Slip-check bot after a deploy (owner 03/11, "ตามแนะนำ" + "เรื่องบอทส่งซ้ำเอาไว้ก่อน"):** the bot answers by reply only — no push
fallback (push = LINE quota) · LINE "Webhook redelivery" stays OFF for now (parked by the owner; the `webhookEventId` dedupe
guard it needs is on main since #1170, dormant).

**onrender.com stays open (owner 26/10):** the service's `*.onrender.com` address is the back door "ในกรณีที่หน้าเว็บหลักเข้าไม่ได้" —
never disable it.

**Owner's personal contact — NEVER (owner 26/10 "งานเว็บทั้งหมดต้องไม่มีส่วนไหนชี้มาหาส่วนตัวพี่ครับ ห้ามเด็ดขาด"):** nothing in
the web work may point to the owner personally — every contact / support / developer email on the site and on every outside
service set up for it (Google Cloud consent screen, LINE channels, Render, …) = **okamisalt@gmail.com**. The bank account
holder name on the order page (BSOT §9) is the receiving account itself, not a contact pointer — raised with the owner 26/10.

**Pods = INTERNATIONAL version (owner 26/10 "แบบสากลครับ", answers รอพี่ตรวจ 58):** Caliburn (UWELL) + VOOPOO pages state the international version only — pod/tank capacity (3 mL / 3.5 mL / 4.5 mL / 5 mL), dimensions, weight and in-box pods; no "(2 mL in the TPD version)", no INT/FDA/TPD/CRC splits. The maker compatibility lists ("also fits … CRC versions") stay as the maker wrote them.

**Which category a pod goes in (owner 02/11):** "Pods & Cartridges" = replacement pods / cartridges of a refillable pod system (e.g. VOOPOO VMATE cartridge). The pre-filled pods of a switch-pod system (M Switch pod 15K · Muro Connector 20K · KS Quik Pro 15K cartridge · Pop Up 10K · ESKO BAR Switch 20K pod · RELX Connector pod 20K · nexBar Switch 15K · nexSwitch 16K pod — and every later one) go in **Switch Pods**, together with the switch-pod devices.

**One "เทียบแท้" (lookalike) product — Marbo 10K (owner 27/10, through the main chat):** Max Disposable-47 "Marbo 10k โคลน" is an
imitation of SALTHUB's M Bar 10K. Owner: "มันเป็นของก็อบอะอยากให้ลงด้วยนะแต่กำกับว่า *เทียบแท้* และราคาตามนั้นเลย", then
"(แนะนำ) ลงได้ ชื่อสินค้า “Marbo 10K (เทียบแท้)” ราคา ฿299". Rules for that page only: name "Marbo 10K (เทียบแท้)", price = Max
ราคาขาย (฿299), all its flavours · a clear line that it is a เทียบแท้ item, not a SALTHUB product · no "ของแท้" / genuine wording on the
page, title, meta or JSON-LD · the /warranty authenticity refund does not cover it · never in cart suggestions or shop picks · never
linked to or from the genuine M Bar 10K page. The only exception to BSOT "Genuine products"; any other lookalike = ask the owner.
Photos (owner 27/10, the warehouse confirmed the item is identical): "ใช้รูป M Bar 10K ที่เว็บมีอยู่ได้เลย เพราะของเหมือนกันเป๊ะ" — the
page shows the site's M Bar 10K card and the device photo of each SAME-named flavour; a flavour whose name differs gets no photo.
**Shop and ordering:** cart on or off = §16 · refunds go to a PromptPay number OR a bank account + the bank's name, no branch needed (owner 24/10 evening, BSOT §9) · stock without a rebuild = live since 28/10 (§16 3u) · checkout = phone only, no OTP · LINE orders are charged the same price as the web (owner 04/11 "ใช่ ราคาเดียวกัน (คงไว้)" — the trust line "ทุกออเดอร์คิดตามราคาขายที่แสดงบนเว็บ" stays)
(owner 23/10) · a customer finds their orders by PHONE NUMBER ONLY (owner 24/10 "เบอร์โทรครับ" — name/address masked) · the 4
service pages (`/warranty /shipping /how-to-order /privacy`) are touched only when the owner asks or a BSOT fact they state changes (owner 26/10, house round) and carry no JSON-LD on purpose (item 49) ·
**Shipping fees = BSOT §10 (live 30/10).** A new promo's start date = the owner types it; Friday never starts one alone (owner 27/10, answer 80) · copy stating the real policy may say "ส่งฟรี" (THAI_STYLE §3, owner's OK = the house round 26/10) ·
green "shipped" glow = the style for key-moment effects site-wide ("ยืนบนความเรียบหรู", owner 23–24/10) · IQOS colour names = Friday decides ·
caliburn-g4-pro = Pod-168 (Max's code, owner 08/10 — the old Pod-181 belongs to the retired system) · muro-3ml = ฿150 (admin list, "Selling prices" below) · the 20 owner-estimate rows in
`legacy-price-approvals.ts` change when an admin reports that price ("Selling prices").

**Head copy and SEO:** moved 06/11 to `docs/SEO_LANDSCAPE.md` "คำตัดสิน head copy และ SEO".

**Sources named in articles (owner 13/10, chat):** no Thai agency or Thai source is named or linked as a source on the
site ("ไม่อยากให้อ้างอิงหน่วยงานไทย เพราะข้อมูลมันเอียงน้ำหนักเพื่อผลประโยชน์ของประเทศไทยเอง") — name international or
foreign bodies (IATA, NHS, WHO …); a rule only a Thai source states may be written as a plain rule, its source kept in the
code comment / evidence file · health / quitting copy = both sides kept, the cautious side trimmed to each agency's core
position ("ไม่ใช่เชิงชวนซื้อขาย แต่ก็ไม่ตัดทิ้งจนลูกค้าหันหน้าหนี") · the owner is never named in his own quit story.

**Text length per product page · SEO on every product article:** moved 06/11 to `docs/SEO_LANDSCAPE.md` §7.3, under "มาตรฐานบทความของร้าน".

**Stock (owner 08/10):** stock truth = Shipnity Max only (`app.shipnitymax.com`) — the WAREHOUSE's account, not the shop's (we
only read it, to open the cart later) · the old Shipnity (`shipnity.com`, source of the September seed and of the Pod-181 re-code)
is retired: "ตัวเก่าเขาไม่ได้ใช้แล้ว" — never take a code, stock or price from it · an option or product with no SKU there = "สินค้าหมด", page and option stay (SEO; customers pick another
model), even when that is over half the catalog · Shipnity spellings that differ are matched in `src/data/stock/sku-map.ts`,
never fixed in Shipnity. · **Cart cap (owner 28/10 "Cap it"):**
a cart line never holds more than Shipnity's live count for that option (20 when there is no number) — never cut an order
silently: a line above the count blocks checkout until the customer lowers it.

**Low-stock label (owner 26/10, chat — answer to รอพี่ตรวจ 78):** the word is **"ใกล้หมด · เหลือ N ชิ้น"**, shown at ≤ 3 left
(Friday's threshold, the owner picked the word with it). Live since 31/10 (#1063): ≤ 3 "ใกล้หมด" · 4–20 "เหลือ N ชิ้น" · > 20 "มากกว่า 20 ชิ้น",
under the picked option, live /api/stock.

**Product badges (owner 30/10 · live #1063 #1069):** "ขายดี" = one badge (= ยอดนิยม) from the BSOT §15 lists + every Muro except muro-space-15k ·
"มาใหม่" = 7–14 days after listing, capped at 25% of a grid (Friday's reading) · later the best-seller list comes from real order counts (BEST_SELLER_SOURCE).
02/11 (owner): BOTH badges show together [มาใหม่][ขายดี] · "มาใหม่" = purple "Night" capsule (designer option A; purple means new only) · the
best-seller card light runs 3 times and stops ("วิ่ง 3 ตามแนะนำ") · best-seller capsule B kept as is.
Sold out in every option (owner 31/10, live #1078): "ขายดี" still shows ("พี่หมายถึงป้ายสินค้าขายดีนะ แม้ของหมดก็ขึ้นเลย") · "มาใหม่" does not ("ไม่ขึ้น").

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

**Product facts (data rounds 24–25/09, 30/09):** a per-row source link is required for rows touched in a round + rows of
the 7 products the live 10B guides link to; older verified rows are grandfathered · every unverified number is hidden
from render · when a fact is missing, state the fact or say nothing — never explain the absence · product facts come
from the manufacturer only, everywhere on the site — the one list of named exceptions = THAI_STYLE §5 "ขยายเป็นทุกที่บนเว็บ".

**Images · Review sheet + image work:** moved 06/11 to `docs/IMAGE_SPEC.md` §4 "คำตัดสินจาก HANDOFF §18".

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
**Answered 08/10 (owner, chat, รอพี่ตรวจ 20–25):** M Bar 15K name stays in the Kit/Pod head copy (20) · home desktop intro Scene 4 =
M Switch Kit (21) · WOTOFO nexBAR 18K flavours whose only maker photo is the Vivid Edition (a different body) stay WITHOUT a photo —
never use a Vivid render for them (22) · MURO 3ML boxes at 340×490 = fine for all 8 small boxes (24 + 25, IMAGE_SPEC exception).
**Answered 12/10 (owner, chat, round 3g):** backup domain = okami-24.com (not .net; canonical stays okami24.store, no 301 between them) ·
okami-pod.com (old site) = ignore, never touch or propose ("ไม่ต้องสนใจ ทิ้งได้เลย") · GitHub Actions budget $15/month, stop at the limit;
batch docs edits into one PR per batch · DNS guide health/quit-smoking writing = neutral, foreign official sources (SEO ฉ file).
**Answered 14–15/10 (owner, chat) — only what has no other home** (the rest lives in TEAM_RULES 13.3 · 13.5 · 13.7 · 13.8 ·
THAI_STYLE §5 · IMAGE_SPEC §5 · skills house-clean / okami24-handoff · central §12 item 29): image provenance in src data /
`process-images.map.json` stays pointing at `_incoming/` — do not re-point it at the archive to free disk ("ยังไม่ทำตามที่แนะนำ") ·
central item 13 vs 15 = left as is (the web exception covers it).
**Lifted 15/10 from the old HANDOFFs (rule-audit row 20 — owner rulings that lived only in `git show aa21cbb:docs/HANDOFF.md` §3 and
older §16 copies; image ones went to IMAGE_SPEC §4):**
Shop: an empty category leaves the 4 nav surfaces and the sitemap, its page is noindex, the URL keeps working and it comes back by
itself; copy "ยังไม่มีสินค้าในหมวดนี้" + "กลับมาดูใหม่เมื่อมีสินค้าเพิ่ม" (22/09 "เคาะทางตัน") · desktop card price = variant B (price on its
own line under the tagline) · Argus Multi-Ohm Cartridges (3 pcs) = an Argus accessory in the VOOPOO category · WOTOFO stays on /about
with its brand and footer link; its brand page = Friday decides, never an empty page for customers · BLUEBERRY ICE (printed on the
device) and Blueberry (maker's list) — both kept (30/09 "ตามนั้นเลย").
Search: many alias spellings per brand are fine, one direction only, never rendered; every brand on sale needs a Thai alias ·
"น้ำยา" keeps returning its 3 prefilled items (m-switch-pod · muro-3ml · coil-74) while e-liquid stock is 0.
Head copy, clips: "(Marbo)" stays in the M Bar titles (THAI_STYLE §3 รอบ 8) · one clip per article (round SEO ข) · en/zh caption under a clip whose Thai
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
Muro Connector 20K (pods, Javis's photos) OK · SUP ZERO 22K price = the price printed on its new image · daily price check 15:00 ·
Zero Pro Copper / Champagne = slot stays without a photo until a real one exists.
**Owner 29/10 evening (chat):** Zero Menthol Freeze -v2 photo PASSED · TPP-DM4 (coil-38) REJECTED (cut edges not clean, options jump
when switched — sizes differ) · same-day cut-off = 12:30 (BSOT §10)
· carriers = EMS + DHL only (BSOT §10) · a cancelled order whose slip was never confirmed promises no refund; only out-of-stock does ·
price-check routine result seen by the owner.
