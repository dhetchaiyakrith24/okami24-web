# OKami24 — HANDOFF (state = §16 · tools = §17 · permanent owner rulings = §18)

> Rewritten at the housekeeping round 01/10: §1–§15 (history up to 2026-09-22) and the relocated round blocks were
> removed — the full old file is `git show aa21cbb:docs/HANDOFF.md`. Section numbers 16–18 are kept so every pointer
> stays valid. §16: the same topic is overwritten, a new topic is added in its item (spec + when = skill `okami24-handoff`).
> Tags on every statement: [ตรวจแล้ว] / [เชื่อว่า] / [รอเจ้าของ] · "ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ".

## 16. Paste block for the next chat

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) · โฟลเดอร์ C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3
GitHub github.com/dhetchaiyakrith24/okami24-web (private) · read first = skill round-open step 1
Copy-paste line for the next chat: `อ่าน docs/HANDOFF.md §16 ก่อน` + `docs/rounds/รอบเก็บบ้าน-Friday-ถามพี่ก่อน-01-10.txt`

1 main: `git fetch && git log -1 --oneline origin/main` — at round open `aa21cbb` (PR #156 merge) [ตรวจแล้ว].
  Rollback point of this round = `aa21cbb`. Last image deploy: PR #152 (`05ff9c3`) live and checked 30/09 [ตรวจแล้ว].
2 ahead of main: `git log --oneline origin/main..housekeeping-01-10` — H3-1 (rules + docs rewrite) on the branch,
  NOT yet through the checker.
3 OPEN (thirteenth chat 01/10): HOUSEKEEPING round — file `docs/rounds/รอบเก็บบ้าน-Friday-ถามพี่ก่อน-01-10.txt`,
  branch `housekeeping-01-10`, working files `_incoming/housekeeping-01-10/` (audit report in Thai, rule-audit.md = the
  work list with file:line, inventory.js/.txt, unused-assets.js, repoint.js = the old→new 13.x map).
  Owner answers 01/10: renumber TEAM_RULES (send the old→new list) · HANDOFF/LAUNCH_AUDIT = Friday decides, clear what
  nobody uses · locks A+B+C (no node-wide kill · no force push / push to main · render.yaml/.env*/cart switch only when
  the open round file names them) · Javis keeps its own rules (no link to central) · go on now with few agents ·
  nothing extra off-limits · owner worries: full use of Friday's/Javis's thinking; files that grow until notes confuse
  and lead to guessing — "ไม่ต้องการให้เดา ต้องการให้คิด".
  Batches: H1 questions ✓ · H2 audit ✓ · H3-1 rules + docs rewrite (tier A · PR is BIG because 13.7 changed) ·
  H3-2 locks (hooks — BIG, full set) · H3-3 clutter (worktrees · 29 unused photos after a whole-site image crawl ·
  closed-PR check folders in _incoming) · H3-4 central-rules PR in smogz-rules (item 25 widened = approved; §1–11 cut
  and §8 "per project" = asked 01/10, not yet answered) · H4 /เก็บบ้าน skill, shown to the owner before saving.
  Fence (owner): the site a visitor sees stays the same — a batch that changes the sitemap or a page = stop, revert, report.
  Stopped at: H3-1 written on the branch, next = checker → merge → H3-2.
3b PAUSED (not closed): round "รอบรูป-ทั้งเว็บ แบบ M Bar 10K" (`docs/rounds/รอบรูป-ทั้งเว็บ-แบบMBar10K-30-09.txt`) —
  resumes after housekeeping: M Bar 15K duplicate record (= M Switch Kit split into device + pod; m-bar-15k is a
  baseline page until 05/10) · remake INFY 20K photos (card + 22 flavours, owner: "ดูกราฟิก ๆ แปลก ๆ") · BATCH 3 (06/10:
  argus-g4 + Argus Multi-Ohm) · BATCH 5 (rest of the site, planner first, rule (a) everywhere). Working files
  `_incoming/image-sitewide/`.
4 waiting on owner:
  (25) M Bar 10K: open on the single card like 9K / Kit / Pod (Friday recommends) or keep the approved lineup pilot
  (24) Thai wording: RELX Creator tagline/description/FAQ/who-for, INFY brand line/who-for/FAQ; words not in THAI_STYLE:
       "จอพิกเซล", "หน้าอีโมจิ"
  (14) category structure — its own round, the owner plans it first
  (1) image-theft protection A+B+C — its own round · (2) Muro Connector category · (3) SALTHUB per-flavour file request,
      no-photo panel wording A/B/C
  (27) central rules §1–11 pointer sections cut + §8 → "per project rules" (asked 01/10)
5 open / dated:
  - 05/10: re-read GSC against `docs/SEO_BASELINE.md` (Cowork supplies the numbers); after 05/10 the 7 baseline pages
    use the light set — delete `galleryNoteHeld` + the `heldNote` prop; M Bar 10K airflow row (moves 27 lastmod dates).
  - `dict.product.anatomyTitle` en/zh "from the outside in" (pre-existing, out of scope so far).
  - Carried ideas: out-of-stock suggestion (Esko 18/20) · card sweep on 4:5 · ARTICLE round (every product gets an SEO
    article in "more details") · category-structure round.
6 verify baseline at the last full close (clip round, logs `_incoming/clip-round/verify/`): tsc 0 · verify:commerce 17/17 ·
  verify:catalog --full 32/32 · count-storefront 53/53 · i18n 16/16 · thai-raw-chars 0 · scan.js 0/104 · og-gate 104/104.
  Light-set runs since: scan.js 0/107 · verify:catalog 29/29 (PR #152).
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
  stop → start · stop = `node scripts/test-server.js stop` (kills only the PID on 3412 · `status`) · never /IM node.exe ·
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
NOT done · `okami24.net` / `.com` NXDOMAIN — leave them · `voopooTitle` rename NOT done · no `OKAMI24_METRICS_TOKEN` — read the
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

**Images:** the first photo of a multi-option product = one sharp single device, Caliburn style; other colours/flavours
by swipe (IMAGE_SPEC §0 item 5 — products already on a fan: ask before changing) · every product gets an SEO article in
"more details" = its own later round.
