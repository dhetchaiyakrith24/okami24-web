# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-15 (**ฉบับที่ 21** — ปิดรอบ 30.4ก · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-12-v20.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD **`1089827`** · `origin/main` **`a6df3a6`** (PR #21 = ก้อน 6 · branch **นำหน้า main 0** ทุกอย่างอยู่บนเว็บแล้ว) · working tree สะอาด (ก่อนเขียนไฟล์นี้)

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** `git fetch` + `git status` (ว่าง) + `git log -14` + `git rev-list --count origin/main..HEAD` = 0 · ยิง `okami24.store`: `/products/caliburn-g4-pro` ประโยคนำสเปก "1 ใน 6 รายการยังยืนยัน…" + "แหวนปรับลม" · `/products/zero-nano` "Zero รุ่นเล็ก" + "ในสาย Zero" · `/products/caliburn-g5` การ์ดไทย · หน้าแรก "รุ่นเรือธง" 7 · `/products` title "รวมพอต หัวพอต คอยล์ และ IQOS ของแท้ทุกรุ่น" = **30.4ก ทั้งรอบขึ้นเว็บแล้ว** · `count-storefront.ts` = 53/31 · `netstat` ไม่มี server ทดสอบค้าง · raw U+2060 ใน `src/` `docs/` = 0 · `git count-objects -vH`: **size-pack 25.27 MiB** (in-pack 3392 objects · 2 packs) · loose 919.80 KiB (132 objects) · garbage 0 — โฟลเดอร์ `_incoming/` (gitignored ไม่นับในรีโป) = **1.8 GB** ส่วนใหญ่เป็นภาพพิสูจน์ 30.3b–30.4

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]**
> **"ตรวจผ่านตามเกณฑ์" (checker/designer อิสระ + หลักฐาน) ≠ "เจ้าของอนุมัติ"** — เขียนแยกเสมอ
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก 12 + "คำที่ล็อกรอบ 30.4" (รวมก้อน 5/6 + หลัก "ที่สุด") · §5 กลุ่ม ก (รวม FAQ เชิงสุขภาพ "สูบไอ") · §6 เรื่องค้าง · §7 ทุกประโยคที่เคาะ (รอบ 30.4 = ก้อน 0–6 + wiring)

---

## ข้อขัดแย้งที่พบ

ทุกข้อ **[ตรวจแล้วจริง]**:

1. **v20 บอก "wiring A ต้องถ่าย ≥3 PDP + designer" และ "ก้อน 5+6 รอเคาะ"** — ทำครบแล้วในเซสชันนี้ (ข้อ 3) · v20 ยังใช้ได้เป็นประวัติ ไม่ใช่คำสั่ง
2. **v20 §4 บอก "รายการตัดกลางคำ = รอบแยก ห้ามแก้ในรอบภาษา"** — **เจ้าของเปลี่ยนกฎ 2026-09-14** (ข้อ 8.0 กฎ 2 ชั้น): รายการนี้แก้ใน "ขั้นปิดรอบ" ของรอบถัดไป ไม่ใช่รอบแยกอีกต่อไป · รายการครบทุกจุดพร้อมไฟล์:บรรทัดอยู่ข้อ 4.1
3. **หัว LAUNCH_AUDIT เขียน main = `a0354ed`** (แก้ล่าสุด 2026-09-14) — ของจริงตอนเขียน `a6df3a6` (PR #21) · แก้ในคอมมิต docs เดียวกับไฟล์นี้ · **อย่าเชื่อหัวไฟล์ ให้ `git fetch` เอง** (Cowork merge/deploy โดยไม่บอกในแชท — รอบนี้ 3 ครั้ง PR #19 #20 #21)
4. **ค่าสเปก Display ของ Caliburn G4 Pro เคยติด "verified" ทั้งที่มีคำ "shatterproof" ที่เว็บทางการไม่ระบุ** — ตัดคำทุกภาษา (`317ef4c`) และปรับธงเป็น unverified (`8bd94ba`) ตามเจ้าของ · THAI_STYLE §6 มีเงื่อนไขใส่กลับ
5. **checker ตกข้อ H ของก้อน 6 รอบแรกเพราะตัวหลักอธิบายคู่ภาพ argus-g4 ไม่ครบ** (เยื้อง 1 แถวจากการ resync ของ diff-rows2 ไม่ใช่ของพัง) → อธิบายด้วยตัวเลข → ผ่าน · บันทึกไว้เป็นบทเรียน: diff-rows2 บนหน้าที่ hero มีแอนิเมชัน ต้องอ่าน "คู่สะอาด" (HANDOFF 8.4) ก่อนสรุป
6. **`_incoming/` 1.8 GB** — ไม่มีในรีโป แต่กินดิสก์เครื่องเจ้าของ · ภาพ 30.3b (`next-base/` 83MB + shots) และ 30.4 (shots-k0…k6 · shots-wA) ลบได้เมื่อรอบ 30.4ค เริ่ม — **ห้ามลบเองโดยไม่ถาม** (13.4 ข้อ 1)

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านขายพอต/บุหรี่ไฟฟ้า **OKami24** แปลงมาจากเดโม NOVA VAPOR
- **เทคโนโลยี:** Next.js **16** (App Router · Turbopack) + TypeScript + Tailwind **v4** + SQLite (better-sqlite3)
- **โฟลเดอร์:** `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · **GitHub:** `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` · **HEAD `1089827`** · working tree **สะอาด** (ไฟล์นี้ + v20 ที่เปลี่ยนชื่อ + หัว LAUNCH_AUDIT ยังไม่ commit ตอนเขียน)
- **branch live:** `main` = **`a6df3a6`** (PR #21) · **ไม่มี commit รอ merge**
- **เว็บจริง:** `https://okami24.store` ออนไลน์ — **รอบ 30.1 · 30.2 · 30.3ก · 30.3ข · 30.4ก ขึ้นเว็บครบ**
- **รอบ 30.4ก ปิดแล้ว (เจ้าของสั่งปิด 2026-09-14)** — เสร็จ: หนัก 1 = 82 แถว · wiring A/D/ก8 + ข1 ข3 · การ์ดจุดเด่น 40/40 · Q1 word joiner 2 จุด · title /products · หัวหอม/ก้าน TEREA · relx Smash Go = Flagship · shatterproof ออกทุกภาษา
- **รอบถัดไป = 30.4ค** (Cowork เขียนไฟล์คำสั่งให้) — ดูข้อ 5
- **Render:** Standard 1 CPU / 2GB · **[เจ้าของบอก ยังไม่ได้ตรวจเอง]** OOM ไม่มีใครรายงานว่าเกิดซ้ำ แต่ก็ไม่มีใครรายงานว่าเฝ้าครบ · พูดได้แค่ "ไม่เกิดซ้ำ" ห้ามพูด "แก้ถูกจุด"
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) — ลูกค้าซื้อทางไลน์ `@okm24` · **ห้ามเสนอเปิด ห้ามเขียนข้อความพาไปตะกร้า ทุกรอบ**
- **สินค้าบนหน้าร้าน:** **53 ชิ้น** (ซื้อได้จริง 31) — จาก `count-storefront.ts` เท่านั้น **ห้ามนับเอง** · **หมวด E-Liquid บนหน้าร้าน = 0 ชิ้น** (title/meta /products เลิกสัญญาน้ำยาแล้ว — ใส่กลับเมื่อมีของ THAI_STYLE §6)
- **ขนาดรีโป (`git count-objects -vH` 2026-09-15):** pack 25.27 MiB + loose 0.9 MiB · `_incoming/` 1.8 GB นอกรีโป
- **checkpoint tags:** `pre-30.1-2026-09-09` · `pre-30.2-2026-09-10` (30.3/30.4 ไม่ได้ตั้ง tag — จุดก่อน 30.4 = `a170ae5` · จุดปิด 30.4ก = `1089827`)

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว)

**[ตรวจแล้วจริง]** — เรียงตามความสำคัญ

| เรื่อง | หลักฐาน |
|---|---|
| เว็บออนไลน์บน Render สิงคโปร์ · โดเมนจริง · Cloudflare หน้าบ้าน · รูปแคชที่ CF | ยิงเว็บจริง |
| แคตตาล็อก 53 ชิ้น · ราคา · สี/กลิ่น · สเปก · รูป · ค้นหา · เทียบ | `count-storefront.ts` · ข้อ 2–12 |
| **30.1 · 30.2 · 30.3ก · 30.3ข · 30.4ก — live ครบ** (title/meta ไทยทุกหน้า · ชื่อหมวด "อังกฤษ / ไทย" · 404 · หนัก 1 · hero PDP ไทยแทนอังกฤษ 35 หน้า · ป้ายการ์ด "รุ่นเรือธง" · การ์ดจุดเด่นไทย 40/40 · eyebrow 4 แบรนด์ · about/favorites ไทย) | เว็บจริง 2026-09-15 · `_incoming/30.4/proof-*.txt` · render-check-*.txt |
| ปิดการขายออนไลน์ชั่วคราว + ปุ่มไลน์ (ข้อ 43) | `/cart` 307 |
| มือถือ M1 · M1b · M2 · M3 · M4 · B3 · B4 | เจ้าของทดสอบเครื่องจริงผ่าน |
| ระบบสำรองข้อมูลอัตโนมัติ · gate กัน better-sqlite3 พัง | ข้อ 38/39 |
| agent ทีม 6 ตัวใน `.claude/agents/`: checker (ด่านถาวร U+2060) · designer · planner · researcher · writer · thai-copy | รอบ 30.4 ใช้ thai-copy 10 ครั้ง · SendMessage ใช้ได้แล้ว (ต่อ agent เดิมเพื่อตรวจซ้ำเฉพาะจุด) |
| **โครง overlay ภาษาไทยของสินค้า legacy:** `product-copy-th.ts` มี tagline · shortDescription · `features` (คีย์ = feature id) · `EditorialTagBadge` · `Brand.taglineTh` · `favorites.empty*` | `e4863c5` `2a59fde` `dba5937` `c8d32e1` |

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-13 → 15 · 20 commit · main ขยับ 3 PR)

**[ตรวจแล้วจริง]** commit ตามลำดับ: `5c7db58` docs หัว audit · **wiring A** `c47c94b` feat (hero PDP ไทยแทนอังกฤษ + title/meta /products) · **ก8** `2a59fde` feat (`EditorialTagBadge.tsx` · dictionary `product.flagshipBadge` 3 ภาษา) `7c65845` data (ล้าง 3 โน้ตภายในในสินค้าซ่อน) · **D** `dba5937` feat (`Brand.taglineTh` 4 แบรนด์ · `BrandPageHeader`) · **ข1+ข3** `c8d32e1` copy (about การ์ดแบรนด์ `descriptionTh` · favorites 3 คีย์ 3 ภาษา) `1032b4c` docs · **ก้อน 5** `e4863c5` feat (overlay `features` 16 ใบ UWELL + `FeatureGrid` อ่านเมื่อ th + hero G3 Pro "หัวพอต") `f93afb7` data (การ์ด G4 Pro ตัด shatterproof · relx Smash Go "Flagship") `317ef4c` data (shatterproof ที่เหลือทุกภาษา: tagline/shortDescription อังกฤษ · ค่าสเปก · technology.ts · technology-copy.ts จีน) `b7f4706` docs `7cfa461` docs · **ก้อน 6** `5187cc4` copy (24 ใบ VOOPOO/SALTHUB/RELX/JOIWAY + tagline 4 จุด + "ถ่าน") `8bd94ba` data (ธง Display G4 Pro → unverified) `8efec51` docs `1089827` docs

- **wiring A/D/ก8 (2026-09-13):** ถ่าย 13 หน้า 390+1440×2 ก่อน/หลัง · มาสก์ `mask-eval-wA.js` · หน้าที่ hero สั้นลง (argus −74 · joiway −250 · about −320 · favorites −20) ต่างเฉพาะ noise Δ≤27 / รูป-ปุ่มแชทลอยเลื่อนเป็นเศษพิกเซล · designer 4/5 ดูถูกต้อง + ตัดคำ about 390 (จดข้อ 4.1) · checker ตก 1 (ไฟล์ใหม่ LF) → แปลง CRLF → ผ่าน · **จุดบอดที่รายงานเอง:** มาสก์ `main li p` ครอบ `li p` บน PDP ด้วย → รันซ้ำด้วยมาสก์เฉพาะ hero ผลเหมือนเดิม (`proof-wA-heroonly.txt`)
- **ก้อน 5 (2026-09-14):** เจ้าของเคาะ 16 ใบ + คำใหม่ 4 (แหวนปรับลม · ธีมหน้าจอ · โหมดที่ตั้งค่ามาให้ · จอทัชสกรีน/จอทัช) · ถ่าย 8 หน้า 1440×2 + 13 หน้า 390 · designer "ดูถูกต้อง" ยกเว้นตัดคำ 7 จุด (ข้อ 4.1) · checker 11/11
- **ก้อน 6 (2026-09-14):** เจ้าของเคาะ 24 ใบ + คำใหม่ 5 (ถ่าน · ปุ่มยิง · ซีล · ไลน์อัพ · auto-draw→"ไม่มีปุ่ม สูบได้เลย") + **หลัก "ที่สุด"** (พูดได้เฉพาะเมื่อทุกรุ่นที่เทียบมีตัวเลขในสเปกครบ) + tagline/คำบรรยาย 4 จุดนอกโจทย์ · #14 VMATE i3 ประโยคที่เขียนหลังเคาะ (thai-copy เสนอ 3 ตัวหลักเลือกที่ใช้คำเจ้าของ): "15.1mm คือความหนาของตัวเครื่อง พกใส่กระเป๋ากางเกงสบาย ไม่เกะกะ" — **เจ้าของยังไม่ได้ยืนยันประโยคนี้เป็นคำ ๆ** · ถ่าย 7 หน้า 1440×2 + 18 หน้า 390 · designer "ดูถูกต้อง" · checker A–G ผ่าน H ผ่านหลังอธิบาย
- **นับอังกฤษที่เหลือบนหน้าสินค้า legacy 35 หน้า (ซอร์ส หลังก้อน 6):** `_incoming/30.4/english-fields-2-after-k6.txt` (สคริปต์ `english-fields-2.ts`) = **≈492 ข้อความที่ต้องแปล** — สเปก label 152 · สเปก value 152 · ความเข้ากันได้ 56+49 · เหมาะกับใคร 49 · FAQ 22 · แคปชันแกลเลอรี 8 · anatomy (hardcode ใน `ProductAnatomy.tsx` เรือธง 4 หน้า × ~5 คู่) · **คงอังกฤษตามกฎ:** ชื่อสี 154 · ชื่อกลิ่น 191 · ชื่อฟีเจอร์แบรนด์ 2 · ป้ายซ่อน 2 — **ตัวเลขนี้นับจากซอร์สไม่ใช่ render และไม่รวมหน้าที่ไม่ใช่สินค้า ห้ามเอาไปบวกกับ 488 ของ `english-audit.js` (นับจาก render 105 หน้า 2026-09-12)**
- **กฎเครื่องมือที่ได้จากรอบนี้:** diff-rows2 มาสก์ "ทั้งแถว" (ไม่ใช่กล่อง) → กล่องกว้างบังของอื่นในแถวเดียวกัน · หน้าที่ hero มีแอนิเมชัน (เรือธง G5/KOKO/argus-g4 · joiway-f4 chips) ต้องหา "คู่สะอาด" จาก 4 คู่ · `features-rect-eval.js` วัดตำแหน่งบล็อกจุดเด่นที่ 390 จาก DOM ให้ครอปตรง · Edit tool เขียน LF จริง (checker จับได้ 1 ครั้ง) → `fix-crlf-*.js`
- **CRLF:** ทุกไฟล์ที่แตะ `i/lf w/crlf` · `ProductCard.tsx` `FavoritesList.tsx` ที่เคย w/lf แปลงเป็น CRLF แล้ว

---

## 4. ยังไม่ได้แก้ (รู้ว่าขาด แต่ยังไม่ได้ทำ)

- **[ตรวจแล้วจริง]** **อังกฤษบนหน้าสินค้า ≈492** (ข้อ 3) + **หน้าอื่น** (ก4–ก7 ตาม `english-inventory.md`: note/เหมาะกับใคร/FAQ/โครงสร้าง dictionary) → **30.4ค**
- **[ตรวจแล้วจริง]** **หนัก 2 = 113 แถว** (`_incoming/30.4/scan-A-ui-service.md` · `scan-B-product-editorial.md` ส่วน "หนัก 2") → 30.4ค
- **[ตรวจแล้วจริง]** **"ที่สุด" ที่ยังค้าง (เจ้าของเคาะ 2026-09-14 = ข ยกไป 30.4ค กวาดทีเดียวไทย+อังกฤษ):** `product-copy-th.ts:267` vmate-i3 "พอตคิทที่เบาที่สุดในกลุ่มของ VOOPOO" (ไม่มีน้ำหนักในสเปก) · `:344` zero-nano tagline "เครื่องที่เล็กที่สุดในสาย Zero" (ไม่มีขนาด) · ฝั่งอังกฤษ เช่น `voopoo.ts:897` "lightest current pod kit" · whoIsThisFor G4 Pro "biggest screen in the Caliburn line" · ผ่านได้: m-bar-15k (15K/10K/9K มีครบ)
- **[ตรวจแล้วจริง]** **ข้อ 36 ช่องไฟ + ไทยติดอังกฤษ 188 จุด** (LAUNCH_AUDIT ข้อ 36) → 30.4ค
- **[ตรวจแล้วจริง]** `ProductAnatomy.tsx:21-35` label/detail อังกฤษ hardcode (เรือธง 4 หน้า) — ต้องเข้า dictionary ไม่ใช่ overlay → 30.4ค
- **[ตรวจแล้วจริง]** designer เห็นของเดิม (CSS ไม่ใช่รอบภาษา): ป้าย "ยังไม่ยืนยัน"/"รุ่นเรือธง" ตัวไทยดูเล็ก/บางกว่า label mono ข้างกัน · การ์ดสินค้าแนะนำที่ไม่มีราคาเหลือช่องว่างล่าง · finder 1440 ปุ่มแชทลอยทับข้อความท้าย · joiway-f4 "รีวิวจาก OKAMI24" ขึ้น 2 ครั้งติดกัน · about "Compliance"/"About" eyebrow อังกฤษ · rail เรือธงหน้าแรกการ์ด ARGUS G4 / M Bar / RELX ไม่มีรูป · VMATE i3 h3 "ตัวเครื่องอะลูมิเนียมอัลลอย บาง 15.1mm" เหลือขอบขวา ~6px ที่ 390 (จอ 360 จะขึ้น 2 บรรทัด)
- **[ตรวจแล้วจริง]** `priority` ที่ตายใน Next 16 2 จุด (`Header.tsx` · `StaticIntro.tsx`) เจ้าของยังไม่สั่ง · taxonomy Coil-72/89 · M Switch/Zero pod-kit → รอบข้อมูล · `th.ts` dead strings `compare/finder.metaTitle` · FAQ วิจัยสินค้าซ่อน `tfit.ts:64–68` `infy.ts:71–76` ยังมีโน้ตวิจัย · คอมเมนต์ `relx.ts:19` ยังมีคำ "Tier-1 priority" (ประวัติ ไม่ render)
- **[เจ้าของบอก]** OOM ยังไม่มีใครยืนยันว่า 2GB เอาอยู่

### 4.1 รายการตัดกลางคำ/คำเดี่ยวตกบรรทัด — **ครบทุกจุดที่ designer จดไว้ตั้งแต่ 30.3ข ถึงปิด 30.4ก** (แก้ใน "ขั้นปิดรอบ" ของ 30.4ค ตามกฎ 2 ชั้น ข้อ 8.0 · commit เดียว · ห้าม word joiner นอก 2 จุดที่อนุมัติ)

| # | หน้า · จอ | รอยตัด | ไฟล์:บรรทัด | ชนิด |
|---|---|---|---|---|
| 1 | argus-g4 hero · 1440 | แสดงระ\|ดับแบต | `src/i18n/product-copy-th.ts:165` | **ตัดกลางคำจริง** (ของเดิม) |
| 2 | argus-g4 hero · 390 | 5–35\|วัตต์ | `src/i18n/product-copy-th.ts:165` | **ตัวเลขแยกหน่วย** (ของเดิม) |
| 3 | caliburn-g3-pro การ์ด dual-pod · 1440 | 0.9\|โอห์ม + "เลย" คำเดี่ยว | `src/i18n/product-copy-th.ts:147` | ตัวเลขแยกหน่วย (ก้อน 5) |
| 4 | about Compliance · 1440 | กล่า\|วอ้าง | `src/app/about/page.tsx:90` | ตัดกลางคำ (ของเดิม · ข้อความเตือน — ดู §5 กลุ่ม ก ก่อนแตะ) |
| 5 | home การ์ดกลุ่มรสผลไม้ · 390 | ผล\|ไม้ | `src/i18n/flavor-copy.ts:21` | ขอบคำประสม |
| 6 | home การ์ดเมนทอล · 390 | ควัน\|ออก | `src/i18n/flavor-copy.ts:27` | ขอบคำ |
| 7 | about คำโปรยใต้ H1 · 1440 / 390 | จากคน\|ขาย · ร้านพอต\|ซิสเต็ม | `src/app/about/page.tsx:23` | ขอบคำประสม |
| 8 | about span สี · 1440 | ยังไม่\|ยืนยัน | `src/app/about/page.tsx:41` | ขอบคำประสม |
| 9 | about การ์ดแบรนด์ · 390 | หัว\|พอต (VOOPOO · RINCOE · ESKO BAR) · ตอน\|นี้ (NEVOKS) | `src/data/brands.ts:25` · `:50` · `:75` · `:117` | ขอบคำประสม (wiring ข1) |
| 10 | faq คำถาม compare-winner · 390 | “ดี\|ที่สุด” | `src/i18n/faq-copy.ts:66` | ขอบคำ |
| 11 | ทุก PDP ประโยคนำ SpecSheet · 390 | เราติด\|ป้าย | `src/i18n/dictionaries/th.ts:156` | ขอบคำ |
| 12 | eliquid คำโปรย · 1440 | แต่ละ\|ขวด | `src/i18n/dictionaries/th.ts:295` | ขอบคำ |
| 13 | argus-g3-mini tagline | ให้\|เอง | `src/i18n/product-copy-th.ts:202` | ขอบคำ |
| 14 | guide เลือกเครื่องแรก · 390 | มา\|ให้ | `src/i18n/guides-copy.ts:25` | ขอบคำ |
| 15 | guide เลือกเครื่องแรก H2 | ของ\|คุณ | `src/i18n/guides-copy.ts:19` / `:30` | ขอบคำ (ของเดิม) |
| 16 | guide แบตเตอรี่ H1 | การ\|ชาร์จ | `src/i18n/guides-copy.ts:119` | ขอบคำประสม (ของเดิม) |
| 17 | tech-touch H2 | เต็มรูป\|แบบ | `src/i18n/technology-copy.ts:49` | ขอบคำประสม (ของเดิม) |
| 18 | technology | box\|mod | `src/i18n/technology-copy.ts` (ค้น "box mod") | ศัพท์อังกฤษ 2 คำแยกบรรทัด |
| 19 | eliquid การ์ด | หวาน\|กว่า · เป็น\|หลัก | `src/i18n/flavor-copy.ts:31` / `:36` | ขอบคำ |
| 20 | caliburn-g4-pro-koko การ์ด pro-focs · 1440 | หัว\|พอต GPP | `src/i18n/product-copy-th.ts:80` | ขอบคำประสม (ก้อน 5) |
| 21 | caliburn-g3-pro-koko การ์ด · 1440 | ข้าง\|ใน | `src/i18n/product-copy-th.ts:158` | ขอบคำประสม |
| 22 | caliburn-g4-classic การ์ด · 1440 | มี\|4 สี | `src/i18n/product-copy-th.ts:132` | บรรทัดท้ายสั้น |
| 23 | caliburn-g4-mini การ์ด · 390 | ตัว\|เครื่อง | `src/i18n/product-copy-th.ts:121` | ขอบคำประสม |
| 24 | caliburn-g5-lite การ์ด · 390 | เรียบ\|ง่าย | `src/i18n/product-copy-th.ts:56` | ขอบคำประสม |
| 25 | caliburn-g4-pro การ์ด · 390 | "Caliburn" คำเดี่ยว | `src/i18n/product-copy-th.ts:95` | คำเดี่ยวตกท้าย |
| 26 | argus-p3 การ์ด · 390 | "สถานะ" คำเดี่ยว | `src/i18n/product-copy-th.ts:197` | คำเดี่ยวตกท้าย (ก้อน 6) |
| 27 | drag-x3 การ์ด touchscreen-166 · 390 | "โดยตรง" คำเดี่ยว | `src/i18n/product-copy-th.ts:251` | คำเดี่ยวตกท้าย |
| 28 | zero-pro การ์ด · 390 | Zero\|Nano ใช้ | `src/i18n/product-copy-th.ts:339` | **ชื่อรุ่นแยกบรรทัด** |
| 29 | m-bar-9k การ์ด · 390 | "ตอนซื้อ" | `src/i18n/product-copy-th.ts:299` | วลีสั้นตกท้าย |
| 30 | m-bar-10k การ์ด three-modes · joiway-f4 การ์ด · 390 | ไม่\|ต้อง | `src/i18n/product-copy-th.ts:281` · `:388` | ขอบคำ อ่านสะดุด |
| 31 | vmate-i3 h3 · 390 | เหลือขอบขวา ~6px | `src/i18n/product-copy-th.ts:270` | เสี่ยงขึ้น 2 บรรทัดที่จอ 360 |

**แก้แล้ว (ห้ามทำซ้ำ):** `/e-liquid/beverage` "เบ|เกอรี่" และ `/technology/onboard-touch-displays` "จอ|ทัช" — word joiner ตอน render (`src/lib/thai-keep-together.ts` · Q1 `5aeb515`) — **2 จุดนี้เท่านั้นที่ใช้ U+2060 ได้**

---

## 5. รอสานต่อ (มีโครงแล้ว ต้องต่อยอด)

### 5.1 รอบ 30.4ค — Cowork เขียนไฟล์คำสั่งให้ (เจ้าของ 2026-09-14) · ขอบเขตที่เจ้าของระบุ
1. **อังกฤษบนหน้าสินค้า ≈492** (ข้อ 3/4) — หลักที่เคาะแล้ว (v20 5.3): label ทั่วไปแปล · label ชื่อเฉพาะคง · value ตัวเลข/หน่วย/ชื่อรุ่นคง · value ประโยคแปล · **โครงที่มีแล้ว:** overlay ใน `product-copy-th.ts` (ขยายฟิลด์ `specifications`/`compatibility`/`whoIsThisFor`/`faqs` คีย์ตาม key/index) + component อ่านเมื่อ th แบบเดียวกับ `FeatureGrid` · anatomy ต้องเข้า dictionary
2. **หนัก 2 = 113 แถว** — thai-copy เสนอตาราง ≤40 แถวต่อครั้ง เจ้าของเคาะ
3. **ข้อ 36 ช่องไฟ + ไทยติดอังกฤษ 188 จุด**
4. **กวาด "ที่สุด" ไทย+อังกฤษ** ด้วยหลัก §3 (ข้อ 4)
5. **ขั้นปิดรอบ:** รายการตัดกลางคำทั้งหมด (ข้อ 4.1) — ถ่ายทุกหน้าที่แตะในรอบ + designer 1 ครั้ง → รวมทุกจุด → แก้ใน commit เดียว
- **ชั้นของงาน (กฎ 2 ชั้น ข้อ 8.0):** ข้อ 1–4 ส่วนใหญ่เป็น **ชั้น A** (ข้อความล้วน) ยกเว้นที่ต้องเพิ่ม component/dictionary ใหม่ (สเปก/anatomy) = **ชั้น B**
- **เครื่องมือรอบนี้ (gitignored) `_incoming/30.4/`:** `english-fields-2.ts` (นับอังกฤษต่อฟิลด์ตามสายที่ต่อแล้ว) · `english-audit.js <url>` (render 105 หน้า) · `wordbreak-locate.js` → `wordbreak-sites.txt` (ไฟล์:บรรทัดของข้อ 4.1) · `features-rect-eval.js` (ตำแหน่งบล็อกจุดเด่นที่ 390) · `mask-eval-wA/k5/k6.js` (หมดอายุเมื่อแตะข้อความ) · `shoot-wA/k5/k6.sh` · `proof-wA/k5/k6.sh` + `.txt` · `crops-*.js` · `apply-*.js` · `append-docs-*.js` · `fix-crlf-wA.js` · `render-check-*.txt` · commit message ทุกก้อน `commit-*.txt` · ภาพ `shots-wA/ shots-k5/ shots-k6/ crops-*`

### 5.2 หลัง 30.4ค
- **รอบ 30.4ข** (ของใหม่ 3 อย่าง: คำนำหมวด · สเปกเด่นบนการ์ด · แถบความมั่นใจ) → **รอบ SEO** (slug/URL/sitemap/structured data — JSON-LD description สินค้า legacy ยังอังกฤษ 35 หน้า) → รอบข้อมูล (taxonomy 5 ตัว) → ข้อ 45 → แอดมิน → QR → ข้อ 42
- ข้อ 47 ค้นหาภาษาไทย · ข้อ 48 ลำดับ "แนะนำ" ผูกกับ hasEditorialTag (relx เป็น Flagship แล้ว · joiway f3/f4 "Retailer-confirmed" ยังอยู่เพื่อคงลำดับ) → รอบการขาย

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย

**[ตรวจแล้วจริง]** — ทั้งหมดอยู่ใน `docs/LAUNCH_AUDIT.md`

- ข้อ 44 — เกณฑ์เปิดขายออนไลน์ 7 ข้อ ยังผ่าน **0/7** (ข้อ 7 = ข้อ 30 — 30.4ค ยังไม่เริ่ม) · **ห้ามเปิดสวิตช์เอง**
- ข้อ 47 · 48 · 45 ตรวจความปลอดภัย · ข้อ 1 หน้าแอดมิน · รอบ SEO · รูปชุด RB (พัก) · รอบข้อมูล
- ยังไม่เคยทดสอบรับเงินจริง · ยังไม่เคยกู้ระบบทั้งชุดจากสำเนา

---

## 7. คำถามที่เจ้าของต้องตอบ

| เรื่อง | รู้แล้ว | ยังไม่รู้ | ต้องตอบอะไร |
|---|---|---|---|
| **ประโยค VMATE i3 การ์ด slim-body** | ใส่โค้ดแล้ว `5187cc4` ตามคำเจ้าของ "พกใส่กระเป๋ากางเกงสบาย" (thai-copy เสนอ 3 แบบ) | เจ้าของยังไม่ได้ยืนยันเป็นคำ ๆ | ผ่าน / แก้เป็น … |
| **ลบ `_incoming/` ภาพเก่า 1.8 GB** | shots 30.3b/30.4 ครบหน้าที่แล้ว | เจ้าของอยากเก็บไหม | ลบได้ / เก็บ |
| Render 2GB · iPhone จริง · `priority` 2 จุด · Lighthouse | เหมือน v19/v20 | ยังไม่ตอบ | — |
| 195 vs 189 | นับเอง 195 | บัญชี 189 ของ SEO อยู่ไหน | ส่งไฟล์ถ้ามี (ไม่มีก็ข้าม) |
| ข้อมูลค้าง | — | ข้อ 10 · 13 · 16 · 37 (ดู 7.1) · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR | ส่งข้อมูล |

### 7.1 LAUNCH_AUDIT ข้อ 10 / 13 / 16 / 37 คืออะไร รออะไร (เจ้าของขอ 2026-09-11 — ยังเหมือนเดิม)
- **ข้อ 10** รายการของหมด (`src/data/stock/sold-out.ts` 31 รายการ) อิง Excel 31-08 — รอเจ้าของไล่เช็คสินค้าที่ซื้อได้ว่าอะไรหมดจริง แล้วบอก
- **ข้อ 13** สินค้า legacy 22 ตัวไม่มีราคา → ดูได้ซื้อไม่ได้ — รอเจ้าของส่งราคาเป็นรายการ (ต้องมีรหัส Shipnity + หลักฐาน)
- **ข้อ 16** ชื่อรส/สีไม่ตรง Excel (Funta Grape/Green · Vodak/Vodka · Matcha Late · Cool Mint vs Double Mint · zero-pro สี · Iluma One 2 รุ่นปน) — รอเจ้าของดูซองจริงแล้วตอบ
- **ข้อ 37** "รายละเอียดครบ" ของสินค้า 12 ตัวที่สั่งงานรูป — FAQ ว่าง 34 สินค้า · features น้อย · สเปกบางค่ายังไม่ยืนยัน — รอ researcher + writer + เจ้าของอนุมัติ (ซ้อนกับ 30.4ค)

---

## 8. ความเสี่ยงและจุดต้องระวัง (อันตรายมากไปน้อย)

### 8.0 กฎ 2 ชั้น — **ถาวร (เจ้าของสั่ง 2026-09-14)**

| ชั้น | นิยาม | ขั้นตอนต่อก้อน |
|---|---|---|
| **A · ข้อความล้วน** | แก้คำ/ประโยคในกล่องเดิม **ไม่แตะ** markup · CSS · element · component | build → นับจาก render → checker เทียบตารางทุกแถว → commit → push · **ไม่ถ่ายภาพ ไม่ต้อง designer ต่อก้อน** |
| **B · แตะโครง** | markup · CSS · เพิ่ม/ซ่อน element · เปลี่ยน component · word joiner · dictionary key ใหม่ที่เปลี่ยนสิ่งที่แสดง | เต็มเหมือนเดิม: ถ่ายก่อน/หลัง 390+1440 + มาสก์จาก DOM + designer + checker |
| **ปิดรอบ (ทุกรอบ)** | — | ถ่ายทุกหน้าที่แตะในรอบ + designer 1 ครั้ง → รวมทุกจุดที่เจอ (รวมรายการตัดกลางคำ ข้อ 4.1) → **แก้ใน commit เดียว** |

เหตุผลของเจ้าของ: ก้อนข้อความล้วนที่ผ่านมา ของที่ designer จับได้ทุกอย่างถูกยกไปแก้ทีหลังอยู่แล้ว · ภาพก้อน 6 (`_incoming/30.4/shots-k6` + `crops-k6`) = ภาพปิดรอบ 30.4ก ไม่ต้องถ่ายซ้ำ · **รายการตัดกลางคำไม่ใช่รอบแยกอีกต่อไป** = แก้ในขั้นปิดรอบของ 30.4ค

1. **อักขระล่องหน WORD JOINER (U+2060)** — มีในเว็บ **2 จุด** เท่านั้น ใส่ตอน render โดย `src/lib/thai-keep-together.ts` (`/e-liquid/beverage` "เบเกอรี่" · `/technology/onboard-touch-displays` "จอทัช") · รีโปไม่มีอักขระดิบ · **ห้ามใช้ที่อื่น แม้ในขั้นปิดรอบ** (เจ้าของย้ำ 2026-09-14 กรณี "0.9|โอห์ม") · checker มีด่านถาวร · ตรวจ `node _incoming/30.4/wj-render-check.js <url>`
2. **context 600K = ต้องแจ้ง "ขอจบก้อนนี้ก่อน"** ไม่เงียบ · เซสชันนี้ปิดตามคำสั่งเจ้าของก่อนถึงเกณฑ์
3. **ห้าม merge / deploy / force push เอง** — Cowork merge โดยไม่บอกในแชท (รอบนี้ PR #19 #20 #21 ภายใน 2 วัน) · ก่อนสรุปสถานะ `git fetch` เสมอ · revert ไม่ reset
4. **กติกาถาม:** ย้อนง่าย+ลูกค้าไม่เห็น = ตัดสินเองแล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม: ประโยคใหม่ที่ลูกค้าอ่าน · รสนิยม · คำนอกตาราง · layout · **ประโยคใหม่ทุกประโยคต้องเจ้าของเคาะจากตาราง ก่อน→หลัง ก่อนใส่โค้ด** — ข้อยกเว้นรอบนี้: เจ้าของมอบให้ thai-copy เติมประโยชน์ VMATE i3 (ข้อ 7) · **หลัก "ยืนยันไม่ได้ = ไม่พูดทุกภาษา"** ใช้กับข้อมูลอังกฤษ/จีนด้วย (shatterproof) แต่การขยายเกินคำสั่งต้อง commit แยก + รายงาน (ทำแล้ว `317ef4c` เจ้าของรับ)
5. **หลัก "ที่สุด"** (§3): พูดได้เฉพาะเมื่อทุกรุ่นที่เทียบมีตัวเลขในสเปกครบ · ใช้กับไทยและอังกฤษ · กวาดใน 30.4ค
6. **เดสก์ท็อป (ชั้น B):** diff-rows2 มาสก์ทั้งแถว · หน้าที่ hero มีแอนิเมชัน (G5 · G4 Pro KOKO · argus-g4 · joiway-f4 chips · m-bar-10k base run1 เคย outlier) ยิง 2 รอบต่อฝั่ง อ่าน "คู่สะอาด" (`proof-*.sh` ทำ 4 คู่ + noise 2 คู่ให้) · หน้าที่สั้นลง: ทุกอย่างใต้จุดเปลี่ยนถูก resample เป็นเศษพิกเซล (รูป/จุด/ฟุตเตอร์/ปุ่มแชทลอย) = ไม่ใช่ layout เปลี่ยน แต่ designer ต้องบอก "ดูถูกต้อง"
7. **ป้าย editorialTag:** "Retailer-confirmed" 2 ค่า (joiway f3/f4) ยังอยู่ในไฟล์เพื่อคงลำดับ (ข้อ 48) · `EditorialTagBadge` แสดงเฉพาะ "Flagship"
8. **agent:** นิยามอ่านตอนเปิดเซสชัน · **SendMessage ใช้ได้** (ต่อ checker/designer ตัวเดิมเพื่อตรวจซ้ำเฉพาะจุดที่แก้ — กฎ 13.5) · designer ไม่มี Bash ต้องครอปให้ · thai-copy read-only
9. **Browser pane ใช้ไม่ได้** → `scripts/shot.js` · dom-eval.js รับ width (390 ใช้ DPR 1 → คูณ 2 เมื่อครอปภาพ 390) · process ดับกลางเซสชันได้ (งานอยู่ในไฟล์/git)
10. **`node -e`/heredoc ที่มี escape/quote ไทย พัง** → Write tool ลง `_incoming/<รอบ>/` · สคริปต์ normalize `\r\n` ก่อน match · **Edit/Write tool เขียน LF** → `grep -c $'\r$'` = จำนวนบรรทัด ก่อน commit · `git ls-files --eol` ต้อง `i/lf w/crlf` · เทคนิค stage บางส่วนของไฟล์เดียว: เขียน HEAD+hunk → `git add` → คืนไฟล์เต็ม (`stage-wA-k8-dicts.js` · `stage-k5-uwell-card.js`)
11. **ปิด server ทดสอบด้วย PID เท่านั้น** (`netstat -ano | grep ":3412.*LISTENING"` → `taskkill //PID <pid> //F`) · ห้าม `taskkill /IM node.exe` · พอร์ต 3000 = พรีวิวเจ้าของ · **ห้าม build ขณะ server รัน** · base ของก้อนถัดไป = `.next` ที่มีอยู่ถ้า working tree สะอาดและ src ตรง HEAD (ประหยัด build 1 รอบ)
12. **ในรอบภาษา ห้ามแตะ:** layout · รูป · motion · `ordering-mode.ts` · ข้อความข้อ 43 · slug/URL/sitemap/structured data · `/warranty` · `render.yaml` · `.env*` · `cinematic/` · `Hero.tsx` · กลุ่ม ก (รวม FAQ "สูบไอ" + eliquid.disclaimer + AgeGate) · `labelTh/name/shortName` · `lg:min-h-10` · คำเตือนอายุ/นิโคติน

---

## 9. ห้ามรื้อ

- ทุกอย่างใน **THAI_STYLE §5 กลุ่ม ก** (รวม FAQ เชิงสุขภาพ "สูบไอ" ที่เจ้าของเคาะ 2026-09-13) · **§3 คำล็อก 12 + คำที่ล็อกรอบ 30.4** (สูบพอต · สำลี · แบบ · box mod · เสียงน้ำยาดังจ๊อก ๆ · คอยล์พันเอง · สเปก/ความสามารถ ห้าม "ลูกเล่น" · เติมด้านบน · ยังไม่ยืนยัน · เซ็นเซอร์ · จอทัชเต็มจอ · ชุดสี/รุ่น Classic/KOKO · คอยล์ mesh · **แหวนปรับลม · ธีมหน้าจอ · โหมดที่ตั้งค่ามาให้ · จอทัชสกรีน(ชื่อ)/จอทัช(ประโยค) · ถ่าน · ปุ่มยิง · ซีล · ไลน์อัพ · "ไม่มีปุ่ม สูบได้เลย" · หลัก "ที่สุด"**) · กติกาเรียกหัวพอต · **ทุกประโยคใน THAI_STYLE §7** ทุกรอบ รวม 30.4 ก้อน 0–6 + wiring — ห้ามเสนอแก้ซ้ำ
- **กฎรอบ 30.4:** ลูกค้าเลือกไทย = ไทยทั้งเว็บ ยกเว้นชื่อแบรนด์/รุ่น/อะไหล่ของแบรนด์ · ยืนยันไม่ได้ = ไม่พูด (ทุกภาษา) · โน้ตวิจัยห้ามอยู่บนเว็บ · FAQ ที่มีโน้ตวิจัย → เขียนใหม่ ไม่ตัดทิ้ง · การ์ดกลุ่มรสห้ามลงท้ายรูปเดียวกันเกิน 2 ใบ · shortDescription ของ PM แก้เฉพาะคำห้าม · title/meta ไทยสตริงเดียว · **ชื่อการ์ดจุดเด่นที่แบรนด์ตั้ง คงอังกฤษ** (Smart Triple-Tap Control · Pro-FOCS 4.0 · ชื่อโหมด) · สโลแกนแบรนด์ 7 ตัวคงอังกฤษ
- **โครงโค้ดที่เคาะแล้ว:** `product-copy-th.ts` เป็น overlay เดียวของสินค้า legacy (tagline · shortDescription · features) · `EditorialTagBadge` · `Brand.taglineTh` · `FeatureGrid` อ่าน overlay เมื่อ th fallback อังกฤษต่อใบ
- **B7 · B8 · C1 · H4 · G6** (30.3ข) · `lg:min-h-10` · label Finder อังกฤษ · `/warranty` · ตะกร้าปิด · แอดมิน/OTP ทดไว้ · "8 ตระกูล" · `/orders/<เลข>` ใช้ไม่ได้ = ไม่ใช่บั๊ก
- `.claude/agents/checker.md` ส่วน "Machine safety" และ **ด่าน U+2060** — เติมได้ ห้ามลบ

---

## 10. Git — งานที่ปนกันใน working tree ควรแยก commit ยังไง

[ตรวจแล้วจริง] ตอนเขียน: เหลือไฟล์นี้ + `docs/HANDOFF.2026-09-12-v20.md` (rename) + หัว `docs/LAUNCH_AUDIT.md` + `docs/THAI_STYLE.md` §6 (ข้อ 1 = ข) → commit `docs` ก้อนเดียว แล้ว push

นโยบาย: แยก commit ตามชนิด — `docs` / `feat` / `fix` / `copy` / `data` / `config` · ห้าม `git add -A` · message อังกฤษ · `git commit -F <ไฟล์ใน _incoming>` · ปิดท้าย `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` · push ทันทีหลัง commit · **ห้าม merge เอง** · ก่อน commit `git ls-files --eol` + นับ CRLF · งานเกินคำสั่ง = commit แยก (ย้อนได้เดี่ยว) · ไฟล์เดียวมี 2 ก้อน → stage บางส่วนด้วยสคริปต์ (ข้อ 8.10)

---

## 11. ความพร้อมแต่ละระบบ

| ระบบ | สถานะ | เหตุผลสั้น ๆ |
|---|---|---|
| เว็บสาธารณะ (ดู/ค้นหา/เทียบ) | พร้อม | ออนไลน์ ยิงเองแล้ว 200 |
| ภาษาไทย — เนื้อความ | **30.4ก ครบ live · 30.4ค ยังไม่เริ่ม** | หนัก 1 ✓ · การ์ดจุดเด่น 40/40 ✓ · hero/ป้าย/eyebrow/about/favorites ✓ · หนัก 2 (113) + อังกฤษ 492 + ช่องไฟ 188 ✗ |
| ภาษาไทย — title/meta/H1 | พร้อม (live) | render 105 หน้า 0/0/54 (30.3ข) · title /products แก้แล้ว |
| มือถือ M1–M4 + M1b | พร้อม | เจ้าของทดสอบเครื่องจริง (30.x ยังไม่ได้เปิด iPhone จริง) |
| เดสก์ท็อป | พร้อม ห้ามแตะ | 30.4ก: ทุกก้อน 0 นอกมาสก์ หรือ คู่สะอาด + designer "ดูถูกต้อง" |
| Render 2GB | ยังไม่ยืนยัน | ไม่มีรายงาน OOM ซ้ำ แต่ไม่มีรายงานว่าเฝ้าครบ |
| การสั่งซื้อออนไลน์ | ปิดตั้งใจ | ข้อ 43 · ข้อ 44 0/7 |
| รับเงินจริง | ยังไม่เคยทดสอบ | QR สแกนติด ยังไม่รับเงินจริง |
| สำรอง/กู้ | ครึ่งทาง | ดิสก์เดียวกัน · ยังไม่เคยกู้ |
| หน้าแอดมิน · SEO · ค้นหาไทย (ข้อ 47) | ยังไม่เริ่ม | ข้อ 1 · รอบ SEO · ข้อ 47 |
| ทีม agent | พร้อม 6 ตัว | SendMessage ใช้ได้ · checker ด่าน U+2060 |

---

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท

**ไม่มีงานค้างในโค้ด** — 20 commit ของเซสชันนี้ push และ merge แล้วทั้งหมด (main `a6df3a6`) · working tree เหลือแค่ docs ปิดรอบ (ข้อ 10) · server ทดสอบปิดหมด (netstat ยืนยัน) · ไม่มี agent ค้าง · ภาพปิดรอบ 30.4ก = `_incoming/30.4/shots-k6` + `crops-k6` (เจ้าของสั่งไม่ต้องถ่ายซ้ำ)

---

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)

1. **เปิดเซสชันใหม่** → วางบล็อกข้อ 16 → `git fetch` + `git status` → อ่านไฟล์คำสั่ง 30.4ค ของ Cowork (ถ้ามีแล้ว) · ถ้ายังไม่มี ถามเจ้าของว่าเริ่มส่วนไหนของ 5.1 ก่อน (แนะนำ: ข้อ 1 สเปก label/value 304 — ผลต่อลูกค้ามากสุด อยู่ทุกหน้าสินค้า · ทำเป็นชั้น A ทีละฟิลด์ ≤40 แถว)
2. ก่อนแตะ SpecSheet/Compatibility/whoIsThisFor/FAQ: อ่าน `src/components/product/SpecSheet.tsx` `SpecChip.tsx` `CompatibilitySection` + `product-copy-th.ts` header → ออกแบบ overlay ให้เป็นแบบเดียวกับ `features` (คีย์ = spec key / compatibility label / index) · ถ้าต้องเพิ่ม component = ชั้น B
3. หนัก 2 (113) + ช่องไฟ 188 + กวาด "ที่สุด" = ชั้น A (thai-copy ตาราง → เจ้าของเคาะ → build → render-check → checker → commit)
4. **ขั้นปิดรอบ 30.4ค:** ถ่ายทุกหน้าที่แตะ + designer 1 ครั้ง → แก้ตัดกลางคำทั้ง 31 จุด (ข้อ 4.1) + ที่เจอใหม่ ใน commit เดียว (ห้าม WJ · แก้ที่ข้อความ/เว้นวรรค ตามที่เจ้าของเคาะทีละจุด)
5. ถามเจ้าของเรื่องลบ `_incoming/` ภาพเก่า 1.8 GB (ข้อ 7) ก่อนถ่ายชุดใหม่
6. หลัง 30.4ค → 30.4ข → SEO → ข้อมูล → ข้อ 45 → แอดมิน → QR → ข้อ 42 · เปิดสวิตช์ขายเมื่อข้อ 44 ครบ 7 เกณฑ์เท่านั้น

---

## 14. ควรหยุดทำ

- **หยุดถ่ายภาพ/เรียก designer ต่อก้อนสำหรับงานชั้น A** — กฎ 2 ชั้นแล้ว (8.0) ทำเฉพาะขั้นปิดรอบ
- **หยุดยกรายการตัดกลางคำไป "รอบแยก"** — แก้ในขั้นปิดรอบ (ข้อ 4.1 ครบแล้ว)
- **หยุดเสนอ/ใช้ word joiner ที่อื่น** — 2 จุดเท่านั้น
- **หยุดพูด "ที่สุด" โดยไม่มีตัวเลขครบทุกรุ่นที่เทียบ** — ทั้งไทยและอังกฤษ
- **หยุดเกลาสำนวน shortDescription ของสินค้า PM** — ไม่โชว์บนเว็บ
- **หยุดถามทีละข้อ · หยุดเสนอแก้ของที่เคาะแล้ว (§7 ทุกรอบ · กลุ่ม ก · B7/B8/C1/H4 · title ผูกภาษา · ลำดับการ์ดจาก editorialTag)**
- **หยุดเขียนสคริปต์ด้วย `node -e`/heredoc ที่มี escape** — Write tool ลง `_incoming/`
- **หยุดเชื่อว่า Edit/Write tool คง CRLF** — นับ `\r` ทุกครั้ง (checker จับได้จริงรอบนี้)
- **หยุดสรุปผล diff-rows2 จากคู่แรกอย่างเดียวบนหน้าที่ hero มีแอนิเมชัน** — อ่าน 4 คู่ + noise ก่อน

---

## 15. ปลายทางของโปรเจกต์ — flow เต็ม

| ขั้น | ทำได้แล้วหรือยัง |
|---|---|
| ลูกค้าเปิดเว็บเจอสินค้า ราคา สี/กลิ่น สเปก รูป | ได้แล้ว |
| ค้นหา · กรอง · เทียบรุ่น | ได้แล้ว (ค้นไทยไม่ได้ — ข้อ 47) |
| อ่านแล้วเหมือนร้านไทยเขียน ไม่ใช่แปลมา | **4.7/5** — ข้อเท็จจริง ✓ · คำ ✓ · ประโยคค้าง ✓ · Google ✓ · หนัก 1 ✓ · hero/ป้าย/การ์ดจุดเด่น ✓ · ยังไม่: สเปก/ความเข้ากันได้/เหมาะกับใคร/FAQ อังกฤษ 492 · หนัก 2 · ช่องไฟ 188 |
| ใช้งานบนมือถือลื่น | ได้แล้ว (M1–M4 + M1b) |
| กดซื้อ → ตะกร้า → เช็คเอาต์ | โค้ดครบ ปิดสวิตช์อยู่ (ข้อ 43) · ตอนนี้สั่งทางไลน์ |
| จ่ายเงินด้วย QR PromptPay | โค้ดมี · สแกนติด · ยังไม่รับเงินจริง |
| ออเดอร์เข้าระบบ ร้านเห็น | บันทึกได้ · ยังไม่มีหน้าแอดมิน (ข้อ 1) |
| ร้านจัดส่ง แจ้งลูกค้า | ยังไม่มี |
| ข้อมูลปลอดภัย กู้คืนได้ | สำรองอัตโนมัติมี · ดิสก์เดียวกัน · ยังไม่เคยกู้ (ข้อ 42) |
| ลูกค้าหาเจอจาก Google | **ครึ่งทาง** — คำนิ่ง + title/meta/H1 ไทย live · รอบ SEO = slug/sitemap/structured data |

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD 1089827 (+docs ปิดรอบ commit ถัดไป) · origin/main a6df3a6 (PR #21) · branch นำหน้า main 0 = ทุกอย่างขึ้นเว็บแล้ว
  Cowork merge + deploy โดยไม่บอกในแชท → ก่อนสรุปสถานะให้ git fetch เสมอ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9 — เท่านี้พอ): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md (ฉบับ 21 — โดยเฉพาะ 4.1 รายการตัดกลางคำ · 5.1 ขอบเขต 30.4ค · 8.0 กฎ 2 ชั้น)
  → docs/THAI_STYLE.md ทั้งไฟล์ (§3 คำล็อก + รอบ 30.4 รวมก้อน 5/6 + หลัก "ที่สุด" · §5 กลุ่ม ก · §6 · §7 ทุกประโยคที่เคาะ)
  → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน" + ข้อ 30 36 47 48 (ห้ามอ่านทั้งไฟล์ · หัวไฟล์เขียน main เก่าได้ ให้เชื่อ git fetch)
  → ไฟล์คำสั่ง 30.4ค ของ Cowork (ถ้ามี — ถามเจ้าของว่าอยู่ไหน)

สถานะ: รอบ 30.4ก ปิดแล้ว 2026-09-14 (หนัก 1 · wiring A/D/ก8/ข1/ข3 · การ์ดจุดเด่น 40/40 · Q1 · title /products · shatterproof ออกทุกภาษา) — live ครบ
  รอบถัดไป 30.4ค: อังกฤษบนหน้าสินค้า ≈492 (_incoming/30.4/english-fields-2-after-k6.txt — สเปก label 152 · value 152 · ความเข้ากันได้ 105 · เหมาะกับใคร 49 · FAQ 22 · แกลเลอรี 8 · anatomy hardcode) · หนัก 2 = 113 · ข้อ 36 ช่องไฟ+ไทยติดอังกฤษ 188 · กวาด "ที่สุด" ไทย+อังกฤษ · ขั้นปิดรอบ = ตัดกลางคำ 31 จุด (HANDOFF 4.1 ไฟล์:บรรทัด) แก้ commit เดียว
  สั่งซื้อออนไลน์ปิด (OKAMI24_ORDERING=off ข้อ 43) → ไลน์ @okm24 · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 (count-storefront.ts เท่านั้น) · Render 2GB OOM ยังไม่ยืนยัน · น้ำยาบนหน้าร้าน 0
  agent: thai-copy (opus read-only · ตาราง ก่อน→หลัง) · writer opus · checker/researcher sonnet · designer inherit (ไม่มี Bash ครอปให้) · SendMessage ใช้ได้ (ต่อตัวเดิมตรวจซ้ำเฉพาะจุด)

กฎ 2 ชั้น (เจ้าของ 2026-09-14 · ถาวร):
  ชั้น A ข้อความล้วน (ไม่แตะ markup/CSS/element/component) = build → นับจาก render → checker เทียบตารางทุกแถว → commit → push · ไม่ถ่ายภาพ ไม่ต้อง designer ต่อก้อน
  ชั้น B แตะโครง (markup · CSS · เพิ่ม/ซ่อน element · component · word joiner) = ถ่ายก่อน/หลัง 390+1440 + มาสก์จาก DOM + designer + checker
  ปิดรอบทุกรอบ = ถ่ายทุกหน้าที่แตะ + designer 1 ครั้ง → รวมทุกจุด (รวมตัดกลางคำ) → แก้ commit เดียว
หลัก "ที่สุด": พูดได้เฉพาะเมื่อทุกรุ่นที่เทียบมีตัวเลขในสเปกครบ (ไทย+อังกฤษ) · ยืนยันไม่ได้ = ไม่พูดทุกภาษา · ประโยคใหม่ทุกประโยคต้องเจ้าของเคาะจากตาราง ก่อน→หลัง ก่อนใส่โค้ด

ห้ามแตะ: layout · รูป · motion · ordering-mode.ts · ข้อความข้อ 43 · slug/URL/sitemap/structured data · /warranty · Hero.tsx · cinematic/ · กลุ่ม ก (รวม FAQ "สูบไอ" · eliquid.disclaimer · AgeGate) · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · U+2060 นอก 2 จุด (beverage "เบเกอรี่" · touch "จอทัช") · ชื่อฟีเจอร์/โหมดที่แบรนด์ตั้ง · สโลแกนแบรนด์ 7 ตัว · "Retailer-confirmed" 2 ค่าใน joiway.ts (ลำดับการ์ด)
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · context 600K → แจ้ง "ขอจบก้อนนี้ก่อน" แล้ว handoff · กติกาถาม: ย้อนง่าย+ลูกค้าไม่เห็น = ตัดสินเองแล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคที่ลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout · รวมชุดเดียว 2-3 ทาง+แนะนำ · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง (+ด่าน U+2060) · ผู้แก้ไฟล์คนเดียวคือตัวหลัก · ใส่ข้อห้าม taskkill/build/server ในคำสั่ง agent ทุกตัวที่มี Bash
  · ปิด server: netstat -ano | grep ":<port>.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · base ของก้อนถัดไป = .next เดิมถ้า tree สะอาด
  · เดสก์ท็อป (ชั้น B): มาสก์ใหม่จาก DOM ทุกก้อน (mask-eval-*.js เขียนก่อนถ่ายภาพหลัง ห้ามแก้หลังเห็น diff) · diff-rows2 มาสก์ทั้งแถว · หน้าที่ hero มีแอนิเมชัน (G5 · KOKO · argus-g4 · joiway-f4) อ่านคู่สะอาดจาก 4 คู่ (proof-*.sh) · หน้าสั้นลง = resample ใต้จุดเปลี่ยน ไม่ใช่ layout · designer ต้องบอก "ดูถูกต้อง"
  · สคริปต์เขียนด้วย Write tool ลง _incoming/<รอบ>/ (node -e/heredoc พัง) · normalize \r\n ก่อน match · Edit/Write เขียน LF → นับ grep -c $'\r$' = จำนวนบรรทัด ก่อน commit · git ls-files --eol ต้อง i/lf w/crlf · stage บางส่วน: เขียน HEAD+hunk → git add → คืนไฟล์เต็ม

เครื่องมือ: Browser pane ใช้ไม่ได้ → node scripts/shot.js out.png <url> --width 390|1440 [--desktop] [--wait ms] [--cookie okami24_locale=en] · dom-eval: node _incoming/30.3b/dom-eval.js <url> <eval.js> <out.json> [width] · _incoming/30.4/: english-fields-2.ts · english-audit.js · wordbreak-locate.js · features-rect-eval.js · mask-eval-wA/k5/k6.js · shoot-*.sh · proof-*.sh · crops-*.js · row-bands.js · apply-*.js · append-docs-*.js · fix-crlf-wA.js · stage-*.js · wj-render-check.js · _incoming/30.3b/: diff-box.js · diff-rows2.js · region-delta.js · crop: node _incoming/qc/2026-09-08-mobile-B/crop-png.js <in> <out> <x> <y> <w> <h>
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · npx tsx _incoming/30.4/english-fields-2.ts (492) · grep พอตี/แท่ง/หัวหอม/คาร์ทริดจ์/ตลับ/ดิสโพส/ลูกเล่น/เซลล์แบต = 0 · raw U+2060 = 0
Git: commit แยกชนิด (feat/fix/copy/data/docs/config) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push ทันที · ห้าม merge เอง
รอเจ้าของ: ยืนยันประโยค VMATE i3 การ์ด slim-body · ลบ _incoming ภาพเก่า 1.8 GB ไหม · ไฟล์คำสั่ง 30.4ค · ผลเฝ้า Render · iPhone จริง · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 (ถ้ามี)
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **รัน `git fetch` + `git status` + `git log -12 --oneline` แล้วเทียบกับเอกสารนี้ — ถ้าไม่ตรงให้เชื่อ repo** (main อาจขยับอีกจาก docs commit ปิดรอบ · หัวไฟล์ LAUNCH_AUDIT ล้าสมัยได้เสมอ)
2. **หาไฟล์คำสั่ง 30.4ค ของ Cowork** (ถามเจ้าของว่าอยู่ไหน) → อ่าน HANDOFF 5.1 + 8.0 (กฎ 2 ชั้น) → จัดงานเป็นชั้น A/B ก่อนเริ่ม · ยิง `okami24.store/products/caliburn-g4-pro` ("1 ใน 6 รายการ" = 30.4ก live)
3. **เริ่มก้อนแรกของ 30.4ค แบบชั้น A** (แนะนำสเปก label/value ทีละฟิลด์ ≤40 แถว) — thai-copy ตาราง → เจ้าของเคาะ → apply → build → render-check → checker → commit · ไม่ต้องถ่ายภาพจนถึงขั้นปิดรอบ
