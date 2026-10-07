---
name: round-open
description: Open a work round for the OKami24 site — any round, whatever its name (SEO, articles, data, cart, housekeeping, or one that does not exist yet). Use it every time the owner opens a round by attaching a round instruction file, before touching any file. It sequences what to read, how to confirm the repo state against the instruction file, the scope-auditor call (rounds that touch the site; again only if the scope grows), splitting the round into batches with their tier A/B, and writing the "round open" state into the handoff block. Also use it when a new chat continues an already-open round (skip the scope-auditor call in that case).
---

# Round open

The **procedure** for starting a round — no rule of its own (rules: `.claude/TEAM_RULES.md`; where each kind of thing
lives: the "แผนที่บ้าน" table at its head). What a skill may name = 13.2 "สกิลเขียนอะไรได้".

The owner sends **a goal plus a pass criterion** in a round instruction file (`docs/TEMPLATES.md` (ก)). A new chat on
a round already open = Step 1 + Step 2, then Step 5, continuing from the batch §16 names.

## Step 1 — Read first (the one "read first" list)

Always:
- `docs/HANDOFF.md` **§16** (state) — and §18 (permanent owner rulings) only when a decision touches one.
- The round instruction file. Git is its master (`docs/rounds/README.md`): copy it into `docs/rounds/` at open (computer:
  the attached file · cloud: branch `inbox`) and commit it with the round's first docs commit; a copy that differs from
  the one attached = say so.
- `.claude/LESSONS.md` — **headings only** (`grep -n "^## " .claude/LESSONS.md`), then open the lessons whose heading
  matches the round's work. Open it again before deciding "the order given is fine, but there is a better way".

Only on rounds that change copy shown on the site: `docs/THAI_STYLE.md` (rules) · `docs/THAI_STYLE_LOG.md` only to
cite an old ruling. Tools and verify commands: `docs/HANDOFF.md` §17, when needed.

## Step 2 — Confirm the repo

0. Day chat (the owner opened it): turn the night chain off first — `mcp__scheduled-tasks__update_scheduled_task`
   taskId `friday-chat-move` enabled false (TEAM_RULES 13.6). A night run follows its own routine prompt instead.
1. Read the `session-sync` lines in the chat's first context (the SessionStart hook fetched and fast-forwarded a
   clean branch): `STOP SIGN` = tell the owner first · `RE-READ NOW` = re-read those rule files first · no
   `session-sync` line at all = the hook did not run: say so, `git fetch origin` by hand, and run
   `node scripts/prepare-clone.js` (must end `prepare-clone: READY`).
2. `origin/main` vs the commit the instruction names: equal = go on · main moved on = one line
   (`git log --oneline <named>..origin/main`) and start from the latest main · stop only when a newer commit touches a
   file this round will change, or the named commit is not an ancestor of `origin/main`.
3. Working branch contains `origin/main` · tree clean · continuation after a chat move: the commits §16 marks as not
   yet checked are the ones on the branch; anything else = stop and report.
4. Report the numbers seen (main hash · branch) — never the numbers the file expected.

## Step 3 — Answer the instruction before touching anything

Objections only, max 5 items, each passing the test *if I do not say this, the work comes out different*:
- **real bans** of this round, one line each, only where obeying them changes what gets built;
- **method prescribed without need** — say the way you will take and why (central §12 item 16), then start without
  waiting (13.1 #4);
- **ambiguous wording** that sends the work two ways — ask as one set with a recommendation (central §12 item 13), keep
  working on what it does not block.
Nothing to object to = `ไม่เห็นจุดเสี่ยง — คำสั่งชัด เริ่มได้เลย`. Never restate the instruction.

## Step 4 — Scope: `scope-auditor` when the round touches the site

Before the first batch of a round that touches what a visitor gets (skip for docs/rules/skills/agents —
`self-merge-check` would print `SMALL`). It counts from the live sitemap; its page list becomes the checker's page list
for every batch. Scope grows mid-round = call it again for the new part (a change of direction = 13.3 #4).

## Step 5 — Batches, then start

Split the goal into checkable batches, each with "how we know it is done" and its tier (A = text only · B = structure
or screen · not sure = B — 13.5). Big by central §12 item 12 = plan first (`planner` optional, 13.1 #3). Tell the owner
3–5 lines of what in what order and **start**. Helper files → `_incoming/<round>/` or `scripts/`.

Write the round into `docs/HANDOFF.md` §16 item 3 (instruction file · batches with tiers · where it stopped — spec:
skill `okami24-handoff`), and keep it current at every batch close.

## When to stop and ask

`.claude/TEAM_RULES.md` 13.3 only. Everything else: decide, do it, write it in report item 3.
