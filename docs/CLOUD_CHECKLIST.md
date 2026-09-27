# Cloud checklist — does a cloud chat get everything web work needs?

Written round B "housekeeping" (2026-09-27, batch 7) · pointed at from `docs/CLOUD.md` · run it from a **fresh cloud
chat on `main`**, read-only (the instruction file for that chat sits on branch `inbox`, `rounds/`). Answer per row:
✅ present and works · ❌ missing / fails (quote the error) · ⏭ skipped with the reason. Pass strings below are what each
script prints itself; no count is expected here.

## A. Rules and memory load by themselves

| # | Item | How to check |
|---|---|---|
| A1 | `CLAUDE.md` + `AGENTS.md` + `.claude/TEAM_RULES.md` | answer without opening a file: what is 13.4 item 9? (push/merge fails = stop, quote the error) |
| A2 | central rules copy `.claude/rules/central-rules.md` | answer without opening a file: what is central §12 item 32 about? · then `node scripts/central-rules-copy-check.js` → `PASS` |
| A3 | Friday's memory `.claude/memory/MEMORY.md` | answer without opening a file: where do new memories go? |
| A4 | `.claude/LESSONS.md` | file exists (not auto-loaded — read at round open) |

## B. The 10 agents load (one call each, "reply one line: LOADED <name> — tools")

checker · designer · doc-keeper · planner · researcher · rule-auditor · scope-auditor · seo-auditor · thai-copy · writer
— each must answer with **its own role name** (not "Friday") and the tools on its file's `tools:` line.

## C. The 7 skills are listed and open

round-open · round-close · merge-pack · tier-b-proof · thai-check · catalog-research · okami24-handoff — each appears in
the session's skill list and its `SKILL.md` opens; every backticked repo path in them exists.

## D. Machine and gates run

| # | Command | Pass |
|---|---|---|
| D1 | `node scripts/prepare-clone.js` (the SessionStart hook runs it) | ends `prepare-clone: READY` |
| D2 | `node scripts/eol-check.js` | `eol-check: OK` |
| D3 | `node scripts/owner-rules-check.js` · `node scripts/rules-move-check.js` | `PASS` each |
| D4 | `node scripts/self-merge-check.js --base origin/main` on `main` itself | runs to a verdict line (no crash) |
| D5 | `node scripts/deploy-decision.js --files "docs/HANDOFF.md"` · `--files "scripts/line-clicks.js"` | `SKIP …` · `DEPLOY …` (the second after PR #75 merges) |
| D6 | `ls scripts/large-file-check.js` + `.githooks/pre-commit` names it | present after PR #75 merges |
| D7 | `npm run verify:commerce` | its own "All … checks passed" line |
| D8 | `node scripts/test-server.js status` | answers (running / not running) |

## E. Main documents present

`docs/HANDOFF.md` (§16 state, §17 tools) · `docs/CLOUD.md` · `docs/RECOVERY.md` · `docs/BUSINESS_SOURCE_OF_TRUTH.md` ·
`docs/THAI_STYLE.md` · `docs/THAI_STYLE_LOG.md` · `docs/LAUNCH_AUDIT.md` · `docs/TEMPLATES.md` · `docs/AI_TEAM_GUIDE.md` ·
`docs/IMAGE_SPEC.md` · `docs/SEO_BASELINE.md` · `docs/SEO_LANDSCAPE.md` · `docs/ARTICLES_10A.md` · `docs/RULES_INDEX.md` ·
`docs/DEPLOY-RENDER.md` · `docs/rounds/` (README + the round files) · `docs/cloud-results/` (round records +
`incoming/`, the `_incoming` files docs cite for work ahead).

## F. On the computer only — on purpose (not a failure in the cloud)

| Item | Why |
|---|---|
| `_incoming/` (round evidence, source photos) | not in git: too big, and dies with a cloud container; what the docs need is in `docs/cloud-results/` |
| `.data/` (local database, QR image) · `_incoming/restore-test/` · `_incoming/qr-upload/` | customer / payment data — never in git |
| OneDrive `Run prompt\` (Javis's drafts, Backup) | Javis's side; round files that ran are in `docs/rounds/` |
| `~/.claude/` (account settings, account skills) | the account, not the project |
| live-site screenshots · in-app browser | cloud Chromium does not trust the network's certificate (`docs/CLOUD.md` table 1) |
| deleting a GitHub branch | refused from the cloud (HTTP 403, `docs/CLOUD.md`) |
