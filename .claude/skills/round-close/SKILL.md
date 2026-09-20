---
name: round-close
description: Close a work round for the OKami24 site after the last batch passed the checker. Use it for every round close, whatever the round's name. It sequences the word-break scan and diff on the touched pages, the single designer pass (tier B only), the full verify set, the one-commit fix of what the close found, the annotated tag + tag push, the handoff-block and round-cost updates, and the 4-line report with its length rule. It names the checks but never their expected numbers — the pass criterion is always what each script itself defines.
---

# Round close

This skill is the **procedure** for closing a round. The rules it sequences stay where they live
(`~/.claude/CLAUDE.md` section 13, `docs/HANDOFF.md` §17, `docs/RECOVERY.md`, `docs/ROUND_COST.md`,
`docs/TEMPLATES.md`). Never write an expected count into this file: pages, products, test
totals and screenshot counts all grow from round to round (article and data rounds add pages
and products), so **"pass" means what the script prints as pass, and nothing else**.

## When this applies

- The last batch of a round has passed the checker and the owner has not asked for more in
  this round.
- Precondition: the test server for the current build is up (how to build and start it: HANDOFF
  §17 "test server"; never the owner's own dev server on port 3000, never two Chrome jobs at once).

## Step 1 — Scan first, shoot only what the scan flags

1. `node scripts/wordbreak-scan.js` on **the pages this round touched** (the list from
   `scope-auditor` at round open), at the two widths the two-tier rule names, output under
   `_incoming/<round>/`.
2. `node scripts/wb-diff.js <before> <after>` against the scan of the previous close (the
   previous close's output folder is named in that round's HANDOFF entry) — the diff shows what
   disappeared and what appeared, page by page and width by width.
3. Screenshots: only the spots the diff flags as new. The scan-first / shot-count rule is
   `~/.claude/CLAUDE.md` 13.10 #15 (one place): more than the cap there in one round = tell the
   owner why first. (This replaced the older close routine "shoot every touched page", moved here
   from HANDOFF §17 "Two-tier rule" — the older wording is kept in that line's chain-10 record in
   `docs/RULES_INDEX.md`.)

## Step 2 — Designer once (tier B rounds only)

If any batch of the round was tier B, call the `designer` agent **one time** for the close,
with the flagged crops only — not the whole site. Tier A rounds (text only) skip this step
(the two-tier rule: HANDOFF §17). The designer reports in the five fields of 13.5.

## Step 3 — Full verify set (names only — pass = what each script defines)

Run every one of these; the pass criterion is the script's own PASS/OK output or exit code, and
the checker quotes the printed totals in its report — this file never states them:

- `npx tsc --noEmit`
- `npx eslint <files touched this round>`
- `npm run verify:commerce`
- `SITE_URL=<production origin> npm run verify:catalog -- --full` — it builds by itself, so the
  test server must be **stopped** first (how: HANDOFF §17 "ปิด server"); it includes eslint and
  `next build`
- `npx tsx scripts/count-storefront.ts` — a census with no pass/fail of its own: the printed
  counts must equal the ones recorded at the previous close (HANDOFF §16 "verify baseline at
  last close") unless this round intentionally changed the catalog — then the new counts are
  written there
- `npx tsx src/i18n/i18n-contract-test.ts`
- `node scripts/thai-raw-chars-check.js`
- `node scripts/scan.js` against the test server (every page in the sitemap; details of this gate
  and of the other Thai-copy gates: skill `thai-check`)

Save every log under `_incoming/<round>/` and cite the paths in the report.

## Step 4 — Fix what the close found, in one commit

Word-break fixes and anything the verify set or the designer flagged go into **one commit**, not
a separate round and not one commit per orphan word. Re-run only the gates that the fix touches;
send-back cap and re-check rule: 13.5.

## Step 5 — Checker, then tag, then push

1. `checker` passes the close (five fields, per 13.5).
2. Commit split by type (13.7) — docs+scripts / images / code / data, never one `add -A`.
3. **Annotated tag on the round-close commit, before the push:**
   `git tag -a <english-name> <commit> -F <thai-message-file>` — the tag name is English only,
   no spaces (pattern of the existing names: `git tag -n1`); the message inside is Thai the owner
   can read. Then `git push` and `git push origin --tags`. The tag rule lives in 13.7; the
   name-to-meaning table the owner reads is `docs/RECOVERY.md` "อยากกลับไป ก่อนรอบไหน" — add the
   new tag's row there (name · meaning · hash · date).
4. Merge and deploy are Cowork's job only (13.7) — never merge yourself.

## Step 6 — Documents that close the round

- `docs/HANDOFF.md` §16: the "open round" item becomes "none — <round> closed" with the tag name;
  main / branch-ahead / waiting-on-owner / open-questions refreshed (spec: `.claude/agents/doc-keeper.md`;
  the handoff conditions: 13.6).
- `docs/ROUND_COST.md`: **add one row** for the round — screenshots · builds · agent calls ·
  checker send-backs · chats · commits — counted from `_incoming/<round>/`, the logs and
  `git log`; a number that was not counted is written as `[ยังไม่มีข้อมูล]` with the reason
  (the file's own header says how each column is counted).
- Round-specific entries in `docs/THAI_STYLE_LOG.md` §7 if the round touched site copy (doc-keeper).

## Step 7 — The 4-line report (Thai, template (ข) in `docs/TEMPLATES.md`)

Four items, each within the cap the template states. Report length — the conclusion the owner
drew after collecting samples over a full round:

**Cut:**
- step-by-step narration of the way there ("next I will… meanwhile I will…");
- repeating the instruction just received before starting (already banned as "do not repeat
  what was agreed");
- reasons scattered through the body — move every reason into the single reason slot (item 3).

**Keep:**
- the full before → after table, every row — that *is* the work, not overhead.

Attach the chain-10 record (old text in full / new text in full / what was lost) whenever a rule
was merged or removed — the one exception to the length cap.
