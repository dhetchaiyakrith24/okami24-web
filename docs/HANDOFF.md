# OKami24 — HANDOFF · v29 · 2026-09-21 (skills round closed)

Written: 2026-09-21 (**v29** — **skills round closed**, tag `skills-done` · every earlier version (v1–v28) is under `docs/archive/`, the last one `HANDOFF.2026-09-18-v28.md`)

Based on: branch `checkpoint/phase-3.3.3` = skills round (skills-new · docs-pointer · team-guide · this file · RECOVERY row) · `origin/main` **`668a2d9`** (PR #38 = housekeeping round v2) · branch is ahead of main by exactly the commits §16 item 2 lists · working tree: clean

**Checked while writing [ตรวจแล้ว]:** `git fetch` + `git log` (main `668a2d9`, unchanged during the round) · the round touched no `src/` file (`git diff --stat origin/main -- src/` = 0 files) · tsc exit 0 · i18n contract 16 PASS / 0 FAIL · raw-chars 0 (`_incoming/skills-round/*.log`) · no file deleted (`git diff --diff-filter=D origin/main` empty) · verify baseline of the last full close = §16 item 6 (kept in one place, not here) · no test server was started

> **How to read:** every statement carries one of the three tags of ~/.claude/CLAUDE.md 13.10 #9 — **[ตรวจแล้ว]** (seen in the file/commit) / **[เชื่อว่า]** (reported, not verified) / **[รอเจ้าของ]** (needs the owner) — the older set "ตรวจแล้วจริง / ผมเข้าใจว่า / เจ้าของบอก" is retired (RULES_INDEX row 48) · **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"**
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **Thai on the site: `docs/THAI_STYLE.md` is the single source of truth** (rules only — §2 four layers · §3 locked words · §4 typing · §5 group ก/ข + typography mechanism · §6 open work). When to read it is decided in one place, skill `round-open` step 1 (where `~/.claude/CLAUDE.md` 13.9 points since 2026-09-20): only on rounds that touch site copy. Before→after examples and "considered, not done" live in `docs/THAI_STYLE_LOG.md` §6–§7 — open it only to cite a past ruling. (RULES_INDEX row 10, 2026-09-17)

---

## ข้อขัดแย้งที่พบ / บทเรียน (รอบ 30.4ข ทั้งรอบ · ทุกข้อ [ตรวจแล้วจริง])

1. **ถ่าย before ให้จบก่อน build เสมอ** (ก้อน 2 เคยถ่ายผิด build) — ก้อน 3–5 ทำถูกทั้งหมด
2. **shot.js ห่อผล eval เป็น JSON สองชั้น** — สคริปต์วัดต้อง `JSON.parse` ซ้ำถ้าได้ string (k3-shots.js บรรทัดที่แก้)
3. **Git Bash ส่งอาร์กิวเมนต์ไทยให้ node ไม่ได้** (mangled) — ข้อความไทยสำหรับ override/variant ต้องมาจากไฟล์ (`k3-variant.js <json>` · `k4-shots.js --faq-file` · `k5-short.json`)
4. **grep `[ก-๙]` บน Git Bash เป็น byte-range ไม่ใช่ code-point** → false positive บนไฟล์จีน · checker ยืนยันด้วย Node `\u0E00-\u0E7F` แทน
5. **เขียน docs ให้นิ่งก่อนส่ง checker** — ก้อน 4 docs ขยับระหว่างตรวจ checker ตีกลับ "ไฟล์อื่นเปลี่ยน" · ก้อน 5–ปิดรอบ ทำถูกแล้ว
6. **designer กับ checker เห็นต่างเรื่องตัดขอบคำ** (ก้อน 3 "ตอน \| นี้" · "บรรจุ \| สำเร็จ") → เจ้าของตัดสิน = แก้ทั้งคู่ด้วยการเรียงคำ ไม่ใช้ NBSP · หลัก: **ตัดกลางคำล็อก = แก้ · ตัดขอบคำ = รับได้**
7. **"ไม่เผาไหม้" ไม่ได้อยู่ในตารางห้ามแยก แต่มีคำตัดสินเจ้าของ 2026-09-12 ใน THAI_STYLE** → เจ้าของสั่งกวาดทั้งเว็บ 3 ภาษา + "เปลี่ยนจากบุหรี่มวน" (คำอ้างเลิกบุหรี่) — ตอนนี้บันทึกเป็นข้อห้ามใน §3 แล้ว
8. **zh "正品保证" มี 保证 (การันตี)** — checker จับ · แถบใช้ "正品" · tagline จีนที่เคาะแล้วยังใช้ 正品保证 (ไม่แตะ)
9. **The `/about` `within` exception is not a template** — rule and gate live in THAI_STYLE §5 (group ก row) and checker.md item 5; the "ไม่ | ปั่นราคา" break in the trust strip therefore had to be fixed with wording, not a joiner → waiting on the owner (RULES_INDEX row 57: rule text removed here, pointer kept)
10. **Cowork merge เร็ว** — PR #30/#31/#32 merge ระหว่างทำก้อนถัดไป · `git fetch` ก่อนสรุปทุกครั้ง

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านพอต **OKami24** · Next.js 16 + TS + Tailwind v4 + SQLite · โฟลเดอร์ `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` = รอบสกิล (skills-new · docs-pointer · team-guide · docs ปิดรอบ · RECOVERY) · **live `main` = ค่าเดียวใน §16 ข้อ 1** (ไม่เขียนซ้ำที่นี่ — RULES_INDEX แถว 28) · นำหน้า main = §16 ข้อ 2 · push แล้ว รอ Cowork merge — ไม่แตะ src/ ไม่ต้อง deploy
- **รอบ 30.4ข = จบ live ทั้งหมด** · **รอบเก็บบ้าน ฉบับ 2 = จบ (tag `housekeeping-done`)** · **รอบสกิล = จบ (tag `skills-done`) — ประวัติรอบเก็บบ้านเต็ม: `docs/archive/HANDOFF.2026-09-18-v28.md`** · ถัดไปตาม §5.2: SEO → บทความ → ข้อมูล → ตะกร้า
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) → ไลน์ `@okm24` · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 · น้ำยา 0
- **checkpoint/จุดกลับ:** tag `skills-done` (ปิดรอบสกิล) · `housekeeping-done` · `pre-housekeeping` · `r30-4b-done` · `lang-done` — รหัส 7 ตัวของทุก tag อยู่ตาราง `docs/RECOVERY.md` §2 ที่เดียว (RULES_INDEX แถว 28) · รายก้อนรอบ 30.4ข: `docs/archive/HANDOFF.2026-09-18-v28.md` §1

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว) — รอบ 30.4ข

- **ก้อน 1 `6ded138` (live)** หัวข้อ K1–K3 · H2 หน้าแรกตัด max-w · /compare ตัวบอกเลื่อน + หัวแถว 12px ≥lg
- **ก้อน 2 `dea2a1e` (live)** บรรทัดสเปกเด่นบนการ์ดทุกที่ จาก verified เท่านั้น 38/53 (`card-headline-spec.ts` · dictionary `catalog.card*`)
- **ก้อน 3 `f83b8f1` + `e014b8a` (live)** คำโปรย 6 หมวด th+en (meta ด้วย) · กวาด "ไม่เผาไหม้"/"เปลี่ยนจากบุหรี่มวน" 3 ภาษา · brands UWELL/JOIWAY/IQOS · คำล็อก "อุ่นยาสูบ"
- **ก้อน 4 `1965393` (live)** FAQ eyebrow "ถาม-ตอบ"/"问答" · /search eyebrow = footer.tools
- **ก้อน 5 `1f55dee` (live)** `TrustBar.tsx` เหนือ footer ทุกหน้า · `trust.items[4]` 3 ภาษา · แบบแถว มือถือไอคอนบน
- **ปิดรอบ + ก้อน 6 `14dbbe5` (live PR #33) · ก้อน A `150609b` `0b7f695` (live PR #34)** sticky หัวแถว /compare · ลิงก์ "แหล่งที่มา" hover สว่าง+ขีด · wordbreak-scan 14 หน้า (FIXED 1 · NEW 2)
- docs ทุกก้อน: THAI_STYLE_LOG §7 ตารางต่อก้อน · LAUNCH_AUDIT หัว + ข้อ 44 · HANDOFF §16 ทุก push

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-17 ดึก · รอบเก็บบ้าน ฉบับ 2 · แชท A · ไม่แตะ `src/` เลย · ประวัติรอบ 30.4ข ทั้งหมดอยู่ `docs/archive/HANDOFF.2026-09-17-v26.md` §2–§3)

| ขั้น (ตามไฟล์คำสั่ง) | ทำอะไร | ตัวเลข/หลักฐาน | สถานะ |
|---|---|---|---|
| 4.1 agent 3 ตัว | `.claude/agents/rule-auditor.md` (opus · Read/Grep/Glob) · `scope-auditor.md` (sonnet · +WebFetch) · `doc-keeper.md` (sonnet · Read/Grep/Glob/Edit/Write · เขียนได้เฉพาะ `docs/`) — เงื่อนไขเรียกข้อเดียวอยู่บรรทัดแรกของ description + บรรทัดแรกของเนื้อหา · ภาษาอังกฤษ (13.11) | 3 ไฟล์ใหม่ · **ใช้ได้ทันทีในแชทที่รันอยู่** (ตรวจแล้ว 2026-09-17 — RULES_INDEX แถว 25) | ทำแล้วรอตรวจ |
| 1 แยก THAI_STYLE | `docs/THAI_STYLE.md` 1009 บรรทัด / 357,843 ไบต์ → **171 บรรทัด / 68,526 ไบต์** (กฎล้วน) + `docs/THAI_STYLE_LOG.md` **855 บรรทัด / 292,354 ไบต์** (§7 ทุกรอบ + §6 "พิจารณาแล้วไม่ทำ") · เลข § คงเดิมทั้งสองไฟล์ · THAI_STYLE §7 เหลือ stub ชี้ LOG · โน้ต 1 บรรทัดที่หัวไฟล์ · thai-copy.md ชี้ LOG แล้ว | 171 + 855 = 1026 ≥ 1009 (เพิ่ม 17 บรรทัดหัว/stub) · ทุกช่วงบรรทัดเดิม `diff` = 0 | ทำแล้วรอตรวจ |
| 2 HANDOFF §16 | วัดก่อน: §16 = 9,496 ไบต์ / 31 บรรทัด · ทั้งไฟล์ 32,661 (ไม่เกิน 15 KB) → เขียน §16 ใหม่เหลือ 5 อย่าง + ย้ายกติกา/เครื่องมือ/verify/git (13 บรรทัด ไม่ลบ) ไป **§17 ใหม่** · บรรทัด 1 มีเลขฉบับ+วันที่ · บล็อกเขียน "docs/HANDOFF.md §16" | วัดหลัง: ดู §16 | ทำแล้วรอตรวจ |
| 3 archive | `docs/archive/` ← `git mv` HANDOFF v1–v25 (25) + STATUS_2026-09-06 + NIGHT_REPORT 09-05/09-06 = **28 ไฟล์** + สำเนา v26.1 ของฉบับนี้ · **ไม่ย้าย 3 ไฟล์เพราะยังถูกอ้าง:** PROJECT_HANDOFF.md (LAUNCH_AUDIT บรรทัด 76) · PAGE_COPY_2026-09-06.md (LAUNCH_AUDIT 47 + `src/` 3 ไฟล์) · IMAGE_AUDIT.md (IMAGE_SPEC 79 + `package.json` audit:gaps เขียนทับ) | 6,835 บรรทัด / 1,274,090 ไบต์ ก่อน = หลัง · git เห็นเป็น rename 28 · delete 0 | ทำแล้วรอตรวจ |
| 10 ลบ `_incoming/30.4c` | ตรวจ `git ls-files _incoming/30.4c` = 0 · gitignored · ลบทั้งโฟลเดอร์ · **เก็บ `wb-diff.js` ไว้ที่ `scripts/wb-diff.js`** ก่อนลบ (เครื่องมือเดียวใน 30.4c ที่ §16 ยังใช้ · แก้ path ค่าเริ่มต้น 2 บรรทัด · eslint ผ่าน) · 30.4b / salthub / joiway / uwell ไม่แตะ | 1,645 ไฟล์ 265 MB · `_incoming` 1,600 → 1,336 MB | ทำแล้ว (เจ้าของสั่ง) |
| 9.1 tag | `lang-done` · `r30-4b-done` · `pre-housekeeping` (annotated · ชื่ออังกฤษ · ข้อความไทย · รหัสอยู่ `docs/RECOVERY.md` §2 ที่เดียว) · พบ tag เก่าในเครื่อง 3 ตัว (`pre-config-2026-09-09` `pre-30.1-2026-09-09` `pre-30.2-2026-09-10`) ยังไม่เคย push — remote มี 0 · **กติกาถาวรเพิ่มใน `~/.claude/CLAUDE.md` 13.7** (ไฟล์คำสั่ง 9.1 สั่งไว้ตรง ๆ · ไม่มีกฎ tag เดิมที่ไหนให้ลบ) | `git tag -n1` 6 ตัว · push ทั้ง 6 ตอน push | ทำแล้วรอตรวจ |
| 9.2 backup หยุด 10/09 | ดู §5.3 | — | รายงานแล้ว |
| 9.3 RECOVERY | `docs/RECOVERY.md` ไทย 1 หน้า 5 หัวข้อ (rollback Render · ตาราง tag · DB 3 ชั้น · ลิงก์ · ห้ามกด) | ยังไม่ซ้อมจริง (9.4 = Cowork+เจ้าของ) | ทำแล้วรอตรวจ |
| 0.3 + 5–8 (chat B, same chat) | 26 commits 247ff1e → dbeb36d: global CLAUDE.md 13.2/13.3/13.4/13.5/13.6/13.7/13.9/13.10/13.11 + §8:99 · handoff skill (English template, 13.6 conditions, §16 spec) · repo CLAUDE.md · THAI_STYLE + LOG · checker/designer/planner/researcher/writer/thai-copy/doc-keeper/rule-auditor/scope-auditor · catalog-research skill · AI_TEAM_GUIDE (9-row table) · HANDOFF (this file: one do-not-touch list, two-tier rule in §17, English for new text) · LAUNCH_AUDIT head + PROJECT_HANDOFF → archive · TEMPLATES.md · ROUND_COST.md · RULES_INDEX rows marked done + chain-10 record | 72/73 rows · row 60 waits for the owner · checker 10/10 after one send-back (chain-10 for 2 moved lines) · doc-keeper smoke test OK · tsc · commerce 16/16 · i18n 16/16 · raw-chars 0 | ทำแล้วรอตรวจ → checker ผ่าน |

**ตัดสินเองในเซสชันนี้ (ย้อนง่าย ลูกค้าไม่เห็น):** §6 ของ THAI_STYLE ย้ายเฉพาะบล็อก "พิจารณาแล้วไม่ทำ" — รายการค้าง 30.3/30.3ข/30.4 ที่มีข้อยังไม่ทำปนอยู่คงไว้ทั้งบล็อก (ไม่ซอยทีละบรรทัด) · เหตุผลที่ฝังในตารางกฎ §3/§5 คงอยู่กับตาราง · ไม่แก้ไฟล์ใน archive แม้อ้างพาธเก่ากันเอง (เป็นประวัติ) · LAUNCH_AUDIT ที่อ้าง "THAI_STYLE §7 รอบ …" ไม่แก้ (stub §7 พาไป LOG ได้ · LAUNCH_AUDIT = ขั้น 6 แชท B) · wb-diff.js ย้ายเข้า scripts/ (งานเกินคำสั่ง commit แยก)

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- ~~แถบความมั่นใจ ข้อ 2~~ **เจ้าของเคาะ 2026-09-17 ค่ำ = "…ที่ขายจริง ไม่ปั่นราคา" ใส่แล้ว (ก้อน A)** · **[รายงาน ไม่แก้]** zh ของโน้ตความเข้ากันได้ 2 ข้อ (coil-53/55/74) ยังเป็นอังกฤษ — `CompatibleProducts` มี overlay ไทยเท่านั้น → รอบภาษาจีน
- **[รอเจ้าของ] footer.tagline ซ้ำ 3 คำกับแถบ** — เสนอ "OKami24 — พอตทุกแบบ และน้ำยา จากคนขายที่รู้จักสินค้าจริง ซื้อแล้วยังดูแลต่อ" (+en/zh · zh tagline ยังใช้ 正品保证) — tagline เคาะแล้ว 30.3 E-2
- **[ตรวจแล้วจริง] รอบข้อมูล:** Coil-72 Vmate Infinity + Coil-89 Jellybox V อยู่หมวดคอยล์แต่คำเรียก "หัวพอต" (LAUNCH_AUDIT 44) · 6 ตัวการ์ดแถวว่าง (สเปกไม่ verified) · `ProductHero.tsx` stats ไม่เช็ค verified · TPD VINCI S/G3 mini
- **[ตรวจแล้วจริง] รอบเก็บบ้าน:** `PuffCount.tsx` dead · `search.eyebrow` ลบแล้ว (ก้อน 4) · คอมเมนต์ `categories.ts:83` "without combustion" (ไม่ใช่ข้อความเว็บ) · en ก้าน TEREA/น้ำยา ภาษานักพัฒนา (หน้า 0 สินค้า)
- **[ตรวจแล้วจริง] จีน/ตะกร้า:** /favorites zh eyebrow 已收藏⊂收藏 · สถานะคำสั่งซื้อ eyebrow⊂H1 3 ภาษา (LAUNCH_AUDIT 44) · ข้อ 49 หน้าบริการ = รอบตะกร้า
- **[ตรวจแล้วจริง] ระดับ B ในสแกน** (`wb-close.log` 30+ รายการก่อนรอบ: คำโดดบนการ์ด · ชื่อรุ่นอังกฤษข้ามบรรทัด) — เจ้าของสั่งไม่ไล่แก้ · designer ก้อน 2 ธง M Bar 10K/Muro 3ML ซ้ำสเปก → รอบ copy
- **#31 #34 → เจ้าของเช็ค iPhone** · `priority` 2 จุด · `th.ts` dead strings · FAQ วิจัยซ่อน · คอมเมนต์ `relx.ts:19`

---

## 5. รอสานต่อ

### 5.1 **[closed 2026-09-18 — every step done, tag housekeeping-done; details in §3 and docs/RULES_INDEX.md]** รอบเก็บบ้าน ฉบับ 2 (เปิด 2026-09-17 · ไฟล์คำสั่ง `Desktop\Run prompt\New prompt on work\รอบเก็บบ้านคำสั่ง-ฉบับ2.txt` · 2 แชท)
- **แชท A จบ (ฉบับนี้):** 4.1 · 1 · 2 · 3 · 10 · 9.1–9.3 → push → handoff — รายละเอียด §3
- **แชท B (ทำต่อในแชทเดิมได้ — agent ใหม่ใช้ได้ทันที):** ขั้น 0 `rule-auditor` อ่านกฎทุกไฟล์ → `docs/RULES_INDEX.md` (1 กฎ 1 แถว · ขัดกัน/ตายแล้ว/ทับซ้อน/กำกวม) → **หยุดรายงาน ห้ามแก้กฎเอง** → 0.2 เคาะ (≤40 แถว/ครั้ง · ข้อใน `~/.claude/CLAUDE.md` เจ้าของเคาะทุกข้อ) → 0.3 แก้ตามที่เคาะ 1 commit/ไฟล์ → 4.2 ตัดบล็อก "มาตรฐานใช้กับทุกตำแหน่ง" ที่ซ้ำ 13.10 คำต่อคำใน planner/designer/researcher/writer (checkpoint ก่อน · ยิงงานเล็กทดสอบ) → 5 AI_TEAM_GUIDE (2 บรรทัดขัดกัน · model inherit · เพิ่ม thai-copy + 3 ตัวใหม่ + คอลัมน์ "เรียกเมื่อไหร่") → 6 LAUNCH_AUDIT ตรวจอย่างเดียว → 7 `docs/TEMPLATES.md` (แม่แบบคำสั่ง ≤200 บรรทัด + รายงาน 4 บรรทัด) → 8 `docs/ROUND_COST.md` (3 รอบย้อนหลัง + เพดาน) → push → ปิดรอบ = tag + push tag (13.7)
- Candidates raised during chat A were all confirmed by rule-auditor and are in `docs/RULES_INDEX.md` (rows 1, 25, 27, 24) — 13.5 and the handoff skill's archive path were ruled by the owner on 2026-09-17 and are done; the "agent needs a new session" claim was dead (rows 26/27 closed here, RULES_INDEX is the single register).
- ~~รอบ 30.4ข~~ **จบ 2026-09-17** (ประวัติ: `docs/archive/HANDOFF.2026-09-17-v26.md` · ตารางประโยค: THAI_STYLE_LOG §7)

### 5.2 ลำดับถัดไป (เจ้าของสั่งไว้)
~~รอบเก็บบ้าน~~ (แชท A จบ · แชท B ถัดไป — PuffCount dead · ProductHero verified ยังอยู่ในรายการเก็บบ้าน ไม่ได้อยู่ในฉบับ 2 → ถามเจ้าของตอนปิดรอบ) → รอบ SEO (`03-รอบ SEO.txt` · JSON-LD description legacy 35 หน้ายังอังกฤษ · alt แกลเลอรี · แยก meta จากคำโปรยถ้าจำเป็น) → รอบบทความ → รอบข้อมูล (verify สเปก · taxonomy Coil-72/89 · TPD) → รอบตะกร้า (+ข้อ 49 · สถานะคำสั่งซื้อ eyebrow) → ข้อ 45 → แอดมิน → QR → ข้อ 42 · 47/48 → รอบการขาย · รอบ label (`compare.rowDrawStyle`) · รอบ meta/tagline

### 5.3 ผลตรวจ 9.2 — สำรอง DB "หยุด" ตั้งแต่ 2026-09-10 18:32 [ตรวจแล้วจริง]
- **ไม่มี scheduled task / npm script ที่ตั้งเวลา** — ตัวสำรองฝังอยู่ในเซิร์ฟเวอร์เว็บเอง: `src/instrumentation.ts` → `src/lib/backup/scheduler.ts` สำรอง 15 วินาทีหลังเปิด server แล้วทุก 360 นาที **ตราบที่ server เปิด** (`docs/BACKUP.md` "ทำงานอัตโนมัติยังไง")
- **สาเหตุ:** ตั้งแต่ 10/09 ไม่มี server ในเครื่องนี้รันโดยเปิด backup — ทุก QC server ตั้งแต่รอบ 30.2 เปิดด้วย `OKAMI24_BACKUP_DISABLED=1` + `OKAMI24_DATA_DIR=<tmp>` **โดยตั้งใจ** (ไม่ให้ QC แตะ DB จริง — คำสั่งใน §17) และเจ้าของไม่ได้รัน `next dev` พอร์ต 3000 หลัง 10/09 18:32 · หลักฐาน: `.data/okami24.db-shm` mtime = 2026-09-10 18:32 ตรงกับ backup สุดท้าย · `backup.log` 30 แถว integrity=ok ทุกแถว ไม่มี FAILED = **ไม่ใช่ของพัง** ไม่มีอะไรให้เจ้าของกด
- **สำเนาในเครื่องเป็น DB ทดสอบ** (orders=3 ตั้งแต่ 05/09 · `.data/okami24.db` 4 KB + WAL 1.3 MB) ไม่ใช่ DB ลูกค้า
- **production:** `render.yaml` ตั้ง `OKAMI24_DATA_DIR=/var/data/app-data` + `OKAMI24_BACKUP_DIR=/var/data/backups` บนดิสก์ `okami24-data` (1 GB) · `npm start` รัน scheduler ตัวเดียวกัน → สำรองเองทุก 6 ชม. เก็บ 60 ชุด **บนดิสก์เดียวกับต้นฉบับ** (LAUNCH_AUDIT ข้อ 42 · เจ้าของรับ snapshot รายวันของ Render เป็น backup หลัก 2026-09-07) · **[ไม่ยืนยัน]** วันนี้รันจริงไหม — ต้องดู log Render บรรทัด `[backup]` หรือ `ls /var/data/backups` (Cowork) · ตะกร้าปิด ออเดอร์ไม่เข้า DB จึงยังไม่เสียหาย แต่ต้องยืนยันก่อนเปิดตะกร้า (ข้อ 44)

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย
Same as `docs/archive/HANDOFF.2026-09-15-v22.md` §6 (ข้อ 44 · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง)

## 7. คำถามที่เจ้าของต้องตอบ

| เรื่อง | รู้แล้ว | ต้องตอบ |
|---|---|---|
| ~~แถบข้อ 2~~ | ตอบแล้ว = ใช่ · ใส่แล้วก้อน A | — |
| footer.tagline ตัด 3 คำซ้ำ | เสนอไว้ §4 | ใช่/ไม่ (รอบ tagline) |
| ~~ลบภาพ `_incoming/30.4c` 265 MB~~ | เจ้าของสั่งลบ 2026-09-17 · ลบแล้ว (ขั้น 10) | — |
| ย้าย PROJECT_HANDOFF.md · PAGE_COPY_2026-09-06.md · IMAGE_AUDIT.md เข้า `docs/archive/` | ยังถูกอ้าง (§3 ขั้น 3) จึงไม่ย้าย · IMAGE_AUDIT ยังถูก `npm run audit:gaps` เขียนทับ = ยังใช้งาน ไม่ควรย้าย | ย้าย 2 ไฟล์แรกไหม (แนะนำ: ย้ายในแชท B หลังแก้โน้ต LAUNCH_AUDIT 47/76 · IMAGE_AUDIT คงไว้) |
| ~~13.5 "ผู้แก้ไฟล์คนเดียวคือตัวหลัก" กับ doc-keeper~~ | answered — owner amended 13.5 on 2026-09-17 (doc-keeper writes docs/, add-only; RULES_INDEX row 26) | — |
| ~~`~/.claude/skills/handoff/SKILL.md` line 71~~ | answered — points at `docs/archive/` since 2026-09-17 (RULES_INDEX row 27) | — |
| Still waiting, same as `docs/archive/HANDOFF.2026-09-16-v24.md` §7 | TPD · #31/#34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 | |

## 8. ความเสี่ยงและจุดต้องระวัง

### 8.0 กฎ 2 ชั้น + ที่ตกผลึกรอบนี้
- **Tier A (text only) / tier B (touches structure or screen) / round close** — the full definition is in §17 "Two-tier rule" (merged there 2026-09-17 from THAI_STYLE §6 and `docs/archive/HANDOFF.2026-09-15-v21.md` §8, RULES_INDEX rows 30/68) · every batch of round 30.4ข was tier B (owner order) · shoot **before** on the old build, finish it before rebuilding · one Chrome job at a time
- **Tier B: the owner sees the screenshot before the commit · tier A: no screenshot needed** (13.7 (ข) — RULES_INDEX row 9) — proposals can be shown as DOM overrides on one build (k3-variant · k4-shots --faq-file · k5-shots --variant/--short), cheaper than a rebuild, but the final shots must be retaken on the real build before close
1. **ตัวเลขบนหน้าเว็บต้องชี้แถวสเปก verified ได้** — `card-headline-spec.ts` แบบอย่าง · brands JOIWAY ตัดเลขพัฟเพราะ unverified · RELX คงเพราะ verified
2. **NBSP/U+2060 เฉพาะตอน render** (`thai-typography.ts`) · ด่าน `thai-raw-chars-check.js` 0 · en/zh text node ไทย 0 (`shot.js --cookie okami24_locale` + eval — curl ใช้ไม่ได้ SSR ไทยเสมอ) · the `/about` `within` exception: THAI_STYLE §5 + checker.md item 5 (RULES_INDEX row 57)
3. **`thaiTypography()` ต้องมี locale guard** · dictionary ผ่าน LocaleProvider (TrustBar ได้อัตโนมัติ)
4. **Cowork merges without saying so** → `git fetch` before summarising (merge / deploy / force-push rules: `~/.claude/CLAUDE.md` §8 + 13.7 only — RULES_INDEX row 45)
5. **Context rule:** stated once, in §17 (RULES_INDEX row 54)
6. **"Unverifiable = unsaid, in every language" and the forbidden-claims list** now live in one place: THAI_STYLE §3 "คำ/ประโยคที่ห้ามในข้อความใหม่" (RULES_INDEX row 56)
7. **สคริปต์ที่ generate หลักฐานต้องจำลอง logic ของ component ครบ** · ข้อความไทยส่งเข้าสคริปต์ทางไฟล์เท่านั้น

## 9. ห้ามรื้อ
Do-not-touch list is kept in one place: §17 "Do not touch" (merged 2026-09-17, RULES_INDEX row 55) — it includes everything that used to be listed here (round 30.4ข deliverables: THAI_STYLE_LOG §7 "รอบ 30.4ข ก้อน 1–5" and "ปิดรอบ" rows · `card-headline-spec.ts` rules · dictionary `catalog.card*` · `trust.*` (set ก, owner-approved) · `TrustBar.tsx` row layout / 4 icons · sticky th on /compare · `ScrollHintFrame` · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools) plus what `docs/archive/HANDOFF.2026-09-16-v24.md` §9 listed

## 10. Git
See §16 items 1–2 for main / branch state (hashes are kept in one place — RULES_INDEX row 28) · never merge yourself

## 11. ความพร้อมแต่ละระบบ
Same as `docs/archive/HANDOFF.2026-09-15-v22.md` §11 · ภาษาไทยทั้งเว็บ: 30.4ค ปิดครบ · **30.4ข ปิดครบ** · การ์ดสินค้า: บรรทัดสเปกเด่น 38/53 · แถบความมั่นใจทุกหน้า 3 ภาษา

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท
- ไม่มีงานค้างกลางทาง · รอบเก็บบ้าน แชท A จบ · push แล้วรอ Cowork merge (docs/agents/scripts เท่านั้น — ไม่ต้อง deploy ก็ได้ ไม่มีอะไรเปลี่ยนบนเว็บ)
- server ไม่ได้เปิดเลยในแชทนี้ (verify:catalog --full build เอง) · ไม่มี process ค้าง
- เครื่องมือรอบ 30.4ข ยังอยู่ `_incoming/30.4b/` (gitignored 31 MB · รายการดู archive v26 §12) · `_incoming/30.4c` ลบแล้ว

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)
1. Paste the §16 block → `git fetch` → if main has moved past `f7600dd`, the round close (PR after #37) is merged; nothing to probe on the live site (src/ untouched)
2. **The housekeeping round is closed.** Do not start the next round on your own — wait for the owner to open it (§5.2 says SEO is next); when it opens: scope-auditor once, instruction file from docs/TEMPLATES.md (ก), read-list per 13.9 (THAI_STYLE only because SEO touches copy)
3. 9.4 rollback drill is the owner + Cowork's (docs/RECOVERY.md §1) — not Code's

## 14. ควรหยุดทำ
- Everything not to do is listed once in §17 "Do not touch" (merged 2026-09-17, RULES_INDEX row 55) — the items that were here: no whole-site screenshots before a scan · no joiner/NBSP outside the list · no two Chrome jobs at once · no fixing tier-B orphan words one by one · no placeholder in an empty spec row · no change to CategoryLabel / label-lang / lg:min-h-10

## 15. ปลายทางของโปรเจกต์
Same as `docs/archive/HANDOFF.2026-09-15-v21.md` §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste) — เก็บแค่ 6 อย่าง: main · branch นำหน้าอะไร · รอบไหนค้างตรงไหน · รอเจ้าของ · คำถามค้าง · verify baseline ตอนปิดรอบล่าสุด (ข้อ 6 เพิ่ม 2026-09-21 เจ้าของสั่ง) (เพดาน 15 KB · กติกา/เครื่องมือ = §17)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Read first: the single list is step 1 of skill round-open (.claude/skills/round-open/SKILL.md — 13.9 points there since 2026-09-20; opening a round = that skill, closing = round-close, touching site copy = thai-check)

1 main: 668a2d9 (PR #38 merged into origin/main, unchanged during the skills round) [ตรวจแล้ว] per `_incoming/skills-round/checker-1-findings.txt` item 1 · tags: skills-done = this round's close · housekeeping-done · pre-housekeeping (hashes only in docs/RECOVERY.md §2 / git tag -n1) · git fetch before trusting this · never merge yourself
2 branch checkpoint/phase-3.3.3 is ahead of main (668a2d9) by the skills round: `eb7d2cc` skills-new · `8404812` docs-pointer · `edd1006` team-guide · + this round-close commit (doc-keeper's HANDOFF §16 + ROUND_COST edit, to be tagged `skills-done`) · + a fifth commit adding the RECOVERY tag row — push after checker passes, waiting for Cowork to merge · src/ untouched [ตรวจแล้ว] (`git diff --stat origin/main -- src/` = empty, checker-1-findings.txt item 7), nothing to deploy
3 open round: **none — skills round closed, tag `skills-done`** (three project skills `.claude/skills/{round-open,round-close,thai-check}/SKILL.md` live · moved texts replaced by pointers in ~/.claude/CLAUDE.md, this file, checker.md · chain-10 record = RULES_INDEX rows 74-79, all marked ทำแล้ว) · a new round starts only when the owner opens it, step 1 = skill `round-open`
4 waiting on the owner: 9.4 rollback drill (Cowork + owner, off-hours) · which round to open next · older, unchanged: footer.tagline ตัด 3 คำซ้ำ (รอบ tagline) · zh โน้ตความเข้ากันได้ 2 ข้อ (รอบภาษาจีน) · TPD · #31 #34 iPhone · ผลเฝ้า Render OOM · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 · from the skills round close (2026-09-21), two rulings needed: (a) may `13.x` numbers of ~/.claude/CLAUDE.md and "HANDOFF §16/§17" stay as anchors inside a skill even though the round bans section numbers — anchors found: 13.2, 13.4, 13.5, 13.6, 13.7, 13.9, 13.10 #15 (RULES_INDEX row 77 note + checker-1-findings.txt item 2) (b) ~~verify pass-counts dropped from §17~~ **ruled 2026-09-21: they live in §16 item 6 "verify baseline at last close" (spec added to doc-keeper.md; RULES_INDEX row 78 updated)**
5 open questions: does production really back up every 6 h to /var/data/backups today? [เชื่อว่า] per render.yaml — Cowork to check the Render log for "[backup]" (HANDOFF §5.3) · the memory files under ~/.claude/projects/.../memory/ were not audited by rule-auditor — candidate for the next housekeeping round · LAUNCH_AUDIT is 201 KB with 15/49 rows closed — a split (closed rows + "ประวัติรอบก่อน" → LAUNCH_AUDIT_DONE.md) is proposed, not done · skills round: the main agent swapped instruction-file steps 2 and 3 (ran the Skill-tool invocation test before deleting the originals, per the file's own "if a skill cannot be called, stop and do not delete more") [เชื่อว่า] per brief, order recorded in `_incoming/skills-round/skill-invocation-test.md` — owner may want to confirm this order stands for future rounds · same file: a freshly written skill can answer "Unknown skill" until one more file-change event (e.g. `touch`) reaches the watcher — worth knowing before the next skill is authored
  4b ไม่ต้องรอ — เจ้าของตัดสินแล้ว ห้ามถามซ้ำ: ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · tagline/ตะกร้า/หน้าบริการ = รอบของมัน · CLAUDE.md แก้เฉพาะข้อที่เจ้าของเคาะ (ตรวจ/รายงานได้) · ใส่กฎใหม่ = ลบกฎเก่าเรื่องเดียวกันทุกที่ (ยกเว้น ~/.claude/CLAUDE.md §1–§11 ที่ห้ามแก้ — ใช้ข้อยกเว้นใน 13.9 แทน · RULES_INDEX แถว 12) · ชั้น 9 ก๊อปไฟล์นอกรีโปก่อนแตะ (ทำแล้ว) · ชั้น 10 รวม/ลบกฎต้องกางเต็ม · 30.4c ลบแล้ว
6 verify baseline at last close (the only place these counts live — a round that changes them writes the new ones here at its close; pass = what each script prints): verify:catalog --full 20/20 · verify:commerce 16/16 · i18n contract 16/16 · count-storefront 53 shown / 31 buyable · raw-chars 0 · scan.js 0 flagged across the sitemap — measured at the housekeeping-round close (2026-09-18, `_incoming/verify-catalog-housekeeping-A.log`), not re-run in the skills round (documents only, no test server) [ตรวจแล้ว then, unchanged since: src/ untouched]
(context rule · agents load immediately · tools · verify · git = §17 of this file)
```

---

## 17. กติกาและเครื่องมือประจำ (ย้ายออกจาก §16 2026-09-17 — ไม่ใช่สถานะ · เปิดเมื่อต้องใช้ · ย้ายทั้ง 13 บรรทัดไม่ตัด · แก้ path เดียว: wb-diff.js → scripts/)

```
Context rule: ~/.claude/CLAUDE.md 13.6 · every push = update §16 (spec in doc-keeper.md) · an agent added or edited under .claude/agents/ is usable at once in the running chat — no new session needed (verified 2026-09-17; the old "needs a new session / HANDOFF 8.6" claim is dead — RULES_INDEX row 25)
Two-tier rule (owner 2026-09-14 — merged here from THAI_STYLE §6 on 2026-09-17, RULES_INDEX rows 50/68; screenshot rule 13.6 points here): tier A = text only → no screenshots, no designer per batch · tier B = touches structure/screen → full: build → shoot before (finish before rebuilding) → shoot after at 390 + 1440 → designer → owner picks → checker → commit · round close = skill `round-close` (scan first, designer once, word-break fixes in one commit — moved there 2026-09-20, RULES_INDEX row 76) · details of the original ruling: §8.0 · every new sentence = 3 languages + owner approves the Thai · every number points at a verified spec row · no U+2060/NBSP outside the mechanism · thaiTypography() must have a locale guard · generated evidence must mirror the component logic in full · forbidden claims: THAI_STYLE §3 "คำ/ประโยคที่ห้ามในข้อความใหม่" (one list)
Do not touch (single list — merged 2026-09-17 from this line, §9 and §14, RULES_INDEX row 55): layout outside the named spot · images · motion · ordering-mode.ts · slug/URL/sitemap/structured data · service pages · Hero.tsx · cinematic/ · THAI_STYLE group ก · labelTh/name/shortName · lg:min-h-10 · age/nicotine warnings · colour/flavour names · thai-typography.ts list · CategoryLabel.tsx / label-lang · card-headline-spec.ts rules · dictionary catalog.card* / trust.* (set ก) · TrustBar row layout / 4 icons · sticky th on /compare · ScrollHintFrame · headings K1–K3 · locked word "อุ่นยาสูบ" · the ban on "ไม่เผาไหม้" in every language · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools · every THAI_STYLE_LOG §7 row of round 30.4ข · ProductHero stats / PuffCount / Coil-72/89 category (data round) · footer.tagline / service pages / cart (their own rounds) — and never: joiner/NBSP outside the list · two Chrome jobs at once · fixing tier-B orphan words one by one · placeholders in an empty spec row · screenshots without a scan first — the scan-first / ≤30-shots-or-explain rule lives in ~/.claude/CLAUDE.md 13.10 #15 (owner ruling 2026-09-18), not here
Hard rules: merge / deploy / force-push → ~/.claude/CLAUDE.md §8 + 13.7 (not restated here — RULES_INDEX row 45) · revert, never reset · never invent a number · deciding alone = easy to undo + invisible to customers, then write "ตัดสินเอง: … เพราะ …" · when to ask = 13.4 only (RULES_INDEX row 3) · work beyond the brief = its own commit
  · checker reports in the five fields of 13.5 + the Thai-copy gates = skill `thai-check` (checker.md item 5 points there; the checker reads the SKILL.md file — moved 2026-09-20, RULES_INDEX row 77) · who edits files = 13.5 (RULES_INDEX rows 13/52/58/59)
  · ปิด server: netstat -ano | grep ":3412.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด · Chrome ทีละงาน · งาน >10 นาที = (cmd &) + เฝ้า log
  · สคริปต์เขียนด้วย Write tool · ข้อความไทยเข้าสคริปต์ทางไฟล์ json/txt เท่านั้น (argv mangled) · shot.js ห่อผล eval JSON 2 ชั้น (parse ซ้ำ) · CRLF: ไฟล์ใหม่จาก Write = LF → unix2dos ก่อน git add · ตรวจ git ls-files --eol · Git Bash แปลง arg "/" → MSYS_NO_PATHCONV=1

เครื่องมือ (_incoming/30.4b): shot.js (scripts/) · k3-shots.js <before|after> [--only …] [--locale …] (ครอปหัวหน้า+วัดบรรทัด) · k3-variant.js <json> (ลองคำใหม่ไม่ต้อง build) · k4-eyebrow-pairs.ts · k4-shots.js <tag> [--faq-file f] [--search-file f] · k5-shots.js <tag> [--variant row|cards] [--short] [--only w] [--locale l] · k6-shots.js <tag> (sticky /compare + hover จำลอง) · k*-sheets.js (ภาพรวม before/after) · scripts/wordbreak-scan.js --base … --widths 390,1440 --out _incoming/30.4b/wb-<tag> /path… (MSYS_NO_PATHCONV=1) → node scripts/wb-diff.js <before> <after>
  · .claude/launch.json ("vapor-dev", port 3000) is the owner's own dev server — agents never start it (RULES_INDEX row 16) · test server: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: the full set with its commands = skill `round-close` step 3 (a batch runs the subset its checker gate needs) · pass = what each script prints · the counts last seen at a close = §16 item 6 "verify baseline at last close", not a rule text (moved 2026-09-20, RULES_INDEX row 78)
Git: commit split by type per 13.7 (English prefix feat/fix/copy/data/docs/chore/agents/rules) · git commit -F <file> · English · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push/merge/deploy rules = 13.7 (RULES_INDEX rows 2/14/45)
agent (เพิ่ม 2026-09-17): rule-auditor (opus · เรียกเมื่อเปิดรอบเก็บบ้าน/ก่อนเพิ่มกฎ · read-only) · scope-auditor (sonnet · เรียกเมื่อเปิดรอบ ครั้งเดียว · read-only) · doc-keeper (sonnet · เรียกเมื่อปิดก้อน · เขียนได้เฉพาะ docs/) — เงื่อนไขเรียกข้อเดียวอยู่บรรทัดแรกของแต่ละไฟล์ · ห้ามเรียกทุกหัวข้อย่อย
tag: command and sequence = skill `round-close` step 5 (rule in 13.7; name table in docs/RECOVERY.md §2 — moved 2026-09-20, RULES_INDEX row 75)
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -5 --oneline` + `git tag -n1`** แล้วเทียบกับ §16 — ถ้าไม่ตรงให้เชื่อ repo · if origin/checkpoint lacks the last commit of this file, the push failed → push (a standing right after checker, 13.7)
2. If main moved past the value in §16 item 1 = Cowork merged the skills round — nothing to probe on the live site (no `src/` change)
3. **No round is open.** The next one starts only when the owner attaches its instruction file → skill `round-open` (the three owner rulings pending are in §16 item 4)
