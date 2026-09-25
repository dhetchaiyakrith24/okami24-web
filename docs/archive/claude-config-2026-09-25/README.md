# Archive copy only — NOT the live files

Verbatim copies of the out-of-repo rule files as they stood on 2026-09-25, taken at the open of the
"rules move" round (round file `รอบย้ายกฎ-แยกกฎเว็บออกจากไฟล์กลาง.txt`), BEFORE section 13 was
moved into the repo and before the owner-allowed 3-point edit of §3/§6/§8. Taken so that a bad edit
to a file that git does not track can be undone (restore steps: `docs/RECOVERY.md`).

  ~/.claude/CLAUDE.md               -> CLAUDE.md                (sha256 1cd99c64b632…52db7)
  ~/.claude/skills/handoff/SKILL.md -> skills/handoff/SKILL.md  (sha256 53c94956…3f3ce)

  memory/*.md (6 files)             -> copies of the project memory files removed from
                                       (5 per owner ruling ง + feedback-remote-control-always, written and
                                       retired the same day once 13.6 carried the rule)
                                       ~/.claude/projects/<this project>/memory/ at round close (owner ruling ง,
                                       2026-09-25, after tests ก/ข/ค passed) — their content lives in
                                       .claude/TEAM_RULES.md, .claude/LESSONS.md and HANDOFF §17 now
                                       · one deviation from verbatim: memory/lessons-what-worked.md line 55 had
                                       2 raw invisible chars (U+2060, U+00A0) inside a regex example — written
                                       here as the visible escapes "\u2060" / "\u00A0" so the raw-chars gate
                                       (scripts/thai-raw-chars-check.js, scans docs/) stays at 0; the byte-exact
                                       original is in _incoming/rules-move/backup-2026-09-25/memory/ (sha256 a4487cb4…)

Nobody reads rules from here. After the round: section 13 lives in `.claude/TEAM_RULES.md`, the
handoff skill in `.claude/skills/okami24-handoff/`. Previous snapshot: `../claude-config-2026-09-17/`.
