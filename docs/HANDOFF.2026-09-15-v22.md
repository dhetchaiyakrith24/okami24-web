# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-15 (**ฉบับที่ 22** — รอบ 30.4ค ก้อน 1–6 เสร็จ · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-15-v21.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD **`6514577`** · `origin/main` **`8edac8f`** (PR #23 = ก้อน 3–4 · branch **นำหน้า main 7** = ก้อน 5–6 + docs รอ Cowork merge) · working tree สะอาด (ก่อนเขียนไฟล์นี้)

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** `git fetch` + `git status` + `git log` · ยิง `okami24.store`: `/products/caliburn-g4-pro` label สเปกไทย + CSS แบบ A + ค่า "1800mAh ในตัว" · การ์ดความเข้ากันได้ "หัวพอต UWELL GPP" · `/products/m-switch-kit` bullet เหมาะกับใครไทย = **ก้อน 1–4 live** · ก้อน 5–6 ยังไม่ live (รอ merge) · render บน build ท้ายสุด (`_incoming/30.4c/render-check-*.txt`): สเปก 152/152 · ความเข้ากันได้ 56/56 · เหมาะกับใคร 49/49 · FAQ 11/11 · แคปชัน 8/8 · คำโปรย 3/3 · anatomy 15/15 · `english-fields-5.ts` = **36** (จาก 492) · `count-storefront.ts` = 53/31 · raw U+2060 = 0 · `git count-objects` size-pack 25.27 MiB · `_incoming/` **1.4 GB** (ลบชุด ก 458 MB แล้ว · เพิ่ม shots-k1/k5/k6 ≈0.5 GB)

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]**
> **"ตรวจผ่านตามเกณฑ์" (checker/designer อิสระ + หลักฐาน) ≠ "เจ้าของอนุมัติ"** — เขียนแยกเสมอ
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก (รวม 30.4ค ก้อน 1–6 = +24 คำ) · §5 กลุ่ม ก · §6 · §7 "รอบ 30.4ค" ทุกตารางที่เคาะ (ก้อน 1–6)

---

## ข้อขัดแย้งที่พบ / บทเรียนเซสชันนี้

ทุกข้อ **[ตรวจแล้วจริง]**:

1. **ผิดกฎ 13.6 ข้อ "context 600K ต้องแจ้ง 'ขอจบก้อนนี้ก่อน'"** — เซสชันนี้ทำถึง ~760K โดยไม่แจ้ง เจ้าของจับได้ · สาเหตุ: ตัวนับที่ตัวหลักเห็นคือ "โทเคนที่เหลือ" (15M) ไม่ใช่ขนาด context ที่ใช้ไป จึงไม่มีสัญญาณ · **บทเรียน/กติกาใหม่:** นับจากงาน ไม่รอตัวเลข — **1 เซสชัน = ไม่เกิน 3 ก้อน (thai-copy + checker + designer ต่อก้อน ≈ 150–250K)** · จบก้อนที่ 3 หรือเมื่อ agent ส่งรายงานยาวเกิน 5 ตัวแล้ว = แจ้ง "ขอจบก้อนนี้ก่อน" แล้ว handoff · เซสชันนี้ทำ 6 ก้อน = มากเกินไป 2 เท่า
2. **v21 บอก "ทำก้อน 1 แบบชั้น A"** — เจ้าของเปลี่ยนเป็นชั้น B ทันทีที่เห็นว่า label ไทยจะอยู่ใน `.label-mono` (ดึงส่วน CSS ของข้อ 36 มาทำก่อน) · ก้อน 5 แกลเลอรี และก้อน 6 anatomy ก็เป็นชั้น B ด้วยเหตุผลเดียวกัน/ซ่อนแถว · **กติกาที่ตกผลึก:** ข้อความไทยตัวไหนไปอยู่ใน `.label-mono` = ต้องแก้ CSS แถวนั้น (`font-sans! font-medium tracking-normal! normal-case! text-foreground-muted` + ขนาด 0.65rem) = ชั้น B
3. **checker ตก 2 ครั้งเพราะตัวหลัก:** ก้อน 3–4 หลักฐาน /compare ไม่ได้ลงไฟล์ (พิมพ์ออกจอหลัง tee) + เกณฑ์ "grep คำห้าม = 0" เขียนกำกวม (เกณฑ์จริง = 8 คำ) · ก้อน 6 บั๊กจริง `ProductAnatomy.tsx` regex `/s+/g` (ตก `\` จาก heredoc) ทำให้อังกฤษ "colour di play" — checker จับได้ก่อน push · **บทเรียน:** โค้ดที่มี backslash/regex/ไทย ห้ามผ่าน heredoc — ใช้ Edit/Write tool เท่านั้น (ย้ำกฎเดิม 8.10)
4. **designer อ่านความสูงไฟล์กลับด้าน 2 ครั้ง** (ก้อน 5 g5-390 · ก้อน 6 run1) — ตัวหลักเช็คไฟล์เองก่อนเชื่อ (`readUInt32BE(20)`) · designer ไม่มีเครื่องมือวัด ต้องให้ตัวเลขไปพร้อมครอปเสมอ
5. **หัว LAUNCH_AUDIT เขียน main = `8edac8f`** ตรงของจริงตอนเขียน · Cowork merge PR #22 (ก้อน 1–2) และ #23 (ก้อน 3–4) ภายในวันเดียว — **`git fetch` ก่อนสรุปสถานะเสมอ**

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านขายพอต/บุหรี่ไฟฟ้า **OKami24** แปลงมาจากเดโม NOVA VAPOR · Next.js **16** (App Router · Turbopack) + TypeScript + Tailwind **v4** + SQLite
- **โฟลเดอร์:** `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · **GitHub:** `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` · **HEAD `6514577`** (ไฟล์นี้ commit ถัดไป) · **branch live:** `main` = **`8edac8f`** (PR #23) · **รอ merge 7 commit** = ก้อน 5 (4) + ก้อน 6 (2) + docs
- **เว็บจริง:** `https://okami24.store` — รอบ 30.1 · 30.2 · 30.3ก · 30.3ข · 30.4ก · **30.4ค ก้อน 1–4** ขึ้นเว็บครบ
- **รอบ 30.4ค (ไฟล์คำสั่ง Cowork 2026-09-14 · เจ้าของวางในแชท):** ก้อน 1–6 เสร็จ ตรวจผ่านตามเกณฑ์ (ดูข้อ 3) · **เหลือ ก้อน 7 · 8 · 9 + ขั้นปิดรอบ** (ข้อ 5.1)
- **อังกฤษบนหน้าสินค้า (นับจากซอร์ส `_incoming/30.4c/english-fields-5.ts`): 492 → 36** — ที่เหลือทั้งหมด = ค่าสเปกที่เป็นตัวเลข/หน่วย/ชื่อรุ่น (5–35W · USB-C · GENE.TT 3.0 …) ซึ่งคงตามกฎ · ชื่อสี 154/กลิ่น 191/ชื่ออะไหล่ 34/ชื่อฟีเจอร์ 2 = ชั้น 1 ไม่นับ
- **Render:** Standard 1 CPU / 2GB · **[เจ้าของบอก]** OOM ไม่มีใครรายงานว่าเกิดซ้ำ แต่ยังไม่มีใครเฝ้าครบ
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) — ลูกค้าซื้อทางไลน์ `@okm24` · **ห้ามเสนอเปิด ห้ามเขียนข้อความพาไปตะกร้า**
- **สินค้าบนหน้าร้าน 53 (ซื้อได้ 31)** จาก `count-storefront.ts` เท่านั้น · น้ำยาบนหน้าร้าน 0
- **checkpoint tags:** `pre-30.1-2026-09-09` · `pre-30.2-2026-09-10` · จุดก่อน 30.4ค = `ebd288b` · จุดจบก้อน 1–2 = `4d87b80` · จบก้อน 3–4 = `310477e` · จบก้อน 5–6 = `660cbe2`

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว)

**[ตรวจแล้วจริง]** — เหมือน v21 §2 ทั้งหมด (ดูไฟล์เก่า) + เพิ่ม:

- **โครง overlay ภาษาไทยของหน้าสินค้า legacy 35 หน้า ครบทุกบล็อก** — `src/i18n/product-copy-th.ts` (tagline · shortDescription · features · specifications · whoIsThisFor · faqs) · `spec-labels-th.ts` · `compat-copy-th.ts` · `gallery-copy-th.ts` · `anatomy-copy-th.ts` (ทั้ง 4 ไฟล์หลัง key ด้วยข้อความอังกฤษ) · dictionary `product.galleryNote` + `product.anatomy.*` 3 ภาษา · component อ่านเมื่อ th: `SpecSheet` `SpecChip` `CompareTool` `CompatibilitySection` `ProductFAQ` `ProductGallery` `ProductAnatomy` · en/zh เห็นข้อมูลเดิม
- **CSS แถวไทยใน `.label-mono` 2 จุด** (SpecChip label · ProductGallery figcaption) = `font-sans! font-medium tracking-normal! normal-case! text-foreground-muted` (+`text-[0.65rem]` ที่ figcaption) เฉพาะ th
- **สคริปต์ตรวจ render ต่อบล็อก** ใน `_incoming/30.4c/`: `spec-render-check.js` · `spec-values-render-check.js` · `compat-whofor-render-check.js` · `k5-render-check.js` · `anatomy-render-check.js` · `faq-answers-eval.sh` (คำตอบ FAQ render เฉพาะตอนเปิด) · `locale-eval-*.sh/txt` (en/zh หลัง hydration — HTML static เป็นไทยเสมอ curl พิสูจน์ en/zh ไม่ได้ ต้องใช้ shot.js --cookie --eval)

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-15 · 20 commit · main ขยับ 2 PR)

**[ตรวจแล้วจริง]** ทุกก้อน: thai-copy ตาราง → เจ้าของเคาะ → apply → build → render-check → checker (+designer เมื่อชั้น B) → commit แยกชนิด → push · ประโยคที่เคาะทุกประโยคอยู่ใน THAI_STYLE §7 "รอบ 30.4ค"

| ก้อน | ชั้น | commit | สรุป |
|---|---|---|---|
| 1 label สเปก | B | `3609684` copy · `de2f739` /compare · `040ff25` CSS · `7e3204f` docs | 41 label → 35 คำไทย (overlay key ด้วย label อังกฤษ) · /compare ใช้ชุดเดียวกัน · CSS แถว label ไทย + designer แบบ A (น้ำหนัก 500 สี muted) · M Switch "พัฟต่อหัวพอต" · **live PR #22** |
| 2 value สเปก | A | `8d96d84` copy · `4d87b80` docs | 116/152 ค่าไทย (36 คงตัวเลข/ชื่อรุ่น) · 7 ช่อง "—" · TPD คง 3 จุด (§6) · ตามแก้ 6 จุด · **live PR #22** |
| 3 ความเข้ากันได้ | A (+data) | `0581b15` data · `b63beda` copy · docs ใน `310477e` | ชื่อ 8/13 แปล · โน้ต 12 · โน้ต 5V/2A ออกจาก 7 รุ่น Caliburn ทุกภาษา · **live PR #23** |
| 4 เหมาะกับใคร | A | `e92145e` copy · `310477e` docs | 49 ประโยค · /compare ข้อ [0] · ตัด "ที่สุด" 6 จุด · **live PR #23** |
| 5 FAQ/แกลเลอรี/tagline | B (แกลเลอรี) | `0db03af` FAQ · `7d2c767` แกลเลอรี · `85131a7` CSS · `3ec57ba` tagline | FAQ 11 คู่ · แคปชัน 8 + คำโปรย (dictionary 3 ภาษา · ประโยคไทยเขียนใหม่หลัง designer พบตัด "ไม่/ได้" ที่ 390) · แคปชัน 0.65rem · tagline "แพลตฟอร์ม" 3 ตัว · **รอ merge** |
| 6 anatomy | B | `ebd876b` data · `660cbe2` copy · `6514577` docs (5+6) | label/detail → dictionary 3 ภาษา · chargingType map · **ซ่อนแถว "ช่องลม" G5/ARGUS G4** (ไม่มีข้อมูล) · G5 chargingType "USB-C" · en podDetail ตัด "capacity" · **รอ merge** |

- **ลบ `_incoming/` ชุด ก 458 MB** (30.3b ภาพ · 30.4 shots/crops ทุกชุดยกเว้น k6 · เก็บสคริปต์ทุกตัว + โฟลเดอร์แบรนด์) — เจ้าของสั่ง 2026-09-15
- **ยืนยันจากเจ้าของ:** ประโยค VMATE i3 การ์ด slim-body ใช้ได้

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- **[ตรวจแล้วจริง]** **ก้อน 7 กวาด "ที่สุด" + คำค้าง (ไทย+อังกฤษ) — รายการที่เจ้าของรับแล้ว:** VMATE i3 "เบาที่สุด" (`product-copy-th.ts` shortDescription · `voopoo.ts` "lightest current pod kit" · tagline ไทย "น้ำหนักเบาพิเศษ" — ไม่มีน้ำหนักในสเปก · G3 mini บางกว่า 13.7 vs 15.1mm) · zero-nano tagline/`salthub.ts` "smallest" · zero-pro `salthub.ts` "smaller than the M Switch Kit" · G4 Pro `whoIsThisFor` อังกฤษ "biggest screen" + tagline/การ์ด "2.51 นิ้ว" ทั้งที่แถวสเปกติด "ยังไม่ยืนยัน" (§6) · Joiway F3/F4 เสียงวิจัยฝั่งอังกฤษ (`joiway.ts` whoIsThisFor) · label "ความต้านทาน" บนหน้าหัวพอต/คอยล์ PM 3 จุด (`active-catalog-to-product-master.ts`) + `pilot.axisResistance` → "โอห์ม" · "Type-C" vs "USB-C" ปนบนหน้าเดียว (การ์ด/คำบรรยาย ARGUS G4 · DRAG S3 · M Bar 15K) · "แพลตฟอร์ม" 4 จุดใน `technology-copy.ts` :32 :38 :39 :58 · คำบรรยาย G5 Lite "ในราคาที่ย่อมเยากว่า" → ตัด (เจ้าของสั่ง) · **researcher ชี้ขาดจากเว็บทางการ VOOPOO:** `technology.ts:29`/`technology-copy.ts:38` บอกหัวพอต ARGUS "เปลี่ยนแค่คอยล์" แต่หน้าสินค้า ARGUS G4 บอกเปลี่ยนทั้งหัว (ห้ามเดา — เจ้าของสั่ง) · "ความเข้ม" (คู่มือ) vs "ความเข้มข้น" (FAQ · Finder) นิโคติน 2 รูป · สเปกไทยของสินค้า PM ใช้ลูกน้ำคั่น + "เติมน้ำยามาแล้ว" ต่างจาก legacy "บรรจุสำเร็จ" · m-bar-9k "DTL โปร่ง ๆ" vs "โล่ง"
- **[ตรวจแล้วจริง]** **ก้อน 8 ช่องไฟ+ไทยติดอังกฤษ 188 จุด** (LAUNCH_AUDIT ข้อ 36 — ส่วน CSS ทำไปแล้ว 2 จุดในก้อน 1/5 · เหลือเนื้อความ · commit แยก · ดูรายจุด ห้าม replace ทั้งหมด)
- **[ตรวจแล้วจริง]** **ก้อน 9 หนัก 2 = 113 ประโยค** (`_incoming/30.4/scan-A-ui-service.md` · `scan-B-product-editorial.md`) — เจ้าของตัดสินหลังเห็นก้อน 1–8 ว่าเอาไหม (ค่าตั้งต้น = ทำ)
- **[ตรวจแล้วจริง]** **โครงหน้า จดไว้ 30.4ข:** หัว FAQ eyebrow "คำถามที่พบบ่อย" ซ้อน title "คำถามที่พบบ่อยเกี่ยวกับอุปกรณ์นี้" · หัวข้อ anatomy "ส่วนประกอบจากภายนอกสู่ภายใน" แต่จุดไล่บนลงล่าง · ลิงก์ "แหล่งที่มา" ในแถวแคปชันไทย hover ไม่เปลี่ยนสี (สี muted เท่าข้อความแล้ว) · หัวแถวไทยบน /compare ยังเป็น mono+ช่องไฟ (เจ้าของสั่งไม่แตะนอกตารางสเปก) · /compare แถวหน้าจอโชว์ `0.85"` + chargingType อังกฤษดิบ · anatomy ไทยที่ 1440 ดูเล็กกว่าอังกฤษ (สัดส่วนฟอนต์ไทย `text-sm`) · ของเดิมจาก v21 §4 (ป้ายไทยดูเล็ก/บาง · การ์ดไม่มีราคา · finder 1440 ปุ่มแชท · joiway-f4 "รีวิว" 2 ครั้ง · about eyebrow อังกฤษ · rail เรือธง 3 ใบไม่มีรูป)
- **[ตรวจแล้วจริง]** `priority` ตายใน Next 16 2 จุด · taxonomy Coil-72/89 · M Switch/Zero pod-kit → รอบข้อมูล · `th.ts` dead strings · FAQ วิจัยสินค้าซ่อน · คอมเมนต์ `relx.ts:19` — เหมือน v21
- **[เจ้าของบอก]** OOM ยังไม่มีใครยืนยันว่า 2GB เอาอยู่

### 4.1 รายการตัดกลางคำ/คำเดี่ยวตกบรรทัด — **ครบทุกจุดถึงจบก้อน 6** (แก้ใน "ขั้นปิดรอบ" 30.4ค ตามกฎ 2 ชั้น 8.0 · commit เดียว · ห้าม word joiner นอก 2 จุดที่อนุมัติ · ห้าม markup nowrap — เจ้าของปฏิเสธทั้งคู่ 2026-09-15 กรณีคำโปรยแกลเลอรี: **ทางที่ถูก = เขียนประโยคให้ตัดตรงไหนก็ไม่กลับความหมาย**)

รายการ 31 จุดจาก v21 §4.1 **ยังอยู่ครบ** (ไฟล์:บรรทัดของ `product-copy-th.ts` อาจขยับเพราะเพิ่ม overlay หลายบล็อก — ค้นด้วยข้อความ ไม่ใช่เลขบรรทัด · ใช้ `_incoming/30.4/wordbreak-locate.js`) **+ เจอใหม่ในรอบนี้:**

| # | หน้า · จอ | รอยตัด | ที่ | ชนิด |
|---|---|---|---|---|
| 32 | argus-g4 FAQ คำถาม 2 · 390 | "…โอห์มได้ \| ไหม" | `product-copy-th.ts` faqs argus-g4-pods question | คำเดี่ยวตกท้าย (base อังกฤษ "device?" ก็โดด) — designer เสนอย่อ "ใช้หัวพอตคนละโอห์มได้ไหม" |
| 33 | m-switch-kit hero คำบรรยาย · 390 | "…ชาร์จใช้ \| ต่อ แล้วเปลี่ยน…" | `product-copy-th.ts` m-switch-kit shortDescription | ขอบคำ (จุดตัดขยับหลังแก้ "พัฟต่อหัวพอต") |
| 34 | G4 Pro Classic / KOKO ค่าสเปก "1300mAh เท่า G4 รุ่นมาตรฐาน" ฯลฯ | ยังไม่ได้ถ่าย (ชั้น A) | — | ต้องถ่ายตอนปิดรอบทุกหน้าที่แตะ (35 หน้า) แล้วไล่ |

**แก้แล้วในรอบนี้:** คำโปรยแกลเลอรี "ไม่ / ได้นำไป" → ประโยคใหม่ (`th.ts` galleryNote) · ARGUS G4 390 แคปชันใบกลางที่เคยชน "© VOOPOO" หายไปเอง (ไทยสั้นกว่า)

---

## 5. รอสานต่อ (มีโครงแล้ว ต้องต่อยอด)

### 5.1 รอบ 30.4ค — เหลือ 3 ก้อน + ปิดรอบ (ไฟล์คำสั่ง Cowork 2026-09-14 · เจ้าของวางในแชทเซสชันนี้ — ถ้าเซสชันใหม่ไม่มี ให้ถาม)
1. **ก้อน 7 กวาด "ที่สุด" + คำค้าง** — รายการข้อ 4 ทั้งหมด · ไทย+อังกฤษ · **ต้องใช้ researcher 1 เรื่อง** (หัวพอต ARGUS เปลี่ยนคอยล์หรือทั้งหัว) · ชั้น A ยกเว้นที่แตะข้อมูล = data commit แยก
2. **ก้อน 8 ช่องไฟ+ไทยติดอังกฤษ 188** (ข้อ 36) — นับซ้ำก่อน (ตัวเลขจากรายงาน SEO 09/09) · commit แยก · ดูรายจุด
3. **ก้อน 9 หนัก 2 = 113** — thai-copy ≤40 แถวต่อครั้ง · เจ้าของตัดสินก่อนว่าเอาไหม
4. **ขั้นปิดรอบ:** ถ่ายทุกหน้าที่แตะในรอบ (35 หน้าสินค้า 390+1440 + /compare) + designer 1 ครั้ง → รวมทุกจุด + รายการ 4.1 (31+3) → แก้ commit เดียว (ชั้น B) → ถ่ายซ้ำเฉพาะหน้าที่แก้ → designer ปิด · **รายงานปิดรอบต้องมี:** อังกฤษที่เหลือนับจริง (`english-fields-5.ts` = 36 = ค่าสเปกตัวเลขล้วน) · รายการที่ปิดรอบแก้ · ขนาดรีโป
- **เครื่องมือรอบนี้ (gitignored) `_incoming/30.4c/`:** `*-brief.md` (โจทย์ thai-copy ต่อก้อน) · `batch-*-approved.md` (คำตัดสินเจ้าของ = สิ่งที่ checker ใช้) · `apply-k2/k4/k5.js` (ค่าที่ใส่จริง + ตรวจตัวเลข) · `stage-k1/k5/k56.js` (stage บางส่วนแยก commit) · `append-docs-k*.js` · `*-render-check.js` · `english-fields-3/4/5.ts` · `shoot-k1/k5/k6.sh` · `mask-eval-k1/k5/k6.js` · `sections-rect-eval-k5/k6.js` · `proof-k1/k5/k6.sh+txt` · `crops-k1/k5/k6.js` · `locale-eval-*.sh/txt` · `faq-answers-eval.sh` · commit message ทุกก้อน `commit-k*.txt` · ภาพ `shots-k1/ shots-k5/ shots-k6/ crops-k1/ crops-k5/ crops-k6/ mock-k1/` (≈0.5 GB — ลบได้เมื่อปิดรอบ ถามก่อน)

### 5.2 หลัง 30.4ค
- **รอบ 30.4ข** (คำนำหมวด · สเปกเด่นบนการ์ด · แถบความมั่นใจ + รายการ "จดไว้ 30.4ข" ข้อ 4) → **รอบ SEO** (`03-รอบ SEO.txt` — ทำหลัง 30.4 ขึ้นเว็บทั้งรอบ · JSON-LD description legacy 35 หน้ายังอังกฤษ · alt แกลเลอรี 8) → รอบบทความ → รอบเก็บบ้าน (`รอบเก็บบ้านคำสั่ง.txt`) → รอบข้อมูล (taxonomy 5 ตัว + ข้อมูลความเข้ากันได้ M Bar Pod/Muro 3ML ที่ไม่ระบุเครื่อง) → ข้อ 45 → แอดมิน → QR → ข้อ 42
- ข้อ 47 ค้นหาไทย · ข้อ 48 ลำดับ "แนะนำ" (joiway "Retailer-confirmed" 2 ค่ายังอยู่) → รอบการขาย

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย

เหมือน v21 §6 (ข้อ 44 7 เกณฑ์ · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง) — ไม่มีอะไรเปลี่ยน

---

## 7. คำถามที่เจ้าของต้องตอบ

**[ตรวจแล้วจริง]** ตอบแล้วในเซสชันนี้: VMATE i3 ✓ · ลบ _incoming ✓ · ไฟล์คำสั่ง 30.4ค ✓ (วางในแชท)

ยังรอ (เหมือน v21): ผลเฝ้า Render · iPhone จริง · `priority` 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
**ใหม่:** (1) TPD — ร้านขาย VINCI S / ARGUS G3 mini รุ่น 4.5mL/3mL หรือล็อต 2mL (§6 · วงเล็บคงไว้ 3 จุดจนกว่าจะรู้) (2) ก้อน 9 หนัก 2 เอาไหม (ตัดสินหลังเห็นก้อน 7–8) (3) เปิดเซสชันใหม่ควรเริ่มก้อน 7 ทันทีไหม หรือรอ Cowork merge ก้อน 5–6 ก่อน (แนะนำ: เริ่มได้ ก้อน 7 ไม่ทับไฟล์เดิม แต่ `git fetch` ก่อน)

---

## 8. ความเสี่ยงและจุดต้องระวัง (อันตรายมากไปน้อย)

### 8.0 กฎ 2 ชั้น — **ถาวร** (เหมือน v21 · ตารางเดิม) + สิ่งที่ตกผลึกรอบนี้
- ข้อความไทยที่ไปอยู่ใน `.label-mono` = ต้องแก้ CSS แถวนั้น = ชั้น B (ทำแล้ว 2 จุด · เหลือหัวแถว /compare ที่เจ้าของสั่งไม่แตะ)
- dictionary key ใหม่ที่แทน hardcode อังกฤษ = ชั้น A ถ้าอยู่ใน element เดิม (galleryNote · anatomy) — แต่ถ้าทำให้ element หาย/เพิ่ม (ซ่อนแถวช่องลม) = ชั้น B
- ประโยคใหม่ทุกประโยค **ต้องนึกถึงจุดตัดบรรทัดที่ 390** ก่อนเคาะ — คำปฏิเสธ "ไม่" ห้ามอยู่ท้ายบรรทัด (กรณี "ไม่ / ได้นำไป")

1. **U+2060** — 2 จุดเท่านั้น (เหมือน v21) · เจ้าของย้ำอีกครั้ง 2026-09-15 (ไม่เอาทั้ง WJ และ `whitespace-nowrap`)
2. **context:** กติกาใหม่ข้อ "ข้อขัดแย้ง 1" — 1 เซสชัน ≤ 3 ก้อน · แจ้งก่อนถึง ไม่รอตัวเลข
3. **ห้าม merge/deploy/force push เอง** · Cowork merge เร็วมาก (PR #22 #23 ในวันเดียว) · `git fetch` ก่อนสรุป
4. **กติกาถาม:** เหมือน v21 · เพิ่ม: designer เสนอ 2 แบบเรื่องรสนิยม → เจ้าของเคาะทุกครั้ง (แบบ A ก้อน 1 · 0.65rem ก้อน 5) — ตัวหลักห้ามเลือกเอง
5. **หลัก "ที่สุด" / ยืนยันไม่ได้ = ไม่พูดทุกภาษา** — ใช้กับข้อมูลอังกฤษด้วยแล้ว 4 ครั้งรอบนี้ (โน้ต 5V/2A 7 รุ่น · G5 chargingType · en podDetail "capacity" · shatterproof เดิม) = data commit แยกทุกครั้ง
6. **เดสก์ท็อป (ชั้น B):** เหมือน v21 · หน้าที่สั้นลง/ยาวขึ้น → diff-rows2 + ครอปให้ designer ดู "ดูถูกต้อง" · **ตรวจความสูงไฟล์เองด้วย `readUInt32BE(20)` ก่อนเชื่อ designer** · M Bar 10K 1440 ชิปรสชาติ ±1–4px และ G5/Joiway hero = noise เดิม
7. **overlay key:** label/note/caption/chargingType key ด้วยข้อความอังกฤษ (ข้อมูลอ้างค่าคงที่ร่วมกัน · `Specification.key` ซ้ำความหมาย) · value/whoIsThisFor key ด้วย spec.key/index ต่อสินค้า · faqs key ด้วย id — ถ้าใครแก้ข้อความอังกฤษในข้อมูล overlay จะ fallback เป็นอังกฤษเงียบ ๆ → render-check ทุกก้อนคือด่าน
8. **agent:** เหมือน v21 · thai-copy รายงานยาวมาก (150–200K ต่อตัว) — ให้โจทย์ผ่านไฟล์ brief แล้วขอ "ตอบสั้น" · checker ต้องได้ `batch-*-approved.md` เป็นคำสั่งเดิม
9. **Browser pane ใช้ไม่ได้** · shot.js/dom-eval ช้า ~1 นาที/ภาพ (4 หน้า × base/after ≈ 40 นาที) — วางแผนถ่ายชุดเดียวต่อรอบ build
10. **heredoc/node -e ห้ามใช้กับโค้ดที่มี backslash/regex/ไทย** (บั๊ก `/s+/g` รอบนี้) → Edit/Write tool · CRLF: Write/heredoc ให้ LF บางครั้ง → ตรวจด้วย node นับ `\r\n` = `\n` ก่อน commit (grep `$'\r$'` เชื่อไม่ได้บนเครื่องนี้)
11. **ปิด server ด้วย PID** (เหมือน v21) · `verify:catalog --full` build เองในตัว → รันตอน server ปิด แล้วค่อย start
12. **ในรอบภาษา ห้ามแตะ:** เหมือน v21

---

## 9. ห้ามรื้อ

เหมือน v21 + overlay ทุกไฟล์ใน `src/i18n/*-th.ts` (คำที่เจ้าของเคาะแล้ว) · `usbCNoNote` ใน `uwell.ts` · เงื่อนไข `hasAirflowSpec` ใน `ProductAnatomy.tsx`

## 10. Git — งานที่ปนกันควรแยกยังไง

commit แยกชนิด (copy/feat/fix/data/docs) · เมื่อไฟล์เดียวมีหลายก้อน ใช้เทคนิค stage บางส่วน (`stage-k56.js`: เขียน intermediate → `git add` → คืนไฟล์เต็ม · แต่ละ intermediate ต้องคอมไพล์ได้เอง)

## 11. ความพร้อมแต่ละระบบ

เหมือน v21 (ไม่มีระบบเปลี่ยน)

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท

**ไม่มีงานค้างในโค้ด** — 20 commit push แล้ว · main รอ merge 7 · server ทดสอบปิดแล้ว (netstat) · agent ไม่ค้าง · **thai-copy ยังไม่ได้ทำก้อน 7** · ภาพ `_incoming/30.4c/shots-k6` = ภาพล่าสุดของ 4 หน้าเรือธง

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)

1. เปิดเซสชันใหม่ → วางบล็อกข้อ 16 → `git fetch` + `git status` + ยิงเว็บ (ก้อน 5–6 live หรือยัง: `/products/caliburn-g5` anatomy "ปากดูด" · แคปชัน "ภาพแคมเปญ")
2. **ก้อน 7** — เริ่มจาก researcher (หัวพอต ARGUS) ขนานกับ thai-copy ตารางกวาด "ที่สุด"+คำค้าง (รายการข้อ 4 ครบ) → เจ้าของเคาะ → apply → checker → commit แยก data/copy → push
3. **ก้อน 8** → **ก้อน 9** (ถ้าเจ้าของเอา) — **ไม่เกิน 3 ก้อนต่อเซสชัน** → handoff
4. **ขั้นปิดรอบ** เซสชันแยก: ถ่าย 35 หน้า + /compare → designer → แก้ 4.1 (34 จุด) commit เดียว → ถ่ายซ้ำ → docs ปิดรอบ + LAUNCH_AUDIT ข้อ 30/36 → handoff
5. ถามเจ้าของก่อนลบภาพ `_incoming/30.4c/shots-k1 k5` (เก็บ k6)

## 14. ควรหยุดทำ

เหมือน v21 + ห้ามทำเกิน 3 ก้อนต่อเซสชัน

## 15. ปลายทางของโปรเจกต์

เหมือน v21 §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD 6514577 (+docs handoff ถัดไป) · origin/main 8edac8f (PR #23) · branch นำหน้า main 7 = ก้อน 5–6 + docs รอ Cowork merge
  Cowork merge + deploy โดยไม่บอกในแชท → ก่อนสรุปสถานะให้ git fetch เสมอ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9 — เท่านี้พอ): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md (ฉบับ 22 — ข้อขัดแย้ง 1 บทเรียน context · 4 รายการก้อน 7 · 4.1 ตัดกลางคำ 34 จุด · 5.1 ขอบเขตที่เหลือ · 8.0)
  → docs/THAI_STYLE.md ทั้งไฟล์ (§3 คำล็อกรวม 30.4ค ก้อน 1–6 · §5 กลุ่ม ก · §6 TPD · §7 "รอบ 30.4ค" ทุกตาราง)
  → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน" + ข้อ 30 36 47 48 (ห้ามอ่านทั้งไฟล์ · หัวไฟล์เขียน main เก่าได้ ให้เชื่อ git fetch)
  → ไฟล์คำสั่ง 30.4ค (เจ้าของวางในแชทเซสชันก่อน — ถ้าไม่มี ให้ถาม · ลำดับก้อน 7 กวาด "ที่สุด"+คำค้าง → 8 ช่องไฟ 188 → 9 หนัก 2 = 113 (เจ้าของตัดสิน) → ปิดรอบ)

สถานะ: รอบ 30.4ค ก้อน 1–6 เสร็จ 2026-09-15 ตรวจผ่านตามเกณฑ์ · ก้อน 1–4 live · ก้อน 5–6 รอ merge · อังกฤษบนหน้าสินค้าจากซอร์ส 492 → 36 (ค่าสเปกตัวเลข/หน่วย/ชื่อรุ่นล้วน = คงตามกฎ)
  overlay ครบทุกบล็อก: product-copy-th.ts (tagline/shortDescription/features/specifications/whoIsThisFor/faqs) · spec-labels-th · compat-copy-th · gallery-copy-th · anatomy-copy-th · dictionary galleryNote/anatomy 3 ภาษา · CSS แถวไทยใน .label-mono 2 จุด (SpecChip · figcaption)
  เหลือ: ก้อน 7 (รายการ HANDOFF §4 · ต้องใช้ researcher เรื่องหัวพอต ARGUS เปลี่ยนคอยล์/ทั้งหัว) · ก้อน 8 · ก้อน 9 · ขั้นปิดรอบ = ถ่าย 35 หน้า + /compare → designer → แก้ตัดกลางคำ 34 จุด (4.1) commit เดียว
  สั่งซื้อออนไลน์ปิด (OKAMI24_ORDERING=off ข้อ 43) → ไลน์ @okm24 · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 (count-storefront.ts เท่านั้น) · Render OOM ยังไม่ยืนยัน · น้ำยาบนหน้าร้าน 0
  agent: thai-copy (opus read-only · ตาราง ก่อน→หลัง · ให้โจทย์ผ่าน _incoming/30.4c/batch-N-brief.md · ขอตอบสั้น) · writer opus · checker/researcher sonnet (checker ต้องได้ batch-N-approved.md) · designer inherit (ไม่มี Bash ครอปให้ + ให้ตัวเลขความสูงไฟล์ไปด้วย) · SendMessage ใช้ได้ (ตรวจซ้ำเฉพาะจุด)

**กติกา context (บทเรียน 2026-09-15 — ผิดกฎ 13.6 เพราะไม่มีตัวนับให้เห็น):** 1 เซสชัน ≤ 3 ก้อน · จบก้อนที่ 3 = แจ้ง "ขอจบก้อนนี้ก่อน" แล้ว handoff ทันที ไม่รอตัวเลข
กฎ 2 ชั้น (ถาวร): ชั้น A ข้อความล้วน = build → render-check → checker → commit → push (ไม่ถ่าย) · ชั้น B แตะโครง/CSS/ซ่อน-เพิ่ม element/ข้อความไทยใน .label-mono = ถ่าย 390+1440 + มาสก์จาก DOM + designer + checker · ปิดรอบ = ถ่ายทุกหน้าที่แตะ + designer 1 ครั้ง → แก้ commit เดียว
หลัก "ที่สุด"/ยืนยันไม่ได้ = ไม่พูดทุกภาษา (ใช้กับข้อมูลอังกฤษด้วย = data commit แยก) · ประโยคใหม่ทุกประโยคต้องเจ้าของเคาะ · ประโยคใหม่ต้องไม่กลับความหมายไม่ว่าตัดบรรทัดตรงไหน ("ไม่" ห้ามอยู่ท้ายบรรทัด) · designer เสนอ 2 แบบเรื่องรสนิยม → เจ้าของเคาะ

ห้ามแตะ: layout · รูป · motion · ordering-mode.ts · ข้อความข้อ 43 · slug/URL/sitemap/structured data · /warranty · Hero.tsx · cinematic/ · กลุ่ม ก (FAQ "สูบไอ" · eliquid.disclaimer · AgeGate) · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · U+2060 นอก 2 จุด และห้าม whitespace-nowrap แทน · ชื่อฟีเจอร์/โหมดที่แบรนด์ตั้ง · สโลแกนแบรนด์ 7 ตัว · "Retailer-confirmed" 2 ค่า joiway · alt ภาพ (รอบ SEO) · หัวแถวไทยบน /compare (.label-mono นอกตารางสเปก)
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · กติกาถาม: ย้อนง่าย+ลูกค้าไม่เห็น = ตัดสินเองแล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคที่ลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout · รวมชุดเดียว 2-3 ทาง+แนะนำ · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง (+ด่าน U+2060 · เกณฑ์ grep คำห้าม = 8 คำ พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต) · ผู้แก้ไฟล์คนเดียวคือตัวหลัก · ใส่ข้อห้าม taskkill/build/server ในคำสั่ง agent ทุกตัว
  · ปิด server: netstat -ano | grep ":<port>.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด
  · ชั้น B: มาสก์ใหม่จาก DOM ทุกก้อน (mask-eval-*.js เขียนก่อนถ่ายภาพหลัง) · diff-rows2 · หน้าสั้นลง/ยาวขึ้น = resample + ครอปให้ designer · ตรวจความสูงไฟล์เอง readUInt32BE(20) · หน้า hero แอนิเมชัน (G5 · KOKO · argus-g4 · joiway-f4 · m-bar-10k ชิป) อ่านคู่สะอาด
  · สคริปต์เขียนด้วย Write/Edit tool ลง _incoming/30.4c/ (heredoc/node -e พังกับ backslash/regex/ไทย — บั๊ก /s+/g รอบนี้) · CRLF ตรวจด้วย node นับ \r\n = \n ก่อน commit · git ls-files --eol ต้อง i/lf w/crlf · stage บางส่วน: stage-k56.js เป็นแม่แบบ

เครื่องมือ: Browser pane ใช้ไม่ได้ → node scripts/shot.js out.png <url> --width 390|1440 [--desktop] [--wait ms] [--cookie okami24_locale=en] [--eval "<js>"] (en/zh พิสูจน์ได้ทางนี้เท่านั้น HTML static เป็นไทย) · dom-eval: node _incoming/30.3b/dom-eval.js <url> <eval.js> <out.json> [width] · _incoming/30.4c/: *-brief.md · batch-*-approved.md · apply-k*.js · stage-k56.js · append-docs-k*.js · *-render-check.js · english-fields-5.ts · shoot/proof/crops-k1/k5/k6 · locale-eval-*.sh · faq-answers-eval.sh · _incoming/30.3b/: diff-box.js · diff-rows2.js · region-delta.js · _incoming/30.4/: wordbreak-locate.js · row-bands.js · crop: node _incoming/qc/2026-09-08-mobile-B/crop-png.js <in> <out> <x> <y> <w> <h>
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · npx tsx _incoming/30.4c/english-fields-5.ts (36) · render-check ทุกบล็อก (152/152 · 56/56 · 49/49 · 11/11 · 8/8 · 3/3 · 15/15) · grep 8 คำห้าม = 0 · raw U+2060 = 0
Git: commit แยกชนิด (feat/fix/copy/data/docs) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push ทันที · ห้าม merge เอง
รอเจ้าของ: TPD (VINCI S / G3 mini รุ่นไหน) · ก้อน 9 เอาไหม · ลบภาพ _incoming/30.4c/shots-k1 k5 ไหม · ผลเฝ้า Render · iPhone จริง · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -8 --oneline` แล้วเทียบกับไฟล์นี้ — ถ้าไม่ตรงให้เชื่อ repo** (ก้อน 5–6 อาจ merge แล้ว) · ยิง `okami24.store/products/caliburn-g5` ดู anatomy "ปากดูด" = ก้อน 6 live
2. **หาไฟล์คำสั่ง 30.4ค** (ถามเจ้าของถ้าไม่มีในแชท) → เริ่ม **ก้อน 7** ตามข้อ 13 — researcher + thai-copy ขนานกัน · **ห้ามเกิน 3 ก้อนต่อเซสชัน**
3. อ่าน `docs/THAI_STYLE.md` §7 "รอบ 30.4ค" ทั้งหมดก่อนเสนอประโยคใหม่ — ศัพท์ทุกบล็อกบนหน้าสินค้าเคาะแล้ว ห้ามสร้างคำใหม่ถ้ามีคำล็อก
