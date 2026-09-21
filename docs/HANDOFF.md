# OKami24 — HANDOFF · v34 · 2026-09-21 (SEO ก round closed — tag `seo-a-done`, JSON-LD on 101/105 pages, new title/description on 9 pages + a price line on 53 product descriptions + a 22-item backlog, nothing the visitor sees changed)

Written: 2026-09-21 · Based on: local HEAD `6618e12` (branch `checkpoint/phase-3.3.3`), read directly from `.git/logs/HEAD` [ตรวจแล้ว] · `origin/main` reported by the main agent as `d9d318a` ("Merge pull request #40") via `git fetch` + `curl` just before this handoff was written — doc-keeper has no git/curl tool and could not re-run either check, so that value and the three live-price probes are tagged [เชื่อว่า] throughout this file · this is a full rewrite (skill `handoff`, owner typed `/handoff`, condition (ข)) — the previous file is archived at `docs/archive/HANDOFF.2026-09-21-v30.md`, untouched

> **How to read:** every statement carries one of the three tags of ~/.claude/CLAUDE.md 13.10 #9 — **[ตรวจแล้ว]** (seen in the file/commit) / **[เชื่อว่า]** (reported, not verified) / **[รอเจ้าของ]** (needs the owner) — the older set "ตรวจแล้วจริง / ผมเข้าใจว่า / เจ้าของบอก" is retired (RULES_INDEX row 48) · **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"**
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **Thai on the site: `docs/THAI_STYLE.md` is the single source of truth** (rules only — §2 four layers · §3 locked words · §4 typing · §5 group ก/ข + typography mechanism · §6 open work). When to read it is decided in one place, skill `round-open` step 1 (where `~/.claude/CLAUDE.md` 13.9 points since 2026-09-20): only on rounds that touch site copy. Before→after examples and "considered, not done" live in `docs/THAI_STYLE_LOG.md` §6–§7 — open it only to cite a past ruling. (RULES_INDEX row 10, 2026-09-17)

---

## Conflicts found

None found between this session's facts and the repo. [ตรวจแล้ว] The only gap: doc-keeper cannot run `git fetch`/`curl`, so the `origin/main = d9d318a` value and the three live-price JSON-LD probes in this file rest on the main agent's report, not on an independent re-check by this writer — flagged [เชื่อว่า] wherever used, not silently trusted. Two things the round-1 checker flagged as stale mid-round (HANDOFF §16 item 3 saying "batch 1 in progress" after batches 2–4 already passed; §16 item 6 still showing the pre-round verify counts) were both fixed before commit `07f74a9` and confirmed fixed by the checker's round-2 pass — no longer live discrepancies. [ตรวจแล้ว] per `_incoming/prices/checker-1-findings.txt`.

---

## 1. Current state

**[ตรวจแล้ว]** unless marked otherwise

- **Project:** OKami24 vape shop · Next.js 16 + TS + Tailwind v4 + SQLite · folder `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **Working branch:** `checkpoint/phase-3.3.3` · local HEAD `6618e12` [ตรวจแล้ว, `.git/logs/HEAD`] · `origin/main` reported as `d9d318a` = PR #40 merged (contains both the skills round and the prices round) [เชื่อว่า] — branch is ahead of main by **0 commits** if that report holds; git 8's own `git status`/`git log` at the top of the next chat is the way to confirm (see "First things" below)
- **Both rounds of this chat are closed and merged:** skills round (tag `skills-done`, hash `9acc296`) and prices round (tag `prices-complete`, hash `07f74a9`) — both tags pushed [เชื่อว่า per brief, RECOVERY.md table records the hashes ตรวจแล้ว]
- **The live site already shows the new prices** — reported by the main agent from a `curl` of three product pages' JSON-LD `price` field just before this handoff (`caliburn-g5` 1190 · `relx-smash-go-12k` 299 · `drag-6` 2490) [เชื่อว่า] — doc-keeper has no curl tool to re-check
- **Online ordering is still off** (`OKAMI24_ORDERING=off`, LAUNCH_AUDIT item 43) → LINE `@okm24` is the buy channel · item 44 (7 criteria to reopen ordering) is now **1/7** as of 2026-09-21, criterion 1 met "as far as an estimate can meet it" (25/45 legacy prices are supplier-confirmed via Shipnity, 20/45 are owner estimates) [ตรวจแล้ว, `docs/LAUNCH_AUDIT.md` line 8 + item 44 row]
- **Checkpoints/tags on record** (all in `docs/RECOVERY.md` §2, the single table): `lang-done` · `r30-4b-done` · `pre-housekeeping` · `housekeeping-done` · `skills-done` (`9acc296`, 2026-09-21) · `prices-complete` (`07f74a9`, 2026-09-21) — 7-char codes live only in that table
- **Next round per `LAUNCH_AUDIT.md` head / this file's §13:** SEO → articles → data → cart. Nothing is open right now; the owner has not opened the next round.

---

## 2. Done (working, verified)

**[ตรวจแล้ว]** — full history of each round is in the archived HANDOFF versions cited; this section is the current summary only.

- Everything listed in `docs/archive/HANDOFF.2026-09-21-v30.md` §2 (round 30.4ข: headings K1–K3, card spec lines, category ledes, FAQ/search eyebrows, TrustBar, /compare sticky header, source-link hover, wordbreak fixes) is still live and untouched by the two rounds since.
- **Skills round (2026-09-20 → 21):** three project skills created — `.claude/skills/round-open/SKILL.md`, `round-close/SKILL.md`, `thai-check/SKILL.md` — replacing procedure text that used to be duplicated across `~/.claude/CLAUDE.md`, `docs/HANDOFF.md`, `.claude/agents/checker.md`. `docs/RULES_INDEX.md` rows 74–79 record the pointer chain. `docs/AI_TEAM_GUIDE.md` §7 gained a skills table with a "when to call" column. `src/` untouched (diff empty). tsc exit 0 · i18n 16/16 · raw-chars 0 [ตรวจแล้ว, `_incoming/skills-round/*.log`].
- **Prices round (2026-09-21):** all 45 legacy products now carry an owner-approved selling price in `src/data/shipnity-seed/legacy-price-approvals.ts` — 25 rows `basis: "shipnity"` (16 pre-existing + 9 new, cross-checked against the Shipnity 2026-09-21 table) and 20 rows `basis: "owner-estimate"` (owner's pricing formula, quoted in `docs/BUSINESS_SOURCE_OF_TRUTH.md` §5). Storefront census: **53/53 shown products are buyable, 0 without a price** [ตรวจแล้ว, `_incoming/prices/count-storefront.log`, independently re-run by the checker with the same result]. JSON-LD `offers`/price confirmed on 6 product pages across the round's two checker passes (3 by the coordinator, 3 more independently picked by the checker) [ตรวจแล้ว, `_incoming/prices/jsonld-check.log` + checker-1-findings.txt].
- Full verify set passed at the prices-round close — exact counts are in §16 item 6 of this file (the only place they are kept, per owner ruling 2026-09-21).

---

## 3. Just done (this session — one chat, two rounds, 2026-09-20 → 21)

**Skills round** (on top of `origin/main` at the time, `668a2d9`, PR #38):

| Commit | What |
|---|---|
| `eb7d2cc` | skills: add round-open, round-close, thai-check (procedures moved out of the rule files) |
| `8404812` | docs-pointer: replace the moved procedures with one-line pointers to the three skills (RULES_INDEX rows 74-79) |
| `edd1006` | team-guide: AI_TEAM_GUIDE §7 — skills table (4 in-repo + handoff) with a "when to call" column |
| `9acc296` | docs: HANDOFF v29 — skills round closed (§16 five items refreshed, ROUND_COST row added) — **tagged `skills-done`** |
| `a09fde4` | docs: RECOVERY.md tag table — skills-done (9acc296, 2026-09-21) |
| `9bf959f` | docs: HANDOFF v29 header/§1 on v29 facts, §16 item 6 "verify baseline at last close", v28 archived |
| `6a6e26c` | merge origin/main: Fast-forward — PR #39 (skills round) merged into main |

**Prices round** (on top of main `6a6e26c`):

| Commit | What |
|---|---|
| `ca1128e` | data(prices): approved selling price for all 45 legacy products — 9 from Shipnity, 20 owner estimates, basis tag |
| `07f74a9` | docs(prices): BSOT §5 pricing update, LAUNCH_AUDIT item 44 criterion 1, HANDOFF v30, ROUND_COST row — **tagged `prices-complete`** |
| `6618e12` | docs: RECOVERY.md tag table — prices-complete (07f74a9, 2026-09-21) — **current local HEAD** |

All eight non-merge commits above are [ตรวจแล้ว] read directly from `.git/logs/HEAD`. `origin/main` = `d9d318a` (PR #40, merging the prices round) is [เชื่อว่า] per the main agent's report only.

**Owner-approved exception used this session:** `ca1128e` also edited `src/lib/commerce/catalog-resolver-contract-test.ts`, a third file outside the prices instruction file's two-file touch list — reported as "owner-approved in chat, option ก" in the commit message and in this file's §16 item 4. No written record of that permission exists anywhere else in the repo; the checker could not independently confirm the permission, only the technical necessity (batches 3+4 removed the last unpriced legacy fixture row, so the old test assertion would otherwise fail) [เชื่อว่า] per brief + commit message only.

---

## 4. Known broken / missing, not fixed yet

- **[ตรวจแล้ว] Resolver test coverage gap (new this round):** no test now calls `resolveProductRef()` with a real, catalogued, unpriced legacy slug, because all 45 legacy products are priced. That code path — the money boundary rejecting an unpriced-but-real legacy product — is currently unexercised by any test. Disclosed honestly in `ca1128e`'s commit message; the "covered by" comment left in `catalog-resolver-contract-test.ts` slightly overstates what the other test actually checks (it calls `getCatalogItem()`, not `resolveProductRef()`). Per `_incoming/prices/checker-1-findings.txt` "Contract test 5".
- **[รอเจ้าของ] caliburn-g4-pro Shipnity code mismatch:** the file's `shipnityProductId` is `Pod-168`; the prices instruction file's Shipnity 2026-09-21 table lists this product as `Pod-181`. The price (1190) matches either way — only the parent code disagrees. Recommendation on record: change the file to `Pod-181`.
- **[รอเจ้าของ] muro-3ml not in the Shipnity table:** the file has it at `Pod-120`, ฿99; that slug/code does not appear anywhere in the prices round's Shipnity 2026-09-21 table, so it is unconfirmable from that source. Recommendation on record: keep ฿99.
- Everything `docs/archive/HANDOFF.2026-09-21-v30.md` §4 listed is still open and untouched by either round this session: footer.tagline 3-word repeat with the trust strip · zh compatibility-note strings (2 spots) still English · Coil-72/89 category-label mismatch · 6 cards with an empty spec row · `ProductHero.tsx` stats not checking `verified` · TPD labelling on VINCI S/G3 mini · `PuffCount.tsx` dead code · `/favorites` and order-status zh eyebrow⊂H1 duplication · a Tier-B backlog of ~30 word-break items the owner declined to chase one by one · #31/#34 iPhone check · 2 `priority` spots · `th.ts` dead strings · hidden FAQ research · a stray dev-language comment in `relx.ts:19`.

---

## 5. In progress (scaffolded, needs continuation)

None. [ตรวจแล้ว] Both rounds of this session closed cleanly — skills round merged (PR #39), prices round merged (PR #40, per the main agent's report). No branch work is mid-flight. The next round (SEO, per §13) has not been opened.

---

## 6. Needed, not started

Same long list as `docs/archive/HANDOFF.2026-09-21-v30.md` §5.2/§6 (SEO round · articles round · data round: Coil-72/89 taxonomy, TPD, ProductHero verified-gate, PuffCount removal · cart round + item 49 + order-status eyebrow · item 45 security review · admin page (item 1, parked) · QR library (items 40/41) · item 42 path-2 offsite backup (R2/B2) · sales/label/meta rounds) — plus, new from this round: **when the stock API lands, overwrite the 20 `basis: "owner-estimate"` rows in `src/data/shipnity-seed/legacy-price-approvals.ts` with real supplier prices, in that one file only** [ตรวจแล้ว, `docs/BUSINESS_SOURCE_OF_TRUTH.md` §5 + this file's §16 item 5].

---

## 7. Questions for the owner

| Topic | Known | Unknown | What to answer |
|---|---|---|---|
| caliburn-g4-pro Shipnity code | File says Pod-168, table says Pod-181; price agrees either way | Which code is the real parent SKU | Change the file's code to Pod-181? (recommended: yes) |
| muro-3ml price | File has ฿99, absent from the Shipnity table | Whether ฿99 is still correct | Keep at ฿99? (recommended: yes) |
| `13.x` section-number anchors inside the three skills | The round-open/round-close/thai-check skills cite `~/.claude/CLAUDE.md` 13.2/13.4/13.5/13.6/13.7/13.9/13.10 #15 and "HANDOFF §16/§17" even though the round that created them banned section-number references elsewhere | Whether anchors-as-pointers are an accepted exception | Allow these anchors to stand, or rewrite them without section numbers? |
| Misspelling regex kept inside `thai-check` | The skill kept a regex for four misspelled words (`พอตี` etc.) because THAI_STYLE has no row for them | Whether that should move into THAI_STYLE instead | Leave as is, or add the four words to THAI_STYLE and drop the regex? |
| Resolver coverage gap (§4) | No test currently exercises `resolveProductRef()`'s "not-purchasable" branch with real data | Whether a synthetic fixture should be added to keep that path tested | Add a synthetic unpriced-legacy fixture just for that test, or accept the gap until a real one reappears? |
| Everything else | Unchanged since `docs/archive/HANDOFF.2026-09-21-v30.md` §16 item 4 — see that list (9.4 rollback drill · which round next · footer.tagline · zh notes · TPD · #31/#34 iPhone · Render OOM watch · priority spots · Lighthouse · items 10/13/16/37 · account name · black-pod photos · R2/B2 · QR library · account 189) | — | Not repeated here to keep this table short; full list is one click away |

---

## 8. Risks and things to watch (most dangerous first)

1. **[ตรวจแล้ว] Resolver test coverage gap** (§4) — a real code path (rejecting an unpriced legacy product at the purchase boundary) has no test covering it with real data any more. Low risk today (all 45 are priced) but would silently regress if a 46th unpriced legacy product were ever added without a price row.
2. **[เชื่อว่า] Owner permission for the third-file edit exists only as a chat claim** — recorded honestly as unconfirmed in both the commit message and this file, but there is no independent proof anywhere in the repo. Future checkers/owners re-reading the commit should not treat it as settled fact.
3. **[รอเจ้าของ] Production DB backup cadence unverified today** — `render.yaml` declares a 6-hourly backup to `/var/data/backups`, but nobody has checked the Render log for a `[backup]` line since the prices round closed. Low current risk (cart is off, no real orders land in the DB) but must be confirmed before item 44 can close.
4. **Cowork merges and deploys without announcing it in chat** — `git fetch` before trusting any "main is at X" claim; this file's own main-hash line is itself unverified by doc-keeper this round (see header).
5. **Session/tool findings worth carrying forward** (not project bugs, session-specific — [เชื่อว่า] per brief): a freshly written skill can answer "Unknown skill" until the file receives one more change event (e.g. a `touch`) — see `_incoming/skills-round/skill-invocation-test.md`; `npx tsx -e "<script with imports>"` hung on this machine — use a saved script file instead (`_incoming/prices/check-slugs.ts` is the working pattern); background agents/commands get marked "stopped" when the desktop session restarts, but results already delivered in chat before the restart stayed valid.
6. **Session context at the skills-round report was 86k → 262k tokens of 1M (26%)** [เชื่อว่า, from the app's own usage reader — the `/context` slash command is not available in this app] — informational only, not a current risk, but the number the owner asked to see once.
7. The two-tier rule (tier A/B), NBSP/word-joiner mechanism, and the full do-not-touch list are unchanged and live in §17 below — read there, not restated here.

---

## 9. Do not tear down (owner-approved or working as intended)

Everything in `docs/archive/HANDOFF.2026-09-21-v30.md` §9 / §17 "Do not touch" (layout, images, motion, ordering-mode.ts, slugs/URLs, service pages, Hero.tsx, THAI_STYLE group ก words, card-headline-spec.ts, TrustBar, sticky /compare header, every locked THAI_STYLE_LOG §7 row, etc. — the single list, not restated here) **plus, added this session:**

- The `basis` field and the 20 `basis: "owner-estimate"` rows in `src/data/shipnity-seed/legacy-price-approvals.ts` — owner-ruled acceptable 2026-09-21, do not delete or "clean up" ahead of the stock API landing.
- The three project skills (`round-open`, `round-close`, `thai-check`) and the pointer chain that replaced the duplicated procedure text (`docs/RULES_INDEX.md` rows 74–79).
- `HANDOFF.md` §16 item 6 as the single, only home of the verify pass-counts — no other file should carry a second copy of these numbers.

---

## 10. Git — how mixed working-tree changes should be split into commits

**[ตรวจแล้ว]** Working tree is clean as of local HEAD `6618e12` except one untracked file (`docs/archive/HANDOFF.2026-09-21-v30.md`, created by the main agent for this handoff before doc-keeper was called — not this writer's file to commit) and the gitignored `_incoming/prices/` briefs folder. Nothing else is uncommitted, so there is nothing to split this round. Branch `checkpoint/phase-3.3.3` is fully contained in `origin/main` per the main agent's report [เชื่อว่า] — never merge yourself; that is Cowork's job.

---

## 11. Readiness per system

| System | Status | One-line reason |
|---|---|---|
| Catalog browse / search / compare | Ready, live | Unchanged this session; last verified in round 30.4ข |
| Pricing (53 storefront products) | Ready, live | 53/53 buyable, 0 unpriced [ตรวจแล้ว, `_incoming/prices/count-storefront.log`] |
| Online ordering (cart/checkout) | Off on purpose | `OKAMI24_ORDERING=off`; item 44 at 1/7 criteria |
| LINE ordering path | Ready, live | `/cart` and `/checkout` redirect to `?order=line`; unchanged this session |
| Admin page | Parked, not started | Owner order — do not build without being asked |
| OTP / phone verification | Parked, off | Owner order — do not re-enable without being asked |
| Production DB backup | Configured, unverified today | `render.yaml` declares 6-hourly; no fresh Render-log check this session [รอเจ้าของ] |
| Rollback drill | Never rehearsed | `docs/RECOVERY.md` §1 — owner + Cowork's task, off-hours |

---

## 12. What was mid-flight when the chat closed

Nothing. [ตรวจแล้ว] Both rounds closed, both tagged, both merged per the main agent's report. What is genuinely open is not "mid-flight work" but **decisions waiting on the owner** — five items, listed in full in §7 and §16 item 4.

---

## 13. Recommended next steps (ordered, with reasons)

1. Paste the §16 block into a new chat, then run `git status` + `git log -5 --oneline` + `git tag -n1` and compare with what §16 says — if they differ, trust the repo (this is also "First things" item 1 below).
2. **Do not open the next round without the owner.** Per `LAUNCH_AUDIT.md` head and the prior round order, SEO is next; when the owner opens it, run `scope-auditor` once and build the round's instruction file from `docs/TEMPLATES.md` (ก) — reason: 13.10 #6 says one chat = one round, and this chat already ran two only because the owner opened the second one deliberately.
3. Route the five owner questions in §7 to the owner as one batch, not piecemeal — reason: 13.4 #6 groups customer-facing/taste/new-word questions into one ask per batch; these five are the same kind of "needs a person, not code" decision.
4. 9.4 (rollback drill) stays with the owner + Cowork, off-hours, per `docs/RECOVERY.md` §1 — not something the next Code chat should start on its own.

---

## 14. Stop doing (things that waste time or add risk)

- **Re-verifying the 16 old (pre-existing) legacy prices by hand every round** — the Shipnity table is now the source of truth for those 16; only report a diff if one appears, do not re-derive from scratch.
- **Shooting screenshots on tier-A (text-only/data-only) rounds** — the prices round needed zero screenshots; do not add them out of habit.
- **Opening a second round in the same chat** — 13.10 #6 reserves this for when the owner does it on purpose, as happened this session; it is not a default pattern to repeat.
- Everything else not to do is the single list in §17 "Do not touch" below — not restated here.

---

## 15. Project end state — full flow, marking which steps already work

**Search → product page with price → LINE `@okm24`** — works today, live. [ตรวจแล้ว, LAUNCH_AUDIT §1 head + this session's storefront census]
**Cart / checkout** — scaffolded but switched off; waits on the stock API landing (to replace the 20 owner-estimate prices with supplier data) and on LAUNCH_AUDIT item 44's remaining 6 criteria before the `OKAMI24_ORDERING` switch can be turned back on. Full step-by-step flow (browse → colour/flavour pick → stock check → payment → confirmation → order status) is unchanged from `docs/archive/HANDOFF.2026-09-15-v21.md` §15 — read there for the complete diagram; this section states only what moved this session (pricing is now complete, cart itself did not move).

---

## 16. Paste block for the next chat (copy-paste) — keeps only 6 things: main · what the branch is ahead by · open round and where it stopped · waiting on the owner · open questions · verify baseline at the last close (cap 15 KB · rules/tools = §17)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Read first: the single list is step 1 of skill round-open (.claude/skills/round-open/SKILL.md — 13.9 points there since 2026-09-20; opening a round = that skill, closing = round-close, touching site copy = thai-check)

1 main: origin/main reported at `d9d318a` (PR #40 — merges PR #39's skills round together with the prices round) [เชื่อว่า] per the main agent's git fetch + curl report from the prices-round close; doc-keeper has no git tool and could not re-run it. Local HEAD on checkpoint/phase-3.3.3 = `0b015bd` [ตรวจแล้ว, .git/logs/HEAD] — this docs edit (HANDOFF v34) becomes the next commit on the branch, the round-close commit; it is followed by an annotated tag `seo-a-done` on that commit and then a small docs commit that fills in the RECOVERY.md hash row (same pattern as `6618e12` did for `prices-complete`) — doc-keeper has no git tool to make either commit or read the tag back, so both hashes are `[ยังไม่มีข้อมูล]` here; the main agent fills them in. Tags on record: skills-done (9acc296) · prices-complete (07f74a9) · seo-a-done (hash pending — see above) · housekeeping-done · pre-housekeeping (hashes only in docs/RECOVERY.md §2 / git tag -n1) · git fetch before trusting this · never merge yourself
2 branch checkpoint/phase-3.3.3 ahead of main by: 6 commits — `6873f03` (data(prices), re-verified evidence for caliburn-g4-pro Pod-168→Pod-181 and muro-3ml, prices unchanged) · `b07979d` (feat(seo), batch 1 — Organization+WebSite JSON-LD on /, offers.seller on every Product) · `cd82b45` (docs HANDOFF v32) · `5a584eb` (feat(seo), batch 4 — BreadcrumbList/CollectionPage/FAQPage/Article + offers.shippingDetails/hasMerchantReturnPolicy) · `91ef1d9` (docs HANDOFF v33) · `0b015bd` (copy(seo), batches 3+5 — the owner-เคาะ'd titles/descriptions, the B2 price line on every product, and the 22-item short-copy backlog) [ตรวจแล้ว, .git/logs/HEAD] — plus this docs commit (HANDOFF v34, round close) and the RECOVERY hash-fill commit that follows it, making **8 total** per `docs/ROUND_COST.md`'s SEO ก row; confirm with `git log origin/main..HEAD --oneline` at the top of the next chat — if it prints something different, trust the repo
3 open round: **none — SEO ก closed** 2026-09-21, tag `seo-a-done` (hash: the docs commit that follows this edit — see item 1). What the round did (all tier A — head `<title>`/meta/JSON-LD only, no visible component or new block on any page) [ตรวจแล้ว unless marked]: Organization + WebSite JSON-LD on / (`src/lib/seo.ts`: organizationJsonLd, websiteJsonLd) · offers.seller on every Product offer · BreadcrumbList (100) / CollectionPage (20) / FAQPage (1) / Article (12) + offers.shippingDetails + hasMerchantReturnPolicy on 101/105 sitemap pages, the 4 without = /warranty /shipping /how-to-order /privacy (owner's untouchable list, deliberately excluded, not a gap) · new `<title>`/description on 9 pages (home · about · contact · /products · /brands/relx · /brands/salthub · /brands/voopoo · /brands/uwell · /products/m-bar-15k), word-for-word from the owner-เคาะ'd table `_incoming/seo-a/table-final-for-owner.md` (owner picked A2=ก, A7=ก, price line B2, og:description home = A2) · a price line on all 53 product descriptions: "ของแท้ ราคา ฿{price} สั่งทาง LINE @okm24", price read live from the catalog, never typed · a 22-item short-copy backlog landed in the same commit (16 product slugs C1–C16, 2 guides, 1 technology page, 2 e-liquid category titles, the 404 title). Commits: `6873f03` data (batch 0) · `b07979d`/`5a584eb` seo-schema (batches 1+4) · `0b015bd` seo-copy (batches 3+5, after the owner's เคาะ) · this docs commit closes it. Checker passed all 3 independent calls, 0 send-backs (`_incoming/seo-a/checker-{1,2,3}-findings.txt`); scope-auditor ran once at round open. Full close-verify set is item 6 below. **Still open, not owner-blocking — for Cowork after merge+deploy**, listed in `docs/SEO_BASELINE.md`: Rich Results Test on / and one product page · GSC "validate fix" for the 7 product-snippet errors already fixed by the prices round · request indexing for the 45 currently un-indexed URLs · re-read Search Console in 14 days (2026-10-05) against `docs/SEO_BASELINE.md`'s 2026-09-21 numbers.
  Decisions the main agent took alone, reported to doc-keeper but not independently re-derived by this writer [เชื่อว่า]: SearchAction included on / (condition: /search reads ?q=, confirmed by the checker) · ORGANIZATION_ID uses `SITE_URL/#organization` (conventional form) · batches 1 and 4 were two separate `seo-schema` commits so batch 1 was safely on the branch before the owner's เคาะ wait · batch 5's short descriptions are a head-only override map read by generateMetadata (visible tagline/dek/summary untouched) · freeShippingThreshold (500 THB) deliberately NOT expressed in offers.shippingDetails — schema.org places that field on ShippingRateSettings, not OfferShippingDetails, and Google's merchant parser does not read it there · handlingTime 0–1 day comes from BSOT §10's 15:00 order cut-off, not invented · the trim rule (cut at a phrase boundary — dangling connective / bare number / clause opener are all avoided) was tightened twice mid-round after the checker flagged awkward cuts.
4 waiting on the owner: nothing new from this round — every SEO ก decision that needed the owner got one (Pod-181 for caliburn-g4-pro, muro-3ml kept at ฿99, A2=ก, A7=ก, price line B2, the 4 new words below all approved, C5/C6 follow the product name not the tagline, C3–C6 stay under 120 chars). Older, unchanged: 9.4 rollback drill · footer.tagline ตัด 3 คำซ้ำ (รอบ tagline) · zh โน้ตความเข้ากันได้ 2 ข้อ (รอบภาษาจีน) · TPD · #31 #34 iPhone · ผลเฝ้า Render OOM · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
  4b ไม่ต้องรอ — เจ้าของตัดสินแล้ว ห้ามถามซ้ำ: ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม บนหน้าร้าน + เว้นคำ "น้ำยา" ออกจาก head copy จนกว่าหมวดน้ำยาจะมีของขึ้นหน้าร้าน (ยืนยันซ้ำใน SEO ก A2) · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · tagline/ตะกร้า/หน้าบริการ = รอบของมัน · CLAUDE.md แก้เฉพาะข้อที่เจ้าของเคาะ (ตรวจ/รายงานได้) · ใส่กฎใหม่ = ลบกฎเก่าเรื่องเดียวกันทุกที่ (ยกเว้น ~/.claude/CLAUDE.md §1–§11 ที่ห้ามแก้ — ใช้ข้อยกเว้นใน 13.9 แทน · RULES_INDEX แถว 12) · ชั้น 9 ก๊อปไฟล์นอกรีโปก่อนแตะ (ทำแล้ว) · ชั้น 10 รวม/ลบกฎต้องกางเต็ม · 30.4c ลบแล้ว
5 open questions: **og:title of the homepage is still the pre-round string** ("OKami24 — ของแท้ ราคาตรง บริการจริง") — the approved table only covered `<title>`/description/og:description, og:title was never in scope this round; change it to match A1 ("OKami24 (OKM) — พอตของแท้ ราคาตรง บริการจริง") in the next copy round if the owner wants the two to match · does production really back up every 6 h to /var/data/backups today? [เชื่อว่า] per render.yaml — Cowork to check the Render log for "[backup]" · memory files under ~/.claude/projects/.../memory/ were never audited by rule-auditor — candidate for the next housekeeping round · LAUNCH_AUDIT is 200+ KB with most rows closed — a split (closed rows + "ประวัติรอบก่อน" → LAUNCH_AUDIT_DONE.md) is proposed, not done · when the stock API lands, overwrite the 20 basis:"owner-estimate" rows in src/data/shipnity-seed/legacy-price-approvals.ts with real supplier prices, in that one file only
6 verify baseline at last close — **SEO ก round close, 2026-09-21** (the only place these counts live; replaces the prices-round baseline that stood since the last close) [ตรวจแล้ว] per `_incoming/seo-a/close-*.log` read directly: tsc 0 errors · eslint 0 · `verify:catalog --full` 20/20 steps PASS (typecheck, lint, 14 contract tests, next build, publication leakage check) · verify:commerce 16/16 · i18n contract 16/16 · raw-chars (NBSP/U+2060) 0 · scan.js English-leak 0/105 · count-storefront 53 shown / 53 buyable (legacy shown 35, all priced; ProductMaster 18) — these six are unchanged from the prices-round baseline. New this round: jsonld-all.js over the 105-URL sitemap — 0 parse failures, types {Organization:1, WebSite:1, CollectionPage:20, BreadcrumbList:100, FAQPage:1, Product:53, VideoObject:7, Article:12}, Product offers.price 53/53, Organization.alternateName has "OKM", 101/105 pages carry ld+json (4 without = /warranty /shipping /how-to-order /privacy, owner's untouchable list), every one of the 53 offers has seller + shippingDetails + hasMerchantReturnPolicy (0 missing on all three) · desc-price-gate — B2 price line + ≤160 chars on 53/53 product descriptions, 28 of them trimmed to fit at a phrase boundary (the checker's mid-round count was 12, from before batch 5's extra overrides were added — both counts are real, taken at different points), sitemap description <50 chars = 0, title <20 chars = 0.
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

---

## 17. Standing rules and tools (not state — open when needed)

> Carried over verbatim from `docs/archive/HANDOFF.2026-09-21-v30.md` §17 — this is rules/tools, not round state, and neither round touched it this session.

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

1. **`git fetch` + `git status` + `git log -5 --oneline` + `git tag -n1`**, then compare with §16 above — if they differ, trust the repo. In particular, confirm `origin/main` is really `d9d318a`: this file's writer (doc-keeper) had no git tool and could not verify that value itself.
2. If `origin/main` matches §16 item 1, there is nothing to probe on the live site for either round (both already deployed per the main agent's report) — the only open work is the five owner decisions in §7/§16 item 4.
3. **No round is open.** Do not start the next one on your own — wait for the owner to attach an instruction file → skill `round-open`. When it opens (SEO, per §13), run `scope-auditor` once and read `docs/THAI_STYLE.md` only if the round touches site copy (13.9 → skill `round-open` step 1).
