# Round instruction files — the master copies

**Git is the master of round instruction files** (owner ruling Q1, round B "housekeeping" 2026-09-27 — replaces the
ruling of 2026-09-26 question 5 = A, "the OneDrive file stays the master"):

- **A round not yet run** = branch `inbox`, folder `rounds/` (Javis puts it there through the GitHub web page or the
  phone — steps: `docs/CLOUD.md`). A cloud chat reads it there.
- **A round that is running** = this folder. Friday copies the file here at round open (skill `round-open`
  step 1) and deletes the `inbox` copy at round close (skill `round-close` step 6, owner ruling Q2).
- **A closed round** = git history: its file is deleted from this folder once the round is closed and nothing live
  points at it (owner 16/10, house round) — read it with `git show <close tag or commit>:docs/rounds/<name>`;
  the 74 files closed before 16/10 = `git show 90125650:docs/rounds/<name>` (`git ls-tree 90125650 docs/rounds/` lists them).
  Kept here although closed: files a live file still names (src comments).
- **OneDrive** `C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt WEB\` = Javis's drafting place, not a master.
  Friday never moves, edits or deletes files there.
- **Two copies differ** (OneDrive vs here, or `inbox` vs here) = the copy that ran is the record; Friday says in the
  report which copy ran and names the difference — never picks one silently.

History of this folder (what was copied in when, rounds B and C 27/09) = `git log -- docs/rounds/` · the text that told it = `git show 0ecdd4bf:docs/rounds/README.md`.

Secret scan before every commit into this folder: e-mail / token / password value / phone / bank-account-number
patterns — round B's scan (`_incoming/roundB/copy-pile1.js`): 0 values found (one Thai sentence containing the word
"secret" was read and is prose, not a value).
