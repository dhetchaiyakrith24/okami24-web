---
name: okami24-plan
description: /วางแผน — plan a piece of OKami24 web work before anyone builds it (SEO · articles · a new look or page · site structure · a product line). Use it when the owner types /วางแผน, "วางแผน", "ช่วยวางแผน", "อยากทำ X ทำยังไงดี", or brings a goal that needs more than one batch. It asks the owner 2–3 questions at most, reads what the repo already knows, picks the right skill or agent itself (content-strategy · seo-audit · site-architecture · designer · researcher), and hands back a plan of at most 7 steps the owner can approve in one word — then the plan becomes a round file and skill round-open takes over. Not for one small edit (just do it) and not for rules work (skill house-clean).
---

# /วางแผน — from a goal to a plan the owner approves in one word

The **procedure** for planning — no rule of its own (rules: `.claude/TEAM_RULES.md`; what a skill may name = 13.2
"สกิลเขียนอะไรได้"). The owner sends a goal, not steps (central §12 items 1–2): turn it into a sharp plan yourself.

## Step 1 — ask only what changes the plan (one set, 2–3 questions)

Read first, ask second: anything a file already answers is not asked (HANDOFF §16 queue · §18 permanent rulings ·
`docs/BUSINESS_SOURCE_OF_TRUTH.md` · `docs/SEO_LANDSCAPE.md` · `docs/SEO_BASELINE.md` · `docs/IMAGE_SPEC.md` · `docs/THAI_STYLE.md`).
What is still open goes to the owner as ONE set (13.3 "คำถามหลายเรื่อง = ชุดเดียว"), each with options and a recommendation —
usually: what counts as success (sales · visitors from Google · how the shop looks) · how wide (one product · one category ·
the whole site) · how soon. No answer in 30 minutes = take the recommendation and say so (13.3).

## Step 2 — pick the tools yourself

| the goal is about | use |
|---|---|
| what to write, which topics, an article list | skill `content-strategy` |
| why a page does not rank, head / meta / speed | skill `seo-audit` (an SEO round = agent `seo-auditor` at its points, 13.2) |
| which pages exist, menus, internal links, categories | skill `site-architecture` |
| a new look, section or component | agent `designer` (13.5 #6) — a new look also needs a reference picture (central §6) |
| market, competitors, prices, best sellers | agent `researcher` |
| the scope across pages (shared parts, more than 3 pages) | agent `scope-auditor` |

Use as few as the goal needs (central §12 item 25). Facts come from real sources, never memory (central §5).

## Step 3 — write the plan (central §12 item 12 · TEAM_RULES 13.1 #3)

At most **7 steps**. Each step, one line: what · how we know it is done · how it is checked (tier A/B, 13.5) · how it rolls back.
The first visible result lands within 7–14 days; longer = say so in the first line. Mark any step that needs money,
an account or a choice only the owner can make (13.3) — never hide it inside a step. No made-up numbers (central §8):
an estimate is labelled `[เชื่อว่า]`, missing data `[ยังไม่มีข้อมูล]`.

## Step 4 — hand it to the owner

Thai, short, owner's words (central §12 items 5–10): first line = what the plan gets the shop · the steps · the one question
("เริ่มตามนี้ไหม" with the recommended answer first). Long detail goes on the owner status page or a file, linked.

## Step 5 — after "ได้"

Write the plan as a round file in `docs/rounds/` from `docs/TEMPLATES.md` (ก) — goals, pass criteria, 【แตะได้】 / 【ห้ามแตะ】 —
commit it, then open the round with skill `round-open`. A plan the owner changes = rewrite it, not a second copy (TEAM_RULES head).
