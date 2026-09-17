# OKami24 — HANDOFF

สร้างเมื่อ: 2026-09-17 ค่ำ (**ฉบับที่ 26.1** — **รอบ 30.4ข ปิดแล้ว** ก้อน 1–5 + ปิดรอบ live (PR #33) · ก้อน A ชั้น A push แล้ว รอ Cowork merge · ฉบับก่อนเก็บที่ `docs/HANDOFF.2026-09-17-v25.md` และ `docs/HANDOFF.2026-09-16-v24.md`)

อ้างอิงจาก: branch `checkpoint/phase-3.3.3` HEAD = ก้อน A (copy + chore + docs ฉบับนี้) · `origin/main` **`998694e`** (PR #33 = ปิดรอบ · #32 = ก้อน 5 · #31 · #30 · #29 · #28) · branch นำหน้า main = ก้อน A · working tree: ว่าง (เหลือไฟล์นี้)

**สิ่งที่ตรวจจริงตอนเขียน [ตรวจแล้วจริง]:** `git fetch` + `git log` · เว็บจริงหลัง PR #31: FAQ eyebrow "ถาม-ตอบ" · /search "เครื่องมือ" · **[เจ้าของบอก]** PR #32 แถบความมั่นใจขึ้นครบ 3 ภาษา · build ปิดรอบ `_incoming/30.4b/build-close.log`: tsc · eslint · i18n 16/16 · verify:catalog --full 20/20 (`verify-catalog-close.log`) · raw-chars 0 · wordbreak-scan 14 หน้า × 2 จอ (`wb-close.log` · diff `wb-diff-close.md`) · designer 1 รอบ ก/ก/(ข→variant) · checker ผ่าน · server 3412 ปิดแล้ว · `.git` 28 MB · `_incoming/30.4b` 30 MB · `_incoming/30.4c` 265 MB (เจ้าของยังไม่ให้ลบ)

> **วิธีอ่าน:** ทุกข้อกำกับ **[ตรวจแล้วจริง]** / **[ผมเข้าใจว่า]** / **[เจ้าของบอก ยังไม่ได้ตรวจเอง]** · **"ตรวจผ่านตามเกณฑ์" ≠ "เจ้าของอนุมัติ"**
> **รายการงานหลัก = `docs/LAUNCH_AUDIT.md`** — อ่านเฉพาะหัว "สถานะปัจจุบัน" + เลขข้อที่กำลังทำ **ห้ามอ่านทั้งไฟล์**
> **ภาษาไทยบนเว็บ: `docs/THAI_STYLE.md` เป็นแหล่งความจริงเดียว** — §3 คำล็อก · §5 กลุ่ม ก · §6 typography · §7 ท้ายไฟล์ "รอบ 30.4ข ก้อน 1–5" + "ปิดรอบ 30.4ข + ก้อน 6"
> **กติกา context: ดู CLAUDE.md 13.6 (2026-09-17) · push ทุกครั้ง = อัปเดต §16**

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
9. **thai-typography `within` ของ /about ห้ามยกไปใช้ที่อื่น** (THAI_STYLE §5) — จุดตัด "ไม่ \| ปั่นราคา" ในแถบจึงต้องแก้ด้วยคำ ไม่ใช่ joiner → รอเจ้าของ
10. **Cowork merge เร็ว** — PR #30/#31/#32 merge ระหว่างทำก้อนถัดไป · `git fetch` ก่อนสรุปทุกครั้ง

---

## 1. สถานะปัจจุบัน

**[ตรวจแล้วจริง]**

- **โปรเจกต์:** เว็บร้านพอต **OKami24** · Next.js 16 + TS + Tailwind v4 + SQLite · โฟลเดอร์ `C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3` · GitHub `github.com/dhetchaiyakrith24/okami24-web` (private)
- **branch ทำงาน:** `checkpoint/phase-3.3.3` HEAD = ก้อน A (+ไฟล์นี้) · **live `main` = `998694e`** (PR #33 = ปิดรอบ) · นำหน้า main = ก้อน A (copy + chore + docs) push แล้ว รอ Cowork merge
- **รอบ 30.4ข = จบ** (ก้อน 1–5 + ปิดรอบ live · ก้อน A ชั้น A รอ merge) · **ถัดไปตาม §5.2:** รอบเก็บบ้าน → SEO → บทความ → ข้อมูล → ตะกร้า
- **การสั่งซื้อออนไลน์ปิดอยู่** (`OKAMI24_ORDERING=off` ข้อ 43) → ไลน์ `@okm24` · ห้ามเสนอเปิด · สินค้า 53 ซื้อได้ 31 · น้ำยา 0
- **checkpoint/จุดกลับ:** ก่อน 30.4ข = `62ef152` · จบก้อน 1 `73d4f3b` · ก้อน 2 `dea2a1e` · ก้อน 3 `e014b8a` · ก้อน 4 `1965393` · ก้อน 5 `1f55dee` · **ปิดรอบ `14dbbe5`**

---

## 2. ทำเสร็จแล้ว (ใช้งานได้จริง ตรวจแล้ว) — รอบ 30.4ข

- **ก้อน 1 `6ded138` (live)** หัวข้อ K1–K3 · H2 หน้าแรกตัด max-w · /compare ตัวบอกเลื่อน + หัวแถว 12px ≥lg
- **ก้อน 2 `dea2a1e` (live)** บรรทัดสเปกเด่นบนการ์ดทุกที่ จาก verified เท่านั้น 38/53 (`card-headline-spec.ts` · dictionary `catalog.card*`)
- **ก้อน 3 `f83b8f1` + `e014b8a` (live)** คำโปรย 6 หมวด th+en (meta ด้วย) · กวาด "ไม่เผาไหม้"/"เปลี่ยนจากบุหรี่มวน" 3 ภาษา · brands UWELL/JOIWAY/IQOS · คำล็อก "อุ่นยาสูบ"
- **ก้อน 4 `1965393` (live)** FAQ eyebrow "ถาม-ตอบ"/"问答" · /search eyebrow = footer.tools
- **ก้อน 5 `1f55dee` (live)** `TrustBar.tsx` เหนือ footer ทุกหน้า · `trust.items[4]` 3 ภาษา · แบบแถว มือถือไอคอนบน
- **ปิดรอบ + ก้อน 6 `14dbbe5` (รอ merge)** sticky หัวแถว /compare · ลิงก์ "แหล่งที่มา" hover สว่าง+ขีด · wordbreak-scan 14 หน้า (FIXED 1 · NEW 2)
- docs ทุกก้อน: THAI_STYLE §7 ตารางต่อก้อน · LAUNCH_AUDIT หัว + ข้อ 44 · HANDOFF §16 ทุก push

---

## 3. เพิ่งทำล่าสุด (เซสชันนี้ 2026-09-17 · ก้อน 3 → ปิดรอบ · main ขยับ 3 ครั้ง = PR #30 #31 #32)

| ก้อน | commit | ผลตรวจ | สถานะ |
|---|---|---|---|
| 3 คำนำหมวด | `f83b8f1` feat · `e014b8a` copy · `1463edb` docs | thai-copy 2 ชุด · writer en · designer 10/10 (หลังแก้ IQOS) · checker 8/8 + R1–R5 · verify:catalog 20/20 | **live** PR #30 |
| 4 eyebrow ซ้ำ | `1965393` copy · `fa01d88` docs | นับ 50 คู่ ซ้ำ 4 แก้ 2 · designer 4/4 ก · checker ผ่าน | **live** PR #31 |
| 5 แถบความมั่นใจ | `1f55dee` feat · `ca6287a` docs | thai-copy 2 ชุด · writer en/zh · designer 2 แบบ → แถว · มือถือรอบ 2 ก · checker ตีกลับ zh 保证 → ผ่าน · verify:catalog 20/20 | **live** PR #32 |
| ปิดรอบ + ก้อน 6 | `14dbbe5` fix · docs ฉบับนี้ | designer ก/ก/(ข→variant) · checker ผ่าน · verify:catalog 20/20 · wordbreak 14 หน้า | push แล้ว **รอ merge** |
| กฎ handoff ชุดเดียว | (นอกรีโป: `~/.claude/CLAUDE.md` 13.6/13.7 · §10 คงไว้) + ไฟล์นี้ | เจ้าของสั่ง | ทำแล้ว |

**คำตัดสินเจ้าของในเซสชันนี้ [เจ้าของบอก]:** ก้อน 3 เกลาของเดิม · ข ข ข ข ก ข · "อุ่นยาสูบ" ล็อก · ตัด "ไม่เผาไหม้" + "บุหรี่มวน" ทุกภาษา · brands 3 จุด · รส tobacco "ชอบโทนนี้" · Genuine ไม่ใช่ Official · ก้อน 4 ข "ถาม-ตอบ" · zh 问答 · /search เครื่องมือ · ก้อน 5 ชุด ก ข้อ 1 สั้น · แถว · มือถือไอคอนบน · padding 32/40 · tagline จดรอบหน้า · ไม่ใส่ข้อ 5 · ก้อน 6 รวมปิดรอบ · กฎ context/handoff ฉบับเดียว 13.6

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

### 5.1 รอบ 30.4ข — ~~ก้อน 1–6 + ปิดรอบ~~ **จบ 2026-09-17** (รายละเอียดต่อก้อน: THAI_STYLE §7)

### 5.2 ลำดับถัดไป (เจ้าของสั่งไว้ · ยังไม่เปิดรอบใหม่ — รอเจ้าของพิมพ์)
รอบเก็บบ้าน (คำสั่ง/เอกสาร/agent/HANDOFF ให้สั้น · PuffCount dead · ProductHero verified · `_incoming/30.4c` 265 MB) → รอบ SEO (`03-รอบ SEO.txt` · JSON-LD description legacy 35 หน้ายังอังกฤษ · alt แกลเลอรี · แยก meta จากคำโปรยถ้าจำเป็น) → รอบบทความ → รอบข้อมูล (verify สเปก · taxonomy Coil-72/89 · TPD) → รอบตะกร้า (+ข้อ 49 · สถานะคำสั่งซื้อ eyebrow) → ข้อ 45 → แอดมิน → QR → ข้อ 42 · 47/48 → รอบการขาย · รอบ label (`compare.rowDrawStyle`) · รอบ meta/tagline

---

## 6. จำเป็นแต่ยังไม่ได้ทำเลย
เหมือน v22 §6 (ข้อ 44 · แอดมิน · QR · backup R2/B2 · Lighthouse · iPhone จริง)

## 7. คำถามที่เจ้าของต้องตอบ

| เรื่อง | รู้แล้ว | ต้องตอบ |
|---|---|---|
| ~~แถบข้อ 2~~ | ตอบแล้ว = ใช่ · ใส่แล้วก้อน A | — |
| footer.tagline ตัด 3 คำซ้ำ | เสนอไว้ §4 | ใช่/ไม่ (รอบ tagline) |
| ลบภาพ `_incoming/30.4c` 265 MB | เจ้าของ 2026-09-16: ยังไม่ลบ | เมื่อไหร่ |
| ยังรอเหมือน v24 | TPD · #31/#34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 | |

## 8. ความเสี่ยงและจุดต้องระวัง

### 8.0 กฎ 2 ชั้น + ที่ตกผลึกรอบนี้
- **ชั้น A ข้อความล้วน / ชั้น B แตะโครง / ปิดรอบ** เหมือน v21 §8 · รอบ 30.4ข ทุกก้อน = ชั้น B (เจ้าของสั่ง) · ถ่าย **before ให้จบก่อน build** · Chrome ทีละงาน
- **ของใหม่ทุกชิ้น เจ้าของต้องเห็นภาพก่อน commit** — แบบเสนอทำด้วย DOM override บน build เดียว (k3-variant · k4-shots --faq-file · k5-shots --variant/--short) ถูกกว่า rebuild แต่ต้องถ่ายซ้ำบน build จริงก่อนปิด
1. **ตัวเลขบนหน้าเว็บต้องชี้แถวสเปก verified ได้** — `card-headline-spec.ts` แบบอย่าง · brands JOIWAY ตัดเลขพัฟเพราะ unverified · RELX คงเพราะ verified
2. **NBSP/U+2060 เฉพาะตอน render** (`thai-typography.ts`) · ด่าน `thai-raw-chars-check.js` 0 · en/zh text node ไทย 0 (`shot.js --cookie okami24_locale` + eval — curl ใช้ไม่ได้ SSR ไทยเสมอ) · `within` ของ /about ห้ามยกไปใช้ที่อื่น
3. **`thaiTypography()` ต้องมี locale guard** · dictionary ผ่าน LocaleProvider (TrustBar ได้อัตโนมัติ)
4. **Cowork merge โดยไม่บอก** → `git fetch` ก่อนสรุป · ห้าม merge เอง · ห้าม force push
5. **กติกา context:** ดู CLAUDE.md 13.6 (2026-09-17) · push ทุกครั้ง = อัปเดต §16
6. **หลัก "ยืนยันไม่ได้ = ไม่พูดทุกภาษา"** · ห้าม ส่งฟรี/รับประกัน/จ่ายผ่าน/ตะกร้า/"ที่สุด"/สุขภาพ ในข้อความใหม่ · zh ระวังคำ 保证
7. **สคริปต์ที่ generate หลักฐานต้องจำลอง logic ของ component ครบ** · ข้อความไทยส่งเข้าสคริปต์ทางไฟล์เท่านั้น

## 9. ห้ามรื้อ
เหมือน v24 + ทุกแถวใน THAI_STYLE §7 "รอบ 30.4ข ก้อน 1–5" และ "ปิดรอบ" · `card-headline-spec.ts` กติกา · dictionary `catalog.card*` · `trust.*` (ชุด ก เจ้าของเคาะ) · `TrustBar.tsx` แบบแถว/ไอคอน 4 ตัว · sticky th /compare · `ScrollHintFrame` · หัวข้อ K1–K3 · คำล็อก "อุ่นยาสูบ" · ข้อห้าม "ไม่เผาไหม้" ทุกภาษา · FAQ eyebrow "ถาม-ตอบ" · /search eyebrow = footer.tools

## 10. Git
working tree ว่าง (เหลือไฟล์นี้) · main `3253419` · branch นำหน้า main = `14dbbe5` fix-close + docs ฉบับนี้ (push แล้ว) · ห้าม merge เอง · commit ถัดไป (ถ้าเจ้าของเคาะ §7): copy แถบข้อ 2 เดี่ยว

## 11. ความพร้อมแต่ละระบบ
เหมือน v22 · ภาษาไทยทั้งเว็บ: 30.4ค ปิดครบ · **30.4ข ปิดครบ** · การ์ดสินค้า: บรรทัดสเปกเด่น 38/53 · แถบความมั่นใจทุกหน้า 3 ภาษา

## 12. กำลังทำอะไรค้างอยู่ตอนปิดแชท
- ไม่มีงานค้างกลางทาง · รอบ 30.4ข จบ · ปิดรอบ push แล้วรอ merge → หลัง merge ยิงเว็บจริง 2 คำสั่งใน §16
- server 3412 ปิดแล้ว · ไม่มี process ค้าง
- เครื่องมือรอบนี้ใน `_incoming/30.4b/` (gitignored): k3-shots/variant/sheets/desc-len/category-facts · k4-eyebrow-pairs/shots/sheets · k5-shots/sheets/sheet-desktop/short.json · k6-shots · wb-close/ + wb-diff-close.md · crops-k3..k6/ · build-*.log · verify-catalog-*.log · brief ทุก agent · commit-*.txt

## 13. แนะนำทำอะไรต่อ (เรียงลำดับ)
1. วางบล็อก §16 → `git fetch` → ถ้า main ขยับเกิน `3253419` = ปิดรอบ merge แล้ว → ยิงเว็บจริง 2 คำสั่ง §16
2. ~~แถบข้อ 2~~ ทำแล้ว (ก้อน A) · ถ้า main ขยับเกิน `998694e` = ก้อน A merge แล้ว → ยิงเว็บจริง 3 คำสั่ง §16
3. **รอเจ้าของเปิดรอบใหม่** (§5.2 — รอบเก็บบ้านก่อน) · ห้ามเริ่มเอง

## 14. ควรหยุดทำ
- ห้ามถ่ายทั้งเว็บก่อนสแกน · ห้ามเพิ่ม joiner/NBSP นอกรายการ · ห้ามรัน Chrome 2 งานพร้อมกัน · ห้ามไล่แก้คำโดดระดับ B · ห้ามใส่ placeholder แทนแถวสเปกว่าง · ห้ามเปลี่ยน CategoryLabel/label-lang/lg:min-h-10
- ห้ามแก้ `ProductHero.tsx` stats / ลบ `PuffCount.tsx` / ย้ายหมวด Coil-72/89 นอกรอบเก็บบ้าน/ข้อมูล · ห้ามแตะ footer.tagline / หน้าบริการ / ระบบตะกร้า จนกว่าเจ้าของเปิดรอบนั้น

## 15. ปลายทางของโปรเจกต์
เหมือน v21 §15

---

## 16. บล็อกสำหรับวางในแชทใหม่ (copy-paste)

```
โปรเจกต์: เว็บร้าน OKami24 (Next.js 16 + TS + Tailwind v4 + SQLite) แปลงจากเดโม NOVA VAPOR
โฟลเดอร์: C:\Users\dhetc\Claude-Web-Lab-v3-checkpoint-3.3.3 · GitHub github.com/dhetchaiyakrith24/okami24-web (private)
Branch: checkpoint/phase-3.3.3 HEAD = docs v26.1 (ต่อจาก copy + chore ก้อน A) · origin/main 998694e (PR #33 = ปิดรอบ 30.4ข live) · นำหน้า main = ก้อน A (copy แถบข้อ 2 + โน้ตความเข้ากันได้ 2 ข้อ · chore scripts/scan.js + checker.md · docs) push แล้ว 2026-09-17 ค่ำ รอ Cowork merge · git fetch ก่อนเชื่อ · ห้าม merge เอง
อ่านก่อน (กฎ 13.9): ~/.claude/CLAUDE.md หมวด 13 → CLAUDE.md โปรเจกต์ → docs/HANDOFF.md ฉบับ 26 (ข้อขัดแย้ง 1–10 · 4 · 7 · 8.0) → docs/THAI_STYLE.md (§3 คำล็อก · §5 กลุ่ม ก · §7 ท้ายไฟล์ "รอบ 30.4ข ก้อน 1–5" + "ปิดรอบ") → docs/LAUNCH_AUDIT.md เฉพาะหัว "สถานะปัจจุบัน"

สถานะ: **รอบ 30.4ข จบแล้ว** (ก้อน 1–5 + ปิดรอบ live PR #28–#33) · **ก้อน A ชั้น A รอ merge:** แถบข้อ 2 "…ที่ขายจริง ไม่ปั่นราคา" (390 ไม่ตัด "ไม่" ค้างแล้ว) · โน้ตความเข้ากันได้ Caliburn G2/X ↔ คอยล์ 1.0Ω เป็นไทย (coil-53/55/74 · compat-copy-th.ts COMPAT_EVIDENCE_TH) · **ด่านถาวรใหม่ `node scripts/scan.js`** = ประโยคอังกฤษหลุดบนหน้าไทย ต้อง PASS 0/105 (ก่อนแก้ FAIL 3/105 = 2 โน้ตนั้นเท่านั้น) · เพิ่มใน checker.md แล้ว
  หลัง merge ยิงเว็บจริง: curl -s https://okami24.store/ | grep -c "ราคาที่ขายจริง" (1) · curl -s https://okami24.store/products/coil-53 | grep -c "หน้าร้านค้าปลีกระบุว่าหัวพอต Caliburn X" (1) · node scripts/scan.js --base https://okami24.store (PASS 0/105)
  รอเจ้าของ: footer.tagline ตัด 3 คำซ้ำกับแถบ (รอบ tagline) · zh โน้ตความเข้ากันได้ 2 ข้อยังอังกฤษ (รอบภาษาจีน — รายงานตามสั่ง ไม่แก้)
  ถัดไป: รอเจ้าของเปิดรอบใหม่ตาม §5.2 (รอบเก็บบ้าน → SEO → บทความ → ข้อมูล → ตะกร้า) — ห้ามเริ่มเอง
  เจ้าของตัดสินแล้ว ห้ามถามซ้ำ: ตะกร้าปิด (ข้อ 43) → ไลน์ @okm24 · น้ำยา 0 ข้าม · หน้าบริการไม่แตะ (ข้อ 49) · งานรูปพัก · ยังไม่ผูก NBSP นอกรายการ · 6 ตัวการ์ดแถวว่างรับได้ · ภาพ _incoming/30.4c 265 MB ยังไม่ลบ · #31 #34 iPhone · tagline/ตะกร้า/หน้าบริการ = รอบของมัน
  agent: thai-copy (ตาราง ก่อน→หลัง) · writer (en/zh) · checker 5 ช่อง · designer (ครอป+ตัวเลข ไม่มี Bash) · ใส่ข้อห้าม build/server/taskkill/Chrome/แก้ไฟล์ ในคำสั่งทุกตัว · เขียน docs ให้นิ่งก่อนส่ง checker

กติกา context: ดู CLAUDE.md 13.6 (2026-09-17) · push ทุกครั้ง = อัปเดต §16
กฎ 2 ชั้น: ชั้น B → build → ถ่าย before ให้จบก่อน build ใหม่ → ถ่าย after 390+1440 → designer → เจ้าของเลือกภาพ → checker → commit · ข้อความใหม่ทุกประโยค = 3 ภาษา + เจ้าของเคาะไทย · ตัวเลขทุกตัวชี้แถวสเปก verified · ห้าม U+2060/NBSP นอกกลไก · thaiTypography() ต้องมี locale guard · หลักฐานที่ generate ต้องจำลอง logic ของ component ครบ · ห้าม ส่งฟรี/รับประกัน/จ่ายผ่าน/ตะกร้า/"ที่สุด"/สุขภาพ · zh ระวัง 保证
ห้ามแตะ: layout นอกจุดที่ระบุ · รูป · motion · ordering-mode.ts · slug/URL/sitemap/structured data · หน้าบริการ · Hero.tsx · cinematic/ · กลุ่ม ก · labelTh/name/shortName · lg:min-h-10 · คำเตือนอายุ/นิโคติน · ชื่อสี/กลิ่น · thai-typography.ts รายการ · CategoryLabel.tsx · card-headline-spec.ts กติกา · dictionary catalog.card* / trust.* · TrustBar แบบแถว · ProductHero stats / PuffCount (รอบเก็บบ้าน) · footer.tagline
กฎเหล็ก: ห้าม deploy/merge main เอง · revert ไม่ reset · ห้าม force push · ห้ามกุตัวเลข · ตัดสินเอง = ย้อนง่าย+ลูกค้าไม่เห็น แล้วเขียน "ตัดสินเอง: … เพราะ …" · ต้องถาม = ประโยคลูกค้าอ่าน/รสนิยม/คำนอกตาราง/layout รวมชุดเดียว · งานเกินคำสั่ง = commit แยก
  · checker 5 ช่อง + ด่าน: node scripts/thai-raw-chars-check.js = 0 · grep 8 คำห้าม (พอตี|แท่ง|หัวหอม|คาร์ทริดจ์|ตลับ|ดิสโพส|ลูกเล่น|เซลล์แบต) = 0 · head/JSON-LD 0 · en/zh text node ไทย 0 (shot.js --cookie okami24_locale=en/zh + eval — curl ไม่ได้) · grep "[ก-๙]" บน Git Bash = byte-range false positive ใช้ Node code-point แทน · ผู้แก้ไฟล์คนเดียวคือตัวหลัก
  · ปิด server: netstat -ano | grep ":3412.*LISTENING" → taskkill //PID <pid> //F · ห้าม /IM node.exe · พอร์ต 3000 = เจ้าของ · ห้าม build ขณะ server รัน · verify:catalog --full build เอง รันตอน server ปิด · Chrome ทีละงาน · งาน >10 นาที = (cmd &) + เฝ้า log
  · สคริปต์เขียนด้วย Write tool · ข้อความไทยเข้าสคริปต์ทางไฟล์ json/txt เท่านั้น (argv mangled) · shot.js ห่อผล eval JSON 2 ชั้น (parse ซ้ำ) · CRLF: ไฟล์ใหม่จาก Write = LF → unix2dos ก่อน git add · ตรวจ git ls-files --eol · Git Bash แปลง arg "/" → MSYS_NO_PATHCONV=1

เครื่องมือ (_incoming/30.4b): shot.js (scripts/) · k3-shots.js <before|after> [--only …] [--locale …] (ครอปหัวหน้า+วัดบรรทัด) · k3-variant.js <json> (ลองคำใหม่ไม่ต้อง build) · k4-eyebrow-pairs.ts · k4-shots.js <tag> [--faq-file f] [--search-file f] · k5-shots.js <tag> [--variant row|cards] [--short] [--only w] [--locale l] · k6-shots.js <tag> (sticky /compare + hover จำลอง) · k*-sheets.js (ภาพรวม before/after) · scripts/wordbreak-scan.js --base … --widths 390,1440 --out _incoming/30.4b/wb-<tag> /path… (MSYS_NO_PATHCONV=1) → node _incoming/30.4c/wb-diff.js <before> <after>
  · server ทดสอบ: SITE_URL=https://okami24.store npx next build แล้ว SITE_URL=https://okami24.store OKAMI24_DATA_DIR=<tmp> OKAMI24_BACKUP_DISABLED=1 OKAMI24_STARTUP_PROBE=0 npx next start -p 3412
Verify: npx tsc --noEmit · npx eslint <ไฟล์> · npm run verify:commerce (16) · SITE_URL=… npm run verify:catalog -- --full (20 · ปิด server ก่อน) · npx tsx scripts/count-storefront.ts (53/31) · npx tsx src/i18n/i18n-contract-test.ts (16) · node scripts/thai-raw-chars-check.js (0)
Git: commit แยกชนิด (feat/fix/copy/data/docs) · git commit -F <ไฟล์> · อังกฤษ · Co-Authored-By: Claude Opus 5 <noreply@anthropic.com> · push ทุกก้อนหลัง checker ผ่าน · ห้าม merge เอง
รอเจ้าของ: tagline · zh โน้ตความเข้ากันได้ · TPD · #31 #34 iPhone · ผลเฝ้า Render · priority 2 จุด · Lighthouse · ข้อ 10/13/16/37 · ชื่อบัญชี · รูปหัวพอตดำ 18 กลิ่น · R2/B2 · ไลบรารี QR · บัญชี 189 · ลบภาพ 265 MB
```

---

## สิ่งแรกที่แชทใหม่ควรทำ

1. **`git fetch` + `git status` + `git log -5 --oneline`** แล้วเทียบกับไฟล์นี้ — ถ้าไม่ตรงให้เชื่อ repo · ถ้า origin/checkpoint ยังไม่มี commit ล่าสุดของไฟล์นี้ = push ไม่สำเร็จ → push ก่อน
2. ถ้า main ขยับเกิน `3253419` = ปิดรอบ merge แล้ว → ยิงเว็บจริง 2 คำสั่งใน §16
3. **รอเจ้าของพิมพ์** ว่าจะเคาะ §7 แถวแรก และ/หรือเปิดรอบไหนใน §5.2 — ห้ามเริ่มรอบใหม่เอง
