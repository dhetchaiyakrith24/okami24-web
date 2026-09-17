# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-16 · แก้ 2026-09-17 (**ฉบับที่ 25.1** — รอบ 30.4ข ก้อน 1–2 live · กติกา context ใหม่ · ก้อน 3 ตัดสินแล้ว = เกลาของเดิม · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-16-v24.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD = feat-trust ก้อน 5 (+docs ก้อน 5 = ไฟล์นี้ · THAI_STYLE · LAUNCH_AUDIT) · `origin/main` **`74d13ea`** (PR #30 = ก้อน 3 · PR #29 = ก้อน 2 · PR #28 = ก้อน 1) · branch นำหน้า main = **ก้อน 4 (copy + docs) + ก้อน 5 (feat + docs)** — push 2026-09-17 รอ Cowork merge · **§16 อัปเดตหลัง push ตามกติกา context ใหม่ (ส่วนอื่นของไฟล์ยังเป็นสถานะตอนเปิดก้อน 3 — ยึด §16 ก่อน)**

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** 2026-09-17 `git fetch` → `origin/main` = `4d6fc6d` (PR #29 merge แล้ว) · **[เจ้าของบอก]** Cowork ตรวจเว็บจริงหลัง PR #29: "1600mAh · สูงสุด 35 วัตต์" จอคอม + "แบต 2000mAh · สูงสุด 35 วัตต์" มือถือ ขึ้นครบ — ไม่ต้องยิงสคริปต์ตรวจซ้ำ · ของเดิม 2026-09-16: `git fetch` + `git status` + `git log` · เว็บจริงหลัง PR #28: `close-render-check.js --headings --base https://okami24.store` = 152/152 · คำห้าม 0/105 · `<title>` คู่มือ MTL/DTL = "MTL กับ DTL ต่างยังไง — OKami24" · build ท้ายสุด (`_incoming/30.4b/build-k2e.log`): tsc · eslint · i18n 16/16 · commerce 16/16 · 53/31 · verify:catalog --full 20/20 · raw-chars 0 · render 152/152 · typography 36/36 · head/JSON-LD 0 · en/zh หลัง hydration 0/0 ×8 · server 3412 ปิดแล้ว (netstat 0) · `_incoming/30.4b` 12 MB · `_incoming/30.4c` 265 MB · `.git` 32 MB

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]**
> **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"** — เขียนแยกเสมอ
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก · §5 กลุ่ม ก · §6 typography · §7 ท้ายไฟล์ "รอบ 30.4ข ก้อน 1" และ "ก้อน 2"
> **ไฟล์คำสั่งรอบ 30.4ข ของเจ้าของ (2026-09-16) อยู่ในแชทที่เปิดรอบ ไม่ได้บันทึกเป็นไฟล์** — สรุปลำดับก้อนอยู่ที่ §5.1 ของไฟล์นี้ · ถ้าเจ้าของวางไฟล์นั้นซ้ำในแชทใหม่ ให้ยึดไฟล์ของเจ้าของ

---

## ข้อขัดแย้งที่พบ / บทเรียนเซสชันนี้

ทุกข้อ **[ตรวจแล้วจริง]**:

1. **คำสั่ง 1.4 ("หัวแถว /compare ~10px → ขยายให้เท่า label สเปก 0.65rem") ตั้งอยู่บนข้อมูลคลาด** — หัวแถวเป็น `text-[0.65rem]` (10.4px) มาตั้งแต่ก่อน = เท่า SpecChip อยู่แล้ว สิ่งที่ต่างคือสี (dim vs muted) · แก้สีแล้ว + เจ้าของเลือกเพิ่ม 12px เฉพาะจอ ≥lg ตาม designer
2. **คำสั่ง 1.2 (H2 หน้าแรกห่อที่ ~620px) วันนี้ตาไม่เห็นผล** — หัวข้อ H9 สั้นลงจนอยู่บรรทัดเดียวที่ 1440 ตั้งแต่ปิดรอบ 30.4ค · ตัด `max-w-xl` แล้วเพื่อกันอนาคต
3. **การ์ด legacy จอคอมมีแถวสเปกอยู่แล้ว** ("1600MAH · 5–35W" จาก `attributes` ไม่ดูว่า verified) — ไม่ใช่ "ของที่หน้ายังไม่มี" ตามชื่อรอบ · 6 ตัวเคยโชว์เลขที่หน้าสินค้าติดป้าย "ยังไม่ยืนยัน" (G4 Classic · G3 Pro KOKO · M Switch Kit · Zero Pro · Joiway F3 · F4) — ก้อน 2 ทำให้ว่างตามหลัก verified (เจ้าของรับ)
4. **`ProductHero.tsx` หน้าสินค้าก็โชว์ stats จาก attributes โดยไม่เช็ค verified เหมือนกัน** (บรรทัด ~103) — นอกขอบเขตก้อน 2 ไม่แตะ · จดไว้ §4
5. **"แบตเตอรี่ {mah}" ล้นการ์ดมือถือ** (วัดจริง 159px > 143px) — thai-copy ประมาณถูก · เจ้าของเคาะ "แบต" (คำล็อกใหม่ในตำแหน่งป้าย) จอคอม · มือถือ "{mah}" เฉย ๆ
6. **ครอป "ก่อน" จอคอมของก้อน 2 ถ่ายผิด build** (สคริปต์ before รันซ้ำหลัง rebuild) → ลบทิ้ง ใช้ `_incoming/30.4c/shots-k8/after/products-1440.png` เป็น before แทน · บทเรียน: **ถ่าย before ให้จบก่อน build เสมอ** และห้ามต่อคิวคำสั่งข้าม build
7. **สคริปต์ตาราง `k2-headline-table.ts` ไม่ได้จำลอง `showOptionCount`** → ตารางเคยพิมพ์ "1.0 โอห์ม · 1 ค่าโอห์ม" ทั้งที่หน้าเว็บตัดแล้ว (checker จับ) · แก้แล้ว — หลักฐานที่ generate ต้องจำลอง logic ของ component ให้ครบ
8. **wb-diff ระหว่างสแกนคนละ build เห็น "ใหม่ 3" ที่เป็นคำโปรยเดิม** (/products@1440 — ข้อความคำโปรยใน wb-typo เก่ากว่าปัจจุบัน) · ต้องเช็คว่า element ที่ธงเป็นของก้อนไหนก่อนนับ (บรรทัดสเปกถูกธง 0)
9. **`curl --cookie okami24_locale=en` ตรวจ en/zh ไม่ได้** — SSR เป็นไทยเสมอ (`LocaleProvider` เปลี่ยนภาษาหลัง hydrate) ใช้ `typography-enzh-check.sh` (Chrome) เท่านั้น
10. **ลิมิต 5 ชม. ของแชทชนกลางก้อน 2** — งานไม่หาย เพราะทุกขั้นเขียนไฟล์ใน `_incoming/30.4b/` · เจ้าของแจ้งแล้วทำต่อได้

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านพอต **OKami24** · Next.js 16 + TS + Tailwind v4 + SQLite · โฟลเดอร์ `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` HEAD `7f47c52` (+ไฟล์นี้) · **live `main` = `4d6fc6d`** (PR #29 = 30.4ข ก้อน 2 · PR #28 = ก้อน 1 · PR #27 = ปิดรอบ 30.4ค) · branch นำหน้า main 1 commit = docs v25 (จะตามไปกับ PR ถัดไป)
- **รอบ 30.4ข** (เพิ่มของใหม่ลงหน้า + ของค้างปิดรอบ): ก้อน 1–2 live · **ถัดไป ก้อน 3 คำนำหมวด = เกลาคำโปรยเดิม** (§5.1 · เจ้าของตัดสิน 2026-09-17)
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) → ไลน์ `@okm24` · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 · น้ำยา 0
- **checkpoint/จุดกลับ:** ก่อน 30.4ข = `62ef152` (= main b273929 ก่อน PR #28) · จบก้อน 1 = `73d4f3b` (= main de85914) · **จบก้อน 2 = `dea2a1e` (โค้ด) / `e6bd374` (docs) (= main 4d6fc6d)**

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว)

**[ตรวจแล้วจริง]** — ทั้งหมดใน v24 §2 (รอบ 30.4ค live ครบ) + รอบ 30.4ข:

- **ก้อน 1 `6ded138` (live)** — 1.1 หัวข้อ 3 จุด: K1 "พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม" (H1 + title + การ์ดหน้าแรก/ /guides) · K2 "MTL กับ DTL ต่างยังไง" (H1 + title + การ์ด) · K3 "Direct-to-lung (DTL) และ RDL" (H2) — ไม่มีคำโดดที่ 390 แล้ว (วัดจุดตัดจริง `_incoming/30.4b/k1-heading-lines.txt`) · 1.2 `GuideTeaserGrid.tsx` ตัด `max-w-xl` · 1.3 `CompareTool.tsx` `ScrollHintFrame` — เงาจาง + ลูกศร › (lucide) โผล่เฉพาะตอนยังมีคอลัมน์ทางขวา (วัด scrollWidth) ตารางไม่แตะ · 1.4 หัวแถว /compare สี `text-foreground-muted` + `lg:text-xs` (12px จอ ≥lg · มือถือคง 0.65rem)
- **ก้อน 2 `dea2a1e` (live · PR #29)** — สเปกเด่น 1 บรรทัดบนการ์ดทุกที่ (rail หน้าแรก · หน้าหมวด/แบรนด์/ /products · สินค้าใกล้เคียง · ค้นหา · รายการโปรด · ตัวช่วยเลือก): `src/lib/card-headline-spec.ts` เลือกจากแถวสเปก **verified เท่านั้น** ตามกติกาต่อหมวด (THAI_STYLE §7 "ก้อน 2") · `CardHeadlineSpec.tsx` (client) ประกอบคำจาก dictionary `catalog.card*` 3 ภาษา · ไทยผ่าน `thaiTypography()` · จอคอม "แบต 1600mAh · สูงสุด 35 วัตต์" (แทน "1600MAH · 5–35W") · มือถือ "1600mAh · สูงสุด 35 วัตต์" ระหว่างชื่อกับราคา (ราคาปิดท้าย · 0.65rem · truncate · การ์ดสูงขึ้น 18px เท่ากันทุกใบ) · การ์ด PM ชื่อหมวดออกจากแถวล่าง เหลือ สเปก · N ตัวเลือก · 38/53 ตัวมีบรรทัด (`_incoming/30.4b/k2-headline-table.md`)
- **docs `73d4f3b` `e6bd374`** — THAI_STYLE §7 สองหัวข้อใหม่ · LAUNCH_AUDIT หัว · MOBILE_SPEC 3.6

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-16 · 4 commit + docs · main ขยับ 1 ครั้ง = PR #28)

| ก้อน | commit | ผลตรวจ | สถานะ |
|---|---|---|---|
| 1 เก็บของค้าง | `6ded138` + docs `73d4f3b` | designer ก/ข/ข · checker 4/4 · render 152/152 · wordbreak 6 หน้า หาย 4 ใหม่ 0 · verify:catalog 20/20 | **live** (PR #28 · เว็บจริง 152/152) |
| 2 สเปกเด่นการ์ด | `dea2a1e` + docs `e6bd374` | thai-copy + writer ตรวจคำ · designer 1 รอบ (จอคอม ก · มือถือ ข · PM ค → แก้) · checker 5/5 · render 152/152 · typography 36/36 · en/zh 0/0 ×8 · wordbreak 8 หน้า บรรทัดสเปกถูกธง 0 · overflow 0 ทุกการ์ด · verify:catalog 20/20 | **live** (PR #29 · Cowork ตรวจเว็บจริงแล้ว [เจ้าของบอก]) |
| docs | `7f47c52` (v25) + ฉบับนี้ | — | — |

**คำตัดสินเจ้าของในเซสชันนี้ [เจ้าของบอก]:** หัวข้อ K1 ก · K2 ข · K3 ก · 1.4 ข (12px ≥lg) · sticky หัวแถว /compare = **ทำตอนปิดรอบ 30.4ข** · ผูก "พอตใช้แล้วทิ้ง/พอตซิสเต็ม" ใน thai-typography = **ยังไม่** · ก้อน 2: กติกาตาราง = ใช่ · 6 ตัวแถวว่าง = ยอม · มือถือ ข ชื่อ→สเปก→ราคา · คำ ข "แบต" · ก้อน 3 ไปแชทใหม่ · **2026-09-17: ก้อน 3 = เกลาคำโปรยเดิม ไม่เพิ่มย่อหน้าใหม่** (เหตุผล: `descriptionTh` เป็น meta description ด้วย — เพิ่มย่อหน้าใหม่ใต้ของเดิมจะซ้ำซ้อนติดกัน · เกลาให้ได้ 2–3 ประโยค 120–160 ตัวอักษร ใช้เป็นทั้ง meta และข้อความบนหน้าเหมือนเดิม · ไม่แตะโครง · รอบ SEO ค่อยแยก meta ถ้าจำเป็น) · **กติกา context ใหม่** (ดู 8.0 ข้อ 5)

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- **[ตรวจแล้วจริง] sticky หัวแถว /compare** — เลื่อนสุดขวาแล้วคอลัมน์หัวแถวหลุดจอ อ่านค่าไม่รู้แถวไหน (designer ก้อน 1 · ของเก่า) → `sticky left-0` ที่ `<th>` (มี `bg-surface-1` แล้ว + เส้นขอบขวาบาง) · **เจ้าของสั่ง: ทำตอนปิดรอบ 30.4ข**
- **[ตรวจแล้วจริง] 6 ตัวการ์ดแถวว่างเพราะสเปกไม่ verified** (G4 Classic แบต · G3 Pro KOKO แบต · M Switch Kit แบต · Zero Pro แบต · Joiway F3/F4 ทุกแถว) + PM ที่ไม่มีแถวเข้ากติกา 9 ตัว (coil-1/38/72 คอยล์หลายโอห์ม · coil-55/68/54 · iqosheet-18 · pod-159 · m-bar-pod) → **รอบข้อมูล** verify แถวสเปก · ห้ามใส่ placeholder แทน (designer)
- **[ตรวจแล้วจริง] `ProductHero.tsx` stats หน้าสินค้ายังดึง attributes โดยไม่เช็ค verified** (แบต/วัตต์/พัฟ/ความจุ 4 ช่องใต้ปุ่ม) — Joiway F3 โชว์ "650mAh · 12,000 พัฟ" ทั้งที่แถวสเปก unverified · นอกขอบเขต 30.4ข → เสนอรอบข้อมูลหรือรอบเก็บบ้าน (ใช้ `card-headline-spec.ts` แบบเดียวกันได้)
- **[ตรวจแล้วจริง] `src/components/catalog/PuffCount.tsx` ไม่มีใครเรียกแล้ว** (dead หลังก้อน 2) — ลบ = ถามเจ้าของ (13.4) → รอบเก็บบ้าน
- **[ตรวจแล้วจริง] ธง designer ก้อน 2 (copy):** คำโปรย M Bar 10K "…รองรับ 10,000 พัฟ" ซ้ำกับบรรทัดสเปกใต้มัน · Muro 3ML ชื่อ/คำโปรย/สเปก พูด "3mL" 3 รอบ → รอบ copy/ปิดรอบ · มือถือ 10.4px อยู่ขอบล่างของที่อ่านออก (เสนอ 11px [เชื่อว่า] ยังไม่วัด)
- **[ตรวจแล้วจริง] "1 สี / 1 ขนาด" บนการ์ด PM** (coil-56/74/87) เป็นของเดิม ไม่ใช่ข้อมูล — ไม่แตะ (thai-copy ธง)
- **ระดับ B ที่เกิดใหม่หลัง copy 12 จุด** (v24 §4 ข้อ 2) — ยังไม่ได้ให้ designer ดูครอป · ห้ามไล่แก้ (§14)
- **ข้อ 49 (หน้าบริการ · privacy OTP · FAQ ซ่อน · how-to-order)** = รอบตะกร้า · **#31 #34 → เจ้าของเช็ค iPhone** · ของเดิม v22 §4 (`priority` 2 จุด · taxonomy Coil-72/89 · `th.ts` dead strings · FAQ วิจัยซ่อน · คอมเมนต์ `relx.ts:19`)

---

## 5. รอสานต่อ (มีโครงแล้ว ต้องต่อยอด)

### 5.1 รอบ 30.4ข — ลำดับก้อนตามไฟล์เจ้าของ (2026-09-16) · ทุกก้อน = ชั้น B
1. ~~ก้อน 1 เก็บของค้าง~~ live
2. ~~ก้อน 2 สเปกเด่นบนการ์ด~~ live (PR #29)
3. **ก้อน 3 คำนำหมวด = เกลาคำโปรยเดิม (เจ้าของตัดสิน 2026-09-17)** — หน้าหมวด พอตซิสเต็ม · พอตใช้แล้วทิ้ง · หัวพอต/คอยล์ · IQOS/HNB (**ข้ามน้ำยา**) · ของเดิม = `categories.ts` ฟิลด์ `descriptionTh` (แสดงใต้ H1 ผ่าน `CategoryPageHeader` และเป็น meta description ด้วย) → **เกลาให้ได้ 2–3 ประโยค ยาว 120–160 ตัวอักษร** ใช้เป็นทั้ง meta และข้อความบนหน้าเหมือนเดิม · **ไม่เพิ่มย่อหน้าใหม่ ไม่แตะโครง** (รอบ SEO ค่อยแยก meta ถ้าจำเป็น) · เนื้อหา: หมวดนี้คืออะไร เหมาะกับใคร ในร้านมีแบรนด์อะไร (เฉพาะที่มีจริง) · ไม่มีตัวเลขยอดขาย/จำนวนรุ่นที่จะเก่า · คีย์เวิร์ดธรรมชาติ ไม่ยัด · thai-copy ≤2 แบบ/หมวด → เจ้าของเคาะไทย → writer แปล en/zh (`description`/`descriptionZh` คู่กัน) → build → ถ่าย 4 หน้า × 2 จอ → designer → เจ้าของดูภาพ → checker → commit feat-intro → push
4. **ก้อน 4 FAQ eyebrow ซ้ำ** — หน้าสินค้า eyebrow "คำถามที่พบบ่อย" + H2 "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" · เสนอ ก) eyebrow "FAQ" ข) "ถาม-ตอบ" · H2 คงเดิม · ทำทุกที่ที่ eyebrow+H2 ซ้ำ (นับก่อน) · commit copy-eyebrow
5. **ก้อน 5 แถบความมั่นใจก่อน footer** — 3–4 ข้อ: ของแท้ · ราคาตรง · บริการจริง (ตอบเอง ไม่ใช่บอท) · ข้อมูลเช็คกับเว็บทางการ — เฉพาะที่จริงวันนี้ ห้าม "ส่งฟรี" "รับประกัน" "จ่ายผ่าน…" · designer 2 แบบ (แถวเดียว / การ์ด 4 ใบ) 390+1440 → เจ้าของเลือก → commit feat-trust · ไอคอนเฉพาะที่มีในระบบ (lucide)
6. **ก้อน 6 ข้อเสนอ designer จาก 30.4ก ที่เหลือ** — ยกรายการจาก HANDOFF v21–v22 §4 "โครงหน้า จดไว้ 30.4ข" (FAQ eyebrow · anatomy "จากภายนอกสู่ภายใน" แต่ไล่บนลงล่าง · ลิงก์ "แหล่งที่มา" hover ฯลฯ) ให้เจ้าของเลือกทำ/ไม่ทำ · commit feat-designer
7. **ปิดรอบ** — sticky หัวแถว /compare (เจ้าของสั่ง) · `scripts/wordbreak-scan.js` ทุกหน้าที่แตะ + designer ดูเฉพาะจุดที่ธง → แก้ commit เดียว · รายงานปิดรอบต้องมี: รายการของใหม่ทั้งหมด (หน้าไหน · key อะไร) · wordbreak ก่อน/หลัง · ขนาดรีโป

**หลักทั้งรอบ (จากไฟล์เจ้าของ):** ข้อความใหม่ 3 ภาษา (contract test บังคับ) · ตัวเลขจากแถว verified เท่านั้น · ห้าม "ที่สุด" / health / price claim / ตะกร้า / ส่งฟรี · น้ำยา 0 = ข้าม · ข้อความใหม่ผ่าน `<ThaiText>`/thaiTypography · ห้ามเพิ่มรายการ thai-typography.ts เอง · หน้าบริการไม่แตะ · ทุกก้อน: build → ถ่าย 390+1440 → ส่งภาพให้เจ้าของเลือก → ค่อย commit · commit แยกชนิด · push ทุกก้อน

### 5.2 หลัง 30.4ข (เหมือน v24)
รอบเก็บบ้าน (คำสั่ง/เอกสาร/agent/HANDOFF ให้สั้น · PuffCount dead · ProductHero verified) → รอบ SEO → รอบบทความ → รอบข้อมูล (verify สเปก 15 ตัว · TPD) → รอบตะกร้า (+ข้อ 49) → ข้อ 45 → แอดมิน → QR → ข้อ 42 · 47/48 → รอบการขาย · รอบ label (`compare.rowDrawStyle`) · รอบ meta

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย

เหมือน v22 §6 (ข้อ 44 · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง)

## 7. คำถามที่เจ้าของต้องตอบ

| เรื่อง | รู้แล้ว | ยังไม่รู้ | ต้องตอบ |
|---|---|---|---|
| ~~ก้อน 3 "คำนำหมวด"~~ | **ตอบแล้ว 2026-09-17: เกลาของเดิม** (2–3 ประโยค 120–160 ตัวอักษร · meta + หน้า · ไม่แตะโครง) | — | — |
| ลบภาพ `_incoming/30.4c` 265 MB (shots/crops) | เจ้าของ 2026-09-16: ยังไม่ลบ | เมื่อไหร่ | — |
| ยังรอเหมือน v24 | TPD VINCI S/G3 mini · #31/#34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 | | |

## 8. ความเสี่ยงและจุดต้องระวัง

### 8.0 กฎ 2 ชั้น + ที่ตกผลึกรอบนี้
- **ทุกก้อน 30.4ข = ชั้น B:** สแกน wordbreak หน้าที่แตะ (ไม่ต้องทั้งเว็บ) → ครอปจุดที่ธง → designer · ถ่าย **before ให้จบก่อน build** (ข้อขัดแย้ง 6) · Chrome ทีละงาน
- **ของใหม่ทุกชิ้น เจ้าของต้องเห็นภาพก่อน commit** — แบบเสนอทำด้วย DOM override บน build เดียว (`k2-shots.js --spec-first --short-battery`) ถูกกว่า rebuild แต่ต้องถ่ายซ้ำบน build จริงก่อนปิด
1. **ตัวเลขบนหน้าเว็บต้องชี้แถวสเปก verified ได้** — `card-headline-spec.ts` เป็นแบบอย่าง · `ProductHero.tsx` ยังไม่ทำ (§4)
2. **NBSP/U+2060 เฉพาะตอน render** (`thai-typography.ts` + CategoryLabel เดิม) · ด่าน `thai-raw-chars-check.js` 0 · title/meta/JSON-LD 0 · en/zh text node ไทย 0 (`typography-enzh-check.sh` — curl ใช้ไม่ได้ ข้อขัดแย้ง 9)
3. **`thaiTypography()` ต้องมี locale guard** — `CardHeadlineSpec` ทำใน client ตาม locale · dictionary ผ่าน LocaleProvider · หน้าไทยล้วนใช้ `<ThaiText>`
4. **Cowork merge โดยไม่บอก** → `git fetch` ก่อนสรุปสถานะ (เซสชันนี้ PR #28 ถูก merge ระหว่างทำก้อน 2) · ห้าม merge เอง · ห้าม force push
5. **context (เจ้าของแก้กฎ 2026-09-17):** Code ไม่ต้องนับก้อนเอง · ทำต่อเนื่องจนจบรอบ หรือจนเจ้าของพิมพ์ handoff · ทุกครั้งที่ push ให้อัปเดต HANDOFF §16 สั้น ๆ (10 บรรทัด) เพื่อให้ปิดแชทตอนไหนก็ไม่เสียงาน
6. **หลัก "ที่สุด"/ยืนยันไม่ได้ = ไม่พูดทุกภาษา** · **overlay key / render-check / heredoc / CRLF / Git Bash `/`** เหมือน v23–v24 · `sed -i` → unix2dos ก่อน commit · ไฟล์ใหม่จาก Write tool = LF → unix2dos ก่อน `git add`
7. **สคริปต์ที่ generate หลักฐานต้องจำลอง logic ของ component ครบ** (ข้อขัดแย้ง 7)

## 9. ห้ามรื้อ
เหมือน v24 + `src/lib/card-headline-spec.ts` กติกาต่อหมวด (คำตัดสินเจ้าของ 2026-09-16) · dictionary `catalog.cardBattery/cardMaxWatt/cardResistance/cardCapacity` 3 ภาษา ("แบต" = คำล็อกในตำแหน่งป้าย) · ลำดับการ์ดมือถือ ชื่อ→สเปก→ราคา (MOBILE_SPEC 3.6) · การ์ด PM ไม่มีชื่อหมวดในแถวล่าง · `ScrollHintFrame` /compare · หัวข้อ K1–K3 · `lg:text-xs` หัวแถว /compare · ทุกแถวใน THAI_STYLE §7 "รอบ 30.4ข ก้อน 1/2"

## 10. Git
working tree ว่าง (เหลือไฟล์นี้) · main = `4d6fc6d` (PR #29 ก้อน 2 merge แล้ว) · branch นำหน้า main 1 commit docs v25 + ฉบับนี้ · ห้าม merge เอง · commit ถัดไปของรอบนี้: feat-intro (ก้อน 3) · copy-eyebrow · feat-trust · feat-designer · fix-close (sticky + wordbreak) · docs

## 11. ความพร้อมแต่ละระบบ
เหมือน v22 · ภาษาไทยทั้งเว็บ: 30.4ค ปิดครบ · 30.4ข 2/6 ก้อน live · การ์ดสินค้า: บรรทัดสเปกเด่น 38/53 ตัว (verified เท่านั้น)

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท
- ไม่มีงานค้างกลางทาง · ก้อน 2 live แล้ว (PR #29 · Cowork ตรวจเว็บจริงแล้ว — ไม่ต้องยิงสคริปต์ซ้ำ) · ก้อน 3 เริ่ม 2026-09-17 (ดู §16 บรรทัด "ก้อน 3")
- server 3412 ปิดแล้ว · ไม่มี process ค้าง
- เครื่องมือก้อน 1–2 ใน `_incoming/30.4b/` (gitignored): `k1-crops.js` · `k1-heading-lines.js/.txt` · `k1-checker-brief.md` · `k2-spec-census.ts/.md` · `k2-headline-table.ts/.md` · `k2-rule-table.md` · `k2-shots.js` (`--only` `--spec-first` `--short-battery` `--hide-phone-line`) · `crops-k1/` `crops-k2/{before,after,after-draft,after-specfirst,after-shortbat}` · `wb-k1/` `wb-k2/` + `wb-diff-k1/k2.md` · `enzh-k1.log` `enzh-k2e.log` · `verify-catalog-k1/k2.log` · `build-*.log` · `commit-k1/k2-*.txt` · `thai-style-append-k1/k2.md`

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)
1. วางบล็อก §16 → `git fetch` → เทียบ main กับ `4d6fc6d`
2. **ก้อน 3 คำนำหมวด = เกลาของเดิม** — thai-copy ≤2 แบบ/หมวด (ของเดิมทุกหมวดยาว 122–158 ตัวอักษร อยู่ในเกณฑ์แล้ว · `npx tsx _incoming/30.4b/k3-desc-len.ts`) → เจ้าของเคาะไทย → writer en (zh ใช้ en ตาม `CategoryPageHeader` เดิม) → build → ถ่าย 390+1440 → designer → เจ้าของดูภาพ → checker → commit feat-intro → push
3. ก้อน 4–6 ตามลำดับ §5.1 · ปิดรอบรวม sticky /compare

## 14. ควรหยุดทำ
- ห้ามถ่ายทั้งเว็บก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ (เจ้าของบอก "ยังไม่ผูก" พอตใช้แล้วทิ้ง/พอตซิสเต็ม) · ห้ามรัน Chrome 2 งานพร้อมกัน
- ห้ามไล่แก้คำโดดระดับ B · ห้ามใส่ placeholder แทนแถวสเปกว่าง · ห้ามเปลี่ยน CategoryLabel/label-lang/lg:min-h-10
- ห้ามแก้ `ProductHero.tsx` stats / ลบ `PuffCount.tsx` ในรอบนี้ — รอบเก็บบ้าน/ข้อมูล
- ก้อน 3: ห้ามเพิ่มย่อหน้าใหม่ใต้คำโปรย · ห้ามเพิ่มฟิลด์/แตะโครง `CategoryPageHeader` (เจ้าของตัดสิน 2026-09-17)

## 15. ปลายทางของโปรเจกต์
เหมือน v21 §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD = docs ก้อน 5 (ต่อจาก feat-trust ก้อน 5 · fa01d88 docs ก้อน 4 · 1965393 copy ก้อน 4) · origin/main 74d13ea (PR #30 = 30.4ข ก้อน 3 live) · branch นำหน้า main = ก้อน 4 + ก้อน 5 push แล้ว 2026-09-17 รอ Cowork merge (git fetch ก่อนเชื่อ)
  Cowork merge + deploy โดยไม่บอกในแชท → git fetch ก่อนสรุปสถานะเสมอ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md ฉบับ 25.1 (ข้อขัดแย้ง 1–10 · 4 · 5.1 · 8.0)
  → docs/THAI_STYLE.md (§3 คำล็อก · §5 กลุ่ม ก · §6 typography · §7 ท้ายไฟล์ "รอบ 30.4ข ก้อน 1" + "ก้อน 2")
  → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน" (ห้ามอ่านทั้งไฟล์) · docs/MOBILE_SPEC.md 3.6
  → ไฟล์คำสั่งรอบ 30.4ข ของเจ้าของ (ถ้าเจ้าของวางซ้ำ ให้ยึดไฟล์นั้น · สรุปอยู่ HANDOFF 5.1)

สถานะ: รอบ 30.4ข = เพิ่มของใหม่ลงหน้า + ของค้างปิดรอบ · ทุกก้อน ชั้น B
  ก้อน 1 live (หัวข้อ K1–K3 · H2 max-width · /compare ตัวบอกเลื่อน + หัวแถว 12px ≥lg) · ก้อน 2 live (บรรทัดสเปกจาก verified เท่านั้น 38/53 · "แบต 1600mAh · สูงสุด 35 วัตต์" · มือถือ ชื่อ→สเปก→ราคา · การ์ด PM ไม่มีชื่อหมวด · Cowork ตรวจเว็บจริงแล้ว)
  ก้อน 3 live (PR #30): เกลาคำโปรย 6 หมวด th+en · กวาด "ไม่เผาไหม้"/"เปลี่ยนจากบุหรี่มวน" 3 ภาษา + brands UWELL/JOIWAY/IQOS · คำล็อกใหม่ "อุ่นยาสูบ" · ห้าม "ไม่เผาไหม้" ทุกภาษา (THAI_STYLE §3 + §7 "ก้อน 3" · ภาพ _incoming/30.4b/crops-k3)
  ก้อน 4 push แล้ว (รอ merge): eyebrow ซ้ำหัวข้อ — FAQ หน้าสินค้า "ถาม-ตอบ" (zh "问答" · en "FAQ") · /search eyebrow = footer.tools "เครื่องมือ" · ไม่แตะ: สถานะคำสั่งซื้อ · /favorites จีน (LAUNCH_AUDIT ข้อ 44) · THAI_STYLE §7 "ก้อน 4"
  ก้อน 5 ตรวจผ่านตามเกณฑ์ + push แล้ว (รอ merge): แถบความมั่นใจ src/components/layout/TrustBar.tsx ใน layout.tsx เหนือ Footer ทุกหน้า · dictionary trust.items 3 ภาษา (ชุด ก · ข้อ 1 บรรทัดสั้น "จากแบรนด์ที่เรามั่นใจ") · แบบแถว (1440 4 ช่อง 128px · 390 2×2 ไอคอนบน 292px · py-8/lg:py-10) · ไอคอน lucide CheckCircle2/Tag/MessageCircle/Globe · ไม่ใส่ข้อ 5 เคลม · designer ก (ข้อสังเกต ข: 390 ข้อ 2 "ไม่ | ปั่นราคา" รับได้ · ทางเลือก "…ที่ขายจริง ไม่ปั่นราคา" ถ้าเจ้าของอยากแก้) · checker ผ่าน · THAI_STYLE §7 "ก้อน 5" · ภาพ _incoming/30.4b/crops-k5 (sheet-final.png · sheet-final-desktop.png · sheet-options.png)
  จดเสนอรอบหน้า (เจ้าของสั่งไม่แก้ในก้อน 5): footer.tagline "OKami24 — ของแท้ ราคาตรง บริการจริง …" ซ้ำกับแถบในจอเดียว → ตัด 3 คำเหลือ "OKami24 — พอตทุกแบบ และน้ำยา จากคนขายที่รู้จักสินค้าจริง ซื้อแล้วยังดูแลต่อ" (+en/zh) — tagline เคาะแล้ว 30.3 E-2 ต้องเจ้าของเคาะใหม่
  หลัง merge ยิงเว็บจริง: curl -s https://okami24.store/products/caliburn-g5 | grep -c "ถาม-ตอบ" (>0) · curl -s https://okami24.store/ | grep -c "data-trust-bar" (1) · curl -s https://okami24.store/ | grep -c "ไม่ปั่นราคา" (1)
  เครื่องมือก้อน 3 (_incoming/30.4b): k3-shots.js <before|after> [--only …] [--locale en|zh] (ครอปหัวหน้า + วัดบรรทัดจริง · ผลใน crops-k3/<tag>/index.md) · k3-variant.js <json> (ลองข้อความใหม่บนหน้าโดยไม่ build — ไทยต้องมาจากไฟล์ json ห้ามส่งทาง argv) · k3-sheets.js (ภาพรวม before/after) · k3-desc-len.ts · k3-category-facts.ts · brief: k3-thai-copy/writer/designer/checker-brief.md · ก้อน 4: k4-eyebrow-pairs.ts (นับคู่ eyebrow/หัวข้อ 3 ภาษา) · k4-shots.js <tag> [--faq-file f] [--search-file f] (ครอป + override eyebrow ในหน้า · ไทยผ่านไฟล์) · k4-sheets.js <out> <tag…> · k4-brief.md · ก้อน 5: k5-shots.js <tag> [--variant row|cards] [--only w] [--locale l] (ครอปแถบ+หัว footer 3 หน้า · วัดความสูง/บรรทัด) · k5-sheets.js / k5-sheet-desktop.js · brief: k5-thai-copy/writer/designer-brief.md
  ถัดไป (เจ้าของแก้แผน 2026-09-17 เพราะโควตา Fable 100%/all 83% รีเซ็ตอาทิตย์ 22:00): **ปิดรอบ + ก้อน 6 รวมเป็นรอบเดียว** = sticky หัวแถว /compare (เจ้าของสั่ง) + ข้อเสนอ designer 30.4ก ที่เหลือ (HANDOFF v21–v22 §4 "โครงหน้า จดไว้ 30.4ข" ให้เจ้าของเลือกทำ/ไม่ทำ) + wordbreak-scan หน้าที่แตะรอบนี้ (หมวด 6 · แบรนด์ 3 · tobacco-style · หน้าสินค้า FAQ · /search · แถบ TrustBar ทุกหน้า) → designer ดูเฉพาะจุดที่ธง → commit เดียว → push · รายงานปิดรอบต้องมี: รายการของใหม่ทั้งหมด (หน้าไหน · key อะไร) · wordbreak ก่อน/หลัง · ขนาดรีโป · ถ้าโควตาใกล้หมด: push เท่าที่ทำได้ + §16 แล้วหยุด รอเจ้าของสั่งวันอาทิตย์
  เจ้าของตัดสินแล้ว ห้ามถามซ้ำ: ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · M1b ปิด · CategoryLabel NBSP en/zh คงไว้ · ยังไม่ผูก "พอตใช้แล้วทิ้ง/พอตซิสเต็ม" ใน thai-typography · 6 ตัวการ์ดแถวว่าง (สเปกไม่ verified) รับได้ → รอบข้อมูล · ภาพ _incoming/30.4c 265 MB ยังไม่ลบ · 2F 1600MAH mono ไม่แก้ · #31 #34 iPhone
  agent: thai-copy (ตาราง ก่อน→หลัง) · writer (en/zh) · checker 5 ช่อง · designer (ครอป+ตัวเลข ไม่มี Bash) · ใส่ข้อห้าม build/server/taskkill/Chrome/แก้ไฟล์ ในคำสั่งทุกตัว

กติกา context (เจ้าของ 2026-09-17): Code ไม่ต้องนับก้อนเอง · ทำต่อเนื่องจนจบรอบ หรือจนเจ้าของพิมพ์ handoff · ทุกครั้งที่ push ให้อัปเดต HANDOFF §16 สั้น ๆ (10 บรรทัด) เพื่อให้ปิดแชทตอนไหนก็ไม่เสียงาน
กฎ 2 ชั้น: ทุกก้อนรอบนี้ = ชั้น B → build → ถ่าย before ให้จบก่อน build ใหม่ → ถ่าย after 390+1440 → designer → เจ้าของเลือกภาพ → checker → commit · ข้อความใหม่ทุกประโยค = 3 ภาษา + เจ้าของเคาะไทย · ตัวเลขทุกตัวชี้แถวสเปก verified (แบบอย่าง src/lib/card-headline-spec.ts) · ห้าม U+2060/NBSP นอกกลไก · thaiTypography() ต้องมี locale guard · ผูกอะไรแล้วต้องดูรอยตัดใหม่ · หลักฐานที่ generate ต้องจำลอง logic ของ component ครบ
ห้ามแตะ: layout นอกจุดที่ระบุ · รูป · motion · ordering-mode.ts · slug/URL/sitemap/structured data · หน้าบริการ · Hero.tsx · cinematic/ · กลุ่ม ก · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · ชื่อสี/กลิ่น · thai-typography.ts รายการ · CategoryLabel.tsx · card-headline-spec.ts กติกา · dictionary catalog.card* · ProductHero stats / PuffCount (รอบเก็บบ้าน)
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · ตัดสินเอง = ย้อนง่าย+ลูกค้าไม่เห็น แล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout รวมชุดเดียว · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง + ด่าน: node scripts/thai-raw-chars-check.js = 0 · grep 8 คำห้าม (พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต) = 0 · head/JSON-LD 0 · en/zh text node ไทย 0 (curl ตรวจไม่ได้ — SSR ไทยเสมอ ใช้ typography-enzh-check.sh) · ผู้แก้ไฟล์คนเดียวคือตัวหลัก
  · ปิด server: netstat -ano | grep ":3412.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด · Chrome ทีละงาน (shot/scan/enzh) · งาน >10 นาที = (cmd &) + เฝ้า log
  · สคริปต์เขียนด้วย Write tool (heredoc/node -e/python พังกับ backslash/regex/ไทย · python ไม่มีในเครื่อง) · Write/Edit/sed กิน \uXXXX และ \p → String.fromCharCode · CRLF: sed -i และไฟล์ใหม่จาก Write = LF → unix2dos ก่อน git add · ตรวจ git ls-files --eol · Git Bash แปลง arg "/" → MSYS_NO_PATHCONV=1

เครื่องมือ: Browser pane ใช้ไม่ได้ → node scripts/shot.js out.png <url> --width 390|1440 [--desktop] [--wait ms] [--viewport] [--reduced-motion] [--cookie okami24_locale=en] [--eval "<js>"] · หน้าแรกจอคอมมี intro vh-sized → full-page y เพี้ยน ใช้ --viewport --reduced-motion + eval translateY (ดู _incoming/30.4b/k2-shots.js)
  · ครอปการ์ด before/after: node _incoming/30.4b/k2-shots.js <before|after> [--only 390|ชื่อ] [--spec-first] [--short-battery] · ครอปหัวข้อ: node _incoming/30.4b/k1-crops.js · วัดจุดตัดหัวข้อ: node _incoming/30.4b/k1-heading-lines.js
  · สแกนจุดตัดบรรทัด: MSYS_NO_PATHCONV=1 node scripts/wordbreak-scan.js --base http://localhost:3412 --widths 390,1440 --out _incoming/30.4b/wb-<ก้อน> /path… → node _incoming/30.4c/wb-diff.js _incoming/30.4c/wb-typo _incoming/30.4b/wb-<ก้อน> > diff.md (ข้อความคำโปรยใน wb-typo เก่ากว่าปัจจุบัน — เช็ค element ที่ธงว่าเป็นของก้อนไหน)
  · render: node _incoming/30.4c/close-render-check.js --headings [--base …] (152) · node _incoming/30.4c/typography-render-check.js [base] (36 · head 0) · en/zh: bash _incoming/30.4c/typography-enzh-check.sh (~10 นาที) · ตารางสเปกการ์ด: npx tsx _incoming/30.4b/k2-headline-table.ts
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · node scripts/thai-raw-chars-check.js (0)
Git: commit แยกชนิด (feat/fix/copy/data/docs) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push ทุกก้อนหลัง checker ผ่าน (เจ้าของสั่งในไฟล์รอบ) · ห้าม merge เอง
รอเจ้าของ: TPD · #31 #34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 · ลบภาพ 265 MB
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -5 --oneline`** แล้วเทียบกับไฟล์นี้ — ถ้าไม่ตรงให้เชื่อ repo · ถ้า origin/checkpoint ยังไม่มี commit ล่าสุดของไฟล์นี้ = push ไม่สำเร็จ → push ก่อน
2. ก้อน 4 + 5 จบแล้ว (push 2026-09-17) → ถ้า main ขยับเกิน `74d13ea` = merge แล้ว → ยิงเว็บจริง 3 คำสั่งใน §16 → **รอเจ้าของสั่งเริ่ม "ปิดรอบ + ก้อน 6"** (โควตาเจ้าของรีเซ็ตวันอาทิตย์ 22:00 — อย่าเริ่มเองถ้าเจ้าของยังไม่พิมพ์)
3. ทำตามลำดับ §5.1 ข้อ 3 · ถ่าย before ก่อน build · ห้ามถ่ายทั้งเว็บก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ
