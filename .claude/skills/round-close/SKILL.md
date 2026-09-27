---
name: round-close
description: Close a work round for the OKami24 site after the last batch passed the checker. Use it for every round close, whatever the round's name. It sequences the word-break scan and diff on the touched pages, the designer pass when 13.12 item 4 calls for it, the verify set 13.12 names (light or full), the one-commit fix of what the close found, the annotated tag + tag push (a cloud round: the close commit instead), the handoff-block update (and the round-cost row on long rounds, 13.12 item 7), and the 4-part report with its length rule. It names the checks but never their expected numbers — the pass criterion is always what each script itself defines.
---

# Round close

This skill is the **procedure** for closing a round. The rules it sequences stay where they live
(`.claude/TEAM_RULES.md` section 13, `docs/HANDOFF.md` §17, `docs/RECOVERY.md`, `docs/ROUND_COST.md`,
`docs/TEMPLATES.md`). Never write an expected count into this file: pages, products, test
totals and screenshot counts all grow from round to round (article and data rounds add pages
and products), so **"pass" means what the script prints as pass, and nothing else**.

## When this applies

- The last batch of a round has passed the checker and the owner has not asked for more in
  this round.
- Precondition: the test server for the current build is up (how to build and start it: HANDOFF
  §17 "test server"; never the owner's own dev server on port 3000, never two Chrome jobs at once).

## Step 1 — Scan first, shoot only what the scan flags

0. **Proof sized to what changed (how much to check overall = `.claude/TEAM_RULES.md` 13.12, the one place; this item is its "nothing on the site changed" case — origin: `docs/RULES_INDEX.md`):**
   when `node scripts/self-merge-check.js --base <base>` ends in `PASS` — the same allow-list that decides "nothing a
   customer sees" in 13.7 (so `src/`, `public/`, product data, root config such as `next.config.ts`, and anything the
   build or the server runs all count as touched) — that output, pasted in the report with its command, IS the proof:
   skip the word-break scan, the shots and `tier-b-proof`. Step 3 still runs in full, including the gates that need the
   test server. `BLOCKED` = run the steps below as written.
1. `node scripts/wordbreak-scan.js` on **the pages this round touched** (the list from
   `scope-auditor` at round open), at the two widths the two-tier rule names, output under
   `_incoming/<round>/`.
2. `node scripts/wb-diff.js <before> <after>` against the scan of the previous close (the
   previous close's output folder is named in that round's HANDOFF entry; usable only when it was made on the same
   kind of machine — skill `tier-b-proof` step 1, the one place of that rule) — the diff shows what
   disappeared and what appeared, page by page and width by width.
3. Screenshots: only the spots the diff flags as new. The scan-first / shot-count rule is
   `.claude/TEAM_RULES.md` 13.10 #15 (one place): more than the cap there in one round = tell the
   owner why first. (This replaced the older close routine "shoot every touched page", moved here
   from HANDOFF §17 "Two-tier rule" — the older wording is kept in that line's chain-10 record in
   `docs/RULES_INDEX.md`.)
4. Tier-B rounds: WHAT a visitor reads that changed (the pages 13.12 #1 (ค) / #3 name, three languages, both widths) and the shots of
   those spots only = skill `tier-b-proof`; the word-break scan above stays for WHERE Thai text wraps.

## Step 2 — Designer once (tier B rounds only)

If any batch of the round added a new look, slot or component (`.claude/TEAM_RULES.md` 13.12 #4 — the one place of
"when designer"), call the `designer` agent **one time** for the close, with the flagged crops only — not the whole
site. Otherwise (text only, data swaps, reuse of a look the designer already passed) skip this step. The designer
reports in the five fields of 13.5.

## Step 3 — Full verify set (names only — pass = what each script defines)

Which set: full-set work (`.claude/TEAM_RULES.md` 13.12 #6) runs the list below in full; light-set work runs 13.12 #1
instead (the GitHub checks run `verify:catalog --full` on every PR), plus the Thai-copy gates on the touched pages.

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
- the i18n contract test — command = HANDOFF §17 "src files the skills use" [i18n-test]
- `node scripts/thai-raw-chars-check.js`
- `node scripts/scan.js` against the test server (every page in the sitemap; details of this gate
  and of the other Thai-copy gates: skill `thai-check`)
- `node scripts/og-gate.js --base <test server>` — the share card of every page in the sitemap
  (added 2026-09-22, round "share-deadend": 52 pages had shipped one shared card for months and
  no gate could see it, because the page itself looked right)
- `npx tsx scripts/content-dates.ts` **after the last content commit**, then
  `npx tsx scripts/content-dates.ts --check` — `verify:catalog` fails while the generated dates
  are older than git (added 2026-09-22, round "search-price")

Save every log under `_incoming/<round>/` and cite the paths in the report. `_incoming/` is not in git: a cloud
container loses it, and a cloud chat or Javis can never open the computer's copy. So **every round, computer or cloud**
(owner ruling Q5, round B 2026-09-27), writes its evidence summary to `docs/cloud-results/<round>.md` (one file per
round, committed with the docs batch) — every command, its printed totals, any error text quoted exactly, and a
summary of every `_incoming/` file the report or the merge pack cites (`extras.md` · `owner-table.md` · break logs);
a cited file that is short text may be copied whole under `docs/cloud-results/incoming/<round>/` instead (secret scan
first). Screenshots go to a private Artifact page instead (`docs/CLOUD.md`), never into git.

## When the round added a gate — break it red before trusting it (ทำลายด่านใหม่ให้แดงก่อนเชื่อ)

Applies when the round added or changed anything with a pass/fail that runs by itself: a script gate, a git hook, a
contract test. A gate nobody has seen fail is not yet proof. **When:** in the batch that adds the gate, before that
batch's checker; at the round close only check that each such gate has its log.

1. **The main agent does it** — the checker cannot edit files (13.5); the checker re-reads the logs and creates no
   probe of its own.
2. **Only on uncommitted changes:** make the smallest edit that produces exactly the fault the gate exists to catch
   (one per failure mode the gate claims) → run the gate → it must fail, and its message must name that fault (red).
3. **Undo the fault** (restore the file / delete the probe / unstage it) → run the gate again → it must pass (green).
   `git status` shows no probe left and `git log -1` is unchanged.
4. **Log both runs** — command, output, exit code — in `_incoming/<round>/break-<gate>.log`; the report and the
   checker brief cite the path.
5. A gate that cannot be made to fail is reported as "not a gate yet", never counted as proof.

## Step 4 — Fix what the close found, in one commit

Word-break fixes and anything the verify set or the designer flagged go into **one commit**, not
a separate round and not one commit per orphan word. Re-run only the gates that the fix touches;
send-back cap and re-check rule: 13.5.

## Step 5 — Checker, then tag, then push

1. `checker` passes the close (five fields, per 13.5). **Start `doc-keeper` (step 6) in the same message as the
   checker** — it writes the pending token where the checker's verdict goes (`.claude/agents/doc-keeper.md`); when
   the checker returns, put its real result in each token's place yourself (a send-back = fix, re-check, then fill).
   The checker's brief says so and scopes the close check to everything EXCEPT the files doc-keeper is writing at
   the same time (`docs/HANDOFF.md` · `docs/THAI_STYLE_LOG.md` · `docs/ROUND_COST.md` · `docs/LAUNCH_AUDIT.md`) — 13.5
   "a result covers only the state it checked" holds, because those files are not in that state. After the tokens are
   filled, the checker re-checks those files only (13.5: a re-check covers only what changed) before the push.
   `scripts/pending-check.js` (pre-push hook + merge-pack) refuses the push and the pack while a token is left.
2. Commit split by type (13.7) — docs+scripts / images / code / data, never one `add -A`.
3. **Annotated tag on the round-close commit, before the push:**
   `git tag -a <english-name> <commit> -F <thai-message-file>` — the tag name is English only,
   no spaces (pattern of the existing names: `git tag -n1`); the message inside is Thai the owner
   can read. Then `git push` and `git push origin --tags`. The tag rule lives in 13.7; the
   name-to-meaning table the owner reads is `docs/RECOVERY.md` "อยากกลับไป ก่อนรอบไหน" — add the
   new tag's row there (name · meaning · hash · date).
   **In the cloud: no tag** (a tag push is refused, `HTTP 403`; 13.7) — the close point is the round-close commit.
   Name the base commit (rollback point) and the close commit in the report and in `docs/cloud-results/<round>.md`,
   and write the RECOVERY row with the round's name in the tag column and the close commit's hash.
4. Friday merges (13.7 — small = merge then report, big = tell the owner first): `node scripts/self-merge-check.js`
   on the PR's head commit decides small/big; its conditions live in 13.7 only.
   Deploy is never yours (a merge to main that touches the site deploys itself after the GitHub checks — 13.7).

## Step 6 — Documents that close the round

- `docs/HANDOFF.md` §16: the "open round" item becomes "none — <round> closed" with the tag name (a cloud round: the close commit);
  main / branch-ahead / waiting-on-owner / open-questions refreshed (spec: `.claude/agents/doc-keeper.md`;
  the handoff conditions: 13.6).
- `docs/ROUND_COST.md`: **rounds that ran over several days or chats only** (`.claude/TEAM_RULES.md` 13.12 #7) — add one row for the
  round (doc-keeper); its shape and how each column is counted = the file's own header, the one place.
- Round-specific entries in `docs/THAI_STYLE_LOG.md` §7 if the round touched site copy (doc-keeper).
- The round instruction file (owner rulings Q1 + Q2, round B 2026-09-27 — git is the master of round files): the file
  that ran is in `docs/rounds/` (round-open step 1 put it there; re-copy if the owner or Javis edited it during the
  round) → then delete its copy under `rounds/` on the branch `inbox`, if there is one (a commit on `inbox` that only
  removes that file; the branch itself stays).
- The pre-merge pack `_incoming/<round>/owner-table.md` = skill `merge-pack`, only for full-set work or when title/meta/H1 may move (13.12 #1 (ฉ) · #6) (after the push — and the tag push on a computer round — before the report);
  its path goes into §16 "waiting on the owner" and into the report.

## Step 7 — The 4-part report (Thai, template (ข) in `docs/TEMPLATES.md`)

Four items, each within the cap the template states. Report length — the conclusion the owner
drew after collecting samples over a full round:

**Cut:**
- step-by-step narration of the way there ("next I will… meanwhile I will…");
- repeating the instruction just received before starting (already banned as "do not repeat
  what was agreed");
- reasons scattered through the body — move every reason into the single reason slot (item 3).

**Keep:**
- the before → after table — it lives in `_incoming/<round>/`; the report gives the path only
  (central §12 item 10, owner 2026-09-25 — replaces the 2026-09-23 "at most 10 rows in the report").

Answer, in item 3, the question `docs/TEMPLATES.md` (ค)-8 makes the owner ask at every close:
which parts of this round's instruction prescribed a method that was not needed, or stood in the
way of a better one. Name the line and what it cost; "nothing" is a valid answer and takes one
line.

Write the chain-10 record (old text in full / new text in full / what was lost) whenever a rule
was merged or removed — in a file under `_incoming/<round>/`, the report gives its path (13.6).
