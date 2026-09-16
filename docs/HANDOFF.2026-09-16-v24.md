# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-16 (**ฉบับที่ 24** — รอบ 30.4ค **ปิดรอบเสร็จ** ตรวจผ่านตามเกณฑ์ · รอ push/merge · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-16-v23.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD **`4520498`** (docs ปิดรอบ) + docs ฉบับนี้ · `origin/main` **`f71b6a7`** (PR #26 = ก้อน 9) · branch นำหน้า main **10 commit** (`d0ccd49` WIP + docs v23 ×2 + ปิดรอบ 7 ก้อน) · working tree: ว่าง (เหลือไฟล์นี้)

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** `git fetch` + `git status` + `git log` · build ท้ายสุด (`4167b26` โค้ด): tsc · eslint · `node scripts/thai-raw-chars-check.js` = 0 · unit `typography-test.ts` ผ่าน · render: typography 36/36 spots · `<head>` 0 · JSON-LD 0 ทั้ง 105 หน้า · copy+headings 143/143 · คำห้าม 0/105 · en/zh หลัง hydration (text node ไทย) 0/0 ×4 หน้า · verify:catalog --full 20/20 · commerce 16/16 · i18n 16/16 · 53/31 · อังกฤษบนหน้าสินค้า 36 · server 3412 ปิดแล้ว (netstat 0) · `_incoming/` **1.6 GB** (30.4c 265 MB)

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]**
> **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"** — เขียนแยกเสมอ
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก · §5 กลุ่ม ก (+แถวใหม่ /about joiner) · §6 typography · §7 "รอบ 30.4ค" รวม "ขั้นปิดรอบ"

---

## ข้อขัดแย้งที่พบ / บทเรียนเซสชันนี้

ทุกข้อ **[ตรวจแล้วจริง]**:

1. **กติกา context ใหม่ (เจ้าของ 2026-09-16 · แทน "เจ้าของพิมพ์ handoff ที่ ~800K"):** Code เป็นคนแจ้ง "ขอจบก้อนนี้ก่อน" แล้ว handoff เมื่อ (ก) ครบ 3 ก้อนในแชทเดียว หรือ (ข) ก่อนเริ่มงานที่ยาวกว่า 30 นาที · เจ้าของพิมพ์ handoff แทรกได้ทุกเมื่อ · เซสชันนี้ = 3 ก้อน (typography · copy-close · headings) + docs → handoff ตามกติกา
2. **v23 บอกว่า "en/zh หลัง hydration 0"** — จริงเฉพาะหน้าที่มีสตริง en/zh · หน้า `/about` (ไทยล้วนทุก locale) เรียก `thaiTypography()` ตรง ๆ จึงมี NBSP/WJ ใต้คุกกี้ en/zh (checker จับได้) → แก้เป็น `<ThaiText>` (client · ใส่เฉพาะ th) · และมี NBSP อีก 1 ตัวใน en/zh จาก `CategoryLabel.tsx` ("Disposable / Prefilled" — ของ 30.3ข `d8194a4` คนละกลไก ไม่แตะ) · เกณฑ์ที่ใช้จริงตอนนี้: **นับ NBSP/WJ เฉพาะ text node ที่มีอักษรไทย** (= ขอบเขตของ `thai-typography.ts` ที่ไม่แตะสตริงไม่มีไทย) — สคริปต์ `_incoming/30.4c/typography-enzh-check.sh` · checker รับเกณฑ์นี้แล้ว
3. **joiner จุดเดียว "ย้าย" รอยตัด ไม่ได้ "ลบ"** — "กล่า | วอ้าง" กลายเป็น "ก | ล่าวอ้าง" (designer ค) → ผูกทั้งคำ (WJ หน้าทุกพยัญชนะ/สระหน้า `joinWord`) · แล้วรอยตัดไปตกที่ "ไม่มี | การกล่าวอ้าง" + "เลิกบุ | หรี่" → เจ้าของเคาะผูกทั้งวลี "ไม่มีการกล่าวอ้าง" + "บุหรี่" เฉพาะประโยคนี้ (THAI_STYLE §5 แถวใหม่) · บทเรียน: **ทุกครั้งที่ผูกอะไร ต้องดูว่ารอยตัดใหม่ไปตกตรงไหน** — สแกน DOM มองเห็นแค่ประเภทที่สอน (ขีดช่วงตัวเลข "5– | 35" ตัวตรวจไม่เห็น designer เห็น)
4. **ผูกหน่วยแล้วเบราว์เซอร์หักหลังขีด** "5–35 วัตต์" → "5– | 35 วัตต์" → WJ หลังขีดในช่วงตัวเลข (`RANGE_DASH`) · แล้วย่อหน้า ARGUS G4 390 ยืดเป็น 4 บรรทัดจน "45 | นาที" → เจ้าของเคาะเพิ่มหน่วย นาที
5. **หน้าบริการ 5 หน้าไม่เคยผ่านกลไก typography** (copy ไม่อยู่ใน dictionary — เป็น object ปน JSX) · v23 เข้าใจว่าแค่เพิ่มหน่วยก็พอ → จริงต้องต่อสาย `useServiceCopy` + `thaiTypographyDeep` เดินเข้า React element ได้
6. **Write/Edit/sed กิน backslash ใน `\p{…}`/`\u…`** (ซ้ำ v23 ข้อ 4): regex ในไฟล์กลไกกลายเป็นอักขระไทยดิบ `[ก-ฮเ-ไ]` (ใช้ได้ ความหมายเท่ากัน — คงไว้แบบนั้น) · สคริปต์ .sh ที่มี `\p{Script=Thai}` ต้องเขียน backslash ผ่าน `String.fromCharCode(92)` · `node -e` กับข้อความไทย+backtick พังอีกครั้ง → ใช้ไฟล์สคริปต์ (`_incoming/30.4c/apply-*.js`) เท่านั้น
7. **ตัวเลขสแกน 2 ชุดวัดคนละอย่าง ห้ามบวกกัน:** `wb-diff.md` = typography อย่างเดียว (wb ก่อน vs wb-typo-pre-copy · 98 คู่ · หาย 24 ใหม่ 6) · `wb-diff-copy.md` = copy+headings (wb-typo-pre-copy vs wb-typo · 210 คู่ · หาย 73 ใหม่ 12) · `wb-diff-total.md` = รวม (wb vs wb-typo · 98 คู่ · หาย 89 ใหม่ 13) · ตัวเลข "ก่อน 199 → หลัง 108 instance" มาจาก total
8. **shot.js ช้ามากเมื่อรันคู่ขนานกับ wordbreak-scan** (1 ภาพ ~1–3 นาที) → รันงาน Chrome ทีละอย่างเสมอ · งานเกิน 10 นาทีต้อง `(cmd &)` แยก + เฝ้าไฟล์ log (ทำแล้ว `close-chain*.sh`)

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านพอต **OKami24** · Next.js 16 + TS + Tailwind v4 + SQLite · โฟลเดอร์ `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` HEAD `4520498` (+ไฟล์นี้) · **live `main` = `f71b6a7`** (PR #26 = ก้อน 9) · branch นำหน้า main 10 commit = **ขั้นปิดรอบ 30.4ค ทั้งหมด ตรวจผ่านตามเกณฑ์ (checker A–I + designer 2 รอบ) — push แล้ว/รอ Cowork merge (ดู §12)**
- **รอบ 30.4ค: ปิดรอบเสร็จ** (ก้อน 1–9 live · ปิดรอบ 7 commit + docs) — ถัดไป **30.4ข** (§5.2)
- **อังกฤษบนหน้าสินค้า (`_incoming/30.4c/english-fields-5.ts`): 36** = ค่าสเปกตัวเลข/หน่วย/ชื่อรุ่นล้วน คงตามกฎ · ชื่อสี 154/กลิ่น 191 ชั้น 1
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) → ไลน์ `@okm24` · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 · น้ำยา 0
- **checkpoint/จุดกลับ:** ก่อน 30.4ค = `ebd288b` · จบก้อน 9 = `98d8f5a` (= main f71b6a7) · WIP typography = `d0ccd49` · **จบปิดรอบ = `4167b26` (โค้ด) / `4520498` (docs)**

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว)

**[ตรวจแล้วจริง]** — ทั้งหมดใน v23 §2 (ก้อน 7·8·9 live) + ขั้นปิดรอบ:

- **typography `3c060b8`** (แทน WIP d0ccd49 ที่ตรวจไม่ผ่านตอนนั้น): `src/lib/thai-typography.ts` — NBSP หน้า ๆ · NBSP เลข+หน่วย (วัตต์ โอห์ม พัฟ นิ้ว กรัม **บาท วัน รุ่น นาที** · mAh mL W) + WJ หลังขีดในช่วงตัวเลข · NBSP ชื่อรุ่น 2 คำ 6 ชื่อ · WJ **ทั้งคำ** 5 คำ + วลี "ไม่มีการกล่าวอ้าง"/"บุหรี่" (/about เท่านั้น) ผูกกับ `within` · `thaiTypographyDeep` เดินเข้า React element · **หน้าบริการ 5 หน้าต่อสาย `useServiceCopy`** (`ServicePage.tsx`) · `/about` ผ่าน `<ThaiText>` (th เท่านั้น) · ด่าน `scripts/thai-raw-chars-check.js` 0 · ตัวตรวจ `scripts/wordbreak-scan.js`
- **copy-close `4ffb4cc`** 41 ประโยค (close-table-1 แถว 1–39 41 42 · ก ทั้งหมด · แถว 19 ไม่มี "ชาร์จเร็ว") + **data `1b171e6`** PM Coil-83/87 "หัวพอตเปล่า…" + Pod-180 "คอยล์ nexMESH คู่ 1.2Ω (ในตัว)" + **eyebrow `8348310`** การ์ดคู่มือหน้าแรก "01 · เริ่มต้นใช้งาน…" (`GuideCategoryLabel`)
- **headings `1807a19`** 9 หัวข้อ (H5 = ข · title 4 หน้าเปลี่ยนตาม ≤60) · **DRAG S3 `4167b26`** "ชาร์จเร็ว/fast charging" ออกทุกภาษา (เจ้าของ 3ก)
- **docs `4520498`** THAI_STYLE §5 แถวใหม่ · §6 · §7 "ขั้นปิดรอบ 30.4ค" (ตาราง 42+9 + คำตัดสิน) · LAUNCH_AUDIT หัว + ข้อ 30 (ปิด) + 36

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-16 · 8 commit · main ยังไม่ขยับ)

| งาน | commit | ผลตรวจ |
|---|---|---|
| typography ชั้น B | `3c060b8` | designer รอบ 1: ก 17 ข 5 **ค 3** (ก\|ล่าวอ้าง · 5–\|35 · 0.3–\|3.0) → แก้กลไก 4 อย่าง (เจ้าของเคาะ 1ก 2ก) → designer รอบ 2: **ค 0** (ก 6 ข 4) · checker รอบ 1 ตีกลับ E (/about en/zh) → แก้ `<ThaiText>` → checker รอบ 2 ผ่าน · render 36/36 · head/JSON-LD 0 · en/zh ไทย 0/0 · overflow 0 |
| copy-close 42 + data + eyebrow | `4ffb4cc` `1b171e6` `8348310` | render 106/106 → 143/143 รวม · สแกน 210 คู่ หาย 73 ใหม่ 12 (B) · checker C สุ่ม 24/42 ตรง |
| headings 9 | `1807a19` | render (+title 4) ผ่าน · **ค้าง 390: 3 หัวข้อยังจบด้วยคำโดด** (§4) |
| DRAG S3 3ก | `4167b26` | render 143/143 · grep fast = 0 ใน block |
| docs | `4520498` + ฉบับนี้ | — |

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- **[ตรวจแล้วจริง] หัวข้อ 3 จุดที่ 390 ยังจบด้วยคำโดด** (จอแคบ ~15 อักษร/บรรทัด): H2 "เลือกพอตซิสเต็ม หรือพอตใช้แล้ว | ทิ้ง" (หน้าแรก + /guides) · H1 "MTL กับ DTL ต่างกันตรง | ไหน" · H2 "…RDL ที่อยู่ตรง | กลาง" — เท่ากับก่อนแก้ที่ 390 (หัวข้อเดิมก็ตัดคำโดด) ดีขึ้นที่ 1440 · ปิดได้ถ้าเจ้าของอยากได้หัวข้อที่แต่ละท่อน ≤15 อักษร (thai-copy รอบใหม่) — **ยังไม่ได้ถาม**
- **[ตรวจแล้วจริง] คำโดด/ขอบคำระดับ B ที่เกิดใหม่หลัง copy 12 จุด** (`wb-diff-copy.md` NEW: "…ARGUS ของ | VOOPOO" argus-p3 1440 · "…ได้ | เลย" vinci-s 390 · "…ให้เอง | อัตโนมัติ" ชิป 390 · "…บนจอ | โดยตรง" จอทัช 1440 · "Caliburn รุ่นแรกที่จอ LCD โอบรอบด้าน | ข้าง" rail หน้าแรก 1440 ฯลฯ) — designer ยังไม่ได้ดูครอปชุดนี้ (ชั้น A ตามกฎ 2 ชั้น) · ไม่มี "ไม่" ค้างท้ายบรรทัดใน 36 หน้าที่สแกนนอกจาก 4 จุดเดิมนอกขอบเขต (about "ไม่ใช่ | บอท" · about "ยังไม่ | ยืนยัน" ป้าย · /e-liquid "ไม่ใช่ | รายการน้ำยา" · MTL "แต่ยังไม่ | โล่งเท่า" — ช่อง 3/ข้อ 49)
- **[ตรวจแล้วจริง] ครอป C–J ของ designer รอบ 2 มาจาก build กลางทาง** (`crops-typo2/3` = ก่อนวลี /about + นาที) — โค้ดจุดเหล่านั้นไม่เปลี่ยนหลังจากนั้น แต่ตามเกณฑ์ "ผลตรวจใช้กับ commit ที่ระบุ" ยังไม่มีครอปทั้ง 25 จุดจาก `4167b26` เดียวกัน · ถ้าเจ้าของต้องการ รัน `node _incoming/30.4c/typo-crops.js` บน build ใหม่ + designer 1 รอบ (~10 นาที + agent)
- **[ตรวจแล้วจริง] checker ตรวจ close-table แบบสุ่ม 24/42** (ไม่ได้ไล่ทั้ง 42) · จอ 360/414 ไม่ได้ตรวจ (มีแต่ 390/1440) · en/zh ตรวจ 4 หน้า (/ /about /how-to-order /products/argus-p3) ไม่ใช่ทั้งเว็บ
- **[ตรวจแล้วจริง] `CategoryLabel.tsx` ใส่ NBSP ใน en/zh 1 จุด** ("Disposable / Prefilled" — กลไกของ 30.3ข ไม่ใช่ thai-typography) · ไม่แตะ · ถ้าอยากให้ en/zh = 0 จริง ๆ ต้องให้ CategoryLabel ทำเฉพาะ label ที่ครึ่งหลังเป็นไทย (แก้ 1 บรรทัด — รอเจ้าของสั่ง)
- **ข้อ 49 (30.4ข):** privacy OTP/ตะกร้า · FAQ ซ่อน · how-to-order 3 แถว · **2D** H2 หน้าแรก max-width · **2E** /compare 390 คอลัมน์ 3 ถูกตัด · **2F** ไม่แก้ (เจ้าของ) · #31 #34 → เจ้าของเช็ค iPhone
- ของเดิม v22 §4: `priority` 2 จุด · taxonomy Coil-72/89 · `th.ts` dead strings · FAQ วิจัยซ่อน · คอมเมนต์ `relx.ts:19` · โครงหน้า "จดไว้ 30.4ข"

### 4.1 รายการตัดกลางคำ — ปิดแล้ว
`close-list.md` = รายการทั้งหมด · ช่อง 1 (ข้อความ) = แถว 1–42 ทำครบ · ช่อง 2 (กลไก) = `3c060b8` ครบ · ช่อง 3 = ไม่แก้ตามเหตุผลเดิม · เหลือเฉพาะ §4 ข้อ 1 (หัวข้อ 390) + ระดับ B

---

## 5. รอสานต่อ (มีโครงแล้ว ต้องต่อยอด)

### 5.1 ปิดรอบ 30.4ค — เหลือแค่ขั้นตอนหลัง push
1. **push** `checkpoint/phase-3.3.3` (ทำในเซสชันนี้ — ดู §12) → **Cowork merge** (เจ้าของสั่ง) → ยิงเว็บจริง: `node _incoming/30.4c/typography-render-check.js https://okami24.store` (คาด 36/36 · head 0 · JSON-LD 0) + `node _incoming/30.4c/close-render-check.js --headings --base https://okami24.store` (คาด 143/143)
2. ถามเจ้าของ: หัวข้อ 390 3 จุด (§4 ข้อ 1) เอาไหม · ลบภาพ `_incoming/30.4c/shots-*/crops-*` 1.6 GB (เจ้าของ 2026-09-16: **ยังไม่ลบ**)
3. เครื่องมือปิดรอบใน `_incoming/30.4c/` (gitignored): `close-table-1.md` (ตารางที่เคาะ) · `apply-close-1/2/3.js` · `close-render-check.js` · `typography-render-check.js` · `typography-test.ts` · `typography-enzh-check.sh` · `typo-crops.js` (+`--only` `--out`) · `wb-diff.js` · `wb-diff*.md` · `wb-typo/` (สแกนล่าสุด 105 หน้า) · `wb-typo-pre-copy/` · `crops-typo*/` · `close-chain*.sh` · `commit-close-*.txt` · `close-designer-typo-brief.md`

### 5.2 หลัง 30.4ค (เหมือน v23)
**30.4ข** (คำนำหมวด · สเปกเด่นบนการ์ด · แถบความมั่นใจ + ข้อ 49 + 2D/2E + "จดไว้ 30.4ข" ทุกข้อ + หัวข้อ 390 ถ้าเจ้าของเอา) → รอบ SEO → รอบบทความ → รอบเก็บบ้าน → รอบข้อมูล → ข้อ 45 → แอดมิน → QR → ข้อ 42 · ข้อ 47/48 → รอบการขาย · รอบ label (`compare.rowDrawStyle` · หัวแถว /compare 1440 ~10px) · รอบ meta (about meta)

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย

เหมือน v22 §6 (ข้อ 44 · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง)

## 7. คำถามที่เจ้าของต้องตอบ

| เรื่อง | รู้แล้ว | ยังไม่รู้ | ต้องตอบ |
|---|---|---|---|
| หัวข้อ 3 จุดที่ 390 (§4) | ดีขึ้นที่ 1440 · 390 เท่าเดิม | เจ้าของรับได้ไหม | เอา thai-copy เสนอหัวข้อสั้น ≤15/ท่อน หรือรับ |
| ลบภาพ 1.6 GB | เจ้าของ 2026-09-16: ยังไม่ลบ | เมื่อไหร่ | — |
| ครอป 25 จุดจาก build สุดท้าย + designer อีกรอบ | โค้ดจุดเหล่านั้นไม่เปลี่ยน | เจ้าของอยากได้หลักฐานตรง commit ไหม | ใช่/ไม่ |
| CategoryLabel NBSP ใน en/zh 1 จุด | ของ 30.3ข ไม่ใช่กลไกนี้ | จะให้แก้ไหม | ใช่/ไม่ |
| ยังรอเหมือน v23 | TPD VINCI S/G3 mini · #31/#34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 | | |

## 8. ความเสี่ยงและจุดต้องระวัง

### 8.0 กฎ 2 ชั้น — ถาวร + ที่ตกผลึกรอบนี้
- **สแกนก่อนถ่าย** `scripts/wordbreak-scan.js` → ครอปเฉพาะที่ธง (`typo-crops.js`) → designer · **แต่ตัวตรวจไม่เห็นทุกชนิด** (ขีดช่วงตัวเลข · คำขาดที่ segmenter คิดว่าเป็นคำ) — designer ยังต้องดูจุดที่กลไกแตะ
- **ผูกแล้วดูรอยตัดใหม่เสมอ** (ข้อขัดแย้ง 3–4)
1. **NBSP/U+2060:** อยู่ได้เฉพาะตอน render ผ่าน `thai-typography.ts` (+`CategoryLabel.tsx` ของเดิม) · ด่าน `scripts/thai-raw-chars-check.js` = 0 · เพิ่มคำ/หน่วย/ชื่อรุ่น = เจ้าของเคาะ + จด THAI_STYLE §5/§6 · title/meta/JSON-LD 0 · en/zh: นับเฉพาะ text node ไทย = 0 (`typography-enzh-check.sh`)
2. **ทุกที่ที่เรียก `thaiTypography()` ต้องมี locale guard** (dictionary ผ่าน LocaleProvider · overlay getters เช็ค locale · หน้าไทยล้วนใช้ `<ThaiText>`) — เรียกตรง ๆ ใน server component = รั่วไป en/zh
3. **Cowork merge โดยไม่บอก** → `git fetch` ก่อนสรุปสถานะ · ห้าม merge เอง · ห้าม force push
4. **context:** กติกาใหม่ ข้อขัดแย้ง 1 — Code แจ้งเอง 3 ก้อน/แชท หรือก่อนงาน >30 นาที
5. **หลัก "ที่สุด"/ยืนยันไม่ได้ = ไม่พูดทุกภาษา** — ใช้กับ "ชาร์จเร็ว" แล้ว (แถวสเปก verified ต้องบอกความเร็วจริง เช่น ARGUS G4 "~45 นาที")
6. **overlay key / render-check / agent / server / heredoc / CRLF / Git Bash `/`** เหมือน v22–v23 · เพิ่ม: ห้าม `node -e` กับข้อความไทย/backtick · sed กิน `\p` → ใส่ backslash ผ่านสคริปต์ · sed -i ทำไฟล์เป็น LF → unix2dos ก่อน commit
7. **Chrome งานหนักทีละอย่าง** (ข้อขัดแย้ง 8)

## 9. ห้ามรื้อ
เหมือน v23 + `src/lib/thai-typography.ts` ทั้งไฟล์ (JOINED 6 รายการ · MODEL_NAMES 6 · หน่วย 9+3 · `joinWord` · `RANGE_DASH` — ทุกอย่างคือคำตัดสินเจ้าของ) · `useServiceCopy` · `<ThaiText>` · `GuideCategoryLabel` · ทุกประโยคใน THAI_STYLE §7 "ขั้นปิดรอบ 30.4ค" · THAI_STYLE §5 แถว /about joiner

## 10. Git
working tree ว่าง (เหลือไฟล์นี้ → `docs: HANDOFF v24`) · commit ปิดรอบแยกชนิดแล้ว 7 ก้อน (copy/data/feat/copy/feat/copy/docs) · push ทั้ง branch (เจ้าของสั่ง "push" ในลำดับปิดรอบ) · ห้าม merge เอง

## 11. ความพร้อมแต่ละระบบ
เหมือน v22 · ภาษาไทยทั้งเว็บ: รอบ 30.4ค ปิดครบ (ก้อน 1–9 + ปิดรอบ) — เหลือ 30.4ข

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท
- **push branch** — ทำหลังเขียนไฟล์นี้ (commit docs v24 → `git push origin checkpoint/phase-3.3.3`) · ถ้าเปิดแชทใหม่แล้วเห็น origin ยังไม่มี `4520498` = push ไม่สำเร็จ ให้ push ก่อน
- รายงานปิดรอบส่งในแชทเดียวกัน (13.6) — เจ้าของยังไม่ได้ตอบคำถาม §7 ข้อ 1–4
- server 3412 ปิดแล้ว · ไม่มี process ค้าง (ตรวจ netstat)

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)
1. วางบล็อก §16 → `git fetch` → ถ้า main ขยับ (Cowork merge) ยิงเว็บจริง 2 สคริปต์ใน 5.1 ข้อ 1
2. รับคำตอบ §7 ข้อ 1–4 · ถ้าเจ้าของเอาหัวข้อ 390 → thai-copy 3 หัวข้อ ≤15 อักษร/ท่อน (ชั้น A + สแกน 3 หน้า)
3. เริ่ม 30.4ข ตาม LAUNCH_AUDIT 49 + THAI_STYLE §6 รายการค้าง — เปิดแชทใหม่ 1 ก้อนต่อ 1 หัวข้อ

## 14. ควรหยุดทำ
- ห้ามถ่าย 104 ภาพก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ · ห้ามรันงาน Chrome 2 อย่างพร้อมกัน
- ห้ามไล่แก้คำโดดระดับ B (ขอบคำประสม หัว|พอต ฯลฯ) — designer ตัดสินแล้วว่ารับได้ 66 ครอป การเขียนใหม่แค่ย้ายจุดตัด
- ห้ามเปลี่ยน CategoryLabel/label-lang/lg:min-h-10 เพื่อไล่ตัวเลข "0" ให้สวย — ต้องเจ้าของสั่ง

## 15. ปลายทางของโปรเจกต์
เหมือน v21 §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD 4520498 (+docs v24) · origin/main f71b6a7 (PR #26 = ก้อน 9 live) · branch นำหน้า main 10 commit = ขั้นปิดรอบ 30.4ค (ตรวจผ่านตามเกณฑ์ checker A–I + designer 2 รอบ) — push แล้ว รอ Cowork merge
  Cowork merge + deploy โดยไม่บอกในแชท → git fetch ก่อนสรุปสถานะเสมอ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md ฉบับ 24 (ข้อขัดแย้ง 1–8 · 4 · 5.1 · 7 · 8.0)
  → docs/THAI_STYLE.md (§3 คำล็อก · §5 กลุ่ม ก รวมแถว /about joiner · §6 typography · §7 "รอบ 30.4ค" + "ขั้นปิดรอบ")
  → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน" + ข้อ 30 (ปิดแล้ว) 36 49 (ห้ามอ่านทั้งไฟล์)
  → _incoming/30.4c/close-table-1.md (ตารางที่เคาะ) · close-list.md · batch-7-approved.md (คำตัดสินเจ้าของ)

สถานะ: รอบ 30.4ค ปิดรอบเสร็จ 2026-09-16 — 7 commit: copy 4ffb4cc · data 1b171e6 · eyebrow 8348310 · headings 1807a19 · typography 3c060b8 · DRAG S3 4167b26 · docs 4520498
  ยิงเว็บจริงหลัง merge: node _incoming/30.4c/typography-render-check.js https://okami24.store (36/36 · head 0 · JSON-LD 0) · node _incoming/30.4c/close-render-check.js --headings --base https://okami24.store (143/143)
  รอเจ้าของ (§7): หัวข้อ 3 จุดที่ 390 ยังจบคำโดด (เท่าเดิม) เอา thai-copy เสนอสั้น ≤15/ท่อนไหม · ครอป 25 จุดจาก build สุดท้าย+designer อีกรอบไหม · CategoryLabel NBSP en/zh 1 จุด (30.3ข) แก้ไหม · ลบภาพ 1.6 GB (ยังไม่ลบ)
  ถัดไป: 30.4ข (LAUNCH_AUDIT 49 + THAI_STYLE §6 รายการค้าง + 2D/2E) — 1 แชท 1 ก้อน
  ไม่แก้ (เจ้าของตัดสิน): 2F 1600MAH mono · #31 #34 iPhone · สั่งซื้อออนไลน์ปิด (ข้อ 43) → ไลน์ @okm24 · 53/31 · น้ำยา 0 · TPD VINCI S/G3 mini รอเช็คกล่อง
  agent: thai-copy (opus · ตาราง ก่อน→หลัง) · checker sonnet 5 ช่อง · designer (ครอป+ตัวเลข ไม่มี Bash) · ใส่ข้อห้าม build/server/taskkill/แก้ไฟล์ ในคำสั่งทุกตัว

กติกา context (เจ้าของ 2026-09-16): Code แจ้ง "ขอจบก้อนนี้ก่อน" แล้ว handoff เมื่อครบ 3 ก้อนในแชทเดียว หรือก่อนเริ่มงาน >30 นาที · เจ้าของแทรก handoff ได้ทุกเมื่อ
กฎ 2 ชั้น: ชั้น A ข้อความล้วน = build → render-check → checker → commit · ชั้น B แตะโครง/CSS/typography = สแกน wordbreak → ครอปจุดที่ธง → designer → checker · ประโยคใหม่ทุกประโยค = เจ้าของเคาะ · "ไม่" ห้ามอยู่ตำแหน่งเสี่ยง · ห้าม U+2060/NBSP นอกกลไก thai-typography.ts (เพิ่ม = เจ้าของเคาะ + จด §5/§6) · เรียก thaiTypography() ต้องมี locale guard (<ThaiText> สำหรับหน้าไทยล้วน) · ผูกอะไรแล้วต้องดูรอยตัดใหม่
ห้ามแตะ: layout · รูป · motion · ordering-mode.ts · ข้อความข้อ 43 · slug/URL/sitemap/structured data · /warranty ข้อความ · หน้าบริการข้อความ (ข้อ 49) · Hero.tsx · cinematic/ · กลุ่ม ก · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · ชื่อฟีเจอร์/สโลแกน · alt · title/meta 30.3ข นอกที่เคาะ · CategoryLabel.tsx · thai-typography.ts รายการ (คำตัดสินเจ้าของ)
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · ตัดสินเอง = ย้อนง่าย+ลูกค้าไม่เห็น แล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง + ด่าน: node scripts/thai-raw-chars-check.js = 0 · grep 8 คำห้าม (พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต) = 0 · head/JSON-LD 0 · en/zh text node ไทย 0 · ผู้แก้ไฟล์คนเดียวคือตัวหลัก
  · ปิด server: netstat -ano | grep ":<port>.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด · Chrome งานหนักทีละอย่าง (shot.js + wordbreak-scan พร้อมกัน = ช้า 3 เท่า)
  · สคริปต์เขียนด้วย Write tool เป็นไฟล์ (heredoc/node -e พังกับ backslash/regex/ไทย/backtick) · Write/Edit/sed กิน \uXXXX และ \p → String.fromCharCode / ยอมใช้อักขระไทยดิบใน regex · CRLF: sed -i ทำ LF → unix2dos ก่อน commit · ตรวจ git ls-files --eol · งาน >10 นาที = (bash script &) + until-loop เฝ้า log
  · Git Bash แปลง arg ขึ้นต้น "/" เป็นพาธ → MSYS_NO_PATHCONV=1 node scripts/wordbreak-scan.js …

เครื่องมือ: Browser pane ใช้ไม่ได้ → node scripts/shot.js out.png <url> --width 390|1440 [--desktop] [--wait ms] [--cookie okami24_locale=en] [--eval "<js>"]
  · สแกนจุดตัดบรรทัด: SITE_URL=https://okami24.store npx next build → start -p 3412 → MSYS_NO_PATHCONV=1 node scripts/wordbreak-scan.js --base http://localhost:3412 --widths 390,1440 --out _incoming/30.4c/wb-typo /path… (ทั้ง sitemap ~40–90 นาที) → node _incoming/30.4c/wb-diff.js <ก่อน> <หลัง> > diff.md
  · ครอปให้ designer: node _incoming/30.4c/typo-crops.js "<build>" [--only 1,2] [--out dir] (รายการ SPOTS ในไฟล์) · ด่านอักขระ: node scripts/thai-raw-chars-check.js · render: node _incoming/30.4c/typography-render-check.js [base] · node _incoming/30.4c/close-render-check.js --headings [--base …] · en/zh: bash _incoming/30.4c/typography-enzh-check.sh · unit: npx tsx _incoming/30.4c/typography-test.ts
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · npx tsx _incoming/30.4c/english-fields-5.ts (36) · node scripts/thai-raw-chars-check.js (0)
Git: commit แยกชนิด (feat/fix/copy/data/docs) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push เมื่อเจ้าของสั่ง · ห้าม merge เอง
รอเจ้าของ: §7 ข้อ 1–4 · TPD · #31 #34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -5 --oneline`** แล้วเทียบกับไฟล์นี้ — ถ้าไม่ตรงให้เชื่อ repo · ถ้า origin/main ขยับเกิน `f71b6a7` = Cowork merge ปิดรอบแล้ว → ยิงเว็บจริง 2 สคริปต์ (5.1 ข้อ 1) ทันที · ถ้า origin/checkpoint ยังไม่มี `4520498` = push ไม่สำเร็จ → push ก่อน
2. อ่าน §4 + §7 → ถามเจ้าของ 4 ข้อรวมชุดเดียว (ตอบ ใช่/ไม่) ก่อนเริ่ม 30.4ข
3. 30.4ข: เปิดที่ LAUNCH_AUDIT ข้อ 49 + THAI_STYLE §6 "รายการค้าง" · 1 แชท 1 ก้อน · ห้ามถ่ายภาพก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ
