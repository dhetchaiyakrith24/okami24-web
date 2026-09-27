# T4 — cloud capability test (written by Friday on the computer, 2026-09-26 · round "cloud")

You are a cloud session of the OKami24 web repo. This file is the test. Do every step in order, time each command
(`date +%s` before/after, or `time`), and do not fix, install or change anything unless a step says so.
**Never touch `main`, never open a PR, never merge.** Your only write = one results file on your own session branch.

## A. Rules and memory (answer from what is loaded, no tools)
1. Who is Friday · what central rules §12 item 13 says · which file the central rules come from.
2. What your memory index says about file paths and about CRLF (name the file it is loaded from).

## B. Machine (Bash, one command each, record output first 2 lines + seconds)
3. `git rev-parse --abbrev-ref HEAD; git log --oneline -1; git branch -r | head`
4. `node --version; npm --version; nproc; free -m | head -2; df -h . | tail -1`
5. `which gh; gh --version` · `which google-chrome chromium chromium-browser`
6. `curl -s -o /dev/null -w "%{http_code}\n" https://okami24.store/` · same for `https://registry.npmjs.org/` and `https://github.com/`
7. `git config core.hooksPath` (then set it: `git config core.hooksPath .githooks` — allowed, local to your clone)
8. `test -f .claude/rules/central-rules.md && sha256sum .claude/rules/central-rules.md`

## C. Build and verify (record pass/fail + seconds; stop a step after 10 minutes and write "timeout")
9. `npm ci`
10. `npx tsc --noEmit`
11. `npm run verify:commerce`
12. `SITE_URL=https://okami24.store npm run verify:catalog -- --full` (runs `next build` itself)
13. `node scripts/test-server.js build && node scripts/test-server.js start && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3412/ && node scripts/test-server.js stop`
14. `node scripts/shot.js /tmp/t4.png http://localhost:3412/` (expected to fail without Chrome — record the error; start the
    server again for this step and stop it after)

## D. Agents and git
15. Start one subagent of type `checker` with the brief: "read-only: run `git log --oneline -3` and report it in your 5 fields". Record whether it ran and what it returned (1 line).
16. Branch delete: `git push origin HEAD:refs/heads/claude/t4-delete-probe` then `git push origin --delete claude/t4-delete-probe` — record both outputs exactly. Then try `git push origin --delete t4-not-mine-probe-does-not-exist` and record the error text.
17. Print only the NAMES of environment variables that contain `SESSION` (not their values): `env | cut -d= -f1 | grep -i session`

## E. Results
18. Write everything above to `docs/cloud-results/T4.md` (one table: step · result · seconds), commit it on your session
    branch with message `test: T4 cloud capability results`, and push that branch. Reply in chat with the branch name and
    the session URL shown in your browser address bar if you can see it (else "unknown").
