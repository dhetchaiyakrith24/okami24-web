# OKami24 — HANDOFF · v45 · 2026-09-23 (v45 = **round 6 "about3lang" is OPEN and half done.** Batches B1 (age gate en/zh), B3 (the floating LINE label) and B5 (the age dialog's buttons, added by the owner mid-round) are CLOSED — checker PASS and designer PASS on each. **B2 (`/about` in three languages) and B4 (the last ALLOW row) are what is left**, and B2 is where the next chat starts: §16 item 3 carries what it needs so it does not re-derive it. Branch `checkpoint/phase-3.3.3` = `19543c5`, 7 commits ahead of `origin/main` = `f014450`, tree clean, **nothing pushed** — this round stops before push by the owner's instruction. The round's own files are in `_incoming/about3lang/`. · v44 = round "leftovers" is **merged** — `origin/main` = `f014450`, PR #48, tag `leftovers-done` = `e1377c2` confirmed an ancestor of main; branch fast-forwarded, 0 ahead, tree clean. Round 6 "about3lang" opened on that base — the owner opened it in the chat that had just closed leftovers and then chose to run it in a fresh chat (13.10 #6); the v45 line above is its current state. Everything round-open produced is in `_incoming/about3lang/` — start at `round-open-notes.md`. The scope-auditor call for round 6 is already spent; do not repeat it. Deploy of `f014450` is the only leftovers step still outstanding, and it is Cowork's. · v43 = round "leftovers" CLOSED: three carried-over items landed in one chat on top of base `7340428` (round "backlink", tag `backlink-done`). (1) Thai leaking onto en/zh from `LineContact.tsx` (floating LINE button) and `Footer.tsx` (LINE/YouTube icon aria-labels) — every locale showed Thai; both now read new dictionary keys `nav.contactLine`/`nav.youtubeChannel`, no new wording invented (owner ruling 2026-09-22: a word already used on the site without a dictionary key is not a new word). New source-level gate `scripts/thai-leak-scan.js` — close: 0 leaks/149 files. Two leaks found and deliberately left, both 13.4 #6: `AgeGate.tsx` (group ก) and `/about` (24 hits, new finding). (2) `/compare /finder /search /favorites` were noindex yet listed in the sitemap — removed, sitemap 103 → 99 `<loc>`, new `sitemap-noindex-contract-test.ts` (auto-discovered by `verify:catalog --full`, 24 → 25 steps). (3) TFIT/INFY search aliases added as `DORMANT_ALIAS_TERMS`, dormant until their hidden product goes live. Close-verify (all read directly): `verify:catalog --full` 25/25 · `verify:commerce` 16/16 · `scan.js` 0/99 · `og-gate` 99/99 · `overflow-390` 99/99 · `raw-chars` 0 · `i18n` 16/16 · `count-storefront` 53/53 · word-break 0 NEW/0 FIXED on 5 pages. Checker PASS, 0 send-backs, and designer PASS — both reports were only in chat when doc-keeper wrote this, so it tagged them [เชื่อว่า]; the main agent then saved each agent's own text to `_incoming/leftovers/checker-close.md` and `designer-close.md` [ตรวจแล้ว for the files existing and for the numbers in them matching the close logs — still the agents' own reports, not a third verification of them]. The checker broke each new gate on purpose to prove it fails (fake Thai in a component · `/compare` back into STATIC_ROUTES · `hiddenFromStorefront` removed from tfit.ts) and restored each one. That state is superseded by the v44 line above: the round was tagged, pushed and merged on 2026-09-22/23.)

Written: 2026-09-22 · Based on: local HEAD `9bcb3df` (full `9bcb3dfff89eaae274f55075c7e2cfb0cb7f8891`, branch `checkpoint/phase-3.3.3`), read directly from `.git/logs/HEAD` [ตรวจแล้ว] · `origin/main` = `b1b319d` (full `b1b319db37ba650d5c2c8279a9daf8df69bd7ba9`, PR #44 merge — updated 2026-09-22 after merge, `git rev-parse origin/main`), read directly from `.git/refs/remotes/origin/main` [ตรวจแล้ว] — this is a stronger check than v34 had (doc-keeper could read the ref file itself this time). What is still **not** independently checked by doc-keeper: the commit message text ("Merge pull request #41…") and the three live-site probes (homepage `<title>`, Organization `alternateName`, `/products/m-bar-15k` description) — those stay [เชื่อว่า], reported by the main agent's `git fetch` + `curl` just before this handoff, no git-log-walk or curl tool available here. This is a full rewrite (skill `handoff`, owner typed `/handoff`, condition (ข)) — the previous file is archived at `docs/archive/HANDOFF.2026-09-21-v34.md`, untouched.

> **How to read:** every statement carries one of the three tags of ~/.claude/CLAUDE.md 13.10 #9 — **[ตรวจแล้ว]** (seen in the file/commit) / **[เชื่อว่า]** (reported, not verified) / **[รอเจ้าของ]** (needs the owner) · **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"**
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **Thai on the site: `docs/THAI_STYLE.md` is the single source of truth** (rules only — §2 four layers · §3 locked words · §4 typing · §5 group ก/ข + typography mechanism · §6 open work). When to read it is decided in skill `round-open` step 1 (13.9 points there): only on rounds that touch site copy. Before→after examples live in `docs/THAI_STYLE_LOG.md` §6–§7 — open only to cite a past ruling.

---

## Conflicts found

The archived `HANDOFF.2026-09-21-v34.md` was written at the moment the SEO ก round closed, **before** merge/deploy — its §16 said the round was "not yet merged / Cowork's job" and its body sections 1–15 had not been refreshed past the prices-round summary (only the title line and §16 carried SEO-round facts). The repo now shows the round merged (`origin/main` = `6f38745`, PR #41) and the main agent reports it live on the production site. This file rewrites all of §1–§16 on that fact; nothing else in v34 is contradicted by anything doc-keeper could check. [ตรวจแล้ว] for the hash change, [เชื่อว่า] for "PR #41" and "live" specifically (see header).

---

## 1. Current state

**[ตรวจแล้ว]** unless marked otherwise

- **Project:** OKami24 vape shop · Next.js 16 + TS + Tailwind v4 + SQLite · folder `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **Working branch:** `checkpoint/phase-3.3.3` · local HEAD `9bcb3df` [ตรวจแล้ว, `.git/logs/HEAD`] · `origin/main` = `6f38745` [ตรวจแล้ว, `.git/refs/remotes/origin/main`], reported as "Merge pull request #41 from dhetchaiyakrith24/checkpoint/phase-3.3.3" [เชื่อว่า] — branch is ahead of main by **0 commits** if that merge really carries the branch's tip (doc-keeper cannot walk commit ancestry with the tools available; `git log origin/main..HEAD` at the top of the next chat is the way to confirm, see "First things")
- **SEO ก round is closed, tagged, and merged:** tag `seo-a-done` at `68e2a14` [ตรวจแล้ว, `docs/RECOVERY.md` §2 + `.git/refs/tags/seo-a-done` present] · the main agent additionally reports the live site already serves the new head copy (homepage `<title>`, Organization `alternateName` including "OKM", `/products/m-bar-15k` description) [เชื่อว่า]
- **Online ordering is still off** (`OKAMI24_ORDERING=off`, LAUNCH_AUDIT item 43) → LINE `@okm24` is the buy channel · item 44 (7 criteria to reopen ordering) is still **1/7** [ตรวจแล้ว, `docs/LAUNCH_AUDIT.md` item 44 row] — unchanged this round, the SEO round did not touch pricing
- **Checkpoints/tags on record** (all in `docs/RECOVERY.md` §2, the single table): `pre-config-2026-09-09` · `pre-30.1-2026-09-09` · `pre-30.2-2026-09-10` · `lang-done` · `r30-4b-done` · `pre-housekeeping` · `housekeeping-done` · `skills-done` (`9acc296`) · `prices-complete` (`07f74a9`) · `seo-a-done` (`68e2a14`, 2026-09-21) [ตรวจแล้ว, all 10 present under `.git/refs/tags/`]
- **Next round:** not opened. Per `docs/LAUNCH_AUDIT.md` head and this file's §13, the standing order is SEO → articles → data → cart, so articles is next by default; the SEO round's own file also named a possible "SEO ข" (tier-B, internal links/rails) follow-up, which was **named, not opened** [ตรวจแล้ว, `_incoming/seo-a/brief-doc-keeper-handoff.md` line 21]. Which one the owner wants is §7 question (ค).

---

## 2. Done (working, verified)

**[ตรวจแล้ว]** — full history of each round is in the archived HANDOFF versions cited; this section is the current summary only.

- Everything listed in `docs/archive/HANDOFF.2026-09-21-v34.md` §2 (round 30.4ข, skills round, prices round — 53/53 storefront products priced and buyable) is still live and untouched by this round.
- **SEO ก round (2026-09-21, opened and closed in one chat):** Organization + WebSite JSON-LD added to the homepage (`src/lib/seo.ts`) · `offers.seller` on every Product offer · BreadcrumbList (100 pages) / CollectionPage (20) / FAQPage (1) / Article (12) + `offers.shippingDetails` + `hasMerchantReturnPolicy` on 101/105 sitemap pages — the 4 without are `/warranty /shipping /how-to-order /privacy`, the owner's untouchable service-page list, deliberately excluded, not a gap · new `<title>`/description on 9 pages (home · about · contact · /products · /brands/relx · /brands/salthub · /brands/voopoo · /brands/uwell · /products/m-bar-15k), word-for-word from the owner-เคาะ'd table `_incoming/seo-a/table-final-for-owner.md` · a price line on all 53 product descriptions ("ของแท้ ราคา ฿{price} สั่งทาง LINE @okm24", price always read live from the catalog, never typed) · a 22-item short-copy backlog (16 product slugs, 2 guides, 1 technology page, 2 e-liquid category titles, the 404 title) landed in the same commit · checker passed all 3 independent calls, 0 send-backs [ตรวจแล้ว, `_incoming/seo-a/checker-{1,2,3}-findings.txt`]. Full close-verify set is §16 item 6.
- `docs/SEO_BASELINE.md` was written at this round's close from the owner's Search Console read of 2026-09-21 (6–18 Sep window) — 6 numbered predictions of what should move, to be re-read 2026-10-05 [ตรวจแล้ว, file read directly].

---

## 3. Just done (this session — SEO ก round, 2026-09-21)

| Commit | What |
|---|---|
| `6873f03` | data(prices): re-verified evidence for caliburn-g4-pro (Pod-168→Pod-181) and muro-3ml, prices unchanged |
| `b07979d` | feat(seo): Organization + WebSite JSON-LD on the homepage, offers.seller on every Product |
| `cd82b45` | docs: HANDOFF v32 — SEO round open, batches 0+1 landed, batch 2 waiting on the owner |
| `5a584eb` | feat(seo): BreadcrumbList / CollectionPage / FAQPage / Article on every indexable page, merchant fields on every Offer |
| `91ef1d9` | docs: HANDOFF v33 — SEO round batch 4 pushed, batch 2 table at thai-copy |
| `0b015bd` | copy(seo): approved title/description set for 9 pages, price line on every product, batch-5 backlog, 404 title |
| `68e2a14` | docs(seo): round A close — HANDOFF v34, ROUND_COST row, RECOVERY tag row, LAUNCH_AUDIT item 19, SEO_BASELINE.md, THAI_STYLE_LOG entries — **tagged `seo-a-done`** |
| `9bcb3df` | docs: RECOVERY.md tag table — seo-a-done (68e2a14, 2026-09-21); HANDOFF v34 hash filled — **current local HEAD** |

All 8 commits above are [ตรวจแล้ว] read directly from `.git/logs/HEAD`. **Count note:** the brief for this handoff said "9" commits for the round but only listed these same 8 hashes; doc-keeper counted 8 in `.git/logs/HEAD` and in `docs/ROUND_COST.md`'s own SEO ก row ("8 incl. the two docs commits at close") [ตรวจแล้ว] — the "9" in the brief looks like a miscount, not a missing commit; flagged, not silently corrected in the source. After `9bcb3df`, the branch was merged into `main` as `6f38745` (PR #41) [เชื่อว่า, main agent's `git fetch` report — see header].

**Moved here from §16 at the search-price round's close (2026-09-22) — §16 hit its 15 KB cap, this is relocation not deletion (doc-keeper spec):** round SEO ข (guides + technology pages, closed 2026-09-22, tag `seo-b-done` = `fdad0b2`) batch-by-batch detail, verbatim from HANDOFF v38 §16 item 3:

> Round summary, batches 1–5 compressed (full batch-by-batch detail is in earlier editions of this file and this file's git history — not restated here to stay under the 15 KB cap): 1 survey+outline (researcher) · 2 YouTube table+oEmbed → STOP 1 "เคาะโครง" 2026-09-21 · 2.5 mechanism committed `5fcc35a` (inline links/H3/FAQ/review-video plumbing) · 3 guides body → STOP 2 "เคาะเนื้อ" 2026-09-21, committed `6851be9`+`e1c6487`+`c31ba63` (7 guides EN/TH/ZH, 39 links, 20 FAQ, 3 clips) · 4 technology pages → STOP 4, committed `e6dcb09` (Article JSON-LD dates/author) + `7d74f46` (5 technology pages EN/TH/ZH) · 5 close: word-break fix `68945f3` (5 locked compounds never split, 11 model names bound, negation joiners) + the round's own docs-close batch.
>
> Owner's stop-1 question, answered (what in the round file made the work harder, one line each): (1) the numeric §ก per-page character targets — withdrawn by the owner; the verified material actually gave 795–1,142 Thai characters per technology page, not the file's target (2) the round file's "do not touch seo.ts / src/app" list conflicted with the Article JSON-LD date/author task the owner gave later in the same chat, on those exact files.

The permanent rulings from that round are NOT moved — they stay live in §16 item 3 (carry-forward, do-not-re-ask list per 13.10 #12).

**Moved here from §16 at the backlink round's close (2026-09-22) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round share-deadend (closed 2026-09-22, tag `share-deadend-done` = `b8e2fd0`, merged into main via PR #46) full batch detail, verbatim from HANDOFF v40 §16 item 3:

> **share-deadend**: base `d5a336d` (tag `search-price-done`), `_incoming/share-deadend/round.md`. **b1 share cards**: the root layout's `openGraph.title`/`description` were inherited by 52 of 105 live pages — every article, brand page, category page, the FAQ, the service pages and the homepage shared one card [ตรวจแล้ว, `og-gate-before-live.log`: og:title≠<title> 52, one duplicate title spanning those 52 pages, FAIL 104]. Both root fields removed, no new copy — Next now fills each page's card from its own title/description; `openGraphWithImage` also gained siteName/type on the 53 product pages that had been shipping without them · `464e842` · new gates: `scripts/og-gate.js` (whole sitemap, added to skill `round-close` step 3) + `src/lib/og-metadata-contract-test.ts` (9 checks, in verify:catalog) · local after: **103/103 PASS** [ตรวจแล้ว, `close-og-gate.log`]. **b2 empty-category dead ends**: `/products/e-liquid` + `/products/heated-tobacco-consumables` were reachable from the home SHOP grid, both header menus and the footer, but held no products · new `src/lib/category-visibility.ts` (mirrors `brand-visibility.ts`) drops an empty category from all 4 nav surfaces + the sitemap and marks its page noindex, while the URL keeps working and returns by itself once stock lands · page shows "ยังไม่มีสินค้าในหมวดนี้" + "กลับมาดูใหม่เมื่อมีสินค้าเพิ่ม" (owner's approved sentence, split at its dash) + "หมวดอื่นที่มีของ" linking the 6 populated categories; filter sidebar, phone filter button, in-category search and sort hidden there · `d6b9fd3` · `9313125` (round-close skill gained the two new gate lines) · `1ee63be` (content-dates.json regenerated after b2). **Sitemap is now 103 URLs, not 105** [ตรวจแล้ว, count 103 in `close-jsonld.log`+`close-og-gate.log`+`close-scan.log`+`close-overflow-390.log`]. **Checker close: PASS 9/9 brief items + 12/12 close gates, 0 fail** [ตรวจแล้ว, `_incoming/share-deadend/checker-close.md`, on `1ee63be`]. Owner ruling this round (do not re-ask, 13.10 #12): "เคาะทางตัน" 2026-09-22 chat, 5 numbered points — the copy, the 4-nav-surface list and the noindex/returns-by-itself mechanism above are that ruling as built. Merge+deploy = Cowork, not done at v40's time of writing (since merged, via PR #46).

round search-price (closed 2026-09-22, tag `search-price-done` = `5e9fd24`) full batch detail, verbatim from HANDOFF v40 §16 item 3:

> **search-price** (closed, tag `search-price-done`=`5e9fd24`): Thai search wired into /search + every grid page's own search box (`src/lib/catalog-search.ts`+`src/data/search-aliases.ts`, `efcf878`) · desktop card price variant B, price its own line under the tagline (`7436150`) · sitemap lastmod + Article dateModified read from git, not the build clock (`51bc83b`+`850ecec`) · owner's full 17-brand/family alias set + a gate that every brand on sale has one, at close (`ab3e353`) · checker close 6/6 pass, 2 observations: "พอตใช้แล้วทิ้ง" has no alias key by design (it is the category label, finds itself) · "เอ็มบาร์" returns all 9 SALTHUB products not just the 4-product family, because "M Bar" also appears in Zero products' spec text (gate checks missing=0 only). Owner rulings that round (13.10 #12, unchanged): variant B card · "น้ำยา" keeps returning its 3 prefilled items (m-switch-pod, muro-3ml, coil-74) · aliases: many spellings per brand ok, one direction, never rendered, Code may add/drop without asking · "บุหรี่ไฟฟ้า" ok as a typed search word only (site-copy ban unchanged) · every brand on sale needs a Thai alias.

Permanent rulings from both rounds are NOT moved — the share-deadend copy/mechanism ruling and the search-price alias/variant-B rulings stay live in §16 item 3 (carry-forward, do-not-re-ask list per 13.10 #12).

**Moved here from §16 at the leftovers round's close (2026-09-22) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round backlink (closed, tag `backlink-done` = `90d78d4`, merged into main via PR #47) full batch detail, verbatim from HANDOFF v42 §16 item 3:

> Previous round: **"backlink" — CLOSED 2026-09-22, merged (PR #47)**, on base `f766ab3` (tag `share-deadend-done` = `b8e2fd0`, PR #46), `_incoming/backlink/`. **Batch 1 (tier B)**: 0 → **50 of 53 product pages carry 112 links** to the 12 articles, **12/12 articles reached** [ตรวจแล้ว, summed directly from `_incoming/backlink/product-page-link-count-results.txt`: 53 rows, 3 at 0 (iqosheet-16, iqosheet-18 — no article is about heated-tobacco sticks; pod-159 — no verified spec row), sum of the other 50 = 112; independently matches the checker's own count]. Pairing decided by `src/lib/article-relevance.ts` from two sources only: an article's own `relatedProductSlugs` read backwards, or a rule over the product's VERIFIED data with evidence recorded per link; `attributes.drawStyle` deliberately unused (unverified Finder attribute, standing ruling) · cap 3 per page [ตรวจแล้ว, max value in the link-count file is 3]. New component `src/components/product/RelatedArticles.tsx`; one new dictionary key `product.readMoreEyebrow` = "อ่านต่อ" / "Read more" / "了解更多" [ตรวจแล้ว, `th.ts:207` / `en.ts:199` / `zh.ts:192`] — owner 2026-09-22, after rejecting the main agent's proposal to reuse `footer.learn` ("เรียนรู้"); no other new copy, no price or cart in the block [เชื่อว่า, reported]. **Batch 2 (tier A)**: the product share card's title now carries the catalog price the way brand-page titles already do — e.g. "VOOPOO DRAG 6 พอตคิท ของแท้ ฿2,490" (`shareTitleWithPriceTh`) [ตรวจแล้ว, function in `src/i18n/search-head-copy.ts`, used in `src/app/products/[slug]/page.tsx`]; the price was already in og:description but past the 160-character point where a preview cuts it; `<title>` itself is untouched (its 53 strings stay in the GSC measurement window opened at the share-deadend close, until 2026-10-05) · `scripts/og-gate.js` gained one narrow exception: a "฿<number>" tail is allowed only when that same number also appears in that page's own og:description [ตรวจแล้ว, `og-gate.js` lines 76–86]. **Also**: `scripts/shot.js` gained `--anchor "<selector>"` — the new block sits ~5000px down a product page, past the tool's old 4000px cap and always-reset-to-top default [ตรวจแล้ว, `shot.js` lines 32–77]. **Checker: PASS 21/21** (batch 1 6/6 · batch 2 3/3 · close gates 12/12) [ตรวจแล้ว, `_incoming/backlink/checker-close.md`]. Owner ruling this round (do not re-ask, 13.10 #12): `readMoreEyebrow` = "อ่านต่อ", not `footer.learn`, 2026-09-22 chat. Merge done (PR #47, 2026-09-22) — deploy is Cowork's, not confirmed here [รอเจ้าของ]. Tag `backlink-done` in place, see item 1.

The permanent ruling from that round is NOT lost — it is now also carried in §16 item 4b (carry-forward, do-not-re-ask list per 13.10 #12).

### Round "leftovers" (2026-09-22, tag `leftovers-done` = `e1377c2`, merged via PR #48)

Batch detail relocated here from §16 on 2026-09-23 when round 6 opened — the 15 KB cap, relocated
not deleted (doc-keeper spec). §16 keeps only the one-line pointer.

| Commit | What |
|---|---|
| `b29f55b` | docs: §16 state refresh, owner-ordered BEFORE the round — not round work |
| `13bec7f` | fix(i18n): the two site-wide contact affordances stop speaking Thai to en/zh |
| `18d9ea5` | fix(seo): the sitemap stops offering pages that say noindex |
| `c8a0b5a` | feat(search): TFIT and INFY aliases, dormant until their products have a photo |
| `2a7c09d` | chore(scripts): a gate for Thai leaking into en/zh, and a real key press for shot.js |
| `f4bffe0` | chore(dates): content-dates.json regenerated after c8a0b5a |
| `e1377c2` | docs: round closed — HANDOFF v43 §16, ROUND_COST row, RECOVERY tag row |
| `abb9f65` | docs: RECOVERY — leftovers-done tag hash filled |

- **Item 1 (tier B, one label site-wide).** `LineContact.tsx` (now a Client Component) and
  `Footer.tsx`'s LINE/YouTube `aria-label`s carried Thai literals, so en/zh showed Thai on every
  page. Both now read `nav.contactLine` / `nav.youtubeChannel`; no new wording — the strings are
  reused verbatim from `faq.contactLineCta` / `checkout.contactLineCta` ("สอบถามทาง LINE") and
  `product.watchOnYoutube` ("ดูบน YouTube"). Thai label consequently changed "สอบถามสินค้า" →
  "สอบถามทาง LINE". New source-level gate `scripts/thai-leak-scan.js`, because `scan.js` reads
  server HTML and the server always renders Thai — close: **0 leaks / 149 files**, 37 allowed
  hits in 4 ruled files. Two leaks found and deliberately left, each with a reason and an
  "until" in that gate's ALLOW list: `AgeGate.tsx` (8 hits, group ก) and `src/app/about/page.tsx`
  (24 hits) — both 13.4 #6, and both became round 6.
- **Item 2 (tier A).** `/compare /finder /search /favorites` were noindex AND sitemap-listed.
  Removed from `STATIC_ROUTES`: sitemap **103 → 99** `<loc>`; all four still 200 and still in the
  footer's Tools column. New `src/lib/sitemap-noindex-contract-test.ts` reads every static
  `page.tsx` and fails if any always-noindex page is listed, so a page written next month is
  covered; auto-discovered by `verify:catalog --full` (24 → 25 steps).
- **Item 3 (tier A).** TFIT and INFY (each brand's only product is `hiddenFromStorefront` for
  want of a card photo) got 6 Thai spellings plus `DORMANT_ALIAS_TERMS` in
  `src/data/search-aliases.ts`, and `catalog-search-contract-test.ts` holds a dormant alias to a
  STRICTER bargain than a normal one: must find nothing today, must have a real hidden product
  behind it, and must FAIL once the product goes live until the row is deleted.
- **Beyond the three:** `scripts/shot.js` gained `--key` (a real CDP key press — the FAB label
  only shows on `:focus-visible`, which `focus()` alone does not trigger); stale "105 pages"
  comments fixed in `scan.js` / `og-gate.js`; a note in `content-dates.ts` about the four
  families the sitemap no longer reads.
- **Checks.** Checker PASS, 0 send-backs, and it broke each new gate on purpose to prove it fails
  (fake Thai in a component · `/compare` back into `STATIC_ROUTES` · `hiddenFromStorefront`
  removed from `tfit.ts`), restoring each. Designer PASS on the round's one visual change; it
  raised the FAB `max-w-[9rem]` headroom, which became round 6 item 3. Reports saved at
  `_incoming/leftovers/checker-close.md` and `designer-close.md`.
- **Process note for the record:** the main agent started a dev server on port 3000 early in the
  round, which HANDOFF §17 reserves for the owner. It was stopped as soon as §17 was read, and
  every gate result reported for this round was re-run on port 3412.

---

## 4. Known broken / missing, not fixed yet

- **[ตรวจแล้ว] og:title of the homepage is still the pre-round string** ("OKami24 — ของแท้ ราคาตรง บริการจริง") — the owner's approved table covered `<title>`/description/og:description only; og:title was never in scope this round. Confirmed absent from `_incoming/seo-a/table-final-for-owner.md` and from THAI_STYLE_LOG's own round entry, which notes it explicitly [ตรวจแล้ว, `docs/THAI_STYLE_LOG.md` line 905].
- **[ตรวจแล้ว] THAI_STYLE.md §3 has no rows for the round's 4 new head-copy words** ("ร้านพอต", "บอกราคาทุกตัว", "Marbo", "ไม่มีคอยล์มาในกล่อง/ต้องซื้อคอยล์แยก") — confirmed by grep, they exist only in `THAI_STYLE_LOG.md` §7's round table, not as locked-word rows in `THAI_STYLE.md` §3. This is a deliberate omission per the brief (head copy only, judge after 14 days), not an oversight — see §7 question (ก).
- **[ตรวจแล้ว] Resolver test coverage gap (carried from the prices round, untouched this round):** no test calls `resolveProductRef()` with a real, catalogued, unpriced legacy slug, because all 45 legacy products are now priced. Accepted by Cowork until the cart round.
- **[เชื่อว่า] freeShippingThreshold (500 THB) not expressed in structured data** — deliberate: schema.org places that field on `ShippingRateSettings`, not `OfferShippingDetails`, and Google's merchant parser does not read it there. Per the round's own commit-message reasoning, not independently re-derived by doc-keeper against schema.org's spec text.
- **[รอเจ้าของ/Cowork] Rich Results Test, GSC "validate fix", and index requests for the 45 currently un-indexed URLs are Cowork's post-deploy steps** — named in `docs/SEO_BASELINE.md`, not yet confirmed done by anyone in this chat.
- 4 service pages carry no JSON-LD by owner ruling — not a bug, listed here only so it is not mistaken for one.
- **12 product descriptions are trimmed versions** of their base spec sentence, cut to fit the 160-character description limit after the price line was appended — actual close-time count is **28**, not 12 (the checker's mid-round count of 12 was taken before batch 5's extra overrides were added; both numbers are real, from different points in the round) [ตรวจแล้ว, `_incoming/seo-a/close-desc-price-gate.log`]. List of all 28 is in that file.
- Everything `docs/archive/HANDOFF.2026-09-21-v34.md` §4 listed and did not resolve is still open: caliburn-g4-pro Shipnity code (resolved: Pod-181, per commit `6873f03` — no longer open, listed here only to close the loop) · muro-3ml Shipnity-table absence (resolved: kept ฿99) · footer.tagline 3-word repeat · zh compatibility-note strings (2 spots) · Coil-72/89 category-label mismatch · 6 cards with an empty spec row · `ProductHero.tsx` stats not checking `verified` · TPD labelling on VINCI S/G3 mini · `PuffCount.tsx` dead code · `/favorites` and order-status zh eyebrow⊂H1 duplication · a Tier-B backlog of ~30 word-break items the owner declined to chase one by one · #31/#34 iPhone check · 2 `priority` spots · `th.ts` dead strings · hidden FAQ research · a stray dev-language comment in `relx.ts:19`.

---

## 5. In progress (scaffolded, needs continuation)

None. [ตรวจแล้ว] The SEO ก round closed cleanly, merged (per the main agent's report), and this handoff is the closing action. No branch work is mid-flight. The next round (articles, or SEO ข if the owner opens it instead — §7(ค)) has not been opened.

---

## 6. Needed, not started

Same long list as `docs/archive/HANDOFF.2026-09-21-v34.md` §6 (next rounds per LAUNCH_AUDIT: articles · data round — Coil-72/89 taxonomy, TPD, ProductHero verified-gate, PuffCount removal · cart round + item 49 + order-status eyebrow · item 45 security review · admin page (item 1, parked) · QR library (items 40/41) · item 42 path-2 offsite backup (R2/B2) · sales/label/meta rounds) — plus:

- **SEO ข (tier B — internal links/rails)**, named as a possible follow-up inside the SEO ก round file but never opened; needs the owner to choose it or articles first (§7(ค)).
- When the stock API lands, overwrite the 20 `basis: "owner-estimate"` rows in `src/data/shipnity-seed/legacy-price-approvals.ts` with real supplier prices, in that one file only [ตรวจแล้ว, `docs/BUSINESS_SOURCE_OF_TRUTH.md` §5].

---

## 7. Questions for the owner

| Topic | Known | Unknown | What to answer |
|---|---|---|---|
| Add the round's 4 new words to THAI_STYLE §3 as locked words | Currently only logged in THAI_STYLE_LOG §7, used in head copy only | Whether they should become site-wide locked vocabulary now or after they prove out | Recommended: not yet — head copy only, judge after 14 days (2026-10-05, alongside the GSC re-read) |
| og:title of the homepage still reads the pre-round string | Approved table never covered og:title | Whether the owner wants it to match the new `<title>` (A1: "OKami24 (OKM) — พอตของแท้ ราคาตรง บริการจริง") | Recommended: yes, fold into the next copy round — not urgent enough for its own round |
| Which round opens next: articles (LAUNCH_AUDIT's stated order) or SEO ข (tier B, named but not opened) | Both are legitimate "next" candidates; LAUNCH_AUDIT's written order says articles, the SEO round file suggested SEO ข as a possible follow-up | Owner's priority | No recommendation — this is a priority call, not a technical one |
| Everything else | Unchanged since `docs/archive/HANDOFF.2026-09-21-v34.md` §7 / §16 item 4 — see that list (9.4 rollback drill · footer.tagline · zh notes · TPD · #31/#34 iPhone · Render OOM watch · priority spots · Lighthouse · items 10/13/16/37 · account name · black-pod photos · R2/B2 · QR library · account 189) | — | Not repeated here to keep this table short |

---

## 8. Risks and things to watch (most dangerous first)

1. **[ตรวจแล้ว] 20 legacy prices are owner estimates — now also shown in Google snippets** via the price line and brand-page titles. When the stock API overwrites `legacy-price-approvals.ts`, the head copy follows automatically (price is never typed, always read live) — but Google's own cached snippet will lag behind the real change until it recrawls.
2. **[รอเจ้าของ] GSC numbers must be re-read 2026-10-05** against `docs/SEO_BASELINE.md` before anyone judges whether this round worked — reading them earlier will show noise, not signal.
3. **[เชื่อว่า] Production DB backup cadence unverified today** — `render.yaml` declares a 6-hourly backup; nobody has checked the Render log for a `[backup]` line since the SEO round closed. Low current risk (cart is off).
4. **Cowork merges and deploys without announcing it in chat** — `git fetch` before trusting any "main is at X" claim; this file's own `origin/main` value is [ตรวจแล้ว] against the local ref file only, not against GitHub itself.
5. Resolver test coverage gap (§4) — carried risk, unchanged this round.
6. **Session/tool findings worth carrying forward** (session-specific, not project bugs): none new this session worth recording — no tool failures reported for the SEO round's chat.
7. The two-tier rule (tier A/B), NBSP/word-joiner mechanism, and the full do-not-touch list are unchanged and live in §17 below — read there, not restated here.

---

## 9. Do not tear down (owner-approved or working as intended)

Everything in `docs/archive/HANDOFF.2026-09-21-v34.md` §9 / §17 "Do not touch" (the single list — layout, images, motion, ordering-mode.ts, slugs/URLs, service pages, Hero.tsx, THAI_STYLE group ก words, card-headline-spec.ts, TrustBar, sticky /compare header, every locked THAI_STYLE_LOG §7 row, the `basis` field and 20 owner-estimate price rows, the three project skills, HANDOFF §16 item 6 as the single home of verify counts, etc. — not restated here) **plus, added this round:**

- The 4 service pages' "no JSON-LD" state — owner ruling, deliberate, not a gap to close later.
- The trim rule in the SEO round's head-copy code (owner: cut at a sentence/phrase boundary, never mid-word, never a dangling connective, never a bare floating number, never a stranded clause-opener) — described in full in `docs/THAI_STYLE_LOG.md` §7 row 6 of the round's table.
- Prices are never typed into head copy — always read live from `priceOf`/`getCatalogItem`.
- "น้ำยา" stays out of head copy until the e-liquid category has real stock on the storefront (re-confirmed this round, not a new rule — original ruling 2026-09-13).

---

## 10. Git — how mixed working-tree changes should be split into commits

**[ตรวจแล้ว]** Working tree is clean as of local HEAD `9bcb3df` except this docs edit (this file itself) and the gitignored `_incoming/seo-a/` briefs folder. The archive copy `docs/archive/HANDOFF.2026-09-21-v34.md` (untracked per the git-status snapshot at session start) belongs in the same docs commit that lands this file. Nothing else is uncommitted, so there is nothing to split this round. Branch `checkpoint/phase-3.3.3` is reported fully contained in `origin/main` [เชื่อว่า] — never merge yourself; that is Cowork's job.

---

## 11. Readiness per system

| System | Status | One-line reason |
|---|---|---|
| Catalog browse / search / compare | Ready, live | Unchanged this round |
| Pricing (53 storefront products) | Ready, live | 53/53 buyable, 0 unpriced — unchanged this round |
| SEO structured data | Live | 101/105 pages carry JSON-LD; 53/53 Product offers have price/seller/shippingDetails/hasMerchantReturnPolicy [ตรวจแล้ว, `close-jsonld-all.log`] |
| SEO head copy (title/description) | Live | 9 pages re-titled, 53/53 product descriptions carry a price line [ตรวจแล้ว, `close-desc-price-gate.log`] |
| GSC validation (Rich Results, indexing requests) | Pending | Cowork's post-deploy step, not yet confirmed done [รอเจ้าของ/Cowork] |
| Online ordering (cart/checkout) | Off on purpose | `OKAMI24_ORDERING=off`; item 44 at 1/7 criteria |
| LINE ordering path | Ready, live | `/cart` and `/checkout` redirect to `?order=line`; unchanged |
| Admin page | Parked, not started | Owner order — do not build without being asked |
| Production DB backup | Configured, unverified today | `render.yaml` declares 6-hourly; no fresh Render-log check this round [รอเจ้าของ] |

---

## 12. What was mid-flight when the chat closed

Nothing. [ตรวจแล้ว] The SEO ก round closed, tagged, and (per the main agent's report) merged and deployed before this handoff was written. What is genuinely open is not "mid-flight work" but **decisions waiting on the owner** — three new questions in §7, plus the carried-forward older list.

---

## 13. Recommended next steps (ordered, with reasons)

1. Paste the §16 block into a new chat, then run `git fetch` + `git status` + `git log -5 --oneline` + `git tag -n1` and compare with what §16 says — if they differ, trust the repo (also "First things" item 1 below).
2. **Do not open the next round without the owner.** Route the three questions in §7 to the owner as one batch (13.4 #6) — which round is next (articles vs SEO ข) is itself one of those questions.
3. When the owner opens the next round, run `scope-auditor` once and build the round's instruction file from `docs/TEMPLATES.md` (ก).
4. On or after 2026-10-05, read `docs/SEO_BASELINE.md` and ask Cowork for the new GSC numbers before judging whether the SEO ก round worked.
5. 9.4 (rollback drill) stays with the owner + Cowork, off-hours, per `docs/RECOVERY.md` §1.

---

## 14. Stop doing (things that waste time or add risk)

- **Typing prices or counts into copy** — every number in head copy now comes live from the catalog; typing one defeats the point of this round.
- **Re-asking the rulings in §16 item 4b** — settled, do not re-litigate.
- **Running screenshot passes on tier-A (head-copy/data-only) rounds** — the SEO ก round needed zero screenshots.
- **Reading `docs/LAUNCH_AUDIT.md` in full** — read the head + the one item number in play, per its own house rule.
- **Judging the SEO round's success before 2026-10-05** — GSC data before then is noise, not signal.

---

## 15. Project end state — full flow, marking which steps already work

**Search → product page with price and structured data → LINE `@okm24`** — works today, live, and is now more discoverable (SEO ก round). [ตรวจแล้ว, LAUNCH_AUDIT §1 head + this round's close-verify set]
**Cart / checkout** — scaffolded but switched off; waits on the stock API landing and on LAUNCH_AUDIT item 44's remaining 6 criteria. Full step-by-step flow (browse → colour/flavour pick → stock check → payment → confirmation → order status) is unchanged from `docs/archive/HANDOFF.2026-09-15-v21.md` §15 — read there for the complete diagram; nothing about the cart itself moved this round.

---

## 16. Paste block for the next chat (copy-paste) — keeps only 6 things: main · what the branch is ahead by · open round and where it stopped · waiting on the owner · open questions · verify baseline at the last close (cap 15 KB · rules/tools = §17)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Read first: the single list is step 1 of skill round-open (.claude/skills/round-open/SKILL.md — 13.9 points there; opening a round = that skill, closing = round-close, touching site copy = thai-check)

1 main: origin/main = `f014450` [ตรวจแล้ว, `.git/refs/remotes/origin/main` read directly, 2026-09-23] — round "leftovers" merged via PR #48. Deploy not confirmed here [รอเจ้าของ]. Tag list: `docs/RECOVERY.md` §2 (cap — not restated); newest `leftovers-done` (`e1377c2`). git fetch before trusting any merge claim · never merge yourself.
2 branch ahead of main by **7 commits** [ตรวจแล้ว, `.git/refs/heads/checkpoint/phase-3.3.3`=`4a250a8` + `.git/refs/remotes/origin/main`=`f014450` + the linear chain in `.git/logs/HEAD`, all read directly, 2026-09-23 — **this corrects the main agent's stated "5 commits ahead" for this same batch; the two round-open docs commits below were omitted from that count, see doc-keeper's report**]:
  `51c4a94` docs — HANDOFF v44, leftovers merged/round 6 opened · `b7720cd` docs — HANDOFF §16, scope call answered · `8f6a8ae` feat(i18n) B1 — age gate copy th/en/zh · `da1b3a4` chore(scripts) B1 — AgeGate row deleted from thai-leak-scan.js · `aaa0a45` docs — HANDOFF §16, round 6 open/B1 closed · `c3eb1ae` fix(ui) B3 — LINE label, grid column replaces max-width cap · `4a250a8` fix(ui) B5 — age gate buttons stack, overlay scrolls.
  Nothing pushed — round 6's stop point is before push (§17 / owner instruction file).
3 round: **"about3lang" (round 6) — OPEN 2026-09-23 on base `f014450`. Batches B1, B3, B5 CLOSED. B2 and B4 OPEN — that is where the round stops.** Read `_incoming/about3lang/round-open-notes.md` first, then `scope-auditor-result.md` (full round-open history, not restated). **The one scope-auditor call for this round is spent — do not repeat it.** Sitemap 99 paths, `sitemap-99-paths.txt`. Goal: (1) `/about` in th/en/zh, no Thai leak on en/zh (2) age gate en/zh, group ก opened for translation only, Thai unchanged (3) floating LINE label not clipped. Batches: B1 age gate en/zh · B2 `/about` 3 languages · B3 LINE label cap · B5 (owner-added 2026-09-23) age-gate button layout — all tier B · B4 delete the `about/page.tsx` ALLOW row from `thai-leak-scan.js`, tier A, last.
  **B1 CLOSED** — full detail in commits `8f6a8ae`/`da1b3a4` + `_incoming/about3lang/b1-evidence.md`, not restated (cap). Summary: 6 Thai literals moved into `src/i18n/age-gate-copy.tsx`; Thai byte-identical (md5 `d2f9730ae447ed8c603470323c67f4f6`); no Thai flash, 3 runs; AgeGate's row deleted from thai-leak-scan.js.
  **B3 CLOSED** (checker PASS, designer PASS [เชื่อว่า] — `_incoming/about3lang/brief-checker-b3-b5.md` sent, no saved close-report found this batch, same as B1). `LineContact.tsx`: reveal changed `max-width:0→9rem` to a grid column `0fr→1fr` — open width is now the label's own max-content width, nothing left to cap wrong. Cowork's 9rem→11rem suggestion deliberately NOT taken (still a guess) — logged as the main agent's 13.10 #2 call. Measured, pill genuinely open at 1440 [ตรวจแล้ว, `_incoming/about3lang/b3-b5-evidence.md`]: th 113.42px / en 80.80px / zh 62.44px, `scrollWidth===clientWidth` all three.
  **B5 CLOSED** (NEW batch, owner-added 2026-09-23; checker PASS, designer PASS [เชื่อว่า], same source as B3). `AgeGate.tsx`: buttons stack at every width (card is `max-w-md`=448px at every width, side-by-side gave ~218px/button, Thai decline label wrapped); confirm button gets `border border-transparent` to match the bordered decline button's height (was 44 vs 46px); overlay `overflow-y-auto py-8`, card `my-auto` (the fixed unscrollable overlay was cutting the card off on a short viewport with no way to reach either button — predates this round, B5 made the card ~58px taller, hence fixed here). Proof [ตรวจแล้ว, `b3-b5-evidence.md`]: 18 button measurements (390/640/1440×th/en/zh×2) all 46px single-line · viewport probe (390×360 th/en/zh + 320×320 th): `allReachable` false→true, decline button was at 343–389px in a 360px view before · dialog `textContent` md5 `1d836fa4` unchanged from the B1 build (HTML around the buttons DID change, by design; proof moved from HTML to text) · `git revert --no-commit 4a250a8` applies clean, touches only `AgeGate.tsx` — B5 undoable without touching B1.
  B3+B5 gates so far (uncommitted-diff level): tsc clean · eslint clean · `next build` exit 0 [ตรวจแล้ว, `b3-b5-evidence.md`]. Full gate set + verify is round-close's job.
  **B2 — `/about`, three languages, tier B. OPEN, not started.** Notes the next chat should not re-derive: (a) `src/app/about/page.tsx` is a Server Component, no `"use client"` → `useLocale()` unavailable there; body must move into a client component, brands list passed as props. (b) only the Compliance paragraph and each brand lede run through `<ThaiText>` today; everything else is raw — which strings get it must survive the move or Thai silently changes (B1's trap). (c) the proof shape that worked in B1: md5 of rendered Thai HTML before/after.
  **B2 also carries a `src/data/brands.ts` fix** (owner ruling 2026-09-23): SALTHUB's lede "มีครบทั้งเครื่องและหัวพอต" (`brands.ts:37` [ตรวจแล้ว, grep]) breaks the no-completeness-claim-about-stock rule — fix at source. `brands.ts` is in-scope for B2 **for that one sentence only**. New wording via `writer`+`thai-copy`; must prove all 18 pages the field feeds (about + 17 `/brands/[slug]`, plus metadata/JSON-LD on 13 of them — 4 have `BRAND_HEAD_TH` overrides); before→after pair goes in the report. A scan for the same shape (`มีครบ|ครบทุก|ครบทั้ง|ครบครัน|ครบไลน์` over `src/data/`+`src/i18n/`) returns only this hit — `th.ts:264` and `technology-copy.ts:84` are a different kind of sentence, NOT to be touched.
  **B4 — delete the `about/page.tsx` ALLOW row from `scripts/thai-leak-scan.js`, tier A, last.** [ตรวจแล้ว, file read directly — ALLOW list today holds exactly this row plus the unrelated `/preview` row]. AgeGate's row is already gone (landed inside B1).
  **Owner rulings 2026-09-23 (do not re-ask, 13.10 #12), add to round-open list:** (1) en/zh age-gate wording in the B1 table — APPROVED (2) the dialog's nicotine sentence does NOT get the word-joiner treatment the identical `/about` sentence gets under `thaiTypographyDeep` — closed, stays a plain group-ก string (3) the Thai two-line button was to be fixed this round, the dialog layout opened for exactly that, on condition it be revertable alone — done, B5 (4) the collapsed LINE pill (56×48, icon off-centre because `gap-2` stays while the label column is 0 wide) is NOT this round's work — owner has it on their own list; known one-line fix if wanted: `gap-0 group-hover:gap-2 group-focus-visible:gap-2` (5) new standing habit: the main agent keeps its own "what worked" log in the session memory folder, not in docs/.
  Previous rounds — full detail in §3, not restated (cap): leftovers (`leftovers-done`=`e1377c2`, PR #48) · backlink (`backlink-done`=`90d78d4`, PR #47) · share-deadend (`share-deadend-done`=`b8e2fd0`, PR #46) · search-price (`search-price-done`=`5e9fd24`) · SEO ข (`seo-b-done`=`fdad0b2`) · SEO ก (`seo-a-done`=`68e2a14`). Permanent SEO ข rulings unchanged (13.10 #12): gate 11 — every "ร้านเรา/ที่ร้าน" sentence traces to BSOT or is cut · no completeness claims about stock · no per-model draw-style claims · conflicting numbers cut not fixed · absence claim must trace to a real record field · NEVER_SPLIT typography list ≠ THAI_STYLE §3 word-choice rule · 390px overflow scan is a standing close gate.
4 waiting on the owner: **nothing new this batch.** Round 6's stop point is before push — no owner input needed until B2/B4 close and the round itself closes. Carried: deploy of `f014450` (round "leftovers") still outstanding [รอเจ้าของ]. Unchanged: (ง) add SEO ก's 4 head-copy words to THAI_STYLE §3? recommended not yet, judge after 2026-10-05. Older, unchanged: 9.4 rollback drill · footer.tagline 3-word repeat · zh compat notes ×2 · TPD · #31/#34 iPhone · Render OOM watch · priority ×2 spots · Lighthouse · items 10/13/16/37 · account name · black-pod photos ×18 · R2/B2 · QR library · account 189
  4b ไม่ต้องรอ — เจ้าของตัดสินแล้ว ห้ามถามซ้ำ (carried verbatim): ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม บนหน้าร้าน + เว้นคำ "น้ำยา" ออกจาก head copy จนกว่าหมวดน้ำยาจะมีของขึ้นหน้าร้าน (search results ≠ head copy) · caliburn-g4-pro = Pod-181 · muro-3ml = ฿99 · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · tagline/ตะกร้า/หน้าบริการ = รอบของมัน · CLAUDE.md แก้เฉพาะข้อที่เจ้าของเคาะ · ใส่กฎใหม่ = ลบกฎเก่าเรื่องเดียวกันทุกที่ (ยกเว้น §1–§11) · ชั้น 9 ก๊อปไฟล์นอกรีโปก่อนแตะ · ชั้น 10 รวม/ลบกฎต้องกางเต็ม · `readMoreEyebrow` = "อ่านต่อ" ไม่ใช่ `footer.learn` (backlink round, 2026-09-22) · คำที่ใช้อยู่บนเว็บแล้วแต่ยังไม่มีคีย์ = ไม่ใช่คำใหม่ (leftovers round, 2026-09-22)
5 open questions: **round 6 B1-close questions — RESOLVED by the 2026-09-23 owner rulings in item 3 above**, kept here one line so the loop stays visible, not restated in full: (i) nicotine-sentence word-joiner — closed, stays plain (j) two-line decline button — fixed, B5 (k) collapsed-pill off-centre icon — deferred, owner's own list, not this round.
  **Resolved, leftovers close (§3) — not restated**: backlink's raw-Thai-on-EN leak · backlink's noindex-in-sitemap finding · search-price's TFIT/INFY deferral. All closed.
  Carried, still open: (f) backlink's "อ่านต่อ" block sits ~5000px down a product page (g) share-deadend's empty-category self-return mechanism [ตรวจแล้ว, `category-visibility.ts`] (h) search-price's per-source-file content-date granularity. Unchanged older: "แถว/บรรทัด" not locked · caliburn-g5↔coil-94 mL disagreement · Finder draw-style unverified · 27 products without a clip · writer's optional VINCI S sentence unused · memory files unaudited by rule-auditor · LAUNCH_AUDIT split proposed, not done · production backup cadence unconfirmed [เชื่อว่า] · overwrite the 20 owner-estimate rows in `legacy-price-approvals.ts` when the stock API lands.
6 verify baseline at last close — **round "leftovers", 2026-09-22** (the only place these counts live), supersedes the backlink numbers [ตรวจแล้ว, doc-keeper read every `close-*.log` + `wb-diff.md` + `sitemap-after.xml` in `_incoming/leftovers/` directly]: tsc clean · eslint clean [inside `close-verify-catalog-full.log`'s own PASS lines] · verify:catalog --full **25/25** (was 24 — new `sitemap-noindex-contract-test.ts` auto-discovered) · verify:commerce **16/16** · thai-leak-scan (new gate) **0 leaks / 149 files**, 37 allowed in 4 ruled files · scan.js **0/99** · og-gate **99/99** · overflow-390 **99/99** · raw-chars **0** · i18n **16/16** · count-storefront **53 shown / 53 buyable** (unchanged) · word-break 5 pages × 390/1440: **0 NEW / 0 FIXED** (13 issue instances before and after, same set) · **sitemap now 99 `<loc>`, down from 103** (this round's item 2). jsonld-all / content-dates --check / article-relevance sub-count: no separate log was saved to `_incoming/leftovers/` this round [เชื่อว่า, inferred from the folder listing — the article-relevance contract test does run inside `verify:catalog --full`'s own step, PASS, no sub-count printed].
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

---

## 17. Standing rules and tools (not state — open when needed)

> Carried over verbatim from `docs/archive/HANDOFF.2026-09-21-v34.md` §17 — this is rules/tools, not round state, and this round did not touch it.

```
Context rule: ~/.claude/CLAUDE.md 13.6 · every push = update §16 (spec in doc-keeper.md) · an agent added or edited under .claude/agents/ is usable at once in the running chat — no new session needed (verified 2026-09-17; the old "needs a new session / HANDOFF 8.6" claim is dead — RULES_INDEX row 25)
Two-tier rule (owner 2026-09-14 — merged here from THAI_STYLE §6 on 2026-09-17, RULES_INDEX rows 50/68; screenshot rule 13.6 points here): tier A = text only → no screenshots, no designer per batch · tier B = touches structure/screen → full: build → shoot before (finish before rebuilding) → shoot after at 390 + 1440 → designer → owner picks → checker → commit · round close = skill `round-close` (scan first, designer once, word-break fixes in one commit — moved there 2026-09-20, RULES_INDEX row 76) · details of the original ruling: §8.0 · every new sentence = 3 languages + owner approves the Thai · every number points at a verified spec row · no U+2060/NBSP outside the mechanism · thaiTypography() must have a locale guard · generated evidence must mirror the component logic in full · forbidden claims: THAI_STYLE §3 "คำ/ประโยคที่ห้ามในข้อความใหม่" (one list)
Do not touch (single list — merged 2026-09-17 from this line, §9 and §14, RULES_INDEX row 55): layout outside the named spot · images · motion · ordering-mode.ts · slug/URL/sitemap/structured data · service pages · Hero.tsx · cinematic/ · THAI_STYLE group ก · labelTh/name/shortName · lg:min-h-10 · age/nicotine warnings · colour/flavour names · thai-typography.ts list · CategoryLabel.tsx / label-lang · card-headline-spec.ts rules · dictionary catalog.card* / trust.* (set ก) · TrustBar row layout / 4 icons · sticky th on /compare · ScrollHintFrame · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools · every THAI_STYLE_LOG §7 row of round 30.4ข · ProductHero stats / PuffCount / Coil-72/89 category (data round) · footer.tagline / service pages / cart (their own rounds) — and never: joiner/NBSP outside the list · two Chrome jobs at once · fixing tier-B orphan words one by one · placeholders in an empty spec row · screenshots without a scan first — the scan-first / ≤30-shots-or-explain rule lives in ~/.claude/CLAUDE.md 13.10 #15 (owner ruling 2026-09-18), not here
Hard rules: merge / deploy / force-push → ~/.claude/CLAUDE.md §8 + 13.7 (not restated here — RULES_INDEX row 45) · revert, never reset · never invent a number · deciding alone = easy to undo + invisible to customers, then write "ตัดสินเอง: … เพราะ …" · when to ask = 13.4 only (RULES_INDEX row 3) · work beyond the brief = its own commit
  · checker reports in the five fields of 13.5 + the Thai-copy gates = skill `thai-check` (checker.md item 5 points there; the checker reads the SKILL.md file — moved 2026-09-20, RULES_INDEX row 77) · who edits files = 13.5 (RULES_INDEX rows 13/52/58/59)
  · ปิด server: netstat -ano | grep ":3412.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด · Chrome ทีละงาน · งาน >10 นาที = (cmd &) + เฝ้า log
  · สคริปต์เขียนด้วย Write tool · ข้อความไทยเข้าสคริปต์ทางไฟล์ json/txt เท่านั้น (argv mangled) · shot.js ห่อผล eval JSON 2 ชั้น (parse ซ้ำ) · CRLF: ไฟล์ใหม่จาก Write = LF → unix2dos ก่อน git add · ตรวจ git ls-files --eol · Git Bash แปลง arg "/" → MSYS_NO_PATHCONV=1

เครื่องมือ (_incoming/30.4b): shot.js (scripts/) · k3-shots.js <before|after> [--only …] [--locale …] (ครอปหัวหน้า+วัดบรรทัด) · k3-variant.js <json> (ลองคำใหม่ไม่ต้อง build) · k4-eyebrow-pairs.ts · k4-shots.js <tag> [--faq-file f] [--search-file f] · k5-shots.js <tag> [--variant row|cards] [--short] [--only w] [--locale l] · k6-shots.js <tag> (sticky /compare + hover จำลอง) · k*-sheets.js (ภาพรวม before/after) · scripts/wordbreak-scan.js --base … --widths 390,1440 --out _incoming/30.4b/wb-<tag> /path… (MSYS_NO_PATHCONV=1) → node scripts/wb-diff.js <before> <after>
  · .claude/launch.json ("vapor-dev", port 3000) is the owner's own dev server — agents never start it (RULES_INDEX row 16) · test server: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: the full set with its commands = skill `round-close` step 3 (a batch runs the subset its checker gate needs) · pass = what each script prints · the counts last seen at a close = §16 item 6 "verify baseline at last close", not a rule text (moved 2026-09-20, RULES_INDEX row 78)
Git: commit split by type per 13.7 (English prefix feat/fix/copy/data/docs/chore/agents/rules) · git commit -F <file> · English · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push/merge/deploy rules = 13.7 (RULES_INDEX rows 2/14/45)
agent (เพิ่ม 2026-09-17): rule-auditor (opus · เรียกเมื่อเปิดรอบเก็บบ้าน/ก่อนเพิ่มกฎ · read-only) · scope-auditor (sonnet · เรียกเมื่อเปิดรอบ ครั้งเดียว · read-only) · doc-keeper (sonnet · เรียกเมื่อปิดก้อน · เขียนได้เฉพาะ docs/) — เงื่อนไขเรียกข้อเดียวอยู่บรรทัดแรกของแต่ละไฟล์ · ห้ามเรียกทุกหัวข้อย่อย
tag: command and sequence = skill `round-close` step 5 (rule in 13.7; name table in docs/RECOVERY.md §2 — moved 2026-09-20, RULES_INDEX row 75)
```

---

## First things the next chat should do

1. **`git fetch` + `git status` + `git log -5 --oneline` + `git tag -n1`**, then compare with §16 above — if they differ, trust the repo. In particular, confirm `origin/main` really contains local HEAD `9bcb3df` as an ancestor (via `git log origin/main..HEAD` printing nothing): this file's writer (doc-keeper) could read the raw ref hash but had no tool to walk commit ancestry or decode the merge commit's message.
2. If `origin/main` matches §16 item 1, there is nothing left to probe from this round except Cowork's post-deploy GSC steps (§4, §13) — the only open work otherwise is the three owner decisions in §7/§16 item 4.
3. **No round is open.** Do not start the next one on your own — wait for the owner to pick articles vs "SEO ข" (§7(ค)) and attach an instruction file → skill `round-open`. When it opens, run `scope-auditor` once and read `docs/THAI_STYLE.md` only if the round touches site copy.
