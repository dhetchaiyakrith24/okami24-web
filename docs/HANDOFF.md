# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-16 (**ฉบับที่ 23** — รอบ 30.4ค ก้อน 7·8·9 เสร็จ+live · ขั้นปิดรอบเริ่มแล้ว (สำรวจ+กลไก typography เป็น WIP) · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-15-v22.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD **`d0ccd49`** (WIP typography) · `origin/main` **`f71b6a7`** (PR #26 = ก้อน 9) · branch นำหน้า main 1 (+docs ฉบับนี้) · working tree: เหลือ docs ที่ commit พร้อมไฟล์นี้

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** `git fetch` + `git status` + `git log` · build ท้ายสุด (`d0ccd49` โค้ด): tsc · eslint · `node scripts/thai-raw-chars-check.js` = 0 · render: NBSP/WJ ลง 27/27 จุดที่คาด · `<head>` 0 · JSON-LD 0 ทั้ง 105 หน้า · en/zh หลัง hydration 0 · size-pack 25.27 MiB · `_incoming/` **1.6 GB** (shots-close 104 ภาพ + crops-close 156 + wb/wb-typo JSON)

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]**
> **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"** — เขียนแยกเสมอ
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก (รวม 30.4ค ก้อน 1–9 = +33 คำ) · §5 กลุ่ม ก · §6 (typography/joiner) · §7 "รอบ 30.4ค" ทุกตาราง

---

## ข้อขัดแย้งที่พบ / บทเรียนเซสชันนี้

ทุกข้อ **[ตรวจแล้วจริง]**:

1. **กติกา context ใหม่ (เจ้าของ 2026-09-15 · แทน 600K/≤3 ก้อนทั้งหมด):** เจ้าของพิมพ์ handoff เมื่อเห็น ~800K (ครั้งนี้ 912K) → จบก้อนในมือ + push + §16 + ปิด · ไม่ต้องนับก้อนเอง ไม่ต้องแจ้งเอง · เซสชันนี้ทำ 3 ก้อน + ปิดรอบครึ่งทาง
2. **ตัวเลข "188 ไทยติดอังกฤษ" ของรายงาน SEO 09/09 = 0 จริง** — นับข้าม element ที่แยกบรรทัดกันอยู่แล้ว (`_incoming/30.4c/spacing-render-count.js`) → ก่อนตั้งเป้าจากตัวเลขรายงานเก่า ให้นับซ้ำจาก render เสมอ
3. **ถ่าย 104 ภาพให้ designer ดูตา = ช้า (2–3 ชม.) และ designer อ่านครอปเล็กพลาดได้** → เขียนตัวตรวจจุดตัดบรรทัดจาก DOM + ICU segmenter (`scripts/wordbreak-scan.js`) จับได้ตรงกับที่ designer เคยจดทุกจุด + เจอที่ตาพลาด · รอบหน้าใช้สแกนก่อน แล้วครอปเฉพาะจุดที่ธงให้ designer ยืนยัน
4. **Write/Edit tool แปลง `\u00A0`/`\u2060`/`\u0E00` ในโค้ดเป็นอักขระดิบ** → ไฟล์กลไกต้องสร้างอักขระด้วย `String.fromCharCode(0x…)` และช่วงไทยใช้ `\p{Script=Thai}` · ด่าน `scripts/thai-raw-chars-check.js` จับได้ (เจอ NBSP ดิบเดิมใน `CategoryLabel.tsx` จาก 30.3ข → แก้เป็น code point แล้ว)
5. **`git checkout -- <ไฟล์>` เพื่อถอนแถวที่เจ้าของไม่เอา** ต้องตามด้วย render-check ที่ตัดแถวนั้นออกจากสคริปต์ด้วย (ก้อน 9: 126 → 119) — ไม่งั้นตัวเลขไม่ตรง
6. **Git Bash แปลง argument ที่ขึ้นต้น `/` เป็นพาธ Windows** → `scripts/wordbreak-scan.js /products/x` จาก Bash จะกลายเป็นสแกนทั้ง sitemap · รันจาก PowerShell หรือใส่ `MSYS_NO_PATHCONV=1`
7. **Background Bash ของ tool มี timeout สูงสุด 10 นาที** → งานยาว (ถ่าย/สแกน) ต้อง `(cmd &)` แยก process แล้วเฝ้าด้วย Monitor/ไฟล์ log

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านพอต **OKami24** · Next.js 16 + TS + Tailwind v4 + SQLite · โฟลเดอร์ `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` HEAD `d0ccd49` (+docs ฉบับนี้) · **live `main` = `f71b6a7`** (PR #26 = ก้อน 9 · PR #25 = ก้อน 7–8) · branch นำหน้า main 1 commit = **WIP typography ยังไม่ผ่าน checker/designer — ห้าม merge จนปิดรอบ** (Cowork ต้องรู้)
- **รอบ 30.4ค:** ก้อน 1–9 เสร็จ ตรวจผ่านตามเกณฑ์ และ live ครบ · **ขั้นปิดรอบ = กำลังทำ** (ดูข้อ 5.1)
- **อังกฤษบนหน้าสินค้า (`_incoming/30.4c/english-fields-5.ts`): 36** = ค่าสเปกตัวเลข/หน่วย/ชื่อรุ่นล้วน คงตามกฎ · ชื่อสี 154/กลิ่น 191 ชั้น 1
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) → ไลน์ `@okm24` · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 · น้ำยา 0
- **checkpoint tags/จุดกลับ:** ก่อน 30.4ค = `ebd288b` · จบก้อน 1–6 = `6514577` · จบก้อน 7–8 = `0a73a84` · จบก้อน 9 = `98d8f5a` (= main f71b6a7) · WIP typography = `d0ccd49`

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว)

**[ตรวจแล้วจริง]** — ทั้งหมดใน v22 §2 + เพิ่ม:

- **ก้อน 7** (`db846c8` `1f2e4e7` `f1c1d3d` `604509a` `40aaefc`): กวาด "ที่สุด"/คำอวด ไทย+อังกฤษ+จีน · /technology ข้อเท็จจริงหัวพอต ARGUS (คอยล์ในตัว เปลี่ยนทั้งหัว — researcher) · PM label "ค่าโอห์ม" · โน้ตหลักฐานการ์ด compat 7 ข้อความไทย (`COMPAT_EVIDENCE_TH`) · G4 Pro 2.51" verified อีกครั้ง (meta description หน้าทางการ — เจ้าของเปิดเอง)
- **ก้อน 8** (`316b6d4` · ชั้น B designer+checker): ข้อ 36 CSS จุดเดียว `html:lang(th) .label-mono:not(:lang(en))` + `src/lib/label-lang.ts` ป้ายอังกฤษล้วนติด `lang="en"` (19 component) · Δ 0 px 17 คู่ · en/zh เดิม · "188" นับซ้ำ = 0
- **ก้อน 9** (`64ea336`): หนัก 2 113 → ยังอยู่ 59 → 56 ประโยคเสียงร้าน (3 แถวหน้าบริการถอนไปข้อ 49) · คำล็อก แนวการสูบ · เครื่องระบบสวิตช์ · coil-54/62 "หัวพอตเปล่า"
- **WIP `d0ccd49` (ยังไม่ผ่านตรวจ):** `src/lib/thai-typography.ts` แทน `thai-keep-together.ts` · `scripts/thai-raw-chars-check.js` · `scripts/wordbreak-scan.js` · wiring 20+ component (ดู 5.1)

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-15→16 · 10 commit · main ขยับ 2 PR)

| งาน | commit | ผลตรวจ |
|---|---|---|
| ก้อน 7 copy ×4 + data | `db846c8` `1f2e4e7` `f1c1d3d` `604509a` `40aaefc` | render 86/86 · checker ผ่าน · **live PR #25** |
| ก้อน 8 CSS | `316b6d4` | designer ผ่าน (ก1/ข1) · checker ผ่าน · **live PR #25** |
| docs 7/8 | `0a73a84` | — |
| ก้อน 9 copy + docs | `64ea336` `98d8f5a` | render 119/119 · checker ผ่าน · **live PR #26** |
| ปิดรอบ: สำรวจ | — (`_incoming/30.4c/`) | ถ่าย 52 หน้า×2 (`shots-close/before`) · สแกน 104 (`wb/` · `wb-summary.md`) · designer 2 คน 153 ครอป (`crops-close/`) · **รายการปิดรอบ `close-list.md`** · เจ้าของเคาะ 5 ข้อ (ดู 5.1) |
| ปิดรอบ: typography | `d0ccd49` **WIP** | tsc/eslint/gate ผ่าน · render: 27/27 · head 0 · JSON-LD 0 · en/zh 0 · **ยังไม่ checker · ยังไม่ designer · ยังไม่ถ่ายซ้ำ** |

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- **[ตรวจแล้วจริง] ช่อง 1 ของ `close-list.md` (แก้ด้วยข้อความ):** 1.1 "ไม่" ค้างท้ายบรรทัด 11 สตริง · 1.3 คำโดด tagline 8 · 1.4 พยางค์โดด 12 · 1.5 การ์ดสั้น 7 · 1.7 ธง (about eyebrow → ไทย · flavor-copy "ที่สุด" 2 · M Bar 15K "นานที่สุด" · "แบตเตอรี่ภายนอก"→"ถ่าน" 2 · PM "ไม่มี (เป็นหัวเปล่า…)" 2 · PM `:1155` → "คอยล์ nexMESH คู่ 1.2Ω (ในตัว)" [researcher: wotofo.com ยืนยัน nexMESH = ชื่อเทคโนโลยี dual = 2 ชุด] · eyebrow การ์ดคู่มือหน้าแรก → ไทย) — **thai-copy กำลังทำตอนปิดเซสชัน ยังไม่ส่ง** (brief `_incoming/30.4c/close-brief-thai-copy.md` · ถ้าไม่มีผลใน `_incoming/30.4c/` ให้สั่งใหม่จาก brief)
- **[ตรวจแล้วจริง] 1.6 หัวข้อ H1/H2 9 สตริง** (เจ้าของเปิดให้เสนอ · เงื่อนไข title/meta ใน brief) — ตารางแยก ≤10 แถว ยังไม่มา
- **[ตรวจแล้วจริง] ผลสแกนหลัง typography (บางส่วน 91 หน้า · `wb-summary-after-typography-partial.md`):** number-unit-split 8 → 3 (ที่เหลือคือหน่วยนอกรายการ: บาท · วัน · "4 | รุ่น" บน /compare /how-to-order /warranty — เสนอเจ้าของว่าจะเพิ่ม บาท/วัน/รุ่น เข้ารายการไหม) · compound-split 62 (ส่วนใหญ่ = B รับได้) · negation 17 (รอ copy 1.1) · single-word 87 (สแกน 91 หน้า รวม PM — ไม่เทียบกับ 56 เดิม)
- **[ตรวจแล้วจริง] ยังไม่ทำ:** ถ่ายซ้ำหน้าที่ designer ธง + designer ปิด (ชั้น B ของ typography+copy-close) · checker รวมปิดรอบ · docs ปิดรอบ (THAI_STYLE §7 ตารางปิดรอบ · LAUNCH_AUDIT 30 ปิด · HANDOFF §4.1 เคลียร์) · ลบภาพ `_incoming/30.4c/shots-k1/k5/k7/k8/shots-close` (1.6 GB — เจ้าของยังไม่สั่งลบ)
- **[ตรวจแล้วจริง] ข้อ 49 (ใหม่):** privacy OTP/ตะกร้า · FAQ ซ่อน · how-to-order 3 แถว → 30.4ข · **2D** H2 หน้าแรก max-width · **2E** /compare 390 คอลัมน์ 3 ถูกตัดไม่มีตัวบอกเลื่อน → 30.4ข · **2F** "1600MAH" mono ข้าง "พัฟ" sans → เจ้าของเลือกไม่แก้
- §4.1 #31 (vmate-i3 h3 ขอบขวา) · #34 (ค่าสเปก G4 Pro/KOKO) → **เจ้าของเช็ค iPhone เอง**
- ของเดิม v22 §4 ที่ยังอยู่: `priority` 2 จุด · taxonomy Coil-72/89 · `th.ts` dead strings · FAQ วิจัยซ่อน · คอมเมนต์ `relx.ts:19` · โครงหน้า "จดไว้ 30.4ข"

### 4.1 รายการตัดกลางคำ — สถานะหลังสำรวจปิดรอบ (แทนตาราง 31+3 เดิม)
`close-list.md` คือรายการทั้งหมด · สรุป: **หายแล้ว** #1 #15 #22 #25 #29 (ประโยคเปลี่ยนในรอบ) · **แก้ด้วยกลไก typography (WIP)** #2 #3 #28 + ตัดกลางคำ 3 จุด + "ๆ" · **รอ copy-close (ช่อง 1)** #5 #6 #9 #10 #14 #16 #17 #18 #19 #30 #32 #33 · **รับได้ (designer B)** #7 #8 #11 #12 #13 #20 #21 #23 #24 #26 #27 · **เจ้าของเช็ค iPhone** #31 #34 · #4 "กล่า|วอ้าง" = joiner (WIP)

---

## 5. รอสานต่อ (มีโครงแล้ว ต้องต่อยอด)

### 5.1 ขั้นปิดรอบ 30.4ค — ลำดับที่เจ้าของสั่ง (2026-09-16) · **เจ้าของเคาะ 5 ข้อแล้ว ห้ามถามซ้ำ:** 2A = ก (joiner 3 คำ พอตคิท · รุ่นนี้ · กล่าวอ้าง = ข้อยกเว้นของเจ้าของ ไม่ใช่เปิดทั่วไป · จดตำแหน่ง THAI_STYLE §6 แล้ว) · 2B = ก (NBSP หน้า ๆ) · 2C = ก (NBSP เลข+หน่วย วัตต์ โอห์ม พัฟ นิ้ว mAh mL W + ชื่อรุ่น 2 คำ 6 ชื่อ) · 1.6 = เปิดให้เสนอ 9 หัวข้อ (title/meta 30.3ข คงเดิมถ้าแยกจาก H1 ได้ · ถ้า H1 = title เปลี่ยนตาม ≤60 คีย์เวิร์ดครบ) · 1.7g = ไทย
1. **typography (WIP `d0ccd49`) → ให้ผ่าน:** checker (ด่านใหม่ `node scripts/thai-raw-chars-check.js` = 0 · head/JSON-LD/en-zh = 0 — สคริปต์ `_incoming/30.4c/typography-render-check.js` + `typography-test.ts`) · **ยังไม่ต้อง commit ซ้ำ** เว้นแต่แก้
2. **copy-close:** รับตาราง thai-copy ชุด 1 (≤40) → เจ้าของเคาะ → apply → build → render-check → commit `copy(30.4c-close)` · ถ้ามีชุด 2 ทำต่อ
3. **copy-headings:** ตาราง 1.6 ≤10 แถว → เจ้าของเคาะ → commit แยก `copy(30.4c-close): headings`
4. **ถ่ายซ้ำ + designer ปิด (ชั้น B ครั้งเดียวรวม typography+copy):** รัน `scripts/wordbreak-scan.js` ก่อน (เทียบ `wb-summary.md` เดิม) → ถ่ายเฉพาะหน้าที่ designer เคยธง A (`crops-close/index-A/B.md` + รายงาน designer ในแชทเก่า = ~40 หน้า) → ครอปจุดที่สแกนยังธง → designer 1 ครั้ง → แก้ตกค้าง → checker รวม
5. **docs:** THAI_STYLE §7 "ปิดรอบ" (ตาราง copy-close + headings) · LAUNCH_AUDIT 30 ปิดรอบ + 36 · HANDOFF §4.1 เคลียร์ · รายงานปิดรอบต้องมี: อังกฤษที่เหลือนับจริง (36) · รายการที่ปิดรอบแก้ · ขนาดรีโป
6. **push** → Cowork merge → เว็บ live → ถามเจ้าของเรื่องลบภาพ `_incoming/30.4c/shots-*` (1.6 GB)
- **เครื่องมือปิดรอบใน `_incoming/30.4c/` (gitignored):** `close-list.md` · `close-designer-brief.md` · `close-brief-thai-copy.md` · `wordbreak-known.md` (34 จุดเดิม) · `shoot-close.sh` · `wordbreak-eval.js` + `wb-all.sh` + `wb-summary.js` (ต้นแบบของ `scripts/wordbreak-scan.js`) · `crops-close.js` + `crops-close/index-A/B.md` · `linebreak-dump-eval.js` (dump บรรทัดจริงจาก DOM) · `typography-test.ts` · `typography-render-check.js` · `wb-summary.md` (ก่อน) · `wb-summary-after-typography-partial.md` (หลัง · 91 หน้า) · `commit-close-typography.txt` · `batch-7-approved.md` (คำตัดสินเจ้าของทั้งเซสชัน)

### 5.2 หลัง 30.4ค
- **30.4ข** (คำนำหมวด · สเปกเด่นบนการ์ด · แถบความมั่นใจ + ข้อ 49 + 2D/2E + "จดไว้ 30.4ข" ทุกข้อ) → **รอบ SEO** → รอบบทความ → รอบเก็บบ้าน → รอบข้อมูล → ข้อ 45 → แอดมิน → QR → ข้อ 42 · ข้อ 47/48 → รอบการขาย · **รอบ label** (`compare.rowDrawStyle` "รูปแบบการสูบ" · หัวแถว /compare 1440 ~10px) · **รอบ meta** (about meta)

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย

เหมือน v22 §6 (ข้อ 44 · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง)

## 7. คำถามที่เจ้าของต้องตอบ

**[ตรวจแล้วจริง]** ตอบแล้วในเซสชันนี้: ก้อน 7/8/9 ทุกข้อ · ปิดรอบ 5 ข้อ · VINCI S ประโยค ✓ · ธง 1.7 ทั้งหมด
ยังรอ: TPD VINCI S/G3 mini (ห้ามพูดความจุจนเช็คกล่อง) · #31/#34 iPhone · หน่วยเพิ่มในกลไก (บาท · วัน · รุ่น?) · ลบภาพ 1.6 GB · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189

## 8. ความเสี่ยงและจุดต้องระวัง

### 8.0 กฎ 2 ชั้น — ถาวร (v21/v22) + สิ่งที่ตกผลึกรอบนี้
- **typography เป็นชั้น B** แม้ไม่แตะ CSS: เปลี่ยนจุดตัดบรรทัดทุกหน้า → ต้องถ่ายซ้ำหน้าที่ธง + designer ก่อนปิด
- **สแกนก่อนถ่าย:** `scripts/wordbreak-scan.js` ให้รายการจุดตัดจาก DOM · ถ่าย/ครอปเฉพาะที่ธง
1. **NBSP/U+2060:** อยู่ได้เฉพาะตอน render ผ่าน `thai-typography.ts` · ด่าน `scripts/thai-raw-chars-check.js` = 0 · เพิ่มคำ/หน่วย/ชื่อรุ่น = เจ้าของเคาะ + จด THAI_STYLE §6 · title/meta/JSON-LD/en/zh ต้อง 0 (`typography-render-check.js`)
2. **WIP บน branch:** `d0ccd49` ยังไม่ผ่าน checker/designer — บอก Cowork ห้าม merge จนปิดรอบ (ถ้า Cowork merge ไปแล้ว ให้ตรวจเว็บจริงด้วย `typography-render-check.js http://okami24.store` ทันที)
3. **context:** เจ้าของพิมพ์ handoff เอง (~800K) · ไม่ต้องนับ
4. **ห้าม merge/deploy/force push เอง** · `git fetch` ก่อนสรุป (PR #25 #26 merge ภายในวัน)
5. **หลัก "ที่สุด"/ยืนยันไม่ได้ = ไม่พูดทุกภาษา** + ตัวเลขในประโยคใหม่ต้องมีแถว verified (ไม่ตรง = ตัดเลข ไม่ใช่แก้เลข) + จำนวนรส/สีจาก option ไม่นับ verified
6. **ชื่อเครื่องมือเรียกเหมือนกันทุกที่** (ตัวช่วยเลือกสินค้า · รายการโปรด) · เปลี่ยนชื่อ = 30.4ข
7. **overlay key / render-check / agent / server / heredoc / CRLF** เหมือน v22 (8.7–8.11) · เพิ่ม: Write/Edit แปลง `\uXXXX` เป็นอักขระดิบ → ใช้ `String.fromCharCode` / `\p{Script=Thai}`
8. **Git Bash + argument ขึ้นต้น `/`** → PowerShell หรือ `MSYS_NO_PATHCONV=1`

## 9. ห้ามรื้อ
เหมือน v22 + `src/lib/thai-typography.ts` รายการ JOINED/MODEL_NAMES (คำตัดสินเจ้าของ) · `src/lib/label-lang.ts` · `COMPAT_EVIDENCE_TH` · คำที่เคาะใน §7 ก้อน 7–9

## 10. Git
commit แยกชนิด · stage บางส่วนด้วย `_incoming/30.4c/stage-k78.js` แม่แบบ · commit ปิดรอบที่เหลือ: `copy(30.4c-close)` · `copy(30.4c-close): headings` · `docs`

## 11. ความพร้อมแต่ละระบบ
เหมือน v22

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท
- **thai-copy ชุดปิดรอบ (≤40 + หัวข้อ ≤10) กำลังทำตอนปิด — ผลจะไม่มาถึงแชทนี้** → เซสชันใหม่สั่งใหม่จาก `close-brief-thai-copy.md`
- สแกนหลัง typography ทำไป 91/105 หน้า (หยุดตามคำสั่ง handoff) · server 3412 ปิดแล้ว (netstat 0) · ภาพ/ครอปทั้งหมดอยู่ใน `_incoming/30.4c/`
- WIP `d0ccd49` push แล้ว (ดู §16)

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)
1. วางบล็อก §16 → `git fetch` → ยิง okami24.store (ก้อน 9 live: `/products/caliburn-g5` tagline "แตะสามครั้งสลับโหมดวัตต์")
2. ทำ 5.1 ข้อ 1–6 ตามลำดับ · ตารางไทยทุกชุดให้เจ้าของเคาะก่อนใส่โค้ด
3. ถามเจ้าของ 3 เรื่องรวมชุดเดียว: หน่วยเพิ่ม (บาท/วัน/รุ่น) · ลบภาพ 1.6 GB · TPD

## 14. ควรหยุดทำ
เหมือน v22 · ห้ามถ่าย 104 ภาพก่อนสแกน · ห้ามเปิดใช้ joiner/NBSP นอกรายการ

## 15. ปลายทางของโปรเจกต์
เหมือน v21 §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD d0ccd49 (+docs v23 ถัดไป) · origin/main f71b6a7 (PR #26 = ก้อน 9 live) · branch นำหน้า main = WIP typography (d0ccd49) **ยังไม่ผ่าน checker/designer — บอก Cowork ห้าม merge จนปิดรอบ**
  Cowork merge + deploy โดยไม่บอกในแชท → git fetch ก่อนสรุปสถานะเสมอ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md ฉบับ 23 (ข้อขัดแย้ง 1–7 · 4 · 4.1 · 5.1 · 8.0)
  → docs/THAI_STYLE.md ทั้งไฟล์ (§3 คำล็อกรวมก้อน 1–9 · §5 กลุ่ม ก · §6 typography/joiner 5 คำ · §7 "รอบ 30.4ค" ทุกตาราง)
  → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน" + ข้อ 30 36 49 (ห้ามอ่านทั้งไฟล์)
  → _incoming/30.4c/close-list.md (รายการปิดรอบ 3 ช่อง) + close-brief-thai-copy.md + batch-7-approved.md (คำตัดสินเจ้าของทุกข้อ) · ไฟล์คำสั่ง 30.4ค ที่ C:\Users\dhetc\OneDrive\Desktop\Run prompt\New prompt on work\รอบ30.4ค-อังกฤษที่เหลือในหน้าสินค้า.txt

สถานะ: รอบ 30.4ค ก้อน 1–9 live · ขั้นปิดรอบ = สำรวจเสร็จ (ถ่าย 52 หน้า×2 · สแกน DOM 104 · designer 2 คน 153 ครอป → close-list.md) · เจ้าของเคาะ 5 ข้อ 2026-09-16: 2A=ก joiner 3 คำ (พอตคิท·รุ่นนี้·กล่าวอ้าง ข้อยกเว้นเจ้าของ) · 2B=ก NBSP หน้า ๆ · 2C=ก NBSP เลข+หน่วย (วัตต์ โอห์ม พัฟ นิ้ว mAh mL W) + ชื่อรุ่น 2 คำ (Zero Nano · Zero Cartridge · M Switch · M Bar · Smash Go · G Pod Platform) · 1.6 เปิดให้เสนอ 9 หัวข้อ (title/meta 30.3ข คงถ้าแยกจาก H1 ได้ · H1=title เปลี่ยนตาม ≤60 คีย์เวิร์ดครบ) · 1.7g eyebrow การ์ดคู่มือหน้าแรก = ไทย
  ทำแล้ว (WIP d0ccd49): src/lib/thai-typography.ts (แทน thai-keep-together.ts · render-time th เท่านั้น · LocaleProvider deep-map dict + overlay getters + 20 component) · scripts/thai-raw-chars-check.js (ด่าน 0) · scripts/wordbreak-scan.js (ตัวตรวจจุดตัดบรรทัด DOM+ICU) · ตรวจแล้ว: tsc·eslint·gate 0·render 27/27·head 0·JSON-LD 0·en/zh 0 — ยังไม่ checker/designer/ถ่ายซ้ำ
  ลำดับที่เหลือ (5.1): typography ให้ checker ผ่าน → copy-close (thai-copy ชุด ≤40 จาก close-list ช่อง 1 — สั่งใหม่จาก close-brief-thai-copy.md เพราะผลรอบก่อนไม่ทันแชท · รวม PM :1155 → "คอยล์ nexMESH คู่ 1.2Ω (ในตัว)" ตาม researcher wotofo.com) → copy-headings (1.6 ≤10 แถว) → สแกนใหม่ + ถ่ายซ้ำหน้าที่ designer ธง A + designer ปิด 1 ครั้ง → docs (THAI_STYLE §7 ปิดรอบ · LAUNCH_AUDIT 30/36 · HANDOFF §4.1) → push → รายงานปิดรอบ (อังกฤษเหลือ 36 · รายการที่แก้ · ขนาดรีโป)
  ไม่แก้ (เจ้าของตัดสิน): 2D H2 max-width · 2E /compare 390 คอลัมน์ตัด → 30.4ข · 2F 1600MAH mono → ไม่แก้ · ข้อ 49 → 30.4ข · #31 #34 → เจ้าของเช็ค iPhone
  สั่งซื้อออนไลน์ปิด (ข้อ 43) → ไลน์ @okm24 ห้ามเสนอเปิด · 53/31 · น้ำยา 0 · TPD VINCI S/G3 mini ไม่พูดตัวเลขจนเจ้าของเช็คกล่อง
  agent: thai-copy (opus · ตาราง ก่อน→หลัง · โจทย์ผ่าน brief · ตอบสั้น) · researcher/checker sonnet · designer (ให้ครอป+ตัวเลขความสูง · ไม่มี Bash) · checker ต้องได้ batch-7-approved.md + close-list.md เป็นคำสั่งเดิม

กติกา context: เจ้าของพิมพ์ handoff เมื่อเห็น ~800K → จบก้อนในมือ + push + §16 + ปิด · ไม่ต้องนับเอง
กฎ 2 ชั้น (ถาวร): ชั้น A ข้อความล้วน = build → render-check → checker → commit → push · ชั้น B แตะโครง/CSS/typography = สแกน wordbreak → ถ่ายหน้าที่ธง 390+1440 → designer → checker · ประโยคใหม่ทุกประโยคต้องเจ้าของเคาะ · ประโยคใหม่ต้องไม่กลับความไม่ว่าตัดตรงไหน ("ไม่" ห้ามอยู่ตำแหน่งเสี่ยง) · ห้าม U+2060/NBSP นอกกลไก thai-typography.ts (เพิ่มรายการ = เจ้าของเคาะ + จด §6)
ห้ามแตะ: layout · รูป · motion · ordering-mode.ts · ข้อความข้อ 43 · slug/URL/sitemap/structured data · /warranty · หน้าบริการ (privacy/how-to-order/shipping = ข้อ 49 → 30.4ข) · Hero.tsx · cinematic/ · กลุ่ม ก · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · ชื่อฟีเจอร์/สโลแกนแบรนด์ · "Retailer-confirmed" joiway · alt ภาพ · title/meta 30.3ข (เว้น 1.6 ตามเงื่อนไข)
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · ตัดสินเอง = ย้อนง่าย+ลูกค้าไม่เห็น แล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคที่ลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง + ด่าน: node scripts/thai-raw-chars-check.js = 0 · grep 8 คำห้าม (พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต) = 0 · head/JSON-LD/en-zh ไม่มี NBSP/WJ · ผู้แก้ไฟล์คนเดียวคือตัวหลัก · ใส่ข้อห้าม taskkill/build/server ในคำสั่ง agent ทุกตัว
  · ปิด server: netstat -ano | grep ":<port>.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด
  · สคริปต์เขียนด้วย Write/Edit tool (heredoc/node -e พังกับ backslash/regex/ไทย) · Write/Edit แปลง \uXXXX เป็นอักขระดิบ → ใช้ String.fromCharCode / \p{Script=Thai} · CRLF ตรวจ git ls-files --eol ก่อน commit · งานยาว >10 นาที ต้อง (cmd &) แยก process + Monitor
  · Git Bash แปลง arg ที่ขึ้นต้น "/" เป็นพาธ Windows → รัน scripts/wordbreak-scan.js จาก PowerShell หรือ MSYS_NO_PATHCONV=1

เครื่องมือ: Browser pane ใช้ไม่ได้ → node scripts/shot.js out.png <url> --width 390|1440 [--desktop] [--wait ms] [--cookie okami24_locale=en] [--eval "<js>"]
  · **สแกนจุดตัดบรรทัด (แทนถ่าย 104 ภาพ — 3 บรรทัด):** (1) SITE_URL=https://okami24.store npx next build แล้ว start -p 3412 (2) PowerShell: node scripts/wordbreak-scan.js --base http://localhost:3412 --widths 390,1440 --out _incoming/wordbreak /products/argus-g4 /about (ไม่ใส่ path = ทั้ง sitemap ~90 นาที) (3) อ่านตาราง markdown ที่ stdout → ครอปเฉพาะจุดที่ธงให้ designer (แม่แบบ _incoming/30.4c/crops-close.js)
  · ด่านอักขระ: node scripts/thai-raw-chars-check.js · พิสูจน์ render: node _incoming/30.4c/typography-render-check.js http://localhost:3412 · unit: npx tsx _incoming/30.4c/typography-test.ts
  · dom-eval: node _incoming/30.3b/dom-eval.js <url> <eval.js> <out.json> [width] · ครอป: node _incoming/qc/2026-09-08-mobile-B/crop-png.js <in> <out> <x> <y> <w> <h> · _incoming/30.4c/: close-list.md · close-*-brief.md · shots-close/ crops-close/ wb/ wb-typo/ · k7-render-check.js · k9-render-check.js · english-fields-5.ts · locale-eval-k8.sh · shoot-close.sh · stage-k78.js
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · npx tsx _incoming/30.4c/english-fields-5.ts (36) · node scripts/thai-raw-chars-check.js (0) · render-check ของก้อนที่แตะ · grep 8 คำห้าม = 0
Git: commit แยกชนิด (feat/fix/copy/data/docs) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push ทันที · ห้าม merge เอง
รอเจ้าของ: หน่วยเพิ่มในกลไก (บาท · วัน · รุ่น — สแกนหลัง typography เหลือ 3 จุดบน /compare /how-to-order /warranty) · ลบภาพ _incoming/30.4c/shots-*/crops-* (1.6 GB) · TPD · #31 #34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -5 --oneline`** — ถ้า main ขยับเกิน `f71b6a7` ให้เช็คว่า Cowork merge WIP `d0ccd49` ไปหรือยัง (ถ้า merge แล้ว → ยิง `node _incoming/30.4c/typography-render-check.js https://okami24.store` ทันที และรีบทำ 5.1 ข้อ 1)
2. อ่าน `close-list.md` + `batch-7-approved.md` (คำตัดสิน) → เริ่ม 5.1 ข้อ 1 (checker typography) และสั่ง thai-copy จาก `close-brief-thai-copy.md` ขนานกัน
3. ห้ามถ่ายภาพก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ · ทุกประโยคใหม่ = เจ้าของเคาะ
