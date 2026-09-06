import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { canonicalFor } from "@/lib/seo";
import { AgeNote, InfoCard, LineLink, PendingFact, SERVICE_PAGES_UPDATED, ServiceSection, UpdatedAt } from "@/components/content/ServicePage";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md). Channels from BSOT §3 /
// src/data/contact.ts. No contact form on purpose (nobody would be watching it — designer note);
// opening hours and business-entity details are owner questions (PendingFact).
export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อ OKami24 ทางไลน์ @okm24 สอบถามสินค้า ช่วยเลือกรุ่น ติดตาม​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ ส่งสลิป — แอดมินตอบเอง ไม่ใช่บอท",
  ...canonicalFor("/contact"),
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="ติดต่อเรา"
        description="มีเรื่องอยากถาม อยากให้ช่วยเลือกรุ่น หรือตาม​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ ทักมาได้เลย แอดมินตอบเอง"
        meta={
          <div className="flex flex-wrap gap-3">
            <Button href={CONTACT.lineUrl} external className="w-full sm:w-auto">
              ทักไลน์ {CONTACT.lineId}
            </Button>
            <Button href={CONTACT.youtubeUrl} external variant="secondary" className="w-full sm:w-auto">
              YouTube @OKMYARZ
            </Button>
          </div>
        }
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <ServiceSection title="ช่องทางของเรา">
            <div className="flex flex-col gap-3">
              <InfoCard title={<>LINE {CONTACT.lineId} — ช่องทางหลัก</>}>
                <p>สอบถามสินค้า เช็คสต๊อก ให้ช่วยเลือกรุ่น ติดตาม​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ ส่งสลิป แจ้งปัญหา คุยได้หมดทางนี้</p>
                <p>
                  <LineLink>{CONTACT.lineUrl}</LineLink>
                </p>
                <PendingFact question="เวลาทำการ / เวลาที่ตอบไลน์ เช่น “ทุกวัน 10:00–20:00” หรือ “ตอบภายใน X ชั่วโมง”" />
              </InfoCard>
              <InfoCard title="YouTube @OKMYARZ — ดูของจริงก่อนตัดสินใจ">
                <p>รีวิวสินค้าจากเราเอง อยากเห็นตัวจริงก่อนสั่ง เข้าไปดูได้</p>
                <p>
                  <a href={CONTACT.youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-red">
                    {CONTACT.youtubeUrl}
                  </a>
                </p>
              </InfoCard>
              <InfoCard title="สั่งซื้อ — สั่งบนเว็บ">
                <p>เลือกสินค้าใส่ตะกร้าแล้วกดสั่งได้เลย ไม่ต้องทักมาสั่ง ระบบจะออกเลขคำสั่งซื้อและหน้าสถานะให้คุณติดตามเอง ไลน์มีไว้สำหรับสอบถามและช่วยเหลือ</p>
                <p>
                  <Link href="/how-to-order" className="font-semibold text-foreground hover:text-red">
                    ดูวิธีสั่งซื้อทีละขั้น →
                  </Link>
                </p>
              </InfoCard>
            </div>
          </ServiceSection>

          <ServiceSection title="ก่อนทักมา เตรียมอะไร">
            <p>
              ถ้าเป็นเรื่อง​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ที่สั่งไว้แล้ว <strong className="text-foreground">ส่งเลขคำสั่งซื้อมาด้วย</strong> จะเช็คให้ได้เร็วที่สุด
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>ตามของ / ถามสถานะ → เลขคำสั่งซื้อ</li>
              <li>ส่งสลิป → เลขคำสั่งซื้อ + รูปสลิป</li>
              <li>แจ้งของมีปัญหา → เลขคำสั่งซื้อ + คลิปตอนแกะกล่อง</li>
            </ul>
            <p>ถ้าเป็นเรื่องถามสินค้าเฉย ๆ ทักมาได้เลย ไม่ต้องเตรียมอะไร</p>
            <PendingFact question="จะเปิดเผยเบอร์โทร อีเมล ที่อยู่ร้าน หรือชื่อนิติบุคคลบนเว็บไหม — ถ้าจดทะเบียนพาณิชย์อิเล็กทรอนิกส์ กฎหมายไทยกำหนดให้ต้องแสดงข้อมูลผู้ขายบางส่วน ควรเช็คก่อนเปิดร้านจริง" />
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
