---
name: feedback-remote-control-always
description: Owner wants Remote Control ON in every chat — turn it on at session start (set_remote_control self) if it is off
metadata:
  node_type: memory
  type: feedback
  originSessionId: 90828f7c-6a6c-4607-9e59-e9130f025eb3
  modified: 2026-09-24T22:52:45.869Z
---

Every chat the owner starts must have Remote Control on (owner, 2026-09-25: "ทุกแชทที่เริ่มขอให้มีคำสั่ง /remote-control เสมอ").

**Why:** the owner follows and steers sessions from phone / claude.ai, away from this PC.

**How to apply:** at the start of a session, if Remote Control is off, call `mcp__ccd_session_mgmt__set_remote_control` with `self`, `enabled: true` (load it via ToolSearch). The durable fix is the app's own "Remote Control default" preference — the owner sets that in the app's Code settings; this memory is the fallback. Related: [[feedback-full-file-paths]].
