# OKami24 — IMAGE AUDIT
สร้างเมื่อ: 2026-09-04 · วิธีตรวจ: อ่านข้อมูลสินค้าจากโค้ดจริง (`src/data/products/*.ts` = legacy 45 รายการ, `getPublishedProducts()` = ProductMaster ที่เผยแพร่จริง 22 รายการ) แล้ววัดทุกไฟล์ด้วย `sharp`: ขนาดพิกเซลจริง + นับพิกเซลใน alpha channel จริง (ไม่ได้เดาจากนามสกุล) · เกณฑ์: ด้านสั้น ≥ 1000px

> ขอบเขต: เฉพาะรูปที่เว็บ**จริง**เรียกใช้ (สินค้า legacy ทั้งหมด + ProductMaster ที่เผยแพร่แล้ว + รูปที่หน้าหลัก/โลโก้อ้างถึงตรง ๆ) — ProductMaster ที่ยังไม่เผยแพร่ (ขึ้น 404 ในโปรดักชัน) ไม่นับ
> "โปร่งใส" = มี alpha channel และมีพิกเซลที่ไม่ทึบจริงอย่างน้อย 1 พิกเซล (ตัวเลข % คือสัดส่วนพิกเซลที่ไม่ทึบ) · รูป "ทึบ" ของหมวดกล่องสินค้า/แพ็ก/แฟลเวอร์การ์ด เป็นไปตามข้อตกลงเดิม (crop สี่เหลี่ยมยอมรับได้) ไม่ใช่ข้อบกพร่องเสมอไป
> คอลัมน์ "รายการ" เพิ่มจากที่สั่ง เพื่อระบุว่าแถวนั้นคือสีไหน/รสไหน/รูปไหน — ถ้าไม่เพิ่มจะแยกไม่ออก

## สรุปรวม

| ชั้น | ทั้งหมด | มีและผ่านเกณฑ์ (ด้านสั้น ≥1000) | มีแต่ต่ำกว่าเกณฑ์ | ไม่มีเลย | พื้นหลังไม่โปร่งใส | เทียบ: กว้าง ≥400px (เกณฑ์เดิมของโปรเจกต์) |
|---|---|---|---|---|---|---|
| 1 การ์ด | 67 | 4 | 54 | 9 | 20 | 31 |
| 2 สี/รส | 478 | 6 | 204 | 268 | 29 | 50 |
| 3 หน้าหลัก | 13 | 0 | 11 | 0 | 0 | 5 |
| 4 แกลเลอรี | 72 | 4 | 4 | 64 | 4 | 7 |
| **รวมทุกชั้น** | 630 | 14 | 273 | 341 | 53 | 93 |

หมายเหตุตัวเลข (นับจาก 630 แถวในตารางด้านล่าง — 1 แถว = 1 รูปที่ควรมี):
- "ไม่มีเลย" 341 รายการ **รวม** 22 รายการของชั้น 4 ที่เป็นเพราะระบบ ProductMaster ยังไม่มีแกลเลอรีเลย (ไม่ใช่ลืมใส่รูป) → ที่ขาดจริงแบบใส่รูปได้ทันที = 319
- ไอคอนเว็บ 2 ไฟล์ (icon.png/apple-icon.png) ไม่เข้าเกณฑ์ 1000px และไม่นับในช่อง "ผ่าน/ต่ำกว่าเกณฑ์"
- "พื้นหลังไม่โปร่งใส" นับเฉพาะรูปที่มีอยู่จริง (ไม่รวมไอคอน)
- **เกณฑ์ "ด้านสั้น ≥1000px" เข้มมากสำหรับรูปแบบนี้**: รูปการ์ดเกือบทั้งหมดเป็นรูปเครื่องตัดพื้นหลัง ทรงสูงแคบ (เช่น 255×785) ด้านสั้นคือความกว้าง จึงตกเกณฑ์แม้ความสูงจะเกิน 700px — คอลัมน์ขวาสุดเทียบกับเกณฑ์เดิมที่โค้ดโปรเจกต์ใช้อยู่ (`scripts/product-image.ts`: การ์ดกว้าง ≥400px) ให้ดูประกอบ ไม่ได้แทนเกณฑ์ที่สั่ง
- ชั้น 2 นับเฉพาะสินค้าที่มีตัวเลือก ≥2 ตามคำสั่ง ("มีหลายสี/รส") — สินค้าที่มีตัวเลือกเดียว (เช่น coil-56 Silver) ไม่นับเป็นช่องว่าง เพราะรูปการ์ดคือรูปตัวเลือกนั้นอยู่แล้ว

## ชั้น 1 — รูปการ์ดสินค้า: ตัวไหนไม่มี

- `relx-creator` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `joiway-f3` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `joiway-f4` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `tfit-m-power-20k` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `infy-20k` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `foli-bar-15k` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `next-pro-2-beyond` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `muro-freebase` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน
- `muro-salt-nic` (legacy) — ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน

รูปการ์ดที่มีแต่ด้านสั้น < 1000px: 54 จาก 58 รูป

## ชั้น 2 — สี/รส: สินค้าที่มีหลายสี/รส แล้วขาดรูปตัวไหน

| slug | ตัวเลือกทั้งหมด | ขาดรูป | ตัวที่ขาด |
|---|---|---|---|
| `m-bar-9k` | 22 | 22 | Grape Aloe, Watermelon, Doublemint, Blue Ice, Strawberry, Peach, Rainbow Candy, Grape Lychee, Apple Aloe, Mixberry, Cola, Grape, Orange Sour, Sparkling Lemon, Sour Gummy, Watermelon Bubblegum, Pink Berry, Peach Strawberry, Strawberry Milkshake, Menthol Freeze, Kyoho Grape, Zapple |
| `muro-connector-20k` | 20 | 20 | Grape, Watermelon, Double Mint, Cola, Mix Berries, Pineapple, Honey Lemon, Apple Baraku, Mineral Water, Yakult, Banana Strawberry, Kyoho Grape, Pink Berry, Lemon Jeez, Cool Mint, Blue Ice, Green Tea, Strawberry Peach, Vanilla Ice Cream, Taro Ice Cream |
| `pod-159` | 20 | 20 | Cool Mint, Cola, Apple Aloe, Blueberry Jam, Blueberry, Chocolate Mint, Coconut, Extra Menthol, Grape, Honeydew, Lychee, Mango, Mix Berry, Pineapple, Pink Guava, Strawberry Banana, Strawberry, Watermelon Ice, Watermelon Lime, Yogurt |
| `infy-20k` | 18 | 18 | Cola, Grape Apple, Grape Lychee, Kyoho Grape, Lychee, Mint, Mixberry, Peach, Sparkling Lemon, Strawberry Watermelon, Watermelon Lychee, Apple Aloevera, Blueberry, Grape Aloevera, Mineral Water, Strawberry Banana, Strawberry Kiwi, Yoyo Grape |
| `m-switch-kit` | 18 | 18 | Kyoho Grape, Cool Mint, Apple Aloe, Black Berry, Blue Ice, Cola, Doublemint, Grape Aloe, Grape, Grape Lychee, Mango Passion, Mixberry, Peach Strawberry, Pink Berry, Strawberry, Strawberry Watermelon, Watermelon Bubblegum, Watermelon |
| `m-switch-pod` | 18 | 18 | Kyoho Grape, Cool Mint, Apple Aloe, Black Berry, Blue Ice, Cola, Doublemint, Grape Aloe, Grape, Grape Lychee, Mango Passion, Mixberry, Peach Strawberry, Pink Berry, Strawberry, Strawberry Watermelon, Watermelon, Watermelon Bubblegum |
| `joiway-f3` | 16 | 16 | American Cookies, Blueberry Ice, Cola Ice, Cola Lemon, Cool Mint Ice, Funta Grape, Grape Ice, Green Apple Ice, Hokkaido Melon Ice, Lemon Tea, Lychee Ice, Orange Soda, Passion Fruit, Rainbow Candy, Strawberry Ice, Watermelon Ice |
| `m-bar-15k` | 15 | 15 | Apple Aloe, Blue Ice, Cola, Double Mint, Grape Aloe, Grape, Grape Lychee, Mango Passion, Mixberry, Peach Strawberry, Pink Berry, Strawberry, Strawberry Watermelon, Watermelon Bubblegum, Watermelon |
| `m-bar-10k` | 12 | 12 | All Berry, Blue Ice, Cola, Grape, Kyoho Grape, Matcha Latte, Menthol Blast, Pink Berry, Strawberry Kiwi, Watermelon Mint, Watermelon, Yellow Mint |
| `pod-180` | 10 | 10 | Grape Ice, Grape Lychee, Mint, Watermelon Ice, Mixberry, Strawberry Watermelon, Strawberry Custard, Watermelon Bubblegum, White Slush, Strawberry Kiwi |
| `tfit-m-power-20k` | 10 | 10 | Blue Ice, Double Mint, Grape, Grape Apple, Hami Melon, Mix Berry, Rainbow Candy, Sakura Grape, Strawberry, Watermelon |
| `foli-bar-15k` | 9 | 9 | Apple Aloe, Grape, Grape Aloe, Blueberry, Cola Ice, Lychee Ice, Mix Berry, Strawberry Ice, Red Bull Ice |
| `muro-sc-8000` | 8 | 8 | Extreme Menthol, Cola, Strawberry, Honey Lemon, Apple Shisha, Mineral Water, Yakult, Banana Strawberry |
| `pod-169` | 8 | 8 | Grape Jelly, Grape Gummies, Grape Bubblegum, Grape Apple, Strawberry, Strawberry Grape, Blueberry, Lychee Raspberry |
| `zero-pro` | 8 | 7 | Blue Purple, Golden Fade, Gunmetal, Pink, Teal, Red, Charcoal Red |
| `mood-monster-14k` | 10 | 6 | Sugus Apple, Fanta, Mango Peach, Kyoho Grape, Grape N5%, Blueberry N5% |
| `muro-salt-nic` | 6 | 6 | Grape, Watermelon, Click Mint, Strawberry Twist, Big Cola, Peach |
| `next-pro-2-beyond` | 6 | 6 | Razer Black, Supreme Red, White Lava, Aurora, Lemon Mint, Twilight Sky |
| `muro-3ml` | 10 | 4 | Muro Grape, Honey Lemon, Very Strawberry, Double Shisha |
| `muro-freebase` | 3 | 3 | Watermelon, Peach, Big Cola |
| `coil-38` | 2 | 2 | TPP-DM2 (0.2Ω), TPP-DM4 (0.3Ω) |
| `coil-89` | 2 | 2 | 0.8Ω, 1.0Ω |
| `zero-cartridge` | 2 | 2 | Apple Aloe, Fruit Tea |
| `caliburn-g4-pro` | 8 | 1 | Light Green |
| `caliburn-g4-pro-koko` | 8 | 1 | Coral Pink |
| `argus-g3-mini` | 9 | 0 | — |
| `argus-g4` | 7 | 0 | — |
| `argus-g4-mini` | 8 | 0 | — |
| `argus-p3` | 7 | 0 | — |
| `caliburn-g3-pro` | 6 | 0 | — |
| `caliburn-g3-pro-koko` | 8 | 0 | — |
| `caliburn-g4` | 8 | 0 | — |
| `caliburn-g4-classic` | 4 | 0 | — |
| `caliburn-g4-mini` | 12 | 0 | — |
| `caliburn-g5` | 7 | 0 | — |
| `caliburn-g5-lite` | 8 | 0 | — |
| `caliburn-g5-lite-se` | 8 | 0 | — |
| `coil-1` | 4 | 0 | — |
| `coil-72` | 4 | 0 | — |
| `coil-94` | 4 | 0 | — |
| `drag-6` | 7 | 0 | — |
| `drag-s3` | 7 | 0 | — |
| `drag-x3` | 7 | 0 | — |
| `iqosheet-14` | 2 | 0 | — |
| `iqosheet-16` | 3 | 0 | — |
| `iqosheet-18` | 2 | 0 | — |
| `muro-space-15k` | 5 | 0 | — |
| `relx-smash-go-12k` | 10 | 0 | — |
| `reswa-sportcan-12k` | 3 | 0 | — |
| `vazer-one-pod` | 3 | 0 | — |
| `vinci-s` | 8 | 0 | — |
| `vmate-i3` | 7 | 0 | — |

## ชั้น 3 — หน้าหลัก

หน้าหลักไม่มีรูป hero/แบนเนอร์/หมวดหมู่แยกต่างหาก — ส่วน cinematic ใช้รูปการ์ดสินค้า 6 รูปตรง ๆ, ส่วน Hero/EditorialSplit/CompareCTA ใช้รูปการ์ดของสินค้า flagship ผ่าน ProductMedia, หมวดหมู่ (CategoryNav) ใช้ไอคอน ไม่ใช้รูป · ไม่พบ placeholder image ใด ๆ (ระบบใช้ภาพวาด DeviceGlyph เมื่อไม่มีรูปจริง ไม่ใช้รูปสต๊อก) · ทุกไฟล์ที่โค้ดอ้างถึง**มีอยู่จริง** (ตารางด้านล่าง)

## ชั้น 4 — แกลเลอรีในหน้าสินค้า

- legacy 45 รายการ: มีแกลเลอรีจริงแค่ **3** รายการ (`caliburn-g5`, `argus-g4`, `m-bar-10k`) — ที่เหลือ 42 รายการไม่มี (ส่วน ProductGallery ซ่อนอัตโนมัติ)
- ProductMaster 22 รายการ: **ระบบไม่มีแกลเลอรีเลย** (หน้าสินค้ามีแค่รูปการ์ด + รูปตัวเลือก) — ถ้าต้องการต้องเพิ่มฟีเจอร์ ไม่ใช่แค่ใส่รูป

## ตารางเต็ม (630 แถว)

### 1 การ์ด (67 แถว)

| slug | รายการ | ชั้น | มี/ไม่มี | ขนาดจริง px | ด้านสั้น ≥1000px | โปร่งใสไหม |
|---|---|---|---|---|---|---|
| `caliburn-g5` | card (official-photo) | 1 | ✅ มี | 255×785 | ❌ 255px | โปร่งใส (51.1% ของพิกเซล) |
| `caliburn-g5-lite` | card (official-photo) | 1 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite-se` | card (official-photo) | 1 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g4-pro-koko` | card (official-photo) | 1 | ✅ มี | 541×862 | ❌ 541px | โปร่งใส (43.4% ของพิกเซล) |
| `caliburn-g4-pro` | card (official-photo) | 1 | ✅ มี | 293×879 | ❌ 293px | โปร่งใส (49.6% ของพิกเซล) |
| `caliburn-g4` | card (official-photo) | 1 | ✅ มี | 579×1323 | ❌ 579px | โปร่งใส (24.1% ของพิกเซล) |
| `caliburn-g4-mini` | card (official-photo) | 1 | ✅ มี | 523×1123 | ❌ 523px | โปร่งใส (15.8% ของพิกเซล) |
| `caliburn-g4-classic` | card (official-photo) | 1 | ✅ มี | 292×879 | ❌ 292px | โปร่งใส (49.2% ของพิกเซล) |
| `caliburn-g3-pro` | card (official-photo) | 1 | ✅ มี | 224×772 | ❌ 224px | โปร่งใส (40.5% ของพิกเซล) |
| `caliburn-g3-pro-koko` | card (official-photo) | 1 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (38.9% ของพิกเซล) |
| `argus-g4` | card (official-photo) | 1 | ✅ มี | 118×519 | ❌ 118px | โปร่งใส (12.3% ของพิกเซล) |
| `argus-g4-mini` | card (official-photo) | 1 | ✅ มี | 204×788 | ❌ 204px | โปร่งใส (23.3% ของพิกเซล) |
| `argus-p3` | card (official-photo) | 1 | ✅ มี | 302×521 | ❌ 302px | โปร่งใส (21.1% ของพิกเซล) |
| `argus-g3-mini` | card (official-photo) | 1 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (66.9% ของพิกเซล) |
| `drag-6` | card (official-photo) | 1 | ✅ มี | 205×476 | ❌ 205px | โปร่งใส (51.8% ของพิกเซล) |
| `drag-s3` | card (official-photo) | 1 | ✅ มี | 219×751 | ❌ 219px | โปร่งใส (19% ของพิกเซล) |
| `drag-x3` | card (official-photo) | 1 | ✅ มี | 211×761 | ❌ 211px | โปร่งใส (13.7% ของพิกเซล) |
| `vinci-s` | card (official-photo) | 1 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9.1% ของพิกเซล) |
| `vmate-i3` | card (official-photo) | 1 | ✅ มี | 202×786 | ❌ 202px | โปร่งใส (21.8% ของพิกเซล) |
| `m-bar-10k` | card (official-photo) | 1 | ✅ มี | 463×925 | ❌ 463px | โปร่งใส (55.9% ของพิกเซล) |
| `m-bar-9k` | card (official-photo) | 1 | ✅ มี | 423×865 | ❌ 423px | โปร่งใส (62.1% ของพิกเซล) |
| `m-bar-15k` | card (official-photo) | 1 | ✅ มี | 457×877 | ❌ 457px | โปร่งใส (62.5% ของพิกเซล) |
| `m-switch-kit` | card (official-photo) | 1 | ✅ มี | 448×871 | ❌ 448px | โปร่งใส (57.8% ของพิกเซล) |
| `m-switch-pod` | card (official-photo) | 1 | ✅ มี | 437×716 | ❌ 437px | โปร่งใส (52.9% ของพิกเซล) |
| `m-bar-pod` | card (official-photo) | 1 | ✅ มี | 447×726 | ❌ 447px | โปร่งใส (68.5% ของพิกเซล) |
| `zero-pro` | card (official-photo) | 1 | ✅ มี | 428×925 | ❌ 428px | โปร่งใส (72.8% ของพิกเซล) |
| `zero-nano` | card (official-photo) | 1 | ✅ มี | 463×635 | ❌ 463px | โปร่งใส (39.4% ของพิกเซล) |
| `zero-cartridge` | card (official-photo) | 1 | ✅ มี | 412×678 | ❌ 412px | โปร่งใส (59.3% ของพิกเซล) |
| `relx-smash-go-12k` | card (official-photo) | 1 | ✅ มี | 153×712 | ❌ 153px | โปร่งใส (7.4% ของพิกเซล) |
| `relx-creator` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `joiway-f4` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `infy-20k` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | card (official-photo) | 1 | ✅ มี | 520×1120 | ❌ 520px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | card (official-photo) | 1 | ✅ มี | 475×770 | ❌ 475px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | card (official-photo) | 1 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-sc-8000` | card (official-photo) | 1 | ✅ มี | 165×325 | ❌ 165px | โปร่งใส (52.3% ของพิกเซล) |
| `muro-connector-20k` | card (official-photo) | 1 | ✅ มี | 179×414 | ❌ 179px | โปร่งใส (16.8% ของพิกเซล) |
| `foli-bar-15k` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `vazer-one-pod` | card (official-photo) | 1 | ✅ มี | 405×747 | ❌ 405px | โปร่งใส (2% ของพิกเซล) |
| `reswa-sportcan-12k` | card (official-photo) | 1 | ✅ มี | 170×390 | ❌ 170px | ทึบ (ไม่มี alpha) |
| `next-pro-2-beyond` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | card <br><sub>ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน</sub> | 1 | ❌ ไม่มี | — | — | — |
| `coil-1` | card | 1 | ✅ มี | 1472×1472 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `coil-38` | card | 1 | ✅ มี | 900×350 | ❌ 350px | ทึบ (ไม่มี alpha) |
| `coil-53` | card | 1 | ✅ มี | 273×445 | ❌ 273px | ทึบ (ไม่มี alpha) |
| `coil-55` | card | 1 | ✅ มี | 700×746 | ❌ 700px | ทึบ (ไม่มี alpha) |
| `coil-56` | card | 1 | ✅ มี | 361×445 | ❌ 361px | ทึบ (ไม่มี alpha) |
| `coil-63` | card | 1 | ✅ มี | 382×313 | ❌ 313px | ทึบ (ไม่มี alpha) |
| `coil-68` | card | 1 | ✅ มี | 500×1213 | ❌ 500px | โปร่งใส (27.9% ของพิกเซล) |
| `coil-70` | card | 1 | ✅ มี | 480×643 | ❌ 480px | ทึบ (ไม่มี alpha) |
| `coil-72` | card | 1 | ✅ มี | 822×1132 | ❌ 822px | ทึบ (ไม่มี alpha) |
| `coil-74` | card | 1 | ✅ มี | 485×541 | ❌ 485px | ทึบ (ไม่มี alpha) |
| `coil-83` | card | 1 | ✅ มี | 608×654 | ❌ 608px | ทึบ (ไม่มี alpha) |
| `coil-87` | card | 1 | ✅ มี | 611×597 | ❌ 597px | ทึบ (ไม่มี alpha) |
| `coil-89` | card | 1 | ✅ มี | 700×605 | ❌ 605px | ทึบ (ไม่มี alpha) |
| `coil-92` | card | 1 | ✅ มี | 593×1186 | ❌ 593px | โปร่งใส (31.3% ของพิกเซล) |
| `coil-94` | card | 1 | ✅ มี | 1148×848 | ❌ 848px | ทึบ (ไม่มี alpha) |
| `iqosheet-14` | card | 1 | ✅ มี | 186×398 | ❌ 186px | ทึบ (ไม่มี alpha) |
| `iqosheet-16` | card | 1 | ✅ มี | 1772×1494 | ✅ ผ่าน | โปร่งใส (63.7% ของพิกเซล) |
| `iqosheet-18` | card | 1 | ✅ มี | 1613×1550 | ✅ ผ่าน | โปร่งใส (57.2% ของพิกเซล) |
| `pod-159` | card | 1 | ✅ มี | 500×868 | ❌ 500px | โปร่งใส (49.3% ของพิกเซล) |
| `pod-169` | card | 1 | ✅ มี | 1470×1320 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `pod-180` | card | 1 | ✅ มี | 266×658 | ❌ 266px | โปร่งใส (24.6% ของพิกเซล) |
| `coil-54` | card | 1 | ✅ มี | 274×328 | ❌ 274px | ทึบ (ไม่มี alpha) |

### 2 สี/รส (478 แถว)

| slug | รายการ | ชั้น | มี/ไม่มี | ขนาดจริง px | ด้านสั้น ≥1000px | โปร่งใสไหม |
|---|---|---|---|---|---|---|
| `caliburn-g5` | สี: Mystic Forest | 2 | ✅ มี | 255×785 | ❌ 255px | โปร่งใส (51.1% ของพิกเซล) |
| `caliburn-g5` | สี: Black Carbon | 2 | ✅ มี | 282×1128 | ❌ 282px | โปร่งใส (8.1% ของพิกเซล) |
| `caliburn-g5` | สี: Navy Ripples | 2 | ✅ มี | 282×1128 | ❌ 282px | โปร่งใส (8% ของพิกเซล) |
| `caliburn-g5` | สี: Orange Feathers | 2 | ✅ มี | 240×976 | ❌ 240px | โปร่งใส (11.8% ของพิกเซล) |
| `caliburn-g5` | สี: Black Gold | 2 | ✅ มี | 282×1128 | ❌ 282px | โปร่งใส (7.9% ของพิกเซล) |
| `caliburn-g5` | สี: Aurora Feathers | 2 | ✅ มี | 282×1128 | ❌ 282px | โปร่งใส (8.9% ของพิกเซล) |
| `caliburn-g5` | สี: Silver Marble | 2 | ✅ มี | 281×1128 | ❌ 281px | โปร่งใส (10.7% ของพิกเซล) |
| `caliburn-g5` | lineup (All Colors) | 2 | ✅ มี | 1338×560 | ❌ 560px | โปร่งใส (49.3% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Candy Pink | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Coral Orange | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Creamy Celadon | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Knight Black | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Lemon Green | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Mint Green | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Ocean Blue | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | สี: Starry Gray | 2 | ✅ มี | 191×730 | ❌ 191px | โปร่งใส (16.4% ของพิกเซล) |
| `caliburn-g5-lite` | lineup (All Colors) | 2 | ✅ มี | 2305×833 | ❌ 833px | โปร่งใส (50.9% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Black Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Blue Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Brown Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Gray Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Orange Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Pink Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: Purple Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | สี: White Leather | 2 | ✅ มี | 188×705 | ❌ 188px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g5-lite-se` | lineup (All Colors) | 2 | ✅ มี | 2295×816 | ❌ 816px | โปร่งใส (49.8% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Desert Gold | 2 | ✅ มี | 381×625 | ❌ 381px | โปร่งใส (15.9% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Waves Black | 2 | ✅ มี | 379×624 | ❌ 379px | โปร่งใส (15.4% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Cosmic Gray | 2 | ✅ มี | 353×608 | ❌ 353px | โปร่งใส (19% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Mirror Silver | 2 | ✅ มี | 496×820 | ❌ 496px | โปร่งใส (15% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Crystal White | 2 | ✅ มี | 1147×1896 | ✅ ผ่าน | โปร่งใส (14.3% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Light Green | 2 | ✅ มี | 382×625 | ❌ 382px | โปร่งใส (16% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Glass Blue | 2 | ✅ มี | 382×626 | ❌ 382px | โปร่งใส (16.1% ของพิกเซล) |
| `caliburn-g4-pro-koko` | สี: Coral Pink <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-pro-koko` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-pro` | สี: Desert Gold | 2 | ✅ มี | 155×634 | ❌ 155px | โปร่งใส (12.9% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Fantasy Pink | 2 | ✅ มี | 155×634 | ❌ 155px | โปร่งใส (12.1% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Frost White | 2 | ✅ มี | 153×634 | ❌ 153px | โปร่งใส (10.8% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Ink Blue | 2 | ✅ มี | 154×637 | ❌ 154px | โปร่งใส (11.3% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Iron Gray | 2 | ✅ มี | 152×634 | ❌ 152px | โปร่งใส (10.7% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Light Green <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-pro` | สี: Pearl Silver | 2 | ✅ มี | 293×879 | ❌ 293px | โปร่งใส (49.6% ของพิกเซล) |
| `caliburn-g4-pro` | สี: Stripe Black | 2 | ✅ มี | 153×635 | ❌ 153px | โปร่งใส (11.9% ของพิกเซล) |
| `caliburn-g4-pro` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `caliburn-g4` | สี: Flamingo Red | 2 | ✅ มี | 227×405 | ❌ 227px | โปร่งใส (66.8% ของพิกเซล) |
| `caliburn-g4` | สี: Glacier Blue | 2 | ✅ มี | 198×405 | ❌ 198px | โปร่งใส (67.4% ของพิกเซล) |
| `caliburn-g4` | สี: Gunmetal Grey | 2 | ✅ มี | 249×405 | ❌ 249px | โปร่งใส (69.7% ของพิกเซล) |
| `caliburn-g4` | สี: Karst Grey | 2 | ✅ มี | 170×405 | ❌ 170px | โปร่งใส (58.9% ของพิกเซล) |
| `caliburn-g4` | สี: Polar Black | 2 | ✅ มี | 184×405 | ❌ 184px | โปร่งใส (59% ของพิกเซล) |
| `caliburn-g4` | สี: Sahara Gold | 2 | ✅ มี | 196×405 | ❌ 196px | โปร่งใส (61.3% ของพิกเซล) |
| `caliburn-g4` | สี: Seashell White | 2 | ✅ มี | 579×1323 | ❌ 579px | โปร่งใส (24.1% ของพิกเซล) |
| `caliburn-g4` | สี: Twilight Silver | 2 | ✅ มี | 234×405 | ❌ 234px | โปร่งใส (67.8% ของพิกเซล) |
| `caliburn-g4` | lineup (All Colors) | 2 | ✅ มี | 2927×760 | ❌ 760px | โปร่งใส (68.5% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Bright Pink | 2 | ✅ มี | 186×442 | ❌ 186px | โปร่งใส (59.7% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Champagne Gold | 2 | ✅ มี | 286×443 | ❌ 286px | โปร่งใส (71.2% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Coast Gold | 2 | ✅ มี | 176×443 | ❌ 176px | โปร่งใส (53.1% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Dusty Indigo | 2 | ✅ มี | 209×443 | ❌ 209px | โปร่งใส (60.6% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Grass Green | 2 | ✅ มี | 198×442 | ❌ 198px | โปร่งใส (62% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Lake Blue | 2 | ✅ มี | 161×442 | ❌ 161px | โปร่งใส (53.2% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Light Silver | 2 | ✅ มี | 96×436 | ❌ 96px | โปร่งใส (17.2% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Night Black | 2 | ✅ มี | 191×442 | ❌ 191px | โปร่งใส (60.6% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Paddy Green | 2 | ✅ มี | 210×443 | ❌ 210px | โปร่งใส (60.8% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Peafowl Emerald | 2 | ✅ มี | 277×443 | ❌ 277px | โปร่งใส (70.3% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Phoenix Purple | 2 | ✅ มี | 252×443 | ❌ 252px | โปร่งใส (67.2% ของพิกเซล) |
| `caliburn-g4-mini` | สี: Slate Grey | 2 | ✅ มี | 168×442 | ❌ 168px | โปร่งใส (53.2% ของพิกเซล) |
| `caliburn-g4-mini` | lineup (All Colors) | 2 | ✅ มี | 2842×510 | ❌ 510px | โปร่งใส (70.2% ของพิกเซล) |
| `caliburn-g4-classic` | สี: Abyss Blue | 2 | ✅ มี | 182×404 | ❌ 182px | โปร่งใส (53.1% ของพิกเซล) |
| `caliburn-g4-classic` | สี: Alpine Green | 2 | ✅ มี | 214×404 | ❌ 214px | โปร่งใส (60.1% ของพิกเซล) |
| `caliburn-g4-classic` | สี: Classic Black | 2 | ✅ มี | 213×404 | ❌ 213px | โปร่งใส (59.9% ของพิกเซล) |
| `caliburn-g4-classic` | สี: Classic Silver | 2 | ✅ มี | 292×879 | ❌ 292px | โปร่งใส (49.2% ของพิกเซล) |
| `caliburn-g4-classic` | lineup (All Colors) | 2 | ✅ มี | 1058×560 | ❌ 560px | โปร่งใส (66.7% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Emerald Green | 2 | ✅ มี | 220×772 | ❌ 220px | โปร่งใส (38.9% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Midnight Black | 2 | ✅ มี | 220×774 | ❌ 220px | โปร่งใส (39.4% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Pacific Blue | 2 | ✅ มี | 224×772 | ❌ 224px | โปร่งใส (40.5% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Rose Gold | 2 | ✅ มี | 220×773 | ❌ 220px | โปร่งใส (40.1% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Space Gray | 2 | ✅ มี | 219×772 | ❌ 219px | โปร่งใส (39.1% ของพิกเซล) |
| `caliburn-g3-pro` | สี: Stone Gray | 2 | ✅ มี | 220×772 | ❌ 220px | โปร่งใส (39.4% ของพิกเซล) |
| `caliburn-g3-pro` | lineup (All Colors) | 2 | ✅ มี | 1097×560 | ❌ 560px | โปร่งใส (59.7% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Emerald Green | 2 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (38.9% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Light Silver | 2 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (39.5% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Lilac Purple | 2 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (39.6% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Luxury Gold | 2 | ✅ มี | 274×439 | ❌ 274px | โปร่งใส (39.6% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Midnight Black | 2 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (39.1% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Rose Pink | 2 | ✅ มี | 273×438 | ❌ 273px | โปร่งใส (39.6% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Sky Blue | 2 | ✅ มี | 274×439 | ❌ 274px | โปร่งใส (39.4% ของพิกเซล) |
| `caliburn-g3-pro-koko` | สี: Space Gray | 2 | ✅ มี | 274×438 | ❌ 274px | โปร่งใส (39.4% ของพิกเซล) |
| `caliburn-g3-pro-koko` | lineup (All Colors) | 2 | ✅ มี | 2735×560 | ❌ 560px | โปร่งใส (50.9% ของพิกเซล) |
| `argus-g4` | สี: Orange | 2 | ✅ มี | 118×519 | ❌ 118px | โปร่งใส (12.3% ของพิกเซล) |
| `argus-g4` | สี: Black | 2 | ✅ มี | 114×513 | ❌ 114px | โปร่งใส (7.1% ของพิกเซล) |
| `argus-g4` | สี: Purple | 2 | ✅ มี | 113×514 | ❌ 113px | โปร่งใส (7.5% ของพิกเซล) |
| `argus-g4` | สี: Silver | 2 | ✅ มี | 113×513 | ❌ 113px | โปร่งใส (31.3% ของพิกเซล) |
| `argus-g4` | สี: Blue | 2 | ✅ มี | 113×514 | ❌ 113px | โปร่งใส (6.6% ของพิกเซล) |
| `argus-g4` | สี: Gray | 2 | ✅ มี | 113×514 | ❌ 113px | โปร่งใส (6.5% ของพิกเซล) |
| `argus-g4` | สี: Brown | 2 | ✅ มี | 114×514 | ❌ 114px | โปร่งใส (6.6% ของพิกเซล) |
| `argus-g4` | lineup (All Colors) | 2 | ✅ มี | 984×560 | ❌ 560px | โปร่งใส (37.8% ของพิกเซล) |
| `argus-g4-mini` | สี: Black | 2 | ✅ มี | 204×788 | ❌ 204px | โปร่งใส (23.3% ของพิกเซล) |
| `argus-g4-mini` | สี: Green | 2 | ✅ มี | 204×788 | ❌ 204px | โปร่งใส (23.3% ของพิกเซล) |
| `argus-g4-mini` | สี: Orange | 2 | ✅ มี | 203×788 | ❌ 203px | โปร่งใส (23.3% ของพิกเซล) |
| `argus-g4-mini` | สี: Purple | 2 | ✅ มี | 204×789 | ❌ 204px | โปร่งใส (24.1% ของพิกเซล) |
| `argus-g4-mini` | สี: Silver | 2 | ✅ มี | 204×789 | ❌ 204px | โปร่งใส (24.1% ของพิกเซล) |
| `argus-g4-mini` | สี: Tarnish | 2 | ✅ มี | 207×795 | ❌ 207px | โปร่งใส (23.7% ของพิกเซล) |
| `argus-g4-mini` | สี: Cyan | 2 | ✅ มี | 204×789 | ❌ 204px | โปร่งใส (23.4% ของพิกเซล) |
| `argus-g4-mini` | สี: Blue | 2 | ✅ มี | 204×789 | ❌ 204px | โปร่งใส (23.7% ของพิกเซล) |
| `argus-g4-mini` | lineup (All Colors) | 2 | ✅ มี | 1163×510 | ❌ 510px | โปร่งใส (46.8% ของพิกเซล) |
| `argus-p3` | สี: Blue Leather | 2 | ✅ มี | 302×521 | ❌ 302px | โปร่งใส (21.1% ของพิกเซล) |
| `argus-p3` | สี: Black Leather | 2 | ✅ มี | 304×523 | ❌ 304px | โปร่งใส (21.8% ของพิกเซล) |
| `argus-p3` | สี: Grey Leather | 2 | ✅ มี | 302×521 | ❌ 302px | โปร่งใส (21% ของพิกเซล) |
| `argus-p3` | สี: Brown Leather | 2 | ✅ มี | 301×520 | ❌ 301px | โปร่งใส (21.1% ของพิกเซล) |
| `argus-p3` | สี: Red Leather | 2 | ✅ มี | 301×520 | ❌ 301px | โปร่งใส (20.7% ของพิกเซล) |
| `argus-p3` | สี: Silver Leather | 2 | ✅ มี | 300×518 | ❌ 300px | โปร่งใส (21% ของพิกเซล) |
| `argus-p3` | สี: Black Metal | 2 | ✅ มี | 303×522 | ❌ 303px | โปร่งใส (21.4% ของพิกเซล) |
| `argus-p3` | lineup (All Colors) | 2 | ✅ มี | 2317×580 | ❌ 580px | โปร่งใส (35.6% ของพิกเซล) |
| `argus-g3-mini` | สี: Sky Blue | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (66.9% ของพิกเซล) |
| `argus-g3-mini` | สี: Grass Green | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (67% ของพิกเซล) |
| `argus-g3-mini` | สี: Midnight Black | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (66.9% ของพิกเซล) |
| `argus-g3-mini` | สี: Space Gray | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (66.9% ของพิกเซล) |
| `argus-g3-mini` | สี: Moonlight Silver | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (67.6% ของพิกเซล) |
| `argus-g3-mini` | สี: Scarlet Red | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (67% ของพิกเซล) |
| `argus-g3-mini` | สี: Rose Gold | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (67.1% ของพิกเซล) |
| `argus-g3-mini` | สี: Lilac Purple | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (67.3% ของพิกเซล) |
| `argus-g3-mini` | สี: Hot Pink | 2 | ✅ มี | 250×500 | ❌ 250px | โปร่งใส (66.8% ของพิกเซล) |
| `argus-g3-mini` | lineup (All Colors) | 2 | ✅ มี | 2285×510 | ❌ 510px | โปร่งใส (74.6% ของพิกเซล) |
| `drag-6` | สี: Silver | 2 | ✅ มี | 635×2146 | ❌ 635px | โปร่งใส (24.2% ของพิกเซล) |
| `drag-6` | สี: Blue | 2 | ✅ มี | 636×2147 | ❌ 636px | โปร่งใส (23.6% ของพิกเซล) |
| `drag-6` | สี: Black | 2 | ✅ มี | 634×2137 | ❌ 634px | โปร่งใส (23.4% ของพิกเซล) |
| `drag-6` | สี: Brown | 2 | ✅ มี | 205×476 | ❌ 205px | โปร่งใส (51.8% ของพิกเซล) |
| `drag-6` | สี: Red | 2 | ✅ มี | 638×2138 | ❌ 638px | โปร่งใส (23% ของพิกเซล) |
| `drag-6` | สี: Green | 2 | ✅ มี | 636×2146 | ❌ 636px | โปร่งใส (23.4% ของพิกเซล) |
| `drag-6` | สี: Metal Gray | 2 | ✅ มี | 638×2155 | ❌ 638px | โปร่งใส (23.6% ของพิกเซล) |
| `drag-6` | lineup (All Colors) | 2 | ✅ มี | 1312×560 | ❌ 560px | โปร่งใส (47% ของพิกเซล) |
| `drag-s3` | สี: Spray Black | 2 | ✅ มี | 219×751 | ❌ 219px | โปร่งใส (19% ของพิกเซล) |
| `drag-s3` | สี: White | 2 | ✅ มี | 220×751 | ❌ 220px | โปร่งใส (20.5% ของพิกเซล) |
| `drag-s3` | สี: Pink | 2 | ✅ มี | 218×751 | ❌ 218px | โปร่งใส (21.5% ของพิกเซล) |
| `drag-s3` | สี: Blue | 2 | ✅ มี | 218×751 | ❌ 218px | โปร่งใส (18.2% ของพิกเซล) |
| `drag-s3` | สี: Green | 2 | ✅ มี | 220×751 | ❌ 220px | โปร่งใส (19.5% ของพิกเซล) |
| `drag-s3` | สี: Brown | 2 | ✅ มี | 219×751 | ❌ 219px | โปร่งใส (20.2% ของพิกเซล) |
| `drag-s3` | สี: Metal Gray | 2 | ✅ มี | 218×751 | ❌ 218px | โปร่งใส (20.1% ของพิกเซล) |
| `drag-s3` | lineup (All Colors) | 2 | ✅ มี | 1740×811 | ❌ 811px | โปร่งใส (34.6% ของพิกเซล) |
| `drag-x3` | สี: Gray Metal | 2 | ✅ มี | 210×761 | ❌ 210px | โปร่งใส (13.4% ของพิกเซล) |
| `drag-x3` | สี: Spray Black | 2 | ✅ มี | 211×761 | ❌ 211px | โปร่งใส (13.7% ของพิกเซล) |
| `drag-x3` | สี: Glow Pink | 2 | ✅ มี | 210×761 | ❌ 210px | โปร่งใส (13.5% ของพิกเซล) |
| `drag-x3` | สี: Champagne Golden | 2 | ✅ มี | 210×761 | ❌ 210px | โปร่งใส (13.7% ของพิกเซล) |
| `drag-x3` | สี: Sky Blue | 2 | ✅ มี | 211×761 | ❌ 211px | โปร่งใส (13.6% ของพิกเซล) |
| `drag-x3` | สี: Moss Green | 2 | ✅ มี | 213×761 | ❌ 213px | โปร่งใส (14.4% ของพิกเซล) |
| `drag-x3` | สี: Aurora Purple | 2 | ✅ มี | 212×761 | ❌ 212px | โปร่งใส (14% ของพิกเซล) |
| `drag-x3` | lineup (All Colors) | 2 | ✅ มี | 1685×821 | ❌ 821px | โปร่งใส (29.8% ของพิกเซล) |
| `vinci-s` | สี: Black | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9.1% ของพิกเซล) |
| `vinci-s` | สี: Silver | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9% ของพิกเซล) |
| `vinci-s` | สี: Grey | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9% ของพิกเซล) |
| `vinci-s` | สี: Blue Gradient | 2 | ✅ มี | 204×724 | ❌ 204px | โปร่งใส (11.3% ของพิกเซล) |
| `vinci-s` | สี: Green Gradient | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9% ของพิกเซล) |
| `vinci-s` | สี: Gold Gradient | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9% ของพิกเซล) |
| `vinci-s` | สี: Neon | 2 | ✅ มี | 204×724 | ❌ 204px | โปร่งใส (11.3% ของพิกเซล) |
| `vinci-s` | สี: Pink | 2 | ✅ มี | 199×724 | ❌ 199px | โปร่งใส (9.1% ของพิกเซล) |
| `vinci-s` | lineup (All Colors) | 2 | ✅ มี | 1836×784 | ❌ 784px | โปร่งใส (27.1% ของพิกเซล) |
| `vmate-i3` | สี: Black | 2 | ✅ มี | 202×786 | ❌ 202px | โปร่งใส (21.8% ของพิกเซล) |
| `vmate-i3` | สี: Red | 2 | ✅ มี | 202×786 | ❌ 202px | โปร่งใส (22% ของพิกเซล) |
| `vmate-i3` | สี: Purple | 2 | ✅ มี | 201×785 | ❌ 201px | โปร่งใส (22.3% ของพิกเซล) |
| `vmate-i3` | สี: Pink | 2 | ✅ มี | 202×785 | ❌ 202px | โปร่งใส (22.3% ของพิกเซล) |
| `vmate-i3` | สี: Cyan Blue | 2 | ✅ มี | 202×786 | ❌ 202px | โปร่งใส (22.1% ของพิกเซล) |
| `vmate-i3` | สี: Neon | 2 | ✅ มี | 202×786 | ❌ 202px | โปร่งใส (22% ของพิกเซล) |
| `vmate-i3` | สี: Silver Black | 2 | ✅ มี | 201×786 | ❌ 201px | โปร่งใส (21.8% ของพิกเซล) |
| `vmate-i3` | lineup (All Colors) | 2 | ✅ มี | 1129×560 | ❌ 560px | โปร่งใส (45.2% ของพิกเซล) |
| `m-bar-10k` | รส: All Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Matcha Latte <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Menthol Blast <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Strawberry Kiwi <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Watermelon Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | รส: Yellow Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Grape Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Doublemint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Rainbow Candy <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Grape Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Mixberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Orange Sour <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Sparkling Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Sour Gummy <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Watermelon Bubblegum <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Peach Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Strawberry Milkshake <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Menthol Freeze <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | รส: Zapple <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-9k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Double Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Grape Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Grape Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Mango Passion <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Mixberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Peach Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Strawberry Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Watermelon Bubblegum <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Cool Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Black Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Doublemint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Grape Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Grape Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Mango Passion <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Mixberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Peach Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Strawberry Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Watermelon Bubblegum <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Cool Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Black Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Doublemint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Grape Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Grape Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Mango Passion <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Mixberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Peach Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Strawberry Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | รส: Watermelon Bubblegum <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Blue Purple <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Golden Fade <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Gunmetal <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Black | 2 | ✅ มี | 428×925 | ❌ 428px | โปร่งใส (72.8% ของพิกเซล) |
| `zero-pro` | สี: Pink <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Teal <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Red <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | สี: Charcoal Red <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-pro` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-cartridge` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-cartridge` | รส: Fruit Tea <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `zero-cartridge` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `relx-smash-go-12k` | รส: Apple | 2 | ✅ มี | 154×713 | ❌ 154px | โปร่งใส (8% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Cola | 2 | ✅ มี | 153×713 | ❌ 153px | โปร่งใส (7.5% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Double Mint | 2 | ✅ มี | 154×713 | ❌ 154px | โปร่งใส (8% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Grape | 2 | ✅ มี | 153×712 | ❌ 153px | โปร่งใส (7.4% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Grape Lychee | 2 | ✅ มี | 153×712 | ❌ 153px | โปร่งใส (7.4% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Green Mango | 2 | ✅ มี | 154×713 | ❌ 154px | โปร่งใส (8% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Mixberry | 2 | ✅ มี | 153×712 | ❌ 153px | โปร่งใส (7.4% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Passion Fruit | 2 | ✅ มี | 156×713 | ❌ 156px | โปร่งใส (9.1% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Peach Strawberry | 2 | ✅ มี | 153×713 | ❌ 153px | โปร่งใส (7.5% ของพิกเซล) |
| `relx-smash-go-12k` | รส: Watermelon | 2 | ✅ มี | 153×713 | ❌ 153px | โปร่งใส (7.5% ของพิกเซล) |
| `relx-smash-go-12k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: American Cookies <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Blueberry Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Cola Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Cola Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Cool Mint Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Funta Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Grape Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Green Apple Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Hokkaido Melon Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Lemon Tea <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Lychee Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Orange Soda <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Passion Fruit <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Rainbow Candy <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Strawberry Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | รส: Watermelon Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Double Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Grape Apple <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Hami Melon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Mix Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Rainbow Candy <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Sakura Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Grape Apple <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Grape Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Mixberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Sparkling Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Strawberry Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Watermelon Lychee <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Apple Aloevera <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Blueberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Grape Aloevera <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Mineral Water <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Strawberry Banana <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Strawberry Kiwi <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | รส: Yoyo Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `infy-20k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Grape | 2 | ✅ มี | 520×1120 | ❌ 520px | ทึบ (ไม่มี alpha) |
| `mood-monster-14k` | รส: Watermelon | 2 | ✅ มี | 520×1120 | ❌ 520px | ทึบ (ไม่มี alpha) |
| `mood-monster-14k` | รส: Blueberry | 2 | ✅ มี | 520×1120 | ❌ 520px | ทึบ (ไม่มี alpha) |
| `mood-monster-14k` | รส: Lemon Tea | 2 | ✅ มี | 520×1120 | ❌ 520px | ทึบ (ไม่มี alpha) |
| `mood-monster-14k` | รส: Sugus Apple <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Fanta <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Mango Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Grape N5% <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | รส: Blueberry N5% <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-space-15k` | รส: Extreme Menthol | 2 | ✅ มี | 475×770 | ❌ 475px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | รส: Double Mint | 2 | ✅ มี | 475×770 | ❌ 475px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | รส: Watermelon | 2 | ✅ มี | 475×770 | ❌ 475px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | รส: Very Strawberry | 2 | ✅ มี | 280×410 | ❌ 280px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | รส: Milk Cream | 2 | ✅ มี | 475×770 | ❌ 475px | ทึบ (ไม่มี alpha) |
| `muro-space-15k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | รส: Grape | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Watermelon | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Smooth Mint | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Green Slush | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Mix Berries | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Blueberry Bubblegum | 2 | ✅ มี | 340×490 | ❌ 340px | ทึบ (ไม่มี alpha) |
| `muro-3ml` | รส: Muro Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | รส: Honey Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | รส: Very Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | รส: Double Shisha <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Extreme Menthol <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Honey Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Apple Shisha <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Mineral Water <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Yakult <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | รส: Banana Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Double Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Mix Berries <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Pineapple <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Honey Lemon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Apple Baraku <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Mineral Water <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Yakult <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Banana Strawberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Kyoho Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Pink Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Lemon Jeez <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Cool Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Blue Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Green Tea <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Strawberry Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Vanilla Ice Cream <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | รส: Taro Ice Cream <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Apple Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Grape Aloe <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Blueberry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Cola Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Lychee Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Mix Berry <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Strawberry Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | รส: Red Bull Ice <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `vazer-one-pod` | รส: Cola | 2 | ✅ มี | 405×747 | ❌ 405px | โปร่งใส (2% ของพิกเซล) |
| `vazer-one-pod` | รส: Cola Lemon | 2 | ✅ มี | 405×747 | ❌ 405px | โปร่งใส (12.8% ของพิกเซล) |
| `vazer-one-pod` | รส: Mango | 2 | ✅ มี | 405×747 | ❌ 405px | โปร่งใส (2% ของพิกเซล) |
| `vazer-one-pod` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `reswa-sportcan-12k` | รส: Green Tea | 2 | ✅ มี | 170×390 | ❌ 170px | ทึบ (ไม่มี alpha) |
| `reswa-sportcan-12k` | รส: Oolong Tea | 2 | ✅ มี | 170×390 | ❌ 170px | ทึบ (ไม่มี alpha) |
| `reswa-sportcan-12k` | รส: Ice Cola | 2 | ✅ มี | 170×390 | ❌ 170px | ทึบ (ไม่มี alpha) |
| `reswa-sportcan-12k` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: Razer Black <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: Supreme Red <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: White Lava <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: Aurora <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: Lemon Mint <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | สี: Twilight Sky <br><sub>ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)</sub> | 2 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | รส: Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | รส: Big Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Grape <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Watermelon <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Click Mint <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Strawberry Twist <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Big Cola <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | รส: Peach <br><sub>ไม่มีรูปรสนี้ → แสดงแค่ชื่อ/สี</sub> | 2 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | lineup (All Colors) <br><sub>ไม่มีรูปรวมทุกสี → ไม่มีปุ่ม All Colors</sub> | 2 | ❌ ไม่มี | — | — | — |
| `coil-1` | 0.15Ω | 2 | ✅ มี | 427×471 | ❌ 427px | โปร่งใส (41% ของพิกเซล) |
| `coil-1` | 1.2Ω ยางขาว | 2 | ✅ มี | 551×646 | ❌ 551px | ทึบ (ไม่มี alpha) |
| `coil-1` | 1.2Ω ยางฟ้า | 2 | ✅ มี | 551×646 | ❌ 551px | ทึบ (ไม่มี alpha) |
| `coil-1` | DW60 0.6Ω | 2 | ✅ มี | 501×613 | ❌ 501px | ทึบ (ไม่มี alpha) |
| `coil-38` | TPP-DM2 (0.2Ω) <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `coil-38` | TPP-DM4 (0.3Ω) <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `coil-72` | 0.7 Ω | 2 | ✅ มี | 384×525 | ❌ 384px | ทึบ (ไม่มี alpha) |
| `coil-72` | 1.2 Ω | 2 | ✅ มี | 384×525 | ❌ 384px | ทึบ (ไม่มี alpha) |
| `coil-72` | 0.4 Ω Top Fill เติมบน | 2 | ✅ มี | 376×521 | ❌ 376px | ทึบ (ไม่มี alpha) |
| `coil-72` | 0.7 Ω Top Fill เติมบน | 2 | ✅ มี | 372×521 | ❌ 372px | ทึบ (ไม่มี alpha) |
| `coil-89` | 0.8Ω <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `coil-89` | 1.0Ω <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `coil-94` | 0.4Ω | 2 | ✅ มี | 144×315 | ❌ 144px | ทึบ (ไม่มี alpha) |
| `coil-94` | 0.6Ω | 2 | ✅ มี | 493×385 | ❌ 385px | โปร่งใส (25.2% ของพิกเซล) |
| `coil-94` | 0.9Ω | 2 | ✅ มี | 493×385 | ❌ 385px | โปร่งใส (26% ของพิกเซล) |
| `coil-94` | 1.2Ω | 2 | ✅ มี | 530×358 | ❌ 358px | ทึบ (ไม่มี alpha) |
| `iqosheet-14` | Red | 2 | ✅ มี | 186×398 | ❌ 186px | ทึบ (ไม่มี alpha) |
| `iqosheet-14` | Gold | 2 | ✅ มี | 147×410 | ❌ 147px | ทึบ (ไม่มี alpha) |
| `iqosheet-16` | Midnight Black | 2 | ✅ มี | 1772×1492 | ✅ ผ่าน | โปร่งใส (63.8% ของพิกเซล) |
| `iqosheet-16` | Breeze Blue | 2 | ✅ มี | 1772×1494 | ✅ ผ่าน | โปร่งใส (63.8% ของพิกเซล) |
| `iqosheet-16` | Aspen Green | 2 | ✅ มี | 1772×1494 | ✅ ผ่าน | โปร่งใส (63.7% ของพิกเซล) |
| `iqosheet-18` | Midnight Black | 2 | ✅ มี | 1613×1550 | ✅ ผ่าน | โปร่งใส (57.2% ของพิกเซล) |
| `iqosheet-18` | Breeze Blue | 2 | ✅ มี | 1613×1550 | ✅ ผ่าน | โปร่งใส (57.2% ของพิกเซล) |
| `pod-159` | Cool Mint <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Cola <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Apple Aloe <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Blueberry Jam <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Blueberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Chocolate Mint <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Coconut <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Extra Menthol <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Grape <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Honeydew <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Lychee <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Mango <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Mix Berry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Pineapple <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Pink Guava <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Strawberry Banana <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Strawberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Watermelon Ice <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Watermelon Lime <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-159` | Yogurt <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Grape Jelly <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Grape Gummies <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Grape Bubblegum <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Grape Apple <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Strawberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Strawberry Grape <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Blueberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-169` | Lychee Raspberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Grape Ice <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Grape Lychee <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Mint <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Watermelon Ice <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Mixberry <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Strawberry Watermelon <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Strawberry Custard <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Watermelon Bubblegum <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | White Slush <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |
| `pod-180` | Strawberry Kiwi <br><sub>ไม่มีรูปเฉพาะ → ใช้รูปการ์ดแทน</sub> | 2 | ❌ ไม่มี | — | — | — |

### 3 หน้าหลัก (13 แถว)

| slug | รายการ | ชั้น | มี/ไม่มี | ขนาดจริง px | ด้านสั้น ≥1000px | โปร่งใสไหม |
|---|---|---|---|---|---|---|
| `(หน้าหลัก)` | cinematic Scene2 (UWELL) — Caliburn G5 | 3 | ✅ มี | 255×785 | ❌ 255px | โปร่งใส (51.1% ของพิกเซล) |
| `(หน้าหลัก)` | cinematic Scene2 (UWELL) — Caliburn G4 Pro KOKO | 3 | ✅ มี | 541×862 | ❌ 541px | โปร่งใส (43.4% ของพิกเซล) |
| `(หน้าหลัก)` | cinematic Scene3 (VOOPOO) — ARGUS G4 | 3 | ✅ มี | 118×519 | ❌ 118px | โปร่งใส (12.3% ของพิกเซล) |
| `(หน้าหลัก)` | cinematic Scene3 (VOOPOO) — DRAG 6 | 3 | ✅ มี | 205×476 | ❌ 205px | โปร่งใส (51.8% ของพิกเซล) |
| `(หน้าหลัก)` | cinematic Scene4 (Hero) — M Bar 10K | 3 | ✅ มี | 463×925 | ❌ 463px | โปร่งใส (55.9% ของพิกเซล) |
| `(หน้าหลัก)` | cinematic Scene4 (Hero) — M Bar 15K | 3 | ✅ มี | 457×877 | ❌ 457px | โปร่งใส (62.5% ของพิกเซล) |
| `(หน้าหลัก)` | โลโก้ (Header/Footer/Intro/Finale) | 3 | ✅ มี | 568×480 | ❌ 480px | โปร่งใส (51.5% ของพิกเซล) |
| `caliburn-g5` | flagship rail/hero (ใช้รูปการ์ดชั้น 1) | 3 | ✅ มี | 255×785 | ❌ 255px | โปร่งใส (51.1% ของพิกเซล) |
| `argus-g4` | flagship rail/hero (ใช้รูปการ์ดชั้น 1) | 3 | ✅ มี | 118×519 | ❌ 118px | โปร่งใส (12.3% ของพิกเซล) |
| `m-bar-10k` | flagship rail/hero (ใช้รูปการ์ดชั้น 1) | 3 | ✅ มี | 463×925 | ❌ 463px | โปร่งใส (55.9% ของพิกเซล) |
| `relx-smash-go-12k` | flagship rail/hero (ใช้รูปการ์ดชั้น 1) | 3 | ✅ มี | 153×712 | ❌ 153px | โปร่งใส (7.4% ของพิกเซล) |
| `(ไอคอนเว็บ)` | src/app/icon.png <br><sub>ไอคอน — เกณฑ์ 1000px ไม่ใช้กับไอคอน</sub> | 3 | ✅ มี | 512×512 | ไม่ใช้เกณฑ์นี้ | โปร่งใส (null% ของพิกเซล) |
| `(ไอคอนเว็บ)` | src/app/apple-icon.png <br><sub>ไอคอน — เกณฑ์ 1000px ไม่ใช้กับไอคอน</sub> | 3 | ✅ มี | 180×180 | ไม่ใช้เกณฑ์นี้ | ทึบ (ไม่มี alpha) |

### 4 แกลเลอรี (72 แถว)

| slug | รายการ | ชั้น | มี/ไม่มี | ขนาดจริง px | ด้านสั้น ≥1000px | โปร่งใสไหม |
|---|---|---|---|---|---|---|
| `caliburn-g5` | gallery #1 | 4 | ✅ มี | 3840×1620 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `caliburn-g5` | gallery #2 | 4 | ✅ มี | 300×562 | ❌ 300px | โปร่งใส (12.5% ของพิกเซล) |
| `caliburn-g5-lite` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g5-lite-se` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-pro-koko` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-pro` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g4` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-mini` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g4-classic` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g3-pro` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `caliburn-g3-pro-koko` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `argus-g4` | gallery #1 | 4 | ✅ มี | 1218×883 | ❌ 883px | โปร่งใส (0.3% ของพิกเซล) |
| `argus-g4` | gallery #2 | 4 | ✅ มี | 768×577 | ❌ 577px | โปร่งใส (71.6% ของพิกเซล) |
| `argus-g4` | gallery #3 | 4 | ✅ มี | 828×661 | ❌ 661px | โปร่งใส (70.7% ของพิกเซล) |
| `argus-g4-mini` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `argus-p3` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `argus-g3-mini` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `drag-6` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `drag-s3` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `drag-x3` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `vinci-s` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `vmate-i3` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `m-bar-10k` | gallery #1 | 4 | ✅ มี | 1920×1229 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `m-bar-10k` | gallery #2 | 4 | ✅ มี | 1920×1085 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `m-bar-10k` | gallery #3 | 4 | ✅ มี | 1920×1096 | ✅ ผ่าน | ทึบ (ไม่มี alpha) |
| `m-bar-9k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `m-bar-15k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `m-switch-kit` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `m-switch-pod` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `m-bar-pod` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `zero-pro` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `zero-nano` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `zero-cartridge` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `relx-smash-go-12k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `relx-creator` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `joiway-f3` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `joiway-f4` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `tfit-m-power-20k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `infy-20k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `mood-monster-14k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-space-15k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-3ml` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-sc-8000` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-connector-20k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `foli-bar-15k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `vazer-one-pod` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `reswa-sportcan-12k` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `next-pro-2-beyond` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-freebase` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `muro-salt-nic` | gallery <br><sub>ไม่มีรูปแกลเลอรี → ส่วน ProductGallery ไม่แสดง</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-1` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-38` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-53` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-55` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-56` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-63` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-68` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-70` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-72` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-74` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-83` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-87` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-89` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-92` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-94` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `iqosheet-14` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `iqosheet-16` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `iqosheet-18` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `pod-159` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `pod-169` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `pod-180` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |
| `coil-54` | gallery <br><sub>ระบบ ProductMaster ยังไม่มีแกลเลอรีในหน้าสินค้า (มีแค่การ์ด + รูปตัวเลือก)</sub> | 4 | ❌ ไม่มี | — | — | — |

## ยอดรวม

| | จำนวน |
|---|---|
| มีและผ่านเกณฑ์ (ด้านสั้น ≥1000px) | **14** |
| มีแต่ต่ำกว่าเกณฑ์ | **273** |
| ไม่มีเลย | **341** (ในนี้ 22 = ระบบไม่รองรับ, 319 = ขาดรูปจริง) |
| พื้นหลังไม่โปร่งใส (ในรูปที่มี) | **53** |
| ไอคอนเว็บ (นอกเกณฑ์) | 2 |
| รวมแถว | 630 |
