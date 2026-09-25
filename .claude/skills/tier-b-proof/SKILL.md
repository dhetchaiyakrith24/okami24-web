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

- A tier-B batch (or a round close with any tier-B batch) needs its before → after shots.
- A round that must not change the site needs proof that it did not ("0 changes" is the pass).
- Not for line-break quality inside a Thai block — that is `scripts/wordbreak-scan.js` +
  `scripts/wb-diff.js` (round-close step 1); this skill finds WHAT text changed, those find WHERE
  Thai text wraps.

## Step 1 — Pick "before" and "after"

- **Before** = the round's base commit (the commit its `pre-…` tag names), or the batch's base for a
  batch proof — not "whatever is live": if earlier rounds are still unmerged, live is not the base and
  their work would show up as unexplained changes.
  - The live origin may stand in for the base only when they are the same code: `git diff --stat
    <live commit> <base> -- src public` is empty (`.claude/LESSONS.md` #5) — then no build.
  - Otherwise build the base commit in a worktree under `_incoming/<round>/`: `git worktree add
    --detach <dir> <commit>`, then copy `node_modules` into it (a junction/link breaks the Turbopack
    build: "points out of the filesystem root"), copy `scripts/test-server.js` into its `scripts/`
    if that commit predates it, and run that copy's `build` and `start` from the worktree.
- **After** = the working tree: `node scripts/test-server.js build`, then `start`.
- Only one server answers on the test port at a time — scan one side, `stop`, start the other.
  The server serves a copy of its build, so a build started meanwhile cannot corrupt a running scan.

## Step 2 — Scan both sides

`node scripts/visible-text.js scan --base <origin> --out _incoming/<round>/<name>-before` (then
`-after`). No page list = every URL of that side's sitemap; default languages and widths = the ones
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
`--shot-locales` says otherwise — the other languages are proven word for word by `changes.md`): fewest
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
