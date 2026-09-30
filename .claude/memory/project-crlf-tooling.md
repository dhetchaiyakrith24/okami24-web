---
name: project-crlf-tooling
description: "บนเครื่อง Windows นี้ Edit/Write tool เขียน LF และเครื่องมือ Git Bash ตัด CR — working copy ของโปรเจกต์เป็น CRLF (core.autocrlf=true) · โค้ดที่มี backslash/regex/ไทย ห้ามผ่าน heredoc หรือ node -e"
metadata:
  type: project
---

**CRLF:** working copy = CRLF (`core.autocrlf=true` · git เก็บ LF) · ไฟล์ใหม่จาก Write tool = LF → `unix2dos -q <ไฟล์>` ก่อน `git add` ·
ด่าน `scripts/eol-check.js --staged` (pre-commit) จับให้ · `sed -n` / `head` / `cat` ที่ pipe บน Git Bash ตัด CR ทิ้ง — ประกอบไฟล์เสร็จแล้ว `unix2dos` ·
บนคลาวด์ (Linux) ไม่มี autocrlf — eol-check ข้ามกฎข้อนั้นเอง · กติกาเต็ม = `docs/HANDOFF.md` §17 บรรทัด "CRLF"

**Why:** เจ้าของไม่อยากเห็นดิฟ "แก้ทั้งไฟล์" จากการพลิก line ending (2026-09-11)

**shell:** โค้ดที่มี backslash/regex/ข้อความไทย ห้ามผ่าน bash heredoc หรือ `node -e` — `\s` ถูกลดเป็น `s` (บั๊ก `/s+/g` 2026-09-15) ·
backtick ในสตริงของ `node -e "..."` ถูกรันเป็นคำสั่ง (2026-09-23) → เขียนสคริปต์เป็นไฟล์ .js ด้วย Write tool แล้ว `node <ไฟล์>` ·
ข้อความไทยเข้า git (tag/commit) ผ่าน `-F <ไฟล์>` เท่านั้น

**How to apply:** ทุกครั้งที่สร้างไฟล์ใหม่หรือแก้ไฟล์ด้วยสคริปต์บนเครื่องนี้
