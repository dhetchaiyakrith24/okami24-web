import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { canonicalFor } from "@/lib/seo";
import {
  AgeNote,
  LineLink,
  NumberedSteps,
  PendingFact,
  PhaseLabel,
  SERVICE_PAGES_UPDATED,
  ServiceSection,
  SummaryCards,
  UpdatedAt,
} from "@/components/content/ServicePage";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md), facts from BSOT §8–§10 and the
// real checkout flow (src/i18n/dictionaries/th.ts checkout/orders). Layout: designer direction A
// ("steps in one column, phase labels between groups, primary CTA in the header").
export const metadata: Metadata = {
  title: "วิธีสั่งซื้อ",
  description:
    "วิธีสั่งซื้อสินค้ากับ OKami24 ทีละขั้น — ใส่ตะกร้า ยืนยันเบอร์ด้วย OTP กรอกที่อยู่ โอนเงิน แจ้งชำระเงิน แล้วรอแอดมินตรวจยอดและจัดส่งพร้อมเลขพัสดุ",
  ...canonicalFor("/how-to-order"),
};

export default function HowToOrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="How to order"
        title="วิธีสั่งซื้อ"
        description="สั่งบนเว็บได้เลย ไม่ต้องทักแชทก่อน ใช้เวลาไม่กี่นาที — ด้านล่างคือทุกขั้นตอนตั้งแต่กดใส่ตะกร้าจนของถึงมือ"
        meta={
          <div className="flex flex-wrap gap-3">
            <Button href="/products">เลือกดูสินค้า</Button>
            <Button href={CONTACT.lineUrl} external variant="secondary">
              ถามก่อนทางไลน์ {CONTACT.lineId}
            </Button>
          </div>
        }
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <SummaryCards
            items={[
              { label: "1 · สั่ง", value: "ใส่ตะกร้า ยืนยันเบอร์ กรอกที่อยู่", note: "ได้เลขคำสั่งซื้อทันที" },
              { label: "2 · จ่าย", value: "โอนธนาคาร หรือสแกน QR", note: "ไม่รับบัตร ไม่มีเก็บเงินปลายทาง" },
              { label: "3 · รับของ", value: "แอดมินตรวจยอด แล้วส่งพร้อมเลขพัสดุ", note: "ค่าส่ง 60 บาท · ฟรีเมื่อ 500 บาทขึ้นไป" },
            ]}
          />

          <ServiceSection title="สั่งซื้อทีละขั้น">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <PhaseLabel>01 · สั่ง</PhaseLabel>
                <NumberedSteps
                  start={1}
                  steps={[
                    {
                      title: "เลือกสินค้าใส่ตะกร้า",
                      body: "เลือกรุ่น สี หรือกลิ่นที่ต้องการ แล้วกด “เพิ่มลงตะกร้า” จะซื้อกี่ชิ้นก็ได้ ปรับจำนวนในตะกร้าได้ตลอด",
                    },
                    {
                      title: "กด “ดำเนินการชำระเงิน”",
                      body: "หน้าตะกร้าจะสรุปยอดสินค้าและค่าส่งให้ดูก่อน ถ้ายอดถึงเกณฑ์ส่งฟรี ระบบจะตัดค่าส่งให้เองตรงนี้",
                    },
                    {
                      title: "ยืนยันเบอร์มือถือ",
                      body: "กรอกเบอร์มือถือ ระบบจะส่งรหัส 6 หลักไปทาง SMS ให้กรอกกลับเข้ามา ขั้นนี้มีไว้ให้แน่ใจว่า​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์เป็นของคุณจริง และให้คุณกลับมาดูสถานะ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ได้ทีหลัง",
                    },
                    {
                      title: "กรอกที่อยู่จัดส่ง",
                      body: "ใส่ชื่อผู้รับ เบอร์ติดต่อ ที่อยู่ ตำบล อำเภอ จังหวัด และรหัสไปรษณีย์ ที่อยู่นี้จะถูกบันทึกไว้ ครั้งหน้าสั่งซ้ำกดเลือกได้เลยไม่ต้องพิมพ์ใหม่",
                    },
                    {
                      title: "ตรวจรายการอีกรอบ แล้วกด “ยืนยันคำสั่งซื้อ”",
                      body: "หน้านี้จะโชว์สินค้า ที่อยู่ และยอดรวมทั้งหมด ดูให้ครบก่อนกด ถ้าจะแก้ที่อยู่ยังกดย้อนกลับได้",
                    },
                    {
                      title: "ได้เลขคำสั่งซื้อ",
                      body: (
                        <>
                          ระบบจะพาไปหน้าสถานะคำสั่งซื้อของ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์คุณโดยเฉพาะ <strong className="text-foreground">เก็บลิงก์หน้านี้ไว้</strong> ใช้ดูความคืบหน้าและใช้อ้างอิงเวลาทักถาม
                        </>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <PhaseLabel>02 · จ่าย</PhaseLabel>
                <NumberedSteps
                  start={7}
                  steps={[
                    {
                      title: "โอนเงิน",
                      body: (
                        <>
                          รายละเอียดบัญชีและ QR จะแสดงในหน้าสถานะคำสั่งซื้อ <strong className="text-foreground">ตอนนี้ระบบยังอยู่ระหว่างจัดเตรียมบัญชี</strong> ถ้าหน้าเว็บยังไม่ขึ้นเลขบัญชี ให้ทักไลน์ <LineLink /> พร้อมเลขคำสั่งซื้อ แอดมินส่งรายละเอียดให้ทันที
                          <br />
                          เรารับโอนธนาคารและสแกน QR เท่านั้น — <strong className="text-foreground">ไม่รับบัตรเครดิต และไม่มีเก็บเงินปลายทาง</strong>
                        </>
                      ),
                    },
                    {
                      title: "กด “แจ้งชำระเงินแล้ว”",
                      body: (
                        <>
                          หลังโอนเสร็จ กลับมาที่หน้าสถานะคำสั่งซื้อแล้วกดปุ่มนี้ ใส่หมายเหตุการโอนได้ถ้ามี ตอนนี้เว็บยังแนบรูปสลิปไม่ได้ ให้ส่งสลิปทางไลน์ <LineLink /> พร้อมเลขคำสั่งซื้อ
                        </>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <PhaseLabel>03 · รับของ</PhaseLabel>
                <p className="text-sm leading-relaxed">
                  แอดมินตรวจยอดเงินที่เข้าจริงก่อน แล้วจึงอนุมัติ แพ็กของ และจัดส่ง — ดูสถานะทีละขั้นได้ด้านล่าง
                </p>
              </div>
            </div>
          </ServiceSection>

          <ServiceSection title="หลังสั่งแล้วเกิดอะไรขึ้น">
            <p>สถานะในหน้าคำสั่งซื้อจะไล่ตามนี้ ดูได้ตลอดว่าถึงขั้นไหนแล้ว</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li><strong className="text-foreground">รอชำระเงิน</strong> — ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์เข้าระบบแล้ว รอคุณโอน</li>
              <li><strong className="text-foreground">แจ้งชำระเงินแล้ว</strong> — คุณกดแจ้งเข้ามาแล้ว</li>
              <li>
                <strong className="text-foreground"><span className="whitespace-nowrap">รอตรวจสอบโดยแอดมิน</span></strong> — แอดมินกำลังเช็คยอดเงินที่เข้าจริง การกดแจ้งว่าจ่ายแล้วยังไม่ใช่การยืนยันอัตโนมัติ ต้องมีคนตรวจก่อนเสมอ
              </li>
              <li><strong className="text-foreground">อนุมัติแล้ว</strong> — ยอดตรง ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ผ่าน</li>
              <li><strong className="text-foreground">กำลังเตรียมจัดส่ง</strong> — แพ็กของอยู่</li>
              <li><strong className="text-foreground">จัดส่งแล้ว</strong> — ส่งออกแล้ว พร้อมเลขพัสดุให้กดติดตาม</li>
              <li><strong className="text-foreground">สำเร็จ</strong> — ของถึงมือคุณแล้ว</li>
            </ul>
            <p>ถ้ามีเหตุต้องยกเลิก ระบบมีสถานะ <strong className="text-foreground">ยกเลิก</strong> รองรับอยู่</p>
            <PendingFact
              question="ลูกค้ายกเลิกเองได้ถึงขั้นไหน โอนแล้วยกเลิกได้ไหม คืนเงินยังไง"
              fallback={<>อยากยกเลิกหรือแก้​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ ทักไลน์ <LineLink /> พร้อมเลขคำสั่งซื้อให้เร็วที่สุด ก่อนที่ของจะถูกส่งออก</>}
            />
          </ServiceSection>

          <ServiceSection title="ก่อนโอน เช็ค 2 อย่าง">
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <strong className="text-foreground">ชื่อบัญชีต้องตรงกับที่แสดงในหน้าสถานะคำสั่งซื้อ</strong> — ถ้ามีคนส่งเลขบัญชีอื่นมาให้ อย่าโอน
              </li>
              <li>
                <strong className="text-foreground">ไลน์ทางการของเรามีชื่อเดียวคือ {CONTACT.lineId}</strong> — เช็คได้จากปุ่มไลน์ท้ายเว็บนี้ทุกหน้า
              </li>
            </ul>
          </ServiceSection>

          <ServiceSection title="ถ้าติดตรงไหน">
            <p>
              ทักไลน์ <LineLink /> ได้เลย บอกเลขคำสั่งซื้อมาด้วยจะเร็วที่สุด แอดมินตอบเอง ไม่ใช่บอท ช่วยเช็คสต๊อก ช่วยเลือกรุ่น ตาม​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ ส่งสลิป — เรื่องพวกนี้คุยทางไลน์ได้หมด
            </p>
            <p>ส่วนการสั่งซื้อจริง ให้สั่งบนเว็บ ระบบจะออกเลขคำสั่งซื้อและเก็บประวัติไว้ให้ทั้งสองฝั่ง</p>
            <p className="text-sm">
              อ่านต่อ: <Link href="/shipping" className="text-foreground hover:text-red">การจัดส่ง</Link> · <Link href="/contact" className="text-foreground hover:text-red">ติดต่อเรา</Link> · <Link href="/faq" className="text-foreground hover:text-red">คำถามที่พบบ่อย</Link>
            </p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
