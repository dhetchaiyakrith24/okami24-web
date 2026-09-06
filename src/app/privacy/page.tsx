import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";
import { AgeNote, LineLink, PendingFact, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md). Written from what the code
// actually stores (src/lib/db/migrations/0001_init.sql: phone, recipient name/phone, address,
// order lines; OTP hashed+salted) and what runs in the browser (session cookie, locale cookie,
// age flag + favorites in localStorage; no analytics/ad pixels in the codebase as of 2026-09-06).
// Retention period and the PDPA controller identity are owner questions (PendingFact).
export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัว OKami24 — เก็บอะไร ใช้ทำอะไร แชร์ให้ใคร และวิธีขอดู แก้ หรือลบข้อมูลของคุณตาม PDPA",
  ...canonicalFor("/privacy"),
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy policy"
        title="ความเป็นส่วนตัว"
        description="เราเก็บข้อมูลอะไรของคุณบ้าง เอาไปทำอะไร และคุณขอให้ลบได้ยังไง — เขียนไว้ตรง ๆ ไม่ใช่ภาษากฎหมายให้งง"
        meta={<UpdatedAt date={SERVICE_PAGES_UPDATED} />}
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <SummaryCards
            items={[
              { label: "เก็บอะไร", value: "เบอร์ ชื่อผู้รับ ที่อยู่ รายการสั่งซื้อ", note: "เท่าที่จำเป็นต่อการส่งของ" },
              { label: "ใช้ทำอะไร", value: "ยืนยันตัวตน จัดส่ง ติดต่อกลับ", note: "แค่ 3 อย่างนี้" },
              { label: "ขายข้อมูลไหม", value: "ไม่ขาย ไม่แลกกับใคร", note: "ไม่มีพิกเซลโฆษณาในเว็บ" },
            ]}
          />

          <p className="text-base leading-relaxed text-foreground-muted">
            หน้านี้บอกว่าเว็บ OKami24 เก็บข้อมูลอะไรของคุณจริง ๆ เอาไปทำอะไร และคุณมีสิทธิ์อะไรบ้าง เราเขียนตามที่ระบบทำจริง ไม่ได้ก๊อปนโยบายมาตรฐานมาแปะ
          </p>

          <ServiceSection title="1. ข้อมูลที่เราเก็บ">
            <p>ตอนคุณสั่งซื้อ เราเก็บเท่าที่จำเป็นต่อการส่งของ</p>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>เบอร์มือถือที่ใช้ยืนยันตัวตน (รหัส OTP เก็บแบบเข้ารหัสทางเดียว — แม้แต่เราก็อ่านย้อนกลับไม่ได้)</li>
              <li>ชื่อผู้รับ และเบอร์ติดต่อผู้รับ</li>
              <li>ที่อยู่จัดส่ง</li>
              <li>รายการสินค้าและยอดเงินในคำสั่งซื้อ</li>
              <li>หมายเหตุการโอนที่คุณกรอกเอง (ถ้ากรอก)</li>
            </ul>
            <p>เราไม่เก็บข้อมูลบัตรเครดิต เพราะเราไม่รับบัตรตั้งแต่แรก</p>
          </ServiceSection>

          <ServiceSection title="2. คุกกี้และข้อมูลในเบราว์เซอร์">
            <ul className="flex flex-col gap-1.5 text-sm">
              <li><strong className="text-foreground">คุกกี้เซสชัน</strong> — จำว่าคุณล็อกอินอยู่ ตะกร้าใบไหนของใคร ไม่มีอันนี้เว็บทำงานไม่ได้</li>
              <li><strong className="text-foreground">คุกกี้ภาษา</strong> (okami24_locale) — จำว่าคุณเลือกภาษาไหน</li>
              <li><strong className="text-foreground">ค่าจำว่ายืนยันอายุแล้ว</strong> — เก็บในเครื่องคุณ จะได้ไม่ต้องกดยืนยันอายุซ้ำทุกครั้ง</li>
              <li><strong className="text-foreground">รายการโปรดและรายการเปรียบเทียบ</strong> — เก็บในเครื่องคุณ ไม่ได้ส่งขึ้นเซิร์ฟเวอร์</li>
            </ul>
            <p>
              ตอนนี้เว็บเรา <strong className="text-foreground">ไม่มี Google Analytics และไม่มีพิกเซลติดตามโฆษณา</strong> เราไม่ได้ตามดูว่าคุณไปไหนต่อ
            </p>
          </ServiceSection>

          <ServiceSection title="3. เอาข้อมูลไปทำอะไร">
            <p>ใช้ 3 อย่างเท่านั้น</p>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>ยืนยันว่าคนสั่งเป็นคุณจริง</li>
              <li>จัดส่งสินค้าไปให้ถูกที่</li>
              <li>ติดต่อกลับเรื่อง​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ของคุณ</li>
            </ul>
            <p>ไม่ได้เอาไปทำอย่างอื่น ไม่ส่งโฆษณาไล่ตามคุณ</p>
          </ServiceSection>

          <ServiceSection title="4. เราส่งข้อมูลให้ใครบ้าง">
            <ul className="flex flex-col gap-1.5 text-sm">
              <li><strong className="text-foreground">บริษัทขนส่ง</strong> — ชื่อผู้รับ ที่อยู่ และเบอร์ติดต่อ เพราะไม่ส่งให้เขาก็ส่งของไม่ได้</li>
              <li><strong className="text-foreground">ระบบจัดการสต๊อกและ​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ของร้าน</strong> — ใช้เตรียมของและตามสถานะ</li>
            </ul>
            <p>
              นอกจากนี้ไม่มี <strong className="text-foreground">เราไม่ขายข้อมูลของคุณ และไม่แลกกับใคร</strong>
            </p>
          </ServiceSection>

          <ServiceSection title="5. เก็บไว้นานแค่ไหน">
            <PendingFact
              question="เก็บข้อมูล​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์และที่อยู่ไว้กี่ปี (ปกติร้านค้าเก็บตามอายุเอกสารทางบัญชี แต่ต้องยืนยันตัวเลขจริงก่อน)"
              fallback={<>เราเก็บข้อมูลคำสั่งซื้อไว้เท่าที่จำเป็นต่อการจัดส่ง การติดตาม​อ⁠อ⁠เ⁠ด⁠อ⁠ร⁠์ และการเคลม (7 วันหลังได้รับของ) ถ้าต้องการให้ลบก่อนหน้านั้น ทักไลน์ <LineLink /> ได้ทุกเมื่อ</>}
            />
          </ServiceSection>

          <ServiceSection title="6. สิทธิ์ของคุณ">
            <p>ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) คุณมีสิทธิ์</p>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>ขอดูข้อมูลที่เรามีเกี่ยวกับคุณ</li>
              <li>ขอให้แก้ไขถ้าข้อมูลไม่ถูกต้อง</li>
              <li>ขอให้ลบข้อมูล</li>
              <li>ขอให้หยุดใช้ข้อมูล</li>
            </ul>
            <p>
              ใช้สิทธิ์ได้โดยทักไลน์ <LineLink /> บอกว่าต้องการอะไร แล้วแจ้งเบอร์ที่ใช้สั่งซื้อเพื่อยืนยันตัวตน
            </p>
            <PendingFact
              question="ชื่อผู้ควบคุมข้อมูล (ชื่อร้าน/นิติบุคคล) · ช่องทางทางการนอกจากไลน์ เช่น อีเมล · มีเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ไหม — PDPA กำหนดให้ระบุตัวผู้ควบคุมข้อมูลและช่องทางติดต่อ ไลน์อย่างเดียวอาจไม่พอ ควรถามคนที่รู้กฎหมายก่อนเปิดจริง"
              fallback={<>ผู้ควบคุมข้อมูล: OKami24 · ช่องทางติดต่อเรื่องข้อมูลส่วนบุคคล: LINE <LineLink /></>}
            />
          </ServiceSection>

          <ServiceSection title="7. อายุผู้ใช้">
            <p>เว็บไซต์นี้จัดทำสำหรับผู้มีอายุ 21 ปีขึ้นไป เราไม่ตั้งใจเก็บข้อมูลของผู้ที่อายุน้อยกว่านั้น ถ้าพบว่ามีข้อมูลแบบนั้นเข้ามา เราจะลบทิ้ง</p>
          </ServiceSection>

          <ServiceSection title="8. ถ้าหน้านี้มีการแก้ไข">
            <p>เราจะอัปเดตวันที่ท้ายหน้าทุกครั้งที่แก้ ถ้าเป็นการเปลี่ยนที่มีผลกับคุณจริง ๆ เราจะแจ้งให้ทราบ</p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
