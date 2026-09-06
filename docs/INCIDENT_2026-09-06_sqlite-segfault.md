# เหตุการณ์ 2026-09-06 — เว็บจริงล่มตอนลูกค้ากดใส่ตะกร้า (exit 139)

> เขียนให้คนที่ไม่อ่านโค้ด · คำสั่งที่ให้พิมพ์อยู่ในกรอบ · ทุกข้ออ้างมีลิงก์ + วันที่เข้าถึง
> สถานะ: **รู้สาเหตุแล้ว · ทางแก้คือขยับเวอร์ชัน Node — รอเจ้าของเลือกเวอร์ชัน → merge `main` → Manual Deploy** (LAUNCH_AUDIT ข้อ 38)

## 1. เกิดอะไรขึ้น

- เว็บขึ้นออนไลน์ที่ https://okami24.store (Render · Starter 512MB · สิงคโปร์) วันแรก
- แอปสตาร์ทปกติ แต่พอลูกค้ากด **ใส่ตะกร้า** → โปรเซสตายด้วย `Segmentation fault` (exit 139) → Render รีสตาร์ท → Cloudflare ขึ้น 502 · เกิดซ้ำทุกครั้ง
- "ใส่ตะกร้า" คือคำขอแรกที่เปิดฐานข้อมูล → เป็นครั้งแรกที่โปรแกรมโหลดไฟล์ binary ของ SQLite

## 2. สาเหตุจริง — ยืนยันแล้วจากซอร์สโค้ดของทั้งสองฝั่ง

**Node 22.11.0 รองรับ "Node-API" ได้สูงสุดรุ่น 9 · แต่ better-sqlite3 13.0.3 ประกาศว่าต้องการรุ่น 10 · Node ตั้งใจจะปฏิเสธพร้อมข้อความ error แต่โค้ดตรงนั้นลืมเช็คค่าว่าง → โปรเซสตายแบบ segfault แทนที่จะได้ข้อความ**

| หลักฐาน | ที่มา (เข้าถึง 2026-09-06) |
|---|---|
| เจ้าของทดสอบใน Render Shell: `require('.../prebuilds/linux-x64.node')` → Segmentation fault ทันที (ยังไม่ทันเปิดฐานข้อมูล) | Render Web Shell · Node v22.11.0 · Debian 12 · glibc 2.36 |
| better-sqlite3 13 ประกาศ `NAPI_VERSION=10` | `node_modules/better-sqlite3/binding.gyp` · https://raw.githubusercontent.com/WiseLibs/better-sqlite3/master/binding.gyp |
| Node 22.11.0: `NODE_API_SUPPORTED_VERSION_MAX 9` · Node 22.14.0: `10` | https://raw.githubusercontent.com/nodejs/node/v22.11.0/src/node_version.h · https://raw.githubusercontent.com/nodejs/node/v22.14.0/src/node_version.h |
| ตาราง Node-API: รุ่น 10 = Node 22.14.0+, 23.6.0+ และทุกรุ่นหลังจากนั้น | https://nodejs.org/api/n-api.html |
| ใน Node 22.11.0 ถ้าโมดูลขอรุ่นสูงกว่าที่รองรับ `NewEnv()` คืนค่าว่าง แต่ `napi_module_register_by_symbol` เรียกใช้ต่อโดยไม่เช็ค → SIGSEGV | https://raw.githubusercontent.com/nodejs/node/v22.11.0/src/node_api.cc |
| ผู้ใช้รายอื่นเจออาการเดียวกัน (Node 20/22 · แม้ compile เองก็พัง · Node 25 และ v12 ใช้ได้) · ผู้ร่วมพัฒนาแพ็กเกจยืนยัน: **อัป Node 22 เป็น ≥ 22.14.0 แล้วหาย** (ทดสอบ 22.23.2) | https://github.com/WiseLibs/better-sqlite3/issues/1514 (คอมเมนต์ 2026-08-14/15) |
| binary Linux x64 ที่แถมมา **ถูกสร้างด้วย Node 24** และ CI ของแพ็กเกจเทสต์ Node 22/24/25/26 บน ubuntu | https://raw.githubusercontent.com/WiseLibs/better-sqlite3/master/.github/workflows/build.yml |
| ไฟล์ binary อ้างถึงฟังก์ชัน Node-API 62 ตัว ทุกตัวรุ่นเก่า (ไม่ใช่เรื่อง "เรียกฟังก์ชันที่ไม่มี") — ตรงกับกลไกข้างบน: ตายที่ขั้นตรวจเวอร์ชัน ไม่ใช่ตอนใช้งาน | ตรวจจากตัวไฟล์ 2026-09-06 |

ข้อควรรู้: แพ็กเกจเขียน `engines: node >= 22` ซึ่ง**ไม่จริง** (ต้อง ≥ 22.14.0) — npm จึงไม่เตือนอะไรเลยตอนติดตั้ง

**สรุปเป็นภาษาคน:** เราสั่งให้ Render ใช้ Node รุ่น 22.11.0 (ใน `render.yaml`) ซึ่งเก่ากว่าที่ตัวจัดการฐานข้อมูลรุ่นใหม่ต้องการอยู่ 3 รุ่นย่อย · ไม่เกี่ยวกับดิสก์ แรม sharp หรือการ compile

## 3. ทำไม "compile จากซอร์ส" (แผนแรก) ถึงไม่ใช่ทางแก้

ไฟล์ที่ compile บนเครื่อง Render จะประกาศ "ต้องการรุ่น 10" เหมือนกันเป๊ะ → Node 22.11 ปฏิเสธด้วยวิธีเดิม → ตายเหมือนเดิม (#1514 มีคนลองแล้ว) · สคริปต์ compile ที่ทำไว้จึงเปลี่ยนเป็น**ตัวเลือก** (เปิดได้จาก dashboard ด้วย `OKAMI24_SQLITE_FROM_SOURCE=1`) เก็บไว้สำหรับวันที่ binary ไม่เข้ากับเครื่องจริง ๆ — ไม่ใช่วันนี้

## 4. สิ่งที่แก้ไว้ใน branch `checkpoint/phase-3.3.3` (ยังไม่ merge)

| ไฟล์ | ทำอะไร |
|---|---|
| `scripts/check-native-sqlite.js` (ใหม่) — **ด่านตรวจตอน build** | **ข้อแรก: เทียบรุ่น Node-API ของ Node กับที่ better-sqlite3 ต้องการ ก่อนโหลดอะไรทั้งนั้น** → ถ้าไม่พอ build ล้มพร้อมข้อความบอกว่าต้องขยับ Node ไปรุ่นไหน (แทนที่จะตายเงียบตอนลูกค้ากด) · แล้วค่อยโหลดจริง เปิดฐานข้อมูลในหน่วยความจำ เขียน/อ่าน · ล้มข้อไหน = ไม่ปล่อยขึ้นเว็บ |
| `scripts/build-native-sqlite.js` (ใหม่, ตัวเลือก) | compile บนเครื่อง Linux + ลบ binary สำเร็จรูปของ Linux ทิ้ง · ทำงานเฉพาะเมื่อตั้ง `OKAMI24_SQLITE_FROM_SOURCE=1` |
| `render.yaml` → Build Command | `npm ci && node scripts/build-native-sqlite.js && node scripts/check-native-sqlite.js && npm run build` |
| `render.yaml` → `NODE_VERSION` | **ค่ายังเป็น 22.11.0 (ไม่แก้ รอเจ้าของเลือก)** ใส่คอมเมนต์อธิบายไว้ว่านี่คือตัวการ |
| `scripts/native-probe.js` | ถามตัว resolver ของแพ็กเกจว่าจะโหลดไฟล์ไหนจริง (ไม่เดา) |
| `docs/DEPLOY-RENDER.md` | อัปเดตช่อง Build Command · แถว `NODE_VERSION` เตือนห้ามใช้ 22.11.0 · เพิ่มแถว `NODE_OPTIONS` ที่ตกหล่น |

ของที่ทำไว้ก่อนหน้า (probe แยกโปรเซสตอนบูต · `imgOptConcurrency: 2`) **เก็บไว้ทั้งหมด**ตามคำสั่ง

## 5. ข้อ [3] — Render มีเครื่องมือ compile ไหม → มีครบ (แต่ไม่ต้องใช้แล้ว)

เอกสาร Render: native runtime ทุกตัวเป็น Debian 12 "bookworm" และติดตั้ง gcc · g++ · make · python3-dev มาให้ — https://render.com/docs/native-runtimes (เข้าถึง 2026-09-06) · ตรงกับ glibc 2.36 ที่เจ้าของเห็นในเชลล์

## 6. ยืนยันด้วยตัวเองใน Render Shell (1 บรรทัด · 5 วินาที)

```bash
node -p "process.versions.napi"
```
- เห็น **`9`** = ยืนยันสาเหตุ (Node เก่ากว่าที่แพ็กเกจต้องการ) · ตัวเลขนี้จะเป็น `10` ทันทีที่ deploy ด้วย Node ≥ 22.14
- (ถ้าอยากเห็นตัวเลขจากด้านแพ็กเกจ: `grep NAPI_VERSION node_modules/better-sqlite3/binding.gyp` → `NAPI_VERSION=10`)

**การขยับเวอร์ชัน Node ทดสอบในเชลล์ไม่ได้** (เชลล์ใช้ Node ตัวที่ deploy อยู่) — ต้องแก้ค่าแล้ว Manual Deploy · แต่**ด่านตรวจจะบอกผลตั้งแต่ตอน build** ยังไม่ทันถึงลูกค้า

## 7. ทางเลือก — ให้เจ้าของเลือก (ทีมไม่เลือกแทน)

| ทาง | ทำอะไร | ข้อดี | ข้อเสีย / ความเสี่ยง |
|---|---|---|---|
| **1. Node 24 LTS** (เช่น `24.14.1` ที่เป็น default ของ Render) | แก้ `NODE_VERSION` ใน `render.yaml` 1 ค่า | เป็นรุ่นเดียวกับที่ binary ถูกสร้าง · CI ของแพ็กเกจเทสต์ผ่านบน Linux x64 · เครื่อง dev ใช้ Node 24.19 อยู่แล้ว = dev กับ prod ตรงกัน · LTS | เปลี่ยน major version — ทฤษฎีแล้ว dependency อื่นอาจแปลก แต่เครื่อง dev รัน Node 24 ผ่าน verify ทั้งชุดมาตลอด |
| **2. Node 22 รุ่นใหม่** (≥ 22.14.0 เช่น `22.23.2` ที่มีคนยืนยันใน #1514) | แก้ `NODE_VERSION` 1 ค่า | อยู่สาย 22 เดิม เปลี่ยนน้อยสุด | เวอร์ชันย่อยต้องเลือกให้ตรง (ไม่ใช่ทุก 22.x ใช้ได้ — ต้อง ≥ 22.14) |
| 3. ถอย better-sqlite3 ไป 12.12.0 | แก้ `package.json` + lock | ไม่แตะ Node | หนีปัญหาแทนที่จะแก้ · ติดรุ่นเก่า · ไม่จำเป็นเมื่อรู้สาเหตุแล้ว |
| 4. compile จากซอร์ส | เปิด `OKAMI24_SQLITE_FROM_SOURCE=1` | — | **ไม่แก้ปัญหานี้** (ข้อ 3) |
| 5. Docker / `node:sqlite` | เปลี่ยนวิธี deploy หรือเขียนโค้ดฐานข้อมูลใหม่ | — | งานใหญ่ ความเสี่ยงสูง ไม่คุ้มกับปัญหาที่แก้ได้ด้วย 1 ค่า |

**ความเห็นของทีม (ไม่ใช่การตัดสิน):** ทาง 1 — Node 24 LTS · เหตุผลหลักคือมันเป็นรุ่นที่ binary ถูกสร้างและทดสอบด้วย และตรงกับเครื่อง dev · ไม่ว่าเลือกทางไหน ด่านตรวจจะยืนยันให้ตั้งแต่ตอน build

### ต้องไปเปลี่ยนค่าที่ไหน — ขั้นตอนเดียวที่ตัดสินว่าแก้ติดหรือไม่ติด

ค่า `NODE_VERSION` มีอยู่ **2 ที่** และ Render อ่านที่ไหนขึ้นกับว่าบริการถูกสร้างยังไง:

| บริการสร้างแบบ | Render อ่านค่าจาก | ต้องทำ |
|---|---|---|
| **Blueprint** (เลือกไฟล์ `render.yaml` ตอนสร้าง) | `render.yaml` ใน branch `main` — ค่าใน dashboard จะถูกทับทุกครั้งที่ sync | แก้ `render.yaml` (ทีมทำให้เมื่อเจ้าของเลือกเวอร์ชัน) → merge `main` → Manual Deploy |
| **สร้างมือ** (กรอกฟอร์ม New Web Service) | หน้า **Environment** ของบริการใน dashboard — `render.yaml` ไม่มีผล | ไปที่บริการ okami24 → แท็บ Environment → แก้ `NODE_VERSION` → Save → Manual Deploy |

**ทำให้ปลอดภัยที่สุด: แก้ทั้ง 2 ที่ให้ตรงกัน** แล้วดูใน build log บรรทัดแรก ๆ ว่าขึ้น `node v24…` (หรือ ≥ 22.14) และ `[native-check] OK` · ถ้ายังเห็น `v22.11.0` แปลว่าแก้ผิดที่ — build จะหยุดเองที่ด่านตรวจ ไม่ทำให้เว็บพังเพิ่ม

## 8. ไฟล์ทดสอบที่ค้างบนเซิร์ฟเวอร์

`/var/data/app-data/probe.db` (ถ้ามี) ไม่กระทบอะไร — ระบบ backup อ่านเฉพาะ `okami24.db` (`src/lib/backup/data-backup.ts` บรรทัด 190) · ลบได้ในเชลล์:
```bash
rm -f /var/data/app-data/probe.db /var/data/app-data/probe.db-wal /var/data/app-data/probe.db-shm
```

## 9. สิ่งที่ทีมทำจากเครื่องนี้ไม่ได้ (พูดตรง ๆ)

เครื่อง dev เป็น Windows ไม่มี Docker/WSL → ทำอาการซ้ำบน Linux ไม่ได้ · สาเหตุจึงมาจาก (1) การทดสอบของเจ้าของในเชลล์ (2) ซอร์สโค้ดของ Node และแพ็กเกจ (3) รายงานผู้ใช้อื่นใน #1514 — สามอย่างนี้ชี้ไปทางเดียวกัน · การพิสูจน์ขั้นสุดท้ายคือ deploy ด้วย Node ≥ 22.14 แล้วเห็น `[native-check] OK` ใน build log

## 10. ลำดับเหตุการณ์ในการหาสาเหตุ (เผื่อเจอเรื่องคล้ายกันอีก)

1. ทีมตัดสาเหตุ 5 ข้อ (ABI · bundling · mkdir · mountPath · sharp) — ถูกทุกข้อ แต่ยังไม่ถึงตัวจริง
2. ทีมทำ probe แยกโปรเซสให้เว็บบอกเองว่าตายตรงไหน (ยังใช้อยู่)
3. เจ้าของเข้าเชลล์ทดสอบเอง → ชี้ว่า "แค่โหลดไฟล์ก็ตาย"
4. ทีมสร้างสคริปต์ compile จากซอร์ส + ด่านตรวจ → researcher พบ #1514 ว่า compile ก็ยังพัง
5. researcher อ่านซอร์ส Node → เจอ Node-API 9 vs 10 · ด่านตรวจถูกปรับให้เช็คเรื่องนี้ก่อนโหลด
