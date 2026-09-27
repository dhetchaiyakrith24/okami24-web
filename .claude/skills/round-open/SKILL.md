---
name: round-open
description: Open a work round for the OKami24 site — any round, whatever its name (SEO, articles, data, cart, housekeeping, or one that does not exist yet). Use it every time the owner opens a round by attaching a round instruction file, before touching any file. It sequences what to read, how to confirm the repo state against the instruction file, the single scope-auditor call, the tier A/B decision, splitting the round into batches, and writing the "round open" state into the handoff block. Also use it when a new chat continues an already-open round (skip the scope-auditor call in that case).
---

# Round open

This skill is the **procedure** for starting a round. It holds no rule of its own — every
rule stays where it lives (`.claude/TEAM_RULES.md` section 13, `docs/HANDOFF.md`, `docs/THAI_STYLE.md`)
and this file only says in what order to pick them up. What a skill may and may not name =
`.claude/TEAM_RULES.md` 13.3 "สกิลเขียนอะไรได้" (the one place): an expected count, a page count, a commit hash or a
file under `src/` is never written here — things that change are read from their source at the moment they are needed.

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
- The round instruction file the owner attached. Git is its master (`docs/rounds/README.md`, owner ruling Q1 2026-09-27):
  copy it into `docs/rounds/` at open — on the computer from the file attached, in the cloud from the `inbox` branch —
  and commit it with the round's first docs commit; a copy that differs from the one attached = say so (README).
- `.claude/LESSONS.md` — the "what worked" lessons (the one place for them, owner ruling 2026-09-25). Not
  imported into `CLAUDE.md` on purpose (too large to load every chat) — read it here, at round open, and
  again before deciding "the order given is fine, but there is a better way". New lessons are written there.

Only on rounds that touch copy shown on the site (SEO · articles · language rounds = read;
housekeeping · data · code-only rounds = do not read):
- `docs/THAI_STYLE.md` (rules only).
- `docs/THAI_STYLE_LOG.md` — open it only when an old sentence or ruling must be cited, never
  as a whole.

When a tool or a verify command is needed: `docs/HANDOFF.md` **§17** (rules and tools), not before.

Then `git status` — know where the tree is before moving.

## Step 2 — Confirm the repo matches the instruction file

1. `git fetch origin` — always first, computer or cloud (owner ruling Q7 ①, round B 2026-09-27): the round starts
   from the latest `origin/main`, never from a stale local copy. At every chat open the SessionStart hook
   `scripts/session-sync.js` has already fetched and fast-forwarded a clean branch (round C) — read its
   `session-sync` lines in the first context: a `STOP SIGN` line = tell the owner before anything else · a `RE-READ NOW`
   line = re-read those rule files first · no `session-sync` lines at all = the hook did not run, say so and fetch by hand.
2. Compare `origin/main` with the commit the instruction file names as main. Equal = go on. **Main has moved on**
   (the file was written before a later merge) = report it in one line with `git log --oneline <named>..origin/main`
   and start from the latest main; **stop and report only when** one of those newer commits touches a file this round
   is about to change, or the named commit is not an ancestor of `origin/main` at all.
3. Confirm the working branch contains `origin/main` (fast-forward if it is merely behind);
   confirm the tree is clean. On a continuation after a mid-batch move (13.6 "ย้ายแชทในเว็บ"), the unfinished work is
   already committed on the work branch (13.12 #5 — no `wip/…` branch since 2026-09-27): pull it and check that the
   commits §16 marks as not yet checked are the ones there; any other change = stop and report.
   **Machine ready** (round "mobile" instruction, batch 1): `node scripts/prepare-clone.js` must end `prepare-clone: READY` — one command, safe to repeat,
   what it does is in its head (git hooks — without them the commit and push gates do not run, `docs/RECOVERY.md` 2ค ·
   full git history · packages · Next types · browser · Thai font). A cloud chat runs it by itself at session start
   (`scripts/session-sync.js`, the SessionStart hook, starts it after its fetch) — read its lines in the session's first context; not there or not
   READY = run it now.
4. Report the numbers seen (hash of main, branch, tags) — never the numbers the file expected.

If the instruction file also names a close point — a tag on a computer round, the close commit on a cloud round
(skill `round-close` step 5) — check it with `git tag -n1` / `git log -1 <commit>`; a close point a few commits before
the merge commit is normal (it marks the round-close commit, the merge commit is made at merge, 13.7) — say so
instead of treating it as a mismatch.

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
  these need a reply, asked the way of the central file's §12 item 13 (only what changes the
  result, one set, each with a recommended option) — keep working on everything they do not
  block (§12 item 14).

**Cap: 5 items in total**, and only items that pass this test: *if I do not say this, the work
comes out different.* Nothing to object to = one line, `ไม่เห็นจุดเสี่ยง — คำสั่งชัด เริ่มได้เลย` (central §12 item 16), and continue.
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
tier A; anything that touches structure or the screen = tier B (proof size — light or full set = `.claude/TEAM_RULES.md` 13.12; the step order lives
in §17 only).
**Not sure = tier B.** Write the tier next to each batch in the plan.

## Step 6 — Split the round into batches

Break the goal into checkable steps with a "how we know it is done" line each; the size cap and
the planner rule live in `.claude/TEAM_RULES.md` 13.2 item 2 (one place) — a round that is big by
the criteria of the central file's section 12 item 12 (`~/.claude/CLAUDE.md`, read with the web §3 line at the end of TEAM_RULES) goes to the `planner` agent, a small one is split by the main
agent. Then tell the owner in 3–5 lines what will be done in what order and **start** — no
approval wait, unless a 13.4 case is already visible.

Every helper file created on the way (scripts, comparison images, logs, agent briefs) goes under
`_incoming/<round>/` or `scripts/` — save each agent brief there (the checker and the next chat read them; on a big round or a long
project `docs/ROUND_COST.md` also counts them — `.claude/TEAM_RULES.md` 13.12 #7).

## Step 7 — Write the round into the handoff block

Update `docs/HANDOFF.md` §16 item "open round" to say which round is open, its instruction
file, the batch list with tiers, and where it stopped (the spec of §16 is in
`.claude/agents/doc-keeper.md`; `doc-keeper` writes it at every batch close, the main agent
writes the opening line). This is what lets a chat close at any moment without losing the round.

## When to stop and ask the owner

The single list is `.claude/TEAM_RULES.md` **13.4** — do not restate it here. Everything outside
that list: decide, do it, and write the decision in item 3 of the report
(`docs/TEMPLATES.md` template (ข)).
