---
name: project-crlf-tooling
description: "บนเครื่องนี้ Edit/Write tool เขียน LF และ `sed -i` ตัด CR — โปรเจกต์ใช้ core.autocrlf=true (รีโปเก็บ LF, working copy CRLF) ต้องรัน `git ls-files --eol` ก่อน commit และแปลงกลับ"
metadata: 
  node_type: memory
  type: project
  originSessionId: 30070b4b-50fc-4938-aa9a-486b155821da
  modified: 2026-09-23T14:13:45.315Z
---

> **(ย้ายเข้ารีโป 2026-09-26)** ส่วน CRLF/perl = ประวัติเท่านั้น: กติกาที่ใช้จริง = `docs/HANDOFF.md` §17 บรรทัด "CRLF" (unix2dos · `git ls-files --eol` · `eol-check --staged`) — ขั้นตอน perl ด้านล่างเลิกใช้แล้ว · ส่วน heredoc / `node -e` / backtick (ท้ายไฟล์) = ความจำที่ยังใช้อยู่

ตรวจพบ 2026-09-11 (รอบ 30.3ข): ไฟล์ที่แก้ด้วย Edit/Write tool หรือ `sed -i` บนเครื่องนี้กลายเป็น LF ทั้งไฟล์ ขณะที่ working copy ของโปรเจกต์เป็น CRLF (`core.autocrlf=true` — รีโปเก็บ LF เสมอ) · git normalize ให้ตอน commit จึงไม่ทำให้ diff บวม (`git diff --stat` = `--ignore-cr-at-eol`) แต่เจ้าของต้องการ working copy สม่ำเสมอ

**Why:** เจ้าของกังวลว่าไฟล์ที่พลิก line ending จะขึ้นเป็น "แก้ทั้งไฟล์" ในดิฟรอบหน้า ตรวจไม่ได้ (2026-09-11)
**How to apply:** ก่อน commit รัน `git ls-files --eol <ไฟล์ที่แตะ>` → ไฟล์ที่เป็น `w/lf` ให้ `perl -pi -e 's/\r?\n/\r\n/' <ไฟล์>` แล้ว `git add --renormalize .` · สคริปต์ Node ที่แก้ไฟล์ให้แปลง `\r\n`→`\n` ก่อน match แล้วแปลงกลับตอนเขียน (แบบ `_incoming/30.3b/apply-*.js`) · ไฟล์ที่เป็น LF อยู่ก่อนแล้ว (`.claude/agents/thai-copy.md` · `docs/HANDOFF.2026-09-10-v17.md`) ไม่ต้องแตะ · ดู `.claude/TEAM_RULES.md` 13.4 (เดิมชี้ความจำ feedback-ask-level ซึ่งย้ายเข้ากฎแล้ว 2026-09-25)

**เพิ่ม 2026-09-15:** โค้ดที่มี backslash/regex/ข้อความไทยห้ามผ่าน bash heredoc หรือ `node -e` — `\s` ถูกลดชั้นเป็น `s` (บั๊ก `/s+/g` ใน ProductAnatomy.tsx checker จับได้ก่อน push) · ใช้ Edit/Write tool แล้วแปลง CRLF ด้วย node นับ `\r\n` = `\n` (grep `$'\r$'` เชื่อไม่ได้บนเครื่องนี้)

**เพิ่ม 2026-09-23 (รอบ 9):** ห้ามมี backtick ในสตริงของ `node -e "..."` บน bash — `` `docs/X.md` `` ถูกรันเป็นคำสั่ง
(bash ไปรันไฟล์ .md เป็นสคริปต์ บรรทัด `> **…**` สร้างไฟล์เปล่าชื่อแปลกที่รากโปรเจกต์ และ path หายจากข้อความ) · สคริปต์แก้เอกสารให้เขียนเป็นไฟล์ .js ด้วย Write tool แล้วรัน `node <ไฟล์>`

**เพิ่ม 2026-09-17 (รอบเก็บบ้าน):** `sed -n` / `head` / `cat` ที่ pipe ออกมาบน Git Bash ก็**ตัด CR ทิ้ง** — ประกอบไฟล์ใหม่จากช่วงบรรทัดของไฟล์ CRLF แล้วได้ mixed · `perl -i` กับ `$` ก็ไม่ match บรรทัด CRLF · ทางที่ใช้ได้จริง: ประกอบเสร็จแล้ว `unix2dos -q <ไฟล์>` (มีที่ /usr/bin) แล้วตรวจด้วย perl นับ `(?<!\r)\n` = 0 · ข้อความไทยส่งเข้า git (tag/commit) ผ่าน `-F <ไฟล์>` เท่านั้น
