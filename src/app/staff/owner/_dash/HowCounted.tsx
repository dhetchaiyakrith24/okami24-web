/** The page's footnotes in one place (designer 08/11): every card stays a number, and the rules are one tap away. */
const LINES = [
  "ยอดเว็บ = ออเดอร์ที่ยืนยันยอดเงินแล้ว นับตามวันที่สั่ง ไม่รวมออเดอร์ที่ยกเลิก",
  "ยอด LINE = สลิปที่เข้าบัญชีร้าน นับตามวันที่โอน ไม่รวมสลิปของออเดอร์เว็บ · หักเงินที่คืนลูกค้าแล้ว ในวันของสลิปนั้น",
  "กำไรเว็บ = ลูกค้าจ่าย หักทุน หักค่าส่งคลัง 35 บาท · ออเดอร์ที่ยังไม่มีทุนไม่นับในกำไร",
  "กำไร LINE มีเฉพาะรายรอบหลังเทียบบิล เพราะสลิปไม่บอกว่าซื้ออะไร จึงไม่มีกำไรรวมรายวัน",
  "รอบบิล = เสาร์ 13:00 ถึงเสาร์ 13:00 · ยอดขาย 7 วันนับตามวัน ตัวเลขสองแบบจึงไม่เท่ากัน",
  "กำไร LINE ของรอบอาจขยับข้ามสัปดาห์ ถ้าลูกค้าโอนก่อนรอบปิดแต่คลังคีย์หลังรอบปิด · เงินคืนทาง LINE หักเมื่อบอทหรือทีมงานจับคู่กับสลิปแล้ว",
  "สินค้าขายดีนับได้เฉพาะเว็บ · ตัวเลข Google ช้ากว่าจริง 2–3 วัน",
  "ช่องที่ขึ้นว่ายังไม่มีข้อมูล = ระบบยังไม่รู้ ไม่ใช่ศูนย์",
];

export function HowCounted() {
  return (
    <details className="group">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
        ตัวเลขนับยังไง
        <span aria-hidden className="transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <ul className="flex flex-col gap-1.5 pb-2 text-sm leading-relaxed text-foreground-muted">
        {LINES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </details>
  );
}
