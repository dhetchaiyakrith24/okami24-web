// =====================================================================================
//  รายการ "ของหมด" ของร้าน OKami24 — แก้ไฟล์นี้ไฟล์เดียว ไม่ต้องแตะไฟล์อื่น
//
//  วิธีใช้
//   • บรรทัดละ 1 รายการ รูปแบบ:   ชื่อสินค้าในลิงก์ | ชื่อสี หรือ ชื่อรส
//       - "ชื่อสินค้าในลิงก์" คือคำท้ายลิงก์หน้าสินค้า เช่น  okami24.store/products/joiway-f3  →  joiway-f3
//       - "ชื่อสี/ชื่อรส" พิมพ์ตามที่เห็นบนเว็บ ตัวพิมพ์ใหญ่-เล็กไม่สำคัญ
//   • อยู่ในรายการ = หมด (จางลง มีป้าย Out of stock กดเลือก/ใส่ตะกร้าไม่ได้)
//   • ไม่อยู่ในรายการ = มีของ   ·   ของกลับมาแล้วก็ลบบรรทัดนั้นทิ้ง
//   • บรรทัดที่ขึ้นต้นด้วย # เป็นหมายเหตุ ใส่ได้ตามสะดวก
//   • ใช้ได้กับสินค้าทั้งสองแบบบนเว็บ (แคตตาล็อกเดิม และ ProductMaster ที่มาจาก Shipnity)
//   • เช็คว่าพิมพ์ชื่อถูกไหม: เปิด terminal ในโฟลเดอร์โปรเจกต์แล้วพิมพ์  npm run verify:catalog
//     ถ้าพิมพ์ผิด จะบอกบรรทัดที่หาสินค้า/สี/รสไม่เจอ (เว็บยังเปิดได้ปกติ แค่บรรทัดนั้นไม่มีผล)
//
//  ห้ามแก้อะไรนอกจากข้อความระหว่างเครื่องหมาย ` สองตัวข้างล่างนี้
// =====================================================================================

export const SOLD_OUT_LIST = `
# ---- Joiway F3 — 14 รสที่เพิ่มเข้าเว็บ 2026-09-06 ยังไม่มีของ ----
joiway-f3 | Aloe Grape
joiway-f3 | Berries Party
joiway-f3 | Blueberry Lime
joiway-f3 | English Iced Tea
joiway-f3 | Golden Energy
joiway-f3 | Green Tangerine Mint
joiway-f3 | Hokkaido Ice Cream
joiway-f3 | Hokkaido Peach
joiway-f3 | Japanese Sake
joiway-f3 | Thai Ovaltine
joiway-f3 | Thai Tea
joiway-f3 | Virginia Tobacco
joiway-f3 | Vodak
joiway-f3 | Watermelon Orange

# ---- Joiway F4 — ทั้ง 16 คู่รส เพิ่มเข้าเว็บ 2026-09-06 ยังไม่มีของ ----
joiway-f4 | Grape Ice + Lychee Ice
joiway-f4 | Grape Ice + Watermelon Ice
joiway-f4 | Grape Ice + Blueberry Ice
joiway-f4 | Blueberry Ice + Lychee Ice
joiway-f4 | Blueberry Ice + Watermelon Ice
joiway-f4 | Watermelon Ice + Strawberry Ice
joiway-f4 | Watermelon Ice + Lychee Ice
joiway-f4 | Watermelon Ice + Rainbow Candy
joiway-f4 | Cola Ice + Green Apple Ice
joiway-f4 | Cola Ice + Strawberry Ice
joiway-f4 | Green Apple Ice + American Cookies
joiway-f4 | Green Apple Ice + Strawberry Ice
joiway-f4 | Rainbow Candy + Cool Mint Ice
joiway-f4 | Rainbow Candy + Strawberry Ice
joiway-f4 | Lychee Ice + American Cookies
joiway-f4 | Cool Mint Ice + Strawberry Ice

# ---- UWELL Caliburn G4 Pro KOKO — สีที่เพิ่ม 2026-09-06 ยังไม่มีของ ----
caliburn-g4-pro-koko | Golden Carbon
`;
