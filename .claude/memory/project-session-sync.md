---
name: project-session-sync
description: "ทุกแชทเปิดมามีบรรทัด session-sync จาก SessionStart hook (scripts/session-sync.js · รอบ C 2026-09-27) — STOP SIGN = บอกเจ้าของก่อนทำอะไร · RE-READ NOW = อ่านไฟล์กฎที่ระบุใหม่ก่อน · PROBE = รหัสตรงกับบรรทัด session-probe ไหม"
metadata:
  type: project
---

At every chat open (computer and cloud) the SessionStart hook `scripts/session-sync.js` fetches GitHub and fast-forwards a
clean branch that is only behind; otherwise it warns. Its lines arrive in the first context under `session-sync (…)`:

- `STOP SIGN …` → first line of the first reply, in Thai, before any work.
- `RE-READ NOW …` → the listed rule files changed on disk after the chat loaded them; Read them before working.
- `PROBE: this run wrote session-probe <code>` vs the `session-probe: <code>` line loaded with `CLAUDE.md` → same code =
  the hook ran before the rules loaded; different/none = rules loaded first (then RE-READ is what keeps the chat current).
- No `session-sync` lines at all = the hook did not run: say so, run `git fetch` + `git status -sb` by hand.

**Why:** round C opened a chat on the computer 16 PRs behind GitHub and it worked on old rules all chat (owner, 2026-09-27).
**How to apply:** read these lines before round-open step 2; see [[project-crlf-tooling]] for the other machine-specific note.
Test on 2026-09-27: this file itself was the "newer commit" the owner's next chat had to pull.
