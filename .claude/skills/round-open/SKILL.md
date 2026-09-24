---
name: round-open
description: Open a work round for the OKami24 site — any round, whatever its name (SEO, articles, data, cart, housekeeping, or one that does not exist yet). Use it every time the owner opens a round by attaching a round instruction file, before touching any file. It sequences what to read, how to confirm the repo state against the instruction file, the single scope-auditor call, the tier A/B decision, splitting the round into batches, and writing the "round open" state into the handoff block. Also use it when a new chat continues an already-open round (skip the scope-auditor call in that case).
---

# Round open

This skill is the **procedure** for starting a round. It holds no rule of its own — every
rule stays where it lives (`.claude/TEAM_RULES.md` section 13, `docs/HANDOFF.md`, `docs/THAI_STYLE.md`)
and this file only says in what order to pick them up. Never copy a number, a file name, a page
count, a commit hash or a section number from one of those files into this one: things that
change are read from their source at the moment they are needed.

The owner sends **a goal plus a pass criterion** in a round instruction file written from
`docs/TEMPLATES.md` template (ก). This skill turns that file into a running round.

## When this applies

- The owner says "open round X" and attaches (or names) the round's instruction file.
- A new chat starts on a round that is already open (continuation after a handoff) — run
  Step 1 and Step 2, then skip to Step 7 and continue from the batch the handoff block names.

## Step 1 — Read before anything else (the single "read first" list)

This is the one and only "read before starting" list of the team — `.claude/TEAM_RULES.md` 13.2
item 1 and 13.9 point here, and so does the head of `docs/HANDOFF.md`. Do not restate it anywhere
else.

Always:
- `docs/HANDOFF.md` **§16** — the copy-paste block (main · what the branch is ahead by · which
  round is open and where it stopped · what waits on the owner · open questions · verify baseline
  at the last close).
- The head of `docs/LAUNCH_AUDIT.md`, the block titled **"สถานะปัจจุบัน"** — and nothing else of
  that file. **Never read LAUNCH_AUDIT in full**; open only the numbered item the round is working
  on.
- The round instruction file the owner attached.

Only on rounds that touch copy shown on the site (SEO · articles · language rounds = read;
housekeeping · data · code-only rounds = do not read):
- `docs/THAI_STYLE.md` (rules only).
- `docs/THAI_STYLE_LOG.md` — open it only when an old sentence or ruling must be cited, never
  as a whole.

When a tool or a verify command is needed: `docs/HANDOFF.md` **§17** (rules and tools), not before.

Then `git status` — know where the tree is before moving.

## Step 2 — Confirm the repo matches the instruction file

1. `git fetch origin`.
2. Compare `origin/main` with the commit the instruction file names as main. **Not equal =
   stop and report before doing anything** — do not start the round on a different base.
3. Confirm the working branch contains `origin/main` (fast-forward if it is merely behind);
   confirm the tree is clean.
4. Report the numbers seen (hash of main, branch, tags) — never the numbers the file expected.

If the instruction file also names a tag, check the tag with `git tag -n1`; a tag that points
a few commits before the merge commit is normal (the tag marks the round-close commit, the
merge commit is Cowork's) — say so instead of treating it as a mismatch.

## Step 3 — Answer the instruction before touching anything

Read the instruction file once more and reply with the objections only, in three groups. This
step exists to stop work going the wrong way for an hour, not to review the owner's writing —
the rules it judges the instruction against are `docs/TEMPLATES.md` (ค).

- **ข้อห้ามจริง** — the bans and facts of this round, restated in one line each ONLY where
  obeying them changes what gets built (a ban you would have honoured anyway is not worth a line).
- **บอกวิธีทั้งที่ไม่จำเป็น** — where the instruction prescribes a method: say which way you will
  take instead and why. This is the standing right of `.claude/TEAM_RULES.md` 13.10 #2 (argue back
  with a reason, before starting) used here rather than halfway through. **Do not wait for an
  answer** — 13.2 item 3 still applies: say it and start.
- **กำกวม** — wording that reads two ways and would send the work in different directions. Only
  these wait for a reply, and they count against the question limit of 13.1 (at most 3, asked once).

**Cap: 5 items in total**, and only items that pass this test: *if I do not say this, the work
comes out different.* Nothing to object to = one line, `คำสั่งชัด เริ่มได้เลย`, and continue.
**Never restate the instruction back** (`~/.claude/CLAUDE.md` §10, and `round-close` step 7 bans
the same thing in the report) — objections only, no summary, no padding.

---

## Step 4 — Scope: call `scope-auditor` once, and only once

Before the first batch, call the `scope-auditor` agent **one time**. It walks the live sitemap
and reports which pages this round really touches — **count from the sitemap, never trust a page
count written in the instruction file or remembered from an earlier round** (the reason this
rule exists: a remembered "product page" count once left a whole category of pages outside the
gates for a week). The list it returns becomes the checker's page list for every batch of the
round.

Do not call it again during the round; if the scope changes mid-round, that is a stop-and-ask
case (`.claude/TEAM_RULES.md` 13.4).

## Step 5 — Decide tier A or tier B for each batch

Apply the two-tier rule as written in `docs/HANDOFF.md` §17 ("Two-tier rule") — text only =
tier A (no screenshots, no designer per batch); anything that touches structure or the screen =
tier B (full proof: build → shoot before → shoot after → designer → owner picks → checker).
**Not sure = tier B.** Write the tier next to each batch in the plan.

## Step 6 — Split the round into batches

Break the goal into checkable steps with a "how we know it is done" line each; the size cap and
the planner rule live in `.claude/TEAM_RULES.md` 13.2 item 2 (one place) — a round that is big by
the criteria of section 3 (`~/.claude/CLAUDE.md` §3, read with the web block at the end of TEAM_RULES) goes to the `planner` agent, a small one is split by the main
agent. Then tell the owner in 3–5 lines what will be done in what order and **start** — no
approval wait, unless a 13.4 case is already visible.

Every helper file created on the way (scripts, comparison images, logs, agent briefs) goes under
`_incoming/<round>/` or `scripts/` — save each agent brief there so `docs/ROUND_COST.md` can
count the calls at round close.

## Step 7 — Write the round into the handoff block

Update `docs/HANDOFF.md` §16 item "open round" to say which round is open, its instruction
file, the batch list with tiers, and where it stopped (the spec of §16 is in
`.claude/agents/doc-keeper.md`; `doc-keeper` writes it at every batch close, the main agent
writes the opening line). This is what lets a chat close at any moment without losing the round.

## When to stop and ask the owner

The single list is `.claude/TEAM_RULES.md` **13.4** — do not restate it here. Everything outside
that list: decide, do it, and write the decision in item 3 of the report
(`docs/TEMPLATES.md` template (ข)).
