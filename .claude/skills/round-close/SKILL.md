---
name: round-close
description: Close a work round for the OKami24 site after the last batch passed the checker. Use it for every round close, whatever the round's name. It sequences the proof sized to what changed (nothing a visitor gets changed = one self-merge-check line), the word-break scan when on-page Thai changed, the designer pass when 13.5 #6 calls for it, the verify set 13.5 names (light or full), the one-commit fix of what the close found, the annotated tag + tag push (a cloud round: the close commit instead), HANDOFF §16, and the 4-part report. It names the checks but never their expected numbers — pass is what each script itself prints.
---

# Round close

The **procedure** for closing a round; the rules stay in `.claude/TEAM_RULES.md` (13.4 checker · 13.5 how much ·
13.7 git/merge), `docs/HANDOFF.md` §17 (tools) and `docs/TEMPLATES.md` (report). Never write an expected count here —
**"pass" means what the script prints as pass, and nothing else**.

Precondition for any server gate: the test server for the current build is up (HANDOFF §17 "test server"; never the
owner's dev server on port 3000, never two Chrome jobs at once).

## Step 1 — Proof sized to what changed (13.5)

0. `node scripts/self-merge-check.js --base <base>` ends in `PASS` (nothing a visitor gets changed — the allow-list of
   13.7) → that output with its command IS the proof: skip steps 1–2 and the server gates of step 3; run 13.5 #2 (ก)
   for the files touched. `BLOCKED` = continue below.
1. **Thai text on a page changed** → `node scripts/wordbreak-scan.js` on the pages the round touched (scope-auditor's
   list), both widths, output under `_incoming/<round>/`, then `node scripts/wb-diff.js <before> <after>` against a scan
   of the round's base build (or the previous close's scan when it was made on the same kind of machine — skill
   `tier-b-proof` step 1). No Thai on-page change = skip.
2. Tier B: what a visitor reads that changed + shots of those spots only = skill `tier-b-proof` · shot count = 13.5 #7.
   Reuse the batches' evidence when nothing changed after it — do not re-shoot.

## Step 2 — Designer once, only per 13.5 #6

A new look, slot or component in the round → `designer` **one time** with the flagged crops only. Otherwise skip.

## Step 3 — Verify set (names only)

Full-set work (13.5 #3) runs the whole list; light-set work runs 13.5 #2 (GitHub runs `verify:catalog --full` on
every PR that touches the site) plus the Thai-copy gates on the touched pages.

- `npx tsc --noEmit` · `npx eslint <files touched this round>` · `npm run verify:commerce`
- `SITE_URL=<production origin> npm run verify:catalog -- --full` — builds by itself: stop the test server first
  (HANDOFF §17 "ปิด server")
- `npx tsx scripts/count-storefront.ts` — printed counts = HANDOFF §16 item 6 unless the round changed the catalog
  (then write the new counts there)
- the i18n contract test (HANDOFF §17 "src files the skills use" [i18n-test]) · `node scripts/thai-raw-chars-check.js`
- `node scripts/scan.js` against the test server (skill `thai-check`) · `node scripts/og-gate.js --base <test server>`
- `npx tsx scripts/content-dates.ts --check` — fails = the post-commit hook did not run (`docs/RECOVERY.md` 2ค) →
  run `npx tsx scripts/content-dates.ts` and commit

Long logs → `_incoming/<round>/`, cite the paths. **A cloud round** writes its evidence summary (commands, printed
totals, error text quoted exactly) to `docs/cloud-results/<round>.md`; a computer round only when a cloud chat will
need it. Secret-scan any text file before it goes into git; screenshots go to a private Artifact page, never git.

## A gate the round added — see it red once before trusting it

Any new pass/fail that runs by itself (script gate · git hook · Claude Code hook · contract test), in the batch that
adds it, before its checker: on uncommitted changes make the smallest edit that produces exactly the fault it exists
to catch → it must fail naming that fault → undo → it must pass · `git status` clean, `git log -1` unchanged · one line
each in the report. A gate that cannot be made to fail is "not a gate yet".

## Step 4 — Fix what the close found, in one commit

Word-break fixes and anything the gates or the designer flagged → one commit. Re-run only the gates the fix touches.

## Step 5 — Checker, tag, push, merge

1. `checker` passes the close — **skip** when nothing changed after the last batch's checker PASS (13.5 #2 (จ)); say so.
2. Commits split so each topic reverts on its own (13.7).
3. **Annotated tag on the round-close commit, before the push:** `git tag -a <english-name> <commit> -F <thai-message-file>`
   (English name, no spaces — pattern: `git tag -n1`; Thai message the owner can read) → `git push` + `git push origin --tags`.
   **Cloud: no tag** (push refused `HTTP 403`) — name the base commit and the close commit in the report and in
   `docs/cloud-results/<round>.md`.
4. Merge per 13.7 (`node scripts/self-merge-check.js` alone, at the pinned head, then merge). The site deploys itself after the merge; a manual deploy or a rollback = 13.7.

## Step 6 — Documents that close the round

- `docs/HANDOFF.md` §16: "open round" → "none — <round> closed" + tag (cloud: close commit) · rest refreshed — spec =
  skill `okami24-handoff` · permanent owner rulings of the round → §18.
- Temporary rulings (written with an end date, `.claude/TEAM_RULES.md` 13.6): search §16, `.claude/LESSONS.md` and
  `.claude/memory/` for ones that ended or end with the round → delete them; one with no end date = ask the owner.
- Owner rulings on Thai words/sentences → `docs/THAI_STYLE_LOG.md` §7 (and the word table in THAI_STYLE §3 when the
  owner locked a word) — the main agent writes them.
- The round file that ran is in `docs/rounds/` (re-copy if edited during the round) → delete its copy under `rounds/`
  on branch `inbox`, if any (a commit on `inbox` that only removes that file).

## Step 7 — The 4-part report (Thai, `docs/TEMPLATES.md` (ข))

Cut: narration of the way there · repeating the instruction · reasons scattered through the body (all reasons go in
item 3). Keep: tables go in `_incoming/<round>/`, the report gives the path. Item 3 also answers `docs/TEMPLATES.md`
(ค)-8: which part of the instruction prescribed a method that was not needed or blocked a better one ("nothing" = one line).
