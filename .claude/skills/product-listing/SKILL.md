---
name: product-listing
description: List a new warehouse product on the OKami24 site — from a code in Shipnity Max to a live page or a prepared hidden product. Use it when the owner says "ลงสินค้า", "ลงสินค้าใหม่", "สินค้าใหม่เข้าคลัง", names a Max code to list (Pod-…, Disposable-…), and in the daily task okami24-new-products-daily, which starts at Step 1 to find the codes. It sequences the read-only scan, identity (skill catalog-research owns the research), the duplicate check, price, pictures (skill product-images), copy (skill thai-check), the stock map, the normal checked PR flow, and the report. It holds no rule of its own and never touches existing prices or stock.
---

# Product listing

The **procedure** for listing a new warehouse product — no rule of its own. Rules: `CLAUDE.md` "Catalog completeness rule" ·
`docs/BUSINESS_SOURCE_OF_TRUTH.md` §4 · §5 · `docs/IMAGE_SPEC.md` · `docs/THAI_STYLE.md` · `.claude/TEAM_RULES.md` 13.x.
What a skill may name = 13.2 "สกิลเขียนอะไรได้"; `[name]` = the list in `docs/HANDOFF.md` §17 "src files the skills use".

Why it exists: Shipnity never tells the site about a product the site does not have (owner 28/10).

**Way in:** the daily task = Step 0, then Step 1. A chat with a code in hand = Step 0, then Step 2.
Stops = 13.3 only. A stop in an unattended run: leave the draft and ask in the report.

## Step 0 — Set up

- Rules load as in any chat; they bind an unattended run the same way.
- `git fetch origin`. Work in a worktree of its own under `_incoming/` (daily task: `_incoming/wt-newprod`, created from
  origin/main if missing), never the main folder. Worktree traps = `docs/HANDOFF.md` §17 "Test trees + PR flow".

## Step 1 — Find new codes (read only · daily task)

1. Read the order-entry picker: the numbered read steps in the head of `scripts/order-entry-stock.js`, exactly, in a new tab of
   its own in the owner's Chrome. Check the byte count equals `compactLength`, close the picker with its own "ยกเลิก", close the tab.
2. **Read only:** never pick a customer, click an option button ("เพิ่ม …"), type in the form, or press บันทึก / ยืนยัน. Never open
   customer, contact or existing-order pages. Never type a password. A sign-in page = stop; the report's first line says the
   owner must sign in to Shipnity Max in Chrome, and the next run reads on.
3. Save the read to `_incoming/stock-api/sync/oe-<YYYY-MM-DD-HHMM>.txt` in the main folder.
4. The read is comma-separated `<parent>:<bits>[@options]`. A parent code (letters-dash-digits; ignore `Set-*`, "Close", "test")
   is NEW when neither `"<code>"` nor `"<code>-` appears in origin/main's [sku-map].
5. Skip codes already in `_incoming/stock-api/new-products.md` of the main folder (a line containing ` · <code> · `). Append the
   rest: `- <YYYY-MM-DD HH:MM> · <code> · <in>/<total> · <name if the read has it>`. Never edit or delete a line here.
6. No new code = report "ไม่มีสินค้าใหม่" and stop.

Daily task limit: at most 3 new products per run, oldest first. The rest wait for the next run.

## Step 2 — Identify

1. Read the Max product list for the code, read only: `https://app.shipnitymax.com/product/product?search=<code>`. Name + option names.
2. Skill `catalog-research`: its Step 1 duplicate check first, then identity, specs and media. It owns the evidence rules.
3. Not new after all: Shipnity re-codes products (Pod-180 became Disposable-46). Already on the site under another code = add
   the code to [sku-map] for that page, no [warehouse-new] entry, then Step 6.
4. Every colour and flavour the maker offers goes in, stock or not (`CLAUDE.md`).
5. A new brand or category = a change every page feels (footer · home · /about · sitemap · LESSONS พ7): plan it as a shared part
   (13.2 `scope-auditor` · 13.5 #5).

## Step 3 — Price

Authority and formula = BSOT §5, the only place. The owner has the final word. Use only what BSOT §5 and the price files it names allow.
Never touch the price of an existing product. Price unclear = prepare the product unpublished and ask in the report (13.3 #3 · #8).

## Step 4 — Pictures

Skill `product-images`. Its two waits apply here: the credit yes, and the comparison image before merge when a picture is new.

No card picture = prepared but hidden (`hiddenFromStorefront` · IMAGE_SPEC §4), and the report says so. An option with no
picture yet = IMAGE_SPEC §4, never cut the option. Credits unanswered in an unattended run = the same: hidden, `waiting`, reported.

## Step 5 — Data and copy

One commit per product (13.7).

1. Product record: authored after research, in [taxonomy] and [approvals] (skill `catalog-research` Step 5); Max seed =
   `scripts/max-seed-gen.js`. Read the last `feat(catalog): list …` commit for the files a listing touches.
2. Spec rows: only `sourceStatus: "verified"` shows ([spec-gate] · skill `catalog-research` "Getting a maker fact onto the site").
3. Thai copy: `docs/THAI_STYLE.md` + skill `thai-check`. Every new sentence in 3 languages (HANDOFF §17 "Site copy").
4. Every option's code into [sku-map]; the contract test must pass.
5. Same commit, one entry appended to [warehouse-new] (the staff page lists it, the server tells the "OKM Order" LINE group after
   the deploy): `{ code, name, seenOn: "YYYY-MM-DD", status: "listed", href: "/products/<slug>" }`, or `status: "waiting"` with a
   short Thai `note` saying why it waits. A product that goes up later = move its entry to "listed" with the `href`. No other edit.

**Never touch here:** prices of existing products · other products · stock files except [sku-map] and [warehouse-new] · the
`/wp-json` code. Never force push or push to main (13.7).

## Step 6 — Checks and merge

The normal flow, nothing skipped (13.4 · 13.5 · 13.7; order = HANDOFF §17 "Test trees + PR flow"):

1. Draft PR (`gh pr create --draft`), one PR per brand in the daily task (13.7 "PR ละ 1–3 สินค้า").
2. `npx tsx scripts/verify-catalog.ts --full` on the exact head in a test tree with real node_modules.
3. Test server up (LESSONS พ72), then `node scripts/pre-checker-gate.js` = `GATE PASS`.
4. `checker` (13.4). `Checker: PASS <sha>` in the PR body.
5. New picture in the PR = skill `product-images` Steps 8–9 here, before `gh pr ready`.
6. `gh pr ready` once. Green checks.
7. `node scripts/self-merge-check.js --pr <n>` alone; last line not `BLOCKED`.
8. `gh pr merge --merge --match-head-commit <sha>`, inside the hours 13.7 allows; ready too late = waits for after midnight.
9. Deploy success, then curl the new page for 200 (HANDOFF §17 "Live site").

Checker still failing after its rounds (13.4) = leave the draft, 13.3 #7. A permission check refuses an action = stop that action and
report it; never reach the same result another way (13.7).

## Step 7 — Mark and report

1. After the merge, mark the code's line in `new-products.md` with ` — listed #<PR> as /products/<slug>`, or
   ` — prepared unpublished (#<PR>): <why>`.
2. Visitor-visible page = skill `seo-after-publish`.
3. Report in Thai, central §12 item 10 + `docs/TEMPLATES.md` (ข): first line = the summary · per product the name customers see +
   its live link, or why it waits · questions as one set, each with a recommendation (13.3).
4. Daily task: push notification when anything was found (PushNotification tool, if available):
   "สินค้าใหม่ N รายการ: ลงเว็บแล้ว X · รอพี่ Y" plus the links. Its report is what the main chat reads.
5. Main chat: status page = 13.6.
