# OKami24 — Round cost log (ROUND_COST)

> Created 2026-09-17 (housekeeping round v2, step 8 — owner order 2026-09-16: "I don't know what the model quota is spent on").
> Claude cannot see its own token count, so each row records **countable proxies**. One row per round, filled in at round close by the main agent (doc-keeper may fill it from the same sources). Never estimate a number that was not counted — write `[ยังไม่มีข้อมูล]` and say why.
> Sources for a row: screenshots = image files under `_incoming/<round>/` · builds = `build*.log` there (+ verify logs) · agent calls = brief files saved there (a lower bound — re-runs without a brief are not counted) · checker send-backs = "ตีกลับ" notes in that round's HANDOFF / THAI_STYLE_LOG entries · chats = HANDOFF versions written during the round · commits = `git log --oneline | grep <round tag>`.

## Table

| Round | Dates | Screenshots taken | Builds | Agent calls | Checker send-backs | Chats used | Commits | Source / caveat |
|---|---|---|---|---|---|---|---|---|
| 30.4ก (site-wide Thai wording) | 2026-09-12 → 09-14 | **141** | **9** | `[ยังไม่มีข้อมูล]` (no briefs were saved as files) | `[ยังไม่มีข้อมูล]` (not recorded) | **3** (HANDOFF v18 · v19 · v20) | **24** | `_incoming/30.4/` (65 MB) counted 2026-09-17 · commits = subjects tagged (30.4)/30.4a |
| 30.4ค (remaining English on product pages) | 2026-09-15 → 09-16 | `[ยังไม่มีข้อมูล]` — folder `_incoming/30.4c` (265 MB, 1,645 files) deleted 2026-09-17 on the owner's order; owner's own estimate before deletion: ~200 [เชื่อว่า] | **≥ 8** (build-after-k1 · k1A · k2 · k34 · k5 · close1 · close2 · close3 seen in the listing before deletion; listing was cut at 40 entries) | **≥ 8** (batch-1…7 and batch-9 briefs seen before deletion) | `[ยังไม่มีข้อมูล]` | **2** (HANDOFF v21 · v22) | **40** | counts taken from the folder listing printed in chat A before `rm`; commits = subjects tagged 30.4c/30.4ค |
| 30.4ข (add new things + close-out) | 2026-09-16 → 09-17 | **169** | **19** (+ 7 verify:catalog logs) | **≥ 15** briefs (checker 7 · designer 4 · thai-copy 2 · writer 2) | **≥ 2** (batch 4: docs moved during the check → sent back · batch 5: zh 保证 → sent back — HANDOFF v26 §3, lessons 5 and 8) | **4** (HANDOFF v23 · v24 · v25 · v26) | **17** | `_incoming/30.4b/` (31 MB) counted 2026-09-17; commits = subjects tagged 30.4b/30.4ข |
| Housekeeping v2 (this round, chat A + step 0–8 so far) | 2026-09-17 | **0** | **1** (verify:catalog --full) | **7** (checker 3 + 2 re-checks · rule-auditor 1 smoke + 1 full + 2 resends · doc-keeper 0) | **1** (RULES_INDEX row 42 line reference) | **1** (chat A and chat B in the same chat) | see git log after round close | filled from this chat's own tool calls |

## What cost the most (8.4 — from the numbers above, [ตรวจแล้ว] unless tagged)

1. **Screenshots are the biggest measurable line.** 141 (30.4ก) and 169 (30.4ข) images per round, plus ~200 [เชื่อว่า] in 30.4ค. The instruction file's own estimate: ~200 shots ≈ the cost of opening two new chats.
2. **Builds:** 19 in 30.4ข alone (one per batch × before/after, plus close-out), each a full `next build`.
3. **Chats:** 30.4ข used 4 handoff versions in two days; every new chat re-reads the rule stack (which this round shrank: THAI_STYLE 350 KB → 68 KB, HANDOFF §16 9.5 KB → 5.3 KB).
4. **Agent calls** are under-counted everywhere (briefs are saved only when the main agent bothered), so this column cannot rank rounds yet.

Not measurable from what is on disk: token usage per agent, designer re-runs without a brief, time spent reading files. Those need the owner's usage page, not the repo.

## Proposed caps (8.3 — owner decides; nothing here is a rule until it lands in `~/.claude/CLAUDE.md`)

- **≤ 30 screenshots per round** — run `scripts/wordbreak-scan.js` / `scripts/scan.js` first and shoot only what the scan flags.
- **1 round = 1 chat** where possible; handoff only by 13.6 (ก)–(ง).
- **Documentation is written by `doc-keeper`, not the main agent** (13.5 exception already in force).
- **Heavy rounds early in the week, light ones late** — the quota resets Sunday 22:00.
- New per-round rule to keep this file honest: save every agent brief under `_incoming/<round>/` so the "agent calls" column can be counted next time.
