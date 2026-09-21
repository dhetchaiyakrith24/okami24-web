# OKami24 — HANDOFF · v37 · 2026-09-22 (round SEO ข closed: tag `seo-b-done` on the docs commit that follows `68945f3` — 12 articles + 5 technology pages carry full spec content, JSON-LD dates/author, and the word-break fix; merged via PR #44 · main = `b1b319d` · deployed 2026-09-22 01:46, build passed in 1m31s · Cowork checked the live site)

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

1 main: origin/main = `7ab1b56` (full 7ab1b5657b00908084fdd7865d82f70e5ab489ff), read directly from `.git/refs/remotes/origin/main` [ตรวจแล้ว] — unchanged since the last edition; SEO ข has not been merged to main yet, that is Cowork's job (see item 4). Tags on record (all confirmed present under .git/refs/tags/ as of the last doc-keeper read, batch 4): pre-config-2026-09-09 · pre-30.1-2026-09-09 · pre-30.2-2026-09-10 · lang-done · r30-4b-done · pre-housekeeping · housekeeping-done · skills-done (9acc296) · prices-complete (07f74a9) · seo-a-done (68e2a14, 2026-09-21) · **seo-b-done** — created by the main agent on the docs commit that follows `68945f3`; the hash goes into `docs/RECOVERY.md` in a small follow-up commit (same pattern as seo-a-done/9bcb3df), not yet known at the moment doc-keeper wrote this line [เชื่อว่า, reported by the main agent's brief]. git fetch before trusting any merge claim · never merge yourself.
2 branch checkpoint/phase-3.3.3 ahead of main by: **5 commits + this docs commit, pushed right after** [เชื่อว่า, reported by the main agent's brief — doc-keeper did not walk `.git/logs/HEAD` itself this batch] — `e6dcb09` seo(articles): Article JSON-LD carries datePublished/dateModified/author.name · `7d74f46` copy(technology): batch 4, 5 technology pages EN/TH/ZH · `2d42f7c` docs: HANDOFF batch 4 committed, stop rulings recorded · `68945f3` fix(typography): five locked compounds never split, 11 model names bound, negation joiners for the article pages (round SEO ข close fix) · + this docs commit (HANDOFF/ROUND_COST/THAI_STYLE_LOG/SEO_BASELINE/RECOVERY, batch 5). Confirm with `git log origin/main..HEAD --oneline` at the top of the next chat.
3 open round: **none — SEO ข closed 2026-09-22, tag `seo-b-done`** (created on the docs commit that follows `68945f3`) [เชื่อว่า, main agent's brief — doc-keeper cannot create a tag itself].
  Round summary, batches 1–5 compressed (full batch-by-batch detail is in earlier editions of this file and this file's git history — not restated here to stay under the 15 KB cap): 1 survey+outline (researcher) · 2 YouTube table+oEmbed → STOP 1 "เคาะโครง" 2026-09-21 · 2.5 mechanism committed `5fcc35a` (inline links/H3/FAQ/review-video plumbing) · 3 guides body → STOP 2 "เคาะเนื้อ" 2026-09-21, committed `6851be9`+`e1c6487`+`c31ba63` (7 guides EN/TH/ZH, 39 links, 20 FAQ, 3 clips) · 4 technology pages → STOP 4, committed `e6dcb09` (Article JSON-LD dates/author) + `7d74f46` (5 technology pages EN/TH/ZH) · 5 close: word-break fix `68945f3` (5 locked compounds never split, 11 model names bound, negation joiners) + this docs batch.
  Permanent rulings for this round **and after** (do not re-ask, 13.10 #12): gate 11 — every "ร้านเรา/ที่ร้าน" sentence traces to BSOT or is cut · no completeness claims about stock (all/only/ทั้งหมด/ทุกรุ่น) · no per-model draw-style claims (drawStyle = Finder attribute, unverified) · numbers that conflict across pages are cut, not fixed · an absence claim ("ไม่มีจอ/ไม่มีปุ่ม/ตัดออก") must trace to an explicit row or record field, never to a missing spec row · **the NEVER_SPLIT typography list (5 locked compounds) is a line-break mechanism, not a THAI_STYLE §3 word-choice rule — the two are not the same thing** · the 390px sideways-overflow scan is now a standing close gate, not only a tier-B batch gate.
  Owner's stop-1 question, answered (what in the round file made the work harder, one line each): (1) the numeric §ก per-page character targets — withdrawn by the owner; the verified material actually gave 795–1,142 Thai characters per technology page, not the file's target (2) the round file's "do not touch seo.ts / src/app" list conflicted with the Article JSON-LD date/author task the owner gave later in the same chat, on those exact files.
  Previous round SEO ก (closed 2026-09-21, tag `seo-a-done`) — see prior editions of this file / `docs/archive/HANDOFF.2026-09-21-v34.md`; unchanged this batch, not repeated here.
4 waiting on the owner: **new — Cowork: merge branch to main + deploy + live check + request indexing for the 12 article URLs** (owner said they will do it) [เชื่อว่า]. Unchanged older items stay: (ก) add the SEO ก round's 4 new words to THAI_STYLE §3 as locked words? recommended: not yet, judge after 2026-10-05 (ข) og:title of the homepage still the pre-round string — change to match the new <title> (A1)? recommended: yes, next copy round, not urgent (ค) which round opens next — **resolved**, the owner opened SEO ข (see item 3) [ตรวจแล้ว, self-evident from this file]. Older, unchanged: 9.4 rollback drill · footer.tagline ตัด 3 คำซ้ำ · zh โน้ตความเข้ากันได้ 2 ข้อ · TPD · #31 #34 iPhone · ผลเฝ้า Render OOM · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
  4b ไม่ต้องรอ — เจ้าของตัดสินแล้ว ห้ามถามซ้ำ (carried verbatim): ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม บนหน้าร้าน + เว้นคำ "น้ำยา" ออกจาก head copy จนกว่าหมวดน้ำยาจะมีของขึ้นหน้าร้าน · caliburn-g4-pro = Pod-181 (แก้แล้ว) · muro-3ml = ฿99 (คงเดิม) · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · tagline/ตะกร้า/หน้าบริการ = รอบของมัน · CLAUDE.md แก้เฉพาะข้อที่เจ้าของเคาะ · ใส่กฎใหม่ = ลบกฎเก่าเรื่องเดียวกันทุกที่ (ยกเว้น ~/.claude/CLAUDE.md §1–§11) · ชั้น 9 ก๊อปไฟล์นอกรีโปก่อนแตะ · ชั้น 10 รวม/ลบกฎต้องกางเต็ม
5 open questions: **new this close** — "แถว/บรรทัด" pair for "spec row" not locked (thai-copy proposal: lock "แถว", owner has not ruled) · caliburn-g5 ↔ coil-94 mL disagreement (pod 3 mL vs coil-94 2 mL, no verified row resolves it) · Finder draw-style still unverified · 27 storefront products without a clip · the writer's optional VINCI S sentence, drafted but not used on any page. Unchanged older: memory files under ~/.claude/projects/.../memory/ were never audited by rule-auditor — candidate for the next housekeeping round · LAUNCH_AUDIT is 200+ KB with most rows closed — a split (closed rows → LAUNCH_AUDIT_DONE.md) is proposed, not done · production backup cadence unconfirmed [เชื่อว่า] per render.yaml — Cowork to check the Render log for "[backup]" · when the stock API lands, overwrite the 20 basis:"owner-estimate" rows in src/data/shipnity-seed/legacy-price-approvals.ts with real supplier prices, in that one file only.
6 verify baseline at last close — **SEO ข round close, 2026-09-22** (the only place these counts live) [เชื่อว่า, reported by the main agent's brief from `_incoming/seo-b/close-*.log`, `wb-close5-summary.md`, `wb-diff-close-final.md` — doc-keeper did not run the scripts itself]: verify:catalog --full 20/20 · verify:commerce 16/16 · i18n contract 16/16 · raw-chars (NBSP/U+2060) 0 · scan.js English-leak 0/105 · count-storefront 53 shown / 53 buyable · jsonld-all.js over the 105-URL sitemap — 0 parse failures, types {Organization:1, WebSite:1, CollectionPage:20, BreadcrumbList:100, FAQPage:12, Product:53, VideoObject:12, Article:12}, 4 pages without ld+json (the 4 service pages, owner's list, unchanged) · **new gate this close**: overflow-390 (sideways-scroll at 390px) 105/105 pass · word-break scan of the round's 17 pages after the `68945f3` fix: compound-split 1 (homepage) · latin-term-split 1 (homepage) · single-word-last-line 28 (orphans, accepted — not fixed by the rule mechanism) · negation-at-line-end 0.
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
