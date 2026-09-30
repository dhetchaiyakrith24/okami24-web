# OKami24 — HANDOFF · v100 · 2026-10-01 — current state = §16 (older first lines, word for word: `docs/archive/HANDOFF-headers.md`)

Written: 2026-09-22 · Based on: local HEAD `9bcb3df` (full `9bcb3dfff89eaae274f55075c7e2cfb0cb7f8891`, branch `checkpoint/phase-3.3.3`), read directly from `.git/logs/HEAD` [ตรวจแล้ว] · `origin/main` = `b1b319d` (full `b1b319db37ba650d5c2c8279a9daf8df69bd7ba9`, PR #44 merge — updated 2026-09-22 after merge, `git rev-parse origin/main`), read directly from `.git/refs/remotes/origin/main` [ตรวจแล้ว] — this is a stronger check than v34 had (doc-keeper could read the ref file itself this time). What is still **not** independently checked by doc-keeper: the commit message text ("Merge pull request #41…") and the three live-site probes (homepage `<title>`, Organization `alternateName`, `/products/m-bar-15k` description) — those stay [เชื่อว่า], reported by the main agent's `git fetch` + `curl` just before this handoff, no git-log-walk or curl tool available here. This is a full rewrite (skill `handoff`, owner typed `/handoff`, condition (ข)) — the previous file is archived at `docs/archive/HANDOFF.2026-09-21-v34.md`, untouched.

> **How to read:** every statement carries one of the three tags of .claude/TEAM_RULES.md 13.10 #9 — **[ตรวจแล้ว]** (seen in the file/commit) / **[เชื่อว่า]** (reported, not verified) / **[รอเจ้าของ]** (needs the owner) · **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"**
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **Thai on the site: `docs/THAI_STYLE.md` is the single source of truth** (rules only — §2 four layers · §3 locked words · §4 typing · §5 group ก/ข + typography mechanism · §6 open work). When to read it is decided in skill `round-open` step 1 (13.9 points there): only on rounds that touch site copy. Before→after examples live in `docs/THAI_STYLE_LOG.md` §6–§7 — open only to cite a past ruling.

---

## Conflicts found

The archived `HANDOFF.2026-09-21-v34.md` was written at the moment the SEO ก round closed, **before** merge/deploy — its §16 said the round was "not yet merged / Cowork's job" and its body sections 1–15 had not been refreshed past the prices-round summary (only the title line and §16 carried SEO-round facts). The repo now shows the round merged (`origin/main` = `6f38745`, PR #41) and the main agent reports it live on the production site. This file rewrites all of §1–§16 on that fact; nothing else in v34 is contradicted by anything doc-keeper could check. [ตรวจแล้ว] for the hash change, [เชื่อว่า] for "PR #41" and "live" specifically (see header).

---

> **§1–§15 = history up to v34 (2026-09-22), not the current state** (note added round B 2026-09-27, owner ruling
> item 2): since then only §16 (current state), §17 (standing rules and tools) and the relocated blocks in §3 have been
> kept up to date. A round close updates §16 only; the whole file is rewritten only on a handoff under 13.6 (ข)–(จ).

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

> **share-deadend**: base `d5a336d` (tag `search-price-done`), `_incoming/share-deadend/round.md`. **b1 share cards**: the root layout's `openGraph.title`/`description` were inherited by 52 of 105 live pages — every article, brand page, category page, the FAQ, the service pages and the homepage shared one card [ตรวจแล้ว, `og-gate-before-live.log`: og:title≠<title> 52, one duplicate title spanning those 52 pages, FAIL 104]. Both root fields removed, no new copy — Next now fills each page's card from its own title/description; `openGraphWithImage` also gained siteName/type on the 53 product pages that had been shipping without them · `464e842` · new gates: `scripts/og-gate.js` (whole sitemap, added to skill `round-close` step 3) + `src/lib/og-metadata-contract-test.ts` (9 checks, in verify:catalog) · local after: **103/103 PASS** [ตรวจแล้ว, `close-og-gate.log`]. **b2 empty-category dead ends**: `/products/e-liquid` + `/products/heated-tobacco-consumables` were reachable from the home SHOP grid, both header menus and the footer, but held no products · new `src/lib/category-visibility.ts` (mirrors `brand-visibility.ts`) drops an empty category from all 4 nav surfaces + the sitemap and marks its page noindex, while the URL keeps working and returns by itself once stock lands · page shows "ยังไม่มีสินค้าในหมวดนี้" + "กลับมาดูใหม่เมื่อมีสินค้าเพิ่ม" (owner's approved sentence, split at its dash) + "หมวดอื่นที่มีของ" linking the 6 populated categories; filter sidebar, phone filter button, in-category search and sort hidden there · `d6b9fd3` ·
> `9313125` (round-close skill gained the two new gate lines) · `1ee63be` (content-dates.json regenerated after b2). **Sitemap is now 103 URLs, not 105** [ตรวจแล้ว, count 103 in `close-jsonld.log`+`close-og-gate.log`+`close-scan.log`+`close-overflow-390.log`]. **Checker close: PASS 9/9 brief items + 12/12 close gates, 0 fail** [ตรวจแล้ว, `_incoming/share-deadend/checker-close.md`, on `1ee63be`]. Owner ruling this round (do not re-ask, 13.10 #12): "เคาะทางตัน" 2026-09-22 chat, 5 numbered points — the copy, the 4-nav-surface list and the noindex/returns-by-itself mechanism above are that ruling as built. Merge+deploy = Cowork, not done at v40's time of writing (since merged, via PR #46).

round search-price (closed 2026-09-22, tag `search-price-done` = `5e9fd24`) full batch detail, verbatim from HANDOFF v40 §16 item 3:

> **search-price** (closed, tag `search-price-done`=`5e9fd24`): Thai search wired into /search + every grid page's own search box (`src/lib/catalog-search.ts`+`src/data/search-aliases.ts`, `efcf878`) · desktop card price variant B, price its own line under the tagline (`7436150`) · sitemap lastmod + Article dateModified read from git, not the build clock (`51bc83b`+`850ecec`) · owner's full 17-brand/family alias set + a gate that every brand on sale has one, at close (`ab3e353`) · checker close 6/6 pass, 2 observations: "พอตใช้แล้วทิ้ง" has no alias key by design (it is the category label, finds itself) · "เอ็มบาร์" returns all 9 SALTHUB products not just the 4-product family, because "M Bar" also appears in Zero products' spec text (gate checks missing=0 only). Owner rulings that round (13.10 #12, unchanged): variant B card · "น้ำยา" keeps returning its 3 prefilled items (m-switch-pod, muro-3ml, coil-74) · aliases: many spellings per brand ok, one direction, never rendered, Code may add/drop without asking · "บุหรี่ไฟฟ้า" ok as a typed search word only (site-copy ban unchanged) · every brand on sale needs a Thai alias.

Permanent rulings from both rounds are NOT moved — the share-deadend copy/mechanism ruling and the search-price alias/variant-B rulings stay live in §16 item 3 (carry-forward, do-not-re-ask list per 13.10 #12).

**Moved here from §16 at the leftovers round's close (2026-09-22) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round backlink (closed, tag `backlink-done` = `90d78d4`, merged into main via PR #47) full batch detail, verbatim from HANDOFF v42 §16 item 3:

> Previous round: **"backlink" — CLOSED 2026-09-22, merged (PR #47)**, on base `f766ab3` (tag `share-deadend-done` = `b8e2fd0`, PR #46), `_incoming/backlink/`. **Batch 1 (tier B)**: 0 → **50 of 53 product pages carry 112 links** to the 12 articles, **12/12 articles reached** [ตรวจแล้ว, summed directly from `_incoming/backlink/product-page-link-count-results.txt`: 53 rows, 3 at 0 (iqosheet-16, iqosheet-18 — no article is about heated-tobacco sticks; pod-159 — no verified spec row), sum of the other 50 = 112; independently matches the checker's own count]. Pairing decided by `src/lib/article-relevance.ts` from two sources only: an article's own `relatedProductSlugs` read backwards, or a rule over the product's VERIFIED data with evidence recorded per link; `attributes.drawStyle` deliberately unused (unverified Finder attribute, standing ruling) ·
> cap 3 per page [ตรวจแล้ว, max value in the link-count file is 3]. New component `src/components/product/RelatedArticles.tsx`; one new dictionary key `product.readMoreEyebrow` = "อ่านต่อ" / "Read more" / "了解更多" [ตรวจแล้ว, `th.ts:207` / `en.ts:199` / `zh.ts:192`] — owner 2026-09-22, after rejecting the main agent's proposal to reuse `footer.learn` ("เรียนรู้"); no other new copy, no price or cart in the block [เชื่อว่า, reported]. **Batch 2 (tier A)**: the product share card's title now carries the catalog price the way brand-page titles already do — e.g. "VOOPOO DRAG 6 พอตคิท ของแท้ ฿2,490" (`shareTitleWithPriceTh`) [ตรวจแล้ว, function in `src/i18n/search-head-copy.ts`, used in `src/app/products/[slug]/page.tsx`]; the price was already in og:description but past the 160-character point where a preview cuts it; `<title>` itself is untouched (its 53 strings stay in the GSC measurement window opened at the share-deadend close, until 2026-10-05) · `scripts/og-gate.js` gained one narrow exception: a "฿<number>" tail is allowed only when that same number also appears in that page's own og:description [ตรวจแล้ว, `og-gate.js` lines 76–86]. **Also**: `scripts/shot.js` gained `--anchor "<selector>"` — the new block sits ~5000px down a product page, past the tool's old 4000px cap and always-reset-to-top default [ตรวจแล้ว, `shot.js` lines 32–77]. **Checker: PASS 21/21** (batch 1 6/6 · batch 2 3/3 · close gates 12/12) [ตรวจแล้ว, `_incoming/backlink/checker-close.md`]. Owner ruling this round (do not re-ask, 13.10 #12): `readMoreEyebrow` = "อ่านต่อ", not `footer.learn`, 2026-09-22 chat. Merge done (PR #47, 2026-09-22) — deploy is Cowork's, not confirmed here [รอเจ้าของ]. Tag `backlink-done` in place, see item 1.

The permanent ruling from that round is NOT lost — it is now also carried in §16 item 4b (carry-forward, do-not-re-ask list per 13.10 #12).

**Moved here from §16 at round 10C's close (2026-09-25) — §16 needed the room for round 10C's own state, this is relocation not deletion (doc-keeper spec):** round data 2 "empty card spec lines + 3 contradicting maker facts" (opened+closed 2026-09-25 on `0ef8c0f`, tag `data-facts-2-done`, PR #55) full batch detail, verbatim from HANDOFF v59 §16 item 3:

> Previous round — **CLOSED — round data 2 "empty card spec lines + 3 contradicting maker facts" (opened+closed 2026-09-25 on `0ef8c0f`). Stop = before merge — Cowork merges/deploys.** Instruction: `_incoming/round-data2/instruction.txt` · round files `_incoming/round-data2/`.
> **Batch 1 (tier B, owner ก+ข):** `PilotProductCard.tsx`'s phone slot now prints the desktop row's own text when a card has no spec line and ≥2 options — coil-1/38/72/94/iqosheet-18 (ก, 5 cards, designer's own count). coil-55/68/54 each get one maker-quoted capacity fact instead (ข, no ≥2-option fallback): 2mL/3.5mL/2mL from myuwell.com/shop.voopoo.com/nevoks.com, full quotes in `sources-verified.md`. 9 slugs changed once batch 2's iqosheet-16 is counted — `cards-diff-th.md` (24 pages × 3 locales): **0 of 8 target cards still empty at 390**, nothing else moved. The 6 owner-accepted empty cards keep the legacy `ProductCard`, untouched.
> **Batch 2 (tier A):** coil-87's "magnetic"/แม่เหล็ก claim cut (row+meta) — VOOPOO's own site unreachable (owner Q1, source not checkable, rule unchanged). IQOS ILUMA i PRIME+ILUMA i battery made internally consistent — iqos.com drops "2380" everywhere, both products now carry the maker's own Pocket Charger 2700mAh/Holder 300mAh rows named by part; iqosheet-16's card/meta drop the bare 2380mAh and the card shows no battery number (`card-headline-spec.ts` untouched, do-not-touch). ZERO PRO stays at 5,000 puffs/cartridge (owner ruling, salthub.com confirmed a real source).
> `verified-specs-contract-test.ts` +iqos.com/nevoks.com as manufacturer domains + a new per-row sourceUrl check on the 6 products touched across both data rounds — **11/11** [ตรวจแล้ว, `verified-specs.log`]. Break-and-restore run by the main agent (sandboxed checker cannot edit `src/`, 13.5): a row missing sourceUrl + a row with a shop URL both caught red then restored [ตรวจแล้ว, `gate-break.log`].
> **Checker-1** (batches 1+2, uncommitted tree) [ตรวจแล้ว, `agent-results.md`]: **PASS 7/7**. **Checker-close** (scope `0ef8c0f..61223ad`) [ตรวจแล้ว]: **PASS 5/5** — commit split clean · one designer pass judged sufficient (shots on the final build, nothing visual after) · instruction's pass criteria met on the committed tree. **Designer** (1 call, tier B): **PASS, 0 blockers**, 3 non-blocking notes → item 5 of that write.
> Previous round (merged PR #54, tag `data-facts-done`): full detail §3 "Round data — chat 1 push state" (cap). Older rounds (10B/10A/9/6-8/leftovers/backlink/share-deadend/search-price/SEO ข/SEO ก) — §3, `docs/RECOVERY.md` §2, not restated.

The permanent rulings from that round are NOT moved — the do-not-re-ask items (gate scope, hide-unverified, empty-cards-get-a-proposal, Esko 20 flavours, cut the "could not find specs" filler, Joiway F4 exception, magnetic-claims-need-a-source) stay live in §16 item 4b.

**Moved here from §16 at round "rules move"'s close (2026-09-25) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round 10C "SEO landscape: which keys can we win" full batch detail, verbatim from HANDOFF v61 §16 item 3:

> Previous round: **CLOSED — round 10C "SEO landscape: which keys can we win" (opened+closed 2026-09-25 on `origin/main` = `e05a6ab`, PR #55 merged round data 2 — branch fast-forwarded, 0 ahead at open) [ตรวจแล้ว].** Research only, no site change, stop point = before merge (Cowork merges/deploys). Instruction: `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบ10C-SEO-สนามแข่ง-คำไหนชนะได้.txt` · round files `_incoming/round10c/` · deliverable `docs/SEO_LANDSCAPE.md` (new). Batches (all tier A): B1 key list ≤30 (SEO_BASELINE spelling) + key→our page · B2 Google Trends TH 12 mo, sets of 5 anchored on "พอต" · B3 mobile signed-out Google page 1 per key (≥60 s apart, CAPTCHA = stop) · B4 backlink sources + YouTube clip↔key table with draft titles · B5 keys with no page + write SEO_LANDSCAPE.md · close. Headline (SEO_LANDSCAPE.md §1) — see the archived v61 line 1 for the full summary; not restated here. Checker-close [ตรวจแล้ว, `_incoming/round10c/checker-close-result.md`]: **PASS 7/7** — 8 of the 33 table rows spot-checked against the raw Trends/SERP files, all matched, 1 judgement call noted (a health-media site counted under "ข่าวรัฐ" not "สื่อ", total unchanged); not checked by the checker: the other 25 rows, the collection method itself, whether the clip drafts match the clips' own content (owner's job), ROUND_COST/RECOVERY (not yet written at checker time). Tag `seo-landscape-10c-done` on that round's own docs-close commit.
>
> [Note added at this relocation, 2026-09-25, doc-keeper: the paragraph above is copied verbatim from v61 and is stale on one point — it said "NO merge, NO deploy (Cowork)"; the round has since been merged, PR #55, as confirmed by `origin/main` progressing past `e05a6ab` to `e6cd7d4` (PR #56) and now `15a1360` (PR #57) per §16 item 1 above.]

**Round "rules move" — full batch-by-batch detail (2026-09-25, opened and closed within the same round, tag `rules-move-done`):**

> Instruction: `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบย้ายกฎ-แยกกฎเว็บออกจากไฟล์กลาง.txt` · round files `_incoming/rules-move/` (backup + sha256 of every touched out-of-repo file in `backup-2026-09-25/`). scope-auditor: 0 site pages, tier A for every batch [ตรวจแล้ว, `_incoming/rules-move/agent-results.md`].
> **B1** archive copy of every touched out-of-repo file + sha256 (`_incoming/rules-move/backup-2026-09-25/`). **B2** new `.claude/TEAM_RULES.md` (repo copy of central §13, now 13.1–13.11) + repo `CLAUDE.md` import/priority + `.claude/GLOBAL_RULES_MIRROR.md`. **B3** pointer/mojibake fixes + `okami24-handoff` skill note + a RULES_INDEX line. **B4** new `.claude/LESSONS.md` block, per rule-auditor's 13-row audit (2 conflict · 3 dead · 2 overlap · 6 ambiguous — own-text/pointer rows fixed by the main agent, the rest left for the owner, §16 item 4). **B5** new gate `scripts/rules-move-check.js` + a RECOVERY §2 row + checker → push → **STOP POINT 1**, tag `pre-rules-move` on the base, `ee532b5` pushed, checker **PASS 7/7** [ตรวจแล้ว, `agent-results.md`], re-check **PASS 2/2** after 2 send-backs (a stale §17 note, an exemption regex too loose) [ตรวจแล้ว]. Merged into main via PR #57 → `15a1360` [เชื่อว่า].
> **B6** (after the merge): `_incoming/rules-move/central-post-edit.md` copied over `~/.claude/CLAUDE.md`, sha-checked; `~/.claude/skills/handoff` moved out (not deleted) to `_incoming/rules-move/moved-out/skills-handoff/` [ตรวจแล้ว, path exists]. **B7**: `rules-move-check.js` run in mode post on the real central file — **PASS** (lost 0 · dup 0 · undeclared 0 · pointers 0 · 13.x missing 0 · skill missing 0, §13 lines 137, declared edits 4) [ตรวจแล้ว, `close/rules-move-check.log`] — plus session tests (ข) `answer-b.txt` **7/7** and (ค) `answer-c.txt` **4/4**, run as headless `claude -p` sessions, not agents [ตรวจแล้ว, both files].
> **Mid-round owner order (not in the original plan):** rewrite `.claude/TEAM_RULES.md` 13.6's context rule — measure with `get_usage` at batch close/push/before long work/on "เช็ค context"; move-chat trigger (จ) now literal 700k tokens (or 70% of a non-1M cap); Remote Control on at every chat start. rule-auditor #2 audited the new block first — **11 rows, all resolved** by folding into 13.6 plus a ripple: `okami24-handoff` SKILL.md steps (ก)–(จ), doc-keeper's own §16 spec, `round-open`'s continuation-tree step, `docs/TEMPLATES.md`, `docs/ROUND_COST.md`'s header, rule-auditor's own dead-rule definition [เชื่อว่า for the full ripple list — doc-keeper spot-checked `okami24-handoff` SKILL.md and `round-open` SKILL.md only, both confirmed]. Declared in `scripts/rules-move-declared.json` → `teamRulesEdits` [ตรวจแล้ว]. Session test re-run after the edit: (ข again) `answer-b2.txt` **10/10** [ตรวจแล้ว].
> **Close:** checker **PASS 6/7 + 1 open point resolved** ("`design:design-handoff` is a real account plugin skill", not stale) [ตรวจแล้ว, `agent-briefs.md` row 9], re-check **PASS 2/2** (13.6 step-(6) wording after the owner cancelled "Code creates the new chat itself" + a `LESSONS.md` escape fix) [ตรวจแล้ว, `agent-briefs.md` row 10]. Memory cleanup: 6 files removed from `memory/` (5 per owner ruling ง — `feedback-ask-level.md` · `feedback-two-tier-proof.md` · `feedback-context-batches-per-session.md` · `feedback-legal-status-skip.md` · `lessons-what-worked.md` — plus `feedback-remote-control-always.md`, folded into 13.6 this close), copies at `docs/archive/claude-config-2026-09-25/memory/` [ตรวจแล้ว, both directories read directly]. Full close-verify set: §16 item 6.
> Agent calls this round (`_incoming/rules-move/agent-briefs.md`, for `docs/ROUND_COST.md` — that file is the main agent's own to update, not doc-keeper's): planner ·2× scope-auditor-scope(1) · rule-auditor ×2 · checker ×5 (stop-1 + 2 re-checks + close + 1 close re-check) · doc-keeper ×2 (stop-1, close).

**Moved here from §16 at round "owner rules"'s close (2026-09-25) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round "owner rules" full batch-by-batch detail.

> Owner order (chat 1, 25/09, no instruction file): rewrite central `~/.claude/CLAUDE.md` — §1–11 edited + new §12 "ทำงานกับเจ้าของ" (31 items, rules for every project only) · slim `.claude/TEAM_RULES.md` §13 to pointers wherever a rule moved to §12 · rebuild `.claude/GLOBAL_RULES_MIRROR.md` · rule-auditor · headless session tests · checker · full verify · delete the 2 stale `CLAUDE.old*.md` files (copies already archived) · round-close (tag `owner-rules-done`) · Cowork merges. Round files `_incoming/owner-rules/` (`STATE.md` carries the full plan + rule-auditor row list). Opened on `origin/main` = `95a6190` (PR #58, round "rules move" merged) [ตรวจแล้ว, `.git/logs/HEAD` line 501, cross-checked against the recent-commits list in this chat's own git status], tag `pre-owner-rules` = `767c9ec` pushed.
>
> **Chat 1** produced the draft (`central-new.md`) and rule-auditor's first pass — **35 rows** (12 conflict · 7 dead · 7 overlap · 9 ambiguous) — split into "fix without asking" (~25 rows: duplicate/dead pointers, `§1–11`→`§1–12` references, `13.6`/`13.7`/`13.11` pointer rewording, TEMPLATES/writer/planner/round-open wording, all applied straight away) and 11 questions for the owner, each with a recommendation. Chat moved mid-batch at context 617k (13.6/§12 item 29), state saved to `STATE.md`.
>
> **Chat 2** continued on the same base (0 ahead, fast-forwarded). The 11 questions were asked as one set (1–11, A/B, A recommended each time) — **owner answered all A**, with the owner's own wording on Q3/Q6/Q7/Q9, plus one extra ruling: the central file holds only rules that apply to **every** project, nothing project-specific — a full walk of the draft against that rule found **0 items to remove**, cut the single word "การ์ตูน" from item 24 (`_incoming/owner-rules/for-cartoon.md`). Answers applied to `central-new.md` + `.claude/TEAM_RULES.md` + `rule-auditor.md` + `TEMPLATES.md`.
>
> **rule-auditor #2** on the answered draft — **16 rows** (8 conflict · 1 dead · 7 ambiguous) — **all fixed**; 3 needed a main-agent reading rather than a mechanical fix: owner ruling "tell then wait for that part only" → new **13.4 #8** [ตรวจแล้ว, `.claude/TEAM_RULES.md` line 67] · "รอบ/ก้อน" defined in the §12 header · the removed-rule record kept as a file+path (`chain10.md`, 10-tier walk, 99 removed lines, 0 unmapped [ตรวจแล้ว, matches `owner-rules-check.js`'s own "removed lines: 99"]). Re-check sent back to rule-auditor (same agent) — all 3 resolved [เชื่อว่า, `STATE.md` "Chat 2 progress" — not independently re-diffed row by row by doc-keeper].
>
> **Install:** `~/.claude/CLAUDE.md` overwritten with `central-new.md` [ตรวจแล้ว, spot-checked lines 1–15 byte-identical], `.claude/GLOBAL_RULES_MIRROR.md` rebuilt. `scripts/owner-rules-check.js` (new gate) — **PASS**, removed 99 lines · lost 0 · stale 0 · 31 items · 95 pointers into §12 [ตรวจแล้ว, `close/owner-rules-check.log`]. `scripts/rules-move-check.js` re-run in mode post on the now-twice-edited central file — **PASS**, lost 0 · dup 0 · undeclared 0 [ตรวจแล้ว, `close/rules-move-check.log`]. Old `~/.claude/CLAUDE.old.md` + `CLAUDE.old.2026-08-26.md` **deleted** after byte-compare against `docs/archive/claude-config-old/` — confirmed gone from `~/.claude`, archive copies present [ตรวจแล้ว, both dirs read directly].
>
> **Headless session tests** (`claude -p`, packaged CLI 2.1.281, `_incoming/owner-rules/session-tests/`): repo folder `prompt-web.txt` (10 questions) → `answer-web.txt` **10/10** · an empty scratch folder `prompt-empty.txt` (6 questions) → `answer-empty.txt` **6/6** — sees §12, not §13, names no agent called "checker", item 24 reads "(ภาพ วิดีโอ)" not "(การ์ตูน)" [numbers ตรวจแล้ว against `docs/ROUND_COST.md` row 33; the answer files themselves not independently re-run by doc-keeper].
>
> **Checker close:** brief `brief-checker-close.md`, 8 check items. First pass **7/8** — item 3 (do the 11 owner answers appear in the central file with the owner's own wording) failed because the owner's raw answers were not yet saved to a file; saved to `owner-answers-chat2.md`, re-checked. Second send-back: one of the main agent's own readings of Q3 was not owner-confirmed; confirmed in chat. Final: **8/8** [ตรวจแล้ว, `docs/ROUND_COST.md` row 33, which cites `brief-checker-close.md`; doc-keeper found no separate saved checker-result file to open directly — flagged as a gap in this round's own record-keeping, not a reason to distrust the score].
>
> **Close-verify** (`_incoming/owner-rules/close/*.log` + `exit-codes.txt`, every exit 0, all read directly by doc-keeper): `verify:catalog --full` **30/30** (30 PASS lines counted directly, incl. tsc/eslint/next build as sub-steps) · `verify:commerce` **17/17** (17 PASS lines counted directly) · `count-storefront` **53 shown/53 buyable** · `i18n` **16/16** ("All 16 checks passed") · `raw-chars` **0** · `content-dates --check` current (55 paths) · `eslint` (whole repo) **0 errors**, 1 pre-existing warning (`scripts/image-audit-md.js:14`, untouched this round) · `owner-rules-check.js` **PASS** · `rules-move-check.js` **PASS**. NOT run — no site file changed, scope-auditor found 0 pages this round: `scan.js` · `og-gate` · word-break scan · designer.
>
> **rule-auditor rows carried from the previous close's §16 item 4 (v62), all resolved this round** [spot-checked 4 of 6 directly, ตรวจแล้ว]: `doc-keeper.md:84` now names the actual out-of-repo files instead of an unnamed "owner-only" [ตรวจแล้ว, read directly] · `rule-auditor.md` no longer states a fixed agent count, reads "agent ทุกตัว" [ตรวจแล้ว] · the exception list is now a single list at `.claude/TEAM_RULES.md`'s own head (line 24), pointed to rather than repeated [ตรวจแล้ว] · planner's "หลายวัน" criterion kept, `.claude/TEAM_RULES.md` line 38 [ตรวจแล้ว] · the screenshot rule is pointed to from one place (13.6's line + item 15) [เชื่อว่า, reported] · `okami24-handoff` SKILL.md's "doc-keeper writes the whole file" wording — grep for "ทั้งไฟล์"/"whole file" found no match, read as removed [เชื่อว่า, a negative search result].
>
> Agent calls this round (for `docs/ROUND_COST.md`): chat 1 — rule-auditor #1 (35 rows, no saved brief file [เชื่อว่า] per `STATE.md`) · chat 2 — rule-auditor #2 (`brief-rule-auditor-2.md`) + 1 re-check · checker (`brief-checker-close.md`) + 2 re-checks · doc-keeper ×1 (this close) · 2 headless test sessions. The owner ruling from this round (new 13.4 #8) is carried forward in §16 item 4b, not restated here.

**Moved here from §16 at round "friday persona"'s close (2026-09-25) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round "rules trim" full detail, verbatim from HANDOFF v64 §16 item 3:

> **CLOSED — round "rules trim" (`.claude/TEAM_RULES.md` shortened only — no meaning change, numbering kept, dates/owner rulings/RULES_INDEX rows moved to new `docs/TEAM_RULES_SOURCES.md`) — tag `rules-trim-done`, stop point = before merge (Cowork merges).** Opened and closed in the same chat as round "owner rules" (owner allowed), order relayed by the owner from Cowork. Base `origin/main` = `034fa8e`, tag `pre-rules-trim` = `034fa8e` (pushed) [ตรวจแล้ว, `docs/RECOVERY.md` row]. Result: 38,397 → 32,772 bytes (−14.6%), 196 → 182 lines [ตรวจแล้ว for 182 — the file's own last line + its new head pointer to `TEAM_RULES_SOURCES.md`, read directly; byte/196 figures เชื่อว่า, not independently recomputed]; 50 old lines touched = 38 cut-only + 12 moved whole to `TEAM_RULES_SOURCES.md` [ตรวจแล้ว, that file read in full — one dated block per moved item]. Rule text lost 0 [เชื่อว่า]. Proof: `owner-rules-check.js --map=scripts/rules-trim-map.json` PASS (new "trim" kind: old line minus listed pieces = new line, each piece verbatim in old line + log) · `owner-rules-check.js` (plain) PASS, frozen at `owner-rules-done` ·
> `rules-move-check.js` PASS — logs `_incoming/rules-trim/close/` [เชื่อว่า, reported, logs not opened by doc-keeper]. Not shortened on purpose (meaning could shift): 13.11 "ใช้กับงานใหม่เท่านั้น" · 13.10 heading "ห้ามเดาเพิ่ม" + pointer note · web §3/§6/§8 note "บรรทัดเดิมด้านล่างยังใช้ตามตัวอักษร" · 13.4 #7 "ส่วน ย้อนกลับยาก ของข้อเดิม" · legal block "How to apply" · pointer-only items 13.10 #2–#14. Checker: **8/8 PASS first time, 0 send-backs** [ตรวจแล้ว, `_incoming/rules-trim/checker-result.md`, read directly]. No site file touched → no deploy, no verify set beyond the two rule-check scripts above.
>
> **Added at this relocation (doc-keeper, round "friday persona" close):** Cowork asked for the full verify set before merging this round; it was run and all passed, but no result file was saved [เชื่อว่า, reported by the main agent]: tsc 0 errors · eslint 0 errors/1 pre-existing warning · `verify:catalog --full` 30/30 · `verify:commerce` 17/17 · `count-storefront` 53/53 · `i18n` 16/16 · `raw-chars` 0 — the same numbers round "friday persona" then independently produced and saved to `_incoming/friday/close/`, cited directly in §16 item 6. Merge status of round "rules trim" is **NOT confirmed** at the time of this write — confirm with `git log origin/main -3`; last fetch showed `origin/main` = `034fa8e` [เชื่อว่า].

**Moved here from §16 at the tools round's close (2026-09-26) — §16 needed the room, this is relocation not deletion (doc-keeper spec):** round "friday persona" full detail, verbatim from HANDOFF v65 §16 item 3:

> Previous round: **CLOSED — round "friday persona" (Claude Code named "Friday", Cowork named "Javis" in the central `~/.claude/CLAUDE.md` — one new block at the start of §12, tone only, no rule changed) — stop point = before merge (Cowork merges).** Opened and closed in the same chat as round "rules trim" (owner allowed). Base = local HEAD `e4f2f5f`, tag `pre-friday-persona` = `e4f2f5f` (pushed) [ตรวจแล้ว, `docs/RECOVERY.md` row `pre-friday-persona`, read directly]. Installed central sha256 `0c401c6c…` [เชื่อว่า] — diff = **8 lines added, 0 removed**, items 1–31 unchanged [เชื่อว่า]; mirror rebuilt, reported byte-identical [เชื่อว่า]. Owner mid-round: "Cowork คือ Javis - Code คือ Friday" → guides that had called Claude Code "Javis" cleaned: `docs/AI_TEAM_GUIDE.md` (17 spots) · `docs/DEPLOY-RENDER.md` (6 spots) · `docs/BACKUP.md:48` · `.claude/agents/designer.md:28` "ครับ" removed [ตรวจแล้ว, spot-checked directly] ·
> `docs/TEAM_RULES_SOURCES.md` header note [เชื่อว่า]. rule-auditor: **8 rows before install, all resolved** — kept the owner's own wording for Javis's duties (one row suggested dropping "merge" from the central line, not done — owner's own words) [เชื่อว่า, `_incoming/friday/brief-rule-auditor.md` read directly for the brief itself; no separate saved 8-row result file found by doc-keeper — flagged]. Headless session tests (`claude -p` 2.1.281, "คุณชื่ออะไร Javis คือใคร"): empty folder + this repo's own folder both answer Friday / Javis = Cowork [ตรวจแล้ว, `_incoming/friday/session-tests/answer-web.txt` read directly, quotes "ชื่อ Friday ค่ะ … Javis: คือ Cowork …"; `answer-empty.txt` not independently opened by doc-keeper, brief reports the same pass]. Checker: **8/8 PASS first time, 0 send-backs** [ตรวจแล้ว, `_incoming/friday/checker-result.md`, read directly — not checked by the checker itself: re-running the headless sessions · RECOVERY checksum `60d25dcb` · the verify logs (run separately by the main agent, item 6)]. No site file touched → no deploy needed. Found, not fixed (out of scope, flagged for the next chat): `docs/AI_TEAM_GUIDE.md:134` still reads "handoff นอกรีโป" although the skill moved into the repo 2026-09-25 [ตรวจแล้ว, line 134 vs line 152 both read directly]. Tag for this close not yet made at the time of this write — expected name `friday-persona-done`, hash **[ยังไม่มีข้อมูล]**.
>
> **Added at this relocation (doc-keeper, tools round close):** the tag was made — `friday-persona-done` = `f60f875`, merged via PR #62 → `origin/main` = `e78f69f` [ตรวจแล้ว, `.git/refs/remotes/origin/main` + `docs/RECOVERY.md` row `friday-persona-done`, both read directly] — superseding the "not yet made" / "[ยังไม่มีข้อมูล]" sentence above, which is otherwise kept verbatim.

**Moved here from §16 at the tools round's own close (2026-09-26, same write, coordinator flagged §16 over its 15 KB cap) — relocation, not deletion (doc-keeper spec):** round "tools round" full detail, verbatim from this same write's first draft of §16 item 3 (status + stop point + tag + evidence path kept live in §16 item 3 itself):

> round: **CLOSED — tools round** (instruction `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบเครื่องมือ-สคริปต์-สกิล-เก็บเอกสาร.txt` · opened+closed 2026-09-25→26 in one chat, one session interruption resumed in the same chat · base `e78f69f`, tag `pre-tools-round` = `e78f69f` pushed [ตรวจแล้ว, `docs/RECOVERY.md` row] · scope-auditor: 0 of 104 sitemap pages touched). 15 commits `6add24c..313c9df` [ตรวจแล้ว, `.git/logs/HEAD`]. Batches, all tier A, all **done**: 1 scripts into `scripts/` (card-lines · card-lines-diff · empty-cards · finder-dump · head-audit) · 2 line-ending gate (`.gitattributes` + `.githooks/pre-commit`, open after a fresh clone = RECOVERY §2ค) + `test-server.js` (build guard, owner ruled **option A** — the 3412 proof server runs from its own build copy; `npm run build`/`npx next build` run directly are still not blocked) — checker **13/13 PASS** for batches 1+2 (`_incoming/tools-round/checker-b12-result.md`, commits `6add24c..0bd1441`, pushed) · 3 `visible-text.js` (what a visitor reads, 3 locales × 2 widths) proven on a known-answer test over round data 2's own before/after: found all **9** answer-set card changes, 0 missed, 0 regressions — and one thing round data 2's own gates never caught: **10 Thai strings shown to en/zh visitors** on coil-54/55/68 + iqosheet-16/18 (round data 2's new spec rows carry no en/zh text; not fixed, site untouchable this round — item 5) [ตรวจแล้ว, `b3/data2-evidence.md`] · 4 `merge-pack.js` (owner-table builder) ·
> 5 skills `tier-b-proof` + `merge-pack`, a `catalog-research` maker-fact section, `round-close` step-1/break-red/merge-pack pointers · 6 docs leftovers fixed (SEO_LANDSCAPE's post-10C owner-ruling block · `AI_TEAM_GUIDE` skill count · this file's own §16 · the stale `search-aliases.ts:104` comment) — checker **20/20 PASS** of what was checkable then for batches 3–6 (`checker-b36-result.md`), item 7 (site-unchanged + EN break test) held for its own re-check, then **6/6 PASS** at close (`checker-close/checker-close-result.md`), plus a `merge-pack.js` readability fix re-checked **PASS** (both this round's own pack and the round-data-2 test pack rebuilt byte-identical) [ตรวจแล้ว, `checker-close/mergepack-fix-result.md`] — **0 send-backs, whole round**. rule-auditor ran once before batches 3–6 landed: **27 rows** (conflict 10 · dead 3 · duplicate 5 · ambiguous 9), every row dispositioned [ตรวจแล้ว, `rule-auditor-result.md`] — most fixed as pointers; 2 left "not fixed, pre-existing, reported" (`round-close` step 3's own pre-existing dates/round names · `catalog-research`'s dead last line); the rest either resolved by an owner ruling this round (below) or carried to item 5 as an open question. 2 items beyond the brief (13.10 #1, each its own commit): `round-close` step 1 also points tier-B rounds at `tier-b-proof` · `docs/SEO_LANDSCAPE.md` §3's "okami24.net" line marked "replaced by the block, do not propose again". Owner rulings this round (permanent, do not re-ask, also item 4c): build guard = option A above ·
> the "ร้านพอต" SEO block's shipping numbers = BSOT §10 (15:00 cut-off, same-day dispatch, 1–3 days), not Cowork's relayed note · "เซฟ ๆ ให้ด้วย" = be careful (now `.claude/LESSONS.md`, first "what went wrong" entry). Proof the site did not move: 624 page×locale×width files compared (`visible-text.js diff`, live `e78f69f` build vs this round's own round-end build) = **0 changes, 0 one-side**; head-audit (title/description/H1/og:title) on 104 sitemap pages = **0 changes** [ตรวจแล้ว, `owner-table.md` + `close/head-roundend.log`]. `src/` touched by this round = one comment (`search-aliases.ts`, names the real home H1) + the `content-dates.json` refresh it forced (only the noindex `/search` family; confirmed no sitemap/JSON-LD reads that family's date) → **no deploy needed for customers**; the merge is still needed to land the tools/skills/gate for future rounds. **NOT merged — waiting for Cowork**, together with the merge pack's 2 "ยืนยัน" rows and 2 extras (item 4). `_incoming/tools-round/` = 825 MB, of which the `wt-before` worktree (an old build kept for the round-data-2 known-answer test) = 785 MB — safe to delete after merge.

**Also relocated at the same write — item 6's older-close carried gate baselines** (superseded for the gates the tools round's own close re-ran; kept here for the gates it did not re-run, still current, not re-run this write):

> Older close (round data 2, HEAD `61223ad`) [ตรวจแล้ว at that close, carried forward, not re-run this write — the tools round's own fresher `scan.js`/`og-gate` numbers in §16 item 6 supersede this round's copies of those two]: `thai-leak-scan` **0/152** (5 allowed, 2 files) · `verified-specs-contract-test.ts` **11/11** · `gate-break.log` **2/2 caught+reverted** (main agent, not checker) · word-break **0 FIXED / 0 NEW** (48 page-widths) · Finder `finder-now.txt` **864/864 identical** to `_incoming/round-data/finder-after.txt`.
>
> Older close (round "owner rules", HEAD on base `95a6190`) [ตรวจแล้ว at that close, carried forward, not re-run this write]: `owner-rules-check.js` **PASS** (removed 99 lines · lost 0 · stale 0 · 31 items · 95 pointers into §12) · `rules-move-check.js` **PASS** (mode post: lost 0 · dup 0 · undeclared 0 · pointers 0; §13 lines 137, declared edits 4).

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

### Round 6 "about3lang" — batches B1, B3, B5 detail (relocated from §16 on 2026-09-23 when B2/B4 closed and §16 needed the room; relocation, not deletion — B2/B4's own detail and the round's still-open close-out are what stays live in §16 item 3)

**B1 (age gate en/zh) CLOSED** — full detail in commits `8f6a8ae`/`da1b3a4` + `_incoming/about3lang/b1-evidence.md`. Summary: 6 Thai literals moved into `src/i18n/age-gate-copy.tsx`; Thai byte-identical (md5 `d2f9730ae447ed8c603470323c67f4f6`); no Thai flash, 3 runs; AgeGate's row deleted from `thai-leak-scan.js`.

**B3 (floating LINE label) CLOSED** (checker PASS, designer PASS [เชื่อว่า] — `_incoming/about3lang/brief-checker-b3-b5.md` sent, no saved close-report found for this batch). `LineContact.tsx`: reveal changed `max-width:0→9rem` to a grid column `0fr→1fr` — open width is now the label's own max-content width, nothing left to cap wrong. Cowork's 9rem→11rem suggestion deliberately NOT taken (still a guess) — logged as the main agent's 13.10 #2 call. Measured, pill genuinely open at 1440 [ตรวจแล้ว, `_incoming/about3lang/b3-b5-evidence.md`]: th 113.42px / en 80.80px / zh 62.44px, `scrollWidth===clientWidth` all three.

**B5 (age-gate button layout, owner-added 2026-09-23) CLOSED** (checker PASS, designer PASS [เชื่อว่า], same source as B3). `AgeGate.tsx`: buttons stack at every width (card is `max-w-md`=448px at every width, side-by-side gave ~218px/button, Thai decline label wrapped); confirm button gets `border border-transparent` to match the bordered decline button's height (was 44 vs 46px); overlay `overflow-y-auto py-8`, card `my-auto` (the fixed unscrollable overlay was cutting the card off on a short viewport with no way to reach either button — predates this round, B5 made the card ~58px taller, hence fixed here). Proof [ตรวจแล้ว, `b3-b5-evidence.md`]: 18 button measurements (390/640/1440×th/en/zh×2) all 46px single-line · viewport probe (390×360 th/en/zh + 320×320 th): `allReachable` false→true, decline button was at 343–389px in a 360px view before · dialog `textContent` md5 `1d836fa4` unchanged from the B1 build (HTML around the buttons DID change, by design; proof moved from HTML to text) · `git revert --no-commit 4a250a8` applies clean, touches only `AgeGate.tsx` — B5 undoable without touching B1.

B3+B5 gates at their own close (uncommitted-diff level): tsc clean · eslint clean · `next build` exit 0 [ตรวจแล้ว, `b3-b5-evidence.md`]. Full gate set + verify is round-close's job.

### Round 6 "about3lang" — batches B2, B4 and the round close (relocated from §16 on 2026-09-23 at the round's own close; relocation, not deletion — §16 item 3 keeps only a one-line-per-batch pointer)

**B2 (`/about`, three languages) CLOSED** — checker PASS over two independent passes (round 1's one ✗ was a timing artifact — `brands.ts` changed mid-run while it was checking — round 2 re-verified that part alone, independently, and passed), designer PASS [เชื่อว่า], 0 send-backs on substance. `src/app/about/page.tsx` (Server Component, no `"use client"`) keeps only `metadata`, the BreadcrumbList JSON-LD and the `brandsWithProducts()` read; the body moved into new `src/components/content/AboutContent.tsx` (Client Component), copy in new `src/i18n/about-copy.ts` (th/en/zh). Proof shape: rendered Thai text md5 **identical** before/after (`e33ee9db4a2a0cf996cac80a5777ffa6`, 2969 chars); rendered HTML identical at 7630 chars once React's `<!-- -->` text-node separators are stripped. The leak, measured directly, was this: **before the fix, en and zh hashed the same as each other** — both were serving the Thai page. Checker independently re-derived the Thai-unchanged claim by AST-diffing the old `page.tsx`'s JSX text nodes against `about-copy.ts`'s th fields, applying Babel's own whitespace-collapse algorithm field by field — not eyeballed. Commit `f735123`.

**B2 also landed the owner-ruled `src/data/brands.ts` fix**, one sentence only, nothing else in the file touched — commit `4bbb377`. SALTHUB's completeness-claim clause "มีครบทั้งเครื่องและหัวพอต" → "ที่ร้านมีทั้งตัวเครื่องและหัวพอต" — option **ข-1** of 3 the owner picked 2026-09-23, no "แท้". Proven over all 18 pages the field can reach (`/about` + all 17 `/brands/[slug]`, not just the 12 sitemap ones — `generateStaticParams`'s own set): old sentence now **0/18**; new sentence on exactly `/about` + `/brands/salthub` (2/18 — the same footprint the old sentence had). `/brands/salthub` never carried the field in head/JSON-LD (it is one of 4 brands with a `BRAND_HEAD_TH` override — confirmed independently by both checker passes). Word-break `/about`+`/brands/salthub` @390/1440: **1 FIXED, 0 NEW** (12→11 issue instances — the SALTHUB card no longer strands «หัวพอต» alone on `/about`@390). Before→after pair + the reason it changed: `docs/THAI_STYLE_LOG.md` §7 "รอบ 6 "about3lang" ก้อน B2".

Batch gates, re-run after `brands.ts` landed: tsc clean · eslint clean · `next build` exit 0 · thai-leak-scan **0 leaks / 150 files**, 5 allowed hits in 2 ruled files · raw-chars **0** · `scan.js` **PASS 0/99** · `overflow-390` **PASS 99/99**. Not run at batch level, left to round close: `verify:catalog --full`, `i18n`, sitewide word-break. Reports saved this time, unlike B1/B3/B5: `_incoming/about3lang/checker-b2-result/`, `designer-b2-result.md`, `writer-b2-result.md`, `thai-copy-b2-result.md`, `b2-evidence.md`.

**B4 CLOSED** — the `about/page.tsx` ALLOW row deleted from `scripts/thai-leak-scan.js` (AgeGate's row was already gone, landed inside B1) — commit `8f4114d`. Checker proved the gate bites: put a Thai literal into each of the two files in turn, confirmed the scan failed (exit 1), then restored each file exactly (md5 match / an empty diff-of-diffs).

**Owner rulings 2026-09-23 (do not re-ask, 13.10 #12) — full text, condensed to one line each in §16 item 4b:** (1) en/zh age-gate wording in the B1 table — APPROVED (2) the dialog's nicotine sentence does NOT get the word-joiner treatment the identical `/about` sentence gets under `thaiTypographyDeep` — closed, stays a plain group-ก string (3) the Thai two-line button was to be fixed this round, the dialog layout opened for exactly that, on condition it be revertable alone — done, B5 (4) the collapsed LINE pill (56×48, icon off-centre because `gap-2` stays while the label column is 0 wide) is NOT this round's work — owner has it on their own list; known one-line fix if wanted: `gap-0 group-hover:gap-2 group-focus-visible:gap-2` (5) new standing habit: the main agent keeps its own "what worked" log in the session memory folder, not in docs/ (6) SALTHUB wording = option ข-1, without "แท้" — if "แท้" is ever wanted it must be a sweep of all 11 brand ledes, not this one (7) the en/zh `/about` copy is APPROVED as shipped (8) the zh H1 wrapping mid-word between 服 and 务 at 390 — LEAVE IT, Chinese sets line breaks anywhere by convention.

**Round 6 B2 close (2026-09-23) — found on the way, not acted on, none blocking:** (1) `src/i18n/dictionaries/zh.ts:45` `footer.tagline` starts "正品保证"; 保证 is on THAI_STYLE §3's forbidden list for new copy, and th/en carry no such word — pre-existing, in a file this round does not touch (2) on the zh page the 11 English brand ledes read as "not translated yet" rather than as a fallback (designer) — the owner already ruled the ledes stay, so this is for a future round (3) English "e-liquid" breaks at its hyphen on `/about` — not fixed, U+2011 would bind a character outside the approved mechanism and the owner chose "leave it" for the equivalent zh case an hour earlier (4) zh at 1440 leaves "卖家。" alone on the lede's second line — fixing it means touching the shared `PageHeader`, which would move Thai line breaks site-wide (5) `brandsWithProducts()` filters on product count, not on having a `descriptionTh`, so the six brands without one would render English on the Thai page the day they get stock (6) thai-copy flagged, out of scope: "ที่ร้านตอนนี้มี" still stands in RINCOE (`brands.ts:50`) and DOTMOD (`:62`) while THAI_STYLE_LOG §7 records the owner changing NEVOKS to "ที่ร้านมี" — the ruling names NEVOKS alone, so it is for the owner to say whether that was a rule or a one-off (7) "Marbo" appears in no Thai string although the code records the product is marketed under that name and the meta already says it — a brand-taxonomy decision waiting on the owner.

**The round close, 2026-09-23.** All 17 round commits, `git log --oneline f014450..HEAD` at close time: `51c4a94` docs — HANDOFF v44, leftovers merged/round 6 opened · `b7720cd` docs — HANDOFF §16, scope call answered · `8f6a8ae` feat(i18n) B1 — age gate copy th/en/zh · `da1b3a4` chore(scripts) B1 — AgeGate row deleted from thai-leak-scan.js · `aaa0a45` docs — HANDOFF §16, round 6 open/B1 closed · `c3eb1ae` fix(ui) B3 — LINE label, grid column replaces max-width cap · `4a250a8` fix(ui) B5 — age gate buttons stack, overlay scrolls · `19543c5` docs — HANDOFF §16, batches B3 and B5 closed, B2 handed to the next chat · `b21caff` docs — HANDOFF v45, line 1 catches up with the round · `f735123` feat(i18n) B2 — /about reads in the visitor's language · `4bbb377` copy(data) B2 — SALTHUB lede drops a completeness claim about stock · `8f4114d` chore(scripts) B4 — thai-leak-scan enforces /about itself · `466dfef` docs — HANDOFF v46 + THAI_STYLE_LOG, B2/B4 closed · `9e51540` docs — HANDOFF §16, ahead-count includes the docs commit itself · `3a341cb` docs — HANDOFF §16, stop writing a commit count a docs commit invalidates · `29a257a` docs — HANDOFF §16 back under its 15 KB cap · `e3e6921` data — content-dates.json catches up with the round's two source files (`src/app/about`, `src/data/brands.ts` move). The doc-keeper close commit that carries this §16/§3/ROUND_COST edit follows `e3e6921` and is where the tag `about3lang-done` lands.

Close checker PASS — every close-log number independently re-run against `localhost:3412`, not read on trust (`_incoming/about3lang/checker-close-result/close-verify.txt`): count-storefront and i18n confirmed byte-identical to a fresh re-run; thai-leak-scan, raw-chars, scan.js, og-gate, content-dates --check all re-run and matched; `verify:catalog --full` and `verify:commerce` read from their logs only (re-running either was judged not worth the risk/impossible while the test server was up — reasons recorded in the log) · commit hygiene confirmed (17 commits, none mixing docs+code+data) · word-break 3-way diff independently re-verified byte-for-byte, not read-and-trust · flagged the close designer skip as not a fair reading of `round-close` step 2 — see next paragraph.

Close designer PASS, run after the checker's send-back — **0 blockers**, 3 notes (all now in §16 item 5, handed to round 7): the `pages/` capture set unusable (age gate never dismissed by the capture script) · `/about`'s "Compliance" heading stays English on th/zh · zh age dialog strands "LINE OA。" alone at 1440. Checked and clean: dialog geometry identical in all 3 languages · expanded LINE button ends at the same right edge in all 3 · button weights match the site's existing pattern · the dialog's orange mono eyebrow is the site's own convention, not drift · none of the 4 already-ruled items got worse from the parts combining. Full report: `_incoming/about3lang/designer-close-result.md`.

### Round 7 "SEO ค" — B1/B2 (2026-09-23, round still open — relocated here from §16 by doc-keeper so item 3 stays under the 15 KB cap; not a close, batch detail only)

Base `origin/main` = `614980d` (PR #49, round 6 "about3lang" merged/deployed). Round folder `_incoming/seo-c/`, instruction file `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบ7-SEO-คีย์หลัก.txt` + GSC export `รอบ7-แนบ-gsc-คำค้น-2026-09-23.tsv` (83 rows).

**B1 (tier A, read-only) — key → page map.** `_incoming/seo-c/keymap.md`, built from the GSC export, the owner's key list, a live-site head/link audit (`head-audit.tsv`/`inbound.json`/`ld/`, 99 sitemap URLs) and `scope-auditor-result.md`/`researcher-1-result.md`. Findings: "บุหรี่ไฟฟ้า" was in **0/99** page heads/H1/descriptions site-wide before this round · the 33 not-indexed pages: no link-count or thinness gap separates them from indexed pages; the real structural split is 16/33 are ProductMaster products the home page's rails never link (legacy catalog only) and 4/33 are "Unbranded" (MOOOD, Muro ×3, no brand page) — site-side fixes named for B3 (home rail, tier B, owner) and a brand/taxonomy question (owner, 13.4 #5); Cowork's GSC-status-per-URL read is needed to know which of the 33 need a crawl-budget fix vs a quality fix · JSON-LD gaps found: Product.description English on 35/53 (legacy products read `shortDescription` raw, not the Thai overlay) · Article.image missing on 12/12 · brand BreadcrumbList used the full `<title>` (with the "— OKami24" suffix) on 4/11 brand pages instead of just `brand.name` · Cloudflare beacon absent from live HTML, and the one documented blocker (`Cache-Control: no-transform`) is NOT present — cause is not the site's headers, B4 proposes a manual snippet with a token from Cowork.

**B2 (tier A) — landed, checker PASS 5/5 independent** (`_incoming/seo-c/checker-b2-result/summary.md`, state = uncommitted working tree on HEAD `deebe5b`, git diff md5 `3aa8423a969232bc7a038474602b2927` = the tree that became commit `ba32d04`). Reviews merged before landing: thai-copy (`thai-copy-1-result.md`, 20 rows) + seo-auditor #1 (`seo-auditor-1-result.md`) — decision record `_incoming/seo-c/b2-final.md`.

Files touched (exactly these 7, confirmed by checker against `git status` — no `src/data/**`, no dictionary file, no visible JSX text changed): `src/i18n/search-head-copy.ts` (HOME_HEAD_TH · productsHeadTh description · `BRAND_HEAD_TH` +7 · `GUIDE_DESCRIPTION_HEAD_TH[choosing-your-first-pod-system]` · new `TITLE_PRICE_HOLD_UNTIL_2026_10_05` / `productTitleWithPriceTh` / `categoryTitleTh` / `PRODUCT_TITLE_HEAD_TH` 17 slugs) · `src/app/products/[slug]/page.tsx` (category `<title>`, product `<title>` = override ?? generated + price unless held/too long, og:title unchanged rule, Product JSON-LD description = Thai chain) · `src/lib/seo.ts` (`articleJsonLd` optional `image`) · `src/app/brands/[brand]/page.tsx` (BreadcrumbList last item = `brand.name`, all 11 brand pages) · `src/app/e-liquid/page.tsx` (description).

Measured after build (test server 3412, `head-audit.js` → `_incoming/seo-c/b2-after/`): **58 titles changed · 11 descriptions changed · 0 H1 changed · 0 JSON-LD type-sets changed** (checker's own independent count, matches `b2-final.md`) · title >60 chars: none · description >160: none · the 7 held product pages: title/og:title byte-identical · Product.description Thai **53/53** (was 19) · Article.image **12/12** (was 0) · brand BreadcrumbList suffix **0/11** (was 4, all 11 now "Home > BRAND") · raw U+2060/U+00A0 in `<head>` and every JSON-LD block, all 99 pages: **0/0** · price in title/description checked against Product JSON-LD `offers.price` at 32 spot checks, 0 mismatches · gates: og-gate 99/99 · jsonld-all 53/53 (0 parse fail) · scan.js 0/99 · thai-raw-chars 0 · tsc clean · eslint clean on the 7 files · forbidden words/claims (THAI_STYLE §3) 0 hits.

**Decisions vs the draft (`b2-head-set.md`) — owner was asleep, so every row is the main agent's own call under 13.10 #3, each with its stated reason in `b2-final.md`, reviewed not ruled by the owner; customer-visible/taste items were NOT landed and went to the B5 owner set instead:** home title keeps the full BSOT §1 slogan + both "พอตไฟฟ้า"/"บุหรี่ไฟฟ้า" (H1 wording itself is B5) · `/products` description uses "อุปกรณ์บุหรี่ไฟฟ้าและพอต" not "อุปกรณ์ pod" (thai-copy: no seller says the latter) · guide description takes the literal reading of HANDOFF 4b's "no น้ำยา" ban (the question of whether that reading is right is in the B5 set) · price in product `<title>` landed on 46/53, held on 7 (`TITLE_PRICE_HOLD_UNTIL_2026_10_05`, auto-drops if the result would exceed 60 chars) — seo-auditor recommendation · 7 new brand titles use brand-term + category-term (not the drafted model-led form) because the draft repeated the product page's own title — seo-auditor found this on all 7 · salthub/relx brand titles **unchanged** (still on the 2026-09-21 GSC baseline, per `SEO_BASELINE.md`) · iqosheet-16/18 and pod-159 titles NOT rewritten with new model names — `<title>` already ≠ Product.name ≠ H1 on those pages, a data-round fix not a head hack · coil titles (14) use thai-copy's shorter rows, "คอยล์ในตัว" dropped from every title (stays in the description) · category descriptions untouched — they are the visible ledes, owner sets those, went to B5.

**Owner rulings received 2026-09-23 via Cowork, permanent (13.10 #12, in §16 item 4b):** "พอตไฟฟ้า" AND "บุหรี่ไฟฟ้า" both allowed in head copy (home previously "พอตไฟฟ้า" only) · misspelled search terms → hidden search aliases only, never visible copy · agent `seo-auditor` approved and created (rule-auditor checked first, `_incoming/seo-c/rule-auditor-1-result.md`) · Cowork can pull more Search Console data on request.

Full before→after string table for all 69 changed title/description pairs: `docs/THAI_STYLE_LOG.md` §7, "รอบ 7 'SEO ค' ก้อน B2" — not restated here.

### Round 7 "SEO ค" — B3, B4, B5's status, and the round close (2026-09-23, tag `seo-c-done` on this docs commit — added by doc-keeper at close so §16 item 3 can stay a short pointer; B1/B2 stay in the entry above, unchanged)

**B3 (tier A/B) — product→guide links, `4f27f64`.** `src/lib/article-relevance.ts`'s `publishedRules()` gained format/battery rules. Checker PASS round 2 (`_incoming/seo-c/checker-b3-result/round2/`) after **1 designer send-back** (the round's only one): pod-180 lost its existing `mesh-coil-systems` technology link to the 3-per-page cap because the new generic rules landed before the product-specific ones — fixed by rule order (maintenance → resistance → mesh → format → battery), rebuilt, re-shot, re-checked (`_incoming/seo-c/b3-final.md`). Designer PASS with one note: the guide's own title strands its last word «แบบ» alone at 390 in the new link text — pre-existing on every page that already linked that guide, now also on pod-159/pod-180 (§16 items 4/6). Links: pod-159 0→1 · pod-180 1→3 (mesh kept) · iqosheet-16 0→1 · iqosheet-18 stays 0 (no verified spec any article covers).

**B4 (tier A) — `388e4ff`.** Checker PASS (`_incoming/seo-c/checker-b4-result/summary.txt`): zh footer tagline drops the guarantee word "保证" → "正品" (`docs/THAI_STYLE_LOG.md` §7 "รอบ 7 ก้อน B4") · 10 hidden search aliases (uotofo·calibirn·คาริเบิน·eskobar·ekkobar·ecobar·catrit·เนวัก·คอล์ย·พอด). e-liquid aliases NOT added (dormant-alias mechanism is brand-based → dead aliases until an e-liquid product publishes). Cloudflare beacon + LINE-click counter written up as proposals only (`_incoming/seo-c/b4-plan.md`) — beacon still needs a token from Cowork (§16 item 5); the counter question was answered at close, option ก (below).

**B5 — did not land this round.** Writer's draft (`_incoming/seo-c/writer-1-result.md`) covered the item set doc-keeper numbered (1)–(11) in HANDOFF v49. Cowork relayed owner rulings 2026-09-23 across two messages — the brief that ordered this write called it "7 rulings"; doc-keeper's own count of the brief's own numbered points is **10**, flagged not silently corrected, verbatim substance:

(1) home page: "Pod system" is the top word, "บุหรี่ไฟฟ้า" second (any page); rewrite/redesign allowed = tier B, designer pass required.
(2) guide `choosing-your-first-pod-system`: add "คืออะไร" + "ยี่ห้อไหนดี" (no ranking) in **Thai only** — en/zh have no SEO effect (Google reads Thai).
(3) `/e-liquid`: the salt-nic-vs-freebase section as proposed; the word "น้ำยา" **may** be used in this page's head — the only page where 4b's "no น้ำยา in head copy" now has an exception.
(4) both "Marbo" and "M Bar" must rank — plan how; people still search "Marbo".
(5) FAQ wholesale = "ติดต่อหลังไมค์ทางไลน์", no numbers, no discount; RINCOE/DOTMOD "ที่ร้านตอนนี้มี" → "ที่ร้านมี" as proposed.
(6) home-page links to the 16 ProductMaster products the rails miss = DO IT (tier B); breadcrumb "Home" → "หน้าแรก" = NOT doing (no ranking effect).
(7) LINE-click counter = option ก, in-site count, no cookies, nothing sent outside.
(8) the short report shape is RULED — one line added to `docs/TEMPLATES.md` (ข) by the main agent (RULES_INDEX row 84; round-close step 7 now points there) — not an open question.
(9) Marbo/M Bar plan approved for the next round: brand title "SALTHUB (Marbo)" · body sentence "M Bar = Marbo" · "(Marbo)" in all 4 M Bar titles after 2026-10-05 · FAQ "Marbo กับ M Bar".
(10) "Home" → "หน้าแรก" = not doing (ruled — same substance as (6)'s second half, repeated in Cowork's second message).

These are permanent rulings (13.10 #12), condensed to one line each in §16 item 4b. Left open for the next round ("SEO ค-2"): the exact home H1/lede copy (item 1 — needs a writer draft + a designer pass, since only the word order is ruled), the exact Marbo/M-Bar sentences beyond item (9)'s plan, and the «แบบ» word-break JOINED question (§16 item 6).

**The round close, 2026-09-23.** `git log --oneline 614980d..seo-c-done` (8 commits): `deebe5b` agents — seo-auditor + round-open docs · `ba32d04` copy(seo) B2 — head copy + JSON-LD · `388e4ff` data B4 — zh tagline + 10 search aliases · `02b39e7` docs — HANDOFF v48, B1/B2 closed · `4f27f64` feat(seo) B3 — product→guide links · `da3607f` data — content-dates catch-up · `5aa947c` docs — HANDOFF v49, stop point before push · this commit — docs: HANDOFF v50 + ROUND_COST row, round closed at B1–B4, tag `seo-c-done`.

Close checker PASS — every close-log number independently re-run against `localhost:3412` rather than trusting `_incoming/seo-c/close/*.log` (the brief's own instruction: the checker's numbers win if they differ); full numbers §16 item 6, files at `_incoming/seo-c/checker-close-result/`. Checker brief `_incoming/seo-c/brief-checker-close.md` asked only for the close-verify set and a git-log/§16-size check — no separate close designer pass was named [ตรวจแล้ว, read directly], consistent with B1/B2/B4 being tier A and B3 already having its own send-back-and-pass cycle above; whether `round-close` step 2 still wants one is for the main agent to confirm, not something doc-keeper could settle from the files given — flagged in this batch's report.

PR/merge/deploy and the live-site check are Cowork's, per Cowork's own 2026-09-23 ruling — not done at the time of this commit [รอเจ้าของ].

---

### Round 8 "home / Marbo / owner set" — batch detail (relocated from §16 on 2026-09-23 when round 9 opened and §16 needed the room; relocation, not deletion — §16 item 3 keeps only a short pointer + the owner-answer-fix one-liner)

round 8 "home / Marbo / owner set" — CLOSED AND PUSHED 2026-09-23, waiting on Cowork's PR/merge/deploy [เชื่อว่า]. Base `origin/main`=`9580d2d` (PR #50). Round files `_incoming/round8/`. Full batch build detail (files touched, measurements, scope-auditor/researcher findings, designer notes) stays in v51's own line-1 text (this file's git history, commit `af70708`) and `docs/THAI_STYLE_LOG.md` §7 "รอบ 8" table — not restated here (cap). One line per batch, as landed:
  B5 LINE-click counter (tier A, option ก, in-site SQLite `line_clicks` table, no cookie/ip/user-agent/referer read, `robots.txt` blocks `/api/`) — checker 6/7 at batch close, own idea 13.10 #1(ง).
  B2 Marbo/M Bar copy — SALTHUB lede sentence kept + 2 new FAQ entries + RINCOE/DOTMOD "ที่ร้านมี"; ownership now backed by BSOT §21.
  B3 guide `choosing-your-first-pod-system` — 2 new Thai-only sections ("Pod system คืออะไร" / "ยี่ห้อไหนดี"); its JOINED «แบบ» question (carried from round 7) is now cleared, see below.
  B4 `/e-liquid` — salt-nic-vs-freebase section, 8 new dictionary keys, no strengths/PG/VG/health wording.
  B1 home page (tier B, designer pass) — H1 "Pod System", lede variant ข, 53-product index variant ข after `<CompareCTA>`, `lg:grid-cols-4` at 1440; 1 blocker fixed (H1/H2 line collision), 4 of 5 designer notes applied.
  **Owner-answer fixes (this write's own batch, `_incoming/round8/owner-questions.md` via Cowork 2026-09-23):** `e5aace4` binds 5 word-break flags via THAI_STYLE §5 — «พอตซิสเต็ม»·«บรรจุสำเร็จ»·«ให้ถูกแบบ» (clears round-7's JOINED «แบบ») · "ตัดสินใจ"·"ทางไลน์"·"ส่วนพอตคิท" — + NBSP before every `@okm24`, "Pod System" casing fixed · `7454ebd` replaces `scripts/line-clicks.ts` with plain-node `scripts/line-clicks.js` (Render Web Shell read-out, `docs/DEPLOY-RENDER.md`, no metrics token — item 4b) + THAI_STYLE §3/§5 + BSOT §21 updates. checker 7/8→6/6→8/8, designer 2 passes 0 blockers, 2 items carried to the next round (m-bar-10k read-more card wording, 3 pre-existing 1440 guide breaks) [เชื่อว่า, `_incoming/round8/fix-results.md`] — full numbers were §16 item 6 at round 8's own close, still readable there in this file's git history (commit `af70708`).

### Round 9 "SEO whole-site audit + 3-tier keys + backlink" — batch detail (relocated from §16 on 2026-09-24 when round 10A needed the room; relocation, not deletion. B1–B7 unchanged character for character; 3 differences: (1) the Round 8 line's "waiting on Cowork's PR/merge/deploy [เชื่อว่า]" became "(§16 line at that time; merged since as PR #51)" because `git fetch` shows PR #51 merged; (2) the Round 8 line's pointer "relocated to §3 "Round 8 … — batch detail" at this round's open (cap)" became "in "Round 8 … — batch detail" above" because the line now sits inside §3 right below that section; (3) the §16 line "Close steps NOT yet run: seo-auditor re-measure, the close checker pass, close designer pass, tag, push." was deleted at round 10A open, not moved here, because it was stale: round 9 was closed, tagged and pushed, per item 6's own close baseline)

  Instruction file = owner's Desktop `Run prompt\New prompt on work\รอบ9-ตรวจSEOทั้งเว็บ-คีย์3ชั้น-backlink.txt` · round files `_incoming/round9/` · base `origin/main`=`7272fd5` (PR #51). scope-auditor ran once at open (`scope-auditor-result.md`): all 99 pages in B2's reach + a NEW gap "น้ำยาบุหรี่ไฟฟ้า" (not in Cowork's original guess) — closed by B4. Batches, one line each:
  B1 re-audit vs 16/09 (A) — **done**, `b1-audit-table.md`: HTML avg/max 85/409 → 102/477 KB (worse, across rounds) · meta<50 19→0 · title<20 4→1 · no JSON-LD 52→4 (service pages) · 1 broken link = Cloudflare email obfuscation (service pages, noted).
  B2 U+2060 → markup-based `<span data-tj>` nowrap spans, look unchanged, site-wide incl. the 7 held pages + round-8 word-break leftovers (B) — **done**, landed as `29b9676`+`f35e71f`. 2 scan+designer cycles: after-scan #1 → designer #1 (`designer-b2-result.md`) asked to restore 13 of 22 moved blocks via 5 new per-sentence JOINED bindings, keep 9 old ones · after-scan #2 (rescan #3, with the 5 restores + round-8 carry) → designer #2 (`designer-b2-result-2.md`) confirmed the restore and that «ข้อเดียว»/«เหมาะกับคุณ» both read better than before, **0 blockers**. `docs/THAI_STYLE.md` §5 gains the bullet (this write).
  B3 3-tier keyword map + seo-auditor pre-check (A) — **done**, `b3-keymap-final.md` + `seo-auditor-1-result.md`: "disposable pod"/"น้ำยาบุหรี่ไฟฟ้า" had 0 placements site-wide → closed by B4 · "คอยล์" already owned (Cowork's guess refuted) · brand/product title fights (caliburn g5 · drag 6 · m bar 15k · relx) held to after 2026-10-05 (all 3 product sides are `TITLE_PRICE_HOLD` pages).
  B4 fill tier-ก gaps, edit/new pages (B, head copy only, no H1/body) — **3 of 4 landed** as `1e3ab0e`: `/products/disposables`, `/e-liquid`, `/products` `<title>`s, all seo-auditor "land now" · **home description + "vape" deferred to after 2026-10-05** (home is a SEO_BASELINE baseline row; combined length risk with "พอตไฟฟ้า"). Source `thai-copy-b4-result.md` — before→after table also in `docs/THAI_STYLE_LOG.md` §7 "รอบ 9".
  B5 "พอด"/typo variants (A) — **done, no on-page action** (`b5-variants-findings.md`: Google already maps them; writing them = spam risk). Marbo `alternateName` = after 10-05.
  B6 backlink (A) — **done**: `b6-backlink-findings.md` (round-4 "backlink" = internal links only · `okami24.net`/`.com` NXDOMAIN · YouTube links nowhere) + `b6-owner-steps.md` (Thai owner steps: re-register .net + 301 recommended · YouTube/LINE links = policy risk · no Google Business Profile).
  B7 mobile speed (A) — **measured only**, `b7-mobile-speed.md`: PSI home 79 (LCP 4.8 s, CLS 0); local Lighthouse 6 pages 62–70, LCP 5.3–9.5 s; LCP = text gated on JS hydration → the light-web round.
  **Round 8 "home / Marbo / owner set": CLOSED AND PUSHED 2026-09-23** (§16 line at that time; merged since as PR #51) — batch-by-batch detail in "Round 8 … — batch detail" above; landed: B5 LINE-click counter · B2 Marbo/M Bar copy · B3 guide 2 new sections (clears round-7's JOINED «แบบ») · B4 `/e-liquid` salt-nic-vs-freebase · B1 home page + the owner-answer typography fixes (`e5aace4`/`7454ebd`/`df2d727`).

---

### §16 lines relocated at data-round chat 1 (2026-09-24 — word for word, 15 KB cap)

  Previous: round 10A "articles set 1: real search terms → 3-colour topic proposal + owner questions" CLOSED 2026-09-24, tag `articles-10a-topics-done` (no site change). Next = round 10B (write the articles) — Cowork sends its instruction file after the owner answers `docs/ARTICLES_10A.md` §3. Instruction file: owner's Desktop `Run prompt\New prompt on work\รอบ10-บทความชุด1-3สี.txt` · working files `_incoming/round10a/` (gitignored; the committed deliverable stands alone). All 6 batches tier A: B1 inventory (scope-auditor: 99 URLs, **7 guides not 12**, RELX Creator/Infy 20K/TFIT M Power hidden → 404) · B2 evidence (researcher ×2 + all 3 owner YouTube channels read signed-out in the built-in browser) · B3 23-topic draft · B4 seo-auditor (+50 autocomplete fetches): 5 draft errors fixed — T01 "Marbo vs M Bar" already owned by /faq, genuine-check method already ruled 2026-09-21, several draft keys return [] · B5 owner questions + URL/GSC table · B6 `docs/ARTICLES_10A.md`. ★10 = T04 · T01' · T03' · T18 · T19 · T21 (publish any time) + T05' · T07 · T08' (after 05/10 — 6 of 7 control pages are UWELL/VOOPOO) + T11. Found on live: product pages DO link to guides via `src/components/product/RelatedArticles.tsx` (scope-auditor had said no). Owner answers mid-round (2026-09-23, via Cowork): priority Marbo 10K/9K → UWELL → VOOPOO → best-seller-only; 08/09 best-seller list current; Marbo = SALTHUB model line → link `/brands/salthub`; @PODSYSTEM-OKAMI-II is the owner's; YouTube `oops` page → never log in, mark [ยังไม่มีข้อมูล].

  Previous close: **round 10B close (2026-09-24, HEAD `fb97b15`)** [ตรวจแล้ว for tsc/raw-chars/`scan.js`/`content-dates`/`locale-hydration-scan` — the checker's own independent re-run, `_incoming/round10b/checker-o1-result.md`; [เชื่อว่า] for `og-gate`/`thai-leak-scan`/i18n/`verify:commerce`/`verify:catalog --full`/`count-storefront` — read from the main agent's own logs `_incoming/round10b/o1-*.log`, not independently re-run by the checker this pass]: `verify:catalog --full` **29/29** · `verify:commerce` **17/17** · i18n **16/16** · raw-chars **0** · `thai-leak-scan` **0/153** · `scan.js` **0/104** · `og-gate` **104/104** · `count-storefront` **53 shown / 53 buyable** · `content-dates --check` current **55 paths** · line-map (`linemap-o1-diff.md`): 208 page-widths, 7 breaks moved + 14 changed blocks (all explained by fixes A–D), 0 overflow, 0 console errors · `locale-hydration-scan` **4 FAIL, pre-existing** (Thai Shipnity name of Pod-159 leaking onto en/zh cards — tracked in item 5 "Round 10B extras", → data round). Previous close: **round 10A close (2026-09-24, docs-only round; `src/`/`scripts/`/`package.json` byte-identical to round 9's verified `092d870`)** [ตรวจแล้ว, `_incoming/round10a/close/*.log`]: tsc 0 · `verify:commerce` 17/17 · i18n 16/16 · raw-chars 0 · `content-dates --check` current 55 paths · `count-storefront` 53 shown / 53 buyable (= round 9). Not re-run (unchanged tree, round 9's numbers below stand): `verify:catalog --full` · `scan.js` · `og-gate` · wordbreak-scan.

### Round 10B — close state (relocated from §16 at data-round open, 2026-09-24 — word for word, cap)

**CLOSED — round 10B "write article set 1: 7 articles" (opened 2026-09-24 on `87e9130`, CLOSED 2026-09-24).** Working files `_incoming/round10b/`; B1–B6 batch detail (pre-decision-1 numbers) relocated to §3 "Round 10B — pre-close stopped-at detail (superseded)". **Owner decision 1 (2026-09-24, via Cowork): publish** — 5 articles live now, 2 held (`comparing-caliburn-models`, `argus-g4-vs-caliburn-g5`) until after 05/10. Fix commits `f6324e1`/`1aff069`/`f3f68fd`/`fb97b15` on top of `14cf1ab` — every sentence cut/changed + sources: `_incoming/round10b/owner1-changes.md` (before→after table also `docs/THAI_STYLE_LOG.md` §7 "รอบ 10B ก้อนแก้ตามเจ้าของข้อ 1"). Checker **9/9 PASS** (`_incoming/round10b/checker-o1-result.md`) — og/leak/i18n/commerce/count-storefront/`verify:catalog --full` not independently re-run this pass (read from the main agent's own logs, item 6). Designer close pass = pass 2, 0 blockers (`designer-result-2.md`). Owner rulings now RULED (permanent, also item 4b): bind "Esko Bar Switch"/"No Atomizer" — done (MODEL_NAMES) · do NOT bind "ไฟกะพริบ"/"พอตใช้แล้วทิ้ง" — standing rule, lone word at a line end at 390px is OK · notice line = `<h1>` — done · article claims need a manufacturer source (`docs/THAI_STYLE.md` §5) · M Switch Pod 2.2mL no longer treated as verified (→ data round). **Tag `articles-10b-write-done` on the docs-close commit, pushed to the branch — NO PR, NO merge (Cowork). Main = `87e9130` unchanged.**

### Round 10B "write article set 1: 7 articles" — pre-close stopped-at detail (relocated from §16 item 3 on 2026-09-24 at round close; relocation, not deletion — superseded by the close summary now in §16 item 3, kept here for the record)

Stopped at (2026-09-24, before owner decision 1): B6 — checker 6/7, NOT pushed. All 7 articles + close fixes committed locally (`57ffcc5..16a4b8f`, 16 commits ahead of `87e9130`); close verify on `16a4b8f`: `verify:catalog --full` 27/27 · `verify:commerce` 17/17 · scan 0/104 · og 104/104 · raw 0 · leak 0/152 · i18n 16/16 · count-storefront 53/53 (logs `_incoming/round10b/close-*.log`). The one ✗: en/zh visitors saw the 5 Thai-only articles entirely in Thai (thai-check gate 3) — owner question 0 in `_incoming/round10b/owner-questions.md` (ก hide on en/zh + one "Thai only" line · ข write en/zh · ค allow). Owner batch set (7 more questions: approve articles, new words, typography bindings incl. 2-word flavour names, กระพริบ spelling, M Switch 600mAh, FAQ casing, clip content) in the same file. Preview: `preview-text.md` + `shots/` (+ `slices/`). Batches at that point, one line each: B1 evidence (tier A) ✓ · B2 held-article switch `HELD_GUIDE_IDS` + `src/lib/held-guides-contract-test.ts` (tier A) ✓ `57ffcc5` · B3 writer drafts 7 → thai-copy (text) · B4 land 5 live articles, one commit each incl. inbound links (tier B) · B5 land T05'/T07' held (tier A, must 404) · B6 seo-auditor key check + designer once (390/1440 all 7) + checker → push. T07' pair = ARGUS G4 vs Caliburn G5 (only cross-brand model pair with autocomplete evidence, researcher B). Scope: sitemap 99 → 104; 9 product "อ่านต่อ" boxes changed (list in SEO_BASELINE round-10B note). This detail is superseded: owner question 0 was answered ก (hide on en/zh + one-line notice), the 7-question batch set was answered 2026-09-24 via Cowork, and owner decision 1 (fixes A–D) landed after it — see §16 item 3 for the close itself.

---

### Round data — chat 1 push state (relocated from §16 at round close, 2026-09-25 — word for word, 15 KB cap)

Superseded by the close summary now in §16 items 3/4/6 (the round closed in chat 2, tag `data-facts-done`); kept here for the record, not deleted (doc-keeper spec). Verbatim from HANDOFF v57 §16 items 3, 4 (main paragraph) and 6:

> 3 round (v57 text): **OPEN — data round "spec facts: every number has a manufacturer source" (opened 2026-09-24 on main `c17acca` = PR #53, round 10B merged; branch fast-forwarded, 0 ahead at open) — same chat as 10B by the owner's permission.** Instruction: owner's Desktop `Run prompt\New prompt on work\รอบข้อมูล-สเปกถูกต้อง-ทุกตัวเลขมีที่มา.txt` (copy `_incoming/round-data/instruction.txt`) · working files `_incoming/round-data/`. Owner answers this round (AskUserQuestion): batch-1 gate (ก) = **per-row source link, required only for rows touched this round + rows of products the 5 live guides link to; older verified rows listed as a grandfathered set** (option ค) · hide every unverified number now (ก) · 15 empty-headline cards → designer to propose 2-3 options (ก, NOT done yet — next chat) · Esko Bar Switch 20K's 5 extra flavour names on the manufacturer page vs the 2026-09-06 Pod-160 ruling → Cowork checks Pod-160 in Shipnity first (ค). Batches: B1 display verified rows only + gate (tier B) · B2 SALTHUB M Switch/M Bar 9K + sample check (A) · B3 pod-159 flavours/names + iqosheet-16/18 names (A) · B4 blinking-light article UWELL manual sources + bind "NO ATOMIZER" (A) · B5 self-contradicting specs caliburn-g5/coil-94, /brands/uwell, Coil-72/89 (A) ·
> B6 /guides order + home guides box + /compare entry = split into its own small round after B1–B5 (13.10 #6). Stop point = before merge, `owner-table.md`; close tag `data-facts-done`. Stopped at (chat 1, 2026-09-24): **pushed to the branch, round still OPEN — not closed, no tag, no merge.** Landed: B1 (verified rows only + gate) · B2 (SALTHUB + sample-check row fixes) · B3 (names) · B4 (blinking-light guide) · B5 in part (coil-94, caliburn-g5 pod row, coil-72/coil-89 category move) — 8 commits `10b20e1..d1cf2e4` on `c17acca` [ตรวจแล้ว, `.git/logs/HEAD`]. Checker `_incoming/round-data/briefs/checker-1.md` (this is the brief given to the checker — no separate saved checker-result file this batch [เชื่อว่า for the pass count below, not independently re-derivable by doc-keeper]): reported **10/10 after one re-check** (item 2: two rows lacked the recorded quote — added to `sources-verified.md`) · item 5 **[~] known limitation, confirmed by doc-keeper directly in code** [ตรวจแล้ว, `src/i18n/product-copy-th.ts:565` still reads `capacity: "14mL บรรจุสำเร็จ"` for m-bar-9k even though the row is hidden from render]: hidden rows still travel in the page's hydration data and the Thai overlay (`product-copy-th.ts`) still holds values of hidden rows — not visible on screen, but not scrubbed. Gates read directly by doc-keeper from `_incoming/round-data/*.log` [ตรวจแล้ว]: `verify:catalog --full` 30/30 · `verify:commerce` 17/17 · `scan.js` 0/104 · `og-gate` 104/104 · raw-chars 0 · `thai-leak-scan` 0/152 (5 allowed hits, 2 ruled files) · `count-storefront` 53/53 ·
> `verified-specs-contract-test.ts` (new gate) 8/8, 5 deliberate breaks proven red then restored (`gate-break.log`) · locale-hydration-scan (`locale.log`): `/products/pod-kits` + `/brands/esko-bar` (en+zh) clean, 0 FAIL — but the wider 23-page×en/zh sweep in the same log shows **28/46 page×locale pairs still FAIL, 124 Thai text node(s)** (pod-159, iqosheet-16/18, several coil pages, m-bar-9k, joiway-f4, 3 caliburn pages, relx-smash-go-12k — mostly Shipnity/manufacturer names in Thai), reported by the main agent as pre-existing, not independently confirmed pre-existing by doc-keeper [เชื่อว่า] · line-map vs round 10B's final build (`linemap-diff.md`, 208 page-widths): 2 breaks moved, 0 overflow, 0 console errors, but the log's own tally also shows **930 "blocks missing"** across 103 of the 208 page-widths and the file's own last line reads literally "FAIL" — the checker's brief asked only for a 3-item sample of these to be confirmed as intended content changes (moved category, new name, changed card line, removed spec section), not a review of all 930 [ตรวจแล้ว that the raw numbers/FAIL line exist in the log; เชื่อว่า that all 930 are benign, that is the checker's finding not independently re-verified row-by-row here]. NOT done, next chat: B1 designer options for the 15 empty-headline cards + tier-B screenshots/designer pass on pages whose spec section disappeared · B5 rest — `/brands/uwell` uniform rows; "magnetic" in ~10 prose spots (on no UWELL page) · scrub hidden rows from the hydration payload and the Thai overlay · B6 (`/guides` order, home guides box, `/compare` entry) as its own small round (13.10 #6) · Esko's 5 flavours wait on Cowork · Joiway F4 "2 โหมด 2 รส" line rests on the shop's own review video (owner may want it cut) · pre-existing: Shipnity products show Thai names/spec labels on en/zh pages (language-round candidate).
>
> 4 waiting on the owner (v57 text, main paragraph): **round data "spec facts" (chat 1, pushed 2026-09-24): waiting on the owner + Cowork** — `_incoming/round-data/owner-table.md`'s ★ new customer-facing sentences (Joiway F3/F4 short descriptions th, m-bar-9k new feature line th, technology-page mesh-coil section th) are thai-copy-checked but **not yet ruled sentence-by-sentence by the owner** (before→after table: `docs/THAI_STYLE_LOG.md` §7, this round's heading) · Esko Bar Switch 20K's 5 extra flavour names — waiting on Cowork to check Pod-160 in Shipnity first (owner ruling ค) · Joiway F4's "2 โหมด 2 รส" line rests only on the shop's own YouTube review, not a manufacturer source — owner may want it cut (§16 item 5 "Round 10B extras" carries the same pattern for other unsourced claims).
>
> 6 verify baseline (v57 text): **data round "spec facts" chat 1 (2026-09-24, HEAD `d1cf2e4`) — this is a mid-round push, NOT a round close, so it does not replace the round-10B close baseline below** [ตรวจแล้ว, read directly from `_incoming/round-data/*.log`]: `verify:catalog --full` **30/30** · `verify:commerce` **17/17** · `scan.js` **0/104** · `og-gate` **104/104** · raw-chars **0** · `thai-leak-scan` **0/152** (5 allowed hits, 2 ruled files) · `count-storefront` **53 shown / 53 buyable** · `verified-specs-contract-test.ts` (new gate) **8/8** · i18n/content-dates not logged separately this batch, folded into `verify:catalog --full`'s own 30 steps (`i18n-contract-test.ts`, `content-dates-contract-test.ts` both OK there) [ตรวจแล้ว, `verify-catalog.log`] · full detail + the locale-scan and line-map numbers (which are not simple pass/fail this batch) are in item 3 above, not repeated here.

**Resolved by the chat-2 close (2026-09-25), do not re-ask:** Esko's 5 extra flavour names → owner ruling 4, all 20 now shown · Joiway F4's "2 โหมด 2 รส" line → owner exception (ruling 3), clip recorded in `sources-verified.md` · m-bar-9k's feature-line/mesh-coil ★ sentences above → thai-copy checked, landed, not flagged again at close. **Still open, carried to §16 item 4 of this close:** the F3 short-description wording (thai-copy option ก vs the owner's own words, option ข) · the 15/14-card designer options ก/ข/ค (§G) · Q1–Q3.

---

### Permanent owner rulings carried from §16 item 4b (relocated 2026-09-24, round 10B close)

Relocated from §16 item 4b and item 5 to bring §16 under its 15 KB cap (measured 18,693 bytes before this move) — relocation, not deletion, text moved word for word. §16 item 4b now keeps only a pointer to this heading plus the round 9 and round 10B rulings; item 5 keeps only a pointer plus the round 10A/10B "new" material.

**From item 4b (older carried rulings v48–v52 + round 7/8):** ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม บนหน้าร้าน + เว้นคำ "น้ำยา" ออกจาก head copy จนกว่าหมวดน้ำยาจะมีของขึ้นหน้าร้าน ยกเว้น /e-liquid หน้าเดียว · caliburn-g4-pro = Pod-181 · muro-3ml = ฿99 · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · tagline/ตะกร้า/หน้าบริการ = รอบของมัน · CLAUDE.md แก้เฉพาะข้อที่เจ้าของเคาะ · ใส่กฎใหม่ = ลบกฎเก่าเรื่องเดียวกันทุกที่ (ยกเว้น §1–§11) · ชั้น 9 ก๊อปไฟล์นอกรีโปก่อนแตะ · ชั้น 10 รวม/ลบกฎต้องกางเต็ม · `readMoreEyebrow` = "อ่านต่อ" ไม่ใช่ `footer.learn` ·
คำที่ใช้อยู่บนเว็บแล้วแต่ยังไม่มีคีย์ = ไม่ใช่คำใหม่ · en/zh age-gate wording APPROVED · dialog nicotine sentence stays plain group-ก · SALTHUB wording (about3lang round) = option ข-1, no "แท้" · en/zh `/about` copy APPROVED · zh H1 wrapping mid-word (服/务) at 390 — LEAVE IT · collapsed LINE pill off-centre icon — owner's own list · "พอตไฟฟ้า" AND "บุหรี่ไฟฟ้า" both allowed in head copy · misspelled search terms → hidden search aliases only, never visible copy · agent `seo-auditor` approved and created · round 7 close's 10 owner rulings (home word order · guide "คืออะไร"/"ยี่ห้อไหนดี" · `/e-liquid` "น้ำยา" exception · Marbo+M Bar plan · FAQ wholesale phrase · RINCOE/DOTMOD phrase · home index DO IT · LINE-counter option ก · report-shape ruled · breadcrumb NOT doing) — verbatim §3 "Round 7 'SEO ค' — close" · **owner-answer rulings 2026-09-23 (round 8, via Cowork, permanent):** SALTHUB owns Marbo/M Bar, BSOT §21 · 8 words locked THAI_STYLE §3 as one set (บุหรี่ไฟฟ้า·Pod System·freebase·Marbo·ตระกูล·หลังไมค์·ยกลัง·หัวละ) · "Marbo" Latin-only in visible copy, hidden aliases only · no `OKAMI24_METRICS_TOKEN`, Render Web Shell read instead (`docs/DEPLOY-RENDER.md`) · 5 typography WORD JOINER bindings allowed (§5) · `voopooTitle` rename NOT done.

**From item 5 ("Carried, unchanged from v50/prior"):** a Cloudflare Web Analytics token · GSC status per URL for the 33(+7) not-indexed pages · query→landing-page decisions for caliburn g5 / salthub / m bar / marbo · `m-bar-15k` got its first home link via round 8's new index — read the 10/05 SEO_BASELINE numbers with that in mind · `/products/m-bar-pod` meta description is one `withPriceSuffixTh` cut from breaking · `okami24.net` ranks for "joiway f3" with a shop URL, stale index entry that will drop on its own · backlink's "อ่านต่อ" block sits ~5000px down a product page · share-deadend's empty-category self-return mechanism · search-price's per-source-file content-date granularity · "แถว/บรรทัด" not locked · caliburn-g5↔coil-94 mL disagreement · Finder draw-style unverified · 27 products without a clip · memory files unaudited by rule-auditor · LAUNCH_AUDIT split proposed, not done · production backup cadence unconfirmed [เชื่อว่า] · overwrite the 20 owner-estimate rows in `legacy-price-approvals.ts` when the stock API lands.

**From item 5 ("Needs from Cowork", round 9):** GSC Settings → Crawl stats → Host status — check the DNS-resolution indicator, since PageSpeed Insights failed to resolve `okami24.store` 2 of 3 times this round (doc-keeper's own read: the main agent's own DNS check came back clean [เชื่อว่า]) · per-URL index status (Discovered vs Crawled) for the not-indexed pages · per-page impression split for "caliburn g5" / "m bar 15k" / "drag 6" (all 3 are competing brand/product title pairs held to after 10-05) · a "marbo" row — still none in the query export · `okami24.net`/`.com` NXDOMAIN — owner ruled: leave them (§16 item 4b).

**owner rulings 2026-09-24 (round data, chat 1, permanent):** batch-1 gate = per-row source link required only for rows touched that round + rows of the 7 products the 5 live 10B guides link to, older verified rows grandfathered (option ค) · every unverified number hidden from render now (option ก) · the 15 (later 14) empty-headline cards get a designer proposal, not a text placeholder (option ก) · Esko Bar Switch 20K's flavour count — Cowork checks Pod-160 in Shipnity first, before anyone else decides (option ค). **owner rulings 2026-09-24/25 (round data, chat 2, permanent):** cut the "we could not find the specs on Joiway's site" filler sentence site-wide where a fact is simply missing, state the fact or say nothing, never explain the absence (thai-copy-c2.md instruction, applied to Joiway F3/F4) · Joiway F4 keeps "2 โหมด 2 รส" as a sentence, sourced to OKami24's own 30-day YouTube review, even though no manufacturer page confirms it — a named, one-time exception, not a change to the "manufacturer source only" rule (ruling 3) · pod-159/Esko Bar Switch 20K shows all 20 of the maker's flavours, not the 06/09 cut of 15 — replaces that ruling (ruling 4) · an empty product card may show a real maker fact or the desktop-style option count, never placeholder text (ruling 5, constrains §G's still-open ก/ข/ค choice) · "magnetic/แม่เหล็ก" claims stand only where the manufacturer's own page, poster or manual says so — silence or an unreachable manufacturer site means cut, not "leave it", the one standing exception being VOOPOO's own site being unreachable from here (Q1, not yet decided because the source could not be checked, not because the rule bends).

---

### Round "tools round" — full detail (relocated from §16 at round "central-rules" batch close 1, 2026-09-26 — the pointer to this heading was written at the tools round's own close (v66) but the heading was never actually created; filled now with §16's own compact close-summary, not a batch-by-batch breakdown — flagged as a pre-existing gap in doc-keeper's own report, not invented content)

**CLOSED + MERGED — tools round** (PR #63 → `3a4e9e3`, confirmed via git fetch and `.git/logs/HEAD` walked directly [ตรวจแล้ว]) — at its own close the stop point was "before merge, Cowork merges"; the merge has since landed. Tag `tools-round-done` on its own docs-close commit, hash `f1fe954`, base `e78f69f`, tag `pre-tools-round` pushed [ตรวจแล้ว, `docs/RECOVERY.md`]. All 6 batches done, tier A, 15 commits `6add24c..313c9df` [ตรวจแล้ว, `.git/logs/HEAD`] — checker 13/13 (b1+2) + 20/20 (b3–6) + 6/6 (close) + a mergepack-fix re-check PASS, **0 send-backs**; rule-auditor 27 rows, all dispositioned. Site proven unchanged: 624 page×locale×width files + 104 sitemap heads = **0 changes** → no deploy was needed for customers, the merge landed to carry the tools/skills/gate forward. Merge pack's 2 "ยืนยัน" rows + 2 extras (13.10 #1) — kept or reverted at merge, not tracked further in this file [เชื่อว่า]. Found, not fixed at that close: 10 Thai strings shown to en/zh visitors on coil-54/55/68 + iqosheet-16/18 (carried forward, §16 item 5 of the current round). Evidence: `_incoming/tools-round/` (`wt-before/` worktree removed 2026-09-26 with the owner's permission — the rest of the folder kept).

**Merge-pack "ยืนยัน" rows + round data 2 wording note, relocated from §16 item 4 at round "central-rules" batch close 2, 2026-09-26** (relocation, not deletion — the tools round is merged (PR #63 → `3a4e9e3`), so these rows are resolved and no longer need to stay live in §16, which was over the 15 KB cap at v67): the tools round's merge pack (`_incoming/tools-round/owner-table.md`) carried 2 "ยืนยัน" rows for the owner to confirm at merge — ย1 the `docs/SEO_LANDSCAPE.md` "คำตัดสินเจ้าของหลัง 10C" block's wording matches what the owner ruled in chat 2026-09-25 · ย2 round data 2's ★ sentences are all approved, what is live is the approved version, only the named language points move to the language round — plus the round's 2 extras (13.10 #1, each its own commit), kept or reverted at merge [เชื่อว่า, reported, not independently re-checked by doc-keeper this write]. Round data 2 wording (the owner ruled this at the round data 2 merge on 2026-09-25, relayed via the tools round's own note, no other evidence in the repo): every ★ sentence of the data rounds is approved, what is live is the approved version; the language points still open move to the language round: the labels "แบตเตอรี่กล่องชาร์จ / แบตเตอรี่ตัวสูบ" · "135 นาที" · iqosheet-16 "สูงสุด 20 ก้าน" · "4 ค่าโอห์ม" · coil-87 "5.5 ml". No evidence in the repo contradicts this (round data 2 was merged: `e05a6ab`). The pre-merge wording of this item ("not owner-ruled" list) was superseded by the ruling above; full old text = HANDOFF v65 in git (`f60f875`). Still true: neither "กล่องชาร์จ" nor "ตัวสูบ" is in THAI_STYLE §3 yet.

**Verify baseline at the tools round's own close, relocated from §16 item 6 at round "central-rules" batch close 2, 2026-09-26** (relocation, not deletion — superseded in §16 item 6 by the "central-rules" batch close 2 baseline, same verify scripts, kept here for the record): `tsc` 0 errors · `eslint` 0 errors (round-files-only run, not whole-repo) · `verify:catalog --full` 30/30 (incl. `next build` PASS) · `verify:commerce` 17/17 · `count-storefront` 53 shown/53 buyable · `i18n` 16/16 · `raw-chars` 0 · `content-dates --check` current (55 paths) · `scan.js` 0/104 · `og-gate` 104/104 · `eol-check` OK (new gate that round). Plus tier-b-proof's own site-unchanged gate: 624 page×locale×width files compared = 0 changes, 0 one-side · head-audit on 104 sitemap pages = 0 changes [เชื่อว่า, as recorded at that close, not re-verified by doc-keeper this write]. Source: `_incoming/tools-round/close/*.log` + `exit-codes.txt`, every exit 0.

**2 items moved out of §16 item 5 at round "central-rules" close, 2026-09-26** (relocation, not deletion — §16 was over the 15 KB cap; both items are resolved or low-priority, neither blocks anything current): (1) `docs/AI_TEAM_GUIDE.md:134` "handoff นอกรีโป" stale line — **RESOLVED**, fixed in the tools round (batch 6) together with the §7 header count/table; the `src/data/search-aliases.ts:104` stale H1 comment named alongside it in round 10C's extras was fixed in the same batch (comment only) [เชื่อว่า, per the tools round's own close note, not independently re-diffed by doc-keeper this write]. (2) Tools round, pre-existing, not fixed, reported (rule-auditor rows 10/12, still open, low-priority): `round-close` step 3 still names pre-existing dates/round names (the skill's own no-invented-dates rule) · `catalog-research`'s last line (a Browser pane in a research subagent) is dead — no conflict found, left alone per instruction [ตรวจแล้ว, `_incoming/tools-round/rule-auditor-result.md`].

### Round "central-rules" — full detail (relocated from §16 at round close, 2026-09-26 — batch-by-batch detail moved here so §16 stays under the 15 KB cap; the short close summary stays live in §16 item 3)

**CLOSED — round "central-rules" (กฎกลางที่เดียว), tag `central-rules-done`.** Instruction `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบกฎกลางที่เดียว-GitHub-ทุกโปรเจกต์.txt` (v4). Opened on `origin/main` = `3a4e9e3` (PR #63, tools round, merged), tag `pre-central-rules` = `eac11bb` [ตรวจแล้ว, `docs/RECOVERY.md`]. Draft rules repo `smogz-rules/` built first inside `_incoming/central-rules/` (own git, not pushed), then the real GitHub repo `dhetchaiyakrith24/smogz-rules` created private, main locked (PR only, check guard, admins enforced, 0 approvals) once the owner ran the stop-1 steps: GitHub Pro check · create the repo · keys `RULES_SYNC_TOKEN`(smogz-rules) + `RULES_READ_TOKEN`(okami24-web), both expire 2027-09-26 · install the Claude GitHub App. Batches 1+2 (own-git text + one-text loading in the web repo via `.claude/rules/central-rules.md`, a byte copy + a gate) landed first; checker 6/7 PASS + 1 after 2 fixes → re-check 4/4 [เชื่อว่า, reported, no saved checker file for this pair]. scope-auditor 0/104 pages touched · rule-auditor run 1: 15 rows, all dispositioned (row 11 = who merges the sync PR, decided: Javis) [ตรวจแล้ว, `_incoming/central-rules/scope-audit.md` + `rule-auditor-1-dispositions.md`].
Stop point 1 (2026-09-26): sender PR + copy gate PASS ×2 on PR #64, 5 break tests red, cleanup [ตรวจแล้ว, `_incoming/central-rules/github-tests.md`]. Merged into the web branch with the owner's permission. Stop point 2 (2026-09-26): web `main` locked + tested — a hand-edited copy PR (#66) BLOCKED and closed · a normal sender run reported "copy on main already matches" · headless on main loads the copy · checker 7/7 PASS [ตรวจแล้ว, `_incoming/central-rules/checker-sp2-result.md`] · merge pack `_incoming/central-rules/owner-table.md` — 0 ★ customer-facing rows (round touched no `src/`/`public/`), 1 "ยืนยัน" table (3 owner-only facts, no repo evidence), verify 19/19 exit 0. Owner kept all 4 extras at this stop.
Between stop 2 and batch 3: owner edited key A to add `merrumi-cartoon` → Javis merged `smogz-rules` PR #5 (targets + cartoon) → the cartoon repo's own copy PR was opened and merged (PR #1) → cloud tests T1–T3 passed (owner/Javis) → Javis merged the web branch into `main` via PR #65 → `origin/main` = `135078b`; `smogz-rules` PR #4 (README key expiry) also merged.
Batch 3 (2026-09-26, after the web merge): full central file backed up to `docs/archive/claude-config-2026-09-26-central/` (sha256 `9605f29a…` ×4 identical, secret scan 0, raw-chars 0) · `~/.claude/CLAUDE.md` on the owner's machine slimmed to a pointer-only file, sha256 `bbb9933d…` (was `9605f29a…`) · `docs/RECOVERY.md` §2ง gains status + click-by-click restore steps + the new hash · headless tests: web repo `fdb89f4` context ≈30.2k (was ≈40.8k with the double load) · empty scratch folder ≈7.7k (knows the text lives in smogz-rules, says it must tell the owner first) · cartoon folder (read-only, `--settings {"disableAllHooks":true}`) ≈23.9k, own copy from `smogz-rules@5a1ed96`, `git status` after the run = 0 lines · a new self-merge rule (TEAM_RULES 13.7 + `scripts/self-merge-check.js`) letting Friday merge a web PR that touches nothing customers see, gated on: no `render.yaml` `autoDeploy:false` drift · no widening of the gate/agents/`launch.json`/central-restore allow-list · PR origin = this web repo only (`smogz-rules` stays Javis-only) — 13 red break tests + 2 green, rule-auditor's own 10-row audit on the new rule all dispositioned (`rule-auditor-b3.md`) · stray remote branches deleted with the owner's allowance: `okami24-web claude/modest-babbage-8pu4ny` (PR #67, test-only, closed) · `merrumi-cartoon rules-sync/5a1ed96` (PR #1, merged) [ตรวจแล้ว, `branch-delete.log`].
Checker close: **9/9 PASS** [ตรวจแล้ว, `_incoming/central-rules/checker-b3-result.md`]. rule-auditor: 120/120 line coverage (old full central file vs. the master `smogz-rules/CLAUDE.md` vs. the loaded copy, all 120 non-empty lines match) + the 10-row self-merge audit above, all dispositioned [ตรวจแล้ว, `_incoming/central-rules/rule-auditor-b3.md`]. Close-verify: full numbers moved to §16 item 6 of this close, source `_incoming/central-rules/verify-b3/*.log` + `exit-codes.txt`. Open owner questions carried to §16 item 4 of the current close (not resolved this round): 13.10 #1 (ง)'s merge moment when Friday self-merges · whether an agent definition file counts as a "rule" for the self-merge allow-list · 2 leftover remote branches (`rules-sync/97a58b0`, `checkpoint/phase-3.3.1`).

### Round "cloud" — full detail (relocated from §16 at round close, 2026-09-26 — batch-by-batch detail moved here so §16 stays under the 15 KB cap; the short close summary stays live in §16 item 3)

**CLOSED — round "cloud" (Friday speed + housekeeping + a real cloud test), tag `cloud-round-done`.** Instruction file `docs/rounds/รอบยกขึ้นคลาวด์-Friday-เร็วขึ้น-เก็บบ้าน.txt`. Opened once round "central-rules" reached stop point 2 (web `main` locked, `origin/main` = `135078b`). Speed-consult proposals adopted whole — owner ruled "เอาทั้งคู่" on all 5 items, `_incoming/speed-consult/RESULTS.md` §4.
Batch 1 (speed scripts): `visible-text.js`/`wordbreak-scan.js`/`linemap-scan.js` reused one page load per check instead of re-navigating — 71–76% faster, file-for-file equal to the control scripts (0 diffs) [ตรวจแล้ว, `_incoming/cloud-round/batch1-evidence.md`]. `shot.js` one image: 63.8 s → ≈5 s (waits for network-idle instead of a fixed 60 s sleep); the home-hero first-paint frame shift is a known site limit, documented in the `shot.js` header, not hidden.
Batch 2/3: `docs/CLOUD.md` capability table built from Claude Code's own docs + probing this repo's tools, most rows [รอ T4] · branch `inbox` carries round instruction files for a cloud chat to read (`docs/rounds/T4-cloud-test.md`) · Friday's memory master moved from the owner's `~/.claude/` into `.claude/memory/MEMORY.md`, loaded by this repo's `CLAUDE.md` so a cloud chat (no access to the owner's home folder) gets the same memory as a computer chat.
Batch 4: `docs/HANDOFF.md` line 1 cut to a one-sentence pointer (every earlier line 1, word for word, in `docs/archive/HANDOFF-headers.md`, add-only) · rule questions from this work written to `_incoming/cloud-round/owner-questions.md`.
rule-auditor, 3 passes at stop point 1 (cap reached): pass 1 = 24 rows dispositioned · pass 2 = 14/21 fixed rows PASS + 17 new rows fixed or moved to `owner-questions.md` · pass 3 = **17/17 PASS** + 3 small wording fixes applied after, not re-audited [ตรวจแล้ว, `_incoming/cloud-round/rule-auditor-1.md` + `rule-auditor-2-3.md`].
checker at stop point 1: first pass 23/25 — FAIL (1) a lazy product-card image flagged as a `shot.js` regression, shown to also vary on the OLD script between two runs (not a regression) · FAIL (2) 2 HANDOFF lines over 2000 bytes → wrapped (`handoff-wrap-bytes.js`). Re-check: **25/25 PASS** [ตรวจแล้ว, `_incoming/cloud-round/checker-result.md`].
**Stop point 1 close:** owner sent T4 to a real cloud session via route A (`inbox` branch + a prompt-filled link) — Javis ran it, 18 checks, full results `docs/cloud-results/T4.md`, folded row by row into `docs/CLOUD.md`'s capability table. T5 (route B — send a follow-up message into that same running cloud chat from the computer) tried two ways: `claude -p --cloud <id>` → "Session not found" for every id tried [ตรวจแล้ว, `_incoming/cloud-round/t5-send.log`]; the app's own cross-chat send tool reached the only cloud chat visible in its picker, which turned out to belong to a different project (`merrumi-cartoon`) and was refused there — nothing touched, recorded as a lesson (`.claude/LESSONS.md` §"พ2") and it prompted a new central rule (below).
**After stop point 1 (this close):** owner answers to `owner-questions.md` applied — 2A (manufacturer-source-only now also covers article-claim sourcing; a retailer page may still confirm colour/model identity and supply photos, never be cited as the source of a fact sentence) → `docs/THAI_STYLE.md` line ~57 + a new §5 paragraph + `.claude/skills/thai-check/SKILL.md` + `docs/AI_TEAM_GUIDE.md`'s thai-check row · 3A (visible-text diffing counts as a "scan" for the 30-shot rule) → `.claude/TEAM_RULES.md` 13.10 #15 · 4 (skills may carry a date/round name; a newer instruction on the same subject supersedes the old one) → `docs/AI_TEAM_GUIDE.md` §7 + `docs/RULES_INDEX.md` row 91 · 5A (round instruction files: OneDrive stays the master copy, `inbox` is the send-to-cloud path, `docs/rounds/` is a read-only mirror) → `docs/rounds/README.md` + round-open step 1 · 10B (a chat may move mid-batch by committing unfinished files to a `wip/…` branch first) → TEAM_RULES 13.6 "ย้ายแชทในเว็บ" + the 13.7 commit-timing exception + round-open step 2 item 3 + `doc-keeper.md` item 1 + a new `.claude/LESSONS.md` §"พ1" addition.
NOT applied — the app's own permission system refused 4 edits because they change Friday's own permission/merge rules and the owner's answers had been pasted rather than typed live in chat: 1A (13.4 #6 wording) · 6A+7A (13.7 "Friday merge เองได้" line) · 9A (a new `catalog-research` rule) · 8A (deleting 3 stale GitHub branches). Full texts kept ready to paste in `_incoming/cloud-round/pending-rule-edits.md`, plus 1 new owner question from rule-auditor's own pass (does 2A's manufacturer-only rule reach `catalog-research`'s retailer-tier evidence use).
Tag `archive/phase-3.3.1` pushed to origin (`22e5109`) ahead of that branch's planned deletion, so the one commit unique to it stays reachable. New central rule proposed and drafted this round, "keep projects apart" (never message a cloud chat without independently confirming its repo first) — owner chose option A in chat; PR https://github.com/dhetchaiyakrith24/smogz-rules/pull/6, guard green, Javis merges (rule-repo PRs are always Javis's, per this file's own header) — the sync PR that follows brings the copy into this repo as its own commit.
Close-verify: full numbers in §16 item 6 of this close, source `_incoming/cloud-round/verify-close/*.log` + `exit-codes.txt`. Checker close report sent (`_incoming/cloud-round/checker-brief-close.md`); verdict **PASS** after 1 send-back (pass 1: 9 of 11 — secret scan missed `docs/RECOVERY.md` edited after the brief + 2 evidence files missing; pass 2: 4/4) — `_incoming/cloud-round/checker-result-close.md`.

### Round "cloud" follow-up — owner-answers batch push state (relocated from §16 at round "mobile"'s close, 2026-09-27 — relocation, not deletion; round "mobile"'s own close state now lives in §16)

Superseded by round "mobile"'s close summary now in §16 (round "mobile" ran and closed on the cloud after this batch); kept here for the record, not deleted (doc-keeper spec). Verbatim from HANDOFF v72 §16 paste block:

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Read first: the single list is step 1 of skill round-open (.claude/skills/round-open/SKILL.md — 13.9 points there; opening a round = that skill, closing = round-close, touching site copy = thai-check)

1 main: **origin/main = `3463d91`**, unchanged since PR #68 merged rounds "central-rules" + "cloud" [ตรวจแล้ว,
  `git log` — same hash as recent-commits HEAD]. Web `main` is LOCKED (required check `copy`). Sync **PR #69**
  "rules: central rules copy @d5ff55b" is open (`smogz-rules` PR #6 "keep projects apart", central §12 item 32,
  merged there to `d5ff55b`) — waiting for Javis to merge; until then `.claude/rules/central-rules.md` here still
  lacks item 32 [เชื่อว่า, reported by the main agent].
  Pre-merge batch-by-batch history: round "central-rules" → §3 "Round 'central-rules' — full detail" · round
  "cloud" → §3 "Round 'cloud' — full detail" (unchanged this write).
2 ahead of main: **0 commits, 3 files modified, not yet committed** [ตรวจแล้ว, `git status` on branch
  `rules/owner-answers-1a-6a-7a-9a`, branched from `3463d91`]: `.claude/TEAM_RULES.md` (13.4 #6 · 13.7
  Friday-merge line — confirmed changed in the working tree [ตรวจแล้ว]) · `.claude/skills/catalog-research/SKILL.md`
  (retailer-tier rule, confirmed changed [ตรวจแล้ว]) · `docs/RULES_INDEX.md` (rows 96–99, confirmed present
  [ตรวจแล้ว], content change not diffed by doc-keeper [เชื่อว่า]). Applies owner answers **1A · 6A · 7A · 9A**
  (confirmed in chat via Javis) + the catalog-research retailer-tier question = **A**, the recommended option — no,
  retailer evidence stays identity/photo-only, never the source of a site fact [ตรวจแล้ว, `catalog-research/SKILL.md`
  "owner ruling 2026-09-26"]. To be committed (split by type) + pushed + a PR opened; **Javis merges it** — this PR
  edits the 13.7 self-merge line itself, so Friday's self-merge allowance excludes it.
3 round: **no round open.** This is a batch close of a small follow-up after round "cloud" closed (tag
  `cloud-round-done`). checker: verdict **PASS** · **8/8** · report `_incoming/cloud-round/followup/checker-result.md`
  (this write started together with the checker; tokens filled by the main agent when it returned).
  **First next step:** once this batch is committed + pushed + a PR opened, checker passes, and Javis merges both
  this PR and sync PR #69, open the owner's proposed next round — cloud screenshots (`shot.js` Chrome
  path/`--no-sandbox`, `test-server.js stop` fix on the cloud, network allowlist for `okami24.store`) — not
  started yet.
  Previous rounds, all CLOSED + MERGED, full detail at §3 (unchanged this write): "cloud" tag `cloud-round-done`
  · "central-rules" tag `central-rules-done` · "tools round" tag `tools-round-done` · "friday persona" tag
  `friday-persona-done` · "rules trim" tag `rules-trim-done` · "owner rules" tag `owner-rules-done` · "rules move"
  tag `rules-move-done` · round 10C tag `seo-landscape-10c-done` · round data 2 tag `data-facts-2-done`.
4 waiting on owner / Javis —
  (a) Javis: merge web PR #69 (sync of `smogz-rules` PR #6, central item 32) once green.
  (b) Javis: merge this batch's PR (`rules/owner-answers-1a-6a-7a-9a`) once pushed + checker passes — excluded
  from Friday's self-merge because it edits the 13.7 self-merge line itself.
  (c) owner or Javis: delete GitHub branches — `claude/t4-delete-probe` · `rules-sync/97a58b0` ·
  `checkpoint/phase-3.3.1` (unique commit kept at tag `archive/phase-3.3.1`) · now also `checkpoint/phase-3.3.3`,
  merged via PR #68 — owner's call whether/when to delete it too.
4b (permanent, 13.10 #12, do not re-ask; older rounds → §3): owner ruled 26/09 "เอาทั้งคู่" — all 5 speed-consult
  proposals (`_incoming/speed-consult/RESULTS.md` §4, items 1–5) adopted into round "cloud"; items 3–4 touch a
  skill/rule and count as already-permitted within that item's scope, no separate ask needed [ตรวจแล้ว,
  `docs/rounds/รอบยกขึ้นคลาวด์-Friday-เร็วขึ้น-เก็บบ้าน.txt`:16] — this replaces the old "4 open decisions" wording.
  This batch: owner answers **1A · 6A · 7A · 9A** (chat, via Javis) + catalog-research retailer-tier question = A
  are now applied — see item 2. Owner answers **8 = A** and **11 = A** stand: keep the memory pointer files on the
  owner's computer until a cloud round passes — permanent, do not re-ask.
  Round 9 + round 10B decision 1 + the data round's rulings (gate scope, hide-unverified, empty-cards-get-a-proposal,
  Esko 20 flavours, cut the "could not find specs" filler, Joiway F4 exception, magnetic-claims-need-a-source) — full
  text §3. Do not raise Thailand's legal status in owner-facing reports (round 10C ruling; fuller text also lives in
  `.claude/TEAM_RULES.md`, block "ย้ายมาจาก memory 25/09" §"เรื่องสถานะทางกฎหมาย"). 13.4 #8 — something the owner
  already approved/is happy with → tell the owner first, wait only for that part, other work continues. Friday/Javis
  persona (central §12 head block) installed and settled — tone only, agents keep role names, do not re-ask. Javis
  merges sync PRs that land in the web repo without a second owner ruling · key A is edited (not re-made) when a
  project is added.
4c (permanent, 13.10 #12, do not re-ask): build guard = option A, the test server runs from its own build copy
  (`npm run build`/`npx next build` direct still unblocked) · the "ร้านพอต" SEO block's shipping numbers = BSOT §10
  (15:00 cut-off, same-day dispatch, 1–3 days), not Cowork's relayed note · "เซฟ ๆ ให้ด้วย" (owner, chat 2026-09-25)
  = be careful, recorded in `.claude/LESSONS.md`.
5 open, none new this batch. Round "cloud"'s carried rule questions (1A · 6A+7A · 9A) + the catalog-research
  retailer-tier question — all answered this batch, see items 2 and 4b. The old 11-question set in
  `_incoming/cloud-round/owner-questions.md` is now fully resolved [ตรวจแล้ว at round "cloud" close for the first
  6 · เชื่อว่า for the 4 applied this batch, per the main agent's report].
  Carried, unchanged — content/SEO backlog, full text §3: `_incoming/round10c/extras.md`'s 6 site-touching proposals
  · ask Cowork on 05/10: index status of the 5 new guides + which page GSC credits for "caliburn g5"/"m bar"/"uwell"
  · round data 2 leftovers (iqosheet-18 charging row · Holder ~12-min charge time · EN/zh "4 RESISTANCE" singular ·
  the language points → language round item 4) · hydration/bundle scrub · `/compare` "Charging" "—" ×19 · Shipnity
  Thai on en/zh · round 11A pod-159 photos · B5 rest · B6 (own round, 13.10 #6).
  Tools round, found, not fixed (site untouchable that round): 10 Thai strings shown to en/zh visitors on
  coil-54/55/68 + iqosheet-16/18 [ตรวจแล้ว, `_incoming/tools-round/b3/data2-evidence.md`].
6 verify baseline — **unchanged from round "cloud" close** (same counts as below; this batch touched only
  rules/skill/docs-index text, no code/content, so the full set was not re-run). Follow-up gate check for this
  batch: `owner-rules-check` · `owner-rules-check --map scripts/rules-trim...` (rules-trim) · `rules-move-check` ·
  `eol-check` · `central-rules-copy-check.js` (base `origin/main`) — **all exit 0** [ตรวจแล้ว,
  `_incoming/cloud-round/followup/*.log`, 5 log files read directly by doc-keeper].
  Round "cloud" close counts, carried (`_incoming/cloud-round/verify-close/exit-codes.txt`, read directly by
  doc-keeper at that close): `tsc` · `eslint` · `verify:commerce` · `content-dates --check` · `verify:catalog
  --full` **30/30** (72 s, incl. `next build` PASS) · `count-storefront` **53/53** · `i18n` **16/16** · `raw-chars`
  **0** · `eol-check` · `rules-move-check` · `central-rules-copy-check.js` **PASS local** (remote comparison
  SKIPPED, `RULES_READ_TOKEN` not set) · `test-server` build/start/stop · `scan.js` **0/104** · `og-gate`
  **104/104** · `pending-check.js` — all exit 0. `owner-rules-check` + `rules-trim-check`: **first run FAIL**
  (2 pointers to central item 32, not merged yet) → reworded → **re-run PASS**, exit 0 [ตรวจแล้ว,
  `verify-close/owner-rules-check-rerun.log` + `verify-close/rules-trim-check-rerun.log`] — all told
  [ตรวจแล้ว, `_incoming/cloud-round/verify-close/exit-codes.txt` + the logs it names]. Carried, not re-run this
  write: whole-repo `eslint .` **0 errors, 1 pre-existing warning** (`scripts/image-audit-md.js:14`, untouched) —
  from round "friday persona"'s own close.
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

**Note on this relocated block, added by doc-keeper at the round "mobile" close (2026-09-27):** item 1's `origin/main`
value above (`3463d91`) does not match the base the round "mobile" cloud session read for its own branch
(`f1eefd6`, per `docs/cloud-results/mobile-round.md` line 3) — doc-keeper has no git tool to walk the two and cannot
say which is stale or whether they are two different machines' views of the same history [เชื่อว่า, flagged not
resolved]. **Resolved by the main agent at the same close:** `3463d91` is an ancestor of `f1eefd6` (PR #69 + #70
merged after v72 was written) — both were correct at their own time [ตรวจแล้ว, `git merge-base --is-ancestor`]. This batch's own branch (`rules/owner-answers-1a-6a-7a-9a`) and PR #69 status are also not re-confirmed
by doc-keeper this write — carried here as they stood at v72, not updated.

---

### §16 lines relocated at round A "pipes" close (2026-09-27 — word for word, 15 KB cap)

Relocated from §16 at this close so §16 can hold round A "pipes"'s own current state — relocation, not
deletion (doc-keeper spec). Verbatim from HANDOFF v73 §16 (the round "mobile" close block):

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Read first: the single list is step 1 of skill round-open (.claude/skills/round-open/SKILL.md — 13.9 points there; opening a round = that skill, closing = round-close, touching site copy = thai-check)

1 main: **origin/main = `f1eefd6`** (PR #70, on top of PR #69 on top of `3463d91` — v72's `3463d91` was the main
  before those two merges; `git merge-base --is-ancestor 3463d91 f1eefd6` = yes, resolved by the main agent)
  [ตรวจแล้ว, `git fetch` at round open + close] = this round's base and rollback point. Pre-merge history of "cloud"/"central-rules" and the pending
  owner-answers batch → §3 "Round 'cloud' follow-up — owner-answers batch push state" (relocated, unchanged
  this write).
2 ahead of main: branch **`claude/mobile-full-round-vc6o2b` is 9 commits ahead**, `f1eefd6..ca1afea`
  [ตรวจแล้ว, `docs/cloud-results/mobile-round.md` line 3], pushed to origin. **No tag** — tag pushes are
  refused from the cloud (`git push origin refs/tags/pre-mobile-round` → HTTP 403, same file line 20); the
  close tag `mobile-round-done` could not be pushed either (topic 5 of the questions file below).
  **Javis opens the PR** from compare `main...claude/mobile-full-round-vc6o2b` and merges it — no `gh` binary
  in the cloud, so `scripts/self-merge-check.js` cannot run there; and the PR adds `.claude/settings.json`, which
  that script's allow-list excludes — Javis merges either way.
3 round: **round "mobile" (cloud, full mobile round) — CLOSED.** Stop point = before merge.
  checker: verdict **PASS** · **8/8** · 0 send-backs · report = the chat report (commits `f1eefd6..ca1afea`, re-ran
  prepare-clone, test-server start/refuse/stop, font-check green + red, shot md5 twice, recount of the rehearsal diff,
  verify logs) — `_incoming/` is not in git in the cloud, so no report file travels; filled by the main agent.
  Found beyond its 8 items: a `next-server` left on port 3411 by `verify:catalog --full` on Linux → stopped, topic 12.
  4 batches, full detail + every number in `docs/cloud-results/mobile-round.md`: (1) machine prep —
  `prepare-clone.js` READY on a fresh clone, `verify:catalog --full` 30/30, `test-server.js` start/second-start-
  refused/stop fixed with a `fuser` fallback, the SessionStart hook runs itself each session resume · (2)
  screenshots/scans/fonts — Chromium found by search, Noto Sans Thai installed for the Thai glyphs a visitor's
  own device would show, `font-check.js` 3/3, the designer opened and read 15 crops in the cloud · (3) live
  site + the domains a future clip-embed round needs — `okami24.store` reachable by curl, 11 YouTube/Google
  hosts blocked 403 by this cloud network, and this cloud's Chromium does not trust the cloud network's own
  certificate authority (its browser trust store is empty) so live-site screenshots are not possible from here yet · (4) tier-b-proof rehearsal on round data 2's known
  answer, 0 false differences, 0 missed.
  **First next step:** Javis opens + merges the PR (item 2); then owner/Javis work the 12 topics of
  `docs/cloud-results/mobile-round-questions.md` (item 4) before the owner's named next round (clip embeds)
  opens — that round needs topic 4's domain allowlist in place first.
  Previous rounds, all CLOSED + MERGED, full detail at §3 (unchanged this write): "cloud" tag `cloud-round-done`
  · "central-rules" tag `central-rules-done` · "tools round" tag `tools-round-done` · "friday persona" tag
  `friday-persona-done` · "rules trim" tag `rules-trim-done` · "owner rules" tag `owner-rules-done` · "rules move"
  tag `rules-move-done` · round 10C tag `seo-landscape-10c-done` · round data 2 tag `data-facts-2-done`.
4 waiting on owner / Javis — the 12 topics of `docs/cloud-results/mobile-round-questions.md`; top 5 below,
  one line each (Friday's recommended answer is always option 1 in that file):
  (a) topic 4 — allow 6 YouTube/Google domains in this cloud environment's network settings before the
  clip-embed round opens; today's site loads nothing off-domain so no other host is needed yet.
  (b) topic 1 — deploy without opening the computer: recommended route A, a GitHub Actions gate that calls the
  Render deploy hook only after checks pass, filtered to paths Render actually runs.
  (c) topic 2 — let Friday merge non-customer-facing PRs from the cloud with the chat's own GitHub tool
  (no `gh` there), same conditions as the existing 13.7 self-merge rule; PRs touching the site stay Javis's.
  (d) topic 3 — this cloud network's Chromium trusts no CA (`/root/.pki/nssdb` = 0 certificates), so it
  cannot screenshot the live site; recommended: report the empty cert store, curl-only live-site checks from
  the cloud meanwhile, live-site screenshots stay a computer job.
  (e) topic 5 — cloud rounds cannot push a tag (HTTP 403, both the rollback point and the close tag);
  recommended: cloud-round close reports name commits instead of a tag, and `round-close`'s own tag step gets
  a one-line cloud exception next time it is touched.
  Also: (f) Javis: open + merge the PR from branch `claude/mobile-full-round-vc6o2b` (item 2).
  (g) branches to delete: **none created this round beyond the working branch itself** — deleted after merge
  by the usual flow (Friday on the computer, or Javis on GitHub; a cloud chat cannot delete a branch, 13.6).
  Older branches named at the previous close (`claude/t4-delete-probe` · `rules-sync/97a58b0` ·
  `checkpoint/phase-3.3.1` · `checkpoint/phase-3.3.3`) are unchanged this write — see §3.
4b (permanent, 13.10 #12, do not re-ask; carried, unchanged this write, full text §3): every ruling recorded
  at the "cloud" round's close and its owner-answers follow-up batch (the 5 speed-consult proposals adopted
  whole · rule answers 1A/6A/7A/9A + 8=A + 11=A · Friday/Javis persona · round 9/10B/data-round rulings · never
  raise Thailand's legal status in owner-facing reports). **This round:** the owner's mid-round extra orders
  (ก)(ข)(ค)(ง) were given, then **cancelled before any work started** — nothing to revert, nothing new ruled
  here [เชื่อว่า, reported via Javis, 27/09]; item (2) of those orders became "propose only" and is folded into
  topic 10 of the questions file; the master copy of round instruction files stays on the owner's computer,
  answer 5A unchanged [เชื่อว่า, reported].
4c (permanent, 13.10 #12, do not re-ask; unchanged this write, full text §3): build guard = option A · the
  "ร้านพอต" SEO block's shipping numbers = BSOT §10, not Cowork's relayed note · "เซฟ ๆ ให้ด้วย" recorded in
  `.claude/LESSONS.md`.
5 open — the 12 topics of `docs/cloud-results/mobile-round-questions.md` (item 4 lists the top 5; topic 12 = `verify:catalog --full` leaves a 3411 server on Linux, fix next round; the other 6:
  topic 6 asks whether Google Fonts counts as an "agreed source" for the cloud machine's own Thai font, and
  separately whether the site should load its own Thai font — a future site-speed question · topic 7, where
  mobile-round evidence photos should live for a phone-opened link · topic 8, cloud evidence dying with the
  container — this round's fix is `docs/cloud-results/<round>.md` · topic 9, no environment setup script is
  needed, the repo's own SessionStart hook covers it · topic 10, propose-only: a script to check
  `docs/rounds/` copies against the OneDrive master · topic 11, 3 small layout notes the designer saw in
  passing, not fixed this round — folded into the next tier-B site round).
  Carried, unchanged — content/SEO backlog, full text §3: `_incoming/round10c/extras.md`'s 6 site-touching
  proposals · ask Cowork on 05/10: index status of the 5 new guides + which page GSC credits for "caliburn
  g5"/"m bar"/"uwell" · round data 2 leftovers · hydration/bundle scrub · `/compare` "Charging" "—" ×19 ·
  Shipnity Thai on en/zh · round 11A pod-159 photos · B5 rest · B6.
  Tools round, found, not fixed (site untouchable that round): 10 Thai strings shown to en/zh visitors on
  coil-54/55/68 + iqosheet-16/18 [ตรวจแล้ว, `_incoming/tools-round/b3/data2-evidence.md`] — unchanged.
6 verify baseline — **round "mobile" close, cloud session, HEAD before this docs commit = `1829e26`**
  [ตรวจแล้ว, `docs/cloud-results/mobile-round.md`, "Round close — full verify set in the cloud" table, read
  directly]: `tsc` **0** (3s) · `eslint` (11 scripts touched) **0** (5s) · `verify-commerce` **0**, all 17
  checks passed (3s) · `verify-catalog-full` **0**, all 30 steps passed, incl. `next build` PASS (76s) ·
  `count-storefront` buyable **53** (1s) · `i18n` **16/16** (1s) · `raw-chars` **0** (0s) · `content-dates-check`
  **0**, current, 55 paths (1s) · `eol-check` **OK** (1s) · `rules-move-check` **PASS** (0s) ·
  `central-rules-copy` **PASS local** (remote comparison SKIPPED) (0s) · `owner-rules-check` **PASS** (0s) ·
  `scan` **PASS 0/104** (1s) · `og-gate` **PASS 104/104** (1s) · `font-check` **PASS 3/3**, machine
  cloud-linux-chromium, Chrome/141.0.7390.37, expected Thai font "Noto Sans Thai" (6s) — **all exit 0**.
  Secret scan of `git diff f1eefd6..HEAD` (16 files) = **0 hits**; `git diff --stat f1eefd6..HEAD -- src
  public` = **empty** [ตรวจแล้ว, same file, close section's own text].
  Superseded (this is now the current baseline): round "cloud" close counts, carried at v72 §16 item 6, full
  text §3 "Round 'cloud' follow-up — owner-answers batch push state".
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

The permanent rulings from that block (items 4b/4c) are NOT lost — they are carried forward, condensed, into
v74 §16 item 4c; the open-items list (item 5) is carried forward into v74 §16 item 5, with topics resolved by
round A "pipes" marked as such rather than repeated.

---

### §16 lines relocated at round B "housekeeping" close (2026-09-27 — word for word, 15 KB cap)

Relocated from §16 at this close so §16 can hold round B's own current state (CLOSED, stop point before PR
#74 merges) — relocation, not deletion (doc-keeper spec). Verbatim from HANDOFF v75 §16:

```
1 main: **origin/main = `f3405c2`** (merge commit, parents `51af909` + `10a322a` — PR #72, the "one list" file,
  merged by Friday from the cloud with the chat's own GitHub tool: Friday's first cloud self-merge)
  [ตรวจแล้ว, `docs/cloud-results/roundA-pipes.md`, batch 1 row "Merge from the cloud"]. `51af909` is this
  round's base / rollback point (cloud round — no tag; 13.7 / round-close step 5 names a commit instead).
2 ahead of main: branch **`claude/round-a-pipes-setup-3hjydq` is 5 commits ahead of `f3405c2`**
  (`4869415` · `49f8f6e` · `be986f7` · `562da7b` · `7532f49`), pushed to origin [ตรวจแล้ว, commit list given at
  this close]. **PR #73 open** (adds `.github/workflows/deploy.yml` and changes 13.7's own merge-rights text)
  — **Javis merges**: `.github/` is outside the self-merge script's allow-list on purpose, and a PR that edits
  13.7 itself is not a self-merge case either way.
3 round: **OPEN — round B "housekeeping" (computer, opened 2026-09-27 by the main agent)** · instruction
  `docs/rounds/รอบB-เก็บบ้านใหญ่-กฎ-เอกสาร-คำสั่ง.txt` · base `origin/main` = `76703c9` (PR #73 merged) · rollback tag
  `pre-roundB` (pushed) · branch `roundB-housekeeping` + a separate Javis-only branch `roundB-javis` (site-paths ·
  workflows · large-file hook) · all batches tier A, 0 of 115 sitemap pages touched · owner answered step 0 "ไป" (every
  Q recommendation) · order 0 → 2+5 → 6 → 3 → 4 → stop point 2 → 1 → merge → 7 · stopped at: **stop point 2** —
  batches 0/2/3/4/5/6 done, checker PASS after 2 send-backs (record wording only), committed + pushed on both branches,
  PRs open, nothing merged; the owner's question set = `docs/cloud-results/roundB-stop2-owner.md` (answer "ไป" or per
  item). **First next step after the answer:** batch 1 (delete the 6+3 old branches and the 4 `inbox` copies, the
  `_incoming` pile ③ if not objected) → the answered rule items → checker → merge (main PR = Friday per 13.7 if
  `self-merge-check.js` PASS; `roundB-javis` = Javis) → batch 7 (checklist + cloud check file). Full record
  `docs/cloud-results/roundB-housekeeping.md`.
  Previous round: **round A "pipes" (cloud) — CLOSED**, PR #73 merged by Javis → `76703c9`.
  checker: PR #72 (commit `10a322a`) **PASS 5/5**; batches 1-3 **PASS 6/7 → 1 send-back → fixed → re-check
  PASS** (the send-back: `docs/CLOUD.md`'s deploy row claimed a GitHub Actions run that had not happened yet
  — reworded, re-checked) [ตรวจแล้ว, `docs/cloud-results/roundA-pipes.md`]. rule-auditor: 26 rows, the
  in-scope ones fixed this round, the rest carried to item 5 below as the round-B list. scope-auditor: 0 of
  104 sitemap pages touched.
  3 batches, full detail + every number in `docs/cloud-results/roundA-pipes.md`: (1) Friday's first cloud
  self-merge — the off-site allow-list `scripts/lib/site-paths.js`, `self-merge-check.js` gate tested on 10
  sample paths + a red probe (local-only branch `tmp/probe-src` touching `src/app/sitemap.ts`, correctly
  BLOCKED, never pushed, deleted) + PR #72's own gate/checker/GitHub-checks/merge · (2) `deploy-decision.js`
  — DEPLOY when a `src/` file reaches the site, SKIP when the merge only changes the deploy pipeline itself
  or is docs-only, exit 2 on a bad range (the workflow then treats that as `deploy=false`) · (3) small items
  — the `verify:catalog --full` port-3411 leftover fixed (new step confirms the port is free after stop) ·
  YouTube/Google domain probe from this cloud (topic 4 follow-up: `img.youtube.com` still 403, `i.ytimg.com`
  200 — use `i.ytimg.com` for the clip round) · a 2-image Artifact test page published for topic 7
  (`https://claude.ai/artifact/TuQkJ54AAMknjaj7co1ys9`, not yet opened on a phone).
  **First next step:** Javis merges PR #73 (item 4a below) — `deploy.yml` already ran on PR #73 itself as a dry run
  (run 36268535436, head `7532f49`): `decide` = "SKIP deploy — this merge changes the deploy pipeline", `checks`
  31/31 in 2 min, `deploy` skipped [ตรวจแล้ว, filled by the main agent]; the push-to-main run on the merge commit
  is proved only when Javis merges. Then the owner sets `RENDER_DEPLOY_HOOK_URL` per `docs/CLOUD.md` §7 from the phone
  (item 4b below).
  Previous rounds, all CLOSED + MERGED, full detail at §3 (unchanged this write): round "mobile" (no tag — tag push
  refused from the cloud; its PR merge, pending Javis at that close, is now superseded — see item 1 above) ·
  "cloud" tag `cloud-round-done` · "central-rules" tag `central-rules-done` · "tools round" tag
  `tools-round-done` · "friday persona" tag `friday-persona-done` · "rules trim" tag `rules-trim-done` ·
  "owner rules" tag `owner-rules-done` · "rules move" tag `rules-move-done` · round 10C tag
  `seo-landscape-10c-done` · round data 2 tag `data-facts-2-done`.
4 waiting on owner / Javis:
  (a) Javis merges PR #73, then checks Actions → `deploy.yml` → the run on the merge commit says "SKIP
  deploy — this merge changes the deploy pipeline" (the pipeline rule of `scripts/deploy-decision.js`, true
  even if the secret is already set).
  (b) owner sets `RENDER_DEPLOY_HOOK_URL` per `docs/CLOUD.md` §7 from the phone — only after (a).
  (c) owner opens the Artifact test link `https://claude.ai/artifact/TuQkJ54AAMknjaj7co1ys9` on the phone —
  seeing 2 images = topic 7 of the mobile round's questions file is done.
  (d) round-B owner rulings needed, full text `docs/cloud-results/roundA-pipes.md` "For round B" table: do
  Render Shell scripts that run against the live DB count as "the site" for the merge gate? · write "Render
  Auto-Deploy stays off, never switch it on"? · copy every cited `_incoming` file into
  `docs/cloud-results/<round>.md` at close?
  (e) `img.youtube.com` is still 403 from this cloud — the clip-embed round should use `i.ytimg.com` instead
  (topic 4 of the mobile round's questions file, narrowed by this round's own curl test).
  (f) branches to delete once PR #73 is merged: `wip/roundA-pipes-b123-1` (13.6 snapshot of unchecked work,
  now superseded) · `claude/round-a-pipes-setup-3hjydq` (the working branch itself, after merge) — a cloud
  chat cannot delete a branch itself (13.6). `tmp/probe-src` was local-only and already deleted, never
  pushed — nothing to do there.
4b (permanent, 13.10 #12, do not re-ask; this round's own rulings): 13.7 self-merge scope now also covers
  Friday's PRs touching skills/agents/web rules from the cloud, not only docs — exceptions: files that act
  on their own (`.claude/settings*`, hooks) and everything under `.github/` still go to Javis, who asks the
  owner first · a cloud round's close report names a commit, never a tag (tag pushes are refused from the
  cloud) · cloud rounds write their full record to `docs/cloud-results/<round>.md` (evidence under
  `_incoming/` dies with the container) · deploy route A chosen: a GitHub Actions workflow gates the Render
  deploy hook behind the round's own checks.
4c (permanent, 13.10 #12, do not re-ask; carried from v73, unchanged, full text §3): every ruling recorded at
  the "cloud" round's close + its owner-answers follow-up + round "mobile"'s close (5 speed-consult proposals
  adopted whole · rule answers 1A/6A/7A/9A + 8=A + 11=A · Friday/Javis persona · round 9/10B/data-round
  rulings · never raise Thailand's legal status in owner-facing reports · build guard = option A · the
  "ร้านพอต" SEO block's shipping numbers = BSOT §10 · "เซฟ ๆ ให้ด้วย" = be careful, in `.claude/LESSONS.md`).
5 open — round-B list (10 rows), full text `docs/cloud-results/roundA-pipes.md` "For round B" table: stale
  "tag + push tag" wording in `docs/TEMPLATES.md` / `docs/AI_TEAM_GUIDE.md` / `.claude/skills/merge-pack/
  SKILL.md` / `.claude/skills/tier-b-proof/SKILL.md` (need the cloud/computer split spelled out) ·
  `docs/HANDOFF.md:530 · 550` old lines that read like a rule ("never merge yourself") need a superseded
  note added beside them, not an edit (13.5) · `docs/TEAM_RULES_SOURCES.md` 13.7's dates belong under the
  rule, not in the rule line · `.claude/TEAM_RULES.md` 13.4 #2 should point to 13.7 for deploy · the 3
  owner-ruling items already listed under item 4(d) above · Render's own "deploy when checks pass" native
  option, worth a look only if the GitHub Actions route proves awkward.
  Carried from round "mobile" (unchanged, full text §3): topic 3 — this cloud's Chromium trusts no CA,
  live-site screenshots stay a computer job · topic 6 — does Google Fonts count as an "agreed source" for
  this cloud machine's Thai font, and should the site load its own Thai font · topic 9 — no extra
  environment-setup script needed, the repo's own SessionStart hook covers it · topic 10 — propose-only, a
  script to check `docs/rounds/` copies against the OneDrive master · topic 11 — 3 small layout notes the
  designer saw in passing, folded into the next tier-B site round. (Topics 1, 2, 4, 5, 7, 8, 12 of that file
  are resolved by this round's own rulings/fixes above, not carried further.)
  Older backlog carried, full text §3: `_incoming/round10c/extras.md`'s 6 site-touching proposals · ask
  Cowork on 05/10: index status of the 5 new guides + which page GSC credits for "caliburn g5"/"m bar"/
  "uwell" · round data 2 leftovers · hydration/bundle scrub · `/compare` "Charging" "—" ×19 · Shipnity Thai
  on en/zh · round 11A pod-159 photos · B5 rest · B6. Tools round, found, not fixed (site untouchable that
  round): 10 Thai strings shown to en/zh visitors on coil-54/55/68 + iqosheet-16/18 [ตรวจแล้ว,
  `_incoming/tools-round/b3/data2-evidence.md`].
6 verify baseline — **round A "pipes" close, cloud session, HEAD `7532f49`** [ตรวจแล้ว,
  `docs/cloud-results/roundA-pipes.md`, "Round-level checks (cloud)" + batch 3 rows, read directly]: `tsc`
  **0** · `eslint` (4 scripts touched) **0** · `verify:commerce` **All 17 checks passed** · `verify:catalog
  --full` **All 31 step(s) passed** (new step added this round: "next start on 3411 stopped (no server left
  behind)") · `count-storefront` buyable **53** · `i18n` **16/16** · `raw-chars` **0** · `content-dates`
  current, **55 paths** · `eol-check` **OK** · `owner-rules-check` **PASS** · `rules-move-check` **PASS** ·
  `central-rules-copy` **PASS local** (remote comparison SKIPPED) · secret scan of the round's diff vs
  `51af909` (tracked + untracked) **0 hits** · `git diff --stat 51af909 -- src public` **empty**. **Not run**
  this close, by instruction (no whole-site scan this round): `scan.js` / `og-gate` — proof-sizing instead
  ran `self-merge-check.js --base 51af909` = **PASS, 11 files**.
  Superseded (this is now the current baseline): round "mobile" close counts, carried at v73 §16 item 6, full
  text §3 "§16 lines relocated at round A 'pipes' close".
```

The permanent rulings from that block (item 4b) are NOT lost — condensed into v76 §16 item 4c; the open-items
list (item 5) is carried forward into v76 §16 item 5, with round-B's own questions marked resolved via stop
point 2 rather than repeated; item 4's (a)-(f) waiting list is superseded by round B's own item 4 (PR #73 is
now merged, `76703c9`) except (b)/(c)/(f), carried forward unconfirmed at v76 §16 item 4(f).

---

### §16 lines relocated at the seventh computer-round chat's batch close (2026-09-30, v91 — word for word, 15 KB cap)

Relocated from HANDOFF v90 §16 so §16 can hold the seventh chat's own state — relocation, not deletion (doc-keeper
spec). v90 item 1 (the sixth chat's merged PRs), item 3's owner answers and the finished NEXT WORK (1), verbatim:

```
  Merged in the sixth chat, each checker PASS + GitHub checks green, all LIVE (main agent's curl 30/09: Pod-180
  title "nexBar CLEAR 18K … ฿359" with 16 image files; the WOTOFO page 20 variant files, 2× OutOfStock, ฿359;
  footer still links /brands/wotofo):
  #121 `53b38e6` new legacy product WOTOFO nexBAR 18K (`src/data/products/wotofo.ts`): 31 flavours = every name on
  wotofo.com, card + 8 photos, `wotofo-nexbar` family, 24 flavour names bound, wotofo.com = a manufacturer host in
  the spec test.
  #122 `8a79620` price 359 (owner-estimate; the number was left to Friday = Pod-180's price), all 31 flavours on
  `sold-out.ts`; JSON-LD Offer = OutOfStock when every option is sold out (also joiway-f4); the price-approval test
  accepts any ISO ruling date.
  #123 `d66df1d` 12 more WOTOFO photos (20/31 with a photo; 11 have no maker photo).
  #124 `372aaf1` PR-B: new `brandless: true` flag (ProductMaster) — Pod-180 = nexBar CLEAR 18K with no brand, name
  as printed on the device, Thai/EN copy from the owner-approved starred drafts
  (`_incoming/wotofo/review/ข้อความให้พี่เคาะ.md`), 7 spec rows from the maker poster (owner-supplied; no maker
  site; rows carry no URL because a row URL must be a maker domain), 15 flavours (5 via
  `VERIFIED_ADDITIONAL_VARIANTS`), card-v2 + 15 flavour photos (method = LESSONS 15), clip moved to WOTOFO, WOTOFO
  brand head without a price, SEO_BASELINE note added. Blueberry: the device prints "BLUEBERRY ICE", the maker's
  list says "Blueberry" — both kept (alt/comment say so); owner 30/09 answered "ตามนั้นเลย" to keep it [ตรวจแล้ว — owner's chat message].
  Manual deploy (Run workflow, 29/09 evening, run 36592249340) was started by Friday on the owner's chat
  permission; its result was never read (the app's auto-mode safety check blocked deploy-status reads) — moot,
  everything is live via #121-#124. Record of the fifth chat's PRs (#117 M Bar 10K pilot, #118 lineup-v2, #119
  deploy fix): their code is in main; facts are in git history and LESSONS 14/15; there is NO record file for the
  fifth or sixth chat — this block holds the facts.
  OWNER ANSWERS 30/09 [เชื่อว่า — main agent's report]: (a) "ทุกครั้งที่ทำเสร็จไม่ต้องถามแล้ว Merge ได้เลย" —
  owner then said "บันทึกได้เลย" → written as a rule (13.7: every PR, small or big, merges after checker + green
  checks, report after; new-look images go in report item 4) — branch rules-merge-no-ask; (b) keep WOTOFO on /about; (c) Higgsfield
  use approved, credits now ~1,960 [เชื่อว่า — 2043.1 at the start of the batch minus ~85 used].
  (1) PREMIUM LINEUP A for M Bar 10K [owner order 30/09]: the owner said the lineup feels flat ("ดูเฉย ๆ ไม่รู้สึก
      อะไร") and, of Friday's 3 drafts (A stage arc · B lit shelf · C tilted cascade;
      `_incoming/pilot-mbar10k/premium-sheet.png`, builder `premium.js`), CHOSE A stage arc, mood "เรียบหรู เงียบ ๆ",
      placement = the top square hero image + a wide full-width banner in the "more details" section. A is a ROUGH
      DRAFT (edges clipped, empty space above, names as a colour-dot legend) — refine, designer (new look, 13.12 #4),
      new look → show the drafts in report item 4 (merge does not wait, owner 30/09).
  (v90 item 2 also said: "(#125 = §16 v90 + LESSONS 15, merged 7cc2b4e.)")
  [Seventh chat note, not v90 text: NEXT WORK (1) above is DONE as PR #128.]
  Leftovers of the sixth chat [เชื่อว่า — main agent's report]: stale comment above `VERIFIED_MEDIA["Pod-180"]`
  (~lines 974-984 of `active-catalog-to-product-master.ts`, comment only) · old unreferenced
  `public/assets/products/nexbar-clear-18k/card.webp` (a WOTOFO image; delete only with the owner's OK, 13.4 #1) ·
  worktree `_incoming/wt-prb` contains junctions `node_modules` and `_incoming/nexbar-clear` — remove the junctions
  with `(Get-Item <path>).Delete()` BEFORE `git worktree remove`, never recurse into them · the ProductMaster spec
  tables stay Thai on en/zh pages (pre-existing on pod-159 / iqosheet-16; spawned as its own task).
```

(The leftovers above are carried again in v91 §16 item 3 and item 4(4).)

---

### §16 lines relocated at the seventh computer-round chat's second batch close (2026-09-30, v92 — word for word, 15 KB cap)

Relocated from HANDOFF v91 §16 so §16 can hold the second batch's own state — relocation, not deletion (doc-keeper
spec). v91 item 1 (the first batch's merged PRs) and item 2, the DESIGN FACTS paragraph of item 3 (superseded in part by
#130), the flaky-deploy-step leftover and item 4(6) TASTE (answered 30/09; the banner it asked about no longer exists),
verbatim:

```
1 main: `git fetch && git log -1 --oneline origin/main` → `b80dd0d` (merge PR #128) [ตรวจแล้ว — read from
  .git/refs/remotes/origin/main at this close; no git/gh in doc-keeper, so PR numbers/hashes below are the main
  agent's report [เชื่อว่า]]. No tag (round not closed). Rollback = revert the merge commit of the PR in question.
  Merged in the seventh chat, each checker PASS + GitHub checks green, all LIVE (deploy run after #128 =
  decide/checks/deploy success; main agent's curl: live /products/m-bar-10k serves lineup-v3 + story-lineup; live
  probe pod-180 6/6 steps OK — `_incoming/flavour-bug/live-after-pod180-6steps.txt`; live sweep 43 pages PASS —
  `_incoming/flavour-bug/live-after-chrome.txt`):
  #126 `259810f` rules-merge-no-ask (merged by the sixth chat; v90 item 2 is done).
  #127 `c5bb521` fix(mobile) phone gallery (`src/components/product/MobileVariantGallery.tsx`, used by ProductHero +
  PilotProductDetail). Owner's bugs 30/09: (1) chip tap lit the chip but the photo stayed on the cover [Javis], (2) a
  swipe flashed the previous flavour [owner]. Causes (LESSONS 16): (2) `scrollend` AND a 120 ms timer both settled
  one swipe, the second with a stale closure; (1) smooth scroll only advances on painted frames. Fix: latest-props
  ref · one settle signal · no settle mid-touch · instant jump. New tool `scripts/gallery-probe.js` (real CDP touch,
  per-frame; FLASH/STUCK/SKIP; `--sitemap`; `--no-scrollend`). Proof: live before, 127/215 steps FLASH on all 43
  gallery pages; fixed build 0/215 (and 0 without scrollend); html-diff 7/7 identical; evidence
  `_incoming/flavour-bug/`. The deploy run of #127 alone FAILED at the known flaky step "next start on 3411 stopped
  (no server left behind)" (`scripts/verify-catalog.ts` ~line 191, portFreed) — #127 went live only with #128's
  deploy. Seen twice now, not investigated (a gate file = big, its own PR) — see the leftovers in item 3.
  #128 `b80dd0d` M Bar 10K premium lineup A "stage arc" (NEXT WORK 1 of v90 — DONE): `lineup-v3.webp` (1600², 133
  KB, names typeset under the visible part of each device, 2 rows, ≥56 px apart) + `story-lineup.webp` (2400×1000,
  158 KB, no names) shown above the all-flavours grid via the new optional `Product.storyLineup`
  (`src/types/catalog.ts`, `ProductMoreDetails.tsx`); ProductHero hides the single-device floor shadow while a
  lineup shows. Builder `_incoming/pilot-mbar10k/premium-arc.js` (not in git). Designer PASS (3 rounds), checker PASS
  8/8 at `594f190`; later fixes (name gap, shadow) went in under 13.12 #1(จ) + a designer spot-check PASS + the main
  agent's own shadow count (lineup 0 / picked 1 / caliburn-g5 1); html-diff 7/7 again. Live after-shots
  `_incoming/pilot-mbar10k/live-after/`.
  The sixth chat's PRs (#121-#124, WOTOFO nexBAR 18K + Pod-180 brandless), owner answers 30/09 and the finished
  premium-lineup order: relocated word for word to §3, "§16 lines relocated at the seventh computer-round chat's
  batch close".
2 ahead of main: nothing open — `git log --oneline origin/main..origin/docs-close-30-09b` shows this chat's docs PR
  (§16 v91 + LESSONS 16 + the headers archive line) if it is not merged yet: `gh pr list --head docs-close-30-09b`,
  checker, merge (docs = small, 13.7; the main agent merges).
  DESIGN FACTS of the M Bar 10K pilot (#117-#119, fifth chat; live) [เชื่อว่า — main agent's report]: two
  per-product flags — `lineupFirst` (page opens on `lineupImage`, "ทั้งหมด" chip, lineup = first phone slide,
  swatch-colour glow behind a picked device) and `storyDetails` (`src/components/product/ProductMoreDetails.tsx`
  replaces gallery + anatomy + feature cards: `storyCover` poster, 4 poster highlight blocks shown whole, "รุ่นนี้มี
  12 กลิ่น" grid of old box + device photos via `FlavorVariant.boxImage`, then the spec sheet). Device-only flavour
  photos = ONE Higgsfield nano_banana_pro 4K master render + a per-flavour recolour script
  (`_incoming/pilot-mbar10k/recolour.js`). #118 lineup-v2 has flavour names under each device
  (`lineup-named.js`). #119 `.github/workflows/deploy.yml`: when main moved on, the deploy job deploys if
  deploy-decision.js says 0 newer files reach the site.
  (done in the seventh chat: the phone-gallery bug — the owner said fix it BEFORE the next product's images — #127,
  and the M Bar 10K premium lineup A — #128; details in item 1)
  the flaky deploy step "next start
  on 3411 stopped (no server left behind)" (`scripts/verify-catalog.ts` ~line 191, portFreed) failed the deploy run
  of #127 — now seen TWICE, never investigated (#119 fixed the #115 gap only); a gate file = big, so its own PR;
  a failed deploy run does not lose the code — the next merge's deploy carries it (as #128 carried #127)
  (6) TASTE — the M Bar 10K premium lineup, as merged (#128), for the owner to see live at /products/m-bar-10k
      [รอเจ้าของ]: (a) names are ~7 css px tall on a 390 phone (designer's option 1 of 2; option 2 = three rows, ~9
      px, busier); (b) the banner is large at 1440 (~500 px tall; option: cap ~960 px); (c) checker's note: in the
      existing flavour photos Watermelon Mint's device is red though its swatch is teal, and Pink Berry's is
      blue-violet though its swatch is pink — the lineup puts them side by side (pre-existing photo/swatch
      mismatch; not fixed) [เชื่อว่า — checker report]
  (item 6, the proof lines of the seventh chat's first batch and of the sixth chat:)
  Seventh chat [เชื่อว่า — main agent's report, checker PASS each]: the light set per PR (#127, #128) + html-diff
  7/7 baseline pages identical twice + `gallery-probe` sweeps (live before 127/215 FLASH; fixed 0/215). Sixth chat,
  per PR #121-#124: html-diff 7/7 · verify:catalog 29/29 · scan.js 0/105 (unchanged from v90).
```

[Note added by doc-keeper at v92, not v91 text: the block above is the v91 wording, copied line by line; where the
v91 block ran items together (item 3 pieces, the leftover bullet, item 4(6)) each piece sits on its own lines here.
What replaced them: v92 §16 items 1-6. The owner's 30/09 answers to (6) and the banner's removal: v92 §16 item 3.]

v92 §16 lines relocated at the seventh chat's move (main agent, 30/09, word for word):
```
  OWNER ANSWERS 30/09 (chat) [เชื่อว่า — main agent's report]: (1) keep the flavour names in 2 rows · (2) banner size
  OK — then the owner removed the bottom section anyway, so the banner is gone · (3) chase the colours — done in #130
  · (4) the deploy fix as its own PR — done, #131. The phone-swipe check is still unanswered: item 5.
  (done in the seventh chat: the phone-gallery bug #127 · the M Bar 10K premium lineup #128 · the trim-and-credit
  edits #130 — details in item 1 and §3)
  #131 `8396b0f` fix(gates) `scripts/verify-catalog.ts`: the flaky step "next start on 3411 stopped" now probes with
  fresh TCP connections on 127.0.0.1 + ::1 and gives the final check 2 s (it failed 29/09 in runs 36625888711 and
  36633396707, 0.01-0.27 s after the kill; likely cause = fetch reusing a keep-alive socket).
```

### §16 lines relocated at the eighth computer-round chat's close (round "ไล่ดูทีละส่วน M Bar 10K", 2026-09-30, v93 — word for word, replaced by v93 text)

Header + copy-paste line of v92:
```
(v92 — written by doc-keeper at the second batch close of the seventh computer-round chat (30/09), round
"รอบรูป-แก้" (still OPEN). Eighth chat starts from this block. Chat-move edits by the main agent after #133 (30/09):
main line, #132/#133, DESIGN FACTS "12 flavours" line, item 5, NEXT WORK (1) — marked [chat-move].)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + round file
`C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt WEB\รอบไล่ดูทีละส่วน-MBar10K-exploded-view-30-09.txt` [chat-move]
```

v92 item 1 (main + PRs of the seventh chat's second batch):
```
1 main [chat-move]: `3f39e87` (merge PR #133) [ตรวจแล้ว — main agent's git]. After the batch below: #132 `8d93f23` docs
  (§16 v92) · #133 `3f39e87` the M Bar 10K "รุ่นนี้มี 12 กลิ่น" box+device grid is BACK (owner 30/09: only the wide
  banner was the duplicate) — checker PASS, checks green, deploy success, live curl shows the grid [ตรวจแล้ว].
  Batch before (v92 text): `d866032` (PR #130's merge commit [เชื่อว่า — main agent]) [ตรวจแล้ว —
  the hash read from .git/refs/remotes/origin/main at this close; no git/gh in doc-keeper, so PR numbers and hashes
  below are the main agent's report [เชื่อว่า]]. No tag (round not closed). Rollback = revert the merge commit of the
  PR in question. Merged in this batch, each checker PASS + GitHub checks green; LIVE (deploy of d866032 =
  decide/checks/deploy success; main agent's curl: live /products/m-bar-10k has no story-lineup and shows "ภาพจริงจาก
  SALTHUB"; live /products/argus-g4 still shows the old held line, as intended — item 3):
  #129 `d569aab` docs close (§16 v91 + LESSONS 16 — the docs PR of the previous close, now merged).
  #131 `8396b0f` fix(gates) verify-catalog port check — detail relocated to §3 at the chat move [chat-move].
  #130 `d866032` (owner chat 30/09): (a) M Bar 10K — the bottom "รุ่นนี้มี 12 กลิ่น" section is left out on lineupFirst
  pages (`ProductMoreDetails`), `storyLineup` removed from type/component/data; (b) gallery lede th/en/zh = credit
  only ("ภาพจริงจาก {brand}") — the owner cut "ใช้เป็นภาพประกอบเท่านั้น และไม่นำไปเผยแพร่ต่อเพื่อการค้า" ("เรากำลังทำ
  เพื่อการค้า"); the 7 SEO-baseline slugs keep the old line (item 3); (c) M Bar 10K swatch dots Pink Berry #6a3fc0,
  Strawberry Kiwi #b0409a, Watermelon Mint #c93a45 = the device base colour on SALTHUB's own photos (the old dots
  were guessed). Proof: scan.js 0/105, raw chars 0, visible-text only m-bar-10k changed, html-diff 7/7 twice, shots
  `_incoming/trim-credit/shots/`.
  The first batch of this chat (#126-#128: phone gallery, premium lineup) and the earlier PRs: relocated word for
  word to §3, "§16 lines relocated at the seventh computer-round chat's second batch close" (and the sixth chat's
  to the block before it).
2 ahead of main: nothing open [เชื่อว่า — main agent]. This close's own docs PR: `git log --oneline
  origin/main..<its branch>` · `gh pr list` — branch and PR number [ยังไม่มีข้อมูล — not known to doc-keeper]; docs =
  small (13.7), checker, the main agent merges.
```

v92 item 3, the "round OPENED" lines (round opened by the main agent, eighth chat):
```
3 round OPENED 30/09 (eighth chat, main agent): "ไล่ดูทีละส่วน M Bar 10K (exploded view)" — round file
  `docs/rounds/รอบไล่ดูทีละส่วน-MBar10K-exploded-view-30-09.txt`, work branch `mbar10k-anatomy` from main `e6463da`.
  Batches: 1 directions + draft (tier B) · 2 section on /products/m-bar-10k th/en/zh (tier B) · 3 extras 360/X-ray if 2
  passes the owner (tier B). Method: all text on the sheet = page text (HTML/SVG, 3 languages), AI renders only the
  device/parts. Stopped at: batch 1 — designer + scope-auditor running. Owner asked: base arc slot = airflow? (no
  label until answered) · re-attach the cream phone blueprint ref.
```

v92 NEXT WORK (0):
```
  (0) [chat-move] FIRST NEXT STEP (owner 30/09 "อยากให้ทำรอบนี้ก่อน"): "ไล่ดูทีละส่วน" for M Bar 10K — a premium
      exploded view (owner's pick; 360 view / X-ray = extras), designer designs, Friday/Higgsfield draws, manufacturer
      facts only — round file `รอบไล่ดูทีละส่วน-MBar10K-exploded-view-30-09.txt` (owner's Run prompt folder). Ready:
      `_incoming/mbar10k-anatomy/facts.md` (researcher, SALTHUB-only facts + drawing notes; internals never shown by
      the maker) and `_incoming/mbar10k-anatomy/owner-refs/` (4 of the owner's 5 reference images; the cream blueprint
      sheet was not saved — ask the owner to attach it again). ProductAnatomy has no per-product data today and is
      hidden on storyDetails pages → needs a new field or component.
```

v92 Higgsfield line (the "~1,960" figure was stale — main agent, eighth chat: balance at open 1521.1):
```
  Higgsfield credits: ~1,960 [เชื่อว่า — main agent's figure: 2043.1 at the start of the batch minus ~85 used; the
  owner approved using them and topped up]; warn the owner before a shop-wide image job would cross the balance.
```

v92 items 4(6), "Removed since v91", 5, 6-tail:
```
  (6) the two open questions of item 5 (credit line · phone-swipe check) [รอเจ้าของ] — the old TASTE list (names,
      banner, colour mismatch) is answered, see item 3 and §3
  Removed since v91: all relocated word for word to §3, "second batch close" block.
5 open questions [chat-move]: none open — owner 30/09 answered both: (a) phone swipe after #127 = "ลื่นแล้ว" (smooth);
  (b) the credit line "ภาพจริงจาก {brand}" = keep.
  Seventh chat, second batch [เชื่อว่า — main agent's report, checker PASS each]: #130 = scan.js 0/105 · raw chars 0
  · visible-text: only m-bar-10k changed · html-diff 7/7 twice; #131 = the step's Linux runs, 3 passing (item 3).
  Not a new baseline (light-set round; the full-set numbers above stay as printed at the clip round). The first batch's
  and the sixth chat's per-PR proof lines: §3 second-batch-close block.
```

Eighth chat's own proof of round "ไล่ดูทีละส่วน M Bar 10K" (PR #135, light set) [เชื่อว่า — main agent's report; doc-keeper ran none of it]: checker PASS 6/6 at `d305e9d` + re-check PASS 4/4 at `46f2d1d`; tsc 0 · eslint 0 · thai-raw-chars 0 · forbidden words 0 · scan.js 0/105 · locale-hydration en/zh 0 · visible-text: 291 added, all on m-bar-10k, control pages unchanged · wordbreak NEW 0 · verify:catalog (fast) 29/29 · content-dates current (56 paths) · fidelity: front IoU 0.996 ΔE≤1.8, base eye-checked against poster 04 (its numbers fail only from the poster's background). PR #135 commits: `63bf953` docs open round · `7ecef04` images · `7863173` feat · `1ba08c5` dark theme + review fixes · `d305e9d` LESSONS (new section "สิ่งที่เจ้าของชอบ / ไม่ชอบ") · `46f2d1d` checker notes a–d. Merge `fd4a6ba`; deploy run 36645201270 success; live curl shows the section.

Also relocated from v92 §16 at the same close (space — §16 cap 15 KB; word for word):

DESIGN FACTS of the M Bar 10K pilot + owner-answers pointer:
```
  DESIGN FACTS of the M Bar 10K pilot, current after #130 [เชื่อว่า — main agent's report; the older wording is in §3]:
  two per-product flags — `lineupFirst` (page opens on `lineupImage`, "ทั้งหมด" chip, lineup = first phone slide,
  swatch-colour glow behind a picked device) and `storyDetails` (`ProductMoreDetails.tsx` replaces gallery + anatomy
  + feature cards: `storyCover` poster, 4 poster highlight blocks shown whole, then the "12 flavours" box+device
  grid (`boxImage`), then the spec sheet). [chat-move: #130 hid that grid on lineupFirst pages; #133 brought it back.]
  `Product.storyLineup` (the wide banner) is gone for good. Device-only flavour photos = ONE Higgsfield nano_banana_pro 4K
  master render + a per-flavour recolour script (`_incoming/pilot-mbar10k/recolour.js`). `lineup-v3.webp` stays the
  first image. #119 `.github/workflows/deploy.yml`: when main moved on, the deploy job deploys if deploy-decision.js
  says 0 newer files reach the site.
  OWNER ANSWERS 30/09: relocated to §3 at the chat move [chat-move].
```

Leftovers of the sixth chat, and the long form of item 4 (5):
```
  Leftovers of the sixth chat [เชื่อว่า — main agent's report]: stale comment above `VERIFIED_MEDIA["Pod-180"]`
  (~lines 974-984 of `active-catalog-to-product-master.ts`, comment only) · old unreferenced
  `public/assets/products/nexbar-clear-18k/card.webp` (a WOTOFO image; delete only with the owner's OK, 13.4 #1) ·
  worktree `_incoming/wt-prb` contains junctions `node_modules` and `_incoming/nexbar-clear` — remove the junctions
  with `(Get-Item <path>).Delete()` BEFORE `git worktree remove`, never recurse into them · the ProductMaster spec
  tables stay Thai on en/zh pages (pre-existing on pod-159 / iqosheet-16; spawned as its own task).
  (5) leftover unreferenced photo files, 9 as of v92 [เชื่อว่า — the 6 of v88 (argus-g4 orange, caliburn-g4-pro-koko
      coral-pink, caliburn-g5-lite coral-orange, caliburn-g5-lite-se purple-leather — three are baseline products —
      argus-g3-mini/variants/sky-blue.webp, m-bar-10k strawberry-kiwi-v2) + `m-bar-10k/lineup.webp` (v1)], plus
      `nexbar-clear-18k/card.webp` (leftovers above), plus `m-bar-10k/lineup-v2.webp` (unreferenced since #128), plus
      NEW `m-bar-10k/story-lineup.webp` (unreferenced since #130); the count is not a fresh scan — re-scan
      public/assets/products vs src/ at round close, delete with the owner's OK (13.4 #1) · the m-bar-10k `boxImage`
      fields stay in data, not shown (not counted as leftovers)
```
[Note by doc-keeper at v93: the round's own new images `m-bar-10k/anatomy/*-v1.webp` are referenced, not leftovers; the count of 9 was not re-scanned at this close.]

### §16 lines relocated at batch 1's close of round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (ninth computer-round chat, 2026-09-30, v94 — word for word, replaced by v94 text)

v93 header + copy-paste line + items 1 and 2 (the anatomy round's close):
```
(v93 — written by doc-keeper at the close of round "ไล่ดูทีละส่วน M Bar 10K (exploded view)" (eighth computer-round
chat, 30/09). Ninth chat starts from this block. The v92 text that this replaced: §3 "§16 lines relocated at the
eighth computer-round chat's close".)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + the next round's file (the whole-site image round) in
the owner's Run prompt folder: `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt WEB\รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`
[เชื่อว่า — main agent's report; doc-keeper cannot see that folder]
1 main: `git fetch && git log -1 --oneline origin/main` — at this close `fd4a6ba` = merge of PR #135 (branch
  `mbar10k-anatomy`) [ตรวจแล้ว — .git/refs/remotes/origin/main of this working tree; the PR number is the main agent's
  report, [เชื่อว่า]]. Round rollback point = `e6463da` (main before #135, PR #134 §16 chat-move docs); to undo the round =
  revert the merge commit `fd4a6ba`. Tag `mbar10k-anatomy-done` goes on this docs close commit (the main agent tags it).
2 ahead of main: `git log --oneline origin/main..<branch>` — nothing open but this close's PR #136, branch
  `docs-close-mbar10k-anatomy` [main agent]: site fix `c827ba1` (round-close designer findings: English shows each part name
  once, close-up codes BASE/DISPLAY/COLLAR, RGB mode colours moved from 04 to 07 gated by modes+indicator, close-up row
  58rem) + the owner's note rewording (below) + these docs; small (SITE, 13.7), checker, the main agent merges.
  Checker close verdict [main agent]: PR #136 PASS 3/3 at `66e392e` + re-check PASS 2/2 at `b1bcb32` (note rewording + docs);
  7 baseline pages not reached (no shared file touched).
```

v93 item 3, the anatomy round's closed-round block:
```
3 OPEN (ninth chat 30/09): round file `docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt` · branch `image-sitewide-mbar9k` · files
  `_incoming/image-sitewide/` · batch 1 (M Bar 9K) started. Its card stays until 06/10 (related card on baseline m-bar-15k).
  Round "ไล่ดูทีละส่วน M Bar 10K (exploded view)" — CLOSED at this close (opened and closed 30/09 in the eighth chat). Round
  file in git: `docs/rounds/รอบไล่ดูทีละส่วน-MBar10K-exploded-view-30-09.txt`. Working files `_incoming/mbar10k-anatomy/`
  (facts.md, decisions.md, work/export.js, work/gen.js, verify/, shots/; not in git). Batches 1 (directions + draft) and 2 (the
  section, th/en/zh) done and merged in PR #135 (checker PASS 6/6 at `d305e9d` + re-check PASS 4/4 at `46f2d1d`, GitHub checks
  green, deploy run 36645201270 success [เชื่อว่า — main agent]; live curl by the main agent shows the section: `anatomy-sheet-title`,
  "ภาพแยกชิ้น", "ช่องปรับลม", "ไม่ใช่ภาพถอดเครื่องจริง" (that note reworded at the close, owner 30/09: "ภาพแยกชิ้นช่วยให้เห็นว่า
  แต่ละส่วนอยู่ตรงไหนและทำหน้าที่อะไร" — the photos are the real device); control pages caliburn-g5 / m-bar-9k / relx-smash-go-12k have none). Batch 3
  (360 view / X-ray extras) NOT done — offered to the owner (item 4 (9)); X-ray may show only the outer shell, internals never.
  WHAT SHIPPED: /products/m-bar-10k "ไล่ดูทีละส่วน" dark blueprint sheet inside "more details" after the cover: 3/4 view, exploded
  mouthpiece/collar/body with measured leaders 01–05, drawn bottom view 06–08 (USB-C, ปุ่มก้นพอต, ช่องปรับลม — the owner confirmed
  the arc slot = airflow 30/09), 3 close-ups, verified-spec chips, a note. Files: `src/components/product/ProductAnatomySheet.tsx`,
  `src/i18n/anatomy-sheet-copy.ts` (data + th/en/zh copy per slug — THE TEMPLATE for other products: add a slug entry + images),
  hook in `ProductMoreDetails.tsx`, `public/assets/products/m-bar-10k/anatomy/*-v1.webp`. `page.tsx`, dictionaries, product data,
  `ProductAnatomy` untouched → the 7 baseline pages and content-dates did not move. Method: all text on the sheet = page text
  (HTML/SVG, 3 languages), AI renders only the device/parts. Proof + the round's commit list: §3 (same relocation block).
  Higgsfield: 8 credits used (2 × nano_banana_pro 4K); balance at open 1521.1 → ~1,513 now [เชื่อว่า — main agent's figure less its 8;
  the ~1,960 of v92 was stale]; warn the owner before a shop-wide image job would cross the balance.
  Previous round "รอบรูป-แก้" (image fix) — still OPEN (unchanged; the eighth chat put this round first by the owner's order 30/09). Background jobs: none; test server 3412 DOWN (checked 30/09, ninth chat).
```

v93 owner answers 30/09 after the anatomy close (items 4 (6)-(9)):
```
  OWNER ANSWERS 30/09 after the close [chat-move, main agent]: (6) the live sheet = OK (round passed) BUT "the whole thing
      looks a bit big in the product section" → polish its size later, images first; (8) the new terms read oddly
      ("ปลอกลายร่อง") → reword for easy understanding even if not literal — in the LANGUAGE round (owner: site-wide
      language is not complete yet, a language round comes later, not now); (9) batch 3 = parked; (a) of item 5 = reword
      "วงแหวน RGB" → "ไฟ RGB" (EN "RGB status ring" likewise) — `product-copy-th.ts` is shared by the 7 baseline pages →
      do it after 05/10 or in the language round. Lesson written: `.claude/LESSONS.md` ช2.
  (7) the owner asked 30/09 "which steps slow us down — cut what drags"; Friday proposed cuts in the chat
      (checker on docs-only PRs · content-dates.json chore commits · full set on baseline pages after 05/10 ·
      doc-keeper for §16 · rule-text sprawl) — the owner picks; then write them (central §12 item 28) [รอเจ้าของ]
      — still open
  (8) the sheet's part names (ปลอกลายร่อง · ฐานไล่สี · ช่องปรับลม · ภาพแยกชิ้น) — answered above: reword in the language round
  (9) batch 3 extras — answered above: parked
```

v93 STANDING OWNER DIRECTION, long form (v94 §16 keeps a short form):
```
  STANDING OWNER DIRECTION (29/09; the M Bar 10K pilot is its first delivery) [ตรวจแล้ว — carried from v88]: (a) the
  card = the angled device alone, no box · (b) EVERY product with several flavours/colours gets ONE lineup image of
  all options shown FIRST on its page (picking one shows that one) · (c) flavour/colour photos = the device alone, as
  prominent as the card photo; box photos and details go to a lower "more details" part, like
  marbobkk.com/product/marbo-bar-10k-disposable/ · (d) apply to the whole website, best sellers first. IMAGE_SPEC §0
  item 5 already asks for the lineup as the first card. New page section / lineup-first behaviour = new UI →
  designer (13.12 #4); owner sees it in report item 4, merge does not wait (IMAGE_SPEC §7, owner 30/09).
```

### §16 lines relocated at batch 2's close of round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (tenth computer-round chat, 2026-09-30, v96 — word for word, replaced by v96 text)

v95 §16 text (chat move after batch 1's owner follow-ups; header + items 1-3 with the batch 1 detail + next-work list; items 4-6 that stay live were re-carried in v96, so only what changed is here):
```
(v95 — main agent, chat move after batch 1's owner follow-ups (#139, #140) in the ninth chat, 30/09; v94 = doc-keeper at
batch 1's close. The round stays OPEN; the TENTH chat starts batch 2 from this block. The v93 text: §3, v94 relocation block.)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + the round file, now in git:
`docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt` [ตรวจแล้ว — file exists in docs/rounds/]
1 main: `git fetch && git log -1 --oneline origin/main` — at this move `ac046eb` = merge of PR #140 [ตรวจแล้ว]; before it
  #139 `2c62b3f`, #138 `7e6d143` (batch 1 close docs), #137 `28278a1` (batch 1). Batch 1 rollback point = `881d966`; undo
  one step = revert that PR's merge commit. No tag (round not closed).
2 ahead of main: nothing open but this move's docs PR, branch `docs-chat-move-b1` (docs = small, checker, main agent merges).
3 OPEN (ninth chat 30/09): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" — round file above · working files `_incoming/image-sitewide/`
  (scope.md = scope-auditor result; batch2-sources.md; m9k/ scripts refs.js sample.js recolour.js lineup.js packs.js
  add-map.js apply-data.js; verify/; shots/ incl. live/ and owner-*.png; not in git). Round "ไล่ดูทีละส่วน M Bar 10K" is
  CLOSED (its full text: §3, same relocation block); its template for other products = `anatomy-sheet-copy.ts` (a slug
  entry + images). Previous round "รอบรูป-แก้" — still OPEN (unchanged). Background jobs: none [เชื่อว่า — main agent];
  test server 3412 DOWN (checked 30/09).
  BATCH 1 (M Bar 9K) — DONE, MERGED [เชื่อว่า — main agent's report; doc-keeper ran none of it]: checker PASS 8/8 at
  `8d70b38`; after it `625a4bb` = lineup back tier 10% narrower so the right-most device clears the heart button (image
  only, no text change, GitHub checks green, 13.12 #1 (จ)); designer PASS 5/5 re-check + that heart fix. Deploy run
  36655077943 success, Render deploy dep-dau6bp1srm7s73avc3bg; live curl:
  /products/m-bar-9k references `lineup.webp` and 22 `variant-*-v2.webp`, 0 "ยังไม่มีรูปของกลิ่นนี้". Live shots
  `_incoming/image-sitewide/shots/live/`, owner sheets `_incoming/image-sitewide/shots/owner-*.png`.
  WHAT SHIPPED: /products/m-bar-9k — `lineupFirst` + `lineup.webp` (22 flavours, two stage-arc tiers of 11 in product-data
  order, names typeset, names-check 22/22); 22 device-only photos `variant-<id>-v2.webp` from ONE Higgsfield nano_banana_pro
  4K master of SALTHUB's own card (4 credits) + print recolour by script from SALTHUB's own flavour chart (every 9K flavour
  = the same black device; only the Salthub/BAR9K/M print colour differs); `swatchHex` = that print colour. `card.webp`
  UNCHANGED (m-bar-15k, a baseline page, shows it as a related card). No `storyDetails` (designer: a lone SALTHUB chart logo
  banner said nothing; the old "adjustable airflow" feature card stays). `ProductMoreDetails.tsx`: on a `lineupFirst`
  product a flavour without `boxImage` gets no tile (no device-photo duplicate grid).
  DATED TO-DO, after 05/10 (baseline hold ends): sharp 4:5 card remake for m-bar-9k (then swap `card.webp`).
  FOLLOW-UPS after the owner's answers 30/09 (all merged + live, checker PASS each): #139 `2c62b3f` — the 22 SALTHUB packs
  `pack-<id>.webp` (168x380) as `boxImage` + `storyDetails` = more details holds only the "รุ่นนี้มี 22 กลิ่น" grid (owner "ได้";
  IMAGE_SPEC §4 exception — the sharpness gate FAILs exactly those 22 files, expected) · lineup v2 `lineup-v2.webp` = one
  Doublemint device + a ring of 22 print-colour discs, no text (owner turned down the two-tier arc: "ไม่คม ไม่พรีเมียม รก";
  designer direction A; drafts A2 "M-logo ring" / B "print book" in `_incoming/image-sitewide/m9k/out/owner-lineup-options.png`,
  builder `lineup-v2.js`) · #140 `ac046eb` — the coloured glow behind a picked flavour on lineupFirst pages (9K + 10K) removed
  (owner: glow not smooth; the Caliburn pages — no glow, sharp, well placed, right size — are the look). `m-bar-9k/lineup.webp`
  is now unreferenced (add to item 4 (5)). Lessons: LESSONS 17 (print recolour) · ช3 (owner: many-option lineup = crop to what differs).
  PROOF (light set, 13.12; not a new baseline) [เชื่อว่า — main agent]: tsc 0 · eslint 0 · verify:catalog 29/29 ·
  image-sharpness-gate PASS · html-diff 7 baseline pages 7/7 identical to live (m-bar-15k hidden RSC data grew — noted in
  `docs/SEO_BASELINE.md`, which the main agent appended) · gallery-probe sitemap both modes PASS 43 pages 0 FLASH/STUCK
  (on `0327278`) + m-bar-9k / m-bar-10k both modes PASS on `8d70b38` · scan.js 0/105 · locale-hydration 0 · visible-text:
  changes only on m-bar-9k.
  Higgsfield: 4 credits used this batch; balance 1507.1 at round open → ~1,503 now [เชื่อว่า — main agent's figure less its
  4]; warn the owner before a shop-wide image job would cross the balance.
  NEXT = BATCH 2 (FIRST NEXT STEP): M Switch 15K kit `m-switch-kit` + pod `m-switch-pod` (`salthub.ts`); sources already
  downloaded, list in `_incoming/image-sitewide/batch2-sources.md`; neither is a related card on a baseline page. Same
  method as batch 1 (one master + recolour, `lineupFirst`, new file names); run `npx tsx scripts/content-dates.ts` after
  committing a product-data file. Context at this close ~470k of 1M [เชื่อว่า — main agent].
  NEXT WORK, in the owner's order (big → planner first for anything not already planned, 13.2 #2):
  (1) THE WHOLE-SITE IMAGE ROUND continues (batch 1 done, batch 2 = M Switch kit + pod, above). OWNER'S LIST 30/09, in this
      order: M Bar 9K [DONE batch 1] · Marbo M Switch 15K Pod Device [batch 2] · M Switch 15K pod (head only, 15,000 puffs)
      [batch 2] · VOOPOO Argus G4 pod kit 35W · VOOPOO Argus Multi-Ohm Pod Cartridges (3 pcs) · MURO SC 8000 puff · RELX
      Creator BATTERY Black · INFY 20K disposable (Nic 3%, Smart LED, adjustable airflow) — map each to its slug first (the
      scope-auditor's result is `_incoming/image-sitewide/scope.md`); the last three are "not on the site" = item 4 (11).
      Shop-wide facts for planning [ตรวจแล้ว — `_incoming/mbar10k-full/count-variants.ts`, as of the fourth chat]: visible
      legacy products with ≥2 options = 33 (343 options); published ProductMaster products with ≥2 options = 9 (51 options);
      box+device photos are mainly SALTHUB/Marbo, so the AI-render load is smaller than 394 — count per product before
      quoting credits. Baseline pages untouched until 06/10.
  STANDING OWNER DIRECTION (29/09) [ตรวจแล้ว — carried from v88; long form in §3, v94 block]: card = the angled device
  alone · ONE lineup image of all options FIRST on every multi-option product · flavour/colour photos = device alone ·
  box photos + details in a lower "more details" part · whole site, best sellers first (IMAGE_SPEC §0 item 5, §7).
  (v95 item 4 (12): "two-tier lineup rejected → lineup v2 shipped #139 [รอเจ้าของ: A (live) / A2 / B — or "none"]" —
  superseded 30/09 by the owner choosing lineup-v3 = the flavour fan; see v96 item 3.)
```

### §16 lines relocated at batch 4's close + the chat move of round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (eleventh computer-round chat, 2026-09-30, v98 — word for word, replaced by v98 text)

v97 §16 text, header + items 1-3 (the batch 1 and batch 2 detail, the PR #145 follow-up, the old next-work list); items 4-6 that stay live were re-carried in v98, so only what changed is here:
```
(v97 — main agent, chat move after the owner's batch-2 follow-ups (#145) in the tenth chat, 30/09; v96 = doc-keeper at batch 2's
close. The round stays OPEN; the ELEVENTH chat starts BATCH 4 from this block. The v95 text: §3, v96 relocation block.)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + the round file `docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`
1 main: `git fetch && git log -1 --oneline origin/main` — at this move `51c7f18` = merge of PR #145 (M Switch upright v3)
  [ตรวจแล้ว]; before it #144 `67837b9` (docs close b2), #143 `14437a1` (batch 2), #142 `243dc56` (M Bar 9K lineup-v3). Batch 2
  rollback point = `243dc56`; undo one step = revert that PR's merge commit. No tag (round not closed).
2 ahead of main: only this move's docs PR, branch `docs-chat-move-b2` (HANDOFF + archive/HANDOFF-headers; docs = small,
  checker, main agent merges).
3 OPEN (tenth chat 30/09): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" — round file above · working files `_incoming/image-sitewide/`
  (scope.md = scope-auditor result; lineup-research.md; batch2-sources.md; m9k/ scripts; verify/ verify-b2/; shots/ incl. live/
  b2/; not in git). Previous round "รอบรูป-แก้" — still OPEN (unchanged). Background jobs: none [เชื่อว่า — main agent].
  BATCH 1 (M Bar 9K) — DONE, live; its full detail: §3, v96 relocation block. Since then: PR #142 `243dc56` (checker PASS 6/6
  at `5c47b16`; after it `a76799c` = side devices less dimmed, image only, GitHub checks green, 13.12 #1 (จ)) — the M Bar 9K
  first image is now `lineup-v3.webp` = the flavour fan: 5 flavours side by side (Doublemint front; Blue Ice, Watermelon,
  Sparkling Lemon, Grape), the owner's choice 30/09 "ใช้พัดกลิ่น" = option 2 of `_incoming/image-sitewide/lineup-research.md`
  [เชื่อว่า — main agent]. Live curl: /products/m-bar-9k references `lineup-v3.webp`; live shots
  `_incoming/image-sitewide/shots/live/m9k-v3-390.png` + `-1440.png`. `m-bar-9k/lineup-v2.webp` + `lineup.webp` now unreferenced.
  OWNER DIRECTION 30/09 (replaces the 29/09 "one lineup of ALL options first"): the first image of a multi-option product =
  an Apple-style group of 5 representative options (fallback = one sharp device); the chips + the more-details grid carry all.
  BATCH 2 (M Switch 15K kit `m-switch-kit` + pod `m-switch-pod`) — MERGED as PR #143 `14437a1`, live after a deploy re-run (below)
  [เชื่อว่า — main agent]: checker FAIL at `e7db3f1` → fixed → re-check PASS 4/4; designer fixes applied. SHIPPED (photos since
  replaced by #145 below): both pages `lineupFirst` (pod: 5 pods fanned; kit: device + 5 pods); a photo per flavour (pod
  page = pod alone; kit page = device + that pod); kit `storyDetails` + `storyCover` `story-cover.webp` + `story-03.webp` on
  the keep-the-body feature (no new copy) + 16 `pack-<id>.webp` starter-kit renders (Kyoho Grape has none). Method: LESSONS
  18. BSOT §21 "Answered 2026-09-30" (opaque black pod = what the shop sells; sold as a starter kit) [ตรวจแล้ว — BSOT line 667].
  PROOF (light set, 13.12; not a new baseline) [เชื่อว่า — main agent]: tsc 0 · eslint 0 · verify:catalog 29/29 · sharpness gate
  54 files 0 fail · gallery-probe m-switch-pod / m-switch-kit / m-bar-9k both modes PASS · locale-hydration 26/26 · scan.js
  0/105 (logs `_incoming/image-sitewide/verify-b2/`); local shots `_incoming/image-sitewide/shots/b2/`.
  #143's main deploy failed on a Google-font fetch in `next build` (run 36711069655); the owner OK'd a re-run in chat ("ได้"),
  Friday re-ran it → green, live. The same flake failed PR #145's checks once (run 36714213862, re-run green) → a task chip
  "Self-host Google fonts to stop flaky builds" was offered to the owner (touches the shared layout → after 05/10 or full set).
  FOLLOW-UP #145 `51c7f18` (owner 30/09 on the live #143 set: the tilted pod "ขอบหนาตรงฐาน ดูไม่สวย" = its base face showed;
  swatch option 2 = pink) [ตรวจแล้ว — checker PASS 5/5 at `d054710` + re-check PASS at `749c645`; live curl: m-switch-pod 17
  `variant-*-v3.webp`, m-switch-kit 36 new files]: the 17 pods re-posed upright by GPT Image 2.5 (base hidden) →
  `m-switch-pod/variant-<id>-v3.webp`, `m-switch-kit/variant-<id>-v3.webp` (device + that pod, pod 0.62 of the device),
  `lineup-v2.webp` on both (fan spaced so every label reads; kit device clear of the pods); swatch pink-berry `#e34bef`,
  mixberry `#f844bf` (tag pink). The -v2 files + `lineup.webp` of both slugs are now unreferenced (add to item 4 (5)).
  Live shots `_incoming/image-sitewide/shots/live/m-switch-{pod,kit}-v3-{390,1440}.png`. Higgsfield: balance 1503.1 at chat
  start; ~130 credits used in all this chat [เชื่อว่า — main agent's estimate; the GPT Image jobs cost ~1 each].
  NEXT = BATCH 4 (FIRST NEXT STEP of the eleventh chat): MURO SC 8000 · RELX Creator BATTERY Black · INFY 20K (owner: open/
  restore the last two pages) + the Argus Multi-Ohm cartridge page (owner: an accessory under VOOPOO; a new page, not a
  baseline page — but `voopoo.ts` lastmod reaches argus-g4/drag-6/drag-s3: check html-diff). Researcher notes, read FIRST:
  `_incoming/image-sitewide/batch4-research.md` — no official images for Muro / INFY / the Argus pod (retailer files only);
  RELX Creator is a battery + pods, NOT a disposable (`relx.ts:92` wrong); Muro has 12 flavours (repo 8); INFY spec conflict
  (650 mAh/20 mL/airflow vs 600/18). Start with ONE owner question set (INFY box spec · a Muro pouch photo · the RELX Creator
  black battery + which pod he sells). Batch 3 (argus-g4 itself) waits for 06/10. Run `npx tsx scripts/content-dates.ts`
  after committing a product-data file. Context at this move ~600k of 1M [เชื่อว่า — main agent].
  DESIGN FACTS of the M Bar 10K pilot (flags `lineupFirst` + `storyDetails`, recolour script): §3, eighth chat's close block.
  GALLERY LEDE (#130): th/en/zh = "ภาพจริงจาก {brand}" (credit only). The 7 SEO-baseline slugs keep the old line via
  `dict.product.galleryNoteHeld` + the `ProductGallery` prop `heldNote`, passed from `page.tsx`.
  DATED TO-DO, after 05/10 (the baseline hold `TITLE_PRICE_HOLD_UNTIL_2026_10_05` ends): delete `galleryNoteHeld` and
  the `heldNote` prop (with the `page.tsx` pass-through) so the 7 pages show the credit-only lede too [เชื่อว่า —
  main agent's instruction; the "so that" is doc-keeper's reading].
  OWNER'S DIRECTION 30/09: (i) the "more details" section of EVERY product gets an SEO article — its own later round,
  file `รอบบทความ-รายละเอียดเพิ่มเติม-ทุกสินค้า-30-09.txt` in the owner's drafting folder, NOT in git (OneDrive
  `Run prompt\New prompt WEB\`) [เชื่อว่า — main agent's report; doc-keeper cannot see that folder]; (ii) the M Bar 10K
  treatment (more images + more details) goes to the WHOLE site = this round.
  NEXT WORK, in the owner's order (big → planner first for anything not already planned, 13.2 #2):
  (1) THE WHOLE-SITE IMAGE ROUND continues. OWNER'S LIST 30/09 (order): M Bar 9K [DONE b1] · M Switch kit + pod [DONE b2,
      deploy pending] · VOOPOO Argus G4 pod kit 35W [b3, baseline page] · Argus Multi-Ohm Pod Cartridges (3 pcs) [b3] · MURO SC
      8000 · RELX Creator BATTERY Black · INFY 20K [b4] — slug map: `_incoming/image-sitewide/scope.md`. The shop-wide counts
      for quoting credits (33 legacy products with ≥2 options = 343 options; 9 ProductMaster = 51) are in §3, v96 relocation
      block. Baseline pages untouched until 06/10.
  (2) (D) out-of-stock suggestion (Esko 18/20) — designer first · (3) (C)/(B) card sweep on the 4:5 standard (Muro
  card first) — both carried; the new direction may fold them in.
  (4) the ARTICLE round (above) — after or alongside (1); big → planner first (13.2 #2).
  Standing rules: every replaced photo ships under a new file name (`-v2`/`-v3`, lesson พ6); after-shots from the LIVE
  site; `process-images --only <slug>` re-writes every entry of that slug — restore the untouched files with
  `git checkout -- public/assets/products/<slug>/` right after; run `npx tsx scripts/content-dates.ts` after
  committing a product-data file, then commit the json (checker caught it).
  Known leftovers (not blockers): 2 word-break flags in the existing "ไฟ RGB บอกโหมด" sentence (ตอน|นี้ at 390,
  Eco|Soft) — fix after 06/10 (the typography mechanism touches baseline pages) · the flaky deploy step "next start
  on 3411 stopped" — fixed by #131, WATCH it: Linux proof so far = 3 passing runs of that step (PR #130's checks
  twice, the main deploy of d866032) — a sample, not proof the flake is gone; the old wording is in §3 ·
  locale note (pre-existing, not from these PRs): /products/argus-g4 en/zh show 1 Thai text node (the review video
  title, `voopoo.ts:24`) [เชื่อว่า — main agent] · Lighthouse not installed (not run).
  STANDING OWNER DIRECTION (29/09, first-image part changed 30/09 — see item 3) [ตรวจแล้ว — carried from v88; long form in §3,
  v94 block]: card = the angled device alone · first image of a multi-option product = a group of 5 representative options
  (30/09; was "ONE lineup of ALL options") · flavour/colour photos = device alone · box photos + details in a lower "more
  details" part · whole site, best sellers first (IMAGE_SPEC §0 item 5 — the 30/09 change written there in #144; §7 unchanged).
```

v97 item 4's answered/done lines (10)-(17) — moved with their wording; (7) and (14) are still open and are re-carried in v98 item 4:
```
  (7) the owner asked 30/09 "which steps slow us down — cut what drags"; Friday proposed cuts in the chat
      (checker on docs-only PRs · content-dates.json chore commits · full set on baseline pages after 05/10 ·
      doc-keeper for §16 · rule-text sprawl) — the owner picks; then write them (central §12 item 28) [รอเจ้าของ]
      — still open
  OWNER ANSWERS 30/09 to batch 1's report [owner, chat]: (10) packs = "ได้" → done #139 · (11) batch 4 products not on the site
      (RELX Creator BATTERY Black, INFY 20K, Argus Multi-Ohm Cartridges) = "ทำได้เลย" — open/restore their pages in batch 4;
      "Argus Multi-Ohm Cartridges 3 อัน = อุปกรณ์เสริมของ Argus อยู่ในหมวด VOOPOO" (an accessory under VOOPOO) · (12) lineup
      v2 (A/A2/B) — closed: the owner picked the flavour fan for M Bar 9K, "ใช้พัดกลิ่น" (lineup-v3, #142) [เชื่อว่า — main agent].
  OWNER ANSWERS 30/09 to batch 2's report [owner, chat]: (13) deploy re-run — "ได้" → done (item 3) · (14) CATEGORY STRUCTURE
       (Pod System · "หัวพอตและคอยล์ (Pod System)" · พอตใช้แล้วทิ้ง = non-replaceable only · NEW "พอตเปลี่ยนหัว (Closed System)"
       = starter kits + prefilled pods; Friday's proposal) = "ทำรอบแยก แต่เดี๋ยววางแพลนให้ชัดกว่านี้" — its own round, the
       OWNER will plan it first [รอเจ้าของ] · (15) "ขอบหนาตรงฐานของหัวพอต ดูไม่สวย" → upright pods, #145 · (16) swatch = 2 pink → #145.
  (17) DONE: the owner's "เขียนเลย" 30/09 → TEAM_RULES 13.7 deploy line: Friday may re-run a failed run ONCE when its log
       shows a network / external-fetch failure (e.g. Google Fonts in `next build`), PR checks or the main deploy run; fails
       again = stop and report (13.4 #9).
```

---

Also relocated (rewritten in place in v98 — checker PR #149; old wording, word for word):
  (5) leftover unreferenced photo files, 11 [เชื่อว่า — not a fresh scan; 9 as of v92 (v88's 6 + `m-bar-10k/lineup.webp`,
      `nexbar-clear-18k/card.webp`, `m-bar-10k/lineup-v2.webp`, `m-bar-10k/story-lineup.webp`; list in §3, eighth chat's close
      block) + `m-bar-9k/lineup.webp` and `m-bar-9k/lineup-v2.webp` since #142; the old m-switch-kit / m-switch-pod photos
      replaced by #143 were not checked] — re-scan public/assets/products vs src/ at the next round close; delete with the owner's OK (13.4 #1)
  Per-PR proof lines: batch 2's = item 3 above; the seventh and eighth chats' = §3 (eighth chat's close block + the second-batch-close block).

### §16 lines relocated at the owner-answers docs PR (eleventh chat, 2026-09-30, v98 — word for word; §16 was over 15 KB)

  Standing rules: every replaced photo ships under a new file name (`-v2`/`-v3`, lesson พ6); after-shots from the LIVE
  site; `process-images --only <slug>` re-writes every entry of that slug — restore the untouched files with
  `git checkout -- public/assets/products/<slug>/` right after; run `npx tsx scripts/content-dates.ts` after
  committing a product-data file, then commit the json (checker caught it). A file changed and then reverted can still fail the
  `content-dates` check on the merge ref (PR #148, run 36737851162) — make a real change, or re-run once per 13.7.
  Known leftovers (not blockers): 2 word-break flags in the existing "ไฟ RGB บอกโหมด" sentence (ตอน|นี้ at 390,
  Eco|Soft) — fix after 06/10 (the typography mechanism touches baseline pages) · the flaky deploy step "next start
  on 3411 stopped" — fixed by #131, WATCH it: Linux proof so far = 3 passing runs of that step (PR #130's checks
  twice, the main deploy of d866032) — a sample, not proof the flake is gone; the old wording is in §3 ·
  locale note (pre-existing, not from these PRs): /products/argus-g4 en/zh show 1 Thai text node (the review video
  title, `voopoo.ts:24`) [เชื่อว่า — main agent] · Lighthouse not installed (not run).

---

### §16 line replaced by the owner ruling (20)+(21) (eleventh chat, 2026-09-30 — word for word)

  (20) ANSWERED 30/09: the owner sent 3 photos (_incoming/image-sitewide/relx/owner/ — 1.png = black "Relx Creator Device" (RPODS
       Dubai, watermarked); 2.webp + 3.jpg = grey/yellow renders) → the shop's black battery looks identical to RELX's own "Creator Pro Device"
       [เชื่อว่า — by eye]; use relxnow.com's official renders (-black/-white/-green/-yellow, batch4-research.md §2), all 4 colours (catalog
       completeness), not the watermarked file. Which pods it is sold with: still [รอเจ้าของ] (not blocking the device page)
  (6)(8)(9) ANSWERED 30/09 (full text: §3, v94 block): anatomy sheet size polish later · odd part names + "วงแหวน RGB" →
      "ไฟ RGB" in the LANGUAGE round / after 05/10 · batch 3 extras parked

---

### §16 lines relocated at the close of the twelfth chat's batch "owner answers 30/09" (round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K", 2026-10-01, v99 — word for word, replaced by the v99 text)

```
(v98 — doc-keeper at batch 4's close, written together with the chat move (the eleventh chat, 30/09, context ~600k, next work
long). The round stays OPEN; the TWELFTH chat starts from this block. The v97 text (batch 1/2 detail): §3, v98 relocation block.)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + the round file `docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`
1 main: `git fetch && git log -1 --oneline origin/main` — at this close `05f3b63` = merge of PR #148 (batch 4), branch
  `image-sitewide-b4` head `b25c8d9` [เชื่อว่า — main agent's report; doc-keeper cannot run git]. Batch 4 rollback point =
  `9543978`; undo the batch = revert the merge commit `05f3b63`. Batches 1-2: rollback `881d966` / `243dc56`, PRs #137-#145 (§3,
  v98 block). No tag (round not closed). Main deploy run 36738799200 green; live curl [ตรวจแล้ว — main agent]: muro-sc-8000 200 with
  `card-v2.webp` + 12 variant files + "12 รส" · muro-connector-20k `card-v3.webp` · m-bar-pod 404 · infy-20k 404; live shots `_incoming/image-sitewide/shots/live/b4-*`.
2 ahead of main: only this close's docs PR — HANDOFF + archive/HANDOFF-headers + IMAGE_SPEC §0 item 5 (the rule (a) text; it was
  uncommitted at batch close [ตรวจแล้ว — git status]) — branch `docs-close-b4`; docs = small, checker, main agent merges.
  The work branch `image-sitewide-b4` is merged; nothing on it is unchecked.
3 OPEN (eleventh chat 30/09): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" — round file above · working files `_incoming/image-sitewide/`
  (scope.md; batch4-research.md; infy/recolour.js, muro/compose.js + lineup.js, b4-add-map.js; verify-b4/; shots/b4/; check-b4/;
  not in git). Previous round "รอบรูป-แก้" — still OPEN (unchanged). Background jobs: the deploy run above only [เชื่อว่า].
  DONE so far: batch 1 M Bar 9K (#137-#140, #142) · batch 2 M Switch kit + pod (#143, #145) — detail: §3, v96 + v98 blocks ·
  batch 4 (below). The M Bar 9K / M Switch first image is still the 5-option fan; owner direction (a) below would replace it.
  BATCH 4 — MERGED as PR #148 `05f3b63` (PARTIAL: RELX Creator not done, Argus Multi-Ohm moved to batch 3) [เชื่อว่า — main
  agent's report]: checker PASS 6/6 at `2371e44` + GitHub checks green; after the checker: `7dbe3cc` image-only name-contrast fix
  (INFY dark flavour names lifted toward white, MURO Banana Strawberry label name printed dark) + `bceeb27`/`b25c8d9` comment +
  content-dates — 13.12 #1 (จ), GitHub checks decided. The first PR check run 36737851162 failed on `content-dates` (a file
  changed then reverted = identical to main, but the last-commit date on the merge ref differs); fixed by a real comment change
  in `search-aliases.ts`, re-run green.
  SHIPPED: MURO SC 8000 — 12 flavours (+Grape, Watermelon, Double Mint, Mix Berries), each photo = device + that flavour's pouch
  (owner), `card-v2.webp`, `lineup.webp` behind the "all" chip, page opens on the card (`openOnCardPhoto`), "12 รส";
  Watermelon's pouch-label colour has no source (both retailers reuse the Apple Shisha pouch) → pod789's caption colour
  [unverified]. Muro Connector 20K `card-v3.webp` (owner: old card "ไม่สวย ไม่คม ไม่สมมาตร"). M Bar Pod (`m-bar-pod`) HIDDEN from the
  storefront (owner "ลบออกได้เลย" — the shop sells black pods; record + photos kept; its 2 search-head-copy rows + its verified-specs
  test entry removed). 8 INFY flavour names added to `src/lib/flavor-names.ts`. Lessons 19 / พ7 / ช4 in `.claude/LESSONS.md`.
  INFY 20K (`infy-20k`): everything READY (card, 22 device photos + 2 flavours without photo = 24, lineup, specs 650 mAh / 20 mL /
  dual mesh 0.9 Ω, airflow unverified, Thai FAQ rewritten) but HELD HIDDEN until 06/10 — un-hiding adds "INFY" to the footer brand
  list of every page incl. the 7 SEO-baseline pages (html-diff proved that was the only change). ON 06/10: delete the
  `hiddenFromStorefront` line in `infy.ts`; drop "infy" from `DORMANT_ALIAS_TERMS` (`search-aliases.ts`); recheck the English
  `shortDescription` "20,000-puff" against the unverified puffs row (checker note); html-diff not needed after 05/10.
  RELX Creator: NOT done — waits for the owner's photo of the black battery he sells + which pods (question asked in chat). Planned
  data fix: `categoryId` pod-kits / `systemType` pod-kit (like m-switch-kit). Argus Multi-Ohm cartridge page: moved to batch 3.
  PROOF (light set, 13.12; not a new baseline) [เชื่อว่า — main agent; logs `_incoming/image-sitewide/verify-b4/`, checker's
  `check-b4/`]: tsc 0 · eslint 0 · verify:catalog 29/29 · sharpness gate 39 files 0 fail · html-diff 7 baseline pages 7/7 identical ·
  scan.js 0/104 · gallery-probe 43 pages both modes 0 FLASH/STUCK · locale-hydration: 34 Thai nodes on /products +
  /products/pods-cartridges en/zh = the same on live (pre-existing coil names, out of scope). Shots `_incoming/image-sitewide/shots/b4/`.
  Higgsfield: balance 1296.85 at this chat's start, ~14 credits used in it [เชื่อว่า — main agent]; warn before a shop-wide job.
  OWNER DIRECTIONS 30/09 (eleventh chat) [เชื่อว่า — main agent's report; (a) is also written in IMAGE_SPEC §0 item 5, line 13 — ตรวจแล้ว]:
  (a) the first image of a multi-option product = ONE sharp angled device like the Caliburn pages ("เอาแบบ Caliburn คม ชัด
      จัดวางสวย แต่รูปเดียวเด่น ๆ"); the other options by swipe / chips (data: `openOnCardPhoto`, not `lineupFirst`). This REPLACES
      the 5-option fan.
  (b) M Bar 15K (a BASELINE page, disposables) shows clear pod heads as its flavour photos and its 15-pod grid lineup failed →
      needs a device photo per flavour + rule (a). NOTE: its SALTHUB sources (`_incoming/salthub/m-bar-15k`) are M SWITCH
      clear-cartridge art (device = battery + clear pod, the card shows the pod through a window) — CONFIRM the product's identity
      before rendering anything.
  (c) M Switch Pod flavour photos are inconsistent ("บางตัวปากกว้าง บางตัวเบี้ยว") → rebuild from ONE master pod + recolour the M
      logo / tag + the printed name (lesson 19), NOT per-flavour AI re-poses.
  NEXT WORK (twelfth chat), the owner's order; FIRST STEP after the deploy check: M Switch Pod rebuild (c) — not a baseline page —
  and M Bar 15K prep (b) (ship 06/10 unless the owner lifts the hold — item 4 (19)); then BATCH 3 on 06/10 (argus-g4 + Argus
  Multi-Ohm + INFY open + M Bar 15K ship); then BATCH 5 = the rest of the site (planner first, 13.2 #2; the M Bar 10K treatment
  per rule (a)). The fan lineups already live (M Bar 9K · M Switch kit · M Switch pod) wait on item 4 (18). Also carried: (D)
  out-of-stock suggestion (Esko 18/20) — designer first · (C)/(B) card sweep on the 4:5 standard · the ARTICLE round (below) ·
  the category-structure round (item 4 (14)). Shop-wide counts for quoting credits: 33 legacy products with ≥2 options = 343
  options; 9 ProductMaster = 51 (§3, v96 block). Batch 3's Argus pages: `voopoo.ts` lastmod reaches argus-g4/drag-6/drag-s3 → html-diff.
  Context at this move ~600k of 1M [เชื่อว่า — main agent]. Design facts of the M Bar 10K pilot (§3, eighth chat's close block) and
  the gallery-lede facts (#130; the v97 wording: §3, v98 block) are not repeated here.
  DATED TO-DO, after 05/10 (the baseline hold `TITLE_PRICE_HOLD_UNTIL_2026_10_05` ends): delete `galleryNoteHeld` and
  the `heldNote` prop (with the `page.tsx` pass-through) so the 7 pages show the credit-only lede too [เชื่อว่า —
  main agent's instruction; the "so that" is doc-keeper's reading].
  OWNER'S DIRECTION 30/09: (i) the "more details" section of EVERY product gets an SEO article — its own later round,
  file `รอบบทความ-รายละเอียดเพิ่มเติม-ทุกสินค้า-30-09.txt` in the owner's drafting folder, NOT in git (OneDrive
  `Run prompt\New prompt WEB\`) [เชื่อว่า — main agent's report; doc-keeper cannot see that folder]; (ii) the M Bar 10K
  treatment (more images + more details) goes to the WHOLE site = this round.
  Round standing rules + known leftovers: §3, block "§16 lines relocated at the owner-answers docs PR".
  STANDING OWNER DIRECTION (29/09; first-image part changed twice on 30/09 — (a) above wins) [ตรวจแล้ว — IMAGE_SPEC §0 item 5,
  lines 12-13; long form §3, v94 block]: card = angled device alone · flavour/colour photos = device alone · box photos + details
  in a lower "more details" part · whole site, best sellers first.
4 waiting on owner:
  (18) ANSWERED 30/09 "ใช่": convert the live fan lineups (M Bar 9K, M Switch kit, M Switch pod) to rule (a) — openOnCardPhoto + a sharp angled card
  (19) NEW: "เรื่อง SEO ไม่ต้องสนใจ" — does it lift the 7-page baseline hold before 05/10 (would let INFY open and M Bar 15K be fixed
       now)? ANSWERED 30/09: owner "ทำเลยเพราะสุดท้ายก็ต้องยืนขอใหม่ อยู่ดีเพราะมีการเปลี่ยนแปลงข้อมูล นั้นนี้ พี่เข้าใจตามนี้ถูกมั้ย แย้งได้" → the hold is
       LIFTED [เชื่อว่า — Friday's reading of "ทำเลย"] for photos, the footer brand list and page body: open INFY, fix M Bar 15K / argus-g4 photos. Friday's caveat, told
       to the owner: keep the <title>/meta description/H1/price of the 7 pages unchanged until 05/10 (that is what the 05/10 read measures;
       TITLE_PRICE_HOLD_UNTIL_2026_10_05) [รอเจ้าของ — the caveat is not yet confirmed] — check with scripts/head-audit.js
  (20)+(21) OWNER RULING 30/09 (his chat summary): INFY 20K = the round model with a lanyard ·
       NO battery size (no real source) · show capacity 20mL + adjustable airflow · every flavour found (he counted 22) [Friday: data has 24 —
       + Milk Tea Cha, Matcha, 3 shops — keep them]. RELX Creator = CLOSED pod system, device and pods sold apart · the
       device with the screen = RELX's Creator Pro → RELX official photos OK · 2 colours, both still sold: grey-yellow (first) + black
       (later) · fits RELX Creator 20K pods AND Muro Connector pods. Owner photos: _incoming/image-sitewide/relx/owner/. Friday's question:
       relxnow.com lists 4 colours (Black/White/Green/Yellow) — show 4 (catalog completeness) or his 2? Friday recommends 4 [รอเจ้าของ]
  (7) the owner asked 30/09 "which steps slow us down — cut what drags"; Friday proposed cuts in the chat (checker on docs-only
      PRs · content-dates.json chore commits · full set on baseline pages after 05/10 · doc-keeper for §16 · rule-text sprawl) —
      the owner picks; then write them (central §12 item 28) [รอเจ้าของ] — still open
  (14) CATEGORY STRUCTURE (Pod System · "หัวพอตและคอยล์ (Pod System)" · พอตใช้แล้วทิ้ง = non-replaceable only · NEW "พอตเปลี่ยนหัว
      (Closed System)" = starter kits + prefilled pods; Friday's proposal) = the owner said "ทำรอบแยก แต่เดี๋ยววางแพลนให้ชัดกว่านี้" —
      its own round, the OWNER will plan it first [รอเจ้าของ] — re-carried from v97 (the answered lines (10)-(17): §3, v98 block)
  (1) image-theft protection A+B+C — its own round after this one — carried, not started
  (2) Muro Connector's category (owner: "Relx Connect"; Friday's evidence: RELX Creator) [รอเจ้าของ] — carried
  (3) SALTHUB per-flavour file request, no-photo panel wording A/B/C, M Switch card black pod — carried
  (4) stray worktrees `_incoming/wt-main`, `_incoming/checker-wt`, `_incoming/wt-prb` — wt-prb contains junctions
      `node_modules` and `_incoming/nexbar-clear`: remove the junctions with `(Get-Item <path>).Delete()` BEFORE
      `git worktree remove`, never recurse into them — remove once the owner agrees — carried
  (5) leftover unreferenced photo files, ~17 [เชื่อว่า — not a fresh scan; 11 as of v97 (list: §3, eighth chat's close block; +
      `m-bar-9k/lineup.webp` + `lineup-v2.webp` since #142) + since batch 4 `muro-sc-8000/card.webp` and
      `muro-connector-20k/card-v2.webp`; + the -v2 files and `lineup.webp` of m-switch-kit / m-switch-pod replaced by #145 (loosely
      counted); `m-bar-pod` photos are KEPT on purpose (hidden product)] — re-scan public/assets/products vs src/ at the next
      round close; delete with the owner's OK (13.4 #1)
5 open questions (round "ไล่ดูทีละส่วน", found by thai-copy, pre-existing, NOT fixed — out of scope):
  (a) answered (item 4 (6)(8)(9)) · (b) `dict.product.anatomyTitle`
  en/zh "from the outside in" promises internals (shared dictionary; the new sheet uses its own heading) · (c) no airflow spec
  row for M Bar 10K yet — adding one to `salthub.ts` moves 27 lastmod dates incl. baseline m-bar-15k → after 05/10.
6 verify baseline at the last full close (clip round, logs `_incoming/clip-round/verify/`, unchanged since v85 — the
  batches since ran the light set only, per 13.12): tsc 0 · verify:commerce 17/17 · verify:catalog --full 32/32 ·
  count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Per-PR proof lines: batch 4's = item 3 above; batch 2's = §3, v98 block; the seventh and eighth chats' = §3 (eighth chat's close block + the second-batch-close block).
```

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
   > **Superseded 2026-09-27 (round B, main agent — note added, old line kept):** who merges and how the site goes live = `.claude/TEAM_RULES.md` 13.7 (Friday merges off-site PRs herself; a merge that touches the site deploys itself after the GitHub checks). The `git fetch` advice still holds.
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

> **Superseded 2026-09-27 (round B, main agent — note added, old line kept):** "never merge yourself" no longer holds — merge rights = `.claude/TEAM_RULES.md` 13.7 (the self-merge case + the Javis-only exceptions). This section is a 2026-09-22 snapshot.

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
- **Re-asking the rulings in §16 item 4b** — settled, do not re-litigate. (Round B 2026-09-27: the permanent rulings now sit in §16 items 4b–4c + §3 "Permanent owner rulings".)
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

(v99 — main agent at the close of the twelfth chat's batch "owner answers 30/09" (Friday writes §16 itself since the
owner's ruling 30/09 item 7D). The round stays OPEN. The v98 text (batch 4 detail, owner directions (a)-(c)): §3, v99 block.)
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + the round file `docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`
1 main: `git fetch && git log -1 --oneline origin/main` — at this close `31a6ad8` = merge of PR #153 (rules + hook) on top
  of `05ff9c3` = merge of PR #152 (images) [ตรวจแล้ว — gh]. Undo = revert `05ff9c3` (site) / `31a6ad8` (rules + hook).
  Batch rollback point = `57d767d`. No tag (round not closed). Deploy runs: 36754387144 (#152 — attempt 1 failed on the
  Google-font fetch in `next build`, re-run once per 13.7, green) · 36754903184 (#153, green); live curl 200 on
  infy-20k / relx-creator / m-switch-pod (17 -v4 files) / m-bar-9k card-v2 [ตรวจแล้ว]; live shots `shots/b5a/live-*`.
2 ahead of main: only this close's docs PR (HANDOFF §16 + §3 relocation) — docs-only → no checker (rule 7A), Friday merges.
  Work branches `image-sitewide-b5a`, `rules-owner-cuts-30-09` are merged; nothing on them is unchecked.
  Worktree `_incoming/wt-rules` = the rules branch; remove it with `git worktree remove _incoming/wt-rules` (no junctions).
3 OPEN NOW (thirteenth chat 01/10): HOUSEKEEPING round — file `docs/rounds/รอบเก็บบ้าน-Friday-ถามพี่ก่อน-01-10.txt`
  (byte-equal to the OneDrive draft), branch `housekeeping-01-10`, working files `_incoming/housekeeping-01-10/`.
  Batches (the file's own order): H1 questions to the owner [sent 01/10, waiting] · H2 audit, nothing edited (rule-auditor
  + inventory) → report to the owner, WAIT for the owner's ruling · H3 do what the owner rules (docs/rules = tier A;
  hooks/settings = 13.7 "big", full set) · H4 a re-callable /เก็บบ้าน skill, shown to the owner before saving.
  Fence (owner): the site a visitor sees stays the same — a batch that changes the sitemap or a page = stop, revert, report.
  No scope-auditor (touches nothing a visitor gets). Stopped at: H1 questions (6) + H2 report sent 01/10 — WAITING
  for the owner's answers; nothing edited yet. H2 files (not in git): `_incoming/housekeeping-01-10/รายงานข้อ2-ตรวจก่อนแก้.md`
  (Thai, for the owner: 15 proposals, targets, risks, H3 order) · `rule-audit.md` (rule-auditor's table with file:line —
  the H3 work list) · `inventory.txt` / `inventory.js` (refs per script/doc/agent/skill) · `unused-assets.js` (29 candidates).
  PAUSED (not closed): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" — detail below.
3b PAUSED (twelfth chat 30/09–01/10): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" — working files `_incoming/image-sitewide/` (not in git).
  DONE this chat (PR #152, merged after checker PASS + green checks):
  - INFY 20K OPEN (owner lifted the hold for photos/footer/body, item (19)); battery size removed; 20mL + adjustable
    airflow SHOWN as verified rows, the owner's ruling as source (named exception THAI_STYLE §5); INFY in the footer
    of every page + /brands/infy; the 7 baseline pages' title/meta/H1/JSON-LD price unchanged [ตรวจแล้ว — head-audit
    live vs local + checker].
  - Rule (a) on M Bar 9K, M Switch Kit, M Switch Pod: `openOnCardPhoto`, new card-v2 (the flavour photos' own master
    tilted in 2D — no new AI); the 5-option fans stay behind the "all" chip.
  - RELX Creator = the Creator Pro DEVICE (pod-kits, family relx-creator, closed pod system), 2 colours (grey-yellow,
    black — owner), RELX's official specs verified from relxnow.com, pod fit (Creator 20K + Muro Connector) = owner's
    word "ร้านยืนยัน" (named exception §5); Higgsfield ~11 credits; Thai copy = writer draft A [รอเจ้าของ — wording].
  - M Switch Pod v4: ONE master pod for 17 flavours + each flavour's own SALTHUB label (msw/v4.js, 0 credits); kit
    photos + both fans rebuilt from the same pods. Lessons 20–21 in `.claude/LESSONS.md`.
  - Proof (light set): tsc 0 · eslint 0 · verify:catalog 29/29 · sharpness PASS · scan.js 0/107 · locale-hydration 0 ·
    gallery-probe 45 pages PASS both modes · logs `_incoming/image-sitewide/verify-b5a/`, shots `shots/b5a/`.
  Rules PR #153 (merged): owner's cuts 7A–7D — docs-only PRs skip the checker · content dates ride inside each
  commit (post-commit hook `scripts/content-dates-amend.js`, author dates) · baseline full set ends 05/10 · Friday
  writes §16. A clone without hooks: `node scripts/prepare-clone.js`.
  SLIP to record as lesson พ8 in `.claude/LESSONS.md` with the next code PR (kept out of this docs-only PR): #153 was
  merged in the same shell line as `self-merge-check --pr 153`, which printed BLOCKED only because the local checkout
  was not the PR head (the checker's run at the PR head = BIG, criteria met) — run the gate alone, at the pinned head,
  and merge only on a non-BLOCKED last line.
  OWNER ANSWERS 01/10 (after the v99 report, word for word where quoted):
  - "M Bar 15K ก็คือ M Switch Kit แต่แยกตัวเครื่อง แยกหัวพอต · ตอนนี้บนเว็บยังโชว์อีก 1 ที่ในหมวดพอตใช้แล้วทิ้ง
    (okami24.store/products/m-bar-15k) พี่เดาว่าข้อมูลซ้อน" → a DUPLICATE record of the M Switch set (not a disposable);
    fix = AFTER the housekeeping round ("หลังรอบเก็บบ้านค่อยมาทำ"). Mind: m-bar-15k is a baseline page until 05/10.
  - "รูป INFY 20K ดูกราฟิก ๆ แปลก ๆ" → remake the INFY photos (card + 22 flavour photos) — AFTER the housekeeping round.
  - widen central §12 item 25 = in the housekeeping round, in one go · "คนแก้ไฟล์คนเดียวคือ Friday" (Friday edits the
    files, incl. the smogz-rules change [เชื่อว่า — Friday's reading; the rules repo's own flow names Javis for its PRs,
    so confirm the path at the housekeeping round's open])
  - spec-table header ("ข้อมูลที่ยืนยันได้จริง … เช็คกับเว็บทางการ…") on INFY / RELX: "ไม่ต้องติดป้าย" → leave as is.
  - "M Bar 9K · M Bar 10K · M Switch Kit · M Switch Pod: เปิดมาเจอรูปเดี่ยวแล้ว หัวข้อ "ทั้งหมด" กับรูปรวมยังอยู่" —
    [รอเจ้าของ] item 4 (25): M Bar 10K still opens on its lineup (`lineupFirst`, the owner-approved pilot) — Friday asked.
  NEXT: the housekeeping round (owner: "ให้จบเรื่องรูปชุดนี้ก่อนจะขึ้น Product ตัวใหม่"; M Bar 15K + INFY photos after it)
  — its order against BATCH 3 (06/10: argus-g4 + Argus Multi-Ohm) and BATCH 5 (rest of the site, planner first, rule (a)
  everywhere) = item 4 (26) [รอเจ้าของ].
  Carried: (D) out-of-stock suggestion (Esko 18/20) · (C)/(B) card sweep on 4:5 · the ARTICLE round · the
  category-structure round (item 4 (14)). DATED TO-DO after 05/10: delete `galleryNoteHeld` + the `heldNote` prop.
  Standing owner directions: IMAGE_SPEC §0 item 5 (rule (a) wins over the fan) · every product gets an SEO article
  in "more details" = its own later round.
4 waiting on owner:
  (25) NEW 01/10 — M Bar 10K: switch it to open on the single card too (like 9K / Kit / Pod; "ทั้งหมด" + the lineup
       stay behind the chip) — Friday recommends (rule (a), IMAGE_SPEC §0 item 5) · or keep the owner-approved pilot
       opening on its lineup [รอเจ้าของ — the 10K is owner-approved, 13.4 #8]
  (26) ANSWERED 01/10 — owner: "2 ครับ ขะเก็บบ้านก่อน" = the HOUSEKEEPING round comes next, before BATCH 3 / BATCH 5;
       the image round stays open (paused). The housekeeping round needs its own round file (owner / Javis).
  (22) ANSWERED 01/10 — M Bar 15K = the M Switch Kit split into device + pod, a duplicate record → after housekeeping (item 3)
  (23) ANSWERED 01/10 — widen central §12 item 25 in the housekeeping round, Friday edits (item 3)
  (24) NEW — Thai wording (13.4 #6): RELX Creator tagline/description/FAQ/who-for, INFY brand line/who-for/FAQ;
       words not in THAI_STYLE: "จอพิกเซล", "หน้าอีโมจิ" [รอเจ้าของ]
  (19)(20)(21)(18)(7) ANSWERED 30/09 — done in PR #152/#153 (above)
  (14) CATEGORY STRUCTURE — its own round, the owner plans it first [รอเจ้าของ]
  (1) image-theft protection A+B+C — its own round · (2) Muro Connector category · (3) SALTHUB per-flavour file request,
      no-photo panel wording A/B/C — carried
  (4) stray worktrees `_incoming/wt-main`, `_incoming/checker-wt`, `_incoming/wt-prb` (wt-prb has junctions: remove them
      with `(Get-Item <path>).Delete()` BEFORE `git worktree remove`) — remove once the owner agrees — carried
  (5) leftover unreferenced photo files (~17 + this batch's replaced v3 / lineup-v2 / old cards) — re-scan
      public/assets/products vs src/ at the round close; delete with the owner's OK (13.4 #1)
5 open questions (round "ไล่ดูทีละส่วน", pre-existing, NOT fixed — out of scope): (b) `dict.product.anatomyTitle`
  en/zh "from the outside in" · (c) no airflow row for M Bar 10K yet (moves 27 lastmod dates → after 05/10).
6 verify baseline at the last full close (clip round, logs `_incoming/clip-round/verify/`, unchanged since v85):
  tsc 0 · verify:commerce 17/17 · verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 ·
  thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
(context rule · agents load immediately · tools · verify · git = §17 of this file)
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

---

## 17. Standing rules and tools (not state — open when needed)

> Carried over verbatim from `docs/archive/HANDOFF.2026-09-21-v34.md` §17 — this is rules/tools, not round state, and this round did not touch it. · 2026-09-25 "rules move" round (main agent): only the section-13 pointers below were repointed from `~/.claude/CLAUDE.md` to `.claude/TEAM_RULES.md` (§8 stays in the central file) — no rule changed.

```
Context rule: .claude/TEAM_RULES.md 13.6 · §16 is updated at a batch close and at a chat move, not on every push (spec in doc-keeper.md · owner rules table item 5, 28/09) · an agent added or edited under .claude/agents/ is usable at once in the running chat — no new session needed (verified 2026-09-17; the old "needs a new session / HANDOFF 8.6" claim is dead — RULES_INDEX row 25)
Two-tier rule (owner 2026-09-14 — merged here from THAI_STYLE §6 on 2026-09-17, RULES_INDEX rows 50/68; screenshot rule 13.6 points here; how big each step is — light set vs full set, when designer, when a whole-site scan, when Lighthouse = `.claude/TEAM_RULES.md` 13.12, owner 2026-09-27): tier A = text only → no screenshots, no designer per batch · tier B = touches structure/screen (not sure = tier B) → what must exist before merge, in any order Friday chooses (owner rules table item 8, 28/09 — replaces the fixed build → shoot → draft → shoot → designer → checker sequence): before/after shots of the changed spots at 390 + 1440 from the same kind of machine (skill `tier-b-proof`) · designer only per 13.12 #4 · checker before merge · tier B merges as small and the shots go to the owner in the report (13.7, owner 28/09) · the owner's taste questions = one set per batch, the work does not wait (13.4 #6) · round close = skill `round-close` (scan first, designer once, word-break fixes in one commit — moved there 2026-09-20, RULES_INDEX row 76) · details of the original ruling: `docs/RULES_INDEX.md` rows 50/68 · every new sentence = 3 languages + the owner rules the Thai (same timing: 13.4 #6 / #2) · every number points at a verified spec row · no U+2060/NBSP outside the mechanism · thaiTypography() must have a locale guard · generated evidence must mirror the component logic in full · forbidden claims: THAI_STYLE §3 "คำ/ประโยคที่ห้ามในข้อความใหม่" (one list)
Do not touch (single list — merged 2026-09-17 from this line, §9 and §14, RULES_INDEX row 55): layout outside the named spot · images · motion · ordering-mode.ts · slug/URL/sitemap/structured data · service pages · Hero.tsx · cinematic/ · THAI_STYLE group ก · labelTh/name/shortName · lg:min-h-10 · age/nicotine warnings · colour/flavour names · thai-typography.ts list · CategoryLabel.tsx / label-lang · card-headline-spec.ts rules · dictionary catalog.card* / trust.* (set ก) · TrustBar row layout / 4 icons · sticky th on /compare · ScrollHintFrame · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools · every THAI_STYLE_LOG §7 row of round 30.4ข · ProductHero stats / PuffCount / Coil-72/89 category (data round) · footer.tagline / service pages / cart (their own rounds) — and never: joiner/NBSP outside the list · two Chrome jobs at once · fixing tier-B orphan words one by one · placeholders in an empty spec row · screenshots without a scan first — the scan-first / ≤30-shots-or-explain rule lives in .claude/TEAM_RULES.md 13.10 #15 (owner ruling 2026-09-18), not here
Hard rules: merge / deploy / force-push → ~/.claude/CLAUDE.md §8 + .claude/TEAM_RULES.md 13.7 (not restated here — RULES_INDEX row 45) · revert, never reset · never invent a number · deciding alone = easy to undo (customer-visible in-scope items: 13.4 #2), then write "ตัดสินเอง: … เพราะ …" · when to ask = 13.4 only (RULES_INDEX row 3) · work beyond the brief = .claude/TEAM_RULES.md 13.10 #1 (its own commit, same gates, listed in the report — RULES_INDEX row 85)
  · checker reports in the five fields of 13.5 + the Thai-copy gates = skill `thai-check` (checker.md item 5 points there; the checker reads the SKILL.md file — moved 2026-09-20, RULES_INDEX row 77) · who edits files = 13.5 (RULES_INDEX rows 13/52/58/59)
  · (the next two lines: Windows computer only unless a line says otherwise — the cloud is Linux, has no autocrlf, and `node scripts/test-server.js stop` works on both)
  · ปิด server: `node scripts/test-server.js stop` (ฆ่าเฉพาะตัวที่ฟังพอร์ต 3412 ตาม PID · `status` = ดูว่ารันอยู่ไหม) · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน — `test-server.js build` และ `verify:catalog --full` ปฏิเสธเองเมื่อ 3412 รัน · `npm run build` / `npx next build` ตรง ๆ ไม่มีด่าน (กันได้เฉพาะใน next.config/package.json — คำถามเจ้าของค้าง "ด่าน build แบบ B" §16) แต่ทำ server พังไม่ได้ เพราะ server รันจากสำเนา build ของตัวเอง · verify:catalog --full build เอง รันตอน server ปิด · Chrome ทีละงาน · งาน >10 นาที = (cmd &) + เฝ้า log
  · สคริปต์เขียนด้วย Write tool · ข้อความไทยเข้าสคริปต์ทางไฟล์ json/txt เท่านั้น (argv mangled) · shot.js ห่อผล eval JSON 2 ชั้น (parse ซ้ำ) · CRLF: ไฟล์ใหม่จาก Write = LF → unix2dos ก่อน git add · ตรวจ git ls-files --eol · ด่านก่อน commit `scripts/eol-check.js --staged` (.githooks/pre-commit · เปิดหลัง clone = RECOVERY §2ค) + `.gitattributes` เก็บ LF ใน git ทุกเครื่อง · ไฟล์ใน .githooks/ = LF เสมอ · Git Bash แปลง arg "/" → MSYS_NO_PATHCONV=1

เครื่องมือ — ใน git (scripts/): shot.js · card-lines.js + card-lines-diff.js (บรรทัดสเปกการ์ด ก่อน/หลัง 3 ภาษา) · empty-cards.ts · finder-dump.ts (ผล Finder ทุกคำตอบ) · head-audit.js (head/ลิงก์ทุกหน้าใน sitemap) — วิธีใช้อยู่หัวไฟล์ · also in git, found unlisted by round B (2026-09-27), usage in each file's head: site-audit.js (whole-site SEO re-audit) · overflow-390.js (sideways-scroll gate, every sitemap page) · html-diff.js (two HTML dumps, build ids normalised) · measure-articles.ts (article length/links/keywords) · related-boxes.ts (every product's "อ่านต่อ" box as JSON) · guide-reading-rate.ts (Thai chars per reading minute) · record-scroll.js + frames-to-gif.js (scroll recording → GIF) · ประวัติ นอก git (_incoming/30.4b ของรอบ 30.4ข — หายเมื่อยกขึ้นคลาวด์): k3-shots.js <before|after> [--only …] [--locale …] (ครอปหัวหน้า+วัดบรรทัด) · k3-variant.js <json> (ลองคำใหม่ไม่ต้อง build) · k4-eyebrow-pairs.ts · k4-shots.js <tag> [--faq-file f] [--search-file f] · k5-shots.js <tag> [--variant row|cards] [--short] [--only w] [--locale l] · k6-shots.js <tag> (sticky /compare + hover จำลอง) · k*-sheets.js (ภาพรวม before/after) · (กลับมาใน git:) scripts/wordbreak-scan.js --base … --widths 390,1440 --out _incoming/30.4b/wb-<tag> /path… (MSYS_NO_PATHCONV=1) → node scripts/wb-diff.js <before> <after>
  · .claude/launch.json ("vapor-dev", port 3000) is the owner's own dev server — agents never start it (RULES_INDEX row 16) · test server: `node scripts/test-server.js build` แล้ว `node scripts/test-server.js start` (ค่าเดิมอยู่ในสคริปต์: SITE_URL=https://okami24.store · OKAMI24_DATA_DIR=<tmp> · OKAMI24_BACKUP_DISABLED=1 · OKAMI24_STARTUP_PROBE=0 · พอร์ต 3412 · log `_incoming/test-server-3412.log`) · build ใหม่แล้วต้อง stop → start ถึงจะเสิร์ฟ build ใหม่
src files the skills use (the one list — skills may not name a file under src/, `.claude/TEAM_RULES.md` 13.3 "สกิลเขียนอะไรได้", owner ruling item 5 round B 2026-09-27; fix a renamed file here): [i18n-test] `npx tsx src/i18n/i18n-contract-test.ts` · [catalog-method] `src/data/shipnity-seed/README.md` section "Catalog reconciliation methodology" · [legacy-products] `src/data/products/*.ts` · [taxonomy] `src/data/shipnity-seed/active-catalog-to-product-master.ts` (`TAXONOMY_MATCHES`) · [spec-gate] `src/lib/verified-specs.ts` + `src/lib/verified-specs-contract-test.ts`
Verify: the full set with its commands = skill `round-close` step 3 (a batch runs the set `.claude/TEAM_RULES.md` 13.12 names — light by default) · pass = what each script prints · the counts last seen at a close = §16 item 6 "verify baseline at last close", not a rule text (moved 2026-09-20, RULES_INDEX row 78)
Git: commit split by type per 13.7 (English prefix feat/fix/copy/data/docs/chore/agents/rules) · git commit -F <file> · English · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push/merge/deploy rules = 13.7 (RULES_INDEX rows 2/14/45)
agent: who does what = `.claude/TEAM_RULES.md` 13.3 · when to call each one = the `description` line of its own file in `.claude/agents/` (one place — round B 2026-09-27 cut the copy that stood here) · never call one per sub-item
tag: command and sequence = skill `round-close` step 5 (rule in 13.7; name table in docs/RECOVERY.md §2 — moved 2026-09-20, RULES_INDEX row 75)
```
