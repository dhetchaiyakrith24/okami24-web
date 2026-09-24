---
name: okami24-handoff
description: ใช้กับโปรเจกต์เว็บ OKami24 เท่านั้น — ในรีโปนี้ "handoff" / /handoff = สกิลนี้ ไม่ใช่ anthropic-skills:handoff ของบัญชี · สรุปสถานะโปรเจกต์ทั้งหมดเป็นเอกสารส่งต่อ (handoff) เพื่อปิดแชทนี้และเปิดแชทใหม่โดยไม่เสียบริบท ใช้เมื่อเข้าเงื่อนไข .claude/TEAM_RULES.md 13.6 (ก)–(ง) เท่านั้น: (ก) จบรอบ (ข) เจ้าของพิมพ์ /handoff (ค) ก่อนเริ่มงานที่จะใช้เวลานาน (ง) แชทยาวจนจับต้นชนปลายไม่ถูก → บอกเจ้าของก่อน — ต้องตรวจของจริงในโปรเจกต์ก่อนเขียน ห้ามอ้างจากความจำในแชทอย่างเดียว
---

# /handoff — เอกสารส่งต่อสำหรับแชทใหม่

> ย้ายจาก `~/.claude/skills/handoff/SKILL.md` เข้ารีโป 2026-09-25 (รอบย้ายกฎ · คำตัดสินเจ้าของ 25/09 ข้อ 1) — เนื้อหาเดิมทุกบรรทัด เปลี่ยนแค่ชื่อสกิล คำอธิบาย และบรรทัดนี้

เจ้าของงาน (SMOGZ) อ่านโค้ดไม่ออก เอกสารนี้ต้อง**ซื่อสัตย์ยิ่งกว่าปกติ** เพราะ AI ตัวถัดไปจะเชื่อทุกคำในนี้ · **ภาษา: อังกฤษ** (13.11 · เจ้าของเคาะ 2026-09-17 RULES_INDEX แถว 7 — ข้อความที่เขียนใหม่เท่านั้น ห้ามย้อนแปลของเดิม) เขียนให้อ่านง่าย ไม่ใช้ศัพท์ที่ไม่อธิบาย · §16 ที่เจ้าของอ่านเองเขียนอังกฤษได้ Cowork แปลให้เจ้าของทุกครั้งที่รายงาน

---

## ขั้นที่ 1 — ตรวจของจริงก่อน ห้ามข้าม

ก่อนเขียนแม้แต่บรรทัดเดียว ให้รัน:

```
git status
git log -10 --oneline
git diff --stat
```

แล้วอ่านไฟล์เอกสารเดิมที่มีในโปรเจกต์ (เช่น `docs/HANDOFF.md`, `docs/*.md`, `README.md`) ถ้ามี

**กฎ:** ถ้าสิ่งที่จำได้จากแชทขัดกับสิ่งที่เห็นในโค้ด/git → **เชื่อโค้ด** และเขียนระบุไว้ในหัวข้อ "ข้อขัดแย้งที่พบ" ว่าเจออะไรที่ไม่ตรง

---

## ขั้นที่ 2 — เขียนเอกสารตามโครงนี้ ครบทุกหัวข้อ

หัวข้อไหนไม่มีข้อมูล ให้เขียนว่า "ไม่มี" หรือ "ไม่ทราบ" **ห้ามข้ามหัวข้อเงียบ ๆ**

```
# <Project> — HANDOFF · v<n> · <date>
Written: <date> · Based on: <git HEAD + what was actually checked>

## Conflicts found
<what the chat / older docs said that the repo contradicts — write "none" if none>

## 1. Current state
<what the project is, what it is built with, where it stands · folder · branch · HEAD · uncommitted files>

## 2. Done (working, verified)
## 3. Just done (this session)
## 4. Known broken / missing, not fixed yet
## 5. In progress (scaffolded, needs continuation)
## 6. Needed, not started
## 7. Questions for the owner (table: topic / known / unknown / what to answer)
## 8. Risks and things to watch (most dangerous first)
## 9. Do not tear down (owner-approved or working as intended)
## 10. Git — how mixed working-tree changes should be split into commits
## 11. Readiness per system (table: system / status / one-line reason)
## 12. What was mid-flight when the chat closed
## 13. Recommended next steps (ordered, with reasons)
## 14. Stop doing (things that waste time or add risk)
## 15. Project end state — full flow, marking which steps already work

## 16. Paste block for the next chat (copy-paste)
<exactly the six items in `.claude/agents/doc-keeper.md` (main commit · what the branch is ahead by ·
 open round and where it stopped · waiting on the owner · open questions · the verify baseline at the
 last close) · cap 15 KB · nothing else — rules, tools and verify commands live in §17, not here>

## 17. Standing rules and tools (not state — open when needed)

## First things the next chat should do
<3 items — the first must be "run git status + git log and compare with this file; if they differ, trust the repo">
```

---

## ขั้นที่ 3 — บันทึกเป็นไฟล์ ไม่ใช่แค่ตอบในแชท (2 กลไก ห้ามสับสน — RULES_INDEX แถว 72)

- **push ธรรมดา** (13.6 "ทุกครั้งที่ push") = **ไม่ใช้ skill นี้** · `doc-keeper` อัปเดตเฉพาะ §16 + บรรทัด 1 ตามสเปกใน `.claude/agents/doc-keeper.md`
- **handoff ตามเงื่อนไข (ก)–(ง)** = ใช้ skill นี้ เขียนทั้งฉบับตามโครงขั้นที่ 2 ลง `docs/HANDOFF.md` (สร้างโฟลเดอร์ `docs` ถ้ายังไม่มี) — ให้ `doc-keeper` เป็นคนเขียนถ้าเรียกได้ ตัวหลักเขียนเองเฉพาะเมื่อ doc-keeper ไม่ถูกเรียก
- ถ้ามีไฟล์เดิมอยู่ ให้คัดลอกเก็บเป็น `docs/archive/HANDOFF.<วันที่เดิม>-v<ฉบับเดิม>.md` (สร้างโฟลเดอร์ `docs/archive` ถ้ายังไม่มี — ฉบับเก่าทุกฉบับอยู่ที่นั่น ไม่วางใน `docs/` เจ้าของเคาะ 2026-09-17) แล้วค่อยเขียนทับ
- แล้วบอกเจ้าของว่า: ไฟล์อยู่ที่ไหน + วางบล็อกข้อ 16 ให้ในแชทเลยเพื่อ copy ได้ทันที

---

## กฎเหล็ก

1. **ติดป้ายทุกข้อสรุปด้วยชุดเดียวของ 13.10 ข้อ 9:** `[ตรวจแล้ว]` / `[เชื่อว่า]` / `[รอเจ้าของ]` — ห้ามเขียนสิ่งที่ยังไม่แน่ให้ดูเหมือนแน่ (ชุดเก่า "ตรวจแล้วจริง / ผมเข้าใจว่า / เจ้าของยังไม่ได้ยืนยัน" เลิกใช้ RULES_INDEX แถว 48)
2. **"ผ่าน QC เทคนิค" ≠ "เจ้าของอนุมัติ"** — ต้องเขียนแยกกันเสมอ
3. **ตัวเลขทุกตัวต้องบอกว่านับจากไหน** ถ้าตัวเลขสองชุดวัดคนละอย่าง ต้องเตือนว่าห้ามเอามาบวกกัน
4. **ห้ามซ่อนงานค้างใต้คำว่า "later" หรือ "ทีหลัง"** — ทุกอย่างที่ยังไม่ได้ทำต้องอยู่ในข้อ 4, 5 หรือ 6
5. **หัวข้อ "ควรหยุดทำ" ต้องมีของจริง** ไม่ใช่เว้นว่าง — ทุกโปรเจกต์มีสิ่งที่ทำต่อแล้วเสียเปล่า
6. ถ้าเซสชันนี้มีปัญหาเครื่องมือ (เบราว์เซอร์ค้าง, cache เก่า ฯลฯ) ให้บันทึกไว้ในข้อ 8 ว่าเป็นข้อจำกัดของเซสชัน ไม่ใช่บั๊กของโปรเจกต์
