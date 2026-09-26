# Round A "pipes" — cloud results (2026-09-27)

Round instruction: `origin/inbox:rounds/roundA-pipes.txt` · branch `claude/round-a-pipes-setup-3hjydq` · base main `51af909`
(= the rollback point; tag pushes are refused from the cloud, so the round names commits instead of tags) · machine:
claude.ai/code cloud. Evidence under `_incoming/roundA-pipes/` is git-ignored and dies with the container — this file is
the record (topic 8 of `docs/cloud-results/mobile-round-questions.md`).

## Round open

| Check | Result |
|---|---|
| `origin/main` at open | `51af909` = the instruction file's main |
| `prepare-clone` (SessionStart hook) | READY |
| scope-auditor | 0 of 104 sitemap pages touched; no file this round edits is imported by `src/` or run by the Render build |
| Live sitemap `<loc>` count, `curl -s https://okami24.store/sitemap.xml` | 104 |

## Batch 1 — Friday merges in the cloud

This file is also the "small real PR" of batch 1: its first version was merged by Friday from the cloud with the chat's
GitHub tool, under 13.7's conditions (checker PASS · merge gate PASS · every GitHub check green).

| Check | Result |
|---|---|
| One list | `scripts/lib/site-paths.js` — off-site allow-list + Javis-only list; read by `self-merge-check.js` and `deploy-decision.js` |
| Gate on 10 sample paths (`--files`) | PASS: `docs/…` · `.claude/skills/…` · `.claude/agents/…` · `.claude/TEAM_RULES.md` · BLOCKED: `.claude/settings.json` · `scripts/prepare-clone.js` (SessionStart hook runs it) · `.githooks/pre-push` · `.github/workflows/deploy.yml` · `.claude/rules/central-rules.md` · `src/app/page.tsx` |
| Red: local branch `tmp/probe-src` = main + 1 commit touching `src/app/sitemap.ts` (never pushed, branch deleted) | `node scripts/self-merge-check.js` → `BLOCKED  src/app/sitemap.ts  (not on the off-site list …)` · exit 1 |
| Gate on PR #72 head `10a322a` (cloud, no `gh`) | `ok docs/cloud-results/roundA-pipes.md` · `HEAD 10a322a…` · PASS · exit 0 |
| GitHub checks on PR #72 | `copy` success ×2 (push + pull_request) |
| checker on PR #72 (commit `10a322a`) | PASS 5/5 |
| **Merge from the cloud** — chat GitHub tool, merge method `merge`, `expectedHeadSha` = `10a322a…` | `{"merged":true,"message":"Pull Request successfully merged"}` · merge commit **`f3405c2`** on main (parents `51af909` + `10a322a`) — Friday's first cloud merge, no `gh`, no computer |
| Branch after the merge | fast-forward to `f3405c2` (no force push); the round's other work continues as a second PR |

## Batch 2 — deploy after the checks pass (no real deploy)

| Check | Result |
|---|---|
| `deploy-decision.js`, local range with a `src/` commit | `DEPLOY - 1 file(s) reach the site: src/app/sitemap.ts` |
| same + a `.github/workflows/` commit | `SKIP - this merge changes the deploy pipeline (.github/workflows/probe.yml) - never deploys itself …` |
| docs-only | `SKIP - nothing on the site changed` |
| bad range | `could not read the changed files: …` · exit 2 (workflow gets `deploy=false`) |

## Batch 3 — small items

| Item | Result |
|---|---|
| Topic 12 red (old way, `_incoming/roundA-pipes/red-3411.mjs old`) | `old: 5 s after stop, 3411 still answers = true -> RED (server left behind)` |
| Topic 12 green (new way, same script `new`) | `new: 5 s after stop, 3411 still answers = false -> GREEN (port free)` |
| `npm run verify:catalog -- --full` once, with the fix | **All 31 step(s) passed** (new step: `next start on 3411 stopped (no server left behind)`) · 77 s · `fuser -n tcp 3411` afterwards = exit 1 (nothing listens) |
| Topic 4, curl from this cloud, 27/09 19:48 UTC | `www.youtube.com` 200 · `www.youtube-nocookie.com/embed/<id>` 200 · `i.ytimg.com/vi/<id>/hqdefault.jpg` 200 · `s.ytimg.com` 404 · `yt3.ggpht.com` 400 · `rr1---sn-a5mekn6d.googlevideo.com` tunnel 502 · `www.google.com` 200 · still **403**: `img.youtube.com`, `googlevideo.com` (apex) |
| Topic 7, private Artifact page with 2 embedded images | published from the cloud chat, link returned at once (`https://claude.ai/artifact/TuQkJ54AAMknjaj7co1ys9`) · opening on a phone = [ยังไม่ได้ลองบนมือถือ] |

## Round-level checks (cloud)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npx eslint` on the 4 scripts touched | exit 0 |
| `npm run verify:commerce` | All 17 checks passed |
| `eol-check` · `owner-rules-check` · `rules-move-check` · `central-rules-copy` | OK · PASS · PASS · PASS (local; remote comparison SKIPPED) |
| Secret scan of the round's diff vs `51af909` (tracked + untracked) | 0 hits |
| `git diff --stat 51af909 -- src public` | empty |

## rule-auditor (26 rows) — fixed in this round

round-close description/§16/merge-pack wording for cloud rounds (row 1) · 13.7: Friday never triggers a deploy herself,
incl. "Run workflow" with deploy (15) · skipped GitHub checks do not count, red/running = not yet (16) · full exception list
= `JAVIS_ONLY` in `scripts/lib/site-paths.js` (17) · hook scripts now include the modules they `require`
(`scripts/lib/chrome.js`, 18) · `--pr` blocks unless the local HEAD is the PR head, `--files` = gate test only (19) ·
"PASS is necessary, not sufficient" (20) · RECOVERY 1ก lists every SKIP case + the manual "Run workflow" (21), warns that
after a Rollback the next site merge re-deploys main (22), cloud rows say "no tag — give the 7-character code" (23) ·
"a round closed in a cloud chat" (24) · CLOUD.md rows 27/26 reduced to pointers (11, 12).
Kept on purpose: row 13 (13.7 names agents twice) — the owner asked on 27/09 to keep the 26/09 text.

## For round B (outside this round's allowed files — not changed)

| Where | What | Suggested fix |
|---|---|---|
| `docs/TEMPLATES.md:35` | round template still says "close = tag + push tag" | "close = round-close step 5 (computer = tag · cloud = commit)" |
| `docs/DEPLOY-RENDER.md:176-177` | says Render Auto-Deploy "can be switched on later in Settings" — switched on, every merge would deploy with no checks, and the merge gate cannot see a dashboard switch | "Render Auto-Deploy stays off; the site goes live via GitHub (RECOVERY 1ก)" — **owner rules** whether to write "never switch it on" |
| `docs/DEPLOY-RENDER.md:52 · 80` | "merge main → Manual Deploy" / `OKAMI24_ORDERING` "merge → Save, rebuild, and deploy" — a site merge now deploys itself; a manual deploy after it = 2 deploys | rewrite; **owner/Javis rule**: after a `render.yaml` merge, is a Blueprint Sync still needed? [เชื่อว่า the deploy hook does not re-read Blueprint settings] |
| `.claude/skills/merge-pack/SKILL.md:3 · 17 · 19 · 26-27` | "Merge and deploy: Cowork", "after the tag push", "the tagged commit" | "deploy: 13.7 (goes live after merge)" · "the close commit (tag on computer rounds)" |
| `.claude/skills/tier-b-proof/SKILL.md:44` | "the round's base commit (the commit its `pre-…` tag names)" | "…or in the cloud the main commit named in cloud-results" |
| `docs/AI_TEAM_GUIDE.md:149 · 152` | round-close "tag + push tag" | "tag (computer) / close commit (cloud)" |
| `docs/HANDOFF.md:530 · 550` | old state lines that read like rules ("never merge yourself; Cowork's job") | doc-keeper adds a "superseded 27/09 — see 13.7" note (it may not edit old text) |
| `docs/TEAM_RULES_SOURCES.md` 13.7 | the 26/09 + 27/09 sources sit in the rule line, not here | add lines under 13.7, then trim the dates from the rule line |
| `.claude/TEAM_RULES.md` 13.4 #2 | "จะ merge / deploy → ถาม" vs 13.7 "a site merge deploys itself" | make 13.4 #2 point to 13.7 for deploy |
| `docs/DEPLOY-RENDER.md:89` | `node scripts/line-clicks.js` is run by hand in the Render Shell against the live DB — the merge gate counts it off-site | **owner rules**: do scripts run in the Render Shell count as "the site"? (if yes: add to `site-paths.js`) |
| `_incoming/<round>/` files the merge needs (extras.md · break logs · owner-table) | die with a cloud container like the verify logs | **owner rules**: copy/summarise every `_incoming` file a report cites into `docs/cloud-results/<round>.md` |
| Render "deploy when checks pass" (`autoDeployTrigger: checksPass` + `buildFilter`) | a native alternative to the workflow (no secret) — needs `render.yaml`, forbidden this round | consider only if the workflow proves awkward |
