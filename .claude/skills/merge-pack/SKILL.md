---
name: merge-pack
description: Build the pre-merge pack for an OKami24 round — `_incoming/<round>/owner-table.md`, the same shape every round — so Cowork and the owner decide the merge from one file: every change a customer sees (before → after, three languages, evidence), every head/meta change, the work done beyond the brief with keep/undo and how to undo, claims the round was told to have confirmed, and the full verify set with log paths. Use it at the close of full-set work or when title/meta/H1 may move (`.claude/TEAM_RULES.md` 13.12), after the close point is pushed (a tag on the computer, the close commit in the cloud — round-close step 5) and before the 4-part report; also when Cowork asks "what does this merge change for customers".
---

# Merge pack

This skill is the **procedure** for the pre-merge pack. It decides nothing and restates no rule. Who decides
what, and when: `.claude/TEAM_RULES.md` 13.4 (#2, #6) and 13.10 #1. The report that goes with it = `docs/TEMPLATES.md`
(ข); what goes up to report item 4 and how many lines = the central file's §12 item 10 (work beyond the brief: the
single line of 13.10 #1 (ง)); how a question and its options are written = central §12 item 13; the verify set =
skill `round-close` step 3; where the pack's path is recorded = `round-close` step 6. Never write a count or a round
name into this file.

## When this applies

- A round close of full-set work (`.claude/TEAM_RULES.md` 13.12 #6), or one where title/meta/H1 may move (13.12 #1 (ฉ))
  — after `round-close` step 5 (close point pushed), before its step 7 (the report). Light-set work skips it.
- Cowork asks what a merge changes for customers.
- Who merges = 13.7; deploy = 13.7 too (a merge that touches the site goes live by itself after the GitHub checks —
  nobody deploys by hand). This pack is what whoever merges reads first, so it carries the full verify set with
  log paths, not only the checker's verdict. `_incoming/` is not in git: the pack's content also goes into
  `docs/cloud-results/<round>.md` (round-close step 3) so a cloud chat or Javis can read it.

## Step 1 — Gather the evidence the round already made

1. **What a visitor reads.** No scan when round-close step 1 item 0 says so (the one place of that rule) — paste its
   output instead. Otherwise a `scripts/visible-text.js diff` folder: before = the
   round's base commit, after = a build of the close commit (skill `tier-b-proof` steps 1–3; a tier-B round reuses
   the folder it already made at close, if that build was the close commit).
2. **Head / meta:** `scripts/head-audit.js` on the same two sides — title · description · H1 · og:title are not
   visible text, and a body edit can move them (`.claude/LESSONS.md` #8). Same skip rule as item 1.
3. **Work beyond the brief:** `_incoming/<round>/extras.md` (its format: 13.10 #1 (ง)).
4. **Claims the round instruction says to have confirmed** (e.g. a ruling relayed by Cowork that has no other
   evidence in the repo): a markdown table in `_incoming/<round>/confirm.md` — the claim · where it was written ·
   what is to be confirmed.
5. **Verify set:** every log of `round-close` step 3, in one folder under `_incoming/<round>/`.

## Step 2 — Build the table

`node scripts/merge-pack.js --out _incoming/<round>/owner-table.md --round "<round>" --visible <diff dir>
--head <head before dir> <head after dir> --extras _incoming/<round>/extras.md --confirm _incoming/<round>/confirm.md
--verify <log dir>` — add `--no-site-change` when round-close step 1 item 0 passed (no scan was made); leave out an input the round does not have; an input left out is printed as
`[ยังไม่มีข้อมูล]` / "ไม่มี", never silently dropped.

## Step 3 — Read it before anyone else does

- Every ★ row must trace to the round's goal or to `extras.md`; the rule for a change nobody asked for is
  `tier-b-proof` step 3.
- Under the table, per ★ row that needs it, add what the script cannot know: the maker source (`sources-verified.md`
  line), the thai-copy wording options (live choice marked), why a value was cut.
- Lift what the owner must rule into report item 4 the way central §12 item 10 says; the table itself stays in the
  file and the report gives its path.
