---
name: tier-b-proof
description: Prove what changed on screen between two builds of the OKami24 site — every sitemap page, all three languages, both widths of the two-tier rule — then shoot only the spots that changed and hand the designer a ready brief. Use it for every tier-B batch or round close that needs before/after proof, and to prove "nothing a visitor sees changed" on a round that must leave the site alone. It reads the text a visitor actually sees after hydration (not the raw HTML, which carries every language), so English and Chinese pages are covered.
---

# Tier-B proof

This skill is the **procedure** for before/after proof. The rules it follows stay where they live:
what tier B is and its step order = `docs/HANDOFF.md` §17 "Two-tier rule"; the screenshot cap and the
scan-first rule = `.claude/TEAM_RULES.md` 13.10 #15; one Chrome job at a time, the test server and
how to stop it = HANDOFF §17 ("test server" · "ปิด server"); what the designer judges =
`.claude/agents/designer.md`. Never write a page count, a change count or a screenshot count into this
file — they come from the run.

## When this applies

- A tier-B batch (or a round close with any tier-B batch) needs its before → after shots. **How big:** the whole
  sitemap only when `.claude/TEAM_RULES.md` 13.12 #3 says so (a part every page shares, or a "nothing changed" proof);
  otherwise pass the touched pages + a few control pages as `/path` arguments (13.12 #1 (ค)) — the steps below are the
  same, only the page list is shorter.
- A round that must not change the site needs proof that it did not ("0 changes" is the pass).
- Not for line-break quality inside a Thai block — that is `scripts/wordbreak-scan.js` +
  `scripts/wb-diff.js` (round-close step 1); this skill finds WHAT text changed, those find WHERE
  Thai text wraps.

## Step 1 — Pick "before" and "after"

- **One kind of machine for both sides** (round "mobile" instruction, batch 2, 2026-09-26 — the one place of this
  rule; round-close step 1 points here): Windows Chrome and the cloud's Linux Chromium draw fonts and break lines
  differently, so "before" and "after" — scans and shots — come from the same kind of machine. A scan, shot or
  round-close result from the other kind of machine never stands in for "before" (re-scan the before side on this
  machine; a chat moved between computer and cloud mid-batch re-scans too — `_incoming/` does not travel). Which
  machine: `visible-text.js` writes `machine` into `_meta.json` (`scripts/lib/chrome.js`) and its `diff` prints
  `environment: NOT proven the same` for a mixed pair = the pair is invalid; `wordbreak-scan.js`, `linemap-scan.js` and
  `shot.js` do not record it — write the machine next to their output in the report. In the cloud, run
  `node scripts/font-check.js --base <origin>` once on the side you scan first: not PASS = the machine's fonts are not
  the expected ones and the scan is not proof.

- **First ask whether a scan is needed at all** = round-close step 1 item 0 (the one place of that rule).
- **Reuse an earlier scan as the "before" scan — no scan of the before side** — when all three hold: (1) the `commit` in that
  folder's `_meta.json` IS the base commit (no `commit` recorded = no reuse; step 2 says when to record it); (2) the new "after" scan's `diff` prints a line starting
  `environment: same machine` — anything else voids the reuse: scan the before side as below (a
  Chrome or font update makes a whole site of fake changes; it does not hide a real one, it drowns it); (3) that
  folder's `scan.log` has no `FAIL` line. Say in the report which folder was reused. Reuse skips the before SCAN only:
  "before" shots (step 4) come from the live site when live = base (below), otherwise build the base only when
  `shots-before.txt` is not empty.
- **Before** = the round's base commit (the commit its `pre-…` tag names on the computer; in the cloud, the main commit
  the round record `docs/cloud-results/<round>.md` names as base), or the batch's base for a
  batch proof — not "whatever is live": if earlier rounds are still unmerged, live is not the base and
  their work would show up as unexplained changes.
  - The live origin may stand in for the base only when they are the same code: `git diff --stat
    <live commit> <base> -- src public` is empty (`.claude/LESSONS.md` #5) — then no build. (Cloud: not yet — its
    Chromium cannot open the live site, `docs/CLOUD.md` §1; build the base instead.)
  - Otherwise build the base commit in a worktree under `_incoming/<round>/`: `git worktree add
    --detach <dir> <commit>`, then copy `node_modules` into it (a junction/link breaks the Turbopack
    build: "points out of the filesystem root"), copy `scripts/test-server.js` into its `scripts/`
    if that commit predates it, and run that copy's `build` and `start` from the worktree.
- **After** = the working tree: `node scripts/test-server.js build`, then `start`.
- Only one server answers on the test port at a time — scan one side, `stop`, start the other.
  The server serves a copy of its build, so a build started meanwhile cannot corrupt a running scan.

## Step 2 — Scan both sides

`node scripts/visible-text.js scan --base <origin> --out _incoming/<round>/<name>-before --commit <sha>
2> _incoming/<round>/<name>-before/scan.log` — `--commit` only when that side was built from a clean tree at that
commit (a worktree of a commit, or `git status --porcelain` empty); a build with uncommitted changes gets no `--commit` (make the folder first; then `-after`; a later round may reuse the folder only with both — step 1).
No page list = every URL of that side's sitemap; default languages and widths = the ones
the two-tier rule names (check the script header — change them only if the rule changed). One Chrome
job at a time: never run two scans, a scan and a shot, or a scan and `linemap`/`wordbreak` together.
A `FAIL` line = that page was not measured; re-run it, never diff over a gap.

## Step 3 — Diff, then explain every change

`node scripts/visible-text.js diff <before> <after> _incoming/<round>/<name>-diff --before-base
<before origin> --after-base <after origin>`. Read `changes.md`:

- **Distinct changes** = what gets shot (the same before → after on several pages is one group).
- Every group must be explained by the batch's own goal. A change nobody asked for = a regression:
  stop, fix, re-scan the affected side. Never shoot or brief around it.
- "Files on one side only" = a page that exists on one side (added/removed route, or a scan gap).
- Live vs local builds differ in a few known, non-visitor ways (e-mail obfuscation by the CDN —
  already normalised by the script). Anything else that differs between two builds of the same code
  is noise to report, not to hide.
- For a "the site must not change" proof, the pass is `0 change(s)` and `one-side files 0`.

## Step 4 — Shoot only the changed spots

Run `shots-before.txt` while the before server answers, `shots-after.txt` while the after server
answers. The plan (`shots.md`) covers every distinct change once in the shot language (Thai unless
`--shot-locales` says otherwise — the other languages are proven word for word by `changes.md`, except a
page+width whose changes exist only in another language, which is shot in that language): fewest
pages that show all changes, one image per page section, anchored on the first change in it, a "before"
image only where something was removed or changed. `shots.md` ties each image to its change groups.
Shot count: `.claude/TEAM_RULES.md` 13.10 #15 (the one place). Open every image
once yourself: an anchor that missed (`anchor missing` in the shot log, or the block not in frame)
= re-shoot with a parent block's selector, never send a frame without the change in it.

## Step 5 — The designer brief

Write `_incoming/<round>/brief-designer-<batch>.md` with:
1. what the batch meant to change (one line per intended change, from the round instruction);
2. the path of `changes.md` (every change, three languages) and of `shots.md`;
3. the images, by the `shots.md` id (`s###-<locale>-<width>-before/after.png`) with the change groups each shows;
4. what is NOT covered (groups not shot and why; pages that failed to scan);
5. the report shape: the five fields of 13.5.

When the designer is called: per tier-B batch in the order of HANDOFF §17 "Two-tier rule", and once at
the round close (round-close step 2) — with these crops only, never the whole site.

## Evidence to keep

`_incoming/<round>/`: both scan folders, the diff folder (`changes.md`, `changes.json`, the shot
lists, the images), the build/server logs. The report cites the diff path and the counts the script
printed — never counts written by hand.
