# Round C — "computer = Git · central rules in one place · merge rule · cloud screenshots · GSC" (computer, 2026-09-27)

Instruction: `docs/rounds/รอบC-คอมตรงGit-กฎกลางที่เดียว-merge-ภาพ-GSC.txt` (the OneDrive copy that ran, byte copy).
Rollback point: tag `pre-roundC` → `93e467b`. Close: tag `roundC-done`. Site pages touched: 0 (scope-auditor counted 104
sitemap pages from source; `self-merge-check.js --base pre-roundC` → `PASS - nothing on the site changed since the base`).
Every batch tier A.

## Batches and PRs

| Batch | Topic | PR | Merged by | Checker |
|---|---|---|---|---|
| B1 | round B leftovers (inbox cloud-check file → docs/rounds · rule-auditor line 39 · §16) | #78 | Friday (old rule, off-site) | PASS 4/4 |
| B2 | session-sync SessionStart hook (computer = GitHub at chat open) | #79 | Friday, owner's OK in chat | PASS (7 cases re-run) |
| B3 | central rules from one place | — | **on hold** (owner, in chat: rules already match everywhere; one uncommitted script removed, nothing else done) | — |
| B4 | new merge rule 13.7 / 13.4 #2 + site-paths + self-merge-check SMALL/SITE/BIG | #83 | Friday, owner approved the PR in chat | PASS 6/6 |
| B5 | cloud Chromium trusts the cloud network CA | #80 | Friday, owner "merge #80 #81" | PASS |
| B6 | GSC read-only export (key in GitHub environment `gsc`, data to branch `gsc-data`) | #81 | Friday, same | PASS |
| — | §16 stop points · memory note + lesson · this close | #82 #84 #85 + close PR | Friday (small) | PASS each |

## Evidence (summaries of `_incoming/roundC/` files)

- **B2** (`b2-evidence.md`): scratch clone, origin = GitHub — up to date · behind 4 clean → fast-forwarded 2006825→93e467b ·
  behind + uncommitted → not moved, warning · ahead 1 → warning · diverged 1/4 → warning · bad origin URL → "เช็ค GitHub
  ไม่ได้" · 76703c9→93e467b → `RE-READ NOW: .claude/TEAM_RULES.md · CLAUDE.md`. A missing `@import` target does not break
  CLAUDE.md loading (nested-load test).
- **B2 real run** (owner's new chat on the computer, 2026-09-27 ~17:50): 1st try failed — the hook itself was in the
  behind part (lesson พ3). 2nd try, computer at `cefe29f` with the hook, GitHub at `90592db` (#85 = a memory file every
  chat loads): `UPDATED: main fast-forwarded cefe29f → 90592db (2 commit(s), 3 file(s))` · `RE-READ NOW` shown, the chat
  re-read MEMORY.md + project-session-sync.md · `git log -1` = `90592db` · Javis: `.git/logs/HEAD` "merge origin/main:
  Fast-forward" at chat-open time. Probe: no `session-probe` line came with CLAUDE.md (probe nonce 21ac4476) = **Claude
  Code loads the rules before the SessionStart hook runs**; the RE-READ line covers it. Owner: pass. Probe removed at close.
- **B4**: first edit refused by the session's permission guard ("Self-Modification"), not retried; the owner allowed
  the edit in chat, one retry went through. Checker: 12-file class test, a diff inside 13.7 = BIG, gates PASS.
- **B5** (`b5-evidence.md`): learn on okami24.store = GlobalSign root; expired.badssl.com = FAIL; Chrome with the flag
  still blocks expired.badssl.com; a private test CA opens a localhost page only with the flag. Cloud proof pending:
  `rounds/roundC-cloud-check.txt` on `inbox` (Javis, later — owner: do not wait).
- **B6**: `scripts/gsc-export.js` against a local stand-in with a throwaway key (`gsc-mock.js`): token signature verified,
  6 reports + meta.json, missing / broken / wrong key fail with one line and no value printed. Live run waits for the
  owner's `docs/GSC_SETUP.md` steps.
- Local branches deleted with the owner's OK: the 7 of §16 4a + the 7 round C branches + `checkpoint/phase-3.3.1` (same
  commit as tag `archive/phase-3.3.1`) + `roundB-inbox-add` (on inbox) + `roundB-inbox-local` (its 4-file removal is on
  inbox as `1b6d995`); 4 clean worktrees removed.

## Close verify (logs `_incoming/roundC/close/`)

`npx tsc --noEmit` exit 0 · `npm run verify:commerce` **All 17 checks passed** · `node scripts/thai-raw-chars-check.js`
**0** · `npx tsx scripts/content-dates.ts --check` **current (55 paths)** · rule gates PASS · eslint on touched scripts 0.
Not run: `verify:catalog --full`, `count-storefront`, `i18n`, `scan.js`, `og-gate.js` — nothing the build or the server
reads changed this round (proof sizing above), and the account's weekly usage was at 96%; their last numbers stand from
round A (HANDOFF §16 item 6).
