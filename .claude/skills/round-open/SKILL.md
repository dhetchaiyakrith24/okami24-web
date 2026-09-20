---
name: round-open
description: Open a work round for the OKami24 site — any round, whatever its name (SEO, articles, data, cart, housekeeping, or one that does not exist yet). Use it every time the owner opens a round by attaching a round instruction file, before touching any file. It sequences what to read, how to confirm the repo state against the instruction file, the single scope-auditor call, the tier A/B decision, splitting the round into batches, and writing the "round open" state into the handoff block. Also use it when a new chat continues an already-open round (skip the scope-auditor call in that case).
---

# Round open

This skill is the **procedure** for starting a round. It holds no rule of its own — every
rule stays where it lives (`~/.claude/CLAUDE.md` section 13, `docs/HANDOFF.md`, `docs/THAI_STYLE.md`)
and this file only says in what order to pick them up. Never copy a number, a file name, a page
count, a commit hash or a section number from one of those files into this one: things that
change are read from their source at the moment they are needed.

The owner sends **a goal plus a pass criterion** in a round instruction file written from
`docs/TEMPLATES.md` template (ก). This skill turns that file into a running round.

## When this applies

- The owner says "open round X" and attaches (or names) the round's instruction file.
- A new chat starts on a round that is already open (continuation after a handoff) — run
  Step 1 and Step 2, then skip to Step 6 and continue from the batch the handoff block names.

## Step 1 — Read before anything else (the single "read first" list)

This is the one and only "read before starting" list of the team — `~/.claude/CLAUDE.md` 13.2
item 1 and 13.9 point here, and so does the head of `docs/HANDOFF.md`. Do not restate it anywhere
else.

Always:
- `docs/HANDOFF.md` **§16** — the copy-paste block (main · what the branch is ahead by · which
  round is open and where it stopped · what waits on the owner · open questions).
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

## Step 3 — Scope: call `scope-auditor` once, and only once

Before the first batch, call the `scope-auditor` agent **one time**. It walks the live sitemap
and reports which pages this round really touches — **count from the sitemap, never trust a page
count written in the instruction file or remembered from an earlier round** (the reason this
rule exists: a remembered "product page" count once left a whole category of pages outside the
gates for a week). The list it returns becomes the checker's page list for every batch of the
round.

Do not call it again during the round; if the scope changes mid-round, that is a stop-and-ask
case (`~/.claude/CLAUDE.md` 13.4).

## Step 4 — Decide tier A or tier B for each batch

Apply the two-tier rule as written in `docs/HANDOFF.md` §17 ("Two-tier rule") — text only =
tier A (no screenshots, no designer per batch); anything that touches structure or the screen =
tier B (full proof: build → shoot before → shoot after → designer → owner picks → checker).
**Not sure = tier B.** Write the tier next to each batch in the plan.

## Step 5 — Split the round into batches

Break the goal into checkable steps with a "how we know it is done" line each; the size cap and
the planner rule live in `~/.claude/CLAUDE.md` 13.2 item 2 (one place) — a round that is big by
the criteria of section 3 there goes to the `planner` agent, a small one is split by the main
agent. Then tell the owner in 3–5 lines what will be done in what order and **start** — no
approval wait, unless a 13.4 case is already visible.

Every helper file created on the way (scripts, comparison images, logs, agent briefs) goes under
`_incoming/<round>/` or `scripts/` — save each agent brief there so `docs/ROUND_COST.md` can
count the calls at round close.

## Step 6 — Write the round into the handoff block

Update `docs/HANDOFF.md` §16 item "open round" to say which round is open, its instruction
file, the batch list with tiers, and where it stopped (the spec of §16 is in
`.claude/agents/doc-keeper.md`; `doc-keeper` writes it at every batch close, the main agent
writes the opening line). This is what lets a chat close at any moment without losing the round.

## When to stop and ask the owner

The single list is `~/.claude/CLAUDE.md` **13.4** — do not restate it here. Everything outside
that list: decide, do it, and write the decision in item 3 of the report
(`docs/TEMPLATES.md` template (ข)).
