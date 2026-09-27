# ให้แชท (คอม + คลาวด์) อ่าน Google Search Console ได้ — แบบอ่านอย่างเดียว

> รอบ C เรื่อง 5 (2026-09-27) · คู่มือที่พี่กดตามเอง = ภาษาไทย (13.11) · ทำครั้งเดียว ประมาณ 15 นาที · ฟรี

## ทำงานยังไง (สั้น ๆ)

- กุญแจ (ไฟล์ JSON ของ "บัญชีบริการ" Google) **อยู่ใน GitHub ที่เดียว** ในช่องลับของ environment ชื่อ `gsc` — ใช้ได้เฉพาะงานที่รันจาก `main` · Friday อ่านช่องลับไม่ได้ ไม่เห็นกุญแจ
- ทุกเช้า 06:30 (หรือพี่กด Run เอง) GitHub จะดึงรายงาน GSC ย้อนหลัง 28 วัน (คำค้น · หน้า · คำค้นกับหน้า · อุปกรณ์ · ประเทศ) และ 90 วัน (รายวัน) แล้วเก็บไว้ที่ branch `gsc-data` — เป็นแค่ตัวเลข ไม่มีกุญแจ
- แชทไหนก็อ่านได้: `git fetch origin gsc-data` แล้วเปิด `gsc/latest/…` (บนคลาวด์ใช้ได้เพราะเป็น git ธรรมดา ไม่ต้องต่อ Google)
- กุญแจนี้ **อ่านรายงานได้อย่างเดียว** แก้อะไรใน GSC ไม่ได้ (สิทธิ์ "Restricted" + ขอบเขต `webmasters.readonly`)

## ขั้นที่พี่ต้องทำ (ทำหลัง Friday merge PR ของเรื่องนี้แล้ว)

**ส่วนที่ 1 — สร้างบัญชีบริการใน Google Cloud** (ใช้บัญชี Google ที่เป็นเจ้าของ GSC ของ okami24.store)
1. เปิด https://console.cloud.google.com → ล็อกอิน → ด้านบนซ้ายกดรายชื่อโปรเจกต์ → **New project** → ชื่อ `okami24-gsc` → **Create** → รอจนขึ้นว่าสร้างเสร็จ แล้วเลือกโปรเจกต์นี้
2. ช่องค้นหาด้านบน พิมพ์ `Google Search Console API` → กดผลลัพธ์นั้น → **Enable** (เห็นคำว่า "API enabled" = ผ่าน)
3. ช่องค้นหา พิมพ์ `Service Accounts` → **Create service account** → ชื่อ `gsc-reader` → **Create and continue** → หน้าเลือกบทบาท (role) ไม่ต้องเลือกอะไร กด **Continue** → **Done**
4. กดที่บัญชี `gsc-reader` ที่เพิ่งสร้าง → แท็บ **Keys** → **Add key** → **Create new key** → เลือก **JSON** → **Create** → ไฟล์ `.json` จะโหลดลงเครื่อง (**ห้ามส่งไฟล์นี้ให้ใครหรือวางในแชท** รวมถึง Friday และ Javis)
   - ถ้าขึ้นว่า "Service account key creation is disabled" = บัญชีมีนโยบายองค์กรกันไว้ → หยุด บอก Friday (มีทางอื่นที่ไม่ใช้ไฟล์กุญแจ)
5. กลับหน้ารายการ Service Accounts → ก๊อปอีเมลของ `gsc-reader` (ลงท้าย `.iam.gserviceaccount.com`)

**ส่วนที่ 2 — ให้บัญชีนี้อ่าน GSC ได้**
6. เปิด https://search.google.com/search-console → เลือก okami24.store → **Settings** (ตั้งค่า) → **Users and permissions** → **Add user** → วางอีเมลจากข้อ 5 → Permission = **Restricted** → **Add**
7. จดชื่อพร็อพเพอร์ตี้ตามที่ GSC แสดงในช่องเลือกด้านซ้ายบน: ถ้าเป็น `okami24.store` (ไม่มี https) = ใช้ `sc-domain:okami24.store` · ถ้าเป็น `https://okami24.store/` = ใช้ตามนั้นทั้งบรรทัด

**ส่วนที่ 3 — ใส่กุญแจใน GitHub (ที่เดียว)**
8. เปิด https://github.com/dhetchaiyakrith24/okami24-web → **Settings** → เมนูซ้าย **Environments** → **New environment** → ชื่อ `gsc` → **Configure environment**
9. หัวข้อ **Deployment branches and tags** → เลือก **Selected branches and tags** → **Add deployment branch or tag rule** → พิมพ์ `main` → **Add rule**
10. หัวข้อ **Environment secrets** → **Add environment secret** → Name = `GSC_SERVICE_ACCOUNT_JSON` → Value = เปิดไฟล์ JSON จากข้อ 4 ด้วย Notepad → กด Ctrl+A แล้ว Ctrl+C → วางในช่อง Value → **Add secret**
11. หัวข้อ **Environment variables** → **Add environment variable** → Name = `GSC_SITE` → Value = ชื่อจากข้อ 7 (เช่น `sc-domain:okami24.store`) → **Add variable**
12. ลบไฟล์ JSON ในเครื่อง (โฟลเดอร์ Downloads) แล้วล้างถังขยะด้วย — กุญแจเหลือที่ GitHub ที่เดียว

**ส่วนที่ 4 — ลองจริง**
13. GitHub → แท็บ **Actions** → เลือก **gsc-export** ทางซ้าย → **Run workflow** → branch `main` → **Run workflow**
14. รอประมาณ 1 นาที → แถวบนสุดเป็นเครื่องหมายถูกสีเขียว → กดเข้าไป จะเห็นบรรทัด `gsc-export: OK …` = **สำเร็จ** → บอก Friday ว่า "GSC ต่อแล้ว"
    - ขึ้นว่า "No key or site…" = ข้อ 10 หรือ 11 ยังไม่ครบ · ขึ้น `HTTP 403` = ข้อ 6 ยังไม่ได้เพิ่มผู้ใช้ หรือชื่อข้อ 11 ไม่ตรงกับ GSC

## ถอยกลับ / ปิด

- หยุดดึงข้อมูล: Actions → gsc-export → ปุ่ม ⋯ → **Disable workflow**
- ตัดสิทธิ์ถาวร: GSC → Settings → Users and permissions → ลบอีเมล `gsc-reader` · และ/หรือ Google Cloud → Service Accounts → ลบ key
- ข้อมูลที่ดึงไว้แล้วอยู่ใน branch `gsc-data` (เป็นตัวเลขรายงาน ไม่มีกุญแจ)

## สำหรับ Friday (English)

Script `scripts/gsc-export.js` (tested against a local stand-in with a throwaway key: token signature verified, 6 reports
written, missing/broken/wrong key fail with one line and no value printed — `_incoming/roundC/gsc-mock.js`). Workflow
`.github/workflows/gsc-export.yml`. Read: `git fetch origin gsc-data && git show origin/gsc-data:gsc/latest/meta.json`.
Never ask for, print, echo or store the key; a chat never needs it.
