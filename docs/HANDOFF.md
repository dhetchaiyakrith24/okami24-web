# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] on every "done / works / number" statement (central §12 item 9) · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1

1 main: `git fetch && git log -1 --oneline origin/main` · 25/10 evening = 4012bf10 (#836 hourly stock; #830–#836 = stock runs) ·
  #829 docs shipping note · #826 Q5b · #824 Q5 · #821 in-stock menu · #819 in-stock filter · #817 Q1–Q3 · #811 cart-ready. Older = `git log`.
  **CART IS ON on the live site since 24/10 ~23:35** (owner 24/10 23:00: "จบตรงนี้เปิดระบบตะกร้าเลยครับ") — Render env OKAMI24_ORDERING=on +
  Save, rebuild, and deploy (Friday in the owner's Chrome); /cart 200 + "เพิ่มลงตะกร้า" on product pages, / /products /staff /orders 200 [ตรวจแล้ว].
  Render env form: unrevealed secret rows show EMPTY inputs in the DOM (not loaded) — saving keeps them; edit only the one row (focus it by
  its key, type, check the value by script) — Chrome screenshots of that page time out. Turn OFF = same steps with off.
  ALWAYS after a merge: check the deploy reached success (`gh api repos/dhetchaiyakrith24/okami24-web/deployments?sha=<merge sha>` → statuses)
  — #776+#779 builds FAILED on Render's 60 s per-page limit while local verify passed (fixed #781). Every deploy = ~30–60 s of 502 + LINE
  webhook events in that window are lost → group merges.
  Deploys: Render builds every merge (Auto-Deploy "On Commit"; Blueprint "Sync paused" → change Render settings in the dashboard). Spend limit
  $10/month (owner 23/10). Env change = Render → Environment → Edit → "Save, rebuild, and deploy" (prerendered pages need the rebuild).
  Open PRs: #643 (old, not touched).
2 Main folder: every branch of the 24/10 chats merged (#823 handoff, #829 shipping note). Test trees free to reuse (real node_modules incl. jsqr): `_incoming/wt-golive` ·
  `_incoming/wt-cart` · `_incoming/wt-stock` (the hourly routine's — leave it clean). A FRESH worktree fails verify --full typecheck once
  (LayoutProps) → run twice. Junctioned node_modules break Turbopack builds. Gate `full` needs a verify stamp of the EXACT head → merge
  origin/main + all extra commits BEFORE the verify run (~20 min each). PR flow: draft → verify --full on the head in a test tree → gate →
  checker → `gh pr ready` once → checks → `self-merge-check --pr` alone, run IN the PR's tree → merge --match-head-commit → deploy success.
  Test-build kit: start with `OKAMI24_DATA_DIR=<copy of a test DB> SITE_URL=https://okami24.store npx next start -p <port>` (SITE_URL=localhost
  is refused) + OKAMI24_ORDERING=on at BUILD time for cart pages. Order-page states: `_incoming/stock-oe/` (data-b DB · seed-b.js · shoot-b.sh
  · shots/) · cart flow: `_incoming/cartux-a/`. Staff pages locally: start with OKAMI24_STAFF_PASSWORD=<the test value in
  `_incoming/stock-oe/.staff-test-pass`> (local only, never the live one). Stop only your own servers by port (Get-NetTCPConnection → Stop-Process).
  Server-action forms in the Browser pane: React resets uncontrolled inputs after every action (LESSONS พ45).
3 ROUND "cart ready to reopen" (owner 24/10 ~16:00, main chat local_6dc0e8b6-0003-4167-b981-1d6bd5539951) — ALL FIVE conditions DONE
  (#806 order-entry stock · #811 pre-payment flow + copy + unpaid auto-cancel 24 h + phone rate limit + bank-refund branch optional ·
  #807 after-payment steps · #810 staff guide line) and the cart is ON (item 1). Walk kit `_incoming/cartflow-2410/` · test tree `_incoming/wt-golive`.
  Left: ④ off-site DB backup needs an R2/B2 account = the owner signs up (รอพี่ตรวจ 77; DEPLOY-RENDER §9) · age-gate body still says
  "order on LINE" (owner 24/10: stays) · checker notes not fixed: rate limit trusts X-Forwarded-For off Cloudflare (shop-wide
  300/10 min cap) · empty idempotencyKey not refused (old).
  OWNER WORK QUEUE — the ONE ordered list (owner 24/10 night: "จดด้วยนะ อะไรทำ ยังไม่ทำ งานค้าง ลำดับให้เรียบร้อย") · tick here when done:
    DONE (what each did = the PR): Q1 #817 · Q2 #819 · Q3 #817 · Q2b #821 · Q5 #824 · Q5b #826 · 26/10: #842 = Q5c + staff order page
       4 cards / ONE customer-message box (owner) + unpicked pages read sold out when every option is out · #845 = header menu Esc/tap,
       phone grid bar two planned rows, option counter skips the cover, "แตะรูปเพื่อเลือก" prompt · #846 = Q7 ค่ะ/นะคะ + LINE pointer +
       facts (no OTP, slip on the order page, tracking number not only via LINE) th/en/zh.
    Disposable-45 = SUP Zero 22K — owner declined 22/10 ("2 ไม่ลง"); marked so in `_incoming/stock-api/new-products.md`, not listed.
    Q5 taste left: relx-smash-go-12k 17 of 27 tiles share photos (data picks by device band colour) · "ใกล้หมด" NOT built (no quantities).
    Q4 [PAUSED — owner 26/10 "ยังไม่สะดวก"] login + member page. Owner picked: LINE + Google first (no Facebook) · NO member perks yet and
       none on the sign-up page · staff keep the password. Drafts v2 (premium, owner asked "พรีเมียม เรียบหรู") = `_incoming/q4-drafts/`
       v2-*-390/1440.png (gen2.js) — owner has not said OK yet. Needs the owner to sign up LINE Login + Google OAuth (Friday guides).
    Q6 brand round: new logo (owner's file 24/10 = kabuto in red ring + "OKAMI"; Friday: change everywhere on one day + broadcast
       "โฉมใหม่"; need the original high-res/vector file; ask "OKAMI" vs "OKami24" text) + samurai-woman character in a restrained way
       (red sword-slash on add / confirm / paid · faint brush + red moon in a few backgrounds · the character only in hero spots) —
       reference = owner's 10.10 broadcast poster; drafts first
    Q7b [DONE #849] cart-on wording follows OKAMI24_ORDERING (FAQ where-to-buy via ORDERING_OFF_ANSWERS, how-to-order stuck2, contact order
       card, about contact) + privacy phone line without OTP. Left — ASK the owner first (group ก / approved voice): age-gate body ("order on
       LINE") · footer.ageNotice "สั่งซื้อและสอบถามทาง LINE" · hero.description "ถามหรือสั่งทางไลน์" · /warranty ค่ะ (10 spots drafted in
       #846 notes) · pre-existing: /products en/zh show the Thai name "หัวพอต RELX Creator Pod 20K" (side chat list-missing handles it).
    Side chat list-missing (local_b0f66e49, Opus 5.5 medium, owner 26/10): lists every Max product the site lacks (brief
       `_incoming/next-chat-list.md`); skips owner-declined Disposable-45 + Pod-180; stock from the order-entry read only.
    Q8 D upsell row in the cart (owner "A+B ครึ่ง ๆ": half same brand/category in stock + half shop best-sellers · designer + tier B shots ·
       can reuse `lineImage()` / LineThumb for its cards)
    Later / parked: off-site backup (owner 24/10: "ยังไม่ทำ" — รอพี่ตรวจ 77) · image sweep 21 warehouse products (รอพี่ตรวจ 41) ·
       SEO line 2 queue (3s) · GSC read 01/11 · speed (item 5) · #807 notes a/d · rehearsal (รอพี่ตรวจ 59) · stock without a rebuild
       (proposal ①: every stock PR = a deploy = 30–60 s of 502).
  #807 checker notes left (b, c, f were fixed; checked 26/10): (a) an admin message saying "ด้านล่าง" stays after the customer
  chose · (d) stale comments (migration 0013, cleanPromptPayPhone) · cleanBankText keeps invisible characters. BSOT §9 line changed by
  #804 quotes the owner's chat 24/10 (other chat) — confirm with the owner.
  Known, not fixed: after a partial refund the order cannot get a second out-of-stock issue (one row per order) · history keeps the refund ref,
  not the amount · no DB-level tests · designer note: mark the out rows in the order page's item list · cart UX C (#795): Back from review
  returns to review · a typed note is lost if placing fails · the add form needs JS, a double tap while pending adds twice (#792) · B count comes
  from /api/cart/count because pages are prerendered — never add cookies() to the layout.
  Warehouse slip: Pod-156's 14th option is coded "Pod-147" in Shipnity Max (the order-entry decoder skips it). Hand-kept sold-out line
  `muro-connector-20k | Double Mint` (#800, src/data/stock/sold-out.ts) — remove when the order-entry read shows Pod-171-3 back.
  Old side chats to archive: line1-images-2310d local_be2fd557… · line2-cart-2310b local_277aecbf… · line1-images-2310c local_1b6cafc0… ·
  old main local_686a322f-0897-443b-89a8-c30fd88e0e5c.
  LINE bot LIVE [ตรวจแล้ว 23/10]: webhook https://okami24.store/api/line/webhook (Verify = Success, unsigned POST = 401); groups bound on /staff:
  "OKM Webside order" = order alerts · "OKM Slip check" = slip check. A join event lost during a deploy = remove the bot from the group and
  invite again (DEPLOY-RENDER §8). Bot: LINE OA "OKM ORDER" @691qxpxp (free 300 msgs/month; a group push counts per member).
  No Shipnity API — staff forward orders by hand. Staff guide = docs/คู่มือแอดมิน-ออเดอร์เว็บ.md.
  Test orders: OK-20261023-e25378 (TEREA ฿270, pending payment) + possibly a 2nd (M Bar 9K ฿400, owner's screenshot) → cancel on /staff
  (reason "ทดสอบ") after the owner finishes testing. Order numbers use the UTC date (OK-20261023-… was placed 00:09 Thai 24/10) — noted, not changed.
  EasySlip quota 497/1000 used this month (23/10) — warn the owner before it runs out. Known slip risk: receiver-match misjudged a K+ slip 10/10
  → fix = EasySlip matchedAccount (owner step, รอพี่ตรวจ 57).
  Owner rulings 23–24/10 (round): checkout stays phone-only (no OTP, no LINE login) · green "shipped" glow approved = the style for key-moment
  effects site-wide ("ยืนบนความเรียบหรู") · IQOS colour names = Friday decides.
3c ROUND "reopen the cart" = `docs/rounds/รอบเปิดตะกร้า-22-10.txt` — goal reached (cart ON, item 1); round not closed (no tag yet).
3w CLOSED 21/10 homepage upgrade (tag `home-upgrade-2110`) · taste notes left for the owner: G5 contact shadow faint on phones · 1366 lineup
  label→device gap ~10 px tighter than the approved clip. Switches `src/data/home-hero.ts`: DESKTOP_HERO · DESKTOP_BG · DESKTOP_CARD_LAYOUT ·
  DESKTOP_TRAVEL · PHONE_HERO. Other closed rounds (render-build-2110 · max-list-2310) = their tags.
3u STOCK — HOURLY routine `okami24-stock-daily` (cron `0 0,8-23 * * *`, Sonnet 5.5 medium) — re-enabled 23:00 24/10 (owner: "ตั้งใหม่ …
  เจอสินค้าใหม่ให้รายงานไว้สั้นๆ") with step 3b: NEW product codes (in the read, not in sku-map.ts) appended to
  `_incoming/stock-api/new-products.md` (not in git) — Friday reads it and queues the listing for the side chat; clears lines once listed.
  First list 24/10: Disposable-45 (15/15 in stock). Flow: reads the ORDER-ENTRY picker in the owner's Chrome (new tab, read only: never pick a
  customer / add an item / press บันทึก) per the header of `scripts/order-entry-stock.js` → `stock-sync.js --order-entry` (closes AND re-opens)
  → PR only when stock changed → verify --full → gate → checker → the run merges it itself (TEAM_RULES 13.7) → deploy success; anomaly stops
  (>15 products / >60 codes / missing codes / other files / reader problems, disagreements or a CONFLICT) leave a draft and ask. Skips when a
  stock-sync PR is still open or `_incoming/wt-stock` is busy. Prompt = C:\Users\dhetc\.claude\scheduled-tasks\okami24-stock-daily\SKILL.md.
  Cost watch: each changed hour = one full build + one checker + one deploy (~30–60 s of 502).
  Old round "stock: Shipnity API + SKU" = `docs/rounds/รอบเชื่อมสต็อก-Shipnity-API-SKU-08-10.txt` · 【ห้ามแตะ】 coil-1/72/94 photos · every
  price file · rulings = §18 "Stock" + BSOT §4 · old prompt folder `okami24-stock-sync` kept (§18). NEXT: stock adapter when the warehouse
  sends the API · then order push with the shipping fee (35 to the warehouse on its own field, free shipping as a shop-paid discount line —
  `docs/cloud-results/stock-api-sku-survey.md` last section). Warehouse questions = รอพี่ตรวจ "คำถามถึงคลังสินค้า".
  Open: ProductMaster seed in-stock flags are from September · `legacy-price-approvals.ts` still names Pod-181 for caliburn-g4-pro (price
  file 【ห้ามแตะ】 — next allowed touch) · at 390 the small pill sits on the IQOS ILUMA i cap (iqosheet-18): Friday's pick at the next touch =
  a free band above full-frame photos (taste, reversible).
3i OPEN ROUND "image sweep" = `docs/rounds/รอบรูปทั้งเว็บ-NanoBananaPro-16-10.txt` — PARKED 20/10 (owner "หยุดงานอื่นและ Focus แค่งานนี้" =
  homepage hero; last live #619 #620 #621 #624 #625). Resume = brief _incoming/next-chat.md (status ready: Marbo Saltnic first — owner 19/10
  points — then the queue). Image chats own the main folder's `_incoming/img-1610/` (worktrees `wt-img` work · `wt-gate` checker · `wt-base`
  base build 47320ddd + before shots `shots/before-*`). State, prompts, pipelines, lessons to fold in = `_incoming/img-1610/NEXT.md` (read it
  first) · prompts `_incoming/img-1610/prompts.md` · masters for 19 of the 21 warehouse products + Pop Up 14 flavours + Marbo 5 colours +
  Pepo 4 = `_incoming/img-1610/masters/` (SOURCE.md = table, out/picks.txt). Open: Feelin C1 ref unresolved · Double Mint
  Watermelon/Peach + Pop Up Strawberry/Mixberry/Lime Soda/Guava Kiwi have no ref · Breeze Blue = the ILUMA i ONE model. VOID 16/10: argus-g4
  gallery (storyDetails never renders role "detail") · caliburn-g5 colours · Drag S3/X3 · row line-ups · M Bar 10K anatomy size = next design
  round. Hero test clips = _incoming/img-1610/hero-test/README.md. Higgsfield balance 4,644.4 (20/10).
3s OPEN ROUND "SEO all keys" = `docs/rounds/รอบ-SEO-คีย์ทั้งหมด-16-10.txt` (side-chat line 2; also owns 3p) · worktrees `.claude/worktrees/seo-line2-c`
  (chat c; build trees `_incoming/wt7-<port>`, `bash _incoming/l2c/setup-build.sh <sha> <port>` — pass a SHA, never HEAD) · `sad-nash-5bf72f`
  (chat d, tools `_incoming/l2d/`) · (`mystifying-driscoll-575ab6` + its `_incoming/p63/` are GONE from the computer — found 25/10; evidence = the PRs) · `.claude/worktrees/seo-line2/_incoming/seo-keys/` (chat 3:
  `linkmap.js` · `wbfix-gen.tsx` + `wb-driver2.js` · `wb-openscan.js` LESSONS พ34) · 【ห้ามแตะ】 product images + image map · every price file.
  Order = SEO_LANDSCAPE §9.6. DONE PRs up to #657 (held links + held titles) and #615 #623 #626 #627 #629 #630 = the PRs; full old list =
  `git show 438cd6e7:docs/HANDOFF.md`. The 22/10 hold was lifted 19/10 and the 22/10 GSC read was done 23/10 (SEO_BASELINE last section).
  Do-not-redo facts: genuine guide has no maker image of a check · DRAG has no clip on the three shop channels (16/10) · dropped on
  sight: Caliburn G4 airflow still, GPP pod chart (white block) · the MTL / RDL / DTL clip `_s48AaDCtf4` is already understanding-mtl-vs-dtl's
  record clip. Kept on purpose (checker #536): Zero Nano 500mAh (verified row, salthub.com) and every nexBar CLEAR 18K number (owner's maker
  poster) — cut both if the owner wants strict maker-URL only. Switch guide body says "เครื่องระบบสวิตช์" (THAI_STYLE 10B line).
  Left plain ON PURPOSE: category links in the switch / flavour guides, RELX Creator in the disposable guide, /brands/voopoo in the ARGUS guide,
  the disposable guide's relatedProductSlugs.
  From the GSC read todo (its file was in the removed p63 folder; items kept here): snippet gaps "esko bar" (pos 3.6, 0 clicks) · "joiway"
  (pos 6.2) → fix the ranking pages' title/description with the held heads · /brands/esko-bar intro still names only the Switch (now 2 products).
  Still open from the held list: "พอตคิท" in 5 VOOPOO product metas/taglines (argus-p3 · argus-g3-mini · drag-x · vinci-s · vmate-i3 —
  THAI_STYLE allows it as the VOOPOO device word; ARGUS P3/G4 taglines tie to locked thai-typography entries) · first-pod guide H2 + ¶1
  "พอตคิท" (locked entries) · switch-pods ↔ the two switch guides link each other in <main> · breadcrumb name = shortName vs H1 labelTh
  (all categories) · ItemList on category pages · choosing-a-disposable lacks the new disposables (ESKO BAR 20000, RELX LUMI 18K …).
  §9.7 left: relx-creator H2 "หัวที่ใช้ได้" · blinking/charging/burnt guide phrases ("มาโบ ไฟกะพริบ" — light meanings only from a maker
  manual) · INFY 12K page (NP). Pre-existing: en/zh of /products/pod-159 + /brands/voopoo show Thai text nodes · a category has no zh field.
  CLIP JOB (Friday 19/10): freed clips with search demand → own one-topic guide, else the model's product page; never two pages per keyword.
  Inventory of 62 clip ids = `_incoming/l2c/` (seo-line2-c). Unused on purpose: Fast Charge · mAh · disposable-fade set · leak/burnt extras ·
  "เลิกบุหรี่ไฟฟ้า" (health sources needed) · "m switch รีวิว" (would compete with /products/m-switch-kit).
  Guide standard (Friday 19/10): 1 main query in title/H1/¶1/slug · 3–8 secondary · 1 image per main section · 1 main clip · every product
  named links its page on first mention · 2–4 related guides · FAQ + JSON-LD. Tall portrait posters (> ~1.2 h/w) fill the 1440 screen — use
  landscape ones. No section image ON PURPOSE: what-is-a-pod-system · iqos-iluma-i guide · checking-a-genuine-pod · the two flavour guides +
  quit-smoking · cant-open-the-website. Logo strip (#630): IQOS reads a bit lighter — bump only if the owner says so.
  NEXT (line 2): Caliburn G4 Pro vs G5 + G5 Lite vs Lite SE → §9.7 row 9 heads (seo-auditor reads the paper set first) → "พอต 15k คือ" →
  open-system-vs-disposable / disposable-vs-switch-pod FAQs (§9.4 word "มาโบ" rule) → second-pass key research (§9 append) → batch 3 head
  set (baseline `_incoming/seo-keys/seo-auditor-open.md` in the chat-2 worktree) → FAQAccordion server HTML (answers render only when
  opened — shared by /faq, product and guide FAQs → whole-sitemap scan) → product flavour FAQs → clip leftovers.
  Line breaks: new copy must leave 0 latin-term / compound / negation / number-unit flags at 390 + 1440 — model names outside MODEL_NAMES
  (TFIT M Power · nexBAR 18K · RELX Creator · Muro Connector · QR code) split; wording only (thai-typography.ts is locked). Measure candidate
  wording in the running page first (harness in `_incoming/l2c/`). Plan tool: skill `content-strategy` (keymap = SEO_LANDSCAPE §0).
3p OPEN ROUND "p63 searched models" = `docs/rounds/รอบลงสินค้า-63-16-10.txt` (owned by line 2) · its `_incoming/p63/` files (research.md) are gone with the worktree — the PRs hold the evidence
  · Owner item 63 (BSOT §4): a page per searched model, maker facts only, no price row (browse-only), options in
  `sku-map.ts` (null = sold out). LIVE = #534 #537 #540 #583 #584 #589 (the PRs).
  Left on purpose: TEREA en/zh show the Thai spec rows (site-wide gap) · warehouse child IQOSHEET-15-18 "Black Purple" not on the page (needs a
  maker source) · nexPOD 15K pods = a separate product if ever wanted · relx-infinity-2-plus real cap = light-grey disc with a V notch, render
  = black (card-v3 would come from the image line) · esko-bar-20k card small (maker file 603 px → re-shoot candidate).
  Small follow-up (checker #534 r2): uwell.ts comment near the top names sold-out.ts (the source is sku-map null) · the old G3 card map entry
  (cobalt-blue.jpg) still sits beside the new one.
  NOT REAL (report only): M Bar 18K · Marbo 25K · RELX Diva / Sparta / Novo · nexBAR Switch 15K (→ nexPOD 15K). JOIWAY 12K / 20K = F3 / F4
  already live (alias = SEO chat). NEXT: INFY 12K (NP) · then round-close (tag p63-1610).
4 SIZE: §16 trimmed by house-weekly 25/10 (done PR lists → the PRs; old text = git) — still over the 15 KB spec; the rest is open-round state.
4 waiting on owner: ONE list = `docs/รอพี่ตรวจ.md` — nothing waiting on the owner is written here.
5 open / dated:
  - GSC reads: 22/10 done 23/10 · next 01/11 (rows 9–21, 23) · 15/11 · 10/12. GSC in the owner's Chrome: screenshots time out —
    drive it by `find` refs; type the URL into "ตรวจสอบ URL ใน okami24.store" + Enter TWICE (the first is swallowed).
  - Search Console 2–4 weeks after 12/10: no okami-24.com URL shows instead of .store.
  - YouTube drafts 8–13 (SEO_LANDSCAPE §4) = the owner pastes them in Studio; a renamed clip → update its `title` in guides.ts.
  - Speed (LESSONS 37): NEXT = PRODUCT_COPY_TH via ProductCard (pulled into client graphs by CatalogBrowser + RelatedProducts →
    ProductRail + FavoritesList/FinderTool/SearchTool; give it a `taglineTh` prop, server callers pass the tagline; CatalogBrowser
    + RelatedProducts take a slug→tagline map) · then framer-motion on home (owner-approved hero animations — designer first).
    Before = a build of main on the test server.
  - IMAGE SWEEP (owner 10/10 "ทำให้ครบทั้งเว็บ"): what is left = the 21 warehouse products (รอพี่ตรวจ 41, masters in 3i). Seedream 4.5 needs
    "no glowing lines, no LED light, no spotlight, even dark backdrop". Old list = `git show 438cd6e7:docs/HANDOFF.md` §16 item 5.
  - Taste notes: coil-53/coil-70 cards lean left · faint stray pixels on 94-2/94-3 pod bottoms at 2.7x
    (`_incoming/chk-coil2/pod92b.jpg`) · the charging article's record-level clip sits at the end · Drag 6 group image "still
    graphic" (owner 04/10, later) · the M Bar 10K anatomy sheet "looks a bit big" → polish its size (owner 29/09, from the old HANDOFF).
  - Data round: caliburn-g4-mini "~58 min at 2A" unverified · "หัวพอตใส" on m-bar-15k · esko card "20 รสชาติ" · coil-94 Thai
    Shipnity name on en/zh pages that link it + coil-72 "VOOPOO คอยล์ Vmate Infinity Edition" on vmate-i3 en/zh and its retailer
    evidence sentence · the 2 sentences still citing a retailer page (VMATE i3 · Caliburn X, compat copy — from THAI_STYLE
    15/10) · search "Sugus" alias · MOOOD who-for line → "…ที่มีกลิ่นให้เลือกหลายกลิ่น" (§18) · INFY 20K "explain the
    absence" FAQ (cut at the page's next touch, §18 06/10 pm) · nexBAR 18K counts 31 flavours, shows 20.
  - Copy items moved from THAI_STYLE §6 (15/10, record = THAI_STYLE_LOG end): /e-liquid page description = switch to version ข
    the day e-liquid goes on sale · "research-voice" taglines written while hidden (tfit-m-power-20k · infy-20k · joiway-f3 — all live now) rewrite as
    a group · M Switch Kit / Zero Pro / Zero Nano are switch systems typed pod-kit + Coil-72 (built-in-coil pod) still typed coil — Coil-89 already moved (data) ·
    "ท็อปฟิล" vs "Top Fill เติมบน" (transliteration sweep) · designer: `text-wrap: balance` on mobile H2/H3 · (closed: "พอตใช้แล้วทิ้ง"
    split mid-word = the owner ruled NOT to bind it, THAI_STYLE §5 — reword only) · anatomy sheet part names read oddly ("ปลอกลายร่อง")
    → reword for easy understanding even if not literal · "วงแหวน RGB" → "ไฟ RGB" (EN "RGB status ring" likewise) (both owner 29/09,
    from the old HANDOFF; still in the i18n copy files).
  - Site, own tasks: home en/zh 16 Thai nodes · the owner may send a Mac screenshot (DNS round 3g) · /faq has no in-content links (→ open-system-vs-disposable) · pod-kits →
    pod-systems link slot (designer) · LINE OA rich menu / pinned post (owner: later) · Analytics = NOT now (revisit before the
    first paid ad).
  - Own rounds (owner 07/10): typo-tolerant search Thai + English (site + Google) · a lifestyle / real-shot strip at the end of
    product pages (sheet 16 A, the owner wants one sample shot first; answers in https://claude.ai/artifact/FyeA5PgJswtYDvoh3xUwSr collection "answers") · every product
    gets an SEO article in "more details" (owner 01/10).
  - Slip check (owner 10/10): a correct transfer judged wrong AGAIN → switch to EasySlip's `matchedAccount` (the owner's step =
    รอพี่ตรวจ 57), then test one K+ QR + one Krungsri slip and drop our receiver-match.
  - Next SEO round: M Bar 10K airflow row + head · G5 hero tagline repeats · product FAQ answers absent from server HTML · shared
    GPP note on 8 UWELL pages · term brackets site-wide (`node scripts/paren-terms.js`; keep device-screen ones).
  - Cleanup: `lineupFirst` unused · `dict.product.anatomyTitle` en/zh · zh spec/FAQ English · article H3 font reads narrow ·
    m-bar-15k card.webp still referenced (hidden product, harmless) · families.ts / unbranded.ts history comments ·
    `vmate-i3/variants/*` + `argus-p3/lineup-v2.webp` unused (names appear in src/ — check by hand) · `attributes.drawStyle`: an old
    ruling called it "deliberately unused", it is now used in CompareTool + infy.ts — check it is a real maker fact ·
    scripts with no live reference (house-check 18/10 + 25/10): asset-refs.ts · image-quality-audit.ts · poster-cutout.js — cut at the image
    round's close if unused · deploy-decision.js header + CLOUD.md lines 85/91 still describe the old hook flow (Render buildFilter left on
    purpose: docs-only merges still build).
  - Page notes for each page's next touch = `git show 6b70cd2:docs/HANDOFF.md` §16 item 5 · wordbreak: «ไฟจะ» on
    /guides/fixing-no-draw-and-blinking-light@390 + pre-existing flags in `_incoming/sitewide-template/5/mood/gates/wb3.log`.
  - Rule-audit 15/10 lock proposals (Friday's, a hook = checker): L1 rm/sed -i/redirect into a checker-read tree · L2 scan/shot
    tools against the live site (L3 dropped 24/10: the stock PR no longer waits for the owner).
  - Scan baseline re-measure on the test server (rule-audit row 45) = the next full round close.
  - Proposal to make (owner's queue 03/10, item D = rule-audit old #44): move chats earlier in image rounds (~350–400K) = a
    central-rule change → propose with reasons first (central §12 item 28).
6 verify baseline = round SEO ฉ close 14/10 (`_incoming/seo-f/b7/*.log`, numbers as printed) [ตรวจแล้ว]: tsc 0 (empty log) ·
  verify:commerce 17/17 · i18n 16/16 · content-dates current (57 paths) · raw NBSP/U+2060 in source 0 (again 0 on 15/10 after
  #494) · scan.js 0/118 + og-gate 118/118 (both against the live site — before the 14/10 test-server rule) · storefront 55 shown /
  55 buyable (37 legacy + 18 ProductMaster). verify:catalog --full = the local test server before the checker (since 21/10 GitHub `checks` = the fast verify, no build; Render builds at deploy).
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` (+ the round file the owner approves next)
  (cloud chat: + `docs/CLOUD.md` item 3)
```

## 17. Tools and standing technical rules (not state — open when needed)

```
Do not touch unless the round file names it: layout outside the named spot · images (outside an image round) · motion ·
  ordering-mode.ts · slug/URL/sitemap/structured data · service pages · Hero.tsx · cinematic/ · THAI_STYLE group ก ·
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
  posters = shoot spot by spot with `--anchor` instead of chasing a page bug · an agent silent past 2x its time budget =
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
  house-check.js (housekeeping measure: sizes · locks · rules followed · leftovers) · lab/js-weight.js (first-paint JS per page) ·
  poster-stretch.js (story poster/cover/anatomy file width vs drawn width, LESSONS-images พ17)
src files the skills use (the one list — skills may not name a file under src/, 13.2; fix a renamed file here):
  [i18n-test] `npx tsx src/i18n/i18n-contract-test.ts` · [catalog-method] `src/data/shipnity-seed/README.md` section
  "Catalog reconciliation methodology" · [legacy-products] `src/data/products/*.ts` · [taxonomy]
  `src/data/shipnity-seed/active-catalog-to-product-master.ts` (`TAXONOMY_MATCHES`) · [spec-gate]
  `src/lib/verified-specs.ts` + `src/lib/verified-specs-contract-test.ts` · [approvals]
  `src/data/shipnity-seed/publication-approvals.ts` · [active-catalog] `src/data/shipnity-seed/active-catalog-source.ts`
Verify: which set = 13.5 · the full list with commands = skill `round-close` step 3 · pass = what each script prints ·
  the last full-set counts = §16 item 6
Git: commit message English, prefix feat/fix/copy/data/docs/chore/agents/rules · Thai text via `git commit -F <file>` ·
  push/merge/deploy = 13.7 · main's branch protection requires `copy` + `checks` (admins enforced, no force push; owner 14/10
  item 55 — a skipped `checks` on a docs-only PR counts as passed) · tag = skill `round-close` step 5 · a check that never starts (job with 0 steps) = read the
  check-run annotations first (`gh api …/check-runs/<id>/annotations`) — 12/10 it was the Actions quota
Agents: when to call each = TEAM_RULES 13.2 (+ the `description` line of its file in `.claude/agents/`) · never one call per sub-item ·
  an agent added or edited is usable at once in the running chat
Render after a merge: ~1 min of 502 + ~2 min after the deploy job ends — wait, then curl. Higgsfield MCP: `generate_image`
  is ALLOWED (owner 20/10, #661); every other credit-spending Higgsfield tool stays DENIED in `.claude/settings.json` · credits =
  IMAGE_SPEC §0 item 7 (cost first, owner's yes).
Work folders: round work = `_incoming/<round>/` (not in git) · what Friday may move or delete alone = skill house-clean
  "รายการเดียว" (its one home) · image provenance keeps pointing at `_incoming/` (§18).
Higgsfield (web app in the owner's Chrome): the draft box is SHARED across tabs and chats — open a new tab, set refs + prompt
  and click Generate in one go · free = the "365 Unlimited" models (Seedream 4.5 · Seedream 5.0 Lite · Nano Banana v1 ·
  GPT Image · FLUX.2 Pro 1K · Kling O1 Image) — check the button reads "Unlimited" before EVERY click · refs = the Chrome extension's
  file_upload on the uploads panel's hidden input (the app's built-in browser pane has no upload tool: 3 KB base64 chunks +
  sha256 check — slow) · results via MCP `show_generations` (read-only) · prompt box = Lexical editor (LESSONS-images 29)
Scheduled tasks: unattended = the task's mode set to Auto in the app (TEAM_RULES 13.6) · a new task: "Run now" once while the owner
  is there and "Always allow" each prompt, or skill `fewer-permission-prompts` · one command per Bash call
```

## 18. Permanent owner rulings — settled, never re-ask (central §12 item 17)

Business facts live in `docs/BUSINESS_SOURCE_OF_TRUTH.md`, Thai words in `docs/THAI_STYLE.md`, images in
`docs/IMAGE_SPEC.md`; this list holds the rulings that have no other home. A ruling that is replaced = overwrite its line.

**Shop and ordering:** the cart is OFF since 24/10 ~16:00 until the owner's 5-item list is done (§16 item 3; LINE @okm24 = the channel meanwhile, BSOT §8) · refunds go to a PromptPay number OR a bank account + the bank's name, no branch needed (owner 24/10 evening, BSOT §9) · stock-PR deploys (~30–60 s of 502) are fine, no need for stock without a rebuild (owner 24/10 "ไม่ต้องซีเรียสครับ ของจริงมันไม่ถึง") · checkout = phone only, no OTP
(owner 23/10) · a customer finds their orders by PHONE NUMBER ONLY (owner 24/10 "เบอร์โทรครับ" — name/address masked) · stock PRs merge
without the owner (owner 24/10, TEAM_RULES 13.7) · the 4
service pages (`/warranty /shipping /how-to-order /privacy`) are not touched and carry no JSON-LD on purpose (item 49) ·
admin page and OTP are parked · caliburn-g4-pro = Pod-168 (Max's code, owner 08/10 — the old Pod-181 belongs to the retired system) · muro-3ml = ฿150 (admin list, "Selling prices" below) · the 20 owner-estimate rows in
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
never fixed in Shipnity · the warehouse will send the API; build the SKU map meanwhile.

**Catalog options sold in one market only (owner 06/10 night, "ใส่ไว้ครับ"):** a colour/flavour the maker sells in a single
market (e.g. IQOS ILUMA i Bold Ruby, jp.iqos.com only) is listed like every other option — non-purchasable until stocked.

**MOOOD Monster 14K (owner 06/10 night):** Grape N5% / Blueberry N5% keep the real frosted body (A) · flavour list = maker 19 + the
shop's 2 N5% · "Sugar Apple" as printed · nicotine row 3% · official-site link to the Wayback copy · no story section, 220 chars OK ·
who-for line = "…ที่มีกลิ่นให้เลือกหลายกลิ่น" (the edit itself = §16 item 5).

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
fix, a broken source photo) · images = the free Chrome route; credits only on the owner's yes in chat (IMAGE_SPEC §0 item 7) · two chats at once: the
second chat works in its own git worktree, never switches the main folder's branch (LESSONS พ22 · พ27).

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
**Homepage (owner 20–21/10, round hero-2010):** hero = the dark ribbons stage, light lines in the shop orange leaning a little to the logo red — never green ("เอาแค่ความลื่นและมิติ") · the four hero slots = strong BRANDS ("ทาง 1"): UWELL Caliburn G5 · VOOPOO ARGUS G4 (not P3: square body) · SALTHUB M Switch · IQOS ILUMA i ONE (Friday's pick); tabs name the brand · desktop products LIE across the stage using the product's OWN card photo rotated (AI re-renders rejected: "บิดๆ เบี้ยวๆ"), calm drift over a warm floor shadow; phones keep the standing card photo · desktop hero (owner 21/10, round homepage upgrade, Artefakt direction) = the 4 slots as CARDS, "การ์ด 4 ชิ้นโอเค" — staggered overlapping layers (#679) + on hover the card lifts and the others blur (#683; a level row and a spread deck were tried and dropped 21/10); the lattice-of-squares background is rejected ("ฉากหลังตาราง … ไม่เอา") · the scroll flow light below the hero = code kept, switched OFF (`HOME_FLOW = false` in `src/data/home-hero.ts`, #672 — "เก็บเข้าคลังไว้ไม่เปิดใช้") · wide rails bleeding right = rejected (#658) · no "ขายดี" / bestseller wording anywhere on the homepage (no sales figures).
